import { describe, expect, it } from 'vitest';
import { bitValue, isSolved, layoutSwitches, parseBinarioData, toggle, valueOf } from './binario';

const data = parseBinarioData({ bits: 8, objetivo: 42 });

describe('binario', () => {
  it('valida bits (1–16) y objetivo representable', () => {
    expect(data).toEqual({ bits: 8, objetivo: 42 });
    expect(() => parseBinarioData({ bits: 0, objetivo: 0 })).toThrow();
    expect(() => parseBinarioData({ bits: 4, objetivo: 16 })).toThrow();
    expect(() => parseBinarioData({ bits: 8, objetivo: -1 })).toThrow();
    expect(() => parseBinarioData(null)).toThrow();
  });

  it('CA1: toggle es inmutable y valueOf suma los bits (el de la izquierda es el más significativo)', () => {
    const off = Array<boolean>(8).fill(false);
    const a = toggle(off, 2); // 32
    const b = toggle(a, 4); // 8
    const c = toggle(b, 6); // 2
    expect(off.every((v) => !v)).toBe(true);
    expect(valueOf(c)).toBe(42);
    expect(valueOf(toggle(c, 2))).toBe(10);
    expect(bitValue(8, 0)).toBe(128);
    expect(bitValue(8, 7)).toBe(1);
  });

  it('CA1: resuelto solo cuando el valor es el objetivo', () => {
    const off = Array<boolean>(8).fill(false);
    expect(isSolved(data, off)).toBe(false);
    expect(isSolved(data, toggle(toggle(toggle(off, 2), 4), 6))).toBe(true);
  });

  it('layoutSwitches reparte los interruptores en una fila dentro del área', () => {
    const area = { x: 32, y: 40, width: 256, height: 86 };
    const points = layoutSwitches(area, 8);
    expect(points).toHaveLength(8);
    expect(points[0]!.x).toBeLessThan(points[7]!.x);
    for (const p of points) {
      expect(p.x).toBeGreaterThan(area.x);
      expect(p.x).toBeLessThan(area.x + area.width);
    }
    expect(layoutSwitches(area, 8)).toEqual(points);
  });
});
