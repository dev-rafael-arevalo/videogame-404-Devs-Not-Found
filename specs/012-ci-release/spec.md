# Spec 012: CI en GitHub Actions y publicación de la imagen

- **Estado:** Terminada (2026-11-13); CA3 la verifica el Lead tras el push
- **Etapa:** 4 Implementación
- **Depende de:** 011

## Problema / objetivo
El juego está completo pero nadie lo verifica automáticamente: cada PR debería pasar typecheck,
tests, build, auditoría de dependencias y el smoke e2e, y cada merge a `main` debería publicar la
imagen Docker lista para desplegar.

## Requisitos funcionales
- RF1: Workflow `ci.yml` en cada push y PR a `develop` y `main`: Node 24, `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm audit --audit-level=high`, Playwright con Chromium (`npx playwright install --with-deps chromium`) y `npm run e2e`; el reporte de Playwright se sube como artefacto si falla. El job de Docker construye la imagen (sin publicar) para validar el `Dockerfile`.
- RF2: Workflow `docker.yml` en cada push a `main` y en tags `v*`: construye y publica `ghcr.io/<repo>:latest` y `:<sha>` (y `:<tag>` cuando hay tag) con `GITHUB_TOKEN`; nombre del repositorio en minúsculas como exige GHCR.
- RF3: `dependabot.yml` para npm, GitHub Actions y Docker, semanal, con PRs contra `develop`.
- RF4: Documentación: README (badge de CI y cómo usar la imagen), `docs/04-arquitectura/docker.md` (publicación), `CONTRIBUTING.md` (la CI debe pasar), `AGENTS.md`.

## Fuera de alcance
Deploy automático a un servidor, firma de imágenes, releases con changelog automático.

## Criterios de aceptación
- [x] CA1: Los YAML son válidos (se parsean) y los scripts que invocan existen en `package.json`.
- [x] CA2: Local: `npm ci`, typecheck, tests, build y `npm audit --audit-level=high` pasan. La parte de `docker compose up --build` quedó pendiente de repetir: el 2026-11-13 el daemon de Docker no estaba disponible (verificada por última vez el 2026-11-12; la CI construye la imagen en cada PR).
- [ ] CA3: Tras el push, el workflow corre en GitHub (lo verifica el Lead; el agente no puede ejecutarlo).

## Preguntas abiertas
- Ninguna.
