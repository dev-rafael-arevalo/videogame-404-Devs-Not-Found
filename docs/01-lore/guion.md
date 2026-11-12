# Guion de SYS://RESTORE

> Estado: **borrador parcial del guion**, aprobado para documentación de trabajo.
> Cubre el slice vertical del acto 1 y una transición narrativa posterior al slice.
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
El guion del puzzle binario completo queda fuera de este borrador del slice.

## 8. Trazabilidad de eventos, pantallas y tickets

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

## 9. Coherencia, sincronización y decisiones pendientes

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

- Resto del guion del acto 1, incluidos los puzzles posteriores al cableado.
- Diálogos de los actos 2 y 3.
- Post-its restantes: se documentan tres iniciales, no se completa el mínimo de diez previsto.
- Frases de hologramas y epílogos.

### Límites de implementación y validación

El documento aporta textos para pantallas, interacciones y puzzles ya previstos. No añade
personajes, mecánicas, comandos reales ni funcionalidades. No crea escenas ni redefine el flujo
técnico del vencimiento. Las futuras specs deberán cubrir los diálogos y post-its (003),
los tickets y plazos (004), el cableado (005) y el contenido posterior del acto 1 (007).
P05 se mantiene como pantalla prevista, sin reasignar su implementación a una spec mediante este guion.

Según SDD, cualquier implementación requiere spec aprobada, plan y tareas. La legibilidad a
320×180, el ritmo y la integración de los textos deberán comprobarse después en el juego.
Este borrador parcial no declara completada la Etapa 1.
