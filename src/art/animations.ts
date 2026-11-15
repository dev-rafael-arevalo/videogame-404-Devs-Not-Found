import type Phaser from 'phaser';
import { SARADEV_KEY, saraDevAnimations, type AnimationSpec } from './characters/saradev';

export { actionKey, idleKey, moveKey, viewFor } from './characters/saradev';

/**
 * Registra una configuración de animaciones en el AnimationManager de Phaser (global), una sola
 * vez por clave. Phaser las avanza con el delta del motor: no hay un segundo game loop.
 */
export function registerAnimations(
  anims: Phaser.Animations.AnimationManager,
  textureKey: string,
  specs: Record<string, AnimationSpec>,
): void {
  for (const [key, spec] of Object.entries(specs)) {
    if (anims.exists(key)) continue;
    anims.create({
      key,
      frames: spec.frames.map((frame) => ({ key: textureKey, frame })),
      frameRate: spec.frameRate,
      repeat: spec.repeat,
    });
  }
}

export function registerSaraDevAnimations(anims: Phaser.Animations.AnimationManager): void {
  registerAnimations(anims, SARADEV_KEY, saraDevAnimations());
}
