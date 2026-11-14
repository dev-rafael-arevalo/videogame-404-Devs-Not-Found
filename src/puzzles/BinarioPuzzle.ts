import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { bitValue, isSolved, layoutSwitches, parseBinarioData, toggle, valueOf, type BinarioData, type Switches } from '../logic/puzzles/binario';
import type { Point } from '../logic/puzzles/cables';
import type { TicketDef } from '../logic/tickets';
import type { PuzzleArea, PuzzleView } from './PuzzleView';

const SWITCH_W = 14;
const SWITCH_H = 22;
const HIT_RADIUS = 12;

/** Tablero `binario`: interruptores que suman un número. */
export class BinarioPuzzle implements PuzzleView {
  private scene!: Phaser.Scene;
  private data!: BinarioData;
  private switches: Switches = [];
  private points: Point[] = [];
  private g!: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];
  private valueText!: Phaser.GameObjects.Text;
  private onSolved: () => void = () => undefined;
  private readonly onDown = (p: Phaser.Input.Pointer): void => this.handleDown(p);

  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void {
    this.scene = scene;
    this.data = parseBinarioData(ticket.datos);
    this.switches = Array<boolean>(this.data.bits).fill(false);
    this.points = layoutSwitches(area, this.data.bits);
    this.onSolved = onSolved;
    this.g = scene.add.graphics();
    const small = { ...FONT, color: css(PALETTE.silver) };
    this.labels = this.points.map((p, i) => scene.add.text(p.x, p.y - SWITCH_H / 2 - 4, String(bitValue(this.data.bits, i)), small).setOrigin(0.5, 1));
    this.labels.push(
      scene.add
        .text(area.x + area.width / 2, area.y + 4, textos.puzzle.binario.instruccion, { ...FONT, color: css(PALETTE.silver) })
        .setOrigin(0.5, 0),
    );
    this.valueText = scene.add
      .text(area.x + area.width / 2, area.y + area.height - 6, '', { ...FONT, fontStyle: 'bold', color: css(PALETTE.white) })
      .setOrigin(0.5, 1);
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    this.redraw();
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    [this.g, this.valueText, ...this.labels].forEach((o) => o.destroy());
  }

  snapshot(): { switches: boolean[]; valor: number } {
    return { switches: [...this.switches], valor: valueOf(this.switches) };
  }

  private handleDown(pointer: Phaser.Input.Pointer): void {
    const index = this.points.findIndex((p) => Math.abs(p.x - pointer.x) <= HIT_RADIUS && Math.abs(p.y - pointer.y) <= SWITCH_H / 2 + 2);
    if (index < 0) return;
    this.switches = toggle(this.switches, index);
    audio.playSfx('click_ui');
    this.redraw();
    if (isSolved(this.data, this.switches)) {
      this.onSolved();
    }
  }

  private redraw(): void {
    this.g.clear();
    this.points.forEach((p, i) => {
      const on = this.switches[i] === true;
      const x = p.x - SWITCH_W / 2;
      const y = p.y - SWITCH_H / 2;
      this.g.fillStyle(PALETTE.black);
      this.g.fillRect(x - 1, y - 1, SWITCH_W + 2, SWITCH_H + 2);
      this.g.fillStyle(on ? PALETTE.green : PALETTE.ink);
      this.g.fillRect(x, y, SWITCH_W, SWITCH_H);
      this.g.fillStyle(on ? PALETTE.white : PALETTE.slate);
      this.g.fillRect(x + 2, on ? y + 2 : y + SWITCH_H - 10, SWITCH_W - 4, 8);
    });
    const value = valueOf(this.switches);
    this.valueText.setText(`${textos.puzzle.binario.valor}: ${value}   ${textos.puzzle.binario.objetivo}: ${this.data.objetivo}`);
    this.valueText.setColor(css(value === this.data.objetivo ? PALETTE.lime : PALETTE.white));
  }
}
