# Plan 013: Arte procedural

Referencia: [spec.md](spec.md)

## Enfoque técnico
Mapa de responsabilidades (según el brief, adaptado a lo que ya existe):

| Brief | En el proyecto |
|---|---|
| PixelPalette | `src/art/palette.ts` |
| PixelSpriteRenderer | `src/art/pixelTexture.ts` (matriz → textura; `scaleRows`) |
| CharacterConfig | `src/art/characters/saradev.ts`: piezas (cabezas por vista, caras por expresión, torsos por pose, piernas por fase), composición pura `buildSaraDevFrames()` y `saraDevAnimations()` |
| PixelAnimationController | `src/art/animations.ts` registra la configuración en el `AnimationManager` de Phaser, que ya avanza con el delta del motor |
| PixelCharacter | `src/entities/Player.ts`: estado (`facing`, expresión, acción en curso) y cuerpo Arcade |

- Caras: 3 filas de la cabeza frontal (cejas, ojos, boca) por expresión; `composeFace(head, face)`.
- Torsos: `normal`, `reach`, `typeA`, `typeB`, `up`, `swing` (frontal) y `normal` lateral/trasero.
- Cuadros: `down-idle-<expr>-{0,1}`, `{up,right}-idle-{0,1}`, `<view>-walk-{0,1}`, `down-jump-{0,1}`, `down-interact-{0,1}`, `down-type-{0,1}`, `down-panic-{0,1}`, `down-hurt-{0,1}`, `down-attack-{0,1,2}`, `down-victory-{0,1,2}`.
- Animaciones: `saradev-idle-<dir>-<expr>`, `saradev-walk-<dir>`, `saradev-run-<dir>` (mismos cuadros, 12 fps, sin pausa), `saradev-<accion>`.
- UI: `src/art/ui.ts` genera `ui_window_<estilo>` (16×16, esquinas de 5 px) y dibuja con `add.nineslice`; `ui_icon_*` 8×8; cursor desde una textura a `data:` URL (la CSP permite `img-src data:`).
- Fondos: `src/art/backgrounds.ts` (`SynthwaveBackground`: estrellas, sol, grilla animada; modo `rojo` con glitch).
- Demo: `src/scenes/DemoScene.ts`; `main.ts` arranca `Demo` en vez de `Boot` si la URL lleva `?demo`.
- Debug: `__debug.demo()`.

## Archivos
Crear: `saradev.test.ts`, `backgrounds.ts`, `DemoScene.ts`, `tests/e2e/demo.spec.ts`. Modificar: `saradev.ts`, `animations.ts`, `portraits.ts`, `ui.ts`, `Player.ts`, `TitleScene.ts`, `RollbackScene.ts`, `DialogScene.ts`, `HudScene.ts`, `WorldScene.ts`, `main.ts`, `config.ts`, `debug.ts`, `es.json`, `tests/e2e/tickets.spec.ts` (CA3).

## Dependencias nuevas
Ninguna.

## Verificación
Vitest (CA1), Playwright (CA2, CA3), capturas (CA4).

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada (composición de cuadros testeable sin canvas) · [x] Contenido como datos (expresión en el JSON de diálogos) · [x] Pixel-perfect
