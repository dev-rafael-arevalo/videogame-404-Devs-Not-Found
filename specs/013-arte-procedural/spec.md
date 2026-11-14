# Spec 013: Sistema de arte procedural: SaraDev, PATO, kit de UI y demo

- **Estado:** Terminada (2026-11-12)
- **Etapa:** 3 Diseño gráfico · 4 Implementación
- **Depende de:** 006

## Problema / objetivo
SaraDev tiene una versión mínima (idle y walk). El brief de arte pide una protagonista con
personalidad: 8 expresiones, 10 animaciones, estilo chibi de humor tecnológico, y un entorno neón
cyberpunk según las referencias del Lead. Esta spec completa el sistema de arte por código sobre las
piezas que ya existen (`pixelTexture`, paleta, composición por partes) sin tocar la arquitectura.

## Requisitos funcionales
- RF1: **Expresiones** de SaraDev: `normal`, `cansada`, `feliz`, `sorprendida`, `panico`, `enojada`, `determinada`, `celebracion` (más `dolor`, interna para `hurt`). Cada una cambia ojos, cejas y boca de la vista frontal y tiene su retrato de 32×32.
- RF2: **Animaciones**: `idle` (2), `walk` (4) y `run` (4) en 4 direcciones; `jump` (2), `interact` (2), `type` (2, tecleando en su laptop), `panic` (2), `hurt` (2), `attack` (3, golpe de laptop) y `victory` (3, brazos arriba) de frente. Todas se registran desde una configuración pura (`saraDevAnimations()`) y se actualizan con el delta de Phaser (sin un segundo game loop).
- RF3: `Player` expone `setExpression(expresion)` y `playAction(accion)`: las acciones de un solo disparo vuelven a `idle` al terminar; `type` y `panic` se repiten hasta que se cambie. El mundo las usa: `interact` al usar algo, `victory` + `celebracion` al cerrar un ticket, `hurt` + `panico` al vencer un plazo.
- RF4: **Retratos** por expresión en el diálogo: una línea puede llevar `"expresion"` y el retrato de SaraDev la muestra. Retrato de CRON (monitor).
- RF5: **Kit de UI**: ventanas 9-slice generadas por código en 4 estilos (CRON cian, PATO amarillo, alerta rojo, éxito lima) con sombra sólida; íconos de 8×8 en el HUD (uptime, conciencias, ticket); cursor pixel art propio.
- RF6: **Fondos synthwave** según las referencias: Título con estrellas, sol con bandas y grilla en perspectiva que avanza; Rollback con la misma grilla en rojo y barras de glitch.
- RF7: **Escena de demo** en `/?demo` (fuera del flujo del juego): SaraDev a escala ×4 con flechas para cambiar animación y expresión, D para la dirección, F para espejar, +/− para la escala; muestra PATO, los 9 retratos y las 4 ventanas.

## Fuera de alcance
Tilesets de los actos 2 y 3, El Recolector y los hologramas (007/008), sombras y texturas avanzadas del mapa.

## Criterios de aceptación
- [x] CA1: Vitest: todos los cuadros miden 24×24 y usan solo caracteres de la paleta; los nombres son únicos; cada animación referencia cuadros existentes; hay 8 expresiones públicas.
- [x] CA2: Playwright: `/?demo` abre la escena `Demo`; recorrer todas las animaciones y expresiones con el teclado no produce errores y el nombre de la animación cambia en cada paso.
- [x] CA3: Playwright: al cerrar un ticket, la animación de SaraDev es `saradev-victory`; al vencer el plazo, `saradev-hurt`.
- [x] CA4: Visual: capturas de la demo, del Título synthwave, de una ventana 9-slice y del HUD con íconos, nítidas a ×4.

## Preguntas abiertas
- Ninguna.
