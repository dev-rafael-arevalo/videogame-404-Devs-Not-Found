import { describe, expect, it } from 'vitest';
import { DEFAULT_GAME_OPTIONS, parseGameOptions, serializeGameOptions } from './gameOptions';

describe('opciones del juego', () => {
  it('CA1: valores por defecto con JSON roto o ausente', () => {
    expect(parseGameOptions(null)).toEqual(DEFAULT_GAME_OPTIONS);
    expect(parseGameOptions('{')).toEqual(DEFAULT_GAME_OPTIONS);
    expect(parseGameOptions('"texto"')).toEqual(DEFAULT_GAME_OPTIONS);
    expect(parseGameOptions('{"sinPresion":"si"}')).toEqual(DEFAULT_GAME_OPTIONS);
  });

  it('lee y serializa sin pérdida', () => {
    expect(parseGameOptions('{"sinPresion":true}')).toEqual({ sinPresion: true, escalado: 'entero' });
    expect(parseGameOptions('{"escalado":"ajustar"}')).toEqual({ sinPresion: false, escalado: 'ajustar' });
    expect(parseGameOptions('{"escalado":"gigante"}').escalado).toBe('entero');
    expect(parseGameOptions(serializeGameOptions({ sinPresion: true, escalado: 'ajustar' }))).toEqual({ sinPresion: true, escalado: 'ajustar' });
  });
});
