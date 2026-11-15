import { expect, test, type Page } from '@playwright/test';
import { closeDialog, collectErrors, enterMenu, enterWorld, menuSelect, player } from './helpers';

interface MenuSnapshot {
  escena: string | null;
  menu: { indice: number; overlay: boolean } | null;
  intro: { pagina: number; total: number } | null;
  final: { final: string | null; pagina: number; creditos: boolean } | null;
  sinPresion: boolean;
}

const menu = (page: Page): Promise<MenuSnapshot> => page.evaluate(() => window.__debug!.menu());
const musica = (page: Page): Promise<number> => page.evaluate(() => window.__debug!.audio().opciones.musica);

test('CA2: menú, intro por páginas y opciones que persisten tras recargar', async ({ page }) => {
  const errors = collectErrors(page);
  await enterMenu(page);
  await page.evaluate(() => window.__debug!.resetSave());
  expect((await menu(page)).escena).toBe('Menu');

  // Opciones (índice 2; sin guardado, Continuar está deshabilitado y el cursor lo salta).
  await menuSelect(page, 2);
  await expect.poll(async () => (await menu(page)).escena).toBe('Options');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => musica(page)).toBeCloseTo(0.6, 5);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await menu(page)).sinPresion).toBe(true);
  await page.keyboard.press('Escape');
  await expect.poll(async () => (await menu(page)).escena).toBe('Menu');

  // Persisten.
  await page.reload();
  await enterMenu(page);
  expect(await musica(page)).toBeCloseTo(0.6, 5);
  expect((await menu(page)).sinPresion).toBe(true);

  // Nueva partida → intro por páginas.
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await menu(page)).escena).toBe('Intro');
  expect((await menu(page)).intro).toEqual({ pagina: 0, total: 5 });
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await menu(page)).intro?.pagina).toBe(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'World');

  // Con el modo sin presión, el plazo no corre: lo expone la ventana del puzzle... lo cubre la lógica (deadline.enabled).
  // Volver a dejar las opciones como estaban para otros tests.
  await page.evaluate(() => {
    localStorage.removeItem('devs-not-found.opciones');
    localStorage.removeItem('devs-not-found.audio');
  });

  expect(errors).toEqual([]);
});

test('CA2: Esc pausa el mundo y Continuar lo retoma; Guardar y salir vuelve al Título', async ({ page }) => {
  const errors = collectErrors(page);
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  await closeDialog(page);

  await page.keyboard.press('Escape');
  await expect.poll(async () => (await menu(page)).escena).toBe('Pause');
  const before = (await player(page))!;
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowRight');
  expect((await player(page))!.x).toBe(before.x); // el mundo está pausado

  await page.keyboard.press('Enter'); // Continuar
  await expect.poll(async () => (await menu(page)).escena).toBeNull();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowRight');
  expect((await player(page))!.x).toBeGreaterThan(before.x);

  await page.keyboard.press('Escape');
  await expect.poll(async () => (await menu(page)).escena).toBe('Pause');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter'); // Guardar y salir
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Title');

  expect(errors).toEqual([]);
});

test('CA2: el final muestra la variante según lo rescatado y los créditos vuelven al Título', async ({ page }) => {
  const errors = collectErrors(page);
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  await closeDialog(page);
  await page.evaluate(() => window.__debug!.finishGame());
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'End');
  await expect.poll(async () => (await menu(page)).final?.final).toBe('completo');

  for (let i = 0; i < 3; i += 1) {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(80);
  }
  await expect.poll(async () => (await menu(page)).final?.creditos).toBe(true);
  await page.keyboard.press('Enter'); // acelera
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Title', { timeout: 30_000 });

  expect(errors).toEqual([]);
});

test('Escalado "ajustar a la ventana" llena el ancho aunque el múltiplo no sea entero', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 700 });
  await enterMenu(page);
  await page.evaluate(() => window.__debug!.resetSave());
  const canvas = page.locator('#game canvas');
  expect((await canvas.boundingBox())!.width).toBe(960); // ×3 entero
  await menuSelect(page, 2); // Opciones
  await expect.poll(async () => (await menu(page)).escena).toBe('Options');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown'); // Escalado
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await canvas.boundingBox())!.width).toBeGreaterThanOrEqual(998);
  await page.keyboard.press('Enter'); // vuelve a entero
  await expect.poll(async () => (await canvas.boundingBox())!.width).toBe(960);
  await page.evaluate(() => localStorage.removeItem('devs-not-found.opciones'));
});
