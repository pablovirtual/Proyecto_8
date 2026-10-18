<template>
  <div class="max-w-2xl mx-auto py-4">
    <!-- Encabezado del Formulario -->
    <div class="mb-6">
      <router-link to="/" class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </router-link>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Registrar Nueva Incidencia</h1>
      <p class="text-sm text-slate-500">Flujo rápido en 3 pasos (tiempo estimado: menos de 1 minuto).</p>
    </div>

    <!-- Barra de Pasos / Progreso -->
    <div class="mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
      <div class="flex items-center justify-between relative">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0"></div>
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-300"
          :style="{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }"
        ></div>

        <!-- Paso 1 -->
        <button
          type="button"
          @click="goToStep(1)"
          class="relative z-10 flex flex-col items-center group focus:outline-none"
        >
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors',
              currentStep >= 1 ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-600'
            ]"
          >
            1
          </div>
          <span class="text-[11px] font-semibold mt-1" :class="currentStep === 1 ? 'text-emerald-700' : 'text-slate-500'">Categoría</span>
        </button>

        <!-- Paso 2 -->
        <button
          type="button"
          @click="goToStep(2)"
          class="relative z-10 flex flex-col items-center group focus:outline-none"
        >
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors',
              currentStep >= 2 ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-600'
            ]"
          >
            2
          </div>
          <span class="text-[11px] font-semibold mt-1" :class="currentStep === 2 ? 'text-emerald-700' : 'text-slate-500'">Ubicación</span>
        </button>

        <!-- Paso 3 -->
        <button
          type="button"
          @click="goToStep(3)"
          class="relative z-10 flex flex-col items-center group focus:outline-none"
        >
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors',
              currentStep >= 3 ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-600'
            ]"
          >
            3
          </div>
          <span class="text-[11px] font-semibold mt-1" :class="currentStep === 3 ? 'text-emerald-700' : 'text-slate-500'">Evidencia</span>
        </button>
      </div>
    </div>

    <!-- Contenedor del Formulario -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

      <!-- PASO 1: Categoría y Título -->
      <div v-show="currentStep === 1" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-800 mb-2">
            1. Selecciona el tipo de avería / Categoría <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="form.categoria = cat.id"
              :class="[
                'p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-150',
                form.categoria === cat.id
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-600/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              ]"
            >
              <span class="text-2xl mb-1">{{ cat.icon }}</span>
              <span class="text-xs font-bold">{{ cat.name }}</span>
            </button>
          </div>
          <p v-if="errors.categoria" class="text-xs text-red-600 mt-1.5">{{ errors.categoria }}</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-800 mb-1">
            2. Título breve del problema <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.titulo"
            type="text"
            placeholder="Ej. Fuga de agua en lavabo, Lámpara fundida, etc."
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm"
          />
          <p v-if="errors.titulo" class="text-xs text-red-600 mt-1.5">{{ errors.titulo }}</p>
          <p class="text-[11px] text-slate-400 mt-1">Sé claro y específico para que el técnico identifique el equipo afectado.</p>
        </div>

        <div class="pt-4 flex justify-end">
          <button
            type="button"
            @click="validateAndNext(1)"
            class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            Siguiente: Ubicación
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- PASO 2: Ubicación y Severidad -->
      <div v-show="currentStep === 2" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-800 mb-2">
            3. Ubicación jerárquica exacta <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Edificio</label>
              <select
                v-model="form.ubicacion.edificio"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
              >
                <option value="" disabled>Seleccionar...</option>
                <option v-for="ed in buildings" :key="ed" :value="ed">{{ ed }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Piso / Nivel</label>
              <select
                v-model="form.ubicacion.piso"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
              >
                <option value="" disabled>Seleccionar...</option>
                <option value="Planta Baja">Planta Baja</option>
                <option value="Piso 1">Piso 1</option>
                <option value="Piso 2">Piso 2</option>
                <option value="Piso 3">Piso 3</option>
                <option value="Área Exterior">Área Exterior / Jardines</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Aula / Espacio</label>
              <input
                v-model="form.ubicacion.aula"
                type="text"
                placeholder="Ej. Aula 102, Sanitarios Este"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
          <p v-if="errors.ubicacion" class="text-xs text-red-600 mt-1.5">{{ errors.ubicacion }}</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-800 mb-2">
            4. Nivel de Criticidad / Severidad <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              v-for="sev in severities"
              :key="sev.id"
              type="button"
              @click="form.severidad = sev.id"
              :class="[
                'p-3 rounded-xl border text-center transition-all',
                form.severidad === sev.id
                  ? sev.activeClass + ' ring-2 shadow-xs font-bold'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              ]"
            >
              <div class="text-xs">{{ sev.name }}</div>
              <div class="text-[10px] opacity-75 mt-0.5">{{ sev.desc }}</div>
            </button>
          </div>
        </div>

        <div class="pt-4 flex items-center justify-between">
          <button
            type="button"
            @click="currentStep = 1"
            class="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            Atrás
          </button>
          <button
            type="button"
            @click="validateAndNext(2)"
            class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            Siguiente: Evidencia
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- PASO 3: Descripción y Carga de Fotos -->
      <div v-show="currentStep === 3" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-800 mb-1">
            5. Descripción detallada de la falla <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            placeholder="Describe qué ocurre, si causa algún riesgo inminente, ruidos extraños o material afectado..."
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm"
          ></textarea>
          <p v-if="errors.descripcion" class="text-xs text-red-600 mt-1.5">{{ errors.descripcion }}</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-800 mb-1">
            6. Evidencia Fotográfica (Opcional, pero muy recomendada)
          </label>
          <p class="text-xs text-slate-500 mb-3">
            Permite al personal técnico preparar herramientas y refacciones antes de trasladarse.
          </p>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Botón de subir archivo local -->
            <label class="flex-1 cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-xl p-4 text-center transition-colors">
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileUpload"
              />
              <div class="flex flex-col items-center">
                <span class="text-2xl mb-1">📁</span>
                <span class="text-xs font-semibold text-slate-700">Subir imagen desde archivo</span>
                <span class="text-[10px] text-slate-400">JPG, PNG o WebP</span>
              </div>
            </label>

            <!-- Botón de foto simulada rápida para demo -->
            <button
              type="button"
              @click="addSamplePhoto"
              class="flex-1 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl p-4 text-center transition-colors"
            >
              <div class="flex flex-col items-center">
                <span class="text-2xl mb-1">📸</span>
                <span class="text-xs font-semibold text-slate-700">Tomar foto con cámara</span>
                <span class="text-[10px] text-slate-400">Captura fotográfica instantánea</span>
              </div>
            </button>
          </div>

          <!-- Previsualización de imágenes -->
          <div v-if="form.fotos.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="(foto, idx) in form.fotos"
              :key="idx"
              class="relative rounded-xl overflow-hidden border border-slate-200 h-28 group"
            >
              <img :src="foto" alt="Evidencia" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removePhoto(idx)"
                class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100 shadow transition-opacity"
                title="Eliminar foto"
              >
                &times;
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen Rápido -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5">
          <div class="font-bold text-slate-800 text-sm mb-1">Resumen del Reporte:</div>
          <div><strong class="text-slate-600">Título:</strong> {{ form.titulo || '(Pendiente)' }}</div>
          <div><strong class="text-slate-600">Categoría:</strong> {{ form.categoria || '(Pendiente)' }} &bull; <strong class="text-slate-600">Severidad:</strong> {{ form.severidad }}</div>
          <div><strong class="text-slate-600">Lugar:</strong> {{ form.ubicacion.edificio }} / {{ form.ubicacion.piso }} / {{ form.ubicacion.aula }}</div>
          <div><strong class="text-slate-600">Solicitante:</strong> {{ store.currentUser.nombre }} ({{ store.currentUser.correo }})</div>
        </div>

        <div class="pt-4 flex items-center justify-between">
          <button
            type="button"
            @click="currentStep = 2"
            class="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            Atrás
          </button>
          <button
            type="button"
            @click="submitReport"
            :disabled="isSubmitting"
            class="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span v-if="!isSubmitting">Enviar Reporte Formal</span>
            <span v-else>Guardando en el sistema...</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../services/store'

const router = useRouter()
const currentStep = ref(1)
const isSubmitting = ref(false)

const categories = [
  { id: 'electricidad', name: 'Electricidad', icon: '⚡' },
  { id: 'plomeria', name: 'Plomería / Fontanería', icon: '💧' },
  { id: 'cerrajeria', name: 'Cerrajería', icon: '🔑' },
  { id: 'estructura', name: 'Estructura / Albañilería', icon: '🧱' },
  { id: 'mobiliario', name: 'Mobiliario', icon: '🪑' },
  { id: 'redes_computo', name: 'Redes / Cómputo', icon: '💻' }
]

const buildings = [
  'Edificio A (Aulas Generales)',
  'Edificio B (Laboratorios)',
  'Edificio C (Docencia y Posgrado)',
  'Edificio Administrativo y Cultural',
  'Biblioteca Central UDGVirtual',
  'Instalaciones Deportivas y Exteriores'
]

const severities = [
  { id: 'Baja', name: 'Baja', desc: 'No interfiere clases', activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-emerald-400/20' },
  { id: 'Media', name: 'Media', desc: 'Molestia menor', activeClass: 'border-amber-500 bg-amber-50 text-amber-800 ring-amber-400/20' },
  { id: 'Alta', name: 'Alta', desc: 'Afecta operación', activeClass: 'border-orange-500 bg-orange-50 text-orange-800 ring-orange-400/20' },
  { id: 'Crítica', name: 'Crítica', desc: 'Riesgo / Urgencia', activeClass: 'border-red-600 bg-red-50 text-red-800 ring-red-500/20' }
]

const form = reactive({
  titulo: '',
  categoria: 'electricidad',
  severidad: 'Media',
  ubicacion: {
    edificio: 'Edificio A (Aulas Generales)',
    piso: 'Piso 1',
    aula: ''
  },
  descripcion: '',
  fotos: []
})

const errors = reactive({
  categoria: '',
  titulo: '',
  ubicacion: '',
  descripcion: ''
})

function goToStep(step) {
  if (step > currentStep.value) {
    validateAndNext(currentStep.value)
  } else {
    currentStep.value = step
  }
}

function validateAndNext(step) {
  if (step === 1) {
    errors.titulo = ''
    errors.categoria = ''
    if (!form.titulo.trim()) {
      errors.titulo = 'Por favor ingresa un título para el reporte.'
      return
    }
    if (!form.categoria) {
      errors.categoria = 'Selecciona una categoría.'
      return
    }
    currentStep.value = 2
  } else if (step === 2) {
    errors.ubicacion = ''
    if (!form.ubicacion.edificio || !form.ubicacion.piso || !form.ubicacion.aula.trim()) {
      errors.ubicacion = 'Por favor completa todos los campos de ubicación (Edificio, Piso y Aula/Espacio).'
      return
    }
    currentStep.value = 3
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    form.fotos.push(event.target.result)
  }
  reader.readAsDataURL(file)
}

function addSamplePhoto() {
  const sampleImages = [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80'
  ]
  const randomPic = sampleImages[Math.floor(Math.random() * sampleImages.length)]
  form.fotos.push(randomPic)
}

function removePhoto(idx) {
  form.fotos.splice(idx, 1)
}

function submitReport() {
  errors.descripcion = ''
  if (!form.descripcion.trim()) {
    errors.descripcion = 'Ingresa una breve descripción de la avería.'
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    const created = store.createReport({
      titulo: form.titulo,
      categoria: form.categoria,
      severidad: form.severidad,
      ubicacion: form.ubicacion,
      descripcion: form.descripcion,
      fotos: form.fotos
    })

    isSubmitting.value = false
    router.push({ name: 'reporte-detalle', params: { id: created.id } })
  }, 400)
}
</script>
