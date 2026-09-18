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
