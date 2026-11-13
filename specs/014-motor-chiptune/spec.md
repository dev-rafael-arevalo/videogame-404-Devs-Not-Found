# Spec 014: Motor chiptune de 4 canales y SFX sintetizados

- **Estado:** Terminada (2026-11-12)
- **Etapa:** 2 Musicalización · 4 Implementación
- **Depende de:** 001

## Problema / objetivo
No hay fuentes de audio externas. La música y los efectos del juego se **sintetizan en el navegador**
con la restricción de la NES (2 pulsos, triángulo y ruido), a partir de partituras en JSON que
cualquiera puede editar sin herramientas. Esta spec construye el motor y las pistas del slice
vertical; la 006 lo integra en las escenas.

## Requisitos funcionales
- RF1: Notación de pista en texto: tokens `NOTA:duración` (`C4:4`, `A#3:2`, `-:8` silencio) con la duración en semicorcheas; en el canal de ruido, `K` (bombo), `S` (caja), `H` (hi-hat). Parser puro y testeado (`src/audio/notation.ts`).
- RF2: Una canción es un JSON en `src/data/musica/` con `id`, `bpm`, `loop` y `canales` (`pulso1`, `pulso2`, `triangulo`, `ruido`), todos del mismo largo. Un JSON puede declarar `igualQue` para reutilizar los canales de otra con otro tempo (M07 = M06 a 140 BPM). Un test valida todas las canciones.
- RF3: Sintetizador Web Audio (`src/audio/synth.ts`): pulso con onda cuadrada de ciclo 25% y 12,5% (PeriodicWave), triángulo, ruido blanco filtrado para bombo, caja y hi-hat; envolvente corta por nota; planificación con *lookahead* para que el loop empalme sin cortes.
- RF4: Efectos tipo sfxr definidos como parámetros en `src/data/musica/sfx.json` (onda, frecuencia inicial y final, duración, volumen, ruido) y generados al vuelo.
- RF5: Pistas del slice: M01 `titulo` (110 BPM), M03 `acto1_oficina` (100), M06 `puzzle` (115), M07 `puzzle_urgente` (140, igual que M06), J01 `jingle_exito`, J02 `jingle_rollback`. Efectos: `boot_beep`, `click_ui`, `interactuar`, `dialogo_letra`, `paso`, `ticket_nuevo`, `cable_conectar`, `cable_error`, `puzzle_ok`, `alarma_plazo`, `pato_quack`.

## Fuera de alcance
Integración en escenas y volúmenes (006); pistas M02, M04, M05, M08, M09 (011 y actos 2–3); exportación a OGG.

## Criterios de aceptación
- [x] CA1: Vitest: el parser convierte tokens en eventos con paso y duración, rechaza tokens inválidos, `noteToFrequency('A4') = 440`; todas las canciones tienen canales del mismo largo y las que usan `igualQue` resuelven.
- [x] CA2: Playwright: con el motor activo, la canción actual cambia según la escena (lo verifica la spec 006).
- [ ] CA3 (pendiente de escucha humana): Escuchado a mano: el loop de M01 empalma sin clic y los 4 canales se distinguen.

## Preguntas abiertas
- Ninguna.
