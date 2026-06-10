/* ============================================
   LEAN APP - Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============ PRELOADER ============
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1800);
  });

  // ============ CUSTOM CURSOR ============
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 6 + 'px';
    cursor.style.top = mouseY - 6 + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX - 18) * 0.12;
    followerY += (mouseY - followerY - 18) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .feat-card, .price-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      follower.style.transform = 'scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      follower.style.transform = 'scale(1)';
    });
  });

  // ============ CANVAS ANIMATED BG ============
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    handleHeroVisual();
  });

  const particles = [];
  const NUM_PARTICLES = 80;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.green = Math.random() > 0.7;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.green
        ? `rgba(0,196,106,${this.opacity})`
        : `rgba(255,255,255,${this.opacity * 0.3})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.018)';
    ctx.lineWidth = 1;
    const spacing = 80;
    for (let x = 0; x < canvas.width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          ctx.strokeStyle = `rgba(0,196,106,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateBg);
  }
  animateBg();

  // ============ HERO VISUAL — MOBILE / DESKTOP ============
  const heroVisual  = document.querySelector('.hero-visual');
  const phoneMockup = document.querySelector('.hero-phone-wrap');
  const mobileImg   = document.querySelector('.hero-mobile-img');

  function handleHeroVisual() {
    const isMobile = window.innerWidth <= 900;

    if (!heroVisual) return;

    if (isMobile) {
      heroVisual.style.animation = 'none';
      heroVisual.style.opacity   = '1';
      heroVisual.style.transform = 'none';

      if (phoneMockup) phoneMockup.style.display = 'none';
      if (mobileImg)   mobileImg.style.display   = 'block';

      if (mobileImg) {
        mobileImg.style.opacity    = '0';
        mobileImg.style.transition = 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s';
        mobileImg.style.transform  = 'translateY(20px)';
        setTimeout(() => {
          mobileImg.style.opacity   = '1';
          mobileImg.style.transform = 'translateY(0)';
        }, 600);
      }

    } else {
      heroVisual.style.animation = '';
      heroVisual.style.opacity   = '';
      heroVisual.style.transform = '';

      if (phoneMockup) phoneMockup.style.display = '';
      if (mobileImg)   mobileImg.style.display   = 'none';
    }
  }

  handleHeroVisual();

  // ============ NAVBAR SCROLL ============
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // ============ HAMBURGER ============
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    burger.classList.toggle('open');
  });

  // ============ SCROLL REVEAL ============
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .feat-card, .price-card, .feature-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.feature-list .feature-item').forEach((el, i) => {
    el.dataset.delay = i * 80;
  });
  document.querySelectorAll('.features-grid .feat-card').forEach((el, i) => {
    el.dataset.delay = i * 100;
  });
  document.querySelectorAll('.pricing-grid .price-card').forEach((el, i) => {
    el.dataset.delay = i * 80;
  });

  // ============ RSV INFINITE SCROLL ============
  const track = document.querySelector('.rsv-screens-track');
  if (track) {
    const items = track.innerHTML;
    track.innerHTML += items;
  }

  // ============ CONTACT FORM ============
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const msg = form.querySelector('.form-msg');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showMsg(msg, 'error', 'Please fill in all required fields.');
        btn.disabled = false; btn.textContent = 'Send Your Message';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMsg(msg, 'error', 'Please enter a valid email address.');
        btn.disabled = false; btn.textContent = 'Send Your Message';
        return;
      }

      await new Promise(r => setTimeout(r, 1500));
      showMsg(msg, 'success', "✓ Message sent! We'll get back to you soon.");
      form.reset();
      btn.disabled = false; btn.textContent = 'Send Your Message';
    });
  }

  function showMsg(el, type, text) {
    el.className = 'form-msg ' + type;
    el.textContent = text;
    setTimeout(() => { el.className = 'form-msg'; el.textContent = ''; }, 5000);
  }

  // ============ NEWSLETTER FORM ============
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('.newsletter-input');
      if (input.value.trim()) {
        input.value = '';
        input.placeholder = '✓ Subscribed! Thank you.';
        setTimeout(() => input.placeholder = 'Your email address', 3000);
      }
    });
  }

  // ============ SMOOTH NAV CLOSE ON CLICK ============
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

});