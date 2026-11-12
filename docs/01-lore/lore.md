# Lore: SYS://RESTORE

> Estado: **borrador v1**. Los nombres y detalles marcados con 🔸 dependen del [cuestionario](../cuestionario.md).

## Premisa en una frase

Es el primer día de trabajo de Dev, y toda la humanidad acaba de ser "respaldada" dentro de un
programa. Dev es la única persona desarrolladora de turno que quedó afuera, y tiene que volver a
poner el sistema en línea, ticket por ticket, antes de que se venza el plazo.

## El mundo

### Puerto Cero, la mañana después
Una ciudad costera común. No hubo explosiones ni guerra: hubo **ausencia**. Tazas de café todavía
tibias, autos detenidos con el motor encendido, semáforos que cambian para nadie. Con el paso de los
días (los actos) el mundo se degrada: la electricidad falla, la vegetación avanza y las pantallas
muestran estática. Es un post-apocalipsis **silencioso**.

### ARCA (Archivo de Respaldo de Conciencias Automatizado)
Proyecto de la empresa **Kernel & Co.** 🔸 para preservar a la humanidad ante una catástrofe:
digitalizar conciencias y guardarlas en su datacenter. Nunca se había probado en producción.

### El Gran Despliegue
Un martes a las **03:14**, un despliegue sin revisar activó el protocolo de ARCA por un falso
positivo. En 0,3 segundos todas las personas del planeta fueron subidas al programa. Los animales
no: ARCA solo reconoce conciencias humanas.

### Por qué Dev se salvó
Era su primer turno de guardia nocturna. A las 03:14 estaba dentro de la **sala fría blindada**
del datacenter, reiniciando un rack. La jaula de Faraday bloqueó la señal y Dev salió a un mundo vacío.

### Dentro de ARCA
ARCA reconstruye la ciudad como un mundo pixelado dividido en **sectores**. El respaldo no estaba
pensado para durar: los sectores se corrompen, y las personas atrapadas tienen que sobrevivir
dentro de él mientras se degrada. Cada servicio que Dev restaura afuera estabiliza un sector adentro.

## Personajes

| Personaje | Rol | Notas |
|---|---|---|
| **Dev** 🔸 | Protagonista | Junior, primer trabajo, síndrome de impostor. Su arco va de "no sé nada" a "hice un deploy a producción en soledad". |
| **PATO** | Guía y asistente | Pato de goma con parlante, un viejo asistente de *rubber duck debugging* del escritorio de la senior. Da pistas. Muletilla: *"¿Ya probaste explicármelo en voz alta?"* |
| **CRON** | Sistema de ARCA | El planificador. No es malvado, es burocrático: emite tickets con plazos en texto monoespaciado. *"TICKET #0007 — Restaurar enlace piso 3. PLAZO: 90 s. Prioridad: CRÍTICA (todas lo son)."* |
| **El Recolector** | Antagonista | El *Garbage Collector* de ARCA: libera los sectores "sin referencias". Aparece como un glitch con forma de escoba cuando queda menos del 20% del plazo. Si el plazo vence, hace un **rollback** del sector. |
| **Marga, la Senior** 🔸 | Mentora ausente | Está atrapada en ARCA. Antes del despliegue dejó **post-its** con consejos por todos lados (tutorial y lore coleccionable). Reencuentro en el final. |
| **Hologramas** | Personas atrapadas | Al restaurarse un sector, sus habitantes aparecen como hologramas translúcidos en el mundo real, con frases cortas: *"¿Hola? Mi gato quedó afuera."* |
| **Segfault** | Gato de oficina | Uno de los pocos seres vivos que quedan afuera. Sigue a Dev. Opcional y adorable. |

## Estructura en actos

La dificultad crece con la interfaz: **mouse → mouse con lógica → teclado**.

### Acto 1 · Onboarding (oficinas de Kernel & Co.)
- Dev termina de reiniciar el rack en la sala fría, descubre la ausencia de personas, encuentra a PATO y recibe el primer ticket de CRON.
- **Puzzles con el mouse, simples:** cableado de red, interruptores binarios, ordenar paquetes, compuertas lógicas.
- **Cierre:** se restaura la red del edificio, aparecen los primeros hologramas y CRON revela la escala: *"Conciencias en línea: 0,0000001%"*.

### Acto 2 · Producción (las calles de Puerto Cero)
- Metro, central eléctrica y antena de comunicaciones. El mundo exterior se degrada.
- **Puzzles con el mouse y lógica de código:** ordenar líneas de una función, cazar el bug, armar un pipeline e indentar código Python (puente hacia el acto 3).
- **Cierre:** Dev llega a la puerta del datacenter central. Un log de Marga revela que existe una app de retorno, `puente.py`, que nunca se desplegó.

### Acto 3 · Deploy (el núcleo de ARCA)
- **Terminal:** Dev escribe comandos para preparar y levantar la app: navegar (`ls`, `cd`, `cat`), crear el entorno virtual, instalar dependencias, corregir la configuración y ejecutar `python puente.py --restore all`.
- El Recolector acecha más seguido y los plazos son más cortos.

### Epílogo
Las personas regresan en el mismo instante en que se fueron. Marga entra a la oficina con un café:
*"¿Así que vos sos la persona nueva? Bienvenida al equipo. ¿Qué tal tu primer día?"*
El epílogo cambia según el **porcentaje de conciencias restauradas** (los plazos cumplidos).

## Mecánicas con justificación narrativa

| Mecánica | En el lore |
|---|---|
| Ticket con plazo | CRON asigna tareas, y el plazo es el tiempo antes de que pase El Recolector |
| Fallar el plazo | **Rollback**: el sector vuelve a su estado anterior y hay que reintentar |
| Puntaje | **Conciencias restauradas** (se pierde una parte con cada rollback) |
| Progreso global | **Uptime del sistema %** en el HUD |
| Pistas | PATO (y los post-its de Marga) |

## Tono y referencias

Humor de oficina y de cultura dev (*works on my machine*, deploy un viernes, error 418, pato de
goma) sobre un fondo melancólico. Nunca cruel: nadie muere, a lo sumo queda "en pausa".

## Glosario dentro del juego

- **Ticket:** tarea emitida por CRON.
- **Plazo:** tiempo límite del ticket.
- **Sector:** zona de ARCA que se estabiliza al completar tickets.
- **Rollback:** reinicio del sector cuando vence el plazo.
- **Uptime:** porcentaje global del sistema en línea.


## Cierre documental y decisiones de revisión

El guion de los tres actos y los diez post-its se desarrollan en [guion.md](guion.md).
Los textos del acto 1 son el borrador aprobado; los actos 2–3 y epílogos son propuestas para el Lead.
La restauración del primer switch es local; la red del edificio y los primeros hologramas llegan
al cerrar los cuatro tickets del acto 1. La intro no supone desmayo ni pérdida de memoria.

**Pendientes del Lead:** identidad y nombres marcados, balance, penalizaciones, comandos exactos,
variantes y condiciones de epílogo. La frase del epílogo «en el mismo instante en que se fueron»
se conserva como referencia existente, pero no aprueba un viaje temporal: su relación con los días
transcurridos requiere decisión explícita. Las variantes del guion no resuelven esa continuidad.
El porcentaje ilustrativo del cierre del acto 1 no se utiliza como umbral ni regla de puntuación.

### Referencias de personaje para Arte (propuestas)

| Personaje | Rasgos derivados de la historia | Detalle todavía por aprobar |
|---|---|---|
| Dev | Persona junior de guardia; silueta legible en vista cenital | Apariencia, vestimenta y tratamiento definitivo |
| PATO | Pato de goma con parlante; asistente del escritorio de Marga | Colores y expresión visual |
| CRON | Sistema que comunica mediante ventanas monoespaciadas | No requiere inventar un cuerpo físico |
| El Recolector | Glitch con forma de escoba | Intensidad del glitch y animación accesible |
| Marga | Mentora ausente, vinculada a post-its y reencuentro | Retrato y apariencia |
| Hologramas | Figuras humanas translúcidas | Variantes de silueta sin identidades nuevas |
| Segfault | Gato de oficina que quedó afuera del respaldo | Diseño y participación opcional |
