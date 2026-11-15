/** Opciones de juego (spec 011). Las de audio viven en `audio/options.ts`. Puro. */

import type { ScaleMode } from './scale';

export interface GameOptions {
  /** Modo sin presión: los plazos no corren (constitución, principio 8). */
  sinPresion: boolean;
  /** `entero`: pixel-perfect (constitución, principio 6). `ajustar`: llena la ventana. */
  escalado: ScaleMode;
}

export const DEFAULT_GAME_OPTIONS: GameOptions = { sinPresion: false, escalado: 'entero' };
export const GAME_OPTIONS_KEY = 'devs-not-found.opciones';

export function parseGameOptions(json: string | null): GameOptions {
  if (!json) return { ...DEFAULT_GAME_OPTIONS };
  try {
    const raw: unknown = JSON.parse(json);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...DEFAULT_GAME_OPTIONS };
    const r = raw as Record<string, unknown>;
    return {
      sinPresion: typeof r['sinPresion'] === 'boolean' ? r['sinPresion'] : DEFAULT_GAME_OPTIONS.sinPresion,
      escalado: r['escalado'] === 'ajustar' || r['escalado'] === 'entero' ? r['escalado'] : DEFAULT_GAME_OPTIONS.escalado,
    };
  } catch {
    return { ...DEFAULT_GAME_OPTIONS };
  }
}

export function serializeGameOptions(options: GameOptions): string {
  return JSON.stringify({ sinPresion: options.sinPresion, escalado: options.escalado });
}
