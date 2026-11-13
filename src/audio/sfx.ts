import sfxData from '../data/musica/sfx.json';

/** Efectos tipo sfxr (spec 014): parámetros en `sfx.json`, síntesis al vuelo. */

export interface SfxDef {
  onda: 'square' | 'triangle' | 'sawtooth' | 'sine' | 'noise';
  /** Frecuencia inicial y final (Hz). En `noise` es la frecuencia del filtro. */
  frecuencia: [number, number];
  duracion: number;
  volumen: number;
}

export const SFX: Readonly<Record<string, SfxDef>> = sfxData as unknown as Record<string, SfxDef>;

let noise: AudioBuffer | null = null;

function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  if (noise && noise.sampleRate === ctx.sampleRate) return noise;
  const length = Math.floor(ctx.sampleRate * 0.5);
  noise = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return noise;
}

export function playSfx(ctx: AudioContext, output: AudioNode, def: SfxDef): void {
  const now = ctx.currentTime;
  const end = now + def.duracion;
  const [f0, f1] = def.frecuencia;

  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(def.volumen, now + 0.005);
  env.gain.setValueAtTime(def.volumen, Math.max(now + 0.005, end - 0.02));
  env.gain.linearRampToValueAtTime(0, end);
  env.connect(output);

  if (def.onda === 'noise') {
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(f0, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(20, f1), end);
    source.connect(filter).connect(env);
    source.start(now);
    source.stop(end + 0.01);
    return;
  }

  const osc = ctx.createOscillator();
  osc.type = def.onda;
  osc.frequency.setValueAtTime(f0, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), end);
  osc.connect(env);
  osc.start(now);
  osc.stop(end + 0.01);
}
