function vistaTareas() {
  const t   = EMPRESA_STATE.tareas;
  const tab = t.tabActiva;

  // Actualizar badge de pendientes
  const pendientes = t.checklist.secciones.reduce((s,sec)=>s+sec.items.filter(i=>!i.hecho).length,0);
  const badge = document.getElementById('badge-tareas-grupo');
  if (badge) badge.textContent = pendientes > 0 ? pendientes : '0';

  return `
  <div class="seccion-header">
    <div>
      <h2>✅ Tareas del grupo</h2>
      <p>Agenda, checklist y diagrama de Gantt para la gestión del proyecto empresarial</p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-ayuda-ctx" data-ayuda="tareas" onclick="toggleAyuda('tareas')" title="Conceptos y ayuda">❓ Ayuda</button>
    </div>
  </div>

  <!-- Tabs principales -->
  <div style="display:flex;gap:4px;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:6px;margin-bottom:1.25rem">
    ${[
      ['agenda',    '📅','Agenda',         ''],
      ['checklist', '☑️','Check list',      pendientes > 0 ? pendientes+' pendientes' : ''],
      ['gantt',     '📊','Diagrama de Gantt',''],
    ].map(([id,ico,lbl,badge])=>`
    <button onclick="EMPRESA_STATE.tareas.tabActiva='${id}';renderVista('tareas')"
      style="flex:1;padding:9px 14px;border:none;border-radius:var(--radio-md);font-size:.875rem;
      font-weight:${tab===id?'700':'500'};cursor:pointer;
      background:${tab===id?'var(--verde-600)':'transparent'};
      color:${tab===id?'white':'var(--gris-500)'};transition:all .2s;
      display:flex;align-items:center;justify-content:center;gap:6px">
      ${ico} ${lbl}
      ${badge?`<span style="background:${tab===id?'rgba(255,255,255,.3)':'#fee2e2'};color:${tab===id?'white':'#dc2626'};font-size:.7rem;font-weight:700;padding:2px 7px;border-radius:20px">${badge}</span>`:''}
    </button>`).join('')}
  </div>

  ${tab==='agenda'    ? tabAgenda()    :
    tab==='checklist' ? tabChecklist() :
    tabGantt()}
  `;
}

/* ══════════════════════════════════════════════════════
   TAB 1 — AGENDA / CALENDARIO
   ══════════════════════════════════════════════════════ */
function tabAgenda() {
  const ag   = EMPRESA_STATE.tareas.agenda;
  const vista = ag.vista;
  const hoy  = ag.fechaActual || new Date().toISOString().slice(0,10);
  const [yy,mm,dd] = hoy.split('-').map(Number);

  const TIPOS = {
    tarea:   { label:'Tarea',    color:'#134a28', bg:'#edfaf3' },
    reunion: { label:'Reunión',  color:'#1e40af', bg:'#eff6ff' },
    entrega: { label:'Entrega',  color:'#dc2626', bg:'#fee2e2' },
    tramite: { label:'Trámite',  color:'#9333ea', bg:'#faf5ff' },
    fiscal:  { label:'Fiscal',   color:'#92400e', bg:'#fef9ec' },
  };

  function eventosDelDia(fecha) {
    return ag.eventos.filter(e => e.fecha === fecha);
  }

  function navFecha(delta, unidad) {
    const d = new Date(hoy);
    if (unidad === 'mes') d.setMonth(d.getMonth() + delta);
    else if (unidad === 'semana') d.setDate(d.getDate() + delta*7);
    else d.setDate(d.getDate() + delta);
    EMPRESA_STATE.tareas.agenda.fechaActual = d.toISOString().slice(0,10);
    renderVista('tareas');
  }

  const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const MESES_LABEL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  // ── Vista mensual ──
  function vistaCalendarioMes() {
    const primerDia = new Date(yy, mm-1, 1);
    const diasMes   = new Date(yy, mm, 0).getDate();
    const diaInicio = (primerDia.getDay() + 6) % 7; // 0=Lun
    const hoyStr    = new Date().toISOString().slice(0,10);
    let celdas = [];
    for(let i=0;i<diaInicio;i++) celdas.push(null);
    for(let d=1;d<=diasMes;d++) celdas.push(d);

    return `
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--gris-200);border-radius:var(--radio-md);overflow:hidden">
      ${DIAS_SEMANA.map(d=>`
      <div style="padding:6px;background:var(--verde-600);text-align:center;font-size:.72rem;font-weight:700;color:white">${d}</div>`).join('')}
      ${celdas.map(d=>{
        if(!d) return `<div style="padding:6px;background:var(--blanco);min-height:72px"></div>`;
        const fechaStr = `${yy}-${String(mm).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const evs = eventosDelDia(fechaStr);
        const esHoy = fechaStr === hoyStr;
        return `
        <div style="padding:5px;background:${esHoy?'var(--verde-50)':'var(--blanco)'};min-height:72px;cursor:pointer;transition:background .15s"
          onmouseover="this.style.background='var(--verde-50)'" onmouseout="this.style.background='${esHoy?'var(--verde-50)':'var(--blanco)'}'"
          onclick="abrirModalEvento(null,'${fechaStr}')">
          <div style="font-size:.8rem;font-weight:${esHoy?'800':'500'};color:${esHoy?'var(--verde-700)':'var(--gris-700)'};
            ${esHoy?'width:22px;height:22px;background:var(--verde-500);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;':''}">
            ${d}
          </div>
          <div style="display:flex;flex-direction:column;gap:2px;margin-top:3px">
            ${evs.slice(0,2).map(e=>`
            <div style="font-size:.65rem;padding:1px 5px;border-radius:3px;background:${(TIPOS[e.tipo]||TIPOS.tarea).bg};
              color:${(TIPOS[e.tipo]||TIPOS.tarea).color};font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
              cursor:pointer" onclick="event.stopPropagation();abrirModalEvento('${e.id}')">
              ${e.titulo}
            </div>`).join('')}
            ${evs.length>2?`<div style="font-size:.62rem;color:var(--gris-400);padding-left:5px">+${evs.length-2} más</div>`:''}
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }

  // ── Vista semanal ──
  function vistaCalendarioSemana() {
    const lunes = new Date(hoy);
    lunes.setDate(lunes.getDate() - ((lunes.getDay()+6)%7));
    const dias = Array.from({length:7},(_,i)=>{ const d=new Date(lunes); d.setDate(d.getDate()+i); return d; });
    const hoyStr = new Date().toISOString().slice(0,10);
    return `
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">
      ${dias.map(d=>{
        const fechaStr = d.toISOString().slice(0,10);
        const evs = eventosDelDia(fechaStr);
        const esHoy = fechaStr === hoyStr;
        return `
        <div style="border:1px solid ${esHoy?'var(--verde-400)':'var(--gris-200)'};border-radius:var(--radio-md);overflow:hidden;background:${esHoy?'var(--verde-50)':'var(--blanco)'}">
          <div style="padding:7px 10px;text-align:center;background:${esHoy?'var(--verde-600)':'var(--gris-50)'};border-bottom:1px solid var(--gris-200)">
            <div style="font-size:.7rem;color:${esHoy?'rgba(255,255,255,.8)':'var(--gris-400)'};">${DIAS_SEMANA[(d.getDay()+6)%7]}</div>
            <div style="font-size:1.1rem;font-weight:800;color:${esHoy?'white':'var(--gris-800)'}">${d.getDate()}</div>
          </div>
          <div style="padding:6px;min-height:120px;display:flex;flex-direction:column;gap:3px">
            ${evs.map(e=>`
            <div style="font-size:.72rem;padding:4px 6px;border-radius:4px;border-left:3px solid ${e.color||'var(--verde-500)'};
              background:${(TIPOS[e.tipo]||TIPOS.tarea).bg};color:${(TIPOS[e.tipo]||TIPOS.tarea).color};
              cursor:pointer;line-height:1.3" onclick="abrirModalEvento('${e.id}')">
              <div style="font-weight:600">${e.titulo}</div>
              ${e.horaInicio?`<div style="opacity:.75">${e.horaInicio}</div>`:''}
            </div>`).join('')}
            <button onclick="abrirModalEvento(null,'${fechaStr}')"
              style="margin-top:auto;border:1px dashed var(--gris-300);background:none;border-radius:4px;
              font-size:.7rem;color:var(--gris-400);padding:3px;cursor:pointer;width:100%">+ Añadir</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }

  // ── Vista diaria ──
  function vistaCalendarioDia() {
    const evs = eventosDelDia(hoy);
    const horas = Array.from({length:12},(_,i)=>i+8); // 8h–19h
    return `
    <div style="display:flex;flex-direction:column;gap:2px">
      <div style="display:flex;align-items:center;justify-content:center;padding:10px;background:var(--verde-600);border-radius:var(--radio-md);margin-bottom:8px">
        <span style="color:white;font-size:1rem;font-weight:700">${new Date(hoy+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}</span>
      </div>
      ${horas.map(h=>{
        const horaStr = String(h).padStart(2,'0')+':00';
        const evsHora = evs.filter(e=>e.horaInicio && e.horaInicio.startsWith(String(h).padStart(2,'0')));
        return `
        <div style="display:flex;gap:8px;min-height:44px;border-bottom:1px solid var(--gris-100)">
          <div style="width:44px;font-size:.72rem;color:var(--gris-400);padding-top:6px;text-align:right;flex-shrink:0">${horaStr}</div>
          <div style="flex:1;padding:2px 0;display:flex;flex-direction:column;gap:2px">
            ${evsHora.map(e=>`
            <div style="padding:5px 10px;border-radius:var(--radio-sm);border-left:3px solid ${e.color||'var(--verde-500)'};
              background:${(TIPOS[e.tipo]||TIPOS.tarea).bg};cursor:pointer;font-size:.8rem"
              onclick="abrirModalEvento('${e.id}')">
              <span style="font-weight:600;color:${(TIPOS[e.tipo]||TIPOS.tarea).color}">${e.titulo}</span>
              ${e.horaFin?`<span style="font-size:.7rem;opacity:.7;margin-left:6px">${e.horaInicio} – ${e.horaFin}</span>`:''}
            </div>`).join('')}
          </div>
        </div>`;
      }).join('')}
      ${evs.filter(e=>!e.horaInicio||e.horaInicio==='').length>0?`
      <div style="margin-top:10px;padding:10px;background:var(--gris-50);border-radius:var(--radio-md)">
        <div style="font-size:.75rem;font-weight:700;color:var(--gris-500);margin-bottom:6px">TODO EL DÍA</div>
        ${evs.filter(e=>!e.horaInicio||e.horaInicio==='').map(e=>`
        <div style="padding:5px 10px;border-radius:var(--radio-sm);background:${(TIPOS[e.tipo]||TIPOS.tarea).bg};margin-bottom:4px;cursor:pointer"
          onclick="abrirModalEvento('${e.id}')">
          <span style="font-weight:600;color:${(TIPOS[e.tipo]||TIPOS.tarea).color}">${e.titulo}</span>
        </div>`).join('')}
      </div>`:``}
    </div>`;
  }

  // ── Cabecera del calendario ──
  const unidad = vista==='mes'?'mes':vista==='semana'?'semana':'dia';
  const tituloNav = vista==='mes'
    ? `${MESES_LABEL[mm-1]} ${yy}`
    : vista==='semana'
      ? `Sem. ${Math.ceil(dd/7)} · ${MESES_LABEL[mm-1]} ${yy}`
      : new Date(hoy+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div style="display:flex;align-items:center;gap:8px">
      <button class="btn-secundario" style="padding:5px 10px" onclick="(function(){const d=new Date();EMPRESA_STATE.tareas.agenda.fechaActual=d.toISOString().slice(0,10);renderVista('tareas')})()">Hoy</button>
      <button class="btn-secundario" style="padding:5px 8px" onclick="(function(){${`EMPRESA_STATE.tareas.agenda.fechaActual='${hoy}';`}})();(function(){const parts='${hoy}'.split('-');const d=new Date(parts[0],parts[1]-1,parts[2]);d.setMonth?void 0:null;})();
        (function(){const p='${hoy}'.split('-');const d=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));if('${unidad}'==='mes'){d.setMonth(d.getMonth()-1);}else if('${unidad}'==='semana'){d.setDate(d.getDate()-7);}else{d.setDate(d.getDate()-1);}EMPRESA_STATE.tareas.agenda.fechaActual=d.toISOString().slice(0,10);renderVista('tareas');})()">‹</button>
      <span style="font-size:.95rem;font-weight:700;color:var(--gris-800);min-width:180px;text-align:center">${tituloNav}</span>
      <button class="btn-secundario" style="padding:5px 8px" onclick="(function(){const p='${hoy}'.split('-');const d=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));if('${unidad}'==='mes'){d.setMonth(d.getMonth()+1);}else if('${unidad}'==='semana'){d.setDate(d.getDate()+7);}else{d.setDate(d.getDate()+1);}EMPRESA_STATE.tareas.agenda.fechaActual=d.toISOString().slice(0,10);renderVista('tareas');})()">›</button>
    </div>
    <div style="display:flex;gap:4px;align-items:center">
      <div style="display:flex;gap:2px;background:var(--gris-100);border-radius:var(--radio-md);padding:3px">
        ${[['mes','Mes'],['semana','Semana'],['dia','Día']].map(([v,l])=>`
        <button onclick="EMPRESA_STATE.tareas.agenda.vista='${v}';renderVista('tareas')"
          style="padding:5px 12px;border:none;border-radius:6px;font-size:.78rem;font-weight:${vista===v?700:500};cursor:pointer;
          background:${vista===v?'var(--verde-600)':'transparent'};color:${vista===v?'white':'var(--gris-500)'};transition:all .2s">${l}</button>`).join('')}
      </div>
      <button class="btn-accion" style="padding:6px 14px;font-size:.82rem" onclick="abrirModalEvento(null,'${hoy}')">
        + Nuevo evento
      </button>
    </div>
  </div>

  <!-- Leyenda de tipos -->
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
    ${Object.entries(TIPOS).map(([k,v])=>`
    <span style="font-size:.72rem;padding:3px 8px;border-radius:20px;background:${v.bg};color:${v.color};font-weight:600">${v.label}</span>`).join('')}
  </div>

  <!-- Calendario -->
  <div id="calendario-contenedor">
    ${vista==='mes' ? vistaCalendarioMes() : vista==='semana' ? vistaCalendarioSemana() : vistaCalendarioDia()}
  </div>

  <!-- Modal de evento -->
  ${modalEvento()}
  `;
}

function modalEvento() {
  const ag = EMPRESA_STATE.tareas.agenda;
  if (!ag.modal.visible) return '';
  const ev = ag.eventoTmp;
  const esEdicion = ag.modal.modo === 'editar';
  return `
  <div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center"
    onclick="if(event.target===this){cerrarModalEvento()}">
    <div style="background:var(--blanco);border-radius:var(--radio-lg);padding:1.5rem;width:min(480px,95vw);box-shadow:0 8px 40px rgba(0,0,0,.18)" onclick="event.stopPropagation()">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
        <h3 style="font-size:1rem;font-weight:700;color:var(--gris-900)">${esEdicion?'Editar evento':'Nuevo evento'}</h3>
        <button onclick="cerrarModalEvento()" style="border:none;background:none;cursor:pointer;font-size:1.2rem;color:var(--gris-400)">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="ficha-campo">
          <label>Título</label>
          <input type="text" class="ficha-input" value="${ev.titulo||''}" placeholder="Nombre del evento"
            oninput="EMPRESA_STATE.tareas.agenda.eventoTmp.titulo=this.value">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="ficha-campo">
            <label>Tipo</label>
            <select class="ficha-input" onchange="EMPRESA_STATE.tareas.agenda.eventoTmp.tipo=this.value">
              ${['tarea','reunion','entrega','tramite','fiscal'].map(t=>`<option value="${t}" ${ev.tipo===t?'selected':''}>${t.charAt(0).toUpperCase()+t.slice(1)}</option>`).join('')}
            </select>
          </div>
          <div class="ficha-campo">
            <label>Color</label>
            <input type="color" value="${ev.color||'#134a28'}" style="width:100%;height:38px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);cursor:pointer;padding:2px"
              oninput="EMPRESA_STATE.tareas.agenda.eventoTmp.color=this.value">
          </div>
        </div>
        <div class="ficha-campo">
          <label>Fecha</label>
          <input type="date" class="ficha-input" value="${ev.fecha||''}"
            oninput="EMPRESA_STATE.tareas.agenda.eventoTmp.fecha=this.value">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="ficha-campo">
            <label>Hora inicio</label>
            <input type="time" class="ficha-input" value="${ev.horaInicio||''}"
              oninput="EMPRESA_STATE.tareas.agenda.eventoTmp.horaInicio=this.value">
          </div>
          <div class="ficha-campo">
            <label>Hora fin</label>
            <input type="time" class="ficha-input" value="${ev.horaFin||''}"
              oninput="EMPRESA_STATE.tareas.agenda.eventoTmp.horaFin=this.value">
          </div>
        </div>
        <div class="ficha-campo">
          <label>Descripción</label>
          <textarea class="ficha-input" rows="2" placeholder="Detalles del evento..."
            style="resize:vertical"
            oninput="EMPRESA_STATE.tareas.agenda.eventoTmp.descripcion=this.value">${ev.descripcion||''}</textarea>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:1.25rem;justify-content:flex-end">
        ${esEdicion?`<button class="btn-secundario" style="color:#dc2626;border-color:#fca5a5" onclick="eliminarEvento('${ag.modal.eventoEdit}')">🗑️ Eliminar</button>`:''}
        <button class="btn-secundario" onclick="cerrarModalEvento()">Cancelar</button>
        <button class="btn-accion" onclick="guardarEvento()">
          ${esEdicion?'Guardar cambios':'Añadir al calendario'}
        </button>
      </div>
    </div>
  </div>`;
}

function abrirModalEvento(eventoId, fechaDefecto) {
  const ag = EMPRESA_STATE.tareas.agenda;
  if (eventoId) {
    const ev = ag.eventos.find(e=>e.id===eventoId);
    if (!ev) return;
    ag.eventoTmp = {...ev};
    ag.modal = { visible:true, modo:'editar', eventoEdit:eventoId };
  } else {
    ag.eventoTmp = { titulo:'', tipo:'tarea', fecha:fechaDefecto||ag.fechaActual, horaInicio:'09:00', horaFin:'10:00', descripcion:'', color:'#134a28' };
    ag.modal = { visible:true, modo:'nuevo', eventoEdit:null };
  }
  renderVista('tareas');
}

function cerrarModalEvento() {
  EMPRESA_STATE.tareas.agenda.modal.visible = false;
  renderVista('tareas');
}

function guardarEvento() {
  const ag = EMPRESA_STATE.tareas.agenda;
  const ev = ag.eventoTmp;
  if (!ev.titulo || !ev.fecha) { mostrarToast('Indica al menos título y fecha','error'); return; }
  if (ag.modal.modo === 'editar') {
    const idx = ag.eventos.findIndex(e=>e.id===ag.modal.eventoEdit);
    if (idx>=0) ag.eventos[idx] = {...ev, id:ag.modal.eventoEdit};
  } else {
    ag.eventos.push({...ev, id:'ev'+Date.now(), autor: APP.rolActivo==='alumno'?'grupo':'docente'});
  }
  ag.modal.visible = false;
  mostrarToast('✓ Evento guardado en el calendario','exito');
  renderVista('tareas');
}

function eliminarEvento(eventoId) {
  const ag = EMPRESA_STATE.tareas.agenda;
  ag.eventos = ag.eventos.filter(e=>e.id!==eventoId);
  ag.modal.visible = false;
  mostrarToast('Evento eliminado','');
  renderVista('tareas');
}

/* ══════════════════════════════════════════════════════
   TAB 2 — CHECKLIST
   ══════════════════════════════════════════════════════ */
function tabChecklist() {
  const cl  = EMPRESA_STATE.tareas.checklist;
  const fil = cl.filtro;

  const totalItems = cl.secciones.reduce((s,sec)=>s+sec.items.length,0);
  const hechos     = cl.secciones.reduce((s,sec)=>s+sec.items.filter(i=>i.hecho).length,0);
  const pct        = totalItems>0 ? Math.round(hechos/totalItems*100) : 0;

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="font-size:.9rem;font-weight:700;color:var(--gris-800)">${hechos}/${totalItems} tareas completadas</div>
      <div style="width:160px;height:8px;background:var(--gris-100);border-radius:4px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:var(--verde-500);border-radius:4px;transition:width .4s"></div>
      </div>
      <span style="font-size:.82rem;font-weight:700;color:var(--verde-700)">${pct}%</span>
    </div>
    <div style="display:flex;gap:4px">
      ${[['todas','Todas'],['pendientes','Pendientes'],['hechas','Hechas']].map(([v,l])=>`
      <button onclick="EMPRESA_STATE.tareas.checklist.filtro='${v}';renderVista('tareas')"
        style="padding:5px 12px;border:none;border-radius:var(--radio-md);font-size:.78rem;cursor:pointer;
        background:${fil===v?'var(--verde-600)':'var(--gris-100)'};color:${fil===v?'white':'var(--gris-600)'};
        font-weight:${fil===v?700:500}">${l}</button>`).join('')}
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:.75rem">
    ${cl.secciones.map(sec=>{
      const itemsFiltrados = sec.items.filter(i=>
        fil==='todas' ? true : fil==='pendientes' ? !i.hecho : i.hecho
      );
      if (itemsFiltrados.length===0) return '';
      const hechosSec = sec.items.filter(i=>i.hecho).length;
      const pctSec = Math.round(hechosSec/sec.items.length*100);
      return `
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>${sec.icono}</span>
          <span style="flex:1;font-weight:600">${sec.titulo}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:.75rem;color:var(--gris-500)">${hechosSec}/${sec.items.length}</span>
            <div style="width:80px;height:6px;background:var(--gris-100);border-radius:3px;overflow:hidden">
              <div style="width:${pctSec}%;height:100%;background:${pctSec===100?'var(--verde-500)':'#f59e0b'};border-radius:3px;transition:width .4s"></div>
            </div>
            <button class="btn-secundario" style="padding:3px 8px;font-size:.72rem"
              onclick="agregarItemChecklist('${sec.id}')">+ Añadir</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:2px;padding:4px 0">
          ${itemsFiltrados.map(item=>{
            const secIdx = cl.secciones.findIndex(s=>s.id===sec.id);
            const iIdx   = cl.secciones[secIdx].items.findIndex(i=>i.id===item.id);
            return `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--radio-sm);
              background:${item.hecho?'var(--verde-50)':'var(--blanco)'};
              border:1px solid ${item.hecho?'var(--verde-200)':'var(--gris-100)'};
              transition:all .2s;cursor:pointer"
              onclick="toggleCheckItem('${sec.id}','${item.id}')">
              <div style="width:20px;height:20px;border-radius:5px;flex-shrink:0;
                border:2px solid ${item.hecho?'var(--verde-500)':'var(--gris-300)'};
                background:${item.hecho?'var(--verde-500)':'transparent'};
                display:flex;align-items:center;justify-content:center;transition:all .2s">
                ${item.hecho?'<span style="color:white;font-size:.75rem;line-height:1">✓</span>':''}
              </div>
              <span style="flex:1;font-size:.84rem;color:${item.hecho?'var(--gris-400)':'var(--gris-800)'};
                text-decoration:${item.hecho?'line-through':'none'}">${item.texto}</span>
              <button onclick="event.stopPropagation();eliminarItemChecklist('${sec.id}','${item.id}')"
                style="border:none;background:none;cursor:pointer;color:var(--gris-300);font-size:.75rem;opacity:.5"
                onmouseover="this.style.opacity=1;this.style.color='#dc2626'"
                onmouseout="this.style.opacity=.5;this.style.color='var(--gris-300)'">✕</button>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function toggleCheckItem(secId, itemId) {
  const sec = EMPRESA_STATE.tareas.checklist.secciones.find(s=>s.id===secId);
  if (!sec) return;
  const item = sec.items.find(i=>i.id===itemId);
  if (!item) return;
  item.hecho = !item.hecho;
  renderVista('tareas');
}

function agregarItemChecklist(secId) {
  const texto = prompt('Texto de la nueva tarea:');
  if (!texto || !texto.trim()) return;
  const sec = EMPRESA_STATE.tareas.checklist.secciones.find(s=>s.id===secId);
  if (!sec) return;
  sec.items.push({ id:'ci'+Date.now(), texto:texto.trim(), hecho:false });
  renderVista('tareas');
}

function eliminarItemChecklist(secId, itemId) {
  const sec = EMPRESA_STATE.tareas.checklist.secciones.find(s=>s.id===secId);
  if (!sec) return;
  sec.items = sec.items.filter(i=>i.id!==itemId);
  renderVista('tareas');
}

/* ══════════════════════════════════════════════════════
   TAB 3 — DIAGRAMA DE GANTT
   ══════════════════════════════════════════════════════ */
function tabGantt() {
  const g = EMPRESA_STATE.tareas.gantt;
  const tareas = g.tareasGantt || [];
  const CATS = [...new Set(tareas.map(t=>t.categoria))].filter(Boolean);

  // Calcular rango total del proyecto
  const ini0 = g.fechaInicio || '2025-09-01';
  const fin0  = g.fechaFin   || '2026-06-30';
  const dIni  = new Date(ini0);
  const dFin  = new Date(fin0);
  const totalDias = Math.max(1, Math.ceil((dFin-dIni)/(1000*60*60*24)));

  function pct(fecha) {
    const d = new Date(fecha);
    const dias = Math.ceil((d-dIni)/(1000*60*60*24));
    return Math.max(0,Math.min(100, dias/totalDias*100));
  }
  function durPct(inicio, fin) {
    const d1=new Date(inicio), d2=new Date(fin);
    const dias = Math.max(1,Math.ceil((d2-d1)/(1000*60*60*24)));
    return Math.max(0.5, dias/totalDias*100);
  }

  // Generar marcadores de meses
  const meses = [];
  const cur = new Date(ini0);
  cur.setDate(1);
  while(cur <= dFin) {
    meses.push({ label: cur.toLocaleDateString('es-ES',{month:'short',year:'2-digit'}), pct: pct(cur.toISOString().slice(0,10)) });
    cur.setMonth(cur.getMonth()+1);
  }

  const hoy = new Date().toISOString().slice(0,10);
  const hoyPct = pct(hoy);

  return `
  <div style="display:flex;flex-direction:column;gap:1rem">

    <!-- Controles de rango y nueva tarea -->
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:6px;font-size:.82rem;color:var(--gris-600)">
        <label>Inicio proyecto:</label>
        <input type="date" value="${ini0}" class="ficha-input" style="padding:5px 8px;font-size:.82rem;width:140px"
          oninput="EMPRESA_STATE.tareas.gantt.fechaInicio=this.value" onblur="renderVista('tareas')">
      </div>
      <div style="display:flex;align-items:center;gap:6px;font-size:.82rem;color:var(--gris-600)">
        <label>Fin proyecto:</label>
        <input type="date" value="${fin0}" class="ficha-input" style="padding:5px 8px;font-size:.82rem;width:140px"
          oninput="EMPRESA_STATE.tareas.gantt.fechaFin=this.value" onblur="renderVista('tareas')">
      </div>
      <button class="btn-accion" style="margin-left:auto;padding:6px 16px;font-size:.82rem" onclick="abrirModalGantt(null)">
        + Añadir tarea
      </button>
    </div>

    <!-- Diagrama -->
    <div class="ficha-card" style="overflow:hidden">
      <div style="overflow-x:auto">
        <div style="min-width:700px">

          <!-- Cabecera de meses -->
          <div style="display:flex;margin-bottom:4px;position:relative;height:28px;background:var(--verde-50);border-radius:var(--radio-sm) var(--radio-sm) 0 0;overflow:hidden">
            <div style="width:200px;flex-shrink:0;padding:5px 10px;font-size:.72rem;font-weight:700;color:var(--verde-700)">Tarea</div>
            <div style="flex:1;position:relative">
              ${meses.map(m=>`
              <div style="position:absolute;left:${m.pct}%;transform:translateX(-50%);font-size:.65rem;color:var(--gris-500);top:7px;white-space:nowrap">${m.label}</div>`).join('')}
              <!-- Línea de hoy -->
              <div style="position:absolute;left:${hoyPct}%;top:0;bottom:0;width:2px;background:#dc2626;opacity:.7;z-index:2"></div>
            </div>
          </div>

          <!-- Líneas de cuadrícula de meses -->
          <div style="position:relative">
            ${tareas.length===0 ? `
            <div style="padding:3rem;text-align:center;color:var(--gris-400)">
              <div style="font-size:2rem;margin-bottom:8px">📊</div>
              <p>Aún no hay tareas. Haz clic en "Añadir tarea" para comenzar tu diagrama de Gantt.</p>
            </div>` : tareas.map((t,idx)=>{
              const left = pct(t.inicio);
              const width = durPct(t.inicio, t.fin);
              const col = t.color || '#134a28';
              const dias = Math.max(1,Math.ceil((new Date(t.fin)-new Date(t.inicio))/(1000*60*60*24)));
              return `
              <div style="display:flex;align-items:center;border-bottom:1px solid var(--gris-100);min-height:40px;
                ${idx%2===1?'background:var(--gris-50)':''}">
                <!-- Nombre -->
                <div style="width:200px;flex-shrink:0;padding:6px 10px;display:flex;align-items:center;gap:6px">
                  <span style="width:10px;height:10px;border-radius:2px;background:${col};flex-shrink:0"></span>
                  <div>
                    <div style="font-size:.78rem;font-weight:600;color:var(--gris-800);line-height:1.3">${t.nombre}</div>
                    <div style="font-size:.65rem;color:var(--gris-400)">${t.categoria||''}</div>
                  </div>
                  <button onclick="abrirModalGantt('${t.id}')"
                    style="margin-left:auto;border:none;background:none;cursor:pointer;color:var(--gris-300);font-size:.75rem"
                    onmouseover="this.style.color='var(--verde-600)'" onmouseout="this.style.color='var(--gris-300)'">✏️</button>
                </div>
                <!-- Barra -->
                <div style="flex:1;position:relative;height:32px;padding:4px 0">
                  <!-- Fondo cuadrícula -->
                  ${meses.map(m=>`<div style="position:absolute;left:${m.pct}%;top:0;bottom:0;width:1px;background:var(--gris-100)"></div>`).join('')}
                  <!-- Barra de tarea -->
                  <div style="position:absolute;left:${left}%;width:${width}%;height:22px;top:5px;
                    border-radius:4px;background:${col};opacity:.85;
                    display:flex;align-items:center;padding:0 6px;cursor:pointer;transition:opacity .15s;overflow:hidden"
                    title="${t.nombre} · ${t.inicio} → ${t.fin} · ${dias} días"
                    onclick="abrirModalGantt('${t.id}')"
                    onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.85">
                    ${width>8?`<span style="font-size:.65rem;color:white;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.nombre}</span>`:''}
                  </div>
                  <!-- Progreso -->
                  ${(parseFloat(t.completado)||0)>0?`
                  <div style="position:absolute;left:${left}%;width:${width*(parseFloat(t.completado)||0)/100}%;height:22px;top:5px;
                    border-radius:4px 0 0 4px;background:rgba(255,255,255,.35);pointer-events:none"></div>`:''}
                  <!-- Línea de hoy -->
                  <div style="position:absolute;left:${hoyPct}%;top:0;bottom:0;width:2px;background:#dc2626;opacity:.5;z-index:3"></div>
                </div>
              </div>`;
            }).join('')}
          </div>

          <!-- Leyenda hoy -->
          <div style="display:flex;align-items:center;gap:6px;padding:8px 10px;font-size:.72rem;color:var(--gris-500)">
            <div style="width:14px;height:3px;background:#dc2626;border-radius:2px"></div>
            <span>Línea roja = hoy (${new Date().toLocaleDateString('es-ES')})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de tarea Gantt -->
    ${modalGantt()}
  </div>`;
}

function modalGantt() {
  const g = EMPRESA_STATE.tareas.gantt;
  if (!g.modalVisible) return '';
  const t = g.tmpTarea;
  const esEdicion = !!g.tareaEditId;
  return `
  <div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center"
    onclick="if(event.target===this){EMPRESA_STATE.tareas.gantt.modalVisible=false;renderVista('tareas')}">
    <div style="background:var(--blanco);border-radius:var(--radio-lg);padding:1.5rem;width:min(460px,95vw)" onclick="event.stopPropagation()">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
        <h3 style="font-size:1rem;font-weight:700;color:var(--gris-900)">${esEdicion?'Editar tarea':'Nueva tarea Gantt'}</h3>
        <button onclick="EMPRESA_STATE.tareas.gantt.modalVisible=false;renderVista('tareas')" style="border:none;background:none;cursor:pointer;font-size:1.2rem;color:var(--gris-400)">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="ficha-campo">
          <label>Nombre de la tarea</label>
          <input type="text" class="ficha-input" value="${t.nombre||''}" placeholder="Descripción de la tarea"
            oninput="EMPRESA_STATE.tareas.gantt.tmpTarea.nombre=this.value">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="ficha-campo">
            <label>Categoría</label>
            <input type="text" class="ficha-input" value="${t.categoria||''}" placeholder="Ej: Constitución, Fiscal..."
              oninput="EMPRESA_STATE.tareas.gantt.tmpTarea.categoria=this.value">
          </div>
          <div class="ficha-campo">
            <label>Color</label>
            <input type="color" value="${t.color||'#134a28'}" style="width:100%;height:38px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);cursor:pointer;padding:2px"
              oninput="EMPRESA_STATE.tareas.gantt.tmpTarea.color=this.value">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="ficha-campo">
            <label>Fecha inicio</label>
            <input type="date" class="ficha-input" value="${t.inicio||''}"
              oninput="EMPRESA_STATE.tareas.gantt.tmpTarea.inicio=this.value">
          </div>
          <div class="ficha-campo">
            <label>Fecha fin</label>
            <input type="date" class="ficha-input" value="${t.fin||''}"
              oninput="EMPRESA_STATE.tareas.gantt.tmpTarea.fin=this.value">
          </div>
        </div>
        <div class="ficha-campo">
          <label>% Completado: <strong style="color:var(--verde-700)">${parseFloat(t.completado)||0}%</strong></label>
          <input type="range" min="0" max="100" step="5" value="${parseFloat(t.completado)||0}"
            style="width:100%;accent-color:var(--verde-600)"
            oninput="EMPRESA_STATE.tareas.gantt.tmpTarea.completado=parseInt(this.value);this.previousElementSibling.querySelector('strong').textContent=this.value+'%'">
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:1.25rem;justify-content:flex-end">
        ${esEdicion?`<button class="btn-secundario" style="color:#dc2626;border-color:#fca5a5" onclick="eliminarTareaGantt('${g.tareaEditId}')">🗑️ Eliminar</button>`:''}
        <button class="btn-secundario" onclick="EMPRESA_STATE.tareas.gantt.modalVisible=false;renderVista('tareas')">Cancelar</button>
        <button class="btn-accion" onclick="guardarTareaGantt()">${esEdicion?'Guardar cambios':'Añadir tarea'}</button>
      </div>
    </div>
  </div>`;
}

function abrirModalGantt(tareaId) {
  const g = EMPRESA_STATE.tareas.gantt;
  if (tareaId) {
    const t = g.tareasGantt.find(t=>t.id===tareaId);
    if (!t) return;
    g.tmpTarea = {...t};
    g.tareaEditId = tareaId;
  } else {
    g.tmpTarea = { nombre:'', categoria:'', inicio:g.fechaInicio||'', fin:'', color:'#134a28', completado:0 };
    g.tareaEditId = null;
  }
  g.modalVisible = true;
  renderVista('tareas');
}

function guardarTareaGantt() {
  const g = EMPRESA_STATE.tareas.gantt;
  const t = g.tmpTarea;
  if (!t.nombre||!t.inicio||!t.fin) { mostrarToast('Nombre, inicio y fin son obligatorios','error'); return; }
  if (new Date(t.fin) < new Date(t.inicio)) { mostrarToast('La fecha fin debe ser posterior al inicio','error'); return; }
  if (g.tareaEditId) {
    const idx = g.tareasGantt.findIndex(x=>x.id===g.tareaEditId);
    if (idx>=0) g.tareasGantt[idx] = {...t, id:g.tareaEditId};
  } else {
    g.tareasGantt.push({...t, id:'g'+Date.now()});
  }
  g.modalVisible = false;
  mostrarToast('✓ Tarea guardada en el Gantt','exito');
  renderVista('tareas');
}

function eliminarTareaGantt(tareaId) {
  const g = EMPRESA_STATE.tareas.gantt;
  g.tareasGantt = g.tareasGantt.filter(t=>t.id!==tareaId);
  g.modalVisible = false;
  mostrarToast('Tarea eliminada del Gantt','');
  renderVista('tareas');
}

/* ============================================================
   MÓDULO DEFENSA
   ============================================================ */
