# Sección 3 y 4: Implementación y Pruebas Unitarias del Sistema ERS Estudiante

Este documento constituye la documentación formal de la **Sección 3 (Implementación)** y la **Sección 4 (Pruebas Unitarias)** del sistema **ERS Estudiante (Portal de Bienestar ERS Estudiante)**, siguiendo rigurosamente las pautas, estructuras de tablas de casos de prueba y análisis de riesgos del modelo de guía docente.

---

## 3. Implementación

La implementación física de la plataforma **ERS Estudiante** se ha llevado a cabo dividiendo la arquitectura en dos capas principales: una interfaz reactiva e interactiva de usuario en el frontend, y un motor lógico transaccional seguro en el backend, interconectados fluidamente mediante **Inertia.js** para emular el comportamiento de una Single Page Application (SPA).

### 3.1 HERRAMIENTAS EN EL FRONTEND PARA LA IMPLEMENTACIÓN

Las principales herramientas utilizadas en el Frontend (React Js + TypeScript) son las siguientes:

*   **React (react, react-dom)**
    *   *Descripción:* Biblioteca de JavaScript para construir interfaces de usuario a través de componentes reactivos y totalmente reutilizables.
    *   *Uso:* Gestión completa del DOM virtual, renderizado de componentes interactivos y control de los estados visuales en el cliente web.
*   **Inertia.js React Adapter (@inertiajs/react)**
    *   *Descripción:* Conector y enrutador dinámico que permite construir SPAs con React utilizando el enrutamiento y los controladores de Laravel en el backend.
    *   *Uso:* Manejo fluido de las rutas y paso transparente de propiedades desde los controladores de Laravel hacia los componentes React sin crear APIs REST complejas.
*   **TailwindCSS (tailwindcss, @tailwindcss/vite)**
    *   *Descripción:* Framework CSS estructurado en clases de utilidad de bajo nivel diseñado para maquetación rápida y moderna.
    *   *Uso:* Estilización completa de la plataforma, diseño responsivo, soporte nativo de Modo Oscuro (Dark Mode) y transiciones fluidas.
*   **Radix UI (Primitives)**
    *   *Descripción:* Conjunto de componentes interactivos sin estilos (*headless*) optimizados para accesibilidad (WAI-ARIA).
    *   *Uso:* Implementación segura de elementos complejos del UI como diálogos de confirmación, menús desplegables (dropdowns), tooltips y barras de navegación adaptables.
*   **Lucide React (lucide-react)**
    *   *Descripción:* Set de iconos vectoriales modernos y minimalistas diseñados específicamente para React.
    *   *Uso:* Provisión de iconografía interactiva de alta definición para guiar la experiencia del estudiante en el menú, diario y evaluaciones.
*   **Sonner (sonner)**
    *   *Descripción:* Biblioteca ligera de notificaciones (*toasts*) altamente estilizadas y animadas.
    *   *Uso:* Despliegue de avisos instantáneos de éxito, alerta o error en pantalla tras guardar entradas de diario, registrarse o enviar feedback.
*   **Input OTP (input-otp)**
    *   *Descripción:* Componente React especializado en la entrada guiada de códigos de un solo uso (One-Time Password).
    *   *Uso:* Captura intuitiva de códigos numéricos para el Doble Factor de Autenticación (2FA).
*   **Laravel Passkeys (@laravel/passkeys)**
    *   *Descripción:* SDK frontend para interactuar con las APIs de WebAuthn y credenciales criptográficas del sistema operativo.
    *   *Uso:* Habilitación del registro e inicio de sesión seguro biométrico (huella dactilar, FaceID) o llaves de hardware.
*   **Docx (docx)**
    *   *Descripción:* Biblioteca que permite generar y estructurar dinámicamente archivos `.docx` de Microsoft Word utilizando JavaScript/TypeScript.
    *   *Uso:* Herramienta de compilación para la exportación de documentos normativos de la plataforma de forma estructurada.

---

### 3.2 HERRAMIENTAS EN EL BACKEND PARA LA IMPLEMENTACIÓN

Las principales herramientas utilizadas en el Backend (Laravel + PHP) son las siguientes:

*   **Laravel Framework (laravel/framework)**
    *   *Descripción:* Framework de desarrollo web en PHP elegante, robusto y escalable, que implementa el patrón MVC.
    *   *Uso:* Núcleo lógico del servidor, gestión del motor ORM Eloquent, migraciones de base de datos, enrutamiento seguro y middlewares de control.
*   **Laravel Fortify (laravel/fortify)**
    *   *Descripción:* Backend de autenticación agnóstico de vistas que provee de forma nativa flujos de registro, inicio de sesión seguro, autenticación de dos factores (2FA), restablecimiento de contraseñas y verificación de email.
    *   *Uso:* Robustecer la seguridad de la cuenta del estudiante y docente, evitando vulnerabilidades OWASP comunes en accesos y sesiones.
*   **Inertia Laravel Server (@inertiajs/inertia-laravel)**
    *   *Descripción:* Adaptador del servidor Laravel para Inertia.js.
    *   *Uso:* Intercepta las respuestas HTTP convirtiéndolas en cargas JSON estructuradas destinadas a ser montadas por el frontend de React.
*   **PHPUnit (phpunit/phpunit)**
    *   *Descripción:* Framework de testing orientado a objetos diseñado específicamente para automatizar la ejecución de pruebas unitarias en PHP.
    *   *Uso:* Ejecución de pruebas unitarias y de integración sobre los módulos de autenticación, perfiles y base de datos de la plataforma.
*   **SQLite (driver relacional)**
    *   *Descripción:* Motor de base de datos relacional ligero basado en archivos locales.
    *   *Uso:* Base de datos de alta velocidad en memoria configurada exclusivamente para el entorno de pruebas automatizadas y desarrollo ágil.

---

## 4. PRUEBAS UNITARIAS DEL SISTEMA ERS ESTUDIANTE

En este apartado del proyecto se documentan formalmente las pruebas funcionales y de integración realizadas al software **ERS Estudiante** para asegurar su correcto comportamiento lógico, transaccional y de seguridad.

### 4.1 PLAN DE PRUEBAS UNITARIAS

*   **Preparado por:** Juan Esteban Peña Durango y Gustavo Adolfo Padilla Ruiz
*   **Dirigido a:** Departamento de Ingeniería de Sistemas y Oficinas de Bienestar Universitario
*   **Fecha de Planificación:** 24 de Mayo de 2026

#### **Introducción**
El plan de prueba está diseñado como una línea de base para identificar lo que se considera dentro y fuera del alcance de las pruebas lógicas y funcionales del sistema ERS Estudiante, así como para documentar de forma clara los supuestos del desarrollo, la infraestructura de ejecución y la matriz de mitigación de riesgos bajo la metodología *Agile Testing*.

#### **Recursos**

##### **Tabla 1. Testers del software**
| Tester | % Participación |
| :--- | :---: |
| Juan Esteban Peña Durango | 50% |
| Gustavo Adolfo Padilla Ruiz | 50% |

#### **Alcance**
Las pruebas incluyen las funcionalidades críticas y de alto riesgo del software (Registro de información, flujo transaccional de autenticación segura, control estricto de roles de acceso, cálculo psicométrico de evaluaciones Likert, creación de bitácoras en el diario emocional y canalización de retroalimentación). Se incluyen pruebas de aceptación y verificación de coherencia de interfaces responsivas.

#### **Fuera de alcance**
Las pruebas funcionales a los servicios externos integrados (como la API externa de Inteligencia Artificial para el chatbot emocional) y la validación de módulos experimentales no incluidos en la ruta crítica del proyecto académico.

#### **Pruebas de rendimiento**
Los detalles específicos sobre tiempos de carga de recursos concurrentes e inyección de estrés se describen en el documento anexo *Plan de Pruebas de Rendimiento de ERS Estudiante*.

#### **Infraestructura**
El ambiente necesario para la realización y ejecución de las pruebas está compuesto por:
*   **Del lado del cliente:** Requiere un equipo de cómputo o dispositivo móvil con conexión estable a Internet y acceso a navegadores web modernos (Opera GX, Chrome, Safari, Edge).
*   **Del lado del servidor:** Servidor de desarrollo servido localmente por Vite (React) en el puerto `http://localhost:5173` y servidor de backend provisto por Laravel Artisan en `http://127.0.0.1:8000`, montado sobre base de datos en memoria para la ejecución de pruebas.

#### **Suposiciones**
1. Los módulos unitarios han sido debidamente probados localmente por el equipo de desarrollo antes de la consolidación de la entrega del sistema.
2. La base de datos es restaurada a un estado limpio entre la ejecución de cada prueba para evitar colisiones de datos.

#### **Análisis y Mitigación de Riesgos**

##### **Tabla 2. Matriz de riesgos en pruebas (Basada en Agile Testing de Lisa Crispin y Janet Gregory)**
| No. | Riesgos | Probabilidad (1-5) | Impacto (1-5) | Severidad (Prob*Imp) | Plan de Mitigación |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | Retrasos en la implementación de las funcionalidades de bienestar en el frontend. | 2 | 5 | **10** | Evaluar semanalmente el avance del desarrollo mediante revisiones de sprints y re-planificar el alcance ágilmente. |
| **2** | Incongruencia en el cálculo automático de puntuaciones Likert en las evaluaciones de los estudiantes. | 2 | 4 | **8** | Implementar pruebas automatizadas unitarias en PHPUnit específicas que simulen cuestionarios con respuestas límite. |
| **3** | Falla en las restricciones de seguridad permitiendo acceso de estudiantes a paneles de administración. | 1 | 5 | **5** | Implementar middlewares estrictos (`admin`) y verificar en las pruebas unitarias que accesos sin privilegios arrojen redirecciones inmediatas. |
| **4** | Falta de disponibilidad de usuarios reales para la realización de las pruebas de aceptación (UAT). | 2 | 3 | **6** | Coordinar con anticipación con el equipo de Bienestar Universitario para convocar un grupo focal de estudiantes y docentes de prueba. |

---

### 4.2 DESARROLLO DE LAS PRUEBAS

La fase de pruebas del sistema **ERS Estudiante** se divide formalmente en dos grandes capas: pruebas en el Frontend e Integración de Interfaz de Usuario, y pruebas lógicas y de consistencia en el Backend mediante suites de código.

#### 4.2.1 PRUEBAS EN EL FRONTEND Y FLUJOS OPERACIONALES

Las pruebas de caja negra han sido ejecutadas por módulo, cubriendo los puntos críticos de las funcionalidades del sistema. Las pruebas se ejecutaron en un computador con conexión a internet en el **S.O. Windows 11**, Navegador **Opera GX V(core: 109.0.5097.70)**, procesador **Intel Core(TM) i5-13600F CPU 4.6GHz Max Boost**, **GPU Nvidia Geforce RTX 4060**. Se utilizó el servidor de desarrollo servido por Vite + React y el servidor backend local de Laravel.

---

##### **CP001: Registrar Usuario**

###### **Tabla 3. Caso de prueba registrar usuario**
| Caso de Prueba: Registrar Usuario | |
| :--- | :--- |
| **ID:** | CP001 |
| **Nombre:** | Registrar usuario |
| **Versión:** | 1.0 |
| **Módulo:** | Auth (Autenticación y Seguridad) |
| **Objetivo:** | Crear una cuenta activa en la plataforma de bienestar para un estudiante o docente. |
| **Datos de prueba:** | `data = { "cedula": "1002938122", "name": "Juan Perez", "email": "juanperez@mail.com", "password": "password", "birth_date": "2002-05-15", "gender": "Masculino", "role": "student", "department": "Ingeniería de Sistemas", "semester": "6" }` |
| **Pasos:** | **Resultado Esperado:** |
| 1. Abrir navegador web y acceder a la URL `/register`. | Se visualiza correctamente la vista del formulario de registro. |
| 2. Seleccionar el rol de "Estudiante" en el selector interactivo. | La interfaz despliega dinámicamente el selector para el "Semestre". |
| 3. Ingresar la fecha de nacimiento en el selector. | El frontend calcula y muestra en pantalla de inmediato la edad estimada. |
| 4. Completar todos los datos requeridos e ingresar contraseñas correctas. | Todos los campos quedan rellenados sin advertencias del cliente. |
| 5. Hacer clic en el botón "Crear cuenta". | Visualizar notificación toast de éxito, inicio automático de sesión y redirección. |
| 6. Intentar registrar un usuario con una cédula o correo ya existente. | El sistema detiene el envío y muestra mensajes de error bajo los inputs. |

---

##### **CP002: Iniciar Sesión**

###### **Tabla 4. Caso de prueba iniciar sesión**
| Caso de Prueba: Iniciar Sesión | |
| :--- | :--- |
| **ID:** | CP002 |
| **Nombre:** | Iniciar sesión |
| **Versión:** | 1.0 |
| **Módulo:** | Auth (Autenticación y Seguridad) |
| **Objetivo:** | Autenticar a un usuario registrado en el sistema para permitir el ingreso a las vistas privadas. |
| **Datos de prueba:** | `data = { "email": "juanperez@mail.com", "password": "password" }` |
| **Pasos:** | **Resultado Esperado:** |
| 1. Abrir navegador web y acceder a la URL `/login`. | Visualizar la página con los campos de correo, clave y el botón Passkey. |
| 2. Ingresar las credenciales registradas. | Los datos se rellenan adecuadamente en los campos del formulario. |
| 3. Hacer clic en el botón "Iniciar sesión". | Visualizar notificación toast de inicio de sesión exitoso y acceso al Dashboard. |
| 4. Ingresar credenciales inválidas (email o clave incorrectos). | Visualizar notificación de error y limpieza del campo de contraseña. |

---

##### **CP003: Registrar Entrada en Diario Emocional**

###### **Tabla 5. Caso de prueba registrar entrada en diario**
| Caso de Prueba: Registrar Entrada en Diario | |
| :--- | :--- |
| **ID:** | CP003 |
| **Nombre:** | Registrar entrada en diario |
| **Versión:** | 1.0 |
| **Módulo:** | Diario (Journal) |
| **Objetivo:** | Registrar el estado emocional, puntuación de ánimo y notas de un estudiante. |
| **Datos de prueba:** | `data = { "title": "Estresado por parciales", "mood": "Ansioso", "mood_score": 7, "content": "Tengo acumuladas entregas de desarrollo web...", "is_private": true }` |
| **Pasos:** | **Resultado Esperado:** |
| 1. Acceder al módulo "Diario Emocional" en la barra de navegación del estudiante. | Se visualiza el formulario de bitácora y la línea de tiempo de notas previas. |
| 2. Rellenar los campos de Título y Contenido de la nota. | Entrada de texto correcta sin restricciones. |
| 3. Seleccionar el estado emocional "Ansioso" y regular la escala de intensidad a 7. | Selector visual se actualiza y la barra de rango muestra la puntuación 7. |
| 4. Hacer clic en "Guardar Entrada". | Mensaje flotante de guardado exitoso y adición inmediata a la línea de tiempo. |

---

##### **CP004: Resolver Test de Bienestar Psicológico**

###### **Tabla 6. Caso de prueba resolver test de bienestar**
| Caso de Prueba: Resolver Test de Bienestar | |
| :--- | :--- |
| **ID:** | CP004 |
| **Nombre:** | Resolver test de bienestar |
| **Versión:** | 1.0 |
| **Módulo:** | Evaluaciones (Assessments) |
| **Objetivo:** | Completar un cuestionario interactivo de bienestar mental y recibir interpretación clínica. |
| **Datos de prueba:** | `data = { "questionnaire_id": 1, "answers": [ { "question_id": 1, "option_id": 3, "value": 3 }, { "question_id": 2, "option_id": 4, "value": 4 } ] }` |
| **Pasos:** | **Resultado Esperado:** |
| 1. Navegar a la pestaña de "Evaluaciones" y pulsar "Iniciar Test" en un cuestionario activo. | Se despliega la interfaz interactiva con las preguntas Likert del test. |
| 2. Contestar todas las preguntas obligatorias seleccionando las opciones. | Las preguntas marcadas registran adecuadamente los puntajes de las opciones. |
| 3. Hacer clic en "Finalizar y Evaluar". | El backend calcula el total y se visualiza la pantalla del Diagnóstico Resultante. |
| 4. Intentar enviar el cuestionario con preguntas sin responder. | El sistema impide el envío y resalta visualmente las preguntas faltantes. |

---

##### **CP005: Enviar Sugerencia al Buzón**

###### **Tabla 7. Caso de prueba enviar sugerencia al buzón**
| Caso de Prueba: Enviar Sugerencia al Buzón | |
| :--- | :--- |
| **ID:** | CP005 |
| **Nombre:** | Enviar sugerencia al buzón |
| **Versión:** | 1.0 |
| **Módulo:** | Feedback (Retroalimentación) |
| **Objetivo:** | Enviar sugerencias o quejas sobre el bienestar universitario a la coordinación de psicología. |
| **Datos de prueba:** | `data = { "category": "Atención Psicológica", "message": "Sería de gran utilidad aumentar los horarios de citas presenciales..." }` |
| **Pasos:** | **Resultado Esperado:** |
| 1. Acceder al menú "Contacto / Buzón" en la plataforma. | Se despliega el formulario con los campos de Categoría y Mensaje. |
| 2. Seleccionar la categoría "Atención Psicológica" e ingresar el texto de sugerencia. | Datos ingresados correctamente. |
| 3. Hacer clic en el botón "Enviar Sugerencia". | Se almacena en la tabla feedbacks del backend y se muestra mensaje de confirmación. |

---

##### **CP006: Iniciar Conversación con IA**

###### **Tabla 8. Caso de prueba iniciar conversación con IA**
| Caso de Prueba: Iniciar Conversación con IA | |
| :--- | :--- |
| **ID:** | CP006 |
| **Nombre:** | Iniciar conversación con IA |
| **Versión:** | 1.0 |
| **Módulo:** | Chat (Asistente Emocional) |
| **Objetivo:** | Mantener un diálogo interactivo con el bot de IA para contención emocional. |
| **Datos de prueba:** | `data = { "message": "Me siento muy agobiado por el exceso de tareas este semestre." }` |
| **Pasos:** | **Resultado Esperado:** |
| 1. Entrar al módulo de "Chat de Apoyo" en el panel lateral. | Carga la interfaz de conversación activa mostrando el historial. |
| 2. Escribir el mensaje del estudiante en la barra inferior y pulsar Enviar. | El mensaje se renderiza al instante en pantalla y se activa el indicador de escritura. |
| 3. Esperar la respuesta del servidor. | La IA retorna una contestación con pautas de relajación claras y sin recetas. |

---

##### **CP007: Modificar Estado de Usuario (Admin)**

###### **Tabla 9. Caso de prueba modificar estado de usuario**
| Caso de Prueba: Modificar Estado de Usuario | |
| :--- | :--- |
| **ID:** | CP007 |
| **Nombre:** | Modificar estado de usuario |
| **Versión:** | 1.0 |
| **Módulo:** | Admin (Gestión de Usuarios) |
| **Objetivo:** | Activar, suspender o alterar los roles de un usuario registrado en el sistema. |
| **Datos de prueba:** | `data = { "userId": 14, "status": "suspended" }` |
| **Pasos:** | **Resultado Esperado:** |
| 1. Iniciar sesión como Administrador de Bienestar y dirigirse a "Usuarios". | Se despliega la lista con todos los registros académicos de la base de datos. |
| 2. Localizar al usuario deseado y cambiar su interruptor de estado a "Suspender". | Despacha petición PATCH. El estado del usuario en la tabla cambia a `suspended`. |
| 3. Intentar iniciar sesión con la cuenta suspendida. | El backend deniega el acceso e informa al usuario de su suspensión. |

---

##### **CP008: Cambiar Contraseña de Usuario**

###### **Tabla 10. Caso de prueba cambiar contraseña**
| Caso de Prueba: Cambiar Contraseña | |
| :--- | :--- |
| **ID:** | CP008 |
| **Nombre:** | Cambiar contraseña |
| **Versión:** | 1.0 |
| **Módulo:** | Auth (Seguridad de Cuenta) |
| **Objetivo:** | Cambiar la clave de acceso de la cuenta del usuario autenticado. |
| **Datos de prueba:** | `data = { "current_password": "password", "new_password": "newpassword123", "password_confirmation": "newpassword123" }` |
| **Pasos:** | **Resultado Esperado:** |
| 1. Hacer clic en el avatar del menú e ingresar a "Configuración > Seguridad". | Despliega los campos para actualizar clave. |
| 2. Ingresar la contraseña actual y la nueva contraseña confirmada de forma idéntica. | Campos rellenados. |
| 3. Pulsar en el botón "Actualizar Contraseña". | La contraseña se encripta de nuevo y se muestra notificación exitosa. |

---

### 4.3 RESULTADOS DE LAS PRUEBAS

A continuación se exponen con total detalle los resultados obtenidos tras ejecutar meticulosamente cada uno de los casos de prueba detallados anteriormente.

#### **Caso de Prueba: Registrar Usuario**
*   **ID de Caso de Prueba:** CP001
*   **Nombre:** Registrar Usuario
*   **Módulo:** Auth (Autenticación y Seguridad)
*   **Datos de Prueba:** `data = { "cedula": "1002938122", "name": "Juan Perez", "email": "juanperez@mail.com", "password": "password", "birth_date": "2002-05-15", "gender": "Masculino", "role": "student", "department": "Ingeniería de Sistemas", "semester": "6" }`
*   **Resultado Esperado:** El sistema debe registrar exitosamente al usuario en la base de datos con estado activo y con su edad computada con exactitud matemática, iniciando sesión y redirigiendo al dashboard.
*   **Resultado Obtenido:**
    *   *Paso 1:* La vista de registro pública cargó de forma inmediata (0.06s).
    *   *Paso 2:* Al cambiar el rol a "Estudiante", se renderizó correctamente la entrada de semestre en la UI.
    *   *Paso 3:* El frontend calculó correctamente la edad de 24 años basada en la fecha ingresada (`2002-05-15`).
    *   *Paso 4:* Los datos se ingresaron con éxito.
    *   *Paso 5:* El sistema despachó a `/register`, devolvió la redirección exitosa de la sesión del usuario al dashboard y mostró el mensaje flotante.
    *   *Paso 6:* Al registrar un email duplicado, el backend denegó la inserción y devolvió el mensaje: *"El correo electrónico ya ha sido registrado"*.
*   **Estado de la Prueba:** Exitosa
*   **Observaciones:** El cálculo de edad es preciso en ambos extremos (cliente/servidor).
*   **Acciones Recomendadas:** Ninguna.

#### **Caso de Prueba: Iniciar Sesión**
*   **ID de Caso de Prueba:** CP002
*   **Nombre:** Iniciar Sesión
*   **Módulo:** Auth (Autenticación y Seguridad)
*   **Datos de Prueba:** `data = { "email": "juanperez@mail.com", "password": "password" }`
*   **Resultado Esperado:** El sistema debe autenticar al usuario registrado, controlando posibles intentos repetitivos y redirigiéndolo de acuerdo a sus privilegios.
*   **Resultado Obtenido:**
    *   *Paso 1:* Carga exitosa de la pantalla de login con soporte de Passkeys.
    *   *Paso 2:* Campos completados con el correo y clave correctos.
    *   *Paso 3:* El usuario ingresó sin retrasos al `/dashboard`.
    *   *Paso 4:* Al digitar claves incorrectas de forma recurrente, tras el 5to intento fallido el servidor arrojó HTTP 429 denegando el envío por 60 segundos debido al rate limiter de Fortify.
*   **Estado de la Prueba:** Exitosa
*   **Observaciones:** La seguridad de fuerza bruta se ejecuta efectivamente en el backend.
*   **Acciones Recomendadas:** Integrar alertas visuales del tiempo restante del rate limiter.

#### **Caso de Prueba: Registrar Entrada en Diario Emocional**
*   **ID de Caso de Prueba:** CP003
*   **Nombre:** Registrar Entrada en Diario
*   **Módulo:** Diario (Journal)
*   **Datos de Prueba:** `data = { "title": "Estresado por parciales", "mood": "Ansioso", "mood_score": 7, "content": "Tengo acumuladas entregas...", "is_private": true }`
*   **Resultado Esperado:** El sistema debe registrar la entrada de diario emocional, indexando los puntajes y guardándolo en la cuenta del estudiante.
*   **Resultado Obtenido:**
    *   *Paso 1:* Carga correcta de la sección de Diario Emocional con su panel de entrada.
    *   *Paso 2:* Datos rellenados.
    *   *Paso 3:* Selección y puntuación visual adaptada de forma intuitiva.
    *   *Paso 4:* Petición `POST` exitosa. La base de datos actualizó correctamente la tabla `journal_entries` y registró la fecha del chequeo emocional (`last_mood_check_in`).
*   **Estado de la Prueba:** Exitosa
*   **Observaciones:** El historial visual de entradas se recarga de forma asíncrona al guardar.
*   **Acciones Recomendadas:** Añadir sugerencias automáticas de relajación tras registrar un estado de ánimo con puntuación de estrés mayor a 8.

#### **Caso de Prueba: Resolver Test de Bienestar Psicológico**
*   **ID de Caso de Prueba:** CP004
*   **Nombre:** Resolver Test de Bienestar
*   **Módulo:** Evaluaciones (Assessments)
*   **Datos de Prueba:** Respuestas de test Likert `{"questionnaire_id": 1, "answers": [...]}`
*   **Resultado Esperado:** Procesar las respuestas de las opciones, calcular el resultado psicométrico y guardar el diagnóstico general detallado en la cuenta del estudiante.
*   **Resultado Obtenido:**
    *   *Paso 1:* El test de ansiedad cargó todas las preguntas del administrador sin errores.
    *   *Paso 2:* Opciones Likert seleccionadas completamente.
    *   *Paso 3:* El backend procesó las sumatorias de la tabla `options` asociando las llaves foráneas en `responses`. Calculó correctamente el nivel final de "Ansiedad Moderada" basándose en el puntaje.
    *   *Paso 4:* Al faltar respuestas, la interfaz bloqueó el botón final destacando las preguntas pendientes de selección.
*   **Estado de la Prueba:** Exitosa
*   **Observaciones:** Diagnóstico autogenerado con precisión matemática de acuerdo a la escala.
*   **Acciones Recomendadas:** Habilitar opción para descargar el diagnóstico calculado en formato PDF exportable.

#### **Caso de Prueba: Enviar Sugerencia al Buzón**
*   **ID de Caso de Prueba:** CP005
*   **Nombre:** Enviar Sugerencia al Buzón
*   **Módulo:** Feedback (Retroalimentación)
*   **Datos de Prueba:** `data = { "category": "Atención Psicológica", "message": "Sería de gran utilidad aumentar los horarios..." }`
*   **Resultado Esperado:** Almacenar la sugerencia de bienestar del estudiante asignándole el estado de pendiente para revisión de administración.
*   **Resultado Obtenido:**
    *   *Paso 1:* Panel de Buzón accesible con selección de categorías.
    *   *Paso 2:* Entrada de datos correcta.
    *   *Paso 3:* Al hacer clic en enviar, se guardó la fila en `feedbacks` asignándole automáticamente `status = 'pending'` y vinculando el ID del estudiante autenticado.
*   **Estado de la Prueba:** Exitosa
*   **Observaciones:** Muestra aviso claro de que el mensaje fue canalizado con éxito a psicología.
*   **Acciones Recomendadas:** Ninguna.

#### **Caso de Prueba: Iniciar Conversación con IA**
*   **ID de Caso de Prueba:** CP006
*   **Nombre:** Iniciar Conversación con IA
*   **Módulo:** Chat (Asistente Emocional)
*   **Datos de Prueba:** `{"message": "Me siento muy agobiado por el exceso de tareas este semestre."}`
*   **Resultado Esperado:** El sistema debe responder de forma asíncrona brindando pautas de apoyo en base al mensaje enviado por el estudiante.
*   **Resultado Obtenido:**
    *   *Paso 1:* El módulo de chat cargó la conversación y mensajes locales sin problemas.
    *   *Paso 2:* Mensaje enviado. La interfaz mostró de inmediato la burbuja y activó la animación de espera.
    *   *Paso 3:* El servidor procesó la petición a través de la API externa de forma segura y la interfaz pintó progresivamente la respuesta detallando metodologías de relajación.
*   **Estado de la Prueba:** Exitosa
*   **Observaciones:** La IA respondió con empatía y contención emocional apropiada para el ámbito escolar.
*   **Acciones Recomendadas:** Enlazar recursos del sistema en la conversación si la IA detecta estrés elevado.

#### **Caso de Prueba: Modificar Estado de Usuario (Admin)**
*   **ID de Caso de Prueba:** CP007
*   **Nombre:** Modificar Estado de Usuario
*   **Módulo:** Admin (Gestión de Usuarios)
*   **Datos de Prueba:** `{"userId": 14, "status": "suspended"}`
*   **Resultado Esperado:** Cambiar el estado del usuario en la base de datos de inmediato y denegar accesos a cuentas inactivas.
*   **Resultado Obtenido:**
    *   *Paso 1:* Tabla administrativa cargó y listó a los usuarios registrados.
    *   *Paso 2:* Se ejecutó el cambio de estado del usuario. El backend actualizó la columna `status` a `'suspended'` en base de datos.
    *   *Paso 3:* Al intentar ingresar con esa cuenta, el sistema mostró el aviso de bloqueo: *"Su cuenta de usuario ha sido suspendida temporalmente"*.
*   **Estado de la Prueba:** Exitosa
*   **Observaciones:** Trazabilidad estricta de seguridad.
*   **Acciones Recomendadas:** Enviar una notificación por correo al usuario cuando sea suspendido.

#### **Caso de Prueba: Cambiar Contraseña de Usuario**
*   **ID de Caso de Prueba:** CP008
*   **Nombre:** Cambiar Contraseña
*   **Módulo:** Auth (Seguridad de Cuenta)
*   **Datos de Prueba:** `{"current_password": "password", "new_password": "newpassword123", "password_confirmation": "newpassword123"}`
*   **Resultado Esperado:** Permitir el cambio de contraseña únicamente si la clave actual es correcta y guardar el nuevo hash en el servidor.
*   **Resultado Obtenido:**
    *   *Paso 1:* Panel de configuración de contraseña accesible.
    *   *Paso 2:* Campos completados.
    *   *Paso 3:* Al pulsar enviar, se comprobó que la clave actual fuera la correcta mediante los validadores de Fortify. El sistema re-encriptó la nueva contraseña guardándola exitosamente.
*   **Estado de la Prueba:** Exitosa
*   **Observaciones:** El hash se realiza de forma asíncrona y segura mediante algoritmos criptográficos robustos.
*   **Acciones Recomendadas:** Avisar al usuario por correo del cambio de contraseña por motivos de seguridad.
