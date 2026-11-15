import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { layoutLines, type LineRow } from '../logic/puzzles/bloques';
import { INITIAL_INDENT, cycle, isSolved, parseIndentData, render, type IndentData, type Levels } from '../logic/puzzles/indentacion';
import type { TicketDef } from '../logic/tickets';
import type { PuzzleArea, PuzzleView } from './PuzzleView';

/** Tablero `indentacion`: cada click sube la sangría de una línea de Python. */
export class IndentacionPuzzle implements PuzzleView {
  private scene!: Phaser.Scene;
  private data!: IndentData;
  private levels: Levels = [];
  private rows: LineRow[] = [];
  private g!: Phaser.GameObjects.Graphics;
  private texts: Phaser.GameObjects.Text[] = [];
  private note!: Phaser.GameObjects.Text;
  private onSolved: () => void = () => undefined;
  private readonly onDown = (p: Phaser.Input.Pointer): void => this.handleDown(p);

  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void {
    this.scene = scene;
    this.data = parseIndentData(ticket.datos);
    this.levels = INITIAL_INDENT(this.data);
    this.rows = layoutLines(area, this.data.lineas.length);
    this.onSolved = onSolved;
    this.g = scene.add.graphics();
    this.texts = this.rows.map((r) => scene.add.text(r.x + 4, r.y + r.height / 2, '', { ...FONT, color: css(PALETTE.white) }).setOrigin(0, 0.5));
    this.note = scene.add.text(area.x + area.width / 2, area.y + 2, textos.puzzle.indentacion.instruccion, { ...FONT, color: css(PALETTE.silver) }).setOrigin(0.5, 0);
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    this.redraw();
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    [this.g, this.note, ...this.texts].forEach((o) => o.destroy());
  }

  snapshot(): { levels: number[] } {
    return { levels: [...this.levels] };
  }

  private handleDown(pointer: Phaser.Input.Pointer): void {
    const row = this.rows.findIndex((r) => pointer.x >= r.x && pointer.x <= r.x + r.width && pointer.y >= r.y && pointer.y < r.y + r.height);
    if (row < 0) return;
    this.levels = cycle(this.levels, row);
    audio.playSfx('click_ui');
    this.redraw();
    if (isSolved(this.data, this.levels)) this.onSolved();
  }

  private redraw(): void {
    this.g.clear();
    this.rows.forEach((r, i) => {
      this.g.fillStyle(i % 2 === 0 ? PALETTE.ink : PALETTE.black);
      this.g.fillRect(r.x, r.y, r.width, r.height - 1);
      this.texts[i]!.setText(`${String(i + 1).padStart(2, ' ')} ${render(this.data.lineas[i]!.texto, this.levels[i]!)}`);
    });
  }
}
