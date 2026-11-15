import Phaser from 'phaser';
import { PALETTE } from './art/palette';
import { GAME_HEIGHT, GAME_WIDTH } from './logic/scale';
import { BootScene } from './scenes/BootScene';
import { BriefingScene } from './scenes/BriefingScene';
import { DemoScene } from './scenes/DemoScene';
import { DialogScene } from './scenes/DialogScene';
import { EndScene } from './scenes/EndScene';
import { IntroScene } from './scenes/IntroScene';
import { MenuScene } from './scenes/MenuScene';
import { OptionsScene } from './scenes/OptionsScene';
import { PauseScene } from './scenes/PauseScene';
import { HudScene } from './scenes/HudScene';
import { PuzzleScene } from './scenes/PuzzleScene';
import { ResultScene } from './scenes/ResultScene';
import { RollbackScene } from './scenes/RollbackScene';
import { TerminalScene } from './scenes/TerminalScene';
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
  // El audio lo maneja src/audio/AudioManager.ts (motor chiptune propio), no el de Phaser.
  audio: { noAudio: true },
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 1,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  // El orden define quién se dibuja encima: el HUD sobre el mundo, las ventanas sobre el HUD.
  scene: [
    BootScene,
    TitleScene,
    MenuScene,
    IntroScene,
    WorldScene,
    HudScene,
    BriefingScene,
    PuzzleScene,
    ResultScene,
    RollbackScene,
    TerminalScene,
    DialogScene,
    PauseScene,
    OptionsScene,
    EndScene,
    DemoScene,
  ],
};
