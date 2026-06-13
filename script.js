// === TYPING EFFECT ===
const words = [
  'Développeur Full-Stack',
  'Photographe & Vidéaste',
  'Auteur scientifique (LaTeX)',
  'Étudiant en Génie Logiciel'
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed');

function typeEffect() {
  const current = words[wordIndex];
  if (!isDeleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) setTimeout(() => isDeleting = true, 1500);
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 40 : 60);
}
document.addEventListener('DOMContentLoaded', () => typeEffect());

// === MOBILE MENU ===
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// === NAVBAR SCROLL ===
const navbar = document.querySelector('.navbar');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 150;
    if (window.scrollY >= top) current = s.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

// === COUNTER ANIMATION ===
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.getAttribute('data-target');
    if (target === 0) return;
    let current = 0;
    const inc = Math.ceil(target / 40);
    const update = () => {
      current += inc;
      if (current >= target) { el.textContent = target; return; }
      el.textContent = current;
      requestAnimationFrame(update);
    };
    update();
  });
}

// === SKILL BAR ANIMATION ===
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(el => {
    const progress = el.getAttribute('data-progress');
    el.style.width = progress + '%';
  });
}

// === SCROLL REVEAL ===
function setupReveal() {
  const els = document.querySelectorAll(
    '.about-card, .stat, .skill-category, .timeline-item, .project-card, .contact-item, .contact-form'
  );
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
}

// Trigger animations when section enters viewport
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkills();
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  const skillsSection = document.querySelector('#skills');
  if (skillsSection) skillObserver.observe(skillsSection);
  const aboutSection = document.querySelector('#about .about-stats');
  if (aboutSection) counterObserver.observe(aboutSection);
});

// === PROJECT FILTERING ===
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active')?.classList.remove('active');
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.remove('hidden');
      if (filter !== 'all' && card.getAttribute('data-category') !== filter) {
        card.classList.add('hidden');
      }
    });
  });
});

// === CONTACT FORM ===
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const status = document.getElementById('formStatus');
  const data = new FormData(this);
  const plain = Object.fromEntries(data);

  btn.disabled = true;
  btn.innerHTML = 'Envoi... <i class="fas fa-spinner fa-spin"></i>';
  status.className = 'form-status';
  status.textContent = '';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plain)
    });
    const json = await res.json();
    if (json.success) {
      status.className = 'form-status success';
      status.textContent = 'Message envoyé avec succès !';
      this.reset();
    } else {
      status.className = 'form-status error';
      status.textContent = 'Erreur : ' + (json.message || 'réessaie');
    }
  } catch {
    status.className = 'form-status error';
    status.innerHTML = 'Échec de l\'envoi. <a href="mailto:yahyaennayri370@gmail.com" style="color:#00d4ff;">Écris-moi directement</a>';
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-envelope"></i> Envoyer';
});
