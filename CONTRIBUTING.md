# Guía de contribución

Cómo trabaja el equipo en este repositorio. Léela completa antes de tu primer cambio.
Para saber **qué lleva cada archivo y qué falta**, ve a [docs/mapa-del-proyecto.md](docs/mapa-del-proyecto.md).

---

## 1. Roles

| Rol | Se encarga de | Carpetas principales |
|---|---|---|
| **Lead / Producto** | Responder el cuestionario, aprobar specs, revisar PRs a `main` y mantener el plan | `docs/00-plan.md`, `docs/cuestionario.md`, `specs/constitucion.md` |
| **Narrativa** | Lore, guion, diálogos, pantallas y catálogo de tickets | `docs/01-lore/`, `src/data/textos/`, `src/data/tickets/` |
| **Música** | Pistas, jingles y efectos de sonido | `docs/02-musica/`, `assets-src/musica/`, `public/assets/audio/` |
| **Arte** | Paleta, sprites, tilesets, UI y mapas | `docs/03-arte/`, `assets-src/arte/`, `assets-src/mapas/`, `public/assets/sprites/` |
| **Desarrollo** | Código, tests, Docker y CI (con ayuda de agentes de IA) | `src/`, `tests/`, `specs/NNN-*/`, archivos de Docker |

Una misma persona puede tener varios roles. Anota quién tiene cada uno en la sección de créditos del [README](README.md).

## 2. Ramas

```
main ─────────●──────────────────────●────────►  estable · solo recibe PRs desde develop · cada merge es un hito (tag)
               \                    /
develop ────────●──●──●──●──●──●───●──────────►  integración · siempre compila · recibe todos los PRs de trabajo
                 \   / \   / \   /
ramas de trabajo  ●─●   ●─●   ●─●                una por tarea · salen de develop · vuelven a develop por PR · se borran tras el merge
```

### Ramas permanentes
| Rama | Para qué | Quién hace merge |
|---|---|---|
| `main` | Versión estable y jugable. Cada merge lleva un tag (`v0.1.0-slice`, `v1.0.0`) | Lead |
| `develop` | Integración diaria del equipo | Cualquiera, con 1 aprobación |

### Ramas de trabajo ya creadas (punto de partida de cada etapa)
| Rama | Etapa | Rol | Primera tarea |
|---|---|---|---|
| `docs/cuestionario` | 0 | Lead | Responder [docs/cuestionario.md](docs/cuestionario.md) |
| `lore/lore-y-pantallas` | 1 | Narrativa | Cerrar el lore v1, el guion y el catálogo de tickets |
| `musica/pistas-y-sfx` | 2 | Música | Briefs de M01–M09, J01–J02 y los primeros efectos de sonido |
| `arte/kit-base` | 3 | Arte | Paleta, fuente, sprite de Dev y kit de UI |
| `spec/001-base-proyecto` | 4 | Desarrollo | Esqueleto de Phaser y Docker |
| `spec/002-movimiento-personaje` | 4 | Desarrollo | Movimiento de Dev (después de 001) |

### Nombres de ramas nuevas
Siempre salen de `develop` actualizado y usan el formato `<tipo>/<descripcion-corta>`:

| Prefijo | Uso | Ejemplo |
|---|---|---|
| `spec/` | Implementar una spec (con el mismo número) | `spec/003-interaccion-dialogos` |
| `lore/` | Lore, guion, diálogos, tickets | `lore/dialogos-acto-1` |
| `musica/` | Pistas o efectos de sonido | `musica/m03-acto1-oficina` |
| `arte/` | Sprites, tilesets, UI, mapas | `arte/tileset-acto-1` |
| `docs/` | Documentación general | `docs/guia-instalacion` |
| `fix/` | Corrección de un error | `fix/colision-escritorio` |

**Reglas:** en minúsculas, en kebab-case, sin tildes ni ñ; una tarea por rama; la rama se borra después del merge.

## 3. Paso a paso

```bash
# Primera vez (clona FUERA de OneDrive o Dropbox: la sincronización corrompe .git)
git clone https://github.com/dev-rafael-arevalo/videogame-404-Devs-Not-Found.git
cd videogame-404-Devs-Not-Found

# Empezar una tarea
git switch develop
git pull
git switch -c arte/sprite-dev          # o: git switch arte/kit-base (si es una rama ya creada)

# Trabajar y guardar
git add <archivos>
git commit -m "assets(arte): sprite de Dev caminando en 4 direcciones"
git push -u origin arte/sprite-dev

# Abrir un PR en GitHub: base = develop, compare = tu rama. Completa la plantilla.
```

Si tu rama queda vieja: `git switch develop && git pull && git switch <tu-rama> && git merge develop`.

## 4. Commits

Formato `<tipo>(<ámbito>): <descripción en español>`

| Tipo | Uso |
|---|---|
| `feat` | Funcionalidad nueva del juego |
| `fix` | Corrección |
| `docs` | Documentación (lore, guías, specs) |
| `assets` | Arte, música, mapas |
| `test` | Tests |
| `chore` | Configuración, dependencias, Docker, CI |

El ámbito es el número de spec o el área: `feat(002): …`, `docs(lore): …`, `assets(musica): …`.

## 5. Pull requests

- **Base:** `develop`. Solo el Lead abre PRs de `develop` a `main`, en cada hito.
- Completa la [plantilla de PR](.github/pull_request_template.md).
- **Una aprobación** como mínimo, de alguien del rol afectado (los PRs de arte los revisa alguien de Arte o el Lead).
- PRs chicos: idealmente menos de 400 líneas de código o un solo grupo de assets.
- Tras el merge: borra la rama y actualiza el README si cerraste un entregable (estado, hoja de ruta y changelog).

## 6. Reglas por rol

**Narrativa:** escribe en Markdown dentro de `docs/01-lore/` hasta que exista `src/data/`. Desde entonces, los textos del juego van en `src/data/textos/es.json` y los tickets en `src/data/tickets/` (skill `/nueva-actividad`).

**Arte y Música:**
- Sube **siempre** la fuente editable (`assets-src/`) **y** la exportación (`public/assets/`, desde la spec 001).
- Respeta tamaños, paleta, formatos y nombres de [guia-arte.md](docs/03-arte/guia-arte.md) y [musica.md](docs/02-musica/musica.md).
- **No subas WAV ni archivos de más de 10 MB.** La música va en OGG y MP3.
- Todo asset de terceros se registra en `assets-src/*/CREDITOS.md` con su licencia (solo CC0 o CC-BY).

**Desarrollo:**
- Sin spec aprobada no hay código ([constitución](specs/constitucion.md)).
- Flujo con agente: `/nueva-spec` → aprobación del Lead → `/implementar-spec NNN`.
- Antes del PR: `npm run typecheck && npm test && npm run e2e`.

## 7. Configuración recomendada en GitHub (la hace el Lead una vez)

En **Settings → Branches → Add rule**:
- `main`: requerir PR, 1 aprobación y (desde la spec 012) que el CI pase; bloquear el push directo.
- `develop`: requerir PR y 1 aprobación.
- **Settings → General → Default branch:** `develop`, para que los PRs apunten ahí por defecto.
- Activar **Dependabot alerts** en *Security*.
