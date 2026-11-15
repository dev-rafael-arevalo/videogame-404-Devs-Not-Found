import { describe, expect, it } from 'vitest';
import { noteToFrequency, parseTrack, trackLength } from './notation';

describe('noteToFrequency', () => {
  it('CA1: A4 = 440 Hz y las octavas duplican', () => {
    expect(noteToFrequency('A4')).toBeCloseTo(440, 5);
    expect(noteToFrequency('A5')).toBeCloseTo(880, 5);
    expect(noteToFrequency('A3')).toBeCloseTo(220, 5);
  });

  it('acepta sostenidos y bemoles', () => {
    expect(noteToFrequency('A#4')).toBeCloseTo(466.16, 1);
    expect(noteToFrequency('Bb4')).toBeCloseTo(466.16, 1);
    expect(noteToFrequency('C4')).toBeCloseTo(261.63, 1);
  });

  it('rechaza notas inválidas', () => {
    expect(() => noteToFrequency('H4')).toThrow();
    expect(() => noteToFrequency('C')).toThrow();
  });
});

describe('parseTrack', () => {
  it('CA1: convierte tokens en eventos con paso y duración', () => {
    expect(parseTrack('C4:4 -:2 E4:2')).toEqual([
      { step: 0, steps: 4, note: 'C4', drum: null },
      { step: 6, steps: 2, note: 'E4', drum: null },
    ]);
  });

  it('entiende los tambores del canal de ruido', () => {
    expect(parseTrack('K:4 H:4 S:8')).toEqual([
      { step: 0, steps: 4, note: null, drum: 'K' },
      { step: 4, steps: 4, note: null, drum: 'H' },
      { step: 8, steps: 8, note: null, drum: 'S' },
    ]);
  });

  it('ignora espacios y saltos de línea de más', () => {
    expect(parseTrack('  C4:1\n  D4:1 ')).toHaveLength(2);
  });

  it('rechaza tokens inválidos', () => {
    expect(() => parseTrack('C4')).toThrow();
    expect(() => parseTrack('C4:0')).toThrow();
    expect(() => parseTrack('X4:2')).toThrow();
    expect(() => parseTrack('C4:dos')).toThrow();
  });
});

describe('trackLength', () => {
  it('suma las duraciones, silencios incluidos', () => {
    expect(trackLength('C4:4 -:4 E4:8')).toBe(16);
    expect(trackLength('')).toBe(0);
  });
});
