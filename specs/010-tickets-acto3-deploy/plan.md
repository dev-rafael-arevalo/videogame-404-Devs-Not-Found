# Plan 010: Tickets del acto 3

Referencia: [spec.md](spec.md)

## Enfoque técnico
Todo el motor existe (spec 009). Esta spec es casi solo contenido: tres JSON de ticket, el campo
`estadoInicial` en `src/terminal/state.ts` (parse y `createTerminalState`), textos y el test e2e que
recorre los cuatro kioscos del núcleo escribiendo comandos. `helpers.ts` gana `walkPath` (lista de
puntos, eje por eje) para rodear el núcleo.

## Archivos
Crear: `src/data/tickets/a3-0{2,3,4}-*.json`, `tests/e2e/acto3.spec.ts`. Modificar: `src/terminal/state.ts` + `registry.test.ts`, `actos.json`, `es.json`, `helpers.ts`.

## Dependencias nuevas
Ninguna.

## Verificación
Vitest (CA1), Playwright (CA2), captura (CA3).

## Chequeo contra la constitución
- [x] Simple primero · [x] Contenido como datos · [x] Seguridad (sigue sin ejecutarse nada)
