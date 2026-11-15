import type Phaser from 'phaser';

/**
 * Un `KeyboardEvent`, una sola acción en todo el juego. Phaser puede reprocesar su cola de teclado
 * dentro de un mismo cuadro y, además, varias escenas activas reciben el mismo evento (por ejemplo,
 * un overlay y la escena de abajo). Con este registro global, la primera escena que atiende el
 * evento lo consume y las demás lo ignoran.
 */
const handled = new WeakSet<KeyboardEvent>();

/** Marca el evento como atendido; devuelve `false` si ya lo había atendido alguien. */
export function claimKeyEvent(event: KeyboardEvent): boolean {
  if (handled.has(event)) return false;
  handled.add(event);
  return true;
}

/**
 * `keyboard.on('keydown-X', fn)` que solo dispara una vez por evento del DOM. Si `isActive` devuelve
 * `false` (por ejemplo, con un overlay abierto encima), la escena no reclama el evento y se lo deja
 * a la que está arriba.
 */
export function onKeyOnce(
  keyboard: Phaser.Input.Keyboard.KeyboardPlugin | null,
  key: string,
  fn: () => void,
  isActive: () => boolean = () => true,
): void {
  keyboard?.on(`keydown-${key}`, (event: KeyboardEvent) => {
    if (!isActive()) return;
    if (claimKeyEvent(event)) fn();
  });
}
