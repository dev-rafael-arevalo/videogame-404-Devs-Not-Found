import type { TerminalObjective, TerminalState } from './state';

/** ¿El estado cumple el objetivo del ticket? Todas las condiciones presentes deben cumplirse. */
export function checkObjective(state: TerminalState, objective: TerminalObjective): boolean {
  if (objective.cwd !== undefined && state.vfs.cwd !== objective.cwd) return false;
  if (objective.leido !== undefined && !state.readFiles.includes(objective.leido)) return false;
  if (objective.venvCreado && !state.venvCreated) return false;
  if (objective.venvActivo && !state.venvActive) return false;
  if (objective.depsInstaladas && state.installed.length === 0) return false;
  if (objective.ejecutado !== undefined && !state.ran.includes(objective.ejecutado)) return false;
  return true;
}
