import Phaser from 'phaser';
import { PALETTE, css } from '../art/palette';
import { FONT, createUiTextures, formatNumber } from '../art/ui';
import textos from '../data/textos/es.json';
import { ticketOrder } from '../data/tickets/index';
import { REG, getActiveTicket, getProgress } from '../game/session';
import { actUptime } from '../logic/progress';
import { formatTicketNumber } from '../logic/tickets';
import { GAME_WIDTH } from '../logic/scale';

export const HUD_HEIGHT = 16;
const BAR_WIDTH = 40;
const BAR_HEIGHT = 4;

/** P07 · HUD: uptime, conciencias y ticket activo con su plazo. Corre en paralelo sobre el mundo. */
export class HudScene extends Phaser.Scene {
  private uptimeText!: Phaser.GameObjects.Text;
  private uptimeBar!: Phaser.GameObjects.Graphics;
  private concienciasText!: Phaser.GameObjects.Text;
  private ticketText!: Phaser.GameObjects.Text;
  private ticketIcon!: Phaser.GameObjects.Image;

  constructor() {
    super('Hud');
  }

  create(): void {
    const bg = this.add.graphics();
    bg.fillStyle(PALETTE.black, 0.85);
    bg.fillRect(0, 0, GAME_WIDTH, HUD_HEIGHT);
    bg.fillStyle(PALETTE.ink);
    bg.fillRect(0, HUD_HEIGHT - 1, GAME_WIDTH, 1);

    createUiTextures(this);
    const label = { ...FONT, color: css(PALETTE.silver) };
    this.add.image(4, 4, 'ui_icon_uptime').setOrigin(0, 0);
    this.uptimeText = this.add.text(14, 4, '', label);
    this.uptimeBar = this.add.graphics();
    this.add.image(122, 4, 'ui_icon_conciencias').setOrigin(0, 0);
    this.concienciasText = this.add.text(132, 4, '', label);
    this.ticketIcon = this.add.image(GAME_WIDTH - 4, 4, 'ui_icon_ticket').setOrigin(1, 0).setVisible(false);
    this.ticketText = this.add.text(GAME_WIDTH - 14, 4, '', { ...FONT, color: css(PALETTE.yellow) }).setOrigin(1, 0);

    this.registry.events.on(Phaser.Data.Events.CHANGE_DATA, this.refresh, this);
    this.registry.events.on(Phaser.Data.Events.SET_DATA, this.refresh, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.registry.events.off(Phaser.Data.Events.CHANGE_DATA, this.refresh, this);
      this.registry.events.off(Phaser.Data.Events.SET_DATA, this.refresh, this);
    });
    this.refresh();
  }

  private refresh(): void {
    const progress = getProgress(this.registry);
    const acto = (this.registry.get(REG.acto) as number | undefined) ?? 1;
    const uptime = actUptime(progress, ticketOrder(acto));
    this.uptimeText.setText(`${uptime}%`);

    const barX = 44;
    const barY = 6;
    this.uptimeBar.clear();
    this.uptimeBar.fillStyle(PALETTE.ink);
    this.uptimeBar.fillRect(barX, barY, BAR_WIDTH, BAR_HEIGHT);
    this.uptimeBar.fillStyle(PALETTE.green);
    this.uptimeBar.fillRect(barX, barY, Math.round((BAR_WIDTH * uptime) / 100), BAR_HEIGHT);

    this.concienciasText.setText(formatNumber(progress.conciencias));

    const active = getActiveTicket(this.registry);
    this.ticketIcon.setVisible(active !== null);
    this.ticketText.setText(active ? `${formatTicketNumber(active.numero)} ${active.remainingS}s` : textos.hud.sinTicket);
  }
}
