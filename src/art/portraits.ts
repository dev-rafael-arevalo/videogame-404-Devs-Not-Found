import type Phaser from 'phaser';
import { PATO_PALETTE, PATO_ROWS } from './characters/pato';
import { EXPRESSIONS, SARADEV_PALETTE, saraDevPortraitRows, type Expression } from './characters/saradev';
import { PALETTE } from './palette';
import { createPixelSheet, scaleRows, type CharPalette, type PixelFrame, type PixelRows } from './pixelTexture';
import { POSTIT_ROWS, PROPS_PALETTE } from './props';

/** Retratos de 32×32 para la caja de diálogo (P08). Se arman ampliando el arte del mundo. */
export const PORTRAITS_KEY = 'spr_portraits';
export const PORTRAIT_SIZE = 32;

export type PortraitName = `saradev-${Expression}` | 'pato' | 'marga' | 'cron';

/** Monitor de CRON (16×16): pantalla negra con el prompt verde. */
const CRON_ROWS: PixelRows = [
  'oooooooooooooooo',
  'ovvvvvvvvvvvvvvo',
  'ovokkkkkkkkkkovo',
  'ovokTkkkkkkkkovo',
  'ovokTTkkkkkkkovo',
  'ovokTTTkkkkkkovo',
  'ovokTTkkkkkkkovo',
  'ovokTkkkkTTTkovo',
  'ovokkkkkkkkkkovo',
  'ovoooooooooooovo',
  'ovvvvvvvvvvvvvvo',
  'oooooooooooooooo',
  '......ovvo......',
  '......ovvo......',
  '....oovvvvoo....',
  '....oooooooo....',
];
const CRON_PALETTE: CharPalette = { o: PALETTE.black, v: PALETTE.silver, k: PALETTE.ink, T: PALETTE.terminal };

function center(rows: PixelRows): PixelRows {
  const width = rows[0]?.length ?? 0;
  const ox = Math.floor((PORTRAIT_SIZE - width) / 2);
  const oy = Math.floor((PORTRAIT_SIZE - rows.length) / 2);
  const grid = Array.from({ length: PORTRAIT_SIZE }, () => '.'.repeat(PORTRAIT_SIZE).split(''));
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const line = grid[oy + y];
      if (line && ch !== '.') line[ox + x] = ch;
    });
  });
  return grid.map((line) => line.join(''));
}

export function portraitFor(speaker: string, expression?: string): PortraitName {
  if (speaker === 'pato' || speaker === 'marga' || speaker === 'cron') return speaker;
  const face = (EXPRESSIONS as readonly string[]).includes(expression ?? '') ? (expression as Expression) : 'normal';
  return `saradev-${face}`;
}

export function createPortraits(scene: Phaser.Scene): void {
  const frames: PixelFrame[] = [
    ...EXPRESSIONS.map((expression) => ({ name: `saradev-${expression}`, rows: center(scaleRows(saraDevPortraitRows(expression), 2)) })),
    { name: 'pato', rows: center(scaleRows(PATO_ROWS, 2)) },
    { name: 'marga', rows: center(scaleRows(POSTIT_ROWS, 3)) },
    { name: 'cron', rows: center(scaleRows(CRON_ROWS, 2)) },
  ];
  createPixelSheet(
    scene,
    PORTRAITS_KEY,
    frames,
    PORTRAIT_SIZE,
    PORTRAIT_SIZE,
    { ...SARADEV_PALETTE, ...PATO_PALETTE, ...PROPS_PALETTE, ...CRON_PALETTE },
    4,
  );
}
