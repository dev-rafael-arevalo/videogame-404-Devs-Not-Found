import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { audio } from '../audio/AudioManager';
import { FONT } from '../art/ui';
import {
  canConnect,
  connect,
  disconnect,
  isSolved,
  layoutPorts,
  parseCablesData,
  portNumber,
  type CableColor,
  type CablesData,
  type Connections,
  type Point,
} from '../logic/puzzles/cables';
import type { TicketDef } from '../logic/tickets';
import type { PuzzleArea, PuzzleView } from './PuzzleView';

const COLOR: Record<CableColor, number> = {
  rojo: PALETTE.red,
  azul: PALETTE.blue,
  verde: PALETTE.green,
  amarillo: PALETTE.yellow,
  cian: PALETTE.cyan,
  naranja: PALETTE.orange,
};

const PORT_SIZE = 10;
const HIT_RADIUS = 9;
const ERROR_FLASH_MS = 250;

export interface CablesSnapshot {
  connections: Connections;
  solved: boolean;
}

/** Tablero del puzzle `cables`: arrastrar desde un puerto izquierdo hasta su par derecho. */
export class CablesPuzzle implements PuzzleView {
  private scene!: Phaser.Scene;
  private data!: CablesData;
  private ports!: { left: Point[]; right: Point[] };
  private connections: Connections = {};
  private dragging: number | null = null;
  private errorPort: number | null = null;
  private portsG!: Phaser.GameObjects.Graphics;
  private cablesG!: Phaser.GameObjects.Graphics;
  private tempG!: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];
  private onSolved: () => void = () => undefined;
  private readonly handlers = {
    down: (p: Phaser.Input.Pointer) => this.onDown(p),
    move: (p: Phaser.Input.Pointer) => this.onMove(p),
    up: (p: Phaser.Input.Pointer) => this.onUp(p),
  };

  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void {
    this.scene = scene;
    this.data = parseCablesData(ticket.datos);
    this.ports = layoutPorts(area, this.data.izquierda.length);
    this.onSolved = onSolved;
    this.connections = {};

    this.cablesG = scene.add.graphics();
    this.tempG = scene.add.graphics();
    this.portsG = scene.add.graphics();
    const label = { ...FONT, fontStyle: 'bold', color: css(PALETTE.white), stroke: css(PALETTE.black), strokeThickness: 2 };
    this.labels = [
      ...this.ports.left.map((p, i) => scene.add.text(p.x - PORT_SIZE, p.y, String(portNumber(this.data, 'left', i)), label).setOrigin(1, 0.5)),
      ...this.ports.right.map((p, i) => scene.add.text(p.x + PORT_SIZE, p.y, String(portNumber(this.data, 'right', i)), label).setOrigin(0, 0.5)),
    ];

    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlers.down);
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlers.move);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.handlers.up);
    this.redraw();
  }

  destroy(): void {
    const input = this.scene.input;
    input.off(Phaser.Input.Events.POINTER_DOWN, this.handlers.down);
    input.off(Phaser.Input.Events.POINTER_MOVE, this.handlers.move);
    input.off(Phaser.Input.Events.POINTER_UP, this.handlers.up);
    [this.cablesG, this.tempG, this.portsG, ...this.labels].forEach((o) => o.destroy());
    this.labels = [];
  }

  /** Para los tests e2e. */
  snapshot(): CablesSnapshot {
    return { connections: this.connections, solved: isSolved(this.data, this.connections) };
  }

  private nearest(points: Point[], x: number, y: number): number | null {
    let best: number | null = null;
    let bestDistance = HIT_RADIUS;
    points.forEach((p, i) => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d <= bestDistance) {
        best = i;
        bestDistance = d;
      }
    });
    return best;
  }

  private onDown(pointer: Phaser.Input.Pointer): void {
    const left = this.nearest(this.ports.left, pointer.x, pointer.y);
    if (left === null) return;
    if (this.connections[left] !== undefined) {
      this.connections = disconnect(this.connections, left);
    }
    this.dragging = left;
    this.redraw();
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (this.dragging === null) return;
    const from = this.ports.left[this.dragging]!;
    this.tempG.clear();
    this.drawCable(this.tempG, from, { x: pointer.x, y: pointer.y }, COLOR[this.data.izquierda[this.dragging]!]);
  }

  private onUp(pointer: Phaser.Input.Pointer): void {
    if (this.dragging === null) return;
    const left = this.dragging;
    this.dragging = null;
    this.tempG.clear();
    const right = this.nearest(this.ports.right, pointer.x, pointer.y);
    if (right !== null) {
      if (canConnect(this.data, this.connections, left, right)) {
        this.connections = connect(this.connections, left, right);
        audio.playSfx('cable_conectar');
      } else {
        audio.playSfx('cable_error');
        this.flashError(right);
      }
    }
    this.redraw();
    if (isSolved(this.data, this.connections)) {
      this.onSolved();
    }
  }

  private flashError(right: number): void {
    this.errorPort = right;
    this.redraw();
    this.scene.time.delayedCall(ERROR_FLASH_MS, () => {
      this.errorPort = null;
      if (this.portsG.active) this.redraw();
    });
  }

  private drawCable(g: Phaser.GameObjects.Graphics, from: Point, to: Point, color: number): void {
    g.lineStyle(4, PALETTE.black);
    g.lineBetween(from.x, from.y, to.x, to.y);
    g.lineStyle(2, color);
    g.lineBetween(from.x, from.y, to.x, to.y);
  }

  private drawPort(p: Point, color: number, highlighted: boolean, error: boolean): void {
    const half = PORT_SIZE / 2;
    this.portsG.fillStyle(error ? PALETTE.red : PALETTE.black);
    this.portsG.fillRect(p.x - half - 1, p.y - half - 1, PORT_SIZE + 2, PORT_SIZE + 2);
    this.portsG.fillStyle(color);
    this.portsG.fillRect(p.x - half, p.y - half, PORT_SIZE, PORT_SIZE);
    this.portsG.fillStyle(highlighted ? PALETTE.white : PALETTE.ink);
    this.portsG.fillRect(p.x - 2, p.y - 2, 4, 4);
  }

  private redraw(): void {
    this.cablesG.clear();
    for (const [l, r] of Object.entries(this.connections)) {
      const left = Number(l);
      this.drawCable(this.cablesG, this.ports.left[left]!, this.ports.right[r]!, COLOR[this.data.izquierda[left]!]);
    }
    this.portsG.clear();
    this.ports.left.forEach((p, i) =>
      this.drawPort(p, COLOR[this.data.izquierda[i]!], this.connections[i] !== undefined || this.dragging === i, false),
    );
    const used = new Set(Object.values(this.connections));
    this.ports.right.forEach((p, i) => this.drawPort(p, COLOR[this.data.derecha[i]!], used.has(i), this.errorPort === i));
  }
}
