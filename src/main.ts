import Phaser from 'phaser';
import './style.css';
import { audio } from './audio/AudioManager';
import { gameConfig } from './config';
import { installDebugApi } from './debug';
import { GAME_HEIGHT, GAME_WIDTH, integerZoom } from './logic/scale';

function currentZoom(): number {
  return integerZoom(window.innerWidth, window.innerHeight, GAME_WIDTH, GAME_HEIGHT);
}

const game = new Phaser.Game({
  ...gameConfig,
  scale: { ...gameConfig.scale, zoom: currentZoom() },
});

// Phaser no recalcula el zoom en modo NONE: lo hacemos nosotros para que siempre sea entero.
window.addEventListener('resize', () => {
  const zoom = currentZoom();
  if (zoom !== game.scale.zoom) {
    game.scale.setZoom(zoom);
  }
});

game.events.once(Phaser.Core.Events.READY, () => {
  document.documentElement.dataset.gameReady = 'true';
});

// Los navegadores bloquean el audio hasta la primera interacción: se desbloquea con ella.
const unlockAudio = (): void => audio.unlock();
window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);

installDebugApi(game);
