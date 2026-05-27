/* ─── Parity Wellbeing — Mobile Navigation & Interactions ─── */
(function() {
  'use strict';

  /* ── Mobile Nav Toggle ── */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav  = document.querySelector('.mobile-nav');

  function toggleNav() {
    mobileNav.classList.toggle('open');
    menuToggle.textContent = mobileNav.classList.contains('open') ? '✕' : '☰';
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    menuToggle.textContent = '☰';
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleNav();
    });

    /* Close when clicking any link inside mobile nav */
    mobileNav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', closeNav);
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeNav();
    });

    /* Close when clicking outside */
    document.addEventListener('click', function(e) {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeNav();
      }
    });
  }

  /* ── Scroll Reveal (IntersectionObserver) ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function(el) {
      observer.observe(el);
    });
  } else {
    /* Fallback for older browsers */
    document.querySelectorAll('.reveal').forEach(function(el) {
      el.classList.add('visible');
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Navbar shadow on scroll ── */
  const navbar = document.querySelector('.navbar');
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  });
})();
