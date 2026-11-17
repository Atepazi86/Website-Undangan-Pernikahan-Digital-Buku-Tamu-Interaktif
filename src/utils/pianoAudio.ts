// Soft Felt-Piano Web Audio API synthesizer for romantic background music
// Zero external MP3 dependencies — plays reliably on user interaction.

const STEP_DURATION_SEC = 0.62;

// Romantic progression in F Major: Fmaj7 -> Dm9 -> Bbmaj7 -> C6
const MELODY_SEQUENCE: Array<{ notes: number[]; bass?: number }> = [
  // Bar 1: Fmaj7
  { notes: [349.23], bass: 174.61 }, // F4 + F3
  { notes: [440.0] }, // A4
  { notes: [523.25] }, // C5
  { notes: [659.25] }, // E5
  { notes: [523.25] }, // C5
  { notes: [440.0] }, // A4
  // Bar 2: Dm9
  { notes: [293.66], bass: 146.83 }, // D4 + D3
  { notes: [440.0] }, // A4
  { notes: [523.25] }, // C5
  { notes: [659.25] }, // E5
  { notes: [587.33] }, // D5
  { notes: [440.0] }, // A4
  // Bar 3: Bbmaj7
  { notes: [349.23], bass: 116.54 }, // F4 + Bb2
  { notes: [440.0] }, // A4
  { notes: [466.16] }, // Bb4
  { notes: [587.33] }, // D5
  { notes: [698.46] }, // F5
  { notes: [587.33] }, // D5
  // Bar 4: C6 / Csus4 -> C
  { notes: [392.0], bass: 130.81 }, // G4 + C3
  { notes: [440.0] }, // A4
  { notes: [523.25] }, // C5
  { notes: [659.25] }, // E5
  { notes: [587.33] }, // D5
  { notes: [523.25] }, // C5
];

class FeltPianoPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private timerId: number | null = null;
  private stepIndex = 0;
  private playing = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      // Gentle low-pass filter for warm felt-piano character
      const warmthFilter = this.ctx.createBiquadFilter();
      warmthFilter.type = 'lowpass';
      warmthFilter.frequency.setValueAtTime(1450, this.ctx.currentTime);
      warmthFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      // Subtle ambient echo tail
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.36, this.ctx.currentTime);
      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.28, this.ctx.currentTime);
      const wetGain = this.ctx.createGain();
      wetGain.gain.setValueAtTime(0.24, this.ctx.currentTime);

      this.delayNode.connect(feedback);
      feedback.connect(this.delayNode);
      this.delayNode.connect(wetGain);

      this.masterGain.connect(warmthFilter);
      warmthFilter.connect(this.ctx.destination);
      warmthFilter.connect(this.delayNode);
      wetGain.connect(this.ctx.destination);
    }

    return this.ctx;
  }

  private playNote(freq: number, volume: number, durationSec: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const oscMain = this.ctx.createOscillator();
    const oscOver = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    oscMain.type = 'sine';
    oscMain.frequency.setValueAtTime(freq, now);

    // Subtle soft harmonic layer one octave down or triangle color
    oscOver.type = 'triangle';
    oscOver.frequency.setValueAtTime(freq, now);

    const overGain = this.ctx.createGain();
    overGain.gain.setValueAtTime(0.18, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(volume, now + 0.035);
    noteGain.gain.exponentialRampToValueAtTime(volume * 0.45, now + 0.35);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    oscMain.connect(noteGain);
    oscOver.connect(overGain);
    overGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    oscMain.start(now);
    oscOver.start(now);
    oscMain.stop(now + durationSec + 0.05);
    oscOver.stop(now + durationSec + 0.05);
  }

  private triggerStep() {
    if (!this.playing || !this.ctx) return;
    const step = MELODY_SEQUENCE[this.stepIndex % MELODY_SEQUENCE.length];

    if (step.bass) {
      this.playNote(step.bass, 0.22, STEP_DURATION_SEC * 4.5);
    }
    step.notes.forEach((freq) => {
      this.playNote(freq, 0.17, STEP_DURATION_SEC * 2.6);
    });

    this.stepIndex = (this.stepIndex + 1) % MELODY_SEQUENCE.length;
  }

  public async start(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return false;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (this.playing) return true;
    this.playing = true;

    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.001), now);
    this.masterGain.gain.linearRampToValueAtTime(0.55, now + 0.8);

    this.triggerStep();
    this.timerId = window.setInterval(() => {
      this.triggerStep();
    }, STEP_DURATION_SEC * 1000);

    return true;
  }

  public pause(): void {
    this.playing = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
    }
  }

  public async toggle(): Promise<boolean> {
    if (this.playing) {
      this.pause();
      return false;
    }
    return this.start();
  }

  public isPlaying(): boolean {
    return this.playing;
  }
}

export const pianoPlayer = new FeltPianoPlayer();
