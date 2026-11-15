import { describe, expect, it } from 'vitest';
import { EMPTY_HISTORY, MAX_HISTORY, complete, navigate, push } from './history';
import { HOME } from './vfs';
import { createTerminalState } from './state';

const state = createTerminalState({
  cwdInicial: HOME,
  archivos: { '/home/dev/LEEME.txt': '', '/home/dev/logs/marga.log': '', '/home/dev/logs/cron.log': '', '/home/dev/puente/puente.py': '' },
  objetivo: {},
  comandosPermitidos: ['ls', 'cd', 'cat', 'clear', 'help'],
});

describe('historial', () => {
  it('CA1: guarda hasta 100 entradas y descarta las más viejas', () => {
    let h = EMPTY_HISTORY;
    for (let i = 0; i < 150; i += 1) h = push(h, `cmd${i}`);
    expect(h.entries).toHaveLength(MAX_HISTORY);
    expect(h.entries[0]).toBe('cmd50');
  });

  it('no repite la última entrada ni guarda vacías', () => {
    let h = push(EMPTY_HISTORY, 'ls');
    h = push(h, 'ls');
    h = push(h, '   ');
    expect(h.entries).toEqual(['ls']);
  });

  it('CA1: ↑ recupera las anteriores y ↓ vuelve a la línea en curso', () => {
    let h = push(push(EMPTY_HISTORY, 'ls'), 'cd logs');
    let nav = navigate(h, 'cat x', 'up');
    expect(nav.line).toBe('cd logs');
    nav = navigate(nav.history, nav.line, 'up');
    expect(nav.line).toBe('ls');
    nav = navigate(nav.history, nav.line, 'up');
    expect(nav.line).toBe('ls');
    nav = navigate(nav.history, nav.line, 'down');
    expect(nav.line).toBe('cd logs');
    nav = navigate(nav.history, nav.line, 'down');
    expect(nav.line).toBe('cat x');
    h = push(nav.history, 'pwd');
    expect(h.cursor).toBeNull();
  });
});

describe('autocompletado', () => {
  it('CA1: completa un comando único con espacio final', () => {
    expect(complete('ca', state, ['ls', 'cd', 'cat'])).toEqual({ line: 'cat ', options: [] });
  });

  it('con varios comandos devuelve las opciones y el prefijo común', () => {
    expect(complete('c', state, ['ls', 'cd', 'cat', 'clear'])).toEqual({ line: 'c', options: ['cat', 'cd', 'clear'] });
  });

  it('CA1: completa rutas relativas al cwd y dentro de subdirectorios', () => {
    expect(complete('cat LE', state, ['cat'])).toEqual({ line: 'cat LEEME.txt', options: [] });
    expect(complete('cd lo', state, ['cd'])).toEqual({ line: 'cd logs/', options: [] });
    expect(complete('cat logs/m', state, ['cat'])).toEqual({ line: 'cat logs/marga.log', options: [] });
    expect(complete('cat logs/', state, ['cat']).options).toEqual(['cron.log', 'marga.log']);
  });

  it('sin candidatos no cambia la línea', () => {
    expect(complete('cat zzz', state, ['cat'])).toEqual({ line: 'cat zzz', options: [] });
  });
});
