import Phaser from 'phaser';
import { PATO_IDLE_ANIM, PATO_KEY, createPatoSheet } from '../art/characters/pato';
import { PALETTE, css } from '../art/palette';
import { createPixelTexture } from '../art/pixelTexture';
import { HOLOGRAM_KEY, POSTIT_KEY, createProps } from '../art/props';
import { TILE_SIZE } from '../art/tiles/acto1';
import { createTileset } from '../art/tiles/index';
import { audio } from '../audio/AudioManager';
import actos from '../data/actos.json';
import textos from '../data/textos/es.json';
import { getTicket, ticketOrder } from '../data/tickets/index';
import { DEPTH, Player } from '../entities/Player';
import { EV, type TicketDonePayload, type TicketIdPayload } from '../game/events';
import { loadSave, writeSave } from '../game/save';
import { REG, getProgress, setProgress } from '../game/session';
import { INTERACT_RANGE, pickInteractable } from '../logic/interaction';
import { actUptime, completeTicket, failTicket } from '../logic/progress';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { nextTicket } from '../logic/tickets';
import { markScene } from './markScene';
import type { ResultData } from './ResultScene';

const ALERT_KEY = 'fx_alert';
const INTRO_DIALOG: Record<number, string> = { 1: 'despertar', 2: 'acto2_inicio' };

export interface WorldData {
  acto?: number;
}

export function mapKeyFor(mapa: string): string {
  return `map_${mapa}`;
}

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

/** P06 · Mundo: mapa del acto, SaraDev, interactuables, diálogos y el flujo de tickets (specs 002–008). */
export class WorldScene extends Phaser.Scene {
  player!: Player;
  acto = 1;
  private keys!: MoveKeys;
  private interactables: Interactable[] = [];
  private prompt!: Phaser.GameObjects.Text;
  private alert!: Phaser.GameObjects.Image;
  /** Diálogo o ventana de ticket abierta: el mundo no se mueve. */
  private modalOpen = false;
  private static introShown = new Set<number>();
  private static finaleShown = new Set<number>();

  constructor() {
    super('World');
  }

  init(data: WorldData): void {
    if (!this.registry.has(REG.progress)) {
      const saved = loadSave();
      if (saved) {
        setProgress(this.registry, saved.progress);
        this.registry.set(REG.acto, saved.acto);
      }
    }
    this.acto = data.acto ?? (this.registry.get(REG.acto) as number | undefined) ?? 1;
    this.registry.set(REG.acto, this.acto);
    this.modalOpen = false;
  }

  create(): void {
    markScene(this);
    const actoDef = actos.actos.find((a) => a.numero === this.acto);
    if (!actoDef) throw new Error(`No existe el acto ${this.acto}`);

    const tilesetKey = createTileset(this, this.acto);
    Player.prepare(this);
    createPatoSheet(this);
    createProps(this);
    createPixelTexture(this, ALERT_KEY, ['.ooo.', 'oyyyo', 'oyyyo', 'oyyyo', '.oyo.', '.ooo.', '.oyo.', '.ooo.'], {
      o: PALETTE.black,
      y: PALETTE.yellow,
    });

    const map = this.make.tilemap({ key: mapKeyFor(actoDef.mapa) });
    const tiles = map.addTilesetImage(tilesetKey, tilesetKey, TILE_SIZE, TILE_SIZE, 0, 0);
    if (!tiles) throw new Error(`No se pudo cargar el tileset del acto ${this.acto}`);

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
    camera.fadeIn(300, 0x1a, 0x1c, 0x2c);

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
    audio.playMusic(actoDef.musica);

    const intro = INTRO_DIALOG[this.acto];
    if (intro && !WorldScene.introShown.has(this.acto)) {
      WorldScene.introShown.add(this.acto);
      this.openDialog(intro);
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
      } else if (item.tipo === 'holograma') {
        const hologram = this.add.image(item.x, item.y + 8, HOLOGRAM_KEY).setOrigin(0.5, 1).setDepth(DEPTH.player - 1).setAlpha(0.8);
        this.tweens.add({ targets: hologram, alpha: 0.35, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }
    }
  }

  private currentTarget(): Interactable | null {
    return pickInteractable({ x: this.player.x, y: this.player.y }, this.interactables, INTERACT_RANGE);
  }

  private pendingTicketId(): string | null {
    return nextTicket(ticketOrder(this.acto), getProgress(this.registry).completados);
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

    this.player.playAction('interact');
    switch (target.tipo) {
      case 'terminal':
        audio.playSfx('interactuar');
        this.useTerminal(target);
        break;
      case 'salida':
        audio.playSfx('interactuar');
        if (this.pendingTicketId() === null) this.goToNextAct();
        else this.openDialog(target.dialogo);
        break;
      case 'pato':
        audio.playSfx('pato_quack');
        this.openDialog(target.dialogo);
        break;
      default:
        audio.playSfx('interactuar');
        this.openDialog(target.dialogo);
    }
  }

  private useTerminal(target: Interactable): void {
    const pending = this.pendingTicketId();
    if (pending === null) {
      this.openDialog('terminal_sin_tickets');
    } else if (getTicket(pending).terminal === target.name) {
      this.openModal('Briefing', { ticketId: pending } satisfies TicketIdPayload);
    } else {
      this.openDialog('terminal_apagada');
    }
  }

  /** Fundido y recarga del mundo en el acto siguiente (spec 008). */
  private goToNextAct(): void {
    if (this.modalOpen) return;
    const next = this.acto + 1;
    if (!actos.actos.some((a) => a.numero === next)) {
      this.openDialog('salida_fin');
      return;
    }
    this.modalOpen = true;
    writeSave(getProgress(this.registry), next);
    this.cameras.main.fadeOut(400, 0x1a, 0x1c, 0x2c);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.restart({ acto: next } satisfies WorldData));
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
      [EV.resultClosed, () => this.onResultClosed()],
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
    writeSave(state, this.acto);
    this.placeAlert();
    this.player.setExpression('celebracion');
    this.player.playAction('victory');
    this.time.delayedCall(4000, () => this.player.setExpression('normal'));
    const result: ResultData = { ticketId, elapsedMs, ganadas, uptime: actUptime(state, ticketOrder(this.acto)) };
    this.scene.launch('Result', result);
  }

  private onResultClosed(): void {
    this.closeModal();
    const finale = `acto${this.acto}_fin`;
    if (this.pendingTicketId() === null && !WorldScene.finaleShown.has(this.acto) && finale in textos.dialogos) {
      WorldScene.finaleShown.add(this.acto);
      this.time.delayedCall(150, () => this.openDialog(finale));
    }
  }

  private onTicketFailed(ticketId: string): void {
    const failed = failTicket(getProgress(this.registry), ticketId);
    setProgress(this.registry, failed);
    writeSave(failed, this.acto);
    this.player.setExpression('panico');
    this.player.playAction('hurt');
    this.time.delayedCall(4000, () => this.player.setExpression('cansada'));
    this.scene.launch('Rollback', { ticketId } satisfies TicketIdPayload);
  }
}
