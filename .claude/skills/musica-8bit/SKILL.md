---
name: musica-8bit
description: Flujo de musicalización chiptune 8-bit — briefs de pistas y SFX, parámetros jsfxr, especificación de exportación e integración en el AudioManager de Phaser. Usar cuando se hable de música, pistas, loops, efectos de sonido o audio del juego.
---

# Música 8-bit

Fuente de verdad: `docs/02-musica/musica.md` (lista de pistas M01–M09, J01–J02, efectos de sonido y formatos). Léela primero.

## Brief de pista (para quien compone)
Escribe en `assets-src/musica/briefs/<id>.md`: ID y pantalla; emoción y referencia del lore; BPM y compás; uso de los 4 canales (pulso 1: melodía; pulso 2: armonía; triángulo: bajo; ruido: percusión); duración del loop (8 a 32 compases) y punto de loop; variante si existe (M06 → M07 es la misma melodía a 140 BPM).

## Efectos de sonido
Propón los parámetros en jsfxr (preset base y ajustes de frecuencia, ataque y decaimiento) y guárdalos como JSON en `assets-src/musica/sfx/<nombre>.json`. Así cualquiera puede regenerarlos en sfxr.me.

## Integrar un audio final
1. Se exporta en OGG y MP3 con los nombres de la doc (`public/assets/audio/music/m03_acto1_oficina.ogg`).
2. Se carga con `this.load.audio(key, [ogg, mp3])`.
3. Se reproduce con el `AudioManager` (volumen de música o de efectos, fundido de 300 ms, loop). Nunca con `this.sound.play` suelto desde las escenas.
4. Verifica: que el loop no tenga clic, que el volumen sea parejo entre pistas (−16 LUFS) y que no suene nada antes de la primera interacción.

## Checklist
- [ ] Formatos OGG y MP3 · [ ] Loop limpio · [ ] Nivel normalizado · [ ] Clave registrada en el AudioManager · [ ] Licencia y crédito en `assets-src/musica/CREDITOS.md`
