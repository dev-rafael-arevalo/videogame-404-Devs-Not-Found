import { describe, expect, it } from 'vitest';
import { WARNING_FRACTION, barColor, createDeadline, fraction, remainingSeconds, status, tick } from './deadline';

describe('deadline', () => {
  it('arranca completo y en estado ok', () => {
    const d = createDeadline(90);
    expect(d.totalMs).toBe(90_000);
    expect(fraction(d)).toBe(1);
    expect(status(d)).toBe('ok');
    expect(remainingSeconds(d)).toBe(90);
  });

  it('avanza con el delta y redondea los segundos hacia arriba', () => {
    const d = tick(createDeadline(90), 1500);
    expect(d.remainingMs).toBe(88_500);
    expect(remainingSeconds(d)).toBe(89);
  });

  it('CA1: pasa de ok a warning al 20% y a expired al llegar a cero', () => {
    const d = createDeadline(100);
    expect(status(tick(d, 79_000))).toBe('ok');
    expect(status(tick(d, 80_000))).toBe('warning');
    expect(status(tick(d, 99_999))).toBe('warning');
    expect(status(tick(d, 100_000))).toBe('expired');
    expect(WARNING_FRACTION).toBe(0.2);
  });

  it('no baja de cero', () => {
    expect(tick(createDeadline(10), 999_999).remainingMs).toBe(0);
  });

  it('en modo sin presión no corre y nunca vence', () => {
    const d = tick(createDeadline(10, false), 999_999);
    expect(d.remainingMs).toBe(10_000);
    expect(status(d)).toBe('ok');
    expect(fraction(d)).toBe(1);
  });

  it('el color de la barra depende de la fracción restante', () => {
    expect(barColor(1)).toBe('green');
    expect(barColor(0.51)).toBe('green');
    expect(barColor(0.5)).toBe('yellow');
    expect(barColor(0.21)).toBe('yellow');
    expect(barColor(0.2)).toBe('red');
    expect(barColor(0)).toBe('red');
  });
});
