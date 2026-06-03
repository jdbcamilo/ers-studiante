# 🎙️ Guión Integral de Presentación: ERS-Studiante (Todos los Módulos)

> **Consejo para la reunión:** Abre dos pestañas. En la normal inicia sesión como **Administrador** (`admin@cordoba.edu.co`), y en una de **Incógnito** como **Estudiante**. 

---

## 1. Introducción y Planteamiento del Problema
"Buenos días a todos. Hoy presento **ERS-Studiante** (*Emotional Regulation System*). 
La salud mental universitaria es un tema crítico. Los estudiantes sufren picos de estrés y ansiedad, pero los servicios de bienestar muchas veces están saturados. Nuestra plataforma es un 'triage' digital: un espacio privado donde el estudiante evalúa su estado, y la institución puede ver tendencias generales y reaccionar a tiempo."

---

## 2. Arquitectura, Ciberseguridad y 2FA (El Motor)
"Para construir este sistema, la privacidad fue la máxima prioridad:

- **Autenticación (2FA y Passkeys):** Implementamos Autenticación de Dos Pasos. Un usuario malintencionado no puede acceder a los diarios clínicos de un estudiante solo con su contraseña; necesita un código temporal de su celular.
- **El Stack Técnico:** Usamos **Laravel 13 (PHP 8.4)** en el Backend para encriptación de grado militar, y **React.js con Inertia** en el Frontend, creando una aplicación SPA (*Single Page Application*) súper rápida y sin recargas de página.
- **Infraestructura:** Todo está alojado en la nube de Render usando contenedores **Docker** y una base de datos automatizada."

---

## 3. Vista del Estudiante (Módulos Clínicos)
*(Muestra la pantalla de la pestaña de Incógnito con el estudiante)*.

"Pasemos a los módulos que usa el estudiante:

1. **Dashboard:** Aquí el estudiante ve un resumen visual de sus últimas evaluaciones y su nivel de riesgo actual.
2. **Cuestionarios Validados:** Digitalizamos escalas reales. Por ejemplo, si un estudiante hace el *PHQ-9* (para riesgo de depresión), el sistema no solo guarda las respuestas, sino que calcula automáticamente el puntaje de severidad.
3. **Diario Emocional (Journaling):** Un espacio personal e inviolable donde el estudiante puede registrar cómo se siente, una práctica recomendada en terapias cognitivo-conductuales."

---

## 4. El Módulo Estrella: Inteligencia Artificial (Gemini API)
*(Ve a la sección del Chat y muestra cómo le hablas)*

"Pero, ¿qué pasa si el estudiante tiene una crisis a las 3 de la mañana? Aquí es donde entra nuestra innovación principal: **La integración con Inteligencia Artificial**.

A través de la **API de Gemini (Google)**, conectamos el sistema con un modelo de lenguaje avanzado. No es un chatbot genérico. Configuramos el sistema inyectándole un *System Prompt* estricto para que la IA actúe exclusivamente como un asistente de **primeros auxilios psicológicos**. 

**¿Cómo funciona técnicamente?**
Cuando el estudiante escribe, nuestro backend de Laravel toma el mensaje, lo encripta, y hace una petición segura vía HTTP a los servidores de Gemini usando nuestra API Key privada (oculta en nuestras variables de entorno). Gemini procesa el texto, analiza el sentimiento y devuelve una respuesta empática. 

Si la API de Gemini detecta patrones de lenguaje peligrosos (riesgo de autolesión), el sistema está instruido para pausar la conversación automatizada y derivar inmediatamente al estudiante a líneas de emergencia humanas reales."

---

## 5. Vista del Administrador (Módulos de Gestión)
*(Cambia a la pestaña normal con el perfil del admin)*.

"Finalmente, la universidad necesita control. Este es el panel de administración, 100% funcional y conectado a la base de datos en tiempo real:

1. **Métricas Globales:** Un resumen numérico de cuántos estudiantes y evaluaciones están activas.
2. **Módulo de Usuarios:** Aquí vemos una tabla dinámica con todos los estudiantes registrados. El administrador puede verificar sus datos y bloquear accesos si es necesario.
3. **Módulo de Cuestionarios:** Aquí se administran los cuestionarios clínicos que publicamos en la plataforma. Muestra su estado (Borrador o Publicado) y su tiempo de duración.
4. **Módulo de Feedback:** Un buzón directo donde los estudiantes pueden dejar quejas, sugerencias o alertas a la universidad de forma segura, y el administrador puede marcarlas como 'Revisadas' para llevar un control."

---

## 6. Cierre
"En resumen, **ERS-Studiante** unifica desarrollo web de alto nivel (React y Laravel), protocolos de ciberseguridad estrictos (2FA) y el poder de la Inteligencia Artificial de Google (Gemini) para crear una red de apoyo real para nuestra comunidad universitaria. Muchas gracias."
