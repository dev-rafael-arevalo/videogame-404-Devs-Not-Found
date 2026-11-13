import { noteToFrequency, parseTrack, type Drum, type NoteEvent } from './notation';
import { CHANNELS, type Channel, type Song } from './songs';

/**
 * Sintetizador estilo NES sobre Web Audio (spec 014): dos pulsos (ciclo 25% y 12,5%), triángulo y
 * ruido para percusión. Todo se genera en el momento; no hay archivos de audio.
 */

const CHANNEL_GAIN: Record<Channel, number> = { pulso1: 0.16, pulso2: 0.1, triangulo: 0.3, ruido: 0.22 };
const ATTACK = 0.004;
const RELEASE = 0.015;
/** Fracción de la duración de la nota que suena (el resto es silencio, para articular). */
const GATE = 0.88;

const DRUMS: Record<Drum, { type: BiquadFilterType; frequency: number; decay: number; gain: number }> = {
  K: { type: 'lowpass', frequency: 180, decay: 0.12, gain: 1 },
  S: { type: 'bandpass', frequency: 1800, decay: 0.11, gain: 0.7 },
  H: { type: 'highpass', frequency: 7000, decay: 0.035, gain: 0.35 },
};

function pulseWave(ctx: BaseAudioContext, duty: number, harmonics = 32): PeriodicWave {
  const real = new Float32Array(harmonics + 1);
  const imag = new Float32Array(harmonics + 1);
  for (let n = 1; n <= harmonics; n += 1) {
    real[n] = Math.sin(2 * Math.PI * n * duty) / (n * Math.PI);
    imag[n] = (1 - Math.cos(2 * Math.PI * n * duty)) / (n * Math.PI);
  }
  return ctx.createPeriodicWave(real, imag, { disableNormalization: false });
}

function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  const length = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export class ChipSynth {
  private readonly pulse25: PeriodicWave;
  private readonly pulse12: PeriodicWave;
  private readonly noise: AudioBuffer;

  constructor(
    private readonly ctx: BaseAudioContext,
    private readonly output: AudioNode,
  ) {
    this.pulse25 = pulseWave(ctx, 0.25);
    this.pulse12 = pulseWave(ctx, 0.125);
    this.noise = noiseBuffer(ctx);
  }

  playNote(channel: Exclude<Channel, 'ruido'>, note: string, time: number, duration: number, gain = 1): void {
    const osc = this.ctx.createOscillator();
    if (channel === 'triangulo') osc.type = 'triangle';
    else osc.setPeriodicWave(channel === 'pulso1' ? this.pulse25 : this.pulse12);
    osc.frequency.value = noteToFrequency(note);

    const env = this.ctx.createGain();
    const level = CHANNEL_GAIN[channel] * gain;
    const end = time + Math.max(ATTACK + RELEASE, duration * GATE);
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(level, time + ATTACK);
    env.gain.setValueAtTime(level, end - RELEASE);
    env.gain.linearRampToValueAtTime(0, end);

    osc.connect(env).connect(this.output);
    osc.start(time);
    osc.stop(end + 0.01);
  }

  playDrum(drum: Drum, time: number, gain = 1): void {
    const spec = DRUMS[drum];
    const source = this.ctx.createBufferSource();
    source.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = spec.type;
    filter.frequency.value = spec.frequency;
    const env = this.ctx.createGain();
    const level = CHANNEL_GAIN.ruido * spec.gain * gain;
    env.gain.setValueAtTime(level, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + spec.decay);
    source.connect(filter).connect(env).connect(this.output);
    source.start(time);
    source.stop(time + spec.decay + 0.01);
  }
}

const LOOKAHEAD_S = 0.12;
const TICK_MS = 30;

/** Reproduce una canción con planificación por adelantado; el loop empalma por paso, sin clic. */
export class MusicPlayer {
  readonly gain: GainNode;
  private readonly events: Record<Channel, Map<number, NoteEvent[]>>;
  private readonly secondsPerStep: number;
  private nextStep = 0;
  private nextStepTime = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private stopped = false;

  constructor(
    private readonly ctx: AudioContext,
    private readonly synth: ChipSynth,
    output: AudioNode,
    readonly song: Song,
    private readonly onEnded?: () => void,
  ) {
    this.gain = ctx.createGain();
    this.gain.connect(output);
    this.secondsPerStep = 60 / song.bpm / 4;
    this.events = {} as Record<Channel, Map<number, NoteEvent[]>>;
    for (const channel of CHANNELS) {
      const map = new Map<number, NoteEvent[]>();
      for (const event of parseTrack(song.canales[channel])) {
        map.set(event.step, [...(map.get(event.step) ?? []), event]);
      }
      this.events[channel] = map;
    }
  }

  start(at = this.ctx.currentTime + 0.05): void {
    this.nextStep = 0;
    this.nextStepTime = at;
    this.timer = setInterval(() => this.tick(), TICK_MS);
    this.tick();
  }

  /** Funde y detiene. */
  stop(fadeSeconds = 0): void {
    if (this.stopped) return;
    this.stopped = true;
    if (this.timer !== null) clearInterval(this.timer);
    const now = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);
    this.gain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
    setTimeout(() => this.gain.disconnect(), fadeSeconds * 1000 + 50);
  }

  private tick(): void {
    while (!this.stopped && this.nextStepTime < this.ctx.currentTime + LOOKAHEAD_S) {
      this.scheduleStep(this.nextStep, this.nextStepTime);
      this.nextStep += 1;
      this.nextStepTime += this.secondsPerStep;
      if (this.nextStep >= this.song.length) {
        if (this.song.loop) {
          this.nextStep = 0;
        } else {
          const remaining = Math.max(0, (this.nextStepTime - this.ctx.currentTime) * 1000);
          if (this.timer !== null) clearInterval(this.timer);
          this.timer = null;
          setTimeout(() => {
            if (!this.stopped) {
              this.stop(0.05);
              this.onEnded?.();
            }
          }, remaining);
          return;
        }
      }
    }
  }

  private scheduleStep(step: number, time: number): void {
    for (const channel of CHANNELS) {
      const events = this.events[channel].get(step);
      if (!events) continue;
      for (const event of events) {
        if (event.drum) this.synth.playDrum(event.drum, time);
        else if (event.note && channel !== 'ruido') {
          this.synth.playNote(channel, event.note, time, event.steps * this.secondsPerStep);
        }
      }
    }
  }
}
