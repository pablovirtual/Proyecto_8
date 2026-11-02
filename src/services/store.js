// src/services/store.js
import { reactive } from 'vue'
import { db, auth } from '@/services/firebase.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore'

const REPORTS_COLLECTION = 'reports'
const LOGS_COLLECTION = 'logs'
const USERS_COLLECTION = 'users'

let authInitPromise = null

export const store = reactive({
  reports: [],
  user: null,
  rol: null,
  isAuthenticated: false,
  authReady: false,
  currentUser: {
    uid: null,
    nombre: '',
    correo: '',
    rol: null
  },

  // Actualiza el estado de sesión y rol en el store
  setSession(userData) {
    if (!userData) {
      this.clearSession()
      return
    }
    const rol = (userData.rol || 'solicitante').toLowerCase()
    const correo = userData.correo || userData.email || ''
    const nombre =
      userData.nombre ||
      userData.displayName ||
      (correo ? correo.split('@')[0] : 'Usuario')

    this.user = {
      uid: userData.uid,
      email: correo,
      nombre,
      rol
    }
    this.rol = rol
    this.isAuthenticated = true
    this.currentUser = {
      uid: userData.uid,
      nombre,
      correo,
      rol
    }
  },

  // Limpia el estado de sesión al cerrar sesión
  clearSession() {
    this.user = null
    this.rol = null
    this.isAuthenticated = false
    this.currentUser = {
      uid: null,
      nombre: '',
      correo: '',
      rol: null
    }
  },

  // Consulta el documento del usuario en la colección 'users' de Firestore
  async fetchUserProfile(firebaseUser) {
    if (!firebaseUser) return null

    let userData = null

    try {
      // 1. Intentar obtener el documento por UID: users/{uid}
      const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        userData = userDocSnap.data()
      } else if (firebaseUser.email) {
        // 2. Respaldo: buscar por campo 'correo' o 'email' si el ID del documento no es el UID
        const qCorreo = query(
          collection(db, USERS_COLLECTION),
          where('correo', '==', firebaseUser.email)
        )
        const snapCorreo = await getDocs(qCorreo)

        if (!snapCorreo.empty) {
          userData = snapCorreo.docs[0].data()
        } else {
          const qEmail = query(
            collection(db, USERS_COLLECTION),
            where('email', '==', firebaseUser.email)
          )
          const snapEmail = await getDocs(qEmail)
          if (!snapEmail.empty) {
            userData = snapEmail.docs[0].data()
          }
        }
      }
    } catch (error) {
      console.error('Error al consultar el perfil del usuario en Firestore:', error)
    }

    const rol = userData?.rol ? String(userData.rol).toLowerCase() : 'solicitante'
    const profile = {
      uid: firebaseUser.uid,
      correo: userData?.correo || userData?.email || firebaseUser.email || '',
      nombre:
        userData?.nombre ||
        userData?.name ||
        firebaseUser.displayName ||
        (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Usuario'),
      rol
    }

    this.setSession(profile)
    return profile
  },

  // Inicializa el listener de estado de autenticación de Firebase
  initAuth() {
    if (authInitPromise) return authInitPromise

    authInitPromise = new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Si aún no se ha cargado el rol para este usuario, consultarlo en Firestore
          if (!this.isAuthenticated || this.currentUser.uid !== firebaseUser.uid || !this.currentUser.rol) {
            await this.fetchUserProfile(firebaseUser)
          }
        } else {
          this.clearSession()
        }
        this.authReady = true
        resolve(this.currentUser)
      })
    })

    return authInitPromise
  },

  // Cerrar sesión en Firebase Auth y limpiar store
  async logout() {
    await signOut(auth)
    this.clearSession()
  },

  // Inicializar sincronización en tiempo real con Firestore
  initRealtimeSync() {
    try {
      const q = query(collection(db, REPORTS_COLLECTION), orderBy('createdAt', 'desc'))
      onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          this.reports = snapshot.docs.map(docSnap => docSnap.data())
        }
      })
    } catch (err) {
      console.warn('Modo offline:', err)
    }
  },

  // Creación de reporte sincronizada con Cloud Firestore
  async createReport(data) {
    const nextNum = this.reports.length + 1
    const newId = `REP-2026-${String(nextNum).padStart(3, '0')}`
    const now = new Date().toISOString()

    const initialLog = {
      id: `LOG-${Date.now()}`,
      reportId: newId,
      fecha: now,
      autor: `${this.currentUser.nombre} (${this.currentUser.rol})`,
      accion: `Reporte registrado con severidad ${data.severidad}.`
    }

    const newReport = {
      id: newId,
      titulo: data.titulo,
      descripcion: data.descripcion,
      categoria: data.categoria || 'otros',
      severidad: data.severidad || 'Media',
      estado: 'Pendiente',
      ubicacion: {
        edificio: data.ubicacion.edificio,
        piso: data.ubicacion.piso,
        aula: data.ubicacion.aula
      },
      fotos: data.fotos || [],
      solicitante: {
        nombre: this.currentUser.nombre,
        correo: this.currentUser.correo,
        rol: this.currentUser.rol
      },
      tecnicoAsignado: null,
      notasTecnicas: '',
      createdAt: now,
      updatedAt: now,
      auditLogs: [initialLog]
    }

    // Actualizar estado local inmediatamente
    this.reports.unshift(newReport)

    // Persistir de forma atómica en Cloud Firestore
    try {
      await setDoc(doc(db, REPORTS_COLLECTION, newId), newReport)
      await setDoc(doc(db, LOGS_COLLECTION, initialLog.id), initialLog)
      console.log('Reporte guardado exitosamente en Firebase:', newId)
    } catch (e) {
      console.error('Error al guardar en Firestore:', e)
    }

    return newReport
  },

  async updateStatus(reportId, newStatus, notas = '') {
    const report = this.reports.find(r => r.id === reportId)
    if (!report) return false

    const now = new Date().toISOString()
    report.estado = newStatus
    report.updatedAt = now
    if (newStatus === 'Resuelto') {
      report.resolvedAt = now
    }
    if (notas && notas.trim()) {
      report.notasTecnicas = report.notasTecnicas
        ? `${notas.trim()}\n${report.notasTecnicas}`
        : notas.trim()
    }

    const logEntry = {
      id: `LOG-${Date.now()}`,
      reportId,
      fecha: now,
      autor: `${this.currentUser.nombre} (${this.currentUser.rol})`,
      accion: notas && notas.trim()
        ? `Estado actualizado a "${newStatus}". Nota: ${notas.trim()}`
        : `Estado actualizado a "${newStatus}".`
    }
    if (!Array.isArray(report.auditLogs)) {
      report.auditLogs = []
    }
    report.auditLogs.unshift(logEntry)

    try {
      await updateDoc(doc(db, REPORTS_COLLECTION, reportId), {
        estado: report.estado,
        updatedAt: report.updatedAt,
        resolvedAt: report.resolvedAt || null,
        notasTecnicas: report.notasTecnicas,
        auditLogs: report.auditLogs
      })
      await setDoc(doc(db, LOGS_COLLECTION, logEntry.id), logEntry)
    } catch (e) {
      console.error('Error al actualizar estado en Firestore:', e)
    }

    return true
  },

  async assignTechnician(reportId, techName) {
    const report = this.reports.find(r => r.id === reportId)
    if (!report) return false

    const now = new Date().toISOString()
    report.tecnicoAsignado = { nombre: techName }
    report.updatedAt = now

    const logEntry = {
      id: `LOG-${Date.now()}`,
      reportId,
      fecha: now,
      autor: `${this.currentUser.nombre} (${this.currentUser.rol})`,
      accion: `Técnico asignado: ${techName}.`
    }
    if (!Array.isArray(report.auditLogs)) {
      report.auditLogs = []
    }
    report.auditLogs.unshift(logEntry)

    try {
      await updateDoc(doc(db, REPORTS_COLLECTION, reportId), {
        tecnicoAsignado: report.tecnicoAsignado,
        updatedAt: report.updatedAt,
        auditLogs: report.auditLogs
      })
      await setDoc(doc(db, LOGS_COLLECTION, logEntry.id), logEntry)
    } catch (e) {
      console.error('Error al asignar técnico en Firestore:', e)
    }

    return true
  }
})

// Iniciar listeners
store.initAuth()
store.initRealtimeSync()
