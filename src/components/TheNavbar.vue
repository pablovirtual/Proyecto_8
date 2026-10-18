<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo y Nombre Institucional -->
        <div class="flex items-center gap-3">
          <router-link to="/" class="flex items-center gap-2.5 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 tracking-tight text-base sm:text-lg">UDGVirtual</span>
                <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Prototipo</span>
              </div>
              <p class="text-[11px] text-slate-500 hidden sm:block">Reporte y Gestión de Fallas en Instalaciones</p>
            </div>
          </router-link>
        </div>

        <!-- Navegación Escritorio -->
        <nav class="hidden md:flex items-center gap-1">
          <router-link
            to="/"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.name === 'dashboard' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            Inicio
          </router-link>

          <router-link
            to="/tablero"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.name === 'tablero' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            Tablero de Fallas
          </router-link>

          <router-link
            to="/estadisticas"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.name === 'estadisticas' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            Estadísticas
          </router-link>

          <router-link
            to="/reportar"
            class="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Reporte
          </router-link>
        </nav>

        <!-- Selector de Rol para Demostración -->
        <div class="flex items-center gap-2">
          <div class="relative">
            <label class="sr-only">Seleccionar Rol</label>
            <div class="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-0.5 text-xs font-medium">
              <button
                @click="store.setRole('solicitante')"
                :class="[
                  'px-2.5 py-1.5 rounded-md transition-all',
                  store.currentUser.rol === 'solicitante'
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                title="Perfil de alumno / docente para reportar"
              >
                Solicitante
              </button>
              <button
                @click="store.setRole('tecnico')"
                :class="[
                  'px-2.5 py-1.5 rounded-md transition-all',
                  store.currentUser.rol === 'tecnico'
                    ? 'bg-white text-blue-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                title="Perfil de técnico de mantenimiento"
              >
                Técnico
              </button>
              <button
                @click="store.setRole('admin')"
                :class="[
                  'px-2.5 py-1.5 rounded-md transition-all',
                  store.currentUser.rol === 'admin'
                    ? 'bg-white text-purple-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                title="Perfil de administrador general"
              >
                Admin
              </button>
            </div>
          </div>

          <!-- Botón Menú Móvil -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Menú desplegable Móvil -->
    <div v-if="mobileOpen" class="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
      <router-link
        to="/"
        @click="mobileOpen = false"
        class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
      >
        Inicio
      </router-link>
      <router-link
        to="/tablero"
        @click="mobileOpen = false"
        class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
      >
        Tablero de Fallas
      </router-link>
      <router-link
        to="/estadisticas"
        @click="mobileOpen = false"
        class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
      >
        Estadísticas e Historial
      </router-link>
      <router-link
        to="/reportar"
        @click="mobileOpen = false"
        class="block w-full text-center px-4 py-2.5 rounded-lg text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
      >
        + Nuevo Reporte
      </router-link>

      <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
        <span>Usuario actual: <strong class="text-slate-700">{{ store.currentUser.nombre }}</strong></span>
        <button
          @click="resetDemo"
          class="text-red-600 hover:underline text-[11px]"
        >
          Reiniciar datos demo
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '../services/store'

const mobileOpen = ref(false)

function resetDemo() {
  if (confirm('¿Restablecer los reportes de demostración iniciales?')) {
    store.resetDefaults()
    alert('Datos restablecidos a la configuración inicial.')
  }
}
</script>
