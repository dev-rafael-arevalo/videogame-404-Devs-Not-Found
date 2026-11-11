# Arquitectura

## Principio

**Una web estática.** El juego entero corre en el navegador: Phaser dibuja en un `<canvas>`, el
progreso se guarda en `localStorage` y nginx sirve los archivos desde Docker. No hay backend, base
de datos ni cuentas. Se puede sumar algo así más adelante si una spec lo justifica.

```
┌──────────── Navegador ─────────────┐        ┌──── Docker ────┐
│  Phaser (escenas)                  │  HTTP  │ nginx (sin     │
│    ├─ logic/  (TS puro, testeable) │ ◄───── │ privilegios)   │
│    ├─ terminal/ (simulada)         │        │ sirve dist/    │
│    └─ data/*.json (contenido)      │        └────────────────┘
│  localStorage (guardado, opciones) │
└────────────────────────────────────┘
```

## Estructura de carpetas (se crea en la spec 001)

```
src/
  main.ts                 # crea Phaser.Game con la configuración
  config.ts               # 320×180, pixelArt, escala FIT y lista de escenas
  scenes/                 # una escena por pantalla (ver pantallas.md)
    BootScene.ts  TitleScene.ts  MenuScene.ts  IntroScene.ts
    WorldScene.ts HudScene.ts    DialogScene.ts
    BriefingScene.ts PuzzleScene.ts TerminalScene.ts
    ResultScene.ts RollbackScene.ts PauseScene.ts EndScene.ts
  puzzles/                # un archivo por tipo: vista de Phaser del puzzle
    CablesPuzzle.ts ...
  logic/                  # TS puro, sin importar Phaser → se testea con Vitest
    deadline.ts           # temporizador del plazo (umbrales 20% y vencido)
    progress.ts           # uptime, conciencias y tickets completados
    save.ts               # serialización a localStorage, con versión
    puzzles/cables.ts ... # validadores: ¿está resuelto?
  terminal/               # terminal simulada (lógica pura)
    parser.ts             # divide la línea en comando y argumentos
    vfs.ts                # sistema de archivos virtual en memoria
    commands/             # ls.ts cd.ts cat.ts python.ts pip.ts ...
  audio/AudioManager.ts
  data/
    actos.json            # actos → mapas → lista de tickets
    tickets/a1-01-cables.json ...
    textos/es.json        # todos los textos visibles
public/assets/            # sprites, mapas, audio, fuentes (exportados)
tests/e2e/                # Playwright: smoke test
```

## Escenas y flujo

- `WorldScene` es la escena base. `HudScene` y `DialogScene` corren **en paralelo** encima (`scene.launch`).
- Al aceptar un ticket, `WorldScene` se pausa y se lanza `PuzzleScene` (o `TerminalScene`) con el ID del ticket. El mundo sigue visible y oscurecido detrás.
- `PuzzleScene` lee `tipo` del JSON e instancia la clase de `puzzles/` que corresponde. Al resolverse o vencer el plazo, emite `ticket:done` o `ticket:failed` y se cierra.
- La comunicación entre escenas usa los eventos de Phaser (`this.game.events`). No hace falta un gestor de estado global: el estado del progreso vive en `logic/progress.ts`.

## Modelo de datos

### Ticket (`src/data/tickets/*.json`)
```json
{
  "id": "a1-01-cables",
  "acto": 1,
  "titulo": "Reconectar el switch del piso 3",
  "descripcion": "El switch perdió sus enlaces. Conecta cada puerto con su par.",
  "tipo": "cables",
  "plazoSegundos": 90,
  "conciencias": 1200,
  "pistas": ["Los colores no mienten.", "Empieza por el cable que no cruza a nadie."],
  "datos": {
    "izquierda": ["rojo", "azul", "verde"],
    "derecha":   ["azul", "rojo", "verde"]
  }
}
```
`datos` depende de `tipo`. Cada tipo tiene su interfaz en TypeScript y su validador en
`logic/puzzles/<tipo>.ts`.

### Ticket de terminal (`tipo: "terminal"`)
```json
{
  "id": "a3-02-venv",
  "tipo": "terminal",
  "plazoSegundos": 120,
  "datos": {
    "cwdInicial": "/home/dev",
    "archivos": { "/home/dev/puente/requirements.txt": "arca-bridge==1.0\n" },
    "objetivo": { "venvCreado": true, "depsInstaladas": true },
    "comandosPermitidos": ["ls", "cd", "cat", "python", "pip", "clear", "help"]
  }
}
```

### Guardado (`localStorage["sysrestore.save"]`)
```json
{ "version": 1, "acto": 1, "ticketsCompletados": ["a1-01-cables"], "conciencias": 1200,
  "opciones": { "musica": 0.8, "sfx": 1, "sinPresion": false } }
```
Si `version` no coincide, se migra o se descarta con un aviso. Nunca se rompe la carga por un guardado viejo.

## Terminal simulada

- `parser.ts` separa el comando de los argumentos (comillas simples y dobles, sin pipes ni redirecciones en v1).
- Cada comando es una **función pura**: `(args, estado) => { salida, estado }`. Un registro mapea nombre → función. Si el comando no está registrado, responde `comando no encontrado: X`.
- `python` y `pip` **no ejecutan nada**: miran el estado (¿existe el venv?, ¿se instalaron las dependencias?, ¿la configuración es correcta?) y devuelven una salida guionada que imita a la real.
- La salida se pinta como texto en el canvas o en un DOM aparte con `textContent`, **nunca** `innerHTML`.
- Historial con ↑ y ↓, y autocompletado de comandos y rutas con Tab.
- Ampliación futura (solo si el cuestionario lo pide): Python real con **Pyodide** dentro de un Web Worker con timeout. Ver [seguridad.md](seguridad.md).

## Testing

| Capa | Herramienta | Qué se prueba |
|---|---|---|
| `logic/`, `terminal/` | Vitest | Validadores de puzzles, temporizador, progreso, guardado, parser y cada comando |
| Datos | Vitest | Cada JSON de ticket cumple su esquema y su solución existe |
| Juego | Playwright | Smoke: carga, aparece el canvas, se pasa de Título a Mundo y no hay errores en consola |

Las escenas de Phaser no se testean de forma unitaria; se verifican con Playwright, con capturas vía MCP.
