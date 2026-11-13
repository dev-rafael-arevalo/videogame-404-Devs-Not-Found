import { expect, test, type Page } from '@playwright/test';
import { closeDialog, collectErrors, enterWorld, holdUntil, player, promptVisible } from './helpers';

interface TicketSnapshot {
  escena: 'Briefing' | 'Puzzle' | 'Result' | 'Rollback';
  restanteS: number | null;
  resultado: { ticketId: string; ganadas: number; uptime: number } | null;
}

interface Progress {
  completados: string[];
  conciencias: number;
  fallos: Record<string, number>;
}

const ticket = (page: Page): Promise<TicketSnapshot | null> => page.evaluate(() => window.__debug?.ticket() ?? null);
const progress = (page: Page): Promise<Progress> => page.evaluate(() => window.__debug!.progress());
const escena = async (page: Page): Promise<string | null> => (await ticket(page))?.escena ?? null;

/** Click en coordenadas del juego (320×180), convertidas al canvas escalado. */
async function clickGame(page: Page, gx: number, gy: number): Promise<void> {
  const box = (await page.locator('#game canvas').boundingBox())!;
  const zoom = box.width / 320;
  await page.mouse.click(box.x + gx * zoom, box.y + gy * zoom);
}

/** Va desde la sala fría hasta la terminal del ticket #0007 (tile 15,4), parándose a su izquierda. */
async function walkToFirstTerminal(page: Page): Promise<void> {
  await holdUntil(page, 'ArrowRight', async () => ((await player(page))?.x ?? 0) >= 232, 6000);
  await holdUntil(page, 'ArrowUp', async () => ((await player(page))?.y ?? 999) <= 80, 3000);
}

test('ticket completo: briefing, plazo, rollback forzado, reintento y resultado con penalidad', async ({ page }) => {
  const errors = collectErrors(page);
  await enterWorld(page);
  await closeDialog(page);

  await walkToFirstTerminal(page);
  await expect.poll(() => promptVisible(page)).toBe(true);

  // Briefing (P09) y aceptar.
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');

  // El plazo corre y el mundo está bloqueado.
  const before = (await player(page))!;
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(1200);
  await page.keyboard.up('ArrowLeft');
  expect((await player(page))!.x).toBe(before.x);
  expect((await ticket(page))!.restanteS).toBeLessThan(90);

  // CA3: vencimiento forzado → rollback → reintentar.
  await page.evaluate(() => window.__debug!.expireDeadline());
  await expect.poll(() => escena(page)).toBe('Rollback');
  expect((await progress(page)).fallos['a1-01-cables']).toBe(1);
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');

  // El placeholder se resuelve con su botón (centro del tablero).
  await clickGame(page, 160, 100);
  await expect.poll(() => escena(page)).toBe('Result');
  const result = (await ticket(page))!.resultado!;
  expect(result.ticketId).toBe('a1-01-cables');
  expect(result.ganadas).toBe(900); // 1.200 − 25% por el rollback
  expect(result.uptime).toBe(50);

  // CA2: al continuar, el progreso quedó guardado y SaraDev se mueve otra vez.
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBeNull();
  const p = await progress(page);
  expect(p.completados).toEqual(['a1-01-cables']);
  expect(p.conciencias).toBe(900);

  const stopped = (await player(page))!;
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowDown');
  expect((await player(page))!.y).toBeGreaterThan(stopped.y);

  // La misma terminal ya no tiene ticket: responde con diálogo.
  await holdUntil(page, 'ArrowUp', async () => ((await player(page))?.y ?? 999) <= 80, 3000);
  await page.keyboard.press('e');
  await expect.poll(() => page.evaluate(() => window.__debug?.dialog()?.id ?? null)).toBe('terminal_apagada');
  await closeDialog(page);

  expect(errors).toEqual([]);
});
