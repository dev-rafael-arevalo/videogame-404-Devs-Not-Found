import { expect, test, type Page } from '@playwright/test';
import { closeDialog, collectErrors, dialog, enterWorld, promptVisible, walkPath } from './helpers';

const escena = (page: Page): Promise<string | null> => page.evaluate(() => window.__debug?.ticket()?.escena ?? null);
const output = async (page: Page): Promise<string> => ((await page.evaluate(() => window.__debug?.terminal()?.lineas ?? [])) as string[]).join('\n');

// Puntos del núcleo (píxeles): las plataformas se conectan por las filas 10–12 y el anillo alrededor del núcleo.
const P = {
  izqArriba: { x: 104, y: 94 }, // junto al kiosco (7, 5)
  derArriba: { x: 520, y: 94 }, // junto al kiosco (33, 5)
  izqAbajo: { x: 104, y: 286 }, // junto al kiosco (7, 17)
  derAbajo: { x: 520, y: 286 }, // junto al kiosco (33, 17)
  pasilloIzq: { x: 104, y: 190 },
  anilloIzq: { x: 264, y: 190 },
  anilloArriba: { x: 264, y: 142 },
  anilloArribaDer: { x: 408, y: 142 },
  anilloDer: { x: 408, y: 190 },
  anilloAbajoIzq: { x: 264, y: 238 },
  anilloAbajoDer: { x: 408, y: 238 },
  pasilloDer: { x: 536, y: 190 },
  derArribaEsquina: { x: 536, y: 110 },
  derArribaLado: { x: 520, y: 110 },
  derAbajoEsquina: { x: 536, y: 270 },
  derAbajoLado: { x: 520, y: 270 },
};

async function typeLine(page: Page, line: string): Promise<void> {
  await page.keyboard.type(line, { delay: 15 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
}

async function openTerminal(page: Page): Promise<void> {
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Terminal');
  await page.waitForTimeout(150);
}

async function finishTicket(page: Page): Promise<void> {
  await expect.poll(() => escena(page), { timeout: 6000 }).toBe('Result');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBeNull();
}

test('CA2: los cuatro tickets del núcleo se resuelven en la terminal y CRON cierra el juego', async ({ page }) => {
  test.setTimeout(240_000);
  const errors = collectErrors(page);
  await enterWorld(page);
  await page.evaluate(() => window.__debug!.resetSave());
  await closeDialog(page);
  await page.evaluate(() => window.__debug!.jumpToAct(3));
  await expect.poll(() => page.evaluate(() => window.__debug?.world()?.acto ?? null), { timeout: 5000 }).toBe(3);
  await expect.poll(() => dialog(page)).not.toBeNull();
  await closeDialog(page);

  // 1 · Explorar.
  await walkPath(page, [P.izqArriba]);
  await openTerminal(page);
  await typeLine(page, 'cat logs/marga.log');
  await finishTicket(page);

  // 2 · venv (kiosco superior derecho).
  await walkPath(page, [P.pasilloIzq, P.anilloIzq, P.anilloArriba, P.anilloArribaDer, P.anilloDer, P.pasilloDer, P.derArribaEsquina, P.derArribaLado, P.derArriba]);
  await openTerminal(page);
  await typeLine(page, 'cd puente');
  await typeLine(page, 'python -m venv .venv');
  await typeLine(page, 'ls');
  expect(await output(page)).toContain('.venv/');
  await typeLine(page, 'source .venv/bin/activate');
  await finishTicket(page);

  // 3 · Dependencias (kiosco inferior izquierdo): pip fuera del venv primero.
  await walkPath(page, [P.derArribaLado, P.derArribaEsquina, P.pasilloDer, P.anilloDer, P.anilloAbajoDer, P.anilloAbajoIzq, P.anilloIzq, P.pasilloIzq, P.izqAbajo]);
  await openTerminal(page);
  await typeLine(page, 'pip install -r requirements.txt');
  expect(await output(page)).toContain('fuera de un entorno virtual');
  await typeLine(page, 'source .venv/bin/activate');
  await typeLine(page, 'pip install -r requirements.txt');
  expect(await output(page)).toContain('Successfully installed arca-bridge rich');
  await finishTicket(page);

  // 4 · Deploy (kiosco inferior derecho).
  await walkPath(page, [P.pasilloIzq, P.anilloIzq, P.anilloAbajoIzq, P.anilloAbajoDer, P.anilloDer, P.pasilloDer, P.derAbajoEsquina, P.derAbajoLado, P.derAbajo]);
  await openTerminal(page);
  await typeLine(page, 'python puente.py --restore all');
  expect(await output(page)).toContain('ConfigError');
  await typeLine(page, 'python puente.py --check');
  await typeLine(page, 'python puente.py --fix-config');
  await typeLine(page, 'python puente.py --restore all');
  expect(await output(page)).toContain('Restaurando conciencias 100%');
  await finishTicket(page);

  const progress = await page.evaluate(() => window.__debug!.progress());
  expect(progress.completados).toEqual(expect.arrayContaining(['a3-01-explorar', 'a3-02-venv', 'a3-03-deps', 'a3-04-deploy']));
  await expect.poll(async () => (await dialog(page))?.id ?? null).toBe('acto3_fin');
  await closeDialog(page);

  expect(errors).toEqual([]);
});
