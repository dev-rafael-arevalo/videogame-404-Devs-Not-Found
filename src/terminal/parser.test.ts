import { describe, expect, it } from 'vitest';
import { MAX_LINE_LENGTH, parseLine } from './parser';

describe('parseLine', () => {
  it('CA1: separa comando y argumentos', () => {
    expect(parseLine('ls -la puente')).toEqual({ command: 'ls', args: ['-la', 'puente'] });
  });

  it('respeta comillas simples y dobles', () => {
    expect(parseLine('echo "hola mundo" \'otro arg\' x')).toEqual({ command: 'echo', args: ['hola mundo', 'otro arg', 'x'] });
  });

  it('ignora espacios de más y devuelve null si está vacía', () => {
    expect(parseLine('   ')).toBeNull();
    expect(parseLine('')).toBeNull();
    expect(parseLine('  pwd   ')).toEqual({ command: 'pwd', args: [] });
  });

  it('una comilla sin cerrar se toma hasta el final', () => {
    expect(parseLine('cat "sin cerrar')).toEqual({ command: 'cat', args: ['sin cerrar'] });
  });

  it('la línea se recorta a 256 caracteres', () => {
    const long = `echo ${'a'.repeat(400)}`;
    const parsed = parseLine(long)!;
    expect(parsed.args[0]!.length).toBe(MAX_LINE_LENGTH - 5);
  });
});
