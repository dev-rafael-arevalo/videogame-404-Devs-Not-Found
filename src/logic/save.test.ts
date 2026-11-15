import { describe, expect, it } from 'vitest';
import { initialProgress } from './progress';
import { SAVE_VERSION, parseSave, toSave } from './save';

describe('guardado', () => {
  it('CA1: ida y vuelta sin pérdida', () => {
    const progress = { completados: ['a1-01-cables'], conciencias: 900, fallos: { 'a1-01-cables': 1 } };
    const save = toSave(progress, 1);
    expect(save.version).toBe(SAVE_VERSION);
    expect(parseSave(JSON.stringify(save))).toEqual({ acto: 1, progress });
  });

  it('CA1: rechaza JSON roto, otra versión o formas inválidas', () => {
    expect(parseSave(null)).toBeNull();
    expect(parseSave('{')).toBeNull();
    expect(parseSave(JSON.stringify({ ...toSave(initialProgress(), 1), version: 99 }))).toBeNull();
    expect(parseSave(JSON.stringify({ version: SAVE_VERSION, acto: 1, completados: 'no', conciencias: 0, fallos: {} }))).toBeNull();
    expect(parseSave(JSON.stringify({ version: SAVE_VERSION, acto: 1, completados: [], conciencias: -5, fallos: {} }))).toBeNull();
    expect(parseSave('[]')).toBeNull();
  });

  it('ignora fallos que no sean enteros positivos', () => {
    const parsed = parseSave(JSON.stringify({ version: SAVE_VERSION, acto: 1, completados: [], conciencias: 0, fallos: { a: 2, b: 'x', c: -1 } }));
    expect(parsed?.progress.fallos).toEqual({ a: 2 });
  });
});
