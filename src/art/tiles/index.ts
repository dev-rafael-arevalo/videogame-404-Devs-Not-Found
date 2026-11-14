import type Phaser from 'phaser';
import { ACTO1_TILESET_KEY, createActo1Tileset } from './acto1';
import { ACTO2_TILESET_KEY, createActo2Tileset } from './acto2';

/** Crea el tileset del acto y devuelve su clave (que coincide con el nombre en el JSON de Tiled). */
export function createTileset(scene: Phaser.Scene, acto: number): string {
  switch (acto) {
    case 1:
      createActo1Tileset(scene);
      return ACTO1_TILESET_KEY;
    case 2:
      createActo2Tileset(scene);
      return ACTO2_TILESET_KEY;
    default:
      throw new Error(`No hay tileset para el acto ${acto}`);
  }
}
