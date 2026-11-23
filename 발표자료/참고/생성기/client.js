(() => {
  const stage = document.getElementById('stage');
  const slides = Array.from(stage.querySelectorAll('.slide'));
  const N = slides.length;
  const ctrl = document.getElementById('ctrl');
  const counter = document.getElementById('counter');
  const story = document.getElementById('story');
  const pad = (n) => String(n).padStart(2, '0');
  // 장 순서에서 저절로 맞추는 것: 장 번호 배지, 왼쪽 장 탭, 총 장수
  // (장을 넣고 빼거나 순서를 바꿔도 이 세 가지는 손댈 필요 없음)
  slides.forEach((s, i) => s.querySelectorAll('.eyebrow .badge, .arow .badge').forEach((b) => { b.textContent = pad(i + 1); }));
  const rail = document.querySelector('.rail');
  if (rail) {
    rail.innerHTML = slides.map((s, i) => '<button class="tb" data-go="' + i + '" title="' + (s.dataset.label || '') + '">' + pad(i + 1) + '</button>').join('');
    rail.classList.toggle('dense', N > 15);
  }
  document.querySelectorAll('[data-total]').forEach((el) => { el.textContent = pad(N); });
  const tabs = Array.from(document.querySelectorAll('[data-go]'));
  const embedded = window.self !== window.top;
  if (embedded) document.documentElement.classList.add('embedded');
  const FONT = "'SUIT Variable', 'SUIT', 'Malgun Gothic', sans-serif";
  let cur = -1;
  let chart = null;
  // 아키텍처 장: 하나의 긴 그림을 카메라처럼 아래로 내려가며 보여 준다
  const arch = document.getElementById('archview');
  const atrack = document.getElementById('atrack');
  const asteps = document.getElementById('asteps');
  const AOFF = atrack ? atrack.dataset.offs.split(',').map(Number) : [];
  function setArch(i, s, prev) {
    if (!arch) return;
    const k = s.dataset.arch ? +s.dataset.arch : 0;
    const fwd = prev < 0 || i > prev;
    if (k) {
      if (!arch.classList.contains('on')) {
        // 들어올 때: 앞으로 넘기면 아래에서 올라오고, 뒤로 넘기면 위에서 내려온다
        atrack.style.transition = 'none';
        atrack.style.setProperty('--off', AOFF[k - 1] + (fwd ? -260 : 260));
        void atrack.offsetHeight;
        atrack.style.transition = '';
      }
      arch.classList.add('on');
      atrack.style.setProperty('--off', AOFF[k - 1]);
      atrack.querySelectorAll('[data-lv]').forEach((e) => e.classList.toggle('lvon', e.dataset.lv.split(' ').includes(String(k))));
    } else if (arch.classList.contains('on')) {
      // 나갈 때: 앞으로 넘기면 위로 올라가며, 뒤로 넘기면 아래로 내려가며 사라진다
      const now = parseFloat(atrack.style.getPropertyValue('--off')) || 0;
      atrack.style.setProperty('--off', now + (fwd ? 320 : -320));
      arch.classList.remove('on');
    }
    if (asteps) {
      const st = s.dataset.astep;
      asteps.classList.toggle('on', st !== undefined);
      if (st !== undefined) {
        asteps.style.setProperty('--pos', st);
        asteps.querySelectorAll('.st').forEach((e, n) => e.classList.toggle('on', n === +st));
      }
    }
  }
  // 전체 화면 버튼
  const fsBtn = document.getElementById('fsBtn');
  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  };
  if (fsBtn) fsBtn.addEventListener('click', toggleFs);
  document.addEventListener('fullscreenchange', () => {
    document.documentElement.classList.toggle('is-fs', !!document.fullscreenElement);
    if (fsBtn) fsBtn.setAttribute('aria-label', document.fullscreenElement ? '전체 화면 끝내기' : '전체 화면');
    fit();
  });

  function fit() {
    const f = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = 'translate(' + (innerWidth - 1920 * f) / 2 + 'px,' + (innerHeight - 1080 * f) / 2 + 'px) scale(' + f + ')';
  }

  // 숫자 올라가기 (한 번만)
  function countUp(slide) {
    slide.querySelectorAll('[data-to]').forEach((el) => {
      const to = parseFloat(el.dataset.to);
      const dec = parseInt(el.dataset.dec || '0', 10);
      const fmt = (v) => (v < 0 && Math.abs(v) >= 0.5 / Math.pow(10, dec) ? '−' : '') + Math.abs(v).toFixed(dec);
      const t0 = performance.now() + 150;
      const dur = 800;
      el.textContent = fmt(0);
      const step = (now) => {
        const p = Math.min(1, Math.max(0, (now - t0) / dur));
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      setTimeout(() => { el.textContent = fmt(to); }, 1400);
    });
  }

  // 7장 막대 차트 (Chart.js, 둥근 막대, 차오르기)
  function drawChart(slide) {
    const cv = slide.querySelector('canvas[data-chart]');
    if (!cv) return;
    if (!window.Chart) {
      cv.parentElement.innerHTML = '<p class="chart-fallback">LightGBM만 29개 → 결합층 18개</p>';
      return;
    }
    if (chart) { chart.reset(); chart.update(); return; }
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    const valueLabels = {
      id: 'valueLabels',
      afterDatasetsDraw(c) {
        const ctx = c.ctx;
        const meta = c.getDatasetMeta(0);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        meta.data.forEach((bar, i) => {
          const val = c.data.datasets[0].data[i];
          ctx.fillStyle = i === 1 ? v('--accent') : v('--ink2');
          ctx.font = '800 60px ' + FONT;
          const w = ctx.measureText(String(val)).width;
          ctx.font = '700 30px ' + FONT;
          const w2 = ctx.measureText('개').width;
          const x0 = bar.x - (w + 4 + w2) / 2;
          ctx.textAlign = 'left';
          ctx.font = '800 60px ' + FONT;
          ctx.fillText(String(val), x0, bar.y - 14);
          ctx.font = '700 30px ' + FONT;
          ctx.fillText('개', x0 + w + 4, bar.y - 22);
        });
        ctx.restore();
      },
    };
    chart = new window.Chart(cv, {
      type: 'bar',
      data: {
        labels: [['모델 하나만', '(LightGBM)'], ['결합층', '(우리 방식)']],
        datasets: [{
          data: [29, 18],
          backgroundColor: [v('--bar-base'), v('--bar-ours')],
          borderRadius: 22,
          borderSkipped: 'start',
          barPercentage: 0.72,
          categoryPercentage: 0.82,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart', delay: 80 },
        layout: { padding: { top: 84, bottom: 0, left: 0, right: 0 } },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          y: { display: false, beginAtZero: true, max: 30 },
          x: {
            grid: { display: false },
            border: { display: true, color: v('--line2'), width: 3 },
            ticks: { color: v('--ink'), font: { family: FONT, size: 28, weight: '700', lineHeight: 1.3 }, padding: 14 },
          },
        },
      },
      plugins: [valueLabels],
    });
  }

  function show(i) {
    i = Math.max(0, Math.min(i, N - 1));
    if (i === cur) return;
    const prev = cur;
    cur = i;
    slides.forEach((s, k) => { s.classList.toggle('active', k === i); s.classList.remove('visible'); });
    const s = slides[i];
    setTimeout(() => {
      s.classList.add('visible');
      countUp(s);
      if (s.querySelector('canvas[data-chart]')) {
        (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => drawChart(s));
      }
    }, 20);
    setArch(i, s, prev);
    tabs.forEach((t) => t.classList.toggle('on', +t.dataset.go === i));
    document.querySelectorAll('[data-cur]').forEach((el) => { el.textContent = pad(i + 1); });
    document.querySelectorAll('[data-lab]').forEach((el) => { el.textContent = s.dataset.label; });
    stage.style.setProperty('--p', String((i + 1) / N));
    if (story) {
      const sp = s.dataset.story;
      story.classList.toggle('on', sp !== undefined);
      if (sp !== undefined) {
        story.style.setProperty('--pos', sp);
        story.querySelectorAll('.st').forEach((e, k) => e.classList.toggle('on', k === +sp));
      }
    }
    if (counter) counter.textContent = (i + 1) + ' / ' + N;
    if (!embedded) history.replaceState(null, '', '#' + (i + 1));
  }

  const fromHash = () => (parseInt(location.hash.slice(1), 10) || 1) - 1;
  addEventListener('resize', fit);
  addEventListener('hashchange', () => show(fromHash()));
  addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); show(cur + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); show(cur - 1); }
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(N - 1);
    else if (e.key === 'f' || e.key === 'F') toggleFs();
  });
  let tx = null;
  addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); tx = null; });
  tabs.forEach((t) => t.addEventListener('click', () => show(+t.dataset.go)));
  document.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => show(cur + +b.dataset.step)));
  document.getElementById('prev').addEventListener('click', () => show(cur - 1));
  document.getElementById('next').addEventListener('click', () => show(cur + 1));
  let idle;
  const wake = () => { ctrl.classList.add('on'); clearTimeout(idle); idle = setTimeout(() => ctrl.classList.remove('on'), 2200); };
  addEventListener('mousemove', wake);
  fit(); show(fromHash()); wake();
})();
