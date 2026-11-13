# Plan 005: Primer puzzle: cableado

Referencia: [spec.md](spec.md)

## Enfoque técnico
- **Lógica pura** en `src/logic/puzzles/cables.ts`: tipo `CablesData`, `parseCablesData`
  (valida la forma), `canConnect`, `connect`/`disconnect` sobre un estado inmutable
  `Record<leftIndex, rightIndex>`, `isSolved`, `portNumber` (mismo número por color) y `layoutPorts`
  (posiciones de los puertos dentro de un área; también la usa el test e2e para saber dónde
  arrastrar).
- **Vista** `src/puzzles/CablesPuzzle.ts` (implementa `PuzzleView`): dibuja puertos (cuadrado con
  contorno, color y número), cables (línea gruesa con borde oscuro) y el cable temporal del arrastre.
  Usa los eventos de puntero de la escena (`pointerdown/move/up`) con prueba de distancia; nada de
  física.
- **Pistas**: `PuzzleScene` gana un botón "PATO: PISTA" (tecla H) que muestra `ticket.pistas[n]` en una
  línea al pie del tablero y cuenta las pistas. `ticket:done` lleva `pistas`; `rewardFor(base,
  fallos, pistas)` aplica −10% por pista. `completeTicket` recibe las pistas.
- **Registro**: `registry.ts` importa `CablesPuzzle` y lo mapea a `cables`.

## Archivos
| Acción | Ruta | Propósito |
|---|---|---|
| Crear | `src/logic/puzzles/cables.ts` + `cables.test.ts` | Reglas y layout |
| Crear | `src/puzzles/CablesPuzzle.ts` | Tablero |
| Modificar | `src/puzzles/registry.ts` | Registrar `cables` |
| Modificar | `src/logic/progress.ts` + test | Penalidad por pista |
| Modificar | `src/scenes/PuzzleScene.ts`, `WorldScene.ts`, `game/events.ts` | Botón de pista y conteo |
| Modificar | `src/data/textos/es.json` | Textos de la pista |
| Crear | `tests/e2e/cables.spec.ts` | CA2 y CA3 |

## Datos / interfaces
```ts
export interface CablesData { izquierda: string[]; derecha: string[] }
export type Connections = Readonly<Record<number, number>>; // índice izquierdo → índice derecho
export function layoutPorts(area, count): { left: Point[]; right: Point[] };
```

## Dependencias nuevas
Ninguna.

## Verificación
- Vitest: CA1. Playwright: arrastre inválido, arrastre válido ×3, pista y resultado. Capturas.

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Accesible (número además del color)
