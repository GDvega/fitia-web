# Plan de Implementación: Protocolo de Agente (Regla 4)

## Contexto
Implementar estándares de ingeniería requeridos por `RULES.md` para garantizar la calidad, seguridad y escalabilidad del proyecto. Esto incluye formalizar la planificación, asegurar credenciales y establecer un entorno de pruebas.

## Estrategia
1.  **Planificación**: Establecer `PLAN.md` como documento vivo.
2.  **Seguridad**: Migrar variables de entorno a estándares de Vite para evitar exponer secrets.
3.  **Pruebas**: Integrar Vitest y crear pruebas unitarias para servicios críticos.

## Pasos Técnicos
1.  [x] Crear plantilla `PLAN.md`.
2.  [x] Refactorizar `geminiService.ts` para usar `import.meta.env.VITE_API_KEY`.
3.  [x] Configurar `vite.config.ts`, `tsconfig.json` y `package.json` para Vitest.
4.  [x] Escribir y verificar pruebas unitarias para `geminiService`.

## Verificación
- [x] Los tests (`npm run test`) pasan correctamente.
- [x] La aplicación compila sin errores de TypeScript relacionados con env vars.
