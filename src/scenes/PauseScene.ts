import Phaser from 'phaser';
import { onKeyOnce } from '../art/keys';
import { createMenu, type MenuController } from '../art/menu';
import { PALETTE, css } from '../art/palette';
import { FONT, drawWindow } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { EV } from '../game/events';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';

const WIN = { x: 96, y: 50, width: 128, height: 80 } as const;

/** P13 · Pausa (overlay sobre el mundo pausado): Continuar, Opciones, Guardar y salir. */
export class PauseScene extends Phaser.Scene {
  private menu!: MenuController;
  private overlay = false;

  constructor() {
    super('Pause');
  }

  create(): void {
    this.overlay = false;
    audio.setDucked(true);
    const dim = this.add.graphics();
    dim.fillStyle(PALETTE.black, 0.5);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawWindow(this, WIN.x, WIN.y, WIN.width, WIN.height, 'cron');
    this.add.text(WIN.x + WIN.width / 2, WIN.y + 8, textos.pausa.titulo, { ...FONT, fontStyle: 'bold', color: css(PALETTE.cyan) }).setOrigin(0.5, 0);

    this.menu = createMenu(
      this,
      [
        { label: textos.pausa.continuar, onSelect: () => this.resume() },
        { label: textos.pausa.opciones, onSelect: () => this.openOptions() },
        { label: textos.pausa.salir, onSelect: () => this.quit() },
      ],
      { x: WIN.x + 20, y: WIN.y + 26, step: 14, isActive: () => !this.overlay },
    );
    onKeyOnce(this.input.keyboard, 'ESC', () => this.resume(), () => !this.overlay);
    const onClosed = (key: string): void => {
      if (key === 'Options') this.overlay = false;
    };
    this.game.events.on(EV.overlayClosed, onClosed);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(EV.overlayClosed, onClosed);
      this.menu.destroy();
      audio.setDucked(false);
    });
  }

  private openOptions(): void {
    if (this.overlay) return;
    this.overlay = true;
    this.scene.launch('Options');
  }

  private resume(): void {
    if (this.overlay) return;
    this.scene.resume('World');
    this.game.events.emit(EV.overlayClosed, 'Pause');
    this.scene.stop();
  }

  private quit(): void {
    if (this.overlay) return;
    // El progreso ya se guardó al cerrar cada ticket.
    audio.stopMusic();
    this.scene.stop('Hud');
    this.scene.stop('World');
    this.scene.stop();
    this.scene.start('Title');
  }
}
