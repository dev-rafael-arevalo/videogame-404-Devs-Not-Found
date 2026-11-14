# AGENTS.md

Guía para agentes de IA (Claude Code u otros) que trabajen en este repositorio.

## Qué es este proyecto

Videojuego 2D retro (pixel art + música chiptune 8-bit) con temática de programación.
Título: **404: Devs Not Found** (*SYS://RESTORE* es el programa de restauración dentro del lore). La protagonista, **SaraDev**, es la única desarrolladora
de turno en un mundo donde toda la humanidad fue "respaldada" dentro de un programa llamado ARCA.
Se mueve por el mundo (vista cenital), acepta *tickets* con plazo y los resuelve como puzzles en
primer plano: primero con el mouse y, al final, escribiendo comandos en una terminal simulada para
levantar una app en Python.

- Lore completo: [docs/01-lore/lore.md](docs/01-lore/lore.md)
- Pantallas: [docs/01-lore/pantallas.md](docs/01-lore/pantallas.md)
- Plan por etapas: [docs/00-plan.md](docs/00-plan.md)
- Preguntas abiertas: [docs/cuestionario.md](docs/cuestionario.md). Si una decisión depende de algo que sigue sin responder ahí, pregunta antes de inventar.

## Estado actual

Etapa 4 en marcha: la spec [001-base-proyecto](specs/001-base-proyecto/spec.md) creó el esqueleto
(Phaser 4.2.1 + Vite 8 + TypeScript, Vitest, Playwright y Docker) con las pantallas Boot y Título, y la
[002-movimiento-personaje](specs/002-movimiento-personaje/spec.md) agregó el mundo del acto 1 con SaraDev; la [003](specs/003-interaccion-dialogos/spec.md), PATO, post-its y diálogos; la
[004](specs/004-tickets-plazos-hud/spec.md), el bucle de tickets (briefing, plazo, resultado, rollback y HUD); la [005](specs/005-puzzle-cableado/spec.md), el puzzle de cableado; la [006](specs/006-audio/spec.md) y la
[014](specs/014-motor-chiptune/spec.md), música y efectos sintetizados; la [013](specs/013-arte-procedural/spec.md), SaraDev
completa, kit de UI, fondos synthwave y la demo de arte en `/?demo`; la [007](specs/007-puzzles-acto1-guardado/spec.md),
los puzzles binario, paquetes y compuertas, el guardado y el cierre del acto. **Acto 1 completo.**
Siguiente: 008 (acto 2: mapa de la ciudad y puzzles de código). Un puzzle nuevo = `logic/puzzles/<tipo>.ts` con tests + vista en `src/puzzles/` registrada en `registry.ts`. Mantén la sección
**Comandos** sincronizada con los scripts de `package.json`.

## Stack (resumen; detalle en [docs/04-arquitectura/stack-y-herramientas.md](docs/04-arquitectura/stack-y-herramientas.md))

- **Juego:** Phaser 4 + TypeScript + Vite 8. Web estática, sin backend.
- **Tests:** Vitest para la lógica pura y Playwright para el smoke e2e.
- **Arte:** generado por código (matrices de píxeles → texturas de Phaser) con la paleta Sweetie 16; Tiled para mapas. Resolución nativa de 320×180 con escalado entero. Dirección en [docs/03-arte/guia-arte.md](docs/03-arte/guia-arte.md).
- **Música:** chiptune de 4 canales sintetizado en el navegador (Web Audio) a partir de partituras en JSON; efectos tipo sfxr. Dirección en [docs/02-musica/musica.md](docs/02-musica/musica.md).
- **Deploy:** Docker multi-stage (build con Node y nginx sin privilegios para servir estáticos).

## Estructura (objetivo)

```
docs/            Documentación por etapa (lore, música, arte, arquitectura)
specs/           Desarrollo guiado por specs (SDD): constitución, plantillas y una carpeta por feature
.claude/skills/  Skills del proyecto (nueva-spec, implementar-spec, nueva-actividad, pixel-art, musica-8bit)
assets-src/      Fuentes editables (.tmx, briefs). No se sirven.
public/assets/   Assets exportados que carga el juego (mapas, fuentes)
src/             Código del juego: scenes/, entities/, game/ (estado y eventos), logic/, art/, audio/, terminal/, puzzles/, data/
scripts/         Generadores (mapa del acto 1 desde un plano ASCII)
tests/e2e/       Tests de Playwright (smoke y mundo)
```

## Flujo de trabajo: SDD

1. Toda feature nace como spec en `specs/NNN-slug/`: `spec.md` (qué y por qué), luego `plan.md` (cómo) y luego `tasks.md` (pasos). Usa la skill `nueva-spec`.
2. No escribas código sin una spec aprobada. Usa la skill `implementar-spec` para ejecutarla.
3. Respeta [specs/constitucion.md](specs/constitucion.md): sus principios están por encima de cualquier plan.
4. Contenido nuevo del juego (tickets o puzzles): usa la skill `nueva-actividad`.

## Reglas clave

- **Nada de sobreingeniería.** Nada de backend, bases de datos, gestores de estado ni frameworks extra sin una spec que lo justifique.
- **La terminal del juego es simulada.** Nunca ejecuta comandos ni código reales (ver [docs/04-arquitectura/seguridad.md](docs/04-arquitectura/seguridad.md)).
- **La lógica pura va separada de las escenas de Phaser** (`src/logic/`, `src/terminal/`), para poder testearla con Vitest sin canvas.
- **Los tests e2e leen `<html data-scene>` y `window.__debug`** (solo en desarrollo, ver `src/debug.ts`); no leen el canvas. Cada escena de pantalla completa llama a `markScene(this)` en `create()`. Helpers comunes en `tests/e2e/helpers.ts`.
- **Teclas de acción (E, Espacio, Enter) por eventos `keydown-X`, no con `JustDown`:** Phaser anula `JustDown` si la tecla se suelta en el mismo cuadro, y Playwright `press` hace justo eso.
- **El contenido va en datos:** actos, tickets, diálogos, textos y partituras viven en JSON dentro de `src/data/`. Un ticket nuevo es un JSON en `src/data/tickets/` más su id en `actos.json`; una pista nueva es un JSON en `src/data/musica/` (notación en `docs/02-musica/musica.md`); `npm test` valida ambos.
- **Audio solo por `audio` (`src/audio/AudioManager.ts`):** `playMusic(id)` y `playSfx(nombre)`. Nunca Web Audio ni `this.sound` desde las escenas.
- **Idioma:** identificadores de código en inglés; textos del juego y documentación en español.
- **Pixel-perfect:** 320×180, `pixelArt: true` y escalado entero.
- **El README refleja el avance.** Al terminar una spec, o cualquier entregable de las etapas 1–3, actualiza en `README.md` la tabla *Estado del proyecto* (porcentaje y estado), la *Hoja de ruta*, el *Changelog* (entrada arriba de todo, con fecha `AAAA-MM-DD`), la fecha de *Última actualización* y el badge de etapa. Después actualiza `docs/00-plan.md`.
- No hagas commit ni push salvo que se pida. Ramas y commits según [CONTRIBUTING.md](CONTRIBUTING.md): salen de `develop`, se llaman `spec/NNN-slug` y el PR va contra `develop`.
- Qué lleva cada archivo y qué falta: [docs/mapa-del-proyecto.md](docs/mapa-del-proyecto.md). Actualízalo al completar algo.

## Comandos

```bash
npm install            # primera vez (Node 24)
npm run dev            # Vite en http://localhost:5173
npm run build          # build de producción en dist/
npm run preview        # sirve dist/ en http://localhost:4173
npm run typecheck      # tsc --noEmit
npm test               # Vitest (lógica pura, src/**/*.test.ts)
npx vitest run src/logic/scale.test.ts -t "1280"   # un solo test
npm run e2e            # Playwright (smoke; levanta el dev server solo)
npm run e2e:install    # descarga Chromium para Playwright (una vez)
# http://localhost:5173/?demo  → demo del arte (animaciones, expresiones, UI)
node scripts/generate-map-acto1.mjs   # regenera el mapa del acto 1 desde su plano ASCII
docker compose up --build   # juego en http://localhost:8080
```

## MCP disponibles (en `.mcp.json`)

- **playwright**: abre el juego en el navegador, saca capturas y prueba el flujo. Úsalo para verificar cambios visuales.
- **context7**: documentación actualizada de Phaser, Vite y Vitest. Consúltala antes de usar APIs de Phaser de memoria.
- Para GitHub (issues y PRs) usa la CLI `gh`; no hace falta un MCP.
