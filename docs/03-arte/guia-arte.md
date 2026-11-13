# Guía de diseño gráfico

> **Decisión (2026-11-12): arte generado por código.** No habrá fuentes externas (sin Aseprite ni PNG
> dibujados a mano). Cada sprite se define como una **matriz de píxeles** sobre la paleta y se
> convierte en textura de Phaser al arrancar (`src/art/`). La paleta vive en `src/art/palette.ts`.
> El resto de esta guía (tamaños, luz, sombras, nombres) sigue vigente como dirección artística.
> Exportar a PNG queda como opción para quien quiera retocar afuera.

## Dirección de personajes: SaraDev

Referencia conceptual (solo estética, nada copiado): el humor gráfico tecnológico y cotidiano de
páginas tipo *Casi Humano*: personajes minimalistas, expresivos y un poco absurdos, con estética de
cómic llevada a 8 bits. SaraDev debe parecer salida de una viñeta de humor de programadores, no un
sprite genérico de videojuego.

| Aspecto | Decisión |
|---|---|
| Proporción | **Chibi**: cabeza grande, cuerpo pequeño. Base 24×24 px (16×24 de hitbox visual en el mundo) |
| Rostro | Muy expresivo; los ojos y la boca cambian con cada expresión |
| Pelo | Ligeramente desordenado, con un mechón rebelde que se mueve en `idle` |
| Ropa | Sudadera con capucha de dev, audífonos al cuello, un detalle tech discreto (pin, cable) |
| Contorno | 1 px en el color más oscuro (`black` de la paleta) |
| Colores | Máximo 12 de Sweetie 16 por sprite |
| Silueta | Reconocible a 24 px: capucha + mechón + audífonos |
| Personalidad | Tímida, junior, síndrome de impostor; salva el mundo mientras lidia con errores y servidores caídos |

**Expresiones** (el humor es visual, no solo de diálogo): `normal` (concentrada), `cansada`,
`feliz` (recuperó un sistema), `sorprendida` (detecta una amenaza), `panico` (ciberataque, aparece El
Recolector), `enojada` (frente al enemigo), `determinada` (a punto de desplegar) y `celebracion`
(levantó la app). Se usan en el sprite del mundo y en el retrato de 32×32 de los diálogos.

**Animaciones** (cuadros): `idle` 2–4 (respirar y parpadear) · `walk` 4 · `run` 4–6 · `jump` 2–3 ·
`interact` 2–4 (terminales) · `type` 2–4 (teclear frenético) · `panic` 2–3 · `hurt` 2 ·
`attack` 3–4 · `victory` 3–5. Cada una en 4 direcciones donde aplique (en el mundo) y de frente para
retratos. Fluidas dentro de las limitaciones del pixel art; nada de interpolación.

**Referencias visuales (2026-11-12, aportadas por el Lead; orientan, no se copian):**
1. Ciudad cyberpunk neón en pixel art: edificios cian, carteles magenta y rosa, cables colgando,
   virus con forma de araña flotando. En primer plano, una desarrolladora con **sudadera roja con
   capucha y ribete amarillo, pelo castaño, jeans azules, botas rojas y una laptop en las manos**:
   ese es el look base de SaraDev (ya aplicado en `src/art/characters/saradev.ts`).
2. Sala de servidores en paleta pastel rosa y crema, racks oscuros con LEDs verdes y terminales de
   texto verde: referencia para la sala fría y el núcleo de ARCA.
3. Ventana de error estilo synthwave: grilla magenta en perspectiva, sol rojo, estrellas, ventana
   negra con glitch y botones ABORT / RETRY: referencia para el Título (P02), el Rollback (P14) y las
   alertas de CRON.

Traducción a Sweetie 16: cian `73eff7`/`41a6f6` y magenta `b13e53`/`5d275d` como acentos neón,
verde `33ff66` para terminales, fondos en `1a1c2c`/`29366f`. La grilla synthwave se dibuja con
líneas de 1 px y dithering, sin degradados.

**Entorno** coherente con un retro cyberpunk de ciberseguridad: terminales, servidores, código
binario, ventanas de error, alertas de seguridad, virus como enemigos, sistemas caídos y efectos de
recuperación. El humor tecnológico forma parte de la imagen, no solo del texto.

**Arquitectura del arte procedural (spec 013, adaptada a `docs/04-arquitectura/arquitectura.md`):**
`src/art/palette.ts` (colores) · `src/art/pixelSprite.ts` (matriz → textura, sin objetos nuevos por
cuadro) · `src/art/characters/saradev.ts` (matrices por expresión y animación) ·
`src/art/animations.ts` (registro de animaciones en Phaser, actualizadas con el `delta` del motor,
sin un segundo game loop). Una escena `DemoScene` (fuera del flujo del juego, accesible por `?demo`)
permite ver cada animación, expresión, dirección y escala.

## Fundamentos

| Parámetro | Valor |
|---|---|
| Resolución nativa | **320×180** (16:9), escalado entero ×2, ×3, ×4 o ×6 |
| Tile | **16×16** px |
| Personajes | SaraDev 24×24 (chibi) · hologramas 16×24 · PATO 12×12 · El Recolector 24×32 |
| Paleta | **Sweetie 16** (lospec.com) y un verde fósforo `#33ff66` reservado para la terminal 🔸 |
| Tipografía | Fuente pixel con licencia OFL (por ejemplo, *Press Start 2P* para títulos y una de 5×7 px para el texto) |
| Antialiasing | **Nunca**: bordes nítidos y escalado *nearest neighbor* |

## Estilo

- **Contorno:** 1 px, en el color más oscuro de la paleta, en personajes y objetos interactivos (que se distingan del fondo).
- **Luz:** viene siempre de **arriba a la izquierda**.
- **Sombras:**
  - Personajes: una elipse de 1 color oscuro bajo los pies, de unos 10×3 px y sin transparencia parcial.
  - Objetos y paredes: sombra proyectada hacia abajo a la derecha, 1 tono más oscuro que el piso.
  - Ventanas de UI: sombra de 2 px abajo a la derecha, en color sólido.
- **Texturas:** *dithering* (patrón de tablero o Bayer 2×2) para degradados, cielos y la degradación del mundo; nada de degradados suaves.
- **Degradación del mundo por acto:** acto 1 limpio → acto 2 con grietas, plantas y estática → acto 3 con estética digital (cuadrícula, glitch, cian y magenta).

## Componentes

### Personajes y animaciones
| Sprite | Animaciones |
|---|---|
| SaraDev | Ver "Dirección de personajes": `idle`, `walk`, `run`, `jump`, `interact`, `type`, `panic`, `hurt`, `attack`, `victory` y 8 expresiones |
| PATO | `idle` (rebote de 2 cuadros), `talk` (2 cuadros) |
| El Recolector | `appear`, `sweep` (4 cuadros), con glitch |
| Holograma | `idle` con parpadeo de transparencia (se resuelve en código) y 4 variantes de color o silueta |
| Segfault (gato) | `idle`, `walk` en 2 direcciones, `sleep` |

### Tilesets (uno por acto)
Pisos, paredes, escritorios, servidores, puertas, terminales (estados apagada, encendida y con ticket activo), post-its, cables y decoración. Se arman en **Tiled** con capas `suelo`, `objetos`, `colision` y `encima` (lo que se dibuja sobre Dev).

### Kit de UI
- **Ventana 9-slice** (para la caja de diálogo, el briefing y el puzzle) en 3 estilos: CRON (sistema), PATO (amigable) y alerta (rojo).
- **Botón** con estados normal, hover, presionado y deshabilitado.
- **Cursor:** flecha, mano (arrastrable) y espera.
- **Íconos del HUD** en 8×8: uptime, conciencias, reloj y ticket.
- **Barra de plazo** en 3 colores: verde >50%, amarillo hasta 20% y rojo con parpadeo por debajo.
- **Retratos** de 32×32 para los diálogos (SaraDev con sus 8 expresiones, PATO y Marga).

### Piezas de puzzle
Una hoja de sprites por tipo: puertos y cables (`cables`), interruptores (`binario`), cajas numeradas
(`paquetes`), compuertas (`compuertas`) y fichas de código (`bloques`, `bug`, `indentacion`).

## Layouts

Cuadrícula base de 8 px. Márgenes de pantalla de 8 px. HUD arriba, de 16 px de alto. Diálogo abajo,
de 48 px de alto. Ventana de puzzle centrada, de unos 256×144. Wireframes en [pantallas.md](../01-lore/pantallas.md).

## Herramientas y pipeline

| Herramienta | Uso |
|---|---|
| **Aseprite** (pago) o **LibreSprite**/**Piskel** (gratis) | Sprites y animaciones |
| **Tiled** (gratis) | Mapas; Phaser lee su JSON de forma nativa |
| **Lospec** | Paletas |

1. La fuente editable se guarda en `assets-src/arte/` (`.aseprite`) o `assets-src/mapas/` (`.tmx`).
2. Se exporta como hoja de sprites PNG con un JSON en formato Aseprite a `public/assets/sprites/`. Por línea de comandos: `aseprite -b dev.aseprite --sheet dev.png --data dev.json --format json-array`.
3. Los mapas se exportan a JSON de Tiled en `public/assets/maps/`.

**Nombres:** prefijos `spr_` (sprites), `tile_` (tilesets), `ui_`, `bg_` (fondos) y `fx_` (efectos).
Ejemplo: `spr_dev.png` y `spr_dev.json`.

**Placeholders:** mientras un sprite procedural no exista, el código dibuja rectángulos de colores de
la paleta con el mismo tamaño y la misma clave de textura, así el reemplazo es directo.
