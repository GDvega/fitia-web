# Documentación del Proyecto: Fitia - Asistente Nutricional con IA

## 1. Descripción General
Fitia es una aplicación web diseñada para generar planes nutricionales personalizados. Utiliza autenticación segura, un motor de cálculo nutricional basado en fórmulas científicas (Harris-Benedict) y un Chatbot impulsado por Inteligencia Artificial (Google Gemini) para asistir a los usuarios en tiempo real.

## 2. Tecnologías Implementadas

### Backend (Servidor)
*   **Lenguaje**: Python 3.10
*   **Framework**: FastAPI (Alto rendimiento, asíncrono).
*   **Base de Datos**: Google Firestore (NoSQL) - Ejecutándose en emulador local.
*   **Inteligencia Artificial**: Google GenAI SDK (Gemini 2.0/1.5).
*   **Seguridad**:
    *   `Argon2`: Hashing de contraseñas de última generación.
    *   `JWT (JSON Web Tokens)`: Manejo de sesiones sin estado.
    *   `OAuth2`: Flujo de autenticación estándar.

### Frontend (Interfaz)
*   **Framework**: React 18 (Vite).
*   **Lenguaje**: TypeScript.
*   **Estilos**: Tailwind CSS (Diseño moderno y responsivo).
*   **Estado Global**: Zustand (Manejo eficiente de datos de usuario).
*   **Internacionalización**: i18next (Soporte completo Español/Inglés).
*   **Gráficos**: Recharts (Visualización de macros).

---

## 3. Funcionalidades Implementadas

### A. Sistema de Autenticación (Auth)
*   **Registro (`POST /auth/register`)**:
    *   Recibe email, contraseña y perfil básico.
    *   Encripta la contraseña con Argon2 antes de guardar en Firestore.
    *   Genera un ID único para el usuario.
*   **Inicio de Sesión (`POST /auth/login`)**:
    *   Verifica credenciales.
    *   Emite un Token de Acceso (JWT) que el frontend guarda para mantener la sesión.
*   **Protección de Rutas**:
    *   El usuario no puede acceder al Dashboard sin estar logueado.

### B. Motor Nutricional (`nutrition_engine.py`)
*   **Cálculo de Metabolismo (BMR)**:
    *   Usa la fórmula *Harris-Benedict Revisada*.
    *   Considera peso, altura, edad y género.
*   **Gasto Energético Total (TDEE)**:
    *   Ajusta el BMR según el nivel de actividad (Sedentario a Muy Activo).
*   **Ajuste por Objetivo**:
    *   Déficit calórico para Perder Peso (-500 kcal).
    *   Superávit para Ganar Músculo (+300 kcal).
*   **Generación de Plan**:
    *   Distribuye calorías en: Desayuno (25%), Almuerzo (35%), Cena (30%), Snack (10%).
    *   Selecciona recetas de una base de datos local (ahora traducida al español) que coincidan con las calorías objetivo.

### C. Chatbot Inteligente (`ai_chat.py`)
*   **Integración**: Conectado a la API de Google Gemini (Modelo `gemini-2.0-flash` o `1.5`).
*   **Contexto del Sistema**:
    *   El bot sabe que es un Nutricionista de Fitia.
    *   Instruido explícitamente para responder **siempre en español**.
    *   Capaz de detectar intención de "Cambiar Comida" o "Responder Pregunta".
*   **Formato de Respuesta**: JSON estructurado para que el Frontend pueda, en el futuro, realizar acciones automáticas basadas en el chat.

### D. Interfaz de Usuario (Dashboard)
*   **Resumen Diario**:
    *   Visualización de calorías consumidas vs meta.
    *   Anillos de progreso para Proteínas, Carbohidratos y Grasas.
*   **Planificador Semanal**:
    *   Vista de calendario interactiva.
    *   Tarjetas de comidas con fotos, ingredientes y tiempo de preparación.
*   **Edición de Perfil**: Modal para actualizar peso, objetivo y actividad.

---

## 4. Estructura de Archivos Clave

### Backend
*   `app/main.py`: Punto de entrada, configuración de CORS y Rutas.
*   `app/core/security.py`: Lógica de hashing (Argon2) y JWT.
*   `app/api/endpoints/auth.py`: Endpoints de Login/Registro.
*   `app/services/nutrition_engine.py`: Lógica matemática y base de datos de recetas.
*   `app/services/ai_chat.py`: Comunicación con Google Gemini.

### Frontend
*   `src/store/userStore.ts`: "Cerebro" del frontend, maneja el usuario y tokens.
*   `src/services/api.ts`: Cliente HTTP (Axios) configurado para conectar con el backend.
*   `src/components/Dashboard.tsx`: Pantalla principal del usuario.
*   `src/i18n.ts`: Archivo de configuración de idiomas (Español).

---

## 5. Estado Actual
*   ✅ **Base de Datos**: Limpia y lista para nuevos usuarios.
*   ✅ **Errores**: Solucionados los problemas de conexión (502) y validación (422).
*   ✅ **Idioma**: 100% Español.
*   ✅ **Pruebas**: Verificación de flujo completo (Backend Integration Tests) exitosa.
