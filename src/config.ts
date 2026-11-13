import Phaser from 'phaser';
import { PALETTE } from './art/palette';
import { GAME_HEIGHT, GAME_WIDTH } from './logic/scale';
import { BootScene } from './scenes/BootScene';
import { DialogScene } from './scenes/DialogScene';
import { TitleScene } from './scenes/TitleScene';
import { WorldScene } from './scenes/WorldScene';

/**
 * Configuración base de Phaser (spec 001). 320×180 pixel-perfect: `pixelArt: true` desactiva el
 * antialiasing y activa `roundPixels`. El zoom se fija como entero desde `main.ts`
 * (`Scale.NONE` + `integerZoom`), porque `Scale.FIT` produce zoom fraccionario.
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: PALETTE.black,
  pixelArt: true,
  banner: false,
  disableContextMenu: true,
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 1,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  scene: [BootScene, TitleScene, WorldScene, DialogScene],
};
