import { describe, expect, it } from 'vitest';
import { INITIAL_PAQUETES, isSolved, layoutPackets, parsePaquetesData, pick } from './paquetes';

const data = parsePaquetesData({ paquetes: [3, 5, 1, 4, 2] });

describe('paquetes', () => {
  it('valida una permutación de 1..n', () => {
    expect(data.paquetes).toEqual([3, 5, 1, 4, 2]);
    expect(() => parsePaquetesData({ paquetes: [1, 2, 2] })).toThrow();
    expect(() => parsePaquetesData({ paquetes: [2, 3] })).toThrow();
    expect(() => parsePaquetesData({ paquetes: [] })).toThrow();
    expect(() => parsePaquetesData({})).toThrow();
  });

  it('CA1: elegir en orden avanza; fuera de orden reinicia y marca el error', () => {
    let state = INITIAL_PAQUETES;
    state = pick(data, state, 2); // paquete 1 (índice 2)
    expect(state).toEqual({ siguiente: 2, error: false });
    state = pick(data, state, 4); // paquete 2
    expect(state.siguiente).toBe(3);
    state = pick(data, state, 1); // paquete 5: fuera de orden
    expect(state).toEqual({ siguiente: 1, error: true });
    state = pick(data, state, 2); // vuelve a empezar por el 1
    expect(state).toEqual({ siguiente: 2, error: false });
  });

  it('CA1: resuelto al elegir todos en orden', () => {
    let state = INITIAL_PAQUETES;
    for (const index of [2, 4, 0, 3, 1]) state = pick(data, state, index);
    expect(isSolved(data, state)).toBe(true);
    expect(isSolved(data, INITIAL_PAQUETES)).toBe(false);
  });

  it('volver a elegir uno ya elegido no cambia nada', () => {
    const state = pick(data, INITIAL_PAQUETES, 2);
    expect(pick(data, state, 2)).toEqual(state);
  });

  it('layoutPackets reparte en una fila, determinista', () => {
    const area = { x: 32, y: 40, width: 256, height: 86 };
    const points = layoutPackets(area, 5);
    expect(points).toHaveLength(5);
    expect(points[0]!.x).toBeLessThan(points[4]!.x);
    expect(layoutPackets(area, 5)).toEqual(points);
  });
});
