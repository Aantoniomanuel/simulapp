function vistaGestion() {
  const g      = EMPRESA_STATE.gestion;
  const esProf = APP.rolActivo !== 'alumno';
  const sem    = g.semanaActual;
  const tareasSem = g.tareas.filter(t => t.semana === sem);
  const totalTareas = g.tareas.length;
  const entregadas  = g.tareas.filter(t => t.estado === 'entregada' || t.estado === 'evaluada').length;
  const evaluadas   = g.tareas.filter(t => t.estado === 'evaluada').length;

  if (g.vistaActiva === 'departamento' && g.deptSeleccionado) return vistaDetalleDept(g.deptSeleccionado);
  if (g.vistaActiva === 'rotacion') return vistaRotacion();

  return `
  <div class="seccion-header">
    <div>
      <h2>⚙️ Gestión operativa</h2>
      <p>Semana ${sem} · Trimestre ${g.trimestreActual} · Tareas semanales por departamento
        <span class="ra-chip" style="margin-left:6px">RA6</span>
      </p>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-ayuda-ctx" data-ayuda="gestion" onclick="toggleAyuda('gestion')" title="Conceptos y ayuda">❓ Ayuda</button>
      ${esProf ? `
        <button class="btn-secundario" onclick="sugerirRotacion()">🔄 Rotación</button>
        <button class="btn-accion" onclick="publicarSemana()">📋 Publicar semana ${sem}</button>
      ` : ''}
    </div>
  </div>

  <!-- KPIs -->
  <div class="metricas-grid" style="margin-bottom:1.25rem">
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">📋</div></div>
      <div class="metrica-valor">${tareasSem.length}</div>
      <div class="metrica-etiq">Tareas esta semana</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono azul">✓</div></div>
      <div class="metrica-valor">${entregadas}</div>
      <div class="metrica-etiq">Tareas entregadas (total)</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono nar">🏅</div></div>
      <div class="metrica-valor">${evaluadas}</div>
      <div class="metrica-etiq">Tareas evaluadas</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">🔄</div></div>
      <div class="metrica-valor">T${g.trimestreActual}</div>
      <div class="metrica-etiq">Trimestre actual</div>
    </div>
  </div>

  <!-- Semana selector -->
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;padding:8px 14px;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-md)">
    <button class="btn-secundario" style="padding:4px 10px;font-size:.78rem"
      onclick="EMPRESA_STATE.gestion.semanaActual=Math.max(1,EMPRESA_STATE.gestion.semanaActual-1);renderGestion()">←</button>
    <span style="font-size:.9rem;font-weight:700;color:var(--gris-800);flex:1;text-align:center">Semana ${sem}</span>
    <button class="btn-secundario" style="padding:4px 10px;font-size:.78rem"
      onclick="EMPRESA_STATE.gestion.semanaActual=Math.min(25,EMPRESA_STATE.gestion.semanaActual+1);renderGestion()">→</button>
  </div>

  <!-- Panel de departamentos -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem">
    ${DEPTS_BASE.map(d => {
      const asig = g.asignaciones[d.key];
      const tareasDepto = tareasSem.filter(t => t.departamento === d.key);
      const hechas = tareasDepto.filter(t => t.estado !== 'pendiente').length;
      const esDir = d.key === 'direccion';
      return `
      <div class="ficha-card" style="cursor:pointer;border-color:${esDir?'var(--verde-400)':'var(--gris-200)'};transition:all var(--transicion)"
        onclick="EMPRESA_STATE.gestion.deptSeleccionado='${d.key}';EMPRESA_STATE.gestion.vistaActiva='departamento';renderGestion()"
        onmouseover="this.style.borderColor='var(--verde-400)';this.style.boxShadow='var(--sombra-md)'"
        onmouseout="this.style.borderColor='${esDir?'var(--verde-400)':'var(--gris-200)'}';this.style.boxShadow=''">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:40px;height:40px;border-radius:10px;background:${esDir?'var(--verde-800)':'var(--verde-100)'};
            color:${esDir?'white':'var(--verde-800)'};font-size:1.1rem;display:flex;align-items:center;justify-content:center">
            ${d.icono}
          </div>
          <div style="flex:1">
            <div style="font-size:.9rem;font-weight:700;color:var(--gris-800)">${d.nombre}</div>
            <div style="font-size:.75rem;color:var(--gris-500)">
              ${asig.alumno || '<span style="color:#f59e0b;font-style:italic">Sin asignar</span>'}
            </div>
          </div>
          ${d.soft !== '—' ? `<span style="font-size:.68rem;font-weight:600;background:var(--verde-100);color:var(--verde-800);padding:2px 8px;border-radius:20px">${d.soft}</span>` : ''}
        </div>
        <!-- Tareas de la semana para este departamento -->
        ${tareasDepto.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:4px">
            ${tareasDepto.map(t => {
              const colores = {pendiente:'var(--gris-400)',entregada:'var(--verde-500)',evaluada:'#8b5cf6','en-curso':'#f59e0b'};
              return `
              <div style="display:flex;align-items:center;gap:6px;font-size:.78rem;padding:4px 0">
                <div style="width:8px;height:8px;border-radius:50%;background:${colores[t.estado]||colores.pendiente};flex-shrink:0"></div>
                <span style="flex:1;color:var(--gris-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.titulo}</span>
                ${t.ce ? `<span class="ra-chip">${t.ce.split(' · ')[0]}</span>` : ''}
              </div>`;
            }).join('')}
          </div>
          <div style="margin-top:8px;font-size:.72rem;color:var(--gris-400)">${hechas}/${tareasDepto.length} completadas</div>
        ` : `
          <div style="text-align:center;padding:10px;color:var(--gris-400);font-size:.78rem">
            Sin tareas esta semana
          </div>
        `}
      </div>`;
    }).join('')}
  </div>`;
}

/* ── Vista detalle de departamento ────────────────────────── */

/* ============================================================
   MÓDULO RRHH — GESTIÓN DE PERSONAL Y NÓMINAS
   ============================================================ */

const TIPOS_CONTRATO = [
  { id:'100', nombre:'Indefinido ordinario a tiempo completo' },
  { id:'189', nombre:'Indefinido por conversión de temporal' },
  { id:'200', nombre:'Indefinido a tiempo parcial' },
  { id:'401', nombre:'Temporal por circunstancias de la producción' },
  { id:'402', nombre:'Temporal por sustitución de persona trabajadora' },
  { id:'421', nombre:'Formación en alternancia' },
  { id:'510', nombre:'Prácticas profesionales' },
];

const COMPLEMENTOS_TIPO = [
  { id:'antiguedad',      nombre:'Complemento de antigüedad (trienios)', tipo:'mensual' },
  { id:'transporte',      nombre:'Plus de transporte',                    tipo:'mensual' },
  { id:'productividad',   nombre:'Complemento de productividad',          tipo:'mensual' },
  { id:'responsabilidad', nombre:'Plus de responsabilidad',               tipo:'mensual' },
  { id:'nocturnidad',     nombre:'Plus de nocturnidad',                   tipo:'mensual' },
  { id:'horasExtra',      nombre:'Horas extraordinarias',                 tipo:'variable' },
];

/* ── Helpers de cálculo de nómina ─────────────────────────── */
function calcIRPF(baseAnual, tramos) {
  let cuota = 0; let resto = baseAnual;
  let limiteAnterior = 0;
  for (const t of tramos) {
    const tramo = Math.min(resto, t.hasta - limiteAnterior);
    cuota += tramo * (t.tipo / 100);
    resto -= tramo;
    limiteAnterior = t.hasta;
    if (resto <= 0) break;
  }
  return baseAnual > 0 ? (cuota / baseAnual) * 100 : 0;
}

function calcNomina(empleado) {
  const conv = EMPRESA_STATE.rrhh.convenio;
  const grupo = conv.gruposProfesionales.find(g => g.id === empleado.grupoProf) || conv.gruposProfesionales[3];
  const esTemporal = empleado.tipoContrato && (empleado.tipoContrato.startsWith('4') || empleado.tipoContrato.startsWith('5'));
  
  // Devengos
  const salBase = parseFloat(empleado.salarioBase) || grupo.salarioBase;
  const complementos = (empleado.complementos || []).reduce((s, c) => s + (parseFloat(c.importe) || 0), 0);
  const totalDevengado = salBase + complementos;
  
  // Base de cotización mensual
  const baseCotizacion = totalDevengado;
  const baseAnual = baseCotizacion * (conv.pagas > 12 ? 12 : conv.pagas) + (conv.pagas > 12 ? salBase * (conv.pagas - 12) : 0);
  
  // Deducciones S.S. obrera
  const ssCC   = baseCotizacion * (conv.ssObrera.contingenciasComunes / 100);
  const ssDes  = baseCotizacion * ((esTemporal ? conv.ssObrera.desempleoTemporal : conv.ssObrera.desempleo) / 100);
  const ssFP   = baseCotizacion * (conv.ssObrera.formacionProf / 100);
  const ssMEI  = baseCotizacion * (conv.ssObrera.mei / 100);
  const totalSS = ssCC + ssDes + ssFP + ssMEI;
  
  // IRPF
  const tipoIRPF = calcIRPF(baseAnual, conv.irpfTramos);
  const retencionIRPF = totalDevengado * (tipoIRPF / 100);
  
  // Total deducciones y líquido
  const totalDeducciones = totalSS + retencionIRPF;
  const liquido = totalDevengado - totalDeducciones;
  
  // Coste empresa (S.S. empresa)
  const ssEmpCC  = baseCotizacion * (conv.ssEmpresa.contingenciasComunes / 100);
  const ssEmpDes = baseCotizacion * ((esTemporal ? conv.ssEmpresa.desempleoTemporal : conv.ssEmpresa.desempleo) / 100);
  const ssEmpFP  = baseCotizacion * (conv.ssEmpresa.formacionProf / 100);
  const ssEmpFOG = baseCotizacion * (conv.ssEmpresa.fogasa / 100);
  const ssEmpAT  = baseCotizacion * (conv.ssEmpresa.accidentesTrabajo / 100);
  const ssEmpMEI = baseCotizacion * (conv.ssEmpresa.mei / 100);
  const totalSSEmpresa = ssEmpCC + ssEmpDes + ssEmpFP + ssEmpFOG + ssEmpAT + ssEmpMEI;
  const costeTotal = totalDevengado + totalSSEmpresa;
  
  return {
    grupo, salBase, complementos, totalDevengado,
    baseCotizacion, baseAnual,
    ss: { cc:ssCC, des:ssDes, fp:ssFP, mei:ssMEI, total:totalSS },
    irpf: { tipo:tipoIRPF, retencion:retencionIRPF },
    totalDeducciones, liquido,
    ssEmpresa: { cc:ssEmpCC, des:ssEmpDes, fp:ssEmpFP, fog:ssEmpFOG, at:ssEmpAT, mei:ssEmpMEI, total:totalSSEmpresa },
    costeTotal,
    esTemporal,
  };
}

/* ── CRUD empleados ───────────────────────────────────────── */
function rrhhAgregarEmpleado() {
  EMPRESA_STATE.rrhh.empleados.push({
    id: 'emp-' + Date.now(),
    nombre: '', dni: '', nss: '', fechaAlta: new Date().toISOString().slice(0,10),
    categoria: '', grupoProf: 4, tipoContrato: '100',
    jornada: 'Completa', salarioBase: 0,
    complementos: [],
    incidencias: [],
  });
  EMPRESA_STATE.rrhh.vistaActiva = 'empleado';
  EMPRESA_STATE.rrhh.empleadoSeleccionado = EMPRESA_STATE.rrhh.empleados[EMPRESA_STATE.rrhh.empleados.length - 1].id;
  renderGestion();
}

function rrhhEliminarEmpleado(id) {
  EMPRESA_STATE.rrhh.empleados = EMPRESA_STATE.rrhh.empleados.filter(e => e.id !== id);
  EMPRESA_STATE.rrhh.vistaActiva = 'panel';
  renderGestion();
  mostrarToast('Empleado eliminado', '');
}

function rrhhGuardarEmpleado(id) {
  const emp = EMPRESA_STATE.rrhh.empleados.find(e => e.id === id);
  if (!emp) return;
  ['nombre','dni','nss','fechaAlta','categoria','tipoContrato','jornada'].forEach(campo => {
    const el = document.getElementById('rrhh-' + campo + '-' + id);
    if (el) emp[campo] = el.value;
  });
  const gp = document.getElementById('rrhh-grupoProf-' + id);
  if (gp) emp.grupoProf = parseInt(gp.value);
  const sb = document.getElementById('rrhh-salarioBase-' + id);
  if (sb) emp.salarioBase = parseFloat(sb.value) || 0;
  
  EMPRESA_STATE.rrhh.vistaActiva = 'panel';
  renderGestion();
  mostrarToast('✓ Empleado guardado', 'exito');
}

function rrhhAgregarComplemento(empId) {
  const emp = EMPRESA_STATE.rrhh.empleados.find(e => e.id === empId);
  if (emp) emp.complementos.push({ tipo:'transporte', nombre:'Plus de transporte', importe:0 });
  renderGestion();
}

function rrhhEliminarComplemento(empId, idx) {
  const emp = EMPRESA_STATE.rrhh.empleados.find(e => e.id === empId);
  if (emp) emp.complementos.splice(idx, 1);
  renderGestion();
}

function rrhhAgregarIncidencia(empId) {
  const emp = EMPRESA_STATE.rrhh.empleados.find(e => e.id === empId);
  if (!emp) return;
  const tipo = prompt('Tipo de incidencia: baja médica, vacaciones, permiso, ausencia, sanción');
  if (!tipo) return;
  const desde = prompt('Fecha inicio (dd/mm/aaaa):');
  const hasta = prompt('Fecha fin (dd/mm/aaaa):');
  emp.incidencias.push({ tipo, desde: desde||'', hasta: hasta||'', notas:'' });
  renderGestion();
  mostrarToast('✓ Incidencia registrada', 'exito');
}

/* ============================================================
   VISTA PRINCIPAL RRHH
   ============================================================ */
function vistaRRHH() {
  const r     = EMPRESA_STATE.rrhh;
  const esProf = APP.rolActivo !== 'alumno';
  const emps  = r.empleados;
  const vista = r.vistaActiva;
  
  if (vista === 'empleado' && r.empleadoSeleccionado) return vistaFichaEmpleado(r.empleadoSeleccionado);
  if (vista === 'nomina' && r.empleadoSeleccionado) return vistaNominaEmpleado(r.empleadoSeleccionado);
  if (vista === 'convenio') return vistaConvenio();

  const costeMensual = emps.reduce((s, emp) => { const n = calcNomina(emp); return s + n.costeTotal; }, 0);

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:10px;background:var(--verde-800);color:white;font-size:1.2rem;display:flex;align-items:center;justify-content:center">👥</div>
      <div>
        <h3 style="font-size:1.1rem;font-weight:700;color:var(--gris-800)">Departamento de RRHH</h3>
        <p style="font-size:.8rem;color:var(--gris-500)">Plantilla · Nóminas · Contratos · Incidencias <span class="ra-chip" style="margin-left:6px">RA6c</span></p>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaActiva='convenio';renderGestion()">📖 Convenio</button>
      <button class="btn-accion" onclick="rrhhAgregarEmpleado()">+ Nuevo empleado</button>
      <button class="btn-secundario" onclick="EMPRESA_STATE.gestion.vistaActiva='panel';renderGestion()">← Volver</button>
    </div>
  </div>

  <!-- KPIs RRHH -->
  <div class="metricas-grid" style="margin-bottom:1.25rem">
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono verde">👥</div></div>
      <div class="metrica-valor">${emps.length}</div>
      <div class="metrica-etiq">Empleados en plantilla</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono azul">💶</div></div>
      <div class="metrica-valor">${costeMensual.toLocaleString('es-ES',{maximumFractionDigits:0})} €</div>
      <div class="metrica-etiq">Coste mensual de personal</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono nar">📋</div></div>
      <div class="metrica-valor">${emps.filter(e=>e.tipoContrato&&e.tipoContrato.startsWith('1')).length}</div>
      <div class="metrica-etiq">Contratos indefinidos</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header"><div class="metrica-icono rojo">⚠️</div></div>
      <div class="metrica-valor">${emps.reduce((s,e) => s + (e.incidencias||[]).length, 0)}</div>
      <div class="metrica-etiq">Incidencias activas</div>
    </div>
  </div>

  <!-- Tabla de plantilla -->
  <div class="ficha-card">
    <div class="ficha-card-header"><span>📋</span> Plantilla de la empresa <span style="margin-left:auto;font-size:.78rem;color:var(--gris-400)">${emps.length} empleados</span></div>
    ${emps.length === 0
      ? `<div style="text-align:center;padding:2.5rem;color:var(--gris-400)">
          <div style="font-size:2.5rem;margin-bottom:8px">👤</div>
          <p style="font-size:.9rem;font-weight:500;color:var(--gris-700)">Plantilla vacía</p>
          <p style="font-size:.8rem;margin-bottom:12px">Da de alta a los empleados de tu empresa para poder generar nóminas y contratos</p>
          <button class="btn-accion" onclick="rrhhAgregarEmpleado()">+ Añadir primer empleado</button>
         </div>`
      : `<table style="width:100%;border-collapse:collapse;font-size:.82rem">
          <thead><tr style="border-bottom:2px solid var(--verde-200)">
            <th style="text-align:left;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Empleado</th>
            <th style="text-align:left;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Categoría</th>
            <th style="text-align:left;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Contrato</th>
            <th style="text-align:right;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Salario bruto</th>
            <th style="text-align:right;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Líquido</th>
            <th style="text-align:right;padding:8px;font-size:.7rem;color:var(--gris-500);text-transform:uppercase">Coste empresa</th>
            <th style="width:100px"></th>
          </tr></thead>
          <tbody>
            ${emps.map(emp => {
              const n = calcNomina(emp);
              const tc = TIPOS_CONTRATO.find(t => t.id === emp.tipoContrato);
              return `
              <tr style="border-bottom:1px solid var(--gris-50);cursor:pointer"
                onmouseover="this.style.background='var(--verde-50)'" onmouseout="this.style.background=''">
                <td style="padding:8px" onclick="EMPRESA_STATE.rrhh.empleadoSeleccionado='${emp.id}';EMPRESA_STATE.rrhh.vistaActiva='empleado';renderGestion()">
                  <div style="font-weight:600;color:var(--gris-800)">${emp.nombre || '(sin nombre)'}</div>
                  <div style="font-size:.72rem;color:var(--gris-400)">${emp.dni || '—'} · Alta: ${emp.fechaAlta || '—'}</div>
                </td>
                <td style="padding:8px">${n.grupo.nombre.split('·')[1] || emp.categoria || '—'}</td>
                <td style="padding:8px"><span style="font-size:.72rem">${tc ? tc.nombre.substring(0,25) : '—'}</span></td>
                <td style="padding:8px;text-align:right;font-weight:600">${n.totalDevengado.toFixed(2)} €</td>
                <td style="padding:8px;text-align:right;font-weight:700;color:var(--verde-700)">${n.liquido.toFixed(2)} €</td>
                <td style="padding:8px;text-align:right;color:var(--gris-500)">${n.costeTotal.toFixed(2)} €</td>
                <td style="padding:8px;text-align:right">
                  <button class="btn-secundario" style="padding:3px 8px;font-size:.72rem"
                    onclick="event.stopPropagation();EMPRESA_STATE.rrhh.empleadoSeleccionado='${emp.id}';EMPRESA_STATE.rrhh.vistaActiva='nomina';renderGestion()">🧾 Nómina</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
          <tfoot><tr style="border-top:2px solid var(--gris-200)">
            <td colspan="3" style="padding:8px;font-weight:700;color:var(--gris-800)">TOTAL MENSUAL</td>
            <td style="padding:8px;text-align:right;font-weight:700">${emps.reduce((s,e)=>s+calcNomina(e).totalDevengado,0).toFixed(2)} €</td>
            <td style="padding:8px;text-align:right;font-weight:700;color:var(--verde-700)">${emps.reduce((s,e)=>s+calcNomina(e).liquido,0).toFixed(2)} €</td>
            <td style="padding:8px;text-align:right;font-weight:700">${costeMensual.toFixed(2)} €</td>
            <td></td>
          </tr></tfoot>
        </table>`
    }
  </div>`;
}

/* ── Ficha de empleado ────────────────────────────────────── */
function vistaFichaEmpleado(empId) {
  const emp = EMPRESA_STATE.rrhh.empleados.find(e => e.id === empId);
  if (!emp) return '<p>Empleado no encontrado</p>';
  const conv = EMPRESA_STATE.rrhh.convenio;
  
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">👤 Ficha de empleado</h3>
    <div style="display:flex;gap:8px">
      <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaActiva='nomina';renderGestion()">🧾 Ver nómina</button>
      <button class="btn-secundario" style="color:#dc2626;border-color:#fca5a5" onclick="rrhhEliminarEmpleado('${emp.id}')">🗑️ Dar de baja</button>
      <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaActiva='panel';renderGestion()">← Volver</button>
    </div>
  </div>

  <div class="grid-2col">
    <!-- Datos personales -->
    <div class="ficha-card">
      <div class="ficha-card-header"><span>👤</span> Datos personales y contractuales</div>
      <div class="ficha-grid-2" style="gap:10px">
        <div class="ficha-campo"><label>Nombre completo</label>
          <input type="text" id="rrhh-nombre-${emp.id}" class="ficha-input" value="${emp.nombre}" placeholder="Nombre y apellidos"></div>
        <div class="ficha-campo"><label>DNI / NIE</label>
          <input type="text" id="rrhh-dni-${emp.id}" class="ficha-input" value="${emp.dni}" placeholder="12345678A"></div>
        <div class="ficha-campo"><label>N.º Seguridad Social</label>
          <input type="text" id="rrhh-nss-${emp.id}" class="ficha-input" value="${emp.nss}" placeholder="41/12345678/01"></div>
        <div class="ficha-campo"><label>Fecha de alta</label>
          <input type="date" id="rrhh-fechaAlta-${emp.id}" class="ficha-input" value="${emp.fechaAlta}"></div>
        <div class="ficha-campo"><label>Grupo profesional</label>
          <select id="rrhh-grupoProf-${emp.id}" class="ficha-input">
            ${conv.gruposProfesionales.map(g => `<option value="${g.id}" ${emp.grupoProf===g.id?'selected':''}>${g.nombre} (${g.salarioBase} €)</option>`).join('')}
          </select></div>
        <div class="ficha-campo"><label>Puesto / categoría</label>
          <input type="text" id="rrhh-categoria-${emp.id}" class="ficha-input" value="${emp.categoria}" placeholder="Ej: Administrativo/a"></div>
        <div class="ficha-campo"><label>Tipo de contrato</label>
          <select id="rrhh-tipoContrato-${emp.id}" class="ficha-input">
            ${TIPOS_CONTRATO.map(t => `<option value="${t.id}" ${emp.tipoContrato===t.id?'selected':''}>${t.id} · ${t.nombre}</option>`).join('')}
          </select></div>
        <div class="ficha-campo"><label>Jornada</label>
          <select id="rrhh-jornada-${emp.id}" class="ficha-input">
            <option ${emp.jornada==='Completa'?'selected':''}>Completa</option>
            <option ${emp.jornada==='Parcial 50%'?'selected':''}>Parcial 50%</option>
            <option ${emp.jornada==='Parcial 75%'?'selected':''}>Parcial 75%</option>
          </select></div>
        <div class="ficha-campo"><label>Salario base mensual (€) <span class="campo-ayuda" title="Si se deja a 0, se aplica el del grupo profesional del convenio">ⓘ</span></label>
          <input type="number" id="rrhh-salarioBase-${emp.id}" class="ficha-input" value="${emp.salarioBase||''}" placeholder="Según convenio" min="0" step="10"></div>
      </div>
      <button class="btn-accion" style="width:100%;margin-top:12px" onclick="rrhhGuardarEmpleado('${emp.id}')">💾 Guardar empleado</button>
    </div>

    <!-- Complementos salariales + incidencias -->
    <div style="display:flex;flex-direction:column;gap:1rem">
      <div class="ficha-card">
        <div class="ficha-card-header"><span>💶</span> Complementos salariales</div>
        ${emp.complementos.length === 0
          ? `<div style="font-size:.82rem;color:var(--gris-400);padding:10px 0">Sin complementos. Añade pluses y complementos al salario base.</div>`
          : emp.complementos.map((c, i) => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <select class="ficha-input" style="flex:2;font-size:.8rem"
                onchange="EMPRESA_STATE.rrhh.empleados.find(e=>e.id==='${emp.id}').complementos[${i}].nombre=this.options[this.selectedIndex].text;EMPRESA_STATE.rrhh.empleados.find(e=>e.id==='${emp.id}').complementos[${i}].tipo=this.value">
                ${COMPLEMENTOS_TIPO.map(ct => `<option value="${ct.id}" ${c.tipo===ct.id?'selected':''}>${ct.nombre}</option>`).join('')}
              </select>
              <input type="number" class="ficha-input" style="flex:1;text-align:right;font-size:.82rem" value="${c.importe||''}" placeholder="€/mes" min="0"
                oninput="EMPRESA_STATE.rrhh.empleados.find(e=>e.id==='${emp.id}').complementos[${i}].importe=parseFloat(this.value)||0">
              <button class="btn-eliminar-socio" onclick="rrhhEliminarComplemento('${emp.id}',${i});EMPRESA_STATE.rrhh.vistaActiva='empleado';renderGestion()">✕</button>
            </div>`).join('')
        }
        <button class="btn-secundario" style="width:100%;margin-top:8px;justify-content:center;font-size:.8rem"
          onclick="rrhhAgregarComplemento('${emp.id}');EMPRESA_STATE.rrhh.vistaActiva='empleado';renderGestion()">+ Añadir complemento</button>
      </div>

      <div class="ficha-card">
        <div class="ficha-card-header"><span>⚠️</span> Incidencias <span style="margin-left:auto;font-size:.78rem;color:var(--gris-400)">${emp.incidencias.length}</span></div>
        ${emp.incidencias.length === 0
          ? `<div style="font-size:.82rem;color:var(--gris-400);padding:8px 0">Sin incidencias registradas.</div>`
          : emp.incidencias.map(inc => `
            <div style="padding:6px 8px;margin-bottom:4px;background:var(--gris-50);border-radius:var(--radio-sm);border-left:3px solid #f59e0b;font-size:.8rem">
              <strong>${inc.tipo}</strong> · ${inc.desde} → ${inc.hasta}
            </div>`).join('')
        }
        <button class="btn-secundario" style="width:100%;margin-top:8px;justify-content:center;font-size:.8rem"
          onclick="rrhhAgregarIncidencia('${emp.id}');EMPRESA_STATE.rrhh.vistaActiva='empleado';renderGestion()">+ Registrar incidencia</button>
      </div>
    </div>
  </div>`;
}

/* ── Nómina completa con desglose real ────────────────────── */
function vistaNominaEmpleado(empId) {
  const emp = EMPRESA_STATE.rrhh.empleados.find(e => e.id === empId);
  if (!emp) return '<p>Empleado no encontrado</p>';
  const n = calcNomina(emp);
  const conv = EMPRESA_STATE.rrhh.convenio;
  const empresa = EMPRESA_STATE.datos.nombre || 'SimulApp S.L.';
  const cif = EMPRESA_STATE.datos.cifProvisional || 'B-41XXXXXX';
  const f = (v) => v.toFixed(2);

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">🧾 Nómina de ${emp.nombre || 'empleado'}</h3>
    <div style="display:flex;gap:8px">
      <button class="btn-secundario" onclick="mostrarToast('Exportando a Nominasol...','exito')">📤 Exportar a Nominasol</button>
      <button class="btn-secundario" onclick="mostrarToast('Descargando PDF...','exito')">⬇️ PDF</button>
      <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaActiva='panel';renderGestion()">← Volver</button>
    </div>
  </div>

  <!-- Nómina formato oficial -->
  <div class="ficha-card" style="max-width:800px;font-size:.82rem">
    <!-- Cabecera nómina -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border:1.5px solid var(--verde-400);border-radius:var(--radio-md);overflow:hidden;margin-bottom:16px">
      <div style="padding:12px;background:var(--verde-50);border-right:1px solid var(--verde-200)">
        <div style="font-size:.68rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;margin-bottom:4px">Empresa</div>
        <div style="font-weight:700;color:var(--verde-800)">${empresa}</div>
        <div style="font-size:.75rem;color:var(--gris-500)">CIF: ${cif}</div>
        <div style="font-size:.75rem;color:var(--gris-500)">CCC: 41/0001234567</div>
      </div>
      <div style="padding:12px;background:var(--verde-50)">
        <div style="font-size:.68rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;margin-bottom:4px">Trabajador/a</div>
        <div style="font-weight:700;color:var(--verde-800)">${emp.nombre || '—'}</div>
        <div style="font-size:.75rem;color:var(--gris-500)">DNI: ${emp.dni || '—'} · NSS: ${emp.nss || '—'}</div>
        <div style="font-size:.75rem;color:var(--gris-500)">${n.grupo.nombre} · ${emp.jornada || 'Completa'}</div>
      </div>
    </div>

    <!-- DEVENGOS -->
    <div style="margin-bottom:16px">
      <div style="font-size:.72rem;font-weight:700;color:var(--verde-800);text-transform:uppercase;letter-spacing:.06em;padding:6px 8px;background:var(--verde-800);color:white;border-radius:var(--radio-sm) var(--radio-sm) 0 0">
        I. DEVENGOS
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid var(--gris-200)">
        <tr style="border-bottom:1px solid var(--gris-100)">
          <td style="padding:6px 10px">Salario base</td>
          <td style="padding:6px 10px;text-align:right;font-weight:600">${f(n.salBase)} €</td>
        </tr>
        ${(emp.complementos||[]).map(c => `
        <tr style="border-bottom:1px solid var(--gris-100)">
          <td style="padding:6px 10px;color:var(--gris-600)">${c.nombre || c.tipo}</td>
          <td style="padding:6px 10px;text-align:right">${f(parseFloat(c.importe)||0)} €</td>
        </tr>`).join('')}
        <tr style="border-top:2px solid var(--verde-300);background:var(--verde-50)">
          <td style="padding:8px 10px;font-weight:700;color:var(--verde-800)">A. TOTAL DEVENGADO</td>
          <td style="padding:8px 10px;text-align:right;font-weight:700;color:var(--verde-800);font-size:.9rem">${f(n.totalDevengado)} €</td>
        </tr>
      </table>
    </div>

    <!-- DEDUCCIONES -->
    <div style="margin-bottom:16px">
      <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:6px 8px;background:#dc2626;color:white;border-radius:var(--radio-sm) var(--radio-sm) 0 0">
        II. DEDUCCIONES
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid var(--gris-200)">
        <tr style="border-bottom:1px solid var(--gris-100);background:var(--gris-50)">
          <td colspan="3" style="padding:6px 10px;font-weight:600;font-size:.78rem;color:var(--gris-600)">Cotización a la Seguridad Social (cuota obrera)</td>
        </tr>
        <tr style="border-bottom:1px solid var(--gris-50)">
          <td style="padding:4px 10px 4px 20px;color:var(--gris-600)">Contingencias comunes</td>
          <td style="padding:4px 8px;text-align:right;font-size:.75rem;color:var(--gris-400)">${conv.ssObrera.contingenciasComunes}%</td>
          <td style="padding:4px 10px;text-align:right">${f(n.ss.cc)} €</td>
        </tr>
        <tr style="border-bottom:1px solid var(--gris-50)">
          <td style="padding:4px 10px 4px 20px;color:var(--gris-600)">Desempleo${n.esTemporal?' (temporal)':''}</td>
          <td style="padding:4px 8px;text-align:right;font-size:.75rem;color:var(--gris-400)">${n.esTemporal?conv.ssObrera.desempleoTemporal:conv.ssObrera.desempleo}%</td>
          <td style="padding:4px 10px;text-align:right">${f(n.ss.des)} €</td>
        </tr>
        <tr style="border-bottom:1px solid var(--gris-50)">
          <td style="padding:4px 10px 4px 20px;color:var(--gris-600)">Formación Profesional</td>
          <td style="padding:4px 8px;text-align:right;font-size:.75rem;color:var(--gris-400)">${conv.ssObrera.formacionProf}%</td>
          <td style="padding:4px 10px;text-align:right">${f(n.ss.fp)} €</td>
        </tr>
        <tr style="border-bottom:1px solid var(--gris-100)">
          <td style="padding:4px 10px 4px 20px;color:var(--gris-600)">MEI (Mecanismo Equidad Intergeneracional)</td>
          <td style="padding:4px 8px;text-align:right;font-size:.75rem;color:var(--gris-400)">${conv.ssObrera.mei}%</td>
          <td style="padding:4px 10px;text-align:right">${f(n.ss.mei)} €</td>
        </tr>
        <tr style="border-bottom:1px solid var(--gris-100);background:var(--gris-50)">
          <td style="padding:6px 10px;font-weight:600;color:var(--gris-700)" colspan="2">Total S.S. obrera</td>
          <td style="padding:6px 10px;text-align:right;font-weight:600">${f(n.ss.total)} €</td>
        </tr>
        <tr style="border-bottom:1px solid var(--gris-100);background:var(--gris-50)">
          <td colspan="3" style="padding:6px 10px;font-weight:600;font-size:.78rem;color:var(--gris-600)">Retención IRPF</td>
        </tr>
        <tr style="border-bottom:1px solid var(--gris-100)">
          <td style="padding:4px 10px 4px 20px;color:var(--gris-600)">IRPF (base anual estimada: ${f(n.baseAnual)} €)</td>
          <td style="padding:4px 8px;text-align:right;font-size:.75rem;color:var(--gris-400)">${n.irpf.tipo.toFixed(1)}%</td>
          <td style="padding:4px 10px;text-align:right">${f(n.irpf.retencion)} €</td>
        </tr>
        <tr style="border-top:2px solid #fca5a5;background:#fef2f2">
          <td style="padding:8px 10px;font-weight:700;color:#991b1b" colspan="2">B. TOTAL DEDUCCIONES</td>
          <td style="padding:8px 10px;text-align:right;font-weight:700;color:#991b1b;font-size:.9rem">${f(n.totalDeducciones)} €</td>
        </tr>
      </table>
    </div>

    <!-- LÍQUIDO -->
    <div style="padding:14px;background:var(--verde-800);border-radius:var(--radio-md);display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="color:white;font-weight:700;font-size:1rem">LÍQUIDO A PERCIBIR (A − B)</div>
      <div style="color:white;font-weight:800;font-size:1.3rem">${f(n.liquido)} €</div>
    </div>

    <!-- Coste empresa (informativo) -->
    <div style="padding:12px;background:var(--gris-50);border:1px solid var(--gris-200);border-radius:var(--radio-md)">
      <div style="font-size:.72rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">
        📊 Coste total para la empresa (informativo)
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-size:.78rem">
        <div style="padding:6px;background:var(--blanco);border-radius:var(--radio-sm);text-align:center">
          <div style="font-weight:700;color:var(--gris-800)">${f(n.ssEmpresa.cc)} €</div><div style="font-size:.68rem;color:var(--gris-400)">C.C. empresa ${conv.ssEmpresa.contingenciasComunes}%</div>
        </div>
        <div style="padding:6px;background:var(--blanco);border-radius:var(--radio-sm);text-align:center">
          <div style="font-weight:700;color:var(--gris-800)">${f(n.ssEmpresa.des)} €</div><div style="font-size:.68rem;color:var(--gris-400)">Desempleo ${n.esTemporal?conv.ssEmpresa.desempleoTemporal:conv.ssEmpresa.desempleo}%</div>
        </div>
        <div style="padding:6px;background:var(--blanco);border-radius:var(--radio-sm);text-align:center">
          <div style="font-weight:700;color:var(--gris-800)">${f(n.ssEmpresa.at)} €</div><div style="font-size:.68rem;color:var(--gris-400)">AT/EP ${conv.ssEmpresa.accidentesTrabajo}%</div>
        </div>
        <div style="padding:6px;background:var(--blanco);border-radius:var(--radio-sm);text-align:center">
          <div style="font-weight:700;color:var(--gris-800)">${f(n.ssEmpresa.fp)} €</div><div style="font-size:.68rem;color:var(--gris-400)">FP ${conv.ssEmpresa.formacionProf}%</div>
        </div>
        <div style="padding:6px;background:var(--blanco);border-radius:var(--radio-sm);text-align:center">
          <div style="font-weight:700;color:var(--gris-800)">${f(n.ssEmpresa.fog)} €</div><div style="font-size:.68rem;color:var(--gris-400)">FOGASA ${conv.ssEmpresa.fogasa}%</div>
        </div>
        <div style="padding:6px;background:var(--blanco);border-radius:var(--radio-sm);text-align:center">
          <div style="font-weight:700;color:var(--gris-800)">${f(n.ssEmpresa.mei)} €</div><div style="font-size:.68rem;color:var(--gris-400)">MEI ${conv.ssEmpresa.mei}%</div>
        </div>
      </div>
      <div style="margin-top:10px;padding:8px;background:var(--verde-50);border-radius:var(--radio-sm);display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:700;color:var(--verde-800)">Coste total empresa / mes</span>
        <span style="font-weight:800;color:var(--verde-800);font-size:1rem">${f(n.costeTotal)} €</span>
      </div>
    </div>
  </div>`;
}

/* ── Vista convenio editable ──────────────────────────────── */
function vistaConvenio() {
  const conv = EMPRESA_STATE.rrhh.convenio;
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">📖 Convenio colectivo</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">${conv.nombre} · Tablas salariales editables por el docente</p>
    </div>
    <button class="btn-secundario" onclick="EMPRESA_STATE.rrhh.vistaActiva='panel';renderGestion()">← Volver</button>
  </div>

  <div class="grid-2col">
    <div class="ficha-card">
      <div class="ficha-card-header"><span>💶</span> Grupos profesionales y salarios base</div>
      <table style="width:100%;border-collapse:collapse;font-size:.82rem">
        <thead><tr style="border-bottom:2px solid var(--verde-200)">
          <th style="text-align:left;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Grupo</th>
          <th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Salario base (€/mes)</th>
          <th style="text-align:right;padding:6px 8px;font-size:.7rem;color:var(--gris-500)">Antigüedad (€/trienio)</th>
        </tr></thead>
        <tbody>
          ${conv.gruposProfesionales.map((g, i) => `
          <tr style="border-bottom:1px solid var(--gris-50)">
            <td style="padding:6px 8px;font-weight:500">${g.nombre}</td>
            <td style="padding:6px 8px;text-align:right">
              <input type="number" class="ficha-input" style="width:90px;text-align:right;font-size:.82rem;padding:3px 6px"
                value="${g.salarioBase}" min="0" step="10"
                oninput="EMPRESA_STATE.rrhh.convenio.gruposProfesionales[${i}].salarioBase=parseFloat(this.value)||0">
            </td>
            <td style="padding:6px 8px;text-align:right">
              <input type="number" class="ficha-input" style="width:70px;text-align:right;font-size:.82rem;padding:3px 6px"
                value="${g.complementoAntiguedad}" min="0"
                oninput="EMPRESA_STATE.rrhh.convenio.gruposProfesionales[${i}].complementoAntiguedad=parseFloat(this.value)||0">
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="margin-top:8px;font-size:.75rem;color:var(--gris-400)">Pagas: ${conv.pagas} al año · SMI 2025: 1.134 €/mes</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:1rem">
      <div class="ficha-card">
        <div class="ficha-card-header"><span>🏛️</span> Cotizaciones S.S. — Cuota obrera</div>
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
          ${Object.entries(conv.ssObrera).map(([k,v]) => `
          <tr style="border-bottom:1px solid var(--gris-50)">
            <td style="padding:5px 8px;color:var(--gris-600)">${{contingenciasComunes:'Contingencias comunes',desempleo:'Desempleo (indef.)',desempleoTemporal:'Desempleo (temporal)',formacionProf:'Formación Profesional',mei:'MEI'}[k]||k}</td>
            <td style="padding:5px 8px;text-align:right">
              <input type="number" class="ficha-input" style="width:70px;text-align:right;font-size:.82rem;padding:3px 6px"
                value="${v}" min="0" step="0.01"
                oninput="EMPRESA_STATE.rrhh.convenio.ssObrera['${k}']=parseFloat(this.value)||0"> %
            </td>
          </tr>`).join('')}
        </table>
      </div>
      <div class="ficha-card">
        <div class="ficha-card-header"><span>🏢</span> Cotizaciones S.S. — Cuota patronal</div>
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
          ${Object.entries(conv.ssEmpresa).map(([k,v]) => `
          <tr style="border-bottom:1px solid var(--gris-50)">
            <td style="padding:5px 8px;color:var(--gris-600)">${{contingenciasComunes:'Contingencias comunes',desempleo:'Desempleo (indef.)',desempleoTemporal:'Desempleo (temporal)',formacionProf:'Formación Profesional',fogasa:'FOGASA',accidentesTrabajo:'AT y EP',mei:'MEI'}[k]||k}</td>
            <td style="padding:5px 8px;text-align:right">
              <input type="number" class="ficha-input" style="width:70px;text-align:right;font-size:.82rem;padding:3px 6px"
                value="${v}" min="0" step="0.01"
                oninput="EMPRESA_STATE.rrhh.convenio.ssEmpresa['${k}']=parseFloat(this.value)||0"> %
            </td>
          </tr>`).join('')}
        </table>
      </div>
    </div>
  </div>`;
}


function vistaDetalleDept(deptKey) {
  // Si es RRHH, usar el módulo especializado
  if (deptKey === 'rrhh') {
    EMPRESA_STATE.rrhh.vistaRRHH = 'panel';
    return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
      <div></div>
      <button class="btn-secundario" onclick="EMPRESA_STATE.gestion.vistaActiva='panel';renderGestion()">← Volver a departamentos</button>
    </div>` + vistaRRHHCompleta();
  }
  // Resto de departamentos: vista genérica con tareas
  // Redirigir a módulos especializados
  if (deptKey === 'rrhh') return vistaRRHH();
  const g     = EMPRESA_STATE.gestion;
  const esProf = APP.rolActivo !== 'alumno';
  const dept  = DEPTS_BASE.find(d => d.key === deptKey);
  const asig  = g.asignaciones[deptKey];
  const tareas = g.tareas.filter(t => t.departamento === deptKey).sort((a,b) => b.semana - a.semana);
  const dificMap = {basico:'🟢 Básico',intermedio:'🟡 Intermedio',avanzado:'🔴 Avanzado',personalizada:'🔵 Personalizada'};

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:10px;background:var(--verde-800);color:white;font-size:1.2rem;display:flex;align-items:center;justify-content:center">${dept.icono}</div>
      <div>
        <h3 style="font-size:1.1rem;font-weight:700;color:var(--gris-800)">${dept.nombre}</h3>
        <p style="font-size:.8rem;color:var(--gris-500)">
          Responsable: <strong>${asig.alumno || 'Sin asignar'}</strong> · Trimestre ${asig.trimestre}
          ${dept.soft !== '—' ? ` · Software: <strong>${dept.soft}</strong>` : ''}
        </p>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      ${esProf ? `<button class="btn-secundario" onclick="crearTareaPersonalizada('${deptKey}')">+ Tarea personalizada</button>` : ''}
      <button class="btn-secundario" onclick="EMPRESA_STATE.gestion.vistaActiva='panel';renderGestion()">← Volver</button>
    </div>
  </div>

  <!-- Funciones del departamento -->
  <div class="ficha-card" style="margin-bottom:1rem">
    <div class="ficha-card-header"><span>📖</span> Funciones principales del departamento</div>
    <div style="font-size:.82rem;color:var(--gris-700);line-height:1.7">${dept.funcionesGuia.split(' · ').map(f => `<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:4px"><span style="color:var(--verde-500);flex-shrink:0">▸</span> ${f}</div>`).join('')}</div>
    <div style="margin-top:8px;font-size:.75rem;color:var(--gris-500)"><strong>Formación orientativa:</strong> ${dept.formacionGuia}</div>
  </div>

  <!-- Lista de tareas -->
  <div class="ficha-card">
    <div class="ficha-card-header"><span>📋</span> Tareas asignadas <span style="margin-left:auto;font-size:.78rem;color:var(--gris-400)">${tareas.length} tareas</span></div>
    ${tareas.length === 0
      ? `<div style="text-align:center;padding:2rem;color:var(--gris-400)"><div style="font-size:2rem;margin-bottom:8px">📭</div><p>No hay tareas asignadas. El profesor publicará las tareas semanales.</p></div>`
      : `<div style="display:flex;flex-direction:column;gap:8px">
          ${tareas.map(t => {
            const colores = {pendiente:'var(--gris-200)',entregada:'var(--verde-300)',evaluada:'#c4b5fd','en-curso':'#fde68a'};
            const estadoLabel = {pendiente:'Pendiente',entregada:'Entregada',evaluada:'Evaluada '+t.calificacion+'/10','en-curso':'En curso'};
            return `
            <div style="border:1.5px solid ${colores[t.estado]};border-radius:var(--radio-md);overflow:hidden">
              <div style="padding:12px 14px">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px">
                  <div style="font-size:.875rem;font-weight:600;color:var(--gris-800)">${t.titulo}</div>
                  <div style="display:flex;gap:4px;flex-shrink:0;align-items:center">
                    ${t.ce ? t.ce.split(' · ').map(c => `<span class="ra-chip">${c}</span>`).join('') : ''}
                    <span style="font-size:.68rem;padding:2px 8px;border-radius:20px;background:${colores[t.estado]};font-weight:600">${estadoLabel[t.estado]}</span>
                  </div>
                </div>
                <div style="font-size:.8rem;color:var(--gris-600);line-height:1.5;margin-bottom:8px">${t.descripcion}</div>
                <div style="display:flex;gap:12px;font-size:.72rem;color:var(--gris-400)">
                  <span>📅 Semana ${t.semana}</span>
                  <span>${dificMap[t.dificultad]||t.dificultad}</span>
                  ${t.entregable ? `<span>📎 Entregable: ${t.entregable}</span>` : ''}
                </div>

                ${/* Entrega del alumno */
                t.estado === 'pendiente' || t.estado === 'en-curso' ? `
                <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--gris-100)">
                  <div style="font-size:.72rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">✏️ Tu entrega</div>
                  <textarea id="entrega-texto-${t.id}" class="ficha-input" style="min-height:80px;margin-bottom:6px"
                    placeholder="Describe tu trabajo, responde a la situación planteada o explica los pasos que has seguido..."></textarea>
                  <div style="display:flex;align-items:center;gap:8px">
                    <label class="btn-secundario" style="font-size:.78rem;padding:5px 10px;cursor:pointer">
                      📎 Adjuntar archivo
                      <input type="file" id="entrega-file-${t.id}" style="display:none" accept=".pdf,.doc,.docx,.xlsx,.jpg,.png">
                    </label>
                    <div style="flex:1"></div>
                    <button class="btn-accion" style="font-size:.82rem" onclick="entregarTarea('${t.id}')">📤 Entregar</button>
                  </div>
                </div>` : ''}

                ${/* Entrega ya realizada */
                t.entrega ? `
                <div style="margin-top:12px;padding:10px;background:var(--verde-50);border-radius:var(--radio-sm);border:1px solid var(--verde-200)">
                  <div style="font-size:.72rem;font-weight:700;color:var(--verde-700);margin-bottom:4px">✓ Entregado por ${t.entrega.autor} · ${t.entrega.fecha} ${t.entrega.hora}</div>
                  <div style="font-size:.82rem;color:var(--gris-700);white-space:pre-line">${t.entrega.texto}</div>
                  ${t.entrega.archivo ? `<div style="margin-top:6px;font-size:.78rem;color:var(--verde-600)">📎 ${t.entrega.archivo.nombre}</div>` : ''}
                </div>` : ''}

                ${/* Anotación del profesor */
                t.anotacion ? `
                <div style="margin-top:8px;padding:8px 10px;background:#fffbeb;border-radius:var(--radio-sm);border-left:3px solid #f59e0b">
                  <div style="font-size:.68rem;font-weight:700;color:#92400e;margin-bottom:2px">💬 Anotación del docente</div>
                  <div style="font-size:.8rem;color:#78350f">${t.anotacion}</div>
                </div>` : ''}

                ${/* Panel evaluación profesor */
                esProf && t.entrega ? `
                <div style="margin-top:8px;padding:10px;background:#fffdf7;border:1px solid #fde68a;border-radius:var(--radio-sm)">
                  <div style="font-size:.72rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;margin-bottom:6px">👩‍🏫 Evaluación</div>
                  <textarea id="anot-tarea-${t.id}" class="ficha-input" style="min-height:40px;font-size:.82rem;margin-bottom:6px"
                    placeholder="Anotación sobre la entrega...">${t.anotacion||''}</textarea>
                  <div style="display:flex;align-items:center;gap:8px">
                    <label style="font-size:.72rem;font-weight:600;color:var(--gris-500)">Nota:</label>
                    <select id="nota-tarea-${t.id}" class="ficha-input" style="width:70px;font-size:.82rem;padding:4px">
                      <option value="">—</option>
                      ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${t.calificacion===n?'selected':''}>${n}</option>`).join('')}
                    </select>
                    <span style="font-size:.72rem;color:var(--gris-400)">/10</span>
                    <div style="flex:1"></div>
                    <button class="btn-accion" style="font-size:.78rem;padding:5px 12px" onclick="evaluarTarea('${t.id}')">🏅 Evaluar</button>
                  </div>
                </div>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>`
    }
  </div>`;
}

/* ── Vista de rotación ────────────────────────────────────── */
function vistaRotacion() {
  const g = EMPRESA_STATE.gestion;
  const asig = g.asignaciones;
  const keys = ['direccion','rrhh','comercial','contabilidad','fiscal'];

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">🔄 Rotación de departamentos</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">Asigna o rota los alumnos entre departamentos · Trimestre ${g.trimestreActual}</p>
    </div>
    <button class="btn-secundario" onclick="EMPRESA_STATE.gestion.vistaActiva='panel';renderGestion()">← Volver</button>
  </div>

  <div class="ficha-card" style="max-width:700px">
    <div class="ficha-card-header"><span>👥</span> Asignación actual</div>
    <div style="font-size:.78rem;color:var(--gris-500);margin-bottom:12px">
      Escribe el nombre del alumno/a en cada departamento. Al confirmar la rotación, cada alumno pasará al siguiente departamento.
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${keys.map(k => {
        const d = DEPTS_BASE.find(d => d.key === k);
        return `
        <div style="display:flex;align-items:center;gap:10px;padding:8px;background:${k==='direccion'?'var(--verde-50)':'var(--gris-50)'};border-radius:var(--radio-md)">
          <div style="width:32px;height:32px;border-radius:8px;background:${k==='direccion'?'var(--verde-800)':'var(--verde-100)'};color:${k==='direccion'?'white':'var(--verde-800)'};font-size:.9rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">${d.icono}</div>
          <div style="width:150px;font-size:.82rem;font-weight:600;color:var(--gris-800)">${d.nombre}</div>
          <input type="text" class="ficha-input" style="flex:1;font-size:.85rem"
            placeholder="Nombre del alumno/a"
            value="${asig[k].alumno}"
            oninput="EMPRESA_STATE.gestion.asignaciones['${k}'].alumno=this.value">
          <span style="font-size:.72rem;color:var(--gris-400);white-space:nowrap">T${asig[k].trimestre}</span>
        </div>`;
      }).join('')}
    </div>

    <div style="display:flex;gap:8px;margin-top:16px;padding-top:12px;border-top:1px solid var(--gris-100)">
      <button class="btn-accion" style="flex:1" onclick="confirmarRotacion()">🔄 Confirmar rotación (avanzar trimestre)</button>
      <button class="btn-secundario" onclick="EMPRESA_STATE.gestion.vistaActiva='panel';renderGestion()">Guardar sin rotar</button>
    </div>
  </div>`;
}


/* ============================================================
   VISTA HUB — PROGRAMAS DE GESTIÓN
   ============================================================ */
