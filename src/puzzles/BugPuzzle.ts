import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { layoutLines, type LineRow } from '../logic/puzzles/bloques';
import { INITIAL_BUG, check, isSolved, parseBugData, type BugData, type BugState } from '../logic/puzzles/bug';
import type { TicketDef } from '../logic/tickets';
import type { PuzzleArea, PuzzleView } from './PuzzleView';

const ERROR_FLASH_MS = 300;
const EXPLANATION_MS = 1600;

/** Tablero `bug`: click en la línea con el error. */
export class BugPuzzle implements PuzzleView {
  private scene!: Phaser.Scene;
  private data!: BugData;
  private state: BugState = INITIAL_BUG;
  private rows: LineRow[] = [];
  private g!: Phaser.GameObjects.Graphics;
  private texts: Phaser.GameObjects.Text[] = [];
  private note!: Phaser.GameObjects.Text;
  private flashRow: number | null = null;
  private onSolved: () => void = () => undefined;
  private readonly onDown = (p: Phaser.Input.Pointer): void => this.handleDown(p);

  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void {
    this.scene = scene;
    this.data = parseBugData(ticket.datos);
    this.state = INITIAL_BUG;
    this.rows = layoutLines(area, this.data.lineas.length);
    this.onSolved = onSolved;
    this.g = scene.add.graphics();
    this.texts = this.rows.map((r) => scene.add.text(r.x + 4, r.y + r.height / 2, '', { ...FONT, color: css(PALETTE.white) }).setOrigin(0, 0.5));
    this.note = scene.add
      .text(area.x + area.width / 2, area.y + 2, textos.puzzle.bug.instruccion, { ...FONT, color: css(PALETTE.silver), align: 'center', wordWrap: { width: area.width - 8 } })
      .setOrigin(0.5, 0);
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    this.redraw();
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    [this.g, this.note, ...this.texts].forEach((o) => o.destroy());
  }

  snapshot(): BugState {
    return this.state;
  }

  private handleDown(pointer: Phaser.Input.Pointer): void {
    if (this.state.resuelto) return;
    const row = this.rows.findIndex((r) => pointer.x >= r.x && pointer.x <= r.x + r.width && pointer.y >= r.y && pointer.y < r.y + r.height);
    if (row < 0) return;
    this.state = check(this.data, this.state, row);
    if (this.state.error) {
      audio.playSfx('puzzle_error');
      this.flashRow = row;
      this.scene.time.delayedCall(ERROR_FLASH_MS, () => {
        this.flashRow = null;
        if (this.g.active) this.redraw();
      });
      this.redraw();
      return;
    }
    audio.playSfx('click_ui');
    this.note.setText(this.data.explicacion).setColor(css(PALETTE.lime));
    this.redraw();
    if (isSolved(this.state)) {
      this.scene.time.delayedCall(EXPLANATION_MS, () => this.onSolved());
    }
  }

  private redraw(): void {
    this.g.clear();
    this.rows.forEach((r, i) => {
      const found = this.state.resuelto && i === this.data.bug;
      const fill = this.flashRow === i ? PALETTE.red : found ? PALETTE.lime : i % 2 === 0 ? PALETTE.ink : PALETTE.black;
      this.g.fillStyle(fill);
      this.g.fillRect(r.x, r.y, r.width, r.height - 1);
      this.texts[i]!.setText(`${String(i + 1).padStart(2, ' ')}  ${this.data.lineas[i]}`).setColor(css(found ? PALETTE.black : PALETTE.white));
    });
  }
}
