/* Make work better. – kleine Helfer für Menü, Switch, Karussell, „Mehr lesen“ und Einblenden.
   Ohne JavaScript bleibt alles lesbar und sichtbar. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menü mobil ---------- */
  var menu = document.getElementById('menu');
  var burger = document.querySelector('.nav-burger');
  var closeBtn = document.querySelector('.menu-close');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.removeAttribute('inert');
    else menu.setAttribute('inert', '');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? closeBtn : burger).focus();
  }
  if (menu && burger) {
    burger.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') setMenu(false);
      if (e.key === 'Tab') {
        var f = menu.querySelectorAll('a, button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900 && menu.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ---------- Switch „Wie ich arbeite“ ---------- */
  document.querySelectorAll('.switch').forEach(function (sw) {
    var tabs = sw.querySelectorAll('.switch-tab');
    var panels = document.querySelectorAll('.switch-panel .step');
    function select(i, focus) {
      var n = (i + tabs.length) % tabs.length;
      sw.style.setProperty('--sel', n);
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', String(k === n));
        t.tabIndex = k === n ? 0 : -1;
      });
      panels.forEach(function (p, k) {
        p.classList.toggle('is-active', k === n);
        p.setAttribute('aria-hidden', String(k !== n));
      });
      if (focus) tabs[n].focus();
      sw.dataset.sel = n;
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') select(i + 1, true);
        if (e.key === 'ArrowLeft') select(i - 1, true);
      });
    });
    var next = sw.querySelector('.switch-next');
    if (next) next.addEventListener('click', function () { select(Number(sw.dataset.sel || 0) + 1); });
    select(0);
  });

  /* ---------- Karussell ---------- */
  document.querySelectorAll('.carousel').forEach(function (c) {
    var track = c.querySelector('.carousel-track');
    var prev = c.querySelector('[data-dir="-1"]');
    var next = c.querySelector('[data-dir="1"]');
    function update() {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    [prev, next].forEach(function (b) {
      b.addEventListener('click', function () {
        var item = track.querySelector('.carousel-item');
        var w = item ? item.offsetWidth + 16 : track.clientWidth * 0.8;
        track.scrollBy({ left: Number(b.dataset.dir) * w, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- „Mehr lesen“ ---------- */
  document.querySelectorAll('.more-btn').forEach(function (b) {
    var box = document.getElementById(b.getAttribute('aria-controls'));
    var label = b.querySelector('span');
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      box.classList.toggle('is-open', open);
      if (open) box.removeAttribute('inert'); else box.setAttribute('inert', '');
      label.textContent = open ? 'Weniger anzeigen' : 'Mehr lesen';
    });
  });

  /* ---------- Einblenden beim Scrollen ---------- */
  var els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el) { io.observe(el); });
})();
