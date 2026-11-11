---
name: pixel-art
description: Convenciones y flujo para assets gráficos del juego — redactar briefs de sprites/tilesets/UI para el artista, generar placeholders, exportar con Aseprite CLI e integrar en Phaser. Usar cuando se hable de sprites, tilesets, UI, paleta, sombras, texturas o arte del juego.
---

# Pixel art

Fuente de verdad: `docs/03-arte/guia-arte.md` (resolución, tamaños, paleta, sombras, nombres). Léela primero.

## Si el pedido es un brief para la persona artista
Escribe en `assets-src/arte/briefs/<asset>.md`: propósito y pantalla donde aparece; tamaño exacto en px; lista de animaciones con cantidad de cuadros y FPS; colores de la paleta; referencias de lore (aspecto, actitud); dirección de la luz (arriba a la izquierda) y tipo de sombra; nombre del archivo final.

## Si se necesita un placeholder
Generado **en código** (Phaser Graphics → `generateTexture`) con el mismo tamaño y la misma clave que tendrá el asset final, en colores de la paleta. Nunca se usa arte con licencia dudosa como placeholder.

## Si llega un asset final
1. La fuente se guarda en `assets-src/arte/` (`.aseprite`).
2. Se exporta así: `aseprite -b assets-src/arte/<x>.aseprite --sheet public/assets/sprites/<x>.png --data public/assets/sprites/<x>.json --format json-array --list-tags`.
3. Se carga en `BootScene` con `this.load.aseprite(key, png, json)` y se crean las animaciones con `this.anims.createFromAseprite(key)`.
4. Verifica con el MCP de Playwright, con una captura a escala ×4: sin desenfoque y con los bordes nítidos.

## Checklist
- [ ] Tamaño y paleta según la guía · [ ] Sin antialiasing ni semitransparencias (salvo en efectos) · [ ] Contorno de 1 px en lo interactivo · [ ] Nombre con prefijo (`spr_`, `tile_`, `ui_`, `bg_`, `fx_`) · [ ] Licencia registrada si es de terceros
