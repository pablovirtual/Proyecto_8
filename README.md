# Plataforma de Reporte de Fallas en Instalaciones (UDGVirtual)

Prototipo de plataforma digital para el reporte, seguimiento y gestión de incidencias en instalaciones y mantenimiento físico.

* **Institución:** Universidad de Guadalajara — UDGVirtual
* **Materia:** Proyecto VIII
* **Asesora:** Úrsula del Pilar González Robles
* **Equipo:** "Los Programadores"
* **Integrantes:**
  * Pedro Pablo Rodríguez Gómez
  * Paulo Antonio Iñiguez Martínez
  * Juan Javier Manzo Luna

---

## 🛠️ Stack Tecnológico

* **Frontend:** [Vue.js 3](https://vuejs.org/) (Composition API, `<script setup>`, Vite)
* **Enrutamiento:** [Vue Router 4](https://router.vuejs.org/) (Hash Mode para 100% compatibilidad con GitHub Pages)
* **Diseño & Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Filosofía Mobile-First, paleta cromática según documento de diseño)
* **Persistencia:** Store reactivo modular desacoplado respaldado en `localStorage`, con datos semilla e historial inmutable de auditoría (`auditLogs`), estructurado idénticamente a las colecciones NoSQL de Cloud Firestore.

---

## ✨ Funcionalidades Clave

1. **Selector Rápido de Roles (Simulador para evaluación):**
   * **Solicitante (Alumno / Docente / Administrativo):** Registro de fallas en menos de 1 minuto y consulta de estatus.
   * **Técnico de Mantenimiento:** Tablero de órdenes priorizadas, inspección de fotos antes de traslado y actualización de estados con notas técnicas.
   * **Administrador:** Visión global, asignación de técnicos, mapas de calor por edificio y exportación de datos.

2. **Formulario Reactivo en 3 Pasos (`ReportForm`):**
   * **Paso 1: Categoría & Título:** Clasificación por especialidad (Electricidad, Plomería, Cerrajería, Estructura, Mobiliario, Cómputo).
   * **Paso 2: Ubicación Jerárquica & Severidad:** Edificio $\rightarrow$ Piso $\rightarrow$ Aula / Cubículo con nivel de criticidad (Baja, Media, Alta, Crítica).
   * **Paso 3: Evidencia & Descripción:** Carga de fotografías (archivo o simulación de cámara con previsualización) y validación previa al envío.

3. **Tablero Dinámico (`StatusBoard`):**
   * Vista **Kanban** interactiva por columnas (*Pendiente*, *En proceso*, *Resuelto*).
   * Vista de **Listado** tabular con buscador y filtros avanzados.

4. **Trazabilidad y Línea de Tiempo:**
   * Registro histórico inmutable de auditoría para cada incidencia con autor, fecha y acción realizada, apoyando el mantenimiento preventivo.

5. **Estadísticas y Respaldo:**
   * Métricas de tiempo de respuesta, tasas de resolución y mapa de incidencias por edificio.
   * Exportación instantánea a formatos **CSV** y **JSON**.

---

## 🚀 Ejecución en Entorno Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir en el navegador: `http://localhost:5173`

---

## 🌐 Despliegue en GitHub Pages

El proyecto ya incluye la configuración lista en `vite.config.js` (`base: './'`) y el flujo automatizado de CI/CD en `.github/workflows/deploy.yml`.

### Pasos para publicar en GitHub:

1. **Inicializar Git y hacer commit:**
   ```bash
   git init
   git add .
   git commit -m "feat: prototipo inicial plataforma de reportes UDGVirtual"
   ```

2. **Vincular tu repositorio remoto:**
   ```bash
   git remote add origin https://github.com/<TU_USUARIO>/<TU_REPOSITORIO>.git
   git branch -M main
   git push -u origin main
   ```

3. **Activar GitHub Pages en el repositorio:**
   * En GitHub, ve a **Settings** $\rightarrow$ **Pages**.
   * En la sección **Build and deployment** $\rightarrow$ **Source**, selecciona **GitHub Actions**.
   * En 1-2 minutos tu prototipo estará disponible públicamente en:  
     `https://<TU_USUARIO>.github.io/<TU_REPOSITORIO>/`
