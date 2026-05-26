function vistaEmprendimiento() {
  const E = EMPRESA_STATE.emprendimiento;
  const fase = E.fase;
  const sub  = E.subTab;

  const TABS_F1 = [
    {id:'innovacion', l:'💡 Innovación', ra:'RA1a-g'},
    {id:'canvas',     l:'🎨 Canvas',     ra:'RA2a-e'},
    {id:'mercado',    l:'📊 Mercado',    ra:'RA2g-h'},
    {id:'competencia',l:'⚔️ Competencia',ra:'RA2i'},
    {id:'clientes',   l:'👥 Clientes',   ra:'RA2f'},
    {id:'valor',      l:'💎 Valor',      ra:'RA2d-e'},
  ];
  const TABS_F2 = [
    {id:'dafo',       l:'🔍 DAFO',       ra:'RA2h · RA6g'},
    {id:'cuadro',     l:'🎯 Cuadro mando',ra:'RA6g'},
    {id:'decisiones', l:'⚡ Decisiones', ra:'RA6g'},
    {id:'reuniones',  l:'📅 Reuniones',  ra:'RA6g · RA6h'},
    {id:'objetivos',  l:'🏆 Objetivos',  ra:'RA6g'},
  ];

  const tabsActuales = fase === 1 ? TABS_F1 : TABS_F2;
  const pct1 = calcProgreso(E, TABS_F1);
  const pct2 = calcProgreso(E, TABS_F2);

  return `
  <!-- Cabecera -->
  <div class="seccion-header">
    <div>
      <h2>💡 Emprendimiento y Dirección</h2>
      <p>Fase 1: Ideación y análisis (RA1-RA2) · Fase 2: Dirección operativa</p>
    </div>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <button class="btn-ayuda-ctx" data-ayuda="emprendimiento" onclick="toggleAyuda('emprendimiento')" title="Conceptos y ayuda">❓ Ayuda</button>
    </div>
  </div>

  <!-- Selector de fase -->le="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:1rem">
    ${[1,2].map(f => {
      const activo = fase === f;
      const pct = f===1 ? pct1 : pct2;
      const tit = f===1 ? '📋 Fase 1 — Ideación y análisis' : '🏢 Fase 2 — Dirección operativa';
      const sub2 = f===1 ? 'RA1 · RA2 · Plan de empresa' : 'Cuadro de mando · Decisiones · Actas';
      return `
      <div style="padding:14px 16px;border-radius:var(--radio-lg);cursor:pointer;transition:all var(--transicion);
        border:2px solid ${activo?'var(--verde-500)':'var(--gris-200)'};
        background:${activo?'var(--verde-50)':'var(--blanco)'}"
        onclick="EMPRESA_STATE.emprendimiento.fase=${f};EMPRESA_STATE.emprendimiento.subTab='${f===1?'innovacion':'dafo'}';vistaEmprendimientoRefresh()">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:.875rem;font-weight:700;color:${activo?'var(--verde-800)':'var(--gris-800)'}">${tit}</span>
          <span style="font-size:.78rem;font-weight:700;color:${activo?'var(--verde-600)':'var(--gris-400)'}">${pct}%</span>
        </div>
        <div style="font-size:.75rem;color:var(--gris-500);margin-bottom:6px">${sub2}</div>
        <div style="background:var(--gris-200);border-radius:3px;height:4px">
          <div style="height:100%;background:${activo?'var(--verde-500)':'var(--gris-400)'};border-radius:3px;width:${pct}%;transition:width .4s"></div>
        </div>
      </div>`;
    }).join('')}
  </div>

  <!-- Tabs de la fase activa -->
  <div style="display:flex;gap:4px;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:4px;margin-bottom:1.25rem;overflow-x:auto">
    ${tabsActuales.map(t => `
      <button class="emp-tab ${sub===t.id?'activo':''}"
        onclick="EMPRESA_STATE.emprendimiento.subTab='${t.id}';vistaEmprendimientoRefresh()">
        ${t.l} <span class="ra-chip" style="margin-left:4px">${t.ra}</span>
      </button>`).join('')}
  </div>

  <!-- Contenido de la sub-sección activa -->
  ${empSubVista(sub, E)}`;
}

function calcProgreso(E, tabs) {
  const filled = tabs.filter(t => {
    const d = E[t.id];
    if (!d) return false;
    if (Array.isArray(d)) return d.length > 0;
    return Object.values(d).some(v => v && String(v).trim().length > 5);
  }).length;
  return Math.round((filled / tabs.length) * 100);
}

function vistaEmprendimientoRefresh() {
  if (APP.moduloActual === 'emprendimiento') {
    document.getElementById('contenido-principal').innerHTML = vistaEmprendimiento();
  }
}

function saveEmp(campo, subcampo, valor) {
  if (subcampo) {
    EMPRESA_STATE.emprendimiento[campo][subcampo] = valor;
  } else {
    EMPRESA_STATE.emprendimiento[campo] = valor;
  }
}

function empSubVista(sub, E) {
  const ayuda = (txt) => `<div style="padding:9px 12px;background:#fef9ec;border:1px solid #fde68a;border-radius:var(--radio-md);margin-bottom:12px;font-size:.8rem;color:var(--am);line-height:1.5">✏️ ${txt}</div>`;
  const campo = (lbl, key, subcampo, placeholder, hint='') => `
    <div class="ficha-campo">
      <label>${lbl}</label>
      <textarea class="ficha-input" style="min-height:80px;resize:vertical;font-size:.84rem;line-height:1.6"
        placeholder="${placeholder}"
        oninput="saveEmp('${key}','${subcampo}',this.value)">${E[key]?.[subcampo]||''}</textarea>
      ${hint?`<div style="font-size:.7rem;color:var(--gris-400);margin-top:2px">${hint}</div>`:''}
    </div>`;

  const vistas = {

    /* ── INNOVACIÓN ─────────────────────────────────────────── */
    innovacion: () => `
      <div class="ficha-card">
        <div class="ficha-card-header"><span>💡</span> Innovación empresarial <span class="ra-chip" style="margin-left:auto">RA1a-g</span></div>
        ${ayuda('Reflexiona sobre los factores de innovación de tu empresa. No existe una respuesta incorrecta — lo importante es que justifiques tu razonamiento con argumentos concretos aplicados a tu sector.')}
        ${campo('¿Qué tipo de innovación aplica tu empresa? (técnica, de proceso, de organización, de modelo de negocio...)', 'innovacion', 'tipoInnovacion',
          'Ej: Nuestra innovación es de proceso — combinamos producción artesanal con distribución digital directa al consumidor, eliminando intermediarios tradicionales del sector cítrico...',
          'RA1a · Examina las facetas de la innovación relacionándola con el desarrollo económico')}
        ${campo('¿Qué riesgos empresariales asumís y por qué merece la pena asumirlos?', 'innovacion', 'riesgoAsumido',
          'Ej: El principal riesgo es la estacionalidad de la producción. Lo asumimos porque la demanda de cítricos de proximidad está creciendo un 15% anual según los datos del MAPA...',
          'RA1c · Valora los aspectos de asunción de riesgo como motor económico')}
        ${campo('¿Qué características emprendedoras identifícas en los fundadores de la empresa?', 'innovacion', 'perfilEmprendedor',
          'Ej: Los socios combinan experiencia técnica agrícola (Carlos, 8 años en el sector) con visión comercial (Ana, formación en Marketing). Compartimos tolerancia al riesgo calculado y orientación al cliente...',
          'RA1d · Determina las diferentes facetas del carácter emprendedor')}
        ${campo('¿Podría internacionalizarse vuestra empresa? ¿Cómo y a qué mercados?', 'innovacion', 'internacionalizacion',
          'Ej: Sí. En una segunda fase plantearíamos exportación a Alemania y Francia, mercados con alta demanda de cítricos ecológicos y precio premium. La estrategia sería a través de distribuidores locales especializados en productos ibéricos...',
          'RA1f · Propón posibilidades de internacionalización como factor de innovación')}
        ${campo('¿Qué ayudas públicas o privadas podríais solicitar para vuestro proyecto?', 'innovacion', 'ayudas',
          'Ej: Hemos identificado tres líneas de financiación: préstamos ICO Empresas y Emprendedores (hasta 12,5M€ al 3,5%), subvenciones de la Junta de Andalucía para jóvenes agricultores (Orden AGR/...) y la convocatoria de aceleración de Andalucía Emprende...',
          'RA1g · Define ayudas y herramientas para la innovación estructuradas en informe')}
      </div>`,

    /* ── CANVAS ─────────────────────────────────────────────── */
    canvas: () => {
      const cv = E.canvas;
      const bloque = (num, titulo, key, placeholder, color) => `
        <div style="border:1.5px solid ${color};border-radius:var(--radio-md);overflow:hidden">
          <div style="background:${color};padding:7px 10px">
            <div style="font-size:.68rem;font-weight:700;color:rgba(0,0,0,.5);text-transform:uppercase;letter-spacing:.04em">${num}</div>
            <div style="font-size:.82rem;font-weight:700;color:var(--gris-900)">${titulo}</div>
          </div>
          <textarea class="ficha-input" style="border:none;border-radius:0;min-height:90px;resize:vertical;font-size:.8rem;line-height:1.5"
            placeholder="${placeholder}"
            oninput="saveEmp('canvas','${key}',this.value)">${cv[key]||''}</textarea>
        </div>`;
      return `
      <div class="ficha-card">
        <div class="ficha-card-header"><span>🎨</span> Lienzo de modelo de negocio (Business Model Canvas) <span class="ra-chip" style="margin-left:auto">RA2a-e</span></div>
        ${ayuda('El Canvas es la herramienta más usada en el mundo para diseñar modelos de negocio. Rellena los 9 bloques aplicados a vuestra empresa. Cada bloque debe tener respuestas concretas, no genéricas.')}
        <!-- Fila superior -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:8px;margin-bottom:8px">
          ${bloque('4','Socios clave','sociosClave','Proveedores estratégicos, aliados, colaboradores sin los que no podríais operar...','#dbeafe')}
          <div style="display:flex;flex-direction:column;gap:8px">
            ${bloque('5','Actividades clave','actividadesClaves','Qué hacéis cada día para que el modelo funcione...','#dcfce7')}
            ${bloque('6','Recursos clave','recursosClaves','Qué activos necesitáis: físicos, humanos, financieros, intelectuales...','#dcfce7')}
          </div>
          ${bloque('1','Propuesta de valor','propuestaValor','Qué problema resolvéis, qué necesidad satisfacéis, por qué os elegiría un cliente...','#fef9ec')}
          <div style="display:flex;flex-direction:column;gap:8px">
            ${bloque('3','Relaciones con clientes','relacionesClientes','Cómo captáis, fidelizáis y mantenéis a los clientes...','#ede9fe')}
            ${bloque('2','Canales','canales','Cómo llegáis al cliente: tienda propia, distribuidores, online, ferias...','#ede9fe')}
          </div>
          ${bloque('8','Segmentos de clientes','segmentosClientes','A quién os dirigís: grupos de personas u organizaciones que la empresa atiende...','#fce7f3')}
        </div>
        <!-- Fila inferior -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${bloque('7','Estructura de costes','estructuraCostes','Cuáles son los costes más importantes: fijos (alquiler, sueldos), variables (aprovisionamiento)...','#fee2e2')}
          ${bloque('9','Fuentes de ingresos','fuentesIngresos','Cómo ganáis dinero: venta de productos, servicios, suscripción, comisión...','#d1fae5')}
        </div>
      </div>`;
    },

    /* ── MERCADO ─────────────────────────────────────────────── */
    mercado: () => `
      <div class="ficha-card">
        <div class="ficha-card-header"><span>📊</span> Análisis de mercado <span class="ra-chip" style="margin-left:auto">RA2g-h</span></div>
        ${ayuda('El análisis de mercado te permite saber si existe hueco para tu empresa antes de invertir. Sé específico con datos reales del sector — busca estadísticas del INE, MAPA, cámaras de comercio o informes sectoriales.')}
        ${campo('Descripción del mercado objetivo', 'mercado', 'descripcion',
          'Ej: El mercado de distribución de cítricos ecológicos de proximidad en Andalucía. Se dirige a consumidores urbanos de 25-55 años con conciencia ambiental y a establecimientos de hostelería premium...')}
        ${campo('Tamaño estimado del mercado y tendencias', 'mercado', 'tamañoEstimado',
          'Ej: El mercado español de productos ecológicos facturó 2.800M€ en 2024 (MAPA), creciendo un 12% anual. El segmento de cítricos representa el 8%. Tendencias: auge del km0, comercio electrónico de frescos (+34%), canal HORECA premium...')}
        ${campo('Nicho de mercado identificado', 'mercado', 'nichoIdentificado',
          'Ej: Nicho: cítricos Vega Alta del Guadalquivir con certificación de origen, venta directa sin intermediarios con entrega en 24h. Actualmente ningún distribuidor de la zona ofrece este servicio con estas condiciones...',
          'RA2h · ¿Existe un hueco en el mercado? Argumenta con datos')}
        ${campo('Segmentos de clientes identificados', 'mercado', 'segmentos',
          'Ej: 3 segmentos: (1) Particulares — familias que compran caja mensual por suscripción; (2) HORECA — restaurantes y hoteles que necesitan producto fresco certificado; (3) B2B — distribuidores regionales que buscan producto diferenciado...')}
      </div>`,

    /* ── COMPETENCIA ──────────────────────────────────────────── */
    competencia: () => {
      const comp = E.competencia || [];
      return `
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>⚔️</span> Análisis de la competencia
          <span class="ra-chip" style="margin-left:auto">RA2i</span>
          <button class="btn-accion" style="margin-left:12px;padding:5px 12px;font-size:.78rem"
            onclick="EMPRESA_STATE.emprendimiento.competencia.push({nombre:'',fortalezas:'',debilidades:'',precioRelativo:'medio',cuota:''});vistaEmprendimientoRefresh()">
            + Añadir competidor
          </button>
        </div>
        ${ayuda('Analiza al menos 3 competidores reales de tu sector. Sé honesto: identificar sus fortalezas no es malo — te ayuda a diferenciarte. Busca sus precios, su posicionamiento y sus puntos débiles que tú puedas aprovechar.')}
        ${comp.length === 0 ? `
        <div style="text-align:center;padding:2rem;background:var(--gris-50);border-radius:var(--radio-md);color:var(--gris-400)">
          <div style="font-size:2rem;margin-bottom:8px">⚔️</div>
          <p>Añade al menos 3 competidores de tu sector para un análisis completo.</p>
        </div>` : comp.map((c, i) => `
        <div style="border:1.5px solid var(--gris-200);border-radius:var(--radio-md);padding:14px;margin-bottom:10px;background:var(--gris-50)">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--verde-800);color:white;font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center">${i+1}</div>
            <input class="ficha-input" style="flex:1;font-size:.875rem;font-weight:600" placeholder="Nombre del competidor"
              value="${c.nombre}" oninput="EMPRESA_STATE.emprendimiento.competencia[${i}].nombre=this.value">
            <select class="ficha-input" style="width:130px" onchange="EMPRESA_STATE.emprendimiento.competencia[${i}].precioRelativo=this.value">
              <option value="bajo" ${c.precioRelativo==='bajo'?'selected':''}>💰 Precio bajo</option>
              <option value="medio" ${c.precioRelativo==='medio'?'selected':''}>💰💰 Precio medio</option>
              <option value="alto" ${c.precioRelativo==='alto'?'selected':''}>💰💰💰 Precio alto</option>
            </select>
            <button class="btn-secundario" style="padding:4px 8px;font-size:.72rem;color:var(--rojo)"
              onclick="EMPRESA_STATE.emprendimiento.competencia.splice(${i},1);vistaEmprendimientoRefresh()">✕</button>
          </div>
          <div class="ficha-grid-2" style="gap:8px">
            <div class="ficha-campo">
              <label style="color:var(--verde-700)">✓ Fortalezas</label>
              <textarea class="ficha-input" style="min-height:70px;resize:vertical;font-size:.8rem;border-color:var(--verde-300)"
                placeholder="¿Qué hacen bien? ¿Por qué los elige el cliente?"
                oninput="EMPRESA_STATE.emprendimiento.competencia[${i}].fortalezas=this.value">${c.fortalezas||''}</textarea>
            </div>
            <div class="ficha-campo">
              <label style="color:var(--rojo)">✗ Debilidades</label>
              <textarea class="ficha-input" style="min-height:70px;resize:vertical;font-size:.8rem;border-color:#fca5a5"
                placeholder="¿Qué les falta? ¿Qué quejas tienen sus clientes?"
                oninput="EMPRESA_STATE.emprendimiento.competencia[${i}].debilidades=this.value">${c.debilidades||''}</textarea>
            </div>
          </div>
        </div>`).join('')}
      </div>`;
    },

    /* ── CLIENTES ─────────────────────────────────────────────── */
    clientes: () => `
      <div class="ficha-card">
        <div class="ficha-card-header"><span>👥</span> Clientes potenciales — Buyer Persona <span class="ra-chip" style="margin-left:auto">RA2f</span></div>
        ${ayuda('Define tu cliente ideal con el máximo detalle posible. Un buyer persona no es "cualquier persona que compre" — es una persona concreta con nombre, situación, motivaciones y hábitos. Cuanto más específico, más útil.')}
        ${campo('Perfil del cliente tipo (edad, situación, ingresos, estilo de vida...)', 'clientesPotenciales', 'perfil',
          'Ej: María, 38 años, profesora en Sevilla, familia con 2 hijos, ingresos medios-altos (2.800€/mes), preocupada por la alimentación sana. Compra habitualmente en Mercadona pero busca opciones de producto local para frutas y verduras...')}
        ${campo('¿Qué necesidad tiene que vuestra empresa puede satisfacer?', 'clientesPotenciales', 'necesidades',
          'Ej: Necesita acceso cómodo a cítricos frescos de calidad superior a los del supermercado, con garantía de origen local, sin tener que desplazarse al mercado. Le preocupa el desperdicio alimentario y valora las cantidades ajustadas...')}
        ${campo('¿Cómo toma la decisión de compra? ¿Qué le influye?', 'clientesPotenciales', 'comportamiento',
          'Ej: Busca referencias en Instagram y Google antes de probar algo nuevo. Le influyen mucho las recomendaciones de amigas. Compra online habitualmente (Amazon, Zara). Decide en 2-3 días si el precio es razonable y las reseñas son positivas...')}
        ${campo('¿Dónde encontrar a estos clientes? ¿Cómo llegar hasta ellos?', 'clientesPotenciales', 'comoLlegarles',
          'Ej: Instagram con contenido de recetas usando nuestros productos (target: mujeres 30-45 Sevilla), colaboración con dietistas y nutricionistas, presencia en mercados de productores los fines de semana, y alianzas con grupos de consumo ecológico locales...')}
      </div>`,

    /* ── PROPUESTA DE VALOR ───────────────────────────────────── */
    valor: () => `
      <div class="ficha-card">
        <div class="ficha-card-header"><span>💎</span> Propuesta de valor <span class="ra-chip" style="margin-left:auto">RA2d-e</span></div>
        ${ayuda('La propuesta de valor es el núcleo de tu modelo de negocio: la razón por la que un cliente te elegiría a ti y no a otro. Debe ser clara, concisa y diferenciadora. Si no puedes explicarla en 2 frases, no está lo suficientemente definida.')}
        ${campo('¿Qué problema o dolor resuelve vuestra empresa?', 'propuestaValor', 'problemaResuelve',
          'Ej: El consumidor que quiere cítricos frescos de calidad tiene que elegir entre la comodidad del supermercado (calidad mediocre, origen desconocido) o desplazarse al campo o mercados (incómodo, irregular). No existe un canal cómodo + calidad + origen garantizado...',
          'RA2d · Determina el producto o servicio que quiere proporcionar la idea de negocio')}
        ${campo('¿Qué necesidad satisface y qué valor añadido aporta?', 'propuestaValor', 'necesidadSatisface',
          'Ej: Satisfacemos la necesidad de alimentación sana y de proximidad con comodidad. El valor añadido es triple: (1) trazabilidad completa del árbol a casa en 24h, (2) calibres y variedades no disponibles en supermercado, (3) precio similar al supermercado sin intermediarios...',
          'RA2e · Concreta las necesidades que satisface y el valor añadido')}
        ${campo('¿En qué sois diferentes o mejores que la competencia?', 'propuestaValor', 'ventajaCompetitiva',
          'Ej: Nuestra ventaja competitiva es la integración vertical: somos productores y distribuidores. Esto nos permite ofrecer precio competitivo con calidad superior. Ningún competidor directo en Sevilla ofrece suscripción mensual con variedad de temporada y entrega en 24h...')}
        ${campo('Redacta tu propuesta de valor en 2-3 frases para el cliente', 'propuestaValor', 'diferenciacion',
          'Ej: "Los mejores cítricos de la Vega Alta del Guadalquivir, recogidos hoy y en tu cocina mañana. Sin intermediarios, sin conservantes, con el sabor que recuerdas. Suscríbete y recibe tu caja cada mes con lo mejor de la temporada."',
          'Este texto podría ir en vuestra web o catálogo comercial')}
      </div>`,

    /* ── DAFO (Fase 2) ────────────────────────────────────────── */
    dafo: () => {
      const d = E.dafo;
      return `
      <div class="ficha-card">
        <div class="ficha-card-header"><span>🔍</span> Análisis DAFO <span class="ra-chip" style="margin-left:auto">RA2h · RA6g</span></div>
        ${ayuda('El DAFO conecta tu análisis de mercado (Fase 1) con la gestión operativa (Fase 2). Las Fortalezas y Debilidades son internas (dependen de vosotros). Las Oportunidades y Amenazas son externas (del mercado, la competencia, el entorno).')}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[
            ['💪 Fortalezas','fortalezas','var(--verde-50)','var(--verde-300)','Qué hacéis mejor que la competencia, recursos únicos, ventajas competitivas...'],
            ['⚠️ Debilidades','debilidades','#fef9ec','#fde68a','Qué podríais mejorar, qué recursos os faltan, dónde sois vulnerables...'],
            ['🚀 Oportunidades','oportunidades','#dbeafe','#93c5fd','Tendencias del mercado que os favorecen, nichos sin cubrir, cambios legales positivos...'],
            ['⛈️ Amenazas','amenazas','#fee2e2','#fca5a5','Factores externos que os pueden perjudicar: competidores, regulación, crisis...'],
          ].map(([tit,key,bg,bord,hint]) => `
          <div style="background:${bg};border:1.5px solid ${bord};border-radius:var(--radio-md);padding:12px">
            <div style="font-size:.875rem;font-weight:700;color:var(--gris-800);margin-bottom:4px">${tit}</div>
            <div style="font-size:.72rem;color:var(--gris-500);margin-bottom:6px">${hint}</div>
            <textarea class="ficha-input" style="min-height:100px;resize:vertical;font-size:.82rem;background:rgba(255,255,255,.7)"
              placeholder="Escribe aquí..."
              oninput="saveEmp('dafo','${key}',this.value)">${d[key]||''}</textarea>
          </div>`).join('')}
        </div>
        <button class="btn-accion" style="margin-top:12px" onclick="toast('✓ DAFO guardado','exito')">💾 Guardar DAFO</button>
      </div>`;
    },

    /* ── CUADRO DE MANDO (Fase 2) ─────────────────────────────── */
    cuadro: () => {
      const kpis = E.kpis;
      return `
      <div class="ficha-card">
        <div class="ficha-card-header"><span>🎯</span> Cuadro de mando <span class="ra-chip" style="margin-left:auto">RA6g</span></div>
        ${ayuda('Actualiza los indicadores con los datos reales de tu empresa. Obtén la facturación del módulo Comercial, los costes del módulo Contabilidad. El cuadro de mando es la herramienta con la que el director/a toma decisiones basadas en datos.')}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
          ${Object.entries(kpis).map(([key, k]) => {
            const pct = k.objetivo > 0 ? Math.min(100, Math.round((k.valor/k.objetivo)*100)) : 0;
            const ok  = k.valor >= k.objetivo;
            const color = ok ? 'var(--verde-600)' : pct > 60 ? 'var(--am)' : 'var(--rojo)';
            const nombres = {facturacion:'Facturación mensual (€)',clientes:'Clientes activos',costes:'Costes mensuales (€)',margen:'Margen comercial (%)'};
            return `
            <div class="ficha-card" style="border-color:${color}">
              <div style="font-size:.72rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;margin-bottom:6px">${nombres[key]||key}</div>
              <input type="number" class="ficha-input" style="font-size:1.2rem;font-weight:800;color:${color};padding:6px 8px;margin-bottom:6px"
                value="${k.valor}" min="0"
                oninput="EMPRESA_STATE.emprendimiento.kpis['${key}'].valor=parseFloat(this.value)||0;vistaEmprendimientoRefresh()">
              <div style="font-size:.72rem;color:var(--gris-400);margin-bottom:4px">Objetivo: ${k.objetivo}${key==='margen'?'%':'€'}</div>
              <div style="background:var(--gris-200);border-radius:3px;height:6px">
                <div style="height:100%;background:${color};border-radius:3px;width:${pct}%"></div>
              </div>
              <div style="font-size:.68rem;color:${color};margin-top:3px;font-weight:600">${ok?'✓ Objetivo alcanzado':''+pct+'% del objetivo'}</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    },

    /* ── DECISIONES (Fase 2) ──────────────────────────────────── */
    decisiones: () => {
      const decs = E.decisiones || [];
      return `
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>⚡</span> Decisiones estratégicas
          <span class="ra-chip" style="margin-left:auto">RA6g</span>
          <button class="btn-accion" style="margin-left:8px;padding:5px 12px;font-size:.78rem"
            onclick="EMPRESA_STATE.emprendimiento.decisiones.push({titulo:'',descripcion:'',urgencia:2,pros:'',contras:'',decision:'',justificacion:'',estado:'pendiente'});vistaEmprendimientoRefresh()">
            + Nueva
          </button>
        </div>
        ${ayuda('Documenta las decisiones importantes que toma la dirección de la empresa. Analiza siempre las alternativas con sus pros y contras antes de decidir.')}
        ${decs.length === 0 ? `<div style="text-align:center;padding:2rem;color:var(--gris-400)"><div style="font-size:2rem;margin-bottom:8px">⚡</div><p>Sin decisiones registradas. Añade las decisiones estratégicas que tome tu empresa.</p></div>` :
        decs.map((d, i) => `
        <div style="border:1.5px solid ${d.urgencia===3?'#fca5a5':d.urgencia===2?'#fde68a':'var(--gris-200)'};border-radius:var(--radio-md);padding:14px;margin-bottom:10px">
          <div class="ficha-grid-2" style="gap:8px;margin-bottom:8px">
            <div class="ficha-campo">
              <label>Decisión a tomar</label>
              <input class="ficha-input" value="${d.titulo}" placeholder="Ej: ¿Participamos en la feria sectorial?"
                oninput="EMPRESA_STATE.emprendimiento.decisiones[${i}].titulo=this.value">
            </div>
            <div class="ficha-campo">
              <label>Urgencia</label>
              <select class="ficha-input" onchange="EMPRESA_STATE.emprendimiento.decisiones[${i}].urgencia=parseInt(this.value);vistaEmprendimientoRefresh()">
                <option value="1" ${d.urgencia===1?'selected':''}>🟢 Baja</option>
                <option value="2" ${d.urgencia===2?'selected':''}>🟡 Media</option>
                <option value="3" ${d.urgencia===3?'selected':''}>🔴 Alta</option>
              </select>
            </div>
          </div>
          <div class="ficha-grid-2" style="gap:8px;margin-bottom:8px">
            <div class="ficha-campo">
              <label style="color:var(--verde-700)">✓ Pros / Ventajas</label>
              <textarea class="ficha-input" style="min-height:60px;border-color:var(--verde-300)"
                placeholder="Ventajas de hacerlo..." oninput="EMPRESA_STATE.emprendimiento.decisiones[${i}].pros=this.value">${d.pros||''}</textarea>
            </div>
            <div class="ficha-campo">
              <label style="color:var(--rojo)">✗ Contras / Riesgos</label>
              <textarea class="ficha-input" style="min-height:60px;border-color:#fca5a5"
                placeholder="Inconvenientes..." oninput="EMPRESA_STATE.emprendimiento.decisiones[${i}].contras=this.value">${d.contras||''}</textarea>
            </div>
          </div>
          <div class="ficha-campo">
            <label>Decisión adoptada y justificación</label>
            <textarea class="ficha-input" style="min-height:60px"
              placeholder="¿Qué habéis decidido y por qué?"
              oninput="EMPRESA_STATE.emprendimiento.decisiones[${i}].decision=this.value">${d.decision||''}</textarea>
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button class="btn-secundario" style="font-size:.72rem;padding:4px 8px;color:var(--rojo)"
              onclick="EMPRESA_STATE.emprendimiento.decisiones.splice(${i},1);vistaEmprendimientoRefresh()">🗑️ Eliminar</button>
          </div>
        </div>`).join('')}
      </div>`;
    },

    /* ── REUNIONES Y ACTAS (Fase 2) ───────────────────────────── */
    reuniones: () => {
      const reuniones = E.reuniones || [];
      return `
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>📅</span> Reuniones y actas
          <span class="ra-chip" style="margin-left:auto">RA6g · RA6h</span>
          <button class="btn-accion" style="margin-left:8px;padding:5px 12px;font-size:.78rem"
            onclick="EMPRESA_STATE.emprendimiento.reuniones.push({tipo:'',fecha:new Date().toISOString().slice(0,10),hora:'10:00',asistentes:'',orden:'',acta:'',acuerdos:[],firmada:false});vistaEmprendimientoRefresh()">
            + Convocar
          </button>
        </div>
        ${ayuda('Convoca reuniones, define el orden del día y redacta el acta con los acuerdos adoptados. El acta es un documento con valor legal: debe recoger quién asistió, qué se trató y qué se decidió.')}
        ${reuniones.length === 0 ? `<div style="text-align:center;padding:2rem;color:var(--gris-400)"><div style="font-size:2rem;margin-bottom:8px">📅</div><p>Sin reuniones convocadas.</p></div>` :
        reuniones.map((r, i) => `
        <div style="border:1.5px solid ${r.firmada?'var(--verde-300)':'var(--gris-200)'};border-radius:var(--radio-md);padding:14px;margin-bottom:10px;background:${r.firmada?'var(--verde-50)':'var(--blanco)'}">
          <div class="ficha-grid-2" style="gap:8px;margin-bottom:8px">
            <div class="ficha-campo">
              <label>Tipo de reunión</label>
              <select class="ficha-input" onchange="EMPRESA_STATE.emprendimiento.reuniones[${i}].tipo=this.value">
                <option value="">— Selecciona —</option>
                ${['Reunión ordinaria de socios','Junta General Ordinaria','Reunión de dirección','Reunión con cliente','Reunión con proveedor','Reunión de departamento'].map(t=>`<option value="${t}" ${r.tipo===t?'selected':''}>${t}</option>`).join('')}
              </select>
            </div>
            <div class="ficha-grid-2" style="gap:6px">
              <div class="ficha-campo">
                <label>Fecha</label>
                <input type="date" class="ficha-input" value="${r.fecha}" oninput="EMPRESA_STATE.emprendimiento.reuniones[${i}].fecha=this.value">
              </div>
              <div class="ficha-campo">
                <label>Hora</label>
                <input type="time" class="ficha-input" value="${r.hora}" oninput="EMPRESA_STATE.emprendimiento.reuniones[${i}].hora=this.value">
              </div>
            </div>
          </div>
          <div class="ficha-campo">
            <label>Asistentes</label>
            <input class="ficha-input" value="${r.asistentes}" placeholder="Nombre y cargo de cada asistente separados por coma"
              oninput="EMPRESA_STATE.emprendimiento.reuniones[${i}].asistentes=this.value">
          </div>
          <div class="ficha-campo">
            <label>Orden del día</label>
            <textarea class="ficha-input" style="min-height:70px;resize:vertical;font-size:.82rem" placeholder="1. Aprobación acta anterior&#10;2. ..." oninput="EMPRESA_STATE.emprendimiento.reuniones[${i}].orden=this.value">${r.orden||''}</textarea>
          </div>
          <div class="ficha-campo">
            <label>Acta de la reunión <span style="font-size:.7rem;color:var(--gris-400)">(redactar tras la reunión)</span></label>
            <textarea class="ficha-input" style="min-height:120px;resize:vertical;font-size:.82rem;line-height:1.6"
              placeholder="En Cantillana, siendo las ${r.hora} del día ${r.fecha}, reunidos los abajo firmantes...&#10;&#10;Desarrollo de los puntos del orden del día:&#10;1. ..."
              oninput="EMPRESA_STATE.emprendimiento.reuniones[${i}].acta=this.value">${r.acta||''}</textarea>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <button class="btn-accion" style="padding:6px 14px;font-size:.8rem"
              onclick="if(EMPRESA_STATE.emprendimiento.reuniones[${i}].acta.trim().length>20){EMPRESA_STATE.emprendimiento.reuniones[${i}].firmada=true;vistaEmprendimientoRefresh();mostrarToast('✓ Acta firmada','exito')}else{mostrarToast('Redacta el acta antes de firmarla','error')}">
              ${r.firmada?'✓ Acta firmada':'✍️ Firmar acta'}
            </button>
            <button class="btn-secundario" style="font-size:.72rem;padding:4px 8px;color:var(--rojo)"
              onclick="EMPRESA_STATE.emprendimiento.reuniones.splice(${i},1);vistaEmprendimientoRefresh()">🗑️</button>
            ${r.firmada?`<span class="ra-chip" style="background:var(--verde-100);color:var(--verde-800)">✓ Firmada</span>`:''}
          </div>
        </div>`).join('')}
      </div>`;
    },

    /* ── OBJETIVOS SMART (Fase 2) ─────────────────────────────── */
    objetivos: () => {
      const objs = E.objetivos || [];
      const SMART_KEYS = [
        ['especifico','S — Específico','¿Qué exactamente quieres conseguir?'],
        ['medible','M — Medible','¿Cómo sabrás si lo has conseguido? ¿Qué indicador usarás?'],
        ['alcanzable','A — Alcanzable','¿Es realista con los recursos que tienes?'],
        ['relevante','R — Relevante','¿Por qué es importante para la empresa ahora?'],
        ['temporal','T — Temporal','¿Cuál es la fecha límite?'],
      ];
      return `
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>🏆</span> Objetivos SMART
          <span class="ra-chip" style="margin-left:auto">RA6g</span>
          <button class="btn-accion" style="margin-left:8px;padding:5px 12px;font-size:.78rem"
            onclick="EMPRESA_STATE.emprendimiento.objetivos.push({nombre:'',especifico:'',medible:'',alcanzable:'',relevante:'',temporal:'',progreso:0,estado:'en-curso'});vistaEmprendimientoRefresh()">
            + Nuevo objetivo
          </button>
        </div>
        ${ayuda('Un objetivo SMART es Específico, Medible, Alcanzable, Relevante y Temporal. Los objetivos vagos no se consiguen — sé concreto en cada dimensión.')}
        ${objs.length === 0 ? `<div style="text-align:center;padding:2rem;color:var(--gris-400)"><div style="font-size:2rem;margin-bottom:8px">🏆</div><p>Define los objetivos estratégicos del trimestre.</p></div>` :
        objs.map((o, i) => `
        <div style="border:1.5px solid var(--gris-200);border-radius:var(--radio-md);padding:14px;margin-bottom:10px">
          <div class="ficha-campo" style="margin-bottom:8px">
            <label>Nombre del objetivo</label>
            <input class="ficha-input" style="font-size:.9rem;font-weight:600" value="${o.nombre}" placeholder="Ej: Alcanzar 15 clientes activos antes del 31 de enero"
              oninput="EMPRESA_STATE.emprendimiento.objetivos[${i}].nombre=this.value">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
            ${SMART_KEYS.map(([key,tit,hint]) => `
            <div class="ficha-campo">
              <label style="color:var(--verde-700)">${tit}</label>
              <textarea class="ficha-input" style="min-height:55px;resize:vertical;font-size:.8rem"
                placeholder="${hint}"
                oninput="EMPRESA_STATE.emprendimiento.objetivos[${i}].${key}=this.value">${o[key]||''}</textarea>
            </div>`).join('')}
          </div>
          <div style="display:flex;align-items:center;gap:12px;margin-top:4px">
            <span style="font-size:.78rem;color:var(--gris-600)">Progreso:</span>
            <input type="range" min="0" max="100" step="5" value="${o.progreso||0}" style="flex:1"
              oninput="EMPRESA_STATE.emprendimiento.objetivos[${i}].progreso=parseInt(this.value);document.getElementById('prog-${i}').textContent=this.value+'%'">
            <span id="prog-${i}" style="font-size:.82rem;font-weight:700;color:var(--verde-700);min-width:36px">${o.progreso||0}%</span>
            <select class="ficha-input" style="width:120px" onchange="EMPRESA_STATE.emprendimiento.objetivos[${i}].estado=this.value">
              <option value="en-curso" ${o.estado==='en-curso'?'selected':''}>En curso</option>
              <option value="conseguido" ${o.estado==='conseguido'?'selected':''}>✓ Conseguido</option>
              <option value="abandonado" ${o.estado==='abandonado'?'selected':''}>Abandonado</option>
            </select>
            <button class="btn-secundario" style="font-size:.72rem;padding:4px 8px;color:var(--rojo)"
              onclick="EMPRESA_STATE.emprendimiento.objetivos.splice(${i},1);vistaEmprendimientoRefresh()">🗑️</button>
          </div>
        </div>`).join('')}
      </div>`;
    },
  };

  return (vistas[sub] || vistas['innovacion'])();
}



/* ============================================================
   PLAN DE EMPRESA — 8 APARTADOS GUIADOS
   ============================================================ */

function renderPlanEmpresa() {
  const el = document.getElementById('contenido-principal');
  if (el) el.innerHTML = vistaPlanEmpresa();
}

function planTab(ap) {
  EMPRESA_STATE.planEmpresa.apartado = ap;
  renderPlanEmpresa();
}

function calcProgresoPlan() {
  const pe = EMPRESA_STATE.planEmpresa;
  const checks = {
    '1': () => pe.ap1.resumenEjecutivo?.length > 30 && pe.ap1.mision?.length > 10,
    '2': () => pe.ap2.motivacion?.length > 20 && (pe.ap2.promotores?.length > 0),
    '3': () => pe.ap3.descripcionActividad?.length > 30 && pe.ap3.propuestaValor?.length > 20,
    '4': () => pe.ap4.dafoF?.length > 10 && pe.ap4.mercadoObjetivo?.length > 20,
    '5': () => pe.ap5.formaJuridica?.length > 2 && pe.ap5.justificacionForma?.length > 20,
    '6': () => pe.ap6.estructuraOrg?.length > 10 && (pe.ap6.puestos?.length > 0),
    '7': () => { const a7 = pe.ap7; return a7.inversion && a7.inversion.some(i=>i.importe>0) && a7.ventas && a7.ventas.productos.some(p=>p.precioUnitario>0); },
    '8': () => pe.ap8.producto?.length > 10 && pe.ap8.precio?.length > 10,
  };
  const completados = Object.values(checks).filter(fn => { try { return fn(); } catch(e) { return false; } }).length;
  return Math.round((completados / 8) * 100);
}

/* ============================================================
   APARTADO 7 — PLAN ECONÓMICO-FINANCIERO
   ============================================================ */

/* ── Helpers numéricos ──────────────────────────────────── */
function fmtE(n){ return (parseFloat(n)||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }
function fmtN(n){ return (parseFloat(n)||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}); }

/* ── Cálculos centrales ─────────────────────────────────── */
function ap7_totalInversion() {
  return (EMPRESA_STATE.planEmpresa.ap7.inversion||[]).reduce((s,i)=>s+(parseFloat(i.importe)||0),0);
}
function ap7_totalFinanciacion() {
  return (EMPRESA_STATE.planEmpresa.ap7.financiacion||[]).reduce((s,f)=>s+(parseFloat(f.importe)||0),0);
}
function ap7_fondosPropios() {
  return (EMPRESA_STATE.planEmpresa.ap7.financiacion||[]).filter(f=>f.tipo==='Fondos propios'||f.tipo==='Subvención').reduce((s,f)=>s+(parseFloat(f.importe)||0),0);
}
function ap7_deudaTotal() {
  return (EMPRESA_STATE.planEmpresa.ap7.financiacion||[]).filter(f=>f.tipo==='Financiación ajena').reduce((s,f)=>s+(parseFloat(f.importe)||0),0);
}
function ap7_ventasMes(mes, anyo) {
  // mes: 0-11, anyo: 1|2|3
  const v = EMPRESA_STATE.planEmpresa.ap7.ventas;
  const est = (v.estacionalidad||[])[mes] || 1;
  const crecA2 = 1 + (parseFloat(v.crecimientoA2)||0)/100;
  const crecA3 = crecA2 * (1 + (parseFloat(v.crecimientoA3)||0)/100);
  const factor = anyo===1 ? 1 : anyo===2 ? crecA2 : crecA3;
  return (v.productos||[]).reduce((s,p)=>{
    return s + (parseFloat(p.precioUnitario)||0)*(parseFloat(p.unidadesBase)||0)*est*factor;
  },0);
}
function ap7_ventasAnuales(anyo) {
  let t=0; for(let m=0;m<12;m++) t+=ap7_ventasMes(m,anyo); return t;
}
function ap7_gastosFijosMes() {
  return (EMPRESA_STATE.planEmpresa.ap7.gastos.fijos||[]).reduce((s,g)=>s+(parseFloat(g.importe)||0),0);
}
function ap7_gastosVariablesMes(ventas) {
  return (EMPRESA_STATE.planEmpresa.ap7.gastos.variables||[]).reduce((s,g)=>s+ventas*(parseFloat(g.pctSobreVentas)||0)/100,0);
}
function ap7_gastosTotalesMes(ventas) {
  return ap7_gastosFijosMes() + ap7_gastosVariablesMes(ventas);
}
function ap7_pctVariableTotal() {
  return (EMPRESA_STATE.planEmpresa.ap7.gastos.variables||[]).reduce((s,g)=>s+(parseFloat(g.pctSobreVentas)||0),0);
}
function ap7_umbral() {
  const cf = ap7_gastosFijosMes();
  const pv = ap7_pctVariableTotal()/100;
  return pv < 1 ? cf/(1-pv) : 0;
}
function ap7_resultadoAnual(anyo) {
  const v = ap7_ventasAnuales(anyo);
  const gf = ap7_gastosFijosMes()*12;
  const gvar = (EMPRESA_STATE.planEmpresa.ap7.gastos.variables||[]).reduce((s,g)=>s+v*(parseFloat(g.pctSobreVentas)||0)/100,0);
  return v - gf - gvar;
}
function ap7_VAN(tasa, anyos) {
  const inv = ap7_totalInversion();
  if (!inv) return 0;
  let van = -inv;
  for(let a=1;a<=anyos;a++) van += ap7_resultadoAnual(a) / Math.pow(1+tasa/100, a);
  return van;
}
function ap7_TIR() {
  const inv = ap7_totalInversion();
  if (!inv || inv===0) return 0;
  const flujos = [1,2,3].map(a => ap7_resultadoAnual(a));
  if (flujos.every(f=>f<=0)) return 0;
  // Bisección
  let lo=0, hi=500, tir=0;
  for(let i=0;i<60;i++){
    tir=(lo+hi)/2;
    let van=-inv;
    flujos.forEach((f,idx)=>{ van+=f/Math.pow(1+tir/100,idx+1); });
    if(van>0) lo=tir; else hi=tir;
    if(Math.abs(van)<0.01) break;
  }
  return parseFloat(tir.toFixed(1));
}
function ap7_periodoRecuperacion() {
  const inv = ap7_totalInversion();
  if (!inv) return '—';
  let acum = 0;
  for(let a=1;a<=10;a++){
    acum += ap7_resultadoAnual(a);
    if(acum >= inv) return a + (a===1?' año':' años');
  }
  return '>10 años';
}

/* ── Render principal ap7 ────────────────────────────────── */
function vistaAp7() {
  const ap7 = EMPRESA_STATE.planEmpresa.ap7;
  const tab  = ap7.tabActiva || 'inversion';

  const tabs = [
    { id:'inversion',   label:'💰 Inversión y financiación', ra:'RA4c · RA3g' },
    { id:'ventas',      label:'📈 Ventas e ingresos',        ra:'RA4g' },
    { id:'gastos',      label:'📉 Gastos y tesorería',       ra:'RA4g' },
    { id:'balance',     label:'⚖️ Balance previsional',      ra:'RA4d' },
    { id:'resultados',  label:'📊 Cuenta de resultados',     ra:'RA4h' },
    { id:'ratios',      label:'🔬 Ratios y viabilidad',      ra:'RA4g-h' },
  ];

  // KPIs globales siempre visibles
  const inv    = ap7_totalInversion();
  const fin    = ap7_totalFinanciacion();
  const fp     = ap7_fondosPropios();
  const fa     = ap7_deudaTotal();
  const umbral = ap7_umbral();
  const van    = ap7_VAN(10,3);
  const tir    = ap7_TIR();
  const pr     = ap7_periodoRecuperacion();
  const bal    = fin - inv;
  const balOk  = Math.abs(bal) < 1;

  return `
  <div class="ficha-card">
    <div class="ficha-card-header">
      <span>📊</span>
      <span style="flex:1;font-weight:600">Apartado 7 — Plan económico-financiero</span>
      <span class="ra-chip" style="margin-left:auto">RA4 completo</span>
    </div>

    <!-- KPIs resumen -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:1rem">
      ${[
        ['💶','Inversión total', fmtE(inv), inv>0?'positiva':''],
        ['🏦','Equilibrio',      balOk?'✓ Cuadra':fmtE(bal)+' desfase', balOk?'positiva':'negativa'],
        ['⚖️','Umbral/mes',      fmtE(umbral), umbral>0?'positiva':''],
        ['📈','VAN (3 años)',     fmtE(van), van>0?'positiva':'negativa'],
        ['%','TIR',               tir+'%', tir>10?'positiva':tir>0?'':'negativa'],
        ['🔄','Recuperación',     pr, ''],
      ].map(([ico,lbl,val,cls])=>`
      <div class="metrica-card" style="padding:.85rem">
        <div class="metrica-header"><div class="metrica-icono verde">${ico}</div>${cls?`<span class="metrica-tendencia ${cls}">${cls==='positiva'?'OK':'↓'}</span>`:''}</div>
        <div class="metrica-valor" style="font-size:1.15rem">${val}</div>
        <div class="metrica-etiq">${lbl}</div>
      </div>`).join('')}
    </div>

    <!-- Tabs internos -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:var(--gris-50);border:1px solid var(--gris-200);border-radius:var(--radio-md);padding:4px;margin-bottom:1rem">
      ${tabs.map(t=>`
      <button onclick="EMPRESA_STATE.planEmpresa.ap7.tabActiva='${t.id}';renderPlanEmpresa()"
        style="padding:8px 6px;border:none;border-radius:6px;font-size:.78rem;
        font-weight:${tab===t.id?'700':'500'};cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        background:${tab===t.id?'var(--verde-600)':'transparent'};
        color:${tab===t.id?'white':'var(--gris-500)'};transition:all .2s;text-align:center">
        ${t.label}
      </button>`).join('')}
    </div>

    <!-- Contenido de la tab -->
    ${tab==='inversion'  ? ap7TabInversion()  :
      tab==='ventas'     ? ap7TabVentas()     :
      tab==='gastos'     ? ap7TabGastos()     :
      tab==='balance'    ? ap7TabBalance()    :
      tab==='resultados' ? ap7TabResultados() :
      ap7TabRatios()}
  </div>`;
}

/* ── Tab 1: Inversión y financiación ─────────────────────── */
function ap7TabInversion() {
  const ap7 = EMPRESA_STATE.planEmpresa.ap7;
  const inv  = ap7.inversion||[];
  const fin  = ap7.financiacion||[];
  const totalInv = ap7_totalInversion();
  const totalFin = ap7_totalFinanciacion();
  const fp   = ap7_fondosPropios();
  const fa   = ap7_deudaTotal();
  const bal  = totalFin - totalInv;
  const ratioEnd = fa>0&&fp>0 ? (fa/fp).toFixed(2) : '—';

  const CATS = ['Inmovilizado material','Inmovilizado intangible','Gastos primer establecimiento','Activo corriente'];
  const TIPOS_FIN = ['Fondos propios','Financiación ajena','Subvención'];

  return `
  <div class="grid-2col">
    <!-- Tabla de inversión -->
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800)">Tabla de inversión inicial</h4>
        <button class="btn-secundario" style="padding:4px 10px;font-size:.75rem"
          onclick="EMPRESA_STATE.planEmpresa.ap7.inversion.push({id:'i'+Date.now(),concepto:'',categoria:'Inmovilizado material',importe:0,amortizacion:5});renderPlanEmpresa()">
          + Añadir partida
        </button>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem">
        <thead>
          <tr style="border-bottom:2px solid var(--verde-200)">
            <th style="text-align:left;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Concepto</th>
            <th style="text-align:left;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Categoría</th>
            <th style="text-align:right;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Importe €</th>
            <th style="text-align:center;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Amort. años</th>
            <th style="width:24px"></th>
          </tr>
        </thead>
        <tbody>
          ${inv.map((i,idx)=>`
          <tr style="border-bottom:1px solid var(--gris-50)">
            <td style="padding:4px 4px">
              <input type="text" value="${i.concepto||''}" placeholder="Descripción"
                style="width:100%;border:1px solid var(--gris-200);border-radius:4px;padding:4px 6px;font-size:.78rem;font-family:var(--fuente-cuerpo)"
                oninput="EMPRESA_STATE.planEmpresa.ap7.inversion[${idx}].concepto=this.value">
            </td>
            <td style="padding:4px 4px">
              <select style="width:100%;border:1px solid var(--gris-200);border-radius:4px;padding:4px;font-size:.75rem;font-family:var(--fuente-cuerpo)"
                onchange="EMPRESA_STATE.planEmpresa.ap7.inversion[${idx}].categoria=this.value">
                ${CATS.map(c=>`<option ${i.categoria===c?'selected':''}>${c}</option>`).join('')}
              </select>
            </td>
            <td style="padding:4px 4px">
              <input type="number" min="0" step="100" value="${i.importe||''}" placeholder="0"
                style="width:90px;border:1px solid var(--gris-200);border-radius:4px;padding:4px 6px;font-size:.78rem;text-align:right;font-family:var(--fuente-cuerpo)"
                oninput="EMPRESA_STATE.planEmpresa.ap7.inversion[${idx}].importe=parseFloat(this.value)||0"
                onblur="renderPlanEmpresa()">
            </td>
            <td style="padding:4px 4px;text-align:center">
              <input type="number" min="0" max="30" step="1" value="${i.amortizacion||0}"
                style="width:52px;border:1px solid var(--gris-200);border-radius:4px;padding:4px;font-size:.78rem;text-align:center;font-family:var(--fuente-cuerpo)"
                oninput="EMPRESA_STATE.planEmpresa.ap7.inversion[${idx}].amortizacion=parseInt(this.value)||0">
            </td>
            <td style="padding:4px 2px;text-align:center">
              <button style="border:none;background:none;cursor:pointer;color:var(--gris-400);font-size:.8rem"
                onclick="EMPRESA_STATE.planEmpresa.ap7.inversion.splice(${idx},1);renderPlanEmpresa()">✕</button>
            </td>
          </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr style="border-top:2px solid var(--verde-200);background:var(--verde-50)">
            <td colspan="2" style="padding:7px 6px;font-weight:700;color:var(--gris-800);font-size:.82rem">TOTAL INVERSIÓN</td>
            <td style="padding:7px 6px;text-align:right;font-weight:800;color:var(--verde-700);font-size:.9rem">${fmtE(totalInv)}</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>

      <!-- Cuota de amortización anual resumen -->
      <div style="margin-top:8px;padding:8px 10px;background:var(--gris-50);border-radius:var(--radio-sm);font-size:.76rem;color:var(--gris-600)">
        Amortización anual estimada:
        <strong style="color:var(--verde-700)">
          ${fmtE(inv.filter(i=>i.amortizacion>0).reduce((s,i)=>{
            const imp = parseFloat(i.importe)||0;
            const a   = parseInt(i.amortizacion)||1;
            return s+(imp/a);
          },0))}
        </strong>
      </div>
    </div>

    <!-- Tabla de financiación -->
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800)">Plan de financiación</h4>
        <button class="btn-secundario" style="padding:4px 10px;font-size:.75rem"
          onclick="EMPRESA_STATE.planEmpresa.ap7.financiacion.push({id:'f'+Date.now(),fuente:'',tipo:'Fondos propios',importe:0,interes:0,plazo:0});renderPlanEmpresa()">
          + Añadir fuente
        </button>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem">
        <thead>
          <tr style="border-bottom:2px solid var(--verde-200)">
            <th style="text-align:left;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Fuente</th>
            <th style="text-align:left;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Tipo</th>
            <th style="text-align:right;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Importe €</th>
            <th style="text-align:center;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Interés %</th>
            <th style="text-align:center;padding:5px 6px;color:var(--gris-500);font-size:.7rem">Plazo</th>
            <th style="width:24px"></th>
          </tr>
        </thead>
        <tbody>
          ${fin.map((f,idx)=>`
          <tr style="border-bottom:1px solid var(--gris-50)">
            <td style="padding:4px 4px">
              <input type="text" value="${f.fuente||''}" placeholder="Descripción"
                style="width:100%;border:1px solid var(--gris-200);border-radius:4px;padding:4px 6px;font-size:.78rem;font-family:var(--fuente-cuerpo)"
                oninput="EMPRESA_STATE.planEmpresa.ap7.financiacion[${idx}].fuente=this.value">
            </td>
            <td style="padding:4px 4px">
              <select style="width:100%;border:1px solid var(--gris-200);border-radius:4px;padding:4px;font-size:.75rem;font-family:var(--fuente-cuerpo)"
                onchange="EMPRESA_STATE.planEmpresa.ap7.financiacion[${idx}].tipo=this.value">
                ${TIPOS_FIN.map(t=>`<option ${f.tipo===t?'selected':''}>${t}</option>`).join('')}
              </select>
            </td>
            <td style="padding:4px 4px">
              <input type="number" min="0" step="100" value="${f.importe||''}" placeholder="0"
                style="width:86px;border:1px solid var(--gris-200);border-radius:4px;padding:4px 6px;font-size:.78rem;text-align:right;font-family:var(--fuente-cuerpo)"
                oninput="EMPRESA_STATE.planEmpresa.ap7.financiacion[${idx}].importe=parseFloat(this.value)||0"
                onblur="renderPlanEmpresa()">
            </td>
            <td style="padding:4px 4px;text-align:center">
              <input type="number" min="0" max="30" step="0.1" value="${f.interes||0}"
                style="width:50px;border:1px solid var(--gris-200);border-radius:4px;padding:4px;font-size:.78rem;text-align:center;font-family:var(--fuente-cuerpo)"
                oninput="EMPRESA_STATE.planEmpresa.ap7.financiacion[${idx}].interes=parseFloat(this.value)||0">
            </td>
            <td style="padding:4px 4px;text-align:center">
              <input type="number" min="0" max="30" step="1" value="${f.plazo||0}"
                style="width:44px;border:1px solid var(--gris-200);border-radius:4px;padding:4px;font-size:.78rem;text-align:center;font-family:var(--fuente-cuerpo)"
                oninput="EMPRESA_STATE.planEmpresa.ap7.financiacion[${idx}].plazo=parseInt(this.value)||0">
            </td>
            <td style="padding:4px 2px;text-align:center">
              <button style="border:none;background:none;cursor:pointer;color:var(--gris-400);font-size:.8rem"
                onclick="EMPRESA_STATE.planEmpresa.ap7.financiacion.splice(${idx},1);renderPlanEmpresa()">✕</button>
            </td>
          </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr style="border-top:2px solid var(--verde-200);background:var(--verde-50)">
            <td colspan="2" style="padding:7px 6px;font-weight:700;color:var(--gris-800);font-size:.82rem">TOTAL FINANCIACIÓN</td>
            <td style="padding:7px 6px;text-align:right;font-weight:800;color:var(--verde-700);font-size:.9rem">${fmtE(totalFin)}</td>
            <td colspan="3"></td>
          </tr>
        </tfoot>
      </table>

      <!-- Equilibrio inversión-financiación -->
      <div style="margin-top:10px;padding:10px 12px;border-radius:var(--radio-md);font-size:.82rem;
        background:${Math.abs(bal)<1?'var(--verde-50)':'#fef9ec'};
        border:1.5px solid ${Math.abs(bal)<1?'var(--verde-300)':'#fde68a'}">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="color:var(--gris-600)">Inversión total:</span>
          <strong>${fmtE(totalInv)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="color:var(--gris-600)">Financiación total:</span>
          <strong>${fmtE(totalFin)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid var(--gris-200);padding-top:6px">
          <span style="font-weight:700">Diferencia:</span>
          <strong style="color:${Math.abs(bal)<1?'var(--verde-700)':'#dc2626'}">${Math.abs(bal)<1?'✓ Cuadra':fmtE(bal)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px">
          <span style="color:var(--gris-600)">Ratio de endeudamiento (FA/FP):</span>
          <strong style="color:${parseFloat(ratioEnd)<=1.5?'var(--verde-700)':'#dc2626'}">${ratioEnd} ${parseFloat(ratioEnd)<=1.5?'✓':'⚠️ Elevado'}</strong>
        </div>
        <div style="height:6px;background:var(--gris-100);border-radius:3px;margin-top:8px;overflow:hidden">
          <div style="height:100%;width:${totalFin>0?Math.min(fp/totalFin*100,100):0}%;background:var(--verde-500);border-radius:3px;transition:width .4s"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.7rem;margin-top:3px;color:var(--gris-500)">
          <span>Fondos propios ${totalFin>0?(fp/totalFin*100).toFixed(0):0}%</span>
          <span>Financiación ajena ${totalFin>0?(fa/totalFin*100).toFixed(0):0}%</span>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── Tab 2: Previsión de ventas ──────────────────────────── */
function ap7TabVentas() {
  const ap7 = EMPRESA_STATE.planEmpresa.ap7;
  const v    = ap7.ventas;
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const ventas1 = MESES.map((_,m)=>ap7_ventasMes(m,1));
  const ventas2 = MESES.map((_,m)=>ap7_ventasMes(m,2));
  const ventas3 = MESES.map((_,m)=>ap7_ventasMes(m,3));
  const total1=ventas1.reduce((s,v)=>s+v,0);
  const total2=ventas2.reduce((s,v)=>s+v,0);
  const total3=ventas3.reduce((s,v)=>s+v,0);

  return `
  <div style="display:flex;flex-direction:column;gap:1rem">
    <!-- Tabla de productos -->
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800)">Productos / servicios y precio de venta</h4>
        <button class="btn-secundario" style="padding:4px 10px;font-size:.75rem"
          onclick="EMPRESA_STATE.planEmpresa.ap7.ventas.productos.push({id:'p'+Date.now(),nombre:'',precioUnitario:0,unidadesBase:0});renderPlanEmpresa()">
          + Añadir producto
        </button>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.82rem">
        <thead>
          <tr style="border-bottom:2px solid var(--verde-200)">
            <th style="text-align:left;padding:6px 8px;color:var(--gris-500);font-size:.7rem">Producto / servicio</th>
            <th style="text-align:right;padding:6px 8px;color:var(--gris-500);font-size:.7rem">Precio unitario €</th>
            <th style="text-align:right;padding:6px 8px;color:var(--gris-500);font-size:.7rem">Ud./mes base</th>
            <th style="text-align:right;padding:6px 8px;color:var(--gris-500);font-size:.7rem">Ingreso/mes</th>
            <th style="width:28px"></th>
          </tr>
        </thead>
        <tbody>
          ${(v.productos||[]).map((p,idx)=>{
            const ing = (parseFloat(p.precioUnitario)||0)*(parseFloat(p.unidadesBase)||0);
            return `
            <tr style="border-bottom:1px solid var(--gris-50)">
              <td style="padding:5px 6px">
                <input type="text" value="${p.nombre||''}" placeholder="Nombre del producto/servicio"
                  style="width:100%;border:1px solid var(--gris-200);border-radius:4px;padding:4px 8px;font-size:.82rem;font-family:var(--fuente-cuerpo)"
                  oninput="EMPRESA_STATE.planEmpresa.ap7.ventas.productos[${idx}].nombre=this.value">
              </td>
              <td style="padding:5px 6px">
                <input type="number" min="0" step="0.01" value="${p.precioUnitario||''}" placeholder="0.00"
                  style="width:90px;border:1px solid var(--gris-200);border-radius:4px;padding:4px 8px;font-size:.82rem;text-align:right;font-family:var(--fuente-cuerpo)"
                  oninput="EMPRESA_STATE.planEmpresa.ap7.ventas.productos[${idx}].precioUnitario=parseFloat(this.value)||0"
                  onblur="renderPlanEmpresa()">
              </td>
              <td style="padding:5px 6px">
                <input type="number" min="0" step="1" value="${p.unidadesBase||''}" placeholder="0"
                  style="width:80px;border:1px solid var(--gris-200);border-radius:4px;padding:4px 8px;font-size:.82rem;text-align:right;font-family:var(--fuente-cuerpo)"
                  oninput="EMPRESA_STATE.planEmpresa.ap7.ventas.productos[${idx}].unidadesBase=parseFloat(this.value)||0"
                  onblur="renderPlanEmpresa()">
              </td>
              <td style="padding:5px 6px;text-align:right;font-weight:600;color:var(--verde-700)">${fmtE(ing)}</td>
              <td style="padding:5px 2px;text-align:center">
                <button style="border:none;background:none;cursor:pointer;color:var(--gris-400)"
                  onclick="EMPRESA_STATE.planEmpresa.ap7.ventas.productos.splice(${idx},1);renderPlanEmpresa()">✕</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Factores de crecimiento y estacionalidad -->
    <div class="grid-2col">
      <div style="padding:12px 14px;background:var(--gris-50);border:1px solid var(--gris-200);border-radius:var(--radio-md)">
        <div style="font-size:.82rem;font-weight:600;color:var(--gris-800);margin-bottom:10px">Crecimiento interanual</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;gap:10px;font-size:.82rem">
            <label style="flex:1;color:var(--gris-600)">Crecimiento Año 2 (%)</label>
            <input type="number" min="-50" max="200" step="1" value="${v.crecimientoA2||15}"
              style="width:70px;border:1px solid var(--gris-200);border-radius:4px;padding:4px 8px;font-size:.82rem;text-align:right;font-family:var(--fuente-cuerpo)"
              oninput="EMPRESA_STATE.planEmpresa.ap7.ventas.crecimientoA2=parseFloat(this.value)||0"
              onblur="renderPlanEmpresa()">
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:.82rem">
            <label style="flex:1;color:var(--gris-600)">Crecimiento Año 3 (%)</label>
            <input type="number" min="-50" max="200" step="1" value="${v.crecimientoA3||20}"
              style="width:70px;border:1px solid var(--gris-200);border-radius:4px;padding:4px 8px;font-size:.82rem;text-align:right;font-family:var(--fuente-cuerpo)"
              oninput="EMPRESA_STATE.planEmpresa.ap7.ventas.crecimientoA3=parseFloat(this.value)||0"
              onblur="renderPlanEmpresa()">
          </div>
        </div>
      </div>
      <div style="padding:12px 14px;background:var(--gris-50);border:1px solid var(--gris-200);border-radius:var(--radio-md)">
        <div style="font-size:.82rem;font-weight:600;color:var(--gris-800);margin-bottom:6px">Estacionalidad mensual (factor ×)</div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px">
          ${MESES.map((mes,i)=>`
          <div style="text-align:center">
            <div style="font-size:.68rem;color:var(--gris-500);margin-bottom:2px">${mes}</div>
            <input type="number" min="0.1" max="3" step="0.1" value="${(v.estacionalidad||[])[i]||1}"
              style="width:100%;border:1px solid var(--gris-200);border-radius:4px;padding:3px 2px;font-size:.75rem;text-align:center;font-family:var(--fuente-cuerpo);background:${(v.estacionalidad||[])[i]>1.2?'var(--verde-50)':(v.estacionalidad||[])[i]<0.8?'#fee2e2':'white'}"
              oninput="if(!EMPRESA_STATE.planEmpresa.ap7.ventas.estacionalidad)EMPRESA_STATE.planEmpresa.ap7.ventas.estacionalidad=[1,1,1,1,1,1,1,1,1,1,1,1];EMPRESA_STATE.planEmpresa.ap7.ventas.estacionalidad[${i}]=parseFloat(this.value)||1"
              onblur="renderPlanEmpresa()">
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Tabla previsión de ventas 3 años -->
    <div>
      <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800);margin-bottom:8px">Previsión de ingresos mensual (€)</h4>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.76rem;min-width:700px">
          <thead>
            <tr style="border-bottom:2px solid var(--verde-200)">
              <th style="text-align:left;padding:5px 8px;color:var(--gris-500);width:55px">Mes</th>
              ${MESES.map(m=>`<th style="text-align:right;padding:5px 4px;color:var(--gris-500);min-width:60px">${m}</th>`).join('')}
              <th style="text-align:right;padding:5px 8px;color:var(--gris-500);font-weight:700">Total</th>
            </tr>
          </thead>
          <tbody>
            ${[[1,'Año 1',ventas1,'var(--verde-600)'],[2,'Año 2',ventas2,'#1e40af'],[3,'Año 3',ventas3,'#9333ea']].map(([a,lbl,vals,col])=>`
            <tr style="border-bottom:1px solid var(--gris-100)">
              <td style="padding:6px 8px;font-weight:700;color:${col};font-size:.78rem">${lbl}</td>
              ${vals.map(v=>`<td style="padding:6px 4px;text-align:right">${v>0?fmtN(v):'—'}</td>`).join('')}
              <td style="padding:6px 8px;text-align:right;font-weight:800;color:${col}">${vals.reduce((s,v)=>s+v,0)>0?fmtE(vals.reduce((s,v)=>s+v,0)):'—'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

/* ── Tab 3: Gastos y presupuesto de tesorería ─────────────── */
function ap7TabGastos() {
  const ap7 = EMPRESA_STATE.planEmpresa.ap7;
  const g    = ap7.gastos;
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  // Calcular tesorería mensual
  let saldo = parseFloat(ap7.saldoInicial)||0;
  const tesoreria = MESES.map((_,m) => {
    const ingresos = ap7_ventasMes(m,1);
    const gf = ap7_gastosFijosMes();
    const gv = ap7_gastosVariablesMes(ingresos);
    const saldoMes = saldo + ingresos - gf - gv;
    const fila = { mes:MESES[m], ingresos, gf, gv, flujo:ingresos-gf-gv, saldoAcum:saldoMes };
    saldo = saldoMes;
    return fila;
  });

  return `
  <div style="display:flex;flex-direction:column;gap:1rem">
    <div class="grid-2col">
      <!-- Gastos fijos -->
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800)">Gastos fijos mensuales</h4>
          <button class="btn-secundario" style="padding:4px 10px;font-size:.75rem"
            onclick="EMPRESA_STATE.planEmpresa.ap7.gastos.fijos.push({id:'gf'+Date.now(),concepto:'',importe:0});renderPlanEmpresa()">
            + Añadir
          </button>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
          <thead>
            <tr style="border-bottom:1.5px solid var(--gris-200)">
              <th style="text-align:left;padding:5px 8px;color:var(--gris-500);font-size:.7rem">Concepto</th>
              <th style="text-align:right;padding:5px 8px;color:var(--gris-500);font-size:.7rem">€/mes</th>
              <th style="width:24px"></th>
            </tr>
          </thead>
          <tbody>
            ${(g.fijos||[]).map((gf,idx)=>`
            <tr style="border-bottom:1px solid var(--gris-50)">
              <td style="padding:4px 6px">
                <input type="text" value="${gf.concepto||''}" placeholder="Concepto"
                  style="width:100%;border:1px solid var(--gris-200);border-radius:4px;padding:3px 6px;font-size:.8rem;font-family:var(--fuente-cuerpo)"
                  oninput="EMPRESA_STATE.planEmpresa.ap7.gastos.fijos[${idx}].concepto=this.value">
              </td>
              <td style="padding:4px 6px">
                <input type="number" min="0" step="10" value="${gf.importe||''}" placeholder="0"
                  style="width:90px;border:1px solid var(--gris-200);border-radius:4px;padding:3px 6px;font-size:.8rem;text-align:right;font-family:var(--fuente-cuerpo)"
                  oninput="EMPRESA_STATE.planEmpresa.ap7.gastos.fijos[${idx}].importe=parseFloat(this.value)||0"
                  onblur="renderPlanEmpresa()">
              </td>
              <td style="padding:4px 2px;text-align:center">
                <button style="border:none;background:none;cursor:pointer;color:var(--gris-400)"
                  onclick="EMPRESA_STATE.planEmpresa.ap7.gastos.fijos.splice(${idx},1);renderPlanEmpresa()">✕</button>
              </td>
            </tr>`).join('')}
          </tbody>
          <tfoot>
            <tr style="border-top:2px solid var(--gris-200);background:var(--gris-50)">
              <td style="padding:6px 8px;font-weight:700;font-size:.82rem">TOTAL FIJOS/MES</td>
              <td style="padding:6px 8px;text-align:right;font-weight:800;color:#dc2626">${fmtE(ap7_gastosFijosMes())}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Gastos variables -->
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800)">Gastos variables (% s/ventas)</h4>
          <button class="btn-secundario" style="padding:4px 10px;font-size:.75rem"
            onclick="EMPRESA_STATE.planEmpresa.ap7.gastos.variables.push({id:'gv'+Date.now(),concepto:'',pctSobreVentas:0});renderPlanEmpresa()">
            + Añadir
          </button>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
          <thead>
            <tr style="border-bottom:1.5px solid var(--gris-200)">
              <th style="text-align:left;padding:5px 8px;color:var(--gris-500);font-size:.7rem">Concepto</th>
              <th style="text-align:right;padding:5px 8px;color:var(--gris-500);font-size:.7rem">% ventas</th>
              <th style="width:24px"></th>
            </tr>
          </thead>
          <tbody>
            ${(g.variables||[]).map((gv,idx)=>`
            <tr style="border-bottom:1px solid var(--gris-50)">
              <td style="padding:4px 6px">
                <input type="text" value="${gv.concepto||''}" placeholder="Concepto"
                  style="width:100%;border:1px solid var(--gris-200);border-radius:4px;padding:3px 6px;font-size:.8rem;font-family:var(--fuente-cuerpo)"
                  oninput="EMPRESA_STATE.planEmpresa.ap7.gastos.variables[${idx}].concepto=this.value">
              </td>
              <td style="padding:4px 6px">
                <input type="number" min="0" max="100" step="0.5" value="${gv.pctSobreVentas||''}" placeholder="0"
                  style="width:70px;border:1px solid var(--gris-200);border-radius:4px;padding:3px 6px;font-size:.8rem;text-align:right;font-family:var(--fuente-cuerpo)"
                  oninput="EMPRESA_STATE.planEmpresa.ap7.gastos.variables[${idx}].pctSobreVentas=parseFloat(this.value)||0"
                  onblur="renderPlanEmpresa()">
              </td>
              <td style="padding:4px 2px;text-align:center">
                <button style="border:none;background:none;cursor:pointer;color:var(--gris-400)"
                  onclick="EMPRESA_STATE.planEmpresa.ap7.gastos.variables.splice(${idx},1);renderPlanEmpresa()">✕</button>
              </td>
            </tr>`).join('')}
          </tbody>
          <tfoot>
            <tr style="border-top:2px solid var(--gris-200);background:var(--gris-50)">
              <td style="padding:6px 8px;font-weight:700;font-size:.82rem">TOTAL VARIABLE</td>
              <td style="padding:6px 8px;text-align:right;font-weight:800;color:#f59e0b">${ap7_pctVariableTotal().toFixed(1)}%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Presupuesto de tesorería -->
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800)">Presupuesto de tesorería — Año 1</h4>
        <div style="display:flex;align-items:center;gap:8px;font-size:.82rem;color:var(--gris-600)">
          Saldo inicial:
          <input type="number" min="0" step="100" value="${ap7.saldoInicial||0}"
            style="width:90px;border:1px solid var(--gris-200);border-radius:4px;padding:4px 8px;font-size:.82rem;text-align:right;font-family:var(--fuente-cuerpo)"
            oninput="EMPRESA_STATE.planEmpresa.ap7.saldoInicial=parseFloat(this.value)||0"
            onblur="renderPlanEmpresa()">
          €
        </div>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.76rem;min-width:800px">
          <thead>
            <tr style="border-bottom:2px solid var(--verde-200);background:var(--verde-50)">
              <th style="text-align:left;padding:6px 8px;color:var(--gris-700);width:120px">Concepto</th>
              ${MESES.map(m=>`<th style="text-align:right;padding:6px 4px;color:var(--gris-600);min-width:58px">${m}</th>`).join('')}
              <th style="text-align:right;padding:6px 8px;color:var(--gris-700);font-weight:700">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--gris-100);background:#f0fdf4">
              <td style="padding:5px 8px;font-weight:600;color:var(--verde-700)">Cobros (ventas)</td>
              ${tesoreria.map(t=>`<td style="padding:5px 4px;text-align:right;color:var(--verde-700)">${t.ingresos>0?fmtN(t.ingresos):'0'}</td>`).join('')}
              <td style="padding:5px 8px;text-align:right;font-weight:700;color:var(--verde-700)">${fmtE(tesoreria.reduce((s,t)=>s+t.ingresos,0))}</td>
            </tr>
            <tr style="border-bottom:1px solid var(--gris-100)">
              <td style="padding:5px 8px;color:var(--gris-700)">(-) Gastos fijos</td>
              ${tesoreria.map(t=>`<td style="padding:5px 4px;text-align:right;color:#dc2626">${fmtN(t.gf)}</td>`).join('')}
              <td style="padding:5px 8px;text-align:right;font-weight:600;color:#dc2626">${fmtE(tesoreria.reduce((s,t)=>s+t.gf,0))}</td>
            </tr>
            <tr style="border-bottom:1px solid var(--gris-100)">
              <td style="padding:5px 8px;color:var(--gris-700)">(-) Gastos variables</td>
              ${tesoreria.map(t=>`<td style="padding:5px 4px;text-align:right;color:#f59e0b">${fmtN(t.gv)}</td>`).join('')}
              <td style="padding:5px 8px;text-align:right;font-weight:600;color:#f59e0b">${fmtE(tesoreria.reduce((s,t)=>s+t.gv,0))}</td>
            </tr>
            <tr style="border-bottom:2px solid var(--gris-200);background:var(--gris-50)">
              <td style="padding:5px 8px;font-weight:700;color:var(--gris-800)">Flujo neto mensual</td>
              ${tesoreria.map(t=>`<td style="padding:5px 4px;text-align:right;font-weight:700;color:${t.flujo>=0?'var(--verde-700)':'#dc2626'}">${fmtN(t.flujo)}</td>`).join('')}
              <td style="padding:5px 8px;text-align:right;font-weight:800;color:${tesoreria.reduce((s,t)=>s+t.flujo,0)>=0?'var(--verde-700)':'#dc2626'}">${fmtE(tesoreria.reduce((s,t)=>s+t.flujo,0))}</td>
            </tr>
            <tr style="background:var(--verde-50)">
              <td style="padding:6px 8px;font-weight:700;color:var(--gris-800)">Saldo acumulado</td>
              ${tesoreria.map(t=>`<td style="padding:6px 4px;text-align:right;font-weight:700;color:${t.saldoAcum>=0?'var(--verde-700)':'#dc2626'}">${fmtN(t.saldoAcum)}</td>`).join('')}
              <td style="padding:6px 8px;text-align:right;font-weight:800;color:${tesoreria[11]?.saldoAcum>=0?'var(--verde-700)':'#dc2626'}">${fmtE(tesoreria[11]?.saldoAcum||0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ${tesoreria.some(t=>t.saldoAcum<0) ? `
      <div style="margin-top:8px;padding:8px 12px;background:#fef9ec;border:1px solid #fde68a;border-radius:var(--radio-sm);font-size:.8rem;color:#92400e">
        ⚠️ Hay meses con saldo negativo. Considera aumentar el saldo inicial o ajustar los gastos para garantizar liquidez.
      </div>` : `
      <div style="margin-top:8px;padding:8px 12px;background:#f0fdf4;border:1px solid var(--verde-200);border-radius:var(--radio-sm);font-size:.8rem;color:var(--verde-700)">
        ✓ El saldo acumulado es positivo en todos los meses del año.
      </div>`}
    </div>
  </div>`;
}

/* ── Tab 4: Balance de situación previsional ─────────────── */
function ap7TabBalance() {
  const ap7 = EMPRESA_STATE.planEmpresa.ap7;
  // Auto-calcular valores base a partir de los datos introducidos
  const inv     = ap7_totalInversion();
  const fa      = ap7_deudaTotal();
  const fp      = ap7_fondosPropios();
  const amort1  = ap7.inversion.filter(i=>i.amortizacion>0).reduce((s,i)=>{const imp=parseFloat(i.importe)||0;const a=parseInt(i.amortizacion)||1;return s+(imp/a);},0);
  const res1    = ap7_resultadoAnual(1);
  const tesA1   = (EMPRESA_STATE.planEmpresa.ap7.saldoInicial||0) + [0,1,2,3,4,5,6,7,8,9,10,11].reduce((s,m)=>{const v=ap7_ventasMes(m,1);return s+v-ap7_gastosTotalesMes(v);},0);

  // Activo
  const inmovilizado = ap7.inversion.filter(i=>i.categoria==='Inmovilizado material'||i.categoria==='Inmovilizado intangible').reduce((s,i)=>s+(parseFloat(i.importe)||0),0);
  const actCorr   = inv - inmovilizado + Math.max(0,tesA1);
  const totalAct  = inmovilizado - amort1 + Math.max(0,actCorr);
  // PN
  const totalPN   = fp + res1;
  // Pasivo
  const totalPas  = Math.max(0, fa);
  const totalPNPas= totalPN + totalPas;

  const fila = (label, val, color='var(--gris-800)', bold=false) => `
    <tr style="border-bottom:1px solid var(--gris-50)">
      <td style="padding:5px 12px;color:${color};font-weight:${bold?700:400};font-size:.82rem">${label}</td>
      <td style="padding:5px 12px;text-align:right;color:${color};font-weight:${bold?700:400};font-size:.82rem">${fmtE(val)}</td>
    </tr>`;
  const separador = (label,val,color='var(--verde-700)') => `
    <tr style="border-bottom:2px solid var(--gris-200);background:var(--gris-50)">
      <td style="padding:6px 12px;font-weight:700;color:${color};font-size:.84rem">TOTAL ${label}</td>
      <td style="padding:6px 12px;text-align:right;font-weight:800;color:${color};font-size:.9rem">${fmtE(val)}</td>
    </tr>`;

  return `
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
    <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800)">Balance de situación previsional · Fin Año 1</h4>
    <span class="ra-chip">RA4d</span>
    <div style="margin-left:auto;padding:6px 10px;background:${Math.abs(totalAct-totalPNPas)<1?'var(--verde-50)':'#fef9ec'};border:1px solid ${Math.abs(totalAct-totalPNPas)<1?'var(--verde-300)':'#fde68a'};border-radius:var(--radio-sm);font-size:.78rem;font-weight:700;color:${Math.abs(totalAct-totalPNPas)<1?'var(--verde-700)':'#92400e'}">
      ${Math.abs(totalAct-totalPNPas)<1?'✓ Activo = PN + Pasivo':'⚠️ No cuadra: diferencia '+fmtE(Math.abs(totalAct-totalPNPas))}
    </div>
  </div>
  <div style="background:var(--gris-50);border-radius:var(--radio-md);padding:6px 8px;font-size:.76rem;color:var(--gris-500);margin-bottom:10px">
    💡 Los valores se calculan automáticamente a partir de las tablas de inversión y financiación. Puedes consultarlos como referencia para la memoria del proyecto.
  </div>
  <div class="grid-2col">
    <div>
      <div style="font-size:.78rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em;padding:6px 12px;background:var(--gris-50);border-radius:var(--radio-sm);margin-bottom:4px">ACTIVO</div>
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          <tr style="background:#f0fdf4"><td colspan="2" style="padding:5px 12px;font-size:.78rem;font-weight:700;color:var(--verde-700)">A. NO CORRIENTE</td></tr>
          ${fila('Inmovilizado material', ap7.inversion.filter(i=>i.categoria==='Inmovilizado material').reduce((s,i)=>s+(parseFloat(i.importe)||0),0))}
          ${fila('Inmovilizado intangible', ap7.inversion.filter(i=>i.categoria==='Inmovilizado intangible').reduce((s,i)=>s+(parseFloat(i.importe)||0),0))}
          ${fila('(-) Amortización acumulada', -amort1,'#dc2626')}
          ${separador('ACTIVO NO CORRIENTE', inmovilizado-amort1)}
          <tr style="background:#f0fdf4"><td colspan="2" style="padding:5px 12px;font-size:.78rem;font-weight:700;color:var(--verde-700)">B. CORRIENTE</td></tr>
          ${fila('Existencias', ap7.inversion.filter(i=>i.concepto.toLowerCase().includes('stock')||i.concepto.toLowerCase().includes('existencia')).reduce((s,i)=>s+(parseFloat(i.importe)||0),0))}
          ${fila('Clientes (deudores)', 0)}
          ${fila('Tesorería', Math.max(0,tesA1))}
          ${separador('ACTIVO CORRIENTE', Math.max(0,actCorr))}
          ${separador('ACTIVO', totalAct,'#134a28')}
        </tbody>
      </table>
    </div>
    <div>
      <div style="font-size:.78rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em;padding:6px 12px;background:var(--gris-50);border-radius:var(--radio-sm);margin-bottom:4px">PATRIMONIO NETO Y PASIVO</div>
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          <tr style="background:#eff6ff"><td colspan="2" style="padding:5px 12px;font-size:.78rem;font-weight:700;color:#1e40af">A. PATRIMONIO NETO</td></tr>
          ${fila('Capital social', capitalTotalSocios(),'var(--gris-800)')}
          ${fila('Resultado del ejercicio', res1, res1>=0?'var(--verde-700)':'#dc2626')}
          ${separador('PATRIMONIO NETO', totalPN,'#1e40af')}
          <tr style="background:#fef9ec"><td colspan="2" style="padding:5px 12px;font-size:.78rem;font-weight:700;color:#92400e">B. PASIVO NO CORRIENTE</td></tr>
          ${ap7.financiacion.filter(f=>f.tipo==='Financiación ajena'&&(parseInt(f.plazo)||0)>1).map(f=>fila(f.fuente||'Deuda LP', parseFloat(f.importe)||0)).join('')}
          ${separador('PASIVO NO CORRIENTE', ap7.financiacion.filter(f=>f.tipo==='Financiación ajena'&&(parseInt(f.plazo)||0)>1).reduce((s,f)=>s+(parseFloat(f.importe)||0),0),'#92400e')}
          <tr style="background:#fee2e2"><td colspan="2" style="padding:5px 12px;font-size:.78rem;font-weight:700;color:#991b1b">C. PASIVO CORRIENTE</td></tr>
          ${ap7.financiacion.filter(f=>f.tipo==='Financiación ajena'&&(parseInt(f.plazo)||0)<=1).map(f=>fila(f.fuente||'Deuda CP', parseFloat(f.importe)||0,'var(--gris-800)')).join('')}
          ${fila('Proveedores', 0)}
          ${fila('Hacienda acreedora', 0)}
          ${separador('PASIVO CORRIENTE', ap7.financiacion.filter(f=>f.tipo==='Financiación ajena'&&(parseInt(f.plazo)||0)<=1).reduce((s,f)=>s+(parseFloat(f.importe)||0),0),'#991b1b')}
          ${separador('PN + PASIVO', totalPNPas,'#134a28')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ── Tab 5: Cuenta de resultados previsional ─────────────── */
function ap7TabResultados() {
  const ANYOS = [1,2,3];
  const labels = ['Año 1','Año 2','Año 3'];
  const colors = ['var(--verde-600)','#1e40af','#9333ea'];

  const filaRes = (label, vals, color='var(--gris-700)', bold=false, positivo=true) => `
    <tr style="border-bottom:1px solid var(--gris-50)">
      <td style="padding:6px 10px;color:${color};font-weight:${bold?700:400};font-size:.82rem">${label}</td>
      ${vals.map((v,i)=>`<td style="padding:6px 10px;text-align:right;font-weight:${bold?700:400};font-size:.82rem;color:${bold?(v>=0?colors[i]:'#dc2626'):'var(--gris-700)'}">${v!==null&&v!==undefined?fmtE(v):'—'}</td>`).join('')}
    </tr>`;
  const totalRes = (label, vals, color='var(--verde-700)') => `
    <tr style="background:var(--gris-50);border-top:2px solid var(--gris-200)">
      <td style="padding:7px 10px;font-weight:700;color:${color};font-size:.84rem">${label}</td>
      ${vals.map(v=>`<td style="padding:7px 10px;text-align:right;font-weight:800;font-size:.9rem;color:${v>=0?'var(--verde-700)':'#dc2626'}">${fmtE(v)}</td>`).join('')}
    </tr>`;

  const ventas    = ANYOS.map(a=>ap7_ventasAnuales(a));
  const gf_anuales= ANYOS.map(()=>ap7_gastosFijosMes()*12);
  const gv_anuales= ANYOS.map((a,i)=>ap7_gastosVariablesMes(ventas[i])*12);
  const ebitda    = ANYOS.map((_,i)=>ventas[i]-gf_anuales[i]-gv_anuales[i]);
  const amort     = EMPRESA_STATE.planEmpresa.ap7.inversion.filter(i=>i.amortizacion>0).reduce((s,i)=>{
    const imp=parseFloat(i.importe)||0; const a=parseInt(i.amortizacion)||1; return s+(imp/a);
  },0);
  const ebit      = ebitda.map(e=>e-amort);
  const gastoFin  = EMPRESA_STATE.planEmpresa.ap7.financiacion.filter(f=>f.tipo==='Financiación ajena').reduce((s,f)=>{
    return s+(parseFloat(f.importe)||0)*(parseFloat(f.interes)||0)/100;
  },0);
  const bai       = ebit.map(e=>e-gastoFin);
  const impSoc    = bai.map(b=>b>0?b*0.25:0);
  const benefNeto = bai.map((b,i)=>b-impSoc[i]);

  // Margen sobre ventas
  const margen    = benefNeto.map((b,i)=>ventas[i]>0?(b/ventas[i]*100).toFixed(1)+'%':'—');

  return `
  <div style="margin-bottom:8px;display:flex;align-items:center;gap:10px">
    <h4 style="font-size:.875rem;font-weight:600;color:var(--gris-800)">Cuenta de resultados previsional (3 años)</h4>
    <span class="ra-chip">RA4h</span>
  </div>
  <div style="background:var(--gris-50);border-radius:var(--radio-md);padding:6px 10px;font-size:.76rem;color:var(--gris-500);margin-bottom:10px">
    Los datos se calculan automáticamente a partir de las tablas de ventas y gastos. El tipo impositivo aplicado es el 25% (IS general). Ajusta las tablas anteriores para modificar los resultados.
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:.82rem">
    <thead>
      <tr style="border-bottom:2px solid var(--verde-200);background:var(--verde-50)">
        <th style="text-align:left;padding:8px 10px;color:var(--verde-800);font-size:.78rem">Cuenta de pérdidas y ganancias</th>
        ${labels.map((l,i)=>`<th style="text-align:right;padding:8px 10px;color:${colors[i]};font-size:.78rem;min-width:120px">${l}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr style="background:#f0fdf4"><td colspan="4" style="padding:5px 10px;font-size:.76rem;font-weight:700;color:var(--verde-700)">Ingresos de explotación</td></tr>
      ${filaRes('Importe neto de la cifra de negocios', ventas, 'var(--gris-800)', true)}
      ${totalRes('RESULTADO BRUTO (Ventas)', ventas)}
      <tr style="background:#fee2e2"><td colspan="4" style="padding:5px 10px;font-size:.76rem;font-weight:700;color:#991b1b">Gastos de explotación</td></tr>
      ${filaRes('(-) Coste de ventas (variables)', gv_anuales.map(v=>-v),'#dc2626')}
      ${filaRes('(-) Gastos fijos (personal, alquileres...)', gf_anuales.map(v=>-v),'#dc2626')}
      ${filaRes('(-) Amortizaciones', [-amort,-amort,-amort],'#f59e0b')}
      ${totalRes('EBIT (Resultado de explotación)', ebit)}
      <tr style="background:#fef9ec"><td colspan="4" style="padding:5px 10px;font-size:.76rem;font-weight:700;color:#92400e">Resultado financiero</td></tr>
      ${filaRes('(-) Gastos financieros (intereses)', [-gastoFin,-gastoFin,-gastoFin],'#f59e0b')}
      ${totalRes('BAI (Resultado antes de impuestos)', bai)}
      ${filaRes('(-) Impuesto sobre sociedades (25%)', impSoc.map(v=>-v),'var(--gris-600)')}
      ${totalRes('RESULTADO NETO DEL EJERCICIO', benefNeto, benefNeto[0]>=0?'var(--verde-700)':'#dc2626')}
    </tbody>
    <tfoot>
      <tr style="border-top:2px solid var(--gris-200);background:var(--gris-50)">
        <td style="padding:6px 10px;font-size:.76rem;color:var(--gris-500)">Margen neto s/ventas</td>
        ${margen.map(m=>`<td style="padding:6px 10px;text-align:right;font-size:.78rem;font-weight:700;color:var(--gris-600)">${m}</td>`).join('')}
      </tr>
      <tr style="background:var(--gris-50)">
        <td style="padding:6px 10px;font-size:.76rem;color:var(--gris-500)">EBITDA (EBIT + amortización)</td>
        ${ebitda.map(e=>`<td style="padding:6px 10px;text-align:right;font-size:.78rem;font-weight:700;color:${e>=0?'var(--verde-700)':'#dc2626'}">${fmtE(e)}</td>`).join('')}
      </tr>
    </tfoot>
  </table>`;
}

/* ── Tab 6: Ratios y análisis de viabilidad ──────────────── */
function ap7TabRatios() {
  const ap7   = EMPRESA_STATE.planEmpresa.ap7;
  const ANYOS = [1,2,3];

  const ventas    = ANYOS.map(a=>ap7_ventasAnuales(a));
  const gf_a      = ANYOS.map(()=>ap7_gastosFijosMes()*12);
  const gv_a      = ANYOS.map((_,i)=>ap7_gastosVariablesMes(ventas[i])*12);
  const amort     = ap7.inversion.filter(i=>i.amortizacion>0).reduce((s,i)=>{
    const imp=parseFloat(i.importe)||0; const a=parseInt(i.amortizacion)||1; return s+(imp/a);
  },0);
  const gastoFin  = ap7.financiacion.filter(f=>f.tipo==='Financiación ajena').reduce((s,f)=>s+(parseFloat(f.importe)||0)*(parseFloat(f.interes)||0)/100,0);
  const bai       = ANYOS.map((_,i)=>ventas[i]-gf_a[i]-gv_a[i]-amort-gastoFin);
  const benefNeto = bai.map(b=>b>0?b-b*0.25:b);
  const inv       = ap7_totalInversion();
  const fp        = ap7_fondosPropios();
  const fa        = ap7_deudaTotal();
  const umbral    = ap7_umbral();
  const van       = ap7_VAN(10,3);
  const tir       = ap7_TIR();
  const pr        = ap7_periodoRecuperacion();

  const ratio = (nombre, formula, val, interpretacion, ok) => `
    <tr style="border-bottom:1px solid var(--gris-100)">
      <td style="padding:8px 10px;font-weight:600;color:var(--gris-800);font-size:.82rem">${nombre}</td>
      <td style="padding:8px 10px;color:var(--gris-500);font-size:.76rem;font-family:var(--fuente-mono,monospace)">${formula}</td>
      <td style="padding:8px 10px;text-align:center">
        <span style="font-size:.9rem;font-weight:800;padding:4px 12px;border-radius:20px;
          background:${ok===true?'var(--verde-50)':ok===false?'#fee2e2':'#fef9ec'};
          color:${ok===true?'var(--verde-700)':ok===false?'#dc2626':'#92400e'}">
          ${val}
        </span>
      </td>
      <td style="padding:8px 10px;color:var(--gris-600);font-size:.76rem">${interpretacion}</td>
    </tr>`;

  const ratioEnd   = fa>0&&fp>0 ? (fa/fp).toFixed(2) : '—';
  const ratioSol   = fp>0&&(fa+fp)>0 ? (fp/(fa+fp)*100).toFixed(1)+'%' : '—';
  const rentEco    = inv>0&&benefNeto[0]!==undefined ? (benefNeto[0]/inv*100).toFixed(1)+'%' : '—';
  const rentFin    = fp>0&&benefNeto[0]!==undefined ? (benefNeto[0]/fp*100).toFixed(1)+'%' : '—';
  const margenN    = ventas[0]>0&&benefNeto[0]!==undefined ? (benefNeto[0]/ventas[0]*100).toFixed(1)+'%' : '—';
  const margenEBIT = ventas[0]>0 ? ((ventas[0]-gf_a[0]-gv_a[0])/ventas[0]*100).toFixed(1)+'%' : '—';

  // Gráfico umbral de rentabilidad
  const cf = ap7_gastosFijosMes();
  const pv = ap7_pctVariableTotal()/100;
  const ventasPuntoMuerto = umbral;
  const margenContrib = pv<1 ? (1-pv)*100 : 0;

  return `
  <div style="display:flex;flex-direction:column;gap:1.25rem">

    <!-- Umbral de rentabilidad -->
    <div class="ficha-card">
      <div class="ficha-card-header">
        <span>⚖️</span> Umbral de rentabilidad (Punto muerto)
        <span class="ra-chip" style="margin-left:auto">RA4g</span>
      </div>
      <div class="grid-2col">
        <div>
          <div style="padding:12px;background:var(--verde-50);border:1.5px solid var(--verde-300);border-radius:var(--radio-md);margin-bottom:10px">
            <div style="font-size:.76rem;color:var(--gris-500);margin-bottom:4px">Fórmula:</div>
            <div style="font-size:.9rem;font-family:var(--fuente-mono,monospace);color:var(--gris-800)">
              Umbral = CF ÷ (1 − CV%)
            </div>
            <div style="font-size:.82rem;color:var(--gris-600);margin-top:6px">
              = ${fmtE(cf*12)}/año ÷ (1 − ${(pv*100).toFixed(1)}%)
              = <strong style="color:var(--verde-700);font-size:1rem">${fmtE(umbral*12)}/año</strong>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:.8rem">
            <div style="padding:8px;background:var(--gris-50);border-radius:var(--radio-sm);text-align:center">
              <div style="color:var(--gris-500);font-size:.7rem;margin-bottom:4px">Costes fijos mensuales</div>
              <div style="font-weight:700;color:#dc2626">${fmtE(cf)}</div>
            </div>
            <div style="padding:8px;background:var(--gris-50);border-radius:var(--radio-sm);text-align:center">
              <div style="color:var(--gris-500);font-size:.7rem;margin-bottom:4px">Margen de contribución</div>
              <div style="font-weight:700;color:var(--verde-700)">${margenContrib.toFixed(1)}%</div>
            </div>
            <div style="padding:8px;background:var(--gris-50);border-radius:var(--radio-sm);text-align:center">
              <div style="color:var(--gris-500);font-size:.7rem;margin-bottom:4px">Ventas año 1</div>
              <div style="font-weight:700;color:var(--verde-700)">${fmtE(ventas[0])}</div>
            </div>
            <div style="padding:8px;border-radius:var(--radio-sm);text-align:center;background:${ventas[0]>=umbral*12?'var(--verde-50)':'#fee2e2'};border:1.5px solid ${ventas[0]>=umbral*12?'var(--verde-300)':'#fca5a5'}">
              <div style="color:var(--gris-500);font-size:.7rem;margin-bottom:4px">¿Se supera?</div>
              <div style="font-weight:800;color:${ventas[0]>=umbral*12?'var(--verde-700)':'#dc2626'}">${ventas[0]>=umbral*12?'✓ Sí':'✗ No'}</div>
            </div>
          </div>
        </div>

        <!-- Gráfico visual del umbral -->
        <div>
          <div style="font-size:.75rem;color:var(--gris-500);margin-bottom:8px">Representación gráfica (ventas vs. costes)</div>
          <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-sm);padding:12px;height:200px;position:relative;overflow:hidden">
            ${(() => {
              if (umbral === 0 || ventas[0] === 0) return '<div style="text-align:center;padding-top:70px;color:var(--gris-400);font-size:.82rem">Introduce datos de ventas y gastos para ver el gráfico</div>';
              const maxV   = Math.max(ventas[0]*1.2, umbral*12*1.3);
              const puntos = 10;
              const step   = maxV/puntos;
              const puntosMuerto = ventasPuntoMuerto*12;
              const bars = [];
              for(let i=1;i<=puntos;i++){
                const v = step*i;
                const ingresos = v;
                const costes   = cf*12 + v*pv;
                const pctV     = Math.min(ingresos/maxV*100, 100);
                const pctC     = Math.min(costes/maxV*100, 100);
                const esBenef  = ingresos >= costes;
                bars.push({v,pctV,pctC,esBenef});
              }
              return `
              <div style="display:flex;align-items:flex-end;height:150px;gap:2px;border-bottom:2px solid var(--gris-300)">
                ${bars.map(b=>`
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:1px">
                  <div style="width:100%;background:${b.esBenef?'var(--verde-400)':'#fca5a5'};height:${b.pctV}%;border-radius:2px 2px 0 0;opacity:.85;min-height:2px"></div>
                </div>`).join('')}
              </div>
              <div style="display:flex;justify-content:space-between;font-size:.65rem;color:var(--gris-400);margin-top:4px;padding:0 2px">
                <span>0</span>
                <span style="color:var(--verde-700);font-weight:700">← Umbral: ${fmtE(puntosMuerto)}</span>
                <span>${fmtE(maxV)}</span>
              </div>
              <div style="display:flex;gap:10px;margin-top:8px;font-size:.72rem">
                <span><span style="display:inline-block;width:10px;height:10px;background:var(--verde-400);border-radius:2px;margin-right:3px"></span>Beneficio</span>
                <span><span style="display:inline-block;width:10px;height:10px;background:#fca5a5;border-radius:2px;margin-right:3px"></span>Pérdida</span>
              </div>`;
            })()}
          </div>
        </div>
      </div>
    </div>

    <!-- VAN y TIR -->
    <div class="ficha-card">
      <div class="ficha-card-header">
        <span>📈</span> Análisis de inversión: VAN y TIR
        <span class="ra-chip" style="margin-left:auto">RA4g · RA4h</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:12px">
        ${[
          ['VAN (3 años, tasa 10%)', fmtE(van), van>0, 'VAN > 0 → proyecto viable'],
          ['TIR', tir+'%', tir>10, tir>10?'TIR > coste capital (10%)':'TIR < 10% → revisar'],
          ['Período de recuperación', pr, !pr.includes('>'), 'Tiempo para recuperar la inversión'],
          ['Inversión inicial', fmtE(inv), inv>0, 'Desembolso necesario para arrancar'],
        ].map(([lbl,val,ok,desc])=>`
        <div style="padding:12px;background:${ok?'var(--verde-50)':'#fee2e2'};border:1.5px solid ${ok?'var(--verde-300)':'#fca5a5'};border-radius:var(--radio-md);text-align:center">
          <div style="font-size:.72rem;color:var(--gris-500);margin-bottom:6px">${lbl}</div>
          <div style="font-size:1.1rem;font-weight:800;color:${ok?'var(--verde-700)':'#dc2626'};margin-bottom:4px">${val}</div>
          <div style="font-size:.7rem;color:var(--gris-500)">${desc}</div>
        </div>`).join('')}
      </div>
      <div style="padding:10px 12px;background:var(--gris-50);border-radius:var(--radio-sm);font-size:.78rem;color:var(--gris-600)">
        <strong>Flujos de caja previstos:</strong>
        ${ANYOS.map(a=>`<span style="margin-left:10px">Año ${a}: <strong style="color:${ap7_resultadoAnual(a)>=0?'var(--verde-700)':'#dc2626'}">${fmtE(ap7_resultadoAnual(a))}</strong></span>`).join('')}
      </div>
    </div>

    <!-- Ratios económico-financieros -->
    <div class="ficha-card">
      <div class="ficha-card-header">
        <span>🔬</span> Ratios económico-financieros
        <span class="ra-chip" style="margin-left:auto">RA4d · RA4g</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.82rem">
        <thead>
          <tr style="border-bottom:2px solid var(--verde-200);background:var(--verde-50)">
            <th style="text-align:left;padding:7px 10px;color:var(--verde-800);font-size:.75rem">Ratio</th>
            <th style="text-align:left;padding:7px 10px;color:var(--verde-800);font-size:.75rem">Fórmula</th>
            <th style="text-align:center;padding:7px 10px;color:var(--verde-800);font-size:.75rem;min-width:100px">Valor</th>
            <th style="text-align:left;padding:7px 10px;color:var(--verde-800);font-size:.75rem">Interpretación</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#f0fdf4"><td colspan="4" style="padding:5px 10px;font-size:.76rem;font-weight:700;color:var(--verde-700)">Ratios de estructura financiera</td></tr>
          ${ratio('Ratio de endeudamiento','FA ÷ FP',ratioEnd, parseFloat(ratioEnd)>1.5?'⚠️ Excesiva dependencia ajena. Reducir deuda':'✓ Aceptable (≤ 1,5)', parseFloat(ratioEnd)<=1.5&&ratioEnd!=='—')}
          ${ratio('Ratio de solvencia','FP ÷ (FP+FA)',ratioSol, 'Mayor % fondos propios = más estabilidad financiera', parseFloat(ratioSol)>=40)}
          <tr style="background:#eff6ff"><td colspan="4" style="padding:5px 10px;font-size:.76rem;font-weight:700;color:#1e40af">Ratios de rentabilidad</td></tr>
          ${ratio('Rentabilidad económica (ROA)','Benef. neto ÷ Activo total',rentEco,'Mide la eficiencia de los activos. Aceptable > 5%', parseFloat(rentEco)>=5)}
          ${ratio('Rentabilidad financiera (ROE)','Benef. neto ÷ FP',rentFin,'Rendimiento del capital invertido. Bueno > 10%', parseFloat(rentFin)>=10)}
          ${ratio('Margen neto','Benef. neto ÷ Ventas',margenN,'% de beneficio por cada euro vendido. Bueno > 5%', parseFloat(margenN)>=5)}
          ${ratio('Margen de explotación','EBIT ÷ Ventas',margenEBIT,'Resultado antes de financiación e impuestos', parseFloat(margenEBIT)>=0)}
          <tr style="background:#fef9ec"><td colspan="4" style="padding:5px 10px;font-size:.76rem;font-weight:700;color:#92400e">Análisis de viabilidad</td></tr>
          ${ratio('Umbral de rentabilidad mensual','CF ÷ (1−CV%)', fmtE(umbral), ventas[0]/12>=umbral?'✓ Ventas previstas superan el umbral':'⚠️ Ventas previstas insuficientes en año 1', ventas[0]/12>=umbral)}
          ${ratio('VAN del proyecto','Σ FC/(1+r)^t − I₀', fmtE(van), van>0?'✓ Proyecto económicamente viable (VAN>0)':'✗ Proyecto no rentable a tasa del 10%', van>0)}
          ${ratio('TIR del proyecto','VAN=0 → TIR',tir+'%', tir>10?'✓ TIR > coste del capital (10%)':`${tir>0?'⚠️ TIR < 10% — rentabilidad insuficiente':'✗ TIR negativa — revisar el proyecto'}`, tir>10)}
        </tbody>
      </table>
    </div>

    <!-- Observaciones -->
    <div class="ficha-card">
      <div class="ficha-card-header"><span>📝</span> Observaciones y conclusiones del plan financiero</div>
      <textarea placeholder="Añade aquí tus conclusiones sobre la viabilidad del proyecto: ¿es económicamente viable? ¿qué factores son críticos? ¿qué escenarios presentas?"
        style="width:100%;padding:10px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.84rem;
        font-family:var(--fuente-cuerpo);resize:vertical;min-height:90px;outline:none;line-height:1.6"
        onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
        oninput="EMPRESA_STATE.planEmpresa.ap7.observaciones=this.value"
      >${ap7.observaciones||''}</textarea>
    </div>
  </div>`;
}

