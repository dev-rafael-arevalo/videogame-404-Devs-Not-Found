import Phaser from 'phaser';
import { PATO_KEY, createPatoSheet } from '../art/characters/pato';
import { SARADEV_KEY } from '../art/characters/saradev';
import { onKeyOnce } from '../art/keys';
import { PALETTE, css } from '../art/palette';
import { FONT } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { Player } from '../entities/Player';
import { wrapText } from '../logic/dialog';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { markScene } from './markScene';

const PANEL = { x: 16, y: 10, width: 288, height: 96 } as const;

export interface IntroSnapshot {
  pagina: number;
  total: number;
}

/** P05 · Intro: viñetas con ilustración procedural y texto. Enter avanza, Esc salta. */
export class IntroScene extends Phaser.Scene {
  private page = 0;
  private art!: Phaser.GameObjects.Graphics;
  private props: Phaser.GameObjects.GameObject[] = [];
  private title!: Phaser.GameObjects.Text;
  private body!: Phaser.GameObjects.Text;
  private done = false;

  constructor() {
    super('Intro');
  }

  create(): void {
    markScene(this);
    this.page = 0;
    this.done = false;
    this.cameras.main.setBackgroundColor(css(PALETTE.black));
    audio.playMusic('intro');
    Player.prepare(this);
    createPatoSheet(this);

    this.art = this.add.graphics();
    this.title = this.add.text(PANEL.x, PANEL.y + PANEL.height + 8, '', { ...FONT, fontStyle: 'bold', color: css(PALETTE.yellow) });
    this.body = this.add.text(PANEL.x, PANEL.y + PANEL.height + 20, '', { ...FONT, color: css(PALETTE.white), lineSpacing: 2 });
    this.add.text(GAME_WIDTH - 8, GAME_HEIGHT - 6, textos.intro.avanzar, { ...FONT, color: css(PALETTE.slate) }).setOrigin(1, 1);

    onKeyOnce(this.input.keyboard, 'ENTER', () => this.next());
    onKeyOnce(this.input.keyboard, 'SPACE', () => this.next());
    onKeyOnce(this.input.keyboard, 'ESC', () => this.finish());
    this.input.on('pointerdown', () => this.next());
    this.render();
  }

  snapshot(): IntroSnapshot {
    return { pagina: this.page, total: textos.intro.vinetas.length };
  }

  private next(): void {
    if (this.done) return;
    audio.playSfx('click_ui');
    if (this.page + 1 >= textos.intro.vinetas.length) {
      this.finish();
      return;
    }
    this.page += 1;
    this.render();
  }

  private finish(): void {
    if (this.done) return;
    this.done = true;
    this.cameras.main.fadeOut(300, 0x1a, 0x1c, 0x2c);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('World', { acto: 1 }));
  }

  private render(): void {
    const page = textos.intro.vinetas[this.page]!;
    this.title.setText(`${this.page + 1}/${textos.intro.vinetas.length} · ${page.titulo}`);
    this.body.setText(wrapText(page.texto, 70).join('\n'));
    this.props.forEach((p) => p.destroy());
    this.props = [];
    const g = this.art;
    g.clear();
    g.fillStyle(PALETTE.navy);
    g.fillRect(PANEL.x, PANEL.y, PANEL.width, PANEL.height);
    g.lineStyle(1, PALETTE.ink);
    g.strokeRect(PANEL.x + 0.5, PANEL.y + 0.5, PANEL.width - 1, PANEL.height - 1);
    const cx = PANEL.x + PANEL.width / 2;
    const ground = PANEL.y + PANEL.height - 12;
    switch (this.page) {
      case 0:
        this.drawCity(g, ground, PALETTE.slate, PALETTE.yellow);
        break;
      case 1:
        this.drawCity(g, ground, PALETTE.slate, PALETTE.red);
        this.props.push(
          this.add.text(cx, PANEL.y + 24, '06:00', { fontFamily: 'monospace', fontSize: '24px', fontStyle: 'bold', color: css(PALETTE.red), stroke: css(PALETTE.black), strokeThickness: 3 }).setOrigin(0.5),
        );
        break;
      case 2: {
        this.drawCity(g, ground, PALETTE.ink, PALETTE.purple);
        const rnd = new Phaser.Math.RandomDataGenerator(['arca']);
        for (let i = 0; i < 120; i += 1) {
          g.fillStyle(rnd.frac() < 0.5 ? PALETTE.cyan : PALETTE.white, rnd.realInRange(0.3, 1));
          g.fillRect(PANEL.x + 8 + rnd.between(0, PANEL.width - 16), PANEL.y + 8 + rnd.between(0, PANEL.height - 30), 1, 1);
        }
        this.props.push(this.add.text(cx, PANEL.y + 22, '0,3 s', { fontFamily: 'monospace', fontSize: '16px', fontStyle: 'bold', color: css(PALETTE.cyan) }).setOrigin(0.5));
        break;
      }
      case 3: {
        g.fillStyle(PALETTE.ink);
        g.fillRect(PANEL.x + 8, PANEL.y + 8, PANEL.width - 16, PANEL.height - 16);
        for (let i = 0; i < 4; i += 1) {
          g.fillStyle(PALETTE.slate);
          g.fillRect(cx - 70 + i * 36, PANEL.y + 20, 20, 56);
          g.fillStyle(PALETTE.green);
          g.fillRect(cx - 66 + i * 36, PANEL.y + 26, 2, 2);
          g.fillStyle(PALETTE.red);
          g.fillRect(cx - 62 + i * 36, PANEL.y + 26, 2, 2);
        }
        g.lineStyle(1, PALETTE.cyan, 0.8);
        for (let x = PANEL.x + 8; x < PANEL.x + PANEL.width - 8; x += 8) g.lineBetween(x + 0.5, PANEL.y + 8, x + 0.5, PANEL.y + PANEL.height - 8);
        this.props.push(this.add.image(cx + 90, ground + 4, SARADEV_KEY, 'down-idle-determinada-0').setOrigin(0.5, 1).setScale(2));
        break;
      }
      default: {
        this.drawCity(g, ground, PALETTE.slate, PALETTE.orange);
        this.props.push(
          this.add.image(cx - 20, ground + 4, SARADEV_KEY, 'down-idle-sorprendida-0').setOrigin(0.5, 1).setScale(2),
          this.add.image(cx + 24, ground + 2, PATO_KEY, 'idle-0').setOrigin(0.5, 1).setScale(2),
        );
      }
    }
  }

  /** Silueta de Puerto Cero con un sol (o alerta) detrás. */
  private drawCity(g: Phaser.GameObjects.Graphics, ground: number, buildings: number, sun: number): void {
    g.fillStyle(sun);
    g.fillCircle(PANEL.x + PANEL.width - 56, PANEL.y + 34, 18);
    const rnd = new Phaser.Math.RandomDataGenerator(['ciudad']);
    let x = PANEL.x + 8;
    while (x < PANEL.x + PANEL.width - 8) {
      const w = rnd.between(12, 28);
      const h = rnd.between(20, 64);
      g.fillStyle(buildings);
      g.fillRect(x, ground - h, Math.min(w, PANEL.x + PANEL.width - 8 - x), h);
      g.fillStyle(PALETTE.ink);
      for (let wy = ground - h + 4; wy < ground - 4; wy += 6) for (let wx = x + 3; wx < x + w - 3; wx += 6) g.fillRect(wx, wy, 2, 3);
      x += w + rnd.between(2, 6);
    }
    g.fillStyle(PALETTE.ink);
    g.fillRect(PANEL.x + 1, ground, PANEL.width - 2, PANEL.y + PANEL.height - ground - 1);
  }
}
