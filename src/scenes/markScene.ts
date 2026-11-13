import type Phaser from 'phaser';

/**
 * Deja la clave de la escena activa en `<html data-scene="…">`. Es la única "ventana" hacia el DOM
 * que usan los tests e2e para saber en qué pantalla está el juego sin leer el canvas.
 * Llamar al principio de `create()` de cada escena.
 */
export function markScene(scene: Phaser.Scene): void {
  document.documentElement.dataset.scene = scene.scene.key;
}
