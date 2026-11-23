/*
 * 발표 HTML 레이아웃 검사 — 장 밖으로 나감 · 글자 넘침 · 블록 겹침 · 제목/글자 크기
 *
 * 쓰는 법 1 (브라우저):
 *   발표 HTML을 엣지/크롬으로 열고 F12 → Console 탭에 이 파일 내용을 통째로 붙여 넣고 Enter.
 *   창 크기와 상관없이 1920×1080 무대 좌표로 잰다. 끝나면 콘솔에 장마다 결과가 나온다.
 * 쓰는 법 2 (명령 한 줄, 사진도 같이):
 *   node 발표자료/도구/check.mjs 발표자료/발표자료_v01.html --shots 발표자료/사진_v01
 *
 * 하는 일: 효과(transition)를 잠시 끄고 1장부터 끝 장까지 넘기며 '최종 모습'을 잰 뒤 원래대로 되돌린다.
 * 문제 종류:
 *   OUT            무대(1920×1080) 밖으로 나간 요소
 *   TXT-OVER       글 블록(.txt) 폭을 넘은 글
 *   SCROLL         overflow가 막힌 상자 안에서 잘린 글
 *   VIS-OVER       그림 영역(.vis) 밖으로 나간 그림 요소
 *   ARCH-EDGE      아키텍처 장(카메라 그림)에서 보이는 상자가 창 가장자리(위아래 40px 흐림 구간)에 걸림
 *   ARCH-TEXT      아키텍처 상자(크기 고정) 안 글이 상자보다 길어 잘림
 *   INNER-OVERLAP  그림 안 상자·표식·글끼리 겹침 (아키텍처·전체 흐름도)
 *   OVERLAP        제목·본문·출처·그림·무대 장치(탭·헤더·바닥줄 등)끼리 겹침
 *   TITLE-SIZE     제목 글자가 64~80px 밖
 *   smallText      28px보다 작은 글자 목록(번호 배지·태그·출처처럼 일부러 작게 한 것만 있어야 함)
 */
(() => {
  async function deckCheck() {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const stage = document.getElementById('stage');
    if (!stage) throw new Error('#stage 를 찾지 못했어요. 발표 HTML에서 실행해 주세요.');
    const noFx = document.createElement('style');
    noFx.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}';
    document.head.appendChild(noFx);
    const sr = stage.getBoundingClientRect();
    const sc = sr.width / 1920;
    const R = (el) => { const r = el.getBoundingClientRect(); return { l: (r.left - sr.left) / sc, t: (r.top - sr.top) / sc, r: (r.right - sr.left) / sc, b: (r.bottom - sr.top) / sc, w: r.width / sc, h: r.height / sc }; };
    const cn = (e) => ((e.className && e.className.baseVal !== undefined) ? e.className.baseVal : e.className) || e.tagName;
    const inter = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
    const union = (els) => { const rs = els.map(R).filter((r) => r.w > 0 && r.h > 0); if (!rs.length) return null; return { l: Math.min(...rs.map((r) => r.l)), t: Math.min(...rs.map((r) => r.t)), r: Math.max(...rs.map((r) => r.r)), b: Math.max(...rs.map((r) => r.b)) }; };
    const shown = (e) => { const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity !== 0; };
    const box = (r) => JSON.stringify([r.l | 0, r.t | 0, r.r | 0, r.b | 0]);
    const slides = [...document.querySelectorAll('.slide')];
    const out = [];
    const small = new Set();
    const startHash = location.hash || '#1';
    for (let i = 0; i < slides.length; i++) {
      location.hash = '#' + (i + 1);
      await sleep(350);
      const s = slides[i];
      const issues = [];
      const arch = document.getElementById('archview');
      const archOn = !!(arch && arch.classList.contains('on'));
      // 1) 무대 밖
      const all = [...s.querySelectorAll('*'), ...document.querySelectorAll('.chrome:not(.archview), .chrome:not(.archview) *')].filter((e) => shown(e) && !e.closest('.story:not(.on)'));
      for (const e of all) { const r = R(e); if (!r.w || !r.h) continue; if (r.l < -1 || r.t < -1 || r.r > 1921 || r.b > 1081) issues.push('OUT ' + cn(e) + ' ' + box(r)); }
      // 2) 글 넘침
      const txt = s.querySelector('.txt');
      if (txt) {
        const tr = R(txt);
        for (const e of txt.querySelectorAll('*')) { const r = R(e); if (r.w && (r.r > tr.r + 1 || r.l < tr.l - 1)) issues.push('TXT-OVER ' + cn(e) + ' 오른쪽 끝 ' + (r.r | 0) + ' > 글 블록 ' + (tr.r | 0)); }
      }
      for (const e of s.querySelectorAll('p, h1, h2, h3, b, li, figcaption, span, em, strong, div')) { const ov = getComputedStyle(e).overflow; if (ov !== 'visible' && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1)) issues.push('SCROLL ' + cn(e)); }
      // 3) 그림 영역
      let visBox = null;
      let inner = [];
      const vis = s.querySelector('.vis');
      if (vis) {
        const vr = R(vis);
        const visCard = getComputedStyle(vis).backgroundColor !== 'rgba(0, 0, 0, 0)';
        for (const e of vis.querySelectorAll('*')) { const r = R(e); if (!r.w || !r.h) continue; if (r.l < vr.l - 1 || r.r > vr.r + 1 || r.t < vr.t - 1 || r.b > vr.b + 1) issues.push('VIS-OVER ' + cn(e) + ' ' + box(r)); }
        visBox = visCard ? vr : union([...vis.querySelectorAll('*')]);
        inner = [...vis.querySelectorAll('.ovn, .ovt, .ovs')];
      }
      if (archOn) {
        const ar = R(arch);
        const seen = [...arch.querySelectorAll('.an.lvon, .ach.lvon, .al2.lvon')];
        for (const e of seen) { const r = R(e); if (r.t < ar.t + 40 || r.b > ar.b - 40 || r.l < ar.l - 1 || r.r > ar.r + 1) issues.push('ARCH-EDGE ' + cn(e) + ' ' + box(r) + ' 창 ' + box(ar)); }
        // 크기를 고정한 상자(.an) 안 글이 상자보다 길면 잘린다
        for (const e of arch.querySelectorAll('.an.lvon')) { if (e.scrollWidth > e.clientWidth + 1) issues.push('ARCH-TEXT [' + e.textContent.trim().slice(0, 14) + '] 글이 상자보다 ' + (e.scrollWidth - e.clientWidth) + 'px 김'); }
        visBox = ar;
        inner = seen;
        if (vis) issues.push('ARCH-AND-VIS 아키텍처 그림과 .vis가 함께 보임');
      }
      for (let a = 0; a < inner.length; a++) for (let b = a + 1; b < inner.length; b++) { if (inter(R(inner[a]), R(inner[b])) > 4) issues.push('INNER-OVERLAP [' + inner[a].textContent.trim().slice(0, 14) + '] x [' + inner[b].textContent.trim().slice(0, 14) + ']'); }
      // 4) 블록끼리 겹침
      const blocks = [];
      // 그림 영역(.vis) 안에 든 글은 그림의 일부라 따로 세지 않는다(그림 안 넘침은 VIS-OVER가 잡음)
      for (const sel of ['.eyebrow', '.kick', '.hl', '.lead', '.evi', '.team', '.arow', '.asrc']) { const e = s.querySelector(sel); if (e && shown(e) && !e.closest('.vis')) blocks.push([sel, R(e)]); }
      const src = s.querySelector('.src');
      if (src) blocks.push(['.src', R(src)]);
      if (visBox) blocks.push(['그림', visBox]);
      for (const e of document.querySelectorAll('.chrome:not(.archview)')) { if (+getComputedStyle(e).opacity === 0) continue; blocks.push(['장치.' + cn(e).replace('chrome ', ''), R(e)]); }
      for (let a = 0; a < blocks.length; a++) for (let b = a + 1; b < blocks.length; b++) {
        const A = blocks[a][1]; const B = blocks[b][1];
        if (!A || !B) continue;
        if (blocks[a][0].startsWith('장치') && blocks[b][0].startsWith('장치')) continue;
        const ar = inter(A, B);
        if (ar > 4) issues.push('OVERLAP ' + blocks[a][0] + ' x ' + blocks[b][0] + ' 넓이=' + (ar | 0));
      }
      // 5) 글자 크기
      const hl = s.querySelector('.hl, .atitle');
      const hfs = hl ? parseFloat(getComputedStyle(hl).fontSize) : 0;
      if (hl && (hfs < 64 || hfs > 80)) issues.push('TITLE-SIZE 제목 ' + hfs + 'px');
      const scope = [...s.querySelectorAll('*'), ...(archOn ? arch.querySelectorAll('.lvon, .lvon *') : [])];
      for (const e of scope) { if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 28) small.add(fs + 'px:' + cn(e)); }
      out.push({ 장: i + 1, 탭: s.dataset.label || '', 제목px: hfs, 문제: issues.length ? issues.join(' ; ') : '문제 없음' });
    }
    noFx.remove();
    location.hash = startHash;
    const bad = out.filter((o) => o.문제 !== '문제 없음').length;
    const result = { ok: bad === 0, 장수: slides.length, 문제_있는_장: bad, 글꼴_SUIT: document.fonts ? document.fonts.check('30px "SUIT Variable"') : null, 장별: out, 작은_글자: [...small] };
    if (typeof console !== 'undefined') { console.table(out); console.log('28px보다 작은 글자:', [...small].join(', ')); console.log(bad ? '문제 있는 장: ' + bad : '모든 장 문제 없음'); }
    return result;
  }
  window.deckCheck = deckCheck;
  return deckCheck();
})();
