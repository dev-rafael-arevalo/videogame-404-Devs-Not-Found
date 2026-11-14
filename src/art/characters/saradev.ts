import type Phaser from 'phaser';
import { PALETTE } from '../palette';
import { createPixelSheet, type CharPalette, type PixelFrame, type PixelRows } from '../pixelTexture';

/**
 * SaraDev (spec 013): chibi de 24×24 compuesta por piezas (cabeza por vista, cara por expresión,
 * torso por pose y piernas por fase). Todo es puro hasta `createSaraDevSheet`, que lo vuelca a una
 * textura de Phaser. La izquierda es la derecha espejada (`flipX`).
 */
export const SARADEV_KEY = 'spr_saradev';
export const SARADEV_SIZE = 24;

export type View = 'down' | 'up' | 'right';

export const EXPRESSIONS = [
  'normal',
  'cansada',
  'feliz',
  'sorprendida',
  'panico',
  'enojada',
  'determinada',
  'celebracion',
] as const;
export type Expression = (typeof EXPRESSIONS)[number];
/** Caras internas que no son "expresiones" del personaje pero sí cuadros (golpe). */
type Face = Expression | 'dolor';

export const ACTIONS = ['jump', 'interact', 'type', 'panic', 'hurt', 'attack', 'victory'] as const;
export type Action = (typeof ACTIONS)[number];

export interface AnimationSpec {
  frames: string[];
  frameRate: number;
  /** -1 = loop; 0 = una vez. */
  repeat: number;
}

export const SARADEV_PALETTE: CharPalette = {
  o: PALETTE.black, // contorno
  h: PALETTE.ink, // pelo
  H: PALETTE.slate, // brillo del pelo
  s: PALETTE.yellow, // piel
  S: PALETTE.orange, // sombra de la piel
  w: PALETTE.white, // brillo de ojos, dientes
  e: PALETTE.black, // pupilas
  m: PALETTE.red, // boca
  N: PALETTE.silver, // audífonos al cuello y laptop
  B: PALETTE.red, // sudadera roja (referencia del usuario)
  b: PALETTE.purple, // sombra de la sudadera y bolsillo
  c: PALETTE.yellow, // cordones y ribete amarillo de la capucha
  p: PALETTE.blue, // jeans
  W: PALETTE.red, // botas rojas
  L: PALETTE.terminal, // pantalla de la laptop
};

// ---------------------------------------------------------------------------------------------
// Cabezas (14×11). La cara frontal ocupa las filas 5, 6, 7 y 8 (cejas, ojos ×2, boca).

const HEAD_TOP: PixelRows = ['....hoooo.....', '...oohhhhoo...', '..ohhHhhhhhho.', '.ohhhhhhhhhhho', 'ohhsssssssshho'];
const HEAD_BOTTOM: PixelRows = ['..osssssssso..', '...oSSSSSSo...'];

/** Filas 5–8 de la cara frontal por expresión: cejas/flequillo, ojos (2 filas) y boca. */
const FACES: Record<Face, PixelRows> = {
  normal: ['ohssssssssssho', 'ossweesssweeso', 'osseesssseesso', '.ossssmmssssso'],
  cansada: ['ohssssssssssho', 'osssssssssssso', 'ossoosssoossso', '.ossssmmssssso'],
  feliz: ['ohssssssssssho', 'osseesssseesso', 'osssssssssssso', '.ossmmmmmmssso'],
  sorprendida: ['ohswesssswesho', 'ossweesssweeso', 'osseesssseesso', '.osssssoosssso'],
  panico: ['ohswesssswesho', 'ossweesssweeso', 'ossooesssooeso', '.ossommmmossso'],
  enojada: ['ohsosssssssoho', 'ossseesssseeso', 'osssssssssssso', '.osssmmmmmssso'],
  determinada: ['ohssossssossho', 'ossweesssweeso', 'osseesssseesso', '.ossssssmmmsso'],
  celebracion: ['ohssssssssssho', 'osseessssseeso', 'osssssssssssso', '.osmwwwwwwmsso'],
  dolor: ['ohssssssssssho', 'ossesessesesso', 'osssesssssesso', '.osssmsmsmssso'],
};

const HEAD_RIGHT: PixelRows = [
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
];

const HEAD_UP: PixelRows = [
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
];

function frontHead(face: Face): PixelRows {
  return [...HEAD_TOP, ...FACES[face], ...HEAD_BOTTOM];
}

// ---------------------------------------------------------------------------------------------
// Torsos (14×8): filas 11–18.

type Pose = 'normal' | 'reach' | 'typeA' | 'typeB' | 'up' | 'swing' | 'hold';

const BODY_DOWN: Record<Pose, PixelRows> = {
  normal: ['..oNssssssNo..', '.oBBBBBBBBBBo.', 'oBBBBcBBcBBBBo', 'oBBBBcBBcBBBBo', 'oBBBBBBBBBBBBo', 'oBBBBbbbbBBBBo', '.oBBBbbbbBBBo.', '..oBBBBBBBBo..'],
  /** Brazo derecho extendido (interactuar). */
  reach: ['..oNssssssNo..', '.oBBBBBBBBBBo.', 'oBBBBcBBcBBBBo', 'oBBBBcBBcBBBBo', 'oBBBBBBBBBBBso', 'oBBBBbbbbBBBBo', '.oBBBbbbbBBBo.', '..oBBBBBBBBo..'],
  /** Tecleando en la laptop, manos adentro. */
  typeA: ['..oNssssssNo..', '.oBBBBBBBBBBo.', 'oBBBBcBBcBBBBo', 'oBBBBcBBcBBBBo', 'oBBBBsBBsBBBBo', 'oBoNNNLLLNNoBo', '.oNNNNNNNNNNo.', '..oBBBBBBBBo..'],
  /** Tecleando, manos afuera. */
  typeB: ['..oNssssssNo..', '.oBBBBBBBBBBo.', 'oBBBBcBBcBBBBo', 'oBBBBcBBcBBBBo', 'oBBBsBBBBsBBBo', 'oBoNNNLLLNNoBo', '.oNNNNNNNNNNo.', '..oBBBBBBBBo..'],
  /** Brazos arriba (victoria). */
  up: ['osoNssssssNoso', 'oBoBBBBBBBBoBo', 'oBBBBcBBcBBBBo', 'oBBBBcBBcBBBBo', 'oBBBBBBBBBBBBo', 'oBBBBbbbbBBBBo', '.oBBBbbbbBBBo.', '..oBBBBBBBBo..'],
  /** Laptop hacia adelante (golpe). */
  swing: ['..oNssssssNo..', '.oBBBBBBBBBBo.', 'oBBBBcBBcBBBBo', 'oBBBBBBBBBBNNN', 'oBBBBBBBBBsLLN', 'oBBBBbbbbBBNNN', '.oBBBbbbbBBBo.', '..oBBBBBBBBo..'],
  /** Laptop al costado (preparando el golpe). */
  hold: ['..oNssssssNo..', '.oBBBBBBBBBBo.', 'oBBBBcBBcBBBBo', 'oBBBBcBBcBBBBo', 'NNoBBBBBBBBBBo', 'NLoBbbbbbBBBBo', 'NNoBBbbbbBBBo.', '..oBBBBBBBBo..'],
};

const BODY_RIGHT: PixelRows = ['....oNsssNo...', '...oBBBBBBo...', '..oBBBBBBBBo..', '..oBBBBBBBBo..', '..oBBBBBBBBo..', '..oBBBBbbBBo..', '..oBBBBBBBBo..', '...oBBBBBBo...'];
const BODY_UP: PixelRows = ['..oNhhhhhhNo..', '.oBBccccccBBo.', 'oBBcbbbbbbcBBo', 'oBBBbbbbbbBBBo', 'oBBBBBBBBBBBBo', 'oBBBBBBBBBBBBo', '.oBBBBBBBBBBo.', '..oBBBBBBBBo..'];

// ---------------------------------------------------------------------------------------------
// Piernas (14×5): filas 19–23.

const LEGS_FRONT = {
  stand: ['..oppo..oppo..', '..oppo..oppo..', '..oppo..oppo..', '.oWWWo..oWWWo.', '.ooooo..ooooo.'],
  stepLeft: ['..oppo..oppo..', '..oppo..oppo..', '.oWWWo..oppo..', '.ooooo..oWWWo.', '........ooooo.'],
  stepRight: ['..oppo..oppo..', '..oppo..oppo..', '..oppo..oWWWo.', '.oWWWo..ooooo.', '.ooooo........'],
  /** Piernas recogidas (salto). */
  tuck: ['..oppo..oppo..', '.oWWWo..oWWWo.', '.ooooo..ooooo.', '..............', '..............'],
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

// ---------------------------------------------------------------------------------------------
// Composición.

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
      const gx = ox + x;
      const ch = row.charAt(x);
      if (ch !== '.' && gx >= 0 && gx < SARADEV_SIZE) line[gx] = ch;
    }
  });
}

interface ComposeOptions {
  head: PixelRows;
  body: PixelRows;
  legs: PixelRows;
  /** Baja la cabeza (respiración, agacharse). */
  headDy?: number;
  /** Desplaza todo (salto, temblor). */
  dx?: number;
  dy?: number;
}

function compose({ head, body, legs, headDy = 0, dx = 0, dy = 0 }: ComposeOptions): PixelRows {
  const grid = Array.from({ length: SARADEV_SIZE }, () => Array<string>(SARADEV_SIZE).fill('.'));
  stamp(grid, legs, PART_X + dx, LEGS_Y + dy);
  stamp(grid, body, PART_X + dx, BODY_Y + dy);
  stamp(grid, head, PART_X + dx, HEAD_Y + dy + headDy);
  return grid.map((line) => line.join(''));
}

const VIEWS: View[] = ['down', 'up', 'right'];

function viewHead(view: View, face: Face = 'normal'): PixelRows {
  return view === 'down' ? frontHead(face) : view === 'up' ? HEAD_UP : HEAD_RIGHT;
}

function viewBody(view: View): PixelRows {
  return view === 'down' ? BODY_DOWN.normal : view === 'up' ? BODY_UP : BODY_RIGHT;
}

/** Todos los cuadros de la hoja. Puro: se testea con Vitest. */
export function buildSaraDevFrames(): PixelFrame[] {
  const frames: PixelFrame[] = [];
  const add = (name: string, rows: PixelRows): void => {
    frames.push({ name, rows });
  };
  const front = (face: Face, body: PixelRows, legs: PixelRows = LEGS_FRONT.stand, extra: Partial<ComposeOptions> = {}): PixelRows =>
    compose({ head: frontHead(face), body, legs, ...extra });

  // idle de frente, una pareja por expresión (respiración: la cabeza baja 1 px).
  for (const expression of EXPRESSIONS) {
    add(`down-idle-${expression}-0`, front(expression, BODY_DOWN.normal));
    add(`down-idle-${expression}-1`, front(expression, BODY_DOWN.normal, LEGS_FRONT.stand, { headDy: 1 }));
  }
  for (const view of VIEWS) {
    if (view !== 'down') {
      add(`${view}-idle-0`, compose({ head: viewHead(view), body: viewBody(view), legs: LEGS[view].stand }));
      add(`${view}-idle-1`, compose({ head: viewHead(view), body: viewBody(view), legs: LEGS[view].stand, headDy: 1 }));
    }
    add(`${view}-walk-0`, compose({ head: viewHead(view), body: viewBody(view), legs: LEGS[view].step1 }));
    add(`${view}-walk-1`, compose({ head: viewHead(view), body: viewBody(view), legs: LEGS[view].step2 }));
  }

  add('down-jump-0', front('determinada', BODY_DOWN.normal, LEGS_FRONT.stand, { headDy: 1 }));
  add('down-jump-1', front('feliz', BODY_DOWN.up, LEGS_FRONT.tuck, { dy: -1 }));
  add('down-interact-0', front('determinada', BODY_DOWN.reach));
  add('down-interact-1', front('normal', BODY_DOWN.normal));
  add('down-type-0', front('determinada', BODY_DOWN.typeA));
  add('down-type-1', front('determinada', BODY_DOWN.typeB));
  add('down-panic-0', front('panico', BODY_DOWN.up, LEGS_FRONT.stand, { dx: -1 }));
  add('down-panic-1', front('panico', BODY_DOWN.up, LEGS_FRONT.stand, { dx: 1 }));
  add('down-hurt-0', front('dolor', BODY_DOWN.normal, LEGS_FRONT.stand, { dx: 1, headDy: 1 }));
  add('down-hurt-1', front('dolor', BODY_DOWN.normal, LEGS_FRONT.stand, { dx: -1 }));
  add('down-attack-0', front('enojada', BODY_DOWN.hold));
  add('down-attack-1', front('enojada', BODY_DOWN.swing, LEGS_FRONT.stand, { dx: 1 }));
  add('down-attack-2', front('determinada', BODY_DOWN.normal));
  add('down-victory-0', front('celebracion', BODY_DOWN.up));
  add('down-victory-1', front('celebracion', BODY_DOWN.up, LEGS_FRONT.tuck, { dy: -1 }));
  add('down-victory-2', front('feliz', BODY_DOWN.normal));
  return frames;
}

export type Direction = 'down' | 'up' | 'right' | 'left';
const DIRECTIONS: Direction[] = ['down', 'up', 'right', 'left'];

/** La izquierda reutiliza los cuadros de la derecha; el sprite se espeja con `flipX`. */
export function viewFor(direction: Direction): View {
  return direction === 'left' ? 'right' : direction;
}

export function idleKey(direction: Direction, expression: Expression): string {
  return `saradev-idle-${direction}-${expression}`;
}

export function moveKey(state: 'walk' | 'run', direction: Direction): string {
  return `saradev-${state}-${direction}`;
}

export function actionKey(action: Action): string {
  return `saradev-${action}`;
}

/** Configuración de todas las animaciones (clave → cuadros y velocidad). Pura. */
export function saraDevAnimations(): Record<string, AnimationSpec> {
  const anims: Record<string, AnimationSpec> = {};
  for (const direction of DIRECTIONS) {
    const view = viewFor(direction);
    for (const expression of EXPRESSIONS) {
      // Arriba y de lado no se ve la cara: todas las expresiones comparten cuadros.
      const idle = view === 'down' ? [`down-idle-${expression}-0`, `down-idle-${expression}-1`] : [`${view}-idle-0`, `${view}-idle-1`];
      anims[idleKey(direction, expression)] = { frames: idle, frameRate: 2, repeat: -1 };
    }
    const stand = view === 'down' ? 'down-idle-normal-0' : `${view}-idle-0`;
    anims[moveKey('walk', direction)] = { frames: [`${view}-walk-0`, stand, `${view}-walk-1`, stand], frameRate: 8, repeat: -1 };
    anims[moveKey('run', direction)] = { frames: [`${view}-walk-0`, `${view}-walk-1`], frameRate: 12, repeat: -1 };
  }
  anims[actionKey('jump')] = { frames: ['down-jump-0', 'down-jump-1', 'down-jump-1', 'down-jump-0'], frameRate: 8, repeat: 0 };
  anims[actionKey('interact')] = { frames: ['down-interact-0', 'down-interact-0', 'down-interact-1'], frameRate: 6, repeat: 0 };
  anims[actionKey('type')] = { frames: ['down-type-0', 'down-type-1'], frameRate: 8, repeat: -1 };
  anims[actionKey('panic')] = { frames: ['down-panic-0', 'down-panic-1'], frameRate: 10, repeat: -1 };
  anims[actionKey('hurt')] = { frames: ['down-hurt-0', 'down-hurt-1', 'down-hurt-0', 'down-hurt-1'], frameRate: 8, repeat: 0 };
  anims[actionKey('attack')] = { frames: ['down-attack-0', 'down-attack-1', 'down-attack-2'], frameRate: 8, repeat: 0 };
  anims[actionKey('victory')] = { frames: ['down-victory-0', 'down-victory-1', 'down-victory-0', 'down-victory-1', 'down-victory-2'], frameRate: 5, repeat: 0 };
  return anims;
}

/** Cabeza frontal con la expresión dada y el cuello de la sudadera (14×13), base del retrato. */
export function saraDevPortraitRows(expression: Expression = 'normal'): PixelRows {
  return [...frontHead(expression), ...BODY_DOWN.normal.slice(0, 2)];
}

/** Genera la hoja `spr_saradev`. */
export function createSaraDevSheet(scene: Phaser.Scene): void {
  createPixelSheet(scene, SARADEV_KEY, buildSaraDevFrames(), SARADEV_SIZE, SARADEV_SIZE, SARADEV_PALETTE, 8);
}
