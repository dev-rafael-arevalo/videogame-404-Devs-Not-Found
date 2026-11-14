import type Phaser from 'phaser';
import { PALETTE } from '../palette';
import { createPixelSheet, type CharPalette, type PixelFrame, type PixelRows } from '../pixelTexture';
import { TILE_SIZE } from './acto1';

/** Tileset del acto 3 (spec 009): el núcleo de ARCA, un mundo digital de grilla cian sobre el vacío. */
export const ACTO3_TILESET_KEY = 'tile_acto3';

const P: CharPalette = {
  o: PALETTE.black,
  k: PALETTE.ink,
  n: PALETTE.navy,
  b: PALETTE.blue,
  c: PALETTE.cyan,
  s: PALETTE.sky,
  w: PALETTE.white,
  p: PALETTE.purple,
  r: PALETTE.red,
  T: PALETTE.terminal,
  l: PALETTE.slate,
};

const N = TILE_SIZE;
const line = (ch: string): string => ch.repeat(N);
const rows = (fn: (y: number) => string): string[] => Array.from({ length: N }, (_, y) => fn(y));

/** Plataforma: fondo navy con una grilla de puntos cian en los bordes. */
const grid: PixelRows = rows((y) => (y === N - 1 ? 'bnbnbnbnbnbnbnbn' : `${'n'.repeat(N - 1)}${y % 2 === 0 ? 'b' : 'n'}`));
const gridBright: PixelRows = rows((y) => (y === N - 1 ? 'cncncncncncncncn' : y === 7 ? 'nnnnnnnsnnnnnnnc' : `${'n'.repeat(N - 1)}${y % 2 === 0 ? 'c' : 'n'}`));

/** Vacío: negro con partículas de datos. */
const voidTile: PixelRows = rows((y) => {
  if (y === 3) return 'ooooocoooooooooo';
  if (y === 9) return 'oooooooooooopooo';
  if (y === 13) return 'ooocoooooooooooo';
  return line('o');
});

const pillarBottom: PixelRows = [
  'oppppppppppppppo',
  'opccpcccpccpcccpo'.slice(0, 16),
  'opTppppTppppTppo',
  'oppppppppppppppo',
  'opppTppppTpppppo',
  'oppppppppppppppo',
  'opTppppTppppTppo',
  'oppppppppppppppo',
  'opppTppppTpppppo',
  'oppppppppppppppo',
  'opTppppTppppTppo',
  'oppppppppppppppo',
  'opppTppppTpppppo',
  'oppppppppppppppo',
  'oppppppppppppppo',
  'oooooooooooooooo',
];

const pillarTop: PixelRows = [
  '................',
  '................',
  '....oooooooo....',
  '...occccccccco..'.slice(0, 16),
  '..occwwccccwcco.'.slice(0, 16),
  '..occccccccccco.'.slice(0, 16),
  '..occccccccccco.'.slice(0, 16),
  '...occccccccco..'.slice(0, 16),
  '....oooooooo....',
  'oppppppppppppppo',
  'opTppppTppppTppo',
  'oppppppppppppppo',
  'opppTppppTpppppo',
  'oppppppppppppppo',
  'opTppppTppppTppo',
  'oppppppppppppppo',
];

/** El núcleo: bloque luminoso con un patrón de datos. */
const core: PixelRows = rows((y) => {
  if (y === 0 || y === N - 1) return line('c');
  if (y % 4 === 2) return 'cwswswswswswswsc';
  if (y % 4 === 0) return 'cswswswswswswswc';
  return `c${'s'.repeat(N - 2)}c`;
});

const kiosk: PixelRows = [
  '..oooooooooooo..',
  '..opppppppppppo.'.slice(0, 16),
  '..opokkkkkkopo..',
  '..opokTkkkkopo..',
  '..opokTTkkkopo..',
  '..opokTkkTkopo..',
  '..opokkkkkkopo..',
  '..opooooooooopo.'.slice(0, 16),
  '..oppppppppppo..',
  '..oooooooooooo..',
  '......oooo......',
  '......opko......',
  '......opko......',
  '......opko......',
  '....oooooooo....',
  '....oooooooo....',
];

const empty: PixelRows = rows(() => line('.'));
const collision: PixelRows = rows(() => line('r'));

/** Orden = índice de tile (GID − 1); coincide con `T3` en `scripts/generate-maps.mjs`. */
const TILES: readonly PixelFrame[] = [
  { name: 'grid', rows: grid },
  { name: 'gridBright', rows: gridBright },
  { name: 'void', rows: voidTile },
  { name: 'pillarBottom', rows: pillarBottom },
  { name: 'pillarTop', rows: pillarTop },
  { name: 'core', rows: core },
  { name: 'kiosk', rows: kiosk },
  ...Array.from({ length: 8 }, (_, i) => ({ name: `reserved${i + 8}`, rows: empty })),
  { name: 'collision', rows: collision },
];

export function createActo3Tileset(scene: Phaser.Scene): void {
  createPixelSheet(scene, ACTO3_TILESET_KEY, TILES, TILE_SIZE, TILE_SIZE, P, 8);
}
