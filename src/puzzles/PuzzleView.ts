import type Phaser from 'phaser';
import type { TicketDef } from '../logic/tickets';

/** Rectángulo (en coordenadas de pantalla) donde el puzzle dibuja su tablero. */
export interface PuzzleArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Vista de un tipo de puzzle (spec 004). `PuzzleScene` la crea dentro de su ventana y espera
 * `onSolved()`. La validación de "¿está resuelto?" vive en `logic/puzzles/<tipo>.ts`.
 */
export interface PuzzleView {
  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void;
  destroy(): void;
  /** Estado para los tests e2e (opcional). */
  snapshot?(): unknown;
}

export type PuzzleFactory = () => PuzzleView;
