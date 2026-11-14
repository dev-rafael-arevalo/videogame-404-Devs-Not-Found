import { HOME, chdir, exists, isDir, resolvePath } from '../vfs';
import type { Command } from './types';

export const cd: Command = (args, state) => {
  const target = args[0] ?? HOME;
  const path = resolvePath(state.vfs.cwd, target);
  if (!exists(state.vfs, path)) return { output: [`cd: ${target}: No existe el archivo o el directorio`], state };
  if (!isDir(state.vfs, path)) return { output: [`cd: ${target}: No es un directorio`], state };
  return { output: [], state: { ...state, vfs: chdir(state.vfs, path) } };
};
