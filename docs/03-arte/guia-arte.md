# Guía de diseño gráfico

## Fundamentos

| Parámetro | Valor |
|---|---|
| Resolución nativa | **320×180** (16:9), escalado entero ×2, ×3, ×4 o ×6 |
| Tile | **16×16** px |
| Personajes | 16×24 px (Dev, hologramas) · PATO 12×12 · El Recolector 24×32 |
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
| Dev | `idle` y `walk` en 4 direcciones (4 cuadros), `interact` (2 cuadros), `type` (2 cuadros, para la terminal) |
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
- **Retratos** de 32×32 para los diálogos (Dev, PATO y Marga).

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

**Placeholders:** mientras no haya arte, el código dibuja rectángulos de colores de la paleta con
el mismo tamaño que el sprite final, así el cambio por el arte definitivo es directo.
