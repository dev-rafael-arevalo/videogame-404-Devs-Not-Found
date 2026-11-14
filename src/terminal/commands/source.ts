import { readFile, resolvePath } from '../vfs';
import type { Command } from './types';

export const source: Command = (args, state) => {
  const target = args[0];
  if (!target) return { output: ['source: falta el archivo. Uso: source .venv/bin/activate'], state };
  const path = resolvePath(state.vfs.cwd, target);
  if (readFile(state.vfs, path) === null) return { output: [`bash: ${target}: No existe el archivo o el directorio`], state };
  if (!path.endsWith('/bin/activate')) return { output: [`source: ${target} no es un script de activación`], state };
  return { output: [], state: { ...state, venvActive: true } };
};
