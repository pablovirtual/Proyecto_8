<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Estadísticas e Historial Institucional</h1>
        <p class="text-sm text-slate-500">Métricas acumuladas para la toma de decisiones y mantenimiento preventivo.</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="exportCSV"
          class="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar CSV
        </button>

        <button
          @click="exportJSON"
          class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
        >
          <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar Respaldo JSON
        </button>
      </div>
    </div>

    <!-- Indicadores Principales -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span class="text-xs font-semibold text-slate-400 uppercase">Tasa de Resolución</span>
        <div class="text-3xl font-extrabold text-emerald-600 mt-1">{{ resolutionRate }}%</div>
        <p class="text-[11px] text-slate-500 mt-1">{{ resueltosCount }} de {{ totalCount }} casos resueltos</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span class="text-xs font-semibold text-slate-400 uppercase">Tiempo Promedio Atención</span>
        <div class="text-3xl font-extrabold text-blue-600 mt-1">~4.2 hrs</div>
        <p class="text-[11px] text-slate-500 mt-1">Desde reporte hasta atención técnica</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span class="text-xs font-semibold text-slate-400 uppercase">Casos Críticos Atendidos</span>
        <div class="text-3xl font-extrabold text-amber-600 mt-1">{{ criticosCount }}</div>
        <p class="text-[11px] text-slate-500 mt-1">Fallas de alto impacto atendidas</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span class="text-xs font-semibold text-slate-400 uppercase">Ahorro en Desplazamientos</span>
        <div class="text-3xl font-extrabold text-purple-600 mt-1">100%</div>
        <p class="text-[11px] text-slate-500 mt-1">Gracias a la evidencia fotográfica</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Distribución por Edificio / Zona Física -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 class="text-base font-bold text-slate-900 mb-1">Mapa de Incidencias por Edificio</h2>
        <p class="text-xs text-slate-500 mb-6">Permite detectar zonas críticas con mayor recurrencia</p>

        <div class="space-y-4">
          <div v-for="b in buildingStats" :key="b.name" class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-700">{{ b.name }}</span>
              <span class="font-mono text-slate-500">{{ b.count }} reportes ({{ b.pct }}%)</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                :style="{ width: b.pct + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribución por Categoría de Falla -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 class="text-base font-bold text-slate-900 mb-1">Incidencias por Tipo de Especialidad</h2>
        <p class="text-xs text-slate-500 mb-6">Demanda de personal por categoría de servicio</p>

        <div class="space-y-4">
          <div v-for="c in categoryStats" :key="c.name" class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-700">{{ c.icon }} {{ c.name }}</span>
              <span class="font-mono text-slate-500">{{ c.count }} reportes ({{ c.pct }}%)</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-500', c.color]"
                :style="{ width: c.pct + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Historial Completo para Auditoría -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-base font-bold text-slate-900 mb-1">Histórico Completo de Eventos y Auditoría</h2>
      <p class="text-xs text-slate-500 mb-4">Registro cronológico de todas las acciones operativas ejecutadas en la plataforma</p>

      <div class="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        <div
          v-for="(ev, idx) in allAuditEvents"
          :key="idx"
          class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
        >
          <div>
            <span class="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mr-2">
              {{ ev.reportId }}
            </span>
            <span class="text-slate-800">{{ ev.accion }}</span>
          </div>
          <div class="text-[11px] text-slate-400 shrink-0">
            {{ formatDate(ev.fecha) }} &bull; <span class="font-semibold text-slate-600">{{ ev.autor }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '../services/store'

const totalCount = computed(() => store.reports.length)
const resueltosCount = computed(() => store.reports.filter(r => r.estado === 'Resuelto').length)
const criticosCount = computed(() => store.reports.filter(r => r.severidad === 'Crítica' || r.severidad === 'Alta').length)

const resolutionRate = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((resueltosCount.value / totalCount.value) * 100)
})

const buildingStats = computed(() => {
  const counts = {}
  store.reports.forEach(r => {
    const b = r.ubicacion.edificio || 'Otro'
    counts[b] = (counts[b] || 0) + 1
  })

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    pct: totalCount.value > 0 ? Math.round((count / totalCount.value) * 100) : 0
  })).sort((a, b) => b.count - a.count)
})

const categoryStats = computed(() => {
  const meta = {
    electricidad: { name: 'Electricidad', icon: '⚡', color: 'bg-yellow-500' },
    plomeria: { name: 'Plomería / Fontanería', icon: '💧', color: 'bg-blue-500' },
    cerrajeria: { name: 'Cerrajería', icon: '🔑', color: 'bg-amber-600' },
    estructura: { name: 'Estructura / Obra', icon: '🧱', color: 'bg-orange-500' },
    mobiliario: { name: 'Mobiliario', icon: '🪑', color: 'bg-purple-500' },
    redes_computo: { name: 'Redes / Cómputo', icon: '💻', color: 'bg-indigo-500' }
  }

  const counts = {}
  store.reports.forEach(r => {
    counts[r.categoria] = (counts[r.categoria] || 0) + 1
  })

  return Object.entries(counts).map(([cat, count]) => ({
    name: meta[cat]?.name || cat,
    icon: meta[cat]?.icon || '🔧',
    color: meta[cat]?.color || 'bg-slate-500',
    count,
    pct: totalCount.value > 0 ? Math.round((count / totalCount.value) * 100) : 0
  })).sort((a, b) => b.count - a.count)
})

const allAuditEvents = computed(() => {
  const events = []
  store.reports.forEach(r => {
    r.auditLogs.forEach(log => {
      events.push({
        reportId: r.id,
        ...log
      })
    })
  })
  return events.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
})

function exportJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store.reports, null, 2))
  const dlAnchor = document.createElement('a')
  dlAnchor.setAttribute('href', dataStr)
  dlAnchor.setAttribute('download', `reportes_mantenimiento_udg_${new Date().toISOString().slice(0, 10)}.json`)
  dlAnchor.click()
}

function exportCSV() {
  const headers = ['ID', 'Titulo', 'Categoria', 'Severidad', 'Estado', 'Edificio', 'Piso', 'Aula', 'Solicitante', 'FechaCreacion']
  const rows = store.reports.map(r => [
    r.id,
    `"${r.titulo.replace(/"/g, '""')}"`,
    r.categoria,
    r.severidad,
    r.estado,
    `"${r.ubicacion.edificio}"`,
    `"${r.ubicacion.piso}"`,
    `"${r.ubicacion.aula}"`,
    `"${r.solicitante.nombre}"`,
    r.createdAt
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const dlAnchor = document.createElement('a')
  dlAnchor.setAttribute('href', encodeURI(csvContent))
  dlAnchor.setAttribute('download', `reportes_mantenimiento_udg_${new Date().toISOString().slice(0, 10)}.csv`)
  dlAnchor.click()
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
