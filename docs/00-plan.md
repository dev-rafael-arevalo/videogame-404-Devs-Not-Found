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
- [ ] **Responder [cuestionario.md](cuestionario.md)** ← siguiente paso

## Etapa 1: Lore y pantallas

**Estado documental (2026-11-12): en revisión, no cerrada definitivamente.**
Guion con 90 eventos (55 conservados y 35 propuestas nuevas), diez post-its y fichas P01–P15
con wireframes. Se sincronizaron el inicio tras reiniciar el rack y el mensaje de enlace local.
Actos 2–3 y tres variantes de epílogo están propuestos, sin condiciones numéricas aprobadas.
Pendientes del Lead: identidad, balance, comandos y configuración, continuidad temporal y finales.
El catálogo concreto de actos 2–3 sigue pendiente; no se inventan tickets o soluciones para
cumplir una cantidad. Los tres tipos existentes del acto 2 no resuelven el pipeline mencionado
ni la meta provisional de 4–5 tickets por acto. Narrativa mantiene textos; Arte revisa layouts
y legibilidad; Desarrollo especifica contratos y valida comportamiento después de aprobar specs.


Entregables:
- [lore.md](01-lore/lore.md) cerrado: personajes, actos, finales y tono
- [pantallas.md](01-lore/pantallas.md) cerrado: cada pantalla con sus elementos, controles y transiciones
- Catálogo de tickets por acto (lista con tipo de puzzle, plazo y dificultad); se crean con la skill `nueva-actividad`
- Guion de diálogos de PATO y de CRON (en `src/data/textos/es.json` cuando exista el código)

Terminado cuando: cada ticket del catálogo tiene un tipo de puzzle definido y cada pantalla tiene su wireframe.

## Etapa 2: Musicalización 8-bit

Entregables (ver [musica.md](02-musica/musica.md)):
- 11 pistas (9 temas y 2 jingles) y unos 20 efectos de sonido, exportados en OGG y MP3 a `public/assets/audio/`
- Fuentes editables en `assets-src/musica/`

Terminado cuando: cada pantalla tiene su pista asignada y cada acción del juego su efecto de sonido.

## Etapa 3: Diseño gráfico

Entregables (ver [guia-arte.md](03-arte/guia-arte.md)):
- Paleta, tipografía pixel y kit de UI (ventanas 9-slice, botones, cursor, HUD)
- Sprites: Dev, PATO, El Recolector, hologramas y gato
- Tilesets de los 3 actos con sombras y texturas (dithering)
- Piezas de puzzle por tipo y layouts de cada pantalla

Terminado cuando: el slice vertical (acto 1) se ve sin placeholders.

## Etapa 4: Arquitectura, implementación y Docker (ejecución por agente)

Documentos: [arquitectura.md](04-arquitectura/arquitectura.md) · [stack-y-herramientas.md](04-arquitectura/stack-y-herramientas.md) · [seguridad.md](04-arquitectura/seguridad.md) · [docker.md](04-arquitectura/docker.md)

Hoja de ruta de specs (cada una se crea con `nueva-spec` y se ejecuta con `implementar-spec`):

| # | Spec | Hito |
|---|---|---|
| 001 | Base del proyecto (Vite, TS, Phaser, Vitest, Docker) | ✅ spec escrita |
| 002 | Movimiento del personaje en el mundo | ✅ spec escrita |
| 003 | Interacción y diálogos (PATO, post-its) | Slice vertical |
| 004 | Sistema de tickets, plazos y HUD | Slice vertical |
| 005 | Primer puzzle: cableado | Slice vertical |
| 006 | Audio: música, efectos de sonido y volumen | Slice vertical |
| 007 | Resto de puzzles del acto 1 y guardado (localStorage) | Acto 1 completo |
| 008 | Puzzles del acto 2 (bloques de código, caza del bug, indentación) | Acto 2 |
| 009 | Terminal simulada (parser, FS virtual, comandos) | Acto 3 |
| 010 | Tickets del acto 3: venv, pip y `python puente.py` | Acto 3 |
| 011 | Menús, pausa, opciones, final y créditos | Juego completo |
| 012 | CI en GitHub Actions y publicación de la imagen | Release |

**Slice vertical (001–006):** una partida jugable del acto 1 con 1 puzzle, plazo, música y Docker. Es el primer hito que hay que mostrar.
