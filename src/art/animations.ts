import type Phaser from 'phaser';
import type { Direction } from '../logic/movement';
import { SARADEV_KEY, type View } from './characters/saradev';

const DIRECTIONS: Direction[] = ['down', 'up', 'right', 'left'];

/** La izquierda reutiliza los cuadros de la derecha; el sprite se espeja con `flipX`. */
export function viewFor(direction: Direction): View {
  return direction === 'left' ? 'right' : direction;
}

export function saraDevAnimKey(state: 'idle' | 'walk', direction: Direction): string {
  return `saradev-${state}-${direction}`;
}

/** Registra las animaciones de SaraDev una sola vez (el AnimationManager es global). */
export function registerSaraDevAnimations(anims: Phaser.Animations.AnimationManager): void {
  for (const direction of DIRECTIONS) {
    const view = viewFor(direction);
    const frame = (name: string): Phaser.Types.Animations.AnimationFrame => ({ key: SARADEV_KEY, frame: `${view}-${name}` });

    const idle = saraDevAnimKey('idle', direction);
    if (!anims.exists(idle)) {
      anims.create({ key: idle, frames: [frame('idle-0'), frame('idle-1')], frameRate: 2, repeat: -1 });
    }

    const walk = saraDevAnimKey('walk', direction);
    if (!anims.exists(walk)) {
      anims.create({
        key: walk,
        frames: [frame('walk-0'), frame('idle-0'), frame('walk-1'), frame('idle-0')],
        frameRate: 8,
        repeat: -1,
      });
    }
  }
}
