# Plan 003: Interacción y diálogos

Referencia: [spec.md](spec.md)

## Enfoque técnico
- **Datos.** El generador del mapa agrega la capa de objetos `interactables` (PATO con `Q`, post-its
  con `N`, terminales a partir de cada `T`). Cada objeto lleva `tipo` y `dialogo`. Los diálogos viven
  en `es.json` bajo `dialogos.<id>` como lista de `{ quien, texto }`.
- **Lógica pura** (`src/logic/`): `dialog.ts` (ajuste de línea, paginación, tipeo y cursor) e
  `interaction.ts` (`pickInteractable`). Sin Phaser, con tests.
- **Escenas.** `WorldScene` crea un sprite por interactuable, calcula el objetivo cada cuadro y lanza
  `DialogScene` en paralelo (`scene.launch`) con el id del diálogo. Mientras `Dialog` está activa, el
  mundo ignora la entrada de movimiento. `DialogScene` dibuja la caja, el retrato y el texto; al
  cerrar se detiene y emite `dialog:closed` en `game.events`.
- **Arte.** `src/art/characters/pato.ts` (12×12, 2 cuadros), `src/art/props.ts` (post-it 8×8) y
  `src/art/portraits.ts` (32×32: la cabeza de SaraDev y PATO duplicados ×2, post-it de Marga).
- **Debug.** `window.__debug.dialog()` y `prompt()` exponen el estado para Playwright.
- **Teclas discretas por eventos.** E/Espacio se leen con `keyboard.on('keydown-E')` y no con
  `JustDown`: Phaser anula `JustDown` si la tecla se suelta en el mismo cuadro (así manda Playwright
  `press`), y así el juego responde igual a toques muy cortos.

## Archivos
| Acción | Ruta | Propósito |
|---|---|---|
| Modificar | `scripts/generate-map-acto1.mjs` + JSON | Capa `interactables`; PATO bloquea el paso |
| Crear | `src/logic/dialog.ts` + `dialog.test.ts` | `wrapText`, `paginate`, `visibleChars`, cursor |
| Crear | `src/logic/interaction.ts` + `interaction.test.ts` | `pickInteractable` |
| Crear | `src/art/characters/pato.ts`, `src/art/props.ts`, `src/art/portraits.ts` | Sprites y retratos |
| Crear | `src/scenes/DialogScene.ts` | P08 |
| Modificar | `src/scenes/WorldScene.ts` | Interactuables, aviso "[E] usar", lanzar diálogo, bloqueo |
| Modificar | `src/data/textos/es.json` | Diálogos del acto 1 |
| Modificar | `src/config.ts`, `src/debug.ts` | Registrar `DialogScene`; `dialog()` |
| Crear | `tests/e2e/dialog.spec.ts` | CA2 y CA3 |

## Datos / interfaces
```ts
// es.json
{ "dialogos": { "pato_intro": [{ "quien": "PATO", "texto": "..." }, ...] }, "ui": { "usar": "[E] usar" } }
// src/logic/dialog.ts
export function wrapText(text: string, maxChars: number): string[];
export function paginate(lines: string[], linesPerPage: number): string[];       // páginas con '\n'
export function visibleChars(elapsedMs: number, charsPerSecond: number, total: number): number;
export interface DialogCursor { line: number; page: number; revealed: boolean; closed: boolean }
export function confirm(cursor: DialogCursor, pagesPerLine: number[]): DialogCursor;
// src/logic/interaction.ts
export function pickInteractable<T extends { x: number; y: number }>(origin, items: T[], range: number): T | null;
```

## Dependencias nuevas
Ninguna.

## Verificación
- Vitest: casos de CA1.
- Playwright: Boot → Título → Mundo; caminar hasta PATO; aviso visible; E abre; posición fija con flecha; E cierra.
- Visual: captura del diálogo a ×4.

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Seguridad (texto por `setText`, nunca HTML)
