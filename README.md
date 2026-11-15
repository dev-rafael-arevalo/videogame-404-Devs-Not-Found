<div align="center">

<img src="docs/capturas/02-titulo.png" alt="Pantalla de título de 404: Devs Not Found" width="800">

# 404: Devs Not Found

**Es tu primer día de trabajo. La humanidad acaba de desaparecer dentro de un programa.<br>Eres la única persona desarrolladora de turno.**

Videojuego 2D retro de puzzles y exploración con temática de programación · pixel art · chiptune 8-bit

![Estado](https://img.shields.io/badge/estado-juego%20completo-brightgreen)
![CI](https://github.com/dev-rafael-arevalo/videogame-404-Devs-Not-Found/actions/workflows/ci.yml/badge.svg)
![Etapa](https://img.shields.io/badge/etapa-release-blue)
![Motor](https://img.shields.io/badge/motor-Phaser%204-8a2be2)
![Lenguaje](https://img.shields.io/badge/TypeScript-3178c6)
![Docker](https://img.shields.io/badge/deploy-Docker-2496ed)
![Tests](https://img.shields.io/badge/tests-153%20unitarios%20%2B%2018%20e2e-success)
![Licencia](https://img.shields.io/badge/licencia-por%20definir-lightgrey)

_Última actualización: **2026-11-15**_

[Jugar en Docker](#primeros-pasos) · [Galería](#galería) · [Cómo se juega](#cómo-se-juega) · [Documentación](#documentación)

</div>

---

## Índice

- [Sobre el juego](#sobre-el-juego)
- [Galería](#galería)
- [Cómo se juega](#cómo-se-juega)
- [Los tres actos](#los-tres-actos)
- [Personajes](#personajes)
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

Un martes a las 06:00, un despliegue sin revisar activó **ARCA**, el Archivo de Respaldo de Conciencias
Automatizado de Kernel & Co., y en 0,3 segundos subió a toda la humanidad a un programa que empieza a
corromperse. Solo **SaraDev**, que cumplía su primer turno de guardia dentro de la sala fría blindada del
datacenter, quedó afuera.

Guiada por **PATO**, un pato de goma con parlante, SaraDev recorre una ciudad vacía y acepta los *tickets*
que emite **CRON**, el planificador de ARCA. Cada ticket se resuelve en primer plano y contra reloj, antes
de que **El Recolector** haga rollback del sector. La dificultad crece con la interfaz: de puzzles con el
mouse a escribir comandos en una terminal para desplegar `puente.py`, la app que traerá a todos de vuelta.
El programa de recuperación se llama **SYS://RESTORE**.

Es un post-apocalipsis **silencioso**: tazas de café todavía tibias, semáforos que cambian para nadie y
post-its de Marga, la senior ausente, con consejos pegados por toda la oficina.

> Lore completo en [docs/01-lore/lore.md](docs/01-lore/lore.md) · Las 15 pantallas en [docs/01-lore/pantallas.md](docs/01-lore/pantallas.md)

## Galería

<table>
  <tr>
    <td align="center"><img src="docs/capturas/01-boot.png" alt="BIOS de ARCA" width="400"><br><sub><b>Boot.</b> El BIOS de ARCA monta SYS://RESTORE.</sub></td>
    <td align="center"><img src="docs/capturas/03-menu.png" alt="Menú principal" width="400"><br><sub><b>Menú.</b> Nueva partida, continuar, opciones y créditos sobre el sol synthwave.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/capturas/05-intro.png" alt="Intro en viñetas" width="400"><br><sub><b>Intro.</b> Cinco viñetas: Puerto Cero, las 06:00, los 0,3 segundos, la sala fría y el primer día.</sub></td>
    <td align="center"><img src="docs/capturas/06-acto1-dialogo.png" alt="SaraDev despierta en la sala fría" width="400"><br><sub><b>Acto 1.</b> SaraDev despierta en la sala fría; los retratos cambian de expresión línea a línea.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/capturas/08-briefing.png" alt="Briefing de CRON" width="400"><br><sub><b>Briefing.</b> CRON emite el ticket con plazo, prioridad (crítica, todas lo son) y conciencias en juego.</sub></td>
    <td align="center"><img src="docs/capturas/09-puzzle-cables.png" alt="Puzzle de cableado" width="400"><br><sub><b>Cableado.</b> Arrastrar cada cable hasta el puerto del mismo color, con la barra de plazo abajo.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/capturas/10-resultado.png" alt="Ticket cerrado" width="400"><br><sub><b>Resultado.</b> Tiempo, conciencias restauradas y uptime del sistema.</sub></td>
    <td align="center"><img src="docs/capturas/13-rollback.png" alt="Rollback del sector" width="400"><br><sub><b>Rollback.</b> Si el plazo vence, El Recolector libera el sector y el reintento vale un 25% menos.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/capturas/14-acto2-ciudad.png" alt="Puerto Cero" width="400"><br><sub><b>Acto 2.</b> Las calles de Puerto Cero: asfalto agrietado, carteles con estática y hologramas de personas atrapadas.</sub></td>
    <td align="center"><img src="docs/capturas/16-puzzle-bloques.png" alt="Puzzle de ordenar código" width="400"><br><sub><b>Código.</b> Ordenar las líneas de una función, cazar el bug o corregir la sangría de Python.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/capturas/18-acto3-nucleo.png" alt="Núcleo de ARCA" width="400"><br><sub><b>Acto 3.</b> El núcleo de ARCA: plataformas de grilla sobre el vacío y ocho mil millones de personas en racks.</sub></td>
    <td align="center"><img src="docs/capturas/19-terminal.png" alt="Terminal simulada" width="400"><br><sub><b>Terminal.</b> Pantalla CRT verde con `ls`, `cd`, `cat`, `python` y `pip`; nunca ejecuta nada real.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/capturas/20b-final-2.png" alt="Final" width="400"><br><sub><b>Final.</b> Tres epílogos según las conciencias rescatadas, y el regreso de Marga.</sub></td>
    <td align="center"><img src="docs/capturas/21-demo-arte.png" alt="Demo del arte" width="400"><br><sub><b>Demo del arte</b> (<code>/?demo</code>). SaraDev con 8 expresiones y 10 animaciones, PATO y el kit de UI.</sub></td>
  </tr>
</table>

<details>
<summary>Más capturas: opciones, pausa, binario, hologramas y el bug de la central</summary>
<br>
<table>
  <tr>
    <td align="center"><img src="docs/capturas/04-opciones.png" alt="Opciones" width="400"><br><sub>Opciones: volúmenes, modo sin presión, escalado y pantalla completa.</sub></td>
    <td align="center"><img src="docs/capturas/11-pausa.png" alt="Pausa" width="400"><br><sub>Pausa con Esc: continuar, opciones o guardar y salir.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/capturas/12-puzzle-binario.png" alt="Puzzle binario" width="400"><br><sub>Binario: interruptores de 128 a 1 que forman la dirección del rack.</sub></td>
    <td align="center"><img src="docs/capturas/15-acto2-holograma.png" alt="Holograma" width="400"><br><sub>Un holograma del sector metro habla al acercarse.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/capturas/17-puzzle-bug.png" alt="Cazar el bug" width="400"><br><sub>Cazar el bug: la línea con `=` en vez de `==`.</sub></td>
    <td align="center"><img src="docs/capturas/07-acto1-oficina.png" alt="Oficina del acto 1" width="400"><br><sub>La oficina de Kernel & Co. con el HUD: uptime, conciencias y ticket activo.</sub></td>
  </tr>
</table>
</details>

Las capturas se regeneran con `npm run capturas` (recorre el juego entero con Playwright y las guarda en `docs/capturas/`).

## Cómo se juega

El bucle es siempre el mismo y crece en dificultad: **explorar → aceptar un ticket → resolverlo contra reloj → cerrar el sector**.

1. **Explorá** el mapa en vista cenital, hablá con PATO y leé los post-its de Marga.
2. **Usá una terminal** del mundo para abrir el briefing del ticket que CRON tiene en cola.
3. **Resolvé el puzzle** en primer plano antes de que venza el plazo. PATO da pistas a cambio de un 10% de la recompensa.
4. **Cerrá el ticket** y sumá conciencias y uptime. Si el plazo vence, El Recolector hace rollback y el reintento vale un 25% menos.
5. Al cerrar todos los tickets del acto, CRON abre el siguiente. La partida se guarda sola en el navegador.

| Tecla | Acción |
|---|---|
| `WASD` / flechas | Mover a SaraDev en 8 direcciones |
| `E` | Usar: hablar, leer, abrir una terminal |
| `E` / `Espacio` | Avanzar el diálogo |
| `Mouse` | Resolver los puzzles de los actos 1 y 2 |
| `H` | Pedir una pista a PATO (-10% de la recompensa) |
| `Teclado` · `Tab` · `↑ ↓` | Terminal del acto 3: escribir, autocompletar y recorrer el historial |
| `Esc` | Pausa, volver o abandonar un ticket |
| `Enter` | Confirmar |

**Modo sin presión:** en Opciones, los plazos dejan de correr para jugar sin reloj.

## Los tres actos

| Acto | Dónde | Cómo se resuelve | Tickets |
|---|---|---|---|
| **1 · Onboarding** | Oficinas de Kernel & Co. (sala fría, oficina abierta, sala de reuniones) | Mouse, puzzles simples | #0007 Reconectar el switch del piso 3 (cableado) · Fijar la dirección del rack 7 (binario) · Reordenar la cola del proxy (paquetes) · Reparar la lógica del portón (compuertas AND, OR, XOR, NAND) |
| **2 · Producción** | Las calles de Puerto Cero: metro, central eléctrica y antena | Mouse con lógica de código | Reordenar el despachador del metro (ordenar líneas) · Cazar el bug de la central · Alinear la antena y su código (sangría de Python) |
| **3 · Deploy** | El núcleo de ARCA | Terminal simulada | Encontrar el log de Marga · Preparar el entorno de `puente.py` (`venv`) · Instalar las dependencias (`pip`) · Desplegar `puente.py` (`--check`, `--fix-config`, `--restore all`) |

Cada acto tiene su mapa, su tileset, su pista musical y sus diálogos de apertura y cierre. El mundo se degrada de un acto al otro: la electricidad falla, la vegetación avanza y las pantallas muestran estática.

## Personajes

| Personaje | Rol |
|---|---|
| **SaraDev** | Protagonista. Junior en su primer trabajo, con síndrome de impostor. Su arco va de "no sé nada" a "hice un deploy a producción en soledad". |
| **PATO** | Pato de goma con parlante, viejo asistente de *rubber duck debugging*. Guía y da pistas. *"¿Ya probaste explicármelo en voz alta?"* |
| **CRON** | El planificador de ARCA. No es malvado, es burocrático: emite tickets con plazos en texto monoespaciado. |
| **El Recolector** | El *garbage collector* de ARCA. Libera los sectores "sin referencias": si un plazo vence, hace rollback. |
| **Marga, la senior** | Mentora ausente, atrapada en ARCA. Dejó post-its con consejos por toda la oficina. Reencuentro en el final. |
| **Hologramas** | Las personas atrapadas. Hablan por los parlantes al restaurarse un sector: *"¿Hola? Mi gato quedó afuera."* |

## Características

- 🕹️ **Exploración cenital** de 3 actos: oficinas, ciudad abandonada y núcleo digital
- 🧩 **7 tipos de puzzle** en primer plano: cableado, binario, paquetes, compuertas, ordenar código, cazar el bug y sangría de Python
- ⌨️ **Terminal simulada** con `ls`, `cd`, `pwd`, `cat`, `echo`, `clear`, `help`, `python`, `pip` y `source`, historial, autocompletado y errores que imitan a los reales. Nunca ejecuta nada de verdad
- ⏱️ **11 tickets con plazo**, pistas de PATO, rollback y un modo sin presión
- 💾 **Guardado automático** en el navegador tras cada ticket; el menú continúa donde quedaste
- 🎨 **Pixel art de 320×180** generado por código con la paleta Sweetie 16, escalado entero y fondos synthwave
- 🎵 **Banda sonora chiptune** de 4 canales al estilo NES (2 pulsos, triángulo y ruido) sintetizada en el navegador: 11 pistas y 17 efectos
- 🎬 **Intro, pausa, opciones, tres finales y créditos**
- 🔒 **Web estática y segura**: sin backend, contenedor sin root y CSP estricta
- ✅ **153 tests unitarios y 18 e2e** en cada PR, con imagen Docker publicada desde `main`

## Estado del proyecto

| Etapa | Descripción | Progreso | Estado |
|---|---|---|---|
| 0 · Fundaciones | AGENTS.md, skills, SDD, plan y cuestionario | `██████████` 100% | ✅ Completa |
| 1 · Lore y pantallas | Historia, personajes, 15 pantallas y catálogo de puzzles | `██████████` 100% | ✅ Las 15 pantallas, 11 tickets, intro y 3 epílogos en el juego |
| 2 · Musicalización | 11 pistas y unos 20 efectos de sonido 8-bit | `██████████` 100% | ✅ Motor chiptune propio; las 11 pistas y 17 efectos sintetizados |
| 3 · Diseño gráfico | Paleta, sprites, tilesets y kit de UI | `████████░░` 80% | 🚧 SaraDev completa, PATO, hologramas, tilesets de los 3 actos, kit de UI, CRT, synthwave y demo en `/?demo` |
| 4 · Implementación | Juego en Phaser y deploy en Docker | `██████████` 100% | ✅ **Juego completo con CI y release**: las 14 specs de la hoja de ruta están terminadas |

**Hitos:** 🎯 Slice vertical (2026-11-12) · 🎯 Acto 2 completo (2026-11-13) · 🎯 Release con CI e imagen en GHCR (2026-11-13).

**Lo que sigue** ya no está en la hoja de ruta: pulido de arte y música con ojos y oídos humanos, más tickets por acto y balance de plazos.

**Siguiente paso:** mergear `develop` en `main` para que la CI publique la primera imagen, y jugar el juego entero a mano.

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
<summary><b>Juego completo</b> (6/6) ✅</summary>

- [x] 007 · Puzzles del acto 1 y guardado · 2026-11-12
- [x] 008 · Acto 2: Puerto Cero y puzzles de código · 2026-11-13
- [x] 009 · Terminal simulada y núcleo de ARCA · 2026-11-13
- [x] 010 · Tickets del acto 3 (venv, pip y `puente.py`) · 2026-11-13
- [x] 011 · Menús, pausa, opciones, intro, final y créditos · 2026-11-13
- [x] 012 · CI y publicación de la imagen · 2026-11-13

</details>

<details>
<summary><b>Arte y audio generados por código</b> (2/2) ✅</summary>

- [x] 013 · Sistema de arte procedural: SaraDev (expresiones y animaciones), PATO y kit de UI · 2026-11-12
- [x] 014 · Motor chiptune de 4 canales y efectos sintetizados · 2026-11-12 (las 11 pistas completadas en las specs 008 a 011)

</details>

Detalle y criterios de cada etapa en [docs/00-plan.md](docs/00-plan.md).

## Stack tecnológico

| Área | Tecnología |
|---|---|
| Motor y lenguaje | [Phaser 4](https://phaser.io) · TypeScript · Vite 8 |
| Tests | Vitest (lógica pura) · Playwright (e2e sobre `data-scene` y `window.__debug`) |
| Arte | Generado por código (matrices de píxeles → texturas) · Tiled para mapas |
| Música | Sintetizador chiptune propio (Web Audio, 4 canales) · efectos tipo sfxr · partituras en JSON |
| Contenido | Actos, tickets, diálogos y textos en JSON (`src/data/`), validados por tests |
| Deploy | Docker multi-stage · nginx sin privilegios · GitHub Actions y GHCR |
| Desarrollo asistido | Claude Code · skills de proyecto · MCP Playwright y Context7 |

Justificación y alternativas en [docs/04-arquitectura/stack-y-herramientas.md](docs/04-arquitectura/stack-y-herramientas.md).

## Primeros pasos

**Requisitos:** Node 24 LTS y Docker Desktop.

```bash
# Desarrollo (recarga en caliente)
npm install
npm run dev                 # http://localhost:5173
                            # http://localhost:5173/?demo → demo del arte

# Calidad y tests
npm run typecheck           # tsc --noEmit
npm test                    # lógica (Vitest)
npm run e2e:install         # una vez: descarga Chromium
npm run e2e                 # Playwright (levanta el dev server solo)
npm run capturas            # regenera las capturas del README en docs/capturas/

# Producción en Docker
docker compose up --build   # http://localhost:8080

# Imagen publicada (tras cada merge a main)
docker run --rm -p 8080:8080 ghcr.io/dev-rafael-arevalo/videogame-404-devs-not-found:latest
```

Si Windows bloquea el Chromium de Playwright, `PW_CHANNEL=msedge npm run e2e` usa el Edge del sistema.

## Estructura del repositorio

```
├── docs/              Documentación por etapa (lore, música, arte, arquitectura) y capturas/
├── specs/             Desarrollo guiado por specs: constitución, plantillas y una carpeta por feature
├── .claude/skills/    Skills para agentes de IA
├── assets-src/        Fuentes editables de arte, música y mapas
├── src/
│   ├── scenes/        Boot, Título, Menú, Opciones, Intro, Mundo, HUD, Diálogo, Briefing, Puzzle,
│   │                  Terminal, Resultado, Rollback, Pausa, Final y Demo
│   ├── logic/         Lógica pura de puzzles, plazos, progreso y guardado (testeada con Vitest)
│   ├── terminal/      Terminal simulada: parser, sistema de archivos virtual, historial y comandos
│   ├── puzzles/       Vistas de Phaser de cada puzzle, registradas en registry.ts
│   ├── art/           Sprites, tilesets, retratos, UI y fondos generados por código
│   ├── audio/         AudioManager y motor chiptune
│   └── data/          actos.json, tickets/, textos/es.json y partituras en musica/
├── scripts/           Generadores (mapas de los actos desde planos ASCII)
├── public/assets/     Assets exportados (mapas, fuentes)
├── tests/e2e/         Tests de Playwright y el generador de capturas
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

👉 **Antes de contribuir:** lee [CONTRIBUTING.md](CONTRIBUTING.md) (ramas, commits y PRs) y [docs/mapa-del-proyecto.md](docs/mapa-del-proyecto.md) (qué lleva cada archivo y qué falta).
Principios no negociables en [specs/constitucion.md](specs/constitucion.md).

## Documentación

| Documento | Contenido |
|---|---|
| [Guía de contribución](CONTRIBUTING.md) · [Mapa del proyecto](docs/mapa-del-proyecto.md) | Cómo trabajar, qué lleva cada archivo y qué falta |
| [Plan](docs/00-plan.md) · [Cuestionario](docs/cuestionario.md) | Etapas, hitos y decisiones pendientes |
| [Lore](docs/01-lore/lore.md) · [Pantallas](docs/01-lore/pantallas.md) | Historia, personajes, flujo y wireframes |
| [Música](docs/02-musica/musica.md) | Pistas, efectos de sonido, notación de las partituras y motor |
| [Arte](docs/03-arte/guia-arte.md) | Paleta, sprites, sombras, texturas y pipeline |
| [Arquitectura](docs/04-arquitectura/arquitectura.md) | Escenas, datos y terminal simulada |
| [Seguridad](docs/04-arquitectura/seguridad.md) · [Docker](docs/04-arquitectura/docker.md) | CSP, hardening y despliegue |

## Changelog

Formato: la entrada más reciente arriba. Lo actualiza la skill `implementar-spec` al cerrar cada spec.

### 2026-11-15: README con capturas
- Galería de 23 capturas del juego en `docs/capturas/`, generadas con `npm run capturas` (un spec de Playwright que recorre Boot, menú, intro, los tres actos, puzzles, terminal, rollback, final y demo)
- README reescrito: cómo se juega, controles, los tres actos con sus tickets, personajes y estructura detallada
- El Título ya no dice "slice vertical en construcción"

### 2026-11-13: Opción de escalado
- Opciones → Escalado: "Entero (nítido)" mantiene los píxeles perfectos; "Ajustar a la ventana" llena la ventana aunque el múltiplo no sea entero, para pantallas o ventanas chicas
- Las teclas discretas (menús, Esc, Intro, Final) se atienden una sola vez por evento aunque haya varias escenas activas

### 2026-11-13: Spec 012, CI y release
- Cada PR a `develop` o `main` corre typecheck, tests, build, auditoría de dependencias y el e2e con Playwright, y construye la imagen Docker
- Cada merge a `main` publica la imagen en GitHub Container Registry (`latest`, `sha-…` y la etiqueta de versión)
- Dependabot vigila npm, las acciones y la imagen base de nginx

### 2026-11-13: Spec 011, del menú a los créditos
- Menú principal con Nueva partida, Continuar, Opciones y Créditos
- Opciones: volumen de música y de efectos, modo sin presión (los plazos no corren) y pantalla completa; se recuerdan entre sesiones
- Intro en cinco viñetas: Puerto Cero, las 06:00, los 0,3 segundos, la sala fría y el primer día
- Pausa con Esc: continuar, opciones o guardar y salir; la música baja mientras tanto
- Tres finales según las conciencias rescatadas (todas, la mayoría o pocas), con el regreso de Marga, y créditos que suben; pistas M02 y M09

### 2026-11-13: Spec 010, el deploy
- Tres tickets nuevos en el núcleo: crear y activar el venv, instalar las dependencias con `pip` (que se queja si no activaste el entorno) y desplegar: `python puente.py --check`, `--fix-config` y `--restore all` con su barra de progreso
- Cada ticket arranca donde terminó el anterior; CRON cierra el acto con las conciencias al 100%

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


<div align="center">
<sub>Hecho con Phaser, TypeScript y un pato de goma. 🦆</sub>
</div>
