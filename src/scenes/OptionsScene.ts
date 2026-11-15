import Phaser from 'phaser';
import { onKeyOnce } from '../art/keys';
import { createMenu, type MenuController, type MenuItem } from '../art/menu';
import { PALETTE, css } from '../art/palette';
import { FONT, drawWindow } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { EV } from '../game/events';
import { applyGameOptions, loadGameOptions, saveGameOptions } from '../game/options';
import type { GameOptions } from '../logic/gameOptions';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';

const WIN = { x: 56, y: 30, width: 208, height: 116 } as const;
const STEP = 0.1;

/** P04 · Opciones (overlay): volúmenes, modo sin presión y pantalla completa. Esc vuelve. */
export class OptionsScene extends Phaser.Scene {
  private menu!: MenuController;
  private options!: GameOptions;

  constructor() {
    super('Options');
  }

  create(): void {
    this.closed = false;
    this.options = loadGameOptions();
    const dim = this.add.graphics();
    dim.fillStyle(PALETTE.black, 0.6);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawWindow(this, WIN.x, WIN.y, WIN.width, WIN.height, 'pato');
    this.add.text(WIN.x + WIN.width / 2, WIN.y + 8, textos.opciones.titulo, { ...FONT, fontStyle: 'bold', color: css(PALETTE.yellow) }).setOrigin(0.5, 0);
    this.add.text(WIN.x + WIN.width / 2, WIN.y + WIN.height - 12, textos.opciones.ayuda, { ...FONT, color: css(PALETTE.slate) }).setOrigin(0.5, 0);

    this.menu = createMenu(this, this.items(), { x: WIN.x + 16, y: WIN.y + 26, step: 14, width: WIN.width - 32 });
    onKeyOnce(this.input.keyboard, 'ESC', () => this.close());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.menu.destroy());
  }

  private items(): MenuItem[] {
    const { musica, sfx } = audio.getOptions();
    const percent = (v: number): string => `${Math.round(v * 100)}%`;
    const bump = (value: number, delta: number): number => Math.min(1, Math.max(0, Math.round((value + delta) * 10) / 10));
    return [
      {
        label: textos.opciones.musica,
        value: percent(musica),
        onLeft: () => this.setMusic(bump(musica, -STEP)),
        onRight: () => this.setMusic(bump(musica, STEP)),
      },
      {
        label: textos.opciones.efectos,
        value: percent(sfx),
        onLeft: () => this.setSfx(bump(sfx, -STEP)),
        onRight: () => this.setSfx(bump(sfx, STEP)),
      },
      {
        label: textos.opciones.sinPresion,
        value: this.options.sinPresion ? textos.opciones.si : textos.opciones.no,
        onLeft: () => this.toggleSinPresion(),
        onRight: () => this.toggleSinPresion(),
        onSelect: () => this.toggleSinPresion(),
      },
      {
        label: textos.opciones.escalado,
        value: this.options.escalado === 'ajustar' ? textos.opciones.ajustar : textos.opciones.entero,
        onLeft: () => this.toggleEscalado(),
        onRight: () => this.toggleEscalado(),
        onSelect: () => this.toggleEscalado(),
      },
      {
        label: textos.opciones.pantallaCompleta,
        value: this.scale.isFullscreen ? textos.opciones.si : textos.opciones.no,
        onLeft: () => this.toggleFullscreen(),
        onRight: () => this.toggleFullscreen(),
        onSelect: () => this.toggleFullscreen(),
      },
      { label: textos.opciones.volver, onSelect: () => this.close() },
    ];
  }

  private refresh(): void {
    this.menu.setItems(this.items());
  }

  private setMusic(value: number): void {
    audio.setMusicVolume(value);
    this.refresh();
  }

  private setSfx(value: number): void {
    audio.setSfxVolume(value);
    this.refresh();
  }

  private toggleSinPresion(): void {
    this.options = { ...this.options, sinPresion: !this.options.sinPresion };
    saveGameOptions(this.options);
    applyGameOptions(this.registry, this.options);
    this.refresh();
  }

  private toggleEscalado(): void {
    this.options = { ...this.options, escalado: this.options.escalado === 'ajustar' ? 'entero' : 'ajustar' };
    saveGameOptions(this.options);
    applyGameOptions(this.registry, this.options);
    this.refresh();
  }

  private toggleFullscreen(): void {
    if (this.scale.isFullscreen) this.scale.stopFullscreen();
    else this.scale.startFullscreen();
    this.time.delayedCall(100, () => this.refresh());
  }

  private closed = false;

  private close(): void {
    if (this.closed) return;
    this.closed = true;
    this.game.events.emit(EV.overlayClosed, 'Options');
    this.scene.stop();
  }
}
