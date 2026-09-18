// Menu claro sobre seções claras e entrada sóbria dos blocos.
const nav = document.querySelector('[data-nav]');
const darks = [...document.querySelectorAll('.hero, .band, .cta, .footer')];

function updateNav() {
  const y = 44; // altura do centro do menu
  const onDark = darks.some((el) => {
    const r = el.getBoundingClientRect();
    return r.top <= y && r.bottom >= y;
  });
  nav.classList.toggle('is-light', !onDark);
}
updateNav();
addEventListener('scroll', updateNav, { passive: true });
addEventListener('resize', updateNav);

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 60}ms`;
  io.observe(el);
});

// Raízes: crescem na entrada, com o scroll e com o mouse; leve parallax.
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const roots = [
  { el: document.querySelector('.hero__roots'), box: document.querySelector('.hero'), hero: true },
  { el: document.querySelector('.footer__roots'), box: document.querySelector('.footer'), hero: false },
].filter((r) => r.el);

if (!calm && roots.length) {
  const state = { mx: 0, my: 0, intro: 0 };
  const t0 = performance.now();
  roots.forEach((r) => { r.grow = 0; r.px = 0; r.py = 0; r.el.style.setProperty('--grow', 0); });

  addEventListener('pointermove', (e) => {
    state.mx = e.clientX / innerWidth - 0.5;
    state.my = e.clientY / innerHeight;
  }, { passive: true });

  const ease = (t) => 1 - Math.pow(1 - t, 3);
  function frame(now) {
    state.intro = ease(Math.min(1, (now - t0) / 2200));
    for (const r of roots) {
      const b = r.box.getBoundingClientRect();
      let target;
      if (r.hero) {
        const scrolled = Math.min(1, Math.max(0, -b.top / (b.height * 0.6)));
        target = state.intro * 62 + scrolled * 40 + state.my * 22; // entrada + scroll + mouse
      } else {
        const seen = Math.min(1, Math.max(0, (innerHeight - b.top) / b.height));
        target = seen * 105 + state.my * 10;
      }
      target = Math.min(118, target);
      r.grow += (target - r.grow) * 0.06;
      r.px += (state.mx * -28 - r.px) * 0.06;
      r.py += ((state.my - 0.5) * -14 - r.py) * 0.06;
      r.el.style.setProperty('--grow', r.grow.toFixed(2));
      r.el.style.setProperty('--px', r.px.toFixed(1) + 'px');
      r.el.style.setProperty('--py', r.py.toFixed(1) + 'px');
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
