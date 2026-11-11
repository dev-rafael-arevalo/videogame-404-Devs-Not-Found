---
name: implementar-spec
description: Ejecuta las tareas de una spec aprobada (specs/NNN-slug/tasks.md) — implementa, testea, verifica en el navegador y actualiza README y plan. Usar cuando se pida "implementar la spec NNN", "ejecutar las tareas" o "seguir con la siguiente spec".
---

# Implementar spec

## Antes de empezar
- Lee `spec.md`, `plan.md` y `tasks.md` de la spec. Si falta `plan.md` o `tasks.md`, o la spec no está `Aprobada`, usa primero la skill `nueva-spec`.
- Cambia a la rama `spec/NNN-slug`, o créala desde `develop` actualizado si no existe (pregunta si hay cambios sin commitear). Marca la spec como `En curso`.
- Si usas APIs de Phaser, Vite o Vitest, consulta el MCP **context7** en vez de confiar en la memoria.

## Ciclo por tarea
1. Implementa **solo** esa tarea, respetando la constitución (simple, lógica pura separada y contenido en JSON).
2. Corre `npm run typecheck` y el test relevante (`npx vitest run <archivo>`).
3. Marca `[x]` en `tasks.md`.

## Verificación final
- `npm run typecheck && npm test && npm run e2e` en verde.
- Con `npm run dev` corriendo, usa el MCP **playwright**: abre http://localhost:5173, recorre el flujo de la spec, saca una captura y revisa la consola. Comprueba cada criterio de aceptación y márcalo en `spec.md`.
- Si la spec toca Docker, nginx o dependencias: `docker compose up --build` y repasa la checklist de `docs/04-arquitectura/seguridad.md`.

## Cierre (obligatorio)
1. Spec en estado `Terminada`.
2. **README.md:** actualiza la tabla de *Estado del proyecto* (porcentaje y estado de la etapa), marca la spec en la *Hoja de ruta* y agrega una entrada arriba de todo en *Changelog*, con fecha `AAAA-MM-DD` y una línea por cambio visible para quien juega.
3. `docs/00-plan.md`: marca el hito. `docs/mapa-del-proyecto.md`: actualiza el estado de los archivos que tocaste.
4. Si cambiaron los comandos o la estructura, actualiza `AGENTS.md`.
5. Resume al usuario lo que se hizo y qué se verificó. **No hagas commit ni push salvo que se pida.** Si se pide, el mensaje de commit es `feat(NNN): <título>` y el PR va contra `develop`.
