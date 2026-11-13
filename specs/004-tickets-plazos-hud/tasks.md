# Tareas 004: Sistema de tickets, plazos y HUD

Referencia: [spec.md](spec.md) · [plan.md](plan.md)

Orden de ejecución. `[P]` = se puede hacer en paralelo con la anterior. Marcar `[x]` al terminar.

## Preparación
- [x] T1: `actos.json`, los dos tickets del acto 1 y el cargador `tickets/index.ts`
- [x] T2: [P] Textos de HUD, briefing, puzzle, resultado y rollback en `es.json`

## Tests primero (lógica pura)
- [x] T3: `deadline.test.ts`, `progress.test.ts`, `tickets.test.ts` y `data/tickets.test.ts`

## Implementación
- [x] T4: `deadline.ts`, `progress.ts`, `tickets.ts` hasta que pasen los tests
- [x] T5: [P] `game/session.ts`, `game/events.ts`, `art/ui.ts`
- [x] T6: `puzzles/PuzzleView.ts`, `PlaceholderPuzzle.ts`, `registry.ts`
- [x] T7: `HudScene`, `BriefingScene`, `PuzzleScene`, `ResultScene`, `RollbackScene`
- [x] T8: `WorldScene` (terminales → briefing, orquestación, bloqueo), `config.ts`, `debug.ts`
- [x] T9: `tests/e2e/tickets.spec.ts`

## Verificación y cierre
- [x] T10: `npm run typecheck && npm test && npm run e2e` en verde
- [x] T11: Capturas de briefing, puzzle, resultado, rollback y HUD; revisión de consola
- [x] T12: Actualizar `README.md`, `docs/00-plan.md`, `docs/mapa-del-proyecto.md` y `AGENTS.md`
