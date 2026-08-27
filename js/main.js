(() => {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && header && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        header.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  const shotImgs = document.querySelectorAll('.case-shot-image img');
  if (shotImgs.length) {
    const overlay = document.createElement('div');
    overlay.className = 'shot-lightbox';
    overlay.innerHTML = `
      <button type="button" class="shot-lightbox-close" aria-label="Close image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <img class="shot-lightbox-img" src="" alt="">
    `;
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector('.shot-lightbox-img');
    const closeBtn = overlay.querySelector('.shot-lightbox-close');
    let lastFocused = null;

    const openLightbox = (img) => {
      lastFocused = img;
      overlayImg.src = img.currentSrc || img.src;
      overlayImg.alt = img.alt;
      overlay.classList.add('open');
      document.body.classList.add('lightbox-open');
      closeBtn.focus();
    };

    const closeLightbox = () => {
      overlay.classList.remove('open');
      document.body.classList.remove('lightbox-open');
      if (lastFocused) lastFocused.focus();
    };

    shotImgs.forEach((img) => {
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', 'View larger: ' + img.alt);
      img.addEventListener('click', () => openLightbox(img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
    });
  }
})();
