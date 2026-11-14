import { readFile, resolvePath } from '../vfs';
import type { Command } from './types';

interface Requirement {
  name: string;
  version: string;
}

function parseRequirement(line: string): Requirement | null {
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.startsWith('#')) return null;
  const [name, version] = trimmed.split('==');
  return { name: name!.trim(), version: (version ?? '1.0').trim() };
}

/** `pip` guionado: no descarga nada; registra paquetes "instalados" en el estado. */
export const pip: Command = (args, state) => {
  const [sub, ...rest] = args;
  if (sub === 'list') {
    if (state.installed.length === 0) return { output: ['Package  Version', '-------  -------'], state };
    return { output: ['Package      Version', '-----------  -------', ...state.installed.map((p) => `${p.padEnd(11)}  1.0`)], state };
  }
  if (sub !== 'install') return { output: ['pip: uso: pip install -r requirements.txt | pip install PAQUETE | pip list'], state };
  if (!state.venvActive) {
    return {
      output: ['error: externally-managed-environment', 'pip: estás fuera de un entorno virtual. Activalo primero: source .venv/bin/activate'],
      state,
    };
  }
  let packages: Requirement[] = [];
  if (rest[0] === '-r') {
    const file = rest[1];
    if (!file) return { output: ['pip: falta el archivo después de -r'], state };
    const content = readFile(state.vfs, resolvePath(state.vfs.cwd, file));
    if (content === null) return { output: [`ERROR: Could not open requirements file: [Errno 2] No such file or directory: '${file}'`], state };
    packages = content.split('\n').map(parseRequirement).filter((p): p is Requirement => p !== null);
  } else if (rest.length > 0) {
    packages = rest.map((name) => ({ name, version: '1.0' }));
  } else {
    return { output: ['ERROR: You must give at least one requirement to install'], state };
  }
  const output = packages.flatMap((p) => [`Collecting ${p.name}`, `  Downloading ${p.name}-${p.version}-py3-none-any.whl`]);
  output.push(`Successfully installed ${packages.map((p) => p.name).join(' ')}`);
  const installed = [...new Set([...state.installed, ...packages.map((p) => p.name)])];
  return { output, state: { ...state, installed } };
};
