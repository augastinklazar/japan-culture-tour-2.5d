/**
 * Ma (間) & Zen Garden (枯山水) Interactive Raked Sand Canvas
 * Allows the visitor to rake meditative gravel lines and place moss-accented stones,
 * embodying the Zen principles of negative space, simplicity, and serenity.
 */

export class ZenSandGarden {
  constructor(canvasId = 'zen-sand-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resetBtn = document.getElementById('zen-reset-btn');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.stones = [
      { x: 320, y: 220, r: 28, mossAngle: 0.6 },
      { x: 360, y: 260, r: 18, mossAngle: 0.4 },
      { x: 880, y: 340, r: 34, mossAngle: 0.8 },
      { x: 930, y: 310, r: 20, mossAngle: 0.5 },
    ];

    this.ripples = [];
    this.mouse = { x: -100, y: -100, prevX: -100, prevY: -100, isOver: false };

    this.init();
  }

  init() {
    this.resize();
    this.bindEvents();
    this.render();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mouseenter', () => {
      this.mouse.isOver = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.isOver = false;
      this.mouse.x = -100;
      this.mouse.y = -100;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (this.mouse.prevX !== -100) {
        const dist = Math.hypot(currentX - this.mouse.prevX, currentY - this.mouse.prevY);
        if (dist > 18) {
          // Add raked sand wave ripple
          this.ripples.push({
            x: currentX,
            y: currentY,
            radius: 8,
            maxRadius: 45,
            alpha: 0.65,
          });
          this.mouse.prevX = currentX;
          this.mouse.prevY = currentY;
        }
      } else {
        this.mouse.prevX = currentX;
        this.mouse.prevY = currentY;
      }

      this.mouse.x = currentX;
      this.mouse.y = currentY;
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Add a newly placed moss stone
      if (this.stones.length < 8) {
        this.stones.push({
          x: clickX,
          y: clickY,
          r: Math.random() * 16 + 20,
          mossAngle: Math.random() * Math.PI,
        });

        // Radiate concentric ripples from the placed stone
        for (let i = 1; i <= 4; i++) {
          setTimeout(() => {
            this.ripples.push({
              x: clickX,
              y: clickY,
              radius: 12,
              maxRadius: 70 + i * 20,
              alpha: 0.8,
            });
          }, i * 140);
        }
      }
    });

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.ripples = [];
        this.stones = [
          { x: 320, y: 220, r: 28, mossAngle: 0.6 },
          { x: 360, y: 260, r: 18, mossAngle: 0.4 },
          { x: 880, y: 340, r: 34, mossAngle: 0.8 },
          { x: 930, y: 310, r: 20, mossAngle: 0.5 },
        ];
      });
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Raked Sand Base (Horizontal Meditation Grooves)
    this.drawBaseSandGrooves();

    // 2. Draw Dynamic User Raking Ripples
    this.drawRipples();

    // 3. Draw Concentric Wave Halos Around Sacred Stones (Sazanami 漣)
    this.drawStoneRipples();

    // 4. Draw Mossy Stones (Ishi 石)
    this.drawStones();

    // 5. User rake cursor preview
    if (this.mouse.isOver && this.mouse.x > 0) {
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 14, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(203, 27, 69, 0.4)';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    }

    requestAnimationFrame(() => this.render());
  }

  drawBaseSandGrooves() {
    const spacing = 14;
    this.ctx.save();
    this.ctx.lineWidth = 1.2;

    for (let y = 10; y < this.height; y += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      // Soft wave undulation across gravel
      const wave = Math.sin(y * 0.05) * 4;
      this.ctx.lineTo(this.width, y + wave);

      this.ctx.strokeStyle = '#DDD8C8';
      this.ctx.stroke();

      // Soft highlight edge on groove ridge
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 1.5);
      this.ctx.lineTo(this.width, y + 1.5 + wave);
      this.ctx.strokeStyle = 'rgba(255, 255, 251, 0.5)';
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawRipples() {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += 0.8;
      rip.alpha -= 0.009;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = `rgba(180, 170, 150, ${rip.alpha})`;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(rip.x, rip.y, rip.radius + 1.5, 0, Math.PI * 2);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = `rgba(255, 255, 251, ${rip.alpha * 0.6})`;
      this.ctx.stroke();
    }
  }

  drawStoneRipples() {
    this.ctx.save();
    this.stones.forEach((stone) => {
      // Concentric raked sand rings surrounding each stone
      for (let ring = 1; ring <= 4; ring++) {
        const ringRadius = stone.r + ring * 12;
        this.ctx.beginPath();
        this.ctx.arc(stone.x, stone.y, ringRadius, 0, Math.PI * 2);
        this.ctx.lineWidth = 1.4;
        this.ctx.strokeStyle = '#D1CBBA';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(stone.x, stone.y, ringRadius + 1.2, 0, Math.PI * 2);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'rgba(255, 255, 251, 0.4)';
        this.ctx.stroke();
      }
    });
    this.ctx.restore();
  }

  drawStones() {
    this.stones.forEach((stone) => {
      // Stone drop shadow
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.ellipse(stone.x + 4, stone.y + stone.r * 0.8, stone.r * 1.1, stone.r * 0.4, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(28, 28, 28, 0.25)';
      this.ctx.fill();

      // Stone core
      this.ctx.beginPath();
      this.ctx.arc(stone.x, stone.y, stone.r, 0, Math.PI * 2);
      const grad = this.ctx.createRadialGradient(
        stone.x - stone.r * 0.3,
        stone.y - stone.r * 0.3,
        stone.r * 0.1,
        stone.x,
        stone.y,
        stone.r
      );
      grad.addColorStop(0, '#5A534C');
      grad.addColorStop(0.7, '#2F2A26');
      grad.addColorStop(1, '#1A1816');
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Moss patch (Koke 苔)
      this.ctx.beginPath();
      this.ctx.arc(
        stone.x + Math.cos(stone.mossAngle) * (stone.r * 0.4),
        stone.y + Math.sin(stone.mossAngle) * (stone.r * 0.4),
        stone.r * 0.55,
        0,
        Math.PI * 2
      );
      this.ctx.fillStyle = '#3E543B';
      this.ctx.globalAlpha = 0.85;
      this.ctx.fill();
      this.ctx.restore();
    });
  }
}
