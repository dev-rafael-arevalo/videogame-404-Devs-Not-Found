import type Phaser from 'phaser';
import { PALETTE } from '../palette';
import { createPixelSheet, type CharPalette, type PixelFrame, type PixelRows } from '../pixelTexture';

/** Clave de la textura y nombre del tileset dentro del JSON de Tiled. */
export const ACTO1_TILESET_KEY = 'tile_acto1';
export const TILE_SIZE = 16;

const P: CharPalette = {
  o: PALETTE.black,
  k: PALETTE.ink,
  l: PALETTE.slate,
  v: PALETTE.silver,
  w: PALETTE.white,
  n: PALETTE.navy,
  b: PALETTE.blue,
  t: PALETTE.teal,
  g: PALETTE.green,
  G: PALETTE.lime,
  r: PALETTE.red,
  O: PALETTE.orange,
  y: PALETTE.yellow,
  T: PALETTE.terminal,
};

const N = TILE_SIZE;
const line = (ch: string): string => ch.repeat(N);
const rows = (fn: (y: number) => string): string[] => Array.from({ length: N }, (_, y) => fn(y));

/** Piso con junta a la derecha y abajo (la luz viene de arriba a la izquierda). */
const floor: PixelRows = rows((y) => (y === N - 1 ? line('l') : `${'v'.repeat(N - 1)}l`));

const floorAlt: PixelRows = floor.map((row, y) => {
  if (y === 5) return `${row.slice(0, 4)}l${row.slice(5)}`;
  if (y === 10) return `${row.slice(0, 11)}l${row.slice(12)}`;
  return row;
});

const carpet: PixelRows = rows((y) => {
  if (y % 4 === 0) return 'tttn'.repeat(4);
  if (y % 4 === 2) return `tn${'tttn'.repeat(3)}tt`;
  return line('t');
});

const brickFace = (y: number): string =>
  y % 4 === 3 ? line('o') : y % 8 < 4 ? 'kkkkkkkokkkkkkko' : 'kkkokkkkkkkokkkk';

/** Tapa del muro vista desde arriba. */
const wall: PixelRows = rows((y) => (y === 0 ? line('v') : `v${'l'.repeat(N - 1)}`));

/** Muro con su cara visible (cuando hay piso debajo). */
const wallFace: PixelRows = rows((y) => (y < 5 ? (y === 0 ? line('v') : `v${'l'.repeat(N - 1)}`) : brickFace(y)));

const desk: PixelRows = [
  'oooooooooooooooo',
  'oyyyyyyyyyyyyyro',
  'oyOOOOOOOOOOOOro',
  'oyOOOOOOOOOOOOro',
  'oyOOwwwwOOOOOOro',
  'oyOOwllwOOOOOOro',
  'oyOOwwwwOOOOOOro',
  'oyOOOOOOOOOOOOro',
  'oyOOOOOOOOOkkOro',
  'oyOOOOOOOOOkkOro',
  'oyOOOOOOOOOOOOro',
  'oyOOOOOOOOOOOOro',
  'oyOOOOOOOOOOOOro',
  'oyrrrrrrrrrrrrro',
  'oooooooooooooooo',
  '.oo..........oo.',
];

const deskPc: PixelRows = [
  'oooooooooooooooo',
  'oyyyyyyyyyyyyyro',
  'oyOOoooooooooOro',
  'oyOOokkkkkkkoOro',
  'oyOOoTTkkkkkoOro',
  'oyOOokTTTkkkoOro',
  'oyOOokkkkTkkoOro',
  'oyOOokkkkkkkoOro',
  'oyOOoooooooooOro',
  'oyOOOOOookOOOOro',
  'oyOOOOooooooOOro',
  'oyOOkkkkkkkkkOro',
  'oyOOOOOOOOOOOOro',
  'oyrrrrrrrrrrrrro',
  'oooooooooooooooo',
  '.oo..........oo.',
];

const chair: PixelRows = [
  '................',
  '................',
  '................',
  '....oooooooo....',
  '...ollllllllo...',
  '...ollllllllo...',
  '...okkkkkkkko...',
  '...okkkkkkkko...',
  '...okkkkkkkko...',
  '...okkkkkkkko...',
  '...okkkkkkkko...',
  '...oooooooooo...',
  '....o......o....',
  '................',
  '................',
  '................',
];

const rackRow = 'olkkkkkkkkkkkklo';
const rackGap = 'ollllllllllllllo';
const rackBottom: PixelRows = [
  rackGap,
  rackRow,
  'olkgkkkkkkkkrklo',
  rackRow,
  rackGap,
  rackRow,
  'olkgkkkkkkkkgklo',
  rackRow,
  rackGap,
  rackRow,
  'olkgkkkkkkkkgklo',
  rackRow,
  rackGap,
  rackRow,
  'olkrkkkkkkkkkklo',
  line('o'),
];

const rackTop: PixelRows = rows((y) => {
  if (y === 0 || y === N - 1) return line('o');
  if (y === N - 2) return `o${'l'.repeat(N - 2)}o`;
  if (y === 4 || y === 8) return 'ovlvlvlvlvlvlvlo';
  return `o${'v'.repeat(N - 3)}lo`;
});

const plant: PixelRows = [
  '................',
  '......oo........',
  '.....oGgo..oo...',
  '....oGggo.oGgo..',
  '...oGgggoogggo..',
  '...ogggggggggo..',
  '..oGggggggggggo.',
  '..ogggggggggggo.',
  '...ogggggggggo..',
  '....oogggggoo...',
  '.....ooooooo....',
  '.....oOOOOOo....',
  '.....oOrrrOo....',
  '......orrro.....',
  '......orrro.....',
  '......ooooo.....',
];

const door: PixelRows = rows((y) => (y === 7 ? line('y') : y === 8 ? line('l') : line('v')));

const coldFloor: PixelRows = rows((y) => (y === N - 1 ? line('k') : `${'n'.repeat(N - 1)}k`));

const empty: PixelRows = rows(() => line('.'));
const collision: PixelRows = rows(() => line('r'));

/**
 * Orden = índice de tile (GID − 1) en `public/assets/maps/acto1_oficina.json`.
 * Debe coincidir con `TILE` en `scripts/generate-map-acto1.mjs`.
 */
const TILES: readonly PixelFrame[] = [
  { name: 'floor', rows: floor },
  { name: 'floorAlt', rows: floorAlt },
  { name: 'carpet', rows: carpet },
  { name: 'wall', rows: wall },
  { name: 'wallFace', rows: wallFace },
  { name: 'desk', rows: desk },
  { name: 'chair', rows: chair },
  { name: 'rackBottom', rows: rackBottom },
  { name: 'rackTop', rows: rackTop },
  { name: 'plant', rows: plant },
  { name: 'door', rows: door },
  { name: 'coldFloor', rows: coldFloor },
  { name: 'deskPc', rows: deskPc },
  { name: 'reserved14', rows: empty },
  { name: 'reserved15', rows: empty },
  { name: 'collision', rows: collision },
];

/** Genera la textura `tile_acto1` (128×32: 8 columnas × 2 filas de 16×16). */
export function createActo1Tileset(scene: Phaser.Scene): void {
  createPixelSheet(scene, ACTO1_TILESET_KEY, TILES, TILE_SIZE, TILE_SIZE, P, 8);
}
