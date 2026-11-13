/** Movimiento libre en 8 direcciones (spec 002). Sin Phaser: se testea con Vitest. */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface MoveInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface Velocity {
  vx: number;
  vy: number;
}

/** Velocidad de caminata en píxeles por segundo (RF2). */
export const WALK_SPEED = 60;

/** Convierte la entrada en velocidad. La diagonal se normaliza para que no sea más rápida. */
export function computeVelocity(input: MoveInput, speed: number): Velocity {
  const dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (dx === 0 && dy === 0) {
    return { vx: 0, vy: 0 };
  }
  const length = Math.hypot(dx, dy);
  return { vx: (dx / length) * speed, vy: (dy / length) * speed };
}

/** Dirección hacia la que mira el personaje. Si no se mueve, conserva la anterior. */
export function facingFrom(velocity: Velocity, previous: Direction): Direction {
  const { vx, vy } = velocity;
  if (vx === 0 && vy === 0) {
    return previous;
  }
  if (Math.abs(vx) >= Math.abs(vy)) {
    return vx > 0 ? 'right' : 'left';
  }
  return vy > 0 ? 'down' : 'up';
}
