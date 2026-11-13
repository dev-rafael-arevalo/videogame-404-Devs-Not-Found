# Tareas 005: Primer puzzle: cableado

Referencia: [spec.md](spec.md) · [plan.md](plan.md)

Orden de ejecución. `[P]` = se puede hacer en paralelo con la anterior. Marcar `[x]` al terminar.

## Tests primero (lógica pura)
- [x] T1: `src/logic/puzzles/cables.test.ts` y el caso de pistas en `progress.test.ts`

## Implementación
- [x] T2: `src/logic/puzzles/cables.ts` y `rewardFor` con pistas hasta que pasen los tests
- [x] T3: `src/puzzles/CablesPuzzle.ts` y registro en `registry.ts`
- [x] T4: Botón de pista en `PuzzleScene`, conteo en el flujo (`events.ts`, `WorldScene`) y textos
- [x] T5: `tests/e2e/cables.spec.ts`

## Verificación y cierre
- [x] T6: `npm run typecheck && npm test && npm run e2e` en verde
- [x] T7: Captura del tablero con cables conectados; revisión de consola
- [x] T8: Actualizar `README.md`, `docs/00-plan.md`, `docs/mapa-del-proyecto.md` y `AGENTS.md`
