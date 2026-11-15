import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import type { Point } from '../logic/puzzles/cables';
import { INITIAL_PAQUETES, isPicked, isSolved, layoutPackets, parsePaquetesData, pick, type PaquetesData, type PaquetesState } from '../logic/puzzles/paquetes';
import type { TicketDef } from '../logic/tickets';
import type { PuzzleArea, PuzzleView } from './PuzzleView';

const BOX_W = 26;
const BOX_H = 22;
const ERROR_FLASH_MS = 300;

/** Tablero `paquetes`: elegir los paquetes de menor a mayor número de secuencia. */
export class PaquetesPuzzle implements PuzzleView {
  private scene!: Phaser.Scene;
  private data!: PaquetesData;
  private state: PaquetesState = INITIAL_PAQUETES;
  private points: Point[] = [];
  private g!: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];
  private status!: Phaser.GameObjects.Text;
  private flashing = false;
  private onSolved: () => void = () => undefined;
  private readonly onDown = (p: Phaser.Input.Pointer): void => this.handleDown(p);

  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void {
    this.scene = scene;
    this.data = parsePaquetesData(ticket.datos);
    this.state = INITIAL_PAQUETES;
    this.points = layoutPackets(area, this.data.paquetes.length);
    this.onSolved = onSolved;
    this.g = scene.add.graphics();
    const numberStyle = { ...FONT, fontStyle: 'bold', color: css(PALETTE.black) };
    this.labels = [
      ...this.points.map((p, i) => scene.add.text(p.x, p.y, `#${this.data.paquetes[i]}`, numberStyle).setOrigin(0.5)),
      scene.add.text(area.x + area.width / 2, area.y + 4, textos.puzzle.paquetes.instruccion, { ...FONT, color: css(PALETTE.silver) }).setOrigin(0.5, 0),
    ];
    this.status = scene.add
      .text(area.x + area.width / 2, area.y + area.height - 6, '', { ...FONT, fontStyle: 'bold', color: css(PALETTE.white) })
      .setOrigin(0.5, 1);
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    this.redraw();
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    [this.g, this.status, ...this.labels].forEach((o) => o.destroy());
  }

  snapshot(): PaquetesState {
    return this.state;
  }

  private handleDown(pointer: Phaser.Input.Pointer): void {
    const index = this.points.findIndex((p) => Math.abs(p.x - pointer.x) <= BOX_W / 2 + 1 && Math.abs(p.y - pointer.y) <= BOX_H / 2 + 1);
    if (index < 0) return;
    const next = pick(this.data, this.state, index);
    if (next === this.state) return;
    this.state = next;
    if (next.error) {
      audio.playSfx('puzzle_error');
      this.flashing = true;
      this.scene.time.delayedCall(ERROR_FLASH_MS, () => {
        this.flashing = false;
        if (this.g.active) this.redraw();
      });
    } else {
      audio.playSfx('click_ui');
    }
    this.redraw();
    if (isSolved(this.data, this.state)) {
      this.onSolved();
    }
  }

  private redraw(): void {
    this.g.clear();
    this.points.forEach((p, i) => {
      const numero = this.data.paquetes[i]!;
      const picked = isPicked(this.state, numero);
      const x = p.x - BOX_W / 2;
      const y = p.y - BOX_H / 2;
      this.g.fillStyle(PALETTE.black);
      this.g.fillRect(x - 1, y - 1, BOX_W + 2, BOX_H + 2);
      this.g.fillStyle(this.flashing ? PALETTE.red : picked ? PALETTE.lime : PALETTE.silver);
      this.g.fillRect(x, y, BOX_W, BOX_H);
      this.g.fillStyle(PALETTE.ink);
      this.g.fillRect(x, y + BOX_H / 2 - 1, BOX_W, 1); // cinta del paquete
    });
    this.status.setText(`${textos.puzzle.paquetes.siguiente}: #${Math.min(this.state.siguiente, this.data.paquetes.length)}`);
  }
}
