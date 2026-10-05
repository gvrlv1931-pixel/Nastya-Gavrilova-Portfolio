'use strict';

/* ── Scroll to top on load ───────────────────────────────────── */
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ── Sticky nav ──────────────────────────────────────────────── */
const navHeader = document.querySelector('.nav-header');
window.addEventListener('scroll', () => {
  navHeader.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Mobile nav toggle ───────────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  navLinks.classList.toggle('open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Hero role typewriter ────────────────────────────────────── */
const roles = [
  'Social Entrepreneur',
  'Environmental Systems Innovator',
  'Circular Economy Builder',
  'Problem Solver',
  'People and Planet Professional',
];

const roleCycle = document.getElementById('roleCycle');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    roleCycle.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) { deleting = true; setTimeout(typeRole, 1800); return; }
    setTimeout(typeRole, 60);
  } else {
    roleCycle.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(typeRole, 300); return; }
    setTimeout(typeRole, 35);
  }
}
setTimeout(typeRole, 800);

/* ── Shared collapsible toggle helper ────────────────────────── */
function bindToggle(btn, target) {
  btn.addEventListener('click', () => {
    const collapsed = target.classList.toggle('collapsed');
    btn.setAttribute('aria-expanded', String(!collapsed));
  });
}

/* ── Experience / Education / In the Room card toggles ────────── */
document.querySelectorAll('.card-toggle-btn').forEach(btn => {
  const body = btn.closest('.timeline-card, .itr-card').querySelector('.collapsible-body');
  if (body) bindToggle(btn, body);
});

/* ── Project expand/collapse ─────────────────────────────────── */
document.querySelectorAll('.project-expand-btn').forEach(btn => {
  const details = btn.nextElementSibling;
  if (details) bindToggle(btn, details);
});

/* ── Generic next-sibling collapse (modules, year blocks) ───── */
document.querySelectorAll('.modules-toggle, .year-toggle').forEach(btn => {
  const target = btn.nextElementSibling;
  if (!target) return;
  btn.addEventListener('click', () => {
    const collapsed = target.classList.toggle('collapsed');
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.classList.toggle('open', !collapsed);
  });
});

/* ── Show/Hide toggles (awards, books) ──────────────────────── */
function bindShowHide(toggleSel, targetId) {
  const btn = document.querySelector(toggleSel);
  const el  = document.getElementById(targetId);
  if (!btn || !el) return;
  btn.addEventListener('click', () => {
    const collapsed = el.classList.toggle('collapsed');
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.textContent = collapsed ? 'Show' : 'Hide';
  });
}
bindShowHide('.awards-toggle', 'awardsList');
bindShowHide('.books-toggle',  'booksContent');

/* ── Book shelf marquee (seamless duplicate) ─────────────────── */
const booksShelf = document.getElementById('booksShelf');
if (booksShelf) booksShelf.innerHTML += booksShelf.innerHTML;

/* ── Stat counters ───────────────────────────────────────────── */
function animateCounter(el, target) {
  const suffix = el.dataset.suffix || '';
  const start  = performance.now();
  const dur    = 1400;
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const statsRow = document.querySelector('.stats-row');
if (statsRow) {
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    statsRow.classList.add('visible');
    statsRow.querySelectorAll('.stat-number[data-target]').forEach((el, i) => {
      setTimeout(() => animateCounter(el, +el.dataset.target), i * 150 + 100);
    });
  }, { threshold: 0.5 }).observe(statsRow);
}

/* ── Scroll-reveal ───────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-card, .project-card, .skill-group, .cert-card, .itr-card, .about-facts, .about-body').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 4) * 55 + 'ms';
  revealObs.observe(el);
});

/* ── Projects "show more" ────────────────────────────────────── */
const extraCards = document.querySelectorAll('.project-card[data-featured="false"]');
const toggleWrap = document.getElementById('projectsToggleWrap');
const toggleBtn  = document.getElementById('projectsToggle');

if (extraCards.length > 0 && toggleWrap && toggleBtn) {
  toggleWrap.style.display = 'block';
  let shown = false;
  toggleBtn.addEventListener('click', () => {
    shown = !shown;
    extraCards.forEach(card => {
      card.classList.toggle('visible', shown);
      if (shown) setTimeout(() => revealObs.observe(card), 10);
    });
    toggleBtn.textContent = shown ? 'Show fewer projects' : 'Show more projects';
  });
}

/* ── Footer year ─────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Contact form ────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

if (contactForm && formStatus) {
  const rules = [
    { id: 'name',    msg: 'Please enter your name.',            test: v => v.trim().length >= 2 },
    { id: 'email',   msg: 'Please enter a valid email.',        test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'message', msg: 'Message must be at least 10 chars.', test: v => v.trim().length >= 10 },
  ];

  function validateForm() {
    let valid = true;
    rules.forEach(({ id, msg, test }) => {
      const field = document.getElementById(id);
      const error = field.nextElementSibling;
      const ok = test(field.value);
      field.classList.toggle('invalid', !ok);
      if (error) error.textContent = ok ? '' : msg;
      if (!ok) valid = false;
    });
    return valid;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const btn = contactForm.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '2b1085ef-46c2-4ffc-9797-2885e2bf7b3f',
          name:    document.getElementById('name').value,
          email:   document.getElementById('email').value,
          message: document.getElementById('message').value,
        }),
      });
      if (!res.ok) throw new Error();
      formStatus.textContent = "Message sent! I'll get back to you soon.";
      formStatus.className = 'form-status success';
      contactForm.reset();
    } catch {
      formStatus.textContent = 'Something went wrong. Please try again or reach out on LinkedIn.';
      formStatus.className = 'form-status error';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });

  contactForm.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('invalid');
      if (el.nextElementSibling) el.nextElementSibling.textContent = '';
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    });
  });
}

/* ── Active nav link on scroll ───────────────────────────────── */
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});
