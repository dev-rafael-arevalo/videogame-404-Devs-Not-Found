import type Phaser from 'phaser';
import { GAME_OPTIONS_KEY, parseGameOptions, serializeGameOptions, type GameOptions } from '../logic/gameOptions';
import { REG } from './session';

/** Persistencia de las opciones del juego y su reflejo en el registry (spec 011). Nunca lanza. */

export function loadGameOptions(): GameOptions {
  try {
    return parseGameOptions(localStorage.getItem(GAME_OPTIONS_KEY));
  } catch {
    return parseGameOptions(null);
  }
}

export function saveGameOptions(options: GameOptions): void {
  try {
    localStorage.setItem(GAME_OPTIONS_KEY, serializeGameOptions(options));
  } catch {
    // Sin almacenamiento: valen solo para esta sesión.
  }
}

/** Vuelca las opciones al registry, que es lo que leen las escenas (`isSinPresion`). */
export function applyGameOptions(registry: Phaser.Data.DataManager, options: GameOptions): void {
  registry.set(REG.sinPresion, options.sinPresion);
  registry.set(REG.escalado, options.escalado);
}
