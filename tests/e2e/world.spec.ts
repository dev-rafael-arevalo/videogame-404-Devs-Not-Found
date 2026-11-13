import { expect, test, type Page } from '@playwright/test';

interface Snapshot {
  x: number;
  y: number;
  facing: string;
  anim: string | null;
}

const snapshot = (page: Page): Promise<Snapshot | null> => page.evaluate(() => window.__debug?.player() ?? null);

test('START lleva al mundo; SaraDev camina, choca con la pared y vuelve a idle', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Boot');
  await page.keyboard.press('Enter'); // salta el BIOS
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Title');
  await page.keyboard.press('Enter'); // START
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'World');

  await expect.poll(() => snapshot(page)).not.toBeNull();
  const start = (await snapshot(page))!;
  expect(start.anim).toBe('saradev-idle-down');

  // Camina hacia arriba hasta la pared de la sala fría.
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(400);
  const walking = (await snapshot(page))!;
  expect(walking.y).toBeLessThan(start.y);
  expect(walking.anim).toBe('saradev-walk-up');

  await page.waitForTimeout(2000);
  const atWall = (await snapshot(page))!;
  await page.waitForTimeout(500);
  const stillAtWall = (await snapshot(page))!;
  // CA2: contra la pared, la posición no cambia aunque la tecla siga apretada.
  expect(stillAtWall.y).toBe(atWall.y);
  expect(stillAtWall.x).toBe(atWall.x);
  expect(atWall.y).toBeGreaterThan(16); // nunca entra en el tile de pared

  // CA3: al soltar, queda en idle mirando hacia la última dirección.
  await page.keyboard.up('ArrowUp');
  await expect.poll(async () => (await snapshot(page))?.anim).toBe('saradev-idle-up');
  expect((await snapshot(page))!.facing).toBe('up');

  expect(errors).toEqual([]);
});
