// src/services/store.js
import { reactive } from 'vue'
import { db, storage } from './firebase'
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'

const STORAGE_KEY = 'udg_reportes_mantenimiento_data_v1'
const USER_KEY = 'udg_reportes_user_v1'

const REPORTS_COLLECTION = 'reports'
const LOGS_COLLECTION = 'logs'

export const store = reactive({
  reports: [],
  currentUser: {
    nombre: 'Pedro Pablo Rodríguez',
    correo: 'pedro.rodriguez@udgvirtual.udg.mx',
    rol: 'solicitante'
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

  setRole(newRole) {
    this.currentUser.rol = newRole
    if (newRole === 'tecnico') {
      this.currentUser.nombre = 'Juan Javier Manzo (Técnico)'
      this.currentUser.correo = 'juan.manzo@udgvirtual.udg.mx'
    } else if (newRole === 'admin') {
      this.currentUser.nombre = 'Paulo Antonio Iñiguez (Admin / PO)'
      this.currentUser.correo = 'paulo.iniguez@udgvirtual.udg.mx'
    } else {
      this.currentUser.nombre = 'Pedro Pablo Rodríguez (Solicitante)'
      this.currentUser.correo = 'pedro.rodriguez@udgvirtual.udg.mx'
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

  updateStatus(reportId, newStatus, notas = '') {
    const report = this.reports.find(r => r.id === reportId)
    if (!report) return false
    report.estado = newStatus
    // Puedes extender esta función para actualizar Firestore con updateDoc igual que createReport
    return true
  }
})

// Iniciar listener
store.initRealtimeSync()