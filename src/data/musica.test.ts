import { describe, expect, it } from 'vitest';
import { CHANNELS, SONGS, resolveSongs, validateSong } from '../audio/songs';
import { trackLength } from '../audio/notation';
import sfx from './musica/sfx.json';

const REQUIRED = ['titulo', 'acto1_oficina', 'puzzle', 'puzzle_urgente', 'jingle_exito', 'jingle_rollback'];
const REQUIRED_SFX = [
  'boot_beep',
  'click_ui',
  'interactuar',
  'dialogo_letra',
  'paso',
  'ticket_nuevo',
  'cable_conectar',
  'cable_error',
  'puzzle_ok',
  'alarma_plazo',
  'pato_quack',
];

describe('canciones', () => {
  it('existen todas las pistas del slice vertical', () => {
    for (const id of REQUIRED) expect(SONGS[id], id).toBeDefined();
  });

  it('CA1: los cuatro canales de cada canción miden lo mismo', () => {
    for (const song of Object.values(SONGS)) {
      const lengths = CHANNELS.map((ch) => trackLength(song.canales[ch]));
      expect(new Set(lengths).size, song.id).toBe(1);
      expect(song.length).toBe(lengths[0]);
      expect(song.length % 16, `${song.id} termina en compás completo`).toBe(0);
    }
  });

  it('puzzle_urgente usa los canales de puzzle con otro tempo', () => {
    expect(SONGS['puzzle_urgente']!.canales).toEqual(SONGS['puzzle']!.canales);
    expect(SONGS['puzzle_urgente']!.bpm).toBeGreaterThan(SONGS['puzzle']!.bpm);
  });

  it('validateSong reporta largos distintos y canales faltantes', () => {
    expect(
      validateSong({ id: 'x', bpm: 100, loop: true, canales: { pulso1: 'C4:4', pulso2: 'C4:2', triangulo: 'C4:4', ruido: 'K:4' } }),
    ).toContain('largos distintos (4/2/4/4)');
    expect(validateSong({ id: 'x', bpm: 100, loop: true, canales: { pulso1: 'C4:4' } })).toContain('pulso2');
  });

  it('resolveSongs falla si igualQue apunta a una canción inexistente', () => {
    expect(() => resolveSongs([{ id: 'a', bpm: 100, loop: true, igualQue: 'nada' }])).toThrow();
  });
});

describe('efectos de sonido', () => {
  it('existen los efectos que usa el slice vertical y tienen parámetros válidos', () => {
    for (const name of REQUIRED_SFX) {
      const def = (sfx as Record<string, { onda: string; frecuencia: number[]; duracion: number; volumen: number }>)[name];
      expect(def, name).toBeDefined();
      expect(['square', 'triangle', 'sawtooth', 'sine', 'noise']).toContain(def!.onda);
      expect(def!.frecuencia).toHaveLength(2);
      expect(def!.duracion).toBeGreaterThan(0);
      expect(def!.duracion).toBeLessThanOrEqual(1);
      expect(def!.volumen).toBeGreaterThan(0);
      expect(def!.volumen).toBeLessThanOrEqual(1);
    }
  });
});
