import { expect, test, type Page } from '@playwright/test';
import { closeDialog, collectErrors, enterMenu, enterWorld, menuSelect, promptVisible, solveFirstCables, walkToFirstTerminal } from './helpers';

interface Save {
  acto: number;
  progress: { completados: string[]; conciencias: number };
}

const escena = (page: Page): Promise<string | null> => page.evaluate(() => window.__debug?.ticket()?.escena ?? null);
const save = (page: Page): Promise<Save | null> => page.evaluate(() => window.__debug!.save());

test('CA3: el progreso sobrevive a una recarga; Continuar lo retoma y Nueva partida lo borra', async ({ page }) => {
  const errors = collectErrors(page);
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  expect(await save(page)).toBeNull();
  await closeDialog(page);

  await walkToFirstTerminal(page);
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');
  await solveFirstCables(page);
  await expect.poll(() => escena(page)).toBe('Result');

  // Se guardó al cerrar el ticket.
  const saved = (await save(page))!;
  expect(saved.acto).toBe(1);
  expect(saved.progress.completados).toEqual(['a1-01-cables']);
  expect(saved.progress.conciencias).toBe(1200);

  // Recargar: el menú ofrece Continuar y el mundo carga el progreso.
  await page.reload();
  await enterMenu(page);
  expect((await save(page))!.progress.completados).toEqual(['a1-01-cables']);
  await menuSelect(page, 1); // Continuar
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'World');
  await expect.poll(() => page.evaluate(() => window.__debug!.progress().completados)).toEqual(['a1-01-cables']);

  // Nueva partida borra el guardado.
  await page.reload();
  await enterMenu(page);
  await page.keyboard.press('Enter'); // Nueva partida
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Intro');
  await expect.poll(() => save(page)).toBeNull();
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'World');
  await expect.poll(() => page.evaluate(() => window.__debug!.progress().completados)).toEqual([]);

  expect(errors).toEqual([]);
});
