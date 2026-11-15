import { expect, test, type Page } from '@playwright/test';
import { collectErrors } from './helpers';

interface DemoSnapshot {
  animacion: string;
  expresion: string;
  direccion: string;
  animActual: string | null;
  totalAnimaciones: number;
}

const demo = (page: Page): Promise<DemoSnapshot | null> => page.evaluate(() => window.__debug?.demo() ?? null);

test('CA2: /?demo recorre todas las animaciones, expresiones y direcciones sin errores', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?demo');
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'Demo');
  await expect.poll(() => demo(page)).not.toBeNull();

  const first = (await demo(page))!;
  expect(first.animacion).toBe('idle');
  expect(first.animActual).toBe('saradev-idle-down-normal');

  const seen = new Set<string>();
  for (let i = 0; i < first.totalAnimaciones; i += 1) {
    const snap = (await demo(page))!;
    expect(snap.animActual, snap.animacion).not.toBeNull();
    seen.add(snap.animacion);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(80);
  }
  expect(seen.size).toBe(first.totalAnimaciones);
  expect(seen).toContain('victory');
  expect(seen).toContain('type');

  // Expresiones: 8 distintas, cada una con su clave de idle.
  const expressions = new Set<string>();
  for (let i = 0; i < 8; i += 1) {
    const snap = (await demo(page))!;
    expressions.add(snap.expresion);
    expect(snap.animActual).toBe(`saradev-idle-down-${snap.expresion}`);
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(60);
  }
  expect(expressions.size).toBe(8);

  // Direcciones.
  await page.keyboard.press('d');
  await expect.poll(async () => (await demo(page))?.direccion).toBe('left');
  expect((await demo(page))!.animActual).toBe('saradev-idle-left-normal');

  expect(errors).toEqual([]);
});
