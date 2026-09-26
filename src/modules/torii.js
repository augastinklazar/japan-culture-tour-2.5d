/**
 * 2.5D Zdog Torii Gate (鳥居) Module
 * Renders an authentic Shinto Torii in 2.5D vector space using Zdog.
 * Features mouse-tracking parallax inertia and a GSAP ScrollTrigger "pass-through"
 * camera zoom that pulls the user through the sacred threshold into the experience.
 */

export class ZdogTorii {
  constructor(canvasId = 'torii-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas || typeof Zdog === 'undefined') return;

    this.illo = null;
    this.toriiGroup = null;
    this.isSpinning = false;

    // Mouse parallax tracking variables
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.baseZoom = 1.35;
    this.scrollProgress = 0;

    this.init();
  }

  init() {
    this.createIllustration();
    this.buildToriiModel();
    this.bindMouseParallax();
    this.setupScrollTrigger();
    this.animate();
  }

  createIllustration() {
    // Determine responsive zoom based on screen width
    const width = window.innerWidth;
    if (width < 600) {
      this.baseZoom = 0.95;
    } else if (width < 1024) {
      this.baseZoom = 1.15;
    } else {
      this.baseZoom = 1.35;
    }

    this.illo = new Zdog.Illustration({
      element: this.canvas,
      zoom: this.baseZoom,
      dragRotate: false,
      centered: true,
      rotate: { x: -0.05, y: 0, z: 0 },
    });

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      this.baseZoom = w < 600 ? 0.95 : w < 1024 ? 1.15 : 1.35;
      if (this.illo && this.scrollProgress === 0) {
        this.illo.zoom = this.baseZoom;
      }
    });
  }

  buildToriiModel() {
    const kurenai = '#CB1B45';
    const kurenaiDark = '#A61436';
    const sumi = '#1C1C1C';
    const sumiLight = '#2E2E2E';
    const gold = '#D4AF37';
    const stone = '#524B46';

    // Master Anchor Group for entire Torii
    this.toriiGroup = new Zdog.Anchor({
      addTo: this.illo,
      translate: { y: 20 },
    });

    // -------------------------------------------------------------------------
    // 1. KASAGI (笠木) - Uppermost curved lintel with upward flared ends
    // -------------------------------------------------------------------------
    const kasagiRoof = new Zdog.Shape({
      addTo: this.toriiGroup,
      path: [
        { x: -170, y: -116 },
        {
          bezier: [
            { x: -90, y: -110 },
            { x: 90, y: -110 },
            { x: 170, y: -116 },
          ],
        },
      ],
      stroke: 18,
      color: sumi,
      closed: false,
    });

    // Kasagi main vermillion body
    new Zdog.Shape({
      addTo: kasagiRoof,
      path: [
        { x: -160, y: -106 },
        {
          bezier: [
            { x: -80, y: -101 },
            { x: 80, y: -101 },
            { x: 160, y: -106 },
          ],
        },
      ],
      stroke: 16,
      color: kurenai,
      closed: false,
    });

    // -------------------------------------------------------------------------
    // 2. SHIMAKI (島木) - Second horizontal beam directly below Kasagi
    // -------------------------------------------------------------------------
    new Zdog.Rect({
      addTo: this.toriiGroup,
      width: 290,
      height: 12,
      stroke: 8,
      color: kurenaiDark,
      fill: true,
      translate: { y: -88 },
    });

    // -------------------------------------------------------------------------
    // 3. NUKI (貫) - Lower horizontal crossbar piercing both pillars
    // -------------------------------------------------------------------------
    const nuki = new Zdog.Rect({
      addTo: this.toriiGroup,
      width: 260,
      height: 10,
      stroke: 6,
      color: kurenai,
      fill: true,
      translate: { y: -44 },
    });

    // Kusabi (楔) - Small locking wedges on outer sides of pillars
    [-115, 115].forEach((xPos) => {
      new Zdog.Box({
        addTo: nuki,
        width: 4,
        height: 16,
        depth: 14,
        stroke: 2,
        color: sumi,
        translate: { x: xPos, y: 0 },
      });
    });

    // -------------------------------------------------------------------------
    // 4. GAKUZUKA (額束) - Central vertical plaque strut
    // -------------------------------------------------------------------------
    const gakuzuka = new Zdog.Box({
      addTo: this.toriiGroup,
      width: 20,
      height: 38,
      depth: 10,
      stroke: 2,
      color: sumi,
      translate: { y: -66 },
    });

    // Plaque golden inscription face
    new Zdog.Rect({
      addTo: gakuzuka,
      width: 12,
      height: 28,
      color: gold,
      fill: true,
      translate: { z: 6 },
    });

    // -------------------------------------------------------------------------
    // 5. HASHIRA (柱) - Twin cylindrical pillars with inward inclination
    // -------------------------------------------------------------------------
    const pillarSpacing = 85;

    [-pillarSpacing, pillarSpacing].forEach((xPos) => {
      const pillarGroup = new Zdog.Anchor({
        addTo: this.toriiGroup,
        translate: { x: xPos, y: 25 },
        // Subtle inward tilt (Uchikorobi)
        rotate: { z: xPos > 0 ? -0.025 : 0.025 },
      });

      // Main pillar cylinder
      new Zdog.Cylinder({
        addTo: pillarGroup,
        diameter: 22,
        length: 155,
        stroke: 2,
        color: kurenai,
        backface: kurenaiDark,
        rotate: { x: Zdog.TAU / 4 },
      });

      // Upper decorative black collar beneath Shimaki
      new Zdog.Cylinder({
        addTo: pillarGroup,
        diameter: 24,
        length: 8,
        stroke: 2,
        color: sumi,
        translate: { y: -72 },
        rotate: { x: Zdog.TAU / 4 },
      });

      // -----------------------------------------------------------------------
      // 6. KAMEBARA (亀腹) - Stone foundation plinths at base
      // -----------------------------------------------------------------------
      new Zdog.Cylinder({
        addTo: pillarGroup,
        diameter: 32,
        length: 16,
        stroke: 3,
        color: stone,
        backface: sumiLight,
        translate: { y: 78 },
        rotate: { x: Zdog.TAU / 4 },
      });
    });

    // -------------------------------------------------------------------------
    // 7. SACRED SHIMENAWA RICE ROPE (注連縄) ACCENT
    // -------------------------------------------------------------------------
    new Zdog.Shape({
      addTo: this.toriiGroup,
      path: [
        { x: -80, y: -40 },
        { arc: [{ x: 0, y: -26 }, { x: 80, y: -40 }] },
      ],
      stroke: 6,
      color: '#D8C49E',
      closed: false,
    });

    // Shide paper zigzags hanging from rope
    [-35, 0, 35].forEach((xOffset) => {
      new Zdog.Shape({
        addTo: this.toriiGroup,
        path: [
          { x: xOffset, y: -30 },
          { x: xOffset - 4, y: -20 },
          { x: xOffset + 4, y: -10 },
        ],
        stroke: 3,
        color: '#FFFFFB',
        closed: false,
      });
    });
  }

  bindMouseParallax() {
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Restrict rotation bounds for realistic 2.5D perspective
      this.mouse.targetX = normX * 0.28;
      this.mouse.targetY = normY * 0.16;
    });
  }

  setupScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ScrollTrigger sequence: pulling user through Torii gate into content
    ScrollTrigger.create({
      trigger: '#portal',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        this.scrollProgress = self.progress;

        if (this.illo) {
          // Exponential zoom as if walking directly between the pillars
          this.illo.zoom = this.baseZoom * (1 + Math.pow(self.progress, 1.8) * 4.2);
          this.illo.translate.y = self.progress * 140;
          this.illo.translate.z = self.progress * 180;
        }

        // Parallax the hero typography and background sun
        const heroText = document.querySelector('.hero-text-overlay');
        const sunGlow = document.querySelector('.hero-sun-glow');
        if (heroText) {
          heroText.style.opacity = Math.max(0, 1 - self.progress * 2.2);
          heroText.style.transform = `translate(-50%, calc(-50% - ${self.progress * 100}px))`;
        }
        if (sunGlow) {
          sunGlow.style.transform = `translate(-50%, calc(-50% + ${self.progress * 80}px)) scale(${1 + self.progress * 0.5})`;
        }
      },
    });
  }

  animate() {
    // Smooth lerp damping for mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    if (this.illo) {
      // Combine mouse parallax with gentle resting breathing idle rotation
      const idle = Math.sin(Date.now() * 0.0012) * 0.015;
      this.illo.rotate.y = this.mouse.x + idle;
      this.illo.rotate.x = -0.05 + this.mouse.y;

      this.illo.updateRenderGraph();
    }

    requestAnimationFrame(() => this.animate());
  }
}
