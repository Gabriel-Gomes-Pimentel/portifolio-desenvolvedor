/* Scroll Reveal — Intersection Observer */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
})();

/* Hero word stagger + eyebrow on load */
(function () {
  const heroName = document.querySelector('.hero-name');
  const eyebrow  = document.querySelector('.hero-eyebrow');
  if (!heroName) return;

  const words = heroName.querySelectorAll('.word');
  words.forEach((w, i) => {
    w.style.transitionDelay = (200 + i * 110) + 'ms';
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (eyebrow) eyebrow.classList.add('is-in');
      heroName.classList.add('is-in');
    });
  });
})();

/* Photo clip-path reveal */
(function () {
  const wrap = document.querySelector('.about-photo-wrap');
  if (!wrap) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  io.observe(wrap);
})();

/* Hero scroll-linked fade & scale */
(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const targets = [
    hero.querySelector('.hero-eyebrow'),
    hero.querySelector('.hero-name'),
    hero.querySelector('.hero-tagline'),
    hero.querySelector('.hero-cta-row'),
    hero.querySelector('.hero-socials')
  ].filter(Boolean);
  let ticking = false;
  function update() {
    const y  = window.scrollY;
    const h  = window.innerHeight;
    const p  = Math.min(1, Math.max(0, y / (h * 0.7)));
    const op = 1 - p;
    const tr = 'translateY(' + (p * -40) + 'px) scale(' + (1 - p * 0.04) + ')';
    targets.forEach((el) => {
      el.style.opacity = op;
      el.style.transform = tr;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

/* Tech cards — magnetic hover (3D tilt) */
(function () {
  const cards = document.querySelectorAll('.tech-card');
  const max   = 8;
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        'perspective(600px) rotateX(' + (-y * max) + 'deg) rotateY(' + (x * max) + 'deg) translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* Project card — cursor spotlight */
(function () {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top)  + 'px');
    });
  });
})();

/* Timeline year — count-up when in view */
(function () {
  const years = document.querySelectorAll('.timeline-year');
  years.forEach((el) => {
    const text = el.textContent.trim();
    const n = parseInt(text, 10);
    if (Number.isFinite(n) && n > 1900) {
      el.setAttribute('data-target', n);
      el.textContent = (n - 6);
    }
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (!Number.isFinite(target)) { io.unobserve(el); return; }
      let current = parseInt(el.textContent, 10) || (target - 6);
      const tick = () => {
        current += 1;
        el.textContent = current;
        if (current < target) setTimeout(tick, 90);
      };
      tick();
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  years.forEach((el) => {
    if (el.getAttribute('data-target')) io.observe(el);
  });
})();

/* Contact form — async submit via Formspree */
(function () {
  const form     = document.getElementById('contact-form');
  const feedback = form && form.querySelector('.contact-form__feedback');
  const btn      = form && form.querySelector('.contact-form__btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.querySelector('.cf-btn-label').textContent = 'Enviando…';
    feedback.className = 'contact-form__feedback';
    feedback.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        feedback.classList.add('success');
        feedback.textContent = 'Mensagem enviada! Responderei em breve.';
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      feedback.classList.add('error');
      feedback.textContent = 'Algo deu errado. Tente novamente ou me mande um email.';
    } finally {
      btn.disabled = false;
      btn.querySelector('.cf-btn-label').textContent = 'Enviar mensagem';
    }
  });
})();

/* Skill Bars — animate width when in view */
(function () {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!('IntersectionObserver' in window)) {
    bars.forEach(b => { b.style.width = b.getAttribute('data-width') + '%'; });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const w = entry.target.getAttribute('data-width');
        entry.target.style.width = w + '%';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => io.observe(bar));
})();

/* Mobile nav toggle */
(function () {
  const nav    = document.querySelector('.global-nav');
  const toggle = nav && nav.querySelector('.global-nav__toggle');
  const links  = nav && nav.querySelectorAll('.global-nav__links a');
  if (!nav || !toggle) return;
  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  links.forEach(a => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();

/* Active nav highlight on scroll */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.global-nav__links a');
  function onScroll() {
    let current = '';
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      if (y >= sec.offsetTop) current = sec.id;
    });
    links.forEach(link => {
      const active = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', active);
      link.style.opacity = active ? '1' : '0.8';
      link.style.color = active ? '#2997ff' : '';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* Barra de progresso da rolagem */
(function () {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  let ticking = false;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--scroll', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* Personagem do hero: os olhos acompanham o cursor */
(function () {
  const buddy = document.querySelector('.buddy');
  if (!buddy || !window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false, mx = 0, my = 0;
  function update() {
    const r = buddy.getBoundingClientRect();
    const dx = mx - (r.left + r.width / 2);
    const dy = my - (r.top + r.height * 0.44);
    const dist = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, dist / 260) * 3.2;
    buddy.style.setProperty('--px', (dx / dist * reach).toFixed(2) + 'px');
    buddy.style.setProperty('--py', (dy / dist * reach).toFixed(2) + 'px');
    ticking = false;
  }
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
})();
