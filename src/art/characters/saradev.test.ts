import { describe, expect, it } from 'vitest';
import { EXPRESSIONS, SARADEV_PALETTE, SARADEV_SIZE, buildSaraDevFrames, saraDevAnimations } from './saradev';

const frames = buildSaraDevFrames();
const names = new Set(frames.map((f) => f.name));

describe('SaraDev: cuadros', () => {
  it('CA1: todos miden 24×24', () => {
    for (const frame of frames) {
      expect(frame.rows.length, frame.name).toBe(SARADEV_SIZE);
      for (const row of frame.rows) expect(row.length, frame.name).toBe(SARADEV_SIZE);
    }
  });

  it('CA1: solo usan caracteres de la paleta (o transparente)', () => {
    const allowed = new Set(['.', ...Object.keys(SARADEV_PALETTE)]);
    for (const frame of frames) {
      for (const row of frame.rows) {
        for (const ch of row) expect(allowed.has(ch), `${frame.name}: '${ch}'`).toBe(true);
      }
    }
  });

  it('CA1: los nombres son únicos', () => {
    expect(names.size).toBe(frames.length);
  });

  it('usa como máximo 12 colores por cuadro', () => {
    for (const frame of frames) {
      const colors = new Set<number>();
      for (const row of frame.rows) for (const ch of row) if (ch !== '.') colors.add(SARADEV_PALETTE[ch]!);
      expect(colors.size, frame.name).toBeLessThanOrEqual(12);
    }
  });

  it('cada expresión cambia la cara respecto de la normal', () => {
    const normal = frames.find((f) => f.name === 'down-idle-normal-0')!;
    for (const expression of EXPRESSIONS) {
      if (expression === 'normal') continue;
      const other = frames.find((f) => f.name === `down-idle-${expression}-0`)!;
      expect(other.rows.join('\n')).not.toBe(normal.rows.join('\n'));
    }
  });
});

describe('SaraDev: animaciones', () => {
  const anims = saraDevAnimations();

  it('CA1: hay 8 expresiones públicas', () => {
    expect(EXPRESSIONS).toHaveLength(8);
    expect(EXPRESSIONS).toContain('celebracion');
  });

  it('CA1: cada animación referencia cuadros existentes y tiene al menos 2', () => {
    for (const [key, spec] of Object.entries(anims)) {
      expect(spec.frames.length, key).toBeGreaterThanOrEqual(2);
      for (const frame of spec.frames) expect(names.has(frame), `${key} → ${frame}`).toBe(true);
    }
  });

  it('cubre las 10 acciones del brief', () => {
    const keys = Object.keys(anims);
    for (const dir of ['down', 'up', 'right', 'left']) {
      expect(keys).toContain(`saradev-walk-${dir}`);
      expect(keys).toContain(`saradev-run-${dir}`);
      expect(keys).toContain(`saradev-idle-${dir}-normal`);
    }
    for (const action of ['jump', 'interact', 'type', 'panic', 'hurt', 'attack', 'victory']) {
      expect(keys).toContain(`saradev-${action}`);
    }
    expect(anims['saradev-run-down']!.frameRate).toBeGreaterThan(anims['saradev-walk-down']!.frameRate);
    expect(anims['saradev-victory']!.frames.length).toBeGreaterThanOrEqual(3);
    expect(anims['saradev-attack']!.frames).toHaveLength(3);
  });
});
