import { describe, expect, it } from 'vitest';
import { GAME_HEIGHT, GAME_WIDTH, integerZoom } from './scale';

describe('integerZoom', () => {
  it('a 1280×720 escala ×4 exacto', () => {
    expect(integerZoom(1280, 720)).toBe(4);
  });

  it('a 1920×1080 escala ×6', () => {
    expect(integerZoom(1920, 1080)).toBe(6);
  });

  it('usa el eje más restrictivo (ventana alta y angosta)', () => {
    expect(integerZoom(1000, 1000)).toBe(3);
  });

  it('nunca baja de ×1 aunque la ventana sea más chica que el juego', () => {
    expect(integerZoom(100, 100)).toBe(1);
    expect(integerZoom(0, 0)).toBe(1);
  });

  it('redondea hacia abajo: un píxel menos de ancho baja un nivel', () => {
    expect(integerZoom(1279, 720)).toBe(3);
  });

  it('acepta otra resolución base', () => {
    expect(integerZoom(640, 480, 320, 240)).toBe(2);
  });

  it('exporta la resolución nativa del juego', () => {
    expect(GAME_WIDTH).toBe(320);
    expect(GAME_HEIGHT).toBe(180);
  });
});
