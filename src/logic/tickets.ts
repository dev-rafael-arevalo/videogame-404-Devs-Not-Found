/** Tickets de CRON (spec 004): esquema, orden y formato. Sin Phaser. */

export interface TicketDef {
  id: string;
  /** Número que muestra CRON (#0007). */
  numero: number;
  acto: number;
  /** Nombre del objeto `terminal_x_y` del mapa donde se acepta. */
  terminal: string;
  titulo: string;
  descripcion: string;
  /** Tipo de puzzle: `cables`, `binario`, `paquetes`, `compuertas`, `bloques`, `bug`, `indentacion`, `terminal`. */
  tipo: string;
  plazoSegundos: number;
  conciencias: number;
  pistas: string[];
  /** Depende de `tipo`; cada puzzle define su forma. */
  datos: unknown;
}

/** El siguiente ticket sin completar, respetando el orden del acto; `null` si no queda ninguno. */
export function nextTicket(order: readonly string[], completados: readonly string[]): string | null {
  return order.find((id) => !completados.includes(id)) ?? null;
}

export function formatTicketNumber(numero: number): string {
  return `#${String(numero).padStart(4, '0')}`;
}

const STRING_FIELDS: (keyof TicketDef)[] = ['id', 'terminal', 'titulo', 'descripcion', 'tipo'];
const NUMBER_FIELDS: (keyof TicketDef)[] = ['numero', 'acto', 'plazoSegundos', 'conciencias'];

/** Devuelve los nombres de los campos inválidos (vacío si el ticket es válido). */
export function validateTicket(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return ['ticket'];
  const t = raw as Record<string, unknown>;
  const errors: string[] = [];
  for (const field of STRING_FIELDS) {
    if (typeof t[field] !== 'string' || (t[field] as string).length === 0) errors.push(field);
  }
  for (const field of NUMBER_FIELDS) {
    if (typeof t[field] !== 'number' || !Number.isFinite(t[field])) errors.push(field);
  }
  if (!Array.isArray(t['pistas']) || !t['pistas'].every((p) => typeof p === 'string')) errors.push('pistas');
  if (t['datos'] === undefined || t['datos'] === null) errors.push('datos');
  return errors;
}
