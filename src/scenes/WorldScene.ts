import Phaser from 'phaser';
import { registerSaraDevAnimations } from '../art/animations';
import { PATO_IDLE_ANIM, PATO_KEY, createPatoSheet } from '../art/characters/pato';
import { createSaraDevSheet } from '../art/characters/saradev';
import { PALETTE, css } from '../art/palette';
import { createPixelTexture } from '../art/pixelTexture';
import { POSTIT_KEY, createProps } from '../art/props';
import { ACTO1_TILESET_KEY, TILE_SIZE, createActo1Tileset } from '../art/tiles/acto1';
import textos from '../data/textos/es.json';
import { getTicket, ticketOrder } from '../data/tickets/index';
import { DEPTH, Player } from '../entities/Player';
import { EV, type TicketDonePayload, type TicketIdPayload } from '../game/events';
import { getProgress, setProgress } from '../game/session';
import { INTERACT_RANGE, pickInteractable } from '../logic/interaction';
import { completeTicket, failTicket, uptimePercent } from '../logic/progress';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { nextTicket } from '../logic/tickets';
import { markScene } from './markScene';
import type { ResultData } from './ResultScene';

export const MAP_ACTO1_KEY = 'map_acto1';
const ACTO = 1;
const INTRO_DIALOG = 'despertar';
const ALERT_KEY = 'fx_alert';

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

/** P06 · Mundo: mapa del acto 1, SaraDev, interactuables, diálogos y el flujo de tickets (specs 002–004). */
export class WorldScene extends Phaser.Scene {
  player!: Player;
  private keys!: MoveKeys;
  private interactables: Interactable[] = [];
  private prompt!: Phaser.GameObjects.Text;
  private alert!: Phaser.GameObjects.Image;
  /** Diálogo o ventana de ticket abierta: el mundo no se mueve. */
  private modalOpen = false;
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
    createPixelTexture(this, ALERT_KEY, ['.ooo.', 'oyyyo', 'oyyyo', 'oyyyo', '.oyo.', '.ooo.', '.oyo.', '.ooo.'], {
      o: PALETTE.black,
      y: PALETTE.yellow,
    });

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

    // Aviso de CRON sobre la terminal que tiene el próximo ticket.
    this.alert = this.add.image(0, 0, ALERT_KEY).setOrigin(0.5, 1).setDepth(DEPTH.above + 1).setVisible(false);
    this.tweens.add({ targets: this.alert, y: '-=2', duration: 400, yoyo: true, repeat: -1 });
    this.time.addEvent({ delay: 300, loop: true, callback: () => this.alert.setAlpha(this.alert.alpha === 1 ? 0.3 : 1) });
    this.placeAlert();

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

    this.bindFlowEvents();

    if (!this.scene.isActive('Hud')) {
      this.scene.launch('Hud');
    }

    if (!WorldScene.introShown) {
      WorldScene.introShown = true;
      this.openDialog(INTRO_DIALOG);
    }
  }

  override update(): void {
    if (this.modalOpen) {
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

  private currentTarget(): Interactable | null {
    return pickInteractable({ x: this.player.x, y: this.player.y }, this.interactables, INTERACT_RANGE);
  }

  private pendingTicketId(): string | null {
    return nextTicket(ticketOrder(ACTO), getProgress(this.registry).completados);
  }

  private placeAlert(): void {
    const pending = this.pendingTicketId();
    const terminal = pending ? this.interactables.find((i) => i.name === getTicket(pending).terminal) : undefined;
    if (!terminal) {
      this.alert.setVisible(false);
      return;
    }
    this.alert.setPosition(terminal.x, terminal.y - TILE_SIZE / 2 - 2).setVisible(true);
  }

  private tryInteract(): void {
    if (this.modalOpen) return;
    const target = this.currentTarget();
    if (!target) return;

    if (target.tipo !== 'terminal') {
      this.openDialog(target.dialogo);
      return;
    }

    const pending = this.pendingTicketId();
    if (pending === null) {
      this.openDialog('terminal_sin_tickets');
    } else if (getTicket(pending).terminal === target.name) {
      this.openModal('Briefing', { ticketId: pending } satisfies TicketIdPayload);
    } else {
      this.openDialog('terminal_apagada');
    }
  }

  private openDialog(dialogo: string): void {
    this.openModal('Dialog', { dialogo });
  }

  private openModal(sceneKey: string, data: object): void {
    if (this.modalOpen) return;
    this.modalOpen = true;
    this.player.move({ up: false, down: false, left: false, right: false });
    this.scene.launch(sceneKey, data);
  }

  private closeModal(): void {
    this.modalOpen = false;
  }

  private bindFlowEvents(): void {
    const events = this.game.events;
    const handlers: [string, (payload: never) => void][] = [
      [EV.dialogClosed, () => this.closeModal()],
      [EV.briefingBack, () => this.closeModal()],
      [EV.ticketAbandoned, () => this.closeModal()],
      [EV.resultClosed, () => this.closeModal()],
      [EV.rollbackBack, () => this.closeModal()],
      [EV.briefingAccept, ({ ticketId }: TicketIdPayload) => this.scene.launch('Puzzle', { ticketId })],
      [EV.rollbackRetry, ({ ticketId }: TicketIdPayload) => this.scene.launch('Briefing', { ticketId })],
      [EV.ticketDone, (payload: TicketDonePayload) => this.onTicketDone(payload)],
      [EV.ticketFailed, ({ ticketId }: TicketIdPayload) => this.onTicketFailed(ticketId)],
    ];
    for (const [name, handler] of handlers) events.on(name, handler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      for (const [name, handler] of handlers) events.off(name, handler);
    });
  }

  private onTicketDone({ ticketId, elapsedMs, pistas }: TicketDonePayload): void {
    const ticket = getTicket(ticketId);
    const { state, ganadas } = completeTicket(getProgress(this.registry), ticketId, ticket.conciencias, pistas);
    setProgress(this.registry, state);
    this.placeAlert();
    const result: ResultData = { ticketId, elapsedMs, ganadas, uptime: uptimePercent(state, ticketOrder(ACTO).length) };
    this.scene.launch('Result', result);
  }

  private onTicketFailed(ticketId: string): void {
    setProgress(this.registry, failTicket(getProgress(this.registry), ticketId));
    this.scene.launch('Rollback', { ticketId } satisfies TicketIdPayload);
  }
}
