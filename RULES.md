Reglas de Ingeniería para el Proyecto Fitia
1. Arquitectura del Sistema
Patrón: Monorepo con separación clara entre frontend/ (React) y backend/ (FastAPI).
Base de Datos: Firebase Firestore para datos documentales. PGVector o extensión vectorial para embeddings.
Comunicación: REST API para la interacción cliente-servidor.
2. Estándares de Backend (Python/FastAPI)
Utilizar pydantic para todos los esquemas de validación de datos.
Implementar Inyección de Dependencias para los servicios de base de datos.
Seguir PEP 8 estrictamente.
Documentar todos los endpoints con docstrings compatibles con OpenAPI/Swagger.
Manejo de errores centralizado en core/errors.py.
3. Estándares de Frontend (React)
Usar Componentes Funcionales y Hooks exclusivamente (no clases).
Gestionar el estado global con React Context o Zustand (evitar Redux para este MVP por complejidad).
Tipado estático (TypeScript) es obligatorio para nuevos componentes.
4. Protocolo de Agente
Planificación: Antes de escribir código para una nueva feature, genera un archivo PLAN.md detallando los pasos.
Seguridad: NUNCA escribir credenciales o claves API en el código fuente. Usar python-dotenv y variables de entorno.
Pruebas: Cada módulo crítico (especialmente el algoritmo de nutrición) debe tener tests unitarios asociados (pytest).
