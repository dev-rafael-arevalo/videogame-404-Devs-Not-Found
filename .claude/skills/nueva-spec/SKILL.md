---
name: nueva-spec
description: Crea una nueva spec SDD en specs/NNN-slug/ (spec.md, luego plan.md y tasks.md) a partir de una idea o feature del juego. Usar cuando se pida "nueva spec", "especificar", "planificar una feature" o antes de implementar algo que no tenga spec.
---

# Nueva spec

1. **Numerar:** busca el número más alto en `specs/` y suma 1 (3 dígitos). El slug va en kebab-case y en español (`003-interaccion-dialogos`). Revisa la hoja de ruta en `docs/00-plan.md`: si la feature ya figura ahí, usa ese número.
2. **Contexto:** lee `specs/constitucion.md`, la sección de `docs/` relevante (lore, pantallas, arquitectura) y las specs de las que depende.
3. **spec.md:** copia `specs/_plantillas/spec.md` y complétala. Debe decir *qué* y *por qué*, no *cómo*. Los criterios de aceptación tienen que ser verificables (un test o una acción concreta en el juego). Lo que no se sepa va marcado como `[NECESITA ACLARACIÓN]`, sin inventar.
4. **Parar:** muestra la spec al usuario y resuelve las aclaraciones. No sigas hasta que la apruebe.
5. **plan.md:** con la plantilla; los archivos concretos según `docs/04-arquitectura/arquitectura.md`. Si propones una dependencia nueva, justifícala. Completa el chequeo contra la constitución.
6. **tasks.md:** con la plantilla; tareas pequeñas (de 30 minutos o menos cada una), en orden, con los tests de la lógica pura antes que su implementación. Las tres últimas son siempre: verificar, captura con Playwright y actualizar el README y el plan.
7. Cambia el estado de la spec a `Aprobada` y agrega la fila en `docs/00-plan.md` si no estaba.
