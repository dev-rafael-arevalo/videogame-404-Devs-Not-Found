# Plan 012: CI y release

Referencia: [spec.md](spec.md)

## Enfoque técnico
- `.github/workflows/ci.yml`: dos jobs. `verificar` (ubuntu-latest, Node 24 con caché de npm): ci, typecheck, test, build, audit, Playwright e2e con artefacto en fallo. `docker` (necesita `verificar`): `docker/build-push-action` con `push: false` y caché de GitHub Actions.
- `.github/workflows/docker.yml`: en `push` a `main` y tags `v*`: login a GHCR con `GITHUB_TOKEN`, `docker/metadata-action` para las etiquetas (`latest`, `sha-…`, `v…`), build y push. Permisos mínimos: `contents: read`, `packages: write`.
- `.github/dependabot.yml`: npm, github-actions y docker, semanal, `target-branch: develop`, PRs agrupadas para las dependencias menores.
- Verificación local: los mismos comandos que la CI (sin Actions) y `docker compose up --build` con las comprobaciones de `docker.md`. Validación de los YAML con un parser.

## Archivos
Crear: `.github/workflows/ci.yml`, `.github/workflows/docker.yml`, `.github/dependabot.yml`. Modificar: `README.md`, `docs/04-arquitectura/docker.md`, `CONTRIBUTING.md`, `AGENTS.md`, `docs/00-plan.md`, `docs/mapa-del-proyecto.md`.

## Dependencias nuevas
Ninguna en el proyecto. Acciones: `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`, `docker/setup-buildx-action@v3`, `docker/login-action@v3`, `docker/metadata-action@v5`, `docker/build-push-action@v6`.

## Verificación
CA1 y CA2 locales; CA3 en GitHub por el Lead.

## Chequeo contra la constitución
- [x] Simple primero · [x] Seguridad (permisos mínimos del token, imagen sin root, `npm audit` en cada PR) · [x] Siempre jugable (`main` protegido por la CI)
