/* ==========================================================================
   Kaizen Health & Wellness  |  script.js
   Mobile nav, smooth scrolling, active links, booking modal, service
   selection, toast messages and scroll-reveal animations.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var HEADER_OFFSET = 90;
  var nav = $('.nav');
  var toggle = $('.menu-toggle');
  var modal = $('#bookingModal');
  var form = $('#bookingForm');
  var toast = $('#toast');
  var toastDefault = toast ? toast.textContent : '';
  var toastTimer = null;
  var previousFocus = null;

  /* ---------- Toast ---------- */
  function showToast(message, ms) {
    if (!toast) return;
    toast.textContent = message || toastDefault;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.textContent = toastDefault; }, 400);
    }, ms || 5200);
  }

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  /* ---------- Smooth scrolling ---------- */
  function scrollToTarget(selector) {
    var el = $(selector);
    if (!el) return;
    var top = selector === '#top' ? 0 : el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET + 1;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  $$('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.length < 2) return; // ignore bare "#" (social placeholders)
    a.addEventListener('click', function (e) {
      if (!$(href)) return;
      e.preventDefault();
      closeMenu();
      if (a.classList.contains('skip-link')) $(href).focus();
      scrollToTarget(href);
    });
  });
  $$('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () { scrollToTarget(b.getAttribute('data-scroll')); });
  });
  var learnMore = $('#learnMore');
  if (learnMore) learnMore.addEventListener('click', function () { scrollToTarget('#about'); });
  var insightBtn = $('#insightBtn');
  if (insightBtn) insightBtn.addEventListener('click', function () { scrollToTarget('#insights'); });

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = $$('.nav a[href^="#"]');
  var navTargets = navLinks.map(function (l) { return $(l.getAttribute('href')); });
  function updateActive() {
    var pos = window.pageYOffset + HEADER_OFFSET + 80, current = 0;
    navTargets.forEach(function (t, i) { if (t && (t.id === 'top' ? 0 : t.offsetTop) <= pos) current = i; });
    if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 4) current = navLinks.length - 1;
    navLinks.forEach(function (l, i) { l.classList.toggle('active', i === current); });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();

  /* ---------- Booking modal ---------- */
  var serviceAliases = { 'Wellness Consultation': 'General Wellness Consultation' };

  function selectService(name) {
    if (!form || !name) return;
    var select = form.elements.service;
    if (!select) return;
    name = serviceAliases[name] || name;
    var found = false;
    $$('option', select).forEach(function (o) { if (o.value === name || o.textContent === name) { select.value = o.value; found = true; } });
    if (!found) {
      var opt = document.createElement('option');
      opt.textContent = name;
      select.appendChild(opt);
      select.value = name;
    }
  }

  function openBooking(service) {
    if (!modal) return;
    if (!modal.classList.contains('show')) {
      var active = document.activeElement;
      previousFocus = active && active.closest && active.closest('#kaizen-faq-panel') ? $('#kaizen-faq-launcher') : active;
    }
    selectService(service);
    closeMenu();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var nameInput = form && form.elements.name;
    if (nameInput) setTimeout(function () { nameInput.focus(); }, 120);
  }
  function closeBooking() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  $$('.open-booking').forEach(function (b) {
    b.addEventListener('click', function () { openBooking(); });
  });
  $$('.service-card').forEach(function (c) {
    c.addEventListener('click', function () { openBooking(c.getAttribute('data-service')); });
  });
  var closeBtn = $('.modal-close', modal);
  if (closeBtn) closeBtn.addEventListener('click', closeBooking);
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeBooking(); });
  document.addEventListener('keydown', function (e) {
    if (modal && modal.classList.contains('show')) {
      if (e.key === 'Escape') {
        closeBooking();
        return;
      }
      if (e.key === 'Tab') {
        var focusable = $$('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]', modal);
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var details = new FormData(form);
      var message = [
        'Hello Kaizen Health & Wellness, I would like to request a consultation.',
        'Name: ' + details.get('name'),
        'Phone: ' + details.get('phone'),
        'Interested in: ' + details.get('service'),
        details.get('message') ? 'Goals: ' + details.get('message') : ''
      ].filter(Boolean).join('\n');
      window.open('https://wa.me/923268666884?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
      form.reset();
      closeBooking();
      showToast('WhatsApp is ready with your request. Review it and press Send to contact the care team.');
    });
  }

  /* ---------- Insight "Read More" buttons ---------- */
  $$('.text-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      showToast('Full articles are coming soon. Message our team on 0326 8666 884 for guidance.', 4200);
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealSelectors = [
    '.pillars > div', '.about .split > div', '.service-intro', '.service-card', '.why-grid > div',
    '.benefits > div', '.testimonial-layout > div:first-child', '.quotes article', '.insights-head',
    '.insight-card', '.location-grid > div', '.footer-grid > div'
  ].join(',');
  var revealEls = $$(revealSelectors);

  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('revealed');
        io.unobserve(el);
        setTimeout(function () {                 // restore the element's own hover transitions
          el.classList.remove('reveal-item', 'revealed');
          el.style.transitionDelay = '';
        }, 1200);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(function (el) {
      var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [el];
      el.style.transitionDelay = (Math.min(siblings.indexOf(el), 5) * 70) + 'ms';
      el.classList.add('reveal-item');
      io.observe(el);
    });
  }

  /* ---------- Small public API (used by chatbot.js) ---------- */
  window.KaizenSite = {
    openBooking: openBooking,
    closeBooking: closeBooking,
    scrollTo: scrollToTarget,
    toast: showToast
  };
})();
