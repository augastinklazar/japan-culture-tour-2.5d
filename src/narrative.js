/**
 * ============================================================================
 * narrative.js — Japanese Aesthetic Philosophy Narrative Controller
 * ============================================================================
 * Coordinates Lenis Smooth Scroll, GSAP ScrollTrigger, Shodo Ink Cursor,
 * Generative Zen Audio, and localized visual mechanics from ContentAnimations.js.
 */

import { ShodoCursor } from './modules/cursor.js';
import { ZenAudio } from './modules/audio.js';
import { ContentAnimations } from './ContentAnimations.js';

class NarrativeApp {
  constructor() {
    this.lenis = null;
    this.cursor = null;
    this.audio = null;
    this.animations = null;

    this.init();
  }

  init() {
    console.log(
      '%c 幽玄 YŪGEN — Philosophy & Narrative %c Loaded %c',
      'background: #1C1C1C; color: #FFFFFB; padding: 4px 8px; font-weight: bold; border-left: 4px solid #CB1B45;',
      'background: #CB1B45; color: #FFFFFB; padding: 4px 8px;',
      'background: transparent;'
    );

    this.initLenis();
    this.cursor = new ShodoCursor('shodo-canvas');
    this.audio = new ZenAudio('audio-toggle');
    this.animations = new ContentAnimations();
    this.initTokyoClock();
    this.initScrollProgress();
  }

  initLenis() {
    if (typeof Lenis === 'undefined') return;

    this.lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      this.lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  initTokyoClock() {
    const clockEl = document.getElementById('tokyo-time');
    if (!clockEl) return;

    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Tokyo',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  initScrollProgress() {
    const rail = document.getElementById('narrative-scroll-progress');
    if (!rail) return;

    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const p = (window.scrollY / total) * 100;
        rail.style.height = `${p}%`;
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new NarrativeApp();
});
