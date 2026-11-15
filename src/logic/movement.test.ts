import { describe, expect, it } from 'vitest';
import { WALK_SPEED, computeVelocity, facingFrom, type MoveInput } from './movement';

const none: MoveInput = { up: false, down: false, left: false, right: false };
const magnitude = ({ vx, vy }: { vx: number; vy: number }): number => Math.hypot(vx, vy);

describe('computeVelocity', () => {
  it('sin entrada no se mueve', () => {
    expect(computeVelocity(none, WALK_SPEED)).toEqual({ vx: 0, vy: 0 });
  });

  it('en línea recta usa la velocidad completa', () => {
    expect(computeVelocity({ ...none, right: true }, 60)).toEqual({ vx: 60, vy: 0 });
    expect(computeVelocity({ ...none, up: true }, 60)).toEqual({ vx: 0, vy: -60 });
  });

  it('CA1: en diagonal la magnitud es igual que en línea recta', () => {
    const diagonal = computeVelocity({ ...none, down: true, right: true }, 60);
    expect(magnitude(diagonal)).toBeCloseTo(60, 5);
    expect(diagonal.vx).toBeCloseTo(diagonal.vy, 5);
    expect(diagonal.vx).toBeGreaterThan(0);
  });

  it('las teclas opuestas se anulan', () => {
    expect(computeVelocity({ ...none, left: true, right: true }, 60)).toEqual({ vx: 0, vy: 0 });
    expect(computeVelocity({ ...none, up: true, down: true, left: true }, 60)).toEqual({ vx: -60, vy: 0 });
  });

  it('la velocidad por defecto es de unos 60 px/s', () => {
    expect(WALK_SPEED).toBe(60);
  });
});

describe('facingFrom', () => {
  it('conserva la última dirección cuando no hay movimiento', () => {
    expect(facingFrom({ vx: 0, vy: 0 }, 'left')).toBe('left');
  });

  it('toma la dirección del eje dominante', () => {
    expect(facingFrom({ vx: 60, vy: 0 }, 'down')).toBe('right');
    expect(facingFrom({ vx: 0, vy: -60 }, 'down')).toBe('up');
    expect(facingFrom({ vx: -10, vy: 50 }, 'up')).toBe('down');
  });

  it('en diagonal exacta prioriza el eje horizontal', () => {
    expect(facingFrom({ vx: 42.4, vy: 42.4 }, 'up')).toBe('right');
    expect(facingFrom({ vx: -42.4, vy: -42.4 }, 'up')).toBe('left');
  });
});
