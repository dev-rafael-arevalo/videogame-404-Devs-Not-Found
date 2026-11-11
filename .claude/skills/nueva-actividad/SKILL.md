---
name: nueva-actividad
description: Diseña un nuevo ticket/actividad del juego (puzzle de mouse o reto de terminal) como JSON en src/data/tickets/, coherente con el lore y la curva de dificultad. Usar cuando se pida "nuevo ticket", "nuevo puzzle", "nueva actividad" o "diseñar los niveles del acto N".
---

# Nueva actividad (ticket)

1. **Ubicar:** acto (1, 2 o 3) y posición en el acto. Lee `docs/01-lore/lore.md` (acto y tono) y el catálogo de tipos en `docs/01-lore/pantallas.md`.
2. **Tipo:** usa un tipo existente. Si hace falta uno nuevo, no lo inventes en el JSON: propón una spec con `nueva-spec`.
3. **Dificultad:** el plazo y la complejidad crecen dentro del acto. Referencias: acto 1 de 60–90 s con 3–4 elementos; acto 2 de 90–120 s con 5–7 líneas de código; acto 3 de 120–180 s con 2–4 comandos por ticket.
4. **Escribir** `src/data/tickets/a<acto>-<nn>-<tipo>.json` según el esquema de `docs/04-arquitectura/arquitectura.md`:
   - `titulo` y `descripcion` con la voz burocrática de CRON.
   - 2 `pistas` con la voz de PATO, de menor a mayor ayuda.
   - `datos` que tengan **una solución verificable**.
5. **Validar:** agrega o extiende el test de datos en Vitest para que el validador de ese tipo resuelva el ticket. Si todavía no hay código, describe la solución en un comentario `_solucion` dentro del JSON.
6. **Registrar** el ticket en `src/data/actos.json` y agrega los textos nuevos a `src/data/textos/es.json`.
7. Para tickets de terminal: solo comandos de `comandosPermitidos` y que existan en `src/terminal/commands/`. Nunca se piden comandos reales y peligrosos (`rm -rf`, `sudo`, etc.), ni siquiera simulados.
