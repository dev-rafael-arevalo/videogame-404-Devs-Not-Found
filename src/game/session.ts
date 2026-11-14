import type Phaser from 'phaser';
import { initialProgress, type ProgressState } from '../logic/progress';

/**
 * Estado de la partida en `game.registry` (spec 004). Es la única "memoria" compartida entre
 * escenas; el HUD se suscribe a sus cambios. La lógica que lo transforma vive en `logic/`.
 */
export const REG = {
  progress: 'progress',
  activeTicket: 'activeTicket',
  sinPresion: 'sinPresion',
  acto: 'acto',
} as const;

export interface ActiveTicketInfo {
  id: string;
  numero: number;
  remainingS: number;
}

type Registry = Phaser.Data.DataManager;

export function getProgress(registry: Registry): ProgressState {
  return (registry.get(REG.progress) as ProgressState | undefined) ?? initialProgress();
}

export function setProgress(registry: Registry, progress: ProgressState): void {
  registry.set(REG.progress, progress);
}

export function getActiveTicket(registry: Registry): ActiveTicketInfo | null {
  return (registry.get(REG.activeTicket) as ActiveTicketInfo | null | undefined) ?? null;
}

export function setActiveTicket(registry: Registry, info: ActiveTicketInfo | null): void {
  registry.set(REG.activeTicket, info);
}

export function isSinPresion(registry: Registry): boolean {
  return registry.get(REG.sinPresion) === true;
}
