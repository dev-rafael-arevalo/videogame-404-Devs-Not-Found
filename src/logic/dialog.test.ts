import { describe, expect, it } from 'vitest';
import { confirm, paginate, visibleChars, wrapText, type DialogCursor } from './dialog';

describe('wrapText', () => {
  it('no corta palabras y respeta el máximo de caracteres', () => {
    const lines = wrapText('¿Ya probaste explicármelo en voz alta? Funciona más de lo que parece.', 20);
    expect(lines.every((l) => l.length <= 20)).toBe(true);
    expect(lines.join(' ')).toBe('¿Ya probaste explicármelo en voz alta? Funciona más de lo que parece.');
  });

  it('una palabra más larga que la línea se parte', () => {
    expect(wrapText('supercalifragilistico', 8)).toEqual(['supercal', 'ifragili', 'stico']);
  });

  it('respeta los saltos de línea explícitos', () => {
    expect(wrapText('uno\ndos tres', 10)).toEqual(['uno', 'dos tres']);
  });

  it('texto vacío da una línea vacía', () => {
    expect(wrapText('', 10)).toEqual(['']);
  });
});

describe('paginate', () => {
  it('agrupa de a N líneas y une con saltos de línea', () => {
    expect(paginate(['a', 'b', 'c', 'd', 'e'], 3)).toEqual(['a\nb\nc', 'd\ne']);
  });

  it('sin líneas devuelve una página vacía', () => {
    expect(paginate([], 3)).toEqual(['']);
  });
});

describe('visibleChars', () => {
  it('crece con el tiempo y se detiene en el total', () => {
    expect(visibleChars(0, 40, 100)).toBe(0);
    expect(visibleChars(500, 40, 100)).toBe(20);
    expect(visibleChars(10_000, 40, 100)).toBe(100);
  });
});

describe('confirm (cursor del diálogo)', () => {
  const pagesPerLine = [2, 1];
  const start: DialogCursor = { line: 0, page: 0, revealed: false, closed: false };

  it('primero revela la página', () => {
    expect(confirm(start, pagesPerLine)).toEqual({ line: 0, page: 0, revealed: true, closed: false });
  });

  it('con la página revelada pasa a la siguiente página de la misma línea', () => {
    const c = confirm({ ...start, revealed: true }, pagesPerLine);
    expect(c).toEqual({ line: 0, page: 1, revealed: false, closed: false });
  });

  it('en la última página pasa a la siguiente línea', () => {
    const c = confirm({ line: 0, page: 1, revealed: true, closed: false }, pagesPerLine);
    expect(c).toEqual({ line: 1, page: 0, revealed: false, closed: false });
  });

  it('en la última página de la última línea cierra', () => {
    const c = confirm({ line: 1, page: 0, revealed: true, closed: false }, pagesPerLine);
    expect(c.closed).toBe(true);
  });

  it('un cursor cerrado no cambia', () => {
    const closed: DialogCursor = { line: 1, page: 0, revealed: true, closed: true };
    expect(confirm(closed, pagesPerLine)).toEqual(closed);
  });
});
