/* ========================================
   LEAN APP — main.js
   Handles navbar scroll, mobile menu,
   scroll-triggered animations
======================================== */

(function () {
  'use strict';

  /* ---- Navbar: add scrolled class ---- */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Intersection Observer: fade-in ---- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Contact form: prevent default / show success ---- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      btn.textContent = 'Message sent! We\'ll be in touch soon.';
      btn.style.background = '#0f6e50';
      btn.disabled = true;
    });
  }

  /* ---- Newsletter form ---- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      btn.textContent = 'Subscribed ✓';
      btn.style.background = 'rgba(255,255,255,0.3)';
      btn.disabled = true;
    });
  }

})();