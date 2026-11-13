import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT, drawWindow, formatNumber, makeButton } from '../art/ui';
import textos from '../data/textos/es.json';
import { getTicket } from '../data/tickets/index';
import { EV, type TicketIdPayload } from '../game/events';
import { wrapText } from '../logic/dialog';
import { formatTicketNumber, type TicketDef } from '../logic/tickets';

const WIN = { x: 32, y: 26, width: 256, height: 128 } as const;

/** P09 · Briefing del ticket: ventana de CRON con ACEPTAR y VOLVER. */
export class BriefingScene extends Phaser.Scene {
  private ticket!: TicketDef;
  private done = false;

  constructor() {
    super('Briefing');
  }

  init(data: TicketIdPayload): void {
    this.ticket = getTicket(data.ticketId);
    this.done = false;
  }

  create(): void {
    const t = this.ticket;
    drawWindow(this, WIN.x, WIN.y, WIN.width, WIN.height, 'cron');
    const left = WIN.x + 8;

    this.add.text(left, WIN.y + 6, `${textos.briefing.cabecera} ${formatTicketNumber(t.numero)}`, {
      ...FONT,
      fontStyle: 'bold',
      color: css(PALETTE.cyan),
    });
    this.add.text(WIN.x + WIN.width - 8, WIN.y + 6, textos.briefing.prioridad, { ...FONT, color: css(PALETTE.red) }).setOrigin(1, 0);
    this.add.text(left, WIN.y + 20, t.titulo.toUpperCase(), { ...FONT, fontStyle: 'bold', color: css(PALETTE.yellow) });
    this.add.text(left, WIN.y + 34, wrapText(t.descripcion, 58).join('\n'), { ...FONT, color: css(PALETTE.white), lineSpacing: 1 });
    this.add.text(
      left,
      WIN.y + 78,
      `${textos.briefing.plazo}: ${t.plazoSegundos} s   ${textos.briefing.conciencias}: ${formatNumber(t.conciencias)}`,
      { ...FONT, color: css(PALETTE.silver) },
    );

    const buttonsY = WIN.y + WIN.height - 16;
    makeButton(this, WIN.x + WIN.width / 2 - 44, buttonsY, textos.briefing.aceptar, () => this.finish(EV.briefingAccept), { key: 'ENTER' });
    makeButton(this, WIN.x + WIN.width / 2 + 44, buttonsY, textos.briefing.volver, () => this.finish(EV.briefingBack), { key: 'ESC' });
  }

  private finish(event: string): void {
    if (this.done) return;
    this.done = true;
    const payload: TicketIdPayload = { ticketId: this.ticket.id };
    this.game.events.emit(event, payload);
    this.scene.stop();
  }
}
