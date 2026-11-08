(() => {
  const S = [...document.querySelectorAll('.slide')], pr = document.getElementById('pr'), cnt = document.getElementById('cnt');
  let i = 0, tid, auto;
  function typeIt() {
    const el = document.getElementById('typed'), t = el.dataset.t; let k = 0;
    clearInterval(tid); el.textContent = '';
    tid = setInterval(() => { el.textContent = t.slice(0, ++k); if (k >= t.length) clearInterval(tid); }, 38);
  }
  function go(n) {
    if (n < 0 || n >= S.length || n === i) return;
    const o = S[i]; o.classList.remove('active'); o.classList.add('out');
    setTimeout(() => o.classList.remove('out'), 700);
    i = n; S[i].classList.add('active');
    pr.style.width = ((i + 1) / S.length * 100) + '%';
    cnt.textContent = (i + 1) + ' / ' + S.length;
    if (i === 0) typeIt();
  }
  const next = () => go(i + 1), prev = () => go(i - 1);
  document.getElementById('nx').onclick = next;
  document.getElementById('pv').onclick = prev;
  addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) prev();
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(S.length - 1);
    else if (e.key.toLowerCase() === 'p') { auto ? (clearInterval(auto), auto = null) : auto = setInterval(() => i < S.length - 1 ? next() : go(0), 7000); }
  });
  let sx = 0;
  addEventListener('touchstart', e => sx = e.touches[0].clientX);
  addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) d < 0 ? next() : prev(); });
  let wl = 0;
  addEventListener('wheel', e => { if (Date.now() - wl < 900) return; wl = Date.now(); e.deltaY > 0 ? next() : prev(); });
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(700px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) scale(1.03)`;
    });
    c.addEventListener('pointerleave', () => c.style.transform = '');
  });
  const cv = document.getElementById('bg'), x = cv.getContext('2d'), m = { x: -999, y: -999 };
  let w, h, P = [];
  function rs() {
    w = cv.width = innerWidth; h = cv.height = innerHeight;
    P = Array.from({ length: Math.min(90, (w * h / 16000) | 0) }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6, r: Math.random() * 2 + 1 }));
  }
  addEventListener('resize', rs); rs();
  addEventListener('pointermove', e => { m.x = e.clientX; m.y = e.clientY; });
  (function d() {
    x.clearRect(0, 0, w, h);
    for (const p of P) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - m.x, dy = p.y - m.y, ds = Math.hypot(dx, dy);
      if (ds < 120 && ds > 0) { p.x += dx / ds * 2; p.y += dy / ds * 2; }
      x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill();
    }
    for (let a = 0; a < P.length; a++) for (let b = a + 1; b < P.length; b++) {
      const q = Math.hypot(P[a].x - P[b].x, P[a].y - P[b].y);
      if (q < 110) { x.strokeStyle = 'rgba(255,255,255,' + (.25 - q / 110 * .25) + ')'; x.beginPath(); x.moveTo(P[a].x, P[a].y); x.lineTo(P[b].x, P[b].y); x.stroke(); }
    }
    requestAnimationFrame(d);
  })();
  typeIt();
})();
