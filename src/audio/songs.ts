import { trackLength } from './notation';

/** Canciones del juego (spec 014): JSON en `src/data/musica/`, validadas al cargar. */

export const CHANNELS = ['pulso1', 'pulso2', 'triangulo', 'ruido'] as const;
export type Channel = (typeof CHANNELS)[number];
export type Tracks = Record<Channel, string>;

export interface SongDef {
  id: string;
  nombre?: string;
  bpm: number;
  loop: boolean;
  canales?: Partial<Tracks>;
  /** Reutiliza los canales de otra canción (M07 = M06 más rápido). */
  igualQue?: string;
}

export interface Song {
  id: string;
  bpm: number;
  loop: boolean;
  canales: Tracks;
  /** Largo en semicorcheas. */
  length: number;
}

function isSongDef(raw: unknown): raw is SongDef {
  if (!raw || typeof raw !== 'object') return false;
  const r = raw as Record<string, unknown>;
  return typeof r['id'] === 'string' && typeof r['bpm'] === 'number' && (r['canales'] !== undefined || r['igualQue'] !== undefined);
}

/** Errores de una canción ya resuelta (sin `igualQue`). Vacío si es válida. */
export function validateSong(def: SongDef): string[] {
  const errors: string[] = [];
  if (!Number.isFinite(def.bpm) || def.bpm < 40 || def.bpm > 240) errors.push('bpm');
  if (typeof def.loop !== 'boolean') errors.push('loop');
  const canales = def.canales ?? {};
  const lengths = CHANNELS.map((ch) => {
    const text = canales[ch];
    if (typeof text !== 'string') {
      errors.push(ch);
      return -1;
    }
    try {
      return trackLength(text);
    } catch (error) {
      errors.push(`${ch}: ${(error as Error).message}`);
      return -1;
    }
  });
  const valid = lengths.filter((l) => l >= 0);
  if (valid.length === CHANNELS.length && new Set(valid).size !== 1) errors.push(`largos distintos (${lengths.join('/')})`);
  if (valid[0] === 0) errors.push('vacía');
  return errors;
}

/** Resuelve `igualQue` y valida. Puro: se testea con Vitest. */
export function resolveSongs(defs: readonly SongDef[]): Record<string, Song> {
  const byId = new Map(defs.map((d) => [d.id, d]));
  const songs: Record<string, Song> = {};
  for (const def of defs) {
    let canales = def.canales;
    if (def.igualQue !== undefined) {
      const base = byId.get(def.igualQue);
      if (!base?.canales) throw new Error(`Canción ${def.id}: igualQue apunta a ${def.igualQue}, que no existe`);
      canales = base.canales;
    }
    const resolved: SongDef = { ...def, canales };
    const errors = validateSong(resolved);
    if (errors.length > 0) throw new Error(`Canción inválida ${def.id}: ${errors.join(', ')}`);
    const tracks = canales as Tracks;
    songs[def.id] = { id: def.id, bpm: def.bpm, loop: def.loop, canales: tracks, length: trackLength(tracks.pulso1) };
  }
  return songs;
}

const modules = import.meta.glob('../data/musica/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

export const SONGS: Readonly<Record<string, Song>> = resolveSongs(Object.values(modules).filter(isSongDef));

export function getSong(id: string): Song {
  const song = SONGS[id];
  if (!song) throw new Error(`No existe la canción ${id}`);
  return song;
}
