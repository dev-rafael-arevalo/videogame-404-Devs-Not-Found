import type Phaser from 'phaser';
import { PALETTE } from './palette';
import { createPixelTexture, type CharPalette, type PixelRows } from './pixelTexture';

/** Objetos pequeños del mundo (specs 003 y 008). */
export const POSTIT_KEY = 'spr_postit';
export const HOLOGRAM_KEY = 'spr_holograma';

export const PROPS_PALETTE: CharPalette = {
  o: PALETTE.black,
  y: PALETTE.yellow,
  l: PALETTE.slate,
  c: PALETTE.cyan,
  t: PALETTE.teal,
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

/** Holograma de una persona atrapada en ARCA: silueta cian de 16×24 con líneas de barrido. */
export const HOLOGRAM_ROWS: PixelRows = [
  '......cccc......',
  '.....ctttTc.....'.replace('T', 't'),
  '.....cttttc.....',
  '.....cttttc.....',
  '......cccc......',
  '.......cc.......',
  '....cccttccc....',
  '...cttttttttc...',
  '...ctcttttctc...',
  '...ctcttttctc...',
  '...ctcttttctc...',
  '...cccttttccc...',
  '.....cttttc.....',
  '.....cttttc.....',
  '.....cttttc.....',
  '.....ctcctc.....',
  '.....ctcctc.....',
  '.....ctcctc.....',
  '.....ctcctc.....',
  '.....ctcctc.....',
  '.....cccccc.....',
  '....cc....cc....',
  '....cc....cc....',
  '....cccc..cccc..',
];

export function createProps(scene: Phaser.Scene): void {
  createPixelTexture(scene, POSTIT_KEY, POSTIT_ROWS, PROPS_PALETTE);
  createPixelTexture(scene, HOLOGRAM_KEY, HOLOGRAM_ROWS, PROPS_PALETTE);
}
