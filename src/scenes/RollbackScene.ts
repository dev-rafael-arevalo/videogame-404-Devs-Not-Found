import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT, drawWindow, makeButton } from '../art/ui';
import { SynthwaveBackground } from '../art/backgrounds';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { EV, type TicketIdPayload } from '../game/events';
import { wrapText } from '../logic/dialog';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';

const WIN = { x: 48, y: 36, width: 224, height: 108 } as const;

/** P14 · Rollback: plazo vencido, El Recolector barre el sector. Reintentar o volver al mundo. */
export class RollbackScene extends Phaser.Scene {
  private ticketId = '';
  private done = false;
  private background!: SynthwaveBackground;

  constructor() {
    super('Rollback');
  }

  init(data: TicketIdPayload): void {
    this.ticketId = data.ticketId;
    this.done = false;
  }

  create(): void {
    this.background = new SynthwaveBackground(this, { tono: 'rojo', velocidad: 1.2 });
    this.background.glitch(this.time.now, 900);
    this.time.addEvent({ delay: 1500, loop: true, callback: () => this.background.glitch(this.time.now, 250) });

    audio.playMusic('jingle_rollback', { next: 'acto1_oficina' });
    // Glitch: el mundo se sacude y esta capa destella en rojo.
    this.scene.get('World').cameras.main.shake(400, 0.01);
    this.cameras.main.flash(300, 0xb1, 0x3e, 0x53);

    drawWindow(this, WIN.x, WIN.y, WIN.width, WIN.height, 'alerta');
    const cx = WIN.x + WIN.width / 2;
    this.add
      .text(cx, WIN.y + 10, textos.rollback.titulo, { ...FONT, fontStyle: 'bold', color: css(PALETTE.red) })
      .setOrigin(0.5, 0);
    this.add
      .text(cx, WIN.y + 28, wrapText(textos.rollback.mensaje, 50).join('\n'), {
        ...FONT,
        color: css(PALETTE.white),
        align: 'center',
        lineSpacing: 2,
      })
      .setOrigin(0.5, 0);

    const buttonsY = WIN.y + WIN.height - 14;
    makeButton(this, cx - 48, buttonsY, textos.rollback.reintentar, () => this.finish(EV.rollbackRetry), { key: 'ENTER' });
    makeButton(this, cx + 48, buttonsY, textos.rollback.volver, () => this.finish(EV.rollbackBack), { key: 'ESC' });
  }

  override update(time: number, delta: number): void {
    this.background.update(time, delta);
  }

  private finish(event: string): void {
    if (this.done) return;
    this.done = true;
    const payload: TicketIdPayload = { ticketId: this.ticketId };
    this.game.events.emit(event, payload);
    this.scene.stop();
  }
}
