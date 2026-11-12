# Pantallas del juego

Resolución nativa de **320×180** (escalada ×4 da 1280×720). Cada pantalla corresponde a una escena
de Phaser (ver [arquitectura.md](../04-arquitectura/arquitectura.md)). La música hace referencia a
los IDs de [musica.md](../02-musica/musica.md).

## Mapa de flujo

```
P01 Boot ─► P02 Título ─► P03 Menú ─┬─► P05 Intro ─► P06 Mundo ◄──────────────┐
                                     ├─► P04 Opciones                            │
                                     └─► (Continuar) ─► P06 Mundo                │
P06 Mundo ─► P09 Briefing del ticket ─► P10 Puzzle | P11 Terminal ─► P12 Resultado ─┘
                                                                    └─(fallo)─► P14 Rollback ─► P09
P06 ─(Esc)─► P13 Pausa        P06 ─(último ticket del acto 3)─► P15 Final y créditos
```

## Listado

| ID | Pantalla | Propósito | Controles | Música |
|---|---|---|---|---|
| P01 | Boot (BIOS falso) | Carga de assets con texto de POST retro: `ARCA BIOS v0.3.14 … OK` | Cualquier tecla salta | — (beeps) |
| P02 | Título | Logo, "PRESIONA START", lluvia de caracteres de fondo | Enter, click | M01 |
| P03 | Menú principal | Nueva partida, Continuar (si hay guardado), Opciones, Créditos | Flechas o mouse, Enter | M01 |
| P04 | Opciones | Volumen de música y de efectos, escala, pantalla completa, modo sin presión | Flechas o mouse | M01 |
| P05 | Intro | 4–6 viñetas estáticas con texto: el Gran Despliegue y el final del reinicio del rack en la sala fría | Enter avanza, Esc salta | M02 |
| P06 | Mundo (exploración) | Vista cenital, se mueve a Dev; interactuar con terminales, post-its, hologramas y PATO | WASD o flechas, E o Espacio, Esc | M03, M04 o M05 según el acto |
| P07 | HUD (superpuesto a P06) | Uptime %, conciencias restauradas, ticket activo y su plazo | — | — |
| P08 | Diálogo (superpuesto) | Caja inferior con retrato y texto en efecto máquina de escribir | E o Espacio avanza | sin cambio |
| P09 | Briefing del ticket | Ventana de CRON: número, descripción, plazo, prioridad; botones ACEPTAR y VOLVER | Mouse, Enter | sin cambio |
| P10 | Puzzle en primer plano | Ventana grande sobre el mundo oscurecido; tablero del puzzle con barra de plazo | **Mouse** (arrastrar o click), Esc para abandonar | M06 (M07 si queda <20%) |
| P11 | Terminal | Pantalla completa estilo CRT verde fósforo, prompt y salida | **Teclado**: escribir, Enter, ↑ historial, Tab autocompletar | M08 |
| P12 | Resultado | ✔ TICKET CERRADO: tiempo, conciencias restauradas y +Uptime | Enter | jingle J01 |
| P13 | Pausa | Continuar, Opciones, Guardar y salir | Esc o flechas | volumen al 50% |
| P14 | Rollback | Glitch de pantalla y El Recolector barriendo. *"Plazo vencido. Rollback del sector."* Botones Reintentar y Volver al mundo | Enter | jingle J02 |
| P15 | Final y créditos | Epílogo según el porcentaje rescatado, y créditos que suben | Enter acelera | M09 |

## Wireframes de las pantallas clave

### P06 Mundo con P07 HUD
```
┌──────────────────────────────────────────┐
│ UPTIME 12% ▓▓░░░░░░  ☺ 1.204    #0007 ⏱ 64│  ← HUD (16 px de alto)
│                                          │
│   ▒▒▒ escritorio   [PC]←terminal brilla  │
│        ☻ Dev    🦆                        │
│                    ░ holograma           │
│   ▤ post-it                              │
│                                 [E] usar │  ← indicador de interacción
└──────────────────────────────────────────┘
```

### P10 Puzzle en primer plano
```
┌──────────────────────────────────────────┐
│░░░░░░░░ mundo oscurecido 60% ░░░░░░░░░░░░│
│░ ┌─ TICKET #0007: CABLEADO ───────[X]┐ ░│
│░ │ ●rojo ─────┐        ┌───── ●azul │ ░│
│░ │ ●azul      └────────┼───── ●rojo │ ░│
│░ │ ●verde ─────────────┘     ●verde │ ░│
│░ │ PLAZO ████████████░░░░░  64 s    │ ░│
│░ │ 🦆 Pista (-10% de puntaje)        │ ░│
│░ └───────────────────────────────────┘ ░│
└──────────────────────────────────────────┘
```

### P11 Terminal
```
┌──────────────────────────────────────────┐
│ ARCA-NUCLEO tty1          ⏱ 120 s  #0031 │
│ dev@arca:~$ ls                           │
│ puente/  logs/  LEEME.txt                │
│ dev@arca:~$ cd puente                    │
│ dev@arca:~/puente$ python -m venv .venv  │
│ dev@arca:~/puente$ █                     │
│                                          │
│ 🦆 PATO: "¿Y si instalas las dependen…"  │
└──────────────────────────────────────────┘
```

## Catálogo inicial de tipos de puzzle

| Acto | Tipo | Interacción | Concepto que enseña |
|---|---|---|---|
| 1 | `cables` | Arrastrar o seleccionar con clics puertos de igual número y forma; color complementario | Conexiones de red |
| 1 | `binario` | Click en interruptores para formar un número | Binario |
| 1 | `paquetes` | Ordenar paquetes numerados | Secuencia y orden |
| 1 | `compuertas` | Colocar AND, OR o NOT para encender la salida | Lógica booleana |
| 2 | `bloques` | Ordenar líneas de código desordenadas | Secuencia de un algoritmo |
| 2 | `bug` | Click en la línea con el error | Depuración |
| 2 | `indentacion` | Ajustar la sangría de un bloque Python | Sintaxis de Python |
| 3 | `terminal` | Escribir comandos | Shell, venv, pip y ejecución |


## Fichas completas P01–P15: wireframes documentales

**Estado:** distribución propuesta para revisión de Narrativa y Arte; no es una UI implementada.
Los wireframes anteriores se conservan como referencias históricas. Sus cifras y el coste de pista
son ilustrativos, no reglas aprobadas. Estas fichas no ratifican balance ni consecuencias de fallo.
Los textos narrativos completos se consultan en [guion.md](guion.md), y las reglas de los cuatro
puzzles aprobados como borrador en [catalogo-tickets.md](catalogo-tickets.md).

### Reglas comunes de composición y accesibilidad

Canvas nativo 320×180, pixel art, escalado entero y márgenes propuestos de 8 px. Los diagramas
son esquemas de distribución, no mediciones por carácter. No se debe comprimir toda una conversación
en una caja: se pagina conservando el texto y se comprueba con la fuente final. HUD de 16 px,
diálogo inferior de 48 px y puzzle aproximado de 256×144 según la guía de Arte. P01–P15 respetan
estas restricciones; el ajuste real de fuente, acentos, contraste y foco requiere validación visual.

Toda información de color debe tener texto, forma o número equivalente. No se exige sonido
para comprender una acción. Selección mediante contorno y rótulo; botones con estados normal,
seleccionado, presionado y deshabilitado donde corresponda. Se respetan los controles existentes;
no se añade soporte táctil o gamepad. No se introduce una opción nueva para efectos visuales:
la intensidad legible de glitches y parpadeos es responsabilidad de Arte y Desarrollo.

El diagrama inicial resume el flujo, pero no resuelve la ruta del fallo: P12 es éxito y P14 es
vencimiento; la secuencia técnica entre ambas permanece pendiente de la spec correspondiente.
Esc en puzzles, pausa y retorno desde terminal no deben interpretarse como reglas de reloj ya
aprobadas. Los destinos adicionales se identifican como propuestas de navegación para spec 011.

### P01 · Boot

**Propósito:** Carga de assets y presentación del BIOS falso.

```text
+--------------------------------------+
| ARCA BIOS v0.3.14                    |
| POST ... OK                          |
| [ barra de carga ]                   |
+--------------------------------------+
```

- **Elementos y textos:** Texto POST y barra de carga; sin botones nuevos.
- **Controles e interacciones:** Cualquier tecla salta la presentación.
- **Navegación y transiciones:** Carga terminada → P02; saltar no permite usar assets aún no cargados.
- **Estados relevantes:** Cargando / listo. Tratamiento de error de carga pendiente de spec 001.
- **Accesibilidad y 320×180:** Texto de progreso además de barra; los beeps no transmiten información exclusiva.

### P02 · Título

**Propósito:** Presentar el juego.

```text
+--------------------------------------+
| SYS://RESTORE                        |
| lluvia de caracteres al fondo        |
| PRESIONA START                       |
+--------------------------------------+
```

- **Elementos y textos:** Logo, fondo y llamada a comenzar.
- **Controles e interacciones:** Enter o clic.
- **Navegación y transiciones:** P02 → P03.
- **Estados relevantes:** Espera / activación.
- **Accesibilidad y 320×180:** La lluvia no tapa el texto ni sustituye la llamada escrita.

### P03 · Menú principal

**Propósito:** Elegir acceso a la partida.

```text
+--------------------------------------+
| SYS://RESTORE                        |
| > Nueva partida                      |
| Continuar                            |
| Opciones   Créditos                  |
+--------------------------------------+
```

- **Elementos y textos:** Las cuatro entradas ya previstas; Continuar depende de guardado.
- **Controles e interacciones:** Flechas o mouse; Enter confirma.
- **Navegación y transiciones:** Nueva → P05; Continuar → P06; Opciones → P04. Créditos → P15 solo atribuciones, propuesta para 011.
- **Estados relevantes:** Con guardado / sin guardado; Continuar deshabilitado si no hay. Sobrescritura pendiente.
- **Accesibilidad y 320×180:** Selección con contorno y texto; estado deshabilitado identificable sin color.

### P04 · Opciones

**Propósito:** Ajustar las opciones existentes.

```text
+--------------------------------------+
| Música [---|--]  Efectos [--|---]    |
| Escala [valor]                       |
| Pantalla completa [estado]           |
| Modo sin presión [estado]            |
+--------------------------------------+
```

- **Elementos y textos:** Volúmenes independientes, escala entera, pantalla completa y modo sin presión.
- **Controles e interacciones:** Flechas o mouse.
- **Navegación y transiciones:** Retorno al origen P03 o P13 propuesto; gesto de retorno y aplicación durante ticket pendientes de 011/004.
- **Estados relevantes:** Valores visibles / pantalla completa / sin presión activado.
- **Accesibilidad y 320×180:** Valores y estados escritos; sin controles adicionales. Ninguna escala fraccionaria.

### P05 · Intro

**Propósito:** Presentar el despliegue y el descubrimiento de la ausencia.

```text
+--------------------------------------+
| [ imagen de la viñeta ]              |
| [ texto de narración / Dev ]         |
| Enter: avanzar   Esc: saltar         |
+--------------------------------------+
```

- **Elementos y textos:** Seis viñetas intro_01–intro_06, cada una con texto paginado del guion.
- **Controles e interacciones:** Enter avanza; Esc salta.
- **Navegación y transiciones:** Última viñeta o salto → P06; PATO aporta el contexto esencial.
- **Estados relevantes:** Viñeta y página actuales.
- **Accesibilidad y 320×180:** Texto independiente de música; no hay desmayo ni pérdida de memoria.

### P06 · Mundo

**Propósito:** Explorar y encontrar interacciones.

```text
+--------------------------------------+
| [ P07 HUD, arriba ]                  |
| [ mapa cenital: Dev y objetos ]      |
| [ terminal / post-it / holograma ]   |
| [E] usar    [P08 cuando corresponda] |
+--------------------------------------+
```

- **Elementos y textos:** Mapa, personaje y objetos ya descritos en el lore; indicadores de interacción.
- **Controles e interacciones:** WASD o flechas; E o Espacio interactúa; Esc pausa.
- **Navegación y transiciones:** Diálogo → P08; ticket → P09; pausa → P13. Tras acto 1 continúa mundo de acto 2, no P15.
- **Estados relevantes:** Por acto; objetos interactivos; ticket activo o ninguno.
- **Accesibilidad y 320×180:** Indicador escrito y siluetas reconocibles; no depender de un brillo de color.

### P07 · HUD

**Propósito:** Mostrar progreso y ticket.

```text
+--------------------------------------+
| UPTIME [valor]  CONCIENCIAS [valor]  |
| TICKET [título breve]  PLAZO [valor] |
| [ resto del mundo P06 ]              |
+--------------------------------------+
```

- **Elementos y textos:** Franja superior de 16 px; valores provienen del estado futuro, no de cifras fijadas aquí.
- **Controles e interacciones:** Sin interacción propia.
- **Navegación y transiciones:** Superpuesto a P06; cambios por eventos del ticket, sin navegación autónoma.
- **Estados relevantes:** Sin ticket / ticket activo / aviso de plazo / modo sin presión.
- **Accesibilidad y 320×180:** Plazo textual y barra; propuesta de rótulo «Sin presión» cuando no haya vencimiento. Ajustar textos largos sin invadir mapa.

### P08 · Diálogo

**Propósito:** Mostrar intervenciones y post-its.

```text
+--------------------------------------+
| [ mundo visible ]                    |
| [ retrato ] [ voz ]                  |
| [ texto paginado, caja inferior ]    |
+--------------------------------------+
```

- **Elementos y textos:** Retrato cuando exista, nombre y texto; notas se atribuyen a Marga sin comunicación en directo.
- **Controles e interacciones:** E o Espacio avanza, según listado existente.
- **Navegación y transiciones:** Fin de conversación → P06; transición narrativa puede llevar a P09 según evento.
- **Estados relevantes:** Texto revelándose / página completa / última página.
- **Accesibilidad y 320×180:** Cada mensaje legible en caja inferior de 48 px; efecto máquina de escribir sin ocultar definitivamente texto. Reloj pendiente.

### P09 · Briefing

**Propósito:** Presentar el ticket antes de aceptar.

```text
+--------------------------------------+
| CRON  [referencia del ticket]        |
| [título]                             |
| [objetivo y prioridad]               |
| PLAZO [pendiente]  ACEPTAR / VOLVER  |
+--------------------------------------+
```

- **Elementos y textos:** Ventana de CRON con descripción, plazo y acciones existentes.
- **Controles e interacciones:** Mouse o Enter; selección visible.
- **Navegación y transiciones:** Aceptar → P10 o P11 según tipo; Volver → P06; reintento vuelve a este briefing.
- **Estados relevantes:** Inicial / reintento / sin presión.
- **Accesibilidad y 320×180:** Descripción paginada; no fijar cuenta atrás ni balance antes de aprobación. Objetivo comprensible sin jerga previa.

### P10 · Puzzle

**Propósito:** Resolver el tablero con mouse.

```text
+--------------------------------------+
| [ mundo oscurecido ]                 |
| TICKET [título]                [X]   |
| [ tablero: números y formas ]        |
| PLAZO [valor]   PATO: Pista          |
+--------------------------------------+
```

- **Elementos y textos:** Tablero del tipo existente, barra y botón de pista. Textos del guion dentro de P10.
- **Controles e interacciones:** Arrastre o clic de selección y clic de destino; binario con clic. Esc abandona según pantalla existente.
- **Navegación y transiciones:** Éxito → P12; vencimiento se presenta en P14, ruta técnica pendiente; abandono vuelve al mundo propuesto, efectos pendientes.
- **Estados relevantes:** Inicial / selección / corrección / resuelto / vencido / sin presión.
- **Accesibilidad y 320×180:** Cables con forma y número; paquetes numerados; operadores rotulados; estados binarios escritos. Ventana aproximada 256×144, pistas paginadas.

### P11 · Terminal

**Propósito:** Preparar el retorno mediante terminal simulada.

```text
+--------------------------------------+
| ARCA-NUCLEO tty1  [ticket/plazo]     |
| [ salida textual ]                   |
| dev@arca:~$ [entrada]                |
| PATO: [ayuda breve]                  |
+--------------------------------------+
```

- **Elementos y textos:** Prompt, salida, historial y ayuda narrativa. El comando final previsto es python puente.py --restore all.
- **Controles e interacciones:** Teclado, Enter; ↑ historial y Tab autocompletar según documentación existente.
- **Navegación y transiciones:** Objetivo de ticket verificado → P12; vencimiento → presentación P14. Salida/abandono y ruta técnica pendientes, sin inventar comandos.
- **Estados relevantes:** Esperando entrada / salida / requisito incompleto / objetivo cumplido / sin presión.
- **Accesibilidad y 320×180:** Verde fósforo con contraste suficiente; mensaje textual por error; salida anterior no tapada por ayuda. Nada se ejecuta de verdad.

### P12 · Resultado

**Propósito:** Confirmar éxito del ticket.

```text
+--------------------------------------+
| TICKET CERRADO                       |
| [mensaje CRON]                       |
| TIEMPO [valor]  CONCIENCIAS [valor]  |
| UPTIME [valor]    Enter              |
+--------------------------------------+
```

- **Elementos y textos:** Mensaje y métricas previstas; valores y reglas pendientes del Lead.
- **Controles e interacciones:** Enter.
- **Navegación y transiciones:** Regresa a P06 salvo objetivo final completado: P15 después del acto 3. Secuencia técnica final pendiente de 011.
- **Estados relevantes:** Éxito de ticket / objetivo final. No se añade pantalla de fallo a P12.
- **Accesibilidad y 320×180:** Texto TICKET CERRADO acompaña el símbolo; jingle J01 no es la única confirmación.

### P13 · Pausa

**Propósito:** Pausar y acceder a opciones.

```text
+--------------------------------------+
| PAUSA                                |
| > Continuar                          |
| Opciones                             |
| Guardar y salir                      |
+--------------------------------------+
```

- **Elementos y textos:** Las tres opciones existentes, sin añadir gestor de partidas.
- **Controles e interacciones:** Esc o flechas; confirmación concreta pendiente de 011.
- **Navegación y transiciones:** Continuar → P06; Opciones → P04; Guardar y salir → P03 propuesto.
- **Estados relevantes:** Pausa / selección; música al 50% según listado.
- **Accesibilidad y 320×180:** Foco claro, texto legible; conservación del reloj y permisos durante puzzle pendientes, sin prometer inmunidad al plazo.

### P14 · Rollback

**Propósito:** Presentar el vencimiento y permitir reintento.

```text
+--------------------------------------+
| [ glitch / Recolector ]              |
| Plazo vencido.                       |
| Rollback del sector.                 |
| Reintentar / Volver al mundo         |
+--------------------------------------+
```

- **Elementos y textos:** Mensaje de CRON, acompañamiento de PATO y acciones existentes.
- **Controles e interacciones:** Enter; selección de acción según futura spec.
- **Navegación y transiciones:** Reintentar → P09 del ticket activo; Volver al mundo → P06.
- **Estados relevantes:** Solo con plazo; reintento disponible. Consecuencias exactas pendientes.
- **Accesibilidad y 320×180:** Glitch no tapa el texto ni comunica información exclusiva. Sin cifras de penalización aprobadas.

### P15 · Final y créditos

**Propósito:** Presentar desenlace, epílogo y autorías.

```text
+--------------------------------------+
| [ escena del reencuentro ]           |
| [ epílogo seleccionado, paginado ]   |
| [ créditos en desplazamiento ]       |
| Enter: acelerar                      |
+--------------------------------------+
```

- **Elementos y textos:** Propuestas de ending_reunion, epílogos A/B/C y ending_credits del guion.
- **Controles e interacciones:** Enter acelera créditos.
- **Navegación y transiciones:** Tras objetivo final del acto 3. Acceso desde menú solo a créditos y retorno a P03: propuestas de 011, sin decidir nuevo flujo definitivo.
- **Estados relevantes:** Desenlace / variante pendiente / créditos; acceso a atribuciones sin spoilers propuesto.
- **Accesibilidad y 320×180:** Texto contrastado y paginado; autorías reales pendientes. Sin umbrales inventados ni identidad nueva de Dev.

## Layout narrativo por acto (propuestas para Arte)

| Acto | Recorrido narrativo | Ubicaciones e interacciones |
|---|---|---|
| 1 | Sala fría → oficina → switch → nodo → diagnóstico → enlace | PATO en escritorio de Marga; post-its 01–05 junto a sus contextos; primeros hologramas solo tras red del edificio restaurada |
| 2 | Salida de Kernel & Co. → metro → central eléctrica → antena → puerta del datacenter | Tipos bloques, bug e indentación; notas 06–08; log de Marga revela puente.py al cierre |
| 3 | Núcleo de ARCA → puesto de terminal → retorno | Notas 09–10; preparación simulada y último ticket; P15 después del objetivo final |

No son mapas Tiled, coordenadas, colisiones ni desbloqueos aprobados. Arte define geometría con
Narrativa; Desarrollo especifica disparadores. El pipeline del lore continúa pendiente de definición,
sin añadir un tipo nuevo. Las quince fichas aportan wireframes documentales, no una validación
visual o una aprobación de sus decisiones abiertas.
