# Spec 011: Menús, pausa, opciones, intro, final y créditos

- **Estado:** Terminada (2026-11-13)
- **Etapa:** 4 Implementación
- **Depende de:** 010

## Problema / objetivo
El juego se juega entero pero le falta el marco: un menú para empezar o continuar, opciones de
accesibilidad (volúmenes, modo sin presión), la intro que cuenta el Gran Despliegue, la pausa y el
epílogo con créditos que cierra la historia según cuántas conciencias se rescataron.

## Requisitos funcionales
- RF1: **Menú principal** (P03) tras START: Nueva partida, Continuar (solo si hay guardado), Opciones y Créditos; flechas o mouse y Enter. Nueva partida borra el guardado y abre la intro; Continuar carga el acto guardado.
- RF2: **Opciones** (P04), accesibles desde el menú y la pausa: volumen de música y de efectos (←/→ de a 10%), modo sin presión (sin plazos), pantalla completa. Se guardan en `localStorage` (`devs-not-found.opciones` y el de audio) y se aplican al instante. Esc vuelve.
- RF3: **Intro** (P05): 5 viñetas con ilustración procedural y texto (el Gran Despliegue, 06:00, 0,3 s, la sala fría, el despertar). Enter avanza, Esc salta. Pista M02 `intro`.
- RF4: **Pausa** (P13): Esc en el mundo (sin ventanas abiertas) pausa el mundo y abre Continuar, Opciones, Guardar y salir (vuelve al Título). La música baja al 50% mientras tanto.
- RF5: **Final** (P15): al cerrar el diálogo `acto3_fin` se abre el epílogo. Tres variantes según el porcentaje de conciencias rescatadas sobre el máximo posible: ≥ 90% (todas vuelven; Marga entra con un café), 60–89% (la mayoría; algunos sectores "en pausa") y < 60% (hay que seguir). Después, créditos que suben; Enter acelera; al terminar, vuelve al Título. Pista M09 `final_creditos`. Créditos también desde el menú.
- RF6: `rescuePercent` y `endingFor` son lógica pura testeada; las opciones del juego se validan como las de audio.
- RF7: `__debug.menu()`, `__debug.ending()` y `__debug.finishGame()` (DEV).

## Fuera de alcance
CI y release (012), logros, selector de idioma.

## Criterios de aceptación
- [x] CA1: Vitest: `rescuePercent` con y sin penalidades, `endingFor` en los tres cortes, opciones con JSON roto.
- [x] CA2: Playwright: Título → Menú → Nueva partida → Intro (Esc) → Mundo; Opciones cambia el volumen de música y activa el modo sin presión, y tras recargar siguen; Esc en el mundo abre la pausa y Continuar la cierra; con el juego terminado, el final muestra la variante correcta y los créditos vuelven al Título.
- [x] CA3: Visual: capturas del menú, opciones, una viñeta de la intro, la pausa y el final.

## Preguntas abiertas
- Ninguna.
