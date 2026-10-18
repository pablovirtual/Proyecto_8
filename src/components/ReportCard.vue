<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between">
    <div>
      <!-- Header de la tarjeta -->
      <div class="flex items-start justify-between gap-2 mb-2">
        <span class="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {{ report.id }}
        </span>
        <div class="flex items-center gap-1.5 flex-wrap justify-end">
          <SeverityBadge :severidad="report.severidad" />
          <StatusBadge :estado="report.estado" />
        </div>
      </div>

      <!-- Título -->
      <router-link
        :to="{ name: 'reporte-detalle', params: { id: report.id } }"
        class="block group"
      >
        <h3 class="font-semibold text-slate-900 group-hover:text-emerald-700 line-clamp-2 transition-colors">
          {{ report.titulo }}
        </h3>
      </router-link>

      <!-- Ubicación jerárquica -->
      <div class="mt-2 text-xs text-slate-600 flex items-center gap-1">
        <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="truncate">
          {{ report.ubicacion.edificio }} &bull; {{ report.ubicacion.aula }}
        </span>
      </div>

      <!-- Categoría -->
      <div class="mt-2 flex items-center gap-1.5">
        <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
          <span>{{ categoryIcon(report.categoria) }}</span>
          {{ formatCategory(report.categoria) }}
        </span>
      </div>

      <!-- Miniatura de foto si existe -->
      <div v-if="report.fotos && report.fotos.length > 0" class="mt-3">
        <div class="relative h-28 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
          <img
            :src="report.fotos[0]"
            :alt="report.titulo"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <span v-if="report.fotos.length > 1" class="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
            +{{ report.fotos.length - 1 }}
          </span>
        </div>
      </div>
    </div>

    <!-- Footer de la tarjeta -->
    <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <span>{{ formatDate(report.createdAt) }}</span>
      <router-link
        :to="{ name: 'reporte-detalle', params: { id: report.id } }"
        class="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
      >
        Detalles
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue'
import SeverityBadge from './SeverityBadge.vue'

const props = defineProps({
  report: {
    type: Object,
    required: true
  }
})

function formatCategory(cat) {
  const map = {
    electricidad: 'Electricidad',
    plomeria: 'Plomería / Fontanería',
    cerrajeria: 'Cerrajería',
    estructura: 'Estructura / Obra',
    mobiliario: 'Mobiliario',
    redes_computo: 'Redes / Cómputo'
  }
  return map[cat] || cat
}

function categoryIcon(cat) {
  const map = {
    electricidad: '⚡',
    plomeria: '💧',
    cerrajeria: '🔑',
    estructura: '🧱',
    mobiliario: '🪑',
    redes_computo: '💻'
  }
  return map[cat] || '🔧'
}

function formatDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short'
  })
}
</script>
