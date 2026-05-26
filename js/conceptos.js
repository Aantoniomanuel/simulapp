function vistaConceptos() {
  const state = cs();

  if (state.vista === 'concepto-prof' && state._profSelId) {
    return _conceptosVistaConceptoProf();
  }
  if (state.vista === 'modulo' && state.modulo) {
    return _conceptosVistaMod();
  }
  if (state.vista === 'buscar' && state.busqueda) {
    return _conceptosVistaBuscar();
  }
  return _conceptosVistaIndice();
}

/* ─────────────────────────────────────────────
   VISTA ÍNDICE — cuadrícula de bloques temáticos
───────────────────────────────────────────── */
function _conceptosVistaIndice() {
  const state = cs();

  /* Estadísticas globales */
  const allMods    = Object.keys(AYUDA_CONTENIDO).filter(k => k !== 'default');
  const totalFichas = allMods.reduce((s,k) => s + (AYUDA_CONTENIDO[k].tabs?.length||0), 0);
  const leidasFichas = Object.keys(state.leidos).length;
  const pctGlobal   = totalFichas > 0 ? Math.round(leidasFichas / totalFichas * 100) : 0;

  /* Filtro por RA */
  const ras = ['todos','RA1','RA2','RA3','RA4','RA5','RA6'];
  const filtroHtml = `
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
    ${ras.map(ra => `
    <button onclick="window.CONCEPTOS_STATE.filtroRA='${ra}';renderVista('conceptos')"
      style="padding:5px 12px;border:1.5px solid ${state.filtroRA===ra?'var(--verde-500)':'var(--gris-200)'};
        border-radius:20px;font-size:.78rem;font-weight:${state.filtroRA===ra?700:500};
        background:${state.filtroRA===ra?'var(--verde-600)':'var(--blanco)'};
        color:${state.filtroRA===ra?'white':'var(--gris-600)'};cursor:pointer;transition:all .15s">
      ${ra === 'todos' ? '📚 Todos' : ra}
    </button>`).join('')}
  </div>`;

  /* Filtrar bloques por RA seleccionado */
  const bloquesFiltrados = state.filtroRA === 'todos'
    ? CONCEPTOS_BLOQUES
    : CONCEPTOS_BLOQUES.filter(b => b.ra.includes(state.filtroRA));

  const bloquesHtml = bloquesFiltrados.map(bloque => {
    const modsDelBloque = bloque.modulos
      .filter(k => AYUDA_CONTENIDO[k])
      .filter(k => state.filtroRA === 'todos'
        ? true
        : (AYUDA_CONTENIDO[k].modulo||'').includes(state.filtroRA)
          || bloque.ra.includes(state.filtroRA));

    if (modsDelBloque.length === 0) return '';

    const modsHtml = modsDelBloque.map(key => {
      const m  = AYUDA_CONTENIDO[key];
      const st = _cLeidos(key);
      const pct = st.total > 0 ? Math.round(st.leidos/st.total*100) : 0;
      return `
      <div onclick="window.CONCEPTOS_STATE.vista='modulo';window.CONCEPTOS_STATE.modulo='${key}';window.CONCEPTOS_STATE.tabIdx=0;renderVista('conceptos')"
        style="background:var(--blanco);border:1.5px solid ${pct===100?'var(--verde-300)':'var(--gris-100)'};
          border-radius:var(--radio-md);padding:12px 14px;cursor:pointer;
          transition:all .18s;display:flex;flex-direction:column;gap:6px"
        onmouseover="this.style.borderColor='var(--verde-400)';this.style.transform='translateY(-1px)'"
        onmouseout="this.style.borderColor='${pct===100?'var(--verde-300)':'var(--gris-100)'}';this.style.transform=''">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.1rem">${m.icono}</span>
          <span style="font-size:.85rem;font-weight:600;color:var(--gris-900);flex:1;line-height:1.3">${m.titulo}</span>
          ${pct===100 ? '<span style="font-size:.7rem;color:var(--verde-600);font-weight:700">✓</span>' : ''}
        </div>
        <div style="font-size:.72rem;color:var(--gris-400);line-height:1.4">${m.modulo}</div>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="flex:1;height:3px;background:var(--gris-100);border-radius:2px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${pct===100?'var(--verde-500)':'var(--verde-300)'};border-radius:2px;transition:width .4s"></div>
          </div>
          <span style="font-size:.7rem;color:var(--gris-400);white-space:nowrap">${st.leidos}/${st.total} fichas</span>
        </div>
      </div>`;
    }).join('');

    return `
    <div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:1.1rem">${bloque.icono}</span>
        <span style="font-size:.82rem;font-weight:700;color:${bloque.color};text-transform:uppercase;letter-spacing:.06em">${bloque.label}</span>
        <div style="flex:1;height:1px;background:var(--gris-100);margin-left:4px"></div>
        ${bloque.ra.map(r=>`<span class="ra-chip" style="font-size:.65rem">${r}</span>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">
        ${modsHtml}
      </div>
    </div>`;
  }).join('');

  return `
  <div class="seccion-header" style="margin-bottom:0">
    <div>
      <h2>📚 Conceptos clave</h2>
      <p>Fichas de estudio organizadas por bloque temático y Resultado de Aprendizaje</p>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <div style="text-align:right">
        <div style="font-size:1.1rem;font-weight:700;color:var(--verde-600)">${pctGlobal}%</div>
        <div style="font-size:.68rem;color:var(--gris-400)">${leidasFichas}/${totalFichas} fichas leídas</div>
      </div>
      ${APP.rolActivo !== 'alumno' ? `
      <button class="btn-accion" style="padding:7px 14px;font-size:.82rem;display:flex;align-items:center;gap:6px"
        onclick="abrirModalConceptoProf()">
        ✨ Añadir concepto
      </button>` : ''}
    </div>
  </div>

  <!-- Barra de progreso global -->
  <div style="height:5px;background:var(--gris-100);border-radius:3px;margin:10px 0 16px;overflow:hidden">
    <div style="width:${pctGlobal}%;height:100%;background:var(--verde-500);border-radius:3px;transition:width .5s"></div>
  </div>

  <!-- Buscador -->
  <div style="position:relative;margin-bottom:16px">
    <input type="text" placeholder="Buscar concepto... (ej: amortización, DAFO, nómina)"
      value="${state.busqueda}"
      style="width:100%;padding:9px 14px 9px 36px;border:1.5px solid var(--gris-200);border-radius:var(--radio-md);
        font-size:.85rem;font-family:var(--fuente-cuerpo);background:var(--blanco)"
      oninput="window.CONCEPTOS_STATE.busqueda=this.value;
        if(this.value.length>1){window.CONCEPTOS_STATE.vista='buscar';renderVista('conceptos')}
        else{window.CONCEPTOS_STATE.vista='indice';renderVista('conceptos')}">
    <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:.9rem;pointer-events:none">🔍</span>
  </div>

  ${filtroHtml}

  <!-- Conceptos publicados por el docente -->
  ${_conceptosProfBloque()}

  ${bloquesHtml}

  <!-- Modal creación de concepto (profesor) -->
  ${_modalConceptoProf()}
  `;
}

/* ─────────────────────────────────────────────
   BLOQUE DE CONCEPTOS DEL DOCENTE (índice)
───────────────────────────────────────────── */
function _conceptosProfBloque() {
  const publicados = (window.CONCEPTOS_STATE.conceptosProfesor || []).filter(c => c.publicado);
  if (publicados.length === 0) return '';

  return `
  <div style="margin-bottom:20px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <span style="font-size:1.1rem">✨</span>
      <span style="font-size:.82rem;font-weight:700;color:#be185d;text-transform:uppercase;letter-spacing:.06em">Añadidos por el docente</span>
      <div style="flex:1;height:1px;background:var(--gris-100);margin-left:4px"></div>
      <span class="ra-chip" style="background:#fce7f3;color:#9d174d;border-color:#fbcfe8">${publicados.length} concepto${publicados.length>1?'s':''}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">
      ${publicados.map(c => `
      <div onclick="window.CONCEPTOS_STATE.vista='concepto-prof';window.CONCEPTOS_STATE._profSelId='${c.id}';renderVista('conceptos')"
        style="background:var(--blanco);border:1.5px solid #fbcfe8;border-radius:var(--radio-md);
          padding:12px 14px;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;gap:6px"
        onmouseover="this.style.borderColor='#ec4899';this.style.transform='translateY(-1px)'"
        onmouseout="this.style.borderColor='#fbcfe8';this.style.transform=''">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.1rem">${c.icono||'📌'}</span>
          <span style="font-size:.85rem;font-weight:600;color:var(--gris-900);flex:1;line-height:1.3">${c.termino}</span>
        </div>
        <div style="font-size:.72rem;color:var(--gris-400);line-height:1.4">${c.modulo||'Concepto docente'}</div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          ${c.ra?`<span class="ra-chip" style="font-size:.65rem">${c.ra}</span>`:''}
          <span style="font-size:.68rem;color:var(--gris-300)">${c.fecha||''}</span>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

/* ─────────────────────────────────────────────
   VISTA DETALLE — concepto del docente
───────────────────────────────────────────── */
function _conceptosVistaConceptoProf() {
  const state = window.CONCEPTOS_STATE;
  const c = (state.conceptosProfesor||[]).find(x => x.id === state._profSelId);
  if (!c) { state.vista = 'indice'; return vistaConceptos(); }
  const esProf = APP.rolActivo !== 'alumno';

  return `
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:1.25rem;flex-wrap:wrap">
    <button class="btn-secundario" style="padding:5px 12px;font-size:.78rem"
      onclick="window.CONCEPTOS_STATE.vista='indice';renderVista('conceptos')">
      ← Conceptos clave
    </button>
    <span style="font-size:.75rem;padding:3px 10px;border-radius:20px;background:#fce7f3;color:#9d174d;font-weight:600">✨ Docente</span>
    ${c.ra?`<span class="ra-chip">${c.ra}</span>`:''}
    ${esProf ? `
    <div style="margin-left:auto;display:flex;gap:8px">
      <button class="btn-secundario" style="padding:5px 12px;font-size:.78rem;color:#9333ea;border-color:#e9d5ff"
        onclick="editarConceptoProf('${c.id}')">✏️ Editar</button>
      <button class="btn-secundario" style="padding:5px 12px;font-size:.78rem;
        color:${c.publicado?'#dc2626':'var(--verde-700)'};
        border-color:${c.publicado?'#fca5a5':'var(--verde-300)'}"
        onclick="togglePublicarConcepto('${c.id}')">
        ${c.publicado ? '🙈 Despublicar' : '📢 Publicar'}
      </button>
      <button class="btn-secundario" style="padding:5px 12px;font-size:.78rem;color:#dc2626;border-color:#fca5a5"
        onclick="eliminarConceptoProf('${c.id}')">🗑️ Eliminar</button>
    </div>` : ''}
  </div>

  <div class="ficha-card" style="border-color:#fbcfe8">
    <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:1rem">
      <div style="width:48px;height:48px;border-radius:12px;background:#fce7f3;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">${c.icono||'📌'}</div>
      <div>
        <h3 style="font-size:1.1rem;font-weight:700;color:var(--gris-900);margin-bottom:4px">${c.termino}</h3>
        <div style="font-size:.78rem;color:var(--gris-400)">${c.modulo||''} ${c.fecha?'· '+c.fecha:''}</div>
      </div>
    </div>
    <div style="font-size:.875rem;color:var(--gris-800);line-height:1.8;white-space:pre-line;padding:14px 16px;background:var(--gris-50);border-radius:var(--radio-md)">
      ${c.descripcion}
    </div>
  </div>`;
}

/* ─────────────────────────────────────────────
   MODAL — crear / editar concepto (profesor)
───────────────────────────────────────────── */
function _modalConceptoProf() {
  const state = window.CONCEPTOS_STATE;
  if (!state.modalProf) return '';

  const res = state.profResultado;
  const ICONOS = ['📌','💡','⚖️','💶','📊','🏢','👥','🧾','📋','🔍','⚙️','🎯','📄','🏦','💼','📈','🔬','📝'];
  const RA_OPTS = ['','RA1','RA2','RA3','RA4','RA5','RA6'];

  return `
  <div style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:1rem"
    onclick="if(event.target===this)cerrarModalConceptoProf()">
    <div style="background:var(--blanco);border-radius:var(--radio-lg);width:min(620px,95vw);max-height:90vh;overflow-y:auto;box-shadow:0 12px 48px rgba(0,0,0,.18)"
      onclick="event.stopPropagation()">

      <!-- Cabecera -->
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--gris-100);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--blanco);z-index:1">
        <div>
          <div style="font-size:1rem;font-weight:700;color:var(--gris-900)">✨ Nuevo concepto clave</div>
          <div style="font-size:.75rem;color:var(--gris-400);margin-top:2px">La IA genera la descripción — tú la revisas y publicas</div>
        </div>
        <button onclick="cerrarModalConceptoProf()" style="border:none;background:none;cursor:pointer;font-size:1.2rem;color:var(--gris-400)">✕</button>
      </div>

      <div style="padding:1.5rem;display:flex;flex-direction:column;gap:1rem">

        <!-- Buscador / entrada del término -->
        <div>
          <label style="font-size:.8rem;font-weight:600;color:var(--gris-700);display:block;margin-bottom:6px">
            Término o concepto a definir
          </label>
          <div style="display:flex;gap:8px">
            <input type="text" id="prof-concepto-input"
              placeholder="Ej: apalancamiento financiero, leasing, modelo 347..."
              value="${state.profBusqueda||''}"
              style="flex:1;padding:9px 14px;border:1.5px solid var(--gris-200);border-radius:var(--radio-md);
                font-size:.875rem;font-family:var(--fuente-cuerpo);outline:none"
              onfocus="this.style.borderColor='#ec4899'" onblur="this.style.borderColor='var(--gris-200)'"
              oninput="window.CONCEPTOS_STATE.profBusqueda=this.value"
              onkeydown="if(event.key==='Enter')generarConceptoIA()">
            <button onclick="generarConceptoIA()"
              style="padding:9px 18px;background:${state.profGenerando?'var(--gris-300)':'#be185d'};color:white;border:none;border-radius:var(--radio-md);
                font-size:.82rem;font-weight:600;cursor:${state.profGenerando?'not-allowed':'pointer'};
                display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .2s">
              ${state.profGenerando
                ? `<span style="display:inline-block;width:14px;height:14px;border:2px solid white;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite"></span> Generando...`
                : '✨ Generar con IA'}
            </button>
          </div>
          ${state.profError ? `<div style="font-size:.78rem;color:#dc2626;margin-top:6px">⚠️ ${state.profError}</div>` : ''}
          <div style="font-size:.75rem;color:var(--gris-400);margin-top:6px">
            💡 Escribe el término tal como lo usas en clase. La IA generará una descripción adaptada al ciclo de Administración y Finanzas.
          </div>
        </div>

        <!-- Resultado generado -->
        ${res ? `
        <div style="border:1.5px solid #fbcfe8;border-radius:var(--radio-lg);overflow:hidden">
          <div style="padding:10px 14px;background:#fce7f3;display:flex;align-items:center;justify-content:space-between;gap:8px">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.1rem" id="prof-icono-sel">${res.icono||'📌'}</span>
              <span style="font-size:.82rem;font-weight:700;color:#9d174d">Vista previa del concepto</span>
            </div>
            <button onclick="generarConceptoIA()" style="border:none;background:transparent;cursor:pointer;font-size:.75rem;color:#be185d;font-weight:600;text-decoration:underline">
              🔄 Regenerar
            </button>
          </div>

          <div style="padding:1rem 1.25rem;display:flex;flex-direction:column;gap:10px">
            <!-- Término editable -->
            <div>
              <label style="font-size:.75rem;font-weight:600;color:var(--gris-500);display:block;margin-bottom:4px">Término</label>
              <input type="text" value="${res.termino||''}"
                style="width:100%;padding:7px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.875rem;font-family:var(--fuente-cuerpo);font-weight:600;outline:none"
                onfocus="this.style.borderColor='#ec4899'" onblur="this.style.borderColor='var(--gris-200)'"
                oninput="window.CONCEPTOS_STATE.profResultado.termino=this.value">
            </div>

            <!-- Descripción editable -->
            <div>
              <label style="font-size:.75rem;font-weight:600;color:var(--gris-500);display:block;margin-bottom:4px">Descripción (editable)</label>
              <textarea id="prof-desc-textarea"
                style="width:100%;padding:10px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);
                  font-size:.82rem;font-family:var(--fuente-cuerpo);resize:vertical;min-height:140px;outline:none;line-height:1.7"
                onfocus="this.style.borderColor='#ec4899'" onblur="this.style.borderColor='var(--gris-200)'"
                oninput="window.CONCEPTOS_STATE.profResultado.descripcion=this.value"
              >${res.descripcion||''}</textarea>
            </div>

            <!-- Metadatos: RA, módulo, icono -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div>
                <label style="font-size:.75rem;font-weight:600;color:var(--gris-500);display:block;margin-bottom:4px">RA vinculado</label>
                <select style="width:100%;padding:7px 10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo);outline:none"
                  onfocus="this.style.borderColor='#ec4899'" onblur="this.style.borderColor='var(--gris-200)'"
                  onchange="window.CONCEPTOS_STATE.profResultado.ra=this.value">
                  ${RA_OPTS.map(r=>`<option value="${r}" ${res.ra===r?'selected':''}>${r||'Sin RA específico'}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="font-size:.75rem;font-weight:600;color:var(--gris-500);display:block;margin-bottom:4px">Bloque / módulo</label>
                <input type="text" value="${res.modulo||''}"
                  placeholder="Ej: Finanzas · RA4"
                  style="width:100%;padding:7px 10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo);outline:none"
                  onfocus="this.style.borderColor='#ec4899'" onblur="this.style.borderColor='var(--gris-200)'"
                  oninput="window.CONCEPTOS_STATE.profResultado.modulo=this.value">
              </div>
            </div>

            <!-- Selector de icono -->
            <div>
              <label style="font-size:.75rem;font-weight:600;color:var(--gris-500);display:block;margin-bottom:6px">Icono</label>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${ICONOS.map(ico=>`
                <button onclick="window.CONCEPTOS_STATE.profResultado.icono='${ico}';document.getElementById('prof-icono-sel').textContent='${ico}';renderVista('conceptos')"
                  style="width:34px;height:34px;border:2px solid ${(res.icono||'📌')===ico?'#be185d':'var(--gris-200)'};
                    border-radius:var(--radio-sm);font-size:1rem;cursor:pointer;
                    background:${(res.icono||'📌')===ico?'#fce7f3':'var(--blanco)'};transition:all .15s">
                  ${ico}
                </button>`).join('')}
              </div>
            </div>
          </div>
        </div>` : ''}

      </div>

      <!-- Pie del modal -->
      <div style="padding:1rem 1.5rem;border-top:1px solid var(--gris-100);display:flex;gap:8px;justify-content:flex-end;position:sticky;bottom:0;background:var(--blanco)">
        <button class="btn-secundario" onclick="cerrarModalConceptoProf()">Cancelar</button>
        ${res ? `
        <button class="btn-secundario" style="color:#9333ea;border-color:#e9d5ff"
          onclick="guardarConceptoProf(false)">
          💾 Guardar borrador
        </button>
        <button class="btn-accion" style="background:#be185d;padding:9px 20px"
          onclick="guardarConceptoProf(true)">
          📢 Guardar y publicar
        </button>` : ''}
      </div>
    </div>
  </div>`;
}

/* ─────────────────────────────────────────────
   ACCIONES — profesor
───────────────────────────────────────────── */
function abrirModalConceptoProf(idEditar) {
  const state = window.CONCEPTOS_STATE;
  if (idEditar) {
    const c = state.conceptosProfesor.find(x=>x.id===idEditar);
    if (c) state.profResultado = { ...c };
    state.profBusqueda = c ? c.termino : '';
  } else {
    state.profResultado = null;
    state.profBusqueda  = '';
    state.profError     = '';
  }
  state.modalProf     = true;
  state.profGenerando = false;
  renderVista('conceptos');
}

function cerrarModalConceptoProf() {
  window.CONCEPTOS_STATE.modalProf = false;
  renderVista('conceptos');
}

async function generarConceptoIA() {
  const state = window.CONCEPTOS_STATE;
  const termino = (document.getElementById('prof-concepto-input')?.value || state.profBusqueda || '').trim();
  if (!termino) {
    state.profError = 'Escribe el término que quieres definir.';
    renderVista('conceptos');
    return;
  }
  state.profBusqueda  = termino;
  state.profGenerando = true;
  state.profError     = '';
  state.profResultado = null;
  renderVista('conceptos');

  try {
    const prompt = `Eres un docente experto en Administración y Finanzas (ciclo formativo de grado superior, BOJA Andalucía). 
Genera una ficha de concepto clave para el término: "${termino}".

Responde SOLO con un objeto JSON sin formato markdown, con esta estructura exacta:
{
  "termino": "nombre del concepto (corregido si hay erratas)",
  "descripcion": "explicación clara en 3-5 párrafos, usando lenguaje accesible para alumnos de 2º de CFGS. Incluye: definición, para qué sirve, ejemplo práctico relacionado con una empresa simulada y, si procede, cómo se trabaja en Contasol/Factusol/Nominasol. Usa saltos de línea entre párrafos.",
  "ra": "RA más relacionado (RA1-RA6 del módulo 0656, o vacío si es transversal)",
  "modulo": "bloque temático corto: ej 'Finanzas · RA4', 'Fiscal · RA5', 'RRHH · RA6'",
  "icono": "un único emoji representativo del concepto"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const texto = (data.content || []).find(b => b.type === 'text')?.text || '';
    // Limpiar posibles bloques markdown
    const jsonLimpio = texto.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonLimpio);

    state.profResultado = {
      termino:     parsed.termino     || termino,
      descripcion: parsed.descripcion || '',
      ra:          parsed.ra          || '',
      modulo:      parsed.modulo      || '',
      icono:       parsed.icono       || '📌',
    };
    state.profError = '';
  } catch (err) {
    state.profError = 'No se pudo generar la descripción. Comprueba la conexión o inténtalo de nuevo.';
    console.error('generarConceptoIA error:', err);
  } finally {
    state.profGenerando = false;
    renderVista('conceptos');
  }
}

function guardarConceptoProf(publicar) {
  const state = window.CONCEPTOS_STATE;
  const res   = state.profResultado;
  if (!res || !res.termino || !res.descripcion) {
    mostrarToast('Completa al menos el término y la descripción','error');
    return;
  }
  // Actualizar descripción desde textarea por si hubo edición sin onblur
  const ta = document.getElementById('prof-desc-textarea');
  if (ta) res.descripcion = ta.value;

  const existente = state.conceptosProfesor.find(c => c.id === res.id);
  if (existente) {
    Object.assign(existente, { ...res, publicado: publicar, fecha: new Date().toLocaleDateString('es-ES') });
  } else {
    state.conceptosProfesor.push({
      ...res,
      id:       'cp' + Date.now(),
      publicado: publicar,
      fecha:    new Date().toLocaleDateString('es-ES'),
    });
  }
  state.modalProf = false;
  mostrarToast(publicar ? '📢 Concepto publicado para los alumnos' : '💾 Concepto guardado como borrador', publicar ? 'exito' : '');
  renderVista('conceptos');
}

function editarConceptoProf(id) {
  abrirModalConceptoProf(id);
}

function togglePublicarConcepto(id) {
  const c = window.CONCEPTOS_STATE.conceptosProfesor.find(x=>x.id===id);
  if (!c) return;
  c.publicado = !c.publicado;
  mostrarToast(c.publicado ? '📢 Concepto publicado' : '🙈 Concepto ocultado a los alumnos', c.publicado ? 'exito' : '');
  renderVista('conceptos');
}

function eliminarConceptoProf(id) {
  if (!confirm('¿Eliminar este concepto?')) return;
  window.CONCEPTOS_STATE.conceptosProfesor = window.CONCEPTOS_STATE.conceptosProfesor.filter(c=>c.id!==id);
  window.CONCEPTOS_STATE.vista = 'indice';
  mostrarToast('Concepto eliminado','');
  renderVista('conceptos');
}

/* ─────────────────────────────────────────────
   VISTA MÓDULO — fichas con tabs y conceptos
───────────────────────────────────────────── */
function _conceptosVistaMod() {
  const state  = cs();
  const key    = state.modulo;
  const m      = AYUDA_CONTENIDO[key];
  if (!m) { state.vista = 'indice'; return vistaConceptos(); }

  const tabIdx = state.tabIdx || 0;
  const tab    = m.tabs[tabIdx];
  const st     = _cLeidos(key);

  /* Marcar como leída la ficha actual */
  conceptoLeer(key, tabIdx);

  /* Bloque al que pertenece este módulo */
  const bloque = CONCEPTOS_BLOQUES.find(b => b.modulos.includes(key));

  /* Navegar a módulo relacionado */
  const moduloDestino = {
    'empresa':       'empresa',
    'tramites':      'empresa',
    'plan-ap1':      'plan-empresa',
    'plan-ap2':      'plan-empresa',
    'plan-ap3':      'plan-empresa',
    'plan-ap4':      'plan-empresa',
    'plan-ap5':      'plan-empresa',
    'plan-ap6':      'plan-empresa',
    'plan-ap7':      'plan-empresa',
    'plan-ap8':      'plan-empresa',
    'emprendimiento':'emprendimiento',
    'gestion':       'gestion',
    'mensajeria':    'mensajeria',
    'mercado':       'mercado',
    'tareas':        'tareas',
    'nominasol':     'programas',
    'contasol':      'programas',
    'factusol':      'programas',
    'defensa':       'defensa',
    'dossier':       'dossier',
    'autoevaluacion':'autoevaluacion',
    'ranking':       'ranking',
  };

  /* Módulos del mismo bloque para navegación lateral */
  const hermanosKeys = bloque
    ? bloque.modulos.filter(k => k !== key && AYUDA_CONTENIDO[k])
    : [];

  const tabsHtml = m.tabs.map((t, i) => {
    const leidaEsta = cs().leidos[`${key}-${i}`];
    return `
    <button onclick="window.CONCEPTOS_STATE.tabIdx=${i};renderVista('conceptos')"
      style="padding:7px 14px;border:none;border-radius:var(--radio-md);font-size:.8rem;
        font-weight:${i===tabIdx?700:500};cursor:pointer;
        background:${i===tabIdx?'var(--verde-600)':'var(--gris-100)'};
        color:${i===tabIdx?'white':'var(--gris-600)'};transition:all .15s;
        display:flex;align-items:center;gap:5px">
      ${t.label}
      ${leidaEsta ? '<span style="font-size:.65rem;opacity:.8">✓</span>' : ''}
    </button>`;
  }).join('');

  return `
  <!-- Breadcrumb + back -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
    <button onclick="window.CONCEPTOS_STATE.vista='indice';window.CONCEPTOS_STATE.modulo=null;renderVista('conceptos')"
      style="background:none;border:none;cursor:pointer;color:var(--verde-600);font-size:.82rem;font-weight:600;
        display:flex;align-items:center;gap:4px">
      ← Conceptos clave
    </button>
    <span style="color:var(--gris-300)">›</span>
    ${bloque ? `<span style="font-size:.78rem;color:var(--gris-500)">${bloque.icono} ${bloque.label}</span><span style="color:var(--gris-300)">›</span>` : ''}
    <span style="font-size:.78rem;color:var(--gris-700);font-weight:600">${m.icono} ${m.titulo}</span>
  </div>

  <!-- Header del módulo -->
  <div class="card" style="margin-bottom:14px;padding:14px 16px;background:var(--verde-900);color:white">
    <div style="display:flex;align-items:center;gap:12px">
      <span style="font-size:1.8rem">${m.icono}</span>
      <div style="flex:1">
        <div style="font-size:1rem;font-weight:700;margin-bottom:2px">${m.titulo}</div>
        <div style="font-size:.78rem;color:var(--verde-300)">${m.modulo}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:.75rem;color:var(--verde-300);margin-bottom:4px">${st.leidos}/${st.total} fichas leídas</div>
        <div style="width:80px;height:4px;background:rgba(255,255,255,.2);border-radius:2px;overflow:hidden;margin-left:auto">
          <div style="width:${st.total>0?Math.round(st.leidos/st.total*100):0}%;height:100%;background:var(--verde-300);border-radius:2px;transition:width .4s"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs de fichas -->
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
    ${tabsHtml}
  </div>

  <!-- Contenido de la ficha activa -->
  <div class="card" style="padding:18px 20px;min-height:200px">
    ${tab ? tab.html() : '<div style="color:var(--gris-400)">Sin contenido</div>'}
  </div>

  <!-- Navegación entre fichas -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
    <div style="display:flex;gap:6px">
      ${tabIdx > 0 ? `
      <button onclick="window.CONCEPTOS_STATE.tabIdx=${tabIdx-1};renderVista('conceptos')"
        class="btn-secundario" style="font-size:.8rem;padding:6px 12px">
        ← Ficha anterior
      </button>` : ''}
      ${tabIdx < m.tabs.length-1 ? `
      <button onclick="window.CONCEPTOS_STATE.tabIdx=${tabIdx+1};renderVista('conceptos')"
        class="btn-accion" style="font-size:.8rem;padding:6px 12px">
        Siguiente ficha →
      </button>` : ''}
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
      ${moduloDestino[key] ? `
      <button onclick="irA('${moduloDestino[key]}')"
        class="btn-secundario" style="font-size:.78rem;padding:6px 12px">
        ↗ Ir a ${m.titulo}
      </button>` : ''}
    </div>
  </div>

  <!-- Más fichas del mismo bloque -->
  ${hermanosKeys.length > 0 ? `
  <div style="margin-top:20px;padding-top:14px;border-top:1px solid var(--gris-100)">
    <div style="font-size:.75rem;font-weight:600;color:var(--gris-500);text-transform:uppercase;
      letter-spacing:.06em;margin-bottom:8px">
      ${bloque.icono} Más fichas de ${bloque.label}
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${hermanosKeys.map(k => {
        const mh = AYUDA_CONTENIDO[k];
        const lh = _cLeidos(k);
        return `<button onclick="window.CONCEPTOS_STATE.modulo='${k}';window.CONCEPTOS_STATE.tabIdx=0;renderVista('conceptos')"
          style="padding:6px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-md);
            font-size:.78rem;background:var(--blanco);color:var(--gris-700);cursor:pointer;
            display:flex;align-items:center;gap:5px">
          ${mh.icono} ${mh.titulo}
          ${lh.leidos===lh.total&&lh.total>0?'<span style="color:var(--verde-600);font-size:.65rem">✓</span>':''}
        </button>`;
      }).join('')}
    </div>
  </div>` : ''}`;
}

/* ─────────────────────────────────────────────
   VISTA BÚSQUEDA — resultados en tiempo real
───────────────────────────────────────────── */
function _conceptosVistaBuscar() {
  const state = cs();
  const q     = state.busqueda.toLowerCase();

  /* Buscar en títulos de módulo, subtítulo de tabs, y ayudaConcepto text */
  const resultados = [];
  Object.entries(AYUDA_CONTENIDO).forEach(([key, m]) => {
    if (key === 'default') return;
    m.tabs.forEach((tab, i) => {
      const hayLabel = tab.label.toLowerCase().includes(q);
      const hayTitulo = m.titulo.toLowerCase().includes(q);
      const hayModulo = m.modulo.toLowerCase().includes(q);
      if (hayLabel || hayTitulo || hayModulo) {
        resultados.push({ key, modulo: m, tabIdx: i, tab, score: hayTitulo ? 3 : 1 });
      }
    });
    /* Check module label for RA matches (e.g. search "RA4") */
    if (m.modulo.toLowerCase().includes(q) && !resultados.find(r => r.key === key)) {
      m.tabs.forEach((tab, i) => resultados.push({ key, modulo: m, tabIdx: i, tab, score: 0 }));
    }
  });

  resultados.sort((a,b) => b.score - a.score);
  const unicos = resultados.filter((r,i,arr) =>
    arr.findIndex(x => x.key === r.key && x.tabIdx === r.tabIdx) === i
  ).slice(0, 12);

  /* Buscar también en conceptos del profesor (publicados + borradores si es docente) */
  const esProf = APP.rolActivo !== 'alumno';
  const conceptosProf = (state.conceptosProfesor||[])
    .filter(c => esProf || c.publicado)
    .filter(c => c.termino.toLowerCase().includes(q) || c.descripcion.toLowerCase().includes(q));

  const resultsHtml = (unicos.length === 0 && conceptosProf.length === 0)
    ? `<div style="text-align:center;padding:32px;color:var(--gris-400)">
        <div style="font-size:1.5rem;margin-bottom:8px">🔍</div>
        <div>Sin resultados para "<strong>${state.busqueda}</strong>"</div>
        <div style="font-size:.8rem;margin-top:6px">Prueba con: amortización, DAFO, IVA, nómina, contrato, convenio…</div>
      </div>`
    : [
        ...conceptosProf.map(c => `
        <div onclick="window.CONCEPTOS_STATE.vista='concepto-prof';window.CONCEPTOS_STATE._profSelId='${c.id}';renderVista('conceptos')"
          style="display:flex;align-items:center;gap:12px;padding:10px 14px;
            background:var(--blanco);border:1.5px solid #fbcfe8;border-radius:var(--radio-md);
            cursor:pointer;margin-bottom:6px;transition:all .15s"
          onmouseover="this.style.borderColor='#ec4899'"
          onmouseout="this.style.borderColor='#fbcfe8'">
          <span style="font-size:1.4rem;flex-shrink:0">${c.icono||'📌'}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:.85rem;font-weight:600;color:var(--gris-900)">${c.termino}</div>
            <div style="font-size:.75rem;color:#be185d">${c.modulo||'Docente'} ${c.ra?'· '+c.ra:''}</div>
          </div>
          <span style="font-size:.7rem;padding:2px 7px;border-radius:20px;background:#fce7f3;color:#9d174d;font-weight:600">✨ Docente</span>
          <span style="font-size:.8rem;color:var(--gris-300)">›</span>
        </div>`),
        ...unicos.map(r => {
          const lh = _cLeidos(r.key);
          return `
          <div onclick="window.CONCEPTOS_STATE.vista='modulo';window.CONCEPTOS_STATE.modulo='${r.key}';window.CONCEPTOS_STATE.tabIdx=${r.tabIdx};renderVista('conceptos')"
            style="display:flex;align-items:center;gap:12px;padding:10px 14px;
              background:var(--blanco);border:1.5px solid var(--gris-100);border-radius:var(--radio-md);
              cursor:pointer;margin-bottom:6px;transition:all .15s"
            onmouseover="this.style.borderColor='var(--verde-400)'"
            onmouseout="this.style.borderColor='var(--gris-100)'">
            <span style="font-size:1.4rem;flex-shrink:0">${r.modulo.icono}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:.85rem;font-weight:600;color:var(--gris-900)">${r.tab.label}</div>
              <div style="font-size:.75rem;color:var(--gris-500)">${r.modulo.titulo} · ${r.modulo.modulo}</div>
            </div>
            ${lh.leidos > 0 ? `<span style="font-size:.7rem;color:var(--verde-600);font-weight:600">${lh.leidos}/${lh.total} ✓</span>` : ''}
            <span style="font-size:.8rem;color:var(--gris-300)">›</span>
          </div>`;
        }),
      ].join('');

  return `
  <!-- Breadcrumb -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
    <button onclick="window.CONCEPTOS_STATE.vista='indice';window.CONCEPTOS_STATE.busqueda='';renderVista('conceptos')"
      style="background:none;border:none;cursor:pointer;color:var(--verde-600);font-size:.82rem;font-weight:600">
      ← Conceptos clave
    </button>
    <span style="color:var(--gris-300)">›</span>
    <span style="font-size:.78rem;color:var(--gris-700)">Búsqueda: "${state.busqueda}"</span>
  </div>

  <!-- Buscador (persistente) -->
  <div style="position:relative;margin-bottom:16px">
    <input type="text" value="${state.busqueda}"
      placeholder="Buscar concepto..."
      style="width:100%;padding:9px 14px 9px 36px;border:1.5px solid var(--verde-300);border-radius:var(--radio-md);
        font-size:.85rem;font-family:var(--fuente-cuerpo)"
      oninput="window.CONCEPTOS_STATE.busqueda=this.value;
        if(this.value.length>1){renderVista('conceptos')}
        else{window.CONCEPTOS_STATE.vista='indice';renderVista('conceptos')}">
    <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:.9rem;pointer-events:none">🔍</span>
  </div>

  <div style="font-size:.78rem;color:var(--gris-500);margin-bottom:10px">
    ${unicos.length + conceptosProf.length} resultado${(unicos.length+conceptosProf.length)!==1?'s':''} para "<strong>${state.busqueda}</strong>"
  </div>
  ${resultsHtml}`;
}

/* ============================================================
   RANKING INTERGRUPAL — CAPA DE SINCRONIZACIÓN FIRESTORE
   ============================================================
   Arquitectura:
   - Colección Firestore: "ranking" / documento por grupoId
   - Documento: { grupoId, nombre, score, tx, facturado, tareasEv, planPct, ts }
   - En MODO_DEMO: se usan datos simulados estáticos ricos
   - En modo real: onSnapshot mantiene el ranking actualizado en tiempo real
   ============================================================ */

/* Datos demo realistas para que el ranking tenga vida */
const RANKING_DEMO = [
  { id:'G1', nombre:'Cantillana Trade S.L.',       score:0,   tx:0,  facturado:0,    tareasEv:0, planPct:0  },
  { id:'G2', nombre:'Agroservicios Vega S.L.',      score:187, tx:8,  facturado:4200, tareasEv:9, planPct:62 },
  { id:'G3', nombre:'Distribuciones Norte S.L.',    score:143, tx:6,  facturado:3100, tareasEv:7, planPct:48 },
  { id:'G4', nombre:'Cítricos Premium S.L.',        score:221, tx:11, facturado:5800, tareasEv:10,planPct:75 },
  { id:'G5', nombre:'Oleoagrocantera S.L.',          score:98,  tx:4,  facturado:1900, tareasEv:5, planPct:33 },
  { id:'G6', nombre:'Servicios Rurales Aljarafe S.L.',score:165,tx:7,  facturado:3700, tareasEv:8, planPct:55 },
];

/* Calcula los puntos del grupo propio a partir del estado local */
function rankingScorePropio() {
  const tx      = EMPRESA_STATE.mercado.transacciones || [];
  const tareas  = EMPRESA_STATE.gestion.tareas || [];
  const txComp  = tx.filter(t => t.estado === 'completada').length;
  const facturado = tx.filter(t => t.estado === 'completada').reduce((s,t)=>s+(t.total||0),0);
  const tareasEv  = tareas.filter(t => t.estado === 'evaluada').length;
  const planPct   = typeof calcProgresoPlan === 'function' ? calcProgresoPlan() : 0;
  const score     = txComp*10 + Math.round(facturado/100) + tareasEv*8 + planPct*5;
  return { score, tx: txComp, facturado, tareasEv, planPct };
}

/* Publica el estado del grupo propio en Firestore */
async function rankingPublicar() {
  if (MODO_DEMO) return;
  const grupoId = APP.perfil?.grupoId;
  if (!grupoId) return;
  const datos = rankingScorePropio();
  try {
    await firebase.firestore().collection('ranking').doc(grupoId).set({
      grupoId,
      nombre: EMPRESA_STATE.datos.nombre || 'Grupo ' + grupoId,
      ...datos,
      ts: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch(e) {
    console.warn('rankingPublicar error:', e.message);
  }
}

/* Suscripción onSnapshot — actualiza window.RANKING_DATOS en tiempo real */
let _rankingUnsub = null;
function rankingSuscribir() {
  if (MODO_DEMO) {
    rankingCargarDemo();
    return;
  }
  if (_rankingUnsub) _rankingUnsub(); // cancel previous listener
  try {
    _rankingUnsub = firebase.firestore()
      .collection('ranking')
      .orderBy('score', 'desc')
      .onSnapshot(snap => {
        window.RANKING_DATOS = snap.docs.map(d => d.data()).filter(d => d.grupoId);
        window.RANKING_TS    = Date.now();
        // Refrescar vistas que muestran el ranking si están activas
        if (APP.moduloActual === 'ranking') renderVista('ranking');
        const dash = document.getElementById('contenido-principal');
        if (dash && APP.moduloActual === 'dashboard') renderVista('dashboard');
      }, err => {
        console.warn('ranking onSnapshot error:', err.message);
      });
  } catch(e) {
    console.warn('rankingSuscribir error:', e.message);
    rankingCargarDemo();
  }
}

/* Carga (y mezcla) los datos demo enriquecidos con el estado propio real */
function rankingCargarDemo() {
  const propios = rankingScorePropio();
  const grupoId = APP.perfil?.grupoId || 'G1';
  const nombre  = EMPRESA_STATE.datos?.nombre || 'Tu empresa';
  const lista   = RANKING_DEMO.map(g => {
    if (g.id === grupoId) return { ...g, ...propios, id: grupoId, nombre };
    return { ...g };
  });
  // Si el grupo propio no está en la lista demo, añadirlo
  if (!lista.find(g => g.id === grupoId)) {
    lista.push({ id: grupoId, nombre, ...propios });
  }
  lista.sort((a,b) => b.score - a.score);
  window.RANKING_DATOS = lista;
  window.RANKING_TS    = Date.now();
}

/* Recarga manual (botón en vistaRanking) */
function rankingRecargar() {
  rankingPublicar();
  if (MODO_DEMO) { rankingCargarDemo(); renderVista('ranking'); }
}

/* Publicación automática al cambiar actividad relevante — hook en acciones clave */
const _rankingPublicarThrottled = (() => {
  let timer = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => { rankingPublicar(); rankingCargarDemo(); }, 2000);
  };
})();

/* ── Hook: publicar cuando se complete una transacción o se evalúe una tarea ── */
/* Se llama desde los lugares del código que cambian el score */
window.rankingNotificar = _rankingPublicarThrottled;

