import type Phaser from 'phaser';
import { PALETTE } from '../palette';
import { createPixelSheet, type CharPalette, type PixelFrame, type PixelRows } from '../pixelTexture';
import { TILE_SIZE } from './acto1';

/** Tileset del acto 2 (spec 008): Puerto Cero de noche, con el mundo ya degradado. */
export const ACTO2_TILESET_KEY = 'tile_acto2';

const P: CharPalette = {
  o: PALETTE.black,
  k: PALETTE.ink,
  l: PALETTE.slate,
  v: PALETTE.silver,
  w: PALETTE.white,
  n: PALETTE.navy,
  b: PALETTE.blue,
  c: PALETTE.cyan,
  t: PALETTE.teal,
  g: PALETTE.green,
  G: PALETTE.lime,
  r: PALETTE.red,
  O: PALETTE.orange,
  y: PALETTE.yellow,
  p: PALETTE.purple,
  T: PALETTE.terminal,
};

const N = TILE_SIZE;
const line = (ch: string): string => ch.repeat(N);
const rows = (fn: (y: number) => string): string[] => Array.from({ length: N }, (_, y) => fn(y));

const asphalt: PixelRows = rows((y) => (y === 5 ? 'kkklkkkkkkkkkkkk' : y === 12 ? 'kkkkkkkkkkklkkkk' : line('k')));

const crack: PixelRows = [
  'kkkkkkkkkkkkkkkk',
  'kkkkkkkkkkkkkkkk',
  'kkkkkkklkkkkkkkk',
  'kkkkkkklkkkkkkkk',
  'kkkkkklkkkkkkkkk',
  'kkkkkllkkkkkkkkk',
  'kkkkllkkkkkkkkkk',
  'kkkklkkkkkkkkkkk',
  'kkkklkklkkkkkkkk',
  'kkkklklkkkkkkkkk',
  'kkkkkllkkkkkkkkk',
  'kkkkkkklkkkkkkkk',
  'kkkkkkkklkkkkkkk',
  'kkkkkkkkllkkkkkk',
  'kkkkkkkkkklkkkkk',
  'kkkkkkkkkkkkkkkk',
];

const sidewalk: PixelRows = rows((y) => (y === N - 1 ? line('k') : `${'l'.repeat(N - 1)}k`));

/** Fachada vista desde arriba: techo oscuro con una cornisa. */
const wall: PixelRows = rows((y) => (y === 0 ? line('l') : y === 1 ? line('k') : `k${'n'.repeat(N - 2)}k`));

/** Fachada con ventanas apagadas (cuando hay vereda debajo). */
const wallFace: PixelRows = rows((y) => {
  if (y < 2) return y === 0 ? line('l') : line('k');
  if (y >= 4 && y <= 8) return 'nnkknnnnkknnnnkk'.slice(0, 16).replace(/k/g, (m, i) => ((y === 6 && i === 9) ? 'y' : m));
  if (y >= 10 && y <= 14) return 'nnkknnnnkknnnnkk';
  return line('n');
});

const grass: PixelRows = rows((y) => {
  if (y % 5 === 1) return 'gGgggggGggggGggg';
  if (y % 5 === 3) return 'ggggkggggggggkgg';
  return line('g');
});

const metroBottom: PixelRows = [
  'ovvvvvvvvvvvvvvo',
  'ovkkkkkkkkkkkkvo',
  'ovkkkkkkkkkkkkvo',
  'ovkkkkkkkkkkkkvo',
  'ovklllllllllkkvo',
  'ovkkkkkkkkkkkkvo',
  'ovklllllllllkkvo',
  'ovkkkkkkkkkkkkvo',
  'ovklllllllllkkvo',
  'ovkkkkkkkkkkkkvo',
  'ovklllllllllkkvo',
  'ovkkkkkkkkkkkkvo',
  'ovklllllllllkkvo',
  'ovkkkkkkkkkkkkvo',
  'ovvvvvvvvvvvvvvo',
  'oooooooooooooooo',
];

const metroTop: PixelRows = [
  '................',
  '................',
  '................',
  '....oooooooo....',
  '....occccccco...'.slice(0, 16),
  '....ocwwccwco...'.slice(0, 16),
  '....ocwcwcwco...'.slice(0, 16),
  '....ocwcccwco...'.slice(0, 16),
  '....occccccco...'.slice(0, 16),
  '....oooooooo....',
  '......o..o......',
  '......o..o......',
  '......o..o......',
  'ovvvvvvvvvvvvvvo',
  'ovvvvvvvvvvvvvvo',
  'ovvvvvvvvvvvvvvo',
];

const generator: PixelRows = [
  'oooooooooooooooo',
  'olllllllllllllllo'.slice(0, 16),
  'olkkkkkkkkkkkklo',
  'ollllllllllllllo',
  'olkkkkkkkkkkkklo',
  'ollllllllllllllo',
  'olkkkkkkkkkkkklo',
  'ollllllllllllllo',
  'olllllllllllrllo',
  'ollllllllllllllo',
  'oyoyoyoyoyoyoyoo',
  'ooyoyoyoyoyoyoyo',
  'ollllllllllllllo',
  'ollllllllllllllo',
  'oooooooooooooooo',
  '.oo..........oo.',
];

const antennaBottom: PixelRows = [
  '.......ov.......',
  '.......ov.......',
  '......ovvo......',
  '......ovvo......',
  '......ovvo......',
  '.....ovvvvo.....',
  '.....ovvvvo.....',
  '....ovvvvvvo....',
  '....ovvvvvvo....',
  '...ollllllllo...',
  '..olllllllllllo.'.slice(0, 16),
  '..ollllllllllo..',
  '..ollllllllllo..',
  '..oooooooooooo..',
  '................',
  '................',
];

const antennaTop: PixelRows = [
  '.......r........',
  '.......o........',
  '......ovo.......',
  '.....ovvvo......',
  '......ovo.......',
  '.......o........',
  '.......o........',
  '....ooovoooo....',
  '.......v........',
  '.......v........',
  '..oooooVooooo...'.replace('V', 'v'),
  '.......v........',
  '.......v........',
  '.......v........',
  '.......v........',
  '.......ov.......',
];

/** Cartel con estática: ruido de píxeles con destellos cian y magenta. */
const billboard: PixelRows = [
  'oooooooooooooooo',
  'olvlkvlkllvklvlo',
  'okvlvkklvlkvlklo',
  'olklvlcvkllklvko',
  'ovlkllvklpvlvklo',
  'olvkvlklvlkllvko',
  'okllvlkvlkcvlklo',
  'olvlkvlpllvklvlo',
  'okvlvkklvlkvlklo',
  'olklvlkvkllklvko',
  'ovlkllvklcvlvklo',
  'olvkvlklvlkllvko',
  'oooooooooooooooo',
  '.......oo.......',
  '.......oo.......',
  '......oooo......',
];

const car: PixelRows = [
  '................',
  '..oooooooooooo..',
  '.oppppppppppppo.',
  'oppppkkkkkkpppyo',
  'oppppkkkkkkpppyo',
  'oppppppppppppppo',
  'oppppkkkkkkpppyo',
  'oppppkkkkkkpppyo',
  '.oppppppppppppo.',
  '..oooooooooooo..',
  '...oo......oo...',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const kiosk: PixelRows = [
  '..oooooooooooo..',
  '..olllllllllllo.'.slice(0, 16),
  '..olokkkkkkolo..',
  '..olokTkkkkolo..',
  '..olokTTkkkolo..',
  '..olokTkkTkolo..',
  '..olokkkkkkolo..',
  '..oloooooooolo..',
  '..ollllllllllo..',
  '..oooooooooooo..',
  '......oooo......',
  '......olko......',
  '......olko......',
  '......olko......',
  '....oooooooo....',
  '....oooooooo....',
];

const empty: PixelRows = rows(() => line('.'));
const collision: PixelRows = rows(() => line('r'));

/** Orden = índice de tile (GID − 1); coincide con `T2` en `scripts/generate-maps.mjs`. */
const TILES: readonly PixelFrame[] = [
  { name: 'asphalt', rows: asphalt },
  { name: 'crack', rows: crack },
  { name: 'sidewalk', rows: sidewalk },
  { name: 'wall', rows: wall },
  { name: 'wallFace', rows: wallFace },
  { name: 'grass', rows: grass },
  { name: 'metroBottom', rows: metroBottom },
  { name: 'metroTop', rows: metroTop },
  { name: 'generator', rows: generator },
  { name: 'antennaBottom', rows: antennaBottom },
  { name: 'antennaTop', rows: antennaTop },
  { name: 'billboard', rows: billboard },
  { name: 'car', rows: car },
  { name: 'kiosk', rows: kiosk },
  { name: 'reserved15', rows: empty },
  { name: 'collision', rows: collision },
];

export function createActo2Tileset(scene: Phaser.Scene): void {
  createPixelSheet(scene, ACTO2_TILESET_KEY, TILES, TILE_SIZE, TILE_SIZE, P, 8);
}
