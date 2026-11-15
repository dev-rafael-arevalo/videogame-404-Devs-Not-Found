# Tareas 001: Base del proyecto

Referencia: [spec.md](spec.md) · [plan.md](plan.md)

Orden de ejecución. `[P]` = se puede hacer en paralelo con la anterior. Marcar `[x]` al terminar.

## Preparación
- [x] T1: `package.json`, `tsconfig.json`, `vite.config.ts`, `playwright.config.ts`, `index.html`, `src/style.css` y `npm install`
- [x] T2: [P] Carpetas de la estructura objetivo con `.gitkeep`

## Tests primero (lógica pura)
- [x] T3: `src/logic/scale.test.ts` con los casos del plan (falla hasta T4)

## Implementación
- [x] T4: `src/logic/scale.ts` (`integerZoom`) hasta que pase T3
- [x] T5: [P] `src/art/palette.ts` y `src/data/textos/es.json`
- [x] T6: `src/config.ts` y `src/main.ts` (zoom entero y `resize`)
- [x] T7: `src/scenes/markScene.ts`, `BootScene.ts` (BIOS + barra, cualquier tecla salta) y `TitleScene.ts` (título, lluvia, START parpadeando)
- [x] T8: `tests/e2e/smoke.spec.ts`
- [x] T9: [P] `Dockerfile`, `nginx.conf`, `docker-compose.yml`, `.dockerignore` (tag de nginx fijado)
- [x] T10: Sección **Comandos** de `AGENTS.md`

## Verificación y cierre
- [x] T11: `npm run typecheck && npm test && npm run e2e` en verde
- [x] T12: Verificación visual con el MCP de Playwright (captura a 1280×720 y a otro tamaño) y revisión de consola
- [x] T13: `docker compose up --build`: healthy, UID 101, cabeceras CSP (ver docker.md)
- [x] T14: Actualizar `README.md` (estado, hoja de ruta, changelog), `docs/00-plan.md` y `docs/mapa-del-proyecto.md`
