/** Plazo de un ticket (spec 004). Inmutable y sin Phaser. */

export interface Deadline {
  totalMs: number;
  remainingMs: number;
  /** `false` en modo sin presión: el plazo no corre. */
  enabled: boolean;
}

export type DeadlineStatus = 'ok' | 'warning' | 'expired';
export type BarColor = 'green' | 'yellow' | 'red';

/** Por debajo de esta fracción restante, El Recolector acecha (alarma y música rápida). */
export const WARNING_FRACTION = 0.2;

export function createDeadline(totalSeconds: number, enabled = true): Deadline {
  const totalMs = Math.max(0, Math.round(totalSeconds * 1000));
  return { totalMs, remainingMs: totalMs, enabled };
}

export function tick(deadline: Deadline, deltaMs: number): Deadline {
  if (!deadline.enabled) return deadline;
  return { ...deadline, remainingMs: Math.max(0, deadline.remainingMs - deltaMs) };
}

/** Fracción restante entre 0 y 1 (1 si el plazo está desactivado). */
export function fraction(deadline: Deadline): number {
  if (!deadline.enabled || deadline.totalMs === 0) return 1;
  return deadline.remainingMs / deadline.totalMs;
}

export function status(deadline: Deadline): DeadlineStatus {
  if (!deadline.enabled) return 'ok';
  if (deadline.remainingMs <= 0) return 'expired';
  return fraction(deadline) <= WARNING_FRACTION ? 'warning' : 'ok';
}

export function remainingSeconds(deadline: Deadline): number {
  return Math.ceil(deadline.remainingMs / 1000);
}

/** Verde por encima del 50%, amarillo hasta el 20%, rojo por debajo (constitución, principio 8). */
export function barColor(fractionLeft: number): BarColor {
  if (fractionLeft > 0.5) return 'green';
  if (fractionLeft > WARNING_FRACTION) return 'yellow';
  return 'red';
}
