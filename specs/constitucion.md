# Constitución del proyecto

Principios que ninguna spec ni ningún plan puede contradecir. Para cambiarlos hace falta una decisión explícita del equipo.

1. **Simple primero.** Se elige la solución más simple que cumpla la spec. Nada de backend, base de datos, gestor de estado ni dependencias nuevas sin una justificación escrita en el `plan.md`.
2. **Spec antes que código.** Ninguna feature se implementa sin `spec.md` aprobada. Cada PR referencia su spec.
3. **Lógica pura separada.** Las reglas del juego (plazos, validadores, progreso, terminal) viven en TypeScript sin Phaser y tienen tests en Vitest. Las escenas solo dibujan y conectan.
4. **Contenido como datos.** Tickets, diálogos y textos van en `src/data/*.json`. Agregar un ticket no requiere tocar código si su tipo de puzzle ya existe.
5. **Nada se ejecuta de verdad.** La terminal es simulada. Sin `eval`, `Function` ni `innerHTML` con entrada de quien juega.
6. **Pixel-perfect.** 320×180, escalado entero, sin antialiasing y paleta definida en la guía de arte.
7. **Siempre jugable.** `main` siempre compila, pasa los tests y se puede jugar. Lo que todavía no tiene arte o audio usa placeholders.
8. **Accesible en lo básico.** Volumen separado para música y efectos, modo sin presión (sin plazos) y nada que dependa solo del color (los cables también llevan forma o número).
9. **Seguro por defecto.** El contenedor corre sin root y la CSP es estricta (ver `docs/04-arquitectura/seguridad.md`).
10. **El progreso queda visible.** Al cerrar una spec se actualizan el README (progreso y changelog) y `docs/00-plan.md`.
