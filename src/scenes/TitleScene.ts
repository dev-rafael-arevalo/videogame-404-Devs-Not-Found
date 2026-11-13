import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import textos from '../data/textos/es.json';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { markScene } from './markScene';

const RAIN_COLUMNS = 24;
const RAIN_GLYPHS = '01{}<>;=/#$%&*+-:';
const BLINK_MS = 500;

interface RainDrop {
  text: Phaser.GameObjects.Text;
  speed: number;
}

/** P02 · Título: nombre del juego, lluvia de caracteres de fondo y "PRESIONA START". */
export class TitleScene extends Phaser.Scene {
  private drops: RainDrop[] = [];

  constructor() {
    super('Title');
  }

  create(): void {
    markScene(this);
    this.createRain();

    const centerX = GAME_WIDTH / 2;

    this.add
      .text(centerX, 52, textos.titulo.nombre, {
        fontFamily: 'monospace',
        fontSize: '24px',
        fontStyle: 'bold',
        color: css(PALETTE.white),
        stroke: css(PALETTE.black),
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 78, textos.titulo.subtitulo, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: css(PALETTE.silver),
      })
      .setOrigin(0.5);

    const start = this.add
      .text(centerX, 124, textos.titulo.start, {
        fontFamily: 'monospace',
        fontSize: '10px',
        fontStyle: 'bold',
        color: css(PALETTE.yellow),
      })
      .setOrigin(0.5);

    this.time.addEvent({ delay: BLINK_MS, loop: true, callback: () => start.setVisible(!start.visible) });

    this.add
      .text(GAME_WIDTH - 4, GAME_HEIGHT - 4, textos.titulo.version, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: css(PALETTE.slate),
      })
      .setOrigin(1, 1);

    // Todavía no hay menú ni intro (specs 011 y 003): START va directo al mundo.
    let started = false;
    const onStart = (): void => {
      if (started) return;
      started = true;
      this.cameras.main.fadeOut(200, 0x1a, 0x1c, 0x2c);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('World'));
    };
    this.input.keyboard?.on('keydown-ENTER', onStart);
    this.input.keyboard?.on('keydown-SPACE', onStart);
    this.input.on('pointerdown', onStart);
  }

  override update(_time: number, delta: number): void {
    const dy = delta / 1000;
    for (const drop of this.drops) {
      drop.text.y += drop.speed * dy;
      if (drop.text.y > GAME_HEIGHT) {
        drop.text.y = -8;
        drop.text.setText(this.randomGlyph());
      }
    }
  }

  private createRain(): void {
    this.drops = [];
    const columnWidth = GAME_WIDTH / RAIN_COLUMNS;
    for (let i = 0; i < RAIN_COLUMNS; i += 1) {
      const text = this.add.text(
        Math.round(i * columnWidth + 2),
        Phaser.Math.Between(-GAME_HEIGHT, 0),
        this.randomGlyph(),
        { fontFamily: 'monospace', fontSize: '8px', color: css(PALETTE.teal) },
      );
      this.drops.push({ text, speed: Phaser.Math.Between(20, 60) });
    }
  }

  private randomGlyph(): string {
    return RAIN_GLYPHS.charAt(Phaser.Math.Between(0, RAIN_GLYPHS.length - 1));
  }
}
