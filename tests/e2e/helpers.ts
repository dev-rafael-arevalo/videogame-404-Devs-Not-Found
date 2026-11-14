import { expect, type Page } from '@playwright/test';
import { layoutSwitches } from '../../src/logic/puzzles/binario';
import { layoutPorts } from '../../src/logic/puzzles/cables';
import { layoutGates } from '../../src/logic/puzzles/compuertas';
import { layoutPackets } from '../../src/logic/puzzles/paquetes';
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

/** Camina por el pasillo de la fila 6 hasta pararse a la izquierda de la terminal (tx, ty). */
export async function walkToTerminal(page: Page, tx: number, ty: number): Promise<void> {
  const targetX = (tx - 1) * 16 + 8;
  const targetY = ty * 16 + 14;
  const corridorY = 110;
  await holdUntil(page, ((await player(page))!.y < corridorY ? 'ArrowDown' : 'ArrowUp'), async () => Math.abs(((await player(page))?.y ?? 0) - corridorY) <= 6, 4000);
  await nudgeTo(page, 'y', corridorY);
  const dx = targetX - (await player(page))!.x;
  if (Math.abs(dx) > 6) {
    await holdUntil(page, dx > 0 ? 'ArrowRight' : 'ArrowLeft', async () => Math.abs(((await player(page))?.x ?? 0) - targetX) <= 10, 8000);
  }
  await nudgeTo(page, 'x', targetX);
  const dy = targetY - (await player(page))!.y;
  if (Math.abs(dy) > 6) {
    await holdUntil(page, dy > 0 ? 'ArrowDown' : 'ArrowUp', async () => Math.abs(((await player(page))?.y ?? 0) - targetY) <= 10, 4000);
  }
  await nudgeTo(page, 'y', targetY);
}

export async function clickGame(page: Page, p: { x: number; y: number }): Promise<void> {
  const s = await gamePoint(page, p.x, p.y);
  await page.mouse.click(s.x, s.y);
  await page.waitForTimeout(60);
}

/** Ticket a1-02: 42 = 32 + 8 + 2 con 8 interruptores. */
export async function solveBinario(page: Page): Promise<void> {
  const points = layoutSwitches(PUZZLE_BOARD_AREA, 8);
  for (const i of [2, 4, 6]) await clickGame(page, points[i]!);
}

/** Ticket a1-03: paquetes [3, 5, 1, 4, 2] en orden 1..5. */
export async function solvePaquetes(page: Page): Promise<void> {
  const points = layoutPackets(PUZZLE_BOARD_AREA, 5);
  for (const i of [2, 4, 0, 3, 1]) await clickGame(page, points[i]!);
}

/** Ticket a1-04: (1 AND 0) OR 1 = 1 → un click en la segunda ranura (AND → OR). */
export async function solveCompuertas(page: Page): Promise<void> {
  const layout = layoutGates(PUZZLE_BOARD_AREA, 3);
  await clickGame(page, layout.slots[1]!);
}
