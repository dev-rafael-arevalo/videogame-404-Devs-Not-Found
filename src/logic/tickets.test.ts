import { describe, expect, it } from 'vitest';
import { formatTicketNumber, nextTicket, validateTicket } from './tickets';

const valid = {
  id: 'a1-01-cables',
  numero: 7,
  acto: 1,
  terminal: 'terminal_15_4',
  titulo: 'Reconectar el switch',
  descripcion: 'Conecta cada puerto con su par.',
  tipo: 'cables',
  plazoSegundos: 90,
  conciencias: 1200,
  pistas: ['Los colores no mienten.'],
  datos: { izquierda: ['rojo'], derecha: ['rojo'] },
};

describe('nextTicket', () => {
  it('devuelve el primero sin completar, en orden', () => {
    expect(nextTicket(['a', 'b', 'c'], [])).toBe('a');
    expect(nextTicket(['a', 'b', 'c'], ['a'])).toBe('b');
    expect(nextTicket(['a', 'b', 'c'], ['b', 'a'])).toBe('c');
  });

  it('CA1: devuelve null cuando todos están completos', () => {
    expect(nextTicket(['a', 'b'], ['a', 'b'])).toBeNull();
    expect(nextTicket([], [])).toBeNull();
  });
});

describe('formatTicketNumber', () => {
  it('rellena con ceros a 4 dígitos', () => {
    expect(formatTicketNumber(7)).toBe('#0007');
    expect(formatTicketNumber(31)).toBe('#0031');
    expect(formatTicketNumber(12345)).toBe('#12345');
  });
});

describe('validateTicket', () => {
  it('acepta un ticket completo', () => {
    expect(validateTicket(valid)).toEqual([]);
  });

  it('reporta cada campo que falta o tiene el tipo equivocado', () => {
    const errors = validateTicket({ ...valid, plazoSegundos: '90', pistas: 'no', numero: undefined });
    expect(errors).toContain('plazoSegundos');
    expect(errors).toContain('pistas');
    expect(errors).toContain('numero');
    expect(errors).not.toContain('titulo');
  });

  it('rechaza lo que no es un objeto', () => {
    expect(validateTicket(null)).toEqual(['ticket']);
  });
});
