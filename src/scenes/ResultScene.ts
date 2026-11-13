import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT, drawWindow, formatNumber, makeButton } from '../art/ui';
import textos from '../data/textos/es.json';
import { getTicket } from '../data/tickets/index';
import { EV } from '../game/events';
import { formatTicketNumber } from '../logic/tickets';

export interface ResultData {
  ticketId: string;
  elapsedMs: number;
  ganadas: number;
  uptime: number;
}

const WIN = { x: 64, y: 40, width: 192, height: 100 } as const;

/** P12 · Resultado: ticket cerrado, tiempo, conciencias y uptime. */
export class ResultScene extends Phaser.Scene {
  private result!: ResultData;
  private done = false;

  constructor() {
    super('Result');
  }

  init(data: ResultData): void {
    this.result = data;
    this.done = false;
  }

  /** Para los tests e2e. */
  snapshot(): ResultData {
    return this.result;
  }

  create(): void {
    const ticket = getTicket(this.result.ticketId);
    drawWindow(this, WIN.x, WIN.y, WIN.width, WIN.height, 'exito');
    const cx = WIN.x + WIN.width / 2;
    this.add
      .text(cx, WIN.y + 10, `${textos.resultado.titulo} ${formatTicketNumber(ticket.numero)}`, {
        ...FONT,
        fontStyle: 'bold',
        color: css(PALETTE.lime),
      })
      .setOrigin(0.5, 0);
    const lines = [
      `${textos.resultado.tiempo}: ${Math.round(this.result.elapsedMs / 1000)} s`,
      `${textos.resultado.conciencias}: +${formatNumber(this.result.ganadas)}`,
      `${textos.resultado.uptime}: ${this.result.uptime}%`,
    ];
    this.add.text(cx, WIN.y + 30, lines.join('\n'), { ...FONT, color: css(PALETTE.white), align: 'center', lineSpacing: 3 }).setOrigin(0.5, 0);
    makeButton(this, cx, WIN.y + WIN.height - 14, textos.resultado.continuar, () => this.close(), { key: 'ENTER' });
    this.input.keyboard?.on('keydown-SPACE', () => this.close());
  }

  private close(): void {
    if (this.done) return;
    this.done = true;
    this.game.events.emit(EV.resultClosed);
    this.scene.stop();
  }
}
