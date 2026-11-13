import Phaser from 'phaser';
import { registerSaraDevAnimations } from '../art/animations';
import { PATO_IDLE_ANIM, PATO_KEY, createPatoSheet } from '../art/characters/pato';
import { createSaraDevSheet } from '../art/characters/saradev';
import { PALETTE, css } from '../art/palette';
import { POSTIT_KEY, createProps } from '../art/props';
import { ACTO1_TILESET_KEY, TILE_SIZE, createActo1Tileset } from '../art/tiles/acto1';
import textos from '../data/textos/es.json';
import { DEPTH, Player } from '../entities/Player';
import { INTERACT_RANGE, pickInteractable } from '../logic/interaction';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { DIALOG_CLOSED_EVENT } from './DialogScene';
import { markScene } from './markScene';

export const MAP_ACTO1_KEY = 'map_acto1';
const INTRO_DIALOG = 'despertar';

type MoveKeys = Record<'up' | 'down' | 'left' | 'right' | 'w' | 's' | 'a' | 'd', Phaser.Input.Keyboard.Key>;

interface Interactable {
  name: string;
  tipo: string;
  dialogo: string;
  x: number;
  y: number;
}

/** Tiled guarda las propiedades como lista `{ name, value }`; Phaser a veces las deja así. */
function readProperties(raw: unknown): Record<string, string> {
  if (Array.isArray(raw)) {
    return Object.fromEntries(raw.map((p: { name: string; value: unknown }) => [p.name, String(p.value)]));
  }
  if (raw && typeof raw === 'object') {
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v)]));
  }
  return {};
}

/** P06 · Mundo: mapa del acto 1, SaraDev, interactuables y diálogos (specs 002 y 003). */
export class WorldScene extends Phaser.Scene {
  player!: Player;
  private keys!: MoveKeys;
  private interactables: Interactable[] = [];
  private prompt!: Phaser.GameObjects.Text;
  private dialogOpen = false;
  private static introShown = false;

  constructor() {
    super('World');
  }

  create(): void {
    markScene(this);
    createActo1Tileset(this);
    createSaraDevSheet(this);
    registerSaraDevAnimations(this.anims);
    createPatoSheet(this);
    createProps(this);

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

    this.createInteractables(map);

    const spawn = map.findObject('spawns', (obj) => obj.name === 'player');
    this.player = new Player(this, spawn?.x ?? map.widthInPixels / 2, spawn?.y ?? map.heightInPixels / 2);
    this.physics.add.collider(this.player, collision);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player, true);
    camera.setDeadzone(48, 32);

    this.prompt = this.add
      .text(GAME_WIDTH - 4, GAME_HEIGHT - 4, textos.ui.usar, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: css(PALETTE.yellow),
        backgroundColor: css(PALETTE.black),
        padding: { x: 2, y: 1 },
      })
      .setOrigin(1, 1)
      .setScrollFactor(0)
      .setDepth(DEPTH.above + 1)
      .setVisible(false);

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
    // Eventos y no `JustDown`: un toque corto también cuenta (ver DialogScene).
    keyboard.on('keydown-E', this.tryInteract, this);
    keyboard.on('keydown-SPACE', this.tryInteract, this);

    const onDialogClosed = (): void => {
      this.dialogOpen = false;
    };
    this.game.events.on(DIALOG_CLOSED_EVENT, onDialogClosed);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.game.events.off(DIALOG_CLOSED_EVENT, onDialogClosed));

    if (!WorldScene.introShown) {
      WorldScene.introShown = true;
      this.openDialog(INTRO_DIALOG);
    }
  }

  override update(): void {
    if (this.dialogOpen) {
      this.player.move({ up: false, down: false, left: false, right: false });
      this.prompt.setVisible(false);
      return;
    }

    const k = this.keys;
    this.player.move({
      up: k.up.isDown || k.w.isDown,
      down: k.down.isDown || k.s.isDown,
      left: k.left.isDown || k.a.isDown,
      right: k.right.isDown || k.d.isDown,
    });

    this.prompt.setVisible(this.currentTarget() !== null);
  }

  private currentTarget(): Interactable | null {
    return pickInteractable({ x: this.player.x, y: this.player.y }, this.interactables, INTERACT_RANGE);
  }

  private tryInteract(): void {
    if (this.dialogOpen) return;
    const target = this.currentTarget();
    if (target) this.openDialog(target.dialogo);
  }

  isPromptVisible(): boolean {
    return this.prompt.visible;
  }

  private createInteractables(map: Phaser.Tilemaps.Tilemap): void {
    const layer = map.getObjectLayer('interactables');
    this.interactables = (layer?.objects ?? []).map((obj) => {
      const props = readProperties(obj.properties);
      return {
        name: obj.name ?? '',
        tipo: props['tipo'] ?? obj.type ?? '',
        dialogo: props['dialogo'] ?? '',
        x: obj.x ?? 0,
        y: obj.y ?? 0,
      };
    });

    for (const item of this.interactables) {
      if (item.tipo === 'pato') {
        this.add.sprite(item.x, item.y, PATO_KEY, 'idle-0').setDepth(DEPTH.objects + 1).play(PATO_IDLE_ANIM);
      } else if (item.tipo === 'postit') {
        this.add.image(item.x, item.y, POSTIT_KEY).setDepth(DEPTH.objects + 1);
      }
    }
  }

  private openDialog(dialogo: string): void {
    if (this.dialogOpen) return;
    this.dialogOpen = true;
    this.player.move({ up: false, down: false, left: false, right: false });
    this.scene.launch('Dialog', { dialogo });
  }
}
