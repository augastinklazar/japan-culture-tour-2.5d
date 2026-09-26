/**
 * ============================================================================
 * WindSystem.js — Unified Japanese Atmospheric Wind Engine
 * ============================================================================
 * Manages reactive wind physics, transient calligraphic Bézier streamlines
 * (Kaze-sen 風線), and 2D procedural drifting particles (Matsu pine needles,
 * Kinpaku gold leaf flakes, and Sakura petals).
 *
 * Integrates directly with Lenis scroll velocity, Zdog 2.5D element swaying,
 * and background SVG cloud acceleration.
 */

export class WindSystem {
  constructor(canvasId = 'wind-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 1. Core Wind Physics State
    this.state = {
      baseSpeed: 1.2,
      gustForce: 0,
      currentVelocity: 1.2,
      angle: Math.PI / 12, // 15-degree gentle downward slant from left to right
      cosAngle: Math.cos(Math.PI / 12),
      sinAngle: Math.sin(Math.PI / 12),
    };

    // 2. Visual Wind Streamlines (Kaze-sen 風線)
    this.streamlines = [];
    this.maxStreamlines = 12;
    this.streamlineTimer = 0;

    // 3. Drifting Flakes & Petals (25–40 Procedural Elements)
    this.particles = [];
    this.numParticles = 32;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.init();
  }

  init() {
    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    // Interactive cursor wind gust: swift mouse flicks generate subtle gusts
    let prevX = 0;
    let prevY = 0;
    let lastTime = Date.now();

    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      const dt = Math.max(now - lastTime, 1);
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      const speed = Math.hypot(dx, dy) / dt;

      if (speed > 1.8) {
        this.addGust(Math.min(speed * 0.4, 2.5));
      }

      prevX = e.clientX;
      prevY = e.clientY;
      lastTime = now;
    });
  }

  /**
   * Hook called on Lenis scroll updates to inject kinetic wind energy
   * @param {number} scrollVelocity - Absolute scroll delta from Lenis
   */
  onScroll(scrollVelocity) {
    const intensity = Math.min(Math.abs(scrollVelocity) * 0.14, 6.5);
    if (intensity > 0.15) {
      this.addGust(intensity);
    }
  }

  addGust(force) {
    this.state.gustForce = Math.min(this.state.gustForce + force, 9.0);

    // Spawn calligraphic wind sweeps when a gust hits
    if (Math.random() < 0.65 && this.streamlines.length < this.maxStreamlines) {
      this.spawnStreamline(true);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * PROCEDURAL PARTICLES: Pine Needles, Gold Leaf, Sakura Petals
   * --------------------------------------------------------------------------
   */
  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(randomInitialX = false) {
    const types = ['matsu', 'kinpaku', 'sakura'];
    // Weighted distribution: 45% gold leaf flecks, 35% pine needles, 20% sakura
    const rand = Math.random();
    const type = rand < 0.45 ? 'kinpaku' : rand < 0.8 ? 'matsu' : 'sakura';

    const depth = 0.6 + Math.random() * 0.8; // 2.5D visual depth scale

    return {
      type,
      x: randomInitialX ? Math.random() * this.width : -40 - Math.random() * 80,
      y: Math.random() * this.height,
      depth,
      mass: 0.7 + Math.random() * 0.7,
      size: type === 'kinpaku' ? 3 + Math.random() * 4.5 : type === 'matsu' ? 14 + Math.random() * 8 : 9 + Math.random() * 6,
      // 3D Tumbling rotational kinematics
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      rotSpeedX: (Math.random() - 0.5) * 0.05,
      rotSpeedY: (Math.random() - 0.5) * 0.04,
      rotSpeedZ: (Math.random() - 0.5) * 0.06,
      // Cross-wind oscillation parameters
      oscPhase: Math.random() * Math.PI * 2,
      oscSpeed: 1.2 + Math.random() * 1.8,
      oscAmp: 1.0 + Math.random() * 2.2,
      // Color & Opacity
      alpha: 0.35 + Math.random() * 0.45,
    };
  }

  /**
   * --------------------------------------------------------------------------
   * VISUAL WIND STREAMLINES (Kaze-sen 風線)
   * --------------------------------------------------------------------------
   * Transient Bézier paths simulating traditional Japanese woodblock wind sweeps.
   */
  spawnStreamline(isGust = false) {
    const length = 180 + Math.random() * 280 + (isGust ? 120 : 0);
    const startX = -60 + Math.random() * (this.width * 0.7);
    const startY = Math.random() * this.height;

    // Cubic Bézier control points oriented with the wind vector + organic curl
    const p0 = { x: startX, y: startY };
    const p1 = {
      x: startX + length * 0.35 * this.state.cosAngle + (Math.random() - 0.5) * 40,
      y: startY + length * 0.35 * this.state.sinAngle - (Math.random() * 30 + 15),
    };
    const p2 = {
      x: startX + length * 0.7 * this.state.cosAngle + (Math.random() - 0.5) * 40,
      y: startY + length * 0.7 * this.state.sinAngle + (Math.random() * 25 - 10),
    };
    const p3 = {
      x: startX + length * this.state.cosAngle,
      y: startY + length * this.state.sinAngle,
    };

    this.streamlines.push({
      p0,
      p1,
      p2,
      p3,
      life: 0,
      maxLife: 55 + Math.random() * 45,
      width: 1.4 + Math.random() * 1.8,
      tint: Math.random() < 0.6 ? 'rgba(255, 255, 251, ' : 'rgba(28, 28, 28, ',
      maxAlpha: isGust ? 0.35 : 0.22,
    });
  }

  /**
   * --------------------------------------------------------------------------
   * MAIN ANIMATION LOOP
   * --------------------------------------------------------------------------
   */
  animate() {
    // 1. Decay wind gust force smoothly towards 0 using linear interpolation
    this.state.gustForce += (0 - this.state.gustForce) * 0.038;
    this.state.currentVelocity = this.state.baseSpeed + this.state.gustForce;

    // 2. Clear canvas with high performance
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 3. Render and update Calligraphic Wind Streamlines
    this.renderStreamlines();

    // 4. Render and update Drifting Flakes & Petals
    this.renderParticles();

    // 5. Periodic streamline spawning based on wind speed
    this.streamlineTimer++;
    if (this.streamlineTimer > Math.max(25, 80 - this.state.currentVelocity * 10)) {
      this.streamlineTimer = 0;
      if (this.streamlines.length < this.maxStreamlines) {
        this.spawnStreamline();
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  renderStreamlines() {
    for (let i = this.streamlines.length - 1; i >= 0; i--) {
      const s = this.streamlines[i];
      s.life++;

      const progress = s.life / s.maxLife;
      if (progress >= 1.0) {
        this.streamlines.splice(i, 1);
        continue;
      }

      // Smooth sine fade-in and fade-out envelope
      const alpha = Math.sin(progress * Math.PI) * s.maxAlpha;

      // Draw tapered Bézier curve
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(s.p0.x, s.p0.y);
      this.ctx.bezierCurveTo(s.p1.x, s.p1.y, s.p2.x, s.p2.y, s.p3.x, s.p3.y);

      this.ctx.lineWidth = s.width * Math.sin(progress * Math.PI);
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = `${s.tint}${alpha})`;
      this.ctx.stroke();
      this.ctx.restore();

      // Drift streamline along wind vector
      const drift = this.state.currentVelocity * 2.2;
      s.p0.x += this.state.cosAngle * drift;
      s.p0.y += this.state.sinAngle * drift;
      s.p1.x += this.state.cosAngle * drift;
      s.p1.y += this.state.sinAngle * drift;
      s.p2.x += this.state.cosAngle * drift;
      s.p2.y += this.state.sinAngle * drift;
      s.p3.x += this.state.cosAngle * drift;
      s.p3.y += this.state.sinAngle * drift;
    }
  }

  renderParticles() {
    const windSpeed = this.state.currentVelocity;

    this.particles.forEach((p) => {
      // Harmonic cross-wind oscillation
      p.oscPhase += 0.03 * p.oscSpeed;
      const oscX = -this.state.sinAngle * Math.sin(p.oscPhase) * p.oscAmp;
      const oscY = this.state.cosAngle * Math.cos(p.oscPhase) * p.oscAmp;

      // Primary kinetic movement along wind vector
      const speed = (windSpeed * 1.8 * p.depth) / p.mass;
      p.x += this.state.cosAngle * speed + oscX;
      p.y += this.state.sinAngle * speed + oscY + 0.45 * p.mass; // gentle gravity

      // 3D Tumbling rotational progression
      p.rotX += p.rotSpeedX * (1 + windSpeed * 0.4);
      p.rotY += p.rotSpeedY * (1 + windSpeed * 0.4);
      p.rotZ += p.rotSpeedZ * (1 + windSpeed * 0.4);

      // Screen edge boundary wrapping
      if (p.x > this.width + 60) {
        p.x = -40;
        p.y = Math.random() * this.height;
      }
      if (p.y > this.height + 60) {
        p.y = -30;
        p.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotZ);
      this.ctx.scale(p.depth, p.depth * Math.cos(p.rotX)); // 2.5D tumbling compression

      if (p.type === 'kinpaku') {
        // Gold Leaf Fragment (Kinsunago 金砂子)
        this.ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        this.ctx.shadowColor = '#FDF0A6';
        this.ctx.shadowBlur = 4;
        this.ctx.beginPath();
        // Irregular torn gold-foil quad
        this.ctx.moveTo(-p.size / 2, -p.size / 2);
        this.ctx.lineTo(p.size / 2, -p.size / 3);
        this.ctx.lineTo(p.size / 3, p.size / 2);
        this.ctx.lineTo(-p.size / 3, p.size / 3);
        this.ctx.closePath();
        this.ctx.fill();
      } else if (p.type === 'matsu') {
        // Pine Needles (Matsu 松) — Double slender needle
        this.ctx.strokeStyle = `rgba(131, 138, 45, ${p.alpha * 1.1})`; // Uguisu-iro
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(p.size, -2);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(p.size * 0.9, 3);
        this.ctx.stroke();
      } else {
        // Single Sakura Petal (桜) — Translucent soft curved tear
        this.ctx.fillStyle = `rgba(255, 235, 238, ${p.alpha * 0.9})`;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size / 2);
        this.ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size / 2, p.size / 2, 0, p.size / 2);
        this.ctx.bezierCurveTo(-p.size / 2, p.size / 2, -p.size / 2, -p.size / 2, 0, -p.size / 2);
        this.ctx.fill();

        // Delicate crimson notch tip
        this.ctx.fillStyle = `rgba(203, 27, 69, ${p.alpha * 0.6})`;
        this.ctx.beginPath();
        this.ctx.arc(0, p.size / 2 - 1, 1, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    });
  }

  /**
   * Public Accessors for Zdog & Cloud coupling
   */
  getWindVelocity() {
    return this.state.currentVelocity;
  }

  getWindGust() {
    return this.state.gustForce;
  }

  getWindAngle() {
    return this.state.angle;
  }
}
