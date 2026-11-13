<div align="center">

# 404: Devs Not Found

**Es tu primer día de trabajo. La humanidad acaba de desaparecer dentro de un programa.<br>Eres la única persona desarrolladora de turno.**

Videojuego 2D retro de puzzles y exploración con temática de programación · pixel art · chiptune 8-bit

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Etapa](https://img.shields.io/badge/etapa-4%20implementación-blue)
![Motor](https://img.shields.io/badge/motor-Phaser%204-8a2be2)
![Lenguaje](https://img.shields.io/badge/TypeScript-3178c6)
![Docker](https://img.shields.io/badge/deploy-Docker-2496ed)
![Licencia](https://img.shields.io/badge/licencia-por%20definir-lightgrey)

_Última actualización: **2026-11-12**_

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
de Kernel & Co., y subió a toda la humanidad a un programa que empieza a corromperse. Solo **SaraDev**,
que cumplía su primer turno de guardia dentro de la sala fría blindada del datacenter, quedó afuera.

Guiada por **PATO**, un pato de goma asistente, SaraDev recorre una ciudad vacía y acepta los *tickets*
que emite **CRON**, el planificador de ARCA. Cada ticket se resuelve en primer plano y contra reloj,
antes de que **El Recolector** haga rollback del sector. La dificultad crece con la interfaz: de
puzzles con el mouse a escribir comandos reales de terminal para desplegar `puente.py`, la app que
traerá a todos de vuelta. El programa de recuperación se llama **SYS://RESTORE**.

> Lore completo en [docs/01-lore/lore.md](docs/01-lore/lore.md)

## Características

- 🕹️ **Exploración cenital** de 3 actos: oficinas, ciudad abandonada y núcleo digital
- 🧩 **Puzzles de programación** en primer plano: redes, binario, lógica booleana, orden de código y depuración
- ⌨️ **Terminal simulada** en el acto final: `cd`, `ls`, `venv`, `pip` y `python` para levantar una app
- ⏱️ **Tickets con plazo**, con un modo sin presión para jugar sin reloj
- 🎨 **Pixel art de 320×180** generado por código, con paleta limitada y degradación visual del mundo
- 🎵 **Banda sonora chiptune** de 4 canales al estilo NES, sintetizada en el navegador
- 🔒 **Web estática y segura**: sin backend, contenedor sin root y CSP estricta

## Estado del proyecto

| Etapa | Descripción | Progreso | Estado |
|---|---|---|---|
| 0 · Fundaciones | AGENTS.md, skills, SDD, plan y cuestionario | `██████████` 100% | ✅ Completa |
| 1 · Lore y pantallas | Historia, personajes, 15 pantallas y catálogo de puzzles | `██████░░░░` 55% | 📝 Primeros diálogos de PATO y post-its en el juego; falta el catálogo de tickets |
| 2 · Musicalización | 11 pistas y unos 20 efectos de sonido 8-bit | `█░░░░░░░░░` 10% | 📝 Dirección definida; se sintetizará en código (spec 014) |
| 3 · Diseño gráfico | Paleta, sprites, tilesets y kit de UI | `███░░░░░░░` 25% | 🚧 Tileset del acto 1 y SaraDev mínima generados por código; referencias visuales fijadas |
| 4 · Implementación | Juego en Phaser y deploy en Docker | `████░░░░░░` 40% | 🚧 Specs 001–003: esqueleto, Boot, Título, mundo del acto 1, PATO, post-its y diálogos |

**Próximo hito:** 🎯 **Slice vertical**: acto 1 jugable con un puzzle, plazo, música y Docker (specs 001–006).

**Siguiente paso:** spec 004 (tickets, plazos y HUD) y spec 013 (arte procedural completo de SaraDev).

## Hoja de ruta

<details open>
<summary><b>Slice vertical</b> (3/6)</summary>

- [x] 001 · Base del proyecto (Vite, TypeScript, Phaser 4, tests y Docker) · 2026-11-12
- [x] 002 · Movimiento del personaje · 2026-11-12
- [x] 003 · Interacción y diálogos · 2026-11-12
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

<details>
<summary><b>Arte y audio generados por código</b> (0/2)</summary>

- [ ] 013 · Sistema de arte procedural: SaraDev (expresiones y animaciones), PATO y kit de UI
- [ ] 014 · Motor chiptune de 4 canales y efectos sintetizados (pistas M01–M09, J01–J02 y SFX)

</details>

Detalle y criterios de cada etapa en [docs/00-plan.md](docs/00-plan.md).

## Stack tecnológico

| Área | Tecnología |
|---|---|
| Motor y lenguaje | [Phaser 4](https://phaser.io) · TypeScript · Vite 8 |
| Tests | Vitest (lógica) · Playwright (e2e) |
| Arte | Generado por código (matrices de píxeles → texturas) · Tiled para mapas |
| Música | Sintetizador chiptune propio (Web Audio, 4 canales) · efectos tipo sfxr |
| Deploy | Docker multi-stage · nginx sin privilegios |
| Desarrollo asistido | Claude Code · skills de proyecto · MCP Playwright y Context7 |

Justificación y alternativas en [docs/04-arquitectura/stack-y-herramientas.md](docs/04-arquitectura/stack-y-herramientas.md).

## Primeros pasos

**Requisitos:** Node 24 LTS y Docker Desktop.

```bash
# Desarrollo (recarga en caliente)
npm install
npm run dev                 # http://localhost:5173

# Calidad y tests
npm run typecheck           # tsc --noEmit
npm test                    # lógica (Vitest)
npm run e2e:install         # una vez: descarga Chromium
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
├── src/               Código del juego: scenes/, logic/, art/, audio/, terminal/, puzzles/, data/
├── public/assets/     Assets exportados (mapas, fuentes)
├── tests/e2e/         Smoke tests de Playwright
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
| `arte/kit-base` | Arte: paleta, SaraDev y kit de UI |
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

### 2026-11-12: Spec 003, interacción y diálogos
- PATO espera en la sala fría y los post-its de Marga están sobre tres escritorios; al acercarse aparece "[E] usar"
- Caja de diálogo con retrato, nombre y texto que se escribe letra a letra; E o Espacio revela, pasa de página y cierra
- Diálogo inicial de SaraDev al despertar, presentación de PATO y respuesta de las terminales (todavía sin tickets)
- Retratos de SaraDev, PATO y el post-it generados por código a partir del arte del mundo

### 2026-11-12: Spec 002, movimiento del personaje
- SaraDev camina por la oficina del acto 1 con WASD o flechas, en 8 direcciones y con la diagonal normalizada
- Mapa de 40×23 tiles en formato Tiled (sala fría con racks, oficina abierta, sala de reuniones), generado desde un plano ASCII
- Tileset del acto 1 y sprite de SaraDev (idle y walk en 4 direcciones) generados por código con la paleta Sweetie 16
- Colisión con paredes y muebles con hitbox en los pies, se pasa por detrás de los racks; cámara con deadzone y límites del mapa
- Dirección de arte fijada a partir de las referencias del Lead: neón cian y magenta, synthwave, SaraDev con sudadera roja

### 2026-11-12: Spec 001, base del proyecto
- El juego arranca: pantalla de Boot (BIOS de ARCA con barra de carga, cualquier tecla salta) y pantalla de Título con lluvia de caracteres y "PRESIONA START"
- Render pixel-perfect a 320×180 con zoom entero automático (×4 a 1280×720, ×6 a 1920×1080)
- Esqueleto de Phaser 4.2.1 + Vite 8 + TypeScript; Vitest (lógica) y Playwright (smoke) en verde
- Docker: imagen multi-stage con nginx sin privilegios (UID 101) y cabeceras CSP verificadas
- Decisiones: título definitivo **404: Devs Not Found**, protagonista **SaraDev**, arte y música generados por código (specs 013 y 014)

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
