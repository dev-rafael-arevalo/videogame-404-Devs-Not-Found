import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { cycleGate, evaluate, isSolved, layoutGates, parseCompuertasData, type CompuertasData, type Gate, type GatesLayout } from '../logic/puzzles/compuertas';
import type { TicketDef } from '../logic/tickets';
import type { PuzzleArea, PuzzleView } from './PuzzleView';

const NODE = 18;
const SLOT_W = 30;

/** Tablero `compuertas`: click en cada ranura para cambiar la compuerta hasta lograr la salida. */
export class CompuertasPuzzle implements PuzzleView {
  private scene!: Phaser.Scene;
  private data!: CompuertasData;
  private gates: Gate[] = [];
  private layout!: GatesLayout;
  private g!: Phaser.GameObjects.Graphics;
  private texts: Phaser.GameObjects.Text[] = [];
  private slotTexts: Phaser.GameObjects.Text[] = [];
  private outputText!: Phaser.GameObjects.Text;
  private onSolved: () => void = () => undefined;
  private readonly onDown = (p: Phaser.Input.Pointer): void => this.handleDown(p);

  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void {
    this.scene = scene;
    this.data = parseCompuertasData(ticket.datos);
    this.gates = Array<Gate>(this.data.entradas.length - 1).fill(this.data.compuertas[0]!);
    this.layout = layoutGates(area, this.data.entradas.length);
    this.onSolved = onSolved;
    this.g = scene.add.graphics();

    const bold = { ...FONT, fontStyle: 'bold', color: css(PALETTE.black) };
    this.texts = [
      ...this.layout.inputs.map((p, i) => scene.add.text(p.x, p.y, this.data.entradas[i] ? '1' : '0', bold).setOrigin(0.5)),
      ...this.layout.inputs.map((p, i) => scene.add.text(p.x, p.y - NODE / 2 - 3, String.fromCharCode(65 + i), { ...FONT, color: css(PALETTE.silver) }).setOrigin(0.5, 1)),
      scene.add.text(area.x + area.width / 2, area.y + 4, textos.puzzle.compuertas.instruccion, { ...FONT, color: css(PALETTE.silver) }).setOrigin(0.5, 0),
      scene.add
        .text(area.x + area.width / 2, area.y + area.height - 6, `${textos.puzzle.compuertas.objetivo}: ${this.data.objetivo ? '1' : '0'}`, { ...FONT, fontStyle: 'bold', color: css(PALETTE.white) })
        .setOrigin(0.5, 1),
    ];
    this.slotTexts = this.layout.slots.map((p) => scene.add.text(p.x, p.y, '', bold).setOrigin(0.5));
    this.outputText = scene.add.text(this.layout.output.x, this.layout.output.y, '', bold).setOrigin(0.5);
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    this.redraw();
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown);
    [this.g, this.outputText, ...this.texts, ...this.slotTexts].forEach((o) => o.destroy());
  }

  snapshot(): { gates: Gate[]; salida: boolean } {
    return { gates: [...this.gates], salida: evaluate(this.data, this.gates) };
  }

  private handleDown(pointer: Phaser.Input.Pointer): void {
    const index = this.layout.slots.findIndex((p) => Math.abs(p.x - pointer.x) <= SLOT_W / 2 + 1 && Math.abs(p.y - pointer.y) <= NODE / 2 + 1);
    if (index < 0) return;
    this.gates = this.gates.map((gate, i) => (i === index ? cycleGate(this.data, gate) : gate));
    audio.playSfx('click_ui');
    this.redraw();
    if (isSolved(this.data, this.gates)) {
      this.onSolved();
    }
  }

  private redraw(): void {
    const { inputs, slots, output } = this.layout;
    const result = evaluate(this.data, this.gates);
    this.g.clear();
    // Cables: entradas → ranuras → salida, de izquierda a derecha.
    this.g.lineStyle(1, PALETTE.slate);
    const chain = [inputs[0]!, ...slots.flatMap((s, i) => [s, inputs[i + 1]!]), output];
    for (let i = 0; i < chain.length - 1; i += 1) {
      this.g.lineBetween(chain[i]!.x, chain[i]!.y + 0.5, chain[i + 1]!.x, chain[i + 1]!.y + 0.5);
    }
    const box = (x: number, y: number, w: number, h: number, fill: number): void => {
      this.g.fillStyle(PALETTE.black);
      this.g.fillRect(x - w / 2 - 1, y - h / 2 - 1, w + 2, h + 2);
      this.g.fillStyle(fill);
      this.g.fillRect(x - w / 2, y - h / 2, w, h);
    };
    inputs.forEach((p, i) => box(p.x, p.y, NODE, NODE, this.data.entradas[i] ? PALETTE.lime : PALETTE.red));
    slots.forEach((p, i) => {
      box(p.x, p.y, SLOT_W, NODE, PALETTE.yellow);
      this.slotTexts[i]!.setText(this.gates[i]!);
    });
    box(output.x, output.y, NODE, NODE, result ? PALETTE.lime : PALETTE.red);
    this.outputText.setText(result ? '1' : '0');
  }
}
