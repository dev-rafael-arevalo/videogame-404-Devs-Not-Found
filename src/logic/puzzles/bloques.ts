/** Puzzle `bloques` (spec 008): ordenar las líneas de una función intercambiándolas de a pares. Sin Phaser. */
import type { Area } from './cables';

export interface BloquesData {
  /** Líneas en el orden correcto. */
  lineas: string[];
  /** Orden en que se muestran al empezar: índices de `lineas`. */
  inicial: number[];
}

export interface BloquesState {
  /** Índice de `lineas` que ocupa cada fila. */
  order: number[];
  /** Fila seleccionada a la espera del intercambio. */
  selected: number | null;
}

export interface LineRow {
  x: number;
  y: number;
  width: number;
  height: number;
}

function isPermutation(list: unknown, n: number): list is number[] {
  return Array.isArray(list) && list.length === n && [...list].sort((a, b) => a - b).every((v, i) => v === i);
}

export function parseBloquesData(raw: unknown): BloquesData {
  if (!raw || typeof raw !== 'object') throw new Error('bloques: datos inválidos');
  const { lineas, inicial } = raw as Record<string, unknown>;
  if (!Array.isArray(lineas) || lineas.length < 2 || !lineas.every((l) => typeof l === 'string')) throw new Error('bloques: hacen falta al menos 2 líneas');
  if (!isPermutation(inicial, lineas.length)) throw new Error('bloques: inicial debe ser una permutación de los índices');
  if (inicial.every((v, i) => v === i)) throw new Error('bloques: el orden inicial ya es el correcto');
  return { lineas: lineas as string[], inicial };
}

export const INITIAL_BLOQUES = (data: BloquesData): BloquesState => ({ order: [...data.inicial], selected: null });

export function click(state: BloquesState, row: number): BloquesState {
  if (row < 0 || row >= state.order.length) return state;
  if (state.selected === null) return { ...state, selected: row };
  if (state.selected === row) return { ...state, selected: null };
  const order = [...state.order];
  [order[state.selected], order[row]] = [order[row]!, order[state.selected]!];
  return { order, selected: null };
}

export function isSolved(state: BloquesState): boolean {
  return state.order.every((v, i) => v === i);
}

/** Filas de texto repartidas en el área (compartido por los tres puzzles de código). */
export function layoutLines(area: Area, count: number, top = 14, bottom = 12): LineRow[] {
  const available = area.height - top - bottom;
  const height = Math.min(12, Math.floor(available / count));
  return Array.from({ length: count }, (_, i) => ({ x: area.x + 4, y: area.y + top + i * height, width: area.width - 8, height }));
}
