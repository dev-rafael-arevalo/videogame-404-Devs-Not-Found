/** Geometría de la ventana de puzzle (P10). Sin Phaser: también la leen los tests e2e. */
export const PUZZLE_WINDOW = { x: 24, y: 22, width: 272, height: 148 } as const;

/** Rectángulo donde cada puzzle dibuja su tablero (deja lugar al título arriba y a la pista y el plazo abajo). */
export const PUZZLE_BOARD_AREA = {
  x: PUZZLE_WINDOW.x + 8,
  y: PUZZLE_WINDOW.y + 18,
  width: PUZZLE_WINDOW.width - 16,
  height: PUZZLE_WINDOW.height - 62,
} as const;
