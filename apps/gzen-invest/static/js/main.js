// ═══════════════════════════════════════════════════
// Mobile nav toggle
// ═══════════════════════════════════════════════════
(function () {
  var burger = document.getElementById('nav-burger');
  var mobile = document.getElementById('nav-mobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      mobile.classList.toggle('open');
    });
  }

  // Active nav link
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
    var href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) link.classList.add('active');
  });
})();

// ═══════════════════════════════════════════════════
// Theme toggle (dark / light)
// ═══════════════════════════════════════════════════
(function () {
  var html = document.documentElement;
  var btns = [
    document.getElementById('theme-toggle'),
    document.getElementById('theme-toggle-m')
  ];

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    btns.forEach(function (btn) {
      if (btn) btn.textContent = t === 'dark' ? '🌙' : '☀️';
    });
  }

  var saved = localStorage.getItem('gzen-theme') || 'dark';
  applyTheme(saved);

  btns.forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('gzen-theme', next);
      applyTheme(next);
    });
  });
})();

// ═══════════════════════════════════════════════════
// Language toggle (EN / ZH)
// ═══════════════════════════════════════════════════
(function () {
  var html = document.documentElement;
  var btns = [
    document.getElementById('lang-toggle'),
    document.getElementById('lang-toggle-m')
  ];

  function applyLang(l) {
    html.setAttribute('lang', l === 'zh' ? 'zh-CN' : 'en');
    btns.forEach(function (btn) {
      if (btn) btn.textContent = l === 'zh' ? '中' : 'EN';
    });
    document.querySelectorAll('[data-en]').forEach(function (el) {
      el.textContent = l === 'zh'
        ? (el.getAttribute('data-zh') || el.getAttribute('data-en'))
        : el.getAttribute('data-en');
    });
  }

  var saved = localStorage.getItem('gzen-lang') || 'en';
  applyLang(saved);

  btns.forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = localStorage.getItem('gzen-lang') || 'en';
      var next = current === 'zh' ? 'en' : 'zh';
      localStorage.setItem('gzen-lang', next);
      applyLang(next);
    });
  });
})();

