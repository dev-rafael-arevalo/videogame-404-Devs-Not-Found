# Tareas 002: Movimiento del personaje

Referencia: [spec.md](spec.md) · [plan.md](plan.md)

Orden de ejecución. `[P]` = se puede hacer en paralelo con la anterior. Marcar `[x]` al terminar.

## Preparación
- [x] T1: `scripts/generate-map-acto1.mjs` con el plano ASCII de la oficina y generar `public/assets/maps/acto1_oficina.json`

## Tests primero (lógica pura)
- [x] T2: `src/logic/movement.test.ts` (diagonal normalizada, sin entrada, ejes opuestos, dirección conservada)

## Implementación
- [x] T3: `src/logic/movement.ts` hasta que pase T2
- [x] T4: [P] `src/art/pixelTexture.ts` (matriz → textura canvas con cuadros)
- [x] T5: `src/art/tiles/acto1.ts` (tileset de 16 tiles)
- [x] T6: `src/art/characters/saradev.ts` + `src/art/animations.ts` (idle y walk ×4 direcciones)
- [x] T7: `src/entities/Player.ts` (cuerpo 10×6 en los pies, sombra, animaciones)
- [x] T8: `src/scenes/WorldScene.ts` (mapa, capas, colisión, cámara) y cambios en `config.ts`, `BootScene.ts`, `TitleScene.ts`, `main.ts`
- [x] T9: `tests/e2e/world.spec.ts`

## Verificación y cierre
- [x] T10: `npm run typecheck && npm test && npm run e2e` en verde
- [x] T11: Verificación visual con Playwright (captura caminando) y revisión de consola
- [x] T12: Actualizar `README.md`, `docs/00-plan.md`, `docs/mapa-del-proyecto.md` y `AGENTS.md`
