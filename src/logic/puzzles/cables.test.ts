import { describe, expect, it } from 'vitest';
import { canConnect, connect, disconnect, isSolved, layoutPorts, parseCablesData, portNumber } from './cables';

const data = parseCablesData({ izquierda: ['rojo', 'azul', 'verde'], derecha: ['azul', 'rojo', 'verde'] });

describe('parseCablesData', () => {
  it('acepta dos listas del mismo largo que son permutación una de otra', () => {
    expect(data.izquierda).toEqual(['rojo', 'azul', 'verde']);
  });

  it('rechaza largos distintos, colores desconocidos o listas que no son permutación', () => {
    expect(() => parseCablesData({ izquierda: ['rojo'], derecha: ['rojo', 'azul'] })).toThrow();
    expect(() => parseCablesData({ izquierda: ['fucsia'], derecha: ['fucsia'] })).toThrow();
    expect(() => parseCablesData({ izquierda: ['rojo', 'azul'], derecha: ['rojo', 'rojo'] })).toThrow();
    expect(() => parseCablesData(null)).toThrow();
  });
});

describe('canConnect / connect / disconnect', () => {
  it('CA1: solo conecta colores iguales', () => {
    expect(canConnect(data, {}, 0, 1)).toBe(true); // rojo → rojo
    expect(canConnect(data, {}, 0, 0)).toBe(false); // rojo → azul
  });

  it('rechaza un puerto derecho ya ocupado', () => {
    const c = connect({}, 0, 1);
    expect(canConnect(data, c, 2, 1)).toBe(false);
  });

  it('conectar y desconectar son inmutables', () => {
    const a = connect({}, 0, 1);
    const b = disconnect(a, 0);
    expect(a).toEqual({ 0: 1 });
    expect(b).toEqual({});
  });
});

describe('isSolved', () => {
  it('CA1: solo con todas las conexiones correctas', () => {
    expect(isSolved(data, {})).toBe(false);
    expect(isSolved(data, { 0: 1, 1: 0 })).toBe(false);
    expect(isSolved(data, { 0: 1, 1: 0, 2: 2 })).toBe(true);
    expect(isSolved(data, { 0: 0, 1: 1, 2: 2 })).toBe(false);
  });
});

describe('portNumber', () => {
  it('da el mismo número al mismo color en ambos lados (accesibilidad)', () => {
    expect(portNumber(data, 'left', 0)).toBe(1); // rojo
    expect(portNumber(data, 'right', 1)).toBe(1); // rojo
    expect(portNumber(data, 'right', 0)).toBe(2); // azul
    expect(portNumber(data, 'left', 2)).toBe(3); // verde
  });
});

describe('layoutPorts', () => {
  it('CA1: es determinista y reparte los puertos en dos columnas dentro del área', () => {
    const area = { x: 32, y: 40, width: 256, height: 100 };
    const a = layoutPorts(area, 3);
    const b = layoutPorts(area, 3);
    expect(a).toEqual(b);
    expect(a.left).toHaveLength(3);
    expect(a.right).toHaveLength(3);
    expect(a.left[0]!.x).toBeLessThan(a.right[0]!.x);
    for (const p of [...a.left, ...a.right]) {
      expect(p.x).toBeGreaterThanOrEqual(area.x);
      expect(p.x).toBeLessThanOrEqual(area.x + area.width);
      expect(p.y).toBeGreaterThanOrEqual(area.y);
      expect(p.y).toBeLessThanOrEqual(area.y + area.height);
    }
    expect(a.left[1]!.y).toBeGreaterThan(a.left[0]!.y);
  });
});
