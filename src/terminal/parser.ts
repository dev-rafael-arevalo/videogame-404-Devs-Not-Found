/** Parser de la terminal simulada (spec 009). Sin pipes ni redirecciones. Puro. */

export const MAX_LINE_LENGTH = 256;

export interface ParsedLine {
  command: string;
  args: string[];
}

/** Divide la línea en comando y argumentos, respetando comillas simples y dobles. */
export function parseLine(raw: string): ParsedLine | null {
  const line = raw.slice(0, MAX_LINE_LENGTH);
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let hasToken = false;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      hasToken = true;
      continue;
    }
    if (ch === ' ' || ch === '\t') {
      if (hasToken) {
        tokens.push(current);
        current = '';
        hasToken = false;
      }
      continue;
    }
    current += ch;
    hasToken = true;
  }
  if (hasToken) tokens.push(current);
  const [command, ...args] = tokens;
  if (!command) return null;
  return { command, args };
}
