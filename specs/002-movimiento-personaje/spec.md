# Spec 002: Movimiento del personaje

- **Estado:** Borrador
- **Etapa:** 4 Implementación
- **Depende de:** 001

## Problema / objetivo
El núcleo del juego es moverse por el mundo. Dev tiene que caminar por la oficina del acto 1 con
respuesta inmediata, chocar con paredes y muebles, y con una cámara que la siga.

## Historias de usuario
- Como jugador/a, quiero mover a Dev con WASD o las flechas para explorar la oficina.
- Como jugador/a, quiero que Dev no atraviese paredes ni escritorios.

## Requisitos funcionales
- RF1: `WorldScene` carga un mapa de Tiled del acto 1 (placeholder de unos 40×23 tiles) con capas `suelo`, `objetos`, `colision` y `encima`.
- RF2: Dev se mueve en 8 direcciones a unos 60 px/s; la velocidad diagonal se normaliza.
- RF3: Colisión con la capa `colision` mediante Arcade Physics, con una hitbox en los pies (unos 10×6 px) para que pueda pasar "detrás" de los objetos.
- RF4: Animaciones `idle` y `walk` en 4 direcciones (placeholder: rectángulo de 16×24 con una flecha de dirección mientras no haya arte).
- RF5: La cámara sigue a Dev con deadzone, limitada a los bordes del mapa y con redondeo de píxeles (`roundPixels`).
- RF6: La lógica de entrada a dirección y velocidad vive en `src/logic/movement.ts` como función pura y testeada.

## Fuera de alcance
Interacción con objetos (spec 003), HUD (004), sonido de pasos (006).

## Criterios de aceptación
- [ ] CA1: Al mantener una diagonal, la velocidad es igual que en línea recta (test de Vitest).
- [ ] CA2: Dev no atraviesa ningún tile de la capa `colision` (verificado con Playwright: mantener una tecla contra una pared y la posición no cambia).
- [ ] CA3: Al soltar las teclas, Dev se detiene y queda en `idle` mirando hacia la última dirección.
- [ ] CA4: Sin temblores ni desenfoque al moverse a escala ×4.

## Preguntas abiertas
- [NECESITA ACLARACIÓN] ¿Movimiento libre (8 direcciones) o por grilla, tile a tile? Por defecto, libre.
