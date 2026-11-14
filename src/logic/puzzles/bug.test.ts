import { describe, expect, it } from 'vitest';
import { INITIAL_BUG, check, isSolved, parseBugData } from './bug';

const data = parseBugData({ lineas: ['a', 'b = 1', 'if b = 1:', 'c'], bug: 2, explicacion: 'Comparar es ==.' });

describe('bug', () => {
  it('valida líneas, índice y explicación', () => {
    expect(data.bug).toBe(2);
    expect(() => parseBugData({ lineas: ['a'], bug: 0, explicacion: 'x' })).toThrow();
    expect(() => parseBugData({ lineas: ['a', 'b'], bug: 5, explicacion: 'x' })).toThrow();
    expect(() => parseBugData({ lineas: ['a', 'b'], bug: 1, explicacion: '' })).toThrow();
  });

  it('CA1: acertar resuelve; fallar suma un intento y marca error', () => {
    const wrong = check(data, INITIAL_BUG, 0);
    expect(wrong).toEqual({ intentos: 1, error: true, resuelto: false });
    const right = check(data, wrong, 2);
    expect(right).toEqual({ intentos: 2, error: false, resuelto: true });
    expect(isSolved(right)).toBe(true);
    expect(isSolved(wrong)).toBe(false);
  });

  it('una vez resuelto no cambia', () => {
    const solved = check(data, INITIAL_BUG, 2);
    expect(check(data, solved, 0)).toBe(solved);
  });
});
