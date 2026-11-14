# Plan 008: Acto 2

Referencia: [spec.md](spec.md)

## Enfoque técnico
- `scripts/generate-maps.mjs` reemplaza al generador del acto 1: un módulo con `buildMap(plan, legend, extras)` y dos planos. Cada acto tiene su leyenda y su tabla de tiles. `node scripts/generate-maps.mjs` escribe `acto1_oficina.json` y `acto2_ciudad.json`.
- `src/art/tiles/acto2.ts` (16 tiles) y `src/art/tiles/index.ts` (`createTileset(scene, acto)` → clave).
- `WorldScene` pasa a recibir `{ acto }`: mapa y tileset por acto desde `actos.json`, diálogo de entrada y de cierre por acto, música por acto, `REG.acto` en el registry (lo lee el HUD). `salida` → `scene.restart({ acto: acto + 1 })` tras un fundido, y guarda el acto nuevo.
- Hologramas: textura `spr_holograma` (16×24) con tween de alpha; interactuable tipo `holograma`.
- Puzzles de código: `src/logic/puzzles/{bloques,bug,indentacion}.ts` + `layoutLines(area, n)` y vistas `{Bloques,Bug,Indentacion}Puzzle.ts` con líneas de texto monoespaciado clicables (prueba por banda vertical).
- `BootScene` precarga todos los mapas de `actos.json`.

## Archivos
Crear: `scripts/generate-maps.mjs`, `public/assets/maps/acto2_ciudad.json`, `src/art/tiles/acto2.ts`, `src/art/tiles/index.ts`, `src/art/props.ts` (holograma), `logic/puzzles/{bloques,bug,indentacion}.ts` + tests, `puzzles/{Bloques,Bug,Indentacion}Puzzle.ts`, `data/tickets/a2-0{1,2,3}-*.json`, `data/musica/m04_acto2_ciudad.json`, `tests/e2e/acto2.spec.ts`. Modificar: `actos.json`, `es.json`, `registry.ts`, `WorldScene.ts`, `BootScene.ts`, `TitleScene.ts`, `HudScene.ts`, `debug.ts`, `session.ts`, `tickets.test.ts`, `musica.test.ts`, `helpers.ts`, `AGENTS.md`. Borrar: `scripts/generate-map-acto1.mjs`.

## Dependencias nuevas
Ninguna.

## Verificación
Vitest (CA1), Playwright (CA2, CA3), capturas (CA4).

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Pixel-perfect
