import { createRouter, createWebHashHistory } from 'vue-router'
import { store } from '@/services/store.js'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import NewReportView from '@/views/NewReportView.vue'
import BoardView from '@/views/BoardView.vue'
import ReportDetailView from '@/views/ReportDetailView.vue'
import StatsView from '@/views/StatsView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, roles: ['tecnico', 'admin'] }
  },
  {
    path: '/reportar',
    name: 'reportar',
    component: NewReportView,
    meta: { requiresAuth: true, roles: ['solicitante', 'tecnico', 'admin'] }
  },
  {
    path: '/tablero',
    name: 'tablero',
    component: BoardView,
    meta: { requiresAuth: true, roles: ['tecnico', 'admin'] }
  },
  {
    path: '/reporte/:id',
    name: 'reporte-detalle',
    component: ReportDetailView,
    props: true,
    meta: { requiresAuth: true, roles: ['solicitante', 'tecnico', 'admin'] }
  },
  {
    path: '/estadisticas',
    name: 'estadisticas',
    component: StatsView,
    meta: { requiresAuth: true, roles: ['tecnico', 'admin'] }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  if (!store.authReady) {
    await store.initAuth()
  }

  const isAuthenticated = store.isAuthenticated && !!store.currentUser?.rol
  const userRole = store.currentUser?.rol

  // 1. Si no hay sesión activa, redirige al login
  if (!isAuthenticated) {
    if (to.name !== 'login') {
      return next({ name: 'login' })
    }
    return next()
  }

  // 2. Si hay sesión activa e intenta ir al login o a la raíz, o a una ruta no permitida para su rol
  if (to.name === 'login' || to.path === '/') {
    if (userRole === 'solicitante') {
      return next({ name: 'reportar' })
    }
    if (userRole === 'tecnico' || userRole === 'admin') {
      return next({ name: 'tablero' })
    }
  }

  // 3. Protección por rol en las rutas
  if (userRole === 'solicitante' && to.meta?.roles && !to.meta.roles.includes('solicitante')) {
    return next({ name: 'reportar' })
  }

  if (
    (userRole === 'tecnico' || userRole === 'admin') &&
    to.meta?.roles &&
    !to.meta.roles.includes(userRole)
  ) {
    return next({ name: 'tablero' })
  }

  return next()
})

export default router
