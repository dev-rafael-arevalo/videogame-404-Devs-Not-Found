# AGENTS.md

Guía para agentes de IA (Claude Code u otros) que trabajen en este repositorio.

## Qué es este proyecto

Videojuego 2D retro (pixel art + música chiptune 8-bit) con temática de programación.
Título provisional: **SYS://RESTORE**. La persona protagonista, **Dev**, es la única desarrolladora
de turno en un mundo donde toda la humanidad fue "respaldada" dentro de un programa llamado ARCA.
Se mueve por el mundo (vista cenital), acepta *tickets* con plazo y los resuelve como puzzles en
primer plano: primero con el mouse y, al final, escribiendo comandos en una terminal simulada para
levantar una app en Python.

- Lore completo: [docs/01-lore/lore.md](docs/01-lore/lore.md)
- Pantallas: [docs/01-lore/pantallas.md](docs/01-lore/pantallas.md)
- Plan por etapas: [docs/00-plan.md](docs/00-plan.md)
- Preguntas abiertas: [docs/cuestionario.md](docs/cuestionario.md). Si una decisión depende de algo que sigue sin responder ahí, pregunta antes de inventar.

## Estado actual

Etapa 0: solo hay documentación y specs, todavía no hay código. El código se crea al implementar
[specs/001-base-proyecto](specs/001-base-proyecto/spec.md). Cuando exista, actualiza la sección
**Comandos** con los scripts reales de `package.json`.

## Stack (resumen; detalle en [docs/04-arquitectura/stack-y-herramientas.md](docs/04-arquitectura/stack-y-herramientas.md))

- **Juego:** Phaser + TypeScript + Vite. Web estática, sin backend.
- **Tests:** Vitest para la lógica pura y Playwright para el smoke e2e.
- **Arte:** Aseprite/LibreSprite y Tiled. Resolución nativa de 320×180 escalada ×4.
- **Música:** FamiStudio/BeepBox y jsfxr para los efectos de sonido.
- **Deploy:** Docker multi-stage (build con Node y nginx sin privilegios para servir estáticos).

## Estructura (objetivo)

```
docs/            Documentación por etapa (lore, música, arte, arquitectura)
specs/           Desarrollo guiado por specs (SDD): constitución, plantillas y una carpeta por feature
.claude/skills/  Skills del proyecto (nueva-spec, implementar-spec, nueva-actividad, pixel-art, musica-8bit)
assets-src/      Fuentes editables (.aseprite, .fms, .tmx). No se sirven.
public/assets/   Assets exportados que carga el juego (se crea en la spec 001)
src/             Código del juego (se crea en la spec 001)
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
- **El contenido va en datos:** actos, tickets, diálogos y textos viven en JSON dentro de `src/data/`.
- **Idioma:** identificadores de código en inglés; textos del juego y documentación en español.
- **Pixel-perfect:** 320×180, `pixelArt: true` y escalado entero.
- **El README refleja el avance.** Al terminar una spec, o cualquier entregable de las etapas 1–3, actualiza en `README.md` la tabla *Estado del proyecto* (porcentaje y estado), la *Hoja de ruta*, el *Changelog* (entrada arriba de todo, con fecha `AAAA-MM-DD`), la fecha de *Última actualización* y el badge de etapa. Después actualiza `docs/00-plan.md`.
- No hagas commit ni push salvo que se pida. Ramas y commits según [CONTRIBUTING.md](CONTRIBUTING.md): salen de `develop`, se llaman `spec/NNN-slug` y el PR va contra `develop`.
- Qué lleva cada archivo y qué falta: [docs/mapa-del-proyecto.md](docs/mapa-del-proyecto.md). Actualízalo al completar algo.

## Comandos

_Pendiente de la spec 001._ Previstos:

```bash
npm run dev            # Vite en http://localhost:5173
npm run build          # build de producción en dist/
npm test               # Vitest (lógica)
npx vitest run src/logic/deadline.test.ts -t "expira"   # un solo test
npm run e2e            # Playwright (smoke)
npm run typecheck      # tsc --noEmit
docker compose up --build   # juego en http://localhost:8080
```

## MCP disponibles (en `.mcp.json`)

- **playwright**: abre el juego en el navegador, saca capturas y prueba el flujo. Úsalo para verificar cambios visuales.
- **context7**: documentación actualizada de Phaser, Vite y Vitest. Consúltala antes de usar APIs de Phaser de memoria.
- Para GitHub (issues y PRs) usa la CLI `gh`; no hace falta un MCP.
