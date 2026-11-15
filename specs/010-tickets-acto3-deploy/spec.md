# Spec 010: Tickets del acto 3: venv, pip y `python puente.py`

- **Estado:** Terminada (2026-11-13)
- **Etapa:** 4 Implementación
- **Depende de:** 009

## Problema / objetivo
El acto 3 tiene la terminal y un solo ticket. Faltan los tres tickets del deploy que cierran el juego:
preparar el entorno virtual, instalar las dependencias y corregir la configuración para ejecutar
`puente.py --restore all`, más la revelación final de CRON.

## Requisitos funcionales
- RF1: `datos.estadoInicial` opcional en los tickets de terminal (`venvCreado`, `venvActivo`, `instalados`), para que cada ticket arranque donde terminó el anterior sin repetir pasos.
- RF2: Ticket `a3-02-venv` (kiosco superior derecho): en `~/puente`, crear el venv y activarlo (`python -m venv .venv`, `source .venv/bin/activate`). Objetivo: `venvActivo`.
- RF3: Ticket `a3-03-deps` (kiosco inferior izquierdo): con el venv activo, `pip install -r requirements.txt`. Objetivo: `depsInstaladas`. `pip` fuera del venv explica cómo activarlo.
- RF4: Ticket `a3-04-deploy` (kiosco inferior derecho): con venv y dependencias, `python puente.py --check` muestra el error de configuración, `--fix-config` lo corrige y `--restore all` ejecuta el deploy con su barra de progreso. Objetivo: `ejecutado = puente.py`.
- RF5: Diálogo `acto3_fin` al cerrar el último ticket: CRON informa conciencias al 100% y el regreso; PATO y SaraDev cierran (el epílogo visual llega en la 011). Los tickets del acto 3 suman en orden en `actos.json`.
- RF6: Las pistas de PATO de cada ticket guían con el comando exacto como segunda pista.

## Fuera de alcance
Pantalla de final y créditos (011), El Recolector animado.

## Criterios de aceptación
- [x] CA1: Vitest: `estadoInicial` se aplica; los cuatro tickets del acto 3 validan y sus kioscos existen en el mapa.
- [x] CA2: Playwright: en el acto 3, los cuatro tickets se resuelven escribiendo comandos (incluido el error de `pip` fuera del venv y el `ConfigError` antes de `--fix-config`), el uptime queda en 100% y se abre `acto3_fin`.
- [x] CA3: Visual: captura del deploy con la barra al 100%.

## Preguntas abiertas
- Ninguna.
