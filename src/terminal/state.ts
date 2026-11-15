import { HOME, createVfs, type Vfs } from './vfs';

/** Estado completo de la terminal simulada (spec 009). Inmutable. */
export interface TerminalState {
  vfs: Vfs;
  /** Archivos mostrados con `cat` (rutas absolutas). */
  readFiles: readonly string[];
  venvCreated: boolean;
  venvActive: boolean;
  /** Paquetes instalados con `pip`. */
  installed: readonly string[];
  /** Scripts ejecutados con éxito (`python x.py`). */
  ran: readonly string[];
  configFixed: boolean;
}

export interface TerminalObjective {
  cwd?: string;
  leido?: string;
  venvCreado?: boolean;
  venvActivo?: boolean;
  depsInstaladas?: boolean;
  ejecutado?: string;
}

export interface TerminalInitialState {
  venvCreado?: boolean;
  venvActivo?: boolean;
  instalados?: string[];
}

/** `datos` de un ticket de tipo `terminal`. */
export interface TerminalData {
  cwdInicial: string;
  /** Para que un ticket arranque donde terminó el anterior (spec 010). */
  estadoInicial?: TerminalInitialState;
  archivos: Record<string, string>;
  objetivo: TerminalObjective;
  comandosPermitidos: string[];
}

export function parseTerminalData(raw: unknown): TerminalData {
  if (!raw || typeof raw !== 'object') throw new Error('terminal: datos inválidos');
  const r = raw as Record<string, unknown>;
  const cwdInicial = typeof r['cwdInicial'] === 'string' ? r['cwdInicial'] : HOME;
  const archivos = r['archivos'];
  if (!archivos || typeof archivos !== 'object' || !Object.values(archivos as object).every((v) => typeof v === 'string')) {
    throw new Error('terminal: archivos debe ser ruta → contenido');
  }
  const objetivo = r['objetivo'];
  if (!objetivo || typeof objetivo !== 'object') throw new Error('terminal: falta el objetivo');
  const comandosPermitidos = r['comandosPermitidos'];
  if (!Array.isArray(comandosPermitidos) || !comandosPermitidos.every((c) => typeof c === 'string')) throw new Error('terminal: comandosPermitidos inválido');
  const estadoInicial = r['estadoInicial'];
  if (estadoInicial !== undefined && (!estadoInicial || typeof estadoInicial !== 'object')) throw new Error('terminal: estadoInicial inválido');
  return {
    cwdInicial,
    archivos: archivos as Record<string, string>,
    objetivo: objetivo as TerminalObjective,
    comandosPermitidos: comandosPermitidos as string[],
    ...(estadoInicial ? { estadoInicial: estadoInicial as TerminalInitialState } : {}),
  };
}

export function createTerminalState(data: TerminalData): TerminalState {
  const initial = data.estadoInicial ?? {};
  return {
    vfs: createVfs(data.archivos, data.cwdInicial),
    readFiles: [],
    venvCreated: initial.venvCreado === true || initial.venvActivo === true,
    venvActive: initial.venvActivo === true,
    installed: [...(initial.instalados ?? [])],
    ran: [],
    configFixed: false,
  };
}
