import Phaser from 'phaser';
import { SynthwaveBackground } from '../art/backgrounds';
import { onKeyOnce } from '../art/keys';
import { PALETTE, css } from '../art/palette';
import { PORTRAITS_KEY, createPortraits } from '../art/portraits';
import { FONT, drawWindow, formatNumber } from '../art/ui';
import { audio } from '../audio/AudioManager';
import textos from '../data/textos/es.json';
import { TICKETS } from '../data/tickets/index';
import { getProgress } from '../game/session';
import { wrapText } from '../logic/dialog';
import { endingFor, rescuePercent, type Ending } from '../logic/ending';
import { GAME_HEIGHT, GAME_WIDTH } from '../logic/scale';
import { markScene } from './markScene';

export interface EndData {
  soloCreditos?: boolean;
}

export interface EndSnapshot {
  final: Ending | null;
  pagina: number;
  creditos: boolean;
}

const WIN = { x: 24, y: 24, width: 272, height: 120 } as const;
const SCROLL_SPEED = 18;
const FAST_SPEED = 110;
const PORTRAIT: Record<Ending, string> = { completo: 'saradev-celebracion', parcial: 'saradev-feliz', pendiente: 'saradev-determinada' };

/** P15 · Final y créditos: epílogo por páginas según el porcentaje rescatado y créditos que suben. */
export class EndScene extends Phaser.Scene {
  private background!: SynthwaveBackground;
  private ending: Ending | null = null;
  private page = 0;
  private credits = false;
  private creditsContainer: Phaser.GameObjects.Container | null = null;
  private creditsHeight = 0;
  private speed = SCROLL_SPEED;
  private epilogue: Phaser.GameObjects.GameObject[] = [];
  private finished = false;

  constructor() {
    super('End');
  }

  init(data: EndData): void {
    this.ending = data.soloCreditos ? null : endingFor(rescuePercent(getProgress(this.registry), Object.values(TICKETS)));
    this.page = 0;
    this.credits = data.soloCreditos === true;
    this.creditsContainer = null;
    this.speed = SCROLL_SPEED;
    this.finished = false;
  }

  create(): void {
    markScene(this);
    audio.playMusic(this.credits && this.ending === null ? 'titulo' : 'final_creditos');
    this.background = new SynthwaveBackground(this, { tono: 'neon', velocidad: 0.3 });
    createPortraits(this);

    const keyboard = this.input.keyboard;
    onKeyOnce(keyboard, 'ENTER', () => this.confirm());
    onKeyOnce(keyboard, 'SPACE', () => this.confirm());
    onKeyOnce(keyboard, 'ESC', () => this.finish());
    this.input.on('pointerdown', () => this.confirm());

    if (this.credits) this.startCredits();
    else this.renderEpilogue();
  }

  override update(time: number, delta: number): void {
    this.background.update(time, delta);
    if (this.creditsContainer) {
      this.creditsContainer.y -= (this.speed * delta) / 1000;
      if (this.creditsContainer.y + this.creditsHeight < -8) this.finish();
    }
  }

  snapshot(): EndSnapshot {
    return { final: this.ending, pagina: this.page, creditos: this.credits };
  }

  private confirm(): void {
    if (this.credits) {
      this.speed = FAST_SPEED;
      return;
    }
    const pages = this.ending ? textos.final.textos[this.ending] : [];
    if (this.page + 1 >= pages.length) {
      this.startCredits();
      return;
    }
    this.page += 1;
    this.renderEpilogue();
  }

  private renderEpilogue(): void {
    if (!this.ending) return;
    this.epilogue.forEach((o) => o.destroy());
    this.epilogue = [];
    const progress = getProgress(this.registry);
    const percent = rescuePercent(progress, Object.values(TICKETS));
    const rollbacks = Object.values(progress.fallos).reduce((a, b) => a + b, 0);
    const pages = textos.final.textos[this.ending];
    const g = drawWindow(this, WIN.x, WIN.y, WIN.width, WIN.height, this.ending === 'pendiente' ? 'alerta' : 'exito');
    const portrait = this.add.image(WIN.x + 12, WIN.y + 14, PORTRAITS_KEY, PORTRAIT[this.ending]).setOrigin(0, 0);
    const title = this.add.text(WIN.x + 52, WIN.y + 12, textos.final.titulos[this.ending], { ...FONT, fontStyle: 'bold', color: css(PALETTE.yellow) });
    const body = this.add.text(WIN.x + 52, WIN.y + 28, wrapText(pages[this.page] ?? '', 50).join('\n'), { ...FONT, color: css(PALETTE.white), lineSpacing: 2 });
    const summary = this.add.text(
      WIN.x + 12,
      WIN.y + WIN.height - 22,
      textos.final.resumen.replace('{porcentaje}', String(percent)).replace('{conciencias}', formatNumber(progress.conciencias)).replace('{rollbacks}', String(rollbacks)),
      { ...FONT, color: css(PALETTE.cyan) },
    );
    const hint = this.add.text(WIN.x + WIN.width - 10, WIN.y + WIN.height - 10, `${this.page + 1}/${pages.length} · Enter`, { ...FONT, color: css(PALETTE.slate) }).setOrigin(1, 1);
    this.epilogue.push(g, portrait, title, body, summary, hint);
  }

  private startCredits(): void {
    this.credits = true;
    this.epilogue.forEach((o) => o.destroy());
    this.epilogue = [];
    const lines = textos.final.creditos;
    const container = this.add.container(0, GAME_HEIGHT + 8);
    lines.forEach((line, i) => {
      const heading = line.startsWith('#');
      const text = this.add
        .text(GAME_WIDTH / 2, i * 14, line.replace(/^#\s*/, ''), { ...FONT, fontStyle: heading ? 'bold' : 'normal', color: css(heading ? PALETTE.yellow : PALETTE.white) })
        .setOrigin(0.5, 0);
      container.add(text);
    });
    this.creditsHeight = lines.length * 14;
    this.creditsContainer = container;
    this.add.text(GAME_WIDTH - 6, GAME_HEIGHT - 5, textos.final.acelerar, { ...FONT, color: css(PALETTE.slate) }).setOrigin(1, 1);
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.cameras.main.fadeOut(400, 0x1a, 0x1c, 0x2c);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('Title'));
  }
}
