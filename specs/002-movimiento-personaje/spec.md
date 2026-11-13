# Spec 002: Movimiento del personaje

- **Estado:** Terminada (2026-11-12)
- **Etapa:** 4 Implementación
- **Depende de:** 001

## Problema / objetivo
El núcleo del juego es moverse por el mundo. SaraDev tiene que caminar por la oficina del acto 1 con
respuesta inmediata, chocar con paredes y muebles, y con una cámara que la siga.

## Historias de usuario
- Como jugador/a, quiero mover a SaraDev con WASD o las flechas para explorar la oficina.
- Como jugador/a, quiero que SaraDev no atraviese paredes ni escritorios.

## Requisitos funcionales
- RF1: `WorldScene` carga un mapa de Tiled del acto 1 (placeholder de unos 40×23 tiles) con capas `suelo`, `objetos`, `colision` y `encima`.
- RF2: SaraDev se mueve en 8 direcciones a unos 60 px/s; la velocidad diagonal se normaliza.
- RF3: Colisión con la capa `colision` mediante Arcade Physics, con una hitbox en los pies (unos 10×6 px) para que pueda pasar "detrás" de los objetos.
- RF4: Animaciones `idle` y `walk` en 4 direcciones con el sprite procedural mínimo de SaraDev (24×24; la spec 013 lo completa con expresiones y el resto de animaciones).
- RF5: La cámara sigue a SaraDev con deadzone, limitada a los bordes del mapa y con redondeo de píxeles (`roundPixels`).
- RF6: La lógica de entrada a dirección y velocidad vive en `src/logic/movement.ts` como función pura y testeada.

## Fuera de alcance
Interacción con objetos (spec 003), HUD (004), sonido de pasos (006).

## Criterios de aceptación
- [x] CA1: Al mantener una diagonal, la velocidad es igual que en línea recta (test de Vitest).
- [x] CA2: SaraDev no atraviesa ningún tile de la capa `colision` (verificado con Playwright: mantener una tecla contra una pared y la posición no cambia).
- [x] CA3: Al soltar las teclas, SaraDev se detiene y queda en `idle` mirando hacia la última dirección.
- [x] CA4: Sin temblores ni desenfoque al moverse a escala ×4.

## Preguntas abiertas
- ~~¿Movimiento libre (8 direcciones) o por grilla?~~ **Resuelto (2026-11-12):** libre, en 8 direcciones (el valor por defecto; el cuestionario no lo contradice).
