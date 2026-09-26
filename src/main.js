/**
 * ============================================================================
 * YŪGEN (幽玄) — 2.5D Japanese Culture Tour
 * Master Application Coordinator & State Controller
 * Integrates Lenis Smooth Scroll, GSAP ScrollTrigger, Custom Shodo Ink Cursor,
 * Zdog 2.5D Torii Gate, Ukiyo-e Parallax, Kintsugi Interactive Restoration,
 * Zen Raked Sand Garden, and Generative Audio.
 * ============================================================================
 */

import { ShodoCursor } from './modules/cursor.js';
import { ZenLoader } from './modules/loader.js';
import { ZdogTorii } from './modules/torii.js';
import { UkiyoParallax } from './modules/ukiyo.js';
import { KintsugiExperience } from './modules/kintsugi.js';
import { ZenSandGarden } from './modules/zen-garden.js';
import { ZenAudio } from './modules/audio.js';
import { NavigationManager } from './modules/navigation.js';
import { BackgroundEcosystem } from './modules/ecosystem.js';
import { WindSystem } from './WindSystem.js';

class Application {
  constructor() {
    this.lenis = null;
    this.cursor = null;
    this.loader = null;
    this.torii = null;
    this.ukiyo = null;
    this.kintsugi = null;
    this.zenGarden = null;
    this.audio = null;
    this.nav = null;
    this.ecosystem = null;
    this.windSystem = null;

    this.init();
  }

  init() {
    console.log(
      '%c 幽玄 YŪGEN — 2.5D Japanese Culture Tour %c Loaded %c',
      'background: #1C1C1C; color: #FFFFFB; padding: 4px 8px; font-weight: bold; border-left: 4px solid #CB1B45;',
      'background: #CB1B45; color: #FFFFFB; padding: 4px 8px;',
      'background: transparent;'
    );

    // 1. Initialize Atmospheric Wind & Streamlines Engine
    this.windSystem = new WindSystem('wind-canvas');

    // 2. Initialize Metallic Kinpaku Gold Shimmer Shift
    this.initKinpakuShimmer();

    // 3. Initialize Lenis Smooth Scrolling Engine
    this.initLenis();

    // 4. Initialize Shodo Calligraphic Ink Cursor
    this.cursor = new ShodoCursor('shodo-canvas');

    // 5. Initialize Audio Synthesizer
    this.audio = new ZenAudio('audio-toggle');

    // 6. Initialize The Global Zen Preloader
    this.loader = new ZenLoader(() => {
      this.onExperienceReady();
    });

    // 7. Initialize Navigation & Chrome Manager
    this.nav = new NavigationManager(this.lenis);
  }

  initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis library not detected; relying on standard scroll.');
      return;
    }

    this.lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis with GSAP ScrollTrigger & WindSystem Velocity
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      this.lenis.on('scroll', (e) => {
        ScrollTrigger.update();
        if (this.windSystem && e && typeof e.velocity === 'number') {
          this.windSystem.onScroll(e.velocity);
        }
      });

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

  initKinpakuShimmer() {
    const overlay = document.getElementById('kinpaku-overlay');
    if (!overlay) return;

    window.addEventListener('mousemove', (e) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      overlay.style.setProperty('--kinpaku-x', `${xPercent}%`);
      overlay.style.setProperty('--kinpaku-y', `${yPercent}%`);
      overlay.style.transform = `translate3d(${(e.clientX / window.innerWidth - 0.5) * -16}px, ${(e.clientY / window.innerHeight - 0.5) * -12}px, 0)`;
    });
  }

  onExperienceReady() {
    // 8. Initialize 2.5D Animated Background Ecosystem with Wind Coupling
    this.ecosystem = new BackgroundEcosystem(this.windSystem);

    // 9. Initialize Zdog 2.5D Torii Gate
    this.torii = new ZdogTorii('torii-canvas');

    // 10. Initialize Ukiyo-e Multi-Plane Parallax Stage
    this.ukiyo = new UkiyoParallax();

    // 11. Initialize Kintsugi Ceramic Restoration Experience
    this.kintsugi = new KintsugiExperience();

    // 12. Initialize Ma & Zen Raked Sand Garden
    this.zenGarden = new ZenSandGarden('zen-sand-canvas');

    // Trigger hero entrance reveal
    this.playHeroEntrance();

    // Refresh ScrollTrigger calculations after DOM & loader layout settles
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  playHeroEntrance() {
    if (typeof gsap === 'undefined') return;

    const heroElements = [
      '.hero-title',
      '.hero-eyebrow',
      '.vertical-quote-col',
      '.hanko-card',
      '.scroll-instruction',
    ];

    gsap.from(heroElements, {
      opacity: 0,
      y: 30,
      duration: 1.4,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'all',
    });
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  new Application();
});
