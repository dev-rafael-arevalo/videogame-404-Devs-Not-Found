# Guion de SYS://RESTORE

> Estado: **borrador parcial del guion**, aprobado para documentación de trabajo.
> Cubre el acto 1 aprobado como borrador y propuestas documentales para los actos 2–3 y epílogos.
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

### Sincronización realizada y continuidad pendiente

El catálogo ya utiliza «Enlace local restablecido» y el inicio de lore y pantallas describe
el final del reinicio del rack, sin desmayo. Se preserva el texto aprobado del acto 1.
Las propuestas de los actos 2–3 no amplían el slice 001–006; corresponden al alcance futuro
008–010, y P15 al 011. No hay aprobación de código ni contratos de datos nuevos.
La continuidad temporal del epílogo permanece pendiente del Lead.

### Decisiones reservadas al Lead

- Identidad, tratamiento y apariencia definitivos de Dev y demás detalles pendientes del cuestionario.
- Plazos y recompensas, incluidos los valores propuestos en el catálogo.
- Penalizaciones y coste de pistas; el «−10%» ilustrativo de P10 no se ratifica aquí.
- Consecuencias del rollback, conservación o reinicio de conexiones y recompensas tras reintentar.
- Inicio del reloj y comportamiento durante diálogos, pausa y abandono.
- Relación entre conciencias, uptime y porcentajes de rescate, y resultados del modo sin presión.
- Finales, variantes de epílogo, umbrales y continuidad temporal del desenlace.

### Estado de cobertura

Acto 1: borrador aprobado, con sus 55 eventos conservados. Actos 2–3, post-its adicionales y
variantes de epílogo: propuestas documentadas para revisión. Quedan por aprobar los textos nuevos,
el catálogo concreto de tickets de actos 2–3, sus datos y soluciones, el contrato de configuración
simulada y las condiciones de epílogo. La Etapa 1 no se declara definitiva por tener estos borradores.

### Límites de implementación y validación

El documento aporta textos para pantallas, interacciones y puzzles ya previstos. No añade
personajes, mecánicas, comandos reales ni funcionalidades. No crea escenas ni redefine el flujo
técnico del vencimiento. Las futuras specs deberán cubrir los diálogos y post-its (003),
los tickets y plazos (004), el cableado (005) y el contenido posterior del acto 1 (007).
P05 se mantiene como pantalla prevista, sin reasignar su implementación a una spec mediante este guion.

Según SDD, cualquier implementación requiere spec aprobada, plan y tareas. La legibilidad a
320×180, el ritmo y la integración de los textos deberán comprobarse después en el juego.
Este borrador parcial no declara completada la Etapa 1.

## 11. Propuestas narrativas para actos 2–3 y desenlace

**Todo el contenido nuevo de esta sección es propuesta para revisión del Lead**, no ratificación.
Se conserva el acto 1 aprobado. No se crean tickets concretos de actos 2–3 ni soluciones inexistentes:
las referencias por tipo requieren catálogo y specs 008–010. El pipeline mencionado en el lore
no tiene tipo ni alcance definido: se conserva como referencia pendiente y no se añade un puzzle.
Las escenas posteriores se presentan en el orden narrativo; los siete post-its nuevos se leen
cuando se interactúa con ellos, no obligatoriamente después del final.

Vencimiento y reintento: se reutilizan los textos de P14 y P09 del acto 1 con el ticket activo.
No se añaden penalizaciones ni se decide qué estado se reinicia. En modo sin presión no hay
vencimientos. El reloj durante tutoriales, pausa y diálogo sigue pendiente de aprobación.

### De Kernel & Co. a Puerto Cero

**Evento:** `act2_city_entry` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| Dev | «Desde la ventana parecía una ciudad dormida.» |
| PATO | «Las luces siguen cambiando. No hay nadie cruzando.» |
| CRON | «Servicios exteriores degradados. Se requiere intervención.» |

### Exploración del metro

**Evento:** `act2_metro` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| Dev | «El tren quedó esperando pasajeros.» |
| PATO | «Dentro de ARCA también están esperando.» |
| CRON | «La estabilidad de los sectores depende de estos servicios.» |

### Introducción a ordenar código

**Evento:** `act2_blocks` · **Pantalla:** P09 / P10 · **Referencia:** bloques.

| Voz / página | Texto visible |
|---|---|
| CRON | «Ordene las líneas de la función según su secuencia lógica.» |
| Dev | «Primero entender qué hace. Después ordenar.» |
| PATO | «Leé cada paso. ¿Qué necesita haber ocurrido antes?» |

Tipo existente; no se inventa una función ni una solución concreta. El ticket y sus datos deben especificarse antes de implementar.

### Resultado de secuencia

**Evento:** `act2_blocks_done` · **Pantalla:** P12 · **Referencia:** bloques.

| Voz / página | Texto visible |
|---|---|
| CRON | «Secuencia verificada.» |
| PATO | «Cada paso ya tiene su lugar.» |

Solo cuando el futuro validador del ticket confirme su solución; no se anticipa la restauración completa de la ciudad.

### Central eléctrica

**Evento:** `act2_power` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| Dev | «Todavía hay tazas sobre los escritorios.» |
| PATO | «Y gente esperando volver a esos escritorios.» |
| CRON | «Siguiente diagnóstico disponible.» |

### Introducción a depuración

**Evento:** `act2_bug` · **Pantalla:** P09 / P10 · **Referencia:** bug.

| Voz / página | Texto visible |
|---|---|
| CRON | «Identifique la línea que impide el comportamiento esperado.» |
| Dev | «Que una línea parezca rara no significa que esté mal.» |
| PATO | «Compará lo que debería pasar con lo que dice el código.» |

No se agrega un error concreto sin ticket y solución aprobados. Selección por línea numerada, no por color.

### Resultado de diagnóstico

**Evento:** `act2_bug_done` · **Pantalla:** P12 · **Referencia:** bug.

| Voz / página | Texto visible |
|---|---|
| CRON | «Línea identificada correctamente.» |
| Dev | «Encontrar el problema también cuenta como avanzar.» |

### Voz de una conciencia

**Evento:** `act2_consciousness` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| Holograma | «¿Todavía está la ciudad afuera?» |
| Dev | «Sí. Está vacía, pero sigue acá.» |
| PATO | «Cada servicio que recuperamos sostiene un sector.» |

Propuesta de frase de holograma genérico, sin identidad o personaje nuevo.

### Antena y preparación

**Evento:** `act2_antenna` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| CRON | «Se requiere revisar la estructura del código Python.» |
| Dev | «Hasta los espacios tienen trabajo.» |
| PATO | «Sí. Nos dicen qué instrucciones van juntas.» |

### Introducción a sangría

**Evento:** `act2_indentation` · **Pantalla:** P09 / P10 · **Referencia:** indentacion.

| Voz / página | Texto visible |
|---|---|
| CRON | «Ajuste la sangría para representar los bloques indicados.» |
| PATO | «Mirá qué líneas pertenecen al mismo bloque.» |
| Dev | «No es decoración. Es parte de la instrucción.» |

Se reutiliza el tipo existente. Bloque concreto y solución pendientes del catálogo, sin prometer ejecución real.

### Resultado de sangría

**Evento:** `act2_indentation_done` · **Pantalla:** P12 · **Referencia:** indentacion.

| Voz / página | Texto visible |
|---|---|
| CRON | «Estructura de bloques verificada.» |
| PATO | «Ahora el código muestra cómo se organiza.» |

### Log al llegar al datacenter

**Evento:** `act2_marga_log` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| Marga, log | «La app de retorno se llama puente.py. Todavía no se desplegó.» |
| Dev | «Marga dejó una salida.» |
| PATO | «Dejó trabajo para que podamos intentarlo.» |

Mensaje grabado de Marga, no conversación en directo. Se descubre la app solo al cierre del acto 2.

### Entrada al núcleo

**Evento:** `act2_core_transition` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2 → 3.

| Voz / página | Texto visible |
|---|---|
| Dev | «Ya no alcanza con encontrar el problema.» |
| PATO | «Ahora toca preparar la app.» |
| CRON | «Acceso al núcleo. Tareas de despliegue pendientes.» |

### Llegada al núcleo

**Evento:** `act3_core_entry` · **Pantalla:** P06 + P08 · **Referencia:** Acto 3.

| Voz / página | Texto visible |
|---|---|
| Dev | «Todo esto sigue sosteniendo a la gente.» |
| PATO | «Sí. Vamos paso a paso.» |
| CRON | «Entorno de despliegue disponible.» |

### Terminal simulada

**Evento:** `act3_terminal_intro` · **Pantalla:** P11 · **Referencia:** terminal.

| Voz / página | Texto visible |
|---|---|
| PATO | «Acá escribís una instrucción y pulsás Enter.» |
| PATO | «La salida cuenta qué entendió el sistema.» |
| Dev | «Una instrucción por vez. Eso puedo hacerlo.» |

Terminal completamente simulada. Sin Python real ni comandos del sistema anfitrión. ↑ recupera historial y Tab autocompleta, según P11.

### Navegar y leer

**Evento:** `act3_navigation` · **Pantalla:** P11 · **Referencia:** terminal.

| Voz / página | Texto visible |
|---|---|
| PATO | «ls muestra qué hay en la carpeta.» |
| PATO | «cd cambia de carpeta. cat permite leer un archivo.» |
| Dev | «Antes de tocar nada, leo las instrucciones.» |

Solo comandos ya propuestos. Rutas y archivos concretos deben proceder del futuro sistema de archivos virtual, no se fijan aquí.

### Preparar el entorno

**Evento:** `act3_venv` · **Pantalla:** P11 · **Referencia:** terminal.

| Voz / página | Texto visible |
|---|---|
| CRON | «Prepare el entorno virtual de la aplicación.» |
| PATO | «python -m venv .venv prepara un entorno separado.» |
| Dev | «Un lugar para las dependencias de esta app.» |

Se conserva el comando mostrado en P11; sus efectos son estado simulado. No se añade un comando de activación.

### Dependencias

**Evento:** `act3_dependencies` · **Pantalla:** P11 · **Referencia:** terminal.

| Voz / página | Texto visible |
|---|---|
| CRON | «Instalación de dependencias pendiente.» |
| PATO | «pip install instala lo que necesita la app.» |
| Dev | «Primero reviso qué pide el proyecto.» |

Argumentos y dependencias pendientes del ticket aprobado. No se simula red real ni se inventan paquetes.

### Configuración

**Evento:** `act3_configuration` · **Pantalla:** P11 · **Referencia:** terminal.

| Voz / página | Texto visible |
|---|---|
| CRON | «Compruebe la configuración requerida para el retorno.» |
| Dev | «No voy a adivinar valores.» |
| PATO | «Leé la referencia del sistema antes de continuar.» |

El lore exige corregir configuración, pero no define cómo. No se agrega editor, comando ni puzzle: interacción bloqueada para implementación hasta especificación aprobada.

### Antes del retorno

**Evento:** `act3_consciousness` · **Pantalla:** P06 + P08 · **Referencia:** Acto 3.

| Voz / página | Texto visible |
|---|---|
| Holograma | «¿Se puede volver?» |
| Dev | «Encontramos la app. Estamos preparándola.» |
| PATO | «Todavía falta comprobar que esté lista.» |

### Ejecución narrativa

**Evento:** `act3_restore` · **Pantalla:** P11 · **Referencia:** terminal.

| Voz / página | Texto visible |
|---|---|
| CRON | «Compruebe los requisitos de despliegue.» |
| PATO | «Cuando estén completos, ejecutá la app.» |
| Dev | «python puente.py --restore all» |

La última línea es entrada de terminal, no un diálogo que ejecute código. Solo se acepta con los prerrequisitos definidos en futuras specs; --restore all conserva el lore, no promete un porcentaje final.

### Prerrequisitos incompletos

**Evento:** `act3_restore_error` · **Pantalla:** P11 · **Referencia:** terminal.

| Voz / página | Texto visible |
|---|---|
| CRON | «Preparación incompleta. Revise los requisitos pendientes.» |
| PATO | «Leé la salida. Nos indica qué falta.» |

No se inventan errores técnicos concretos, pérdidas o castigos. Corrección según el futuro contrato simulado.

### Confirmación del objetivo final

**Evento:** `act3_restore_done` · **Pantalla:** P12 · **Referencia:** terminal.

| Voz / página | Texto visible |
|---|---|
| CRON | «Objetivo de restauración verificado.» |
| Dev | «¿Podemos salir a verlos?» |
| PATO | «Vamos.» |

Solo después del éxito verificado del objetivo final. No afirma que todas las conciencias regresen: alcance pendiente del Lead.

### Reencuentro común propuesto

**Evento:** `ending_reunion` · **Pantalla:** P15 · **Referencia:** Desenlace.

| Voz / página | Texto visible |
|---|---|
| Marga | «¿Así que vos sos la persona nueva? Bienvenida al equipo. ¿Qué tal tu primer día?» |
| Dev | «Tengo algunas preguntas para el próximo onboarding.» |

Se conserva literalmente la frase existente de Marga, incluido su tratamiento, sin ratificar la identidad de Dev. Reencuentro previsto en el lore; la cronología del retorno sigue pendiente.

### Variante propuesta: regreso

**Evento:** `epilogue_recovered` · **Pantalla:** P15 · **Referencia:** Epílogo A.

| Voz / página | Texto visible |
|---|---|
| Dev | «Volvieron las voces a la oficina.» |
| PATO | «Y alguien volvió a dejar una taza junto al teclado.» |

Selección conceptual: resultado con mayor recuperación, si el Lead ratifica esa categoría. No define totalidad ni umbral.

### Variante propuesta: sillas vacías

**Evento:** `epilogue_waiting` · **Pantalla:** P15 · **Referencia:** Epílogo B.

| Voz / página | Texto visible |
|---|---|
| Dev | «Hay voces otra vez. También quedan sillas vacías.» |
| Marga | «Las personas que siguen en pausa no están olvidadas.» |

Selección conceptual: retorno parcial. No establece castigos ni nueva misión jugable.

### Variante propuesta: seguir recordando

**Evento:** `epilogue_silence` · **Pantalla:** P15 · **Referencia:** Epílogo C.

| Voz / página | Texto visible |
|---|---|
| Dev | «Todavía queda demasiado silencio.» |
| PATO | «Sabemos a quiénes estamos esperando.» |

Selección conceptual: menor recuperación. Nadie muere; no fija irreversibilidad ni un final alternativo con game over.

### Créditos

**Evento:** `ending_credits` · **Pantalla:** P15 · **Referencia:** Créditos.

| Voz / página | Texto visible |
|---|---|
| Interfaz | «SYS://RESTORE» |
| Interfaz | «Equipo · Narrativa · Arte · Música · Desarrollo» |
| Interfaz | «Recursos y licencias» |
| Interfaz | «Gracias por jugar.» |

Nombres, autorías y licencias deben salir de créditos reales verificados; los rótulos no inventan atribuciones. Enter acelera el desplazamiento según P15.

### Post-it: Junto al tablero de paquetes

**Evento:** `marga_note_04` · **Pantalla:** P06 + P08 · **Referencia:** Acto 1.

| Voz / página | Texto visible |
|---|---|
| Marga, nota | «Los números de secuencia están para algo. Incluso cuando el café llega antes que el paquete. —Marga» |

Ubicación propuesta: Junto al tablero de paquetes. Propósito: Ordenar sin depender del texto. Nota previa al despliegue, no comunicación en directo; lectura opcional sin recompensa añadida.

### Post-it: Junto al panel de compuertas

**Evento:** `marga_note_05` · **Pantalla:** P06 + P08 · **Referencia:** Acto 1.

| Voz / página | Texto visible |
|---|---|
| Marga, nota | «AND pide las dos condiciones. OR acepta al menos una. NOT trabaja con una sola entrada. —Marga» |

Ubicación propuesta: Junto al panel de compuertas. Propósito: Recordar operadores y aridad. Nota previa al despliegue, no comunicación en directo; lectura opcional sin recompensa añadida.

### Post-it: Acceso del metro

**Evento:** `marga_note_06` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| Marga, nota | «Si un paso necesita el resultado de otro, no puede ir primero. —Marga» |

Ubicación propuesta: Acceso del metro. Propósito: Secuencia de código. Nota previa al despliegue, no comunicación en directo; lectura opcional sin recompensa añadida.

### Post-it: Central eléctrica

**Evento:** `marga_note_07` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| Marga, nota | «Antes de culpar a una línea, compará el resultado esperado con el que obtenés. —Marga» |

Ubicación propuesta: Central eléctrica. Propósito: Depuración razonada. Nota previa al despliegue, no comunicación en directo; lectura opcional sin recompensa añadida.

### Post-it: Zona de la antena

**Evento:** `marga_note_08` · **Pantalla:** P06 + P08 · **Referencia:** Acto 2.

| Voz / página | Texto visible |
|---|---|
| Marga, nota | «En Python, la sangría cuenta qué instrucciones van juntas. Los espacios también trabajan. —Marga» |

Ubicación propuesta: Zona de la antena. Propósito: Estructura de bloques. Nota previa al despliegue, no comunicación en directo; lectura opcional sin recompensa añadida.

### Post-it: Puesto de terminal del núcleo

**Evento:** `marga_note_09` · **Pantalla:** P06 + P08 · **Referencia:** Acto 3.

| Voz / página | Texto visible |
|---|---|
| Marga, nota | «Leé antes de ejecutar. El comando más corto no siempre es el siguiente paso. —Marga» |

Ubicación propuesta: Puesto de terminal del núcleo. Propósito: Lectura y preparación. Nota previa al despliegue, no comunicación en directo; lectura opcional sin recompensa añadida.

### Post-it: Cerca del puesto de despliegue

**Evento:** `marga_note_10` · **Pantalla:** P06 + P08 · **Referencia:** Acto 3.

| Voz / página | Texto visible |
|---|---|
| Marga, nota | «Si llegaste hasta acá con dudas, seguí preguntando. Así también se aprende. —Marga» |

Ubicación propuesta: Cerca del puesto de despliegue. Propósito: Acompañar el arco de Dev. Nota previa al despliegue, no comunicación en directo; lectura opcional sin recompensa añadida.

### Activación de final y variantes: contrato pendiente

P15 se alcanza tras verificar el objetivo del último ticket del acto 3, no al finalizar un acto
intermedio. Se propone un desenlace principal con reencuentro y tres epílogos excluyentes,
seleccionados a partir del resultado de conciencias restauradas. Las categorías A/B/C son
editoriales: no son puntuaciones, umbrales ni condiciones ejecutables. El Lead debe definir
la relación entre --restore all, conciencias en pausa, el reencuentro de Marga y la cronología.
Hasta entonces ninguna variante puede asignarse automáticamente ni presentarse como final aprobado.

Las variantes no describen muertes ni una nueva mecánica de rescate posterior. Los créditos
siguen al epílogo seleccionado. La entrada desde «Créditos» del menú, si se adopta, debe mostrar
solo las atribuciones sin revelar epílogos; retorno al menú propuesto pendiente de spec 011.

### Registro de los diez post-its

Todos se leen mediante la interacción existente de P06 y se presentan en P08. Los tres primeros
se conservan literalmente en su sección original; los siete nuevos son propuestas.

| Identificador | Acto | Ubicación propuesta | Propósito | Pantalla |
|---|---|---|---|---|
| `marga_note_01` | 1 | Escritorio de Marga, cerca de PATO | Pedir ayuda y presentar a Marga | P06 + P08 |
| `marga_note_02` | 1 | Cerca del switch | Identificación por etiquetas | P06 + P08 |
| `marga_note_03` | 1 | Panel del nodo | Suma binaria | P06 + P08 |
| `marga_note_04` | 1 | Junto al tablero de paquetes | Ordenar sin depender del texto. | P06 + P08 |
| `marga_note_05` | 1 | Junto al panel de compuertas | Recordar operadores y aridad. | P06 + P08 |
| `marga_note_06` | 2 | Acceso del metro | Secuencia de código. | P06 + P08 |
| `marga_note_07` | 2 | Central eléctrica | Depuración razonada. | P06 + P08 |
| `marga_note_08` | 2 | Zona de la antena | Estructura de bloques. | P06 + P08 |
| `marga_note_09` | 3 | Puesto de terminal del núcleo | Lectura y preparación. | P06 + P08 |
| `marga_note_10` | 3 | Cerca del puesto de despliegue | Acompañar el arco de Dev. | P06 + P08 |

### Trazabilidad de los eventos nuevos (propuestas)

| Evento | Pantalla | Referencia | Función |
|---|---|---|---|
| `act2_city_entry` | P06 + P08 | Acto 2 | De Kernel & Co. a Puerto Cero |
| `act2_metro` | P06 + P08 | Acto 2 | Exploración del metro |
| `act2_blocks` | P09 / P10 | bloques | Introducción a ordenar código |
| `act2_blocks_done` | P12 | bloques | Resultado de secuencia |
| `act2_power` | P06 + P08 | Acto 2 | Central eléctrica |
| `act2_bug` | P09 / P10 | bug | Introducción a depuración |
| `act2_bug_done` | P12 | bug | Resultado de diagnóstico |
| `act2_consciousness` | P06 + P08 | Acto 2 | Voz de una conciencia |
| `act2_antenna` | P06 + P08 | Acto 2 | Antena y preparación |
| `act2_indentation` | P09 / P10 | indentacion | Introducción a sangría |
| `act2_indentation_done` | P12 | indentacion | Resultado de sangría |
| `act2_marga_log` | P06 + P08 | Acto 2 | Log al llegar al datacenter |
| `act2_core_transition` | P06 + P08 | Acto 2 → 3 | Entrada al núcleo |
| `act3_core_entry` | P06 + P08 | Acto 3 | Llegada al núcleo |
| `act3_terminal_intro` | P11 | terminal | Terminal simulada |
| `act3_navigation` | P11 | terminal | Navegar y leer |
| `act3_venv` | P11 | terminal | Preparar el entorno |
| `act3_dependencies` | P11 | terminal | Dependencias |
| `act3_configuration` | P11 | terminal | Configuración |
| `act3_consciousness` | P06 + P08 | Acto 3 | Antes del retorno |
| `act3_restore` | P11 | terminal | Ejecución narrativa |
| `act3_restore_error` | P11 | terminal | Prerrequisitos incompletos |
| `act3_restore_done` | P12 | terminal | Confirmación del objetivo final |
| `ending_reunion` | P15 | Desenlace | Reencuentro común propuesto |
| `epilogue_recovered` | P15 | Epílogo A | Variante propuesta: regreso |
| `epilogue_waiting` | P15 | Epílogo B | Variante propuesta: sillas vacías |
| `epilogue_silence` | P15 | Epílogo C | Variante propuesta: seguir recordando |
| `ending_credits` | P15 | Créditos | Créditos |
| `marga_note_04` | P06 + P08 | Acto 1 | Post-it: Junto al tablero de paquetes |
| `marga_note_05` | P06 + P08 | Acto 1 | Post-it: Junto al panel de compuertas |
| `marga_note_06` | P06 + P08 | Acto 2 | Post-it: Acceso del metro |
| `marga_note_07` | P06 + P08 | Acto 2 | Post-it: Central eléctrica |
| `marga_note_08` | P06 + P08 | Acto 2 | Post-it: Zona de la antena |
| `marga_note_09` | P06 + P08 | Acto 3 | Post-it: Puesto de terminal del núcleo |
| `marga_note_10` | P06 + P08 | Acto 3 | Post-it: Cerca del puesto de despliegue |
