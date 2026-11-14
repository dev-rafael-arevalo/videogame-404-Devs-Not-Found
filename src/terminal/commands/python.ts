import { exists, mkdir, readFile, resolvePath, writeFile } from '../vfs';
import type { Command } from './types';

const PYTHON_VERSION = 'Python 3.12.1';

/**
 * `python` guionado (seguridad.md §1): nunca ejecuta código. Mira el estado y devuelve salidas que
 * imitan a las reales. `puente.py` es la app de retorno del lore.
 */
export const python: Command = (args, state) => {
  const [first, ...rest] = args;
  if (!first || first === '--version' || first === '-V') return { output: [PYTHON_VERSION], state };

  if (first === '-m') {
    if (rest[0] !== 'venv') return { output: [`python: No module named ${rest[0] ?? ''}`], state };
    const name = rest[1] ?? '.venv';
    const path = resolvePath(state.vfs.cwd, name);
    let vfs = mkdir(state.vfs, path);
    vfs = mkdir(vfs, `${path}/bin`);
    vfs = writeFile(vfs, `${path}/bin/activate`, '# This file must be used with "source bin/activate"');
    vfs = writeFile(vfs, `${path}/pyvenv.cfg`, 'version = 3.12.1\n');
    return { output: [], state: { ...state, vfs, venvCreated: true } };
  }

  const path = resolvePath(state.vfs.cwd, first);
  const script = readFile(state.vfs, path);
  if (script === null) {
    return { output: [`python: can't open file '${path}': [Errno 2] No such file or directory`], state };
  }
  if (!path.endsWith('puente.py')) {
    return { output: [`${first}: script sin salida (nada que hacer)`], state };
  }
  if (!state.venvActive || !state.installed.includes('arca-bridge')) {
    return {
      output: [
        'Traceback (most recent call last):',
        `  File "${path}", line 1, in <module>`,
        '    import arca_bridge',
        "ModuleNotFoundError: No module named 'arca_bridge'",
      ],
      state,
    };
  }
  const configPath = resolvePath(state.vfs.cwd, 'config.ini');
  const config = readFile(state.vfs, configPath);
  if (rest[0] === '--check') {
    return {
      output: [
        'puente.py: comprobando entorno...',
        '  venv ............ OK',
        '  dependencias .... OK',
        `  config.ini ...... ${state.configFixed ? 'OK' : 'ERROR (MODO=backup, esperado: restore)'}`,
      ],
      state,
    };
  }
  if (rest[0] === '--fix-config') {
    if (config === null) return { output: ['puente.py: no encuentro config.ini en este directorio'], state };
    const vfs = writeFile(state.vfs, configPath, config.replace('MODO=backup', 'MODO=restore'));
    return { output: ['config.ini: MODO=backup -> MODO=restore', 'Listo. Proba: python puente.py --restore all'], state: { ...state, vfs, configFixed: true } };
  }
  if (rest[0] === '--restore') {
    if (!state.configFixed) {
      return {
        output: ['puente.py: ConfigError: MODO=backup (esperado: restore).', 'Corregi la configuracion: python puente.py --fix-config'],
        state,
      };
    }
    if (rest[1] !== 'all') return { output: ['puente.py: uso: python puente.py --restore all'], state };
    const output = [
      'SYS://RESTORE - puente.py v1.0',
      'Conectando con ARCA ............ OK',
      'Sectores estables: 7/7',
      'Restaurando conciencias  25%  [#####               ]',
      'Restaurando conciencias  50%  [##########          ]',
      'Restaurando conciencias  75%  [###############     ]',
      'Restaurando conciencias 100%  [####################]',
    ];
    return { output, state: { ...state, ran: [...state.ran, 'puente.py'] } };
  }
  if (!exists(state.vfs, configPath)) return { output: ['puente.py: no encuentro config.ini en este directorio'], state };
  return { output: ['puente.py: uso: python puente.py --check | --fix-config | --restore all'], state };
};
