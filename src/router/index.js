import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import NewReportView from '../views/NewReportView.vue'
import BoardView from '../views/BoardView.vue'
import ReportDetailView from '../views/ReportDetailView.vue'
import StatsView from '../views/StatsView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/reportar',
    name: 'reportar',
    component: NewReportView
  },
  {
    path: '/tablero',
    name: 'tablero',
    component: BoardView
  },
  {
    path: '/reporte/:id',
    name: 'reporte-detalle',
    component: ReportDetailView,
    props: true
  },
  {
    path: '/estadisticas',
    name: 'estadisticas',
    component: StatsView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
