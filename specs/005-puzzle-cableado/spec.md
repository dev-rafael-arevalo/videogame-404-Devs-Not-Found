# Spec 005: Primer puzzle: cableado

- **Estado:** Terminada (2026-11-12)
- **Etapa:** 4 Implementación
- **Depende de:** 004

## Problema / objetivo
El primer ticket del acto 1 (#0007, "Reconectar el switch del piso 3") necesita su puzzle real: unir
con el mouse cada puerto de la izquierda con su par de la derecha. Es el puzzle más simple del juego y
el que cierra el slice vertical jugable. También llega la pista de PATO con penalidad.

## Historias de usuario
- Como jugador/a, quiero arrastrar un cable desde un puerto hasta su par y ver si encaja.
- Como jugador/a, quiero poder pedirle una pista a PATO sabiendo que me cuesta puntaje.
- Como jugador/a con dificultad para distinguir colores, quiero que los puertos lleven también un número.

## Requisitos funcionales
- RF1: `datos` del ticket tipo `cables`: `izquierda` y `derecha`, listas del mismo largo con nombres de color (`rojo`, `azul`, `verde`, `amarillo`, `cian`, `naranja`). La derecha es una permutación de la izquierda.
- RF2: El tablero muestra los puertos de la izquierda y de la derecha en columnas; cada puerto lleva su color y un número (el mismo número en los dos lados para el mismo color).
- RF3: Arrastrar desde un puerto izquierdo dibuja un cable que sigue al puntero; soltar sobre un puerto derecho del mismo color lo conecta; sobre otro color o fuera, el cable se descarta y el puerto destino destella en rojo. Arrastrar desde un puerto ya conectado lo desconecta.
- RF4: El puzzle se da por resuelto cuando todos los puertos están conectados con su par. La validación es lógica pura (`logic/puzzles/cables.ts`).
- RF5: Botón "PATO: PISTA" en la ventana de puzzle (o tecla H): muestra la siguiente pista del ticket y resta un 10% a la recompensa por cada una (piso del 25%, acumulable con los rollbacks).
- RF6: `registry.ts` registra `cables`; el placeholder sigue cubriendo los demás tipos.

## Fuera de alcance
Sonidos de cable (006), otros puzzles (007), animación de "sistema recuperado".

## Criterios de aceptación
- [x] CA1: Vitest: `isSolved` solo con todas las conexiones correctas; `canConnect` rechaza colores distintos y puertos ocupados; `layoutPorts` es determinista; la recompensa con 1 pista es 1.080 y con 1 rollback y 1 pista, 780.
- [x] CA2: Playwright: arrastrar rojo→azul no conecta; arrastrar los tres pares correctos resuelve y el resultado muestra +1.200.
- [x] CA3: Playwright: pedir una pista muestra el texto y el resultado baja a 1.080.
- [x] CA4: Visual: puertos, números y cables nítidos a ×4.

## Preguntas abiertas
- Ninguna.
