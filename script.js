(function () {
  'use strict';

  // === Header shadow on scroll ===
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // === Intersection-based reveal for cards ===
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // === Sequential step highlight on scroll ===
  const steps = document.querySelectorAll('.step');
  if (steps.length) {
    const stepsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.step, 10) || 1;
            setTimeout(() => {
              entry.target.classList.add('is-active');
            }, (idx - 1) * 220);
            stepsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    steps.forEach((s) => stepsObserver.observe(s));
  }

  // === Animated counter ===
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 1800;
        const start = performance.now();
        const fmt = (n) => n.toLocaleString('ru-RU');
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = fmt(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = fmt(target) + '+';
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  // === FAQ: close siblings when one opens (optional accordion behavior) ===
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  // === Smooth scroll offset for sticky header ===
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
