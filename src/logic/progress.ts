/** Progreso de la partida (spec 004): tickets completados, conciencias y rollbacks. Sin Phaser. */

export interface ProgressState {
  completados: string[];
  conciencias: number;
  /** Rollbacks por ticket. */
  fallos: Record<string, number>;
}

/** Penalidades sobre la recompensa del ticket (rollback y pista de PATO) y su piso. */
export const ROLLBACK_PENALTY = 0.25;
export const HINT_PENALTY = 0.1;
export const MIN_REWARD_FRACTION = 0.25;

export function initialProgress(): ProgressState {
  return { completados: [], conciencias: 0, fallos: {} };
}

export function uptimePercent(state: ProgressState, totalTickets: number): number {
  if (totalTickets <= 0) return 0;
  return Math.round((state.completados.length / totalTickets) * 100);
}

export function rewardFor(base: number, failures: number, hints = 0): number {
  const factor = Math.max(MIN_REWARD_FRACTION, 1 - ROLLBACK_PENALTY * failures - HINT_PENALTY * hints);
  return Math.round(base * factor);
}

export function completeTicket(
  state: ProgressState,
  ticketId: string,
  baseReward: number,
  hints = 0,
): { state: ProgressState; ganadas: number } {
  if (state.completados.includes(ticketId)) return { state, ganadas: 0 };
  const ganadas = rewardFor(baseReward, state.fallos[ticketId] ?? 0, hints);
  return {
    state: { ...state, completados: [...state.completados, ticketId], conciencias: state.conciencias + ganadas },
    ganadas,
  };
}

export function failTicket(state: ProgressState, ticketId: string): ProgressState {
  return { ...state, fallos: { ...state.fallos, [ticketId]: (state.fallos[ticketId] ?? 0) + 1 } };
}
