import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { markScene } from './markScene';
import actos from '../data/actos.json';
import { mapKeyFor } from './WorldScene';

const LINE_DELAY_MS = 220;
const END_DELAY_MS = 500;
const BAR_WIDTH = 160;
const BAR_HEIGHT = 4;

/** P01 · Boot (BIOS falso): texto de POST retro y barra de carga. Cualquier tecla salta. */
export class BootScene extends Phaser.Scene {
  private lineIndex = 0;
  private finished = false;
  private bar!: Phaser.GameObjects.Graphics;

  constructor() {
    super('Boot');
  }

  preload(): void {
    for (const acto of actos.actos) {
      this.load.tilemapTiledJSON(mapKeyFor(acto.mapa), `/assets/maps/${acto.mapa}.json`);
    }
  }

  create(): void {
    markScene(this);
    this.lineIndex = 0;
    this.finished = false;

    const mono = { fontFamily: 'monospace', fontSize: '8px', color: css(PALETTE.terminal) };
    const lines = textos.boot.lineas;
    const texts = lines.map((_, i) => this.add.text(8, 8 + i * 12, '', mono));

    this.bar = this.add.graphics();
    this.drawBar(0);

    this.add
      .text(GAME_WIDTH - 8, GAME_HEIGHT - 10, textos.boot.saltar, {
        ...mono,
        color: css(PALETTE.slate),
      })
      .setOrigin(1, 1);

    this.time.addEvent({
      delay: LINE_DELAY_MS,
      repeat: lines.length - 1,
      callback: () => {
        const text = texts[this.lineIndex];
        const line = lines[this.lineIndex];
        if (text && line) {
          text.setText(line);
          audio.playSfx('boot_beep');
        }
        this.lineIndex += 1;
        this.drawBar(this.lineIndex / lines.length);
        if (this.lineIndex >= lines.length) {
          this.time.delayedCall(END_DELAY_MS, () => this.finish());
        }
      },
    });

    this.input.keyboard?.once('keydown', () => this.finish());
    this.input.once('pointerdown', () => this.finish());
  }

  private drawBar(progress: number): void {
    const x = (GAME_WIDTH - BAR_WIDTH) / 2;
    const y = GAME_HEIGHT - 28;
    this.bar.clear();
    this.bar.fillStyle(PALETTE.ink);
    this.bar.fillRect(x, y, BAR_WIDTH, BAR_HEIGHT);
    this.bar.fillStyle(PALETTE.terminal);
    this.bar.fillRect(x, y, Math.round(BAR_WIDTH * Phaser.Math.Clamp(progress, 0, 1)), BAR_HEIGHT);
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.scene.start('Title');
  }
}
