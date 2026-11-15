/** Puzzle `binario` (spec 007): formar un número con interruptores. Sin Phaser. */
import type { Area, Point } from './cables';

export interface BinarioData {
  bits: number;
  objetivo: number;
}

export type Switches = readonly boolean[];

export function parseBinarioData(raw: unknown): BinarioData {
  if (!raw || typeof raw !== 'object') throw new Error('binario: datos inválidos');
  const { bits, objetivo } = raw as Record<string, unknown>;
  if (typeof bits !== 'number' || !Number.isInteger(bits) || bits < 1 || bits > 16) throw new Error('binario: bits debe ser 1–16');
  if (typeof objetivo !== 'number' || !Number.isInteger(objetivo) || objetivo < 0 || objetivo >= 2 ** bits) {
    throw new Error('binario: objetivo no representable');
  }
  return { bits, objetivo };
}

/** Valor del interruptor `index` (0 = el de la izquierda, el más significativo). */
export function bitValue(bits: number, index: number): number {
  return 2 ** (bits - 1 - index);
}

export function toggle(switches: Switches, index: number): Switches {
  return switches.map((on, i) => (i === index ? !on : on));
}

export function valueOf(switches: Switches): number {
  return switches.reduce((total, on, i) => total + (on ? bitValue(switches.length, i) : 0), 0);
}

export function isSolved(data: BinarioData, switches: Switches): boolean {
  return switches.length === data.bits && valueOf(switches) === data.objetivo;
}

/** Centros de los interruptores en una fila, determinista. */
export function layoutSwitches(area: Area, bits: number): Point[] {
  const step = area.width / (bits + 1);
  const y = Math.round(area.y + area.height * 0.45);
  return Array.from({ length: bits }, (_, i) => ({ x: Math.round(area.x + step * (i + 1)), y }));
}
