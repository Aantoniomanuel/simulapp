const EMPRESA_STATE = {
  seccionActiva: 'ficha',
  tramiteActivo: null,
  modoEdicion: true,      // arranca en modo edición: ficha vacía lista para rellenar
  fichaGuardada: false,
  rrhh: {
    vistaActiva: 'panel',  // panel | empleado | nomina | contrato | incidencias
    empleadoSeleccionado: null,
    empleados: [],  // { id, nombre, dni, nss, fechaAlta, categoria, grupoProf, tipoContrato, jornada, salarioBase, complementos:[], incidencias:[] }
    convenio: {
      nombre: 'Convenio Colectivo de Comercio de Sevilla (adaptado)',
      gruposProfesionales: [
        { id:1, nombre:'Grupo 1 · Dirección y Gerencia',  salarioBase:2200, complementoAntiguedad:60 },
        { id:2, nombre:'Grupo 2 · Jefaturas intermedias', salarioBase:1800, complementoAntiguedad:50 },
        { id:3, nombre:'Grupo 3 · Técnicos y especialistas', salarioBase:1500, complementoAntiguedad:40 },
        { id:4, nombre:'Grupo 4 · Administrativos',       salarioBase:1300, complementoAntiguedad:35 },
        { id:5, nombre:'Grupo 5 · Auxiliares y peones',   salarioBase:1134, complementoAntiguedad:30 },
      ],
      pagas: 14,
      porrorrateo: false,
      // Cotizaciones S.S. trabajador (2025)
      ssObrera: {
        contingenciasComunes: 4.70,
        desempleo: 1.55,         // tipo general contrato indefinido
        desempleoTemporal: 1.60, // temporal
        formacionProf: 0.10,
        mei: 0.13,               // Mecanismo Equidad Intergeneracional
      },
      // Cotizaciones S.S. empresa
      ssEmpresa: {
        contingenciasComunes: 23.60,
        desempleo: 5.50,
        desempleoTemporal: 6.70,
        formacionProf: 0.60,
        fogasa: 0.20,
        accidentesTrabajo: 1.50, // depende del CNAE
        mei: 0.58,
      },
      // Tramos IRPF 2025 (simplificados para simulación)
      irpfTramos: [
        { hasta: 12450, tipo: 19 },
        { hasta: 20200, tipo: 24 },
        { hasta: 35200, tipo: 30 },
        { hasta: 60000, tipo: 37 },
        { hasta: 999999, tipo: 45 },
      ],
    },
    nominasMes: null, // mes seleccionado para generar nóminas
  },
  gestion: {
    semanaActual: 8,
    trimestreActual: 1,
    vistaActiva: 'panel',    // panel | departamento | rotacion | tarea-detalle
    deptSeleccionado: null,
    tareaAbierta: null,
    rotacionConfirmada: false,
    // Asignaciones: qué alumno tiene qué departamento
    asignaciones: {
      direccion:    { alumno:'', trimestre:1 },
      rrhh:         { alumno:'', trimestre:1 },
      comercial:    { alumno:'', trimestre:1 },
      contabilidad: { alumno:'', trimestre:1 },
      fiscal:       { alumno:'', trimestre:1 },
    },
    // Tareas semanales por departamento
    tareas: [],  // { id, semana, departamento, titulo, descripcion, ce, estado, entrega, anotacion, calificacion }
  },
  mercado: {
    catalogo: [],       // { id, nombre, descripcion, precio, unidad, iva, stock, categoria }
    transacciones: [],  // { id, tipo, deGrupo, aGrupo, estado, items, docs:{pedido,aceptacion,albaran,factura}, fecha, total }
    eventos: [],        // { id, titulo, descripcion, efecto, fecha, activo }
    vistaActiva: 'panel',  // panel | catalogo | nueva-transaccion | detalle-transaccion | eventos
    transaccionAbierta: null,
    editandoCatalogo: false,
  },
  planEmpresa: {
    apartado: '1',  // '1' a '8'
    progreso: {},   // { '1': 45, '2': 80, ... }
    // Apartado 1 — Presentación
    ap1: { nombreComercial:'', lema:'', logo:'', resumenEjecutivo:'', mision:'', vision:'', valores:'' },
    // Apartado 2 — Promotores
    ap2: { promotores:[], motivacion:'', capacitacion:'', aportaciones:'' },
    // Apartado 3 — Descripción del negocio
    ap3: { descripcionActividad:'', productosServicios:'', propuestaValor:'', ventajaCompetitiva:'', modeloNegocio:'' },
    // Apartado 4 — Análisis del entorno
    ap4: { analisisSector:'', dafoF:'', dafoD:'', dafoO:'', dafoA:'', mercadoObjetivo:'', competidores:[], clientesPotenciales:'' },
    // Apartado 5 — Plan jurídico-fiscal
    ap5: { formaJuridica:'', justificacionForma:'', tramitesCompletados:[], regimenesFiscales:'', obligacionesPeriodicas:'' },
    // Apartado 6 — Plan organizativo
    ap6: { estructuraOrg:'', puestos:[], politicaRRHH:'', planFormacion:'' },
    // Apartado 7 — Plan económico-financiero (tablas interactivas)
    ap7: {
      // Tab activa dentro del apartado 7
      tabActiva: 'inversion',  // inversion | tesoreria | balance | resultados | ratios

      // 7.1 — Tabla de inversión inicial
      inversion: [
        { id:'i1', concepto:'Local y acondicionamiento', categoria:'Inmovilizado material', importe:0, amortizacion:10 },
        { id:'i2', concepto:'Maquinaria y equipos', categoria:'Inmovilizado material', importe:0, amortizacion:5 },
        { id:'i3', concepto:'Mobiliario y enseres', categoria:'Inmovilizado material', importe:0, amortizacion:10 },
        { id:'i4', concepto:'Equipos informáticos', categoria:'Inmovilizado material', importe:0, amortizacion:4 },
        { id:'i5', concepto:'Vehículos', categoria:'Inmovilizado material', importe:0, amortizacion:5 },
        { id:'i6', concepto:'Aplicaciones informáticas', categoria:'Inmovilizado intangible', importe:0, amortizacion:5 },
        { id:'i7', concepto:'Gastos de constitución', categoria:'Gastos primer establecimiento', importe:0, amortizacion:0 },
        { id:'i8', concepto:'Existencias iniciales (stock)', categoria:'Activo corriente', importe:0, amortizacion:0 },
        { id:'i9', concepto:'Fondo de maniobra inicial', categoria:'Activo corriente', importe:0, amortizacion:0 },
        { id:'i10', concepto:'Fianza / depósito', categoria:'Activo corriente', importe:0, amortizacion:0 },
      ],

      // 7.1b — Fuentes de financiación
      financiacion: [
        { id:'f1', fuente:'Aportaciones de socios', tipo:'Fondos propios', importe:0, interes:0, plazo:0 },
        { id:'f2', fuente:'Préstamo bancario', tipo:'Financiación ajena', importe:0, interes:5, plazo:5 },
        { id:'f3', fuente:'Línea ICO', tipo:'Financiación ajena', importe:0, interes:3.5, plazo:7 },
        { id:'f4', fuente:'Subvención pública', tipo:'Subvención', importe:0, interes:0, plazo:0 },
      ],

      // 7.2 — Previsión de ventas e ingresos (mensual, 12 meses × 3 años)
      ventas: {
        productos: [
          { id:'p1', nombre:'Producto/Servicio 1', precioUnitario:0, unidadesBase:0 },
          { id:'p2', nombre:'Producto/Servicio 2', precioUnitario:0, unidadesBase:0 },
        ],
        // Factor de crecimiento por año
        crecimientoA2: 15,  // % crecimiento año 2 respecto año 1
        crecimientoA3: 20,  // % crecimiento año 3 respecto año 2
        // Estacionalidad: factor multiplicador por mes (1=normal, 1.3=temporada alta)
        estacionalidad: [1,1,1,1,1,1,1,1,1,1,1,1],
      },

      // 7.3 — Previsión de gastos (mensual)
      gastos: {
        fijos: [
          { id:'gf1', concepto:'Alquiler local', importe:0 },
          { id:'gf2', concepto:'Sueldos y salarios', importe:0 },
          { id:'gf3', concepto:'Seguridad Social empresa', importe:0 },
          { id:'gf4', concepto:'Suministros (luz, agua, gas)', importe:0 },
          { id:'gf5', concepto:'Comunicaciones (teléfono, internet)', importe:0 },
          { id:'gf6', concepto:'Seguros', importe:0 },
          { id:'gf7', concepto:'Amortizaciones', importe:0 },
          { id:'gf8', concepto:'Gestoría / asesoría', importe:0 },
        ],
        variables: [
          { id:'gv1', concepto:'Aprovisionamiento (coste de ventas)', pctSobreVentas:40 },
          { id:'gv2', concepto:'Comisiones comerciales', pctSobreVentas:5 },
          { id:'gv3', concepto:'Transporte y logística', pctSobreVentas:3 },
          { id:'gv4', concepto:'Publicidad y marketing', pctSobreVentas:2 },
        ],
      },

      // 7.4 — Presupuesto de tesorería: saldos mensuales calculados
      // (se recalcula automáticamente de ventas + gastos)
      saldoInicial: 0,

      // 7.5 — Balance de situación previsional (fin de año 1, 2, 3)
      // Los valores se calculan automáticamente o el alumno puede ajustarlos manualmente
      balanceManual: false,
      balance: {
        // Activo no corriente
        inmovilizadoMaterial: 0, inmovilizadoIntangible: 0, amortAcum: 0,
        // Activo corriente
        existencias: 0, clientes: 0, tesoreria: 0, otroActivo: 0,
        // Patrimonio neto
        capitalSocial: 0, reservas: 0, resultadoEjercicio: 0,
        // Pasivo no corriente
        deudasLP: 0, otrosPasivoNC: 0,
        // Pasivo corriente
        proveedores: 0, deudasCP: 0, hpAcreedora: 0, otrosPasivoC: 0,
      },

      // 7.6 — Cuenta de resultados previsional (3 años)
      cuentaManual: false,
      cuenta: {
        a1:{ ventas:0, costeMerc:0, gastosPersonal:0, alquiler:0, suministros:0, amortizacion:0, otrosGastos:0 },
        a2:{ ventas:0, costeMerc:0, gastosPersonal:0, alquiler:0, suministros:0, amortizacion:0, otrosGastos:0 },
        a3:{ ventas:0, costeMerc:0, gastosPersonal:0, alquiler:0, suministros:0, amortizacion:0, otrosGastos:0 },
      },

      // 7.7 — Notas/observaciones generales del apartado
      observaciones: '',
    },
    // Apartado 8 — Plan de marketing
    ap8: { producto:'', precio:'', distribucion:'', comunicacion:'', presupuestoMarketing:'' },
  },
  emprendimiento: {
    fase: 1,           // 1 = ideación/análisis | 2 = dirección operativa
    subTab: 'innovacion', // innovacion | canvas | mercado | competencia | clientes | valor | dafo | decisiones | reuniones | objetivos
    // Fase 1 — Datos
    innovacion: { tipoInnovacion:'', riesgoAsumido:'', perfilEmprendedor:'', internacionalizacion:'', ayudas:'' },
    canvas: {
      propuestaValor:'', segmentosClientes:'', canales:'', relacionesClientes:'',
      fuentesIngresos:'', recursosClaves:'', actividadesClaves:'', sociosClave:'', estructuraCostes:''
    },
    mercado: { descripcion:'', tamañoEstimado:'', tendencias:'', nichoIdentificado:'', segmentos:'' },
    competencia: [
      // { nombre, fortalezas, debilidades, precioRelativo, cuotaMercado }
    ],
    clientesPotenciales: { perfil:'', necesidades:'', comportamiento:'', comoLlegarles:'' },
    propuestaValor: { problemaResuelve:'', necesidadSatisface:'', ventajaCompetitiva:'', diferenciacion:'' },
    // Fase 2 — Dirección (compartido con módulo dirección)
    dafo: { fortalezas:'', debilidades:'', oportunidades:'', amenazas:'' },
    kpis: {
      facturacion:   { valor:0, objetivo:15000 },
      clientes:      { valor:0, objetivo:20 },
      costes:        { valor:0, objetivo:8000 },
      margen:        { valor:0, objetivo:35 },
    },
    reuniones: [],
    decisiones: [],
    objetivos: [],
  },
  generador: {
    vistaActiva: 'panel',
    tipoSel: '',
    deptSel: '',
    grupoDest: '',
    datosGenerados: null,
    generando: false,
    historial: [],
    // Opciones del profesor
    conDocumento: true,     // adjuntar documento o solo correo
    permiteRespuesta: true, // el alumno puede responder o no
  },
  mensajeria: {
    correos: [],      // { id, de, email, asunto, cuerpo, departamento, ra, fecha, hora, leido, hilo:[] }
    filtro: 'todos',  // todos | direccion | rrhh | comercial | contabilidad | fiscal
    correoAbierto: null,
    generando: false,
    vistaProf: 'buzon',  // 'buzon' | 'generador' | 'programador'
  },
  programador: {
    activo: false,
    fechaInicio: '',
    fechaFin: '',
    intensidad: 'media',   // 'baja' | 'media' | 'alta'
    tiposSeleccionados: [], // ids de TIPOS_SITUACION seleccionados
    calendario: [],        // [{ fecha, situaciones:[{tipoId, dept, confirmada}] }]
    vistaSemana: 0,        // semana visible en el calendario
  },
  organigrama: {
    tipoEstructura: '',    // lineal | funcional | matricial | mixta
    justificacion: '',
    orgGuardado: false,
    deptAbierto: null,     // key del departamento desplegado
    modoEdicion: false,
  },

  // ── Capa 3: Casos y situaciones guiadas ──
  casos: {
    tabActiva:   'biblioteca',  // 'biblioteca' | 'activos' | 'historial'
    casoActivo:  null,          // id del caso abierto
    filtroBloq:  'todos',       // 'todos' | bloque id
    filtroRA:    'todos',
    // Respuestas del grupo a los casos: { casoId: { pasos:{stepId:{texto,enviado}}, evaluaciones:{stepId:{ok,feedback,ts}} } }
    respuestas:  {},
    // Casos publicados por el docente (se añaden a la biblioteca)
    casosCustom: [],
    // Modal creación caso docente
    modalCaso:   false,
    casoTmpBusq: '',
    casoTmpGen:  null,
    casoTmpGenErr: '',
    casoTmpGenerando: false,
  },

  // ── Módulo Tareas del grupo ──
  tareas: {
    tabActiva: 'agenda',   // 'agenda' | 'checklist' | 'gantt'

    // ── Agenda / Calendario ──
    agenda: {
      vista: 'mes',          // 'mes' | 'semana' | 'dia'
      fechaActual: new Date().toISOString().slice(0,10),  // YYYY-MM-DD
      eventos: [
        // Ejemplos precargados
        { id:'ev1', titulo:'Reunión de constitución', tipo:'reunion', fecha:'2025-10-01', horaInicio:'10:00', horaFin:'11:00', descripcion:'Primera reunión del grupo fundador', autor:'docente', color:'#1e40af' },
        { id:'ev2', titulo:'Entrega Plan de empresa', tipo:'entrega', fecha:'2025-12-15', horaInicio:'23:59', horaFin:'23:59', descripcion:'Fecha límite entrega Plan de empresa completo', autor:'docente', color:'#dc2626' },
        { id:'ev3', titulo:'Alta en AEAT (Mod. 036)', tipo:'tramite', fecha:'2025-10-20', horaInicio:'09:00', horaFin:'10:00', descripcion:'Presentación del Modelo 036 de alta censal', autor:'docente', color:'#9333ea' },
      ],
      // Para el formulario modal
      modal: { visible:false, modo:'nuevo', eventoEdit:null },
      eventoTmp: { titulo:'', tipo:'tarea', fecha:'', horaInicio:'', horaFin:'', descripcion:'', color:'#134a28' },
    },

    // ── Checklist ──
    checklist: {
      secciones: [
        {
          id:'sec1', titulo:'Creación de empresa', icono:'🏢',
          items: [
            { id:'c1a', texto:'Elegir nombre comercial y dominio web', hecho:false },
            { id:'c1b', texto:'Definir la forma jurídica de la empresa', hecho:false },
            { id:'c1c', texto:'Redactar los estatutos sociales', hecho:false },
            { id:'c1d', texto:'Abrir cuenta bancaria de la empresa', hecho:false },
            { id:'c1e', texto:'Desembolsar el capital social mínimo', hecho:false },
            { id:'c1f', texto:'Obtener la certificación negativa de denominación (RMC)', hecho:false },
          ]
        },
        {
          id:'sec2', titulo:'Trámites de constitución', icono:'📑',
          items: [
            { id:'c2a', texto:'Escritura pública ante notario', hecho:false },
            { id:'c2b', texto:'Inscripción en el Registro Mercantil', hecho:false },
            { id:'c2c', texto:'Alta censal en AEAT (Modelo 036)', hecho:false },
            { id:'c2d', texto:'Solicitud del CIF definitivo', hecho:false },
            { id:'c2e', texto:'Alta en el IAE si procede', hecho:false },
            { id:'c2f', texto:'Obtención del CCC en la Seguridad Social', hecho:false },
            { id:'c2g', texto:'Alta de los socios/trabajadores en la TGSS', hecho:false },
            { id:'c2h', texto:'Licencia de apertura o comunicación previa al Ayuntamiento', hecho:false },
            { id:'c2i', texto:'Registro de la marca/logo en la OEPM (si procede)', hecho:false },
          ]
        },
        {
          id:'sec3', titulo:'Plan de empresa', icono:'📋',
          items: [
            { id:'c3a', texto:'Ap. 1 — Presentación: misión, visión y valores', hecho:false },
            { id:'c3b', texto:'Ap. 2 — Promotores y equipo', hecho:false },
            { id:'c3c', texto:'Ap. 3 — Descripción del negocio y propuesta de valor', hecho:false },
            { id:'c3d', texto:'Ap. 4 — Análisis del entorno y DAFO', hecho:false },
            { id:'c3e', texto:'Ap. 5 — Plan jurídico-fiscal', hecho:false },
            { id:'c3f', texto:'Ap. 6 — Plan organizativo y RRHH', hecho:false },
            { id:'c3g', texto:'Ap. 7 — Plan económico-financiero', hecho:false },
            { id:'c3h', texto:'Ap. 8 — Plan de marketing', hecho:false },
          ]
        },
        {
          id:'sec4', titulo:'Gestión operativa', icono:'⚙️',
          items: [
            { id:'c4a', texto:'Alta de empleados en Nominasol', hecho:false },
            { id:'c4b', texto:'Primera nómina emitida y cotizaciones calculadas', hecho:false },
            { id:'c4c', texto:'Alta de clientes y proveedores en Factusol', hecho:false },
            { id:'c4d', texto:'Primera factura de venta emitida', hecho:false },
            { id:'c4e', texto:'Primera factura de compra registrada', hecho:false },
            { id:'c4f', texto:'Plan de cuentas configurado en Contasol', hecho:false },
            { id:'c4g', texto:'Asientos del mes 1 registrados en Contasol', hecho:false },
          ]
        },
        {
          id:'sec5', titulo:'Obligaciones fiscales periódicas', icono:'⚖️',
          items: [
            { id:'c5a', texto:'Modelo 303 — IVA 1T presentado', hecho:false },
            { id:'c5b', texto:'Modelo 303 — IVA 2T presentado', hecho:false },
            { id:'c5c', texto:'Modelo 303 — IVA 3T presentado', hecho:false },
            { id:'c5d', texto:'Modelo 111 — IRPF retenciones 1T', hecho:false },
            { id:'c5e', texto:'Modelo 111 — IRPF retenciones 2T', hecho:false },
            { id:'c5f', texto:'Modelo 347 — Operaciones con terceros (anual)', hecho:false },
            { id:'c5g', texto:'Modelo 200 — Impuesto sobre Sociedades (anual)', hecho:false },
          ]
        },
        {
          id:'sec6', titulo:'Evaluación y defensa', icono:'🎤',
          items: [
            { id:'c6a', texto:'Autoevaluación T1 completada y enviada', hecho:false },
            { id:'c6b', texto:'Coevaluación T1 completada y enviada', hecho:false },
            { id:'c6c', texto:'Autoevaluación T2 completada y enviada', hecho:false },
            { id:'c6d', texto:'Coevaluación T2 completada y enviada', hecho:false },
            { id:'c6e', texto:'Dossier del proyecto redactado', hecho:false },
            { id:'c6f', texto:'Presentación de la defensa preparada', hecho:false },
            { id:'c6g', texto:'Defensa pública realizada', hecho:false },
          ]
        },
      ],
      filtro: 'todas',  // 'todas' | 'pendientes' | 'hechas'
    },

    // ── Diagrama de Gantt ──
    gantt: {
      fechaInicio: '2025-09-01',
      fechaFin:    '2026-06-30',
      tareasGantt: [
        { id:'g1', nombre:'Constitución de la empresa', categoria:'Constitución', inicio:'2025-09-01', fin:'2025-10-31', color:'#1e40af', completado:0 },
        { id:'g2', nombre:'Plan de empresa', categoria:'Plan de empresa', inicio:'2025-10-01', fin:'2025-12-15', color:'#9333ea', completado:0 },
        { id:'g3', nombre:'Gestión operativa T1', categoria:'Gestión', inicio:'2025-10-01', fin:'2026-01-31', color:'#134a28', completado:0 },
        { id:'g4', nombre:'Presentación Mod. 303 — 3T', categoria:'Fiscal', inicio:'2025-10-01', fin:'2025-10-20', color:'#dc2626', completado:0 },
        { id:'g5', nombre:'Presentación Mod. 303 — 4T', categoria:'Fiscal', inicio:'2026-01-01', fin:'2026-01-20', color:'#dc2626', completado:0 },
        { id:'g6', nombre:'Defensa pública', categoria:'Evaluación', inicio:'2026-05-15', fin:'2026-06-15', color:'#f59e0b', completado:0 },
      ],
      modalVisible: false,
      tareaEditId: null,
      tmpTarea: { nombre:'', categoria:'', inicio:'', fin:'', color:'#134a28', completado:0 },
    },
  },

  // ── Módulo Defensa ──
  defensa: {
    tabActiva: 'pitch',   // 'pitch' | 'presentacion'

    // ── Elevator Pitch (1ª evaluación) ──
    pitch: {
      // Estructura del pitch (5 bloques × ~30s = ~2,5 min)
      gancho:       '',  // 1 frase impactante de apertura
      problema:     '',  // Qué problema o necesidad detectas
      solucion:     '',  // Tu producto/servicio y propuesta de valor
      modeloNegocio:'',  // Cómo ganas dinero: clientes, precio, canales
      cierreCall:   '',  // Petición concreta + frase de cierre memorable
      // Cronómetro de ensayo
      tiempoObjetivo: 120,  // segundos (2 min)
      // Ensayos guardados
      ensayos: [],  // { id, fecha, duracion, nota, observaciones }
      // Rúbrica de autoevaluación del pitch
      rubrica: {
        claridad:       null,  // 1–4
        impacto:        null,
        estructura:     null,
        lenguajeNoCrude:null,
        contactoVisual: null,
        ajusteTiempo:   null,
      },
      // Notas de mejora
      notas: '',
    },

    // ── Presentación final (2T) ──
    presentacion: {
      // Guión estructurado por bloques
      bloques: [
        { id:'b1', titulo:'Portada e introducción del equipo', duracion:2, contenido:'', icono:'👥' },
        { id:'b2', titulo:'Idea de negocio y propuesta de valor', duracion:3, contenido:'', icono:'💡' },
        { id:'b3', titulo:'Análisis del mercado y competencia', duracion:3, contenido:'', icono:'📊' },
        { id:'b4', titulo:'Plan de empresa: jurídico, RRHH y marketing', duracion:4, contenido:'', icono:'📋' },
        { id:'b5', titulo:'Plan económico-financiero y viabilidad', duracion:4, contenido:'', icono:'💶' },
        { id:'b6', titulo:'Gestión operativa: simulación de Factusol, Nominasol y Contasol', duracion:4, contenido:'', icono:'⚙️' },
        { id:'b7', titulo:'Conclusiones, aprendizajes y reflexión del grupo', duracion:3, contenido:'', icono:'🎯' },
        { id:'b8', titulo:'Turno de preguntas del tribunal', duracion:5, contenido:'', icono:'❓' },
      ],
      // Posibles preguntas del tribunal
      preguntasPosibles: [
        { id:'p1', pregunta:'¿Por qué elegisteis esta forma jurídica y no otra?', respuesta:'', dificultad:'media' },
        { id:'p2', pregunta:'¿Cuál es vuestro umbral de rentabilidad y en qué mes lo superáis?', respuesta:'', dificultad:'alta' },
        { id:'p3', pregunta:'¿Cuál es vuestra principal ventaja competitiva frente a los competidores del sector?', respuesta:'', dificultad:'media' },
        { id:'p4', pregunta:'Si el IVA de vuestro producto sube del 10% al 21%, ¿qué impacto tiene en vuestra cuenta de resultados?', respuesta:'', dificultad:'alta' },
        { id:'p5', pregunta:'¿Qué haríais diferente si empezarais el proyecto de nuevo?', respuesta:'', dificultad:'media' },
        { id:'p6', pregunta:'¿Cómo habéis distribuido las funciones dentro del equipo?', respuesta:'', dificultad:'baja' },
        { id:'p7', pregunta:'¿Qué obligaciones fiscales periódicas tiene vuestra empresa?', respuesta:'', dificultad:'media' },
        { id:'p8', pregunta:'¿Cómo habéis calculado el precio de venta de vuestros productos?', respuesta:'', dificultad:'media' },
      ],
      // Rúbrica de autoevaluación de la presentación
      rubrica: {
        contenido:        null,
        estructuraTiempo: null,
        dominioProgramas: null,
        trabajoEquipo:    null,
        presentacionOral: null,
        respuestaPreguntas: null,
      },
      tiempoObjetivo: 1680, // 28 min en segundos
      ensayos: [],
      notas: '',
    },
  },

  // ── Evaluación docente RA/CE ──
  evalDocente: {
    tabActiva: '0656',   // '0656' | '0657' | 'optativa' | 'calificaciones'
    modoPonderacion: 'auto', // 'auto' | 'manual'
    // Alumnos del grupo (el docente los gestiona)
    alumnos: [
      { id:'a1', nombre:'Alumno/a 1', grupo:'G1' },
      { id:'a2', nombre:'Alumno/a 2', grupo:'G1' },
      { id:'a3', nombre:'Alumno/a 3', grupo:'G1' },
      { id:'a4', nombre:'Alumno/a 4', grupo:'G1' },
      { id:'a5', nombre:'Alumno/a 5', grupo:'G1' },
    ],
    // Pesos de los RA (por módulo)
    pesos: {
      '0656': { RA1:null, RA2:null, RA3:null, RA4:null, RA5:null, RA6:null },
      '0657': { RA1:null, RA2:null, RA3:null, RA4:null },
      'optativa': { RA1:null, RA2:null, RA3:null },
    },
    // Pesos de CE dentro de cada RA (clave: 'RA1a', etc.)
    pesosCE: {},
    // Calificaciones: { alumnoId: { ceId: nota (0-10 | null) } }
    calificaciones: {},
  },

  // ── Autoevaluación y coevaluación ──
  evaluacion: {
    // Autoevaluación: el alumno se evalúa a sí mismo por RA/CE del 0656
    auto: {
      guardado: false,
      fecha: null,
      // Periodos: uno por trimestre
      periodos: [
        { id:'T1', label:'1er Trimestre', completado:false, fecha:null, items:{} },
        { id:'T2', label:'2º Trimestre',  completado:false, fecha:null, items:{} },
      ],
      periodoActivo: 'T1',
      // items: { 'RA1a': { valor: 1-4, reflexion: '' }, ... }
    },
    // Coevaluación: evalúa a un compañero/a de equipo
    co: {
      periodoActivo: 'T1',
      periodos: [
        { id:'T1', label:'1er Trimestre', completado:false, fecha:null, evaluado:'', items:{}, reflexion:'' },
        { id:'T2', label:'2º Trimestre',  completado:false, fecha:null, evaluado:'', items:{}, reflexion:'' },
      ],
    },
    // Vista activa dentro del módulo
    vistaActiva: 'menu',  // menu | auto | co
  },

  // ── Configuración del profesor (bloqueada para el alumno) ──
  // ── Sistema de notificaciones ──
  notificaciones: {
    items: [],       // { id, tipo, titulo, cuerpo, icono, ts, leida, accion, accionLabel, autor, grupo }
    noLeidas: 0,
    panelAbierto: false,
    filtro: 'todas', // 'todas' | 'nuevas' | 'tarea' | 'correo' | 'mercado' | 'evaluacion' | 'sistema'
  },

  config: {
    sector: 'Distribución alimentaria · Vega Alta del Guadalquivir',
    grupoId: 'G1',
    descripcionSector: 'Sector definido por el docente. Tu empresa debe desarrollar su actividad dentro de este ámbito económico.',
  },

  // ── Datos que rellena el grupo (arrancan vacíos) ──
  datos: {
    nombre: '',
    formaJuridica: '',
    domicilioSocial: '',
    objetoSocial: '',
    descripcion: '',
    fechaConstitucion: '',
    cifProvisional: '',
    cnae: '',
    justificacion: '',

    // Capital y socios: lista dinámica
    socios: [],  // { nombre, tipoAportacion, descripcionBien, valorAportacion }

    organigrama: {
      direccion:    { alumno:'', tipoContrato:'', jornada:'', formacion:'', funciones:'', subpuestos:[] },
      rrhh:         { alumno:'', tipoContrato:'', jornada:'', formacion:'', funciones:'', subpuestos:[] },
      comercial:    { alumno:'', tipoContrato:'', jornada:'', formacion:'', funciones:'', subpuestos:[] },
      contabilidad: { alumno:'', tipoContrato:'', jornada:'', formacion:'', funciones:'', subpuestos:[] },
      fiscal:       { alumno:'', tipoContrato:'', jornada:'', formacion:'', funciones:'', subpuestos:[] },
    },
    viabilidad: {
      inversionInicial: 0, financiacionPropia: 0, financiacionAjena: 0,
      m1:0, m2:0, m3:0, m4:0, m5:0, m6:0, m7:0, m8:0, m9:0,
      gastosFijos: 0, gastosVariables: 0, umbralRentabilidad: 0,
      periodoRecuperacion: '', vanAnual: 0, tirAnual: 0,
      checklist: [false,false,false,false,false,false,false,false],
    }
  },
  tramites: [
    {
      id: 'notaria',
      organismo: 'Notaría',
      nombre: 'Escritura pública de constitución',
      descripcion: 'Otorgamiento ante Notario de la escritura de constitución de la Sociedad de Responsabilidad Limitada. Incluye los estatutos sociales y la designación de administradores.',
      plazo: 'Antes de iniciar la actividad',
      coste: '300 – 600 € (aranceles notariales)',
      documentos: ['DNI de todos los socios', 'Estatutos sociales redactados', 'Certificado negativo de denominación social (Registro Mercantil Central)', 'Certificado bancario de depósito del capital social (mín. 3.000 €)'],
      normativa: 'Ley 2/1995, de 23 de marzo, de Sociedades de Responsabilidad Limitada. Real Decreto Legislativo 1/2010 (LSC).',
      ra: 'RA5a · RA5b · RA5d',
      estado: 'completado',
      fecha: '2025-10-08',
      notas: 'Escritura otorgada. Número de protocolo: 2847/2025.',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Modelo 036 · Declaración censal (base para estatutos y alta)', tipo:'propio', desc:'Modelo completo con Pág.1 Identificación y Pág.2 IVA · Diseñado para SimulApp'},
        {nombre:'Solicitud de certificado de denominación · Registro Mercantil Central', tipo:'oficial', url:'https://www.rmc.es/portalservices/inicio', desc:'Solicitud online en el RMC (requiere navegador)'},
      ],
    },
    {
      id: 'registro-mercantil',
      organismo: 'Registro Mercantil',
      nombre: 'Inscripción en el Registro Mercantil Provincial',
      descripcion: 'Inscripción de la sociedad en el Registro Mercantil de la provincia de Sevilla. A partir de este momento la sociedad adquiere personalidad jurídica plena.',
      plazo: '2 meses desde la escritura notarial',
      coste: '150 – 400 € (aranceles registrales)',
      documentos: ['Primera copia de la escritura notarial', 'Liquidación del Impuesto sobre Transmisiones Patrimoniales (ITP) · Modelo 600', 'NIF provisional de la sociedad'],
      normativa: 'Real Decreto 1784/1996, de 19 de julio, Reglamento del Registro Mercantil.',
      ra: 'RA5a · RA5b · RA5c · RA5d',
      estado: 'completado',
      fecha: '2025-10-15',
      notas: 'Inscrita. Hoja SE-XXXXX. La sociedad adquiere plena personalidad jurídica.',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Solicitud de inscripción · Registro Mercantil de Sevilla', tipo:'propio', desc:'Modelo simplificado con todos los datos necesarios para la inscripción'},
        {nombre:'Modelo 600 · Liquidación ITP · Junta de Andalucía', tipo:'propio', desc:'Impuesto de Transmisiones Patrimoniales previo a la inscripción'},
      ],
    },
    {
      id: 'hacienda-nif',
      organismo: 'Agencia Tributaria (AEAT)',
      nombre: 'Obtención del NIF definitivo · Modelo 036',
      descripcion: 'Solicitud del Número de Identificación Fiscal definitivo de la sociedad y declaración censal de inicio de actividad económica. Permite emitir facturas y operar fiscalmente.',
      plazo: 'Antes del inicio de la actividad o en el mes siguiente a la constitución',
      coste: 'Gratuito',
      documentos: ['Modelo 036 cumplimentado', 'Escritura de constitución inscrita en el Registro Mercantil', 'DNI del representante legal', 'NIF provisional'],
      normativa: 'Ley 58/2003, General Tributaria. Real Decreto 1065/2007, Reglamento de Gestión e Inspección Tributaria.',
      ra: 'RA5a · RA5c · RA5e · RA5g',
      estado: 'completado',
      fecha: '2025-10-20',
      notas: 'NIF definitivo: B-41124578. Alta en el IAE epígrafe 612.1.',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Modelo 036 · Declaración censal de alta en el Censo', tipo:'propio', desc:'Modelo completo AEAT · Páginas de identificación y obligaciones fiscales'},
      ],
    },
    {
      id: 'hacienda-iva',
      organismo: 'Agencia Tributaria (AEAT)',
      nombre: 'Alta en el Régimen de IVA · Modelo 036',
      descripcion: 'Declaración del régimen de IVA aplicable a la actividad de la empresa. Para actividades de distribución alimentaria se aplica generalmente el tipo reducido del 4% para productos básicos y 10% para el resto.',
      plazo: 'Simultáneo al alta censal',
      coste: 'Gratuito',
      documentos: ['Modelo 036 (apartado de IVA)', 'Descripción de la actividad y productos'],
      normativa: 'Ley 37/1992, del Impuesto sobre el Valor Añadido.',
      ra: 'RA5a · RA5e · RA5h',
      estado: 'completado',
      fecha: '2025-10-20',
      notas: 'Régimen General de IVA. Declaraciones trimestrales: Mod. 303. Resumen anual: Mod. 390.',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Modelo 036 · Apartado IVA · Régimen y tipo aplicable', tipo:'propio', desc:'El mismo Modelo 036 · Completar especialmente la Página 2 de IVA'},
      ],
    },
    {
      id: 'ss-cuenta',
      organismo: 'Tesorería General de la Seguridad Social (TGSS)',
      nombre: 'Inscripción de la empresa en la S.S. y apertura de cuenta de cotización',
      descripcion: 'Registro de la empresa como empleadora ante la Seguridad Social. Asigna el código de cuenta de cotización (CCC) necesario para dar de alta a los trabajadores y cotizar.',
      plazo: 'Antes de dar de alta al primer trabajador',
      coste: 'Gratuito',
      documentos: ['Modelo TA-6 (Inscripción de empresa)', 'Escritura de constitución o documento equivalente', 'NIF de la empresa', 'DNI del representante legal', 'Código CNAE de la actividad principal'],
      normativa: 'Real Decreto Legislativo 8/2015, Ley General de la Seguridad Social.',
      ra: 'RA5a · RA5c · RA5f',
      estado: 'en-curso',
      fecha: null,
      notas: 'Solicitud presentada. En tramitación. CCC provisional asignado.',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Modelo TA.6 · Inscripción de empresa en la Seguridad Social', tipo:'propio', desc:'Solicitud de inscripción y apertura de Código de Cuenta de Cotización (CCC)'},
      ],
    },
    {
      id: 'ss-alta-autonomos',
      organismo: 'Tesorería General de la Seguridad Social (TGSS)',
      nombre: 'Alta en el RETA del administrador/socio trabajador',
      descripcion: 'Los socios con control efectivo de la sociedad (>33% del capital o >25% con funciones de dirección) deben darse de alta en el Régimen Especial de Trabajadores Autónomos.',
      plazo: 'Antes del inicio de la actividad',
      coste: 'Cuota mínima ~230 €/mes (2025). Variable según base de cotización elegida.',
      documentos: ['Modelo TA.0521 (Alta en RETA)', 'DNI', 'NIF de la empresa', 'Escritura que acredite el porcentaje de participación'],
      normativa: 'Art. 305 y ss. Real Decreto Legislativo 8/2015, LGSS.',
      ra: 'RA5a · RA5f · RA5h',
      estado: 'en-curso',
      fecha: null,
      notas: 'Pendiente de completar con datos bancarios para domiciliación.',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Modelo TA.0521 · Alta en el Régimen Especial de Autónomos (RETA)', tipo:'propio', desc:'Alta de socio/administrador con control efectivo en el RETA'},
      ],
    },
    {
      id: 'autoridad-laboral',
      organismo: 'Autoridad Laboral (Junta de Andalucía)',
      nombre: 'Comunicación de apertura del centro de trabajo',
      descripcion: 'Comunicación a la autoridad laboral de la apertura del centro de trabajo antes del inicio de la actividad. Obligatoria para empresas con trabajadores por cuenta ajena.',
      plazo: '30 días desde el inicio de la actividad',
      coste: 'Gratuito',
      documentos: ['Impreso oficial de comunicación de apertura', 'Datos del centro de trabajo', 'Datos de la empresa y representante', 'Número de trabajadores previstos', 'Plan de Prevención de Riesgos Laborales básico'],
      normativa: 'Real Decreto 1109/2007. Orden TIN/1071/2010.',
      ra: 'RA5a · RA5c · RA5f · RA5g',
      estado: 'pendiente',
      fecha: null,
      notas: '',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Comunicación de apertura de centro de trabajo · Autoridad Laboral', tipo:'propio', desc:'Modelo simplificado para comunicar la apertura a la Consejería de Empleo de Andalucía'},
      ],
    },
    {
      id: 'ayuntamiento-licencia',
      organismo: 'Ayuntamiento de Cantillana',
      nombre: 'Licencia de actividad y apertura del local',
      descripcion: 'Autorización municipal para el ejercicio de la actividad en el local previsto. Dependiendo de la naturaleza de la actividad puede ser una comunicación previa, declaración responsable o licencia completa.',
      plazo: 'Antes de la apertura al público',
      coste: '200 – 800 € (tasas municipales, variable según m²)',
      documentos: ['Impreso municipal de solicitud', 'Escritura de constitución y NIF', 'Plano del local', 'Memoria descriptiva de la actividad', 'Certificado de compatibilidad urbanística', 'Alta en IAE'],
      normativa: 'Ley 7/2002, de Ordenación Urbanística de Andalucía. Ordenanzas municipales de Cantillana.',
      ra: 'RA5a · RA5c · RA5g · RA5h',
      estado: 'pendiente',
      fecha: null,
      notas: '',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Solicitud de licencia de actividad y apertura · Ayuntamiento de Cantillana', tipo:'propio', desc:'Modelo adaptado a la ordenanza municipal de Cantillana para actividades comerciales'},
      ],
    },
    {
      id: 'prevencion',
      organismo: 'Mutua colaboradora / Servicio de PRL',
      nombre: 'Plan de Prevención de Riesgos Laborales',
      descripcion: 'Elaboración e implantación del Plan de Prevención de Riesgos Laborales. Para empresas de menos de 25 trabajadores puede ser asumido por el propio empresario si cuenta con formación suficiente.',
      plazo: 'Antes de contratar al primer trabajador',
      coste: '200 – 500 € (si se externaliza a servicio de PRL)',
      documentos: ['Plan de Prevención documentado', 'Evaluación de Riesgos', 'Planificación de la actividad preventiva', 'Formación de los trabajadores en PRL'],
      normativa: 'Ley 31/1995, de Prevención de Riesgos Laborales. RD 39/1997, Reglamento de los Servicios de Prevención.',
      ra: 'RA4f · RA5a · RA5g',
      estado: 'pendiente',
      fecha: null,
      notas: '',
      documentoSubido: null,
      anotacionProfesor: '',
      modelos: [
        {nombre:'Plan de Prevención de Riesgos Laborales · Plantilla nivel básico', tipo:'propio', desc:'Plantilla completa para empresas de menos de 25 trabajadores con tabla de evaluación de riesgos'},
      ],
    },
  ]
};

/* ── Helpers del módulo empresa ───────────────────────────────── */
function estadoTramiteHtml(estado) {
  const map = {
    'completado': '<span class="estado completado">✓ Completado</span>',
    'en-curso':   '<span class="estado pendiente">⟳ En curso</span>',
    'pendiente':  '<span class="estado bloqueado">○ Pendiente</span>',
  };
  return map[estado] || '';
}

function porcentajeTramites() {
  const total = EMPRESA_STATE.tramites.length;
  const hechos = EMPRESA_STATE.tramites.filter(t => t.estado === 'completado').length;
  return Math.round((hechos / total) * 100);
}

/* ============================================================
   VISTA EMPRESA — contenedor con navegación interna
   ============================================================ */
function vistaEmpresa() {
  const s = EMPRESA_STATE;
  const d = s.datos;

  return `
  <!-- Cabecera del módulo -->
  <div class="seccion-header">
    <div>
      <h2>🏢 Mi empresa</h2>
      <p>Ficha, organigrama y trámites de constitución · RA3 · RA5</p>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <span class="ra-chip">RA3</span>
      <span class="ra-chip">RA4</span>
      <span class="ra-chip">RA5</span>
      <button class="btn-ayuda-ctx" data-ayuda="empresa" onclick="toggleAyuda('empresa')" title="Conceptos y ayuda">❓ Ayuda</button>
      ${s.seccionActiva==='ficha'
        ? (s.modoEdicion
            ? '<button class="btn-accion" onclick="guardarFicha()">💾 Guardar ficha</button>'
            : '<button class="btn-secundario" onclick="EMPRESA_STATE.modoEdicion=true;vistaEmpresaRefresh()">✏️ Editar ficha</button>')
        : ''
      }
    </div>
  </div>

  <!-- Tabs de navegación interna -->
  <div class="empresa-tabs" id="empresa-tabs">
    <button class="emp-tab ${s.seccionActiva==='ficha'?'activo':''}"
      onclick="empTab('ficha')">📋 Ficha e identidad</button>
    <button class="emp-tab ${s.seccionActiva==='organigrama'?'activo':''}"
      onclick="empTab('organigrama')">👥 Organigrama</button>
    <button class="emp-tab ${s.seccionActiva==='tramites'?'activo':''}"
      onclick="empTab('tramites')">
      📑 Trámites de constitución
      <span class="tab-progreso">${porcentajeTramites()}%</span>
    </button>
  </div>

  <!-- Contenido de la sección activa -->
  <div id="empresa-contenido">
    ${renderSeccionEmpresa(s.seccionActiva)}
  </div>
  `;
}

function empTab(seccion) {
  EMPRESA_STATE.seccionActiva = seccion;
  vistaEmpresaRefresh();
}

function vistaEmpresaRefresh() {
  document.getElementById('contenido-principal').innerHTML = vistaEmpresa();
}

/* ── SECCIÓN: FICHA E IDENTIDAD ─────────────────────────────── */
/* ── HELPERS capital ─────────────────────────────────────────── */
function capitalTotalSocios() {
  return EMPRESA_STATE.datos.socios.reduce((s, p) => s + (parseFloat(p.valorAportacion) || 0), 0);
}
function participacionesSocio(valor) {
  return Math.floor((valor / 10));  // valor nominal 10 € por participación
}
function porcentajeSocio(valor) {
  const total = capitalTotalSocios();
  return total > 0 ? ((valor / total) * 100).toFixed(1) : 0;
}

function agregarSocio() {
  EMPRESA_STATE.datos.socios.push({ nombre: '', tipoAportacion: 'dineraria', descripcionBien: '', valorAportacion: '' });
  vistaEmpresaRefresh();
  empTab('ficha');
}

function eliminarSocio(idx) {
  EMPRESA_STATE.datos.socios.splice(idx, 1);
  vistaEmpresaRefresh();
  empTab('ficha');
}

function actualizarSocio(idx, campo, valor) {
  EMPRESA_STATE.datos.socios[idx][campo] = valor;
  // Recalcular porcentajes en tiempo real actualizando solo los elementos afectados
  const total = capitalTotalSocios();
  EMPRESA_STATE.datos.socios.forEach((s, i) => {
    const v = parseFloat(s.valorAportacion) || 0;
    const pct = total > 0 ? ((v / total) * 100).toFixed(1) : 0;
    const part = participacionesSocio(v);
    const elPct  = document.getElementById('pct-socio-' + i);
    const elPart = document.getElementById('part-socio-' + i);
    const elBar  = document.getElementById('bar-socio-' + i);
    const elTotal = document.getElementById('capital-total-display');
    if (elPct)  elPct.textContent  = pct + '%';
    if (elPart) elPart.textContent = part + ' part.';
    if (elBar)  elBar.style.width  = pct + '%';
    if (elTotal) elTotal.textContent = total.toLocaleString('es-ES') + ' €';
  });
}

function guardarFicha() {
  const d = EMPRESA_STATE.datos;
  const errores = [];
  if (!d.nombre.trim())         errores.push('Denominación social');
  if (!d.formaJuridica.trim())  errores.push('Forma jurídica');
  if (!d.domicilioSocial.trim()) errores.push('Domicilio social');
  if (!d.objetoSocial.trim())   errores.push('Objeto social');
  if (d.socios.length === 0)    errores.push('Al menos un socio');
  if (d.socios.some(s => !s.nombre.trim())) errores.push('Nombre de todos los socios');
  if (capitalTotalSocios() < 3000) errores.push('Capital mínimo de 3.000 € (S.L.)');

  if (errores.length > 0) {
    mostrarToast('⚠️ Faltan campos: ' + errores.join(', '), 'error');
    return;
  }
  EMPRESA_STATE.modoEdicion   = false;
  EMPRESA_STATE.fichaGuardada = true;
  vistaEmpresaRefresh();
  mostrarToast('✓ Ficha guardada correctamente', 'exito');
}

/* ── SECCIÓN: FICHA E IDENTIDAD ─────────────────────────────── */
/* ── Generadores de datos registrales ────────────────────────── */
function letraCIF(formaJuridica) {
  // Letras reales según tipo societario (España)
  const mapa = { SL:'B', SA:'A', COOP:'F', CB:'E', EI:'F' };
  return mapa[formaJuridica] || 'B';
}

function generarCIF(formaJuridica) {
  const letra  = letraCIF(formaJuridica || 'SL');
  // 2 dígitos provincia Sevilla (41) + 6 aleatorios
  const prov   = '41';
  const resto  = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  const digitos = prov + resto;
  // Dígito de control: suma de posiciones impares + doble de pares (simplificado)
  let sumPar = 0, sumImpar = 0;
  for (let i = 0; i < digitos.length; i++) {
    const d = parseInt(digitos[i]);
    if ((i + 1) % 2 === 0) { sumPar += d; }
    else {
      const doble = d * 2;
      sumImpar += doble > 9 ? doble - 9 : doble;
    }
  }
  const total    = (sumPar + sumImpar) % 10;
  const control  = total === 0 ? 0 : 10 - total;
  return letra + '-' + digitos + control;
}

function generarProtocolo() {
  const año  = new Date().getFullYear();
  const num  = Math.floor(Math.random() * 8000) + 1000;
  return num + '/' + año;
}

function generarHojaRegistro() {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return 'SE-' + num;
}

function onBlurNombreEmpresa(input) {
  const nombre = input.value.trim();
  EMPRESA_STATE.datos.nombre = nombre;
  input.classList.toggle('ficha-input-vacio', !nombre);

  // Generar CIF si hay nombre y aún no se ha generado
  if (nombre && !EMPRESA_STATE.datos.cifProvisional) {
    const fj  = EMPRESA_STATE.datos.formaJuridica || 'SL';
    const cif = generarCIF(fj);
    EMPRESA_STATE.datos.cifProvisional = cif;

    // Actualizar el campo CIF en el DOM sin recargar toda la vista
    const elCif = document.getElementById('cif-display');
    if (elCif) {
      elCif.textContent = cif;
      elCif.classList.add('cif-animado');
      setTimeout(() => elCif.classList.remove('cif-animado'), 600);
    }
    mostrarToast('🏛️ CIF provisional asignado: ' + cif, 'exito');
  }
}

function onChangeFJ(select) {
  EMPRESA_STATE.datos.formaJuridica = select.value;
  select.classList.toggle('ficha-input-vacio', !select.value);

  // Regenerar CIF si ya había uno (la letra cambia según forma jurídica)
  if (EMPRESA_STATE.datos.cifProvisional && EMPRESA_STATE.datos.nombre) {
    const nuevo = generarCIF(select.value);
    EMPRESA_STATE.datos.cifProvisional = nuevo;
    const elCif = document.getElementById('cif-display');
    if (elCif) {
      elCif.textContent = nuevo;
      elCif.classList.add('cif-animado');
      setTimeout(() => elCif.classList.remove('cif-animado'), 600);
    }
  }
}

function seccionFicha() {
  const d   = EMPRESA_STATE.datos;
  const cfg = EMPRESA_STATE.config;
  const edit = EMPRESA_STATE.modoEdicion;
  const capitalTotal = capitalTotalSocios();

  // ── Helpers input/textarea ──────────────────────────────────
  const campo = (label, key, tipo, placeholder, ayuda) => {
    tipo = tipo || 'text'; placeholder = placeholder || ''; ayuda = ayuda || '';
    const val = d[key] || '';
    return `
    <div class="ficha-campo">
      <label>${label}${ayuda ? ` <span class="campo-ayuda" title="${ayuda}">ⓘ</span>` : ''}</label>
      ${edit
        ? `<input type="${tipo}" value="${val}" placeholder="${placeholder}"
             class="ficha-input${!val ? ' ficha-input-vacio' : ''}"
             oninput="EMPRESA_STATE.datos['${key}']=this.value;this.classList.toggle('ficha-input-vacio',!this.value)">`
        : val
          ? `<div class="ficha-valor">${val}</div>`
          : `<div class="ficha-valor ficha-vacio-vista">Sin rellenar</div>`
      }
    </div>`;
  };

  const campoTexto = (label, key, placeholder, ayuda) => {
    placeholder = placeholder || ''; ayuda = ayuda || '';
    const val = d[key] || '';
    return `
    <div class="ficha-campo">
      <label>${label}${ayuda ? ` <span class="campo-ayuda" title="${ayuda}">ⓘ</span>` : ''}</label>
      ${edit
        ? `<textarea class="ficha-input${!val ? ' ficha-input-vacio' : ''}" style="min-height:80px"
             placeholder="${placeholder}"
             oninput="EMPRESA_STATE.datos['${key}']=this.value;this.classList.toggle('ficha-input-vacio',!this.value)">${val}</textarea>`
        : val
          ? `<div class="ficha-valor" style="line-height:1.6;white-space:pre-line">${val}</div>`
          : `<div class="ficha-valor ficha-vacio-vista">Sin rellenar</div>`
      }
    </div>`;
  };

  return `
  <!-- Banner aviso solo cuando está en edición y no guardada -->
  ${!EMPRESA_STATE.fichaGuardada && edit ? `
  <div class="ficha-banner-aviso">
    <span>✏️</span>
    <div>
      <strong>Ficha en elaboración</strong>
      <p>Rellena todos los campos y pulsa "Guardar ficha". El capital mínimo para una S.L. es de 3.000 €. Los campos con borde amarillo están pendientes de rellenar.</p>
    </div>
  </div>` : ''}

  <div class="empresa-grid-ficha">

    <!-- ── Columna izquierda ── -->
    <div style="display:flex;flex-direction:column;gap:1rem">

      <!-- Sector bloqueado -->
      <div class="ficha-card ficha-card-sector">
        <div class="ficha-card-header">
          <span>🏫</span> Sector económico asignado
          <span style="margin-left:auto;font-size:0.7rem;background:rgba(255,255,255,.2);padding:3px 9px;border-radius:20px;font-weight:600">Definido por el docente</span>
        </div>
        <div style="font-size:0.95rem;font-weight:600;color:var(--verde-900);margin-bottom:4px">${cfg.sector}</div>
        <div style="font-size:0.78rem;color:var(--verde-700);line-height:1.4">${cfg.descripcionSector}</div>
      </div>

      <!-- Identidad básica -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>🏢</span> Identidad de la empresa
          <span class="ra-chip" style="margin-left:auto">RA3a · RA3b</span>
        </div>
        <div class="ficha-grid-2">

          <!-- Denominación social -->
          <div class="ficha-campo">
            <label>Denominación social <span class="campo-ayuda" title="Nombre oficial que aparecerá en todos los documentos legales">ⓘ</span></label>
            ${edit
              ? `<input type="text" value="${d.nombre}"
                   placeholder="Ej: Distribuciones García S.L."
                   class="ficha-input${!d.nombre ? ' ficha-input-vacio' : ''}"
                   oninput="EMPRESA_STATE.datos.nombre=this.value;this.classList.toggle('ficha-input-vacio',!this.value)"
                   onblur="onBlurNombreEmpresa(this)">`
              : d.nombre
                ? `<div class="ficha-valor">${d.nombre}</div>`
                : `<div class="ficha-valor ficha-vacio-vista">Sin rellenar</div>`
            }
          </div>

          <!-- Forma jurídica -->
          <div class="ficha-campo">
            <label>Forma jurídica <span class="campo-ayuda" title="La letra del CIF depende de la forma jurídica elegida">ⓘ</span></label>
            ${edit
              ? `<select class="ficha-input${!d.formaJuridica ? ' ficha-input-vacio' : ''}"
                   onchange="onChangeFJ(this)">
                   <option value="">— Selecciona —</option>
                   <option value="SL"   ${d.formaJuridica==='SL'  ?'selected':''}>Sociedad de Responsabilidad Limitada (S.L.)</option>
                   <option value="SA"   ${d.formaJuridica==='SA'  ?'selected':''}>Sociedad Anónima (S.A.)</option>
                   <option value="COOP" ${d.formaJuridica==='COOP'?'selected':''}>Sociedad Cooperativa</option>
                   <option value="CB"   ${d.formaJuridica==='CB'  ?'selected':''}>Comunidad de Bienes</option>
                   <option value="EI"   ${d.formaJuridica==='EI'  ?'selected':''}>Empresario/a Individual</option>
                 </select>`
              : `<div class="ficha-valor">${{SL:'S.L. · Sociedad de Responsabilidad Limitada',SA:'S.A. · Sociedad Anónima',COOP:'Sociedad Cooperativa',CB:'Comunidad de Bienes',EI:'Empresario/a Individual'}[d.formaJuridica]||'Sin rellenar'}</div>`
            }
          </div>

          <!-- CIF provisional — solo lectura reactivo -->
          <div class="ficha-campo">
            <label>CIF provisional <span class="campo-ayuda" title="Se genera automáticamente al escribir la denominación social">ⓘ</span></label>
            <div class="cif-campo-wrap${d.cifProvisional ? ' cif-asignado' : ''}">
              <span id="cif-display" class="${d.cifProvisional ? 'cif-generado' : 'ficha-vacio-vista'}">
                ${d.cifProvisional || 'Se generará al escribir la denominación'}
              </span>
              ${d.cifProvisional ? '<span class="cif-badge">🏛️ Asignado</span>' : ''}
            </div>
          </div>

          ${campo('Código CNAE', 'cnae', 'text',
            'Ej: 4631 - Comercio al por mayor de frutas',
            'Clasificación Nacional de Actividades Económicas')}
          ${campo('Fecha de constitución', 'fechaConstitucion', 'date')}
          ${campo('Domicilio social', 'domicilioSocial', 'text',
            'Ej: C/ Mayor, 5 · 41930 Cantillana (Sevilla)')}
        </div>

        ${campoTexto('Objeto social', 'objetoSocial',
          'Describe la actividad principal de la empresa tal como aparecerá en los estatutos...',
          'Descripción formal de las actividades. Aparece en la escritura notarial.')}
        ${campoTexto('Descripción del proyecto empresarial', 'descripcion',
          'Explica en qué consiste tu empresa, qué productos ofrece, a quién va dirigida...')}
      </div>

      <!-- Justificación forma jurídica -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>⚖️</span> Justificación de la forma jurídica
          <span class="ra-chip" style="margin-left:auto">RA3e · RA3h</span>
        </div>
        <div style="font-size:0.78rem;color:var(--gris-500);margin-bottom:10px;line-height:1.5">
          Explica por qué habéis elegido esta forma jurídica y no otras. Razona las ventajas,
          los inconvenientes considerados y las alternativas descartadas.
        </div>
        ${edit
          ? `<textarea class="ficha-input${!d.justificacion ? ' ficha-input-vacio' : ''}"
               style="min-height:120px"
               placeholder="Hemos elegido la S.L. porque nos ofrece responsabilidad limitada...&#10;Frente a la S.A. descartamos esta opción porque el capital mínimo...&#10;El empresario individual no se adapta porque..."
               oninput="EMPRESA_STATE.datos.justificacion=this.value;this.classList.toggle('ficha-input-vacio',!this.value)">${d.justificacion}</textarea>`
          : d.justificacion
            ? `<div class="ficha-valor" style="line-height:1.6;white-space:pre-line">${d.justificacion}</div>`
            : `<div class="ficha-valor ficha-vacio-vista">Sin rellenar</div>`
        }
      </div>

    </div><!-- /col izquierda -->

    <!-- ── Columna derecha ── -->
    <div style="display:flex;flex-direction:column;gap:1rem">

      <!-- Estado rápido -->
      <div class="ficha-card">
        <div class="ficha-card-header"><span>📌</span> Estado de la empresa</div>
        <div class="emp-estado-grid">
          <div class="emp-estado-item">
            <div class="emp-estado-valor verde" id="capital-total-display">${capitalTotal.toLocaleString('es-ES')} €</div>
            <div class="emp-estado-etiq">Capital social</div>
          </div>
          <div class="emp-estado-item">
            <div class="emp-estado-valor">${d.socios.length}</div>
            <div class="emp-estado-etiq">Socios</div>
          </div>
          <div class="emp-estado-item">
            <div class="emp-estado-valor">${Math.floor(capitalTotal / 10)}</div>
            <div class="emp-estado-etiq">Participaciones</div>
          </div>
          <div class="emp-estado-item">
            <div class="emp-estado-valor${EMPRESA_STATE.fichaGuardada ? ' verde' : ''}">
              ${EMPRESA_STATE.fichaGuardada ? '✓ Guardada' : 'Borrador'}
            </div>
            <div class="emp-estado-etiq">Estado</div>
          </div>
        </div>
        ${capitalTotal > 0 && capitalTotal < 3000
          ? `<div style="margin-top:10px;padding:8px 10px;background:#fef9ec;border-radius:var(--radio-sm);border-left:3px solid #f59e0b;font-size:0.78rem;color:#92400e">
              ⚠️ Capital actual ${capitalTotal.toLocaleString('es-ES')} € · El mínimo legal para una S.L. es <strong>3.000 €</strong>
             </div>`
          : capitalTotal >= 3000
            ? `<div style="margin-top:10px;padding:8px 10px;background:var(--verde-50);border-radius:var(--radio-sm);border-left:3px solid var(--verde-500);font-size:0.78rem;color:var(--verde-800)">
                ✓ Capital superior al mínimo legal de 3.000 €
               </div>`
            : ''}
      </div>

      <!-- Capital y socios -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>🍰</span> Capital social y socios
          <span class="ra-chip" style="margin-left:auto">RA3e · RA3f · RA3g</span>
        </div>
        <div class="capital-regla">
          <span>💡</span>
          <span>Valor nominal: <strong>10 €/participación</strong> · Mínimo S.L.: <strong>3.000 €</strong> · Aportaciones en metálico o bienes materiales</span>
        </div>

        <div id="socios-lista">
          ${d.socios.length === 0
            ? `<div class="socios-vacio">
                <div style="font-size:2rem;opacity:.3">👤</div>
                <p>Añade los socios del grupo y su aportación al capital social</p>
               </div>`
            : d.socios.map((s, i) => socioRow(s, i, edit)).join('')
          }
        </div>

        ${edit
          ? `<button class="btn-secundario" style="width:100%;margin-top:10px;justify-content:center"
               onclick="agregarSocio()">+ Añadir socio/a</button>`
          : ''}

        ${d.socios.length > 0 ? `
        <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--gris-100)">
          <div style="font-size:0.72rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">
            Distribución del capital
          </div>
          ${d.socios.map((s, i) => {
            const v   = parseFloat(s.valorAportacion) || 0;
            const pct = parseFloat(porcentajeSocio(v));
            const part = participacionesSocio(v);
            return `
            <div class="participacion-row">
              <div class="part-avatar">${(s.nombre||'?').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}</div>
              <div class="part-info">
                <div class="part-nombre">${s.nombre || '(sin nombre)'}</div>
                <div class="part-barra-wrap">
                  <div class="part-barra">
                    <div class="part-fill" id="bar-socio-${i}" style="width:${pct}%"></div>
                  </div>
                  <span class="part-pct" id="pct-socio-${i}">${pct}%</span>
                </div>
              </div>
              <div class="part-num">
                <div style="font-weight:600;color:var(--verde-700);font-size:0.8rem" id="part-socio-${i}">${part} part.</div>
                <div style="font-size:0.65rem;color:var(--gris-400)">${v > 0 ? v.toLocaleString('es-ES') + ' €' : ''}</div>
              </div>
            </div>`;
          }).join('')}
        </div>` : ''}
      </div>

      <!-- Botón guardar -->
      ${edit
        ? `<button class="btn-primario" onclick="guardarFicha()" style="width:100%">
             💾 Guardar ficha de la empresa
           </button>
           <p style="font-size:0.72rem;color:var(--gris-400);text-align:center;margin-top:-4px">
             Podrás seguir editando después si el grupo decide cambiar algo
           </p>`
        : `<button class="btn-secundario" style="width:100%;justify-content:center"
             onclick="EMPRESA_STATE.modoEdicion=true;vistaEmpresaRefresh()">
             ✏️ Modificar ficha
           </button>`
      }

    </div><!-- /col derecha -->
  </div>`;
}

/* ── Fila de socio ───────────────────────────────────────────── */
function socioRow(s, idx, edit) {
  const v = parseFloat(s.valorAportacion) || 0;
  if (!edit) {
    return `
    <div style="padding:8px 0;border-bottom:1px solid var(--gris-50);font-size:0.82rem;display:flex;gap:8px;align-items:center">
      <div class="part-avatar">${(s.nombre||'?').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}</div>
      <div style="flex:1">
        <strong>${s.nombre}</strong>
        <span style="margin-left:6px;font-size:0.72rem;color:var(--gris-400)">
          ${s.tipoAportacion === 'dineraria' ? '💶 Metálico' : '📦 ' + (s.descripcionBien || 'Bien material')}
        </span>
      </div>
      <strong style="color:var(--verde-700)">${v.toLocaleString('es-ES')} €</strong>
    </div>`;
  }
  return `
  <div class="socio-row" id="socio-row-${idx}">
    <div class="socio-row-header">
      <span class="socio-num">${idx + 1}</span>
      <input type="text" class="ficha-input" style="flex:1;margin:0"
        placeholder="Nombre completo del socio/a"
        value="${s.nombre}"
        oninput="actualizarSocio(${idx},'nombre',this.value)">
      <button class="btn-eliminar-socio" onclick="eliminarSocio(${idx})" title="Eliminar socio">✕</button>
    </div>
    <div class="socio-row-body">
      <div class="ficha-campo" style="margin-bottom:0">
        <label>Tipo de aportación</label>
        <select class="ficha-input"
          onchange="actualizarSocio(${idx},'tipoAportacion',this.value);vistaEmpresaRefresh();empTab('ficha')">
          <option value="dineraria"     ${s.tipoAportacion==='dineraria'    ?'selected':''}>💶 Dineraria (metálico)</option>
          <option value="bien-material" ${s.tipoAportacion==='bien-material'?'selected':''}>📦 No dineraria (bien material)</option>
        </select>
      </div>
      ${s.tipoAportacion === 'bien-material' ? `
      <div class="ficha-campo" style="margin-bottom:0">
        <label>Descripción del bien</label>
        <input type="text" class="ficha-input"
          placeholder="Ej: Furgoneta Ford Transit, año 2019"
          value="${s.descripcionBien}"
          oninput="actualizarSocio(${idx},'descripcionBien',this.value)">
      </div>` : ''}
      <div class="ficha-campo" style="margin-bottom:0">
        <label>Valor de la aportación (€)</label>
        <input type="number" class="ficha-input" min="0" step="100"
          placeholder="0"
          value="${s.valorAportacion}"
          oninput="actualizarSocio(${idx},'valorAportacion',this.value)">
      </div>
    </div>
  </div>`;
}

/* ============================================================
   CONSTANTES Y HELPERS — MÓDULO ORGANIGRAMA
   ============================================================ */
const TIPOS_ESTRUCTURA = {
  lineal:     { icono:'🏛️', nombre:'Lineal', desc:'Autoridad directa de arriba hacia abajo. Clara y sencilla para empresas pequeñas.' },
  funcional:  { icono:'⚙️', nombre:'Funcional', desc:'Cada área especializada dirige sus procesos. Fomenta la especialización.' },
  matricial:  { icono:'🔲', nombre:'Matricial', desc:'Combina línea y función. Permite proyectos transversales entre departamentos.' },
  mixta:      { icono:'🔀', nombre:'Mixta', desc:'Combina elementos de varios tipos según las necesidades de la empresa.' },
};

const DEPTS_BASE = [
  { key:'direccion',    nivel:'dir', icono:'🎯', nombre:'Dirección',               soft:'—',
    funcionesGuia:'Planificación estratégica · Toma de decisiones · Representación legal · Presidir reuniones · Firmar contratos',
    formacionGuia:'Administración de Empresas · MBA · Experiencia en gestión' },
  { key:'rrhh',         nivel:'dept', icono:'👥', nombre:'Administración y RRHH',   soft:'Nominasol',
    funcionesGuia:'Selección y contratación · Gestión nóminas · Altas/bajas S.S. · Control de asistencia · Formación del personal',
    formacionGuia:'Relaciones Laborales · Gestión de RRHH · Conocimiento legislación laboral' },
  { key:'comercial',    nivel:'dept', icono:'🧾', nombre:'Comercial',               soft:'Factusol',
    funcionesGuia:'Captación de clientes · Emisión de facturas · Negociación con proveedores · Control de stocks · Gestión de pedidos',
    formacionGuia:'Marketing · Comercio · Conocimiento del sector y productos' },
  { key:'contabilidad', nivel:'dept', icono:'📊', nombre:'Contabilidad y Finanzas', soft:'Contasol',
    funcionesGuia:'Registro contable diario · Cierre mensual · Tesorería · Balances · Análisis financiero · Liquidación IVA',
    formacionGuia:'Contabilidad · Finanzas · Dominio del PGC y software contable' },
  { key:'fiscal',       nivel:'dept', icono:'⚖️', nombre:'Fiscal y Legal',          soft:'AEAT Sede',
    funcionesGuia:'Declaraciones fiscales periódicas · Cumplimiento normativo · Contratos mercantiles · Asesoría jurídica interna',
    formacionGuia:'Derecho Fiscal · Asesoría Tributaria · Conocimiento de tributos empresariales' },
];

/* ── Helpers de estado del organigrama ──────────────────────── */
function orgModoEdicion()       { return EMPRESA_STATE.organigrama.modoEdicion; }
function orgEditando(key)       { return EMPRESA_STATE.organigrama.deptAbierto === key; }
function orgToggleEdicion() {
  const o = EMPRESA_STATE.organigrama;
  o.modoEdicion = !o.modoEdicion;
  if (!o.modoEdicion) {
    o.deptAbierto = null;
    o.orgGuardado = true;
    mostrarToast('✓ Organigrama guardado', 'exito');
  }
  vistaEmpresaRefresh(); empTab('organigrama');
}
function orgAbrirDept(key) {
  const o = EMPRESA_STATE.organigrama;
  o.deptAbierto = (o.deptAbierto === key) ? null : key;
  vistaEmpresaRefresh(); empTab('organigrama');
}
function orgGuardarDept(key) {
  const org = EMPRESA_STATE.datos.organigrama[key];
  org.alumno      = document.getElementById('org-alumno-'    + key).value.trim();
  org.tipoContrato= document.getElementById('org-contrato-'  + key).value;
  org.jornada     = document.getElementById('org-jornada-'   + key).value;
  org.formacion   = document.getElementById('org-formacion-' + key).value.trim();
  org.funciones   = document.getElementById('org-funciones-' + key).value.trim();
  EMPRESA_STATE.organigrama.deptAbierto = null;
  vistaEmpresaRefresh(); empTab('organigrama');
  mostrarToast('✓ Puesto guardado', 'exito');
}
function orgAnadirSubpuesto(key) {
  EMPRESA_STATE.datos.organigrama[key].subpuestos.push({ nombre:'', alumno:'', funciones:'' });
  vistaEmpresaRefresh(); empTab('organigrama');
  // Mantener el dept abierto
  EMPRESA_STATE.organigrama.deptAbierto = key;
  vistaEmpresaRefresh(); empTab('organigrama');
}
function orgEliminarSubpuesto(key, idx) {
  EMPRESA_STATE.datos.organigrama[key].subpuestos.splice(idx, 1);
  EMPRESA_STATE.organigrama.deptAbierto = key;
  vistaEmpresaRefresh(); empTab('organigrama');
}
function orgActualizarSubpuesto(key, idx, campo, valor) {
  EMPRESA_STATE.datos.organigrama[key].subpuestos[idx][campo] = valor;
}
function orgValidar() {
  const alertas = [];
  const org = EMPRESA_STATE.datos.organigrama;
  if (!EMPRESA_STATE.organigrama.tipoEstructura)
    alertas.push({ tipo:'warn', msg:'No habéis definido el tipo de estructura organizativa.' });
  DEPTS_BASE.forEach(d => {
    if (!org[d.key].alumno)
      alertas.push({ tipo:'warn', msg:`El puesto de ${d.nombre} no tiene responsable asignado.` });
    if (!org[d.key].funciones)
      alertas.push({ tipo:'info', msg:`El puesto de ${d.nombre} no tiene funciones redactadas.` });
  });
  return alertas;
}

function seccionOrganigrama() {
  const org   = EMPRESA_STATE.datos.organigrama;
  const oState = EMPRESA_STATE.organigrama;
  const edit  = orgModoEdicion();
  const alertas = orgValidar();
  const nombreEmp = EMPRESA_STATE.datos.nombre || 'la empresa';

  return `
  <!-- Cabecera de sección -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem;gap:16px">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">Organigrama de ${nombreEmp}</h3>
      <p style="font-size:0.8rem;color:var(--gris-500);margin-top:2px">
        Estructura organizativa · Funciones y perfiles de puesto
        <span class="ra-chip" style="margin-left:6px">RA3c · RA3d · RA3h</span>
      </p>
    </div>
    <div style="display:flex;gap:8px;flex-shrink:0">
      ${edit
        ? `<button class="btn-accion" onclick="orgToggleEdicion()">💾 Guardar organigrama</button>`
        : `<button class="btn-secundario" onclick="orgToggleEdicion()">✏️ Editar organigrama</button>`
      }
    </div>
  </div>

  <!-- Alertas de validación -->
  ${alertas.length > 0 && edit ? `
  <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:1.25rem">
    ${alertas.map(a => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;
      background:${a.tipo==='warn'?'#fef9ec':'var(--verde-50)'};
      border-radius:var(--radio-sm);font-size:0.8rem;
      border-left:3px solid ${a.tipo==='warn'?'#f59e0b':'var(--verde-400)'}">
      <span>${a.tipo==='warn'?'⚠️':'ℹ️'}</span>
      <span style="color:${a.tipo==='warn'?'#92400e':'var(--verde-800)'}">${a.msg}</span>
    </div>`).join('')}
  </div>` : ''}

  <!-- Tipo de estructura organizativa -->
  <div class="ficha-card" style="margin-bottom:1rem">
    <div class="ficha-card-header">
      <span>🏗️</span> Tipo de estructura organizativa
      <span class="ra-chip" style="margin-left:auto">RA3c · RA3h</span>
    </div>
    ${edit ? `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
      ${Object.entries(TIPOS_ESTRUCTURA).map(([key, t]) => `
      <div class="tipo-org-card ${oState.tipoEstructura===key?'tipo-org-activo':''}"
        onclick="EMPRESA_STATE.organigrama.tipoEstructura='${key}';vistaEmpresaRefresh();empTab('organigrama')">
        <div class="tipo-org-icono">${t.icono}</div>
        <div class="tipo-org-nombre">${t.nombre}</div>
        <div class="tipo-org-desc">${t.desc}</div>
      </div>`).join('')}
    </div>` : oState.tipoEstructura ? `
    <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--verde-50);border-radius:var(--radio-md)">
      <span style="font-size:1.4rem">${(TIPOS_ESTRUCTURA[oState.tipoEstructura] && TIPOS_ESTRUCTURA[oState.tipoEstructura].icono)}</span>
      <div>
        <div style="font-weight:600;color:var(--verde-800)">${(TIPOS_ESTRUCTURA[oState.tipoEstructura] && TIPOS_ESTRUCTURA[oState.tipoEstructura].nombre)}</div>
        <div style="font-size:0.78rem;color:var(--verde-600)">${(TIPOS_ESTRUCTURA[oState.tipoEstructura] && TIPOS_ESTRUCTURA[oState.tipoEstructura].desc)}</div>
      </div>
    </div>` : `<div class="ficha-vacio-vista" style="padding:8px">Sin definir</div>`}

    <!-- Justificación de la estructura -->
    <div style="margin-top:12px">
      <label style="font-size:0.72rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:6px">
        Justificación de la estructura elegida
      </label>
      ${edit
        ? `<textarea class="ficha-input ${!oState.justificacion?'ficha-input-vacio':''}" style="min-height:70px"
             placeholder="Explicad por qué esta estructura es la más adecuada para vuestra empresa, qué ventajas os ofrece y qué alternativas habéis descartado..."
             oninput="EMPRESA_STATE.organigrama.justificacion=this.value;this.classList.toggle('ficha-input-vacio',!this.value)">${oState.justificacion}</textarea>`
        : oState.justificacion
          ? `<div class="ficha-valor" style="line-height:1.6">${oState.justificacion}</div>`
          : `<div class="ficha-vacio-vista">Sin redactar</div>`
      }
    </div>
  </div>

  <!-- Diagrama visual -->
  <div class="org-diagrama" style="margin-bottom:1rem">
    <div class="org-nivel-1">
      ${orgCardVisual(DEPTS_BASE[0], org[DEPTS_BASE[0].key])}
    </div>
    <div class="org-linea-v"></div>
    <div class="org-linea-h"></div>
    <div class="org-nivel-2">
      ${DEPTS_BASE.slice(1).map(d => orgCardVisual(d, org[d.key])).join('')}
    </div>
  </div>

  <!-- Puestos detallados (semi-guiados) -->
  <div style="display:flex;flex-direction:column;gap:10px">
    ${DEPTS_BASE.map(dept => orgPuestoCard(dept, org[dept.key], edit)).join('')}
  </div>`;
}

/* ── Card visual del diagrama ────────────────────────────────── */
function orgCardVisual(dept, datos) {
  const esDir = dept.nivel === 'dir';
  const ini = (datos.alumno||'?').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
  const haySubpuestos = datos.subpuestos && datos.subpuestos.length > 0;
  return `
  <div class="org-card ${esDir?'org-card-dir':''}" onclick="orgAbrirDept('${dept.key}')" style="cursor:pointer">
    <div class="org-card-icono">${dept.icono}</div>
    <div class="org-card-nombre">${dept.nombre}</div>
    <div class="org-card-alumno">
      <div class="org-avatar">${ini}</div>
      <span>${datos.alumno ? datos.alumno.split(' ').slice(0,2).join(' ') : '— sin asignar —'}</span>
    </div>
    ${haySubpuestos ? `<div style="font-size:0.6rem;margin-top:4px;opacity:.7">+${datos.subpuestos.length} subpuesto${datos.subpuestos.length>1?'s':''}</div>` : ''}
  </div>`;
}

/* ── Card detalle de puesto ──────────────────────────────────── */
function orgPuestoCard(dept, datos, edit) {
  const abierto  = orgEditando(dept.key);
  const esDir    = dept.nivel === 'dir';
  const completo = datos.alumno && datos.funciones;
  const ini = (datos.alumno||'?').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();

  return `
  <div class="puesto-card ${esDir?'puesto-card-dir':''} ${completo?'puesto-card-ok':''}">

    <!-- Cabecera del puesto -->
    <div class="puesto-header" onclick="orgAbrirDept('${dept.key}')">
      <div class="puesto-icono-wrap ${esDir?'puesto-icono-dir':''}">${dept.icono}</div>
      <div style="flex:1">
        <div class="puesto-nombre">${dept.nombre}</div>
        <div class="puesto-meta">
          ${datos.alumno
            ? `<div class="puesto-responsable"><div class="org-avatar" style="width:18px;height:18px;font-size:0.55rem">${ini}</div>${datos.alumno}</div>`
            : `<span style="color:var(--gris-300);font-style:italic">Sin responsable asignado</span>`}
          ${datos.tipoContrato ? `<span class="puesto-tag">${datos.tipoContrato}</span>` : ''}
          ${datos.jornada      ? `<span class="puesto-tag">${datos.jornada}</span>`      : ''}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
        <span class="puesto-soft">${dept.soft}</span>
        ${completo
          ? `<span style="color:var(--verde-500);font-size:0.75rem">✓</span>`
          : `<span style="color:#f59e0b;font-size:0.75rem">○</span>`}
        ${edit ? `
        <button class="btn-secundario" style="padding:4px 10px;font-size:0.72rem"
          onclick="event.stopPropagation();orgAbrirDept('${dept.key}')">
          ${abierto ? '▲ Cerrar' : '✏️ Editar'}
        </button>` : ''}
        <div style="font-size:0.75rem;color:var(--gris-400);transition:transform .2s;transform:${abierto?'rotate(90deg)':''}">▶</div>
      </div>
    </div>

    <!-- Panel desplegable -->
    ${abierto ? `
    <div class="puesto-body">
      ${edit ? orgFormularioPuesto(dept, datos) : orgVistaPuesto(dept, datos)}
    </div>` : ''}

  </div>`;
}

/* ── Formulario de edición del puesto ───────────────────────── */
function orgFormularioPuesto(dept, datos) {
  return `
  <div class="puesto-form">

    <!-- Responsable y datos laborales -->
    <div class="puesto-form-grid">
      <div class="ficha-campo">
        <label>Alumno/a responsable</label>
        <input id="org-alumno-${dept.key}" type="text" class="ficha-input"
          placeholder="Nombre completo" value="${datos.alumno||''}">
      </div>
      <div class="ficha-campo">
        <label>Tipo de contrato</label>
        <select id="org-contrato-${dept.key}" class="ficha-input">
          <option value="" ${!datos.tipoContrato?'selected':''}>— Selecciona —</option>
          <option value="Indefinido" ${datos.tipoContrato==='Indefinido'?'selected':''}>Indefinido</option>
          <option value="Temporal" ${datos.tipoContrato==='Temporal'?'selected':''}>Temporal</option>
          <option value="Prácticas" ${datos.tipoContrato==='Prácticas'?'selected':''}>En prácticas</option>
          <option value="Formación" ${datos.tipoContrato==='Formación'?'selected':''}>Formación y aprendizaje</option>
          <option value="Mercantil" ${datos.tipoContrato==='Mercantil'?'selected':''}>Mercantil (administrador)</option>
        </select>
      </div>
      <div class="ficha-campo">
        <label>Jornada laboral</label>
        <select id="org-jornada-${dept.key}" class="ficha-input">
          <option value="" ${!datos.jornada?'selected':''}>— Selecciona —</option>
          <option value="Completa" ${datos.jornada==='Completa'?'selected':''}>Jornada completa</option>
          <option value="Parcial 50%" ${datos.jornada==='Parcial 50%'?'selected':''}>Parcial 50%</option>
          <option value="Parcial 75%" ${datos.jornada==='Parcial 75%'?'selected':''}>Parcial 75%</option>
        </select>
      </div>
      <div class="ficha-campo">
        <label>Formación requerida</label>
        <input id="org-formacion-${dept.key}" type="text" class="ficha-input"
          placeholder="${dept.formacionGuia.split('·')[0].trim()}"
          value="${datos.formacion||''}">
      </div>
    </div>

    <!-- Funciones del puesto -->
    <div class="ficha-campo" style="margin-top:4px">
      <label>
        Funciones principales del puesto
        <span class="ra-chip" style="margin-left:6px">RA3d</span>
      </label>
      <div style="font-size:0.72rem;color:var(--gris-400);margin-bottom:6px;line-height:1.4">
        💡 Guía: ${dept.funcionesGuia}
      </div>
      <textarea id="org-funciones-${dept.key}" class="ficha-input ${!datos.funciones?'ficha-input-vacio':''}"
        style="min-height:100px"
        placeholder="Redacta las funciones principales de este puesto adaptadas a vuestra empresa...">${datos.funciones||''}</textarea>
    </div>

    <!-- Subpuestos -->
    <div style="margin-top:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <label style="font-size:0.72rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em">
          Subpuestos dentro de ${dept.nombre}
        </label>
        <button class="btn-secundario" style="padding:4px 10px;font-size:0.72rem"
          onclick="orgAnadirSubpuesto('${dept.key}')">+ Añadir subpuesto</button>
      </div>
      ${datos.subpuestos.length === 0
        ? `<div style="font-size:0.78rem;color:var(--gris-300);font-style:italic;padding:6px 0">
            Sin subpuestos. Añade si el departamento necesita más de un rol diferenciado.
           </div>`
        : datos.subpuestos.map((sp, i) => `
          <div class="subpuesto-row">
            <div class="subpuesto-num">${i+1}</div>
            <input type="text" class="ficha-input" style="flex:1.2"
              placeholder="Nombre del subpuesto (ej: Agente comercial)"
              value="${sp.nombre}"
              oninput="orgActualizarSubpuesto('${dept.key}',${i},'nombre',this.value)">
            <input type="text" class="ficha-input" style="flex:1"
              placeholder="Alumno/a responsable"
              value="${sp.alumno}"
              oninput="orgActualizarSubpuesto('${dept.key}',${i},'alumno',this.value)">
            <button class="btn-eliminar-socio"
              onclick="orgEliminarSubpuesto('${dept.key}',${i})">✕</button>
          </div>
          <textarea class="ficha-input" style="margin:0 0 6px 28px;min-height:60px;font-size:0.8rem"
            placeholder="Funciones de este subpuesto..."
            oninput="orgActualizarSubpuesto('${dept.key}',${i},'funciones',this.value)">${sp.funciones}</textarea>
        `).join('')
      }
    </div>

    <!-- Botones del formulario -->
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--gris-100)">
      <button class="btn-secundario" onclick="orgAbrirDept('${dept.key}')">Cancelar</button>
      <button class="btn-accion" onclick="orgGuardarDept('${dept.key}')">💾 Guardar puesto</button>
    </div>
  </div>`;
}

/* ── Vista de solo lectura del puesto ───────────────────────── */
function orgVistaPuesto(dept, datos) {
  return `
  <div style="padding:14px 16px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div>
      <div style="font-size:0.68rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">
        Funciones principales <span class="ra-chip" style="margin-left:4px">RA3d</span>
      </div>
      <div style="font-size:0.82rem;color:var(--gris-700);line-height:1.6;white-space:pre-line">
        ${datos.funciones || '<span style="color:var(--gris-300);font-style:italic">Sin redactar</span>'}
      </div>
      ${datos.subpuestos && datos.subpuestos.length > 0 ? `
      <div style="margin-top:12px">
        <div style="font-size:0.68rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Subpuestos</div>
        ${datos.subpuestos.map(sp => `
          <div style="padding:6px 8px;background:var(--gris-50);border-radius:var(--radio-sm);margin-bottom:4px">
            <strong style="font-size:0.8rem">${sp.nombre}</strong>
            ${sp.alumno ? `<span style="font-size:0.72rem;color:var(--gris-500);margin-left:6px">→ ${sp.alumno}</span>` : ''}
            ${sp.funciones ? `<div style="font-size:0.75rem;color:var(--gris-500);margin-top:2px">${sp.funciones}</div>` : ''}
          </div>`).join('')}
      </div>` : ''}
    </div>
    <div>
      <div style="font-size:0.68rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Perfil del puesto</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:0.82rem">
        <div style="display:flex;gap:8px">
          <span style="color:var(--gris-400);width:100px;flex-shrink:0">Formación</span>
          <span style="color:var(--gris-700)">${datos.formacion||'<span style="color:var(--gris-300);font-style:italic">Sin definir</span>'}</span>
        </div>
        <div style="display:flex;gap:8px">
          <span style="color:var(--gris-400);width:100px;flex-shrink:0">Contrato</span>
          <span style="color:var(--gris-700)">${datos.tipoContrato||'<span style="color:var(--gris-300);font-style:italic">Sin definir</span>'}</span>
        </div>
        <div style="display:flex;gap:8px">
          <span style="color:var(--gris-400);width:100px;flex-shrink:0">Jornada</span>
          <span style="color:var(--gris-700)">${datos.jornada||'<span style="color:var(--gris-300);font-style:italic">Sin definir</span>'}</span>
        </div>
        <div style="display:flex;gap:8px">
          <span style="color:var(--gris-400);width:100px;flex-shrink:0">Software</span>
          <span class="puesto-soft">${dept.soft}</span>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── SECCIÓN: VIABILIDAD ─────────────────────────────────────── */

/* Helpers de cálculo */
function vCalcUmbral(cf, cvPct) {
  if (cvPct >= 100) return 0;
  return cf / (1 - cvPct / 100);
}
function vCalcPeriodoRecuperacion(inversion, beneficioAnual) {
  if (!beneficioAnual || beneficioAnual <= 0) return '—';
  const meses = Math.round((inversion / beneficioAnual) * 12);
  const a = Math.floor(meses / 12);
  const m = meses % 12;
  return (a > 0 ? a + ' año' + (a > 1 ? 's' : '') + (m > 0 ? ' y ' : '') : '') +
         (m > 0 ? m + ' mes' + (m > 1 ? 'es' : '') : '');
}
function vCalcVAN(inversion, beneficioAnual, tasa, anios) {
  // VAN simplificado a n años con tasa de descuento
  if (!beneficioAnual || tasa >= 100) return 0;
  let van = -inversion;
  const r = tasa / 100;
  for (let i = 1; i <= anios; i++) van += beneficioAnual / Math.pow(1 + r, i);
  return Math.round(van);
}
function vBeneficioAnual(v) {
  const meses = [v.m1,v.m2,v.m3,v.m4,v.m5,v.m6,v.m7,v.m8,v.m9];
  const ingresoTotal = meses.reduce((s,m) => s + (parseFloat(m)||0), 0);
  const costoVar     = ingresoTotal * ((parseFloat(v.gastosVariables)||0) / 100);
  const costoFijo    = (parseFloat(v.gastosFijos)||0) * 9;
  return ingresoTotal - costoVar - costoFijo;
}
function vRecalcular() {
  const v  = EMPRESA_STATE.datos.viabilidad;
  const cf = parseFloat(v.gastosFijos)    || 0;
  const cv = parseFloat(v.gastosVariables)|| 0;
  const inv= parseFloat(v.inversionInicial)||0;
  const fp = capitalTotalSocios();          // toma el capital de los socios
  v.financiacionPropia = fp;
  v.financiacionAjena  = Math.max(0, inv - fp);
  v.umbralRentabilidad = Math.round(vCalcUmbral(cf, cv));
  const ben = vBeneficioAnual(v);
  v.vanAnual           = vCalcVAN(inv, ben, 10, 3);
  v.periodoRecuperacion= vCalcPeriodoRecuperacion(inv, ben);
  v.tirAnual           = ben > 0 && inv > 0 ? ((ben / inv) * 100).toFixed(1) : 0;
}
function vActualizar(campo, valor) {
  EMPRESA_STATE.datos.viabilidad[campo] = parseFloat(valor) || 0;
  vRecalcular();
  // Actualizar solo los KPIs y el gráfico sin recargar toda la vista
  const v = EMPRESA_STATE.datos.viabilidad;
  const kpis = {
    'kpi-inversion':  (v.inversionInicial||0).toLocaleString('es-ES') + ' €',
    'kpi-van':        (v.vanAnual||0).toLocaleString('es-ES') + ' €',
    'kpi-umbral':     (v.umbralRentabilidad||0).toLocaleString('es-ES') + ' €',
    'kpi-recuperacion': v.periodoRecuperacion || '—',
    'kpi-tir':        v.tirAnual + '%',
    'kpi-fa':         (v.financiacionAjena||0).toLocaleString('es-ES') + ' €',
    'kpi-fp':         (v.financiacionPropia||0).toLocaleString('es-ES') + ' €',
    'formula-umbral': `CF ÷ (1 − CV%) = ${v.gastosFijos||0} ÷ (1 − ${(v.gastosVariables||0)/100}) = <strong style="color:var(--verde-700)">${(v.umbralRentabilidad||0).toLocaleString('es-ES')} €</strong>`,
  };
  for (const [id, val] of Object.entries(kpis)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  }
  // Actualizar barras
  vRedibujarGrafico();
}
function vRedibujarGrafico() {
  const v = EMPRESA_STATE.datos.viabilidad;
  const meses = ['m1','m2','m3','m4','m5','m6','m7','m8','m9'];
  const vals  = meses.map(m => parseFloat(v[m])||0);
  const maxI  = Math.max(...vals, 1);
  vals.forEach((ing, i) => {
    const bar = document.getElementById('barra-' + i);
    const lbl = document.getElementById('blbl-' + i);
    if (!bar) return;
    const pct = Math.round((ing / maxI) * 100);
    bar.style.height = pct + '%';
    bar.className    = 'barra-fill ' + (ing >= v.umbralRentabilidad ? 'barra-ok' : 'barra-warn');
    if (lbl) lbl.textContent = ing >= 1000 ? (ing/1000).toFixed(1)+'k' : ing||'0';
  });
  const el = document.getElementById('lbl-umbral-grafico');
  if (el) el.textContent = 'Umbral: ' + (v.umbralRentabilidad||0).toLocaleString('es-ES') + ' €/mes';
}
function vGuardarChecklist(idx, valor) {
  if (!EMPRESA_STATE.datos.viabilidad.checklist)
    EMPRESA_STATE.datos.viabilidad.checklist = [false,false,false,false,false,false,false,false];
  EMPRESA_STATE.datos.viabilidad.checklist[idx] = valor;
}

function seccionViabilidad() {
  vRecalcular();
  const v  = EMPRESA_STATE.datos.viabilidad;
  const inv= parseFloat(v.inversionInicial)||0;
  const fp = parseFloat(v.financiacionPropia)||0;
  const fa = parseFloat(v.financiacionAjena)||0;
  const cl = v.checklist || [false,false,false,false,false,false,false,false];
  const MESES_LABELS = ['Oct','Nov','Dic','Ene','Feb','Mar','Abr','May','Jun'];
  const MESES_KEYS   = ['m1','m2','m3','m4','m5','m6','m7','m8','m9'];
  const vals = MESES_KEYS.map(m => parseFloat(v[m])||0);
  const maxI = Math.max(...vals, 1);
  const ratioEnd = fa > 0 && fp > 0 ? (fa/fp).toFixed(2) : '—';
  const ratioOk  = fa > 0 && fp > 0 && (fa/fp) < 1.5;

  const numInput = (campo, val, placeholder) => `
    <input type="number" min="0" step="100"
      class="ficha-input" style="font-size:0.85rem;padding:7px 10px"
      placeholder="${placeholder||'0'}"
      value="${val||''}"
      oninput="vActualizar('${campo}',this.value)">`;

  const CHECKLIST_ITEMS = [
    { label:'Viabilidad técnica',      ce:'RA4a', desc:'Instalaciones, equipos y tecnología disponibles' },
    { label:'Viabilidad legal',         ce:'RA4b', desc:'Cumplimiento normativo del sector' },
    { label:'Viabilidad económica',     ce:'RA4g', desc:'VAN positivo y TIR superior al coste del capital' },
    { label:'Fuentes de financiación',  ce:'RA4c', desc:'Fondos propios y/o financiación ajena accesible' },
    { label:'Capacitación profesional', ce:'RA4d', desc:'Formación y experiencia del equipo' },
    { label:'Impacto ambiental',        ce:'RA4e', desc:'Análisis de sostenibilidad y huella ambiental' },
    { label:'Plan de PRL',              ce:'RA4f', desc:'Riesgos laborales identificados y medidas preventivas' },
    { label:'Viabilidad a largo plazo', ce:'RA4h', desc:'Plan a 3 años con escenarios pesimista y optimista' },
  ];

  return `
  <!-- Cabecera -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem;gap:16px">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">Plan de viabilidad económico-financiero</h3>
      <p style="font-size:0.8rem;color:var(--gris-500);margin-top:2px">
        Introduce los datos de tu empresa — los indicadores se calculan automáticamente
        <span class="ra-chip" style="margin-left:6px">RA4a-h</span>
      </p>
    </div>
    <button class="btn-secundario" onclick="mostrarToast('Exportando informe de viabilidad...','exito')">
      ⬇️ Exportar informe
    </button>
  </div>

  <!-- KPIs calculados automáticamente -->
  <div class="metricas-grid" style="margin-bottom:1.25rem">
    <div class="metrica-card">
      <div class="metrica-header">
        <div class="metrica-icono verde">💶</div>
        <span class="metrica-tendencia ${inv>0?'positiva':''}">Inversión total</span>
      </div>
      <div class="metrica-valor" id="kpi-inversion">${inv.toLocaleString('es-ES')} €</div>
      <div class="metrica-etiq">Capital necesario para arrancar</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header">
        <div class="metrica-icono azul">📈</div>
        <span class="metrica-tendencia ${v.vanAnual>0?'positiva':'negativa'}" id="kpi-tir">${v.tirAnual}%</span>
      </div>
      <div class="metrica-valor" id="kpi-van">${(v.vanAnual||0).toLocaleString('es-ES')} €</div>
      <div class="metrica-etiq">VAN estimado a 3 años (tasa 10%)</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header">
        <div class="metrica-icono nar">⚖️</div>
      </div>
      <div class="metrica-valor" id="kpi-umbral">${(v.umbralRentabilidad||0).toLocaleString('es-ES')} €</div>
      <div class="metrica-etiq">Umbral de rentabilidad mensual</div>
    </div>
    <div class="metrica-card">
      <div class="metrica-header">
        <div class="metrica-icono verde">🔄</div>
      </div>
      <div class="metrica-valor" id="kpi-recuperacion">${v.periodoRecuperacion||'—'}</div>
      <div class="metrica-etiq">Período de recuperación</div>
    </div>
  </div>

  <!-- Grid principal -->
  <div class="grid-2col" style="margin-bottom:1rem">

    <!-- Columna izquierda: inversión + previsión de ingresos -->
    <div style="display:flex;flex-direction:column;gap:1rem">

      <!-- Inversión y financiación -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>💰</span> Plan de inversión y financiación
          <span class="ra-chip" style="margin-left:auto">RA3g · RA4c</span>
        </div>
        <div style="font-size:0.75rem;color:var(--gris-500);margin-bottom:10px;padding:6px 10px;background:var(--verde-50);border-radius:var(--radio-sm);border-left:3px solid var(--verde-300)">
          💡 La financiación propia se toma automáticamente del capital aportado por los socios en la ficha
          (<strong style="color:var(--verde-700)">${capitalTotalSocios().toLocaleString('es-ES')} €</strong>)
        </div>
        <div class="ficha-grid-2" style="gap:10px">
          <div class="ficha-campo">
            <label>Inversión inicial total (€) <span class="campo-ayuda" title="Todo lo necesario para empezar: local, equipos, stock inicial, gastos de constitución...">ⓘ</span></label>
            ${numInput('inversionInicial', v.inversionInicial, 'Ej: 50000')}
          </div>
          <div class="ficha-campo">
            <label>Financiación propia (€)</label>
            <div class="ficha-input" style="background:var(--gris-100);color:var(--gris-500);cursor:not-allowed" id="kpi-fp">
              ${fp.toLocaleString('es-ES')} €
            </div>
          </div>
          <div class="ficha-campo">
            <label>Financiación ajena (€) <span class="campo-ayuda" title="Préstamo bancario, ICO, crowdfunding... Se calcula automáticamente como Inversión − Capital propio">ⓘ</span></label>
            <div class="ficha-input" style="background:var(--gris-100);color:var(--gris-500);cursor:not-allowed" id="kpi-fa">
              ${fa.toLocaleString('es-ES')} €
            </div>
          </div>
          <div class="ficha-campo">
            <label>Ratio de endeudamiento</label>
            <div style="padding:9px 12px;border-radius:var(--radio-sm);font-weight:700;font-size:0.9rem;
              background:${ratioOk?'var(--verde-50)':'#fef9ec'};
              border:1.5px solid ${ratioOk?'var(--verde-300)':'#fde68a'};
              color:${ratioOk?'var(--verde-800)':'#92400e'}">
              ${ratioEnd} ${ratioOk?'✓ Aceptable':'⚠️ Elevado'}
            </div>
          </div>
        </div>
        <div style="margin-top:10px">
          <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:4px">
            <span style="color:var(--gris-600)">Fondos propios</span>
            <strong style="color:var(--verde-700)">${inv>0?((fp/inv)*100).toFixed(0):0}%</strong>
          </div>
          <div class="progreso-bar" style="height:8px">
            <div class="progreso-fill" style="width:${inv>0?(fp/inv)*100:0}%;height:8px"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-top:6px;margin-bottom:4px">
            <span style="color:var(--gris-600)">Financiación ajena</span>
            <strong style="color:#f59e0b">${inv>0?((fa/inv)*100).toFixed(0):0}%</strong>
          </div>
          <div class="progreso-bar" style="height:8px">
            <div style="width:${inv>0?(fa/inv)*100:0}%;height:8px;background:#f59e0b;border-radius:3px"></div>
          </div>
        </div>
      </div>

      <!-- Costes -->
      <div class="ficha-card">
        <div class="ficha-card-header">
          <span>📉</span> Estructura de costes
          <span class="ra-chip" style="margin-left:auto">RA4g</span>
        </div>
        <div class="ficha-grid-2" style="gap:10px">
          <div class="ficha-campo">
            <label>Costes fijos mensuales (€) <span class="campo-ayuda" title="Alquiler, sueldos fijos, seguros, suministros... No varían con las ventas">ⓘ</span></label>
            ${numInput('gastosFijos', v.gastosFijos, 'Ej: 3200')}
            <div style="font-size:0.7rem;color:var(--gris-400);margin-top:3px">Alquiler · Sueldos fijos · Seguros · Suministros</div>
          </div>
          <div class="ficha-campo">
            <label>Costes variables (% s/ventas) <span class="campo-ayuda" title="Mercancía, comisiones, transporte... Varían proporcionalmente con las ventas">ⓘ</span></label>
            ${numInput('gastosVariables', v.gastosVariables, 'Ej: 45')}
            <div style="font-size:0.7rem;color:var(--gris-400);margin-top:3px">Aprovisionamiento · Transporte · Comisiones</div>
          </div>
        </div>
        <div style="margin-top:10px;padding:10px;background:var(--verde-50);border-radius:var(--radio-sm);border:1px solid var(--verde-200)">
          <div style="font-size:0.7rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Fórmula del umbral de rentabilidad</div>
          <div style="font-size:0.82rem;color:var(--gris-700)" id="formula-umbral">
            CF ÷ (1 − CV%) = ${v.gastosFijos||0} ÷ (1 − ${(v.gastosVariables||0)/100}) = <strong style="color:var(--verde-700)">${(v.umbralRentabilidad||0).toLocaleString('es-ES')} €</strong>
          </div>
        </div>
      </div>

    </div><!-- /col izquierda -->

    <!-- Columna derecha: previsión de ingresos -->
    <div class="ficha-card">
      <div class="ficha-card-header">
        <span>📊</span> Previsión de ingresos mensuales (€)
        <span class="ra-chip" style="margin-left:auto">RA4g · RA4h</span>
      </div>
      <div style="font-size:0.75rem;color:var(--gris-500);margin-bottom:12px">
        Introduce la facturación estimada mes a mes. Las barras se actualizan al instante.
      </div>

      <!-- Inputs de ingresos por mes -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:16px">
        ${MESES_KEYS.map((m, i) => `
        <div>
          <label style="font-size:0.68rem;font-weight:600;color:var(--gris-400);display:block;margin-bottom:3px">${MESES_LABELS[i]}</label>
          <input type="number" min="0" step="500"
            class="ficha-input" style="font-size:0.8rem;padding:6px 8px;text-align:right"
            placeholder="0"
            value="${v[m]||''}"
            oninput="vActualizar('${m}',this.value)">
        </div>`).join('')}
      </div>

      <!-- Gráfico de barras -->
      <div class="grafico-barras" style="height:140px">
        ${vals.map((ing, i) => {
          const pct = Math.round((ing / maxI) * 100);
          return `
          <div class="barra-wrap">
            <div class="barra-valor" id="blbl-${i}">${ing>=1000?(ing/1000).toFixed(1)+'k':ing||'0'}</div>
            <div class="barra-col">
              <div id="barra-${i}" class="barra-fill ${ing>=(v.umbralRentabilidad||0)?'barra-ok':'barra-warn'}"
                style="height:${pct}%"></div>
            </div>
            <div class="barra-mes">${MESES_LABELS[i]}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:12px;margin-top:8px;font-size:0.72rem;align-items:center">
        <div style="display:flex;align-items:center;gap:4px">
          <div style="width:10px;height:10px;border-radius:2px;background:var(--verde-500)"></div> Sobre umbral
        </div>
        <div style="display:flex;align-items:center;gap:4px">
          <div style="width:10px;height:10px;border-radius:2px;background:#f59e0b"></div> Bajo umbral
        </div>
        <div style="margin-left:auto;color:var(--gris-400)" id="lbl-umbral-grafico">
          Umbral: ${(v.umbralRentabilidad||0).toLocaleString('es-ES')} €/mes
        </div>
      </div>
    </div><!-- /col derecha -->

  </div><!-- /grid-2col -->

  <!-- Checklist RA4 completo -->
  <div class="ficha-card">
    <div class="ficha-card-header">
      <span>✅</span> Checklist de viabilidad · Todos los criterios del RA4
      <span class="ra-chip" style="margin-left:auto">RA4a-h</span>
    </div>
    <div style="font-size:0.75rem;color:var(--gris-500);margin-bottom:12px">
      Marca cada criterio cuando lo hayáis analizado y documentado. El profesor puede ver el estado en tiempo real.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${CHECKLIST_ITEMS.map(({label, ce, desc}, idx) => `
      <div style="display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:var(--radio-md);
        background:${cl[idx]?'var(--verde-50)':'var(--gris-50)'};
        border:1.5px solid ${cl[idx]?'var(--verde-300)':'var(--gris-200)'};
        transition:all .2s;cursor:pointer"
        onclick="vGuardarChecklist(${idx},${!cl[idx]});vistaEmpresaRefresh();empTab('viabilidad')">
        <div style="width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;
          background:${cl[idx]?'var(--verde-500)':'var(--blanco)'};
          border:2px solid ${cl[idx]?'var(--verde-500)':'var(--gris-300)'};
          color:white;font-size:0.75rem;font-weight:800;transition:all .2s">
          ${cl[idx]?'✓':''}
        </div>
        <div style="flex:1">
          <div style="font-size:0.82rem;font-weight:600;color:${cl[idx]?'var(--verde-800)':'var(--gris-800)'}">
            ${label} <span class="ra-chip" style="margin-left:4px">${ce}</span>
          </div>
          <div style="font-size:0.72rem;color:var(--gris-500);margin-top:2px">${desc}</div>
        </div>
      </div>`).join('')}
    </div>
    <div style="margin-top:12px;padding:10px 14px;border-radius:var(--radio-md);
      background:${cl.filter(Boolean).length===8?'var(--verde-50)':'var(--gris-50)'};
      border:1px solid ${cl.filter(Boolean).length===8?'var(--verde-300)':'var(--gris-200)'}">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:0.82rem;font-weight:600;color:var(--gris-800)">
          Progreso del análisis de viabilidad
        </span>
        <span style="font-size:0.9rem;font-weight:700;color:${cl.filter(Boolean).length===8?'var(--verde-700)':'var(--gris-600)'}">
          ${cl.filter(Boolean).length}/8 criterios
        </span>
      </div>
      <div class="progreso-bar" style="margin-top:6px;height:8px">
        <div class="progreso-fill" style="width:${(cl.filter(Boolean).length/8)*100}%;height:8px"></div>
      </div>
    </div>
  </div>`;
}


/* ── SECCIÓN: TRÁMITES DE CONSTITUCIÓN ───────────────────────── */
function seccionTramites() {
  const tramites  = EMPRESA_STATE.tramites;
  const completados = tramites.filter(t => t.estado === 'completado').length;
  const enCurso    = tramites.filter(t => t.estado === 'en-curso').length;
  const pendientes = tramites.filter(t => t.estado === 'pendiente').length;

  return `
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem;gap:16px">
    <div>
      <h3 style="font-size:1rem;font-weight:600;color:var(--gris-800)">Trámites de constitución y puesta en marcha</h3>
      <p style="font-size:0.8rem;color:var(--gris-500);margin-top:2px">
        Descarga cada modelo, rellénalo y súbelo para validación docente
        <span class="ra-chip" style="margin-left:6px">RA5a–h</span>
      </p>
    </div>
    <div style="display:flex;gap:8px;flex-shrink:0">
      <div style="text-align:center;padding:8px 14px;background:var(--verde-100);border-radius:var(--radio-md)">
        <div style="font-size:1.3rem;font-weight:700;color:var(--verde-800)">${completados}</div>
        <div style="font-size:0.68rem;color:var(--verde-600)">Completados</div>
      </div>
      <div style="text-align:center;padding:8px 14px;background:#fef3c7;border-radius:var(--radio-md)">
        <div style="font-size:1.3rem;font-weight:700;color:#92400e">${enCurso}</div>
        <div style="font-size:0.68rem;color:#92400e">En curso</div>
      </div>
      <div style="text-align:center;padding:8px 14px;background:var(--gris-100);border-radius:var(--radio-md)">
        <div style="font-size:1.3rem;font-weight:700;color:var(--gris-600)">${pendientes}</div>
        <div style="font-size:0.68rem;color:var(--gris-500)">Pendientes</div>
      </div>
    </div>
  </div>

  <!-- Barra de progreso global -->
  <div style="margin-bottom:1.25rem;padding:12px 16px;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-md)">
    <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:6px">
      <span style="font-weight:600;color:var(--gris-800)">Progreso global de la constitución</span>
      <span style="color:var(--verde-700);font-weight:700">${porcentajeTramites()}%</span>
    </div>
    <div class="progreso-bar" style="height:10px">
      <div class="progreso-fill" style="width:${porcentajeTramites()}%;height:10px"></div>
    </div>
  </div>

  <!-- Lista de trámites -->
  <div style="display:flex;flex-direction:column;gap:10px">
    ${tramites.map((t, idx) => tramiteCard(t, idx)).join('')}
  </div>

  <!-- Modal previsualización -->
  <div id="modal-prevista" class="modal-overlay" style="display:none" onclick="cerrarModalDoc(event)">
    <div class="modal-doc" onclick="event.stopPropagation()">
      <div class="modal-doc-header">
        <div>
          <div id="modal-doc-titulo" style="font-weight:600;font-size:0.9rem;color:var(--gris-800)">Documento</div>
          <div id="modal-doc-tramite" style="font-size:0.75rem;color:var(--gris-500)"></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <div id="modal-anotacion-wrap" style="display:none">
            <textarea id="modal-anotacion-input" class="ficha-input"
              style="width:240px;min-height:36px;resize:none;font-size:0.78rem;padding:6px 8px"
              placeholder="Anotación del profesor..."></textarea>
            <button class="btn-accion" style="font-size:0.75rem;padding:5px 10px;margin-left:6px"
              onclick="guardarAnotacion()">Guardar</button>
          </div>
          <button class="btn-secundario" style="font-size:0.78rem;padding:6px 10px" onclick="cerrarModalDoc()">✕ Cerrar</button>
        </div>
      </div>
      <div id="modal-doc-body" class="modal-doc-body"></div>
    </div>
  </div>
  `;
}

/* ── PDFs de modelos incrustados (base64) ── */
const MODELOS_PDF = {
  "notaria": { nombre: "Estatutos_SL_y_Modelo_036.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOSAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyAxMCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjggMCBvYmoKPDwKL0NvdW50IDIgL0tpZHMgWyA0IDAgUiA1IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOSAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNTE5Cj4+CnN0cmVhbQpHYXUwRGJBUTxBJkRjTSJDLlcmWEY1TiY/TkE2QTxebThzYWJtXnBkI2AzNCxMZS4rOjtnci03ZC5EIXQvcTxxMV07ZVZzO1wuKiZpZmRDMlgmamlLIXEmTWQobC4pZ1FtPDwlJCxqZGxUZ2dMOUtLST5IIy9aVjU+LzkrWUFkPUo0S2cuVVBgWSQxTCMvciJMNk0nV2xAMUNQbDJlWCYjR1ohUldVUCReSy1GUm9IXlUjNzJgPGBTXj1OVXJKZFFtPTBLNSFCKi1SaGxjXkhxQjFNVkk5bjEyJ2AsVUheVkpYPFVWSD44XEJfPTUyaEZcXzhUZigtQD8nXUQoRCZUJTtpLyslcytybDJHRGddTk1XaWdxaXNbcVtzWkxTKksnX0gjRVFWRyQpTDQmIkVPcEd0PFtnMSs3PmZPampfOjZzVW4rSXApNUBSakFjKGMvNS04QkdBLGhJLWNkMVwlX0FCUW1CTlRmYSFmcEtPY189TygzXzxqQFs6cjFfZmM3J25KVVFhIlFpZ08kWEslUFlpSF5MLz1wLmRULG0wUFVJWENwJS02VSInbCFmNTliX282K0VXalwzYnRwWjc+IzRrNE5mXWhxbVlqLUxpKE1qbUhXYmgoRW5HYiw2Tm46UzZCKTpvdVFSKFVWdSkxYSVHRGcmJVspVCkrMEVfZTJRa2ssSFNJbD03MFNUNFsvWVlUJlNVTUVtbmM1W2deP1BTXzM4RT4yITFfRCZ1MjIiQSw7UChoaCdwP3VgQj5SRGVkN1xWbnRLVickcFckW1tLVClxJEhgYDU1JktZTTlIL2RDWyo7T0ZkWUVsSEEuciRxPFdKNnQmVSdacy1IRilJZVZOLkwxdSknbGJPJmE7LDYkQ2U+QDFAb2IxSm9mR2AwVjAkJC4jQlEmKVknK1dDdEhmLj5GcjY0Nm49clxwVG5DYDlkJTtzLF5BPUJvS0RpYTtvREZ0aygjRkRRJW1ZVjc8YyZFOjk4RSlAMjxcPmZbYTNJYS8/PkMlM3FeNlF0NCxYK0NKOnNOW2UlcGhZbGpBIWxaJSdfMTtCVEVyU1hwM0xIXkFpWzUhQ0YuLGlZYWxiLE88SHQodCJzLnVDQk9QXkpHWzFlVlYzWyFCMS4tXi0tJ0tVLjspNDFEP19zNmw4Zm5rJC4zRmQ7Q240PTJLNFJeZkA5JC1PYllUaT1DXG1nZldyIm5yIjtxVkZrR3EkbnIkPEpbW1ttJSYvVk4nMjMpOVk3a1dCaSktciUpL05lTEspLDNSK2xQJ01BPzRpRFVYN1VucTE3akxWcjRkPC1KNmQtKz5HZUhtSCsoZVZCPVY/PUtlY1lVSl9BTUNqQS4lI1QnUD1DTi9VQkNOWkNfU2lFPSxpMDBEbShgQjAvLmhpRS9Nc1klMVRgUFonUEVTaiJKV0N0XiQ/VjUqLmgiOj9tNVEqQ1ZJZTRYXiRCNmNWWz1tQlcnRy1ROXMlM1tzUyZYOkx0Z15oanJvTWVubE9rYXJWajFicmJgPVopNl9AZ0ctX0d1QTsmIVA/IWFXcWIkRjgtZEAjbl8zOFt0JClqbks4Yi9OJG9vZFdWYFZiKm03Z3NpW0NAX0FXMFJENl5GKThjWyhpcjdOZidIV2BnUypIJ0JbWlpPU2pmW1opXTI7UF87KWE/JihgUSZuXm5lW25sbj5GXnMvX2A3Q2MoX1JvVyx0Qm1HKD9ZclE3cGZpY3A5OForNGRsUCpkXmoudD5haTJIIj47VmImIWtjR1dDQ24iUyZhTlo0SCteWHAqWEUvVVpAN1onUW06YHE9TF1YNTNESTpOTmUxVVAyYWIvI1k0KDpSUSx1P2spL1w5P3RuVVJoY2ZnOlAmNEw1XnBrT1tTU3VWOUZBPFJlRmVjK207M0ZfJzIxP0tEalVSQVlUI0klKXF1bHJeXWUpV1MqXVVePkZZKWJqbEladHNccFUxQDA6dVNzQkpnQT9OPTA7J19gbjU8YDVRLGszUDZ0a0c9TE5RKzZPdUY4Y34+ZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxMjI2Cj4+CnN0cmVhbQpHYXRtOjlsbztgJkFAWmNxUWErLSsiJFNCZFNVZGNVRCtPUFg3ZDBIT0pPWmg+PSdNSDhsYms9PXMhcWZFMUdgbFdmMyVBcEttVEBkZ1pEOjBAcDBLW0soTFhyLFUsNkVDYURkOEtvPUc2J1AlSzIsWi5PZ28mQko1YV11aygvU29yLHRMY0ZoWG5XJFQuIlM2LXE0TFpSTk1RLz5CbV1MKz5DUCFUcTZ1YDV1NDg0MnEkVzQyQ19VYGNsVSoiUzhdcWUsWzdkSDA7ZC01IUVBOWRPRjJpRUcncDsnbUl0I1w/YnFdYScuSClKI0ZqR0s4RiYqUkNTPTAnVGUyYkBKMlBwX1E+N1lzYGcldWxdWVAmcWhaRVFsKD0uXWhodWN0biluOilkUTU2bmg9KDchTlsucmZOVWZRK2NsRydNUGZbcXMjLjN1PEpEWUlrKVFnOitgJEJrKTZwWWEpPCxTQGJQbio6aVonOW8ia2ksPjI0OU03YiMyVm42NzZ1XWcuOltBYVg6bzkxNGcxTF1hWnBwQWRxaFBtQCYiTEFLKVRrO1VLcHReVjBKKlEzO3VmdWphPzgkaElXRjJPI14zaFJtO19iJEA5VykpOzVEa0FybmI7Ly1aPW5NVylhaTUjN2Q9b2dLZVpjWSUrNUhvLiU2RVk8MkBrZzg5SldqXXRybl4hIUZiKlZoRDhAbDFtVTViXW82R19lR1kkSGo6Tz1LTWE6JitNYy5LUEFyNGpuIWo0L2QybW03Oy5dcm5EMXRpMjJYQWs2W3RJOF1Wa1dJclcmYG5SKmkjZmlQQ2hnOjVkOygzP2cvMDhQbnNqIWsqNVFcLzFMLkgxYCRgVjUyR1ohUUpfY11yQVRtNz1WYzYwMEJxU1MzTVNQU2ZnXjlvLlImIVJbcVxhOlhNaUFDVV5kXGxnX21iSFs5NkJbNSgsWDFFPCk2PzdxZz0jOWQzcGlcN20zQDQyNUZpVERuT15XIlowSExAbW8iTVsjWDVOYVhLK05ATEJkI0ghMi5iRzBEIWNba3BFXVo5SyJRLENiITdXb0YxUkQwbmRRVG8tKVQ+WUZPYkJVZmcla3QhXktlRExvWltNQ2dzK2k2K0guK3RmXmlbXU1WIUg8LkBUYUpwI0RpcU5rQD8uP2BQMXBMVk81SDpdLW1BPSwiT1NrRCpjWFk7KVRtXkAkVyFJYFRocWJWMnJAMy4qYytYREhAL0d1KVdXNUBaL19UMENmJ1FqYTVJTHEydTc/YmA+cGVhYWJfOGBPNEkwTTVHNHFNWmRNWUFlMChacy9QYWlhYztROVVxLi5qNmEiZ0ckbWU+QkE9JW88VFwraGsvYjBLa3B1ViNKcEc6KmIwTHVaTW05MF5ALysoJkQtIT40W2EmXHA/IlVUOSoyVFFRLl4/Z3FrZFA0P2BZXzQlX1NwI09gSGBGVTo4PFZsWkdaP3E/Xj8tbE0sSixSbGpsaCNPMj42K0xgWmxRPThvWnRxUlQjcmlZdS5mPT1rU0NkQjJXV0tRdEFzJGspZiE/PmpNcWxKXy0hUVZuS3JFKWdBOCJTW2BRZWdGKGhEVSUocHJpYCUrajYvZyxAMnVDTWQ4YyljZFg+LjE5YD4mdUZJKSh+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDExCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTAyIDAwMDAwIG4gCjAwMDAwMDAyMDkgMDAwMDAgbiAKMDAwMDAwMDMyMSAwMDAwMCBuIAowMDAwMDAwNTI0IDAwMDAwIG4gCjAwMDAwMDA3MjggMDAwMDAgbiAKMDAwMDAwMDc5NiAwMDAwMCBuIAowMDAwMDAxMDU3IDAwMDAwIG4gCjAwMDAwMDExMjIgMDAwMDAgbiAKMDAwMDAwMjczMiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzxhOGU4MzJhOTQ3YTQyNzg4MjQwZTQwNWYzMGQ5MjZlYz48YThlODMyYTk0N2E0Mjc4ODI0MGU0MDVmMzBkOTI2ZWM+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDcgMCBSCi9Sb290IDYgMCBSCi9TaXplIDExCj4+CnN0YXJ0eHJlZgo0MDUwCiUlRU9GCg==" },
  "registro-mercantil": { nombre: "Solicitud_Inscripcion_Registro_Mercantil.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA3IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgNyAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA0IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNjAxCj4+CnN0cmVhbQpHYXUwRGdNWiJBJjpNbCtlRG5iZGVgbHNCaGBBYmY0WWVvTkF1KyprKnRVLGc8czBfMWJrSCVgRDZRU1lvNDNLLG5ZUS00V0RjZiZEJENdaFhUJSQ8IW8wJls0KFoyZVBXc1tpLCwlW1Ivb00iUTtEQjxMOzxCXEhWUjRrVDooSzhnT0lSYDNrZUokKidLNnBFVVAnJCJdM0QwUnI6aztiJ0I5bDZlTSVzREMpQlpdJFxSJjZDUVcoWmVvT3M5JCljMzpxJDxVTXBjX2lGNzFRWjZMalc1TWwiO0ZFS0NWWXMzWi4+TjhhMS5AMjpgP2dYZldzVio7QSFcSD9uPmBGcEguSkgjcCFXMlV0RTVFPG9WXWElYHRyWS4oWHBnLURvaVcxST9rOCFyWz1TK1lhOmc9T1s7SVRIQEVxUm5WPFcqa1g0RGk8XC4wTTEoPksoI1YwVDhsLjpfa3BVZU43QEJdNm9aP25xOTt1LVozUSFVRUJOUUgsWVVpdTssMUVfI3QvYjFqNS5qLCxiW21MZV1EUDNbOUI+T05OPk8pbjpBJ2haZDksJmlzIyQpOXBjXUwuazYnIiJEIWZVUlQsP09IaU5gZjMnRSo3JkNvWGlZN0tzXWcrM046SUdHdXJDOElVRllXZzVHNTxiV11jZytNSz40X0IrXT5JLjJldShDPDRzKzM7RDFibkowQGY0O3BXLywwaE0vLDZlS2p1bUhDaVJjVUM6aW40PTdlZChHTFtob3J1TjQsYkZkJis0JnBEZ10yPHVWKkpGJFYkTiowXDA0bTRjSHE9OEo1Z2MwQ2Iia1ZFZk1TWFVdajFlNFZtTmwzTj8nKmszZ0ZHQ19QJSQ+cm0kcCZJP1M3XFRuMFAvXk8wTSI9SFlmZi5gKWdJJFM7LDhsZ1AlWENnUW1NIjk0XU5DdUpdM0dmWCJDYUEqXlonKS5iZlAsIUdLcDozVVUxPVcmLDYqcltQISZAIyEsVDBwUXNaIyNDXW49Zj4lYFYkZSJRRWU5XzJgVWlUbWRPJClUJUAxb3JhZCZBdGpWVGZAJCNYM04tWUJMclchWkFDYCddSTZAOF1UJ0sna1FoU0tELG5XMjhQOlZAREZjWiVPP1QpYzEuKmhnLFRmdSItQVxBRk5ncWtWLClVNidYTjhfTyZoPzRPI1pkUXVTQzVzTjV1WnNgQyc4TjtQV2wtYSxtOzdALDdoYj9tWWBpNktnZFpAaWwuIWYyXllqPTg+Ik5uVEI2OzYyKjsmJF85cy1lOnFyMDFKQWs+bixHSFdJJElKO2UuWyJnVEdfP1UrSy1ZQ0BWJ0tKT0AnUGowanElP1E7Km5XWGhXZlAxLFhsJiU7NFw4W2NlS0Q0S3NCWyRsOzc+UVZLKTZwRGQvTmNAWTUkLC5CKzkvOyY5XWclLy4wMVdPM1QyRz1ASWRkUGdhZz43WjBjayFlaSJEQm4tQTFdInQrYmAnN1tRZmFFKyc1VDQoZDsiREVgVjBIXlpaTVkrRjRqP25KOnRWZ1YlRl1OYWQmOy1jKCxmX2JFXHNMTC1WcTlrJmpRLEM7bW00RWUmWXQ/ZyhUZllfXCYjYSMxTkMoWmo8b3JgWUEva0Y9aU9fOyJXdGVGXGwkVFsubUpIYlAtKWEhakpdXXFcMCZTVC1fWk0pXjpiTCNTSVtlN1ViX1AxcU4qVSd1LnVBciREKmQpXExHSGdDIS5nITwuQ1BQTzRQJUYtNWdgKUJXTmlnXU5wVCQ/ak5adGdYUUg1c2luYExkN2EkX10vZ1NVSWhfYmpXOWNBX3FRZFwzR0lrZ2A2VDUnS1xdK2N1OyRkViVDLVA7cShHPVBCcjRZVERgKjdNcmNNIjM9J1RDSCJjQT0+SiRrOyFnYFNwcF1IdF1xYEBJYmgiTTlCPTFqNi46bFgzOm9HVWVZJ1llXC9KdS5hWTw/JVsnO01ydS1RN2I7MFVyNWhibHBmdWRkY1hKQ2RjXiwpVHRkO1FkdDUtYWpQRlpRTCI0VHBCVixCUmEkR0lrOkInRE5MJyk8LktZVV5OKipZYlBTKydVMFJUPz8sMi9JSmBHXSlCKFhxKjBJMyRNZ1ZkQykrbmtQTylRSEBNNC1FOlo7SWd1Tyh+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDkKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMDIgMDAwMDAgbiAKMDAwMDAwMDIwOSAwMDAwMCBuIAowMDAwMDAwMzIxIDAwMDAwIG4gCjAwMDAwMDA1MjQgMDAwMDAgbiAKMDAwMDAwMDU5MiAwMDAwMCBuIAowMDAwMDAwODUzIDAwMDAwIG4gCjAwMDAwMDA5MTIgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8Y2E2ODU5M2M2MmQ5NWZmMjgwZGZiZjJiYTE5YzVkMDM+PGNhNjg1OTNjNjJkOTVmZjI4MGRmYmYyYmExOWM1ZDAzPl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA2IDAgUgovUm9vdCA1IDAgUgovU2l6ZSA5Cj4+CnN0YXJ0eHJlZgoyNjA0CiUlRU9GCg==" },
  "hacienda-nif": { nombre: "Modelo_036_Declaracion_Censal_Alta.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOSAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyAxMCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjggMCBvYmoKPDwKL0NvdW50IDIgL0tpZHMgWyA0IDAgUiA1IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOSAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNTE5Cj4+CnN0cmVhbQpHYXUwRGJBUTxBJkRjTSJDLlcmWEY1TiY/TkE2QTxebThzYWJtXnBkI2AzNCxMZS4rOjtnci03ZC5EIXQvcTxxMV07ZVZzO1wuKiZpZmRDMlgmamlLIXEmTWQobC4pZ1FtPDwlJCxqZGxUZ2dMOUtLST5IIy9aVjU+LzkrWUFkPUo0S2cuVVBgWSQxTCMvciJMNk0nV2xAMUNQbDJlWCYjR1ohUldVUCReSy1GUm9IXlUjNzJgPGBTXj1OVXJKZFFtPTBLNSFCKi1SaGxjXkhxQjFNVkk5bjEyJ2AsVUheVkpYPFVWSD44XEJfPTUyaEZcXzhUZigtQD8nXUQoRCZUJTtpLyslcytybDJHRGddTk1XaWdxaXNbcVtzWkxTKksnX0gjRVFWRyQpTDQmIkVPcEd0PFtnMSs3PmZPampfOjZzVW4rSXApNUBSakFjKGMvNS04QkdBLGhJLWNkMVwlX0FCUW1CTlRmYSFmcEtPY189TygzXzxqQFs6cjFfZmM3J25KVVFhIlFpZ08kWEslUFlpSF5MLz1wLmRULG0wUFVJWENwJS02VSInbCFmNTliX282K0VXalwzYnRwWjc+IzRrNE5mXWhxbVlqLUxpKE1qbUhXYmgoRW5HYiw2Tm46UzZCKTpvdVFSKFVWdSkxYSVHRGcmJVspVCkrMEVfZTJRa2ssSFNJbD03MFNUNFsvWVlUJlNVTUVtbmM1W2deP1BTXzM4RT4yITFfRCZ1MjIiQSw7UChoaCdwP3VgQj5SRGVkN1xWbnRLVickcFckW1tLVClxJEhgYDU1JktZTTlIL2RDWyo7T0ZkWUVsSEEuciRxPFdKNnQmVSdacy1IRilJZVZOLkwxdSknbGJPJmE7LDYkQ2U+QDFAb2IxSm9mR2AwVjAkJC4jQlEmKVknK1dDdEhmLj5GcjY0Nm49clxwVG5DYDlkJTtzLF5BPUJvS0RpYTtvREZ0aygjRkRRJW1ZVjc8YyZFOjk4RSlAMjxcPmZbYTNJYS8/PkMlM3FeNlF0NCxYK0NKOnNOW2UlcGhZbGpBIWxaJSdfMTtCVEVyU1hwM0xIXkFpWzUhQ0YuLGlZYWxiLE88SHQodCJzLnVDQk9QXkpHWzFlVlYzWyFCMS4tXi0tJ0tVLjspNDFEP19zNmw4Zm5rJC4zRmQ7Q240PTJLNFJeZkA5JC1PYllUaT1DXG1nZldyIm5yIjtxVkZrR3EkbnIkPEpbW1ttJSYvVk4nMjMpOVk3a1dCaSktciUpL05lTEspLDNSK2xQJ01BPzRpRFVYN1VucTE3akxWcjRkPC1KNmQtKz5HZUhtSCsoZVZCPVY/PUtlY1lVSl9BTUNqQS4lI1QnUD1DTi9VQkNOWkNfU2lFPSxpMDBEbShgQjAvLmhpRS9Nc1klMVRgUFonUEVTaiJKV0N0XiQ/VjUqLmgiOj9tNVEqQ1ZJZTRYXiRCNmNWWz1tQlcnRy1ROXMlM1tzUyZYOkx0Z15oanJvTWVubE9rYXJWajFicmJgPVopNl9AZ0ctX0d1QTsmIVA/IWFXcWIkRjgtZEAjbl8zOFt0JClqbks4Yi9OJG9vZFdWYFZiKm03Z3NpW0NAX0FXMFJENl5GKThjWyhpcjdOZidIV2BnUypIJ0JbWlpPU2pmW1opXTI7UF87KWE/JihgUSZuXm5lW25sbj5GXnMvX2A3Q2MoX1JvVyx0Qm1HKD9ZclE3cGZpY3A5OForNGRsUCpkXmoudD5haTJIIj47VmImIWtjR1dDQ24iUyZhTlo0SCteWHAqWEUvVVpAN1onUW06YHE9TF1YNTNESTpOTmUxVVAyYWIvI1k0KDpSUSx1P2spL1w5P3RuVVJoY2ZnOlAmNEw1XnBrT1tTU3VWOUZBPFJlRmVjK207M0ZfJzIxP0tEalVSQVlUI0klKXF1bHJeXWUpV1MqXVVePkZZKWJqbEladHNccFUxQDA6dVNzQkpnQT9OPTA7J19gbjU8YDVRLGszUDZ0a0c9TE5RKzZPdUY4Y34+ZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxMjI2Cj4+CnN0cmVhbQpHYXRtOjlsbztgJkFAWmNxUWErLSsiJFNCZFNVZGNVRCtPUFg3ZDBIT0pPWmg+PSdNSDhsYms9PXMhcWZFMUdgbFdmMyVBcEttVEBkZ1pEOjBAcDBLW0soTFhyLFUsNkVDYURkOEtvPUc2J1AlSzIsWi5PZ28mQko1YV11aygvU29yLHRMY0ZoWG5XJFQuIlM2LXE0TFpSTk1RLz5CbV1MKz5DUCFUcTZ1YDV1NDg0MnEkVzQyQ19VYGNsVSoiUzhdcWUsWzdkSDA7ZC01IUVBOWRPRjJpRUcncDsnbUl0I1w/YnFdYScuSClKI0ZqR0s4RiYqUkNTPTAnVGUyYkBKMlBwX1E+N1lzYGcldWxdWVAmcWhaRVFsKD0uXWhodWN0biluOilkUTU2bmg9KDchTlsucmZOVWZRK2NsRydNUGZbcXMjLjN1PEpEWUlrKVFnOitgJEJrKTZwWWEpPCxTQGJQbio6aVonOW8ia2ksPjI0OU03YiMyVm42NzZ1XWcuOltBYVg6bzkxNGcxTF1hWnBwQWRxaFBtQCYiTEFLKVRrO1VLcHReVjBKKlEzO3VmdWphPzgkaElXRjJPI14zaFJtO19iJEA5VykpOzVEa0FybmI7Ly1aPW5NVylhaTUjN2Q9b2dLZVpjWSUrNUhvLiU2RVk8MkBrZzg5SldqXXRybl4hIUZiKlZoRDhAbDFtVTViXW82R19lR1kkSGo6Tz1LTWE6JitNYy5LUEFyNGpuIWo0L2QybW03Oy5dcm5EMXRpMjJYQWs2W3RJOF1Wa1dJclcmYG5SKmkjZmlQQ2hnOjVkOygzP2cvMDhQbnNqIWsqNVFcLzFMLkgxYCRgVjUyR1ohUUpfY11yQVRtNz1WYzYwMEJxU1MzTVNQU2ZnXjlvLlImIVJbcVxhOlhNaUFDVV5kXGxnX21iSFs5NkJbNSgsWDFFPCk2PzdxZz0jOWQzcGlcN20zQDQyNUZpVERuT15XIlowSExAbW8iTVsjWDVOYVhLK05ATEJkI0ghMi5iRzBEIWNba3BFXVo5SyJRLENiITdXb0YxUkQwbmRRVG8tKVQ+WUZPYkJVZmcla3QhXktlRExvWltNQ2dzK2k2K0guK3RmXmlbXU1WIUg8LkBUYUpwI0RpcU5rQD8uP2BQMXBMVk81SDpdLW1BPSwiT1NrRCpjWFk7KVRtXkAkVyFJYFRocWJWMnJAMy4qYytYREhAL0d1KVdXNUBaL19UMENmJ1FqYTVJTHEydTc/YmA+cGVhYWJfOGBPNEkwTTVHNHFNWmRNWUFlMChacy9QYWlhYztROVVxLi5qNmEiZ0ckbWU+QkE9JW88VFwraGsvYjBLa3B1ViNKcEc6KmIwTHVaTW05MF5ALysoJkQtIT40W2EmXHA/IlVUOSoyVFFRLl4/Z3FrZFA0P2BZXzQlX1NwI09gSGBGVTo4PFZsWkdaP3E/Xj8tbE0sSixSbGpsaCNPMj42K0xgWmxRPThvWnRxUlQjcmlZdS5mPT1rU0NkQjJXV0tRdEFzJGspZiE/PmpNcWxKXy0hUVZuS3JFKWdBOCJTW2BRZWdGKGhEVSUocHJpYCUrajYvZyxAMnVDTWQ4YyljZFg+LjE5YD4mdUZJKSh+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDExCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTAyIDAwMDAwIG4gCjAwMDAwMDAyMDkgMDAwMDAgbiAKMDAwMDAwMDMyMSAwMDAwMCBuIAowMDAwMDAwNTI0IDAwMDAwIG4gCjAwMDAwMDA3MjggMDAwMDAgbiAKMDAwMDAwMDc5NiAwMDAwMCBuIAowMDAwMDAxMDU3IDAwMDAwIG4gCjAwMDAwMDExMjIgMDAwMDAgbiAKMDAwMDAwMjczMiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzxhOGU4MzJhOTQ3YTQyNzg4MjQwZTQwNWYzMGQ5MjZlYz48YThlODMyYTk0N2E0Mjc4ODI0MGU0MDVmMzBkOTI2ZWM+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDcgMCBSCi9Sb290IDYgMCBSCi9TaXplIDExCj4+CnN0YXJ0eHJlZgo0MDUwCiUlRU9GCg==" },
  "hacienda-iva": { nombre: "Modelo_036_Declaracion_Censal_IVA.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOSAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyAxMCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjggMCBvYmoKPDwKL0NvdW50IDIgL0tpZHMgWyA0IDAgUiA1IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOSAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNTE5Cj4+CnN0cmVhbQpHYXUwRGJBUTxBJkRjTSJDLlcmWEY1TiY/TkE2QTxebThzYWJtXnBkI2AzNCxMZS4rOjtnci03ZC5EIXQvcTxxMV07ZVZzO1wuKiZpZmRDMlgmamlLIXEmTWQobC4pZ1FtPDwlJCxqZGxUZ2dMOUtLST5IIy9aVjU+LzkrWUFkPUo0S2cuVVBgWSQxTCMvciJMNk0nV2xAMUNQbDJlWCYjR1ohUldVUCReSy1GUm9IXlUjNzJgPGBTXj1OVXJKZFFtPTBLNSFCKi1SaGxjXkhxQjFNVkk5bjEyJ2AsVUheVkpYPFVWSD44XEJfPTUyaEZcXzhUZigtQD8nXUQoRCZUJTtpLyslcytybDJHRGddTk1XaWdxaXNbcVtzWkxTKksnX0gjRVFWRyQpTDQmIkVPcEd0PFtnMSs3PmZPampfOjZzVW4rSXApNUBSakFjKGMvNS04QkdBLGhJLWNkMVwlX0FCUW1CTlRmYSFmcEtPY189TygzXzxqQFs6cjFfZmM3J25KVVFhIlFpZ08kWEslUFlpSF5MLz1wLmRULG0wUFVJWENwJS02VSInbCFmNTliX282K0VXalwzYnRwWjc+IzRrNE5mXWhxbVlqLUxpKE1qbUhXYmgoRW5HYiw2Tm46UzZCKTpvdVFSKFVWdSkxYSVHRGcmJVspVCkrMEVfZTJRa2ssSFNJbD03MFNUNFsvWVlUJlNVTUVtbmM1W2deP1BTXzM4RT4yITFfRCZ1MjIiQSw7UChoaCdwP3VgQj5SRGVkN1xWbnRLVickcFckW1tLVClxJEhgYDU1JktZTTlIL2RDWyo7T0ZkWUVsSEEuciRxPFdKNnQmVSdacy1IRilJZVZOLkwxdSknbGJPJmE7LDYkQ2U+QDFAb2IxSm9mR2AwVjAkJC4jQlEmKVknK1dDdEhmLj5GcjY0Nm49clxwVG5DYDlkJTtzLF5BPUJvS0RpYTtvREZ0aygjRkRRJW1ZVjc8YyZFOjk4RSlAMjxcPmZbYTNJYS8/PkMlM3FeNlF0NCxYK0NKOnNOW2UlcGhZbGpBIWxaJSdfMTtCVEVyU1hwM0xIXkFpWzUhQ0YuLGlZYWxiLE88SHQodCJzLnVDQk9QXkpHWzFlVlYzWyFCMS4tXi0tJ0tVLjspNDFEP19zNmw4Zm5rJC4zRmQ7Q240PTJLNFJeZkA5JC1PYllUaT1DXG1nZldyIm5yIjtxVkZrR3EkbnIkPEpbW1ttJSYvVk4nMjMpOVk3a1dCaSktciUpL05lTEspLDNSK2xQJ01BPzRpRFVYN1VucTE3akxWcjRkPC1KNmQtKz5HZUhtSCsoZVZCPVY/PUtlY1lVSl9BTUNqQS4lI1QnUD1DTi9VQkNOWkNfU2lFPSxpMDBEbShgQjAvLmhpRS9Nc1klMVRgUFonUEVTaiJKV0N0XiQ/VjUqLmgiOj9tNVEqQ1ZJZTRYXiRCNmNWWz1tQlcnRy1ROXMlM1tzUyZYOkx0Z15oanJvTWVubE9rYXJWajFicmJgPVopNl9AZ0ctX0d1QTsmIVA/IWFXcWIkRjgtZEAjbl8zOFt0JClqbks4Yi9OJG9vZFdWYFZiKm03Z3NpW0NAX0FXMFJENl5GKThjWyhpcjdOZidIV2BnUypIJ0JbWlpPU2pmW1opXTI7UF87KWE/JihgUSZuXm5lW25sbj5GXnMvX2A3Q2MoX1JvVyx0Qm1HKD9ZclE3cGZpY3A5OForNGRsUCpkXmoudD5haTJIIj47VmImIWtjR1dDQ24iUyZhTlo0SCteWHAqWEUvVVpAN1onUW06YHE9TF1YNTNESTpOTmUxVVAyYWIvI1k0KDpSUSx1P2spL1w5P3RuVVJoY2ZnOlAmNEw1XnBrT1tTU3VWOUZBPFJlRmVjK207M0ZfJzIxP0tEalVSQVlUI0klKXF1bHJeXWUpV1MqXVVePkZZKWJqbEladHNccFUxQDA6dVNzQkpnQT9OPTA7J19gbjU8YDVRLGszUDZ0a0c9TE5RKzZPdUY4Y34+ZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxMjI2Cj4+CnN0cmVhbQpHYXRtOjlsbztgJkFAWmNxUWErLSsiJFNCZFNVZGNVRCtPUFg3ZDBIT0pPWmg+PSdNSDhsYms9PXMhcWZFMUdgbFdmMyVBcEttVEBkZ1pEOjBAcDBLW0soTFhyLFUsNkVDYURkOEtvPUc2J1AlSzIsWi5PZ28mQko1YV11aygvU29yLHRMY0ZoWG5XJFQuIlM2LXE0TFpSTk1RLz5CbV1MKz5DUCFUcTZ1YDV1NDg0MnEkVzQyQ19VYGNsVSoiUzhdcWUsWzdkSDA7ZC01IUVBOWRPRjJpRUcncDsnbUl0I1w/YnFdYScuSClKI0ZqR0s4RiYqUkNTPTAnVGUyYkBKMlBwX1E+N1lzYGcldWxdWVAmcWhaRVFsKD0uXWhodWN0biluOilkUTU2bmg9KDchTlsucmZOVWZRK2NsRydNUGZbcXMjLjN1PEpEWUlrKVFnOitgJEJrKTZwWWEpPCxTQGJQbio6aVonOW8ia2ksPjI0OU03YiMyVm42NzZ1XWcuOltBYVg6bzkxNGcxTF1hWnBwQWRxaFBtQCYiTEFLKVRrO1VLcHReVjBKKlEzO3VmdWphPzgkaElXRjJPI14zaFJtO19iJEA5VykpOzVEa0FybmI7Ly1aPW5NVylhaTUjN2Q9b2dLZVpjWSUrNUhvLiU2RVk8MkBrZzg5SldqXXRybl4hIUZiKlZoRDhAbDFtVTViXW82R19lR1kkSGo6Tz1LTWE6JitNYy5LUEFyNGpuIWo0L2QybW03Oy5dcm5EMXRpMjJYQWs2W3RJOF1Wa1dJclcmYG5SKmkjZmlQQ2hnOjVkOygzP2cvMDhQbnNqIWsqNVFcLzFMLkgxYCRgVjUyR1ohUUpfY11yQVRtNz1WYzYwMEJxU1MzTVNQU2ZnXjlvLlImIVJbcVxhOlhNaUFDVV5kXGxnX21iSFs5NkJbNSgsWDFFPCk2PzdxZz0jOWQzcGlcN20zQDQyNUZpVERuT15XIlowSExAbW8iTVsjWDVOYVhLK05ATEJkI0ghMi5iRzBEIWNba3BFXVo5SyJRLENiITdXb0YxUkQwbmRRVG8tKVQ+WUZPYkJVZmcla3QhXktlRExvWltNQ2dzK2k2K0guK3RmXmlbXU1WIUg8LkBUYUpwI0RpcU5rQD8uP2BQMXBMVk81SDpdLW1BPSwiT1NrRCpjWFk7KVRtXkAkVyFJYFRocWJWMnJAMy4qYytYREhAL0d1KVdXNUBaL19UMENmJ1FqYTVJTHEydTc/YmA+cGVhYWJfOGBPNEkwTTVHNHFNWmRNWUFlMChacy9QYWlhYztROVVxLi5qNmEiZ0ckbWU+QkE9JW88VFwraGsvYjBLa3B1ViNKcEc6KmIwTHVaTW05MF5ALysoJkQtIT40W2EmXHA/IlVUOSoyVFFRLl4/Z3FrZFA0P2BZXzQlX1NwI09gSGBGVTo4PFZsWkdaP3E/Xj8tbE0sSixSbGpsaCNPMj42K0xgWmxRPThvWnRxUlQjcmlZdS5mPT1rU0NkQjJXV0tRdEFzJGspZiE/PmpNcWxKXy0hUVZuS3JFKWdBOCJTW2BRZWdGKGhEVSUocHJpYCUrajYvZyxAMnVDTWQ4YyljZFg+LjE5YD4mdUZJKSh+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDExCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTAyIDAwMDAwIG4gCjAwMDAwMDAyMDkgMDAwMDAgbiAKMDAwMDAwMDMyMSAwMDAwMCBuIAowMDAwMDAwNTI0IDAwMDAwIG4gCjAwMDAwMDA3MjggMDAwMDAgbiAKMDAwMDAwMDc5NiAwMDAwMCBuIAowMDAwMDAxMDU3IDAwMDAwIG4gCjAwMDAwMDExMjIgMDAwMDAgbiAKMDAwMDAwMjczMiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzxhOGU4MzJhOTQ3YTQyNzg4MjQwZTQwNWYzMGQ5MjZlYz48YThlODMyYTk0N2E0Mjc4ODI0MGU0MDVmMzBkOTI2ZWM+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDcgMCBSCi9Sb290IDYgMCBSCi9TaXplIDExCj4+CnN0YXJ0eHJlZgo0MDUwCiUlRU9GCg==" },
  "ss-cuenta": { nombre: "Modelo_TA6_Inscripcion_Empresa_SS.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA3IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgNyAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA0IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNjYwCj4+CnN0cmVhbQpHYXUxLzlsSGR0JjtLWkwnbTdhXWQlUzU9LEpiWGBLWVteJkJtNzVxQTJCP0xOYnBmTUBKQUFsMi4tTy45RmVDZy9dQTNTWSdUckhXaWc0SCprbEBbR1ApMTA6cjwvVSJqM005JVRFdT9BSEdfUzZUY3FHImk/M2dOPDJHQ25lSHI/bGNmbkIsOClYSmQrVCZRWmlXZl5fUk8oUjpXRkJmaHFkNStwcjgoLTFDT15MQWVhYnMxTyxJNipfQXU6QWRtUixLUiNtT3EkKz4iQ19lPDdQUT1ZPVRfb2JPXUMlRT5bOnIsJV4pVGxFTCdaYzhjIlFZOEk8RjxiPGd0QzpIakFzVVU6OCVGSV1xWk8jUy1PdEY/V2IhQzNabipWdFNtRVsvJTJyKnIsKVEtSVZgdTUhJ21TK2tnbGlgW1U2SnJOU089XFdkZ2tlW3RaW0Q2OTRDIlUtPVwvOHJfMFUwKWpgPk8lbWJpSEVFV2U3LU4nSTNuWU0lUl5PdCZ1cFdZOmQhOiwjRD1vMkBRb1VoIm5BUEBaNTZAT2NXOkldQy4wRDJnRD44OF1aPF0yW0JsTlUsUXEsOzBeM1JiJmUuYTIyRWhxSFwrO0w7Kis2bVFMLF5ZKlhFTE1kRyRGQDZwPWU8SXEiaFlaSztZTXNrKC9GIyhZK05iU0EiWGFyT1UhUSVpK0FSSWMmJWhaYVIzRzNjLnBwaUpkW2tXay85KClgPEtLT2UubzRhM1svM1E9Q1xwPVRQaTdPb1Y2UCwqLlVoQls1USo5RVIhZlBzRHQkKFltPSVsT0VCcEAyKiJPMltHODRYXDhLPS4pRGlPJloqOl1UZ1d0QUpgODQhOkouXDRfcWk6S0Q7RnBfakNOIlpVS3VGW2NFJWM2RUlLN08mPjIiLzZQUlAkYz9VNnE7Zzw2LF9pLHEiQ1lwRjZEZTciUiNDZTpFaV9oMjEwRmVgKjglTE9IYShaKylibXVIIjtMVHUsUEVJYz01KSE9Y3BkPkxuamRSRGQoYWo8SCFGLkIqLi0hYCNeQjknT2pIOCFhQV1eb25UZD9WJGZdXilFOGsidFFgW1UzJ2FILzVhRW1FZkVUIjFOYCksWFNETSh1LzZMKWMsXUUuSyxXLVc0PW1eKjZlYWArQDskWFVHZS5aNjJwNjdPWUBbInJkXVAsKylvaWo6Kl8xZ3NeLSVTajAtPzJpSD1CJ01LQmRUQ04kJyJTS0A4MT87UXVmaDdpRWsuQXVtKW9CIVFIXUJQXFU6Mm89LiYtbzwnUmUzUmJqZzplZlVyNlFfRDZSc0I+RyJOME1DZDdKRT44RVJPcnEwcVpHPGoyK10zQ1xBJFRLYm46UiZAMy4pNW9hSC9iNzthPlsmTDh0WVZYUi4yLT9hYlRxc0w9U0ZCTDpON1JoYzYpRlI9N2xHZj9XaStjZGomPD9pMyJMVjRdW01zPWBsI0BwJVdDOk09VWE8SGVkOFNOVyI+ZkNiaWhGWUw9ZEQuL0U6K20kWUNUU0Y/c2J0XmlkKixMaDFyP1xUI1VNPWxsbGU4MDhObkFIQU0hQDZcX1kkK1tXRGhPc0hXMUtvOUl1XDpwNj9rVT9vVSlwNERvQUByZnVAXklfYGJBXChgJjEmU09UZURSJiZQZ3RWLmBwRnUkJXIuKUsuKGxUYywmW1ZLR1k9cmQwPGpXTi8uXF1WZXUwSkQoQlRIRTcvQ0lwKmNjOG5nM2g5aUdOZUw9O2F0KW8scGRKPSYrPEQtNypMSj1mZSU5OSkwLzlBWDNTMkFYWWlNY04yPHUmajBdIWpVPT5GcVk5SCdMSFI8ZFs5c10zJlkjb1JLZzROTExzcilLal9fWTc8SlA9cz1dXUF1ZVNnNVY0V09tUHFlLSM2cCVySTBoYzh0TG4xcjU2VmZPXlYtTW1hVjhAdWRQOGJdQj4udFsmRDVxVj5dKW5xajs/UzdTUSo4PVxFXGdgNj9ba2FcaWxyUGNINmckRmxcV0kkKEFvN1NHKGtvYFhwakorbVxeUSJuLm5UcnBJK2w3T2ZBNUFOLS09IkhaJEdTU0RxOHUnXE1rSUkxbiJnaklkWkQ5R1FUUGUuRDQlSSo0UkxnbjpNL15rVS1MRT9UQGI3Y09VOXVdLEZtYGk4LmpHW18uJUQqOGcqW3BfTi88V1R0VyFCW0hgZ08zKVVESDtvYVprIS0xdDZHIX4+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgOQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNjEgMDAwMDAgbiAKMDAwMDAwMDEwMiAwMDAwMCBuIAowMDAwMDAwMjA5IDAwMDAwIG4gCjAwMDAwMDAzMjEgMDAwMDAgbiAKMDAwMDAwMDUyNCAwMDAwMCBuIAowMDAwMDAwNTkyIDAwMDAwIG4gCjAwMDAwMDA4NTMgMDAwMDAgbiAKMDAwMDAwMDkxMiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzwzZTczOTllZDU5M2JkZDAwNWU2ZGQxYmEwODBiMmViMT48M2U3Mzk5ZWQ1OTNiZGQwMDVlNmRkMWJhMDgwYjJlYjE+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDYgMCBSCi9Sb290IDUgMCBSCi9TaXplIDkKPj4Kc3RhcnR4cmVmCjI2NjMKJSVFT0YK" },
  "ss-alta-autonomos": { nombre: "Modelo_TA0521_Alta_RETA.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA3IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgNyAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA0IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxODAyCj4+CnN0cmVhbQpHYXUxMDk1aVFTJkJGOD0nUVleYiJNb2lpazJvUmdlQ25LTUxIczlSKzZuRUInTFJGXikzUEZDNG5RKClRQlhxXzonKSw4OHE4P2BYLkI0VklxRWtZVShIN0hbWFhXKkpFbis7Z2VhWFBsSF9eISZRI0I1bFJOVF0rWG10NyFickRcLlRORSwqOkMhTzVWT0RQOWBuUTwsKzJJU0JnPE06RCMhNHVMPG89a0UrNDRTUVdjMFIlQ0JeXSN1PjEmSTxvKFpVYTBYOiNRbU91Kz5oUzBHYHJqdVJoZWdqLGBtdSFMJikyLG1uVmJeJFRJSStfMDc5VlRjbGFVQDY3bylJOzMwZyE6KTUkJFNMXUJBciRFPmo1WUhyQnN0Nkw2W2BZSUNxX2EsckYoLC1ra1NyLyduPW0pcC4mNXQuO14oV2hTKjxOLUlPS2FdTyQ7IkwxbktELSElXUNpcSpJXEo4Ri5lck5KSi1bXlFdRlVgc0tPXjkrRSVRM0sqMVw9PClBQ3FlaFpoQG9mLC1RNm48VGg9TUs3OSRDSDVXSFh0ayhUMS1PRlRxVCM7SihCNkRbTWI6LnVrQkhiZGhqPV5ESDhnQklPNTI1b01mYWFhSldCVFJ0VT8kIUYsNGBAKzk3cCVJQStnRGQjYyw4IkJdNThVWG1fLWhdczY9bUFMSG5FN20yKTVRVkEwOiRtTF9tJiVTalFQb1I9M2ZUb1tIbEpgbCY3PGgjQi9RMCRKLFxLQzpdMm5mK0xXKnVfUjsuJWZEbS82J1NMc140ZFU6UjoyRFRmJyRVRCxIMENFXjlpKFMoJC5hR1I2Pks9Ny1PQFBsNVpNX0xqX0ROak9tOEI7NzhcL21SbzhBJy0zLnJSKThOYlZObSQ4QDJnYXFSXC07JWxMYkZMbHBGN2FNVmcqITJTJidvbG5aQmw8J2xhOm4vXDNja1YsM1U+byJqP29NQCVoTVxGXEcpWzwrSzFxOW07U1szSzlcLnAtKzhKP0RVVUcxcSUvNDtKQCM+NVlWPTknZFNRUGVLOVwvISw3Q0I6OlJZVTgncVBPP09xVDpTPShNUmQtNnVhdCo9WUtaRl9OIU9aP14yI15HSjhjUFQpTjtUKytnVFxhX3EvXF90S0k1PUxxPitIUE0tOTVPJE0jVTpBQSpLIlFmInRPMS0jTkc7WDE1ZmEuIVtoTUhCbHI1NUtxYnRPTDBhdFtba15GUGxuOE9YbipnU1tlNk9pVWErQGNxQHQlSGg4WHVUNT0tbzRdTF4wIS8zJ0lGOWcodT4xO1ZGKipnO0U3c1YzLmZVUCdJKSMoN2BQMjRgaXVLZioxPWdaWHJZSmsiL1FYZTFnb3A+ciYtL2A9PT5HJEAiK15MZlYvPVgwVD5XMjRUJEBPQzluJzZCIWw4VVQ6WUkjJyJRbWJScCUhblRqQy87RmpDNVB0dURiPnAuQTdpX3UjXDhgVm1ELG4hOXA2SkVYJEZuM1hjM2o8VWQ0LmpQMU5kTm1tMFMxXHIyKSdcbkwvJkR1PUNgJ2tcYTFObTxjT1BPY1M6QjY7XTdxdGxJLj4yXDEnT2VFL1FHVVM0PmJYO28pM1hEYzI4RmFvdCtQOGA3Rl9aL2BgKlBdZDVdRl07S2tIPGV0QURwY1o3Pz9gWS1WWXVQYy1TUV5SRywuIkoqN3FFOW1IcWYnZilRMkdyITVqaipxUkAmImk1czdwPT0qJCgtaDhtK1dsRnNPLCpbQGo8T1NUVVxeWmpVUTp0TyxAY1VFWFBHN1w1L0IqMlFyaCM4ckVyUU5NcFs9Q0JUJjszYjAqcjBOJGFHSkR1Y186Q1NUVz1ZQGdPSUFJS0w3J2opO2AyUXVObVM/L2BTL0YhTnBrcmNJODJpPDhEJj5LYEo5NUhNVVFhVXBYTnVNM2hUL00wWEdoTUtDXDZqLkltZTAxPztXPi9AaUpRU1pUcilaYFwyR1UjL1xCaDZER0l1SSZMWi4qLDRAVUQqZixOPyNVUi4/QixJXy9KUyNbVWE8XjQhYCpsKjY9LV4hVyhCRyM4K3NvZGdkS0VgLlNSX1pXMW4kcEdtQWU1TnBnKmViKjZqXSQkWG1DN29ScC89XCYkNFNFNUFvaTVNSXMlRS0lQVg8akI9PSMzMy9OYTArMHM+ZE1lamJSPD1tK0YpRmlyc0NcVlI8XkNATDcyc08mJk0sU2NNNkNSNkJub3E9NWstXUBPVS4zKiNpT25pUGgja0Y5LmFFRUhjSz8kJE0mP2RvcVgpcCJgJkNxX2xCOmNwbi44Q25HOlNjI0I6Wi5cWz9TQzxUMVRuTD00SmFeODpbW1UnZiE7TTpGcV0lY0lUSkByR0cqM2NrU1hnZGZMczEvM1RuQ3RnNktRLVQ7XF5sXDR+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDkKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMDIgMDAwMDAgbiAKMDAwMDAwMDIwOSAwMDAwMCBuIAowMDAwMDAwMzIxIDAwMDAwIG4gCjAwMDAwMDA1MjQgMDAwMDAgbiAKMDAwMDAwMDU5MiAwMDAwMCBuIAowMDAwMDAwODUzIDAwMDAwIG4gCjAwMDAwMDA5MTIgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8ZWM1MTI1NTU0ZGFkNTE1NTI2YWU0NTM2OWUwMGU4MTY+PGVjNTEyNTU1NGRhZDUxNTUyNmFlNDUzNjllMDBlODE2Pl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA2IDAgUgovUm9vdCA1IDAgUgovU2l6ZSA5Cj4+CnN0YXJ0eHJlZgoyODA1CiUlRU9GCg==" },
  "autoridad-laboral": { nombre: "Comunicacion_Apertura_Centro_Trabajo.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA3IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgNyAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA0IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNTI2Cj4+CnN0cmVhbQpHYXUwRGdNWiJBJjpNbCtlRGo2MGxLUzMtWXFdIylPaG8sKzhBISYvR150WCwjWGVncEonMlsyLUhZPVtEMzIhbFYsKl5FVmxJcFA1azMlN24pPUxZOnImLFIjKWtxPiReYDFQTUE1KDBMLzkqMCIyWidpOic0b3M+Omo3X0ZMKS5tTThGbFROLF83KlVIcFYsXEJ0Lm9DOzVALVtsNjkjSWRzOThfXCIkLEJPVm50NE8wQjUuN1J0Zl9iczVoUG0zKl5wdVdyRD9IZEYjOyo2SyUlIy1KTlxLQ1UlbG9QcC06dSF0KDwkWV1jUzozSy5aJlZAaEQmPkNoXWM9Tkk3Q2NPSEtiZGxwWS8lZlRwNHFcQlhTL0Y+cDk8RlNIYzxfcz1bKTpeY0YhXCY0UkRlLUFcIUskcjQxUktSdV0/WzZyZTtKKyImODMtLkZBZmJxZSFpaGNBKChyRUxgY1RdO0JqYylTVSwzLFQ4Y1RcaEJGYyNGPUpdI01EMFBYSUpTWUEkYm82RiV0amtBXydhXHMiZyIlN1BEXk87RWAyXER1R0YvMHBvXykwSmcwJjhKVUIwbComMiclSTZERGJtciNjdWhJcEJAOEljI1pqdCo8c1prdSRaaG9CP11IKipxSEFYc001TG9NZ1ZcP0QuQ1dsOkNmRyxXNERvPS1bRixWKDMlS2pVZ1RUSlZyT1VjQD03O0cqXV8mVSJCb2QwXGw/WlQlQVQ6ZypHM3QrYGYoUClVRDoiUjM6UiIiVCJlI203ZTMmSyJhSlA1PDtcL0QzUC9nTVlMMyM9OjJhRW0hLG5TWzIuQjltQWglMihWQi9rVjEhaV4tQzpGWCZuYiE7aFtPVlg8TWk8Oylocy05P088Uk06bjpVO3QwWFIuPUUzTUhlNGppdUdqIWA5RU9PK1tXYDdcT0lJPEtrJCkjXVBlWVUwTzhyI10+SG9HXjUmSS9nLCE0XGM3Ii9cLzwrP01cO1ohJW9kMjNOS1VRLVAmUi1nSUMqUGdkMDBmcE0uO3BASTBjWD5gPzgmYjN0QWVoOFhhMVxdMXQ9Ql4vWXRJOU5rbm5GXjoua0s9IVh1QW4wbVk4WzsrIU9iT15NJ2VrPEpQLGomPWQ/NT4hQVh0cW4rI2dNI1coN3RuVGNcSD85aT5JLVFiNWJkTE8qbypCaT5xckwjQWA5XWVvVXBMNWxBQ2guJjRabyUvXzNNUydVXiRcQUxhXCJdRWlZIWdJUU83PShZLkVeKUs7Q3F1ODhYJTQrZF5cPjY2UismKXE6M1dNSWJGU3FtanE7ZE90KTFfL1ByZVxDYG8mKUVSYExsKDtDPWVlOzcsLW9yMVpiUWhtTUIsUml1aTJGYz9KQF9eSE8xczMyOlBwMlYhVC9EWF1KKUZbLWooKywoRTI8dG1WbUMnJjpPVXFjZmxEZ1xAO05cUDAuOlw3R0IqOFFZR2BlNUVgaW9BcSVAKzI4X2xWK0FaRDZzZDg6YHNrPmJmbmM5LjM/ZUU7K0NWTEY/J15fZjcwW2dqbVNGSUglPS42TU5WaUspJEclIzVpInBObkgnVz81Wl06Wkg9bktHMVlnPT5RTjYybltRcS9kZ2o3JT1LLzM0Mz5yTVE9UUJeVmUuR1RSY0ttVnEuJm5xRjhsJC9KJidAOTR1U2lFWlZJLCQsXT9gTD80NEIwUU5bYmRrV3A4Rk1MSy9uaWE5O0BsXHQpLSY+K2dRPW1gRDtbUT5OUGptYiNSNSdxSjosLSxEMFgnWkw4Wls4PkUhSG1OIyRnczEqZT5acjJbS041PzBuLmMkQGs1S0VFSyUtcEB0JS0kTXM8XnFAUHEjbStCUGBXYzkvVjRgKEFYXStZRzBbKl5QdUpMWWtvIiRbT0JWXDkzSDJqRF1TMlU8ciJeNDRgUTA1JmVtISM3I2FmSUUrV01Ib09BRSt0aDhAZWI1R11dM0ZgMldZXEFLR2hbKWRNdE5lISpgZkw0YDlMcFZDMFVfcVhJZFNaci1PPlJoIyVEZEgjZEt+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDkKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMDIgMDAwMDAgbiAKMDAwMDAwMDIwOSAwMDAwMCBuIAowMDAwMDAwMzIxIDAwMDAwIG4gCjAwMDAwMDA1MjQgMDAwMDAgbiAKMDAwMDAwMDU5MiAwMDAwMCBuIAowMDAwMDAwODUzIDAwMDAwIG4gCjAwMDAwMDA5MTIgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8MTZhMDJiMjkxODM5MTQzZDNlY2ZkMGE4YzY2MDA2MGI+PDE2YTAyYjI5MTgzOTE0M2QzZWNmZDBhOGM2NjAwNjBiPl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA2IDAgUgovUm9vdCA1IDAgUgovU2l6ZSA5Cj4+CnN0YXJ0eHJlZgoyNTI5CiUlRU9GCg==" },
  "ayuntamiento-licencia": { nombre: "Solicitud_Licencia_Actividad_Cantillana.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA3IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgNyAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA0IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNzU0Cj4+CnN0cmVhbQpHYXUwRD5BckxqJ1JuQjMzMDFcUEMsNVAsO2AtOkE0LWQoTUQnSEJhJWxAXT4uUkc9RzxuYCZcMUgpS11ma19hRksqOHA2Ukk+T1xcXWNiI3BncV89YnJyakIlQDl1dE4nbU9JUW08PTAlKz4hKDphNlxXX0IhMl8iKD1mKy9SWCdQWWxpKylfTVxuX0VDPWZBNXF1IUFkKEktJD9jLzQrKEg9KnRuWU81NjdnIl9nOiRnNzk/PiU6ci43UnUsTDhDRFouTGpvJW4wJjAyUk8+cWgsUidnaWlBc1sxajxOMVM1bEtxLDViLFQpYGhibT5mMnRQPVsnZ2pdSEohK1EyTV5JIlw2VkoxXFFTQj0yUU0paERbcjg/UyhsSUZIaXNEWWhCLz9gLnAtaC9eamdeZipFTXAocCRWO1xUMWk6dF9lLU1kbThlL2dAdS0hdUVjN2ojUzQwJiFHN082Q1ohNXRIYTI4IjFgVyM+VkRZJXVNRSxNbU0uWiYrMlNnMGRaS2ssQjFuKUxxRWpBIUx1MV9kTE4lQ25fLGBybCduQGopLmliLENuQTZgQU5SV0dGUkE5I003UXJkU0BJSlNxI2VeO2dgNEpvRi1eRS5uTGFBTSQhNXFyYikySHUtV1NbIUxib2ZodUwncW4uPVdXZy8+JEwiNEVwP0pSbm5zMHVFI1huSjc3cEEiOXRtMkAncD5Ub0hbOlskY15EPWUwNUk8NFxzcEkwU11ZQUhmVnFDUl5rLTtcVWRVVyJ0WEZdImlTMVQxWFtFaT1DbVZsJ18+KVcxZ1UxV1RgJ0cjakxhZnQuVyRMI1dSaCZLZClBczReLDFUP2VeQy46VChWanJDWGgvJjY1ZlcpQWJKWCV0RD8yS0BUXiVyUkQuIkllR21aJEExI05eMkpnJnRCZW1QJjI/J2lBKHFtJk86Pzg7MlVOXFRFSmlFPiVgVG5lSmdMUGpsXj9ES2FEZW00NjRCSVdfREBhOSlscTBFMDJBPTlMLjltWnRbXGg6LWE+K1MyYzZIM3NLVUE7aVFwKFwlSURNOXAzakluclFWcVV0JGRuWS88KEFyY2lKYVMtJTY+WG0wPU1Cby1FUCUxMD9zRWYrbkdhQUopazpea0w0MXJNKS1fLj49OiQ+UlJoOTFyYShQUldYNmMnRXNkQm9ycFdLUUdAL1BmaywpaS5hZFtjT1Vtc1NYISwhbC0rcCFpI0pmLitJX24nLjVpW2hUNC1OUDxVSHVxMV5VTE1rNFBCPjp0Q2RYailNdSYuYWY8TCQvNXNPSjItbSVDIipcVzc5JC1fIWY9Ky88TDpVODxNXnNMUXVDISg7ZThdMkknbz8+LHBwcyI2PSYoaF5aQzRnRnJZbypFUUdAKSdqLEQ5KkZNTWBHVEYqKHI+bFlgVm8nIylMZEY0VmtiZ2pQXnE8QEU2VCZoT2kwNiZdMU5wMlBwPClEJDsmRi0uPExbVGVnbUJ1I2BlcUskWTw/OGw7cT9sVHJzXEJFcXVtZk4nXCs2NztjSzgxPXI5PVJnPjl0Zlp0OSpnLCxFa2onaiU2OHJYN2NlPENdKUUuKSsyRVZpLTg9MTlHcSwoMFRlQytbbVk2YD9PSjcvaU0sdHJTJiRVJ1YiIUFxbkNvUGsuZU9wcmtIaztKSyRFIWNgZV8rKyo/VGpxL0lST1lkaFo9YS5aI3NTUEMzZjc0W2MkQl9wTUVWXkAycHA+LiZoOmwqcjAxOUtcLT9IJVl0XiMqXConXWZJcy9xWTdvLywwTjZfOS5uUjZCVTJtOnJNaXJhdFM8OFphY1p0UWMzSkkoSFtzYD4kYl0xLyNuLlZLQCNvNC5aUE5ST1h0K3NHXWplcmFmYyg3KlJyPiNpNFEkLmY/RkJnM0FuOCRUby5RPDQ8Nydlb1EjUGhXcSNFWmpzPF5sY3RbQmdxN0pdT2FkXDNwRkI0WE43VUV0S25oWzQ7MFVXS2pjVU4nYWxZQWBnamcsbFdkUSVIJmBpYzgtJj9xPE01OUFpISRaTkdaU2VObmtrSXFGLStfdFchLidKIj5NXFooQm5IOChoT2U9cTxES2VublQ3LU1LaS1QRD5PM29XampfUyY+OTFrXz1SKSpiYzAiS3U6MzFfV2ZTRG5CPERjQVNqN0grWystPzdxSl9wSlEpWWA3bktTRG4zQTNROkxlNyI1NCpLRj1YcDsvdHAnZ1Q0Q1dWJlheRydFYF03NixzS0dycCdMdSMhbTghSlFjVG1oI19JdVluLD0ucl1ZNGpEcklcTzwrIyMmQ05yKyZFPk5mM0NYOUtVXUBIVWtgO2dfUyFfPy1uMiN+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDkKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMDIgMDAwMDAgbiAKMDAwMDAwMDIwOSAwMDAwMCBuIAowMDAwMDAwMzIxIDAwMDAwIG4gCjAwMDAwMDA1MjQgMDAwMDAgbiAKMDAwMDAwMDU5MiAwMDAwMCBuIAowMDAwMDAwODUzIDAwMDAwIG4gCjAwMDAwMDA5MTIgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8ZjI0YjE1ZWVjNGYzZTZkZjM5OGMwZGUwY2JkNDBiMWE+PGYyNGIxNWVlYzRmM2U2ZGYzOThjMGRlMGNiZDQwYjFhPl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA2IDAgUgovUm9vdCA1IDAgUgovU2l6ZSA5Cj4+CnN0YXJ0eHJlZgoyNzU3CiUlRU9GCg==" },
  "prevencion": { nombre: "Plan_Prevencion_Riesgos_Laborales.pdf", data: "data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOSAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyAxMCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwNTAzMTU0NjU5KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjggMCBvYmoKPDwKL0NvdW50IDIgL0tpZHMgWyA0IDAgUiA1IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOSAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxMzUxCj4+CnN0cmVhbQpHYXUwQmJBUVQ5JkRjTSJDM2FfNSpWWzBNUlNAOl5OKDQnc25EKHRrWloqXjoqOlxoWUxic1RHZU1jJiwsVC8kVCtDV2A6ZjtWXUhXaUlOTnBuZFpQQExZJDRpOSQ9LEFXVCVUJ2d0PFE1YTVROjVSVS83MEgzaWhKNUU1KGlfVmRFRCpUZCFFUkJCaFE6UmtmOC9gJlooJGNvQCJbJCRzVGpkbFk5L1IsRkovVWxoRitEKUxITE9JJyclQWc1Xl4oPSRMMjc7YC1BYFxaMFM3RCdxQSMiLUdnNzIxKFQpMS9dMVpkdVwzVy91OE1wO05mYjdvSiNIT0dcWGhmVGJfNmdJOCNcK2RXPFBFYC09MCE9NG8uI04pckVMKUxIakBncmYjOzYqaF81P2k8SVVRKWppXTU+S2ZOJ01gb1YhQEspN1BFRkI6KidrSDhKQl1lZkI7Jzs3KXVgZVtSSVpaPGBkXGBgLnE0QXBuJmk3XU1CW0dFVk5LTmcoYzBfLWhaJnEnK1FuJUQ7ayZpcjlkPE5SZWBjTEFpZiZYV3E9Om9TIlJZVTRvdSQ/Xi5mLUJlNjpdWSxANFZrPXNqcUU1UmxpZTVGKEBvKmMhKVolNShTJGdZNi8mJ2ZCW0xhamRUUkola1BeW2BXOzU3O3BrLFpEZm1CWE8wW0E8XVUoNysoMTdxTTQyV21vJyxJbjNtRS5uSi9PKVJdZyNIJWUnbipnRkllQVhLM1pYYmhbREtLMi85STcvdSE5RVZPPGBCXCpQIlNcVTxdSFcpNzdhVlVZNXRKWEg/OzlsYGxBb10wOyRwXlJVPk0xO2BCYC1COGhcTktxV1BLYFNzdW1rKTheQDJBSSU4PlVXPFBmRiZKQS88LSkqKClGaWIvJ1RfKFQmbmJucV1BcyRoXC1QV3JDK1VrYS0pbkZbT0FxImAtUGFZMVFdc29WOSRmRXA/PE5MTTcjVHRHJF01Uzo4WHM3cSxuTlErRCFHcF5TJT0xSixKQm06L1w+ck9rQ2hbVGNTO19wYDBdRTBgRDdscmEncXVxIVM1ITRoa0xmKkVCTVVtTTtaNiVyWTV0IiZETD9IYyJ1QVBSL1tINC90MmdRISZdTUlaVTQ7YDBsL3UjZFMhTCg7IzhcXUFCbSJuakk3KmNlISNPYWplVDY4KiteNlI3TVtNMzEzTSE3Q0kuZk1EUFFdRj0nKFMtNXFecT8nXlBGPDdVVkIrRiYkOV5MW0shMmtzS3E/WCVzcXBiQl8ySV89TDRpcURqUithKnJKciw8XnNbbmZLXmZrNSRGZiVKRHRxJTduQm5qVUpiL1ohMTJoSS91O0wvW2o8I1wqTUs6aHVac0hKOyJMbHJwUiI3Z2ZOU20/YydSXmI/K1JQXWFgI2Jya0xyLlxaY28rY3BTIVI8cHFbaE9BPjkiMzwjc3FFSyhsPVxhRmpKMVgxJSVVXFY9aCE9LSM5WjVXWFpwXW1QRDBlPz44S21eQDpmOmcnSGY0JmZrRVRUS0dVJjQ0bitTRVF1Zk4uPF0rUFEzKWIhZkhMP0FhcUZrJDttXm9uYXF1RG1Jc2I5b2B1VGIvWHRqXGJUVjttSGRBcEZvcDRKUjIrNyYzYC05NzhnU3UoYVZvJilbIiRkKzlOXkVOZ1dCV1xRVFhVPGpdTFFfOlJbSHJQTkknL3A0PjZSZT07P1pCSj5HMicqSmlgOE5OSFI1blxUTGhIckRsRUlASWE0LW5kT2RRM1VWYk0uLCJDK0NWJGBLR2BaVnBSM0Rnb3QtPkU6azwrSlA4XX4+ZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNjk5Cj4+CnN0cmVhbQpHYXUwRTlsbGRwJkFAc0JvSitIcjE+YWwtWXNibTZARUZHZzw6LWpeSjBnXjAsbWI8bG9EPyElIjozXStEVjl0S0FaPklnZjw4UComKDw1KnBnTmpxb2FdbyskKG5zZD9sWUlDXmEsJkg5SFtNRiZTZStONV41T3NUUmVlblhWT2BdXlk0PiQ3LGJyXk4hWT0iN1k+MDdFMXFRLFdsajtaZGhOZUAmKUw6J0UhMytKMXBKREY0Ty1cQy43UnVmX2JzNWhQbTNPOXBpKV5VMVJMWE5SbXU7MGZkJ2wxMCdXT1EqJWVuTShRYT0lby8nLjhgQ0YmMEpFPFxtPENcTztfPDxQZ04iKFQtZWkkcGpEI1tVUltpJDBrLllFK21XOkZHQUtNO3JnSHNiR2hcOlZhTl0/YnE6UmhGJmFNSkU9I2liLHVacWohOTA9S0teL1hyKm4nMVZuLS5VckkoTS51MUpKYFU3RloqWSswVFVeRTxMQ1xxcF1dazhVSSNfXWl1akJWT1ZKQ2dycmgrPSEiTDgob2A8WWdNTHBgbTlbPUBiY0gxOSkvQyY4SlVCKj8wUWQnKC04X15LXGV0a18/V244SGtzcGlKSXNOLktWQktyZl9cTWx0LlFOZks9IkRUTlonLkRvZ0xgNDFeM0c7Njs9Um1ITm5WUE4vTElVZWYjRDJUPFspQWM0U2ZsTGcqIy0qT0VjLGwuWlJdN1JpMjY1ZzpEOEtkakYtP25EVj1oRVo1S2F0O00mQ1A2M0c4JjcjVC9ObDRSPTYwQCxyOTQkOEkuLWI9SkgzP2BdJ1BfM1J0OHNbPWssQ0YnYyFpMmFyQ18uJmwwcT08VmdOPSY4WV5aJVVILSZzUUNBcDN1SXVBQWhsQ0hMSTkrYCE0ayJoVmdWXU9zb14sRXBlP1pqTiReOCdVcCo2bENoPGkuRE1KVFt0Ny8xI1RXcV8jbzJmNGRIPU9UPU1RU2E/XjpCPUlCYkBeZyNpNm5VViZ1I0MuPD5OVzA9PzdqLDxoSj9CKyFRYDFBXi1HKHIuUC45dCFPUE84OTlJR2pmbk5dZElcS2FRWVZOOzVKKXBBZldZQE9ASkFkXCpwdFEsPDJhRlBodCsxXEJGLSs7Sz5hNEdNQ2QiK3VpSzRmX1VWTzwkUXJzJk9aUVRLN1Y7VExKdEcnIyJKM25uJlU1PyFfaV9oZG9WK1RJdGpkIWJgbDwoOi40Y0loSzNqaEJadD5IcUVcRklQNVtXK0M+Yl5KQ0hhJlMmP24vMmkxYD0/UDw3QGhiMmAuYUhzZ243SygsbmAlP0t1TS1Cc2UnKVNyazlBQl1sUWMtRSFqNDs9XlVNXitGOF9hQ0JQMVlpbz9LKlMmXipLUy1lQjMqJFwtO0BLRT06XHRAUidSNU03V2I1UCN0a0Azc1kmUzswTiNTLGprWHA4YU9RSi1aTDYkPSFTaHFldE5SaSpwTUdpOWJJLlU6TipnQTkqRmVPcjRuWz0yQzM7bU0pUEg6OENwUzw/Sl1XPmEyLkhfPEs4YTdFVlteOUc6O2IwIy4tZnJKblUkLUVWJ0lqaWdcW1Y/LGs+KTY6ZzVIPUprJiJwajR1a1ZoNi9WUyEqdERGSTJcYCkrTCY1Q1c+R2dVQztCOlBNXFxjLVZIZXEtNkhnRF1WKGEuSEJBXk9TbWV0KEJoZGByQU1mPUMuK1lUNE5ETEQ9UiY5S3FZVThpa3JZZDBDQ19GM3M/JWc+VW9fRjBvMldHQWNQSUU5NCRGYSw4Mj1wLktpPyhWXkZoJzBXYE5JO1ZPIVgtbjZFczdpL3RwbzZDSCVkZkdMXlA6ZVV1V1FiaiVSKEonLDQjTzNQNiFHZlxLXVJzSyQkJXFQb0U0aDJMZipAL1wmKltwIVZSXGE0OllnXzE+TS5XbzpWc3FgNCJESlBzblIldCdWSDdOVi5kbShXWGw5QXJnRi8nRWRzMGtDTmgib0wwWjZmQV1cRzNub09CRXRwXzFPIUZGTlZQPkA7JVVEL2srODooKkdNbGpzciFaQEZra1MnMzdJJmY3NmdsTjtoTjBcZj9EMWNYK15tKTtGZ0pmYSFDN2I+Y2ZkYm9aWmdjTjJqRWolOm8ibis3LFxBY0ssRzRxKGtsLlFZazo2JUleVnFpSEteQSxEYmE3J3NFRSFxNyVgLGFbRWhXaSJGVT1zMV9hZ15ZQV9RIyNYNyk3aVZnYE5tIkQ9NjhqMiYjJCFTI09yWTFYXjc4MDJJUik9VH4+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTEKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMDIgMDAwMDAgbiAKMDAwMDAwMDIwOSAwMDAwMCBuIAowMDAwMDAwMzIxIDAwMDAwIG4gCjAwMDAwMDA1MjQgMDAwMDAgbiAKMDAwMDAwMDcyOCAwMDAwMCBuIAowMDAwMDAwNzk2IDAwMDAwIG4gCjAwMDAwMDEwNTcgMDAwMDAgbiAKMDAwMDAwMTEyMiAwMDAwMCBuIAowMDAwMDAyNTY0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPGI3MWI4OGQ5MDkzZGQyYzI0MzRkZDJkY2FkODE5OTQ4PjxiNzFiODhkOTA5M2RkMmMyNDM0ZGQyZGNhZDgxOTk0OD5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gNyAwIFIKL1Jvb3QgNiAwIFIKL1NpemUgMTEKPj4Kc3RhcnR4cmVmCjQzNTUKJSVFT0YK" },
};

function descargarModeloPDF(tramiteId) {
  const m = MODELOS_PDF[tramiteId];
  if (!m) { mostrarToast('Modelo no disponible aún', ''); return; }
  const a = document.createElement('a');
  a.href = m.data;
  a.download = m.nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  mostrarToast('📥 Descargando ' + m.nombre, 'exito');
}


/* ── Render de una tarjeta de trámite ────────────────────────── */
function tramiteCard(t, idx) {
  const tieneDoc = t.documentoSubido && t.documentoSubido.nombre;
  const esProf   = APP.rolActivo !== 'alumno';

  return `
  <div class="tramite-card tramite-${t.estado}" id="tramite-${t.id}">
    <div class="tramite-header" onclick="toggleTramite('${t.id}')">
      <div class="tramite-num">${idx + 1}</div>
      <div class="tramite-info">
        <div class="tramite-organismo">${t.organismo}</div>
        <div class="tramite-nombre">${t.nombre}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end">
        ${tieneDoc ? `<span class="doc-badge-entregado">📎 Entregado</span>` : ''}
        ${t.anotacionProfesor ? `<span class="doc-badge-anotado">💬 Anotado</span>` : ''}
        ${t.fecha ? `<span style="font-size:0.72rem;color:var(--gris-400)">${t.fecha}</span>` : ''}
        <div class="tramite-ra">${t.ra.split(' · ').map(r => `<span class="ra-chip">${r}</span>`).join('')}</div>
        ${estadoTramiteHtml(t.estado)}
        <div class="tramite-chevron" id="chev-${t.id}">▶</div>
      </div>
    </div>

    <div class="tramite-body" id="body-${t.id}" style="display:none">
      <div class="tramite-grid">

        <!-- Columna izquierda: descripción y documentos -->
        <div>
          <div class="tramite-seccion-label">Descripción</div>
          <p style="font-size:0.82rem;color:var(--gris-700);line-height:1.5;margin-bottom:12px">${t.descripcion}</p>

          <div class="tramite-seccion-label">Documentación necesaria</div>
          <ul style="font-size:0.8rem;color:var(--gris-700);padding-left:16px;line-height:1.8;margin-bottom:12px">
            ${t.documentos.map(d => `<li>${d}</li>`).join('')}
          </ul>

          ${t.notas ? `
          <div class="tramite-seccion-label">Notas y observaciones</div>
          <div style="font-size:0.8rem;color:var(--verde-800);background:var(--verde-50);padding:8px 10px;border-radius:var(--radio-sm);border-left:3px solid var(--verde-500);margin-bottom:12px">
            ${t.notas}
          </div>` : ''}

          <!-- ── Sección de modelos descargables ── -->
          <div class="tramite-seccion-label">📥 Modelos y formularios</div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
            ${t.modelos.map(m => `
            <div class="modelo-row">
              <div class="modelo-tipo-badge ${m.tipo === 'oficial' ? 'modelo-oficial' : 'modelo-propio'}">
                ${m.tipo === 'oficial' ? '🏛️ Oficial' : '📝 Adaptado'}
              </div>
              <div class="modelo-info">
                <div class="modelo-nombre">${m.nombre}</div>
                <div class="modelo-desc">${m.desc}</div>
              </div>
              <button class="btn-secundario" style="font-size:0.75rem;padding:5px 10px;flex-shrink:0"
                onclick="descargarModeloPDF('${t.id}')">
                ⬇️ Descargar
              </button>
            </div>`).join('')}
          </div>
        </div>

        <!-- Columna derecha: info legal + subida documento -->
        <div>
          <div class="tramite-seccion-label">Plazo</div>
          <div style="font-size:0.82rem;font-weight:500;color:var(--gris-800);margin-bottom:10px">${t.plazo}</div>

          <div class="tramite-seccion-label">Coste estimado</div>
          <div style="font-size:0.82rem;font-weight:600;color:var(--verde-700);margin-bottom:10px">${t.coste}</div>

          <div class="tramite-seccion-label">Normativa aplicable</div>
          <div style="font-size:0.75rem;color:var(--gris-500);line-height:1.5;margin-bottom:16px">${t.normativa}</div>

          <!-- ── Zona de entrega del documento ── -->
          <div class="zona-entrega" id="zona-${t.id}">
            <div class="tramite-seccion-label">📤 Entrega del documento cumplimentado</div>
            ${tieneDoc ? renderDocEntregado(t) : renderZonaSubida(t)}
          </div>

          <!-- Anotación del profesor (si existe) -->
          ${t.anotacionProfesor ? `
          <div style="margin-top:10px;padding:10px;background:#fffbeb;border-radius:var(--radio-sm);border-left:3px solid #f59e0b">
            <div style="font-size:0.68rem;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">💬 Anotación del docente</div>
            <div style="font-size:0.8rem;color:#78350f">${t.anotacionProfesor}</div>
          </div>` : ''}

          <!-- Botones de acción del trámite -->
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:12px">
            ${t.estado !== 'completado' ? `
            <button class="btn-accion" style="font-size:0.8rem;padding:7px 12px"
              onclick="marcarTramite('${t.id}','completado')">
              ✓ Marcar como completado
            </button>` : ''}
            ${t.estado === 'pendiente' ? `
            <button class="btn-secundario" style="font-size:0.8rem;padding:7px 12px"
              onclick="marcarTramite('${t.id}','en-curso')">
              ⟳ Iniciar tramitación
            </button>` : ''}
            ${esProf && tieneDoc ? `
            <button class="btn-secundario" style="font-size:0.8rem;padding:7px 12px"
              onclick="abrirModalDoc('${t.id}',true)">
              💬 Ver y anotar documento
            </button>` : ''}
          </div>
        </div>

      </div>
    </div>
  </div>`;
}

/* ── Zona de subida vacía ─────────────────────────────────────── */
function renderZonaSubida(t) {
  return `
  <div class="drop-zone" id="drop-${t.id}"
    ondragover="event.preventDefault();this.classList.add('drop-active')"
    ondragleave="this.classList.remove('drop-active')"
    ondrop="onDropDoc(event,'${t.id}')">
    <div style="font-size:1.5rem;margin-bottom:6px">📂</div>
    <div style="font-size:0.8rem;font-weight:500;color:var(--gris-700);margin-bottom:4px">
      Arrastra aquí el documento cumplimentado
    </div>
    <div style="font-size:0.72rem;color:var(--gris-400);margin-bottom:10px">
      PDF, imagen o Word · Máx. 10 MB
    </div>
    <label class="btn-accion" style="font-size:0.78rem;padding:6px 14px;cursor:pointer">
      📎 Seleccionar archivo
      <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style="display:none" onchange="onSelectDoc(event,'${t.id}')">
    </label>
  </div>`;
}

/* ── Documento ya entregado ──────────────────────────────────── */
function renderDocEntregado(t) {
  const doc = t.documentoSubido;
  const esImg = doc.tipo && doc.tipo.startsWith('image/');
  const esPdf = doc.tipo && doc.tipo.includes('pdf');
  const icono = esPdf ? '📄' : esImg ? '🖼️' : '📎';
  return `
  <div class="doc-entregado">
    <div class="doc-entregado-icono">${icono}</div>
    <div class="doc-entregado-info">
      <div style="font-size:0.82rem;font-weight:600;color:var(--gris-800)">${doc.nombre}</div>
      <div style="font-size:0.72rem;color:var(--gris-400)">${doc.tamanyo} · Subido ${doc.fecha}</div>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn-secundario" style="font-size:0.75rem;padding:5px 8px"
        onclick="abrirModalDoc('${t.id}',false)">👁️ Ver</button>
      <button class="btn-secundario" style="font-size:0.75rem;padding:5px 8px;color:#dc2626;border-color:#fca5a5"
        onclick="eliminarDoc('${t.id}')">✕</button>
    </div>
  </div>`;
}

/* ── Handlers de subida ──────────────────────────────────────── */
function onDropDoc(event, tramiteId) {
  event.preventDefault();
  const el = document.getElementById('drop-' + tramiteId);
  if (el) el.classList.remove('drop-active');
  const file = event.dataTransfer.files[0];
  if (file) procesarArchivo(file, tramiteId);
}

function onSelectDoc(event, tramiteId) {
  const file = event.target.files[0];
  if (file) procesarArchivo(file, tramiteId);
}

function procesarArchivo(file, tramiteId) {
  if (file.size > 10 * 1024 * 1024) {
    mostrarToast('El archivo supera los 10 MB permitidos', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const t = EMPRESA_STATE.tramites.find(t => t.id === tramiteId);
    if (!t) return;
    t.documentoSubido = {
      nombre:      file.name,
      tipo:        file.type,
      tamanyo:     formatearTamanyo(file.size),
      fecha:       new Date().toLocaleDateString('es-ES'),
      dataUrl:     e.target.result,
    };
    // Cambiar automáticamente a en-curso si estaba pendiente
    if (t.estado === 'pendiente') t.estado = 'en-curso';
    vistaEmpresaRefresh();
    empTab('tramites');
    // Reabrir el trámite desplegado
    setTimeout(() => {
      toggleTramite(tramiteId);
      mostrarToast('📎 Documento subido correctamente', 'exito');
    }, 100);
  };
  reader.readAsDataURL(file);
}

function eliminarDoc(tramiteId) {
  const t = EMPRESA_STATE.tramites.find(t => t.id === tramiteId);
  if (t) {
    t.documentoSubido = null;
    vistaEmpresaRefresh();
    empTab('tramites');
    setTimeout(() => toggleTramite(tramiteId), 100);
    mostrarToast('Documento eliminado', '');
  }
}

function formatearTamanyo(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ── Modal de previsualización ───────────────────────────────── */
function abrirModalDoc(tramiteId, modoProfesor) {
  const t = EMPRESA_STATE.tramites.find(t => t.id === tramiteId);
  if (!t || !t.documentoSubido) return;

  document.getElementById('modal-doc-titulo').textContent = t.documentoSubido.nombre;
  document.getElementById('modal-doc-tramite').textContent = t.nombre + ' · ' + t.organismo;

  const anotWrap = document.getElementById('modal-anotacion-wrap');
  if (modoProfesor) {
    anotWrap.style.display = 'flex';
    anotWrap.style.alignItems = 'center';
    document.getElementById('modal-anotacion-input').value = t.anotacionProfesor || '';
    // Guardar referencia al trámite activo
    anotWrap.dataset.tramiteId = tramiteId;
  } else {
    anotWrap.style.display = 'none';
  }

  const body    = document.getElementById('modal-doc-body');
  const doc     = t.documentoSubido;
  const esImg   = doc.tipo && doc.tipo.startsWith('image/');
  const esPdf   = doc.tipo && doc.tipo.includes('pdf');

  if (esImg) {
    body.innerHTML = `<img src="${doc.dataUrl}" style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:var(--radio-md)">`;
  } else if (esPdf) {
    body.innerHTML = `<embed src="${doc.dataUrl}" type="application/pdf" width="100%" height="500px" style="border-radius:var(--radio-md)">
    <div style="margin-top:8px;font-size:0.75rem;color:var(--gris-400);text-align:center">
      Si el PDF no se muestra, <a href="${doc.dataUrl}" download="${doc.nombre}" style="color:var(--verde-600)">descárgalo aquí</a>
    </div>`;
  } else {
    body.innerHTML = `
    <div style="text-align:center;padding:40px;color:var(--gris-500)">
      <div style="font-size:3rem;margin-bottom:12px">📎</div>
      <div style="font-weight:600;margin-bottom:8px">${doc.nombre}</div>
      <div style="font-size:0.8rem;margin-bottom:16px">Este tipo de archivo no puede previsualizarse</div>
      <a href="${doc.dataUrl}" download="${doc.nombre}" class="btn-accion" style="text-decoration:none;display:inline-flex">⬇️ Descargar</a>
    </div>`;
  }

  document.getElementById('modal-prevista').style.display = 'flex';
}

function cerrarModalDoc(e) {
  if (!e || e.target === document.getElementById('modal-prevista')) {
    document.getElementById('modal-prevista').style.display = 'none';
  }
}

function guardarAnotacion() {
  const wrap = document.getElementById('modal-anotacion-wrap');
  const tramiteId = wrap.dataset.tramiteId;
  const texto = document.getElementById('modal-anotacion-input').value.trim();
  const t = EMPRESA_STATE.tramites.find(t => t.id === tramiteId);
  if (t) {
    t.anotacionProfesor = texto;
    mostrarToast('💬 Anotación guardada', 'exito');
    cerrarModalDoc();
    vistaEmpresaRefresh();
    empTab('tramites');
    setTimeout(() => toggleTramite(tramiteId), 100);
  }
}

/* ── Router interno del módulo empresa ───────────────────────── */
function renderSeccionEmpresa(seccion) {
  const mapa = {
    ficha:       seccionFicha,
    organigrama: seccionOrganigrama,
    tramites:    seccionTramites,
  };
  return (mapa[seccion] || mapa[seccion==='viabilidad'?'ficha':seccion] || seccionFicha)();
}

/* ── Acciones del módulo empresa ─────────────────────────────── */
function toggleTramite(id) {
  const body = document.getElementById('body-' + id);
  const chev = document.getElementById('chev-' + id);
  const abierto = body.style.display !== 'none';
  body.style.display = abierto ? 'none' : 'block';
  if (chev) chev.style.transform = abierto ? '' : 'rotate(90deg)';
}

function marcarTramite(id, nuevoEstado) {
  const t = EMPRESA_STATE.tramites.find(t => t.id === id);
  if (!t) return;
  t.estado = nuevoEstado;
  if (nuevoEstado === 'completado') {
    t.fecha = new Date().toISOString().slice(0,10);
    // Generar datos registrales automáticos según el trámite
    if (id === 'notaria' && !t.notas) {
      const proto = generarProtocolo();
      t.notas = 'Escritura otorgada. Número de protocolo: ' + proto + '.';
      mostrarToast('📜 Protocolo notarial asignado: ' + proto, 'exito');
    } else if (id === 'registro-mercantil' && !t.notas) {
      const hoja = generarHojaRegistro();
      t.notas = 'Inscrita. Hoja ' + hoja + '. La sociedad adquiere plena personalidad jurídica.';
      mostrarToast('🏛️ Hoja del Registro asignada: ' + hoja, 'exito');
    } else if (id === 'hacienda-nif' && !t.notas) {
      const cif = EMPRESA_STATE.datos.cifProvisional || generarCIF(EMPRESA_STATE.datos.formaJuridica);
      t.notas = 'NIF definitivo: ' + cif + '. Alta en el IAE epígrafe correspondiente.';
      mostrarToast('✓ Trámite completado', 'exito');
    } else {
      mostrarToast('✓ Trámite completado', 'exito');
    }
  } else {
    mostrarToast('Tramitación iniciada', '');
  }
  vistaEmpresaRefresh();
  empTab('tramites');
}

/* ============================================================
   ESTILOS DEL MÓDULO EMPRESA (inyectados dinámicamente)
   ============================================================ */
(function añadirEstilosEmpresa() {
  if (document.getElementById('estilos-empresa')) return;
  const s = document.createElement('style');
  s.id = 'estilos-empresa';
  s.textContent = [
    /* Tabs */
    `.empresa-tabs{display:flex;gap:4px;margin-bottom:1.25rem;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:6px;overflow-x:auto}`,
    `.emp-tab{flex:1;min-width:160px;padding:9px 14px;border:none;background:transparent;border-radius:var(--radio-md);font-size:.82rem;font-weight:500;color:var(--gris-500);cursor:pointer;transition:all var(--transicion);display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}`,
    `.emp-tab:hover{background:var(--verde-50);color:var(--verde-700)}`,
    `.emp-tab.activo{background:var(--verde-600);color:white;font-weight:600}`,
    `.emp-tab.activo .tab-progreso{background:rgba(255,255,255,.25)}`,
    `.tab-progreso{background:var(--verde-100);color:var(--verde-800);font-size:.7rem;font-weight:700;padding:2px 7px;border-radius:20px}`,
    /* Ficha cards */
    `.ficha-card{background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:1.25rem;box-shadow:var(--sombra-sm)}`,
    `.ficha-card-header{display:flex;align-items:center;gap:8px;font-size:.875rem;font-weight:600;color:var(--gris-800);margin-bottom:1rem;padding-bottom:.75rem;border-bottom:1px solid var(--gris-100)}`,
    `.empresa-grid-ficha{display:grid;grid-template-columns:1.6fr 1fr;gap:1rem;margin-bottom:1rem}`,
    `.ficha-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px 16px}`,
    `.ficha-campo label{display:block;font-size:.72rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}`,
    `.ficha-valor{font-size:.85rem;color:var(--gris-800);line-height:1.4}`,
    `.ficha-input{width:100%;padding:7px 10px;border:1.5px solid var(--verde-300);border-radius:var(--radio-sm);font-size:.85rem;font-family:var(--fuente-cuerpo);color:var(--gris-900);outline:none;background:var(--verde-50);transition:border-color var(--transicion)}`,
    `.ficha-input:focus{border-color:var(--verde-500);box-shadow:0 0 0 3px rgba(42,157,82,.1)}`,
    `textarea.ficha-input{resize:vertical}`,
    /* Estado metrics */
    `.emp-estado-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}`,
    `.emp-estado-item{padding:10px;background:var(--gris-50);border-radius:var(--radio-md);text-align:center}`,
    `.emp-estado-valor{font-size:1.2rem;font-weight:700;color:var(--gris-800)}`,
    `.emp-estado-valor.verde{color:var(--verde-700)}`,
    `.emp-estado-etiq{font-size:.68rem;color:var(--gris-400);margin-top:2px}`,
    /* Participaciones */
    `.participacion-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--gris-50)}`,
    `.participacion-row:last-child{border-bottom:none}`,
    `.part-avatar{width:28px;height:28px;border-radius:50%;background:var(--verde-200);color:var(--verde-900);font-size:.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}`,
    `.part-info{flex:1}`,
    `.part-nombre{font-size:.78rem;font-weight:500;color:var(--gris-800);margin-bottom:3px}`,
    `.part-barra-wrap{display:flex;align-items:center;gap:6px}`,
    `.part-barra{flex:1;height:5px;background:var(--gris-100);border-radius:3px;overflow:hidden}`,
    `.part-fill{height:100%;background:var(--verde-500);border-radius:3px}`,
    `.part-pct{font-size:.72rem;font-weight:600;color:var(--verde-700);width:30px;text-align:right}`,
    `.part-num{text-align:right}`,
    /* Justificación */
    `.justificacion-bloque{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--gris-50)}`,
    `.justificacion-bloque:last-of-type{border-bottom:none}`,
    `.just-check{width:20px;height:20px;border-radius:50%;background:var(--verde-500);color:white;font-size:.7rem;font-weight:700;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px}`,
    `.justificacion-bloque strong{font-size:.82rem;color:var(--gris-800);display:block;margin-bottom:2px}`,
    `.justificacion-bloque p{font-size:.75rem;color:var(--gris-500);margin:0;line-height:1.4}`,
    /* Organigrama visual */
    `.org-diagrama{display:flex;flex-direction:column;align-items:center;padding:1.5rem 1rem;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);box-shadow:var(--sombra-sm)}`,
    `.org-nivel-1{display:flex;justify-content:center}`,
    `.org-nivel-2{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}`,
    `.org-linea-v{width:2px;height:32px;background:var(--verde-300)}`,
    `.org-linea-h{width:80%;height:2px;background:var(--verde-300)}`,
    `.org-card{width:150px;padding:14px 10px;text-align:center;background:var(--verde-50);border:1.5px solid var(--verde-300);border-radius:var(--radio-lg);transition:all var(--transicion);cursor:default}`,
    `.org-card:hover{box-shadow:var(--sombra-md);transform:translateY(-2px)}`,
    `.org-card-dir{background:var(--verde-800);border-color:var(--verde-800);width:180px}`,
    `.org-card-dir .org-card-nombre{color:white}`,
    `.org-card-dir .org-card-alumno{color:var(--verde-200)}`,
    `.org-card-dir .org-card-alumno .org-avatar{background:rgba(255,255,255,.2);color:white}`,
    `.org-card-icono{font-size:1.4rem;margin-bottom:6px}`,
    `.org-card-nombre{font-size:.75rem;font-weight:600;color:var(--verde-800);margin-bottom:8px;line-height:1.3}`,
    `.org-card-alumno{display:flex;align-items:center;justify-content:center;gap:5px;font-size:.7rem;color:var(--verde-700)}`,
    `.org-avatar{width:22px;height:22px;border-radius:50%;background:var(--verde-200);color:var(--verde-900);font-size:.6rem;font-weight:700;flex-shrink:0;display:flex;align-items:center;justify-content:center}`,
    /* Gráfico barras */
    `.grafico-barras{display:flex;align-items:flex-end;gap:6px;height:120px;padding:0 4px}`,
    `.barra-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%}`,
    `.barra-valor{font-size:.6rem;color:var(--gris-400)}`,
    `.barra-col{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center}`,
    `.barra-fill{width:85%;border-radius:3px 3px 0 0;transition:height .4s ease;min-height:4px}`,
    `.barra-ok{background:var(--verde-500)}`,
    `.barra-warn{background:#f59e0b}`,
    `.barra-mes{font-size:.62rem;color:var(--gris-400)}`,
    /* Trámites */
    `.tramite-card{background:var(--blanco);border:1.5px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden;transition:box-shadow var(--transicion)}`,
    `.tramite-card:hover{box-shadow:var(--sombra-md)}`,
    `.tramite-completado{border-color:var(--verde-300)}`,
    `.tramite-en-curso{border-color:#f59e0b}`,
    `.tramite-pendiente{border-color:var(--gris-200)}`,
    `.tramite-header{display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;transition:background var(--transicion)}`,
    `.tramite-header:hover{background:var(--gris-50)}`,
    `.tramite-num{width:28px;height:28px;border-radius:50%;background:var(--verde-100);color:var(--verde-800);font-size:.75rem;font-weight:700;flex-shrink:0;display:flex;align-items:center;justify-content:center}`,
    `.tramite-completado .tramite-num{background:var(--verde-500);color:white}`,
    `.tramite-info{flex:1}`,
    `.tramite-organismo{font-size:.68rem;font-weight:600;color:var(--gris-400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px}`,
    `.tramite-nombre{font-size:.875rem;font-weight:500;color:var(--gris-800)}`,
    `.tramite-ra{display:flex;gap:4px;flex-wrap:wrap}`,
    `.tramite-chevron{font-size:.75rem;color:var(--gris-400);transition:transform .2s ease}`,
    `.tramite-body{padding:0 16px 16px;border-top:1px solid var(--gris-100)}`,
    `.tramite-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:1.5rem;padding-top:14px}`,
    `.tramite-seccion-label{font-size:.68rem;font-weight:700;color:var(--gris-400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}`,
    /* Ficha extras */
    `.ficha-banner-aviso{display:flex;align-items:flex-start;gap:12px;background:linear-gradient(135deg,var(--verde-800),var(--verde-600));color:white;padding:14px 18px;border-radius:var(--radio-md);margin-bottom:1rem;font-size:.82rem;line-height:1.5}`,
    `.ficha-card-sector{background:linear-gradient(135deg,var(--verde-800) 0%,var(--verde-600) 100%);border-color:var(--verde-700)}`,
    `.ficha-card-sector .ficha-card-header{color:white;border-bottom-color:rgba(255,255,255,.2)}`,
    `.ficha-input-vacio{border-color:#fbbf24!important;background:#fffbeb!important}`,
    `.ficha-vacio-vista{color:var(--gris-300)!important;font-style:italic}`,
    `.campo-ayuda{font-size:.7rem;color:var(--verde-500);cursor:help}`,
    `.capital-regla{display:flex;align-items:flex-start;gap:8px;background:var(--verde-50);border:1px solid var(--verde-200);border-radius:var(--radio-sm);padding:8px 10px;font-size:.75rem;color:var(--verde-800);margin-bottom:12px;line-height:1.5}`,
    `.socios-vacio{text-align:center;padding:24px 16px;color:var(--gris-400);font-size:.82rem;background:var(--gris-50);border-radius:var(--radio-md);border:2px dashed var(--gris-200)}`,
    `.socio-row{border:1.5px solid var(--gris-200);border-radius:var(--radio-md);overflow:hidden;margin-bottom:8px;transition:border-color var(--transicion)}`,
    `.socio-row:hover{border-color:var(--verde-300)}`,
    `.socio-row-header{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--gris-50);border-bottom:1px solid var(--gris-200)}`,
    `.socio-num{width:22px;height:22px;border-radius:50%;background:var(--verde-500);color:white;font-size:.7rem;font-weight:700;flex-shrink:0;display:flex;align-items:center;justify-content:center}`,
    `.socio-row-body{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px}`,
    `.btn-eliminar-socio{width:26px;height:26px;border-radius:50%;background:transparent;border:1.5px solid var(--gris-300);color:var(--gris-400);font-size:.75rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all var(--transicion)}`,
    `.btn-eliminar-socio:hover{background:#fee2e2;border-color:#fca5a5;color:#dc2626}`,
    `.cif-campo-wrap{display:flex;align-items:center;gap:8px;padding:9px 12px;border:1.5px solid var(--gris-200);border-radius:var(--radio-md);background:var(--gris-50);min-height:38px}`,
    `.cif-generado{font-family:var(--fuente-mono);font-size:.95rem;font-weight:700;color:var(--verde-800);letter-spacing:.05em}`,
    `.cif-badge{margin-left:auto;font-size:.68rem;font-weight:600;background:var(--verde-100);color:var(--verde-800);padding:2px 8px;border-radius:20px;border:1px solid var(--verde-200);white-space:nowrap}`,
    `@keyframes cifEntrada{0%{opacity:0;transform:scale(.9) translateY(-4px)}60%{transform:scale(1.05) translateY(0)}100%{opacity:1;transform:scale(1)}}`,
    `.cif-animado{animation:cifEntrada .5s ease forwards}`,
    /* Organigrama puestos */
    `.tipo-org-card{padding:10px 8px;text-align:center;cursor:pointer;border:1.5px solid var(--gris-200);border-radius:var(--radio-md);transition:all var(--transicion);background:var(--blanco)}`,
    `.tipo-org-card:hover{border-color:var(--verde-400);background:var(--verde-50)}`,
    `.tipo-org-activo{border-color:var(--verde-500);background:var(--verde-100);box-shadow:0 0 0 3px rgba(42,157,82,.15)}`,
    `.tipo-org-icono{font-size:1.6rem;margin-bottom:4px}`,
    `.tipo-org-nombre{font-size:.78rem;font-weight:600;color:var(--gris-800);margin-bottom:2px}`,
    `.tipo-org-desc{font-size:.68rem;color:var(--gris-500);line-height:1.3}`,
    `.puesto-card{background:var(--blanco);border:1.5px solid var(--gris-200);border-radius:var(--radio-lg);overflow:hidden;transition:box-shadow var(--transicion),border-color var(--transicion)}`,
    `.puesto-card:hover{box-shadow:var(--sombra-md)}`,
    `.puesto-card-dir{border-color:var(--verde-400)}`,
    `.puesto-card-ok{border-color:var(--verde-300)}`,
    `.puesto-header{display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer;transition:background var(--transicion)}`,
    `.puesto-header:hover{background:var(--gris-50)}`,
    `.puesto-icono-wrap{width:36px;height:36px;border-radius:var(--radio-md);background:var(--verde-100);color:var(--verde-800);font-size:1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}`,
    `.puesto-icono-dir{background:var(--verde-800)}`,
    `.puesto-nombre{font-size:.875rem;font-weight:600;color:var(--gris-800);margin-bottom:3px}`,
    `.puesto-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap}`,
    `.puesto-responsable{display:flex;align-items:center;gap:5px;font-size:.78rem;color:var(--gris-600)}`,
    `.puesto-tag{font-size:.68rem;font-weight:500;background:var(--gris-100);color:var(--gris-600);padding:2px 7px;border-radius:20px}`,
    `.puesto-soft{font-size:.7rem;font-weight:600;background:var(--verde-100);color:var(--verde-800);padding:2px 8px;border-radius:20px;border:1px solid var(--verde-200)}`,
    `.puesto-body{border-top:1px solid var(--gris-100);background:var(--gris-50)}`,
    `.puesto-form{padding:16px}`,
    `.puesto-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-bottom:12px}`,
    `.subpuesto-row{display:flex;align-items:center;gap:8px;margin-bottom:4px}`,
    `.subpuesto-num{width:20px;height:20px;border-radius:50%;background:var(--gris-200);color:var(--gris-600);font-size:.65rem;font-weight:700;flex-shrink:0;display:flex;align-items:center;justify-content:center}`,
    /* Responsive */

    `.modelo-row{display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-md);transition:border-color var(--transicion)}`,
    `.modelo-row:hover{border-color:var(--verde-300)}`,
    `.modelo-tipo-badge{font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap;flex-shrink:0}`,
    `.modelo-oficial{background:#dbeafe;color:#1e40af}`,
    `.modelo-propio{background:var(--verde-100);color:var(--verde-800)}`,
    `.modelo-info{flex:1;min-width:0}`,
    `.modelo-nombre{font-size:.78rem;font-weight:500;color:var(--gris-800);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
    `.modelo-desc{font-size:.7rem;color:var(--gris-400)}`,
    `.drop-zone{border:2px dashed var(--gris-300);border-radius:var(--radio-md);padding:20px;text-align:center;transition:all var(--transicion);background:var(--gris-50)}`,
    `.drop-zone:hover,.drop-active{border-color:var(--verde-400);background:var(--verde-50)}`,
    `.doc-entregado{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--verde-50);border:1.5px solid var(--verde-300);border-radius:var(--radio-md)}`,
    `.doc-entregado-icono{font-size:1.4rem;flex-shrink:0}`,
    `.doc-entregado-info{flex:1;min-width:0}`,
    `.doc-badge-entregado{font-size:.68rem;font-weight:700;background:var(--verde-100);color:var(--verde-800);padding:2px 8px;border-radius:20px;border:1px solid var(--verde-200)}`,
    `.doc-badge-anotado{font-size:.68rem;font-weight:700;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:20px;border:1px solid #fde68a}`,
    `.modal-overlay{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:1rem}`,
    `.modal-doc{background:var(--blanco);border-radius:var(--radio-lg);width:100%;max-width:860px;max-height:90vh;display:flex;flex-direction:column;box-shadow:var(--sombra-lg)}`,
    `.modal-doc-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:16px 20px;border-bottom:1px solid var(--gris-200)}`,
    `.modal-doc-body{flex:1;overflow:auto;padding:20px;display:flex;align-items:center;justify-content:center;background:var(--gris-50)}`,

    /* ── Correo empresarial ────────────────────────────── */
    `.correo-fila{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radio-md);cursor:pointer;transition:all var(--transicion);border:1px solid transparent}`,
    `.correo-fila:hover{background:var(--verde-50);border-color:var(--verde-200)}`,
    `.correo-fila-activo{background:var(--verde-100)!important;border-color:var(--verde-400)!important}`,
    `.correo-fila-nuevo{background:var(--gris-50)}`,
    `.correo-fila-dept{width:32px;height:32px;border-radius:8px;color:white;font-size:.9rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}`,
    `.correo-fila-de{font-size:.8rem;color:var(--gris-800)}`,
    `.correo-fila-hora{font-size:.68rem;color:var(--gris-400);flex-shrink:0}`,
    `.correo-fila-asunto{font-size:.78rem;color:var(--gris-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
    `.correo-fila-preview{font-size:.72rem;color:var(--gris-400);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}`,
    `.correo-bold{font-weight:700!important;color:var(--gris-900)!important}`,
    `.correo-dot-nuevo{width:8px;height:8px;border-radius:50%;background:var(--verde-500)}`,
    `.correo-detalle{background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);box-shadow:var(--sombra-sm);display:flex;flex-direction:column;overflow-y:auto;max-height:70vh}`,
    `.correo-detalle-header{padding:16px 20px;border-bottom:1px solid var(--gris-100)}`,
    `.correo-avatar{width:40px;height:40px;border-radius:10px;color:white;font-size:1.1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}`,
    `.correo-detalle-body{padding:16px 20px;flex:1}`,
    `.correo-hilo{padding:0 20px 12px;display:flex;flex-direction:column;gap:10px}`,
    `.hilo-msg{padding:12px 14px;border-radius:var(--radio-md);font-size:.84rem;line-height:1.6}`,
    `.hilo-alumno{background:var(--verde-50);border:1px solid var(--verde-200);margin-left:24px}`,
    `.hilo-ia{background:var(--gris-50);border:1px solid var(--gris-200);margin-right:24px}`,
    `.hilo-prof{background:#fef9ec;border:1px solid #fde68a;margin-left:24px}`,
    `.hilo-meta{display:flex;justify-content:space-between;margin-bottom:6px}`,
    `.hilo-autor{font-size:.72rem;font-weight:700;color:var(--gris-600)}`,
    `.hilo-fecha{font-size:.68rem;color:var(--gris-400)}`,
    `.hilo-texto{white-space:pre-line;color:var(--gris-700)}`,
    `.correo-responder{padding:12px 20px;border-top:1px solid var(--gris-100);background:var(--gris-50)}`,
    `.correo-panel-prof{padding:12px 20px;border-top:2px solid #fde68a;background:#fffdf7}`,

    `@media(max-width:900px){.empresa-grid-ficha{grid-template-columns:1fr}.ficha-grid-2{grid-template-columns:1fr}.tramite-grid{grid-template-columns:1fr}.org-nivel-2{gap:8px}.org-card{width:130px}}`,
    `@media(max-width:720px){.tipo-org-card{padding:8px 4px}.tipo-org-nombre{font-size:.7rem}.puesto-form-grid{grid-template-columns:1fr}.socio-row-body{grid-template-columns:1fr}}`,
  ].join('');
  document.head.appendChild(s);
})();


/* ============================================================
   MÓDULO DE MENSAJERÍA — CORREO EMPRESARIAL CON IA
   ============================================================ */

const DEPT_CORREO = {
  direccion:    { icono:'🎯', nombre:'Dirección',              color:'#134a28' },
  rrhh:         { icono:'👥', nombre:'RRHH',                   color:'#1e40af' },
  comercial:    { icono:'🧾', nombre:'Comercial',              color:'#9333ea' },
  contabilidad: { icono:'📊', nombre:'Contabilidad',           color:'#b45309' },
  fiscal:       { icono:'⚖️', nombre:'Fiscal',                 color:'#be123c' },
};

/* ── Generar correos con IA ─────────────────────────────────── */
async function generarCorreosIA(numCorreos, deptEspecifico) {
  const ms  = EMPRESA_STATE.mensajeria;
  const emp = EMPRESA_STATE.datos;
  if (ms.generando) return;
  ms.generando = true;
  vistaEmpresaRefreshMensajeria();

  const depts = deptEspecifico ? [deptEspecifico] : Object.keys(DEPT_CORREO);
  const sector = EMPRESA_STATE.config.sector;
  const nombreEmp = emp.nombre || 'la empresa del grupo';

  const prompt = `Eres un generador de situaciones empresariales realistas para un simulador educativo de empresa.
La empresa se llama "${nombreEmp}" y opera en el sector de "${sector}" en Cantillana (Sevilla).

Genera exactamente ${numCorreos} correos electrónicos que recibiría esta empresa. Cada correo debe ser una situación real que requiera una respuesta profesional.

Los correos deben ir dirigidos a estos departamentos: ${depts.map(d => DEPT_CORREO[d].nombre).join(', ')}.

Para cada correo devuelve SOLO un JSON array con objetos que tengan:
- "de": nombre ficticio del remitente (persona o empresa)
- "email": email ficticio del remitente
- "asunto": asunto del correo
- "cuerpo": cuerpo del correo (2-4 párrafos, profesional, con datos concretos como importes, fechas, nombres)
- "departamento": uno de [${depts.map(d => '"'+d+'"').join(',')}]
- "dificultad": "basico" | "intermedio" | "avanzado"
- "ra": CE del módulo 0656 que trabaja (ej: "RA6a", "RA6b", "RA6c", "RA6d", "RA6e", "RA6f")

Responde SOLO con el JSON array, sin markdown ni texto adicional.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    const text = data.content.map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const correos = JSON.parse(clean);

    const ahora = new Date();
    correos.forEach((c, i) => {
      ms.correos.unshift({
        id:           'correo-' + Date.now() + '-' + i,
        de:           c.de,
        email:        c.email,
        asunto:       c.asunto,
        cuerpo:       c.cuerpo,
        departamento: c.departamento,
        dificultad:   c.dificultad || 'intermedio',
        ra:           c.ra || 'RA6',
        fecha:        ahora.toLocaleDateString('es-ES'),
        hora:         ahora.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'}),
        leido:        false,
        hilo:         [],  // { tipo:'alumno'|'ia'|'profesor', texto, fecha, hora, autor }
        anotacionProf:'',
        calificacion: null,
      });
    });

    actualizarBadgeCorreos();
    mostrarToast('📧 ' + correos.length + ' correos nuevos recibidos', 'exito');
  } catch(e) {
    console.error('Error generando correos:', e);
    mostrarToast('Error al generar correos. Comprueba la conexión e inténtalo de nuevo.', 'error');
  }

  ms.generando = false;
  vistaEmpresaRefreshMensajeria();
}

function enviarRespuestaCorreo(correoId) {
  const ms = EMPRESA_STATE.mensajeria;
  const correo = ms.correos.find(c => c.id === correoId);
  if (!correo) return;
  const textarea = document.getElementById('resp-' + correoId);
  if (!textarea || !textarea.value.trim()) {
    mostrarToast('Escribe una respuesta antes de enviar', 'error');
    return;
  }
  const ahora = new Date();
  correo.hilo.push({
    tipo:  'alumno',
    texto: textarea.value.trim(),
    fecha: ahora.toLocaleDateString('es-ES'),
    hora:  ahora.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'}),
    autor: APP.usuario.displayName || 'Alumno/a',
  });
  mostrarToast('✓ Respuesta enviada', 'exito');
  vistaEmpresaRefreshMensajeria();
  // Generar respuesta de IA automática (continuación de la conversación)
  generarRespuestaIA(correoId);
}

/* ── Respuesta IA (continuación de conversación) ─────────────── */
async function generarRespuestaIA(correoId) {
  const ms = EMPRESA_STATE.mensajeria;
  const correo = ms.correos.find(c => c.id === correoId);
  if (!correo) return;

  const historial = [
    `[CORREO ORIGINAL de ${correo.de}]\nAsunto: ${correo.asunto}\n${correo.cuerpo}`,
    ...correo.hilo.map(h =>
      h.tipo === 'alumno'
        ? `[RESPUESTA DE LA EMPRESA]\n${h.texto}`
        : `[RESPUESTA DE ${correo.de.toUpperCase()}]\n${h.texto}`
    )
  ].join('\n\n---\n\n');

  const prompt = `Eres ${correo.de} (${correo.email}). Estás manteniendo una conversación por email con la empresa "${EMPRESA_STATE.datos.nombre || 'SimulApp S.L.'}" del sector "${EMPRESA_STATE.config.sector}".

Historial de la conversación:
${historial}

Genera la siguiente respuesta de ${correo.de} a la empresa. Debe ser profesional, coherente con la conversación anterior, y plantear una continuación natural (confirmar, pedir más detalle, negociar, agradecer, etc.).

Responde SOLO con el texto del correo, sin asunto ni encabezados. 2-3 párrafos máximo.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    const texto = data.content.map(c => c.text || '').join('');
    const ahora = new Date();
    correo.hilo.push({
      tipo:  'ia',
      texto: texto.trim(),
      fecha: ahora.toLocaleDateString('es-ES'),
      hora:  ahora.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'}),
      autor: correo.de,
    });
    vistaEmpresaRefreshMensajeria();
  } catch(e) {
    // Sin respuesta IA en modo demo, no pasa nada
    console.log('Respuesta IA no disponible (modo demo)');
  }
}

/* ── Anotación del profesor ──────────────────────────────────── */
function anotarCorreoProf(correoId) {
  const correo = EMPRESA_STATE.mensajeria.correos.find(c => c.id === correoId);
  if (!correo) return;
  const input = document.getElementById('anot-prof-' + correoId);
  if (!input) return;
  correo.anotacionProf = input.value.trim();
  mostrarToast('💬 Anotación guardada', 'exito');
  vistaEmpresaRefreshMensajeria();
}

function calificarCorreo(correoId, nota) {
  const correo = EMPRESA_STATE.mensajeria.correos.find(c => c.id === correoId);
  if (correo) {
    correo.calificacion = nota;
    mostrarToast('🏅 Calificación guardada: ' + nota + '/10', 'exito');
  }
}

/* ── Helpers UI ─────────────────────────────────────────────── */
function actualizarBadgeCorreos() {
  const noLeidos = EMPRESA_STATE.mensajeria.correos.filter(c => !c.leido).length;
  const badge = document.getElementById('badge-correos');
  if (badge) badge.textContent = noLeidos;
}
function marcarLeido(correoId) {
  const c = EMPRESA_STATE.mensajeria.correos.find(c => c.id === correoId);
  if (c) c.leido = true;
  actualizarBadgeCorreos();
}
function vistaEmpresaRefreshMensajeria() {
  if (APP.moduloActual === 'mensajeria') {
    document.getElementById('contenido-principal').innerHTML = vistaMensajeria();
  }
}

/* ============================================================
   VISTA: MENSAJERÍA
   ============================================================ */

/* ============================================================
   GENERADOR DE SITUACIONES — PROFESOR + GRUPOS
   ============================================================ */

const TIPOS_SITUACION = [
  {
    id: 'factura-compra',
    icono: '📥', label: 'Factura de compra',
    dept: 'comercial',
    desc: 'El alumno debe registrar la factura en Factusol y contabilizarla en Contasol',
    software: 'Factusol + Contasol',
    prompt: (emp, sector, datos) => `Eres el responsable de facturación de "${datos.empresa}" (CIF: ${datos.cif}), proveedor de "${emp}". 
Redacta un correo electrónico profesional y completamente realista enviando la factura del mes.
El correo debe sonar exactamente como un correo real de empresa: saludo personalizado, referencia a la relación comercial, mención de la factura adjunta con sus datos (número ${datos.numDoc}, fecha ${datos.fecha}, base imponible ${datos.base} €, IVA ${datos.tipoIVA}% = ${datos.cuotaIVA} €, total ${datos.total} €), condiciones de pago (${datos.formaPago}), y datos bancarios para el pago (IBAN ${datos.iban}).
Incluye también una mención natural a algo del contexto del sector "${sector}" (temporada, cosecha, pedido anterior, etc.).
Cierra con firma completa. NO uses asteriscos ni formato markdown. Correo en texto plano, natural y profesional. Entre 200 y 350 palabras.`,
    genDatos: () => {
      const precioNeto = (Math.random()*4000+800).toFixed(2);
      const tiposIVA = [4, 10, 21];
      const tIVA = tiposIVA[Math.floor(Math.random()*3)];
      // Descuentos aleatorios
      const tieneDto = Math.random() > 0.5;
      const dtoPP = tieneDto ? (Math.random()*3+1).toFixed(1) : 0;  // dto pronto pago
      const tieneRappel = Math.random() > 0.7;
      const rappel = tieneRappel ? (Math.random()*2+0.5).toFixed(1) : 0;
      // Envases
      const tieneEnvases = Math.random() > 0.6;
      const envasesDev = tieneEnvases && Math.random() > 0.5;
      const impEnvases = tieneEnvases ? (Math.random()*80+20).toFixed(2) : 0;
      // Gastos accesorios
      const tieneGastos = Math.random() > 0.5;
      const gastosTrans = tieneGastos ? (Math.random()*120+30).toFixed(2) : 0;
      // Cálculo base real
      let base = parseFloat(precioNeto);
      if (dtoPP > 0) base = base * (1 - parseFloat(dtoPP)/100);
      if (rappel > 0) base = base * (1 - parseFloat(rappel)/100);
      if (tieneEnvases && !envasesDev) base += parseFloat(impEnvases);
      if (tieneGastos) base += parseFloat(gastosTrans);
      base = base.toFixed(2);
      const cuota = (parseFloat(base)*tIVA/100).toFixed(2);
      const total = (parseFloat(base)+parseFloat(cuota)).toFixed(2);
      const empresas = ['Agroinsumos del Sur S.L.','Distribuciones Ramos e Hijos S.L.','Suministros Vega Alta S.A.','Packaging Andaluz S.L.','Transportes Guadalquivir S.L.'];
      const formas = ['30 días fecha factura','60 días fecha factura','al contado','transferencia bancaria a 30 días'];
      const empresa = empresas[Math.floor(Math.random()*empresas.length)];
      const letrasCIF = 'ABCDEFGHJKLMNPQRSUVW';
      const cif = letrasCIF[Math.floor(Math.random()*letrasCIF.length)]+'-'+Math.floor(Math.random()*90000000+10000000);
      let extras = [];
      if (dtoPP > 0) extras.push(`Dto. pronto pago ${dtoPP}%`);
      if (rappel > 0) extras.push(`Rappel ${rappel}%`);
      if (tieneEnvases) extras.push(`Envases ${envasesDev?'(con facultad devolución)':'(sin devolución)'}: ${impEnvases} €`);
      if (tieneGastos) extras.push(`Portes/transporte: ${gastosTrans} €`);
      return {
        empresa, cif,
        numDoc: 'F-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9000)+1000),
        fecha: new Date().toLocaleDateString('es-ES'),
        precioNeto, dtoPP, rappel, impEnvases, envasesDev, gastosTrans,
        base, tipoIVA: tIVA, cuotaIVA: cuota, total,
        formaPago: formas[Math.floor(Math.random()*formas.length)],
        iban: 'ES'+Math.floor(Math.random()*90+10)+' '+Array.from({length:4},()=>Math.floor(Math.random()*9000+1000)).join(' '),
        extras: extras.join(' · '),
        infoDoc: `Factura ${empresa} · Base: ${base} € · IVA ${tIVA}%: ${cuota} € · Total: ${total} €${extras.length?' · '+extras.join(' · '):''}`,
      };
    },
  },
  {
    id: 'factura-venta',
    icono: '📤', label: 'Factura de venta emitida',
    dept: 'comercial',
    desc: 'El alumno debe registrar la factura emitida en Factusol y hacer el asiento en Contasol (430/700/477)',
    software: 'Factusol + Contasol',
    prompt: (emp, sector, datos) => `Eres el responsable de compras de "${datos.cliente}" (CIF: ${datos.cifCliente}), cliente de "${emp}".
Redacta un correo profesional y natural confirmando la recepción de la factura ${datos.numDoc} de fecha ${datos.fecha} por importe total de ${datos.total} €.
El correo debe ser completamente realista: menciona los productos o servicios del pedido (relacionados con el sector "${sector}"), confirma que la factura está conforme, indica que el pago se realizará según las condiciones acordadas (${datos.formaPago}), y puede incluir algún comentario sobre la calidad del servicio o una mención a próximos pedidos.
Cierra con firma completa. Texto plano, sin markdown. Entre 150 y 250 palabras.`,
    genDatos: () => {
      const base = (Math.random()*6000+1200).toFixed(2);
      const tIVA = [4,10,21][Math.floor(Math.random()*3)];
      const cuota = (parseFloat(base)*tIVA/100).toFixed(2);
      const total = (parseFloat(base)+parseFloat(cuota)).toFixed(2);
      const clientes = ['Mercados Sevillanos S.A.','Distribuciones Hermanos García S.L.','Exportaciones Bética S.A.','Cooperativa del Campo Andaluz','Supermercados Vega S.L.','Almacenes del Sur S.A.'];
      const cliente = clientes[Math.floor(Math.random()*clientes.length)];
      const letrasCIF = 'ABCDEFGHJKLMNPQRSUVW';
      const cifCliente = letrasCIF[Math.floor(Math.random()*letrasCIF.length)]+'-'+Math.floor(Math.random()*90000000+10000000);
      return {
        cliente, cifCliente,
        numDoc: 'FAC-'+String(Math.floor(Math.random()*900)+100),
        fecha: new Date().toLocaleDateString('es-ES'),
        base, tipoIVA: tIVA, cuotaIVA: cuota, total,
        formaPago: ['30 días','60 días','contado'][Math.floor(Math.random()*3)],
        infoDoc: `Factura emitida a ${cliente} · Nº FAC-XXX · Base: ${base} € · IVA ${tIVA}%: ${cuota} € · Total: ${total} €`,
      };
    },
  },
  {
    id: 'nomina',
    icono: '💶', label: 'Nómina para procesar',
    dept: 'rrhh',
    desc: 'El alumno debe calcular y procesar la nómina en Nominasol con los datos del empleado',
    software: 'Nominasol',
    prompt: (emp, sector, datos) => `Eres ${datos.nombreEmp}, empleado/a de "${emp}", con categoría profesional ${datos.categoria}.
Redacta un correo completamente natural dirigido al departamento de RRHH solicitando información sobre tu nómina del mes de ${datos.mes}.
El correo debe sonar a un empleado real: puedes preguntar por algún concepto que no entiendes (horas extra, IRPF retenido, cotizaciones a la SS), mencionar que has visto una diferencia respecto al mes anterior, o simplemente preguntar cuándo estará disponible la nómina para revisarla.
Los datos del empleado son: salario base ${datos.salarioBase} €/mes, categoría ${datos.categoria}, contrato ${datos.tipoContrato}, antigüedad ${datos.antiguedad}.
Cierra con firma del empleado. Texto plano, sin markdown. Entre 100 y 200 palabras.`,
    genDatos: () => {
      const nombres = ['Carlos Ruiz Martínez','María Sánchez López','Antonio Fernández García','Laura Gómez Pérez','José Moreno Jiménez','Carmen Torres Vega'];
      const categorias = ['Oficial 1ª','Oficial 2ª','Auxiliar administrativo/a','Jefe/a de departamento','Operario/a de almacén','Técnico/a comercial'];
      const contratos = ['indefinido','temporal por 6 meses','a tiempo parcial'];
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      return {
        nombreEmp: nombres[Math.floor(Math.random()*nombres.length)],
        categoria: categorias[Math.floor(Math.random()*categorias.length)],
        salarioBase: (Math.random()*800+1100).toFixed(2),
        tipoContrato: contratos[Math.floor(Math.random()*contratos.length)],
        antiguedad: Math.floor(Math.random()*8+1)+' años',
        mes: meses[new Date().getMonth()],
        infoDoc: 'Nómina mensual — datos del empleado para procesar en Nominasol',
      };
    },
  },
  {
    id: 'contrato',
    icono: '📋', label: 'Alta y contratación',
    dept: 'rrhh',
    desc: 'El alumno debe tramitar el contrato y el alta en la SS (TA.2) en Nominasol',
    software: 'Nominasol + SS',
    prompt: (emp, sector, datos) => `Eres ${datos.nombreEmp}, candidato/a seleccionado/a para trabajar en "${emp}".
Redacta un correo completamente natural dirigido al departamento de RRHH tras haber recibido una llamada comunicándote que has sido seleccionado/a para el puesto de ${datos.puesto}.
El correo debe sonar completamente real: muestra entusiasmo, pregunta por los próximos pasos (cuándo firmas el contrato, qué documentación tienes que llevar), menciona alguna duda concreta sobre el tipo de contrato (${datos.tipoContrato}) o el salario (${datos.salario} €/mes), y quizás pregunta sobre el horario o el período de prueba.
Tus datos personales: DNI ${datos.dni}, fecha disponible para incorporación ${datos.fechaInc}.
Cierra con tu nombre completo. Texto plano, sin markdown. Entre 150 y 220 palabras.`,
    genDatos: () => {
      const nombres = ['Alejandro Ruiz Castro','Sandra Morales Vega','Rubén Jiménez Torres','Natalia López Fernández','Marcos García Blanco'];
      const puestos = ['auxiliar administrativo/a','técnico/a comercial','operario/a de almacén','responsable de logística','administrativo/a contable'];
      const tipos = ['indefinido','temporal 6 meses','prácticas','formación en alternancia'];
      const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const num = Math.floor(Math.random()*90000000+10000000);
      return {
        nombreEmp: nombres[Math.floor(Math.random()*nombres.length)],
        puesto: puestos[Math.floor(Math.random()*puestos.length)],
        tipoContrato: tipos[Math.floor(Math.random()*tipos.length)],
        salario: (Math.random()*600+1100).toFixed(2),
        dni: num+letras[num%23],
        fechaInc: new Date(Date.now()+7*24*60*60*1000).toLocaleDateString('es-ES'),
        infoDoc: 'Alta de nuevo empleado — tramitar contrato y TA.2 en Nominasol',
      };
    },
  },
  {
    id: 'baja-medica',
    icono: '🏥', label: 'Parte de baja médica',
    dept: 'rrhh',
    desc: 'El alumno debe gestionar la baja en Nominasol: comunicar a la SS, ajustar la nómina',
    software: 'Nominasol',
    prompt: (emp, sector, datos) => `Eres ${datos.nombreEmp}, empleado/a de "${emp}".
Redacta un correo al departamento de RRHH comunicando que has recibido un parte de baja médica por ${datos.motivo} con fecha de inicio ${datos.fechaBaja}.
El correo debe ser completamente humano y natural: explica brevemente la situación sin entrar en detalles íntimos, adjunta el parte médico (menciónalo como adjunto), pregunta cómo afectará esto a tu nómina de este mes, si necesitas hacer algún trámite adicional, y cuándo tienes que entregar el parte de confirmación.
Muestra cierta preocupación por dejar el trabajo organizado antes de la baja si hay tiempo.
Cierra con tu nombre. Texto plano, sin markdown. Entre 130 y 200 palabras.`,
    genDatos: () => {
      const nombres = ['Pedro Álvarez Moreno','Isabel Castro Ruiz','Francisco Navarro Gil','Elena Herrero Santos','Diego Vargas Molina'];
      const motivos = ['enfermedad común (gripe con complicaciones)','accidente no laboral (fractura de muñeca)','intervención quirúrgica programada','lumbalgia aguda','gastroenteritis severa'];
      return {
        nombreEmp: nombres[Math.floor(Math.random()*nombres.length)],
        motivo: motivos[Math.floor(Math.random()*motivos.length)],
        fechaBaja: new Date().toLocaleDateString('es-ES'),
        duracionEst: Math.floor(Math.random()*14+3)+' días',
        infoDoc: 'Parte de baja médica — gestionar en Nominasol y comunicar a la SS',
      };
    },
  },
  {
    id: 'embargo-nomina',
    icono: '⚖️', label: 'Notificación de embargo en nómina',
    dept: 'rrhh',
    desc: 'El alumno debe aplicar la retención por embargo en la nómina según los límites legales del ET',
    software: 'Nominasol',
    prompt: (emp, sector, datos) => `Eres el/la notificador/a del Juzgado de Primera Instancia nº ${datos.numJuzgado} de ${datos.ciudad}.
Redacta una notificación oficial completamente realista y con lenguaje jurídico dirigida a "${emp}" como empresa empleadora de D./D.ª ${datos.nombreEmp} (DNI: ${datos.dni}).
La notificación debe ordenar la retención de la parte embargable del salario hasta cubrir una deuda de ${datos.deuda} € por el procedimiento de ejecución de títulos judiciales nº ${datos.numProcedimiento}.
Debe incluir: base legal (art. 607 LEC sobre inembargabilidad del salario mínimo), cálculo orientativo del porcentaje aplicable sobre el salario neto que exceda del SMI (${datos.smi} € en ${new Date().getFullYear()}), plazo para comenzar las retenciones, consecuencias del incumplimiento, y dirección a la que ingresar las cantidades retenidas.
Lenguaje oficial, sin markdown. Entre 250 y 350 palabras.`,
    genDatos: () => {
      const nombres = ['Carlos Ruiz Martínez','María Sánchez López','Antonio Fernández García','Laura Gómez Pérez'];
      const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const num = Math.floor(Math.random()*90000000+10000000);
      const ciudades = ['Sevilla','Carmona','Écija','Utrera','Alcalá de Guadaíra'];
      return {
        nombreEmp: nombres[Math.floor(Math.random()*nombres.length)],
        dni: num+letras[num%23],
        deuda: (Math.random()*8000+1500).toFixed(2),
        numJuzgado: Math.floor(Math.random()*8+1),
        ciudad: ciudades[Math.floor(Math.random()*ciudades.length)],
        numProcedimiento: Math.floor(Math.random()*900+100)+'/'+new Date().getFullYear(),
        smi: '1.184,00',
        infoDoc: 'Embargo de nómina — aplicar retención según art. 607 LEC en Nominasol',
      };
    },
  },
  {
    id: 'requerimiento-aeat',
    icono: '🏛️', label: 'Requerimiento de la AEAT',
    dept: 'fiscal',
    desc: 'El alumno debe responder al requerimiento con la documentación solicitada',
    software: 'Contasol + AEAT Sede',
    prompt: (emp, sector, datos) => `Eres funcionario/a de la Delegación de la Agencia Estatal de Administración Tributaria de Sevilla.
Redacta una notificación oficial completamente realista dirigida a "${emp}" (CIF: ${datos.cifEmp}).
El requerimiento es para que aporte documentación relativa a ${datos.concepto} del período ${datos.periodo}. El número de referencia es ${datos.numRef}.
La notificación debe incluir: encabezado oficial de la AEAT, número de expediente, fundamento legal (artículo 93 de la LGT sobre obligaciones de información), documentación específica que se solicita (libros registro de facturas emitidas y recibidas, declaraciones presentadas, contratos), plazo de 10 días hábiles para responder, advertencia de que el incumplimiento puede conllevar sanción de ${datos.sancion} € según el art. 199 LGT, e instrucciones para responder por Sede Electrónica.
Lenguaje oficial y preciso. Sin markdown. Entre 280 y 380 palabras.`,
    genDatos: () => {
      const conceptos = ['las discrepancias detectadas entre el Modelo 303 del 3T y los libros de facturas','la declaración del Modelo 347 — operaciones con terceros superiores a 3.005,06 €','los rendimientos del trabajo declarados en el Modelo 111 del 2T','la base imponible declarada en el Modelo 200 del Impuesto sobre Sociedades'];
      const periodos = ['ejercicio '+new Date().getFullYear(),'primer trimestre '+new Date().getFullYear(),'segundo trimestre '+new Date().getFullYear(),'tercer trimestre '+new Date().getFullYear()];
      const letrasCIF = 'ABCDEFGHJKLMNPQRSUVW';
      return {
        cifEmp: letrasCIF[Math.floor(Math.random()*letrasCIF.length)]+'-'+Math.floor(Math.random()*90000000+10000000),
        concepto: conceptos[Math.floor(Math.random()*conceptos.length)],
        periodo: periodos[Math.floor(Math.random()*periodos.length)],
        numRef: 'REQ-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*900000+100000),
        sancion: (Math.random()*300+150).toFixed(2),
        infoDoc: 'Requerimiento AEAT — responder por Sede Electrónica en plazo de 10 días hábiles',
      };
    },
  },
  {
    id: 'deuda-ss',
    icono: '🏦', label: 'Notificación de deuda con la SS',
    dept: 'rrhh',
    desc: 'El alumno debe regularizar la deuda con la Seguridad Social',
    software: 'Nominasol + TGSS',
    prompt: (emp, sector, datos) => `Eres funcionario/a de la Tesorería General de la Seguridad Social, Dirección Provincial de Sevilla.
Redacta una notificación oficial de reclamación de deuda dirigida a "${emp}" (CIR: ${datos.cir}) por falta de ingreso de las cuotas de la Seguridad Social correspondientes al período ${datos.periodo}.
La notificación debe incluir: encabezado oficial de la TGSS, número de reclamación de deuda ${datos.numRec}, importe total adeudado desglosado en cuotas de contingencias comunes ${datos.ccImporte} € y desempleo ${datos.desImporte} € más recargo del ${datos.recargo}% por demora = total ${datos.total} €, base legal (art. 30 LGSS), plazo de 30 días para pagar sin sanción adicional, advertencia de inicio de procedimiento ejecutivo si no se regulariza, e instrucciones para domiciliar en la SEDESS.
Lenguaje oficial. Sin markdown. Entre 250 y 320 palabras.`,
    genDatos: () => {
      const periodos = ['octubre '+new Date().getFullYear(),'septiembre '+new Date().getFullYear(),'3T '+new Date().getFullYear()];
      const cc = (Math.random()*600+300).toFixed(2);
      const des = (Math.random()*150+80).toFixed(2);
      const rec = 10;
      const base = parseFloat(cc)+parseFloat(des);
      const recImporte = (base*rec/100).toFixed(2);
      return {
        cir: Math.floor(Math.random()*90000000+10000000)+'/'+Math.floor(Math.random()*90+10),
        periodo: periodos[Math.floor(Math.random()*periodos.length)],
        numRec: 'RD-'+Math.floor(Math.random()*900000+100000),
        ccImporte: cc, desImporte: des, recargo: rec,
        total: (base+parseFloat(recImporte)).toFixed(2),
        infoDoc: 'Deuda con la SS — regularizar pago en SEDESS y registrar en Nominasol',
      };
    },
  },
  {
    id: 'extracto-bancario',
    icono: '🏧', label: 'Extracto bancario',
    dept: 'contabilidad',
    desc: 'El alumno debe conciliar el extracto con los asientos contables en Contasol (cuenta 572)',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el servicio de banca de empresas del Banco ${datos.banco}.
Redacta un correo completamente natural y profesional enviando el extracto mensual de la cuenta corriente de "${emp}" (cuenta nº ${datos.iban}).
El correo debe sonar como un correo bancario real: saludo personalizado al gestor de la empresa, resumen del extracto del mes de ${datos.mes} (saldo inicial ${datos.saldoInicial} €, total cargos ${datos.cargos} €, total abonos ${datos.abonos} €, saldo final ${datos.saldoFinal} €), mención de los movimientos más relevantes (domiciliaciones, transferencias recibidas, cuota del préstamo), recordatorio de algún servicio bancario, y datos de contacto del gestor.
También puede incluir algún aviso si el saldo ha estado próximo a cero o si hay un cargo importante próximo.
Cierra con firma del gestor. Sin markdown. Entre 180 y 280 palabras.`,
    genDatos: () => {
      const bancos = ['Andalucía Empresas','Sabadell Empresas','BBVA Negocios','CaixaBank Empresas','Santander Pymes'];
      const banco = bancos[Math.floor(Math.random()*bancos.length)];
      const saldoIni = (Math.random()*15000+3000).toFixed(2);
      const abonos   = (Math.random()*12000+2000).toFixed(2);
      const cargos   = (Math.random()*10000+1500).toFixed(2);
      const saldoFin = (parseFloat(saldoIni)+parseFloat(abonos)-parseFloat(cargos)).toFixed(2);
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      return {
        banco,
        iban: 'ES'+Math.floor(Math.random()*90+10)+' '+Array.from({length:4},()=>Math.floor(Math.random()*9000+1000)).join(' '),
        mes: meses[new Date().getMonth()],
        saldoInicial: saldoIni, abonos, cargos, saldoFinal: saldoFin,
        infoDoc: `Extracto bancario ${banco} — conciliar con cuenta 572 en Contasol · Saldo final: ${saldoFin} €`,
      };
    },
  },

  /* ── NUEVOS TIPOS ─────────────────────────────────────────── */

  {
    id: 'despido',
    icono: '📤', label: 'Despido de trabajador',
    dept: 'rrhh',
    desc: 'El alumno debe tramitar el finiquito, la baja en la SS y el paro en Nominasol',
    software: 'Nominasol + SEPE',
    prompt: (emp, sector, datos) => `Eres el/la responsable de RRHH de "${emp}".
Redacta un correo interno completamente realista al departamento de RRHH comunicando la decisión de extinguir el contrato de ${datos.nombreEmp} (${datos.categoria}) con efectos del ${datos.fecha}.
El motivo es ${datos.motivo}. El correo debe incluir instrucciones para tramitar el finiquito, gestionar la baja en la Seguridad Social, comunicar al SEPE la situación de desempleo y calcular los conceptos del finiquito (vacaciones pendientes: ${datos.vacaciones} días, parte proporcional de pagas: ${datos.pagasProp} €, indemnización si procede: ${datos.indemnizacion} €).
Tono profesional y respetuoso. Sin markdown. Entre 200 y 300 palabras.`,
    genDatos: () => {
      const nombres = ['Carlos Ruiz Martínez','María Sánchez López','Antonio Fernández García','Laura Gómez Pérez','José Moreno Jiménez'];
      const categorias = ['Auxiliar administrativo/a','Operario/a de almacén','Técnico/a comercial','Oficial 1ª'];
      const motivos = ['causas objetivas económicas (art. 52 ET) — reducción de ventas del 25% en los últimos tres trimestres','mutuo acuerdo entre las partes','no superación del período de prueba (art. 14 ET)','causas disciplinarias (art. 54 ET) — falta grave reiterada'];
      const antiguedad = Math.floor(Math.random()*5+1);
      const salario = (Math.random()*400+1100).toFixed(2);
      return {
        nombreEmp: nombres[Math.floor(Math.random()*nombres.length)],
        categoria: categorias[Math.floor(Math.random()*categorias.length)],
        motivo: motivos[Math.floor(Math.random()*motivos.length)],
        fecha: new Date(Date.now()+7*24*60*60*1000).toLocaleDateString('es-ES'),
        vacaciones: Math.floor(Math.random()*12+2),
        pagasProp: (parseFloat(salario)*2/12*Math.random()+50).toFixed(2),
        indemnizacion: (parseFloat(salario)*antigüedad*20/365).toFixed(2),
        salario, antiguedad,
        infoDoc: `Despido · Tramitar finiquito, baja SS y comunicación al SEPE en Nominasol`,
      };
    },
  },

  {
    id: 'factura-suministros',
    icono: '💡', label: 'Factura de suministros',
    dept: 'contabilidad',
    desc: 'El alumno debe contabilizar el gasto en Contasol (cuenta 628 Suministros / 621 Arrendamientos) y registrar el IVA soportado (472)',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la responsable de facturación de ${datos.empresa}, proveedor de suministros de "${emp}".
Redacta un correo profesional y completamente realista adjuntando la factura del servicio de ${datos.tipoSuministro} correspondiente al período ${datos.periodo}.
El correo debe incluir el resumen de consumo, el importe (base: ${datos.base} €, IVA ${datos.tipoIVA}%: ${datos.cuotaIVA} €, total: ${datos.total} €), la forma de pago (domiciliación bancaria el día ${datos.diaCargo} del mes), y cualquier aviso relevante (tarifa actualizada, lectura estimada, etc.).
Tono de empresa suministradora. Sin markdown. Entre 150 y 250 palabras.`,
    genDatos: () => {
      const suministros = [
        {tipo:'electricidad', empresa:'Endesa Energía S.A.', cuenta:'628'},
        {tipo:'agua', empresa:'Emasesa S.A.', cuenta:'628'},
        {tipo:'gas natural', empresa:'Naturgy Comercializadora S.A.', cuenta:'628'},
        {tipo:'telefonía e internet', empresa:'Vodafone España S.A.', cuenta:'628'},
        {tipo:'servicio de limpieza industrial', empresa:'Limpiezas Profesionales Sur S.L.', cuenta:'629'},
      ];
      const s = suministros[Math.floor(Math.random()*suministros.length)];
      const base = (Math.random()*350+80).toFixed(2);
      const tIVA = 21;
      const cuota = (parseFloat(base)*tIVA/100).toFixed(2);
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      return {
        tipoSuministro: s.tipo, empresa: s.empresa, cuenta: s.cuenta,
        periodo: meses[new Date().getMonth()] + ' ' + new Date().getFullYear(),
        base, tipoIVA: tIVA, cuotaIVA: cuota,
        total: (parseFloat(base)+parseFloat(cuota)).toFixed(2),
        diaCargo: Math.floor(Math.random()*10+5),
        numDoc: 'FAC-'+Math.floor(Math.random()*900000+100000),
        infoDoc: `Factura ${s.tipo} — Contabilizar en cuenta ${s.cuenta} + 472 IVA soportado en Contasol`,
      };
    },
  },

  {
    id: 'seguro-anual',
    icono: '🛡️', label: 'Contratación de seguro anual',
    dept: 'direccion',
    desc: 'El alumno debe contabilizar la prima de seguro (cuenta 625) y el gasto anticipado (cuenta 480) en Contasol si cubre ejercicios futuros',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres un/a agente de la compañía aseguradora ${datos.aseguradora}.
Redacta un correo profesional y realista dirigido a "${emp}" enviando la propuesta de renovación/contratación de la póliza de seguro ${datos.tipoSeguro} para el período ${datos.periodo}.
El correo debe incluir: número de póliza ${datos.numPoliza}, prima anual ${datos.prima} €, forma de pago (${datos.formaPago}), coberturas principales, fecha de inicio y vencimiento, y el procedimiento para formalizar la contratación.
Tono comercial-técnico de compañía aseguradora. Sin markdown. Entre 200 y 300 palabras.`,
    genDatos: () => {
      const seguros = [
        {tipo:'multirriesgo empresarial',cuenta:'625'},
        {tipo:'responsabilidad civil general',cuenta:'625'},
        {tipo:'seguro de vehículos de empresa',cuenta:'625'},
        {tipo:'seguro de accidentes del administrador',cuenta:'625'},
      ];
      const s = seguros[Math.floor(Math.random()*seguros.length)];
      const aseguradoras = ['Mapfre Empresas S.A.','Allianz Seguros S.A.','AXA Seguros Generales S.A.','Zurich Insurance PLC'];
      const formas = ['pago anual único','fraccionado semestral','fraccionado trimestral'];
      const prima = (Math.random()*1200+400).toFixed(2);
      const año = new Date().getFullYear();
      return {
        tipoSeguro: s.tipo, cuenta: s.cuenta,
        aseguradora: aseguradoras[Math.floor(Math.random()*aseguradoras.length)],
        prima,
        numPoliza: 'POL-'+Math.floor(Math.random()*9000000+1000000),
        periodo: `${año}-${año+1}`,
        formaPago: formas[Math.floor(Math.random()*formas.length)],
        infoDoc: `Póliza ${s.tipo} — Prima: ${prima} € — Contabilizar en cuenta ${s.cuenta} y 480 Gastos anticipados en Contasol`,
      };
    },
  },

  {
    id: 'seguro-trabajadores',
    icono: '🏥', label: 'Seguro privado de trabajadores',
    dept: 'rrhh',
    desc: 'El alumno debe registrar el gasto en Nominasol (retribución en especie) y contabilizarlo en Contasol (649 Otros gastos sociales)',
    software: 'Nominasol + Contasol',
    prompt: (emp, sector, datos) => `Eres un/a agente de ${datos.aseguradora}.
Redacta un correo profesional dirigido al departamento de RRHH de "${emp}" con la propuesta de seguro médico colectivo para los ${datos.numEmpleados} empleados de la empresa.
El correo debe incluir: cobertura del seguro (${datos.cobertura}), prima mensual por empleado (${datos.primaMensual} €), prima total mensual (${datos.primaTotal} €), consideración fiscal como retribución en especie exenta hasta 500€/año por empleado (art. 42.3.c LIRPF), y el procedimiento de alta de trabajadores.
Tono comercial. Sin markdown. Entre 180 y 260 palabras.`,
    genDatos: () => {
      const aseguradoras = ['Sanitas S.A. de Seguros','Adeslas SegurCaixa S.A.','Asisa Asistencia Sanitaria S.A.','DKV Seguros S.A.'];
      const coberturas = ['médica y dental','médica completa con hospitalización','médica básica ambulatoria','médica, dental y óptica'];
      const num = Math.floor(Math.random()*4+2);
      const prima = (Math.random()*30+45).toFixed(2);
      return {
        aseguradora: aseguradoras[Math.floor(Math.random()*aseguradoras.length)],
        cobertura: coberturas[Math.floor(Math.random()*coberturas.length)],
        numEmpleados: num,
        primaMensual: prima,
        primaTotal: (parseFloat(prima)*num).toFixed(2),
        infoDoc: `Seguro médico colectivo — ${num} empleados — Prima/empleado: ${prima} €/mes — Retribución en especie en Nominasol + cuenta 649 en Contasol`,
      };
    },
  },

  {
    id: 'reparacion-inmovilizado',
    icono: '🔧', label: 'Reparación de inmovilizado',
    dept: 'contabilidad',
    desc: 'El alumno debe contabilizar en Contasol: si es mantenimiento → cuenta 622; si mejora el bien → mayor valor del inmovilizado',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el responsable técnico de ${datos.empresa}, empresa de servicios de mantenimiento.
Redacta un correo profesional dirigido a "${emp}" adjuntando el presupuesto/factura de la reparación de ${datos.bien} realizada el ${datos.fecha}.
Describe brevemente la avería detectada (${datos.averia}), los trabajos realizados (${datos.trabajos}), el coste de materiales (${datos.materiales} €), mano de obra (${datos.manoObra} €), base imponible total (${datos.base} €), IVA 21% (${datos.cuotaIVA} €), total (${datos.total} €).
Indica si los trabajos son de mantenimiento ordinario o si suponen una mejora que alarga la vida útil del bien.
Sin markdown. Entre 150 y 220 palabras.`,
    genDatos: () => {
      const bienes = [
        {bien:'la carretilla elevadora',averia:'fallo en el sistema hidráulico',trabajos:'sustitución de cilindro hidráulico y revisión general'},
        {bien:'el vehículo de reparto (furgoneta)',averia:'avería en el motor — rotura de correa de distribución',trabajos:'sustitución de correa, bomba de agua y tensores'},
        {bien:'el sistema de climatización de oficinas',averia:'compresor averiado — pérdida de gas refrigerante',trabajos:'sustitución del compresor y recarga de gas'},
        {bien:'la maquinaria de almacén (transpaleta eléctrica)',averia:'fallo en el cargador de baterías',trabajos:'sustitución del módulo de carga y revisión eléctrica'},
      ];
      const b = bienes[Math.floor(Math.random()*bienes.length)];
      const mat = (Math.random()*400+150).toFixed(2);
      const mo  = (Math.random()*300+100).toFixed(2);
      const base = (parseFloat(mat)+parseFloat(mo)).toFixed(2);
      const cuota = (parseFloat(base)*0.21).toFixed(2);
      const empresas = ['Talleres Mecánicos Sánchez S.L.','Mantenimientos Industriales Sur S.L.','Reparaciones Técnicas Vega S.L.'];
      return {
        ...b,
        empresa: empresas[Math.floor(Math.random()*empresas.length)],
        fecha: new Date().toLocaleDateString('es-ES'),
        materiales: mat, manoObra: mo, base,
        cuotaIVA: cuota,
        total: (parseFloat(base)+parseFloat(cuota)).toFixed(2),
        infoDoc: `Reparación ${b.bien} — Si es mantenimiento: cuenta 622 + 472. Si es mejora: mayor valor del inmovilizado`,
      };
    },
  },

  {
    id: 'adquisicion-inmovilizado',
    icono: '🏗️', label: 'Adquisición de inmovilizado',
    dept: 'direccion',
    desc: 'El alumno debe contabilizar en Contasol: cuenta del inmovilizado (213/216/218...) al debe y proveedor (400/172) al haber. El IVA de bienes de inversión se deduce al 100%.',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la responsable comercial de ${datos.proveedor}.
Redacta un correo profesional dirigido a "${emp}" confirmando el pedido y adjuntando la factura de la ${datos.bien} adquirida.
El correo debe incluir: descripción técnica del bien (${datos.descripcion}), precio neto (${datos.base} €), IVA (${datos.tipoIVA}% = ${datos.cuotaIVA} €), total (${datos.total} €), forma de pago (${datos.formaPago}), fecha de entrega (${datos.fechaEntrega}), y recordatorio de que el IVA de bienes de inversión es deducible al 100% en la próxima declaración trimestral.
Sin markdown. Entre 180 y 260 palabras.`,
    genDatos: () => {
      const bienes = [
        {bien:'maquinaria de empaquetado',desc:'Máquina empaquetadora semiautomática modelo EP-2000, capacidad 500 uds/h, potencia 2,2 kW', cuenta:'213', vida:10},
        {bien:'furgoneta de reparto',desc:'Furgoneta Citroën Berlingo 1.5 BlueHDi 100 CV, matrícula nueva, carga útil 800 kg', cuenta:'218', vida:8},
        {bien:'mobiliario de oficina',desc:'Conjunto de mobiliario para 4 puestos: mesas, sillas ergonómicas, estanterías y armarios', cuenta:'216', vida:10},
        {bien:'equipo informático',desc:'4 ordenadores portátiles + servidor NAS + switch de red gestionable', cuenta:'217', vida:5},
        {bien:'instalación de placas solares',desc:'Instalación fotovoltaica 10 kWp para autoconsumo — 20 paneles + inversor + legalización', cuenta:'213', vida:25},
      ];
      const b = bienes[Math.floor(Math.random()*bienes.length)];
      const base = (Math.random()*8000+2000).toFixed(2);
      const tIVA = 21;
      const cuota = (parseFloat(base)*tIVA/100).toFixed(2);
      const formas = ['pago a 30 días','financiación a 36 meses sin intereses','pago contado con 2% descuento','leasing a 5 años'];
      const proveedores = ['Maquinaria Industrial del Sur S.L.','Suministros Profesionales García S.A.','Equip&Tech Andalucía S.L.','AutoVega Vehículos Industriales S.L.'];
      return {
        ...b, descripcion: b.desc, proveedor: proveedores[Math.floor(Math.random()*proveedores.length)],
        base, tipoIVA: tIVA, cuotaIVA: cuota,
        total: (parseFloat(base)+parseFloat(cuota)).toFixed(2),
        formaPago: formas[Math.floor(Math.random()*formas.length)],
        fechaEntrega: new Date(Date.now()+5*24*60*60*1000).toLocaleDateString('es-ES'),
        vidaUtil: b.vida,
        infoDoc: `Compra ${b.bien} — Cuenta ${b.cuenta} al debe + 472 IVA inversión (deducible 100%) + ${formas[0].includes('plazo')?'172 Deudas LP':'400 Proveedores'} al haber`,
      };
    },
  },

  {
    id: 'venta-inmovilizado',
    icono: '🏷️', label: 'Venta de inmovilizado',
    dept: 'direccion',
    desc: 'El alumno debe contabilizar la baja del bien, la amortización acumulada, la pérdida o beneficio de la venta (670/770) en Contasol',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la responsable administrativo/a de "${emp}".
Redacta un correo interno al departamento de Contabilidad comunicando la venta de ${datos.bien} a ${datos.comprador} por importe de ${datos.precioVenta} € (más IVA 21% = ${datos.ivaVenta} €, total ${datos.totalVenta} €).
El bien figura en contabilidad con un valor de adquisición de ${datos.valorAdq} € y una amortización acumulada de ${datos.amorAcum} €, por lo que su valor neto contable es ${datos.vnc} €.
Indica si la operación genera un beneficio o pérdida en la venta, y qué cuentas hay que utilizar (671/770 Beneficios o Pérdidas en enajenación de inmovilizado).
Sin markdown. Entre 180 y 250 palabras.`,
    genDatos: () => {
      const bienes = ['la furgoneta de reparto antigua','el ordenador principal del departamento comercial','la estantería metálica del almacén','la fotocopiadora del despacho'];
      const compradores = ['Chatarras y Metales Reciclados S.L.','Compraventa Empresarial Sánchez','un particular mediante anuncio en Wallapop','otra empresa del sector'];
      const valorAdq = (Math.random()*8000+3000).toFixed(2);
      const amorAcum  = (parseFloat(valorAdq)*0.6*(0.5+Math.random()*0.4)).toFixed(2);
      const vnc       = Math.max(0, parseFloat(valorAdq)-parseFloat(amorAcum)).toFixed(2);
      const precio    = (parseFloat(vnc)*(0.6+Math.random()*0.8)).toFixed(2);
      const iva       = (parseFloat(precio)*0.21).toFixed(2);
      const resultado = (parseFloat(precio)-parseFloat(vnc)).toFixed(2);
      return {
        bien: bienes[Math.floor(Math.random()*bienes.length)],
        comprador: compradores[Math.floor(Math.random()*compradores.length)],
        precioVenta: precio, ivaVenta: iva,
        totalVenta: (parseFloat(precio)+parseFloat(iva)).toFixed(2),
        valorAdq, amorAcum, vnc,
        resultado, esGanancia: parseFloat(resultado) >= 0,
        infoDoc: `Venta inmovilizado — VNC: ${vnc} € · Precio venta: ${precio} € · ${parseFloat(resultado)>=0?'Beneficio':'Pérdida'}: ${Math.abs(parseFloat(resultado)).toFixed(2)} € → cuenta ${parseFloat(resultado)>=0?'770':'671'}`,
      };
    },
  },

  {
    id: 'factura-rectificativa-compra',
    icono: '🔄', label: 'Factura rectificativa de compra',
    dept: 'comercial',
    desc: 'El alumno debe registrar la factura rectificativa en Factusol y contabilizar la devolución o corrección en Contasol (cuenta 608 Devoluciones de compras)',
    software: 'Factusol + Contasol',
    prompt: (emp, sector, datos) => `Eres el responsable de facturación de ${datos.proveedor}.
Redacta un correo profesional y realista adjuntando la factura rectificativa nº ${datos.numRect} que modifica la factura original nº ${datos.numOrig} de fecha ${datos.fechaOrig}.
El motivo de la rectificación es ${datos.motivo}. La factura rectificativa incluye: base imponible a rectificar: -${datos.base} €, IVA -${datos.cuotaIVA} € (${datos.tipoIVA}%), total a devolver/abonar: -${datos.total} €.
Indica el procedimiento para aplicar el abono (descuento en próxima factura o transferencia bancaria según acuerdo).
Sin markdown. Entre 150 y 220 palabras.`,
    genDatos: () => {
      const motivos = [
        'devolución de mercancía defectuosa detectada en el control de calidad',
        'error en el precio facturado — se aplicó tarifa incorrecta',
        'descuento por volumen no aplicado en la factura original (rappel acordado)',
        'mercancía no recibida incluida en la factura original',
      ];
      const base = (Math.random()*800+100).toFixed(2);
      const tIVA = [4,10,21][Math.floor(Math.random()*3)];
      const cuota = (parseFloat(base)*tIVA/100).toFixed(2);
      const proveedores = ['Agroinsumos del Sur S.L.','Distribuciones Ramos e Hijos S.L.','Suministros Vega Alta S.A.'];
      return {
        proveedor: proveedores[Math.floor(Math.random()*proveedores.length)],
        numRect: 'R-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*900+100),
        numOrig: 'F-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*9000+1000),
        fechaOrig: new Date(Date.now()-15*24*60*60*1000).toLocaleDateString('es-ES'),
        motivo: motivos[Math.floor(Math.random()*motivos.length)],
        base, tipoIVA: tIVA, cuotaIVA: cuota,
        total: (parseFloat(base)+parseFloat(cuota)).toFixed(2),
        infoDoc: `Factura rectificativa compra — Registrar en Factusol y contabilizar: 400 Proveedores (debe) / 608 Devoluciones compras + 472 IVA soportado (haber)`,
      };
    },
  },

  {
    id: 'factura-rectificativa-venta',
    icono: '🔄', label: 'Factura rectificativa de venta',
    dept: 'comercial',
    desc: 'El alumno debe emitir la factura rectificativa en Factusol y contabilizar en Contasol (cuenta 708 Devoluciones de ventas)',
    software: 'Factusol + Contasol',
    prompt: (emp, sector, datos) => `Eres el/la responsable de administración de "${emp}".
Redacta un correo profesional a ${datos.cliente} informando de la emisión de la factura rectificativa nº ${datos.numRect} que corrige la factura original nº ${datos.numOrig}.
El motivo de la rectificación es ${datos.motivo}. La factura rectificativa anula parcialmente la original: base imponible rectificada: -${datos.base} €, IVA rectificado -${datos.cuotaIVA} €, total abono: -${datos.total} €.
Indica si se abonará en la próxima factura o mediante transferencia, y adjunta instrucciones para que el cliente actualice su contabilidad.
Sin markdown. Entre 150 y 220 palabras.`,
    genDatos: () => {
      const motivos = [
        'devolución de parte del pedido por exceso de mercancía servida',
        'aplicación de rappel por volumen de compras del trimestre no incluido en la factura',
        'error en la cantidad facturada — se facturaron 50 unidades en lugar de 40',
        'descuento comercial especial acordado con posterioridad a la facturación',
      ];
      const base = (Math.random()*600+80).toFixed(2);
      const tIVA = [4,10,21][Math.floor(Math.random()*3)];
      const cuota = (parseFloat(base)*tIVA/100).toFixed(2);
      const clientes = ['Mercados Sevillanos S.A.','Distribuciones Hermanos García S.L.','Supermercados Vega S.L.'];
      return {
        cliente: clientes[Math.floor(Math.random()*clientes.length)],
        numRect: 'R-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*900+100),
        numOrig: 'FAC-'+Math.floor(Math.random()*900+100),
        fechaOrig: new Date(Date.now()-10*24*60*60*1000).toLocaleDateString('es-ES'),
        motivo: motivos[Math.floor(Math.random()*motivos.length)],
        base, tipoIVA: tIVA, cuotaIVA: cuota,
        total: (parseFloat(base)+parseFloat(cuota)).toFixed(2),
        infoDoc: `Factura rectificativa venta — Emitir en Factusol y contabilizar: 708 Devoluciones ventas + 477 IVA repercutido (debe) / 430 Clientes (haber)`,
      };
    },
  },

  /* ══════════════════════════════════════════════════════════
     BLOQUE COMERCIAL — pedidos, albaranes, impagos, reclamaciones
     ══════════════════════════════════════════════════════════ */
  {
    id: 'pedido-cliente',
    icono: '📦', label: 'Pedido de cliente',
    dept: 'comercial',
    desc: 'El alumno debe registrar el pedido en Factusol, comprobar stock y confirmar la fecha de entrega',
    software: 'Factusol',
    prompt: (emp, sector, datos) => `Eres el/la responsable de compras de ${datos.cliente}.
Redacta un correo profesional y completamente realista a "${emp}" realizando un pedido de ${datos.producto} (${datos.cantidad} unidades a ${datos.precioUnit} € la unidad, total estimado ${datos.totalEstimado} €).
Menciona las condiciones pactadas (descuento ${datos.descuento}%, entrega en ${datos.plazoEntrega} días, forma de pago ${datos.formaPago}), la dirección de entrega, y pide confirmación de disponibilidad y fecha exacta de entrega.
Tono profesional. Sin markdown. Entre 150 y 220 palabras.`,
    genDatos: () => {
      const productos = ['naranjas Navel calibre 3','cajas de caqui Rojo Brillante','aceitunas manzanilla en rama','pimientos del piquillo conserva','espárragos verdes frescos'];
      const clientes = ['Mercados Sevillanos S.A.','Frutería Hermanos García','Supermercados Costa del Sol S.L.','Exportaciones Bética S.A.','Almacenes del Sur S.A.'];
      const producto = productos[Math.floor(Math.random()*productos.length)];
      const cantidad = Math.floor(Math.random()*200+50);
      const precio   = (Math.random()*8+2).toFixed(2);
      const dto      = [0,2,3,5][Math.floor(Math.random()*4)];
      const totalEst = (cantidad * parseFloat(precio) * (1-dto/100)).toFixed(2);
      return {
        cliente: clientes[Math.floor(Math.random()*clientes.length)],
        producto, cantidad, precioUnit: precio, descuento: dto,
        totalEstimado: totalEst,
        plazoEntrega: [3,5,7][Math.floor(Math.random()*3)],
        formaPago: ['30 días','60 días','transferencia a 30 días'][Math.floor(Math.random()*3)],
        infoDoc: `Pedido de ${cantidad} ud. de ${producto} — Registrar en Factusol y confirmar disponibilidad`,
      };
    },
  },

  {
    id: 'albaran-entrega',
    icono: '🚚', label: 'Albarán de entrega',
    dept: 'comercial',
    desc: 'El alumno debe registrar el albarán en Factusol y convertirlo en factura cuando proceda',
    software: 'Factusol',
    prompt: (emp, sector, datos) => `Eres el/la responsable de logística de "${emp}".
Redacta un correo profesional a ${datos.cliente} adjuntando el albarán nº ${datos.numAlbaran} correspondiente a la entrega del pedido nº ${datos.numPedido}.
El correo debe detallar la mercancía entregada (${datos.descripcion}), indicar que el albarán debe ser firmado y devuelto en 48 horas como conformidad de recepción, y aclarar que la factura se emitirá al cierre del mes o tras la confirmación del albarán.
Menciona que cualquier incidencia en la mercancía debe notificarse antes de la firma. Sin markdown. Entre 130 y 200 palabras.`,
    genDatos: () => {
      const descripciones = [
        '500 kg de naranjas Navel en cajas de 15 kg — lote AN2025-44',
        '200 cajas de caqui Rojo Brillante 6 kg — calibre 70-80 mm',
        '80 kg de aceitunas manzanilla a granel — partida AM-2025-11',
        '150 bandejas de pimientos del piquillo — referencia PP-300G',
      ];
      const clientes = ['Mercados Sevillanos S.A.','Frutería Hermanos García','Supermercados Costa del Sol S.L.','Exportaciones Bética S.A.'];
      return {
        cliente: clientes[Math.floor(Math.random()*clientes.length)],
        numAlbaran: 'ALB-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*900+100),
        numPedido:  'PED-'+Math.floor(Math.random()*9000+1000),
        descripcion: descripciones[Math.floor(Math.random()*descripciones.length)],
        infoDoc: 'Albarán de entrega — Registrar en Factusol y convertir a factura al cierre del mes',
      };
    },
  },

  {
    id: 'impago-cliente',
    icono: '⚠️', label: 'Impago de cliente',
    dept: 'comercial',
    desc: 'El alumno debe registrar el saldo vencido en Contasol (cuenta 436 Clientes de dudoso cobro) y valorar provisión',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la responsable de administración de "${emp}".
Redacta un correo de reclamación de pago formal y profesional a ${datos.cliente} por la factura nº ${datos.numFac} de fecha ${datos.fechaFac} por importe de ${datos.importe} €, cuyo vencimiento era el ${datos.vencimiento} y que lleva ${datos.diasVencida} días impagada.
El correo debe: recordar el importe y la factura, indicar que se ha intentado contacto previo sin éxito, exigir el pago en un plazo máximo de ${datos.plazoFinal} días hábiles, advertir que superado ese plazo se iniciará la reclamación judicial o se cederá la deuda a una entidad de recobro, y solicitar confirmación de recepción.
Tono firme pero profesional. Sin markdown. Entre 180 y 260 palabras.`,
    genDatos: () => {
      const clientes = ['Distribuciones Pérez e Hijos S.L.','Supermercados Costa del Sol S.L.','Almacenes Torres S.A.','Frutería Hermanos García'];
      const importe  = (Math.random()*3000+500).toFixed(2);
      const diasVenc = Math.floor(Math.random()*45+15);
      const fechaFac = new Date(Date.now()-(diasVenc+30)*24*60*60*1000).toLocaleDateString('es-ES');
      const vencDate = new Date(Date.now()-diasVenc*24*60*60*1000).toLocaleDateString('es-ES');
      return {
        cliente: clientes[Math.floor(Math.random()*clientes.length)],
        numFac: 'FAC-'+Math.floor(Math.random()*900+100),
        fechaFac, vencimiento: vencDate, diasVencida: diasVenc,
        importe, plazoFinal: [5,7,10][Math.floor(Math.random()*3)],
        infoDoc: `Impago ${importe} € — Trasladar a cta. 436 Clientes dudoso cobro y valorar provisión insolvencias (cta. 694) en Contasol`,
      };
    },
  },

  {
    id: 'reclamacion-proveedor',
    icono: '📮', label: 'Reclamación a proveedor',
    dept: 'comercial',
    desc: 'El alumno debe gestionar la incidencia, emitir reclamación formal y registrar la devolución o descuento en Factusol',
    software: 'Factusol',
    prompt: (emp, sector, datos) => `Eres el/la responsable de compras de "${emp}".
Redacta un correo formal de reclamación a ${datos.proveedor} por la incidencia detectada en el pedido nº ${datos.numPedido}: ${datos.incidencia}.
El correo debe: describir detalladamente el problema con datos concretos (lote, cantidad afectada, fecha de entrega), exigir una solución en el plazo de ${datos.plazo} días (reposición, abono o descuento en próxima factura), indicar que la mercancía defectuosa queda retenida a disposición del proveedor, y advertir que si no hay respuesta se recurrirá a los mecanismos legales de protección al comprador entre empresas.
Sin markdown. Entre 180 y 260 palabras.`,
    genDatos: () => {
      const proveedores = ['Agroinsumos del Sur S.L.','Packaging Andaluz S.L.','Transportes Guadalquivir S.L.','Suministros Vega Alta S.A.'];
      const incidencias = [
        'mercancía recibida con 3 días de retraso sobre la fecha pactada, causando pérdida de un cliente',
        'producto entregado con calibre incorrecto — se pidió calibre 70-80 mm y se recibió 55-65 mm',
        'rotura de envases en el 30% del lote por embalaje deficiente, mercancía no apta para la venta',
        'facturación incorrecta — se cobraron 200 cajas pero solo se entregaron 160',
      ];
      return {
        proveedor: proveedores[Math.floor(Math.random()*proveedores.length)],
        numPedido: 'PED-'+Math.floor(Math.random()*9000+1000),
        incidencia: incidencias[Math.floor(Math.random()*incidencias.length)],
        plazo: [3,5,7][Math.floor(Math.random()*3)],
        infoDoc: 'Reclamación a proveedor — Gestionar devolución o factura rectificativa en Factusol',
      };
    },
  },

  /* ══════════════════════════════════════════════════════════
     BLOQUE CONTABILIDAD — amortización, periodificación, cierre, provisiones
     ══════════════════════════════════════════════════════════ */
  {
    id: 'amortizacion-anual',
    icono: '📉', label: 'Dotación de amortización anual',
    dept: 'contabilidad',
    desc: 'El alumno debe calcular la amortización y contabilizar el asiento (681/682 Amortización / 281/282 Amortización acumulada) en Contasol',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la responsable de contabilidad de "${emp}".
Redacta un memorándum interno al departamento de contabilidad indicando que es necesario registrar la dotación de amortización del ejercicio ${datos.ejercicio}.
El memorándum debe incluir: listado de bienes a amortizar (${datos.bien1}: valor ${datos.valor1} €, vida útil ${datos.vida1} años, cuota lineal ${datos.cuota1} €/año — ${datos.bien2}: valor ${datos.valor2} €, vida útil ${datos.vida2} años, cuota ${datos.cuota2} €/año), el asiento contable que hay que realizar (682 Amortización inmovilizado material al debe / 282 Amortización acumulada al haber), y la fecha límite para registrarlo antes del cierre del ejercicio.
Sin markdown. Entre 160 y 230 palabras.`,
    genDatos: () => {
      const bienes1 = [{n:'Furgoneta de reparto',cta:'222',v:15000,vida:5},{n:'Maquinaria de almacén',cta:'221',v:12000,vida:8},{n:'Instalaciones en local',cta:'211',v:8000,vida:10}];
      const bienes2 = [{n:'Ordenadores y equipos informáticos',cta:'227',v:3200,vida:4},{n:'Mobiliario de oficina',cta:'226',v:2400,vida:8},{n:'Herramientas de taller',cta:'223',v:1800,vida:6}];
      const b1 = bienes1[Math.floor(Math.random()*bienes1.length)];
      const b2 = bienes2[Math.floor(Math.random()*bienes2.length)];
      return {
        ejercicio: new Date().getFullYear(),
        bien1: b1.n, valor1: b1.v, vida1: b1.vida, cuota1: (b1.v/b1.vida).toFixed(2),
        bien2: b2.n, valor2: b2.v, vida2: b2.vida, cuota2: (b2.v/b2.vida).toFixed(2),
        infoDoc: `Amortización anual — Asiento: 682 Amortización (debe) / 282 Amortización acumulada (haber) en Contasol`,
      };
    },
  },

  {
    id: 'periodificacion-gasto',
    icono: '🗓️', label: 'Periodificación de gasto anticipado',
    dept: 'contabilidad',
    desc: 'El alumno debe registrar la periodificación en Contasol (cuenta 480 Gastos anticipados) para imputar el gasto al ejercicio correcto',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la asesor/a contable externo/a de "${emp}".
Redacta un correo técnico al departamento de contabilidad explicando que la factura de ${datos.concepto} por importe de ${datos.totalFac} €, pagada el ${datos.fechaPago} y que cubre el período ${datos.periodoCubre}, debe periodificarse porque parte del gasto corresponde al ejercicio siguiente.
Explica el cálculo: de los ${datos.mesesTotal} meses del contrato, ${datos.mesesEjercicio} meses corresponden a este ejercicio (${datos.importeEjercicio} €) y ${datos.mesesSiguiente} al siguiente (${datos.importeSiguiente} €). Indica el asiento de periodificación al cierre (480 Gastos anticipados al debe / cuenta de gasto al haber) y el asiento de reversión al inicio del ejercicio siguiente.
Sin markdown. Entre 180 y 260 palabras.`,
    genDatos: () => {
      const conceptos = [
        {c:'alquiler del local comercial',cta:'621'},
        {c:'prima del seguro multirriesgo empresarial',cta:'625'},
        {c:'suscripción anual de software de gestión',cta:'628'},
        {c:'publicidad en plataformas digitales (contrato anual)',cta:'627'},
      ];
      const con = conceptos[Math.floor(Math.random()*conceptos.length)];
      const mesesTotal = 12;
      const mesesSig   = Math.floor(Math.random()*5+1);
      const mesesEj    = mesesTotal - mesesSig;
      const total      = (Math.random()*2000+600).toFixed(2);
      const impEj      = (parseFloat(total)*mesesEj/12).toFixed(2);
      const impSig     = (parseFloat(total)-parseFloat(impEj)).toFixed(2);
      return {
        concepto: con.c, cta: con.cta,
        totalFac: total,
        fechaPago: new Date().toLocaleDateString('es-ES'),
        periodoCubre: `${new Date().getMonth()>5?'julio':'enero'} ${new Date().getFullYear()} – junio ${new Date().getFullYear()+1}`,
        mesesTotal, mesesEjercicio: mesesEj, mesesSiguiente: mesesSig,
        importeEjercicio: impEj, importeSiguiente: impSig,
        infoDoc: `Periodificación — 480 Gastos anticipados ${impSig} € (debe) / ${con.cta} (haber) al cierre. Revertir al 1 enero siguiente.`,
      };
    },
  },

  {
    id: 'provision-insolvencia',
    icono: '🔒', label: 'Dotación de provisión por insolvencia',
    dept: 'contabilidad',
    desc: 'El alumno debe contabilizar la provisión (cuenta 694 Pérdidas por deterioro de créditos) y la reversión si cobra en Contasol',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la responsable de contabilidad de "${emp}".
Redacta un informe interno al director/a financiero/a comunicando que el crédito de ${datos.importe} € que mantenemos contra ${datos.deudor} (factura ${datos.numFac}, vencida hace ${datos.diasVencida} días) debe dotarse como deterioro de valor de créditos por insolvencias.
El informe debe incluir: motivo de la dotación (situación concursal del deudor / impago prolongado sin respuesta), asiento contable a registrar (694 Pérdidas por deterioro de créditos comerciales al debe / 490 Deterioro de valor de créditos por operaciones comerciales al haber por ${datos.importe} €), impacto en el resultado del ejercicio, y el procedimiento a seguir si finalmente se cobra (reversión: 490 al debe / 794 al haber).
Sin markdown. Entre 180 y 250 palabras.`,
    genDatos: () => {
      const deudores = ['Distribuciones Pérez e Hijos S.L.','Supermercados Costa del Sol S.L.','Almacenes Torres S.A.','Frutería Hermanos García'];
      const importe  = (Math.random()*4000+800).toFixed(2);
      const dias     = Math.floor(Math.random()*120+90);
      return {
        deudor: deudores[Math.floor(Math.random()*deudores.length)],
        importe,
        numFac: 'FAC-'+Math.floor(Math.random()*900+100),
        diasVencida: dias,
        infoDoc: `Dotación deterioro crédito ${importe} € — 694 (debe) / 490 (haber). Reversión si cobra: 490 (debe) / 794 (haber)`,
      };
    },
  },

  {
    id: 'cierre-contable',
    icono: '📒', label: 'Cierre contable del ejercicio',
    dept: 'contabilidad',
    desc: 'El alumno debe realizar el asiento de regularización (129) y cierre en Contasol, calculando el resultado del ejercicio',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la asesor/a contable de "${emp}".
Redacta un correo técnico al departamento de contabilidad indicando los pasos para realizar el cierre contable del ejercicio ${datos.ejercicio}.
El correo debe explicar: 1) Asiento de regularización — saldar todas las cuentas de gastos (grupos 6) e ingresos (grupos 7) contra la cuenta 129 Resultado del ejercicio; el resultado provisional es ${datos.resultado > 0 ? 'un beneficio' : 'una pérdida'} de ${Math.abs(datos.resultado).toFixed(2)} €. 2) Asiento de cierre — saldar todos los saldos de las cuentas de activo, pasivo y patrimonio neto contra una cuenta de cierre. 3) Advertir de que antes del cierre deben estar registradas todas las amortizaciones, periodificaciones y provisiones. 4) Indicar el plazo para depositar las cuentas anuales en el Registro Mercantil (6 meses desde el cierre del ejercicio).
Sin markdown. Entre 200 y 280 palabras.`,
    genDatos: () => {
      const ingresos = (Math.random()*80000+30000).toFixed(2);
      const gastos   = (Math.random()*70000+25000).toFixed(2);
      const resultado = parseFloat(ingresos) - parseFloat(gastos);
      return {
        ejercicio: new Date().getFullYear(),
        ingresos, gastos, resultado,
        infoDoc: `Cierre ejercicio ${new Date().getFullYear()} — Regularización: saldar ctas. 6 y 7 contra 129. Resultado: ${resultado>=0?'Beneficio':'Pérdida'} ${Math.abs(resultado).toFixed(2)} €`,
      };
    },
  },

  /* ══════════════════════════════════════════════════════════
     BLOQUE RRHH — excedencia, maternidad, horas extra, vacaciones, ERE
     ══════════════════════════════════════════════════════════ */
  {
    id: 'maternidad-paternidad',
    icono: '👶', label: 'Permiso de maternidad / paternidad',
    dept: 'rrhh',
    desc: 'El alumno debe tramitar la suspensión del contrato, la solicitud de prestación al INSS y los ajustes en Nominasol',
    software: 'Nominasol + TGSS',
    prompt: (emp, sector, datos) => `Eres ${datos.nombreEmp}, trabajador/a de "${emp}" en el departamento de ${datos.dept}.
Redacta un correo completamente humano y natural al departamento de RRHH comunicando que ${datos.tipo === 'maternidad' ? 'vas a dar a luz próximamente' : 'acabas de ser padre/madre'} y que ${datos.tipo === 'maternidad' ? 'el parto está previsto para el '+datos.fechaParto : 'el nacimiento se produjo el '+datos.fechaNacimiento}.
Solicita información sobre: duración del permiso (${datos.semanas} semanas), si el salario lo cubre el INSS o la empresa, cómo se tramita la solicitud, si puedes disfrutar las 6 semanas obligatorias a continuación del parto y el resto de forma flexible, y cómo afectará a tus vacaciones y antigüedad.
Tono natural y personal. Sin markdown. Entre 130 y 200 palabras.`,
    genDatos: () => {
      const nombres = ['María García Ruiz','Laura Sánchez Torres','Ana López Vega','Carmen Molina Reyes','Pablo Jiménez Mora','Sergio Romero Alba'];
      const depts   = ['administración','comercial','almacén','RRHH'];
      const tipo    = Math.random()>0.5 ? 'maternidad' : 'paternidad';
      const semanas = tipo === 'maternidad' ? 16 : 16;
      const fecha   = new Date(Date.now()+(Math.random()*60+10)*24*60*60*1000).toLocaleDateString('es-ES');
      return {
        nombreEmp: nombres[Math.floor(Math.random()*nombres.length)],
        dept: depts[Math.floor(Math.random()*depts.length)],
        tipo, semanas, fechaParto: fecha, fechaNacimiento: fecha,
        infoDoc: `Permiso ${tipo} ${semanas} semanas — Suspensión contrato + solicitud prestación INSS + ajuste Nominasol`,
      };
    },
  },

  {
    id: 'excedencia-voluntaria',
    icono: '⏸️', label: 'Solicitud de excedencia voluntaria',
    dept: 'rrhh',
    desc: 'El alumno debe tramitar la baja en la SS, suspender el contrato y anotar la reserva de puesto en Nominasol',
    software: 'Nominasol',
    prompt: (emp, sector, datos) => `Eres ${datos.nombreEmp}, trabajador/a de "${emp}" con ${datos.antiguedad} años de antigüedad.
Redacta un correo formal al departamento de RRHH solicitando una excedencia voluntaria de ${datos.duracion} meses por motivos personales (${datos.motivo}), con inicio el ${datos.fechaInicio}.
El correo debe mencionar: que cumples los requisitos de antigüedad mínima de un año (art. 46.2 ET), el período solicitado, si tienes intención de reincorporarte al finalizar o si lo decidirás durante la excedencia, que solicitas que se te informe de los efectos sobre tu cotización a la SS y la reserva de puesto, y que estás dispuesto/a a colaborar en la transición de tus tareas.
Sin markdown. Entre 150 y 220 palabras.`,
    genDatos: () => {
      const nombres   = ['Carlos Ruiz Martínez','María Sánchez López','Antonio Fernández García','Laura Gómez Pérez'];
      const motivos   = ['cuidado de un familiar de primer grado con enfermedad grave','proyecto personal emprendedor','formación académica en el extranjero (máster)','cuidado de hijo/a menor de 3 años'];
      const duracion  = [3,6,12,24][Math.floor(Math.random()*4)];
      const antiguedad = Math.floor(Math.random()*8+2);
      const inicio    = new Date(Date.now()+30*24*60*60*1000).toLocaleDateString('es-ES');
      return {
        nombreEmp: nombres[Math.floor(Math.random()*nombres.length)],
        antiguedad, duracion,
        motivo: motivos[Math.floor(Math.random()*motivos.length)],
        fechaInicio: inicio,
        infoDoc: `Excedencia voluntaria ${duracion} meses — Baja en SS, suspensión contrato, reserva de puesto en Nominasol`,
      };
    },
  },

  {
    id: 'horas-extra',
    icono: '⏱️', label: 'Registro y compensación de horas extra',
    dept: 'rrhh',
    desc: 'El alumno debe registrar las horas extra en Nominasol, aplicar el recargo correspondiente y comprobar el límite anual de 80 horas (ET)',
    software: 'Nominasol',
    prompt: (emp, sector, datos) => `Eres el/la jefe/a de ${datos.dept} de "${emp}".
Redacta un correo interno al departamento de RRHH comunicando que ${datos.nombreEmp} ha realizado ${datos.horasExt} horas extraordinarias durante el mes de ${datos.mes} por ${datos.motivo}.
El correo debe solicitar: que se añadan a la nómina del mes (a ${datos.tipoCompensacion === 'económica' ? `${datos.recargo}% sobre el precio de la hora ordinaria` : 'compensar con descanso equivalente en los 4 meses siguientes'}), que se compruebe que no se supera el límite de 80 horas anuales del artículo 35 ET (hasta ahora lleva ${datos.horasAcumuladas} horas este año), y que se emita el registro individual de jornada.
Sin markdown. Entre 140 y 200 palabras.`,
    genDatos: () => {
      const nombres  = ['Carlos Ruiz Martínez','María Sánchez López','Antonio Fernández García','Laura Gómez Pérez','José Moreno Jiménez'];
      const depts    = ['almacén','comercial','administración','producción'];
      const motivos  = ['cierre de inventario trimestral','pico de pedidos por campaña de Navidad','suplencia por baja de compañero/a','feria sectorial con jornada extendida'];
      const meses    = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const horas    = Math.floor(Math.random()*8+4);
      const acum     = Math.floor(Math.random()*40+horas);
      const tipo     = Math.random()>0.5 ? 'económica' : 'descanso';
      return {
        nombreEmp: nombres[Math.floor(Math.random()*nombres.length)],
        dept: depts[Math.floor(Math.random()*depts.length)],
        horasExt: horas, horasAcumuladas: acum,
        mes: meses[new Date().getMonth()],
        motivo: motivos[Math.floor(Math.random()*motivos.length)],
        tipoCompensacion: tipo, recargo: tipo==='económica' ? 25 : 0,
        infoDoc: `Horas extra — ${horas}h en ${meses[new Date().getMonth()]} (total año: ${acum}h / 80h máx.) — Registrar en Nominasol`,
      };
    },
  },

  {
    id: 'ere-erte',
    icono: '🚨', label: 'Notificación de ERTE por causas económicas',
    dept: 'rrhh',
    desc: 'El alumno debe tramitar la suspensión de contratos en Nominasol, comunicar al SEPE y gestionar la reducción de jornada',
    software: 'Nominasol + SEPE',
    prompt: (emp, sector, datos) => `Eres el/la asesor/a laboral externo/a de "${emp}".
Redacta un correo formal a la dirección y al departamento de RRHH informando de la decisión de iniciar un ERTE por causas económicas (art. 47 ET) que afectará a ${datos.numTrabajadores} trabajadores/as del departamento de ${datos.dept}.
El correo debe incluir: causa justificativa (${datos.causa}), medida adoptada (${datos.medida}), período de afectación (${datos.fechaInicio} al ${datos.fechaFin}), obligaciones inmediatas de la empresa (comunicación a la representación legal de los trabajadores, apertura período de consultas de ${datos.diasConsultas} días, notificación a la Autoridad Laboral), y efectos en la cotización y prestaciones de los trabajadores afectados.
Sin markdown. Entre 220 y 300 palabras.`,
    genDatos: () => {
      const causas  = ['reducción del 30% en la facturación durante los últimos tres trimestres consecutivos','pérdidas económicas actuales previstas para el presente ejercicio','disminución persistente del nivel de ventas durante dos trimestres'];
      const medidas = ['suspensión temporal de contratos (100% de la jornada)','reducción de jornada entre el 10% y el 70% para todos los trabajadores afectados'];
      const depts   = ['almacén y logística','departamento comercial','administración'];
      const numT    = Math.floor(Math.random()*5+2);
      const inicio  = new Date(Date.now()+15*24*60*60*1000).toLocaleDateString('es-ES');
      const fin     = new Date(Date.now()+105*24*60*60*1000).toLocaleDateString('es-ES');
      return {
        numTrabajadores: numT,
        dept: depts[Math.floor(Math.random()*depts.length)],
        causa: causas[Math.floor(Math.random()*causas.length)],
        medida: medidas[Math.floor(Math.random()*medidas.length)],
        fechaInicio: inicio, fechaFin: fin,
        diasConsultas: 15,
        infoDoc: `ERTE ${numT} trabajadores — Tramitar en Nominasol + comunicación SEPE + Autoridad Laboral`,
      };
    },
  },

  /* ══════════════════════════════════════════════════════════
     BLOQUE FISCAL — Mod. 111, 200, 347, 130, IVA intracomunitario
     ══════════════════════════════════════════════════════════ */
  {
    id: 'mod111-retenciones',
    icono: '📋', label: 'Modelo 111 — Retenciones IRPF',
    dept: 'fiscal',
    desc: 'El alumno debe cumplimentar el Mod. 111 de retenciones e ingresos a cuenta del trimestre en la Sede Electrónica de la AEAT',
    software: 'AEAT Sede + Contasol',
    prompt: (emp, sector, datos) => `Eres el/la asesor/a fiscal de "${emp}".
Redacta un correo al departamento de administración recordando que el plazo para presentar el Modelo 111 correspondiente al ${datos.trimestre}T del ejercicio ${datos.ejercicio} finaliza el ${datos.plazo}.
El correo debe explicar: qué es el Modelo 111 (retenciones e ingresos a cuenta sobre rendimientos del trabajo y actividades profesionales), qué datos hay que recopilar (número de trabajadores: ${datos.numTrab}, base de retenciones de nóminas del trimestre: ${datos.baseNominas} €, retenciones practicadas: ${datos.retenciones} €, retenciones sobre facturas de profesionales: ${datos.retProf} €), el resultado de la liquidación (a ingresar: ${datos.resultado} €), y cómo presentarlo telemáticamente en la Sede Electrónica.
Sin markdown. Entre 180 y 250 palabras.`,
    genDatos: () => {
      const trim    = Math.floor((new Date().getMonth()/3))+1;
      const plazos  = ['20 de abril','20 de julio','20 de octubre','20 de enero'];
      const numTrab = Math.floor(Math.random()*6+2);
      const base    = (numTrab*(Math.random()*1200+1000)).toFixed(2);
      const ret     = (parseFloat(base)*0.15).toFixed(2);
      const retProf = (Math.random()*300+50).toFixed(2);
      return {
        trimestre: trim, ejercicio: new Date().getFullYear(),
        plazo: plazos[trim-1] || '20 de enero',
        numTrab, baseNominas: base, retenciones: ret, retProf,
        resultado: (parseFloat(ret)+parseFloat(retProf)).toFixed(2),
        infoDoc: `Mod. 111 — ${trim}T ${new Date().getFullYear()} · Retenciones nóminas: ${ret} € + profesionales: ${retProf} € · A ingresar: ${(parseFloat(ret)+parseFloat(retProf)).toFixed(2)} €`,
      };
    },
  },

  {
    id: 'mod347-operaciones',
    icono: '📊', label: 'Modelo 347 — Operaciones con terceros',
    dept: 'fiscal',
    desc: 'El alumno debe identificar los clientes y proveedores con operaciones superiores a 3.005,06 € anuales y presentar el Mod. 347',
    software: 'AEAT Sede + Contasol',
    prompt: (emp, sector, datos) => `Eres el/la asesor/a fiscal de "${emp}".
Redacta un correo al departamento de contabilidad recordando la obligación anual de presentar el Modelo 347 (declaración anual de operaciones con terceros) antes del ${datos.plazo}.
El correo debe explicar: qué operaciones deben declararse (todas las realizadas con un mismo tercero que superen 3.005,06 € en el año, tanto clientes como proveedores), los datos que necesitas recopilar de Contasol (listado de saldos acumulados por cliente/proveedor del ejercicio ${datos.ejercicio}), que este año hay ${datos.numTerceros} terceros que superan el umbral (volumen total declarable: ${datos.volumenTotal} €), y el procedimiento para presentarlo en la Sede Electrónica de la AEAT.
Sin markdown. Entre 170 y 240 palabras.`,
    genDatos: () => {
      const num  = Math.floor(Math.random()*8+3);
      const vol  = (num*(Math.random()*8000+4000)).toFixed(2);
      return {
        ejercicio: new Date().getFullYear()-1,
        plazo: '28 de febrero',
        numTerceros: num, volumenTotal: vol,
        infoDoc: `Mod. 347 — ${num} terceros con operaciones > 3.005,06 € · Volumen: ${vol} € · Plazo: 28 febrero`,
      };
    },
  },

  {
    id: 'mod200-sociedades',
    icono: '🏢', label: 'Impuesto sobre Sociedades — Mod. 200',
    dept: 'fiscal',
    desc: 'El alumno debe calcular la base imponible, aplicar el tipo impositivo (25% / 15% nuevas empresas) y presentar el Mod. 200 en Contasol y Sede AEAT',
    software: 'AEAT Sede + Contasol',
    prompt: (emp, sector, datos) => `Eres el/la asesor/a fiscal de "${emp}".
Redacta un informe técnico al director/a comunicando el resultado del Impuesto sobre Sociedades del ejercicio ${datos.ejercicio}.
El informe debe incluir: resultado contable antes de impuestos ${datos.resultadoContable} €, ajustes extracontables (${datos.ajuste !== '0.00' ? datos.tipoAjuste+': '+datos.ajuste+' €' : 'no hay ajustes este ejercicio'}), base imponible ${datos.baseImponible} €, tipo impositivo aplicado ${datos.tipo}% ${datos.esNueva ? '(empresa de nueva creación, primeros dos períodos con BI positiva)' : '(tipo general)'}, cuota íntegra ${datos.cuotaIntegra} €, deducción por I+D aplicada ${datos.deduccion} €, cuota líquida ${datos.cuotaLiquida} €, pagos fraccionados ya realizados (Mod. 202): ${datos.pagosFracc} €, resultado final ${parseFloat(datos.cuotaLiquida)-parseFloat(datos.pagosFracc) >= 0 ? 'a ingresar' : 'a devolver'}: ${Math.abs(parseFloat(datos.cuotaLiquida)-parseFloat(datos.pagosFracc)).toFixed(2)} €.
Sin markdown. Entre 200 y 280 palabras.`,
    genDatos: () => {
      const rc     = (Math.random()*40000+5000).toFixed(2);
      const ajuste = Math.random()>0.5 ? (Math.random()*2000+500).toFixed(2) : '0.00';
      const tipoAj = ['multa no deducible','exceso dotación amortización','gasto no justificado documentalmente'][Math.floor(Math.random()*3)];
      const bi     = (parseFloat(rc)+parseFloat(ajuste)).toFixed(2);
      const esNueva = Math.random()>0.6;
      const tipo   = esNueva ? 15 : 25;
      const ci     = (parseFloat(bi)*tipo/100).toFixed(2);
      const ded    = Math.random()>0.7 ? (Math.random()*500+100).toFixed(2) : '0.00';
      const cl     = Math.max(0, parseFloat(ci)-parseFloat(ded)).toFixed(2);
      const pf     = (parseFloat(cl)*0.6*(0.5+Math.random()*0.5)).toFixed(2);
      return {
        ejercicio: new Date().getFullYear()-1,
        resultadoContable: rc, ajuste, tipoAjuste: tipoAj,
        baseImponible: bi, tipo, esNueva,
        cuotaIntegra: ci, deduccion: ded,
        cuotaLiquida: cl, pagosFracc: pf,
        infoDoc: `IS Mod.200 — BI: ${bi} € · Tipo: ${tipo}% · Cuota: ${cl} € · Pagos a cuenta: ${pf} € · Resultado: ${(parseFloat(cl)-parseFloat(pf)).toFixed(2)} €`,
      };
    },
  },

  {
    id: 'iva-intracomunitario',
    icono: '🇪🇺', label: 'Operación intracomunitaria',
    dept: 'fiscal',
    desc: 'El alumno debe registrar la operación en el Registro de Operadores Intracomunitarios (ROI), aplicar inversión del sujeto pasivo y declarar en Mod. 349 y 303',
    software: 'AEAT Sede + Contasol',
    prompt: (emp, sector, datos) => `Eres ${datos.empresa}, empresa ${datos.pais} con NIF-IVA ${datos.nifIVA}.
Redacta un correo comercial en español completamente realista a "${emp}" realizando una oferta de ${datos.producto} por importe de ${datos.importe} € (sin IVA, operación intracomunitaria exenta).
El correo debe mencionar: que ambas empresas están inscritas en el ROI, que la operación está exenta de IVA en origen (art. 25 LIVA) pero sujeta a inversión del sujeto pasivo en destino, las condiciones de entrega (Incoterm ${datos.incoterm}, plazo ${datos.plazo} días), y que se necesita el NIF-IVA del comprador para emitir la factura correctamente.
Sin markdown. Entre 160 y 230 palabras.`,
    genDatos: () => {
      const paises   = [{p:'francesa',e:'Biorythme Distributeur SARL',nif:'FR23456789012'},{p:'portuguesa',e:'Distribuições Alentejo Lda.',nif:'PT234567890'},{p:'alemana',e:'Frische Produkte GmbH',nif:'DE234567891'}];
      const productos = ['aceitunas de mesa en conserva (partida 2005.70)','aceite de oliva virgen extra ecológico (partida 1509.10)','naranjas frescas calibre 3 (partida 0805.10)'];
      const incoterms = ['EXW','DAP','FCA'];
      const p = paises[Math.floor(Math.random()*paises.length)];
      return {
        empresa: p.e, pais: p.p, nifIVA: p.nif,
        producto: productos[Math.floor(Math.random()*productos.length)],
        importe: (Math.random()*8000+2000).toFixed(2),
        incoterm: incoterms[Math.floor(Math.random()*incoterms.length)],
        plazo: [7,10,14][Math.floor(Math.random()*3)],
        infoDoc: `Op. intracomunitaria — Verificar ROI, inversión sujeto pasivo, declarar en Mod. 349 y Mod. 303 casilla 10/11`,
      };
    },
  },

  /* ══════════════════════════════════════════════════════════
     BLOQUE DIRECCIÓN — financiación, subvenciones, contratos mercantiles
     ══════════════════════════════════════════════════════════ */
  {
    id: 'solicitud-prestamo',
    icono: '🏦', label: 'Solicitud de préstamo bancario',
    dept: 'direccion',
    desc: 'El alumno debe evaluar las condiciones del préstamo, calcular la cuota (método francés) y contabilizar la deuda (cuenta 170/520) en Contasol',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la gestor/a de empresas de ${datos.banco}.
Redacta un correo profesional a "${emp}" respondiendo a su solicitud de financiación con la siguiente propuesta de préstamo: importe ${datos.importe} €, plazo ${datos.plazo} años, tipo de interés fijo ${datos.tipo}% TAE, cuota mensual ${datos.cuota} €, comisión de apertura ${datos.comApertura}%, garantía requerida ${datos.garantia}.
El correo debe incluir el cuadro de las 3 primeras cuotas (capital, intereses y saldo pendiente), documentación que solicita el banco (cuentas anuales, declaración IS, plan de negocio), fecha límite para formalizar ante notario, y advertencia de las consecuencias de impago.
Sin markdown. Entre 200 y 280 palabras.`,
    genDatos: () => {
      const bancos   = ['Banco Andalucía Empresas','Sabadell Negocios','BBVA Empresas','CaixaBank Pymes'];
      const importe  = Math.floor((Math.random()*40000+10000)/1000)*1000;
      const plazo    = [3,5,7][Math.floor(Math.random()*3)];
      const tipo     = (Math.random()*2+3).toFixed(2);
      const r        = parseFloat(tipo)/100/12;
      const n        = plazo*12;
      const cuota    = (importe*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)).toFixed(2);
      const garantias = ['aval personal de los socios','hipoteca sobre el local comercial','garantía SGR (Sociedad de Garantía Recíproca)'];
      return {
        banco: bancos[Math.floor(Math.random()*bancos.length)],
        importe, plazo, tipo, cuota,
        comApertura: (Math.random()*0.5+0.5).toFixed(2),
        garantia: garantias[Math.floor(Math.random()*garantias.length)],
        infoDoc: `Préstamo ${importe} € · ${plazo} años · ${tipo}% TAE · Cuota: ${cuota} €/mes — Contabilizar: 572 (debe) / 170 Deudas LP + 520 CP (haber)`,
      };
    },
  },

  {
    id: 'subvencion',
    icono: '💰', label: 'Resolución de subvención concedida',
    dept: 'direccion',
    desc: 'El alumno debe contabilizar la subvención como ingreso diferido (cuenta 130/131) y su imputación al resultado (cuenta 746) en Contasol',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres funcionario/a de la ${datos.organismo}.
Redacta una notificación oficial completamente realista a "${emp}" comunicando la resolución favorable de la subvención solicitada al amparo de ${datos.convocatoria}.
La notificación debe incluir: número de expediente ${datos.numExp}, importe concedido ${datos.importe} €, finalidad (${datos.finalidad}), condiciones (justificación de gastos antes del ${datos.plazoJustificacion}, no compatibilidad con otras ayudas al mismo fin que superen el ${datos.porcentaje}% del coste), forma de pago (${datos.formaPago}), y obligaciones de la empresa beneficiaria (mantenimiento de la actividad 3 años, comunicación de cambios).
Sin markdown. Entre 250 y 330 palabras.`,
    genDatos: () => {
      const organismos = ['Consejería de Empleo de la Junta de Andalucía','Agencia IDEA de la Junta de Andalucía','Ministerio de Industria, Comercio y Turismo','Diputación Provincial de Sevilla'];
      const convocatorias = ['las bases reguladoras de ayudas a la modernización de pymes del sector agroalimentario','el Programa de Apoyo al Emprendimiento Joven 2025','las ayudas a la digitalización de pymes (Kit Digital — Agente Digitalizador)','el Plan de Internacionalización Empresarial de Andalucía'];
      const finalidades = ['adquisición de maquinaria de procesado y envasado','implantación de sistema ERP y digitalización de procesos','contratación de primer trabajador indefinido','apertura de nuevo canal de exportación a la UE'];
      const formas = ['pago único tras justificación','pago anticipado del 50% y resto tras justificación','pago en dos tramos: 40% resolución y 60% justificación'];
      const importe = Math.floor((Math.random()*15000+3000)/500)*500;
      return {
        organismo: organismos[Math.floor(Math.random()*organismos.length)],
        convocatoria: convocatorias[Math.floor(Math.random()*convocatorias.length)],
        numExp: 'EXP-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*90000+10000),
        importe, finalidad: finalidades[Math.floor(Math.random()*finalidades.length)],
        plazoJustificacion: new Date(Date.now()+180*24*60*60*1000).toLocaleDateString('es-ES'),
        porcentaje: [75,80,100][Math.floor(Math.random()*3)],
        formaPago: formas[Math.floor(Math.random()*formas.length)],
        infoDoc: `Subvención ${importe} € — Contabilizar: 572 (debe) / 130 Subvenciones capital (haber). Imputar anualmente: 130 (debe) / 746 Subvenciones transferidas (haber)`,
      };
    },
  },

  {
    id: 'contrato-arrendamiento',
    icono: '🏠', label: 'Contrato de arrendamiento de local',
    dept: 'direccion',
    desc: 'El alumno debe registrar el gasto de alquiler (cuenta 621) e IVA soportado (cuenta 472) en Contasol, y valorar si hay fianza (cuenta 180)',
    software: 'Contasol',
    prompt: (emp, sector, datos) => `Eres el/la representante de ${datos.arrendador}, propietario del local sito en ${datos.direccion}.
Redacta un correo profesional a "${emp}" adjuntando la propuesta de contrato de arrendamiento de uso distinto de vivienda con las siguientes condiciones: superficie ${datos.superficie} m², renta mensual ${datos.renta} € más IVA ${datos.ivaAlquiler}% (total ${datos.rentaTotal} €), duración ${datos.duracion} años prorrogable, fianza ${datos.fianza} mensualidades, actualización anual según IPC, obras de acondicionamiento a cargo del arrendatario con un plazo de carencia de ${datos.carencia} meses.
El correo debe indicar la documentación necesaria para la firma (escritura de constitución, poderes, NIF), la fecha propuesta para la firma ante notario, y que el contrato deberá inscribirse en el Registro de la Propiedad.
Sin markdown. Entre 180 y 250 palabras.`,
    genDatos: () => {
      const arrendadores = ['Inmuebles Vega Alta S.L.','Patrimonios Andaluces S.A.','Gestión Inmobiliaria Cantillana S.L.','Inversiones del Guadalquivir S.A.'];
      const direcciones  = ['Calle Real, 14 (Cantillana, Sevilla)','Polígono Industrial Sur, Nave 7 (Brenes, Sevilla)','Avenida de Andalucía, 45 (La Rinconada, Sevilla)'];
      const renta  = Math.floor((Math.random()*800+400)/50)*50;
      const ivaAlq = 21;
      const rentaT = (renta*(1+ivaAlq/100)).toFixed(2);
      return {
        arrendador: arrendadores[Math.floor(Math.random()*arrendadores.length)],
        direccion:  direcciones[Math.floor(Math.random()*direcciones.length)],
        superficie: Math.floor(Math.random()*150+50),
        renta, ivaAlquiler: ivaAlq, rentaTotal: rentaT,
        duracion: [3,5,7][Math.floor(Math.random()*3)],
        fianza: [1,2][Math.floor(Math.random()*2)],
        carencia: [1,2,3][Math.floor(Math.random()*3)],
        infoDoc: `Alquiler local ${renta} €/mes + IVA — Contabilizar: 621 (debe) / 572 (haber). Fianza: 180 Fianzas constituidas (debe) / 572 (haber)`,
      };
    },
  },

  /* ══════════════════════════════════════════════════════════
     BLOQUE MERCADO INTERGRUPAL — negociación, disputas, acuerdos
     ══════════════════════════════════════════════════════════ */
  {
    id: 'negociacion-precio',
    icono: '🤝', label: 'Negociación de precio entre empresas',
    dept: 'comercial',
    desc: 'El alumno debe analizar el margen, preparar una contraoferta argumentada y registrar el acuerdo en Factusol',
    software: 'Factusol',
    prompt: (emp, sector, datos) => `Eres el/la responsable comercial de ${datos.empresaCliente}, empresa del sector ${sector} del aula de simulación.
Redacta un correo de negociación comercial completamente realista a "${emp}" solicitando una revisión del precio de ${datos.producto}.
El correo debe: mencionar el volumen de compras del último trimestre (${datos.volumen} €), argumentar que la competencia ofrece el mismo producto un ${datos.descuentoPedido}% más barato, proponer un descuento del ${datos.descuentoPropuesto}% sobre tarifa o un rappel por volumen anual a partir de ${datos.umbralRappel} €, y ofrecer a cambio mejorar las condiciones de pago (pago a ${datos.pagoOfrecido} días en lugar de ${datos.pagoActual} días).
Tono negociador pero cordial. Sin markdown. Entre 160 y 230 palabras.`,
    genDatos: () => {
      const empresas  = ['Agrícola Vega Alta S.L.','Distribuciones García S.L.','Naranjas del Sur S.L.','Cítricos Premium S.L.','Agroservicios Cantillana S.L.'];
      const productos = ['naranjas de mesa calibre 3','aceitunas manzanilla','pimiento del piquillo','aceite de oliva virgen extra'];
      const volumen   = (Math.random()*8000+3000).toFixed(2);
      const dtoComp   = Math.floor(Math.random()*8+3);
      const dtoProp   = Math.floor(dtoComp*0.7);
      const umbral    = Math.floor((Math.random()*10000+5000)/1000)*1000;
      const pagoAct   = [30,60][Math.floor(Math.random()*2)];
      const pagoOfrec = pagoAct === 30 ? 15 : 30;
      return {
        empresaCliente: empresas[Math.floor(Math.random()*empresas.length)],
        producto: productos[Math.floor(Math.random()*productos.length)],
        volumen, descuentoPedido: dtoComp, descuentoPropuesto: dtoProp,
        umbralRappel: umbral, pagoActual: pagoAct, pagoOfrecido: pagoOfrec,
        infoDoc: `Negociación precio — Analizar margen, preparar contraoferta y registrar acuerdo en Factusol`,
      };
    },
  },

  {
    id: 'disputa-mercado',
    icono: '⚡', label: 'Disputa comercial entre empresas',
    dept: 'comercial',
    desc: 'El alumno debe gestionar la reclamación, documentar la incidencia y proponer una solución que preserve la relación comercial',
    software: 'Factusol',
    prompt: (emp, sector, datos) => `Eres el/la director/a general de ${datos.empresaReclamante}, empresa del aula de simulación.
Redacta un correo formal y contundente pero profesional a "${emp}" reclamando una compensación por el incumplimiento contractual siguiente: ${datos.incidencia}.
El correo debe: describir el daño económico causado (${datos.danio} €), hacer referencia al contrato o pedido nº ${datos.numDoc} en el que se acordaron las condiciones incumplidas, proponer como solución ${datos.solucionPropuesta}, fijar un plazo de respuesta de ${datos.plazoRespuesta} días hábiles, y advertir que de no resolverse se elevará la reclamación al docente-árbitro del mercado intergrupal.
Sin markdown. Entre 180 y 250 palabras.`,
    genDatos: () => {
      const empresas  = ['Agrícola Vega Alta S.L.','Distribuciones García S.L.','Naranjas del Sur S.L.','Cítricos Premium S.L.','Agroservicios Cantillana S.L.'];
      const incidencias = [
        'retraso de 5 días en la entrega del pedido acordado, lo que nos obligó a buscar proveedor alternativo a precio superior',
        'entrega de mercancía de calidad inferior a la acordada en el contrato de suministro — calibre B en lugar de calibre A',
        'cobro de un precio superior al pactado en el pedido sin previo aviso ni justificación',
        'incumplimiento del plazo de pago de la factura vencida hace 30 días sin comunicación alguna',
      ];
      const soluciones = [
        'descuento del 10% en el próximo pedido como compensación por los daños y perjuicios causados',
        'reposición inmediata de la mercancía defectuosa con coste de transporte a cargo del proveedor',
        'abono de la diferencia de precio mediante factura rectificativa en el plazo de 5 días',
        'pago inmediato de la factura vencida con los intereses de demora correspondientes (Ley 3/2004)',
      ];
      const empresa1 = empresas[Math.floor(Math.random()*empresas.length)];
      return {
        empresaReclamante: empresa1,
        incidencia: incidencias[Math.floor(Math.random()*incidencias.length)],
        danio: (Math.random()*1500+200).toFixed(2),
        numDoc: 'PED-'+Math.floor(Math.random()*9000+1000),
        solucionPropuesta: soluciones[Math.floor(Math.random()*soluciones.length)],
        plazoRespuesta: [3,5,7][Math.floor(Math.random()*3)],
        infoDoc: `Disputa comercial — Gestionar reclamación, documentar incidencia y proponer solución en Factusol`,
      };
    },
  },

  {
    id: 'acuerdo-suministro',
    icono: '📝', label: 'Propuesta de acuerdo de suministro',
    dept: 'comercial',
    desc: 'El alumno debe analizar las condiciones, negociar los términos y registrar el contrato marco en Factusol como cliente/proveedor habitual',
    software: 'Factusol',
    prompt: (emp, sector, datos) => `Eres el/la director/a comercial de ${datos.empresaPropone}, empresa del aula de simulación.
Redacta un correo comercial completamente realista a "${emp}" proponiendo la firma de un acuerdo marco de suministro para el curso académico ${datos.curso}.
La propuesta debe incluir: producto objeto del acuerdo (${datos.producto}), volumen estimado anual (${datos.volumenAnual} €), precio fijo garantizado de ${datos.precioUnitario} € la unidad con revisión semestral según IPC, condiciones de pago ${datos.condicionesPago}, plazo de entrega garantizado de ${datos.plazoEntrega} días hábiles, penalización del ${datos.penalizacion}% por incumplimiento de plazos, y cláusula de exclusividad limitada al ${datos.exclusividad}% de las necesidades del comprador.
Sin markdown. Entre 180 y 250 palabras.`,
    genDatos: () => {
      const empresas  = ['Agrícola Vega Alta S.L.','Distribuciones García S.L.','Naranjas del Sur S.L.','Cítricos Premium S.L.','Agroservicios Cantillana S.L.'];
      const productos = ['naranjas Navel de primera calidad','aceitunas manzanilla en rama','pimiento del piquillo de la Vega','aceite de oliva virgen extra ecológico'];
      const volumen   = Math.floor((Math.random()*30000+10000)/1000)*1000;
      const precio    = (Math.random()*4+1).toFixed(2);
      const condiciones = ['pago a 30 días fecha factura','pago a 60 días con descuento del 1% por pronto pago','domiciliación bancaria el día 5 del mes siguiente'];
      const añoActual = new Date().getFullYear();
      return {
        empresaPropone: empresas[Math.floor(Math.random()*empresas.length)],
        producto: productos[Math.floor(Math.random()*productos.length)],
        curso: `${añoActual}-${añoActual+1}`,
        volumenAnual: volumen, precioUnitario: precio,
        condicionesPago: condiciones[Math.floor(Math.random()*condiciones.length)],
        plazoEntrega: [3,5,7][Math.floor(Math.random()*3)],
        penalizacion: [3,5,10][Math.floor(Math.random()*3)],
        exclusividad: [50,60,70][Math.floor(Math.random()*3)],
        infoDoc: `Acuerdo marco de suministro — Registrar como cliente/proveedor habitual en Factusol y archivar contrato`,
      };
    },
  },
];

/* ── Generar situación con IA ──────────────────────────────── */
async function generarSituacionIA(tipoId, deptDest, grupoDest, datosOverride) {
  const tipo = TIPOS_SITUACION.find(t => t.id === tipoId);
  if (!tipo) { mostrarToast('Selecciona un tipo de situación primero', 'error'); return; }

  const gen = EMPRESA_STATE.generador;
  const emp    = (EMPRESA_STATE.datos && EMPRESA_STATE.datos.nombre) ? EMPRESA_STATE.datos.nombre : 'SimulApp Empresa S.L.';
  const sector = (EMPRESA_STATE.config && EMPRESA_STATE.config.sector) ? EMPRESA_STATE.config.sector : 'agroalimentario';
  const datos  = datosOverride || tipo.genDatos();
  const deptFinal = deptDest || tipo.dept;

  // 1. Mostrar previsualización inmediatamente con el fallback
  const cuerpoInicial = generarCuerpoFallback(tipo, emp, sector, datos);
  gen.datosGenerados = {
    tipo, datos,
    cuerpo: cuerpoInicial,
    dept: deptFinal,
    grupoDest: grupoDest || '',
    remitente: datos.empresa || datos.nombreEmp || datos.banco || 'Organismo oficial',
    mejorando: true,  // indicador de que la IA está mejorando el texto
  };
  gen.vistaActiva = 'previsualizacion';
  gen.generando = false;
  renderGenerador();

  // 2. Mejorar con IA en segundo plano (sin bloquear la UI)
  try {
    const systemPrompt = `Eres un asistente especializado en generar situaciones empresariales para un simulador educativo de empresa. Tu objetivo es crear correos, notificaciones y documentos completamente realistas, indistinguibles de los reales. IMPORTANTE: Nunca uses asteriscos, markdown, ni formatos especiales. Solo texto plano con saltos de línea naturales. El contexto es una empresa del sector "${sector}" situada en Cantillana (Sevilla).`;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: tipo.prompt(emp, sector, datos) }]
      })
    });
    if (response.ok) {
      const data = await response.json();
      const cuerpoIA = data.content.map(c => c.text || '').join('').trim();
      if (cuerpoIA && gen.datosGenerados) {
        gen.datosGenerados.cuerpo = cuerpoIA;
        gen.datosGenerados.mejorando = false;
        renderGenerador();
        mostrarToast('✓ Correo mejorado con IA', 'exito');
      }
    }
  } catch(e) {
    // Sin IA, el fallback ya está visible — no pasa nada
    if (gen.datosGenerados) gen.datosGenerados.mejorando = false;
    renderGenerador();
  }
}

function generarCuerpoFallback(tipo, emp, sector, datos) {
  const hoy = new Date().toLocaleDateString('es-ES');
  const map = {

    'factura-compra': `Estimado/a equipo de ${emp},\n\nAdjunto a este correo encontrarán la factura correspondiente al mes en curso.\n\nFactura nº: ${datos.numDoc}\nFecha: ${datos.fecha}\nBase imponible: ${datos.base} €\nIVA (${datos.tipoIVA}%): ${datos.cuotaIVA} €\nTotal: ${datos.total} €\nForma de pago: ${datos.formaPago}${datos.extras ? '\n' + datos.extras : ''}\n\nPara el pago, les rogamos utilicen el IBAN: ${datos.iban}\n\nQuedamos a su disposición para cualquier consulta.\n\nAtentamente,\nDepartamento de Administración\n${datos.empresa}\n${datos.cif}`,

    'factura-venta': `Estimado/a equipo de ${datos.cliente},\n\nNos complace confirmar la recepción de su factura nº ${datos.numDoc} de fecha ${datos.fecha} por importe total de ${datos.total} €.\n\nDetalle:\nBase imponible: ${datos.base} €\nIVA (${datos.tipoIVA}%): ${datos.cuotaIVA} €\nTotal: ${datos.total} €\nForma de pago acordada: ${datos.formaPago}\n\nProcederemos al abono en el plazo establecido. Si necesitan cualquier aclaración, no duden en contactarnos.\n\nAtentamente,\nDepartamento de Compras\n${datos.cliente}`,

    'nomina': `Estimado/a Departamento de RRHH,\n\nMe dirijo a vosotros para solicitar información sobre mi nómina del mes de ${datos.mes}.\n\nMis datos son los siguientes:\nNombre: ${datos.nombreEmp}\nCategoría: ${datos.categoria}\nContrato: ${datos.tipoContrato}\nSalario base: ${datos.salarioBase} €/mes\nAntigüedad: ${datos.antiguedad}\n\nQuería confirmar cuándo estará disponible para revisión y si podéis indicarme el tipo de IRPF que se está aplicando este mes, ya que observo que difiere ligeramente del mes anterior.\n\nMuchas gracias de antemano.\n\nUn saludo,\n${datos.nombreEmp}`,

    'contrato': `Estimado/a equipo de RRHH de ${emp},\n\nMe pongo en contacto con vosotros tras recibir la llamada comunicándome mi selección para el puesto de ${datos.puesto}. Quiero expresar mi satisfacción y confirmar mi disponibilidad para incorporarme el ${datos.fechaInc}.\n\nMis datos: DNI ${datos.dni}.\n\nMe gustaría confirmar algunos aspectos sobre el contrato (${datos.tipoContrato}) y el salario acordado de ${datos.salario} €/mes. ¿Necesitáis que lleve alguna documentación adicional el día de la firma?\n\nQuedo a vuestra disposición.\n\nAtentamente,\n${datos.nombreEmp}`,

    'baja-medica': `Estimado/a Departamento de RRHH de ${emp},\n\nLe comunico que me encuentro en situación de baja médica por ${datos.motivo} con fecha de inicio ${datos.fechaBaja}. La duración estimada es de ${datos.duracionEst}.\n\nAdjunto el parte médico de baja. Les agradecería que me indicasen cómo afectará esto a mi nómina de este mes y si necesito realizar algún trámite adicional por mi parte. También me gustaría saber cuándo debo entregar el siguiente parte de confirmación.\n\nHe dejado anotadas mis tareas pendientes para facilitar la cobertura durante mi ausencia.\n\nAtentamente,\n${datos.nombreEmp}`,

    'embargo-nomina': `JUZGADO DE PRIMERA INSTANCIA Nº ${datos.numJuzgado}\n${datos.ciudad} — PROCEDIMIENTO DE EJECUCIÓN ${datos.numProcedimiento}\n\nNOTIFICACIÓN DE EMBARGO DE SALARIO\n\nSe notifica a ${emp}, como empresa empleadora de D./Dª ${datos.nombreEmp} (DNI: ${datos.dni}), la obligación de retener la parte embargable del salario en virtud del procedimiento de ejecución de títulos judiciales nº ${datos.numProcedimiento}, hasta cubrir la deuda total de ${datos.deuda} €.\n\nBase legal: Art. 607 LEC. El salario mínimo interprofesional (${datos.smi} €/mes) es inembargable. El porcentaje a retener se aplica sobre el salario neto que exceda del SMI según la escala del citado artículo.\n\nLas retenciones deben comenzar en la nómina inmediatamente siguiente a esta notificación e ingresarse en la cuenta del Juzgado ES00 0000 0000 0000 0000.\n\nEl incumplimiento puede suponer responsabilidad penal del administrador/a.\n\n${hoy}\nEl/La Secretario/a Judicial`,

    'requerimiento-aeat': `AGENCIA ESTATAL DE ADMINISTRACIÓN TRIBUTARIA\nDelegación de Sevilla\n\nNOTIFICACIÓN DE REQUERIMIENTO\nReferencia: ${datos.numRef}\n\nSe requiere a ${emp} (CIF: ${datos.cifEmp}) para que aporte, en el plazo de 10 días hábiles, documentación relativa a ${datos.concepto} del período ${datos.periodo}.\n\nFundamento legal: Artículo 93 de la Ley 58/2003, General Tributaria.\n\nDocumentación a aportar: libros registro de facturas emitidas y recibidas, declaraciones presentadas en el período indicado y contratos que sustenten las operaciones declaradas.\n\nEl incumplimiento de este requerimiento podrá conllevar sanción de ${datos.sancion} € según el artículo 199 de la LGT.\n\nLa respuesta deberá realizarse a través de la Sede Electrónica de la AEAT (sede.agenciatributaria.gob.es).\n\nSevilla, ${hoy}\nAgente Tributario\nDelegación de Sevilla`,

    'deuda-ss': `TESORERÍA GENERAL DE LA SEGURIDAD SOCIAL\nDirección Provincial de Sevilla\n\nRECLAMACIÓN DE DEUDA Nº ${datos.numRec}\n\nSe notifica a ${emp} (CIR: ${datos.cir}) la siguiente deuda por falta de ingreso de cuotas correspondientes al período ${datos.periodo}:\n\nContingencias comunes: ${datos.ccImporte} €\nDesempleo y otros: ${datos.desImporte} €\nRecargo por demora (${datos.recargo}%): ${((parseFloat(datos.ccImporte)+parseFloat(datos.desImporte))*datos.recargo/100).toFixed(2)} €\nTOTAL ADEUDADO: ${datos.total} €\n\nBase legal: Art. 30 LGSS. Plazo de pago voluntario: 30 días naturales desde la recepción de esta notificación.\n\nTranscurrido dicho plazo sin que se haya procedido al pago, se iniciará automáticamente el procedimiento ejecutivo de apremio.\n\nDomicilie el pago en la SEDESS (sede.seg-social.gob.es).\n\nSevilla, ${hoy}\nDirectora Provincial TGSS`,

    'extracto-bancario': `Estimado/a cliente de ${emp},\n\nLe remitimos el extracto de su cuenta corriente ${datos.iban} correspondiente al mes de ${datos.mes}.\n\nResumen del período:\nSaldo inicial: ${datos.saldoInicial} €\nTotal abonos: +${datos.abonos} €\nTotal cargos: -${datos.cargos} €\nSaldo final: ${datos.saldoFinal} €\n\nLe recordamos que puede consultar el detalle completo de los movimientos a través de su área de cliente en nuestra banca online.\n\nSi tiene alguna consulta sobre cualquier movimiento o desea información sobre nuestros productos para empresas, no dude en contactar con su gestor/a asignado/a.\n\nAtentamente,\nServicio de Banca de Empresas\n${datos.banco}`,

    'despido': `Estimado/a equipo de RRHH,\n\nEn relación con la extinción del contrato de trabajo de ${datos.nombreEmp} (${datos.categoria}), con efectos del ${datos.fecha}, les comunico que es necesario proceder a los siguientes trámites:\n\nMotivo: ${datos.motivo}.\n\nConceptos del finiquito a calcular:\n- Vacaciones pendientes: ${datos.vacaciones} días\n- Parte proporcional de pagas extras: ${datos.pagasProp} €\n- Indemnización (si procede): ${datos.indemnizacion} €\n\nPasos a seguir:\n1. Calcular y tramitar el finiquito en Nominasol\n2. Gestionar la baja en la Seguridad Social (Modelo TA.2)\n3. Comunicar al SEPE la situación de desempleo\n4. Entregar la documentación al trabajador con suficiente antelación\n\nRogamos que se gestione con la máxima celeridad y respeto hacia el trabajador/a.\n\nAtentamente,\nDirección de ${emp}`,

    'factura-suministros': `Estimado/a equipo de ${emp},\n\nAdjunto encontrarán la factura correspondiente al servicio de ${datos.tipoSuministro} del período ${datos.periodo}.\n\nFactura nº: ${datos.numDoc}\nPeríodo: ${datos.periodo}\nBase imponible: ${datos.base} €\nIVA (${datos.tipoIVA}%): ${datos.cuotaIVA} €\nTotal: ${datos.total} €\nForma de pago: Domiciliación bancaria el día ${datos.diaCargo} del mes\n\nEl importe será cargado automáticamente en la cuenta domiciliada. Si detectan alguna incidencia en la lectura o en el importe facturado, disponen de 15 días para comunicárnoslo.\n\nAtentamente,\nServicio de Atención a Empresas\n${datos.empresa}`,

    'seguro-anual': `Estimado/a equipo de ${emp},\n\nNos complace presentarles la propuesta de contratación/renovación de la póliza de seguro ${datos.tipoSeguro} para el período ${datos.periodo}.\n\nDetalles de la póliza:\nNúmero de póliza: ${datos.numPoliza}\nTipo de seguro: ${datos.tipoSeguro}\nPrima anual: ${datos.prima} €\nForma de pago: ${datos.formaPago}\nPeríodo de cobertura: ${datos.periodo}\n\nPara formalizar la contratación, les rogamos que nos confirmen su aceptación respondiendo a este correo. A continuación les enviaremos la documentación contractual para su firma.\n\nQuedamos a su disposición para cualquier aclaración sobre las coberturas o condiciones.\n\nAtentamente,\nDepartamento Comercial\n${datos.aseguradora}`,

    'seguro-trabajadores': `Estimado/a Departamento de RRHH de ${emp},\n\nNos ponemos en contacto con ustedes para presentarles nuestra propuesta de seguro médico colectivo para sus ${datos.numEmpleados} empleados.\n\nCobertura: ${datos.cobertura}\nPrima mensual por empleado: ${datos.primaMensual} €\nPrima total mensual: ${datos.primaTotal} €\n\nLes recordamos que, conforme al artículo 42.3.c) de la Ley del IRPF, las primas satisfechas por la empresa para la cobertura médica de sus empleados están exentas de tributación hasta 500 € anuales por persona, por lo que supone una ventaja fiscal tanto para la empresa como para el trabajador.\n\nEstar interesados en ampliar información o solicitar el alta de sus empleados, no duden en contactarnos.\n\nAtentamente,\nÁrea Comercial de Empresas\n${datos.aseguradora}`,

    'reparacion-inmovilizado': `Estimado/a equipo de ${emp},\n\nAdjunto encontrarán la factura correspondiente a los trabajos de reparación realizados en ${datos.bien} con fecha ${datos.fecha}.\n\nAvería detectada: ${datos.averia}\nTrabajos realizados: ${datos.trabajos}\n\nDesglose económico:\nMateriales: ${datos.materiales} €\nMano de obra: ${datos.manoObra} €\nBase imponible: ${datos.base} €\nIVA (21%): ${datos.cuotaIVA} €\nTotal factura: ${datos.total} €\n\nLos trabajos realizados son de mantenimiento y conservación ordinarios, necesarios para mantener el bien en condiciones normales de funcionamiento.\n\nQuedamos a su disposición para cualquier consulta o para programar las próximas revisiones periódicas.\n\nAtentamente,\nServicio Técnico\n${datos.empresa}`,

    'adquisicion-inmovilizado': `Estimado/a equipo de ${emp},\n\nNos complace confirmar el pedido y adjuntar la factura correspondiente a la adquisición de ${datos.bien}.\n\nDescripción: ${datos.descripcion}\n\nDetalle económico:\nPrecio neto: ${datos.base} €\nIVA (${datos.tipoIVA}%): ${datos.cuotaIVA} €\nTotal: ${datos.total} €\nForma de pago: ${datos.formaPago}\nFecha prevista de entrega: ${datos.fechaEntrega}\n\nLes recordamos que, al tratarse de un bien de inversión, el IVA soportado (${datos.cuotaIVA} €) es deducible al 100% en la próxima declaración trimestral del Modelo 303.\n\nEl bien será entregado e instalado en sus instalaciones en la fecha indicada. A continuación recibirán instrucciones de puesta en marcha.\n\nAtentamente,\nDepartamento Comercial\n${datos.proveedor}`,

    'venta-inmovilizado': `Estimado/a Departamento de Contabilidad,\n\nLes comunico que se ha formalizado la venta de ${datos.bien} a ${datos.comprador} en los siguientes términos:\n\nPrecio de venta: ${datos.precioVenta} €\nIVA (21%): ${datos.ivaVenta} €\nTotal facturado: ${datos.totalVenta} €\n\nDatos contables del bien vendido:\nValor de adquisición: ${datos.valorAdq} €\nAmortización acumulada: ${datos.amorAcum} €\nValor neto contable: ${datos.vnc} €\n\nResultado de la venta: ${parseFloat(datos.resultado) >= 0 ? 'BENEFICIO' : 'PÉRDIDA'} de ${Math.abs(parseFloat(datos.resultado)).toFixed(2)} €\nCuenta a utilizar: ${parseFloat(datos.resultado) >= 0 ? '770 — Beneficios procedentes del inmovilizado' : '671 — Pérdidas procedentes del inmovilizado'}\n\nLes ruego que procedan a dar de baja el bien en el registro de inmovilizado y realicen los asientos correspondientes.\n\nAtentamente,\nDirección de ${emp}`,

    'factura-rectificativa-compra': `Estimado/a equipo de ${emp},\n\nLes remitimos la factura rectificativa nº ${datos.numRect} que modifica la factura original nº ${datos.numOrig} de fecha ${datos.fechaOrig}.\n\nMotivo de la rectificación: ${datos.motivo}.\n\nImportes rectificados:\nBase imponible: -${datos.base} €\nIVA (${datos.tipoIVA}%): -${datos.cuotaIVA} €\nTotal a abonar/descontar: -${datos.total} €\n\nEl importe será descontado en la próxima factura o bien abonado mediante transferencia bancaria, según prefieran. Les rogamos que nos confirmen la modalidad de abono que prefieren.\n\nDisculpen las molestias ocasionadas.\n\nAtentamente,\nDepartamento de Facturación\n${datos.proveedor}`,

    'factura-rectificativa-venta': `Estimado/a equipo de ${datos.cliente},\n\nNos dirigimos a ustedes para informarles de la emisión de la factura rectificativa nº ${datos.numRect}, que corrige la factura original nº ${datos.numOrig}.\n\nMotivo: ${datos.motivo}.\n\nImportes rectificados:\nBase imponible: -${datos.base} €\nIVA (${datos.tipoIVA}%): -${datos.cuotaIVA} €\nTotal abono: -${datos.total} €\n\nEl importe será aplicado como descuento en la próxima factura que emitamos. Si prefieren que se realice mediante transferencia bancaria, indíquennoslo y procederemos en consecuencia.\n\nLes recordamos que deben actualizar sus registros contables de acuerdo con esta rectificación (cuenta 608 Devoluciones de compras en su caso).\n\nAtentamente,\nDepartamento de Administración\n${emp}`,

    'pedido-cliente': `Estimado/a equipo de ${emp},\n\nMi nombre es Ana Martínez, responsable de compras de ${datos.cliente}.\n\nNos ponemos en contacto con ustedes para realizar el siguiente pedido:\n\nProducto: ${datos.producto}\nCantidad: ${datos.cantidad} unidades\nPrecio unitario acordado: ${datos.precioUnit} €/ud.\nDescuento aplicable: ${datos.descuento}%\nImporte estimado: ${datos.totalEstimado} €\nForma de pago: ${datos.formaPago}\nPlazo de entrega solicitado: en ${datos.plazoEntrega} días hábiles desde la confirmación\n\nLes ruego que nos confirmen disponibilidad de stock, fecha exacta de entrega y, si fuera posible, el número de albarán o referencia de pedido asignada.\n\nLa dirección de entrega es nuestra nave habitual en C/ Industria, 14, Polígono Sur.\n\nQuedamos a la espera de su confirmación para proceder con la orden formal.\n\nUn cordial saludo,\nAna Martínez — Dpto. Compras\n${datos.cliente}`,

    'albaran-entrega': `Estimado/a equipo de ${datos.cliente},\n\nNos complace comunicarles que hoy, ${hoy}, se ha efectuado la entrega del pedido nº ${datos.numPedido} correspondiente a:\n\n${datos.descripcion}\n\nAlbarán de entrega nº: ${datos.numAlbaran}\nFecha de entrega: ${hoy}\nTransportista: Transportes Guadalquivir S.L. (matrícula SE-1234-AB)\n\nEn el presente albarán se detalla la mercancía entregada, cantidad, lote y estado. Les rogamos que, tras la inspección de la mercancía, firmen y devuelvan una copia del albarán en el plazo máximo de 48 horas como conformidad de recepción.\n\nEn caso de detectar cualquier incidencia (bultos dañados, faltantes o producto no conforme), deberán indicarlo por escrito en el albarán antes de la firma y notificárnoslo de inmediato, ya que una vez firmado sin reservas se entiende que la entrega es conforme.\n\nLa factura correspondiente será emitida en los próximos días una vez recibida la conformidad.\n\nAtentamente,\nDepartamento de Logística\n${emp}`,

    'impago-cliente': `Estimado/a equipo de ${datos.cliente},\n\nNos ponemos en contacto con ustedes en relación con la factura nº ${datos.numFac} emitida con fecha ${datos.fechaFac} por importe de ${datos.importe} €, cuyo vencimiento se produjo el ${datos.vencimiento}.\n\nA la fecha de este correo, dicha factura lleva ${datos.diasVencida} días vencida sin que hayamos recibido el pago ni comunicación alguna al respecto. Con anterioridad nos hemos puesto en contacto por teléfono en varias ocasiones sin obtener respuesta definitiva.\n\nMediante el presente escrito, les requerimos formalmente el pago de la cantidad adeudada de ${datos.importe} € en el plazo máximo de ${datos.plazoFinal} días hábiles a partir de la recepción de este mensaje.\n\nTranscurrido dicho plazo sin que se haya efectuado el pago, nos veremos obligados a iniciar las acciones legales oportunas para el cobro de la deuda, incluyendo la reclamación de los intereses de demora previstos en la Ley 3/2004, de lucha contra la morosidad en las operaciones comerciales, así como la posible cesión del crédito a una entidad de recobro.\n\nPara cualquier aclaración o para concretar un aplazamiento justificado, no duden en contactar con nosotros a la mayor brevedad.\n\nAtentamente,\nDepartamento de Administración y Finanzas\n${emp}`,

    'reclamacion-proveedor': `Estimado/a equipo de ${datos.proveedor},\n\nNos dirigimos a ustedes en relación con el pedido nº ${datos.numPedido} para comunicarles una incidencia grave que ha generado perjuicios económicos a nuestra empresa.\n\nIncidencia detectada:\n${datos.incidencia}\n\nEsta situación nos ha generado costes adicionales y ha afectado a nuestra capacidad para atender los compromisos adquiridos con nuestros clientes, lo que ha dañado nuestra imagen comercial.\n\nEn virtud de las condiciones pactadas en el pedido y de conformidad con los artículos 1.101 y siguientes del Código Civil sobre incumplimiento de obligaciones, les requerimos que en el plazo de ${datos.plazo} días hábiles procedan a:\n\n- Comunicarnos su posición oficial respecto a la incidencia\n- Ofrecernos una solución que compense los perjuicios ocasionados\n\nMientras tanto, la mercancía afectada permanece retenida en nuestras instalaciones a su disposición para inspección.\n\nDe no recibir respuesta satisfactoria en el plazo indicado, procederemos a formalizar la reclamación por los cauces legales correspondientes.\n\nAtentamente,\nDirección General\n${emp}`,

    'amortizacion-anual': `Estimado/a equipo de Contabilidad,\n\nMe dirijo a vosotros para recordaros que, antes del cierre contable del ejercicio ${datos.ejercicio}, debemos registrar la dotación anual de amortización de los bienes del inmovilizado material.\n\nDetalle de los bienes a amortizar este ejercicio:\n\n1. ${datos.bien1}\n   Valor de adquisición: ${datos.valor1} €\n   Vida útil estimada: ${datos.vida1} años\n   Cuota de amortización lineal: ${datos.cuota1} €/año\n   Asiento: 682 Amortización inmov. material (debe) / 282 Amortización acumulada (haber)\n\n2. ${datos.bien2}\n   Valor de adquisición: ${datos.valor2} €\n   Vida útil estimada: ${datos.vida2} años\n   Cuota de amortización lineal: ${datos.cuota2} €/año\n   Asiento: 682 Amortización inmov. material (debe) / 282 Amortización acumulada (haber)\n\nTotal a amortizar este ejercicio: ${(parseFloat(datos.cuota1)+parseFloat(datos.cuota2)).toFixed(2)} €\n\nOs recuerdo que el plazo máximo para registrar estos asientos es el 31 de diciembre. Una vez realizado, por favor confirmadme para reflejarlo en el cierre.\n\nSaludo,\nDirección Financiera\n${emp}`,

    'periodificacion-gasto': `Estimado/a equipo de Contabilidad,\n\nOs escribo en relación con la factura de ${datos.concepto} que hemos recibido y abonado el ${datos.fechaPago} por importe de ${datos.totalFac} €.\n\nTras revisar el período de cobertura del contrato (${datos.periodoCubre}), observamos que el gasto no corresponde íntegramente al presente ejercicio, por lo que es necesario periodificar la parte que corresponde al ejercicio siguiente.\n\nCálculo de la periodificación:\n- Meses totales del contrato: ${datos.mesesTotal} meses\n- Meses que corresponden al ejercicio actual: ${datos.mesesEjercicio} meses → ${datos.importeEjercicio} €\n- Meses que corresponden al ejercicio siguiente: ${datos.mesesSiguiente} meses → ${datos.importeSiguiente} € (a periodificar)\n\nAsiento a registrar al cierre del ejercicio:\n    480 Gastos anticipados: ${datos.importeSiguiente} € (debe)\n    ${datos.cta} Gasto correspondiente: ${datos.importeSiguiente} € (haber)\n\nAsiento de reversión a 1 de enero del ejercicio siguiente:\n    ${datos.cta} Gasto correspondiente: ${datos.importeSiguiente} € (debe)\n    480 Gastos anticipados: ${datos.importeSiguiente} € (haber)\n\nPor favor, realizad ambos asientos antes del cierre y confirmadme cuando esté hecho.\n\nUn saludo,\nAsesoría Contable Externa`,

    'provision-insolvencia': `Estimado/a Director/a Financiero/a de ${emp},\n\nOs traslado una situación que requiere atención contable urgente antes del cierre del ejercicio.\n\nLa empresa ${datos.deudor} mantiene con nosotros un saldo pendiente de cobro correspondiente a la factura ${datos.numFac} por importe de ${datos.importe} €, que lleva ${datos.diasVencida} días vencida sin que hayamos conseguido cobrar ni establecer un plan de pago.\n\nHabida cuenta de las gestiones realizadas sin resultado y de la situación que atraviesa dicha empresa, consideramos que existe un riesgo real de insolvencia. Por ello, de acuerdo con el principio contable de prudencia (PGC, NRV 9ª), es necesario dotar una provisión por deterioro de valor del crédito.\n\nAsiento a registrar:\n    694 Pérdidas por deterioro de créditos comerc. operaciones: ${datos.importe} € (debe)\n    490 Deterioro de valor de créditos por operac. comerciales: ${datos.importe} € (haber)\n\nImpacto: reduce el resultado del ejercicio en ${datos.importe} € y el activo corriente del balance en la misma cuantía.\n\nEn caso de que finalmente se cobre, se revertirá el asiento:\n    490 Deterioro (debe) / 794 Reversión deterioro créditos (haber)\n\nOs solicito que registréis este asiento antes del cierre. Adjunto el historial de reclamaciones como evidencia.\n\nAtentamente,\nDepartamento de Contabilidad\n${emp}`,

    'cierre-contable': `Estimado/a equipo de Contabilidad de ${emp},\n\nCon motivo del cierre del ejercicio contable ${datos.ejercicio}, os resumo los pasos y datos necesarios para completar el proceso correctamente.\n\nResultados provisionales del ejercicio:\n    Total ingresos (grupo 7): ${datos.ingresos} €\n    Total gastos (grupo 6): ${datos.gastos} €\n    Resultado antes de impuestos: ${datos.resultado >= 0 ? 'BENEFICIO' : 'PÉRDIDA'} de ${Math.abs(datos.resultado).toFixed(2)} €\n\nPasos del cierre:\n\n1. COMPROBACIONES PREVIAS (antes del 31/12)\n   - Verificar que todas las amortizaciones están registradas\n   - Comprobar periodificaciones de gastos e ingresos\n   - Revisar provisiones por deterioro de créditos\n   - Conciliar saldos bancarios con extractos\n\n2. ASIENTO DE REGULARIZACIÓN\n   - Saldar todas las cuentas del grupo 6 (gastos) cargando contra 129\n   - Saldar todas las cuentas del grupo 7 (ingresos) abonando contra 129\n   - El saldo resultante de la cuenta 129 refleja el resultado del ejercicio\n\n3. ASIENTO DE CIERRE\n   - Saldar todos los saldos de activo, pasivo y patrimonio neto\n\n4. CUENTAS ANUALES\n   - Plazo para depósito en el Registro Mercantil: 6 meses desde el cierre\n\nPor favor, confirmadme cuando hayáis completado cada fase.\n\nAtentamente,\nAsesoría Contable Externa`,

    'maternidad-paternidad': `Estimado/a Departamento de RRHH de ${emp},\n\nMi nombre es ${datos.nombreEmp} y trabajo en el departamento de ${datos.dept}.\n\nMe pongo en contacto con vosotros para comunicaros que ${datos.tipo === 'maternidad' ? 'el parto está previsto para el ' + datos.fechaParto + ' y necesito gestionar el permiso de maternidad' : 'el nacimiento de mi hijo/a se ha producido el ' + datos.fechaNacimiento + ' y necesito gestionar el permiso de paternidad'}.\n\nEntiendo que tengo derecho a ${datos.semanas} semanas de permiso según la normativa vigente (Real Decreto-ley 6/2019). Me gustaría que me informarais sobre los siguientes puntos:\n\n1. Procedimiento para solicitar la prestación económica al INSS (¿lo tramita la empresa o debo hacerlo yo directamente?)\n2. Si el INSS abona directamente mi salario o si la empresa lo adelanta y después solicita el reintegro\n3. Cómo afecta el permiso al cómputo de mis vacaciones anuales (entiendo que no se consumen)\n4. Posibilidad de disfrutar las 6 semanas obligatorias inmediatamente y posponer el resto de forma flexible\n5. Qué documentación debo aportar (libro de familia, informe médico, etc.)\n\nOs agradecería una reunión breve para aclarar estos aspectos cuando sea posible.\n\nMuchas gracias,\n${datos.nombreEmp}`,

    'excedencia-voluntaria': `Estimado/a Departamento de RRHH de ${emp},\n\nPor medio del presente escrito, yo, ${datos.nombreEmp}, con DNI en vuestros archivos, y con ${datos.antiguedad} años de antigüedad en la empresa, solicito formalmente una excedencia voluntaria de ${datos.duracion} meses de duración, al amparo de lo establecido en el artículo 46.2 del Estatuto de los Trabajadores.\n\nMotivo de la solicitud: ${datos.motivo}.\n\nFecha de inicio de la excedencia solicitada: ${datos.fechaInicio}.\n\nCon carácter previo al inicio de la excedencia, me comprometo a:\n- Dejar mis tareas organizadas y documentadas para facilitar su cobertura\n- Participar en el traspaso de conocimiento a la persona que me sustituya durante el tiempo que sea necesario\n- Comunicar con la mayor antelación posible mi decisión de reincorporación, que en todo caso respetará el preaviso establecido en convenio\n\nLes ruego que me confirmen:\n- La aceptación formal de la excedencia y la fecha exacta de inicio\n- Los efectos sobre mis cotizaciones a la Seguridad Social durante el período de excedencia\n- Si se me reserva el mismo puesto de trabajo o uno de similar categoría y remuneración\n\nEn espera de su respuesta, quedo a vuestra disposición.\n\nAtentamente,\n${datos.nombreEmp}`,

    'horas-extra': `Estimado/a equipo de RRHH de ${emp},\n\nMe dirijo a vosotros en mi calidad de responsable del departamento de ${datos.dept} para comunicaros que ${datos.nombreEmp} ha realizado ${datos.horasExt} horas extraordinarias durante el mes de ${datos.mes}.\n\nMotivo de las horas extra: ${datos.motivo}.\n\nSolicitud de compensación:\nModalidad: ${datos.tipoCompensacion === 'económica' ? 'Compensación económica con recargo del ' + datos.recargo + '% sobre el valor de la hora ordinaria' : 'Compensación mediante descanso equivalente en los 4 meses siguientes (art. 35.1 ET)'}\n\nControl de jornada acumulado:\nHoras extraordinarias realizadas hasta ${datos.mes}: ${datos.horasAcumuladas} horas\nLímite anual legal: 80 horas (art. 35 ET)\nHoras disponibles restantes: ${80 - datos.horasAcumuladas} horas\n\nLes adjunto el registro de control de jornada diario firmado por el trabajador/a como soporte documental, conforme a la obligación establecida en el art. 34.9 ET tras la reforma de 2019.\n\nPor favor, proceded a reflejarlo en la nómina de ${datos.mes} según la modalidad indicada y emitid el recibo correspondiente.\n\nAtentamente,\nJefatura de ${datos.dept}\n${emp}`,

    'ere-erte': `Estimado/a equipo de Dirección y RRHH de ${emp},\n\nTras el análisis de la situación económica y productiva de la empresa, y a la vista de la documentación justificativa recopilada, les informo del inicio del procedimiento de Expediente de Regulación Temporal de Empleo (ERTE) por causas económicas, al amparo del artículo 47 del Estatuto de los Trabajadores.\n\nDetalles del procedimiento:\n- Trabajadores afectados: ${datos.numTrabajadores} personas del departamento de ${datos.dept}\n- Medida adoptada: ${datos.medida}\n- Período de afectación propuesto: del ${datos.fechaInicio} al ${datos.fechaFin}\n- Causa justificativa: ${datos.causa}\n\nACTUACIONES INMEDIATAS OBLIGATORIAS:\n\n1. Comunicación a la representación legal de los trabajadores (o, en su ausencia, a los propios trabajadores) con apertura del período de consultas de ${datos.diasConsultas} días.\n2. Notificación simultánea a la Autoridad Laboral (Delegación Provincial de Trabajo de Sevilla).\n3. Aportación de la documentación acreditativa de las causas: cuentas anuales, declaración del IS, informe técnico económico.\n\nEfectos para los trabajadores afectados:\n- Suspensión temporal del contrato de trabajo\n- Derecho a prestación por desempleo sin período de carencia\n- Exoneración parcial de cotizaciones patronales según normativa vigente\n\nQuedo a disposición para cualquier consulta y coordinaré con el despacho jurídico laboral los pasos siguientes.\n\nAtentamente,\nAsesoría Laboral Externa`,

    'mod111-retenciones': `Estimado/a equipo de Administración de ${emp},\n\nLes recuerdo que el próximo ${datos.plazo} vence el plazo de presentación del Modelo 111 correspondiente al ${datos.trimestre}er trimestre del ejercicio ${datos.ejercicio} (retenciones e ingresos a cuenta sobre rendimientos del trabajo y actividades profesionales).\n\nDATOS PARA CUMPLIMENTAR EL MODELO 111:\n\nApartado 1 — Rendimientos del trabajo (nóminas):\n   Número de perceptores: ${datos.numTrab}\n   Base de las retenciones: ${datos.baseNominas} €\n   Retenciones practicadas: ${datos.retenciones} €\n\nApartado 2 — Rendimientos de actividades profesionales (facturas con retención):\n   Retenciones sobre facturas profesionales: ${datos.retProf} €\n\nRESULTADO DE LA LIQUIDACIÓN: ${datos.resultado} € a ingresar\n\nPROCEDIMIENTO:\n1. Acceder a la Sede Electrónica de la AEAT (sede.agenciatributaria.gob.es)\n2. Identificarse con certificado digital o Cl@ve\n3. Cumplimentar el Modelo 111 con los datos anteriores\n4. Presentar y, si procede, realizar el ingreso telemáticamente\n5. Guardar el justificante de presentación en el archivo fiscal\n\nLes recuerdo que el incumplimiento del plazo conlleva recargos del 5%, 10% o 20% según la demora, además de posibles sanciones.\n\nAtentamente,\nAsesoría Fiscal\n${emp}`,

    'mod347-operaciones': `Estimado/a equipo de Contabilidad de ${emp},\n\nLes recuerdo la obligación anual de presentar el Modelo 347 (Declaración anual de operaciones con terceros) antes del ${datos.plazo}.\n\nOBLIGACIÓN DE DECLARAR:\nDeben incluirse todas las operaciones realizadas con un mismo cliente o proveedor que, en su conjunto durante el ejercicio ${datos.ejercicio}, hayan superado los 3.005,06 €, con independencia del signo de las mismas.\n\nDANDO PARA LA DECLARACIÓN:\nNúmero de terceros a declarar: ${datos.numTerceros}\nVolumen total de operaciones declarables: ${datos.volumenTotal} €\n\nPARA EXTRAER LOS DATOS DE CONTASOL:\n1. Acceder a Informes → Listados → Saldos por cuenta\n2. Filtrar cuentas 400 (Proveedores) y 430 (Clientes) con movimientos en ${datos.ejercicio}\n3. Agrupar por NIF/CIF y sumar el total anual de cada tercero\n4. Seleccionar los que superen 3.005,06 €\n\nLes recuerdo que el Modelo 347 se presenta exclusivamente de forma telemática, y que una vez presentado, los terceros declarados pueden contrastar los importes con su propia declaración, por lo que es importante que los datos sean correctos.\n\nSi necesitan ampliar información sobre alguna operación concreta, no duden en consultarnos.\n\nAtentamente,\nAsesoría Fiscal`,

    'mod200-sociedades': `Estimado/a equipo de Administración de ${emp},\n\nLes adjunto el resumen del cálculo del Impuesto sobre Sociedades correspondiente al ejercicio ${datos.ejercicio}, previo a la presentación del Modelo 200.\n\nCALCULO DEL IMPUESTO:\n\nResultado contable antes de impuestos:   ${datos.resultadoContable} €\n${datos.ajuste !== '0.00' ? 'Ajuste extracontable (' + datos.tipoAjuste + '): +' + datos.ajuste + ' €\n' : ''}Base imponible:                          ${datos.baseImponible} €\nTipo impositivo aplicado:                ${datos.tipo}% ${datos.esNueva ? '(empresa nueva creación)' : '(tipo general)'}\nCuota íntegra:                           ${datos.cuotaIntegra} €\n${datos.deduccion !== '0.00' ? 'Deducción aplicada: -' + datos.deduccion + ' €\n' : ''}Cuota líquida:                           ${datos.cuotaLiquida} €\nPagos fraccionados realizados (Mod. 202): -${datos.pagosFracc} €\nRESULTADO FINAL:                         ${(parseFloat(datos.cuotaLiquida)-parseFloat(datos.pagosFracc)).toFixed(2)} € ${parseFloat(datos.cuotaLiquida)-parseFloat(datos.pagosFracc) >= 0 ? '(A INGRESAR)' : '(A DEVOLVER)'}\n\nPROXIMOS PASOS:\n1. Revisar el cuadro anterior y confirmar la conformidad con los datos contables\n2. Presentar el Modelo 200 a través de la Sede Electrónica de la AEAT antes del 25 de julio\n3. Si el resultado es a ingresar, realizar el pago telemáticamente en el mismo acto de presentación\n4. Si es a devolver, la AEAT realizará la transferencia en el plazo habitual de 6 meses\n\nAtentamente,\nAsesoría Fiscal`,

    'iva-intracomunitario': `Estimado/a equipo de ${emp},\n\nNos ponemos en contacto con ustedes desde ${datos.empresa} (NIF-IVA: ${datos.nifIVA}), empresa del sector agroalimentario con sede en la Unión Europea.\n\nTras el éxito de nuestras conversaciones previas, nos complace formalizarles la siguiente oferta comercial:\n\nProducto: ${datos.producto}\nImporte total de la operación: ${datos.importe} € (libre de IVA)\nIncoterm: ${datos.incoterm}\nPlazo de entrega: ${datos.plazo} días hábiles desde confirmación del pedido\n\nNOTAS FISCALES IMPORTANTES:\nAl tratarse de una entrega intracomunitaria de bienes entre dos operadores registrados en el ROI (Registro de Operadores Intracomunitarios), la operación está exenta de IVA en origen conforme al artículo 25 de la Ley 37/1992 del IVA.\n\nNo obstante, les recordamos que como empresa adquirente española deberán:\n1. Declarar la operación en el Modelo 349 (declaración recapitulativa de operaciones intracomunitarias)\n2. Aplicar la inversión del sujeto pasivo en el Modelo 303: incluir la base en la casilla 10 (adquisiciones intracomunitarias) y simultáneamente en la casilla 36 (IVA deducible por adquisiciones intracomunitarias)\n\nPara proceder con el pedido, necesitamos que nos confirmen su NIF-IVA activo en el censo VIES.\n\nAtentamente,\nDpto. Comercial Internacional\n${datos.empresa}`,

    'solicitud-prestamo': `Estimado/a ${emp},\n\nEn respuesta a su solicitud de financiación, nos complace presentarles la siguiente propuesta de préstamo empresarial:\n\nCONDICIONES DE LA OPERACIÓN:\nImporte solicitado: ${Number(datos.importe).toLocaleString('es-ES')} €\nPlazo de amortización: ${datos.plazo} años (${datos.plazo*12} cuotas mensuales)\nTipo de interés: ${datos.tipo}% T.A.E. (fijo durante toda la vida del préstamo)\nCuota mensual: ${datos.cuota} €\nComisión de apertura: ${datos.comApertura}% (${(Number(datos.importe)*parseFloat(datos.comApertura)/100).toFixed(2)} €, cobrada al inicio)\nGarantía requerida: ${datos.garantia}\n\nEVOLUCIÓN PRIMERAS CUOTAS (método francés):\nCuota 1: Capital ${(Number(datos.importe)*parseFloat(datos.tipo)/100/12).toFixed(2)} € · Intereses ${(parseFloat(datos.cuota)-(Number(datos.importe)*parseFloat(datos.tipo)/100/12)).toFixed(2)} € · Saldo pendiente ${(Number(datos.importe)-parseFloat(datos.cuota)+(Number(datos.importe)*parseFloat(datos.tipo)/100/12)).toFixed(2)} €\nCuota 2 y siguientes: evolución similar con reducción progresiva de intereses\n\nDOCUMENTACIÓN NECESARIA:\n- Cuentas anuales de los dos últimos ejercicios\n- Declaración del Impuesto sobre Sociedades\n- Plan de negocio o memoria justificativa del destino del préstamo\n- Escritura de constitución y poderes del firmante\n\nPlazo para formalizar ante notario: 30 días desde la aceptación.\n\nLes recordamos que el incumplimiento en el pago generará intereses de demora al tipo establecido en el contrato, además de reportarse a los ficheros de morosidad.\n\nAtentamente,\nÁrea de Empresas\n${datos.banco}`,

    'subvencion': `${datos.organismo}\n\nNOTIFICACIÓN DE RESOLUCIÓN FAVORABLE — CONCESIÓN DE SUBVENCIÓN\nExpediente nº: ${datos.numExp}\n\nSe notifica a ${emp}, en su calidad de entidad solicitante, que la solicitud de subvención presentada al amparo de ${datos.convocatoria} ha sido resuelta FAVORABLEMENTE por el órgano competente.\n\nIMPORTE CONCEDIDO: ${Number(datos.importe).toLocaleString('es-ES')} €\nFINALIDAD: ${datos.finalidad}\n\nCONDICIONES DE LA SUBVENCIÓN:\n1. La entidad beneficiaria deberá justificar la totalidad del gasto subvencionado mediante facturas y documentos acreditativos originales antes del ${datos.plazoJustificacion}.\n2. La subvención no es compatible con otras ayudas públicas o privadas que, en su conjunto, superen el ${datos.porcentaje}% del coste total de la inversión subvencionada.\n3. La empresa deberá mantener la actividad y el empleo durante un mínimo de 3 años desde la fecha de resolución.\n4. Cualquier modificación sustancial del proyecto deberá ser comunicada y autorizada previamente.\n\nFORMA DE PAGO: ${datos.formaPago}\n\nAPUNTE CONTABLE:\nDebido al carácter de subvención de capital, el importe debe contabilizarse inicialmente como ingreso diferido:\n    572 Bancos (debe) / 130 Subvenciones de capital (haber)\nY trasladarse al resultado a medida que se amorticen los bienes financiados:\n    130 Subvenciones de capital (debe) / 746 Subvenciones transferidas al resultado (haber)\n\n${hoy}\nEl/La Jefe/a del Servicio\n${datos.organismo}`,

    'contrato-arrendamiento': `Estimado/a equipo de ${emp},\n\nNos complace hacerles llegar la propuesta de contrato de arrendamiento para uso distinto de vivienda del local comercial situado en ${datos.direccion}, de una superficie útil de ${datos.superficie} m².\n\nCONDICIONES PRINCIPALES DEL CONTRATO:\n\nRenta mensual: ${datos.renta} € + IVA ${datos.ivaAlquiler}% (${(datos.renta*datos.ivaAlquiler/100).toFixed(2)} €) = ${datos.rentaTotal} € al mes\nDuración: ${datos.duracion} años, prorrogable tácitamente por períodos anuales salvo denuncia con 3 meses de antelación\nFianza: ${datos.fianza} mensualidad/s (${(datos.renta*datos.fianza).toFixed(2)} €) a depositar en la Junta de Andalucía\nActualización de renta: anual según variación del IPC\nCarencia de renta: ${datos.carencia} meses desde la firma, para acondicionamiento del local\nObras: las de adecuación corren a cargo del arrendatario, debiendo reponer el local a su estado original al término del contrato salvo acuerdo en contrario\n\nDOCUMENTACIÓN NECESARIA PARA LA FIRMA:\n- Escritura de constitución de la sociedad y estatutos\n- Poderes del representante legal\n- DNI del firmante\n- Último recibo del IAE o modelo 036/037\n\nLa firma se realizará ante notario. Les proponemos el ${new Date(Date.now()+10*24*60*60*1000).toLocaleDateString('es-ES')} si les resulta conveniente.\n\nAtentamente,\nGestión Inmobiliaria\n${datos.arrendador}`,

    'negociacion-precio': `Estimado/a equipo de ${emp},\n\nMi nombre es Javier Moreno, Director Comercial de ${datos.empresaCliente}. Nos conocemos de las operaciones que venimos realizando juntos desde hace tiempo, y precisamente por esa relación de confianza quiero plantearos una cuestión de manera directa y constructiva.\n\nComo sabéis, ${datos.empresaCliente} ha adquirido en los últimos tres meses un volumen de ${datos.volumen} € en ${datos.producto}, consolidándose como uno de vuestros clientes habituales. Sin embargo, en las últimas semanas hemos recibido ofertas de otros proveedores con precios un ${datos.descuentoPedido}% por debajo de vuestra tarifa actual para el mismo producto y calidad.\n\nNuestra intención no es cambiar de proveedor, ya que valoramos la fiabilidad de vuestro servicio y la calidad del producto. Sin embargo, para poder justificar internamente la continuidad de la relación, necesitamos que revisemos las condiciones.\n\nNuestra propuesta concreta:\n- Descuento del ${datos.descuentoPropuesto}% sobre tarifa, o bien\n- Rappel por volumen anual del 3% a partir de ${Number(datos.umbralRappel).toLocaleString('es-ES')} € de compras\n\nA cambio, nos comprometemos a mejorar las condiciones de pago, pasando de ${datos.pagoActual} días a ${datos.pagoOfrecido} días desde la fecha de factura.\n\nOs agradecería vuestra respuesta en los próximos días para poder tomar una decisión.\n\nUn saludo cordial,\nJavier Moreno — Director Comercial\n${datos.empresaCliente}`,

    'disputa-mercado': `Estimado/a equipo de ${emp},\n\nMe dirijo a ustedes en nombre de ${datos.empresaReclamante} para trasladarles formalmente nuestra disconformidad con la situación originada a raíz del pedido nº ${datos.numDoc}.\n\nEXPOSICIÓN DE LOS HECHOS:\n${datos.incidencia}\n\nEsta circunstancia nos ha causado un perjuicio económico directo cuantificado en ${datos.danio} €, además del daño reputacional ante nuestros propios clientes, a quienes no hemos podido atender en las condiciones comprometidas.\n\nEn virtud del contrato/pedido suscrito entre ambas empresas, y de conformidad con lo dispuesto en los artículos 1.101 y siguientes del Código Civil sobre responsabilidad contractual, solicitamos formalmente:\n\n${datos.solucionPropuesta}\n\nLes otorgamos un plazo de ${datos.plazoRespuesta} días hábiles para dar respuesta a esta reclamación y proponer una solución. Transcurrido dicho plazo sin acuerdo, elevaremos la cuestión al mecanismo de arbitraje del mercado intergrupal de SimulApp para su resolución.\n\nConfiamos en que la relación comercial entre nuestras empresas permitirá resolver esta situación de manera amistosa y sin necesidad de escalar el conflicto.\n\nAtentamente,\nDirección General\n${datos.empresaReclamante}`,

    'acuerdo-suministro': `Estimado/a equipo de ${emp},\n\nNos complace trasladaros la siguiente propuesta de Acuerdo Marco de Suministro para el curso académico ${datos.curso}, con el objetivo de establecer una relación comercial estable y de beneficio mutuo.\n\nOBJETO DEL ACUERDO:\nProducto: ${datos.producto}\nVolumen anual estimado: ${Number(datos.volumenAnual).toLocaleString('es-ES')} €\n\nCONDICIONES ECONÓMICAS:\nPrecio unitario garantizado: ${datos.precioUnitario} €/ud. (revisable semestralmente según variación del IPC, máximo ±3%)\nCondiciones de pago: ${datos.condicionesPago}\n\nCONDICIONES OPERATIVAS:\nPlazo de entrega garantizado: ${datos.plazoEntrega} días hábiles desde la recepción del pedido\nPenalización por incumplimiento de plazo: ${datos.penalizacion}% del valor del pedido afectado por cada día de retraso, hasta un máximo del 10%\nCláusula de exclusividad parcial: nos comprometemos a cubrir hasta el ${datos.exclusividad}% de sus necesidades anuales del producto indicado en condiciones preferentes\n\nVENTAJAS PARA AMBAS PARTES:\n- Estabilidad de precio y suministro para el comprador\n- Previsibilidad de pedidos y optimización de producción para el proveedor\n- Reducción de costes administrativos al simplificar la negociación\n\nOs invitamos a revisar esta propuesta y, si les parece adecuada, a concertar una reunión para ajustar los detalles antes de la firma.\n\nAtentamente,\nDpto. Comercial\n${datos.empresaPropone}`,
  };

  return map[tipo.id] || `Estimado equipo de ${emp},\n\nSe adjunta documentación relacionada con: ${tipo.label}.\n\nPor favor, gestionen según los procedimientos habituales.\n\n${datos.infoDoc || ''}\n\nAtentamente,\nRemitente`;
}

/* ── Enviar la situación generada al buzón ─────────────────── */

/* ── Renderizador de documentos por tipo ─────────────────── */
function renderDocumento(tipo, datos) {
  const fmtD = (n) => parseFloat(n||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
  const estiloDoc = `font-family:'Courier New',monospace;font-size:.8rem;color:#1a1c1e;background:white;padding:24px;border:1px solid #d6dce3;border-radius:6px;line-height:1.8`;
  const hoy = new Date().toLocaleDateString('es-ES');

  const docs = {
    'factura-compra': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:12px;margin-bottom:16px">
        <div style="font-size:1.1rem;font-weight:800;color:#134a28">FACTURA</div>
        <div style="font-size:.85rem;color:#565c64">Nº ${datos.numDoc||""} · Fecha: ${datos.fecha||""}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:16px;font-size:.78rem">
        <div><strong>EMISOR</strong><br>${datos.empresa||""}<br>CIF: ${datos.cif||""}<br>Cantillana, Sevilla</div>
        <div><strong>DESTINATARIO</strong><br>(Nombre de tu empresa)<br>(Tu CIF)<br>(Tu dirección)</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin-bottom:12px">
        <thead><tr style="background:#134a28;color:white">
          <th style="padding:6px 8px;text-align:left">Descripción</th>
          <th style="padding:6px 8px;text-align:right">Base</th>
          <th style="padding:6px 8px;text-align:right">IVA</th>
          <th style="padding:6px 8px;text-align:right">Total</th>
        </tr></thead>
        <tbody><tr style="border-bottom:1px solid #d6dce3">
          <td style="padding:6px 8px">Suministros según pedido</td>
          <td style="padding:6px 8px;text-align:right">${fmtD(datos.base)} €</td>
          <td style="padding:6px 8px;text-align:right">${datos.tipoIVA||21}%</td>
          <td style="padding:6px 8px;text-align:right">${fmtD(datos.total)} €</td>
        </tr></tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right;padding:4px 8px;font-size:.75rem;color:#767d87">Base imponible:</td><td colspan="2" style="text-align:right;padding:4px 8px">${fmtD(datos.base)} €</td></tr>
          <tr><td colspan="2" style="text-align:right;padding:4px 8px;font-size:.75rem;color:#767d87">IVA (${datos.tipoIVA||21}%):</td><td colspan="2" style="text-align:right;padding:4px 8px">${fmtD(datos.cuotaIVA)} €</td></tr>
          <tr style="background:#edfaf3"><td colspan="2" style="text-align:right;padding:6px 8px;font-weight:700">TOTAL:</td><td colspan="2" style="text-align:right;padding:6px 8px;font-weight:800;font-size:.95rem">${fmtD(datos.total)} €</td></tr>
        </tfoot>
      </table>
      <div style="font-size:.75rem;color:#767d87;border-top:1px solid #d6dce3;padding-top:8px">
        <strong>Forma de pago:</strong> ${datos.formaPago||""} &nbsp;|&nbsp; <strong>IBAN:</strong> ${datos.iban||""}
      </div>
    </div>`,

    'factura-venta': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:12px;margin-bottom:16px">
        <div style="font-size:1.1rem;font-weight:800;color:#134a28">FACTURA EMITIDA</div>
        <div style="font-size:.85rem;color:#565c64">Nº ${datos.numDoc||""} · Fecha: ${datos.fecha||""}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:16px;font-size:.78rem">
        <div><strong>EMISOR</strong><br>(Nombre de tu empresa)<br>(Tu CIF)<br>Cantillana, Sevilla</div>
        <div><strong>CLIENTE</strong><br>${datos.cliente||""}<br>CIF: ${datos.cifCliente||""}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin-bottom:12px">
        <thead><tr style="background:#134a28;color:white">
          <th style="padding:6px 8px;text-align:left">Descripción</th>
          <th style="padding:6px 8px;text-align:right">Base</th>
          <th style="padding:6px 8px;text-align:right">IVA</th>
          <th style="padding:6px 8px;text-align:right">Total</th>
        </tr></thead>
        <tbody><tr><td style="padding:6px 8px">Venta de productos según pedido</td>
          <td style="padding:6px 8px;text-align:right">${fmtD(datos.base)} €</td>
          <td style="padding:6px 8px;text-align:right">${datos.tipoIVA||21}%</td>
          <td style="padding:6px 8px;text-align:right">${fmtD(datos.total)} €</td>
        </tr></tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right;padding:4px 8px;font-size:.75rem;color:#767d87">Base imponible:</td><td colspan="2" style="text-align:right;padding:4px 8px">${fmtD(datos.base)} €</td></tr>
          <tr><td colspan="2" style="text-align:right;padding:4px 8px;font-size:.75rem;color:#767d87">IVA (${datos.tipoIVA||21}%):</td><td colspan="2" style="text-align:right;padding:4px 8px">${fmtD(datos.cuotaIVA)} €</td></tr>
          <tr style="background:#edfaf3"><td colspan="2" style="text-align:right;padding:6px 8px;font-weight:700">TOTAL:</td><td colspan="2" style="text-align:right;padding:6px 8px;font-weight:800;font-size:.95rem">${fmtD(datos.total)} €</td></tr>
        </tfoot>
      </table>
      <div style="font-size:.75rem;color:#767d87;border-top:1px solid #d6dce3;padding-top:8px">
        <strong>Forma de pago:</strong> ${datos.formaPago||""}
      </div>
    </div>`,

    'nomina': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">NÓMINA — ${(datos.mes||"").toUpperCase()} ${new Date().getFullYear()}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:.78rem;margin-bottom:14px">
        <div><strong>Empresa:</strong> (Tu empresa)<br><strong>CIF:</strong> (Tu CIF)</div>
        <div><strong>Trabajador/a:</strong> ${datos.nombreEmp||""}<br><strong>Categoría:</strong> ${datos.categoria||""}<br><strong>Contrato:</strong> ${datos.tipoContrato||""}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem">
        <thead><tr style="background:#134a28;color:white"><th style="padding:5px 8px;text-align:left">Concepto</th><th style="padding:5px 8px;text-align:right">Importe</th></tr></thead>
        <tbody>
          <tr><td style="padding:5px 8px">Salario base</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.salarioBase)} €</td></tr>
          <tr><td style="padding:5px 8px">Prorrata pagas extras</td><td style="padding:5px 8px;text-align:right">${fmtD(parseFloat(datos.salarioBase)*2/12)} €</td></tr>
          <tr style="background:#edfaf3;font-weight:700"><td style="padding:5px 8px">TOTAL DEVENGADO</td><td style="padding:5px 8px;text-align:right">${fmtD(parseFloat(datos.salarioBase)+parseFloat(datos.salarioBase)*2/12)} €</td></tr>
          <tr style="color:#dc2626"><td style="padding:5px 8px">(-) S.S. trabajador (6,48%)</td><td style="padding:5px 8px;text-align:right">-${fmtD((parseFloat(datos.salarioBase)+parseFloat(datos.salarioBase)*2/12)*0.0648)} €</td></tr>
          <tr style="color:#dc2626"><td style="padding:5px 8px">(-) IRPF (tipo estimado)</td><td style="padding:5px 8px;text-align:right">-${fmtD((parseFloat(datos.salarioBase)+parseFloat(datos.salarioBase)*2/12)*0.15)} €</td></tr>
        </tbody>
        <tfoot><tr style="background:#134a28;color:white;font-weight:800"><td style="padding:6px 8px">LÍQUIDO A PERCIBIR</td>
          <td style="padding:6px 8px;text-align:right">${fmtD((parseFloat(datos.salarioBase)+parseFloat(datos.salarioBase)*2/12)*(1-0.0648-0.15))} €</td>
        </tr></tfoot>
      </table>
      <div style="font-size:.72rem;color:#959da8;margin-top:8px">Registrar en Nominasol · Cuenta 640 (sueldos) y 642 (SS empresa) en Contasol</div>
    </div>`,

    'contrato': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">CONTRATO DE TRABAJO</div>
        <div style="font-size:.78rem;color:#565c64">Modalidad: ${datos.tipoContrato||""}</div>
      </div>
      <div style="font-size:.8rem;line-height:2">
        <strong>EMPRESA:</strong> (Tu empresa) · CIF: (Tu CIF)<br>
        <strong>TRABAJADOR/A:</strong> ${datos.nombreEmp||""} · DNI: ${datos.dni||""}<br>
        <strong>PUESTO:</strong> ${datos.puesto||""}<br>
        <strong>FECHA INCORPORACIÓN:</strong> ${datos.fechaInc||""}<br>
        <strong>TIPO CONTRATO:</strong> ${datos.tipoContrato||""}<br>
        <strong>SALARIO BRUTO:</strong> ${fmtD(datos.salario)} €/mes<br>
        <strong>JORNADA:</strong> Completa — 40 h/semana<br>
        <strong>PERÍODO DE PRUEBA:</strong> 2 meses
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;padding-top:14px;border-top:1px solid #d6dce3;text-align:center;font-size:.75rem;color:#959da8">
        <div style="padding-top:30px;border-top:1px solid #2c2f33">Por la empresa</div>
        <div style="padding-top:30px;border-top:1px solid #2c2f33">${datos.nombreEmp||""}</div>
      </div>
      <div style="font-size:.72rem;color:#959da8;margin-top:10px">Tramitar alta en SS (Modelo TA.2) · Registrar en Nominasol</div>
    </div>`,

    'baja-medica': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">PARTE DE BAJA MÉDICA</div>
        <div style="font-size:.78rem;color:#565c64">Incapacidad Temporal · Contingencias Comunes</div>
      </div>
      <div style="font-size:.8rem;line-height:2">
        <strong>TRABAJADOR/A:</strong> ${datos.nombreEmp||""}<br>
        <strong>EMPRESA:</strong> (Tu empresa)<br>
        <strong>MOTIVO:</strong> ${datos.motivo||""}<br>
        <strong>FECHA DE BAJA:</strong> ${datos.fechaBaja||""}<br>
        <strong>DURACIÓN ESTIMADA:</strong> ${datos.duracionEst||""}<br>
        <strong>PRÓXIMA REVISIÓN:</strong> ${new Date(Date.now()+7*24*60*60*1000).toLocaleDateString('es-ES')}
      </div>
      <div style="margin-top:12px;padding:8px 10px;background:#fef9ec;border:1px solid #fde68a;border-radius:4px;font-size:.75rem;color:#92400e">
        ⚠️ Comunicar a la TGSS en el plazo de 3 días · Ajustar nómina del mes en Nominasol
      </div>
    </div>`,

    'embargo-nomina': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #1e40af;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:.85rem;font-weight:700;color:#1e40af">JUZGADO DE PRIMERA INSTANCIA Nº ${datos.numJuzgado||""}</div>
        <div style="font-size:.75rem;color:#565c64">${datos.ciudad||""} · PROCEDIMIENTO DE EJECUCIÓN ${datos.numProcedimiento||""}</div>
      </div>
      <div style="font-size:.8rem;line-height:2">
        <strong>NOTIFICACIÓN DE EMBARGO DE SALARIO</strong><br>
        <strong>DEUDOR:</strong> ${datos.nombreEmp||""} (DNI: ${datos.dni||""})<br>
        <strong>EMPRESA EMPLEADORA:</strong> (Tu empresa)<br>
        <strong>DEUDA TOTAL:</strong> ${fmtD(datos.deuda)} €<br>
        <strong>BASE LEGAL:</strong> Art. 607 LEC · SMI inembargable: ${datos.smi||""} €/mes<br>
        <strong>IMPORTE A RETENER:</strong> Porcentaje del salario neto que exceda el SMI según escala del art. 607 LEC<br>
        <strong>INICIO RETENCIONES:</strong> Nómina inmediatamente siguiente<br>
        <strong>INGRESO:</strong> Cuenta del Juzgado ES00 0000 0000 0000 0000
      </div>
      <div style="margin-top:10px;padding:8px 10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;font-size:.75rem;color:#dc2626">
        ⚠️ El incumplimiento puede suponer responsabilidad penal del administrador/a
      </div>
    </div>`,

    'requerimiento-aeat': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #b45309;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:.85rem;font-weight:700;color:#b45309">AGENCIA ESTATAL DE ADMINISTRACIÓN TRIBUTARIA</div>
        <div style="font-size:.75rem;color:#565c64">Delegación de Sevilla</div>
      </div>
      <div style="font-size:.8rem;line-height:2">
        <strong>NOTIFICACIÓN DE REQUERIMIENTO</strong><br>
        <strong>Referencia:</strong> ${datos.numRef||""}<br>
        <strong>Contribuyente:</strong> (Tu empresa) · CIF: ${datos.cifEmp||""}<br>
        <strong>Objeto:</strong> ${datos.concepto||""}<br>
        <strong>Período:</strong> ${datos.periodo||""}<br>
        <strong>Base legal:</strong> Artículo 93 Ley 58/2003 General Tributaria<br>
        <strong>PLAZO:</strong> 10 días hábiles desde la recepción<br>
        <strong>Presentación:</strong> Sede Electrónica AEAT (sede.agenciatributaria.gob.es)
      </div>
      <div style="margin-top:10px;padding:8px 10px;background:#fef9ec;border:1px solid #fde68a;border-radius:4px;font-size:.75rem;color:#92400e">
        ⚠️ Incumplimiento: sanción de ${fmtD(datos.sancion)} € (art. 199 LGT)
      </div>
    </div>`,

    'deuda-ss': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #6d28d9;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:.85rem;font-weight:700;color:#6d28d9">TESORERÍA GENERAL DE LA SEGURIDAD SOCIAL</div>
        <div style="font-size:.75rem;color:#565c64">Dirección Provincial de Sevilla</div>
      </div>
      <div style="font-size:.8rem;line-height:2">
        <strong>RECLAMACIÓN DE DEUDA Nº ${datos.numRec||""}</strong><br>
        <strong>Empresa:</strong> (Tu empresa) · CIR: ${datos.cir||""}<br>
        <strong>Período:</strong> ${datos.periodo||""}<br>
        <strong>Contingencias comunes:</strong> ${fmtD(datos.ccImporte)} €<br>
        <strong>Desempleo y otros:</strong> ${fmtD(datos.desImporte)} €<br>
        <strong>Recargo por demora (${datos.recargo||10}%):</strong> ${fmtD((parseFloat(datos.ccImporte)+parseFloat(datos.desImporte))*datos.recargo/100)} €<br>
        <strong>TOTAL ADEUDADO:</strong> ${fmtD(datos.total)} €<br>
        <strong>Base legal:</strong> Art. 30 LGSS<br>
        <strong>Plazo de pago voluntario:</strong> 30 días naturales
      </div>
      <div style="margin-top:10px;padding:8px 10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;font-size:.75rem;color:#dc2626">
        Sin pago → Procedimiento ejecutivo automático
      </div>
    </div>`,

    'extracto-bancario': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">EXTRACTO DE CUENTA CORRIENTE</div>
        <div style="font-size:.78rem;color:#565c64">${datos.banco||""} · ${(datos.mes||"").toUpperCase()} ${new Date().getFullYear()}</div>
        <div style="font-size:.75rem;font-family:var(--mono)">${datos.iban||""}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:.78rem;margin-bottom:12px;text-align:center">
        <div style="padding:8px;background:#edfaf3;border-radius:4px"><div style="font-size:.68rem;color:#767d87">SALDO INICIAL</div><div style="font-weight:700">${fmtD(datos.saldoInicial)} €</div></div>
        <div style="padding:8px;background:#edfaf3;border-radius:4px"><div style="font-size:.68rem;color:#767d87">SALDO FINAL</div><div style="font-weight:800;color:${parseFloat(datos.saldoFinal)>=0?'#1a6535':'#dc2626'}">${fmtD(datos.saldoFinal)} €</div></div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.75rem">
        <thead><tr style="background:#134a28;color:white"><th style="padding:4px 6px">Concepto</th><th style="padding:4px 6px;text-align:right">Cargos</th><th style="padding:4px 6px;text-align:right">Abonos</th></tr></thead>
        <tbody>
          <tr><td style="padding:4px 6px">Total cargos del período</td><td style="padding:4px 6px;text-align:right;color:#dc2626">-${fmtD(datos.cargos)} €</td><td></td></tr>
          <tr><td style="padding:4px 6px">Total abonos del período</td><td></td><td style="padding:4px 6px;text-align:right;color:#1a6535">+${fmtD(datos.abonos)} €</td></tr>
        </tbody>
      </table>
      <div style="font-size:.72rem;color:#959da8;margin-top:8px">Conciliar con cuenta 572 (Bancos) en Contasol</div>
    </div>`,

    'despido': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">DOCUMENTO DE LIQUIDACIÓN Y FINIQUITO</div>
        <div style="font-size:.78rem;color:#565c64">Extinción de contrato · Fecha efectos: ${datos.fecha||hoy}</div>
      </div>
      <div style="font-size:.8rem;line-height:2">
        <strong>EMPRESA:</strong> (Tu empresa) · CIF: (Tu CIF)<br>
        <strong>TRABAJADOR/A:</strong> ${datos.nombreEmp||""}<br>
        <strong>CATEGORÍA:</strong> ${datos.categoria||""}<br>
        <strong>CAUSA:</strong> ${datos.motivo||""}<br>
        <strong>FECHA DE EFECTOS:</strong> ${datos.fecha||""}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin:12px 0">
        <thead><tr style="background:#134a28;color:white"><th style="padding:5px 8px;text-align:left">Concepto</th><th style="padding:5px 8px;text-align:right">Importe</th></tr></thead>
        <tbody>
          <tr><td style="padding:5px 8px">Vacaciones pendientes (${datos.vacaciones||0} días)</td><td style="padding:5px 8px;text-align:right">${fmtD((parseFloat(datos.salario||0)/30)*(datos.vacaciones||0))} €</td></tr>
          <tr><td style="padding:5px 8px">Parte proporcional pagas extras</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.pagasProp)} €</td></tr>
          <tr><td style="padding:5px 8px">Indemnización (si procede)</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.indemnizacion)} €</td></tr>
        </tbody>
      </table>
      <div style="margin-top:10px;padding:8px 10px;background:#fef9ec;border:1px solid #fde68a;border-radius:4px;font-size:.75rem;color:#92400e">
        ⚠️ Tramitar baja SS (TA.2), comunicar al SEPE y calcular finiquito en Nominasol
      </div>
    </div>`,

    'factura-suministros': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">FACTURA DE SUMINISTROS</div>
        <div style="font-size:.82rem;color:#565c64">${datos.empresa||""} · Nº ${datos.numDoc||""}</div>
        <div style="font-size:.75rem;color:#565c64">Período: ${datos.periodo||""}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:.78rem;margin-bottom:14px">
        <div><strong>PROVEEDOR</strong><br>${datos.empresa||""}</div>
        <div><strong>CLIENTE</strong><br>(Tu empresa)<br>(Tu CIF)</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin-bottom:12px">
        <thead><tr style="background:#134a28;color:white"><th style="padding:6px 8px;text-align:left">Servicio</th><th style="padding:6px 8px;text-align:right">Base</th><th style="padding:6px 8px;text-align:right">IVA</th><th style="padding:6px 8px;text-align:right">Total</th></tr></thead>
        <tbody><tr><td style="padding:6px 8px">${datos.tipoSuministro||"Suministro"} — ${datos.periodo||""}</td>
          <td style="padding:6px 8px;text-align:right">${fmtD(datos.base)} €</td>
          <td style="padding:6px 8px;text-align:right">${datos.tipoIVA||21}%</td>
          <td style="padding:6px 8px;text-align:right">${fmtD(datos.total)} €</td>
        </tr></tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right;padding:4px 8px;font-size:.75rem;color:#767d87">Base imponible:</td><td colspan="2" style="text-align:right;padding:4px 8px">${fmtD(datos.base)} €</td></tr>
          <tr><td colspan="2" style="text-align:right;padding:4px 8px;font-size:.75rem;color:#767d87">IVA (${datos.tipoIVA||21}%):</td><td colspan="2" style="text-align:right;padding:4px 8px">${fmtD(datos.cuotaIVA)} €</td></tr>
          <tr style="background:#edfaf3"><td colspan="2" style="text-align:right;padding:6px 8px;font-weight:700">TOTAL:</td><td colspan="2" style="text-align:right;padding:6px 8px;font-weight:800;font-size:.95rem">${fmtD(datos.total)} €</td></tr>
        </tfoot>
      </table>
      <div style="font-size:.75rem;color:#767d87;border-top:1px solid #d6dce3;padding-top:8px">
        <strong>Forma de pago:</strong> Domiciliación bancaria el día ${datos.diaCargo||5} del mes
      </div>
      <div style="font-size:.72rem;color:#959da8;margin-top:8px">Contabilizar en cuenta ${datos.cuenta||'628'} + 472 IVA soportado en Contasol</div>
    </div>`,

    'seguro-anual': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #1e40af;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#1e40af">PÓLIZA DE SEGURO</div>
        <div style="font-size:.82rem;color:#565c64">${datos.aseguradora||""}</div>
        <div style="font-size:.75rem;color:#565c64">Nº ${datos.numPoliza||""}</div>
      </div>
      <div style="font-size:.8rem;line-height:2">
        <strong>ASEGURADO:</strong> (Tu empresa) · CIF: (Tu CIF)<br>
        <strong>TIPO DE SEGURO:</strong> ${datos.tipoSeguro||""}<br>
        <strong>PERÍODO:</strong> ${datos.periodo||""}<br>
        <strong>PRIMA ANUAL:</strong> ${fmtD(datos.prima)} €<br>
        <strong>FORMA DE PAGO:</strong> ${datos.formaPago||""}
      </div>
      <div style="margin-top:10px;padding:8px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;font-size:.75rem;color:#1e40af">
        ℹ️ Contabilizar prima en cuenta 625 (Primas de seguros). Si cubre más de un ejercicio, periodificar con cuenta 480 (Gastos anticipados) en Contasol
      </div>
    </div>`,

    'seguro-trabajadores': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #1e40af;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#1e40af">SEGURO MÉDICO COLECTIVO</div>
        <div style="font-size:.82rem;color:#565c64">${datos.aseguradora||""}</div>
      </div>
      <div style="font-size:.8rem;line-height:2">
        <strong>EMPRESA TOMADORA:</strong> (Tu empresa)<br>
        <strong>COBERTURA:</strong> ${datos.cobertura||""}<br>
        <strong>Nº EMPLEADOS ASEGURADOS:</strong> ${datos.numEmpleados||""}<br>
        <strong>PRIMA POR EMPLEADO/MES:</strong> ${fmtD(datos.primaMensual)} €<br>
        <strong>PRIMA TOTAL MENSUAL:</strong> ${fmtD(datos.primaTotal)} €<br>
        <strong>PRIMA TOTAL ANUAL:</strong> ${fmtD(parseFloat(datos.primaTotal||0)*12)} €
      </div>
      <div style="margin-top:10px;padding:8px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;font-size:.75rem;color:#1e40af">
        ℹ️ Retribución en especie exenta hasta 500 €/año/empleado (art. 42.3.c LIRPF). Registrar en Nominasol y contabilizar en cuenta 649 en Contasol
      </div>
    </div>`,

    'reparacion-inmovilizado': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">FACTURA DE REPARACIÓN</div>
        <div style="font-size:.78rem;color:#565c64">${datos.empresa||""} · ${hoy}</div>
      </div>
      <div style="font-size:.8rem;line-height:1.8;margin-bottom:12px">
        <strong>Bien reparado:</strong> ${datos.bien||""}<br>
        <strong>Avería:</strong> ${datos.averia||""}<br>
        <strong>Trabajos realizados:</strong> ${datos.trabajos||""}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin-bottom:12px">
        <thead><tr style="background:#134a28;color:white"><th style="padding:5px 8px;text-align:left">Concepto</th><th style="padding:5px 8px;text-align:right">Importe</th></tr></thead>
        <tbody>
          <tr><td style="padding:5px 8px">Materiales</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.materiales)} €</td></tr>
          <tr><td style="padding:5px 8px">Mano de obra</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.manoObra)} €</td></tr>
          <tr><td style="padding:5px 8px;font-weight:600">Base imponible</td><td style="padding:5px 8px;text-align:right;font-weight:600">${fmtD(datos.base)} €</td></tr>
          <tr><td style="padding:5px 8px">IVA (21%)</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.cuotaIVA)} €</td></tr>
        </tbody>
        <tfoot><tr style="background:#134a28;color:white;font-weight:800"><td style="padding:6px 8px">TOTAL</td><td style="padding:6px 8px;text-align:right">${fmtD(datos.total)} €</td></tr></tfoot>
      </table>
      <div style="padding:8px 10px;background:#fef9ec;border:1px solid #fde68a;border-radius:4px;font-size:.75rem;color:#92400e">
        ⚠️ Determina si es mantenimiento (cuenta 622 + 472) o mejora del bien (mayor valor del inmovilizado) en Contasol
      </div>
    </div>`,

    'adquisicion-inmovilizado': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">FACTURA DE ADQUISICIÓN DE INMOVILIZADO</div>
        <div style="font-size:.78rem;color:#565c64">${datos.proveedor||""} · Entrega: ${datos.fechaEntrega||""}</div>
      </div>
      <div style="font-size:.8rem;line-height:1.8;margin-bottom:12px">
        <strong>Bien adquirido:</strong> ${datos.bien||""}<br>
        <strong>Descripción:</strong> ${datos.descripcion||""}<br>
        <strong>Vida útil estimada:</strong> ${datos.vidaUtil||""} años<br>
        <strong>Cuenta contable:</strong> ${datos.cuenta||"21X"}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin-bottom:12px">
        <thead><tr style="background:#134a28;color:white"><th style="padding:5px 8px;text-align:left">Concepto</th><th style="padding:5px 8px;text-align:right">Importe</th></tr></thead>
        <tbody>
          <tr><td style="padding:5px 8px">Precio neto del bien</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.base)} €</td></tr>
          <tr><td style="padding:5px 8px">IVA bienes de inversión (${datos.tipoIVA||21}%)</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.cuotaIVA)} €</td></tr>
        </tbody>
        <tfoot><tr style="background:#134a28;color:white;font-weight:800"><td style="padding:6px 8px">TOTAL FACTURA</td><td style="padding:6px 8px;text-align:right">${fmtD(datos.total)} €</td></tr></tfoot>
      </table>
      <div style="font-size:.75rem;color:#767d87;margin-bottom:8px"><strong>Forma de pago:</strong> ${datos.formaPago||""}</div>
      <div style="padding:8px 10px;background:#edfaf3;border:1px solid #86efac;border-radius:4px;font-size:.75rem;color:#166534">
        ✓ IVA de bienes de inversión (${fmtD(datos.cuotaIVA)} €) deducible al 100% en el Modelo 303. Contabilizar: cuenta ${datos.cuenta||"21X"} (debe) + 472 IVA soportado / 400 Proveedores o 172 Deudas LP (haber)
      </div>
    </div>`,

    'venta-inmovilizado': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #134a28;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#134a28">VENTA DE INMOVILIZADO</div>
        <div style="font-size:.78rem;color:#565c64">${hoy}</div>
      </div>
      <div style="font-size:.8rem;line-height:1.8;margin-bottom:12px">
        <strong>Bien vendido:</strong> ${datos.bien||""}<br>
        <strong>Comprador:</strong> ${datos.comprador||""}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin-bottom:12px">
        <thead><tr style="background:#134a28;color:white"><th style="padding:5px 8px;text-align:left">Concepto</th><th style="padding:5px 8px;text-align:right">Importe</th></tr></thead>
        <tbody>
          <tr><td style="padding:5px 8px">Valor de adquisición</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.valorAdq)} €</td></tr>
          <tr><td style="padding:5px 8px">(-) Amortización acumulada</td><td style="padding:5px 8px;text-align:right;color:#dc2626">-${fmtD(datos.amorAcum)} €</td></tr>
          <tr style="font-weight:600"><td style="padding:5px 8px">Valor neto contable</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.vnc)} €</td></tr>
          <tr><td style="padding:5px 8px">Precio de venta (sin IVA)</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.precioVenta)} €</td></tr>
          <tr><td style="padding:5px 8px">IVA (21%)</td><td style="padding:5px 8px;text-align:right">${fmtD(datos.ivaVenta)} €</td></tr>
        </tbody>
        <tfoot><tr style="background:#134a28;color:white;font-weight:800"><td style="padding:6px 8px">TOTAL FACTURA</td><td style="padding:6px 8px;text-align:right">${fmtD(datos.totalVenta)} €</td></tr></tfoot>
      </table>
      <div style="padding:8px 10px;background:${parseFloat(datos.resultado||0)>=0?'#edfaf3':'#fee2e2'};border:1px solid ${parseFloat(datos.resultado||0)>=0?'#86efac':'#fca5a5'};border-radius:4px;font-size:.75rem;color:${parseFloat(datos.resultado||0)>=0?'#166534':'#dc2626'}">
        ${parseFloat(datos.resultado||0)>=0?'✓ BENEFICIO':'✗ PÉRDIDA'} en la venta: ${fmtD(Math.abs(parseFloat(datos.resultado||0)))} € → cuenta ${parseFloat(datos.resultado||0)>=0?'770 Beneficios procedentes del inmovilizado':'671 Pérdidas procedentes del inmovilizado'}
      </div>
    </div>`,

    'factura-rectificativa-compra': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #b45309;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#b45309">FACTURA RECTIFICATIVA DE COMPRA</div>
        <div style="font-size:.78rem;color:#565c64">Nº ${datos.numRect||""} · Rectifica: ${datos.numOrig||""} (${datos.fechaOrig||(datos.fecha||"")})</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:.78rem;margin-bottom:14px">
        <div><strong>PROVEEDOR</strong><br>${datos.proveedor||""}</div>
        <div><strong>CLIENTE</strong><br>(Tu empresa)<br>(Tu CIF)</div>
      </div>
      <div style="font-size:.8rem;margin-bottom:12px;padding:8px;background:#fef9ec;border-radius:4px;color:#92400e">
        <strong>Motivo:</strong> ${datos.motivo||""}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin-bottom:12px">
        <thead><tr style="background:#b45309;color:white"><th style="padding:5px 8px;text-align:left">Concepto</th><th style="padding:5px 8px;text-align:right">Importe</th></tr></thead>
        <tbody>
          <tr><td style="padding:5px 8px">Base imponible rectificada</td><td style="padding:5px 8px;text-align:right;color:#dc2626">-${fmtD(datos.base)} €</td></tr>
          <tr><td style="padding:5px 8px">IVA (${datos.tipoIVA||21}%) rectificado</td><td style="padding:5px 8px;text-align:right;color:#dc2626">-${fmtD(datos.cuotaIVA)} €</td></tr>
        </tbody>
        <tfoot><tr style="background:#b45309;color:white;font-weight:800"><td style="padding:6px 8px">TOTAL A ABONAR</td><td style="padding:6px 8px;text-align:right">-${fmtD(datos.total)} €</td></tr></tfoot>
      </table>
      <div style="font-size:.72rem;color:#959da8">Registrar en Factusol y contabilizar: 400 Proveedores (debe) / 608 Devoluciones de compras + 472 IVA soportado (haber)</div>
    </div>`,

    'factura-rectificativa-venta': `<div style="${estiloDoc}">
      <div style="text-align:center;border-bottom:2px solid #b45309;padding-bottom:10px;margin-bottom:14px">
        <div style="font-size:1rem;font-weight:800;color:#b45309">FACTURA RECTIFICATIVA DE VENTA</div>
        <div style="font-size:.78rem;color:#565c64">Nº ${datos.numRect||""} · Rectifica: ${datos.numOrig||""} (${datos.fechaOrig||(datos.fecha||"")})</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:.78rem;margin-bottom:14px">
        <div><strong>EMISOR</strong><br>(Tu empresa)<br>(Tu CIF)</div>
        <div><strong>CLIENTE</strong><br>${datos.cliente||""}</div>
      </div>
      <div style="font-size:.8rem;margin-bottom:12px;padding:8px;background:#fef9ec;border-radius:4px;color:#92400e">
        <strong>Motivo:</strong> ${datos.motivo||""}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;margin-bottom:12px">
        <thead><tr style="background:#b45309;color:white"><th style="padding:5px 8px;text-align:left">Concepto</th><th style="padding:5px 8px;text-align:right">Importe</th></tr></thead>
        <tbody>
          <tr><td style="padding:5px 8px">Base imponible rectificada</td><td style="padding:5px 8px;text-align:right;color:#dc2626">-${fmtD(datos.base)} €</td></tr>
          <tr><td style="padding:5px 8px">IVA (${datos.tipoIVA||21}%) rectificado</td><td style="padding:5px 8px;text-align:right;color:#dc2626">-${fmtD(datos.cuotaIVA)} €</td></tr>
        </tbody>
        <tfoot><tr style="background:#b45309;color:white;font-weight:800"><td style="padding:6px 8px">TOTAL ABONO</td><td style="padding:6px 8px;text-align:right">-${fmtD(datos.total)} €</td></tr></tfoot>
      </table>
      <div style="font-size:.72rem;color:#959da8">Emitir en Factusol y contabilizar: 708 Devoluciones de ventas + 477 IVA repercutido (debe) / 430 Clientes (haber)</div>
    </div>`,
  };

  return docs[tipo] || `<div style="${estiloDoc}"><p>Documento: ${tipo}</p></div>`;
}

/* ── Modal de documento adjunto ──────────────────────────── */
function verDocumentoAdjunto(correoId) {
  const correo = EMPRESA_STATE.mensajeria.correos.find(c => c.id === correoId);
  if (!correo || !correo.documento) return;
  const doc = correo.documento;
  const html = `
  <div style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem" id="doc-modal-overlay" onclick="if(event.target.id==='doc-modal-overlay')cerrarDocModal()">
    <div style="background:white;border-radius:var(--radio-lg);width:100%;max-width:640px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.25)">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--gris-200);position:sticky;top:0;background:white;z-index:10">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.2rem">${TIPOS_SITUACION.find(t=>t.id===doc.tipo)?.icono||'📄'}</span>
          <div>
            <div style="font-size:.875rem;font-weight:700;color:var(--gris-800)">${doc.label}</div>
            <div style="font-size:.72rem;color:var(--gris-500)">Registrar en: ${doc.software}</div>
          </div>
        </div>
        <button onclick="cerrarDocModal()" style="border:none;background:var(--gris-100);border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:.9rem">✕</button>
      </div>
      <div style="padding:16px 18px">
        ${renderDocumento(doc.tipo, doc.datos)}
        <div style="margin-top:12px;padding:10px 14px;background:var(--verde-50);border-radius:var(--radio-md);border:1px solid var(--verde-200);font-size:.8rem;color:var(--verde-800)">
          💡 <strong>Qué debes hacer:</strong> ${TIPOS_SITUACION.find(t=>t.id===doc.tipo)?.desc||'Gestionar en el software indicado'}
        </div>
      </div>
    </div>
  </div>`;
  const div = document.createElement('div');
  div.id = 'doc-modal-root';
  div.innerHTML = html;
  document.body.appendChild(div);
}
function cerrarDocModal() {
  const el = document.getElementById('doc-modal-root');
  if (el) el.remove();
}


function enviarSituacionGenerada(editado) {
  const gen = EMPRESA_STATE.generador;
  const dg  = gen.datosGenerados;
  if (!dg) return;

  const cuerpoFinal = editado !== undefined ? editado : dg.cuerpo;
  const ahora = new Date();
  const adjuntarDoc = document.getElementById('opt-con-doc')?.checked ?? gen.conDocumento;
  const permResp    = document.getElementById('opt-resp')?.checked ?? gen.permiteRespuesta;

  const correoNuevo = {
    id:           'sit-' + Date.now(),
    de:           dg.remitente,
    email:        (dg.remitente.toLowerCase().replace(/[^a-z]/g, '.') + '@empresa.es'),
    asunto:       dg.tipo.label + (dg.datos.numDoc ? ' · ' + dg.datos.numDoc : '') + (dg.datos.numRef ? ' · ' + dg.datos.numRef : ''),
    cuerpo:       cuerpoFinal,
    departamento: dg.dept,
    dificultad:   'intermedio',
    ra:           'RA6',
    fecha:        ahora.toLocaleDateString('es-ES'),
    hora:         ahora.toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'}),
    leido:        false,
    hilo:         [],
    anotacionProf: '',
    calificacion:  null,
    permiteRespuesta: permResp,
    documento: adjuntarDoc ? {
      tipo:     dg.tipo.id,
      label:    dg.tipo.label,
      software: dg.tipo.software,
      datos:    dg.datos,
      infoDoc:  dg.datos.infoDoc || '',
    } : null,
    origen:    'generador',
    grupoDest: dg.grupoDest || null,
  };

  EMPRESA_STATE.mensajeria.correos.unshift(correoNuevo);
  actualizarBadgeCorreos();
  sincronizarTareasDesdeCorreos(); // generar tarea en programa si tiene documento
  gen.historial.unshift({
    tipo: dg.tipo.label,
    dept: dg.dept,
    fecha: ahora.toLocaleDateString('es-ES'),
    hora:  ahora.toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'}),
    remitente: dg.remitente,
  });

  gen.datosGenerados = null;
  gen.vistaActiva = 'panel';
  renderGenerador();
  mostrarToast('📧 Situación enviada al buzón de ' + (DEPT_CORREO[dg.dept]?.nombre || dg.dept), 'exito');
}

/* ── Render del generador ──────────────────────────────────── */
function renderGenerador() {
  const el = document.getElementById('contenido-principal');
  if (!el) return;
  // El generador puede estar embebido en mensajería o como vista propia
  if (APP.moduloActual === 'mensajeria') {
    el.innerHTML = vistaMensajeria();
  } else {
    APP.moduloActual = 'generador';
    el.innerHTML = vistaGenerador();
  }
}

/* ── Vista del generador ───────────────────────────────────── */

/* ============================================================
   SISTEMA DE ENVÍO MASIVO PROGRAMADO
   ============================================================ */

function vistaProgramador() {
  const P = EMPRESA_STATE.programador;

  if (P.activo && P.calendario.length > 0) {
    return vistaCalendarioProgramado(P);
  }

  // Todos los tipos disponibles
  const tipos = TIPOS_SITUACION;
  const selTodos = P.tiposSeleccionados.length === 0;

  return `
  <div class="seccion-header">
    <div>
      <h2>📅 Programar simulación</h2>
      <p>Genera un calendario de situaciones y confírmalo antes de enviar</p>
    </div>
  </div>

  <div class="grid-2col">
    <!-- Configuración -->
    <div class="ficha-card">
      <div class="ficha-card-header"><span>⚙️</span> Configuración de la simulación</div>

      <div class="ficha-grid-2" style="gap:10px;margin-bottom:12px">
        <div class="ficha-campo">
          <label>Fecha de inicio</label>
          <input type="date" class="ficha-input" value="${P.fechaInicio}"
            oninput="EMPRESA_STATE.programador.fechaInicio=this.value">
        </div>
        <div class="ficha-campo">
          <label>Fecha de fin</label>
          <input type="date" class="ficha-input" value="${P.fechaFin}"
            oninput="EMPRESA_STATE.programador.fechaFin=this.value">
        </div>
      </div>

      <div class="ficha-campo" style="margin-bottom:12px">
        <label>Intensidad diaria por grupo</label>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
          ${[['baja','🟢 Baja','1-2 situaciones/día'],['media','🟡 Media','3-4 situaciones/día'],['alta','🔴 Alta','5-7 situaciones/día']].map(([val,lbl,desc])=>`
          <div style="padding:10px;border:1.5px solid ${P.intensidad===val?'var(--verde-500)':'var(--gris-200)'};border-radius:var(--radio-md);cursor:pointer;background:${P.intensidad===val?'var(--verde-50)':'var(--blanco)'};text-align:center"
            onclick="EMPRESA_STATE.programador.intensidad='${val}';vistaProgramadorRefresh()">
            <div style="font-size:.85rem;font-weight:600">${lbl}</div>
            <div style="font-size:.7rem;color:var(--gris-500)">${desc}</div>
          </div>`).join('')}
        </div>
      </div>

      <div class="ficha-campo">
        <label>Tipos de situaciones a incluir
          <button class="btn-secundario" style="margin-left:8px;padding:2px 8px;font-size:.72rem"
            onclick="EMPRESA_STATE.programador.tiposSeleccionados=[];vistaProgramadorRefresh()">
            Todos
          </button>
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;max-height:280px;overflow-y:auto">
          ${tipos.map(t => {
            const sel = P.tiposSeleccionados.length === 0 || P.tiposSeleccionados.includes(t.id);
            return `
            <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:6px;cursor:pointer;
              background:${sel?'var(--verde-50)':'var(--gris-50)'};border:1px solid ${sel?'var(--verde-300)':'var(--gris-200)'}"
              onclick="toggleTipoProgramador('${t.id}');vistaProgramadorRefresh()">
              <span style="font-size:.85rem">${t.icono}</span>
              <span style="font-size:.75rem;font-weight:500;color:${sel?'var(--verde-800)':'var(--gris-600)'}">${t.label}</span>
              ${sel?'<span style="margin-left:auto;color:var(--verde-500);font-size:.7rem">✓</span>':''}
            </div>`;
          }).join('')}
        </div>
      </div>

      <button class="btn-accion" style="width:100%;margin-top:12px"
        onclick="generarCalendarioProgramado()">
        📅 Generar calendario de envíos
      </button>
    </div>

    <!-- Info y resumen -->
    <div style="display:flex;flex-direction:column;gap:1rem">
      <div class="ficha-card" style="background:var(--verde-50);border-color:var(--verde-300)">
        <div class="ficha-card-header"><span>💡</span> Cómo funciona</div>
        <div style="font-size:.82rem;color:var(--verde-800);line-height:1.7">
          <p>1. Define el rango de fechas y la intensidad</p>
          <p>2. La app genera automáticamente el calendario con situaciones variadas y realistas distribuidas por departamento</p>
          <p>3. Revisas el calendario completo — puedes eliminar o reordenar situaciones</p>
          <p>4. Al confirmar, las situaciones se van "desbloqueando" día a día en el buzón del alumno</p>
        </div>
      </div>
      <div class="ficha-card">
        <div class="ficha-card-header"><span>📊</span> Estimación</div>
        ${P.fechaInicio && P.fechaFin ? (() => {
          const d1 = new Date(P.fechaInicio), d2 = new Date(P.fechaFin);
          const dias = Math.max(0, Math.round((d2-d1)/(1000*60*60*24)));
          const diasLab = Math.round(dias * 5/7);
          const porDia = {baja:1.5, media:3.5, alta:6}[P.intensidad]||3.5;
          const total = Math.round(diasLab * porDia);
          return `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:center">
            <div style="padding:10px;background:var(--gris-50);border-radius:var(--radio-md)">
              <div style="font-size:1.4rem;font-weight:800;color:var(--verde-700)">${diasLab}</div>
              <div style="font-size:.72rem;color:var(--gris-500)">días laborables</div>
            </div>
            <div style="padding:10px;background:var(--gris-50);border-radius:var(--radio-md)">
              <div style="font-size:1.4rem;font-weight:800;color:var(--verde-700)">~${total}</div>
              <div style="font-size:.72rem;color:var(--gris-500)">situaciones totales</div>
            </div>
          </div>`;
        })() : '<p style="font-size:.82rem;color:var(--gris-400);text-align:center;padding:1rem">Selecciona fechas para ver la estimación</p>'}
      </div>
    </div>
  </div>`;
}

function toggleTipoProgramador(tipoId) {
  const P = EMPRESA_STATE.programador;
  const todos = TIPOS_SITUACION.map(t => t.id);
  if (P.tiposSeleccionados.length === 0) {
    // Estaban todos — deseleccionar este
    P.tiposSeleccionados = todos.filter(id => id !== tipoId);
  } else if (P.tiposSeleccionados.includes(tipoId)) {
    P.tiposSeleccionados = P.tiposSeleccionados.filter(id => id !== tipoId);
  } else {
    P.tiposSeleccionados.push(tipoId);
    if (P.tiposSeleccionados.length === todos.length) P.tiposSeleccionados = [];
  }
}

function generarCalendarioProgramado() {
  const P = EMPRESA_STATE.programador;
  if (!P.fechaInicio || !P.fechaFin) {
    mostrarToast('Selecciona fechas de inicio y fin', 'error'); return;
  }
  const d1 = new Date(P.fechaInicio), d2 = new Date(P.fechaFin);
  if (d2 <= d1) { mostrarToast('La fecha de fin debe ser posterior al inicio', 'error'); return; }

  const tiposDisp = P.tiposSeleccionados.length > 0
    ? TIPOS_SITUACION.filter(t => P.tiposSeleccionados.includes(t.id))
    : TIPOS_SITUACION;

  const rangoSits = {baja:[1,2], media:[3,4], alta:[5,7]}[P.intensidad]||[3,4];
  const calendario = [];

  // Generar día a día (solo laborables)
  const cur = new Date(d1);
  while (cur <= d2) {
    const diaSemana = cur.getDay();
    if (diaSemana > 0 && diaSemana < 6) { // Lunes-Viernes
      const numSits = rangoSits[0] + Math.floor(Math.random()*(rangoSits[1]-rangoSits[0]+1));
      const situaciones = [];
      for (let i = 0; i < numSits; i++) {
        const tipo = tiposDisp[Math.floor(Math.random()*tiposDisp.length)];
        const datos = tipo.genDatos();
        situaciones.push({
          tipoId: tipo.id, tipoLabel: tipo.label, tipoIcono: tipo.icono,
          dept: tipo.dept, software: tipo.software,
          datos: datos, confirmada: true,
          id: 'prog-'+Date.now()+'-'+Math.random().toString(36).substr(2,6),
        });
      }
      calendario.push({
        fecha: cur.toISOString().slice(0,10),
        fechaDisplay: cur.toLocaleDateString('es-ES', {weekday:'short',day:'numeric',month:'short'}),
        situaciones,
        enviado: false,
      });
    }
    cur.setDate(cur.getDate()+1);
  }

  P.calendario = calendario;
  P.activo = true;
  P.vistaSemana = 0;
  vistaProgramadorRefresh();
  mostrarToast('✓ Calendario generado — revisa y confirma cada día', 'exito');
}

function vistaCalendarioProgramado(P) {
  const DIAS_POR_PAGINA = 5;
  const inicio = P.vistaSemana * DIAS_POR_PAGINA;
  const semana = P.calendario.slice(inicio, inicio + DIAS_POR_PAGINA);
  const totalDias = P.calendario.length;
  const totalSits = P.calendario.reduce((s,d)=>s+d.situaciones.length,0);
  const enviados  = P.calendario.filter(d=>d.enviado).reduce((s,d)=>s+d.situaciones.length,0);
  const DEPT_ICO = {direccion:'🎯',rrhh:'👥',comercial:'🧾',contabilidad:'📊',fiscal:'⚖️'};

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <h3 style="font-size:1rem;font-weight:700;color:var(--gris-800)">📅 Calendario de simulación</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">${P.fechaInicio} → ${P.fechaFin} · ${totalDias} días · ${totalSits} situaciones · ${enviados} enviadas</p>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn-secundario" onclick="EMPRESA_STATE.programador.activo=false;EMPRESA_STATE.programador.calendario=[];vistaProgramadorRefresh()">✕ Descartar</button>
      <button class="btn-accion" onclick="enviarDiasPendientes()">📤 Enviar días pendientes</button>
    </div>
  </div>

  <!-- Barra de progreso -->
  <div style="background:var(--blanco);border:1px solid var(--gris-200);border-radius:var(--radio-lg);padding:10px 16px;margin-bottom:1rem">
    <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:4px">
      <span style="color:var(--gris-600)">Situaciones enviadas</span>
      <span style="font-weight:700">${enviados} / ${totalSits}</span>
    </div>
    <div class="progreso-bar"><div class="progreso-fill" style="width:${totalSits>0?Math.round(enviados/totalSits*100):0}%"></div></div>
  </div>

  <!-- Navegación por semanas -->
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <button class="btn-secundario" style="padding:6px 12px;font-size:.82rem" ${inicio===0?'disabled':''} onclick="EMPRESA_STATE.programador.vistaSemana--;vistaProgramadorRefresh()">← Anterior</button>
    <span style="font-size:.82rem;color:var(--gris-600)">Semana ${P.vistaSemana+1} de ${Math.ceil(totalDias/DIAS_POR_PAGINA)}</span>
    <button class="btn-secundario" style="padding:6px 12px;font-size:.82rem" ${inicio+DIAS_POR_PAGINA>=totalDias?'disabled':''} onclick="EMPRESA_STATE.programador.vistaSemana++;vistaProgramadorRefresh()">Siguiente →</button>
  </div>

  <!-- Días de la semana -->
  <div style="display:grid;grid-template-columns:repeat(${semana.length},1fr);gap:8px">
    ${semana.map((dia, dIdx) => `
    <div style="border:1.5px solid ${dia.enviado?'var(--verde-300)':'var(--gris-200)'};border-radius:var(--radio-lg);overflow:hidden;background:${dia.enviado?'var(--verde-50)':'var(--blanco)'}">
      <div style="padding:8px 10px;background:${dia.enviado?'var(--verde-600)':'var(--gris-800)'};color:white;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:.78rem;font-weight:700">${dia.fechaDisplay}</span>
        ${dia.enviado
          ? `<span style="font-size:.68rem;background:rgba(255,255,255,.2);padding:1px 6px;border-radius:20px">✓ Enviado</span>`
          : `<button style="font-size:.68rem;background:rgba(255,255,255,.2);border:none;color:white;padding:2px 8px;border-radius:20px;cursor:pointer"
              onclick="enviarDia(${inicio+dIdx})">Enviar</button>`}
      </div>
      <div style="padding:6px">
        ${dia.situaciones.map((s, sIdx) => `
        <div style="display:flex;align-items:center;gap:5px;padding:5px 6px;margin-bottom:3px;border-radius:6px;background:${s.confirmada?'var(--gris-50)':'#fff5f5'};border:1px solid ${s.confirmada?'var(--gris-200)':'#fca5a5'}">
          <span style="font-size:.85rem;flex-shrink:0">${s.tipoIcono}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:.68rem;font-weight:600;color:var(--gris-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.tipoLabel}</div>
            <div style="font-size:.62rem;color:var(--gris-400)">${DEPT_ICO[s.dept]||''} ${s.dept}</div>
          </div>
          ${!dia.enviado ? `<button style="border:none;background:transparent;cursor:pointer;color:var(--rojo);font-size:.75rem;padding:0;flex-shrink:0"
            onclick="eliminarSituacionProgramada(${inicio+dIdx},${sIdx})">✕</button>` : ''}
        </div>`).join('')}
        ${!dia.enviado ? `
        <div id="selector-dia-${inicio+dIdx}" style="display:none;margin-top:4px">
          <div style="font-size:.65rem;font-weight:700;color:var(--gris-500);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;padding:0 2px">Elige el tipo de situación</div>
          ${['comercial','contabilidad','rrhh','fiscal','direccion'].map(dept => {
            const tiposDept = TIPOS_SITUACION.filter(t => t.dept === dept);
            if (!tiposDept.length) return '';
            const DEPT_NOM = {comercial:'🧾 Comercial',contabilidad:'📊 Contabilidad',rrhh:'👥 RRHH',fiscal:'⚖️ Fiscal',direccion:'🎯 Dirección'};
            return `<div style="margin-bottom:4px">
              <div style="font-size:.6rem;font-weight:700;color:var(--gris-400);padding:2px 4px">${DEPT_NOM[dept]}</div>
              ${tiposDept.map(t => `
              <button onclick="confirmarAddSituacion(${inicio+dIdx},'${t.id}')"
                style="display:flex;align-items:center;gap:5px;width:100%;padding:4px 6px;border:none;
                  background:transparent;border-radius:4px;cursor:pointer;text-align:left;font-size:.68rem;color:var(--gris-700)"
                onmouseover="this.style.background='var(--verde-50)';this.style.color='var(--verde-800)'"
                onmouseout="this.style.background='transparent';this.style.color='var(--gris-700)'">
                <span>${t.icono}</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.label}</span>
              </button>`).join('')}
            </div>`;
          }).join('')}
          <button onclick="document.getElementById('selector-dia-${inicio+dIdx}').style.display='none'"
            style="width:100%;padding:3px;font-size:.65rem;border:1px solid var(--gris-200);background:transparent;border-radius:4px;cursor:pointer;color:var(--gris-400);margin-top:2px">
            Cancelar
          </button>
        </div>
        <button id="btn-add-dia-${inicio+dIdx}"
          style="width:100%;padding:3px;font-size:.68rem;border:1px dashed var(--gris-300);background:transparent;border-radius:4px;cursor:pointer;color:var(--gris-400);margin-top:4px"
          onclick="document.getElementById('selector-dia-${inicio+dIdx}').style.display='block';this.style.display='none'">
          + añadir
        </button>` : ''}
      </div>
    </div>`).join('')}
  </div>`;
}

function enviarDia(dIdx) {
  const dia = EMPRESA_STATE.programador.calendario[dIdx];
  if (!dia) return;
  const ahora = new Date();
  dia.situaciones.filter(s => s.confirmada).forEach(s => {
    const tipo = TIPOS_SITUACION.find(t => t.id === s.tipoId);
    if (!tipo) return;
    const cuerpo = generarCuerpoFallback(tipo, EMPRESA_STATE.datos.nombre||'la empresa', EMPRESA_STATE.config?.sector||'agroalimentario', s.datos);
    EMPRESA_STATE.mensajeria.correos.unshift({
      id: s.id, de: s.datos.empresa||s.datos.nombreEmp||s.datos.aseguradora||s.datos.proveedor||'Remitente',
      email: 'notificacion@simulapp.es',
      asunto: s.tipoLabel + (s.datos.numDoc?' · '+s.datos.numDoc:s.datos.numRect?' · '+s.datos.numRect:s.datos.numPoliza?' · '+s.datos.numPoliza:''),
      cuerpo,
      departamento: s.dept,
      dificultad: 'intermedio', ra: 'RA6',
      fecha: new Date(dia.fecha+'T12:00:00').toLocaleDateString('es-ES'),
      hora: ahora.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}),
      leido: false, hilo: [], anotacionProf: '', calificacion: null,
      permiteRespuesta: true,
      documento: { tipo: s.tipoId, label: s.tipoLabel, software: s.software, datos: s.datos, infoDoc: s.datos.infoDoc||'' },
      origen: 'programado',
    });
  });
  dia.enviado = true;
  actualizarBadgeCorreos();
  vistaProgramadorRefresh();
  mostrarToast(`✓ ${dia.situaciones.length} situaciones enviadas (${dia.fechaDisplay})`, 'exito');
}

function enviarDiasPendientes() {
  const pendientes = EMPRESA_STATE.programador.calendario.filter(d => !d.enviado);
  if (pendientes.length === 0) { mostrarToast('No hay días pendientes de envío', 'error'); return; }
  // Enviar solo los días cuya fecha ya ha llegado o es hoy
  const hoy = new Date().toISOString().slice(0,10);
  const aEnviar = EMPRESA_STATE.programador.calendario
    .map((d,i) => ({...d, idx:i}))
    .filter(d => !d.enviado && d.fecha <= hoy);
  if (aEnviar.length === 0) {
    mostrarToast('Los días pendientes aún no han llegado — usa "Enviar" en cada día para adelantar', '');
    return;
  }
  aEnviar.forEach(d => enviarDia(d.idx));
  mostrarToast(`✓ ${aEnviar.length} días enviados automáticamente`, 'exito');
}

function eliminarSituacionProgramada(dIdx, sIdx) {
  EMPRESA_STATE.programador.calendario[dIdx].situaciones.splice(sIdx,1);
  vistaProgramadorRefresh();
}

function confirmarAddSituacion(dIdx, tipoId) {
  const tipo = TIPOS_SITUACION.find(t => t.id === tipoId);
  if (!tipo) return;
  const datos = tipo.genDatos();
  EMPRESA_STATE.programador.calendario[dIdx].situaciones.push({
    tipoId: tipo.id, tipoLabel: tipo.label, tipoIcono: tipo.icono,
    dept: tipo.dept, software: tipo.software, datos,
    confirmada: true,
    id: 'prog-'+Date.now()+'-'+Math.random().toString(36).substr(2,6),
  });
  vistaProgramadorRefresh();
}

function vistaProgramadorRefresh() {
  const el = document.getElementById('contenido-principal');
  if (el) el.innerHTML = vistaMensajeria();
}


function vistaGenerador() {
  const gen    = EMPRESA_STATE.generador;
  const esProf = APP.rolActivo !== 'alumno';
  const vista  = gen.vistaActiva;

  if (vista === 'previsualizacion' && gen.datosGenerados) {
    return vistaPrevisualizacion(gen.datosGenerados, esProf);
  }

  const GRUPOS_AULA = [
    {id:'G1', nombre:'Agrícola Vega Alta S.L.'},
    {id:'G2', nombre:'Distribuciones García S.L.'},
    {id:'G3', nombre:'Naranjas del Sur S.L.'},
    {id:'G4', nombre:'Cítricos Premium S.L.'},
    {id:'G5', nombre:'Agroservicios Cantillana S.L.'},
  ].filter(g => g.id !== (EMPRESA_STATE.config.grupoId || 'G1'));

  return `
  <div class="seccion-header">
    <div>
      <h2>⚡ Generador de situaciones</h2>
      <p>Genera situaciones reales con IA · Los correos llegan directamente al buzón del departamento</p>
    </div>
  </div>

  <div class="grid-2col">
    <!-- Panel de generación -->
    <div>
      ${esProf ? `
      <!-- PANEL PROFESOR -->
      <div class="ficha-card" style="margin-bottom:1rem">
        <div class="ficha-card-header"><span>👩‍🏫</span> Generar situación como profesor</div>
        <p style="font-size:.8rem;color:var(--gris-500);margin-bottom:12px">
          Elige el tipo de situación y el departamento destinatario. La IA generará el correo con datos aleatorios realistas.
          Podrás revisar y editar antes de enviarlo.
        </p>

        <div class="campo">
          <label>Tipo de situación</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
            ${TIPOS_SITUACION.map(t => `
            <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--radio-md);cursor:pointer;
              border:1.5px solid ${gen.tipoSel===t.id?'var(--verde-500)':'var(--gris-200)'};
              background:${gen.tipoSel===t.id?'var(--verde-50)':'var(--blanco)'};
              transition:all var(--transicion)"
              onclick="EMPRESA_STATE.generador.tipoSel='${t.id}';renderGenerador()">
              <span style="font-size:1.1rem">${t.icono}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:.78rem;font-weight:600;color:var(--gris-800)">${t.label}</div>
                <div style="font-size:.65rem;color:var(--gris-400)">${t.software}</div>
              </div>
              ${gen.tipoSel===t.id?'<span style="color:var(--verde-500);font-size:.9rem">✓</span>':''}
            </div>`).join('')}
          </div>
        </div>

        ${gen.tipoSel ? `
        <div class="campo" style="margin-top:10px">
          <label>Departamento destinatario</label>
          <select class="ficha-input" onchange="EMPRESA_STATE.generador.deptSel=this.value">
            <option value="">— Auto (según tipo) —</option>
            ${Object.entries(DEPT_CORREO).map(([k,d])=>`<option value="${k}" ${gen.deptSel===k?'selected':''}>${d.icono} ${d.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="campo">
          <label>Grupo destinatario (opcional)</label>
          <select class="ficha-input" onchange="EMPRESA_STATE.generador.grupoDest=this.value">
            <option value="">— Todos los grupos —</option>
            ${GRUPOS_AULA.map(g=>`<option value="${g.id}">${g.id} · ${g.nombre}</option>`).join('')}
          </select>
        </div>
        <button class="btn-accion" style="width:100%;margin-top:8px"
          onclick="generarSituacionIA(EMPRESA_STATE.generador.tipoSel, EMPRESA_STATE.generador.deptSel, EMPRESA_STATE.generador.grupoDest)"
          ${gen.generando?'disabled':''}>
          ${gen.generando ? '⏳ Generando con IA...' : '🤖 Generar y previsualizar'}
        </button>` : ''}
      </div>` : ''}

      <!-- PANEL GRUPOS: enviar situación entre grupos -->
      <div class="ficha-card">
        <div class="ficha-card-header"><span>🔄</span> Enviar situación entre grupos</div>
        <p style="font-size:.8rem;color:var(--gris-500);margin-bottom:12px">
          Envía una solicitud, presupuesto o comunicación comercial a otra empresa del aula.
          La IA redactará el correo de forma completamente profesional.
        </p>

        <div class="campo">
          <label>Tipo de comunicación</label>
          <select class="ficha-input" onchange="EMPRESA_STATE.generador.tipoIntergrupal=this.value;renderGenerador()">
            <option value="">— Selecciona —</option>
            <option value="solicitud-presupuesto">💰 Solicitar presupuesto</option>
            <option value="pedido-compra">📦 Realizar pedido de compra</option>
            <option value="reclamacion-cliente">📣 Reclamación de cliente</option>
            <option value="oferta-comercial">🎯 Enviar oferta comercial</option>
            <option value="consulta-proveedor">❓ Consulta a proveedor</option>
          </select>
        </div>

        ${EMPRESA_STATE.generador.tipoIntergrupal ? `
        <div class="campo">
          <label>Empresa destinataria</label>
          <select class="ficha-input" onchange="EMPRESA_STATE.generador.grupoDestIntergrupal=this.value">
            <option value="">— Selecciona grupo —</option>
            ${GRUPOS_AULA.map(g=>`<option value="${g.id}">${g.id} · ${g.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="campo">
          <label>Detalles de la solicitud</label>
          <textarea id="msg-intergrupal" class="ficha-input" style="min-height:80px" placeholder="Describe qué solicitas, qué ofreces, o cuál es el motivo de la comunicación. La IA lo redactará de forma profesional..."></textarea>
        </div>
        <button class="btn-accion" style="width:100%;margin-top:8px"
          onclick="generarMensajeIntergrupal()">
          ✉️ Generar y enviar
        </button>` : ''}
      </div>
    </div>

    <!-- Historial -->
    <div class="ficha-card">
      <div class="ficha-card-header"><span>📜</span> Situaciones generadas</div>
      ${gen.historial.length === 0
        ? `<div style="text-align:center;padding:2rem;color:var(--gris-400)">
            <div style="font-size:2rem;margin-bottom:8px">⚡</div>
            <p>Sin situaciones generadas todavía.</p>
           </div>`
        : `<div style="display:flex;flex-direction:column;gap:6px">
            ${gen.historial.map(h => `
            <div style="padding:8px 10px;background:var(--gris-50);border-radius:var(--radio-md);border:1px solid var(--gris-100)">
              <div style="font-size:.8rem;font-weight:600;color:var(--gris-800)">${h.tipo}</div>
              <div style="font-size:.72rem;color:var(--gris-500)">→ ${DEPT_CORREO[h.dept]?.nombre||h.dept} · ${h.fecha} ${h.hora}</div>
              <div style="font-size:.72rem;color:var(--gris-400)">De: ${h.remitente}</div>
            </div>`).join('')}
          </div>`}
    </div>
  </div>`;
}

/* ── Vista de previsualización ─────────────────────────────── */
function vistaPrevisualizacion(dg, esProf) {
  const dept = DEPT_CORREO[dg.dept] || {};
  const gen  = EMPRESA_STATE.generador;
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <h3 style="font-size:1rem;font-weight:700;color:var(--gris-800)">📧 Previsualización del correo</h3>
      <p style="font-size:.8rem;color:var(--gris-500)">Revisa y edita el correo antes de enviarlo al buzón del departamento</p>
    </div>
    <button class="btn-secundario" onclick="EMPRESA_STATE.generador.vistaActiva='panel';renderGenerador()">← Volver</button>
  </div>

  <!-- Cabecera del correo -->
  <div style="background:var(--verde-50);border:1px solid var(--verde-200);border-radius:var(--radio-md);padding:10px 14px;margin-bottom:1rem;font-size:.82rem">
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <span><strong>De:</strong> ${dg.remitente}</span>
      <span><strong>Para:</strong> ${dept.icono||''} ${dept.nombre||dg.dept}</span>
      <span><strong>Software:</strong> <span style="color:var(--verde-700);font-weight:600">${dg.tipo.software}</span></span>
    </div>
  </div>

  <div class="grid-2col" style="margin-bottom:1rem">
    <!-- Cuerpo editable -->
    <div style="display:flex;flex-direction:column;gap:.75rem">
      <div class="ficha-card">
        <div class="ficha-card-header"><span>✉️</span> Cuerpo del correo
          <span style="margin-left:auto;font-size:.72rem;color:var(--gris-400)">Editable</span>
        </div>
        ${dg.mejorando ? `<div style="padding:7px 10px;background:#dbeafe;border:1px solid #93c5fd;border-radius:var(--radio-sm);font-size:.78rem;color:#1e40af;margin-bottom:6px">⏳ Mejorando con IA... (ya puedes editar y enviar)</div>` : ''}
        <textarea id="cuerpo-editable" class="ficha-input"
          style="min-height:300px;resize:vertical;font-size:.85rem;line-height:1.8;font-family:var(--font)"
        >${dg.cuerpo}</textarea>
      </div>
    </div>

    <!-- Panel de opciones -->
    <div style="display:flex;flex-direction:column;gap:.75rem">

      <!-- Opciones de envío -->
      <div class="ficha-card">
        <div class="ficha-card-header"><span>⚙️</span> Opciones de envío</div>

        <!-- Adjuntar documento -->
        <div style="padding:10px;border-radius:var(--radio-md);border:1.5px solid ${gen.conDocumento?'var(--verde-400)':'var(--gris-200)'};background:${gen.conDocumento?'var(--verde-50)':'var(--gris-50)'};margin-bottom:8px;cursor:pointer"
          onclick="EMPRESA_STATE.generador.conDocumento=!EMPRESA_STATE.generador.conDocumento;renderGenerador()">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:20px;height:20px;border-radius:50%;border:2px solid ${gen.conDocumento?'var(--verde-500)':'var(--gris-300)'};background:${gen.conDocumento?'var(--verde-500)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              ${gen.conDocumento?'<span style="color:white;font-size:.65rem">✓</span>':''}
            </div>
            <div>
              <div style="font-size:.85rem;font-weight:600;color:var(--gris-800)">📎 Adjuntar documento</div>
              <div style="font-size:.72rem;color:var(--gris-500)">El alumno verá el documento completo relleno en el correo</div>
            </div>
          </div>
          <input type="checkbox" id="opt-con-doc" ${gen.conDocumento?'checked':''} style="display:none">
        </div>

        <!-- Permitir respuesta -->
        <div style="padding:10px;border-radius:var(--radio-md);border:1.5px solid ${gen.permiteRespuesta?'var(--verde-400)':'var(--gris-200)'};background:${gen.permiteRespuesta?'var(--verde-50)':'var(--gris-50)'};cursor:pointer"
          onclick="EMPRESA_STATE.generador.permiteRespuesta=!EMPRESA_STATE.generador.permiteRespuesta;renderGenerador()">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:20px;height:20px;border-radius:50%;border:2px solid ${gen.permiteRespuesta?'var(--verde-500)':'var(--gris-300)'};background:${gen.permiteRespuesta?'var(--verde-500)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              ${gen.permiteRespuesta?'<span style="color:white;font-size:.65rem">✓</span>':''}
            </div>
            <div>
              <div style="font-size:.85rem;font-weight:600;color:var(--gris-800)">💬 Permitir respuesta del alumno</div>
              <div style="font-size:.72rem;color:var(--gris-500)">${gen.permiteRespuesta?'El alumno puede responder al correo':'Solo lectura — sin opción de respuesta'}</div>
            </div>
          </div>
          <input type="checkbox" id="opt-resp" ${gen.permiteRespuesta?'checked':''} style="display:none">
        </div>
      </div>

      <!-- Preview del documento (si está activado) -->
      ${gen.conDocumento ? `
      <div class="ficha-card" style="border-color:var(--verde-300)">
        <div class="ficha-card-header"><span>📎</span> Documento adjunto · Preview
          <span class="ra-chip" style="margin-left:auto">${dg.tipo.software}</span>
        </div>
        <div style="font-size:.72rem;color:var(--gris-500);margin-bottom:8px">
          Así verá el alumno el documento al pulsar "Ver adjunto"
        </div>
        <div style="max-height:300px;overflow-y:auto;border:1px solid var(--gris-200);border-radius:var(--radio-sm)">
          ${renderDocumento(dg.tipo.id, dg.datos)}
        </div>
        <div style="margin-top:8px;padding:7px 10px;background:var(--verde-50);border-radius:var(--radio-sm);font-size:.75rem;color:var(--verde-800)">
          💡 ${dg.tipo.desc}
        </div>
      </div>` : `
      <div class="ficha-card" style="background:var(--gris-50)">
        <div style="text-align:center;padding:1rem;color:var(--gris-400)">
          <div style="font-size:1.5rem;margin-bottom:4px">📭</div>
          <div style="font-size:.8rem">Sin documento adjunto</div>
          <div style="font-size:.72rem;margin-top:2px">Solo se enviará el cuerpo del correo</div>
        </div>
      </div>`}

      <!-- Botones de acción -->
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn-accion" onclick="enviarSituacionGenerada(document.getElementById('cuerpo-editable').value)">
          📤 Enviar al buzón del departamento
        </button>
        <button class="btn-secundario" onclick="generarSituacionIA('${dg.tipo.id}', '${dg.dept}', '${dg.grupoDest||''}')">
          🔄 Regenerar con otros datos
        </button>
        <button class="btn-secundario" onclick="EMPRESA_STATE.generador.vistaActiva='panel';renderGenerador()">
          Cancelar
        </button>
      </div>
    </div>
  </div>`;
}

/* ── Mensaje intergrupal ───────────────────────────────────── */
async function generarMensajeIntergrupal() {
  const gen = EMPRESA_STATE.generador;
  const tipo = gen.tipoIntergrupal;
  const grupoDest = gen.grupoDestIntergrupal;
  const detalle = document.getElementById('msg-intergrupal')?.value || '';
  if (!tipo || !grupoDest) { mostrarToast('Selecciona tipo y grupo destinatario', 'error'); return; }

  const GRUPOS_AULA = [
    {id:'G1', nombre:'Agrícola Vega Alta S.L.'},
    {id:'G2', nombre:'Distribuciones García S.L.'},
    {id:'G3', nombre:'Naranjas del Sur S.L.'},
    {id:'G4', nombre:'Cítricos Premium S.L.'},
    {id:'G5', nombre:'Agroservicios Cantillana S.L.'},
  ];
  const grupoDestInfo = GRUPOS_AULA.find(g => g.id === grupoDest);
  const miEmpresa = EMPRESA_STATE.datos.nombre || 'nuestra empresa';
  const sector    = EMPRESA_STATE.config.sector || 'agroalimentario';

  const tiposLabel = {
    'solicitud-presupuesto':'solicitud de presupuesto',
    'pedido-compra':'pedido de compra',
    'reclamacion-cliente':'reclamación de cliente',
    'oferta-comercial':'oferta comercial',
    'consulta-proveedor':'consulta a proveedor',
  };

  gen.generando = true;
  renderGenerador();

  const prompt = `Eres el responsable comercial de "${miEmpresa}", empresa del sector "${sector}".
Redacta un correo electrónico completamente profesional y realista dirigido a "${grupoDestInfo?.nombre || grupoDest}".
El tipo de comunicación es: ${tiposLabel[tipo] || tipo}.
Detalles adicionales proporcionados: "${detalle}".
El correo debe sonar exactamente como un correo empresarial real: con saludo, desarrollo profesional de la comunicación, datos concretos si los hay, y cierre con firma.
Sin markdown, sin asteriscos. Solo texto plano natural. Entre 150 y 280 palabras.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{ role:'user', content: prompt }]
      })
    });
    const data = await response.json();
    const cuerpo = data.content.map(c => c.text||'').join('').trim();

    const ahora = new Date();
    EMPRESA_STATE.mensajeria.correos.unshift({
      id: 'inter-' + Date.now(),
      de: miEmpresa + ' (' + (EMPRESA_STATE.config.grupoId||'G?') + ')',
      email: 'comercial@miempresa.es',
      asunto: tiposLabel[tipo].charAt(0).toUpperCase() + tiposLabel[tipo].slice(1) + ' — ' + miEmpresa,
      cuerpo: cuerpo,
      departamento: 'comercial',
      dificultad: 'intermedio',
      ra: 'RA6b',
      fecha: ahora.toLocaleDateString('es-ES'),
      hora: ahora.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'}),
      leido: false, hilo: [], anotacionProf: '', calificacion: null,
      documento: null,
      origen: 'intergrupal',
      grupoDest: grupoDest,
    });
    actualizarBadgeCorreos();
    mostrarToast('📧 Mensaje enviado al grupo ' + grupoDest, 'exito');
  } catch(e) {
    mostrarToast('Mensaje enviado (modo demo)', '');
  }

  gen.generando = false;
  gen.tipoIntergrupal = '';
  renderGenerador();
}


