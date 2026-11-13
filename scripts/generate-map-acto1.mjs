/**
 * Genera `public/assets/maps/acto1_oficina.json` (formato Tiled JSON) a partir de un plano ASCII.
 * Uso: `node scripts/generate-map-acto1.mjs`. El resultado se puede abrir y editar en Tiled.
 *
 * Leyenda del plano (un carácter por tile de 16×16):
 *   #  pared                 .  piso de oficina       ,  piso de la sala fría
 *   ~  alfombra              =  puerta (piso)         D  escritorio
 *   T  escritorio con PC     c  silla                 S  rack de servidores (ocupa 2 tiles de alto: el
 *   P  planta                                            de arriba va en la capa `encima`)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/assets/maps/acto1_oficina.json');

// Índices de tiles (GID = índice + 1). Deben coincidir con src/art/tiles/acto1.ts.
const TILE = {
  floor: 1,
  floorAlt: 2,
  carpet: 3,
  wall: 4,
  wallTop: 5,
  desk: 6,
  chair: 7,
  rackBottom: 8,
  rackTop: 9,
  plant: 10,
  door: 11,
  coldFloor: 12,
  deskPc: 13,
  collision: 16,
};

// 40 columnas × 23 filas. Sala fría a la izquierda, oficina abierta al centro, sala de reuniones a la derecha.
const PLAN = [
  '########################################',
  '#,,,,,,,,,#............................#',
  '#,S,S,S,S,#............................#',
  '#,,,,,,,,,#....Dc.....Dc......#######..#',
  '#,S,S,S,S,#....Tc.....Tc......#~~~~~#..#',
  '#,,,,,,,,,#....Dc.....Dc......#~DDD~#..#',
  '#,,,,,,,,,=...................=~~~~~#..#',
  '#,,,,,,,,,#...................#~~~~~#..#',
  '#,S,S,S,S,#....Dc.....Dc......#######..#',
  '#,,,,,,,,,#....Tc.....Tc...............#',
  '#,,,,,,,,,#....Dc.....Dc......P........#',
  '###=#######............................#',
  '#...........................P..........#',
  '#..P.............~~~~~~~~..............#',
  '#................~~~~~~~~......Dc.Dc...#',
  '#....Dc..Dc......~~~~~~~~......Tc.Tc...#',
  '#....Tc..Tc......~~~~~~~~......Dc.Dc...#',
  '#....Dc..Dc......~~~~~~~~..............#',
  '#......................................#',
  '#..P..................................P#',
  '#...........S.S.S.S....................#',
  '#......................................#',
  '########################################',
];

const WIDTH = PLAN[0].length;
const HEIGHT = PLAN.length;

// PRNG determinista para las variantes de piso (misma salida en cada ejecución).
let seed = 20261112;
function random() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

const suelo = [];
const objetos = [];
const colision = [];
const encima = [];

for (let y = 0; y < HEIGHT; y += 1) {
  const row = PLAN[y];
  if (row.length !== WIDTH) throw new Error(`La fila ${y} mide ${row.length}, se esperaban ${WIDTH}`);
  for (let x = 0; x < WIDTH; x += 1) {
    const ch = row[x];
    const inColdRoom = x < 10 && y < 11;
    let floor = inColdRoom ? TILE.coldFloor : random() < 0.12 ? TILE.floorAlt : TILE.floor;
    let object = 0;
    let solid = false;
    let above = 0;

    switch (ch) {
      case '#':
        floor = 0;
        object = TILE.wall;
        solid = true;
        break;
      case ',':
        floor = TILE.coldFloor;
        break;
      case '~':
        floor = TILE.carpet;
        break;
      case '=':
        floor = TILE.door;
        break;
      case 'D':
        object = TILE.desk;
        solid = true;
        break;
      case 'T':
        object = TILE.deskPc;
        solid = true;
        break;
      case 'c':
        object = TILE.chair;
        solid = true;
        break;
      case 'P':
        object = TILE.plant;
        solid = true;
        break;
      case 'S':
        object = TILE.rackBottom;
        solid = true;
        break;
      case '.':
        break;
      default:
        throw new Error(`Carácter desconocido '${ch}' en (${x}, ${y})`);
    }

    suelo.push(floor);
    objetos.push(object);
    colision.push(solid ? TILE.collision : 0);
    encima.push(0);
    if (ch === 'S' && y > 0) {
      // La parte alta del rack se dibuja sobre SaraDev cuando pasa por detrás.
      encima[(y - 1) * WIDTH + x] = TILE.rackTop;
    }
  }
}

// La pared superior de cada muro muestra su "canto" (wallTop) cuando tiene piso debajo.
for (let y = 0; y < HEIGHT - 1; y += 1) {
  for (let x = 0; x < WIDTH; x += 1) {
    const i = y * WIDTH + x;
    if (objetos[i] === TILE.wall && objetos[i + WIDTH] !== TILE.wall) {
      objetos[i] = TILE.wallTop;
    }
  }
}

function layer(id, name, data, visible = true) {
  return { id, name, type: 'tilelayer', width: WIDTH, height: HEIGHT, x: 0, y: 0, opacity: 1, visible, data };
}

const map = {
  type: 'map',
  version: '1.10',
  tiledversion: '1.11.0',
  orientation: 'orthogonal',
  renderorder: 'right-down',
  infinite: false,
  width: WIDTH,
  height: HEIGHT,
  tilewidth: 16,
  tileheight: 16,
  compressionlevel: -1,
  nextlayerid: 6,
  nextobjectid: 2,

  tilesets: [
    {
      firstgid: 1,
      name: 'tile_acto1',
      tilewidth: 16,
      tileheight: 16,
      tilecount: 16,
      columns: 8,
      margin: 0,
      spacing: 0,
      image: 'tile_acto1.png',
      imagewidth: 128,
      imageheight: 32,
    },
  ],
  layers: [
    layer(1, 'suelo', suelo),
    layer(2, 'objetos', objetos),
    layer(3, 'colision', colision, false),
    layer(4, 'encima', encima),
    {
      id: 5,
      name: 'spawns',
      type: 'objectgroup',
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      draworder: 'topdown',
      objects: [{ id: 1, name: 'player', type: 'spawn', point: true, x: 5 * 16 + 8, y: 6 * 16 + 16, width: 0, height: 0, rotation: 0, visible: true }],
    },
  ],
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(map)}\n`);
console.log(`Mapa escrito en ${OUT} (${WIDTH}×${HEIGHT} tiles)`);
