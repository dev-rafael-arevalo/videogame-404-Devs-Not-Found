import { describe, expect, it } from 'vitest';
import { INTERACT_RANGE, pickInteractable } from './interaction';

const items = [
  { id: 'pato', x: 40, y: 40 },
  { id: 'postit', x: 100, y: 40 },
  { id: 'terminal', x: 40, y: 100 },
];

describe('pickInteractable', () => {
  it('devuelve el más cercano dentro del rango', () => {
    expect(pickInteractable({ x: 50, y: 42 }, items, 20)?.id).toBe('pato');
  });

  it('devuelve null si nada está en rango', () => {
    expect(pickInteractable({ x: 70, y: 70 }, items, 20)).toBeNull();
  });

  it('la distancia se mide en línea recta', () => {
    // (52, 56) está a 20 px de (40, 40) en diagonal: justo dentro del rango.
    expect(pickInteractable({ x: 52, y: 56 }, items, 20)?.id).toBe('pato');
    expect(pickInteractable({ x: 53, y: 57 }, items, 20)).toBeNull();
  });

  it('sin interactuables devuelve null', () => {
    expect(pickInteractable({ x: 0, y: 0 }, [], 20)).toBeNull();
  });

  it('el rango por defecto es de 20 px', () => {
    expect(INTERACT_RANGE).toBe(20);
  });
});
