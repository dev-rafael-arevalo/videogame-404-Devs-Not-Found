/** Resolución nativa del juego (constitución, principio 6). */
export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 180;

/**
 * Mayor factor de zoom **entero** con el que el juego entra en la ventana.
 * Nunca devuelve menos de 1: si la ventana es más chica que el juego, se desborda antes que
 * desenfocar los píxeles.
 */
export function integerZoom(
  viewportWidth: number,
  viewportHeight: number,
  gameWidth: number = GAME_WIDTH,
  gameHeight: number = GAME_HEIGHT,
): number {
  const zoom = Math.floor(Math.min(viewportWidth / gameWidth, viewportHeight / gameHeight));
  return Number.isFinite(zoom) && zoom > 1 ? zoom : 1;
}
