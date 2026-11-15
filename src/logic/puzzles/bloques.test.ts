import { describe, expect, it } from 'vitest';
import { INITIAL_BLOQUES, click, isSolved, layoutLines, parseBloquesData } from './bloques';

const data = parseBloquesData({ lineas: ['a', 'b', 'c', 'd'], inicial: [2, 0, 3, 1] });

describe('bloques', () => {
  it('valida líneas e inicial (permutación de índices)', () => {
    expect(data.lineas).toHaveLength(4);
    expect(() => parseBloquesData({ lineas: ['a'], inicial: [0] })).toThrow(); // mínimo 2
    expect(() => parseBloquesData({ lineas: ['a', 'b'], inicial: [0, 0] })).toThrow();
    expect(() => parseBloquesData({ lineas: ['a', 'b'], inicial: [0, 1, 2] })).toThrow();
    expect(() => parseBloquesData({ lineas: ['a', 'b'], inicial: [0, 1] })).toThrow(); // ya resuelto
  });

  it('CA1: el primer click selecciona, el segundo intercambia', () => {
    const s0 = INITIAL_BLOQUES(data);
    expect(s0.order).toEqual([2, 0, 3, 1]);
    const s1 = click(s0, 0);
    expect(s1.selected).toBe(0);
    const s2 = click(s1, 1);
    expect(s2.order).toEqual([0, 2, 3, 1]);
    expect(s2.selected).toBeNull();
  });

  it('click en la misma línea deselecciona', () => {
    const s = click(click(INITIAL_BLOQUES(data), 2), 2);
    expect(s.selected).toBeNull();
    expect(s.order).toEqual([2, 0, 3, 1]);
  });

  it('CA1: resuelto cuando el orden es 0..n-1', () => {
    let s = INITIAL_BLOQUES(data);
    expect(isSolved(s)).toBe(false);
    s = click(click(s, 0), 1); // [0,2,3,1]
    s = click(click(s, 1), 3); // [0,1,3,2]
    s = click(click(s, 2), 3); // [0,1,2,3]
    expect(isSolved(s)).toBe(true);
  });

  it('layoutLines reparte las líneas en filas', () => {
    const rows = layoutLines({ x: 32, y: 40, width: 256, height: 86 }, 4);
    expect(rows).toHaveLength(4);
    expect(rows[1]!.y).toBeGreaterThan(rows[0]!.y);
    expect(rows[3]!.y + rows[3]!.height).toBeLessThanOrEqual(40 + 86);
  });
});
