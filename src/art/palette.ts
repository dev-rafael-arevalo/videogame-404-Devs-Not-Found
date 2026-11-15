/**
 * Paleta del juego (docs/03-arte/guia-arte.md): Sweetie 16 de lospec.com + el verde fósforo
 * reservado para la terminal. Todo el arte procedural toma sus colores de acá.
 */
export const PALETTE = {
  black: 0x1a1c2c,
  purple: 0x5d275d,
  red: 0xb13e53,
  orange: 0xef7d57,
  yellow: 0xffcd75,
  lime: 0xa7f070,
  green: 0x38b764,
  teal: 0x257179,
  navy: 0x29366f,
  blue: 0x3b5dc9,
  sky: 0x41a6f6,
  cyan: 0x73eff7,
  white: 0xf4f4f4,
  silver: 0x94b0c2,
  slate: 0x566c86,
  ink: 0x333c57,
  /** Verde fósforo de la terminal. Solo para la pantalla P11 y detalles "CRT". */
  terminal: 0x33ff66,
} as const;

export type PaletteName = keyof typeof PALETTE;

/** Convierte un color de la paleta a cadena CSS (`#rrggbb`), para `Phaser.GameObjects.Text`. */
export function css(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}
