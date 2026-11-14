import { cat } from './commands/cat';
import { cd } from './commands/cd';
import { clear } from './commands/clear';
import { echo } from './commands/echo';
import { help } from './commands/help';
import { ls } from './commands/ls';
import { pip } from './commands/pip';
import { pwd } from './commands/pwd';
import { python } from './commands/python';
import { source } from './commands/source';
import type { Command, CommandResult } from './commands/types';
import { parseLine } from './parser';
import type { TerminalState } from './state';

/** Registro fijo de comandos (seguridad.md §1): lo que no está acá, no existe. */
export const COMMANDS: Readonly<Record<string, Command>> = { help, ls, cd, pwd, cat, echo, clear, python, pip, source };

export function runLine(state: TerminalState, line: string, allowed: readonly string[]): CommandResult {
  const parsed = parseLine(line);
  if (!parsed) return { output: [], state };
  const command = COMMANDS[parsed.command];
  if (!command) return { output: [`comando no encontrado: ${parsed.command}`], state };
  if (!allowed.includes(parsed.command)) {
    return { output: [`CRON: el comando '${parsed.command}' no está autorizado en este ticket.`], state };
  }
  return command(parsed.args, state, allowed);
}
