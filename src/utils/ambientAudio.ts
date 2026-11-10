class AmbientSoundscape {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private gainNode: GainNode | null = null;

  // Traditional Vietnamese pentatonic scale notes (Hò, Xự, Xang, Xê, Cống in C: C4, D4, F4, G4, A4, C5)
  private pentatonicFreqs = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46];

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      this.isPlaying = true;
      this.scheduleNextNote();
    } catch {
      this.isPlaying = false;
    }
  }

  private scheduleNextNote() {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;

    const freq = this.pentatonicFreqs[Math.floor(Math.random() * this.pentatonicFreqs.length)];
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm envelope resembling acoustic strings / bamboo chime
    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.06, now + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + 2.3);

    const delay = Math.random() * 1800 + 1200;
    this.timer = window.setTimeout(() => this.scheduleNextNote(), delay);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      this.ctx.suspend();
    }
  }
}

export const ambientSound = new AmbientSoundscape();
