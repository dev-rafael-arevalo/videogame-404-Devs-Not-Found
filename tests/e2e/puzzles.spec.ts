import { expect, test, type Page } from '@playwright/test';
import {
  closeDialog,
  collectErrors,
  dialog,
  enterWorld,
  promptVisible,
  solveBinario,
  solveCompuertas,
  solveFirstCables,
  solvePaquetes,
  walkToTerminal,
} from './helpers';

interface Progress {
  completados: string[];
  conciencias: number;
}

const escena = (page: Page): Promise<string | null> => page.evaluate(() => window.__debug?.ticket()?.escena ?? null);
const progress = (page: Page): Promise<Progress> => page.evaluate(() => window.__debug!.progress());

async function resolveTicket(page: Page, tx: number, ty: number, solve: (page: Page) => Promise<void>): Promise<void> {
  await walkToTerminal(page, tx, ty);
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');
  await solve(page);
  await expect.poll(() => escena(page)).toBe('Result');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBeNull();
}

test('CA2: los cuatro tickets del acto 1 se resuelven con el mouse y CRON cierra el acto', async ({ page }) => {
  test.setTimeout(90_000);
  const errors = collectErrors(page);
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  await closeDialog(page);

  await resolveTicket(page, 15, 4, solveFirstCables);
  expect((await progress(page)).completados).toEqual(['a1-01-cables']);

  await resolveTicket(page, 22, 4, solveBinario);
  await resolveTicket(page, 15, 9, solvePaquetes);
  await resolveTicket(page, 22, 9, solveCompuertas);

  const final = await progress(page);
  expect(final.completados).toEqual(['a1-01-cables', 'a1-02-binario', 'a1-03-paquetes', 'a1-04-compuertas']);
  expect(final.conciencias).toBe(1200 + 1500 + 1300 + 1600);

  // RF7: la revelación de CRON.
  await expect.poll(async () => (await dialog(page))?.id ?? null).toBe('acto1_fin');
  expect((await dialog(page))!.quien).toBe('cron');
  await closeDialog(page);

  expect(errors).toEqual([]);
});

test('paquetes: un click fuera de orden reinicia la secuencia', async ({ page }) => {
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  await closeDialog(page);
  await resolveTicket(page, 15, 4, solveFirstCables);
  await resolveTicket(page, 22, 4, solveBinario);
  await walkToTerminal(page, 15, 9);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');

  const { layoutPackets } = await import('../../src/logic/puzzles/paquetes');
  const { PUZZLE_BOARD_AREA } = await import('../../src/puzzles/layout');
  const { clickGame } = await import('./helpers');
  const points = layoutPackets(PUZZLE_BOARD_AREA, 5);
  await clickGame(page, points[2]!); // #1
  await clickGame(page, points[0]!); // #3: fuera de orden
  const state = await page.evaluate(() => window.__debug!.ticket()!.puzzle!.tablero as { siguiente: number; error: boolean });
  expect(state).toEqual({ siguiente: 1, error: true });
});
