/* GZen — main.js */

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Quiz reveal
  document.querySelectorAll('.reveal-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.quiz-item');
      if (item) {
        item.classList.toggle('revealed');
        btn.textContent = item.classList.contains('revealed') ? 'Hide answer' : 'Reveal answer';
      }
    });
  });

  // Progress tracking via localStorage
  const lessonId = document.body.dataset.lessonId;
  if (lessonId) {
    const completed = JSON.parse(localStorage.getItem('gzen_completed') || '[]');
    const markBtn = document.getElementById('mark-complete-btn');
    if (markBtn) {
      const isDone = completed.includes(lessonId);
      markBtn.textContent = isDone ? '✓ Completed' : 'Mark as complete';
      markBtn.classList.toggle('done', isDone);
      markBtn.addEventListener('click', function () {
        const idx = completed.indexOf(lessonId);
        if (idx === -1) {
          completed.push(lessonId);
          markBtn.textContent = '✓ Completed';
          markBtn.classList.add('done');
        } else {
          completed.splice(idx, 1);
          markBtn.textContent = 'Mark as complete';
          markBtn.classList.remove('done');
        }
        localStorage.setItem('gzen_completed', JSON.stringify(completed));
        updateProgressBar();
      });
    }
    updateProgressBar();
  }

  function updateProgressBar() {
    const bar = document.getElementById('progress-bar');
    const label = document.getElementById('progress-label');
    if (!bar) return;
    const lang = bar.dataset.lang || 'japanese';
    const total = parseInt(bar.dataset.total || '30', 10);
    const completed = JSON.parse(localStorage.getItem('gzen_completed') || '[]');
    const done = completed.filter(function (id) { return id.startsWith(lang + '-'); }).length;
    const pct = Math.round((done / total) * 100);
    bar.style.width = pct + '%';
    if (label) label.textContent = done + ' / ' + total + ' lessons completed (' + pct + '%)';
  }

  // Highlight current sidebar nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-nav-list a').forEach(function (link) {
    if (link.getAttribute('href') === currentPath || link.getAttribute('href') === currentPath + '/') {
      link.classList.add('current');
    }
  });

  // Audio pronunciation (placeholder)
  document.querySelectorAll('.play-audio').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const text = btn.dataset.text;
      if (text && window.speechSynthesis) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = btn.dataset.lang || 'ja-JP';
        window.speechSynthesis.speak(utter);
      }
    });
  });
});
