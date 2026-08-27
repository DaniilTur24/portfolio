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

  if (subhead) {
    animate(subhead, { y: [22, 0], opacity: [0, 1] }, { type: 'spring', stiffness: 170, damping: 18, mass: 0.7, delay: 0.55 });
  }

  paras.forEach((p, i) => {
    animate(p, { y: [16, 0], opacity: [0, 1] }, { type: 'spring', stiffness: 170, damping: 20, delay: 0.68 + i * 0.08 });
  });

  actions.forEach((btn, i) => {
    animate(btn, { y: [14, 0], opacity: [0, 1], scale: [0.94, 1] }, { type: 'spring', stiffness: 260, damping: 16, delay: 0.95 + i * 0.07 });
  });
}

function revealEyebrows() {
  const eyebrows = document.querySelectorAll('.why-work-heading .eyebrow, .cta-heading .eyebrow');

  eyebrows.forEach((el) => {
    const stop = inView(
      el,
      () => {
        animate(el, { opacity: [0, 1], x: [-14, 0] }, { duration: 0.5, ease: easeOut });
        stop();
      },
      { margin: '0px 0px -10% 0px' }
    );
  });
}

function workGridEntrance() {
  const grid = document.querySelector('.work-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.work-card');
  if (!cards.length) return;

  const stop = inView(
    grid,
    () => {
      animate(
        cards,
        { opacity: [0, 1], y: [30, 0], scale: [0.97, 1] },
        { duration: 0.7, delay: stagger(0.1), ease: easeOut }
      );
      stop();
    },
    { margin: '0px 0px -10% 0px' }
  );
}

function revealHeadings() {
  const headings = document.querySelectorAll(
    '.selected-work h2, .what-i-do h2, .why-work-heading h2, .tech-capabilities h2, .about-content h2, .cta-heading h2'
  );

  headings.forEach((el) => {
    const stop = inView(
      el,
      () => {
        animate(
          el,
          { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'], y: [18, 0] },
          { duration: 0.8, ease: easeOut }
        );
        stop();
      },
      { margin: '0px 0px -12% 0px' }
    );
  });
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

function projectPageTransition() {
  const links = document.querySelectorAll('.card-link[href]');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();

      const card = link.closest('.work-card');
      const media = card ? card.querySelector('.card-media') : null;
      const main = document.getElementById('main');

      if (card) animate(card, { scale: 0.97 }, { duration: 0.3, ease: [0.4, 0, 0.2, 1] });
      if (media) animate(media, { scale: 1.05 }, { duration: 0.34, ease: [0.4, 0, 0.2, 1] });
      if (main) animate(main, { opacity: 0.5 }, { duration: 0.3, delay: 0.05 });

      window.setTimeout(() => { window.location.href = href; }, 300);
    });
  });
}

if (!prefersReducedMotion) {
  revealHero();
  revealEyebrows();
  revealHeadings();
  workGridEntrance();
  navIndicator();
  projectPageTransition();
}
