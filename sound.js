class SoundEngine {
  constructor() {
    this.ctx     = null;
    this.enabled = true;
  }

  /** Lazy-initialize AudioContext on first user gesture */
  _init() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  setEnabled(v) { this.enabled = v; }
  isEnabled()   { return this.enabled; }

  /** UI click tick */
  playClick() {
    if (!this.enabled) return;
    this._init(); if (!this.ctx) return;
    try {
      const { ctx } = this;
      const now = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.06);
    } catch {}
  }

  /** Rising chime for correct answer */
  playCorrect() {
    if (!this.enabled) return;
    this._init(); if (!this.ctx) return;
    try {
      const { ctx } = this;
      const now  = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      gain.connect(ctx.destination);
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i < 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        osc.connect(gain);
        osc.start(now + i * 0.08);
        osc.stop(now + 0.5);
      });
    } catch {}
  }

  /** Low sawtooth thud for wrong answer */
  playWrong() {
    if (!this.enabled) return;
    this._init(); if (!this.ctx) return;
    try {
      const { ctx } = this;
      const now  = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.36);
    } catch {}
  }

  /** Ascending arpeggio fanfare for level up */
  playLevelUp() {
    if (!this.enabled) return;
    this._init(); if (!this.ctx) return;
    try {
      const { ctx } = this;
      const now   = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.11, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.28);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.30);
      });
    } catch {}
  }

  /** Percussive impact for boss hit */
  playBossHit() {
    if (!this.enabled) return;
    this._init(); if (!this.ctx) return;
    try {
      const { ctx } = this;
      const now  = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.28);
      gain.gain.setValueAtTime(0.26, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.30);
    } catch {}
  }

  /** Bright rising tone for heart gain */
  playHeartGain() {
    if (!this.enabled) return;
    this._init(); if (!this.ctx) return;
    try {
      const { ctx } = this;
      const now  = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.26);
    } catch {}
  }
}

// Singleton export
const sound = new SoundEngine();
