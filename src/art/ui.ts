import Phaser from 'phaser';
import { audio } from '../audio/AudioManager';
import { PALETTE, css } from './palette';
import { createPixelTexture, scaleRows, type CharPalette, type PixelRows } from './pixelTexture';

/** Kit de UI (specs 004 y 013): ventanas 9-slice, botón, íconos y cursor, todo generado por código. */
export type WindowStyle = 'cron' | 'pato' | 'alerta' | 'exito';

const BORDER: Record<WindowStyle, number> = {
  cron: PALETTE.cyan,
  pato: PALETTE.yellow,
  alerta: PALETTE.red,
  exito: PALETTE.lime,
};

export const FONT = { fontFamily: 'monospace', fontSize: '8px' } as const;

const WINDOW_SIZE = 16;
const CORNER = 5;

/** Textura 16×16 de la ventana: borde de 1 px con "ménsulas" en las esquinas, fondo negro. */
const WINDOW_ROWS: PixelRows = [
  'cccccccccccccccc',
  'ckkkkkkkkkkkkkkc',
  'ckcckkkkkkkkcckc',
  'ckckkkkkkkkkkckc',
  'ckkkkkkkkkkkkkkc',
  'ckkkkkkkkkkkkkkc',
  'ckkkkkkkkkkkkkkc',
  'ckkkkkkkkkkkkkkc',
  'ckkkkkkkkkkkkkkc',
  'ckkkkkkkkkkkkkkc',
  'ckkkkkkkkkkkkkkc',
  'ckkkkkkkkkkkkkkc',
  'ckckkkkkkkkkkckc',
  'ckcckkkkkkkkcckc',
  'ckkkkkkkkkkkkkkc',
  'cccccccccccccccc',
];
const SHADOW_ROWS: PixelRows = WINDOW_ROWS.map((r) => r.replace(/[ck]/g, 'k'));

export function windowTextureKey(style: WindowStyle): string {
  return `ui_window_${style}`;
}

/** Crea las texturas de las 4 ventanas y la sombra (idempotente). */
export function createUiTextures(scene: Phaser.Scene): void {
  for (const style of Object.keys(BORDER) as WindowStyle[]) {
    createPixelTexture(scene, windowTextureKey(style), WINDOW_ROWS, { c: BORDER[style], k: PALETTE.black });
  }
  createPixelTexture(scene, 'ui_window_shadow', SHADOW_ROWS, { k: PALETTE.ink });
  for (const [name, rows] of Object.entries(ICONS)) {
    createPixelTexture(scene, `ui_icon_${name}`, rows, ICON_PALETTE);
  }
}

/** Ventana 9-slice con sombra sólida de 2 px abajo a la derecha. Devuelve la ventana (la sombra queda debajo). */
export function drawWindow(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  style: WindowStyle,
): Phaser.GameObjects.NineSlice {
  createUiTextures(scene);
  scene.add.nineslice(x + 2, y + 2, 'ui_window_shadow', undefined, width, height, CORNER, CORNER, CORNER, CORNER).setOrigin(0, 0);
  return scene.add
    .nineslice(x, y, windowTextureKey(style), undefined, width, height, CORNER, CORNER, CORNER, CORNER)
    .setOrigin(0, 0);
}

export interface ButtonOptions {
  /** Tecla que también activa el botón (nombre de `keydown-X`). */
  key?: string;
  originX?: number;
}

/** Botón de texto con fondo, hover y click. Devuelve el `Text` por si hay que moverlo o destruirlo. */
export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onPress: () => void,
  options: ButtonOptions = {},
): Phaser.GameObjects.Text {
  const idle = { backgroundColor: css(PALETTE.ink), color: css(PALETTE.white) };
  const hover = { backgroundColor: css(PALETTE.yellow), color: css(PALETTE.black) };
  const text = scene.add
    .text(x, y, label, { ...FONT, fontStyle: 'bold', padding: { x: 4, y: 2 }, ...idle })
    .setOrigin(options.originX ?? 0.5, 0.5)
    .setInteractive({ useHandCursor: true });
  text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => text.setStyle(hover));
  text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => text.setStyle(idle));
  const press = (): void => {
    audio.playSfx('click_ui');
    onPress();
  };
  text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, press);
  if (options.key) {
    scene.input.keyboard?.on(`keydown-${options.key}`, press);
  }
  return text;
}

/** Miles con punto (es-AR): 1200 → "1.200". */
export function formatNumber(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ---------------------------------------------------------------------------------------------
// Íconos del HUD (8×8).

const ICON_PALETTE: CharPalette = {
  o: PALETTE.black,
  g: PALETTE.green,
  y: PALETTE.yellow,
  w: PALETTE.white,
  c: PALETTE.cyan,
  l: PALETTE.slate,
};

export const ICONS: Record<'uptime' | 'conciencias' | 'ticket' | 'reloj', PixelRows> = {
  /** Latido: el sistema está vivo. */
  uptime: ['........', '...g....', '...gg...', 'g..g.g..', 'gg.g.g.g', '.ggg.ggg', '......g.', '........'],
  /** Carita: una conciencia. */
  conciencias: ['.oooooo.', 'oyyyyyyo', 'oyoyyoyo', 'oyyyyyyo', 'oyoyyoyo', 'oyyooyyo', 'oyyyyyyo', '.oooooo.'],
  /** Ticket: papel con renglones. */
  ticket: ['ooooooo.', 'owwwwwoo', 'owllwwwo', 'owwwwwwo', 'owlllwwo', 'owwwwwwo', 'owllwwwo', 'oooooooo'],
  /** Reloj. */
  reloj: ['.oooooo.', 'owwwwwwo', 'owwcwwwo', 'owwcwwwo', 'owwcccwo', 'owwwwwwo', 'owwwwwwo', '.oooooo.'],
};

// ---------------------------------------------------------------------------------------------
// Cursor pixel art (8×8 ampliado ×3 para que se vea a escala).

const CURSOR_ROWS: PixelRows = ['o.......', 'oo......', 'owo.....', 'owwo....', 'owwwo...', 'owwwwo..', 'owoooo..', 'oo......'];

/** Instala el cursor propio en el canvas vía `data:` URL (la CSP permite `img-src data:`). */
export function installCursor(game: Phaser.Game): void {
  const rows = scaleRows(CURSOR_ROWS, 3);
  const canvas = document.createElement('canvas');
  canvas.width = rows[0]!.length;
  canvas.height = rows.length;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === '.') return;
      ctx.fillStyle = css(ch === 'o' ? PALETTE.black : PALETTE.white);
      ctx.fillRect(x, y, 1, 1);
    });
  });
  game.input.setDefaultCursor(`url(${canvas.toDataURL()}) 0 0, auto`);
}
