/**
 * Global Loader (Pre-loader) Module
 * Features an authentic Zen Enso circle drawn via Anime.js SVG line-drawing,
 * synchronized with a monospace 0-100% counter and dramatic circular portal reveal.
 */

export class ZenLoader {
  constructor(onComplete) {
    this.loaderEl = document.getElementById('global-loader');
    this.counterEl = document.getElementById('loader-counter');
    this.progressBarEl = document.getElementById('loader-bar-progress');
    this.ensoPath = document.getElementById('enso-path');
    this.loaderSeal = document.querySelector('.loader-seal');
    this.splatters = document.querySelectorAll('.enso-splatter');
    this.onComplete = onComplete;

    this.progress = { value: 0 };
    this.init();
  }

  init() {
    if (!this.loaderEl || !this.ensoPath || typeof anime === 'undefined') {
      // Fallback if Anime.js is not yet loaded
      setTimeout(() => this.finish(), 800);
      return;
    }

    // Set initial dasharray and offset
    const pathLength = this.ensoPath.getTotalLength();
    this.ensoPath.style.strokeDasharray = pathLength;
    this.ensoPath.style.strokeDashoffset = pathLength;

    this.startLoadingSequence(pathLength);
  }

  startLoadingSequence(pathLength) {
    // 1. Anime.js Timeline for Drawing the Calligraphic Enso Path
    const loaderTimeline = anime.timeline({
      easing: 'easeInOutCubic',
      complete: () => {
        this.revealHomepage();
      },
    });

    // Animate Enso Circle Brushstroke
    loaderTimeline.add({
      targets: this.ensoPath,
      strokeDashoffset: [pathLength, 0],
      duration: 2200,
      easing: 'easeInOutQuart',
    });

    // Splatters pop in near the end of the stroke
    loaderTimeline.add(
      {
        targets: this.splatters,
        opacity: [0, 1],
        scale: [0.5, 1],
        delay: anime.stagger(100),
        duration: 400,
      },
      '-=600'
    );

    // Hanko seal stamp appears inside the Enso
    loaderTimeline.add(
      {
        targets: this.loaderSeal,
        opacity: [0, 1],
        scale: [0.7, 1],
        duration: 500,
        easing: 'easeOutBack',
      },
      '-=400'
    );

    // 2. Monospace percentage counter animation (000% -> 100%)
    anime({
      targets: this.progress,
      value: 100,
      duration: 2200,
      easing: 'easeInOutCubic',
      update: () => {
        const val = Math.floor(this.progress.value);
        const formatted = String(val).padStart(3, '0') + '%';
        if (this.counterEl) this.counterEl.textContent = formatted;
        if (this.progressBarEl) this.progressBarEl.style.width = `${val}%`;
      },
    });
  }

  revealHomepage() {
    // Reveal portal: Enso scales up into screen transition
    const ensoContainer = document.querySelector('.enso-container');
    const loaderStatus = document.querySelector('.loader-status');

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => this.finish(),
      });

      tl.to(loaderStatus, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.in',
      })
      .to(ensoContainer, {
        scale: 18,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.inOut',
      }, '-=0.2')
      .to(this.loaderEl, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4');
    } else {
      // Fallback if GSAP is unavailable
      setTimeout(() => this.finish(), 800);
    }
  }

  finish() {
    document.body.classList.remove('loading-active');
    if (this.loaderEl) {
      this.loaderEl.classList.add('hidden');
    }
    if (typeof this.onComplete === 'function') {
      this.onComplete();
    }
  }
}
