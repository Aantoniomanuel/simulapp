function vistaPanelProfesor() {
  const ev      = EMPRESA_STATE.evalDocente;
  const alumnos = ev.alumnos || [];
  const d       = EMPRESA_STATE.datos;
  const ge      = EMPRESA_STATE.gestion;
  const ms      = EMPRESA_STATE.mensajeria;
  const me      = EMPRESA_STATE.mercado;
  const tramites = EMPRESA_STATE.tramites || [];

  if (!window.PANEL_PROF) window.PANEL_PROF = { tab: 'resumen' };
  const pp = window.PANEL_PROF;

  /* ── Datos base ── */
  const tareasPend  = ge.tareas.filter(t => t.estado === 'pendiente').length;
  const tareasEnt   = ge.tareas.filter(t => t.estado === 'entregada').length;
  const tareasEval  = ge.tareas.filter(t => t.estado === 'evaluada').length;
  const tramHecho   = tramites.filter(t => t.estado === 'completado').length;
  const progPlan    = typeof calcProgresoPlan === 'function' ? calcProgresoPlan() : 0;
  const tieneNombre = !!(d.nombre && d.nombre.trim());
  const tieneCIF    = !!(d.cifProvisional && d.cifProvisional.trim());
  const tieneOrg    = Object.values(d.organigrama || {}).some(v => v.alumno?.trim());
  const correosSinLeer = ms.correos.filter(c => !c.leido).length;
  const corr24h     = ms.correos.filter(c => {
    if (!c.fecha) return false;
    const parts = c.fecha.split('/');
    if (parts.length < 3) return false;
    const d = new Date(parts[2], parts[1]-1, parts[0]);
    return (Date.now() - d.getTime()) < 86400000*2;
  }).length;
  const txActivas   = me.transacciones.filter(t => t.estado !== 'completada' && t.estado !== 'pedido-rechazado').length;
  const txComp      = me.transacciones.filter(t => t.estado === 'completada').length;
  const volFact     = me.transacciones.filter(t => t.estado === 'completada').reduce((s,t) => s+(t.total||0), 0);
  const sem         = ge.semanaActual || 1;
  const trim        = ge.trimestreActual || 1;

  /* ── Alertas ── */
  const alertas = [];
  if (!tieneNombre)  alertas.push({ nivel:'rojo',    txt:'Sin denominación social — necesaria para trámites y programas' });
  if (!tieneCIF)     alertas.push({ nivel:'rojo',    txt:'Sin CIF provisional — necesario para Contasol, Factusol y Nominasol' });
  if (!tieneOrg)     alertas.push({ nivel:'naranja', txt:'Organigrama incompleto — ningún departamento tiene responsable asignado' });
  if (tareasEnt > 0) alertas.push({ nivel:'naranja', txt:`${tareasEnt} tarea${tareasEnt>1?'s':''} entregada${tareasEnt>1?'s':''} esperando evaluación` });
  if (correosSinLeer > 5) alertas.push({ nivel:'azul', txt:`${correosSinLeer} correos sin leer en el buzón` });
  if (progPlan < 30) alertas.push({ nivel:'azul',    txt:`Plan de empresa al ${progPlan}% — menos de un tercio completado` });

  /* ── Grupos del aula (demo: derivados de alumnos) ── */
  const gruposIds   = [...new Set(alumnos.map(a => a.grupo||'G1'))].sort();
  const notasAlumnos = alumnos.map(a => ({
    ...a,
    notas: Object.fromEntries(['0656','0657','optativa'].map(m => [m, calcNotaAlumno(a.id, m)]))
  }));

  /* ── Helpers ── */
  const colorAlerta = { rojo:'#fee2e2', naranja:'#fef3c7', azul:'#eff6ff' };
  const textAlerta  = { rojo:'#991b1b', naranja:'#92400e', azul:'#1e3a8a' };
  const iconAlerta  = { rojo:'🔴', naranja:'🟡', azul:'🔵' };
  const borderAlerta = { rojo:'#ef4444', naranja:'#f59e0b', azul:'#3b82f6' };
  const fmtEuro = n => Number(n).toLocaleString('es-ES', {maximumFractionDigits:0}) + ' €';

  /* ────────────────────────────────────────────
     TAB: RESUMEN
  ──────────────────────────────────────────── */
  function tabResumen() {
    /* KPIs principales */
    const kpis = [
      { icono:'📅', label:'Semana actual', val:`S${sem}`, sub:`Trimestre ${trim}`, color:'var(--verde-600)', onclick:'' },
      { icono:'📋', label:'Plan de empresa', val:`${progPlan}%`, sub: progPlan>=70?'✓ En buen ritmo':progPlan>=40?'En progreso':'⚠️ Atrasado', color:progPlan>=70?'var(--verde-600)':'#d97706', onclick:"irA('plan-empresa')" },
      { icono:'✅', label:'Tareas entregadas', val:tareasEnt, sub: tareasEnt>0?'Pendientes de evaluar':'✓ Sin pendientes', color:tareasEnt>0?'#dc2626':'var(--verde-600)', onclick:"irA('tareas')" },
      { icono:'📧', label:'Correos sin leer', val:correosSinLeer, sub:`${corr24h} en las últimas 48h`, color:correosSinLeer>0?'#d97706':'var(--verde-600)', onclick:"irA('mensajeria')" },
      { icono:'🔄', label:'Transacciones activas', val:txActivas, sub:`${txComp} completadas · ${fmtEuro(volFact)}`, color:txActivas>0?'#d97706':'var(--verde-600)', onclick:"irA('mercado')" },
      { icono:'📑', label:'Trámites', val:`${tramHecho}/${tramites.length}`, sub:tramHecho===tramites.length?'✓ Todos completados':`${tramites.length-tramHecho} pendientes`, color:tramHecho===tramites.length?'var(--verde-600)':'#d97706', onclick:"irA('empresa')" },
    ];

    /* Progreso por grupos */
    const gruposProgreso = gruposIds.map(g => {
      const almsGrupo = notasAlumnos.filter(a => (a.grupo||'G1') === g);
      const medias = ['0656','0657','optativa'].map(mod => {
        const notas = almsGrupo.map(a => a.notas[mod]).filter(n => n !== null && n !== undefined);
        return notas.length ? notas.reduce((s,n)=>s+n,0)/notas.length : null;
      });
      const mediaGlobal = medias.filter(n=>n!==null).length
        ? medias.filter(n=>n!==null).reduce((s,n)=>s+n,0) / medias.filter(n=>n!==null).length
        : null;
      return { g, almsGrupo, medias, mediaGlobal };
    });

    /* Actividad reciente en el buzón */
    const correosRecientes = ms.correos.slice(0,5);

    return `
    <!-- KPIs -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:1.25rem">
      ${kpis.map(k => `
      <div style="background:var(--blanco);border:1px solid var(--gris-100);border-left:3px solid ${k.color};border-radius:var(--radio-md);
        padding:.85rem 1rem;cursor:${k.onclick?'pointer':'default'};transition:box-shadow .15s"
        ${k.onclick?`onclick="${k.onclick}"`:''}
        onmouseover="this.style.boxShadow='var(--sombra-md)'" onmouseout="this.style.boxShadow=''">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span style="font-size:.9rem">${k.icono}</span>
          <span style="font-size:.7rem;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em">${k.label}</span>
        </div>
        <div style="font-size:1.5rem;font-weight:800;color:${k.color};line-height:1">${k.val}</div>
        <div style="font-size:.7rem;color:var(--gris-400);margin-top:3px">${k.sub}</div>
      </div>`).join('')}
    </div>

    <!-- Alertas -->
    ${alertas.length === 0
      ? `<div style="padding:10px 14px;background:var(--verde-50);border:1px solid var(--verde-200);border-radius:var(--radio-md);font-size:.82rem;color:var(--verde-700);margin-bottom:1.25rem">✅ Sin alertas — todo en orden</div>`
      : `<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:1.25rem">
          ${alertas.map(a=>`<div style="display:flex;align-items:center;gap:10px;padding:9px 14px;background:${colorAlerta[a.nivel]};border-left:3px solid ${borderAlerta[a.nivel]};border-radius:0 var(--radio-sm) var(--radio-sm) 0;font-size:.82rem;color:${textAlerta[a.nivel]}">
            <span>${iconAlerta[a.nivel]}</span><span style="flex:1">${a.txt}</span>
          </div>`).join('')}
        </div>`}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <!-- Progreso por grupos -->
      <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
        <div style="padding:.75rem 1rem;border-bottom:1px solid var(--gris-100);font-size:.82rem;font-weight:700;color:var(--gris-800)">
          🏆 Progreso medio por grupo
        </div>
        <div style="padding:.75rem 1rem">
          ${gruposProgreso.length === 0
            ? '<div style="text-align:center;padding:1rem;color:var(--gris-400);font-size:.8rem">Sin alumnos configurados todavía</div>'
            : gruposProgreso.map(({g, almsGrupo, medias, mediaGlobal}) => {
                const nc = notaColor(mediaGlobal);
                return `
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                  <div style="width:28px;height:28px;border-radius:6px;background:var(--verde-100);color:var(--verde-800);font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${g}</div>
                  <div style="flex:1">
                    <div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:3px">
                      <span style="color:var(--gris-700);font-weight:500">${almsGrupo.length} alumno${almsGrupo.length!==1?'s':''}</span>
                      <span style="font-weight:700;color:${mediaGlobal!==null?nc.txt:'var(--gris-300)'}">${mediaGlobal!==null?mediaGlobal.toFixed(1):'—'}</span>
                    </div>
                    <div style="height:5px;background:var(--gris-100);border-radius:3px;overflow:hidden">
                      <div style="width:${mediaGlobal!==null?mediaGlobal*10:0}%;height:100%;background:${mediaGlobal!==null?nc.txt:'var(--gris-200)'};border-radius:3px;transition:width .5s"></div>
                    </div>
                    <div style="display:flex;gap:6px;margin-top:3px">
                      ${['0656','0657','optativa'].map((m,i) => {
                        const n = medias[i];
                        return `<span style="font-size:.65rem;color:var(--gris-400)">${m}: <strong style="color:${n!==null?notaColor(n).txt:'var(--gris-300)'}">${n!==null?n.toFixed(1):'—'}</strong></span>`;
                      }).join('')}
                    </div>
                  </div>
                </div>`;
              }).join('')}
        </div>
      </div>

      <!-- Actividad reciente del buzón -->
      <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
        <div style="padding:.75rem 1rem;border-bottom:1px solid var(--gris-100);display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:.82rem;font-weight:700;color:var(--gris-800)">📧 Últimas situaciones</span>
          <button class="btn-secundario" style="font-size:.72rem;padding:3px 8px" onclick="irA('mensajeria')">Ver buzón →</button>
        </div>
        <div style="padding:.5rem .75rem">
          ${correosRecientes.length === 0
            ? '<div style="padding:1rem;text-align:center;color:var(--gris-400);font-size:.8rem">El buzón está vacío</div>'
            : correosRecientes.map(c => `
              <div style="display:flex;align-items:flex-start;gap:8px;padding:7px 4px;border-bottom:1px solid var(--gris-50);cursor:pointer"
                onclick="irA('mensajeria')">
                <div style="width:7px;height:7px;border-radius:50%;background:${c.leido?'var(--gris-200)':'#ef4444'};margin-top:4px;flex-shrink:0"></div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:.78rem;font-weight:${c.leido?'400':'600'};color:var(--gris-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.asunto}</div>
                  <div style="font-size:.68rem;color:var(--gris-400)">${c.de} · ${c.fecha}</div>
                </div>
              </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:1rem">
      <button class="btn-accion" style="font-size:.8rem;padding:7px 14px" onclick="irA('evaluacion-docente')">📝 Evaluación RA/CE</button>
      <button class="btn-secundario" style="font-size:.8rem;padding:7px 14px" onclick="irA('tareas')">✅ Gestionar tareas</button>
      <button class="btn-secundario" style="font-size:.8rem;padding:7px 14px" onclick="irA('mensajeria')">📧 Buzón</button>
      <button class="btn-secundario" style="font-size:.8rem;padding:7px 14px" onclick="window.PANEL_PROF.tab='seneca';renderVista('panel-profesor')">📤 Exportar Séneca</button>
    </div>`;
  }

  /* ────────────────────────────────────────────
     TAB: GRUPOS Y EMPRESA
  ──────────────────────────────────────────── */
  function tabEmpresas() {
    const DEPTS = {direccion:{nom:'Dirección',ico:'🎯'},rrhh:{nom:'RRHH',ico:'👥'},comercial:{nom:'Comercial',ico:'🧾'},contabilidad:{nom:'Contabilidad',ico:'📊'},fiscal:{nom:'Fiscal',ico:'⚖️'}};
    const org = d.organigrama || {};

    /* Tabla comparativa de grupos */
    const gruposData = gruposIds.map(g => {
      const almsG = alumnos.filter(a => (a.grupo||'G1') === g);
      const notas = almsG.map(a => calcNotaAlumno(a.id, '0656')).filter(n=>n!==null);
      const media = notas.length ? (notas.reduce((s,n)=>s+n,0)/notas.length).toFixed(1) : '—';
      const tareasG = ge.tareas.filter(t => almsG.some(a => a.nombre && t.alumno === a.nombre));
      return { g, almsG, media, tareasG };
    });

    /* Checks de estado de la empresa */
    const checks = [
      { ok: tieneNombre,           label:'Denominación social',     detalle: d.nombre||'Sin definir',                              accion:"irA('empresa')" },
      { ok: tieneCIF,              label:'CIF provisional',          detalle: d.cifProvisional||'Sin generar',                      accion:"irA('empresa')" },
      { ok: !!(d.domicilioSocial), label:'Domicilio social',         detalle: d.domicilioSocial||'Sin definir',                     accion:"irA('empresa')" },
      { ok: !!(d.formaJuridica),   label:'Forma jurídica',           detalle: d.formaJuridica||'Sin definir',                       accion:"irA('empresa')" },
      { ok: tieneOrg,              label:'Organigrama',              detalle: Object.values(org).filter(v=>v.alumno?.trim()).length+'/'+Object.keys(org).length+' puestos',  accion:"irA('empresa')" },
      { ok: progPlan>=50,          label:'Plan de empresa',          detalle: progPlan+'% completado',                              accion:"irA('plan-empresa')" },
      { ok: tramHecho>=3,          label:'Trámites constitución',    detalle: tramHecho+' de '+tramites.length+' completados',      accion:"irA('empresa')" },
      { ok: !!(d.socios&&d.socios.length>0), label:'Socios registrados', detalle: (d.socios||[]).length+' socio'+((d.socios||[]).length!==1?'s':''), accion:"irA('empresa')" },
    ];

    const totalOk = checks.filter(c=>c.ok).length;
    const pctChecks = Math.round(totalOk/checks.length*100);

    return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem">

      <!-- Estado de la empresa -->
      <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
        <div style="padding:.75rem 1rem;border-bottom:1px solid var(--gris-100);display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:.82rem;font-weight:700;color:var(--gris-800)">🏢 ${d.nombre||'Sin nombre'} ${tieneCIF?'· '+d.cifProvisional:''}</span>
          <span style="font-size:.72rem;font-weight:700;padding:2px 8px;border-radius:20px;
            background:${pctChecks===100?'var(--verde-100)':pctChecks>=60?'#fef3c7':'#fee2e2'};
            color:${pctChecks===100?'var(--verde-800)':pctChecks>=60?'#92400e':'#991b1b'}">${pctChecks}%</span>
        </div>
        <div style="padding:.5rem .75rem">
          ${checks.map(c => `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid var(--gris-50);cursor:pointer"
            onclick="${c.accion}"
            onmouseover="this.style.background='var(--gris-50)'" onmouseout="this.style.background=''">
            <span style="font-size:.85rem;flex-shrink:0">${c.ok?'✅':'❌'}</span>
            <span style="font-size:.78rem;font-weight:500;color:var(--gris-700);flex:1">${c.label}</span>
            <span style="font-size:.72rem;color:var(--gris-400);text-align:right;max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.detalle}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Organigrama con responsables -->
      <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
        <div style="padding:.75rem 1rem;border-bottom:1px solid var(--gris-100);display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:.82rem;font-weight:700;color:var(--gris-800)">👥 Departamentos y responsables</span>
          <button class="btn-secundario" style="font-size:.72rem;padding:3px 8px" onclick="irA('empresa')">Editar →</button>
        </div>
        <div style="padding:.5rem .75rem">
          ${Object.entries(DEPTS).map(([key,dept]) => {
            const puesto = org[key] || {};
            const alumno = puesto.alumno?.trim();
            const ok = !!alumno;
            return `
            <div style="display:flex;align-items:center;gap:10px;padding:7px 4px;border-bottom:1px solid var(--gris-50)">
              <span style="font-size:1rem;width:22px;text-align:center">${dept.ico}</span>
              <span style="font-size:.78rem;font-weight:600;color:var(--gris-700);width:90px">${dept.nom}</span>
              <span style="flex:1;font-size:.78rem;color:${ok?'var(--gris-800)':'var(--gris-300)'};font-style:${ok?'normal':'italic'}">${alumno||'Sin asignar'}</span>
              <span style="font-size:.65rem;padding:2px 6px;border-radius:20px;background:${ok?'var(--verde-100)':'var(--gris-100)'};color:${ok?'var(--verde-700)':'var(--gris-400)'};font-weight:600">${ok?'✓ Asignado':'Vacante'}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Tabla comparativa de grupos -->
    ${gruposIds.length > 0 ? `
    <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
      <div style="padding:.75rem 1rem;border-bottom:1px solid var(--gris-100);font-size:.82rem;font-weight:700;color:var(--gris-800)">
        📊 Comparativa de grupos del aula
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.8rem">
          <thead><tr style="background:var(--gris-50)">
            <th style="padding:8px 12px;text-align:left;font-size:.72rem;color:var(--gris-500);text-transform:uppercase">Grupo</th>
            <th style="padding:8px 10px;text-align:center;font-size:.72rem;color:var(--gris-500);text-transform:uppercase">Alumnos</th>
            <th style="padding:8px 10px;text-align:center;font-size:.72rem;color:var(--gris-500);text-transform:uppercase">Nota media 0656</th>
            <th style="padding:8px 10px;text-align:center;font-size:.72rem;color:var(--gris-500);text-transform:uppercase">Nota media 0657</th>
            <th style="padding:8px 10px;text-align:center;font-size:.72rem;color:var(--gris-500);text-transform:uppercase">Optativa</th>
            <th style="padding:8px 12px;text-align:left;font-size:.72rem;color:var(--gris-500);text-transform:uppercase">Alumnos</th>
          </tr></thead>
          <tbody>
            ${gruposIds.map(g => {
              const almsG = notasAlumnos.filter(a => (a.grupo||'G1')===g);
              const mediaM = mod => {
                const ns = almsG.map(a=>a.notas[mod]).filter(n=>n!==null);
                return ns.length ? (ns.reduce((s,n)=>s+n,0)/ns.length) : null;
              };
              const m56=mediaM('0656'), m57=mediaM('0657'), mOpt=mediaM('optativa');
              const celdaNota = n => {
                if (n===null) return `<td style="padding:8px 10px;text-align:center;color:var(--gris-300)">—</td>`;
                const nc=notaColor(n);
                return `<td style="padding:8px 10px;text-align:center;background:${nc.bg};color:${nc.txt};font-weight:700">${n.toFixed(1)}</td>`;
              };
              return `<tr style="border-bottom:1px solid var(--gris-50)">
                <td style="padding:8px 12px;font-weight:700;color:var(--verde-700)">${g}</td>
                <td style="padding:8px 10px;text-align:center;color:var(--gris-600)">${almsG.length}</td>
                ${celdaNota(m56)}${celdaNota(m57)}${celdaNota(mOpt)}
                <td style="padding:6px 12px">
                  <div style="display:flex;flex-wrap:wrap;gap:3px">
                    ${almsG.map(a=>`<span style="font-size:.65rem;padding:1px 6px;border-radius:20px;background:var(--gris-100);color:var(--gris-600)">${a.nombre.split(' ')[0]}</span>`).join('')}
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : `<div style="padding:2rem;text-align:center;color:var(--gris-400);font-size:.85rem">Configura los grupos en <strong>Evaluación RA/CE → Añadir alumno</strong></div>`}`;
  }

  /* ────────────────────────────────────────────
     TAB: TAREAS
  ──────────────────────────────────────────── */
  function tabTareas() {
    const tareas = ge.tareas || [];
    const DEPT_ICO = {direccion:'🎯',rrhh:'👥',comercial:'🧾',contabilidad:'📊',fiscal:'⚖️'};
    const ESTADO_COLOR = {pendiente:'var(--gris-100)',  'en-curso':'#fef3c7', entregada:'#dbeafe', evaluada:'#dcfce7'};
    const ESTADO_TXT   = {pendiente:'var(--gris-500)', 'en-curso':'#92400e', entregada:'#1e40af', evaluada:'#166534'};
    const ESTADO_LABEL = {pendiente:'Pendiente','en-curso':'En curso',entregada:'Entregada ⬆️',evaluada:'✅ Evaluada'};

    if (tareas.length === 0) return `
      <div style="text-align:center;padding:3rem;color:var(--gris-400)">
        <div style="font-size:2.5rem;margin-bottom:.75rem">📋</div>
        <p style="font-size:.9rem;font-weight:600;color:var(--gris-600)">Sin tareas publicadas todavía</p>
        <p style="font-size:.82rem;margin-top:4px">Publica tareas semanales desde la sección <strong>Tareas</strong>.</p>
        <button class="btn-accion" style="margin-top:1rem;font-size:.82rem" onclick="irA('tareas')">✅ Ir a Tareas</button>
      </div>`;

    /* Resumen rápido */
    const estados = ['pendiente','en-curso','entregada','evaluada'];
    const cuentas = Object.fromEntries(estados.map(e => [e, tareas.filter(t=>t.estado===e).length]));

    /* Tabla detallada con filtro por estado */
    const filtroEstado = window.PANEL_PROF.filtroTareas || 'todas';
    const tareasFiltradas = filtroEstado==='todas' ? tareas : tareas.filter(t=>t.estado===filtroEstado);

    return `
    <!-- Resumen de estados -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.6rem;margin-bottom:1rem">
      ${estados.map(e => `
      <div style="padding:.75rem;border-radius:var(--radio-md);background:${ESTADO_COLOR[e]};text-align:center;cursor:pointer;
        border:2px solid ${filtroEstado===e?ESTADO_TXT[e]:'transparent'};transition:all .15s"
        onclick="window.PANEL_PROF.filtroTareas='${e}';renderVista('panel-profesor')">
        <div style="font-size:1.4rem;font-weight:800;color:${ESTADO_TXT[e]}">${cuentas[e]}</div>
        <div style="font-size:.7rem;color:${ESTADO_TXT[e]};font-weight:600">${ESTADO_LABEL[e]}</div>
      </div>`).join('')}
    </div>

    <!-- Filtro activo -->
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:.75rem">
      <span style="font-size:.75rem;color:var(--gris-500)">Mostrando:</span>
      ${['todas',...estados].map(e => `
      <button onclick="window.PANEL_PROF.filtroTareas='${e}';renderVista('panel-profesor')"
        style="padding:3px 10px;border-radius:20px;font-size:.72rem;font-weight:600;border:none;cursor:pointer;
          background:${filtroEstado===e?'var(--verde-600)':'var(--gris-100)'};
          color:${filtroEstado===e?'white':'var(--gris-500)'}">
        ${e==='todas'?'Todas':ESTADO_LABEL[e]}
      </button>`).join('')}
      <button class="btn-secundario" style="font-size:.75rem;padding:4px 10px;margin-left:auto" onclick="irA('tareas')">Gestionar tareas →</button>
    </div>

    <!-- Tabla de tareas -->
    <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
      ${tareasFiltradas.length === 0
        ? `<div style="padding:2rem;text-align:center;color:var(--gris-400);font-size:.82rem">No hay tareas con el filtro seleccionado</div>`
        : `<table style="width:100%;border-collapse:collapse;font-size:.8rem">
            <thead><tr style="background:var(--gris-50);border-bottom:1.5px solid var(--gris-100)">
              <th style="padding:8px 12px;text-align:left;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Tarea</th>
              <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Semana</th>
              <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Dpto.</th>
              <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">CE</th>
              <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Estado</th>
              <th style="padding:8px 8px;text-align:center;font-size:.7rem;color:var(--gris-400);text-transform:uppercase">Nota</th>
            </tr></thead>
            <tbody>
              ${tareasFiltradas.map(t => `
              <tr style="border-bottom:1px solid var(--gris-50)" onmouseover="this.style.background='var(--gris-50)'" onmouseout="this.style.background=''">
                <td style="padding:8px 12px;color:var(--gris-800);font-weight:500">${t.titulo||'Sin título'}</td>
                <td style="padding:8px 8px;text-align:center;color:var(--gris-500)">S${t.semana||'—'}</td>
                <td style="padding:8px 8px;text-align:center">${DEPT_ICO[t.departamento]||'📋'}</td>
                <td style="padding:8px 8px;text-align:center"><span class="ra-chip" style="font-size:.62rem">${t.ce||t.ra||'RA6'}</span></td>
                <td style="padding:8px 8px;text-align:center">
                  <span style="font-size:.7rem;padding:2px 7px;border-radius:20px;background:${ESTADO_COLOR[t.estado]||'var(--gris-100)'};color:${ESTADO_TXT[t.estado]||'var(--gris-500)'};font-weight:600">
                    ${ESTADO_LABEL[t.estado]||t.estado}
                  </span>
                </td>
                <td style="padding:8px 8px;text-align:center">
                  ${t.estado==='evaluada'
                    ? `<span style="font-weight:700;color:${t.nota>=5?'var(--verde-700)':'#dc2626'}">${t.nota??'—'}/10</span>`
                    : t.estado==='entregada'
                      ? `<button class="btn-accion" style="font-size:.68rem;padding:2px 8px" onclick="irA('tareas')">Evaluar</button>`
                      : '<span style="color:var(--gris-300)">—</span>'}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>`}
    </div>`;
  }

  /* ────────────────────────────────────────────
     TAB: CALIFICACIONES + SÉNECA (unificado)
  ──────────────────────────────────────────── */
  function tabCalificaciones() {
    const cols = [
      { id:'0656', label:'0656 · Simulación' },
      { id:'0657', label:'0657 · Proyecto' },
      { id:'optativa', label:'Optativa' },
    ];
    const sinNota = notasAlumnos.filter(a => cols.every(c => a.notas[c.id]===null||a.notas[c.id]===undefined)).length;

    if (alumnos.length === 0) return `
      <div style="text-align:center;padding:3rem;color:var(--gris-400)">
        <div style="font-size:2.5rem;margin-bottom:.75rem">🏅</div>
        <p style="font-size:.9rem;font-weight:600;color:var(--gris-600)">Sin alumnos configurados</p>
        <button class="btn-accion" style="margin-top:1rem;font-size:.82rem" onclick="irA('evaluacion-docente')">📝 Ir a Evaluación RA/CE</button>
      </div>`;

    /* Pre-generar acta para impresión */
    const año = new Date().getFullYear();
    const actaHtml = `<h1 style="font-size:16px;font-weight:700;margin-bottom:4px">Acta de calificaciones · ${d.nombre||'IES Cantillana'}</h1>
      <p style="font-size:12px;color:#6b7280;margin-bottom:16px">Generada el ${new Date().toLocaleDateString('es-ES')} · Grado Superior Administración y Finanzas · Curso ${año}-${año+1}</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="background:#f0fdf4">
          <th style="padding:7px 10px;border:1px solid #e5e7eb;text-align:left">Alumno/a</th>
          <th style="padding:7px 10px;border:1px solid #e5e7eb;text-align:center">Grupo</th>
          ${cols.map(c=>`<th style="padding:7px 10px;border:1px solid #e5e7eb;text-align:center">${c.label}</th>`).join('')}
          <th style="padding:7px 10px;border:1px solid #e5e7eb;text-align:center">Nota final</th>
        </tr></thead>
        <tbody>${notasAlumnos.map(a => {
          const ns = cols.map(c=>a.notas[c.id]).filter(n=>n!==null);
          const nf = ns.length ? ns.reduce((s,n)=>s+n,0)/ns.length : null;
          const color = n => n===null?'#f5f5f5':n>=9?'#dbeafe':n>=7?'#dcfce7':n>=5?'#fef9c3':'#fee2e2';
          return `<tr>
            <td style="padding:6px 10px;border:1px solid #e5e7eb">${a.nombre}</td>
            <td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:center">${a.grupo||'G1'}</td>
            ${cols.map(c=>`<td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:center;background:${color(a.notas[c.id])};font-weight:600">${a.notas[c.id]!==null&&a.notas[c.id]!==undefined?a.notas[c.id].toFixed(1):'—'}</td>`).join('')}
            <td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:center;background:${color(nf)};font-weight:700;font-size:14px">${nf!==null?nf.toFixed(2).replace('.',','):'—'}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>`;
    if (!window._pgFichas) window._pgFichas = {};
    window._pgFichas['seneca_export'] = { html: actaHtml, titulo:'Acta calificaciones' };

    return `
    ${sinNota > 0 ? `<div style="display:flex;align-items:center;gap:8px;padding:9px 14px;background:#eff6ff;border-left:3px solid #3b82f6;border-radius:0 var(--radio-sm) var(--radio-sm) 0;font-size:.82rem;color:#1e3a8a;margin-bottom:1rem">
      🔵 ${sinNota} alumno${sinNota>1?'s':''} sin calificaciones.
      <button class="btn-secundario" style="font-size:.75rem;padding:3px 10px;margin-left:auto" onclick="irA('evaluacion-docente')">Ir a Evaluación RA/CE →</button>
    </div>` : ''}

    <!-- Tabla de notas -->
    <div style="overflow-x:auto;margin-bottom:1rem;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:var(--verde-50)">
          <th style="text-align:left;padding:9px 12px;font-size:.75rem;color:var(--verde-800);border-bottom:1.5px solid var(--verde-100)">Alumno/a</th>
          <th style="padding:9px 8px;font-size:.75rem;color:var(--verde-800);text-align:center;border-bottom:1.5px solid var(--verde-100)">Grupo</th>
          ${cols.map(c=>`<th style="padding:9px 10px;text-align:center;font-size:.75rem;color:var(--verde-800);border-bottom:1.5px solid var(--verde-100)">${c.label}</th>`).join('')}
          <th style="padding:9px 10px;text-align:center;font-size:.75rem;color:var(--verde-800);border-bottom:1.5px solid var(--verde-100);background:var(--verde-100)">Nota final</th>
        </tr></thead>
        <tbody>
          ${notasAlumnos.map((a,ai) => {
            const ns = cols.map(c=>a.notas[c.id]).filter(n=>n!==null);
            const nf = ns.length ? ns.reduce((s,n)=>s+n,0)/ns.length : null;
            const ncf = notaColor(nf);
            return `<tr style="border-bottom:1px solid var(--gris-50);${ai%2===1?'background:var(--gris-50)':''}">
              <td style="padding:8px 12px;font-weight:500;font-size:.82rem">${a.nombre}</td>
              <td style="padding:8px 8px;text-align:center;font-size:.75rem;color:var(--gris-500)">${a.grupo||'G1'}</td>
              ${cols.map(c => {
                const n=a.notas[c.id]; const nc=notaColor(n);
                return `<td style="padding:8px 10px;text-align:center;background:${n!==null?nc.bg:'var(--blanco)'};color:${n!==null?nc.txt:'var(--gris-300)'};font-weight:${n!==null?700:400};font-size:.85rem">${n!==null?n.toFixed(1):'—'}</td>`;
              }).join('')}
              <td style="padding:8px 10px;text-align:center;background:${nf!==null?ncf.bg:'var(--blanco)'};color:${nf!==null?ncf.txt:'var(--gris-300)'};font-weight:800;font-size:.95rem;border-left:1.5px solid var(--verde-100)">${nf!==null?nf.toFixed(1):'—'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Acciones de exportación -->
    <div style="background:var(--gris-50);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1rem;margin-bottom:1rem">
      <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:.5rem">📤 Exportar a Séneca (Junta de Andalucía)</div>
      <div style="font-size:.78rem;color:var(--gris-500);margin-bottom:.75rem;line-height:1.6">
        Genera un CSV compatible con Séneca: separador <strong>punto y coma</strong>, decimal <strong>coma</strong>, codificación <strong>UTF-8 con BOM</strong>.<br>
        En Séneca: <span style="font-family:var(--fuente-mono);background:var(--gris-100);padding:1px 5px;border-radius:3px;font-size:.72rem">Evaluación → Calificaciones → Importar → Seleccionar archivo</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-accion" style="font-size:.82rem;padding:8px 16px"
          onclick="(function(){
            const rows=[['Apellidos y nombre','NIF/NIE','Grupo','0656 Simulacion empresarial','0657 Proyecto intermodular','Optativa informatica']];
            EMPRESA_STATE.evalDocente.alumnos.forEach(function(a){
              const n56=calcNotaAlumno(a.id,'0656');
              const n57=calcNotaAlumno(a.id,'0657');
              const nOpt=calcNotaAlumno(a.id,'optativa');
              const fmt=function(n){return n!==null&&n!==undefined?String(n.toFixed(2)).replace('.',','):''};
              rows.push([a.nombre,'',a.grupo||'G1',fmt(n56),fmt(n57),fmt(nOpt)]);
            });
            const csv=rows.map(function(r){return r.map(function(c){return'\"'+String(c).replace(/\"/g,'\"\"')+'\"'}).join(';')}).join('\r\n');
            const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
            const url=URL.createObjectURL(blob);
            const a=document.createElement('a');
            a.href=url;a.download='calificaciones_seneca_${new Date().getFullYear()}.csv';
            document.body.appendChild(a);a.click();document.body.removeChild(a);
            URL.revokeObjectURL(url);
            mostrarToast('📤 CSV descargado — listo para importar en Séneca','exito');
          })()">
          📥 Descargar CSV para Séneca
        </button>
        <button class="btn-secundario" style="font-size:.82rem;padding:8px 16px"
          onclick="pgImprimir(window._pgFichas['seneca_export'].html,'Acta calificaciones')">
          🖨️ Imprimir acta
        </button>
        <button class="btn-secundario" style="font-size:.82rem;padding:8px 16px" onclick="irA('evaluacion-docente')">
          📝 Editar calificaciones
        </button>
      </div>
    </div>

    <div style="font-size:.75rem;color:var(--gris-400);line-height:1.7;padding:.75rem 1rem;background:var(--gris-50);border-radius:var(--radio-md)">
      ⚠️ La columna NIF/NIE se deja vacía — rellénala en el CSV antes de importar. · Las notas son la media ponderada de todos los CE de cada RA configurados en <em>Evaluación RA/CE</em>.
    </div>`;
  }

  /* ── Render del tab activo ── */
  const tabDefs = [
    { id:'resumen',         label:'Resumen',            icono:'📊' },
    { id:'empresas',        label:'Grupos y empresa',   icono:'🏢' },
    { id:'tareas',          label:'Tareas',             icono:'✅', badge: tareasEnt > 0 ? tareasEnt : null },
    { id:'calificaciones',  label:'Notas y Séneca',     icono:'🏅' },
  ];

  const contenido =
    pp.tab === 'empresas'       ? tabEmpresas() :
    pp.tab === 'tareas'         ? tabTareas() :
    pp.tab === 'calificaciones' ? tabCalificaciones() :
    tabResumen();

  const tabsHtml = `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--gris-100)">
    ${tabDefs.map(t => `<button
      style="padding:7px 14px;border:none;border-radius:var(--radio-md);font-size:.8rem;font-weight:${pp.tab===t.id?'700':'500'};cursor:pointer;
      background:${pp.tab===t.id?'var(--verde-600)':'var(--gris-100)'};color:${pp.tab===t.id?'white':'var(--gris-600)'};
      display:flex;align-items:center;gap:5px;transition:all .15s"
      onclick="window.PANEL_PROF.tab='${t.id}';renderVista('panel-profesor')">
      ${t.icono} ${t.label}
      ${t.badge ? `<span style="background:${pp.tab===t.id?'rgba(255,255,255,.3)':'#ef4444'};color:${pp.tab===t.id?'white':'white'};border-radius:20px;padding:0 6px;font-size:.65rem;font-weight:700">${t.badge}</span>` : ''}
    </button>`).join('')}
  </div>`;

  return `
  <div class="seccion-header" style="margin-bottom:0">
    <div>
      <h2>📊 Panel docente</h2>
      <p>Semana ${sem} · T${trim} · ${d.nombre||'Sin empresa configurada'}</p>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
      ${alertas.filter(a=>a.nivel==='rojo').length > 0 ? `<span style="background:#fee2e2;color:#991b1b;border-radius:20px;padding:3px 10px;font-size:.75rem;font-weight:600">${alertas.filter(a=>a.nivel==='rojo').length} bloqueo${alertas.filter(a=>a.nivel==='rojo').length>1?'s':''}</span>` : ''}
      ${tareasEnt > 0 ? `<span style="background:#fef3c7;color:#92400e;border-radius:20px;padding:3px 10px;font-size:.75rem;font-weight:600">${tareasEnt} por evaluar</span>` : ''}
      ${correosSinLeer > 0 ? `<span style="background:#eff6ff;color:#1e40af;border-radius:20px;padding:3px 10px;font-size:.75rem;font-weight:600">${correosSinLeer} correos</span>` : ''}
    </div>
  </div>

  <div style="height:1px;background:var(--gris-100);margin:12px 0 16px"></div>
  ${tabsHtml}
  ${contenido}`;
}
/* ============================================================
   DATOS RA/CE DE LOS 3 MÓDULOS
   ============================================================ */
const MODULOS_EVAL = {
  '0656': {
    label: '0656 · Simulación empresarial',
    color: '#134a28',
    colorLight: '#edfaf3',
    ra: [
      { id:'M56RA1', cod:'RA1', label:'Innovación y emprendimiento', ce:[
        {id:'M56RA1a', cod:'a', label:'Facetas de la innovación empresarial'},
        {id:'M56RA1b', cod:'b', label:'Innovación e iniciativa emprendedora'},
        {id:'M56RA1c', cod:'c', label:'Riesgo empresarial como motor económico'},
        {id:'M56RA1d', cod:'d', label:'Carácter emprendedor: actitudes y aptitudes'},
        {id:'M56RA1e', cod:'e', label:'Experiencias de innovación: análisis y valoración'},
      ]},
      { id:'M56RA2', cod:'RA2', label:'Selección y análisis de la idea de negocio', ce:[
        {id:'M56RA2a', cod:'a', label:'Implicaciones de elegir una idea de negocio'},
        {id:'M56RA2b', cod:'b', label:'Idea vs. oportunidad de negocio factible'},
        {id:'M56RA2c', cod:'c', label:'Análisis del sector y entorno competitivo'},
        {id:'M56RA2d', cod:'d', label:'Clientes potenciales y segmentación'},
        {id:'M56RA2e', cod:'e', label:'Análisis DAFO y posicionamiento'},
      ]},
      { id:'M56RA3', cod:'RA3', label:'Elaboración del plan de empresa', ce:[
        {id:'M56RA3a', cod:'a', label:'Presentación: misión, visión y valores'},
        {id:'M56RA3b', cod:'b', label:'Resumen ejecutivo'},
        {id:'M56RA3c', cod:'c', label:'Descripción del negocio y propuesta de valor'},
        {id:'M56RA3d', cod:'d', label:'Plan de marketing'},
        {id:'M56RA3e', cod:'e', label:'Plan organizativo y estructura de RRHH'},
      ]},
      { id:'M56RA4', cod:'RA4', label:'Plan económico-financiero', ce:[
        {id:'M56RA4a', cod:'a', label:'Inversión inicial y fuentes de financiación'},
        {id:'M56RA4b', cod:'b', label:'Previsión de ingresos y gastos'},
        {id:'M56RA4c', cod:'c', label:'Umbral de rentabilidad y período de recuperación'},
        {id:'M56RA4d', cod:'d', label:'VAN y TIR: análisis de viabilidad'},
        {id:'M56RA4e', cod:'e', label:'Toma de decisiones a partir de datos financieros'},
      ]},
      { id:'M56RA5', cod:'RA5', label:'Trámites jurídico-fiscales de constitución', ce:[
        {id:'M56RA5a', cod:'a', label:'Elección y justificación de la forma jurídica'},
        {id:'M56RA5b', cod:'b', label:'Documentación notarial y registral'},
        {id:'M56RA5c', cod:'c', label:'Alta en AEAT: NIF, IAE, IVA (Mod. 036)'},
        {id:'M56RA5d', cod:'d', label:'Alta en Seguridad Social: CCC y afiliación'},
        {id:'M56RA5e', cod:'e', label:'Obligaciones fiscales periódicas'},
      ]},
      { id:'M56RA6', cod:'RA6', label:'Gestión operativa de la empresa', ce:[
        {id:'M56RA6a', cod:'a', label:'Gestión y toma de decisiones — Dirección'},
        {id:'M56RA6b', cod:'b', label:'Gestión comercial: facturación y proveedores (Factusol)'},
        {id:'M56RA6c', cod:'c', label:'Gestión de RRHH: contratos y nóminas (Nominasol)'},
        {id:'M56RA6d', cod:'d', label:'Contabilidad: registro y estados financieros (Contasol)'},
        {id:'M56RA6e', cod:'e', label:'Gestión financiera: tesorería e inversiones'},
        {id:'M56RA6f', cod:'f', label:'Gestión fiscal: autoliquidaciones periódicas'},
      ]},
    ]
  },
  '0657': {
    label: '0657 · Proyecto de administración y finanzas',
    color: '#1e40af',
    colorLight: '#eff6ff',
    ra: [
      { id:'M57RA1', cod:'RA1', label:'Identificación de necesidades del sector', ce:[
        {id:'M57RA1a', cod:'a', label:'Clasificación de empresas del sector'},
        {id:'M57RA1b', cod:'b', label:'Caracterización de empresas tipo'},
        {id:'M57RA1c', cod:'c', label:'Identificación de necesidades demandadas'},
        {id:'M57RA1d', cod:'d', label:'Valoración de oportunidades de negocio'},
        {id:'M57RA1e', cod:'e', label:'Tipo de proyecto requerido'},
        {id:'M57RA1f', cod:'f', label:'Obligaciones fiscales, laborales y de PRL'},
        {id:'M57RA1g', cod:'g', label:'Guión de trabajo del proyecto'},
      ]},
      { id:'M57RA2', cod:'RA2', label:'Diseño del proyecto', ce:[
        {id:'M57RA2a', cod:'a', label:'Recopilación de información relevante'},
        {id:'M57RA2b', cod:'b', label:'Viabilidad técnica del proyecto'},
        {id:'M57RA2c', cod:'c', label:'Fases y contenido del proyecto'},
        {id:'M57RA2d', cod:'d', label:'Objetivos y alcance'},
        {id:'M57RA2e', cod:'e', label:'Recursos materiales y humanos'},
        {id:'M57RA2f', cod:'f', label:'Presupuesto económico'},
        {id:'M57RA2g', cod:'g', label:'Necesidades de financiación'},
        {id:'M57RA2h', cod:'h', label:'Documentación para el diseño'},
        {id:'M57RA2i', cod:'i', label:'Indicadores de calidad del proyecto'},
      ]},
      { id:'M57RA3', cod:'RA3', label:'Planificación de la ejecución', ce:[
        {id:'M57RA3a', cod:'a', label:'Secuenciación de actividades'},
        {id:'M57RA3b', cod:'b', label:'Recursos y logística por actividad'},
        {id:'M57RA3c', cod:'c', label:'Permisos y autorizaciones'},
        {id:'M57RA3d', cod:'d', label:'Procedimientos de ejecución'},
        {id:'M57RA3e', cod:'e', label:'Plan de prevención de riesgos'},
        {id:'M57RA3f', cod:'f', label:'Asignación de recursos y tiempos'},
        {id:'M57RA3g', cod:'g', label:'Valoración económica de la implementación'},
        {id:'M57RA3h', cod:'h', label:'Documentación para la ejecución'},
      ]},
      { id:'M57RA4', cod:'RA4', label:'Seguimiento y control del proyecto', ce:[
        {id:'M57RA4a', cod:'a', label:'Procedimiento de evaluación de actividades'},
        {id:'M57RA4b', cod:'b', label:'Indicadores de calidad para la evaluación'},
        {id:'M57RA4c', cod:'c', label:'Gestión y registro de incidencias'},
        {id:'M57RA4d', cod:'d', label:'Gestión de cambios en recursos y actividades'},
        {id:'M57RA4e', cod:'e', label:'Documentación de evaluación del proyecto'},
        {id:'M57RA4f', cod:'f', label:'Participación de usuarios en la evaluación'},
        {id:'M57RA4g', cod:'g', label:'Sistema de garantía del pliego de condiciones'},
      ]},
    ]
  },
  'optativa': {
    label: 'Optativa · Gestión logística y comercial (0655)',
    color: '#9333ea',
    colorLight: '#faf5ff',
    ra: [
      { id:'MOPRA1', cod:'RA1', label:'Plan de aprovisionamiento', ce:[
        {id:'MOPRA1a', cod:'a', label:'Relaciones de las funciones empresariales con el aprovisionamiento'},
        {id:'MOPRA1b', cod:'b', label:'Cálculo de necesidades y gestión de stocks'},
        {id:'MOPRA1c', cod:'c', label:'Tamaño óptimo de pedido y punto de pedido'},
        {id:'MOPRA1d', cod:'d', label:'Stock de seguridad y ruptura de stock'},
        {id:'MOPRA1e', cod:'e', label:'Aplicaciones informáticas de gestión de stocks'},
      ]},
      { id:'MOPRA2', cod:'RA2', label:'Selección y gestión de proveedores', ce:[
        {id:'MOPRA2a', cod:'a', label:'Fuentes de suministro e identificación de proveedores'},
        {id:'MOPRA2b', cod:'b', label:'Criterios de selección y evaluación de proveedores'},
        {id:'MOPRA2c', cod:'c', label:'Análisis comparativo de ofertas'},
        {id:'MOPRA2d', cod:'d', label:'Registro y valoración de proveedores'},
        {id:'MOPRA2e', cod:'e', label:'Aplicaciones informáticas de gestión de proveedores'},
      ]},
      { id:'MOPRA3', cod:'RA3', label:'Relaciones y negociación con proveedores', ce:[
        {id:'MOPRA3a', cod:'a', label:'Técnicas de comunicación con proveedores'},
        {id:'MOPRA3b', cod:'b', label:'Documentos de intercambio de información'},
        {id:'MOPRA3c', cod:'c', label:'Etapas y técnicas de negociación'},
        {id:'MOPRA3d', cod:'d', label:'Elaboración de informe de negociación'},
      ]},
      { id:'MOPRA4', cod:'RA4', label:'Seguimiento y control del aprovisionamiento', ce:[
        {id:'MOPRA4a', cod:'a', label:'Flujos de información entre departamentos'},
        {id:'MOPRA4b', cod:'b', label:'Control documental del proceso de aprovisionamiento'},
        {id:'MOPRA4c', cod:'c', label:'Indicadores de calidad y eficacia operativa'},
        {id:'MOPRA4d', cod:'d', label:'Incidencias y medidas correctoras en la recepción'},
        {id:'MOPRA4e', cod:'e', label:'Informes de evaluación de proveedores'},
      ]},
      { id:'MOPRA5', cod:'RA5', label:'Cadena logística', ce:[
        {id:'MOPRA5a', cod:'a', label:'Características básicas de la cadena logística'},
        {id:'MOPRA5b', cod:'b', label:'Costes logísticos directos e indirectos'},
        {id:'MOPRA5c', cod:'c', label:'Modelos de distribución y optimización'},
        {id:'MOPRA5d', cod:'d', label:'Logística inversa y responsabilidad corporativa'},
        {id:'MOPRA5e', cod:'e', label:'Aplicaciones informáticas de trazabilidad'},
      ]},
    ]
  }
};

/* ============================================================
   HELPERS DE PONDERACIÓN
   ============================================================ */
function getPesoRA(moduloId, raId) {
  const ev = EMPRESA_STATE.evalDocente;
  if (ev.modoPonderacion === 'auto') {
    const mod = MODULOS_EVAL[moduloId];
    if (!mod) return 0;
    return parseFloat((100 / mod.ra.length).toFixed(2));
  }
  const stored = (ev.pesos[moduloId] || {})[raId];
  return stored !== null && stored !== undefined ? stored : 0;
}

function getPesoCE(raObj) {
  const ev = EMPRESA_STATE.evalDocente;
  return function(ceId) {
    if (ev.modoPonderacion === 'auto') {
      return parseFloat((100 / raObj.ce.length).toFixed(2));
    }
    const stored = ev.pesosCE[ceId];
    return stored !== null && stored !== undefined ? stored : 0;
  };
}

function sumaPesosRA(moduloId) {
  const mod = MODULOS_EVAL[moduloId];
  if (!mod) return 0;
  return mod.ra.reduce((s, ra) => s + getPesoRA(moduloId, ra.cod), 0);
}

function normalizarPesosRA(moduloId) {
  const ev = EMPRESA_STATE.evalDocente;
  const mod = MODULOS_EVAL[moduloId];
  if (!mod) return;
  const total = sumaPesosRA(moduloId);
  if (total === 0) return;
  if (!ev.pesos[moduloId]) ev.pesos[moduloId] = {};
  mod.ra.forEach(ra => {
    const p = getPesoRA(moduloId, ra.cod);
    ev.pesos[moduloId][ra.cod] = parseFloat(((p / total) * 100).toFixed(2));
  });
}

function normalizarPesosCE(raObj) {
  const ev = EMPRESA_STATE.evalDocente;
  const total = raObj.ce.reduce((s, ce) => s + (ev.pesosCE[ce.id] || 0), 0);
  if (total === 0) return;
  raObj.ce.forEach(ce => {
    const p = ev.pesosCE[ce.id] || 0;
    ev.pesosCE[ce.id] = parseFloat(((p / total) * 100).toFixed(2));
  });
}

function calcNotaAlumno(alumnoId, moduloId) {
  const ev = EMPRESA_STATE.evalDocente;
  const mod = MODULOS_EVAL[moduloId];
  if (!mod) return null;
  const califs = ev.calificaciones[alumnoId] || {};
  let notaModulo = 0;
  let pesoTotal = 0;
  mod.ra.forEach(ra => {
    const pesoRA = getPesoRA(moduloId, ra.cod) / 100;
    if (pesoRA === 0) return;
    const getPCE = getPesoCE(ra);
    let notaRA = 0;
    let pesoCETotal = 0;
    ra.ce.forEach(ce => {
      const pceCE = getPCE(ce.id) / 100;
      const nota = califs[ce.id];
      if (nota !== null && nota !== undefined) {
        notaRA += nota * pceCE;
        pesoCETotal += pceCE;
      }
    });
    if (pesoCETotal > 0) {
      notaModulo += (notaRA / pesoCETotal) * pesoRA;
      pesoTotal += pesoRA;
    }
  });
  return pesoTotal > 0 ? parseFloat((notaModulo / pesoTotal).toFixed(2)) : null;
}

function notaColor(nota) {
  if (nota === null || nota === undefined) return { bg: 'var(--color-background-secondary)', txt: 'var(--color-text-secondary)' };
  if (nota >= 9)  return { bg: '#dbeafe', txt: '#1e40af' };
  if (nota >= 7)  return { bg: '#dcfce7', txt: '#166534' };
  if (nota >= 5)  return { bg: '#fef9c3', txt: '#854d0e' };
  return { bg: '#fee2e2', txt: '#991b1b' };
}

/* ============================================================
   VISTA PRINCIPAL: EVALUACIÓN DOCENTE
   ============================================================ */
function vistaEvalDocente() {
  const ev  = EMPRESA_STATE.evalDocente;
  const tab = ev.tabActiva;

  const tabs = [
    { id:'0656', label:'0656 · Simulación', icono:'🏢' },
    { id:'0657', label:'0657 · Proyecto',   icono:'📋' },
    { id:'optativa', label:'Optativa · Logística', icono:'🔄' },
    { id:'calificaciones', label:'Calificaciones', icono:'🏅' },
  ];

  return `
  <div class="seccion-header">
    <div>
      <h2>📝 Evaluación RA/CE</h2>
      <p>Ponderación de resultados de aprendizaje y criterios de evaluación · Vista docente</p>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <span style="font-size:.78rem;color:var(--gris-500)">Modo ponderación:</span>
      <button onclick="EMPRESA_STATE.evalDocente.modoPonderacion='auto';renderVista('evaluacion-docente')"
        class="${ev.modoPonderacion==='auto'?'btn-accion':'btn-secundario'}" style="padding:5px 12px;font-size:.78rem">
        ⚖️ Automático
      </button>
      <button onclick="EMPRESA_STATE.evalDocente.modoPonderacion='manual';renderVista('evaluacion-docente')"
        class="${ev.modoPonderacion==='manual'?'btn-accion':'btn-secundario'}" style="padding:5px 12px;font-size:.78rem">
        ✏️ Manual
      </button>
    </div>
  </div>

  ${ev.modoPonderacion==='auto' ? `
  <div style="padding:8px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:var(--radio-md);font-size:.8rem;color:#1e40af;margin-bottom:1rem">
    <strong>Modo automático:</strong> cada RA recibe el mismo peso dentro del módulo, y cada CE el mismo peso dentro de su RA. Los pesos se recalculan solos — suma siempre el 100%.
  </div>` : `
  <div style="padding:8px 14px;background:#fef9ec;border:1px solid #fde68a;border-radius:var(--radio-md);font-size:.8rem;color:#92400e;margin-bottom:1rem">
    <strong>Modo manual:</strong> introduce los pesos manualmente. Usa "Normalizar" para que la suma de RA y de CE ajuste al 100% automáticamente.
  </div>`}

  <!-- Tabs de módulos -->
  <div style="display:flex;gap:4px;margin-bottom:1.25rem;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:6px;overflow-x:auto">
    ${tabs.map(t => `
    <button onclick="EMPRESA_STATE.evalDocente.tabActiva='${t.id}';renderVista('evaluacion-docente')"
      style="flex:1;min-width:120px;padding:9px 12px;border:none;border-radius:var(--radio-md);font-size:.82rem;
      font-weight:${tab===t.id?'700':'500'};cursor:pointer;
      background:${tab===t.id?'var(--verde-600)':'transparent'};
      color:${tab===t.id?'white':'var(--gris-500)'};transition:all .2s;
      display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap">
      ${t.icono} ${t.label}
    </button>`).join('')}
  </div>

  <!-- Contenido del tab activo -->
  ${tab === 'calificaciones' ? panelCalificaciones() : panelModuloEval(tab)}
  `;
}

/* ── Panel de un módulo ──────────────────────────────────── */
function panelModuloEval(moduloId) {
  const ev  = EMPRESA_STATE.evalDocente;
  const mod = MODULOS_EVAL[moduloId];
  if (!mod) return '<p>Módulo no encontrado</p>';
  const alumnos = ev.alumnos;
  const sumaRA  = sumaPesosRA(moduloId);
  const manual  = ev.modoPonderacion === 'manual';

  return `
  <div style="display:flex;flex-direction:column;gap:1rem">

    <!-- Cabecera del módulo con pesos de RA -->
    <div class="ficha-card" style="border-color:${mod.color}">
      <div class="ficha-card-header" style="background:${mod.colorLight}">
        <span style="font-size:1.1rem">📊</span>
        <span style="flex:1;font-weight:700;color:${mod.color}">${mod.label}</span>
        ${manual ? `
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:.75rem;color:${sumaRA>100.1||sumaRA<99.9?'#dc2626':'#166534'};font-weight:700">
            Σ RA = ${sumaRA.toFixed(1)}%
          </span>
          <button class="btn-secundario" style="padding:4px 10px;font-size:.75rem"
            onclick="normalizarPesosRA('${moduloId}');renderVista('evaluacion-docente')">
            ⚖️ Normalizar RA
          </button>
        </div>` : `
        <span style="font-size:.75rem;color:#166534;font-weight:600">✓ Ponderación automática — ${mod.ra.length} RA × ${(100/mod.ra.length).toFixed(1)}%</span>`}
      </div>

      <!-- Grid resumen de RA con sus pesos -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;padding:4px 0 8px">
        ${mod.ra.map(ra => {
          const peso = getPesoRA(moduloId, ra.cod);
          return `
          <div style="padding:8px 10px;border:1px solid var(--gris-100);border-radius:var(--radio-md);background:var(--gris-50)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:.78rem;font-weight:700;color:${mod.color}">${ra.cod}</span>
              ${manual ? `
              <input type="number" min="0" max="100" step="0.1" value="${peso}"
                style="width:58px;padding:3px 6px;border:1.5px solid var(--verde-300);border-radius:4px;font-size:.78rem;font-family:var(--fuente-cuerpo);text-align:right;background:var(--verde-50)"
                oninput="if(!EMPRESA_STATE.evalDocente.pesos['${moduloId}'])EMPRESA_STATE.evalDocente.pesos['${moduloId}']={};EMPRESA_STATE.evalDocente.pesos['${moduloId}']['${ra.cod}']=parseFloat(this.value)||0"
                onblur="renderVista('evaluacion-docente')">
              <span style="font-size:.7rem;color:var(--gris-400)">%</span>` : `
              <span style="font-size:.82rem;font-weight:700;color:${mod.color}">${peso.toFixed(1)}%</span>`}
            </div>
            <div style="font-size:.72rem;color:var(--gris-600);line-height:1.3">${ra.label}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Un acordeón por RA con sus CE y notas por alumno -->
    ${mod.ra.map(ra => panelRAEval(moduloId, ra, alumnos, manual)).join('')}
  </div>`;
}

/* ── Panel de un RA con sus CE ──────────────────────────── */
function panelRAEval(moduloId, ra, alumnos, manual) {
  const ev     = EMPRESA_STATE.evalDocente;
  const getPCE = getPesoCE(ra);
  const sumaCE = ra.ce.reduce((s, ce) => s + getPCE(ce.id), 0);
  const mod    = MODULOS_EVAL[moduloId];

  return `
  <div class="ficha-card">
    <div class="ficha-card-header" style="cursor:pointer"
      onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
      <span style="width:28px;height:28px;border-radius:50%;background:${mod.colorLight};color:${mod.color};font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ra.cod}</span>
      <span style="flex:1;font-size:.875rem;font-weight:600;color:var(--gris-800)">${ra.label}</span>
      <span style="font-size:.75rem;color:var(--gris-400)">${ra.ce.length} CE</span>
      ${manual ? `
      <span style="font-size:.73rem;font-weight:700;margin-left:8px;color:${sumaCE>100.1||sumaCE<99.9?'#dc2626':'#166534'}">
        Σ CE = ${sumaCE.toFixed(1)}%
      </span>
      <button class="btn-secundario" style="margin-left:8px;padding:3px 8px;font-size:.72rem"
        onclick="event.stopPropagation();normalizarPesosCE(MODULOS_EVAL['${moduloId}'].ra.find(r=>r.id==='${ra.id}'));renderVista('evaluacion-docente')">
        ⚖️ Normalizar CE
      </button>` : ''}
      <span style="font-size:.75rem;color:var(--gris-400);margin-left:8px">▼</span>
    </div>

    <div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.8rem;min-width:560px">
          <thead>
            <tr style="border-bottom:1.5px solid ${mod.color}22;background:${mod.colorLight}">
              <th style="text-align:left;padding:7px 10px;font-size:.7rem;color:${mod.color};width:30px">${ra.cod}</th>
              <th style="text-align:left;padding:7px 10px;font-size:.7rem;color:${mod.color}">Criterio de evaluación</th>
              ${manual ? `<th style="text-align:center;padding:7px 8px;font-size:.7rem;color:${mod.color};white-space:nowrap">Peso %</th>` : `<th style="text-align:center;padding:7px 8px;font-size:.7rem;color:${mod.color}">Peso</th>`}
              ${alumnos.map(a => `<th style="text-align:center;padding:7px 6px;font-size:.7rem;color:${mod.color};min-width:72px;white-space:nowrap">${a.nombre.split(' ')[0]}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${ra.ce.map((ce, ci) => {
              const peso = getPCE(ce.id);
              return `
              <tr style="border-bottom:1px solid var(--gris-50);${ci%2===1?'background:var(--gris-50)':''}">
                <td style="padding:7px 10px;font-size:.72rem;font-weight:700;color:${mod.color}">${ce.cod}</td>
                <td style="padding:7px 10px;color:var(--gris-700);line-height:1.3">${ce.label}</td>
                <td style="padding:7px 8px;text-align:center">
                  ${manual ? `
                  <input type="number" min="0" max="100" step="0.1" value="${peso}"
                    style="width:60px;padding:3px 5px;border:1.5px solid var(--verde-300);border-radius:4px;font-size:.78rem;font-family:var(--fuente-cuerpo);text-align:center;background:var(--verde-50)"
                    oninput="EMPRESA_STATE.evalDocente.pesosCE['${ce.id}']=parseFloat(this.value)||0"
                    onblur="renderVista('evaluacion-docente')">` : `
                  <span style="font-size:.78rem;font-weight:600;color:${mod.color}">${peso.toFixed(1)}%</span>`}
                </td>
                ${alumnos.map(a => {
                  const califs = ev.calificaciones[a.id] || {};
                  const nota   = califs[ce.id];
                  const nc     = notaColor(nota);
                  return `
                  <td style="padding:5px 6px;text-align:center">
                    <input type="number" min="0" max="10" step="0.5" value="${nota!==undefined&&nota!==null?nota:''}"
                      placeholder="—"
                      style="width:56px;padding:4px;border:1.5px solid var(--gris-200);border-radius:6px;font-size:.82rem;
                      font-family:var(--fuente-cuerpo);text-align:center;
                      background:${nota!==undefined&&nota!==null?nc.bg:'var(--blanco)'};
                      color:${nota!==undefined&&nota!==null?nc.txt:'var(--gris-400)'};font-weight:600"
                      oninput="setCalifCE('${a.id}','${ce.id}',this.value)"
                      onchange="renderVista('evaluacion-docente')">
                  </td>`;
                }).join('')}
              </tr>`;
            }).join('')}
          </tbody>
          <!-- Fila de medias del RA -->
          <tfoot>
            <tr style="border-top:2px solid ${mod.color}44;background:${mod.colorLight}">
              <td colspan="3" style="padding:7px 10px;font-size:.75rem;font-weight:700;color:${mod.color}">Media ${ra.cod}</td>
              ${alumnos.map(a => {
                const califs = ev.calificaciones[a.id] || {};
                const getPCEF = getPesoCE(ra);
                let suma = 0; let pesoAcc = 0;
                ra.ce.forEach(ce => {
                  const nota = califs[ce.id];
                  const p = getPCEF(ce.id)/100;
                  if (nota !== null && nota !== undefined) { suma += nota*p; pesoAcc += p; }
                });
                const media = pesoAcc > 0 ? parseFloat((suma/pesoAcc).toFixed(2)) : null;
                const nc = notaColor(media);
                return `<td style="padding:7px 6px;text-align:center">
                  <span style="font-size:.82rem;font-weight:700;padding:3px 8px;border-radius:20px;background:${nc.bg};color:${nc.txt}">
                    ${media !== null ? media.toFixed(1) : '—'}
                  </span>
                </td>`;
              }).join('')}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>`;
}

/* ── Panel de calificaciones globales ─────────────────────── */
function panelCalificaciones() {
  const ev      = EMPRESA_STATE.evalDocente;
  const alumnos = ev.alumnos;
  const modIds  = ['0656','0657','optativa'];

  return `
  <div style="display:flex;flex-direction:column;gap:1.25rem">

    <!-- Gestión de alumnos -->
    <div class="ficha-card">
      <div class="ficha-card-header">
        <span>👥</span> Alumnos del grupo
        <button class="btn-accion" style="margin-left:auto;padding:5px 12px;font-size:.78rem"
          onclick="evalAddAlumno()">+ Añadir alumno/a</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 0">
        ${alumnos.map(a => `
        <div style="display:flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid var(--gris-200);border-radius:20px;background:var(--gris-50)">
          <input type="text" value="${a.nombre}"
            style="border:none;background:transparent;font-size:.82rem;color:var(--gris-800);width:130px;font-family:var(--fuente-cuerpo)"
            oninput="EMPRESA_STATE.evalDocente.alumnos.find(x=>x.id==='${a.id}').nombre=this.value">
          <button onclick="evalDelAlumno('${a.id}')"
            style="border:none;background:transparent;cursor:pointer;color:var(--gris-400);font-size:.75rem;padding:0">✕</button>
        </div>`).join('')}
      </div>
    </div>

    <!-- Tabla de calificaciones por módulo -->
    ${modIds.map(mId => {
      const mod = MODULOS_EVAL[mId];
      return `
      <div class="ficha-card" style="border-color:${mod.color}">
        <div class="ficha-card-header" style="background:${mod.colorLight}">
          <span style="font-size:1rem">📊</span>
          <span style="font-weight:700;color:${mod.color}">${mod.label}</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:.82rem;min-width:400px">
            <thead>
              <tr style="border-bottom:1.5px solid ${mod.color}33">
                <th style="text-align:left;padding:8px 12px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Alumno/a</th>
                ${mod.ra.map(ra => `<th style="text-align:center;padding:8px 6px;font-size:.7rem;color:${mod.color};min-width:68px">${ra.cod}</th>`).join('')}
                <th style="text-align:center;padding:8px 10px;font-size:.7rem;color:${mod.color};min-width:80px;font-weight:700">NOTA MÓD.</th>
              </tr>
            </thead>
            <tbody>
              ${alumnos.map((a, ai) => {
                const califs = ev.calificaciones[a.id] || {};
                const notaMod = calcNotaAlumno(a.id, mId);
                const nc = notaColor(notaMod);
                return `
                <tr style="border-bottom:1px solid var(--gris-50);${ai%2===1?'background:var(--gris-50)':''}">
                  <td style="padding:8px 12px;font-weight:500;color:var(--gris-800)">${a.nombre}</td>
                  ${mod.ra.map(ra => {
                    const getPCEF = getPesoCE(ra);
                    let suma = 0; let pesoAcc = 0;
                    ra.ce.forEach(ce => {
                      const nota = califs[ce.id];
                      const p = getPCEF(ce.id)/100;
                      if (nota !== null && nota !== undefined) { suma += nota*p; pesoAcc += p; }
                    });
                    const mediaRA = pesoAcc>0 ? parseFloat((suma/pesoAcc).toFixed(2)) : null;
                    const nc2 = notaColor(mediaRA);
                    return `<td style="padding:8px 6px;text-align:center">
                      <span style="font-size:.82rem;font-weight:600;padding:3px 8px;border-radius:20px;background:${nc2.bg};color:${nc2.txt}">
                        ${mediaRA !== null ? mediaRA.toFixed(1) : '—'}
                      </span>
                    </td>`;
                  }).join('')}
                  <td style="padding:8px 10px;text-align:center">
                    <span style="font-size:.9rem;font-weight:800;padding:4px 12px;border-radius:20px;background:${nc.bg};color:${nc.txt}">
                      ${notaMod !== null ? notaMod.toFixed(1) : '—'}
                    </span>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
            <!-- Fila de medias del grupo -->
            <tfoot>
              <tr style="border-top:2px solid ${mod.color}44;background:${mod.colorLight}">
                <td style="padding:8px 12px;font-size:.75rem;font-weight:700;color:${mod.color}">Media grupo</td>
                ${mod.ra.map(ra => {
                  const getPCEF = getPesoCE(ra);
                  const notas = alumnos.map(a => {
                    const califs = ev.calificaciones[a.id] || {};
                    let suma = 0; let pesoAcc = 0;
                    ra.ce.forEach(ce => {
                      const nota = califs[ce.id];
                      const p = getPCEF(ce.id)/100;
                      if (nota !== null && nota !== undefined) { suma += nota*p; pesoAcc += p; }
                    });
                    return pesoAcc>0 ? suma/pesoAcc : null;
                  }).filter(v=>v!==null);
                  const mg = notas.length ? parseFloat((notas.reduce((s,v)=>s+v,0)/notas.length).toFixed(2)) : null;
                  const nc3 = notaColor(mg);
                  return `<td style="padding:8px 6px;text-align:center">
                    <span style="font-size:.78rem;font-weight:700;padding:2px 8px;border-radius:20px;background:${nc3.bg};color:${nc3.txt}">
                      ${mg !== null ? mg.toFixed(1) : '—'}
                    </span>
                  </td>`;
                }).join('')}
                <td style="padding:8px 10px;text-align:center">
                  ${(() => {
                    const notas = alumnos.map(a => calcNotaAlumno(a.id, mId)).filter(v=>v!==null);
                    const mg = notas.length ? parseFloat((notas.reduce((s,v)=>s+v,0)/notas.length).toFixed(2)) : null;
                    const nc4 = notaColor(mg);
                    return `<span style="font-size:.85rem;font-weight:800;padding:4px 10px;border-radius:20px;background:${nc4.bg};color:${nc4.txt}">${mg !== null ? mg.toFixed(1) : '—'}</span>`;
                  })()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>`;
    }).join('')}

    <!-- Nota final ponderada de los 3 módulos -->
    <div class="ficha-card" style="border-color:var(--verde-500)">
      <div class="ficha-card-header" style="background:var(--verde-50)">
        <span>🏅</span>
        <span style="font-weight:700;color:var(--verde-800)">Nota final ponderada (media de los 3 módulos)</span>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
          <thead>
            <tr style="border-bottom:1.5px solid var(--verde-200)">
              <th style="text-align:left;padding:8px 12px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Alumno/a</th>
              <th style="text-align:center;padding:8px;font-size:.7rem;color:#134a28">0656</th>
              <th style="text-align:center;padding:8px;font-size:.7rem;color:#1e40af">0657</th>
              <th style="text-align:center;padding:8px;font-size:.7rem;color:#9333ea">Optativa</th>
              <th style="text-align:center;padding:8px 12px;font-size:.7rem;color:var(--verde-800);font-weight:700">NOTA FINAL</th>
            </tr>
          </thead>
          <tbody>
            ${alumnos.map((a, ai) => {
              const notas = modIds.map(m => calcNotaAlumno(a.id, m));
              const validas = notas.filter(v=>v!==null);
              const final = validas.length ? parseFloat((validas.reduce((s,v)=>s+v,0)/validas.length).toFixed(2)) : null;
              const nc = notaColor(final);
              return `
              <tr style="border-bottom:1px solid var(--gris-50);${ai%2===1?'background:var(--gris-50)':''}">
                <td style="padding:9px 12px;font-weight:500;color:var(--gris-800)">${a.nombre}</td>
                ${notas.map((n,ni) => { const c = notaColor(n); return `<td style="padding:8px;text-align:center"><span style="font-size:.82rem;font-weight:600;padding:3px 8px;border-radius:20px;background:${c.bg};color:${c.txt}">${n!==null?n.toFixed(1):'—'}</span></td>`; }).join('')}
                <td style="padding:9px 12px;text-align:center">
                  <span style="font-size:1rem;font-weight:800;padding:5px 14px;border-radius:20px;background:${nc.bg};color:${nc.txt}">
                    ${final !== null ? final.toFixed(1) : '—'}
                  </span>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

/* ── Helpers de calificaciones ────────────────────────────── */
function setCalifCE(alumnoId, ceId, valor) {
  const ev = EMPRESA_STATE.evalDocente;
  if (!ev.calificaciones[alumnoId]) ev.calificaciones[alumnoId] = {};
  const n = parseFloat(valor);
  ev.calificaciones[alumnoId][ceId] = isNaN(n) ? null : Math.min(10, Math.max(0, n));
}

function evalAddAlumno() {
  const ev = EMPRESA_STATE.evalDocente;
  const id = 'a' + Date.now();
  ev.alumnos.push({ id, nombre: 'Alumno/a ' + (ev.alumnos.length + 1), grupo: 'G1' });
  renderVista('evaluacion-docente');
}

function evalDelAlumno(id) {
  const ev = EMPRESA_STATE.evalDocente;
  ev.alumnos = ev.alumnos.filter(a => a.id !== id);
  delete ev.calificaciones[id];
  renderVista('evaluacion-docente');
}
function vistaRanking() {
  const datos = window.RANKING_DATOS || [];
  const medallas = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'];
  const esPropio = g => g.id === (APP.perfil?.grupoId || 'G1');
  const maxScore = Math.max(...datos.map(g=>g.score), 1);

  const tabla = datos.length === 0
    ? `<div style="text-align:center;padding:32px;color:var(--gris-400)">
        <div style="font-size:2rem;margin-bottom:8px">📡</div>
        <div style="font-weight:600;margin-bottom:4px">${MODO_DEMO ? 'Modo demo activo' : 'Sin datos todavía'}</div>
        <div style="font-size:.82rem">${MODO_DEMO
          ? 'Configura Firebase en el código para activar el ranking en tiempo real entre grupos.'
          : 'Los datos aparecerán en cuanto los grupos comiencen a registrar actividad.'}</div>
        ${MODO_DEMO ? `<button class="btn-secundario" style="margin-top:12px;font-size:.8rem"
          onclick="rankingCargarDemo()">🎲 Cargar datos de ejemplo</button>` : ''}
      </div>`
    : `<div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:.82rem">
        <thead>
          <tr style="background:var(--verde-50);border-bottom:2px solid var(--verde-200)">
            <th style="padding:8px 10px;text-align:center;width:36px;color:var(--verde-800);font-size:.72rem">#</th>
            <th style="padding:8px 10px;text-align:left;color:var(--verde-800);font-size:.72rem">Empresa</th>
            <th style="padding:8px 10px;text-align:center;color:var(--verde-800);font-size:.72rem">Puntos</th>
            <th style="padding:8px 10px;text-align:center;color:var(--verde-800);font-size:.72rem">Transacciones</th>
            <th style="padding:8px 10px;text-align:center;color:var(--verde-800);font-size:.72rem">Facturado</th>
            <th style="padding:8px 10px;text-align:center;color:var(--verde-800);font-size:.72rem">Tareas eval.</th>
            <th style="padding:8px 10px;text-align:center;color:var(--verde-800);font-size:.72rem">Plan empresa</th>
            <th style="padding:8px 10px;text-align:left;color:var(--verde-800);font-size:.72rem">Barra</th>
          </tr>
        </thead>
        <tbody>
          ${datos.map((g,i) => {
            const pct    = Math.round(g.score/maxScore*100);
            const propio = esPropio(g);
            const colBar = i===0?'var(--verde-500)':i===1?'var(--verde-400)':i===2?'var(--verde-300)':'var(--gris-300)';
            return `<tr style="${propio?'background:var(--verde-50);font-weight:700;':''}border-bottom:1px solid var(--gris-100)">
              <td style="padding:8px 10px;text-align:center;font-size:1.1rem">${medallas[i]||i+1}</td>
              <td style="padding:8px 10px">
                <div style="font-weight:600;color:${propio?'var(--verde-800)':'var(--gris-800)'}">${g.nombre}</div>
                <div style="font-size:.7rem;color:var(--gris-400)">${g.id}${propio?' · <strong style=color:var(--verde-600)>tu grupo</strong>':''}</div>
              </td>
              <td style="padding:8px 10px;text-align:center;font-weight:700;font-size:.95rem;color:${propio?'var(--verde-700)':'var(--gris-800)'}">${g.score}</td>
              <td style="padding:8px 10px;text-align:center">${g.tx}</td>
              <td style="padding:8px 10px;text-align:center">${(g.facturado||0).toLocaleString('es-ES')} €</td>
              <td style="padding:8px 10px;text-align:center">${g.tareasEv}</td>
              <td style="padding:8px 10px;text-align:center">
                <div style="display:flex;align-items:center;gap:4px;justify-content:center">
                  <div style="width:40px;height:5px;background:var(--gris-100);border-radius:3px;overflow:hidden">
                    <div style="width:${g.planPct||0}%;height:100%;background:var(--verde-400);border-radius:3px"></div>
                  </div>
                  <span style="font-size:.72rem;color:var(--gris-500)">${g.planPct||0}%</span>
                </div>
              </td>
              <td style="padding:8px 10px;min-width:100px">
                <div style="height:8px;background:var(--gris-100);border-radius:4px;overflow:hidden">
                  <div style="width:${pct}%;height:100%;background:${colBar};border-radius:4px;transition:width .6s"></div>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;

  const ultimaActu = window.RANKING_TS
    ? 'Última actualización: ' + new Date(window.RANKING_TS).toLocaleTimeString('es-ES')
    : '';

  return `
  <div class="seccion-header">
    <div>
      <h2>🏆 Ranking de empresas</h2>
      <p>Comparativa en tiempo real entre todos los grupos del aula</p>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <button class="btn-ayuda-ctx" data-ayuda="ranking" onclick="toggleAyuda('ranking')" title="Conceptos y ayuda">❓ Ayuda</button>
      ${!MODO_DEMO ? `<button class="btn-secundario" style="font-size:.78rem;padding:5px 12px"
        onclick="rankingRecargar();mostrarToast('🔄 Actualizando…','')">🔄 Actualizar</button>` : ''}
      <span class="ra-chip">Intergrupal</span>
    </div>
  </div>

  <!-- Leyenda de puntuación -->
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;padding:10px 14px;
    background:var(--gris-50);border-radius:var(--radio-md);font-size:.75rem;color:var(--gris-500)">
    <span>🔄 Transacción completada = <strong>10 pts</strong></span>
    <span>💶 100 € facturados = <strong>1 pt</strong></span>
    <span>✅ Tarea evaluada = <strong>8 pts</strong></span>
    <span>📋 Plan empresa 1% = <strong>5 pts</strong></span>
    ${ultimaActu ? `<span style="margin-left:auto;color:var(--gris-400)">${ultimaActu}</span>` : ''}
  </div>

  ${tabla}

  ${MODO_DEMO ? `
  <div style="margin-top:16px;padding:12px 14px;background:#eff6ff;border:1px solid #bfdbfe;
    border-radius:var(--radio-md);font-size:.8rem;color:#1e3a8a">
    <strong>Para activar el ranking real:</strong><br>
    1. Crea un proyecto en <a href="https://console.firebase.google.com" target="_blank" style="color:#1d4ed8">Firebase Console</a><br>
    2. Sustituye los valores de <code>FIREBASE_CONFIG</code> en el código fuente<br>
    3. Cambia <code>const MODO_DEMO = true</code> a <code>false</code><br>
    4. Cada grupo verá el ranking actualizado en tiempo real cuando cualquier empresa registre actividad
  </div>` : ''}`;
}


function vistaProxima(desc) {
  return `
  <div class="empty-state">
    <div class="icono">🚧</div>
    <h3>Módulo en desarrollo</h3>
    <p>${desc || 'Este módulo estará disponible en la próxima versión de SimulApp.'}</p>
    <button class="btn-secundario" onclick="irA('dashboard')" style="margin-top:8px">← Volver al dashboard</button>
  </div>`;
}

/* ============================================================
   UI HELPERS
   ============================================================ */
/* ============================================================
   SISTEMA DE NOTIFICACIONES
   ============================================================ */

/* ── Configuración de tipos ───────────────────────────────── */
const NOTIF_TIPOS = {
  tarea:      { icono:'📋', bg:'#eff6ff', color:'#1e40af', label:'Tarea' },
  correo:     { icono:'📧', bg:'var(--verde-100)', color:'var(--verde-800)', label:'Correo' },
  mercado:    { icono:'⚡', bg:'#fef9ec', color:'#92400e', label:'Mercado' },
  evaluacion: { icono:'📝', bg:'#faf5ff', color:'#9333ea', label:'Evaluación' },
  sistema:    { icono:'🔔', bg:'var(--gris-100)', color:'var(--gris-600)', label:'Sistema' },
  fiscal:     { icono:'⚖️', bg:'#fef9ec', color:'#92400e', label:'Fiscal' },
  rrhh:       { icono:'👥', bg:'#eff6ff', color:'#1e40af', label:'RRHH' },
  docente:    { icono:'👩‍🏫', bg:'#fce7f3', color:'#9d174d', label:'Docente' },
};

/* ── Añadir notificación al estado ────────────────────────── */
function notifAñadir(tipo, titulo, cuerpo, opciones={}) {
  const n = {
    id:          'n' + Date.now() + Math.random().toString(36).slice(2,6),
    tipo:        tipo || 'sistema',
    titulo,
    cuerpo:      cuerpo || '',
    icono:       opciones.icono || NOTIF_TIPOS[tipo]?.icono || '🔔',
    ts:          new Date().toISOString(),
    leida:       false,
    accion:      opciones.accion  || null,   // función JS a ejecutar al clicar
    accionLabel: opciones.accionLabel || null,
    autor:       opciones.autor   || (APP.rolActivo !== 'alumno' ? 'Docente' : 'Sistema'),
    grupo:       opciones.grupo   || null,
  };
  EMPRESA_STATE.notificaciones.items.unshift(n);
  // Limitar historial a 50
  if (EMPRESA_STATE.notificaciones.items.length > 50) EMPRESA_STATE.notificaciones.items.length = 50;
  actualizarBadgeNotif();
  return n.id;
}

/* ── Leer una o todas ────────────────────────────────────── */
function notifLeer(id) {
  if (id === 'todas') {
    EMPRESA_STATE.notificaciones.items.forEach(n => n.leida = true);
  } else {
    const n = EMPRESA_STATE.notificaciones.items.find(x => x.id === id);
    if (n) n.leida = true;
  }
  actualizarBadgeNotif();
  renderNotifPanel();
}

/* ── Eliminar una notificación ───────────────────────────── */
function notifEliminar(id) {
  EMPRESA_STATE.notificaciones.items = EMPRESA_STATE.notificaciones.items.filter(n => n.id !== id);
  actualizarBadgeNotif();
  renderNotifPanel();
}

/* ── Actualizar badge ────────────────────────────────────── */
function actualizarBadgeNotif() {
  const noLeidas = EMPRESA_STATE.notificaciones.items.filter(n => !n.leida).length;
  EMPRESA_STATE.notificaciones.noLeidas = noLeidas;
  const badge = document.getElementById('notif-count');
  if (badge) {
    badge.textContent = noLeidas > 9 ? '9+' : noLeidas;
    badge.style.display = noLeidas > 0 ? '' : 'none';
  }
  // También actualizar widget del dashboard si está visible
  const dashNotif = document.getElementById('dash-notif-lista');
  if (dashNotif) renderDashNotifWidget();
}

/* ── Render del panel flotante ───────────────────────────── */
function renderNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  const st    = EMPRESA_STATE.notificaciones;
  const esProf = APP.rolActivo !== 'alumno';
  const filtro = st.filtro || 'todas';
  const items  = st.items.filter(n => filtro === 'todas' ? true : filtro === 'nuevas' ? !n.leida : n.tipo === filtro);

  const FILTROS = [
    ['todas','Todas'], ['nuevas','Nuevas'], ['tarea','Tareas'],
    ['correo','Correos'], ['mercado','Mercado'], ['evaluacion','Evaluación'],
    ...(esProf ? [['docente','Docentes']] : []),
    ['sistema','Sistema'],
  ];

  panel.innerHTML = `
  <div class="notif-panel-header">
    <span>Notificaciones${st.noLeidas > 0 ? ` <span style="font-size:.7rem;padding:1px 7px;border-radius:20px;background:var(--verde-600);color:white">${st.noLeidas}</span>` : ''}</span>
    <div style="display:flex;gap:6px">
      ${st.noLeidas > 0 ? `<button onclick="notifLeer('todas')" style="border:none;background:none;cursor:pointer;font-size:.72rem;color:var(--verde-600);font-weight:600">Marcar leídas</button>` : ''}
      ${esProf ? `<button onclick="abrirModalNotifProf()" style="border:none;background:none;cursor:pointer;font-size:.72rem;color:#be185d;font-weight:600">+ Aviso</button>` : ''}
    </div>
  </div>

  <div class="notif-filtros">
    ${FILTROS.map(([v,l]) => `
    <button class="notif-filtro-btn ${filtro===v?'activo':''}"
      onclick="EMPRESA_STATE.notificaciones.filtro='${v}';renderNotifPanel()">
      ${l}${v==='nuevas'&&st.noLeidas>0?` (${st.noLeidas})`:''}
    </button>`).join('')}
  </div>

  <div class="notif-lista">
    ${items.length === 0 ? `
    <div class="notif-vacío">
      <div>🔕</div>
      <p style="font-size:.8rem">${filtro==='nuevas'?'No hay notificaciones nuevas':'Sin notificaciones en esta categoría'}</p>
    </div>` :
    items.map(n => {
      const t = NOTIF_TIPOS[n.tipo] || NOTIF_TIPOS.sistema;
      const ts = _notifTiempoRelativo(n.ts);
      return `
      <div class="notif-item ${n.leida?'':'nueva'}"
        onclick="notifLeer('${n.id}');${n.accion?n.accion+';cerrarPaneles()':''}"
        style="position:relative">
        <div class="notif-icono" style="background:${t.bg};color:${t.color}">${n.icono||t.icono}</div>
        <div class="notif-cuerpo">
          <div class="notif-titulo">${n.titulo}</div>
          ${n.cuerpo ? `<div class="notif-texto">${n.cuerpo}</div>` : ''}
          <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
            <span class="notif-tiempo">${ts}</span>
            <span style="font-size:.65rem;padding:1px 6px;border-radius:20px;background:${t.bg};color:${t.color};font-weight:600">${t.label}</span>
            ${n.autor?`<span style="font-size:.65rem;color:var(--gris-300)">· ${n.autor}</span>`:''}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
          ${!n.leida ? '<div class="notif-punto"></div>' : ''}
          <button onclick="event.stopPropagation();notifEliminar('${n.id}')"
            style="border:none;background:none;cursor:pointer;color:var(--gris-200);font-size:.7rem;padding:0;line-height:1"
            onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color='var(--gris-200)'">✕</button>
        </div>
      </div>`;
    }).join('')}
  </div>

  ${items.length > 0 ? `
  <div class="notif-pie">
    <button class="btn-secundario" style="flex:1;justify-content:center;font-size:.75rem;padding:5px"
      onclick="EMPRESA_STATE.notificaciones.items=[];actualizarBadgeNotif();renderNotifPanel()">
      🗑️ Limpiar todo
    </button>
  </div>` : ''}

  <!-- Modal aviso docente (inline) -->
  ${_modalNotifProf()}`;
}

/* ── Tiempo relativo ─────────────────────────────────────── */
function _notifTiempoRelativo(isoTs) {
  if (!isoTs) return '';
  const diff = Date.now() - new Date(isoTs).getTime();
  const mins  = Math.floor(diff / 60000);
  const horas = Math.floor(diff / 3600000);
  const dias  = Math.floor(diff / 86400000);
  if (mins < 1)    return 'Ahora mismo';
  if (mins < 60)   return `Hace ${mins} min`;
  if (horas < 24)  return `Hace ${horas}h`;
  if (dias === 1)  return 'Ayer';
  return `Hace ${dias} días`;
}

/* ── Modal: aviso del docente ────────────────────────────── */
let _notifModalAbierto = false;
function abrirModalNotifProf() {
  _notifModalAbierto = true;
  renderNotifPanel();
}

function _modalNotifProf() {
  if (!_notifModalAbierto) return '';
  return `
  <div style="position:absolute;inset:0;background:rgba(0,0,0,.4);z-index:10;border-radius:var(--radio-lg);display:flex;align-items:flex-end"
    onclick="if(event.target===this){_notifModalAbierto=false;renderNotifPanel()}">
    <div style="width:100%;background:var(--blanco);border-radius:var(--radio-lg) var(--radio-lg) 0 0;padding:1.25rem" onclick="event.stopPropagation()">
      <div style="font-size:.875rem;font-weight:700;color:var(--gris-900);margin-bottom:10px">📢 Enviar aviso a los grupos</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <input type="text" id="notif-titulo-input" placeholder="Título del aviso (ej: Nueva tarea publicada)"
          style="width:100%;padding:8px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo);outline:none"
          onfocus="this.style.borderColor='#be185d'" onblur="this.style.borderColor='var(--gris-200)'">
        <textarea id="notif-cuerpo-input" placeholder="Descripción breve del aviso..."
          style="width:100%;padding:8px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo);resize:none;height:68px;outline:none;line-height:1.5"
          onfocus="this.style.borderColor='#be185d'" onblur="this.style.borderColor='var(--gris-200)'"></textarea>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${Object.entries(NOTIF_TIPOS).filter(([k])=>['tarea','mercado','evaluacion','sistema','fiscal','rrhh'].includes(k)).map(([k,v])=>`
          <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:.75rem;color:var(--gris-600)">
            <input type="radio" name="notif-tipo-sel" value="${k}" style="accent-color:#be185d"> ${v.icono} ${v.label}
          </label>`).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn-secundario" style="flex:1;justify-content:center;font-size:.78rem"
            onclick="_notifModalAbierto=false;renderNotifPanel()">Cancelar</button>
          <button class="btn-accion" style="flex:2;justify-content:center;font-size:.78rem;background:#be185d"
            onclick="enviarAvisoDocente()">📢 Publicar aviso</button>
        </div>
      </div>
    </div>
  </div>`;
}

function enviarAvisoDocente() {
  const titulo = document.getElementById('notif-titulo-input')?.value?.trim();
  const cuerpo = document.getElementById('notif-cuerpo-input')?.value?.trim();
  const tipoEl = document.querySelector('input[name="notif-tipo-sel"]:checked');
  const tipo   = tipoEl?.value || 'sistema';
  if (!titulo) { mostrarToast('Escribe un título para el aviso','error'); return; }
  notifAñadir(tipo, titulo, cuerpo || '', { autor: 'Docente', icono: NOTIF_TIPOS[tipo]?.icono });
  _notifModalAbierto = false;
  mostrarToast('📢 Aviso publicado para todos los grupos', 'exito');
  renderNotifPanel();
}

/* ── Integraciones: genera notificaciones desde otros módulos */

// Correo recibido
function notifCorreoRecibido(correo) {
  notifAñadir('correo', correo.asunto || 'Nuevo correo', correo.de || '', {
    icono: ({direccion:'🎯',rrhh:'👥',comercial:'🧾',contabilidad:'📊',fiscal:'⚖️'})[correo.departamento] || '📧',
    accion: `irA('mensajeria')`,
    accionLabel: 'Abrir buzón',
  });
}

// Tarea publicada por el docente
function notifTareaPublicada(tarea) {
  notifAñadir('tarea',
    `Nueva tarea: ${tarea.titulo}`,
    `Dpto. ${tarea.departamento || ''} · Semana ${tarea.semana || ''}`,
    { accion: `irA('tareas')`, accionLabel: 'Ver tareas', autor: 'Docente' }
  );
}

// Tarea evaluada
function notifTareaEvaluada(tarea) {
  notifAñadir('evaluacion',
    `Tarea evaluada: ${tarea.titulo}`,
    `Calificación: ${tarea.calificacion}/10`,
    { icono: tarea.calificacion >= 7 ? '🏆' : '📝', accion: `irA('notas')`, accionLabel: 'Ver notas' }
  );
}

// Evento de mercado activado
function notifEventoMercado(evento) {
  notifAñadir('mercado',
    `Evento: ${evento.titulo || 'Nuevo evento de mercado'}`,
    evento.descripcion ? evento.descripcion.slice(0, 80) : '',
    { icono: '⚡', accion: `irA('mercado')`, accionLabel: 'Ver mercado', autor: 'Docente' }
  );
}

// Situación generada por el docente
function notifSituacionGenerada(tipo, dept) {
  const depts = {direccion:'Dirección',rrhh:'RRHH',comercial:'Comercial',contabilidad:'Contabilidad',fiscal:'Fiscal'};
  notifAñadir('correo',
    `Nueva situación: ${tipo}`,
    `Destinatario: ${depts[dept] || dept}`,
    { icono: '📩', accion: `irA('mensajeria')`, accionLabel: 'Ver correo', autor: 'Docente' }
  );
}

// Plazo fiscal próximo (se llama al iniciar la app)
function notifAlertasFiscales() {
  const hoy = new Date();
  const dia  = hoy.getDate();
  const mes  = hoy.getMonth() + 1; // 1-12
  // Alertas de presentación: días 1-20 del mes siguiente al trimestre
  const alertas = [
    { mesAlerta:4,  label:'Modelo 303 — 1T', modulo:'mensajeria' },
    { mesAlerta:7,  label:'Modelo 303 — 2T', modulo:'mensajeria' },
    { mesAlerta:10, label:'Modelo 303 — 3T', modulo:'mensajeria' },
    { mesAlerta:1,  label:'Modelo 303 — 4T + Mod. 390', modulo:'mensajeria' },
    { mesAlerta:4,  label:'Modelo 111 — IRPF retenciones 1T', modulo:'mensajeria' },
    { mesAlerta:7,  label:'Modelo 111 — IRPF retenciones 2T', modulo:'mensajeria' },
    { mesAlerta:10, label:'Modelo 111 — IRPF retenciones 3T', modulo:'mensajeria' },
    { mesAlerta:2,  label:'Modelo 347 — Operaciones con terceros (anual)', modulo:'factusol' },
    { mesAlerta:7,  label:'Modelo 200 — Impuesto sobre Sociedades', modulo:'mensajeria' },
  ];
  alertas.forEach(a => {
    if (a.mesAlerta === mes && dia >= 1 && dia <= 20) {
      // Solo añadir si no existe ya
      const yaExiste = EMPRESA_STATE.notificaciones.items.some(n => n.titulo.includes(a.label));
      if (!yaExiste) {
        notifAñadir('fiscal',
          `⚠️ Plazo: ${a.label}`,
          `Presentación antes del día 20. Quedan ${20 - dia} días.`,
          { icono: '⚖️', accion: `irA('${a.modulo}')`, autor: 'Sistema' }
        );
      }
    }
  });
}

// Autoevaluación pendiente
function notifAutoevaluacionPendiente() {
  const auto = EMPRESA_STATE.evaluacion.auto;
  auto.periodos.forEach(p => {
    if (!p.completado) {
      const yaExiste = EMPRESA_STATE.notificaciones.items.some(n => n.titulo.includes(p.label) && n.tipo === 'evaluacion');
      if (!yaExiste) {
        notifAñadir('evaluacion',
          `Autoevaluación pendiente: ${p.label}`,
          'Completa y envía tu autoevaluación antes del cierre del trimestre.',
          { accion: `irA('autoevaluacion')`, autor: 'Sistema' }
        );
      }
    }
  });
}

/* ── Panel del dashboard ─────────────────────────────────── */
function renderDashNotifWidget() {
  const el = document.getElementById('dash-notif-lista');
  if (!el) return;
  const items = EMPRESA_STATE.notificaciones.items.slice(0, 5);
  if (items.length === 0) {
    el.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--gris-400)"><div style="font-size:1.8rem;margin-bottom:6px">🔕</div><p style="font-size:.82rem">Sin actividad reciente</p></div>`;
    return;
  }
  el.innerHTML = items.map(n => {
    const t  = NOTIF_TIPOS[n.tipo] || NOTIF_TIPOS.sistema;
    const ts = _notifTiempoRelativo(n.ts);
    return `
    <div class="actividad-item" style="cursor:pointer;background:${n.leida?'':'var(--verde-50)'};border-radius:var(--radio-sm);padding:8px 10px;margin-bottom:2px"
      onclick="notifLeer('${n.id}');${n.accion?n.accion:''}">
      <div class="actividad-avatar" style="background:${t.bg};color:${t.color};font-size:.82rem">${n.icono||t.icono}</div>
      <div class="actividad-texto">
        <strong style="font-size:.8rem;color:var(--gris-800)">${n.titulo}</strong>
        ${n.cuerpo?`<p style="font-size:.72rem;color:var(--gris-500);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n.cuerpo}</p>`:''}
      </div>
      <div class="actividad-tiempo" style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
        <span style="font-size:.68rem">${ts}</span>
        ${!n.leida?'<span style="width:7px;height:7px;border-radius:50%;background:var(--verde-500);display:block"></span>':''}
      </div>
    </div>`;
  }).join('');
}

/* ── Toggle del panel ────────────────────────────────────── */
function toggleNotif() {
  const panel = document.getElementById('notif-panel');
  document.getElementById('user-menu').classList.remove('visible');
  const abriendo = !panel.classList.contains('visible');
  panel.classList.toggle('visible');
  if (abriendo) renderNotifPanel();
}
function toggleUserMenu() {
  document.getElementById('user-menu').classList.toggle('visible');
  document.getElementById('notif-panel').classList.remove('visible');
}
function cerrarPaneles() {
  document.getElementById('notif-panel').classList.remove('visible');
  document.getElementById('user-menu').classList.remove('visible');
}
document.addEventListener('click', e => {
  if (!e.target.closest('#notif-panel') && !e.target.closest('.topbar-notif')) {
    document.getElementById('notif-panel').classList.remove('visible');
  }
  if (!e.target.closest('#user-menu') && !e.target.closest('.topbar-avatar')) {
    document.getElementById('user-menu').classList.remove('visible');
  }
});

function mostrarToast(msg, tipo='') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${tipo}`;
  t.innerHTML = `<span>${tipo==='exito'?'✓':tipo==='error'?'✗':'ℹ'}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ============================================================
   SISTEMA DE AYUDA CONTEXTUAL — CAPA 1
   Principio: el contenido se adapta al módulo activo y, donde
   es posible, usa los datos reales de la empresa del alumno.
   ============================================================ */

/* ── Estado del panel ── */
let _ayudaAbierta = false;
let _ayudaModuloActual = null;
let _ayudaTabActual = 0;

/* ── Abrir / cerrar ── */
function abrirAyuda(moduloId) {
  const panel = document.getElementById('ayuda-panel');
  const contenido = AYUDA_CONTENIDO[moduloId] || AYUDA_CONTENIDO['default'];
  _ayudaModuloActual = moduloId;
  _ayudaTabActual = 0;

  // Header
  document.getElementById('ayuda-icono').textContent  = contenido.icono || '💡';
  document.getElementById('ayuda-titulo').textContent  = contenido.titulo;
  document.getElementById('ayuda-modulo').textContent  = contenido.modulo;

  // Tabs
  const tabsEl = document.getElementById('ayuda-tabs');
  tabsEl.innerHTML = contenido.tabs.map((t,i) =>
    `<button class="ayuda-tab ${i===0?'activo':''}"
      onclick="ayudaTab(${i})">${t.label}</button>`
  ).join('');

  // Body
  ayudaRenderTab(0, contenido);

  panel.classList.add('visible');
  _ayudaAbierta = true;

  // Mark the trigger button as active
  document.querySelectorAll('.btn-ayuda-ctx').forEach(b => b.classList.remove('activo'));
  const btn = document.querySelector(`[data-ayuda="${moduloId}"]`);
  if (btn) btn.classList.add('activo');
}

function cerrarAyuda() {
  document.getElementById('ayuda-panel').classList.remove('visible');
  _ayudaAbierta = false;
  document.querySelectorAll('.btn-ayuda-ctx').forEach(b => b.classList.remove('activo'));
}

function ayudaTab(idx) {
  _ayudaTabActual = idx;
  const contenido = AYUDA_CONTENIDO[_ayudaModuloActual] || AYUDA_CONTENIDO['default'];
  document.querySelectorAll('.ayuda-tab').forEach((t,i) =>
    t.classList.toggle('activo', i===idx));
  ayudaRenderTab(idx, contenido);
}

function ayudaRenderTab(idx, contenido) {
  const tab = contenido.tabs[idx];
  if (!tab) return;
  const body = document.getElementById('ayuda-body');
  // Resolve dynamic content (functions get empresa data)
  const html = typeof tab.html === 'function' ? tab.html() : tab.html;
  body.innerHTML = html;
  body.scrollTop = 0;
}

/* Cierra al hacer clic fuera del panel */
document.addEventListener('click', e => {
  if (_ayudaAbierta
    && !e.target.closest('#ayuda-panel')
    && !e.target.closest('.btn-ayuda-ctx')) {
    cerrarAyuda();
  }
});

/* Toggle: si el mismo botón se pulsa dos veces, cierra */
function toggleAyuda(moduloId) {
  if (_ayudaAbierta && _ayudaModuloActual === moduloId) {
    cerrarAyuda();
  } else {
    abrirAyuda(moduloId);
  }
}

/* ── Helpers de render ── */
function ayudaConcepto(titulo, ra, def, ejemplo, extras='') {
  return `<div class="ayuda-concepto">
    <div class="ayuda-concepto-titulo">
      ${titulo}
      ${ra ? `<span class="ra-mini">${ra}</span>` : ''}
    </div>
    <div class="ayuda-def">${def}</div>
    ${ejemplo ? `<div class="ayuda-ejemplo"><div class="ej-label">Ejemplo</div>${ejemplo}</div>` : ''}
    ${extras}
  </div>`;
}
function ayudaFormula(txt) {
  return `<div class="ayuda-formula">${txt}</div>`;
}
function ayudaAlerta(txt) {
  return `<div class="ayuda-alerta">⚠️ ${txt}</div>`;
}
function ayudaAccion(txt, onclick) {
  return `<button class="ayuda-accion" onclick="${onclick}">↗ ${txt}</button>`;
}

/* ── Datos contextuales de la empresa ── */
function _emp() {
  const d   = EMPRESA_STATE.datos;
  const pe  = EMPRESA_STATE.planEmpresa;
  const ap7 = pe.ap7 || {};
  const nombre = d.nombre || 'vuestra empresa';
  const sector = d.sector || 'vuestro sector';
  const capital = typeof capitalTotalSocios === 'function' ? capitalTotalSocios() : 0;
  const totalInv = typeof ap7_totalInversion === 'function' ? ap7_totalInversion() : 0;
  const fa  = typeof ap7_deudaTotal === 'function' ? ap7_deudaTotal() : 0;
  const fp  = typeof ap7_fondosPropios === 'function' ? ap7_fondosPropios() : 0;
  const ratioEnd = fa>0&&fp>0 ? (fa/fp).toFixed(2) : null;
  const ventas1  = typeof ap7_ventasAnuales === 'function' ? ap7_ventasAnuales(1) : 0;
  const umbral   = typeof ap7_umbral === 'function' ? ap7_umbral() : 0;
  const tir      = typeof ap7_TIR === 'function' ? ap7_TIR() : 0;
  const gastosFijos = typeof ap7_gastosFijosMes === 'function' ? ap7_gastosFijosMes() : 0;
  const empleados = EMPRESA_STATE.rrhh?.empleados || [];
  const tramites  = EMPRESA_STATE.tramites || [];
  const tramComp  = tramites.filter(t=>t.estado==='completado').length;
  const conv      = EMPRESA_STATE.rrhh?.convenio || {};
  return { nombre, sector, capital, totalInv, fa, fp, ratioEnd, ventas1, umbral, tir, gastosFijos, empleados, tramComp, tramites, conv };
}

/* ════════════════════════════════════════════════════════════
   CONTENIDO DE AYUDA POR MÓDULO
   ════════════════════════════════════════════════════════════ */
