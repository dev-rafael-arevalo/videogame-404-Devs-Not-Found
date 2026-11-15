/** Puzzle `indentacion` (spec 008): poner cada línea de Python en su nivel de sangría. Sin Phaser. */

export interface IndentLine {
  texto: string;
  nivel: number;
}

export interface IndentData {
  lineas: IndentLine[];
  inicial: number[];
}

export type Levels = readonly number[];

export const MAX_LEVEL = 3;
const SPACES_PER_LEVEL = 4;

function isLevel(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= MAX_LEVEL;
}

export function parseIndentData(raw: unknown): IndentData {
  if (!raw || typeof raw !== 'object') throw new Error('indentacion: datos inválidos');
  const { lineas, inicial } = raw as Record<string, unknown>;
  if (
    !Array.isArray(lineas) ||
    lineas.length < 2 ||
    !lineas.every((l) => l && typeof l === 'object' && typeof (l as IndentLine).texto === 'string' && isLevel((l as IndentLine).nivel))
  ) {
    throw new Error('indentacion: hacen falta al menos 2 líneas con texto y nivel 0–3');
  }
  if (!Array.isArray(inicial) || inicial.length !== lineas.length || !inicial.every(isLevel)) throw new Error('indentacion: inicial inválido');
  const parsed = { lineas: lineas as IndentLine[], inicial: inicial as number[] };
  if (isSolved(parsed, parsed.inicial)) throw new Error('indentacion: ya está resuelto');
  return parsed;
}

export const INITIAL_INDENT = (data: IndentData): Levels => [...data.inicial];

export function cycle(levels: Levels, row: number): Levels {
  return levels.map((level, i) => (i === row ? (level + 1) % (MAX_LEVEL + 1) : level));
}

export function isSolved(data: IndentData, levels: Levels): boolean {
  return levels.length === data.lineas.length && data.lineas.every((line, i) => line.nivel === levels[i]);
}

export function render(texto: string, nivel: number): string {
  return `${' '.repeat(nivel * SPACES_PER_LEVEL)}${texto}`;
}
