import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { PALETTE } from './palette';

/**
 * Fondo synthwave (spec 013, referencias del Lead): estrellas, sol con bandas y grilla en
 * perspectiva que avanza hacia la cámara. Se redibuja por cuadro con un solo `Graphics`.
 */
export interface SynthwaveOptions {
  /** `neon`: magenta y cian (Título). `rojo`: alerta (Rollback). */
  tono: 'neon' | 'rojo';
  horizonte?: number;
  velocidad?: number;
}

const STAR_COUNT = 40;

export class SynthwaveBackground {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private readonly stars: { x: number; y: number; bright: boolean }[];
  private readonly horizon: number;
  private readonly speed: number;
  private readonly tone: SynthwaveOptions['tono'];
  private offset = 0;
  private glitchUntil = 0;

  constructor(scene: Phaser.Scene, options: SynthwaveOptions) {
    this.tone = options.tono;
    this.horizon = options.horizonte ?? 104;
    this.speed = options.velocidad ?? 0.5;
    this.graphics = scene.add.graphics();
    const rnd = new Phaser.Math.RandomDataGenerator(['synthwave']);
    this.stars = Array.from({ length: STAR_COUNT }, () => ({
      x: rnd.between(0, GAME_WIDTH - 1),
      y: rnd.between(0, this.horizon - 20),
      bright: rnd.frac() < 0.3,
    }));
  }

  setDepth(depth: number): this {
    this.graphics.setDepth(depth);
    return this;
  }

  /** Dispara barras de glitch durante `ms` milisegundos (Rollback). */
  glitch(now: number, ms = 400): void {
    this.glitchUntil = now + ms;
  }

  update(time: number, delta: number): void {
    this.offset = (this.offset + (delta / 1000) * this.speed) % 1;
    const g = this.graphics;
    const colors =
      this.tone === 'neon'
        ? { sky: PALETTE.black, sun: PALETTE.orange, sunStripe: PALETTE.red, grid: PALETTE.purple, gridBright: PALETTE.red, floor: 0x12101c, star: PALETTE.cyan }
        : { sky: 0x1a0a12, sun: PALETTE.red, sunStripe: PALETTE.purple, grid: PALETTE.red, gridBright: PALETTE.orange, floor: 0x200810, star: PALETTE.red };

    g.clear();
    g.fillStyle(colors.sky);
    g.fillRect(0, 0, GAME_WIDTH, this.horizon);
    g.fillStyle(colors.floor);
    g.fillRect(0, this.horizon, GAME_WIDTH, GAME_HEIGHT - this.horizon);

    for (const star of this.stars) {
      g.fillStyle(star.bright ? colors.star : PALETTE.slate);
      g.fillRect(star.x, star.y, 1, 1);
    }

    // Sol: círculo con bandas horizontales que se abren hacia abajo.
    const sunX = GAME_WIDTH / 2;
    const sunY = this.horizon - 6;
    const radius = 34;
    g.fillStyle(colors.sun);
    g.fillCircle(sunX, sunY, radius);
    g.fillStyle(colors.sunStripe);
    for (let i = 0; i < 6; i += 1) {
      const y = sunY - 2 + i * (4 + i);
      g.fillRect(sunX - radius, y, radius * 2, 1 + Math.floor(i / 2));
    }
    g.fillStyle(colors.sky);
    g.fillRect(0, this.horizon - 1, GAME_WIDTH, 1);

    // Grilla: horizontales que se acercan (perspectiva) y verticales que convergen al horizonte.
    const depth = GAME_HEIGHT - this.horizon;
    g.lineStyle(1, colors.grid);
    for (let i = 0; i < 10; i += 1) {
      const t = (i + this.offset) / 10;
      const y = Math.round(this.horizon + t * t * depth);
      g.lineStyle(1, i % 3 === 0 ? colors.gridBright : colors.grid);
      g.lineBetween(0, y + 0.5, GAME_WIDTH, y + 0.5);
    }
    g.lineStyle(1, colors.grid);
    for (let i = -8; i <= 8; i += 1) {
      const xBottom = GAME_WIDTH / 2 + i * 48;
      g.lineBetween(GAME_WIDTH / 2 + i * 2 + 0.5, this.horizon, xBottom + 0.5, GAME_HEIGHT);
    }
    g.lineStyle(1, colors.gridBright);
    g.lineBetween(0, this.horizon + 0.5, GAME_WIDTH, this.horizon + 0.5);

    if (time < this.glitchUntil) {
      const rnd = Phaser.Math.Between;
      for (let i = 0; i < 4; i += 1) {
        g.fillStyle(i % 2 === 0 ? colors.gridBright : PALETTE.cyan, 0.6);
        g.fillRect(rnd(-20, GAME_WIDTH - 40), rnd(0, GAME_HEIGHT), rnd(30, 120), rnd(1, 3));
      }
    }
  }

  destroy(): void {
    this.graphics.destroy();
  }
}
