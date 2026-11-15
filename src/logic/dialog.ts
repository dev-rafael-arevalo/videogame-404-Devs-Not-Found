/** Lógica pura del diálogo (P08): ajuste de línea, paginación, tipeo y cursor. */

/** Parte el texto en líneas de como máximo `maxChars`, sin cortar palabras salvo que no quepan. */
export function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let current = '';
    for (const word of paragraph.split(' ').filter((w) => w.length > 0)) {
      const candidate = current.length === 0 ? word : `${current} ${word}`;
      if (candidate.length <= maxChars) {
        current = candidate;
        continue;
      }
      if (current.length > 0) {
        lines.push(current);
        current = '';
      }
      let rest = word;
      while (rest.length > maxChars) {
        lines.push(rest.slice(0, maxChars));
        rest = rest.slice(maxChars);
      }
      current = rest;
    }
    lines.push(current);
  }
  return lines;
}

/** Agrupa líneas en páginas de `linesPerPage`, cada página como un solo string con saltos de línea. */
export function paginate(lines: string[], linesPerPage: number): string[] {
  if (lines.length === 0) return [''];
  const pages: string[] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage).join('\n'));
  }
  return pages;
}

/** Cantidad de caracteres visibles del efecto máquina de escribir. */
export function visibleChars(elapsedMs: number, charsPerSecond: number, total: number): number {
  return Math.min(total, Math.floor((elapsedMs / 1000) * charsPerSecond));
}

export interface DialogCursor {
  /** Índice de la línea de diálogo (quién habla). */
  line: number;
  /** Página dentro de esa línea. */
  page: number;
  /** La página ya se muestra completa. */
  revealed: boolean;
  closed: boolean;
}

export const INITIAL_CURSOR: DialogCursor = { line: 0, page: 0, revealed: false, closed: false };

/**
 * Qué pasa al pulsar E/Espacio: revelar la página → siguiente página → siguiente línea → cerrar.
 * `pagesPerLine[i]` es la cantidad de páginas de la línea i.
 */
export function confirm(cursor: DialogCursor, pagesPerLine: number[]): DialogCursor {
  if (cursor.closed) return cursor;
  if (!cursor.revealed) return { ...cursor, revealed: true };
  const pages = pagesPerLine[cursor.line] ?? 1;
  if (cursor.page + 1 < pages) return { ...cursor, page: cursor.page + 1, revealed: false };
  if (cursor.line + 1 < pagesPerLine.length) return { line: cursor.line + 1, page: 0, revealed: false, closed: false };
  return { ...cursor, closed: true };
}
