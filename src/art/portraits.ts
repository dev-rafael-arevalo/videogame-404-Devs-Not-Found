import type Phaser from 'phaser';
import { PATO_PALETTE, PATO_ROWS } from './characters/pato';
import { SARADEV_PALETTE, saraDevPortraitRows } from './characters/saradev';
import { createPixelSheet, scaleRows, type PixelFrame, type PixelRows } from './pixelTexture';
import { POSTIT_ROWS, PROPS_PALETTE } from './props';

/** Retratos de 32×32 para la caja de diálogo (P08). Se arman ampliando el arte del mundo. */
export const PORTRAITS_KEY = 'spr_portraits';
export const PORTRAIT_SIZE = 32;

export type PortraitName = 'saradev' | 'pato' | 'marga';

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

export function createPortraits(scene: Phaser.Scene): void {
  const frames: PixelFrame[] = [
    { name: 'saradev', rows: center(scaleRows(saraDevPortraitRows(), 2)) },
    { name: 'pato', rows: center(scaleRows(PATO_ROWS, 2)) },
    { name: 'marga', rows: center(scaleRows(POSTIT_ROWS, 3)) },
  ];
  createPixelSheet(
    scene,
    PORTRAITS_KEY,
    frames,
    PORTRAIT_SIZE,
    PORTRAIT_SIZE,
    { ...SARADEV_PALETTE, ...PATO_PALETTE, ...PROPS_PALETTE },
    3,
  );
}
