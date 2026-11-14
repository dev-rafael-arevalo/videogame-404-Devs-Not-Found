# Plan 007: Puzzles del acto 1 y guardado

Referencia: [spec.md](spec.md)

## Enfoque técnico
- Un módulo puro por puzzle en `src/logic/puzzles/` (`binario.ts`, `paquetes.ts`, `compuertas.ts`), cada uno con `parse…Data`, estado inmutable, `isSolved` y una función `layout…(area, n)` para posiciones deterministas (las usan la vista y los tests e2e).
- Una vista por puzzle en `src/puzzles/` que sigue el patrón de `CablesPuzzle`: `Graphics` + `Text`, prueba de distancia en `pointerdown`, `snapshot()` para e2e, efectos `click_ui` / `puzzle_error`.
- `src/logic/save.ts` (puro): `SAVE_VERSION`, `toSave(progress, acto)`, `parseSave(json)`; `src/game/save.ts` lee y escribe `localStorage` con `try/catch`.
- `WorldScene`: carga el guardado al crear (si el registry está vacío), guarda en `onTicketDone` y `onTicketFailed`, y abre `acto1_fin` al cerrar el último resultado.
- `TitleScene`: lee el guardado para mostrar el porcentaje; `keydown-N` lo borra.

## Archivos
Crear: `logic/puzzles/{binario,paquetes,compuertas}.ts` + tests, `puzzles/{Binario,Paquetes,Compuertas}Puzzle.ts`, `logic/save.ts` + test, `game/save.ts`, `data/tickets/a1-03-paquetes.json`, `a1-04-compuertas.json`, `tests/e2e/puzzles.spec.ts`, `tests/e2e/save.spec.ts`. Modificar: `registry.ts`, `actos.json`, `a1-02-binario.json`, `es.json`, `WorldScene.ts`, `TitleScene.ts`, `debug.ts`, `helpers.ts`.

## Dependencias nuevas
Ninguna.

## Verificación
Vitest (CA1), Playwright (CA2, CA3), capturas (CA4).

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Seguridad (guardado validado, sin datos personales) · [x] Accesible (valores y etiquetas, no solo color)
