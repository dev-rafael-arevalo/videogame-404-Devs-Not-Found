# Plan 011: Menús, intro y final

Referencia: [spec.md](spec.md)

## Enfoque técnico
- `src/logic/ending.ts`: `maxConciencias(tickets)`, `rescuePercent(progress, tickets)`, `endingFor(percent) → 'completo' | 'parcial' | 'pendiente'`. `src/logic/gameOptions.ts`: `{ sinPresion }` con parse/serialize; `src/game/options.ts` lo persiste y lo vuelca al registry (`REG.sinPresion`).
- `src/art/menu.ts`: `createMenu(scene, items, layout)` → lista vertical con cursor, ↑/↓, Enter, hover y click; cada ítem puede tener `onLeft/onRight` (opciones). Lo usan Menu, Options y Pause.
- Escenas: `MenuScene` (fondo synthwave compartido con el Título), `OptionsScene` (overlay; vuelve con Esc emitiendo `options:closed`), `IntroScene` (viñetas con `Graphics` + sprites existentes), `PauseScene` (overlay sobre el mundo pausado), `EndScene` (epílogo por páginas + créditos con scroll).
- `TitleScene`: START → `Menu`. `WorldScene`: Esc → `Pause`; cuando se cierra el diálogo `acto3_fin` → `End`. `AudioManager.setDucked(boolean)` para la pausa.
- Pistas M02 (`intro`, 80 BPM, sin loop) y M09 (`final_creditos`, 100 BPM, sin loop).
- Tests e2e: `helpers.enterWorld` pasa por Menú → Nueva partida → Intro (Esc); `save.spec` usa Continuar; `menu.spec` cubre opciones, pausa y final.

## Archivos
Crear: `logic/ending.ts` + test, `logic/gameOptions.ts` + test, `game/options.ts`, `art/menu.ts`, `scenes/{Menu,Options,Intro,Pause,End}Scene.ts`, `data/musica/m02_intro.json`, `m09_final_creditos.json`, `tests/e2e/menu.spec.ts`. Modificar: `TitleScene`, `WorldScene`, `AudioManager`, `config.ts`, `debug.ts`, `es.json`, `helpers.ts`, `save.spec.ts`, `musica.test.ts`.

## Dependencias nuevas
Ninguna.

## Verificación
Vitest (CA1), Playwright (CA2), capturas (CA3).

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Accesible (volúmenes separados, modo sin presión) · [x] Seguridad (opciones validadas)
