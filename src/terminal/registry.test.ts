import { describe, expect, it } from 'vitest';
import { checkObjective } from './objective';
import { runLine } from './registry';
import { createTerminalState, type TerminalState } from './state';
import { HOME } from './vfs';

const ALL = ['help', 'ls', 'cd', 'pwd', 'cat', 'echo', 'clear', 'python', 'pip', 'source'];

function fresh(): TerminalState {
  return createTerminalState({
    cwdInicial: HOME,
    archivos: {
      '/home/dev/LEEME.txt': 'Bienvenida.',
      '/home/dev/logs/marga.log': 'puente.py nunca se desplegó',
      '/home/dev/puente/puente.py': '# app',
      '/home/dev/puente/requirements.txt': 'arca-bridge==1.0\nrich==13.0\n',
      '/home/dev/puente/config.ini': 'MODO=backup\n',
    },
    objetivo: {},
    comandosPermitidos: ALL,
  });
}

function run(state: TerminalState, ...lines: string[]): { state: TerminalState; output: string[] } {
  let output: string[] = [];
  for (const line of lines) {
    const r = runLine(state, line, ALL);
    state = r.state;
    output = r.output;
  }
  return { state, output };
}

describe('registry', () => {
  it('CA1: comando desconocido y comando no autorizado', () => {
    expect(runLine(fresh(), 'rm -rf /', ALL).output).toEqual(['comando no encontrado: rm']);
    expect(runLine(fresh(), 'cat LEEME.txt', ['ls']).output[0]).toContain('no está autorizado');
    expect(runLine(fresh(), '', ALL).output).toEqual([]);
  });

  it('ls, cd y pwd', () => {
    expect(run(fresh(), 'ls').output).toEqual(['logs/  puente/  LEEME.txt']);
    const { state, output } = run(fresh(), 'cd puente', 'pwd');
    expect(output).toEqual(['/home/dev/puente']);
    expect(state.vfs.cwd).toBe('/home/dev/puente');
    expect(run(fresh(), 'cd nada').output[0]).toContain('No existe');
    expect(run(fresh(), 'cd LEEME.txt').output[0]).toContain('No es un directorio');
    expect(run(fresh(), 'cd puente', 'cd', 'pwd').output).toEqual([HOME]);
    expect(run(fresh(), 'ls nada').output[0]).toContain('No existe');
  });

  it('cat muestra el archivo y lo registra como leído', () => {
    const { state, output } = run(fresh(), 'cat logs/marga.log');
    expect(output).toEqual(['puente.py nunca se desplegó']);
    expect(state.readFiles).toContain('/home/dev/logs/marga.log');
    expect(run(fresh(), 'cat logs').output[0]).toContain('Es un directorio');
    expect(run(fresh(), 'cat').output[0]).toContain('cat: falta el archivo');
  });

  it('echo, help y clear', () => {
    expect(run(fresh(), 'echo hola mundo').output).toEqual(['hola mundo']);
    expect(run(fresh(), 'help').output.length).toBeGreaterThan(3);
    expect(runLine(fresh(), 'clear', ALL).clear).toBe(true);
  });

  it('CA1: python sin venv ni dependencias falla como en la vida real', () => {
    expect(run(fresh(), 'python --version').output).toEqual(['Python 3.12.1']);
    expect(run(fresh(), 'cd puente', 'python puente.py').output.join('\n')).toContain("No module named 'arca_bridge'");
    expect(run(fresh(), 'python nada.py').output[0]).toContain("can't open file");
  });

  it('venv: crear, activar y pip install', () => {
    const r1 = run(fresh(), 'cd puente', 'python -m venv .venv');
    expect(r1.state.venvCreated).toBe(true);
    expect(run(r1.state, 'ls').output[0]).toContain('.venv/');
    expect(run(r1.state, 'pip install -r requirements.txt').output.join('\n')).toContain('entorno virtual');
    const r2 = run(r1.state, 'source .venv/bin/activate');
    expect(r2.state.venvActive).toBe(true);
    const r3 = run(r2.state, 'pip install -r requirements.txt');
    expect(r3.state.installed).toEqual(['arca-bridge', 'rich']);
    expect(r3.output.at(-1)).toContain('Successfully installed');
    expect(run(r3.state, 'pip list').output).toContain('arca-bridge  1.0');
    expect(run(fresh(), 'source nada').output[0]).toContain('No existe');
  });

  it('CA1: puente.py exige el venv, las dependencias y la configuración', () => {
    const ready = run(fresh(), 'cd puente', 'python -m venv .venv', 'source .venv/bin/activate', 'pip install -r requirements.txt').state;
    const withBadConfig = run(ready, 'python puente.py --restore all');
    expect(withBadConfig.output.join('\n')).toContain('MODO=backup');
    expect(withBadConfig.state.ran).toEqual([]);
    const fixed = run(ready, 'python puente.py --fix-config');
    expect(fixed.state.configFixed).toBe(true);
    const done = run(fixed.state, 'python puente.py --restore all');
    expect(done.output.at(-1)).toContain('100%');
    expect(done.state.ran).toContain('puente.py');
  });

  it('objetivo', () => {
    const s = run(fresh(), 'cd logs', 'cat marga.log').state;
    expect(checkObjective(s, { leido: '/home/dev/logs/marga.log' })).toBe(true);
    expect(checkObjective(s, { leido: '/home/dev/LEEME.txt' })).toBe(false);
    expect(checkObjective(s, { cwd: '/home/dev/logs' })).toBe(true);
    expect(checkObjective(s, { venvCreado: true })).toBe(false);
  });
});
