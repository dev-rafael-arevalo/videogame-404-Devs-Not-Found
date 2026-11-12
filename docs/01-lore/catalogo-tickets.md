# Catálogo de tickets

> Estado: **borrador documental de trabajo**. La propuesta de los cuatro tickets del acto 1
> está aprobada para documentarse; los plazos y las recompensas siguen pendientes de aprobación
> del Lead y de pruebas de juego. Este documento no acredita implementación ni pruebas de runtime.

## Alcance y referencias

Este primer borrador desarrolla únicamente el acto 1, Onboarding, en las oficinas de Kernel & Co.
Conserva el mundo y los personajes de [lore.md](lore.md), los tipos de puzzle y las pantallas de
[pantallas.md](pantallas.md), y los principios de la [constitución](../../specs/constitucion.md).
Los actos 2 y 3 quedan pendientes de futuros borradores.

Dev recupera servicios de la oficina que permiten estabilizar su sector de ARCA. La progresión es
cableado → binario → paquetes → compuertas: correspondencias simples, suma de estados, secuencias
y una regla lógica. El primer ticket corresponde al puzzle del slice vertical; los restantes
completan la progresión del acto 1.

El contenido permanece en Markdown según CONTRIBUTING.md mientras no exista `src/data/`.
Se aplica la skill `nueva-actividad`: tipos existentes, dos pistas progresivas y soluciones
verificables. La futura migración a JSON y los validadores requieren el trabajo SDD correspondiente.

## Resumen del acto 1

**Todos los plazos y recompensas de esta tabla son propuestas pendientes de aprobación del Lead.**
Las recompensas representan cantidades base propuestas de conciencias; no fijan porcentajes de
rescate, incrementos de uptime, penalizaciones ni resultados de los epílogos.

| Orden | Identificador | Título | Tipo | Dificultad | Plazo propuesto | Recompensa base propuesta |
|---|---|---|---|---|---|---|
| 1 | `a1-01-cables` | Reconectar el switch del piso 3 | `cables` | Tutorial | 60 s | 100 conciencias |
| 2 | `a1-02-binario` | Restablecer la dirección del nodo | `binario` | Fácil | 75 s | 150 conciencias |
| 3 | `a1-03-paquetes` | Reconstruir el mensaje de diagnóstico | `paquetes` | Fácil | 80 s | 200 conciencias |
| 4 | `a1-04-compuertas` | Habilitar el enlace con ARCA | `compuertas` | Fácil, integrador | 90 s | 250 conciencias |

## Criterios comunes

- El briefing explica el objetivo y las etiquetas sin presuponer experiencia técnica.
- Los tickets usan P09 (briefing), P10 (puzzle) y P12 (éxito), con PATO como guía.
  No utilizan la terminal P11: se conserva la progresión de interfaces del lore.
- El mouse sigue siendo la interacción principal. Todo arrastre también puede resolverse mediante
  un clic para seleccionar y otro para colocar o conectar, sin mantener pulsado el botón.
  La selección se indica mediante contorno y texto, además del color.
- Los números, formas y estados escritos permiten resolver cada tablero sin distinguir colores.
  Ninguna instrucción depende exclusivamente del sonido.
- Las conexiones y colocaciones se pueden corregir. Un error de manipulación o una prueba
  incorrecta no establece por sí mismo una nueva penalización.
- Se admite el modo sin presión, sin vencimiento, exigido por la constitución. Sus efectos sobre
  puntuación y epílogos permanecen pendientes; no se inventan reglas aquí.
- Los textos se distribuyen entre briefing, diálogo y tablero para ser legibles a 320×180.
  La comprobación visual se realizará durante la implementación, no se da por realizada aquí.
- Los criterios de aceptación siguientes son requisitos para la futura implementación;
  sus casillas pendientes no representan tests ya ejecutados.

## 1. Reconectar el switch del piso 3

| Campo | Definición |
|---|---|
| Identificador | `a1-01-cables` |
| Tipo | `cables` |
| Dificultad | Tutorial |
| Plazo | **Propuesta pendiente del Lead: 60 s** |
| Recompensa base | **Propuesta pendiente del Lead: 100 conciencias** |

### Contexto, objetivo y concepto educativo

Tras encontrar a PATO, Dev recibe de CRON una tarea concreta: recuperar los enlaces de un switch
de la oficina. Es el primer paso para restablecer la red del edificio.

El objetivo es conectar tres puertos de origen con sus destinos correspondientes. Enseña la
correspondencia entre extremos de una conexión y la identificación de puertos; es una abstracción
de cableado, sin exigir conocimientos previos de redes.

### Interacción y solución verificable

Se arrastra un cable desde un puerto hasta otro, o se selecciona el origen con un clic y luego
el destino con otro. Cada extremo lleva una etiqueta: **1/círculo**, **2/triángulo** o
**3/cuadrado**. Los destinos aparecen desordenados, por ejemplo `2, 3, 1` frente a los orígenes
`1, 2, 3`. El color es complementario. Se puede seleccionar una conexión para corregirla.

El éxito exige tres conexiones con etiquetas iguales, sin reutilizar puertos.
Los cruces visuales entre cables no invalidan la solución.

**Solución de referencia:** `1 → 1`, `2 → 2`, `3 → 3`.

### Mensajes de CRON

- **Inicio:** «Reconecte los tres enlaces del switch. Cada puerto tiene una pareja identificada.
  Prioridad: CRÍTICA. Como corresponde».
- **Conexión incorrecta:** «Identificadores incompatibles. Revise los extremos».
- **Éxito:** «Enlaces verificados: 3/3. Switch operativo. Enlace local restablecido.
  Personal disponible: pendiente».

El mensaje de éxito describe la recuperación local del switch, no el cierre de toda la red del acto.

### Pistas de PATO

1. «¿Ya probaste explicarme qué etiqueta tiene cada extremo? El color es una ayuda más».
2. «Uní el círculo 1 con el círculo 1. Después buscá las parejas 2 y 3».

### Criterios de aceptación

- [ ] CA1: el tablero presenta tres pares con números y formas visibles y destinos desordenados.
- [ ] CA2: `1 → 1`, `2 → 2`, `3 → 3` cierra el ticket; una conexión incorrecta o faltante no lo cierra.
- [ ] CA3: un puerto ocupado no admite dos conexiones simultáneas; las conexiones son corregibles.
- [ ] CA4: tanto arrastrar como seleccionar origen y destino mediante clics permiten la misma solución.
- [ ] CA5: los cruces visuales se aceptan y el tablero se resuelve sin distinguir colores.
- [ ] CA6: se muestran los mensajes correspondientes y las dos pistas están disponibles.

## 2. Restablecer la dirección del nodo

| Campo | Definición |
|---|---|
| Identificador | `a1-02-binario` |
| Tipo | `binario` |
| Dificultad | Fácil |
| Plazo | **Propuesta pendiente del Lead: 75 s** |
| Recompensa base | **Propuesta pendiente del Lead: 150 conciencias** |

### Contexto, objetivo y concepto educativo

El switch responde, pero un nodo perdió su dirección local de diagnóstico. CRON muestra el valor
que Dev debe reconstruir. Esta dirección es una abstracción educativa local, no una dirección IP.

El objetivo es representar el número **5** mediante tres interruptores binarios. Cada posición
aporta un valor; los interruptores activos se suman.

### Interacción y solución verificable

Un clic alterna cada interruptor entre `0/APAGADO` y `1/ENCENDIDO`, sin arrastre. Los interruptores
están etiquetados **4**, **2** y **1**, de izquierda a derecha, e inicialmente valen `0`.
El panel muestra la suma actual y el objetivo 5. Las etiquetas y los estados escritos acompañan
cualquier cambio de color.

El éxito exige que la suma de los valores activos sea exactamente 5.

**Solución de referencia:** `4: encendido`, `2: apagado`, `1: encendido`; representación `101`.

### Mensajes de CRON

- **Inicio:** «Dirección requerida: 5. Active los valores cuya suma coincida.
  No se requiere calculadora corporativa».
- **Configuración incompleta:** «Valor actual distinto de 5. Revise la suma».
- **Éxito:** «Dirección 5 restablecida. Nodo localizado».

### Pistas de PATO

1. «Cada interruptor encendido aporta el número de su etiqueta. Los apagados aportan cero».
2. «Cinco es cuatro más uno. Encendé 4 y 1; dejá 2 apagado».

### Criterios de aceptación

- [ ] CA1: el estado inicial es `000`, la suma visible es 0 y el objetivo visible es 5.
- [ ] CA2: cada clic alterna el estado escrito del interruptor y actualiza la suma correctamente.
- [ ] CA3: entre las ocho combinaciones posibles, solo `101` cierra el ticket.
- [ ] CA4: `100` muestra 4 y `111` muestra 7; ninguna de esas configuraciones cierra el ticket.
- [ ] CA5: se puede corregir cualquier estado y resolver el puzzle sin arrastre ni distinción de colores.
- [ ] CA6: se muestran los mensajes correspondientes y las dos pistas están disponibles.

## 3. Reconstruir el mensaje de diagnóstico

| Campo | Definición |
|---|---|
| Identificador | `a1-03-paquetes` |
| Tipo | `paquetes` |
| Dificultad | Fácil |
| Plazo | **Propuesta pendiente del Lead: 80 s** |
| Recompensa base | **Propuesta pendiente del Lead: 200 conciencias** |

### Contexto, objetivo y concepto educativo

El nodo recibe una respuesta de diagnóstico dividida en cuatro paquetes que llegaron fuera de orden.
Dev debe reconstruirla para conocer el estado del enlace con ARCA.

El objetivo es ordenar los paquetes según su número de secuencia. Enseña secuenciación y
reconstrucción de un mensaje a partir de fragmentos ordenados.

### Interacción y solución verificable

Se arrastran cuatro tarjetas, inicialmente en orden `3, 1, 4, 2`, a espacios numerados del 1 al 4.
Como alternativa, un clic selecciona la tarjeta y otro el espacio de destino. Una tarjeta colocada
puede devolverse a la bandeja mediante selección y clic en su lugar de origen; no se exige arrastre
para corregir. Cada espacio admite una tarjeta y cada tarjeta se usa una sola vez.

| Número de paquete | Fragmento visible |
|---|---|
| 1 | ENLACE |
| 2 | CON ARCA |
| 3 | PENDIENTE DE |
| 4 | HABILITACIÓN |

El éxito exige las cuatro tarjetas en los espacios que coinciden con sus números.

**Solución de referencia:** `1, 2, 3, 4`: «ENLACE CON ARCA PENDIENTE DE HABILITACIÓN».

### Mensajes de CRON

- **Inicio:** «Respuesta recibida en cuatro paquetes. Reconstruya el orden mediante sus números
  de secuencia».
- **Orden incorrecto:** «Secuencia incompleta o fuera de orden. Revise las etiquetas».
- **Éxito:** «Diagnóstico reconstruido: enlace con ARCA pendiente de habilitación.
  Se genera el siguiente ticket. Sorpresa administrativa: es urgente».

### Pistas de PATO

1. «Los paquetes pueden llegar desordenados. El número indica dónde va cada uno».
2. «Poné 1 primero, después 2, 3 y 4. El mensaje completo explica qué falta».

### Criterios de aceptación

- [ ] CA1: las cuatro tarjetas muestran número y fragmento, y comienzan en orden `3, 1, 4, 2`.
- [ ] CA2: únicamente `1, 2, 3, 4` cierra el ticket y produce el mensaje completo indicado.
- [ ] CA3: un espacio vacío o el orden `1, 3, 2, 4` no cierra el ticket.
- [ ] CA4: no se duplican tarjetas ni se colocan dos en un espacio; toda colocación es corregible.
- [ ] CA5: tanto el arrastre como la selección por clic permiten resolver y corregir sin depender del color.
- [ ] CA6: se muestran los mensajes correspondientes y las dos pistas están disponibles.

## 4. Habilitar el enlace con ARCA

| Campo | Definición |
|---|---|
| Identificador | `a1-04-compuertas` |
| Tipo | `compuertas` |
| Dificultad | Fácil, integrador |
| Plazo | **Propuesta pendiente del Lead: 90 s** |
| Recompensa base | **Propuesta pendiente del Lead: 250 conciencias** |

### Contexto, objetivo y concepto educativo

La red local está preparada. Falta configurar la condición que habilita el enlace con ARCA,
paso que permite cerrar la restauración de la red del edificio.

El objetivo es elegir la compuerta que active la salida **solo cuando ambas entradas estén activas**.
Enseña la diferencia entre **AND/Y**, **OR/O** y **NOT/NO**, con foco en la conjunción.

### Interacción y solución verificable

Se coloca una ficha de compuerta en un único espacio del circuito y se pulsa «Probar».
Se puede arrastrar o seleccionar la ficha con un clic y el espacio con otro; otra selección
permite reemplazarla. Las entradas se llaman **Red lista** y **Nodo listo**.
La leyenda visible explica los operadores:

- **AND/Y:** devuelve 1 cuando ambas entradas son 1.
- **OR/O:** devuelve 1 cuando al menos una entrada es 1.
- **NOT/NO:** invierte una sola entrada: `0 → 1` y `1 → 0`. Es un **operador unario**,
  no una compuerta de dos entradas. Su ficha indica «1 entrada» y no puede ocupar el espacio
  de dos entradas de este ejercicio; el intento muestra «NOT requiere una sola entrada».

«Probar» comprueba las cuatro combinaciones, no solo el caso de ambas entradas activas.
La salida y los resultados de las pruebas se escriben como `0/INACTIVO` o `1/ACTIVO`,
con etiquetas de coincidencia o error además del color.

| Red lista (A) | Nodo listo (B) | AND/Y | OR/O | Salida requerida |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 1 |

Tabla de verdad completa de NOT, separada por ser unario:

| Entrada (A) | NOT/NO (A) |
|---|---|
| 0 | 1 |
| 1 | 0 |

**Solución de referencia:** **AND/Y**, que satisface las cuatro salidas requeridas.

### Mensajes de CRON

- **Inicio:** «Habilite el enlace únicamente si RED LISTA y NODO LISTO están activos.
  Se requieren ambas condiciones. “Casi” no es un estado admitido».
- **Prueba incorrecta:** «La compuerta no cumple todas las combinaciones requeridas».
- **Éxito:** «Enlace habilitado. Red del edificio restaurada. Compruebe la aparición de hologramas».

### Pistas de PATO

1. «Si una condición sola no alcanza, necesitás una regla que pida las dos».
2. «Elegí AND, que significa Y. Solo devuelve 1 cuando las dos entradas valen 1».

### Criterios de aceptación

- [ ] CA1: la leyenda explica AND, OR y NOT e identifica explícitamente a NOT como unario.
- [ ] CA2: colocar AND y pulsar «Probar» verifica `00 → 0`, `01 → 0`, `10 → 0`, `11 → 1`
  y cierra el ticket.
- [ ] CA3: OR no cierra el ticket: se identifican los errores de los casos `01` y `10`.
- [ ] CA4: intentar colocar NOT informa que requiere una sola entrada, no lo evalúa como binario
  y permite elegir otra ficha.
- [ ] CA5: el espacio vacío no cierra el ticket; arrastre y selección por clic permiten colocar
  y reemplazar fichas con el mismo resultado.
- [ ] CA6: entradas, salidas y resultados son comprensibles sin distinguir colores; se muestran
  los mensajes correspondientes y están disponibles las dos pistas.

## Dependencias y límites SDD

Según la [hoja de ruta](../00-plan.md), las specs 005 y 007 todavía deben redactarse y aprobarse.
Los números siguientes son referencias de planificación, no enlaces a archivos existentes.

| Contenido | Dependencia de implementación | Alcance |
|---|---|---|
| `a1-01-cables` | Spec 005: primer puzzle, cableado | Vista, interacción accesible y validador del primer puzzle del slice |
| `a1-02-binario` | Spec 007: resto de puzzles del acto 1 y guardado | Interruptores, suma y validación |
| `a1-03-paquetes` | Spec 007 | Ordenación y validación de la secuencia |
| `a1-04-compuertas` | Spec 007 | Selección de operador, aridad y evaluación de todas las combinaciones |

El flujo también depende de interacción y diálogos (003), tickets, plazos y HUD (004), sobre la
base y el mundo previstos en 001–002. Este borrador no crea ni modifica specs ni aprueba código.
Antes de implementar: spec aprobada por el Lead, luego plan y tareas; posteriormente validadores
puros y pruebas de datos, además de verificación visual de las escenas según la constitución.

## Coherencia y decisiones pendientes

- Se conservan ARCA, Dev, PATO y CRON, las oficinas y los cuatro tipos del acto 1.
  El cierre lleva a la restauración de la red y los primeros hologramas, sin adelantar el retorno
  físico del final ni introducir personajes o tipos nuevos.
- Los identificadores `a1-*` son claves de contenido. No fijan la numeración visible global de CRON;
  los números ilustrativos de pantallas y lore no se convierten en secuencia obligatoria.
- Los 60 s y 100 conciencias del primer ticket son propuestas de este borrador. Los 90 s y
  1200 conciencias del ejemplo de arquitectura no constituyen un balance aprobado.
- La correspondencia por números y formas amplía el cableado por color descrito en pantallas
  para cumplir la constitución, manteniendo el tipo y el objetivo del puzzle.
- El rollback y el reintento siguen siendo la referencia del lore y de P14. Quedan pendientes
  sus consecuencias exactas, reinicio de estados, recompensas tras reintentar y penalizaciones.
- El coste de pistas también queda pendiente: el «−10%» del wireframe P10 es una referencia
  no ratificada por este catálogo; no se aplica ni se elimina mediante este documento.
- No se define una conversión entre recompensas, uptime y porcentaje global de rescate.
  La cifra de cierre del acto del lore queda pendiente de conciliación con el balance global;
  este borrador no la recalcula ni la declara validada.
- Los finales, umbrales de epílogos y efectos del modo sin presión sobre ellos quedan pendientes
  del Lead. Estos tickets no resuelven la continuidad temporal del epílogo.
- La ruta exacta del vencimiento entre P12 y P14 y el efecto de pausar o abandonar sobre el reloj
  requieren definición en el flujo y las specs correspondientes; no se fijan aquí.
- Los plazos y recompensas requieren aprobación del Lead y pruebas con principiantes.
  Las tablas lógicas y soluciones son verificables documentalmente; la accesibilidad, legibilidad
  y dificultad real requieren comprobación posterior en el juego.
