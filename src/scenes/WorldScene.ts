import Phaser from 'phaser';
import { registerSaraDevAnimations } from '../art/animations';
import { createSaraDevSheet } from '../art/characters/saradev';
import { ACTO1_TILESET_KEY, TILE_SIZE, createActo1Tileset } from '../art/tiles/acto1';
import { DEPTH, Player } from '../entities/Player';
import { markScene } from './markScene';

export const MAP_ACTO1_KEY = 'map_acto1';

type MoveKeys = Record<'up' | 'down' | 'left' | 'right' | 'w' | 's' | 'a' | 'd', Phaser.Input.Keyboard.Key>;

/** P06 · Mundo: mapa de Tiled del acto 1, SaraDev, colisiones y cámara (spec 002). */
export class WorldScene extends Phaser.Scene {
  player!: Player;
  private keys!: MoveKeys;

  constructor() {
    super('World');
  }

  create(): void {
    markScene(this);
    createActo1Tileset(this);
    createSaraDevSheet(this);
    registerSaraDevAnimations(this.anims);

    const map = this.make.tilemap({ key: MAP_ACTO1_KEY });
    const tiles = map.addTilesetImage(ACTO1_TILESET_KEY, ACTO1_TILESET_KEY, TILE_SIZE, TILE_SIZE, 0, 0);
    if (!tiles) throw new Error('No se pudo cargar el tileset del acto 1');

    map.createLayer('suelo', tiles)?.setDepth(DEPTH.floor);
    map.createLayer('objetos', tiles)?.setDepth(DEPTH.objects);
    const collision = map.createLayer('colision', tiles);
    if (!collision) throw new Error('El mapa no tiene capa de colisión');
    collision.setVisible(false);
    collision.setCollisionByExclusion([-1, 0]);
    map.createLayer('encima', tiles)?.setDepth(DEPTH.above);

    const spawn = map.findObject('spawns', (obj) => obj.name === 'player');
    this.player = new Player(this, spawn?.x ?? map.widthInPixels / 2, spawn?.y ?? map.heightInPixels / 2);
    this.physics.add.collider(this.player, collision);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player, true);
    camera.setDeadzone(48, 32);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('No hay teclado disponible');
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = keyboard.addKeys({
      up: K.UP,
      down: K.DOWN,
      left: K.LEFT,
      right: K.RIGHT,
      w: K.W,
      s: K.S,
      a: K.A,
      d: K.D,
    }) as MoveKeys;
  }

  override update(): void {
    const k = this.keys;
    this.player.move({
      up: k.up.isDown || k.w.isDown,
      down: k.down.isDown || k.s.isDown,
      left: k.left.isDown || k.a.isDown,
      right: k.right.isDown || k.d.isDown,
    });
  }
}
