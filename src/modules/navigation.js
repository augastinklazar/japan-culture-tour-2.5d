/**
 * Navigation & Chrome Coordinator Module
 * Manages active section observation, vertical chapter rail progress,
 * smooth Lenis anchor scroll jumps, and the live Tokyo JST clock.
 */

export class NavigationManager {
  constructor(lenisInstance) {
    this.lenis = lenisInstance;
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.section');
    this.railProgress = document.getElementById('rail-progress-line');
    this.railSectionLabel = document.getElementById('rail-current-section');
    this.tokyoClockEl = document.getElementById('tokyo-time');

    this.sectionKanjiMap = {
      portal: '壱 門',
      ukiyo: '弐 浮世',
      kintsugi: '参 金継',
      'zen-garden': '四 枯山水',
    };

    this.init();
  }

  init() {
    this.initTokyoClock();
    this.initSmoothNavClicks();
    this.initSectionObserver();
    this.initScrollProgress();
  }

  initTokyoClock() {
    if (!this.tokyoClockEl) return;

    const updateClock = () => {
      const now = new Date();
      // Format time in Tokyo timezone (JST GMT+9)
      const options = {
        timeZone: 'Asia/Tokyo',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const tokyoTimeString = new Intl.DateTimeFormat('en-US', options).format(now);
      this.tokyoClockEl.textContent = tokyoTimeString;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  initSmoothNavClicks() {
    const allJumpLinks = document.querySelectorAll('a[href^="#"]');

    allJumpLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            if (this.lenis) {
              this.lenis.scrollTo(targetEl, { offset: 0, duration: 1.4 });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  initSectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;

            // Update active state in top navigation
            this.navLinks.forEach((link) => {
              if (link.dataset.nav === sectionId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });

            // Update vertical chapter rail label
            if (this.railSectionLabel && this.sectionKanjiMap[sectionId]) {
              this.railSectionLabel.textContent = this.sectionKanjiMap[sectionId];
            }
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    this.sections.forEach((section) => observer.observe(section));
  }

  initScrollProgress() {
    window.addEventListener('scroll', () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0 && this.railProgress) {
        const currentScroll = window.scrollY;
        const progress = (currentScroll / totalScroll) * 100;
        this.railProgress.style.height = `${progress}%`;
      }
    });
  }
}
