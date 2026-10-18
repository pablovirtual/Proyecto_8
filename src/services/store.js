import { reactive, watch } from 'vue'

const STORAGE_KEY = 'udg_reportes_mantenimiento_data_v1'
const USER_KEY = 'udg_reportes_user_v1'

// Datos semilla de demostración realistas
const DEFAULT_REPORTS = [
  {
    id: 'REP-2026-001',
    titulo: 'Lámparas LED fundidas en aula de cómputo',
    descripcion: 'Tres de las seis luminarias principales parpadean y dos están totalmente apagadas, impidiendo la visibilidad adecuada para las clases vespertinas.',
    categoria: 'electricidad',
    severidad: 'Alta', // Baja, Media, Alta, Crítica
    estado: 'Pendiente', // Pendiente, En proceso, Resuelto, Cancelado
    ubicacion: {
      edificio: 'Edificio B (Laboratorios)',
      piso: 'Piso 2',
      aula: 'Laboratorio de Cómputo 204'
    },
    fotos: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80'
    ],
    solicitante: {
      nombre: 'Pedro Pablo Rodríguez',
      correo: 'pedro.rodriguez@udgvirtual.udg.mx',
      rol: 'solicitante'
    },
    tecnicoAsignado: null,
    notasTecnicas: '',
    createdAt: '2026-10-17T09:30:00Z',
    updatedAt: '2026-10-17T09:30:00Z',
    auditLogs: [
      {
        fecha: '2026-10-17T09:30:00Z',
        autor: 'Pedro Pablo Rodríguez (Solicitante)',
        accion: 'Reporte registrado en la plataforma.'
      }
    ]
  },
  {
    id: 'REP-2026-002',
    titulo: 'Fuga de agua considerable en sanitarios de varones',
    descripcion: 'Se presenta fuga continua en la llave de paso del lavabo principal, generando encharcamiento que puede provocar resbalones.',
    categoria: 'plomeria',
    severidad: 'Crítica',
    estado: 'En proceso',
    ubicacion: {
      edificio: 'Edificio A (Aulas Generales)',
      piso: 'Planta Baja',
      aula: 'Sanitarios Módulo Oeste'
    },
    fotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    solicitante: {
      nombre: 'Mtra. Elena Torres',
      correo: 'elena.torres@udgvirtual.udg.mx',
      rol: 'solicitante'
    },
    tecnicoAsignado: {
      nombre: 'Juan Javier Manzo',
      correo: 'juan.manzo@udgvirtual.udg.mx'
    },
    notasTecnicas: 'Se cerró la válvula general de paso. Se requiere reemplazo de empaque y niple de 1/2 pulgada. Material solicitado a bodega.',
    createdAt: '2026-10-18T08:15:00Z',
    updatedAt: '2026-10-18T10:45:00Z',
    auditLogs: [
      {
        fecha: '2026-10-18T08:15:00Z',
        autor: 'Mtra. Elena Torres (Solicitante)',
        accion: 'Reporte registrado con severidad Crítica.'
      },
      {
        fecha: '2026-10-18T09:00:00Z',
        autor: 'Administrador General',
        accion: 'Técnico asignado: Juan Javier Manzo.'
      },
      {
        fecha: '2026-10-18T10:45:00Z',
        autor: 'Juan Javier Manzo (Técnico)',
        accion: 'Estado actualizado a "En proceso". Nota agregada: Válvula cerrada temporalmente.'
      }
    ]
  },
  {
    id: 'REP-2026-003',
    titulo: 'Chapa trabada en puerta de cubículo docente',
    descripcion: 'La llave entra con mucha dificultad y el pestillo se queda atorado, con riesgo de que alguien quede encerrado.',
    categoria: 'cerrajeria',
    severidad: 'Media',
    estado: 'Resuelto',
    ubicacion: {
      edificio: 'Edificio C (Docencia y Posgrado)',
      piso: 'Piso 1',
      aula: 'Cubículo 112'
    },
    fotos: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80'
    ],
    solicitante: {
      nombre: 'Dr. Roberto Mendoza',
      correo: 'roberto.mendoza@udgvirtual.udg.mx',
      rol: 'solicitante'
    },
    tecnicoAsignado: {
      nombre: 'Juan Javier Manzo',
      correo: 'juan.manzo@udgvirtual.udg.mx'
    },
    notasTecnicas: 'Se lubricó cilindro, se ajustó contra-chapa y se calibraron los tornillos de fijación. Operando con suavidad.',
    createdAt: '2026-10-16T11:20:00Z',
    updatedAt: '2026-10-16T15:40:00Z',
    resolvedAt: '2026-10-16T15:40:00Z',
    auditLogs: [
      {
        fecha: '2026-10-16T11:20:00Z',
        autor: 'Dr. Roberto Mendoza (Solicitante)',
        accion: 'Reporte registrado.'
      },
      {
        fecha: '2026-10-16T12:00:00Z',
        autor: 'Juan Javier Manzo (Técnico)',
        accion: 'Estado cambiado a "En proceso".'
      },
      {
        fecha: '2026-10-16T15:40:00Z',
        autor: 'Juan Javier Manzo (Técnico)',
        accion: 'Reporte marcado como "Resuelto". Cerradura reparada.'
      }
    ]
  },
  {
    id: 'REP-2026-004',
    titulo: 'Proyector multimedia no enciende en auditorio',
    descripcion: 'El equipo no responde al encendido manual ni al control remoto. El indicador LED frontal permanece apagado.',
    categoria: 'redes_computo',
    severidad: 'Alta',
    estado: 'Pendiente',
    ubicacion: {
      edificio: 'Edificio Administrativo y Cultural',
      piso: 'Planta Baja',
      aula: 'Auditorio Principal'
    },
    fotos: [],
    solicitante: {
      nombre: 'Paulo Antonio Iñiguez',
      correo: 'paulo.iniguez@udgvirtual.udg.mx',
      rol: 'solicitante'
    },
    tecnicoAsignado: null,
    notasTecnicas: '',
    createdAt: '2026-10-18T13:00:00Z',
    updatedAt: '2026-10-18T13:00:00Z',
    auditLogs: [
      {
        fecha: '2026-10-18T13:00:00Z',
        autor: 'Paulo Antonio Iñiguez (Solicitante)',
        accion: 'Reporte registrado en la plataforma.'
      }
    ]
  },
  {
    id: 'REP-2026-005',
    titulo: 'Silla ergonómica con base hidráulica averiada',
    descripcion: 'El pistón no retiene la altura y desciende repentinamente.',
    categoria: 'mobiliario',
    severidad: 'Baja',
    estado: 'Resuelto',
    ubicacion: {
      edificio: 'Edificio C (Docencia y Posgrado)',
      piso: 'Piso 2',
      aula: 'Sala de Juntas B'
    },
    fotos: [],
    solicitante: {
      nombre: 'Lic. Claudia Nava',
      correo: 'claudia.nava@udgvirtual.udg.mx',
      rol: 'solicitante'
    },
    tecnicoAsignado: {
      nombre: 'Juan Javier Manzo',
      correo: 'juan.manzo@udgvirtual.udg.mx'
    },
    notasTecnicas: 'Pistón sustituido por refacción de almacén.',
    createdAt: '2026-10-15T14:10:00Z',
    updatedAt: '2026-10-15T17:00:00Z',
    resolvedAt: '2026-10-15T17:00:00Z',
    auditLogs: [
      {
        fecha: '2026-10-15T14:10:00Z',
        autor: 'Lic. Claudia Nava (Solicitante)',
        accion: 'Reporte registrado.'
      },
      {
        fecha: '2026-10-15T17:00:00Z',
        autor: 'Juan Javier Manzo (Técnico)',
        accion: 'Pistón sustituido y reporte cerrado.'
      }
    ]
  }
]

const DEFAULT_USER = {
  nombre: 'Pedro Pablo Rodríguez',
  correo: 'pedro.rodriguez@udgvirtual.udg.mx',
  rol: 'solicitante' // 'solicitante' | 'tecnico' | 'admin'
}

function loadInitialReports() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error parsing stored reports', e)
    }
  }
  return DEFAULT_REPORTS
}

function loadInitialUser() {
  const saved = localStorage.getItem(USER_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error parsing stored user', e)
    }
  }
  return DEFAULT_USER
}

export const store = reactive({
  reports: loadInitialReports(),
  currentUser: loadInitialUser(),

  // Acciones
  setRole(newRole) {
    this.currentUser.rol = newRole
    if (newRole === 'tecnico') {
      this.currentUser.nombre = 'Juan Javier Manzo (Técnico)'
      this.currentUser.correo = 'juan.manzo@udgvirtual.udg.mx'
    } else if (newRole === 'admin') {
      this.currentUser.nombre = 'Paulo Antonio Iñiguez (Admin / PO)'
      this.currentUser.correo = 'paulo.iniguez@udgvirtual.udg.mx'
    } else {
      this.currentUser.nombre = 'Pedro Pablo Rodríguez (Solicitante)'
      this.currentUser.correo = 'pedro.rodriguez@udgvirtual.udg.mx'
    }
    this.saveUser()
  },

  createReport(data) {
    const nextNum = this.reports.length + 1
    const newId = `REP-2026-${String(nextNum).padStart(3, '0')}`
    const now = new Date().toISOString()

    const newReport = {
      id: newId,
      titulo: data.titulo,
      descripcion: data.descripcion,
      categoria: data.categoria || 'otros',
      severidad: data.severidad || 'Media',
      estado: 'Pendiente',
      ubicacion: {
        edificio: data.ubicacion.edificio,
        piso: data.ubicacion.piso,
        aula: data.ubicacion.aula
      },
      fotos: data.fotos || [],
      solicitante: {
        nombre: this.currentUser.nombre,
        correo: this.currentUser.correo,
        rol: this.currentUser.rol
      },
      tecnicoAsignado: null,
      notasTecnicas: '',
      createdAt: now,
      updatedAt: now,
      auditLogs: [
        {
          fecha: now,
          autor: `${this.currentUser.nombre} (${this.currentUser.rol})`,
          accion: `Reporte registrado con severidad ${data.severidad}.`
        }
      ]
    }

    this.reports.unshift(newReport)
    this.saveReports()
    return newReport
  },

  updateStatus(reportId, newStatus, notas = '') {
    const report = this.reports.find(r => r.id === reportId)
    if (!report) return false

    const now = new Date().toISOString()
    const oldStatus = report.estado
    report.estado = newStatus
    report.updatedAt = now

    if (notas && notas.trim()) {
      report.notasTecnicas = (report.notasTecnicas ? report.notasTecnicas + '\n' : '') + `[${new Date().toLocaleDateString()}]: ${notas.trim()}`
    }

    if (newStatus === 'Resuelto') {
      report.resolvedAt = now
    }

    report.auditLogs.unshift({
      fecha: now,
      autor: `${this.currentUser.nombre} (${this.currentUser.rol})`,
      accion: `Estado modificado de "${oldStatus}" a "${newStatus}".${notas ? ` Nota: ${notas}` : ''}`
    })

    this.saveReports()
    return true
  },

  assignTechnician(reportId, technicianName) {
    const report = this.reports.find(r => r.id === reportId)
    if (!report) return false

    const now = new Date().toISOString()
    report.tecnicoAsignado = {
      nombre: technicianName,
      correo: `${technicianName.toLowerCase().replace(/\s+/g, '.')}@udgvirtual.udg.mx`
    }
    report.updatedAt = now

    report.auditLogs.unshift({
      fecha: now,
      autor: `${this.currentUser.nombre} (${this.currentUser.rol})`,
      accion: `Técnico asignado: ${technicianName}.`
    })

    this.saveReports()
    return true
  },

  resetDefaults() {
    this.reports = JSON.parse(JSON.stringify(DEFAULT_REPORTS))
    this.currentUser = JSON.parse(JSON.stringify(DEFAULT_USER))
    this.saveReports()
    this.saveUser()
  },

  saveReports() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reports))
  },

  saveUser() {
    localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
  }
})
