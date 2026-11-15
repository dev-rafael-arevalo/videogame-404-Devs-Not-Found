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
P06 ─(Esc)─► P13 Pausa        P06 ─(último ticket)─► P15 Final y créditos
```

## Listado

| ID | Pantalla | Propósito | Controles | Música |
|---|---|---|---|---|
| P01 | Boot (BIOS falso) | Carga de assets con texto de POST retro: `ARCA BIOS v0.3.14 … OK` | Cualquier tecla salta | — (beeps) |
| P02 | Título | Logo, "PRESIONA START", lluvia de caracteres de fondo | Enter, click | M01 |
| P03 | Menú principal | Nueva partida, Continuar (si hay guardado), Opciones, Créditos | Flechas o mouse, Enter | M01 |
| P04 | Opciones | Volumen de música y de efectos, escala, pantalla completa, modo sin presión | Flechas o mouse | M01 |
| P05 | Intro | 4–6 viñetas estáticas con texto: el Gran Despliegue y el despertar en la sala fría | Enter avanza, Esc salta | M02 |
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
│        ☻ SaraDev    🦆                        │
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
| 1 | `cables` | Arrastrar cables entre puertos del mismo color | Conexiones de red |
| 1 | `binario` | Click en interruptores para formar un número | Binario |
| 1 | `paquetes` | Ordenar paquetes numerados | Secuencia y orden |
| 1 | `compuertas` | Colocar AND, OR o NOT para encender la salida | Lógica booleana |
| 2 | `bloques` | Ordenar líneas de código desordenadas | Secuencia de un algoritmo |
| 2 | `bug` | Click en la línea con el error | Depuración |
| 2 | `indentacion` | Ajustar la sangría de un bloque Python | Sintaxis de Python |
| 3 | `terminal` | Escribir comandos | Shell, venv, pip y ejecución |
