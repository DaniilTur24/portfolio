import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@13.1.1/+esm";

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const easeOut = [0.16, 1, 0.3, 1];

function revealHero() {
  const lines = document.querySelectorAll('.hero-content h1 .line-inner');
  const subhead = document.querySelector('.hero-content h2');
  const paras = document.querySelectorAll('.hero-content > p');
  const actions = document.querySelectorAll('.hero-actions .btn');

  if (lines.length) {
    animate(
      lines,
      { y: ['112%', '0%'], rotate: [5, 0] },
      { duration: 1, delay: stagger(0.14, { startDelay: 0.05 }), ease: [0.19, 1, 0.22, 1] }
    );
  }

  /* Each piece of the left column drifts in from its own side and settles
     into place, echoing the way the shapes assemble on the right. */
  if (subhead) {
    animate(
      subhead,
      { x: [64, 0], opacity: [0, 1] },
      { type: 'spring', stiffness: 60, damping: 16, mass: 1, delay: 0.55 }
    );
  }

  paras.forEach((p, i) => {
    const fromLeft = i % 2 === 0;
    animate(
      p,
      { x: [fromLeft ? -56 : 56, 0], opacity: [0, 1] },
      { type: 'spring', stiffness: 60, damping: 17, mass: 1, delay: 0.85 + i * 0.22 }
    );
  });

  actions.forEach((btn, i) => {
    const fromLeft = i % 2 === 0;
    animate(
      btn,
      { y: [36, 0], x: [fromLeft ? -30 : 30, 0], rotate: [fromLeft ? -7 : 7, 0], opacity: [0, 1], scale: [0.9, 1] },
      { type: 'spring', stiffness: 65, damping: 14, mass: 1, delay: 1.4 + i * 0.18 }
    );
  });
}

function revealHeroGraphic() {
  const quarter = document.querySelector('.shape-quarter');
  const green = document.querySelector('.shape-green');
  const yellow = document.querySelector('.shape-yellow');
  const blue = document.querySelector('.shape-blue');
  const orange = document.querySelector('.shape-orange');
  const photo = document.querySelector('.hero-photo');

  /* Each piece "rolls" or "drops" in from a different edge of the frame,
     like Lego blocks clicking into their slot — springs give the little
     overshoot/settle instead of a flat linear slide. Yellow leads the pack. */
  if (yellow) {
    animate(
      yellow,
      { y: ['180%', '0%'], rotate: [20, 0] },
      { type: 'spring', stiffness: 85, damping: 15, mass: 1, delay: 0.1 }
    );
  }
  if (quarter) {
    animate(
      quarter,
      { y: ['-190%', '0%'], rotate: [-14, 0] },
      { type: 'spring', stiffness: 80, damping: 16, mass: 1.1, delay: 0.24 }
    );
  }
  if (green) {
    animate(
      green,
      { x: ['-190%', '0%'], rotate: [-34, 0] },
      { type: 'spring', stiffness: 75, damping: 15, mass: 1.2, delay: 0.38 }
    );
  }
  if (blue) {
    /* the tumbleweed: rolls in edge-over-edge from off-screen, spinning
       through multiple turns as it travels rather than sliding straight. */
    animate(
      blue,
      { x: ['-240%', '0%'], y: ['110%', '0%'], rotate: [-300, 0] },
      { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }
    );
  }
  if (orange) {
    animate(
      orange,
      { x: ['210%', '0%'], rotate: [26, 0] },
      { type: 'spring', stiffness: 80, damping: 16, mass: 1.1, delay: 0.66 }
    );
  }
  if (photo) {
    animate(photo, { opacity: [0, 1] }, { duration: 0.7, ease: easeOut, delay: 0.95 });
  }
}

function navIndicator() {
  if (!finePointer.matches) return;

  const nav = document.querySelector('.main-nav');
  const indicator = document.querySelector('.nav-indicator');
  if (!nav || !indicator) return;

  const links = Array.from(nav.querySelectorAll('a')).filter((a) => !a.classList.contains('header-cta'));
  if (!links.length) return;

  const moveTo = (el, animated) => {
    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const target = { left: rect.left - navRect.left, width: rect.width, opacity: 1 };
    animate(indicator, target, animated ? { type: 'spring', stiffness: 380, damping: 32 } : { duration: 0 });
  };

  const activeLink = nav.querySelector('a.active');
  nav.classList.add('nav-js-ready');
  if (activeLink) moveTo(activeLink, false);

  links.forEach((link) => {
    link.addEventListener('pointerenter', () => moveTo(link, true));
  });

  nav.addEventListener('pointerleave', () => {
    const active = nav.querySelector('a.active');
    if (active) moveTo(active, true);
    else animate(indicator, { opacity: 0 }, { duration: 0.2 });
  });

  window.addEventListener('resize', () => {
    const active = nav.querySelector('a.active');
    if (active) moveTo(active, false);
  });
}

/* Motion writes its animation state as inline styles. Chrome, Safari and
   Firefox keep the whole document in the back/forward cache, so a page left
   mid-animation comes back frozen in that state on "back". Wipe those inline
   styles on a cached restore so the page is always shown in its final state. */
const MOTION_TARGETS =
  '#main, .hero-content h1 .line-inner, .hero-content h2, .hero-content > p, ' +
  '.hero-actions .btn, .hero-graphic .shape, .hero-photo';

const MOTION_PROPS = ['opacity', 'transform', 'scale', 'rotate', 'translate', 'clip-path'];

function clearInlineMotionStyles() {
  document.querySelectorAll(MOTION_TARGETS).forEach((el) => {
    const style = el.style;
    for (let i = style.length - 1; i >= 0; i -= 1) {
      const prop = style[i];
      if (MOTION_PROPS.includes(prop) || prop.startsWith('--motion')) {
        style.removeProperty(prop);
      }
    }
  });
}

function restoreFromBfcache() {
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) clearInlineMotionStyles();
  });
}

if (!prefersReducedMotion) {
  revealHero();
  revealHeroGraphic();
  navIndicator();
  restoreFromBfcache();
}
