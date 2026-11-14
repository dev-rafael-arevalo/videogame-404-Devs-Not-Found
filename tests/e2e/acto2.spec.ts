import { expect, test, type Page } from '@playwright/test';
import {
  closeDialog,
  collectErrors,
  dialog,
  enterWorld,
  nudgeTo,
  player,
  promptVisible,
  solveBloques,
  solveBug,
  solveIndentacion,
  walkToTerminal,
} from './helpers';

const escena = (page: Page): Promise<string | null> => page.evaluate(() => window.__debug?.ticket()?.escena ?? null);
const acto = (page: Page): Promise<number | null> => page.evaluate(() => window.__debug?.world()?.acto ?? null);

async function resolveTicket(page: Page, tx: number, ty: number, corridorY: number, solve: (page: Page) => Promise<void>): Promise<void> {
  await walkToTerminal(page, tx, ty, corridorY);
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');
  await solve(page);
  await expect.poll(() => escena(page), { timeout: 8000 }).toBe('Result');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBeNull();
}

test('CA2: con el acto 1 completo, la salida de la oficina carga el acto 2 y lo guarda', async ({ page }) => {
  const errors = collectErrors(page);
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  await closeDialog(page);
  await page.evaluate(() => window.__debug!.completeAct(1));

  // Puerta inferior de la sala fría: tile (3, 11).
  await nudgeTo(page, 'x', 56);
  await page.keyboard.down('ArrowDown');
  await expect.poll(async () => (await player(page))!.y, { timeout: 4000 }).toBeGreaterThan(182);
  await page.keyboard.up('ArrowDown');
  await nudgeTo(page, 'y', 188);
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => acto(page), { timeout: 5000 }).toBe(2);
  await expect.poll(() => page.evaluate(() => window.__debug!.save()?.acto ?? null)).toBe(2);
  await expect.poll(() => dialog(page)).not.toBeNull();
  expect((await dialog(page))!.id).toBe('acto2_inicio');

  expect(errors).toEqual([]);
});

test('CA3: los tres tickets del acto 2 se resuelven con el mouse y CRON cierra el acto', async ({ page }) => {
  test.setTimeout(90_000);
  const errors = collectErrors(page);
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  await closeDialog(page);
  await page.evaluate(() => window.__debug!.jumpToAct(2));
  await expect.poll(() => acto(page), { timeout: 5000 }).toBe(2);
  await expect.poll(() => dialog(page)).not.toBeNull();
  await closeDialog(page);

  // Holograma del metro, al lado del inicio.
  await nudgeTo(page, 'x', 184);
  await nudgeTo(page, 'y', 100);
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(async () => (await dialog(page))?.id ?? null).toBe('holograma_1');
  await closeDialog(page);

  const CALLE = 126; // fila 7
  await resolveTicket(page, 7, 9, CALLE, solveBloques);
  await resolveTicket(page, 21, 12, CALLE, solveBug);
  await resolveTicket(page, 35, 9, CALLE, solveIndentacion);

  const progress = await page.evaluate(() => window.__debug!.progress());
  expect(progress.completados).toContain('a2-03-indentacion');
  await expect.poll(async () => (await dialog(page))?.id ?? null).toBe('acto2_fin');
  await closeDialog(page);

  expect(errors).toEqual([]);
});
