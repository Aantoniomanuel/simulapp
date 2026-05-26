function vistaProgramas() {
  // Estado: qué programa está activo dentro del hub
  if (!window.PROG_HUB) window.PROG_HUB = { prog: 'nominasol' };
  const prog = window.PROG_HUB.prog;

  function hubTab(p) {
    window.PROG_HUB.prog = p;
    document.getElementById('contenido-principal').innerHTML = vistaProgramas();
  }
  window._hubTab = hubTab;

  const TAB_DEF = [
    { id:'nominasol', icono:'💼', label:'Nominasol',  sub:'RRHH · nóminas · cotización' },
    { id:'contasol',  icono:'📊', label:'Contasol',   sub:'Contabilidad · asientos · balances' },
    { id:'factusol',  icono:'🧾', label:'Factusol',   sub:'Facturación · clientes · IVA' }
  ];

  // Progress per program
  function progreso(mod) {
    const t = (window.PROG_STATE && window.PROG_STATE[mod] && window.PROG_STATE[mod].tareas) || [];
    const done = t.filter(x => x.estado === 'completada').length;
    return { done, total: t.length, pct: t.length > 0 ? Math.round(done/t.length*100) : 0 };
  }

  const tabs = TAB_DEF.map(t => {
    const p = progreso(t.id);
    const activo = prog === t.id;
    return `
    <div onclick="window._hubTab('${t.id}')"
      style="flex:1;padding:14px 12px;cursor:pointer;border-radius:var(--radio-md);
        border:${activo ? '2px solid var(--verde-500)' : '1.5px solid var(--gris-200)'};
        background:${activo ? 'var(--verde-50)' : 'var(--blanco)'};
        transition:all 200ms;display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:1.5rem">${t.icono}</span>
        <div>
          <div style="font-weight:600;font-size:.92rem;color:${activo?'var(--verde-800)':'var(--gris-900)'}">${t.label}</div>
          <div style="font-size:.72rem;color:var(--gris-500)">${t.sub}</div>
        </div>
      </div>
      ${p.total > 0 ? `
      <div style="display:flex;align-items:center;gap:6px">
        <div style="flex:1;height:4px;background:var(--gris-100);border-radius:2px;overflow:hidden">
          <div style="width:${p.pct}%;height:100%;background:${p.pct===100?'var(--verde-500)':'var(--verde-300)'};border-radius:2px;transition:width .4s"></div>
        </div>
        <span style="font-size:.7rem;color:var(--gris-500);white-space:nowrap">${p.done}/${p.total}</span>
      </div>` : `<div style="font-size:.7rem;color:var(--gris-400)">Sin tareas iniciadas</div>`}
    </div>`;
  }).join('');

  const contenido = prog === 'nominasol' ? vistaNominasol()
                  : prog === 'contasol'  ? vistaContasol()
                  : vistaFactusol();

  return `
  <div class="seccion-header" style="margin-bottom:0">
    <div>
      <h2>🖥️ Programas de gestión</h2>
      <p>Optativa AN5542 · Fichas de datos generadas automáticamente + registro de evidencias</p>
    </div>
    <span class="ra-chip">AN5542</span>
  </div>

  <div style="display:flex;gap:10px;margin:16px 0 20px;flex-wrap:wrap">
    ${tabs}
  </div>

  <div style="border-top:1px solid var(--gris-100);padding-top:20px">
    ${contenido}
  </div>`;
}

/* ============================================================
   HELPERS COMUNES — PROGRAMAS DE GESTIÓN
   ============================================================ */

/* Estado compartido de los tres módulos */
if (!window.PROG_STATE) {
  window.PROG_STATE = {
    nominasol: {
      tab: 'fichas',          // fichas | tareas
      fichaAbierta: null      // 'empresa' | 'trabajador-{id}' | 'nomina-{mes}'
    },
    contasol: {
      tab: 'fichas',
      fichaAbierta: null      // 'empresa' | 'cuentas' | 'asiento-{id}'
    },
    factusol: {
      tab: 'fichas',
      fichaAbierta: null      // 'empresa' | 'clientes' | 'proveedores' | 'factura-{id}'
    }
  };
}

/* Leer estado seguro */
function pgS(prog) { return window.PROG_STATE[prog]; }

/* Rerender de cada módulo */
function pgRefresh(mod) {
  const el = document.getElementById('contenido-principal');
  if (!el) return;
  if (mod === 'nominasol') el.innerHTML = vistaNominasol();
  else if (mod === 'contasol') el.innerHTML = vistaContasol();
  else if (mod === 'factusol') el.innerHTML = vistaFactusol();
}

/* Apertura de ficha/tab con rerender */
function pgTab(mod, tab)   { window.PROG_STATE[mod].tab = tab;          pgRefresh(mod); }
function pgFicha(mod, id)  { window.PROG_STATE[mod].fichaAbierta = id;  pgRefresh(mod); }

/* Imprimir ficha en ventana nueva */
function pgImprimir(html, titulo) {
  const w = window.open('', '_blank', 'width=900,height=700');
  w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
  <title>${titulo}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1a1c1e;padding:24px 32px}
    h1{font-size:18px;font-weight:700;margin-bottom:4px;color:#134a28}
    h2{font-size:14px;font-weight:600;margin:16px 0 8px;color:#217a3e;border-bottom:1.5px solid #d4f4e0;padding-bottom:4px}
    h3{font-size:13px;font-weight:600;margin:12px 0 6px;color:#1a6535}
    .meta{font-size:11px;color:#767d87;margin-bottom:20px}
    table{width:100%;border-collapse:collapse;margin-bottom:12px}
    th{background:#edfaf3;text-align:left;padding:6px 8px;font-size:11px;font-weight:600;color:#134a28;border:1px solid #d4f4e0}
    td{padding:6px 8px;border:1px solid #edf0f4;vertical-align:top}
    td.campo{font-size:11px;color:#565c64;width:38%;font-weight:500}
    td.valor{font-size:12px;color:#1a1c1e;background:#f7f9fb}
    .highlight{background:#edfaf3!important;font-weight:600;color:#134a28}
    .nota{background:#fffbeb;border:1px solid #fde68a;padding:8px 10px;border-radius:4px;font-size:11px;color:#92400e;margin:8px 0}
    .badge{display:inline-block;background:#edfaf3;color:#134a28;border:1px solid #a8e6be;border-radius:3px;padding:1px 6px;font-size:10px;font-weight:600}
    .paso{display:flex;gap:8px;align-items:flex-start;margin-bottom:6px}
    .paso-num{min-width:20px;height:20px;background:#217a3e;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}
    .paso-txt{font-size:12px;color:#2c2f33}
    .ruta{font-family:'Courier New',monospace;background:#f1efe8;padding:2px 6px;border-radius:3px;font-size:11px;color:#3e4349}
    .footer{margin-top:28px;border-top:1px solid #edf0f4;padding-top:10px;font-size:10px;color:#959da8;display:flex;justify-content:space-between}
    @media print{body{padding:12px 20px}.no-print{display:none}}
  </style></head><body>
  ${html}
  <div class="footer"><span>SimulApp · IES Cantillana · Grado Superior Administración y Finanzas</span><span>${titulo} · ${new Date().toLocaleDateString('es-ES')}</span></div>
  <'+'script>setTimeout(()=>window.print(),400)<'+'/script>
  </body></html>`);
  w.document.close();
}

/* Tarjeta de tarea con evidencia */
function pgTareaCard(tarea, mod) {
  const estados = { pendiente:'🔴 Pendiente', 'en-curso':'🟡 En curso', completada:'🟢 Completada' };
  const st = tarea.estado || 'pendiente';

  // Buscar el correo origen si es una tarea auto-generada
  const correoOrigen = tarea.correoId
    ? EMPRESA_STATE.mensajeria.correos.find(c => c.id === tarea.correoId)
    : null;

  const borderColor = tarea.autoGenerada
    ? (st === 'completada' ? 'var(--verde-300)' : '#bfdbfe')
    : 'var(--gris-100)';

  return `
  <div class="card" style="margin-bottom:10px;border-left:3px solid ${borderColor}">
    <div style="display:flex;align-items:flex-start;gap:12px">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
          <span style="font-weight:600;font-size:.88rem">${tarea.titulo}</span>
          <span class="ra-chip">${tarea.ra||''}</span>
          <span style="font-size:.75rem;color:var(--gris-500)">${estados[st]}</span>
          ${tarea.autoGenerada ? `<span style="font-size:.65rem;padding:2px 7px;border-radius:20px;background:#eff6ff;color:#1e40af;font-weight:600;border:1px solid #bfdbfe">📧 Desde buzón</span>` : ''}
        </div>
        <p style="font-size:.82rem;color:var(--gris-600);margin-bottom:6px">${tarea.desc}</p>

        ${correoOrigen ? `
        <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:var(--radio-sm);margin-bottom:8px;cursor:pointer"
          onclick="irA('mensajeria');EMPRESA_STATE.mensajeria.correoAbierto='${correoOrigen.id}'">
          <span style="font-size:.85rem">📧</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:.75rem;font-weight:600;color:#1e40af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${correoOrigen.asunto}</div>
            <div style="font-size:.68rem;color:#3b82f6">De: ${correoOrigen.de} · ${correoOrigen.fecha} — Pulsa para ver el correo →</div>
          </div>
          ${!correoOrigen.leido ? `<span style="font-size:.62rem;padding:1px 6px;border-radius:20px;background:#ef4444;color:white;font-weight:700">Sin leer</span>` : ''}
        </div>` : ''}

        ${tarea.instrucciones ? `<div style="background:var(--gris-50);border-left:3px solid var(--verde-400);padding:8px 10px;border-radius:0 var(--radio-sm) var(--radio-sm) 0;font-size:.8rem;color:var(--gris-700);margin-bottom:8px">${tarea.instrucciones}</div>` : ''}

        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          ${st !== 'completada' ? `
            <select style="font-size:.78rem;padding:4px 8px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);background:var(--blanco)"
              onchange="window._pgSetEstado('${mod}','${tarea.id}',this.value)">
              <option value="pendiente" ${st==='pendiente'?'selected':''}>🔴 Pendiente</option>
              <option value="en-curso" ${st==='en-curso'?'selected':''}>🟡 En curso</option>
              <option value="completada" ${st==='completada'?'selected':''}>🟢 Completada</option>
            </select>` : `<span style="font-size:.78rem;color:var(--verde-700);font-weight:600">✓ Completada</span>`}
          ${tarea.conFicha ? `<button class="btn-secundario" style="font-size:.75rem;padding:4px 10px" onclick="pgFicha('${mod}','${tarea.fichaId}')">📋 Ver ficha de datos</button>` : ''}
        </div>
        ${st !== 'pendiente' ? `
        <div style="margin-top:10px">
          <label style="font-size:.78rem;font-weight:500;color:var(--gris-700);display:block;margin-bottom:4px">Evidencia / reflexión</label>
          <textarea style="width:100%;min-height:64px;padding:8px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.8rem;font-family:var(--fuente-cuerpo);resize:vertical"
            placeholder="Describe qué has hecho, qué dificultades has encontrado o pega aquí el número de documento generado en el programa..."
            oninput="window._pgSetEvidencia('${mod}','${tarea.id}',this.value)">${tarea.evidencia||''}</textarea>
          <div style="display:flex;gap:8px;margin-top:6px;align-items:center">
            <label style="font-size:.75rem;color:var(--gris-500);cursor:pointer;display:flex;align-items:center;gap:4px">
              📎 Adjuntar archivo
              <input type="file" style="display:none" accept=".pdf,.png,.jpg,.xlsx,.xls"
                onchange="window._pgAdjuntar('${mod}','${tarea.id}',this)">
            </label>
            ${(tarea.adjuntos||[]).map((a,i)=>`<span style="font-size:.73rem;background:var(--verde-50);color:var(--verde-800);border:1px solid var(--verde-200);padding:2px 8px;border-radius:10px">📎 ${a.nombre} <button onclick="window._pgEliminarAdj('${mod}','${tarea.id}',${i})" style="background:none;border:none;cursor:pointer;color:var(--gris-500);font-size:.7rem">✕</button></span>`).join('')}
          </div>
        </div>` : ''}
      </div>
    </div>
  </div>`;
}

/* Handlers de evidencia */
window._pgSetEstado = function(mod, tareaId, val) {
  const tareas = window.PROG_STATE[mod].tareas;
  const t = tareas.find(t => t.id === tareaId);
  if (t) { t.estado = val; pgRefresh(mod); }
};
window._pgSetEvidencia = function(mod, tareaId, val) {
  const t = window.PROG_STATE[mod].tareas.find(t => t.id === tareaId);
  if (t) t.evidencia = val;
};
window._pgAdjuntar = function(mod, tareaId, input) {
  const t = window.PROG_STATE[mod].tareas.find(t => t.id === tareaId);
  if (!t) return;
  if (!t.adjuntos) t.adjuntos = [];
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    t.adjuntos.push({ nombre: file.name, data: reader.result });
    pgRefresh(mod);
    mostrarToast('📎 Archivo adjuntado: ' + file.name, 'exito');
  };
  reader.readAsDataURL(file);
};
window._pgEliminarAdj = function(mod, tareaId, idx) {
  const t = window.PROG_STATE[mod].tareas.find(t => t.id === tareaId);
  if (t && t.adjuntos) { t.adjuntos.splice(idx, 1); pgRefresh(mod); }
};

/* Inicializar tareas de un módulo si no existen */
function pgInitTareas(mod, listaDef) {
  if (!window.PROG_STATE[mod].tareas) {
    window.PROG_STATE[mod].tareas = listaDef.map(t => ({...t, estado:'pendiente', evidencia:'', adjuntos:[]}));
  }
  // Añadir tareas nuevas que no existan todavía (al actualizar la app)
  listaDef.forEach(def => {
    if (!window.PROG_STATE[mod].tareas.find(t => t.id === def.id)) {
      window.PROG_STATE[mod].tareas.push({...def, estado:'pendiente', evidencia:'', adjuntos:[]});
    }
  });
  return window.PROG_STATE[mod].tareas;
}

/* Cabecera común de módulo */
function pgCabecera(icono, titulo, subtitulo, modTag, mod) {
  const s = pgS(mod);
  const completadas = (s.tareas||[]).filter(t=>t.estado==='completada').length;
  const total       = (s.tareas||[]).length;
  return `
  <div class="seccion-header" style="margin-bottom:0">
    <div>
      <h2>${icono} ${titulo}</h2>
      <p>${subtitulo}</p>
    </div>
    <div style="display:flex;gap:6px;align-items:center">
      ${total > 0 ? `<span style="font-size:.78rem;color:var(--gris-500);">${completadas}/${total} tareas</span>` : ''}
      <span class="ra-chip">${modTag}</span>
      <button class="btn-ayuda-ctx" data-ayuda="${mod}" onclick="toggleAyuda(mod)" title="Conceptos y ayuda">❓ Ayuda</button>
    </div>
  </div>
  <div style="display:flex;gap:4px;padding:0 0 16px;border-bottom:1px solid var(--gris-100);margin-bottom:16px">
    <button class="btn-${s.tab==='fichas'?'accion':'secundario'}" style="font-size:.8rem;padding:6px 14px"
      onclick="pgTab('${mod}','fichas')">📋 Fichas de datos</button>
    <button class="btn-${s.tab==='tareas'?'accion':'secundario'}" style="font-size:.8rem;padding:6px 14px"
      onclick="pgTab('${mod}','tareas')">✅ Tareas y evidencias ${total>0?`<span style='background:rgba(255,255,255,.25);border-radius:10px;padding:0 5px;font-size:.7rem;margin-left:4px'>${completadas}/${total}</span>`:''}</button>
  </div>`;
}

/* Bloque de ficha desplegable */
function pgFichaBloque(id, icono, titulo, subtitulo, html, mod) {
  const s = pgS(mod);
  const open = s.fichaAbierta === id;
  return `
  <div class="card" style="margin-bottom:10px;padding:0;overflow:hidden">
    <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;cursor:pointer;background:${open?'var(--verde-50)':'var(--blanco)'}"
      onclick="pgFicha('${mod}','${open ? 'null' : id}')">
      <span style="font-size:1.4rem">${icono}</span>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.9rem;color:var(--gris-900)">${titulo}</div>
        <div style="font-size:.78rem;color:var(--gris-500)">${subtitulo}</div>
      </div>
      <span style="font-size:.8rem;color:var(--verde-600)">${open ? '▲ Cerrar' : '▼ Abrir ficha'}</span>
    </div>
    ${open ? `<div style="padding:16px;border-top:1px solid var(--gris-100)">${html}</div>` : ''}
  </div>`;
}

/* ── Tabla ficha ── */
function pgTablaFicha(filas) {
  return `<table style="width:100%;border-collapse:collapse;margin-bottom:8px">
    ${filas.map(([campo,valor,nota])=>`
    <tr>
      <td style="width:38%;padding:6px 10px;border:1px solid var(--gris-100);font-size:.78rem;font-weight:500;color:var(--gris-700);background:var(--gris-50)">${campo}</td>
      <td style="padding:6px 10px;border:1px solid var(--gris-100);font-size:.82rem;color:var(--gris-900);${nota?'background:var(--verde-50);font-weight:500':''}">${valor||'<span style="color:var(--gris-400);font-style:italic">— sin datos —</span>'}</td>
    </tr>`).join('')}
  </table>`;
}

/* ── Botón de imprimir con HTML prefabricado ── */
function pgBtnImprimir(html, titulo) {
  if (!window._pgFichas) window._pgFichas = {};
  const key = 'f' + Date.now() + Math.random().toString(36).slice(2,6);
  window._pgFichas[key] = { html: html, titulo: titulo };
  return `<button class="btn-secundario" style="font-size:.75rem;padding:5px 12px;margin-top:10px"
    onclick="var f=window._pgFichas['${key}'];pgImprimir(f.html,f.titulo)">\u{1F5A8}\uFE0F Imprimir / Guardar PDF</button>`;
}


/* Instrucción de navegación en el programa */
function pgRuta(txt) {
  return `<div style="display:flex;gap:6px;align-items:center;margin:6px 0;font-size:.78rem">
    <span style="background:var(--verde-700);color:white;border-radius:3px;padding:2px 6px;font-size:.7rem;white-space:nowrap">📍 Ruta</span>
    <span style="font-family:var(--fuente-mono);background:var(--gris-100);padding:2px 8px;border-radius:3px;color:var(--gris-800)">${txt}</span>
  </div>`;
}

/* Pasos numerados (solo para fichas de configuración inicial o procesos complejos) */
function pgPasos(pasos) {
  return `<div style="margin:10px 0 6px">
    <div style="font-size:.75rem;font-weight:600;color:var(--gris-600);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Pasos en el programa</div>
    ${pasos.map((p,i)=>`
    <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:5px">
      <span style="min-width:20px;height:20px;background:var(--verde-700);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;flex-shrink:0">${i+1}</span>
      <div style="font-size:.8rem;color:var(--gris-700);padding-top:1px">${p}</div>
    </div>`).join('')}
  </div>`;
}

/* ============================================================
   MÓDULO NOMINASOL
   ============================================================ */
/* ============================================================
   SINCRONIZACIÓN AUTOMÁTICA DE TAREAS DESDE CORREOS CON DOCUMENTO
   ============================================================ */

/* Mapa: tipo de situación → programa(s) destino y cómo crear la tarea */
const CORREO_A_TAREA = {
  /* ── FACTUSOL ── */
  'factura-compra':            { mods:['factusol'], icono:'📥', ra:'RA1d', titulo: d => `Registrar factura de compra — ${d.empresa||'Proveedor'} · ${d.numDoc||''}`, instrucciones:'Factusol → Facturación → Facturas recibidas → Nueva factura. Introduce los datos del documento adjunto.' },
  'factura-venta':             { mods:['factusol'], icono:'📤', ra:'RA1c', titulo: d => `Registrar factura de venta — ${d.cliente||'Cliente'} · ${d.numDoc||''}`, instrucciones:'Factusol → Facturación → Facturas emitidas. Verifica que la factura está registrada y contabilizada.' },
  'factura-rectificativa-compra':{ mods:['factusol'], icono:'🔄', ra:'RA1d', titulo: d => `Registrar factura rectificativa compra — ${d.proveedor||''} · ${d.numRect||''}`, instrucciones:'Factusol → Facturas recibidas → Rectificativa. Introduce el abono y enlázalo con la factura original.' },
  'factura-rectificativa-venta': { mods:['factusol'], icono:'🔄', ra:'RA1c', titulo: d => `Emitir factura rectificativa venta — ${d.cliente||''} · ${d.numRect||''}`, instrucciones:'Factusol → Facturas emitidas → Rectificativa. Emite el abono y actualiza el saldo del cliente.' },
  'pedido-cliente':            { mods:['factusol'], icono:'📦', ra:'RA2a', titulo: d => `Registrar pedido de ${d.cliente||'cliente'} — ${d.producto||''}`, instrucciones:'Factusol → Ventas → Pedidos → Nuevo pedido. Confirma disponibilidad y genera el albarán cuando proceda.' },
  'albaran-entrega':           { mods:['factusol'], icono:'🚚', ra:'RA2a', titulo: d => `Confirmar albarán nº ${d.numAlbaran||''} — ${d.cliente||''}`, instrucciones:'Factusol → Ventas → Albaranes. Verifica la entrega, firma la conformidad y convierte en factura al cierre del mes.' },
  'reclamacion-proveedor':     { mods:['factusol'], icono:'📮', ra:'RA1d', titulo: d => `Gestionar reclamación a ${d.proveedor||'proveedor'} — Pedido ${d.numPedido||''}`, instrucciones:'Factusol → Facturas recibidas. Bloquea el pago pendiente y registra la incidencia hasta resolución.' },
  'negociacion-precio':        { mods:['factusol'], icono:'🤝', ra:'RA2a', titulo: d => `Actualizar condiciones comerciales con ${d.empresaCliente||'cliente'}`, instrucciones:'Factusol → Clientes → selecciona cliente → Condiciones comerciales. Actualiza el descuento o rappel acordado.' },
  'acuerdo-suministro':        { mods:['factusol'], icono:'📝', ra:'RA2a', titulo: d => `Registrar acuerdo marco de suministro con ${d.empresaPropone||'proveedor'}`, instrucciones:'Factusol → Proveedores → selecciona proveedor → Condiciones. Registra el precio y condiciones del acuerdo marco.' },
  'disputa-mercado':           { mods:['factusol'], icono:'⚡', ra:'RA2a', titulo: d => `Gestionar disputa comercial — ${d.empresaReclamante||''} · Pedido ${d.numDoc||''}`, instrucciones:'Factusol → Facturas. Bloquea o retiene el documento en disputa hasta resolución. Documenta la incidencia.' },

  /* ── CONTASOL ── */
  'extracto-bancario':         { mods:['contasol'], icono:'🏧', ra:'RA2c', titulo: d => `Conciliar extracto bancario ${d.banco||''} — ${d.mes||''}`, instrucciones:'Contasol → Tesorería → Conciliación bancaria (cta. 572). Verifica que cada movimiento tiene asiento correspondiente.' },
  'factura-suministros':       { mods:['contasol'], icono:'💡', ra:'RA2c', titulo: d => `Contabilizar factura ${d.tipoSuministro||'suministro'} — ${d.empresa||''} · ${d.numDoc||''}`, instrucciones:`Contasol → Libro Diario. Asiento: ${'{debe}'} cta. ${'{datos.cuenta||"628"}'} + 472 IVA soportado / ${'{haber}'} 400 Proveedores.` },
  'seguro-anual':              { mods:['contasol'], icono:'🛡️', ra:'RA2c', titulo: d => `Contabilizar póliza de seguro — ${d.aseguradora||''} · ${d.tipoSeguro||''}`, instrucciones:'Contasol → Libro Diario. Asiento: 625 Primas de seguros (debe) / 410 Acreedores (haber). Si cubre 2 ejercicios, periodifica con cta. 480.' },
  'reparacion-inmovilizado':   { mods:['contasol'], icono:'🔧', ra:'RA2c', titulo: d => `Contabilizar reparación — ${d.bien||''} · ${d.empresa||''}`, instrucciones:'Contasol → Libro Diario. Si es mantenimiento: 622 Reparaciones (debe) / 400 Proveedores (haber). Si mejora el bien, activa como mayor valor del inmovilizado.' },
  'adquisicion-inmovilizado':  { mods:['contasol'], icono:'🏗️', ra:'RA2c', titulo: d => `Contabilizar compra de ${d.bien||'inmovilizado'} — ${d.proveedor||''}`, instrucciones:'Contasol → Libro Diario. Asiento: cta. inmovilizado + 472 IVA inversión (debe) / 400 Proveedores o 172 Deudas LP (haber). Crea ficha en registro de inmovilizado.' },
  'venta-inmovilizado':        { mods:['contasol'], icono:'🏷️', ra:'RA2c', titulo: d => `Contabilizar baja y venta de ${d.bien||'bien'} — ${d.comprador||''}`, instrucciones:'Contasol → Libro Diario. Da de baja el bien: 282 Amortiz. acum. + 671/770 resultado (debe/haber) / cta. inmovilizado (haber). Registra el cobro.' },
  'requerimiento-aeat':        { mods:['contasol'], icono:'🏛️', ra:'RA2e', titulo: d => `Responder requerimiento AEAT — Ref. ${d.numRef||''}`, instrucciones:'Extrae de Contasol los libros de registro de facturas y las declaraciones del período indicado. Responde en Sede Electrónica antes del plazo.' },
  'impago-cliente':            { mods:['contasol'], icono:'⚠️', ra:'RA2c', titulo: d => `Reclasificar impago — ${d.cliente||''} · Fac. ${d.numFac||''}`, instrucciones:'Contasol → Libro Diario. Asiento: 436 Clientes de dudoso cobro (debe) / 430 Clientes (haber). Valora dotar provisión: 694 (debe) / 490 (haber).' },
  'amortizacion-anual':        { mods:['contasol'], icono:'📉', ra:'RA2d', titulo: d => `Registrar amortización anual — Ejercicio ${d.ejercicio||''}`, instrucciones:'Contasol → Libro Diario. Asiento: 682 Amortización inmov. material (debe) / 282 Amortización acumulada (haber). Importe según cuadro adjunto.' },
  'periodificacion-gasto':     { mods:['contasol'], icono:'🗓️', ra:'RA2d', titulo: d => `Periodificar gasto — ${d.concepto||''} · ${d.importeSiguiente||''} €`, instrucciones:'Contasol → Libro Diario (31/12). Asiento: 480 Gastos anticipados (debe) / cta. gasto (haber). Revertir el 1/1 siguiente.' },
  'provision-insolvencia':     { mods:['contasol'], icono:'🔒', ra:'RA2d', titulo: d => `Dotar provisión insolvencia — ${d.deudor||''} · ${d.importe||''} €`, instrucciones:'Contasol → Libro Diario. Asiento: 694 Deterioro créditos (debe) / 490 Deterioro valor créditos (haber).' },
  'cierre-contable':           { mods:['contasol'], icono:'📒', ra:'RA2e', titulo: d => `Cierre contable ejercicio ${d.ejercicio||''}`, instrucciones:'Contasol → Asistente de cierre. 1) Asiento regularización (saldar grupos 6 y 7 contra 129). 2) Asiento de cierre. 3) Generar cuentas anuales.' },
  'solicitud-prestamo':        { mods:['contasol'], icono:'🏦', ra:'RA2c', titulo: d => `Contabilizar préstamo — ${d.banco||''} · ${Number(d.importe||0).toLocaleString('es-ES')} €`, instrucciones:'Contasol → Libro Diario. Asiento: 572 Bancos (debe) / 170 Deudas LP + 520 Deudas CP (haber). Crea cuadro de amortización.' },
  'subvencion':                { mods:['contasol'], icono:'💰', ra:'RA2c', titulo: d => `Contabilizar subvención — ${Number(d.importe||0).toLocaleString('es-ES')} €`, instrucciones:'Contasol → Libro Diario. Asiento: 572 Bancos (debe) / 130 Subvenciones de capital (haber). Imputa anualmente: 130 (debe) / 746 (haber).' },
  'contrato-arrendamiento':    { mods:['contasol'], icono:'🏠', ra:'RA2c', titulo: d => `Contabilizar alquiler — ${d.arrendador||''} · ${d.renta||''} €/mes`, instrucciones:'Contasol → Libro Diario (mensual). Asiento: 621 Arrendamientos (debe) + 472 IVA / 572 Bancos (haber). Fianza: 180 (debe) / 572 (haber).' },
  'mod111-retenciones':        { mods:['contasol'], icono:'📋', ra:'RA2e', titulo: d => `Presentar Mod. 111 — ${d.trimestre||''}T ${d.ejercicio||''}`, instrucciones:'Contasol → informes de retenciones. Extrae bases y cuotas, cumplimenta el Mod. 111 en Sede AEAT antes del plazo indicado.' },
  'mod347-operaciones':        { mods:['contasol'], icono:'📊', ra:'RA2e', titulo: d => `Presentar Mod. 347 — Ejercicio ${d.ejercicio||''}`, instrucciones:'Contasol → saldos por cuenta 400/430. Filtra terceros con operaciones > 3.005,06 €. Presenta Mod. 347 antes del 28 de febrero.' },
  'mod200-sociedades':         { mods:['contasol'], icono:'🏢', ra:'RA2e', titulo: d => `Presentar Mod. 200 IS — Ejercicio ${d.ejercicio||''}`, instrucciones:'Contasol → Cuenta de resultados. Calcula la base imponible, aplica el tipo y presenta el Mod. 200 antes del 25 de julio.' },
  'iva-intracomunitario':      { mods:['contasol'], icono:'🇪🇺', ra:'RA2c', titulo: d => `Contabilizar op. intracomunitaria — ${d.empresa||''} · ${d.importe||''} €`, instrucciones:'Contasol → Libro Diario. Inversión sujeto pasivo: anota en casilla 10 y 36 del Mod. 303. Declara en Mod. 349.' },

  /* ── NOMINASOL ── */
  'nomina':                    { mods:['nominasol'], icono:'💶', ra:'RA2', titulo: d => `Calcular nómina de ${d.mes||''} — ${d.nombreEmp||'trabajador'}`, instrucciones:'Nominasol → Nóminas → Calcular nóminas. Verifica IRPF, SS y conceptos variables del mes indicado.' },
  'contrato':                  { mods:['nominasol'], icono:'📋', ra:'RA1', titulo: d => `Dar de alta trabajador — ${d.nombreEmp||''} · ${d.tipoContrato||''}`, instrucciones:'Nominasol → Trabajadores → Nuevo. Alta en SS (TA.2 / SILTRA). Registra fecha de inicio y tipo de contrato.' },
  'baja-medica':               { mods:['nominasol'], icono:'🏥', ra:'RA3', titulo: d => `Gestionar baja IT — ${d.nombreEmp||''} · desde ${d.fechaBaja||''}`, instrucciones:'Nominasol → Trabajadores → Incidencias → Nueva IT. Introduce fechas y motivo. Recalcula la nómina del mes.' },
  'embargo-nomina':            { mods:['nominasol'], icono:'⚖️', ra:'RA3', titulo: d => `Aplicar embargo de nómina — ${d.nombreEmp||''} · Deuda ${d.deuda||''} €`, instrucciones:'Nominasol → Trabajadores → selecciona empleado → Retenciones judiciales. Aplica el porcentaje sobre el salario neto que exceda el SMI según art. 607 LEC.' },
  'deuda-ss':                  { mods:['nominasol'], icono:'🏦', ra:'RA3', titulo: d => `Regularizar deuda SS — ${d.periodo||''} · Total ${d.total||''} €`, instrucciones:'Nominasol → Seguridad Social → Liquidaciones. Comprueba y regulariza el período indicado. Domicilia en SEDESS.' },
  'despido':                   { mods:['nominasol'], icono:'📤', ra:'RA4', titulo: d => `Tramitar despido y finiquito — ${d.nombreEmp||''} · ${d.fecha||''}`, instrucciones:'Nominasol → Trabajadores → selecciona empleado → Finalizar contrato. Calcula finiquito: vacaciones (${d.vacaciones||0} días) + pagas proporcionales + indemnización.' },
  'maternidad-paternidad':     { mods:['nominasol'], icono:'👶', ra:'RA3', titulo: d => `Gestionar permiso ${d.tipo||'maternidad/paternidad'} — ${d.nombreEmp||''}`, instrucciones:'Nominasol → Trabajadores → Incidencias → Maternidad/Paternidad. Suspende el contrato y tramita la solicitud al INSS.' },
  'excedencia-voluntaria':     { mods:['nominasol'], icono:'⏸️', ra:'RA4', titulo: d => `Gestionar excedencia voluntaria — ${d.nombreEmp||''} · ${d.duracion||''} meses`, instrucciones:'Nominasol → Trabajadores → selecciona empleado → Suspensión. Baja en SS y anota reserva de puesto según la duración solicitada.' },
  'horas-extra':               { mods:['nominasol'], icono:'⏱️', ra:'RA2', titulo: d => `Registrar horas extra — ${d.nombreEmp||''} · ${d.horasExt||''} h en ${d.mes||''}`, instrucciones:'Nominasol → Nóminas → Conceptos variables. Añade las horas extra con el recargo correspondiente o marca compensación por descanso.' },
  'ere-erte':                  { mods:['nominasol'], icono:'🚨', ra:'RA4', titulo: d => `Tramitar ERTE — ${d.numTrabajadores||''} trabajadores · ${d.dept||''}`, instrucciones:'Nominasol → Expedientes de regulación. Registra los trabajadores afectados, período y tipo de medida. Comunica al SEPE.' },
  'seguro-trabajadores':       { mods:['nominasol'], icono:'🏥', ra:'RA2', titulo: d => `Registrar seguro médico colectivo — ${d.aseguradora||''} · ${d.primaTotal||''} €/mes`, instrucciones:'Nominasol → Empresa → Conceptos → Retribución en especie. Añade la prima por empleado como concepto exento hasta 500 €/año (art. 42.3.c LIRPF).' },
};

/* Texto descriptivo por software para el badge */
const SW_LABEL = { nominasol:'Nominasol', contasol:'Contasol', factusol:'Factusol' };

/* Genera un id de tarea reproducible a partir del correo */
function _tareaIdDesdeCorreo(correoId, mod) {
  return `auto-${mod}-${correoId}`;
}

/* Función principal: sincroniza correos con documento → tareas en programas */
function sincronizarTareasDesdeCorreos() {
  const correos = EMPRESA_STATE.mensajeria.correos;

  correos.forEach(correo => {
    if (!correo.documento || !correo.documento.tipo) return; // solo con documento adjunto

    const cfg = CORREO_A_TAREA[correo.documento.tipo];
    if (!cfg) return; // tipo sin mapeo

    const datos = correo.documento.datos || {};

    cfg.mods.forEach(mod => {
      const tareaId = _tareaIdDesdeCorreo(correo.id, mod);
      const state   = window.PROG_STATE?.[mod];
      if (!state) return;
      if (!state.tareas) state.tareas = [];

      // No duplicar si ya existe
      if (state.tareas.find(t => t.id === tareaId)) return;

      const titulo = typeof cfg.titulo === 'function' ? cfg.titulo(datos) : cfg.titulo;

      state.tareas.push({
        id:          tareaId,
        ra:          cfg.ra,
        titulo:      titulo,
        desc:        `Gestionar situación recibida en el buzón: "${correo.asunto}"`,
        instrucciones: cfg.instrucciones,
        estado:      'pendiente',
        evidencia:   '',
        adjuntos:    [],
        correoId:    correo.id,         // referencia al correo origen
        conFicha:    false,
        autoGenerada: true,             // distingue de las tareas estáticas
        fecha:       correo.fecha,
      });
    });
  });
}

function _contarTareasAutoMod(mod) {
  const tareas = window.PROG_STATE?.[mod]?.tareas || [];
  return tareas.filter(t => t.autoGenerada && t.estado === 'pendiente').length;
}

function vistaNominasol() {
  sincronizarTareasDesdeCorreos(); // sincronizar correos → tareas antes de renderizar
  const d    = EMPRESA_STATE.datos;
  const rrhh = EMPRESA_STATE.rrhh;
  const org  = (d && d.organigrama) ? d.organigrama : {};
  const conv = (rrhh && rrhh.convenio) ? rrhh.convenio : {};
  const convGrupos = (conv && Array.isArray(conv.grupos)) ? conv.grupos : [];
  const s    = pgS('nominasol');

  /* ── Tareas del módulo ── */
  const TAREAS_NOM = [
    { id:'nom-t1', ra:'RA1', titulo:'Configurar empresa en Nominasol',
      desc:'Introduce los datos de tu empresa en Nominasol para comenzar a trabajar.',
      instrucciones:'Abre Nominasol → Empresas → Nueva empresa. Utiliza la ficha "Datos de empresa" generada más abajo.',
      conFicha:true, fichaId:'empresa' },
    { id:'nom-t2', ra:'RA1', titulo:'Dar de alta a los trabajadores',
      desc:'Registra cada miembro del organigrama como trabajador en Nominasol con sus datos contractuales.',
      instrucciones:'Nominasol → Trabajadores → Nuevo trabajador. Una ficha individual por cada persona del organigrama.',
      conFicha:true, fichaId:'trabajadores' },
    { id:'nom-t3', ra:'RA2', titulo:'Calcular la nómina del mes de octubre',
      desc:'Genera las nóminas mensuales de todos los trabajadores y comprueba que coinciden con el cálculo de la app.',
      instrucciones:'Nominasol → Nóminas → Calcular nóminas. Selecciona el mes y revisa las deducciones de SS e IRPF.',
      conFicha:true, fichaId:'nomina-octubre' },
    { id:'nom-t4', ra:'RA2', titulo:'Generar los TC1 y TC2 (Boletines de cotización)',
      desc:'Obtén los documentos de cotización a la Seguridad Social del mes calculado.',
      instrucciones:'Nominasol → Seguridad Social → Boletines de cotización → TC1 / TC2. Guarda los archivos generados.',
      conFicha:false },
    { id:'nom-t5', ra:'RA2', titulo:'Emitir los recibos de nómina',
      desc:'Imprime o exporta los recibos de salario de cada trabajador.',
      instrucciones:'Nominasol → Nóminas → Imprimir recibos. Guarda un PDF por cada trabajador como evidencia.',
      conFicha:false },
    { id:'nom-t6', ra:'RA3', titulo:'Registrar una incidencia: baja por IT',
      desc:'Simula una baja por Incapacidad Temporal de un trabajador y actualiza la nómina.',
      instrucciones:'Nominasol → Trabajadores → selecciona el empleado → Incidencias → Nueva IT. Luego recalcula la nómina.',
      conFicha:false },
    { id:'nom-t7', ra:'RA3', titulo:'Registrar horas extraordinarias',
      desc:'Añade horas extra al mes siguiente y verifica el impacto en nómina y cotización.',
      instrucciones:'Nominasol → Nóminas → Conceptos variables. Introduce las horas extra y recalcula.',
      conFicha:false }
  ];
  pgInitTareas('nominasol', TAREAS_NOM);
  const tareas = window.PROG_STATE.nominasol.tareas;

  /* ── Helpers de datos ── */
  const trabajadores = Object.entries(org).map(([key, puesto]) => ({
    key, nombre: puesto.alumno || '—', cargo: key,
    tipoContrato: puesto.tipoContrato || '—',
    jornada: puesto.jornada || '—',
    grupo: convGrupos.find(g => g.id === puesto.grupoProf) || null,
    salarioBase: convGrupos.find(g => g.id === puesto.grupoProf) ? convGrupos.find(g => g.id === puesto.grupoProf).salarioBase : '—'
  })).filter(t => t.nombre && t.nombre !== '—');

  const DEPTS_NOM = {
    direccion:'Dirección y Gerencia', rrhh:'Administración y RRHH',
    comercial:'Comercial', contabilidad:'Contabilidad y Finanzas', fiscal:'Fiscal y Legal'
  };

  /* ── Ficha empresa (HTML imprimible) ── */
  const htmlFichaEmpresa = `
    <h1>Ficha de configuración · Nominasol</h1>
    <p class="meta">Empresa en simulación · ${d.nombre||'Sin nombre'} · Generada desde SimulApp</p>
    <div class="nota">Introduce estos datos en <strong>Nominasol → Empresas → Nueva empresa</strong></div>
    <h2>1. Datos identificativos</h2>
    <table><tr><th class="campo">Campo</th><th>Valor a introducir</th></tr>
      <tr><td class="campo">Razón social</td><td class="valor highlight">${d.nombre||'—'}</td></tr>
      <tr><td class="campo">CIF / NIF</td><td class="valor highlight">${d.cifProvisional||'—'}</td></tr>
      <tr><td class="campo">Domicilio social</td><td class="valor">${d.domicilioSocial||'—'}</td></tr>
      <tr><td class="campo">Municipio</td><td class="valor">Cantillana (Sevilla)</td></tr>
      <tr><td class="campo">Código postal</td><td class="valor">41430</td></tr>
      <tr><td class="campo">Provincia</td><td class="valor">Sevilla</td></tr>
      <tr><td class="campo">Actividad (CNAE)</td><td class="valor">${d.actividadCNAE||d.sector||'—'}</td></tr>
    </table>
    <h2>2. Datos de Seguridad Social</h2>
    <table><tr><th class="campo">Campo</th><th>Valor a introducir</th></tr>
      <tr><td class="campo">Código de Cuenta de Cotización (CCC)</td><td class="valor highlight">${d.ccc||'Introducir el CCC asignado en el trámite de inscripción SS'}</td></tr>
      <tr><td class="campo">Delegación TGSS</td><td class="valor">Sevilla · Dirección Provincial</td></tr>
      <tr><td class="campo">Mutua de AT/EP</td><td class="valor">Indicar la que corresponda (ej. Fremap, Mutual Midat, UMIVALE)</td></tr>
      <tr><td class="campo">Régimen de cotización</td><td class="valor">Régimen General</td></tr>
    </table>
    <h2>3. Convenio colectivo aplicable</h2>
    <table><tr><th class="campo">Campo</th><th>Valor a introducir</th></tr>
      <tr><td class="campo">Convenio</td><td class="valor">${conv.nombre||'Convenio colectivo del sector'}</td></tr>
      <tr><td class="campo">Ámbito</td><td class="valor">Provincial · Sevilla</td></tr>
    </table>
    <h2>4. Ejercicio fiscal</h2>
    <table><tr><th class="campo">Campo</th><th>Valor a introducir</th></tr>
      <tr><td class="campo">Año fiscal</td><td class="valor">${new Date().getFullYear()}</td></tr>
      <tr><td class="campo">Mes de inicio</td><td class="valor">Enero</td></tr>
    </table>`;

  /* ── Fichas de trabajadores ── */
  const htmlFichaTrabajadores = `
    <h1>Fichas de alta de trabajadores · Nominasol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · ${trabajadores.length} trabajador(es) a registrar</p>
    <div class="nota">Para cada trabajador: <strong>Nominasol → Trabajadores → Nuevo trabajador</strong></div>
    ${trabajadores.length === 0 ? '<p>⚠️ Aún no hay trabajadores asignados en el organigrama. Ve a <strong>Mi empresa → Organigrama</strong> y asigna a los responsables de cada departamento.</p>' :
      trabajadores.map((t, i) => `
      <h2>Trabajador ${i+1}: ${t.nombre}</h2>
      <table><tr><th class="campo">Campo</th><th>Valor a introducir</th></tr>
        <tr><td class="campo">Nombre completo</td><td class="valor highlight">${t.nombre}</td></tr>
        <tr><td class="campo">DNI / NIE</td><td class="valor">Introducir DNI real del alumno (simulación)</td></tr>
        <tr><td class="campo">Nº Afiliación SS</td><td class="valor">Inventar nº de 12 dígitos (simulación)</td></tr>
        <tr><td class="campo">Puesto / Categoría</td><td class="valor">${DEPTS_NOM[t.cargo]||t.cargo}</td></tr>
        <tr><td class="campo">Grupo profesional</td><td class="valor">${t.grupo ? t.grupo.nombre : 'Ver convenio'}</td></tr>
        <tr><td class="campo">Tipo de contrato</td><td class="valor highlight">${t.tipoContrato}</td></tr>
        <tr><td class="campo">Jornada</td><td class="valor">${t.jornada}</td></tr>
        <tr><td class="campo">Salario base mensual</td><td class="valor highlight">${typeof t.salarioBase === 'number' ? t.salarioBase.toFixed(2)+' €' : t.salarioBase}</td></tr>
        <tr><td class="campo">Fecha de alta</td><td class="valor">01/09/${new Date().getFullYear()} (inicio del curso)</td></tr>
        <tr><td class="campo">Grupo de cotización</td><td class="valor">${t.grupo ? 'Grupo '+ t.grupo.id : '—'}</td></tr>
      </table>`).join('')}`;

  /* ── Ficha de nómina (datos variables mes) ── */
  const htmlFichaNomina = `
    <h1>Ficha de nómina mensual · Nominasol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · Mes: Octubre ${new Date().getFullYear()}</p>
    <div class="nota">Introduce los datos en <strong>Nominasol → Nóminas → Calcular nóminas</strong>. Los datos variables son los que cambian cada mes; los fijos los habrás introducido en la ficha de alta del trabajador.</div>
    <h2>Datos fijos (ya en el programa)</h2>
    <table><tr><th>Trabajador</th><th>Salario base</th><th>Contrato</th><th>Jornada</th><th>Grupo cotización</th></tr>
      ${trabajadores.length === 0 ? '<tr><td colspan="5" style="text-align:center;color:#888">Sin trabajadores en el organigrama</td></tr>' :
        trabajadores.map(t=>`<tr>
          <td class="highlight">${t.nombre}</td>
          <td>${typeof t.salarioBase === 'number' ? t.salarioBase.toFixed(2)+' €' : t.salarioBase}</td>
          <td>${t.tipoContrato}</td><td>${t.jornada}</td>
          <td>${t.grupo ? 'Grupo '+t.grupo.id : '—'}</td>
        </tr>`).join('')}
    </table>
    <h2>Datos variables (a introducir para octubre)</h2>
    <table><tr><th>Concepto</th><th>Valor por defecto</th><th>Notas</th></tr>
      <tr><td class="campo">Días trabajados</td><td>23 días laborables</td><td>Octubre ${new Date().getFullYear()} · ajustar si hay festivos</td></tr>
      <tr><td class="campo">Horas ordinarias</td><td>184 h (jornada completa)</td><td>Proporcionar según jornada</td></tr>
      <tr><td class="campo">Horas extraordinarias</td><td>0</td><td>Añadir si procede</td></tr>
      <tr><td class="campo">Retención IRPF</td><td>Ver tabla de tramos del convenio</td><td>Aplicar % según salario anual estimado</td></tr>
      <tr><td class="campo">Cuota obrera SS</td><td>~6,47% s/ base de cotización</td><td>Contingencias comunes: 4,70% · Desempleo: 1,55% · FP: 0,10% · MEI: 0,12%</td></tr>
      <tr><td class="campo">Cuota empresarial SS</td><td>~31,65% s/ base de cotización</td><td>CC: 23,60% · AT/EP: 1,50% · Desempleo: 5,50% · FOGASA: 0,20% · FP: 0,60% · MEI: 0,50%</td></tr>
    </table>
    <h2>Verificación (comparar con cálculo de SimulApp)</h2>
    <div class="nota">Una vez generada la nómina en Nominasol, anota aquí los totales y compáralos con los calculados en la sección RRHH → Nómina de SimulApp. Si hay diferencias, identifica la causa (redondeo, tramos IRPF, etc.).</div>`;

  /* ── Render principal ── */
  const fichas = `
    ${pgFichaBloque('empresa', '🏢', 'Ficha 1 · Datos de empresa', 'Configuración inicial de la empresa en Nominasol',
      pgTablaFicha([
        ['Razón social', d.nombre, false],
        ['CIF / NIF', d.cifProvisional, true],
        ['Domicilio social', d.domicilioSocial, false],
        ['CCC (Código Cuenta Cotización)', d.ccc||'Ver trámite inscripción SS', false],
        ['Delegación TGSS', 'Sevilla · Dirección Provincial', false],
        ['Convenio colectivo', conv.nombre||'Convenio del sector simulado', false],
        ['Año fiscal', new Date().getFullYear(), false]
      ]) + pgRuta('Nominasol → Empresas → Nueva empresa')
      + pgPasos([
          'Abre Nominasol y ve a <strong>Empresa → Nueva empresa</strong>.',
          'En la pestaña <strong>Datos generales</strong>: introduce razón social, CIF y domicilio de la tabla superior.',
          'En la pestaña <strong>Seguridad Social</strong>: introduce el CCC y selecciona la delegación de Sevilla.',
          'En la pestaña <strong>Convenio</strong>: selecciona o crea el convenio del sector.',
          'Haz clic en <strong>Guardar</strong>. La empresa queda activa para generar nóminas.'
        ])
      + pgBtnImprimir(htmlFichaEmpresa, 'Ficha empresa Nominasol'),
      'nominasol')}

    ${pgFichaBloque('trabajadores', '👤', 'Ficha 2 · Alta de trabajadores', `${trabajadores.length} persona(s) en el organigrama · una ficha por cada una`,
      (trabajadores.length === 0
        ? `<div style="padding:12px;color:var(--gris-500);font-size:.85rem">⚠️ Aún no hay trabajadores en el organigrama. Ve a <strong>Mi empresa → Organigrama</strong> y asigna responsables.</div>`
        : trabajadores.map(t => `
          <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--gris-100)">
            <div style="font-weight:600;font-size:.88rem;color:var(--verde-800);margin-bottom:6px">👤 ${t.nombre} · ${DEPTS_NOM[t.cargo]||t.cargo}</div>
            ${pgTablaFicha([
              ['Tipo de contrato', t.tipoContrato, true],
              ['Jornada', t.jornada, false],
              ['Grupo profesional / cotización', t.grupo ? 'Grupo '+t.grupo.id+' · '+t.grupo.nombre : '—', false],
              ['Salario base mensual', typeof t.salarioBase==='number' ? t.salarioBase.toFixed(2)+' €' : t.salarioBase, true],
              ['Complemento antigüedad', t.grupo && t.grupo.complementoAntiguedad ? t.grupo.complementoAntiguedad+' €/año' : '—', false],
              ['Fecha de alta', '01/09/'+new Date().getFullYear(), false]
            ])}
          </div>`).join(''))
      + pgRuta('Nominasol → Trabajadores → Nuevo trabajador')
      + pgPasos([
          'Entra en <strong>Trabajadores → Nuevo trabajador</strong>.',
          'Pestaña <strong>Datos personales</strong>: nombre, DNI y número de afiliación a la SS.',
          'Pestaña <strong>Datos laborales</strong>: tipo de contrato, jornada y fecha de alta (usa la tabla).',
          'Pestaña <strong>Retribución</strong>: introduce el salario base según el grupo profesional del convenio.',
          'Pestaña <strong>SS y IRPF</strong>: selecciona el grupo de cotización de la tabla.',
          'Repite el proceso para cada trabajador del organigrama.'
        ])
      + pgBtnImprimir(htmlFichaTrabajadores, 'Fichas de trabajadores Nominasol'),
      'nominasol')}

    ${pgFichaBloque('nomina-octubre', '💰', 'Ficha 3 · Nómina mensual (datos variables)', 'Datos del mes para calcular la nómina en Nominasol',
      pgTablaFicha([
        ['Mes a calcular', 'Octubre '+new Date().getFullYear(), false],
        ['Días laborables', '23 días', false],
        ['Horas ordinarias (jornada completa)', '184 h', false],
        ['% IRPF general', 'Ver tabla de tramos (según salario anual bruto)', false],
        ['% Cuota obrera SS — CC', '4,70%', false],
        ['% Cuota obrera SS — Desempleo', '1,55%', false],
        ['% Cuota obrera SS — FP + MEI', '0,22%', false],
        ['% Cuota empresarial SS — CC', '23,60%', false],
        ['% Cuota empresarial SS — AT/EP', '1,50% (sector comercio)', false],
        ['% Cuota empresarial SS — Desempleo + otros', '6,30%', false]
      ])
      + pgRuta('Nominasol → Nóminas → Calcular nóminas → Seleccionar mes')
      + pgBtnImprimir(htmlFichaNomina, 'Ficha nómina octubre Nominasol'),
      'nominasol')}`;

  const tareasAuto    = tareas.filter(t => t.autoGenerada);
  const tareasEstaticas = tareas.filter(t => !t.autoGenerada);
  const pendientesAuto = tareasAuto.filter(t => t.estado === 'pendiente').length;

  const tareasHtml = `
    ${tareasAuto.length > 0 ? `
    <div style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:.6rem">
        <span style="font-size:.78rem;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.05em">📧 Desde el buzón</span>
        ${pendientesAuto > 0 ? `<span style="font-size:.65rem;padding:1px 8px;border-radius:20px;background:#ef4444;color:white;font-weight:700">${pendientesAuto} pendiente${pendientesAuto>1?'s':''}</span>` : '<span style="font-size:.65rem;color:var(--verde-600);font-weight:600">✓ Al día</span>'}
        <div style="flex:1;height:1px;background:var(--gris-100)"></div>
      </div>
      ${tareasAuto.map(t => pgTareaCard(t, 'nominasol')).join('')}
    </div>` : ''}
    ${tareasEstaticas.length > 0 ? `
    <div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:.6rem">
        <span style="font-size:.78rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em">📋 Tareas del módulo</span>
        <div style="flex:1;height:1px;background:var(--gris-100)"></div>
      </div>
      ${tareasEstaticas.map(t => pgTareaCard(t, 'nominasol')).join('')}
    </div>` : ''}
  `;

  return `
  ${pgCabecera('💼', 'RRHH · Nominasol', 'Optativa AN5542 · RA1-RA3 · Gestión de personal y nóminas', 'AN5542', 'nominasol')}
  <div style="background:var(--verde-50);border:1px solid var(--verde-200);border-radius:var(--radio-md);padding:10px 14px;margin-bottom:16px;font-size:.82rem;color:var(--verde-800)">
    💡 <strong>Cómo funciona:</strong> Las fichas de datos se generan automáticamente a partir de lo que ya tienes en "Mi empresa". Abre cada ficha, introduce los datos en Nominasol y registra tu evidencia en la pestaña "Tareas y evidencias".
  </div>
  ${s.tab === 'fichas' ? fichas : tareasHtml}`;
}

/* ============================================================
   MÓDULO CONTASOL
   ============================================================ */
function vistaContasol() {
  sincronizarTareasDesdeCorreos();
  const d    = EMPRESA_STATE.datos;
  const pe   = EMPRESA_STATE.planEmpresa || {};
  const inv  = (pe.ap7 && Array.isArray(pe.ap7.inversion)) ? pe.ap7.inversion : [];
  const tx   = EMPRESA_STATE.mercado.transacciones || [];
  const s    = pgS('contasol');

  const TAREAS_CON = [
    { id:'con-t1', ra:'RA2a', titulo:'Configurar empresa en Contasol',
      desc:'Crea la empresa en Contasol con los datos identificativos y el ejercicio contable.',
      instrucciones:'Contasol → Empresa → Nueva empresa. Completa los datos de la ficha generada.',
      conFicha:true, fichaId:'empresa' },
    { id:'con-t2', ra:'RA2b', titulo:'Revisar y adaptar el plan de cuentas',
      desc:'Comprueba que las cuentas del PGC necesarias para tu actividad están activas en Contasol.',
      instrucciones:'Contasol → Contabilidad → Plan de cuentas. Revisa los grupos 1-7 y activa o crea las subcuentas específicas de tu sector.',
      conFicha:true, fichaId:'cuentas' },
    { id:'con-t3', ra:'RA2c', titulo:'Registrar los asientos de constitución',
      desc:'Introduce en el libro diario los asientos de la aportación de capital social y los gastos de constitución.',
      instrucciones:'Contasol → Contabilidad → Libro Diario → Nuevo asiento. Usa la ficha de asientos de constitución.',
      conFicha:true, fichaId:'asientos-const' },
    { id:'con-t4', ra:'RA2c', titulo:'Registrar asientos de las transacciones de mercado',
      desc:'Introduce los asientos de compras y ventas derivados del mercado intergrupal.',
      instrucciones:'Contasol → Contabilidad → Libro Diario. Una ficha por cada transacción completada en el mercado.',
      conFicha:true, fichaId:'asientos-mercado' },
    { id:'con-t5', ra:'RA2d', titulo:'Obtener el balance de situación provisional',
      desc:'Genera el balance de comprobación tras introducir los asientos del trimestre.',
      instrucciones:'Contasol → Informes → Balance de sumas y saldos. Exporta a PDF como evidencia.',
      conFicha:false },
    { id:'con-t6', ra:'RA2e', titulo:'Cuadrar la tesorería (libro de caja)',
      desc:'Comprueba que los movimientos de caja coinciden con los pagos y cobros registrados.',
      instrucciones:'Contasol → Tesorería → Libro de caja. Verifica que el saldo coincide con tu plan de tesorería.',
      conFicha:false },
    { id:'con-t7', ra:'RA2f', titulo:'Obtener la cuenta de resultados provisional',
      desc:'Genera la cuenta de pérdidas y ganancias al cierre del trimestre.',
      instrucciones:'Contasol → Informes → Cuenta de Resultados. Compara el resultado con el previsto en el plan financiero.',
      conFicha:false }
  ];
  pgInitTareas('contasol', TAREAS_CON);
  const tareas = window.PROG_STATE.contasol.tareas;

  /* ── Cuentas sugeridas por sector ── */
  const sector = (d.sector||'').toLowerCase();
  const cuentasBase = [
    ['100','Capital social','Representa las aportaciones de los socios. Acreedor al constituir la empresa.'],
    ['102','Capital no exigido','Parte del capital social pendiente de desembolso, si la hay.'],
    ['113','Reservas voluntarias','Beneficios no distribuidos de ejercicios anteriores.'],
    ['129','Resultado del ejercicio','Cuenta de cierre: recoge el beneficio o pérdida del año.'],
    ['170','Deudas con entidades de crédito LP','Préstamos bancarios a más de un año.'],
    ['400','Proveedores','Deudas con proveedores de bienes y servicios. Acreedora.'],
    ['430','Clientes','Derechos de cobro por ventas. Deudora.'],
    ['470','HP deudora por IVA soportado','IVA soportado en compras, recuperable de Hacienda.'],
    ['472','HP acreedora por IVA repercutido','IVA repercutido en ventas, a ingresar en Hacienda.'],
    ['476','Organismos de SS acreedores','Cuotas a pagar a la Seguridad Social.'],
    ['570','Caja','Efectivo disponible en caja. Deudora.'],
    ['572','Banco c/c','Saldo en cuentas corrientes bancarias. Deudora.'],
    ['600','Compras de mercaderías','Adquisición de bienes para reventa.'],
    ['621','Arrendamientos y cánones','Alquiler del local o de equipos.'],
    ['628','Suministros','Electricidad, agua, internet, etc.'],
    ['640','Sueldos y salarios','Retribución bruta del personal.'],
    ['642','Seguridad Social a cargo empresa','Cuota patronal de cotización.'],
    ['700','Ventas de mercaderías','Ingresos por venta del producto/servicio principal.'],
    ['706','Descuentos sobre ventas','Rappels y descuentos concedidos a clientes.']
  ];
  const cuentasSector = sector.includes('tecnolog') || sector.includes('inform')
    ? [['206','Aplicaciones informáticas','Software y licencias. Amortizable.'],['629','Otros servicios','Mantenimiento, hosting, dominios.']]
    : sector.includes('hostelería') || sector.includes('restaur')
    ? [['300','Materias primas y otros aprovisionamientos','Ingredientes y materiales de cocina.'],['621','Arrendamientos','Local y equipos de hostelería.']]
    : [['300','Mercaderías','Existencias del producto que comercializa la empresa.'],['610','Variación de existencias','Ajuste por diferencia de inventario.']];

  const todasCuentas = [...cuentasBase, ...cuentasSector];

  /* ── Asientos de constitución ── */
  const capSocial = (typeof capitalTotalSocios === 'function') ? (capitalTotalSocios() || 0) : 0;
  const gastosConst = Array.isArray(inv) ? ((inv.find(i=>i.id==='i7')||{importe:0}).importe || 0) : 0;

  /* ── Asientos de mercado ── */
  const txCompletadas = tx.filter(t => t.estado === 'completada');

  const htmlFichaEmpresa = `
    <h1>Ficha de configuración · Contasol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · Generada desde SimulApp</p>
    <div class="nota">Introduce estos datos en <strong>Contasol → Empresa → Nueva empresa</strong></div>
    <h2>1. Datos de la empresa</h2>
    <table><tr><th class="campo">Campo</th><th>Valor a introducir</th></tr>
      <tr><td class="campo">Razón social</td><td class="valor highlight">${d.nombre||'—'}</td></tr>
      <tr><td class="campo">CIF / NIF</td><td class="valor highlight">${d.cifProvisional||'—'}</td></tr>
      <tr><td class="campo">Domicilio social</td><td class="valor">${d.domicilioSocial||'—'}</td></tr>
      <tr><td class="campo">Municipio / Provincia</td><td class="valor">Cantillana · Sevilla</td></tr>
      <tr><td class="campo">Código postal</td><td class="valor">41430</td></tr>
      <tr><td class="campo">Actividad / Sector</td><td class="valor">${d.sector||'—'}</td></tr>
      <tr><td class="campo">Forma jurídica</td><td class="valor">${d.formaJuridica||'SL'}</td></tr>
    </table>
    <h2>2. Ejercicio contable</h2>
    <table><tr><th class="campo">Campo</th><th>Valor a introducir</th></tr>
      <tr><td class="campo">Fecha inicio ejercicio</td><td class="valor highlight">01/01/${new Date().getFullYear()}</td></tr>
      <tr><td class="campo">Fecha cierre ejercicio</td><td class="valor highlight">31/12/${new Date().getFullYear()}</td></tr>
      <tr><td class="campo">Plan General Contable</td><td class="valor">PGC 2007 (PYMES)</td></tr>
      <tr><td class="campo">Moneda</td><td class="valor">Euro (EUR)</td></tr>
      <tr><td class="campo">Régimen de IVA</td><td class="valor">Régimen General</td></tr>
    </table>`;

  const htmlFichaCuentas = `
    <h1>Plan de cuentas sugerido · Contasol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · Sector: ${d.sector||'—'} · PGC 2007 PYMES</p>
    <div class="nota">Estas son las cuentas que vas a necesitar según tu actividad. En <strong>Contasol → Contabilidad → Plan de cuentas</strong> verifica que están activas o créalas si no existen.</div>
    <table><tr><th style="width:12%">Cuenta</th><th style="width:35%">Descripción</th><th>Uso en tu empresa</th></tr>
      ${todasCuentas.map(([num,nom,uso])=>`<tr><td class="highlight">${num}</td><td>${nom}</td><td style="font-size:11px;color:#565c64">${uso}</td></tr>`).join('')}
    </table>`;

  const htmlFichaAsientosConst = `
    <h1>Asientos de constitución · Contasol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · CIF: ${d.cifProvisional||'—'} · Fecha constitución: ${new Date().toLocaleDateString('es-ES')}</p>
    <div class="nota">Introduce estos asientos en <strong>Contasol → Contabilidad → Libro Diario → Nuevo asiento</strong></div>
    <h2>Asiento 1 · Aportación del capital social</h2>
    <table><tr><th>Cuenta</th><th>Descripción</th><th style="text-align:right">Debe (€)</th><th style="text-align:right">Haber (€)</th></tr>
      <tr><td class="highlight">572</td><td>Banco c/c (depósito capital)</td><td style="text-align:right;font-weight:600">${capSocial > 0 ? capSocial.toLocaleString('es-ES') : '3.000,00'}</td><td style="text-align:right">—</td></tr>
      <tr><td class="highlight">100</td><td>Capital social</td><td style="text-align:right">—</td><td style="text-align:right;font-weight:600">${capSocial > 0 ? capSocial.toLocaleString('es-ES') : '3.000,00'}</td></tr>
    </table>
    <p style="font-size:11px;color:#767d87;margin-bottom:16px">Concepto: "Aportación de los socios al capital social según escritura de constitución"</p>
    ${gastosConst > 0 ? `
    <h2>Asiento 2 · Gastos de constitución</h2>
    <table><tr><th>Cuenta</th><th>Descripción</th><th style="text-align:right">Debe (€)</th><th style="text-align:right">Haber (€)</th></tr>
      <tr><td class="highlight">623</td><td>Servicios de profesionales independientes (notario, registro)</td><td style="text-align:right;font-weight:600">${gastosConst.toLocaleString('es-ES')}</td><td style="text-align:right">—</td></tr>
      <tr><td class="highlight">472</td><td>HP deudora IVA soportado (21%)</td><td style="text-align:right;font-weight:600">${(gastosConst*0.21).toFixed(2)}</td><td style="text-align:right">—</td></tr>
      <tr><td class="highlight">572</td><td>Banco c/c (pago)</td><td style="text-align:right">—</td><td style="text-align:right;font-weight:600">${(gastosConst*1.21).toFixed(2)}</td></tr>
    </table>` : `<div class="nota">⚠️ No se han introducido gastos de constitución en el plan financiero. Ve a Plan de empresa → Financiación y completa el apartado de inversión inicial.</div>`}`;

  const htmlFichaAsientosMercado = `
    <h1>Asientos del mercado intergrupal · Contasol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · ${txCompletadas.length} transacción(es) completada(s)</p>
    <div class="nota">Introduce estos asientos en <strong>Contasol → Contabilidad → Libro Diario → Nuevo asiento</strong>. Un asiento por cada transacción.</div>
    ${txCompletadas.length === 0
      ? '<div style="padding:16px;color:#888;text-align:center">Sin transacciones completadas en el mercado todavía. Cuando cierres operaciones con otras empresas, aparecerán aquí los asientos a registrar.</div>'
      : txCompletadas.map((t, i) => {
          const esVenta  = t.tipo === 'venta' || t.vendedor === d.nombre;
          const base     = t.baseImponible || (t.total ? (t.total / 1.21) : 0);
          const iva      = base * 0.21;
          const total    = base + iva;
          return `
          <h2>Transacción ${i+1}: ${t.concepto||t.titulo||'Operación comercial'}</h2>
          <p style="font-size:11px;color:#767d87;margin-bottom:8px">Fecha: ${t.fecha||'—'} · ${esVenta ? 'VENTA a '+( t.aGrupo||t.comprador||'empresa compradora') : 'COMPRA a '+(t.deGrupo||t.proveedor||'empresa proveedora')}</p>
          <table><tr><th>Cuenta</th><th>Descripción</th><th style="text-align:right">Debe (€)</th><th style="text-align:right">Haber (€)</th></tr>
          ${esVenta ? `
            <tr><td class="highlight">430</td><td>Clientes</td><td style="text-align:right;font-weight:600">${total.toFixed(2)}</td><td>—</td></tr>
            <tr><td class="highlight">700</td><td>Ventas de mercaderías / servicios</td><td>—</td><td style="text-align:right;font-weight:600">${base.toFixed(2)}</td></tr>
            <tr><td class="highlight">477</td><td>HP acreedora — IVA repercutido (21%)</td><td>—</td><td style="text-align:right;font-weight:600">${iva.toFixed(2)}</td></tr>
          ` : `
            <tr><td class="highlight">600</td><td>Compras de mercaderías / aprovisionamientos</td><td style="text-align:right;font-weight:600">${base.toFixed(2)}</td><td>—</td></tr>
            <tr><td class="highlight">472</td><td>HP deudora — IVA soportado (21%)</td><td style="text-align:right;font-weight:600">${iva.toFixed(2)}</td><td>—</td></tr>
            <tr><td class="highlight">400</td><td>Proveedores</td><td>—</td><td style="text-align:right;font-weight:600">${total.toFixed(2)}</td></tr>
          `}
          </table>
          <p style="font-size:11px;color:#767d87;margin-bottom:16px">Base imponible: ${base.toFixed(2)} € · IVA 21%: ${iva.toFixed(2)} € · <strong>Total: ${total.toFixed(2)} €</strong></p>`;
        }).join('')}`;

  const fichas = `
    ${pgFichaBloque('empresa', '🏢', 'Ficha 1 · Datos de empresa', 'Configuración inicial del ejercicio contable en Contasol',
      pgTablaFicha([
        ['Razón social', d.nombre, false],
        ['CIF / NIF', d.cifProvisional, true],
        ['Domicilio', d.domicilioSocial, false],
        ['Inicio ejercicio', '01/01/'+new Date().getFullYear(), false],
        ['Cierre ejercicio', '31/12/'+new Date().getFullYear(), false],
        ['Plan contable', 'PGC 2007 PYMES', false],
        ['Régimen IVA', 'Régimen General', false]
      ]) + pgRuta('Contasol → Empresa → Nueva empresa')
      + pgPasos([
          'En Contasol ve a <strong>Empresa → Nueva empresa</strong>.',
          'Introduce la razón social y el CIF/NIF de la tabla.',
          'Selecciona el <strong>Plan General Contable PGC 2007 PYMES</strong>.',
          'Introduce las fechas de inicio y cierre del ejercicio (01/01 – 31/12).',
          'Marca el <strong>régimen de IVA general</strong> y guarda.',
          'La empresa queda configurada: ya puedes introducir asientos.'
        ])
      + pgBtnImprimir(htmlFichaEmpresa, 'Ficha empresa Contasol'),
      'contasol')}

    ${pgFichaBloque('cuentas', '📑', 'Ficha 2 · Plan de cuentas sugerido', `${todasCuentas.length} cuentas PGC según tu sector y actividad`,
      `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">
        <thead><tr>
          <th style="padding:6px 10px;background:var(--verde-50);text-align:left;font-size:.78rem;color:var(--verde-800);border:1px solid var(--verde-100);width:12%">Cuenta</th>
          <th style="padding:6px 10px;background:var(--verde-50);text-align:left;font-size:.78rem;color:var(--verde-800);border:1px solid var(--verde-100)">Descripción</th>
          <th style="padding:6px 10px;background:var(--verde-50);text-align:left;font-size:.78rem;color:var(--verde-800);border:1px solid var(--verde-100)">Uso</th>
        </tr></thead><tbody>
          ${todasCuentas.map(([num,nom,uso])=>`
          <tr>
            <td style="padding:5px 10px;border:1px solid var(--gris-100);font-weight:700;color:var(--verde-700);font-family:var(--fuente-mono)">${num}</td>
            <td style="padding:5px 10px;border:1px solid var(--gris-100);font-size:.82rem">${nom}</td>
            <td style="padding:5px 10px;border:1px solid var(--gris-100);font-size:.75rem;color:var(--gris-600)">${uso}</td>
          </tr>`).join('')}
        </tbody></table></div>`
      + pgRuta('Contasol → Contabilidad → Plan de cuentas')
      + `<div style="font-size:.78rem;color:var(--gris-500);margin:6px 0 4px">Comprueba que estas cuentas existen en Contasol. Si alguna no aparece, créala manualmente con el mismo código y descripción.</div>`
      + pgBtnImprimir(htmlFichaCuentas, 'Plan de cuentas Contasol'),
      'contasol')}

    ${pgFichaBloque('asientos-const', '📒', 'Ficha 3 · Asientos de constitución', 'Capital social y gastos de primer establecimiento',
      pgTablaFicha([
        ['Capital social aportado', capSocial > 0 ? capSocial.toLocaleString('es-ES')+' €' : '⚠️ Sin datos — completar plan financiero', capSocial>0],
        ['Asiento: Debe (572 Banco)', capSocial > 0 ? capSocial.toLocaleString('es-ES')+' €' : '—', false],
        ['Asiento: Haber (100 Capital social)', capSocial > 0 ? capSocial.toLocaleString('es-ES')+' €' : '—', false],
        ['Gastos constitución (623)', gastosConst > 0 ? gastosConst.toLocaleString('es-ES')+' €' : '0 €', false],
        ['IVA soportado gastos (472)', gastosConst > 0 ? (gastosConst*0.21).toFixed(2)+' €' : '0 €', false]
      ]) + pgRuta('Contasol → Contabilidad → Libro Diario → Nuevo asiento')
      + pgPasos([
          'En Contasol ve a <strong>Contabilidad → Libro Diario → Nuevo asiento</strong>.',
          'Introduce la fecha (fecha de escritura de constitución).',
          'Añade la primera línea: cuenta <strong>572</strong> en el Debe con el importe del capital.',
          'Añade la segunda línea: cuenta <strong>100</strong> en el Haber con el mismo importe.',
          'Escribe el concepto y guarda. Comprueba que el asiento cuadra (Debe = Haber).',
          'Si hay gastos de constitución, repite el proceso con las cuentas 623 / 472 / 572.'
        ])
      + pgBtnImprimir(htmlFichaAsientosConst, 'Asientos constitución Contasol'),
      'contasol')}

    ${pgFichaBloque('asientos-mercado', '🔄', 'Ficha 4 · Asientos del mercado intergrupal',
      txCompletadas.length > 0 ? `${txCompletadas.length} transacción(es) completada(s) → asientos de compra/venta` : 'Sin transacciones completadas todavía',
      (txCompletadas.length === 0
        ? `<div style="padding:12px;color:var(--gris-500);font-size:.85rem">Completa transacciones en el mercado intergrupal y aquí aparecerán automáticamente los asientos contables a introducir en Contasol.</div>`
        : txCompletadas.map((t, i) => {
            const esVenta = t.tipo==='venta' || t.vendedor===d.nombre;
            const base    = t.baseImponible || (t.total ? t.total/1.21 : 0);
            const iva     = base*0.21;
            const total   = base+iva;
            return `<div style="margin-bottom:12px;padding:10px;background:var(--${esVenta?'verde':'gris'}-50);border-radius:var(--radio-sm);border:1px solid var(--${esVenta?'verde':'gris'}-100)">
              <div style="font-weight:600;font-size:.85rem;margin-bottom:6px">${esVenta?'💚 VENTA':'🔵 COMPRA'} · ${t.concepto||t.titulo||'Transacción #'+(i+1)}</div>
              ${pgTablaFicha(esVenta ? [
                ['Cuenta 430 — Clientes (Debe)', total.toFixed(2)+' €', true],
                ['Cuenta 700 — Ventas (Haber)', base.toFixed(2)+' €', false],
                ['Cuenta 477 — IVA repercutido 21% (Haber)', iva.toFixed(2)+' €', false]
              ] : [
                ['Cuenta 600 — Compras (Debe)', base.toFixed(2)+' €', true],
                ['Cuenta 472 — IVA soportado 21% (Debe)', iva.toFixed(2)+' €', false],
                ['Cuenta 400 — Proveedores (Haber)', total.toFixed(2)+' €', false]
              ])}
            </div>`;
          }).join(''))
      + pgRuta('Contasol → Contabilidad → Libro Diario → Nuevo asiento')
      + `<div style="font-size:.78rem;color:var(--gris-500);margin:6px 0 4px">Un asiento por cada transacción. Verifica que Debe = Haber antes de guardar. Las facturas de IVA se liquidan trimestralmente compensando las cuentas 472 y 477.</div>`
      + pgBtnImprimir(htmlFichaAsientosMercado, 'Asientos mercado Contasol'),
      'contasol')}`;

  const tareasAuto_con    = tareas.filter(t => t.autoGenerada);
  const tareasEstaticas_con = tareas.filter(t => !t.autoGenerada);
  const pendientesAuto_con = tareasAuto_con.filter(t => t.estado === 'pendiente').length;

  const tareasHtml = `
    ${tareasAuto_con.length > 0 ? `
    <div style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:.6rem">
        <span style="font-size:.78rem;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.05em">📧 Desde el buzón</span>
        ${pendientesAuto_con > 0 ? `<span style="font-size:.65rem;padding:1px 8px;border-radius:20px;background:#ef4444;color:white;font-weight:700">${pendientesAuto_con} pendiente${pendientesAuto_con>1?'s':''}</span>` : '<span style="font-size:.65rem;color:var(--verde-600);font-weight:600">✓ Al día</span>'}
        <div style="flex:1;height:1px;background:var(--gris-100)"></div>
      </div>
      ${tareasAuto_con.map(t => pgTareaCard(t, 'contasol')).join('')}
    </div>` : ''}
    ${tareasEstaticas_con.length > 0 ? `
    <div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:.6rem">
        <span style="font-size:.78rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em">📋 Tareas del módulo</span>
        <div style="flex:1;height:1px;background:var(--gris-100)"></div>
      </div>
      ${tareasEstaticas_con.map(t => pgTareaCard(t, 'contasol')).join('')}
    </div>` : ''}
  `;

  return `
  ${pgCabecera('📊', 'Contabilidad · Contasol', 'Optativa AN5542 · RA2 · Registro contable y estados financieros', 'AN5542 RA2', 'contasol')}
  <div style="background:var(--verde-50);border:1px solid var(--verde-200);border-radius:var(--radio-md);padding:10px 14px;margin-bottom:16px;font-size:.82rem;color:var(--verde-800)">
    💡 <strong>Cómo funciona:</strong> Los asientos se generan a partir de tu plan financiero y las transacciones del mercado intergrupal. Cuando actualices datos en "Plan de empresa" o cierres operaciones de mercado, esta ficha se actualiza sola.
  </div>
  ${s.tab === 'fichas' ? fichas : tareasHtml}`;
}

/* ============================================================
   MÓDULO FACTUSOL
   ============================================================ */
function vistaFactusol() {
  sincronizarTareasDesdeCorreos();
  const d   = EMPRESA_STATE.datos;
  const tx  = EMPRESA_STATE.mercado.transacciones || [];
  const s   = pgS('factusol');

  const TAREAS_FAC = [
    { id:'fac-t1', ra:'RA1a', titulo:'Configurar empresa en Factusol',
      desc:'Crea y configura la empresa en Factusol con los datos de la ficha generada.',
      instrucciones:'Factusol → Empresa → Configuración. Copia los datos de la ficha generada automáticamente.',
      conFicha:true, fichaId:'empresa' },
    { id:'fac-t2', ra:'RA1b', titulo:'Dar de alta a clientes y proveedores',
      desc:'Registra en Factusol las empresas con las que has interactuado en el mercado intergrupal.',
      instrucciones:'Factusol → Clientes → Nuevo cliente (o Proveedores → Nuevo proveedor). Usa la ficha generada con los datos de cada empresa del mercado.',
      conFicha:true, fichaId:'clientes' },
    { id:'fac-t3', ra:'RA1c', titulo:'Emitir la primera factura de venta',
      desc:'Crea en Factusol la factura de la primera venta cerrada en el mercado intergrupal.',
      instrucciones:'Factusol → Facturación → Facturas emitidas → Nueva factura. Usa la ficha de factura generada.',
      conFicha:true, fichaId:'facturas' },
    { id:'fac-t4', ra:'RA1d', titulo:'Registrar facturas de compra recibidas',
      desc:'Introduce en Factusol las facturas de compra de las transacciones en las que fuiste comprador.',
      instrucciones:'Factusol → Facturación → Facturas recibidas → Nueva factura. Usa la ficha de facturas de compra.',
      conFicha:true, fichaId:'facturas' },
    { id:'fac-t5', ra:'RA2a', titulo:'Gestionar presupuesto y pedido',
      desc:'Crea un presupuesto para una empresa del mercado y conviértelo en pedido y luego en factura.',
      instrucciones:'Factusol → Ventas → Presupuestos → Nuevo presupuesto → Convertir en pedido → Convertir en albarán → Facturar.',
      conFicha:false },
    { id:'fac-t6', ra:'RA2b', titulo:'Emitir el listado de clientes con saldo',
      desc:'Genera el informe de posición de clientes para ver quién te debe dinero.',
      instrucciones:'Factusol → Informes → Clientes → Extracto de clientes. Guarda el PDF como evidencia.',
      conFicha:false },
    { id:'fac-t7', ra:'RA2c', titulo:'Obtener el libro de registro de IVA',
      desc:'Genera el libro de registro de facturas emitidas y recibidas para la declaración trimestral.',
      instrucciones:'Factusol → Informes → IVA → Libro de registro. Exporta ambos libros (emitidas y recibidas).',
      conFicha:false }
  ];
  pgInitTareas('factusol', TAREAS_FAC);
  const tareas = window.PROG_STATE.factusol.tareas;

  /* ── Clientes y proveedores del mercado ── */
  const grupos = window.GRUPOS_SIMULADOS || [
    {id:'g1', nombre:'Empresa Alfa SL', cif:'B-12345678', sector:'Comercio', email:'alfa@simulapp.es'},
    {id:'g2', nombre:'Beta Servicios SL', cif:'B-23456789', sector:'Servicios', email:'beta@simulapp.es'},
    {id:'g3', nombre:'Gamma Tech SL', cif:'B-34567890', sector:'Tecnología', email:'gamma@simulapp.es'},
    {id:'g4', nombre:'Delta Distribución SL', cif:'B-45678901', sector:'Logística', email:'delta@simulapp.es'}
  ];

  const txVentas  = tx.filter(t => t.estado==='completada' && (t.tipo==='venta' || t.vendedor===d.nombre));
  const txCompras = tx.filter(t => t.estado==='completada' && (t.tipo==='compra' || t.comprador===d.nombre));
  const todosContactos = [...new Map(tx.filter(t=>t.estado==='completada').map(t => {
    const nombre = t.vendedor === d.nombre ? t.comprador : t.vendedor;
    const grupo  = grupos.find(g => g.nombre === nombre) || {nombre: nombre||'Empresa intergrupal', cif:'B-'+Math.floor(10000000+Math.random()*90000000), sector:'—', email:'contacto@simulapp.es'};
    return [nombre, grupo];
  })).values()];

  const nFactura = () => 'F-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*900+100));

  /* ── HTML imprimible empresa ── */
  const htmlFichaEmpresa = `
    <h1>Ficha de configuración · Factusol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · Generada desde SimulApp</p>
    <div class="nota">Introduce estos datos en <strong>Factusol → Empresa → Configuración</strong></div>
    <h2>1. Datos generales</h2>
    <table><tr><th class="campo">Campo</th><th>Valor</th></tr>
      <tr><td class="campo">Razón social</td><td class="valor highlight">${d.nombre||'—'}</td></tr>
      <tr><td class="campo">CIF / NIF</td><td class="valor highlight">${d.cifProvisional||'—'}</td></tr>
      <tr><td class="campo">Domicilio</td><td class="valor">${d.domicilioSocial||'—'}</td></tr>
      <tr><td class="campo">Municipio / CP</td><td class="valor">Cantillana · 41430 · Sevilla</td></tr>
      <tr><td class="campo">Teléfono</td><td class="valor">Introducir teléfono de contacto</td></tr>
      <tr><td class="campo">Email</td><td class="valor">info@${(d.nombre||'empresa').toLowerCase().replace(/\s+/g,'')}.es</td></tr>
    </table>
    <h2>2. Datos fiscales y facturación</h2>
    <table><tr><th class="campo">Campo</th><th>Valor</th></tr>
      <tr><td class="campo">Régimen de IVA</td><td class="valor highlight">Régimen General</td></tr>
      <tr><td class="campo">Tipo de IVA principal</td><td class="valor">21% (general)</td></tr>
      <tr><td class="campo">Serie de facturación</td><td class="valor">F-${new Date().getFullYear()}-0001</td></tr>
      <tr><td class="campo">Forma de pago por defecto</td><td class="valor">Transferencia bancaria · 30 días</td></tr>
      <tr><td class="campo">Divisa</td><td class="valor">Euro (EUR)</td></tr>
    </table>`;

  /* ── HTML imprimible clientes/proveedores ── */
  const htmlFichaClientes = `
    <h1>Ficha de clientes y proveedores · Factusol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · ${todosContactos.length} empresa(s) del mercado intergrupal</p>
    <div class="nota">Para cada empresa: <strong>Factusol → Clientes → Nuevo cliente</strong> (o Proveedores → Nuevo proveedor)</div>
    ${todosContactos.length === 0
      ? '<div class="nota">⚠️ Sin transacciones completadas todavía. Cierra operaciones en el mercado intergrupal para que aparezcan los contactos aquí.</div>'
      : todosContactos.map((g, i) => `
        <h2>${i+1}. ${g.nombre}</h2>
        <table><tr><th class="campo">Campo</th><th>Valor</th></tr>
          <tr><td class="campo">Nombre / Razón social</td><td class="valor highlight">${g.nombre}</td></tr>
          <tr><td class="campo">CIF / NIF</td><td class="valor highlight">${g.cif}</td></tr>
          <tr><td class="campo">Sector</td><td class="valor">${g.sector}</td></tr>
          <tr><td class="campo">Email de contacto</td><td class="valor">${g.email}</td></tr>
          <tr><td class="campo">Forma de pago</td><td class="valor">Transferencia · 30 días</td></tr>
          <tr><td class="campo">Tipo de IVA</td><td class="valor">21% (general)</td></tr>
        </table>`).join('')}`;

  /* ── HTML imprimible facturas ── */
  const contadorFac = { v: 1, c: 1 };
  const htmlFichaFacturas = `
    <h1>Fichas de facturas · Factusol</h1>
    <p class="meta">Empresa: ${d.nombre||'—'} · CIF: ${d.cifProvisional||'—'}</p>
    <div class="nota">Introduce cada factura en <strong>Factusol → Facturación → Facturas emitidas / recibidas → Nueva factura</strong></div>
    ${txVentas.length > 0 ? `<h2>Facturas emitidas (ventas)</h2>` : ''}
    ${txVentas.map(t => {
      const base = t.baseImponible || (t.total ? t.total/1.21 : 0);
      const iva = base*0.21; const total = base+iva;
      const num = 'FV-'+new Date().getFullYear()+'-'+String(contadorFac.v++).padStart(3,'0');
      return `<table style="margin-bottom:16px"><tr><th class="campo">Campo</th><th>Valor</th></tr>
        <tr><td class="campo">Número de factura</td><td class="valor highlight">${num}</td></tr>
        <tr><td class="campo">Fecha</td><td class="valor">${t.fecha||new Date().toLocaleDateString('es-ES')}</td></tr>
        <tr><td class="campo">Cliente (destinatario)</td><td class="valor highlight">${t.comprador||t.aGrupo||'—'}</td></tr>
        <tr><td class="campo">Concepto</td><td class="valor">${t.concepto||t.titulo||'Venta de mercancías'}</td></tr>
        <tr><td class="campo">Base imponible</td><td class="valor">${base.toFixed(2)} €</td></tr>
        <tr><td class="campo">IVA (21%)</td><td class="valor">${iva.toFixed(2)} €</td></tr>
        <tr><td class="campo">Total factura</td><td class="valor highlight">${total.toFixed(2)} €</td></tr>
        <tr><td class="campo">Forma de cobro</td><td class="valor">Transferencia · 30 días desde fecha factura</td></tr>
      </table>`;}).join('')}
    ${txCompras.length > 0 ? `<h2>Facturas recibidas (compras)</h2>` : ''}
    ${txCompras.map(t => {
      const base = t.baseImponible || (t.total ? t.total/1.21 : 0);
      const iva = base*0.21; const total = base+iva;
      const num = 'FC-'+new Date().getFullYear()+'-'+String(contadorFac.c++).padStart(3,'0');
      return `<table style="margin-bottom:16px"><tr><th class="campo">Campo</th><th>Valor</th></tr>
        <tr><td class="campo">Número de factura (proveedor)</td><td class="valor highlight">${num}</td></tr>
        <tr><td class="campo">Fecha</td><td class="valor">${t.fecha||new Date().toLocaleDateString('es-ES')}</td></tr>
        <tr><td class="campo">Proveedor (emisor)</td><td class="valor highlight">${t.vendedor||t.deGrupo||'—'}</td></tr>
        <tr><td class="campo">Concepto</td><td class="valor">${t.concepto||t.titulo||'Compra de mercancías'}</td></tr>
        <tr><td class="campo">Base imponible</td><td class="valor">${base.toFixed(2)} €</td></tr>
        <tr><td class="campo">IVA (21%)</td><td class="valor">${iva.toFixed(2)} €</td></tr>
        <tr><td class="campo">Total factura</td><td class="valor highlight">${total.toFixed(2)} €</td></tr>
      </table>`;}).join('')}
    ${txVentas.length===0 && txCompras.length===0 ? '<div class="nota">⚠️ Sin transacciones completadas todavía.</div>' : ''}`;

  /* ── Fichas en pantalla ── */
  const fichas = `
    ${pgFichaBloque('empresa', '🏢', 'Ficha 1 · Datos de empresa', 'Configuración inicial de Factusol para tu empresa',
      pgTablaFicha([
        ['Razón social', d.nombre, false],
        ['CIF / NIF', d.cifProvisional, true],
        ['Domicilio', d.domicilioSocial, false],
        ['Municipio / CP', 'Cantillana · 41430 · Sevilla', false],
        ['Régimen IVA', 'Régimen General · 21%', false],
        ['Serie facturación', 'F-'+new Date().getFullYear()+'-0001', false],
        ['Forma de pago', 'Transferencia bancaria · 30 días', false]
      ]) + pgRuta('Factusol → Empresa → Configuración')
      + pgPasos([
          'Abre Factusol y ve a <strong>Empresa → Configuración</strong>.',
          'Pestaña <strong>Datos generales</strong>: introduce razón social, CIF, domicilio y contacto.',
          'Pestaña <strong>Facturación</strong>: configura la serie (F-' + new Date().getFullYear() + '-0001), forma de pago y tipo de IVA por defecto (21%).',
          'Guarda la configuración. Ya puedes crear clientes, proveedores y facturas.'
        ])
      + pgBtnImprimir(htmlFichaEmpresa, 'Ficha empresa Factusol'),
      'factusol')}

    ${pgFichaBloque('clientes', '🤝', 'Ficha 2 · Clientes y proveedores', `${todosContactos.length} empresa(s) del mercado intergrupal a registrar`,
      todosContactos.length === 0
        ? `<div style="padding:12px;color:var(--gris-500);font-size:.85rem">Sin transacciones en el mercado todavía. Cierra operaciones intergrupal para ver aquí los datos de tus clientes y proveedores.</div>`
        : todosContactos.map(g => `
          <div style="margin-bottom:12px;padding:10px;background:var(--gris-50);border-radius:var(--radio-sm);border:1px solid var(--gris-100)">
            <div style="font-weight:600;font-size:.85rem;color:var(--verde-800);margin-bottom:6px">🏢 ${g.nombre}</div>
            ${pgTablaFicha([
              ['CIF / NIF', g.cif, true],
              ['Sector', g.sector, false],
              ['Email', g.email, false],
              ['Tipo IVA', '21% (general)', false],
              ['Forma de pago', 'Transferencia · 30 días', false]
            ])}
          </div>`).join('')
      + pgRuta('Factusol → Clientes → Nuevo cliente / Proveedores → Nuevo proveedor')
      + `<div style="font-size:.78rem;color:var(--gris-500);margin:6px 0 4px">Introduce los datos de cada empresa exactamente como aparecen en la ficha. El CIF es clave: si no coincide con el de la factura Factusol avisará de discrepancia.</div>`
      + pgBtnImprimir(htmlFichaClientes, 'Clientes y proveedores Factusol'),
      'factusol')}

    ${pgFichaBloque('facturas', '🧾', 'Ficha 3 · Facturas del mercado intergrupal',
      (txVentas.length+txCompras.length)>0 ? `${txVentas.length} emitida(s) · ${txCompras.length} recibida(s)` : 'Sin transacciones completadas todavía',
      (txVentas.length+txCompras.length) === 0
        ? `<div style="padding:12px;color:var(--gris-500);font-size:.85rem">Completa transacciones en el mercado intergrupal para ver aquí los datos de cada factura.</div>`
        : txVentas.map((t,i) => {
            const base=t.baseImponible||(t.total?t.total/1.21:0);
            const iva=base*0.21; const total=base+iva;
            return `<div style="background:var(--verde-50);border:1px solid var(--verde-100);border-radius:var(--radio-sm);padding:10px;margin-bottom:10px">
              <div style="font-weight:600;font-size:.82rem;color:var(--verde-800);margin-bottom:6px">💚 FACTURA EMITIDA · FV-${new Date().getFullYear()}-${String(i+1).padStart(3,'0')}</div>
              ${pgTablaFicha([
                ['Cliente', t.comprador||t.aGrupo||'—', true],
                ['Concepto', t.concepto||t.titulo||'Venta', false],
                ['Base imponible', base.toFixed(2)+' €', false],
                ['IVA 21%', iva.toFixed(2)+' €', false],
                ['Total', total.toFixed(2)+' €', true]
              ])}
            </div>`;}).join('') +
          txCompras.map((t,i) => {
            const base=t.baseImponible||(t.total?t.total/1.21:0);
            const iva=base*0.21; const total=base+iva;
            return `<div style="background:var(--gris-50);border:1px solid var(--gris-100);border-radius:var(--radio-sm);padding:10px;margin-bottom:10px">
              <div style="font-weight:600;font-size:.82rem;color:var(--gris-800);margin-bottom:6px">🔵 FACTURA RECIBIDA · FC-${new Date().getFullYear()}-${String(i+1).padStart(3,'0')}</div>
              ${pgTablaFicha([
                ['Proveedor', t.vendedor||t.deGrupo||'—', true],
                ['Concepto', t.concepto||t.titulo||'Compra', false],
                ['Base imponible', base.toFixed(2)+' €', false],
                ['IVA 21%', iva.toFixed(2)+' €', false],
                ['Total', total.toFixed(2)+' €', true]
              ])}
            </div>`;}).join('')
      + pgRuta('Factusol → Facturación → Facturas emitidas / Facturas recibidas → Nueva factura')
      + pgPasos([
          '<strong>Facturas emitidas (ventas):</strong> Facturación → Facturas emitidas → Nueva factura.',
          'Selecciona el cliente de la lista (debe estar dado de alta en el paso anterior).',
          'Introduce el número de factura, fecha y concepto de la ficha.',
          'Añade la línea de detalle: descripción, cantidad, precio unitario. Factusol calcula el IVA automáticamente.',
          'Verifica que el total coincide con la ficha y guarda.',
          '<strong>Facturas recibidas (compras):</strong> Facturación → Facturas recibidas → Nueva factura. Mismo proceso con el proveedor.'
        ])
      + pgBtnImprimir(htmlFichaFacturas, 'Facturas Factusol'),
      'factusol')}`;

  const tareasAuto_fac    = tareas.filter(t => t.autoGenerada);
  const tareasEstaticas_fac = tareas.filter(t => !t.autoGenerada);
  const pendientesAuto_fac = tareasAuto_fac.filter(t => t.estado === 'pendiente').length;

  const tareasHtml = `
    ${tareasAuto_fac.length > 0 ? `
    <div style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:.6rem">
        <span style="font-size:.78rem;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.05em">📧 Desde el buzón</span>
        ${pendientesAuto_fac > 0 ? `<span style="font-size:.65rem;padding:1px 8px;border-radius:20px;background:#ef4444;color:white;font-weight:700">${pendientesAuto_fac} pendiente${pendientesAuto_fac>1?'s':''}</span>` : '<span style="font-size:.65rem;color:var(--verde-600);font-weight:600">✓ Al día</span>'}
        <div style="flex:1;height:1px;background:var(--gris-100)"></div>
      </div>
      ${tareasAuto_fac.map(t => pgTareaCard(t, 'factusol')).join('')}
    </div>` : ''}
    ${tareasEstaticas_fac.length > 0 ? `
    <div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:.6rem">
        <span style="font-size:.78rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em">📋 Tareas del módulo</span>
        <div style="flex:1;height:1px;background:var(--gris-100)"></div>
      </div>
      ${tareasEstaticas_fac.map(t => pgTareaCard(t, 'factusol')).join('')}
    </div>` : ''}
  `;

  return `
  ${pgCabecera('🧾', 'Comercial · Factusol', 'Optativa AN5542 · RA1-RA2 · Facturación y gestión comercial', 'AN5542 RA1-2', 'factusol')}
  <div style="background:var(--verde-50);border:1px solid var(--verde-200);border-radius:var(--radio-md);padding:10px 14px;margin-bottom:16px;font-size:.82rem;color:var(--verde-800)">
    💡 <strong>Cómo funciona:</strong> Cada transacción cerrada en el mercado intergrupal genera automáticamente la ficha de factura correspondiente. A más operaciones de mercado, más datos de facturación tendrás aquí.
  </div>
  ${s.tab === 'fichas' ? fichas : tareasHtml}`; 
}
function vistaDocumental() {
  return `<div class="seccion-header"><div><h2>Gestión documental 📁</h2><p>AN5542 RA3 · Archivo digital de la empresa</p></div></div>${vistaProxima('Clasificación, digitalización, gestión de documentos y flujos de trabajo')}`;
}
function vistaDossier() {
  const pe  = EMPRESA_STATE.planEmpresa  || {};
  const d   = EMPRESA_STATE.datos        || {};
  const emp = EMPRESA_STATE.emprendimiento || {};
  const tr  = EMPRESA_STATE.tramites     || [];
  const def = EMPRESA_STATE.defensa      || {};
  const ge  = EMPRESA_STATE.gestion      || {};
  const ev  = EMPRESA_STATE.evaluacion   || {};

  if (!window.DOSSIER_STATE) window.DOSSIER_STATE = { vista: 'indice' }; // 'indice' | 'previsu'
  const ds = window.DOSSIER_STATE;

  /* ── Helpers ─────────────────────────────── */
  const v = s => s && s.trim ? s.trim() : '';
  const filled = s => v(s).length > 0;
  const pct = calcProgresoPlan ? calcProgresoPlan() : 0;
  const año = new Date().getFullYear();

  /* ── Índice de secciones con estado ── */
  const SECCIONES = [
    {
      id:'portada', icono:'📄', titulo:'Portada e identificación',
      ra:['RA1','RA2'],
      campos: [
        { label:'Denominación social',   val: d.nombre,              ok: filled(d.nombre) },
        { label:'Nombre comercial',      val: pe.ap1?.nombreComercial, ok: filled(pe.ap1?.nombreComercial) },
        { label:'Lema / tagline',        val: pe.ap1?.lema,           ok: filled(pe.ap1?.lema) },
        { label:'CIF provisional',       val: d.cifProvisional,       ok: filled(d.cifProvisional) },
        { label:'Domicilio social',      val: d.domicilioSocial,      ok: filled(d.domicilioSocial) },
        { label:'Sector de actividad',   val: d.sector,               ok: filled(d.sector) },
        { label:'Equipo promotor',       val: (pe.ap2?.promotores||[]).map(p=>p.nombre).filter(Boolean).join(', '), ok: (pe.ap2?.promotores||[]).length > 0 },
      ]
    },
    {
      id:'ap1', icono:'💡', titulo:'1. Presentación y resumen ejecutivo',
      ra:['RA1'],
      campos: [
        { label:'Resumen ejecutivo',     val: pe.ap1?.resumenEjecutivo, ok: filled(pe.ap1?.resumenEjecutivo) },
        { label:'Misión',                val: pe.ap1?.mision,           ok: filled(pe.ap1?.mision) },
        { label:'Visión',                val: pe.ap1?.vision,           ok: filled(pe.ap1?.vision) },
        { label:'Valores',               val: pe.ap1?.valores,          ok: filled(pe.ap1?.valores) },
      ]
    },
    {
      id:'ap2', icono:'👥', titulo:'2. Equipo promotor',
      ra:['RA1','RA2'],
      campos: [
        { label:'Motivación',            val: pe.ap2?.motivacion,      ok: filled(pe.ap2?.motivacion) },
        { label:'Capacitación',          val: pe.ap2?.capacitacion,    ok: filled(pe.ap2?.capacitacion) },
        { label:'Aportaciones al proyecto', val: pe.ap2?.aportaciones, ok: filled(pe.ap2?.aportaciones) },
        { label:'Nº promotores',         val: (pe.ap2?.promotores||[]).length + ' personas', ok: (pe.ap2?.promotores||[]).length > 0 },
      ]
    },
    {
      id:'ap3', icono:'🏭', titulo:'3. Descripción del negocio',
      ra:['RA1','RA2'],
      campos: [
        { label:'Descripción de la actividad', val: pe.ap3?.descripcionActividad, ok: filled(pe.ap3?.descripcionActividad) },
        { label:'Productos / Servicios',       val: pe.ap3?.productosServicios,   ok: filled(pe.ap3?.productosServicios) },
        { label:'Propuesta de valor',          val: pe.ap3?.propuestaValor,       ok: filled(pe.ap3?.propuestaValor) },
        { label:'Ventaja competitiva',         val: pe.ap3?.ventajaCompetitiva,   ok: filled(pe.ap3?.ventajaCompetitiva) },
        { label:'Modelo de negocio (Canvas)',  val: emp.canvas?.propuestaValor,   ok: Object.values(emp.canvas||{}).some(filled) },
      ]
    },
    {
      id:'ap4', icono:'🔍', titulo:'4. Análisis del entorno y mercado',
      ra:['RA2'],
      campos: [
        { label:'Análisis del sector',     val: pe.ap4?.analisisSector,    ok: filled(pe.ap4?.analisisSector) },
        { label:'DAFO — Fortalezas',       val: pe.ap4?.dafoF,             ok: filled(pe.ap4?.dafoF) },
        { label:'DAFO — Debilidades',      val: pe.ap4?.dafoD,             ok: filled(pe.ap4?.dafoD) },
        { label:'DAFO — Oportunidades',    val: pe.ap4?.dafoO,             ok: filled(pe.ap4?.dafoO) },
        { label:'DAFO — Amenazas',         val: pe.ap4?.dafoA,             ok: filled(pe.ap4?.dafoA) },
        { label:'Mercado objetivo',        val: pe.ap4?.mercadoObjetivo,   ok: filled(pe.ap4?.mercadoObjetivo) },
        { label:'Competidores analizados', val: (pe.ap4?.competidores||[]).length + ' competidores', ok: (pe.ap4?.competidores||[]).length > 0 },
      ]
    },
    {
      id:'ap5', icono:'⚖️', titulo:'5. Plan jurídico-fiscal',
      ra:['RA3','RA4','RA5'],
      campos: [
        { label:'Forma jurídica',          val: pe.ap5?.formaJuridica,       ok: filled(pe.ap5?.formaJuridica) },
        { label:'Justificación',           val: pe.ap5?.justificacionForma,  ok: filled(pe.ap5?.justificacionForma) },
        { label:'Trámites completados',    val: tr.filter(t=>t.estado==='completado').length + ' de ' + tr.length, ok: tr.filter(t=>t.estado==='completado').length > 3 },
        { label:'Regímenes fiscales',      val: pe.ap5?.regimenesFiscales,   ok: filled(pe.ap5?.regimenesFiscales) },
        { label:'Obligaciones periódicas', val: pe.ap5?.obligacionesPeriodicas, ok: filled(pe.ap5?.obligacionesPeriodicas) },
      ]
    },
    {
      id:'ap6', icono:'👔', titulo:'6. Plan de organización y RRHH',
      ra:['RA3','RA6'],
      campos: [
        { label:'Estructura organizativa', val: pe.ap6?.estructuraOrg,   ok: filled(pe.ap6?.estructuraOrg) },
        { label:'Puestos de trabajo',      val: (pe.ap6?.puestos||[]).length + ' puestos definidos', ok: (pe.ap6?.puestos||[]).length > 0 || Object.values(d.organigrama||{}).some(p=>p.alumno?.trim()) },
        { label:'Política de RRHH',        val: pe.ap6?.politicaRRHH,    ok: filled(pe.ap6?.politicaRRHH) },
        { label:'Plan de formación',       val: pe.ap6?.planFormacion,   ok: filled(pe.ap6?.planFormacion) },
      ]
    },
    {
      id:'ap7', icono:'💰', titulo:'7. Plan económico-financiero',
      ra:['RA4'],
      campos: [
        { label:'Inversión inicial',       val: (() => { const a7=pe.ap7; if(!a7||!Array.isArray(a7.inversion)) return '0 €'; const t=a7.inversion.reduce((s,i)=>s+(i.importe||0),0); return t>0 ? t.toLocaleString('es-ES')+'  €' : '0 €'; })(), ok: (() => { const a7=pe.ap7; return a7&&Array.isArray(a7.inversion)&&a7.inversion.some(i=>i.importe>0); })() },
        { label:'Capital social',          val: (typeof capitalTotalSocios==='function' ? capitalTotalSocios() : 0).toLocaleString('es-ES') + ' €', ok: typeof capitalTotalSocios==='function' && capitalTotalSocios() > 0 },
        { label:'Previsión de ventas',     val: (() => { const v=pe.ap7?.ventas?.productos||[]; return v.some(p=>p.precioUnitario>0) ? v.filter(p=>p.precioUnitario>0).length+' producto(s) con precio' : 'Sin datos'; })(), ok: (pe.ap7?.ventas?.productos||[]).some(p=>p.precioUnitario>0) },
        { label:'Balance previsional',     val: pe.ap7?.balance?.capitalSocial > 0 ? 'Cumplimentado' : 'Pendiente', ok: pe.ap7?.balance?.capitalSocial > 0 || pe.ap7?.balance?.tesoreria > 0 },
        { label:'Cuenta de resultados',    val: pe.ap7?.cuenta?.a1?.ventas > 0 ? 'Año 1: '+pe.ap7.cuenta.a1.ventas.toLocaleString('es-ES')+' € ventas' : 'Pendiente', ok: pe.ap7?.cuenta?.a1?.ventas > 0 },
      ]
    },
    {
      id:'ap8', icono:'📣', titulo:'8. Plan de marketing y comunicación',
      ra:['RA2'],
      campos: [
        { label:'Producto',                val: pe.ap8?.producto,      ok: filled(pe.ap8?.producto) },
        { label:'Precio',                  val: pe.ap8?.precio,        ok: filled(pe.ap8?.precio) },
        { label:'Distribución',            val: pe.ap8?.distribucion,  ok: filled(pe.ap8?.distribucion) },
        { label:'Comunicación',            val: pe.ap8?.comunicacion,  ok: filled(pe.ap8?.comunicacion) },
      ]
    },
    {
      id:'evidencias', icono:'📎', titulo:'Evidencias de gestión operativa',
      ra:['RA6'],
      campos: [
        { label:'Tareas evaluadas',        val: (ge.tareas||[]).filter(t=>t.estado==='evaluada').length + ' tareas', ok: (ge.tareas||[]).filter(t=>t.estado==='evaluada').length > 0 },
        { label:'Actas de reunión',        val: (emp.reuniones||[]).filter(r=>r.firmada).length + ' firmadas de ' + (emp.reuniones||[]).length, ok: (emp.reuniones||[]).filter(r=>r.firmada).length > 0 },
        { label:'Decisiones documentadas', val: (emp.decisiones||[]).length + ' decisiones', ok: (emp.decisiones||[]).length > 0 },
        { label:'Transacciones mercado',   val: (EMPRESA_STATE.mercado?.transacciones||[]).filter(t=>t.estado==='completada').length + ' completadas', ok: (EMPRESA_STATE.mercado?.transacciones||[]).filter(t=>t.estado==='completada').length > 0 },
      ]
    },
    {
      id:'defensa', icono:'🎤', titulo:'Defensa pública y autoevaluación',
      ra:['RA1','RA2','RA3','RA4','RA5','RA6'],
      campos: [
        { label:'Elevator pitch preparado', val: filled(def.pitch?.gancho) ? 'Sí' : 'No', ok: filled(def.pitch?.gancho) },
        { label:'Presentación final',       val: (def.presentacion?.bloques||[]).filter(b=>filled(b.contenido)).length + '/' + (def.presentacion?.bloques||[]).length + ' bloques', ok: (def.presentacion?.bloques||[]).filter(b=>filled(b.contenido)).length >= 4 },
        { label:'Preguntas del tribunal',   val: (def.presentacion?.preguntas||[]).filter(p=>filled(p.respuesta)).length + ' preparadas', ok: (def.presentacion?.preguntas||[]).filter(p=>filled(p.respuesta)).length > 0 },
      ]
    },
  ];

  /* ── Progreso por sección ── */
  function progSeccion(sec) {
    const total  = sec.campos.length;
    const ok     = sec.campos.filter(c => c.ok).length;
    return { ok, total, pct: total > 0 ? Math.round(ok/total*100) : 0 };
  }

  /* ── HTML del índice ── */
  function renderIndice() {
    const totalCampos = SECCIONES.reduce((s,sec) => s+sec.campos.length, 0);
    const okCampos    = SECCIONES.reduce((s,sec) => s+sec.campos.filter(c=>c.ok).length, 0);
    const pctGlobal   = Math.round(okCampos/totalCampos*100);

    const seccionesHtml = SECCIONES.map(sec => {
      const p = progSeccion(sec);
      const color = p.pct >= 80 ? 'var(--verde-500)' : p.pct >= 40 ? '#f59e0b' : 'var(--gris-300)';
      return `
      <div class="card" style="margin-bottom:8px;padding:12px 16px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.3rem;width:28px;text-align:center">${sec.icono}</span>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-weight:600;font-size:.87rem;color:var(--gris-900)">${sec.titulo}</span>
              ${sec.ra.map(r=>`<span class="ra-chip">${r}</span>`).join('')}
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;height:5px;background:var(--gris-100);border-radius:3px;overflow:hidden">
                <div style="width:${p.pct}%;height:100%;background:${color};border-radius:3px;transition:width .4s"></div>
              </div>
              <span style="font-size:.72rem;color:var(--gris-500);white-space:nowrap">${p.ok}/${p.total}</span>
            </div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:5px">
              ${sec.campos.map(c => `<span title="${c.label}" style="display:inline-flex;align-items:center;gap:3px;font-size:.68rem;padding:1px 6px;border-radius:10px;
                background:${c.ok?'var(--verde-50)':'var(--gris-50)'};color:${c.ok?'var(--verde-700)':'var(--gris-400)'};
                border:1px solid ${c.ok?'var(--verde-200)':'var(--gris-200)'}">
                ${c.ok?'✓':'○'} ${c.label.length>22?c.label.slice(0,22)+'…':c.label}
              </span>`).join('')}
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:1.1rem;font-weight:700;color:${color}">${p.pct}%</div>
          </div>
        </div>
      </div>`;
    }).join('');

    return `
    <!-- Barra de progreso global -->
    <div class="card" style="margin-bottom:16px;background:var(--verde-900);color:white">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="flex:1">
          <div style="font-size:.75rem;color:var(--verde-300);margin-bottom:4px;text-transform:uppercase;letter-spacing:.08em">Dossier 3160 · Completitud global</div>
          <div style="height:10px;background:rgba(255,255,255,.15);border-radius:5px;overflow:hidden">
            <div style="width:${pctGlobal}%;height:100%;background:var(--verde-400);border-radius:5px;transition:width .5s"></div>
          </div>
          <div style="font-size:.72rem;color:var(--verde-300);margin-top:4px">${okCampos} de ${totalCampos} campos completados</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:2.2rem;font-weight:700;color:${pctGlobal>=80?'var(--verde-300)':pctGlobal>=50?'#fbbf24':'#f87171'}">${pctGlobal}%</div>
          <div style="font-size:.68rem;color:var(--verde-300)">${pctGlobal>=80?'Listo para entregar':pctGlobal>=50?'En buen camino':'Necesita trabajo'}</div>
        </div>
      </div>
    </div>

    <!-- Acciones -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <button class="btn-accion" style="font-size:.82rem;padding:8px 16px"
        onclick="window.DOSSIER_STATE.vista='previsu';renderVista('dossier')">
        👁️ Vista previa del dossier
      </button>
      <button class="btn-secundario" style="font-size:.82rem;padding:8px 16px"
        onclick="dosierImprimir()">
        🖨️ Exportar PDF completo
      </button>
      ${pctGlobal < 60 ? `<span style="font-size:.78rem;color:#92400e;padding:8px 10px;background:#fef3c7;border-radius:var(--radio-md)">⚠️ Completa más secciones antes de exportar (${pctGlobal}%)</span>` : ''}
    </div>

    <!-- Lista de secciones -->
    ${seccionesHtml}`;
  }

  /* ── HTML del dossier imprimible ── */
  function htmlDossier() {
    const ap1 = pe.ap1 || {}; const ap2 = pe.ap2 || {}; const ap3 = pe.ap3 || {};
    const ap4 = pe.ap4 || {}; const ap5 = pe.ap5 || {}; const ap6 = pe.ap6 || {};
    const ap7 = pe.ap7 || {}; const ap8 = pe.ap8 || {};
    const canvas = emp.canvas || {};
    const promotores = ap2.promotores || [];
    const competidores = ap4.competidores || [];
    const reuniones = emp.reuniones || [];
    const decisiones = emp.decisiones || [];
    const objetivos = emp.objetivos || [];
    const tareasEv = (ge.tareas||[]).filter(t=>t.estado==='evaluada');
    const tramComp = tr.filter(t=>t.estado==='completado');
    const inv = Array.isArray(ap7.inversion) ? ap7.inversion : [];
    const fin = Array.isArray(ap7.financiacion) ? ap7.financiacion : [];
    const gasF = ap7.gastos?.fijos || []; const gasV = ap7.gastos?.variables || [];
    const bal  = ap7.balance || {}; const cta = ap7.cuenta || {};
    const totalInv = inv.reduce((s,i)=>s+(i.importe||0),0);
    const capitalS = typeof capitalTotalSocios==='function' ? capitalTotalSocios() : 0;

    const sec = (num,icono,titulo,contenido) =>
      `<div class="seccion"><h2><span class="sec-num">${num}</span> ${icono} ${titulo}</h2>${contenido}</div>`;
    const campo = (lbl,val) => val && val.toString().trim()
      ? `<div class="campo"><span class="campo-lbl">${lbl}</span><span class="campo-val">${val}</span></div>` : '';
    const bloque = (titulo,val) => val && val.toString().trim()
      ? `<div class="bloque"><div class="bloque-titulo">${titulo}</div><div class="bloque-val">${val}</div></div>` : '';
    const tablaHTML = (headers, rows) =>
      `<table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const chip = txt => `<span class="chip">${txt}</span>`;
    const ok   = txt => `<span class="ok">✓ ${txt}</span>`;

    return `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Dossier 3160 · ${d.nombre||'Empresa'} · ${año}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1a1c1e;background:#fff}
.portada{min-height:280px;background:linear-gradient(135deg,#0a2e1a 0%,#1a6535 100%);color:#fff;padding:40px;display:flex;flex-direction:column;justify-content:space-between;break-after:page}
.portada h1{font-size:28px;font-weight:800;margin-bottom:8px;letter-spacing:-.5px}
.portada .subtitulo{font-size:13px;color:#a8e6be;letter-spacing:.12em;text-transform:uppercase;margin-bottom:24px}
.portada .meta{font-size:12px;color:#a8e6be;line-height:2}
.portada .badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:20px;padding:3px 12px;font-size:11px;margin:2px}
.toc{padding:28px 40px;break-after:page}
.toc h2{font-size:15px;font-weight:700;color:#134a28;margin-bottom:14px;border-bottom:2px solid #d4f4e0;padding-bottom:6px}
.toc-item{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px dotted #e5e7eb;font-size:12px}
.toc-item .titulo{color:#1a1c1e;font-weight:500}
.toc-item .estado{font-size:11px;color:#6b7280}
.toc-item .ok-toc{color:#16a34a;font-weight:600;font-size:11px}
.seccion{padding:24px 40px;break-inside:avoid-column}
.seccion+.seccion{border-top:2px solid #edfaf3}
h2{font-size:15px;font-weight:700;color:#134a28;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.sec-num{background:#134a28;color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
h3{font-size:13px;font-weight:600;color:#217a3e;margin:12px 0 6px}
.campo{display:flex;gap:8px;margin-bottom:5px;align-items:flex-start}
.campo-lbl{font-size:11px;font-weight:600;color:#6b7280;width:160px;flex-shrink:0;padding-top:1px}
.campo-val{font-size:12px;color:#1a1c1e;line-height:1.5;flex:1}
.bloque{background:#f7fdf9;border-left:3px solid #2a9d52;padding:8px 12px;border-radius:0 4px 4px 0;margin:8px 0}
.bloque-titulo{font-size:10px;font-weight:700;color:#217a3e;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px}
.bloque-val{font-size:12px;color:#1a1c1e;line-height:1.6;white-space:pre-wrap}
.dafo{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.dafo-cell{padding:8px 10px;border-radius:4px;font-size:11px}
.dafo-cell .dafo-titulo{font-weight:700;font-size:10px;text-transform:uppercase;margin-bottom:4px}
.dafo-F{background:#dcfce7;color:#14532d}
.dafo-D{background:#fee2e2;color:#7f1d1d}
.dafo-O{background:#dbeafe;color:#1e3a8a}
.dafo-A{background:#fef3c7;color:#78350f}
table{width:100%;border-collapse:collapse;font-size:11px;margin:8px 0}
th{background:#edfaf3;text-align:left;padding:5px 8px;font-weight:600;color:#134a28;border:1px solid #d4f4e0}
td{padding:5px 8px;border:1px solid #edf0f4;vertical-align:top}
td.num{text-align:right;font-weight:600}
.chip{display:inline-block;background:#edfaf3;color:#134a28;border:1px solid #a8e6be;border-radius:10px;padding:1px 8px;font-size:10px;margin:2px}
.ok{color:#16a34a;font-weight:600;font-size:11px}
.aviso{background:#fef9c3;border:1px solid #fde68a;border-radius:4px;padding:6px 10px;font-size:11px;color:#92400e;margin:6px 0}
.canvas-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}
.canvas-cell{background:#f7fdf9;border:1px solid #d4f4e0;border-radius:4px;padding:7px 9px}
.canvas-cell .c-titulo{font-size:9px;font-weight:700;color:#217a3e;text-transform:uppercase;margin-bottom:3px}
.canvas-cell .c-val{font-size:11px;color:#1a1c1e;line-height:1.5;white-space:pre-wrap}
.acta{background:#f7f9fb;border:1px solid #e5e7eb;border-radius:4px;padding:8px 10px;margin-bottom:6px;break-inside:avoid}
.acta-head{display:flex;justify-content:space-between;margin-bottom:4px}
.acta-tipo{font-size:10px;font-weight:600;color:#217a3e;text-transform:uppercase}
.acta-fecha{font-size:10px;color:#9ca3af}
.decision-item{border-left:3px solid #2a9d52;padding:4px 8px;margin-bottom:5px;font-size:11px}
.decision-titulo{font-weight:600;color:#1a1c1e;margin-bottom:2px}
.decision-dec{color:#217a3e;font-weight:500}
.footer{margin-top:20px;border-top:1px solid #e5e7eb;padding-top:8px;font-size:10px;color:#9ca3af;display:flex;justify-content:space-between}
.page-break{break-before:page}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>

<!-- PORTADA -->
<div class="portada">
  <div>
    <div class="subtitulo">Módulo 3160 · Proyecto Intermodular · IES Cantillana</div>
    <h1>${d.nombre||'Proyecto Empresarial'}</h1>
    <div style="font-size:13px;color:#d4f4e0;margin-top:6px">${v(pe.ap1?.nombreComercial)||''} ${v(pe.ap1?.lema)?'· "'+pe.ap1.lema+'"':''}</div>
    <div style="margin-top:16px">
      ${(promotores.length > 0 ? promotores : [{nombre:'Equipo promotor'}]).map(p=>`<span class="badge">👤 ${p.nombre||'Promotor'}</span>`).join(' ')}
    </div>
  </div>
  <div class="meta">
    ${d.cifProvisional?`<div>CIF: ${d.cifProvisional}</div>`:''}
    ${d.domicilioSocial?`<div>📍 ${d.domicilioSocial}</div>`:''}
    ${d.sector?`<div>Sector: ${d.sector}</div>`:''}
    <div style="margin-top:8px;font-size:11px;color:#6fcf8f">Generado el ${new Date().toLocaleDateString('es-ES')} · SimulApp v24</div>
  </div>
</div>

<!-- ÍNDICE -->
<div class="toc">
  <h2>Índice de contenidos</h2>
  ${SECCIONES.map((s,i) => {
    const p = progSeccion(s);
    return `<div class="toc-item">
      <span class="titulo">${s.icono} ${s.titulo}</span>
      <span class="${p.ok===p.total?'ok-toc':'estado'}">${p.ok===p.total?'✓ Completo':p.ok+'/'+p.total+' campos'}</span>
    </div>`;
  }).join('')}
</div>

<!-- SECCIÓN 1: RESUMEN EJECUTIVO -->
<div class="seccion">
  <h2><span class="sec-num">1</span> 💡 Presentación y resumen ejecutivo</h2>
  ${bloque('Resumen ejecutivo', ap1.resumenEjecutivo)}
  ${bloque('Misión', ap1.mision)}
  ${bloque('Visión', ap1.vision)}
  ${ap1.valores ? `<h3>Valores</h3><p style="font-size:12px;line-height:1.6;color:#1a1c1e">${ap1.valores}</p>` : '<div class="aviso">⚠️ Valores pendientes de rellenar</div>'}
</div>

<!-- SECCIÓN 2: EQUIPO PROMOTOR -->
<div class="seccion">
  <h2><span class="sec-num">2</span> 👥 Equipo promotor</h2>
  ${promotores.length > 0
    ? tablaHTML(['Nombre','Rol / Cargo','Aportación principal'],
        promotores.map(p=>[p.nombre||'—', p.cargo||'Promotor/a', p.aportacion||'—']))
    : '<div class="aviso">⚠️ Sin promotores registrados — ir a Plan de empresa → Apartado 2</div>'}
  ${bloque('Motivación del equipo', ap2.motivacion)}
  ${bloque('Capacitación y experiencia', ap2.capacitacion)}
  ${bloque('Aportaciones al proyecto', ap2.aportaciones)}
</div>

<!-- SECCIÓN 3: NEGOCIO Y CANVAS -->
<div class="seccion">
  <h2><span class="sec-num">3</span> 🏭 Descripción del negocio</h2>
  ${bloque('Descripción de la actividad', ap3.descripcionActividad)}
  ${bloque('Productos y servicios', ap3.productosServicios)}
  ${bloque('Propuesta de valor', ap3.propuestaValor)}
  ${bloque('Ventaja competitiva', ap3.ventajaCompetitiva)}
  ${bloque('Modelo de negocio', ap3.modeloNegocio)}
  ${Object.values(canvas).some(v=>v&&v.trim()) ? `
  <h3>Business Model Canvas</h3>
  <div class="canvas-grid">
    ${[['Propuesta de valor',canvas.propuestaValor],['Segmentos de clientes',canvas.segmentosClientes],['Canales',canvas.canales],
       ['Relaciones con clientes',canvas.relacionesClientes],['Fuentes de ingresos',canvas.fuentesIngresos],['Recursos clave',canvas.recursosClaves],
       ['Actividades clave',canvas.actividadesClaves],['Socios clave',canvas.sociosClave],['Estructura de costes',canvas.estructuraCostes]]
      .map(([t,v])=>`<div class="canvas-cell"><div class="c-titulo">${t}</div><div class="c-val">${v||'—'}</div></div>`).join('')}
  </div>` : ''}
</div>

<!-- SECCIÓN 4: ENTORNO Y MERCADO -->
<div class="seccion page-break">
  <h2><span class="sec-num">4</span> 🔍 Análisis del entorno y mercado</h2>
  ${bloque('Análisis del sector', ap4.analisisSector)}
  ${bloque('Mercado objetivo', ap4.mercadoObjetivo)}
  ${(ap4.dafoF||ap4.dafoD||ap4.dafoO||ap4.dafoA) ? `
  <h3>Análisis DAFO</h3>
  <div class="dafo">
    <div class="dafo-cell dafo-F"><div class="dafo-titulo">Fortalezas</div>${ap4.dafoF||'—'}</div>
    <div class="dafo-cell dafo-D"><div class="dafo-titulo">Debilidades</div>${ap4.dafoD||'—'}</div>
    <div class="dafo-cell dafo-O"><div class="dafo-titulo">Oportunidades</div>${ap4.dafoO||'—'}</div>
    <div class="dafo-cell dafo-A"><div class="dafo-titulo">Amenazas</div>${ap4.dafoA||'—'}</div>
  </div>` : ''}
  ${competidores.length > 0 ? `
  <h3>Análisis de competidores (${competidores.length})</h3>
  ${tablaHTML(['Competidor','Fortalezas','Debilidades','Precio relativo'],
    competidores.map(c=>[c.nombre||'—',c.fortalezas||'—',c.debilidades||'—',c.precioRelativo||'—']))}` : ''}
  ${bloque('Clientes potenciales', ap4.clientesPotenciales)}
</div>

<!-- SECCIÓN 5: JURÍDICO-FISCAL -->
<div class="seccion">
  <h2><span class="sec-num">5</span> ⚖️ Plan jurídico-fiscal</h2>
  ${campo('Forma jurídica', ap5.formaJuridica)}
  ${bloque('Justificación de la forma jurídica', ap5.justificacionForma)}
  ${bloque('Regímenes fiscales aplicables', ap5.regimenesFiscales)}
  ${bloque('Obligaciones periódicas', ap5.obligacionesPeriodicas)}
  ${tramComp.length > 0 ? `
  <h3>Trámites de constitución completados (${tramComp.length}/${tr.length})</h3>
  ${tablaHTML(['Trámite','Organismo','Notas'],
    tramComp.map(t=>[t.nombre||t.id,t.organismo||'—',t.notas||'—']))}` : '<div class="aviso">⚠️ Sin trámites de constitución completados todavía</div>'}
</div>

<!-- SECCIÓN 6: RRHH -->
<div class="seccion">
  <h2><span class="sec-num">6</span> 👔 Plan de organización y RRHH</h2>
  ${bloque('Estructura organizativa', ap6.estructuraOrg)}
  ${(() => {
    const org = d.organigrama || {};
    const DEPTS = {direccion:'Dirección',rrhh:'Administración/RRHH',comercial:'Comercial',contabilidad:'Contabilidad y Finanzas',fiscal:'Fiscal y Legal'};
    const rows = Object.entries(DEPTS).map(([k,nom]) => {
      const p = org[k] || {};
      return [nom, p.alumno||'—', p.tipoContrato||'—', p.jornada||'—'];
    });
    return `<h3>Organigrama de puestos</h3>${tablaHTML(['Departamento','Responsable','Tipo contrato','Jornada'],rows)}`;
  })()}
  ${bloque('Política de RRHH', ap6.politicaRRHH)}
  ${bloque('Plan de formación', ap6.planFormacion)}
</div>

<!-- SECCIÓN 7: PLAN ECONÓMICO-FINANCIERO -->
<div class="seccion page-break">
  <h2><span class="sec-num">7</span> 💰 Plan económico-financiero</h2>

  <h3>7.1 Inversión inicial${totalInv>0?' — Total: '+totalInv.toLocaleString('es-ES')+' €':''}</h3>
  ${inv.filter(i=>i.importe>0).length > 0
    ? tablaHTML(['Concepto','Categoría','Importe (€)','Amort. (años)'],
        inv.filter(i=>i.importe>0).map(i=>[i.concepto,i.categoria,(i.importe||0).toLocaleString('es-ES'),i.amortizacion||'—']))
    : '<div class="aviso">⚠️ Sin datos de inversión inicial</div>'}

  <h3>7.1b Fuentes de financiación${capitalS>0?' — Capital: '+capitalS.toLocaleString('es-ES')+' €':''}</h3>
  ${fin.filter(f=>f.importe>0).length > 0
    ? tablaHTML(['Fuente','Tipo','Importe (€)','Interés %','Plazo (años)'],
        fin.filter(f=>f.importe>0).map(f=>[f.fuente,f.tipo,(f.importe||0).toLocaleString('es-ES'),f.interes||0,f.plazo||0]))
    : '<div class="aviso">⚠️ Sin fuentes de financiación definidas</div>'}

  ${gasF.filter(g=>g.importe>0).length > 0 ? `
  <h3>7.3 Previsión de gastos fijos (mensuales)</h3>
  ${tablaHTML(['Concepto','Importe mensual (€)'],
    gasF.filter(g=>g.importe>0).map(g=>[g.concepto,(g.importe||0).toLocaleString('es-ES')]))}` : ''}

  ${(bal.capitalSocial>0||bal.tesoreria>0) ? `
  <h3>7.5 Balance de situación previsional</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:8px 0">
    <div>
      <div style="font-size:10px;font-weight:700;color:#217a3e;margin-bottom:4px;text-transform:uppercase">ACTIVO</div>
      ${tablaHTML(['Concepto','Importe (€)'],[
        ['Inmovilizado material',(bal.inmovilizadoMaterial||0).toLocaleString('es-ES')],
        ['Inmovilizado intangible',(bal.inmovilizadoIntangible||0).toLocaleString('es-ES')],
        ['Existencias',(bal.existencias||0).toLocaleString('es-ES')],
        ['Clientes',(bal.clientes||0).toLocaleString('es-ES')],
        ['Tesorería',(bal.tesoreria||0).toLocaleString('es-ES')],
      ])}
    </div>
    <div>
      <div style="font-size:10px;font-weight:700;color:#217a3e;margin-bottom:4px;text-transform:uppercase">PATRIMONIO NETO Y PASIVO</div>
      ${tablaHTML(['Concepto','Importe (€)'],[
        ['Capital social',(bal.capitalSocial||0).toLocaleString('es-ES')],
        ['Resultado ejercicio',(bal.resultadoEjercicio||0).toLocaleString('es-ES')],
        ['Deudas LP',(bal.deudasLP||0).toLocaleString('es-ES')],
        ['Proveedores',(bal.proveedores||0).toLocaleString('es-ES')],
        ['HP acreedora',(bal.hpAcreedora||0).toLocaleString('es-ES')],
      ])}
    </div>
  </div>` : ''}

  ${cta.a1?.ventas > 0 ? `
  <h3>7.6 Cuenta de resultados previsional</h3>
  ${tablaHTML(['Concepto','Año 1','Año 2','Año 3'],[
    ['Ventas',(cta.a1?.ventas||0).toLocaleString('es-ES'),(cta.a2?.ventas||0).toLocaleString('es-ES'),(cta.a3?.ventas||0).toLocaleString('es-ES')],
    ['Coste de ventas',(cta.a1?.costeMerc||0).toLocaleString('es-ES'),(cta.a2?.costeMerc||0).toLocaleString('es-ES'),(cta.a3?.costeMerc||0).toLocaleString('es-ES')],
    ['Gastos de personal',(cta.a1?.gastosPersonal||0).toLocaleString('es-ES'),(cta.a2?.gastosPersonal||0).toLocaleString('es-ES'),(cta.a3?.gastosPersonal||0).toLocaleString('es-ES')],
    ['Resultado',(((cta.a1?.ventas||0)-(cta.a1?.costeMerc||0)-(cta.a1?.gastosPersonal||0)-(cta.a1?.alquiler||0)-(cta.a1?.suministros||0)-(cta.a1?.amortizacion||0)-(cta.a1?.otrosGastos||0))).toLocaleString('es-ES'),(((cta.a2?.ventas||0)-(cta.a2?.costeMerc||0)-(cta.a2?.gastosPersonal||0)-(cta.a2?.alquiler||0)-(cta.a2?.suministros||0)-(cta.a2?.amortizacion||0)-(cta.a2?.otrosGastos||0))).toLocaleString('es-ES'),(((cta.a3?.ventas||0)-(cta.a3?.costeMerc||0)-(cta.a3?.gastosPersonal||0)-(cta.a3?.alquiler||0)-(cta.a3?.suministros||0)-(cta.a3?.amortizacion||0)-(cta.a3?.otrosGastos||0))).toLocaleString('es-ES')],
  ])}` : ''}
</div>

<!-- SECCIÓN 8: MARKETING -->
<div class="seccion">
  <h2><span class="sec-num">8</span> 📣 Plan de marketing</h2>
  ${bloque('Producto', ap8.producto)}
  ${bloque('Precio', ap8.precio)}
  ${bloque('Distribución', ap8.distribucion)}
  ${bloque('Comunicación', ap8.comunicacion)}
  ${ap8.presupuestoMarketing ? campo('Presupuesto marketing', ap8.presupuestoMarketing+' €') : ''}
</div>

<!-- EVIDENCIAS: ACTAS -->
${reuniones.length > 0 ? `
<div class="seccion page-break">
  <h2><span class="sec-num">E1</span> 📋 Actas de reunión (${reuniones.length})</h2>
  ${reuniones.map((r,i) => `
  <div class="acta">
    <div class="acta-head">
      <span class="acta-tipo">${r.tipo||'Reunión ordinaria'} · Acta ${i+1}</span>
      <span class="acta-fecha">${r.fecha||'—'} ${r.hora||''}</span>
    </div>
    ${r.asistentes ? `<div style="font-size:11px;color:#6b7280;margin-bottom:3px"><strong>Asistentes:</strong> ${r.asistentes}</div>` : ''}
    ${r.orden ? `<div style="font-size:11px;color:#374151;margin-bottom:3px"><strong>Orden del día:</strong> ${r.orden}</div>` : ''}
    ${r.acta ? `<div style="font-size:11px;color:#1a1c1e;line-height:1.5;white-space:pre-wrap">${r.acta}</div>` : ''}
    ${r.firmada ? '<div style="margin-top:4px;font-size:10px;color:#16a34a;font-weight:600">✓ Acta firmada digitalmente</div>' : ''}
    ${(r.acuerdos||[]).filter(a=>a).length > 0 ? `<div style="margin-top:4px"><strong style="font-size:10px;color:#217a3e">Acuerdos:</strong> ${r.acuerdos.filter(a=>a).map(a=>`<span class="chip">${a}</span>`).join('')}</div>` : ''}
  </div>`).join('')}
</div>` : ''}

<!-- EVIDENCIAS: DECISIONES -->
${decisiones.length > 0 ? `
<div class="seccion">
  <h2><span class="sec-num">E2</span> 🎯 Registro de decisiones (${decisiones.length})</h2>
  ${decisiones.map((d,i) => `
  <div class="decision-item">
    <div class="decision-titulo">${i+1}. ${d.titulo||'Decisión'}</div>
    ${d.descripcion ? `<div style="font-size:11px;color:#6b7280;margin:2px 0">${d.descripcion}</div>` : ''}
    ${d.decision ? `<div class="decision-dec">→ Decisión: ${d.decision}</div>` : ''}
    ${d.justificacion ? `<div style="font-size:11px;color:#374151">${d.justificacion}</div>` : ''}
    <div style="margin-top:3px">${chip(d.estado||'pendiente')} ${d.urgencia?chip('Urgencia: '+d.urgencia+'/5'):''}</div>
  </div>`).join('')}
</div>` : ''}

<!-- EVIDENCIAS: TAREAS -->
${tareasEv.length > 0 ? `
<div class="seccion page-break">
  <h2><span class="sec-num">E3</span> ✅ Tareas evaluadas (${tareasEv.length})</h2>
  ${tablaHTML(['Tarea','Semana','Departamento','Calificación','Anotaciones'],
    tareasEv.map(t=>[t.titulo||'Tarea',t.semana||'—',t.departamento||'—',(t.calificacion||'—')+'/10',t.anotacion||'—']))}
</div>` : ''}

<!-- DEFENSA -->
${(filled(def.pitch?.gancho)||filled(def.presentacion?.bloques?.[0]?.contenido)) ? `
<div class="seccion page-break">
  <h2><span class="sec-num">D</span> 🎤 Preparación de la defensa</h2>
  ${filled(def.pitch?.gancho) ? `
  <h3>Elevator Pitch</h3>
  ${[['Gancho de apertura',def.pitch.gancho],['Problema identificado',def.pitch.problema],
     ['Solución propuesta',def.pitch.solucion],['Modelo de negocio',def.pitch.modeloNegocio],
     ['Cierre y llamada a la acción',def.pitch.cierreCall]]
    .filter(([,v])=>v&&v.trim()).map(([t,v])=>bloque(t,v)).join('')}` : ''}
  ${(def.presentacion?.bloques||[]).filter(b=>filled(b.contenido)).length > 0 ? `
  <h3>Presentación final — guión por bloques</h3>
  ${def.presentacion.bloques.filter(b=>filled(b.contenido)).map(b=>
    `<div style="margin-bottom:8px"><div style="font-size:11px;font-weight:600;color:#217a3e">${b.icono||''} ${b.titulo} (${b.duracion} min)</div><div style="font-size:11px;color:#1a1c1e;line-height:1.5;padding:4px 0">${b.contenido}</div></div>`
  ).join('')}` : ''}
</div>` : ''}

<!-- PIE -->
<div style="padding:16px 40px">
  <div class="footer">
    <span>${d.nombre||'Empresa'} · Módulo 3160 · IES Cantillana · Grado Superior Administración y Finanzas</span>
    <span>Generado el ${new Date().toLocaleDateString('es-ES')} con SimulApp v24 · Curso ${año}-${año+1}</span>
  </div>
</div>

</body></html>`;
  } /* fin htmlDossier */

  /* ── Función global de impresión del dossier ── */
  window.dosierImprimir = function() {
    if (!window._pgFichas) window._pgFichas = {};
    const html = htmlDossier();
    const w = window.open('', '_blank', 'width=1000,height=780');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    mostrarToast('📄 Dossier generado — abre el diálogo de impresión', 'exito');
  };

  /* ── Vista previa inline ── */
  function renderPrevisu() {
    return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div style="font-size:.85rem;font-weight:600;color:var(--verde-800)">Vista previa · ${d.nombre||'Empresa'}</div>
      <div style="display:flex;gap:8px">
        <button class="btn-secundario" style="font-size:.78rem;padding:5px 12px"
          onclick="window.DOSSIER_STATE.vista='indice';renderVista('dossier')">← Volver al índice</button>
        <button class="btn-accion" style="font-size:.78rem;padding:5px 12px"
          onclick="dosierImprimir()">🖨️ Exportar PDF</button>
      </div>
    </div>
    <div style="border:1px solid var(--gris-200);border-radius:var(--radio-md);overflow:hidden">
      <iframe id="dossier-frame" style="width:100%;height:600px;border:none;background:white"
        srcdoc="${htmlDossier().replace(/"/g,'&quot;').replace(/'/g,'&#39;')}">
      </iframe>
    </div>`;
  }

  /* ── Render principal ── */
  return `
  <div class="seccion-header" style="margin-bottom:0">
    <div>
      <h2>📄 Dossier del proyecto intermodular</h2>
      <p>Módulo 3160 · Compilación automática de evidencias · ${pct}% completado</p>
    </div>
    <div style="display:flex;gap:6px;align-items:center">
      <button class="btn-ayuda-ctx" data-ayuda="dossier" onclick="toggleAyuda('dossier')" title="Conceptos y ayuda">❓ Ayuda</button>
      <div style="width:80px;height:6px;background:var(--gris-100);border-radius:3px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${pct>=80?'var(--verde-500)':pct>=50?'#f59e0b':'#ef4444'};border-radius:3px"></div>
      </div>
      <span style="font-size:.75rem;color:var(--gris-500)">${pct}%</span>
    </div>
  </div>
  <div style="height:1px;background:var(--gris-100);margin:12px 0 16px"></div>
  ${ds.vista === 'previsu' ? renderPrevisu() : renderIndice()}`;
}
/* ============================================================
   MÓDULO TAREAS DEL GRUPO
   ============================================================ */
