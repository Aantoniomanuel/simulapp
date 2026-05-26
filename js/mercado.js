function vistaMercado() {
  const m      = EMPRESA_STATE.mercado;
  const esProf = APP.rolActivo !== 'alumno';
  const vista  = m.vistaActiva;
  
  const misTx     = m.transacciones.filter(t => t.deGrupo === miGrupo() || t.aGrupo === miGrupo());
  const pendientes = misTx.filter(t => t.estado !== 'completada' && t.estado !== 'pedido-rechazado').length;
  const completadas = misTx.filter(t => t.estado === 'completada').length;
  const volumen    = misTx.filter(t => t.estado === 'completada').reduce((s,t) => s + t.total, 0);

  return `
  <div class="seccion-header">
    <div>
      <h2>🔄 Mercado intergrupal</h2>
      <p>Compraventa entre empresas del aula · Flujo: Pedido → Aceptación → Albarán → Factura
        <span class="ra-chip" style="margin-left:6px">RA6a · RA6b</span>
      </p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-ayuda-ctx" data-ayuda="mercado" onclick="toggleAyuda('mercado')" title="Conceptos y ayuda">❓ Ayuda</button>
      <button class="btn-secundario" onclick="EMPRESA_STATE.mercado.vistaActiva='catalogo';renderMercado()">
        📦 Mi catálogo
      </button>
      <button class="btn-accion" onclick="solicitarPresupuesto()">📩 Solicitar presupuesto</button>
    </div>
  </div>

  <!-- KPIs de mercado -->
  <div class="metricas-grid" style="margin-bottom:1.25rem">
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">📦</div></div>
      <div class="metrica-valor">${m.catalogo.length}</div>
      <div class="metrica-etiq">Productos en catálogo</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono azul">📤</div></div>
      <div class="metrica-valor">${pendientes}</div>
      <div class="metrica-etiq">Transacciones activas</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono nar">✓</div></div>
      <div class="metrica-valor">${completadas}</div>
      <div class="metrica-etiq">Transacciones completadas</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">💶</div></div>
      <div class="metrica-valor">${volumen.toLocaleString('es-ES')} €</div>
      <div class="metrica-etiq">Volumen de negocio</div>
    </div>
  </div>

  ${vista === 'catalogo'     ? vistaCatalogo() :
    vista === 'nueva-transaccion' ? vistaFormPedido() :
    vista === 'detalle-transaccion' ? vistaDetalleTx() :
    vista === 'eventos'      ? vistaEventos() :
    vistaPanelMercado(misTx, esProf)}`;
}

/* ── Panel principal del mercado ──────────────────────────── */
function vistaPanelMercado(misTx, esProf) {
  return `
  <div class="grid-2col">
    <!-- Empresas del aula -->
    <div class="ficha-card">
      <div class="ficha-card-header"><span>🏢</span> Empresas del aula</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${EMPRESAS_AULA.map(e => {
          const esMia = e.grupo === miGrupo();
          return `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--radio-md);
            background:${esMia?'var(--verde-50)':'var(--blanco)'};
            border:1px solid ${esMia?'var(--verde-300)':'var(--gris-100)'}">
            <div style="width:32px;height:32px;border-radius:8px;background:${esMia?'var(--verde-600)':'var(--gris-200)'};
              color:${esMia?'white':'var(--gris-600)'};font-size:.75rem;font-weight:700;
              display:flex;align-items:center;justify-content:center">${e.grupo}</div>
            <div style="flex:1">
              <div style="font-size:.82rem;font-weight:600;color:var(--gris-800)">
                ${e.nombre} ${esMia?'<span style="font-size:.68rem;color:var(--verde-600)">(Tu empresa)</span>':''}
              </div>
              <div style="font-size:.72rem;color:var(--gris-500)">${e.sector}</div>
            </div>
            ${!esMia ? `<button class="btn-secundario" style="padding:4px 10px;font-size:.72rem"
              onclick="document.getElementById('pedido-destino-rapido').value='${e.grupo}';solicitarPresupuesto()">
              📩 Presupuesto</button>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Transacciones recientes -->
    <div class="ficha-card">
      <div class="ficha-card-header">
        <span>📋</span> Transacciones recientes
        ${esProf ? `<button class="btn-secundario" style="margin-left:auto;padding:4px 10px;font-size:.72rem"
          onclick="EMPRESA_STATE.mercado.vistaActiva='eventos';renderMercado()">⚡ Eventos mercado</button>` : ''}
      </div>
      ${misTx.length === 0
        ? `<div style="text-align:center;padding:2rem;color:var(--gris-400)">
            <div style="font-size:2rem;margin-bottom:8px">📭</div>
            <p>Sin transacciones. Emite tu primer pedido a otra empresa del aula.</p>
           </div>`
        : `<div style="display:flex;flex-direction:column;gap:4px">
            ${misTx.slice(0, 8).map(tx => {
              const est = ESTADOS_TRANSACCION[tx.estado] || {};
              const otra = tx.deGrupo === miGrupo() ? empresaPorGrupo(tx.aGrupo) : empresaPorGrupo(tx.deGrupo);
              const esEmitido = tx.deGrupo === miGrupo();
              return `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--radio-md);
                border:1px solid var(--gris-100);cursor:pointer;transition:all var(--transicion)"
                onclick="abrirTransaccion('${tx.id}')"
                onmouseover="this.style.borderColor='var(--verde-300)';this.style.background='var(--verde-50)'"
                onmouseout="this.style.borderColor='var(--gris-100)';this.style.background=''">
                <div style="font-size:1rem">${esEmitido ? '📤' : '📥'}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:.8rem;font-weight:600;color:var(--gris-800)">
                    ${tx.numPedido} · ${esEmitido ? 'A' : 'De'} ${otra ? otra.nombre : tx.aGrupo}
                  </div>
                  <div style="font-size:.72rem;color:var(--gris-500)">${tx.fecha} · ${tx.items.length} producto${tx.items.length>1?'s':''}</div>
                </div>
                <div style="font-size:.82rem;font-weight:700;color:var(--gris-800)">${tx.total.toLocaleString('es-ES')} €</div>
                <span style="font-size:.68rem;padding:2px 8px;border-radius:20px;background:${est.color}22;color:${est.color};font-weight:600">
                  ${est.icono} ${est.label}
                </span>
              </div>`;
            }).join('')}
          </div>`
      }
    </div>
  </div>

  <!-- Eventos activos -->
  ${EMPRESA_STATE.mercado.eventos.filter(e => e.activo).length > 0 ? `
  <div class="ficha-card" style="margin-top:1rem">
    <div class="ficha-card-header"><span>⚡</span> Eventos de mercado activos</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${EMPRESA_STATE.mercado.eventos.filter(e => e.activo).map(ev => `
      <div style="padding:10px 14px;background:linear-gradient(135deg,var(--verde-800),var(--verde-600));
        border-radius:var(--radio-md);color:white">
        <div style="font-size:.82rem;font-weight:700;margin-bottom:4px">${ev.titulo}</div>
        <div style="font-size:.75rem;opacity:.85;line-height:1.4">${ev.descripcion}</div>
        <div style="font-size:.68rem;opacity:.6;margin-top:6px">${ev.fecha}</div>
      </div>`).join('')}
    </div>
  </div>` : ''}

  <input type="hidden" id="pedido-destino-rapido" value="">`;
}

/* ── Catálogo de productos ────────────────────────────────── */
function vistaCatalogo() {
  const cat  = EMPRESA_STATE.mercado.catalogo;
  const edit = EMPRESA_STATE.mercado.editandoCatalogo;
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">📦 Catálogo de productos y servicios</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">Define lo que tu empresa ofrece al mercado</p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-secundario" onclick="EMPRESA_STATE.mercado.vistaActiva='panel';renderMercado()">← Volver</button>
      ${edit
        ? `<button class="btn-accion" onclick="guardarCatalogo()">💾 Guardar catálogo</button>`
        : `<button class="btn-accion" onclick="EMPRESA_STATE.mercado.editandoCatalogo=true;renderMercado()">✏️ Editar</button>`
      }
    </div>
  </div>

  ${cat.length === 0 && !edit
    ? `<div style="text-align:center;padding:3rem;background:var(--blanco);border:2px dashed var(--gris-200);border-radius:var(--radio-lg);color:var(--gris-400)">
        <div style="font-size:2.5rem;margin-bottom:8px">📦</div>
        <p style="font-size:.9rem;font-weight:500;color:var(--gris-700)">Tu catálogo está vacío</p>
        <p style="font-size:.8rem;margin-bottom:12px">Define los productos o servicios que tu empresa ofrece al mercado</p>
        <button class="btn-accion" onclick="agregarProducto()">+ Añadir primer producto</button>
       </div>`
    : `
    <div class="ficha-card">
      <table style="width:100%;border-collapse:collapse;font-size:.82rem">
        <thead>
          <tr style="border-bottom:2px solid var(--verde-200)">
            <th style="text-align:left;padding:8px 10px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Producto/Servicio</th>
            <th style="text-align:left;padding:8px 10px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Categoría</th>
            <th style="text-align:right;padding:8px 10px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Precio</th>
            <th style="text-align:center;padding:8px 10px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Unidad</th>
            <th style="text-align:center;padding:8px 10px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">IVA</th>
            <th style="text-align:right;padding:8px 10px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Stock</th>
            ${edit ? '<th style="width:40px"></th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${cat.map((p, i) => edit ? `
          <tr style="border-bottom:1px solid var(--gris-100)">
            <td style="padding:6px 10px"><input class="ficha-input" style="font-size:.8rem;padding:4px 6px" value="${p.nombre}" oninput="actualizarProducto('${p.id}','nombre',this.value)" placeholder="Nombre del producto"></td>
            <td style="padding:6px 10px"><input class="ficha-input" style="font-size:.8rem;padding:4px 6px" value="${p.categoria}" oninput="actualizarProducto('${p.id}','categoria',this.value)" placeholder="Categoría"></td>
            <td style="padding:6px 10px"><input type="number" class="ficha-input" style="font-size:.8rem;padding:4px 6px;text-align:right;width:80px" value="${p.precio}" oninput="actualizarProducto('${p.id}','precio',this.value)" placeholder="0.00"></td>
            <td style="padding:6px 10px"><select class="ficha-input" style="font-size:.78rem;padding:4px" onchange="actualizarProducto('${p.id}','unidad',this.value)">
              <option value="kg" ${p.unidad==='kg'?'selected':''}>kg</option>
              <option value="ud" ${p.unidad==='ud'?'selected':''}>ud</option>
              <option value="caja" ${p.unidad==='caja'?'selected':''}>caja</option>
              <option value="palet" ${p.unidad==='palet'?'selected':''}>palet</option>
              <option value="hora" ${p.unidad==='hora'?'selected':''}>hora</option>
              <option value="servicio" ${p.unidad==='servicio'?'selected':''}>servicio</option>
            </select></td>
            <td style="padding:6px 10px"><select class="ficha-input" style="font-size:.78rem;padding:4px" onchange="actualizarProducto('${p.id}','iva',parseInt(this.value))">
              <option value="21" ${p.iva===21?'selected':''}>21%</option>
              <option value="10" ${p.iva===10?'selected':''}>10%</option>
              <option value="4" ${p.iva===4?'selected':''}>4%</option>
              <option value="0" ${p.iva===0?'selected':''}>0%</option>
            </select></td>
            <td style="padding:6px 10px"><input type="number" class="ficha-input" style="font-size:.8rem;padding:4px 6px;text-align:right;width:60px" value="${p.stock}" oninput="actualizarProducto('${p.id}','stock',this.value)" placeholder="0"></td>
            <td style="padding:6px"><button class="btn-eliminar-socio" onclick="eliminarProducto('${p.id}')">✕</button></td>
          </tr>` : `
          <tr style="border-bottom:1px solid var(--gris-50)">
            <td style="padding:8px 10px;font-weight:500;color:var(--gris-800)">${p.nombre||'—'}</td>
            <td style="padding:8px 10px;color:var(--gris-500)">${p.categoria||'—'}</td>
            <td style="padding:8px 10px;text-align:right;font-weight:600;color:var(--verde-700)">${parseFloat(p.precio||0).toFixed(2)} €</td>
            <td style="padding:8px 10px;text-align:center">${p.unidad}</td>
            <td style="padding:8px 10px;text-align:center">${p.iva}%</td>
            <td style="padding:8px 10px;text-align:right">${p.stock||'—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${edit ? `<button class="btn-secundario" style="width:100%;margin-top:10px;justify-content:center" onclick="agregarProducto()">+ Añadir producto</button>` : ''}
    </div>`
  }`;
}

/* ── Formulario nuevo pedido ──────────────────────────────── */
function vistaFormPedido() {
  const otras = otrasEmpresas();
  const rapido = document.getElementById('pedido-destino-rapido');
  const grupoRapido = rapido ? rapido.value : '';
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">📩 Solicitar presupuesto</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">Indica qué necesitas y en qué cantidad · El proveedor te enviará su presupuesto con precios</p>
    </div>
    <button class="btn-secundario" onclick="EMPRESA_STATE.mercado.vistaActiva='panel';renderMercado()">← Cancelar</button>
  </div>

  <div class="ficha-card" style="max-width:700px">
    <div style="padding:10px 14px;background:var(--verde-50);border:1px solid var(--verde-200);border-radius:var(--radio-md);margin-bottom:16px;font-size:.8rem;color:var(--verde-800);line-height:1.5">
      💡 <strong>No incluyas precios.</strong> Solo indica qué productos o servicios necesitas y en qué cantidad.
      El proveedor recibirá tu solicitud y te enviará su presupuesto con los precios.
    </div>

    <div class="ficha-campo">
      <label>Empresa proveedora</label>
      <select id="pedido-destino" class="ficha-input">
        <option value="">— Selecciona la empresa a la que solicitas presupuesto —</option>
        ${otras.map(e => `<option value="${e.grupo}" ${e.grupo===grupoRapido?'selected':''}>${e.grupo} · ${e.nombre}</option>`).join('')}
      </select>
    </div>

    <div style="margin-top:12px">
      <label style="font-size:.72rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:8px">
        Productos o servicios que necesitas
      </label>
      <div style="display:grid;grid-template-columns:3fr 1fr auto;gap:8px;margin-bottom:6px;font-size:.68rem;color:var(--gris-400);font-weight:600;text-transform:uppercase;letter-spacing:.04em">
        <div style="padding-left:4px">Producto / Servicio</div><div>Cantidad</div><div></div>
      </div>
      <div id="pedido-items-list">
        <div class="pedido-item-row" style="display:grid;grid-template-columns:3fr 1fr auto;gap:8px;align-items:center;margin-bottom:6px">
          <input type="text" class="ficha-input pedido-prod" placeholder="Ej: Naranjas Navel calibre 70-80 mm">
          <input type="number" class="ficha-input pedido-cant" placeholder="500 kg" min="0">
          <div style="width:26px"></div>
        </div>
      </div>
      <button class="btn-secundario" style="font-size:.78rem;padding:5px 10px" onclick="addPedidoItemSinPrecio()">+ Añadir línea</button>
    </div>

    <div class="ficha-campo" style="margin-top:12px">
      <label>Observaciones y condiciones</label>
      <textarea id="pedido-obs" class="ficha-input" style="min-height:80px"
        placeholder="Plazo de entrega deseado, condiciones de pago, especificaciones de calidad, certificaciones requeridas..."></textarea>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:12px;border-top:1px solid var(--gris-100)">
      <button class="btn-secundario" onclick="EMPRESA_STATE.mercado.vistaActiva='panel';renderMercado()">Cancelar</button>
      <button class="btn-accion" onclick="enviarSolicitudPresupuesto()">📩 Enviar solicitud de presupuesto</button>
    </div>
  </div>`;
}

function addPedidoItemSinPrecio() {
  const cont = document.getElementById('pedido-items-list');
  const row = document.createElement('div');
  row.className = 'pedido-item-row';
  row.style.cssText = 'display:grid;grid-template-columns:3fr 1fr auto;gap:8px;align-items:center;margin-bottom:6px';
  row.innerHTML = '<input type="text" class="ficha-input pedido-prod" placeholder="Producto o servicio"><input type="number" class="ficha-input pedido-cant" placeholder="Cantidad" min="0" step="1"><button class="btn-eliminar-socio" onclick="this.parentElement.remove()">✕</button>';
  cont.appendChild(row);
}

/* ── Detalle de transacción ───────────────────────────────── */
function vistaDetalleTx() {
  const tx = EMPRESA_STATE.mercado.transacciones.find(t => t.id === EMPRESA_STATE.mercado.transaccionAbierta);
  if (!tx) return '<p>Transacción no encontrada</p>';
  
  const est       = ESTADOS_TRANSACCION[tx.estado] || {};
  const deEmp     = empresaPorGrupo(tx.deGrupo);
  const aEmp      = empresaPorGrupo(tx.aGrupo);
  const soyCliente   = tx.deGrupo === miGrupo();
  const soyProveedor = tx.aGrupo === miGrupo();
  const tienePrecios = tx.items.some(it => it.precioUnit > 0);
  const flujo = [
    { key:'solicitud',  label:'Solicitud',   doc:tx.docs.solicitud },
    { key:'presupuesto',label:'Presupuesto', doc:tx.docs.presupuesto },
    { key:'pedido',     label:'Pedido',      doc:tx.docs.pedido },
    { key:'aceptacion', label:'Aceptación',  doc:tx.docs.aceptacion },
    { key:'albaran',    label:'Albarán',     doc:tx.docs.albaran },
    { key:'factura',    label:'Factura',     doc:tx.docs.factura },
  ];

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">Transacción ${tx.numRef}</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">
        ${soyCliente ? '📤 Tú solicitas a' : '📥 Te solicita'} 
        <strong>${soyCliente ? (aEmp?aEmp.nombre:tx.aGrupo) : (deEmp?deEmp.nombre:tx.deGrupo)}</strong>
      </p>
    </div>
    <button class="btn-secundario" onclick="EMPRESA_STATE.mercado.vistaActiva='panel';renderMercado()">← Volver</button>
  </div>

  <div style="padding:8px 14px;border-radius:var(--radio-md);margin-bottom:1rem;font-size:.82rem;font-weight:600;
    background:${soyCliente?'#dbeafe':'var(--verde-50)'};border:1px solid ${soyCliente?'#93c5fd':'var(--verde-300)'};
    color:${soyCliente?'#1e40af':'var(--verde-800)'}">
    ${soyCliente ? '🛒 Eres el CLIENTE · Has solicitado productos/servicios' : '🏪 Eres el PROVEEDOR · Te han solicitado productos/servicios'}
  </div>

  <div class="grid-2col">
    <div style="display:flex;flex-direction:column;gap:1rem">
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>${est.icono}</span>
          <span style="color:${est.color};font-weight:700">${est.label}</span>
          <span style="margin-left:auto;font-size:.78rem;color:var(--gris-400)">${tx.fecha}</span>
        </div>
        <div style="display:flex;align-items:center;gap:2px;margin-bottom:16px;overflow-x:auto;padding:4px 0">
          ${flujo.map((f, i) => {
            const hecho = !!f.doc;
            return `<div style="flex:1;text-align:center;min-width:50px">
              <div style="width:26px;height:26px;border-radius:50%;margin:0 auto 3px;display:flex;align-items:center;justify-content:center;
                font-size:.62rem;font-weight:700;background:${hecho?'var(--verde-500)':'var(--gris-100)'};
                color:${hecho?'white':'var(--gris-400)'};border:2px solid ${hecho?'var(--verde-500)':'var(--gris-200)'}">${hecho?'✓':(i+1)}</div>
              <div style="font-size:.6rem;${hecho?'color:var(--verde-700);font-weight:600':'color:var(--gris-400)'}">${f.label}</div>
            </div>${i<flujo.length-1?'<div style="flex:0 0 8px;height:2px;background:var(--gris-200);margin-bottom:12px"></div>':''}`;
          }).join('')}
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
          <thead><tr style="border-bottom:1px solid var(--gris-200)">
            <th style="text-align:left;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Producto</th>
            <th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Cantidad</th>
            ${tienePrecios?`<th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">P.Unit.</th>
            <th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">IVA</th>
            <th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Subtotal</th>`
            :`<th style="text-align:center;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Precio</th>`}
          </tr></thead>
          <tbody>${tx.items.map(it=>`<tr style="border-bottom:1px solid var(--gris-50)">
            <td style="padding:6px 8px">${it.producto}</td>
            <td style="padding:6px 8px;text-align:right">${it.cantidad}</td>
            ${tienePrecios?`<td style="padding:6px 8px;text-align:right">${parseFloat(it.precioUnit).toFixed(2)} €</td>
            <td style="padding:6px 8px;text-align:right">${it.iva}%</td>
            <td style="padding:6px 8px;text-align:right;font-weight:600">${(it.cantidad*it.precioUnit).toFixed(2)} €</td>`
            :`<td style="padding:6px 8px;text-align:center;color:var(--gris-400);font-style:italic">Pendiente</td>`}
          </tr>`).join('')}</tbody>
          ${tienePrecios?`<tfoot>
            <tr style="border-top:2px solid var(--gris-200)"><td colspan="4" style="padding:6px 8px;text-align:right;font-size:.78rem;color:var(--gris-500)">Base</td><td style="padding:6px 8px;text-align:right;font-weight:600">${tx.subtotal.toFixed(2)} €</td></tr>
            <tr><td colspan="4" style="padding:4px 8px;text-align:right;font-size:.78rem;color:var(--gris-500)">IVA</td><td style="padding:4px 8px;text-align:right">${tx.iva.toFixed(2)} €</td></tr>
            <tr><td colspan="4" style="padding:6px 8px;text-align:right;font-weight:700;color:var(--verde-800)">TOTAL</td><td style="padding:6px 8px;text-align:right;font-weight:700;color:var(--verde-800);font-size:.95rem">${tx.total.toFixed(2)} €</td></tr>
          </tfoot>`:''}
        </table>
        ${tx.observaciones?`<div style="margin-top:10px;padding:8px 10px;background:var(--gris-50);border-radius:var(--radio-sm);font-size:.8rem;color:var(--gris-600)"><strong>Observaciones:</strong> ${tx.observaciones}</div>`:''}
      </div>

      ${tx.estado!=='completada'&&tx.estado!=='pedido-rechazado'&&tx.estado!=='presupuesto-rechazado'?`
      <div class="ficha-card" style="border:2px solid ${soyProveedor?'var(--verde-400)':'#93c5fd'}">
        <div class="ficha-card-header"><span>⚡</span><span style="font-weight:700">${soyProveedor?'Tu acción como PROVEEDOR':'Estado de tu solicitud'}</span></div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${tx.estado==='presupuesto-solicitado'&&soyProveedor?`
            <div style="font-size:.82rem;color:var(--gris-700);margin-bottom:8px;line-height:1.5">
              <strong>${deEmp?deEmp.nombre:tx.deGrupo}</strong> te solicita presupuesto. Pon precio a cada producto:
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:6px;font-size:.68rem;color:var(--gris-400);font-weight:600;text-transform:uppercase;padding:0 4px">
              <div>Producto</div><div>Cantidad</div><div>Precio (€)</div><div>IVA</div>
            </div>
            ${tx.items.map((it,i)=>`
            <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:6px;align-items:center">
              <div style="font-size:.82rem;font-weight:500;color:var(--gris-800);padding:0 4px">${it.producto}</div>
              <div style="font-size:.82rem;color:var(--gris-600);padding:0 4px">${it.cantidad}</div>
              <input type="number" id="pres-precio-${tx.id}-${i}" class="ficha-input" style="font-size:.82rem;padding:5px 6px;text-align:right" placeholder="0.00" min="0" step="0.01">
              <select id="pres-iva-${tx.id}-${i}" class="ficha-input" style="font-size:.78rem;padding:5px">
                <option value="21">21%</option><option value="10" selected>10%</option><option value="4">4%</option><option value="0">0%</option>
              </select>
            </div>`).join('')}
            <button class="btn-accion" style="width:100%;margin-top:8px" onclick="enviarPresupuesto('${tx.id}')">💰 Enviar presupuesto</button>`
          :tx.estado==='presupuesto-solicitado'&&soyCliente?`
            <div style="text-align:center;padding:16px;color:var(--gris-500)">
              <div style="font-size:1.5rem;margin-bottom:8px">⏳</div>
              <div style="font-size:.85rem">Esperando presupuesto de <strong>${aEmp?aEmp.nombre:tx.aGrupo}</strong>...</div>
            </div>`
          :tx.estado==='presupuesto-enviado'&&soyCliente?`
            <div style="font-size:.82rem;color:var(--gris-700);margin-bottom:8px">
              Presupuesto recibido: <strong style="color:var(--verde-700)">${tx.total.toFixed(2)} €</strong> (IVA incl.)
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn-accion" style="flex:1" onclick="confirmarPedido('${tx.id}')">✓ Aceptar y confirmar pedido</button>
              <button class="btn-secundario" style="color:#dc2626;border-color:#fca5a5" onclick="rechazarPresupuesto('${tx.id}')">✕ Rechazar</button>
            </div>`
          :tx.estado==='presupuesto-enviado'&&soyProveedor?`
            <div style="text-align:center;padding:16px;color:var(--gris-500)">⏳ Esperando respuesta del cliente...</div>`
          :tx.estado==='pedido-enviado'&&soyProveedor?`
            <div style="display:flex;gap:8px">
              <button class="btn-accion" style="flex:1" onclick="avanzarTransaccion('${tx.id}','pedido-aceptado')">✓ Aceptar pedido</button>
              <button class="btn-secundario" style="color:#dc2626;border-color:#fca5a5" onclick="avanzarTransaccion('${tx.id}','pedido-rechazado')">✕ Rechazar</button>
            </div>`
          :tx.estado==='pedido-aceptado'&&soyProveedor?`
            <button class="btn-accion" style="width:100%" onclick="avanzarTransaccion('${tx.id}','albaran-emitido')">📋 Emitir albarán</button>`
          :tx.estado==='albaran-emitido'&&soyProveedor?`
            <button class="btn-accion" style="width:100%" onclick="avanzarTransaccion('${tx.id}','factura-emitida')">🧾 Emitir factura</button>`
          :tx.estado==='factura-emitida'?`
            <button class="btn-accion" style="width:100%" onclick="avanzarTransaccion('${tx.id}','completada')">✓✓ Completar transacción</button>`
          :`<div style="text-align:center;padding:16px;color:var(--gris-500)">⏳ Esperando acción de la otra parte...</div>`}
        </div>
      </div>`:``}
    </div>

    <div class="ficha-card">
      <div class="ficha-card-header"><span>📜</span> Historial</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        ${tx.historial.map(h=>`
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="width:8px;height:8px;border-radius:50%;background:var(--verde-500);margin-top:5px;flex-shrink:0"></div>
          <div><div style="font-size:.82rem;font-weight:600;color:var(--gris-800)">${h.accion}</div>
          <div style="font-size:.72rem;color:var(--gris-400)">${h.fecha} · ${h.hora}</div></div>
        </div>`).join('')}
      </div>
      <div style="padding-top:12px;border-top:1px solid var(--gris-100)">
        <div style="font-size:.72rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Documentos</div>
        ${flujo.filter(f=>f.doc).map(f=>`
        <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:var(--verde-50);border-radius:var(--radio-sm);border:1px solid var(--verde-200);margin-bottom:4px">
          <span>📄</span>
          <div style="flex:1"><div style="font-size:.8rem;font-weight:600;color:var(--verde-800)">${f.label} · ${f.doc.numero||''}</div><div style="font-size:.7rem;color:var(--verde-600)">${f.doc.fecha}</div></div>
          <button class="btn-secundario" style="padding:3px 8px;font-size:.7rem" onclick="mostrarToast('Descargando...','exito')">⬇️</button>
        </div>`).join('')}
        ${flujo.filter(f=>!f.doc).length>0?`<div style="font-size:.72rem;color:var(--gris-400);margin-top:4px;font-style:italic">${flujo.filter(f=>!f.doc).map(f=>f.label).join(' · ')} — pendientes</div>`:''}
      </div>
    </div>
  </div>`;
}

function vistaEventos() {
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">⚡ Eventos de mercado</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">Lanza situaciones que afectan a todas las empresas del aula</p>
    </div>
    <button class="btn-secundario" onclick="EMPRESA_STATE.mercado.vistaActiva='panel';renderMercado()">← Volver</button>
  </div>

  <div class="grid-3col" style="margin-bottom:1rem">
    ${[
      { titulo:'🌨️ Crisis de suministro', desc:'Subida del 20% en el coste de aprovisionamiento por heladas en la comarca', efecto:'+20% costes variables' },
      { titulo:'📈 Nuevo canal online', desc:'Se abre la posibilidad de vender directamente al consumidor final a través de plataforma digital', efecto:'Nuevo segmento de clientes' },
      { titulo:'⚖️ Cambio normativo', desc:'Nueva normativa obliga a declarar el modelo 347 para operaciones superiores a 3.005,06 € con un mismo tercero', efecto:'Obligación fiscal adicional' },
      { titulo:'🏦 Subida de tipos', desc:'El BCE sube los tipos de interés 0,5 puntos. Las cuotas de préstamos variables aumentan', efecto:'+0,5% coste financiero' },
      { titulo:'🤝 Feria sectorial', desc:'La Cámara de Comercio organiza una feria del sector en Sevilla. Oportunidad de captar nuevos clientes', efecto:'Oportunidad comercial' },
      { titulo:'👷 Baja de un empleado', desc:'Un empleado clave ha solicitado una baja por enfermedad de 3 semanas. Hay que reorganizar el trabajo', efecto:'Reducción de personal temporal' },
    ].map(ev => `
    <div style="padding:14px;background:var(--blanco);border:1.5px solid var(--gris-200);border-radius:var(--radio-lg);cursor:pointer;transition:all var(--transicion)"
      onmouseover="this.style.borderColor='var(--verde-400)';this.style.boxShadow='var(--sombra-md)'"
      onmouseout="this.style.borderColor='var(--gris-200)';this.style.boxShadow=''"
      onclick="lanzarEventoDemo('${ev.titulo}','${ev.desc}','${ev.efecto}')">
      <div style="font-size:.95rem;font-weight:700;color:var(--gris-800);margin-bottom:6px">${ev.titulo}</div>
      <div style="font-size:.8rem;color:var(--gris-600);line-height:1.5;margin-bottom:8px">${ev.desc}</div>
      <div style="font-size:.72rem;color:var(--verde-700);font-weight:600">Efecto: ${ev.efecto}</div>
    </div>`).join('')}
  </div>

  <!-- Historial de eventos -->
  ${EMPRESA_STATE.mercado.eventos.length > 0 ? `
  <div class="ficha-card">
    <div class="ficha-card-header"><span>📜</span> Eventos lanzados</div>
    ${EMPRESA_STATE.mercado.eventos.map(ev => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--gris-50)">
      <div style="width:8px;height:8px;border-radius:50%;background:${ev.activo?'var(--verde-500)':'var(--gris-300)'}"></div>
      <div style="flex:1">
        <div style="font-size:.82rem;font-weight:600;color:var(--gris-800)">${ev.titulo}</div>
        <div style="font-size:.72rem;color:var(--gris-500)">${ev.descripcion}</div>
      </div>
      <div style="font-size:.72rem;color:var(--gris-400)">${ev.fecha}</div>
    </div>`).join('')}
  </div>` : ''}`;
}


/* ============================================================
   SECCIÓN: EMPRENDIMIENTO Y DIRECCIÓN — RA1 · RA2 · Dirección
   ============================================================ */
