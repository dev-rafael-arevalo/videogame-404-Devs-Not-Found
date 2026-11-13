# Mapa del proyecto: qué lleva cada archivo y qué falta

> Documento vivo. Al completar algo, marca `[x]` y actualiza el README (ver [CONTRIBUTING.md](../CONTRIBUTING.md)).
> Estado: ✅ listo · 📝 borrador, hay que completarlo · ⬜ por crear · 🔒 no tocar salvo motivo

## Resumen: lo que bloquea al proyecto hoy

1. ✅ Cuestionario respondido (2026-11-12). Quedan abiertas la 7 (personajes secundarios), la 13 (comandos) y la 22 (equipo).
2. ✅ Specs 001 y 002 terminadas. ⛔ **Siguiente:** spec 003 (interacción y diálogos) y spec 013 (arte procedural completo de SaraDev).
3. Catálogo de tickets del acto 1 (Narrativa). Sin él no se puede diseñar el puzzle de la spec 005.
4. ✅ Paleta confirmada (Sweetie 16 + verde terminal, en `src/art/palette.ts`). Falta la fuente pixel (se genera por código en la 013).

---

## Raíz del repositorio

| Archivo | Qué debe llevar | Rol | Estado | Qué falta |
|---|---|---|---|---|
| `README.md` | Presentación, estado por etapa, hoja de ruta, changelog, créditos y licencia | Lead (lo actualizan todos) | ✅ | Créditos con nombres, licencia, título definitivo |
| `CONTRIBUTING.md` | Roles, ramas, commits y PRs | Lead | ✅ | Ajustar si cambia el flujo |
| `AGENTS.md` | Contexto e instrucciones para agentes de IA: stack, reglas y comandos | Desarrollo | ✅ | Mantener los comandos al día |
| `CLAUDE.md` | Solo importa AGENTS.md y agrega lo específico de Claude Code | Desarrollo | 🔒 | — |
| `.mcp.json` | MCP del proyecto (playwright con `--browser chromium` y context7) | Desarrollo | 📝 | Fijar versiones exactas; variante para Linux o macOS si alguien no usa Windows |
| `.gitignore` | Archivos que no se suben | Desarrollo | ✅ | — |
| `package.json`, `tsconfig.json`, `vite.config.ts`, `playwright.config.ts`, `index.html` | Configuración del proyecto | Desarrollo | ✅ | — |
| `Dockerfile`, `nginx.conf`, `docker-compose.yml`, `.dockerignore` | Deploy (según [docker.md](04-arquitectura/docker.md)); nginx `1.29-alpine` | Desarrollo | ✅ | — |
| `LICENSE` | Licencia del código (y aparte la de los assets) | Lead | ⬜ | Decidir (sugerencia: MIT para el código, CC BY-NC para los assets) |

## `.github/`

| Archivo | Qué debe llevar | Rol | Estado | Qué falta |
|---|---|---|---|---|
| `pull_request_template.md` | Checklist de cada PR | Lead | ✅ | — |
| `ISSUE_TEMPLATE/tarea.md` · `bug.md` | Plantillas de issues | Lead | ✅ | — |
| `workflows/ci.yml` | typecheck, tests y build en cada PR; imagen Docker en `main` | Desarrollo | ⬜ | Spec 012 |
| `dependabot.yml` | Actualizaciones de npm y Docker | Desarrollo | ⬜ | Spec 012 |
| `CODEOWNERS` | Revisor automático por carpeta | Lead | ⬜ | Cuando haya usuarios de GitHub por rol |

## `docs/`: documentación

| Archivo | Qué debe llevar | Rol | Estado | Qué falta |
|---|---|---|---|---|
| `00-plan.md` | Etapas, entregables, hitos y hoja de ruta de specs | Lead | ✅ | Mantenerlo al día |
| `cuestionario.md` | Decisiones abiertas del proyecto | Lead | ✅ | Quedan la 7, 13 y 22 |
| `mapa-del-proyecto.md` | Este archivo | Lead | ✅ | Marcar avances |
| `01-lore/lore.md` | Mundo, personajes, actos, mecánicas con justificación, tono y glosario | Narrativa | 📝 | Validar nombres (🔸), descripción física de cada personaje (para Arte), los 3 epílogos según el porcentaje rescatado |
| `01-lore/pantallas.md` | Las 15 pantallas: propósito, controles, música, flujo y wireframes | Narrativa y Arte | 📝 | Wireframes de P02, P03, P09, P12, P14 y P15; layout de zonas de cada acto |
| `01-lore/catalogo-tickets.md` | Por acto, 4–5 tickets con id, título, tipo de puzzle, plazo, dificultad y concepto que enseña | Narrativa | ⬜ | **Crearlo** (empezar por el acto 1) |
| `01-lore/guion.md` | Textos de la intro (P05), diálogos de PATO por acto, post-its de Marga (10 o más), frases de hologramas, mensajes de CRON y epílogos | Narrativa | ⬜ | Crearlo |
| `02-musica/musica.md` | Dirección, lista de pistas, efectos de sonido y decisión de síntesis en código | Música | 📝 | Partituras JSON por pista (spec 014) |
| `03-arte/guia-arte.md` | Resolución, paleta, estilo, sombras, texturas, componentes, layouts y decisión de arte procedural | Arte | 📝 | Hoja de personaje de SaraDev en la spec 013 |
| `04-arquitectura/arquitectura.md` | Escenas, carpetas, modelo de datos, terminal y testing | Desarrollo | ✅ | Ajustar al implementar |
| `04-arquitectura/stack-y-herramientas.md` | Stack elegido, herramientas, MCP, skills y flujo de GitHub | Desarrollo | ✅ | Phaser 4.2.1 confirmado |
| `04-arquitectura/seguridad.md` | Terminal simulada, CSP, contenedor, dependencias y checklist | Desarrollo | ✅ | — |
| `04-arquitectura/docker.md` | Plantillas de Docker y verificación | Desarrollo | ✅ | — |

## `specs/`: desarrollo guiado por specs

| Archivo | Qué debe llevar | Rol | Estado | Qué falta |
|---|---|---|---|---|
| `constitucion.md` | 10 principios no negociables | Lead | 📝 | Aprobación del equipo |
| `_plantillas/` | Plantillas de spec, plan y tareas | — | 🔒 | — |
| `001-base-proyecto/` | Esqueleto de Vite, Phaser 4, tests y Docker | Desarrollo | ✅ | Terminada 2026-11-12 |
| `002-movimiento-personaje/` | Movimiento de SaraDev, colisiones y cámara | Desarrollo | ✅ | Terminada 2026-11-12 |
| `003` … `014` | Ver la hoja de ruta en [00-plan.md](00-plan.md) | Desarrollo | ⬜ | Crear cada una con `/nueva-spec` (013 arte procedural y 014 chiptune son nuevas) |

## `assets-src/`: fuentes editables (no las carga el juego)

| Ruta | Qué debe llevar | Rol | Estado | Qué falta |
|---|---|---|---|---|
| `arte/briefs/*.md` | Un brief por asset: tamaño, animaciones, colores y referencias (skill `/pixel-art`) | Arte (o el agente) | ⬜ | Briefs de Dev, PATO, El Recolector, hologramas, gato, tilesets por acto y kit de UI |
| `arte/*.aseprite` | Archivos fuente de sprites, tiles y UI | Arte | ⬜ | Todo |
| `arte/CREDITOS.md` | Autor y licencia de cada asset de terceros | Arte | ✅ | Completarlo cuando se use algo de terceros |
| `mapas/*.tmx` | Mapas de Tiled por acto (capas `suelo`, `objetos`, `colision` y `encima`) | Arte y Narrativa | 📝 | El acto 1 se genera con `scripts/generate-map-acto1.mjs` (plano ASCII → Tiled JSON); los actos 2 y 3 faltan |
| `musica/briefs/*.md` | Un brief por pista (skill `/musica-8bit`) | Música (o el agente) | ⬜ | M01–M09, J01 y J02 |
| `musica/*.fms` | Proyectos de FamiStudio | Música | ⬜ | Todas las pistas |
| `musica/sfx/*.json` | Parámetros de jsfxr de cada efecto de sonido | Música | ⬜ | Los efectos de sonido de [musica.md](02-musica/musica.md) |
| `musica/CREDITOS.md` | Autor y licencia de terceros | Música | ✅ | Ídem |

## Lo que se crea con el código (desde la spec 001)

| Ruta | Qué debe llevar | Rol | Spec |
|---|---|---|---|
| `src/scenes/` | Una escena de Phaser por pantalla (✅ `BootScene`, `TitleScene`, `WorldScene`, `markScene`) | Desarrollo | 001 → 011 |
| `src/entities/` | Entidades del mundo (✅ `Player`) | Desarrollo | 002+ |
| `scripts/` | Generadores (✅ mapa del acto 1) | Desarrollo | 002+ |
| `src/logic/` | Lógica pura con tests (✅ `scale.ts`, `movement.ts`; luego plazos, progreso, guardado, validadores) | Desarrollo | 001 → 007 |
| `src/art/` | Paleta, `pixelTexture`, tileset del acto 1 y SaraDev mínima (✅); resto de sprites y UI | Desarrollo y Arte | 001, 002, 013 |
| `src/audio/` | `AudioManager` y motor chiptune | Desarrollo y Música | 006, 014 |
| `src/puzzles/` | La vista de cada tipo de puzzle | Desarrollo | 005, 007, 008 |
| `src/terminal/` | Parser, sistema de archivos virtual y comandos simulados | Desarrollo | 009 |
| `src/data/tickets/*.json` | Un JSON por ticket | Narrativa (con `/nueva-actividad`) | 004+ |
| `src/data/textos/es.json` | Todos los textos visibles del juego (✅ boot y título) | Narrativa | 001+ |
| `public/assets/sprites/` · `maps/` · `audio/` · `fonts/` | Exportaciones finales | Arte y Música | 001+ |
| `tests/e2e/` | Tests de Playwright (✅ `smoke.spec.ts`, `world.spec.ts`) | Desarrollo | 001+ |
