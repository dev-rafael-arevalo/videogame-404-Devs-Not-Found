# Musicalización 8-bit

> **Decisión (2026-11-12): música y efectos sintetizados en el navegador.** No habrá fuentes externas.
> Un motor chiptune propio (`src/audio/`, spec 014) reproduce **partituras en JSON** (`src/data/musica/`)
> con la restricción de la NES: 2 canales de pulso (melodía y armonía), triángulo (bajo) y ruido
> (percusión), vía Web Audio. Los efectos se definen con parámetros tipo sfxr en JSON y se generan al
> vuelo. Nada se descarga ni se carga de un CDN (respeta la CSP). Las secciones de herramientas y
> exportación de abajo quedan como opción para quien quiera producir versiones OGG afuera.

## Dirección

- **Estilo:** chiptune al estilo NES. Restricción de **4 canales**: 2 de pulso (melodía y armonía), triángulo (bajo) y ruido (percusión). La restricción mantiene todo coherente y es fácil de cumplir.
- **Emoción por acto:** acto 1 curioso y algo torpe → acto 2 melancólico y en movimiento → acto 3 tenso y épico.
- **Urgencia:** cuando queda menos del 20% del plazo, la pista del puzzle pasa a su variante rápida (M07).

## Herramientas recomendadas (gratuitas)

| Uso | Herramienta | Por qué |
|---|---|---|
| Composición | **FamiStudio** | Emula el chip de la NES, exporta WAV/MP3/OGG y es fácil para quien empieza | 
| Bocetos rápidos | **BeepBox** (web) | Sin instalación; las canciones se comparten por URL |
| Efectos de sonido | **jsfxr** (sfxr.me) | Genera efectos 8-bit con presets (moneda, salto, explosión) |
| Edición y loudness | **Audacity** | Recortar, normalizar y convertir formatos |

## Estado (2026-11-12)

Motor en `src/audio/` (`notation.ts`, `songs.ts`, `synth.ts`, `sfx.ts`, `AudioManager.ts`). Pistas listas:
M01, M03, M06, M07, J01 y J02. Efectos listos: `boot_beep`, `click_ui`, `hover_ui`, `interactuar`,
`dialogo_letra`, `paso`, `ticket_nuevo`, `cable_conectar`, `cable_error`, `puzzle_ok`, `puzzle_error`,
`alarma_plazo`, `pato_quack`, `recolector_aparece`.

### Cómo escribir una pista
Un JSON en `src/data/musica/` con `id`, `bpm`, `loop` y `canales` (`pulso1`, `pulso2`, `triangulo`,
`ruido`). Cada canal es texto con tokens `NOTA:duración` en semicorcheas: `C4:4 -:2 A#3:2`. En el
ruido, `K` bombo, `S` caja y `H` hi-hat. Los cuatro canales miden lo mismo y terminan en compás
completo; `npm test` lo valida. `igualQue` reutiliza los canales de otra pista con otro tempo.

## Pistas

| ID | Nombre | Uso (pantalla) | Tempo | Carácter | Loop |
|---|---|---|---|---|---|
| M01 | `titulo` | P02–P04 | 110 BPM | Pegadiza, misteriosa | Sí |
| M02 | `intro` | P05 | 80 BPM | Melancólica, ciudad vacía | No (~60 s) |
| M03 | `acto1_oficina` | P06, acto 1 | 100 BPM | Curiosa, de oficina | Sí |
| M04 | `acto2_ciudad` | P06, acto 2 | 90 BPM | Melancólica, en movimiento | Sí |
| M05 | `acto3_nucleo` | P06, acto 3 | 120 BPM | Tensa, electrónica | Sí |
| M06 | `puzzle` | P10 | 115 BPM | Concentración, pulso constante | Sí |
| M07 | `puzzle_urgente` | P10 con <20% del plazo | 140 BPM | La misma melodía que M06, más rápida | Sí |
| M08 | `terminal` | P11 | 105 BPM | Minimalista, arpegios | Sí |
| M09 | `final_creditos` | P15 | 100 BPM | Triunfal y luego nostálgica | No |
| J01 | `jingle_exito` | P12 | — | 2–3 s, ascendente | No |
| J02 | `jingle_rollback` | P14 | — | 2–3 s, descendente con glitch | No |

## Efectos de sonido

`paso`, `interactuar`, `dialogo_letra` (blip por carácter), `ticket_nuevo`, `click_ui`, `hover_ui`,
`cable_conectar`, `cable_error`, `pieza_soltar`, `interruptor`, `puzzle_ok`, `puzzle_error`,
`tecla` (teclado de la terminal), `comando_ok`, `comando_error`, `alarma_plazo` (al 20%),
`recolector_aparece`, `holograma_aparece`, `pato_quack`, `boot_beep`.

## Especificación de exportación

- **Formatos:** `.ogg` (principal) y `.mp3` (alternativa para Safari). Phaser elige el formato compatible.
- **Música:** 44,1 kHz, estéreo, unos 128 kbps, normalizada a **−16 LUFS**. Los loops tienen que empalmar sin clic: el final empalma con el inicio.
- **Efectos de sonido:** mono, picos de −1 dBFS y duración menor a 1 s (salvo la alarma).
- **Nombres:** `public/assets/audio/music/m03_acto1_oficina.ogg` y `public/assets/audio/sfx/cable_conectar.ogg`.
- **Fuentes editables:** `assets-src/musica/*.fms` (FamiStudio) y `assets-src/musica/sfx/*.json` (parámetros de jsfxr).

## Integración en el juego

- Un `AudioManager` sencillo (spec 006) con volumen separado para música y para efectos, guardado en localStorage.
- Fundido de 300 ms al cambiar de pista. La música suena solo después de la primera interacción, porque los navegadores bloquean el autoplay; P02 "PRESIONA START" resuelve eso.

## Licencias

Si se usan pistas de terceros como placeholder, que sean **CC0** o **CC-BY** (y en ese caso se
acredita en P15). Registrar autor y licencia en `assets-src/musica/CREDITOS.md`.
