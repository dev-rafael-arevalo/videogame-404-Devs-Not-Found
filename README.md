<div align="center">

# SYS://RESTORE

**Es tu primer día de trabajo. La humanidad acaba de desaparecer dentro de un programa.<br>Eres la única persona desarrolladora de turno.**

Videojuego 2D retro de puzzles y exploración con temática de programación · pixel art · chiptune 8-bit

![Estado](https://img.shields.io/badge/estado-pre--producción-orange)
![Etapa](https://img.shields.io/badge/etapa-0%20fundaciones-blue)
![Motor](https://img.shields.io/badge/motor-Phaser-8a2be2)
![Lenguaje](https://img.shields.io/badge/TypeScript-3178c6)
![Docker](https://img.shields.io/badge/deploy-Docker-2496ed)
![Licencia](https://img.shields.io/badge/licencia-por%20definir-lightgrey)

_Título provisional · Última actualización: **2026-11-10**_

</div>

---

## Índice

- [Sobre el juego](#sobre-el-juego)
- [Características](#características)
- [Estado del proyecto](#estado-del-proyecto)
- [Hoja de ruta](#hoja-de-ruta)
- [Stack tecnológico](#stack-tecnológico)
- [Primeros pasos](#primeros-pasos)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Flujo de desarrollo](#flujo-de-desarrollo)
- [Documentación](#documentación)
- [Changelog](#changelog)
- [Créditos y licencia](#créditos-y-licencia)

---

## Sobre el juego

Un martes a las 03:14, un despliegue sin revisar activó **ARCA**, el sistema de respaldo de conciencias
de Kernel & Co., y subió a toda la humanidad a un programa que empieza a corromperse. Solo **Dev**,
que cumplía su primer turno de guardia dentro de la sala fría blindada del datacenter, quedó afuera.

Guiada por **PATO**, un pato de goma asistente, Dev recorre una ciudad vacía y acepta los *tickets*
que emite **CRON**, el planificador de ARCA. Cada ticket se resuelve en primer plano y contra reloj,
antes de que **El Recolector** haga rollback del sector. La dificultad crece con la interfaz: de
puzzles con el mouse a escribir comandos reales de terminal para desplegar `puente.py`, la app que
traerá a todos de vuelta.

> Lore completo en [docs/01-lore/lore.md](docs/01-lore/lore.md)

## Características

- 🕹️ **Exploración cenital** de 3 actos: oficinas, ciudad abandonada y núcleo digital
- 🧩 **Puzzles de programación** en primer plano: redes, binario, lógica booleana, orden de código y depuración
- ⌨️ **Terminal simulada** en el acto final: `cd`, `ls`, `venv`, `pip` y `python` para levantar una app
- ⏱️ **Tickets con plazo**, con un modo sin presión para jugar sin reloj
- 🎨 **Pixel art de 320×180** con paleta limitada y degradación visual del mundo
- 🎵 **Banda sonora chiptune** con restricción de 4 canales al estilo NES
- 🔒 **Web estática y segura**: sin backend, contenedor sin root y CSP estricta

## Estado del proyecto

| Etapa | Descripción | Progreso | Estado |
|---|---|---|---|
| 0 · Fundaciones | AGENTS.md, skills, SDD, plan y cuestionario | `██████████` 100% | ✅ Completa |
| 1 · Lore y pantallas | Historia, personajes, 15 pantallas y catálogo de puzzles | `████░░░░░░` 40% | 📝 Borrador v1, a validar |
| 2 · Musicalización | 11 pistas y unos 20 efectos de sonido 8-bit | `█░░░░░░░░░` 10% | 📝 Dirección definida |
| 3 · Diseño gráfico | Paleta, sprites, tilesets y kit de UI | `█░░░░░░░░░` 10% | 📝 Guía definida |
| 4 · Implementación | Juego en Phaser y deploy en Docker | `█░░░░░░░░░` 10% | 📝 Arquitectura y specs 001–002 |

**Próximo hito:** 🎯 **Slice vertical**: acto 1 jugable con un puzzle, plazo, música y Docker (specs 001–006).

**Siguiente paso:** responder el [cuestionario](docs/cuestionario.md) e implementar la spec 001.

## Hoja de ruta

<details open>
<summary><b>Slice vertical</b> (0/6)</summary>

- [ ] 001 · Base del proyecto (Vite, TypeScript, Phaser, tests y Docker)
- [ ] 002 · Movimiento del personaje
- [ ] 003 · Interacción y diálogos
- [ ] 004 · Sistema de tickets, plazos y HUD
- [ ] 005 · Primer puzzle: cableado
- [ ] 006 · Audio: música, efectos de sonido y volumen

</details>

<details>
<summary><b>Juego completo</b> (0/6)</summary>

- [ ] 007 · Puzzles del acto 1 y guardado
- [ ] 008 · Puzzles del acto 2
- [ ] 009 · Terminal simulada
- [ ] 010 · Tickets del acto 3 (venv, pip y `puente.py`)
- [ ] 011 · Menús, pausa, opciones, final y créditos
- [ ] 012 · CI y publicación de la imagen

</details>

Detalle y criterios de cada etapa en [docs/00-plan.md](docs/00-plan.md).

## Stack tecnológico

| Área | Tecnología |
|---|---|
| Motor y lenguaje | [Phaser](https://phaser.io) · TypeScript · Vite |
| Tests | Vitest (lógica) · Playwright (e2e) |
| Arte | Aseprite / LibreSprite · Tiled |
| Música | FamiStudio / BeepBox · jsfxr |
| Deploy | Docker multi-stage · nginx sin privilegios |
| Desarrollo asistido | Claude Code · skills de proyecto · MCP Playwright y Context7 |

Justificación y alternativas en [docs/04-arquitectura/stack-y-herramientas.md](docs/04-arquitectura/stack-y-herramientas.md).

## Primeros pasos

> ⚠️ El código se crea en la **spec 001**. Estos comandos estarán disponibles a partir de ella.

**Requisitos:** Node 24 LTS y Docker Desktop.

```bash
# Desarrollo (recarga en caliente)
npm install
npm run dev                 # http://localhost:5173

# Tests
npm test                    # lógica (Vitest)
npm run e2e                 # smoke test (Playwright)

# Producción en Docker
docker compose up --build   # http://localhost:8080
```

## Estructura del repositorio

```
├── docs/              Documentación por etapa (lore, música, arte, arquitectura)
├── specs/             Desarrollo guiado por specs: constitución, plantillas y features
├── .claude/skills/    Skills para agentes de IA
├── assets-src/        Fuentes editables de arte, música y mapas
├── src/               Código del juego (desde la spec 001)
├── public/assets/     Assets exportados (desde la spec 001)
├── CONTRIBUTING.md    Guía del equipo: roles, ramas, commits y PRs
├── AGENTS.md          Guía para agentes de IA
└── CLAUDE.md          Punto de entrada de Claude Code
```

## Flujo de desarrollo

El proyecto usa **desarrollo guiado por specs (SDD)** con agentes de IA:

```
idea ──► /nueva-spec ──► spec.md ──(aprobación)──► plan.md + tasks.md ──► /implementar-spec ──► PR
```

1. Cada feature se especifica en `specs/NNN-slug/` antes de escribir código.
2. Un agente la implementa tarea por tarea, con tests y verificación visual.
3. Al cerrar una spec, **este README se actualiza**: estado, hoja de ruta y changelog.

### Ramas

`main` (estable, se publica en cada hito) ← `develop` (integración) ← ramas de trabajo `spec/`, `lore/`, `musica/`, `arte/`, `docs/` y `fix/`.

| Rama inicial | Para |
|---|---|
| `docs/cuestionario` | Lead: responder las decisiones abiertas |
| `lore/lore-y-pantallas` | Narrativa: lore, guion y catálogo de tickets |
| `musica/pistas-y-sfx` | Música: briefs, pistas y efectos de sonido |
| `arte/kit-base` | Arte: paleta, Dev y kit de UI |
| `spec/001-base-proyecto` · `spec/002-movimiento-personaje` | Desarrollo |

👉 **Antes de contribuir:** lee [CONTRIBUTING.md](CONTRIBUTING.md) (ramas, commits y PRs) y [docs/mapa-del-proyecto.md](docs/mapa-del-proyecto.md) (qué lleva cada archivo y qué falta).
Principios no negociables en [specs/constitucion.md](specs/constitucion.md).

## Documentación

| Documento | Contenido |
|---|---|
| [Guía de contribución](CONTRIBUTING.md) · [Mapa del proyecto](docs/mapa-del-proyecto.md) | Cómo trabajar, qué lleva cada archivo y qué falta |
| [Plan](docs/00-plan.md) · [Cuestionario](docs/cuestionario.md) | Etapas, hitos y decisiones pendientes |
| [Lore](docs/01-lore/lore.md) · [Pantallas](docs/01-lore/pantallas.md) | Historia, personajes, flujo y wireframes |
| [Música](docs/02-musica/musica.md) | Pistas, efectos de sonido, herramientas y exportación |
| [Arte](docs/03-arte/guia-arte.md) | Paleta, sprites, sombras, texturas y pipeline |
| [Arquitectura](docs/04-arquitectura/arquitectura.md) | Escenas, datos y terminal simulada |
| [Seguridad](docs/04-arquitectura/seguridad.md) · [Docker](docs/04-arquitectura/docker.md) | CSP, hardening y despliegue |

## Changelog

Formato: la entrada más reciente arriba. Lo actualiza la skill `implementar-spec` al cerrar cada spec.

### 2026-11-10: Etapa 0, fundaciones
- Estructura inicial del repositorio y documentación de las 4 etapas
- Lore v1: ARCA, Dev, PATO, CRON, El Recolector y 3 actos
- 15 pantallas con flujo y wireframes; catálogo de 8 tipos de puzzle
- Dirección musical (11 pistas y unos 20 efectos de sonido) y guía de arte
- Arquitectura, seguridad y plantillas de Docker
- SDD: constitución, plantillas y specs 001–002
- Skills de agente y configuración de MCP
- Guía de contribución, mapa del proyecto, plantillas de issue y PR, y estrategia de ramas (`main`, `develop` y ramas por etapa)

## Créditos y licencia

- **Dirección y desarrollo:** _por definir_
- **Arte:** _por definir_ · **Música:** _por definir_
- Assets de terceros: ver `assets-src/*/CREDITOS.md`

Licencia: **por definir**.
