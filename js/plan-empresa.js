function vistaPlanEmpresa() {
  const pe   = EMPRESA_STATE.planEmpresa;
  const ap   = pe.apartado || '1';
  const pct  = calcProgresoPlan();

  // Actualizar badge
  const badge = document.getElementById('badge-plan');
  if (badge) badge.textContent = pct + '%';

  const APARTADOS = [
    { id:'1', ico:'📄', label:'Presentación',         ra:'RA3a-b' },
    { id:'2', ico:'👤', label:'Promotores',            ra:'RA1d · RA3c' },
    { id:'3', ico:'💼', label:'El negocio',            ra:'RA2a-e · RA3' },
    { id:'4', ico:'🔍', label:'Análisis del entorno',  ra:'RA2g-i' },
    { id:'5', ico:'⚖️', label:'Plan jurídico-fiscal',  ra:'RA3e-f · RA5' },
    { id:'6', ico:'👥', label:'Plan organizativo',     ra:'RA3c-d' },
    { id:'7', ico:'📊', label:'Plan económico',        ra:'RA4' },
    { id:'8', ico:'📣', label:'Plan de marketing',     ra:'RA6b' },
  ];

  return `
  <div class="seccion-header">
    <div>
      <h2>📋 Plan de empresa</h2>
      <p>Elabora tu plan de empresa completo · ${pct}% completado · RA3 · RA4 · RA5 · RA6</p>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <button class="btn-ayuda-ctx" data-ayuda="plan-ap7" onclick="toggleAyuda('plan-ap7')" title="Conceptos y ayuda">❓ Ayuda</button>
      <button class="btn-accion" onclick="generarDossier()" style="display:flex;align-items:center;gap:6px">🖨️ Exportar PDF</button>
    </div>
  </div>

  <!-- Barra de progreso global -->
  <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:10px 16px;margin-bottom:1rem">
    <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:5px">
      <span style="color:var(--gris-600);font-weight:600">Progreso del plan de empresa</span>
      <span style="font-weight:800;color:${pct===100?'var(--verde-600)':'var(--gris-700)'}">${pct}%</span>
    </div>
    <div class="progreso-bar" style="height:8px">
      <div class="progreso-fill" style="width:${pct}%;height:8px;transition:width .4s"></div>
    </div>
  </div>

  <!-- Navegación de apartados -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:1.25rem">
    ${APARTADOS.map(a => {
      const activo = ap === a.id;
      return `
      <button style="padding:8px;border:1.5px solid ${activo?'var(--verde-500)':'var(--gris-200)'};border-radius:var(--radio-md);
        background:${activo?'var(--verde-600)':'var(--blanco)'};color:${activo?'white':'var(--gris-700)'};
        cursor:pointer;transition:all var(--transicion);font-family:var(--font);font-size:.75rem;font-weight:600;text-align:center"
        onmouseover="if('${ap}'!=='${a.id}')this.style.borderColor='var(--verde-400)'"
        onmouseout="if('${ap}'!=='${a.id}')this.style.borderColor='var(--gris-200)'"
        onclick="planTab('${a.id}')">
        <div style="font-size:1rem;margin-bottom:2px">${a.ico}</div>
        <div>${a.id}. ${a.label}</div>
        <span style="font-size:.62rem;opacity:.75">${a.ra}</span>
      </button>`;
    }).join('')}
  </div>

  <!-- Contenido del apartado activo -->
  ${planApartado(ap, pe)}`;
}

/* ── Apartado activo ───────────────────────────────────────── */
function planApartado(ap, pe) {
  const ayuda = (txt) => `
    <div style="padding:10px 14px;background:#fef9ec;border:1px solid #fde68a;border-radius:var(--radio-md);margin-bottom:1rem;font-size:.8rem;color:var(--am);line-height:1.5">
      ✏️ ${txt}
    </div>`;

  const campo = (lbl, obj, key, placeholder, hint='', alto=80) => `
    <div class="ficha-campo">
      <label>${lbl}</label>
      <textarea class="ficha-input" style="min-height:${alto}px;resize:vertical;font-size:.84rem;line-height:1.6"
        placeholder="${placeholder}"
        oninput="EMPRESA_STATE.planEmpresa.${obj}.${key}=this.value"
      >${pe[obj]?.[key]||''}</textarea>
      ${hint?`<div style="font-size:.7rem;color:var(--gris-400);margin-top:2px">📌 ${hint}</div>`:''}
    </div>`;

  const campoCorto = (lbl, obj, key, placeholder, hint='') => `
    <div class="ficha-campo">
      <label>${lbl}</label>
      <input class="ficha-input" style="font-size:.85rem"
        placeholder="${placeholder}"
        value="${pe[obj]?.[key]||''}"
        oninput="EMPRESA_STATE.planEmpresa.${obj}.${key}=this.value">
      ${hint?`<div style="font-size:.7rem;color:var(--gris-400);margin-top:2px">📌 ${hint}</div>`:''}
    </div>`;

  const importarBtn = (texto, onclick) => `
    <button class="btn-secundario" style="font-size:.75rem;padding:5px 10px;margin-bottom:10px"
      onclick="${onclick}">📥 ${texto}</button>`;

  const VISTAS = {

    '1': () => `
    <div class="ficha-card">
      <div class="ficha-card-header"><span>📄</span> Apartado 1 — Presentación de la empresa <span class="ra-chip" style="margin-left:auto">RA3a · RA3b</span><button class="btn-ayuda-ctx" style="margin-left:8px" data-ayuda="plan-ap1" onclick="toggleAyuda('plan-ap1')" title="Conceptos y ayuda">❓</button></div>
      ${ayuda('La presentación es la primera impresión del plan. Debe incluir los datos identificativos de la empresa, su imagen de marca y un resumen ejecutivo claro que explique en pocas líneas qué hace la empresa, para quién, cómo y por qué tiene sentido. Un buen resumen ejecutivo convence al lector de seguir leyendo.')}
      <div class="ficha-grid-2">
        ${campoCorto('Nombre comercial de la empresa', 'ap1', 'nombreComercial', 'Ej: Cítricos Vega Alta', 'El nombre con el que la empresa se presenta al mercado')}
        ${campoCorto('Eslogan o lema', 'ap1', 'lema', 'Ej: Del árbol a tu mesa en 24 horas', 'Frase breve que resume la propuesta de valor')}
      </div>
      ${campo('Resumen ejecutivo', 'ap1', 'resumenEjecutivo',
        'Describe en 150-200 palabras: qué hace tu empresa, qué problema resuelve, a quién se dirige, cuál es tu ventaja competitiva, y cuáles son tus objetivos a corto plazo. Este resumen debe poder leerse de forma independiente.',
        'RA3b · Debe responder: ¿qué?, ¿para quién?, ¿cómo?, ¿por qué ahora?', 120)}
      <div class="ficha-grid-2">
        ${campo('Misión', 'ap1', 'mision',
          'La razón de ser de la empresa. ¿Para qué existe? ¿Qué problema resuelve en la sociedad?\nEj: "Acercar productos agrícolas de la Vega Alta a consumidores urbanos que valoran la calidad, la proximidad y la sostenibilidad."',
          'Presente, concreta, orientada al cliente y a la sociedad', 80)}
        ${campo('Visión', 'ap1', 'vision',
          'Dónde quiere estar la empresa en 3-5 años. ¿Qué quiere llegar a ser?\nEj: "Convertirnos en la referencia andaluza de distribución de cítricos de proximidad, con 500 clientes activos y presencia en 3 provincias antes de 2028."',
          'Futuro, ambiciosa pero alcanzable, con horizonte temporal', 80)}
      </div>
      ${campo('Valores corporativos', 'ap1', 'valores',
        'Lista 4-6 valores que guían la forma de trabajar y relacionarse de la empresa. Para cada uno, explica brevemente cómo se concreta en la actividad diaria.\nEj: Proximidad — priorizamos proveedores y clientes locales. Transparencia — publicamos el origen de todos nuestros productos...',
        'No son palabras vacías: cada valor debe tener una aplicación práctica concreta', 80)}
    </div>`,

    '2': () => {
      const proms = pe.ap2.promotores || [];
      return `
    <div class="ficha-card">
      <div class="ficha-card-header">
        <span>👤</span> Apartado 2 — El equipo promotor
        <span class="ra-chip" style="margin-left:auto">RA1d · RA3c</span>
        <button class="btn-ayuda-ctx" style="margin-left:8px" data-ayuda="plan-ap2" onclick="toggleAyuda('plan-ap2')" title="Conceptos y ayuda">❓</button>
        <button class="btn-accion" style="margin-left:8px;padding:5px 12px;font-size:.78rem"
          onclick="EMPRESA_STATE.planEmpresa.ap2.promotores.push({nombre:'',rol:'',formacion:'',experiencia:'',aportacion:''});renderPlanEmpresa()">
          + Añadir promotor
        </button>
      </div>
      ${ayuda('El equipo promotor es uno de los factores que más valoran los inversores y evaluadores de un plan de empresa. No basta con listar nombres: hay que demostrar que el equipo tiene la formación, la experiencia y la complementariedad necesarias para llevar el proyecto adelante.')}

      ${proms.length === 0 ? `
      <div style="text-align:center;padding:2rem;background:var(--gris-50);border-radius:var(--radio-md);color:var(--gris-400)">
        <div style="font-size:2rem;margin-bottom:8px">👥</div>
        <p>Añade a cada miembro del equipo promotor.</p>
      </div>` : proms.map((p, i) => `
      <div style="border:1.5px solid var(--gris-200);border-radius:var(--radio-md);padding:14px;margin-bottom:10px;background:var(--gris-50)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--verde-800);color:white;font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
          <input class="ficha-input" style="flex:1;font-weight:600" placeholder="Nombre completo"
            value="${p.nombre||''}" oninput="EMPRESA_STATE.planEmpresa.ap2.promotores[${i}].nombre=this.value">
          <input class="ficha-input" style="width:160px" placeholder="Rol en la empresa"
            value="${p.rol||''}" oninput="EMPRESA_STATE.planEmpresa.ap2.promotores[${i}].rol=this.value">
          <button style="border:none;background:transparent;cursor:pointer;color:var(--rojo);font-size:.8rem;padding:4px"
            onclick="EMPRESA_STATE.planEmpresa.ap2.promotores.splice(${i},1);renderPlanEmpresa()">✕</button>
        </div>
        <div class="ficha-grid-2" style="gap:8px">
          <div class="ficha-campo">
            <label>Formación académica</label>
            <textarea class="ficha-input" style="min-height:60px;resize:vertical;font-size:.82rem"
              placeholder="Titulación, especialidad, centro..."
              oninput="EMPRESA_STATE.planEmpresa.ap2.promotores[${i}].formacion=this.value">${p.formacion||''}</textarea>
          </div>
          <div class="ficha-campo">
            <label>Experiencia relevante</label>
            <textarea class="ficha-input" style="min-height:60px;resize:vertical;font-size:.82rem"
              placeholder="Puestos anteriores, proyectos, habilidades..."
              oninput="EMPRESA_STATE.planEmpresa.ap2.promotores[${i}].experiencia=this.value">${p.experiencia||''}</textarea>
          </div>
        </div>
        <div class="ficha-campo">
          <label>Aportación clave al proyecto</label>
          <input class="ficha-input" style="font-size:.82rem" placeholder="¿Qué aporta específicamente este socio que los demás no tienen?"
            value="${p.aportacion||''}" oninput="EMPRESA_STATE.planEmpresa.ap2.promotores[${i}].aportacion=this.value">
        </div>
      </div>`).join('')}

      ${campo('Motivación del equipo para crear esta empresa', 'ap2', 'motivacion',
        '¿Por qué queréis crear esta empresa? ¿Qué os ha llevado a elegir este sector y este modelo de negocio? La motivación auténtica es un factor de éxito: los proyectos impulsados por motivación real tienen más probabilidades de superar los obstáculos iniciales.',
        'RA1d · Reflexión sobre el perfil emprendedor del equipo', 80)}
      ${campo('Capacitación profesional del equipo', 'ap2', 'capacitacion',
        '¿Tiene el equipo la formación y experiencia necesaria para llevar adelante este negocio? ¿Qué habilidades clave aporta cada miembro? ¿Hay alguna carencia que habría que cubrir con formación o con la contratación de un perfil externo?',
        'RA4d · Análisis de la capacitación profesional del equipo', 80)}
    </div>`;
    },

    '3': () => `
    <div class="ficha-card">
      <div class="ficha-card-header"><span>💼</span> Apartado 3 — Descripción del negocio <span class="ra-chip" style="margin-left:auto">RA2a-e · RA3</span><button class="btn-ayuda-ctx" style="margin-left:8px" data-ayuda="plan-ap3" onclick="toggleAyuda('plan-ap3')" title="Conceptos y ayuda">❓</button></div>
      ${ayuda('Este apartado es el núcleo del plan: explica qué hace tu empresa, cómo lo hace y por qué alguien elegiría comprarte a ti. Debe ser específico y concreto. Evita descripciones genéricas como "vendemos productos de calidad" — todo el mundo dice lo mismo.')}
      ${importarBtn('Importar propuesta de valor de Emprendimiento',
        "if(EMPRESA_STATE.emprendimiento.propuestaValor.diferenciacion){EMPRESA_STATE.planEmpresa.ap3.propuestaValor=EMPRESA_STATE.emprendimiento.propuestaValor.diferenciacion;renderPlanEmpresa();mostrarToast('✓ Importado de Emprendimiento','exito')}else{mostrarToast('Completa primero la sección Emprendimiento > Propuesta de Valor','error')}")}
      ${campo('Descripción de la actividad empresarial', 'ap3', 'descripcionActividad',
        'Explica en qué consiste tu actividad: qué haces, cómo lo haces, dónde lo haces y con qué medios. Incluye el código CNAE de tu actividad económica.\nEj: Empresa de distribución de cítricos frescos de la comarca de la Vega Alta del Guadalquivir (CNAE 4631 — Comercio al por mayor de frutas y hortalizas). Compramos directamente a productores locales y distribuimos a...',
        'RA2d · Determina el producto o servicio que quiere proporcionar la idea de negocio', 100)}
      ${campo('Productos y servicios', 'ap3', 'productosServicios',
        'Describe cada producto o servicio con detalle: características, calidades, variantes, precio orientativo y a quién va dirigido. Diferencia entre la oferta principal y los servicios complementarios.',
        'Incluye referencias a estándares de calidad, certificaciones o denominaciones de origen si aplica', 100)}
      ${campo('Propuesta de valor única', 'ap3', 'propuestaValor',
        '¿Por qué te elegirían a ti y no a la competencia? ¿Qué tienes que no tienen los demás? La propuesta de valor debe poder resumirse en 2-3 frases que cualquier cliente potencial entendería en 10 segundos.',
        'RA2e · Concreta las necesidades que satisface y el valor añadido de la idea de negocio', 80)}
      ${campo('Ventaja competitiva sostenible', 'ap3', 'ventajaCompetitiva',
        '¿Qué hace que vuestra ventaja sea difícil de copiar por la competencia? Puede ser un recurso único (ubicación, relaciones con proveedores, tecnología propia), un proceso más eficiente, un precio imbatible, o un servicio superior.',
        'Una ventaja competitiva que se puede copiar en 6 meses no es una ventaja real', 80)}
      ${campo('Modelo de negocio', 'ap3', 'modeloNegocio',
        'Explica cómo gana dinero la empresa: ¿qué cobra, a quién, cuándo y por qué? ¿Es un modelo de venta directa, suscripción, comisión, licencia? ¿Hay ingresos recurrentes o son todos puntuales?',
        'Un modelo de negocio claro es más valioso que un gran producto sin forma de monetizarlo', 80)}
    </div>`,

    '4': () => {
      const comps = pe.ap4.competidores || [];
      return `
    <div class="ficha-card">
      <div class="ficha-card-header"><span>🔍</span> Apartado 4 — Análisis del entorno y del sector <span class="ra-chip" style="margin-left:auto">RA2g-i</span><button class="btn-ayuda-ctx" style="margin-left:8px" data-ayuda="plan-ap4" onclick="toggleAyuda('plan-ap4')" title="Conceptos y ayuda">❓</button></div>
      ${ayuda('El análisis del entorno te permite conocer el contexto en el que operará tu empresa antes de entrar. Una empresa que conoce bien su entorno toma mejores decisiones. Usa fuentes reales: INE, MAPA, informes sectoriales, prensa especializada.')}
      ${importarBtn('Importar DAFO de Emprendimiento',
        "const E=EMPRESA_STATE.emprendimiento.dafo;if(E.fortalezas||E.debilidades){Object.assign(EMPRESA_STATE.planEmpresa.ap4,{dafoF:E.fortalezas,dafoD:E.debilidades,dafoO:E.oportunidades,dafoA:E.amenazas});renderPlanEmpresa();mostrarToast('✓ DAFO importado','exito')}else{mostrarToast('Completa primero el DAFO en Emprendimiento > Fase 2','error')}")}

      ${campo('Análisis del sector', 'ap4', 'analisisSector',
        'Describe el sector en el que opera tu empresa: tamaño del mercado, principales actores, tendencias actuales y perspectivas de futuro. ¿Es un sector maduro, en crecimiento o en declive? ¿Qué factores están transformando el sector?',
        'RA2g · Identifica y analiza las principales características del sector', 100)}

      <!-- DAFO en cuatro cuadrantes -->
      <div style="font-size:.72rem;font-weight:700;color:var(--verde-700);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px;margin-top:4px">Análisis DAFO</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        ${[
          ['💪 Fortalezas','ap4','dafoF','var(--verde-50)','var(--verde-300)','Factores internos positivos — qué hacéis bien'],
          ['⚠️ Debilidades','ap4','dafoD','#fef9ec','#fde68a','Factores internos negativos — qué podríais mejorar'],
          ['🚀 Oportunidades','ap4','dafoO','#dbeafe','#93c5fd','Factores externos positivos — tendencias favorables'],
          ['⛈️ Amenazas','ap4','dafoA','#fee2e2','#fca5a5','Factores externos negativos — riesgos del entorno'],
        ].map(([tit,obj,key,bg,bord,hint]) => `
        <div style="background:${bg};border:1.5px solid ${bord};border-radius:var(--radio-md);padding:10px">
          <div style="font-size:.8rem;font-weight:700;color:var(--gris-800);margin-bottom:3px">${tit}</div>
          <div style="font-size:.7rem;color:var(--gris-500);margin-bottom:5px">${hint}</div>
          <textarea class="ficha-input" style="min-height:80px;resize:vertical;font-size:.8rem;background:rgba(255,255,255,.7)"
            placeholder="Escribe aquí..."
            oninput="EMPRESA_STATE.planEmpresa.ap4['${key}']=this.value">${pe.ap4[key]||''}</textarea>
        </div>`).join('')}
      </div>

      ${campo('Análisis del mercado objetivo', 'ap4', 'mercadoObjetivo',
        'Define el mercado al que os dirigís: segmentos de clientes, tamaño estimado, comportamiento de compra, necesidades no cubiertas. ¿Existe un nicho sin explotar?',
        'RA2h · Analiza el mercado para comprobar si existe un nicho', 100)}

      <!-- Competidores -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div>
          <div style="font-size:.72rem;font-weight:700;color:var(--verde-700);text-transform:uppercase;letter-spacing:.04em">Análisis de la competencia</div>
          <div style="font-size:.7rem;color:var(--gris-400)">RA2i · Posiciona tu producto frente a la competencia</div>
        </div>
        <button class="btn-accion" style="padding:5px 12px;font-size:.78rem"
          onclick="EMPRESA_STATE.planEmpresa.ap4.competidores.push({nombre:'',tipo:'directo',fortalezas:'',debilidades:'',posicionamiento:''});renderPlanEmpresa()">
          + Añadir competidor
        </button>
      </div>
      ${comps.length === 0 ? `<div style="padding:12px;background:var(--gris-50);border-radius:var(--radio-md);text-align:center;color:var(--gris-400);font-size:.82rem;margin-bottom:12px">Añade al menos 3 competidores — directos e indirectos</div>` :
      comps.map((c,i) => `
      <div style="border:1.5px solid var(--gris-200);border-radius:var(--radio-md);padding:12px;margin-bottom:8px;background:var(--gris-50)">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <div style="width:24px;height:24px;border-radius:50%;background:var(--verde-800);color:white;font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
          <input class="ficha-input" style="flex:1;font-weight:600;font-size:.85rem" placeholder="Nombre del competidor"
            value="${c.nombre||''}" oninput="EMPRESA_STATE.planEmpresa.ap4.competidores[${i}].nombre=this.value">
          <select class="ficha-input" style="width:130px;font-size:.8rem" onchange="EMPRESA_STATE.planEmpresa.ap4.competidores[${i}].tipo=this.value">
            <option value="directo" ${c.tipo==='directo'?'selected':''}>Competidor directo</option>
            <option value="indirecto" ${c.tipo==='indirecto'?'selected':''}>Competidor indirecto</option>
            <option value="potencial" ${c.tipo==='potencial'?'selected':''}>Potencial entrante</option>
          </select>
          <button style="border:none;background:transparent;cursor:pointer;color:var(--rojo);padding:4px"
            onclick="EMPRESA_STATE.planEmpresa.ap4.competidores.splice(${i},1);renderPlanEmpresa()">✕</button>
        </div>
        <div class="ficha-grid-2" style="gap:8px">
          <div class="ficha-campo">
            <label style="color:var(--verde-700)">✓ Fortalezas</label>
            <textarea class="ficha-input" style="min-height:55px;resize:vertical;font-size:.8rem;border-color:var(--verde-300)"
              placeholder="Qué hacen bien..." oninput="EMPRESA_STATE.planEmpresa.ap4.competidores[${i}].fortalezas=this.value">${c.fortalezas||''}</textarea>
          </div>
          <div class="ficha-campo">
            <label style="color:var(--rojo)">✗ Debilidades</label>
            <textarea class="ficha-input" style="min-height:55px;resize:vertical;font-size:.8rem;border-color:#fca5a5"
              placeholder="En qué podemos superarles..." oninput="EMPRESA_STATE.planEmpresa.ap4.competidores[${i}].debilidades=this.value">${c.debilidades||''}</textarea>
          </div>
        </div>
        <div class="ficha-campo">
          <label>¿Cómo os diferencíais de este competidor?</label>
          <input class="ficha-input" style="font-size:.82rem" placeholder="Vuestra posición frente a este competidor concreto"
            value="${c.posicionamiento||''}" oninput="EMPRESA_STATE.planEmpresa.ap4.competidores[${i}].posicionamiento=this.value">
        </div>
      </div>`).join('')}

      ${campo('Perfil del cliente potencial', 'ap4', 'clientesPotenciales',
        'Describe a tu cliente ideal: quién es, dónde vive, cuánto gana, qué le preocupa, cómo busca información, qué le hace comprar y qué le haría repetir. Cuanto más concreto, más útil.',
        'RA2f · Identifica los clientes potenciales atendiendo a los objetivos del proyecto', 90)}
    </div>`;
    },

    '5': () => `
    <div class="ficha-card">
      <div class="ficha-card-header"><span>⚖️</span> Apartado 5 — Plan jurídico y trámites de constitución <span class="ra-chip" style="margin-left:auto">RA3e-f · RA5</span><button class="btn-ayuda-ctx" style="margin-left:8px" data-ayuda="plan-ap5" onclick="toggleAyuda('plan-ap5')" title="Conceptos y ayuda">❓</button></div>
      ${ayuda('La elección de la forma jurídica es una de las primeras decisiones legales de la empresa y condiciona la fiscalidad, la responsabilidad de los socios y los trámites necesarios. No se trata de elegir la más sencilla, sino la más adecuada para el proyecto.')}
      ${importarBtn('Importar datos de la ficha de empresa',
        "const d=EMPRESA_STATE.datos;if(d.formaJuridica){EMPRESA_STATE.planEmpresa.ap5.formaJuridica=d.formaJuridica;renderPlanEmpresa();mostrarToast('✓ Datos importados de la ficha','exito')}else{mostrarToast('Completa la ficha de empresa primero','error')}")}
      <div class="ficha-grid-2">
        <div class="ficha-campo">
          <label>Forma jurídica elegida <span class="ra-chip">RA3e</span></label>
          <select class="ficha-input" onchange="EMPRESA_STATE.planEmpresa.ap5.formaJuridica=this.value;renderPlanEmpresa()">
            <option value="">— Selecciona —</option>
            ${['Sociedad Limitada (S.L.)','Sociedad Anónima (S.A.)','Sociedad Limitada Nueva Empresa (SLNE)','Cooperativa','Sociedad Civil','Comunidad de Bienes','Empresario Individual (Autónomo)','Sociedad Laboral'].map(f=>`<option value="${f}" ${pe.ap5.formaJuridica===f?'selected':''}>${f}</option>`).join('')}
          </select>
        </div>
        ${pe.ap5.formaJuridica ? `
        <div style="padding:10px 12px;background:var(--verde-50);border-radius:var(--radio-md);border:1px solid var(--verde-200);font-size:.78rem;color:var(--verde-800)">
          ${{ 'Sociedad Limitada (S.L.)':'Capital mínimo: 3.000 € · Responsabilidad limitada al capital aportado · Régimen fiscal: IS (25%) · Requiere escritura pública e inscripción en Registro Mercantil', 'Sociedad Anónima (S.A.)':'Capital mínimo: 60.000 € · Responsabilidad limitada · IS (25%) · Escritura pública e inscripción en RM', 'Empresario Individual (Autónomo)':'Sin capital mínimo · Responsabilidad ilimitada con patrimonio personal · IRPF · Alta en RETA', 'Cooperativa':'Capital según estatutos · Responsabilidad limitada · IS tipo reducido · Registro de Cooperativas', 'Comunidad de Bienes':'Sin capital mínimo · Responsabilidad solidaria e ilimitada · IRPF socios · Contrato privado o escritura pública' }[pe.ap5.formaJuridica] || 'Consulta la normativa específica de esta forma jurídica'}
        </div>` : ''}
      </div>
      ${campo('Justificación de la forma jurídica elegida', 'ap5', 'justificacionForma',
        '¿Por qué habéis elegido esta forma jurídica y no otra? Argumenta en función del número de socios, el capital disponible, la responsabilidad que queréis asumir y las ventajas fiscales.',
        'RA3e · Selecciona la forma jurídica adecuada a los objetivos y características del proyecto', 80)}
      ${campo('Regímenes fiscales y obligaciones tributarias', 'ap5', 'regimenesFiscales',
        'Indica el régimen fiscal de la empresa (IS, IRPF, IVA...) y el tipo impositivo aplicable. ¿Qué impuestos deberá pagar la empresa? ¿Cuáles son las obligaciones de declaración trimestral y anual?',
        'RA5e · Trámites fiscales para la puesta en marcha', 80)}
      ${campo('Obligaciones periódicas y calendario fiscal', 'ap5', 'obligacionesPeriodicas',
        'Lista las obligaciones periódicas de la empresa una vez constituida: modelos trimestrales (303, 111), modelos anuales (200, 390, 347), libros contables obligatorios, depósito de cuentas en el Registro Mercantil...',
        'RA5f-g · Trámites ante la autoridad laboral, SS y otras administraciones', 80)}

      <!-- Trámites de constitución: importar del módulo actual -->
      <div style="margin-top:16px;padding:12px 14px;background:var(--verde-50);border-radius:var(--radio-md);border:1px solid var(--verde-200)">
        <div style="font-size:.82rem;font-weight:600;color:var(--verde-800);margin-bottom:4px">📑 Trámites de constitución</div>
        <div style="font-size:.78rem;color:var(--verde-700)">
          Los trámites de constitución están integrados en la sección <strong>Mi Empresa → Trámites</strong>.
          Desde allí puedes completarlos y subir la documentación. El progreso se refleja automáticamente en este plan.
        </div>
        <button class="btn-secundario" style="margin-top:8px;font-size:.78rem;padding:5px 10px"
          onclick="irA('empresa');setTimeout(()=>empTab('tramites'),100)">
          📑 Ir a Trámites de constitución →
        </button>
      </div>
    </div>`,

    '6': () => `
    <div class="ficha-card">
      <div class="ficha-card-header"><span>👥</span> Apartado 6 — Plan organizativo y de RRHH <span class="ra-chip" style="margin-left:auto">RA3c-d · RA6c</span><button class="btn-ayuda-ctx" style="margin-left:8px" data-ayuda="plan-ap6" onclick="toggleAyuda('plan-ap6')" title="Conceptos y ayuda">❓</button></div>
      ${ayuda('El plan organizativo define cómo se estructura la empresa internamente: quién hace qué, quién depende de quién y cómo se coordinan los departamentos. Una buena organización es la base de la eficiencia operativa.')}
      ${importarBtn('Importar organigrama de Mi Empresa',
        "mostrarToast('Ve a Mi Empresa → Organigrama para ver la estructura actual','exito')")}
      ${campo('Estructura organizativa y descripción del organigrama', 'ap6', 'estructuraOrg',
        'Describe la estructura de la empresa: ¿es funcional, divisional o matricial? ¿Cuántos niveles jerárquicos tiene? ¿Cómo se coordinan los departamentos? Describe también el organigrama que aparece en la sección Organigrama de Mi Empresa.',
        'RA3c · Relaciona la organización con el tipo y fines de la empresa', 100)}

      <!-- Puestos de trabajo -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;margin-top:4px">
        <div>
          <div style="font-size:.72rem;font-weight:700;color:var(--verde-700);text-transform:uppercase;letter-spacing:.04em">Descripción de puestos de trabajo</div>
          <div style="font-size:.7rem;color:var(--gris-400)">RA3d · Identifica las diferentes funciones dentro de la empresa</div>
        </div>
        <button class="btn-accion" style="padding:5px 12px;font-size:.78rem"
          onclick="EMPRESA_STATE.planEmpresa.ap6.puestos.push({nombre:'',departamento:'',funciones:'',requisitos:'',salario:''});renderPlanEmpresa()">
          + Añadir puesto
        </button>
      </div>
      ${(pe.ap6.puestos||[]).length === 0 ? `<div style="padding:12px;background:var(--gris-50);border-radius:var(--radio-md);text-align:center;color:var(--gris-400);font-size:.82rem;margin-bottom:12px">Describe los puestos de trabajo que necesita la empresa</div>` :
      (pe.ap6.puestos||[]).map((p,i) => `
      <div style="border:1.5px solid var(--gris-200);border-radius:var(--radio-md);padding:12px;margin-bottom:8px;background:var(--gris-50)">
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <input class="ficha-input" style="flex:1;font-weight:600" placeholder="Nombre del puesto"
            value="${p.nombre||''}" oninput="EMPRESA_STATE.planEmpresa.ap6.puestos[${i}].nombre=this.value">
          <input class="ficha-input" style="width:160px" placeholder="Departamento"
            value="${p.departamento||''}" oninput="EMPRESA_STATE.planEmpresa.ap6.puestos[${i}].departamento=this.value">
          <button style="border:none;background:transparent;cursor:pointer;color:var(--rojo);padding:4px"
            onclick="EMPRESA_STATE.planEmpresa.ap6.puestos.splice(${i},1);renderPlanEmpresa()">✕</button>
        </div>
        <div class="ficha-grid-2" style="gap:8px">
          <div class="ficha-campo">
            <label>Funciones principales</label>
            <textarea class="ficha-input" style="min-height:55px;resize:vertical;font-size:.8rem"
              oninput="EMPRESA_STATE.planEmpresa.ap6.puestos[${i}].funciones=this.value">${p.funciones||''}</textarea>
          </div>
          <div class="ficha-campo">
            <label>Requisitos del candidato</label>
            <textarea class="ficha-input" style="min-height:55px;resize:vertical;font-size:.8rem"
              oninput="EMPRESA_STATE.planEmpresa.ap6.puestos[${i}].requisitos=this.value">${p.requisitos||''}</textarea>
          </div>
        </div>
      </div>`).join('')}

      ${campo('Política de RRHH y plan de formación', 'ap6', 'politicaRRHH',
        'Describe cómo se gestionará el equipo humano: proceso de selección, política retributiva, evaluación del desempeño, plan de carrera. ¿Qué formación inicial y continua recibirán los empleados?',
        'RA6c · Planifica la gestión de los recursos humanos', 80)}
    </div>`,

    '7': () => vistaAp7(),

    '8': () => `
    <div class="ficha-card">
      <div class="ficha-card-header"><span>📣</span> Apartado 8 — Plan de marketing y comercialización <span class="ra-chip" style="margin-left:auto">RA6b · RA2</span><button class="btn-ayuda-ctx" style="margin-left:8px" data-ayuda="plan-ap8" onclick="toggleAyuda('plan-ap8')" title="Conceptos y ayuda">❓</button></div>
      ${ayuda('El plan de marketing define cómo vais a llegar a vuestros clientes y cómo vais a convencerles de que compren. Se estructura en torno a las 4P: Producto, Precio, Plaza (distribución) y Promoción (comunicación). Cada decisión debe justificarse en función del cliente objetivo y la competencia.')}
      ${campo('Política de producto', 'ap8', 'producto',
        'Describe tu oferta completa: gama de productos/servicios, características diferenciadoras, calidad, marca, envase, garantías... ¿Qué ciclo de vida tiene el producto? ¿Hay planes de ampliar la gama?\nConecta con la descripción del negocio del apartado 3.',
        'RA6b · RA2d · Política de producto y gestión comercial', 100)}
      ${campo('Política de precios', 'ap8', 'precio',
        'Explica tu estrategia de precios: ¿cómo has calculado el precio de venta? (coste + margen, comparación con la competencia, valor percibido por el cliente). ¿Habrá descuentos, promociones o precios diferenciados por segmento o volumen?\n¿Tu precio te posiciona en el segmento alto, medio o bajo? ¿Por qué?',
        'Incluye la tabla de precios de tus principales productos/servicios', 90)}
      ${campo('Canales de distribución', 'ap8', 'distribucion',
        'Describe cómo llegará el producto al cliente final: ¿venta directa, a través de distribuidores, tienda propia, e-commerce, marketplace, ferias...? ¿Cuál será el área geográfica de actuación inicial?\n¿Cuál es el coste logístico y quién lo asume?',
        'RA6b · Gestiona el proceso de comercialización', 80)}
      ${campo('Plan de comunicación y promoción', 'ap8', 'comunicacion',
        'Define las acciones de marketing que vais a realizar para dar a conocer la empresa: redes sociales (cuáles, con qué frecuencia), publicidad online/offline, relaciones públicas, participación en ferias, SEO/SEM, email marketing...\nIndica el presupuesto estimado de cada acción.',
        'RA6b · RA1f · Considera también la posibilidad de internacionalización en futuras fases', 100)}
      ${campoCorto('Presupuesto de marketing anual (€)', 'ap8', 'presupuestoMarketing', 'Ej: 2.500 €', 'Distribúyelo entre las acciones del plan de comunicación')}
    </div>`,
  };

  return (VISTAS[ap] || VISTAS['1'])();
}

/* ── Generar dossier ───────────────────────────────────────── */
/* ============================================================
   PDF DEL PLAN DE EMPRESA — window.print() approach
   Se genera HTML completo en ventana nueva y se imprime.
   Los datos de cálculo reutilizan las funciones ap7_* existentes.
   ============================================================ */
function generarDossier() {
  const pe  = EMPRESA_STATE.planEmpresa;
  const d   = EMPRESA_STATE.datos;
  const emp = EMPRESA_STATE.emprendimiento || {};
  const ap1 = pe.ap1 || {}; const ap2 = pe.ap2 || {}; const ap3 = pe.ap3 || {};
  const ap4 = pe.ap4 || {}; const ap5 = pe.ap5 || {}; const ap6 = pe.ap6 || {};
  const ap7 = pe.ap7 || {}; const ap8 = pe.ap8 || {};
  const año = new Date().getFullYear();

  /* ── Helpers de formato ── */
  const v    = s => (s && s.trim) ? s.trim() : '';
  const E    = n => (parseFloat(n)||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
  const N    = n => (parseFloat(n)||0).toLocaleString('es-ES',{minimumFractionDigits:0,maximumFractionDigits:0});
  const pct  = n => (parseFloat(n)||0).toFixed(1)+'%';
  const vacio = txt => txt && txt.trim()
    ? txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    : '<em style="color:#9ca3af">Sin cumplimentar</em>';

  /* ── Bloque de texto con label ── */
  const bloque = (lbl,val,ra='') => `
    <div class="blq">
      <div class="blq-lbl">${lbl}${ra?` <span class="ra">${ra}</span>`:''}</div>
      <div class="blq-val">${vacio(val)}</div>
    </div>`;

  const fila2 = (items) => `<div class="grid2">${items.map(([l,v,r])=>bloque(l,v,r)).join('')}</div>`;

  /* ── Encabezado de sección ── */
  const secH = (num,ico,tit,ra='') => `
    <div class="sec-head">
      <span class="sec-num">${num}</span>
      <span class="sec-ico">${ico}</span>
      <span class="sec-tit">${tit}</span>
      ${ra?`<span class="ra">${ra}</span>`:''}
    </div>`;

  /* ── Tabla genérica ── */
  const tabla = (headers, rows, nota='') => `
    <table>
      <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>${nota?`<div class="nota-tabla">${nota}</div>`:''}`;

  /* ── Fila de la cuenta de resultados ── */
  const filaP = (lbl,vals,bold=false,negativo=false) => {
    const color = bold ? (vals[0]>=0?'#166534':'#991b1b') : (negativo?'#dc2626':'#374151');
    return `<tr class="${bold?'total-row':''}">
      <td>${lbl}</td>
      ${vals.map(v=>`<td style="text-align:right;color:${bold?(v>=0?'#166534':'#991b1b'):(negativo&&v<0?'#dc2626':'inherit')}">${E(v)} €</td>`).join('')}
    </tr>`;
  };

  /* ── Datos financieros calculados ── */
  const inv       = Array.isArray(ap7.inversion) ? ap7.inversion : [];
  const fin       = Array.isArray(ap7.financiacion) ? ap7.financiacion : [];
  const gasF      = ap7.gastos?.fijos || [];
  const gasV      = ap7.gastos?.variables || [];
  const bal       = ap7.balance || {};
  const ANYOS     = [1,2,3];
  const ventas    = ANYOS.map(a => ap7_ventasAnuales(a));
  const gfAnu     = ANYOS.map(() => ap7_gastosFijosMes()*12);
  const gvAnu     = ANYOS.map((_,i) => (gasV.reduce((s,g)=>s+ventas[i]*(parseFloat(g.pctSobreVentas)||0)/100,0)));
  const amort     = inv.filter(i=>i.amortizacion>0).reduce((s,i)=>{
    const imp=parseFloat(i.importe)||0; const a=parseInt(i.amortizacion)||1; return s+imp/a; },0);
  const gastoFin  = fin.filter(f=>f.tipo==='Financiación ajena').reduce((s,f)=>
    s+(parseFloat(f.importe)||0)*(parseFloat(f.interes)||0)/100 ,0);
  const ebitda    = ANYOS.map((_,i) => ventas[i]-gfAnu[i]-gvAnu[i]);
  const ebit      = ebitda.map(e => e-amort);
  const bai       = ebit.map(e => e-gastoFin);
  const impSoc    = bai.map(b => b>0 ? b*0.25 : 0);
  const benefNeto = bai.map((b,i) => b-impSoc[i]);
  const totalInv  = ap7_totalInversion();
  const totalFin  = ap7_totalFinanciacion();
  const fp        = ap7_fondosPropios();
  const fa        = ap7_deudaTotal();
  const umbral    = ap7_umbral();
  const tir       = ap7_TIR();
  const promotores = ap2.promotores || [];
  const competidores = ap4.competidores || [];
  const canvas    = emp.canvas || {};
  const org       = d.organigrama || {};
  const DEPTS     = {direccion:'Dirección',rrhh:'RRHH',comercial:'Comercial',contabilidad:'Contabilidad',fiscal:'Fiscal'};

  /* ── Progreso por apartado ── */
  const pcts = calcProgresoPlan ? calcProgresoPlan() : 0;

  /* ══════════════════════════════════════════════════════════
     HTML DEL DOCUMENTO
  ══════════════════════════════════════════════════════════ */
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Plan de empresa · ${d.nombre||'Empresa'} · ${año}</title>
<style>
/* ── Reset ── */
*{box-sizing:border-box;margin:0;padding:0}
html{font-size:13px}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1c1e;background:#fff;padding:0}
/* ── Portada ── */
.portada{background:linear-gradient(160deg,#0a2e1a 0%,#1a6535 55%,#2a9d52 100%);color:#fff;
  padding:60px 52px 48px;min-height:320px;display:flex;flex-direction:column;justify-content:space-between;
  break-after:page}
.portada-logo{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#a8e6be;margin-bottom:32px}
.portada h1{font-size:32px;font-weight:800;letter-spacing:-.5px;line-height:1.1;margin-bottom:6px}
.portada .lema{font-size:14px;color:#d4f4e0;font-style:italic;margin-bottom:24px}
.portada .meta{font-size:11.5px;color:#a8e6be;line-height:2.1}
.portada .chips{margin-top:16px;display:flex;flex-wrap:wrap;gap:6px}
.portada .chip{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);
  border-radius:20px;padding:3px 12px;font-size:10.5px;color:#edfaf3}
/* ── Índice ── */
.toc{padding:40px 52px;break-after:page}
.toc h2{font-size:13px;font-weight:700;color:#134a28;margin-bottom:18px;
  border-bottom:2px solid #d4f4e0;padding-bottom:7px;text-transform:uppercase;letter-spacing:.08em}
.toc-fila{display:flex;justify-content:space-between;align-items:center;
  padding:6px 0;border-bottom:1px dotted #e5e7eb}
.toc-tit{font-size:12px;color:#374151;font-weight:500}
.toc-estado{font-size:11px}
.toc-ok{color:#16a34a;font-weight:600}
.toc-ko{color:#9ca3af}
.toc-pct-bar{width:80px;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden;display:inline-block;margin-left:8px;vertical-align:middle}
.toc-pct-fill{height:100%;border-radius:2px}
/* ── Secciones ── */
.seccion{padding:28px 52px 20px;break-inside:avoid}
.seccion+.seccion{border-top:3px solid #edfaf3}
.page-break{break-before:page}
.sec-head{display:flex;align-items:center;gap:8px;margin-bottom:18px;padding-bottom:10px;
  border-bottom:2px solid #d4f4e0}
.sec-num{background:#134a28;color:#fff;width:24px;height:24px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
.sec-ico{font-size:17px}
.sec-tit{font-size:15px;font-weight:700;color:#134a28;flex:1}
.ra{background:#edfaf3;color:#134a28;border:1px solid #a8e6be;border-radius:10px;
  padding:2px 8px;font-size:10px;font-weight:600;white-space:nowrap}
/* ── Bloques de texto ── */
.blq{margin-bottom:12px}
.blq-lbl{font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;
  letter-spacing:.05em;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.blq-val{font-size:12.5px;color:#1a1c1e;line-height:1.7;white-space:pre-wrap;
  background:#f8fdf9;border-left:3px solid #d4f4e0;padding:8px 12px;border-radius:0 4px 4px 0}
.blq-val em{color:#9ca3af;font-style:italic}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px}
/* ── DAFO ── */
.dafo{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.dafo-cell{padding:9px 11px;border-radius:4px;font-size:12px;line-height:1.6}
.dafo-cell .dt{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.df{background:#dcfce7;color:#14532d}.dd{background:#fee2e2;color:#7f1d1d}
.do{background:#dbeafe;color:#1e3a8a}.da{background:#fef3c7;color:#78350f}
/* ── Canvas ── */
.canvas{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 0}
.canvas-cell{background:#f7fdf9;border:1px solid #d4f4e0;border-radius:4px;padding:8px 10px}
.canvas-cell .ct{font-size:9.5px;font-weight:700;color:#217a3e;text-transform:uppercase;
  letter-spacing:.05em;margin-bottom:3px}
.canvas-cell .cv{font-size:12px;color:#1a1c1e;line-height:1.5;white-space:pre-wrap}
.canvas-cell .cv em{color:#9ca3af;font-style:italic}
/* ── Tablas ── */
table{width:100%;border-collapse:collapse;font-size:11.5px;margin:8px 0 12px}
th{background:#edfaf3;text-align:left;padding:6px 9px;font-weight:600;color:#134a28;border:1px solid #d4f4e0}
td{padding:6px 9px;border:1px solid #edf0f4;vertical-align:top;line-height:1.4}
td.num{text-align:right;font-weight:500}
td.neg{color:#dc2626}
tr:nth-child(even){background:#fafafa}
.total-row td{background:#f0fdf4;font-weight:700;border-top:2px solid #a7f3d0}
.subtotal-row td{background:#f8fdf9;font-weight:600}
.nota-tabla{font-size:10.5px;color:#6b7280;margin-top:4px;font-style:italic}
/* ── Tarjetas de ratios ── */
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0}
.kpi{background:#f0fdf4;border:1px solid #d4f4e0;border-radius:6px;padding:10px 12px;text-align:center}
.kpi .kv{font-size:20px;font-weight:800;color:#166534;line-height:1.1;margin-bottom:3px}
.kpi .kv.malo{color:#991b1b}
.kpi .kv.regular{color:#92400e}
.kpi .kl{font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em}
.kpi .kr{font-size:9.5px;color:#9ca3af;margin-top:2px}
/* ── Balance ── */
.bal2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:10px 0}
.bal-sec{font-size:10px;font-weight:700;color:#217a3e;text-transform:uppercase;padding:4px 9px;
  background:#edfaf3;border-radius:3px;margin-bottom:4px;letter-spacing:.04em}
/* ── Aviso vacío ── */
.aviso{background:#fef9c3;border:1px solid #fde68a;border-radius:4px;padding:7px 11px;
  font-size:11.5px;color:#92400e;margin:6px 0}
/* ── Pie ── */
.pie{margin-top:24px;padding:10px 52px;border-top:1px solid #e5e7eb;
  display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;
  position:running(pie)}
/* ── Print ── */
@page{size:A4;margin:0}
@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  .pie{display:flex}
  .no-print{display:none}
}
</style></head><body>

<!-- PORTADA -->
<div class="portada">
  <div class="portada-logo">Plan de empresa · Grado Superior Administración y Finanzas · IES Cantillana · Módulo 3160</div>
  <div>
    <div class="portada h1" style="font-size:32px;font-weight:800;color:#fff;margin-bottom:6px">${d.nombre||'Empresa sin nombre'}</div>
    ${v(ap1.nombreComercial)?`<div class="lema">${ap1.nombreComercial}${v(ap1.lema)?' · "'+ap1.lema+'"':''}</div>`:''}
    <div class="chips">
      ${d.cifProvisional?`<span class="chip">CIF ${d.cifProvisional}</span>`:''}
      ${d.sector?`<span class="chip">${d.sector}</span>`:''}
      ${d.formaJuridica||pe.ap5?.formaJuridica?`<span class="chip">${pe.ap5?.formaJuridica||d.formaJuridica}</span>`:''}
      ${promotores.filter(p=>p.nombre?.trim()).map(p=>`<span class="chip">👤 ${p.nombre}</span>`).join('')}
    </div>
  </div>
  <div class="meta">
    ${d.domicilioSocial?`<div>📍 ${d.domicilioSocial} · Cantillana (Sevilla)</div>`:''}
    <div>📅 Curso ${año}–${año+1}</div>
    <div style="margin-top:6px;font-size:10.5px;color:#6fcf8f">Generado el ${new Date().toLocaleDateString('es-ES')} con SimulApp v24 · Plan ${pcts}% completado</div>
  </div>
</div>

<!-- ÍNDICE -->
<div class="toc">
  <h2>Índice de contenidos</h2>
  ${[
    {n:'1',ico:'📄',tit:'Presentación y resumen ejecutivo',ra:'RA3a-b', ok:!!(ap1.resumenEjecutivo?.length>20)},
    {n:'2',ico:'👤',tit:'Equipo promotor',ra:'RA1d · RA3c', ok:promotores.length>0},
    {n:'3',ico:'💼',tit:'Descripción del negocio y Canvas',ra:'RA2a-e · RA3', ok:!!(ap3.descripcionActividad?.length>20)},
    {n:'4',ico:'🔍',tit:'Análisis del entorno y mercado',ra:'RA2g-i', ok:!!(ap4.dafoF?.length>5)},
    {n:'5',ico:'⚖️',tit:'Plan jurídico-fiscal',ra:'RA3e-f · RA5', ok:!!(ap5.formaJuridica?.length>1)},
    {n:'6',ico:'👥',tit:'Plan de organización y RRHH',ra:'RA3c-d', ok:Object.values(org).some(p=>p.alumno?.trim())},
    {n:'7',ico:'📊',tit:'Plan económico-financiero',ra:'RA4', ok:totalInv>0||ventas[0]>0},
    {n:'8',ico:'📣',tit:'Plan de marketing · 4P',ra:'RA6b', ok:!!(ap8.producto?.length>10)},
  ].map(s=>`
    <div class="toc-fila">
      <span class="toc-tit">${s.ico} ${s.n}. ${s.tit} <span class="ra">${s.ra}</span></span>
      <span class="${s.ok?'toc-ok':'toc-ko'}">${s.ok?'✓ Completado':'Pendiente'}</span>
    </div>`).join('')}
</div>

<!-- ── APARTADO 1 ── -->
<div class="seccion">
  ${secH('1','📄','Presentación y resumen ejecutivo','RA3a · RA3b')}
  ${fila2([
    ['Denominación social', d.nombre||pe.ap1?.nombreComercial, ''],
    ['Nombre comercial / Marca', ap1.nombreComercial, ''],
    ['Eslogan', ap1.lema, ''],
    ['Sector de actividad', d.sector, ''],
  ])}
  ${bloque('Resumen ejecutivo', ap1.resumenEjecutivo, 'RA3b')}
  ${fila2([
    ['Misión', ap1.mision, 'RA3a'],
    ['Visión', ap1.vision, 'RA3a'],
  ])}
  ${bloque('Valores corporativos', ap1.valores)}
</div>

<!-- ── APARTADO 2 ── -->
<div class="seccion">
  ${secH('2','👤','Equipo promotor','RA1d · RA3c')}
  ${promotores.filter(p=>p.nombre?.trim()).length > 0
    ? tabla(
        ['Nombre','Cargo / Rol','Aportación','Tipo aportación'],
        promotores.filter(p=>p.nombre?.trim()).map(p=>[
          p.nombre||'—', p.cargo||'Socio/a promotor/a',
          p.valorAportacion ? N(p.valorAportacion)+' €' : '—',
          p.tipoAportacion||'—'
        ]),
        'Capital social total: '+N(typeof capitalTotalSocios==='function'?capitalTotalSocios():0)+' €'
      )
    : '<div class="aviso">⚠️ Sin promotores registrados · Ir a Apartado 2 del plan</div>'}
  ${bloque('Motivación para emprender', ap2.motivacion, 'RA1d')}
  ${fila2([
    ['Capacitación y experiencia del equipo', ap2.capacitacion, 'RA3c'],
    ['Aportaciones al proyecto', ap2.aportaciones, ''],
  ])}
</div>

<!-- ── APARTADO 3 ── -->
<div class="seccion page-break">
  ${secH('3','💼','Descripción del negocio y modelo Canvas','RA2a-e · RA3')}
  ${bloque('Descripción de la actividad', ap3.descripcionActividad, 'RA2a')}
  ${fila2([
    ['Productos y servicios', ap3.productosServicios, 'RA2b'],
    ['Propuesta de valor', ap3.propuestaValor, 'RA2c'],
  ])}
  ${fila2([
    ['Ventaja competitiva', ap3.ventajaCompetitiva, 'RA2d'],
    ['Modelo de negocio', ap3.modeloNegocio, 'RA2e'],
  ])}

  ${Object.values(canvas).some(cv=>cv&&cv.trim()) ? `
  <div style="margin-top:14px">
    <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">
      Business Model Canvas <span class="ra">RA2</span>
    </div>
    <div class="canvas">
      ${[
        ['Propuesta de valor', canvas.propuestaValor],
        ['Segmentos de clientes', canvas.segmentosClientes],
        ['Canales de distribución', canvas.canales],
        ['Relaciones con clientes', canvas.relacionesClientes],
        ['Fuentes de ingresos', canvas.fuentesIngresos],
        ['Recursos clave', canvas.recursosClaves],
        ['Actividades clave', canvas.actividadesClaves],
        ['Socios clave', canvas.sociosClave],
        ['Estructura de costes', canvas.estructuraCostes],
      ].map(([ct,cv])=>`
        <div class="canvas-cell">
          <div class="ct">${ct}</div>
          <div class="cv">${cv && cv.trim() ? cv.replace(/&/g,'&amp;').replace(/</g,'&lt;') : '<em>Sin cumplimentar</em>'}</div>
        </div>`).join('')}
    </div>
  </div>` : ''}
</div>

<!-- ── APARTADO 4 ── -->
<div class="seccion">
  ${secH('4','🔍','Análisis del entorno y mercado','RA2g-i')}
  ${bloque('Análisis del sector', ap4.analisisSector, 'RA2g')}
  ${bloque('Mercado objetivo y segmentos', ap4.mercadoObjetivo, 'RA2h')}

  ${(ap4.dafoF||ap4.dafoD||ap4.dafoO||ap4.dafoA) ? `
  <div style="margin-top:10px">
    <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">
      Análisis DAFO <span class="ra">RA2i</span>
    </div>
    <div class="dafo">
      <div class="dafo-cell df"><div class="dt">Fortalezas</div>${vacio(ap4.dafoF)}</div>
      <div class="dafo-cell dd"><div class="dt">Debilidades</div>${vacio(ap4.dafoD)}</div>
      <div class="dafo-cell do"><div class="dt">Oportunidades</div>${vacio(ap4.dafoO)}</div>
      <div class="dafo-cell da"><div class="dt">Amenazas</div>${vacio(ap4.dafoA)}</div>
    </div>
  </div>` : '<div class="aviso">⚠️ DAFO pendiente de cumplimentar</div>'}

  ${competidores.filter(c=>c.nombre?.trim()).length > 0 ? `
  <div style="margin-top:12px">
    <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">
      Análisis de competidores (${competidores.length})
    </div>
    ${tabla(
      ['Competidor','Fortalezas','Debilidades','Precio relativo','Cuota est.'],
      competidores.filter(c=>c.nombre?.trim()).map(c=>[
        c.nombre||'—', c.fortalezas||'—', c.debilidades||'—',
        c.precioRelativo||'—', c.cuotaMercado ? c.cuotaMercado+'%' : '—'
      ])
    )}
  </div>` : ''}

  ${bloque('Clientes potenciales', ap4.clientesPotenciales, 'RA2h')}
</div>

<!-- ── APARTADO 5 ── -->
<div class="seccion">
  ${secH('5','⚖️','Plan jurídico-fiscal','RA3e-f · RA5')}
  ${fila2([
    ['Forma jurídica adoptada', ap5.formaJuridica, 'RA3e'],
    ['Régimen fiscal', ap5.regimenesFiscales, 'RA5'],
  ])}
  ${bloque('Justificación de la forma jurídica', ap5.justificacionForma, 'RA3f')}
  ${bloque('Obligaciones periódicas', ap5.obligacionesPeriodicas, 'RA5')}

  ${EMPRESA_STATE.tramites?.filter(t=>t.estado==='completado').length > 0 ? `
  <div style="margin-top:10px">
    <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">
      Trámites de constitución completados
    </div>
    ${tabla(
      ['Trámite','Organismo','Notas'],
      EMPRESA_STATE.tramites.filter(t=>t.estado==='completado')
        .map(t=>[t.nombre||t.id, t.organismo||'—', t.notas||'—'])
    )}
  </div>` : ''}
</div>

<!-- ── APARTADO 6 ── -->
<div class="seccion">
  ${secH('6','👥','Plan de organización y RRHH','RA3c-d')}
  ${bloque('Estructura organizativa', ap6.estructuraOrg, 'RA3c')}

  <div style="margin-top:10px">
    <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Organigrama de puestos</div>
    ${tabla(
      ['Departamento','Responsable','Tipo de contrato','Jornada','Funciones principales'],
      Object.entries(DEPTS).map(([k,nom]) => {
        const p = org[k]||{};
        return [nom, p.alumno||'—', p.tipoContrato||'—', p.jornada||'—', p.funciones||'—'];
      })
    )}
  </div>

  ${bloque('Política de RRHH y convenio colectivo', ap6.politicaRRHH, 'RA3d')}
  ${bloque('Plan de formación', ap6.planFormacion)}
</div>

<!-- ── APARTADO 7 — PLAN FINANCIERO ── -->
<div class="seccion page-break">
  ${secH('7','📊','Plan económico-financiero','RA4')}

  <!-- 7.1 Inversión -->
  <div style="font-size:11px;font-weight:700;color:#217a3e;margin:8px 0 4px">7.1 · Inversión inicial y financiación <span class="ra">RA4c · RA3g</span></div>
  <div class="bal2col">
    <div>
      <div class="bal-sec">Inversión necesaria · ${E(totalInv)} €</div>
      ${tabla(
        ['Concepto','Categoría','Importe (€)','Amort.'],
        inv.filter(i=>parseFloat(i.importe)>0).map(i=>[
          i.concepto, i.categoria,
          '<span style="font-weight:600">'+E(i.importe)+'</span>',
          i.amortizacion ? i.amortizacion+' años' : '—'
        ])
      )}
    </div>
    <div>
      <div class="bal-sec">Fuentes de financiación · ${E(totalFin)} €</div>
      ${tabla(
        ['Fuente','Tipo','Importe (€)','Interés'],
        fin.filter(f=>parseFloat(f.importe)>0).map(f=>[
          f.fuente, f.tipo,
          '<span style="font-weight:600">'+E(f.importe)+'</span>',
          f.interes ? f.interes+'%' : '—'
        ])
      )}
      <div class="nota-tabla">
        Fondos propios: ${E(fp)} € · Financiación ajena: ${E(fa)} €
        ${fa>0&&fp>0 ? ' · Ratio de endeudamiento: '+(fa/fp).toFixed(2) : ''}
      </div>
    </div>
  </div>

  <!-- 7.2 Ventas -->
  ${ap7.ventas?.productos?.some(p=>parseFloat(p.precioUnitario)>0) ? `
  <div style="font-size:11px;font-weight:700;color:#217a3e;margin:14px 0 4px">7.2 · Previsión de ventas <span class="ra">RA4g</span></div>
  ${tabla(
    ['Producto / Servicio','Precio unitario (€)','Ud/mes base','Ingresos año 1 (€)','Ingresos año 2 (€)','Ingresos año 3 (€)'],
    ap7.ventas.productos.filter(p=>parseFloat(p.precioUnitario)>0).map(p => {
      const crecA2 = 1+(parseFloat(ap7.ventas?.crecimientoA2)||0)/100;
      const crecA3 = crecA2*(1+(parseFloat(ap7.ventas?.crecimientoA3)||0)/100);
      const a1 = parseFloat(p.precioUnitario)*parseFloat(p.unidadesBase)*12;
      return [p.nombre||'—', E(p.precioUnitario), N(p.unidadesBase),
        E(a1), E(a1*crecA2), E(a1*crecA3)];
    })
  )}` : ''}

  <!-- 7.3 Gastos -->
  ${gasF.filter(g=>parseFloat(g.importe)>0).length > 0 ? `
  <div style="font-size:11px;font-weight:700;color:#217a3e;margin:14px 0 4px">7.3 · Estructura de costes <span class="ra">RA4g</span></div>
  <div class="bal2col">
    <div>
      <div class="bal-sec">Gastos fijos mensuales · ${E(ap7_gastosFijosMes())} €/mes</div>
      ${tabla(['Concepto','Importe mensual (€)'],
        gasF.filter(g=>parseFloat(g.importe)>0).map(g=>[g.concepto, E(g.importe)]))}
    </div>
    <div>
      <div class="bal-sec">Gastos variables (% sobre ventas)</div>
      ${tabla(['Concepto','% s/ventas'],
        gasV.filter(g=>parseFloat(g.pctSobreVentas)>0).map(g=>[g.concepto, pct(g.pctSobreVentas)]))}
      ${umbral>0 ? `<div class="nota-tabla">Umbral de rentabilidad: ${E(umbral)} € / mes</div>` : ''}
    </div>
  </div>` : ''}

  <!-- 7.5 Balance -->
  ${(bal.capitalSocial>0||bal.tesoreria>0||bal.inmovilizadoMaterial>0) ? `
  <div style="font-size:11px;font-weight:700;color:#217a3e;margin:14px 0 4px">7.5 · Balance de situación previsional (fin año 1) <span class="ra">RA4h</span></div>
  <div class="bal2col">
    <div>
      <div class="bal-sec">ACTIVO</div>
      ${tabla(['Partida','Importe (€)'],[
        ['Inmovilizado material neto', E((bal.inmovilizadoMaterial||0)-(bal.amortAcum||0))],
        ['Inmovilizado intangible', E(bal.inmovilizadoIntangible||0)],
        ['Existencias', E(bal.existencias||0)],
        ['Clientes (deudores)', E(bal.clientes||0)],
        ['Tesorería', E(bal.tesoreria||0)],
        ['Otros activos', E(bal.otroActivo||0)],
      ])}
      <div class="nota-tabla"><strong>Total activo: ${E(
        (bal.inmovilizadoMaterial||0)-(bal.amortAcum||0)+(bal.inmovilizadoIntangible||0)+(bal.existencias||0)+(bal.clientes||0)+(bal.tesoreria||0)+(bal.otroActivo||0)
      )} €</strong></div>
    </div>
    <div>
      <div class="bal-sec">PATRIMONIO NETO Y PASIVO</div>
      ${tabla(['Partida','Importe (€)'],[
        ['Capital social', E(bal.capitalSocial||0)],
        ['Reservas', E(bal.reservas||0)],
        ['Resultado del ejercicio', E(bal.resultadoEjercicio||benefNeto[0]||0)],
        ['Deudas largo plazo', E(bal.deudasLP||0)],
        ['Proveedores', E(bal.proveedores||0)],
        ['HP acreedora', E(bal.hpAcreedora||0)],
        ['Otras deudas CP', E((bal.deudasCP||0)+(bal.otrosPasivoC||0))],
      ])}
      <div class="nota-tabla"><strong>Total PN + Pasivo: ${E(
        (bal.capitalSocial||0)+(bal.reservas||0)+(bal.resultadoEjercicio||benefNeto[0]||0)+(bal.deudasLP||0)+(bal.proveedores||0)+(bal.hpAcreedora||0)+(bal.deudasCP||0)+(bal.otrosPasivoC||0)
      )} €</strong></div>
    </div>
  </div>` : ''}

  <!-- 7.6 Cuenta de resultados -->
  <div style="font-size:11px;font-weight:700;color:#217a3e;margin:14px 0 4px">7.6 · Cuenta de resultados previsional (3 años) <span class="ra">RA4h</span></div>
  ${ventas[0]>0||ventas[1]>0 ? `
  <table>
    <thead><tr style="background:#edfaf3;border-bottom:2px solid #a7f3d0">
      <th style="text-align:left">Cuenta de pérdidas y ganancias</th>
      <th style="text-align:right;color:#166534">Año 1</th>
      <th style="text-align:right;color:#1e40af">Año 2</th>
      <th style="text-align:right;color:#9333ea">Año 3</th>
    </tr></thead>
    <tbody>
      ${filaP('(+) Importe neto cifra de negocios', ventas, false)}
      ${filaP('(-) Coste de ventas (gastos variables)', gvAnu.map(v=>-v), false, true)}
      ${filaP('(-) Gastos fijos (personal, alquiler...)', gfAnu.map(v=>-v), false, true)}
      ${filaP('(-) Amortizaciones', [-amort,-amort,-amort], false, true)}
      ${filaP('= EBIT (Resultado de explotación)', ebit, true)}
      ${gastoFin>0?filaP('(-) Gastos financieros', [-gastoFin,-gastoFin,-gastoFin], false, true):''}
      ${filaP('= BAI (Resultado antes impuestos)', bai, true)}
      ${filaP('(-) Impuesto sobre sociedades (25%)', impSoc.map(v=>-v), false, true)}
      ${filaP('= RESULTADO NETO DEL EJERCICIO', benefNeto, true)}
    </tbody>
    <tfoot><tr style="background:#f8fdf9">
      <td style="font-size:10.5px;color:#6b7280">Margen neto sobre ventas</td>
      ${ventas.map((v,i)=>`<td style="text-align:right;font-size:10.5px;color:#6b7280">${v>0?pct(benefNeto[i]/v*100):'—'}</td>`).join('')}
    </tr></tfoot>
  </table>` : '<div class="aviso">⚠️ Sin datos de ventas — cumplimenta la tabla de previsión de ventas</div>'}

  <!-- 7 · KPIs de viabilidad -->
  ${(totalInv>0||ventas[0]>0) ? `
  <div style="font-size:11px;font-weight:700;color:#217a3e;margin:14px 0 8px">Indicadores de viabilidad <span class="ra">RA4a-h</span></div>
  <div class="kpi-grid">
    <div class="kpi">
      <div class="kv ${tir>0?'':'malo'}">${tir>0?tir+'%':'—'}</div>
      <div class="kl">TIR</div><div class="kr">Tasa interna de retorno</div>
    </div>
    <div class="kpi">
      <div class="kv ${umbral>0?(ventas[0]>umbral*12?'':'regular'):'malo'}">${umbral>0?E(umbral)+' €':'—'}</div>
      <div class="kl">Umbral de rentabilidad</div><div class="kr">€/mes para cubrir costes fijos</div>
    </div>
    <div class="kpi">
      <div class="kv ${benefNeto[0]>0?'':'malo'}">${ventas[0]>0?pct(benefNeto[0]/ventas[0]*100):'—'}</div>
      <div class="kl">Margen neto año 1</div><div class="kr">Rentabilidad sobre ventas</div>
    </div>
    <div class="kpi">
      <div class="kv">${E(fp)} €</div>
      <div class="kl">Capital propio</div><div class="kr">Fondos propios aportados</div>
    </div>
    <div class="kpi">
      <div class="kv ${fa>0&&fp>0?(fa/fp>2?'malo':fa/fp>1?'regular':''):'malo'}">${fa>0&&fp>0?(fa/fp).toFixed(2):'0,00'}</div>
      <div class="kl">Ratio de endeudamiento</div><div class="kr">Deuda / Fondos propios · óptimo &lt; 1,5</div>
    </div>
    <div class="kpi">
      <div class="kv ${benefNeto[2]>benefNeto[0]?'':'regular'}">${ventas[2]>0?E(ventas[2]):'—'}</div>
      <div class="kl">Ventas año 3</div><div class="kr">Proyección a 3 años</div>
    </div>
  </div>` : ''}
</div>

<!-- ── APARTADO 8 ── -->
<div class="seccion">
  ${secH('8','📣','Plan de marketing y comunicación','RA6b')}
  ${fila2([
    ['Política de producto', ap8.producto, 'RA6b'],
    ['Política de precio', ap8.precio, 'RA6b'],
  ])}
  ${fila2([
    ['Política de distribución (Plaza)', ap8.distribucion, 'RA6b'],
    ['Política de comunicación (Promoción)', ap8.comunicacion, 'RA6b'],
  ])}
  ${ap8.presupuestoMarketing ? `
  <div style="margin-top:8px;padding:8px 12px;background:#edfaf3;border-radius:4px;font-size:12px">
    <strong>Presupuesto de marketing:</strong> ${E(ap8.presupuestoMarketing)} €
  </div>` : ''}
</div>

<!-- PIE -->
<div class="pie">
  <span>${d.nombre||'Plan de empresa'} · Módulo 3160 · IES Cantillana · Grado Superior Administración y Finanzas</span>
  <span>Generado el ${new Date().toLocaleDateString('es-ES')} con SimulApp v24 · Curso ${año}–${año+1}</span>
</div>

<'+'script>
window.onload = function() {
  setTimeout(function() { window.print(); }, 700);
};
<'+'/script>
</body></html>`;

  /* ── Abrir en ventana nueva y lanzar diálogo de impresión ── */
  const w = window.open('', '_blank', 'width=1050,height=800,scrollbars=yes');
  if (!w) {
    mostrarToast('⚠️ El navegador bloqueó la ventana emergente — permite ventanas emergentes para este sitio', 'error');
    return;
  }
  w.document.write(html);
  w.document.close();
  mostrarToast('📄 Plan de empresa generado — elige "Guardar como PDF" en el diálogo de impresión', 'exito');
}



/* ============================================================
   MÓDULO DE GESTIÓN OPERATIVA POR DEPARTAMENTOS
   ============================================================ */

const TAREAS_PREDEFINIDAS = {
  direccion: [
    { titulo:'Elaborar acta de reunión semanal de dirección', ce:'RA6g', dificultad:'basico', desc:'Redacta el acta con los puntos tratados, acuerdos adoptados y responsables de cada acción. Usa el formato de acta profesional.', entregable:'Acta en PDF o Word' },
    { titulo:'Análisis estratégico mensual', ce:'RA6g', dificultad:'intermedio', desc:'Revisa los KPIs de la empresa (facturación, tesorería, pedidos pendientes) y redacta un informe con propuestas de mejora.', entregable:'Informe ejecutivo' },
    { titulo:'Decisión sobre participación en la feria sectorial', ce:'RA6a', dificultad:'avanzado', desc:'Evalúa el coste-beneficio de participar en la feria, prepara un presupuesto y presenta tu recomendación al grupo.', entregable:'Informe de decisión con presupuesto' },
    { titulo:'Planificación de objetivos del próximo trimestre', ce:'RA6g · RA6i', dificultad:'intermedio', desc:'Define 3-5 objetivos SMART para la empresa, con indicadores y plazos. Presenta al grupo para su aprobación.', entregable:'Plan de objetivos' },
  ],
  rrhh: [
    { titulo:'Elaborar nómina mensual de la plantilla', ce:'RA6c', dificultad:'intermedio', desc:'Calcula las nóminas de todos los empleados del mes. Incluye salario base, complementos, deducciones de IRPF y S.S. Procesa en Nominasol.', entregable:'Nóminas en Nominasol + PDF' },
    { titulo:'Tramitar alta de nuevo empleado', ce:'RA6c', dificultad:'intermedio', desc:'Un nuevo empleado se incorpora. Prepara el contrato, comunica el alta a la S.S. (modelo TA.2) y registra en Nominasol.', entregable:'Contrato + Alta S.S.' },
    { titulo:'Gestionar solicitud de vacaciones', ce:'RA6c', dificultad:'basico', desc:'Un empleado solicita 5 días de vacaciones. Verifica el convenio, comprueba las necesidades del servicio y responde con la resolución.', entregable:'Comunicación al empleado' },
    { titulo:'Calcular costes de personal del trimestre', ce:'RA6c · RA6e', dificultad:'avanzado', desc:'Elabora un informe con el coste total de personal: salarios, S.S. empresa, formación. Compara con el presupuesto previsto.', entregable:'Informe de costes de personal' },
  ],
  comercial: [
    { titulo:'Emitir facturas de la semana', ce:'RA6b', dificultad:'basico', desc:'Genera las facturas correspondientes a los pedidos completados esta semana. Numera correlativamente y registra en Factusol.', entregable:'Facturas en Factusol + PDF' },
    { titulo:'Elaborar presupuesto para un cliente', ce:'RA6b', dificultad:'intermedio', desc:'Un cliente potencial solicita presupuesto. Calcula precios, aplica descuentos si procede y envía la oferta comercial.', entregable:'Presupuesto comercial' },
    { titulo:'Gestionar reclamación de un cliente', ce:'RA6b', dificultad:'avanzado', desc:'Un cliente reclama por un pedido incompleto. Investiga qué ocurrió, propón una solución y redacta la respuesta.', entregable:'Respuesta a reclamación' },
    { titulo:'Informe de ventas mensual', ce:'RA6b · RA6e', dificultad:'intermedio', desc:'Recopila los datos de ventas del mes, analiza por producto y cliente, y presenta tendencias al departamento de Dirección.', entregable:'Informe de ventas' },
  ],
  contabilidad: [
    { titulo:'Registrar asientos contables de la semana', ce:'RA6d', dificultad:'basico', desc:'Contabiliza todas las operaciones de la semana: compras, ventas, gastos, cobros y pagos. Registra en Contasol.', entregable:'Libro diario en Contasol' },
    { titulo:'Cuadrar libro de tesorería', ce:'RA6e', dificultad:'intermedio', desc:'Verifica que el saldo bancario coincide con los registros contables. Identifica y corrige descuadres.', entregable:'Conciliación bancaria' },
    { titulo:'Elaborar balance de comprobación mensual', ce:'RA6d', dificultad:'intermedio', desc:'Genera el balance de sumas y saldos del mes. Verifica que cuadra y analiza las cuentas con mayor movimiento.', entregable:'Balance de comprobación' },
    { titulo:'Preparar cierre trimestral', ce:'RA6d · RA6e', dificultad:'avanzado', desc:'Realiza los ajustes de cierre del trimestre: periodificaciones, amortizaciones, provisiones. Genera cuenta de resultados.', entregable:'Estados financieros trimestrales' },
  ],
  fiscal: [
    { titulo:'Liquidar IVA trimestral · Modelo 303', ce:'RA6f', dificultad:'intermedio', desc:'Recopila el IVA soportado y repercutido del trimestre, calcula la diferencia y cumplimenta el modelo 303.', entregable:'Modelo 303 cumplimentado' },
    { titulo:'Preparar retenciones IRPF · Modelo 111', ce:'RA6f', dificultad:'intermedio', desc:'Calcula las retenciones practicadas a trabajadores y profesionales durante el trimestre y cumplimenta el modelo 111.', entregable:'Modelo 111 cumplimentado' },
    { titulo:'Revisar cumplimiento de obligaciones fiscales', ce:'RA6f', dificultad:'basico', desc:'Verifica el calendario fiscal del trimestre: ¿se han presentado todos los modelos en plazo? ¿Hay algún requerimiento pendiente?', entregable:'Check-list fiscal' },
    { titulo:'Estimar pago fraccionado IS · Modelo 202', ce:'RA6f', dificultad:'avanzado', desc:'Si la empresa tiene beneficios, calcula el pago fraccionado del Impuesto sobre Sociedades y cumplimenta el modelo 202.', entregable:'Modelo 202' },
  ],
};

/* ── Generar tareas de la semana ──────────────────────────── */
function generarTareasSemana(semana) {
  const g = EMPRESA_STATE.gestion;
  const esProf = APP.rolActivo !== 'alumno';
  
  Object.keys(TAREAS_PREDEFINIDAS).forEach(dept => {
    const pool = TAREAS_PREDEFINIDAS[dept];
    // Seleccionar 1-2 tareas según la semana (cíclico)
    const idx = (semana - 1) % pool.length;
    const tarea = pool[idx];
    
    // Verificar que no exista ya
    const existe = g.tareas.find(t => t.semana === semana && t.departamento === dept && t.titulo === tarea.titulo);
    if (!existe) {
      g.tareas.push({
        id: 'tarea-' + dept + '-s' + semana + '-' + Date.now(),
        semana: semana,
        departamento: dept,
        titulo: tarea.titulo,
        descripcion: tarea.desc,
        ce: tarea.ce,
        dificultad: tarea.dificultad,
        entregable: tarea.entregable,
        estado: 'pendiente',  // pendiente | en-curso | entregada | evaluada
        entrega: null,        // { texto, archivo:{nombre,tipo,dataUrl}, fecha, hora }
        anotacion: '',
        calificacion: null,
      });
    }
  });
}

function publicarSemana() {
  const s = EMPRESA_STATE.gestion.semanaActual;
  generarTareasSemana(s);
  // Notificar a los alumnos
  const tareasSemana = EMPRESA_STATE.gestion.tareas.filter(t => t.semana === s);
  tareasSemana.forEach(t => notifTareaPublicada(t));
  actualizarBadgeNotif();
  mostrarToast('📋 Tareas de la semana ' + s + ' publicadas', 'exito');
  renderGestion();
}

/* ── Gestión de tareas ────────────────────────────────────── */
function entregarTarea(tareaId) {
  const t = EMPRESA_STATE.gestion.tareas.find(t => t.id === tareaId);
  if (!t) return;
  const textarea = document.getElementById('entrega-texto-' + tareaId);
  const fileInput = document.getElementById('entrega-file-' + tareaId);
  
  if (!textarea || !textarea.value.trim()) {
    mostrarToast('Escribe la respuesta o describe tu entrega', 'error');
    return;
  }
  
  const ahora = new Date();
  t.estado = 'entregada';
  t.entrega = {
    texto: textarea.value.trim(),
    archivo: null,
    fecha: ahora.toLocaleDateString('es-ES'),
    hora: ahora.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'}),
    autor: APP.usuario.displayName || 'Alumno/a',
  };
  
  // Si hay archivo adjunto
  if (fileInput && fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      t.entrega.archivo = { nombre: file.name, tipo: file.type, dataUrl: e.target.result };
      renderGestion();
    };
    reader.readAsDataURL(file);
  }
  
  mostrarToast('✓ Tarea entregada', 'exito');
  renderGestion();
}

function evaluarTarea(tareaId) {
  const t = EMPRESA_STATE.gestion.tareas.find(t => t.id === tareaId);
  if (!t) return;
  const anotEl = document.getElementById('anot-tarea-' + tareaId);
  const notaEl = document.getElementById('nota-tarea-' + tareaId);
  if (anotEl) t.anotacion = anotEl.value.trim();
  if (notaEl) t.calificacion = parseInt(notaEl.value) || null;
  if (t.calificacion) {
    t.estado = 'evaluada';
    notifTareaEvaluada(t);
    actualizarBadgeNotif();
  }
  if(window.rankingNotificar)window.rankingNotificar();
  mostrarToast('🏅 Tarea evaluada: ' + (t.calificacion || '') + '/10', 'exito');
  renderGestion();
}

function crearTareaPersonalizada(dept) {
  const titulo = prompt('Título de la tarea:');
  if (!titulo) return;
  const desc = prompt('Descripción y qué debe entregar el alumno:');
  EMPRESA_STATE.gestion.tareas.push({
    id: 'tarea-custom-' + Date.now(),
    semana: EMPRESA_STATE.gestion.semanaActual,
    departamento: dept,
    titulo: titulo,
    descripcion: desc || '',
    ce: '',
    dificultad: 'personalizada',
    entregable: '',
    estado: 'pendiente',
    entrega: null,
    anotacion: '',
    calificacion: null,
  });
  mostrarToast('✓ Tarea personalizada creada', 'exito');
  renderGestion();
}

/* ── Rotación ─────────────────────────────────────────────── */
function sugerirRotacion() {
  EMPRESA_STATE.gestion.vistaActiva = 'rotacion';
  renderGestion();
}

function confirmarRotacion() {
  const g = EMPRESA_STATE.gestion;
  const asig = g.asignaciones;
  // Rotar: dirección→rrhh→comercial→contabilidad→fiscal→dirección
  const keys = ['direccion','rrhh','comercial','contabilidad','fiscal'];
  const alumnos = keys.map(k => asig[k].alumno);
  // Mover cada alumno al siguiente departamento
  keys.forEach((k, i) => {
    asig[k].alumno = alumnos[(i + keys.length - 1) % keys.length];
    asig[k].trimestre = g.trimestreActual + 1;
  });
  g.trimestreActual++;
  g.rotacionConfirmada = true;
  g.vistaActiva = 'panel';
  renderGestion();
  mostrarToast('🔄 Rotación completada · Trimestre ' + g.trimestreActual, 'exito');
}

function renderGestion() {
  if (APP.moduloActual === 'gestion') {
    document.getElementById('contenido-principal').innerHTML = vistaGestion();
  }
}

/* ============================================================
   VISTA: GESTIÓN OPERATIVA
   ============================================================ */
