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

_Última actualización: **2026-11-13**_

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
| 1 · Lore y pantallas | Historia, personajes, 15 pantallas y catálogo de puzzles | `████████░░` 80% | 📝 Actos 1 y 2 en el juego (7 tickets, hologramas, cierres de acto); falta el acto 3 |
| 2 · Musicalización | 11 pistas y unos 20 efectos de sonido 8-bit | `████████░░` 80% | 🚧 Motor chiptune propio; 9 de 11 pistas y 17 efectos sintetizados |
| 3 · Diseño gráfico | Paleta, sprites, tilesets y kit de UI | `████████░░` 80% | 🚧 SaraDev completa, PATO, hologramas, tilesets de los 3 actos, kit de UI, CRT, synthwave y demo en `/?demo` |
| 4 · Implementación | Juego en Phaser y deploy en Docker | `█████████░` 86% | 🚧 **Terminal simulada y núcleo de ARCA**: 8 tipos de puzzle, 3 actos recorribles (specs 001–009, 013, 014) |

**Hito alcanzado (2026-11-12):** 🎯 **Slice vertical**: acto 1 jugable con un puzzle, plazo, música y Docker.

**Hito alcanzado (2026-11-13):** 🎯 **Acto 2 completo**: Puerto Cero con metro, central y antena, y tres puzzles de código.

**Próximo hito:** acto 3 completo (spec 010: venv, pip y el deploy de `puente.py`) y el final (011).

**Siguiente paso:** spec 010 (tickets del acto 3: venv, pip, config y `python puente.py --restore all`).

## Hoja de ruta

<details open>
<summary><b>Slice vertical</b> (6/6) ✅</summary>

- [x] 001 · Base del proyecto (Vite, TypeScript, Phaser 4, tests y Docker) · 2026-11-12
- [x] 002 · Movimiento del personaje · 2026-11-12
- [x] 003 · Interacción y diálogos · 2026-11-12
- [x] 004 · Sistema de tickets, plazos y HUD · 2026-11-12
- [x] 005 · Primer puzzle: cableado · 2026-11-12
- [x] 006 · Audio: música, efectos de sonido y volumen · 2026-11-12

</details>

<details>
<summary><b>Juego completo</b> (3/6)</summary>

- [x] 007 · Puzzles del acto 1 y guardado · 2026-11-12
- [x] 008 · Acto 2: Puerto Cero y puzzles de código · 2026-11-13
- [x] 009 · Terminal simulada y núcleo de ARCA · 2026-11-13
- [ ] 010 · Tickets del acto 3 (venv, pip y `puente.py`)
- [ ] 011 · Menús, pausa, opciones, final y créditos
- [ ] 012 · CI y publicación de la imagen

</details>

<details>
<summary><b>Arte y audio generados por código</b> (2/2) ✅</summary>

- [x] 013 · Sistema de arte procedural: SaraDev (expresiones y animaciones), PATO y kit de UI · 2026-11-12
- [x] 014 · Motor chiptune de 4 canales y efectos sintetizados · 2026-11-12 (pistas M01, M03, M06, M07, J01, J02; faltan M02, M04, M05, M08 y M09)

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

### 2026-11-13: Spec 009, la terminal del acto 3
- Terminal simulada en pantalla CRT verde: `ls`, `cd`, `pwd`, `cat`, `echo`, `clear`, `help`, `python`, `pip` y `source`, con historial (↑/↓), Tab que completa comandos y rutas, y errores que imitan a los reales. Nunca ejecuta nada de verdad
- `python` y `pip` son guiones: `python -m venv`, `source .venv/bin/activate`, `pip install -r requirements.txt` y `python puente.py` reaccionan al estado (venv, dependencias, config.ini)
- Núcleo de ARCA: plataformas de grilla sobre el vacío, columnas de datos, el núcleo al centro y cuatro kioscos; la salida de Puerto Cero lleva allí
- Primer ticket de terminal: encontrar y leer el log de Marga. Pistas M05 (núcleo) y M08 (terminal); efectos de tecla y de comando

### 2026-11-13: Spec 008, acto 2 en Puerto Cero
- Al cerrar los tickets de la oficina, la puerta inferior lleva a las calles de Puerto Cero: asfalto agrietado, carteles con estática, autos abandonados, vegetación, la boca del metro, la central y la antena
- Tres puzzles de código: ordenar las líneas de una función intercambiándolas, cazar la línea con el bug (con explicación al acertar) y poner cada línea de Python en su nivel de sangría
- Hologramas de personas atrapadas que hablan al acercarse; nuevos post-its de Marga; CRON cierra el acto revelando `puente.py`
- El guardado recuerda el acto y el Título continúa donde quedaste; nueva pista M04 para la ciudad
- Los tests e2e aceptan `PW_CHANNEL=msedge` para correr con Edge si Windows bloquea el Chromium de Playwright

### 2026-11-12: Spec 007, acto 1 completo y guardado
- Tres puzzles nuevos: binario (interruptores que forman un número), paquetes (ordenar por número de secuencia; un error reinicia la cola) y compuertas (AND, OR, XOR, NAND encadenadas)
- Cuatro tickets del acto 1 en orden, cada uno en su terminal; al cerrar el último, CRON revela la escala del desastre y PATO adelanta el acto 2
- La partida se guarda en el navegador tras cada ticket; el Título muestra "Partida guardada" y N empieza de cero

### 2026-11-12: Spec 013, SaraDev con personalidad
- SaraDev tiene 8 expresiones (normal, cansada, feliz, sorprendida, pánico, enojada, determinada, celebración) y 10 animaciones: idle, walk, run, jump, interact, type (tecleando en su laptop), panic, hurt, attack (golpe de laptop) y victory
- El mundo las usa: estira el brazo al usar algo, celebra con los brazos arriba al cerrar un ticket y se lastima cuando vence un plazo
- Los retratos del diálogo cambian de expresión línea a línea; nuevo retrato de CRON
- Kit de UI: ventanas 9-slice en cuatro estilos, íconos en el HUD y cursor pixel art
- Título synthwave con estrellas, sol y grilla en movimiento; el rollback usa la misma grilla en rojo con glitch
- Demo del arte en `/?demo`: recorre animaciones, expresiones, direcciones y escalas con el teclado

### 2026-11-12: Specs 006 y 014, el juego suena
- Motor chiptune propio al estilo NES (2 pulsos, triángulo y ruido) sintetizado en el navegador; las partituras son JSON editables en `src/data/musica/`
- Música por pantalla: tema de Título, tema de la oficina, tema de puzzle que se acelera cuando queda menos del 20% del plazo, jingles de ticket cerrado y de rollback
- 14 efectos tipo sfxr: beeps del BIOS, clicks, pasos, letras del diálogo, cables, alarma de plazo y el cuac de PATO
- Volúmenes separados de música y efectos, guardados en el navegador; nada suena antes de la primera tecla o click

### 2026-11-12: Spec 005, primer puzzle: cableado
- El ticket #0007 ya se juega: arrastrar cada cable desde su puerto hasta el par del mismo color; los puertos llevan número además de color
- Un cable mal puesto se rechaza con un destello rojo; tocar un puerto conectado lo suelta
- Pista de PATO con la tecla H o su botón: muestra la siguiente pista del ticket y resta un 10% de la recompensa

### 2026-11-12: Spec 004, tickets, plazos y HUD
- CRON emite tickets de a uno: la terminal con el aviso parpadeando abre el briefing (#0007 "Reconectar el switch del piso 3")
- Ventana de puzzle sobre el mundo oscurecido con barra de plazo (verde, amarilla, roja parpadeante); Esc abandona
- Si el plazo vence: sacudida, destello rojo y rollback del sector; reintentar cuesta un 25% de la recompensa
- Resultado con tiempo, conciencias y uptime; HUD arriba con uptime, conciencias y plazo del ticket activo
- Dos tickets del acto 1 en JSON validados por test; los puzzles reales llegan en las specs 005 y 007

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
