import type Phaser from 'phaser';
import { PALETTE } from '../palette';
import { createPixelSheet, type CharPalette, type PixelFrame, type PixelRows } from '../pixelTexture';

/**
 * SaraDev, versión mínima (spec 002): chibi de 24×24 con `idle` y `walk` en 3 vistas
 * (abajo, arriba y derecha; la izquierda es la derecha espejada). La spec 013 agrega las
 * expresiones y el resto de animaciones sobre este mismo sistema de piezas.
 *
 * Las piezas (cabeza, torso, piernas) miden 14 px de ancho y se componen en un lienzo de 24×24.
 */
export const SARADEV_KEY = 'spr_saradev';
export const SARADEV_SIZE = 24;

export type View = 'down' | 'up' | 'right';

export const SARADEV_PALETTE: CharPalette = {
  o: PALETTE.black, // contorno
  h: PALETTE.ink, // pelo
  H: PALETTE.slate, // brillo del pelo
  s: PALETTE.yellow, // piel
  S: PALETTE.orange, // sombra de la piel
  w: PALETTE.white, // brillo de ojos
  e: PALETTE.black, // pupilas
  m: PALETTE.red, // boca
  N: PALETTE.silver, // audífonos al cuello
  B: PALETTE.red, // sudadera roja (referencia del usuario)
  b: PALETTE.purple, // sombra de la sudadera y bolsillo
  c: PALETTE.yellow, // cordones y ribete amarillo de la capucha
  p: PALETTE.blue, // jeans
  W: PALETTE.red, // botas rojas
};

const HEAD: Record<View, PixelRows> = {
  down: [
    '....hoooo.....',
    '...oohhhhoo...',
    '..ohhHhhhhhho.',
    '.ohhhhhhhhhhho',
    'ohhsssssssshho',
    'ohssssssssssho',
    'ossweesssweeso',
    'osseesssseesso',
    '.ossssmmssssso',
    '..osssssssso..',
    '...oSSSSSSo...',
  ],
  right: [
    '....hoooo.....',
    '...oohhhhoo...',
    '..ohhhhhhhhho.',
    '.ohhhhhhhhhho.',
    'ohhhhhhhsssso.',
    'ohhhhhhsssssso',
    'ohhhhhssssweso',
    'ohhhhhsssseeso',
    '.ohhhhsssssmo.',
    '..ohhsssssso..',
    '...oSSSSSSo...',
  ],
  up: [
    '....hoooo.....',
    '...oohhhhoo...',
    '..ohhHhhhhhho.',
    '.ohhhhhhhhhhho',
    'ohhhhhhhhhhhho',
    'ohhhhhhhhhhhho',
    'ohhhhhhhhhhhho',
    'ohhhhhhhhhhhho',
    '.ohhhhhhhhhhho',
    '..ohhhhhhhho..',
    '...oSSSSSSo...',
  ],
};

const BODY: Record<View, PixelRows> = {
  down: [
    '..oNssssssNo..',
    '.oBBBBBBBBBBo.',
    'oBBBBcBBcBBBBo',
    'oBBBBcBBcBBBBo',
    'oBBBBBBBBBBBBo',
    'oBBBBbbbbBBBBo',
    '.oBBBbbbbBBBo.',
    '..oBBBBBBBBo..',
  ],
  right: [
    '....oNsssNo...',
    '...oBBBBBBo...',
    '..oBBBBBBBBo..',
    '..oBBBBBBBBo..',
    '..oBBBBBBBBo..',
    '..oBBBBbbBBo..',
    '..oBBBBBBBBo..',
    '...oBBBBBBo...',
  ],
  up: [
    '..oNhhhhhhNo..',
    '.oBBccccccBBo.',
    'oBBcbbbbbbcBBo',
    'oBBBbbbbbbBBBo',
    'oBBBBBBBBBBBBo',
    'oBBBBBBBBBBBBo',
    '.oBBBBBBBBBBo.',
    '..oBBBBBBBBo..',
  ],
};

const LEGS_FRONT = {
  stand: ['..oppo..oppo..', '..oppo..oppo..', '..oppo..oppo..', '.oWWWo..oWWWo.', '.ooooo..ooooo.'],
  stepLeft: ['..oppo..oppo..', '..oppo..oppo..', '.oWWWo..oppo..', '.ooooo..oWWWo.', '........ooooo.'],
  stepRight: ['..oppo..oppo..', '..oppo..oppo..', '..oppo..oWWWo.', '.oWWWo..ooooo.', '.ooooo........'],
} satisfies Record<string, PixelRows>;

const mirror = (rows: PixelRows): PixelRows => rows.map((r) => [...r].reverse().join(''));

const LEGS_SIDE = {
  stand: ['....oppppo....', '....oppppo....', '....oppppo....', '....oWWWWo....', '....oooooo....'],
  stepA: ['...oppo.oppo..', '...oppo.oppo..', '..oppo...oppo.', '..oWWo...oWWo.', '..oooo...oooo.'],
} satisfies Record<string, PixelRows>;

const LEGS: Record<View, { stand: PixelRows; step1: PixelRows; step2: PixelRows }> = {
  down: { stand: LEGS_FRONT.stand, step1: LEGS_FRONT.stepLeft, step2: LEGS_FRONT.stepRight },
  up: { stand: LEGS_FRONT.stand, step1: LEGS_FRONT.stepRight, step2: LEGS_FRONT.stepLeft },
  right: { stand: LEGS_SIDE.stand, step1: LEGS_SIDE.stepA, step2: mirror(LEGS_SIDE.stepA) },
};

const PART_X = 5; // (24 − 14) / 2
const HEAD_Y = 0;
const BODY_Y = 11;
const LEGS_Y = 19;

function stamp(grid: string[][], rows: PixelRows, ox: number, oy: number): void {
  rows.forEach((row, y) => {
    const gy = oy + y;
    if (gy < 0 || gy >= SARADEV_SIZE) return;
    const line = grid[gy];
    if (!line) return;
    for (let x = 0; x < row.length; x += 1) {
      const ch = row.charAt(x);
      if (ch !== '.') line[ox + x] = ch;
    }
  });
}

/** Compone cabeza, torso y piernas en un cuadro de 24×24. `headDy` baja la cabeza (respiración). */
function compose(view: View, legs: PixelRows, headDy = 0): PixelRows {
  const grid = Array.from({ length: SARADEV_SIZE }, () => Array<string>(SARADEV_SIZE).fill('.'));
  stamp(grid, legs, PART_X, LEGS_Y);
  stamp(grid, BODY[view], PART_X, BODY_Y);
  stamp(grid, HEAD[view], PART_X, HEAD_Y + headDy);
  return grid.map((line) => line.join(''));
}

export function buildSaraDevFrames(): PixelFrame[] {
  const views: View[] = ['down', 'up', 'right'];
  return views.flatMap((view) => [
    { name: `${view}-idle-0`, rows: compose(view, LEGS[view].stand) },
    { name: `${view}-idle-1`, rows: compose(view, LEGS[view].stand, 1) },
    { name: `${view}-walk-0`, rows: compose(view, LEGS[view].step1) },
    { name: `${view}-walk-1`, rows: compose(view, LEGS[view].step2) },
  ]);
}

/** Cabeza de frente y el cuello de la sudadera (14×13), base del retrato de 32×32. */
export function saraDevPortraitRows(): PixelRows {
  return [...HEAD.down, ...BODY.down.slice(0, 2)];
}

/** Genera la hoja `spr_saradev` (12 cuadros de 24×24). */
export function createSaraDevSheet(scene: Phaser.Scene): void {
  createPixelSheet(scene, SARADEV_KEY, buildSaraDevFrames(), SARADEV_SIZE, SARADEV_SIZE, SARADEV_PALETTE, 4);
}
