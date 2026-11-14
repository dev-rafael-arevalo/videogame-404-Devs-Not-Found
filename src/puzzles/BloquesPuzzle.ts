import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { INITIAL_BLOQUES, click, isSolved, layoutLines, parseBloquesData, type BloquesData, type BloquesState, type LineRow } from '../logic/puzzles/bloques';
import type { TicketDef } from '../logic/tickets';
import type { PuzzleArea, PuzzleView } from './PuzzleView';

/** Tablero `bloques`: líneas de código que se intercambian de a pares. */
export class BloquesPuzzle implements PuzzleView {
  private scene!: Phaser.Scene;
  private data!: BloquesData;
  private state!: BloquesState;
  private rows: LineRow[] = [];
  private g!: Phaser.GameObjects.Graphics;
  private texts: Phaser.GameObjects.Text[] = [];
  private extra: Phaser.GameObjects.Text[] = [];
  private onSolved: () => void = () => undefined;
  private readonly onDown = (p: Phaser.Input.Pointer): void => this.handleDown(p);

  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void {
    this.scene = scene;
    this.data = parseBloquesData(ticket.datos);
    this.state = INITIAL_BLOQUES(this.data);
    this.rows = layoutLines(area, this.data.lineas.length);
    this.onSolved = onSolved;
    this.g = scene.add.graphics();
    this.texts = this.rows.map((r) => scene.add.text(r.x + 4, r.y + r.height / 2, '', { ...FONT, color: css(PALETTE.white) }).setOrigin(0, 0.5));
    this.extra = [scene.add.text(area.x + area.width / 2, area.y + 2, textos.puzzle.bloques.instruccion, { ...FONT, color: css(PALETTE.silver) }).setOrigin(0.5, 0)];
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    this.redraw();
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    [this.g, ...this.texts, ...this.extra].forEach((o) => o.destroy());
  }

  snapshot(): BloquesState {
    return this.state;
  }

  private handleDown(pointer: Phaser.Input.Pointer): void {
    const row = this.rows.findIndex((r) => pointer.x >= r.x && pointer.x <= r.x + r.width && pointer.y >= r.y && pointer.y < r.y + r.height);
    if (row < 0) return;
    this.state = click(this.state, row);
    audio.playSfx('click_ui');
    this.redraw();
    if (isSolved(this.state)) this.onSolved();
  }

  private redraw(): void {
    this.g.clear();
    this.rows.forEach((r, i) => {
      const selected = this.state.selected === i;
      this.g.fillStyle(selected ? PALETTE.yellow : i % 2 === 0 ? PALETTE.ink : PALETTE.black, selected ? 0.9 : 1);
      this.g.fillRect(r.x, r.y, r.width, r.height - 1);
      const text = this.texts[i]!;
      text.setText(`${String(i + 1).padStart(2, ' ')}  ${this.data.lineas[this.state.order[i]!]}`);
      text.setColor(css(selected ? PALETTE.black : PALETTE.white));
    });
  }
}
