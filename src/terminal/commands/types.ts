import type { TerminalState } from '../state';

export interface CommandResult {
  output: string[];
  state: TerminalState;
  /** `clear`: la pantalla borra la salida anterior. */
  clear?: boolean;
}

/** Un comando es una función pura: nunca toca el DOM, la red ni `eval`. */
export type Command = (args: string[], state: TerminalState, allowed: readonly string[]) => CommandResult;
