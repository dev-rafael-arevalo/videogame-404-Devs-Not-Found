import { AUDIO_OPTIONS_KEY, parseAudioOptions, serializeAudioOptions, type AudioOptions } from './options';
import { SFX, playSfx } from './sfx';
import { getSong } from './songs';
import { ChipSynth, MusicPlayer } from './synth';

const FADE_S = 0.3;

export interface PlayMusicOptions {
  /** Canción que sigue cuando esta termina (solo para las que no hacen loop). */
  next?: string;
}

export interface AudioSnapshot {
  musica: string | null;
  pendiente: string | null;
  estado: string;
  ultimoSfx: string | null;
  sfxReproducidos: number;
  opciones: AudioOptions;
  /** Nivel RMS de la salida (0–1): sirve para comprobar que de verdad suena algo. */
  nivel: number;
}

/**
 * Único punto de entrada al audio (spec 006). Las escenas nunca tocan Web Audio directamente.
 * El contexto se crea en `unlock()`, con la primera interacción, porque los navegadores bloquean el
 * autoplay; hasta entonces la pista pedida queda pendiente.
 */
export class AudioManager {
  private ctx: AudioContext | null = null;
  private synth: ChipSynth | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private current: MusicPlayer | null = null;
  private currentId: string | null = null;
  private pending: { id: string; options: PlayMusicOptions } | null = null;
  private options: AudioOptions;
  private lastSfx: string | null = null;
  private sfxCount = 0;

  constructor(private readonly storage: Pick<Storage, 'getItem' | 'setItem'> | null = safeStorage()) {
    this.options = parseAudioOptions(readStorage(this.storage));
  }

  /** Llamar en la primera interacción (click o tecla). Es idempotente. */
  unlock(): void {
    if (!this.ctx) {
      const Ctx = window.AudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.musicGain.connect(this.analyser);
      this.sfxGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.applyVolumes();
      this.synth = new ChipSynth(this.ctx, this.musicGain);
    }
    if (this.ctx.state !== 'running') {
      void this.ctx.resume().then(() => this.flushPending());
    } else {
      this.flushPending();
    }
  }

  playMusic(id: string, options: PlayMusicOptions = {}): void {
    if (!this.ready()) {
      this.pending = { id, options };
      return;
    }
    if (this.currentId === id && this.current) return;
    const song = getSong(id);
    this.current?.stop(FADE_S);
    const player = new MusicPlayer(this.ctx!, this.synth!, this.musicGain!, song, () => {
      if (this.current === player) {
        this.current = null;
        this.currentId = null;
        if (options.next) this.playMusic(options.next);
      }
    });
    this.current = player;
    this.currentId = id;
    this.pending = null;
    player.start();
  }

  stopMusic(): void {
    this.pending = null;
    this.current?.stop(FADE_S);
    this.current = null;
    this.currentId = null;
  }

  playSfx(name: string): void {
    const def = SFX[name];
    if (!def) {
      console.warn(`Efecto de sonido desconocido: ${name}`);
      return;
    }
    this.lastSfx = name;
    this.sfxCount += 1;
    if (this.ready()) playSfx(this.ctx!, this.sfxGain!, def);
  }

  getOptions(): AudioOptions {
    return { ...this.options };
  }

  setMusicVolume(value: number): void {
    this.options = parseAudioOptions(serializeAudioOptions({ ...this.options, musica: value }));
    this.applyVolumes();
    this.persist();
  }

  setSfxVolume(value: number): void {
    this.options = parseAudioOptions(serializeAudioOptions({ ...this.options, sfx: value }));
    this.applyVolumes();
    this.persist();
  }

  /** Para `window.__debug`. */
  snapshot(): AudioSnapshot {
    return {
      musica: this.currentId,
      pendiente: this.pending?.id ?? null,
      estado: this.ctx?.state ?? 'sin-contexto',
      ultimoSfx: this.lastSfx,
      sfxReproducidos: this.sfxCount,
      opciones: this.getOptions(),
      nivel: this.level(),
    };
  }

  private level(): number {
    if (!this.analyser) return 0;
    const data = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(data);
    let sum = 0;
    for (const sample of data) sum += sample * sample;
    return Math.sqrt(sum / data.length);
  }

  private ready(): boolean {
    return this.ctx !== null && this.ctx.state === 'running' && this.synth !== null;
  }

  private flushPending(): void {
    const pending = this.pending;
    if (pending) {
      this.pending = null;
      this.playMusic(pending.id, pending.options);
    }
  }

  private applyVolumes(): void {
    if (this.musicGain) this.musicGain.gain.value = this.options.musica;
    if (this.sfxGain) this.sfxGain.gain.value = this.options.sfx;
  }

  private persist(): void {
    try {
      this.storage?.setItem(AUDIO_OPTIONS_KEY, serializeAudioOptions(this.options));
    } catch {
      // Sin almacenamiento (modo privado, cuota): las opciones valen solo para esta sesión.
    }
  }
}

function safeStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function readStorage(storage: Pick<Storage, 'getItem'> | null): string | null {
  try {
    return storage?.getItem(AUDIO_OPTIONS_KEY) ?? null;
  } catch {
    return null;
  }
}

/** Instancia única del juego. */
export const audio = new AudioManager();
