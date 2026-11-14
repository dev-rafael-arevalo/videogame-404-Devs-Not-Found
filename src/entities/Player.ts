import Phaser from 'phaser';
import { actionKey, idleKey, moveKey, registerSaraDevAnimations } from '../art/animations';
import { SARADEV_KEY, SARADEV_SIZE, createSaraDevSheet, type Action, type Expression } from '../art/characters/saradev';
import { PALETTE } from '../art/palette';
import { createPixelTexture } from '../art/pixelTexture';
import { audio } from '../audio/AudioManager';
import { WALK_SPEED, computeVelocity, facingFrom, type Direction, type MoveInput } from '../logic/movement';

const SHADOW_KEY = 'fx_shadow';
const BODY_WIDTH = 10;
const BODY_HEIGHT = 6;
const STEP_INTERVAL_MS = 280;
const RUN_SPEED = WALK_SPEED * 1.6;

export const DEPTH = { floor: 0, objects: 1, shadow: 4, player: 5, above: 10 } as const;

/**
 * SaraDev en el mundo (PixelCharacter del brief): sprite con cuerpo Arcade en los pies, sombra,
 * expresión y acciones. Las animaciones las avanza Phaser con su delta.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  facing: Direction = 'down';
  expression: Expression = 'normal';
  /** Acción en curso (una sola vez o en loop); `null` cuando SaraDev está libre. */
  action: Action | null = null;
  private readonly shadow: Phaser.GameObjects.Image;
  private nextStepAt = 0;

  /** Crea las texturas y animaciones que el sprite necesita (idempotente). */
  static prepare(scene: Phaser.Scene): void {
    createSaraDevSheet(scene);
    registerSaraDevAnimations(scene.anims);
    createPixelTexture(scene, SHADOW_KEY, ['.oooooooo.', 'oooooooooo', '.oooooooo.'], { o: PALETTE.black });
  }

  /** `x`, `y` = centro de los pies. */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    Player.prepare(scene);
    super(scene, x, y, SARADEV_KEY, 'down-idle-normal-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setDepth(DEPTH.player);
    // Hitbox en los pies (RF3 de la spec 002): así puede pasar "por detrás" de los objetos.
    this.body!.setSize(BODY_WIDTH, BODY_HEIGHT);
    this.body!.setOffset((SARADEV_SIZE - BODY_WIDTH) / 2, SARADEV_SIZE - BODY_HEIGHT);
    this.setCollideWorldBounds(true);

    this.shadow = scene.add.image(x, y, SHADOW_KEY).setOrigin(0.5, 0.5).setDepth(DEPTH.shadow);
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.onAnimationComplete, this);
    this.play(idleKey(this.facing, this.expression));
  }

  /** Aplica la entrada del cuadro actual: velocidad, dirección y animación. */
  move(input: MoveInput, running = false): void {
    const velocity = computeVelocity(input, running ? RUN_SPEED : WALK_SPEED);
    this.setVelocity(velocity.vx, velocity.vy);
    const moving = velocity.vx !== 0 || velocity.vy !== 0;
    if (this.action !== null && !moving) return; // la acción sigue hasta terminar
    if (this.action !== null) this.action = null; // moverse interrumpe cualquier acción

    this.facing = facingFrom(velocity, this.facing);
    this.setFlipX(this.facing === 'left');
    const key = moving ? moveKey(running ? 'run' : 'walk', this.facing) : idleKey(this.facing, this.expression);
    this.play(key, true);
    if (moving && this.scene.time.now >= this.nextStepAt) {
      this.nextStepAt = this.scene.time.now + (running ? STEP_INTERVAL_MS * 0.6 : STEP_INTERVAL_MS);
      audio.playSfx('paso');
    }
  }

  /** Cambia la cara (se ve de frente y en los retratos). */
  setExpression(expression: Expression): void {
    this.expression = expression;
    if (this.action === null) this.play(idleKey(this.facing, this.expression), true);
  }

  /** Reproduce una acción de frente. Las de un solo disparo vuelven a `idle` al terminar. */
  playAction(action: Action): void {
    this.action = action;
    this.setVelocity(0, 0);
    this.setFlipX(false);
    this.play(actionKey(action));
  }

  /** Corta una acción en loop (`type`, `panic`). */
  stopAction(): void {
    this.action = null;
    this.play(idleKey(this.facing, this.expression), true);
  }

  private onAnimationComplete(animation: Phaser.Animations.Animation): void {
    if (this.action !== null && animation.key === actionKey(this.action)) {
      this.stopAction();
    }
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.shadow.setPosition(this.x, this.y - 1);
  }

  override destroy(fromScene?: boolean): void {
    this.shadow.destroy(fromScene);
    super.destroy(fromScene);
  }
}
