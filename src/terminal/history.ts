import type { TerminalState } from './state';
import { listDir, resolvePath } from './vfs';

/** Historial y autocompletado de la terminal (spec 009). Puro. */

export const MAX_HISTORY = 100;

export interface History {
  entries: readonly string[];
  /** Posición al navegar con ↑/↓; `null` cuando se está escribiendo. */
  cursor: number | null;
  /** Línea que se estaba escribiendo antes de navegar. */
  draft: string;
}

export const EMPTY_HISTORY: History = { entries: [], cursor: null, draft: '' };

export function push(history: History, line: string): History {
  const trimmed = line.trim();
  if (trimmed.length === 0 || history.entries[history.entries.length - 1] === trimmed) {
    return { ...history, cursor: null, draft: '' };
  }
  const entries = [...history.entries, trimmed].slice(-MAX_HISTORY);
  return { entries, cursor: null, draft: '' };
}

export function navigate(history: History, currentLine: string, direction: 'up' | 'down'): { history: History; line: string } {
  const { entries } = history;
  if (entries.length === 0) return { history, line: currentLine };
  if (direction === 'up') {
    const cursor = history.cursor === null ? entries.length - 1 : Math.max(0, history.cursor - 1);
    const draft = history.cursor === null ? currentLine : history.draft;
    return { history: { ...history, cursor, draft }, line: entries[cursor]! };
  }
  if (history.cursor === null) return { history, line: currentLine };
  const next = history.cursor + 1;
  if (next >= entries.length) return { history: { ...history, cursor: null }, line: history.draft };
  return { history: { ...history, cursor: next }, line: entries[next]! };
}

function commonPrefix(options: string[]): string {
  if (options.length === 0) return '';
  let prefix = options[0]!;
  for (const option of options) {
    while (!option.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/** Tab: completa el comando (primer token) o la ruta del último token. */
export function complete(line: string, state: TerminalState, allowedCommands: readonly string[]): { line: string; options: string[] } {
  const atCommand = !line.includes(' ');
  if (atCommand) {
    const options = allowedCommands.filter((c) => c.startsWith(line)).sort();
    if (options.length === 1) return { line: `${options[0]} `, options: [] };
    if (options.length === 0) return { line, options: [] };
    return { line: commonPrefix(options), options };
  }
  const lastSpace = line.lastIndexOf(' ');
  const head = line.slice(0, lastSpace + 1);
  const token = line.slice(lastSpace + 1);
  const slash = token.lastIndexOf('/');
  const dirPart = slash >= 0 ? token.slice(0, slash + 1) : '';
  const namePart = slash >= 0 ? token.slice(slash + 1) : token;
  const dirPath = dirPart ? resolvePath(state.vfs.cwd, dirPart) : state.vfs.cwd;
  const entries = listDir(state.vfs, dirPath) ?? [];
  const options = entries.filter((e) => e.startsWith(namePart));
  if (options.length === 0) return { line, options: [] };
  if (options.length === 1) return { line: `${head}${dirPart}${options[0]}`, options: [] };
  return { line: `${head}${dirPart}${commonPrefix(options)}`, options };
}
