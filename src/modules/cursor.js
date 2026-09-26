/**
 * Shodo (書道) Canvas-Based Calligraphic Ink Brush Cursor
 * Simulates traditional Japanese sumi-e ink trailing on Echizen washi paper.
 * Implements velocity-dependent stroke thickness, ink bleeding dissipation,
 * and delicate micro-splatters on swift flicks.
 */

export class ShodoCursor {
  constructor(canvasId = 'shodo-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.splatters = [];
    this.maxPoints = 45;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      speed: 0,
      isDown: false,
    };

    this.brushColor = 'rgba(28, 28, 28, ';
    this.init();
  }

  init() {
    this.resize();
    this.bindEvents();
    this.render();
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

    window.addEventListener('mousemove', (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (this.mouse.prevX === -1000) {
        this.mouse.prevX = currentX;
        this.mouse.prevY = currentY;
      }

      this.mouse.vx = currentX - this.mouse.prevX;
      this.mouse.vy = currentY - this.mouse.prevY;
      this.mouse.speed = Math.hypot(this.mouse.vx, this.mouse.vy);

      this.mouse.x = currentX;
      this.mouse.y = currentY;
      this.mouse.prevX = currentX;
      this.mouse.prevY = currentY;

      // Add point to stroke ribbon with life and dynamic width
      // Slower movements = thicker ink pools (3 to 14px)
      const baseWidth = Math.max(2, 14 - Math.min(this.mouse.speed * 0.4, 11));
      const width = this.mouse.isDown ? baseWidth * 1.8 : baseWidth;

      this.points.push({
        x: currentX,
        y: currentY,
        width: width,
        alpha: 0.9,
        life: 1.0,
      });

      // Spawn micro ink splatters on swift flick gestures
      if (this.mouse.speed > 28 && Math.random() < 0.4) {
        this.createSplatter(currentX, currentY, this.mouse.vx, this.mouse.vy);
      }
    });

    window.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.createInkBloom(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.points = [];
    });
  }

  createInkBloom(x, y) {
    // Generates a soft concentric ink blossom on click (Suzuri stamp feel)
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 16;
      this.splatters.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        radius: Math.random() * 3 + 1,
        alpha: 0.85,
        decay: 0.015,
      });
    }
  }

  createSplatter(x, y, vx, vy) {
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      const angleSpread = (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 0.5 + 0.2;
      this.splatters.push({
        x: x,
        y: y,
        vx: vx * speed + Math.cos(angleSpread) * 3,
        vy: vy * speed + Math.sin(angleSpread) * 3,
        radius: Math.random() * 2 + 0.8,
        alpha: 0.7,
        decay: 0.02 + Math.random() * 0.02,
      });
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw and update trailing calligraphic ribbon
    if (this.points.length > 1) {
      for (let i = 0; i < this.points.length - 1; i++) {
        const p1 = this.points[i];
        const p2 = this.points[i + 1];

        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

        this.ctx.lineWidth = p1.width * p1.life;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = `${this.brushColor}${p1.alpha * p1.life})`;
        this.ctx.stroke();

        // Ink dissipation over time
        p1.life -= 0.035;
      }
    }

    // Filter dead stroke points
    this.points = this.points.filter((p) => p.life > 0);

    // 2. Render and update micro splatters
    for (let i = this.splatters.length - 1; i >= 0; i--) {
      const s = this.splatters[i];
      if (s.vx !== undefined) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
      }

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${this.brushColor}${s.alpha})`;
      this.ctx.fill();

      s.alpha -= s.decay;
      if (s.alpha <= 0) {
        this.splatters.splice(i, 1);
      }
    }

    // 3. Render tiny brush tip core when hovering
    if (this.mouse.x > 0 && this.mouse.y > 0) {
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(203, 27, 69, 0.7)'; // subtle crimson core
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.render());
  }
}
