function cargarApp() {
  document.getElementById('pantalla-login').classList.remove('activo');
  document.getElementById('app-principal').classList.add('activo');

  // Actualizar topbar
  const ini = (APP.usuario.displayName || APP.usuario.email).substring(0,2).toUpperCase();
  document.getElementById('topbar-avatar').textContent = ini;
  document.getElementById('um-nombre').textContent = APP.usuario.displayName || APP.usuario.email;
  document.getElementById('um-rol').textContent = { alumno:'Alumno/a', profesor:'Docente', admin:'Administrador' }[APP.rolActivo] || APP.rolActivo;

  if (APP.empresa) {
    document.getElementById('topbar-emp-nombre').textContent = APP.empresa.nombre;
    document.getElementById('topbar-emp-dept').textContent   = APP.empresa.departamento;
    document.getElementById('sidebar-emp-nombre').textContent = APP.empresa.nombre;
    document.getElementById('sidebar-emp-sector').textContent = APP.empresa.sector;
    document.getElementById('stat-grupo').textContent = (APP.perfil && APP.perfil.grupo) || '—';
    document.getElementById('stat-dept').textContent  = (APP.empresa.departamento || '—').substring(0,4);
  }

  // Si es profesor o admin, mostrar nav extra
  if (APP.rolActivo !== 'alumno') {
    añadirNavProfesor();
  }

  rankingSuscribir();

  // ── Inicializar sistema de notificaciones ──
  setTimeout(() => {
    // Bienvenida
    notifAñadir('sistema',
      `¡Bienvenido/a, ${APP.usuario.displayName || APP.perfil.nombre || 'alumno/a'}!`,
      `Rol: ${APP.rolActivo === 'alumno' ? 'Alumno/a' : 'Docente'} · ${EMPRESA_STATE.datos.nombre || 'Tu empresa'}`,
      { icono: '👋' }
    );
    // Alertas fiscales automáticas
    notifAlertasFiscales();
    // Autoevaluaciones pendientes
    notifAutoevaluacionPendiente();
    // Render del badge y del widget del dashboard
    actualizarBadgeNotif();
  }, 800);

  irA('dashboard');

  // Lanzar guía de bienvenida si es el primer acceso del alumno
  vbCheckPrimerAcceso();
}

function añadirNavProfesor() {
  const sidebar = document.querySelector('.sidebar');
  const divider = document.createElement('div');
  divider.className = 'sidebar-divider';
  const seccion = document.createElement('div');
  seccion.className = 'sidebar-seccion';
  seccion.innerHTML = `
    <div class="sidebar-seccion-titulo">Panel docente</div>
    <button class="nav-item" onclick="irA('panel-profesor',this)">
      <span class="nav-icono">📊</span> Vista global
    </button>
    <button class="nav-item" onclick="irA('evaluacion-docente',this)">
      <span class="nav-icono">📝</span> Evaluación RA/CE
    </button>
  `;
  sidebar.appendChild(divider);
  sidebar.appendChild(seccion);
}

/* ============================================================
   NAVEGACIÓN
   ============================================================ */
function irA(modulo, btnEl) {
  APP.moduloActual = modulo;

  // Actualizar nav activo
  if (btnEl) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('activo'));
    btnEl.classList.add('activo');
  }

  document.getElementById('topbar-modulo-label').textContent = {
    dashboard:         'Dashboard',
    empresa:           'Mi empresa',
    mercado:           'Mercado intergrupal',
    mensajeria:        '📧 Correo de empresa',
    generador:         '⚡ Generador de situaciones',
    emprendimiento:    '💡 Emprendimiento y Dirección',
    'plan-empresa':    '📋 Plan de empresa',
    gestion:           'Gestión operativa · RA6',
    programas:         '🖥️ Programas de gestión',
    conceptos:         '📚 Conceptos clave',
    casos:             '🧩 Casos y situaciones',
    dossier:           '📄 Dossier · 3160',
    nominasol:         'RRHH · Nominasol',
    contasol:          'Contabilidad · Contasol',
    factusol:          'Comercial · Factusol',
    documental:        'Gestión documental',
    defensa:           'Defensa pública',
    tareas:            '✅ Tareas del grupo',
    autoevaluacion:    'Autoevaluación',
    coevaluacion:      'Coevaluación',
    notas:             'Mis notas',
    'panel-profesor':  'Panel docente',
    'evaluacion-docente': 'Evaluación RA/CE',
    ranking:           'Ranking de empresas',
    eventos:           'Eventos de mercado',
    perfil:            '👤 Mi perfil',
  }[modulo] || modulo;

  renderVista(modulo);
  cerrarPaneles();
}

/* ============================================================
   RENDERER DE VISTAS
   ============================================================ */
function renderVista(modulo) {
  const c = document.getElementById('contenido-principal');
  const vistas = {
    dashboard:      vistaDashboard,
    empresa:        vistaEmpresa,
    mercado:        vistaMercado,
    mensajeria:     vistaMensajeria,
    generador:      vistaGenerador,
    emprendimiento: vistaEmprendimiento,
    'plan-empresa': vistaPlanEmpresa,
    gestion:        vistaGestion,
    autoevaluacion: vistaAutoevaluacion,
    coevaluacion:   vistaCoevaluacion,
    defensa:        vistaDefensa,
    tareas:         vistaTareas,
    notas:          vistaNotas,
    'panel-profesor': vistaPanelProfesor,
    'evaluacion-docente': vistaEvalDocente,
    eventos:        vistaEventos,
    programas:      vistaProgramas,
    conceptos:      vistaConceptos,
    casos:          vistaCasos,
    dossier:        vistaDossier,
    perfil:         vistaPerfil,
    ranking:        vistaRanking,
  };
  const fn = vistas[modulo];
  c.innerHTML = fn ? fn() : vistaProxima(modulo);
  // Post-render: widgets que necesitan JS después de insertar el HTML
  if (modulo === 'dashboard') {
    renderDashNotifWidget();
  }
}

/* ============================================================
   VISTA: DASHBOARD
   ============================================================ */
