import Phaser from 'phaser';
import { audio } from '../audio/AudioManager';
import { PALETTE, css } from './palette';

/** Kit de UI mínimo (spec 004): ventana y botón. La spec 013 lo reemplaza por el 9-slice definitivo. */
export type WindowStyle = 'cron' | 'pato' | 'alerta' | 'exito';

const BORDER: Record<WindowStyle, number> = {
  cron: PALETTE.cyan,
  pato: PALETTE.yellow,
  alerta: PALETTE.red,
  exito: PALETTE.lime,
};

export const FONT = { fontFamily: 'monospace', fontSize: '8px' } as const;

/** Ventana con sombra sólida de 2 px abajo a la derecha, fondo negro y borde de 1 px según el estilo. */
export function drawWindow(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  style: WindowStyle,
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(PALETTE.ink);
  g.fillRect(x + 2, y + 2, width, height);
  g.fillStyle(PALETTE.black);
  g.fillRect(x, y, width, height);
  g.lineStyle(1, BORDER[style]);
  g.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
  return g;
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
