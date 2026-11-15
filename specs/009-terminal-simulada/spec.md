# Spec 009: Terminal simulada y núcleo de ARCA

- **Estado:** Terminada (2026-11-13)
- **Etapa:** 4 Implementación
- **Depende de:** 008

## Problema / objetivo
El acto 3 se juega escribiendo comandos. Hace falta una terminal **simulada** (nunca ejecuta nada
real; ver `docs/04-arquitectura/seguridad.md`) con un sistema de archivos virtual, comandos
guionados, historial y autocompletado, dentro de la pantalla CRT verde (P11). Esta spec construye el
motor, la pantalla, el mapa del núcleo y el primer ticket; la 010 agrega los tickets del deploy.

## Requisitos funcionales
- RF1: `src/terminal/parser.ts`: divide la línea en comando y argumentos respetando comillas simples y dobles; sin pipes ni redirecciones. Línea vacía → nada.
- RF2: `src/terminal/vfs.ts`: sistema de archivos virtual en memoria (rutas absolutas, `~` = `/home/dev`, `.` y `..`), con `ls`, lectura, existencia, directorios derivados de los archivos y creación de directorios/archivos (para el venv).
- RF3: Comandos como funciones puras `(args, estado) → { salida, estado }` en `src/terminal/commands/`, registrados por nombre: `help`, `ls`, `cd`, `pwd`, `cat`, `echo`, `clear`, `python` (`--version`, `-m venv`, `archivo.py`), `pip` (`install`, `list`), `source` (activa el venv). Un comando no registrado responde `comando no encontrado: X`; uno no incluido en `comandosPermitidos` del ticket responde que CRON no lo autoriza.
- RF4: `python` y `pip` no ejecutan nada: miran el estado (¿existe el archivo?, ¿hay venv activo?, ¿están las dependencias?) y devuelven salidas guionadas que imitan a las reales.
- RF5: Objetivo del ticket (`datos.objetivo`): combinación de `cwd`, `leido` (archivo mostrado con `cat`), `venvCreado`, `venvActivo`, `depsInstaladas`, `ejecutado` (script corrido con éxito). `checkObjective` es puro.
- RF6: Historial con ↑/↓ (máximo 100 entradas) y Tab que completa comandos y rutas; la línea de entrada acepta hasta 256 caracteres. Puro y testeado (`history.ts`).
- RF7: `TerminalScene` (P11): pantalla completa estilo CRT verde fósforo con cabecera (número de ticket y plazo), salida, prompt `dev@arca:~$` (con `(.venv)` cuando está activo), cursor parpadeante, botón de pista de PATO, Esc para abandonar. El plazo corre igual que en la ventana de puzzle. La salida se pinta como texto del canvas, nunca HTML.
- RF8: Acto 3: mapa del núcleo de ARCA (estética digital: grilla cian, columnas de datos, el núcleo al centro) con PATO, 4 kioscos y la salida del acto 2 que lleva allí; pistas M05 `acto3_nucleo` y M08 `terminal`; ticket `a3-01-explorar` (`ls`, `cd`, `cat` para leer el log de Marga).
- RF9: `WorldScene` abre `Terminal` en vez de `Puzzle` cuando el ticket es de tipo `terminal`. `__debug.terminal()` expone la salida y el estado (DEV).

## Fuera de alcance
Tickets de venv, pip y `puente.py` (010), epílogo (011).

## Criterios de aceptación
- [x] CA1: Vitest: parser con comillas; VFS con rutas relativas, `..` y `~`; cada comando con sus errores; `python puente.py` falla sin venv y sin dependencias; objetivo; historial de 100 y autocompletado de comandos y rutas; el ticket `a3-01` valida y su terminal existe en el mapa del acto 3.
- [x] CA2: Playwright: en el acto 3, el kiosco abre la terminal; `ls` lista `puente/` y `logs/`; `cd logs`, Tab completa `marga.log`, `cat marga.log` cierra el ticket; un comando desconocido responde "comando no encontrado"; ↑ recupera el comando anterior.
- [x] CA3: Visual: captura de la terminal con salida y del núcleo de ARCA.

## Preguntas abiertas
- Ninguna.
