<template>
  <div class="space-y-6">
    <!-- Header del Tablero -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Tablero de Gestión de Incidencias</h1>
        <p class="text-sm text-slate-500">Monitoreo y actualización en vivo del estado de los reportes.</p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Selector de Vista: Kanban vs Lista -->
        <div class="bg-slate-200/80 p-1 rounded-xl flex items-center text-xs font-semibold">
          <button
            @click="viewMode = 'kanban'"
            :class="[
              'px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all',
              viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Kanban
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all',
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Listado
          </button>
        </div>

        <router-link
          to="/reportar"
          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all inline-flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo
        </router-link>
      </div>
    </div>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      <!-- Input de búsqueda -->
      <div class="relative flex-1">
        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por ID, título, aula o solicitante..."
          class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm"
        />
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Filtro por Categoría -->
        <select
          v-model="selectedCategory"
          class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Todas las categorías</option>
          <option value="electricidad">⚡ Electricidad</option>
          <option value="plomeria">💧 Plomería</option>
          <option value="cerrajeria">🔑 Cerrajería</option>
          <option value="estructura">🧱 Estructura</option>
          <option value="mobiliario">🪑 Mobiliario</option>
          <option value="redes_computo">💻 Cómputo</option>
        </select>

        <!-- Filtro por Severidad -->
        <select
          v-model="selectedSeverity"
          class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Todas las severidades</option>
          <option value="Crítica">🔴 Crítica</option>
          <option value="Alta">🟠 Alta</option>
          <option value="Media">🟡 Media</option>
          <option value="Baja">🟢 Baja</option>
        </select>

        <button
          v-if="searchQuery || selectedCategory || selectedSeverity"
          @click="clearFilters"
          class="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- MODO 1: TABLERO KANBAN -->
    <div v-if="viewMode === 'kanban'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Columna 1: PENDIENTES -->
      <div class="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <h2 class="font-bold text-sm text-slate-900">Pendientes</h2>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
            {{ pendientes.length }}
          </span>
        </div>

        <div class="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
          <div v-if="pendientes.length === 0" class="text-center py-10 text-xs text-slate-400">
            No hay reportes pendientes.
          </div>
          <div
            v-for="rep in pendientes"
            :key="rep.id"
            class="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-sm transition-all"
          >
            <div class="flex items-center justify-between gap-1 mb-2">
              <span class="text-[11px] font-mono text-slate-500">{{ rep.id }}</span>
              <SeverityBadge :severidad="rep.severidad" />
            </div>

            <router-link :to="{ name: 'reporte-detalle', params: { id: rep.id } }" class="font-semibold text-sm text-slate-900 hover:text-emerald-700 block line-clamp-2">
              {{ rep.titulo }}
            </router-link>

            <p class="text-xs text-slate-500 mt-1 line-clamp-2">{{ rep.descripcion }}</p>

            <div class="mt-2 text-[11px] text-slate-600 flex items-center gap-1">
              <span>📍 {{ rep.ubicacion.aula }} ({{ rep.ubicacion.edificio }})</span>
            </div>

            <!-- Acciones rápidas para Técnicos y Admins -->
            <div v-if="canManage" class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <button
                @click="changeStatus(rep.id, 'En proceso')"
                class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors"
              >
                Tomar y Atender &rarr;
              </button>
              <router-link
                :to="{ name: 'reporte-detalle', params: { id: rep.id } }"
                class="text-[11px] text-slate-500 hover:text-slate-800"
              >
                Ver más
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna 2: EN PROCESO -->
      <div class="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            <h2 class="font-bold text-sm text-slate-900">En Proceso / Atención</h2>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
            {{ enProceso.length }}
          </span>
        </div>

        <div class="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
          <div v-if="enProceso.length === 0" class="text-center py-10 text-xs text-slate-400">
            No hay reportes en proceso de atención.
          </div>
          <div
            v-for="rep in enProceso"
            :key="rep.id"
            class="bg-white rounded-xl p-4 border border-blue-200 shadow-2xs hover:shadow-sm transition-all"
          >
            <div class="flex items-center justify-between gap-1 mb-2">
              <span class="text-[11px] font-mono text-slate-500">{{ rep.id }}</span>
              <SeverityBadge :severidad="rep.severidad" />
            </div>

            <router-link :to="{ name: 'reporte-detalle', params: { id: rep.id } }" class="font-semibold text-sm text-slate-900 hover:text-emerald-700 block line-clamp-2">
              {{ rep.titulo }}
            </router-link>

            <div class="mt-2 text-[11px] text-blue-700 bg-blue-50/80 px-2 py-1 rounded-md font-medium">
              👨‍🔧 Técnico: {{ rep.tecnicoAsignado?.nombre || 'Técnico de Guardia' }}
            </div>

            <!-- Acciones rápidas para Técnicos y Admins -->
            <div v-if="canManage" class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <button
                @click="changeStatus(rep.id, 'Resuelto')"
                class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors"
              >
                ✓ Marcar Resuelto
              </button>
              <button
                @click="changeStatus(rep.id, 'Pendiente')"
                class="text-[11px] text-slate-400 hover:text-slate-600"
              >
                Regresar a Pendiente
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna 3: RESUELTOS -->
      <div class="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h2 class="font-bold text-sm text-slate-900">Resueltos / Concluidos</h2>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            {{ resueltos.length }}
          </span>
        </div>

        <div class="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
          <div v-if="resueltos.length === 0" class="text-center py-10 text-xs text-slate-400">
            Aún no hay reportes resueltos en esta vista.
          </div>
          <div
            v-for="rep in resueltos"
            :key="rep.id"
            class="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs hover:shadow-sm opacity-95"
          >
            <div class="flex items-center justify-between gap-1 mb-2">
              <span class="text-[11px] font-mono text-slate-500">{{ rep.id }}</span>
              <span class="text-xs font-bold text-emerald-700">✓ Resuelto</span>
            </div>

            <router-link :to="{ name: 'reporte-detalle', params: { id: rep.id } }" class="font-semibold text-sm text-slate-900 hover:text-emerald-700 block line-clamp-2">
              {{ rep.titulo }}
            </router-link>

            <div class="mt-2 text-[11px] text-slate-500">
              📍 {{ rep.ubicacion.aula }} &bull; {{ formatDate(rep.resolvedAt || rep.updatedAt) }}
            </div>

            <div v-if="rep.notasTecnicas" class="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
              "{{ rep.notasTecnicas.split('\n')[0] }}"
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- MODO 2: LISTADO COMPACTO / TABULAR -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
            <tr>
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Incidencia</th>
              <th class="py-3 px-4">Categoría</th>
              <th class="py-3 px-4">Ubicación</th>
              <th class="py-3 px-4">Severidad</th>
              <th class="py-3 px-4">Estado</th>
              <th class="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="rep in filteredReports" :key="rep.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-slate-600">{{ rep.id }}</td>
              <td class="py-3 px-4 font-semibold text-slate-900">
                <router-link :to="{ name: 'reporte-detalle', params: { id: rep.id } }" class="hover:text-emerald-700">
                  {{ rep.titulo }}
                </router-link>
              </td>
              <td class="py-3 px-4 capitalize text-slate-600">{{ rep.categoria }}</td>
              <td class="py-3 px-4 text-slate-600">{{ rep.ubicacion.aula }} ({{ rep.ubicacion.edificio }})</td>
              <td class="py-3 px-4">
                <SeverityBadge :severidad="rep.severidad" />
              </td>
              <td class="py-3 px-4">
                <StatusBadge :estado="rep.estado" />
              </td>
              <td class="py-3 px-4 text-right">
                <router-link
                  :to="{ name: 'reporte-detalle', params: { id: rep.id } }"
                  class="font-semibold text-xs text-emerald-700 hover:text-emerald-800"
                >
                  Detalles &rarr;
                </router-link>
              </td>
            </tr>
            <tr v-if="filteredReports.length === 0">
              <td colspan="7" class="py-8 text-center text-slate-400 text-xs">
                No se encontraron incidencias con los filtros actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store } from '../services/store'
import SeverityBadge from '../components/SeverityBadge.vue'
import StatusBadge from '../components/StatusBadge.vue'

const viewMode = ref('kanban')
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedSeverity = ref('')

const canManage = computed(() => {
  return store.currentUser.rol === 'tecnico' || store.currentUser.rol === 'admin'
})

const filteredReports = computed(() => {
  return store.reports.filter(r => {
    // Buscador
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match =
        r.id.toLowerCase().includes(q) ||
        r.titulo.toLowerCase().includes(q) ||
        r.descripcion.toLowerCase().includes(q) ||
        r.ubicacion.aula.toLowerCase().includes(q) ||
        r.ubicacion.edificio.toLowerCase().includes(q) ||
        r.solicitante.nombre.toLowerCase().includes(q)
      if (!match) return false
    }

    // Categoría
    if (selectedCategory.value && r.categoria !== selectedCategory.value) {
      return false
    }

    // Severidad
    if (selectedSeverity.value && r.severidad !== selectedSeverity.value) {
      return false
    }

    return true
  })
})

const pendientes = computed(() => filteredReports.value.filter(r => r.estado === 'Pendiente'))
const enProceso = computed(() => filteredReports.value.filter(r => r.estado === 'En proceso'))
const resueltos = computed(() => filteredReports.value.filter(r => r.estado === 'Resuelto'))

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedSeverity.value = ''
}

function changeStatus(id, newStatus) {
  store.updateStatus(id, newStatus)
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
}
</script>
