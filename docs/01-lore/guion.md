# Guion de SYS://RESTORE

> Estado: **borrador parcial del guion**, aprobado para documentación de trabajo.
> Cubre el primer slice vertical y la continuación narrativa de los cuatro tickets del acto 1.
> No acredita implementación, pruebas visuales ni aprobación de las decisiones reservadas al Lead.

## Alcance y convenciones

Referencias: [lore](lore.md), [pantallas](pantallas.md), [catálogo de tickets](catalogo-tickets.md),
[plan](../00-plan.md), [CONTRIBUTING](../../CONTRIBUTING.md) y
[constitución](../../specs/constitucion.md).

Este borrador conserva ARCA, Puerto Cero, Kernel & Co. y los personajes existentes.
CRON habla con formalidad burocrática; PATO acompaña con voseo y humor cercano; Dev expresa
las dudas de una persona principiante. No se fija su identidad ni apariencia definitiva.

Cada fila de diálogo corresponde a una intervención o página independiente. Las acotaciones
visuales y de evento son indicaciones de producción, no texto visible ni eventos de código
implementados. Los identificadores se conservan como referencias documentales.
Las cajas podrán dividirse en páginas para asegurar legibilidad a 320×180, sin alterar el sentido;
el ajuste de líneas y la verificación visual siguen pendientes.

Se aplican las pautas de la skill `nueva-actividad` para las voces de CRON y PATO y las pistas
progresivas. No se crean tickets, tipos de puzzle, funcionalidades ni JSON nuevos. Según
CONTRIBUTING, el guion permanece en Markdown hasta la futura migración a `src/data/textos/es.json`.

## 1. P05: introducción en seis viñetas

Las imágenes son propuestas para Arte. Dev permanece consciente durante el reinicio del rack.
El descubrimiento del mundo vacío ocupa el lugar del despertar de la propuesta inicial:
no hay desmayo, lesión ni pérdida de memoria.

| Evento | Imagen propuesta | Voz / página | Texto visible |
|---|---|---|---|
| `intro_01` | Fachada de Kernel & Co.; Puerto Cero durante la noche | Narración, 1 | «Puerto Cero. Kernel & Co.» |
| `intro_01` | Misma viñeta | Narración, 2 | «Tu primer trabajo. Tu primer turno de guardia». |
| `intro_02` | Dev reinicia un rack en la sala fría blindada; reloj próximo a las 03:14 | Narración, 1 | «ARCA debía preservar a la humanidad ante una catástrofe». |
| `intro_02` | Misma viñeta | Narración, 2 | «Todavía no se había probado en producción». |
| `intro_03` | Reloj a las 03:14; monitor del sistema | Narración, 1 | «Un despliegue sin revisar. Un falso positivo». |
| `intro_03` | Misma viñeta | Narración, 2 | «En 0,3 segundos, ARCA respaldó a toda la humanidad». |
| `intro_04` | Sala fría aislada del exterior; Dev continúa junto al rack | Narración, 1 | «La jaula de Faraday bloqueó la señal». |
| `intro_04` | Misma viñeta | Narración, 2 | «Dev quedó afuera del respaldo». |
| `intro_05` | Dev termina de reiniciar el rack y sale de la sala fría; nadie responde | Dev, 1 | «Listo, el rack volvió. ¿Hola? ¿Hay alguien?» |
| `intro_06` | Escritorios vacíos, café todavía tibio y calle sin personas | Narración, 1 | «Afuera, el café seguía tibio». |
| `intro_06` | Misma viñeta | Narración, 2 | «No había nadie para tomarlo». |

Se mantienen los controles de P05: Enter avanza y Esc salta a P06.
El encuentro con PATO aporta el contexto esencial incluso si se omite la introducción.

## 2. P06 + P08: primer encuentro con PATO

**Evento:** `pato_first_meeting`. Dev encuentra al pato de goma del escritorio de Marga
e interactúa con él. P08 muestra el diálogo sobre el mundo P06.

| Orden | Personaje | Texto |
|---|---|---|
| 1 | Dev | «¿Marga? ¿Hay alguien?» |
| 2 | PATO | «Marga no responde. Yo sí». |
| 3 | Dev | «El pato habla. Bueno. Una cosa por vez». |
| 4 | PATO | «Soy PATO. Ayudaba a Marga a depurar». |
| 5 | Dev | «¿Qué pasó con la gente?» |
| 6 | PATO | «ARCA la respaldó. El sistema se está degradando». |
| 7 | Dev | «¿Y yo cómo arreglo eso? Es mi primer día». |
| 8 | PATO | «Empezá por algo chico. Un enlace, por ejemplo». |
| 9 | Dev | «¿Y después?» |
| 10 | PATO | «Después vemos el siguiente. Como en cualquier oficina». |

No se revela `puente.py`: su descubrimiento pertenece al acto 2.

## 3. Primera intervención de CRON y briefing

### P06 + P08: contacto inicial

**Evento:** `cron_first_contact`, después del encuentro con PATO.

| Personaje | Texto |
|---|---|
| CRON | «ARCA requiere mantenimiento. Iniciando asignación de tareas». |
| Dev | «¿Hay alguien más de guardia?» |
| CRON | «Personal disponible para la tarea: usted». |
| PATO | «Yo acompaño. No tengo manos, pero acompaño». |

### P09: presentación del ticket de cableado

**Evento:** `cables_briefing_open`.

| Campo | Contenido |
|---|---|
| Referencia documental del ticket | `a1-01-cables` |
| Título | Reconectar el switch del piso 3 |
| CRON, página 1 | «Reconecte los tres enlaces del switch». |
| CRON, página 2 | «Cada puerto tiene una pareja identificada». |
| CRON, página 3 | «Prioridad: CRÍTICA. Como corresponde». |
| Acciones existentes | ACEPTAR / VOLVER |

La numeración visible global de CRON permanece pendiente: la clave documental no la fija.
El catálogo propone 60 s y 100 conciencias; ambos valores siguen pendientes del Lead y no se
presentan como aprobados. Este guion tampoco establece cuándo comienza el reloj.
VOLVER retorna a P06, sin añadir consecuencias narrativas ni penalizaciones.

## 4. P10: tutorial de cableado

Los siguientes textos se presentan dentro de P10, sin presuponer una nueva superposición P08.
La disposición concreta corresponde a la futura spec del puzzle.

### Apertura

**Evento:** `cables_tutorial_start`, al abrir el puzzle.

| Personaje | Texto |
|---|---|
| PATO | «Uní cada puerto con su pareja. Mirá el número y la forma». |
| PATO | «Podés arrastrar el cable hasta el otro extremo». |
| PATO | «O hacé clic en un puerto y después en su pareja». |
| PATO | «Si los cables se cruzan, no pasa nada». |

Las alternativas de clic y arrastre, los números y las formas ya pertenecen al catálogo.
No se requiere distinguir colores para resolver el puzzle.

### Conexión incorrecta

**Evento:** `cables_wrong_pair`.

| Personaje | Texto |
|---|---|
| CRON | «Identificadores incompatibles. Revise los extremos». |

### Primera pista solicitada

**Evento:** `cables_hint_01`.

| Personaje / página | Texto |
|---|---|
| PATO, 1 | «¿Ya probaste explicarme qué etiqueta tiene cada extremo?» |
| PATO, 2 | «El color es una ayuda más». |

### Segunda pista solicitada

**Evento:** `cables_hint_02`.

| Personaje | Texto |
|---|---|
| PATO | «Uní el círculo 1 con el círculo 1. Después buscá las parejas 2 y 3». |

Se conserva el contenido de las dos pistas del catálogo. No se fija un coste ni se altera
el estado del reloj mediante este guion.

## 5. Éxito, vencimiento y reintento

### P12: cableado completado

**Evento:** `cables_success`, únicamente con las tres parejas correctas, sin reutilizar puertos.

| Personaje / elemento | Texto |
|---|---|
| Encabezado | «TICKET CERRADO» |
| CRON, página 1 | «Enlaces verificados: 3/3. Switch operativo». |
| CRON, página 2 | «Enlace local restablecido». |
| CRON, página 3 | «Personal disponible: pendiente». |

Se recupera el enlace local del switch. No se restaura todavía toda la red del edificio
ni aparecen los primeros hologramas, que corresponden al cierre del acto.
Los resultados numéricos quedan reservados a los valores que apruebe el Lead.

### P06 + P08: regreso al mundo tras el éxito

**Evento:** `cables_success_return`.

| Personaje | Texto |
|---|---|
| Dev | «El switch responde. Ojalá alguien más contestara». |
| PATO | «Es un comienzo. Ya tenés un enlace funcionando». |

### P14: plazo vencido

**Evento:** `cables_deadline_expired`, solo en partidas con plazo.
Acotación visual: glitch y El Recolector barriendo, según la pantalla P14 existente.

| Personaje / elemento | Texto |
|---|---|
| CRON | «Plazo vencido. Rollback del sector». |
| PATO | «Podemos intentarlo otra vez. Mirá las etiquetas, una por una». |
| Acciones existentes | REINTENTAR / VOLVER AL MUNDO |

No se muestran pérdidas de conciencias, puntuación ni avances. La ruta técnica exacta entre
el puzzle, P12 y P14 permanece pendiente; este evento solo identifica el texto de P14.
En modo sin presión no hay vencimiento, conforme a la constitución.

### P09: briefing de reintento

**Evento:** `cables_retry_briefing`, al seleccionar REINTENTAR.

| Personaje | Texto |
|---|---|
| CRON | «Ticket pendiente. Revise las instrucciones antes de aceptar». |

Se presenta nuevamente el briefing de `a1-01-cables`.

### P10: inicio del nuevo intento

**Evento:** `cables_retry_start`, tras aceptar el reintento.

| Personaje | Texto |
|---|---|
| PATO | «Buscá las parejas por número y forma. Vamos de a una». |

El texto no promete conservar conexiones ni reiniciar todo el tablero. Las consecuencias
y el reinicio de estados del rollback siguen pendientes.

## 6. P06 + P08: tres post-its iniciales de Marga

Son notas escritas antes del Gran Despliegue, no comunicaciones en directo de Marga.
Las ubicaciones son propuestas sujetas al layout; su lectura no es requisito para resolver
el ticket ni concede una recompensa nueva.

| Evento | Ubicación propuesta | Texto |
|---|---|---|
| `marga_note_01` | Cerca de PATO, en el escritorio de Marga | «Si te trabás, contáselo al pato. No se ríe de las preguntas. —Marga» |
| `marga_note_02` | Cerca del switch | «Antes de conectar, revisá las etiquetas de ambos extremos. No te guíes solo por el color. —Marga» |
| `marga_note_03` | Junto al panel del nodo, en la zona de transición | «En binario, encendido suma y apagado no. Mirá el valor de cada interruptor. —Marga» |

Cada nota puede dividirse en páginas conservando su firma. Se usa la interacción con post-its
ya prevista; no se añade un sistema de colección. La tercera nota anticipa el siguiente concepto,
sin exigir implementar el puzzle binario dentro del slice.

## 7. Transición narrativa posterior al slice: binario

**Contenido posterior al slice vertical.** La implementación del ticket `a1-02-binario`
corresponde a la futura **spec 007**, según el catálogo y la hoja de ruta.
Su inclusión como transición documental no amplía el alcance jugable de las specs 001–006.

### P06 + P08: siguiente tarea

**Evento:** `binary_transition`, después de cerrar el cableado y regresar al mundo.

| Personaje | Texto |
|---|---|
| CRON | «El switch responde. Un nodo perdió su dirección local de diagnóstico». |
| Dev | «Claro. El cable era el principio». |
| PATO | «Ahora toca un número. Vamos paso a paso». |

### P09: apertura del siguiente briefing

**Evento:** `binary_briefing_open`, cuando se abra el siguiente ticket.

| Campo | Contenido |
|---|---|
| Referencia documental del ticket | `a1-02-binario` |
| Título | Restablecer la dirección del nodo |
| CRON, página 1 | «Dirección requerida: 5. Active los valores cuya suma coincida». |
| CRON, página 2 | «No se requiere calculadora corporativa». |

La dirección es la abstracción local educativa descrita en el catálogo, no una dirección IP.
La continuación del puzzle binario se documenta a continuación, fuera del alcance del primer slice.

## 8. Continuación del acto 1: contenido posterior al slice

Los tickets siguientes y el cierre narrativo pertenecen al contenido posterior al primer slice,
previsto para la futura **spec 007**. No amplían las specs 001–006 ni autorizan implementación.
Se conservan `binary_transition` y `binary_briefing_open` de la sección anterior, sin duplicarlos.
Cada fila es una página independiente; los mensajes y pistas del catálogo se conservan al dividirse.
Los textos de tutorial se muestran dentro de P10, sin añadir una superposición nueva.

### 8.1. Ticket `a1-02-binario`: Restablecer la dirección del nodo

#### P10: tutorial

**Evento:** `binary_tutorial_start`.

| Personaje | Texto |
|---|---|
| Dev | «¿Tengo que escribir el cinco con interruptores?» |
| PATO | «Sí. Mirá los valores: 4, 2 y 1». |
| PATO | «Hacé clic para encender o apagar cada uno». |
| PATO | «Encendido aporta su valor. Apagado aporta cero». |
| PATO | «La suma aparece en el panel. Buscamos cinco». |
| Dev | «Bueno. Tres interruptores. Puedo empezar por ahí». |

Se mantiene la disposición 4, 2, 1 de izquierda a derecha, el estado inicial `000`, las etiquetas
`0/APAGADO` y `1/ENCENDIDO`, la suma visible y el objetivo 5. No requiere arrastre ni distinguir
colores. La dirección sigue siendo una abstracción local educativa, no una dirección IP.

#### P10: configuración incorrecta y dos pistas solicitadas

| Evento | Voz / página | Texto |
|---|---|---|
| `binary_wrong_value` | CRON | «Valor actual distinto de 5. Revise la suma». |
| `binary_hint_01` | PATO, 1 | «Cada interruptor encendido aporta el número de su etiqueta». |
| `binary_hint_01` | PATO, 2 | «Los apagados aportan cero». |
| `binary_hint_02` | PATO | «Cinco es cuatro más uno. Encendé 4 y 1; dejá 2 apagado». |

El mensaje de configuración incompleta no bloquea nuevos clics ni añade una penalización.

#### P12: éxito

**Evento:** `binary_success`. Solo `101` cierra el ticket: 4 encendido, 2 apagado y 1 encendido.
Las otras siete combinaciones no lo cierran; `100` suma 4 y `111` suma 7.

| Elemento / voz | Texto |
|---|---|
| Encabezado | «TICKET CERRADO» |
| CRON | «Dirección 5 restablecida. Nodo localizado». |

#### P06 + P08: reacción posterior

**Evento:** `binary_success_return`.

| Personaje | Texto |
|---|---|
| Dev | «Cuatro más uno. El dos podía descansar». |
| PATO | «Y vos ya sabés leer estos interruptores». |
| Dev | «Ojalá Marga estuviera para verlo». |
| PATO | «Sigamos recuperando la red». |

### 8.2. Ticket `a1-03-paquetes`: Reconstruir el mensaje de diagnóstico

#### P06 + P08: transición

**Evento:** `packets_transition`, después del éxito del binario.

| Personaje | Texto |
|---|---|
| CRON | «El nodo responde. Diagnóstico recibido en cuatro paquetes». |
| Dev | «¿Por qué no se entiende el mensaje?» |
| PATO | «Llegó por partes. Primero hay que ordenarlas». |

#### P09: briefing

**Evento:** `packets_briefing_open`.

| Voz / página | Texto |
|---|---|
| CRON, 1 | «Respuesta recibida en cuatro paquetes». |
| CRON, 2 | «Reconstruya el orden mediante sus números de secuencia». |

Acciones existentes: ACEPTAR / VOLVER.

#### P10: tutorial y tablero

**Evento:** `packets_tutorial_start`.

Las tarjetas comienzan en orden `3, 1, 4, 2`; los espacios de destino están numerados del 1 al 4.

| Número | Fragmento visible |
|---|---|
| 3 | PENDIENTE DE |
| 1 | ENLACE |
| 4 | HABILITACIÓN |
| 2 | CON ARCA |

| Personaje | Texto |
|---|---|
| Dev | «Tengo todas las partes. Me falta el orden». |
| PATO | «Cada tarjeta lleva un número. Los espacios también». |
| PATO | «Arrastrá cada tarjeta hasta su espacio». |
| PATO | «O hacé clic en la tarjeta y después en el destino». |
| PATO | «Para corregir, seleccioná la tarjeta colocada». |
| PATO | «Después hacé clic en su lugar de origen, en la bandeja». |

Cada espacio admite una tarjeta y cada tarjeta se usa una sola vez. Las colocaciones son
corregibles; las etiquetas numéricas bastan para resolver sin distinguir colores.

#### P10: error y dos pistas solicitadas

| Evento | Voz / página | Texto |
|---|---|---|
| `packets_wrong_order` | CRON | «Secuencia incompleta o fuera de orden. Revise las etiquetas». |
| `packets_hint_01` | PATO, 1 | «Los paquetes pueden llegar desordenados». |
| `packets_hint_01` | PATO, 2 | «El número indica dónde va cada uno». |
| `packets_hint_02` | PATO, 1 | «Poné 1 primero, después 2, 3 y 4». |
| `packets_hint_02` | PATO, 2 | «El mensaje completo explica qué falta». |

#### P12: éxito

**Evento:** `packets_success`. Solo `1, 2, 3, 4`, sin espacios vacíos, cierra el ticket.
Un espacio vacío o el orden `1, 3, 2, 4` no lo cierra.
El mensaje reconstruido es «ENLACE CON ARCA PENDIENTE DE HABILITACIÓN».

| Elemento / voz | Texto |
|---|---|
| Encabezado | «TICKET CERRADO» |
| CRON, 1 | «Diagnóstico reconstruido: enlace con ARCA pendiente de habilitación». |
| CRON, 2 | «Se genera el siguiente ticket». |
| CRON, 3 | «Sorpresa administrativa: es urgente». |

### 8.3. Ticket `a1-04-compuertas`: Habilitar el enlace con ARCA

#### P06 + P08: transición

**Evento:** `gates_transition`, después de reconstruir el diagnóstico.

| Personaje | Texto |
|---|---|
| Dev | «Ya tenemos el mensaje. Falta habilitar el enlace». |
| PATO | «La red y el nodo tienen que estar listos». |
| CRON | «Se requiere configurar la condición de habilitación». |
| Dev | «Hasta las puertas tienen requisitos acá». |

#### P09: briefing

**Evento:** `gates_briefing_open`.

| Voz / página | Texto |
|---|---|
| CRON, 1 | «Habilite el enlace únicamente si RED LISTA y NODO LISTO están activos». |
| CRON, 2 | «Se requieren ambas condiciones». |
| CRON, 3 | «“Casi” no es un estado admitido». |

Acciones existentes: ACEPTAR / VOLVER.

#### P10: explicación y tutorial

**Evento:** `gates_tutorial_start`.

| Personaje | Texto |
|---|---|
| Dev | «¿Qué hace una compuerta?» |
| PATO | «Aplica una regla a las entradas y produce una salida». |
| PATO | «Acá, 0 significa inactivo y 1 significa activo». |
| PATO | «AND significa Y: pide las dos entradas activas». |
| PATO | «OR significa O: alcanza con una entrada activa». |
| PATO | «NOT significa NO: invierte una sola entrada». |
| PATO | «Con NOT, cero pasa a uno y uno pasa a cero». |
| Dev | «Entonces NOT usa una entrada. Acá tenemos dos». |
| PATO | «Exacto. Su ficha dice “1 entrada”». |
| PATO | «Arrastrá una ficha al espacio, o usá dos clics». |
| PATO | «Podés reemplazarla. Después pulsá “Probar”». |
| PATO | «La prueba revisa las cuatro combinaciones». |

La leyenda del catálogo permanece visible. OR devuelve 1 cuando **al menos una** entrada es 1,
incluido el caso de ambas activas. NOT es **unario**: no ocupa el espacio de dos entradas ni se
lo evalúa como binario. Cada ficha se puede colocar por arrastre o mediante un clic para
seleccionarla y otro sobre el espacio; otra selección permite reemplazarla.

| Red lista (A) | Nodo listo (B) | AND/Y | OR/O | Salida requerida |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 1 |

| Entrada (A) | NOT/NO (A) |
|---|---|
| 0 | 1 |
| 1 | 0 |

La única solución es AND/Y. OR falla en `01` y `10`; el espacio vacío no cierra el ticket.
«Probar» revisa las cuatro combinaciones. Entradas, salidas y resultados conservan estados
escritos (`0/INACTIVO`, `1/ACTIVO`, coincidencia o error), además de cualquier señal de color.

#### P10: errores y dos pistas solicitadas

| Evento | Voz / página | Texto |
|---|---|---|
| `gates_wrong_rule` | CRON | «La compuerta no cumple todas las combinaciones requeridas». |
| `gates_invalid_arity` | Aviso de interfaz | «NOT requiere una sola entrada». |
| `gates_hint_01` | PATO | «Si una condición sola no alcanza, necesitás una regla que pida las dos». |
| `gates_hint_02` | PATO, 1 | «Elegí AND, que significa Y». |
| `gates_hint_02` | PATO, 2 | «Solo devuelve 1 cuando las dos entradas valen 1». |

Intentar colocar NOT permite elegir otra ficha, sin introducir una penalización.

#### P12: éxito

**Evento:** `gates_success`, después de colocar AND y superar las cuatro comprobaciones.

| Elemento / voz | Texto |
|---|---|
| Encabezado | «TICKET CERRADO» |
| CRON, 1 | «Enlace habilitado». |
| CRON, 2 | «Red del edificio restaurada». |
| CRON, 3 | «Compruebe la aparición de hologramas». |

### 8.4. Vencimiento y reintento de los tres tickets

Se reutiliza la estructura narrativa del cableado con el ticket activo. No se determina qué
estados conserva o reinicia el rollback ni se fijan penalizaciones o costes de pistas.

#### P14: vencimiento, solo en partidas con plazo

| Evento | Ticket | CRON | PATO |
|---|---|---|---|
| `binary_deadline_expired` | `a1-02-binario` | «Plazo vencido. Rollback del sector». | «Podemos intentarlo otra vez. Vamos de a una». |
| `packets_deadline_expired` | `a1-03-paquetes` | «Plazo vencido. Rollback del sector». | «Podemos intentarlo otra vez. Vamos de a una». |
| `gates_deadline_expired` | `a1-04-compuertas` | «Plazo vencido. Rollback del sector». | «Podemos intentarlo otra vez. Vamos de a una». |

Cada personaje interviene por separado. P14 conserva el glitch y El Recolector previstos,
y las acciones REINTENTAR / VOLVER AL MUNDO. En modo sin presión no hay vencimientos.
No se muestran pérdidas de conciencias, puntuación ni avances.

#### P09: briefing de reintento

| Evento | Ticket | CRON |
|---|---|---|
| `binary_retry_briefing` | `a1-02-binario` | «Ticket pendiente. Revise las instrucciones antes de aceptar». |
| `packets_retry_briefing` | `a1-03-paquetes` | «Ticket pendiente. Revise las instrucciones antes de aceptar». |
| `gates_retry_briefing` | `a1-04-compuertas` | «Ticket pendiente. Revise las instrucciones antes de aceptar». |

Al seleccionar REINTENTAR se vuelve a presentar el briefing del ticket correspondiente.

#### P10: inicio del nuevo intento, tras aceptar

| Evento | Ticket | PATO |
|---|---|---|
| `binary_retry_start` | `a1-02-binario` | «Mirá los valores y la suma. Vamos paso a paso». |
| `packets_retry_start` | `a1-03-paquetes` | «Buscá los números de secuencia. Una tarjeta por vez». |
| `gates_retry_start` | `a1-04-compuertas` | «Volvé a mirar qué pide cada combinación». |

La ruta técnica del fallo, el comportamiento del reloj durante diálogos y las consecuencias
sobre resultados siguen pendientes. No se prometen estados conservados o reiniciados.

### 8.5. P06 + P08: cierre narrativo del acto 1

#### Primeros hologramas

**Evento:** `act1_holograms_appear`, al regresar al mundo después de completar compuertas
y los tickets anteriores.

Acotación: aparecen las figuras translúcidas previstas en el lore. No son personas físicamente
devueltas ni personajes nuevos con identidad propia.

| Personaje | Texto |
|---|---|
| Dev | «PATO… hay alguien junto al escritorio». |
| Holograma | «¿Hola? Mi gato quedó afuera». |
| Dev | «Te escuchamos». |
| PATO | «El sector se estabilizó. Ya pueden aparecer acá». |

#### Escala del problema y continuación

**Evento:** `act1_closing`, después de la aparición.

| Personaje | Texto |
|---|---|
| Dev | «¿Con esto alcanza para traerlos de vuelta?» |
| CRON | «Red del edificio operativa. Restauración global pendiente». |
| Dev | «Entonces esto recién empieza». |
| PATO | «Sí. Pero ahora sabemos que podemos ayudarlos». |
| Dev | «Vamos a ver qué pasa afuera». |

El acto termina en P06, no en P15. No se revela la app de retorno del acto 2. CRON comunica
la escala sin fijar porcentajes: la cifra ilustrativa del lore permanece pendiente de conciliación
con el balance global. No se declara sincronizado ese texto ni se modifica el lore.

## 9. Trazabilidad de eventos, pantallas y tickets

| Evento | Pantalla | Ticket asociado | Función |
|---|---|---|---|
| `intro_01` | P05 | — | Puerto Cero, empresa y primer turno |
| `intro_02` | P05 | — | Propósito de ARCA y rack |
| `intro_03` | P05 | — | Gran Despliegue a las 03:14 |
| `intro_04` | P05 | — | Protección de la sala fría |
| `intro_05` | P05 | — | Fin del reinicio y descubrimiento de la ausencia |
| `intro_06` | P05 | — | Mundo vacío |
| `pato_first_meeting` | P06 + P08 | — | Encuentro y contexto esencial |
| `cron_first_contact` | P06 + P08 | `a1-01-cables` | Presentación de CRON |
| `cables_briefing_open` | P09 | `a1-01-cables` | Objetivo y aceptación |
| `cables_tutorial_start` | P10 | `a1-01-cables` | Instrucciones accesibles |
| `cables_wrong_pair` | P10 | `a1-01-cables` | Error de correspondencia |
| `cables_hint_01` | P10 | `a1-01-cables` | Primera pista |
| `cables_hint_02` | P10 | `a1-01-cables` | Segunda pista |
| `cables_success` | P12 | `a1-01-cables` | Éxito local |
| `cables_success_return` | P06 + P08 | `a1-01-cables` | Reacción tras el éxito |
| `cables_deadline_expired` | P14 | `a1-01-cables` | Vencimiento, solo con plazo |
| `cables_retry_briefing` | P09 | `a1-01-cables` | Presentación del reintento |
| `cables_retry_start` | P10 | `a1-01-cables` | Acompañamiento al reintentar |
| `marga_note_01` | P06 + P08 | — | Presentación indirecta de Marga y PATO |
| `marga_note_02` | P06 + P08 | `a1-01-cables` | Pista de identificación |
| `marga_note_03` | P06 + P08 | `a1-02-binario` | Anticipo educativo; transición posterior al slice |
| `binary_transition` | P06 + P08 | `a1-02-binario` | Transición posterior al slice |
| `binary_briefing_open` | P09 | `a1-02-binario` | Siguiente tarea, futura spec 007 |
| `binary_tutorial_start` | P10 | `a1-02-binario` | Tutorial e interacción accesible |
| `binary_wrong_value` | P10 | `a1-02-binario` | Configuración incorrecta |
| `binary_hint_01` | P10 | `a1-02-binario` | Pista progresiva 01 |
| `binary_hint_02` | P10 | `a1-02-binario` | Pista progresiva 02 |
| `binary_success` | P12 | `a1-02-binario` | Éxito verificado |
| `binary_success_return` | P06 + P08 | `a1-02-binario` | Reacción posterior |
| `binary_deadline_expired` | P14 | `a1-02-binario` | Vencimiento, solo con plazo |
| `binary_retry_briefing` | P09 | `a1-02-binario` | Briefing de reintento |
| `binary_retry_start` | P10 | `a1-02-binario` | Acompañamiento al reintentar |
| `packets_transition` | P06 + P08 | `a1-03-paquetes` | Transición desde el ticket anterior |
| `packets_briefing_open` | P09 | `a1-03-paquetes` | Presentación del objetivo |
| `packets_tutorial_start` | P10 | `a1-03-paquetes` | Tutorial e interacción accesible |
| `packets_wrong_order` | P10 | `a1-03-paquetes` | Configuración incorrecta |
| `packets_hint_01` | P10 | `a1-03-paquetes` | Pista progresiva 01 |
| `packets_hint_02` | P10 | `a1-03-paquetes` | Pista progresiva 02 |
| `packets_success` | P12 | `a1-03-paquetes` | Éxito verificado |
| `packets_deadline_expired` | P14 | `a1-03-paquetes` | Vencimiento, solo con plazo |
| `packets_retry_briefing` | P09 | `a1-03-paquetes` | Briefing de reintento |
| `packets_retry_start` | P10 | `a1-03-paquetes` | Acompañamiento al reintentar |
| `gates_transition` | P06 + P08 | `a1-04-compuertas` | Transición desde el ticket anterior |
| `gates_briefing_open` | P09 | `a1-04-compuertas` | Presentación del objetivo |
| `gates_tutorial_start` | P10 | `a1-04-compuertas` | Tutorial e interacción accesible |
| `gates_wrong_rule` | P10 | `a1-04-compuertas` | Configuración incorrecta |
| `gates_invalid_arity` | P10 | `a1-04-compuertas` | NOT requiere una entrada |
| `gates_hint_01` | P10 | `a1-04-compuertas` | Pista progresiva 01 |
| `gates_hint_02` | P10 | `a1-04-compuertas` | Pista progresiva 02 |
| `gates_success` | P12 | `a1-04-compuertas` | Éxito verificado |
| `gates_deadline_expired` | P14 | `a1-04-compuertas` | Vencimiento, solo con plazo |
| `gates_retry_briefing` | P09 | `a1-04-compuertas` | Briefing de reintento |
| `gates_retry_start` | P10 | `a1-04-compuertas` | Acompañamiento al reintentar |
| `act1_holograms_appear` | P06 + P08 | `a1-04-compuertas` | Primeros hologramas tras restaurar la red |
| `act1_closing` | P06 + P08 | `a1-04-compuertas` | Cierre del acto 1 y continuación |

Los 23 eventos originales se conservan; los 32 nuevos pertenecen al contenido posterior al slice.

## 10. Coherencia, sincronización y decisiones pendientes

### Ajustes documentales por sincronizar

- **Éxito del cableado:** este guion usa «Enlace local restablecido» en sustitución de
  «La oficina vuelve a tener red», todavía presente en `catalogo-tickets.md`.
  El ajuste evita sugerir la restauración completa de la red. Debe sincronizarse en una tarea
  posterior autorizada; el catálogo no se modifica en esta tarea. El resto del mensaje se conserva.
- **Inicio del acto:** `lore.md` aún dice que Dev «despierta en la sala fría», y P05 se describe
  con ese término en `pantallas.md`. Aquí se aplica la corrección aprobada: Dev termina de reiniciar
  el rack y descubre la ausencia de personas, sin perder la conciencia. La redacción de esos
  documentos queda pendiente de armonización en una tarea posterior autorizada.

Estas diferencias de redacción quedan registradas, no se presentan como sincronización ya realizada.
Se conserva el cierre del acto con red restaurada y primeros hologramas; el primer cableado
solo recupera un enlace local. No se anticipan acontecimientos del acto 2 ni del final.

### Decisiones reservadas al Lead

- Identidad, tratamiento y apariencia definitivos de Dev y demás detalles pendientes del cuestionario.
- Plazos y recompensas, incluidos los valores propuestos en el catálogo.
- Penalizaciones y coste de pistas; el «−10%» ilustrativo de P10 no se ratifica aquí.
- Consecuencias del rollback, conservación o reinicio de conexiones y recompensas tras reintentar.
- Inicio del reloj y comportamiento durante diálogos, pausa y abandono.
- Relación entre conciencias, uptime y porcentajes de rescate, y resultados del modo sin presión.
- Finales, variantes de epílogo, umbrales y continuidad temporal del desenlace.

### Contenido todavía pendiente

- Revisión del guion del acto 1 ampliado: sus cuatro tickets y cierre quedan documentados como borrador.
- Diálogos de los actos 2 y 3.
- Post-its restantes: se documentan tres iniciales, no se completa el mínimo de diez previsto.
- Frases adicionales de hologramas y epílogos; se incorpora únicamente la primera aparición del acto 1.

### Límites de implementación y validación

El documento aporta textos para pantallas, interacciones y puzzles ya previstos. No añade
personajes, mecánicas, comandos reales ni funcionalidades. No crea escenas ni redefine el flujo
técnico del vencimiento. Las futuras specs deberán cubrir los diálogos y post-its (003),
los tickets y plazos (004), el cableado (005) y el contenido posterior del acto 1 (007).
P05 se mantiene como pantalla prevista, sin reasignar su implementación a una spec mediante este guion.

Según SDD, cualquier implementación requiere spec aprobada, plan y tareas. La legibilidad a
320×180, el ritmo y la integración de los textos deberán comprobarse después en el juego.
Este borrador parcial no declara completada la Etapa 1.
