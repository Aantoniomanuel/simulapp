function vistaMensajeria() {
  const ms      = EMPRESA_STATE.mensajeria;
  const esProf  = APP.rolActivo !== 'alumno';
  const filtro  = ms.filtro;
  const correos = filtro === 'todos'
    ? ms.correos
    : ms.correos.filter(c => c.departamento === filtro);
  const noLeidos = ms.correos.filter(c => !c.leido).length;
  const abierto  = ms.correoAbierto;
  const correoSel = abierto ? ms.correos.find(c => c.id === abierto) : null;

  return `
  <!-- Cabecera unificada -->
  <div class="seccion-header">
    <div>
      <h2>📧 Correo y situaciones</h2>
      <p>${esProf ? 'Panel docente · Genera situaciones · Gestiona el buzón de todos los grupos' : 'Buzón de la empresa · Gestiona las situaciones recibidas · ' + noLeidos + ' sin leer'}</p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-ayuda-ctx" data-ayuda="mensajeria" onclick="toggleAyuda('mensajeria')" title="Conceptos y ayuda">❓ Ayuda</button>
      ${esProf ? `
        <button class="btn-secundario" onclick="EMPRESA_STATE.mensajeria.vistaProf='programador';document.getElementById('contenido-principal').innerHTML=vistaMensajeria()">
          📅 Programar
        </button>
        <button class="btn-secundario" onclick="EMPRESA_STATE.mensajeria.vistaProf=EMPRESA_STATE.mensajeria.vistaProf==='generador'?'buzon':'generador';document.getElementById('contenido-principal').innerHTML=vistaMensajeria()">
          ${ms.vistaProf==='generador' ? '📬 Ver buzón' : '⚡ Generar situación'}
        </button>` : ''}
    </div>
  </div>

  <!-- Selector de vista (solo profesor) -->
  ${esProf ? `
  <div style="display:flex;gap:4px;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:4px;margin-bottom:1rem">
    <button class="emp-tab ${ms.vistaProf!=='generador'?'activo':''}"
      onclick="EMPRESA_STATE.mensajeria.vistaProf='buzon';document.getElementById('contenido-principal').innerHTML=vistaMensajeria()">
      📬 Buzón del grupo
    </button>
    <button class="emp-tab ${ms.vistaProf==='generador'?'activo':''}"
      onclick="EMPRESA_STATE.mensajeria.vistaProf='generador';document.getElementById('contenido-principal').innerHTML=vistaMensajeria()">
      ⚡ Generar situación
    </button>
    <button class="emp-tab ${ms.vistaProf==='programador'?'activo':''}"
      onclick="EMPRESA_STATE.mensajeria.vistaProf='programador';document.getElementById('contenido-principal').innerHTML=vistaMensajeria()">
      📅 Programar simulación
    </button>
  </div>
  ${ms.vistaProf==='generador' ? vistaGenerador() : ''}
  ${ms.vistaProf==='programador' ? vistaProgramador() : ''}` : ''}

  <!-- Cuando el profesor está en modo generador, no mostramos el resto -->
  ${esProf && ms.vistaProf==='generador' ? '' : `

  <!-- Filtros por departamento -->
  <div style="display:flex;gap:4px;margin-bottom:1rem;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:4px;overflow-x:auto">
    <button class="emp-tab ${filtro==='todos'?'activo':''}"
      onclick="EMPRESA_STATE.mensajeria.filtro='todos';EMPRESA_STATE.mensajeria.correoAbierto=null;vistaEmpresaRefreshMensajeria()">
      📬 Todos (${ms.correos.length})
    </button>
    ${Object.entries(DEPT_CORREO).map(([key, d]) => {
      const n = ms.correos.filter(c => c.departamento === key).length;
      const nl = ms.correos.filter(c => c.departamento === key && !c.leido).length;
      return `
      <button class="emp-tab ${filtro===key?'activo':''}"
        onclick="EMPRESA_STATE.mensajeria.filtro='${key}';EMPRESA_STATE.mensajeria.correoAbierto=null;vistaEmpresaRefreshMensajeria()">
        ${d.icono} ${d.nombre} (${n})${nl > 0 ? ` <span class="nav-badge" style="margin-left:4px">${nl}</span>` : ''}
      </button>`;
    }).join('')}
  </div>

  <!-- Layout: lista + detalle -->
  <div style="display:grid;grid-template-columns:${correoSel ? '340px 1fr' : '1fr'};gap:1rem;min-height:400px">

    <!-- Lista de correos -->
    <div style="display:flex;flex-direction:column;gap:4px;overflow-y:auto;max-height:70vh">
      ${correos.length === 0
        ? `<div style="text-align:center;padding:3rem;color:var(--gris-400)">
            <div style="font-size:2.5rem;margin-bottom:8px">📭</div>
            <p>No hay correos${filtro !== 'todos' ? ' en ' + DEPT_CORREO[filtro].nombre : ''}.</p>
            <p style="font-size:0.78rem;margin-top:4px">Pulsa "Recibir correos" para generar situaciones.</p>
           </div>`
        : correos.map(c => correoFila(c, c.id === abierto)).join('')
      }
    </div>

    <!-- Detalle del correo seleccionado -->
    ${correoSel ? correoDetalle(correoSel, esProf) : ''}

  </div>`}`;
}

/* ── Fila de correo en la lista ──────────────────────────────── */
function correoFila(c, activo) {
  const dept = DEPT_CORREO[c.departamento] || {};
  const tieneRespuesta = c.hilo.length > 0;
  return `
  <div class="correo-fila ${activo?'correo-fila-activo':''} ${!c.leido?'correo-fila-nuevo':''}"
    onclick="EMPRESA_STATE.mensajeria.correoAbierto='${c.id}';marcarLeido('${c.id}');vistaEmpresaRefreshMensajeria()">
    <div class="correo-fila-dept" style="background:${dept.color||'#666'}">${dept.icono||'📧'}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;justify-content:space-between;gap:4px">
        <div class="correo-fila-de ${!c.leido?'correo-bold':''}">${c.de}</div>
        <div class="correo-fila-hora">${c.hora}</div>
      </div>
      <div class="correo-fila-asunto ${!c.leido?'correo-bold':''}">${c.asunto}</div>
      <div class="correo-fila-preview">${c.cuerpo.substring(0, 80)}...</div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0">
      ${!c.leido ? '<div class="correo-dot-nuevo"></div>' : ''}
      ${tieneRespuesta ? '<span style="font-size:0.6rem;color:var(--verde-600)">✓ Respondido</span>' : ''}
      ${c.calificacion ? `<span style="font-size:0.6rem;font-weight:700;color:var(--verde-700)">${c.calificacion}/10</span>` : ''}
    </div>
  </div>`;
}

/* ── Detalle del correo ──────────────────────────────────────── */
function correoDetalle(c, esProf) {
  const dept = DEPT_CORREO[c.departamento] || {};
  const dificultadMap = { basico:'🟢 Básico', intermedio:'🟡 Intermedio', avanzado:'🔴 Avanzado' };

  return `
  <div class="correo-detalle">
    <!-- Cabecera del correo -->
    <div class="correo-detalle-header">
      <div style="display:flex;align-items:flex-start;gap:12px">
        <div class="correo-avatar" style="background:${dept.color||'#666'}">${dept.icono}</div>
        <div style="flex:1">
          <div style="font-size:0.95rem;font-weight:700;color:var(--gris-900)">${c.asunto}</div>
          <div style="font-size:0.8rem;color:var(--gris-600);margin-top:2px">
            De: <strong>${c.de}</strong> &lt;${c.email}&gt;
          </div>
          <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
            <span style="font-size:0.68rem;padding:2px 8px;border-radius:20px;background:${dept.color||'#666'}22;color:${dept.color||'#666'};font-weight:600">
              ${dept.icono} ${dept.nombre}
            </span>
            <span class="ra-chip">${c.ra}</span>
            <span style="font-size:0.68rem;color:var(--gris-400)">${dificultadMap[c.dificultad]||c.dificultad}</span>
            <span style="font-size:0.68rem;color:var(--gris-400)">${c.fecha} · ${c.hora}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Cuerpo del correo original -->
    <div class="correo-detalle-body">
      <div style="white-space:pre-line;font-size:0.85rem;color:var(--gris-700);line-height:1.7">${c.cuerpo}</div>
    </div>

    <!-- Hilo de conversación -->
    ${c.hilo.length > 0 ? `
    <div class="correo-hilo">
      ${c.hilo.map(h => `
      <div class="hilo-msg ${h.tipo === 'alumno' ? 'hilo-alumno' : h.tipo === 'profesor' ? 'hilo-prof' : 'hilo-ia'}">
        <div class="hilo-meta">
          <span class="hilo-autor">${h.tipo === 'alumno' ? '🏢 ' + h.autor : h.tipo === 'profesor' ? '👩‍🏫 Profesor/a' : '📨 ' + c.de}</span>
          <span class="hilo-fecha">${h.fecha} · ${h.hora}</span>
        </div>
        <div class="hilo-texto">${h.texto}</div>
      </div>`).join('')}
    </div>` : ''}

    <!-- Zona de respuesta del alumno -->
    <div class="correo-responder">
      <div style="font-size:0.72rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">
        ${c.hilo.some(h => h.tipo === 'alumno') ? '↩️ Continuar respuesta' : '✏️ Redactar respuesta'}
      </div>
      <textarea id="resp-${c.id}" class="ficha-input" style="min-height:100px;resize:vertical"
        placeholder="Redacta tu respuesta profesional a este correo..."></textarea>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
        <button class="btn-accion" onclick="enviarRespuestaCorreo('${c.id}')">
          📤 Enviar respuesta
        </button>
      </div>
    </div>

    <!-- Panel del profesor (solo rol profesor) -->
    <!-- Documento adjunto simulado -->
    ${c.documento ? `
    <div style="padding:10px 20px;border-top:1px solid var(--gris-100);background:var(--gris-50)">
      <div style="font-size:.72rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">📎 Documento adjunto</div>
      <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--blanco);border-radius:var(--radio-md);border:1.5px solid var(--verde-300)">
        <span style="font-size:1.4rem">${TIPOS_SITUACION.find(t=>t.id===c.documento.tipo)?.icono||'📄'}</span>
        <div style="flex:1">
          <div style="font-size:.85rem;font-weight:700;color:var(--gris-800)">${c.documento.label}</div>
          <div style="font-size:.75rem;color:var(--verde-700);font-weight:600;margin-top:2px">💻 ${c.documento.software}</div>
        </div>
        <button class="btn-accion" style="font-size:.78rem;padding:6px 14px;flex-shrink:0"
          onclick="verDocumentoAdjunto('${c.id}')">
          👁️ Ver adjunto
        </button>
      </div>
    </div>` : ''}

    ${esProf ? `
    <div class="correo-panel-prof">
      <div style="font-size:0.72rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">
        👩‍🏫 Panel del docente
      </div>
      <div style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px">
        <div style="flex:1">
          <label style="font-size:0.72rem;font-weight:600;color:var(--gris-500);display:block;margin-bottom:3px">Anotación</label>
          <textarea id="anot-prof-${c.id}" class="ficha-input" style="min-height:50px;resize:vertical;font-size:0.82rem"
            placeholder="Anotación sobre la respuesta del alumno...">${c.anotacionProf||''}</textarea>
        </div>
        <button class="btn-accion" style="padding:7px 12px;font-size:0.78rem;flex-shrink:0"
          onclick="anotarCorreoProf('${c.id}')">💬 Guardar</button>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <label style="font-size:0.72rem;font-weight:600;color:var(--gris-500)">Calificación:</label>
        <div style="display:flex;gap:3px">
          ${[1,2,3,4,5,6,7,8,9,10].map(n => `
          <button style="width:26px;height:26px;border-radius:50%;border:1.5px solid ${c.calificacion===n?'var(--verde-500)':'var(--gris-200)'};
            background:${c.calificacion===n?'var(--verde-500)':'var(--blanco)'};
            color:${c.calificacion===n?'white':'var(--gris-600)'};
            font-size:0.7rem;font-weight:700;cursor:pointer;transition:all .15s"
            onclick="calificarCorreo('${c.id}',${n});vistaEmpresaRefreshMensajeria()">${n}</button>`).join('')}
        </div>
        ${c.calificacion ? `<span style="font-size:0.82rem;font-weight:700;color:var(--verde-700)">${c.calificacion}/10</span>` : ''}
      </div>
    </div>` : ''}

    ${c.anotacionProf && !esProf ? `
    <div style="margin-top:12px;padding:10px 14px;background:#fffbeb;border-radius:var(--radio-md);border-left:3px solid #f59e0b">
      <div style="font-size:0.68rem;font-weight:700;color:#92400e;text-transform:uppercase;margin-bottom:4px">💬 Comentario del docente</div>
      <div style="font-size:0.82rem;color:#78350f">${c.anotacionProf}</div>
      ${c.calificacion ? `<div style="margin-top:6px;font-weight:700;color:var(--verde-700)">Calificación: ${c.calificacion}/10</div>` : ''}
    </div>` : ''}

  </div>`;
}


/* ============================================================
   MÓDULO RRHH — DEPARTAMENTO COMPLETO
   Nóminas, contratos, plantilla, calendario laboral
   ============================================================ */

/* ── Convenio base (modificable por el profesor) ──────────── */
const CONVENIO_BASE = {
  nombre: 'Convenio Colectivo de Comercio de la Provincia de Sevilla',
  año: 2025,
  categorias: [
    { id:'cat1', nombre:'Jefe/a de departamento',   grupo:'1', salarioBase:1650, plusConvenio:120, plusTransporte:60 },
    { id:'cat2', nombre:'Técnico/a administrativo',  grupo:'2', salarioBase:1450, plusConvenio:100, plusTransporte:60 },
    { id:'cat3', nombre:'Oficial administrativo/a',   grupo:'3', salarioBase:1300, plusConvenio:80,  plusTransporte:60 },
    { id:'cat4', nombre:'Auxiliar administrativo/a',  grupo:'4', salarioBase:1134, plusConvenio:60,  plusTransporte:60 },
    { id:'cat5', nombre:'Comercial / Vendedor/a',     grupo:'5', salarioBase:1200, plusConvenio:70,  plusTransporte:60 },
    { id:'cat6', nombre:'Mozo/a de almacén',          grupo:'6', salarioBase:1134, plusConvenio:50,  plusTransporte:60 },
    { id:'cat7', nombre:'Personal de limpieza',       grupo:'7', salarioBase:1080, plusConvenio:40,  plusTransporte:45 },
  ],
  pagasExtra: 2,         // Junio y Diciembre
  jornadaAnual: 1764,    // horas/año
  jornadaSemanal: 40,    // horas/semana
  vacaciones: 30,        // días naturales
  // Tipos cotización S.S. 2025 (%)
  ss: {
    // Empresa
    contingenciasComunes_emp:   23.60,
    desempleo_emp_indef:        5.50,
    desempleo_emp_temporal:     6.70,
    fogasa_emp:                 0.20,
    fp_emp:                     0.60,
    mei_emp:                    0.58,
    accidentesTrabajo_emp:      1.50,  // promedio sector comercio
    // Trabajador
    contingenciasComunes_trab:  4.70,
    desempleo_trab_indef:       1.55,
    desempleo_trab_temporal:    1.60,
    fp_trab:                    0.10,
    mei_trab:                   0.12,
  },
  // Bases cotización 2025
  baseMinima: 1323.00,
  baseMaxima: 4720.50,
  // Tablas IRPF simplificadas 2025 (tramos anuales)
  irpf: [
    { hasta:12450,  tipo:19 },
    { hasta:20200,  tipo:24 },
    { hasta:35200,  tipo:30 },
    { hasta:60000,  tipo:37 },
    { hasta:300000, tipo:45 },
    { hasta:Infinity, tipo:47 },
  ],
};

/* ── Estado RRHH ──────────────────────────────────────────── */
if (!EMPRESA_STATE.rrhh) {
  EMPRESA_STATE.rrhh = {
    plantilla: [],   // { id, nombre, dni, fechaAlta, categoria, tipoContrato, jornada, horasSemanales, situacion, observaciones }
    nominas: [],     // { id, empleadoId, mes, año, desglose:{...}, generada:true }
    incidencias: [], // { id, empleadoId, tipo, fechaInicio, fechaFin, descripcion }
    convenio: JSON.parse(JSON.stringify(CONVENIO_BASE)),
    vistaRRHH: 'panel',  // panel | plantilla | empleado-detalle | nomina-calc | contratos | calendario | convenio
    empleadoSeleccionado: null,
    nominaMes: new Date().getMonth() + 1,
    nominaAño: new Date().getFullYear(),
  };
}

/* ── Helpers de cálculo de nómina ─────────────────────────── */
function rrhhCalcNomina(empleado) {
  const conv = EMPRESA_STATE.rrhh.convenio;
  const cat  = conv.categorias.find(c => c.id === empleado.categoria);
  if (!cat) return null;

  const salarioBase   = cat.salarioBase;
  const plusConvenio   = cat.plusConvenio;
  const plusTransporte = cat.plusTransporte;

  // Prorrateo pagas extra (si se prorratean)
  const prorrateoPagas = (salarioBase * conv.pagasExtra) / 12;

  // Total devengos
  const totalDevengos = salarioBase + plusConvenio + plusTransporte + prorrateoPagas;

  // Base de cotización S.S. (excluye plus transporte si < 20% salario base)
  let baseCotizacion = salarioBase + plusConvenio + prorrateoPagas;
  // Ajustar a mínimos y máximos
  baseCotizacion = Math.max(conv.baseMinima, Math.min(conv.baseMaxima, baseCotizacion));

  // Base cotización AT y horas extra
  const baseCotizacionAT = baseCotizacion;

  const esTemporal = empleado.tipoContrato === 'temporal' || empleado.tipoContrato === 'practicas';

  // ── Deducciones trabajador ──
  const ccTrab    = baseCotizacion * (conv.ss.contingenciasComunes_trab / 100);
  const desTrab   = baseCotizacion * ((esTemporal ? conv.ss.desempleo_trab_temporal : conv.ss.desempleo_trab_indef) / 100);
  const fpTrab    = baseCotizacion * (conv.ss.fp_trab / 100);
  const meiTrab   = baseCotizacion * (conv.ss.mei_trab / 100);
  const totalSSTrab = ccTrab + desTrab + fpTrab + meiTrab;

  // ── Retención IRPF ──
  const baseAnualIRPF = totalDevengos * 12;
  let irpfAnual = 0;
  let restante = baseAnualIRPF;
  let prevHasta = 0;
  for (const tramo of conv.irpf) {
    const base = Math.min(restante, tramo.hasta - prevHasta);
    if (base <= 0) break;
    irpfAnual += base * (tramo.tipo / 100);
    restante -= base;
    prevHasta = tramo.hasta;
  }
  const irpfMensual = irpfAnual / 12;
  const tipoIRPF    = baseAnualIRPF > 0 ? ((irpfAnual / baseAnualIRPF) * 100) : 0;

  // ── Total deducciones ──
  const totalDeducciones = totalSSTrab + irpfMensual;

  // ── Líquido a percibir ──
  const liquido = totalDevengos - totalDeducciones;

  // ── Coste empresa ──
  const ccEmp     = baseCotizacion * (conv.ss.contingenciasComunes_emp / 100);
  const desEmp    = baseCotizacion * ((esTemporal ? conv.ss.desempleo_emp_temporal : conv.ss.desempleo_emp_indef) / 100);
  const fogasaEmp = baseCotizacion * (conv.ss.fogasa_emp / 100);
  const fpEmp     = baseCotizacion * (conv.ss.fp_emp / 100);
  const meiEmp    = baseCotizacion * (conv.ss.mei_emp / 100);
  const atEmp     = baseCotizacionAT * (conv.ss.accidentesTrabajo_emp / 100);
  const totalSSEmp = ccEmp + desEmp + fogasaEmp + fpEmp + meiEmp + atEmp;
  const costeTotal = totalDevengos + totalSSEmp;

  return {
    empleado, categoria: cat,
    // Devengos
    salarioBase, plusConvenio, plusTransporte, prorrateoPagas,
    totalDevengos,
    // Bases
    baseCotizacion, baseCotizacionAT,
    // Deducciones trabajador
    ccTrab, desTrab, fpTrab, meiTrab, totalSSTrab,
    tipoIRPF: tipoIRPF.toFixed(2),
    irpfMensual,
    totalDeducciones,
    // Líquido
    liquido,
    // Coste empresa
    ccEmp, desEmp, fogasaEmp, fpEmp, meiEmp, atEmp, totalSSEmp,
    costeTotal,
  };
}

function rrhhFormatNum(n) {
  return (n || 0).toFixed(2).replace('.', ',');
}

/* ── CRUD Plantilla ───────────────────────────────────────── */
function rrhhAgregarEmpleado() {
  EMPRESA_STATE.rrhh.plantilla.push({
    id: 'emp-' + Date.now(),
    nombre: '', dni: '', fechaAlta: '', categoria: 'cat4',
    tipoContrato: 'indefinido', jornada: 'completa', horasSemanales: 40,
    situacion: 'activo', observaciones: '',
  });
  EMPRESA_STATE.rrhh.vistaRRHH = 'plantilla';
  renderRRHH();
}

function rrhhEliminarEmpleado(id) {
  EMPRESA_STATE.rrhh.plantilla = EMPRESA_STATE.rrhh.plantilla.filter(e => e.id !== id);
  renderRRHH();
}

function rrhhActEmpleado(id, campo, valor) {
  const e = EMPRESA_STATE.rrhh.plantilla.find(e => e.id === id);
  if (e) e[campo] = valor;
}

function rrhhVerEmpleado(id) {
  EMPRESA_STATE.rrhh.empleadoSeleccionado = id;
  EMPRESA_STATE.rrhh.vistaRRHH = 'empleado-detalle';
  renderRRHH();
}

function rrhhGenerarNomina(empleadoId) {
  const emp = EMPRESA_STATE.rrhh.plantilla.find(e => e.id === empleadoId);
  if (!emp) return;
  EMPRESA_STATE.rrhh.empleadoSeleccionado = empleadoId;
  EMPRESA_STATE.rrhh.vistaRRHH = 'nomina-calc';
  renderRRHH();
}

function rrhhGuardarNomina(empleadoId) {
  const emp = EMPRESA_STATE.rrhh.plantilla.find(e => e.id === empleadoId);
  if (!emp) return;
  const desglose = rrhhCalcNomina(emp);
  const rrhh = EMPRESA_STATE.rrhh;
  rrhh.nominas.push({
    id: 'nom-' + Date.now(),
    empleadoId: empleadoId,
    mes: rrhh.nominaMes,
    año: rrhh.nominaAño,
    desglose: desglose,
    generada: true,
  });
  mostrarToast('✓ Nómina generada para ' + emp.nombre, 'exito');
  EMPRESA_STATE.rrhh.vistaRRHH = 'panel';
  renderRRHH();
}

function rrhhAgregarIncidencia(empleadoId) {
  const tipo = prompt('Tipo de incidencia: baja-medica, vacaciones, permiso, ausencia');
  if (!tipo) return;
  const desc = prompt('Descripción:');
  EMPRESA_STATE.rrhh.incidencias.push({
    id: 'inc-' + Date.now(),
    empleadoId, tipo: tipo, fechaInicio: new Date().toISOString().slice(0,10),
    fechaFin: '', descripcion: desc || '',
  });
  mostrarToast('✓ Incidencia registrada', 'exito');
  renderRRHH();
}

function renderRRHH() {
  if (APP.moduloActual === 'gestion' && EMPRESA_STATE.gestion.deptSeleccionado === 'rrhh') {
    document.getElementById('contenido-principal').innerHTML = vistaGestion();
  }
}



/* ============================================================
   VISTAS RRHH
   ============================================================ */

function vistaRRHHCompleta() {
  const rrhh   = EMPRESA_STATE.rrhh;
  const vista  = rrhh.vistaRRHH;
  const esProf = APP.rolActivo !== 'alumno';

  if (vista === 'plantilla')        return vistaPlantilla();
  if (vista === 'empleado-detalle') return vistaEmpleadoDetalle();
  if (vista === 'nomina-calc')      return vistaNominaCalc();
  if (vista === 'convenio')         return vistaConvenio();
  return vistaRRHHPanel();
}

/* ── Panel principal RRHH ─────────────────────────────────── */
function vistaRRHHPanel() {
  const rrhh = EMPRESA_STATE.rrhh;
  const pl   = rrhh.plantilla;
  const activos  = pl.filter(e => e.situacion === 'activo').length;
  const nomMes   = rrhh.nominas.filter(n => n.mes === rrhh.nominaMes).length;
  const incAbiertas = rrhh.incidencias.filter(i => !i.fechaFin).length;
  const costeMensual = pl.filter(e => e.situacion === 'activo').reduce((s, e) => {
    const n = rrhhCalcNomina(e);
    return s + (n ? n.costeTotal : 0);
  }, 0);

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1.1rem;font-weight:700;color:var(--gris-800)">👥 Departamento de RRHH</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">Gestión de personal, nóminas, contratos e incidencias <span class="ra-chip" style="margin-left:4px">RA6c</span></p>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaRRHH='convenio';renderRRHH()">📖 Convenio</button>
      <button class="btn-accion" onclick="rrhhAgregarEmpleado()">+ Nuevo empleado</button>
    </div>
  </div>

  <!-- KPIs -->
  <div class="metricas-grid" style="margin-bottom:1rem">
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">👥</div></div>
      <div class="metrica-valor">${activos}</div>
      <div class="metrica-etiq">Empleados activos</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono azul">💶</div></div>
      <div class="metrica-valor">${rrhhFormatNum(costeMensual)} €</div>
      <div class="metrica-etiq">Coste mensual total</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono nar">📄</div></div>
      <div class="metrica-valor">${nomMes}</div>
      <div class="metrica-etiq">Nóminas generadas (mes ${rrhh.nominaMes})</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono rojo">⚠️</div></div>
      <div class="metrica-valor">${incAbiertas}</div>
      <div class="metrica-etiq">Incidencias abiertas</div>
    </div>
  </div>

  <!-- Plantilla -->
  <div class="ficha-card" style="margin-bottom:1rem">
    <div class="ficha-card-header">
      <span>📋</span> Plantilla de la empresa
      <button class="btn-secundario" style="margin-left:auto;font-size:.75rem;padding:4px 10px"
        onclick="EMPRESA_STATE.rrhh.vistaRRHH='plantilla';renderRRHH()">✏️ Gestionar</button>
    </div>
    ${pl.length === 0
      ? `<div style="text-align:center;padding:2rem;color:var(--gris-400)">
          <div style="font-size:2rem;margin-bottom:8px">👤</div>
          <p>No hay empleados en plantilla. Añade el primer empleado para empezar.</p>
          <button class="btn-accion" style="margin-top:10px" onclick="rrhhAgregarEmpleado()">+ Añadir empleado</button>
         </div>`
      : `<table style="width:100%;border-collapse:collapse;font-size:.82rem">
          <thead><tr style="border-bottom:2px solid var(--verde-200)">
            <th style="text-align:left;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Empleado</th>
            <th style="text-align:left;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Categoría</th>
            <th style="text-align:left;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Contrato</th>
            <th style="text-align:right;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Salario bruto</th>
            <th style="text-align:right;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Coste empresa</th>
            <th style="text-align:center;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Estado</th>
            <th style="width:100px"></th>
          </tr></thead>
          <tbody>
            ${pl.map(e => {
              const cat = rrhh.convenio.categorias.find(c => c.id === e.categoria);
              const nom = rrhhCalcNomina(e);
              return `
              <tr style="border-bottom:1px solid var(--gris-50);cursor:pointer" onclick="rrhhVerEmpleado('${e.id}')"
                onmouseover="this.style.background='var(--verde-50)'" onmouseout="this.style.background=''">
                <td style="padding:8px">
                  <div style="font-weight:600;color:var(--gris-800)">${e.nombre || '(sin nombre)'}</div>
                  <div style="font-size:.72rem;color:var(--gris-400)">${e.dni || '—'}</div>
                </td>
                <td style="padding:8px">${cat ? cat.nombre : '—'}</td>
                <td style="padding:8px">${{indefinido:'Indefinido',temporal:'Temporal',practicas:'Prácticas',formacion:'Formación',mercantil:'Mercantil'}[e.tipoContrato]||e.tipoContrato}</td>
                <td style="padding:8px;text-align:right;font-weight:600">${nom ? rrhhFormatNum(nom.totalDevengos) : '—'} €</td>
                <td style="padding:8px;text-align:right;font-weight:600;color:var(--verde-700)">${nom ? rrhhFormatNum(nom.costeTotal) : '—'} €</td>
                <td style="padding:8px;text-align:center">
                  <span class="estado ${e.situacion==='activo'?'activo':'bloqueado'}">${e.situacion==='activo'?'Activo':'Baja'}</span>
                </td>
                <td style="padding:8px;text-align:right">
                  <button class="btn-secundario" style="padding:3px 8px;font-size:.72rem"
                    onclick="event.stopPropagation();rrhhGenerarNomina('${e.id}')">🧾 Nómina</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`
    }
  </div>

  ${/* Incidencias abiertas */
  rrhh.incidencias.filter(i => !i.fechaFin).length > 0 ? `
  <div class="ficha-card">
    <div class="ficha-card-header"><span>⚠️</span> Incidencias abiertas</div>
    ${rrhh.incidencias.filter(i => !i.fechaFin).map(i => {
      const emp = rrhh.plantilla.find(e => e.id === i.empleadoId);
      return `
      <div style="display:flex;align-items:center;gap:10px;padding:8px;border-bottom:1px solid var(--gris-50)">
        <span style="font-size:1rem">${{
          'baja-medica':'🏥','vacaciones':'🏖️','permiso':'📋','ausencia':'⚠️'
        }[i.tipo]||'📌'}</span>
        <div style="flex:1">
          <div style="font-size:.82rem;font-weight:600;color:var(--gris-800)">${emp?emp.nombre:'—'} — ${i.tipo}</div>
          <div style="font-size:.72rem;color:var(--gris-500)">Desde ${i.fechaInicio} · ${i.descripcion}</div>
        </div>
      </div>`;
    }).join('')}
  </div>` : ''}`;
}

/* ── Vista Plantilla (edición) ────────────────────────────── */
function vistaPlantilla() {
  const rrhh = EMPRESA_STATE.rrhh;
  const cats = rrhh.convenio.categorias;

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">📋 Gestión de plantilla</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">Alta, baja y modificación de empleados</p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-accion" onclick="rrhhAgregarEmpleado()">+ Nuevo empleado</button>
      <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaRRHH='panel';renderRRHH()">← Volver</button>
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:8px">
    ${rrhh.plantilla.map((e, idx) => `
    <div class="ficha-card">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <div class="socio-num">${idx+1}</div>
        <span style="font-size:.9rem;font-weight:600;color:var(--gris-800)">${e.nombre||'Nuevo empleado'}</span>
        <div style="flex:1"></div>
        <button class="btn-eliminar-socio" onclick="rrhhEliminarEmpleado('${e.id}')">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        <div class="ficha-campo">
          <label>Nombre completo</label>
          <input type="text" class="ficha-input" value="${e.nombre}" placeholder="Nombre y apellidos"
            oninput="rrhhActEmpleado('${e.id}','nombre',this.value)">
        </div>
        <div class="ficha-campo">
          <label>DNI/NIE</label>
          <input type="text" class="ficha-input" value="${e.dni}" placeholder="12345678A"
            oninput="rrhhActEmpleado('${e.id}','dni',this.value)">
        </div>
        <div class="ficha-campo">
          <label>Fecha de alta</label>
          <input type="date" class="ficha-input" value="${e.fechaAlta}"
            oninput="rrhhActEmpleado('${e.id}','fechaAlta',this.value)">
        </div>
        <div class="ficha-campo">
          <label>Categoría profesional</label>
          <select class="ficha-input" onchange="rrhhActEmpleado('${e.id}','categoria',this.value)">
            ${cats.map(c => `<option value="${c.id}" ${e.categoria===c.id?'selected':''}>${c.nombre} (${c.salarioBase} €)</option>`).join('')}
          </select>
        </div>
        <div class="ficha-campo">
          <label>Tipo de contrato</label>
          <select class="ficha-input" onchange="rrhhActEmpleado('${e.id}','tipoContrato',this.value)">
            <option value="indefinido" ${e.tipoContrato==='indefinido'?'selected':''}>Indefinido</option>
            <option value="temporal"   ${e.tipoContrato==='temporal'  ?'selected':''}>Temporal</option>
            <option value="practicas"  ${e.tipoContrato==='practicas' ?'selected':''}>Prácticas</option>
            <option value="formacion"  ${e.tipoContrato==='formacion' ?'selected':''}>Formación y aprendizaje</option>
            <option value="mercantil"  ${e.tipoContrato==='mercantil' ?'selected':''}>Mercantil (socio)</option>
          </select>
        </div>
        <div class="ficha-campo">
          <label>Jornada</label>
          <select class="ficha-input" onchange="rrhhActEmpleado('${e.id}','jornada',this.value)">
            <option value="completa" ${e.jornada==='completa'?'selected':''}>Completa</option>
            <option value="parcial"  ${e.jornada==='parcial' ?'selected':''}>Parcial</option>
          </select>
        </div>
        <div class="ficha-campo">
          <label>Horas/semana</label>
          <input type="number" class="ficha-input" value="${e.horasSemanales}" min="1" max="40"
            oninput="rrhhActEmpleado('${e.id}','horasSemanales',parseInt(this.value))">
        </div>
        <div class="ficha-campo">
          <label>Situación</label>
          <select class="ficha-input" onchange="rrhhActEmpleado('${e.id}','situacion',this.value)">
            <option value="activo" ${e.situacion==='activo'?'selected':''}>Activo</option>
            <option value="baja"   ${e.situacion==='baja'  ?'selected':''}>Baja</option>
          </select>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

/* ── Vista Nómina con desglose completo ───────────────────── */
function vistaNominaCalc() {
  const rrhh = EMPRESA_STATE.rrhh;
  const emp  = rrhh.plantilla.find(e => e.id === rrhh.empleadoSeleccionado);
  if (!emp) return '<p>Empleado no encontrado</p>';
  const n = rrhhCalcNomina(emp);
  if (!n) return '<p>No se pudo calcular la nómina</p>';
  const f = rrhhFormatNum;
  const MESES = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">🧾 Nómina de ${emp.nombre}</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">${MESES[rrhh.nominaMes]} ${rrhh.nominaAño} · ${n.categoria.nombre}</p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-accion" onclick="rrhhGuardarNomina('${emp.id}')">💾 Guardar nómina</button>
      <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaRRHH='panel';renderRRHH()">← Volver</button>
    </div>
  </div>

  <!-- Nómina formato oficial -->
  <div class="ficha-card" style="font-size:.82rem;max-width:800px">
    <!-- Cabecera empresa + trabajador -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding-bottom:12px;border-bottom:2px solid var(--verde-500);margin-bottom:12px">
      <div>
        <div style="font-size:.68rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Datos de la empresa</div>
        <div style="font-weight:600;color:var(--gris-800)">${EMPRESA_STATE.datos.nombre || 'SimulApp S.L.'}</div>
        <div style="font-size:.75rem;color:var(--gris-500)">CIF: ${EMPRESA_STATE.datos.cifProvisional || '—'}</div>
        <div style="font-size:.75rem;color:var(--gris-500)">${EMPRESA_STATE.datos.domicilioSocial || '—'}</div>
      </div>
      <div>
        <div style="font-size:.68rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Datos del trabajador</div>
        <div style="font-weight:600;color:var(--gris-800)">${emp.nombre}</div>
        <div style="font-size:.75rem;color:var(--gris-500)">DNI: ${emp.dni || '—'} · Alta: ${emp.fechaAlta || '—'}</div>
        <div style="font-size:.75rem;color:var(--gris-500)">Cat.: ${n.categoria.nombre} · Grupo: ${n.categoria.grupo}</div>
      </div>
    </div>

    <!-- DEVENGOS -->
    <div style="font-size:.72rem;font-weight:700;color:var(--verde-800);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;background:var(--verde-100);padding:6px 10px;border-radius:var(--radio-sm)">
      I. Devengos
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <thead><tr style="border-bottom:1px solid var(--gris-200)">
        <th style="text-align:left;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Concepto</th>
        <th style="text-align:right;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Importe (€)</th>
      </tr></thead>
      <tbody>
        <tr><td style="padding:4px 8px">Salario base</td><td style="padding:4px 8px;text-align:right;font-weight:600">${f(n.salarioBase)}</td></tr>
        <tr style="background:var(--gris-50)"><td style="padding:4px 8px">Plus convenio</td><td style="padding:4px 8px;text-align:right">${f(n.plusConvenio)}</td></tr>
        <tr><td style="padding:4px 8px">Plus transporte</td><td style="padding:4px 8px;text-align:right">${f(n.plusTransporte)}</td></tr>
        <tr style="background:var(--gris-50)"><td style="padding:4px 8px">Prorrateo pagas extras (${EMPRESA_STATE.rrhh.convenio.pagasExtra} pagas)</td><td style="padding:4px 8px;text-align:right">${f(n.prorrateoPagas)}</td></tr>
        <tr style="border-top:2px solid var(--verde-300)"><td style="padding:6px 8px;font-weight:700;color:var(--verde-800)">TOTAL DEVENGOS</td><td style="padding:6px 8px;text-align:right;font-weight:700;color:var(--verde-800);font-size:.9rem">${f(n.totalDevengos)}</td></tr>
      </tbody>
    </table>

    <!-- DEDUCCIONES -->
    <div style="font-size:.72rem;font-weight:700;color:#991b1b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;background:#fee2e2;padding:6px 10px;border-radius:var(--radio-sm)">
      II. Deducciones del trabajador
    </div>
    <div style="font-size:.72rem;color:var(--gris-500);margin-bottom:8px">
      Base de cotización S.S.: <strong>${f(n.baseCotizacion)} €</strong>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <thead><tr style="border-bottom:1px solid var(--gris-200)">
        <th style="text-align:left;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Concepto</th>
        <th style="text-align:center;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Base (€)</th>
        <th style="text-align:center;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Tipo (%)</th>
        <th style="text-align:right;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Importe (€)</th>
      </tr></thead>
      <tbody>
        <tr><td style="padding:4px 8px">Contingencias comunes</td><td style="padding:4px 8px;text-align:center">${f(n.baseCotizacion)}</td><td style="padding:4px 8px;text-align:center">${EMPRESA_STATE.rrhh.convenio.ss.contingenciasComunes_trab}%</td><td style="padding:4px 8px;text-align:right">${f(n.ccTrab)}</td></tr>
        <tr style="background:var(--gris-50)"><td style="padding:4px 8px">Desempleo</td><td style="padding:4px 8px;text-align:center">${f(n.baseCotizacion)}</td><td style="padding:4px 8px;text-align:center">${emp.tipoContrato==='temporal'||emp.tipoContrato==='practicas'?EMPRESA_STATE.rrhh.convenio.ss.desempleo_trab_temporal:EMPRESA_STATE.rrhh.convenio.ss.desempleo_trab_indef}%</td><td style="padding:4px 8px;text-align:right">${f(n.desTrab)}</td></tr>
        <tr><td style="padding:4px 8px">Formación profesional</td><td style="padding:4px 8px;text-align:center">${f(n.baseCotizacion)}</td><td style="padding:4px 8px;text-align:center">${EMPRESA_STATE.rrhh.convenio.ss.fp_trab}%</td><td style="padding:4px 8px;text-align:right">${f(n.fpTrab)}</td></tr>
        <tr style="background:var(--gris-50)"><td style="padding:4px 8px">MEI (Mecanismo Equidad Intergeneracional)</td><td style="padding:4px 8px;text-align:center">${f(n.baseCotizacion)}</td><td style="padding:4px 8px;text-align:center">${EMPRESA_STATE.rrhh.convenio.ss.mei_trab}%</td><td style="padding:4px 8px;text-align:right">${f(n.meiTrab)}</td></tr>
        <tr style="border-top:1px solid var(--gris-200)"><td style="padding:6px 8px;font-weight:600" colspan="3">Total cotización S.S. trabajador</td><td style="padding:6px 8px;text-align:right;font-weight:600">${f(n.totalSSTrab)}</td></tr>
        <tr style="background:#fef9ec"><td style="padding:4px 8px">Retención IRPF</td><td style="padding:4px 8px;text-align:center">${f(n.totalDevengos)}</td><td style="padding:4px 8px;text-align:center">${n.tipoIRPF}%</td><td style="padding:4px 8px;text-align:right">${f(n.irpfMensual)}</td></tr>
        <tr style="border-top:2px solid #ef4444"><td style="padding:6px 8px;font-weight:700;color:#991b1b">TOTAL DEDUCCIONES</td><td colspan="2"></td><td style="padding:6px 8px;text-align:right;font-weight:700;color:#991b1b;font-size:.9rem">${f(n.totalDeducciones)}</td></tr>
      </tbody>
    </table>

    <!-- LÍQUIDO -->
    <div style="padding:14px;background:var(--verde-50);border:2px solid var(--verde-400);border-radius:var(--radio-md);display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:1rem;font-weight:700;color:var(--verde-900)">LÍQUIDO A PERCIBIR</div>
      <div style="font-size:1.4rem;font-weight:800;color:var(--verde-800)">${f(n.liquido)} €</div>
    </div>

    <!-- COSTE EMPRESA -->
    <div style="font-size:.72rem;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;background:#dbeafe;padding:6px 10px;border-radius:var(--radio-sm)">
      III. Coste para la empresa (no aparece en la nómina del trabajador)
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
      <thead><tr style="border-bottom:1px solid var(--gris-200)">
        <th style="text-align:left;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Concepto empresa</th>
        <th style="text-align:center;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Tipo (%)</th>
        <th style="text-align:right;padding:4px 8px;font-size:.7rem;color:var(--gris-500)">Importe (€)</th>
      </tr></thead>
      <tbody>
        <tr><td style="padding:4px 8px">Contingencias comunes empresa</td><td style="padding:4px 8px;text-align:center">${EMPRESA_STATE.rrhh.convenio.ss.contingenciasComunes_emp}%</td><td style="padding:4px 8px;text-align:right">${f(n.ccEmp)}</td></tr>
        <tr style="background:var(--gris-50)"><td style="padding:4px 8px">Desempleo empresa</td><td style="padding:4px 8px;text-align:center">${emp.tipoContrato==='temporal'||emp.tipoContrato==='practicas'?EMPRESA_STATE.rrhh.convenio.ss.desempleo_emp_temporal:EMPRESA_STATE.rrhh.convenio.ss.desempleo_emp_indef}%</td><td style="padding:4px 8px;text-align:right">${f(n.desEmp)}</td></tr>
        <tr><td style="padding:4px 8px">FOGASA</td><td style="padding:4px 8px;text-align:center">${EMPRESA_STATE.rrhh.convenio.ss.fogasa_emp}%</td><td style="padding:4px 8px;text-align:right">${f(n.fogasaEmp)}</td></tr>
        <tr style="background:var(--gris-50)"><td style="padding:4px 8px">Formación profesional empresa</td><td style="padding:4px 8px;text-align:center">${EMPRESA_STATE.rrhh.convenio.ss.fp_emp}%</td><td style="padding:4px 8px;text-align:right">${f(n.fpEmp)}</td></tr>
        <tr><td style="padding:4px 8px">MEI empresa</td><td style="padding:4px 8px;text-align:center">${EMPRESA_STATE.rrhh.convenio.ss.mei_emp}%</td><td style="padding:4px 8px;text-align:right">${f(n.meiEmp)}</td></tr>
        <tr style="background:var(--gris-50)"><td style="padding:4px 8px">Accidentes de trabajo y EP</td><td style="padding:4px 8px;text-align:center">${EMPRESA_STATE.rrhh.convenio.ss.accidentesTrabajo_emp}%</td><td style="padding:4px 8px;text-align:right">${f(n.atEmp)}</td></tr>
        <tr style="border-top:1px solid #93c5fd"><td style="padding:6px 8px;font-weight:600;color:#1e40af">Total S.S. empresa</td><td></td><td style="padding:6px 8px;text-align:right;font-weight:600;color:#1e40af">${f(n.totalSSEmp)}</td></tr>
        <tr style="border-top:2px solid #1e40af;background:#eff6ff"><td style="padding:8px;font-weight:700;color:#1e3a5f;font-size:.9rem">COSTE TOTAL EMPRESA</td><td></td><td style="padding:8px;text-align:right;font-weight:800;color:#1e3a5f;font-size:1rem">${f(n.costeTotal)} €</td></tr>
      </tbody>
    </table>

    <div style="font-size:.75rem;color:var(--gris-400);line-height:1.5;padding:8px 0;border-top:1px solid var(--gris-100)">
      💡 El <strong>coste real</strong> para la empresa de este empleado es de <strong>${f(n.costeTotal)} €/mes</strong>, 
      que incluye los ${f(n.totalDevengos)} € de salario bruto más los ${f(n.totalSSEmp)} € de cotizaciones a cargo de la empresa.
      El trabajador percibe ${f(n.liquido)} € netos tras las deducciones de S.S. (${f(n.totalSSTrab)} €) e IRPF (${f(n.irpfMensual)} €).
    </div>
  </div>`;
}

/* ── Vista Convenio (editable por profesor) ───────────────── */
function vistaConvenio() {
  const conv = EMPRESA_STATE.rrhh.convenio;
  const esProf = APP.rolActivo !== 'alumno';

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">📖 Convenio colectivo aplicable</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">${conv.nombre} · ${conv.año}</p>
    </div>
    <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaRRHH='panel';renderRRHH()">← Volver</button>
  </div>

  <div class="grid-2col">
    <!-- Tabla salarial -->
    <div class="ficha-card">
      <div class="ficha-card-header"><span>💶</span> Tabla salarial por categorías</div>
      <table style="width:100%;border-collapse:collapse;font-size:.82rem">
        <thead><tr style="border-bottom:2px solid var(--verde-200)">
          <th style="text-align:left;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Categoría</th>
          <th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Sal. base</th>
          <th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Plus conv.</th>
          <th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Plus transp.</th>
        </tr></thead>
        <tbody>
          ${conv.categorias.map((c, i) => `
          <tr style="border-bottom:1px solid var(--gris-50);${i%2?'background:var(--gris-50)':''}">
            <td style="padding:6px 8px;font-weight:500">${c.nombre}</td>
            <td style="padding:6px 8px;text-align:right">${esProf?`<input type="number" class="ficha-input" style="width:70px;font-size:.8rem;padding:3px 6px;text-align:right" value="${c.salarioBase}" oninput="EMPRESA_STATE.rrhh.convenio.categorias[${i}].salarioBase=parseFloat(this.value)||0">`:c.salarioBase+' €'}</td>
            <td style="padding:6px 8px;text-align:right">${esProf?`<input type="number" class="ficha-input" style="width:60px;font-size:.8rem;padding:3px 6px;text-align:right" value="${c.plusConvenio}" oninput="EMPRESA_STATE.rrhh.convenio.categorias[${i}].plusConvenio=parseFloat(this.value)||0">`:c.plusConvenio+' €'}</td>
            <td style="padding:6px 8px;text-align:right">${esProf?`<input type="number" class="ficha-input" style="width:60px;font-size:.8rem;padding:3px 6px;text-align:right" value="${c.plusTransporte}" oninput="EMPRESA_STATE.rrhh.convenio.categorias[${i}].plusTransporte=parseFloat(this.value)||0">`:c.plusTransporte+' €'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${esProf?'<div style="margin-top:8px;font-size:.72rem;color:var(--gris-400)">💡 Como docente puedes modificar las tablas salariales</div>':''}
    </div>

    <!-- Tipos de cotización -->
    <div class="ficha-card">
      <div class="ficha-card-header"><span>📊</span> Tipos de cotización a la S.S. (${conv.año})</div>
      <table style="width:100%;border-collapse:collapse;font-size:.82rem">
        <thead><tr style="border-bottom:2px solid var(--verde-200)">
          <th style="text-align:left;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Concepto</th>
          <th style="text-align:center;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Empresa</th>
          <th style="text-align:center;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Trabajador</th>
        </tr></thead>
        <tbody>
          <tr><td style="padding:4px 8px">Contingencias comunes</td><td style="text-align:center;padding:4px 8px">${conv.ss.contingenciasComunes_emp}%</td><td style="text-align:center;padding:4px 8px">${conv.ss.contingenciasComunes_trab}%</td></tr>
          <tr style="background:var(--gris-50)"><td style="padding:4px 8px">Desempleo (indefinido)</td><td style="text-align:center;padding:4px 8px">${conv.ss.desempleo_emp_indef}%</td><td style="text-align:center;padding:4px 8px">${conv.ss.desempleo_trab_indef}%</td></tr>
          <tr><td style="padding:4px 8px">Desempleo (temporal)</td><td style="text-align:center;padding:4px 8px">${conv.ss.desempleo_emp_temporal}%</td><td style="text-align:center;padding:4px 8px">${conv.ss.desempleo_trab_temporal}%</td></tr>
          <tr style="background:var(--gris-50)"><td style="padding:4px 8px">FOGASA</td><td style="text-align:center;padding:4px 8px">${conv.ss.fogasa_emp}%</td><td style="text-align:center;padding:4px 8px">—</td></tr>
          <tr><td style="padding:4px 8px">Formación profesional</td><td style="text-align:center;padding:4px 8px">${conv.ss.fp_emp}%</td><td style="text-align:center;padding:4px 8px">${conv.ss.fp_trab}%</td></tr>
          <tr style="background:var(--gris-50)"><td style="padding:4px 8px">MEI</td><td style="text-align:center;padding:4px 8px">${conv.ss.mei_emp}%</td><td style="text-align:center;padding:4px 8px">${conv.ss.mei_trab}%</td></tr>
          <tr><td style="padding:4px 8px">AT y EP</td><td style="text-align:center;padding:4px 8px">${conv.ss.accidentesTrabajo_emp}%</td><td style="text-align:center;padding:4px 8px">—</td></tr>
        </tbody>
      </table>
      <div style="margin-top:10px;padding:8px 10px;background:var(--verde-50);border-radius:var(--radio-sm);font-size:.75rem;color:var(--verde-800)">
        Bases cotización: Mínima <strong>${conv.baseMinima} €</strong> · Máxima <strong>${conv.baseMaxima} €</strong> · Pagas extra: <strong>${conv.pagasExtra}</strong>
      </div>
    </div>
  </div>`;
}

/* ── Vista detalle empleado ───────────────────────────────── */
function vistaEmpleadoDetalle() {
  const rrhh = EMPRESA_STATE.rrhh;
  const emp  = rrhh.plantilla.find(e => e.id === rrhh.empleadoSeleccionado);
  if (!emp) return '<p>Empleado no encontrado</p>';
  const cat  = rrhh.convenio.categorias.find(c => c.id === emp.categoria);
  const n    = rrhhCalcNomina(emp);
  const nominas = rrhh.nominas.filter(nm => nm.empleadoId === emp.id);
  const incidencias = rrhh.incidencias.filter(i => i.empleadoId === emp.id);

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:48px;height:48px;border-radius:12px;background:var(--verde-600);color:white;font-size:1rem;font-weight:700;display:flex;align-items:center;justify-content:center">
        ${(emp.nombre||'??').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
      </div>
      <div>
        <h3 style="font-size:1.1rem;font-weight:700;color:var(--gris-800)">${emp.nombre || 'Sin nombre'}</h3>
        <p style="font-size:.8rem;color:var(--gris-500)">${cat?cat.nombre:'—'} · DNI: ${emp.dni||'—'} · Alta: ${emp.fechaAlta||'—'}</p>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-accion" onclick="rrhhGenerarNomina('${emp.id}')">🧾 Calcular nómina</button>
      <button class="btn-secundario" onclick="rrhhAgregarIncidencia('${emp.id}')">⚠️ Incidencia</button>
      <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaRRHH='panel';renderRRHH()">← Volver</button>
    </div>
  </div>

  <div class="grid-2col">
    <!-- Datos del empleado -->
    <div class="ficha-card">
      <div class="ficha-card-header"><span>👤</span> Datos laborales</div>
      <div class="ficha-grid-2">
        <div class="ficha-campo"><label>Contrato</label><div class="ficha-valor">${{indefinido:'Indefinido',temporal:'Temporal',practicas:'Prácticas',formacion:'Formación',mercantil:'Mercantil'}[emp.tipoContrato]||emp.tipoContrato}</div></div>
        <div class="ficha-campo"><label>Jornada</label><div class="ficha-valor">${emp.jornada === 'completa' ? 'Completa' : 'Parcial'} · ${emp.horasSemanales}h/sem</div></div>
        <div class="ficha-campo"><label>Categoría</label><div class="ficha-valor">${cat?cat.nombre:'—'} (Grupo ${cat?cat.grupo:'—'})</div></div>
        <div class="ficha-campo"><label>Situación</label><div class="ficha-valor"><span class="estado ${emp.situacion==='activo'?'activo':'bloqueado'}">${emp.situacion==='activo'?'Activo':'Baja'}</span></div></div>
      </div>
      ${n ? `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--gris-100)">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center">
          <div style="padding:8px;background:var(--verde-50);border-radius:var(--radio-sm)">
            <div style="font-size:1.1rem;font-weight:700;color:var(--verde-800)">${rrhhFormatNum(n.totalDevengos)} €</div>
            <div style="font-size:.68rem;color:var(--verde-600)">Salario bruto</div>
          </div>
          <div style="padding:8px;background:#fef2f2;border-radius:var(--radio-sm)">
            <div style="font-size:1.1rem;font-weight:700;color:#991b1b">${rrhhFormatNum(n.totalDeducciones)} €</div>
            <div style="font-size:.68rem;color:#991b1b">Deducciones</div>
          </div>
          <div style="padding:8px;background:var(--verde-100);border-radius:var(--radio-sm);border:2px solid var(--verde-400)">
            <div style="font-size:1.1rem;font-weight:700;color:var(--verde-900)">${rrhhFormatNum(n.liquido)} €</div>
            <div style="font-size:.68rem;color:var(--verde-700)">Líquido</div>
          </div>
        </div>
      </div>` : ''}
    </div>

    <!-- Histórico -->
    <div style="display:flex;flex-direction:column;gap:1rem">
      <div class="ficha-card">
        <div class="ficha-card-header"><span>🧾</span> Nóminas generadas <span style="margin-left:auto;font-size:.78rem;color:var(--gris-400)">${nominas.length}</span></div>
        ${nominas.length === 0
          ? '<div style="text-align:center;padding:1rem;color:var(--gris-400);font-size:.82rem">Sin nóminas generadas</div>'
          : nominas.map(nm => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--gris-50)">
              <span>📄</span>
              <div style="flex:1;font-size:.82rem;color:var(--gris-700)">Nómina ${['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][nm.mes]} ${nm.año}</div>
              <strong style="font-size:.82rem;color:var(--verde-700)">${nm.desglose?rrhhFormatNum(nm.desglose.liquido):''} €</strong>
            </div>`).join('')
        }
      </div>
      ${incidencias.length > 0 ? `
      <div class="ficha-card">
        <div class="ficha-card-header"><span>⚠️</span> Incidencias</div>
        ${incidencias.map(i => `
        <div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--gris-50);font-size:.82rem">
          <span>${{'baja-medica':'🏥','vacaciones':'🏖️','permiso':'📋','ausencia':'⚠️'}[i.tipo]||'📌'}</span>
          <div><strong>${i.tipo}</strong> desde ${i.fechaInicio} ${i.fechaFin?'hasta '+i.fechaFin:' (abierta)'}<br><span style="color:var(--gris-500)">${i.descripcion}</span></div>
        </div>`).join('')}
      </div>` : ''}
    </div>
  </div>`;
}



/* ============================================================
   VISTAS PLACEHOLDER (se desarrollarán en versiones siguientes)
   ============================================================ */

/* ============================================================
   MÓDULO DE MERCADO INTERGRUPAL
   ============================================================ */

/* ── Empresas demo del aula (en Firebase serían reales) ────── */
const EMPRESAS_AULA = [
  { grupo:'G1', nombre:'Agrícola Vega Alta S.L.',     sector:'Producción y distribución de cítricos' },
  { grupo:'G2', nombre:'Distribuciones García S.L.',   sector:'Distribución mayorista alimentaria' },
  { grupo:'G3', nombre:'Naranjas del Sur S.L.',        sector:'Exportación de cítricos' },
  { grupo:'G4', nombre:'Cítricos Premium S.L.',        sector:'Selección y envasado de cítricos' },
  { grupo:'G5', nombre:'Agroservicios Cantillana S.L.',sector:'Servicios logísticos agroalimentarios' },
];

const ESTADOS_TRANSACCION = {
  'presupuesto-solicitado': { label:'Presupuesto solicitado', color:'#6366f1', icono:'📩', paso:1 },
  'presupuesto-enviado':    { label:'Presupuesto enviado',    color:'#3b82f6', icono:'💰', paso:2 },
  'presupuesto-rechazado':  { label:'Presupuesto rechazado',  color:'#ef4444', icono:'✕',  paso:0 },
  'pedido-enviado':         { label:'Pedido confirmado',      color:'#8b5cf6', icono:'📤', paso:3 },
  'pedido-aceptado':        { label:'Pedido aceptado',        color:'#a855f7', icono:'✓',  paso:4 },
  'pedido-rechazado':       { label:'Pedido rechazado',       color:'#ef4444', icono:'✕',  paso:0 },
  'albaran-emitido':        { label:'Albarán emitido',        color:'#f59e0b', icono:'📋', paso:5 },
  'factura-emitida':        { label:'Factura emitida',        color:'var(--verde-600)', icono:'🧾', paso:6 },
  'completada':             { label:'Completada',             color:'var(--verde-700)', icono:'✓✓', paso:7 },
};

function miGrupo() { return EMPRESA_STATE.config.grupoId; }
function otrasEmpresas() { return EMPRESAS_AULA.filter(e => e.grupo !== miGrupo()); }
function empresaPorGrupo(g) { return EMPRESAS_AULA.find(e => e.grupo === g); }

/* ── Catálogo ─────────────────────────────────────────────── */
function agregarProducto() {
  EMPRESA_STATE.mercado.catalogo.push({
    id: 'prod-' + Date.now(),
    nombre: '', descripcion: '', precio: '', unidad: 'kg', iva: 10, stock: '', categoria: ''
  });
  EMPRESA_STATE.mercado.editandoCatalogo = true;
  renderMercado();
}
function eliminarProducto(id) {
  EMPRESA_STATE.mercado.catalogo = EMPRESA_STATE.mercado.catalogo.filter(p => p.id !== id);
  renderMercado();
}
function actualizarProducto(id, campo, valor) {
  const p = EMPRESA_STATE.mercado.catalogo.find(p => p.id === id);
  if (p) p[campo] = valor;
}
function guardarCatalogo() {
  EMPRESA_STATE.mercado.editandoCatalogo = false;
  renderMercado();
  mostrarToast('✓ Catálogo guardado', 'exito');
}

/* ── Solicitar presupuesto (fase 1) ──────────────────────── */
function solicitarPresupuesto() {
  EMPRESA_STATE.mercado.vistaActiva = 'nueva-transaccion';
  renderMercado();
}

function enviarSolicitudPresupuesto() {
  const grupoDestino = document.getElementById('pedido-destino').value;
  if (!grupoDestino) { mostrarToast('Selecciona una empresa', 'error'); return; }
  
  const items = [];
  document.querySelectorAll('.pedido-item-row').forEach(row => {
    const prod = row.querySelector('.pedido-prod').value;
    const cant = parseFloat(row.querySelector('.pedido-cant').value) || 0;
    if (prod && cant > 0) items.push({ producto: prod, cantidad: cant, precioUnit: 0, iva: 0 });
  });
  if (items.length === 0) { mostrarToast('Añade al menos un producto', 'error'); return; }
  
  const ahora = new Date();
  const numRef = 'SOL-' + miGrupo() + '-' + String(EMPRESA_STATE.mercado.transacciones.length + 1).padStart(3,'0');
  
  EMPRESA_STATE.mercado.transacciones.unshift({
    id: 'tx-' + Date.now(),
    numRef: numRef,
    deGrupo: miGrupo(),
    aGrupo: grupoDestino,
    estado: 'presupuesto-solicitado',
    items: items,
    subtotal: 0, iva: 0, total: 0,
    docs: { solicitud:{fecha:ahora.toLocaleDateString('es-ES'),numero:numRef}, presupuesto:null, pedido:null, aceptacion:null, albaran:null, factura:null },
    fecha: ahora.toLocaleDateString('es-ES'),
    hora:  ahora.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'}),
    observaciones: document.getElementById('pedido-obs').value || '',
    historial: [{ accion:'Solicitud de presupuesto enviada', fecha:ahora.toLocaleDateString('es-ES'), hora:ahora.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}), autor:miGrupo() }],
  });
  
  EMPRESA_STATE.mercado.vistaActiva = 'panel';
  renderMercado();
  mostrarToast('📩 Solicitud ' + numRef + ' enviada a ' + empresaPorGrupo(grupoDestino).nombre, 'exito');
}

/* ── El proveedor responde con presupuesto (pone precios) ── */
function enviarPresupuesto(txId) {
  const tx = EMPRESA_STATE.mercado.transacciones.find(t => t.id === txId);
  if (!tx) return;
  
  let ok = true;
  tx.items.forEach((it, i) => {
    const precioEl = document.getElementById('pres-precio-' + txId + '-' + i);
    const ivaEl    = document.getElementById('pres-iva-' + txId + '-' + i);
    if (precioEl) it.precioUnit = parseFloat(precioEl.value) || 0;
    if (ivaEl)    it.iva        = parseInt(ivaEl.value) || 10;
    if (it.precioUnit <= 0) ok = false;
  });
  
  if (!ok) { mostrarToast('Pon precio a todos los productos', 'error'); return; }
  
  const subtotal = tx.items.reduce((s, it) => s + it.cantidad * it.precioUnit, 0);
  const ivaTotal = tx.items.reduce((s, it) => s + it.cantidad * it.precioUnit * (it.iva/100), 0);
  tx.subtotal = subtotal;
  tx.iva = ivaTotal;
  tx.total = subtotal + ivaTotal;
  
  const ahora = new Date();
  const numPres = tx.numRef.replace('SOL','PRE');
  tx.estado = 'presupuesto-enviado';
  tx.docs.presupuesto = { fecha:ahora.toLocaleDateString('es-ES'), numero:numPres };
  tx.historial.push({ accion:'Presupuesto ' + numPres + ' enviado · Total: ' + tx.total.toFixed(2) + ' €', fecha:ahora.toLocaleDateString('es-ES'), hora:ahora.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}), autor:tx.aGrupo });
  
  renderMercado();
  mostrarToast('💰 Presupuesto enviado · ' + tx.total.toFixed(2) + ' €', 'exito');
}

/* ── El cliente acepta el presupuesto y confirma pedido ──── */
function confirmarPedido(txId) {
  const tx = EMPRESA_STATE.mercado.transacciones.find(t => t.id === txId);
  if (!tx) return;
  const ahora = new Date();
  const numPed = tx.numRef.replace('SOL','PED');
  tx.estado = 'pedido-enviado';
  tx.docs.pedido = { fecha:ahora.toLocaleDateString('es-ES'), numero:numPed };
  tx.historial.push({ accion:'Pedido ' + numPed + ' confirmado tras aceptar presupuesto', fecha:ahora.toLocaleDateString('es-ES'), hora:ahora.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}), autor:tx.deGrupo });
  renderMercado();
  mostrarToast('📤 Pedido confirmado · ' + numPed, 'exito');
}

function rechazarPresupuesto(txId) {
  const tx = EMPRESA_STATE.mercado.transacciones.find(t => t.id === txId);
  if (!tx) return;
  const ahora = new Date();
  tx.estado = 'presupuesto-rechazado';
  tx.historial.push({ accion:'Presupuesto rechazado por el cliente', fecha:ahora.toLocaleDateString('es-ES'), hora:ahora.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}), autor:tx.deGrupo });
  renderMercado();
  mostrarToast('✕ Presupuesto rechazado', '');
}

/* ── Avanzar estados posteriores al pedido ────────────────── */
function avanzarTransaccion(txId, nuevoEstado) {
  const tx = EMPRESA_STATE.mercado.transacciones.find(t => t.id === txId);
  if (!tx) return;
  const ahora = new Date();
  const fechaStr = ahora.toLocaleDateString('es-ES');
  const horaStr  = ahora.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
  tx.estado = nuevoEstado;
  
  if (nuevoEstado === 'pedido-aceptado') {
    tx.docs.aceptacion = { fecha: fechaStr, numero: (tx.numRef||'').replace('SOL','ACE') };
    tx.historial.push({ accion:'Pedido aceptado por el proveedor', fecha:fechaStr, hora:horaStr, autor:tx.aGrupo });
  } else if (nuevoEstado === 'pedido-rechazado') {
    tx.historial.push({ accion:'Pedido rechazado por el proveedor', fecha:fechaStr, hora:horaStr, autor:tx.aGrupo });
  } else if (nuevoEstado === 'albaran-emitido') {
    const numAlb = (tx.numRef||'').replace('SOL','ALB');
    tx.docs.albaran = { fecha: fechaStr, numero: numAlb };
    tx.historial.push({ accion:'Albarán ' + numAlb + ' emitido · Mercancía entregada', fecha:fechaStr, hora:horaStr, autor:tx.aGrupo });
  } else if (nuevoEstado === 'factura-emitida') {
    const numFac = 'FAC-' + tx.aGrupo + '-' + String(Math.floor(Math.random()*900)+100);
    tx.docs.factura = { fecha: fechaStr, numero: numFac, base: tx.subtotal, iva: tx.iva, total: tx.total };
    tx.historial.push({ accion:'Factura ' + numFac + ' emitida · Total: ' + tx.total.toFixed(2) + ' €', fecha:fechaStr, hora:horaStr, autor:tx.aGrupo });
  } else if (nuevoEstado === 'completada') {
    tx.historial.push({ accion:'Transacción completada · Pago recibido', fecha:fechaStr, hora:horaStr, autor:'Sistema' });
    if(window.rankingNotificar) window.rankingNotificar();
  }
  
  renderMercado();
  mostrarToast(ESTADOS_TRANSACCION[nuevoEstado].icono + ' ' + ESTADOS_TRANSACCION[nuevoEstado].label, 'exito');
}

function abrirTransaccion(txId) {
  EMPRESA_STATE.mercado.transaccionAbierta = txId;
  EMPRESA_STATE.mercado.vistaActiva = 'detalle-transaccion';
  renderMercado();
}

function addPedidoItem() {
  const cont = document.getElementById('pedido-items-list');
  const row = document.createElement('div');
  row.className = 'pedido-item-row';
  row.style.cssText = 'display:grid;grid-template-columns:2fr 1fr auto;gap:8px;align-items:center;margin-bottom:6px';
  row.innerHTML = `
    <input type="text" class="ficha-input pedido-prod" placeholder="Producto o servicio">
    <input type="number" class="ficha-input pedido-cant" placeholder="Cantidad" min="0" step="1">
    <button class="btn-eliminar-socio" onclick="this.parentElement.remove()">✕</button>`;
  cont.appendChild(row);
}

/* ── Demo: simular que la otra empresa responde ──────────── */
function simularRespuestaProveedor(txId) {
  // En modo demo, simula que el proveedor actúa sobre la transacción
  const tx = EMPRESA_STATE.mercado.transacciones.find(t => t.id === txId);
  if (!tx) return;
  // Poner precios aleatorios realistas
  tx.items.forEach(it => {
    if (!it.precioUnit || it.precioUnit === 0) {
      it.precioUnit = +(Math.random() * 4 + 0.5).toFixed(2);
      it.iva = 10;
    }
  });
  enviarPresupuesto(txId);
}

function renderMercado() {
  if (APP.moduloActual === 'mercado') {
    document.getElementById('contenido-principal').innerHTML = vistaMercado();
  }
}

/* ── Eventos de mercado (profesor) ────────────────────────── */
/* ── Sistema de eventos de mercado conectado ─────────────────── */
const EVENTOS_PREDEFINIDOS = [
  {
    id: 'crisis-suministro',
    titulo: '🌨️ Crisis de suministro',
    desc: 'Las heladas en la comarca han dañado un 30% de la cosecha de cítricos. Los costes de aprovisionamiento suben un 20% durante las próximas 4 semanas.',
    efecto: '+20% costes variables',
    correoDept: 'comercial',
    correoAsunto: 'URGENTE: Comunicación sobre subida de precios por heladas',
    correoCuerpo: 'Estimado cliente,\n\nLamentamos comunicarle que debido a las heladas que han afectado gravemente a la comarca de la Vega Alta del Guadalquivir durante la última semana, nos vemos en la obligación de revisar al alza nuestros precios.\n\nLa producción de cítricos ha sufrido una merma del 30%, lo que ha provocado una subida generalizada del 20% en los costes de aprovisionamiento que nos vemos obligados a repercutir parcialmente.\n\nLos nuevos precios entrarán en vigor a partir del próximo lunes. Los pedidos ya confirmados se mantendrán a los precios acordados.\n\nLamentamos las molestias y quedamos a su disposición para cualquier consulta.\n\nAtentamente,\nAsociación de Productores de la Vega Alta',
    correoRemitente: 'Asociación de Productores de la Vega Alta',
    correoEmail: 'info@productoresvegaalta.es'
  },
  {
    id: 'canal-online',
    titulo: '📈 Apertura nuevo canal de venta online',
    desc: 'La plataforma FreshMarket.es abre su marketplace para productores locales. Oportunidad de llegar directamente al consumidor final con un 15% de comisión por venta.',
    efecto: 'Nuevo segmento de clientes',
    correoDept: 'direccion',
    correoAsunto: 'Propuesta de colaboración — FreshMarket.es marketplace alimentario',
    correoCuerpo: 'Estimado/a gerente,\n\nDesde FreshMarket.es, el nuevo marketplace de productos agroalimentarios frescos de proximidad, nos ponemos en contacto con su empresa por su reconocida trayectoria en el sector de distribución alimentaria de la Vega Alta.\n\nQueremos ofrecerles la posibilidad de vender sus productos directamente al consumidor final a través de nuestra plataforma. Las condiciones son:\n\n- Comisión del 15% sobre cada venta\n- Gestión logística de última milla incluida (en radio de 50 km)\n- Alta gratuita durante los 3 primeros meses\n- Panel de vendedor con estadísticas en tiempo real\n\nEstimamos que podrían alcanzar unas ventas adicionales de 2.000-5.000 €/mes en el primer trimestre.\n\n¿Les interesa agendar una reunión para conocer los detalles?\n\nUn cordial saludo,\nDpto. de Desarrollo de Negocio\nFreshMarket.es',
    correoRemitente: 'FreshMarket.es',
    correoEmail: 'partners@freshmarket.es'
  },
  {
    id: 'normativa-347',
    titulo: '⚖️ Nueva normativa fiscal: Obligación modelo 347',
    desc: 'La AEAT recuerda la obligación de presentar el modelo 347 (declaración anual de operaciones con terceros) para todas las operaciones superiores a 3.005,06 € con un mismo proveedor o cliente.',
    efecto: 'Obligación fiscal adicional',
    correoDept: 'fiscal',
    correoAsunto: 'Recordatorio fiscal: Obligación de declaración modelo 347',
    correoCuerpo: 'Estimado contribuyente,\n\nLe recordamos que de conformidad con el artículo 93 de la Ley 58/2003, General Tributaria, y el Real Decreto 1065/2007, su empresa está obligada a presentar la declaración anual de operaciones con terceras personas (Modelo 347) correspondiente al ejercicio en curso.\n\nDeben declararse todas las operaciones con un mismo tercero que en su conjunto superen los 3.005,06 € durante el año natural, desglosadas por trimestres.\n\nEl plazo de presentación es durante el mes de febrero del año siguiente al ejercicio declarado.\n\nLe recomendamos revisar desde ahora el volumen de operaciones con cada proveedor y cliente para asegurar el correcto cumplimiento de esta obligación.\n\nAtentamente,\nÁrea de Gestión Tributaria\nDelegación de la AEAT de Sevilla',
    correoRemitente: 'Agencia Tributaria — AEAT',
    correoEmail: 'notificaciones@aeat.es'
  },
  {
    id: 'subida-tipos',
    titulo: '🏦 Subida de tipos de interés',
    desc: 'El BCE sube los tipos de interés 0,5 puntos porcentuales. Las cuotas de préstamos a tipo variable aumentan proporcionalmente.',
    efecto: '+0,5% coste financiero',
    correoDept: 'contabilidad',
    correoAsunto: 'Notificación: Actualización del tipo de interés de su préstamo',
    correoCuerpo: 'Estimado cliente,\n\nLe comunicamos que, como consecuencia de la decisión del Banco Central Europeo de incrementar los tipos de interés de referencia en 0,50 puntos porcentuales, el tipo de interés aplicable a su préstamo ICO ref. 2025-4478 se actualiza conforme a las condiciones contractuales.\n\nNuevo tipo de interés: Euríbor 12M + diferencial = nuevo tipo resultante\n\nEsta modificación se aplicará a partir de la siguiente cuota mensual, lo que supondrá un incremento estimado de 85,00 € en su cuota mensual.\n\nLe recomendamos revisar su planificación de tesorería para adaptar los flujos de caja previstos.\n\nAtentamente,\nDpto. de Gestión de Empresas\nBanco Andalucía',
    correoRemitente: 'Banco Andalucía Empresas',
    correoEmail: 'empresas@bancoandalucia.es'
  },
  {
    id: 'feria-sectorial',
    titulo: '🤝 Feria sectorial agroalimentaria',
    desc: 'La Cámara de Comercio organiza una feria del sector en Sevilla. Oportunidad de captar nuevos clientes y conocer a la competencia. Coste del stand: 600 €.',
    efecto: 'Oportunidad comercial',
    correoDept: 'direccion',
    correoAsunto: 'Invitación: III Feria Agroalimentaria de la Vega del Guadalquivir',
    correoCuerpo: 'Estimado/a gerente,\n\nDesde la Cámara de Comercio de Sevilla tenemos el placer de invitarles a participar como expositores en la III Feria Agroalimentaria de la Vega del Guadalquivir, que se celebrará los días 15 y 16 del próximo mes en el Recinto Ferial de Cantillana.\n\nCondiciones de participación:\n- Stand básico (6 m²): 600 €\n- Stand premium (12 m²): 1.100 €\n- Incluye: mobiliario, electricidad, inserción en catálogo oficial y 2 invitaciones a la cena de networking\n\nEl año pasado participaron 45 empresas del sector y asistieron más de 800 visitantes profesionales. Es una excelente oportunidad para dar a conocer vuestra empresa y establecer contactos comerciales.\n\nPlazo de inscripción: hasta el día 5 del próximo mes.\n\nCordialmente,\nÁrea de Ferias y Eventos\nCámara de Comercio de Sevilla',
    correoRemitente: 'Cámara de Comercio de Sevilla',
    correoEmail: 'ferias@camarasevilla.com'
  },
  {
    id: 'baja-empleado',
    titulo: '👷 Baja médica de un empleado clave',
    desc: 'Un empleado del departamento de almacén ha comunicado una baja por enfermedad de 3 semanas. Hay que reorganizar el trabajo y decidir si se contrata un sustituto.',
    efecto: 'Reducción temporal de personal',
    correoDept: 'rrhh',
    correoAsunto: 'Comunicación de Incapacidad Temporal — Pedro Ruiz Martínez',
    correoCuerpo: 'A la atención del Departamento de Recursos Humanos,\n\nPor la presente les comunico que, según parte médico de baja emitido por el Dr. Fernández García del Centro de Salud de Cantillana con fecha de hoy, me encuentro en situación de Incapacidad Temporal por enfermedad común.\n\nLa duración estimada de la baja es de 21 días naturales, con revisión médica prevista para el día 18 del presente mes.\n\nAdjunto parte de baja para su tramitación ante la Seguridad Social conforme al artículo 169 del Real Decreto Legislativo 8/2015.\n\nQuedo a su disposición para cualquier gestión que necesiten realizar.\n\nAtentamente,\nPedro Ruiz Martínez\nDpto. Almacén y Logística',
    correoRemitente: 'Pedro Ruiz Martínez',
    correoEmail: 'pruiz@personal.cantillana.es'
  },
];

function lanzarEvento(eventoId) {
  const ev = EVENTOS_PREDEFINIDOS.find(e => e.id === eventoId);
  if (!ev) return;

  const ahora = new Date();
  const fechaStr = ahora.toLocaleDateString('es-ES');
  const horaStr  = ahora.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'});

  // 1. Registrar en mercado
  EMPRESA_STATE.mercado.eventos.unshift({
    id: 'ev-' + Date.now(),
    titulo: ev.titulo,
    descripcion: ev.desc,
    efecto: ev.efecto,
    fecha: fechaStr,
    activo: true,
  });

  // 2. Generar correo en la bandeja de mensajería
  EMPRESA_STATE.mensajeria.correos.unshift({
    id: 'correo-ev-' + Date.now(),
    de: ev.correoRemitente,
    email: ev.correoEmail,
    asunto: ev.correoAsunto,
    cuerpo: ev.correoCuerpo,
    departamento: ev.correoDept,
    dificultad: 'intermedio',
    ra: 'RA6',
    fecha: fechaStr,
    hora: horaStr,
    leido: false,
    hilo: [],
    anotacionProf: '',
    calificacion: null,
  });
  actualizarBadgeCorreos();

  // 3. Notificación + Toast + refresh
  notifEventoMercado({ titulo: ev.titulo, descripcion: ev.desc });
  notifCorreoRecibido({ asunto: ev.correoAsunto, de: ev.correoRemitente, departamento: ev.correoDept });
  mostrarToast('⚡ Evento lanzado: ' + ev.titulo + ' · Correo generado en bandeja', 'exito');
  actualizarBadgeNotif();
  
  // Refrescar la vista actual
  if (APP.moduloActual === 'mercado') renderMercado();
  if (APP.moduloActual === 'dashboard') {
    document.getElementById('contenido-principal').innerHTML = vistaDashboard();
  }
}

// Mantener compatibilidad con vistaEventos del mercado
function lanzarEventoDemo(titulo, desc, efecto) {
  // Buscar el evento predefinido por título
  const ev = EVENTOS_PREDEFINIDOS.find(e => e.titulo === titulo);
  if (ev) {
    lanzarEvento(ev.id);
  } else {
    // Evento personalizado sin correo asociado
    EMPRESA_STATE.mercado.eventos.unshift({
      id: 'ev-' + Date.now(), titulo, descripcion: desc, efecto, fecha: new Date().toLocaleDateString('es-ES'), activo: true,
    });
    mostrarToast('⚡ Evento de mercado lanzado', 'exito');
    renderMercado();
  }
}

/* ============================================================
   VISTA: MERCADO
   ============================================================ */
