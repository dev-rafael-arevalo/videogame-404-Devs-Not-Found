import { CablesPuzzle } from './CablesPuzzle';
import { PlaceholderPuzzle } from './PlaceholderPuzzle';
import type { PuzzleFactory, PuzzleView } from './PuzzleView';

/** Tipo de ticket → vista del puzzle. Cada spec de puzzle registra el suyo acá. */
const PUZZLES: Record<string, PuzzleFactory> = {
  cables: () => new CablesPuzzle(),
};

export function registerPuzzle(tipo: string, factory: PuzzleFactory): void {
  PUZZLES[tipo] = factory;
}

export function hasPuzzle(tipo: string): boolean {
  return tipo in PUZZLES;
}

/** La vista del tipo, o el placeholder si todavía no existe (spec 004). */
export function createPuzzleView(tipo: string): PuzzleView {
  const factory = PUZZLES[tipo];
  return factory ? factory() : new PlaceholderPuzzle();
}
