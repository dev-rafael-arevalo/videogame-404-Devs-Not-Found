# Plan 006: Audio

Referencia: [spec.md](spec.md)

## Enfoque técnico
- `src/audio/options.ts` (puro): `parseAudioOptions(json)` con valores por defecto (música 0,8; efectos 1) y rango 0–1; `serializeAudioOptions`.
- `src/audio/AudioManager.ts`: singleton `audio`. Crea el `AudioContext` perezosamente en `unlock()` (primer `pointerdown`/`keydown` en `window`, registrado en `main.ts`). Dos `GainNode` (música y efectos) hacia `destination`. `playMusic` crea un `MusicPlayer` nuevo y funde el anterior en 300 ms; si la pista no hace loop y tiene `next`, al terminar arranca `next`. `playSfx` consulta `sfx.json`.
- Integración mínima por escena: Boot (`boot_beep`), Title (M01), World (M03, `paso` en `Player`, `interactuar`, `pato_quack`), Dialog (`dialogo_letra`), Briefing (`ticket_nuevo`, `click_ui`), Puzzle (M06/M07, `alarma_plazo`, `puzzle_ok`), Cables (`cable_conectar`, `cable_error`), Result (J01 → M03), Rollback (J02 → M03), botones (`click_ui`).
- `__debug.audio()`.

## Archivos
| Acción | Ruta | Propósito |
|---|---|---|
| Crear | `src/audio/options.ts` + test, `src/audio/AudioManager.ts` | Manager y opciones |
| Modificar | `src/main.ts`, `src/debug.ts`, escenas, `Player.ts`, `CablesPuzzle.ts`, `art/ui.ts` | Integración |
| Crear | `tests/e2e/audio.spec.ts` | CA2 |

## Dependencias nuevas
Ninguna.

## Verificación
Vitest (CA1), Playwright (CA2), escucha manual (CA3).

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Accesible (volúmenes separados) · [x] Seguridad (localStorage validado)
