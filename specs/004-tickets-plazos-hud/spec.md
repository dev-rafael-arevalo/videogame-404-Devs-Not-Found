# Spec 004: Sistema de tickets, plazos y HUD

- **Estado:** Terminada (2026-11-12)
- **Etapa:** 4 Implementación
- **Depende de:** 003

## Problema / objetivo
El bucle central del juego es: CRON emite un ticket, SaraDev lo acepta en una terminal, lo resuelve
contra reloj y el sistema gana uptime. Esta spec construye ese bucle completo (briefing, ventana de
puzzle con plazo, resultado y rollback, HUD) con un tablero placeholder; el primer puzzle real llega en
la spec 005.

## Historias de usuario
- Como jugador/a, quiero ver en el HUD el uptime, las conciencias restauradas y el plazo del ticket activo.
- Como jugador/a, quiero leer el ticket de CRON antes de aceptarlo y poder volver atrás.
- Como jugador/a, quiero que, si se vence el plazo, el juego me lo diga con claridad y me deje reintentar.

## Requisitos funcionales
- RF1: Los tickets viven en `src/data/tickets/*.json` con el esquema de `arquitectura.md` más `numero` y `terminal` (nombre del objeto del mapa). `src/data/actos.json` lista los tickets de cada acto en orden. Un test valida todos los JSON.
- RF2: CRON emite de a un ticket: el siguiente sin completar del acto. Usar la terminal que lo tiene abre el **briefing** (P09): número, título, descripción, plazo, prioridad, conciencias; botones ACEPTAR (Enter) y VOLVER (Esc). Las demás terminales responden con un diálogo.
- RF3: ACEPTAR abre la **ventana de puzzle** (P10) sobre el mundo oscurecido al 60%, con título, barra de plazo (verde >50%, amarilla hasta 20%, roja con parpadeo por debajo) y el tablero del tipo del ticket. Sin tipo registrado se muestra un tablero placeholder con el botón "MARCAR RESUELTO". Esc abandona sin penalidad.
- RF4: El plazo corre solo dentro de la ventana de puzzle. Al vencer, se muestra el **rollback** (P14): sacudida y destello rojo, mensaje de CRON, botones REINTENTAR (Enter) y VOLVER AL MUNDO (Esc). Cada rollback resta un 25% a la recompensa del siguiente intento (mínimo 25%).
- RF5: Al resolver se muestra el **resultado** (P12): tiempo, conciencias ganadas y uptime nuevo. Enter vuelve al mundo.
- RF6: El **HUD** (P07, 16 px arriba) muestra uptime (barra y %), conciencias y, con ticket activo, su número y los segundos restantes.
- RF7: Uptime = tickets completados / total del acto. Progreso y plazo son lógica pura (`logic/progress.ts`, `logic/deadline.ts`, `logic/tickets.ts`) y el estado vive en el `registry` de Phaser.
- RF8: Modo sin presión: si `sinPresion` está activo en el registry, el plazo no corre (la opción de menú llega en la 011).

## Fuera de alcance
Puzzles reales (005, 007, 008), sonidos (006), guardado (007), pista de PATO con penalidad (005).

## Criterios de aceptación
- [x] CA1: Vitest: el plazo pasa por `ok → warning (20%) → expired`; no corre en modo sin presión; la recompensa baja 25% por fallo con piso de 25%; `nextTicket` devuelve el primero sin completar y `null` al terminar; todos los tickets JSON validan.
- [x] CA2: Playwright: usar la terminal del primer ticket abre el briefing; Enter abre el puzzle y el plazo baja; el botón del placeholder resuelve y el resultado muestra +1.200 conciencias; al volver, el HUD marca 50% de uptime.
- [x] CA3: Playwright: forzar el vencimiento muestra el rollback; al reintentar y resolver, la recompensa es 900.
- [x] CA4: Visual: briefing, ventana de puzzle con barra, resultado, rollback y HUD nítidos a ×4.

## Preguntas abiertas
- Ninguna.
