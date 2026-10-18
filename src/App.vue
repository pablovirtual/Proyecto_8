<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <TheNavbar />

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view />
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4 space-y-1">
        <p class="font-semibold text-slate-700">Universidad de Guadalajara &bull; UDGVirtual &bull; Proyecto VIII</p>
        <p>Equipo "Los Programadores" — Prototipo de Sistema de Reportes de Instalaciones</p>
        <p class="text-[11px] text-slate-400">Diseñado con Vue.js 3, Vite & Tailwind CSS</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import TheNavbar from './components/TheNavbar.vue'
</script>
