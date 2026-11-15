import Phaser from 'phaser';
import { SynthwaveBackground } from '../art/backgrounds';
import { onKeyOnce } from '../art/keys';
import { createMenu, type MenuController } from '../art/menu';
import { PALETTE, css } from '../art/palette';
import { FONT } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { EV } from '../game/events';
import { clearSave, loadSave } from '../game/save';
import { REG } from '../game/session';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { markScene } from './markScene';

export interface MenuSnapshot {
  indice: number;
  overlay: boolean;
}

/** P03 · Menú principal: Nueva partida, Continuar, Opciones y Créditos. */
export class MenuScene extends Phaser.Scene {
  private background!: SynthwaveBackground;
  private menu!: MenuController;
  private overlay = false;

  constructor() {
    super('Menu');
  }

  create(): void {
    markScene(this);
    this.overlay = false;
    audio.playMusic('titulo');
    this.background = new SynthwaveBackground(this, { tono: 'neon' });

    this.add
      .text(GAME_WIDTH / 2, 28, textos.titulo.nombre, { fontFamily: 'monospace', fontSize: '16px', fontStyle: 'bold', color: css(PALETTE.white), stroke: css(PALETTE.black), strokeThickness: 3 })
      .setOrigin(0.5);

    const saved = loadSave();
    this.menu = createMenu(
      this,
      [
        { label: textos.menu.nueva, onSelect: () => this.newGame() },
        { label: textos.menu.continuar, disabled: saved === null, onSelect: () => this.continueGame() },
        { label: textos.menu.opciones, onSelect: () => this.openOverlay('Options') },
        { label: textos.menu.creditos, onSelect: () => this.scene.start('End', { soloCreditos: true }) },
      ],
      { x: GAME_WIDTH / 2, y: 70, step: 16, align: 'center', isActive: () => !this.overlay },
    );
    if (saved) {
      this.add
        .text(GAME_WIDTH / 2, 140, textos.titulo.guardado.replace('{acto}', String(saved.acto)), { ...FONT, color: css(PALETTE.cyan) })
        .setOrigin(0.5);
    }
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 10, textos.menu.ayuda, { ...FONT, color: css(PALETTE.slate) }).setOrigin(0.5);

    onKeyOnce(this.input.keyboard, 'ESC', () => this.scene.start('Title'), () => !this.overlay);
    const onClosed = (): void => {
      this.overlay = false;
    };
    this.game.events.on(EV.overlayClosed, onClosed);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(EV.overlayClosed, onClosed);
      this.menu.destroy();
    });
  }

  override update(time: number, delta: number): void {
    this.background.update(time, delta);
  }

  snapshot(): MenuSnapshot {
    return { indice: this.menu.index, overlay: this.overlay };
  }

  private openOverlay(key: string): void {
    if (this.overlay) return;
    this.overlay = true;
    this.scene.launch(key);
  }

  private newGame(): void {
    if (this.overlay) return;
    clearSave();
    this.registry.remove(REG.progress);
    this.registry.remove(REG.acto);
    this.scene.start('Intro');
  }

  private continueGame(): void {
    if (this.overlay) return;
    const saved = loadSave();
    this.scene.start('World', { acto: saved?.acto ?? 1 });
  }
}
