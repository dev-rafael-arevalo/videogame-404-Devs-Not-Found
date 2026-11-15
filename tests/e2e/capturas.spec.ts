/**
 * Genera las capturas del README en docs/capturas/. No es un test de CI: `playwright.config.ts` lo
 * excluye y solo corre con `npm run capturas` (config `playwright.capturas.config.ts`).
 * Recorre el juego entero con los mismos helpers que los e2e.
 */
import { expect, test, type Page } from '@playwright/test';
import { layoutPorts } from '../../src/logic/puzzles/cables';
import { PUZZLE_BOARD_AREA } from '../../src/puzzles/layout';
import { closeDialog, dialog, dragGame, menuSelect, nudgeTo, promptVisible, solveBloques, walkPath, walkToFirstTerminal, walkToTerminal } from './helpers';

const DIR = 'docs/capturas';
const escena = (page: Page): Promise<string | null> => page.evaluate(() => window.__debug?.ticket()?.escena ?? null);
const menu = (page: Page): Promise<string | null> => page.evaluate(() => window.__debug?.menu().escena ?? null);
const acto = (page: Page): Promise<number | null> => page.evaluate(() => window.__debug?.world()?.acto ?? null);

async function shot(page: Page, name: string, wait = 400): Promise<void> {
  await page.waitForTimeout(wait);
  await page.locator('#game canvas').screenshot({ path: `${DIR}/${name}.png` });
}

async function typeLine(page: Page, line: string): Promise<void> {
  await page.keyboard.type(line, { delay: 20 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
}

async function openTicket(page: Page, target: 'Puzzle' | 'Terminal'): Promise<void> {
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe(target);
  await page.waitForTimeout(200);
}

async function abandon(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
  await expect.poll(() => escena(page)).toBeNull();
}

test('capturas del README', async ({ page }) => {
  test.setTimeout(300_000);

  // Boot, Título, Menú, Opciones e Intro.
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Boot');
  await shot(page, '01-boot', 900);
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Title');
  await shot(page, '02-titulo', 1500);
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Menu');
  await page.evaluate(() => window.__debug!.resetSave());
  await shot(page, '03-menu', 600);
  await menuSelect(page, 2);
  await expect.poll(() => menu(page)).toBe('Options');
  await shot(page, '04-opciones', 400);
  await page.keyboard.press('Escape');
  await expect.poll(() => menu(page)).toBe('Menu');
  await menuSelect(page, 0);
  await expect.poll(() => menu(page)).toBe('Intro');
  await shot(page, '05-intro', 2500);
  await page.keyboard.press('Enter');
  await shot(page, '05b-intro-2', 2500);
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'World');
  await expect.poll(() => dialog(page)).not.toBeNull();

  // Acto 1: diálogo inicial y la oficina.
  for (let i = 0; i < 4; i += 1) {
    await page.keyboard.press('e');
    await page.waitForTimeout(80);
  }
  await shot(page, '06-acto1-dialogo', 900);
  await closeDialog(page);
  await walkToFirstTerminal(page);
  await shot(page, '07-acto1-oficina', 300);

  // Briefing, puzzle de cableado y resultado.
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await shot(page, '08-briefing', 600);
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');
  await page.waitForTimeout(200);
  const ports = layoutPorts(PUZZLE_BOARD_AREA, 3);
  await dragGame(page, ports.left[0]!, ports.right[1]!);
  await dragGame(page, ports.left[1]!, ports.right[0]!);
  await shot(page, '09-puzzle-cables', 300);
  await dragGame(page, ports.left[2]!, ports.right[2]!);
  await expect.poll(() => escena(page), { timeout: 8000 }).toBe('Result');
  await shot(page, '10-resultado', 900);
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBeNull();
  if ((await dialog(page)) !== null) await closeDialog(page);

  // Pausa.
  await page.keyboard.press('Escape');
  await expect.poll(() => menu(page)).toBe('Pause');
  await shot(page, '11-pausa', 400);
  await page.keyboard.press('Enter');
  await expect.poll(() => menu(page)).toBeNull();

  // Binario y rollback (el plazo vence).
  await walkToTerminal(page, 22, 4);
  await openTicket(page, 'Puzzle');
  await shot(page, '12-puzzle-binario', 300);
  await page.evaluate(() => window.__debug!.expireDeadline());
  await expect.poll(() => escena(page)).toBe('Rollback');
  await shot(page, '13-rollback', 900);
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await abandon(page);

  // Acto 2: Puerto Cero.
  await page.evaluate(() => window.__debug!.jumpToAct(2));
  await expect.poll(() => acto(page), { timeout: 5000 }).toBe(2);
  await expect.poll(() => dialog(page)).not.toBeNull();
  await page.keyboard.press('e');
  await shot(page, '14-acto2-ciudad', 900);
  await closeDialog(page);
  await nudgeTo(page, 'x', 184);
  await nudgeTo(page, 'y', 100);
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(async () => (await dialog(page))?.id ?? null).toBe('holograma_1');
  await shot(page, '15-acto2-holograma', 900);
  await closeDialog(page);
  const CALLE = 126;
  await walkToTerminal(page, 7, 9, CALLE);
  await openTicket(page, 'Puzzle');
  await shot(page, '16-puzzle-bloques', 300);
  await solveBloques(page);
  await expect.poll(() => escena(page), { timeout: 8000 }).toBe('Result');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBeNull();
  await walkToTerminal(page, 21, 12, CALLE);
  await openTicket(page, 'Puzzle');
  await shot(page, '17-puzzle-bug', 300);
  await abandon(page);

  // Acto 3: núcleo de ARCA y terminal.
  await page.evaluate(() => window.__debug!.jumpToAct(3));
  await expect.poll(() => acto(page), { timeout: 5000 }).toBe(3);
  await expect.poll(() => dialog(page)).not.toBeNull();
  await page.keyboard.press('e');
  await shot(page, '18-acto3-nucleo', 900);
  await closeDialog(page);
  await walkPath(page, [{ x: 104, y: 94 }]);
  await openTicket(page, 'Terminal');
  await typeLine(page, 'ls');
  await typeLine(page, 'pwd');
  await typeLine(page, 'ls logs');
  await typeLine(page, 'help');
  await shot(page, '19-terminal', 400);

  // Final.
  await page.evaluate(() => window.__debug!.finishGame());
  await expect.poll(() => menu(page), { timeout: 5000 }).toBe('End');
  await shot(page, '20-final', 2500);
  await page.keyboard.press('Enter');
  await shot(page, '20b-final-2', 2500);

  // Demo del arte.
  await page.goto('/?demo');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Demo');
  await shot(page, '21-demo-arte', 1200);
});
