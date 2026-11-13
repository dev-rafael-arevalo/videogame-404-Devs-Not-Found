import { expect, type Page } from '@playwright/test';
import { layoutPorts } from '../../src/logic/puzzles/cables';
import { PUZZLE_BOARD_AREA } from '../../src/puzzles/layout';

export interface PlayerSnapshot {
  x: number;
  y: number;
  facing: string;
  anim: string | null;
}

export interface DialogSnapshot {
  id: string;
  quien: string;
  linea: number;
  pagina: number;
  revelado: boolean;
  texto: string;
}

export const player = (page: Page): Promise<PlayerSnapshot | null> =>
  page.evaluate(() => window.__debug?.player() ?? null);

export const dialog = (page: Page): Promise<DialogSnapshot | null> =>
  page.evaluate(() => window.__debug?.dialog() ?? null);

export const promptVisible = (page: Page): Promise<boolean> =>
  page.evaluate(() => window.__debug?.prompt() ?? false);

/** Registra errores de consola y de página en `errors`. */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

/** Boot → Título → Mundo. Deja el diálogo inicial abierto. */
export async function enterWorld(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Boot');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Title');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'World');
  await expect.poll(() => player(page)).not.toBeNull();
}

/** Pulsa E hasta que el diálogo se cierre (revela y pasa páginas). */
export async function closeDialog(page: Page): Promise<void> {
  for (let i = 0; i < 40 && (await dialog(page)) !== null; i += 1) {
    await page.keyboard.press('e');
    await page.waitForTimeout(60);
  }
  expect(await dialog(page)).toBeNull();
}

/** Mantiene una tecla hasta que `done` se cumpla (o se agote el tiempo). */
export async function holdUntil(page: Page, key: string, done: () => Promise<boolean>, timeoutMs = 4000): Promise<void> {
  await page.keyboard.down(key);
  const start = Date.now();
  while (!(await done()) && Date.now() - start < timeoutMs) {
    await page.waitForTimeout(40);
  }
  await page.keyboard.up(key);
}

/** Acerca a SaraDev a una coordenada en un eje con toques cortos, corrigiendo si se pasó. */
export async function nudgeTo(page: Page, axis: 'x' | 'y', target: number, tolerance = 3): Promise<void> {
  for (let i = 0; i < 40; i += 1) {
    const pos = (await player(page))![axis];
    const diff = target - pos;
    if (Math.abs(diff) <= tolerance) return;
    const key = axis === 'x' ? (diff > 0 ? 'ArrowRight' : 'ArrowLeft') : diff > 0 ? 'ArrowDown' : 'ArrowUp';
    await page.keyboard.down(key);
    await page.waitForTimeout(Math.min(200, Math.max(30, Math.abs(diff) * 12)));
    await page.keyboard.up(key);
    await page.waitForTimeout(40);
  }
}

/** Va desde la sala fría hasta la terminal del ticket #0007 (tile 15,4), parándose a su izquierda. */
export async function walkToFirstTerminal(page: Page): Promise<void> {
  await holdUntil(page, 'ArrowRight', async () => ((await player(page))?.x ?? 0) >= 220, 6000);
  await nudgeTo(page, 'x', 232);
  await holdUntil(page, 'ArrowUp', async () => ((await player(page))?.y ?? 999) <= 90, 3000);
  await nudgeTo(page, 'y', 78);
}

/** Coordenadas del juego (320×180) convertidas a píxeles de pantalla del canvas escalado. */
export async function gamePoint(page: Page, gx: number, gy: number): Promise<{ x: number; y: number }> {
  const box = (await page.locator('#game canvas').boundingBox())!;
  const zoom = box.width / 320;
  return { x: box.x + gx * zoom, y: box.y + gy * zoom };
}

/** Arrastre con el mouse entre dos puntos en coordenadas del juego. */
export async function dragGame(page: Page, from: { x: number; y: number }, to: { x: number; y: number }): Promise<void> {
  const a = await gamePoint(page, from.x, from.y);
  const b = await gamePoint(page, to.x, to.y);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move((a.x + b.x) / 2, (a.y + b.y) / 2, { steps: 4 });
  await page.mouse.move(b.x, b.y, { steps: 4 });
  await page.mouse.up();
  await page.waitForTimeout(60);
}

/** Resuelve el cableado del ticket a1-01 (izq [rojo, azul, verde] → der [azul, rojo, verde]). */
export async function solveFirstCables(page: Page): Promise<void> {
  const ports = layoutPorts(PUZZLE_BOARD_AREA, 3);
  await dragGame(page, ports.left[0]!, ports.right[1]!);
  await dragGame(page, ports.left[1]!, ports.right[0]!);
  await dragGame(page, ports.left[2]!, ports.right[2]!);
}
