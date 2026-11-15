/** Opciones de volumen (spec 006). Puro: la lectura y escritura de localStorage queda en el manager. */

export interface AudioOptions {
  musica: number;
  sfx: number;
}

export const DEFAULT_AUDIO_OPTIONS: AudioOptions = { musica: 0.8, sfx: 1 };
export const AUDIO_OPTIONS_KEY = 'devs-not-found.audio';

function clamp01(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(1, Math.max(0, value));
}

/** Nunca rompe: cualquier cosa inválida vuelve a los valores por defecto (seguridad.md §5). */
export function parseAudioOptions(json: string | null): AudioOptions {
  if (!json) return { ...DEFAULT_AUDIO_OPTIONS };
  try {
    const raw: unknown = JSON.parse(json);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...DEFAULT_AUDIO_OPTIONS };
    const r = raw as Record<string, unknown>;
    return {
      musica: clamp01(r['musica'], DEFAULT_AUDIO_OPTIONS.musica),
      sfx: clamp01(r['sfx'], DEFAULT_AUDIO_OPTIONS.sfx),
    };
  } catch {
    return { ...DEFAULT_AUDIO_OPTIONS };
  }
}

export function serializeAudioOptions(options: AudioOptions): string {
  return JSON.stringify({ musica: options.musica, sfx: options.sfx });
}
