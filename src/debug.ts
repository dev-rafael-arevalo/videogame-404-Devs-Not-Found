import type Phaser from 'phaser';
import type { DialogScene, DialogSnapshot } from './scenes/DialogScene';
import type { WorldScene } from './scenes/WorldScene';

export interface PlayerSnapshot {
  x: number;
  y: number;
  facing: string;
  anim: string | null;
}

export interface DebugApi {
  game: Phaser.Game;
  /** Posición y animación de SaraDev, o `null` si el mundo no está activo. */
  player(): PlayerSnapshot | null;
  /** Estado del diálogo abierto, o `null` si no hay ninguno. */
  dialog(): DialogSnapshot | null;
  /** Si el aviso "[E] usar" está visible. */
  prompt(): boolean;
}

declare global {
  interface Window {
    __debug?: DebugApi;
  }
}

/**
 * Expone `window.__debug` para los tests e2e. Solo se instala en desarrollo (`import.meta.env.DEV`):
 * el build de producción no lo incluye.
 */
export function installDebugApi(game: Phaser.Game): void {
  if (!import.meta.env.DEV) return;
  window.__debug = {
    game,
    player() {
      const world = game.scene.getScene('World') as WorldScene | null;
      if (!world || !game.scene.isActive('World')) return null;
      const player = world.player;
      return {
        x: player.x,
        y: player.y,
        facing: player.facing,
        anim: player.anims.currentAnim?.key ?? null,
      };
    },
    dialog() {
      if (!game.scene.isActive('Dialog')) return null;
      return (game.scene.getScene('Dialog') as DialogScene).snapshot();
    },
    prompt() {
      const world = game.scene.getScene('World') as WorldScene | null;
      return game.scene.isActive('World') && world !== null && world.isPromptVisible();
    },
  };
}
