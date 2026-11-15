import type { ProgressState } from './progress';

/** Final del juego (spec 011): depende de cuántas conciencias se rescataron sobre el máximo posible. */

export type Ending = 'completo' | 'parcial' | 'pendiente';

export function maxConciencias(tickets: readonly { conciencias: number }[]): number {
  return tickets.reduce((total, t) => total + t.conciencias, 0);
}

/** 0–100. Rollbacks y pistas restan recompensa, así que bajan el porcentaje. */
export function rescuePercent(progress: ProgressState, tickets: readonly { conciencias: number }[]): number {
  const max = maxConciencias(tickets);
  if (max <= 0) return 0;
  return Math.min(100, Math.round((progress.conciencias / max) * 100));
}

export function endingFor(percent: number): Ending {
  if (percent >= 90) return 'completo';
  if (percent >= 60) return 'parcial';
  return 'pendiente';
}
