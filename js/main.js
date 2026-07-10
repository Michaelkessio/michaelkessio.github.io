/* ── Typewriter ── */
const words = ['actually work.','stay secure.','scale cleanly.','make an impact.','defend networks.'];
let wi = 0, ci = 0, deleting = false, paused = false;
const twEl = document.getElementById('typewriter-text');
function tick() {
  if (!twEl || paused) return;
  const w = words[wi];
  if (!deleting) {
    twEl.textContent = w.slice(0, ++ci);
    if (ci === w.length) { paused = true; setTimeout(() => { paused = false; deleting = true; tick(); }, 1800); return; }
  } else {
    twEl.textContent = w.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(tick, deleting ? 45 : 110);
}
tick();

/* ── Particle canvas ── */
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, pts = [], mx = -999, my = -999;
  function initCanvas() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    pts = Array.from({ length: 65 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.2 + .4,
      hue: Math.random() < .5 ? 220 : 270
    }));
  }
  initCanvas();
  window.addEventListener('resize', initCanvas);
  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });
  function drawCanvas() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      const dx = mx - p.x, dy = my - p.y, dist = Math.hypot(dx, dy);
      if (dist < 130) { p.x -= dx * .011; p.y -= dy * .011; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},80%,65%,.5)`; ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 95) {
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `hsla(240,70%,65%,${.13 * (1 - d / 95)})`; ctx.lineWidth = .5; ctx.stroke();
      }
    }
    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();
}

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.07 }
);
document.querySelectorAll('.rv, .rv1, .rv2').forEach(el => revealObs.observe(el));

/* ── Skill bar animation ── */
const barSection = document.getElementById('skill-bars');
if (barSection) {
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.bar-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  barObs.observe(barSection);
}

/* ── Mobile nav ── */
const hamburger = document.querySelector('.nav-hamburger');
const navMenu = document.querySelector('.nav-links');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));
}

/* ── Active nav on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeObs.observe(s));

/* ── Auto year ── */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();
