/* make work better – kleine Helfer für Menü, Menüleiste, Tabs, Zitate, Tippen, „Mehr lesen“ und Einblenden.
   Ohne JavaScript bleibt alles lesbar und sichtbar. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Menüleiste: Schatten beim Scrollen ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

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
    var target = open ? closeBtn : burger;
    if (open) setTimeout(function () { target.focus(); }, 30); else target.focus();
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

  /* ---------- Tabs „Drei Schritte“ ---------- */
  document.querySelectorAll('.switch').forEach(function (sw) {
    var tabs = sw.querySelectorAll('.switch-tab');
    var panels = sw.parentNode.querySelectorAll('.switch-panel .step');
    function select(i, focus) {
      var n = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', String(k === n));
        t.tabIndex = k === n ? 0 : -1;
      });
      panels.forEach(function (p, k) {
        p.classList.toggle('is-active', k === n);
        p.setAttribute('aria-hidden', String(k !== n));
      });
      if (focus) tabs[n].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); select(i + 1, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select(i - 1, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    select(0);
  });

  /* ---------- Zitate: eins nach dem anderen, endlos ---------- */
  document.querySelectorAll('[data-quotes]').forEach(function (box) {
    var items = box.querySelectorAll('.quote');
    var count = box.querySelector('.quote-count');
    var cur = 0;
    function show(i) {
      cur = (i + items.length) % items.length;
      items.forEach(function (q, k) {
        q.classList.toggle('is-active', k === cur);
        q.setAttribute('aria-hidden', String(k !== cur));
      });
      if (count) count.textContent = (cur + 1) + ' / ' + items.length;
    }
    box.querySelector('[data-dir="-1"]').addEventListener('click', function () { show(cur - 1); });
    box.querySelector('[data-dir="1"]').addEventListener('click', function () { show(cur + 1); });
    show(0);
  });

  /* ---------- Claim: „better“ wird getippt, dann blinkt der Unterstrich ---------- */
  document.querySelectorAll('.claim-better').forEach(function (el) {
    var cursor = el.querySelector('.cursor');
    var word = el.querySelector('.claim-typed');
    if (!word) return;
    if (reduce) { word.classList.add('is-ready'); return; }
    var text = word.textContent;
    word.textContent = '';
    var letters = text.split('').map(function (ch) {
      var s = document.createElement('span');
      s.className = 'letter';
      s.textContent = ch;
      s.hidden = true;
      word.appendChild(s);
      return s;
    });
    word.classList.add('is-ready');
    var steps = [110, 95, 140, 90, 120, 105], t = 450;
    letters.forEach(function (s, i) {
      t += steps[i % steps.length];
      setTimeout(function () { s.hidden = false; }, t);
    });
    setTimeout(function () { if (cursor) cursor.classList.add('is-blinking'); }, t + 60);
  });

  /* ---------- Abschnittsüberschriften tippen sich beim Scrollen ---------- */
  if (!reduce && hasIO) {
    var heads = [];
    document.querySelectorAll('[data-type]').forEach(function (h) {
      if (h.getBoundingClientRect().top <= window.innerHeight * 0.85) return; // schon sichtbar: steht sofort
      var text = h.textContent.trim();
      h.setAttribute('aria-label', text);
      h.textContent = '';
      var wrap = document.createElement('span');
      wrap.className = 'type-wrap';
      wrap.setAttribute('aria-hidden', 'true');
      var ghost = document.createElement('span');
      ghost.className = 'type-ghost';
      ghost.textContent = text;
      var live = document.createElement('span');
      live.className = 'type-live';
      var typed = document.createTextNode('');
      live.appendChild(typed);
      wrap.appendChild(ghost);
      wrap.appendChild(live);
      h.appendChild(wrap);
      h._type = { text: text, typed: typed, live: live };
      heads.push(h);
    });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tio.unobserve(e.target);
        var d = e.target._type;
        var cur = document.createElement('span');
        cur.className = 'cursor';
        d.live.appendChild(cur);
        var n = 0;
        var timer = setInterval(function () {
          n += 1;
          d.typed.nodeValue = d.text.slice(0, n);
          if (n >= d.text.length) { clearInterval(timer); cur.remove(); }
        }, 32);
      });
    }, { threshold: 0.6 });
    heads.forEach(function (h) { tio.observe(h); });
  }

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
  if (!hasIO) {
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
