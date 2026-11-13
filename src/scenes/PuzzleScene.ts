import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT, drawWindow, makeButton } from '../art/ui';
import textos from '../data/textos/es.json';
import { getTicket } from '../data/tickets/index';
import { EV, type TicketDonePayload, type TicketIdPayload } from '../game/events';
import { isSinPresion, setActiveTicket } from '../game/session';
import { barColor, createDeadline, fraction, remainingSeconds, status, tick, type Deadline } from '../logic/deadline';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { formatTicketNumber, type TicketDef } from '../logic/tickets';
import { PUZZLE_BOARD_AREA, PUZZLE_WINDOW } from '../puzzles/layout';
import { createPuzzleView } from '../puzzles/registry';
import type { PuzzleView } from '../puzzles/PuzzleView';

const WIN = PUZZLE_WINDOW;
const BAR = { x: WIN.x + 8, y: WIN.y + WIN.height - 14, width: WIN.width - 72, height: 6 } as const;
const BAR_COLORS = { green: PALETTE.green, yellow: PALETTE.yellow, red: PALETTE.red } as const;
const BLINK_MS = 250;

/** P10 · Ventana de puzzle sobre el mundo oscurecido, con barra de plazo y el tablero del tipo. */
export class PuzzleScene extends Phaser.Scene {
  private ticket!: TicketDef;
  private deadline!: Deadline;
  private elapsedMs = 0;
  private finished = false;
  private view!: PuzzleView;
  private bar!: Phaser.GameObjects.Graphics;
  private timeText!: Phaser.GameObjects.Text;
  private blinkOn = true;
  private lastShownSeconds = -1;
  private hintsUsed = 0;
  private hintText!: Phaser.GameObjects.Text;

  constructor() {
    super('Puzzle');
  }

  init(data: TicketIdPayload): void {
    this.ticket = getTicket(data.ticketId);
    this.deadline = createDeadline(this.ticket.plazoSegundos, !isSinPresion(this.registry));
    this.elapsedMs = 0;
    this.finished = false;
    this.lastShownSeconds = -1;
    this.hintsUsed = 0;
  }

  create(): void {
    const dim = this.add.graphics();
    dim.fillStyle(PALETTE.black, 0.6);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawWindow(this, WIN.x, WIN.y, WIN.width, WIN.height, 'cron');
    this.add.text(WIN.x + 8, WIN.y + 5, `${formatTicketNumber(this.ticket.numero)}: ${this.ticket.titulo.toUpperCase()}`, {
      ...FONT,
      fontStyle: 'bold',
      color: css(PALETTE.cyan),
    });
    this.add
      .text(WIN.x + WIN.width - 8, WIN.y + 5, textos.puzzle.abandonar, { ...FONT, color: css(PALETTE.slate) })
      .setOrigin(1, 0);

    this.bar = this.add.graphics();
    this.add.text(BAR.x, BAR.y - 9, textos.puzzle.plazo, { ...FONT, color: css(PALETTE.silver) });
    this.timeText = this.add.text(BAR.x + BAR.width + 6, BAR.y - 2, '', { ...FONT, fontStyle: 'bold', color: css(PALETTE.white) });

    this.time.addEvent({ delay: BLINK_MS, loop: true, callback: () => (this.blinkOn = !this.blinkOn) });

    this.hintText = this.add.text(WIN.x + 8, BAR.y - 24, '', { ...FONT, color: css(PALETTE.yellow), wordWrap: { width: WIN.width - 16 } });
    makeButton(this, WIN.x + WIN.width - 8, BAR.y - 9, textos.puzzle.pista, () => this.showHint(), { key: 'H', originX: 1 });

    this.view = createPuzzleView(this.ticket.tipo);
    this.view.create(this, { ...PUZZLE_BOARD_AREA }, this.ticket, () => this.solve());

    this.input.keyboard?.on('keydown-ESC', () => this.abandon());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.view.destroy();
      setActiveTicket(this.registry, null);
    });

    this.publishRemaining();
    this.drawBar();
  }

  override update(_time: number, delta: number): void {
    if (this.finished) return;
    this.elapsedMs += delta;
    this.deadline = tick(this.deadline, delta);
    this.publishRemaining();
    this.drawBar();
    if (status(this.deadline) === 'expired') {
      this.fail();
    }
  }

  /** Solo para los tests e2e (DEV): fuerza el vencimiento. */
  expireNow(): void {
    this.deadline = { ...this.deadline, remainingMs: 0, enabled: true };
  }

  remaining(): number {
    return remainingSeconds(this.deadline);
  }

  /** Para los tests e2e. */
  snapshot(): { pistas: number; tablero: unknown } {
    return { pistas: this.hintsUsed, tablero: this.view.snapshot?.() ?? null };
  }

  private showHint(): void {
    if (this.finished) return;
    const pista = this.ticket.pistas[this.hintsUsed];
    if (pista === undefined) {
      this.hintText.setText(textos.puzzle.sinPistas);
      return;
    }
    this.hintsUsed += 1;
    this.hintText.setText(`PATO: ${pista}`);
  }

  private drawBar(): void {
    const left = fraction(this.deadline);
    const color = barColor(left);
    const visible = color !== 'red' || this.blinkOn;
    this.bar.clear();
    this.bar.fillStyle(PALETTE.ink);
    this.bar.fillRect(BAR.x, BAR.y, BAR.width, BAR.height);
    if (visible) {
      this.bar.fillStyle(BAR_COLORS[color]);
      this.bar.fillRect(BAR.x, BAR.y, Math.round(BAR.width * left), BAR.height);
    }
  }

  private publishRemaining(): void {
    const seconds = remainingSeconds(this.deadline);
    if (seconds === this.lastShownSeconds) return;
    this.lastShownSeconds = seconds;
    this.timeText.setText(this.deadline.enabled ? `${seconds} s` : textos.puzzle.sinPresion);
    setActiveTicket(this.registry, { id: this.ticket.id, numero: this.ticket.numero, remainingS: seconds });
  }

  private solve(): void {
    if (this.finished) return;
    this.finished = true;
    const payload: TicketDonePayload = { ticketId: this.ticket.id, elapsedMs: this.elapsedMs, pistas: this.hintsUsed };
    this.game.events.emit(EV.ticketDone, payload);
    this.scene.stop();
  }

  private fail(): void {
    if (this.finished) return;
    this.finished = true;
    const payload: TicketIdPayload = { ticketId: this.ticket.id };
    this.game.events.emit(EV.ticketFailed, payload);
    this.scene.stop();
  }

  private abandon(): void {
    if (this.finished) return;
    this.finished = true;
    const payload: TicketIdPayload = { ticketId: this.ticket.id };
    this.game.events.emit(EV.ticketAbandoned, payload);
    this.scene.stop();
  }
}
