import Phaser from 'phaser';
import './style.css';
import { installCursor } from './art/ui';
import { audio } from './audio/AudioManager';
import { gameConfig } from './config';
import { installDebugApi } from './debug';
import { applyGameOptions, loadGameOptions } from './game/options';
import { REG } from './game/session';
import { zoomFor, type ScaleMode } from './logic/scale';

let scaleMode: ScaleMode = loadGameOptions().escalado;

function currentZoom(): number {
  return zoomFor(scaleMode, window.innerWidth, window.innerHeight);
}

const game = new Phaser.Game({
  ...gameConfig,
  scale: { ...gameConfig.scale, zoom: currentZoom() },
});

// Phaser no recalcula el zoom en modo NONE: lo hacemos nosotros (entero, o ajustado si la opción lo pide).
function applyZoom(): void {
  const zoom = currentZoom();
  if (zoom !== game.scale.zoom) {
    game.scale.setZoom(zoom);
  }
}
window.addEventListener('resize', applyZoom);
const onScaleOption = (_parent: unknown, key: string, value: unknown): void => {
  if (key === REG.escalado && (value === 'entero' || value === 'ajustar')) {
    scaleMode = value;
    applyZoom();
  }
};
game.registry.events.on(Phaser.Data.Events.CHANGE_DATA, onScaleOption);
game.registry.events.on(Phaser.Data.Events.SET_DATA, onScaleOption);

game.events.once(Phaser.Core.Events.READY, () => {
  document.documentElement.dataset.gameReady = 'true';
  installCursor(game);
  applyGameOptions(game.registry, loadGameOptions());
  // `/?demo` abre la escena de demostración del arte (spec 013) en vez del juego.
  if (new URLSearchParams(window.location.search).has('demo')) {
    game.scene.stop('Boot');
    game.scene.start('Demo');
  }
});

// Los navegadores bloquean el audio hasta la primera interacción: se desbloquea con ella.
const unlockAudio = (): void => audio.unlock();
window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);

installDebugApi(game);
