import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { audio } from '../audio/AudioManager';
import { PORTRAITS_KEY, PORTRAIT_SIZE, createPortraits, portraitFor } from '../art/portraits';
import textos from '../data/textos/es.json';
import { INITIAL_CURSOR, confirm, paginate, visibleChars, wrapText, type DialogCursor } from '../logic/dialog';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';

export const DIALOG_CLOSED_EVENT = 'dialog:closed';

const BOX_HEIGHT = 48;
const BOX_Y = GAME_HEIGHT - BOX_HEIGHT;
const PADDING = 8;
const TEXT_X = PADDING + PORTRAIT_SIZE + PADDING;
const MAX_CHARS = 50;
const LINES_PER_PAGE = 3;
const CHARS_PER_SECOND = 40;
const BLINK_MS = 400;

type DialogId = keyof typeof textos.dialogos;
type SpeakerId = keyof typeof textos.nombres;

interface DialogLine {
  quien: string;
  texto: string;
  /** Expresión del retrato de SaraDev (spec 013). */
  expresion?: string;
}

export interface DialogSnapshot {
  id: string;
  quien: string;
  linea: number;
  pagina: number;
  revelado: boolean;
  texto: string;
}

interface DialogData {
  dialogo: string;
}

/** P08 · Diálogo: caja inferior con retrato, nombre y texto con efecto máquina de escribir. */
export class DialogScene extends Phaser.Scene {
  private dialogId = '';
  private lines: DialogLine[] = [];
  private pages: string[][] = [];
  private cursor: DialogCursor = INITIAL_CURSOR;
  private elapsed = 0;
  private portrait!: Phaser.GameObjects.Image;
  private nameText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private moreIndicator!: Phaser.GameObjects.Text;

  constructor() {
    super('Dialog');
  }

  init(data: DialogData): void {
    this.dialogId = data.dialogo;
    const lines = (textos.dialogos as Record<string, DialogLine[] | undefined>)[data.dialogo];
    this.lines = lines ?? [{ quien: 'cron', texto: `[diálogo desconocido: ${data.dialogo}]` }];
    this.pages = this.lines.map((line) => paginate(wrapText(line.texto, MAX_CHARS), LINES_PER_PAGE));
    this.cursor = INITIAL_CURSOR;
    this.elapsed = 0;
  }

  create(): void {
    createPortraits(this);

    const box = this.add.graphics();
    box.fillStyle(PALETTE.black);
    box.fillRect(0, BOX_Y, GAME_WIDTH, BOX_HEIGHT);
    box.lineStyle(1, PALETTE.white);
    box.strokeRect(1.5, BOX_Y + 1.5, GAME_WIDTH - 3, BOX_HEIGHT - 3);
    box.fillStyle(PALETTE.ink);
    box.fillRect(PADDING - 1, BOX_Y + PADDING - 1, PORTRAIT_SIZE + 2, PORTRAIT_SIZE + 2);

    this.portrait = this.add.image(PADDING, BOX_Y + PADDING, PORTRAITS_KEY, 'saradev-normal').setOrigin(0, 0);
    this.nameText = this.add.text(TEXT_X, BOX_Y + 5, '', {
      fontFamily: 'monospace',
      fontSize: '8px',
      fontStyle: 'bold',
      color: css(PALETTE.yellow),
    });
    this.bodyText = this.add.text(TEXT_X, BOX_Y + 15, '', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: css(PALETTE.white),
      lineSpacing: 1,
    });
    this.moreIndicator = this.add
      .text(GAME_WIDTH - PADDING, GAME_HEIGHT - 4, textos.ui.continuar, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: css(PALETTE.slate),
      })
      .setOrigin(1, 1)
      .setVisible(false);
    this.time.addEvent({
      delay: BLINK_MS,
      loop: true,
      callback: () => this.moreIndicator.setVisible(this.cursor.revealed && !this.moreIndicator.visible),
    });

    // Eventos y no `JustDown`: un toque corto (keydown y keyup en el mismo cuadro) también cuenta.
    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('No hay teclado disponible');
    for (const key of ['E', 'SPACE', 'ENTER']) {
      keyboard.on(`keydown-${key}`, this.onConfirm, this);
    }
    this.input.on('pointerdown', this.onConfirm, this);

    this.showCurrentPage();
  }

  override update(_time: number, delta: number): void {
    if (this.cursor.revealed) return;
    this.elapsed += delta;
    const page = this.currentPage();
    const shown = visibleChars(this.elapsed, CHARS_PER_SECOND, page.length);
    if (shown !== this.bodyText.text.length && shown % 2 === 0 && page.charAt(shown - 1) !== ' ') {
      audio.playSfx('dialogo_letra');
    }
    this.bodyText.setText(page.slice(0, shown));
    if (shown >= page.length) {
      this.cursor = { ...this.cursor, revealed: true };
    }
  }

  /** Para los tests e2e (`window.__debug.dialog()`). */
  snapshot(): DialogSnapshot {
    return {
      id: this.dialogId,
      quien: this.lines[this.cursor.line]?.quien ?? '',
      linea: this.cursor.line,
      pagina: this.cursor.page,
      revelado: this.cursor.revealed,
      texto: this.bodyText.text,
    };
  }

  private currentPage(): string {
    return this.pages[this.cursor.line]?.[this.cursor.page] ?? '';
  }

  private onConfirm(): void {
    if (this.cursor.closed) return;
    this.cursor = confirm(this.cursor, this.pages.map((p) => p.length));
    if (this.cursor.closed) {
      this.game.events.emit(DIALOG_CLOSED_EVENT, this.dialogId);
      this.scene.stop();
      return;
    }
    if (this.cursor.revealed) {
      this.bodyText.setText(this.currentPage());
    } else {
      this.elapsed = 0;
      this.showCurrentPage();
    }
  }

  private showCurrentPage(): void {
    const line = this.lines[this.cursor.line];
    const speaker = (line?.quien ?? 'cron') as SpeakerId;
    this.nameText.setText(textos.nombres[speaker] ?? speaker);
    this.portrait.setFrame(portraitFor(speaker, line?.expresion));
    this.bodyText.setText('');
    this.moreIndicator.setVisible(false);
  }
}

export type { DialogId };
