/**
 * Philosophy (Kintsugi 金継ぎ) Interaction Module
 * Mends an exploded, fractured Raku Chawan tea bowl using GSAP ScrollTrigger
 * and Anime.js stroke-dashoffset illumination along organic fault lines,
 * accompanied by shimmering gold leaf dust (Kinsunago) canvas particles.
 */

export class KintsugiExperience {
  constructor() {
    this.container = document.getElementById('kintsugi-container');
    this.shards = document.querySelectorAll('.chawan-shard');
    this.veins = document.querySelectorAll('.gold-vein');
    this.slider = document.getElementById('kintsugi-slider');
    this.percentLabel = document.getElementById('kintsugi-percent');
    this.dustCanvas = document.getElementById('kintsugi-dust-canvas');

    this.veinLengths = [];
    this.goldDust = [];
    this.currentProgress = 0;
    this.isManualScrubbing = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    this.measureVeins();
    this.initDustCanvas();
    this.setupScrollTrigger();
    this.bindControls();
    this.updateRestorationState(0);
  }

  measureVeins() {
    // Record original path lengths for Anime.js stroke-dashoffset interpolation
    this.veinLengths = [];
    this.veins.forEach((vein) => {
      const len = vein.getTotalLength();
      this.veinLengths.push(len);
      vein.style.strokeDasharray = len;
      vein.style.strokeDashoffset = len;
    });
  }

  setupScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: '#kintsugi',
      start: 'top 70%',
      end: 'bottom 40%',
      scrub: 1.2,
      onUpdate: (self) => {
        if (!this.isManualScrubbing) {
          const progress = self.progress;
          this.updateRestorationState(progress);
          if (this.slider) {
            this.slider.value = Math.round(progress * 100);
          }
        }
      },
    });
  }

  bindControls() {
    if (!this.slider) return;

    this.slider.addEventListener('input', (e) => {
      this.isManualScrubbing = true;
      const progress = parseFloat(e.target.value) / 100;
      this.updateRestorationState(progress);
    });

    this.slider.addEventListener('change', () => {
      // Re-enable scroll sync after a brief rest
      setTimeout(() => {
        this.isManualScrubbing = false;
      }, 1000);
    });
  }

  updateRestorationState(progress) {
    this.currentProgress = Math.max(0, Math.min(1, progress));
    const percent = Math.round(this.currentProgress * 100);

    // 1. Update text label
    if (this.percentLabel) {
      if (percent < 20) {
        this.percentLabel.textContent = `${percent}% FRACTURED (破片)`;
      } else if (percent < 70) {
        this.percentLabel.textContent = `${percent}% URUSHI JOINERY (漆接合)`;
      } else {
        this.percentLabel.textContent = `${percent}% GOLD ILLUMINATION (金継ぎ完了)`;
      }
    }

    // 2. Displace or draw shards together
    // Phase 1: 0.0 -> 0.5 draws shards from exploded position to 0,0
    const shardProgress = Math.min(1, this.currentProgress / 0.5);
    const inverseShard = 1 - shardProgress;

    const shardTransforms = {
      'shard-a': { x: -35 * inverseShard, y: -28 * inverseShard, r: -6 * inverseShard },
      'shard-b': { x: 6 * inverseShard, y: -36 * inverseShard, r: 3 * inverseShard },
      'shard-c': { x: 38 * inverseShard, y: -18 * inverseShard, r: 8 * inverseShard },
      'shard-d': { x: -28 * inverseShard, y: 22 * inverseShard, r: -4 * inverseShard },
      'shard-e': { x: 25 * inverseShard, y: 26 * inverseShard, r: 5 * inverseShard },
    };

    this.shards.forEach((shard) => {
      const id = shard.id;
      if (shardTransforms[id]) {
        const t = shardTransforms[id];
        shard.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) rotate(${t.r}deg)`;
      }
    });

    // 3. Draw glowing gold veins via Anime.js / dashoffset
    // Phase 2: 0.3 -> 1.0 traces the gold veins
    const veinProgress = Math.max(0, (this.currentProgress - 0.25) / 0.75);

    this.veins.forEach((vein, i) => {
      const len = this.veinLengths[i] || 400;
      const targetOffset = len * (1 - veinProgress);
      vein.style.strokeDashoffset = targetOffset;
      vein.style.opacity = veinProgress > 0 ? 1 : 0.2;
    });

    // Spawn gold dust when repairing
    if (this.currentProgress > 0.3 && Math.random() < 0.5) {
      this.spawnGoldDust();
    }
  }

  initDustCanvas() {
    if (!this.dustCanvas) return;
    const ctx = this.dustCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = this.dustCanvas.getBoundingClientRect();
      this.dustCanvas.width = rect.width * dpr;
      this.dustCanvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const rect = this.dustCanvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = this.goldDust.length - 1; i >= 0; i--) {
        const d = this.goldDust[i];
        d.x += d.vx;
        d.y += d.vy;
        d.life -= d.decay;

        if (d.life <= 0) {
          this.goldDust.splice(i, 1);
          continue;
        }

        // Shimmering gold leaf fleck
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rotation);
        ctx.fillStyle = `rgba(212, 175, 55, ${d.alpha * d.life})`;
        ctx.shadowColor = '#FDF0A6';
        ctx.shadowBlur = 8;
        ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size * 0.7);
        ctx.restore();
      }

      requestAnimationFrame(render);
    };

    render();
  }

  spawnGoldDust() {
    const rect = this.dustCanvas.getBoundingClientRect();
    // Emit around bowl fractures (center zone)
    const centerX = rect.width * 0.5 + (Math.random() - 0.5) * 200;
    const centerY = rect.height * 0.5 + (Math.random() - 0.5) * 160;

    for (let i = 0; i < 3; i++) {
      this.goldDust.push({
        x: centerX + (Math.random() - 0.5) * 30,
        y: centerY + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.5 - 0.4,
        size: Math.random() * 3.5 + 1.5,
        rotation: Math.random() * Math.PI,
        alpha: Math.random() * 0.8 + 0.2,
        decay: 0.015 + Math.random() * 0.02,
        life: 1.0,
      });
    }

    if (this.goldDust.length > 80) {
      this.goldDust.shift();
    }
  }
}
