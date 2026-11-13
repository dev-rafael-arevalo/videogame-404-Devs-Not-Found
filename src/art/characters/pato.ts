import type Phaser from 'phaser';
import { PALETTE } from '../palette';
import { createPixelSheet, type CharPalette, type PixelRows } from '../pixelTexture';

/** PATO: pato de goma con parlante, 12×12, `idle` con rebote de 2 cuadros. */
export const PATO_KEY = 'spr_pato';
export const PATO_SIZE = 12;
export const PATO_IDLE_ANIM = 'pato-idle';

export const PATO_PALETTE: CharPalette = {
  o: PALETTE.black,
  y: PALETTE.yellow,
  O: PALETTE.orange,
  e: PALETTE.black,
  w: PALETTE.white,
  l: PALETTE.slate, // rejilla del parlante
};

export const PATO_ROWS: PixelRows = [
  '....oooo....',
  '...oyyyyo...',
  '..oyyyweyo..',
  '..oyyyyyyoOo',
  '..oyyyyyyOOo',
  '...oyyyyoo..',
  '.oooyyyyyo..',
  'oyyyyylyyyyo',
  'oyyyylllyyyo',
  '.oyyyyyyyyo.',
  '..oooooooo..',
  '............',
];

/** Cuadro 2: el mismo pato un píxel más abajo (rebote). */
const PATO_BOUNCE: PixelRows = ['............', ...PATO_ROWS.slice(0, PATO_SIZE - 1)];

export function createPatoSheet(scene: Phaser.Scene): void {
  createPixelSheet(
    scene,
    PATO_KEY,
    [
      { name: 'idle-0', rows: PATO_ROWS },
      { name: 'idle-1', rows: PATO_BOUNCE },
    ],
    PATO_SIZE,
    PATO_SIZE,
    PATO_PALETTE,
    2,
  );
  if (!scene.anims.exists(PATO_IDLE_ANIM)) {
    scene.anims.create({
      key: PATO_IDLE_ANIM,
      frames: [
        { key: PATO_KEY, frame: 'idle-0' },
        { key: PATO_KEY, frame: 'idle-1' },
      ],
      frameRate: 2,
      repeat: -1,
    });
  }
}
