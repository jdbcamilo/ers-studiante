const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageBreak, LevelFormat, TabStopType, TabStopPosition,
  SimpleField
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── Images ───────────────────────────────────────────────────────────────────
const imgLanding      = fs.readFileSync(path.join(process.cwd(), '1_landing.png'));
const imgRegister     = fs.readFileSync(path.join(process.cwd(), '2_register.png'));
const imgLogin        = fs.readFileSync(path.join(process.cwd(), '3_login.png'));
const imgDashboard    = fs.readFileSync(path.join(process.cwd(), '4_dashboard.png'));
const imgChat         = fs.readFileSync(path.join(process.cwd(), '5_chat.png'));
const imgCuestionarios= fs.readFileSync(path.join(process.cwd(), '6_cuestionarios.png'));
const imgRecursos     = fs.readFileSync(path.join(process.cwd(), '7_recursos.png'));

// ─── Design tokens (matching reference doc exactly) ───────────────────────────
const FONT      = "Times New Roman";
const BODY_SIZE = 24;          // 12pt
const LINE      = 276;         // ~1.15 line spacing
const BLUE_HDG  = "2E75B6";    // heading color (Word default)
const GRAY_HDR  = "888888";    // header/footer text color
const BORDER_BLUE = "2E75B6";  // footer top border & table headers

// ─── Helper builders ──────────────────────────────────────────────────────────
function tr(text, opts={}) {
  return new TextRun({ text, font: FONT, size: BODY_SIZE, ...opts });
}

function p(children, opts={}) {
  const runs = typeof children === 'string' ? [tr(children)] : children;
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 80, after: 80, line: LINE, lineRule: "auto" },
    ...opts,
    children: runs
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: FONT, size: 32, bold: true })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: FONT, size: 28, bold: true })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, font: FONT, size: 24, bold: true })]
  });
}

function bullet(text, level=0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 60, after: 60, line: LINE, lineRule: "auto" },
    children: [tr(text)]
  });
}

function numbered(text, level=0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 80, after: 80, line: LINE, lineRule: "auto" },
    children: [tr(text)]
  });
}

function space(n=1) {
  return Array.from({length: n}, () => new Paragraph({
    children: [tr("")],
    spacing: { before: 60, after: 60 }
  }));
}

function figureImg(data, w, h, caption) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 60 },
      children: [new ImageRun({ data, transformation: { width: w, height: h }, type: "png" })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [tr(caption, { italics: true, size: 20, color: "555555" })]
    })
  ];
}

// Note box (bordered table matching the doc style)
function noteBox(label, text) {
  const bdr = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const leftBdr = { style: BorderStyle.THICK, size: 14, color: BLUE_HDG };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      borders: { top: bdr, bottom: bdr, left: leftBdr, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
      shading: { fill: "EEF4FB", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 180, right: 120 },
      children: [new Paragraph({
        spacing: { line: LINE, lineRule: "auto" },
        children: [
          tr(label + " ", { bold: true, color: BLUE_HDG }),
          tr(text, { size: 22 })
        ]
      })]
    })] })]
  });
}

// Standard table header cell
function thCell(text, w) {
  const bdr = { style: BorderStyle.SINGLE, size: 4, color: BLUE_HDG };
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders: { top: bdr, bottom: bdr, left: bdr, right: bdr },
    shading: { fill: "2E75B6", type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      children: [tr(text, { bold: true, color: "FFFFFF", size: 20 })]
    })]
  });
}

// Standard table data cell
function tdCell(text, w, fill="FFFFFF", bold=false) {
  const bdr = { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" };
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders: { top: bdr, bottom: bdr, left: bdr, right: bdr },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      spacing: { line: LINE, lineRule: "auto" },
      children: [tr(text, { size: 20, bold })]
    })]
  });
}

// ─── DOCUMENT ─────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ]},
      { reference: "numbers", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.DECIMAL, text: "%1.%2.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ]},
    ]
  },
  styles: {
    default: {
      document: { run: { font: FONT, size: BODY_SIZE } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: FONT },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: FONT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: FONT },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440,
                  header: 708, footer: 708 }
      }
    },

    // ─── HEADER (matches reference: gray italic text) ──────────────────────
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          border: { bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
          children: [
            tr("ERS – Plataforma de Seguimiento y Evaluación de Salud Mental | Universidad de Córdoba",
              { color: GRAY_HDR, size: 18, italics: true })
          ]
        })]
      })
    },

    // ─── FOOTER (matches reference: top border blue, "Página X de N" centered) ─
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: BORDER_BLUE, space: 1 } },
          children: [
            tr("Página ", { color: GRAY_HDR, size: 18 }),
            new TextRun({ children: ["PAGE"], color: GRAY_HDR, size: 18, font: FONT }),
            tr(" de ", { color: GRAY_HDR, size: 18 }),
            new TextRun({ children: ["NUMPAGES"], color: GRAY_HDR, size: 18, font: FONT }),
          ]
        })]
      })
    },

    children: [

      // ══════════════════════════════════════════════════════════
      // PORTADA
      // ══════════════════════════════════════════════════════════
      ...space(3),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 0 },
        children: [tr("Plataforma de Seguimiento y Evaluación de Salud Mental", { bold: true, size: 32 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 0 },
        children: [tr("en Estudiantes de la Universidad de Córdoba", { bold: true, size: 32 })]
      }),
      ...space(2),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 80 },
        children: [tr("Manual de Usuario", { bold: true, size: 28, color: BLUE_HDG })]
      }),
      ...space(4),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 0, after: 0 },
        children: [tr("Autores", { bold: true })]
      }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Jesus Arteaga Pérez", { bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Facultad de Ingeniería")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Departamento de Ingeniería de Sistemas")] }),
      ...space(1),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Juan Camilo Díaz Blandón", { bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Facultad de Ingeniería")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Departamento de Ingeniería de Sistemas")] }),
      ...space(1),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Pierre Augusto Peña Salgado", { bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Facultad de Ingeniería")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Departamento de Ingeniería de Sistemas")] }),
      ...space(1),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Juan David Andrade Llanos", { bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Facultad de Ingeniería")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Departamento de Ingeniería de Sistemas")] }),
      ...space(1),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Asignatura: Ingeniería de Software")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr("Docente: Oswaldo Velez Langs")] }),
      ...space(3),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [tr("Universidad de Córdoba", { size: 28, bold: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [tr("Montería, Córdoba", { size: 28 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [tr("2026.", { size: 28 })]
      }),

      // ── page break ──
      new Paragraph({ children: [new PageBreak()] }),

      // ══════════════════════════════════════════════════════════
      // TABLA DE CONTENIDO (manual)
      // ══════════════════════════════════════════════════════════
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
        children: [tr("Tabla de Contenido", { bold: true, size: 32 })]
      }),
      ...[
        ["Introducción", "1"],
        ["1. Acceso al Sistema", "1"],
        ["2. Registro de Usuario", "2"],
        ["3. Inicio de Sesión", "3"],
        ["4. Panel Principal – Mi Progreso", "4"],
        ["5. Chat con IA – Asistente de Salud Mental", "5"],
        ["6. Cuestionarios de Evaluación Clínica", "6"],
        ["7. Recursos para el Bienestar", "7"],
        ["8. Diario Emocional", "8"],
        ["9. Encuestas y Feedback", "9"],
        ["10. Navegación General del Sistema", "10"],
        ["11. Interpretación de Mensajes del Sistema", "11"],
        ["12. Resolución de Problemas Comunes", "12"],
        ["13. Cierre de Sesión", "13"],
        ["14. Consejos de Uso Óptimo", "14"],
        ["15. Conclusión", "15"],
      ].map(([title, pg]) => new Paragraph({
        spacing: { before: 60, after: 60, line: LINE, lineRule: "auto" },
        tabStops: [{ type: TabStopType.RIGHT, position: 9360, leader: TabStopPosition ? undefined : undefined }],
        children: [
          tr(title, { size: 22 }),
          tr("\t" + pg, { size: 22 })
        ]
      })),

      new Paragraph({ children: [new PageBreak()] }),

      // ══════════════════════════════════════════════════════════
      // INTRODUCCIÓN
      // ══════════════════════════════════════════════════════════
      h1("Introducción"),
      p("La Plataforma de Seguimiento y Evaluación de Salud Mental en Estudiantes de la Universidad de Córdoba — denominada ERS Bienestar — es un sistema web institucional diseñado para brindar apoyo integral a la salud emocional y psicológica de la comunidad académica. Ante la creciente presión académica, las dificultades económicas y el estigma asociado a la búsqueda de ayuda profesional, la plataforma ofrece un espacio digital accesible, privado y disponible en cualquier momento para que los estudiantes puedan monitorear su estado emocional, identificar señales de riesgo tempranas y fomentar hábitos de autocuidado."),
      p("El presente manual tiene como objetivo guiar al usuario en el uso correcto y eficiente de cada módulo del sistema. Está dirigido tanto a estudiantes como a docentes de la Universidad de Córdoba, y describe de manera clara y detallada cómo navegar por la plataforma, registrar información, completar evaluaciones clínicas, interactuar con el asistente de inteligencia artificial e interpretar los resultados obtenidos."),
      p("El sistema está diseñado con un enfoque en la simplicidad, la accesibilidad y la confidencialidad, garantizando que cualquier persona, independientemente de su experiencia tecnológica, pueda utilizarlo de forma autónoma siguiendo las instrucciones aquí descritas."),
      ...space(1),
      noteBox("Importante:", "Este sistema es una herramienta de apoyo complementario y no reemplaza la atención profesional de psicólogos o psiquiatras. Ante situaciones de crisis, comunícate con el Centro de Atención Psicológica de la Universidad de Córdoba o llama a la Línea de Crisis Nacional: 106."),
      ...space(1),

      // ══════════════════════════════════════════════════════════
      // 1. REQUISITOS Y ACCESO
      // ══════════════════════════════════════════════════════════
      h1("1. Acceso al Sistema"),
      h2("1.1 Requisitos Técnicos"),
      p("Para utilizar la plataforma el usuario requiere:"),
      bullet("Un navegador web actualizado: Google Chrome, Mozilla Firefox o Microsoft Edge."),
      bullet("Conexión a internet estable, o acceso a la red institucional donde esté desplegado el sistema."),
      bullet("URL de acceso al sistema: http://localhost:8081 (instalación local) o la URL institucional asignada por la Universidad de Córdoba."),
      bullet("No se requieren conocimientos técnicos avanzados; basta con el manejo básico de formularios web."),
      ...space(1),
      h2("1.2 Pasos para Acceder"),
      numbered("Abrir el navegador de preferencia (Chrome, Firefox o Edge)."),
      numbered("Ingresar la URL del sistema en la barra de direcciones."),
      numbered("Se mostrará la página de inicio del portal ERS Bienestar."),
      numbered("Desde allí se puede Registrar una cuenta nueva o Iniciar sesión si ya se tiene cuenta."),
      ...space(1),
      ...figureImg(imgLanding, 560, 270, "Figura 1. Página de inicio (Landing Page) del portal ERS Bienestar."),

      // ══════════════════════════════════════════════════════════
      // 2. REGISTRO
      // ══════════════════════════════════════════════════════════
      h1("2. Registro de Usuario"),
      p("El registro permite crear una cuenta personal para acceder a todas las funcionalidades de la plataforma. Solo es necesario realizarlo una vez; una vez creada la cuenta, el usuario ingresa mediante sus credenciales en cualquier momento."),
      h2("2.1 Pasos para Registrarse"),
      numbered("En la página de inicio, hacer clic en el botón \"Registrarse\" ubicado en la esquina superior derecha de la pantalla."),
      numbered("Completar el formulario de registro con los datos solicitados:"),
      bullet("Cédula: número de documento de identidad. Debe ser único en el sistema.", 1),
      bullet("Nombre completo: nombres y apellidos del usuario.", 1),
      bullet("Correo electrónico: preferiblemente el correo universitario institucional. Debe ser único.", 1),
      bullet("Contraseña: mínimo 8 caracteres; se recomienda combinar letras, números y símbolos.", 1),
      bullet("Fecha de nacimiento: seleccionar del calendario; la edad se calcula automáticamente.", 1),
      bullet("Sexo: seleccionar entre Masculino, Femenino u Otro.", 1),
      bullet("Tipo de usuario: Estudiante o Profesor.", 1),
      bullet("Carrera: aplica únicamente para usuarios de tipo Estudiante.", 1),
      bullet("Semestre: aplica únicamente para usuarios de tipo Estudiante.", 1),
      numbered("Presionar el botón \"Crear cuenta\" para finalizar el proceso."),
      numbered("Si el registro es exitoso, el sistema redirigirá automáticamente al panel principal."),
      ...space(1),
      ...figureImg(imgRegister, 440, 370, "Figura 2. Formulario de registro de nuevo usuario."),
      ...space(1),
      noteBox("Nota:", "La cédula y el correo electrónico deben ser únicos en el sistema. Si ya existen registros con esos datos, el sistema mostrará el mensaje de error: \"Usuario ya existe\". En ese caso, verificar los datos ingresados o iniciar sesión directamente con la cuenta existente."),

      // ══════════════════════════════════════════════════════════
      // 3. INICIO DE SESIÓN
      // ══════════════════════════════════════════════════════════
      h1("3. Inicio de Sesión"),
      p("Una vez creada la cuenta, el usuario puede ingresar a la plataforma en cualquier momento utilizando sus credenciales de acceso."),
      h2("3.1 Pasos para Iniciar Sesión"),
      numbered("En la página de inicio, hacer clic en \"Iniciar sesión\"."),
      numbered("Ingresar el correo electrónico registrado en el campo Correo Electrónico."),
      numbered("Ingresar la contraseña en el campo Contraseña. Usar el ícono de ojo (👁) para mostrar u ocultar los caracteres."),
      numbered("(Opcional) Marcar la casilla \"Recordarme en este dispositivo\" para mantener la sesión activa."),
      numbered("Presionar el botón \"Iniciar sesión\". El sistema redirigirá al panel principal según el rol del usuario."),
      numbered("Si las credenciales son incorrectas, aparecerá el mensaje \"Credenciales incorrectas\" o \"Usuario no encontrado\"."),
      ...space(1),
      ...figureImg(imgLogin, 440, 300, "Figura 3. Pantalla de inicio de sesión."),
      ...space(1),
      noteBox("¿Olvidaste tu contraseña?", "Utiliza el enlace \"¿Olvidaste tu contraseña?\" ubicado junto al campo de contraseña para iniciar el proceso de recuperación de acceso."),

      // ══════════════════════════════════════════════════════════
      // 4. PANEL PRINCIPAL
      // ══════════════════════════════════════════════════════════
      h1("4. Panel Principal – Mi Progreso"),
      p("Al ingresar al sistema, el usuario accede al panel principal denominado Mi Progreso, que constituye el centro de control de su bienestar emocional en tiempo real. Este módulo presenta un resumen completo del estado actual y la evolución histórica del usuario dentro de la plataforma."),
      h2("4.1 Elementos del Panel"),
      p("El panel Mi Progreso contiene las siguientes secciones:"),
      bullet("Estado Actual: indicador visual del estado emocional en curso: Estable, Moderado o Crítico."),
      bullet("Estadísticas rápidas: muestra el total de Cuestionarios completados, los Días activo en la plataforma, los Logros obtenidos y el porcentaje de Mejora respecto a evaluaciones anteriores."),
      bullet("Historial de Evaluaciones: listado cronológico de todos los cuestionarios completados, con fecha, tipo de test y puntuación obtenida. Permite acceder al detalle de cada evaluación."),
      bullet("Evolución Emocional: gráfico de líneas que muestra la tendencia de las puntuaciones a lo largo del tiempo, permitiendo identificar mejoras o deterioros en el bienestar."),
      bullet("Distribución de Bienestar: barra proporcional que muestra el porcentaje de resultados clasificados como Estable (verde), Moderado (amarillo) y Crítico (rojo)."),
      bullet("Patrones Detectados: análisis automático de tres dimensiones: Consistencia de uso, Diario Emocional y Carga y Rendimiento académico."),
      ...space(1),
      ...figureImg(imgDashboard, 560, 290, "Figura 4. Panel principal «Mi Progreso» con estadísticas y evolución emocional."),
      ...space(1),
      h2("4.2 Logros Disponibles"),
      p("El sistema reconoce el uso constante de la plataforma mediante un sistema de logros:"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 3200, 3360],
        rows: [
          new TableRow({ children: [thCell("Logro", 2800), thCell("Condición de Desbloqueo", 3200), thCell("Descripción", 3360)] }),
          ...([
            ["Primer Paso",      "Completar 1 cuestionario",   "Primera evaluación realizada en la plataforma."],
            ["Constancia",       "Completar 3 cuestionarios",  "Demostración de uso regular del sistema."],
            ["Dedicación",       "Completar 5 cuestionarios",  "Compromiso sostenido con el seguimiento emocional."],
            ["Experto",          "Completar 10 cuestionarios", "Usuario activo y comprometido con su bienestar."],
            ["Evolución Positiva","Mejora en los resultados",  "Progreso cuantificable en indicadores de salud mental."],
          ].map(([a,b,c], i) => new TableRow({ children: [
            tdCell(a, 2800, i%2===0?"FFFFFF":"F5F8FD", true),
            tdCell(b, 3200, i%2===0?"FFFFFF":"F5F8FD"),
            tdCell(c, 3360, i%2===0?"FFFFFF":"F5F8FD"),
          ]})))
        ]
      }),

      // ══════════════════════════════════════════════════════════
      // 5. CHAT CON IA
      // ══════════════════════════════════════════════════════════
      ...space(1),
      h1("5. Chat con IA – Asistente de Salud Mental"),
      p("El módulo Chat con IA pone a disposición del estudiante un asistente virtual especializado en apoyo emocional y bienestar académico. El asistente está disponible las 24 horas del día, los 7 días de la semana, y sus respuestas se generan mediante inteligencia artificial con lineamientos de contención psicológica, sin prescripción médica."),
      h2("5.1 Cómo Usar el Chat"),
      numbered("Hacer clic en \"Chat con IA\" en el menú lateral izquierdo del panel principal."),
      numbered("El asistente mostrará un mensaje de bienvenida personalizado con el nombre del usuario."),
      numbered("Escribir el mensaje en el campo inferior \"Escribe tu mensaje...\" y enviarlo haciendo clic en el botón de flecha (→) o presionando la tecla Enter."),
      numbered("El asistente responderá con apoyo emocional, técnicas prácticas o recomendaciones adaptadas al contexto del usuario."),
      numbered("El historial de cada sesión de chat se guarda automáticamente en el perfil del usuario."),
      ...space(1),
      h2("5.2 Tipos de Respuesta del Asistente"),
      bullet("Apoyo emocional y validación de sentimientos."),
      bullet("Técnicas prácticas de afrontamiento (respiración, mindfulness, grounding)."),
      bullet("Consejos basados en principios de psicología cognitivo-conductual."),
      bullet("Derivación a atención profesional o líneas de crisis cuando la situación lo requiera."),
      ...space(1),
      h2("5.3 Ejemplos de Mensajes que Puede Enviar"),
      bullet("\"Hoy me siento muy estresado con los exámenes finales.\""),
      bullet("\"Tengo problemas para dormir y me despierto con ansiedad.\""),
      bullet("\"Me siento solo y no encuentro motivación para estudiar.\""),
      bullet("\"¿Qué técnicas puedo usar para manejar la ansiedad antes de un examen?\""),
      ...space(1),
      ...figureImg(imgChat, 560, 285, "Figura 5. Módulo «Chat con IA» – Asistente de Salud Mental."),
      ...space(1),
      noteBox("Importante:", "El Chat con IA es una herramienta de apoyo de primera línea. No reemplaza la atención de profesionales en psicología o psiquiatría. Si experimentas una crisis emocional grave, comunícate de inmediato con el Centro de Atención Psicológica Universitaria o llama a la Línea de Crisis Nacional: 106."),

      // ══════════════════════════════════════════════════════════
      // 6. CUESTIONARIOS
      // ══════════════════════════════════════════════════════════
      h1("6. Cuestionarios de Evaluación Clínica"),
      p("El módulo de Cuestionarios ofrece escalas clínicas estandarizadas y validadas que permiten monitorear de forma objetiva el bienestar psicológico y académico del estudiante. Los resultados se almacenan en el historial del usuario y contribuyen a construir el gráfico de Evolución Emocional visible en el panel principal."),
      h2("6.1 Evaluaciones Disponibles"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1100, 3200, 3600, 1460],
        rows: [
          new TableRow({ children: [thCell("Código", 1100), thCell("Nombre del Test", 3200), thCell("Qué Evalúa", 3600), thCell("Duración", 1460)] }),
          ...([
            ["PHQ-9",     "Cuestionario de Depresión",      "Síntomas depresivos, estado de ánimo y pérdida de interés o energía durante las últimas dos semanas.", "3 min"],
            ["GAD-7",     "Cuestionario de Ansiedad",       "Niveles de ansiedad, nerviosismo y tensión acumulada durante las últimas dos semanas.",               "3 min"],
            ["PSS-10",    "Estrés Percibido",               "Grado en que el estudiante percibe su vida académica como impredecible o sobrecargada.",              "4 min"],
            ["ROSENBERG", "Escala de Autoestima",           "Autovaloración global y nivel de satisfacción y aprecio que el estudiante tiene de sí mismo.",        "3 min"],
            ["RYFF",      "Bienestar de Ryff",              "Dimensiones clave de salud mental positiva: autonomía, crecimiento personal y propósito de vida.",    "5 min"],
            ["PSQI",      "Calidad del Sueño",              "Hábitos de sueño, latencia, eficiencia y disturbios nocturnos durante el último mes.",               "4 min"],
            ["SWLS",      "Satisfacción con la Vida",       "Juicio cognitivo global que el estudiante realiza sobre su calidad de vida académica y personal.",    "2 min"],
            ["MBI-SS",    "Burnout Académico",              "Agotamiento emocional, despersonalización y eficacia académica percibida en el contexto universitario.","5 min"],
          ].map(([a,b,c,d], i) => new TableRow({ children: [
            tdCell(a, 1100, i%2===0?"FFFFFF":"F5F8FD", true),
            tdCell(b, 3200, i%2===0?"FFFFFF":"F5F8FD"),
            tdCell(c, 3600, i%2===0?"FFFFFF":"F5F8FD"),
            tdCell(d, 1460, i%2===0?"FFFFFF":"F5F8FD"),
          ]})))
        ]
      }),
      ...space(1),
      h2("6.2 Cómo Completar un Cuestionario"),
      numbered("Hacer clic en \"Cuestionarios\" en el menú lateral izquierdo."),
      numbered("Seleccionar el cuestionario de interés y hacer clic en el botón \"Comenzar\"."),
      numbered("Leer cada enunciado con atención y seleccionar la opción que mejor describa la situación actual del usuario. La escala habitual es: Nunca / Algunos días / Más de la mitad de los días / Casi todos los días."),
      numbered("Al completar todas las preguntas, hacer clic en \"Finalizar\" o \"Enviar respuestas\"."),
      numbered("El sistema calculará la puntuación total, determinará el nivel de gravedad (Leve, Moderado, Alto) y mostrará una interpretación personalizada con recomendaciones específicas."),
      numbered("Los resultados quedan almacenados automáticamente en el Historial de Evaluaciones del panel principal."),
      ...space(1),
      ...figureImg(imgCuestionarios, 560, 330, "Figura 6. Módulo de «Cuestionarios de Evaluación Clínica»."),

      // ══════════════════════════════════════════════════════════
      // 7. RECURSOS
      // ══════════════════════════════════════════════════════════
      h1("7. Recursos para el Bienestar"),
      p("El módulo Recursos ofrece un catálogo de materiales prácticos, técnicas de regulación emocional y contenido educativo diseñados para acompañar la salud mental en el ámbito académico. Los recursos están organizados por categorías para facilitar su localización."),
      h2("7.1 Categorías de Recursos"),
      bullet("Ejercicios Prácticos: técnicas estructuradas para calmar el sistema nervioso, como la Respiración Cuadrada (inhalar 4 seg – retener 4 seg – exhalar 4 seg – retener 4 seg)."),
      bullet("Meditación: sesiones interactivas de meditación guiada con guías de aliento y audio-relajación mental."),
      bullet("Manejo de Ansiedad: métodos sensoriales guiados como la Técnica de Arraigo 5-4-3-2-1 (identificar 5 cosas que se ven, 4 que se tocan, 3 que se oyen, 2 que se huelen, 1 que se prueba)."),
      bullet("Videos Relajantes: contenido audiovisual de 10 minutos orientado al descanso mental y la reducción del estrés."),
      bullet("Lecturas Recomendadas: artículos y guías sobre bienestar psicológico, manejo del tiempo y estrategias de estudio saludable."),
      ...space(1),
      h2("7.2 Cómo Usar los Recursos"),
      numbered("Hacer clic en \"Recursos\" en el menú lateral."),
      numbered("Explorar las categorías disponibles usando los filtros en la parte superior de la pantalla."),
      numbered("Seleccionar el recurso de interés. Para ejercicios, hacer clic en \"Practicar Ahora\". Para meditaciones o videos, en \"Iniciar Sesión\". Para guías sensoriales, en \"Iniciar Guía\"."),
      numbered("Seguir las instrucciones paso a paso que aparecen en pantalla."),
      ...space(1),
      ...figureImg(imgRecursos, 560, 310, "Figura 7. Módulo «Recursos para el Bienestar»."),

      // ══════════════════════════════════════════════════════════
      // 8. DIARIO EMOCIONAL
      // ══════════════════════════════════════════════════════════
      h1("8. Diario Emocional"),
      p("El Diario Emocional es un espacio personal y privado donde el estudiante puede registrar sus pensamientos, reflexiones y estado de ánimo de forma periódica. El uso regular del diario contribuye al patrón de seguimiento emocional reflejado en el panel de progreso."),
      h2("8.1 Cómo Registrar una Entrada"),
      numbered("Hacer clic en \"Diario emocional\" en el menú lateral."),
      numbered("Hacer clic en el botón para crear una nueva entrada."),
      numbered("Completar los campos solicitados:"),
      bullet("Título: resumen breve de la entrada.", 1),
      bullet("Estado de ánimo (Mood): seleccionar el estado emocional predominante del día.", 1),
      bullet("Intensidad: puntuación de 1 a 10 que refleja la intensidad del estado de ánimo.", 1),
      bullet("Nota / Reflexión: texto libre para registrar pensamientos, situaciones o reflexiones personales.", 1),
      bullet("Privacidad: marcar si la entrada es Privada (visible solo para el usuario) o Pública.", 1),
      numbered("Hacer clic en \"Guardar\" para almacenar la entrada. El sistema actualizará automáticamente el campo de último registro emocional del perfil del usuario."),
      ...space(1),
      h2("8.2 Editar o Eliminar una Entrada"),
      numbered("En el listado del diario, localizar la entrada que se desea modificar o eliminar."),
      numbered("Para editar: hacer clic en el ícono de edición (✏), realizar los cambios y guardar."),
      numbered("Para eliminar: hacer clic en el ícono de eliminación (🗑), confirmar la acción en el mensaje de confirmación. La eliminación es definitiva."),

      // ══════════════════════════════════════════════════════════
      // 9. ENCUESTAS Y FEEDBACK
      // ══════════════════════════════════════════════════════════
      h1("9. Encuestas y Feedback"),
      h2("9.1 Envío de Sugerencias (Feedback)"),
      p("El módulo Feedback permite a estudiantes y docentes enviar comentarios, sugerencias o reportes al equipo del portal de bienestar universitario."),
      numbered("Hacer clic en \"Feedback\" en el menú lateral."),
      numbered("Seleccionar la categoría del mensaje: Infraestructura de Bienestar, Atención Psicológica, Clima de Aula u Otros."),
      numbered("Redactar el mensaje en el campo de texto."),
      numbered("Hacer clic en \"Enviar\". El mensaje quedará registrado con estado pendiente de revisión por el administrador."),
      ...space(1),
      h2("9.2 Encuesta de Satisfacción"),
      p("La Encuesta de Satisfacción permite al usuario evaluar la calidad de la plataforma en cuatro dimensiones, utilizando una escala del 1 al 5:"),
      bullet("Satisfacción General con la plataforma."),
      bullet("Calidad del Soporte Emocional ofrecido."),
      bullet("Claridad y usabilidad de los módulos."),
      bullet("Balance Académico Percibido tras el uso del sistema."),
      p("El usuario puede marcar el envío como Anónimo si prefiere que su identidad no quede registrada en la encuesta."),

      // ══════════════════════════════════════════════════════════
      // 10. NAVEGACIÓN
      // ══════════════════════════════════════════════════════════
      h1("10. Navegación General del Sistema"),
      p("El sistema cuenta con un menú lateral izquierdo persistente que permite acceder a todos los módulos en cualquier momento durante la sesión. La tabla siguiente describe cada sección disponible:"),
      ...space(1),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2600, 6760],
        rows: [
          new TableRow({ children: [thCell("Sección del Menú", 2600), thCell("Descripción", 6760)] }),
          ...([
            ["Mi Progreso",       "Panel principal con estadísticas emocionales, historial de evaluaciones, gráfico de evolución y patrones detectados."],
            ["Chat con IA",       "Asistente virtual de salud mental disponible 24/7 para apoyo emocional, técnicas de afrontamiento y orientación."],
            ["Cuestionarios",     "Evaluaciones clínicas estandarizadas (PHQ-9, GAD-7, PSS-10, ROSENBERG, RYFF, PSQI, SWLS, MBI-SS)."],
            ["Recursos",          "Ejercicios prácticos, técnicas de meditación, videos relajantes y lecturas sobre bienestar académico."],
            ["Diario Emocional",  "Espacio personal para registrar el estado de ánimo, reflexiones y notas emocionales del día a día."],
            ["Feedback",          "Envío de sugerencias, comentarios o reportes al equipo de bienestar universitario."],
            ["Encuestas",         "Participación en la encuesta de satisfacción de la plataforma (puede enviarse de forma anónima)."],
            ["Soporte",           "Contacto con el equipo técnico del sistema o con el área de orientación psicológica universitaria."],
          ].map(([a,b], i) => new TableRow({ children: [
            tdCell(a, 2600, i%2===0?"FFFFFF":"F5F8FD", true),
            tdCell(b, 6760, i%2===0?"FFFFFF":"F5F8FD"),
          ]})))
        ]
      }),

      // ══════════════════════════════════════════════════════════
      // 11. MENSAJES DEL SISTEMA
      // ══════════════════════════════════════════════════════════
      ...space(1),
      h1("11. Interpretación de Mensajes del Sistema"),
      p("El sistema muestra mensajes de retroalimentación al usuario según el resultado de cada acción. La siguiente tabla describe los mensajes más comunes:"),
      ...space(1),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 4100, 3860],
        rows: [
          new TableRow({ children: [thCell("Tipo", 1400), thCell("Mensaje", 4100), thCell("Significado", 3860)] }),
          ...([
            ["Éxito ✔",       "\"Registro exitoso\"",                   "La cuenta fue creada correctamente."],
            ["Éxito ✔",       "\"Resultado guardado\"",                 "El cuestionario fue procesado y almacenado."],
            ["Éxito ✔",       "\"Mensaje enviado\"",                    "El chat o el feedback fue guardado exitosamente."],
            ["Éxito ✔",       "\"Sesión iniciada\"",                    "Las credenciales son correctas; acceso concedido."],
            ["Advertencia ⚠", "\"Campos incompletos\"",                 "Faltan datos obligatorios en el formulario activo."],
            ["Advertencia ⚠", "\"Usuario ya existe\"",                  "La cédula o el correo ingresados ya están registrados."],
            ["Advertencia ⚠", "\"Conversación muy larga\"",             "El mensaje excede el límite de caracteres del chat."],
            ["Error ✖",       "\"Error de conexión\"",                  "Problemas con la base de datos o el servidor."],
            ["Error ✖",       "\"Servicio no disponible\"",             "El asistente IA está temporalmente fuera de línea."],
            ["Error ✖",       "\"Usuario no encontrado\"",              "Las credenciales de inicio de sesión son incorrectas."],
          ].map(([a,b,c], i) => new TableRow({ children: [
            tdCell(a, 1400, i%2===0?"FFFFFF":"F5F8FD", true),
            tdCell(b, 4100, i%2===0?"FFFFFF":"F5F8FD"),
            tdCell(c, 3860, i%2===0?"FFFFFF":"F5F8FD"),
          ]})))
        ]
      }),

      // ══════════════════════════════════════════════════════════
      // 12. RESOLUCIÓN DE PROBLEMAS
      // ══════════════════════════════════════════════════════════
      ...space(1),
      h1("12. Resolución de Problemas Comunes"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2500, 2700, 4160],
        rows: [
          new TableRow({ children: [thCell("Problema", 2500), thCell("Causa Probable", 2700), thCell("Solución Recomendada", 4160)] }),
          ...([
            ["El sistema no abre al ingresar la URL",      "El servidor backend no está activo",           "Verificar que Spring Boot y MySQL estén corriendo en el servidor."],
            ["Los datos no se guardan correctamente",      "Base de datos desconectada o inaccesible",     "Iniciar el servicio de MySQL y verificar el puerto de conexión configurado."],
            ["La página aparece en blanco",                "Error en el navegador o URL incorrecta",       "Recargar la página (F5) o verificar que la URL ingresada sea correcta."],
            ["Error de campos vacíos en el formulario",   "Datos obligatorios sin diligenciar",           "Completar todos los campos marcados con asterisco (*) antes de enviar."],
            ["Credenciales incorrectas al iniciar sesión","Contraseña o correo errados",                  "Verificar los datos o usar la opción \"¿Olvidaste tu contraseña?\" para recuperar acceso."],
            ["El Chat IA no responde o tarda mucho",      "Servicio de IA temporalmente ocupado",         "Esperar unos segundos y reenviar el mensaje, o intentarlo más tarde."],
            ["Los gráficos del panel no aparecen",        "No hay cuestionarios completados aún",         "Completar al menos un cuestionario para que el sistema genere el gráfico de evolución."],
            ["No puedo cerrar sesión correctamente",      "Sesión bloqueada o error del navegador",       "Limpiar la caché del navegador (Ctrl+Shift+Del) y recargar la página."],
          ].map(([a,b,c], i) => new TableRow({ children: [
            tdCell(a, 2500, i%2===0?"FFFFFF":"F5F8FD", true),
            tdCell(b, 2700, i%2===0?"FFFFFF":"F5F8FD"),
            tdCell(c, 4160, i%2===0?"FFFFFF":"F5F8FD"),
          ]})))
        ]
      }),
      ...space(1),
      h2("12.1 Pasos Generales ante Cualquier Error"),
      numbered("Verificar la conexión a internet o a la red institucional."),
      numbered("Intentar la acción nuevamente; en ocasiones los errores son temporales."),
      numbered("Limpiar la caché del navegador (Ctrl+Shift+Del) y recargar la página."),
      numbered("Cerrar sesión completamente e ingresar de nuevo con las credenciales."),
      numbered("Si el problema persiste, comunicarse con el equipo de soporte técnico a través del módulo Soporte del menú lateral."),

      // ══════════════════════════════════════════════════════════
      // 13. CIERRE DE SESIÓN
      // ══════════════════════════════════════════════════════════
      h1("13. Cierre de Sesión"),
      p("Es recomendable cerrar la sesión al finalizar el uso de la plataforma, especialmente cuando se accede desde dispositivos compartidos o públicos, para proteger la privacidad de la información personal."),
      h2("13.1 Pasos para Cerrar Sesión"),
      numbered("Hacer clic en el nombre de usuario ubicado en la esquina inferior izquierda del menú lateral."),
      numbered("Seleccionar la opción \"Cerrar sesión\" del menú desplegable que aparece."),
      numbered("El sistema redirigirá automáticamente a la página de inicio del portal."),
      ...space(1),
      noteBox("Recomendación:", "No compartir las credenciales de acceso con terceras personas. La información registrada en la plataforma (cuestionarios, diario emocional, chat) es estrictamente personal y confidencial."),

      // ══════════════════════════════════════════════════════════
      // 14. CONSEJOS DE USO
      // ══════════════════════════════════════════════════════════
      h1("14. Consejos de Uso Óptimo"),
      p("Para aprovechar al máximo las funcionalidades de la plataforma y obtener resultados precisos en el seguimiento del bienestar emocional, se recomienda tener en cuenta los siguientes consejos:"),
      bullet("Consistencia: utilizar la plataforma de forma regular (al menos una vez por semana) para que el seguimiento emocional sea más preciso y representativo."),
      bullet("Honestidad: responder los cuestionarios con sinceridad y en un momento de tranquilidad, para que los resultados reflejen fielmente el estado emocional real."),
      bullet("Programar evaluaciones: establecer recordatorios periódicos para completar los tests de bienestar. La plataforma recomienda al menos una evaluación mensual por cuestionario."),
      bullet("Usar el Chat IA proactivamente: no esperar a una crisis para utilizar el asistente; consultarlo ante cualquier duda, preocupación o simplemente para hablar sobre cómo se siente."),
      bullet("Revisar el progreso mensualmente: acceder al panel principal al menos una vez al mes para analizar la evolución emocional y los patrones detectados."),
      bullet("Explorar los recursos: visitar el módulo Recursos ante situaciones de estrés académico o ansiedad; los ejercicios de respiración y meditación pueden aplicarse en cualquier momento."),
      bullet("Mantener el diario emocional: registrar entradas frecuentes en el diario emocional, aunque sean breves, contribuye significativamente al análisis de patrones a largo plazo."),

      // ══════════════════════════════════════════════════════════
      // 15. CONCLUSIÓN
      // ══════════════════════════════════════════════════════════
      h1("15. Conclusión"),
      p("La Plataforma de Seguimiento y Evaluación de Salud Mental en Estudiantes de la Universidad de Córdoba — ERS Bienestar — representa una herramienta tecnológica innovadora orientada a complementar los esfuerzos institucionales de bienestar universitario. A través de sus módulos de evaluación clínica, asistente de inteligencia artificial, diario emocional y recursos de apoyo, ofrece al estudiante un espacio accesible, seguro y confidencial para el monitoreo continuo de su estado emocional."),
      p("El presente Manual de Usuario ha descrito de forma detallada el funcionamiento de cada componente de la plataforma, desde el proceso de registro hasta la interpretación de los resultados y la resolución de problemas comunes. El sistema ha sido diseñado con un enfoque centrado en el usuario, priorizando la simplicidad, la accesibilidad y la empatía en cada interacción."),
      p("Siguiendo las instrucciones y recomendaciones aquí descritas, cualquier estudiante o docente de la Universidad de Córdoba podrá utilizar la plataforma de forma autónoma, responsable y productiva, contribuyendo así a una comunidad académica más consciente, informada y comprometida con su bienestar integral."),
      ...space(1),
      noteBox("Recuerda:", "ERS Bienestar es un apoyo complementario, no un sustituto de la atención profesional. Línea de crisis nacional: 106. Centro de Atención Psicológica Universitaria: consultar con la Oficina de Bienestar Universitario de la Universidad de Córdoba."),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const outputPath = path.join(process.cwd(), 'Manual_Usuario_ERS_Bienestar_v2.docx');
  fs.writeFileSync(outputPath, buf);
  console.log(`Done! ${outputPath}`);
}).catch(err => console.error(err));
