import { expect, test } from '@playwright/test';
import { closeDialog, collectErrors, enterWorld, player } from './helpers';

test('START lleva al mundo; SaraDev camina, choca con la pared y vuelve a idle', async ({ page }) => {
  const errors = collectErrors(page);
  await enterWorld(page);
  await closeDialog(page); // el diálogo inicial (spec 003) bloquea el movimiento

  const start = (await player(page))!;
  expect(start.anim).toBe('saradev-idle-down');

  // Camina hacia arriba hasta la pared de la sala fría.
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(400);
  const walking = (await player(page))!;
  expect(walking.y).toBeLessThan(start.y);
  expect(walking.anim).toBe('saradev-walk-up');

  await page.waitForTimeout(2000);
  const atWall = (await player(page))!;
  await page.waitForTimeout(500);
  const stillAtWall = (await player(page))!;
  // CA2: contra la pared, la posición no cambia aunque la tecla siga apretada.
  expect(stillAtWall.y).toBe(atWall.y);
  expect(stillAtWall.x).toBe(atWall.x);
  expect(atWall.y).toBeGreaterThan(16); // nunca entra en el tile de pared

  // CA3: al soltar, queda en idle mirando hacia la última dirección.
  await page.keyboard.up('ArrowUp');
  await expect.poll(async () => (await player(page))?.anim).toBe('saradev-idle-up');
  expect((await player(page))!.facing).toBe('up');

  expect(errors).toEqual([]);
});
