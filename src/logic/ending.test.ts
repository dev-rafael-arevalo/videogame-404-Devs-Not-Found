import { describe, expect, it } from 'vitest';
import { endingFor, maxConciencias, rescuePercent } from './ending';
import { initialProgress } from './progress';

const tickets = [
  { id: 'a', conciencias: 1000 },
  { id: 'b', conciencias: 2000 },
  { id: 'c', conciencias: 1000 },
];

describe('rescuePercent', () => {
  it('suma el máximo posible', () => {
    expect(maxConciencias(tickets)).toBe(4000);
  });

  it('CA1: sin penalidades da 100; con rollbacks y pistas baja', () => {
    expect(rescuePercent({ ...initialProgress(), conciencias: 4000 }, tickets)).toBe(100);
    expect(rescuePercent({ ...initialProgress(), conciencias: 3000 }, tickets)).toBe(75);
    expect(rescuePercent(initialProgress(), tickets)).toBe(0);
    expect(rescuePercent({ ...initialProgress(), conciencias: 99999 }, tickets)).toBe(100);
    expect(rescuePercent(initialProgress(), [])).toBe(0);
  });
});

describe('endingFor', () => {
  it('CA1: tres finales según el porcentaje', () => {
    expect(endingFor(100)).toBe('completo');
    expect(endingFor(90)).toBe('completo');
    expect(endingFor(89)).toBe('parcial');
    expect(endingFor(60)).toBe('parcial');
    expect(endingFor(59)).toBe('pendiente');
    expect(endingFor(0)).toBe('pendiente');
  });
});
