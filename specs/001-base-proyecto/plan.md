# Plan 001: Base del proyecto

Referencia: [spec.md](spec.md)

## Enfoque técnico
Esqueleto mínimo de Vite + TypeScript + Phaser **4.2.1** (versión estable actual según npm; su API de
configuración es la misma que la de Phaser 3 y lo confirma la documentación oficial vía context7).
Dos escenas: `BootScene` (texto tipo BIOS y barra de carga) y `TitleScene` (título, lluvia de
caracteres y "PRESIONA START" parpadeando). Estructura según
`docs/04-arquitectura/arquitectura.md`.

**Escalado entero.** La spec pedía `Scale.FIT`, pero FIT produce zoom fraccionario y píxeles
desparejos, lo que contradice el principio 6 de la constitución. Se usa `Scale.NONE` +
`autoCenter` y el zoom se calcula con la función pura `integerZoom()` de `src/logic/scale.ts` en el
arranque y en cada `resize`. Esa función es, además, el test de ejemplo de Vitest (RF4).

**Textos en datos.** Aun los textos del boot y del título viven en `src/data/textos/es.json`
(principio 4). El título definitivo del cuestionario es **404: Devs Not Found**; *SYS://RESTORE* queda
como el nombre del programa de restauración dentro del lore.

**Paleta en código.** `src/art/palette.ts` define Sweetie 16 y el verde fósforo de la terminal. Es la
semilla del sistema de arte procedural (ver decisión en `docs/03-arte/guia-arte.md`).

**Marcador de escena para e2e.** Cada escena llama a `markScene(this)` en `create()`, que escribe
`data-scene` en `<html>`. Playwright lo usa para saber en qué pantalla está el juego sin leer el canvas.

## Archivos
| Acción | Ruta | Propósito |
|---|---|---|
| Crear | `package.json`, `package-lock.json` | Scripts y dependencias |
| Crear | `tsconfig.json` | TS estricto, `moduleResolution: bundler`, JSON importable |
| Crear | `vite.config.ts` | Vite + bloque `test` de Vitest (solo `src/**/*.test.ts`) |
| Crear | `playwright.config.ts` | Chromium, viewport 1280×720, levanta `npm run dev` |
| Crear | `index.html`, `src/style.css` | Contenedor `#game` a pantalla completa, fondo negro, `image-rendering: pixelated` |
| Crear | `src/main.ts` | Crea `Phaser.Game`, aplica el zoom entero y escucha `resize` |
| Crear | `src/config.ts` | 320×180, `pixelArt`, `Scale.NONE` + `CENTER_BOTH`, lista de escenas |
| Crear | `src/logic/scale.ts` + `scale.test.ts` | `integerZoom()` y sus tests |
| Crear | `src/art/palette.ts` | Sweetie 16 + verde terminal |
| Crear | `src/scenes/BootScene.ts`, `TitleScene.ts`, `markScene.ts` | Pantallas P01 y P02 |
| Crear | `src/data/textos/es.json` | Textos del boot y del título |
| Crear | `src/puzzles/`, `src/terminal/`, `src/audio/`, `src/data/tickets/`, `public/assets/{sprites,maps,audio,fonts}` con `.gitkeep` | Estructura objetivo |
| Crear | `tests/e2e/smoke.spec.ts` | Canvas visible, Boot → Título, zoom entero, sin errores de consola |
| Crear | `Dockerfile`, `nginx.conf`, `docker-compose.yml`, `.dockerignore` | Según `docs/04-arquitectura/docker.md` |
| Modificar | `AGENTS.md` | Sección Comandos con los scripts reales |
| Modificar | `README.md`, `docs/00-plan.md`, `docs/mapa-del-proyecto.md` | Cierre de la spec |

## Datos / interfaces
```ts
// src/logic/scale.ts
export function integerZoom(viewportW: number, viewportH: number, gameW = 320, gameH = 180): number;
// src/data/textos/es.json
{ "boot": { "lineas": string[], "saltar": string }, "titulo": { "nombre": string, "subtitulo": string, "start": string } }
```

## Dependencias nuevas
Runtime: `phaser@4.2.1`. Desarrollo: `vite@^8`, `typescript@~5.9` (la 7.x es el compilador nativo
nuevo; se adopta cuando el ecosistema lo soporte), `vitest@^5`, `@playwright/test@^1.65`,
`@types/node@^24`. Todas previstas en `stack-y-herramientas.md`. ESLint se posterga a la spec 012 (CI).

## Verificación
- Vitest: `integerZoom` con 1280×720 → 4, 1920×1080 → 6, ventana chica → 1, 1279×720 → 3.
- Playwright: el canvas existe y es visible; `data-scene` pasa de `Boot` a `Title` al pulsar una tecla; el ancho CSS del canvas es múltiplo entero de 320; no hay errores de consola ni `pageerror`.
- Visual (MCP Playwright): captura a 1280×720 y a otro tamaño; bordes nítidos.
- Docker: `docker compose up --build`, UID 101, cabeceras CSP, sin violaciones de CSP en consola.

## Chequeo contra la constitución
- [x] Simple primero · [x] Lógica pura separada · [x] Contenido como datos · [x] Seguridad (sin CDN, CSP del doc, sin `innerHTML`)
