/** ------------------------------------------------------------------
 *  Parity Wellbeing — Mobile Navigation & Interactions
 *  Handles mobile menu toggle, scroll reveal, navbar shadow
 *  ------------------------------------------------------------------ */

(function () {
  'use strict';

  /* ── Mobile Nav Toggle ── */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    // Toggle mobile nav
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      
      // Update ARIA attributes
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      
      // Update hamburger icon
      const icon = menuToggle.querySelector('.menu-icon');
      if (icon) {
        icon.textContent = isOpen ? '✕' : '☰';
      }
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking links inside mobile nav
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeNav();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeNav();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (mobileNav.classList.contains('open') && 
          !mobileNav.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        closeNav();
      }
    });

    // Close on resize (switching to desktop)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && mobileNav.classList.contains('open')) {
        closeNav();
      }
    });
  }

  function closeNav () {
    if (!mobileNav) return;
    
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    
    const icon = menuToggle.querySelector('.menu-icon');
    if (icon) {
      icon.textContent = '☰';
    }
    
    document.body.style.overflow = '';
  }

  /* ── Scroll Reveal (IntersectionObserver) ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Navbar Shadow on Scroll ── */
  const nav = document.querySelector('.navbar');
  if (nav) {
    let scrollTimeout;
    
    window.addEventListener('scroll', function () {
      if (scrollTimeout) return;
      
      scrollTimeout = requestAnimationFrame(function () {
        if (window.scrollY > 20) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        scrollTimeout = null;
      });
    }, { passive: true });
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion) {
            otherQuestion.setAttribute('aria-expanded', 'false');
          }
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
      question.setAttribute('aria-expanded', !isActive);
    });
  });

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length <= 1) return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── Skip Link Focus ── */
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function (e) {
      const mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
      }
    });
  }

})();
