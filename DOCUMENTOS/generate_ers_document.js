/**
 * ============================================================================
 * GENERADOR DE DOCUMENTO ERS - ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE
 * ============================================================================
 * Proyecto: ERS Bienestar Estudiantil - Universidad de Córdoba
 * Descripción: Genera el documento Word (.docx) completo de la ERS
 *              actualizada con TODOS los cambios implementados en el
 *              proyecto final.
 *
 * Uso: node generate_ers_document.js
 * Salida: ERS_Estudiante_Actualizado.docx
 * ============================================================================
 */

import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    TableRow,
    TableCell,
    Table,
    WidthType,
    BorderStyle,
    PageBreak,
    TabStopType,
    TabStopPosition,
    Header,
    Footer,
    PageNumber,
    NumberFormat,
    ShadingType,
    convertInchesToTwip,
    LevelFormat,
    UnderlineType,
    ExternalHyperlink,
} from 'docx';
import * as fs from 'fs';

// ============================================================================
// ESTILOS Y CONSTANTES GLOBALES
// ============================================================================
const COLORS = {
    PRIMARY: '1F4E79',       // Azul institucional oscuro
    SECONDARY: '2E75B6',     // Azul medio
    ACCENT: '4472C4',        // Azul acento
    DARK: '000000',          // Negro
    GRAY: '595959',          // Gris oscuro
    LIGHT_GRAY: 'A6A6A6',   // Gris claro
    WHITE: 'FFFFFF',         // Blanco
    TABLE_HEADER: '1F4E79',  // Azul oscuro cabecera tabla
    TABLE_ALT: 'D9E2F3',    // Azul claro alterno tabla
    RED: 'C00000',           // Rojo para prioridad alta
    ORANGE: 'ED7D31',        // Naranja para prioridad media
    GREEN: '00B050',         // Verde para prioridad baja/estable
};

const FONT = {
    TITLE: 'Times New Roman',
    BODY: 'Times New Roman',
    CODE: 'Consolas',
};

// ============================================================================
// FUNCIONES AUXILIARES DE FORMATO
// ============================================================================

function createTitle(text, level = HeadingLevel.HEADING_1) {
    return new Paragraph({
        heading: level,
        spacing: { before: 360, after: 200 },
        children: [
            new TextRun({
                text,
                bold: true,
                font: FONT.TITLE,
                size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24,
                color: COLORS.PRIMARY,
            }),
        ],
    });
}

function createSubtitle(text) {
    return createTitle(text, HeadingLevel.HEADING_2);
}

function createSubSubtitle(text) {
    return createTitle(text, HeadingLevel.HEADING_3);
}

function createParagraph(text, options = {}) {
    return new Paragraph({
        spacing: { after: 120, line: 360 },
        alignment: options.alignment || AlignmentType.JUSTIFIED,
        indent: options.indent ? { firstLine: convertInchesToTwip(0.5) } : undefined,
        children: [
            new TextRun({
                text,
                font: FONT.BODY,
                size: 24,
                color: COLORS.DARK,
                bold: options.bold || false,
                italics: options.italics || false,
            }),
        ],
    });
}

function createBullet(text, level = 0) {
    return new Paragraph({
        spacing: { after: 80, line: 360 },
        bullet: { level },
        children: [
            new TextRun({
                text,
                font: FONT.BODY,
                size: 24,
                color: COLORS.DARK,
            }),
        ],
    });
}

function createBoldBullet(boldText, normalText, level = 0) {
    return new Paragraph({
        spacing: { after: 80, line: 360 },
        bullet: { level },
        children: [
            new TextRun({
                text: boldText,
                font: FONT.BODY,
                size: 24,
                color: COLORS.DARK,
                bold: true,
            }),
            new TextRun({
                text: normalText,
                font: FONT.BODY,
                size: 24,
                color: COLORS.DARK,
            }),
        ],
    });
}

function createTableHeaderCell(text, width = undefined) {
    return new TableCell({
        width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
        shading: { type: ShadingType.SOLID, color: COLORS.TABLE_HEADER },
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
                children: [
                    new TextRun({
                        text,
                        bold: true,
                        font: FONT.BODY,
                        size: 20,
                        color: COLORS.WHITE,
                    }),
                ],
            }),
        ],
    });
}

function createTableCell(text, width = undefined, options = {}) {
    return new TableCell({
        width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
        shading: options.shading ? { type: ShadingType.SOLID, color: options.shading } : undefined,
        children: [
            new Paragraph({
                alignment: options.alignment || AlignmentType.LEFT,
                spacing: { before: 40, after: 40 },
                children: [
                    new TextRun({
                        text,
                        font: FONT.BODY,
                        size: 20,
                        color: options.color || COLORS.DARK,
                        bold: options.bold || false,
                    }),
                ],
            }),
        ],
    });
}

function createTable(headerRow, dataRows) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({ children: headerRow, tableHeader: true }),
            ...dataRows.map(
                (row) => new TableRow({ children: row })
            ),
        ],
    });
}

function emptyLine() {
    return new Paragraph({ spacing: { after: 120 }, children: [] });
}

function pageBreak() {
    return new Paragraph({ children: [new PageBreak()] });
}

// ============================================================================
// GENERACIÓN DEL DOCUMENTO COMPLETO
// ============================================================================

function generateDocument() {
    const doc = new Document({
        creator: 'Universidad de Córdoba - Ingeniería de Sistemas',
        title: 'ERS - Especificación de Requisitos de Software - Bienestar Estudiantil',
        description: 'Documento ERS actualizado con todos los cambios implementados en el proyecto final',
        styles: {
            default: {
                document: {
                    run: {
                        font: FONT.BODY,
                        size: 24,
                    },
                    paragraph: {
                        spacing: { line: 360 },
                    },
                },
            },
        },
        numbering: {
            config: [
                {
                    reference: 'ers-numbering',
                    levels: [
                        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT },
                        { level: 1, format: LevelFormat.DECIMAL, text: '%1.%2.', alignment: AlignmentType.LEFT },
                        { level: 2, format: LevelFormat.DECIMAL, text: '%1.%2.%3.', alignment: AlignmentType.LEFT },
                    ],
                },
            ],
        },
        sections: [
            // ================================================================
            // PORTADA
            // ================================================================
            {
                properties: {
                    page: {
                        margin: {
                            top: convertInchesToTwip(1),
                            bottom: convertInchesToTwip(1),
                            left: convertInchesToTwip(1.2),
                            right: convertInchesToTwip(1.2),
                        },
                    },
                },
                children: [
                    emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({
                                text: 'UNIVERSIDAD DE CÓRDOBA',
                                bold: true,
                                font: FONT.TITLE,
                                size: 36,
                                color: COLORS.PRIMARY,
                            }),
                        ],
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 },
                        children: [
                            new TextRun({
                                text: 'FACULTAD DE INGENIERÍAS',
                                bold: true,
                                font: FONT.TITLE,
                                size: 28,
                                color: COLORS.SECONDARY,
                            }),
                        ],
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        children: [
                            new TextRun({
                                text: 'PROGRAMA DE INGENIERÍA DE SISTEMAS Y TELECOMUNICACIONES',
                                bold: true,
                                font: FONT.TITLE,
                                size: 24,
                                color: COLORS.SECONDARY,
                            }),
                        ],
                    }),

                    emptyLine(), emptyLine(),

                    // Línea separadora
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        border: {
                            bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.PRIMARY },
                        },
                        children: [],
                    }),

                    emptyLine(),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 },
                        children: [
                            new TextRun({
                                text: 'ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE',
                                bold: true,
                                font: FONT.TITLE,
                                size: 36,
                                color: COLORS.PRIMARY,
                            }),
                        ],
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 80 },
                        children: [
                            new TextRun({
                                text: '(ERS)',
                                bold: true,
                                font: FONT.TITLE,
                                size: 32,
                                color: COLORS.PRIMARY,
                            }),
                        ],
                    }),

                    emptyLine(),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        children: [
                            new TextRun({
                                text: 'PLATAFORMA WEB DE BIENESTAR EMOCIONAL ESTUDIANTIL',
                                bold: true,
                                font: FONT.TITLE,
                                size: 30,
                                color: COLORS.ACCENT,
                            }),
                        ],
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 },
                        children: [
                            new TextRun({
                                text: '"ERS Bienestar - Portal de Autoconocimiento, Monitoreo Clínico',
                                italics: true,
                                font: FONT.TITLE,
                                size: 24,
                                color: COLORS.GRAY,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        children: [
                            new TextRun({
                                text: 'y Soporte Emocional Activo del Estudiante"',
                                italics: true,
                                font: FONT.TITLE,
                                size: 24,
                                color: COLORS.GRAY,
                            }),
                        ],
                    }),

                    // Línea separadora
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        border: {
                            bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.PRIMARY },
                        },
                        children: [],
                    }),

                    emptyLine(), emptyLine(),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 },
                        children: [
                            new TextRun({
                                text: 'Versión: 2.0 — Documento Actualizado con Implementación Final',
                                bold: true,
                                font: FONT.BODY,
                                size: 22,
                                color: COLORS.GRAY,
                            }),
                        ],
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 },
                        children: [
                            new TextRun({
                                text: 'Fecha: Mayo 2026',
                                font: FONT.BODY,
                                size: 22,
                                color: COLORS.GRAY,
                            }),
                        ],
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 },
                        children: [
                            new TextRun({
                                text: 'Montería, Córdoba — Colombia',
                                font: FONT.BODY,
                                size: 22,
                                color: COLORS.GRAY,
                            }),
                        ],
                    }),

                    pageBreak(),

                    // ================================================================
                    // TABLA DE CONTENIDO
                    // ================================================================
                    createTitle('TABLA DE CONTENIDO'),
                    emptyLine(),

                    ...[
                        '1. Introducción',
                        '   1.1 Propósito',
                        '   1.2 Ámbito del Sistema',
                        '   1.3 Definiciones, Acrónimos y Abreviaturas',
                        '   1.4 Referencias',
                        '   1.5 Visión General del Documento',
                        '2. Descripción General',
                        '   2.1 Perspectiva del Producto',
                        '   2.2 Funciones del Producto',
                        '   2.3 Características de los Usuarios',
                        '   2.4 Restricciones',
                        '   2.5 Suposiciones y Dependencias',
                        '3. Requisitos Específicos',
                        '   3.1 Requisitos Funcionales',
                        '      3.1.1 RF-01: Gestión de Usuarios y Autenticación',
                        '      3.1.2 RF-02: Dashboard de Progreso del Estudiante',
                        '      3.1.3 RF-03: Módulo de Evaluaciones Psicométricas',
                        '      3.1.4 RF-04: Diario Emocional',
                        '      3.1.5 RF-05: Chat de Apoyo con Inteligencia Artificial',
                        '      3.1.6 RF-06: Módulo de Reportes y Analíticas',
                        '      3.1.7 RF-07: Retroalimentación del Estudiante',
                        '      3.1.8 RF-08: Encuesta de Satisfacción',
                        '      3.1.9 RF-09: Recursos de Bienestar',
                        '      3.1.10 RF-10: Panel de Administración',
                        '   3.2 Requisitos No Funcionales',
                        '      3.2.1 RNF-01: Rendimiento',
                        '      3.2.2 RNF-02: Seguridad',
                        '      3.2.3 RNF-03: Usabilidad',
                        '      3.2.4 RNF-04: Disponibilidad',
                        '      3.2.5 RNF-05: Portabilidad',
                        '      3.2.6 RNF-06: Escalabilidad',
                        '   3.3 Requisitos de Interfaces Externas',
                        '      3.3.1 Interfaces de Usuario',
                        '      3.3.2 Interfaces de Software',
                        '      3.3.3 Interfaces de Comunicación',
                        '4. Arquitectura del Sistema',
                        '   4.1 Stack Tecnológico',
                        '   4.2 Modelo de Datos',
                        '   4.3 Patrones de Diseño',
                        '   4.4 Estructura del Proyecto',
                        '5. Casos de Uso',
                        '6. Matriz de Trazabilidad',
                        '7. Apéndices',
                    ].map(line => {
                        const isMain = !line.startsWith('   ');
                        const isSub = line.startsWith('   ') && !line.startsWith('      ');
                        return new Paragraph({
                            spacing: { after: isMain ? 100 : 60, line: 300 },
                            indent: { left: line.startsWith('      ') ? convertInchesToTwip(1) : line.startsWith('   ') ? convertInchesToTwip(0.5) : 0 },
                            children: [
                                new TextRun({
                                    text: line.trim(),
                                    font: FONT.BODY,
                                    size: isMain ? 24 : 22,
                                    bold: isMain,
                                    color: isMain ? COLORS.PRIMARY : COLORS.DARK,
                                }),
                            ],
                        });
                    }),

                    pageBreak(),

                    // ================================================================
                    // 1. INTRODUCCIÓN
                    // ================================================================
                    createTitle('1. Introducción'),

                    createParagraph(
                        'El presente documento constituye la Especificación de Requisitos de Software (ERS) para la Plataforma Web de Bienestar Emocional Estudiantil de la Universidad de Córdoba, denominada "ERS Bienestar". Este documento ha sido actualizado en su versión 2.0 para reflejar fielmente TODOS los cambios y funcionalidades implementados en el proyecto final de desarrollo, conforme al estándar IEEE 830-1998 para la especificación de requisitos de software.',
                        { indent: true }
                    ),

                    createParagraph(
                        'La plataforma ERS Bienestar nace como respuesta a la creciente necesidad de ofrecer a los estudiantes de la Universidad de Córdoba un canal autónomo, seguro, confidencial y tecnológicamente avanzado para el monitoreo, autoconocimiento y soporte activo de su salud mental y bienestar emocional en el contexto académico universitario.',
                        { indent: true }
                    ),

                    // 1.1 Propósito
                    createSubtitle('1.1 Propósito'),

                    createParagraph(
                        'El propósito de esta ERS es definir de manera formal, completa y detallada todos los requisitos funcionales y no funcionales del sistema ERS Bienestar, tal como han sido implementados en su versión final. Este documento sirve como referencia técnica y contractual para:',
                        { indent: true }
                    ),

                    createBullet('Documentar exhaustivamente cada módulo y funcionalidad implementada en el sistema.'),
                    createBullet('Establecer la base técnica para la verificación y validación del software entregado.'),
                    createBullet('Servir como guía de referencia para el mantenimiento y la evolución futura del sistema.'),
                    createBullet('Comunicar a todas las partes interesadas (estudiantes, docentes, administradores, Bienestar Universitario) el alcance completo del sistema.'),
                    createBullet('Facilitar la trazabilidad entre los requisitos especificados y las funcionalidades implementadas.'),

                    // 1.2 Ámbito del Sistema
                    createSubtitle('1.2 Ámbito del Sistema'),

                    createParagraph(
                        'ERS Bienestar es una plataforma web de tipo Single Page Application (SPA) desarrollada con arquitectura moderna de cliente-servidor, construida sobre el framework Laravel 13 en el backend con PHP 8.3 e Inertia.js con React 19 y TypeScript en el frontend. El sistema se despliega como una aplicación web responsiva y progresiva accesible desde cualquier dispositivo con navegador web moderno.',
                        { indent: true }
                    ),

                    createParagraph('El sistema implementa las siguientes capacidades principales:', { indent: true }),

                    createBullet('Autenticación robusta con soporte para contraseñas tradicionales, Passkeys (WebAuthn/FIDO2) y autenticación de dos factores (2FA) con códigos TOTP.'),
                    createBullet('8 cuestionarios psicométricos clínicos validados (PHQ-9, GAD-7, PSS-10, Rosenberg, RYFF, PSQI, SWLS, MBI-SS) con escalas Likert estandarizadas, clasificación automática de riesgo y generación de resúmenes clínicos.'),
                    createBullet('Dashboard analítico en tiempo real con gráficos SVG dinámicos, indicadores de bienestar, historial de evaluaciones, distribución de estados emocionales, logros gamificados y recomendaciones personalizadas.'),
                    createBullet('Diario emocional completo con funcionalidad CRUD (Crear, Leer, Actualizar, Eliminar), registro de estado de ánimo con puntuación del 1 al 10 y categorización de emociones.'),
                    createBullet('Chat de apoyo emocional potenciado por Inteligencia Artificial con arquitectura de triple fallback (DeepSeek API → Google Gemini API → Pollinations AI → Respuestas locales contextualizadas).'),
                    createBullet('Módulo completo de recursos de bienestar con ejercicios interactivos (Respiración Cuadrada, Técnica 5-4-3-2-1, Relajación Progresiva de Jacobson, Meditación Guiada, Respiración Diafragmática, Paisajes Sonoros, Gratitud y Lectura Recomendada).'),
                    createBullet('Módulo de reportes con analíticas avanzadas, tendencias de evolución emocional y comparativa con la comunidad.'),
                    createBullet('Sistema de retroalimentación del estudiante con categorización (sugerencia, error, mejora, otro) y flujo de revisión administrativa.'),
                    createBullet('Encuesta de satisfacción multidimensional con evaluación de soporte emocional, claridad de la plataforma y equilibrio académico.'),
                    createBullet('Panel de administración completo con gestión de usuarios (activar/desactivar, cambiar rol, eliminar), gestión de cuestionarios (CRUD, estados draft/published) y gestión de retroalimentaciones.'),
                    createBullet('Soporte completo para temas claro/oscuro con persistencia automática de preferencias del usuario.'),

                    // 1.3 Definiciones, Acrónimos y Abreviaturas
                    createSubtitle('1.3 Definiciones, Acrónimos y Abreviaturas'),

                    createTable(
                        [
                            createTableHeaderCell('Término', 25),
                            createTableHeaderCell('Definición', 75),
                        ],
                        [
                            [createTableCell('ERS', 25), createTableCell('Especificación de Requisitos de Software', 75)],
                            [createTableCell('SPA', 25), createTableCell('Single Page Application - Aplicación de página única', 75)],
                            [createTableCell('PHQ-9', 25), createTableCell('Patient Health Questionnaire-9 - Cuestionario de Salud del Paciente para Depresión (9 ítems)', 75)],
                            [createTableCell('GAD-7', 25), createTableCell('Generalized Anxiety Disorder-7 - Trastorno de Ansiedad Generalizada (7 ítems)', 75)],
                            [createTableCell('PSS-10', 25), createTableCell('Perceived Stress Scale-10 - Escala de Estrés Percibido (10 ítems)', 75)],
                            [createTableCell('Rosenberg', 25), createTableCell('Escala de Autoestima de Rosenberg - Autovaloración global (10 ítems)', 75)],
                            [createTableCell('RYFF', 25), createTableCell('Escalas de Bienestar Psicológico de Ryff - Bienestar psicológico multidimensional (6 ítems)', 75)],
                            [createTableCell('PSQI', 25), createTableCell('Pittsburgh Sleep Quality Index - Índice de Calidad del Sueño de Pittsburgh (5 ítems)', 75)],
                            [createTableCell('SWLS', 25), createTableCell('Satisfaction With Life Scale - Escala de Satisfacción con la Vida (5 ítems)', 75)],
                            [createTableCell('MBI-SS', 25), createTableCell('Maslach Burnout Inventory Student Survey - Inventario de Burnout Académico de Maslach (6 ítems)', 75)],
                            [createTableCell('2FA', 25), createTableCell('Two-Factor Authentication - Autenticación de dos factores con códigos TOTP', 75)],
                            [createTableCell('FIDO2', 25), createTableCell('Fast Identity Online 2 - Estándar de autenticación sin contraseña (Passkeys/WebAuthn)', 75)],
                            [createTableCell('IA', 25), createTableCell('Inteligencia Artificial - Utilizada en el chat de apoyo emocional', 75)],
                            [createTableCell('TOTP', 25), createTableCell('Time-based One-Time Password - Contraseña de un solo uso basada en tiempo', 75)],
                            [createTableCell('CRUD', 25), createTableCell('Create, Read, Update, Delete - Operaciones básicas de gestión de datos', 75)],
                            [createTableCell('API', 25), createTableCell('Application Programming Interface - Interfaz de Programación de Aplicaciones', 75)],
                            [createTableCell('REST', 25), createTableCell('Representational State Transfer - Estilo arquitectónico para servicios web', 75)],
                            [createTableCell('ORM', 25), createTableCell('Object-Relational Mapping - Mapeo Objeto-Relacional (Eloquent)', 75)],
                            [createTableCell('SSR', 25), createTableCell('Server-Side Rendering - Renderizado del lado del servidor', 75)],
                        ]
                    ),

                    emptyLine(),

                    // 1.4 Referencias
                    createSubtitle('1.4 Referencias'),

                    createBullet('IEEE 830-1998: IEEE Recommended Practice for Software Requirements Specifications.'),
                    createBullet('IEEE 29148-2018: ISO/IEC/IEEE International Standard for Systems and Software Engineering — Requirements Engineering.'),
                    createBullet('PHQ-9: Kroenke, K., Spitzer, R.L., & Williams, J.B. (2001). The PHQ-9: validity of a brief depression severity measure.'),
                    createBullet('GAD-7: Spitzer, R.L., Kroenke, K., Williams, J.B., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder.'),
                    createBullet('PSS-10: Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress.'),
                    createBullet('Rosenberg Self-Esteem Scale: Rosenberg, M. (1965). Society and the adolescent self-image.'),
                    createBullet('RYFF Psychological Well-Being Scales: Ryff, C.D. (1989). Happiness is everything, or is it?'),
                    createBullet('PSQI: Buysse, D.J., Reynolds, C.F., Monk, T.H., Berman, S.R., & Kupfer, D.J. (1989). The Pittsburgh Sleep Quality Index.'),
                    createBullet('SWLS: Diener, E., Emmons, R.A., Larsen, R.J., & Griffin, S. (1985). The Satisfaction With Life Scale.'),
                    createBullet('MBI-SS: Schaufeli, W.B., Martínez, I.M., Marques Pinto, A., Salanova, M., & Bakker, A.B. (2002). Burnout and engagement in university students.'),
                    createBullet('Laravel Framework v13: https://laravel.com/docs — Documentación oficial del framework PHP.'),
                    createBullet('React v19: https://react.dev — Biblioteca JavaScript para interfaces de usuario.'),
                    createBullet('Inertia.js v3: https://inertiajs.com — Adaptador monolítico moderno para SPAs.'),

                    // 1.5 Visión General del Documento
                    createSubtitle('1.5 Visión General del Documento'),

                    createParagraph(
                        'Este documento se estructura siguiendo el estándar IEEE 830-1998 y se organiza en las siguientes secciones principales:',
                        { indent: true }
                    ),

                    createBoldBullet('Sección 1 - Introducción: ', 'Proporciona el contexto, propósito, ámbito, definiciones y referencias del documento.'),
                    createBoldBullet('Sección 2 - Descripción General: ', 'Presenta la perspectiva del producto, funciones principales, tipos de usuarios, restricciones y suposiciones del sistema.'),
                    createBoldBullet('Sección 3 - Requisitos Específicos: ', 'Detalla exhaustivamente cada requisito funcional (RF) y no funcional (RNF) implementado en el sistema final.'),
                    createBoldBullet('Sección 4 - Arquitectura del Sistema: ', 'Describe el stack tecnológico, modelo de datos, patrones de diseño y estructura del proyecto.'),
                    createBoldBullet('Sección 5 - Casos de Uso: ', 'Documenta los principales escenarios de uso del sistema.'),
                    createBoldBullet('Sección 6 - Matriz de Trazabilidad: ', 'Relaciona los requisitos con los componentes implementados.'),
                    createBoldBullet('Sección 7 - Apéndices: ', 'Información complementaria y detalles adicionales.'),

                    pageBreak(),

                    // ================================================================
                    // 2. DESCRIPCIÓN GENERAL
                    // ================================================================
                    createTitle('2. Descripción General'),

                    // 2.1 Perspectiva del Producto
                    createSubtitle('2.1 Perspectiva del Producto'),

                    createParagraph(
                        'ERS Bienestar es un sistema web independiente y autónomo, diseñado específicamente para la Universidad de Córdoba, que opera como una plataforma integral de monitoreo, autoconocimiento y soporte emocional del estudiante universitario. No es una extensión de ningún sistema existente, sino un producto nuevo que ha sido concebido, diseñado e implementado desde cero para abordar las necesidades específicas de salud mental y bienestar emocional de la comunidad estudiantil de la institución.',
                        { indent: true }
                    ),

                    createParagraph(
                        'El sistema se integra con servicios externos de inteligencia artificial (DeepSeek, Google Gemini, Pollinations AI) para proporcionar acompañamiento conversacional empático en tiempo real, y utiliza una base de datos SQLite local para el almacenamiento persistente de toda la información de usuarios, evaluaciones, entradas de diario, retroalimentaciones y encuestas.',
                        { indent: true }
                    ),

                    createParagraph('El producto se compone de los siguientes subsistemas interconectados:', { indent: true }),

                    createBoldBullet('Subsistema de Autenticación: ', 'Registro, inicio de sesión, Passkeys (WebAuthn/FIDO2), 2FA con TOTP, gestión de perfil y configuración de apariencia (tema claro/oscuro).'),
                    createBoldBullet('Subsistema de Evaluaciones Psicométricas: ', '8 cuestionarios clínicos estandarizados con escalas Likert, clasificación automática de riesgo por porcentaje (Bajo/Moderado/Alto/Crítico) y generación de resúmenes clínicos.'),
                    createBoldBullet('Subsistema de Dashboard y Analíticas: ', 'Visualización en tiempo real de progreso emocional con gráficos SVG dinámicos, indicadores numéricos, distribución de bienestar, historial de evaluaciones y sistema de logros gamificados.'),
                    createBoldBullet('Subsistema de Diario Emocional: ', 'Registro textual de emociones y pensamientos con operaciones CRUD completas, categorización de estado de ánimo y puntuación de 1 a 10.'),
                    createBoldBullet('Subsistema de Chat IA: ', 'Acompañamiento conversacional con triple fallback de IA (DeepSeek → Gemini → Pollinations → respuestas locales) configurado como consejero universitario empático.'),
                    createBoldBullet('Subsistema de Recursos: ', 'Biblioteca interactiva de ejercicios prácticos de bienestar (Respiración Cuadrada, Técnica 5-4-3-2-1, Jacobson, Meditación Guiada, Respiración Diafragmática, Paisajes Sonoros, Gratitud y Lectura Recomendada).'),
                    createBoldBullet('Subsistema de Reportes: ', 'Analíticas avanzadas con tendencias de evolución, distribución de bienestar, comparativa con la comunidad y recomendaciones personalizadas.'),
                    createBoldBullet('Subsistema de Retroalimentación: ', 'Canal de comunicación bidireccional estudiante-administración con categorización y flujo de revisión.'),
                    createBoldBullet('Subsistema de Encuesta de Satisfacción: ', 'Evaluación multidimensional de la experiencia del usuario con soporte anónimo.'),
                    createBoldBullet('Subsistema de Administración: ', 'Panel administrativo completo con gestión de usuarios, cuestionarios y retroalimentaciones, protegido por middleware de autorización.'),

                    // 2.2 Funciones del Producto
                    createSubtitle('2.2 Funciones del Producto'),

                    createParagraph(
                        'A continuación se presenta un resumen de las funciones principales que el sistema implementa en su versión final:',
                        { indent: true }
                    ),

                    createTable(
                        [
                            createTableHeaderCell('ID', 10),
                            createTableHeaderCell('Función', 35),
                            createTableHeaderCell('Descripción', 55),
                        ],
                        [
                            [createTableCell('F-01', 10), createTableCell('Autenticación Multifactor', 35), createTableCell('Registro, login con email/password, Passkeys WebAuthn, 2FA TOTP, gestión de sesiones', 55)],
                            [createTableCell('F-02', 10), createTableCell('Evaluaciones Clínicas', 35), createTableCell('8 cuestionarios psicométricos validados con clasificación automática de riesgo y resúmenes', 55)],
                            [createTableCell('F-03', 10), createTableCell('Dashboard Analítico', 35), createTableCell('Progreso en tiempo real, gráficos SVG, indicadores, logros, distribución, historial', 55)],
                            [createTableCell('F-04', 10), createTableCell('Diario Emocional', 35), createTableCell('CRUD completo de entradas con título, contenido, ánimo y puntuación de humor', 55)],
                            [createTableCell('F-05', 10), createTableCell('Chat de IA', 35), createTableCell('Asistente empático con triple fallback de IA (DeepSeek/Gemini/Pollinations/Local)', 55)],
                            [createTableCell('F-06', 10), createTableCell('Reportes y Analíticas', 35), createTableCell('Evolución emocional, tendencias, distribución de bienestar, comparativa comunitaria', 55)],
                            [createTableCell('F-07', 10), createTableCell('Retroalimentación', 35), createTableCell('Envío categorizado de feedback con flujo de revisión administrativa', 55)],
                            [createTableCell('F-08', 10), createTableCell('Encuesta de Satisfacción', 35), createTableCell('Evaluación multidimensional (emocional, claridad, equilibrio) con opción anónima', 55)],
                            [createTableCell('F-09', 10), createTableCell('Recursos de Bienestar', 35), createTableCell('8+ ejercicios interactivos de respiración, arraigo, meditación, sonidos y lectura', 55)],
                            [createTableCell('F-10', 10), createTableCell('Administración', 35), createTableCell('Gestión de usuarios, cuestionarios y retroalimentaciones con dashboard administrativo', 55)],
                            [createTableCell('F-11', 10), createTableCell('Temas Claro/Oscuro', 35), createTableCell('Soporte completo de apariencia con persistencia automática de preferencias', 55)],
                            [createTableCell('F-12', 10), createTableCell('Configuración de Perfil', 35), createTableCell('Edición de datos personales, contraseña, eliminación de cuenta', 55)],
                        ]
                    ),

                    emptyLine(),

                    // 2.3 Características de los Usuarios
                    createSubtitle('2.3 Características de los Usuarios'),

                    createParagraph(
                        'El sistema contempla dos tipos de usuarios con roles diferenciados y permisos específicos:',
                        { indent: true }
                    ),

                    createTable(
                        [
                            createTableHeaderCell('Rol', 15),
                            createTableHeaderCell('Descripción', 40),
                            createTableHeaderCell('Permisos y Capacidades', 45),
                        ],
                        [
                            [
                                createTableCell('Estudiante (student)', 15, { bold: true }),
                                createTableCell('Usuario principal del sistema. Estudiante activo de la Universidad de Córdoba que busca herramientas de autoconocimiento y soporte emocional.', 40),
                                createTableCell('Acceso al dashboard, cuestionarios, diario emocional, chat IA, reportes, recursos, retroalimentación, encuesta de satisfacción, configuración de perfil y tema.', 45),
                            ],
                            [
                                createTableCell('Administrador (admin)', 15, { bold: true }),
                                createTableCell('Personal autorizado de Bienestar Universitario o administrador del sistema con privilegios elevados de gestión.', 40),
                                createTableCell('Todas las capacidades del estudiante + panel administrativo con gestión de usuarios (activar/desactivar/cambiar rol/eliminar), gestión de cuestionarios (crear/editar/cambiar estado), gestión de retroalimentaciones (revisar/marcar como revisada) y dashboard administrativo con métricas globales.', 45),
                            ],
                        ]
                    ),

                    emptyLine(),

                    createParagraph(
                        'Campos de perfil del usuario implementados: nombre, email, contraseña (hasheada), rol (student/admin), estado (active/inactive), código estudiantil, departamento, semestre, cédula, fecha de nacimiento, edad, género y último check-in de ánimo.',
                        { indent: true }
                    ),

                    // 2.4 Restricciones
                    createSubtitle('2.4 Restricciones'),

                    createBullet('El sistema requiere PHP >= 8.3 con las extensiones necesarias para Laravel 13.'),
                    createBullet('El frontend requiere Node.js >= 18 para el build de los assets con Vite 8.'),
                    createBullet('La base de datos utilizada es SQLite, almacenada localmente en database/database.sqlite.'),
                    createBullet('El chat de IA requiere conectividad a internet para acceder a las APIs externas (DeepSeek, Gemini, Pollinations); en ausencia de conectividad, se activa el fallback de respuestas locales.'),
                    createBullet('Las claves de API (DEEPSEEK_API_KEY, GEMINI_API_KEY) deben configurarse en el archivo .env para habilitar los servicios de IA externos.'),
                    createBullet('El sistema sigue las directrices de privacidad y confidencialidad, no almacenando conversaciones del chat y permitiendo encuestas anónimas.'),
                    createBullet('La interfaz de usuario está completamente en español (español de Colombia) para la comunidad universitaria local.'),
                    createBullet('El sistema requiere Laravel Herd o un servidor web compatible (Apache/Nginx) para el despliegue local.'),

                    // 2.5 Suposiciones y Dependencias
                    createSubtitle('2.5 Suposiciones y Dependencias'),

                    createBullet('Se asume que los usuarios disponen de un dispositivo con navegador web moderno (Chrome, Firefox, Safari, Edge) con soporte para JavaScript ES2020+.'),
                    createBullet('Se asume que la institución proporciona la infraestructura necesaria para el despliegue del servidor web y la base de datos.'),
                    createBullet('El sistema depende del framework Laravel 13, Inertia.js 3, React 19 y sus respectivos ecosistemas de paquetes.'),
                    createBullet('El módulo de Passkeys depende del soporte del navegador para WebAuthn/FIDO2 (disponible en navegadores modernos).'),
                    createBullet('Las funcionalidades de IA dependen de la disponibilidad de los servicios externos (DeepSeek, Google Gemini, Pollinations AI).'),
                    createBullet('Se asume que los cuestionarios clínicos implementados (PHQ-9, GAD-7, PSS-10, etc.) mantienen su validez psicométrica en el contexto de uso.'),

                    pageBreak(),

                    // ================================================================
                    // 3. REQUISITOS ESPECÍFICOS
                    // ================================================================
                    createTitle('3. Requisitos Específicos'),

                    createParagraph(
                        'Esta sección detalla exhaustivamente cada uno de los requisitos funcionales y no funcionales del sistema tal como han sido implementados en la versión final del proyecto.',
                        { indent: true }
                    ),

                    // 3.1 Requisitos Funcionales
                    createSubtitle('3.1 Requisitos Funcionales'),

                    // ---- RF-01 ----
                    createSubSubtitle('3.1.1 RF-01: Gestión de Usuarios y Autenticación'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-01', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Gestión de Usuarios y Autenticación Multifactor', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Alta — Esencial', 75, { color: COLORS.RED, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createParagraph('El sistema implementa un módulo completo de gestión de usuarios y autenticación con las siguientes funcionalidades:', { indent: true }),

                    createBoldBullet('Registro de usuarios: ', 'Formulario de registro con campos de nombre, email y contraseña. La contraseña se almacena con hash seguro (bcrypt). Al registrarse, el usuario obtiene rol "student" y estado "active" por defecto.'),
                    createBoldBullet('Inicio de sesión: ', 'Autenticación por email y contraseña con verificación de email obligatoria. Soporte para "recordarme" con token de sesión persistente.'),
                    createBoldBullet('Passkeys (WebAuthn/FIDO2): ', 'Autenticación sin contraseña mediante llaves de seguridad biométricas o de hardware. Implementado mediante Laravel Fortify con el trait PasskeyAuthenticatable. Permite registrar múltiples passkeys por usuario.'),
                    createBoldBullet('Autenticación de Dos Factores (2FA): ', 'Verificación adicional mediante códigos TOTP generados por aplicaciones autenticadoras (Google Authenticator, Authy, etc.). Incluye códigos de recuperación de emergencia. Implementado mediante TwoFactorAuthenticatable de Laravel Fortify.'),
                    createBoldBullet('Gestión de perfil: ', 'Edición de nombre y email, cambio de contraseña y eliminación de cuenta con confirmación.'),
                    createBoldBullet('Configuración de apariencia: ', 'Selector de tema claro/oscuro/sistema con persistencia automática mediante middleware HandleAppearance.'),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Modelo: app/Models/User.php — Con traits HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable.'),
                    createBullet('Middleware: app/Http/Middleware/EnsureAdmin.php — Verificación de rol administrador.'),
                    createBullet('Middleware: app/Http/Middleware/HandleAppearance.php — Persistencia de tema de apariencia.'),
                    createBullet('Policies: app/Policies/UserPolicy.php — Autorización de operaciones sobre usuarios.'),
                    createBullet('Páginas: resources/js/pages/auth/ — Login, Register, Forgot Password, Reset Password, Verify Email, Confirm Password.'),
                    createBullet('Páginas: resources/js/pages/settings/ — Profile, Password, Appearance.'),

                    createParagraph('Campos del modelo User:', { bold: true }),
                    createBullet('name, email, password (hashed), role (student/admin), status (active/inactive)'),
                    createBullet('student_code (único), department, semester'),
                    createBullet('cedula (único), birth_date, age, gender'),
                    createBullet('email_verified_at, last_mood_check_in'),
                    createBullet('two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at'),

                    emptyLine(),

                    // ---- RF-02 ----
                    createSubSubtitle('3.1.2 RF-02: Dashboard de Progreso del Estudiante'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-02', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Dashboard Analítico de Progreso Emocional en Tiempo Real', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Alta — Esencial', 75, { color: COLORS.RED, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createParagraph('El dashboard es la vista principal del estudiante tras iniciar sesión. Presenta un análisis analítico completo del progreso emocional del usuario calculado en tiempo real desde la base de datos:', { indent: true }),

                    createBoldBullet('Panel de bienvenida: ', 'Saludo personalizado con nombre del usuario, estado actual de riesgo con indicador visual codificado por colores (verde=Bajo/Estable, amarillo=Moderado, rojo=Alto/Crítico).'),
                    createBoldBullet('Indicadores KPI: ', 'Cuatro métricas principales en grid responsivo: Cuestionarios completados, Días activo (calculados como días únicos con actividad), Logros desbloqueados y Porcentaje de mejoría.'),
                    createBoldBullet('Historial de evaluaciones: ', 'Lista scrolleable de todas las evaluaciones completadas con tipo de cuestionario, título, fecha, puntaje y nivel de riesgo con badges de colores.'),
                    createBoldBullet('Gráfico de evolución emocional: ', 'Gráfico SVG dinámico de línea con puntos coloreados por tipo de cuestionario (rosa=GAD-7, ámbar=PHQ-9, teal=PSS-10, púrpura=Rosenberg) y leyenda interactiva.'),
                    createBoldBullet('Distribución de bienestar: ', 'Barra de progreso apilada con tres segmentos (Estable/teal, Moderado/sky, Crítico/rose) con porcentajes calculados dinámicamente.'),
                    createBoldBullet('Patrones detectados: ', 'Tres tarjetas de análisis contextual (Consistencia, Diario Emocional, Carga y Rendimiento) con mensajes adaptativos según el estado actual del usuario.'),
                    createBoldBullet('Logros y reconocimientos: ', 'Sistema de gamificación con 6 insignias (Primer Paso, Constancia, Dedicación, Experto, Maestro, Evolución Positiva) que se desbloquean progresivamente según la actividad del usuario.'),
                    createBoldBullet('Insights y recomendaciones: ', 'Cuatro tarjetas con recomendación principal, recurso sugerido, progreso progresivo y meta semanal con indicadores de eficacia.'),
                    createBoldBullet('Comparativa comunitaria: ', 'Barras de progreso que comparan la consistencia y mejoría del usuario con el promedio de la comunidad universitaria.'),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controlador: app/Http/Controllers/DashboardController.php'),
                    createBullet('Servicio: app/Services/WellnessAnalyticsService.php — studentSnapshot()'),
                    createBullet('Página: resources/js/pages/dashboard.tsx (421 líneas, 28KB)'),

                    createParagraph('Algoritmo de cálculo de mejoría:', { bold: true }),
                    createParagraph('La mejoría se calcula comparando el puntaje de la primera evaluación con la más reciente. Si el puntaje disminuye (para escalas negativas como PHQ-9), se calcula el porcentaje de reducción. Si no hay mejora calculable pero hay evaluaciones completadas, se asigna un baseline progresivo de 15% por evaluación (máximo 40%).', { indent: true }),

                    emptyLine(),

                    // ---- RF-03 ----
                    createSubSubtitle('3.1.3 RF-03: Módulo de Evaluaciones Psicométricas'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-03', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Evaluaciones Psicométricas con 8 Cuestionarios Clínicos Validados', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Alta — Esencial', 75, { color: COLORS.RED, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createParagraph('El módulo de evaluaciones permite al estudiante completar 8 cuestionarios psicométricos clínicos estandarizados. Cada cuestionario contiene preguntas con escalas Likert específicas y genera automáticamente una evaluación con puntaje, nivel de riesgo y resumen clínico:', { indent: true }),

                    createParagraph('Cuestionarios implementados:', { bold: true }),

                    createTable(
                        [
                            createTableHeaderCell('#', 5),
                            createTableHeaderCell('Cuestionario', 25),
                            createTableHeaderCell('Tipo', 10),
                            createTableHeaderCell('Ítems', 8),
                            createTableHeaderCell('Escala', 20),
                            createTableHeaderCell('Máx.', 8),
                            createTableHeaderCell('Naturaleza', 24),
                        ],
                        [
                            [createTableCell('1', 5), createTableCell('PHQ-9: Depresión', 25), createTableCell('PHQ-9', 10), createTableCell('9', 8), createTableCell('Frecuencia 0-3', 20), createTableCell('27', 8), createTableCell('Negativa (mayor=peor)', 24)],
                            [createTableCell('2', 5), createTableCell('GAD-7: Ansiedad', 25), createTableCell('GAD-7', 10), createTableCell('7', 8), createTableCell('Frecuencia 0-3', 20), createTableCell('21', 8), createTableCell('Negativa (mayor=peor)', 24)],
                            [createTableCell('3', 5), createTableCell('PSS-10: Estrés', 25), createTableCell('PSS-10', 10), createTableCell('10', 8), createTableCell('Frecuencia 0-4', 20), createTableCell('40', 8), createTableCell('Negativa (mayor=peor)', 24)],
                            [createTableCell('4', 5), createTableCell('Rosenberg: Autoestima', 25), createTableCell('Rosenberg', 10), createTableCell('10', 8), createTableCell('Acuerdo 1-4', 20), createTableCell('40', 8), createTableCell('Positiva (mayor=mejor)', 24)],
                            [createTableCell('5', 5), createTableCell('RYFF: Bienestar Psicológico', 25), createTableCell('RYFF', 10), createTableCell('6', 8), createTableCell('Acuerdo 1-4', 20), createTableCell('24', 8), createTableCell('Positiva (mayor=mejor)', 24)],
                            [createTableCell('6', 5), createTableCell('PSQI: Calidad del Sueño', 25), createTableCell('PSQI', 10), createTableCell('5', 8), createTableCell('Severidad 3-0', 20), createTableCell('15', 8), createTableCell('Negativa (mayor=peor)', 24)],
                            [createTableCell('7', 5), createTableCell('SWLS: Satisfacción con la Vida', 25), createTableCell('SWLS', 10), createTableCell('5', 8), createTableCell('Acuerdo 1-4', 20), createTableCell('20', 8), createTableCell('Positiva (mayor=mejor)', 24)],
                            [createTableCell('8', 5), createTableCell('MBI-SS: Burnout Académico', 25), createTableCell('MBI-SS', 10), createTableCell('6', 8), createTableCell('Frecuencia 0-3', 20), createTableCell('18', 8), createTableCell('Negativa (mayor=peor)', 24)],
                        ]
                    ),

                    emptyLine(),

                    createParagraph('Algoritmo de clasificación de riesgo:', { bold: true }),
                    createParagraph('Para escalas negativas (PHQ-9, GAD-7, PSS-10, PSQI, MBI-SS): puntaje ≤25% del máximo = Bajo, ≤50% = Moderado, ≤75% = Alto, >75% = Crítico. Para escalas positivas (Rosenberg, RYFF, SWLS): puntaje ≥75% = Bajo (saludable), ≥50% = Moderado, ≥30% = Alto, <30% = Crítico.', { indent: true }),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controlador: app/Http/Controllers/AssessmentController.php — index() y store()'),
                    createBullet('Servicio: app/Services/AssessmentService.php — resolveQuestionnaire(), createEvaluation(), classify()'),
                    createBullet('Modelos: Questionnaire, Question, Option, Evaluation, Response'),
                    createBullet('Seeder: database/seeders/WellnessPlatformSeeder.php — Carga los 8 cuestionarios con sus preguntas y opciones'),
                    createBullet('Página: resources/js/pages/assessments.tsx (17.8KB)'),
                    createBullet('Validación: type ∈ {PHQ-9, GAD-7, PSS-10, Rosenberg, RYFF, PSQI, SWLS, MBI-SS}, responses: required array'),

                    emptyLine(),

                    // ---- RF-04 ----
                    createSubSubtitle('3.1.4 RF-04: Diario Emocional'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-04', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Diario Emocional con CRUD Completo', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Alta — Esencial', 75, { color: COLORS.RED, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createParagraph('El diario emocional permite al estudiante registrar sus pensamientos, emociones y experiencias académicas de manera privada y confidencial:', { indent: true }),

                    createBoldBullet('Crear entrada: ', 'Formulario con título (máx. 120 caracteres), contenido (mín. 10 caracteres), estado de ánimo (emoji/texto: sereno, feliz, triste, ansioso, etc.) y puntuación del 1 al 10.'),
                    createBoldBullet('Leer entradas: ', 'Lista cronológica inversa de todas las entradas del usuario con visualización del título, ánimo, puntuación y fecha.'),
                    createBoldBullet('Actualizar entrada: ', 'Edición de título, contenido, ánimo y puntuación con validación. Protegido por JournalEntryPolicy (solo el propietario puede editar).'),
                    createBoldBullet('Eliminar entrada: ', 'Eliminación con confirmación. Protegido por JournalEntryPolicy (solo el propietario puede eliminar).'),

                    createParagraph('Modelo de datos (journal_entries):', { bold: true }),
                    createBullet('user_id (FK → users), title (string), content (text), mood (string, default: "sereno"), mood_score (integer 1-10, default: 5), is_private (boolean, default: true), timestamps'),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controlador: app/Http/Controllers/JournalController.php — index(), store(), update(), destroy()'),
                    createBullet('Servicio: app/Services/JournalService.php — forUser(), create(), update(), delete()'),
                    createBullet('Modelo: app/Models/JournalEntry.php'),
                    createBullet('Policy: app/Policies/JournalEntryPolicy.php — update(), delete()'),
                    createBullet('Página: resources/js/pages/journal.tsx (9KB)'),

                    emptyLine(),

                    // ---- RF-05 ----
                    createSubSubtitle('3.1.5 RF-05: Chat de Apoyo con Inteligencia Artificial'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-05', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Chat de Apoyo Emocional con IA — Triple Fallback', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Alta — Esencial', 75, { color: COLORS.RED, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createParagraph('El chat de apoyo proporciona acompañamiento conversacional empático 24/7 potenciado por inteligencia artificial con una arquitectura robusta de triple fallback:', { indent: true }),

                    createBoldBullet('Nivel 1 — DeepSeek API: ', 'Integración profesional con DeepSeek Chat (modelo deepseek-chat) mediante API compatible con OpenAI. Timeout de 10 segundos. Requiere DEEPSEEK_API_KEY en .env.'),
                    createBoldBullet('Nivel 2 — Google Gemini API: ', 'Fallback con Google Gemini 2.5 Flash mediante la API de Generative Language. Timeout de 8 segundos. Requiere GEMINI_API_KEY en .env.'),
                    createBoldBullet('Nivel 3 — Pollinations AI: ', 'Fallback público sin clave API mediante endpoint GET de text.pollinations.ai. Timeout de 12 segundos. Sin requisito de API key.'),
                    createBoldBullet('Nivel 4 — Respuestas Locales: ', 'Fallback estático local con respuestas contextualizadas por palabras clave (estrés/examen, ansiedad/nervios, tristeza/depresión, saludos, agradecimiento) con mensajes empáticos y específicos para la Universidad de Córdoba.'),

                    createParagraph('System Prompt configurado:', { bold: true }),
                    createParagraph('"Eres un psicólogo y consejero de salud mental sumamente empático, cálido, respetuoso y profesional de la Universidad de Córdoba, Colombia. Responde en español de forma cariñosa, clara y concisa (máximo 3 oraciones) para ayudar al estudiante a calmarse ante el estrés académico o la ansiedad. Nunca menciones que eres una IA, mantén siempre el rol de consejero universitario."', { indent: true, italics: true }),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controlador: app/Http/Controllers/ChatController.php (133 líneas) — index(), message(), getLocalResponse()'),
                    createBullet('Página: resources/js/pages/chat.tsx (9.7KB)'),
                    createBullet('Rutas: GET /chat, POST /chat/message'),

                    emptyLine(),

                    // ---- RF-06 ----
                    createSubSubtitle('3.1.6 RF-06: Módulo de Reportes y Analíticas'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-06', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Reportes y Analíticas Avanzadas de Evolución Emocional', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Media', 75, { color: COLORS.ORANGE, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createParagraph('El módulo de reportes presenta analíticas avanzadas del progreso emocional del estudiante con visualizaciones gráficas dinámicas:', { indent: true }),

                    createBullet('Snapshot completo de bienestar (wellness_score, risk_level, trend, evaluations_count, active_days, improvement).'),
                    createBullet('Historial cronológico de evaluaciones con tipo, puntaje, nivel, fecha y porcentaje de bienestar (wellness_pct).'),
                    createBullet('Gráficos SVG de evolución temporal con líneas y puntos coloreados por tipo de cuestionario.'),
                    createBullet('Distribución estadística de estados emocionales (positivo/neutro/difícil).'),
                    createBullet('Carga del listado completo de evaluaciones con su cuestionario asociado.'),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controlador: app/Http/Controllers/ReportController.php'),
                    createBullet('Servicio: app/Services/WellnessAnalyticsService.php (149 líneas, 6.3KB)'),
                    createBullet('Página: resources/js/pages/reports.tsx (23KB)'),

                    emptyLine(),

                    // ---- RF-07 ----
                    createSubSubtitle('3.1.7 RF-07: Retroalimentación del Estudiante'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-07', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Sistema de Retroalimentación Categorizada', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Media', 75, { color: COLORS.ORANGE, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createBullet('El estudiante puede enviar retroalimentación categorizada con categorías: sugerencia, error, mejora, otro.'),
                    createBullet('Cada feedback tiene un estado (pending/reviewed) y es asociado al usuario autenticado.'),
                    createBullet('El estudiante puede ver el historial de todos sus feedbacks enviados.'),
                    createBullet('Los administradores pueden revisar y marcar como revisado cada feedback desde el panel administrativo.'),
                    createBullet('Validación: category ∈ {sugerencia, error, mejora, otro}, message: string mín. 10 caracteres.'),

                    createParagraph('Modelo de datos (feedbacks):', { bold: true }),
                    createBullet('user_id (FK → users), category (string), message (text), status (default: pending), reviewed_by (FK nullable → users), reviewed_at (timestamp nullable)'),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controlador: app/Http/Controllers/FeedbackController.php — index(), store()'),
                    createBullet('Modelo: app/Models/Feedback.php — Relaciones: user(), reviewer()'),
                    createBullet('Policy: app/Policies/FeedbackPolicy.php'),
                    createBullet('Página: resources/js/pages/feedback.tsx (6KB)'),

                    emptyLine(),

                    // ---- RF-08 ----
                    createSubSubtitle('3.1.8 RF-08: Encuesta de Satisfacción'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-08', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Encuesta de Satisfacción Multidimensional', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Media', 75, { color: COLORS.ORANGE, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createBullet('El estudiante puede completar encuestas de satisfacción con 4 dimensiones evaluadas en escala 1-5.'),
                    createBullet('Dimensiones: overall_score, emotional_support_score, platform_clarity_score, academic_balance_score.'),
                    createBullet('Campo de comentarios opcionales en texto libre.'),
                    createBullet('Soporte para envío anónimo (anonymous: true por defecto, user_id nullable).'),
                    createBullet('Validación: Cada score debe ser integer entre 1 y 5.'),

                    createParagraph('Modelo de datos (satisfaction_surveys):', { bold: true }),
                    createBullet('user_id (FK nullable → users), overall_score (int 1-5), emotional_support_score (int 1-5), platform_clarity_score (int 1-5), academic_balance_score (int 1-5), comments (text nullable), anonymous (boolean default true)'),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controlador: app/Http/Controllers/SurveyController.php — index(), store()'),
                    createBullet('Modelo: app/Models/SatisfactionSurvey.php'),
                    createBullet('Página: resources/js/pages/surveys.tsx (5.9KB)'),

                    emptyLine(),

                    // ---- RF-09 ----
                    createSubSubtitle('3.1.9 RF-09: Recursos de Bienestar'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-09', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Biblioteca Interactiva de Recursos de Bienestar', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Alta — Esencial', 75, { color: COLORS.RED, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createParagraph('El módulo de recursos proporciona una biblioteca interactiva completa de herramientas de bienestar emocional con ejercicios prácticos funcionales, categorizados y filtrables. La página (57KB, 824 líneas) es la más extensa del proyecto y contiene 8+ recursos interactivos:', { indent: true }),

                    createBoldBullet('Respiración Cuadrada: ', 'Ejercicio interactivo con animación circular que guía visualmente las 4 fases (Inhala 4s → Mantén 4s → Exhala 4s → Retén 4s). Incluye timer con cuenta regresiva y botón play/stop. Etiquetado como "Recomendado".'),
                    createBoldBullet('Meditación Guiada: ', 'Sesión interactiva con 3 modalidades (Atención al Aliento 10min, Escaneo Corporal 15min, Calma Pre-parcial 5min). Incluye animación de respiración con ping/pulse, selector de pista y timer.'),
                    createBoldBullet('Técnica de Arraigo 5-4-3-2-1: ', 'Guía sensorial paso a paso interactiva con 5 pasos (5 cosas que VER, 4 que TOCAR, 3 que OÍR, 2 que OLER, 1 que PROBAR). Incluye iconos animados por sentido, navegación de pasos y textos descriptivos contextualizados.'),
                    createBoldBullet('Paisajes Sonoros: ', 'Reproductor de ambientes acústicos con 3 pistas (Lluvia en el Sinú, Noche en el Campus, Viento de las Sabanas). Incluye animación de ondas de audio reactivas, timer y selector de pista.'),
                    createBoldBullet('Respiración Diafragmática: ', 'Guía de 4 pasos con instrucciones detalladas para activación del diafragma y regulación del flujo de oxígeno.'),
                    createBoldBullet('Lectura Recomendada (El Poder del Ahora): ', 'Carrusel interactivo de 5 citas de Eckhart Tolle con botón de navegación "Siguiente cita". Incluye metadata de lectura (Español, ∞ tiempo, 4.5★).'),
                    createBoldBullet('Relajación Progresiva de Jacobson: ', 'Ejercicio guiado con 6 pasos de tensión/relajación muscular (Hombros, Puños, Rostro) con timers automáticos (5s tensión, 10s relajación). Incluye animación y transiciones automáticas entre pasos.'),
                    createBoldBullet('Diario de Gratitud: ', 'Espacio interactivo con 5 prompts rotativos de gratitud académica contextualizados para la Universidad de Córdoba. Incluye textarea para escritura y botón de copiar al portapapeles.'),

                    createParagraph('Sistema de filtrado por categorías:', { bold: true }),
                    createBullet('Todos los Recursos, Ejercicios Prácticos, Meditación, Manejo de Ansiedad, Videos Relajantes, Lectura Recomendada.'),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controlador: app/Http/Controllers/ResourceController.php — index()'),
                    createBullet('Página: resources/js/pages/resources.tsx (57KB, 824 líneas)'),

                    emptyLine(),

                    // ---- RF-10 ----
                    createSubSubtitle('3.1.10 RF-10: Panel de Administración'),

                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Identificador', 25, { bold: true }), createTableCell('RF-10', 75)],
                            [createTableCell('Nombre', 25, { bold: true }), createTableCell('Panel de Administración Completo', 75)],
                            [createTableCell('Prioridad', 25, { bold: true }), createTableCell('Alta — Esencial', 75, { color: COLORS.RED, bold: true })],
                            [createTableCell('Estado', 25, { bold: true }), createTableCell('✅ Implementado Completamente', 75, { color: COLORS.GREEN, bold: true })],
                        ]
                    ),

                    emptyLine(),
                    createParagraph('Descripción detallada:', { bold: true }),
                    createParagraph('Panel administrativo accesible exclusivamente para usuarios con rol "admin", protegido por middleware EnsureAdmin:', { indent: true }),

                    createBoldBullet('Dashboard administrativo: ', 'Métricas globales del sistema (total de estudiantes, evaluaciones realizadas, feedback pendientes, encuestas registradas).'),
                    createBoldBullet('Gestión de usuarios: ', 'Lista de todos los usuarios con acciones: cambiar estado (active/inactive), cambiar rol (student/admin), eliminar usuario.'),
                    createBoldBullet('Gestión de cuestionarios: ', 'Lista de cuestionarios con acciones: crear nuevo cuestionario (título, tipo, descripción, estado, minutos estimados), editar cuestionario existente, cambiar estado (draft/published).'),
                    createBoldBullet('Gestión de retroalimentaciones: ', 'Lista de todos los feedbacks con información del usuario, categoría y estado. Acción: marcar como revisado.'),

                    createParagraph('Rutas administrativas (prefijo /admin, middleware: auth + verified + admin):', { bold: true }),
                    createBullet('GET /admin/dashboard — Dashboard administrativo con métricas globales'),
                    createBullet('GET /admin/users — Lista de usuarios'),
                    createBullet('PATCH /admin/users/{userId}/status — Actualizar estado de usuario'),
                    createBullet('PATCH /admin/users/{userId}/role — Actualizar rol de usuario'),
                    createBullet('DELETE /admin/users/{userId} — Eliminar usuario'),
                    createBullet('GET /admin/questionnaires — Lista de cuestionarios'),
                    createBullet('POST /admin/questionnaires — Crear cuestionario'),
                    createBullet('PATCH /admin/questionnaires/{questionnaire} — Actualizar cuestionario'),
                    createBullet('GET /admin/feedbacks — Lista de retroalimentaciones'),
                    createBullet('POST /admin/feedbacks/{feedback}/review — Marcar feedback como revisado'),

                    createParagraph('Componentes implementados:', { bold: true }),
                    createBullet('Controladores: app/Http/Controllers/Admin/ — AdminDashboardController, AdminUsersController, AdminQuestionnairesController, AdminFeedbacksController'),
                    createBullet('Servicio: app/Services/AdminService.php — users(), updateUserStatus(), updateUserRole(), questionnaires(), createQuestionnaire(), updateQuestionnaire(), feedbacks(), markFeedbackReviewed()'),
                    createBullet('Servicio: app/Services/WellnessAnalyticsService.php — adminOverview()'),
                    createBullet('Middleware: app/Http/Middleware/EnsureAdmin.php — Verificación isAdmin()'),
                    createBullet('Página: resources/js/pages/admin/dashboard.tsx (3.9KB)'),

                    pageBreak(),

                    // 3.2 Requisitos No Funcionales
                    createSubtitle('3.2 Requisitos No Funcionales'),

                    // RNF-01
                    createSubSubtitle('3.2.1 RNF-01: Rendimiento'),
                    createBullet('El tiempo de carga inicial de la aplicación debe ser inferior a 3 segundos en conexiones de banda ancha estándar.'),
                    createBullet('Las respuestas del servidor a peticiones AJAX deben completarse en menos de 500ms para operaciones locales.'),
                    createBullet('Las respuestas del chat de IA tienen timeouts configurados: DeepSeek (10s), Gemini (8s), Pollinations (12s).'),
                    createBullet('Los gráficos SVG del dashboard se renderizan de forma instantánea sin dependencias de librerías externas de gráficos.'),
                    createBullet('El sistema utiliza Vite 8 para Hot Module Replacement (HMR) con tiempos de rebuild inferiores a 200ms en desarrollo.'),

                    // RNF-02
                    createSubSubtitle('3.2.2 RNF-02: Seguridad'),
                    createBullet('Todas las contraseñas se almacenan con hash bcrypt seguro y nunca se exponen en las respuestas del servidor.'),
                    createBullet('Los campos sensibles (password, two_factor_secret, two_factor_recovery_codes, remember_token) están marcados como Hidden en el modelo User.'),
                    createBullet('El sistema implementa protección CSRF en todas las peticiones POST/PATCH/DELETE.'),
                    createBullet('Las rutas administrativas están protegidas por triple middleware: auth + verified + admin.'),
                    createBullet('Las políticas de autorización (Policies) verifican la propiedad de recursos antes de permitir operaciones de modificación/eliminación.'),
                    createBullet('Soporte para autenticación de dos factores (2FA) con códigos TOTP y códigos de recuperación.'),
                    createBullet('Soporte para Passkeys (FIDO2/WebAuthn) como método de autenticación sin contraseña.'),
                    createBullet('Las conversaciones del chat de IA NO se almacenan en la base de datos, preservando la confidencialidad.'),
                    createBullet('Las encuestas de satisfacción pueden enviarse de forma anónima (user_id nullable).'),

                    // RNF-03
                    createSubSubtitle('3.2.3 RNF-03: Usabilidad'),
                    createBullet('Interfaz completamente responsiva con diseño adaptativo para móvil, tablet y escritorio mediante CSS Grid y Flexbox.'),
                    createBullet('Soporte completo para temas claro y oscuro con persistencia automática de preferencias.'),
                    createBullet('Toda la interfaz está en español de Colombia para la comunidad universitaria local.'),
                    createBullet('Diseño minimalista, geométrico y moderno con TailwindCSS 4, Radix UI y Lucide React Icons.'),
                    createBullet('Sistema de notificaciones toast mediante Sonner para feedback visual inmediato de las acciones del usuario.'),
                    createBullet('Navegación lateral (sidebar) consistente con menú colapsable y breadcrumbs contextuales.'),
                    createBullet('Animaciones suaves de entrada (fade-in, slide-in) para mejorar la experiencia de usuario.'),
                    createBullet('Los ejercicios de recursos son interactivos con feedback visual en tiempo real (animaciones, timers, transiciones).'),

                    // RNF-04
                    createSubSubtitle('3.2.4 RNF-04: Disponibilidad'),
                    createBullet('El sistema está diseñado para operar 24/7 con una disponibilidad objetivo del 99.5%.'),
                    createBullet('El chat de IA mantiene funcionalidad degradada (fallback local) incluso sin conectividad a internet.'),
                    createBullet('La base de datos SQLite local garantiza disponibilidad sin dependencia de servicios de base de datos externos.'),

                    // RNF-05
                    createSubSubtitle('3.2.5 RNF-05: Portabilidad'),
                    createBullet('Compatible con todos los navegadores web modernos (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+).'),
                    createBullet('Desplegable en cualquier servidor que soporte PHP 8.3+ (Laravel Herd, Valet, Homestead, Sail, Apache, Nginx).'),
                    createBullet('La aplicación puede ejecutarse en Windows, macOS y Linux sin modificaciones.'),
                    createBullet('El frontend es una SPA con soporte SSR opcional a través de Inertia.js.'),

                    // RNF-06
                    createSubSubtitle('3.2.6 RNF-06: Escalabilidad'),
                    createBullet('La arquitectura basada en servicios (Service Layer Pattern) permite escalar la lógica de negocio de forma independiente.'),
                    createBullet('El sistema de cuestionarios es extensible: se pueden agregar nuevos tipos de cuestionarios sin modificar el código del frontend.'),
                    createBullet('La base de datos puede migrarse a MySQL/PostgreSQL modificando únicamente la configuración .env sin cambios en el código.'),
                    createBullet('El chat de IA permite agregar nuevos proveedores de IA simplemente añadiendo nuevos bloques de fallback en el controlador.'),

                    emptyLine(),

                    // 3.3 Requisitos de Interfaces Externas
                    createSubtitle('3.3 Requisitos de Interfaces Externas'),

                    createSubSubtitle('3.3.1 Interfaces de Usuario'),
                    createBullet('Página de bienvenida (welcome.tsx): Landing page pública con hero section, preview del dashboard, información del proyecto, módulos de funcionalidad y footer institucional.'),
                    createBullet('Dashboard (dashboard.tsx): Panel principal del estudiante con todas las visualizaciones analíticas.'),
                    createBullet('Evaluaciones (assessments.tsx): Interfaz de selección y completado de cuestionarios con feedback inmediato.'),
                    createBullet('Diario (journal.tsx): Interfaz CRUD de entradas emocionales con editor de texto.'),
                    createBullet('Chat (chat.tsx): Interfaz conversacional de mensajería con el asistente de IA.'),
                    createBullet('Reportes (reports.tsx): Visualizaciones gráficas avanzadas de progreso emocional.'),
                    createBullet('Recursos (resources.tsx): Biblioteca interactiva de ejercicios de bienestar con 8+ herramientas.'),
                    createBullet('Retroalimentación (feedback.tsx): Formulario de envío y lista de feedbacks.'),
                    createBullet('Encuestas (surveys.tsx): Formulario de encuesta multidimensional.'),
                    createBullet('Configuración: Páginas de perfil, contraseña y apariencia.'),
                    createBullet('Admin: Dashboard administrativo, gestión de usuarios, cuestionarios y feedbacks.'),

                    createSubSubtitle('3.3.2 Interfaces de Software'),

                    createTable(
                        [
                            createTableHeaderCell('Componente', 25),
                            createTableHeaderCell('Tecnología', 25),
                            createTableHeaderCell('Versión', 15),
                            createTableHeaderCell('Propósito', 35),
                        ],
                        [
                            [createTableCell('Backend', 25), createTableCell('Laravel (PHP)', 25), createTableCell('13.x / 8.3', 15), createTableCell('Framework principal del servidor', 35)],
                            [createTableCell('Frontend', 25), createTableCell('React (TypeScript)', 25), createTableCell('19.x', 15), createTableCell('Biblioteca de UI con componentes', 35)],
                            [createTableCell('Adaptador SPA', 25), createTableCell('Inertia.js', 25), createTableCell('3.x', 15), createTableCell('Bridge monolítico sin API REST', 35)],
                            [createTableCell('Bundler', 25), createTableCell('Vite', 25), createTableCell('8.x', 15), createTableCell('Build tool con HMR', 35)],
                            [createTableCell('CSS', 25), createTableCell('TailwindCSS', 25), createTableCell('4.x', 15), createTableCell('Framework de utilidades CSS', 35)],
                            [createTableCell('UI Primitives', 25), createTableCell('Radix UI', 25), createTableCell('Latest', 15), createTableCell('Componentes accesibles headless', 35)],
                            [createTableCell('Icons', 25), createTableCell('Lucide React', 25), createTableCell('0.475', 15), createTableCell('Iconografía SVG consistente', 35)],
                            [createTableCell('Auth (2FA)', 25), createTableCell('Laravel Fortify', 25), createTableCell('1.37', 15), createTableCell('Autenticación, 2FA y Passkeys', 35)],
                            [createTableCell('Base de Datos', 25), createTableCell('SQLite', 25), createTableCell('3.x', 15), createTableCell('Almacenamiento persistente local', 35)],
                            [createTableCell('IA (Principal)', 25), createTableCell('DeepSeek API', 25), createTableCell('-', 15), createTableCell('Chat completion (modelo deepseek-chat)', 35)],
                            [createTableCell('IA (Fallback 1)', 25), createTableCell('Google Gemini', 25), createTableCell('2.5 Flash', 15), createTableCell('Generación de contenido conversacional', 35)],
                            [createTableCell('IA (Fallback 2)', 25), createTableCell('Pollinations AI', 25), createTableCell('-', 15), createTableCell('Endpoint público de texto sin API key', 35)],
                            [createTableCell('Notificaciones', 25), createTableCell('Sonner', 25), createTableCell('2.x', 15), createTableCell('Toast notifications', 35)],
                        ]
                    ),

                    emptyLine(),

                    createSubSubtitle('3.3.3 Interfaces de Comunicación'),
                    createBullet('Protocolo HTTP/HTTPS para todas las comunicaciones cliente-servidor.'),
                    createBullet('Inertia.js Protocol para comunicación SPA sin API REST tradicional (peticiones XHR con respuestas JSON/Inertia).'),
                    createBullet('APIs externas REST (DeepSeek, Gemini) con autenticación Bearer Token.'),
                    createBullet('API pública GET (Pollinations AI) con parámetros en URL path.'),
                    createBullet('Cookies de sesión con tokens CSRF para seguridad anti-forgery.'),

                    pageBreak(),

                    // ================================================================
                    // 4. ARQUITECTURA DEL SISTEMA
                    // ================================================================
                    createTitle('4. Arquitectura del Sistema'),

                    // 4.1 Stack Tecnológico
                    createSubtitle('4.1 Stack Tecnológico'),

                    createParagraph('El sistema utiliza una arquitectura monolítica moderna con separación de responsabilidades clara entre frontend y backend, unificada por Inertia.js como adaptador de comunicación:', { indent: true }),

                    createTable(
                        [createTableHeaderCell('Capa', 20), createTableHeaderCell('Tecnología', 30), createTableHeaderCell('Responsabilidad', 50)],
                        [
                            [createTableCell('Servidor', 20), createTableCell('PHP 8.3 + Laravel 13', 30), createTableCell('Routing, controladores, modelos Eloquent ORM, servicios, middleware, validación, migraciones, seeders', 50)],
                            [createTableCell('Frontend', 20), createTableCell('React 19 + TypeScript', 30), createTableCell('Componentes UI, páginas SPA, interactividad, gráficos SVG, animaciones, estados reactivos', 50)],
                            [createTableCell('Adaptador', 20), createTableCell('Inertia.js 3', 30), createTableCell('Bridge monolítico que elimina la necesidad de API REST. Renderiza páginas React directamente desde controladores Laravel', 50)],
                            [createTableCell('Estilos', 20), createTableCell('TailwindCSS 4 + Radix UI', 30), createTableCell('Utilidades CSS, diseño responsivo, temas claro/oscuro, componentes UI accesibles', 50)],
                            [createTableCell('Build', 20), createTableCell('Vite 8', 30), createTableCell('Bundling de assets, Hot Module Replacement, tree-shaking, code splitting', 50)],
                            [createTableCell('Base de Datos', 20), createTableCell('SQLite', 30), createTableCell('Almacenamiento persistente local sin servidor de BD externo', 50)],
                            [createTableCell('Autenticación', 20), createTableCell('Laravel Fortify', 30), createTableCell('Login, registro, verificación email, 2FA TOTP, Passkeys WebAuthn', 50)],
                            [createTableCell('IA', 20), createTableCell('DeepSeek + Gemini + Pollinations', 30), createTableCell('Chat conversacional empático con triple fallback para alta disponibilidad', 50)],
                        ]
                    ),

                    emptyLine(),

                    // 4.2 Modelo de Datos
                    createSubtitle('4.2 Modelo de Datos'),

                    createParagraph('El sistema implementa el siguiente esquema de base de datos relacional con 9 tablas principales:', { indent: true }),

                    createTable(
                        [createTableHeaderCell('Tabla', 20), createTableHeaderCell('Campos Principales', 50), createTableHeaderCell('Relaciones', 30)],
                        [
                            [createTableCell('users', 20), createTableCell('id, name, email, password, role, status, student_code, department, semester, cedula, birth_date, age, gender, last_mood_check_in, two_factor_*', 50), createTableCell('hasMany: evaluations, journalEntries, feedbacks, satisfactionSurveys, reports', 30)],
                            [createTableCell('questionnaires', 20), createTableCell('id, title, type, description, status, estimated_minutes, sort_order', 50), createTableCell('hasMany: questions, evaluations. Scope: published()', 30)],
                            [createTableCell('questions', 20), createTableCell('id, questionnaire_id, prompt, scale_label, sort_order', 50), createTableCell('belongsTo: questionnaire. hasMany: options', 30)],
                            [createTableCell('options', 20), createTableCell('id, question_id, label, score, sort_order', 50), createTableCell('belongsTo: question', 30)],
                            [createTableCell('evaluations', 20), createTableCell('id, user_id, questionnaire_id, score, level, summary, risk_flags (JSON), completed_at', 50), createTableCell('belongsTo: user, questionnaire. hasMany: responses', 30)],
                            [createTableCell('responses', 20), createTableCell('id, evaluation_id, question_id, option_id, value', 50), createTableCell('belongsTo: evaluation, question, option', 30)],
                            [createTableCell('journal_entries', 20), createTableCell('id, user_id, title, content, mood, mood_score, is_private', 50), createTableCell('belongsTo: user', 30)],
                            [createTableCell('feedbacks', 20), createTableCell('id, user_id, category, message, status, reviewed_by, reviewed_at', 50), createTableCell('belongsTo: user, reviewer', 30)],
                            [createTableCell('satisfaction_surveys', 20), createTableCell('id, user_id (nullable), overall_score, emotional_support_score, platform_clarity_score, academic_balance_score, comments, anonymous', 50), createTableCell('belongsTo: user (nullable)', 30)],
                        ]
                    ),

                    emptyLine(),

                    // 4.3 Patrones de Diseño
                    createSubtitle('4.3 Patrones de Diseño'),

                    createBoldBullet('Service Layer Pattern: ', 'Toda la lógica de negocio está encapsulada en servicios (AssessmentService, WellnessAnalyticsService, JournalService, AdminService) separados de los controladores para mantener responsabilidades únicas.'),
                    createBoldBullet('Repository Pattern (implícito): ', 'Eloquent ORM actúa como repositorio de datos con métodos de consulta encadenables y scopes personalizados.'),
                    createBoldBullet('Policy Pattern: ', 'Las autorizaciones de acceso a recursos están definidas en Policies (UserPolicy, JournalEntryPolicy, FeedbackPolicy).'),
                    createBoldBullet('Middleware Pattern: ', 'Funcionalidades transversales (autenticación, verificación, administración, apariencia) implementadas como middleware HTTP.'),
                    createBoldBullet('Inversion of Control (IoC): ', 'Inyección de dependencias automática de Laravel para servicios en controladores.'),
                    createBoldBullet('Component-Based Architecture: ', 'El frontend se organiza en componentes React reutilizables con Radix UI como base de primitivas accesibles.'),
                    createBoldBullet('Graceful Degradation: ', 'El chat de IA implementa triple fallback para garantizar funcionalidad incluso con servicios externos no disponibles.'),

                    // 4.4 Estructura del Proyecto
                    createSubtitle('4.4 Estructura del Proyecto'),

                    createParagraph('El proyecto sigue la estructura estándar de Laravel con las siguientes carpetas y archivos clave:', { indent: true }),

                    createBullet('app/Models/ — 10 modelos Eloquent (User, Evaluation, Questionnaire, Question, Option, Response, JournalEntry, Feedback, SatisfactionSurvey, Report)'),
                    createBullet('app/Http/Controllers/ — 9 controladores principales + 4 controladores admin'),
                    createBullet('app/Http/Middleware/ — EnsureAdmin, HandleAppearance, HandleInertiaRequests'),
                    createBullet('app/Services/ — 4 servicios de lógica de negocio (AssessmentService, WellnessAnalyticsService, JournalService, AdminService)'),
                    createBullet('app/Policies/ — 3 políticas de autorización (UserPolicy, JournalEntryPolicy, FeedbackPolicy)'),
                    createBullet('database/migrations/ — 7 migraciones (users, cache, jobs, passkeys, two_factor, wellness_platform, custom_fields)'),
                    createBullet('database/seeders/ — WellnessPlatformSeeder con los 8 cuestionarios clínicos completos'),
                    createBullet('resources/js/pages/ — 9 páginas principales + 3 admin + auth + settings'),
                    createBullet('resources/js/components/ — 28 componentes reutilizables + directorio ui/'),
                    createBullet('routes/web.php — 34 rutas definidas (16 estudiante + 10 admin + auth + settings)'),

                    pageBreak(),

                    // ================================================================
                    // 5. CASOS DE USO
                    // ================================================================
                    createTitle('5. Casos de Uso'),

                    createParagraph('A continuación se documentan los principales casos de uso del sistema implementado:', { indent: true }),

                    // CU-01
                    createSubtitle('CU-01: Registro e Inicio de Sesión'),
                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Actor', 25, { bold: true }), createTableCell('Estudiante (no autenticado)', 75)],
                            [createTableCell('Precondición', 25, { bold: true }), createTableCell('El usuario no tiene sesión activa en el sistema', 75)],
                            [createTableCell('Flujo Principal', 25, { bold: true }), createTableCell('1. El usuario accede a la página de bienvenida. 2. Selecciona "Registrarse" o "Iniciar sesión". 3. Completa el formulario con nombre, email y contraseña. 4. El sistema valida los datos, crea la cuenta con rol "student" y estado "active". 5. El usuario es redirigido al dashboard.', 75)],
                            [createTableCell('Flujo Alternativo', 25, { bold: true }), createTableCell('4a. Si el email ya existe, muestra error de validación. 4b. Si se configura 2FA, se solicita código TOTP. 4c. Si se usa Passkey, se activa WebAuthn.', 75)],
                            [createTableCell('Postcondición', 25, { bold: true }), createTableCell('El usuario tiene sesión activa y acceso al dashboard', 75)],
                        ]
                    ),

                    emptyLine(),

                    // CU-02
                    createSubtitle('CU-02: Completar Evaluación Psicométrica'),
                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Actor', 25, { bold: true }), createTableCell('Estudiante (autenticado)', 75)],
                            [createTableCell('Precondición', 25, { bold: true }), createTableCell('El estudiante ha iniciado sesión y tiene cuestionarios publicados disponibles', 75)],
                            [createTableCell('Flujo Principal', 25, { bold: true }), createTableCell('1. El estudiante navega a "Evaluaciones". 2. Selecciona un cuestionario de los 8 disponibles. 3. Responde cada pregunta seleccionando una opción de la escala Likert. 4. Envía las respuestas. 5. El sistema calcula el puntaje, clasifica el nivel de riesgo, genera un resumen y almacena la evaluación. 6. Se actualiza el dashboard con los nuevos datos.', 75)],
                            [createTableCell('Flujo Alternativo', 25, { bold: true }), createTableCell('3a. Si no responde todas las preguntas, se muestran validaciones. 5a. Para escalas positivas (Rosenberg, RYFF, SWLS), la clasificación se invierte.', 75)],
                            [createTableCell('Postcondición', 25, { bold: true }), createTableCell('La evaluación queda registrada y visible en dashboard, reportes e historial', 75)],
                        ]
                    ),

                    emptyLine(),

                    // CU-03
                    createSubtitle('CU-03: Usar el Chat de Apoyo IA'),
                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Actor', 25, { bold: true }), createTableCell('Estudiante (autenticado)', 75)],
                            [createTableCell('Precondición', 25, { bold: true }), createTableCell('El estudiante ha iniciado sesión', 75)],
                            [createTableCell('Flujo Principal', 25, { bold: true }), createTableCell('1. El estudiante navega a "Chat de Apoyo". 2. Escribe un mensaje en el campo de texto. 3. El sistema envía el mensaje a DeepSeek API con el system prompt de consejero. 4. Si DeepSeek responde exitosamente, se muestra la respuesta. 5. El estudiante puede continuar la conversación.', 75)],
                            [createTableCell('Flujo Alternativo', 25, { bold: true }), createTableCell('4a. Si DeepSeek falla, intenta con Gemini API. 4b. Si Gemini falla, intenta con Pollinations AI. 4c. Si todos fallan, se genera una respuesta local contextualizada por palabras clave.', 75)],
                            [createTableCell('Postcondición', 25, { bold: true }), createTableCell('El estudiante recibe acompañamiento empático. Las conversaciones NO se almacenan.', 75)],
                        ]
                    ),

                    emptyLine(),

                    // CU-04
                    createSubtitle('CU-04: Administrar Usuarios'),
                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Actor', 25, { bold: true }), createTableCell('Administrador (rol admin)', 75)],
                            [createTableCell('Precondición', 25, { bold: true }), createTableCell('El administrador ha iniciado sesión con rol admin', 75)],
                            [createTableCell('Flujo Principal', 25, { bold: true }), createTableCell('1. El administrador navega a "Admin > Usuarios". 2. Visualiza la lista de todos los usuarios. 3. Puede cambiar el estado (active/inactive), cambiar el rol (student/admin) o eliminar un usuario. 4. El sistema actualiza los datos y muestra confirmación.', 75)],
                            [createTableCell('Flujo Alternativo', 25, { bold: true }), createTableCell('3a. Si un usuario no admin intenta acceder, recibe error 403 "Acceso restringido".', 75)],
                            [createTableCell('Postcondición', 25, { bold: true }), createTableCell('Los cambios de usuario se aplican inmediatamente', 75)],
                        ]
                    ),

                    emptyLine(),

                    // CU-05
                    createSubtitle('CU-05: Usar Recursos de Bienestar'),
                    createTable(
                        [createTableHeaderCell('Campo', 25), createTableHeaderCell('Descripción', 75)],
                        [
                            [createTableCell('Actor', 25, { bold: true }), createTableCell('Estudiante (autenticado)', 75)],
                            [createTableCell('Precondición', 25, { bold: true }), createTableCell('El estudiante ha iniciado sesión', 75)],
                            [createTableCell('Flujo Principal', 25, { bold: true }), createTableCell('1. El estudiante navega a "Recursos". 2. Filtra por categoría (Ejercicios Prácticos, Meditación, Manejo de Ansiedad, etc.). 3. Selecciona un recurso e inicia la práctica interactiva (ej: Respiración Cuadrada). 4. Sigue las instrucciones visuales y el timer. 5. Finaliza la práctica y puede repetir o cambiar de recurso.', 75)],
                            [createTableCell('Postcondición', 25, { bold: true }), createTableCell('El estudiante ha practicado un ejercicio de regulación emocional', 75)],
                        ]
                    ),

                    pageBreak(),

                    // ================================================================
                    // 6. MATRIZ DE TRAZABILIDAD
                    // ================================================================
                    createTitle('6. Matriz de Trazabilidad'),

                    createParagraph('La siguiente matriz relaciona cada requisito funcional con los componentes implementados que lo satisfacen:', { indent: true }),

                    createTable(
                        [
                            createTableHeaderCell('Requisito', 10),
                            createTableHeaderCell('Controlador', 22),
                            createTableHeaderCell('Modelo(s)', 20),
                            createTableHeaderCell('Servicio', 20),
                            createTableHeaderCell('Página Frontend', 18),
                            createTableHeaderCell('Estado', 10),
                        ],
                        [
                            [createTableCell('RF-01', 10), createTableCell('Auth (Fortify)', 22), createTableCell('User', 20), createTableCell('-', 20), createTableCell('auth/*, settings/*', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-02', 10), createTableCell('DashboardController', 22), createTableCell('User, Evaluation', 20), createTableCell('WellnessAnalyticsService', 20), createTableCell('dashboard.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-03', 10), createTableCell('AssessmentController', 22), createTableCell('Questionnaire, Question, Option, Evaluation, Response', 20), createTableCell('AssessmentService', 20), createTableCell('assessments.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-04', 10), createTableCell('JournalController', 22), createTableCell('JournalEntry', 20), createTableCell('JournalService', 20), createTableCell('journal.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-05', 10), createTableCell('ChatController', 22), createTableCell('-', 20), createTableCell('- (inline)', 20), createTableCell('chat.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-06', 10), createTableCell('ReportController', 22), createTableCell('Evaluation, Questionnaire', 20), createTableCell('WellnessAnalyticsService', 20), createTableCell('reports.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-07', 10), createTableCell('FeedbackController', 22), createTableCell('Feedback', 20), createTableCell('-', 20), createTableCell('feedback.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-08', 10), createTableCell('SurveyController', 22), createTableCell('SatisfactionSurvey', 20), createTableCell('-', 20), createTableCell('surveys.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-09', 10), createTableCell('ResourceController', 22), createTableCell('-', 20), createTableCell('-', 20), createTableCell('resources.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                            [createTableCell('RF-10', 10), createTableCell('Admin/*Controller', 22), createTableCell('User, Questionnaire, Feedback', 20), createTableCell('AdminService, WellnessAnalyticsService', 20), createTableCell('admin/*.tsx', 18), createTableCell('✅', 10, { color: COLORS.GREEN })],
                        ]
                    ),

                    pageBreak(),

                    // ================================================================
                    // 7. APÉNDICES
                    // ================================================================
                    createTitle('7. Apéndices'),

                    createSubtitle('7.1 Variables de Entorno Requeridas'),

                    createTable(
                        [createTableHeaderCell('Variable', 30), createTableHeaderCell('Descripción', 40), createTableHeaderCell('Requerida', 15), createTableHeaderCell('Default', 15)],
                        [
                            [createTableCell('APP_NAME', 30), createTableCell('Nombre de la aplicación', 40), createTableCell('Sí', 15), createTableCell('ERS Bienestar', 15)],
                            [createTableCell('APP_URL', 30), createTableCell('URL base de la aplicación', 40), createTableCell('Sí', 15), createTableCell('http://localhost', 15)],
                            [createTableCell('DB_CONNECTION', 30), createTableCell('Driver de base de datos', 40), createTableCell('Sí', 15), createTableCell('sqlite', 15)],
                            [createTableCell('DEEPSEEK_API_KEY', 30), createTableCell('Clave API para DeepSeek Chat', 40), createTableCell('Opcional', 15), createTableCell('-', 15)],
                            [createTableCell('GEMINI_API_KEY', 30), createTableCell('Clave API para Google Gemini', 40), createTableCell('Opcional', 15), createTableCell('-', 15)],
                        ]
                    ),

                    emptyLine(),

                    createSubtitle('7.2 Comandos de Instalación y Ejecución'),

                    createParagraph('Para instalar y ejecutar el proyecto:', { bold: true }),
                    createBullet('composer install — Instalar dependencias PHP de Laravel'),
                    createBullet('npm install — Instalar dependencias JavaScript/TypeScript'),
                    createBullet('cp .env.example .env — Copiar archivo de configuración'),
                    createBullet('php artisan key:generate — Generar clave de aplicación'),
                    createBullet('php artisan migrate — Ejecutar migraciones de base de datos'),
                    createBullet('php artisan db:seed --class=WellnessPlatformSeeder — Cargar los 8 cuestionarios clínicos'),
                    createBullet('npm run dev — Iniciar servidor de desarrollo Vite con HMR'),
                    createBullet('php artisan serve — Iniciar servidor PHP local'),
                    createBullet('O usar: composer dev — Para iniciar todos los servicios concurrentemente'),

                    emptyLine(),

                    createSubtitle('7.3 Historial de Cambios del Documento'),

                    createTable(
                        [createTableHeaderCell('Versión', 15), createTableHeaderCell('Fecha', 20), createTableHeaderCell('Descripción', 65)],
                        [
                            [createTableCell('1.0', 15), createTableCell('Mayo 2026', 20), createTableCell('Versión inicial del documento ERS con requisitos preliminares', 65)],
                            [createTableCell('2.0', 15), createTableCell('Mayo 2026', 20), createTableCell('Actualización completa con TODOS los cambios implementados en el proyecto final: 8 cuestionarios clínicos, chat IA con triple fallback, recursos interactivos, panel admin, dashboard analítico, gamificación, 2FA, Passkeys, temas claro/oscuro', 65)],
                        ]
                    ),

                    emptyLine(), emptyLine(),

                    // Pie de documento
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 600 },
                        border: {
                            top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.PRIMARY },
                        },
                        children: [],
                    }),

                    emptyLine(),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: '© 2026 Universidad de Córdoba — Programa de Ingeniería de Sistemas y Telecomunicaciones',
                                font: FONT.BODY,
                                size: 18,
                                color: COLORS.LIGHT_GRAY,
                                italics: true,
                            }),
                        ],
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 },
                        children: [
                            new TextRun({
                                text: 'Documento generado automáticamente — ERS Bienestar v2.0',
                                font: FONT.BODY,
                                size: 18,
                                color: COLORS.LIGHT_GRAY,
                                italics: true,
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    return doc;
}

// ============================================================================
// EJECUCIÓN PRINCIPAL
// ============================================================================
async function main() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║   GENERADOR DE DOCUMENTO ERS - Universidad de Córdoba      ║');
    console.log('║   Plataforma de Bienestar Emocional Estudiantil            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('⏳ Generando documento Word...');

    const doc = generateDocument();
    const buffer = await Packer.toBuffer(doc);

    const outputPath = 'ERS_Estudiante_Actualizado.docx';
    fs.writeFileSync(outputPath, buffer);

    console.log('');
    console.log(`✅ Documento generado exitosamente: ${outputPath}`);
    console.log(`📄 Tamaño: ${(buffer.length / 1024).toFixed(1)} KB`);
    console.log('');
    console.log('Contenido del documento:');
    console.log('  📌 Portada institucional completa');
    console.log('  📌 Tabla de contenido');
    console.log('  📌 1. Introducción (propósito, ámbito, definiciones, referencias)');
    console.log('  📌 2. Descripción General (perspectiva, funciones, usuarios, restricciones)');
    console.log('  📌 3. Requisitos Específicos (10 RF + 6 RNF + interfaces)');
    console.log('  📌 4. Arquitectura del Sistema (stack, modelo de datos, patrones)');
    console.log('  📌 5. Casos de Uso (5 casos de uso principales)');
    console.log('  📌 6. Matriz de Trazabilidad');
    console.log('  📌 7. Apéndices (variables de entorno, comandos, historial)');
}

main().catch(console.error);
