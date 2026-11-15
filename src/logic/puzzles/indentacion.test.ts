import { describe, expect, it } from 'vitest';
import { INITIAL_INDENT, MAX_LEVEL, cycle, isSolved, parseIndentData, render } from './indentacion';

const data = parseIndentData({
  lineas: [
    { texto: 'def f(x):', nivel: 0 },
    { texto: 'if x:', nivel: 1 },
    { texto: 'return 1', nivel: 2 },
  ],
  inicial: [0, 0, 1],
});

describe('indentacion', () => {
  it('valida líneas, niveles e inicial', () => {
    expect(data.lineas).toHaveLength(3);
    expect(() => parseIndentData({ lineas: [{ texto: 'a', nivel: 0 }], inicial: [0] })).toThrow();
    expect(() => parseIndentData({ lineas: [{ texto: 'a', nivel: 0 }, { texto: 'b', nivel: 9 }], inicial: [0, 0] })).toThrow();
    expect(() => parseIndentData({ lineas: [{ texto: 'a', nivel: 0 }, { texto: 'b', nivel: 1 }], inicial: [0] })).toThrow();
    expect(() => parseIndentData({ lineas: [{ texto: 'a', nivel: 0 }, { texto: 'b', nivel: 1 }], inicial: [0, 1] })).toThrow(); // ya resuelto
  });

  it('CA1: cada click sube un nivel y vuelve a 0 después del máximo', () => {
    let levels = INITIAL_INDENT(data);
    expect(levels).toEqual([0, 0, 1]);
    levels = cycle(levels, 1);
    expect(levels).toEqual([0, 1, 1]);
    for (let i = 0; i < MAX_LEVEL; i += 1) levels = cycle(levels, 0);
    expect(levels[0]).toBe(MAX_LEVEL);
    expect(cycle(levels, 0)[0]).toBe(0);
  });

  it('CA1: resuelto cuando todos los niveles coinciden', () => {
    expect(isSolved(data, [0, 0, 1])).toBe(false);
    expect(isSolved(data, [0, 1, 2])).toBe(true);
  });

  it('render indenta con 4 espacios por nivel', () => {
    expect(render('x', 2)).toBe('        x');
  });
});
