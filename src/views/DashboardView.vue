<template>
  <div class="space-y-8">
    <!-- Banner Principal -->
    <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
          <span>Universidad de Guadalajara</span> &bull; <span>Proyecto VIII</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Plataforma de Reporte de Fallas en Instalaciones
        </h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          Canal formal y estructurado para registrar incidencias de infraestructura, coordinar al equipo técnico y mantener un registro histórico para mantenimiento preventivo.
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <router-link
            to="/reportar"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Registrar Incidencia (< 1 min)
          </router-link>

          <router-link
            to="/tablero"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all border border-white/10"
          >
            Ver Tablero de Fallas
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Decoración gráfica de fondo -->
      <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
    </div>

    <!-- Indicador de Rol Activo para evaluación docente / demostración -->
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-sm">
      <div class="flex items-center gap-2.5">
        <span class="text-xl">👤</span>
        <div>
          <span class="font-bold">Modo de Demostración Activo:</span>
          Estás interactuando como
          <span class="font-semibold underline uppercase">{{ store.currentUser.rol }}</span>
          ({{ store.currentUser.nombre }}).
        </div>
      </div>
      <div class="text-xs text-amber-700">
        Cambia de rol en la barra superior para probar los flujos de Solicitante, Técnico y Administrador.
      </div>
    </div>

    <!-- Tarjetas de Métricas Rápidas -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      <!-- Total -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reportes</span>
          <span class="p-2 rounded-xl bg-slate-100 text-slate-700">📋</span>
        </div>
        <div class="text-3xl font-extrabold text-slate-900">{{ metrics.total }}</div>
        <p class="text-xs text-slate-500 mt-1">Registrados en la plataforma</p>
      </div>

      <!-- Pendientes -->
      <div class="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs bg-gradient-to-b from-amber-50/30 to-transparent">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pendientes</span>
          <span class="p-2 rounded-xl bg-amber-100 text-amber-800">⏳</span>
        </div>
        <div class="text-3xl font-extrabold text-amber-700">{{ metrics.pendientes }}</div>
        <p class="text-xs text-amber-600 mt-1">{{ metrics.criticos }} con severidad Crítica</p>
      </div>

      <!-- En Proceso -->
      <div class="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs bg-gradient-to-b from-blue-50/30 to-transparent">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-blue-700 uppercase tracking-wider">En Atención</span>
          <span class="p-2 rounded-xl bg-blue-100 text-blue-800">🔧</span>
        </div>
        <div class="text-3xl font-extrabold text-blue-700">{{ metrics.enProceso }}</div>
        <p class="text-xs text-blue-600 mt-1">Con técnico asignado</p>
      </div>

      <!-- Resueltos -->
      <div class="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs bg-gradient-to-b from-emerald-50/30 to-transparent">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Resueltos</span>
          <span class="p-2 rounded-xl bg-emerald-100 text-emerald-800">✅</span>
        </div>
        <div class="text-3xl font-extrabold text-emerald-700">{{ metrics.resueltos }}</div>
        <p class="text-xs text-emerald-600 mt-1">{{ resolutionRate }}% tasa de resolución</p>
      </div>

    </div>

    <!-- Sección de Incidencias Recientes -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Incidencias Recientes</h2>
          <p class="text-xs text-slate-500">Últimos reportes registrados en las instalaciones</p>
        </div>
        <router-link
          to="/tablero"
          class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          Ver todos los reportes (Tablero Kanban)
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReportCard
          v-for="rep in recentReports"
          :key="rep.id"
          :report="rep"
        />
      </div>
    </div>

    <!-- Módulo de Información del Proyecto -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">
          1
        </div>
        <h3 class="font-bold text-slate-900 mb-1">Reporte Ágil en 3 Pasos</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Pensado con filosofía Mobile-First: permite cargar fotos directo de la cámara y seleccionar la ubicación exacta en menos de 1 minuto.
        </p>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-3">
          2
        </div>
        <h3 class="font-bold text-slate-900 mb-1">Tablero de Gestión Reactivo</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Jerarquización automática por criticidad. Los técnicos visualizan la avería y actualizan el estado con un solo clic.
        </p>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-3">
          3
        </div>
        <h3 class="font-bold text-slate-900 mb-1">Trazabilidad y Mantenimiento</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Historial inmutable de auditoría para cada incidencia que respalda la transición hacia un mantenimiento preventivo.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '../services/store'
import ReportCard from '../components/ReportCard.vue'

const metrics = computed(() => {
  const total = store.reports.length
  const pendientes = store.reports.filter(r => r.estado === 'Pendiente').length
  const criticos = store.reports.filter(r => r.estado === 'Pendiente' && (r.severidad === 'Crítica' || r.severidad === 'Alta')).length
  const enProceso = store.reports.filter(r => r.estado === 'En proceso').length
  const resueltos = store.reports.filter(r => r.estado === 'Resuelto').length

  return { total, pendientes, criticos, enProceso, resueltos }
})

const resolutionRate = computed(() => {
  if (metrics.value.total === 0) return 0
  return Math.round((metrics.value.resueltos / metrics.value.total) * 100)
})

const recentReports = computed(() => {
  return [...store.reports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
})
</script>
