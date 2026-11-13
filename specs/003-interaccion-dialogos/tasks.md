# Tareas 003: Interacción y diálogos

Referencia: [spec.md](spec.md) · [plan.md](plan.md)

Orden de ejecución. `[P]` = se puede hacer en paralelo con la anterior. Marcar `[x]` al terminar.

## Preparación
- [x] T1: Capa `interactables` en el generador del mapa (PATO, post-its, terminales) y regenerar el JSON
- [x] T2: [P] Diálogos del acto 1 en `es.json`

## Tests primero (lógica pura)
- [x] T3: `src/logic/dialog.test.ts` e `src/logic/interaction.test.ts`

## Implementación
- [x] T4: `src/logic/dialog.ts` y `src/logic/interaction.ts` hasta que pasen los tests
- [x] T5: [P] Arte: PATO, post-it y retratos
- [x] T6: `DialogScene`
- [x] T7: `WorldScene`: interactuables, aviso, lanzar diálogo, bloqueo de movimiento, diálogo inicial
- [x] T8: `config.ts`, `debug.ts` y `tests/e2e/dialog.spec.ts`

## Verificación y cierre
- [x] T9: `npm run typecheck && npm test && npm run e2e` en verde
- [x] T10: Captura del diálogo con Playwright y revisión de consola
- [x] T11: Actualizar `README.md`, `docs/00-plan.md`, `docs/mapa-del-proyecto.md` y `AGENTS.md`
