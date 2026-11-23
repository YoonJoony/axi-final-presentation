// 발표 HTML을 헤드리스 엣지/크롬으로 열어 1920×1080에서 레이아웃을 검사하고, 원하면 장마다 사진(PNG)을 찍는다.
//
// 쓰는 법:
//   node 발표자료/도구/check.mjs                                   → 발표자료/A1_기준본.html 검사
//   node 발표자료/도구/check.mjs 발표자료/발표자료_v01.html          → 그 파일 검사
//   node 발표자료/도구/check.mjs 발표자료/발표자료_v01.html --shots 발표자료/사진_v01   → 검사 + 장별 사진
// 필요한 것: Node 22 이상(내장 fetch·WebSocket 사용, 설치할 패키지 없음), Microsoft Edge 또는 Google Chrome.
//   브라우저를 못 찾으면 BROWSER 환경 변수에 실행 파일 경로를 넣는다.
// 종료 코드: 0 = 모든 장 문제 없음, 1 = 문제 있는 장이 있음, 2 = 실행 실패
// 주의: SUIT 글꼴과 Chart.js를 CDN에서 받으므로 인터넷이 필요하다(없으면 맑은 고딕으로 재서 결과가 달라질 수 있음).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const shotsAt = argv.indexOf('--shots');
const shotsDir = shotsAt >= 0 ? path.resolve(argv[shotsAt + 1] || path.join(HERE, '..', '사진')) : null;
const htmlArg = argv.find((a, i) => !a.startsWith('--') && !(shotsAt >= 0 && i === shotsAt + 1));
const html = path.resolve(htmlArg || path.join(HERE, '..', 'A1_기준본.html'));
if (!fs.existsSync(html)) { console.error('HTML 파일이 없어요: ' + html); process.exit(2); }

const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const exe = candidates.find((p) => fs.existsSync(p));
if (!exe) { console.error('엣지/크롬을 찾지 못했어요. BROWSER 환경 변수로 실행 파일 경로를 알려 주세요.'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9300 + Math.floor(Math.random() * 600);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'deck-check-'));
const browser = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=' + port, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });

function connect(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(typeof m.data === 'string' ? m.data : m.data.toString());
    if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); if (d.error) p.rej(new Error(d.error.message)); else p.res(d.result); }
    else if (d.method) events.push(d.method);
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const opened = new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('웹소켓 연결 실패: ' + url)); });
  return { ws, send, events, opened };
}

let code = 2;
try {
  let version = null;
  for (let k = 0; k < 150 && !version; k++) { try { const r = await fetch('http://127.0.0.1:' + port + '/json/version'); if (r.ok) version = await r.json(); } catch { await sleep(100); } }
  if (!version) throw new Error('브라우저 디버깅 포트에 연결하지 못했어요.');
  const target = await (await fetch('http://127.0.0.1:' + port + '/json/new?about:blank', { method: 'PUT' })).json();
  const page = connect(target.webSocketDebuggerUrl);
  await page.opened;
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await page.send('Page.navigate', { url: pathToFileURL(html).href + '#1' });
  for (let k = 0; k < 200 && !page.events.includes('Page.loadEventFired'); k++) await sleep(100);
  const run = async (expression) => {
    const r = await page.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    return r.result.value;
  };
  await run('document.fonts ? document.fonts.ready.then(() => true) : true');
  await sleep(800);
  const result = await run(fs.readFileSync(path.join(HERE, 'check-layout.js'), 'utf8'));
  console.log('파일: ' + html);
  console.log('장 수 ' + result.장수 + ' · SUIT 글꼴 ' + (result.글꼴_SUIT ? '불러옴' : '못 불러옴(인터넷 확인)'));
  for (const s of result.장별) console.log(String(s.장).padStart(2, '0') + ' ' + s.탭.padEnd(10) + ' 제목 ' + s.제목px + 'px  ' + s.문제);
  console.log('28px보다 작은 글자: ' + result.작은_글자.join(', '));
  console.log(result.ok ? '→ 모든 장 문제 없음' : '→ 문제 있는 장 ' + result.문제_있는_장 + '개');
  if (shotsDir) {
    fs.mkdirSync(shotsDir, { recursive: true });
    const labels = await run('[...document.querySelectorAll(".slide")].map((s) => s.dataset.label || "")');
    const stepsOf = await run('[...document.querySelectorAll(".slide")].map((s) => +(s.dataset.steps || 0))');
    let count = 0;
    for (let i = 0; i < labels.length; i++) {
      await run("location.hash = '#" + (i + 1) + "'; true");
      await sleep(2400); // 등장 효과·카메라 이동·차트가 끝날 때까지
      const base = String(i + 1).padStart(2, '0') + '_' + (labels[i] || 'slide').replace(/[\\/:*?"<>|\s]+/g, '_');
      let shot = await page.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(shotsDir, base + '.png'), Buffer.from(shot.data, 'base64'));
      count++;
      // 장 안 단계(data-steps): → 를 누를 때마다 한 장씩 더 찍는다(_s1, _s2 …)
      // v02부터 ① 단계가 약 4.4초라 5초 기다린다
      for (let k = 1; k <= (stepsOf[i] || 0); k++) {
        await run("dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); true");
        await sleep(5000);
        shot = await page.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(shotsDir, base + '_s' + k + '.png'), Buffer.from(shot.data, 'base64'));
        count++;
      }
    }
    console.log('사진 ' + count + '장 → ' + shotsDir);
  }
  code = result.ok ? 0 : 1;
  try { const b = connect(version.webSocketDebuggerUrl); await b.opened; await b.send('Browser.close'); } catch { /* 이미 닫힘 */ }
} catch (e) {
  console.error('실행 실패: ' + e.message);
  code = 2;
} finally {
  await sleep(600);
  try { browser.kill(); } catch { /* 무시 */ }
  await sleep(300);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* 임시 폴더는 나중에 지워도 됨 */ }
}
process.exit(code);
