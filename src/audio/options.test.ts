import { describe, expect, it } from 'vitest';
import { DEFAULT_AUDIO_OPTIONS, parseAudioOptions, serializeAudioOptions } from './options';

describe('parseAudioOptions', () => {
  it('CA1: devuelve los valores por defecto con JSON roto, nulo o de otra forma', () => {
    expect(parseAudioOptions(null)).toEqual(DEFAULT_AUDIO_OPTIONS);
    expect(parseAudioOptions('{no es json')).toEqual(DEFAULT_AUDIO_OPTIONS);
    expect(parseAudioOptions('[1,2]')).toEqual(DEFAULT_AUDIO_OPTIONS);
  });

  it('lee valores válidos y recorta los fuera de rango', () => {
    expect(parseAudioOptions('{"musica":0.5,"sfx":0.25}')).toEqual({ musica: 0.5, sfx: 0.25 });
    expect(parseAudioOptions('{"musica":7,"sfx":-1}')).toEqual({ musica: 1, sfx: 0 });
    expect(parseAudioOptions('{"musica":"alto"}')).toEqual(DEFAULT_AUDIO_OPTIONS);
  });

  it('serializa y vuelve a leer sin pérdida', () => {
    const options = { musica: 0.3, sfx: 0.9 };
    expect(parseAudioOptions(serializeAudioOptions(options))).toEqual(options);
  });
});
