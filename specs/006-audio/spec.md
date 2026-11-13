# Spec 006: Audio: música, efectos de sonido y volumen

- **Estado:** Terminada (2026-11-12)
- **Etapa:** 4 Implementación
- **Depende de:** 005, 014

## Problema / objetivo
El juego es mudo. Con el motor de la spec 014, cada pantalla tiene su pista y cada acción su efecto,
con volúmenes separados que se recuerdan entre sesiones.

## Requisitos funcionales
- RF1: `AudioManager` único (`src/audio/AudioManager.ts`): `playMusic(id, { next? })` con fundido de 300 ms entre pistas, `playSfx(nombre)`, volúmenes de música y efectos (0–1) guardados en `localStorage` con `try/catch` y validación.
- RF2: Nada suena antes de la primera interacción: el contexto se desbloquea con el primer click o tecla y la pista pendiente arranca entonces.
- RF3: Pistas por pantalla: Título M01; Mundo M03; Puzzle M06, y M07 cuando el plazo baja del 20%; al resolver, J01 y vuelve M03; al vencer, J02 y vuelve M03.
- RF4: Efectos: `boot_beep` por línea del BIOS, `click_ui` en botones, `interactuar` al abrir un diálogo o briefing, `pato_quack` al hablar con PATO, `dialogo_letra` cada 2 caracteres del tipeo, `paso` al caminar (cada 280 ms), `ticket_nuevo` al abrir el briefing, `cable_conectar` / `cable_error`, `puzzle_ok` al resolver, `alarma_plazo` al entrar en el 20%.
- RF5: `window.__debug.audio()` expone pista actual, estado del contexto y el último efecto (solo DEV).

## Fuera de alcance
Pantalla de opciones (011), pistas de actos 2 y 3.

## Criterios de aceptación
- [x] CA1: Vitest: las opciones de volumen se validan (valores fuera de rango o JSON roto → por defecto) y se serializan.
- [x] CA2: Playwright: antes de tocar nada no hay pista; tras la primera tecla la pista es `titulo`; en el mundo `acto1_oficina`; en el puzzle `puzzle`; al forzar el vencimiento, `jingle_rollback`; el último efecto tras conectar un cable es `cable_conectar`.
- [ ] CA3 (pendiente de escucha humana): Escuchado a mano: los fundidos no cortan y los volúmenes se guardan al recargar.

## Preguntas abiertas
- Ninguna.
