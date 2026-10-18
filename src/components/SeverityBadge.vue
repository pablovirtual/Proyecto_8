<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
      severityClass
    ]"
  >
    {{ severidad }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  severidad: {
    type: String,
    required: true
  }
})

const severityClass = computed(() => {
  switch (props.severidad) {
    case 'Crítica':
    case 'Urgente':
      return 'bg-red-50 text-red-700 border-red-300 font-bold'
    case 'Alta':
      return 'bg-orange-50 text-orange-700 border-orange-200 font-semibold'
    case 'Media':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200'
    case 'Baja':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
})
</script>
