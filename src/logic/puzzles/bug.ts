/** Puzzle `bug` (spec 008): encontrar la línea con el error. Sin Phaser. */

export interface BugData {
  lineas: string[];
  /** Índice de la línea con el error. */
  bug: number;
  /** Se muestra al acertar. */
  explicacion: string;
}

export interface BugState {
  intentos: number;
  error: boolean;
  resuelto: boolean;
}

export const INITIAL_BUG: BugState = { intentos: 0, error: false, resuelto: false };

export function parseBugData(raw: unknown): BugData {
  if (!raw || typeof raw !== 'object') throw new Error('bug: datos inválidos');
  const { lineas, bug, explicacion } = raw as Record<string, unknown>;
  if (!Array.isArray(lineas) || lineas.length < 2 || !lineas.every((l) => typeof l === 'string')) throw new Error('bug: hacen falta al menos 2 líneas');
  if (typeof bug !== 'number' || !Number.isInteger(bug) || bug < 0 || bug >= lineas.length) throw new Error('bug: índice fuera de rango');
  if (typeof explicacion !== 'string' || explicacion.length === 0) throw new Error('bug: falta la explicación');
  return { lineas: lineas as string[], bug, explicacion };
}

export function check(data: BugData, state: BugState, row: number): BugState {
  if (state.resuelto) return state;
  return { intentos: state.intentos + 1, error: row !== data.bug, resuelto: row === data.bug };
}

export function isSolved(state: BugState): boolean {
  return state.resuelto;
}
