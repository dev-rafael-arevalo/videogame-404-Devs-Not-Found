import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import actos from './actos.json';
import { TICKETS, ticketOrder } from './tickets/index';

interface TiledObject {
  name: string;
  type: string;
}
interface TiledMap {
  layers: { name: string; type: string; objects?: TiledObject[] }[];
}

describe('datos de tickets', () => {
  it('cada ticket de actos.json existe y pertenece a ese acto', () => {
    for (const acto of actos.actos) {
      for (const id of acto.tickets) {
        expect(TICKETS[id], id).toBeDefined();
        expect(TICKETS[id]?.acto).toBe(acto.numero);
      }
    }
  });

  it('cada ticket figura en el orden de su acto', () => {
    for (const ticket of Object.values(TICKETS)) {
      expect(ticketOrder(ticket.acto)).toContain(ticket.id);
    }
  });

  it('los números de ticket no se repiten', () => {
    const numeros = Object.values(TICKETS).map((t) => t.numero);
    expect(new Set(numeros).size).toBe(numeros.length);
  });

  it('CA1 (008): la terminal de cada ticket existe en el mapa de su acto', () => {
    for (const acto of actos.actos) {
      const map = JSON.parse(readFileSync(`public/assets/maps/${acto.mapa}.json`, 'utf-8')) as TiledMap;
      const terminals = map.layers
        .find((l) => l.name === 'interactables')
        ?.objects?.filter((o) => o.type === 'terminal')
        .map((o) => o.name);
      for (const id of acto.tickets) {
        expect(terminals, `${acto.mapa} / ${id}`).toContain(TICKETS[id]?.terminal);
      }
    }
  });

  it('cada acto tiene mapa y música', () => {
    for (const acto of actos.actos) {
      expect(acto.mapa.length).toBeGreaterThan(0);
      expect(acto.musica.length).toBeGreaterThan(0);
    }
  });
});
