import Phaser from 'phaser';
import { createPatoSheet, PATO_IDLE_ANIM, PATO_KEY } from '../art/characters/pato';
import { ACTIONS, EXPRESSIONS, type Action, type Expression } from '../art/characters/saradev';
import { PALETTE, css } from '../art/palette';
import { PORTRAITS_KEY, PORTRAIT_SIZE, createPortraits } from '../art/portraits';
import { FONT, drawWindow, type WindowStyle } from '../art/ui';
import { DEPTH, Player } from '../entities/Player';
import type { Direction, MoveInput } from '../logic/movement';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { markScene } from './markScene';

type DemoAnimation = { tipo: 'idle' } | { tipo: 'walk' } | { tipo: 'run' } | { tipo: 'accion'; accion: Action };

const ANIMATIONS: DemoAnimation[] = [
  { tipo: 'idle' },
  { tipo: 'walk' },
  { tipo: 'run' },
  ...ACTIONS.map((accion) => ({ tipo: 'accion' as const, accion })),
];
const DIRECTIONS: Direction[] = ['down', 'left', 'up', 'right'];
const NO_INPUT: MoveInput = { up: false, down: false, left: false, right: false };
const SCALES = [2, 3, 4, 6];

export interface DemoSnapshot {
  animacion: string;
  expresion: Expression;
  direccion: Direction;
  escala: number;
  animActual: string | null;
  totalAnimaciones: number;
}

/**
 * Escena de demostración del arte (spec 013). Fuera del flujo del juego: se abre con `/?demo`.
 * ←/→ animación · ↑/↓ expresión · D dirección · F espejar · +/− escala.
 */
export class DemoScene extends Phaser.Scene {
  private player!: Player;
  private animIndex = 0;
  private exprIndex = 0;
  private dirIndex = 0;
  private scaleIndex = 2;
  private flipped = false;
  private info!: Phaser.GameObjects.Text;

  constructor() {
    super('Demo');
  }

  create(): void {
    markScene(this);
    this.cameras.main.setBackgroundColor(css(PALETTE.navy));
    this.add.text(4, 3, 'DEMO DE ARTE · ←→ animación · ↑↓ expresión · D dirección · F espejar · +/− escala', {
      ...FONT,
      color: css(PALETTE.silver),
    });

    // Suelo de referencia y SaraDev grande.
    const floor = this.add.graphics();
    floor.fillStyle(PALETTE.ink);
    floor.fillRect(0, 118, 200, 2);

    this.player = new Player(this, 100, 118);
    this.player.body!.enable = false;
    this.player.setScale(SCALES[this.scaleIndex]!);
    this.player.setDepth(DEPTH.player);

    this.info = this.add.text(4, 124, '', { ...FONT, color: css(PALETTE.yellow), lineSpacing: 2 });

    // PATO a la derecha.
    createPatoSheet(this);
    this.add.sprite(236, 60, PATO_KEY, 'idle-0').setScale(3).play(PATO_IDLE_ANIM);
    this.add.text(236, 84, 'PATO', { ...FONT, color: css(PALETTE.silver) }).setOrigin(0.5, 0);

    // Retratos de las 8 expresiones.
    createPortraits(this);
    EXPRESSIONS.forEach((expression, i) => {
      const x = 190 + (i % 4) * (PORTRAIT_SIZE + 1);
      const y = 102 + Math.floor(i / 4) * (PORTRAIT_SIZE + 2);
      this.add.image(x, y, PORTRAITS_KEY, `saradev-${expression}`).setOrigin(0, 0);
    });

    // Las 4 ventanas del kit.
    (['cron', 'pato', 'alerta', 'exito'] as WindowStyle[]).forEach((style, i) => {
      drawWindow(this, 212 + i * 26, 14, 22, 18, style);
    });

    const kb = this.input.keyboard;
    if (!kb) throw new Error('No hay teclado disponible');
    kb.on('keydown-RIGHT', () => this.step(1));
    kb.on('keydown-LEFT', () => this.step(-1));
    kb.on('keydown-UP', () => this.expression(1));
    kb.on('keydown-DOWN', () => this.expression(-1));
    kb.on('keydown-D', () => this.direction());
    kb.on('keydown-F', () => this.flip());
    kb.on('keydown-PLUS', () => this.zoom(1));
    kb.on('keydown-MINUS', () => this.zoom(-1));
    kb.on('keydown-NUMPAD_ADD', () => this.zoom(1));
    kb.on('keydown-NUMPAD_SUBTRACT', () => this.zoom(-1));

    this.apply();
  }

  snapshot(): DemoSnapshot {
    const anim = ANIMATIONS[this.animIndex]!;
    return {
      animacion: anim.tipo === 'accion' ? anim.accion : anim.tipo,
      expresion: EXPRESSIONS[this.exprIndex]!,
      direccion: DIRECTIONS[this.dirIndex]!,
      escala: SCALES[this.scaleIndex]!,
      animActual: this.player.anims.currentAnim?.key ?? null,
      totalAnimaciones: ANIMATIONS.length,
    };
  }

  private step(delta: number): void {
    this.animIndex = (this.animIndex + delta + ANIMATIONS.length) % ANIMATIONS.length;
    this.apply();
  }

  private expression(delta: number): void {
    this.exprIndex = (this.exprIndex + delta + EXPRESSIONS.length) % EXPRESSIONS.length;
    this.apply();
  }

  private direction(): void {
    this.dirIndex = (this.dirIndex + 1) % DIRECTIONS.length;
    this.apply();
  }

  private flip(): void {
    this.flipped = !this.flipped;
    this.apply();
  }

  private zoom(delta: number): void {
    this.scaleIndex = Phaser.Math.Clamp(this.scaleIndex + delta, 0, SCALES.length - 1);
    this.apply();
  }

  private apply(): void {
    const anim = ANIMATIONS[this.animIndex]!;
    const direction = DIRECTIONS[this.dirIndex]!;
    this.player.setScale(SCALES[this.scaleIndex]!);
    this.player.facing = direction;
    this.player.action = null;
    this.player.setExpression(EXPRESSIONS[this.exprIndex]!);
    if (anim.tipo === 'accion') {
      this.player.playAction(anim.accion);
    } else {
      const input: MoveInput = anim.tipo === 'idle' ? NO_INPUT : { ...NO_INPUT, [direction]: true };
      this.player.move(input, anim.tipo === 'run');
      this.player.setVelocity(0, 0);
    }
    if (this.flipped) this.player.setFlipX(!this.player.flipX);
    this.info.setText(
      [
        `animación: ${anim.tipo === 'accion' ? anim.accion : anim.tipo}  (${this.animIndex + 1}/${ANIMATIONS.length})`,
        `expresión: ${EXPRESSIONS[this.exprIndex]}  dir: ${direction}  ×${SCALES[this.scaleIndex]}`,
        `clave: ${this.player.anims.currentAnim?.key ?? '-'}`,
      ].join('\n'),
    );
  }

  override update(): void {
    // Las acciones de un solo disparo vuelven a idle solas; la demo las repite para poder verlas.
    const anim = ANIMATIONS[this.animIndex]!;
    if (anim.tipo === 'accion' && this.player.action === null) {
      this.player.playAction(anim.accion);
    }
    void GAME_WIDTH;
    void GAME_HEIGHT;
  }
}
