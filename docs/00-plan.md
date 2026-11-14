# Plan del proyecto

Plan simplificado en 4 etapas más una etapa 0 de fundaciones. Cada etapa tiene entregables y un
criterio de "terminado". Arte y música pueden avanzar **en paralelo** a la implementación: el código
usa placeholders hasta que lleguen los assets finales.

## Mapeo con el backlog (Mats)

| Backlog Mats | Etapa de este plan |
|---|---|
| 1 · AGENT.md, Skills, SDD GitHub, plan + cuestionario | Etapa 0 (✅ estructura creada) |
| 2 · Diseño gráfico (componentes 2D, layouts, texturas, sombras) | Etapa 3 |
| 3 · Musicalización 8-bit | Etapa 2 |
| 4 · Ejecución mediante agente | Etapa 4 |
| Lore y pantallas | Etapa 1 |

---

## Etapa 0: Fundaciones ✅

- [x] `AGENTS.md` y `CLAUDE.md`
- [x] Skills en `.claude/skills/`
- [x] SDD: constitución, plantillas y primeras specs (`specs/`)
- [x] Plan y cuestionario
- [x] `.mcp.json` (playwright y context7)
- [x] [CONTRIBUTING.md](../CONTRIBUTING.md) (roles, ramas, commits, PRs) y [mapa del proyecto](mapa-del-proyecto.md)
- [x] Repositorio en GitHub con `main`, `develop` y las ramas iniciales de cada etapa
- [ ] Configurar la protección de ramas en GitHub (ver CONTRIBUTING §7)
- [x] Responder [cuestionario.md](cuestionario.md) (2026-11-12; quedan abiertas la 7, 13 y 22)

## Etapa 1: Lore y pantallas

Entregables:
- [lore.md](01-lore/lore.md) cerrado: personajes, actos, finales y tono
- [pantallas.md](01-lore/pantallas.md) cerrado: cada pantalla con sus elementos, controles y transiciones
- Catálogo de tickets por acto (lista con tipo de puzzle, plazo y dificultad); se crean con la skill `nueva-actividad`
- Guion de diálogos de PATO y de CRON (en `src/data/textos/es.json` cuando exista el código)

Terminado cuando: cada ticket del catálogo tiene un tipo de puzzle definido y cada pantalla tiene su wireframe.

## Etapa 2: Musicalización 8-bit

> **Decisión 2026-11-12:** no habrá fuentes externas. La música y los efectos se **sintetizan en el navegador** con un motor chiptune de 4 canales propio (spec 014); las partituras viven en JSON. Ver [musica.md](02-musica/musica.md).

Entregables (ver [musica.md](02-musica/musica.md)):
- 11 pistas (9 temas y 2 jingles) y unos 20 efectos de sonido como partituras y parámetros JSON en `src/data/musica/` (✅ motor, M01, M03, M06, M07, J01, J02 y 14 efectos)
- Exportación a OGG/MP3 solo si hiciera falta para otros usos

Terminado cuando: cada pantalla tiene su pista asignada y cada acción del juego su efecto de sonido.

## Etapa 3: Diseño gráfico

> **Decisión 2026-11-12:** el arte se **genera por código** (matrices de píxeles → texturas de Phaser), con SaraDev al estilo chibi de humor tecnológico descrito en [guia-arte.md](03-arte/guia-arte.md) (spec 013).

Entregables (ver [guia-arte.md](03-arte/guia-arte.md)):
- Paleta ✅, tipografía pixel y kit de UI ✅ (ventanas 9-slice, botones, cursor, íconos del HUD)
- Sprites: SaraDev ✅ (8 expresiones, 10 animaciones), PATO ✅, El Recolector, hologramas y gato
- Tilesets de los 3 actos con sombras y texturas (dithering): ✅ actos 1 y 2
- Piezas de puzzle por tipo y layouts de cada pantalla

Terminado cuando: el slice vertical (acto 1) se ve sin placeholders.

## Etapa 4: Arquitectura, implementación y Docker (ejecución por agente)

Documentos: [arquitectura.md](04-arquitectura/arquitectura.md) · [stack-y-herramientas.md](04-arquitectura/stack-y-herramientas.md) · [seguridad.md](04-arquitectura/seguridad.md) · [docker.md](04-arquitectura/docker.md)

Hoja de ruta de specs (cada una se crea con `nueva-spec` y se ejecuta con `implementar-spec`):

| # | Spec | Hito |
|---|---|---|
| 001 | Base del proyecto (Vite, TS, Phaser 4, Vitest, Docker) | ✅ **terminada** 2026-11-12 |
| 002 | Movimiento del personaje en el mundo | ✅ **terminada** 2026-11-12 |
| 003 | Interacción y diálogos (PATO, post-its) | ✅ **terminada** 2026-11-12 |
| 004 | Sistema de tickets, plazos y HUD | ✅ **terminada** 2026-11-12 |
| 005 | Primer puzzle: cableado | ✅ **terminada** 2026-11-12 |
| 006 | Audio: música, efectos de sonido y volumen | ✅ **terminada** 2026-11-12 |
| 007 | Resto de puzzles del acto 1 y guardado (localStorage) | ✅ **terminada** 2026-11-12 · acto 1 completo |
| 008 | Puzzles del acto 2 (bloques de código, caza del bug, indentación) | ✅ **terminada** 2026-11-13 · acto 2 completo |
| 009 | Terminal simulada (parser, FS virtual, comandos) | Acto 3 |
| 010 | Tickets del acto 3: venv, pip y `python puente.py` | Acto 3 |
| 011 | Menús, pausa, opciones, final y créditos | Juego completo |
| 012 | CI en GitHub Actions y publicación de la imagen | Release |
| 013 | Sistema de arte procedural: SaraDev (expresiones y animaciones), PATO, kit de UI y escena de demo | ✅ **terminada** 2026-11-12 |
| 014 | Motor chiptune de 4 canales y SFX sintetizados; pistas M01–M09, J01–J02 | ✅ **terminada** 2026-11-12 (motor + 6 pistas; las 5 restantes van con sus pantallas) |

**Slice vertical (001–006 + 014):** ✅ **alcanzado el 2026-11-12.** Una partida jugable del acto 1 con 1 puzzle, plazo, música y Docker. La 013 (arte definitivo) sigue en el camino al acto 1 completo.
