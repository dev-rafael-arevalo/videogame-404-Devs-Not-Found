/** Puzzle `cables` (spec 005): unir cada puerto izquierdo con el derecho del mismo color. Sin Phaser. */

export const CABLE_COLORS = ['rojo', 'azul', 'verde', 'amarillo', 'cian', 'naranja'] as const;
export type CableColor = (typeof CABLE_COLORS)[number];

export interface CablesData {
  izquierda: CableColor[];
  derecha: CableColor[];
}

/** Índice del puerto izquierdo → índice del puerto derecho. */
export type Connections = Readonly<Record<number, number>>;

export interface Point {
  x: number;
  y: number;
}

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

function isColorList(value: unknown): value is CableColor[] {
  return Array.isArray(value) && value.every((c) => (CABLE_COLORS as readonly string[]).includes(c));
}

/** Valida `datos` del ticket: dos listas del mismo largo, colores conocidos y una permutación de la otra. */
export function parseCablesData(raw: unknown): CablesData {
  if (!raw || typeof raw !== 'object') throw new Error('cables: datos inválidos');
  const { izquierda, derecha } = raw as Record<string, unknown>;
  if (!isColorList(izquierda) || !isColorList(derecha)) throw new Error('cables: color desconocido');
  if (izquierda.length === 0 || izquierda.length !== derecha.length) throw new Error('cables: largos distintos');
  const sorted = (list: string[]): string => [...list].sort().join(',');
  if (sorted(izquierda) !== sorted(derecha)) throw new Error('cables: la derecha no es una permutación de la izquierda');
  if (new Set(izquierda).size !== izquierda.length) throw new Error('cables: colores repetidos');
  return { izquierda, derecha };
}

export function canConnect(data: CablesData, connections: Connections, left: number, right: number): boolean {
  if (data.izquierda[left] === undefined || data.derecha[right] === undefined) return false;
  if (data.izquierda[left] !== data.derecha[right]) return false;
  return !Object.values(connections).includes(right);
}

export function connect(connections: Connections, left: number, right: number): Connections {
  return { ...connections, [left]: right };
}

export function disconnect(connections: Connections, left: number): Connections {
  const next: Record<number, number> = { ...connections };
  delete next[left];
  return next;
}

export function isSolved(data: CablesData, connections: Connections): boolean {
  return data.izquierda.every((color, left) => {
    const right = connections[left];
    return right !== undefined && data.derecha[right] === color;
  });
}

/** Número que acompaña al color (1 = primer color de la izquierda): el mismo en los dos lados. */
export function portNumber(data: CablesData, side: 'left' | 'right', index: number): number {
  const color = side === 'left' ? data.izquierda[index] : data.derecha[index];
  return data.izquierda.indexOf(color as CableColor) + 1;
}

/** Posiciones de los puertos: dos columnas con margen, repartidas en vertical. Determinista. */
export function layoutPorts(area: Area, count: number): { left: Point[]; right: Point[] } {
  const margin = 24;
  const step = count > 0 ? area.height / (count + 1) : 0;
  const ys = Array.from({ length: count }, (_, i) => Math.round(area.y + step * (i + 1)));
  return {
    left: ys.map((y) => ({ x: area.x + margin, y })),
    right: ys.map((y) => ({ x: area.x + area.width - margin, y })),
  };
}
