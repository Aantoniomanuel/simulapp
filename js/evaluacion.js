function vistaDefensa() {
  const d   = EMPRESA_STATE.defensa;
  const tab = d.tabActiva;
  const pe  = EMPRESA_STATE.planEmpresa;
  const emp = EMPRESA_STATE.datos.nombre || 'vuestra empresa';

  return `
  <div class="seccion-header">
    <div>
      <h2>🎤 Defensa pública</h2>
      <p>Preparación del elevator pitch (1ª evaluación) y la presentación final del proyecto (2T) · RA4 · RA6</p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-ayuda-ctx" data-ayuda="defensa" onclick="toggleAyuda('defensa')" title="Conceptos y ayuda">❓ Ayuda</button>
    </div>
  </div>

  <!-- Tabs -->
  <div style="display:flex;gap:4px;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:6px;margin-bottom:1.25rem">
    ${[
      ['pitch',        '⚡','Elevator Pitch','1ª Evaluación · ~2 min'],
      ['presentacion', '🎯','Presentación final','2T · ~28 min'],
    ].map(([id,ico,lbl,sub])=>`
    <button onclick="EMPRESA_STATE.defensa.tabActiva='${id}';renderVista('defensa')"
      style="flex:1;padding:10px 16px;border:none;border-radius:var(--radio-md);cursor:pointer;transition:all .2s;
      background:${tab===id?'var(--verde-600)':'transparent'};text-align:center">
      <div style="font-size:1.1rem">${ico}</div>
      <div style="font-size:.875rem;font-weight:${tab===id?700:500};color:${tab===id?'white':'var(--gris-700)'};margin-top:2px">${lbl}</div>
      <div style="font-size:.7rem;color:${tab===id?'rgba(255,255,255,.75)':'var(--gris-400)'};margin-top:1px">${sub}</div>
    </button>`).join('')}
  </div>

  ${tab === 'pitch' ? tabPitch(emp, pe) : tabPresentacion(emp, pe)}
  `;
}

/* ══════════════════════════════════════════════════════
   TAB 1 — ELEVATOR PITCH
   ══════════════════════════════════════════════════════ */
function tabPitch(emp, pe) {
  const p = EMPRESA_STATE.defensa.pitch;
  const ap1 = pe.ap1 || {};
  const ap3 = pe.ap3 || {};
  const canv = EMPRESA_STATE.emprendimiento.canvas || {};

  const RUBRICA_PITCH = [
    { id:'claridad',        label:'Claridad del mensaje',        desc:'El mensaje central se entiende a la primera, sin ambigüedades' },
    { id:'impacto',         label:'Impacto y gancho inicial',    desc:'La frase de apertura capta la atención inmediatamente' },
    { id:'estructura',      label:'Estructura y coherencia',     desc:'Los 5 bloques fluyen con lógica y conectan entre sí' },
    { id:'lenguajeNoCrude', label:'Lenguaje natural y seguro',   desc:'Hablas con convicción, sin muletillas ni inseguridades' },
    { id:'contactoVisual',  label:'Contacto visual y postura',   desc:'Miras al interlocutor, postura abierta y voz adecuada' },
    { id:'ajusteTiempo',    label:'Ajuste al tiempo (~2 min)',    desc:'Ni corto ni largo: aprovechas el tiempo sin precipitarte' },
  ];
  const niveles = [
    { v:1, l:'Insuficiente', bg:'#fee2e2', col:'#991b1b' },
    { v:2, l:'En proceso',   bg:'#fef9ec', col:'#92400e' },
    { v:3, l:'Adquirido',    bg:'#dcfce7', col:'#166534' },
    { v:4, l:'Excelente',    bg:'#dbeafe', col:'#1e40af' },
  ];
  const mediaRubrica = () => {
    const vals = Object.values(p.rubrica).filter(v=>v!==null);
    return vals.length ? (vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(1) : '—';
  };

  // Importar datos del plan de empresa si existen
  const ganchoPropuesto  = ap1.lema || '';
  const problemaPropuesto = canv.propuestaValor || ap3.descripcionActividad || '';
  const solucionPropuesta = ap3.propuestaValor || ap3.productosServicios || '';

  return `
  <!-- Contexto y objetivo -->
  <div style="padding:12px 16px;background:linear-gradient(135deg,var(--verde-800),var(--verde-600));border-radius:var(--radio-lg);margin-bottom:1.25rem;color:white">
    <div style="display:flex;align-items:flex-start;gap:14px">
      <div style="font-size:2rem">⚡</div>
      <div>
        <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Elevator Pitch — 1ª Evaluación</div>
        <div style="font-size:.82rem;opacity:.9;line-height:1.5">
          Tienes <strong>2 minutos</strong> para convencer a un inversor (o al tribunal) de que tu empresa merece atención.
          Sin apoyo visual, solo tu voz y tu argumentación. Estructura el mensaje en 5 bloques de ~24 segundos cada uno.
        </div>
        <div style="display:flex;gap:16px;margin-top:10px;font-size:.78rem;opacity:.85">
          <span>⏱️ Duración objetivo: ~2 min</span>
          <span>🎯 Sin diapositivas</span>
          <span>👥 Todo el grupo participa</span>
        </div>
      </div>
    </div>
  </div>

  <div class="grid-2col" style="align-items:start">

    <!-- COLUMNA IZQUIERDA: Guión -->
    <div style="display:flex;flex-direction:column;gap:1rem">
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>📝</span> Guión del pitch
          <span style="margin-left:auto;font-size:.75rem;color:var(--gris-400)">5 bloques · ~24s cada uno</span>
          ${ap1.lema||ap3.propuestaValor ? `
          <button class="btn-secundario" style="padding:4px 10px;font-size:.72rem;margin-left:8px"
            onclick="importarDatosPitch()">⬇️ Importar del plan</button>` : ''}
        </div>

        ${[
          { id:'gancho', icono:'⚡', titulo:'1. Gancho de apertura', tiempo:'~20s',
            placeholder:'Una sola frase que deje boquiabierto al oyente. Puede ser una pregunta, un dato sorprendente o una afirmación provocadora.\nEj: "¿Sabías que el 40% de la fruta de la Vega del Guadalquivir se pierde antes de llegar al consumidor?"',
            ayuda:'La primera impresión es decisiva. Di algo que haga que el inversor deje de mirar el móvil.' },
          { id:'problema', icono:'🔍', titulo:'2. Problema o necesidad', tiempo:'~25s',
            placeholder:'Describe el problema real que existe en el mercado. Cuantifícalo si puedes: cuántas personas lo sufren, qué dinero se pierde, qué ineficiencia existe.\nEj: "Los pequeños agricultores de la comarca necesitan un canal directo al consumidor sin intermediarios que se llevan el 60% del margen."',
            ayuda:'El problema debe ser real, reconocible y relevante. Si el oyente no lo ve como problema, no le interesará tu solución.' },
          { id:'solucion', icono:'💡', titulo:'3. Tu solución y propuesta de valor', tiempo:'~25s',
            placeholder:'Explica qué hace tu empresa, para quién y por qué es mejor que lo que ya existe. Una frase concisa y memorable.\nEj: "Somos una plataforma de venta directa que conecta al agricultor con el restaurante en menos de 24 horas, con trazabilidad completa del producto."',
            ayuda:'No expliques cómo funciona técnicamente. Di QUÉ problema resuelves y POR QUÉ vosotros sois la solución.' },
          { id:'modeloNegocio', icono:'💶', titulo:'4. Modelo de negocio y tracción', tiempo:'~25s',
            placeholder:'¿Cómo ganáis dinero? ¿Quiénes son vuestros clientes y cuánto pagan? ¿Tenéis ya ventas, usuarios o acuerdos firmados?\nEj: "Cobramos una comisión del 8% por transacción. En el primer trimestre hemos firmado acuerdos con 12 agricultores y 5 restaurantes de Sevilla."',
            ayuda:'Los inversores preguntan siempre "¿cómo ganáis dinero?". Tenlo clarísimo y respóndelo antes de que lo pregunten.' },
          { id:'cierreCall', icono:'🎯', titulo:'5. Cierre y llamada a la acción', tiempo:'~25s',
            placeholder:'¿Qué pedís al oyente? ¿Una reunión, una inversión, un cliente piloto? Termina con una frase que quede grabada.\nEj: "Buscamos un mentor del sector con quien escalar al resto de Andalucía en 2026. ¿Hablamos esta semana?"',
            ayuda:'Siempre termina con una petición concreta. Sin llamada a la acción, el pitch queda en el aire y se olvida en 5 minutos.' },
        ].map(bloque => `
        <div style="border:1px solid var(--gris-100);border-radius:var(--radio-md);overflow:hidden;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--gris-50);border-bottom:1px solid var(--gris-100)">
            <span style="font-size:1rem">${bloque.icono}</span>
            <span style="font-size:.84rem;font-weight:700;color:var(--gris-800);flex:1">${bloque.titulo}</span>
            <span style="font-size:.72rem;color:var(--gris-400);background:var(--gris-100);padding:2px 8px;border-radius:20px">${bloque.tiempo}</span>
          </div>
          <div style="padding:6px 12px 4px;font-size:.72rem;color:var(--gris-500);font-style:italic;border-bottom:1px solid var(--gris-50)">
            💡 ${bloque.ayuda}
          </div>
          <textarea
            placeholder="${bloque.placeholder}"
            style="width:100%;padding:10px 12px;border:none;outline:none;font-size:.82rem;
            font-family:var(--fuente-cuerpo);resize:vertical;min-height:80px;line-height:1.6;
            background:var(--blanco);color:var(--gris-900)"
            oninput="EMPRESA_STATE.defensa.pitch['${bloque.id}']=this.value"
            onfocus="this.style.background='var(--verde-50)'" onblur="this.style.background='var(--blanco)'"
          >${p[bloque.id]||''}</textarea>
        </div>`).join('')}

        <!-- Notas de mejora -->
        <div style="margin-top:4px">
          <label style="font-size:.78rem;font-weight:600;color:var(--gris-600);display:block;margin-bottom:4px">📌 Notas y mejoras tras los ensayos</label>
          <textarea placeholder="Escribe aquí lo que debes mejorar, palabras a evitar, puntos donde te trabas..."
            style="width:100%;padding:8px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);
            font-size:.82rem;font-family:var(--fuente-cuerpo);resize:vertical;min-height:64px;outline:none;line-height:1.5"
            onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
            oninput="EMPRESA_STATE.defensa.pitch.notas=this.value"
          >${p.notas||''}</textarea>
        </div>
      </div>
    </div>

    <!-- COLUMNA DERECHA: Cronómetro + Rúbrica + Ensayos -->
    <div style="display:flex;flex-direction:column;gap:1rem">

      <!-- Cronómetro de ensayo -->
      <div class="ficha-card" id="card-cronometro-pitch">
        <div class="ficha-card-header"><span>⏱️</span> Cronómetro de ensayo</div>
        <div style="text-align:center;padding:1rem 0" id="zona-cronometro-pitch">
          <div style="font-size:3.5rem;font-weight:800;color:var(--verde-700);font-family:var(--fuente-mono,monospace);letter-spacing:.05em" id="crono-display-pitch">2:00</div>
          <div style="font-size:.78rem;color:var(--gris-400);margin-top:4px">Objetivo: 2 minutos</div>
          <div style="display:flex;justify-content:center;gap:8px;margin-top:14px">
            <button class="btn-accion" id="btn-crono-pitch" onclick="cronoToggle('pitch',120)"
              style="padding:8px 24px;font-size:.875rem">▶ Iniciar ensayo</button>
            <button class="btn-secundario" onclick="cronoReset('pitch',120)" style="padding:8px 14px">↺</button>
            <button class="btn-accion" style="background:#1e40af;padding:8px 16px;font-size:.82rem"
              onclick="guardarEnsayo('pitch')">💾 Guardar</button>
          </div>
          <div style="margin-top:12px;height:6px;background:var(--gris-100);border-radius:3px;overflow:hidden">
            <div id="crono-barra-pitch" style="height:100%;width:0%;background:var(--verde-500);border-radius:3px;transition:width .5s"></div>
          </div>
        </div>

        <!-- Historial de ensayos -->
        ${p.ensayos.length>0 ? `
        <div style="border-top:1px solid var(--gris-100);padding-top:10px;margin-top:8px">
          <div style="font-size:.75rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Ensayos realizados</div>
          <div style="display:flex;flex-direction:column;gap:4px;max-height:130px;overflow-y:auto">
            ${p.ensayos.slice(-5).reverse().map((e,i)=>`
            <div style="display:flex;align-items:center;gap:8px;padding:5px 8px;background:var(--gris-50);border-radius:var(--radio-sm);font-size:.78rem">
              <span style="color:var(--gris-400)">${e.fecha}</span>
              <span style="font-family:var(--fuente-mono,monospace);font-weight:700;color:${e.duracion<=130?'var(--verde-700)':'#dc2626'}">${Math.floor(e.duracion/60)}:${String(e.duracion%60).padStart(2,'0')}</span>
              ${e.nota?`<span style="font-size:.72rem;color:var(--gris-600);flex:1">${e.nota}</span>`:''}
              <button onclick="EMPRESA_STATE.defensa.pitch.ensayos.splice(${p.ensayos.length-1-i},1);renderVista('defensa')"
                style="border:none;background:none;cursor:pointer;color:var(--gris-300);font-size:.72rem">✕</button>
            </div>`).join('')}
          </div>
        </div>` : ''}
      </div>

      <!-- Rúbrica de autoevaluación del pitch -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>🪞</span> Autoevaluación del pitch
          <span style="margin-left:auto;font-size:.82rem;font-weight:700;padding:3px 10px;border-radius:20px;
            background:${mediaRubrica()==='—'?'var(--gris-100)':'var(--verde-50)'};
            color:${mediaRubrica()==='—'?'var(--gris-400)':'var(--verde-700)'}">
            Media: ${mediaRubrica()}
          </span>
        </div>
        <div style="font-size:.75rem;color:var(--gris-500);margin-bottom:8px">Tras cada ensayo, puntúate honestamente del 1 al 4:</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${RUBRICA_PITCH.map(r=>`
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px">
              <span style="font-size:.8rem;font-weight:600;color:var(--gris-800)">${r.label}</span>
              ${p.rubrica[r.id]?`<span style="font-size:.72rem;padding:2px 8px;border-radius:20px;background:${niveles[p.rubrica[r.id]-1].bg};color:${niveles[p.rubrica[r.id]-1].col};font-weight:700">${niveles[p.rubrica[r.id]-1].l}</span>`:''}
            </div>
            <div style="font-size:.72rem;color:var(--gris-400);margin-bottom:4px">${r.desc}</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px">
              ${niveles.map(n=>`
              <button onclick="EMPRESA_STATE.defensa.pitch.rubrica['${r.id}']=${p.rubrica[r.id]===n.v?null:n.v};renderVista('defensa')"
                style="padding:5px;border:2px solid ${p.rubrica[r.id]===n.v?n.col:n.bg};border-radius:4px;
                font-size:.72rem;font-weight:${p.rubrica[r.id]===n.v?700:400};cursor:pointer;
                background:${p.rubrica[r.id]===n.v?n.bg:'var(--blanco)'};color:${p.rubrica[r.id]===n.v?n.col:'var(--gris-500)'};
                transition:all .15s;line-height:1.2">
                ${n.v} ${n.l}
              </button>`).join('')}
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Consejos rápidos -->
      <div class="ficha-card" style="border-color:var(--verde-300)">
        <div class="ficha-card-header" style="background:var(--verde-50)"><span>💡</span> Claves para el pitch</div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:.8rem;color:var(--gris-700);line-height:1.5">
          ${[
            ['⚡','Empieza con el gancho, nunca con "Buenos días, somos..."'],
            ['🔢','Usa datos concretos: números, porcentajes, euros'],
            ['👁️','Mira a los ojos, no al suelo ni al techo'],
            ['🎯','Un mensaje central claro, no intentéis contarlo todo'],
            ['🔄','Ensayad en voz alta mínimo 5 veces antes del día'],
            ['⏱️','Si os pasáis de 2:15, recortad; si no llegáis a 1:45, añadid contenido'],
            ['😊','Mostrad pasión por el proyecto: se contagia'],
          ].map(([ico,txt])=>`
          <div style="display:flex;gap:8px;padding:6px 10px;background:var(--gris-50);border-radius:var(--radio-sm)">
            <span>${ico}</span><span>${txt}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════
   TAB 2 — PRESENTACIÓN FINAL
   ══════════════════════════════════════════════════════ */
function tabPresentacion(emp, pe) {
  const pres = EMPRESA_STATE.defensa.presentacion;

  const RUBRICA_PRES = [
    { id:'contenido',          label:'Contenido y profundidad',    desc:'Los apartados del plan están trabajados con rigor y detalle' },
    { id:'estructuraTiempo',   label:'Estructura y gestión del tiempo', desc:'Se respetan los bloques y el tiempo asignado a cada uno' },
    { id:'dominioProgramas',   label:'Dominio de Factusol/Nominasol/Contasol', desc:'Se manejan los programas con soltura y se justifican las operaciones' },
    { id:'trabajoEquipo',      label:'Coordinación del equipo',    desc:'Todos participan de forma coherente y complementaria' },
    { id:'presentacionOral',   label:'Expresión oral y claridad',  desc:'Lenguaje claro, vocabulario técnico apropiado, buena dicción' },
    { id:'respuestaPreguntas', label:'Respuesta a las preguntas',  desc:'Las respuestas son precisas, argumentadas y sin titubeos graves' },
  ];
  const niveles = [
    { v:1, l:'Insuficiente', bg:'#fee2e2', col:'#991b1b' },
    { v:2, l:'En proceso',   bg:'#fef9ec', col:'#92400e' },
    { v:3, l:'Adquirido',    bg:'#dcfce7', col:'#166534' },
    { v:4, l:'Excelente',    bg:'#dbeafe', col:'#1e40af' },
  ];
  const totalMin = pres.bloques.reduce((s,b)=>s+(parseFloat(b.duracion)||0),0);
  const mediaRub = () => {
    const vals = Object.values(pres.rubrica).filter(v=>v!==null);
    return vals.length ? (vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(1) : '—';
  };

  return `
  <!-- Cabecera presentación -->
  <div style="padding:12px 16px;background:linear-gradient(135deg,#1e3a8a,#1e40af);border-radius:var(--radio-lg);margin-bottom:1.25rem;color:white">
    <div style="display:flex;align-items:flex-start;gap:14px">
      <div style="font-size:2rem">🎯</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Presentación Final del Proyecto — 2º Trimestre</div>
        <div style="font-size:.82rem;opacity:.9;line-height:1.5">
          Exposición completa del trabajo realizado durante el curso: plan de empresa, trámites de constitución,
          gestión operativa con los programas (Factusol, Nominasol, Contasol) y análisis económico-financiero.
          El grupo defiende ante el tribunal con apoyo de presentación visual.
        </div>
        <div style="display:flex;gap:16px;margin-top:10px;font-size:.78rem;opacity:.85;flex-wrap:wrap">
          <span>⏱️ Duración total: ~28 min + preguntas</span>
          <span>🖥️ Con soporte visual (diapositivas)</span>
          <span>👥 Participación de todo el grupo</span>
          <span>❓ Turno de preguntas del tribunal</span>
        </div>
      </div>
    </div>
  </div>

  <div class="grid-2col" style="align-items:start">

    <!-- COLUMNA IZQUIERDA: Guión por bloques + preguntas -->
    <div style="display:flex;flex-direction:column;gap:1rem">

      <!-- Guión de la presentación -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>📋</span> Guión por bloques
          <span style="margin-left:auto;font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:20px;
            background:${Math.abs(totalMin-28)<=2?'var(--verde-50)':'#fef9ec'};
            color:${Math.abs(totalMin-28)<=2?'var(--verde-700)':'#92400e'}">
            Total: ${totalMin} min ${Math.abs(totalMin-28)<=2?'✓':'⚠️ objetivo: 28'}
          </span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${pres.bloques.map((b,idx)=>`
          <div style="border:1px solid var(--gris-100);border-radius:var(--radio-md);overflow:hidden">
            <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;background:var(--gris-50);border-bottom:1px solid var(--gris-100)">
              <span style="font-size:.95rem">${b.icono}</span>
              <span style="font-size:.82rem;font-weight:700;color:var(--gris-800);flex:1">${b.titulo}</span>
              <div style="display:flex;align-items:center;gap:4px">
                <input type="number" min="1" max="15" step="1" value="${b.duracion}"
                  style="width:44px;border:1.5px solid var(--gris-200);border-radius:4px;padding:3px 4px;font-size:.78rem;text-align:center;font-family:var(--fuente-cuerpo)"
                  oninput="EMPRESA_STATE.defensa.presentacion.bloques[${idx}].duracion=parseFloat(this.value)||0"
                  onblur="renderVista('defensa')">
                <span style="font-size:.72rem;color:var(--gris-400)">min</span>
              </div>
            </div>
            <textarea
              placeholder="Escribe aquí el contenido que cubriréis en este bloque: puntos clave, datos a mencionar, quién habla, qué pantalla mostráis..."
              style="width:100%;padding:8px 12px;border:none;outline:none;font-size:.8rem;
              font-family:var(--fuente-cuerpo);resize:vertical;min-height:64px;line-height:1.5;
              background:var(--blanco);color:var(--gris-900)"
              oninput="EMPRESA_STATE.defensa.presentacion.bloques[${idx}].contenido=this.value"
              onfocus="this.style.background='#eff6ff'" onblur="this.style.background='var(--blanco)'"
            >${b.contenido||''}</textarea>
          </div>`).join('')}
        </div>
      </div>

      <!-- Banco de preguntas posibles del tribunal -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>❓</span> Banco de preguntas del tribunal
          <button class="btn-secundario" style="margin-left:auto;padding:4px 10px;font-size:.72rem"
            onclick="añadirPreguntaTribunal()">+ Añadir pregunta</button>
        </div>
        <div style="font-size:.78rem;color:var(--gris-500);margin-bottom:8px">Prepara una respuesta argumentada para cada pregunta probable. El tribunal valora respuestas claras, con datos y seguras.</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${pres.preguntasPosibles.map((preg,idx)=>{
            const difCol = {baja:'#166534',media:'#92400e',alta:'#991b1b'}[preg.dificultad]||'var(--gris-600)';
            const difBg  = {baja:'#dcfce7',media:'#fef9ec',alta:'#fee2e2'}[preg.dificultad]||'var(--gris-100)';
            return `
            <div style="border:1px solid var(--gris-100);border-radius:var(--radio-md);overflow:hidden">
              <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;background:var(--gris-50);border-bottom:1px solid var(--gris-100)">
                <span style="font-size:.72rem;padding:2px 8px;border-radius:20px;background:${difBg};color:${difCol};font-weight:700;flex-shrink:0">${preg.dificultad}</span>
                <span style="font-size:.82rem;font-weight:600;color:var(--gris-800);flex:1">${preg.pregunta}</span>
                <button onclick="EMPRESA_STATE.defensa.presentacion.preguntasPosibles.splice(${idx},1);renderVista('defensa')"
                  style="border:none;background:none;cursor:pointer;color:var(--gris-300);font-size:.8rem"
                  onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color='var(--gris-300)'">✕</button>
              </div>
              <textarea
                placeholder="Escribe aquí vuestra respuesta preparada. Usa datos del plan de empresa y la gestión operativa."
                style="width:100%;padding:8px 12px;border:none;outline:none;font-size:.8rem;
                font-family:var(--fuente-cuerpo);resize:vertical;min-height:56px;line-height:1.5;
                background:${preg.respuesta?'#f0fdf4':'var(--blanco)'};color:var(--gris-900)"
                oninput="EMPRESA_STATE.defensa.presentacion.preguntasPosibles[${idx}].respuesta=this.value;if(this.value)this.style.background='#f0fdf4';else this.style.background='var(--blanco)'"
              >${preg.respuesta||''}</textarea>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- COLUMNA DERECHA: Cronómetro + Rúbrica + Checklist presentación -->
    <div style="display:flex;flex-direction:column;gap:1rem">

      <!-- Cronómetro -->
      <div class="ficha-card">
        <div class="ficha-card-header"><span>⏱️</span> Cronómetro de ensayo</div>
        <div style="text-align:center;padding:1rem 0">
          <div style="font-size:3rem;font-weight:800;color:#1e40af;font-family:var(--fuente-mono,monospace);letter-spacing:.05em" id="crono-display-pres">28:00</div>
          <div style="font-size:.78rem;color:var(--gris-400);margin-top:4px">Objetivo: 28 minutos (sin preguntas)</div>
          <div style="display:flex;justify-content:center;gap:8px;margin-top:14px">
            <button class="btn-accion" id="btn-crono-pres" onclick="cronoToggle('pres',1680)"
              style="padding:8px 24px;font-size:.875rem;background:#1e40af">▶ Iniciar ensayo</button>
            <button class="btn-secundario" onclick="cronoReset('pres',1680)" style="padding:8px 14px">↺</button>
            <button class="btn-accion" style="background:#1e40af;padding:8px 16px;font-size:.82rem"
              onclick="guardarEnsayo('pres')">💾 Guardar</button>
          </div>
          <div style="margin-top:12px;height:6px;background:var(--gris-100);border-radius:3px;overflow:hidden">
            <div id="crono-barra-pres" style="height:100%;width:0%;background:#1e40af;border-radius:3px;transition:width .5s"></div>
          </div>
        </div>
        ${pres.ensayos.length>0 ? `
        <div style="border-top:1px solid var(--gris-100);padding-top:10px;margin-top:4px">
          <div style="font-size:.72rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Ensayos</div>
          ${pres.ensayos.slice(-3).reverse().map((e,i)=>`
          <div style="display:flex;align-items:center;gap:8px;padding:5px 8px;background:var(--gris-50);border-radius:var(--radio-sm);font-size:.78rem;margin-bottom:3px">
            <span style="color:var(--gris-400)">${e.fecha}</span>
            <span style="font-family:var(--fuente-mono,monospace);font-weight:700;color:${e.duracion<=1800?'#1e40af':'#dc2626'}">${Math.floor(e.duracion/60)}:${String(e.duracion%60).padStart(2,'0')}</span>
            ${e.nota?`<span style="font-size:.72rem;color:var(--gris-600);flex:1">${e.nota}</span>`:''}
          </div>`).join('')}
        </div>` : ''}
      </div>

      <!-- Rúbrica presentación -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>🪞</span> Autoevaluación de la presentación
          <span style="margin-left:auto;font-size:.82rem;font-weight:700;padding:3px 10px;border-radius:20px;
            background:${mediaRub()==='—'?'var(--gris-100)':'#eff6ff'};color:${mediaRub()==='—'?'var(--gris-400)':'#1e40af'}">
            Media: ${mediaRub()}
          </span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${RUBRICA_PRES.map(r=>`
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px">
              <span style="font-size:.8rem;font-weight:600;color:var(--gris-800)">${r.label}</span>
              ${pres.rubrica[r.id]?`<span style="font-size:.7rem;padding:2px 7px;border-radius:20px;background:${niveles[pres.rubrica[r.id]-1].bg};color:${niveles[pres.rubrica[r.id]-1].col};font-weight:700">${niveles[pres.rubrica[r.id]-1].l}</span>`:''}
            </div>
            <div style="font-size:.7rem;color:var(--gris-400);margin-bottom:4px">${r.desc}</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px">
              ${niveles.map(n=>`
              <button onclick="EMPRESA_STATE.defensa.presentacion.rubrica['${r.id}']=${pres.rubrica[r.id]===n.v?null:n.v};renderVista('defensa')"
                style="padding:4px;border:2px solid ${pres.rubrica[r.id]===n.v?n.col:n.bg};border-radius:4px;
                font-size:.7rem;font-weight:${pres.rubrica[r.id]===n.v?700:400};cursor:pointer;
                background:${pres.rubrica[r.id]===n.v?n.bg:'var(--blanco)'};color:${pres.rubrica[r.id]===n.v?n.col:'var(--gris-500)'};
                transition:all .15s;line-height:1.2">
                ${n.v} ${n.l}
              </button>`).join('')}
            </div>
          </div>`).join('')}
        </div>
        <div style="margin-top:10px">
          <label style="font-size:.78rem;font-weight:600;color:var(--gris-600);display:block;margin-bottom:4px">Notas de mejora</label>
          <textarea placeholder="Anota qué mejorar en el próximo ensayo..."
            style="width:100%;padding:8px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);
            font-size:.8rem;font-family:var(--fuente-cuerpo);resize:vertical;min-height:56px;outline:none"
            onfocus="this.style.borderColor='#1e40af'" onblur="this.style.borderColor='var(--gris-200)'"
            oninput="EMPRESA_STATE.defensa.presentacion.notas=this.value"
          >${pres.notas||''}</textarea>
        </div>
      </div>

      <!-- Checklist de preparación -->
      <div class="ficha-card" style="border-color:#bfdbfe">
        <div class="ficha-card-header" style="background:#eff6ff"><span>☑️</span> <span style="color:#1e40af;font-weight:700">Checklist de preparación</span></div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${[
            'Guión completo y ensayado por todo el grupo',
            'Presentación de diapositivas terminada y revisada',
            'Factusol: operaciones del ejercicio listas para mostrar',
            'Nominasol: nóminas del último mes generadas',
            'Contasol: cierre del ejercicio y cuenta de resultados',
            'Respuestas del banco de preguntas preparadas',
            'Tiempo total del ensayo entre 26 y 30 minutos',
            'Cada miembro sabe qué bloque defiende',
          ].map((txt,i)=>{
            const key = 'chkPres'+i;
            const val = EMPRESA_STATE.defensa['_chkPres'] && EMPRESA_STATE.defensa['_chkPres'][i];
            return `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:var(--radio-sm);
              background:${val?'#eff6ff':'var(--blanco)'};border:1px solid ${val?'#bfdbfe':'var(--gris-100)'};
              cursor:pointer;transition:all .2s"
              onclick="toggleChkPres(${i})">
              <div style="width:18px;height:18px;border-radius:4px;flex-shrink:0;
                border:2px solid ${val?'#1e40af':'var(--gris-300)'};background:${val?'#1e40af':'transparent'};
                display:flex;align-items:center;justify-content:center">
                ${val?'<span style="color:white;font-size:.65rem">✓</span>':''}
              </div>
              <span style="font-size:.8rem;color:${val?'#1e40af':'var(--gris-700)'};font-weight:${val?600:400};
                text-decoration:${val?'line-through':'none'}">${txt}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* ── Helpers del cronómetro ──────────────────────────────── */
const _cronos = {};
function cronoToggle(id, totalSeg) {
  if (_cronos[id] && _cronos[id].running) {
    clearInterval(_cronos[id].timer);
    _cronos[id].running = false;
    document.getElementById('btn-crono-'+id).textContent = '▶ Continuar';
  } else {
    if (!_cronos[id]) _cronos[id] = { elapsed:0, running:false };
    _cronos[id].running = true;
    document.getElementById('btn-crono-'+id).textContent = '⏸ Pausar';
    _cronos[id].timer = setInterval(()=>{
      _cronos[id].elapsed++;
      const rem = Math.max(0, totalSeg - _cronos[id].elapsed);
      const mins = Math.floor(rem/60);
      const secs = rem%60;
      const disp = document.getElementById('crono-display-'+id);
      const barra = document.getElementById('crono-barra-'+id);
      if (disp) {
        disp.textContent = mins+':'+String(secs).padStart(2,'0');
        disp.style.color = rem < totalSeg*0.15 ? '#dc2626' : rem < totalSeg*0.3 ? '#f59e0b' : id==='pitch'?'var(--verde-700)':'#1e40af';
      }
      if (barra) barra.style.width = Math.min(100,(_cronos[id].elapsed/totalSeg)*100)+'%';
      if (rem === 0) {
        clearInterval(_cronos[id].timer);
        _cronos[id].running = false;
        mostrarToast('⏱️ ¡Tiempo!', id==='pitch'?'exito':'exito');
      }
    }, 1000);
  }
}

function cronoReset(id, totalSeg) {
  if (_cronos[id]) { clearInterval(_cronos[id].timer); _cronos[id] = { elapsed:0, running:false }; }
  const disp  = document.getElementById('crono-display-'+id);
  const barra = document.getElementById('crono-barra-'+id);
  const btn   = document.getElementById('btn-crono-'+id);
  const mins  = Math.floor(totalSeg/60);
  const secs  = totalSeg%60;
  if (disp)  { disp.textContent = mins+':'+String(secs).padStart(2,'0'); disp.style.color = id==='pitch'?'var(--verde-700)':'#1e40af'; }
  if (barra) barra.style.width = '0%';
  if (btn)   btn.textContent = '▶ Iniciar ensayo';
}

function guardarEnsayo(id) {
  const crono = _cronos[id];
  if (!crono || crono.elapsed < 5) { mostrarToast('Inicia el cronómetro primero','error'); return; }
  const nota = prompt('Nota opcional para este ensayo (ej: "fluido pero me pasé 20s")') || '';
  const ensayo = { id:'ens'+Date.now(), fecha:new Date().toLocaleDateString('es-ES'), duracion:crono.elapsed, nota };
  if (id==='pitch') EMPRESA_STATE.defensa.pitch.ensayos.push(ensayo);
  else EMPRESA_STATE.defensa.presentacion.ensayos.push(ensayo);
  mostrarToast('✓ Ensayo guardado: '+Math.floor(crono.elapsed/60)+'m '+crono.elapsed%60+'s','exito');
  renderVista('defensa');
}

function importarDatosPitch() {
  const p   = EMPRESA_STATE.defensa.pitch;
  const ap1 = EMPRESA_STATE.planEmpresa.ap1;
  const ap3 = EMPRESA_STATE.planEmpresa.ap3;
  const canv= EMPRESA_STATE.emprendimiento.canvas;
  if (ap1.lema) p.gancho = ap1.lema;
  if (canv.propuestaValor) p.problema = canv.propuestaValor;
  if (ap3.propuestaValor) p.solucion = ap3.propuestaValor;
  mostrarToast('✓ Datos importados del plan de empresa','exito');
  renderVista('defensa');
}

function añadirPreguntaTribunal() {
  const preg = prompt('Escribe la pregunta del tribunal:');
  if (!preg || !preg.trim()) return;
  const dif = prompt('Dificultad (baja / media / alta):') || 'media';
  EMPRESA_STATE.defensa.presentacion.preguntasPosibles.push({
    id:'p'+Date.now(), pregunta:preg.trim(), respuesta:'', dificultad:dif.trim()||'media'
  });
  renderVista('defensa');
}

function toggleChkPres(idx) {
  if (!EMPRESA_STATE.defensa._chkPres) EMPRESA_STATE.defensa._chkPres = {};
  EMPRESA_STATE.defensa._chkPres[idx] = !EMPRESA_STATE.defensa._chkPres[idx];
  renderVista('defensa');
}
/* ============================================================
   RÚBRICAS DE EVALUACIÓN — 0656 Simulación Empresarial
   ============================================================ */

const RA_EVALUACION = [
  {
    id: 'RA1', label: 'RA1 — Innovación y emprendimiento',
    ce: [
      { id:'RA1a', label:'Facetas de la innovación empresarial (técnicas, organizativas…)' },
      { id:'RA1b', label:'Innovación e iniciativa emprendedora y su impacto en la competitividad' },
      { id:'RA1c', label:'Riesgo empresarial como motor económico' },
      { id:'RA1d', label:'Carácter emprendedor: actitudes y aptitudes' },
      { id:'RA1e', label:'Experiencias de innovación: análisis y valoración' },
    ]
  },
  {
    id: 'RA2', label: 'RA2 — Análisis de mercado e idea de negocio',
    ce: [
      { id:'RA2a', label:'Implicaciones de la elección de una idea de negocio' },
      { id:'RA2b', label:'Diferenciación entre idea y oportunidad de negocio factible' },
      { id:'RA2c', label:'Análisis del sector y del entorno competitivo' },
      { id:'RA2d', label:'Identificación de clientes potenciales y segmentos de mercado' },
      { id:'RA2e', label:'Análisis DAFO y posicionamiento competitivo' },
    ]
  },
  {
    id: 'RA3', label: 'RA3 — Plan de empresa',
    ce: [
      { id:'RA3a', label:'Presentación de la empresa: misión, visión y valores' },
      { id:'RA3b', label:'Resumen ejecutivo claro y convincente' },
      { id:'RA3c', label:'Descripción del negocio: actividad, productos y propuesta de valor' },
      { id:'RA3d', label:'Plan de marketing: producto, precio, distribución y comunicación' },
      { id:'RA3e', label:'Plan organizativo y estructura de RRHH' },
    ]
  },
  {
    id: 'RA4', label: 'RA4 — Plan económico-financiero',
    ce: [
      { id:'RA4a', label:'Inversión inicial y fuentes de financiación' },
      { id:'RA4b', label:'Previsión de ingresos y gastos' },
      { id:'RA4c', label:'Umbral de rentabilidad y período de recuperación' },
      { id:'RA4d', label:'VAN, TIR y análisis de viabilidad' },
      { id:'RA4e', label:'Interpretación y toma de decisiones a partir de los datos financieros' },
    ]
  },
  {
    id: 'RA5', label: 'RA5 — Trámites jurídico-fiscales',
    ce: [
      { id:'RA5a', label:'Elección y justificación de la forma jurídica' },
      { id:'RA5b', label:'Documentación notarial y registral (escritura, Registro Mercantil)' },
      { id:'RA5c', label:'Alta en AEAT: NIF, IAE, IVA (Modelo 036)' },
      { id:'RA5d', label:'Alta en Seguridad Social: CCC, afiliación de trabajadores' },
      { id:'RA5e', label:'Obligaciones fiscales periódicas: Mod. 303, 111, 200, 347…' },
    ]
  },
  {
    id: 'RA6', label: 'RA6 — Gestión operativa de la empresa',
    ce: [
      { id:'RA6a', label:'Gestión y toma de decisiones en Dirección' },
      { id:'RA6b', label:'Gestión comercial: facturación, clientes y proveedores (Factusol)' },
      { id:'RA6c', label:'Gestión de RRHH: contratos, nóminas e incidencias (Nominasol)' },
      { id:'RA6d', label:'Contabilidad: registro de operaciones y estados financieros (Contasol)' },
      { id:'RA6e', label:'Gestión financiera: tesorería, financiación e inversiones' },
      { id:'RA6f', label:'Gestión fiscal: autoliquidaciones periódicas e impuesto de sociedades' },
    ]
  },
];

const RUBRICA_NIVELES = [
  { valor: 1, label: 'Iniciado',    desc: 'No lo he trabajado o tengo dificultades importantes para aplicarlo.',             color: '#fee2e2', texto: '#991b1b' },
  { valor: 2, label: 'En proceso',  desc: 'Lo he trabajado pero aún cometo errores frecuentes o necesito ayuda.',           color: '#fef3c7', texto: '#92400e' },
  { valor: 3, label: 'Adquirido',   desc: 'Lo aplico correctamente con autonomía en la mayoría de situaciones.',            color: '#dcfce7', texto: '#166534' },
  { valor: 4, label: 'Excelente',   desc: 'Lo domino con fluidez, puedo explicarlo y ayudar a compañeros/as.',              color: '#dbeafe', texto: '#1e40af' },
];

const ITEMS_COEVALUACION = [
  { id:'co1', label:'Implicación y compromiso con las tareas del grupo' },
  { id:'co2', label:'Calidad del trabajo aportado al departamento asignado' },
  { id:'co3', label:'Puntualidad y cumplimiento de los plazos' },
  { id:'co4', label:'Comunicación y coordinación con el equipo' },
  { id:'co5', label:'Iniciativa y resolución de problemas' },
  { id:'co6', label:'Respeto y actitud colaborativa' },
  { id:'co7', label:'Dominio del software utilizado en su departamento' },
  { id:'co8', label:'Capacidad para explicar y defender sus decisiones' },
];

/* ============================================================
   VISTA: AUTOEVALUACIÓN
   ============================================================ */
function vistaAutoevaluacion() {
  const ev   = EMPRESA_STATE.evaluacion;
  const auto = ev.auto;
  const pid  = auto.periodoActivo;
  const per  = auto.periodos.find(p => p.id === pid) || auto.periodos[0];

  // Calcular progreso del periodo activo
  const totalCE = RA_EVALUACION.reduce((s, ra) => s + ra.ce.length, 0);
  const respondidos = Object.keys(per.items).filter(k => per.items[k] && per.items[k].valor).length;
  const pct = Math.round((respondidos / totalCE) * 100);

  // Nota media calculada
  const valores = Object.values(per.items).filter(v => v && v.valor).map(v => v.valor);
  const media = valores.length ? (valores.reduce((s,v) => s+v, 0) / valores.length).toFixed(1) : '—';

  return `
  <div class="seccion-header">
    <div>
      <h2>🪞 Autoevaluación</h2>
      <p>Reflexiona sobre tu propio aprendizaje por Resultados de Aprendizaje · Módulo 0656
        <span class="ra-chip" style="margin-left:6px">RA1–RA6</span>
      </p>
    </div>
    <button class="btn-ayuda-ctx" data-ayuda="autoevaluacion" onclick="toggleAyuda('autoevaluacion')" title="Conceptos y ayuda">❓ Ayuda</button>
    <button class="btn-secundario" onclick="irA('notas')">📊 Ver mis notas →</button>
  </div>

  <!-- Selector de trimestre -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:1.25rem;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:8px">
    ${auto.periodos.map(p => `
    <button onclick="EMPRESA_STATE.evaluacion.auto.periodoActivo='${p.id}';renderVista('autoevaluacion')"
      style="flex:1;padding:9px 14px;border:none;border-radius:var(--radio-md);font-size:.85rem;font-weight:${pid===p.id?'700':'500'};
      cursor:pointer;background:${pid===p.id?'var(--verde-600)':'transparent'};color:${pid===p.id?'white':'var(--gris-500)'};
      transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px">
      ${p.label}
      ${p.completado ? '<span style="font-size:.7rem">✓</span>' : ''}
    </button>`).join('')}
  </div>

  <!-- KPIs del periodo -->
  <div class="metricas-grid" style="margin-bottom:1.25rem">
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">📋</div></div>
      <div class="metrica-valor">${respondidos}/${totalCE}</div>
      <div class="metrica-etiq">Criterios evaluados</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono azul">📈</div></div>
      <div class="metrica-valor">${pct}%</div>
      <div class="metrica-etiq">Completado</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono nar">⭐</div></div>
      <div class="metrica-valor">${media}</div>
      <div class="metrica-etiq">Valoración media (1–4)</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono ${per.completado?'verde':'rojo'}">
        ${per.completado ? '✓' : '⏳'}
      </div></div>
      <div class="metrica-valor" style="font-size:1rem;padding-top:6px">${per.completado ? 'Enviada' : 'Borrador'}</div>
      <div class="metrica-etiq">${per.completado && per.fecha ? per.fecha : 'Sin enviar aún'}</div>
    </div>
  </div>

  <!-- Leyenda de niveles -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:1.25rem">
    ${RUBRICA_NIVELES.map(n => `
    <div style="padding:8px 10px;background:${n.color};border-radius:var(--radio-md);text-align:center">
      <div style="font-size:.8rem;font-weight:700;color:${n.texto}">${n.valor} — ${n.label}</div>
      <div style="font-size:.68rem;color:${n.texto};opacity:.85;line-height:1.3;margin-top:3px">${n.desc}</div>
    </div>`).join('')}
  </div>

  <!-- Rúbrica por RA -->
  <div style="display:flex;flex-direction:column;gap:1rem">
    ${RA_EVALUACION.map(ra => {
      const ceVals = ra.ce.map(c => (per.items[c.id] && per.items[c.id].valor) || 0);
      const raMedia = ceVals.filter(v=>v>0).length
        ? (ceVals.filter(v=>v>0).reduce((s,v)=>s+v,0) / ceVals.filter(v=>v>0).length).toFixed(1)
        : '—';
      const raColor = raMedia==='—' ? 'var(--gris-200)' : raMedia>=3.5 ? '#dbeafe' : raMedia>=2.5 ? '#dcfce7' : raMedia>=1.5 ? '#fef3c7' : '#fee2e2';
      const raTextColor = raMedia==='—' ? 'var(--gris-500)' : raMedia>=3.5 ? '#1e40af' : raMedia>=2.5 ? '#166534' : raMedia>=1.5 ? '#92400e' : '#991b1b';

      return `
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span style="font-size:1rem">📌</span>
          <span style="flex:1">${ra.label}</span>
          <span style="font-size:.78rem;font-weight:700;padding:3px 10px;border-radius:20px;background:${raColor};color:${raTextColor}">
            Media: ${raMedia}
          </span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${ra.ce.map(ce => {
            const item = per.items[ce.id] || { valor: 0, reflexion: '' };
            return `
            <div style="border:1px solid var(--gris-100);border-radius:var(--radio-md);overflow:hidden">
              <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--gris-50)">
                <span class="ra-chip">${ce.id}</span>
                <span style="flex:1;font-size:.84rem;color:var(--gris-800);line-height:1.4">${ce.label}</span>
              </div>
              <div style="padding:10px 14px">
                <!-- Botones de nivel -->
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px">
                  ${RUBRICA_NIVELES.map(n => `
                  <button onclick="autoEvalSetValor('${per.id}','${ce.id}',${n.valor})"
                    style="padding:7px 4px;border:2px solid ${item.valor===n.valor?n.texto:n.color};
                    border-radius:var(--radio-sm);font-size:.76rem;font-weight:${item.valor===n.valor?'700':'500'};
                    cursor:pointer;background:${item.valor===n.valor?n.color:'var(--blanco)'};color:${item.valor===n.valor?n.texto:'var(--gris-500)'};
                    transition:all .15s;text-align:center;line-height:1.3">
                    ${n.valor} ${n.label}
                  </button>`).join('')}
                </div>
                <!-- Reflexión -->
                <textarea
                  placeholder="Reflexión opcional: ¿Qué has aprendido? ¿En qué has mejorado? ¿Qué necesitas reforzar?"
                  style="width:100%;padding:7px 10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);
                  font-size:.8rem;font-family:var(--fuente-cuerpo);color:var(--gris-900);resize:vertical;min-height:52px;outline:none;
                  background:var(--gris-50);line-height:1.5"
                  oninput="autoEvalSetReflexion('${per.id}','${ce.id}',this.value)"
                  onfocus="this.style.borderColor='var(--verde-400)'"
                  onblur="this.style.borderColor='var(--gris-200)'"
                >${item.reflexion || ''}</textarea>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('')}
  </div>

  <!-- Reflexión global del periodo -->
  <div class="ficha-card" style="margin-top:1rem">
    <div class="ficha-card-header"><span>💬</span> Reflexión global del ${per.label}</div>
    <div style="font-size:.82rem;color:var(--gris-500);margin-bottom:8px">
      ¿Cuál ha sido tu mayor aprendizaje este trimestre? ¿Qué mejorarías de tu implicación y trabajo?
    </div>
    <textarea id="auto-reflexion-global"
      style="width:100%;padding:10px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);
      font-size:.84rem;font-family:var(--fuente-cuerpo);color:var(--gris-900);resize:vertical;min-height:90px;outline:none;line-height:1.6"
      placeholder="Escribe aquí tu reflexión global sobre el trimestre..."
      onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
    >${per.reflexionGlobal || ''}</textarea>
  </div>

  <!-- Botones de acción -->
  <div style="display:flex;gap:10px;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--gris-200)">
    <button class="btn-secundario" style="flex:1;justify-content:center" onclick="autoEvalGuardar('${per.id}',false)">
      💾 Guardar borrador
    </button>
    <button class="btn-accion" style="flex:2;justify-content:center" onclick="autoEvalGuardar('${per.id}',true)">
      📤 Enviar autoevaluación del ${per.label}
    </button>
  </div>
  `;
}

/* ── Funciones de autoevaluación ──────────────────────────── */
function autoEvalSetValor(periodId, ceId, valor) {
  const per = EMPRESA_STATE.evaluacion.auto.periodos.find(p => p.id === periodId);
  if (!per) return;
  if (!per.items[ceId]) per.items[ceId] = { valor: 0, reflexion: '' };
  per.items[ceId].valor = per.items[ceId].valor === valor ? 0 : valor; // toggle
  renderVista('autoevaluacion');
}

function autoEvalSetReflexion(periodId, ceId, texto) {
  const per = EMPRESA_STATE.evaluacion.auto.periodos.find(p => p.id === periodId);
  if (!per) return;
  if (!per.items[ceId]) per.items[ceId] = { valor: 0, reflexion: '' };
  per.items[ceId].reflexion = texto;
}

function autoEvalGuardar(periodId, enviar) {
  const per = EMPRESA_STATE.evaluacion.auto.periodos.find(p => p.id === periodId);
  if (!per) return;
  const reflexGlobal = document.getElementById('auto-reflexion-global');
  if (reflexGlobal) per.reflexionGlobal = reflexGlobal.value;
  if (enviar) {
    const totalCE = RA_EVALUACION.reduce((s, ra) => s + ra.ce.length, 0);
    const respondidos = Object.keys(per.items).filter(k => per.items[k] && per.items[k].valor).length;
    if (respondidos < totalCE) {
      mostrarToast('Completa todos los criterios antes de enviar (' + respondidos + '/' + totalCE + ')', 'error');
      return;
    }
    per.completado = true;
    per.fecha = new Date().toLocaleDateString('es-ES');
    mostrarToast('✓ Autoevaluación del ' + per.label + ' enviada al docente', 'exito');
  } else {
    mostrarToast('💾 Borrador guardado', '');
  }
  renderVista('autoevaluacion');
}

/* ============================================================
   VISTA: COEVALUACIÓN
   ============================================================ */
function vistaCoevaluacion() {
  const co   = EMPRESA_STATE.evaluacion.co;
  const pid  = co.periodoActivo;
  const per  = co.periodos.find(p => p.id === pid) || co.periodos[0];

  const respondidos = Object.keys(per.items).filter(k => per.items[k] && per.items[k].valor).length;
  const pct = Math.round((respondidos / ITEMS_COEVALUACION.length) * 100);
  const media = respondidos
    ? (Object.values(per.items).filter(v=>v&&v.valor).reduce((s,v)=>s+v.valor,0) / respondidos).toFixed(1)
    : '—';

  return `
  <div class="seccion-header">
    <div>
      <h2>🤝 Coevaluación</h2>
      <p>Evalúa el trabajo y la implicación de un compañero/a de tu equipo · 0656
        <span class="ra-chip" style="margin-left:6px">Trabajo en equipo</span>
      </p>
    </div>
    <button class="btn-secundario" onclick="irA('notas')">📊 Ver mis notas →</button>
  </div>

  <!-- Selector de trimestre -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:1.25rem;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:8px">
    ${co.periodos.map(p => `
    <button onclick="EMPRESA_STATE.evaluacion.co.periodoActivo='${p.id}';renderVista('coevaluacion')"
      style="flex:1;padding:9px 14px;border:none;border-radius:var(--radio-md);font-size:.85rem;font-weight:${pid===p.id?'700':'500'};
      cursor:pointer;background:${pid===p.id?'var(--verde-600)':'transparent'};color:${pid===p.id?'white':'var(--gris-500)'};
      transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px">
      ${p.label}
      ${p.completado ? '<span style="font-size:.7rem">✓</span>' : ''}
    </button>`).join('')}
  </div>

  <!-- Identificación del evaluado -->
  <div class="ficha-card" style="margin-bottom:1rem">
    <div class="ficha-card-header"><span>👤</span> ¿A quién evalúas este trimestre?</div>
    <div style="font-size:.82rem;color:var(--gris-500);margin-bottom:10px">
      Indica el nombre del compañero/a que ocupó el departamento contiguo al tuyo. La coevaluación es anónima para él/ella.
    </div>
    <input type="text" class="ficha-input"
      placeholder="Nombre completo del compañero/a evaluado/a"
      value="${per.evaluado || ''}"
      oninput="EMPRESA_STATE.evaluacion.co.periodos.find(p=>p.id==='${per.id}').evaluado=this.value"
      style="max-width:400px">
  </div>

  <!-- KPIs -->
  <div class="metricas-grid" style="margin-bottom:1.25rem">
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">📋</div></div>
      <div class="metrica-valor">${respondidos}/${ITEMS_COEVALUACION.length}</div>
      <div class="metrica-etiq">Criterios evaluados</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono azul">📈</div></div>
      <div class="metrica-valor">${pct}%</div>
      <div class="metrica-etiq">Completado</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono nar">⭐</div></div>
      <div class="metrica-valor">${media}</div>
      <div class="metrica-etiq">Valoración media (1–4)</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono ${per.completado?'verde':'rojo'}">
        ${per.completado?'✓':'⏳'}
      </div></div>
      <div class="metrica-valor" style="font-size:1rem;padding-top:6px">${per.completado?'Enviada':'Borrador'}</div>
      <div class="metrica-etiq">${per.completado && per.fecha ? per.fecha : 'Sin enviar'}</div>
    </div>
  </div>

  <!-- Leyenda -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:1.25rem">
    ${RUBRICA_NIVELES.map(n => `
    <div style="padding:8px 10px;background:${n.color};border-radius:var(--radio-md);text-align:center">
      <div style="font-size:.8rem;font-weight:700;color:${n.texto}">${n.valor} — ${n.label}</div>
      <div style="font-size:.68rem;color:${n.texto};opacity:.85;line-height:1.3;margin-top:3px">${n.desc}</div>
    </div>`).join('')}
  </div>

  <!-- Criterios de coevaluación -->
  <div class="ficha-card">
    <div class="ficha-card-header"><span>🤝</span> Criterios de evaluación del trabajo en equipo</div>
    <div style="font-size:.8rem;color:var(--gris-500);margin-bottom:1rem;padding:8px 10px;background:var(--gris-50);border-radius:var(--radio-sm)">
      💡 Evalúa con objetividad y constructividad. Esta información ayuda a mejorar el trabajo del equipo.
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${ITEMS_COEVALUACION.map(item => {
        const val = (per.items[item.id] && per.items[item.id].valor) || 0;
        return `
        <div style="padding:12px 14px;border:1px solid var(--gris-100);border-radius:var(--radio-md);transition:border-color .15s"
          onmouseover="this.style.borderColor='var(--verde-300)'" onmouseout="this.style.borderColor='var(--gris-100)'">
          <div style="font-size:.84rem;font-weight:500;color:var(--gris-800);margin-bottom:8px">${item.label}</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
            ${RUBRICA_NIVELES.map(n => `
            <button onclick="coEvalSetValor('${per.id}','${item.id}',${n.valor})"
              style="padding:7px 4px;border:2px solid ${val===n.valor?n.texto:n.color};
              border-radius:var(--radio-sm);font-size:.76rem;font-weight:${val===n.valor?'700':'500'};
              cursor:pointer;background:${val===n.valor?n.color:'var(--blanco)'};color:${val===n.valor?n.texto:'var(--gris-500)'};
              transition:all .15s;text-align:center;line-height:1.3">
              ${n.valor} ${n.label}
            </button>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- Valoración global y puntos fuertes/mejora -->
  <div class="grid-2col" style="margin-top:1rem">
    <div class="ficha-card">
      <div class="ficha-card-header"><span>💪</span> Puntos fuertes del compañero/a</div>
      <textarea
        style="width:100%;padding:10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);
        font-size:.84rem;font-family:var(--fuente-cuerpo);resize:vertical;min-height:100px;outline:none;line-height:1.5"
        placeholder="¿Qué destacarías positivamente de su trabajo, implicación o actitud?"
        onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
        oninput="EMPRESA_STATE.evaluacion.co.periodos.find(p=>p.id==='${per.id}').puntosFuertes=this.value"
      >${per.puntosFuertes || ''}</textarea>
    </div>
    <div class="ficha-card">
      <div class="ficha-card-header"><span>🔧</span> Aspectos a mejorar</div>
      <textarea
        style="width:100%;padding:10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);
        font-size:.84rem;font-family:var(--fuente-cuerpo);resize:vertical;min-height:100px;outline:none;line-height:1.5"
        placeholder="¿En qué aspectos podría mejorar para el próximo trimestre?"
        onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
        oninput="EMPRESA_STATE.evaluacion.co.periodos.find(p=>p.id==='${per.id}').mejoras=this.value"
      >${per.mejoras || ''}</textarea>
    </div>
  </div>

  <!-- Reflexión global -->
  <div class="ficha-card" style="margin-top:1rem">
    <div class="ficha-card-header"><span>💬</span> Valoración global</div>
    <textarea id="co-reflexion-global"
      style="width:100%;padding:10px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);
      font-size:.84rem;font-family:var(--fuente-cuerpo);resize:vertical;min-height:80px;outline:none;line-height:1.6"
      placeholder="Añade cualquier comentario adicional sobre el trabajo en equipo durante este trimestre..."
      onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
    >${per.reflexion || ''}</textarea>
  </div>

  <!-- Acciones -->
  <div style="display:flex;gap:10px;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--gris-200)">
    <button class="btn-secundario" style="flex:1;justify-content:center" onclick="coEvalGuardar('${per.id}',false)">
      💾 Guardar borrador
    </button>
    <button class="btn-accion" style="flex:2;justify-content:center" onclick="coEvalGuardar('${per.id}',true)">
      📤 Enviar coevaluación del ${per.label}
    </button>
  </div>
  `;
}

/* ── Funciones de coevaluación ────────────────────────────── */
function coEvalSetValor(periodId, itemId, valor) {
  const per = EMPRESA_STATE.evaluacion.co.periodos.find(p => p.id === periodId);
  if (!per) return;
  if (!per.items[itemId]) per.items[itemId] = { valor: 0 };
  per.items[itemId].valor = per.items[itemId].valor === valor ? 0 : valor;
  renderVista('coevaluacion');
}

function coEvalGuardar(periodId, enviar) {
  const per = EMPRESA_STATE.evaluacion.co.periodos.find(p => p.id === periodId);
  if (!per) return;
  const reflexEl = document.getElementById('co-reflexion-global');
  if (reflexEl) per.reflexion = reflexEl.value;
  if (enviar) {
    if (!per.evaluado || !per.evaluado.trim()) {
      mostrarToast('Indica el nombre del compañero/a que evalúas', 'error'); return;
    }
    const respondidos = Object.keys(per.items).filter(k => per.items[k] && per.items[k].valor).length;
    if (respondidos < ITEMS_COEVALUACION.length) {
      mostrarToast('Completa todos los criterios antes de enviar (' + respondidos + '/' + ITEMS_COEVALUACION.length + ')', 'error'); return;
    }
    per.completado = true;
    per.fecha = new Date().toLocaleDateString('es-ES');
    mostrarToast('✓ Coevaluación del ' + per.label + ' enviada al docente', 'exito');
  } else {
    mostrarToast('💾 Borrador guardado', '');
  }
  renderVista('coevaluacion');
}

/* ============================================================
   VISTA: MIS NOTAS
   ============================================================ */
function vistaNotas() {
  const ev   = EMPRESA_STATE.evaluacion;
  const auto = ev.auto;
  const co   = ev.co;

  // Calcular medias por RA para los 3 trimestres
  function mediaRA(raId, periodId) {
    const per = auto.periodos.find(p => p.id === periodId);
    if (!per) return null;
    const ra = RA_EVALUACION.find(r => r.id === raId);
    if (!ra) return null;
    const vals = ra.ce.map(c => per.items[c.id] && per.items[c.id].valor).filter(v => v);
    return vals.length ? (vals.reduce((s,v)=>s+v,0)/vals.length) : null;
  }

  function mediaTotal(periodId) {
    const per = auto.periodos.find(p => p.id === periodId);
    if (!per) return null;
    const vals = Object.values(per.items).filter(v=>v&&v.valor).map(v=>v.valor);
    return vals.length ? (vals.reduce((s,v)=>s+v,0)/vals.length) : null;
  }

  function mediaCoT(periodId) {
    const per = co.periodos.find(p => p.id === periodId);
    if (!per) return null;
    const vals = Object.values(per.items).filter(v=>v&&v.valor).map(v=>v.valor);
    return vals.length ? (vals.reduce((s,v)=>s+v,0)/vals.length) : null;
  }

  function badge(val) {
    if (val===null) return `<span style="color:var(--gris-300);font-size:.75rem">—</span>`;
    const n = RUBRICA_NIVELES.find(n => n.valor === Math.round(val)) || RUBRICA_NIVELES[0];
    return `<span style="font-size:.75rem;font-weight:700;padding:2px 8px;border-radius:20px;background:${n.color};color:${n.texto}">${val.toFixed(1)} · ${n.label}</span>`;
  }

  const trimestres = ['T1','T2'];
  const trLabels   = ['T1','T2'];

  return `
  <div class="seccion-header">
    <div>
      <h2>🏅 Mis notas y progreso</h2>
      <p>Resumen de autoevaluación, coevaluación y calificaciones del docente · Módulo 0656</p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-secundario" onclick="irA('autoevaluacion')">🪞 Autoevaluar →</button>
      <button class="btn-secundario" onclick="irA('coevaluacion')">🤝 Coevaluar →</button>
    </div>
  </div>

  <!-- Tabla de medias por RA y trimestre -->
  <div class="ficha-card" style="margin-bottom:1.25rem">
    <div class="ficha-card-header"><span>📊</span> Autoevaluación por Resultado de Aprendizaje</div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:.82rem;min-width:560px">
        <thead>
          <tr style="border-bottom:2px solid var(--verde-200)">
            <th style="text-align:left;padding:8px 10px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Resultado de Aprendizaje</th>
            ${trimestres.map((t,i) => `<th style="text-align:center;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">${trLabels[i]}</th>`).join('')}
            <th style="text-align:center;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Media global</th>
          </tr>
        </thead>
        <tbody>
          ${RA_EVALUACION.map(ra => {
            const medias = trimestres.map(t => mediaRA(ra.id, t));
            const validos = medias.filter(m=>m!==null);
            const global = validos.length ? validos.reduce((s,m)=>s+m,0)/validos.length : null;
            return `
            <tr style="border-bottom:1px solid var(--gris-50)">
              <td style="padding:9px 10px">
                <div style="font-size:.8rem;font-weight:600;color:var(--gris-800)">${ra.id}</div>
                <div style="font-size:.72rem;color:var(--gris-500)">${ra.label.split('—')[1].trim()}</div>
              </td>
              ${medias.map(m => `<td style="padding:9px;text-align:center">${badge(m)}</td>`).join('')}
              <td style="padding:9px;text-align:center">${badge(global)}</td>
            </tr>`;
          }).join('')}
          <!-- Fila total autoevaluación -->
          <tr style="border-top:2px solid var(--verde-200);background:var(--verde-50)">
            <td style="padding:9px 10px;font-weight:700;color:var(--gris-800)">Media total autoevaluación</td>
            ${trimestres.map(t => { const m = mediaTotal(t); return `<td style="padding:9px;text-align:center">${badge(m)}</td>`; }).join('')}
            <td style="padding:9px;text-align:center">
              ${badge((() => {
                const vals = trimestres.map(t => mediaTotal(t)).filter(v=>v!==null);
                return vals.length ? vals.reduce((s,v)=>s+v,0)/vals.length : null;
              })())}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Coevaluación recibida -->
  <div class="ficha-card" style="margin-bottom:1.25rem">
    <div class="ficha-card-header"><span>🤝</span> Coevaluación — trabajo en equipo</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
      ${trimestres.map((t, i) => {
        const per = co.periodos.find(p => p.id === t);
        const m = mediaCoT(t);
        return `
        <div style="text-align:center;padding:1rem;background:${per.completado?'var(--verde-50)':'var(--gris-50)'};border-radius:var(--radio-md);border:1px solid ${per.completado?'var(--verde-200)':'var(--gris-200)'}">
          <div style="font-size:.82rem;font-weight:700;color:var(--gris-700);margin-bottom:8px">${trLabels[i]}</div>
          ${per.completado
            ? `<div style="margin-bottom:6px">${badge(m)}</div>
               <div style="font-size:.7rem;color:var(--gris-500)">Evaluado/a: ${per.evaluado || '—'}</div>
               <div style="font-size:.68rem;color:var(--gris-400);margin-top:2px">${per.fecha}</div>`
            : `<div style="font-size:.78rem;color:var(--gris-400)">Sin completar</div>
               <button class="btn-secundario" style="margin-top:8px;padding:5px 10px;font-size:.75rem"
                 onclick="EMPRESA_STATE.evaluacion.co.periodoActivo='${t}';irA('coevaluacion')">Completar →</button>`
          }
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- Estado general -->
  <div class="grid-2col">
    <div class="ficha-card">
      <div class="ficha-card-header"><span>🪞</span> Estado de autoevaluaciones</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${auto.periodos.map(p => {
          const total = RA_EVALUACION.reduce((s,ra)=>s+ra.ce.length,0);
          const resp = Object.keys(p.items).filter(k=>p.items[k]&&p.items[k].valor).length;
          const pct = Math.round(resp/total*100);
          return `
          <div style="padding:10px 12px;border:1px solid ${p.completado?'var(--verde-300)':'var(--gris-200)'};border-radius:var(--radio-md);background:${p.completado?'var(--verde-50)':'var(--blanco)'}">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:.84rem;font-weight:600;color:var(--gris-800)">${p.label}</span>
              <span style="font-size:.72rem;font-weight:700;color:${p.completado?'var(--verde-700)':'var(--gris-500)'}">
                ${p.completado ? '✓ Enviada · '+p.fecha : resp+'/'+total+' CE respondidos'}
              </span>
            </div>
            <div style="height:5px;background:var(--gris-100);border-radius:3px;overflow:hidden">
              <div style="width:${pct}%;height:100%;background:${p.completado?'var(--verde-500)':'#f59e0b'};border-radius:3px;transition:width .4s"></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="ficha-card">
      <div class="ficha-card-header"><span>📋</span> Tareas evaluadas por el docente</div>
      ${(() => {
        const tareas = EMPRESA_STATE.gestion.tareas.filter(t => t.estado === 'evaluada' && t.calificacion);
        if (tareas.length === 0) return `<div style="text-align:center;padding:1.5rem;color:var(--gris-400)"><div style="font-size:2rem;margin-bottom:6px">📋</div><p>Sin tareas evaluadas aún</p></div>`;
        const media = (tareas.reduce((s,t)=>s+(t.calificacion||0),0)/tareas.length).toFixed(1);
        return `
        <div style="text-align:center;padding:12px;background:var(--verde-50);border-radius:var(--radio-md);border:1px solid var(--verde-200);margin-bottom:10px">
          <div style="font-size:2rem;font-weight:800;color:var(--verde-700)">${media}</div>
          <div style="font-size:.75rem;color:var(--verde-600)">Media sobre 10 · ${tareas.length} tarea${tareas.length>1?'s':''}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;max-height:180px;overflow-y:auto">
          ${tareas.slice(0,8).map(t=>`
          <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--gris-50);font-size:.78rem">
            <span style="font-size:.85rem">${{direccion:'🎯',rrhh:'👥',comercial:'🧾',contabilidad:'📊',fiscal:'⚖️'}[t.departamento]||'📋'}</span>
            <span style="flex:1;color:var(--gris-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.titulo}</span>
            <span class="ra-chip">${t.ce||'RA6'}</span>
            <span style="font-weight:700;color:${t.calificacion>=7?'var(--verde-700)':t.calificacion>=5?'#92400e':'#dc2626'}">${t.calificacion}/10</span>
          </div>`).join('')}
        </div>`;
      })()}
    </div>
  </div>
  `;
}
