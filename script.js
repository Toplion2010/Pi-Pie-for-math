/* ================================================
   Pi-Pie — Math Week Story Website
   Canvas π animation + scroll reveals + modal
   ================================================ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================
     COLOR PALETTE for dots
     ================================================ */
  var COLORS = [
    '#FF6B6B', '#FF9A76', '#FBBF24', '#34D399',
    '#3EC1D3', '#67E8F9', '#818CF8', '#8B5CF6',
    '#C084FC', '#F472B6', '#FB7185', '#FCA5A5'
  ];

  function pickColor(i) {
    return COLORS[i % COLORS.length];
  }

  /* ================================================
     PI SYMBOL target points
     Define the π shape as a set of (x, y) coords
     centered at (0, 0), scale ~1 (will be multiplied)
     ================================================ */
  function generatePiPoints(count) {
    var pts = [];

    /* Top horizontal bar: 30% of dots */
    var barCount = Math.round(count * 0.30);
    for (var i = 0; i < barCount; i++) {
      var t = i / (barCount - 1);             /* 0 → 1 */
      pts.push({ x: -0.52 + t * 1.04, y: -0.48 });
    }

    /* Left leg (slightly curved): 30% of dots */
    var leftCount = Math.round(count * 0.30);
    for (var j = 0; j < leftCount; j++) {
      var t2 = j / (leftCount - 1);
      var x = -0.28 - t2 * 0.08;               /* slight leftward curve */
      var y = -0.48 + t2 * 0.92;
      pts.push({ x: x, y: y });
    }

    /* Right leg (straight): 30% of dots */
    var rightCount = Math.round(count * 0.30);
    for (var k = 0; k < rightCount; k++) {
      var t3 = k / (rightCount - 1);
      pts.push({ x: 0.24, y: -0.48 + t3 * 0.92 });
    }

    /* Fill remaining with serifs / extra bar detail */
    var remaining = count - pts.length;
    for (var m = 0; m < remaining; m++) {
      var t4 = m / Math.max(remaining - 1, 1);
      /* Small serifs at ends of bar */
      if (m % 2 === 0) {
        pts.push({ x: -0.52, y: -0.48 + t4 * 0.10 });
      } else {
        pts.push({ x: 0.52, y: -0.48 + t4 * 0.10 });
      }
    }

    return pts;
  }

  /* ================================================
     PIE SLICE target points (quarter circle fill)
     ================================================ */
  function generatePieSlicePoints(count) {
    var pts = [];
    for (var i = 0; i < count; i++) {
      /* Random points inside a quarter circle (bottom-right) */
      var angle = (Math.PI / 2) * Math.random();  /* 0 to 90 deg */
      var r = Math.sqrt(Math.random()) * 0.85;    /* sqrt for uniform distribution */
      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
      });
    }
    return pts;
  }

  /* ================================================
     CANVAS ANIMATION
     ================================================ */
  function runCanvasAnimation() {
    var canvas = document.getElementById('piCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W = 300;
    var H = 300;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    var cx = W / 2;
    var cy = H / 2;
    var R  = 100;         /* circle radius */
    var N  = 60;          /* number of dots */
    var dotR = 4.5;       /* dot radius */

    /* Target positions for π symbol */
    var piTargets = generatePiPoints(N);
    var sliceTargets = generatePieSlicePoints(N);

    /* Create dots */
    var dots = [];
    for (var i = 0; i < N; i++) {
      var angle = (2 * Math.PI * i) / N;
      dots.push({
        /* Current position (start on circle) */
        x: Math.cos(angle) * R,
        y: Math.sin(angle) * R,
        /* Circle position */
        circX: Math.cos(angle) * R,
        circY: Math.sin(angle) * R,
        /* Pie position (quarter circle) */
        pieX: sliceTargets[i].x * R,
        pieY: sliceTargets[i].y * R,
        /* Pi symbol position */
        piX: piTargets[i].x * R * 1.1,
        piY: piTargets[i].y * R * 1.1,
        /* Visual */
        color: pickColor(i),
        size: dotR + Math.random() * 1.5,
        angle: angle,
        speed: 0.4 + Math.random() * 0.3, /* orbit speed (rad/s) */
        opacity: 0,
        glow: 0,
        /* For sparkle effect */
        sparklePhase: Math.random() * Math.PI * 2
      });
    }

    /* Floating particles (background decoration) */
    var sparkles = [];
    for (var s = 0; s < 20; s++) {
      sparkles.push({
        x: (Math.random() - 0.5) * W,
        y: (Math.random() - 0.5) * H,
        r: 1 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        opacity: 0
      });
    }

    /*
     * Timeline (milliseconds):
     *   0 – 1800    Phase 1: dots orbit in a circle
     *  1800 – 3200  Phase 2: dots fill pie slice
     *  3200 – 5000  Phase 3: dots form π
     *  5000 – 5500  Phase 4: glow + sparkles
     *  5500+        Phase 5: idle (gentle float)
     */

    var startTime = null;
    var heroContent = document.getElementById('heroContent');
    var scrollHint  = document.getElementById('scrollHint');
    var textRevealed = false;
    var hintRevealed = false;

    /* Skip for reduced motion */
    if (reducedMotion) {
      /* Draw static π */
      ctx.save();
      ctx.translate(cx, cy);
      dots.forEach(function (d, i) {
        d.x = d.piX;
        d.y = d.piY;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
      });
      ctx.restore();
      if (heroContent) heroContent.classList.add('visible');
      if (scrollHint) scrollHint.classList.add('visible');
      return;
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(cx, cy);

      /* ---------- Update dot positions ---------- */
      dots.forEach(function (d, i) {

        /* Phase 1: orbit (0 – 1800ms) */
        if (elapsed < 1800) {
          var fadeIn = Math.min(elapsed / 600, 1);
          d.opacity = fadeIn;
          d.angle += d.speed * 0.016;
          d.x = Math.cos(d.angle) * R;
          d.y = Math.sin(d.angle) * R;
          d.glow = 0;
        }

        /* Phase 2: move to pie slice (1800 – 3200ms) */
        else if (elapsed < 3200) {
          d.opacity = 1;
          var t = easeInOutCubic(Math.min((elapsed - 1800) / 1200, 1));
          d.x = lerp(d.circX, d.pieX, t);
          d.y = lerp(d.circY, d.pieY, t);
          /* Update circle position for next lerp */
          if (t >= 1) {
            d.circX = d.pieX;
            d.circY = d.pieY;
          }
          d.glow = 0;
        }

        /* Phase 3: move to π shape (3200 – 5000ms) */
        else if (elapsed < 5000) {
          d.opacity = 1;
          var t2 = easeInOutCubic(Math.min((elapsed - 3200) / 1500, 1));
          d.x = lerp(d.pieX, d.piX, t2);
          d.y = lerp(d.pieY, d.piY, t2);
          d.glow = t2 * 12;
        }

        /* Phase 4+: idle with gentle float */
        else {
          d.opacity = 1;
          var floatT = (elapsed - 5000) / 1000;
          d.x = d.piX + Math.sin(floatT * 0.8 + d.sparklePhase) * 1.5;
          d.y = d.piY + Math.cos(floatT * 0.6 + d.sparklePhase) * 1.5;
          d.glow = 12 + Math.sin(floatT * 2 + d.sparklePhase) * 4;
        }

        /* ---------- Draw dot ---------- */
        if (d.glow > 0) {
          ctx.shadowColor = d.color;
          ctx.shadowBlur = d.glow;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = d.opacity;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
      });

      /* ---------- Background sparkles (phase 4+) ---------- */
      if (elapsed > 4800) {
        var sparkleAlpha = Math.min((elapsed - 4800) / 1000, 0.6);
        sparkles.forEach(function (sp) {
          sp.angle += sp.speed * 0.01;
          sp.x += Math.sin(sp.angle) * 0.3;
          sp.y += Math.cos(sp.angle) * 0.3;
          sp.opacity = sparkleAlpha * (0.3 + 0.3 * Math.sin(elapsed * 0.002 + sp.angle));

          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.globalAlpha = sp.opacity;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
          ctx.fillStyle = sp.color;
          ctx.fill();
        });
      }

      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      /* ---------- Reveal text ---------- */
      if (!textRevealed && elapsed > 5200) {
        textRevealed = true;
        if (heroContent) heroContent.classList.add('visible');
      }

      if (!hintRevealed && elapsed > 6200) {
        hintRevealed = true;
        if (scrollHint) scrollHint.classList.add('visible');
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('load', runCanvasAnimation);

  /* ================================================
     INTERSECTION OBSERVER — Section & card reveals
     ================================================ */
  if (!reducedMotion) {
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        sectionObs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    var cardObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var cards = entry.target.querySelectorAll('.achievement-card');
        cards.forEach(function (card, i) {
          setTimeout(function () { card.classList.add('visible'); }, i * 150);
        });
        cardObs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.section.reveal').forEach(function (s) { sectionObs.observe(s); });
      var grid = document.getElementById('achievementsGrid');
      if (grid) cardObs.observe(grid);
    });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.section.reveal').forEach(function (s) { s.classList.add('visible'); });
      document.querySelectorAll('.achievement-card').forEach(function (c) { c.classList.add('visible'); });
    });
  }

  /* ================================================
     MODAL
     ================================================ */
  var modal      = document.getElementById('modal');
  var ctaButton  = document.getElementById('ctaButton');
  var modalClose = document.getElementById('modalClose');
  var modalOverlay = document.getElementById('modalOverlay');

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    ctaButton.focus();
  }

  if (ctaButton)    ctaButton.addEventListener('click', openModal);
  if (modalClose)   modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  /* ================================================
     FORM — mailto placeholder
     ================================================ */
  var form = document.getElementById('assignmentForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {
        name:        document.getElementById('formName').value,
        email:       document.getElementById('formEmail').value,
        description: document.getElementById('formDesc').value,
        deadline:    document.getElementById('formDeadline').value
      };

      var subject = encodeURIComponent('Optional assignment — Pi-Pie project');
      var body    = encodeURIComponent(
        'Name: '         + data.name        + '\n' +
        'Email: '        + data.email       + '\n' +
        'Description:\n' + data.description + '\n' +
        'Deadline: '     + data.deadline
      );

      /* TODO: replace with real teacher email */
      window.location.href = 'mailto:teacher@example.com?subject=' + subject + '&body=' + body;

      form.reset();
      closeModal();
    });
  }

  /* Minimum deadline date = today */
  var dl = document.getElementById('formDeadline');
  if (dl) dl.setAttribute('min', new Date().toISOString().split('T')[0]);

})();
