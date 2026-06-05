/* ============================================
   LEAN APP — main.js
   Features:
   - Theme toggle (dark / light)
   - Currency toggle (USD / INR)
   - Contact form validation
   - Navbar scroll effect
   - Mobile nav toggle
   - Scroll fade-in animations
============================================ */

(function () {
  'use strict';

  /* ============================================
     1. THEME TOGGLE
  ============================================ */
  var html      = document.documentElement;
  var switcher  = document.getElementById('themeSwitcher');
  var THEME_KEY = 'leanapp_theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }
  function setTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
  }

  // Apply saved theme on load
  setTheme(getTheme());

  if (switcher) {
    switcher.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ============================================
     2. NAVBAR SCROLL
  ============================================ */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================
     3. MOBILE NAV TOGGLE
  ============================================ */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ============================================
     4. CURRENCY TOGGLE
  ============================================ */
  window.setCurrency = function (cur) {
    var usdEls = document.querySelectorAll('.price-usd');
    var inrEls = document.querySelectorAll('.price-inr');
    var btnUSD = document.getElementById('btnUSD');
    var btnINR = document.getElementById('btnINR');

    if (cur === 'inr') {
      usdEls.forEach(function (el) { el.classList.add('hidden'); });
      inrEls.forEach(function (el) { el.classList.remove('hidden'); });
      if (btnUSD) btnUSD.classList.remove('active');
      if (btnINR) btnINR.classList.add('active');
    } else {
      inrEls.forEach(function (el) { el.classList.add('hidden'); });
      usdEls.forEach(function (el) { el.classList.remove('hidden'); });
      if (btnINR) btnINR.classList.remove('active');
      if (btnUSD) btnUSD.classList.add('active');
    }
  };

  /* ============================================
     5. CONTACT FORM VALIDATION
  ============================================ */
  var form       = document.getElementById('contactForm');
  var submitBtn  = document.getElementById('submitBtn');
  var formSuccess = document.getElementById('formSuccess');

  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function setError(fieldId, errId, msg) {
    var field = document.getElementById(fieldId);
    var err   = document.getElementById(errId);
    if (field) field.classList.toggle('error', !!msg);
    if (err)   err.textContent = msg || '';
  }

  function clearError(fieldId, errId) {
    setError(fieldId, errId, '');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    var valid = true;

    // Name
    var name = getVal('fname');
    if (!name) {
      setError('fname', 'err-name', 'Name is required.');
      valid = false;
    } else if (name.length < 2) {
      setError('fname', 'err-name', 'Name must be at least 2 characters.');
      valid = false;
    } else {
      clearError('fname', 'err-name');
    }

    // Email
    var email = getVal('femail');
    if (!email) {
      setError('femail', 'err-email', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('femail', 'err-email', 'Enter a valid email address.');
      valid = false;
    } else {
      clearError('femail', 'err-email');
    }

    // Subject
    var subject = getVal('fsubject');
    if (!subject) {
      setError('fsubject', 'err-subject', 'Please select a topic.');
      valid = false;
    } else {
      clearError('fsubject', 'err-subject');
    }

    // Message
    var message = getVal('fmessage');
    if (!message) {
      setError('fmessage', 'err-message', 'Message is required.');
      valid = false;
    } else if (message.length < 10) {
      setError('fmessage', 'err-message', 'Message must be at least 10 characters.');
      valid = false;
    } else {
      clearError('fmessage', 'err-message');
    }

    return valid;
  }

  // Clear error on input
  ['fname','femail','fsubject','fmessage'].forEach(function (id) {
    var errId = 'err-' + id.replace('f','');
    var field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) {
          field.classList.remove('error');
          var err = document.getElementById(errId);
          if (err) err.textContent = '';
        }
      });
      // special case: name -> err-name not err-ame
    }
  });
  // Fix id mapping
  var fieldErrMap = { fname: 'err-name', femail: 'err-email', fsubject: 'err-subject', fmessage: 'err-message' };
  Object.keys(fieldErrMap).forEach(function (fid) {
    var field = document.getElementById(fid);
    if (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) {
          field.classList.remove('error');
          var err = document.getElementById(fieldErrMap[fid]);
          if (err) err.textContent = '';
        }
      });
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      // Success state
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.reset();
        submitBtn.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      }, 800);
    });
  }

  /* ============================================
     6. NEWSLETTER FORM
  ============================================ */
  var nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = nlForm.querySelector('button');
      var inp = document.getElementById('nlEmail');
      if (!inp || !inp.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
        inp.style.borderColor = '#ef4444';
        return;
      }
      btn.textContent = 'Subscribed ✓';
      btn.style.background = 'rgba(255,255,255,0.3)';
      btn.disabled = true;
      inp.disabled = true;
    });
  }

  /* ============================================
     7. SCROLL FADE-IN
  ============================================ */
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

})();