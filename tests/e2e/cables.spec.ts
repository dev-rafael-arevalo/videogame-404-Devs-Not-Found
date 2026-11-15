import { expect, test, type Page } from '@playwright/test';
import { layoutPorts } from '../../src/logic/puzzles/cables';
import { PUZZLE_BOARD_AREA } from '../../src/puzzles/layout';
import { closeDialog, collectErrors, dragGame, enterWorld, promptVisible, walkToFirstTerminal } from './helpers';

interface Board {
  connections: Record<number, number>;
  solved: boolean;
}

interface TicketSnapshot {
  escena: string;
  resultado: { ganadas: number } | null;
  puzzle: { pistas: number; tablero: unknown } | null;
}

const ticket = (page: Page): Promise<TicketSnapshot | null> => page.evaluate(() => window.__debug?.ticket() ?? null);
const escena = async (page: Page): Promise<string | null> => (await ticket(page))?.escena ?? null;
const board = async (page: Page): Promise<Board> => (await ticket(page))!.puzzle!.tablero as Board;

test('cableado: un cable mal puesto no conecta, los tres correctos resuelven y la pista cuesta 10%', async ({ page }) => {
  const errors = collectErrors(page);
  await enterWorld(page);
  await closeDialog(page);
  await walkToFirstTerminal(page);
  await expect.poll(() => promptVisible(page)).toBe(true);
  await page.keyboard.press('e');
  await expect.poll(() => escena(page)).toBe('Briefing');
  await page.keyboard.press('Enter');
  await expect.poll(() => escena(page)).toBe('Puzzle');

  // Ticket a1-01: izquierda [rojo, azul, verde], derecha [azul, rojo, verde].
  const ports = layoutPorts(PUZZLE_BOARD_AREA, 3);

  // CA2: rojo (izq 0) → azul (der 0) se rechaza.
  await dragGame(page, ports.left[0]!, ports.right[0]!);
  expect((await board(page)).connections).toEqual({});

  // CA3: una pista de PATO.
  await page.keyboard.press('h');
  await expect.poll(async () => (await ticket(page))?.puzzle?.pistas).toBe(1);

  // Conexiones correctas, con una desconexión en el medio.
  await dragGame(page, ports.left[0]!, ports.right[1]!); // rojo
  expect((await board(page)).connections).toEqual({ 0: 1 });
  await dragGame(page, ports.left[0]!, ports.left[0]!); // tocar el puerto conectado lo suelta
  expect((await board(page)).connections).toEqual({});
  await dragGame(page, ports.left[0]!, ports.right[1]!); // rojo
  await dragGame(page, ports.left[1]!, ports.right[0]!); // azul
  await dragGame(page, ports.left[2]!, ports.right[2]!); // verde

  await expect.poll(() => escena(page)).toBe('Result');
  expect((await ticket(page))!.resultado!.ganadas).toBe(1080);

  expect(errors).toEqual([]);
});
