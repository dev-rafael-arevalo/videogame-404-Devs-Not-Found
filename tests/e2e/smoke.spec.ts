import { expect, test } from '@playwright/test';

const GAME_WIDTH = 320;

test('carga, pasa del Boot al Título con escala entera y sin errores', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');

  const canvas = page.locator('#game canvas');
  await expect(canvas).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-game-ready', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Boot');

  // Cualquier tecla salta el BIOS.
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Title');

  // Pixel-perfect: el ancho CSS del canvas es un múltiplo entero de 320 (a 1280×720 → ×4).
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width % GAME_WIDTH).toBe(0);
  expect(box!.width / GAME_WIDTH).toBe(4);

  // Al achicar la ventana, el zoom baja pero sigue siendo entero.
  await page.setViewportSize({ width: 800, height: 600 });
  await expect.poll(async () => (await canvas.boundingBox())!.width).toBe(GAME_WIDTH * 2);

  expect(errors).toEqual([]);
});
