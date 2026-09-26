/**
 * Art & Ukiyo-e (浮世絵) Parallax Module
 * Coordinates multi-plane 2.5D depth across foreground waves, midground wasen boats,
 * and background Mt. Fuji using GSAP ScrollTrigger and dynamic sea spray particle physics.
 */

export class UkiyoParallax {
  constructor() {
    this.stage = document.getElementById('ukiyo-stage');
    this.layerBg = document.querySelector('.ukiyo-layer.layer-bg');
    this.layerMid = document.querySelector('.ukiyo-layer.layer-mid');
    this.layerFore = document.querySelector('.ukiyo-layer.layer-fore');
    this.sprayCanvas = document.getElementById('ukiyo-spray-canvas');

    this.particles = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.init();
  }

  init() {
    if (!this.stage) return;

    this.initScrollTrigger();
    this.initMouseParallax();
    this.initSprayCanvas();
    this.initWoodblockFilters();
  }

  initScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Timeline scrubbing through the Ukiyo-e section
    const ukiyoTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#ukiyo',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    // Background Layer (Mt. Fuji, Hinode Sun): Slowest translation (Deep Distance)
    ukiyoTl.to(
      this.layerBg,
      {
        yPercent: 12,
        scale: 1.05,
        ease: 'none',
      },
      0
    );

    // Midground Layer (Wasen Boats, Matsu Pines): Moderate translation
    ukiyoTl.to(
      this.layerMid,
      {
        yPercent: -18,
        xPercent: 3,
        ease: 'none',
      },
      0
    );

    // Boat bobbing animation
    gsap.to('.wasen-boat.boat-1', {
      y: -12,
      rotation: 3,
      transformOrigin: '50% 80%',
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.wasen-boat.boat-2', {
      y: -8,
      rotation: -2.5,
      transformOrigin: '50% 80%',
      duration: 2.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Foreground Layer (The Great Wave & Foaming Talons): Fastest forward surge
    ukiyoTl.to(
      this.layerFore,
      {
        yPercent: -35,
        scale: 1.08,
        ease: 'none',
      },
      0
    );

    // Subtle wave crest pulsing
    gsap.to('.great-wave-crest', {
      scaleY: 1.04,
      transformOrigin: 'bottom left',
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  initMouseParallax() {
    if (!this.stage) return;

    this.stage.addEventListener('mousemove', (e) => {
      const rect = this.stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      this.mouse.targetX = relX;
      this.mouse.targetY = relY;
    });

    this.stage.addEventListener('mouseleave', () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    });

    const updateMouseParallax = () => {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      if (this.layerBg) {
        this.layerBg.style.transform = `translate3d(${this.mouse.x * -15}px, ${this.mouse.y * -10}px, 0)`;
      }
      if (this.layerMid) {
        this.layerMid.style.transform = `translate3d(${this.mouse.x * 25}px, ${this.mouse.y * 18}px, 0)`;
      }
      if (this.layerFore) {
        this.layerFore.style.transform = `translate3d(${this.mouse.x * 55}px, ${this.mouse.y * 35}px, 0)`;
      }

      requestAnimationFrame(updateMouseParallax);
    };

    updateMouseParallax();
  }

  initSprayCanvas() {
    if (!this.sprayCanvas) return;
    const ctx = this.sprayCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = this.sprayCanvas.getBoundingClientRect();
      this.sprayCanvas.width = rect.width * dpr;
      this.sprayCanvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Generate continuous wave mist / droplet particles
    const spawnParticle = () => {
      const rect = this.sprayCanvas.getBoundingClientRect();
      // Particles spawn near wave crest (~40% from left, ~40% from top)
      const originX = rect.width * 0.42 + (Math.random() - 0.5) * 80;
      const originY = rect.height * 0.4 + (Math.random() - 0.5) * 60;

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.random() * 2.5 + 0.8,
        vy: -Math.random() * 2 - 0.5,
        radius: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.8 + 0.2,
        life: 1.0,
      });

      if (this.particles.length > 70) {
        this.particles.shift();
      }
    };

    const renderSpray = () => {
      const rect = this.sprayCanvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (Math.random() < 0.6) {
        spawnParticle();
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // Gentle gravity
        p.life -= 0.014;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 251, ${p.alpha * p.life})`;
        ctx.fill();
      }

      requestAnimationFrame(renderSpray);
    };

    renderSpray();
  }

  initWoodblockFilters() {
    const buttons = document.querySelectorAll('.layer-btn');
    if (!buttons.length || !this.stage) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.layerFilter;
        this.stage.classList.remove('filter-sumi', 'filter-indigo', 'filter-crimson');

        if (filter !== 'all') {
          this.stage.classList.add(`filter-${filter}`);
        }
      });
    });
  }
}
