import Phaser from 'phaser';
import { saraDevAnimKey } from '../art/animations';
import { SARADEV_KEY, SARADEV_SIZE } from '../art/characters/saradev';
import { PALETTE } from '../art/palette';
import { createPixelTexture } from '../art/pixelTexture';
import { WALK_SPEED, computeVelocity, facingFrom, type Direction, type MoveInput } from '../logic/movement';

const SHADOW_KEY = 'fx_shadow';
const BODY_WIDTH = 10;
const BODY_HEIGHT = 6;

export const DEPTH = { floor: 0, objects: 1, shadow: 4, player: 5, above: 10 } as const;

/** SaraDev en el mundo: sprite con cuerpo Arcade en los pies, sombra y animaciones. */
export class Player extends Phaser.Physics.Arcade.Sprite {
  facing: Direction = 'down';
  private readonly shadow: Phaser.GameObjects.Image;

  /** `x`, `y` = centro de los pies. */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, SARADEV_KEY, 'down-idle-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setDepth(DEPTH.player);
    // Hitbox en los pies (RF3): así puede pasar "por detrás" de los objetos.
    this.body!.setSize(BODY_WIDTH, BODY_HEIGHT);
    this.body!.setOffset((SARADEV_SIZE - BODY_WIDTH) / 2, SARADEV_SIZE - BODY_HEIGHT);
    this.setCollideWorldBounds(true);

    createPixelTexture(scene, SHADOW_KEY, ['.oooooooo.', 'oooooooooo', '.oooooooo.'], { o: PALETTE.black });
    this.shadow = scene.add.image(x, y, SHADOW_KEY).setOrigin(0.5, 0.5).setDepth(DEPTH.shadow);

    this.play(saraDevAnimKey('idle', this.facing));
  }

  /** Aplica la entrada del cuadro actual: velocidad, dirección y animación. */
  move(input: MoveInput): void {
    const velocity = computeVelocity(input, WALK_SPEED);
    this.setVelocity(velocity.vx, velocity.vy);
    this.facing = facingFrom(velocity, this.facing);
    this.setFlipX(this.facing === 'left');
    const moving = velocity.vx !== 0 || velocity.vy !== 0;
    this.play(saraDevAnimKey(moving ? 'walk' : 'idle', this.facing), true);
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
