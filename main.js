/** ------------------------------------------------------------------
 *  Parity Wellbeing — Interactions & Visual Effects
 *  Mobile nav, scroll reveal, canvas animations, micro-interactions
 *  ------------------------------------------------------------------ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     CORE UTILITIES
     ═══════════════════════════════════════════════ */
  function easeOutQuart (t) { return 1 - Math.pow(1 - t, 4); }
  function easeOutCubic (t) { return 1 - Math.pow(1 - t, 3); }
  function lerp (a, b, t) { return a + (b - a) * t; }

  /* ═══════════════════════════════════════════════
     1. HERO MESH GRADIENT CANVAS
     ═══════════════════════════════════════════════ */
  (function initHeroCanvas () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize () {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Blobs: {x, y, radius, color, speedX, speedY, phase}
    const colors = [
      'rgba(204,251,239,0.45)', // teal-100
      'rgba(241,245,249,0.40)', // twilight-100
      'rgba(153,246,221,0.35)', // teal-200
      'rgba(224,242,254,0.30)'  // sky-ish
    ];
    const blobs = [
      { x: 0.2, y: 0.3, r: 0.35, c: colors[0], sx: 0.00015, sy: 0.00012, ph: 0 },
      { x: 0.8, y: 0.6, r: 0.40, c: colors[1], sx: 0.00012, sy: 0.00018, ph: 1.5 },
      { x: 0.5, y: 0.8, r: 0.30, c: colors[2], sx: 0.00018, sy: 0.00010, ph: 3.0 },
      { x: 0.1, y: 0.7, r: 0.25, c: colors[3], sx: 0.00010, sy: 0.00014, ph: 4.5 }
    ];

    let frameId;
    function draw (time) {
      ctx.clearRect(0, 0, width, height);

      blobs.forEach(function (b) {
        const bx = (b.x + Math.sin(time * b.sx + b.ph) * 0.08) * width;
        const by = (b.y + Math.cos(time * b.sy + b.ph) * 0.06) * height;
        const br = b.r * Math.min(width, height);

        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, b.c);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    }
    frameId = requestAnimationFrame(draw);

    // Pause when not visible
    const heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !frameId) {
          frameId = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && frameId) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(canvas.parentElement);
  })();

  /* ═══════════════════════════════════════════════
     2. HERO HEADLINE DECODE EFFECT
     ═══════════════════════════════════════════════ */
  (function initHeadlineDecode () {
    const h1 = document.getElementById('hero-headline');
    if (!h1) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Collect all text nodes and their original text
    const textNodes = [];
    const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent.trim();
      if (text) textNodes.push({ node: node, original: text, parent: node.parentElement });
    }

    let frame = 0;
    const totalFrames = 20;

    function decode () {
      frame++;
      const progress = frame / totalFrames;
      const revealThreshold = Math.floor(progress * textNodes.length);

      textNodes.forEach(function (item, i) {
        if (i < revealThreshold) {
          item.node.textContent = item.original;
        } else if (i === revealThreshold) {
          // Partial reveal of current node
          const partial = Math.floor((progress * textNodes.length - revealThreshold) * item.original.length);
          const revealed = item.original.slice(0, partial);
          const scrambled = Array.from({ length: item.original.length - partial }, function () {
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          item.node.textContent = revealed + scrambled;
        } else {
          // Fully scrambled
          item.node.textContent = Array.from({ length: item.original.length }, function () {
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
        }
      });

      if (frame < totalFrames) {
        setTimeout(decode, 30);
      } else {
        textNodes.forEach(function (item) { item.node.textContent = item.original; });
      }
    }

    setTimeout(decode, 400);
  })();

  /* ═══════════════════════════════════════════════
     3. LIVING PHONE MOCKUP
     ═══════════════════════════════════════════════ */
  (function initLivingPhone () {
    const phone = document.getElementById('hero-phone');
    if (!phone) return;

    // Add float animation class
    phone.classList.add('living');

    // Pulse widget dots sequentially
    const dots = phone.querySelectorAll('.w-d');
    dots.forEach(function (dot, i) {
      setTimeout(function () {
        dot.classList.add('pulse-glow');
      }, 800 + i * 400);
    });
  })();

  /* ═══════════════════════════════════════════════
     4. SVG ICON DRAW-ON-SCROLL
     ═══════════════════════════════════════════════ */
  (function initIconDraw () {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.f-svg').forEach(function (el) { el.classList.add('drawn'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const svg = entry.target;
          svg.classList.add('drawn');
          observer.unobserve(svg);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.f-svg').forEach(function (svg) {
      observer.observe(svg);
    });
  })();

  /* ═══════════════════════════════════════════════
     5. ANIMATED RADAR CHART CANVAS
     ═══════════════════════════════════════════════ */
  (function initRadarChart () {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 280;
    const center = size / 2;
    const radius = 90;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 5 wellbeing dimensions matching the app
    const labels = ['Life', 'Worth', 'Happy', 'Calm', 'Anxiety'];
    const data = [0.75, 0.55, 0.90, 0.65, 0.70]; // normalised 0-1
    const colors = {
      grid: 'rgba(255,255,255,0.08)',
      axis: 'rgba(255,255,255,0.12)',
      fill: 'rgba(29,158,117,0.25)',
      stroke: '#2DD4A8',
      point: '#5EE9C8'
    };

    let animProgress = 0;
    let hasAnimated = false;
    let frameId;

    function getPoint (i, r) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      return {
        x: center + Math.cos(angle) * r,
        y: center + Math.sin(angle) * r
      };
    }

    function draw (progress) {
      ctx.clearRect(0, 0, size, size);

      // Draw grid rings
      for (let ring = 1; ring <= 4; ring++) {
        const r = (radius / 4) * ring;
        ctx.beginPath();
        for (let i = 0; i <= 5; i++) {
          const p = getPoint(i % 5, r);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw axes
      for (let i = 0; i < 5; i++) {
        const p = getPoint(i, radius);
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = colors.axis;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw data polygon
      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const idx = i % 5;
        const val = data[idx] * progress;
        const r = radius * val;
        const p = getPoint(idx, r);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = colors.fill;
      ctx.fill();
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      for (let i = 0; i < 5; i++) {
        const val = data[i] * progress;
        const r = radius * val;
        const p = getPoint(i, r);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.point;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    function animate () {
      animProgress += 0.012;
      if (animProgress > 1) animProgress = 1;
      draw(easeOutCubic(animProgress));
      if (animProgress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        // Gentle idle pulse on points
        let t = 0;
        function idle () {
          t += 0.02;
          draw(1);
          // Add subtle glow to center
          const glow = ctx.createRadialGradient(center, center, 0, center, center, radius * 0.6);
          glow.addColorStop(0, 'rgba(29,158,117,' + (0.05 + Math.sin(t) * 0.03) + ')');
          glow.addColorStop(1, 'rgba(29,158,117,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(center, center, radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
          frameId = requestAnimationFrame(idle);
        }
        idle();
      }
    }

    // Trigger on scroll
    const radarObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          frameId = requestAnimationFrame(animate);
          radarObserver.unobserve(canvas);
        }
      });
    }, { threshold: 0.3 });
    radarObserver.observe(canvas);
  })();

  /* ═══════════════════════════════════════════════
     6. COUNT-UP STATISTICS
     ═══════════════════════════════════════════════ */
  (function initCountUp () {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const isFloat = target % 1 !== 0;
          const duration = 1500;
          const startTime = performance.now();

          function tick (now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            const current = eased * target;
            el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ═══════════════════════════════════════════════
     7. MAGNETIC BUTTON EFFECT
     ═══════════════════════════════════════════════ */
  (function initMagneticButtons () {
    document.querySelectorAll('.btn-primary.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const max = 6;
        const dist = Math.sqrt(x * x + y * y);
        const factor = Math.min(dist / (rect.width / 2), 1);
        const tx = (x / rect.width) * max * 2 * factor;
        const ty = (y / rect.height) * max * 2 * factor;
        btn.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(1.02)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  })();

  /* ═══════════════════════════════════════════════
     8. MOBILE NAV TOGGLE (existing)
     ═══════════════════════════════════════════════ */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      const icon = menuToggle.querySelector('.menu-icon');
      if (icon) icon.textContent = isOpen ? '✕' : '☰';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeNav(); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeNav();
    });

    document.addEventListener('click', function (e) {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        closeNav();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && mobileNav.classList.contains('open')) closeNav();
    });
  }

  function closeNav () {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    const icon = menuToggle.querySelector('.menu-icon');
    if (icon) icon.textContent = '☰';
    document.body.style.overflow = '';
  }

  /* ═══════════════════════════════════════════════
     9. SCROLL REVEAL (existing)
     ═══════════════════════════════════════════════ */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ═══════════════════════════════════════════════
     10. NAVBAR SHADOW ON SCROLL (existing)
     ═══════════════════════════════════════════════ */
  const nav = document.querySelector('.navbar');
  if (nav) {
    let scrollTimeout;
    window.addEventListener('scroll', function () {
      if (scrollTimeout) return;
      scrollTimeout = requestAnimationFrame(function () {
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
        scrollTimeout = null;
      });
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     11. FAQ ACCORDION (existing)
     ═══════════════════════════════════════════════ */
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('active');
      question.setAttribute('aria-expanded', !isActive);
    });
  });

  /* ═══════════════════════════════════════════════
     12. SMOOTH SCROLL FOR ANCHOR LINKS (existing)
     ═══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ═══════════════════════════════════════════════
     13. SKIP LINK FOCUS (existing)
     ═══════════════════════════════════════════════ */
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
