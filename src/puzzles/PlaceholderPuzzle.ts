import type Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT, makeButton } from '../art/ui';
import textos from '../data/textos/es.json';
import type { TicketDef } from '../logic/tickets';
import type { PuzzleArea, PuzzleView } from './PuzzleView';

/** Tablero provisional para tipos de puzzle que todavía no existen: un botón que lo da por resuelto. */
export class PlaceholderPuzzle implements PuzzleView {
  private objects: Phaser.GameObjects.GameObject[] = [];

  create(scene: Phaser.Scene, area: PuzzleArea, ticket: TicketDef, onSolved: () => void): void {
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height / 2;
    const label = scene.add
      .text(cx, cy - 20, textos.puzzle.placeholder.replace('{tipo}', ticket.tipo), {
        ...FONT,
        color: css(PALETTE.silver),
        align: 'center',
      })
      .setOrigin(0.5);
    const button = makeButton(scene, cx, cy + 8, textos.puzzle.marcarResuelto, onSolved);
    this.objects.push(label, button);
  }

  destroy(): void {
    this.objects.forEach((o) => o.destroy());
    this.objects = [];
  }
}
