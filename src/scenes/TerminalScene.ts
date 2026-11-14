import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT, makeButton } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { getTicket } from '../data/tickets/index';
import { EV, type TicketDonePayload, type TicketIdPayload } from '../game/events';
import { isSinPresion, setActiveTicket } from '../game/session';
import { barColor, createDeadline, fraction, remainingSeconds, status, tick, type Deadline } from '../logic/deadline';
import { wrapText } from '../logic/dialog';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { formatTicketNumber, type TicketDef } from '../logic/tickets';
import { EMPTY_HISTORY, complete, navigate, push, type History } from '../terminal/history';
import { checkObjective } from '../terminal/objective';
import { MAX_LINE_LENGTH } from '../terminal/parser';
import { runLine } from '../terminal/registry';
import { createTerminalState, parseTerminalData, type TerminalData, type TerminalState } from '../terminal/state';
import { shortPath } from '../terminal/vfs';

const COLUMNS = 62;
const VISIBLE_LINES = 13;
/** Alto real de una línea de 8 px monoespaciada en Phaser (9 px) más 1 de separación. */
const LINE_HEIGHT = 10;
const OUTPUT_Y = 18;
const INPUT_Y = OUTPUT_Y + VISIBLE_LINES * LINE_HEIGHT + 4;
const MAX_BUFFER = 300;
const BAR = { x: 4, y: 13, width: GAME_WIDTH - 8, height: 2 } as const;
const BAR_COLORS = { green: PALETTE.terminal, yellow: PALETTE.yellow, red: PALETTE.red } as const;
const SOLVED_DELAY_MS = 900;

export interface TerminalSnapshot {
  lineas: string[];
  entrada: string;
  cwd: string;
  objetivo: boolean;
}

/**
 * P11 · Terminal simulada (spec 009). Pantalla CRT verde: salida, prompt y plazo. Nada se ejecuta
 * de verdad: cada línea pasa por `runLine` (lógica pura). La salida se pinta como texto del canvas.
 */
export class TerminalScene extends Phaser.Scene {
  private ticket!: TicketDef;
  private terminalData!: TerminalData;
  private state!: TerminalState;
  private history: History = EMPTY_HISTORY;
  private buffer: string[] = [];
  private entry = '';
  private deadline!: Deadline;
  private elapsedMs = 0;
  private finished = false;
  private hintsUsed = 0;
  private lastShownSeconds = -1;
  private alarmed = false;
  private blinkOn = true;
  private readonly seenEvents = new WeakSet<KeyboardEvent>();
  private outputText!: Phaser.GameObjects.Text;
  private entryText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private bar!: Phaser.GameObjects.Graphics;

  constructor() {
    super('Terminal');
  }

  init(data: TicketIdPayload): void {
    this.ticket = getTicket(data.ticketId);
    this.terminalData = parseTerminalData(this.ticket.datos);
    this.state = createTerminalState(this.terminalData);
    this.history = EMPTY_HISTORY;
    this.buffer = [textos.terminal.bienvenida, ''];
    this.entry = '';
    this.deadline = createDeadline(this.ticket.plazoSegundos, !isSinPresion(this.registry));
    this.elapsedMs = 0;
    this.finished = false;
    this.hintsUsed = 0;
    this.lastShownSeconds = -1;
    this.alarmed = false;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(css(PALETTE.black));
    audio.playMusic('terminal');

    const mono = { ...FONT, color: css(PALETTE.terminal) };
    this.add.text(4, 3, `${textos.terminal.cabecera}  ${formatTicketNumber(this.ticket.numero)}  ${this.ticket.titulo}`, { ...FONT, color: css(PALETTE.slate) });
    this.timeText = this.add.text(GAME_WIDTH - 4, 3, '', { ...FONT, fontStyle: 'bold', color: css(PALETTE.white) }).setOrigin(1, 0);
    this.bar = this.add.graphics();

    this.outputText = this.add.text(4, OUTPUT_Y, '', { ...mono, lineSpacing: LINE_HEIGHT - 9 });
    this.entryText = this.add.text(4, INPUT_Y, '', { ...mono, fontStyle: 'bold' });

    // Pie: pista de PATO (botón, sin tecla: la H se usa para escribir) y Esc.
    this.hintText = this.add.text(4, GAME_HEIGHT - 11, '', { ...FONT, color: css(PALETTE.yellow), wordWrap: { width: 200 } });
    makeButton(this, GAME_WIDTH - 4, GAME_HEIGHT - 8, textos.terminal.pista, () => this.showHint(), { originX: 1 });
    this.add.text(GAME_WIDTH - 92, GAME_HEIGHT - 8, textos.terminal.abandonar, { ...FONT, color: css(PALETTE.slate) }).setOrigin(1, 0.5);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('No hay teclado disponible');
    keyboard.addCapture(['TAB', 'UP', 'DOWN', 'SPACE', 'BACKSPACE']);
    keyboard.on('keydown', this.onKey, this);
    this.time.addEvent({ delay: 400, loop: true, callback: () => (this.blinkOn = !this.blinkOn) });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      keyboard.off('keydown', this.onKey, this);
      setActiveTicket(this.registry, null);
    });

    this.publishRemaining();
    this.render();
  }

  override update(_time: number, delta: number): void {
    this.renderInput();
    if (this.finished) return;
    this.elapsedMs += delta;
    this.deadline = tick(this.deadline, delta);
    this.publishRemaining();
    this.drawBar();
    const current = status(this.deadline);
    if (current === 'warning' && !this.alarmed) {
      this.alarmed = true;
      audio.playSfx('alarma_plazo');
    }
    if (current === 'expired') this.fail();
  }

  snapshot(): TerminalSnapshot {
    return {
      lineas: this.buffer.slice(-40),
      entrada: this.entry,
      cwd: this.state.vfs.cwd,
      objetivo: checkObjective(this.state, this.terminalData.objetivo),
    };
  }

  /** Para los tests e2e (DEV). */
  expireNow(): void {
    this.deadline = { ...this.deadline, remainingMs: 0, enabled: true };
  }

  private prompt(): string {
    const venv = this.state.venvActive ? '(.venv) ' : '';
    return `${venv}${textos.terminal.usuario}:${shortPath(this.state.vfs.cwd)}$ `;
  }

  private onKey(event: KeyboardEvent): void {
    if (this.finished) return;
    // Phaser puede reprocesar la misma cola de eventos dentro de un cuadro (tecleo rápido):
    // cada evento del DOM se atiende una sola vez.
    if (this.seenEvents.has(event)) return;
    this.seenEvents.add(event);
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    switch (event.key) {
      case 'Enter':
        this.submit();
        break;
      case 'Backspace':
        this.entry = this.entry.slice(0, -1);
        break;
      case 'Tab': {
        event.preventDefault();
        const result = complete(this.entry, this.state, this.terminalData.comandosPermitidos);
        this.entry = result.line;
        if (result.options.length > 1) this.append([this.prompt() + this.entry, result.options.join('  ')]);
        break;
      }
      case 'ArrowUp':
      case 'ArrowDown': {
        const nav = navigate(this.history, this.entry, event.key === 'ArrowUp' ? 'up' : 'down');
        this.history = nav.history;
        this.entry = nav.line;
        break;
      }
      case 'Escape':
        this.abandon();
        break;
      default:
        if (event.key.length === 1 && this.entry.length < MAX_LINE_LENGTH) {
          this.entry += event.key;
          audio.playSfx('tecla');
        }
    }
  }

  private submit(): void {
    const line = this.entry;
    this.append([this.prompt() + line]);
    this.history = push(this.history, line);
    this.entry = '';
    const result = runLine(this.state, line, this.terminalData.comandosPermitidos);
    this.state = result.state;
    if (result.clear) this.buffer = [];
    this.append(result.output);
    const failed = result.output[0]?.startsWith('comando no encontrado') || result.output[0]?.startsWith('CRON:');
    audio.playSfx(failed ? 'comando_error' : 'comando_ok');
    this.render();
    if (checkObjective(this.state, this.terminalData.objetivo)) this.solve();
  }

  private append(lines: string[]): void {
    for (const line of lines) this.buffer.push(...(line.length > COLUMNS ? wrapText(line, COLUMNS) : [line]));
    if (this.buffer.length > MAX_BUFFER) this.buffer = this.buffer.slice(-MAX_BUFFER);
    this.render();
  }

  private render(): void {
    this.outputText.setText(this.buffer.slice(-VISIBLE_LINES).join('\n'));
    this.renderInput();
  }

  private renderInput(): void {
    const cursor = this.finished ? '' : this.blinkOn ? '█' : ' ';
    this.entryText.setText(`${this.prompt()}${this.entry}${cursor}`);
  }

  private drawBar(): void {
    const left = fraction(this.deadline);
    const color = barColor(left);
    this.bar.clear();
    this.bar.fillStyle(PALETTE.ink);
    this.bar.fillRect(BAR.x, BAR.y, BAR.width, BAR.height);
    if (color !== 'red' || this.blinkOn) {
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

  private solve(): void {
    if (this.finished) return;
    this.finished = true;
    this.append(['', textos.terminal.objetivoCumplido]);
    audio.playSfx('puzzle_ok');
    this.time.delayedCall(SOLVED_DELAY_MS, () => {
      const payload: TicketDonePayload = { ticketId: this.ticket.id, elapsedMs: this.elapsedMs, pistas: this.hintsUsed };
      this.game.events.emit(EV.ticketDone, payload);
      this.scene.stop();
    });
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
