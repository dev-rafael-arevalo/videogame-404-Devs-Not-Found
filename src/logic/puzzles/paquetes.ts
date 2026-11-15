/** Puzzle `paquetes` (spec 007): elegir los paquetes de menor a mayor número de secuencia. Sin Phaser. */
import type { Area, Point } from './cables';

export interface PaquetesData {
  /** Números de secuencia en el orden en que llegaron (una permutación de 1..n). */
  paquetes: number[];
}

export interface PaquetesState {
  /** Próximo número que hay que elegir (1..n+1). */
  siguiente: number;
  /** El último click estuvo fuera de orden. */
  error: boolean;
}

export const INITIAL_PAQUETES: PaquetesState = { siguiente: 1, error: false };

export function parsePaquetesData(raw: unknown): PaquetesData {
  if (!raw || typeof raw !== 'object') throw new Error('paquetes: datos inválidos');
  const { paquetes } = raw as Record<string, unknown>;
  if (!Array.isArray(paquetes) || paquetes.length === 0 || !paquetes.every((p) => Number.isInteger(p))) {
    throw new Error('paquetes: hace falta una lista de enteros');
  }
  const sorted = [...(paquetes as number[])].sort((a, b) => a - b);
  if (sorted.some((p, i) => p !== i + 1)) throw new Error('paquetes: debe ser una permutación de 1..n');
  return { paquetes: paquetes as number[] };
}

/** Click en el paquete `index`. Si es el siguiente, avanza; si ya fue elegido, nada; si no, reinicia. */
export function pick(data: PaquetesData, state: PaquetesState, index: number): PaquetesState {
  const numero = data.paquetes[index];
  if (numero === undefined || numero < state.siguiente) return state;
  if (numero === state.siguiente) return { siguiente: state.siguiente + 1, error: false };
  return { siguiente: 1, error: true };
}

export function isPicked(state: PaquetesState, numero: number): boolean {
  return numero < state.siguiente;
}

export function isSolved(data: PaquetesData, state: PaquetesState): boolean {
  return state.siguiente > data.paquetes.length;
}

export function layoutPackets(area: Area, count: number): Point[] {
  const step = area.width / (count + 1);
  const y = Math.round(area.y + area.height * 0.5);
  return Array.from({ length: count }, (_, i) => ({ x: Math.round(area.x + step * (i + 1)), y }));
}
