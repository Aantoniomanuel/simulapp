/* ============================================================
   PERSISTENCIA — localStorage
   Guarda EMPRESA_STATE automáticamente en cada render y cada
   15 s, y lo restaura al volver a cargar la app.
   ============================================================ */
const LS_ESTADO_KEY = 'simulapp_state_v1';

function guardarEstado() {
  if (typeof EMPRESA_STATE === 'undefined') return;
  try {
    localStorage.setItem(LS_ESTADO_KEY, JSON.stringify({ ts: Date.now(), v: 1, state: EMPRESA_STATE }));
  } catch(e) {
    console.warn('[SimulApp] localStorage no disponible:', e.message);
  }
}

function restaurarEstado() {
  try {
    const raw = localStorage.getItem(LS_ESTADO_KEY);
    if (!raw) return false;
    const guardado = JSON.parse(raw);
    if (!guardado || !guardado.state || guardado.v !== 1) return false;
    const s = guardado.state;

    // Preservar datos-template del código (no provienen del usuario)
    const convenio         = JSON.parse(JSON.stringify(EMPRESA_STATE.rrhh.convenio || {}));
    const tramitesTemplate = EMPRESA_STATE.tramites.map(t => ({ ...t }));

    // Restaurar todo el estado de usuario
    Object.assign(EMPRESA_STATE, s);

    // Reapply datos immutables del código
    EMPRESA_STATE.rrhh.convenio = convenio;
    if (Array.isArray(s.tramites)) {
      EMPRESA_STATE.tramites = tramitesTemplate.map(t => {
        const sv = s.tramites.find(x => x.id === t.id);
        if (!sv) return t;
        return Object.assign({}, t, {
          estado:            sv.estado            ?? t.estado,
          fecha:             sv.fecha             ?? '',
          notas:             sv.notas             ?? '',
          documentoSubido:   sv.documentoSubido   ?? null,
          anotacionProfesor: sv.anotacionProfesor ?? '',
        });
      });
    }
    console.info('[SimulApp] Estado restaurado desde localStorage');
    return true;
  } catch(e) {
    console.warn('[SimulApp] Error al restaurar estado:', e.message);
    return false;
  }
}

function borrarEstadoGuardado() {
  try { localStorage.removeItem(LS_ESTADO_KEY); } catch(e) {}
}

/* ============================================================
   CARGA DE LA APP
   ============================================================ */
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

  // ── Restaurar estado guardado (si existe) ──
  restaurarEstado();

  // ── Guardado automático periódico (safety-net para cambios en inputs) ──
  setInterval(guardarEstado, 15000);

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
  // Persistir estado tras cada navegación/acción
  guardarEstado();
}

/* ============================================================
   VISTA: DASHBOARD
   ============================================================ */
