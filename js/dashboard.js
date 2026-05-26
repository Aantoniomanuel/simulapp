function vistaDashboard() {
  const nombre = ((APP.usuario && APP.usuario.displayName) || 'Alumno/a').split(' ')[0];
  const esProf = APP.rolActivo !== 'alumno';
  return `
  <div class="seccion-header">
    <div>
      <h2>Hola, ${nombre} 👋</h2>
      <p>${esProf ? 'Panel de coordinación docente — SimulApp 2025-26' : 'Resumen de tu empresa y actividad del día'}</p>
    </div>
  </div>

  ${esProf ? dashboardProfesor() : dashboardAlumno()}
  `;
}

function dashboardAlumno() {
  const s  = EMPRESA_STATE;
  const ms = s.mensajeria;
  const ge = s.gestion;
  const me = s.mercado;
  const pe = s.planEmpresa;

  // Datos reales
  const noLeidos    = ms.correos.filter(c => !c.leido).length;
  const txActivas   = me.transacciones.filter(t => t.estado !== 'completada' && t.estado !== 'pedido-rechazado').length;
  const txTotal     = me.transacciones.length;
  const volumen     = me.transacciones.filter(t => t.estado === 'completada').reduce((s,t) => s+(t.total||0), 0);
  const tareasHoy   = ge.tareas.filter(t => t.semana === ge.semanaActual);
  const tareasEntregadas = ge.tareas.filter(t => t.estado === 'entregada' || t.estado === 'evaluada').length;
  const progPlan    = typeof calcProgresoPlan === 'function' ? calcProgresoPlan() : 0;
  const deptActual  = ge.asignaciones ? Object.entries(ge.asignaciones).find(([k,v]) => v.alumno) : null;
  const eventosActivos = me.eventos.filter(e => e.activo).length;

  // Determinar trimestre y semana
  const sem = ge.semanaActual || 1;
  const trim = ge.trimestreActual || 1;

  return `
  <!-- KPIs reales -->
  <div class="metricas-grid">
    <div class="metrica-card" onclick="irA('mensajeria')" style="cursor:pointer">
      <div class="metrica-header">
        <div class="metrica-icono verde">📧</div>
        ${noLeidos > 0 ? `<span class="metrica-tendencia negativa">${noLeidos} sin leer</span>` : '<span class="metrica-tendencia positiva">Al día</span>'}
      </div>
      <div class="metrica-valor">${ms.correos.length}</div>
      <div class="metrica-etiq">Correos recibidos</div>
    </div>
    <div class="metrica-card" onclick="irA('mercado')" style="cursor:pointer">
      <div class="metrica-header">
        <div class="metrica-icono azul">🔄</div>
        ${txActivas > 0 ? `<span class="metrica-tendencia negativa">${txActivas} activas</span>` : ''}
      </div>
      <div class="metrica-valor">${txTotal}</div>
      <div class="metrica-etiq">Transacciones de mercado</div>
    </div>
    <div class="metrica-card" onclick="irA('tareas')" style="cursor:pointer">
      <div class="metrica-header">
        <div class="metrica-icono nar">📋</div>
        <span class="metrica-tendencia ${tareasHoy.length > 0 ? 'negativa' : 'positiva'}">${tareasHoy.length > 0 ? tareasHoy.length + ' esta semana' : 'Sin tareas'}</span>
      </div>
      <div class="metrica-valor">${tareasEntregadas}</div>
      <div class="metrica-etiq">Tareas entregadas</div>
    </div>
    <div class="metrica-card" onclick="irA('plan-empresa')" style="cursor:pointer">
      <div class="metrica-header">
        <div class="metrica-icono verde">📄</div>
        <span class="metrica-tendencia ${progPlan === 100 ? 'positiva' : 'negativa'}">${progPlan === 100 ? 'Completo ✓' : progPlan + '% completado'}</span>
      </div>
      <div class="metrica-valor">${progPlan}%</div>
      <div class="metrica-etiq">Plan de empresa</div>
    </div>
  </div>

  <!-- Timeline del curso -->
  <div class="timeline-curso">
    <div class="timeline-titulo">📅 Hoja de ruta · Semana ${sem} · Trimestre ${trim}</div>
    <div class="timeline-steps">
      ${[
        ['💡','Innov. RA1','1'],
        ['🎯','Idea RA2','2'],
        ['🏢','Constitución RA3-5','3'],
        ['T1','Simulación T1','4'],
        ['📊','Cierre T1','5'],
        ['T2','Simulación T2','6'],
        ['🎤','Defensa 3160','7'],
      ].map(([ico, lbl, n], i) => {
        const done = sem > (i+1)*3;
        const current = !done && sem <= (i+2)*3;
        return `<div class="timeline-step ${done?'completado':current?'activo':''}">
          <div class="step-dot">${done?'✓':ico}</div>
          <div class="step-label">${lbl}</div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <div class="grid-2col">
    <!-- Semana actual — tareas del alumno (widget expandido) -->
    <div>
      ${(() => {
        const asig = ge.asignaciones || {};
        const depts = Object.entries(asig);
        const miDept = depts.find(([k,v]) => v.alumno && v.alumno.trim()) || null;
        const DEPTS_NOMBRES = {direccion:'Dirección',rrhh:'RRHH',comercial:'Comercial',contabilidad:'Contabilidad y Finanzas',fiscal:'Fiscal y Legal'};
        const DEPTS_ICONOS  = {direccion:'🎯',rrhh:'👥',comercial:'🧾',contabilidad:'📊',fiscal:'⚖️'};
        const ESTADOS_COLOR = {pendiente:'var(--gris-300)','en-curso':'#f59e0b',entregada:'#3b82f6',evaluada:'var(--verde-500)'};
        const ESTADOS_LABEL = {pendiente:'Pendiente','en-curso':'En curso',entregada:'Entregada',evaluada:'Evaluada'};

        if (!miDept) return `
          <div class="card" style="text-align:center;padding:2rem;color:var(--gris-400)">
            <div style="font-size:2rem;margin-bottom:8px">⚙️</div>
            <p>Tu profesor aún no ha asignado departamentos.</p>
            <p style="font-size:.78rem;margin-top:4px">Cuando lo haga, verás aquí tus tareas semanales.</p>
          </div>`;

        const [dKey, dVal] = miDept;
        const todasTareas  = ge.tareas.filter(t => t.departamento === dKey);
        const tareasSem    = todasTareas.filter(t => t.semana === sem);
        const pendientes   = todasTareas.filter(t => t.estado === 'pendiente' || t.estado === 'en-curso').length;
        const completadas  = todasTareas.filter(t => t.estado === 'entregada' || t.estado === 'evaluada').length;
        const pctDept      = todasTareas.length ? Math.round(completadas / todasTareas.length * 100) : 0;

        return `
        <div class="card" style="overflow:visible">
          <div class="card-header" style="gap:8px">
            <div class="card-titulo">
              <span style="font-size:1rem">${DEPTS_ICONOS[dKey]||'⚙️'}</span>
              ${DEPTS_NOMBRES[dKey]||dKey}
              <span class="ra-chip" style="margin-left:2px">T${dVal.trimestre||1}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-left:auto">
              <!-- Navegador de semana -->
              <button onclick="EMPRESA_STATE.gestion.semanaActual=Math.max(1,EMPRESA_STATE.gestion.semanaActual-1);renderVista('dashboard')"
                style="width:24px;height:24px;border:1px solid var(--gris-200);border-radius:6px;background:var(--blanco);cursor:pointer;font-size:.8rem;display:flex;align-items:center;justify-content:center">‹</button>
              <span style="font-size:.75rem;font-weight:700;color:var(--gris-700);white-space:nowrap">S${sem}</span>
              <button onclick="EMPRESA_STATE.gestion.semanaActual=Math.min(25,EMPRESA_STATE.gestion.semanaActual+1);renderVista('dashboard')"
                style="width:24px;height:24px;border:1px solid var(--gris-200);border-radius:6px;background:var(--blanco);cursor:pointer;font-size:.8rem;display:flex;align-items:center;justify-content:center">›</button>
            </div>
          </div>

          <div class="card-body" style="padding:.75rem 1rem">
            <!-- Barra de progreso del departamento -->
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:.85rem">
              <div style="flex:1;height:5px;background:var(--gris-100);border-radius:3px;overflow:hidden">
                <div style="width:${pctDept}%;height:100%;background:var(--verde-500);border-radius:3px;transition:width .5s"></div>
              </div>
              <span style="font-size:.7rem;color:var(--gris-500);white-space:nowrap">${completadas}/${todasTareas.length} tareas · ${pctDept}%</span>
            </div>

            <!-- Tareas de esta semana -->
            ${tareasSem.length === 0
              ? `<div style="text-align:center;padding:.75rem 0;color:var(--gris-400);font-size:.8rem">
                  Sin tareas publicadas para la semana ${sem}
                 </div>`
              : `<div style="display:flex;flex-direction:column;gap:6px">
                  ${tareasSem.map(t => `
                  <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:var(--radio-md);
                    background:${t.estado==='evaluada'?'var(--verde-50)':t.estado==='entregada'?'#eff6ff':'var(--gris-50)'};
                    border:1px solid ${t.estado==='evaluada'?'var(--verde-200)':t.estado==='entregada'?'#bfdbfe':'var(--gris-100)'}">
                    <div style="width:8px;height:8px;border-radius:50%;background:${ESTADOS_COLOR[t.estado]||ESTADOS_COLOR.pendiente};flex-shrink:0;margin-top:4px"></div>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:.82rem;font-weight:600;color:var(--gris-800);line-height:1.3">${t.titulo}</div>
                      <div style="display:flex;align-items:center;gap:5px;margin-top:3px;flex-wrap:wrap">
                        <span class="ra-chip" style="font-size:.62rem">${t.ce||t.ra||'RA6'}</span>
                        <span style="font-size:.68rem;color:${ESTADOS_COLOR[t.estado]||'var(--gris-400)'};font-weight:600">${ESTADOS_LABEL[t.estado]||t.estado}</span>
                        ${t.nota!=null?`<span style="font-size:.68rem;font-weight:700;color:${t.nota>=5?'var(--verde-700)':'#dc2626'}">· ${t.nota}/10</span>`:''}
                      </div>
                    </div>
                  </div>`).join('')}
                </div>`
            }

            <!-- Tareas pendientes de otras semanas (alerta) -->
            ${pendientes > 0 ? `
            <div style="margin-top:.65rem;padding:6px 10px;background:#fef3c7;border:1px solid #fde68a;border-radius:var(--radio-sm);font-size:.75rem;color:#92400e;display:flex;align-items:center;gap:6px">
              ⚠️ Tienes <strong>${pendientes}</strong> tarea${pendientes>1?'s':''} pendiente${pendientes>1?'s':''} en tu departamento
            </div>` : ''}

            <button class="btn-secundario" style="width:100%;margin-top:.75rem;font-size:.78rem;padding:6px 10px;justify-content:center"
              onclick="irA('tareas')">Ver todas las tareas →</button>
          </div>
        </div>`;
      })()}
    </div>

    <!-- Notificaciones recientes -->
    <div class="card">
      <div class="card-header">
        <div class="card-titulo">🔔 Notificaciones recientes</div>
        <button class="btn-secundario" style="padding:5px 10px;font-size:.75rem" onclick="toggleNotif()">Ver todas</button>
      </div>
      <div class="card-body" style="padding:.5rem .75rem" id="dash-notif-lista">
        <!-- renderDashNotifWidget() lo rellena -->
      </div>
    </div>
  </div>

  <!-- Accesos rápidos -->
  <div class="grid-3col">
    <div class="mercado-card" onclick="irA('mercado')">
      <div class="mercado-pulso"></div>
      <div class="mercado-titulo">Mercado intergrupal</div>
      <div class="mercado-valor">${txActivas > 0 ? txActivas + ' activas' : txTotal + ' total'}</div>
      <div class="mercado-desc">${txActivas > 0 ? 'Tienes transacciones pendientes de gestionar' : volumen > 0 ? 'Volumen: ' + volumen.toLocaleString('es-ES') + ' €' : 'Sin transacciones aún — empieza solicitando un presupuesto'}</div>
    </div>
    <div class="card" style="cursor:pointer" onclick="irA('plan-empresa')">
      <div class="card-header">
        <div class="card-titulo">📋 Plan de empresa</div>
        <span class="estado ${progPlan===100?'activo':'pendiente'}">${progPlan===100?'Completo':'En progreso'}</span>
      </div>
      <div class="card-body">
        <div style="font-size:.8rem;color:var(--gris-600);margin-bottom:8px">Completado al <strong style="color:var(--verde-700)">${progPlan}%</strong></div>
        <div class="progreso-bar">
          <div class="progreso-fill" style="width:${progPlan}%"></div>
        </div>
        ${progPlan < 100 ? `<div style="font-size:.75rem;color:var(--gris-400);margin-top:6px">Continúa rellenando los apartados pendientes</div>` : `<div style="font-size:.75rem;color:var(--verde-600);margin-top:6px">✓ Plan completo — listo para exportar</div>`}
      </div>
    </div>
    <div class="card" onclick="irA('emprendimiento')" style="cursor:pointer">
      <div class="card-header">
        <div class="card-titulo">💡 Emprendimiento</div>
      </div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:6px">
        ${[
          ['Fase 1 — Ideación','emprendimiento'],
          ['Plan de empresa','plan-empresa'],
          ['Tareas del grupo','tareas'],
        ].map(([lbl, dest]) => `
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:.8rem;padding:4px 0;border-bottom:1px solid var(--gris-100);cursor:pointer" onclick="event.stopPropagation();irA('${dest}')">
            <span style="color:var(--gris-600)">${lbl}</span>
            <span style="color:var(--verde-600)">→</span>
          </div>`).join('')}
      </div>
    </div>
  </div>
  `;
}


function rankingIntergrupal() {
  const datos = window.RANKING_DATOS || [];
  if (datos.length === 0) {
    return `<div style="font-size:.8rem;color:var(--gris-400);padding:8px 0;text-align:center">
      ${MODO_DEMO ? '📡 Datos de ejemplo — activa Firebase para el ranking real' : '⏳ Cargando datos del ranking…'}
    </div>`;
  }
  const maxScore = Math.max(...datos.map(g => g.score), 1);
  const medallas = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'];
  const esPropio = g => g.id === (APP.perfil?.grupoId || 'G1');

  return datos.slice(0,8).map((g, i) => {
    const pct   = Math.round((g.score / maxScore) * 100);
    const propio = esPropio(g);
    const colBar = i===0 ? 'var(--verde-500)' : i===1 ? 'var(--verde-400)' : i===2 ? 'var(--verde-300)' : 'var(--gris-300)';
    return `
    <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--gris-100);
      ${propio ? 'background:var(--verde-50);border-radius:var(--radio-sm);padding:7px 8px;margin:0 -8px;' : ''}">
      <span style="font-size:1rem;width:24px;text-align:center">${medallas[i]||String(i+1)}</span>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
          <span style="font-size:.8rem;font-weight:${propio?'700':'600'};color:${propio?'var(--verde-800)':'var(--gris-800)'};
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px">${g.nombre}</span>
          ${propio ? '<span style="font-size:.65rem;background:var(--verde-600);color:white;border-radius:10px;padding:1px 6px">tú</span>' : ''}
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="flex:1;background:var(--gris-100);border-radius:3px;height:5px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${colBar};border-radius:3px;transition:width .6s"></div>
          </div>
          <span style="font-size:.7rem;font-weight:700;color:var(--gris-600);min-width:36px;text-align:right">${g.score} pts</span>
        </div>
        <div style="display:flex;gap:8px;margin-top:3px;font-size:.67rem;color:var(--gris-400)">
          <span>🔄 ${g.tx} tx</span>
          <span>💶 ${(g.facturado||0).toLocaleString('es-ES')} €</span>
          <span>✅ ${g.tareasEv} tareas</span>
          ${g.planPct > 0 ? `<span>📋 ${g.planPct}% plan</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('') + `
  <div style="margin-top:8px;padding:6px 8px;background:var(--gris-50);border-radius:6px;font-size:.68rem;color:var(--gris-400);line-height:1.6">
    Puntos: tx×10 · facturación÷100 · tareas evaluadas×8 · plan de empresa×5
    ${MODO_DEMO ? ' · <em>Modo demo — mismos datos para todos los grupos</em>' : ' · Actualización en tiempo real'}
  </div>`;
}


function dashboardProfesor() {
  const tx    = EMPRESA_STATE.mercado.transacciones || [];
  const cor   = EMPRESA_STATE.mensajeria.correos || [];
  const tareas = EMPRESA_STATE.gestion.tareas || [];
  const sem   = EMPRESA_STATE.gestion.semanaActual || 1;
  const trim  = EMPRESA_STATE.gestion.trimestreActual || 1;
  const eventos = EMPRESA_STATE.mercado.eventos || [];

  const txTotal     = tx.length;
  const txActivas   = tx.filter(t => t.estado !== 'completada' && t.estado !== 'pedido-rechazado').length;
  const pendResp    = cor.filter(c => c.hilo && c.hilo.length === 0 && !c.leido).length;
  const tareasEval  = tareas.filter(t => t.estado === 'evaluada').length;
  const tareasEntregadas = tareas.filter(t => t.estado === 'entregada').length;

  return `
  <!-- KPIs reales -->
  <div class="metricas-grid">
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">🔄</div></div>
      <div class="metrica-valor">${txTotal}</div>
      <div class="metrica-etiq">Transacciones en el mercado${txActivas > 0 ? ' · ' + txActivas + ' activas' : ''}</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono azul">📧</div>
        ${pendResp > 0 ? `<span class="metrica-tendencia negativa">${pendResp} sin respuesta</span>` : ''}
      </div>
      <div class="metrica-valor">${cor.length}</div>
      <div class="metrica-etiq">Correos en buzón</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono nar">📋</div>
        ${tareasEntregadas > 0 ? `<span class="metrica-tendencia negativa">${tareasEntregadas} por evaluar</span>` : ''}
      </div>
      <div class="metrica-valor">${tareasEval}</div>
      <div class="metrica-etiq">Tareas evaluadas</div>
    </div>
    <div class="metrica-card" onclick="irA('tareas')" style="cursor:pointer">
      <div class="metrica-header"><div class="metrica-icono verde">📋</div>
        ${tareasEntregadas > 0 ? `<span class="metrica-tendencia negativa">${tareasEntregadas} por evaluar</span>` : ''}
      </div>
      <div class="metrica-valor">${tareas.filter(t=>t.estado==='evaluada').length}</div>
      <div class="metrica-etiq">Tareas evaluadas · Sem. ${sem} T${trim}</div>
    </div>
  </div>

  <!-- Ranking intergrupal -->
  <div class="card" style="margin-bottom:1rem">
    <div class="card-header">
      <div class="card-titulo">🏆 Ranking intergrupal</div>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="font-size:.75rem;color:var(--gris-400)">Basado en actividad real</span>
        <button class="btn-secundario" style="padding:4px 10px;font-size:.75rem" onclick="irA('ranking')">Ver completo →</button>
      </div>
    </div>
    <div class="card-body">
      ${rankingIntergrupal()}
    </div>
  </div>

  <!-- Tareas pendientes de evaluar -->
  ${tareasEntregadas > 0 ? `
  <div class="card" style="margin-top:1rem">
    <div class="card-header">
      <div class="card-titulo">📋 Tareas entregadas pendientes de evaluar</div>
      <button class="btn-secundario" style="padding:5px 10px;font-size:.75rem" onclick="irA('tareas')">Ver tareas →</button>
    </div>
    <div class="card-body">
      ${tareas.filter(t=>t.estado==='entregada').slice(0,5).map(t => `
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--gris-100);font-size:.82rem">
        <span style="font-size:.9rem">${{direccion:'🎯',rrhh:'👥',comercial:'🧾',contabilidad:'📊',fiscal:'⚖️'}[t.departamento]||'📋'}</span>
        <span style="flex:1;color:var(--gris-800)">${t.titulo}</span>
        <span class="ra-chip">${t.ce||'RA6'}</span>
        <button class="btn-accion" style="padding:3px 8px;font-size:.72rem" onclick="irA('tareas')">Evaluar</button>
      </div>`).join('')}
    </div>
  </div>` : ''}
  `;
}

/* ============================================================
   ESTADO DEL MÓDULO EMPRESA
   ============================================================ */
