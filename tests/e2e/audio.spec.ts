import { expect, test, type Page } from '@playwright/test';
import { layoutPorts } from '../../src/logic/puzzles/cables';
import { PUZZLE_BOARD_AREA } from '../../src/puzzles/layout';
import { closeDialog, collectErrors, dragGame, enterWorld, promptVisible, walkToFirstTerminal } from './helpers';

interface AudioSnapshot {
  musica: string | null;
  pendiente: string | null;
  estado: string;
  ultimoSfx: string | null;
  sfxReproducidos: number;
  nivel: number;
}

const audio = (page: Page): Promise<AudioSnapshot> => page.evaluate(() => window.__debug!.audio());
const escena = (page: Page): Promise<string | null> => page.evaluate(() => window.__debug?.ticket()?.escena ?? null);

test('CA2: la música sigue a las pantallas y los efectos a las acciones', async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Boot');
  // RF2: antes de la primera interacción no hay contexto ni pista.
  expect((await audio(page)).musica).toBeNull();
  expect((await audio(page)).estado).toBe('sin-contexto');

  await enterWorld(page); // Enter en Boot y en Título: desbloquea y arranca M01, luego M03
  await expect.poll(async () => (await audio(page)).estado).toBe('running');
  await expect.poll(async () => (await audio(page)).musica).toBe('acto1_oficina');
  expect((await audio(page)).sfxReproducidos).toBeGreaterThan(0); // boot_beep y click_ui
  // Suena de verdad: el analizador de la salida mide señal mientras corre M03.
  await expect.poll(async () => (await audio(page)).nivel, { timeout: 3000 }).toBeGreaterThan(0.005);

  await closeDialog(page);
  expect((await audio(page)).ultimoSfx).toBe('dialogo_letra');

  await walkToFirstTerminal(page);
  expect((await audio(page)).ultimoSfx).toBe('paso');
  await expect.poll(() => promptVisible(page)).toBe(true);

  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  expect((await audio(page)).ultimoSfx).toBe('ticket_nuevo');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');
  await expect.poll(async () => (await audio(page)).musica).toBe('puzzle');

  const ports = layoutPorts(PUZZLE_BOARD_AREA, 3);
  await dragGame(page, ports.left[0]!, ports.right[0]!);
  expect((await audio(page)).ultimoSfx).toBe('cable_error');
  await dragGame(page, ports.left[0]!, ports.right[1]!);
  expect((await audio(page)).ultimoSfx).toBe('cable_conectar');

  await page.evaluate(() => window.__debug!.expireDeadline());
  await expect.poll(() => escena(page)).toBe('Rollback');
  await expect.poll(async () => (await audio(page)).musica).toBe('jingle_rollback');
  // El jingle no hace loop: al terminar vuelve M03.
  await expect.poll(async () => (await audio(page)).musica, { timeout: 8000 }).toBe('acto1_oficina');

  expect(errors).toEqual([]);
});
