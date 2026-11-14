import { expect, test, type Page } from '@playwright/test';
import { closeDialog, collectErrors, dialog, enterWorld, nudgeTo, promptVisible } from './helpers';

interface TerminalSnapshot {
  lineas: string[];
  entrada: string;
  cwd: string;
  objetivo: boolean;
}

const escena = (page: Page): Promise<string | null> => page.evaluate(() => window.__debug?.ticket()?.escena ?? null);
const terminal = (page: Page): Promise<TerminalSnapshot | null> => page.evaluate(() => window.__debug?.terminal() ?? null);
const output = async (page: Page): Promise<string> => ((await terminal(page))?.lineas ?? []).join('\n');

async function typeLine(page: Page, line: string): Promise<void> {
  await page.keyboard.type(line, { delay: 15 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(80);
}

test('CA2: la terminal del núcleo responde a ls, cd, Tab, historial y cat cierra el ticket', async ({ page }) => {
  test.setTimeout(60_000);
  const errors = collectErrors(page);
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  await closeDialog(page);
  await page.evaluate(() => window.__debug!.jumpToAct(3));
  await expect.poll(() => page.evaluate(() => window.__debug?.world()?.acto ?? null), { timeout: 5000 }).toBe(3);
  await expect.poll(() => dialog(page)).not.toBeNull();
  expect((await dialog(page))!.id).toBe('acto3_inicio');
  await closeDialog(page);

  // Kiosco de arriba a la izquierda (7, 5): subir por la misma columna del inicio.
  await nudgeTo(page, 'y', 94);
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Terminal');
  await expect.poll(() => terminal(page)).not.toBeNull();
  expect((await terminal(page))!.cwd).toBe('/home/dev');

  await typeLine(page, 'xyz');
  expect(await output(page)).toContain('comando no encontrado: xyz');

  await typeLine(page, 'ls');
  expect(await output(page)).toContain('logs/  puente/  LEEME.txt');

  // Historial: ↑ trae `ls`, ↓ vuelve a la línea vacía.
  await page.keyboard.press('ArrowUp');
  await expect.poll(async () => (await terminal(page))!.entrada).toBe('ls');
  await page.keyboard.press('ArrowDown');
  await expect.poll(async () => (await terminal(page))!.entrada).toBe('');

  await typeLine(page, 'cd logs');
  expect((await terminal(page))!.cwd).toBe('/home/dev/logs');

  // Tab completa la ruta.
  await page.keyboard.type('cat ma', { delay: 15 });
  await page.keyboard.press('Tab');
  await expect.poll(async () => (await terminal(page))!.entrada).toBe('cat marga.log');
  await page.keyboard.press('Enter');

  await expect.poll(async () => (await terminal(page))?.objetivo ?? null).toBe(true);
  expect(await output(page)).toContain('puente/puente.py');
  await expect.poll(() => escena(page), { timeout: 5000 }).toBe('Result');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBeNull();
  expect(await page.evaluate(() => window.__debug!.progress().completados)).toContain('a3-01-explorar');

  expect(errors).toEqual([]);
});
