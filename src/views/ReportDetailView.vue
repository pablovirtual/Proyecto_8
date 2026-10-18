<template>
  <div v-if="report" class="max-w-4xl mx-auto py-4 space-y-6">
    <!-- Navegación superior -->
    <div class="flex items-center justify-between">
      <router-link
        to="/tablero"
        class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al Tablero
      </router-link>

      <div class="flex items-center gap-2">
        <SeverityBadge :severidad="report.severidad" />
        <StatusBadge :estado="report.estado" />
      </div>
    </div>

    <!-- Contenedor Principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Columna Izquierda: Información de la Incidencia -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Tarjeta de Datos -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div class="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <span>{{ report.id }}</span>
            <span>&bull;</span>
            <span>Registrado el {{ formatDate(report.createdAt) }}</span>
          </div>

          <h1 class="text-2xl font-bold text-slate-900 leading-tight mb-4">
            {{ report.titulo }}
          </h1>

          <div class="prose prose-sm text-slate-700 leading-relaxed mb-6">
            <p>{{ report.descripcion }}</p>
          </div>

          <!-- Metadatos de Ubicación y Categoría -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span class="text-slate-400 font-semibold block uppercase text-[10px]">Ubicación Física</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block">{{ report.ubicacion.aula }}</span>
              <span class="text-slate-600 block">{{ report.ubicacion.edificio }} &bull; {{ report.ubicacion.piso }}</span>
            </div>

            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span class="text-slate-400 font-semibold block uppercase text-[10px]">Categoría & Criticidad</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block capitalize">{{ report.categoria }}</span>
              <span class="text-slate-600 block">Severidad: {{ report.severidad }}</span>
            </div>
          </div>

          <!-- Galería de Evidencia Fotográfica -->
          <div v-if="report.fotos && report.fotos.length > 0" class="mt-6 pt-4 border-t border-slate-100">
            <h3 class="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <span>📸 Evidencia Fotográfica Adjunta</span>
              <span class="text-xs font-normal text-slate-400">({{ report.fotos.length }} imagen)</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(foto, idx) in report.fotos"
                :key="idx"
                class="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group relative cursor-pointer"
                @click="openImage(foto)"
              >
                <img :src="foto" alt="Evidencia" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" />
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                  Clic para ampliar
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bitácora Histórica y Trazabilidad (Audit Logs) -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900">Línea de Tiempo y Trazabilidad</h2>
              <p class="text-xs text-slate-500">Registro inmutable de auditoría para mantenimiento preventivo</p>
            </div>
            <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">
              {{ report.auditLogs.length }} eventos
            </span>
          </div>

          <div class="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
            <div
              v-for="(log, idx) in report.auditLogs"
              :key="idx"
              class="relative pl-6"
            >
              <!-- Punto en la línea -->
              <span class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-50"></span>
              
              <div class="text-xs text-slate-500 mb-0.5 flex items-center gap-2">
                <span>{{ formatDate(log.fecha) }}</span>
                <span>&bull;</span>
                <span class="font-semibold text-slate-700">{{ log.autor }}</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {{ log.accion }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Columna Derecha: Gestión Operativa (Técnicos & Admins) -->
      <div class="space-y-6">
        
        <!-- Panel de Acciones Operativas -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 class="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span>⚙️ Gestión del Ticket</span>
          </h2>

          <!-- Alerta de permisos si es solicitante -->
          <div v-if="store.currentUser.rol === 'solicitante'" class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 mb-4">
            <p class="font-semibold text-slate-700 mb-1">Modo Solicitante</p>
            Tienes vista de solo lectura para este reporte. Para cambiar estados o agregar notas técnicas, selecciona el rol <strong>Técnico</strong> o <strong>Admin</strong> en la barra superior.
          </div>

          <div v-else class="space-y-4">
            <!-- Cambio de Estado -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Actualizar Estado Operativo</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="updateStatus('Pendiente')"
                  :class="[
                    'py-2 px-3 rounded-lg text-xs font-semibold border transition-all',
                    report.estado === 'Pendiente'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  ]"
                >
                  Pendiente
                </button>
                <button
                  type="button"
                  @click="updateStatus('En proceso')"
                  :class="[
                    'py-2 px-3 rounded-lg text-xs font-semibold border transition-all',
                    report.estado === 'En proceso'
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  ]"
                >
                  En Proceso
                </button>
                <button
                  type="button"
                  @click="updateStatus('Resuelto')"
                  :class="[
                    'py-2 px-3 rounded-lg text-xs font-semibold border transition-all col-span-2',
                    report.estado === 'Resuelto'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  ]"
                >
                  ✓ Marcar como Resuelto
                </button>
              </div>
            </div>

            <!-- Asignación de Técnico (Admin) -->
            <div v-if="store.currentUser.rol === 'admin'">
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Asignar Personal Técnico</label>
              <select
                v-model="technicianInput"
                @change="assignTech"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="" disabled>Seleccionar técnico...</option>
                <option value="Juan Javier Manzo">Juan Javier Manzo (Electricidad/Plomería)</option>
                <option value="Ing. Carlos Morales">Ing. Carlos Morales (Redes/Cómputo)</option>
                <option value="Manuel Domínguez">Manuel Domínguez (Cerrajería y General)</option>
              </select>
            </div>

            <!-- Nota Técnica de Avance -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Agregar Nota de Avance Técnico</label>
              <textarea
                v-model="newNote"
                rows="3"
                placeholder="Ej. Se cerró llave de paso. Se requiere empaque de 1/2 pulgada..."
                class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              ></textarea>
              <button
                type="button"
                @click="saveNote"
                :disabled="!newNote.trim()"
                class="mt-2 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold transition-all"
              >
                Registrar Nota en Bitácora
              </button>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Actores Involucrados -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Detalles de Contacto</h3>
          
          <div>
            <span class="text-[11px] text-slate-400 block">Reportado por (Solicitante):</span>
            <div class="font-bold text-slate-800 text-sm">{{ report.solicitante.nombre }}</div>
            <div class="text-xs text-slate-500">{{ report.solicitante.correo }}</div>
          </div>

          <div class="pt-3 border-t border-slate-100">
            <span class="text-[11px] text-slate-400 block">Técnico Asignado:</span>
            <div v-if="report.tecnicoAsignado" class="font-bold text-blue-700 text-sm">
              👨‍🔧 {{ report.tecnicoAsignado.nombre }}
            </div>
            <div v-else class="text-xs text-amber-600 font-semibold italic">
              Sin técnico asignado aún
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Modal para ver imagen en grande -->
    <div
      v-if="activeImage"
      @click="activeImage = null"
      class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
    >
      <div class="max-w-3xl max-h-[90vh] relative">
        <img :src="activeImage" alt="Evidencia Ampliada" class="rounded-xl max-h-[85vh] object-contain shadow-2xl" />
        <p class="text-center text-white/80 text-xs mt-2">Clic en cualquier parte para cerrar</p>
      </div>
    </div>
  </div>

  <div v-else class="py-16 text-center">
    <h2 class="text-lg font-bold text-slate-800">Reporte no encontrado</h2>
    <p class="text-xs text-slate-500 mt-1 mb-4">Es posible que el ID sea incorrecto o haya sido eliminado.</p>
    <router-link to="/tablero" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs">
      Ir al Tablero
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../services/store'
import SeverityBadge from '../components/SeverityBadge.vue'
import StatusBadge from '../components/StatusBadge.vue'

const route = useRoute()
const activeImage = ref(null)
const newNote = ref('')
const technicianInput = ref('')

const report = computed(() => {
  return store.reports.find(r => r.id === route.params.id)
})

function updateStatus(newStatus) {
  if (!report.value) return
  store.updateStatus(report.value.id, newStatus, newNote.value)
  newNote.value = ''
}

function saveNote() {
  if (!report.value || !newNote.value.trim()) return
  store.updateStatus(report.value.id, report.value.estado, newNote.value)
  newNote.value = ''
}

function assignTech() {
  if (!report.value || !technicianInput.value) return
  store.assignTechnician(report.value.id, technicianInput.value)
}

function openImage(imgUrl) {
  activeImage.value = imgUrl
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
