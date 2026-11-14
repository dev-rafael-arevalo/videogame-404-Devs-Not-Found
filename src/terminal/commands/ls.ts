import { listDir, resolvePath } from '../vfs';
import type { Command } from './types';

export const ls: Command = (args, state) => {
  const target = args.find((a) => !a.startsWith('-')) ?? '.';
  const path = resolvePath(state.vfs.cwd, target);
  const entries = listDir(state.vfs, path);
  if (entries === null) {
    return { output: [`ls: no se puede acceder a '${target}': No existe el archivo o el directorio`], state };
  }
  return { output: [entries.join('  ')], state };
};
