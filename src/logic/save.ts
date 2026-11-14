import type { ProgressState } from './progress';

/** Guardado de la partida (spec 007). Puro: la lectura y escritura de localStorage está en `game/save.ts`. */

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'devs-not-found.save';

export interface SaveData {
  version: number;
  acto: number;
  completados: string[];
  conciencias: number;
  fallos: Record<string, number>;
}

export interface LoadedSave {
  acto: number;
  progress: ProgressState;
}

export function toSave(progress: ProgressState, acto: number): SaveData {
  return {
    version: SAVE_VERSION,
    acto,
    completados: [...progress.completados],
    conciencias: progress.conciencias,
    fallos: { ...progress.fallos },
  };
}

/** `null` si el JSON está roto, es de otra versión o no tiene la forma esperada (nunca lanza). */
export function parseSave(json: string | null): LoadedSave | null {
  if (!json) return null;
  try {
    const raw: unknown = JSON.parse(json);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const r = raw as Record<string, unknown>;
    if (r['version'] !== SAVE_VERSION) return null;
    if (typeof r['acto'] !== 'number' || !Number.isInteger(r['acto']) || r['acto'] < 1) return null;
    if (!Array.isArray(r['completados']) || !r['completados'].every((id) => typeof id === 'string')) return null;
    if (typeof r['conciencias'] !== 'number' || !Number.isFinite(r['conciencias']) || r['conciencias'] < 0) return null;
    const fallos: Record<string, number> = {};
    if (r['fallos'] && typeof r['fallos'] === 'object' && !Array.isArray(r['fallos'])) {
      for (const [id, n] of Object.entries(r['fallos'] as Record<string, unknown>)) {
        if (typeof n === 'number' && Number.isInteger(n) && n > 0) fallos[id] = n;
      }
    }
    return {
      acto: r['acto'],
      progress: { completados: [...(r['completados'] as string[])], conciencias: r['conciencias'], fallos },
    };
  } catch {
    return null;
  }
}
