/**
 * Generative Zen Audio Soundscape Module
 * Uses the Web Audio API to synthesize Japanese singing bowl (Rin 鈴) resonance,
 * gentle bamboo flute wind breezes, and subtle harmonic chimes with zero external audio assets.
 */

export class ZenAudio {
  constructor(toggleBtnId = 'audio-toggle') {
    this.btn = document.getElementById(toggleBtnId);
    this.ctx = null;
    this.isPlaying = false;
    this.ambientGain = null;
    this.noiseNode = null;
    this.filterNode = null;

    this.init();
  }

  init() {
    if (!this.btn) return;

    this.btn.addEventListener('click', () => {
      this.toggle();
    });

    // Gentle chime on first user click anywhere after enabling
    window.addEventListener('click', (e) => {
      if (this.isPlaying && !e.target.closest('#audio-toggle')) {
        if (Math.random() < 0.25) {
          this.playBellTone(523.25); // C5 harmonic
        }
      }
    });
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.ensureContext();

    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isPlaying = true;
    this.btn.classList.add('playing');
    this.btn.querySelector('.audio-label').textContent = 'SOUND ON';

    // Start continuous soothing wind breeze
    this.startWindBreeze();

    // Play initial resonant singing bowl greeting
    this.playSingingBowl(261.63); // Middle C (C4)
  }

  stop() {
    this.isPlaying = false;
    this.btn.classList.remove('playing');
    this.btn.querySelector('.audio-label').textContent = 'SOUND';

    if (this.ambientGain) {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        if (this.noiseNode) {
          try { this.noiseNode.stop(); } catch (e) {}
        }
      }, 1200);
    }
  }

  startWindBreeze() {
    // Generate pink noise buffer for soft organic wind
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.035;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Resonant low-pass filter to sound like gentle mountain air
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 2.5);

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    this.noiseNode.start();
  }

  playSingingBowl(fundamental = 261.63) {
    if (!this.ctx) return;

    // A singing bowl emits fundamental + non-integer acoustic overtones
    const harmonics = [
      { freqRatio: 1.0, gain: 0.35, decay: 7.0 },
      { freqRatio: 2.76, gain: 0.18, decay: 5.5 },
      { freqRatio: 5.4, gain: 0.08, decay: 4.0 },
      { freqRatio: 8.9, gain: 0.04, decay: 2.8 },
    ];

    const masterGain = this.ctx.createGain();
    masterGain.connect(this.ctx.destination);

    harmonics.forEach((h) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * h.freqRatio, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(h.gain, this.ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + h.decay);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + h.decay + 0.1);
    });
  }

  playBellTone(freq = 523.25) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.3);
  }
}
