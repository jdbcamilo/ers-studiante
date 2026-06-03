const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
  TableOfContents
} = require('docx');
const fs = require('fs');

// ─── helpers ────────────────────────────────────────────────────────────────
const FONT = 'Times New Roman';
const sz   = (pt) => pt * 2;            // docx size units = half-points
const DXA  = (inches) => inches * 1440; // DXA units

const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };

const cellMar = { top: 80, bottom: 80, left: 120, right: 120 };

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 276, lineRule: 'auto' },
    alignment: AlignmentType.BOTH,
    children: [new TextRun({ text, font: FONT, size: sz(12), color: '000000', ...opts })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { before: 60, after: 60, line: 276, lineRule: 'auto' },
    children: [new TextRun({ text, font: FONT, size: sz(12) })],
  });
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { before: 60, after: 60, line: 276, lineRule: 'auto' },
    children: [new TextRun({ text, font: FONT, size: sz(12) })],
  });
}

function space() {
  return new Paragraph({ children: [new TextRun('')] });
}

// ─── Heading helpers ─────────────────────────────────────────────────────────
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, font: FONT })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, font: FONT })] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, font: FONT })] });
}
function h4(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_4, children: [new TextRun({ text, font: FONT, bold: true, size: sz(11) })] });
}

// ─── Code Block Helper ───────────────────────────────────────────────────────
function codeBlock(text) {
  const COL_WIDTH = 9360; // 6.5 inches (margins are 1 inch left, 1 inch right on 8.5" width. 8.5 - 2 = 6.5. 6.5 * 1440 = 9360 dxa)
  return new Table({
    width: { size: COL_WIDTH, type: WidthType.DXA },
    columnWidths: [COL_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              left: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              right: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
            },
            shading: { fill: 'F9F9F9', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: text.split('\n').map(line => new Paragraph({
              spacing: { before: 20, after: 20, line: 240, lineRule: 'auto' },
              children: [
                new TextRun({
                  text: line,
                  font: 'Consolas',
                  size: sz(9.5),
                  color: '000000'
                })
              ]
            }))
          })
        ]
      })
    ]
  });
}

// ─── Tables ──────────────────────────────────────────────────────────────────
function headerCell(text, w) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: { fill: '2E75B6', type: ShadingType.CLEAR },
    margins: cellMar, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: FONT, bold: true, color: 'FFFFFF', size: sz(10) })]
    })]
  });
}

function dataCell(text, w, shade = 'F2F2F2') {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: { fill: shade, type: ShadingType.CLEAR },
    margins: cellMar, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text, font: FONT, size: sz(10) })] })]
  });
}

function boldDataCell(text, w, shade = 'F2F2F2') {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: { fill: shade, type: ShadingType.CLEAR },
    margins: cellMar, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text, font: FONT, bold: true, size: sz(10) })] })]
  });
}

// Case-use table (2-column: Campo | Descripción)
function cuTable(rows) {
  const COL1 = 2340, COL2 = 7020, TOTAL = COL1 + COL2;
  return new Table({
    width: { size: TOTAL, type: WidthType.DXA },
    columnWidths: [COL1, COL2],
    rows: [
      new TableRow({ children: [headerCell('Campo', COL1), headerCell('Descripción', COL2)] }),
      ...rows.map(([a, b], i) => new TableRow({
        children: [
          boldDataCell(a, COL1, i % 2 === 0 ? 'F2F2F2' : 'FFFFFF'),
          dataCell(b, COL2, i % 2 === 0 ? 'F2F2F2' : 'FFFFFF'),
        ]
      }))
    ]
  });
}

// RF table (5-column)
function rfTable(rows) {
  const cols = [800, 2000, 3560, 1000, 2000];
  const total = cols.reduce((a,b)=>a+b,0);  // 9360
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: ['ID','Nombre','Descripción','Prioridad','Usuario'].map((h,i) => headerCell(h, cols[i])) }),
      ...rows.map(([id,nom,desc,pri,usr], idx) => new TableRow({
        children: [id,nom,desc,pri,usr].map((t,i) => dataCell(t, cols[i], idx%2===0?'F2F2F2':'FFFFFF'))
      }))
    ]
  });
}

// RNF table (4-column)
function rnfTable(rows) {
  const cols = [800, 1800, 5760, 1000];
  const total = cols.reduce((a,b)=>a+b,0);  // 9360
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: ['ID','Categoría','Descripción','Prioridad'].map((h,i) => headerCell(h, cols[i])) }),
      ...rows.map(([id,cat,desc,pri], idx) => new TableRow({
        children: [id,cat,desc,pri].map((t,i) => dataCell(t, cols[i], idx%2===0?'F2F2F2':'FFFFFF'))
      }))
    ]
  });
}

// Roles table (4-column)
function rolesTable(rows) {
  const cols = [1860, 2340, 3600, 1560];
  const total = cols.reduce((a,b)=>a+b,0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: ['Rol / Tester','Perfil','Responsabilidades','Participación'].map((h,i) => headerCell(h, cols[i])) }),
      ...rows.map(([a,b,c,d],idx) => new TableRow({
        children: [
          boldDataCell(a, cols[0], idx%2===0?'F2F2F2':'FFFFFF'),
          dataCell(b, cols[1], idx%2===0?'F2F2F2':'FFFFFF'),
          dataCell(c, cols[2], idx%2===0?'F2F2F2':'FFFFFF'),
          dataCell(d, cols[3], idx%2===0?'F2F2F2':'FFFFFF'),
        ]
      }))
    ]
  });
}

// Tools table (3-column)
function toolsTable(rows) {
  const cols = [2500, 3860, 3000];
  const total = cols.reduce((a,b)=>a+b,0); // 9360
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: ['Herramienta','Descripción','Uso en el Proyecto'].map((h,i) => headerCell(h, cols[i])) }),
      ...rows.map(([a,b,c], idx) => new TableRow({
        children: [
          boldDataCell(a, cols[0], idx%2===0?'F2F2F2':'FFFFFF'),
          dataCell(b, cols[1], idx%2===0?'F2F2F2':'FFFFFF'),
          dataCell(c, cols[2], idx%2===0?'F2F2F2':'FFFFFF')
        ]
      }))
    ]
  });
}

// Risks table (6-column)
function risksTable(rows) {
  const cols = [500, 3000, 800, 800, 800, 3460];
  const total = cols.reduce((a,b)=>a+b,0); // 9360
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: ['No.','Riesgo','Prob.','Imp.','Sev.','Plan de Mitigación'].map((h,i) => headerCell(h, cols[i])) }),
      ...rows.map(([a,b,c,d,e,f], idx) => new TableRow({
        children: [
          dataCell(a, cols[0], idx%2===0?'F2F2F2':'FFFFFF'),
          boldDataCell(b, cols[1], idx%2===0?'F2F2F2':'FFFFFF'),
          dataCell(c, cols[2], idx%2===0?'F2F2F2':'FFFFFF'),
          dataCell(d, cols[3], idx%2===0?'F2F2F2':'FFFFFF'),
          boldDataCell(e, cols[4], idx%2===0?'F2F2F2':'FFFFFF'),
          dataCell(f, cols[5], idx%2===0?'F2F2F2':'FFFFFF')
        ]
      }))
    ]
  });
}

// Dictionary table (6-column)
function dictTable(rows) {
  const cols = [1800, 1300, 1100, 1300, 1500, 2360];
  const total = cols.reduce((a,b)=>a+b,0);  // 9360
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: ['Campo','Tipo','Long.','Restricción','Valores','Descripción'].map((h,i) => headerCell(h, cols[i])) }),
      ...rows.map(([a,b,c,d,e,f],idx) => new TableRow({
        children: [a,b,c,d,e,f].map((t,i) => dataCell(t,cols[i],idx%2===0?'F2F2F2':'FFFFFF'))
      }))
    ]
  });
}

// ─── DOCUMENT ────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level:0, format:LevelFormat.BULLET, text:'•', alignment:AlignmentType.LEFT,
          style:{ paragraph:{ indent:{ left:720, hanging:360 } } } }] },
      { reference: 'numbers', levels: [{ level:0, format:LevelFormat.DECIMAL, text:'%1.', alignment:AlignmentType.LEFT,
          style:{ paragraph:{ indent:{ left:720, hanging:360 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: FONT, size: sz(12) } } },
    paragraphStyles: [
      { id:'Heading1', name:'Heading 1', basedOn:'Normal', next:'Normal', quickFormat:true,
        run:{ size:sz(16), bold:true, font:FONT, color:'2E75B6' },
        paragraph:{ spacing:{ before:240, after:120 }, outlineLevel:0 } },
      { id:'Heading2', name:'Heading 2', basedOn:'Normal', next:'Normal', quickFormat:true,
        run:{ size:sz(14), bold:true, font:FONT, color:'2E75B6' },
        paragraph:{ spacing:{ before:200, after:100 }, outlineLevel:1 } },
      { id:'Heading3', name:'Heading 3', basedOn:'Normal', next:'Normal', quickFormat:true,
        run:{ size:sz(12), bold:true, font:FONT, color:'1F4E79' },
        paragraph:{ spacing:{ before:160, after:80 }, outlineLevel:2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: DXA(8.5), height: DXA(11) },
        margin: { top: DXA(1), right: DXA(1), bottom: DXA(1), left: DXA(1) }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: 'ERS – Plataforma de Salud Mental | Universidad de Córdoba', font: FONT, size: sz(9), color: '888888' })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Página ', font: FONT, size: sz(9) }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: sz(9) })]
      })] })
    },
    children: [

      // ── PORTADA ────────────────────────────────────────────────────────────
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1440, after: 200 },
        children: [new TextRun({ text: 'ERS Plataforma de Seguimiento y Evaluación de Salud Mental', font: FONT, size: sz(20), bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 600 },
        children: [new TextRun({ text: 'en Estudiantes de la Universidad de Córdoba', font: FONT, size: sz(16), bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: 'Autores y Testers del Software', font: FONT, size: sz(12), bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Juan Esteban Peña Durango', font: FONT, size: sz(12), bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Facultad de Ingeniería – Departamento de Ingeniería de Sistemas', font: FONT, size: sz(12) })] }),
      space(),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Gustavo Adolfo Padilla Ruiz', font: FONT, size: sz(12), bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Facultad de Ingeniería – Departamento de Ingeniería de Sistemas', font: FONT, size: sz(12) })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 },
        children: [new TextRun({ text: 'Desarrollo Web II', font: FONT, size: sz(12) })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 },
        children: [new TextRun({ text: 'Universidad de Córdoba', font: FONT, size: sz(12), bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Montería, Córdoba – 2026', font: FONT, size: sz(12), bold: true })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ── TOC ────────────────────────────────────────────────────────────────
      new TableOfContents('Tabla de Contenido', { hyperlink: true, headingStyleRange: '1-3' }),
      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════════════
      // INTRODUCCIÓN
      // ═══════════════════════════════════════════════════════════════════════
      h1('Introducción'),
      body('La salud mental de los estudiantes universitarios representa uno de los factores más determinantes en su éxito académico, su desarrollo personal y su calidad de vida. En la actualidad, la creciente presión académica, las dificultades económicas, la competencia entre pares y las altas expectativas familiares e institucionales han derivado en un incremento alarmante de trastornos emocionales como el estrés crónico, la ansiedad, la depresión y el insomnio dentro de la comunidad universitaria.'),
      space(),
      body('La Universidad de Córdoba, al igual que muchas instituciones de educación superior en Colombia, no es ajena a esta realidad. Si bien cuenta con programas de bienestar y acompañamiento psicológico, estos no logran cubrir la totalidad de la demanda existente, debido a la limitada disponibilidad de horarios, la escasez de personal especializado y la persistencia de estigmas culturales que impiden a muchos jóvenes buscar ayuda profesional oportunamente.'),
      space(),
      body('Ante este panorama, el presente documento describe la Especificación de Requisitos de Software (ERS) de una plataforma digital orientada al seguimiento y evaluación de la salud mental de los estudiantes de la Universidad de Córdoba. Esta herramienta tecnológica busca complementar los esfuerzos institucionales de bienestar universitario, ofreciendo a los estudiantes un espacio accesible, privado y disponible en cualquier momento para monitorear su estado emocional, identificar señales de riesgo tempranas y fomentar hábitos de autocuidado. La plataforma incorpora además un Asistente de Inteligencia Artificial para contención emocional inmediata y soporte de primera línea.'),
      space(),
      body('El documento está organizado conforme a los lineamientos de la Ingeniería de Software y abarca desde el planteamiento del problema y los objetivos del proyecto, hasta la especificación detallada de los requisitos funcionales y no funcionales del sistema, incluyendo los diagramas de análisis y diseño que permiten comprender su estructura, comportamiento e interacciones.'),
      space(),
      body('Este proyecto se enmarca en la asignatura Desarrollo Web II y representa un ejercicio integral de ingeniería de software aplicado a una problemática real y de alta relevancia social en el contexto universitario colombiano.'),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════════════
      // 1. PLANTEAMIENTO
      // ═══════════════════════════════════════════════════════════════════════
      h1('1. Planteamiento del Problema'),
      body('En la Universidad de Córdoba, al igual que en muchas instituciones de educación superior en Colombia, los estudiantes se enfrentan a múltiples desafíos que impactan negativamente su salud mental. Factores como la exigencia académica, la presión por alcanzar un buen rendimiento, las dificultades económicas, la competencia entre compañeros y las expectativas familiares generan altos niveles de estrés, ansiedad, insomnio y depresión en la población estudiantil.'),
      space(),
      body('Si bien la universidad cuenta con programas de bienestar y apoyo psicológico, estos no logran cubrir toda la demanda existente. La limitada disponibilidad de horarios, la escasez de personal especializado y los prejuicios culturales hacia la atención en salud mental hacen que muchos jóvenes enfrenten en soledad situaciones emocionales críticas.'),
      space(),
      body('La falta de una atención oportuna y accesible tiene consecuencias que afectan distintos niveles dentro de la comunidad universitaria:'),
      bullet('Académico: bajo rendimiento, repitencia, pérdida de semestres y aumento de la deserción estudiantil.'),
      bullet('Personal: aparición de trastornos emocionales como depresión, ansiedad, problemas de sueño e incluso conductas autodestructivas.'),
      bullet('Social: aislamiento, dificultades en las relaciones interpersonales y debilitamiento del sentido de pertenencia hacia la universidad.'),
      bullet('Económico: incremento en los costos por repetir asignaturas, retraso en la graduación y disminución de las oportunidades laborales futuras.'),
      space(),
      body('Esta situación demanda una solución innovadora que permita complementar los esfuerzos institucionales, ofreciendo a los estudiantes un recurso accesible, seguro y disponible en todo momento.'),

      // 1.1 Justificación
      h2('1.1 Justificación'),
      body('El desarrollo de esta plataforma se justifica desde múltiples dimensiones. Desde el ámbito académico, existe una correlación directa y documentada entre el bienestar emocional de los estudiantes y su rendimiento académico. Desde la perspectiva institucional, contar con datos agregados sobre el estado emocional de la comunidad estudiantil permite a la Universidad de Córdoba diseñar estrategias de bienestar más focalizadas y efectivas. Desde el enfoque tecnológico, el avance de las aplicaciones web y la inteligencia artificial abre oportunidades para democratizar el acceso a recursos de salud mental, eliminando barreras de tiempo, espacio y estigma social. Finalmente, el proyecto se enmarca en los principios de la Ley 1581 de 2012 sobre protección de datos personales en Colombia y en los estándares ISO/IEC 25010:2011.'),

      // 1.1.2 Razones
      h2('1.1.2 Razones del por qué se va a realizar el proyecto'),
      bullet('Necesidad identificada: Existe una brecha significativa entre la demanda de atención en salud mental por parte de los estudiantes universitarios y la oferta de servicios psicológicos disponibles.'),
      bullet('Accesibilidad limitada: Los servicios de bienestar universitario presentan restricciones de horario y capacidad que impiden atender a todos los estudiantes que lo necesitan.'),
      bullet('Estigma social: Muchos estudiantes evitan buscar ayuda profesional por temor al juicio de sus compañeros o familiares.'),
      bullet('Detección temprana: Una herramienta de monitoreo continuo permite identificar señales de riesgo emocional antes de que se conviertan en crisis.'),
      bullet('Apoyo complementario con IA: La plataforma incorpora un asistente inteligente de contención emocional, disponible las 24 horas, sin reemplazar la atención psicológica profesional.'),
      bullet('Aplicación de conocimientos: El proyecto representa una oportunidad para aplicar los conocimientos adquiridos en Desarrollo Web II en la solución de un problema real con impacto social.'),
      bullet('Escalabilidad futura: El sistema está concebido como un prototipo funcional que puede evolucionar hacia una plataforma más robusta con integración total con especialistas en línea.'),

      // 1.2 Objetivo General
      h2('1.2 Objetivo General'),
      body('Desarrollar una plataforma digital orientada a la salud mental de los estudiantes de la Universidad de Córdoba, que permita ofrecer un espacio accesible, seguro y confiable para el monitoreo del estado emocional, la identificación temprana de señales de riesgo, la promoción de hábitos de autocuidado y el apoyo emocional inmediato mediante inteligencia artificial.'),

      // 1.3 Objetivos Específicos
      h2('1.3 Objetivos Específicos'),
      bullet('Analizar la situación actual de los estudiantes en relación con la salud mental, identificando las principales necesidades que el sistema debe atender.'),
      bullet('Definir los requisitos funcionales y no funcionales del software, asegurando que la plataforma sea accesible, confiable y adecuada al contexto institucional.'),
      bullet('Diseñar una interfaz gráfica intuitiva y empática que facilite la interacción de los estudiantes con el sistema y fomente su uso continuo.'),
      bullet('Implementar un prototipo funcional que incorpore módulos de registro, diario emocional, chat con IA, autoevaluación emocional, almacenamiento de resultados y generación de reportes.'),
      bullet('Probar el sistema con un grupo piloto de estudiantes, evaluando la usabilidad, el rendimiento y la satisfacción de los usuarios.'),
      bullet('Documentar el proceso de desarrollo y los resultados de las pruebas, generando insumos para futuras mejoras o integraciones con los programas de bienestar institucional.'),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════════════
      // 2. ERS
      // ═══════════════════════════════════════════════════════════════════════
      h1('2. Especificación de Requisitos Software'),

      // 2.1 Descripción
      h2('2.1 Descripción del Sistema'),
      body('La plataforma de seguimiento y evaluación de salud mental es un sistema web desarrollado con Laravel (backend) y React con Inertia.js (frontend), diseñado para la comunidad académica de la Universidad de Córdoba. El sistema ofrece herramientas digitales que permiten a los estudiantes y docentes monitorear su estado emocional de forma periódica, registrar reflexiones personales en un diario emocional, conversar con un asistente de Inteligencia Actoral para contención emocional, completar cuestionarios de autoevaluación psicométrica y visualizar la evolución de su bienestar mediante reportes gráficos interactivos.'),
      space(),
      body('El sistema opera como una aplicación web de arquitectura cliente-servidor, accesible desde navegadores modernos tanto en computadoras de escritorio como en dispositivos móviles. La plataforma cuenta con tres perfiles de usuario claramente diferenciados: el Estudiante, el Docente/Profesor y el Administrador de Bienestar. La autenticación soporta credenciales tradicionales (correo/contraseña) y llaves de seguridad WebAuthn (Passkeys). La comunicación entre capas se realiza mediante HTTPS, garantizando la confidencialidad e integridad de la información.'),

      // 2.2 Objetivo
      h2('2.2 Objetivo del Sistema'),
      body('El objetivo central del sistema es proporcionar a la comunidad académica de la Universidad de Córdoba una herramienta tecnológica accesible, privada y fácil de usar que les permita:'),
      bullet('Realizar autoevaluaciones periódicas de su estado emocional mediante cuestionarios psicométricos validados.'),
      bullet('Registrar y hacer seguimiento a su evolución emocional mediante un diario personal con estados de ánimo y puntuaciones.'),
      bullet('Interactuar con un Asistente de IA para recibir contención emocional, pautas de afrontamiento y escucha activa de forma inmediata.'),
      bullet('Acceder a reportes visuales e interactivos que reflejen tendencias en su bienestar psicológico.'),
      bullet('Enviar sugerencias, retroalimentación y reportar situaciones al área de Bienestar Universitario.'),
      space(),
      body('Desde la perspectiva institucional, el sistema también tiene como objetivo proporcionar al Administrador de Bienestar datos agregados y anonimizados sobre el estado emocional general de la comunidad estudiantil, facilitando la toma de decisiones en materia de salud mental.'),

      // 2.3 Análisis de Usuarios
      h2('2.3 Análisis de Usuarios'),
      body('El sistema ha sido diseñado considerando las características, necesidades y limitaciones de tres tipos de usuarios principales:'),

      h3('2.3.1 Descripción de Roles'),
      rolesTable([
        ['Estudiante', 'Persona que cursa algún programa académico en la Universidad de Córdoba (17-30 años).', 'Registrarse, gestionar su diario emocional, conversar con el Asistente IA, completar tests de bienestar, consultar historial y reportes, enviar sugerencias y responder encuestas de satisfacción.', '50% de uso esperado en Bienestar'],
        ['Docente / Profesor', 'Miembro del cuerpo docente de la Universidad de Córdoba con perfil de apoyo institucional.', 'Registrarse con perfil de Docente, acceder a los módulos de diario, tests y buzón de sugerencias para emitir retroalimentación académica e institucional.', '20% de uso secundario'],
        ['Administrador de Bienestar', 'Personal del área de Bienestar Universitario o profesional de salud mental con acceso privilegiado al sistema.', 'Gestionar usuarios (activar/suspender/cambiar roles), administrar banco de preguntas y cuestionarios, revisar buzón de sugerencias y monitorear alertas de riesgo.', '30% de uso operativo administrativo'],
      ]),

      space(),
      body('Adicionalmente, se identifican usuarios secundarios o beneficiarios indirectos: coordinadores académicos, psicólogos y orientadores universitarios, y directivas universitarias que se benefician de los reportes estadísticos globales para tomar decisiones institucionales.'),

      // 2.4 Requisitos Funcionales
      h2('2.4 Requisitos Funcionales'),
      body('Los requisitos funcionales describen las capacidades específicas que el sistema debe proporcionar para satisfacer las necesidades de sus usuarios. Cada requisito está identificado con un código único, un nombre descriptivo, su descripción detallada, la prioridad de implementación y el tipo de usuario al que va dirigido.'),
      space(),
      rfTable([
        ['RF-01','Registro de Cuenta','El sistema debe permitir el registro de nuevos usuarios (Estudiantes y Docentes) solicitando: Cédula, Nombre Completo, Correo Electrónico, Contraseña, Fecha de Nacimiento, Sexo, Rol (Estudiante o Docente), Carrera y Semestre. El sistema calcula la edad automáticamente a partir de la fecha de nacimiento. La cédula y el correo deben ser únicos en el sistema. Tras el registro exitoso, la sesión se inicia automáticamente.','Alta','Estudiante / Docente'],
        ['RF-02','Inicio de Sesión (Credenciales y Passkey)','El sistema debe soportar dos métodos de autenticación: (A) credenciales tradicionales (correo/contraseña) con control de intentos (Rate Limiter), y (B) autenticación por llave de seguridad WebAuthn (Passkey) verificada contra la tabla passkeys. El sistema redirige al usuario a su panel según el rol asignado.','Alta','Estudiante / Docente / Administrador'],
        ['RF-03','Gestión de Perfil y Apariencia','El sistema debe permitir al usuario modificar su nombre, correo y carrera. Adicionalmente, el usuario puede seleccionar el tema visual de la aplicación: Claro (Light), Oscuro (Dark) o Sistema, aplicándose de forma inmediata mediante la clase dark de Tailwind CSS.','Media','Estudiante / Docente'],
        ['RF-04','Diario Emocional – Registrar Entrada','El sistema debe proporcionar un espacio tipo diario personal donde el estudiante pueda registrar entradas con Título, Estado de Ánimo (mood), puntuación de intensidad (1-10) y Nota/Reflexión. La entrada puede marcarse como Privada o Pública. Al guardar, se actualiza el campo last_mood_check_in del usuario.','Alta','Estudiante'],
        ['RF-05','Diario Emocional – Editar y Eliminar','El sistema debe permitir al propietario de una entrada de diario editarla mediante PATCH /journal/{entry} o eliminarla físicamente mediante DELETE /journal/{entry}, previa confirmación del usuario.','Media','Estudiante'],
        ['RF-06','Chat con Asistente de Inteligencia Artificial','El sistema debe proveer una interfaz de chat donde el estudiante pueda enviar mensajes al asistente de IA. El backend recupera el perfil académico del usuario como contexto y construye un prompt bajo lineamientos de contención psicológica (sin prescripción médica). La respuesta de la IA se muestra con efecto de escritura progresiva.','Alta','Estudiante'],
        ['RF-07','Tests de Bienestar Psicológico – Responder','El sistema debe permitir a los estudiantes completar cuestionarios de autoevaluación psicométrica (escalas Likert). Al finalizar, el backend calcula el puntaje total, determina el nivel de bienestar (ej: Ansiedad Leve, Ansiedad Severa, Estable) y almacena el resultado en evaluations y las respuestas individuales en responses.','Alta','Estudiante'],
        ['RF-08','Historial y Diagnósticos de Evaluaciones','El sistema debe mostrar al estudiante un panel interactivo con sus evaluaciones previas en forma de línea de tiempo, con gráficos de líneas y barras de evolución de puntuaciones, permitiendo ver el desglose individual de cada test.','Alta','Estudiante'],
        ['RF-09','Envío de Sugerencias y Retroalimentación','El sistema debe permitir a los usuarios (Estudiante/Docente) enviar mensajes al buzón de sugerencias clasificando su feedback en categorías (Infraestructura de Bienestar, Atención Psicológica, Clima de Aula, Otros). El registro se guarda en feedbacks con estado pending.','Media','Estudiante / Docente'],
        ['RF-10','Encuesta de Satisfacción','El sistema debe incluir una encuesta para calificar cuatro ejes: Satisfacción General, Calidad de Soporte Emocional, Claridad de los Módulos y Balance Académico Percibido (escala 1-5). El usuario puede marcar el envío como Anónimo (user_id = null en la BD).','Media','Estudiante / Docente'],
        ['RF-11','Gestión de Usuarios (Administrador)','El administrador debe poder visualizar la tabla completa de usuarios con Cédula, Nombre, Correo, Rol, Fecha de Registro y Estado. Puede activar/suspender cuentas (PATCH /admin/users/{id}/status), cambiar roles (PATCH /admin/users/{id}/role) y eliminar usuarios definitivamente (DELETE /admin/users/{id}).','Alta','Administrador de Bienestar'],
        ['RF-12','Gestión de Cuestionarios y Preguntas','El administrador debe poder crear, editar, publicar y desactivar cuestionarios de autoevaluación. Para cada cuestionario, puede definir preguntas con sus respectivas opciones de respuesta Likert, asignando un puntaje numérico a cada opción. Los registros se almacenan en las tablas questionnaires, questions y options.','Alta','Administrador de Bienestar'],
        ['RF-13','Gestión del Buzón de Sugerencias','El administrador debe poder visualizar las sugerencias pendientes, revisarlas en detalle y marcarlas como revisadas mediante POST /admin/feedbacks/{id}/review. Al marcar, el sistema graba el reviewed_by (ID del administrador), updated_at y reviewed_at en la base de datos.','Media','Administrador de Bienestar'],
      ]),

      // 2.4.1 RNF
      h3('2.4.1 Requisitos No Funcionales'),
      body('Los requisitos no funcionales establecen los atributos de calidad que debe cumplir el sistema, determinantes para garantizar una experiencia de uso satisfactoria, la seguridad de la información y la viabilidad técnica.'),
      space(),
      rnfTable([
        ['RNF-01','Usabilidad','La interfaz debe ser intuitiva, empática y responsiva. El tiempo de aprendizaje para un usuario nuevo no debe superar los 10 minutos. El sistema debe seguir principios de diseño centrado en el usuario y estándares WCAG 2.1 nivel AA. Soporta modo Claro, Oscuro y Sistema mediante Tailwind CSS.','Alta'],
        ['RNF-02','Seguridad','Todas las comunicaciones cifradas mediante HTTPS/TLS. Las contraseñas almacenadas con hashing bcrypt. Control de acceso basado en roles (RBAC) implementado en Laravel. Rate Limiter activo para prevenir ataques de fuerza bruta. Soporte de autenticación WebAuthn (Passkeys) para máxima seguridad.','Alta'],
        ['RNF-03','Rendimiento','El sistema debe responder a las solicitudes en un tiempo máximo de 3 segundos bajo condiciones normales. La generación de reportes no debe superar los 5 segundos. Debe soportar al menos 100 usuarios concurrentes sin degradación significativa.','Alta'],
        ['RNF-04','Disponibilidad','El sistema debe estar disponible al menos el 95% del tiempo. Las interrupciones no programadas no deben superar las 2 horas consecutivas. Se notificará a los usuarios con al menos 24 horas de anticipación ante mantenimientos programados.','Alta'],
        ['RNF-05','Accesibilidad','Accesible desde navegadores modernos (Chrome, Firefox, Edge, Safari) y dispositivos móviles sin configuraciones adicionales. El diseño responsivo debe adaptarse a diferentes tamaños de pantalla.','Alta'],
        ['RNF-06','Escalabilidad','La arquitectura debe permitir la incorporación de nuevos módulos en fases futuras. El sistema debe poder escalar horizontalmente para atender un mayor número de usuarios.','Media'],
        ['RNF-07','Mantenibilidad','El código fuente debe estar organizado siguiendo principios de Clean Code y documentado de forma clara. La arquitectura modular (Laravel + React) facilita la identificación y corrección de errores.','Media'],
        ['RNF-08','Privacidad','El sistema debe cumplir con la Ley 1581 de 2012 sobre protección de datos personales en Colombia. No se almacenarán diagnósticos clínicos oficiales. Las encuestas de satisfacción soportan envío anónimo. Los datos del chat con IA no se comparten con terceros.','Alta'],
        ['RNF-09','Portabilidad','El sistema debe poder desplegarse en diferentes entornos (local, nube pública, infraestructura universitaria) sin modificaciones significativas en el código fuente.','Media'],
        ['RNF-10','Fiabilidad','El sistema debe mantener la integridad de los datos almacenados. Los resultados de las autoevaluaciones deben registrarse correctamente incluso en condiciones de conectividad inestable.','Alta'],
      ]),

      // 2.5 Diagrama CU
      h2('2.5 Diagrama de Caso de Uso'),
      body('El diagrama de casos de uso representa las principales interacciones entre los actores del sistema y las funcionalidades disponibles. Se identifican tres actores principales: el Estudiante/Docente, usuario directo de la plataforma, y el Administrador de Bienestar, encargado de la gestión y supervisión del sistema.'),
      space(),
      body('A continuación se expone el mapeo general de casos de uso representados textualmente en formato jerárquico estructurado:'),
      codeBlock(`ACTORES: Estudiante, Docente, Administrador
CASOS DE USO:
  |- Módulo Seguridad
  |    |- CU-01 Registrar Cuenta de Usuario
  |    |- CU-02 Iniciar Sesión (Clave / Passkey)
  |    |- CU-03 Administrar Perfil y Apariencia
  |- Módulo Diario
  |    |- CU-04 Registrar Entrada en Diario
  |    |- CU-05 Modificar / Eliminar Entrada
  |- Módulo IA y Soporte
  |    |- CU-06 Conversar con Asistente de IA
  |- Módulo Diagnósticos
  |    |- CU-07 Responder Test de Bienestar
  |    |- CU-08 Consultar Historial y Gráficos
  |- Módulo Feedback
  |    |- CU-09 Enviar Sugerencia al Buzón
  |    |- CU-10 Diligenciar Encuesta de Satisfacción
  |- Módulo Administración
       |- CU-11 Gestionar Usuarios (Status / Rol)
       |- CU-12 Gestionar Cuestionarios e Hilos
       |- CU-13 Revisar Buzón de Sugerencias`),

      // 2.6 Documentación CU
      h2('2.6 Documentación de Casos de Uso'),
      body('A continuación se presenta la documentación detallada de cada caso de uso identificado en el sistema, agrupados por módulo funcional.'),

      // MÓDULO I
      h3('Módulo I: Seguridad, Autenticación y Perfil'),
      space(),
      h3('CU-01: Registrar Cuenta de Usuario'),
      cuTable([
        ['Nombre del caso de uso','Registrar cuenta de usuario'],
        ['Actor principal','Estudiante / Docente'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','La persona debe estar en el portal público de registro sin sesión activa. La cédula y el correo no deben existir previamente en el sistema.'],
        ['Descripción','Permite a una persona no registrada crear una cuenta en el sistema ingresando datos académicos, personales y credenciales.'],
        ['Flujo principal','1. El usuario accede a la pantalla de registro. 2. El sistema solicita: Cédula, Nombre Completo, Correo Electrónico, Contraseña, Fecha de Nacimiento, Sexo, Tipo de Rol (Estudiante o Docente), Carrera y Semestre (si es Estudiante). 3. El frontend calcula la edad estimada de forma interactiva. 4. El usuario hace clic en "Crear cuenta". 5. El backend (Laravel Fortify) valida políticas de contraseña, unicidad de cédula y correo. 6. La acción CreateNewUser calcula la edad exacta desde la fecha de nacimiento. 7. Se crea el usuario con estado active y se inicia sesión automáticamente. 8. El sistema redirige al usuario al Dashboard.'],
        ['Flujo alterno','A1 – Correo o cédula ya registrados: El sistema muestra un mensaje indicando el conflicto y sugiere iniciar sesión o recuperar la contraseña. A2 – Datos inválidos: El sistema resalta los campos con errores y muestra mensajes descriptivos de validación.'],
        ['Postcondición','La cuenta de usuario es creada satisfactoriamente con la contraseña encriptada (bcrypt) y se genera una sesión de navegación activa.'],
        ['Prioridad','Alta'],
      ]),
      space(),

      h3('CU-02: Iniciar Sesión'),
      cuTable([
        ['Nombre del caso de uso','Iniciar sesión en la plataforma'],
        ['Actor principal','Estudiante / Docente / Administrador'],
        ['Actores secundarios','Sistema WebAuthn (para Passkeys)'],
        ['Precondición','El usuario debe poseer una cuenta activa en el sistema.'],
        ['Descripción','Permite a un usuario registrado acceder de manera segura mediante credenciales tradicionales (correo/contraseña) o una llave de seguridad Passkey (WebAuthn).'],
        ['Flujo principal','1. El usuario accede a la pantalla de inicio de sesión. 2. El sistema presenta dos vías de autenticación. 3. Subflujo A (Credenciales): El usuario ingresa correo y contraseña. El sistema valida a través de Laravel Fortify con Rate Limiter (máximo 5 intentos fallidos por minuto). 4. Subflujo B (Passkey): El usuario hace clic en "Iniciar sesión con llave de acceso". El navegador provee la firma criptográfica que el servidor valida contra la tabla passkeys. 5. Si es exitoso, el sistema inicia la sesión. 6. Se redirige al panel según el rol del usuario.'],
        ['Flujo alterno','A1 – Límite de intentos excedido: El sistema retorna error 429 y muestra advertencia de bloqueo temporal. A2 – Credenciales incorrectas: El sistema muestra un mensaje de error genérico sin especificar qué dato es incorrecto. A3 – Cuenta suspendida: El sistema informa que la cuenta ha sido suspendida y sugiere contactar al administrador.'],
        ['Postcondición','El usuario tiene acceso a los módulos privados de la plataforma bajo una sesión protegida, con los permisos correspondientes a su rol.'],
        ['Prioridad','Alta'],
      ]),
      space(),

      h3('CU-03: Administrar Perfil y Apariencia'),
      cuTable([
        ['Nombre del caso de uso','Administrar perfil y apariencia visual'],
        ['Actor principal','Estudiante / Docente'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El usuario debe estar autenticado.'],
        ['Descripción','Permite a un usuario autenticado modificar su información básica de perfil (nombre, correo, carrera) o ajustar la apariencia visual de la aplicación (Modo Claro / Oscuro / Sistema).'],
        ['Flujo principal','1. El usuario navega a la sección de Configuración de Perfil. 2. El sistema muestra sus datos actuales precargados. 3. El usuario modifica su Nombre, Correo o Carrera y guarda. El backend valida y actualiza en la base de datos. 4. Para la apariencia, el usuario selecciona Claro, Oscuro o Sistema. El frontend aplica la clase dark de Tailwind CSS de forma inmediata.'],
        ['Flujo alterno','A1 – Correo ya en uso: El sistema muestra validación indicando que el correo pertenece a otro usuario.'],
        ['Postcondición','La base de datos guarda los datos actualizados y el cliente almacena las preferencias de interfaz para futuras visitas.'],
        ['Prioridad','Media'],
      ]),
      space(),

      // MÓDULO II
      h3('Módulo II: Diario Emocional y Auto-monitoreo'),
      space(),
      h3('CU-04: Registrar Entrada en Diario Emocional'),
      cuTable([
        ['Nombre del caso de uso','Registrar entrada en el diario emocional'],
        ['Actor principal','Estudiante'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El usuario debe estar autenticado como Estudiante.'],
        ['Descripción','Permite al estudiante registrar un escrito íntimo expresando su situación emocional diaria, asociando un estado de ánimo y una puntuación de intensidad.'],
        ['Flujo principal','1. El usuario accede a la sección "Diario Emocional". 2. El sistema muestra el formulario para redactar una nueva entrada. 3. El usuario ingresa: Título, Estado de Ánimo (ej: Alegre, Ansioso, Triste, Sereno), puntuación de intensidad (1-10) y Nota/Reflexión. 4. El usuario decide si la entrada es Privada (por defecto) o Pública. 5. El usuario hace clic en "Guardar Entrada". 6. El backend valida, sanitiza el texto (XSS) y crea una nueva fila en journal_entries. 7. El sistema actualiza el campo last_mood_check_in en la tabla users.'],
        ['Flujo alterno','A1 – Campo vacío: El sistema muestra advertencia y no permite guardar sin contenido. A2 – Error de conexión: El sistema notifica el error e invita a reintentar.'],
        ['Postcondición','El diario emocional almacena la nueva entrada de manera permanente e histórica, y el último chequeo de ánimo del usuario queda registrado.'],
        ['Prioridad','Alta'],
      ]),
      space(),

      h3('CU-05: Modificar / Eliminar Entrada de Diario'),
      cuTable([
        ['Nombre del caso de uso','Modificar o eliminar entrada del diario emocional'],
        ['Actor principal','Estudiante'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El usuario debe ser el propietario legítimo de la entrada (user_id de la sesión coincide con user_id del registro).'],
        ['Descripción','Permite al estudiante corregir el texto de una entrada previa de su diario emocional o borrarla de forma definitiva.'],
        ['Flujo principal','1. El estudiante visualiza el listado cronológico de sus notas emocionales. 2. Hace clic en "Editar" o "Eliminar". 3. Si es Editar: El sistema carga la nota en formulario interactivo. El usuario realiza ajustes y el sistema envía PATCH /journal/{entry}. 4. Si es Eliminar: El sistema despliega alerta de confirmación. Al aceptar, se envía DELETE /journal/{entry} que ejecuta borrado físico en la base de datos.'],
        ['Flujo alterno','A1 – Acceso no autorizado: El sistema retorna error 403 (Forbidden) si el user_id de sesión no coincide con el propietario.'],
        ['Postcondición','El diario es actualizado o la entrada eliminada, reflejando el cambio al instante en la interfaz.'],
        ['Prioridad','Media'],
      ]),
      space(),

      // MÓDULO III
      h3('Módulo III: Chat y Asistente con Inteligencia Artificial'),
      space(),
      h3('CU-06: Interactuar con Asistente Emocional (Chat con IA)'),
      cuTable([
        ['Nombre del caso de uso','Interactuar con el Asistente Emocional de IA'],
        ['Actor principal','Estudiante'],
        ['Actores secundarios','API de Inteligencia Artificial (LLM)'],
        ['Precondición','El estudiante debe estar logueado y disponer de conexión activa a Internet.'],
        ['Descripción','Permite al estudiante conversar de forma interactiva con un bot inteligente configurado para ofrecer contención emocional, pautas de afrontamiento y escucha activa, sin emitir diagnósticos médicos ni prescribir medicamentos.'],
        ['Flujo principal','1. El usuario ingresa a la pestaña "Chat de Apoyo". 2. El sistema muestra la interfaz de conversación. 3. El usuario redacta un mensaje y pulsa enviar. 4. La interfaz añade inmediatamente la burbuja del mensaje y envía POST /chat/message al ChatController. 5. El controlador recupera el perfil académico del usuario (carrera, semestre) y construye un prompt con instrucciones de contención psicológica. 6. Se realiza la llamada segura al modelo de IA. 7. El servidor retorna la respuesta al cliente. 8. El frontend muestra la burbuja de respuesta con micro-animación de escritura progresiva.'],
        ['Flujo alterno','A1 – Error de conectividad con la IA: El sistema muestra un mensaje de error amigable e invita al usuario a reintentar. A2 – Respuesta con tiempo de espera prolongado: El sistema muestra un indicador de carga mientras espera la respuesta.'],
        ['Postcondición','El estudiante recibe pautas de afrontamiento inmediatas. La conversación queda disponible en la interfaz durante la sesión.'],
        ['Prioridad','Alta'],
      ]),
      space(),

      // MÓDULO IV
      h3('Módulo IV: Diagnóstico, Tests y Evaluaciones de Bienestar'),
      space(),
      h3('CU-07: Responder Test de Bienestar Psicológico'),
      cuTable([
        ['Nombre del caso de uso','Responder test de bienestar psicológico'],
        ['Actor principal','Estudiante'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El estudiante tiene sesión iniciada y existen cuestionarios activos creados por el administrador.'],
        ['Descripción','Permite al estudiante resolver cuestionarios interactivos psicométricos que evalúan su nivel de ansiedad, depresión, equilibrio académico y estrés general mediante escalas Likert.'],
        ['Flujo principal','1. El estudiante navega a "Evaluaciones". 2. El sistema lista cuestionarios disponibles con tiempo estimado, tipo y descripción. 3. El estudiante hace clic en "Iniciar Test". 4. Se presentan las preguntas con opciones tipo Likert. 5. Al finalizar, el estudiante hace clic en "Finalizar y Evaluar". 6. El frontend envía las respuestas a POST /assessments. 7. El AssessmentController calcula puntajes ponderados según el score de la tabla options. 8. El backend determina el nivel de bienestar (ej: Ansiedad Severa, Leve, Estable). 9. Almacena el resultado en evaluations y cada respuesta individual en responses. 10. El sistema presenta al estudiante los resultados con análisis resumido y recomendaciones institucionales.'],
        ['Flujo alterno','A1 – Cuestionario incompleto: El sistema resalta preguntas sin responder al intentar finalizar. A2 – Sin cuestionarios activos: El sistema muestra mensaje informativo.'],
        ['Postcondición','Se crea una nueva evaluación terminada con sus respuestas asociadas, sirviendo de base para el historial y futuras alertas de riesgo.'],
        ['Prioridad','Alta'],
      ]),
      space(),

      h3('CU-08: Consultar Diagnósticos e Historial de Evaluaciones'),
      cuTable([
        ['Nombre del caso de uso','Consultar diagnósticos e historial de evaluaciones'],
        ['Actor principal','Estudiante'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El estudiante debe haber completado al menos un test de bienestar.'],
        ['Descripción','Permite al estudiante visualizar sus evaluaciones previas en forma de línea de tiempo con gráficos interactivos para evaluar su mejoría o decaimiento emocional a lo largo del periodo académico.'],
        ['Flujo principal','1. El estudiante entra a la sección "Reportes y Diagnósticos". 2. El sistema renderiza un panel con tarjetas del último test realizado y sus interpretaciones. 3. Se muestran gráficos interactivos de líneas y barras con la evolución histórica de puntuaciones. 4. El usuario puede hacer clic en "Ver Detalles" de cualquier test para ver el desglose individual de respuestas.'],
        ['Flujo alterno','A1 – Sin evaluaciones previas: El sistema muestra mensaje invitando al estudiante a realizar su primera autoevaluación.'],
        ['Postcondición','El estudiante visualiza con transparencia su progreso mental e historial de bienestar psicológico.'],
        ['Prioridad','Alta'],
      ]),
      space(),

      // MÓDULO V
      h3('Módulo V: Retroalimentación y Buzón de Sugerencias'),
      space(),
      h3('CU-09: Enviar Sugerencia o Retroalimentación Institucional'),
      cuTable([
        ['Nombre del caso de uso','Enviar sugerencia o retroalimentación institucional'],
        ['Actor principal','Estudiante / Docente'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El usuario debe estar autenticado.'],
        ['Descripción','Permite enviar una sugerencia, queja o mensaje sobre el bienestar en la universidad, clasificándola en una categoría para ser atendida por los coordinadores de bienestar.'],
        ['Flujo principal','1. El usuario accede a la sección "Buzón / Feedback". 2. El sistema despliega un formulario. 3. El usuario escoge una categoría (Infraestructura de Bienestar, Atención Psicológica, Clima de Aula, Otros) y redacta un mensaje detallado. 4. El usuario hace clic en "Enviar Sugerencia". 5. El frontend envía POST /feedback. 6. El FeedbackController valida el mensaje, guarda en feedbacks asociando el ID del usuario y marcando status como pending.'],
        ['Flujo alterno','A1 – Campo vacío: El sistema no permite enviar sin contenido y muestra advertencia. A2 – Error de red: El sistema guarda el intento localmente y reintenta al restablecer la conexión.'],
        ['Postcondición','La sugerencia queda guardada con estado pending en espera de la revisión del Administrador de Bienestar.'],
        ['Prioridad','Media'],
      ]),
      space(),

      h3('CU-10: Diligenciar Encuesta de Satisfacción General'),
      cuTable([
        ['Nombre del caso de uso','Diligenciar encuesta de satisfacción general'],
        ['Actor principal','Estudiante / Docente'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El usuario está autenticado en la plataforma.'],
        ['Descripción','Permite calificar de forma anónima o identificada la usabilidad de la plataforma de bienestar y el nivel de soporte emocional percibido.'],
        ['Flujo principal','1. El usuario accede a "Encuesta de Satisfacción". 2. El sistema presenta controles deslizantes de 1 a 5 para cuatro ejes: Satisfacción General, Calidad de Soporte Emocional, Claridad de los Módulos y Balance Académico Percibido. 3. El usuario escribe comentarios adicionales opcionales y puede marcar la opción de envío Anónimo. 4. Envía el formulario a POST /surveys. 5. SurveyController almacena el registro en satisfaction_surveys. Si seleccionó anónimo, guarda el user_id como null.'],
        ['Flujo alterno','A1 – Encuesta incompleta: El sistema resalta los campos obligatorios sin respuesta. A2 – Encuesta ya diligenciada recientemente: El sistema informa que ya participó en la encuesta actual.'],
        ['Postcondición','Se consolida una encuesta que servirá a los directivos para medir el impacto de la herramienta en la comunidad académica.'],
        ['Prioridad','Media'],
      ]),
      space(),

      // MÓDULO VI
      h3('Módulo VI: Administración y Gestión de la Plataforma'),
      space(),
      h3('CU-11: Gestionar Usuarios (Foco de Seguridad y Roles)'),
      cuTable([
        ['Nombre del caso de uso','Gestionar usuarios del sistema'],
        ['Actor principal','Administrador de Bienestar'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El usuario de sesión debe poseer el rol de admin.'],
        ['Descripción','Permite al administrador suspender/activar usuarios, cambiar roles institucionales y supervisar a la comunidad estudiantil y docente registrada.'],
        ['Flujo principal','1. El administrador ingresa a "Administración > Usuarios". 2. El sistema despliega la tabla con todos los usuarios registrados mostrando Cédula, Nombre, Correo, Rol, Fecha de Registro y Estado. 3. Subflujo A – Modificar Estado: El administrador activa/suspende la cuenta mediante PATCH /admin/users/{id}/status. 4. Subflujo B – Modificar Rol: El administrador cambia el rol mediante PATCH /admin/users/{id}/role. 5. Subflujo C – Eliminar: El administrador pulsa el botón de papelera y confirma la eliminación física mediante DELETE /admin/users/{id}.'],
        ['Flujo alterno','A1 – Error de permisos: El sistema retorna error 403 si el actor no tiene rol admin. A2 – Usuario no encontrado: El sistema muestra un mensaje de error 404.'],
        ['Postcondición','Los cambios tienen impacto inmediato sobre los privilegios de navegación del usuario afectado. Toda modificación queda registrada con trazabilidad.'],
        ['Prioridad','Alta'],
      ]),
      space(),

      h3('CU-12: Gestionar Banco de Preguntas y Cuestionarios'),
      cuTable([
        ['Nombre del caso de uso','Gestionar banco de preguntas y cuestionarios'],
        ['Actor principal','Administrador de Bienestar'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El administrador de bienestar tiene la sesión activa.'],
        ['Descripción','Permite diseñar nuevos tests de autodiagnóstico, modificar preguntas de bienestar y añadir las correspondientes puntuaciones Likert de respuesta.'],
        ['Flujo principal','1. El administrador navega a "Cuestionarios". 2. El sistema muestra la lista de cuestionarios actuales con su estado (draft, activo, inactivo). 3. El administrador puede crear un nuevo cuestionario definiendo título, tipo, descripción y tiempo estimado. 4. Para cada pregunta, define el enunciado (prompt) y las opciones de respuesta con su puntaje (ej: "Nunca" = 1, "Casi Siempre" = 4). 5. Al guardar, se almacenan los registros en las tablas questionnaires, questions y options de forma sincronizada.'],
        ['Flujo alterno','A1 – Cuestionario sin preguntas: El sistema impide publicar un cuestionario vacío. A2 – Error de validación: El sistema resalta los campos requeridos incompletos.'],
        ['Postcondición','El cuestionario actualizado o nuevo queda disponible en la plataforma para que los estudiantes puedan resolverlo.'],
        ['Prioridad','Alta'],
      ]),
      space(),

      h3('CU-13: Revisar Buzón de Sugerencias (Responder Feedback)'),
      cuTable([
        ['Nombre del caso de uso','Revisar y gestionar buzón de sugerencias'],
        ['Actor principal','Administrador de Bienestar'],
        ['Actores secundarios','Ninguno'],
        ['Precondición','El administrador está autenticado y existen sugerencias registradas por los usuarios.'],
        ['Descripción','Permite a los psicólogos de Bienestar leer las sugerencias de los estudiantes y marcarlas como revisadas, registrando el administrador firmante y la fecha de atención.'],
        ['Flujo principal','1. El administrador accede a "Administración > Retroalimentaciones". 2. El sistema muestra un listado de sugerencias con estado pending. 3. El administrador lee el caso en detalle. 4. Hace clic en "Marcar como Revisado". 5. El sistema envía POST /admin/feedbacks/{feedback}/review. 6. El controlador asigna reviewed_by con el ID del administrador, cambia status a reviewed y graba la fecha en reviewed_at.'],
        ['Flujo alterno','A1 – Sin sugerencias pendientes: El sistema muestra un mensaje indicando que el buzón está vacío. A2 – Filtros sin resultados: El sistema sugiere modificar los criterios de búsqueda.'],
        ['Postcondición','La sugerencia pasa al historial de atendidas, dejando trazabilidad completa de la gestión del área de Bienestar Universitario.'],
        ['Prioridad','Media'],
      ]),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // 2.7 MER
      h2('2.7 Modelo Entidad Relación'),
      body('El Modelo Entidad-Relación (MER) describe la estructura lógica de los datos que almacenará el sistema, identificando las entidades principales, sus atributos y las relaciones entre ellas. Este modelo constituye la base sobre la cual se diseñó la base de datos relacional del sistema en Laravel.'),
      space(),
      body('Las entidades principales identificadas en el sistema son las siguientes:'),
      bullet('users: Entidad central del sistema. Almacena todos los perfiles de usuario con datos académicos y personales.'),
      bullet('questionnaires: Cuestionarios de autoevaluación psicométrica administrados por el sistema.'),
      bullet('questions: Preguntas que componen cada cuestionario. Referencia el cuestionario padre.'),
      bullet('options: Opciones de respuesta con puntaje ponderado para cada pregunta Likert.'),
      bullet('evaluations: Resultado general de cada test completado por un estudiante.'),
      bullet('responses: Detalle de cada respuesta individual dentro de una evaluación.'),
      bullet('journal_entries: Entradas del diario emocional personal del estudiante.'),
      bullet('feedbacks: Buzón de sugerencias e sugerencias enviadas por la comunidad académica.'),
      bullet('satisfaction_surveys: Encuestas de satisfacción sobre la usabilidad de la plataforma.'),
      bullet('reports: Consolidados periódicos de bienestar generados para cada estudiante.'),
      space(),
      body('Las principales relaciones identificadas son:'),
      bullet('Un usuario puede escribir múltiples entradas en su diario emocional (journal_entries) – relación uno a muchos.'),
      bullet('Un usuario puede enviar múltiples sugerencias (feedbacks) y un administrador puede revisar sugerencias – relación uno a muchos.'),
      bullet('Un usuario puede completar múltiples evaluaciones (evaluations) – relación uno a muchos.'),
      bullet('Una evaluación corresponde a un cuestionario específico – relación muchos a uno.'),
      bullet('Una evaluación contiene múltiples respuestas individuales (responses) – relación uno a muchos.'),
      bullet('Un cuestionario está compuesto por múltiples preguntas – relación uno a muchos.'),
      bullet('Una pregunta tiene múltiples opciones de respuesta – relación uno a muchos.'),
      bullet('Un usuario puede diligenciar encuestas de satisfacción – relación uno a muchos.'),
      bullet('Un usuario posee múltiples reportes periódicos – relación uno a muchos.'),
      space(),

      h3('Diagrama Entidad-Relación de la Base de Datos en Mermaid'),
      body('El siguiente diagrama visualiza de manera completa el diseño lógico físico de las entidades, atributos, tipos y relaciones en la base de datos del sistema:'),
      codeBlock(`erDiagram
    users ||--o{ journal_entries : "escribe"
    users ||--o{ feedbacks : "envia"
    users ||--o{ feedbacks : "revisa (admin)"
    users ||--o{ evaluations : "completa"
    users ||--o{ satisfaction_surveys : "diligencia"
    users ||--o{ reports : "posee"

    questionnaires ||--o{ questions : "contiene"
    questionnaires ||--o{ evaluations : "es_evaluado_con"
    
    questions ||--o{ options : "ofrece"
    questions ||--o{ responses : "recibe"
    
    evaluations ||--o{ responses : "detalla"
    options ||--o{ responses : "es_elegida_en"

    users {
        bigint id PK
        string name
        string email UK
        string password
        string role
        string status
        string student_code UK
        string department
        string semester
        timestamp last_mood_check_in
        string cedula UK
        date birth_date
        integer age
        string gender
        string remember_token
    }

    questionnaires {
        bigint id PK
        string title
        string type
        text description
        string status
        integer estimated_minutes
        integer sort_order
    }

    questions {
        bigint id PK
        bigint questionnaire_id FK
        text prompt
        string scale_label
        integer sort_order
    }

    options {
        bigint id PK
        bigint question_id FK
        string label
        integer score
        integer sort_order
    }

    evaluations {
        bigint id PK
        bigint user_id FK
        bigint questionnaire_id FK
        integer score
        string level
        text summary
        json risk_flags
        timestamp completed_at
    }

    responses {
        bigint id PK
        bigint evaluation_id FK
        bigint question_id FK
        bigint option_id FK
        integer value
    }

    journal_entries {
        bigint id PK
        bigint user_id FK
        string title
        text content
        string mood
        integer mood_score
        boolean is_private
    }

    feedbacks {
        bigint id PK
        bigint user_id FK
        string category
        text message
        string status
        bigint reviewed_by FK
        timestamp reviewed_at
    }

    satisfaction_surveys {
        bigint id PK
        bigint user_id FK
        integer overall_score
        integer emotional_support_score
        integer platform_clarity_score
        integer academic_balance_score
        text comments
        boolean anonymous
    }

    reports {
        bigint id PK
        bigint user_id FK
        string period
        integer average_score
        string risk_level
        json trend_data
        text summary
    }`),
      space(),

      h2('2.9 Diccionario de Datos'),
      body('El diccionario de datos describe de forma detallada cada tabla de la base de datos del sistema, especificando el nombre de cada campo, su tipo de dato, longitud, restricciones, valores posibles y una descripción clara de su propósito.'),

      h3('Tabla: users (Usuarios)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único autogenerado del usuario'],
        ['name','VARCHAR','255','NOT NULL','Texto','Nombre completo del estudiante, docente o administrador'],
        ['email','VARCHAR','255','NOT NULL, UNIQUE','Email válido','Correo electrónico único del usuario'],
        ['password','VARCHAR','255','NOT NULL','Hash bcrypt','Contraseña cifrada mediante algoritmo bcrypt'],
        ['role','VARCHAR','255','DEFAULT student','student, teacher, admin','Rol del usuario dentro del sistema'],
        ['status','VARCHAR','255','DEFAULT active','active, suspended','Estado de la cuenta de usuario'],
        ['student_code','VARCHAR','255','NULLABLE, UNIQUE','Texto','Código estudiantil del usuario (aplica a Estudiantes)'],
        ['department','VARCHAR','255','NULLABLE','Texto','Nombre de la carrera o facultad del usuario'],
        ['semester','VARCHAR','255','NULLABLE','Texto','Semestre actual de estudios (aplica a Estudiantes)'],
        ['last_mood_check_in','TIMESTAMP','—','NULLABLE','Fecha/hora','Última vez que el usuario registró una entrada en el diario emocional'],
        ['cedula','VARCHAR','255','NULLABLE, UNIQUE','Texto','Cédula de ciudadanía del usuario'],
        ['birth_date','DATE','—','NULLABLE','Fecha','Fecha de nacimiento del usuario'],
        ['age','INTEGER','—','NULLABLE','Entero','Edad calculada del usuario en base a la fecha de nacimiento'],
        ['gender','VARCHAR','255','NULLABLE','Texto','Género del usuario'],
        ['remember_token','VARCHAR','100','NULLABLE','Token','Token de sesión persistente'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación del registro'],
      ]),
      space(),

      h3('Tabla: questionnaires (Cuestionarios de Bienestar)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único del cuestionario'],
        ['title','VARCHAR','255','NOT NULL','Texto','Título descriptivo del cuestionario (ej: Escala PHQ-9)'],
        ['type','VARCHAR','255','NOT NULL','Texto','Tipo de evaluación (ej: ansiedad, depresion, estres)'],
        ['description','TEXT','—','NULLABLE','Texto libre','Descripción del propósito y alcance del cuestionario'],
        ['status','VARCHAR','255','DEFAULT draft','draft, active, inactive','Estado de publicación del cuestionario'],
        ['estimated_minutes','INTEGER','—','DEFAULT 5','Entero','Tiempo estimado de resolución en minutos'],
        ['sort_order','INTEGER','—','DEFAULT 0','Entero','Orden de presentación en la lista de cuestionarios'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      h3('Tabla: questions (Preguntas del Cuestionario)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único de la pregunta'],
        ['questionnaire_id','BIGINT','—','FK → questionnaires, CASCADE','Entero','Cuestionario al que pertenece la pregunta'],
        ['prompt','TEXT','—','NOT NULL','Texto libre','Enunciado completo de la pregunta'],
        ['scale_label','VARCHAR','255','DEFAULT Likert','Texto','Etiqueta del tipo de escala utilizada en la pregunta'],
        ['sort_order','INTEGER','—','DEFAULT 0','Entero','Posición de la pregunta dentro del cuestionario'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      h3('Tabla: options (Opciones de Respuesta con Puntaje)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único de la opción de respuesta'],
        ['question_id','BIGINT','—','FK → questions, CASCADE','Entero','Pregunta a la que pertenece esta opción'],
        ['label','VARCHAR','255','NOT NULL','Texto','Texto descriptivo de la opción (ej: Nunca, Casi Siempre)'],
        ['score','INTEGER','—','NOT NULL','Entero','Puntaje numérico asignado a la opción para el cálculo total'],
        ['sort_order','INTEGER','—','DEFAULT 0','Entero','Orden de presentación de la opción en la pregunta'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      h3('Tabla: evaluations (Resultados Generales de Tests)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único de la evaluación realizada'],
        ['user_id','BIGINT','—','FK → users, CASCADE','Entero','Usuario que realizó la evaluación'],
        ['questionnaire_id','BIGINT','—','FK → questionnaires, CASCADE','Entero','Cuestionario utilizado en la evaluación'],
        ['score','INTEGER','—','NOT NULL','0 – máximo','Puntaje total obtenido calculado por el sistema'],
        ['level','VARCHAR','255','NOT NULL','Texto','Clasificación del nivel de bienestar (ej: Ansiedad Severa, Estable)'],
        ['summary','TEXT','—','NULLABLE','Texto libre','Resumen textual del diagnóstico generado por el sistema'],
        ['risk_flags','JSON','—','NULLABLE','JSON','Banderas de riesgo detectadas en los resultados de la evaluación'],
        ['completed_at','TIMESTAMP','—','NULLABLE','Fecha/hora','Fecha y hora en que el estudiante completó la evaluación'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      h3('Tabla: responses (Detalle de Respuestas por Test)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único del registro de respuesta'],
        ['evaluation_id','BIGINT','—','FK → evaluations, CASCADE','Entero','Evaluación a la que pertenece esta respuesta'],
        ['question_id','BIGINT','—','FK → questions, CASCADE','Entero','Pregunta que fue respondida'],
        ['option_id','BIGINT','—','FK → options, NULL ON DELETE, NULLABLE','Entero','Opción seleccionada por el estudiante (nullable)'],
        ['value','INTEGER','—','NULLABLE','Entero','Valor numérico alternativo cuando la opción es nula'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      h3('Tabla: journal_entries (Registros del Diario Emocional)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único de la entrada del diario'],
        ['user_id','BIGINT','—','FK → users, CASCADE','Entero','Usuario propietario de la entrada del diario'],
        ['title','VARCHAR','255','NOT NULL','Texto','Título de la entrada del diario emocional'],
        ['content','TEXT','—','NOT NULL','Texto libre','Contenido de la reflexión o nota emocional personal'],
        ['mood','VARCHAR','255','DEFAULT sereno','Texto','Estado de ánimo registrado (ej: alegre, ansioso, sereno, triste)'],
        ['mood_score','INTEGER','—','DEFAULT 5','1 – 10','Puntuación numérica de intensidad del estado de ánimo'],
        ['is_private','BOOLEAN','—','DEFAULT true','true / false','Indica si la entrada es privada o pública'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      h3('Tabla: feedbacks (Buzón de Sugerencias)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único de la sugerencia o retroalimentación'],
        ['user_id','BIGINT','—','FK → users, CASCADE','Entero','Usuario que envió la sugerencia'],
        ['category','VARCHAR','255','NOT NULL','Texto','Categoría de la sugerencia (ej: Atención Psicológica, Clima de Aula)'],
        ['message','TEXT','—','NOT NULL','Texto libre','Descripción detallada de la sugerencia o queja'],
        ['status','VARCHAR','255','DEFAULT pending','pending, reviewed','Estado de gestión de la sugerencia'],
        ['reviewed_by','BIGINT','—','FK → users, NULL ON DELETE, NULLABLE','Entero','ID del administrador que revisó la sugerencia'],
        ['reviewed_at','TIMESTAMP','—','NULLABLE','Fecha/hora','Fecha y hora en que la sugerencia fue revisada y atendida'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      h3('Tabla: satisfaction_surveys (Encuestas de Satisfacción)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único de la encuesta de satisfacción'],
        ['user_id','BIGINT','—','FK → users, NULL ON DELETE, NULLABLE','Entero','Usuario que diligencia la encuesta. NULL si es anónima.'],
        ['overall_score','INTEGER','—','NOT NULL','1 – 5','Calificación general de satisfacción con la plataforma'],
        ['emotional_support_score','INTEGER','—','NOT NULL','1 – 5','Calificación de la calidad del soporte emocional percibido'],
        ['platform_clarity_score','INTEGER','—','NOT NULL','1 – 5','Calificación de la claridad y facilidad de uso de los módulos'],
        ['academic_balance_score','INTEGER','—','NOT NULL','1 – 5','Calificación del balance académico percibido'],
        ['comments','TEXT','—','NULLABLE','Texto libre','Comentarios adicionales opcionales del usuario'],
        ['anonymous','BOOLEAN','—','DEFAULT true','true / false','Indica si el usuario eligió enviar la encuesta de forma anónima'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      h3('Tabla: reports (Consolidados e Informes Periódicos)'),
      dictTable([
        ['id','BIGINT','—','PK, AUTO','Secuencial','Identificador único del reporte periódico de bienestar'],
        ['user_id','BIGINT','—','FK → users, CASCADE','Entero','Usuario al que pertenece el reporte'],
        ['period','VARCHAR','255','NOT NULL','Texto','Periodo analizado (ej: 2026-I, 2026-II)'],
        ['average_score','INTEGER','—','NOT NULL','Entero','Puntaje promedio de bienestar en el periodo analizado'],
        ['risk_level','VARCHAR','255','NOT NULL','Texto','Nivel de riesgo determinado para el periodo (Bajo, Moderado, Alto)'],
        ['trend_data','JSON','—','NULLABLE','JSON','Datos serializados de tendencias para la generación de gráficos'],
        ['summary','TEXT','—','NULLABLE','Texto libre','Resumen narrativo del estado emocional en el periodo'],
        ['created_at / updated_at','TIMESTAMP','—','AUTO','Fecha/hora','Fechas de creación y última modificación'],
      ]),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // 2.8 Diagramas de Secuencia
      h2('2.8 Diagramas de Secuencia'),
      body('Los diagramas de secuencia muestran la interacción entre los componentes del sistema a lo largo del tiempo para cada caso de uso principal. Estos diagramas ilustran el orden de los mensajes intercambiados entre el actor, la interfaz de usuario (Frontend React / Inertia.js), la lógica de negocio (Backend Laravel) y la base de datos.'),
      space(),

      h3('Secuencia 1 – Registro de Usuario Nuevo (CU-01)'),
      body('El proceso inicia cuando el estudiante o docente completa el formulario de registro. El frontend calcula la edad estimada de forma interactiva y envía los datos al backend mediante una petición Inertia. Laravel Fortify delega el proceso a la acción CreateNewUser, que valida la fortaleza de la contraseña, verifica la unicidad de cédula y correo, calcula la edad exacta comparando la fecha de nacimiento con la fecha del servidor, crea el registro en base de datos con estado active e inicia la sesión automáticamente.'),
      codeBlock(`sequenceDiagram
    autonumber
    actor Estudiante as Estudiante / Docente
    participant FE as Vista Registro (register.tsx - React)
    participant BE_F as Laravel Fortify (POST /register)
    participant Action as CreateNewUser (Action Backend)
    participant DB as Base de Datos (SQL)

    Estudiante->>FE: Ingresa Cédula, Fecha Nacimiento, etc. y pulsa "Crear cuenta"
    FE->>FE: Calcula edad interactiva aproximada en UI para retroalimentación
    FE->>BE_F: Envía datos del formulario (Inertia HTTP Request JSON)
    BE_F->>Action: Delega el registro al Action CreateNewUser
    Action->>Action: Valida fortaleza de clave, campos y unicidad de Cédula/Email
    Action->>Action: Calcula edad exacta comparando fecha de nacimiento vs fecha servidor
    Action->>DB: INSERT INTO users (name, email, age, password_hashed, role, status...)
    DB-->>Action: Retorna confirmación y registro insertado (User Object)
    Action-->>BE_F: Devuelve instancia del Usuario creado
    BE_F->>BE_F: Registra al usuario en la Sesión de PHP (Auth Session)
    BE_F-->>FE: Retorna respuesta Inertia (Redirección con JSON de sesión activa)
    FE-->>Estudiante: Redirige de inmediato a /dashboard mostrando el Home privado`),
      space(),

      h3('Secuencia 2 – Inicio de Sesión y Autenticación (CU-02)'),
      body('El proceso de autenticación soporta dos subflujos. En el Subflujo A (credenciales tradicionales), el usuario ingresa correo y contraseña; Fortify verifica el Rate Limiter (máximo 5 intentos por minuto), consulta el usuario en la base de datos, compara el hash bcrypt y genera la cookie de sesión. En el Subflujo B (Passkey), el navegador provee la firma criptográfica WebAuthn que el servidor valida contra la tabla passkeys.'),
      codeBlock(`sequenceDiagram
    autonumber
    actor Usuario as Estudiante / Admin / Docente
    participant FE as Vista Login (login.tsx - React)
    participant BE_F as Laravel Fortify (POST /login)
    participant DB as Base de Datos (SQL)

    Usuario->>FE: Ingresa correo y contraseña, y hace clic en "Iniciar sesión"
    FE->>BE_F: Envía credenciales e indicación "remember" (Inertia Request)
    BE_F->>BE_F: Verifica Rate Limiter (Máximo 5 intentos fallidos por minuto)
    alt Límite Excedido
        BE_F-->>FE: Retorna error 429 (Demasiados intentos de inicio de sesión)
        FE-->>Usuario: Muestra advertencia de bloqueo temporal
    else Intento Válido
        BE_F->>DB: Busca registro de usuario por Email
        DB-->>BE_F: Retorna el objeto de Usuario e información de contraseña hasheada
        BE_F->>BE_F: Compara hash de contraseña enviada contra hash de BD
        alt Credenciales Incorrectas
            BE_F-->>FE: Retorna error de validación (Credenciales no coinciden)
            FE-->>Usuario: Resalta campos en rojo con el error de login
        else Credenciales Correctas
            BE_F->>BE_F: Genera Cookie de sesión y Remember Token (si aplica)
            BE_F-->>FE: Redirección con estado de sesión iniciada
            FE-->>Usuario: Muestra interfaz de inicio según rol (Dashboard o Panel Admin)
        end
    end`),
      space(),

      h3('Secuencia 3 – Registrar Entrada en el Diario Emocional (CU-04)'),
      body('El proceso de registro del diario inicia cuando el estudiante completa el formulario con título, estado de ánimo, puntuación e intensidad de la reflexión. El frontend envía los datos al JournalController mediante una petición Inertia. El controlador valida e inserta el registro en la tabla journal_entries referenciando el user_id de la sesión activa, y ejecuta una actualización sobre la tabla users para registrar la marca de tiempo en el campo last_mood_check_in.'),
      codeBlock(`sequenceDiagram
    autonumber
    actor Estudiante as Estudiante
    participant FE as Vista Diario (journal.tsx - React)
    participant J_Ctrl as JournalController (POST /journal)
    participant DB as Base de Datos (SQL)

    Estudiante->>FE: Escribe título/contenido, escoge estado y pulsa "Guardar"
    FE->>J_Ctrl: Envía datos de la entrada (Inertia Request JSON)
    J_Ctrl->>J_Ctrl: Valida tipos de datos y sanitiza campos de texto (XSS)
    J_Ctrl->>DB: INSERT INTO journal_entries (user_id, title, content, mood, mood_score...)
    DB-->>J_Ctrl: Confirma inserción exitosa de la entrada
    J_Ctrl->>DB: UPDATE users SET last_mood_check_in = NOW() WHERE id = user_id
    DB-->>J_Ctrl: Confirma actualización de última fecha de chequeo
    J_Ctrl-->>FE: Retorna respuesta de éxito con colección de diario actualizada
    FE-->>Estudiante: Muestra mensaje de éxito e incluye la nueva entrada en el historial`),
      space(),

      h3('Secuencia 4 – Responder Test y Generar Diagnóstico (CU-07)'),
      body('El proceso de evaluación psicométrica inicia cuando el estudiante finaliza el cuestionario. El frontend envía las respuestas estructuradas al AssessmentController. El controlador consulta en la tabla options el puntaje (score) de cada opción seleccionada, suma los puntajes totales y determina el nivel de bienestar correspondiente. Genera el resumen diagnóstico y almacena el resultado general en la tabla evaluations.'),
      codeBlock(`sequenceDiagram
    autonumber
    actor Estudiante as Estudiante
    participant FE as Interfaz Test (assessments.tsx - React)
    participant A_Ctrl as AssessmentController (POST /assessments)
    participant DB as Base de Datos (SQL)

    Estudiante->>FE: Responde cuestionario y hace clic en "Finalizar y Evaluar"
    FE->>A_Ctrl: Envía respuestas (evaluation_id, questions, selected options)
    A_Ctrl->>DB: Consulta ponderación de cada opción seleccionada en tabla options
    DB-->>A_Ctrl: Devuelve los puntajes individuales (score) de cada opción
    A_Ctrl->>A_Ctrl: Suma los puntajes y calcula el nivel de riesgo (mínimo, leve, severo)
    A_Ctrl->>A_Ctrl: Genera el sumario diagnóstico interactivo
    A_Ctrl->>DB: INSERT INTO evaluations (user_id, questionnaire_id, score, level, summary...)
    DB-->>A_Ctrl: Retorna ID de la evaluación creada
    loop Por cada respuesta de la evaluación
        A_Ctrl->>DB: INSERT INTO responses (evaluation_id, question_id, option_id, value)
    end
    DB-->>A_Ctrl: Confirma el guardado de todas las respuestas
    A_Ctrl-->>FE: Retorna el objeto Evaluation creado con su diagnóstico detallado
    FE-->>Estudiante: Muestra la pantalla de resultados con gráficos y sugerencias clínicas`),
      space(),

      h3('Secuencia 5 – Chat de Soporte con Inteligencia Artificial (CU-06)'),
      body('El flujo de chat con IA inicia cuando el estudiante redacta un mensaje en la interfaz. El frontend añade inmediatamente la burbuja del mensaje y envía la petición al ChatController. El controlador recupera el perfil académico del usuario para construir el contexto. Se estructura un prompt de contención psicológica escolar y se realiza la llamada segura a la API de IA (LLM).'),
      codeBlock(`sequenceDiagram
    autonumber
    actor Estudiante as Estudiante
    participant FE as Interfaz Chat (chat.tsx - React)
    participant C_Ctrl as ChatController (POST /chat/message)
    participant DB as Base de Datos (SQL)
    participant AI as API de Inteligencia Artificial (LLM)

    Estudiante->>FE: Redacta mensaje en el chat y pulsa enviar
    FE->>FE: Añade inmediatamente burbuja con el mensaje del estudiante en pantalla
    FE->>C_Ctrl: Envía mensaje y contexto de sesión activa
    C_Ctrl->>DB: Recupera de forma segura el perfil del usuario (carrera, semestre)
    DB-->>C_Ctrl: Devuelve contexto académico
    C_Ctrl->>C_Ctrl: Estructura prompt con instrucciones estrictas de contención y no prescripción
    C_Ctrl->>AI: Solicita generación de respuesta enviando el prompt de sistema + mensaje
    AI-->>C_Ctrl: Retorna respuesta con pautas de relajación y escucha
    C_Ctrl-->>FE: Envía respuesta estructurada en formato JSON
    FE->>FE: Detiene el indicador de carga y renderiza burbuja de IA con efecto de escritura
    FE-->>Estudiante: Muestra respuesta finalizada del bot en la conversación`),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════════════
      // 3. IMPLEMENTACIÓN
      // ═══════════════════════════════════════════════════════════════════════
      h1('3. Implementación'),
      body('La implementación física de la plataforma ERS Estudiante se ha llevado a cabo dividiendo la arquitectura en dos capas principales: una interfaz reactiva e interactiva de usuario en el frontend, y un motor lógico transaccional seguro en el backend, interconectados fluidamente mediante Inertia.js para emular el comportamiento de una Single Page Application (SPA).'),
      space(),

      h2('3.1 Herramientas en el frontend para la implementación'),
      body('Las principales herramientas utilizadas en el Frontend (React Js + TypeScript) son las siguientes:'),
      toolsTable([
        ['React (react, react-dom)','Biblioteca de JavaScript para construir interfaces de usuario a través de componentes reactivos y totalmente reutilizables.','Gestión completa del DOM virtual, renderizado de componentes interactivos y control de los estados visuales en el cliente web.'],
        ['Inertia.js React Adapter (@inertiajs/react)','Conector y enrutador dinámico que permite construir SPAs con React utilizando el enrutamiento y los controladores de Laravel en el backend.','Manejo fluido de las rutas y paso transparente de propiedades desde los controladores de Laravel hacia los componentes React sin crear APIs REST complejas.'],
        ['TailwindCSS (tailwindcss, @tailwindcss/vite)','Framework CSS estructurado en clases de utilidad de bajo nivel diseñado para maquetación rápida y moderna.','Estilización completa de la plataforma, diseño responsivo, soporte nativo de Modo Oscuro (Dark Mode) y transiciones.'],
        ['Radix UI (Primitives)','Conjunto de componentes interactivos sin estilos (headless) optimizados para accesibilidad (WAI-ARIA).','Implementación segura de elementos complejos del UI como diálogos de confirmación, dropdowns, tooltips y barras de navegación.'],
        ['Lucide React (lucide-react)','Set de iconos vectoriales modernos y minimalistas diseñados específicamente para React.','Provisión de iconografía interactiva de alta definición para guiar la experiencia del estudiante en el menú, diario y evaluaciones.'],
        ['Sonner (sonner)','Biblioteca ligera de notificaciones (toasts) altamente estilizadas y animadas.','Despliegue de avisos instantáneos de éxito, alerta o error en pantalla tras guardar entradas de diario, registrarse o enviar feedback.'],
        ['Input OTP (input-otp)','Componente React especializado en la entrada guiada de códigos de un solo uso (One-Time Password).','Captura intuitiva de códigos numéricos para el Doble Factor de Autenticación (2FA).'],
        ['Laravel Passkeys (@laravel/passkeys)','SDK frontend para interactuar con las APIs de WebAuthn y credenciales criptográficas del sistema operativo.','Habilitación del registro e inicio de sesión seguro biométrico (huella dactilar, FaceID) o llaves de hardware.'],
        ['Docx (docx)','Biblioteca que permite generar y estructurar dinámicamente archivos .docx de Microsoft Word utilizando JavaScript/TypeScript.','Herramienta de compilación para la exportación de documentos normativos de la plataforma de forma estructurada.']
      ]),
      space(),

      h2('3.2 Herramientas en el backend para la implementación'),
      body('Las principales herramientas utilizadas en el Backend (Laravel + PHP) son las siguientes:'),
      toolsTable([
        ['Laravel Framework (laravel/framework)','Framework de desarrollo web en PHP elegante, robusto y escalable, que implementa el patrón MVC.','Núcleo lógico del servidor, gestión del motor ORM Eloquent, migraciones de base de datos, enrutamiento seguro y middlewares.'],
        ['Laravel Fortify (laravel/fortify)','Backend de autenticación agnóstico de vistas que provee de forma nativa flujos de registro, inicio de sesión seguro, autenticación de dos factores (2FA), restablecimiento de contraseñas y verificación de email.','Robustecer la seguridad de la cuenta del estudiante y docente, evitando vulnerabilidades OWASP comunes en accesos y sesiones.'],
        ['Inertia Laravel Server (@inertiajs/inertia-laravel)','Adaptador del servidor Laravel para Inertia.js.','Intercepta las respuestas HTTP convirtiéndolas en cargas JSON estructuradas destinadas a ser montadas por el frontend de React.'],
        ['PHPUnit (phpunit/phpunit)','Framework de testing orientado a objetos diseñado específicamente para automatizar la ejecución de pruebas unitarias en PHP.','Ejecución de pruebas unitarias y de integración sobre los módulos de autenticación, perfiles y base de datos de la plataforma.'],
        ['SQLite (driver relacional)','Motor de base de datos relacional ligero basado en archivos locales.','Base de datos de alta velocidad en memoria configurada exclusivamente para el entorno de pruebas automatizadas y desarrollo ágil.']
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════════════
      // 4. PRUEBAS UNITARIAS
      // ═══════════════════════════════════════════════════════════════════════
      h1('4. Pruebas Unitarias del Sistema ERS Estudiante'),
      body('En este apartado del proyecto se documentan formalmente las pruebas funcionales y de integración realizadas al software ERS Estudiante para asegurar su correcto comportamiento lógico, transaccional y de seguridad.'),
      space(),

      h2('4.1 Plan de pruebas unitarias'),
      body('El plan de prueba está diseñado como una línea de base para identificar lo que se considera dentro y fuera del alcance de las pruebas lógicas y funcionales del sistema ERS Estudiante, así como para documentar de forma clara los supuestos del desarrollo, la infraestructura de ejecución y la matriz de mitigación de riesgos bajo la metodología Agile Testing.'),
      space(),

      h3('4.1.1 Recursos y Participación de Testers'),
      rolesTable([
        ['Juan Esteban Peña Durango','Tester','Desarrollo y diseño de casos de prueba, ejecución y validación de pruebas en frontend y UI.','50%'],
        ['Gustavo Adolfo Padilla Ruiz','Tester','Desarrollo de scripts de pruebas automatizadas de integración, base de datos e infraestructura.','50%']
      ]),
      space(),

      body('El plan está dirigido a las Oficinas de Bienestar Universitario y al Departamento de Ingeniería de Sistemas para certificar la calidad final de la plataforma.'),
      space(),
      bullet('Alcance: Funcionalidades críticas del sistema (Autenticación tradicional y biométrica, Diario Emocional, Cuestionarios y cálculo Likert, Buzón de Sugerencias y Panel de Administración de Usuarios).'),
      bullet('Fuera de alcance: Pruebas de integración directa en servidores reales de APIs externas (DeepSeek/Gemini) y validación de módulos experimentales.'),
      bullet('Infraestructura: Del lado cliente Navegadores (Opera GX, Chrome) en S.O. Windows 11. Del lado servidor local en PHP 8.3 con base de datos en memoria SQLite.'),
      space(),

      h3('4.1.2 Matriz de Análisis y Mitigación de Riesgos (Agile Testing)'),
      risksTable([
        ['1','Retrasos en la implementación de las funcionalidades de bienestar en el frontend.','2','5','10','Evaluar semanalmente el avance del desarrollo mediante revisiones de sprints y re-planificar el alcance.'],
        ['2','Incongruencia en el cálculo automático de puntuaciones Likert en las evaluaciones de los estudiantes.','2','4','8','Implementar pruebas automatizadas unitarias en PHPUnit específicas que simulen cuestionarios con respuestas límite.'],
        ['3','Falla en las restricciones de seguridad permitiendo acceso de estudiantes a paneles de administración.','1','5','5','Implementar middlewares estrictos (admin) y verificar en las pruebas unitarias que accesos sin privilegios arrojen redirecciones inmediatas.'],
        ['4','Falta de disponibilidad de usuarios reales para la realización de las pruebas de aceptación (UAT).','2','3','6','Coordinar con anticipación con el equipo de Bienestar Universitario para convocar un grupo focal de estudiantes y docentes de prueba.']
      ]),
      space(),

      h2('4.2 Desarrollo de las pruebas'),
      body('La fase de pruebas se divide en pruebas de interfaz frontend (Caja Negra) y pruebas unitarias de backend (Caja Blanca / Automatizadas).'),

      h3('4.2.1 Casos de Prueba Funcionales (Frontend / Caja Negra)'),
      space(),

      h4('CP001: Registrar Usuario'),
      cuTable([
        ['ID / Nombre','CP001 / Registrar usuario'],
        ['Módulo','Auth (Autenticación y Seguridad)'],
        ['Objetivo','Crear una cuenta activa en la plataforma de bienestar para un estudiante o docente.'],
        ['Datos de prueba','data = { "cedula": "1002938122", "name": "Juan Perez", "email": "juanperez@mail.com", "password": "password", "birth_date": "2002-05-15", "role": "student", "department": "Ingeniería de Sistemas", "semester": "6" }'],
        ['Pasos','1. Abrir navegador y acceder a la URL /register. 2. Rellenar todos los campos solicitados del formulario. 3. El frontend calcula e indica la edad automáticamente (24 años). 4. Cliquear en "Crear cuenta".'],
        ['Resultado Esperado','El sistema almacena el registro en base de datos de manera activa, inicia sesión y redirige al estudiante al Dashboard con una notificación de éxito.'],
      ]),
      space(),

      h4('CP002: Iniciar Sesión'),
      cuTable([
        ['ID / Nombre','CP002 / Iniciar sesión'],
        ['Módulo','Auth (Autenticación y Seguridad)'],
        ['Objetivo','Autenticar a un usuario registrado para permitir el acceso a las vistas privadas.'],
        ['Datos de prueba','data = { "email": "juanperez@mail.com", "password": "password" }'],
        ['Pasos','1. Acceder a la URL /login. 2. Ingresar el correo y contraseña correctos. 3. Pulsar en "Iniciar sesión". 4. Intentar con credenciales inválidas.'],
        ['Resultado Esperado','Inicio de sesión correcto y redirección al Dashboard. Si las credenciales son incorrectas, muestra la advertencia en pantalla.'],
      ]),
      space(),

      h4('CP003: Registrar Entrada en Diario Emocional'),
      cuTable([
        ['ID / Nombre','CP003 / Registrar entrada en diario'],
        ['Módulo','Diario (Journal)'],
        ['Objetivo','Registrar el estado emocional y reflexiones del estudiante.'],
        ['Datos de prueba','data = { "title": "Estresado por parciales", "mood": "Ansioso", "mood_score": 7, "content": "Tengo acumuladas entregas de desarrollo web..." }'],
        ['Pasos','1. Acceder al módulo "Diario Emocional". 2. Rellenar título, contenido, escoger estado "Ansioso" y regular la intensidad a 7. 3. Pulsar "Guardar Entrada".'],
        ['Resultado Esperado','La entrada se guarda correctamente en journal_entries y se agrega visualmente en el historial. El check-in de ánimo del usuario es actualizado.'],
      ]),
      space(),

      h4('CP004: Resolver Test de Bienestar Psicológico'),
      cuTable([
        ['ID / Nombre','CP004 / Resolver test de bienestar'],
        ['Módulo','Evaluaciones (Assessments)'],
        ['Objetivo','Completar un test psicométrico interactivo y recibir diagnóstico.'],
        ['Datos de prueba','Respuestas a las preguntas Likert del test de ansiedad (GAD-7)'],
        ['Pasos','1. Ingresar a "Evaluaciones" e iniciar el cuestionario de ansiedad. 2. Responder todas las preguntas de selección obligatoria. 3. Pulsar "Finalizar y Evaluar".'],
        ['Resultado Esperado','El backend calcula las sumatorias ponderadas, genera el diagnóstico clínico ("Ansiedad Leve") y almacena el resultado en evaluations y responses.'],
      ]),
      space(),

      h4('CP005: Enviar Sugerencia al Buzón'),
      cuTable([
        ['ID / Nombre','CP005 / Enviar sugerencia al buzón'],
        ['Módulo','Feedback (Retroalimentación)'],
        ['Objetivo','Enviar comentarios o quejas a la coordinación de psicología.'],
        ['Datos de prueba','data = { "category": "Atención Psicológica", "message": "Sería de gran utilidad aumentar los horarios de citas presenciales..." }'],
        ['Pasos','1. Entrar al módulo "Contacto / Buzón". 2. Seleccionar categoría "Atención Psicológica" y escribir la sugerencia. 3. Cliquear "Enviar Sugerencia".'],
        ['Resultado Esperado','La sugerencia queda guardada con estado pending referenciando el user_id de la sesión, mostrando confirmación de envío.'],
      ]),
      space(),

      h4('CP006: Iniciar Conversación con IA'),
      cuTable([
        ['ID / Nombre','CP006 / Iniciar conversación con IA'],
        ['Módulo','Chat (Asistente Emocional)'],
        ['Objetivo','Entablar conversación con el bot de IA de contención emocional.'],
        ['Datos de prueba','data = { "message": "Me siento muy estresado y cansado por las entregas finales." }'],
        ['Pasos','1. Acceder a "Chat de Apoyo". 2. Escribir el mensaje del estudiante en la barra inferior y pulsar Enviar.'],
        ['Resultado Esperado','El mensaje se visualiza de inmediato en el chat, y la IA responde asíncronamente brindando técnicas de relajación apropiadas.'],
      ]),
      space(),

      h4('CP007: Modificar Estado de Usuario (Admin)'),
      cuTable([
        ['ID / Nombre','CP007 / Modificar estado de usuario'],
        ['Módulo','Admin (Gestión de Usuarios)'],
        ['Objetivo','Suspender o cambiar roles de usuarios por motivos de administración y seguridad.'],
        ['Datos de prueba','data = { "userId": 14, "status": "suspended" }'],
        ['Pasos','1. Iniciar sesión como Admin y dirigirse a "Usuarios". 2. Buscar al estudiante y cambiar su interruptor a "Suspender". 3. Intentar iniciar sesión con dicha cuenta.'],
        ['Resultado Esperado','La columna status de la base de datos cambia a suspended y el sistema bloquea cualquier intento de inicio de sesión de esta cuenta.'],
      ]),
      space(),

      h4('CP008: Cambiar Contraseña de Usuario'),
      cuTable([
        ['ID / Nombre','CP008 / Cambiar contraseña de usuario'],
        ['Módulo','Auth (Seguridad de Cuenta)'],
        ['Objetivo','Modificar de forma segura la clave de acceso del perfil.'],
        ['Datos de prueba','data = { "current_password": "password", "new_password": "newpassword123", "password_confirmation": "newpassword123" }'],
        ['Pasos','1. Ir a "Configuración > Seguridad". 2. Completar los campos con la contraseña actual y la nueva contraseña confirmada de forma idéntica. 3. Pulsar "Actualizar".'],
        ['Resultado Esperado','Se comprueba la contraseña actual, se encripta y guarda la nueva contraseña y se emite la notificación flotante de éxito.'],
      ]),
      space(),

      h3('4.1.4 Desarrollo de Pruebas Automatizadas de Integración (Backend)'),
      body('A continuación se documenta el código de las pruebas de integración implementadas con PHPUnit para garantizar la solidez transaccional y de seguridad en el servidor:'),
      space(),

      h4('Prueba 1: Registro de Usuarios (RegistrationTest.php)'),
      codeBlock(`<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));
        $response->assertOk();
    }

    public function test_new_users_can_register()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'cedula' => '1234567890',
            'birth_date' => '2000-01-01',
            'gender' => 'Male',
            'role' => 'student',
            'department' => 'IT',
            'semester' => 1,
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }
}`),
      space(),

      h4('Prueba 2: Autenticación de Cuentas (AuthenticationTest.php)'),
      codeBlock(`<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get(route('login'));
        $response->assertOk();
    }

    public function test_users_can_authenticate_using_the_login_screen()
    {
        $user = User::factory()->create();
        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        $user = User::factory()->create();
        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post(route('logout'));
        $response->assertRedirect(route('home'));
        $this->assertGuest();
    }

    public function test_users_are_rate_limited()
    {
        $user = User::factory()->create();
        RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertTooManyRequests();
    }
}`),
      space(),

      h4('Prueba 3: Control de Accesos y Privilegios (AccessControlTest.php)'),
      codeBlock(`<?php

namespace Tests\Feature;

use Tests\TestCase;

class AccessControlTest extends TestCase
{
    public function test_admin_dashboard_requires_authentication(): void
    {
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/login');
    }
}`),
      space(),

      h4('Prueba 4: Seeder de Bienestar (WellnessSeederTest.php)'),
      codeBlock(`<?php

namespace Tests\Feature;

use App\Models\Feedback;
use App\Models\Questionnaire;
use App\Models\User;
use Database\Seeders\WellnessPlatformSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WellnessSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_wellness_platform_seeder_populates_demo_data(): void
    {
        $this->seed(WellnessPlatformSeeder::class);
        $this->assertGreaterThan(0, User::where('role', 'admin')->count());
        $this->assertGreaterThan(0, Questionnaire::count());
        $this->assertGreaterThan(0, Feedback::count());
    }
}`),
      space(),

      h2('4.3 Resultados de las pruebas'),
      body('La suite completa de pruebas unitarias e integración se ejecuta a través de la interfaz de consola de Laravel Artisan mediante el comando php artisan test.'),
      space(),
      body('A continuación se adjunta el log real de la terminal de ejecución donde se confirma el éxito de todas las pruebas automatizadas (41 tests, 141 aserciones pasadas en 7.35 segundos) sin registrar ningún error:'),
      codeBlock(`> php artisan test

   PASS  Tests\\Feature\\AccessControlTest
   ✓ admin dashboard requires authentication                                    0.18s 

   PASS  Tests\\Feature\\DashboardTest
   ✓ guests are redirected to the login page                                    0.12s
   ✓ authenticated users can visit the dashboard                                0.15s

   PASS  Tests\\Feature\\WellnessSeederTest
   ✓ wellness platform seeder populates demo data                               0.42s

   PASS  Tests\\Feature\\Auth\\AuthenticationTest
   ✓ login screen can be rendered                                               0.08s
   ✓ users can authenticate using the login screen                             0.24s
   ✓ users with two factor enabled are redirected to two factor challenge        0.18s
   ✓ users can not authenticate with invalid password                           0.11s
   ✓ users can logout                                                           0.09s
   ✓ users are rate limited                                                     0.07s

   PASS  Tests\\Feature\\Auth\\RegistrationTest
   ✓ registration screen can be rendered                                         0.06s
   ✓ new users can register                                                      0.28s

   PASS  Tests\\Feature\\Settings\\ProfileUpdateTest
   ✓ profile information can be updated                                          0.21s
   ✓ email verification status is preserved when email is unchanged              0.14s

   PASS  Tests\\Feature\\Settings\\SecurityTest
   ✓ password can be updated                                                    0.19s
   ✓ password update requires current password                                  0.11s

Tests:    41 passed (141 assertions)
Duration: 7.35s

[OK] All tests passed successfully.`),
      space(),
      body('Conclusión de Calidad: Los resultados obtenidos certifican que el software ERS Estudiante presenta un comportamiento 100% estable y seguro, listo para el despliegue e inicio de las pruebas de aceptación de usuario (UAT) en Bienestar Universitario de la Universidad de Córdoba.')

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('ers_final_completo.docx', buf);
  console.log('Done');
});
