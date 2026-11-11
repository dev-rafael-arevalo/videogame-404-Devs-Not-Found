# Stack, herramientas y MCP

Elegido por **simplicidad**: un solo lenguaje (TypeScript), sin backend y fácil de servir en Docker.

## Stack del juego

| Pieza | Elección | Por qué | Alternativa descartada |
|---|---|---|---|
| Motor | **Phaser** (3.90, o 4 si ya es estable; se verifica en la spec 001) | Motor 2D web maduro, con soporte nativo de pixel art, Tiled, hojas de Aseprite y audio | Godot (exportar a web y Dockerizarlo es más engorroso) · Pygame (Docker con interfaz gráfica es complicado) |
| Lenguaje | **TypeScript** | Tipos para el JSON de tickets; mismo lenguaje en todo el proyecto | — |
| Bundler | **Vite** | Arranque instantáneo y build estático en `dist/` | Webpack |
| Tests | **Vitest** y **Playwright** | Vitest comparte la configuración de Vite; Playwright también lo usa el MCP | Jest |
| Calidad | `tsc --noEmit` y ESLint | Lo mínimo útil | — |
| Runtime de build | **Node 24 LTS** | LTS vigente | — |
| Servidor | **nginx sin privilegios** (Alpine) | Sirve estáticos, sin root y con imagen chica | Node/Express (innecesario) |
| Guardado | `localStorage` | Cero infraestructura | Backend con base de datos |

## Herramientas de contenido

| Etapa | Herramienta | Costo |
|---|---|---|
| Arte | Aseprite / LibreSprite / Piskel | USD 20 / gratis / gratis |
| Mapas | Tiled | Gratis |
| Música | FamiStudio / BeepBox | Gratis |
| Efectos de sonido | jsfxr (sfxr.me) | Gratis |
| Audio | Audacity | Gratis |
| Mockups de UI (opcional) | Figma | Gratis |

## Desarrollo guiado por specs (SDD)

Versión **liviana y propia**, compatible con la idea de GitHub Spec Kit:
`specs/constitucion.md`, `specs/_plantillas/` y una carpeta `specs/NNN-slug/` por feature con `spec.md`, `plan.md` y `tasks.md`.
Se maneja con las skills `nueva-spec` e `implementar-spec`.

Opcional: si más adelante se quiere la herramienta oficial,
`uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai claude` agrega los
comandos `/speckit.*` con la misma estructura (`specs/NNN-*/`). Verificar el comando en el repositorio de spec-kit antes de usarlo.

## MCP recomendados (mínimo indispensable)

Declarados en [`.mcp.json`](../../.mcp.json):

| MCP | Para qué | Etapa |
|---|---|---|
| **playwright** (`@playwright/mcp`) | El agente abre `localhost:5173`, juega, saca capturas y revisa la consola. Es clave para verificar trabajo visual | 4 |
| **context7** (`@upstash/context7-mcp`) | Documentación actualizada de Phaser, Vite y Vitest, para no inventar APIs | 4 |

No hacen falta:
- **GitHub MCP**: la CLI `gh` cubre issues, PRs y Actions con menos configuración.
- **Docker MCP**: el agente usa `docker` y `docker compose` por Bash.
- Arte y música son trabajo humano con herramientas de escritorio. El agente redacta briefs, integra los assets y genera placeholders.

Opcional: el **MCP de Figma** (ya disponible como plugin, requiere autenticación) si se hacen mockups de UI en Figma.

> En Windows, `.mcp.json` usa `cmd /c npx …`. En Linux o macOS, se cambia por `"command": "npx"`.

## Skills del proyecto (`.claude/skills/`)

| Skill | Cuándo |
|---|---|
| `nueva-spec` | Crear `specs/NNN-slug/` (spec, plan y tareas) desde una idea |
| `implementar-spec` | Ejecutar `tasks.md` de una spec, testear, verificar y actualizar el README |
| `nueva-actividad` | Diseñar un ticket o puzzle en JSON, con su validación |
| `pixel-art` | Brief, convenciones, exportación e integración de sprites |
| `musica-8bit` | Brief de pistas y efectos, exportación e integración de audio |

## Flujo de GitHub

- `main` (estable, se publica en cada hito) y `develop` (integración). Detalle completo en [CONTRIBUTING.md](../../CONTRIBUTING.md).
- Una rama `spec/NNN-slug` y un PR contra `develop` por spec. La plantilla de PR exige el enlace a la spec y la checklist.
- CI (spec 012): `npm ci`, typecheck, tests y build en cada PR; build de la imagen Docker en `main`.
