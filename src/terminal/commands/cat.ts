import { isDir, readFile, resolvePath } from '../vfs';
import type { Command } from './types';

export const cat: Command = (args, state) => {
  if (args.length === 0) return { output: ['cat: falta el archivo. Uso: cat ARCHIVO'], state };
  const output: string[] = [];
  let next = state;
  for (const arg of args) {
    const path = resolvePath(state.vfs.cwd, arg);
    if (isDir(state.vfs, path)) {
      output.push(`cat: ${arg}: Es un directorio`);
      continue;
    }
    const content = readFile(state.vfs, path);
    if (content === null) {
      output.push(`cat: ${arg}: No existe el archivo o el directorio`);
      continue;
    }
    output.push(...content.replace(/\n$/, '').split('\n'));
    if (!next.readFiles.includes(path)) next = { ...next, readFiles: [...next.readFiles, path] };
  }
  return { output, state: next };
};
