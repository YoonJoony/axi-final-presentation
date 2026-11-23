(() => {
  const stage = document.getElementById('stage');
  const slides = Array.from(stage.querySelectorAll('.slide'));
  const N = slides.length;
  const ctrl = document.getElementById('ctrl');
  const counter = document.getElementById('counter');
  const pad = (n) => String(n).padStart(2, '0');
  const ROMAN = ['', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ'];
  const embedded = window.self !== window.top;
  if (embedded) document.documentElement.classList.add('embedded');
  const FONT = "'SUIT Variable', 'SUIT', 'Malgun Gothic', sans-serif";

  // 장 순서에서 저절로 맞추는 것: 대목차 탭(장의 data-ch·data-chs), 장 번호, 총 장수
  const rail = document.querySelector('.rail');
  if (rail) {
    const firsts = [];
    slides.forEach((s, i) => { const c = s.dataset.ch; if (c && !firsts.some((f) => f.c === c)) firsts.push({ c, i, short: s.dataset.chs || '', name: s.dataset.chn || '' }); });
    rail.innerHTML = firsts.map((f) => '<button class="tb" data-go="' + f.i + '" data-ch="' + f.c + '" title="' + f.name + '">' + ROMAN[+f.c] + '<span>' + f.short + '</span></button>').join('');
  }
  document.querySelectorAll('[data-total]').forEach((el) => { el.textContent = pad(N); });
  const tabs = Array.from(document.querySelectorAll('[data-go]'));

  let cur = -1;
  let step = 0;
  let chart = null;

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
      const tick = (now) => {
        const p = Math.min(1, Math.max(0, (now - t0) / dur));
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(() => { el.textContent = fmt(to); }, 1400);
    });
  }

  // Chart.js 막대 (canvas[data-chart]에 JSON: {labels, series:[{label, data, color}], max, unit})
  function drawChart(slide) {
    const cv = slide.querySelector('canvas[data-chart]');
    if (!cv || !window.Chart) return;
    if (cv._chart) { cv._chart.reset(); cv._chart.update(); return; }
    const cfg = JSON.parse(cv.dataset.chart);
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    const col = (c) => (c && c.startsWith('--') ? v(c) : c);
    cv._chart = new window.Chart(cv, {
      type: 'bar',
      data: { labels: cfg.labels, datasets: cfg.series.map((s) => ({ label: s.label, data: s.data, backgroundColor: col(s.color), borderRadius: 18, borderSkipped: 'start', barPercentage: 0.8, categoryPercentage: 0.7 })) },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart', delay: 80 },
        layout: { padding: { top: 64 } },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { y: { display: false, beginAtZero: true, max: cfg.max || undefined }, x: { grid: { display: false }, border: { color: v('--line2'), width: 3 }, ticks: { color: v('--ink'), font: { family: FONT, size: 28, weight: '700' } } } },
      },
      plugins: [{
        id: 'vals',
        afterDatasetsDraw(c) {
          const ctx = c.ctx; ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.font = '800 40px ' + FONT;
          c.data.datasets.forEach((ds, di) => c.getDatasetMeta(di).data.forEach((bar, i) => { ctx.fillStyle = ds.backgroundColor; ctx.fillText(ds.data[i] + (cfg.unit || ''), bar.x, bar.y - 10); }));
          ctx.restore();
        },
      }],
    });
  }

  // ---------- 아키텍처 카메라 ----------
  const arch = document.getElementById('archview');
  const atrack = document.getElementById('atrack');
  const asteps = document.getElementById('asteps');
  const AOFF = atrack ? atrack.dataset.offs.split(',').map(Number) : [];
  function setArch(i, s, prev) {
    if (arch) {
      const k = s.dataset.arch ? +s.dataset.arch : 0;
      const fwd = prev < 0 || i > prev;
      if (k) {
        if (!arch.classList.contains('on')) {
          atrack.style.transition = 'none';
          atrack.style.setProperty('--off', AOFF[k - 1] + (fwd ? -260 : 260));
          void atrack.offsetHeight;
          atrack.style.transition = '';
        }
        arch.classList.add('on');
        atrack.style.setProperty('--off', AOFF[k - 1]);
        atrack.querySelectorAll('[data-lv]').forEach((e) => e.classList.toggle('lvon', e.dataset.lv.split(' ').includes(String(k))));
      } else if (arch.classList.contains('on')) {
        const now = parseFloat(atrack.style.getPropertyValue('--off')) || 0;
        atrack.style.setProperty('--off', now + (fwd ? 320 : -320));
        arch.classList.remove('on');
      }
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

  // ---------- 장 안 단계 (→ 를 누를 때마다 진행) ----------
  const FX = {};
  function setStep(s, k, animate) {
    step = k;
    s.dataset.step = String(k);
    s.querySelectorAll('.stepdots i').forEach((d, n) => d.classList.toggle('on', n < k));
    const fn = FX[s.dataset.fx];
    if (fn) fn(s, k, animate);
  }

  // 18장: 신호가 켜지면 결합층을 거쳐 정밀 검사로 (→ 한 번에 한 예시, 빠르게)
  FX.comb = (s, k, animate) => {
    const root = s.querySelector('.comb');
    if (!root) return;
    // 단계 설명 한 줄: 지금 단계(k)만 보이게
    s.querySelectorAll('.stepcap [data-k]').forEach((e) => e.classList.toggle('on', +e.dataset.k === k));
    (root._timers || []).forEach(clearTimeout);
    root._timers = [];
    root.querySelectorAll('*').forEach((e) => e.getAnimations && e.getAnimations().forEach((a) => a.cancel()));
    const pos = (x, y) => 'translate(' + (x - 38) + 'px,' + (y - 45) + 'px)';
    // 초기화
    root.querySelectorAll('.tok').forEach((t) => { t.style.opacity = '0'; t.style.transform = pos(90, 280); });
    root.querySelectorAll('.lamp').forEach((l) => l.classList.remove('on'));
    root.querySelectorAll('.gl').forEach((g) => g.classList.remove('red', 'ok'));
    root.querySelectorAll('.hit').forEach((h) => h.classList.remove('hit'));
    const gate = root.querySelector('.gate');
    gate.classList.remove('ok');
    root.querySelectorAll('.bus').forEach((b) => b.classList.remove('lit'));
    root.querySelectorAll('.ot').forEach((o) => o.classList.remove('k', 'p', 'd'));
    root.querySelectorAll('.gauge i').forEach((g) => { g.style.width = '0'; });
    const vb = root.querySelector('.vbar i');
    vb.style.height = '8%'; vb.classList.remove('hi');
    root.querySelector('.mou').classList.remove('on');
    root.querySelector('.pdft').classList.remove('on');
    if (!k) return;

    const ROWX = 465;
    const ROWY = [140, 280, 420];
    const at = (ms, fn) => { if (animate) root._timers.push(setTimeout(fn, ms)); else fn(); };
    const move = (t, x, y, dur) => {
      const to = pos(x, y);
      if (animate) {
        t.animate([{ transform: t.style.transform }, { transform: to }], { duration: dur, easing: 'cubic-bezier(.34,1.45,.64,1)' });
        root._timers.push(setTimeout(() => t.firstElementChild.animate([{ transform: 'scale(1.18,.82)' }, { transform: 'scale(.94,1.06)' }, { transform: 'scale(1)' }], { duration: 240, easing: 'ease-out' }), Math.max(0, dur - 40)));
      }
      t.style.transform = to;
    };
    const appear = (t, x, y, dur = 300) => {
      t.style.transform = pos(x, y);
      t.style.opacity = '1';
      if (animate) t.animate([{ opacity: 0, transform: pos(x, y + 60) + ' scale(.6)' }, { opacity: 1, transform: pos(x, y - 18) + ' scale(1.08)' }, { opacity: 1, transform: pos(x, y) }], { duration: dur, easing: 'ease-out' });
    };
    // 파일이 결과 칸으로 쏙 들어가 사라지고, 칸이 한 번 빛남
    const sink = (t, box, x, y, dur) => {
      move(t, x, y, dur);
      const end = () => { t.style.opacity = '0'; box.classList.add('hit'); };
      if (animate) {
        root._timers.push(setTimeout(() => {
          t.animate([{ opacity: 1, transform: pos(x, y) }, { opacity: 0, transform: pos(x, y) + ' scale(.45)' }], { duration: 200, easing: 'ease-in' });
          root._timers.push(setTimeout(end, 190));
        }, dur));
      } else end();
    };
    const pulse = (bus, color) => {
      const pl = root.querySelector('.pl[data-bus="' + bus + '"]');
      const b = root.querySelector('.bus[data-bus="' + bus + '"]');
      pl.style.setProperty('--c', color);
      b.style.setProperty('--c', color);
      if (animate) {
        pl.animate([{ strokeDashoffset: 14, opacity: 1 }, { strokeDashoffset: -100, opacity: 1 }], { duration: 380, easing: 'linear' });
        root._timers.push(setTimeout(() => b.classList.add('lit'), 280));
      } else b.classList.add('lit');
    };
    const tok = (n) => root.querySelector('.tok[data-t="' + n + '"]');
    const cs = getComputedStyle(document.documentElement);
    const C = (n) => cs.getPropertyValue(n).trim();
    const blk = root.querySelector('.blk');
    const outK = root.querySelector('.out.k');
    const outP = root.querySelector('.out.p');

    if (k === 1) {
      // ① 1차 확정: 알려진 악성은 차단, 일반 파일은 통과 — 동시에.
      //    v02: 사용자 "빠르다" → 약 2배 느리게, 해시 일치(빨강) → 통과(초록) 순서가 보이게 사이를 둠(전체 약 4.4초)
      const a = tok('a');
      const b = tok('b');
      at(0, () => { appear(a, 90, 236, 420); appear(b, 90, 326, 420); });
      at(520, () => { move(a, 395, 236, 560); move(b, 395, 326, 560); });
      at(1200, () => root.querySelector('.gl[data-g="hash"]').classList.add('red'));
      at(1550, () => gate.classList.add('ok'));
      at(1900, () => { root.querySelector('.ot[data-o="blk"]').classList.add('d'); sink(a, blk, 440, 58, 620); move(b, ROWX, 280, 520); });
      at(2620, () => move(b, 1290, 280, 760));
      at(3460, () => { vb.style.height = '14%'; root.querySelector('.ot[data-o="p"]').classList.add('p'); });
      at(3760, () => sink(b, outP, 1520, 400, 620));
      return;
    }
    const spec = {
      2: { label: 'EXE', row: 0, bus: 'pe', color: C('--sg-score'), gauge: true, lamp: 'pe-s' },
      3: { label: 'DOCM', row: 1, bus: 'of', color: C('--sg-m'), lamp: 'of-m', mou: true },
      4: { label: 'PDF', row: 2, bus: 'pd', color: C('--sg-o'), lamp: 'pd-o', pdf: true },
    }[k];
    const t = tok('x');
    t.querySelector('.tb2').textContent = spec.label;
    const y = ROWY[spec.row];
    at(0, () => appear(t, 90, 280));
    at(260, () => move(t, 395, 280, 300));
    at(600, () => gate.classList.add('ok'));
    at(760, () => move(t, ROWX, y, 300));
    at(1080, () => {
      if (spec.gauge) root.querySelector('.gauge i').style.width = '92%';
      if (spec.lamp) root.querySelector('.lamp[data-l="' + spec.lamp + '"]').classList.add('on');
    });
    at(1240, () => pulse(spec.bus, spec.color));
    at(1560, () => { vb.style.height = '82%'; vb.classList.add('hi'); if (spec.mou) root.querySelector('.mou').classList.add('on'); });
    at(1660, () => move(t, 1290, 280, 320));
    at(2000, () => { root.querySelector('.ot[data-o="k"]').classList.add('k'); sink(t, outK, 1520, 160, 320); });
    if (spec.pdf) at(2360, () => root.querySelector('.pdft').classList.add('on'));
  };

  function show(i, opts) {
    i = Math.max(0, Math.min(i, N - 1));
    if (i === cur) return;
    const prev = cur;
    cur = i;
    slides.forEach((s, k) => { s.classList.toggle('active', k === i); s.classList.remove('visible'); });
    const s = slides[i];
    const back = !!(opts && opts.back);
    setStep(s, back ? +(s.dataset.steps || 0) : 0, false);
    setTimeout(() => {
      s.classList.add('visible');
      countUp(s);
      if (s.querySelector('canvas[data-chart]')) (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => drawChart(s));
    }, 20);
    setArch(i, s, prev);
    tabs.forEach((t) => t.classList.toggle('on', t.dataset.ch ? t.dataset.ch === s.dataset.ch : +t.dataset.go === i));
    document.querySelectorAll('[data-cur]').forEach((el) => { el.textContent = pad(i + 1); });
    document.querySelectorAll('[data-lab]').forEach((el) => { el.textContent = s.dataset.label; });
    stage.style.setProperty('--p', String((i + 1) / N));
    if (counter) counter.textContent = (i + 1) + ' / ' + N;
    if (!embedded) history.replaceState(null, '', '#' + (i + 1));
  }
  function next() {
    const s = slides[cur];
    const n = +(s.dataset.steps || 0);
    if (n && step < n) setStep(s, step + 1, true);
    else show(cur + 1);
  }
  function prev() {
    const s = slides[cur];
    if (+(s.dataset.steps || 0) && step > 0) setStep(s, step - 1, false);
    else show(cur - 1, { back: true });
  }

  // 전체 화면
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

  const fromHash = () => (parseInt(location.hash.slice(1), 10) || 1) - 1;
  addEventListener('resize', fit);
  addEventListener('hashchange', () => show(fromHash()));
  addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(N - 1);
    else if (e.key === 'f' || e.key === 'F') toggleFs();
  });
  let tx = null;
  addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); } tx = null; });
  tabs.forEach((t) => t.addEventListener('click', () => show(+t.dataset.go)));
  document.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => (+b.dataset.step > 0 ? next() : prev())));
  document.getElementById('prev').addEventListener('click', prev);
  document.getElementById('next').addEventListener('click', next);
  let idle;
  const wake = () => { ctrl.classList.add('on'); clearTimeout(idle); idle = setTimeout(() => ctrl.classList.remove('on'), 2200); };
  addEventListener('mousemove', wake);
  fit(); show(fromHash()); wake();
  window.__deck = { show, next, prev, get step() { return step; }, get cur() { return cur; } };
})();
