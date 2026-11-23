// 발표 HTML(1920×1080 무대)을 PDF로 바꾼다. 장마다 화면에 다 그려진 모습을 한 쪽씩 담는다(벡터라 글자 선택·검색 가능).
//
// 쓰는 법(저장소 폴더에서):
//   node 발표자료/도구/pdf.mjs 발표자료/발표자료_v02.html                    → 같은 폴더에 발표자료_v02.pdf
//   node 발표자료/도구/pdf.mjs 입력.html 출력.pdf --video <영상 주소>          → 시연 영상 버튼을 그 주소 링크로
//   node 발표자료/도구/pdf.mjs 입력.html 출력.pdf --wait 4000                  → 장마다 기다리는 시간(ms, 기본 3000)
// 필요한 것: Node 22 이상(설치할 패키지 없음), Microsoft Edge 또는 Google Chrome(못 찾으면 BROWSER 환경 변수에 경로).
// 인터넷: SUIT 글꼴을 CDN에서 받는다. 없으면 맑은 고딕으로 찍힌다(맨 처음 줄에 '글꼴 못 불러옴'이 나옴).
// 종료 코드: 0 = PDF 쪽 수가 장 수와 같음, 1 = 다름, 2 = 실행 실패
//
// PDF에 맞게 바꾸는 것(HTML 파일은 고치지 않는다):
//   - 단계 애니메이션 장(.comb, 결합층): 네 단계 흐름을 한 그림에 모두 켜고, 단계 설명(①~④)을 그림 아래에 다 보여 준다.
//     "→ 키로 진행" 안내(.slide-note)와 단계 점은 뺀다.
//   - 시연 영상 버튼(.demo-play): --video 를 주면 그 주소로 가는 링크로 감싼다(PDF에서 누르면 열림).
//   - 전체 화면 버튼(⛶)과 바닥줄 ← → 버튼은 숨긴다.
// 이미 겪은 함정(고쳐 둠):
//   - 장을 넘길 때 스크립트가 [data-cur]·[data-lab]을 모두 바꿔서, 찍어 둔 쪽의 장 번호가 마지막 장 번호로 바뀌었다 → 찍은 쪽에서는 그 속성을 뗀다.
//   - 인쇄의 쪽 나누기는 transform 전 위치로 계산된다. 카메라 그림(9~11장)의 아래쪽 상자가 1080px 밖으로 계산돼 다음 쪽으로 밀려 사라졌다
//     → 카메라 위치를 transform 대신 top으로 옮기고, 보이지 않는 장·요소는 찍은 쪽에서 지운다.
// 확인: 만든 PDF는 엣지로 열어 쪽마다 본다(특히 카메라 장, 결합층 장, 시연 장).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const opt = (name, def) => { const i = argv.indexOf(name); if (i < 0) return def; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const videoLink = opt('--video', '');
const waitMs = +opt('--wait', '3000');
const [htmlArg, outArg] = argv;
if (!htmlArg) { console.error('쓰는 법: node 발표자료/도구/pdf.mjs <발표.html> [출력.pdf] [--video 주소] [--wait ms]'); process.exit(2); }
const html = path.resolve(htmlArg);
if (!fs.existsSync(html)) { console.error('HTML 파일이 없어요: ' + html); process.exit(2); }
const out = path.resolve(outArg || html.replace(/\.html?$/i, '') + '.pdf');

const exe = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean).find((p) => fs.existsSync(p));
if (!exe) { console.error('엣지/크롬을 찾지 못했어요. BROWSER 환경 변수로 실행 파일 경로를 알려 주세요.'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9500 + Math.floor(Math.random() * 300);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'deck-pdf-'));
const browser = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=' + port, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });

// 찍을 때 쓰는 CSS (#__print 안의 쪽에만 걸린다)
const PRINT_CSS = `
#__print .__pg { position: relative; width: 1920px; height: 1080px; overflow: hidden; break-after: page; page-break-after: always; background: #fff; }
#__print .__pg:last-child { break-after: auto; page-break-after: auto; }
#__print .__pg > .deck-stage { position: absolute !important; left: 0 !important; top: 0 !important; transform: none !important; }
#__print .__pg *, #__print .__pg *::before, #__print .__pg *::after { transition: none !important; animation: none !important; }
#__print #fsBtn, #__print .foot .nav { visibility: hidden !important; }
#__print .slide.pcomp .vis { flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; }
#__print .slide.pcomp .stepcap { position: static; height: auto; width: 1600px; display: grid; grid-template-columns: 1fr 1fr; column-gap: 40px; row-gap: 4px; margin: 0 0 4px; }
#__print .slide.pcomp .stepcap span { position: static; opacity: 1; font-size: 24px; line-height: 1.38; white-space: normal; }
#__print .slide.pcomp .stepcap span[data-k="0"] { display: none; }
#__print .slide.pcomp .stepdots, #__print .slide.pcomp .slide-note { display: none !important; }
#__print .slide.pcomp .comb { transform: scale(.9); transform-origin: 50% 0; margin-bottom: -56px; }
#__print a.__vlink { text-decoration: none; display: inline-block; }
`;

// 지금 보이는 장을 한 쪽으로 찍어 #__print 에 붙인다
const SNAP = (i, link) => `(() => {
  const s = document.querySelectorAll('.slide')[${i}];
  const root = s.querySelector('.comb');
  let comp = false;
  if (root) {
    // 단계 애니메이션: 네 단계를 한 그림으로 (FX.comb 의 각 단계 끝 모습을 모두 켬)
    comp = true;
    s.classList.add('pcomp');
    const q = (sel) => root.querySelector(sel);
    const on = (sel, cls) => { const e = q(sel); if (e) e.classList.add(cls); return e; };
    root.querySelectorAll('.tok').forEach((t) => { t.style.opacity = '0'; });
    on('.gl[data-g="hash"]', 'red'); on('.gate', 'ok');
    on('.ot[data-o="blk"]', 'd'); on('.ot[data-o="k"]', 'k'); on('.ot[data-o="p"]', 'p');
    const g = q('.gauge i'); if (g) g.style.width = '92%';
    ['pe-s', 'of-m', 'pd-o'].forEach((l) => on('.lamp[data-l="' + l + '"]', 'on'));
    const cs = getComputedStyle(document.documentElement);
    [['pe', '--sg-score'], ['of', '--sg-m'], ['pd', '--sg-o']].forEach(([b, v]) => { const e = q('.bus[data-bus="' + b + '"]'); if (e) { e.style.setProperty('--c', cs.getPropertyValue(v).trim()); e.classList.add('lit'); } });
    const vb = q('.vbar i'); if (vb) { vb.style.height = '82%'; vb.classList.add('hi'); }
    on('.mou', 'on'); on('.pdft', 'on');
    ['.blk', '.out.k', '.out.p'].forEach((sel) => on(sel, 'hit'));
  }
  const c = document.getElementById('stage').cloneNode(true);
  // 찍은 쪽의 장 번호·이름이 다음 장으로 넘길 때 같이 바뀌지 않게
  c.querySelectorAll('[data-cur],[data-lab],[data-total]').forEach((e) => { e.removeAttribute('data-cur'); e.removeAttribute('data-lab'); e.removeAttribute('data-total'); });
  // 쪽 나누기 함정 피하기: 보이는 장만 남기고, 카메라 위치는 top으로
  c.querySelectorAll('.slide:not(.active)').forEach((e) => e.remove());
  const av = c.querySelector('.archview');
  if (av && !av.classList.contains('on')) av.remove();
  else if (av) {
    const tr = av.querySelector('.atrack');
    const off = parseFloat(tr.style.getPropertyValue('--off')) || 0;
    tr.style.transform = 'none';
    tr.style.top = (-off) + 'px';
    tr.querySelectorAll('[data-lv]:not(.lvon)').forEach((e) => e.remove());
  }
  let linked = false;
  const btn = c.querySelector('.slide.active .demo-play');
  if (btn && ${JSON.stringify(link)}) {
    const a = document.createElement('a'); a.className = '__vlink'; a.href = ${JSON.stringify(link)};
    btn.replaceWith(a); a.appendChild(btn); linked = true;
  }
  const pg = document.createElement('div'); pg.className = '__pg'; pg.appendChild(c);
  document.getElementById('__print').appendChild(pg);
  return { label: s.dataset.label || '', comp, linked };
})()`;

let code = 2;
try {
  let ok = false;
  for (let k = 0; k < 150 && !ok; k++) { try { ok = (await fetch('http://127.0.0.1:' + port + '/json/version')).ok; } catch { await sleep(100); } }
  if (!ok) throw new Error('브라우저 디버깅 포트에 연결하지 못했어요.');
  const t = await (await fetch('http://127.0.0.1:' + port + '/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); if (d.error) p.rej(new Error(d.error.message)); else p.res(d.result); } else if (d.method) events.push(d.method); };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('웹소켓 연결 실패')); });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const run = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    return r.result.value;
  };
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setEmulatedMedia', { media: 'screen' }); // 발표 HTML의 @media print(장만 이어 붙임) 대신 화면 모습 그대로
  await send('Page.navigate', { url: pathToFileURL(html).href + '#1' });
  for (let k = 0; k < 200 && !events.includes('Page.loadEventFired'); k++) await sleep(100);
  const font = await run('document.fonts ? document.fonts.ready.then(() => document.fonts.check(\'30px "SUIT Variable"\')) : true');
  console.log('파일: ' + html + ' · SUIT 글꼴 ' + (font ? '불러옴' : '못 불러옴(인터넷 확인)'));
  await sleep(800);

  const n = await run('document.querySelectorAll(".slide").length');
  await run(`(() => { const pp = document.createElement('div'); pp.id = '__print'; pp.style.display = 'none'; document.body.appendChild(pp);
    const st = document.createElement('style'); st.textContent = ${JSON.stringify(PRINT_CSS)}; document.head.appendChild(st); return true; })()`);
  for (let i = 0; i < n; i++) {
    await run(`location.hash = '#${i + 1}'; true`);
    await sleep(waitMs); // 등장 효과·카메라 이동·선 그리기가 끝날 때까지
    const info = await run(SNAP(i, videoLink));
    console.log(String(i + 1).padStart(2, '0') + ' ' + info.label + (info.comp ? '  (단계 흐름을 한 그림으로)' : '') + (info.linked ? '  (영상 링크)' : ''));
  }
  // 원래 화면을 숨기고 찍은 쪽 묶음만 남겨 인쇄
  await run(`(() => { const st = document.createElement('style');
    st.textContent = 'html, body { width: 1920px !important; height: auto !important; overflow: visible !important; margin: 0 !important; background: #fff !important; } body > *:not(#__print) { display: none !important; } #__print { display: block !important; }';
    document.head.appendChild(st); document.getElementById('__print').style.display = 'block'; return true; })()`);
  await sleep(1500);
  const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: false, paperWidth: 20, paperHeight: 11.25, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, scale: 1, transferMode: 'ReturnAsBase64' });
  fs.writeFileSync(out, Buffer.from(pdf.data, 'base64'));
  const pages = (fs.readFileSync(out).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log('PDF ' + pages + '쪽 · ' + (fs.statSync(out).size / 1048576).toFixed(1) + 'MB → ' + out);
  if (pages !== n) console.log('→ PDF 쪽 수가 장 수(' + n + ')와 달라요. 장이 1080px를 넘거나 쪽 나누기가 어긋났는지 확인하세요.');
  code = pages === n ? 0 : 1;
  try { const b = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); const bw = new WebSocket(b.webSocketDebuggerUrl); await new Promise((r) => { bw.onopen = r; }); bw.send(JSON.stringify({ id: 1, method: 'Browser.close' })); } catch { /* 이미 닫힘 */ }
} catch (e) {
  console.error('실행 실패: ' + e.message);
  code = 2;
} finally {
  await sleep(500);
  try { browser.kill(); } catch { /* 무시 */ }
  await sleep(300);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* 임시 폴더는 나중에 지워도 됨 */ }
}
process.exit(code);
