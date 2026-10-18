<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border',
      badgeClass
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full mr-1.5', dotClass]"></span>
    {{ estado }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: {
    type: String,
    required: true
  }
})

const badgeClass = computed(() => {
  switch (props.estado) {
    case 'Pendiente':
      return 'bg-amber-50 text-amber-800 border-amber-200'
    case 'En proceso':
      return 'bg-blue-50 text-blue-800 border-blue-200'
    case 'Resuelto':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200'
    case 'Cancelado':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
})

const dotClass = computed(() => {
  switch (props.estado) {
    case 'Pendiente':
      return 'bg-amber-500 animate-pulse'
    case 'En proceso':
      return 'bg-blue-500'
    case 'Resuelto':
      return 'bg-emerald-500'
    case 'Cancelado':
      return 'bg-slate-400'
    default:
      return 'bg-gray-400'
  }
})
</script>
