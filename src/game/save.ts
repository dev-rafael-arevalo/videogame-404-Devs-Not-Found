import type { ProgressState } from '../logic/progress';
import { SAVE_KEY, parseSave, toSave, type LoadedSave } from '../logic/save';

/** Acceso a localStorage para el guardado (spec 007). Nunca lanza: sin almacenamiento, no hay guardado. */

export function loadSave(): LoadedSave | null {
  try {
    const parsed = parseSave(localStorage.getItem(SAVE_KEY));
    if (!parsed && localStorage.getItem(SAVE_KEY) !== null) {
      console.warn('Guardado inválido o de otra versión: se descarta.');
      localStorage.removeItem(SAVE_KEY);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSave(progress: ProgressState, acto: number): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave(progress, acto)));
  } catch {
    // Modo privado o cuota llena: la partida sigue, solo no se guarda.
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ídem
  }
}
