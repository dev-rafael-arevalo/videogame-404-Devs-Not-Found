# Spec 007: Resto de puzzles del acto 1 y guardado

- **Estado:** Terminada (2026-11-12)
- **Etapa:** 4 Implementación
- **Depende de:** 005, 013

## Problema / objetivo
El acto 1 tiene un solo puzzle jugable y la partida se pierde al cerrar el navegador. Esta spec
completa el acto 1 con los tres puzzles de mouse que faltan (binario, paquetes y compuertas), guarda
el progreso en `localStorage` y cierra el acto con la revelación de CRON.

## Requisitos funcionales
- RF1: **Binario** (`binario`): `datos = { bits, objetivo }`. Interruptores con su valor (128…1) que se encienden con un click; se muestra el número actual. Resuelto cuando el valor es `objetivo`.
- RF2: **Paquetes** (`paquetes`): `datos = { paquetes: number[] }` (números de secuencia en el orden en que llegan, desordenados). Hay que hacer click en los paquetes de menor a mayor; un click fuera de orden destella en rojo y reinicia la secuencia. Resuelto al seleccionar todos en orden.
- RF3: **Compuertas** (`compuertas`): `datos = { entradas: boolean[], objetivo: boolean, compuertas: string[] }`. Las entradas se combinan de izquierda a derecha con una compuerta por ranura; cada click en una ranura pasa a la siguiente compuerta de la lista (`AND`, `OR`, `XOR`, `NAND`). Se ve el resultado en vivo. Resuelto cuando la salida es `objetivo`.
- RF4: Cuatro tickets del acto 1 en orden: cables, binario, paquetes, compuertas, cada uno en su terminal. Validación y reglas de cada puzzle en `src/logic/puzzles/` con tests; cada vista registrada en `registry.ts`.
- RF5: **Guardado**: tras cada ticket cerrado o vencido se guarda `{ version, acto, completados, conciencias, fallos }` en `localStorage` (`devs-not-found.save`). Al entrar al mundo se carga si existe y es válido; un guardado roto o de otra versión se descarta con un aviso en consola. `__debug.resetSave()` lo borra (DEV).
- RF6: El Título muestra "Partida guardada: N%" si hay guardado; la tecla **N** empieza de cero (borra el guardado). Enter continúa.
- RF7: Al cerrar el último ticket del acto, tras el resultado se abre el diálogo `acto1_fin` (CRON revela la escala: "Conciencias en línea: 0,0000001%") y PATO adelanta el acto 2.

## Fuera de alcance
Acto 2 (008), menú con "Continuar" (011), opciones.

## Criterios de aceptación
- [x] CA1: Vitest: binario (`toggle`, `valueOf`, `isSolved`), paquetes (`pick` en orden, reinicio al fallar), compuertas (`evaluate` de cada compuerta y encadenado), guardado (`parseSave` rechaza versiones y formas inválidas; ida y vuelta sin pérdida); todos los tickets validan y sus terminales existen.
- [x] CA2: Playwright: resolver los cuatro tickets con el mouse deja el uptime en 100% y abre el diálogo `acto1_fin`.
- [x] CA3: Playwright: tras resolver un ticket y recargar la página, el progreso se conserva y el Título muestra la partida guardada; N lo borra.
- [x] CA4: Visual: capturas de los tres tableros nuevos.

## Preguntas abiertas
- Ninguna.
