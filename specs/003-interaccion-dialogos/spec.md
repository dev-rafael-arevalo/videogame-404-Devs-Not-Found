# Spec 003: Interacción y diálogos

- **Estado:** Terminada (2026-11-12)
- **Etapa:** 4 Implementación
- **Depende de:** 002

## Problema / objetivo
SaraDev tiene que poder hablar con PATO, leer los post-its de Marga y usar las terminales. Sin eso el
mundo es un escenario mudo. Esta spec agrega los objetos interactuables del acto 1 y la pantalla de
diálogo (P08) con retrato y efecto máquina de escribir.

## Historias de usuario
- Como jugador/a, quiero ver un aviso "[E] usar" cuando estoy cerca de algo con lo que puedo interactuar.
- Como jugador/a, quiero hablar con PATO y leer los post-its para entender qué pasó y qué tengo que hacer.
- Como jugador/a, quiero avanzar el diálogo a mi ritmo (una tecla muestra todo el texto; otra pasa de página).

## Requisitos funcionales
- RF1: El mapa del acto 1 lleva una capa de objetos `interactables` con PATO (sala fría), 3 post-its de Marga y una entrada por cada terminal. Cada objeto tiene `tipo` y `dialogo` (id del texto).
- RF2: Cuando SaraDev está a menos de 20 px de un interactuable, aparece "[E] usar" abajo a la derecha. Si hay varios, se elige el más cercano.
- RF3: Con **E** o **Espacio** se abre el diálogo (P08): caja inferior de 48 px, retrato de 32×32, nombre de quien habla y texto con efecto máquina de escribir. Mientras está abierto, SaraDev no se mueve.
- RF4: E/Espacio durante el tipeo muestra la página completa; con la página completa pasa a la siguiente; en la última, cierra. El texto se parte en páginas de 3 líneas.
- RF5: Al entrar al mundo por primera vez en la sesión se reproduce el diálogo inicial de SaraDev (despertar en la sala fría).
- RF6: Las terminales responden con un diálogo placeholder ("todavía no hay tickets") hasta la spec 004.
- RF7: PATO (12×12, rebote de 2 cuadros), los post-its (8×8) y los retratos (SaraDev, PATO y post-it de Marga) se generan por código.
- RF8: Diálogos y textos en `src/data/textos/es.json`. La paginación, el tipeo y la elección del interactuable son lógica pura testeada.

## Fuera de alcance
Tickets y HUD (004), sonido de blip y de interacción (006), hologramas (007), menú e intro (011).

## Criterios de aceptación
- [x] CA1: Vitest: el texto se parte en líneas de como máximo N caracteres sin cortar palabras y en páginas de 3 líneas; el cursor pasa "revelar → siguiente página → siguiente línea → cerrar"; `pickInteractable` devuelve el más cercano dentro del rango y `null` fuera.
- [x] CA2: Playwright: al acercarse a PATO aparece el aviso; con E se abre el diálogo con `quien = "PATO"`; con E repetido se cierra y SaraDev vuelve a poder moverse.
- [x] CA3: Playwright: mientras el diálogo está abierto, mantener una flecha no cambia la posición.
- [x] CA4: Visual: caja, retrato y texto nítidos a ×4; el texto no se sale de la caja.

## Preguntas abiertas
- Ninguna. El estilo de ventana por hablante (CRON, PATO, alerta) se decide en la spec 013 junto con el kit de UI.
