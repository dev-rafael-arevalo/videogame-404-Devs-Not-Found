import type Phaser from 'phaser';
import { audio, type AudioSnapshot } from './audio/AudioManager';
import actos from './data/actos.json';
import { getTicket, ticketOrder } from './data/tickets/index';
import { clearSave, loadSave, writeSave } from './game/save';
import { REG, getProgress, setProgress } from './game/session';
import { completeTicket } from './logic/progress';
import type { LoadedSave } from './logic/save';
import type { ProgressState } from './logic/progress';
import type { DemoScene, DemoSnapshot } from './scenes/DemoScene';
import type { DialogScene, DialogSnapshot } from './scenes/DialogScene';
import type { PuzzleScene } from './scenes/PuzzleScene';
import type { ResultData, ResultScene } from './scenes/ResultScene';
import type { WorldScene } from './scenes/WorldScene';

export interface PlayerSnapshot {
  x: number;
  y: number;
  facing: string;
  anim: string | null;
  expresion: string;
  accion: string | null;
}

export interface DebugApi {
  game: Phaser.Game;
  /** Posición y animación de SaraDev, o `null` si el mundo no está activo. */
  player(): PlayerSnapshot | null;
  /** Estado del diálogo abierto, o `null` si no hay ninguno. */
  dialog(): DialogSnapshot | null;
  /** Si el aviso "[E] usar" está visible. */
  prompt(): boolean;
  /** Ventana del flujo de tickets abierta (Briefing, Puzzle, Result o Rollback) y sus datos. */
  ticket(): TicketSnapshot | null;
  progress(): ProgressState;
  /** Fuerza el vencimiento del plazo del puzzle abierto. */
  expireDeadline(): void;
  /** Pista actual, estado del contexto y último efecto. */
  audio(): AudioSnapshot;
  /** Estado de la escena de demo del arte, o `null`. */
  demo(): DemoSnapshot | null;
  /** Guardado en localStorage (o `null`). */
  save(): LoadedSave | null;
  /** Borra el guardado y el progreso en memoria. */
  resetSave(): void;
  /** Acto actual del mundo. */
  world(): { acto: number } | null;
  /** Marca todos los tickets del acto como completados (y guarda). */
  completeAct(acto: number): void;
  /** Completa los actos anteriores y recarga el mundo en `acto`. */
  jumpToAct(acto: number): void;
}

export interface TicketSnapshot {
  escena: 'Briefing' | 'Puzzle' | 'Result' | 'Rollback';
  restanteS: number | null;
  resultado: ResultData | null;
  puzzle: { pistas: number; tablero: unknown } | null;
}

declare global {
  interface Window {
    __debug?: DebugApi;
  }
}

/**
 * Expone `window.__debug` para los tests e2e. Solo se instala en desarrollo (`import.meta.env.DEV`):
 * el build de producción no lo incluye.
 */
export function installDebugApi(game: Phaser.Game): void {
  if (!import.meta.env.DEV) return;
  window.__debug = {
    game,
    player() {
      const world = game.scene.getScene('World') as WorldScene | null;
      if (!world || !game.scene.isActive('World')) return null;
      const player = world.player;
      return {
        x: player.x,
        y: player.y,
        facing: player.facing,
        anim: player.anims.currentAnim?.key ?? null,
        expresion: player.expression,
        accion: player.action,
      };
    },
    dialog() {
      if (!game.scene.isActive('Dialog')) return null;
      return (game.scene.getScene('Dialog') as DialogScene).snapshot();
    },
    prompt() {
      const world = game.scene.getScene('World') as WorldScene | null;
      return game.scene.isActive('World') && world !== null && world.isPromptVisible();
    },
    ticket() {
      const escena = (['Briefing', 'Puzzle', 'Result', 'Rollback'] as const).find((key) => game.scene.isActive(key));
      if (!escena) return null;
      const puzzle = escena === 'Puzzle' ? (game.scene.getScene('Puzzle') as PuzzleScene) : null;
      const result = escena === 'Result' ? (game.scene.getScene('Result') as ResultScene) : null;
      return {
        escena,
        restanteS: puzzle?.remaining() ?? null,
        resultado: result?.snapshot() ?? null,
        puzzle: puzzle?.snapshot() ?? null,
      };
    },
    progress() {
      return getProgress(game.registry);
    },
    expireDeadline() {
      if (game.scene.isActive('Puzzle')) (game.scene.getScene('Puzzle') as PuzzleScene).expireNow();
    },
    audio() {
      return audio.snapshot();
    },
    demo() {
      if (!game.scene.isActive('Demo')) return null;
      return (game.scene.getScene('Demo') as DemoScene).snapshot();
    },
    save() {
      return loadSave();
    },
    resetSave() {
      clearSave();
      game.registry.remove(REG.progress);
      game.registry.remove(REG.acto);
    },
    world() {
      if (!game.scene.isActive('World')) return null;
      return { acto: (game.scene.getScene('World') as WorldScene).acto };
    },
    completeAct(acto) {
      let state = getProgress(game.registry);
      for (const id of ticketOrder(acto)) state = completeTicket(state, id, getTicket(id).conciencias).state;
      setProgress(game.registry, state);
      writeSave(state, (game.registry.get(REG.acto) as number | undefined) ?? acto);
    },
    jumpToAct(acto) {
      for (const a of actos.actos) if (a.numero < acto) this.completeAct(a.numero);
      writeSave(getProgress(game.registry), acto);
      game.registry.set(REG.acto, acto);
      for (const key of ['Dialog', 'Briefing', 'Puzzle', 'Result', 'Rollback']) if (game.scene.isActive(key)) game.scene.stop(key);
      game.scene.getScene('World').scene.restart({ acto });
    },
  };
}
