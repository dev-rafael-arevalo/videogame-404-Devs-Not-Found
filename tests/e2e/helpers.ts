import { expect, type Page } from '@playwright/test';

export interface PlayerSnapshot {
  x: number;
  y: number;
  facing: string;
  anim: string | null;
}

export interface DialogSnapshot {
  id: string;
  quien: string;
  linea: number;
  pagina: number;
  revelado: boolean;
  texto: string;
}

export const player = (page: Page): Promise<PlayerSnapshot | null> =>
  page.evaluate(() => window.__debug?.player() ?? null);

export const dialog = (page: Page): Promise<DialogSnapshot | null> =>
  page.evaluate(() => window.__debug?.dialog() ?? null);

export const promptVisible = (page: Page): Promise<boolean> =>
  page.evaluate(() => window.__debug?.prompt() ?? false);

/** Registra errores de consola y de página en `errors`. */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

/** Boot → Título → Mundo. Deja el diálogo inicial abierto. */
export async function enterWorld(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Boot');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Title');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'World');
  await expect.poll(() => player(page)).not.toBeNull();
}

/** Pulsa E hasta que el diálogo se cierre (revela y pasa páginas). */
export async function closeDialog(page: Page): Promise<void> {
  for (let i = 0; i < 40 && (await dialog(page)) !== null; i += 1) {
    await page.keyboard.press('e');
    await page.waitForTimeout(60);
  }
  expect(await dialog(page)).toBeNull();
}

/** Mantiene una tecla hasta que `done` se cumpla (o se agote el tiempo). */
export async function holdUntil(page: Page, key: string, done: () => Promise<boolean>, timeoutMs = 4000): Promise<void> {
  await page.keyboard.down(key);
  const start = Date.now();
  while (!(await done()) && Date.now() - start < timeoutMs) {
    await page.waitForTimeout(40);
  }
  await page.keyboard.up(key);
}
