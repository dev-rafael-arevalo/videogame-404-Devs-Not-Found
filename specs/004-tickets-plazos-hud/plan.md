# Plan 004: Sistema de tickets, plazos y HUD

Referencia: [spec.md](spec.md)

## Enfoque técnico
- **Datos.** `src/data/tickets/index.ts` carga todos los `*.json` con `import.meta.glob` (Vite) y los
  expone tipados; `src/data/actos.json` da el orden. `src/data/tickets.test.ts` valida cada uno con
  `validateTicket`.
- **Lógica pura.** `deadline.ts` (crear, avanzar, fracción, estado, color de barra), `progress.ts`
  (completados, conciencias, fallos, uptime, recompensa) y `tickets.ts` (siguiente ticket, número).
- **Estado.** `src/game/session.ts` lee y escribe `progress`, `activeTicket` y `sinPresion` en
  `game.registry`; el HUD se suscribe a `changedata`. Nada de gestores de estado externos.
- **Flujo de escenas.** `WorldScene` orquesta por eventos de `game.events` (`src/game/events.ts`):
  terminal → `Briefing` → (aceptar) `Puzzle` → `Result` | `Rollback` → mundo. Mientras hay una
  ventana abierta, el mundo bloquea el movimiento igual que con el diálogo.
- **Puzzles enchufables.** `src/puzzles/PuzzleView.ts` define la interfaz; `registry.ts` mapea
  `tipo → vista` y devuelve `PlaceholderPuzzle` si el tipo no existe. La 005 registra `cables`.
- **UI.** `src/art/ui.ts`: ventana (fondo, borde por estilo CRON/PATO/alerta, sombra de 2 px) y botón
  de texto con hover, click y atajo de teclado.
- **Debug.** `__debug.ticket()`, `progress()` y `expireDeadline()` (solo DEV).

## Archivos
| Acción | Ruta | Propósito |
|---|---|---|
| Crear | `src/logic/deadline.ts`, `progress.ts`, `tickets.ts` + tests | Lógica pura |
| Crear | `src/data/actos.json`, `src/data/tickets/a1-01-cables.json`, `a1-02-binario.json`, `src/data/tickets/index.ts`, `src/data/tickets.test.ts` | Contenido y validación |
| Crear | `src/game/session.ts`, `src/game/events.ts` | Estado en registry y nombres de eventos |
| Crear | `src/art/ui.ts` | Ventana y botón |
| Crear | `src/puzzles/PuzzleView.ts`, `PlaceholderPuzzle.ts`, `registry.ts` | Tableros enchufables |
| Crear | `src/scenes/HudScene.ts`, `BriefingScene.ts`, `PuzzleScene.ts`, `ResultScene.ts`, `RollbackScene.ts` | P07, P09, P10, P12, P14 |
| Modificar | `src/scenes/WorldScene.ts`, `src/config.ts`, `src/debug.ts`, `src/data/textos/es.json` | Orquestación, registro de escenas, debug, textos |
| Crear | `tests/e2e/tickets.spec.ts` | CA2 y CA3 |

## Datos / interfaces
```ts
export interface TicketDef { id: string; numero: number; acto: number; terminal: string; titulo: string; descripcion: string; tipo: string; plazoSegundos: number; conciencias: number; pistas: string[]; datos: unknown }
export interface Deadline { totalMs: number; remainingMs: number; enabled: boolean }
export interface ProgressState { completados: string[]; conciencias: number; fallos: Record<string, number> }
export interface PuzzleView { create(scene, area, ticket, onSolved): void; destroy(): void }
```

## Dependencias nuevas
Ninguna.

## Verificación
- Vitest: casos de CA1.
- Playwright: flujo completo con el placeholder y el rollback forzado (CA2, CA3).
- Visual: capturas de cada ventana.

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Seguridad (sin HTML; `expireDeadline` solo en DEV) · [x] Accesible (barra con color y número; modo sin presión previsto)
