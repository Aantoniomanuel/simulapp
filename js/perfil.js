function vistaPerfil() {
  return APP.rolActivo === 'alumno' ? vistaPerfilAlumno() : vistaPerfilDocente();
}

/* ─────────────────────── PERFIL ALUMNO ─────────────────────── */
function vistaPerfilAlumno() {
  const u   = APP.usuario || {};
  const p   = APP.perfil  || {};
  const emp = EMPRESA_STATE.datos;
  const ge  = EMPRESA_STATE.gestion;
  const ae  = EMPRESA_STATE.autoevaluacion || {};
  const ini = (u.displayName || u.email || 'AL').substring(0,2).toUpperCase();
  const tab = window.PERFIL_STATE.tab || 'progreso';

  /* ── Calcular progreso real por RA ─────────────────────────── */
  const progresoPlan = typeof calcProgresoPlan === 'function' ? calcProgresoPlan() : 0;
  const tareasTotal  = ge.tareas.length;
  const tareasEval   = ge.tareas.filter(t => t.estado === 'evaluada' || t.estado === 'entregada').length;
  const correos      = EMPRESA_STATE.mensajeria.correos.length;
  const txComp       = EMPRESA_STATE.mercado.transacciones.filter(t => t.estado === 'completada').length;
  const autoNotas    = Object.values(ae.calificaciones || {});
  const autoMedia    = autoNotas.length ? (autoNotas.reduce((s,v)=>s+v,0)/autoNotas.length).toFixed(1) : '—';

  const ras = [
    { id:'RA1', label:'Emprendimiento e iniciativa', icono:'💡', modulos:['emprendimiento'],
      desc:'Identificar oportunidades, analizar el entorno, desarrollar ideas de negocio.',
      pct: Math.min(100, Math.round(progresoPlan * 0.15)) },
    { id:'RA2', label:'Análisis del entorno', icono:'🔍', modulos:['plan-ap3','plan-ap4'],
      desc:'DAFO, competidores, sector, canvas, segmentación de clientes.',
      pct: Math.min(100, Math.round(progresoPlan * 0.18)) },
    { id:'RA3', label:'Constitución empresarial', icono:'🏢', modulos:['empresa','tramites'],
      desc:'Forma jurídica, trámites, escritura, registro, estatutos sociales.',
      pct: (() => { const tr = EMPRESA_STATE.tramites||[]; const c=tr.filter(t=>t.estado==='completado').length; return tr.length?Math.round(c/tr.length*100):0; })() },
    { id:'RA4', label:'Economía financiera', icono:'📊', modulos:['plan-ap7'],
      desc:'Inversión, financiación, umbral, TIR, ratios, cuenta de resultados.',
      pct: Math.min(100, Math.round(progresoPlan * 0.22)) },
    { id:'RA5', label:'Fiscalidad empresarial', icono:'⚖️', modulos:['plan-ap5'],
      desc:'IVA, IS, obligaciones tributarias, modelos fiscales.',
      pct: Math.min(100, Math.round(progresoPlan * 0.12)) },
    { id:'RA6', label:'Gestión operativa', icono:'⚙️', modulos:['gestion','mensajeria'],
      desc:'Comunicación profesional, nóminas, facturas, tareas, mercado intergrupal.',
      pct: tareasTotal ? Math.round(tareasEval/tareasTotal*100) : 0 },
  ];

  const colorRA = pct => pct >= 80 ? 'var(--verde-500)' : pct >= 50 ? 'var(--verde-300)' : pct >= 25 ? '#fbbf24' : 'var(--gris-200)';

  /* ── Historial de tareas ──────────────────────────────────── */
  const historialHTML = () => {
    const tareas = [...ge.tareas].sort((a,b) => (b.semana||0)-(a.semana||0));
    if (!tareas.length) return `<div style="text-align:center;padding:2rem;color:var(--gris-400)"><div style="font-size:2rem">📋</div><p style="margin-top:8px">Sin tareas registradas todavía</p></div>`;
    const DEPTS = {direccion:'🎯',rrhh:'👥',comercial:'🧾',contabilidad:'📊',fiscal:'⚖️'};
    const ESTADOS = { pendiente:'🔴 Pendiente', 'en-curso':'🟡 En curso', entregada:'🔵 Entregada', evaluada:'🟢 Evaluada' };
    return `<div style="overflow-x:auto">
    <table class="historial-tabla">
      <thead><tr>
        <th>Semana</th><th>Tarea</th><th>Departamento</th><th>CE</th><th>Estado</th><th>Nota</th>
      </tr></thead>
      <tbody>
        ${tareas.map(t => `<tr>
          <td style="color:var(--gris-500);font-size:.75rem">S${t.semana||'—'}</td>
          <td style="font-weight:500;color:var(--gris-800)">${t.titulo}</td>
          <td>${DEPTS[t.departamento]||'📋'} <span style="font-size:.75rem">${t.departamento||'—'}</span></td>
          <td><span class="ra-chip" style="font-size:.62rem">${t.ce||t.ra||'RA6'}</span></td>
          <td style="font-size:.75rem">${ESTADOS[t.estado]||t.estado}</td>
          <td style="font-weight:700;color:${t.nota>=5?'var(--verde-700)':'#dc2626'}">${t.nota!=null?t.nota:t.estado==='evaluada'?'✓':'—'}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
  };

  /* ── Preferencias ──────────────────────────────────────────── */
  const prefsHTML = () => {
    const prefs = window.PERFIL_PREFS || { notifCorreo:true, notifTareas:true, notifMercado:true, notifFiscal:true, modoOscuro:false, ayudaAuto:true };
    window.PERFIL_PREFS = prefs;
    const tog = (key, label, desc) => `
    <div class="pref-item">
      <div class="pref-item-info"><h5>${label}</h5><p>${desc}</p></div>
      <label class="toggle-switch">
        <input type="checkbox" ${prefs[key]?'checked':''} onchange="window.PERFIL_PREFS['${key}']=this.checked;mostrarToast('Preferencia guardada','exito')">
        <span class="toggle-slider"></span>
      </label>
    </div>`;
    return `
    <div class="pref-grupo">
      <div class="pref-grupo-titulo">🔔 Notificaciones</div>
      ${tog('notifCorreo','Correos de empresa','Avisa cuando llega un nuevo correo al buzón')}
      ${tog('notifTareas','Tareas y evaluaciones','Avisa cuando el docente publica o evalúa una tarea')}
      ${tog('notifMercado','Eventos de mercado','Avisa sobre nuevas transacciones y eventos intergrupales')}
      ${tog('notifFiscal','Recordatorios fiscales','Alertas de plazos tributarios (Mod. 303, 200...)')}
    </div>
    <div class="pref-grupo">
      <div class="pref-grupo-titulo">🎨 Apariencia y uso</div>
      ${tog('ayudaAuto','Ayuda contextual automática','Abre el panel de ayuda al entrar en módulos nuevos')}
    </div>
    <div class="pref-grupo">
      <div class="pref-grupo-titulo">🔒 Cuenta</div>
      <div class="pref-item">
        <div class="pref-item-info"><h5>Correo electrónico</h5><p>${u.email || '—'}</p></div>
        <button class="btn-secundario" style="font-size:.75rem;padding:5px 10px" onclick="mostrarToast('Cambia tu contraseña desde el panel del IES','')">Cambiar contraseña</button>
      </div>
      <div class="pref-item">
        <div class="pref-item-info"><h5>Restablecer guía de inicio</h5><p>Vuelve a ver el tour de bienvenida la próxima vez que entres</p></div>
        <button class="btn-secundario" style="font-size:.75rem;padding:5px 10px" onclick="try{localStorage.removeItem('simulapp_tour_visto')}catch(e){};mostrarToast('✓ La guía se mostrará en tu próximo acceso','exito')">Restablecer</button>
      </div>
    </div>`;
  };

  /* ── Layout ─────────────────────────────────────────────────── */
  return `
  <div class="seccion-header">
    <div><h2>👤 Mi perfil</h2><p>Información personal, progreso académico y preferencias</p></div>
  </div>

  <div class="perfil-layout">

    <!-- Tarjeta identidad -->
    <div class="perfil-card-id">
      <div class="perfil-card-id-header">
        <div class="perfil-avatar-wrap">
          <div class="perfil-avatar" title="Cambiar avatar">${ini}</div>
          <div class="perfil-avatar-edit" title="Editar foto">✏️</div>
        </div>
        <div class="perfil-nombre-header">${u.displayName || 'Alumno/a'}</div>
        <div class="perfil-rol-header">🎓 Alumno/a · SimulApp 2025-26</div>
      </div>
      <div class="perfil-card-id-body">
        <div class="perfil-dato">
          <span class="perfil-dato-icon">📧</span>
          <div><div class="perfil-dato-label">Correo</div><div class="perfil-dato-val">${u.email||'—'}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">🏢</span>
          <div><div class="perfil-dato-label">Empresa</div><div class="perfil-dato-val">${emp.nombre||'Sin configurar'}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">👥</span>
          <div><div class="perfil-dato-label">Grupo</div><div class="perfil-dato-val">${p.grupo||'—'}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">⚙️</span>
          <div><div class="perfil-dato-label">Departamento actual</div><div class="perfil-dato-val">${emp.departamento||'Sin asignar'}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">📅</span>
          <div><div class="perfil-dato-label">Semana del curso</div><div class="perfil-dato-val">Semana ${ge.semanaActual||1} · T${ge.trimestreActual||1}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">📊</span>
          <div><div class="perfil-dato-label">Plan de empresa</div><div class="perfil-dato-val">${progresoPlan}% completado</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">🪞</span>
          <div><div class="perfil-dato-label">Autoevaluación media</div><div class="perfil-dato-val">${autoMedia} / 4</div></div>
        </div>
        <div style="margin-top:1rem">
          <button class="btn-accion" style="width:100%;font-size:.8rem" onclick="vbAbrir()">🎓 Ver guía de inicio</button>
        </div>
      </div>
    </div>

    <!-- Panel derecho con tabs -->
    <div>
      <div class="perfil-tabs">
        <button class="perfil-tab ${tab==='progreso'?'activo':''}" onclick="window.PERFIL_STATE.tab='progreso';renderVista('perfil')">📊 Progreso por RA</button>
        <button class="perfil-tab ${tab==='historial'?'activo':''}" onclick="window.PERFIL_STATE.tab='historial';renderVista('perfil')">📋 Historial de tareas</button>
        <button class="perfil-tab ${tab==='prefs'?'activo':''}" onclick="window.PERFIL_STATE.tab='prefs';renderVista('perfil')">⚙️ Preferencias</button>
      </div>

      <!-- Progreso por RA -->
      <div class="perfil-section ${tab==='progreso'?'activo':''}">
        <div class="ra-progreso-grid">
          ${ras.map(ra => `
          <div class="ra-card" onclick="irA('conceptos')" style="cursor:pointer" title="Ver conceptos de ${ra.id}">
            <div class="ra-card-header">
              <div class="ra-card-titulo">${ra.icono} ${ra.id}</div>
              <div class="ra-card-pct">${ra.pct}%</div>
            </div>
            <div class="ra-card-desc">${ra.label}</div>
            <div class="ra-card-bar">
              <div class="ra-card-fill" style="width:${ra.pct}%;background:${colorRA(ra.pct)}"></div>
            </div>
          </div>`).join('')}
        </div>

        <!-- Resumen estadístico -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-top:.5rem">
          ${[
            ['📧', correos, 'Correos recibidos'],
            ['🔄', txComp, 'Transacciones completadas'],
            ['✅', tareasEval, 'Tareas entregadas/evaluadas'],
            ['📋', progresoPlan+'%', 'Plan de empresa'],
          ].map(([ico,val,lbl]) => `
          <div style="background:var(--blanco);border:1px solid var(--gris-100);border-radius:var(--radio-md);padding:.85rem;text-align:center">
            <div style="font-size:1.2rem">${ico}</div>
            <div style="font-size:1.3rem;font-weight:800;color:var(--verde-700);margin:4px 0">${val}</div>
            <div style="font-size:.68rem;color:var(--gris-500)">${lbl}</div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Historial de tareas -->
      <div class="perfil-section ${tab==='historial'?'activo':''}">
        <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
          ${historialHTML()}
        </div>
      </div>

      <!-- Preferencias -->
      <div class="perfil-section ${tab==='prefs'?'activo':''}">
        ${prefsHTML()}
      </div>
    </div>

  </div>`;
}

/* ─────────────────────── PERFIL DOCENTE ─────────────────────── */
function vistaPerfilDocente() {
  const u   = APP.usuario || {};
  const ini = (u.displayName || u.email || 'DO').substring(0,2).toUpperCase();
  const tab = window.PERFIL_STATE.tab || 'alumnos';
  const ge  = EMPRESA_STATE.gestion;
  const cor = EMPRESA_STATE.mensajeria.correos;
  const tx  = EMPRESA_STATE.mercado.transacciones;

  /* ── Modo demo/real ── */
  if (!window.PERFIL_PROF) window.PERFIL_PROF = { modoDemo: true };
  const modoDemo = window.PERFIL_PROF.modoDemo;

  /* ── Datos reales del aula (editables por el docente) ── */
  if (!window.PERFIL_PROF.alumnosReales) {
    window.PERFIL_PROF.alumnosReales = [];
    window.PERFIL_PROF.gruposReales  = [];
    window.PERFIL_PROF.configReal    = { centro:'', curso:'2025-26', sector:'', numGrupos:1 };
  }
  const alumnosReales = window.PERFIL_PROF.alumnosReales;
  const configReal    = window.PERFIL_PROF.configReal;

  /* ── Lista de alumnos demo ── */
  const ALUMNOS_DEMO = [
    { id:'a1', nombre:'Ana García López',    grupo:'G1', dept:'Contabilidad', semana:8, planPct:62, tareasEv:5, autoMedia:3.2, activo:true },
    { id:'a2', nombre:'Carlos Martínez Ruiz',grupo:'G1', dept:'Comercial',    semana:8, planPct:45, tareasEv:3, autoMedia:2.8, activo:true },
    { id:'a3', nombre:'Laura Sánchez Vega',  grupo:'G2', dept:'RRHH',         semana:8, planPct:78, tareasEv:7, autoMedia:3.7, activo:true },
    { id:'a4', nombre:'Miguel Torres Alba',  grupo:'G2', dept:'Fiscal',       semana:8, planPct:31, tareasEv:2, autoMedia:2.1, activo:false },
    { id:'a5', nombre:'Sofía Romero Gil',    grupo:'G3', dept:'Dirección',    semana:8, planPct:88, tareasEv:8, autoMedia:3.9, activo:true },
    { id:'a6', nombre:'Pablo Jiménez Cruz',  grupo:'G3', dept:'Contabilidad', semana:8, planPct:55, tareasEv:4, autoMedia:3.0, activo:true },
  ];

  const alumnos    = modoDemo ? ALUMNOS_DEMO : alumnosReales;
  const notaColor  = n => n >= 3.5 ? 'var(--verde-700)' : n >= 2.5 ? '#d97706' : '#dc2626';

  /* ── BANNER MODO ── */
  const bannerModo = `
  <div style="display:flex;align-items:center;gap:10px;padding:.65rem 1rem;border-radius:var(--radio-md);margin-bottom:1.25rem;
    background:${modoDemo?'#fef3c7':'var(--verde-50)'};border:1px solid ${modoDemo?'#fde68a':'var(--verde-200)'}">
    <span style="font-size:.82rem;font-weight:700;color:${modoDemo?'#92400e':'var(--verde-800)'}">
      ${modoDemo?'🎭 Modo demo — datos ficticios de ejemplo':'✅ Modo real — datos de tu aula'}
    </span>
    <span style="font-size:.75rem;color:${modoDemo?'#b45309':'var(--verde-600)'};flex:1">
      ${modoDemo
        ? 'Estás viendo datos de ejemplo. Cambia a Modo real para introducir tus alumnos.'
        : alumnosReales.length === 0
          ? 'Añade tus alumnos reales en la pestaña "👥 Mis alumnos".'
          : alumnosReales.length + ' alumno' + (alumnosReales.length!==1?'s':'') + ' configurados.'}
    </span>
    <button onclick="window.PERFIL_PROF.modoDemo=!window.PERFIL_PROF.modoDemo;window.PERFIL_STATE.tab='alumnos';renderVista('perfil')"
      style="padding:5px 14px;border-radius:var(--radio-sm);border:none;cursor:pointer;font-size:.75rem;font-weight:600;
        background:${modoDemo?'#d97706':'var(--verde-600)'};color:white;white-space:nowrap">
      ${modoDemo?'Cambiar a modo real →':'← Volver a demo'}
    </button>
  </div>`;

  /* ══════════════════════════════════════════════════════════════
     VISTA REAL
  ══════════════════════════════════════════════════════════════ */

  /* Tabla de alumnos REAL — editable */
  const alumnosRealHTML = () => {
    const grupos = [...new Set(alumnosReales.map(a=>a.grupo||'G1'))].sort();

    const addAlumno = () => {
      alumnosReales.push({ id:'r'+Date.now(), nombre:'', grupo:'G1', dept:'', email:'', activo:true, planPct:0, tareasEv:0, autoMedia:0 });
      renderVista('perfil');
    };

    const removeAlumno = id => {
      const idx = alumnosReales.findIndex(a=>a.id===id);
      if (idx>-1) { alumnosReales.splice(idx,1); renderVista('perfil'); }
    };

    if (alumnosReales.length === 0) return `
    <div style="text-align:center;padding:3rem 1rem">
      <div style="font-size:2.5rem;margin-bottom:.75rem">👥</div>
      <div style="font-size:.95rem;font-weight:600;color:var(--gris-700);margin-bottom:.5rem">Tu aula real está vacía</div>
      <div style="font-size:.82rem;color:var(--gris-500);margin-bottom:1.5rem">Añade a tus alumnos uno a uno o pégalos desde un listado de Séneca.</div>
      <button class="btn-accion" style="font-size:.85rem" onclick="(()=>{window.PERFIL_PROF.alumnosReales.push({id:'r'+Date.now(),nombre:'',grupo:'G1',dept:'',email:'',activo:true,planPct:0,tareasEv:0,autoMedia:0});renderVista('perfil')})()">➕ Añadir primer alumno</button>
    </div>`;

    return `
    <div style="overflow-x:auto;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden;margin-bottom:.75rem">
      <table style="width:100%;border-collapse:collapse;font-size:.8rem">
        <thead><tr style="background:var(--gris-50);border-bottom:1.5px solid var(--gris-100)">
          <th style="padding:8px 12px;text-align:left;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Nombre completo</th>
          <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Grupo</th>
          <th style="padding:8px 8px;text-align:left;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Correo</th>
          <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Departamento</th>
          <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Activo</th>
          <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase"></th>
        </tr></thead>
        <tbody>
          ${alumnosReales.map((a,i) => `
          <tr style="border-bottom:1px solid var(--gris-50)">
            <td style="padding:6px 12px">
              <input type="text" value="${a.nombre||''}" placeholder="Apellidos, Nombre"
                style="width:100%;border:1.5px solid var(--gris-200);border-radius:6px;padding:5px 8px;font-size:.8rem;font-family:var(--fuente-cuerpo)"
                oninput="window.PERFIL_PROF.alumnosReales[${i}].nombre=this.value"
                onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'">
            </td>
            <td style="padding:6px 8px;text-align:center">
              <select style="border:1.5px solid var(--gris-200);border-radius:6px;padding:5px 6px;font-size:.78rem;font-family:var(--fuente-cuerpo)"
                onchange="window.PERFIL_PROF.alumnosReales[${i}].grupo=this.value">
                ${['G1','G2','G3','G4','G5'].map(g=>`<option value="${g}" ${a.grupo===g?'selected':''}>${g}</option>`).join('')}
              </select>
            </td>
            <td style="padding:6px 8px">
              <input type="email" value="${a.email||''}" placeholder="alumno@iescantillana.es"
                style="width:100%;border:1.5px solid var(--gris-200);border-radius:6px;padding:5px 8px;font-size:.78rem;font-family:var(--fuente-cuerpo)"
                oninput="window.PERFIL_PROF.alumnosReales[${i}].email=this.value"
                onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'">
            </td>
            <td style="padding:6px 8px;text-align:center">
              <select style="border:1.5px solid var(--gris-200);border-radius:6px;padding:5px 6px;font-size:.78rem;font-family:var(--fuente-cuerpo)"
                onchange="window.PERFIL_PROF.alumnosReales[${i}].dept=this.value">
                <option value="">—</option>
                ${['Dirección','RRHH','Comercial','Contabilidad','Fiscal'].map(d=>`<option value="${d}" ${a.dept===d?'selected':''}>${d}</option>`).join('')}
              </select>
            </td>
            <td style="padding:6px 8px;text-align:center">
              <label class="toggle-switch" style="width:36px;height:20px">
                <input type="checkbox" ${a.activo?'checked':''}
                  onchange="window.PERFIL_PROF.alumnosReales[${i}].activo=this.checked">
                <span class="toggle-slider"></span>
              </label>
            </td>
            <td style="padding:6px 8px;text-align:center">
              <button onclick="(()=>{window.PERFIL_PROF.alumnosReales.splice(${i},1);renderVista('perfil')})()"
                style="background:none;border:none;cursor:pointer;color:var(--gris-400);font-size:.85rem;padding:4px" title="Eliminar">✕</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <button class="btn-accion" style="font-size:.8rem;padding:7px 14px"
        onclick="(()=>{window.PERFIL_PROF.alumnosReales.push({id:'r'+Date.now(),nombre:'',grupo:'G1',dept:'',email:'',activo:true,planPct:0,tareasEv:0,autoMedia:0});renderVista('perfil')})()">
        ➕ Añadir alumno
      </button>
      <button class="btn-secundario" style="font-size:.8rem;padding:7px 14px"
        onclick="mostrarToast('✓ Lista de alumnos guardada en esta sesión','exito')">
        💾 Guardar lista
      </button>
      <span style="font-size:.75rem;color:var(--gris-400);margin-left:4px">${alumnosReales.length} alumno${alumnosReales.length!==1?'s':''}</span>
    </div>`;
  };

  /* Estadísticas REAL */
  const statsRealHTML = () => {
    if (alumnosReales.length === 0) return `
    <div style="text-align:center;padding:2rem;color:var(--gris-400);font-size:.85rem">
      Añade alumnos en la pestaña "👥 Mis alumnos" para ver estadísticas reales.
    </div>`;
    const activos = alumnosReales.filter(a=>a.activo).length;
    const grupos = [...new Set(alumnosReales.map(a=>a.grupo||'G1'))].sort();
    return `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:1.25rem">
      ${[
        ['🎓', alumnosReales.length, 'Alumnos totales', activos+' activos'],
        ['👥', grupos.length, 'Grupos configurados', grupos.join(' · ') || '—'],
        ['📅', 'S'+ge.semanaActual+' · T'+ge.trimestreActual, 'Semana del curso', 'Según configuración'],
      ].map(([ico,val,lbl,sub]) => `
      <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1rem;display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;border-radius:10px;background:var(--verde-100);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${ico}</div>
        <div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--verde-700)">${val}</div>
          <div style="font-size:.75rem;font-weight:600;color:var(--gris-700)">${lbl}</div>
          <div style="font-size:.68rem;color:var(--gris-400)">${sub}</div>
        </div>
      </div>`).join('')}
    </div>
    <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1rem">
      <div style="font-size:.78rem;font-weight:700;color:var(--gris-700);margin-bottom:.75rem">👥 Distribución por grupo</div>
      ${grupos.map(g => {
        const almsG = alumnosReales.filter(a=>a.grupo===g);
        return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:.8rem">
          <span style="width:28px;height:28px;border-radius:6px;background:var(--verde-100);color:var(--verde-800);font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${g}</span>
          <span style="flex:1;color:var(--gris-700)">${almsG.length} alumno${almsG.length!==1?'s':''}</span>
          <div style="display:flex;flex-wrap:wrap;gap:3px">
            ${almsG.map(a=>`<span style="font-size:.65rem;padding:1px 6px;border-radius:20px;background:var(--gris-100);color:var(--gris-600)">${(a.nombre||'Sin nombre').split(',')[0]||a.nombre}</span>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
  };

  /* Configuración REAL */
  const configRealHTML = () => `
  <div style="display:flex;flex-direction:column;gap:1rem">
    <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1.25rem">
      <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:1rem">🏫 Datos del centro y curso</div>
      <div class="config-grid">
        <div class="config-campo"><label>Centro educativo</label>
          <input type="text" value="${configReal.centro||''}" placeholder="IES Cantillana"
            oninput="window.PERFIL_PROF.configReal.centro=this.value"></div>
        <div class="config-campo"><label>Curso académico</label>
          <input type="text" value="${configReal.curso||'2025-26'}" placeholder="2025-26"
            oninput="window.PERFIL_PROF.configReal.curso=this.value"></div>
        <div class="config-campo"><label>Sector asignado a la simulación</label>
          <input type="text" value="${configReal.sector||''}" placeholder="Ej: Comercio agroalimentario"
            oninput="window.PERFIL_PROF.configReal.sector=this.value;EMPRESA_STATE.config.sector=this.value"></div>
        <div class="config-campo"><label>Semana actual del curso</label>
          <input type="number" min="1" max="35" value="${ge.semanaActual||1}"
            oninput="EMPRESA_STATE.gestion.semanaActual=parseInt(this.value)||1"></div>
        <div class="config-campo"><label>Trimestre en curso</label>
          <select onchange="EMPRESA_STATE.gestion.trimestreActual=parseInt(this.value)">
            ${[1,2,3].map(t=>`<option value="${t}" ${ge.trimestreActual===t?'selected':''}>Trimestre ${t}</option>`).join('')}
          </select></div>
        <div class="config-campo"><label>Número de grupos del aula</label>
          <input type="number" min="1" max="8" value="${configReal.numGrupos||1}"
            oninput="window.PERFIL_PROF.configReal.numGrupos=parseInt(this.value)||1"></div>
      </div>
    </div>

    <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1.25rem">
      <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:1rem">🏢 Nombres de las empresas por grupo</div>
      <div class="config-grid">
        ${['G1','G2','G3','G4','G5','G6','G7','G8'].slice(0, configReal.numGrupos||1).map(g => `
        <div class="config-campo"><label>Empresa ${g}</label>
          <input type="text" placeholder="Ej: Distribuciones Sur S.L."
            value="${(EMPRESA_STATE.config.grupos||{})[g]||''}"
            oninput="if(!EMPRESA_STATE.config.grupos)EMPRESA_STATE.config.grupos={};EMPRESA_STATE.config.grupos['${g}']=this.value"></div>`).join('')}
      </div>
      <button class="btn-accion" style="margin-top:1rem;font-size:.82rem"
        onclick="mostrarToast('✓ Configuración guardada','exito')">💾 Guardar configuración</button>
    </div>

    <div style="background:var(--verde-50);border:1px solid var(--verde-200);border-radius:var(--radio-lg);padding:1rem;font-size:.8rem;color:var(--verde-800);line-height:1.6">
      <strong>💡 Próximo paso:</strong> Para que los datos persistan entre sesiones, activa Firebase en el código fuente cambiando <code>MODO_DEMO = false</code>.
    </div>
    ${htmlGestionCurso()}
  </div>`;

  /* Accesos REAL */
  const accesosRealHTML = () => `
  <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1.25rem;margin-bottom:1rem">
    <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:.75rem">🔒 Accesos registrados en Supabase</div>
    ${alumnosReales.length === 0
      ? `<div style="text-align:center;padding:1.5rem;color:var(--gris-400);font-size:.82rem">Añade alumnos primero en la pestaña "👥 Mis alumnos"</div>`
      : alumnosReales.map(a => `
      <div class="acceso-item">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--verde-500);color:white;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">
          ${(a.nombre||'?').substring(0,2).toUpperCase()}
        </div>
        <div class="acceso-info">
          <strong>${a.nombre||'Sin nombre'}</strong>
          <span>${a.email||'Sin correo'} · Alumno/a · Grupo ${a.grupo||'—'}</span>
        </div>
        <span class="acceso-estado ${a.activo?'activo':'inactivo'}">${a.activo?'Activo':'Inactivo'}</span>
      </div>`).join('')}
  </div>
  <div style="padding:1rem;background:var(--gris-50);border:1px solid var(--gris-200);border-radius:var(--radio-lg);font-size:.78rem;color:var(--gris-600);line-height:1.7">
    <strong>Para activar accesos reales:</strong><br>
    1. Crea las cuentas en Supabase Authentication con el correo de cada alumno<br>
    2. En la tabla <code>perfiles</code> asigna <code>rol = 'alumno'</code><br>
    3. En <code>alumnos_grupos</code> vincula cada alumno a su grupo<br>
    4. Cambia <code>MODO_DEMO = false</code> en el código fuente
  </div>`;

  /* ══════════════════════════════════════════════════════════════
     VISTA DEMO (la original)
  ══════════════════════════════════════════════════════════════ */

  const alumnosDemoHTML = () => `
  <div style="overflow-x:auto;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
    <table class="alumnos-tabla">
      <thead><tr>
        <th>Alumno/a</th><th>Grupo</th><th>Departamento</th>
        <th>Plan</th><th>Tareas eval.</th><th>Autoevaluación</th><th>Estado</th>
      </tr></thead>
      <tbody>
        ${ALUMNOS_DEMO.map(a => `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="alumno-avatar-mini">${a.nombre.substring(0,2).toUpperCase()}</div>
              <div>
                <div style="font-weight:600;color:var(--gris-800)">${a.nombre}</div>
                <div style="font-size:.68rem;color:var(--gris-400)">S${a.semana} del curso</div>
              </div>
            </div>
          </td>
          <td><span class="ra-chip">${a.grupo}</span></td>
          <td style="font-size:.78rem">${a.dept}</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:48px;height:5px;background:var(--gris-100);border-radius:3px;overflow:hidden">
                <div style="width:${a.planPct}%;height:100%;background:${a.planPct>=70?'var(--verde-500)':'#fbbf24'};border-radius:3px"></div>
              </div>
              <span style="font-size:.75rem;font-weight:600">${a.planPct}%</span>
            </div>
          </td>
          <td style="text-align:center;font-weight:700;color:var(--verde-700)">${a.tareasEv}</td>
          <td style="text-align:center;font-weight:700;color:${notaColor(a.autoMedia)}">${a.autoMedia}</td>
          <td><span class="acceso-estado ${a.activo?'activo':'inactivo'}">${a.activo?'Activo':'Inactivo'}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  const statsDemoHTML = () => {
    const activos = ALUMNOS_DEMO.filter(a=>a.activo).length;
    const mediaGlobal = (ALUMNOS_DEMO.reduce((s,a)=>s+a.autoMedia,0)/ALUMNOS_DEMO.length).toFixed(1);
    const mediaPlan   = Math.round(ALUMNOS_DEMO.reduce((s,a)=>s+a.planPct,0)/ALUMNOS_DEMO.length);
    const totalTareas = ALUMNOS_DEMO.reduce((s,a)=>s+a.tareasEv,0);
    return `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;margin-bottom:1.25rem">
      ${[
        ['🎓', ALUMNOS_DEMO.length, 'Alumnos totales', activos+' activos hoy'],
        ['📊', mediaPlan+'%', 'Media plan empresa', 'Progreso medio del aula'],
        ['🪞', mediaGlobal+'/4', 'Autoevaluación media', 'Escala 1-4'],
        ['✅', totalTareas, 'Tareas entregadas', 'Acumulado del curso'],
      ].map(([ico,val,lbl,sub]) => `
      <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1rem;display:flex;align-items:center;gap:12px">
        <div style="width:44px;height:44px;border-radius:10px;background:var(--verde-100);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${ico}</div>
        <div>
          <div style="font-size:1.3rem;font-weight:800;color:var(--verde-700)">${val}</div>
          <div style="font-size:.78rem;font-weight:600;color:var(--gris-700)">${lbl}</div>
          <div style="font-size:.7rem;color:var(--gris-400)">${sub}</div>
        </div>
      </div>`).join('')}
    </div>
    <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1rem">
      <div style="font-size:.78rem;font-weight:700;color:var(--gris-700);margin-bottom:.75rem">📊 Progreso plan de empresa por alumno</div>
      ${ALUMNOS_DEMO.map(a => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:7px;font-size:.78rem">
        <div class="alumno-avatar-mini">${a.nombre.substring(0,2).toUpperCase()}</div>
        <span style="width:160px;color:var(--gris-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.nombre.split(' ')[0]} ${a.nombre.split(' ')[1]||''}</span>
        <div style="flex:1;height:6px;background:var(--gris-100);border-radius:3px;overflow:hidden">
          <div style="width:${a.planPct}%;height:100%;background:${a.planPct>=70?'var(--verde-500)':a.planPct>=40?'#fbbf24':'#ef4444'};border-radius:3px"></div>
        </div>
        <span style="font-weight:700;color:${a.planPct>=70?'var(--verde-700)':a.planPct>=40?'#d97706':'#dc2626'};width:32px;text-align:right">${a.planPct}%</span>
      </div>`).join('')}
    </div>`;
  };

  /* ── Acciones de gestión de curso (compartido demo/real) ── */
  const htmlGestionCurso = () => {
    const cursoActual = EMPRESA_STATE.config.cursoAcademico || '2025-26';
    return `
    <!-- Curso académico -->
    <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1.25rem">
      <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:.4rem">📅 Curso académico</div>
      <p style="font-size:.78rem;color:var(--gris-500);margin:0 0 1rem">Modifica el año del curso para reutilizar la plataforma en cursos posteriores. El cambio se refleja en cabeceras, exportaciones e informes.</p>
      <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap">
        <div style="display:flex;flex-direction:column;gap:4px">
          <label style="font-size:.72rem;font-weight:600;color:var(--gris-600)">Curso actual</label>
          <input id="input-curso-academico" type="text" value="${cursoActual}" placeholder="2025-26"
            style="width:120px;padding:7px 10px;border:1px solid var(--gris-200);border-radius:var(--radio-md);font-size:.85rem;font-weight:600">
        </div>
        <button class="btn-accion" style="font-size:.82rem;margin-top:16px" onclick="guardarCursoAcademico()">💾 Guardar curso</button>
      </div>
    </div>

    <!-- Copia de seguridad -->
    <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1.25rem">
      <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:.4rem">🗂️ Copia de seguridad</div>
      <p style="font-size:.78rem;color:var(--gris-500);margin:0 0 1rem">Descarga un archivo JSON con todos los datos del curso: empresa, tareas, evaluaciones, correos, transacciones y calificaciones. Guárdalo como respaldo antes de comenzar un curso nuevo.</p>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap;align-items:center">
        <button class="btn-secundario" style="font-size:.82rem" onclick="generarBackupCurso()">⬇️ Descargar copia</button>
        <label style="display:inline-flex;align-items:center;gap:.4rem;cursor:pointer;border:1px solid var(--gris-300);border-radius:var(--radio-md);padding:7px 14px;font-size:.82rem;font-weight:600;color:var(--gris-700);background:var(--blanco)">
          📂 Restaurar copia
          <input type="file" accept=".json" style="display:none" onchange="restaurarBackup(this)">
        </label>
      </div>
      <p style="font-size:.72rem;color:var(--gris-400);margin:.75rem 0 0">Al restaurar se reemplazarán todos los datos actuales. Se te pedirá confirmación.</p>
    </div>

    <!-- Activar Firebase real -->
    <div style="background:${MODO_DEMO?'#fff7ed':'#f0fdf4'};border:1px solid ${MODO_DEMO?'#fed7aa':'#bbf7d0'};border-radius:var(--radio-lg);padding:1.25rem">
      <div style="display:flex;align-items:center;gap:.5rem;font-size:.82rem;font-weight:700;color:${MODO_DEMO?'#9a3412':'#166534'};margin-bottom:.4rem">
        ${MODO_DEMO?'🎭 Modo demo activo':'✅ Modo Firebase real activo'}
      </div>
      <p style="font-size:.78rem;color:var(--gris-600);margin:0 0 1rem">
        ${MODO_DEMO
          ? 'Los datos no se guardan en la nube. Activa el modo real para que alumnos y profesor tengan cuentas propias y los datos persistan en Firebase.'
          : 'La app usa Firebase Auth y Firestore. Los datos se guardan en la nube y cada usuario accede con su propia cuenta.'}
      </p>
      ${MODO_DEMO ? `
      <div style="background:white;border:1px solid #fed7aa;border-radius:var(--radio-md);padding:1rem;margin-bottom:1rem;font-size:.78rem;line-height:1.8">
        <strong style="color:#9a3412">Pasos para activar el modo real:</strong><br>
        <span id="step-auth">⏳</span> <strong>1.</strong> En <a href="https://console.firebase.google.com/project/simulapp-ies-cantillana/authentication/providers" target="_blank" style="color:#1d4ed8">Firebase Console → Authentication → Proveedores</a> activa <em>Correo / contraseña</em><br>
        <span id="step-conn">⏳</span> <strong>2.</strong> Pulsa "Probar conexión" para verificar que Firebase responde<br>
        <span>➡️</span> <strong>3.</strong> Pulsa "Activar modo real" — la app se recargará en modo Firebase<br>
        <span>👤</span> <strong>4.</strong> Crea las cuentas de alumnos y profesor en <a href="https://console.firebase.google.com/project/simulapp-ies-cantillana/authentication/users" target="_blank" style="color:#1d4ed8">Firebase Console → Authentication → Usuarios</a>
      </div>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap;align-items:center">
        <button class="btn-secundario" style="font-size:.82rem" onclick="probarConexionFirebase()">🔍 Probar conexión</button>
        <button id="btn-activar-real" class="btn-accion" style="font-size:.82rem;background:#d97706" disabled onclick="activarModoReal()">⚡ Activar modo real</button>
      </div>
      <div id="resultado-test-firebase" style="margin-top:.6rem;font-size:.75rem;color:var(--gris-500)"></div>
      ` : `
      <button class="btn-secundario" style="font-size:.82rem;border-color:#ef4444;color:#dc2626" onclick="volverADemo()">↩️ Volver a modo demo</button>
      `}
    </div>

    <!-- Reiniciar plataforma -->
    <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:var(--radio-lg);padding:1.25rem">
      <div style="font-size:.82rem;font-weight:700;color:#991b1b;margin-bottom:.4rem">⚠️ Poner a cero la plataforma</div>
      <p style="font-size:.78rem;color:#7f1d1d;margin:0 0 1rem">Elimina todos los datos del curso actual (empresa, tareas, correos, evaluaciones, transacciones) para comenzar un curso nuevo desde cero. <strong>Esta acción no se puede deshacer.</strong> Se conservan el sector, los nombres de grupos y los pesos de evaluación configurados.</p>
      <button style="background:#dc2626;color:white;border:none;border-radius:var(--radio-md);padding:8px 18px;font-size:.82rem;font-weight:600;cursor:pointer"
        onclick="confirmarReinicioPlataforma()">🗑️ Poner a cero</button>
    </div>`;
  };

  const configDemoHTML = () => {
    const cfg = EMPRESA_STATE.config;
    return `
    <div style="display:flex;flex-direction:column;gap:1rem">
      <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1.25rem">
        <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:1rem">🏭 Sector y contexto económico</div>
        <div class="config-grid">
          <div class="config-campo"><label>Sector económico asignado</label>
            <input type="text" value="${cfg.sector||'Distribución alimentaria agroecológica'}"
              oninput="EMPRESA_STATE.config.sector=this.value"></div>
          <div class="config-campo"><label>Descripción del sector</label>
            <input type="text" value="${cfg.descripcionSector||''}"
              oninput="EMPRESA_STATE.config.descripcionSector=this.value"></div>
          <div class="config-campo"><label>Semana actual del curso</label>
            <input type="number" min="1" max="35" value="${EMPRESA_STATE.gestion.semanaActual||1}"
              oninput="EMPRESA_STATE.gestion.semanaActual=parseInt(this.value)||1"></div>
          <div class="config-campo"><label>Trimestre en curso</label>
            <select onchange="EMPRESA_STATE.gestion.trimestreActual=parseInt(this.value)">
              ${[1,2,3].map(t=>`<option value="${t}" ${EMPRESA_STATE.gestion.trimestreActual===t?'selected':''}>Trimestre ${t}</option>`).join('')}
            </select></div>
        </div>
      </div>
      <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1.25rem">
        <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:1rem">👥 Grupos de la simulación</div>
        <div class="config-grid">
          ${['G1','G2','G3','G4','G5'].map(g => `
          <div class="config-campo"><label>Nombre empresa ${g}</label>
            <input type="text" placeholder="Ej: Distribuciones ${g} S.L."
              value="${(EMPRESA_STATE.config.grupos||{})[g]||''}"
              oninput="if(!EMPRESA_STATE.config.grupos)EMPRESA_STATE.config.grupos={};EMPRESA_STATE.config.grupos['${g}']=this.value"></div>`).join('')}
        </div>
        <button class="btn-accion" style="margin-top:1rem;font-size:.82rem"
          onclick="mostrarToast('✓ Configuración guardada','exito')">💾 Guardar configuración</button>
      </div>
      ${htmlGestionCurso()}
    </div>`;
  };

  const accesosDemoHTML = () => {
    const usuarios = [
      { nombre:'Ana García López',     email:'alumno@iescantillana.es',   rol:'Alumno/a', grupo:'G1', activo:true },
      { nombre:'Carlos Martínez Ruiz', email:'carlos@iescantillana.es',   rol:'Alumno/a', grupo:'G1', activo:true },
      { nombre:'Laura Sánchez Vega',   email:'laura@iescantillana.es',    rol:'Alumno/a', grupo:'G2', activo:true },
      { nombre:'Miguel Torres Alba',   email:'miguel@iescantillana.es',   rol:'Alumno/a', grupo:'G2', activo:false },
      { nombre:'Prof. Simulación',     email:'profesor@iescantillana.es', rol:'Docente',  grupo:'—',  activo:true },
    ];
    return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <div style="font-size:.82rem;color:var(--gris-600)">${usuarios.length} usuarios de ejemplo</div>
    </div>
    ${usuarios.map(u => `
    <div class="acceso-item">
      <div style="width:36px;height:36px;border-radius:50%;background:${u.rol==='Docente'?'#8b5cf6':'var(--verde-500)'};color:white;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">${u.nombre.substring(0,2).toUpperCase()}</div>
      <div class="acceso-info"><strong>${u.nombre}</strong><span>${u.email} · ${u.rol} · Grupo ${u.grupo}</span></div>
      <span class="acceso-estado ${u.activo?'activo':'inactivo'}">${u.activo?'Activo':'Inactivo'}</span>
    </div>`).join('')}
    <div style="margin-top:.75rem;padding:.75rem;background:var(--gris-50);border-radius:var(--radio-md);font-size:.75rem;color:var(--gris-500)">
      🎭 Datos de ejemplo. Cambia a Modo real para gestionar accesos reales.
    </div>`;
  };

  /* ── Selección de contenido según modo ── */
  const tabAlumnos = modoDemo ? alumnosDemoHTML()  : alumnosRealHTML();
  const tabStats   = modoDemo ? statsDemoHTML()    : statsRealHTML();
  const tabConfig  = modoDemo ? configDemoHTML()   : configRealHTML();
  const tabAccesos = modoDemo ? accesosDemoHTML()  : accesosRealHTML();

  /* ── Layout docente ── */
  return `
  <div class="seccion-header">
    <div><h2>👩‍🏫 Perfil docente</h2><p>Panel de configuración, seguimiento del aula y gestión de accesos</p></div>
  </div>

  <div class="perfil-layout">

    <!-- Tarjeta identidad docente -->
    <div class="perfil-card-id">
      <div class="perfil-card-id-header" style="background:linear-gradient(135deg,#1e1b4b,#4c1d95)">
        <div class="perfil-avatar-wrap">
          <div class="perfil-avatar" style="background:#7c3aed;border-color:#a78bfa">${ini}</div>
          <div class="perfil-avatar-edit">✏️</div>
        </div>
        <div class="perfil-nombre-header">${u.displayName || 'Docente'}</div>
        <div class="perfil-rol-header" style="color:#c4b5fd">👩‍🏫 Docente · SimulApp 2025-26</div>
      </div>
      <div class="perfil-card-id-body">
        <div class="perfil-dato">
          <span class="perfil-dato-icon">📧</span>
          <div><div class="perfil-dato-label">Correo</div><div class="perfil-dato-val">${u.email||'—'}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">📚</span>
          <div><div class="perfil-dato-label">Módulos</div><div class="perfil-dato-val">0656 · 0657 · 3160</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">🏫</span>
          <div><div class="perfil-dato-label">Centro</div><div class="perfil-dato-val">${configReal.centro||'IES Cantillana'}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">👥</span>
          <div><div class="perfil-dato-label">Alumnos</div>
            <div class="perfil-dato-val">${modoDemo
              ? ALUMNOS_DEMO.filter(a=>a.activo).length+' activos (demo)'
              : alumnosReales.length === 0
                ? 'Sin configurar'
                : alumnosReales.filter(a=>a.activo).length+' de '+alumnosReales.length}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">📅</span>
          <div><div class="perfil-dato-label">Semana del curso</div><div class="perfil-dato-val">Semana ${ge.semanaActual||1} · T${ge.trimestreActual||1}</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">📧</span>
          <div><div class="perfil-dato-label">Correos en buzón</div><div class="perfil-dato-val">${cor.length} · ${cor.filter(c=>!c.leido).length} sin leer</div></div>
        </div>
        <div class="perfil-dato">
          <span class="perfil-dato-icon">🔄</span>
          <div><div class="perfil-dato-label">Transacciones</div><div class="perfil-dato-val">${tx.length} · ${tx.filter(t=>t.estado==='completada').length} completadas</div></div>
        </div>
        <!-- Toggle modo -->
        <div style="margin-top:1rem;padding:.75rem;background:${modoDemo?'#fef3c7':'var(--verde-50)'};border-radius:var(--radio-md);border:1px solid ${modoDemo?'#fde68a':'var(--verde-200)'}">
          <div style="font-size:.72rem;font-weight:700;color:${modoDemo?'#92400e':'var(--verde-800)'};margin-bottom:6px">
            ${modoDemo?'🎭 Modo demo activo':'✅ Modo real activo'}
          </div>
          <button onclick="window.PERFIL_PROF.modoDemo=!window.PERFIL_PROF.modoDemo;window.PERFIL_STATE.tab='alumnos';renderVista('perfil')"
            style="width:100%;padding:6px;border-radius:var(--radio-sm);border:none;cursor:pointer;font-size:.75rem;font-weight:600;
              background:${modoDemo?'#d97706':'var(--verde-600)'};color:white">
            ${modoDemo?'Cambiar a modo real →':'← Volver a demo'}
          </button>
        </div>
        <div style="margin-top:.5rem;display:flex;flex-direction:column;gap:6px">
          <button class="btn-accion" style="width:100%;font-size:.8rem" onclick="irA('panel-profesor')">📊 Panel docente completo</button>
          <button class="btn-secundario" style="width:100%;font-size:.8rem" onclick="irA('evaluacion-docente')">📝 Ir a evaluación RA/CE</button>
        </div>
      </div>
    </div>

    <!-- Panel derecho docente -->
    <div>
      ${bannerModo}
      <div class="perfil-tabs">
        <button class="perfil-tab ${tab==='alumnos'?'activo':''}"  onclick="window.PERFIL_STATE.tab='alumnos';renderVista('perfil')">👥 Mis alumnos</button>
        <button class="perfil-tab ${tab==='stats'?'activo':''}"    onclick="window.PERFIL_STATE.tab='stats';renderVista('perfil')">📊 Estadísticas</button>
        <button class="perfil-tab ${tab==='config'?'activo':''}"   onclick="window.PERFIL_STATE.tab='config';renderVista('perfil')">⚙️ Configuración</button>
        <button class="perfil-tab ${tab==='accesos'?'activo':''}"  onclick="window.PERFIL_STATE.tab='accesos';renderVista('perfil')">🔒 Accesos</button>
      </div>

      <div class="perfil-section ${tab==='alumnos'?'activo':''}">${tabAlumnos}</div>
      <div class="perfil-section ${tab==='stats'?'activo':''}">${tabStats}</div>
      <div class="perfil-section ${tab==='config'?'activo':''}">${tabConfig}</div>
      <div class="perfil-section ${tab==='accesos'?'activo':''}">${tabAccesos}</div>
    </div>

  </div>`;
}

/* ============================================================
   VIDEOBOARDING — LÓGICA JS
   ============================================================ */
const VB_TOTAL_SLIDES = 7;
let vbSlideActual = 0;

function vbInit() {
  // Construir dots
  const dotsEl = document.getElementById('vb-dots');
  dotsEl.innerHTML = '';
  for (let i = 0; i < VB_TOTAL_SLIDES; i++) {
    const d = document.createElement('span');
    d.className = 'vb-dot' + (i === 0 ? ' activo' : '');
    d.title = 'Paso ' + (i + 1);
    d.onclick = () => vbIrA(i);
    dotsEl.appendChild(d);
  }
  const label = document.createElement('span');
  label.className = 'vb-step-label';
  label.id = 'vb-step-label';
  label.textContent = '1 / ' + VB_TOTAL_SLIDES;
  dotsEl.appendChild(label);
  vbRenderEstado();
}

function vbRenderEstado() {
  // Slides
  document.querySelectorAll('.vb-slide').forEach((el, i) => {
    el.classList.toggle('activo', i === vbSlideActual);
  });
  // Dots
  document.querySelectorAll('.vb-dot').forEach((d, i) => {
    d.classList.toggle('activo', i === vbSlideActual);
    d.classList.toggle('hecho', i < vbSlideActual);
  });
  // Label
  const lbl = document.getElementById('vb-step-label');
  if (lbl) lbl.textContent = (vbSlideActual + 1) + ' / ' + VB_TOTAL_SLIDES;
  // Progress bar
  const pct = ((vbSlideActual + 1) / VB_TOTAL_SLIDES) * 100;
  document.getElementById('vb-progress-fill').style.width = pct + '%';
  // Botones
  const prev = document.getElementById('vb-btn-prev');
  const next = document.getElementById('vb-btn-next');
  prev.style.display = vbSlideActual > 0 ? '' : 'none';
  const esUltimo = vbSlideActual === VB_TOTAL_SLIDES - 1;
  next.textContent = esUltimo ? '🚀 ¡Empezar!' : 'Siguiente →';
  next.classList.toggle('final', esUltimo);
}

function vbSiguiente() {
  if (vbSlideActual < VB_TOTAL_SLIDES - 1) {
    vbSlideActual++;
    vbRenderEstado();
    document.getElementById('vb-body').scrollTop = 0;
  } else {
    vbCerrar();
    // Redirigir a Mi empresa al terminar la guía
    setTimeout(() => irA('empresa'), 300);
  }
}

function vbAnterior() {
  if (vbSlideActual > 0) {
    vbSlideActual--;
    vbRenderEstado();
    document.getElementById('vb-body').scrollTop = 0;
  }
}

function vbIrA(n) {
  vbSlideActual = n;
  vbRenderEstado();
  document.getElementById('vb-body').scrollTop = 0;
}

function vbAbrir() {
  vbSlideActual = 0;
  document.getElementById('vb-overlay').classList.remove('oculto');
  vbInit();
}

function vbCerrar() {
  document.getElementById('vb-overlay').classList.add('oculto');
  // Marcar como visto
  try { localStorage.setItem('simulapp_tour_visto', '1'); } catch(e) {}
}

/* ============================================================
   GESTIÓN DE CURSO — guardar año, backup, reiniciar
   ============================================================ */

function guardarCursoAcademico() {
  const input = document.getElementById('input-curso-academico');
  const nuevo = input ? input.value.trim() : '';
  if (!nuevo) { mostrarToast('Introduce un curso válido (ej: 2026-27)', 'error'); return; }
  if (!EMPRESA_STATE.config) EMPRESA_STATE.config = {};
  EMPRESA_STATE.config.cursoAcademico = nuevo;
  try { localStorage.setItem('simulapp_curso', nuevo); } catch(e) {}
  mostrarToast('Curso actualizado a ' + nuevo, 'exito');
  renderVista('perfil');
}

function restaurarBackup(inputEl) {
  const file = inputEl && inputEl.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || !data.EMPRESA_STATE) {
        mostrarToast('Archivo de backup no válido o corrupto', 'error');
        return;
      }
      const fecha = data.exportadoEn
        ? new Date(data.exportadoEn).toLocaleDateString('es-ES')
        : 'fecha desconocida';
      const curso = data.cursoAcademico || '?';
      const ok = confirm(
        `Vas a restaurar la copia de seguridad del curso ${curso} (${fecha}).\n` +
        `Esto reemplazará TODOS los datos actuales.\n\n¿Continuar?`
      );
      if (!ok) { inputEl.value = ''; return; }

      // Preservar template del código
      const convenio         = JSON.parse(JSON.stringify(EMPRESA_STATE.rrhh.convenio || {}));
      const tramitesTemplate = EMPRESA_STATE.tramites.map(t => ({ ...t }));

      Object.assign(EMPRESA_STATE, data.EMPRESA_STATE);
      EMPRESA_STATE.rrhh.convenio = convenio;

      if (Array.isArray(data.EMPRESA_STATE.tramites)) {
        EMPRESA_STATE.tramites = tramitesTemplate.map(t => {
          const sv = data.EMPRESA_STATE.tramites.find(x => x.id === t.id);
          if (!sv) return t;
          return Object.assign({}, t, {
            estado: sv.estado ?? t.estado, fecha: sv.fecha ?? '',
            notas: sv.notas ?? '', documentoSubido: sv.documentoSubido ?? null,
            anotacionProfesor: sv.anotacionProfesor ?? '',
          });
        });
      }

      if (typeof guardarEstado === 'function') guardarEstado();
      mostrarToast('Copia de seguridad restaurada correctamente', 'exito');
      setTimeout(() => irA('dashboard'), 600);
    } catch(err) {
      mostrarToast('Error al leer el archivo de backup', 'error');
      console.error('[SimulApp] restaurarBackup:', err);
    }
    inputEl.value = ''; // permitir cargar el mismo archivo de nuevo
  };
  reader.readAsText(file);
}

function generarBackupCurso() {
  const curso = (EMPRESA_STATE.config && EMPRESA_STATE.config.cursoAcademico) || '2025-26';
  const backup = {
    version: '1.0',
    exportadoEn: new Date().toISOString(),
    cursoAcademico: curso,
    EMPRESA_STATE: JSON.parse(JSON.stringify(EMPRESA_STATE)),
    APP_perfil: APP.perfil,
    APP_empresa: APP.empresa,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'simulapp_backup_' + curso + '_' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  mostrarToast('Copia de seguridad descargada correctamente', 'exito');
}

async function probarConexionFirebase() {
  const btnTest  = document.getElementById('btn-activar-real') || null;
  const resEl    = document.getElementById('resultado-test-firebase');
  const stepAuth = document.getElementById('step-auth');
  const stepConn = document.getElementById('step-conn');

  if (resEl) resEl.textContent = '⏳ Comprobando…';

  try {
    // Paso 1: Firebase SDK cargado
    if (typeof firebase === 'undefined') throw new Error('Firebase SDK no cargado — revisa las etiquetas <script> en index.html');

    // Inicializar si no está ya
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);

    // Paso 2: Auth responde
    await firebase.auth().fetchSignInMethodsForEmail('probe@simulapp.test').catch(err => {
      // "auth/invalid-email" significa que Auth funciona; cualquier otro error es real
      if (err.code !== 'auth/invalid-email') throw err;
    });
    if (stepAuth) stepAuth.textContent = '✅';

    // Paso 3: Firestore responde
    await firebase.firestore().collection('config').limit(1).get();
    if (stepConn) stepConn.textContent = '✅';

    if (resEl) resEl.innerHTML = '<span style="color:var(--verde-700);font-weight:600">✅ Firebase conectado correctamente. Puedes activar el modo real.</span>';
    if (btnTest) btnTest.disabled = false;

  } catch(e) {
    if (stepConn) stepConn.textContent = '❌';
    const msg = e.code === 'auth/operation-not-allowed'
      ? 'Auth responde pero Email/Contraseña no está activado en Firebase Console (Paso 1)'
      : e.message;
    if (resEl) resEl.innerHTML = `<span style="color:#dc2626">❌ ${msg}</span>`;
    mostrarToast('Error de conexión: ' + msg.substring(0,60), 'error');
  }
}

function activarModoReal() {
  const ok = confirm('¿Activar modo Firebase real?\n\nA partir de ahora el login usará Firebase Auth.\nAsegúrate de que has creado las cuentas en Firebase Console.');
  if (!ok) return;
  localStorage.setItem('simulapp_modo_real', 'true');
  mostrarToast('Activando modo Firebase real…', 'exito');
  setTimeout(() => location.reload(), 800);
}

function volverADemo() {
  const ok = confirm('¿Volver al modo demo?\n\nEl login usará los usuarios de ejemplo y no se conectará a Firebase.');
  if (!ok) return;
  localStorage.removeItem('simulapp_modo_real');
  mostrarToast('Volviendo a modo demo…', 'exito');
  setTimeout(() => location.reload(), 800);
}

function confirmarReinicioPlataforma() {
  const p1 = confirm('⚠️ ATENCIÓN\n\nEsto borrará TODOS los datos del curso actual:\nempresa, tareas, correos, transacciones y evaluaciones.\n\nSe conservan: sector, nombres de grupos y pesos de evaluación.\n\n¿Continuar?');
  if (!p1) return;
  const p2 = confirm('⚠️ SEGUNDA CONFIRMACIÓN\n\nEsta acción no se puede deshacer.\n¿Seguro que quieres poner la plataforma a cero?');
  if (!p2) return;
  reiniciarPlataforma();
}

function reiniciarPlataforma() {
  // Conservar configuración del docente
  const cfgGuardada = JSON.parse(JSON.stringify(EMPRESA_STATE.config || {}));
  const pesosGuardados   = JSON.parse(JSON.stringify(EMPRESA_STATE.evalDocente.pesos   || {}));
  const pesosCEGuardados = JSON.parse(JSON.stringify(EMPRESA_STATE.evalDocente.pesosCE || {}));
  const convenioGuardado = JSON.parse(JSON.stringify(EMPRESA_STATE.rrhh.convenio       || {}));

  // Resetear datos de empresa
  EMPRESA_STATE.datos = {
    nombre:'', formaJuridica:'', domicilioSocial:'', objetoSocial:'',
    cifProvisional:'', capitalInicial:0, fechaConstitucion:'', departamento:'',
    socios:[], organigrama:{ direccion:{}, rrhh:{}, comercial:{}, contabilidad:{}, fiscal:{} }
  };

  // Resetear gestión
  EMPRESA_STATE.gestion.semanaActual   = 1;
  EMPRESA_STATE.gestion.trimestreActual = 1;
  EMPRESA_STATE.gestion.tareas         = [];
  EMPRESA_STATE.gestion.asignaciones   = {
    direccion:{alumno:'',trimestre:1}, rrhh:{alumno:'',trimestre:1},
    comercial:{alumno:'',trimestre:1}, contabilidad:{alumno:'',trimestre:1}, fiscal:{alumno:'',trimestre:1},
  };

  // Resetear mensajería, mercado, RRHH empleados
  EMPRESA_STATE.mensajeria.correos        = [];
  EMPRESA_STATE.mensajeria.correoAbierto  = null;
  EMPRESA_STATE.mercado.transacciones     = [];
  EMPRESA_STATE.mercado.catalogo          = [];
  EMPRESA_STATE.mercado.eventos           = [];
  EMPRESA_STATE.rrhh.empleados            = [];
  EMPRESA_STATE.rrhh.nominasMes           = null;
  EMPRESA_STATE.rrhh.convenio             = convenioGuardado;

  // Resetear trámites a estado pendiente
  EMPRESA_STATE.tramites.forEach(t => {
    t.estado = 'pendiente'; t.fecha = ''; t.notas = ''; t.documentoSubido = null; t.anotacionProfesor = '';
  });

  // Resetear plan de empresa
  ['ap1','ap2','ap3','ap4','ap5','ap6','ap7'].forEach(ap => {
    if (EMPRESA_STATE.planEmpresa[ap]) {
      if (ap === 'ap7') { EMPRESA_STATE.planEmpresa.ap7.tabActiva = 'inversion'; }
      else { Object.keys(EMPRESA_STATE.planEmpresa[ap]).forEach(k => {
        const v = EMPRESA_STATE.planEmpresa[ap][k];
        EMPRESA_STATE.planEmpresa[ap][k] = Array.isArray(v) ? [] : typeof v === 'object' && v !== null ? {} : '';
      }); }
    }
  });
  EMPRESA_STATE.planEmpresa.progreso = {};

  // Resetear evaluación docente (conservar pesos)
  EMPRESA_STATE.evalDocente.alumnos         = [];
  EMPRESA_STATE.evalDocente.calificaciones  = {};
  EMPRESA_STATE.evalDocente.pesos           = pesosGuardados;
  EMPRESA_STATE.evalDocente.pesosCE         = pesosCEGuardados;

  // Resetear evaluación alumno
  EMPRESA_STATE.evaluacion.auto.guardado    = false;
  EMPRESA_STATE.evaluacion.auto.periodos.forEach(p => { p.completado=false; p.fecha=null; p.items={}; });
  EMPRESA_STATE.evaluacion.co.periodos.forEach(p  => { p.completado=false; p.fecha=null; p.items={}; p.evaluado=''; p.reflexion=''; });

  // Resetear casos y notificaciones
  EMPRESA_STATE.casos.respuestas    = {};
  EMPRESA_STATE.casos.casosCustom   = [];
  EMPRESA_STATE.notificaciones.items     = [];
  EMPRESA_STATE.notificaciones.noLeidas  = 0;

  // Restaurar config
  EMPRESA_STATE.config            = cfgGuardada;
  EMPRESA_STATE.modoEdicion       = true;
  EMPRESA_STATE.fichaGuardada     = false;
  EMPRESA_STATE.seccionActiva     = 'ficha';

  // Limpiar localStorage de datos del curso (conservar preferencias UI)
  try {
    ['simulapp_plan','simulapp_empresa','simulapp_tareas','simulapp_gestion'].forEach(k => localStorage.removeItem(k));
  } catch(e) {}

  mostrarToast('Plataforma puesta a cero. Listo para un nuevo curso.', 'exito');
  setTimeout(() => irA('dashboard'), 800);
}

/* Lanzar automáticamente en el primer acceso del alumno */
function vbCheckPrimerAcceso() {
  if (APP.rolActivo !== 'alumno') return;
  let visto = false;
  try { visto = localStorage.getItem('simulapp_tour_visto') === '1'; } catch(e) {}
  if (!visto) {
    setTimeout(() => {
      vbAbrir();
    }, 900);
  }
  // Mostrar siempre el botón flotante para alumnos
  const btnFlotante = document.getElementById('btn-tour-flotante');
  if (btnFlotante) btnFlotante.style.display = 'flex';
}

