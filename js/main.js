// ==================== State ====================
let currentPage = 0;
const totalPages = 18;
const pages = document.querySelectorAll('.page');

// ==================== Loader ====================
function initLoader() {
  const loader = document.getElementById('loader');
  const progress = document.querySelector('.progress');
  let pct = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 15 + 5;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => loader.remove(), 900);
      }, 400);
    }
    progress.style.width = pct + '%';
  }, 180);
}

// ==================== Particles (cyber attack feel) ====================
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? '#00f0ff' : (Math.random() > 0.5 ? '#7b5cff' : '#ff2e63')
    };
  }

  function init() {
    particles = [];
    const count = Math.min(80, Math.floor((w * h) / 15000));
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', () => {
    resize();
    init();
  });
}

// ==================== Navigation ====================
function updateNav() {
  document.getElementById('currentPage').textContent = toPersian(currentPage + 1);
  document.getElementById('totalPages').textContent = toPersian(totalPages);
  document.getElementById('prevBtn').disabled = currentPage === 0;
  document.getElementById('nextBtn').disabled = currentPage === totalPages - 1;
}

function toPersian(n) {
  const persian = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(n).replace(/\d/g, d => persian[d]);
}

function goToPage(index) {
  if (index < 0 || index >= totalPages || index === currentPage) return;

  const direction = index > currentPage ? 1 : -1;
  const current = pages[currentPage];
  const next = pages[index];

  // Exit animation
  current.classList.remove('active');
  current.classList.add(direction > 0 ? 'exit-left' : 'exit-right');

  // Enter
  next.classList.remove('exit-left', 'exit-right');
  next.style.transform = direction > 0 ? 'translateX(60px) scale(0.96)' : 'translateX(-60px) scale(0.96)';
  next.style.opacity = '0';

  // Force reflow
  void next.offsetWidth;

  next.classList.add('active');
  next.style.transform = '';
  next.style.opacity = '';

  setTimeout(() => {
    current.classList.remove('exit-left', 'exit-right');
  }, 600);

  currentPage = index;
  updateNav();
  closeMenu();

  // Glitch effect on page change
  document.body.classList.add('glitch-active');
  setTimeout(() => document.body.classList.remove('glitch-active'), 300);

  // Scroll to top of page
  next.scrollTop = 0;
}

function nextPage() {
  goToPage(currentPage + 1);
}

function prevPage() {
  goToPage(currentPage - 1);
}

// Keyboard
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') nextPage();
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') prevPage();
});

// Touch swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 60) {
    if (diff > 0) nextPage(); // swipe right (RTL: next)
    else prevPage();
  }
}, { passive: true });

// ==================== Side Menu ====================
function toggleMenu() {
  document.getElementById('sideMenu').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('sideMenu').classList.remove('open');
}

function buildMenu() {
  const titles = [
    'جلد', 'شناسنامه', 'فهرست مطالب', 'سرمقاله',
    'آموزش: DDoS چیست؟', 'انواع حملات', 'بات‌نت', 'دفاع',
    'اخبار', 'مصاحبه', 'گری مک‌کینون', 'دانستنی آپولو',
    'حقایق جالب', 'معما', 'نقل‌قول میتنیک', 'طنز سایبری',
    'منابع', 'صفحه پایانی'
  ];

  const container = document.getElementById('menuItems');
  titles.forEach((title, i) => {
    const btn = document.createElement('button');
    btn.textContent = `${toPersian(i + 1)}. ${title}`;
    btn.onclick = () => goToPage(i);
    container.appendChild(btn);
  });
}

// ==================== Quiz ====================
function checkAnswer(btn, isCorrect) {
  const options = btn.parentElement.querySelectorAll('.option');
  options.forEach(o => {
    o.disabled = true;
    o.style.pointerEvents = 'none';
  });

  if (isCorrect) {
    btn.classList.add('correct');
    document.getElementById('quiz-result').textContent = '✅ آفرین! پاسخ درست است.';
    document.getElementById('quiz-result').style.color = '#00e676';
  } else {
    btn.classList.add('wrong');
    document.getElementById('quiz-result').textContent = '❌ اشتباه بود. گزینه درست را پیدا کنید!';
    document.getElementById('quiz-result').style.color = '#ff2e63';
    // Highlight correct
    options.forEach(o => {
      if (o.onclick.toString().includes('true')) o.classList.add('correct');
    });
  }
}

// ==================== Poll ====================
function vote(el) {
  el.style.background = 'rgba(0, 240, 255, 0.2)';
  // Simple visual feedback
  const fills = document.querySelectorAll('.fill');
  fills.forEach(f => {
    const current = parseInt(f.style.width) || 20;
    f.style.width = Math.min(current + Math.random() * 8, 70) + '%';
  });
}

// ==================== Init ====================
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initParticles();
  buildMenu();
  updateNav();

  // Close menu on outside click
  document.addEventListener('click', e => {
    const menu = document.getElementById('sideMenu');
    const btn = document.getElementById('menuBtn');
    if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== btn) {
      closeMenu();
    }
  });
});


// ==================== Background Music ====================
let musicPlaying = false;
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

function toggleMusic() {
  if (!bgMusic) return;
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    document.getElementById('musicIcon').textContent = '🎵';
    musicBtn.classList.remove('playing');
  } else {
    // User gesture required for autoplay policies
    bgMusic.volume = 0.35;
    bgMusic.play().then(() => {
      musicPlaying = true;
      document.getElementById('musicIcon').textContent = '🔊';
      musicBtn.classList.add('playing');
    }).catch(err => {
      console.log('Music play blocked or failed:', err);
      alert('برای پخش موسیقی، یک فایل MP3 در پوشه assets بگذارید و آدرس آن را در تگ audio داخل index.html تنظیم کنید.');
    });
  }
}

// Soft tip on first interaction
let musicTipShown = false;
document.addEventListener('click', () => {
  if (!musicTipShown && !musicPlaying) {
    musicTipShown = true;
    // subtle pulse on music button
    if (musicBtn) musicBtn.classList.add('hint');
    setTimeout(() => musicBtn && musicBtn.classList.remove('hint'), 3000);
  }
}, { once: false });
