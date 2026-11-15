import { expect, test } from '@playwright/test';
import { closeDialog, collectErrors, dialog, enterWorld, holdUntil, player, promptVisible } from './helpers';

test('el diálogo inicial bloquea el movimiento y PATO responde al acercarse y pulsar E', async ({ page }) => {
  const errors = collectErrors(page);
  await enterWorld(page);

  // RF5: diálogo inicial de SaraDev.
  await expect.poll(() => dialog(page)).not.toBeNull();
  expect((await dialog(page))!.quien).toBe('saradev');

  // CA3: con el diálogo abierto, SaraDev no se mueve.
  const before = (await player(page))!;
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(400);
  await page.keyboard.up('ArrowRight');
  const after = (await player(page))!;
  expect(after.x).toBe(before.x);
  expect(after.y).toBe(before.y);

  await closeDialog(page);
  expect(await promptVisible(page)).toBe(false);

  // Camina hasta PATO (abajo y a la izquierda del punto de aparición).
  await holdUntil(page, 'ArrowDown', async () => ((await player(page))?.y ?? 0) >= 150);
  await holdUntil(page, 'ArrowLeft', async () => ((await player(page))?.x ?? 999) <= 74);

  // CA2: aviso visible, E abre el diálogo de PATO.
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => dialog(page)).not.toBeNull();
  expect((await dialog(page))!.quien).toBe('pato');
  expect((await dialog(page))!.id).toBe('pato_intro');

  // El texto aparece de a poco y E lo revela entero.
  await page.waitForTimeout(300);
  const partial = (await dialog(page))!;
  expect(partial.texto.length).toBeGreaterThan(0);
  expect(partial.revelado).toBe(false);
  await page.keyboard.press('e');
  await expect.poll(async () => (await dialog(page))?.revelado).toBe(true);

  await closeDialog(page);

  // Al cerrar, vuelve a poder moverse.
  const stopped = (await player(page))!;
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowRight');
  expect((await player(page))!.x).toBeGreaterThan(stopped.x);

  expect(errors).toEqual([]);
});
