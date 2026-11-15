/**
 * Notación de pistas (spec 014). Sin Web Audio: se testea con Vitest.
 * Token `NOTA:duración` (duración en semicorcheas): `C4:4`, `A#3:2`, `Bb2:8`, `-:4` (silencio).
 * En el canal de ruido: `K` bombo, `S` caja, `H` hi-hat.
 */

export type Drum = 'K' | 'S' | 'H';

export interface NoteEvent {
  /** Semicorchea en la que empieza. */
  step: number;
  /** Duración en semicorcheas. */
  steps: number;
  note: string | null;
  drum: Drum | null;
}

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NOTE_RE = /^([A-G])([#b]?)(-?\d)$/;
const TOKEN_RE = /^([A-G][#b]?-?\d|[KSH]|-):(\d+)$/;

export function noteToFrequency(note: string): number {
  const match = NOTE_RE.exec(note);
  if (!match) throw new Error(`Nota inválida: ${note}`);
  const [, letter, accidental, octave] = match;
  const semitone = SEMITONES[letter!]! + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0);
  const midi = (Number(octave) + 1) * 12 + semitone;
  return 440 * 2 ** ((midi - 69) / 12);
}

export function parseTrack(text: string): NoteEvent[] {
  const events: NoteEvent[] = [];
  let step = 0;
  for (const token of text.split(/\s+/).filter((t) => t.length > 0)) {
    const match = TOKEN_RE.exec(token);
    if (!match) throw new Error(`Token inválido: ${token}`);
    const [, head, length] = match;
    const steps = Number(length);
    if (steps <= 0) throw new Error(`Duración inválida: ${token}`);
    if (head !== '-') {
      const isDrum = head === 'K' || head === 'S' || head === 'H';
      events.push({ step, steps, note: isDrum ? null : head!, drum: isDrum ? (head as Drum) : null });
    }
    step += steps;
  }
  return events;
}

/** Largo total de la pista en semicorcheas (silencios incluidos). */
export function trackLength(text: string): number {
  return text
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .reduce((total, token) => {
      const match = TOKEN_RE.exec(token);
      if (!match) throw new Error(`Token inválido: ${token}`);
      return total + Number(match[2]);
    }, 0);
}
