import Phaser from 'phaser';
import { audio } from '../audio/AudioManager';
import { claimKeyEvent } from './keys';
import { PALETTE, css } from './palette';
import { FONT } from './ui';

/** Lista vertical con cursor (spec 011): ↑/↓ y Enter, hover y click. Opcionalmente ←/→ por ítem. */
export interface MenuItem {
  label: string;
  onSelect?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  /** Texto a la derecha (valor de una opción). */
  value?: string;
  disabled?: boolean;
}

export interface MenuLayout {
  x: number;
  y: number;
  /** Separación vertical entre ítems. */
  step?: number;
  /** Ancho para alinear los valores a la derecha. */
  width?: number;
  align?: 'left' | 'center';
  /** Si devuelve `false`, el menú ignora el teclado (por ejemplo, con un overlay abierto). */
  isActive?: () => boolean;
}

export interface MenuController {
  index: number;
  setItems(items: MenuItem[]): void;
  destroy(): void;
}

export function createMenu(scene: Phaser.Scene, initial: MenuItem[], layout: MenuLayout): MenuController {
  const step = layout.step ?? 14;
  const width = layout.width ?? 160;
  const align = layout.align ?? 'left';
  let items = initial;
  let index = Math.max(0, items.findIndex((i) => !i.disabled));
  const labels: Phaser.GameObjects.Text[] = [];
  const values: Phaser.GameObjects.Text[] = [];
  const cursor = scene.add.text(0, 0, '>', { ...FONT, fontStyle: 'bold', color: css(PALETTE.yellow) }).setOrigin(1, 0);

  const refresh = (): void => {
    items.forEach((item, i) => {
      const active = i === index;
      const label = labels[i]!;
      label.setText(item.label).setColor(css(item.disabled ? PALETTE.slate : active ? PALETTE.yellow : PALETTE.white));
      const value = values[i]!;
      const text = item.value ?? '';
      value.setText(active && item.onLeft ? `< ${text} >` : text).setColor(css(active ? PALETTE.yellow : PALETTE.silver));
    });
    const current = labels[index];
    if (current) cursor.setPosition(current.x - (align === 'center' ? current.width / 2 : 0) - 4, current.y);
  };

  const build = (): void => {
    labels.forEach((l) => l.destroy());
    values.forEach((v) => v.destroy());
    labels.length = 0;
    values.length = 0;
    items.forEach((item, i) => {
      const y = layout.y + i * step;
      const label = scene.add
        .text(layout.x, y, item.label, { ...FONT, fontStyle: 'bold' })
        .setOrigin(align === 'center' ? 0.5 : 0, 0)
        .setInteractive({ useHandCursor: !item.disabled });
      label.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        if (!item.disabled) {
          index = i;
          refresh();
        }
      });
      label.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        if (!item.disabled) {
          index = i;
          select();
        }
      });
      labels.push(label);
      values.push(scene.add.text(layout.x + width, y, '', FONT).setOrigin(1, 0));
    });
    refresh();
  };

  const move = (delta: number): void => {
    if (items.length === 0) return;
    let next = index;
    for (let i = 0; i < items.length; i += 1) {
      next = (next + delta + items.length) % items.length;
      if (!items[next]!.disabled) break;
    }
    index = next;
    audio.playSfx('hover_ui');
    refresh();
  };

  const select = (): void => {
    const item = items[index];
    if (!item || item.disabled || !item.onSelect) return;
    audio.playSfx('click_ui');
    item.onSelect();
  };

  const side = (direction: 'left' | 'right'): void => {
    const item = items[index];
    const handler = direction === 'left' ? item?.onLeft : item?.onRight;
    if (!handler) return;
    audio.playSfx('click_ui');
    handler();
    refresh();
  };

  // Un evento del DOM, una acción (ver `art/keys.ts`): ni reprocesos de la cola ni dos escenas.
  const once =
    (fn: () => void) =>
    (event: KeyboardEvent): void => {
      if (!(layout.isActive?.() ?? true)) return;
      if (claimKeyEvent(event)) fn();
    };
  const keyboard = scene.input.keyboard;
  const handlers: [string, (event: KeyboardEvent) => void][] = [
    ['keydown-UP', once(() => move(-1))],
    ['keydown-DOWN', once(() => move(1))],
    ['keydown-W', once(() => move(-1))],
    ['keydown-S', once(() => move(1))],
    ['keydown-LEFT', once(() => side('left'))],
    ['keydown-RIGHT', once(() => side('right'))],
    ['keydown-ENTER', once(select)],
    ['keydown-SPACE', once(select)],
  ];
  for (const [event, handler] of handlers) keyboard?.on(event, handler);

  build();

  return {
    get index() {
      return index;
    },
    setItems(next: MenuItem[]) {
      items = next;
      if (items.length !== labels.length) build();
      else refresh();
    },
    destroy() {
      for (const [event, handler] of handlers) keyboard?.off(event, handler);
      labels.forEach((l) => l.destroy());
      values.forEach((v) => v.destroy());
      cursor.destroy();
    },
  };
}
