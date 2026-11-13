import type Phaser from 'phaser';
import { PALETTE } from './palette';
import { createPixelTexture, type CharPalette, type PixelRows } from './pixelTexture';

/** Objetos pequeños del mundo (spec 003). */
export const POSTIT_KEY = 'spr_postit';

export const PROPS_PALETTE: CharPalette = {
  o: PALETTE.black,
  y: PALETTE.yellow,
  l: PALETTE.slate,
};

/** Post-it de Marga, 8×8, con dos renglones y la esquina doblada. */
export const POSTIT_ROWS: PixelRows = [
  'oooooooo',
  'oyyyyyyo',
  'oyllllyo',
  'oyyyyyyo',
  'oyllllyo',
  'oyyyyyyo',
  'oyyyyyoo',
  'oooooo..',
];

export function createProps(scene: Phaser.Scene): void {
  createPixelTexture(scene, POSTIT_KEY, POSTIT_ROWS, PROPS_PALETTE);
}
