const AYUDA_CONTENIDO = {

  /* ── MI EMPRESA ── */
  'empresa': {
    icono: '🏢', titulo: 'Mi empresa', modulo: 'Constitución · RA3 · RA5',
    tabs: [
      { label: '📋 Forma jurídica',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Forma jurídica de la empresa', 'RA3e',
            'La forma jurídica determina cómo se organiza legalmente la empresa, quién responde ante las deudas y cómo se reparten los beneficios. En el ciclo trabajamos principalmente con la Sociedad de Responsabilidad Limitada (SRL o SL).',
            `<strong>SL:</strong> capital mínimo 3.000 €, responsabilidad limitada a la aportación de cada socio. Es la más habitual en empresas del tamaño que simula SimulApp.`
          ) + ayudaConcepto('Capital social', 'RA3g',
            'Es la suma de las aportaciones económicas o en bienes que hacen los socios al constituir la empresa. Figura en los estatutos y en el Registro Mercantil.',
            e.capital > 0
              ? `${e.nombre} tiene un capital social de <strong>${e.capital.toLocaleString('es-ES')} €</strong> aportado por los socios.`
              : 'Cuando añadas socios en el Apartado 2 del Plan de empresa, el capital social se calculará automáticamente.'
          ) + ayudaConcepto('Responsabilidad limitada', 'RA3f',
            'Los socios solo responden ante las deudas de la empresa con el capital aportado, no con su patrimonio personal. Es la principal ventaja de la SL frente al autónomo.',
            'Si la empresa quiebra con 50.000 € de deuda y el capital es 10.000 €, cada socio pierde solo su parte del capital, no su casa ni sus ahorros personales.'
          ) + ayudaAccion('Ir a Mi empresa → Ficha', "irA('empresa')")
        }
      },
      { label: '📑 Trámites',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Trámites de constitución', 'RA5a',
            'Para que una sociedad tenga existencia legal debe pasar por una serie de trámites ante distintos organismos. El orden importa: no puedes ir a Hacienda sin el NIF, y no puedes tener NIF sin la escritura notarial.',
            'Orden habitual: RMC (certificado de denominación) → Notaría (escritura) → AEAT (NIF + Modelo 036) → Registro Mercantil → Seguridad Social (CCC) → Ayuntamiento (licencia).'
          ) + `<div class="ayuda-alerta">En SimulApp lleváis <strong>${e.tramComp}</strong> de ${e.tramites.length} trámites completados. ${e.tramComp < 3 ? 'Completad los trámites en orden para desbloquear las siguientes fases.' : '¡Buen ritmo!'}</div>`
          + ayudaConcepto('NIF / CIF de la empresa', 'RA5a',
            'El Número de Identificación Fiscal de la empresa (que en el caso de personas jurídicas se llama CIF) es el identificador ante Hacienda. Se obtiene con el Modelo 036 en la AEAT.',
            e.nombre ? `El CIF provisional de ${e.nombre} está visible en la cabecera de Mi empresa.` : ''
          ) + ayudaAccion('Ver trámites pendientes', "irA('empresa');empTab('tramites')")
        }
      },
      { label: '👥 Organigrama',
        html: () => {
          return ayudaConcepto('Estructura organizativa', 'RA3c',
            'El organigrama refleja cómo se divide el trabajo en la empresa: quién hace qué, quién depende de quién y cómo fluye la información entre departamentos.',
            'Una empresa pequeña suele tener estructura funcional: Dirección, RRHH, Comercial, Contabilidad y Fiscal. En SimulApp cada alumno del grupo ocupa un departamento.'
          ) + ayudaConcepto('Tipos de contrato', 'RA3d',
            'El tipo de contrato determina la duración de la relación laboral y los derechos del trabajador. Los más habituales son: indefinido, temporal, en prácticas, y de formación y aprendizaje.',
            'Un contrato de formación y aprendizaje es ideal para jóvenes sin titulación. El de prácticas es para titulados recientes. Ambos tienen bonificaciones en la SS para la empresa.'
          ) + ayudaConcepto('Funciones del puesto', 'RA3d',
            'Cada puesto debe tener definidas sus tareas principales, su relación con otros departamentos y las competencias necesarias para desempeñarlo.',
            ''
          ) + ayudaAccion('Editar el organigrama', "irA('empresa');empTab('organigrama')")
        }
      }
    ]
  },

  /* ── PLAN DE EMPRESA · AP1-3 ── */
  'plan-ap1': {
    icono: '📄', titulo: 'Presentación y resumen ejecutivo', modulo: 'Plan de empresa · RA3a-b',
    tabs: [
      { label: '📄 Resumen ejecutivo',
        html: () => ayudaConcepto('Resumen ejecutivo', 'RA3b',
            'Es la "tarjeta de presentación" del plan. Debe ser autónomo: alguien que solo lea el resumen debe entender qué hace la empresa, para quién, cómo gana dinero y por qué tiene futuro. Se escribe al final, aunque aparezca al principio.',
            'Estructura: 1) ¿Qué hacemos y qué problema resolvemos? 2) ¿A quién va dirigido? 3) ¿Cómo ganamos dinero? 4) ¿Cuál es nuestra ventaja? 5) ¿Qué buscamos (financiación, socios, validación)?'
          ) + ayudaConcepto('Misión, visión y valores', 'RA3a',
            '<strong>Misión:</strong> por qué existe la empresa hoy (propósito actual). <strong>Visión:</strong> dónde quiere estar en 5-10 años (aspiración). <strong>Valores:</strong> principios que guían las decisiones.',
            '<em>Misión:</em> "Facilitar el acceso a productos ecológicos de proximidad a familias urbanas de Sevilla." <em>Visión:</em> "Ser referente en distribución agroecológica en Andalucía en 2030."'
          ) + ayudaAlerta('El resumen ejecutivo no es un índice del plan. Evita frases como "en el apartado 3 veremos...". Escribe como si fuera el único documento que leerán.')
      }
    ]
  },

  /* ── PLAN DE EMPRESA · AP4 (DAFO) ── */
  'plan-ap4': {
    icono: '🔍', titulo: 'Análisis del entorno · DAFO', modulo: 'Plan de empresa · RA2g-i',
    tabs: [
      { label: '🔍 DAFO',
        html: () => {
          const e = _emp();
          return ayudaConcepto('El análisis DAFO', 'RA2i',
            'El DAFO (Debilidades, Amenazas, Fortalezas, Oportunidades) es una herramienta de diagnóstico estratégico. La clave es distinguir correctamente entre los cuatro cuadrantes.',
            ''
          ) + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px;font-size:.77rem">
            <div style="background:#dcfce7;padding:8px;border-radius:4px">
              <div style="font-weight:700;color:#14532d;margin-bottom:3px">✅ Fortalezas</div>
              <div style="color:#166534">Internas. Lo que hacéis bien. Recursos, capacidades, ventajas respecto a competidores.<br><em>Ej: equipo con experiencia en el sector.</em></div>
            </div>
            <div style="background:#fee2e2;padding:8px;border-radius:4px">
              <div style="font-weight:700;color:#7f1d1d;margin-bottom:3px">❌ Debilidades</div>
              <div style="color:#991b1b">Internas. Áreas de mejora, carencias, limitaciones propias.<br><em>Ej: capital inicial reducido, falta de clientela inicial.</em></div>
            </div>
            <div style="background:#dbeafe;padding:8px;border-radius:4px">
              <div style="font-weight:700;color:#1e3a8a;margin-bottom:3px">🌱 Oportunidades</div>
              <div style="color:#1e40af">Externas. Tendencias del mercado, cambios legales o sociales favorables.<br><em>Ej: auge del consumo local, ayudas para jóvenes emprendedores.</em></div>
            </div>
            <div style="background:#fef3c7;padding:8px;border-radius:4px">
              <div style="font-weight:700;color:#78350f;margin-bottom:3px">⚡ Amenazas</div>
              <div style="color:#92400e">Externas. Factores del entorno que pueden perjudicar.<br><em>Ej: competidor con más recursos, subida de materias primas.</em></div>
            </div>
          </div>`
          + ayudaAlerta('El error más común es confundir debilidades con amenazas. La diferencia: una debilidad es algo que depende de vosotros (podéis mejorarla); una amenaza viene de fuera (solo podéis prepararse).')
          + ayudaAccion('Ir al apartado DAFO', "planTab('4')")
        }
      },
      { label: '🏭 Sector y competencia',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Análisis del sector', 'RA2g',
            'Antes de entrar en un mercado hay que entender cómo funciona: tamaño, crecimiento, principales actores, barreras de entrada y tendencias. Fuentes: INE, informes sectoriales de ICEX, cámaras de comercio.',
            `Vuestro sector es <strong>${e.sector}</strong>. Buscad datos de facturación del sector en España, número de empresas competidoras y tendencias de los últimos 3 años.`
          ) + ayudaConcepto('Análisis de competidores', 'RA2h',
            'No basta con listar competidores: hay que analizarlos. Para cada uno: ¿qué hacen bien? ¿qué hacen mal? ¿cómo es su precio respecto al vuestro? ¿qué cuota de mercado tienen?',
            'Herramienta: Matriz de perfil competitivo (MPC). Listáis los factores clave de éxito del sector y puntuáis a cada competidor y a vuestra empresa del 1 al 4.'
          ) + ayudaAccion('Añadir competidores', "planTab('4')")
        }
      }
    ]
  },

  /* ── PLAN DE EMPRESA · AP7 (FINANCIERO) ── */
  'plan-ap7': {
    icono: '📊', titulo: 'Plan económico-financiero', modulo: 'Plan de empresa · RA4',
    tabs: [
      { label: '💰 Inversión',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Inversión inicial', 'RA4c',
            'Es todo lo que la empresa necesita adquirir o pagar antes de empezar a funcionar. Se clasifica en inmovilizado (activos que duran más de un año, como maquinaria o local) y activo corriente (existencias iniciales, fianzas, fondo de maniobra).',
            e.totalInv > 0
              ? `${e.nombre} tiene una inversión inicial de <strong>${e.totalInv.toLocaleString('es-ES')} €</strong>.`
              : 'Introduce los importes en la tabla de inversión para ver el total.'
          ) + ayudaConcepto('Amortización', 'RA4g',
            'Los activos que duran varios años no se "gastan" en el año de compra: se amortiza su coste repartiéndolo entre los años de vida útil. Esto reduce el beneficio contable pero no supone salida de caja.',
            `Una furgoneta de 15.000 € con 5 años de vida útil se amortiza a 3.000 €/año. Esos 3.000 € son un gasto en la cuenta de resultados, pero el dinero ya se pagó al comprar la furgoneta.`
          ) + ayudaFormula(`Amortización anual = Importe del bien ÷ Años de vida útil\n\nEjemplo: 15.000 € ÷ 5 años = 3.000 €/año`)
          + ayudaConcepto('Ratio de endeudamiento', 'RA4h',
            'Mide qué proporción de la financiación proviene de deuda frente a fondos propios. Un ratio alto significa más riesgo financiero.',
            e.ratioEnd
              ? `Vuestra ratio actual es <strong>${e.ratioEnd}</strong>. ${parseFloat(e.ratioEnd) > 2 ? '⚠️ Alto: más de 2/3 de la financiación es deuda.' : parseFloat(e.ratioEnd) > 1 ? 'Moderado: la deuda supera a los fondos propios.' : '✅ Saludable: los fondos propios superan a la deuda.'}`
              : 'Rellena las tablas de inversión y financiación para ver tu ratio.'
          ) + ayudaFormula(`Ratio endeudamiento = Deuda total ÷ Fondos propios\n\nÓptimo: < 1,5  |  Aceptable: 1,5-2,5  |  Alto riesgo: > 2,5`)
        }
      },
      { label: '📈 Rentabilidad',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Umbral de rentabilidad (Punto muerto)', 'RA4g',
            'Es el nivel de ventas mínimo para que los ingresos cubran todos los costes. Por debajo: pérdidas. Por encima: beneficios. Es uno de los indicadores más importantes para decidir si el negocio es viable.',
            e.umbral > 0
              ? `Vuestro umbral actual es <strong>${e.umbral.toLocaleString('es-ES',{maximumFractionDigits:0})} €/mes</strong>. Si vuestras ventas previstas son ${e.ventas1 > 0 ? (e.ventas1/12).toLocaleString('es-ES',{maximumFractionDigits:0})+'€/mes' : 'superiores a ese importe'}, el negocio es viable.`
              : 'Rellena los gastos fijos y el porcentaje de costes variables para calcular el umbral.'
          ) + ayudaFormula(`Umbral = Costes fijos ÷ (1 − % Costes variables sobre ventas)\n\nEjemplo: 2.000 € ÷ (1 − 0,40) = 3.333 €/mes`)
          + ayudaConcepto('TIR — Tasa Interna de Retorno', 'RA4h',
            'Es el porcentaje de rentabilidad anual de la inversión. Si la TIR supera el coste del dinero (tipo de interés del préstamo), el proyecto crea valor.',
            e.tir > 0
              ? `La TIR de vuestro proyecto es <strong>${e.tir}%</strong>. ${e.tir > 15 ? '✅ Muy atractivo.' : e.tir > 8 ? 'Razonable para una empresa nueva.' : '⚠️ Bajo — revisad las proyecciones de ventas o los costes.'}`
              : 'Introduce las proyecciones de ventas y gastos para que la app calcule la TIR automáticamente.'
          ) + ayudaConcepto('Margen neto', 'RA4h',
            'Es el porcentaje de cada euro de ventas que se convierte en beneficio neto (después de todos los gastos e impuestos). Cuanto mayor, más rentable el negocio.',
            e.ventas1 > 0
              ? `Con ${e.ventas1.toLocaleString('es-ES',{maximumFractionDigits:0})} € de ventas anuales previstas en el año 1, el margen neto depende de los gastos que hayáis introducido.`
              : ''
          ) + ayudaFormula(`Margen neto = (Beneficio neto ÷ Ventas) × 100`)
        }
      },
      { label: '⚖️ Balance',
        html: () => {
          return ayudaConcepto('Balance de situación', 'RA4h',
            'Es la "foto" del patrimonio de la empresa en un momento dado. El activo recoge todo lo que tiene (bienes y derechos); el pasivo + patrimonio neto recoge cómo se ha financiado.',
            'Regla fundamental: el activo siempre iguala al pasivo + patrimonio neto.'
          ) + ayudaFormula(`ACTIVO = PATRIMONIO NETO + PASIVO\n\n(Todo lo que tienes = Todo lo que te han dado para tenerlo)`)
          + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;font-size:.77rem">
            <div style="background:var(--verde-50);padding:8px;border-radius:4px">
              <div style="font-weight:700;color:var(--verde-800);margin-bottom:4px">ACTIVO</div>
              <div style="color:var(--verde-700);line-height:1.7"><strong>No corriente:</strong><br>Inmovilizado material (maquinaria, local)<br>Inmovilizado intangible (software)<br><strong>Corriente:</strong><br>Existencias · Clientes · Tesorería</div>
            </div>
            <div style="background:#eff6ff;padding:8px;border-radius:4px">
              <div style="font-weight:700;color:#1e3a8a;margin-bottom:4px">PN + PASIVO</div>
              <div style="color:#1e40af;line-height:1.7"><strong>Patrimonio neto:</strong><br>Capital social · Reservas · Resultado<br><strong>Pasivo no corriente:</strong><br>Deudas LP (préstamos &gt;1 año)<br><strong>Pasivo corriente:</strong><br>Proveedores · HP acreedora</div>
            </div>
          </div>`
          + ayudaConcepto('Fondo de maniobra', 'RA4h',
            'Es la diferencia entre el activo corriente y el pasivo corriente. Si es positivo, la empresa puede pagar sus deudas a corto plazo con sus activos a corto plazo. Si es negativo, hay riesgo de insolvencia.',
            ''
          ) + ayudaFormula(`Fondo de maniobra = Activo corriente − Pasivo corriente\n\nPositivo: solvencia a corto plazo ✅\nNegativo: riesgo de suspensión de pagos ⚠️`)
        }
      }
    ]
  },

  /* ── GESTIÓN OPERATIVA ── */
  'gestion': {
    icono: '⚙️', titulo: 'Gestión operativa', modulo: 'Simulación · RA6',
    tabs: [
      { label: '📋 Tareas y RA6',
        html: () => {
          return ayudaConcepto('Resultados de aprendizaje RA6', 'RA6',
            'El RA6 evalúa la capacidad para gestionar las operaciones diarias de una empresa: comunicación profesional, facturación, nóminas, contabilidad básica y gestión administrativa.',
            'En SimulApp cada tarea semanal está vinculada a uno o varios criterios de evaluación (CE) del RA6. Al completar y entregar las tareas, estás acreditando esos CE.'
          ) + ayudaConcepto('Rotación de departamentos', 'RA3d',
            'Durante el curso cada alumno pasa por distintos departamentos. El objetivo es que al final del año todos hayan experimentado las funciones principales de una empresa.',
            'El cambio de departamento ocurre al inicio de cada trimestre. El historial de tareas completadas queda como evidencia de aprendizaje en el Dossier 3160.'
          ) + ayudaAccion('Ver mis tareas de esta semana', "irA('tareas')")
        }
      },
      { label: '🧾 Facturación',
        html: () => {
          return ayudaConcepto('Factura ordinaria', 'RA6b',
            'Documento mercantil que acredita una operación de compraventa. Debe incluir: número correlativo, fecha, datos del emisor y receptor con NIF, descripción de la operación, base imponible, tipo de IVA y total.',
            'Número de factura: F-2025-001, F-2025-002... nunca se salta un número. Si una factura es incorrecta, se emite una factura rectificativa, no se borra.'
          ) + ayudaConcepto('IVA repercutido vs. IVA soportado', 'RA6b',
            '<strong>IVA repercutido:</strong> el que cobras a tus clientes en las facturas emitidas (lo debes a Hacienda). <strong>IVA soportado:</strong> el que pagas a tus proveedores en las facturas recibidas (lo recuperas de Hacienda).',
            'Si en el trimestre has cobrado 2.100 € de IVA a clientes y pagado 840 € de IVA a proveedores, ingresas la diferencia: 2.100 − 840 = 1.260 € en el Modelo 303.'
          ) + ayudaFormula(`Liquidación trimestral IVA:\nIVA repercutido − IVA soportado = Cuota a ingresar/devolver`)
          + ayudaAccion('Ir a las fichas de Factusol', "irA('programas');window._hubTab('factusol')")
        }
      },
      { label: '📊 Contabilidad',
        html: () => {
          return ayudaConcepto('El asiento contable', 'RA6d',
            'Registro de una operación económica en el libro diario. Cada asiento tiene un DEBE y un HABER que siempre cuadran. El DEBE recoge aumentos de activo y gastos; el HABER recoge aumentos de pasivo, patrimonio e ingresos.',
            'Cuando la empresa compra mercancía por 1.210 € (IVA incluido):<br>DEBE: 600 Compras 1.000 € + 472 IVA soportado 210 €<br>HABER: 400 Proveedores 1.210 €'
          ) + ayudaConcepto('Plan General Contable (PGC)', 'RA6d',
            'Normativa contable española que establece los grupos de cuentas y cómo deben registrarse las operaciones. Los grupos del 1 al 5 son de balance; los grupos 6 y 7 son de gastos e ingresos.',
            'Grupos: 1=Financiación básica · 2=Inmovilizado · 3=Existencias · 4=Acreedores/Deudores · 5=Cuentas financieras · 6=Compras y gastos · 7=Ventas e ingresos'
          ) + ayudaAlerta('El cuadre del asiento es obligatorio: la suma del Debe siempre debe igualar la suma del Haber. Si no cuadra, hay un error.')
          + ayudaAccion('Ir a las fichas de Contasol', "irA('programas');window._hubTab('contasol')")
        }
      }
    ]
  },

  /* ── RRHH / NOMINASOL ── */
  'nominasol': {
    icono: '💼', titulo: 'RRHH y nóminas', modulo: 'Optativa AN5542 · RA1-RA3',
    tabs: [
      { label: '💰 Nómina',
        html: () => {
          const e = _emp();
          const conv = e.conv;
          return ayudaConcepto('Estructura de la nómina', 'RA2',
            'La nómina tiene tres partes: devengos (lo que gana el trabajador: salario base + complementos), deducciones (lo que se descuenta: IRPF + cuota obrera SS) y líquido a percibir (lo que cobra).',
            ''
          ) + `<div style="background:var(--gris-50);border-radius:6px;padding:10px;font-size:.77rem;margin-bottom:10px">
            <div style="font-weight:700;color:var(--verde-800);margin-bottom:6px">Estructura de la nómina</div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--gris-200);padding-bottom:5px;margin-bottom:5px">
              <span style="color:#166534">+ Salario base</span><span>Según grupo del convenio</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--gris-200);padding-bottom:5px;margin-bottom:5px">
              <span style="color:#166534">+ Complementos</span><span>Antigüedad, horas extra, etc.</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:2px solid var(--gris-300);padding-bottom:5px;margin-bottom:5px;font-weight:700">
              <span>= SALARIO BRUTO</span><span>Base para calcular deducciones</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--gris-200);padding-bottom:5px;margin-bottom:5px">
              <span style="color:#dc2626">− IRPF</span><span>% según tabla de retenciones</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--gris-200);padding-bottom:5px;margin-bottom:5px">
              <span style="color:#dc2626">− SS trabajador</span><span>~6,47% (CC+desempleo+FP+MEI)</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-weight:700;color:var(--verde-700)">
              <span>= SALARIO NETO (líquido)</span><span>Lo que cobra en mano</span>
            </div>
          </div>`
          + ayudaConcepto('Coste empresa vs. salario neto', 'RA3',
            'El coste real para la empresa es mayor que el bruto: hay que sumar la cuota patronal de la Seguridad Social (~31,65% sobre la base de cotización). El trabajador percibe el neto (bruto menos sus deducciones).',
            'Un trabajador con 1.500 € brutos: cobra ~1.220 € netos, pero le cuesta a la empresa ~1.975 €. La diferencia son las cotizaciones de ambas partes a la SS y el IRPF.'
          ) + ayudaFormula(`Coste empresa ≈ Salario bruto × 1,32\n(el 32% corresponde a cuota patronal SS)\n\nSalario neto ≈ Bruto × 0,81\n(el 19% corresponde a deducciones del trabajador)`)
          + ayudaAccion('Ir a las fichas de Nominasol', "irA('programas');window._hubTab('nominasol')")
        }
      },
      { label: '🏛️ Seguridad Social',
        html: () => {
          return ayudaConcepto('Base de cotización', 'RA1',
            'Es el salario mensual del trabajador sobre el que se aplican los porcentajes de cotización. Debe estar dentro de los topes mínimo y máximo fijados anualmente por el gobierno para cada grupo de cotización.',
            'Si el salario es inferior al tope mínimo de su grupo, se cotiza por el mínimo. Si es superior al tope máximo, se cotiza por el máximo.'
          ) + ayudaConcepto('Grupos de cotización', 'RA1',
            'Clasifican a los trabajadores según su categoría profesional. Hay 11 grupos, del 1 (ingenieros, licenciados) al 11 (trabajadores menores de 18 años). Cada grupo tiene un tope mínimo y máximo de cotización.',
            'En SimulApp el convenio colectivo define 5 grupos: Dirección (Grupo 1), Jefaturas (Grupo 2), Técnicos (Grupo 3), Administrativos (Grupo 4), Auxiliares (Grupo 5).'
          ) + ayudaConcepto('TC1 y TC2 (Boletines de cotización)', 'RA2',
            'Documentos que la empresa presenta mensualmente a la TGSS para ingresar las cotizaciones. El TC1 es el boletín de cotización con el total a ingresar; el TC2 es la relación nominal de trabajadores.',
            'En Nominasol se generan automáticamente a partir de las nóminas calculadas: Nóminas → Seguridad Social → Boletines de cotización.'
          ) + ayudaAccion('Ver ficha de trabajadores', "irA('programas');window._hubTab('nominasol')")
        }
      }
    ]
  },

  /* ── CONTASOL ── */
  'contasol': {
    icono: '📊', titulo: 'Contabilidad · Contasol', modulo: 'Optativa AN5542 · RA2',
    tabs: [
      { label: '📒 Asientos',
        html: () => {
          return ayudaConcepto('El libro diario', 'RA2c',
            'Es el registro cronológico de todas las operaciones económicas de la empresa. Cada entrada es un asiento con fecha, concepto, cuentas del debe y del haber.',
            'Asiento de constitución (aportación de capital): DEBE 572 Banco 3.000 € / HABER 100 Capital social 3.000 €. Concepto: "Aportación de socios al capital social".'
          ) + ayudaConcepto('El libro mayor', 'RA2d',
            'Agrupa todos los movimientos de cada cuenta. Muestra el saldo acumulado de cada cuenta en cualquier momento. Contasol lo genera automáticamente a partir del libro diario.',
            ''
          ) + ayudaConcepto('Balance de comprobación de sumas y saldos', 'RA2e',
            'Resumen de todas las cuentas con sus sumas del debe, sumas del haber y saldo. Sirve para verificar que el diario cuadra antes de generar los estados financieros.',
            ''
          ) + ayudaAlerta('Antes de cerrar el trimestre, genera el balance de comprobación en Contasol (Informes → Balance de sumas y saldos). Si las columnas no cuadran, revisa los asientos del periodo.')
          + ayudaAccion('Ver fichas de asientos', "irA('programas');window._hubTab('contasol')")
        }
      },
      { label: '📑 Cuentas PGC',
        html: () => {
          return `<div style="font-size:.77rem;margin-bottom:12px">Las cuentas más utilizadas en la simulación:</div>`
          + `<div style="font-size:.77rem">
            ${[
              ['100','Capital social','Patrimonio neto · Haber al constituir'],
              ['400','Proveedores','Pasivo corriente · Lo que debes a proveedores'],
              ['430','Clientes','Activo corriente · Lo que te deben clientes'],
              ['472','HP deudora IVA soportado','IVA de compras recuperable de Hacienda'],
              ['477','HP acreedora IVA repercutido','IVA de ventas a ingresar en Hacienda'],
              ['570','Caja','Efectivo disponible'],
              ['572','Banco c/c','Saldo bancario'],
              ['600','Compras de mercaderías','Gasto · Precio de coste de lo que vendes'],
              ['700','Ventas de mercaderías','Ingreso · Lo que cobras por tu producto'],
              ['640','Sueldos y salarios','Gasto · Retribución bruta de empleados'],
              ['642','SS a cargo empresa','Gasto · Cuota patronal de cotización'],
            ].map(([num,nom,desc])=>`
              <div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid var(--gris-50)">
                <span style="font-family:var(--fuente-mono);font-weight:700;color:var(--verde-700);width:32px;flex-shrink:0">${num}</span>
                <div><div style="font-weight:600;color:var(--gris-800)">${nom}</div><div style="color:var(--gris-400);font-size:.72rem">${desc}</div></div>
              </div>`).join('')}
          </div>`
        }
      }
    ]
  },

  /* ── FACTUSOL ── */
  'factusol': {
    icono: '🧾', titulo: 'Facturación · Factusol', modulo: 'Optativa AN5542 · RA1-RA2',
    tabs: [
      { label: '🧾 Ciclo comercial',
        html: () => {
          return ayudaConcepto('El ciclo completo de una venta', 'RA1',
            'Una operación comercial pasa por varias fases documentales: presupuesto → pedido → albarán → factura → cobro. Factusol gestiona todas estas fases y permite convertir un documento en el siguiente automáticamente.',
            ''
          ) + `<div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
            ${[
              ['1','📋 Presupuesto','Oferta al cliente. No tiene efecto contable. Válido X días.'],
              ['2','📦 Pedido','El cliente acepta. Se reserva stock. Factusol → Ventas → Pedidos.'],
              ['3','📄 Albarán','Se envía la mercancía. Documento de entrega sin IVA desglosado.'],
              ['4','🧾 Factura','Documento fiscal. Con IVA. Genera la deuda del cliente.'],
              ['5','💶 Cobro','Se registra el pago. Cierra el ciclo. Afecta a la tesorería.'],
            ].map(([n,tit,desc])=>`
              <div style="display:flex;gap:8px;align-items:flex-start">
                <span style="background:var(--verde-600);color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;flex-shrink:0;margin-top:1px">${n}</span>
                <div><div style="font-size:.78rem;font-weight:600">${tit}</div><div style="font-size:.72rem;color:var(--gris-500)">${desc}</div></div>
              </div>`).join('')}
          </div>`
          + ayudaConcepto('Series de facturación', 'RA1c',
            'Las facturas se numeran de forma correlativa y sin saltos dentro de cada serie. Normalmente: F-AÑO-NNN para facturas emitidas y FC-AÑO-NNN para facturas de compra recibidas.',
            'F-2025-001, F-2025-002... Si detectas que falta un número, debes emitir una factura rectificativa (no borrar).'
          ) + ayudaAccion('Ver fichas de facturas', "irA('programas');window._hubTab('factusol')")
        }
      }
    ]
  },

  /* ── MERCADO INTERGRUPAL ── */
  'mercado': {
    icono: '🔄', titulo: 'Mercado intergrupal', modulo: 'Simulación · RA6',
    tabs: [
      { label: '🔄 Funcionamiento',
        html: () => {
          return ayudaConcepto('Mercado intergrupal', 'RA6a',
            'En SimulApp las empresas de la clase comercian entre sí. Esto simula las relaciones reales entre empresas: unas venden, otras compran, y todas generan documentación que hay que registrar.',
            'Cuando cerráis una transacción con otra empresa, la app genera automáticamente la ficha de factura para Factusol y el asiento para Contasol. Solo tenéis que trasladarlos a los programas.'
          ) + ayudaConcepto('Tipos de transacción', 'RA6b',
            'Una transacción puede ser una venta (sois proveedores de otra empresa) o una compra (sois clientes de otra empresa). Cada una genera documentación distinta.',
            '<strong>Si vendéis:</strong> emitís factura en Factusol, registráis asiento de venta en Contasol (700/430/477). <strong>Si compráis:</strong> registráis factura recibida en Factusol, asiento de compra en Contasol (600/472/400).'
          ) + ayudaConcepto('Correo de empresa', 'RA6a',
            'Cada situación que llega al buzón es un ejercicio de comunicación profesional: hay que responder con el tono y formato adecuados, tomando la decisión correcta para la empresa.',
            'Un correo de un cliente que pide descuento: ¿lo concedéis? Depende de vuestro margen, de la importancia del cliente y de vuestra estrategia de precios. No hay una única respuesta correcta.'
          )
        }
      }
    ]
  },

  /* ── DEFENSA PÚBLICA ── */
  'defensa': {
    icono: '🎤', titulo: 'Defensa pública', modulo: 'Proyecto intermodular · RA1-RA6',
    tabs: [
      { label: '🎤 Elevator Pitch',
        html: () => {
          return ayudaConcepto('El Elevator Pitch', 'RA1',
            'Presentación oral de 1-2 minutos que resume tu proyecto de negocio con el objetivo de captar el interés del oyente. El nombre viene de imaginar que tienes el tiempo de un viaje en ascensor para convencer a un inversor.',
            ''
          ) + `<div style="margin-bottom:10px">
            <div style="font-size:.77rem;font-weight:700;color:var(--gris-700);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Estructura recomendada</div>
            ${[
              ['🪝 Gancho','0:00-0:15','Una frase que enganche. Dato sorprendente, pregunta retórica o historia breve.'],
              ['❓ Problema','0:15-0:35','¿Qué problema real resolvéis? Concretadlo con datos o ejemplos.'],
              ['💡 Solución','0:35-0:55','Vuestra propuesta de valor. ¿Qué hacéis y por qué es mejor?'],
              ['💶 Modelo','0:55-1:15','¿Cómo ganáis dinero? Sencillo y claro.'],
              ['📣 Cierre','1:15-1:30','Petición concreta + frase memorable de cierre.'],
            ].map(([ico,t,d])=>`
              <div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid var(--gris-50)">
                <span style="font-size:.77rem;font-weight:700;width:80px;flex-shrink:0;color:var(--gris-600)">${ico} ${t}</span>
                <span style="font-size:.75rem;color:var(--gris-600)">${d}</span>
              </div>`).join('')}
          </div>`
          + ayudaAlerta('Los jueces del tribunal valoran especialmente: claridad, convicción, conocimiento real del negocio y capacidad de respuesta a preguntas. Ensayad en voz alta, no solo leyendo.')
          + ayudaAccion('Preparar el pitch', "irA('defensa')")
        }
      },
      { label: '❓ Preguntas',
        html: () => {
          return ayudaConcepto('Responder preguntas del tribunal', 'RA1-RA4',
            'El turno de preguntas evalúa si el equipo entiende realmente su proyecto. No se puede improvisar: hay que preparar respuestas a las preguntas más habituales antes de la defensa.',
            ''
          ) + `<div style="margin-bottom:10px">
            <div style="font-size:.77rem;font-weight:700;color:var(--gris-700);margin-bottom:6px">Preguntas frecuentes del tribunal</div>
            ${[
              '¿Cuál es vuestro principal competidor y qué os diferencia de él?',
              '¿Cómo habéis calculado la previsión de ventas? ¿Es realista?',
              'Si el IVA de vuestro producto sube, ¿qué impacto tiene en la cuenta de resultados?',
              '¿Por qué habéis elegido esa forma jurídica y no otra?',
              '¿Qué pasaría si no alcanzáis el umbral de rentabilidad en el primer año?',
              '¿Cómo os repartís los beneficios si los hay?',
            ].map((p,i)=>`<div style="padding:6px 8px;margin-bottom:4px;background:var(--gris-50);border-radius:4px;font-size:.77rem;color:var(--gris-700)"><strong>${i+1}.</strong> ${p}</div>`).join('')}
          </div>`
          + ayudaAccion('Preparar respuestas', "irA('defensa')")
        }
      }
    ]
  },

  /* ── DEFAULT ── */
  'default': {
    icono: '💡', titulo: 'Ayuda contextual', modulo: 'SimulApp',
    tabs: [
      { label: '💡 Cómo usar',
        html: () => `<div class="ayuda-concepto">
          <div class="ayuda-concepto-titulo">Ayuda contextual</div>
          <div class="ayuda-def">En cada módulo aparece el botón <strong>❓ Ayuda</strong> en la cabecera. Al pulsarlo, verás los conceptos clave de ese apartado adaptados al estado de vuestra empresa.</div>
          <div class="ayuda-def" style="margin-top:8px">Los ejemplos se generan con los datos reales de vuestra empresa cuando están disponibles.</div>
        </div>`
      }
    ]
  },
  /* ── EMPRENDIMIENTO ── */
  'emprendimiento': {
    icono: '💡', titulo: 'Emprendimiento y Dirección', modulo: 'Módulo 0656 · RA1 · RA2',
    tabs: [
      { label: '🚀 Innovación y riesgo',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Innovación empresarial', 'RA1a',
            'Innovar no significa solo tecnología. Puede ser una nueva forma de distribuir, un precio diferente, un servicio que otros no ofrecen, o una experiencia de cliente distinta. Schumpeter la llamó «destrucción creativa»: las empresas que no innovan son sustituidas.',
            `En ${e.nombre||'vuestra empresa'}, la innovación puede venir del producto, del proceso, del modelo de negocio o del marketing.`
          ) + ayudaConcepto('Riesgo empresarial', 'RA1c',
            'Todo emprendimiento asume riesgo. La clave no es eliminarlo sino gestionarlo: identificar qué puede salir mal, estimar su probabilidad e impacto, y decidir si se asume, se reduce o se transfiere (por ejemplo, con un seguro).',
            'Un riesgo clave en la simulación es quedarse sin liquidez aunque se tenga beneficio contable. El umbral de rentabilidad y el presupuesto de tesorería son las herramientas para detectarlo a tiempo.'
          ) + ayudaFormula(`Riesgo = Probabilidad × Impacto\n\nAlto impacto + alta probabilidad → mitigar urgentemente\nAlto impacto + baja probabilidad → tener plan de contingencia`)
          + ayudaAccion('Ir a Plan de empresa → Apartado 1', "irA('plan-empresa')")
        }
      },
      { label: '🎯 Canvas y propuesta de valor',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Business Model Canvas', 'RA2',
            'El Canvas es una herramienta de una página que describe cómo funciona un negocio en 9 bloques. Permite ver de un vistazo si el modelo tiene sentido y detectar incoherencias antes de redactar el plan de empresa.',
            'El bloque central es la <strong>Propuesta de valor</strong>: qué problema resuelves y por qué alguien pagaría por ello en lugar de hacer otra cosa.'
          ) + ayudaConcepto('Propuesta de valor', 'RA2c',
            'Es la razón por la que un cliente elige tu empresa y no a la competencia. Debe responder a tres preguntas: ¿qué trabajo hace por el cliente?, ¿qué ganancia le aporta?, ¿qué dolor le elimina?',
            `Para ${e.nombre||'vuestra empresa'}: escríbela en una sola frase que un adolescente pueda entender. Si necesitas más de dos frases, aún no está clara.`
          ) + ayudaConcepto('Segmentos de clientes', 'RA2h',
            'No "todo el mundo" es tu cliente. Definir el segmento concreto (edad, comportamiento, necesidad, poder adquisitivo) permite diseñar una propuesta de valor más precisa y un canal de distribución más eficiente.',
            'Herramientas: mapa de empatía, buyer persona, entrevistas de validación.'
          ) + ayudaAccion('Completar el Canvas en Emprendimiento', "irA('emprendimiento')")
        }
      },
      { label: '📊 DAFO y entorno',
        html: () => {
          const e = _emp();
          const d = EMPRESA_STATE.planEmpresa.ap4 || {};
          return ayudaConcepto('Análisis DAFO', 'RA2i',
            'El DAFO cruza el análisis interno (Fortalezas y Debilidades, que dependen de vosotros) con el externo (Oportunidades y Amenazas, que dependen del entorno). La clave es que sea honesto: un DAFO sin debilidades reales no sirve.',
            'Regla práctica: si una debilidad puede convertirse en una oportunidad con inversión o tiempo, es una debilidad estratégica prioritaria.'
          ) + ayudaConcepto('Diferencia: Fortaleza vs Oportunidad', 'RA2i',
            '<strong>Fortaleza</strong>: algo que ya tenéis y que os da ventaja <em>ahora mismo</em> (equipo con experiencia, patente, localización).<br><strong>Oportunidad</strong>: algo del entorno que podéis aprovechar si actuáis (tendencia de mercado, normativa favorable, competidor débil).',
            `Error frecuente: poner "experiencia del equipo" como oportunidad. Si ya la tenéis, es una fortaleza. Si podéis adquirirla, es una debilidad convertible.`
          ) + (d.dafoF ? ayudaAlerta(`Vuestras fortalezas: "${d.dafoF.slice(0,80)}${d.dafoF.length>80?'…':''}"`) : '')
          + ayudaAccion('Ir al análisis DAFO', "irA('emprendimiento')")
        }
      }
    ]
  },

  /* ── APARTADO 2: PROMOTORES ── */
  'plan-ap2': {
    icono: '👥', titulo: 'Equipo promotor', modulo: 'Plan de empresa · RA1d · RA3c',
    tabs: [
      { label: '👤 Promotores y capital',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Promotores y socios', 'RA1d',
            'El equipo promotor son las personas que impulsan la empresa. En una SL, los promotores suelen ser también los socios, que aportan el capital y asumen la dirección inicial. La composición del equipo es una de las primeras cosas que analiza cualquier inversor.',
            `${e.nombre||'Vuestra empresa'} tiene ${e.capital > 0 ? 'un capital de '+e.capital.toLocaleString('es-ES')+' €' : 'capital social pendiente de definir'}.`
          ) + ayudaConcepto('Tipos de aportación al capital', 'RA3g',
            '<strong>Dineraria</strong>: dinero en efectivo depositado en cuenta bancaria a nombre de la empresa, acreditado con certificado bancario.<br><strong>No dineraria</strong>: bienes o derechos (un vehículo, un ordenador, una patente) cuyo valor debe ser acreditado por un experto independiente.',
            'Mínimo para constituir una SL: 3.000 € de capital social, totalmente desembolsado en el momento de la constitución.'
          ) + ayudaFormula(`Capital social total = Σ aportaciones de todos los socios\nParticipaciones = Capital total ÷ Valor nominal (10 €/participación en SimulApp)`)
          + ayudaAccion('Añadir promotores en Apartado 2', "planTab('2')")
        }
      }
    ]
  },

  /* ── APARTADO 3: NEGOCIO ── */
  'plan-ap3': {
    icono: '💼', titulo: 'Descripción del negocio', modulo: 'Plan de empresa · RA2a-e · RA3',
    tabs: [
      { label: '🏭 Actividad y producto',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Descripción de la actividad', 'RA2a',
            'Debe explicar de forma concreta qué hace la empresa, cómo lo hace y a quién. Evita el lenguaje vago ("ofrecemos servicios de calidad"). Sé específico sobre el proceso, la tecnología que usas y el tipo de cliente.',
            `"${e.nombre||'Vuestra empresa'} produce/distribuye/presta servicio de X mediante Y proceso, dirigido a clientes de tipo Z."`
          ) + ayudaConcepto('Ventaja competitiva sostenible', 'RA2d',
            'Una ventaja competitiva es sostenible cuando los competidores no pueden copiarla fácilmente. Las más duraderas se basan en: costes estructurales más bajos, diferenciación real percibida por el cliente, o efecto de red.',
            'Pregunta clave: si un competidor con el doble de dinero intentara copiaros en 6 meses, ¿podría? Si la respuesta es sí, necesitáis una ventaja más profunda.'
          ) + ayudaConcepto('Modelo de negocio', 'RA2e',
            '¿Cómo gana dinero la empresa? Los modelos más habituales: venta directa, suscripción recurrente, comisión sobre transacciones, freemium, licencia, servicio profesional. El modelo define la estructura de ingresos y el nivel de previsibilidad financiera.',
            ''
          ) + ayudaAccion('Ir al Apartado 3 del plan', "planTab('3')")
        }
      }
    ]
  },

  /* ── APARTADO 5: JURÍDICO-FISCAL ── */
  'plan-ap5': {
    icono: '⚖️', titulo: 'Plan jurídico-fiscal', modulo: 'Plan de empresa · RA3e-f · RA5',
    tabs: [
      { label: '⚖️ Formas jurídicas',
        html: () => {
          const fj = EMPRESA_STATE.planEmpresa.ap5?.formaJuridica || '';
          return ayudaConcepto('Sociedad de Responsabilidad Limitada (SL)', 'RA3e',
            'Es la forma jurídica más habitual en España para pymes. Características clave: capital mínimo 3.000 €, responsabilidad limitada al capital aportado, mínimo 1 socio, administración flexible. El capital se divide en participaciones (no acciones).',
            'La SL protege el patrimonio personal de los socios: si la empresa debe 100.000 €, los socios solo responden con lo aportado, no con sus casas ni cuentas personales.'
          ) + ayudaConcepto('Autónomo (empresario individual)', 'RA3e',
            'Sin límite de capital ni proceso de constitución, pero el autónomo responde con todo su patrimonio personal ante las deudas del negocio. Adecuado para actividades unipersonales con bajo riesgo económico.',
            'Ventaja: costes de constitución nulos, administración sencilla.<br>Desventaja: responsabilidad ilimitada, imagen menos profesional para contratar con grandes empresas.'
          ) + ayudaConcepto('Criterios de elección', 'RA3f',
            'Los factores que determinan la forma jurídica son: número de socios, capital disponible, nivel de riesgo de la actividad, previsión de crecimiento, y tratamiento fiscal (el tipo del IS puede ser más favorable que el IRPF a partir de cierto beneficio).',
            ''
          ) + ayudaAccion('Ir a Apartado 5 del plan', "planTab('5')")
        }
      },
      { label: '🧾 Obligaciones fiscales',
        html: () => {
          return ayudaConcepto('IVA — Impuesto sobre el Valor Añadido', 'RA5',
            'Las empresas actúan de recaudadoras: cargan IVA en sus ventas (IVA repercutido) y soportan IVA en sus compras (IVA soportado). Cada trimestre, si el repercutido es mayor, ingresan la diferencia en Hacienda. Si el soportado es mayor, Hacienda les devuelve o compensa.',
            'Tipos en España: 21% general, 10% reducido (restauración, transporte), 4% superreducido (alimentos básicos, medicamentos).'
          ) + ayudaFormula(`IVA a ingresar = IVA repercutido (ventas) − IVA soportado (compras)\nSi positivo → pagar a Hacienda (Mod. 303 trimestral)\nSi negativo → compensar en el trimestre siguiente`)
          + ayudaConcepto('Impuesto sobre Sociedades (IS)', 'RA5',
            'Grava el beneficio de las sociedades. Tipo general: 25%. Las empresas de nueva creación tributan al 15% los dos primeros períodos con base positiva. Se presenta anualmente (Mod. 200) y con pagos fraccionados (Mod. 202).',
            'En SimulApp, la cuenta de resultados aplica el 25% automáticamente. Puedes ver su impacto en el Plan económico-financiero → Resultados.'
          ) + ayudaAccion('Ver cuenta de resultados', "irA('plan-empresa');planTab('7')")
        }
      }
    ]
  },

  /* ── APARTADO 6: RRHH ── */
  'plan-ap6': {
    icono: '👔', titulo: 'Plan de organización y RRHH', modulo: 'Plan de empresa · RA3c-d · RA6',
    tabs: [
      { label: '🏗️ Estructura organizativa',
        html: () => {
          const org = EMPRESA_STATE.datos.organigrama || {};
          const asig = Object.values(org).filter(p => p.alumno?.trim()).length;
          return ayudaConcepto('Tipos de estructura organizativa', 'RA3c',
            '<strong>Funcional</strong>: cada departamento agrupa a personas con la misma función (RRHH, Comercial, Contabilidad). Es la más habitual en pymes. <strong>Divisional</strong>: se organiza por productos, mercados o zonas geográficas. <strong>Matricial</strong>: combina las dos anteriores; más compleja, usada en empresas medianas.',
            `SimulApp usa una estructura funcional con 5 departamentos: Dirección, RRHH, Comercial, Contabilidad y Fiscal. Actualmente ${asig} de 5 tienen responsable asignado.`
          ) + ayudaConcepto('Descripción de puestos', 'RA3d',
            'Cada puesto de trabajo debe tener definido: título, departamento al que pertenece, funciones concretas, requisitos de formación y experiencia, tipo de contrato y remuneración. Esto es la base para selección, evaluación y gestión de RRHH.',
            ''
          ) + ayudaAccion('Ver organigrama en Mi empresa', "irA('empresa')")
        }
      },
      { label: '📑 Contratos y convenio',
        html: () => {
          const conv = EMPRESA_STATE.rrhh?.convenio || {};
          return ayudaConcepto('Tipos de contrato de trabajo', 'RA6c',
            '<strong>Indefinido</strong>: sin fecha de fin, mayor protección para el trabajador. <strong>Temporal</strong>: por obra o servicio, por circunstancias de producción (máx. 6 meses ampliables). <strong>En prácticas</strong>: para titulados recientes, permite una retribución del 60-75% del salario del convenio. <strong>Formación y aprendizaje</strong>: para menores de 25 años sin titulación del puesto.',
            'La reforma laboral de 2021 eliminó el contrato por obra indefinida y convirtió en indefinidos la mayoría de los contratos temporales abusivos.'
          ) + ayudaConcepto('Convenio colectivo', 'RA6c',
            'Es el acuerdo entre representantes de empresas y trabajadores de un sector que fija las condiciones mínimas (salario base, jornada, categorías, complementos, vacaciones). La empresa no puede aplicar condiciones peores que las del convenio.',
            `El convenio de SimulApp tiene ${(conv.grupos||[]).length} grupos profesionales. El salario base del Grupo 4 (Administrativos) es ${conv.grupos?.[3]?.salarioBase?.toLocaleString('es-ES')||'1.300'} €/mes.`
          ) + ayudaFormula(`Coste empresa = Salario bruto + SS empresa (~31,65%)\nSalario neto = Salario bruto − SS trabajador (~6,47%) − IRPF (variable)\n\nEjemplo: salario bruto 1.500 € → coste empresa ~1.975 € → neto ~1.200 €`)
          + ayudaAccion('Ver nóminas en Nominasol', "irA('programas')")
        }
      }
    ]
  },

  /* ── APARTADO 8: MARKETING ── */
  'plan-ap8': {
    icono: '📣', titulo: 'Plan de marketing', modulo: 'Plan de empresa · RA6b',
    tabs: [
      { label: '📣 Las 4P del marketing',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Política de Producto', 'RA6b',
            'Define qué ofreces y cómo lo diferencias. Incluye: características físicas, calidad, diseño, marca, packaging, garantía, servicios postventa. El producto debe satisfacer una necesidad mejor que la competencia o a un precio que justifique la diferencia.',
            `Para ${e.nombre||'vuestra empresa'}: ¿qué hace único vuestro producto? ¿La calidad, el diseño, la personalización, la rapidez de entrega?`
          ) + ayudaConcepto('Política de Precio', 'RA6b',
            'Hay tres estrategias básicas: <strong>coste más margen</strong> (sumas tus costes y añades el margen deseado), <strong>competencia</strong> (te ajustas al precio de mercado), y <strong>valor percibido</strong> (cobras lo que el cliente valora, independientemente del coste). La tercera es la más rentable cuando funciona.',
            ''
          ) + ayudaConcepto('Distribución y Comunicación', 'RA6b',
            '<strong>Distribución (Place)</strong>: ¿cómo llega el producto al cliente? Canal directo (vendes tú), indirecto corto (minorista), indirecto largo (mayorista → minorista). Online vs físico. Propio vs distribuidor.<br><strong>Comunicación (Promotion)</strong>: publicidad, redes sociales, relaciones públicas, promociones, ferias, boca a boca. El canal debe coincidir con dónde está tu cliente.',
            ''
          ) + ayudaAccion('Ir al Plan de marketing', "planTab('8')")
        }
      }
    ]
  },

  /* ── MENSAJERÍA ── */
  'mensajeria': {
    icono: '📧', titulo: 'Correo y situaciones', modulo: 'Gestión operativa · RA6',
    tabs: [
      { label: '📧 Comunicación profesional',
        html: () => {
          return ayudaConcepto('Comunicación escrita en la empresa', 'RA6a',
            'El correo electrónico es el documento profesional más habitual. Un buen correo de empresa tiene: asunto concreto, saludo apropiado, cuerpo claro y estructurado (máximo 3 párrafos), solicitud o acción esperada explícita, y cierre profesional.',
            'Error frecuente: correos sin asunto, o con asunto genérico ("hola", "consulta"). El asunto debe resumir el mensaje en menos de 8 palabras.'
          ) + ayudaConcepto('Tipos de comunicación empresarial', 'RA6a',
            '<strong>Interna</strong>: entre personas de la misma empresa (comunicados, circulares, actas).<br><strong>Externa</strong>: con clientes, proveedores, administraciones (cartas, ofertas, reclamaciones, notificaciones).<br><strong>Formal vs informal</strong>: la comunicación formal sigue protocolos y tiene efectos jurídicos; la informal es ágil pero no vincula.',
            ''
          ) + ayudaConcepto('Gestión de situaciones imprevistas', 'RA6g',
            'En la empresa real, constantemente surgen imprevistos: un cliente que recuerda, un proveedor que no entrega, una normativa que cambia. La capacidad de respuesta rápida y bien argumentada es una competencia profesional clave.',
            'En SimulApp, los correos del mercado intergrupal simulan estas situaciones. La calidad de la respuesta (plazo, tono, argumentación) forma parte de la evaluación.'
          ) + ayudaAccion('Ir al buzón de correo', "irA('mensajeria')")
        }
      }
    ]
  },

  /* ── TAREAS ── */
  'tareas': {
    icono: '✅', titulo: 'Tareas del grupo', modulo: 'Gestión operativa · RA6',
    tabs: [
      { label: '✅ Gestión de tareas',
        html: () => {
          const ge = EMPRESA_STATE.gestion;
          const pend = (ge.tareas||[]).filter(t=>t.estado==='pendiente').length;
          return ayudaConcepto('Gestión de proyectos y tareas', 'RA6g',
            'En toda empresa las tareas tienen prioridad, plazo, responsable y criterio de éxito. La metodología Kanban (tarjetas que fluyen entre columnas: Pendiente → En curso → Entregado → Evaluado) es la más visual y habitual en equipos pequeños.',
            `Actualmente tienes ${pend} tarea${pend!==1?'s':''} pendiente${pend!==1?'s':''}.`
          ) + ayudaConcepto('Checklist de constitución', 'RA3 · RA5',
            'Las secciones de creación de empresa tienen checklists que siguen el proceso real: desde elegir nombre hasta inscribirse en la Seguridad Social. Completarlos en orden te da una visión del proceso completo de constitución empresarial.',
            'Cada ítem del checklist tiene su fundamento legal real. Cuando lo marcas como hecho en SimulApp, refleja que has completado ese trámite en la simulación.'
          ) + ayudaConcepto('Diagrama de Gantt', 'RA6g',
            'Herramienta visual que muestra en qué semana se planifica cada tarea. El eje horizontal es el tiempo (semanas), el eje vertical son las tareas o departamentos. Permite detectar cuellos de botella y solapamientos de trabajo.',
            ''
          ) + ayudaAccion('Ver todas las tareas', "irA('tareas')")
        }
      }
    ]
  },

  /* ── AUTOEVALUACIÓN ── */
  'autoevaluacion': {
    icono: '🪞', titulo: 'Autoevaluación y reflexión', modulo: 'Evaluación · RA · CE',
    tabs: [
      { label: '🪞 Para qué sirve evaluarte',
        html: () => {
          return ayudaConcepto('Evaluación por resultados de aprendizaje', 'RA',
            'Los Resultados de Aprendizaje (RA) son las competencias que debes demostrar al finalizar el módulo. No evalúan si memorizaste conceptos, sino si sabes aplicarlos en situaciones reales. Cada RA se evalúa mediante Criterios de Evaluación (CE) concretos.',
            'Un RA es como un objetivo: "es capaz de...". Un CE especifica cómo se demuestra ese logro: "elabora correctamente...", "identifica con precisión...", "aplica de forma autónoma...".'
          ) + ayudaConcepto('Autoevaluación honesta', 'RA',
            'La autoevaluación no es para inflarte la nota. Es para identificar qué dominias y qué no. Una autoevaluación realista te ayuda a saber dónde enfocar el esfuerzo de cara al trimestre siguiente. Los estudios muestran que los alumnos que se autoevalúan con precisión aprenden más.',
            'Escala de SimulApp: 1 = No lo he trabajado todavía · 2 = Lo entiendo pero no lo aplico con soltura · 3 = Lo aplico con ayuda · 4 = Lo aplico de forma autónoma.'
          ) + ayudaConcepto('Diferencia autoevaluación / coevaluación', 'RA',
            '<strong>Autoevaluación</strong>: tú te evalúas a ti mismo. Desarrolla metacognición (saber qué sabes).<br><strong>Coevaluación</strong>: un compañero te evalúa a ti. Desarrolla la capacidad de dar y recibir feedback constructivo, una competencia profesional fundamental.',
            ''
          ) + ayudaAccion('Ir a autoevaluación', "irA('autoevaluacion')")
        }
      }
    ]
  },

  /* ── TRAMITES ── */
  'tramites': {
    icono: '📑', titulo: 'Trámites de constitución', modulo: 'Mi empresa · RA3e · RA5',
    tabs: [
      { label: '📑 Proceso de constitución',
        html: () => {
          const tr = EMPRESA_STATE.tramites || [];
          const comp = tr.filter(t=>t.estado==='completado').length;
          return ayudaConcepto('¿Por qué hay que constituir la empresa?', 'RA3e',
            'Una empresa no existe legalmente hasta que se completan los trámites de constitución. Sin ellos no puede emitir facturas, contratar empleados, abrir cuentas bancarias en nombre de la empresa, ni firmar contratos vinculantes. El proceso tiene un orden: primero notaría, luego Registro Mercantil, luego Hacienda.',
            `${comp} de ${tr.length} trámites completados en la simulación.`
          ) + ayudaConcepto('Escritura pública de constitución', 'RA5',
            'Es el primer paso formal: ante Notario, los socios firman los estatutos sociales y aportan el capital. El Notario verifica las identidades y la legalidad de los estatutos. Coste aproximado: 300-600 € en función del capital social.',
            ''
          ) + ayudaConcepto('Registro Mercantil', 'RA5',
            'La sociedad adquiere personalidad jurídica plena cuando se inscribe en el Registro Mercantil provincial. Es el acto que le da existencia legal frente a terceros. El plazo habitual es 15 días desde que se presenta la escritura.',
            ''
          ) + ayudaFormula(`Orden típico de trámites:\n1. Certificado negativo de denominación (RMC)\n2. Depósito del capital en banco\n3. Escritura pública (Notaría)\n4. Liquidación Impuesto sobre Transmisiones (Hacienda)\n5. Inscripción en Registro Mercantil\n6. NIF definitivo + Alta censal (Mod. 036)\n7. Inscripción empresa en SS + CCC\n8. Alta de trabajadores en SS`)
          + ayudaAccion('Ver trámites de constitución', "irA('empresa')")
        }
      }
    ]
  },

  /* ── DOSSIER ── */
  'dossier': {
    icono: '📄', titulo: 'Dossier del proyecto 3160', modulo: 'Módulo 3160 · Proyecto intermodular',
    tabs: [
      { label: '📄 Qué es el Módulo 3160',
        html: () => {
          const pct = typeof calcProgresoPlan === 'function' ? calcProgresoPlan() : 0;
          return ayudaConcepto('Módulo de Proyecto Intermodular (3160)', 'RA1-RA6',
            'El módulo 3160 es el proyecto integrador del ciclo. Su objetivo es que apliques de forma coordinada los conocimientos de todos los módulos del CFGS en un proyecto empresarial real. No es un módulo de contenido nuevo: es la síntesis de todo lo aprendido.',
            `Tu dossier está al ${pct}% de completitud. El objetivo es documentar evidencias de todos los RA del ciclo.`
          ) + ayudaConcepto('Evidencias de aprendizaje', 'RA1-RA6',
            'Una evidencia es cualquier documento que demuestra que has alcanzado un resultado de aprendizaje. En SimulApp se generan automáticamente: el plan de empresa, las actas de reunión, las decisiones tomadas, las tareas evaluadas, las nóminas calculadas.',
            'Para la defensa del proyecto, necesitarás explicar qué aprendiste con cada evidencia, no solo presentarla.'
          ) + ayudaAccion('Ir al dossier', "irA('dossier')")
        }
      }
    ]
  },

  /* ── RANKING ── */
  'ranking': {
    icono: '🏆', titulo: 'Ranking intergrupal', modulo: 'Mercado · Competencia',
    tabs: [
      { label: '🏆 Cómo se calcula la puntuación',
        html: () => {
          const e = _emp();
          return ayudaConcepto('Sistema de puntuación', '',
            'El ranking mide la <strong>actividad empresarial</strong>, no solo los resultados. Una empresa muy activa en el mercado pero con margen bajo puede puntuar más que una pasiva con buenos números. Refleja que en la economía real, la actividad genera aprendizaje.',
            ''
          ) + ayudaFormula(`Puntos = Transacciones completadas × 10\n       + Facturación (€) ÷ 100\n       + Tareas evaluadas × 8\n       + % Plan de empresa × 5\n\nEjemplo: 5 transacciones + 2.000€ + 6 tareas + 60% plan\n= 50 + 20 + 48 + 300 = 418 puntos`)
          + ayudaConcepto('Competencia y estrategia', 'RA2',
            'En mercados competitivos, observar lo que hacen las empresas líderes es tan importante como desarrollar la propia estrategia. ¿Están cerrando más transacciones? ¿Su plan de empresa está más avanzado? ¿Qué tipo de operaciones hacen en el mercado?',
            e.nombre ? `${e.nombre} está en el ranking. Compara tu actividad con los primeros.` : ''
          ) + ayudaAccion('Ver ranking completo', "irA('ranking')")
        }
      }
    ]
  },

  /* ── PLAN AP1 EXPANSION ── */

  /* ── PLAN AP4 EXPANSION: add tab for mercado ── */


};

// Tecla Enter en login
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('pantalla-login').classList.contains('activo')) {
    iniciarSesion();
  }
});

/* ============================================================
   VISTA: PERFIL — ALUMNO Y DOCENTE
   ============================================================ */
if (!window.PERFIL_STATE) window.PERFIL_STATE = { tab: APP.rolActivo === 'alumno' ? 'progreso' : 'alumnos' };

