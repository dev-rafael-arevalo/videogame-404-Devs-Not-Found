# Spec 008: Acto 2: Puerto Cero y los puzzles de código

- **Estado:** Terminada (2026-11-13)
- **Etapa:** 4 Implementación
- **Depende de:** 007

## Problema / objetivo
El juego termina en la oficina. El acto 2 lleva a SaraDev a las calles de Puerto Cero (metro, central
eléctrica y antena), con el mundo ya degradado, y sube la dificultad: puzzles con lógica de código
que preparan la terminal del acto 3.

## Requisitos funcionales
- RF1: **Salida de la oficina**: la puerta inferior del acto 1 es un interactuable `salida`. Si quedan tickets, SaraDev lo dice; si no, fundido y el mundo carga el acto 2. El guardado recuerda el acto; el Título continúa en el acto guardado.
- RF2: **Mapa del acto 2** (40×23, generado desde un plano ASCII junto con el del acto 1 por `scripts/generate-maps.mjs`): calles con asfalto agrietado, veredas, edificios con carteles de estática, autos abandonados, vegetación, la boca del metro, el patio de la central eléctrica y la antena. Tileset `tile_acto2` por código.
- RF3: **Interactuables del acto 2**: PATO cerca del inicio, 3 kioscos-terminal (uno por ticket), 2 post-its de Marga y 2 **hologramas** (personas atrapadas, silueta cian que parpadea) con una frase cada uno.
- RF4: **Bloques** (`bloques`): `datos = { lineas, inicial }`. Las líneas de una función se muestran en el orden `inicial`; click en una y luego en otra las intercambia. Resuelto cuando quedan en el orden correcto.
- RF5: **Bug** (`bug`): `datos = { lineas, bug, explicacion }`. Click en la línea con el error la marca; una línea equivocada destella en rojo. Al acertar se muestra la explicación un instante.
- RF6: **Indentación** (`indentacion`): `datos = { lineas: [{ texto, nivel }], inicial }`. Cada click en una línea sube su sangría un nivel (0–3, cíclico). Resuelto cuando todos los niveles coinciden.
- RF7: Tres tickets del acto 2 (metro, central, antena) en `actos.json`; diálogos `acto2_inicio` y `acto2_fin`; pista M04 `acto2_ciudad` (90 BPM, melancólica). El HUD calcula el uptime con los tickets del acto actual.
- RF8: `__debug.world()` (acto actual), `completeAct(n)` y `jumpToAct(n)` para los tests (DEV).

## Fuera de alcance
Terminal y acto 3 (009, 010), menú e intro (011), El Recolector como sprite.

## Criterios de aceptación
- [x] CA1: Vitest: bloques (`swap`, `isSolved`), bug (`check`), indentación (`cycle`, `isSolved`); los tickets del acto 2 validan y sus terminales existen en el mapa del acto 2; M04 valida.
- [x] CA2: Playwright: con el acto 1 completo, usar la salida carga el acto 2 (`world().acto === 2`) y el guardado dice `acto: 2`.
- [x] CA3: Playwright: en el acto 2, resolver los tres tickets con el mouse deja el uptime en 100% y abre `acto2_fin`; un holograma responde con su frase.
- [x] CA4: Visual: capturas de la ciudad y de los tres tableros.

## Preguntas abiertas
- Ninguna.
