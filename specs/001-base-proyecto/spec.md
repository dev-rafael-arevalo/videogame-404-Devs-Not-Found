# Spec 001: Base del proyecto

- **Estado:** Borrador
- **Etapa:** 4 Implementación
- **Depende de:** —

## Problema / objetivo
Tener un esqueleto que compile, se pruebe y corra en Docker, sobre el que construir todo lo demás.
Al abrirlo se ve una pantalla de título placeholder a 320×180 escalada sin desenfoque.

## Requisitos funcionales
- RF1: Proyecto con Vite, TypeScript y Phaser en la raíz del repositorio, con la estructura de `docs/04-arquitectura/arquitectura.md` (carpetas vacías con `.gitkeep` donde todavía no haya código).
- RF2: `config.ts` con 320×180, `pixelArt: true`, `Scale.FIT` y centrado. Escenas `BootScene` (barra de carga y texto tipo BIOS) y `TitleScene` (texto "SYS://RESTORE — PRESIONA START").
- RF3: Scripts `dev`, `build`, `preview`, `test` (Vitest), `e2e` (Playwright) y `typecheck`.
- RF4: Un test de ejemplo de Vitest en `src/logic/` y un smoke test de Playwright que verifique que el canvas existe y que no hay errores en consola.
- RF5: `Dockerfile`, `nginx.conf`, `docker-compose.yml` y `.dockerignore` según `docs/04-arquitectura/docker.md`.
- RF6: Actualizar la sección **Comandos** de `AGENTS.md` con los scripts reales.

## Fuera de alcance
Movimiento, mapas, audio, CI.

## Criterios de aceptación
- [ ] CA1: `npm run dev` muestra la pantalla de título en http://localhost:5173 sin errores en consola.
- [ ] CA2: `npm run typecheck`, `npm test` y `npm run e2e` pasan.
- [ ] CA3: `docker compose up --build` sirve el juego en http://localhost:8080; corre con el UID 101 y responde con las cabeceras CSP (ver "Verificación" en docker.md).
- [ ] CA4: Al redimensionar la ventana, el pixel art se ve nítido.

## Preguntas abiertas
- [NECESITA ACLARACIÓN] ¿Phaser 3.90 o Phaser 4? Verificar con context7 cuál es la versión estable actual; si Phaser 4 lo es, usarla.
