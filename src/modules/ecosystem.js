/**
 * ============================================================================
 * 2.5D Animated Background Ecosystem Module (Pagoda, Matsu Trees & Kumo Clouds)
 * ============================================================================
 * Procedurally models a 3-tier traditional Japanese Pagoda (三重塔) and Matsu
 * (松) Pine Trees with Bamboo using Zdog primitives. Features swinging Chochin
 * (提灯) paper lanterns, horizontal cloud drift, and a multi-speed GSAP
 * ScrollTrigger parallax system that rotates and translates in 2.5D space.
 */

export class BackgroundEcosystem {
  constructor(windSystem = null) {
    this.windSystem = windSystem;
    this.container = document.getElementById('bg-canvas-container');
    this.canvas = document.getElementById('bg-ecosystem-canvas');
    this.cloudsLayer = document.getElementById('clouds-layer');

    if (!this.canvas || typeof Zdog === 'undefined') return;

    this.illo = null;
    this.pagodaGroup = null;
    this.treeGroup = null;
    this.bambooGroup = null;
    this.lanterns = [];

    // Scroll and motion targets
    this.scrollProgress = 0;
    this.targetRotateY = 0;
    this.targetRotateX = -0.05;
    this.targetTranslateY = 0;
    this.cloudOffset = 0;

    // Palette: Traditional Japanese colors
    this.colors = {
      uguisu: '#838A2D',      // 鶯色: Muted Nightingale Green
      uguisuDeep: '#5C631D',  // 深鶯: Deep needle tone
      kogecha: '#69543B',     // 焦茶: Dark Wood Brown
      kogechaDark: '#4A3B2A', // 濃焦茶: Timber bracket shadow
      sumiTile: '#2E3338',    // 瓦色: Traditional slate roof tiles
      sumiTileEdge: '#1C1C1C',// 墨: Ridge cap edge
      gofun: '#FFFFFB',       // 胡粉: Paper wall / lantern gofun
      kurenai: '#CB1B45',     // 紅: Imperial crimson accents
      kin: '#D4AF37',         // 金箔: Finial apex gold
      stone: '#524B46',       // 礎石: Stone podium
      bambooNode: '#6D7521',  // 竹節: Bamboo culm node
    };

    this.init();
  }

  init() {
    this.setupIllustration();
    this.buildPagoda();
    this.buildMatsuGrove();
    this.buildBamboo();
    this.setupScrollTrigger();
    this.setupResize();
    this.animate();
  }

  setupIllustration() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    // Responsive base scale
    const zoom = width < 768 ? 0.65 : width < 1200 ? 0.85 : 1.05;

    this.illo = new Zdog.Illustration({
      element: this.canvas,
      zoom: zoom,
      centered: true,
      dragRotate: false,
      rotate: { x: -0.05, y: 0, z: 0 },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * 1. 2.5D THREE-TIER TRADITIONAL PAGODA (三重塔 - Sanjū-no-tō)
   * --------------------------------------------------------------------------
   * Meticulously constructed on the left flank using Zdog primitives:
   * Foundation podium, 3 proportional stories with Kogecha timber framing,
   * sweeping curved eaves (Sori-yane), railing verandas, and Sōrin finial.
   */
  buildPagoda() {
    const flankX = -Math.min(window.innerWidth * 0.38, 480);
    const baseY = 160;

    this.pagodaGroup = new Zdog.Anchor({
      addTo: this.illo,
      translate: { x: flankX, y: baseY, z: -80 },
      // Subtle natural quarter-turn perspective
      rotate: { y: 0.35 },
    });

    // --- Base Stone Plinth (基壇) ---
    new Zdog.Box({
      addTo: this.pagodaGroup,
      width: 140,
      height: 18,
      depth: 140,
      stroke: 2,
      color: this.colors.stone,
      translate: { y: 0 },
    });

    // Build the 3 Tiers with proportionate Japanese architectural taper (逓減)
    const tiers = [
      { width: 90, height: 46, depth: 90, roofW: 160, roofH: 20, yPos: -32, scale: 1.0 },
      { width: 76, height: 40, depth: 76, roofW: 136, roofH: 18, yPos: -88, scale: 0.85 },
      { width: 62, height: 36, depth: 62, roofW: 114, roofH: 16, yPos: -140, scale: 0.72 },
    ];

    tiers.forEach((tier, index) => {
      const tierAnchor = new Zdog.Anchor({
        addTo: this.pagodaGroup,
        translate: { y: tier.yPos },
      });

      // Chamber Core Walls (Gofun Washi White)
      new Zdog.Box({
        addTo: tierAnchor,
        width: tier.width,
        height: tier.height,
        depth: tier.depth,
        stroke: 2,
        color: this.colors.gofun,
      });

      // Exterior Timber Framing Pillars (Kogecha Brown)
      const halfW = tier.width / 2;
      const halfD = tier.depth / 2;
      [
        { x: -halfW, z: -halfD },
        { x: halfW, z: -halfD },
        { x: halfW, z: halfD },
        { x: -halfW, z: halfD },
      ].forEach((pillarPos) => {
        new Zdog.Cylinder({
          addTo: tierAnchor,
          diameter: 6.5,
          length: tier.height + 2,
          stroke: 1,
          color: this.colors.kogecha,
          translate: { x: pillarPos.x, y: 0, z: pillarPos.z },
          rotate: { x: Zdog.TAU / 4 },
        });
      });

      // Upper Timber Bracketing Cluster (Tokyō 斗栱)
      new Zdog.Box({
        addTo: tierAnchor,
        width: tier.width + 10,
        height: 6,
        depth: tier.depth + 10,
        color: this.colors.kogechaDark,
        translate: { y: -tier.height / 2 - 3 },
      });

      // Veranda Balustrade (Kōran 高欄) with Vermillion Top Rail
      new Zdog.Rect({
        addTo: tierAnchor,
        width: tier.width + 14,
        height: tier.depth + 14,
        stroke: 4,
        color: this.colors.kurenai,
        translate: { y: tier.height / 2 - 4 },
        rotate: { x: Zdog.TAU / 4 },
      });

      // --- Sweeping Upturned Roof (Sori-yane 反り屋根) ---
      const roofY = -tier.height / 2 - 10;
      const roofGroup = new Zdog.Anchor({
        addTo: tierAnchor,
        translate: { y: roofY },
      });

      // Main roof hip pyramid
      new Zdog.Cone({
        addTo: roofGroup,
        diameter: tier.roofW,
        length: tier.roofH,
        stroke: 4,
        color: this.colors.sumiTile,
        rotate: { x: -Zdog.TAU / 4 },
        translate: { y: -tier.roofH / 2 },
      });

      // Flared eaves overhang contour (Tiered eaves flare)
      new Zdog.Rect({
        addTo: roofGroup,
        width: tier.roofW,
        height: tier.roofW,
        stroke: 6,
        color: this.colors.sumiTileEdge,
        rotate: { x: Zdog.TAU / 4 },
        translate: { y: 0 },
      });

      // Four upturned corner eaves points with hanging Chochin Lanterns
      const eavesRadius = tier.roofW * 0.48;
      [
        { x: -eavesRadius, z: -eavesRadius },
        { x: eavesRadius, z: -eavesRadius },
        { x: eavesRadius, z: eavesRadius },
        { x: -eavesRadius, z: eavesRadius },
      ].forEach((corner, cIdx) => {
        // Upturned corner tip
        new Zdog.Shape({
          addTo: roofGroup,
          path: [
            { x: corner.x, y: 0, z: corner.z },
            { x: corner.x * 1.05, y: -4, z: corner.z * 1.05 },
          ],
          stroke: 3,
          color: this.colors.sumiTileEdge,
          closed: false,
        });

        // Hang Chochin Paper Lantern from outer eaves
        this.createChochinLantern(roofGroup, {
          x: corner.x * 1.02,
          y: 4,
          z: corner.z * 1.02,
        }, index * 4 + cIdx);
      });
    });

    // --- Sacred Bronze Finial Spire (Sōrin 相輪) ---
    const spireAnchor = new Zdog.Anchor({
      addTo: this.pagodaGroup,
      translate: { y: -176 },
    });

    // Base box (Roban 露盤)
    new Zdog.Box({
      addTo: spireAnchor,
      width: 20,
      height: 6,
      depth: 20,
      color: this.colors.kogechaDark,
      translate: { y: 0 },
    });

    // Central brass shaft
    new Zdog.Cylinder({
      addTo: spireAnchor,
      diameter: 3.5,
      length: 64,
      color: '#8C7646',
      translate: { y: -32 },
      rotate: { x: Zdog.TAU / 4 },
    });

    // Nine Sacred Bronze Rings (Kurin 九輪)
    for (let r = 0; r < 7; r++) {
      new Zdog.Cylinder({
        addTo: spireAnchor,
        diameter: 14 - r * 1.2,
        length: 2,
        color: '#9E854E',
        translate: { y: -14 - r * 5 },
        rotate: { x: Zdog.TAU / 4 },
      });
    }

    // Sacred Golden Jewel Sphere (Hōju 宝珠) at the summit
    new Zdog.Shape({
      addTo: spireAnchor,
      stroke: 9,
      color: this.colors.kin,
      translate: { y: -64 },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * 2. CHOCHIN PAPER LANTERNS (提灯)
   * --------------------------------------------------------------------------
   * Created at each pagoda eaves corner with a suspension hinge anchor
   * allowing dynamic physics-based wind swinging in the animation loop.
   */
  createChochinLantern(parent, pos, id) {
    // Hinge anchor for swinging rotation
    const hinge = new Zdog.Anchor({
      addTo: parent,
      translate: pos,
    });

    // Suspension cord
    new Zdog.Shape({
      addTo: hinge,
      path: [{ y: 0 }, { y: 6 }],
      stroke: 1.2,
      color: this.colors.sumiTileEdge,
      closed: false,
    });

    // Top black wooden collar
    new Zdog.Cylinder({
      addTo: hinge,
      diameter: 6,
      length: 2,
      color: this.colors.sumiTileEdge,
      translate: { y: 7 },
      rotate: { x: Zdog.TAU / 4 },
    });

    // Flared Gofun Washi paper body
    new Zdog.Cylinder({
      addTo: hinge,
      diameter: 9,
      length: 12,
      stroke: 1.5,
      color: this.colors.gofun,
      backface: '#F5EEDC',
      translate: { y: 14 },
      rotate: { x: Zdog.TAU / 4 },
    });

    // Subtle Kurenai Crimson Center Band Accent
    new Zdog.Ellipse({
      addTo: hinge,
      diameter: 9.2,
      stroke: 2.5,
      color: this.colors.kurenai,
      translate: { y: 14 },
      rotate: { x: Zdog.TAU / 4 },
    });

    // Bottom black wooden collar
    new Zdog.Cylinder({
      addTo: hinge,
      diameter: 6,
      length: 2,
      color: this.colors.sumiTileEdge,
      translate: { y: 21 },
      rotate: { x: Zdog.TAU / 4 },
    });

    // Red hanging tassel
    new Zdog.Shape({
      addTo: hinge,
      path: [{ y: 22 }, { y: 28 }],
      stroke: 2,
      color: this.colors.kurenai,
      closed: false,
    });

    // Store for animated sine-wave swaying
    this.lanterns.push({
      anchor: hinge,
      id: id,
      phaseOffset: id * 0.45,
      speed: 1.4 + (id % 3) * 0.2,
    });
  }

  /**
   * --------------------------------------------------------------------------
   * 3. MATSU (松) JAPANESE PINE TREES (Right Flank)
   * --------------------------------------------------------------------------
   * Minimalist 2.5D Japanese black pine with gnarled Kogecha trunk segments,
   * angled lateral boughs, and horizontal tiered needle pads (Dan-zukuri)
   * in authentic Uguisu-iro (Muted Nightingale Green).
   */
  buildMatsuGrove() {
    const flankX = Math.min(window.innerWidth * 0.38, 480);
    const baseY = 170;

    this.treeGroup = new Zdog.Anchor({
      addTo: this.illo,
      translate: { x: flankX, y: baseY, z: -60 },
      rotate: { y: -0.25 },
    });

    // Primary Gnarled Pine Trunk Segments
    // 1. Base trunk root flare
    new Zdog.Cylinder({
      addTo: this.treeGroup,
      diameter: 16,
      length: 35,
      stroke: 2,
      color: this.colors.kogechaDark,
      translate: { y: -16 },
      rotate: { x: Zdog.TAU / 4, z: -0.1 },
    });

    // 2. Mid trunk bowing outward (Bonsai silhouette)
    const midTrunk = new Zdog.Anchor({
      addTo: this.treeGroup,
      translate: { x: 4, y: -36, z: 0 },
      rotate: { z: 0.18 },
    });

    new Zdog.Cylinder({
      addTo: midTrunk,
      diameter: 12,
      length: 45,
      stroke: 2,
      color: this.colors.kogecha,
      translate: { y: -20 },
      rotate: { x: Zdog.TAU / 4 },
    });

    // 3. Upper trunk leaning gracefully
    const upperTrunk = new Zdog.Anchor({
      addTo: midTrunk,
      translate: { x: -2, y: -42, z: 0 },
      rotate: { z: -0.25 },
    });

    new Zdog.Cylinder({
      addTo: upperTrunk,
      diameter: 9,
      length: 40,
      stroke: 1.5,
      color: this.colors.kogecha,
      translate: { y: -18 },
      rotate: { x: Zdog.TAU / 4 },
    });

    // --- Tiered Needle Pads (Dan-zukuri 段作り) ---
    // Clustered cloud pads in Uguisu-iro (#838A2D)
    const needlePads = [
      // Left low branch pad
      { parent: midTrunk, x: -35, y: -15, z: 12, w: 46, h: 22, rot: 0.1 },
      // Right mid branch pad
      { parent: midTrunk, x: 38, y: -30, z: -10, w: 52, h: 24, rot: -0.15 },
      // Upper left canopy pad
      { parent: upperTrunk, x: -32, y: -18, z: 8, w: 48, h: 22, rot: 0.12 },
      // Main crown apex pad
      { parent: upperTrunk, x: 6, y: -42, z: 0, w: 60, h: 26, rot: 0 },
      // Right crown flank pad
      { parent: upperTrunk, x: 34, y: -34, z: 10, w: 42, h: 20, rot: -0.2 },
    ];

    needlePads.forEach((pad) => {
      const boughAnchor = new Zdog.Anchor({
        addTo: pad.parent,
        translate: { x: pad.x, y: pad.y, z: pad.z },
        rotate: { z: pad.rot },
      });

      // Supporting thin bough wood
      new Zdog.Shape({
        addTo: boughAnchor,
        path: [{ x: -pad.x * 0.4, y: 10, z: 0 }, { x: 0, y: 0, z: 0 }],
        stroke: 3,
        color: this.colors.kogechaDark,
        closed: false,
      });

      // Bottom shadow foliage pad
      new Zdog.Ellipse({
        addTo: boughAnchor,
        width: pad.w,
        height: pad.h,
        stroke: 12,
        color: this.colors.uguisuDeep,
        fill: true,
        rotate: { x: Zdog.TAU / 4 },
        translate: { y: 2 },
      });

      // Main top illuminated foliage pad (Uguisu-iro #838A2D)
      new Zdog.Ellipse({
        addTo: boughAnchor,
        width: pad.w * 0.9,
        height: pad.h * 0.9,
        stroke: 10,
        color: this.colors.uguisu,
        fill: true,
        rotate: { x: Zdog.TAU / 4 },
        translate: { y: 0, z: 2 },
      });
    });
  }

  /**
   * --------------------------------------------------------------------------
   * 4. BAMBOO CULMS (竹 - Take)
   * --------------------------------------------------------------------------
   * Slender upright green culms with segmented ring nodes and leaf sprays.
   */
  buildBamboo() {
    const flankX = Math.min(window.innerWidth * 0.42, 540);
    const baseY = 175;

    this.bambooGroup = new Zdog.Anchor({
      addTo: this.illo,
      translate: { x: flankX, y: baseY, z: -90 },
    });

    const culms = [
      { x: -14, z: 8, height: 160, tilt: 0.03 },
      { x: 12, z: -10, height: 185, tilt: -0.02 },
      { x: 26, z: 12, height: 145, tilt: 0.04 },
    ];

    culms.forEach((c) => {
      const culmAnchor = new Zdog.Anchor({
        addTo: this.bambooGroup,
        translate: { x: c.x, z: c.z },
        rotate: { z: c.tilt },
      });

      const numSegments = 5;
      const segLength = c.height / numSegments;

      for (let s = 0; s < numSegments; s++) {
        // Culm Segment
        new Zdog.Cylinder({
          addTo: culmAnchor,
          diameter: 4.5,
          length: segLength - 2,
          stroke: 1,
          color: this.colors.uguisu,
          translate: { y: -s * segLength - segLength / 2 },
          rotate: { x: Zdog.TAU / 4 },
        });

        // Bamboo Node Ring (竹節)
        new Zdog.Cylinder({
          addTo: culmAnchor,
          diameter: 6.2,
          length: 2,
          color: this.colors.bambooNode,
          translate: { y: -s * segLength },
          rotate: { x: Zdog.TAU / 4 },
        });

        // Delicate bamboo leaf blades on upper segments
        if (s >= 2) {
          const side = s % 2 === 0 ? 1 : -1;
          new Zdog.Shape({
            addTo: culmAnchor,
            path: [
              { x: 0, y: -s * segLength },
              { x: side * 14, y: -s * segLength - 8 },
              { x: side * 22, y: -s * segLength - 4 },
            ],
            stroke: 2,
            color: this.colors.uguisu,
            closed: false,
          });
        }
      }
    });
  }

  /**
   * --------------------------------------------------------------------------
   * 5. MULTI-SPEED GSAP SCROLLTRIGGER PARALLAX
   * --------------------------------------------------------------------------
   * Maps page scroll progress:
   * - Deep Background (Clouds): moves up very slowly (yPercent: -12)
   * - Midground (Pagoda, Trees, Bamboo in Zdog): translates up at medium pace,
   *   and gently rotates in 2.5D space (rotate.y and rotate.x).
   */
  setupScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Parallax the Deep Background Clouds Layer (Moves slowest)
    if (this.cloudsLayer) {
      gsap.to(this.cloudsLayer, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2.0,
        },
      });
    }

    // Parallax the Zdog Midground Canvas (Pagoda & Trees)
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.4,
      onUpdate: (self) => {
        this.scrollProgress = self.progress;

        // 2.5D Perspective angle shifts dynamically with scroll depth
        this.targetRotateY = (self.progress - 0.3) * 0.28;
        this.targetRotateX = -0.05 + self.progress * 0.08;
        this.targetTranslateY = -self.progress * 240;
      },
    });
  }

  setupResize() {
    window.addEventListener('resize', () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;

      const zoom = width < 768 ? 0.65 : width < 1200 ? 0.85 : 1.05;
      if (this.illo) {
        this.illo.zoom = zoom;
      }

      // Reposition flanks on viewport resize
      const flankX = Math.min(width * 0.38, 480);
      if (this.pagodaGroup) {
        this.pagodaGroup.translate.x = -flankX;
      }
      if (this.treeGroup) {
        this.treeGroup.translate.x = flankX;
      }
      if (this.bambooGroup) {
        this.bambooGroup.translate.x = flankX + 40;
      }
    });
  }

  /**
   * --------------------------------------------------------------------------
   * 6. REQUEST ANIMATION FRAME LOOP
   * --------------------------------------------------------------------------
   * Handles continuous idle animations coupled with live WindSystem physics:
   * - Chochin paper lanterns modulated by wind velocity and gust force
   * - Matsu pine trees & bamboo laterally sheared by wind gusts
   * - Accelerated horizontal cloud drift during gusts
   * - Smooth lerp damping for 2.5D scroll rotation and translation
   */
  animate() {
    const time = Date.now() * 0.0016;

    // Retrieve reactive wind velocity from WindSystem
    const windVelocity = this.windSystem ? this.windSystem.getWindVelocity() : 1.2;
    const gustForce = this.windSystem ? this.windSystem.getWindGust() : 0;

    // 1. Lanterns swinging (Gentle harmonic sine wave rotation modulated by wind velocity)
    this.lanterns.forEach((lantern) => {
      const swayZ = Math.sin(time * lantern.speed + lantern.phaseOffset) * 0.15 + (windVelocity * 0.08);
      const swayX = Math.cos(time * (lantern.speed * 0.8) + lantern.phaseOffset) * 0.05 + (gustForce * 0.025);
      lantern.anchor.rotate.z = swayZ;
      lantern.anchor.rotate.x = swayX;
    });

    // 2. Matsu Pine & Bamboo lateral shear/tilt proportional to wind gusts
    if (this.treeGroup) {
      const treeBreeze = Math.sin(time * 0.9) * 0.015;
      const treeGust = (windVelocity - 1.2) * 0.038;
      this.treeGroup.rotate.z = -0.25 + treeBreeze - treeGust;
    }
    if (this.bambooGroup) {
      const bambooBreeze = Math.sin(time * 1.1 + 0.5) * 0.02;
      const bambooGust = (windVelocity - 1.2) * 0.065;
      this.bambooGroup.rotate.z = bambooBreeze - bambooGust;
    }

    // 3. Pagoda subtle idle breathing
    if (this.pagodaGroup) {
      this.pagodaGroup.rotate.y = 0.35 + Math.sin(time * 0.6) * 0.012;
    }

    // 4. Horizontal drifting clouds: accelerate translation speed during wind gusts
    this.cloudOffset += 0.08 + (windVelocity - 1.2) * 0.24;
    if (this.cloudsLayer) {
      const cloudSvg1 = this.cloudsLayer.querySelector('.cloud-bank-1');
      const cloudSvg2 = this.cloudsLayer.querySelector('.cloud-bank-2');
      if (cloudSvg1) {
        cloudSvg1.style.transform = `translateX(${Math.sin(this.cloudOffset * 0.02) * 28 + (this.cloudOffset * 0.35) % (window.innerWidth * 0.2)}px)`;
      }
      if (cloudSvg2) {
        cloudSvg2.style.transform = `translateX(${Math.cos(this.cloudOffset * 0.02) * -34 - (this.cloudOffset * 0.28) % (window.innerWidth * 0.2)}px)`;
      }
    }

    // 5. Smooth lerp for scroll-linked 2.5D rotation & translation
    if (this.illo) {
      this.illo.rotate.y += (this.targetRotateY - this.illo.rotate.y) * 0.06;
      this.illo.rotate.x += (this.targetRotateX - this.illo.rotate.x) * 0.06;
      this.illo.translate.y += (this.targetTranslateY - this.illo.translate.y) * 0.06;

      this.illo.updateRenderGraph();
    }

    requestAnimationFrame(() => this.animate());
  }
}
