# Plan 009: Terminal simulada

Referencia: [spec.md](spec.md)

## Enfoque técnico
- `src/terminal/` es TypeScript puro (sin Phaser): `parser.ts`, `vfs.ts`, `state.ts` (`TerminalState` y `createTerminalState(datos)`), `commands/*.ts`, `registry.ts` (`runLine(state, line, allowed) → { output, state, clear? }`), `objective.ts`, `history.ts` (historial y `complete`).
- Cada comando es `(args: string[], state: TerminalState) => CommandResult`. `python` y `pip` son guiones sobre el estado: nunca `eval`, nunca red.
- `TerminalScene` dibuja con `Phaser.GameObjects.Text` (monoespaciado 8 px, 60 columnas, 14 líneas visibles) y lee el teclado con `keyboard.on('keydown', e)`: imprimibles, Backspace, Enter, flechas, Tab (`addCapture('TAB')`). Plazo con las mismas funciones de `logic/deadline.ts`; al cumplir el objetivo emite `ticket:done`; Esc, `ticket:abandoned`; vencido, `ticket:failed`.
- Acto 3: plano en `generate-maps.mjs`, `tiles/acto3.ts`, entrada en `actos.json`, salida `X` en el mapa del acto 2, diálogos `acto3_inicio`, `pato_acto3`, textos de la terminal en `es.json`, pistas M05 y M08.

## Archivos
Crear: `src/terminal/{parser,vfs,state,registry,objective,history}.ts` + tests, `src/terminal/commands/{help,ls,cd,pwd,cat,echo,clear,python,pip,source}.ts`, `src/scenes/TerminalScene.ts`, `src/art/tiles/acto3.ts`, `src/data/tickets/a3-01-explorar.json`, `src/data/musica/m05_acto3_nucleo.json`, `m08_terminal.json`, `tests/e2e/terminal.spec.ts`. Modificar: `generate-maps.mjs`, `tiles/index.ts`, `actos.json`, `es.json`, `WorldScene.ts`, `config.ts`, `debug.ts`, `tickets.ts` (tipo `terminal` ya previsto), `helpers.ts`.

## Dependencias nuevas
Ninguna.

## Verificación
Vitest (CA1), Playwright (CA2), capturas (CA3).

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Seguridad: nada se ejecuta, sin `eval`/`innerHTML`, 256 caracteres por línea, 100 entradas de historial
