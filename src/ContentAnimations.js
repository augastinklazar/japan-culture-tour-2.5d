/**
 * ============================================================================
 * ContentAnimations.js — Narrative Aesthetics & Localized Visual Mechanics
 * ============================================================================
 * Manages the interactive mechanics for the 4 philosophical narrative sections:
 * 1. Shichijūni Kō: GSAP Scroll-linked 2.5D Zdog Typographical Solar Dial
 * 2. Shibui: Calligraphic Canvas Destination-Out Masking revealing silver text
 * 3. Iki: Asymmetrical Editorial Grid with Multi-speed Parallax
 * 4. Kintsugi: 2.5D Zdog Broken Bowl Fragment Reassembly + Anime.js Gold Veins
 * + Dynamic Global CSS Color Variable Transitions via ScrollTrigger
 * ============================================================================
 */

export class ContentAnimations {
  constructor() {
    this.dialIllo = null;
    this.dialGroup = null;
    this.kintsugiIllo = null;
    this.shards = [];
    this.hasGoldAnimated = false;
    this.maskCanvas = null;
    this.maskCtx = null;
    this.maskPoints = [];

    this.init();
  }

  init() {
    this.initColorTransitions();
    this.initSeasonalDial();
    this.initShibuiMask();
    this.initIkiParallax();
    this.initKintsugiReassembly();
  }

  /**
   * --------------------------------------------------------------------------
   * 1. DYNAMIC GLOBAL CSS COLOR VARIABLE TRANSITIONS
   * --------------------------------------------------------------------------
   * Smoothly crossfades --narrative-bg and --narrative-text as the reader scrolls
   * into each aesthetic section using GSAP ScrollTrigger.
   */
  initColorTransitions() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const sections = [
      {
        id: '#shichijuni-ko',
        bg: '#B4A582', // Rikyū-shiracha (利休白茶 - Sen no Rikyū tea tan)
        text: '#00A3AF', // Asagi-iro (浅葱色 - Fresh spring water cyan)
        accent: '#D4AF37',
        navLabel: '01 七十二候 — SHICHIJŪNI KŌ',
      },
      {
        id: '#shibui',
        bg: '#1C1C1C', // Sumi (墨 - Deep Ink Black)
        text: '#91989F', // Gin-nezu (銀鼠 - Silver Pewter / Moon Mist)
        accent: '#CB1B45',
        navLabel: '02 渋味 — SHIBUI RESTRAINT',
      },
      {
        id: '#iki',
        bg: '#745399', // Edo-murasaki (江戸紫 - Royal Edo Violet)
        text: '#CB1B45', // Kurenai (紅 - Imperial Crimson)
        accent: '#FFFFFB',
        navLabel: "03 粋 — EDO'S EFFORTLESS FLAIR",
      },
      {
        id: '#kintsugi',
        bg: '#0B1013', // Kuro-tsurubami (黒橡 - Deep Midnight Charcoal)
        text: '#D4AF37', // Kinpaku Gold (金箔 - 24K Leaf Gold)
        accent: '#CB1B45',
        navLabel: '04 金継ぎ — THE GOLDEN REPAIR',
      },
    ];

    const root = document.documentElement;
    const body = document.body;
    const railLabel = document.getElementById('narrative-rail-label');

    sections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec.id,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => this.applyColors(sec.bg, sec.text, sec.accent, sec.navLabel),
        onEnterBack: () => this.applyColors(sec.bg, sec.text, sec.accent, sec.navLabel),
      });
    });
  }

  applyColors(bg, text, accent, label) {
    if (typeof gsap !== 'undefined') {
      gsap.to('body', {
        backgroundColor: bg,
        color: text,
        duration: 0.85,
        ease: 'power2.inOut',
      });

      document.documentElement.style.setProperty('--narrative-bg', bg);
      document.documentElement.style.setProperty('--narrative-text', text);
      document.documentElement.style.setProperty('--narrative-accent', accent);

      const railLabel = document.getElementById('narrative-rail-label');
      if (railLabel && label) {
        railLabel.textContent = label;
      }
    }
  }

  /**
   * --------------------------------------------------------------------------
   * 2. SECTION 1: 2.5D ZDOG TYPOGRAPHICAL SOLAR DIAL (SHICHIJŪNI KŌ)
   * --------------------------------------------------------------------------
   * A large 2.5D astrolabe/compass wheel featuring concentric orbital rings,
   * 24 solar term spokes, cardinal needles, and micro-season ticks.
   * Bound to GSAP ScrollTrigger to spin mechanically as the user reads.
   */
  initSeasonalDial() {
    const canvas = document.getElementById('seasonal-dial-canvas');
    if (!canvas || typeof Zdog === 'undefined') return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 640 * dpr;
    canvas.height = 640 * dpr;

    this.dialIllo = new Zdog.Illustration({
      element: canvas,
      zoom: 1.15,
      centered: true,
      dragRotate: false,
      rotate: { x: -0.15, y: 0.2 },
    });

    this.dialGroup = new Zdog.Anchor({
      addTo: this.dialIllo,
    });

    const gold = '#D4AF37';
    const brass = '#A88B46';
    const sumi = '#1C1C1C';
    const crimson = '#CB1B45';
    const gofun = '#FFFFFB';

    // Central Sun Disc & Axle
    new Zdog.Cylinder({
      addTo: this.dialGroup,
      diameter: 38,
      length: 12,
      stroke: 2,
      color: gold,
      backface: brass,
      rotate: { x: Zdog.TAU / 4 },
    });

    new Zdog.Shape({
      addTo: this.dialGroup,
      stroke: 14,
      color: crimson,
      translate: { z: 8 },
    });

    // Concentric Astrolabe Orbital Rings
    const ringRadii = [70, 115, 160, 205, 235];
    ringRadii.forEach((r, idx) => {
      new Zdog.Ellipse({
        addTo: this.dialGroup,
        diameter: r * 2,
        stroke: idx === 2 || idx === 4 ? 3 : 1.2,
        color: idx % 2 === 0 ? brass : gold,
      });
    });

    // 24 Radial Compass Spokes for the 24 Solar Terms (Sekki 節気)
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Zdog.TAU;
      const innerR = 70;
      const outerR = 205;

      new Zdog.Shape({
        addTo: this.dialGroup,
        path: [
          { x: Math.cos(angle) * innerR, y: Math.sin(angle) * innerR },
          { x: Math.cos(angle) * outerR, y: Math.sin(angle) * outerR },
        ],
        stroke: i % 6 === 0 ? 2.5 : 1,
        color: i % 6 === 0 ? crimson : brass,
        closed: false,
      });

      // Cardinal/Quarter Glyphs (Spring, Summer, Autumn, Winter)
      if (i % 6 === 0) {
        new Zdog.Shape({
          addTo: this.dialGroup,
          stroke: 6,
          color: gold,
          translate: {
            x: Math.cos(angle) * 220,
            y: Math.sin(angle) * 220,
            z: 4,
          },
        });
      }
    }

    // 72 Outer Fine Ticks for the 72 Micro-Seasons (Shichijūni Kō 七十二候)
    for (let j = 0; j < 72; j++) {
      const a = (j / 72) * Zdog.TAU;
      new Zdog.Shape({
        addTo: this.dialGroup,
        path: [
          { x: Math.cos(a) * 205, y: Math.sin(a) * 205 },
          { x: Math.cos(a) * 215, y: Math.sin(a) * 215 },
        ],
        stroke: 1.2,
        color: j % 3 === 0 ? sumi : brass,
        closed: false,
      });
    }

    // 4 Cardinal Direction Pointer Needles
    [0, Zdog.TAU / 4, Zdog.TAU / 2, (Zdog.TAU * 3) / 4].forEach((rad, idx) => {
      new Zdog.Polygon({
        addTo: this.dialGroup,
        radius: 28,
        sides: 3,
        stroke: 2,
        color: idx === 0 ? crimson : gold,
        fill: true,
        rotate: { z: rad + Math.PI / 2 },
        translate: {
          x: Math.cos(rad) * 242,
          y: Math.sin(rad) * 242,
          z: 2,
        },
      });
    });

    // GSAP ScrollTrigger: map scroll progress directly to dial rotation
    ScrollTrigger.create({
      trigger: '#shichijuni-ko',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        if (this.dialGroup) {
          // Rotates 420 degrees mechanically through the season cycle
          this.dialGroup.rotate.z = self.progress * (Math.PI * 2.33);
        }
      },
    });

    // Render loop for seasonal dial
    const animateDial = () => {
      if (this.dialIllo) {
        // Idle gentle breathing tilt
        const t = Date.now() * 0.0012;
        this.dialIllo.rotate.x = -0.15 + Math.sin(t) * 0.04;
        this.dialIllo.rotate.y = 0.2 + Math.cos(t * 0.8) * 0.04;
        this.dialIllo.updateRenderGraph();
      }
      requestAnimationFrame(animateDial);
    };
    animateDial();
  }

  /**
   * --------------------------------------------------------------------------
   * 3. SECTION 2: CALLIGRAPHIC CANVAS DESTINATION-OUT MASKING (SHIBUI)
   * --------------------------------------------------------------------------
   * Article text is rendered at ultra-low contrast. An overlay canvas acts as a
   * dark sumi wash. Moving the mouse cursor like a Shodo brush permanently erases
   * the mask (destination-out), revealing high-contrast silver Gin-nezu text.
   */
  initShibuiMask() {
    this.maskCanvas = document.getElementById('shibui-mask-canvas');
    const container = document.querySelector('.shibui-text-container');
    if (!this.maskCanvas || !container) return;

    this.maskCtx = this.maskCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      this.maskCanvas.width = rect.width * dpr;
      this.maskCanvas.height = rect.height * dpr;
      this.maskCtx.scale(dpr, dpr);
      this.drawInitialMask(rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Brush tracking
    let prevX = null;
    let prevY = null;

    const eraseAt = (x, y) => {
      if (!this.maskCtx) return;
      this.maskCtx.save();
      this.maskCtx.globalCompositeOperation = 'destination-out';

      // Wide calligraphic brush with feathered organic edges
      const brushRadius = 42;
      const grad = this.maskCtx.createRadialGradient(x, y, 6, x, y, brushRadius);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.maskCtx.fillStyle = grad;
      this.maskCtx.beginPath();
      this.maskCtx.arc(x, y, brushRadius, 0, Math.PI * 2);
      this.maskCtx.fill();

      // Interpolate continuous line if moving swiftly
      if (prevX !== null && prevY !== null) {
        const dist = Math.hypot(x - prevX, y - prevY);
        const steps = Math.ceil(dist / 10);
        for (let i = 1; i <= steps; i++) {
          const ix = prevX + (x - prevX) * (i / steps);
          const iy = prevY + (y - prevY) * (i / steps);
          this.maskCtx.beginPath();
          this.maskCtx.arc(ix, iy, brushRadius * 0.9, 0, Math.PI * 2);
          this.maskCtx.fill();
        }
      }

      this.maskCtx.restore();
      prevX = x;
      prevY = y;
    };

    this.maskCanvas.addEventListener('mousemove', (e) => {
      const rect = this.maskCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      eraseAt(x, y);
    });

    this.maskCanvas.addEventListener('mouseleave', () => {
      prevX = null;
      prevY = null;
    });

    // Touch support for mobile visitors
    this.maskCanvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.maskCanvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        eraseAt(x, y);
      }
    });

    // Reveal All button for instant accessibility
    const revealBtn = document.getElementById('shibui-reveal-btn');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        const rect = container.getBoundingClientRect();
        this.maskCtx.clearRect(0, 0, rect.width, rect.height);
      });
    }
  }

  drawInitialMask(w, h) {
    if (!this.maskCtx) return;
    this.maskCtx.save();
    this.maskCtx.globalCompositeOperation = 'source-over';

    // Dark charcoal Sumi wash mask
    this.maskCtx.fillStyle = '#181818';
    this.maskCtx.fillRect(0, 0, w, h);

    // Add subtle washi paper grain speckles into the mask
    this.maskCtx.fillStyle = 'rgba(255, 255, 251, 0.04)';
    for (let i = 0; i < 350; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      this.maskCtx.fillRect(rx, ry, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }

    this.maskCtx.restore();
  }

  /**
   * --------------------------------------------------------------------------
   * 4. SECTION 3: ASYMMETRICAL EDITORIAL PARALLAX GRID (IKI)
   * --------------------------------------------------------------------------
   * Defies centered corporate templates. Slides in vertical Japanese headers
   * and horizontal text passages at differential speeds using GSAP ScrollTrigger.
   */
  initIkiParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const ikiSection = document.getElementById('iki');
    if (!ikiSection) return;

    // Elements with data-speed attributes
    const parallaxItems = ikiSection.querySelectorAll('[data-speed]');

    parallaxItems.forEach((item) => {
      const speed = parseFloat(item.dataset.speed) || 1.0;
      const direction = item.dataset.direction || 'y';

      if (direction === 'x') {
        gsap.fromTo(
          item,
          { x: 120 * (speed - 1) },
          {
            x: -120 * (speed - 1),
            ease: 'none',
            scrollTrigger: {
              trigger: ikiSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      } else {
        gsap.fromTo(
          item,
          { y: 150 * (speed - 1) },
          {
            y: -150 * (speed - 1),
            ease: 'none',
            scrollTrigger: {
              trigger: ikiSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }
    });

    // Staggered entrance for the Iki vertical titles
    gsap.from('.iki-vertical-lead', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#iki',
        start: 'top 70%',
      },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * 5. SECTION 4: SCROLL-REWIND 2.5D KINTSUGI REASSEMBLY + ANIME.JS GOLD
   * --------------------------------------------------------------------------
   * 5 distinct Zdog polygon ceramic fragments start suspended and scattered in
   * 3D perspective space. Scrolling pulls them together into a unified bowl.
   * Anime.js draws glowing gold veins the exact moment pieces snap together!
   */
  initKintsugiReassembly() {
    const canvas = document.getElementById('kintsugi-zdog-canvas');
    if (!canvas || typeof Zdog === 'undefined') return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 560 * dpr;
    canvas.height = 500 * dpr;

    this.kintsugiIllo = new Zdog.Illustration({
      element: canvas,
      zoom: 1.2,
      centered: true,
      dragRotate: false,
      rotate: { x: -0.1, y: 0.15 },
    });

    const bowlGroup = new Zdog.Anchor({
      addTo: this.kintsugiIllo,
    });

    // 5 Distinct Ceramic Shards with Initial Scattered Coordinates
    const shardDefs = [
      // Shard 1: Upper Left Lip
      {
        path: [
          { x: -110, y: -45 },
          { x: -30, y: -50 },
          { x: -40, y: 10 },
          { x: -95, y: 20 },
        ],
        scatter: { x: -80, y: -65, z: 70, rotZ: -0.35, rotX: 0.2 },
        color: '#28201C',
      },
      // Shard 2: Center Rim & Interior
      {
        path: [
          { x: -30, y: -50 },
          { x: 50, y: -48 },
          { x: 30, y: 15 },
          { x: -40, y: 10 },
        ],
        scatter: { x: 10, y: -90, z: -50, rotZ: 0.2, rotX: -0.25 },
        color: '#342B26',
      },
      // Shard 3: Upper Right Flank
      {
        path: [
          { x: 50, y: -48 },
          { x: 115, y: -40 },
          { x: 90, y: 25 },
          { x: 30, y: 15 },
        ],
        scatter: { x: 85, y: -50, z: 80, rotZ: 0.4, rotX: 0.15 },
        color: '#241D19',
      },
      // Shard 4: Lower Left Body & Footring Base
      {
        path: [
          { x: -95, y: 20 },
          { x: -40, y: 10 },
          { x: -15, y: 65 },
          { x: -65, y: 65 },
        ],
        scatter: { x: -70, y: 60, z: 50, rotZ: -0.25, rotX: -0.15 },
        color: '#3A302A',
      },
      // Shard 5: Lower Right Body & Footring Base
      {
        path: [
          { x: -40, y: 10 },
          { x: 30, y: 15 },
          { x: 90, y: 25 },
          { x: 60, y: 65 },
          { x: -15, y: 65 },
        ],
        scatter: { x: 65, y: 70, z: -40, rotZ: 0.3, rotX: 0.2 },
        color: '#2A221E',
      },
    ];

    this.shards = [];

    shardDefs.forEach((def) => {
      const anchor = new Zdog.Anchor({
        addTo: bowlGroup,
        translate: { x: def.scatter.x, y: def.scatter.y, z: def.scatter.z },
        rotate: { z: def.scatter.rotZ, x: def.scatter.rotX },
      });

      new Zdog.Shape({
        addTo: anchor,
        path: def.path,
        stroke: 4,
        color: def.color,
        fill: true,
      });

      this.shards.push({
        anchor,
        scatter: def.scatter,
      });
    });

    // GSAP ScrollTrigger: pull fragments together into unified bowl
    ScrollTrigger.create({
      trigger: '#kintsugi',
      start: 'top 65%',
      end: 'bottom 40%',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        // Inverse progress: 1 -> fragments together (0 offset), 0 -> scattered
        const factor = Math.max(0, 1 - p * 1.2);

        this.shards.forEach((s) => {
          s.anchor.translate.x = s.scatter.x * factor;
          s.anchor.translate.y = s.scatter.y * factor;
          s.anchor.translate.z = s.scatter.z * factor;
          s.anchor.rotate.z = s.scatter.rotZ * factor;
          s.anchor.rotate.x = s.scatter.rotX * factor;
        });

        // Trigger glowing gold Anime.js path drawing when pieces lock together (p >= 0.85)
        if (p >= 0.82 && !this.hasGoldAnimated) {
          this.triggerGoldSeamsAnimation();
          this.hasGoldAnimated = true;
        } else if (p < 0.7) {
          this.hasGoldAnimated = false;
        }
      },
    });

    const animateKintsugi = () => {
      if (this.kintsugiIllo) {
        this.kintsugiIllo.updateRenderGraph();
      }
      requestAnimationFrame(animateKintsugi);
    };
    animateKintsugi();
  }

  /**
   * Anime.js stroke-dashoffset illumination on the SVG gold fracture seams
   */
  triggerGoldSeamsAnimation() {
    const goldPaths = document.querySelectorAll('.narrative-gold-seam');
    if (!goldPaths.length || typeof anime === 'undefined') return;

    goldPaths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });

    anime({
      targets: '.narrative-gold-seam',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutCubic',
      duration: 1800,
      delay: anime.stagger(150),
    });

    // Sparkle halo glow on the repaired bowl
    const halo = document.querySelector('.kintsugi-gold-halo');
    if (halo) {
      anime({
        targets: halo,
        opacity: [0, 0.85, 0.4],
        scale: [0.9, 1.15, 1],
        duration: 1600,
        easing: 'easeOutQuad',
      });
    }
  }
}
