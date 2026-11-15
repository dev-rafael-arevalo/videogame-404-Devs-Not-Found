import type Phaser from 'phaser';
import { css } from './palette';

/** Una fila por string y un carácter por píxel. `.` (o espacio) es transparente. */
export type PixelRows = readonly string[];
/** Carácter → color de la paleta. */
export type CharPalette = Readonly<Record<string, number>>;

export interface PixelFrame {
  name: string;
  rows: PixelRows;
}

const TRANSPARENT = new Set(['.', ' ']);

/** Amplía una matriz por un factor entero (cada píxel pasa a ser un bloque de `factor`×`factor`). */
export function scaleRows(rows: PixelRows, factor: number): PixelRows {
  return rows.flatMap((row) => {
    const scaled = [...row].map((ch) => ch.repeat(factor)).join('');
    return Array.from({ length: factor }, () => scaled);
  });
}

/** Pinta una matriz en un contexto 2D, píxel a píxel, con el origen en (ox, oy). */
export function paintRows(
  ctx: CanvasRenderingContext2D,
  rows: PixelRows,
  palette: CharPalette,
  ox: number,
  oy: number,
): void {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const ch = row.charAt(x);
      if (TRANSPARENT.has(ch)) continue;
      const color = palette[ch];
      if (color === undefined) {
        throw new Error(`Carácter '${ch}' sin color en la paleta (fila ${y}, columna ${x})`);
      }
      ctx.fillStyle = css(color);
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  });
}

function assertSize(rows: PixelRows, width: number, height: number, what: string): void {
  if (rows.length !== height || rows.some((r) => r.length !== width)) {
    throw new Error(`${what}: se esperaba ${width}×${height}, llegó ${rows[0]?.length ?? 0}×${rows.length}`);
  }
}

/** Crea una textura de una sola imagen a partir de una matriz. No hace nada si la clave ya existe. */
export function createPixelTexture(scene: Phaser.Scene, key: string, rows: PixelRows, palette: CharPalette): void {
  if (scene.textures.exists(key)) return;
  const width = rows[0]?.length ?? 0;
  const height = rows.length;
  assertSize(rows, width, height, key);
  const texture = scene.textures.createCanvas(key, width, height);
  if (!texture) throw new Error(`No se pudo crear la textura ${key}`);
  paintRows(texture.getContext(), rows, palette, 0, 0);
  texture.refresh();
}

/**
 * Crea una hoja de sprites con cuadros nombrados a partir de matrices del mismo tamaño.
 * Los cuadros se disponen en filas de `columns` (útil también para tilesets de Tiled, que leen la
 * textura completa en el mismo orden).
 */
export function createPixelSheet(
  scene: Phaser.Scene,
  key: string,
  frames: readonly PixelFrame[],
  frameWidth: number,
  frameHeight: number,
  palette: CharPalette,
  columns = 8,
): void {
  if (scene.textures.exists(key)) return;
  const rowCount = Math.ceil(frames.length / columns);
  const texture = scene.textures.createCanvas(key, columns * frameWidth, rowCount * frameHeight);
  if (!texture) throw new Error(`No se pudo crear la hoja ${key}`);
  const ctx = texture.getContext();
  frames.forEach((frame, i) => {
    assertSize(frame.rows, frameWidth, frameHeight, `${key}/${frame.name}`);
    const x = (i % columns) * frameWidth;
    const y = Math.floor(i / columns) * frameHeight;
    paintRows(ctx, frame.rows, palette, x, y);
    texture.add(frame.name, 0, x, y, frameWidth, frameHeight);
  });
  texture.refresh();
}
