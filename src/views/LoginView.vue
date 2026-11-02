<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <!-- Encabezado Institucional -->
      <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-center text-white relative overflow-hidden">
        <div class="relative z-10 flex flex-col items-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight">Iniciar Sesión</h1>
          <p class="text-xs sm:text-sm text-slate-300 mt-1">
            Sistema de Reporte y Gestión de Fallas &bull; UDGVirtual
          </p>
        </div>
        <div class="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none"></div>
      </div>

      <!-- Formulario de Acceso -->
      <form @submit.prevent="handleLogin" class="p-6 sm:p-8 space-y-5">
        <!-- Mensaje de Error -->
        <div
          v-if="errorMessage"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5"
        >
          <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Correo Electrónico -->
        <div>
          <label for="email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Correo Institucional
          </label>
          <div class="relative">
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="usuario@udgvirtual.udg.mx"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        <!-- Contraseña -->
        <div>
          <label for="password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Contraseña
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder-slate-400 transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium focus:outline-none"
            >
              {{ showPassword ? 'Ocultar' : 'Ver' }}
            </button>
          </div>
        </div>

        <!-- Botón de Envío -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <svg
            v-if="isLoading"
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Autenticando...' : 'Ingresar a la Plataforma' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/services/firebase.js'
import { store } from '@/services/store.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // 1. Autenticar con Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )
    const firebaseUser = userCredential.user

    // 2. Consultar el documento del usuario en la colección 'users' de Firestore para extraer 'rol'
    let userData = null
    const userDocRef = doc(db, 'users', firebaseUser.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      userData = userDocSnap.data()
    } else {
      // Búsqueda de respaldo por correo/email si el documento en 'users' no usa el UID como ID
      const qCorreo = query(
        collection(db, 'users'),
        where('correo', '==', firebaseUser.email)
      )
      const snapCorreo = await getDocs(qCorreo)

      if (!snapCorreo.empty) {
        userData = snapCorreo.docs[0].data()
      } else {
        const qEmail = query(
          collection(db, 'users'),
          where('email', '==', firebaseUser.email)
        )
        const snapEmail = await getDocs(qEmail)
        if (!snapEmail.empty) {
          userData = snapEmail.docs[0].data()
        }
      }
    }

    if (!userData || !userData.rol) {
      throw new Error('USER_ROLE_NOT_FOUND')
    }

    const rol = String(userData.rol).toLowerCase()

    // 3. Actualizar el store con el estado real de la sesión y el rol obtenido
    store.setSession({
      uid: firebaseUser.uid,
      correo: userData.correo || userData.email || firebaseUser.email,
      nombre:
        userData.nombre ||
        userData.name ||
        firebaseUser.displayName ||
        firebaseUser.email.split('@')[0],
      rol
    })

    // 4. Redirigir según el rol del usuario
    if (rol === 'solicitante') {
      router.push({ name: 'reportar' })
    } else if (rol === 'tecnico' || rol === 'admin') {
      router.push({ name: 'tablero' })
    } else {
      router.push({ name: 'reportar' })
    }
  } catch (error) {
    console.error('Error de inicio de sesión:', error)
    if (error.message === 'USER_ROLE_NOT_FOUND') {
      errorMessage.value = 'El usuario autenticado no tiene un perfil o rol asignado en la colección users de Firestore.'
    } else if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      errorMessage.value = 'Credenciales incorrectas. Verifica tu correo y contraseña.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage.value = 'Demasiados intentos fallidos. Intenta nuevamente más tarde.'
    } else {
      errorMessage.value = 'No fue posible iniciar sesión. Verifica tu conexión o configuración de Firebase.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

