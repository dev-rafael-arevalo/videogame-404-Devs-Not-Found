import { describe, expect, it } from 'vitest';
import { HOME, createVfs, exists, isDir, listDir, mkdir, readFile, resolvePath, shortPath, writeFile } from './vfs';

const vfs = createVfs({ '/home/dev/LEEME.txt': 'hola', '/home/dev/puente/puente.py': 'print()', '/home/dev/logs/marga.log': 'log' }, HOME);

describe('resolvePath', () => {
  it('CA1: resuelve relativas, .., . y ~', () => {
    expect(resolvePath('/home/dev', 'puente')).toBe('/home/dev/puente');
    expect(resolvePath('/home/dev/puente', '..')).toBe('/home/dev');
    expect(resolvePath('/home/dev/puente', '../logs/./marga.log')).toBe('/home/dev/logs/marga.log');
    expect(resolvePath('/home/dev/puente', '~')).toBe('/home/dev');
    expect(resolvePath('/home/dev/puente', '~/logs')).toBe('/home/dev/logs');
    expect(resolvePath('/home/dev', '/')).toBe('/');
    expect(resolvePath('/', '..')).toBe('/');
  });

  it('shortPath muestra ~ para el home', () => {
    expect(shortPath('/home/dev')).toBe('~');
    expect(shortPath('/home/dev/puente')).toBe('~/puente');
    expect(shortPath('/etc')).toBe('/etc');
  });
});

describe('vfs', () => {
  it('deriva los directorios de los archivos', () => {
    expect(isDir(vfs, '/home')).toBe(true);
    expect(isDir(vfs, '/home/dev/puente')).toBe(true);
    expect(isDir(vfs, '/home/dev/puente/puente.py')).toBe(false);
    expect(exists(vfs, '/home/dev/nada')).toBe(false);
  });

  it('CA1: ls lista directorios con / primero y después archivos, ordenados', () => {
    expect(listDir(vfs, '/home/dev')).toEqual(['logs/', 'puente/', 'LEEME.txt']);
    expect(listDir(vfs, '/home/dev/nada')).toBeNull();
    expect(listDir(vfs, '/home/dev/LEEME.txt')).toBeNull();
  });

  it('lee archivos', () => {
    expect(readFile(vfs, '/home/dev/LEEME.txt')).toBe('hola');
    expect(readFile(vfs, '/home/dev/puente')).toBeNull();
  });

  it('mkdir y writeFile son inmutables', () => {
    const withVenv = mkdir(vfs, '/home/dev/puente/.venv/bin');
    const withActivate = writeFile(withVenv, '/home/dev/puente/.venv/bin/activate', '# activate');
    expect(isDir(withActivate, '/home/dev/puente/.venv')).toBe(true);
    expect(readFile(withActivate, '/home/dev/puente/.venv/bin/activate')).toBe('# activate');
    expect(exists(vfs, '/home/dev/puente/.venv')).toBe(false);
  });
});
