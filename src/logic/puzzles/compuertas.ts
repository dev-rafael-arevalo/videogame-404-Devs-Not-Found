/** Puzzle `compuertas` (spec 007): elegir compuertas para que la salida sea la esperada. Sin Phaser. */
import type { Area, Point } from './cables';

export const GATES = ['AND', 'OR', 'XOR', 'NAND'] as const;
export type Gate = (typeof GATES)[number];

export interface CompuertasData {
  entradas: boolean[];
  objetivo: boolean;
  /** Compuertas disponibles, en el orden en que se recorren con cada click. */
  compuertas: Gate[];
}

export function parseCompuertasData(raw: unknown): CompuertasData {
  if (!raw || typeof raw !== 'object') throw new Error('compuertas: datos inválidos');
  const { entradas, objetivo, compuertas } = raw as Record<string, unknown>;
  if (!Array.isArray(entradas) || entradas.length < 2 || !entradas.every((e) => typeof e === 'boolean')) {
    throw new Error('compuertas: hacen falta al menos 2 entradas booleanas');
  }
  if (typeof objetivo !== 'boolean') throw new Error('compuertas: objetivo debe ser booleano');
  if (!Array.isArray(compuertas) || compuertas.length === 0 || !compuertas.every((g) => (GATES as readonly string[]).includes(g))) {
    throw new Error('compuertas: compuerta desconocida');
  }
  return { entradas: entradas as boolean[], objetivo, compuertas: compuertas as Gate[] };
}

export function applyGate(gate: Gate, a: boolean, b: boolean): boolean {
  switch (gate) {
    case 'AND':
      return a && b;
    case 'OR':
      return a || b;
    case 'XOR':
      return a !== b;
    case 'NAND':
      return !(a && b);
  }
}

/** `((e0 g0 e1) g1 e2) …` */
export function evaluate(data: CompuertasData, gates: readonly Gate[]): boolean {
  let result = data.entradas[0]!;
  for (let i = 1; i < data.entradas.length; i += 1) {
    result = applyGate(gates[i - 1] ?? data.compuertas[0]!, result, data.entradas[i]!);
  }
  return result;
}

export function cycleGate(data: CompuertasData, current: Gate): Gate {
  const index = data.compuertas.indexOf(current);
  return data.compuertas[(index + 1) % data.compuertas.length]!;
}

export function isSolved(data: CompuertasData, gates: readonly Gate[]): boolean {
  return gates.length === data.entradas.length - 1 && evaluate(data, gates) === data.objetivo;
}

export interface GatesLayout {
  inputs: Point[];
  slots: Point[];
  output: Point;
}

/** Entradas y ranuras alternadas en una fila, salida a la derecha. Determinista. */
export function layoutGates(area: Area, inputCount: number): GatesLayout {
  const nodes = inputCount * 2; // entradas, ranuras y la salida
  const step = area.width / (nodes + 1);
  const y = Math.round(area.y + area.height * 0.5);
  const at = (i: number): Point => ({ x: Math.round(area.x + step * (i + 1)), y });
  return {
    inputs: Array.from({ length: inputCount }, (_, i) => at(i * 2)),
    slots: Array.from({ length: inputCount - 1 }, (_, i) => at(i * 2 + 1)),
    output: at(nodes - 1),
  };
}
