/**
 * Genera los mapas del juego (formato Tiled JSON) a partir de planos ASCII.
 * Uso: `node scripts/generate-maps.mjs`. Escribe `public/assets/maps/<mapa>.json`; se pueden abrir en Tiled.
 *
 * Cada acto tiene su leyenda (un carácter por tile de 16×16) y su tabla de tiles, que debe coincidir
 * con `src/art/tiles/acto<N>.ts` (GID = índice + 1). Capas: `suelo`, `objetos`, `colision`, `encima`,
 * y las de objetos `spawns` e `interactables`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/assets/maps');

// ------------------------------------------------------------------------------------------------
// Acto 1 · Oficinas de Kernel & Co.

const T1 = { floor: 1, floorAlt: 2, carpet: 3, wall: 4, wallFace: 5, desk: 6, chair: 7, rackBottom: 8, rackTop: 9, plant: 10, door: 11, coldFloor: 12, deskPc: 13, collision: 16 };

const ACTO1 = {
  nombre: 'acto1_oficina',
  tileset: 'tile_acto1',
  spawn: [5, 6],
  plan: [
    '########################################',
    '#,,,,,,,,,#............................#',
    '#,S,S,S,S,#............................#',
    '#,,,,,,,,,#....Dc.....Dc......#######..#',
    '#,S,S,S,S,#....Tc.....Tc......#~~~~~#..#',
    '#,,,,,,,,,#....Dc.....Dc......#~DDD~#..#',
    '#,,,,,,,,,=...................=~~~~~#..#',
    '#,,,,,,,,,#...................#~~~~~#..#',
    '#,S,S,S,S,#....Dc.....Dc......#######..#',
    '#,,,Q,,,,,#....Tc.....Tc...............#',
    '#,,,,,,,,,#....Dc.....Dc......P........#',
    '###X#######............................#',
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
  ],
  /** Objetos extra: [x, y, tipo, diálogo, dy]. */
  extras: [
    [15, 3, 'postit', 'postit_1'],
    [22, 10, 'postit', 'postit_2'],
    [31, 14, 'postit', 'postit_3'],
  ],
  legend: (ch, x, y, rnd) => {
    const cold = x < 10 && y < 11;
    const base = { floor: cold ? T1.coldFloor : rnd() < 0.12 ? T1.floorAlt : T1.floor, object: 0, solid: false, above: 0 };
    switch (ch) {
      case '#': return { ...base, floor: 0, object: T1.wall, solid: true, wall: true };
      case ',': return { ...base, floor: T1.coldFloor };
      case '~': return { ...base, floor: T1.carpet };
      case '=': return { ...base, floor: T1.door };
      case 'X': return { ...base, floor: T1.door, interact: ['salida', 'salida_cerrada'] };
      case 'D': return { ...base, object: T1.desk, solid: true };
      case 'T': return { ...base, object: T1.deskPc, solid: true, interact: ['terminal', 'terminal_apagada'] };
      case 'Q': return { ...base, floor: T1.coldFloor, solid: true, interact: ['pato', 'pato_intro'] };
      case 'c': return { ...base, object: T1.chair, solid: true };
      case 'P': return { ...base, object: T1.plant, solid: true };
      case 'S': return { ...base, object: T1.rackBottom, solid: true, aboveUp: T1.rackTop };
      case '.': return base;
      default: return null;
    }
  },
  wall: T1.wall,
  wallFace: T1.wallFace,
  collision: T1.collision,
};

// ------------------------------------------------------------------------------------------------
// Acto 2 · Puerto Cero (metro, central eléctrica y antena). Mundo degradado.

const T2 = { asphalt: 1, crack: 2, sidewalk: 3, wall: 4, wallFace: 5, grass: 6, metroBottom: 7, metroTop: 8, generator: 9, antennaBottom: 10, antennaTop: 11, billboard: 12, car: 13, kiosk: 14, collision: 16 };

const ACTO2 = {
  nombre: 'acto2_ciudad',
  tileset: 'tile_acto2',
  spawn: [4, 5],
  plan: [
    '########################################',
    '#######B####B###########B######B########',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#......x.............C.......x.........#',
    '#.Q........H...........x...............#',
    '#.....x..........C.............x.......#',
    '#......................................#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,M,K,,,,,,,,,,,,,,,,,,,,,,,,,A,K,,,#',
    '#######=#######,,,,,,,,,,,#######=######',
    '#######=#######,EEE,,,,,,,#######=######',
    '#######=#######,EEE,,K,,,,#######=######',
    '#######=#######,,,,,,,,,,,#######=######',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#.........C..............x.............#',
    '#....x........................H........#',
    '#...............C......................#',
    '#..........x..........................x#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#ggg####B####gggg#####B#####ggg####B####',
    '########################################',
    '########################################',
  ],
  extras: [
    [12, 1, 'postit', 'postit_4', 6],
    [22, 20, 'postit', 'postit_5', -6],
  ],
  legend: (ch, x, y, rnd) => {
    const base = { floor: rnd() < 0.08 ? T2.crack : T2.asphalt, object: 0, solid: false, above: 0 };
    switch (ch) {
      case '#': return { ...base, floor: 0, object: T2.wall, solid: true, wall: true };
      case 'B': return { ...base, floor: 0, object: T2.billboard, solid: true };
      case ',': return { ...base, floor: T2.sidewalk };
      case '.': return base;
      case 'x': return { ...base, floor: T2.crack };
      case 'g': return { ...base, floor: T2.grass };
      case '=': return { ...base, floor: T2.sidewalk };
      case 'C': return { ...base, object: T2.car, solid: true };
      case 'M': return { ...base, floor: T2.sidewalk, object: T2.metroBottom, solid: true, aboveUp: T2.metroTop };
      case 'A': return { ...base, floor: T2.sidewalk, object: T2.antennaBottom, solid: true, aboveUp: T2.antennaTop };
      case 'E': return { ...base, floor: T2.sidewalk, object: T2.generator, solid: true };
      case 'K': return { ...base, floor: T2.sidewalk, object: T2.kiosk, solid: true, interact: ['terminal', 'terminal_apagada'] };
      case 'Q': return { ...base, solid: true, interact: ['pato', 'pato_acto2'] };
      case 'H': return { ...base, interact: ['holograma', y < 10 ? 'holograma_1' : 'holograma_2'] };
      default: return null;
    }
  },
  wall: T2.wall,
  wallFace: T2.wallFace,
  collision: T2.collision,
};

// ------------------------------------------------------------------------------------------------

function buildMap(def) {
  const { plan, legend, extras, spawn } = def;
  const WIDTH = plan[0].length;
  const HEIGHT = plan.length;
  let seed = 20261112;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const suelo = [];
  const objetos = [];
  const colision = [];
  const encima = Array(WIDTH * HEIGHT).fill(0);
  const walls = [];
  const interactables = [];
  let nextObjectId = 2;
  const prop = (name, value) => ({ name, type: 'string', value });
  const addInteractable = (tx, ty, tipo, dialogo, dy = 0) => {
    interactables.push({
      id: nextObjectId++,
      name: `${tipo}_${tx}_${ty}`,
      type: tipo,
      point: true,
      x: tx * 16 + 8,
      y: ty * 16 + 8 + dy,
      width: 0,
      height: 0,
      rotation: 0,
      visible: true,
      properties: [prop('tipo', tipo), prop('dialogo', dialogo)],
    });
  };

  for (let y = 0; y < HEIGHT; y += 1) {
    const row = plan[y];
    if (row.length !== WIDTH) throw new Error(`${def.nombre}: la fila ${y} mide ${row.length}, se esperaban ${WIDTH}`);
    for (let x = 0; x < WIDTH; x += 1) {
      const ch = row[x];
      const cell = legend(ch, x, y, rnd);
      if (!cell) throw new Error(`${def.nombre}: carácter desconocido '${ch}' en (${x}, ${y})`);
      suelo.push(cell.floor);
      objetos.push(cell.object);
      colision.push(cell.solid ? def.collision : 0);
      walls.push(cell.wall === true);
      if (cell.aboveUp && y > 0) encima[(y - 1) * WIDTH + x] = cell.aboveUp;
      if (cell.interact) addInteractable(x, y, cell.interact[0], cell.interact[1]);
    }
  }
  for (const [tx, ty, tipo, dialogo, dy] of extras) {
    if (objetos[ty * WIDTH + tx] === 0 && !walls[ty * WIDTH + tx]) throw new Error(`${def.nombre}: el extra (${tx}, ${ty}) no está sobre un objeto`);
    addInteractable(tx, ty, tipo, dialogo, dy ?? 0);
  }
  // Los muros con piso debajo muestran su cara.
  for (let y = 0; y < HEIGHT - 1; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const i = y * WIDTH + x;
      if (walls[i] && !walls[i + WIDTH]) objetos[i] = def.wallFace;
    }
  }

  const layer = (id, name, data, visible = true) => ({ id, name, type: 'tilelayer', width: WIDTH, height: HEIGHT, x: 0, y: 0, opacity: 1, visible, data });
  const objectLayer = (id, name, objects) => ({ id, name, type: 'objectgroup', visible: true, opacity: 1, x: 0, y: 0, draworder: 'topdown', objects });
  return {
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
    nextlayerid: 7,
    nextobjectid: nextObjectId,
    tilesets: [{ firstgid: 1, name: def.tileset, tilewidth: 16, tileheight: 16, tilecount: 16, columns: 8, margin: 0, spacing: 0, image: `${def.tileset}.png`, imagewidth: 128, imageheight: 32 }],
    layers: [
      layer(1, 'suelo', suelo),
      layer(2, 'objetos', objetos),
      layer(3, 'colision', colision, false),
      layer(4, 'encima', encima),
      objectLayer(5, 'spawns', [{ id: 1, name: 'player', type: 'spawn', point: true, x: spawn[0] * 16 + 8, y: spawn[1] * 16 + 16, width: 0, height: 0, rotation: 0, visible: true }]),
      objectLayer(6, 'interactables', interactables),
    ],
  };
}

mkdirSync(OUT_DIR, { recursive: true });
for (const def of [ACTO1, ACTO2]) {
  const out = resolve(OUT_DIR, `${def.nombre}.json`);
  writeFileSync(out, `${JSON.stringify(buildMap(def))}\n`);
  console.log(`Mapa escrito en ${out}`);
}
