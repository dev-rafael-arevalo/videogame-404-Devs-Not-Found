import { describe, expect, it } from 'vitest';
import { completeTicket, failTicket, initialProgress, rewardFor, uptimePercent } from './progress';

describe('progress', () => {
  it('arranca en cero', () => {
    const p = initialProgress();
    expect(p.completados).toEqual([]);
    expect(p.conciencias).toBe(0);
    expect(uptimePercent(p, 4)).toBe(0);
  });

  it('completar un ticket suma conciencias y uptime', () => {
    const { state, ganadas } = completeTicket(initialProgress(), 'a1-01', 1200);
    expect(ganadas).toBe(1200);
    expect(state.conciencias).toBe(1200);
    expect(state.completados).toEqual(['a1-01']);
    expect(uptimePercent(state, 2)).toBe(50);
  });

  it('completar dos veces el mismo ticket no duplica', () => {
    const once = completeTicket(initialProgress(), 'a1-01', 1200).state;
    const twice = completeTicket(once, 'a1-01', 1200);
    expect(twice.ganadas).toBe(0);
    expect(twice.state).toEqual(once);
  });

  it('CA1: cada rollback resta 25% con un piso del 25%', () => {
    expect(rewardFor(1200, 0)).toBe(1200);
    expect(rewardFor(1200, 1)).toBe(900);
    expect(rewardFor(1200, 2)).toBe(600);
    expect(rewardFor(1200, 3)).toBe(300);
    expect(rewardFor(1200, 4)).toBe(300);
    expect(rewardFor(1200, 9)).toBe(300);
  });

  it('fallar registra el rollback y la recompensa posterior baja', () => {
    const failed = failTicket(initialProgress(), 'a1-01');
    expect(failed.fallos['a1-01']).toBe(1);
    const { ganadas } = completeTicket(failed, 'a1-01', 1200);
    expect(ganadas).toBe(900);
  });

  it('el uptime se redondea y no divide por cero', () => {
    const p = completeTicket(initialProgress(), 'x', 1).state;
    expect(uptimePercent(p, 3)).toBe(33);
    expect(uptimePercent(p, 0)).toBe(0);
  });
});
