/** Elección del interactuable más cercano (spec 003). Sin Phaser. */

export interface Point {
  x: number;
  y: number;
}

/** Distancia máxima, en píxeles, desde los pies de SaraDev al centro del objeto. */
export const INTERACT_RANGE = 20;

/** El objeto más cercano a `origin` dentro de `range`, o `null`. */
export function pickInteractable<T extends Point>(origin: Point, items: readonly T[], range: number): T | null {
  let best: T | null = null;
  let bestDistance = range;
  for (const item of items) {
    const distance = Math.hypot(item.x - origin.x, item.y - origin.y);
    if (distance <= bestDistance) {
      best = item;
      bestDistance = distance;
    }
  }
  return best;
}
