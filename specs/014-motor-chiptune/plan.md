# Plan 014: Motor chiptune

Referencia: [spec.md](spec.md)

## Enfoque técnico
- `src/audio/notation.ts` (puro): `noteToFrequency`, `parseTrack(texto) → NoteEvent[]` (`step`, `steps`, `note` o `drum`), `trackLength`.
- `src/audio/songs.ts`: carga `src/data/musica/*.json` con `import.meta.glob`, resuelve `igualQue` y valida largos (`validateSong`, puro, testeado en `src/data/musica.test.ts`).
- `src/audio/synth.ts`: `ChipSynth` (voces: pulso 25%, pulso 12,5%, triángulo, ruido K/S/H) y `MusicPlayer` (scheduler con *lookahead* de 120 ms cada 30 ms, loop por paso, `onEnded` para las pistas sin loop).
- `src/audio/sfx.ts`: `playSfx(ctx, destino, def)` a partir de `src/data/musica/sfx.json`.
- Partituras: `m01_titulo`, `m03_acto1_oficina`, `m06_puzzle`, `m07_puzzle_urgente` (`igualQue`), `j01_jingle_exito`, `j02_jingle_rollback`.

## Archivos
| Acción | Ruta | Propósito |
|---|---|---|
| Crear | `src/audio/notation.ts` + `notation.test.ts` | Notación |
| Crear | `src/audio/songs.ts`, `src/data/musica/*.json`, `src/data/musica.test.ts` | Canciones y validación |
| Crear | `src/audio/synth.ts`, `src/audio/sfx.ts`, `src/data/musica/sfx.json` | Motor y efectos |

## Dependencias nuevas
Ninguna (Web Audio API del navegador).

## Verificación
Vitest (CA1); escucha manual (CA3); la 006 cubre el e2e.

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Seguridad (sin red, sin CDN; respeta la CSP)
