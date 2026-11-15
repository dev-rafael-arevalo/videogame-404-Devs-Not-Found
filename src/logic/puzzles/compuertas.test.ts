import { describe, expect, it } from 'vitest';
import { applyGate, cycleGate, evaluate, isSolved, layoutGates, parseCompuertasData } from './compuertas';

const data = parseCompuertasData({ entradas: [true, false, true], objetivo: true, compuertas: ['AND', 'OR', 'XOR', 'NAND'] });

describe('compuertas', () => {
  it('valida entradas, objetivo y compuertas conocidas', () => {
    expect(data.entradas).toEqual([true, false, true]);
    expect(() => parseCompuertasData({ entradas: [true], objetivo: true, compuertas: ['AND'] })).toThrow();
    expect(() => parseCompuertasData({ entradas: [true, false], objetivo: true, compuertas: ['NOR'] })).toThrow();
    expect(() => parseCompuertasData({ entradas: [true, false], objetivo: 'si', compuertas: ['AND'] })).toThrow();
  });

  it('CA1: cada compuerta hace lo suyo', () => {
    expect(applyGate('AND', true, false)).toBe(false);
    expect(applyGate('AND', true, true)).toBe(true);
    expect(applyGate('OR', true, false)).toBe(true);
    expect(applyGate('OR', false, false)).toBe(false);
    expect(applyGate('XOR', true, true)).toBe(false);
    expect(applyGate('XOR', true, false)).toBe(true);
    expect(applyGate('NAND', true, true)).toBe(false);
    expect(applyGate('NAND', false, true)).toBe(true);
  });

  it('CA1: encadena de izquierda a derecha', () => {
    // (true AND false) OR true = true ; (true OR false) AND true = true ; (true AND false) AND true = false
    expect(evaluate(data, ['AND', 'OR'])).toBe(true);
    expect(evaluate(data, ['AND', 'AND'])).toBe(false);
    expect(evaluate(data, ['XOR', 'XOR'])).toBe(false);
  });

  it('cycleGate recorre la lista en orden y vuelve al principio', () => {
    expect(cycleGate(data, 'AND')).toBe('OR');
    expect(cycleGate(data, 'NAND')).toBe('AND');
  });

  it('CA1: resuelto cuando la salida es el objetivo', () => {
    expect(isSolved(data, ['AND', 'OR'])).toBe(true);
    expect(isSolved(data, ['AND', 'AND'])).toBe(false);
  });

  it('layoutGates da una posición por entrada y por ranura', () => {
    const area = { x: 32, y: 40, width: 256, height: 86 };
    const layout = layoutGates(area, 3);
    expect(layout.inputs).toHaveLength(3);
    expect(layout.slots).toHaveLength(2);
    expect(layout.output.x).toBeGreaterThan(layout.slots[1]!.x);
    expect(layoutGates(area, 3)).toEqual(layout);
  });
});
