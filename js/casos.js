const CASOS_BIBLIOTECA = [

  // ── BLOQUE: ECONOMÍA Y FINANZAS ───────────────────────────
  {
    id:'c_ratio_end', bloque:'financiero', bloqueLabel:'Economía y finanzas', bloqueColor:'#b45309',
    ra:'RA4', ce:'RA4d', dificultad:'media', icono:'🏦', minutos:15,
    titulo:'¿Aceptamos el préstamo?',
    contexto: () => {
      const fa = EMPRESA_STATE.planEmpresa.ap7.financiacion.filter(f=>f.tipo==='Financiación ajena').reduce((s,f)=>s+(parseFloat(f.importe)||0),0);
      const fp = EMPRESA_STATE.planEmpresa.ap7.financiacion.filter(f=>f.tipo==='Fondos propios'||f.tipo==='Subvención').reduce((s,f)=>s+(parseFloat(f.importe)||0),0);
      const re = fp>0 ? (fa/fp).toFixed(2) : '—';
      const inv = EMPRESA_STATE.planEmpresa.ap7.inversion.reduce((s,i)=>s+(parseFloat(i.importe)||0),0);
      return `El banco os propone un préstamo adicional de ${(inv*0.3).toLocaleString('es-ES',{maximumFractionDigits:0})} € a 5 años con un interés del 6,5% TAE. Vuestra empresa tiene actualmente un ratio de endeudamiento de <strong>${re}</strong> y una tesorería que cubre ${re!=='—'&&parseFloat(re)>1.5?'menos de':'más de'} 3 meses de gastos fijos.`;
    },
    datosContexto: () => {
      const fa = EMPRESA_STATE.planEmpresa.ap7.financiacion.filter(f=>f.tipo==='Financiación ajena').reduce((s,f)=>s+(parseFloat(f.importe)||0),0);
      const fp = EMPRESA_STATE.planEmpresa.ap7.financiacion.filter(f=>f.tipo==='Fondos propios'||f.tipo==='Subvención').reduce((s,f)=>s+(parseFloat(f.importe)||0),0);
      return { ratioEnd: fp>0?(fa/fp):null, fa, fp };
    },
    pasos: [
      { id:'s1', pregunta:'¿Cuál es vuestro ratio de endeudamiento actual? Calcula FA ÷ FP con los datos de vuestro plan.', tipo:'abierta', pista:'Busca en Plan de empresa → Ap.7 → Inversión y financiación. Ratio = Financiación ajena ÷ Fondos propios.' },
      { id:'s2', pregunta:'¿Qué significa ese ratio? ¿Se considera alto, moderado o bajo? Razona con valores de referencia.', tipo:'abierta', pista:'Un ratio ≤1 indica equilibrio; entre 1 y 1,5 es aceptable; >1,5 supone dependencia elevada de terceros.' },
      { id:'s3', pregunta:'¿Aceptáis el préstamo? Justificad la decisión con al menos dos argumentos financieros.', tipo:'decision', opciones:['Sí, lo aceptamos','No lo aceptamos','Lo aceptamos con condiciones'], pista:'Considerad: ¿para qué se usaría el préstamo? ¿Mejoraría la rentabilidad económica? ¿Podéis asumir la cuota mensual?' },
      { id:'s4', pregunta:'Si lo aceptáis, ¿qué impacto tendría en el balance de situación y en la cuenta de resultados? Indica las cuentas contables que se verían afectadas.', tipo:'abierta', pista:'Cuenta 170 (deuda LP) en el haber del balance. Los intereses irán a la cuenta de gastos financieros (666) y reducirán el BAI.' },
    ],
    logicaCorreccion: (respuestas, datos) => {
      const r = {};
      const re = datos.ratioEnd;
      const s1 = (respuestas.s1?.texto||'').toLowerCase();
      const s2 = (respuestas.s2?.texto||'').toLowerCase();
      const s3dec = respuestas.s3?.decision || '';
      const s3txt = (respuestas.s3?.texto||'').toLowerCase();
      const s4 = (respuestas.s4?.texto||'').toLowerCase();
      // Paso 1
      r.s1 = re!==null && (s1.includes(re?.toFixed(1)) || s1.includes(re?.toFixed(2)) || s1.includes('endeudamiento') || s1.includes('ratio'))
        ? { ok:true,  feedback:'✓ Correcto. Has localizado el ratio de endeudamiento.' }
        : { ok:false, feedback:`La respuesta debería incluir el cálculo del ratio. Con tus datos, FA/FP = ${re!==null?re.toFixed(2):'—'}.` };
      // Paso 2
      r.s2 = (s2.includes('alto') || s2.includes('elevado') || s2.includes('moderado') || s2.includes('bajo') || s2.includes('referencia') || s2.includes('1,5') || s2.includes('1.5'))
        ? { ok:true,  feedback:'✓ Bien. Has interpretado el ratio comparándolo con valores de referencia.' }
        : { ok:false, feedback:'La interpretación debe mencionar si el ratio es alto, moderado o bajo respecto a la referencia (≤1 equilibrado, >1,5 elevado).' };
      // Paso 3
      if (re !== null && re > 1.5) {
        r.s3 = s3dec === 'No lo aceptamos' || s3dec.includes('condiciones')
          ? { ok:true,  feedback:'✓ Coherente con un ratio de endeudamiento alto. Rechazar o condicionar el préstamo es la decisión más prudente.' }
          : { ok:false, feedback:`⚠️ Atención: vuestro ratio ya es ${re.toFixed(2)} (>1,5). Aceptar más deuda sin condiciones aumentaría la dependencia financiera. La respuesta debería justificar mejor este riesgo.` };
      } else if (re !== null && re <= 1) {
        r.s3 = s3dec === 'Sí, lo aceptamos' || s3dec.includes('condiciones')
          ? { ok:true,  feedback:'✓ Con un ratio bajo, asumir financiación externa para invertir en crecimiento es razonable.' }
          : { ok:'neutral', feedback:'La decisión es válida, pero con un ratio bajo también sería lógico aceptar el préstamo para financiar inversiones productivas.' };
      } else {
        r.s3 = (s3txt.length > 40)
          ? { ok:'neutral', feedback:'Respuesta recibida. La decisión es razonable si los argumentos son sólidos.' }
          : { ok:false, feedback:'Justifica la decisión con al menos dos argumentos financieros concretos.' };
      }
      // Paso 4
      r.s4 = (s4.includes('170') || s4.includes('pasivo') || s4.includes('balance')) && (s4.includes('666') || s4.includes('gasto') || s4.includes('interés') || s4.includes('interes') || s4.includes('bai') || s4.includes('resultados'))
        ? { ok:true,  feedback:'✓ Excelente. Has identificado el impacto en balance (170) y en la cuenta de resultados (gastos financieros → BAI).' }
        : { ok:false, feedback:'Falta mencionar: el préstamo aparece en el pasivo no corriente (cta. 170) del balance, y los intereses anuales reducen el BAI en la cuenta de resultados (cta. 666).' };
      return r;
    },
  },

  {
    id:'c_umbral', bloque:'financiero', bloqueLabel:'Economía y finanzas', bloqueColor:'#b45309',
    ra:'RA4', ce:'RA4g', dificultad:'media', icono:'⚖️', minutos:15,
    titulo:'El mes en que empezamos a ganar dinero',
    contexto: () => {
      const cf = EMPRESA_STATE.planEmpresa.ap7.gastos.fijos.reduce((s,g)=>s+(parseFloat(g.importe)||0),0);
      const pv = EMPRESA_STATE.planEmpresa.ap7.gastos.variables.reduce((s,g)=>s+(parseFloat(g.pctSobreVentas)||0),0);
      const umbral = pv<100 ? cf/(1-pv/100) : 0;
      const v1 = EMPRESA_STATE.planEmpresa.ap7.ventas.productos.reduce((s,p)=>(parseFloat(p.precioUnitario)||0)*(parseFloat(p.unidadesBase)||0)+s,0);
      return `Vuestros costes fijos mensuales son <strong>${cf.toLocaleString('es-ES',{maximumFractionDigits:0})} €</strong> y los costes variables representan el <strong>${pv.toFixed(1)}%</strong> de las ventas. Vuestras ventas base mensuales previstas son <strong>${v1.toLocaleString('es-ES',{maximumFractionDigits:0})} €</strong>.`;
    },
    datosContexto: () => {
      const cf = EMPRESA_STATE.planEmpresa.ap7.gastos.fijos.reduce((s,g)=>s+(parseFloat(g.importe)||0),0);
      const pv = EMPRESA_STATE.planEmpresa.ap7.gastos.variables.reduce((s,g)=>s+(parseFloat(g.pctSobreVentas)||0),0);
      const v1 = EMPRESA_STATE.planEmpresa.ap7.ventas.productos.reduce((s,p)=>(parseFloat(p.precioUnitario)||0)*(parseFloat(p.unidadesBase)||0)+s,0);
      return { cf, pv, umbral: pv<100?cf/(1-pv/100):0, ventasMes:v1 };
    },
    pasos: [
      { id:'s1', pregunta:'Calcula el umbral de rentabilidad mensual de vuestra empresa usando la fórmula CF ÷ (1 − CV%).', tipo:'abierta', pista:'CF = costes fijos mensuales. CV% = porcentaje de costes variables sobre ventas. El resultado te da las ventas mínimas para no perder dinero.' },
      { id:'s2', pregunta:'¿Vuestras ventas previstas superan el umbral? ¿En qué porcentaje?', tipo:'abierta', pista:'Compara las ventas base mensuales con el umbral. Si ventas > umbral, hay beneficio. El margen de seguridad = (ventas - umbral) / ventas × 100.' },
      { id:'s3', pregunta:'Si en el primer mes solo vendéis el 60% de lo previsto, ¿cubriríais los costes fijos? ¿Qué haríais para compensarlo?', tipo:'abierta', pista:'Calcula el 60% de las ventas previstas y compara con el umbral. ¿Hay déficit? ¿Reduciríais costes, aumentaríais precios, haríais promoción?' },
      { id:'s4', pregunta:'¿Cómo reflejaríais una pérdida mensual en la cuenta de resultados previsional? Indica qué cuenta del PGC verías afectada.', tipo:'abierta', pista:'Las pérdidas del ejercicio aparecen en la cuenta 129 (Resultado del ejercicio) con saldo acreedor negativo.' },
    ],
    logicaCorreccion: (respuestas, datos) => {
      const r = {};
      const { cf, pv, umbral, ventasMes } = datos;
      const s1 = (respuestas.s1?.texto||'').toLowerCase().replace(/\./g,'').replace(/,/g,'.');
      const s2 = (respuestas.s2?.texto||'').toLowerCase();
      const s3 = (respuestas.s3?.texto||'').toLowerCase();
      const s4 = (respuestas.s4?.texto||'').toLowerCase();
      const umbralStr = umbral.toFixed(0);
      r.s1 = (s1.includes(umbralStr.slice(0,-2)) || s1.includes('umbral') || s1.includes('punto muerto') || s1.includes('/(1-') || s1.includes('/ (1 -'))
        ? { ok:true,  feedback:`✓ El umbral de rentabilidad de vuestra empresa es ${umbral.toLocaleString('es-ES',{maximumFractionDigits:0})} €/mes.` }
        : { ok:false, feedback:`El resultado correcto es ${umbral.toLocaleString('es-ES',{maximumFractionDigits:0})} € = ${cf.toLocaleString('es-ES',{maximumFractionDigits:0})} ÷ (1 − ${(pv/100).toFixed(2)}).` };
      r.s2 = ventasMes > umbral
        ? (s2.includes('sí') || s2.includes('si') || s2.includes('supera') || s2.includes('superior') || s2.includes('%') || s2.includes('por ciento'))
          ? { ok:true,  feedback:`✓ Correcto. Vuestras ventas (${ventasMes.toLocaleString('es-ES',{maximumFractionDigits:0})} €) superan el umbral en un ${((ventasMes-umbral)/ventasMes*100).toFixed(1)}%.` }
          : { ok:false, feedback:`Las ventas previstas (${ventasMes.toLocaleString('es-ES',{maximumFractionDigits:0})} €) sí superan el umbral (${umbral.toLocaleString('es-ES',{maximumFractionDigits:0})} €). El margen de seguridad es del ${((ventasMes-umbral)/ventasMes*100).toFixed(1)}%.` }
        : { ok:'neutral', feedback:`Vuestras ventas previstas (${ventasMes.toLocaleString('es-ES',{maximumFractionDigits:0})} €) están por debajo del umbral (${umbral.toLocaleString('es-ES',{maximumFractionDigits:0})} €). Esto es importante para el plan de viabilidad.` };
      r.s3 = (s3.includes('no') || s3.includes('déficit') || s3.includes('deficit') || s3.includes('pérdida') || s3.includes('perdida') || s3.includes('60')) && s3.length > 40
        ? { ok:true,  feedback:'✓ Bien. Has analizado el escenario adverso y propuesto medidas correctoras.' }
        : { ok:false, feedback:`Con el 60%, ventas = ${(ventasMes*0.6).toLocaleString('es-ES',{maximumFractionDigits:0})} €. ${ventasMes*0.6<umbral?'Estaríais por debajo del umbral (pérdidas). Deberíais proponer medidas concretas: reducir costes variables, hacer promoción, ofrecer descuentos por volumen...':'Seguiríais por encima del umbral, pero con menos margen.'}` };
      r.s4 = (s4.includes('129') || s4.includes('resultado') || s4.includes('pérdidas y ganancias') || s4.includes('p y g') || s4.includes('cuenta de resultados'))
        ? { ok:true,  feedback:'✓ Correcto. Las pérdidas se registran en la cuenta 129 (Resultado del ejercicio) y en la cuenta de pérdidas y ganancias.' }
        : { ok:false, feedback:'La pérdida mensual se refleja en la cuenta 129 (Resultado del ejercicio) con saldo negativo, y en la Cuenta de Pérdidas y Ganancias reduciendo el resultado neto.' };
      return r;
    },
  },

  // ── BLOQUE: FISCAL Y LEGAL ────────────────────────────────
  {
    id:'c_mod303', bloque:'fiscal', bloqueLabel:'Fiscal y legal', bloqueColor:'#7c3aed',
    ra:'RA5', ce:'RA5e', dificultad:'alta', icono:'⚖️', minutos:20,
    titulo:'¿Cuánto le debemos a Hacienda este trimestre?',
    contexto: () => {
      const ap7 = EMPRESA_STATE.planEmpresa.ap7;
      const ventas = ap7.ventas.productos.reduce((s,p)=>(parseFloat(p.precioUnitario)||0)*(parseFloat(p.unidadesBase)||0)+s,0)*3;
      const compras = ap7.gastos.variables.filter(g=>g.concepto.toLowerCase().includes('aprovisionamiento')||g.concepto.toLowerCase().includes('compra')).reduce((s,g)=>s+ventas*(parseFloat(g.pctSobreVentas)||0)/100,0);
      const ivaRepercutido = ventas*0.21;
      const ivaSoportado = compras*0.21;
      return `Durante el primer trimestre vuestra empresa ha facturado <strong>${ventas.toLocaleString('es-ES',{maximumFractionDigits:0})} €</strong> (sin IVA) y ha comprado materiales y servicios por <strong>${compras.toLocaleString('es-ES',{maximumFractionDigits:0})} €</strong> (sin IVA). El tipo de IVA aplicado es el 21% en todas las operaciones.`;
    },
    datosContexto: () => {
      const ap7 = EMPRESA_STATE.planEmpresa.ap7;
      const ventas = ap7.ventas.productos.reduce((s,p)=>(parseFloat(p.precioUnitario)||0)*(parseFloat(p.unidadesBase)||0)+s,0)*3;
      const compras = ap7.gastos.variables.reduce((s,g)=>s+ventas*(parseFloat(g.pctSobreVentas)||0)/100,0)*0.6;
      return { ventas, compras, ivaRep:ventas*0.21, ivaSop:compras*0.21, cuota:ventas*0.21-compras*0.21 };
    },
    pasos: [
      { id:'s1', pregunta:'Calcula el IVA repercutido del trimestre (el que habéis cobrado a vuestros clientes).', tipo:'abierta', pista:'IVA repercutido = Base imponible de ventas × tipo de IVA. Este es el IVA que habéis cobrado a los clientes y que debéis ingresar a Hacienda.' },
      { id:'s2', pregunta:'Calcula el IVA soportado (el que habéis pagado a vuestros proveedores y que podéis deducir).', tipo:'abierta', pista:'IVA soportado = Base imponible de compras × tipo de IVA. Solo es deducible si tenéis factura correcta del proveedor.' },
      { id:'s3', pregunta:'¿Cuál es la cuota del Modelo 303? ¿A ingresar o a devolver? Razona el resultado.', tipo:'decision', opciones:['A ingresar (IVA rep > IVA sop)','A devolver (IVA sop > IVA rep)','Resultado cero'], pista:'Cuota = IVA repercutido − IVA soportado. Si es positivo, pagáis a Hacienda. Si es negativo, Hacienda os devuelve (normalmente se compensa en el siguiente trimestre).' },
      { id:'s4', pregunta:'¿En qué plazo debéis presentar el Modelo 303 del primer trimestre? ¿Y si tenéis saldo a vuestro favor, qué opciones tenéis?', tipo:'abierta', pista:'El 303 del 1T se presenta entre el 1 y el 20 de abril. Si el resultado es a vuestro favor podéis compensarlo en trimestres siguientes o solicitar la devolución en el 4T (mes de enero del año siguiente).' },
    ],
    logicaCorreccion: (respuestas, datos) => {
      const r = {};
      const { ventas, compras, ivaRep, ivaSop, cuota } = datos;
      const s1 = (respuestas.s1?.texto||'').toLowerCase().replace(/\./g,'').replace(/,/g,'.');
      const s2 = (respuestas.s2?.texto||'').toLowerCase().replace(/\./g,'').replace(/,/g,'.');
      const s3dec = respuestas.s3?.decision || '';
      const s4 = (respuestas.s4?.texto||'').toLowerCase();
      r.s1 = s1.includes(Math.round(ivaRep).toString()) || s1.includes('repercutido') || s1.includes('cobrado')
        ? { ok:true,  feedback:`✓ IVA repercutido correcto: ${ivaRep.toLocaleString('es-ES',{maximumFractionDigits:0})} € (${ventas.toLocaleString('es-ES',{maximumFractionDigits:0})} € × 21%).` }
        : { ok:false, feedback:`IVA repercutido = ${ventas.toLocaleString('es-ES',{maximumFractionDigits:0})} € × 21% = ${ivaRep.toLocaleString('es-ES',{maximumFractionDigits:0})} €.` };
      r.s2 = s2.includes(Math.round(ivaSop).toString()) || s2.includes('soportado') || s2.includes('deducible')
        ? { ok:true,  feedback:`✓ IVA soportado correcto: ${ivaSop.toLocaleString('es-ES',{maximumFractionDigits:0})} € (${compras.toLocaleString('es-ES',{maximumFractionDigits:0})} € × 21%).` }
        : { ok:false, feedback:`IVA soportado = ${compras.toLocaleString('es-ES',{maximumFractionDigits:0})} € × 21% = ${ivaSop.toLocaleString('es-ES',{maximumFractionDigits:0})} €.` };
      r.s3 = cuota > 0
        ? s3dec.includes('ingresar') ? { ok:true, feedback:`✓ Correcto. Cuota neta = ${cuota.toLocaleString('es-ES',{maximumFractionDigits:0})} € A INGRESAR.` } : { ok:false, feedback:`El resultado es positivo (${cuota.toLocaleString('es-ES',{maximumFractionDigits:0})} €), es decir, A INGRESAR a Hacienda.` }
        : s3dec.includes('devolver') ? { ok:true, feedback:`✓ Correcto. Resultado negativo = a vuestro favor.` } : { ok:false, feedback:`El resultado es negativo, es decir, A DEVOLVER o compensar.` };
      r.s4 = (s4.includes('20 de abril') || s4.includes('april') || s4.includes('1-20') || s4.includes('20 abril')) || (s4.includes('compensar') || s4.includes('devolución') || s4.includes('devolucion') || s4.includes('enero'))
        ? { ok:true, feedback:'✓ Correcto. Plazo 1-20 de abril para el 1T. Saldo a favor: se compensa en siguientes trimestres o se solicita devolución en el Mod. 303 anual (enero).' }
        : { ok:false, feedback:'Plazo de presentación: del 1 al 20 de abril (1T). Si el resultado es a devolver, se compensa en trimestres siguientes o se pide devolución en la autoliquidación de enero.' };
      return r;
    },
  },

  // ── BLOQUE: RRHH Y LABORAL ────────────────────────────────
  {
    id:'c_despido', bloque:'rrhh', bloqueLabel:'RRHH y laboral', bloqueColor:'#1e40af',
    ra:'RA6', ce:'RA6c', dificultad:'alta', icono:'👥', minutos:20,
    titulo:'Un empleado solicita la baja voluntaria',
    contexto: () => {
      const empleados = EMPRESA_STATE.rrhh.empleados;
      const emp = empleados[0];
      const sb = emp ? parseFloat(emp.salarioBase)||1300 : 1300;
      const nombre = emp ? emp.nombre || 'un trabajador' : 'un trabajador';
      return `${nombre.split(' ')[0]} (salario base: ${sb.toLocaleString('es-ES',{maximumFractionDigits:0})} €/mes, contrato ${emp?.tipoContrato||'indefinido'}) os comunica su baja voluntaria con efectos a fin de mes. Lleva 14 meses trabajando en la empresa. Tiene 5 días de vacaciones no disfrutadas y os quedan por abonar 10 días de la paga extra.`;
    },
    datosContexto: () => {
      const emp = EMPRESA_STATE.rrhh.empleados[0];
      const sb = emp ? parseFloat(emp.salarioBase)||1300 : 1300;
      return { sb, diasVac:5, diasExtra:10, meses:14 };
    },
    pasos: [
      { id:'s1', pregunta:'¿Qué documento debe firmar el trabajador para formalizar la baja voluntaria? ¿Qué plazo de preaviso establece el convenio?', tipo:'abierta', pista:'La baja voluntaria requiere carta de dimisión. El plazo de preaviso habitual en el convenio de comercio es de 15 días. Si no se respeta, la empresa puede descontar los días del finiquito.' },
      { id:'s2', pregunta:'Calcula los conceptos del finiquito: vacaciones pendientes y parte proporcional de paga extra.', tipo:'abierta', pista:'Vacaciones: (salario diario × días pendientes). Salario diario = salario base × 12 ÷ 365. Paga extra proporcional: (salario base ÷ 365 × días del período).' },
      { id:'s3', pregunta:'¿Tiene derecho este trabajador a prestación por desempleo? Razona la respuesta.', tipo:'decision', opciones:['Sí, tiene derecho','No tiene derecho','Depende de la situación'], pista:'La baja voluntaria NO genera derecho a prestación por desempleo, ya que no es una situación de desempleo involuntario. Solo se cobran vacaciones y partes proporcionales.' },
      { id:'s4', pregunta:'¿Qué trámites debe hacer la empresa ante la Seguridad Social tras la baja del trabajador? Indica el modelo y el plazo.', tipo:'abierta', pista:'La empresa debe comunicar la baja del trabajador en la TGSS mediante el Modelo TA.2 (o SEL-022 electrónico) en el plazo de 3 días desde la fecha de cese.' },
    ],
    logicaCorreccion: (respuestas, datos) => {
      const r = {};
      const { sb, diasVac, diasExtra, meses } = datos;
      const sdDiario = sb*12/365;
      const finVac = sdDiario * diasVac;
      const finExtra = sdDiario * diasExtra;
      const s1 = (respuestas.s1?.texto||'').toLowerCase();
      const s2 = (respuestas.s2?.texto||'').toLowerCase().replace(/\./g,'').replace(/,/g,'.');
      const s3dec = respuestas.s3?.decision || '';
      const s4 = (respuestas.s4?.texto||'').toLowerCase();
      r.s1 = (s1.includes('carta') || s1.includes('dimisión') || s1.includes('dimision') || s1.includes('preaviso') || s1.includes('15 días') || s1.includes('15 dias'))
        ? { ok:true,  feedback:'✓ Correcto. Carta de dimisión + respeto del preaviso (generalmente 15 días en convenio comercio).' }
        : { ok:false, feedback:'El trabajador debe entregar carta de dimisión. El convenio de comercio establece 15 días de preaviso. Si no se respeta, la empresa puede descontar esos días del finiquito.' };
      r.s2 = (s2.includes(Math.round(finVac).toString()) || s2.includes(Math.round(finVac+finExtra).toString()) || s2.includes('salario diario') || s2.includes('proporcional'))
        ? { ok:true,  feedback:`✓ Cálculo correcto. Vacaciones: ${finVac.toFixed(2)} €. Paga extra proporcional: ${finExtra.toFixed(2)} €. Total finiquito aprox.: ${(finVac+finExtra).toFixed(2)} €.` }
        : { ok:false, feedback:`Salario diario: ${sb} × 12 ÷ 365 = ${sdDiario.toFixed(2)} €/día. Vacaciones: ${sdDiario.toFixed(2)} × ${diasVac} = ${finVac.toFixed(2)} €. Paga extra: ${sdDiario.toFixed(2)} × ${diasExtra} = ${finExtra.toFixed(2)} €.` };
      r.s3 = s3dec === 'No tiene derecho'
        ? { ok:true,  feedback:'✓ Correcto. La baja voluntaria no genera derecho a prestación de desempleo (no es situación legal de desempleo involuntario).' }
        : { ok:false, feedback:'La baja voluntaria NO genera derecho a prestación por desempleo. Solo en situaciones involuntarias (despido, ERE, fin de contrato temporal) se puede acceder al SEPE.' };
      r.s4 = (s4.includes('ta.2') || s4.includes('ta-2') || s4.includes('sel') || s4.includes('tgss') || s4.includes('seguridad social') || s4.includes('baja') || s4.includes('3 días') || s4.includes('3 dias'))
        ? { ok:true,  feedback:'✓ Correcto. Comunicar baja en TGSS (TA.2 / vía SILTRA/SEPE online) en plazo de 3 días hábiles desde la fecha de cese.' }
        : { ok:false, feedback:'La empresa debe comunicar la baja del trabajador en la TGSS mediante el TA.2 (SILTRA) en un plazo máximo de 3 días hábiles desde la fecha efectiva de cese.' };
      return r;
    },
  },

  // ── BLOQUE: GESTIÓN COMERCIAL ─────────────────────────────
  {
    id:'c_precio', bloque:'comercial', bloqueLabel:'Gestión comercial', bloqueColor:'#9333ea',
    ra:'RA2', ce:'RA2d', dificultad:'baja', icono:'🏷️', minutos:12,
    titulo:'¿A qué precio vendemos?',
    contexto: () => {
      const prods = EMPRESA_STATE.planEmpresa.ap7.ventas.productos;
      const p = prods[0];
      const costeVariable = EMPRESA_STATE.planEmpresa.ap7.gastos.variables.filter(g=>g.concepto.toLowerCase().includes('aprovisionamiento')||g.concepto.toLowerCase().includes('compra')).reduce((s,g)=>s+(parseFloat(g.pctSobreVentas)||0),0);
      if (p) return `Vuestro producto principal es <strong>"${p.nombre}"</strong>, con un precio de venta de <strong>${p.precioUnitario} €</strong>. El coste de aprovisionamiento representa el <strong>${costeVariable.toFixed(0)}%</strong> del precio de venta. Un competidor acaba de lanzar el mismo producto a ${(parseFloat(p.precioUnitario)*0.88).toFixed(2)} € (-12%).`;
      return 'Vuestra empresa vende un producto/servicio con costes variables del 40% sobre el precio de venta. Un competidor acaba de bajar su precio un 12%.';
    },
    datosContexto: () => {
      const prods = EMPRESA_STATE.planEmpresa.ap7.ventas.productos;
      const p = prods[0];
      const cvPct = EMPRESA_STATE.planEmpresa.ap7.gastos.variables.filter(g=>g.concepto.toLowerCase().includes('aprovisionamiento')||g.concepto.toLowerCase().includes('compra')).reduce((s,g)=>s+(parseFloat(g.pctSobreVentas)||0),0) || 40;
      const pvp = p ? parseFloat(p.precioUnitario)||50 : 50;
      return { pvp, cvPct, competidor: pvp*0.88 };
    },
    pasos: [
      { id:'s1', pregunta:'Calcula el margen de contribución unitario actual (precio − coste variable unitario). ¿Es suficiente para cubrir los costes fijos?', tipo:'abierta', pista:'Margen de contribución = PVP − CV unitario. CV unitario = PVP × (CV% / 100). Cuantos más productos vendas, más contribuyes a cubrir los costes fijos.' },
      { id:'s2', pregunta:'¿Debéis bajar el precio para igualar al competidor? Analizad el impacto en el margen y en el umbral de rentabilidad.', tipo:'decision', opciones:['Sí, bajamos el precio','No bajamos el precio','Lo analizamos caso por caso'], pista:'Si bajáis el precio, el margen de contribución disminuye y necesitaréis vender más unidades para cubrir los costes fijos. ¿Tenéis capacidad para eso?' },
      { id:'s3', pregunta:'Proponé dos estrategias alternativas a bajar el precio para mantener vuestra cuota de mercado.', tipo:'abierta', pista:'Diferenciación: calidad, servicio posventa, garantía, personalización, entrega rápida, marca... La guerra de precios suele perjudicar a todos los competidores.' },
    ],
    logicaCorreccion: (respuestas, datos) => {
      const r = {};
      const { pvp, cvPct, competidor } = datos;
      const cvUnit = pvp*cvPct/100;
      const mc = pvp - cvUnit;
      const s1 = (respuestas.s1?.texto||'').toLowerCase().replace(/\./g,'').replace(/,/g,'.');
      const s2dec = respuestas.s2?.decision||'';
      const s3 = (respuestas.s3?.texto||'').toLowerCase();
      r.s1 = s1.includes(Math.round(mc).toString()) || s1.includes('margen') || s1.includes('contribución') || s1.includes('contribucion')
        ? { ok:true,  feedback:`✓ Margen de contribución unitario: ${mc.toFixed(2)} € (${((mc/pvp)*100).toFixed(1)}% del precio).` }
        : { ok:false, feedback:`MC = ${pvp} − (${pvp} × ${cvPct}%) = ${pvp} − ${cvUnit.toFixed(2)} = ${mc.toFixed(2)} €/unidad.` };
      r.s2 = s2dec === 'No bajamos el precio' || s2dec.includes('caso')
        ? { ok:true, feedback:'✓ Prudente. Bajar el precio reduce el margen. Primero habría que analizar si se puede compensar con mayor volumen o si hay otra ventaja diferencial.' }
        : { ok:'neutral', feedback:'Bajar el precio puede ser válido si se gana volumen suficiente. Pero recalcula el umbral con el nuevo precio: necesitaréis vender más para cubrir los mismos costes fijos.' };
      r.s3 = s3.length > 60 && (s3.includes('calidad') || s3.includes('servicio') || s3.includes('diferenci') || s3.includes('garantía') || s3.includes('garantia') || s3.includes('fideliz') || s3.includes('marca') || s3.includes('personaliz'))
        ? { ok:true, feedback:'✓ Buenas alternativas. La diferenciación no basada en precio es más sostenible a largo plazo que la guerra de precios.' }
        : { ok:false, feedback:'Proponed estrategias concretas: diferenciación por calidad, servicio posventa superior, fidelización, personalización del producto, garantías más amplias, entrega más rápida...' };
      return r;
    },
  },

  // ── BLOQUE: CONSTITUCIÓN ─────────────────────────────────
  {
    id:'c_forma_juridica', bloque:'empresa', bloqueLabel:'Constitución y jurídico', bloqueColor:'#134a28',
    ra:'RA3', ce:'RA3e', dificultad:'baja', icono:'📑', minutos:10,
    titulo:'Elegir la forma jurídica correcta',
    contexto: () => {
      const socios = EMPRESA_STATE.planEmpresa.ap2?.socios?.length || 3;
      const capital = EMPRESA_STATE.planEmpresa.ap2?.socios?.reduce((s,x)=>s+(parseFloat(x.aportacion)||0),0) || 9000;
      return `Vuestro grupo está formado por <strong>${socios} socios</strong> con un capital total aportado de <strong>${capital.toLocaleString('es-ES',{maximumFractionDigits:0})} €</strong>. Queréis limitar la responsabilidad de cada socio a su aportación y no queréis que vuestras participaciones coticen en bolsa.`;
    },
    datosContexto: () => {
      const socios = EMPRESA_STATE.planEmpresa.ap2?.socios?.length || 3;
      const capital = EMPRESA_STATE.planEmpresa.ap2?.socios?.reduce((s,x)=>s+(parseFloat(x.aportacion)||0),0) || 9000;
      return { socios, capital };
    },
    pasos: [
      { id:'s1', pregunta:'¿Qué forma jurídica habéis elegido para vuestra empresa? Justificad por qué es la más adecuada dada vuestra situación.', tipo:'abierta', pista:'Considerad: número de socios, capital disponible, responsabilidad deseada, complejidad de gestión y fiscalidad.' },
      { id:'s2', pregunta:'¿Cuál es el capital mínimo legal para una Sociedad Limitada? ¿Vuestro capital lo supera?', tipo:'abierta', pista:'La SL tiene un capital mínimo de 3.000 € desde la reforma de 2023 (antes 3.006 €). Ese capital debe estar totalmente suscrito y desembolsado.' },
      { id:'s3', pregunta:'¿Qué diferencia hay entre responsabilidad limitada y responsabilidad ilimitada? ¿Por qué es importante para un emprendedor?', tipo:'abierta', pista:'Con responsabilidad limitada, el socio solo responde con lo aportado. Con ilimitada (autónomos, comunidades de bienes), responde también con su patrimonio personal.' },
    ],
    logicaCorreccion: (respuestas, datos) => {
      const r = {};
      const { socios, capital } = datos;
      const s1 = (respuestas.s1?.texto||'').toLowerCase();
      const s2 = (respuestas.s2?.texto||'').toLowerCase().replace(/\./g,'').replace(/,/g,'.');
      const s3 = (respuestas.s3?.texto||'').toLowerCase();
      r.s1 = (s1.includes('sl') || s1.includes('sociedad limitada') || s1.includes('s.l') || s1.includes('responsabilidad')) && s1.length > 50
        ? { ok:true, feedback:'✓ Bien justificado. La SL es la forma más habitual para pymes con varios socios que desean limitar su responsabilidad.' }
        : { ok:false, feedback:'La respuesta debería indicar la forma jurídica elegida (habitualmente SL) y justificar con al menos dos criterios: responsabilidad, capital, número de socios, fiscalidad.' };
      r.s2 = (s2.includes('3000') || s2.includes('3.000') || s2.includes('tres mil')) && (capital >= 3000 ? (s2.includes('sí') || s2.includes('si') || s2.includes('supera') || s2.includes('suficiente') || s2.includes(capital.toString().slice(0,-2))) : true)
        ? { ok:true, feedback:`✓ Correcto. Capital mínimo SL: 3.000 €. Vuestro capital (${capital.toLocaleString('es-ES',{maximumFractionDigits:0})} €) ${capital>=3000?'lo supera':'no lo supera — deberíais revisar las aportaciones'}.` }
        : { ok:false, feedback:`El capital mínimo de una SL es 3.000 € (totalmente desembolsado en el momento de la constitución). Vuestro capital aportado es ${capital.toLocaleString('es-ES',{maximumFractionDigits:0})} €.` };
      r.s3 = (s3.includes('limitada') && s3.includes('ilimitada')) || (s3.includes('patrimonio personal') || s3.includes('aportación') || s3.includes('aportacion')) && s3.length > 60
        ? { ok:true, feedback:'✓ Buena explicación de la diferencia. La responsabilidad limitada es la principal ventaja de las sociedades de capital para proteger el patrimonio personal del emprendedor.' }
        : { ok:false, feedback:'Limitada: el socio solo pierde lo que aportó. Ilimitada: responde también con su patrimonio personal (casa, ahorros...). Es el argumento más importante a favor de la SL.' };
      return r;
    },
  },
];

/* ── Helpers ───────────────────────────────────────────────── */
function _casosDatos(caso) {
  try { return caso.datosContexto(); } catch(e) { return {}; }
}
function _casosContexto(caso) {
  try { return caso.contexto(); } catch(e) { return 'Cargando contexto...'; }
}
function _casosRespuestas(casoId) {
  if (!EMPRESA_STATE.casos.respuestas[casoId]) EMPRESA_STATE.casos.respuestas[casoId] = { pasos:{}, evaluaciones:{} };
  return EMPRESA_STATE.casos.respuestas[casoId];
}
function _casosEvaluado(casoId) {
  const resp = _casosRespuestas(casoId);
  return Object.keys(resp.evaluaciones).length > 0;
}
function _casosCompletado(casoId) {
  const caso = [...CASOS_BIBLIOTECA, ...(EMPRESA_STATE.casos.casosCustom||[])].find(c=>c.id===casoId);
  if (!caso) return false;
  const resp = _casosRespuestas(casoId);
  return caso.pasos.every(p => resp.pasos[p.id]?.enviado);
}

/* ── Vista principal ───────────────────────────────────────── */
function vistaCasos() {
  const st = EMPRESA_STATE.casos;
  const esProf = APP.rolActivo !== 'alumno';

  if (st.casoActivo) return vistaCasoDetalle(st.casoActivo);

  const tab = st.tabActiva;
  const todos = [...CASOS_BIBLIOTECA, ...(st.casosCustom||[]).filter(c=>esProf||c.publicado)];
  const completados = todos.filter(c=>_casosCompletado(c.id));
  const enCurso = todos.filter(c=>!_casosCompletado(c.id) && Object.keys(_casosRespuestas(c.id).pasos).length>0);
  const pct = todos.length>0 ? Math.round(completados.length/todos.length*100) : 0;

  // Badge
  const badge = document.getElementById('badge-casos');
  if (badge) { badge.textContent=enCurso.length||''; badge.style.display=enCurso.length>0?'':'none'; }

  const BLOQUES_LABEL = {
    financiero:{label:'Economía y finanzas',icono:'📊',color:'#b45309'},
    fiscal:{label:'Fiscal y legal',icono:'⚖️',color:'#7c3aed'},
    rrhh:{label:'RRHH y laboral',icono:'👥',color:'#1e40af'},
    comercial:{label:'Gestión comercial',icono:'🏷️',color:'#9333ea'},
    empresa:{label:'Constitución y jurídico',icono:'🏢',color:'#134a28'},
    custom:{label:'Del docente',icono:'✨',color:'#be185d'},
  };

  return `
  <div class="seccion-header">
    <div>
      <h2>🧩 Casos y situaciones guiadas</h2>
      <p>Aprende tomando decisiones reales sobre tu empresa · Andamiaje + corrección automática de la lógica</p>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <div style="text-align:right">
        <div style="font-size:1.1rem;font-weight:700;color:var(--verde-600)">${pct}%</div>
        <div style="font-size:.68rem;color:var(--gris-400)">${completados.length}/${todos.length} completados</div>
      </div>
      ${esProf ? `
      <button class="btn-accion" style="padding:7px 14px;font-size:.82rem;display:flex;align-items:center;gap:6px"
        onclick="abrirModalCasoProf()">✨ Crear caso</button>` : ''}
    </div>
  </div>

  <!-- Progreso global -->
  <div style="height:5px;background:var(--gris-100);border-radius:3px;margin:0 0 1.25rem;overflow:hidden">
    <div style="width:${pct}%;height:100%;background:var(--verde-500);border-radius:3px;transition:width .5s"></div>
  </div>

  <!-- Tabs -->
  <div style="display:flex;gap:4px;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:5px;margin-bottom:1.25rem">
    ${[['biblioteca','📚','Todos los casos'],['activos','🔄','En curso'],['historial','✅','Completados']].map(([id,ico,lbl])=>`
    <button onclick="EMPRESA_STATE.casos.tabActiva='${id}';renderVista('casos')"
      style="flex:1;padding:8px;border:none;border-radius:var(--radio-md);font-size:.82rem;font-weight:${tab===id?700:500};cursor:pointer;
      background:${tab===id?'var(--verde-600)':'transparent'};color:${tab===id?'white':'var(--gris-500)'};transition:all .2s;text-align:center">
      ${ico} ${lbl} ${id==='activos'&&enCurso.length>0?`<span style="font-size:.7rem;padding:1px 6px;border-radius:20px;background:${tab==='activos'?'rgba(255,255,255,.3)':'#fef9ec'};color:${tab==='activos'?'white':'#92400e'}">${enCurso.length}</span>`:''}
    </button>`).join('')}
  </div>

  <!-- Contenido según tab -->
  ${tab === 'activos' ? _casosListaFiltrada(enCurso, BLOQUES_LABEL, 'No hay casos en curso. Comienza uno desde "Todos los casos".') :
    tab === 'historial' ? _casosListaFiltrada(completados, BLOQUES_LABEL, 'Aún no has completado ningún caso.') :
    _casosListaBiblioteca(todos, BLOQUES_LABEL)}

  <!-- Modal crear caso docente -->
  ${_modalCasoProf()}`;
}

function _casosListaBiblioteca(casos, BLOQUES_LABEL) {
  const st = EMPRESA_STATE.casos;
  const BLOQUES_ORDEN = ['financiero','fiscal','rrhh','comercial','empresa','custom'];
  let html = '';
  BLOQUES_ORDEN.forEach(bloqueId => {
    const casosBloq = casos.filter(c => (c.bloque||'custom') === bloqueId);
    if (!casosBloq.length) return;
    const bl = BLOQUES_LABEL[bloqueId] || BLOQUES_LABEL.custom;
    html += `
    <div style="margin-bottom:1.5rem">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:1rem">${bl.icono}</span>
        <span style="font-size:.82rem;font-weight:700;color:${bl.color};text-transform:uppercase;letter-spacing:.06em">${bl.label}</span>
        <div style="flex:1;height:1px;background:var(--gris-100);margin-left:4px"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px">
        ${casosBloq.map(c=>_casoTarjeta(c)).join('')}
      </div>
    </div>`;
  });
  return html || '<div style="padding:2rem;text-align:center;color:var(--gris-400)">No hay casos disponibles.</div>';
}

function _casosListaFiltrada(casos, BLOQUES_LABEL, msgVacio) {
  if (!casos.length) return `<div style="padding:2rem;text-align:center;color:var(--gris-400)"><div style="font-size:2rem;margin-bottom:8px">🧩</div><p>${msgVacio}</p></div>`;
  return `<div style="display:flex;flex-direction:column;gap:.75rem">${casos.map(c=>_casoTarjeta(c,true)).join('')}</div>`;
}

function _casoTarjeta(c, horizontal=false) {
  const completado = _casosCompletado(c.id);
  const resp = _casosRespuestas(c.id);
  const enCurso = !completado && Object.keys(resp.pasos).length>0;
  const pasosHechos = c.pasos ? Object.keys(resp.pasos).filter(k=>resp.pasos[k]?.enviado).length : 0;
  const pct = c.pasos ? Math.round(pasosHechos/c.pasos.length*100) : 0;
  const difCol = {baja:'#166534',media:'#92400e',alta:'#991b1b'}[c.dificultad]||'var(--gris-600)';
  const difBg  = {baja:'#dcfce7',media:'#fef9ec',alta:'#fee2e2'}[c.dificultad]||'var(--gris-100)';

  // Deadline
  const ahora = new Date();
  const deadline = c.deadlineISO ? new Date(c.deadlineISO) : null;
  const cerrado  = deadline && ahora > deadline;
  const proxCierre = deadline && !cerrado && (deadline - ahora) < 86400000; // menos de 24h

  const borderCol = cerrado ? 'var(--gris-200)' : completado?'var(--verde-300)':enCurso?'#bfdbfe':'var(--gris-100)';

  return `
  <div style="background:${cerrado?'var(--gris-50)':'var(--blanco)'};border:1.5px solid ${borderCol};border-radius:var(--radio-lg);
    padding:14px;cursor:pointer;transition:all .18s;${horizontal?'display:flex;align-items:center;gap:14px;':''}
    opacity:${cerrado&&!completado?.6:1}"
    onclick="EMPRESA_STATE.casos.casoActivo='${c.id}';renderVista('casos')"
    onmouseover="this.style.borderColor='${cerrado?'var(--gris-300)':'var(--verde-400)'}';this.style.transform='${cerrado?'':'translateY(-1px)'}'"
    onmouseout="this.style.borderColor='${borderCol}';this.style.transform=''">
    <div style="${horizontal?'width:44px;height:44px;border-radius:10px;background:var(--gris-50);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;':''}">
      ${horizontal?c.icono||'🧩':''}
    </div>
    <div style="flex:1;min-width:0">
      ${!horizontal?`<div style="font-size:1.4rem;margin-bottom:8px">${c.icono||'🧩'}</div>`:''}
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:4px">
        <span style="font-size:.875rem;font-weight:700;color:${cerrado?'var(--gris-500)':'var(--gris-900)'};line-height:1.3">${c.titulo}</span>
        ${completado?'<span style="color:var(--verde-500);font-size:1rem;flex-shrink:0">✓</span>':cerrado?'<span style="font-size:.7rem;color:var(--gris-400);flex-shrink:0">🔒 Cerrado</span>':''}
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">
        <span style="font-size:.7rem;padding:2px 8px;border-radius:20px;background:${difBg};color:${difCol};font-weight:600">${c.dificultad}</span>
        <span class="ra-chip" style="font-size:.68rem">${c.ra}</span>
        ${c.ce?`<span class="ra-chip" style="font-size:.62rem;background:#eff6ff;color:#1e40af;border-color:#bfdbfe">${c.ce}</span>`:''}
        ${c.modulo?`<span style="font-size:.65rem;padding:2px 7px;border-radius:20px;background:var(--gris-100);color:var(--gris-500);font-weight:600">Mód. ${c.modulo}</span>`:''}
        <span style="font-size:.7rem;color:var(--gris-400)">⏱ ${c.minutos} min</span>
        ${c.individual?'<span style="font-size:.65rem;padding:2px 7px;border-radius:20px;background:#fce7f3;color:#9d174d;font-weight:600">👤 Individual</span>':''}
      </div>
      ${c.deadlineISO?`
      <div style="font-size:.7rem;padding:3px 8px;border-radius:6px;display:inline-flex;align-items:center;gap:4px;margin-bottom:6px;
        background:${cerrado?'var(--gris-100)':proxCierre?'#fef3c7':'#eff6ff'};
        color:${cerrado?'var(--gris-500)':proxCierre?'#92400e':'#1e40af'}">
        ${cerrado?'🔒 Cerrado':'⏰'} ${cerrado?'Plazo finalizado':proxCierre?'⚠️ Cierra pronto':'Cierre:'} ${c.fechaLimiteDisplay||''}
      </div>`:''}
      ${c.pasos && (enCurso||completado)?`
      <div style="height:4px;background:var(--gris-100);border-radius:2px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${completado?'var(--verde-500)':'#3b82f6'};border-radius:2px;transition:width .4s"></div>
      </div>
      <div style="font-size:.68rem;color:var(--gris-400);margin-top:3px">${pasosHechos}/${c.pasos?.length||0} pasos completados</div>`:''}
    </div>
  </div>`;
}

/* ── Vista de detalle de un caso ───────────────────────────── */
function vistaCasoDetalle(casoId) {
  const todos = [...CASOS_BIBLIOTECA, ...(EMPRESA_STATE.casos.casosCustom||[])];
  const caso = todos.find(c=>c.id===casoId);
  if (!caso) { EMPRESA_STATE.casos.casoActivo=null; return vistaCasos(); }

  // Comprobar si el caso está cerrado por deadline
  const ahora = new Date();
  const deadline = caso.deadlineISO ? new Date(caso.deadlineISO) : null;
  const cerrado  = deadline && ahora > deadline;
  const completado = _casosCompletado(casoId);

  const resp = _casosRespuestas(casoId);
  const datos = _casosDatos(caso);
  const evaluaciones = resp.evaluaciones || {};
  const difCol = {baja:'#166534',media:'#92400e',alta:'#991b1b'}[caso.dificultad]||'var(--gris-600)';
  const difBg  = {baja:'#dcfce7',media:'#fef9ec',alta:'#fee2e2'}[caso.dificultad]||'var(--gris-100)';

  return `
  <!-- Breadcrumb -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:1rem;flex-wrap:wrap">
    <button class="btn-secundario" style="padding:5px 12px;font-size:.78rem"
      onclick="EMPRESA_STATE.casos.casoActivo=null;renderVista('casos')">
      ← Casos y situaciones
    </button>
    <span class="ra-chip">${caso.ra}</span>
    ${caso.ce?`<span class="ra-chip" style="background:#eff6ff;color:#1e40af;border-color:#bfdbfe">${caso.ce}</span>`:''}
    ${caso.modulo?`<span style="font-size:.7rem;padding:2px 8px;border-radius:20px;background:var(--gris-100);color:var(--gris-500);font-weight:600">Mód. ${caso.modulo}</span>`:''}
    <span style="font-size:.75rem;padding:2px 8px;border-radius:20px;background:${difBg};color:${difCol};font-weight:600">${caso.dificultad}</span>
    <span style="font-size:.75rem;color:var(--gris-400)">⏱ ${caso.minutos} min estimados</span>
    ${caso.individual?'<span style="font-size:.7rem;padding:2px 8px;border-radius:20px;background:#fce7f3;color:#9d174d;font-weight:600">👤 Individual</span>':''}
    ${completado?`<span style="font-size:.78rem;color:var(--verde-600);font-weight:700;margin-left:auto">✓ Completado</span>`:''}
    ${cerrado&&!completado?`<span style="font-size:.78rem;color:var(--gris-400);font-weight:700;margin-left:auto">🔒 Cerrado</span>`:''}
  </div>

  <!-- Banner deadline -->
  ${caso.deadlineISO ? `
  <div style="display:flex;align-items:center;gap:10px;padding:.75rem 1rem;border-radius:var(--radio-md);margin-bottom:1rem;
    background:${cerrado?'var(--gris-100)':proxCierre?'#fef3c7':'#eff6ff'};
    border:1px solid ${cerrado?'var(--gris-200)':proxCierre?'#fde68a':'#bfdbfe'}">
    <span style="font-size:1.1rem">${cerrado?'🔒':proxCierre?'⚠️':'⏰'}</span>
    <div style="flex:1;font-size:.8rem;color:${cerrado?'var(--gris-600)':proxCierre?'#92400e':'#1e40af'}">
      ${cerrado
        ? `<strong>Caso cerrado.</strong> El plazo de entrega finalizó el ${caso.fechaLimiteDisplay}. Tus respuestas han quedado registradas.`
        : proxCierre
          ? `<strong>¡Cierra pronto!</strong> Tienes hasta el ${caso.fechaLimiteDisplay} para completar este caso.`
          : `<strong>Plazo de entrega:</strong> ${caso.fechaLimiteDisplay}`}
    </div>
  </div>` : ''}

  <!-- Aviso realización individual -->
  ${caso.individual ? `
  <div style="display:flex;align-items:center;gap:8px;padding:.65rem 1rem;background:#fce7f3;border:1px solid #fbcfe8;border-radius:var(--radio-md);margin-bottom:1rem;font-size:.78rem;color:#9d174d">
    <span>👤</span> <span><strong>Realización individual:</strong> tus respuestas son privadas y solo las verá tu docente.</span>
  </div>` : ''}

  <!-- Cabecera del caso -->
  <div style="padding:1.25rem 1.5rem;background:${cerrado?'linear-gradient(135deg,var(--gris-700),var(--gris-500))':'linear-gradient(135deg,var(--verde-800),var(--verde-600))'};border-radius:var(--radio-lg);margin-bottom:1.25rem;color:white">
    <div style="display:flex;align-items:flex-start;gap:14px">
      <div style="font-size:2.2rem">${caso.icono||'🧩'}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:1.05rem;margin-bottom:6px">${caso.titulo}</div>
        <div style="font-size:.85rem;opacity:.9;line-height:1.6">${_casosContexto(caso)}</div>
      </div>
    </div>
  </div>

  <!-- Pasos — bloqueados si el caso está cerrado y no está completo -->
  <div style="display:flex;flex-direction:column;gap:1rem;${cerrado&&!completado?'pointer-events:none;opacity:.6':''}">
    ${cerrado&&!completado?`
    <div style="text-align:center;padding:1.5rem;background:var(--gris-50);border:1px dashed var(--gris-200);border-radius:var(--radio-lg);color:var(--gris-500);font-size:.85rem">
      🔒 El plazo de este caso ha finalizado. No es posible enviar nuevas respuestas.
    </div>` : ''}
    ${caso.pasos.map((paso, pidx) => {
      const pasoResp = resp.pasos[paso.id] || {};
      const eval_ = evaluaciones[paso.id];
      const enviado = pasoResp.enviado;
      const anterioresEnviados = caso.pasos.slice(0,pidx).every(p=>resp.pasos[p.id]?.enviado);
      const bloqueado = pidx > 0 && !anterioresEnviados;

      return `
      <div class="ficha-card" style="border-left:3px solid ${eval_?eval_.ok===true?'var(--verde-400)':eval_.ok===false?'#fca5a5':'#fde68a':enviado?'#93c5fd':'var(--gris-200)'}">
        <!-- Cabecera del paso -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="width:26px;height:26px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:700;
              background:${eval_?eval_.ok===true?'var(--verde-500)':eval_.ok===false?'#ef4444':'#f59e0b':enviado?'#3b82f6':'var(--gris-200)'};
              color:${eval_||enviado?'white':'var(--gris-500)'}">
              ${eval_?eval_.ok===true?'✓':eval_.ok===false?'✗':'~':pidx+1}
            </span>
            <span style="font-size:.875rem;font-weight:600;color:${bloqueado?'var(--gris-300)':'var(--gris-800)'}">${paso.pregunta}</span>
          </div>
          ${bloqueado?`<span style="font-size:.7rem;color:var(--gris-300);flex-shrink:0">🔒 Completa el paso anterior</span>`:''}
        </div>

        ${!bloqueado ? `
        <!-- Input de respuesta -->
        ${paso.tipo === 'decision' ? `
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px">
          ${(paso.opciones||[]).map(op=>`
          <label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1.5px solid ${pasoResp.decision===op?'var(--verde-400)':'var(--gris-200)'};
            border-radius:var(--radio-sm);cursor:pointer;background:${pasoResp.decision===op?'var(--verde-50)':'var(--blanco)'};
            transition:all .15s;${enviado?'pointer-events:none;opacity:.7':''}">
            <input type="radio" name="dec_${paso.id}" value="${op}" ${pasoResp.decision===op?'checked':''} ${enviado?'disabled':''}
              style="accent-color:var(--verde-600)"
              onchange="if(!EMPRESA_STATE.casos.respuestas['${casoId}'])EMPRESA_STATE.casos.respuestas['${casoId}']={pasos:{},evaluaciones:{}};if(!EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}'])EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}']={};EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}'].decision='${op}';EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}'].texto='${op}'">
            <span style="font-size:.84rem;color:var(--gris-800)">${op}</span>
          </label>`).join('')}
          ${!enviado?`
          <textarea placeholder="Argumenta tu decisión..." rows="3"
            style="width:100%;padding:8px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo);resize:vertical;outline:none;line-height:1.5"
            onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
            oninput="if(!EMPRESA_STATE.casos.respuestas['${casoId}'])EMPRESA_STATE.casos.respuestas['${casoId}']={pasos:{},evaluaciones:{}};if(!EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}'])EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}']=EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}']||{};EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}'].argumento=this.value"
          >${pasoResp.argumento||''}</textarea>`:''}`
        : `
        <textarea placeholder="Escribe aquí tu respuesta..."
          rows="4"
          style="width:100%;padding:10px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.84rem;
          font-family:var(--fuente-cuerpo);resize:vertical;min-height:90px;outline:none;line-height:1.6;
          ${enviado?'background:var(--gris-50);color:var(--gris-700);pointer-events:none;':''}"
          onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
          oninput="if(!EMPRESA_STATE.casos.respuestas['${casoId}'])EMPRESA_STATE.casos.respuestas['${casoId}']={pasos:{},evaluaciones:{}};if(!EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}'])EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}']=EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}']||{};EMPRESA_STATE.casos.respuestas['${casoId}'].pasos['${paso.id}'].texto=this.value"
          ${enviado?'disabled':''}
        >${pasoResp.texto||''}</textarea>`}

        <!-- Pista y acciones -->
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px;flex-wrap:wrap">
          <details style="flex:1">
            <summary style="font-size:.75rem;color:var(--gris-400);cursor:pointer">💡 Ver pista</summary>
            <div style="font-size:.78rem;color:var(--gris-600);margin-top:6px;padding:8px 10px;background:var(--gris-50);border-radius:var(--radio-sm);line-height:1.5">${paso.pista}</div>
          </details>
          ${!enviado ? `
          <button class="btn-accion" style="padding:6px 16px;font-size:.8rem"
            onclick="enviarPasoCaso('${casoId}','${paso.id}',${pidx})">
            Enviar respuesta →
          </button>` : ''}
        </div>

        <!-- Feedback de corrección -->
        ${eval_ ? `
        <div style="margin-top:10px;padding:10px 14px;border-radius:var(--radio-md);
          background:${eval_.ok===true?'var(--verde-50)':eval_.ok===false?'#fef2f2':'#fefce8'};
          border:1px solid ${eval_.ok===true?'var(--verde-200)':eval_.ok===false?'#fecaca':'#fde68a'}">
          <div style="font-size:.82rem;color:${eval_.ok===true?'var(--verde-700)':eval_.ok===false?'#dc2626':'#92400e'};line-height:1.6">
            ${eval_.feedback}
          </div>
        </div>` : ''}
        ` : ''}
      </div>`;
    }).join('')}
  </div>

  <!-- Resultado final si está todo completado y evaluado -->
  ${completado && Object.keys(evaluaciones).length > 0 ? _casoResultadoFinal(caso, evaluaciones) : ''}
  `;
}

function _casoResultadoFinal(caso, evaluaciones) {
  const evals = Object.values(evaluaciones);
  const correctos = evals.filter(e=>e.ok===true).length;
  const parciales = evals.filter(e=>e.ok==='neutral').length;
  const incorrectos = evals.filter(e=>e.ok===false).length;
  const pctCorr = Math.round(correctos/evals.length*100);
  return `
  <div class="ficha-card" style="border-color:${pctCorr>=75?'var(--verde-400)':pctCorr>=50?'#fde68a':'#fca5a5'};margin-top:1rem">
    <div class="ficha-card-header" style="background:${pctCorr>=75?'var(--verde-50)':pctCorr>=50?'#fefce8':'#fef2f2'}">
      <span style="font-size:1.2rem">${pctCorr>=75?'🏆':pctCorr>=50?'📈':'📝'}</span>
      <span style="font-weight:700;color:${pctCorr>=75?'var(--verde-700)':pctCorr>=50?'#92400e':'#dc2626'}">
        Resultado del caso · ${correctos}/${evals.length} pasos correctos
      </span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;padding:4px 0 8px">
      <div style="padding:10px;background:var(--verde-50);border-radius:var(--radio-md)">
        <div style="font-size:1.4rem;font-weight:800;color:var(--verde-700)">${correctos}</div>
        <div style="font-size:.72rem;color:var(--verde-600)">Correctos</div>
      </div>
      <div style="padding:10px;background:#fefce8;border-radius:var(--radio-md)">
        <div style="font-size:1.4rem;font-weight:800;color:#92400e">${parciales}</div>
        <div style="font-size:.72rem;color:#92400e">Parciales</div>
      </div>
      <div style="padding:10px;background:#fef2f2;border-radius:var(--radio-md)">
        <div style="font-size:1.4rem;font-weight:800;color:#dc2626">${incorrectos}</div>
        <div style="font-size:.72rem;color:#dc2626">A mejorar</div>
      </div>
    </div>
    <div style="font-size:.82rem;color:var(--gris-600);line-height:1.6;padding-top:8px;border-top:1px solid var(--gris-100)">
      ${pctCorr>=75
        ? '✓ Excelente trabajo. Habéis demostrado que sabéis aplicar los conceptos a situaciones reales de vuestra empresa.'
        : pctCorr>=50
          ? '📖 Buen intento. Revisad los pasos marcados como incorrectos y contrastad con el módulo de Conceptos clave para reforzar esas áreas.'
          : '📖 Este caso necesita más trabajo. Revisad los conceptos relacionados en la sección de Conceptos clave y volved a intentarlo.'}
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="btn-secundario" style="flex:1;justify-content:center"
        onclick="EMPRESA_STATE.casos.casoActivo=null;renderVista('casos')">← Volver a casos</button>
      <button class="btn-secundario" style="flex:1;justify-content:center"
        onclick="irA('conceptos')">📚 Repasar conceptos →</button>
    </div>
  </div>`;
}

/* ── Acciones ───────────────────────────────────────────────── */
function enviarPasoCaso(casoId, pasoId, pasoIdx) {
  const todos = [...CASOS_BIBLIOTECA, ...(EMPRESA_STATE.casos.casosCustom||[])];
  const caso = todos.find(c=>c.id===casoId);
  if (!caso) return;
  const resp = _casosRespuestas(casoId);
  const pasoResp = resp.pasos[pasoId] || {};
  const texto = pasoResp.texto || pasoResp.decision || '';
  if (!texto || texto.trim().length < 10) {
    mostrarToast('Escribe una respuesta antes de enviar (mínimo 10 caracteres)','error');
    return;
  }
  // Marcar como enviado
  if (!resp.pasos[pasoId]) resp.pasos[pasoId] = {};
  resp.pasos[pasoId].enviado = true;
  resp.pasos[pasoId].ts = new Date().toISOString();

  // Evaluar
  try {
    const datos = _casosDatos(caso);
    const todasEvaluaciones = caso.logicaCorreccion(resp.pasos, datos);
    if (todasEvaluaciones[pasoId]) {
      resp.evaluaciones[pasoId] = todasEvaluaciones[pasoId];
      const ev = todasEvaluaciones[pasoId];
      mostrarToast(ev.ok===true ? '✓ Respuesta coherente' : ev.ok==='neutral' ? '~ Aceptable, pero revisa el feedback' : '⚠️ Revisa tu respuesta', ev.ok===true?'exito':'');
    }
  } catch(e) { console.error('Error evaluando paso:', e); }

  renderVista('casos');
}

/* ── Modal crear caso (docente) — versión extendida ────────── */
/* Catálogo de temas por módulo con RA/CE vinculados */
const CASO_TEMAS_CATALOGO = {
  '0656': {
    label: 'Módulo 0656 · Simulación Empresarial',
    color: '#134a28',
    temas: [
      { id:'constitucion',  label:'Constitución de empresas',          icono:'🏢', ra:'RA3', ce:'RA3e', bloque:'empresa'    },
      { id:'forma_juridica',label:'Formas jurídicas y responsabilidad', icono:'📑', ra:'RA3', ce:'RA3f', bloque:'empresa'    },
      { id:'tramites',      label:'Trámites administrativos y fiscales',icono:'📋', ra:'RA5', ce:'RA5a', bloque:'fiscal'     },
      { id:'iva',           label:'IVA y liquidación trimestral',       icono:'⚖️', ra:'RA5', ce:'RA5b', bloque:'fiscal'     },
      { id:'is',            label:'Impuesto sobre Sociedades',          icono:'🏦', ra:'RA5', ce:'RA5c', bloque:'fiscal'     },
      { id:'financiacion',  label:'Fuentes de financiación',           icono:'💳', ra:'RA4', ce:'RA4c', bloque:'financiero' },
      { id:'umbral',        label:'Umbral de rentabilidad / Punto muerto',icono:'📈',ra:'RA4', ce:'RA4g', bloque:'financiero' },
      { id:'ratios',        label:'Ratios financieros y análisis',      icono:'📊', ra:'RA4', ce:'RA4d', bloque:'financiero' },
      { id:'balance',       label:'Balance de situación y patrimonio',  icono:'⚖️', ra:'RA4', ce:'RA4h', bloque:'financiero' },
      { id:'marketing',     label:'Marketing mix y precio',             icono:'📣', ra:'RA2', ce:'RA2d', bloque:'comercial'  },
      { id:'dafo',          label:'Análisis DAFO y entorno competitivo',icono:'🔍', ra:'RA2', ce:'RA2i', bloque:'comercial'  },
      { id:'canvas',        label:'Business Model Canvas',              icono:'🎯', ra:'RA2', ce:'RA2c', bloque:'comercial'  },
      { id:'innovacion',    label:'Innovación y emprendimiento',        icono:'💡', ra:'RA1', ce:'RA1a', bloque:'empresa'    },
      { id:'gestion_op',    label:'Gestión operativa y comunicación',   icono:'⚙️', ra:'RA6', ce:'RA6a', bloque:'rrhh'      },
      { id:'mercado_int',   label:'Mercado intergrupal y transacciones',icono:'🔄', ra:'RA6', ce:'RA6b', bloque:'rrhh'      },
    ]
  },
  '0657': {
    label: 'Módulo 0657 · Recursos Humanos y Responsabilidad Social',
    color: '#1e40af',
    temas: [
      { id:'contrato',      label:'Tipos de contrato y modalidades',    icono:'📄', ra:'RA2', ce:'RA2a', bloque:'rrhh'      },
      { id:'nomina',        label:'Nómina y cotización a la Seguridad Social',icono:'💼',ra:'RA3',ce:'RA3b',bloque:'rrhh'   },
      { id:'convenio',      label:'Convenio colectivo y condiciones laborales',icono:'🤝',ra:'RA2',ce:'RA2c',bloque:'rrhh' },
      { id:'irpf',          label:'IRPF y retenciones en nómina',       icono:'🧾', ra:'RA3', ce:'RA3d', bloque:'fiscal'    },
      { id:'alta_baja',     label:'Alta y baja en la Seguridad Social', icono:'👥', ra:'RA3', ce:'RA3a', bloque:'rrhh'      },
      { id:'despido',       label:'Extinción del contrato y finiquito',  icono:'⚠️', ra:'RA4', ce:'RA4a', bloque:'rrhh'      },
      { id:'rsc',           label:'Responsabilidad Social Corporativa',  icono:'🌱', ra:'RA5', ce:'RA5b', bloque:'empresa'   },
      { id:'seleccion',     label:'Proceso de selección y reclutamiento',icono:'🔎', ra:'RA1', ce:'RA1b', bloque:'rrhh'     },
      { id:'formacion',     label:'Plan de formación y desarrollo',      icono:'📚', ra:'RA1', ce:'RA1c', bloque:'rrhh'      },
    ]
  },
  '3160': {
    label: 'Módulo 3160 · Proyecto Empresarial Intermodular',
    color: '#be185d',
    temas: [
      { id:'plan_empresa',  label:'Plan de empresa completo',            icono:'📋', ra:'RA1', ce:'RA1a', bloque:'empresa'   },
      { id:'defensa_oral',  label:'Defensa oral y comunicación',         icono:'🎤', ra:'RA1', ce:'RA1b', bloque:'empresa'   },
      { id:'viabilidad',    label:'Análisis de viabilidad del proyecto',  icono:'📊', ra:'RA2', ce:'RA2a', bloque:'financiero'},
      { id:'integracion',   label:'Integración de módulos en el proyecto',icono:'🔗', ra:'RA3', ce:'RA3a', bloque:'empresa'  },
      { id:'documentacion', label:'Documentación y evidencias del dossier',icono:'📂',ra:'RA3', ce:'RA3b', bloque:'empresa'  },
    ]
  },
};

function _modalCasoProf() {
  const st = EMPRESA_STATE.casos;
  if (!st.modalCaso) return '';
  const gen  = st.casoTmpGen;
  const paso = st.modalPaso || 1; // 1=tema, 2=config, 3=previsualizar

  /* ─ Paso 1: selección de módulo y tema ─ */
  const modSelec = st.modalModulo || '';
  const temaSelec = st.modalTema || '';
  const temaObj = modSelec ? (CASO_TEMAS_CATALOGO[modSelec]?.temas||[]).find(t=>t.id===temaSelec) : null;

  const paso1HTML = () => `
  <div style="display:flex;flex-direction:column;gap:1rem">
    <div>
      <div style="font-size:.78rem;font-weight:700;color:var(--gris-600);margin-bottom:.6rem;text-transform:uppercase;letter-spacing:.06em">Selecciona el módulo</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${Object.entries(CASO_TEMAS_CATALOGO).map(([modId, mod]) => `
        <div onclick="EMPRESA_STATE.casos.modalModulo='${modId}';EMPRESA_STATE.casos.modalTema='';renderVista('casos')"
          style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--radio-md);cursor:pointer;
            border:2px solid ${modSelec===modId?mod.color:'var(--gris-200)'};
            background:${modSelec===modId?'var(--gris-50)':'var(--blanco)'};transition:all .15s">
          <div style="width:10px;height:10px;border-radius:50%;background:${mod.color};flex-shrink:0"></div>
          <span style="font-size:.85rem;font-weight:${modSelec===modId?700:500};color:${modSelec===modId?mod.color:'var(--gris-700)'}">
            ${mod.label}
          </span>
          ${modSelec===modId?'<span style="margin-left:auto;color:var(--verde-500)">✓</span>':''}
        </div>`).join('')}
      </div>
    </div>

    ${modSelec ? `
    <div>
      <div style="font-size:.78rem;font-weight:700;color:var(--gris-600);margin-bottom:.6rem;text-transform:uppercase;letter-spacing:.06em">Selecciona el tema</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${(CASO_TEMAS_CATALOGO[modSelec]?.temas||[]).map(t => `
        <div onclick="EMPRESA_STATE.casos.modalTema='${t.id}';renderVista('casos')"
          style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--radio-sm);cursor:pointer;
            border:1.5px solid ${temaSelec===t.id?'var(--verde-500)':'var(--gris-100)'};
            background:${temaSelec===t.id?'var(--verde-50)':'var(--gris-50)'};transition:all .15s">
          <span style="font-size:1rem">${t.icono}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:.78rem;font-weight:600;color:var(--gris-800);line-height:1.3">${t.label}</div>
            <div style="font-size:.65rem;color:var(--gris-400)">${t.ra} · ${t.ce}</div>
          </div>
          ${temaSelec===t.id?'<span style="color:var(--verde-500);font-size:.8rem">✓</span>':''}
        </div>`).join('')}
      </div>
    </div>

    <div>
      <div style="font-size:.78rem;font-weight:700;color:var(--gris-600);margin-bottom:.6rem;text-transform:uppercase;letter-spacing:.06em">O escribe un tema libre</div>
      <div style="display:flex;gap:8px">
        <input type="text" id="caso-prof-input"
          placeholder="Ej: gestión de un impago, negociación con proveedor..."
          value="${st.casoTmpBusq||''}"
          style="flex:1;padding:9px 14px;border:1.5px solid var(--gris-200);border-radius:var(--radio-md);font-size:.875rem;font-family:var(--fuente-cuerpo);outline:none"
          onfocus="this.style.borderColor='var(--verde-400)'" onblur="this.style.borderColor='var(--gris-200)'"
          oninput="EMPRESA_STATE.casos.casoTmpBusq=this.value;EMPRESA_STATE.casos.modalTema=''"
          onkeydown="if(event.key==='Enter')generarCasoIA()">
        <button onclick="generarCasoIA()"
          style="padding:9px 16px;background:${st.casoTmpGenerando?'var(--gris-300)':'var(--verde-600)'};color:white;border:none;border-radius:var(--radio-md);
          font-size:.82rem;font-weight:600;cursor:${st.casoTmpGenerando?'not-allowed':'pointer'};white-space:nowrap;display:flex;align-items:center;gap:6px">
          ${st.casoTmpGenerando?`<span style="display:inline-block;width:14px;height:14px;border:2px solid white;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite"></span> Generando...`:'✨ Generar'}
        </button>
      </div>
      ${st.casoTmpGenErr?`<div style="font-size:.78rem;color:#dc2626;margin-top:6px">⚠️ ${st.casoTmpGenErr}</div>`:''}
    </div>` : ''}
  </div>`;

  /* ─ Paso 2: configuración del caso (fecha, hora, modo) ─ */
  const paso2HTML = () => {
    if (!gen) return '<div style="padding:1rem;text-align:center;color:var(--gris-400)">Primero genera o selecciona un caso.</div>';
    const cfg = st.casoConfig || {};
    return `
    <div style="display:flex;flex-direction:column;gap:1rem">

      <!-- Previsualización del caso generado -->
      <div style="border:1.5px solid var(--verde-200);border-radius:var(--radio-lg);overflow:hidden">
        <div style="padding:10px 14px;background:var(--verde-50);display:flex;align-items:center;gap:8px">
          <span style="font-size:1.1rem">${gen.icono||'🧩'}</span>
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:700;color:var(--verde-800)">${gen.titulo}</div>
            <div style="font-size:.7rem;color:var(--verde-600)">${gen.ra||''} · ${gen.ce||''} · ${gen.dificultad||''} · ⏱ ${gen.minutos||'?'} min</div>
          </div>
          <button onclick="generarCasoIA()" style="border:none;background:transparent;cursor:pointer;font-size:.75rem;color:var(--verde-600);font-weight:600;text-decoration:underline">🔄 Regenerar</button>
        </div>
        <div style="padding:.85rem 1.25rem;font-size:.8rem;color:var(--gris-700);line-height:1.6;background:var(--gris-50)">${gen.contexto}</div>
        <div style="padding:.65rem 1.25rem;display:flex;flex-direction:column;gap:5px">
          ${(gen.pasos||[]).map((p,i)=>`
          <div style="display:flex;gap:8px;padding:6px 8px;background:var(--blanco);border:1px solid var(--gris-100);border-radius:var(--radio-sm);font-size:.78rem">
            <span style="width:18px;height:18px;border-radius:50%;background:var(--verde-500);color:white;font-size:.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</span>
            <span style="color:var(--gris-700)">${p.pregunta}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Ajustes del caso -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div>
          <label style="font-size:.75rem;font-weight:600;color:var(--gris-600);display:block;margin-bottom:4px">RA vinculado</label>
          <select style="width:100%;padding:7px 10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo)"
            onchange="EMPRESA_STATE.casos.casoTmpGen.ra=this.value">
            ${['RA1','RA2','RA3','RA4','RA5','RA6'].map(r=>`<option value="${r}" ${gen.ra===r?'selected':''}>${r}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:.75rem;font-weight:600;color:var(--gris-600);display:block;margin-bottom:4px">CE específico</label>
          <input type="text" value="${gen.ce||temaObj?.ce||''}"
            placeholder="Ej: RA4g"
            style="width:100%;padding:7px 10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo)"
            oninput="EMPRESA_STATE.casos.casoTmpGen.ce=this.value">
        </div>
        <div>
          <label style="font-size:.75rem;font-weight:600;color:var(--gris-600);display:block;margin-bottom:4px">Dificultad</label>
          <select style="width:100%;padding:7px 10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo)"
            onchange="EMPRESA_STATE.casos.casoTmpGen.dificultad=this.value">
            ${['baja','media','alta'].map(d=>`<option value="${d}" ${gen.dificultad===d?'selected':''}>${d}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:.75rem;font-weight:600;color:var(--gris-600);display:block;margin-bottom:4px">Módulo de referencia</label>
          <select style="width:100%;padding:7px 10px;border:1.5px solid var(--gris-200);border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo)"
            onchange="EMPRESA_STATE.casos.casoTmpGen.modulo=this.value">
            ${['0656','0657','3160'].map(m=>`<option value="${m}" ${(gen.modulo||st.modalModulo||'0656')===m?'selected':''}>Módulo ${m}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Fecha y hora límite -->
      <div style="border:1.5px solid #bfdbfe;border-radius:var(--radio-lg);padding:1rem;background:#eff6ff">
        <div style="font-size:.8rem;font-weight:700;color:#1e40af;margin-bottom:.75rem">⏰ Fecha y hora límite de entrega</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div>
            <label style="font-size:.73rem;font-weight:600;color:#1e40af;display:block;margin-bottom:4px">Fecha límite</label>
            <input type="date" id="caso-fecha-limite"
              value="${(st.casoConfig||{}).fechaLimite || ''}"
              min="${new Date().toISOString().slice(0,10)}"
              style="width:100%;padding:7px 10px;border:1.5px solid #bfdbfe;border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo);background:var(--blanco)"
              oninput="if(!EMPRESA_STATE.casos.casoConfig)EMPRESA_STATE.casos.casoConfig={};EMPRESA_STATE.casos.casoConfig.fechaLimite=this.value">
          </div>
          <div>
            <label style="font-size:.73rem;font-weight:600;color:#1e40af;display:block;margin-bottom:4px">Hora límite</label>
            <input type="time" id="caso-hora-limite"
              value="${(st.casoConfig||{}).horaLimite || '23:59'}"
              style="width:100%;padding:7px 10px;border:1.5px solid #bfdbfe;border-radius:var(--radio-sm);font-size:.82rem;font-family:var(--fuente-cuerpo);background:var(--blanco)"
              oninput="if(!EMPRESA_STATE.casos.casoConfig)EMPRESA_STATE.casos.casoConfig={};EMPRESA_STATE.casos.casoConfig.horaLimite=this.value">
          </div>
        </div>
        <div style="margin-top:8px;font-size:.73rem;color:#1e40af;line-height:1.5">
          🔒 Al llegar a la fecha y hora indicadas, el caso se cerrará automáticamente y los alumnos no podrán continuar respondiendo.
          Si no se indica fecha, el caso permanece abierto hasta que el docente lo cierre manualmente.
        </div>
      </div>

      <!-- Realización individual -->
      <div style="background:var(--gris-50);border:1px solid var(--gris-200);border-radius:var(--radio-md);padding:.85rem 1rem;display:flex;align-items:flex-start;gap:10px">
        <span style="font-size:1rem;margin-top:1px">👤</span>
        <div style="font-size:.78rem;color:var(--gris-700);line-height:1.6">
          <strong>Realización individual:</strong> cada alumno responderá este caso de forma independiente. Sus respuestas son privadas y no son visibles para el resto del grupo hasta que el docente las revele.
        </div>
      </div>
    </div>`;
  };

  const canAdvance = temaSelec || st.casoTmpBusq || gen;
  const canSave = !!gen;

  return `
  <div style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:1rem"
    onclick="if(event.target===this){EMPRESA_STATE.casos.modalCaso=false;renderVista('casos')}">
    <div style="background:var(--blanco);border-radius:var(--radio-lg);width:min(700px,95vw);max-height:92vh;overflow:hidden;display:flex;flex-direction:column" onclick="event.stopPropagation()">

      <!-- Header -->
      <div style="padding:1.1rem 1.5rem;border-bottom:1px solid var(--gris-100);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <div>
          <div style="font-size:1rem;font-weight:700;color:var(--gris-900)">✨ Crear caso guiado</div>
          <div style="font-size:.73rem;color:var(--gris-400);margin-top:2px">Clasifica por módulo y tema · IA genera el enunciado · Establece fecha y hora límite</div>
        </div>
        <button onclick="EMPRESA_STATE.casos.modalCaso=false;renderVista('casos')" style="border:none;background:none;cursor:pointer;font-size:1.2rem;color:var(--gris-400)">✕</button>
      </div>

      <!-- Pasos indicadores -->
      <div style="padding:.7rem 1.5rem;border-bottom:1px solid var(--gris-100);display:flex;align-items:center;gap:6px;flex-shrink:0;background:var(--gris-50)">
        ${[['1','Módulo y tema'],['2','Configurar y programar']].map(([n,lbl],i) => {
          const activo = paso === parseInt(n);
          const hecho  = paso > parseInt(n);
          return `
          <div style="display:flex;align-items:center;gap:6px${i>0?';flex:1':''}">
            ${i>0?'<div style="flex:1;height:1px;background:var(--gris-200)"></div>':''}
            <div style="display:flex;align-items:center;gap:5px;cursor:pointer" onclick="EMPRESA_STATE.casos.modalPaso=${n};renderVista('casos')">
              <div style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0;
                background:${hecho?'var(--verde-500)':activo?'var(--verde-600)':'var(--gris-200)'};
                color:${hecho||activo?'white':'var(--gris-400)'}">${hecho?'✓':n}</div>
              <span style="font-size:.72rem;font-weight:${activo?700:500};color:${activo?'var(--gris-800)':'var(--gris-400)'};white-space:nowrap">${lbl}</span>
            </div>
          </div>`;
        }).join('')}
      </div>

      <!-- Cuerpo scrollable -->
      <div style="flex:1;overflow-y:auto;padding:1.25rem 1.5rem">
        ${paso === 1 ? paso1HTML() : paso2HTML()}
      </div>

      <!-- Footer -->
      <div style="padding:.9rem 1.5rem;border-top:1px solid var(--gris-100);display:flex;gap:8px;justify-content:space-between;align-items:center;flex-shrink:0">
        <button class="btn-secundario" onclick="EMPRESA_STATE.casos.modalCaso=false;renderVista('casos')">Cancelar</button>
        <div style="display:flex;gap:8px">
          ${paso===2?`<button class="btn-secundario" onclick="EMPRESA_STATE.casos.modalPaso=1;renderVista('casos')">← Volver</button>`:''}
          ${paso===1?`
          <button class="${canAdvance?'btn-accion':'btn-secundario'}" style="${!canAdvance?'opacity:.4;cursor:not-allowed':''}"
            onclick="${canAdvance?`if(EMPRESA_STATE.casos.modalTema&&!EMPRESA_STATE.casos.casoTmpGen){generarCasoIAFromTema()}else if(!EMPRESA_STATE.casos.casoTmpGen){generarCasoIA()}else{EMPRESA_STATE.casos.modalPaso=2;renderVista('casos')}`:''}">
            ${gen?'Siguiente → Configurar':'✨ Generar con IA →'}
          </button>`:''}
          ${paso===2&&canSave?`
          <button class="btn-secundario" style="color:#9333ea;border-color:#e9d5ff" onclick="guardarCasoProf(false)">💾 Borrador</button>
          <button class="btn-accion" onclick="guardarCasoProf(true)">📢 Publicar para alumnos</button>`:''}
        </div>
      </div>
    </div>
  </div>`;
}

function abrirModalCasoProf() {
  EMPRESA_STATE.casos.modalCaso = true;
  EMPRESA_STATE.casos.casoTmpGen = null;
  EMPRESA_STATE.casos.casoTmpBusq = '';
  EMPRESA_STATE.casos.casoTmpGenErr = '';
  EMPRESA_STATE.casos.modalPaso = 1;
  EMPRESA_STATE.casos.modalModulo = '';
  EMPRESA_STATE.casos.modalTema = '';
  EMPRESA_STATE.casos.casoConfig = { fechaLimite:'', horaLimite:'23:59' };
  renderVista('casos');
}

/* Generar caso a partir de un tema del catálogo */
async function generarCasoIAFromTema() {
  const st = EMPRESA_STATE.casos;
  const modId = st.modalModulo;
  const temaId = st.modalTema;
  const temaObj = (CASO_TEMAS_CATALOGO[modId]?.temas||[]).find(t=>t.id===temaId);
  if (!temaObj) return;
  st.casoTmpBusq = temaObj.label;
  await generarCasoIA(temaObj);
}

async function generarCasoIA(temaObj) {
  const st = EMPRESA_STATE.casos;
  const tema = temaObj ? temaObj.label : (document.getElementById('caso-prof-input')?.value || st.casoTmpBusq || '').trim();
  if (!tema) { st.casoTmpGenErr = 'Escribe el tema o selecciona uno del catálogo.'; renderVista('casos'); return; }
  st.casoTmpBusq = tema;
  st.casoTmpGenerando = true;
  st.casoTmpGen = null;
  st.casoTmpGenErr = '';
  renderVista('casos');

  const empNombre = EMPRESA_STATE.datos.nombre || 'vuestra empresa';
  const empSector = EMPRESA_STATE.datos.sector || 'comercio';
  const ventas = EMPRESA_STATE.planEmpresa.ap7.ventas.productos.reduce((s,p)=>(parseFloat(p.precioUnitario)||0)*(parseFloat(p.unidadesBase)||0)+s,0);
  const raHint = temaObj ? `El caso DEBE estar vinculado al ${temaObj.ra} (CE: ${temaObj.ce}) del CFGS en Administración y Finanzas.` : '';
  const modHint = st.modalModulo ? `Corresponde al módulo ${st.modalModulo} del CFGS.` : '';

  const prompt = `Eres un docente experto en Administración y Finanzas (CFGS, BOJA Andalucía) diseñando casos prácticos guiados.
${raHint} ${modHint}

La empresa del grupo: "${empNombre}", sector "${empSector}", ventas mensuales previstas: ${ventas>0?ventas.toLocaleString('es-ES',{maximumFractionDigits:0})+' €':'datos no disponibles'}.

Crea un caso práctico guiado sobre: "${tema}"

Reglas: pasos progresivos donde cada pregunta construye sobre la anterior; usa datos reales o realistas del sector; el alumno trabaja individualmente.

Responde SOLO con JSON válido sin markdown:
{
  "titulo": "Título accionable máximo 8 palabras",
  "icono": "emoji",
  "ra": "${temaObj?temaObj.ra:'RA1-RA6'}",
  "ce": "${temaObj?temaObj.ce:'CE específico ej: RA4g'}",
  "modulo": "${st.modalModulo||'0656'}",
  "dificultad": "baja|media|alta",
  "minutos": número,
  "bloque": "${temaObj?temaObj.bloque:'financiero|fiscal|rrhh|comercial|empresa'}",
  "bloqueLabel": "nombre del bloque en español",
  "contexto": "Situación en 2-3 frases con datos concretos del sector. Obliga a aplicar los conocimientos.",
  "pasos": [
    { "id":"s1","pregunta":"Pregunta de cálculo o identificación","tipo":"abierta","pista":"Orientación metodológica" },
    { "id":"s2","pregunta":"Interpretación del resultado anterior","tipo":"abierta","pista":"..." },
    { "id":"s3","pregunta":"Decisión justificada","tipo":"decision","opciones":["Opción A","Opción B","Depende de..."],"pista":"..." },
    { "id":"s4","pregunta":"Consecuencias contables o procedimentales","tipo":"abierta","pista":"..." }
  ]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1400, messages:[{role:'user',content:prompt}] }),
    });
    const data = await response.json();
    const texto = (data.content||[]).find(b=>b.type==='text')?.text||'';
    const parsed = JSON.parse(texto.replace(/```json|```/g,'').trim());
    st.casoTmpGen = parsed;
    st.casoTmpGenErr = '';
    st.modalPaso = 2; // avanzar al paso 2
  } catch(e) {
    st.casoTmpGenErr = 'Error al generar el caso. Comprueba la conexión e inténtalo de nuevo.';
  } finally {
    st.casoTmpGenerando = false;
    renderVista('casos');
  }
}

function guardarCasoProf(publicar) {
  const st = EMPRESA_STATE.casos;
  const gen = st.casoTmpGen;
  if (!gen) return;

  // Leer fecha/hora del DOM si aún no se han guardado en el state
  const fechaEl = document.getElementById('caso-fecha-limite');
  const horaEl  = document.getElementById('caso-hora-limite');
  if (fechaEl && fechaEl.value) {
    if (!st.casoConfig) st.casoConfig = {};
    st.casoConfig.fechaLimite = fechaEl.value;
  }
  if (horaEl && horaEl.value) {
    if (!st.casoConfig) st.casoConfig = {};
    st.casoConfig.horaLimite = horaEl.value;
  }

  const fechaLimite = st.casoConfig?.fechaLimite || '';
  const horaLimite  = st.casoConfig?.horaLimite  || '23:59';
  const deadlineISO = fechaLimite ? `${fechaLimite}T${horaLimite}:00` : null;

  const casoNuevo = {
    ...gen,
    id: 'cc'+Date.now(),
    publicado: publicar,
    individual: true,
    fecha: new Date().toLocaleDateString('es-ES'),
    modulo: gen.modulo || st.modalModulo || '0656',
    tema: st.modalTema || '',
    deadlineISO,
    fechaLimiteDisplay: fechaLimite ? `${fechaLimite} a las ${horaLimite}` : null,
    bloqueColor: {financiero:'#b45309',fiscal:'#7c3aed',rrhh:'#1e40af',comercial:'#9333ea',empresa:'#134a28'}[gen.bloque]||'#be185d',
    logicaCorreccion: function(respuestas) {
      const r = {};
      this.pasos.forEach(p => {
        const txt = (respuestas[p.id]?.texto||respuestas[p.id]?.decision||'').trim();
        r[p.id] = txt.length >= 30
          ? { ok:'neutral', feedback:'Respuesta recibida. El docente revisará la coherencia con los conceptos del módulo.' }
          : { ok:false, feedback:'La respuesta parece demasiado corta. Desarrolla mejor tu argumentación.' };
      });
      return r;
    },
    datosContexto: () => ({}),
  };
  st.casosCustom.push(casoNuevo);
  st.modalCaso = false;
  const deadlineMsg = deadlineISO ? ` · Cierre: ${casoNuevo.fechaLimiteDisplay}` : '';
  mostrarToast(publicar?`📢 Caso publicado para los alumnos${deadlineMsg}`:'💾 Caso guardado como borrador', publicar?'exito':'');
  renderVista('casos');
}


/* Estado de la sección */
if (!window.CONCEPTOS_STATE) {
  window.CONCEPTOS_STATE = {
    vista:    'indice',   // 'indice' | 'modulo' | 'buscar'
    modulo:   null,       // key activo
    tabIdx:   0,
    filtroRA: 'todos',    // 'todos' | 'RA1' | ... | 'RA6'
    busqueda: '',
    leidos:   {},         // { 'key-tabIdx': true }
    // ── Panel del profesor ──
    modalProf: false,     // modal creación de concepto
    profBusqueda: '',     // término buscado para generar descripción
    profGenerando: false, // spinner mientras llama a la API
    profResultado: null,  // { termino, descripcion, ra, modulo }
    profError: '',
    conceptosProfesor: [], // [ { id, termino, descripcion, ra, modulo, icono, publicado, fecha } ]
  };
}
const cs = () => window.CONCEPTOS_STATE;

/* Marcar un concepto como leído */
function conceptoLeer(key, tabIdx) {
  cs().leidos[`${key}-${tabIdx}`] = true;
  // Refresh progress badge without full re-render
  const badge = document.getElementById('badge-conceptos');
  if (badge) {
    const total  = Object.keys(AYUDA_CONTENIDO).filter(k => k !== 'default').length;
    const leidos = Object.keys(cs().leidos).length;
    badge.textContent = leidos + '/' + total;
    badge.style.display = leidos > 0 ? '' : 'none';
  }
}

/* Agrupación de módulos por bloque temático */
const CONCEPTOS_BLOQUES = [
  {
    id: 'empresa',
    label: 'Creación y constitución',
    icono: '🏗️',
    color: 'var(--verde-700)',
    modulos: ['empresa', 'tramites', 'plan-ap2', 'plan-ap1'],
    ra: ['RA1','RA3','RA5'],
  },
  {
    id: 'negocio',
    label: 'Análisis y estrategia',
    icono: '🎯',
    color: '#1e40af',
    modulos: ['emprendimiento', 'plan-ap3', 'plan-ap4', 'plan-ap8'],
    ra: ['RA1','RA2','RA6'],
  },
  {
    id: 'juridico',
    label: 'Jurídico, fiscal y laboral',
    icono: '⚖️',
    color: '#7c3aed',
    modulos: ['plan-ap5', 'plan-ap6', 'nominasol'],
    ra: ['RA3','RA5','RA6'],
  },
  {
    id: 'financiero',
    label: 'Economía y finanzas',
    icono: '📊',
    color: '#b45309',
    modulos: ['plan-ap7', 'contasol', 'factusol'],
    ra: ['RA4'],
  },
  {
    id: 'gestion',
    label: 'Gestión y comunicación',
    icono: '⚙️',
    color: '#0f766e',
    modulos: ['gestion', 'mensajeria', 'mercado', 'tareas', 'ranking'],
    ra: ['RA6'],
  },
  {
    id: 'proyecto',
    label: 'Proyecto y evaluación',
    icono: '📄',
    color: '#be185d',
    modulos: ['defensa', 'dossier', 'autoevaluacion'],
    ra: ['RA1','RA2','RA3','RA4','RA5','RA6'],
  },
];

/* Cuenta fichas leídas de un módulo */
function _cLeidos(key) {
  const m = AYUDA_CONTENIDO[key];
  if (!m) return { leidos: 0, total: 0 };
  const total  = m.tabs.length;
  const leidos = m.tabs.filter((_,i) => cs().leidos[`${key}-${i}`]).length;
  return { leidos, total };
}

/* ── Render principal ── */
