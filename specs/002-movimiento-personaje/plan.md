# Plan 002: Movimiento del personaje

Referencia: [spec.md](spec.md)

## Enfoque técnico
`WorldScene` carga un mapa en formato **Tiled JSON** (`public/assets/maps/acto1_oficina.json`) con las
capas `suelo`, `objetos`, `colision` y `encima`. Como no hay fuentes externas, el mapa se **genera con un
script** (`scripts/generate-map-acto1.mjs`) a partir de un plano ASCII; el JSON resultante es un mapa
de Tiled válido, editable con Tiled más adelante. El tileset (`tile_acto1`, 16×16, 8 columnas) y el
sprite de SaraDev se **generan por código** al arrancar a partir de matrices de píxeles
(`src/art/pixelTexture.ts`), según la decisión de arte procedural de `docs/03-arte/guia-arte.md`.

SaraDev (24×24, chibi) nace ya con `idle` (2 cuadros) y `walk` (4 cuadros) en 4 direcciones:
es la versión mínima del sistema que la spec 013 completará con expresiones y el resto de animaciones.
El "placeholder rectángulo" de la spec deja de hacer falta.

Entrada → velocidad es una función pura (`src/logic/movement.ts`): normaliza la diagonal y conserva
la última dirección mirada. La escena solo lee teclas, llama a esa función y aplica la velocidad al
cuerpo Arcade (hitbox 10×6 en los pies). La cámara sigue a SaraDev con deadzone, límites del mapa y
`roundPixels`.

Para que Playwright pueda comprobar colisiones sin leer el canvas, `main.ts` expone
`window.__debug` **solo en desarrollo** (`import.meta.env.DEV`); en el build de producción no existe.

## Archivos
| Acción | Ruta | Propósito |
|---|---|---|
| Crear | `scripts/generate-map-acto1.mjs` | Plano ASCII → Tiled JSON (capas `suelo`, `objetos`, `colision`, `encima`) |
| Crear | `public/assets/maps/acto1_oficina.json` | Mapa de la oficina del acto 1 (40×23 tiles) generado |
| Crear | `src/art/pixelTexture.ts` | Matrices de caracteres → textura canvas, con cuadros nombrados |
| Crear | `src/art/tiles/acto1.ts` | Tileset procedural `tile_acto1` |
| Crear | `src/art/characters/saradev.ts` | Hoja de SaraDev: cabeza, torso y piernas por dirección y fase |
| Crear | `src/art/animations.ts` | Registra las animaciones de SaraDev una sola vez |
| Crear | `src/logic/movement.ts` + `movement.test.ts` | Entrada → velocidad normalizada y dirección |
| Crear | `src/scenes/WorldScene.ts` | P06: mapa, SaraDev, colisiones y cámara |
| Crear | `src/entities/Player.ts` | Sprite con cuerpo Arcade, sombra y animaciones |
| Modificar | `src/config.ts` | Arcade Physics y `WorldScene` |
| Modificar | `src/scenes/BootScene.ts` | `preload` del mapa |
| Modificar | `src/scenes/TitleScene.ts` | START → `World` |
| Modificar | `src/main.ts` | `window.__debug` en desarrollo |
| Crear | `tests/e2e/world.spec.ts` | Título → Mundo, pared frena, idle al soltar |
| Modificar | `AGENTS.md`, `README.md`, `docs/00-plan.md`, `docs/mapa-del-proyecto.md` | Cierre |

## Datos / interfaces
```ts
// src/logic/movement.ts
export type Direction = 'up' | 'down' | 'left' | 'right';
export interface MoveInput { up: boolean; down: boolean; left: boolean; right: boolean }
export interface Velocity { vx: number; vy: number }
export function computeVelocity(input: MoveInput, speed: number): Velocity;   // diagonal normalizada
export function facingFrom(v: Velocity, previous: Direction): Direction;      // conserva la última
// src/art/pixelTexture.ts
export type PixelRows = readonly string[];                 // una fila por string, un char por píxel
export type CharPalette = Readonly<Record<string, number>>; // char → color de la paleta ('.' = transparente)
```

## Dependencias nuevas
Ninguna. Arcade Physics viene con Phaser.

## Verificación
- Vitest: diagonal con la misma magnitud que recta (CA1), sin entrada → 0, dirección se conserva al soltar, ejes opuestos se anulan.
- Playwright: START lleva a `World`; mantener ↑ contra la pared de la sala fría deja la posición fija (CA2); al soltar, la animación es `saradev-idle-up` (CA3); sin errores de consola.
- Visual: capturas a ×4 caminando; sin temblor (CA4).

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos (mapa JSON) · [x] Seguridad (`__debug` solo en DEV)
