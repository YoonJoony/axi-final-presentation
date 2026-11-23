// 발표자료 v01 생성기 (A1 디자인 · 36장 · 팀원 목차 + 2026-11-23 목차 검토 수정안 기본값)
// 실행: node v01.mjs [출력 파일 경로]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = process.argv[2] ? path.resolve(process.argv[2]) : path.join(HERE, '발표자료_v01.html');
const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8');

// ---------- 아이콘 (선 그림, 48 격자) ----------
const sv = (d) => `<svg viewBox="0 0 48 48" aria-hidden="true">${d}</svg>`;
const IC = {
  upload: sv('<path d="M24 31V9"/><path d="M15 18l9-9 9 9"/><path d="M8 30v8a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3v-8"/>'),
  bucket: sv('<ellipse cx="24" cy="11" rx="15" ry="6"/><path d="M9 11v26c0 3.3 6.7 6 15 6s15-2.7 15-6V11"/><path d="M9 24c0 3.3 6.7 6 15 6s15-2.7 15-6"/>'),
  bucketOk: sv('<ellipse cx="24" cy="11" rx="15" ry="6"/><path d="M9 11v26c0 3.3 6.7 6 15 6s15-2.7 15-6V11"/><path d="M17 27l5 5 9-10"/>'),
  queue: sv('<rect x="8" y="8" width="32" height="8" rx="3"/><rect x="8" y="20" width="32" height="8" rx="3"/><rect x="8" y="32" width="32" height="8" rx="3"/>'),
  search: sv('<circle cx="21" cy="21" r="12"/><path d="M30 30l10 10"/>'),
  monitor: sv('<rect x="5" y="7" width="38" height="26" rx="3"/><path d="M17 41h14M24 33v8"/><path d="M21 14l8 6-8 6z"/>'),
  scale: sv('<path d="M24 7v34M15 41h18M9 13h30"/><path d="M9 13L4 25a5 5 0 0 0 10 0z"/><path d="M39 13l-5 12a5 5 0 0 0 10 0z"/>'),
  lock: sv('<rect x="10" y="21" width="28" height="21" rx="3"/><path d="M16 21v-6a8 8 0 0 1 16 0v6"/>'),
  globe: sv('<circle cx="24" cy="24" r="18"/><path d="M6 24h36"/><path d="M24 6c5 5 7.5 11 7.5 18S29 37 24 42c-5-5-7.5-11-7.5-18S19 11 24 6z"/>'),
  user: sv('<circle cx="24" cy="16" r="8"/><path d="M9 42c0-8.5 6.7-14 15-14s15 5.5 15 14"/>'),
  users: sv('<circle cx="18" cy="17" r="7"/><path d="M5 40c0-7.5 5.8-12 13-12s13 4.5 13 12"/><circle cx="33" cy="15" r="6"/><path d="M33 26c6 0 10 4 10 10"/>'),
  doc: sv('<path d="M13 5h15l10 10v26a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z"/><path d="M28 5v10h10"/><path d="M17 25h14M17 32h14M17 39h8"/>'),
  server: sv('<rect x="8" y="7" width="32" height="14" rx="3"/><rect x="8" y="27" width="32" height="14" rx="3"/><path d="M14 14h2M14 34h2"/>'),
  shield: sv('<path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z"/><path d="M17 24l5 5 10-11"/>'),
  cpu: sv('<rect x="12" y="12" width="24" height="24" rx="3"/><path d="M18 6v6M30 6v6M18 36v6M30 36v6M6 18h6M6 30h6M36 18h6M36 30h6"/>'),
  plus: sv('<path d="M24 10v28M10 24h28"/>'),
  filter: sv('<path d="M6 8h36L28 26v14l-8-4V26z"/>'),
  clock: sv('<circle cx="24" cy="24" r="18"/><path d="M24 13v12l8 5"/>'),
  coin: sv('<ellipse cx="24" cy="14" rx="15" ry="6"/><path d="M9 14v10c0 3.3 6.7 6 15 6s15-2.7 15-6V14"/><path d="M9 24v10c0 3.3 6.7 6 15 6s15-2.7 15-6V24"/>'),
  eye: sv('<path d="M3 24s8-14 21-14 21 14 21 14-8 14-21 14S3 24 3 24z"/><circle cx="24" cy="24" r="6"/>'),
  gear: sv('<circle cx="24" cy="24" r="6"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/>'),
  x: sv('<circle cx="24" cy="24" r="18"/><path d="M17 17l14 14M31 17L17 31"/>'),
  check: sv('<circle cx="24" cy="24" r="18"/><path d="M15 24l6 6 12-13"/>'),
  pause: sv('<circle cx="24" cy="24" r="18"/><path d="M20 17v14M28 17v14"/>'),
  layers: sv('<path d="M24 6l18 9-18 9-18-9z"/><path d="M6 24l18 9 18-9"/><path d="M6 33l18 9 18-9"/>'),
  ai: sv('<path d="M24 5l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="M38 32l1.6 4.4L44 38l-4.4 1.6L38 44l-1.6-4.4L32 38l4.4-1.6z"/>'),
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  loop: sv('<path d="M38 20a15 15 0 1 0 1 9"/><path d="M40 9v11H29"/>'),
  play: sv('<circle cx="24" cy="24" r="18"/><path d="M20 16l12 8-12 8z"/>'),
  chart: sv('<path d="M6 40h36"/><path d="M12 34V22M22 34V12M32 34V26"/>'),
};

// ---------- 대목차 ----------
const CH = {
  1: { r: 'Ⅰ', s: '소개', n: '프로젝트 소개 및 정의' },
  2: { r: 'Ⅱ', s: '배경', n: '추진 배경과 서비스 설계' },
  3: { r: 'Ⅲ', s: '정적', n: '정적 분석과 정밀 검사 대상 선별' },
  4: { r: 'Ⅳ', s: '동적', n: '동적 분석과 최종 판정' },
  5: { r: 'Ⅴ', s: '검증', n: '정적 분석 검증과 개선' },
  6: { r: 'Ⅵ', s: '시연', n: '정적 분석 시연' },
  7: { r: 'Ⅶ', s: '마무리', n: '서비스 기대 효과와 운영 한계' },
};

// ---------- 조각 ----------
const tag = (cls, t) => `<span class="tag ${cls}">${t}</span>`;
const head = (ch, l1, l2, extra = '') => `<div class="txt"><div class="eyebrow rv d1"><span class="chip">${CH[ch].r}</span><span class="cn">${CH[ch].n}</span>${extra}</div><h2 class="hl one rv d2">${l1 ? `<span class="l1">${l1}</span>` : ''}<span class="l2">${l2}</span></h2></div>`;
const head2 = (ch, l1, l2, extra = '') => `<div class="txt"><div class="eyebrow rv d1"><span class="chip">${CH[ch].r}</span><span class="cn">${CH[ch].n}</span>${extra}</div><h2 class="hl rv d2"><span class="l1">${l1}</span><span class="l2">${l2}</span></h2></div>`;
const ahead = (ch, l1, l2, pg) => `<div class="txt"><div class="arow rv d1"><span class="chip">${CH[ch].r}</span><h2 class="atitle"><span class="l1">${l1}</span><span class="l2">${l2}</span></h2><span class="pgx">${pg}</span></div></div>`;
const slide = (ch, label, inner, attrs = '') => `<section class="slide" data-ch="${ch}" data-chs="${CH[ch].s}" data-chn="${CH[ch].n}" data-label="${label}" aria-label="${label}"${attrs ? ' ' + attrs : ''}>
<div class="frame">
${inner}
</div>
</section>`;
const vis = (html) => `<div class="vis">${html}</div>`;
const src = (t, d = 'd6') => `<p class="src rv ${d}">출처 · ${t}</p>`;
const card = ({ cls = '', icon = '', num = '', t = '', b = '', s = '', d = 'd3' }) => `<div class="card ${cls} rv ${d}"><div class="ch">${icon || num ? `<span class="ci">${icon || num}</span>` : ''}<div class="ct">${t}</div></div>${b ? `<div class="cb">${b}</div>` : ''}${s ? `<div class="cs">${s}</div>` : ''}</div>`;
const cards = (n, items) => `<div class="cards c${n}">${items.join('')}</div>`;
const fi = ({ cls = '', icon, t, s = '', d = 'd3' }) => `<div class="fi ${cls} rv ${d}"><span class="ic">${icon}</span><b>${t}</b>${s ? `<span>${s}</span>` : ''}</div>`;
const fa = (cls = '', d = 'd3') => `<i class="fa ${cls} rv ${d}"></i>`;
const fl = (...items) => `<div class="fl">${items.join('')}</div>`;
const col = (...items) => `<div class="col">${items.join('')}</div>`;
const pts = (items, d = 'd4') => `<ul class="pts rv ${d}">${items.map((x) => `<li><span>${x}</span></li>`).join('')}</ul>`;
const cond = (items, d = 'd5') => `<div class="cond rv ${d}">${items.map((x) => (x.startsWith('!') ? `<span class="w">${x.slice(1)}</span>` : `<span>${x}</span>`)).join('')}</div>`;
const ARW = '<svg class="arw" viewBox="0 0 64 24" aria-hidden="true"><path d="M3 12h54M45 3l12 9-12 9"/></svg>';
const ARWL = '<svg class="arw" viewBox="0 0 64 24" aria-hidden="true"><path d="M61 12H7M19 3L7 12l12 9"/></svg>';
const ba = (label, from, to, unit, note, cls = '', d = 'd4') => `<div class="ba rv ${d}"><div class="bl">${label}</div><div class="bv"><span class="f">${from}<small>${unit}</small></span>${ARW}<span class="t ${cls}">${to}<small>${unit}</small></span></div>${note ? `<div class="bn">${note}</div>` : ''}</div>`;
const kpi = (v, unit, l, s, d = 'd3') => `<div class="kpi rv ${d}"><div class="kv">${v}<small>${unit}</small></div><div class="kl">${l}</div>${s ? `<div class="ks">${s}</div>` : ''}</div>`;

// ---------- 표지 그림 (A1) ----------
const FILEART = `<svg class="fileart" viewBox="0 0 400 500" role="img" aria-label="검사를 통과한 파일 그림">
  <path class="pg" d="M40 14h220l100 100v356a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V30a16 16 0 0 1 16-16z"/>
  <path class="fold" d="M260 14v84a16 16 0 0 0 16 16h84z"/>
  <rect class="ln a" x="72" y="150" width="150" height="20" rx="10"/>
  <rect class="ln" x="72" y="198" width="230" height="14" rx="7"/>
  <rect class="ln" x="72" y="230" width="250" height="14" rx="7"/>
  <rect class="ln" x="72" y="262" width="196" height="14" rx="7"/>
  <rect class="ln" x="72" y="294" width="150" height="14" rx="7"/>
  <rect class="ln" x="72" y="326" width="120" height="14" rx="7"/>
  <g class="pop"><path class="sh" d="M300 300l70 26v52c0 44-30 78-70 94-40-16-70-50-70-94v-52z"/><path class="ck" d="M268 386l22 22 44-48"/></g>
</svg>`;

// ---------- 3장: 간단 흐름도 (A1 전체 흐름을 위로 90 당김) ----------
const OVN = (cx, cy, cls, icon, label, lcls, ly, d, sub = '') => `<div class="ovn ${cls} rv" style="--cx:${cx};--cy:${cy};transition-delay:${d}s">${icon}</div><b class="ovt ${lcls} rv" style="--cx:${cx};--cy:${ly};transition-delay:${d}s">${label}${sub ? `<span>${sub}</span>` : ''}</b>`;
const OVE = (cls, d, p, h, hd) => `<path class="e ${cls}" pathLength="1" style="transition-delay:${d}s" d="${p}"/><path class="h ${cls}" style="transition-delay:${hd}s" d="${h}"/>`;
const OVERVIEW = `<div class="ov">
<svg class="ovlines" width="1600" height="560" viewBox="0 0 1600 560" aria-hidden="true">
  ${OVE('a', .15, 'M170 270 H398', 'M392 258L414 270L392 282z', .5)}
  ${OVE('a', .4, 'M550 270 H748', 'M742 258L764 270L742 282z', .75)}
  ${OVE('n', .4, 'M480 202 C480 40 1170 40 1170 186', 'M1158 180L1170 202L1182 180z', .75)}
  ${OVE('n', .65, 'M900 270 H1086', 'M1080 258L1102 270L1080 282z', 1)}
  ${OVE('p', .9, 'M1224 232 C1300 232 1330 110 1396 110', 'M1390 98L1412 110L1390 122z', 1.25)}
  ${OVE('d', .9, 'M1224 308 C1300 308 1330 430 1396 430', 'M1390 418L1412 430L1390 442z', 1.25)}
</svg>
${OVN(100, 270, '', IC.upload, '업로드', '', 346, .05)}
${OVN(480, 270, 'k', IC.search, '정적 분석', '', 346, .3, 'PE 머신러닝 · Office·PDF 규칙')}
${OVN(830, 270, 'k', IC.monitor, '동적 분석', '', 346, .55, '의심 파일만 · 격리 환경')}
${OVN(1170, 270, 'k', IC.scale, '최종 판정', '', 346, .8)}
${OVN(1480, 110, 'p', IC.globe, '배포', 'p', 186, 1.1)}
${OVN(1480, 430, 'd', IC.lock, '차단·보류', 'd', 506, 1.1)}
<span class="ovs sig rv" style="--cx:290;--cy:226;transition-delay:.3s">${IC.bolt}업로드 이벤트</span>
<span class="ovs sig rv" style="--cx:655;--cy:226;transition-delay:.55s">${IC.bolt}의심 파일만</span>
<span class="ovs rv" style="--cx:825;--cy:32;transition-delay:.55s">나머지는 바로 판정</span>
<span class="ovs p rv" style="--cx:1300;--cy:138;transition-delay:1s">통과</span>
<span class="ovs d rv" style="--cx:1252;--cy:432;transition-delay:1s">악성·근거 부족</span>
</div>`;

// ---------- 9~11장: 카메라 아키텍처 (11/22 구조) ----------
const AN = (lv, cx, top, icon, title, sub, cls = '') => `<div class="an ${cls}" data-lv="${lv}" style="--cx:${cx};top:${top}px"><span class="ai">${icon}</span><span class="at"><b>${title}</b><span>${sub}</span></span></div>`;
const LB = (lv, x, top, html, cls = '') => `<span class="al2 ${cls}" data-lv="${lv}" style="--x:${x};top:${top}px">${html}</span>`;
const SIG = (t) => `<span class="sig">${IC.bolt}${t}</span>`;
const LN = (lv, d, cls = 'ln') => `<path data-lv="${lv}" class="${cls}" d="${d}"/>`;
const MK = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" orient="auto"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`;
const ARCH = `<div class="archview" id="archview" aria-hidden="true"><div class="atrack" id="atrack" data-offs="-60,388,892">
<svg class="alines" width="1600" height="1600" viewBox="0 0 1600 1600">
  <defs>${MK('m-n', '#9AA8BD')}${MK('m-a', '#0B3A8F')}${MK('m-d', '#D2384E')}${MK('m-p', '#0E8C7E')}</defs>
  ${LN('2 3', 'M1094 488 H1450 V1128', 'lane')}
  ${LN('1', 'M800 120 V172')}
  ${LN('1', 'M800 256 V308', 'ln a')}
  ${LN('1', 'M800 392 V444')}
  ${LN('2', 'M800 528 V580', 'ln a')}
  ${LN('2', 'M800 664 V716')}
  ${LN('2', 'M800 800 V852')}
  ${LN('2', 'M800 936 V988')}
  ${LN('3', 'M800 1072 V1124')}
  ${LN('3', 'M400 1224 V1276', 'ln d')}
  ${LN('3', 'M1200 1224 V1276', 'ln p')}
  ${LN('3', 'M1200 1360 V1412', 'ln p')}
</svg>
${AN('1', 800, 40, IC.upload, '파일 업로드', '고객사 운영자')}
${LB('1', 830, 126, 'Presigned URL로 업로드')}
${AN('1', 800, 176, IC.bucket, 'S3 incoming/', 'AWS · 검사 전 보관 · 밖에서 못 받음')}
${LB('1', 830, 262, SIG('업로드 이벤트') + 'S3가 바로 알림')}
${AN('1', 800, 312, IC.queue, 'SQS 정적 대기열', 'AWS · 검사할 파일 차례')}
${LB('1', 830, 398, 'EC2 worker가 하나씩 가져감')}
${AN('1 2', 800, 448, IC.search, '정적 분석 ⓪~⑤', 'AWS EC2 · worker · 파일당 약 1초', 'key')}
${LB('2', 1270, 436, '나머지는 바로 판정', 'c')}
${LB('2', 830, 532, SIG('위험 점수 기준 이상') + '정상 파일의 2~5%만')}
${AN('2', 800, 584, IC.queue, 'SQS 동적 대기열', 'AWS · 정밀 검사할 파일')}
${LB('2', 830, 668, '가져가기 · 실습 PC로 들어오는 연결 없음')}
${AN('2', 800, 720, IC.server, 'gateway', '실습 PC · 호스트 프로그램', 'pc')}
${LB('2', 830, 804, '격리 VM에 제출')}
${AN('2', 800, 856, IC.monitor, 'CAPEv2 동적 분석 ⑥', '실습 PC · 격리 VM · Windows 10 · 가짜 인터넷', 'pc')}
${LB('2', 830, 940, '행동 요약을 돌려줌')}
${AN('2 3', 800, 992, IC.queue, 'SQS 결과 대기열', 'AWS · 동적 분석 결과')}
${LB('3', 830, 1076, 'EC2 worker가 받아서')}
${AN('3', 800, 1128, IC.scale, '최종 판정 ⑦ · Decision Engine', 'AWS EC2 · 정적·동적 근거를 합쳐 결정, 애매하면 보류', 'de')}
${LB('3', 424, 1228, '<b>차단·보류</b>', 'd')}
${LB('3', 1224, 1228, '<b>통과</b>', 'p')}
${AN('3', 400, 1280, IC.lock, 'S3 quarantine/', '격리 · 알림 · 관제 화면', 'q')}
${LB('3', 400, 1376, IC.loop + '악성 해시는 등록해 다음엔 1차에서 차단', 'c fb')}
${AN('3', 1200, 1280, IC.bucketOk, 'S3 public/', 'CLEAN 태그가 붙은 파일만', 'p')}
${AN('3', 1200, 1416, IC.globe, 'CDN 배포', '통과한 파일만 사용자에게', 'p')}
</div></div>`;
const ASTEPS = `<div class="chrome story asteps" id="asteps" aria-hidden="true"><span class="ind"></span>
  <span class="st"><i>1</i>업로드·정적</span><span class="st"><i>2</i>정밀 검사 경로</span><span class="st"><i>3</i>판정·배포</span>
</div>`;

// ---------- 18장: 결합층 애니메이션 ----------
const LAMP = (l, left, color, ch, dim = false) => `<span class="lamp${dim ? ' dim' : ''}"${l ? ` data-l="${l}"` : ''} style="left:${left}px${color ? `;--c:var(${color})` : ''}">${ch}</span>`;
const COMB = `<div class="comb" aria-label="1차 확정과 형식별 신호, 결합층, 정밀 검사 흐름">
<svg class="cl" width="1600" height="560" viewBox="0 0 1600 560" aria-hidden="true">
  <path class="ot" d="M160 280 H208"/>
  <path class="ot" d="M430 280 C462 280 466 140 500 140"/>
  <path class="ot" d="M430 280 H500"/>
  <path class="ot" d="M430 280 C462 280 466 420 500 420"/>
  <path class="ot" data-o="blk" d="M400 148 V90"/>
  <path class="bus" data-bus="pe" d="M1110 140 C1160 140 1150 280 1198 280"/>
  <path class="bus" data-bus="of" d="M1110 280 H1198"/>
  <path class="bus" data-bus="pd" d="M1110 420 C1160 420 1150 280 1198 280"/>
  <path class="pl" data-bus="pe" pathLength="100" d="M1110 140 C1160 140 1150 280 1198 280"/>
  <path class="pl" data-bus="of" pathLength="100" d="M1110 280 H1198"/>
  <path class="pl" data-bus="pd" pathLength="100" d="M1110 420 C1160 420 1150 280 1198 280"/>
  <path class="ot" data-o="k" d="M1382 220 C1412 220 1410 160 1438 160"/>
  <path class="ot" data-o="p" d="M1382 340 C1412 340 1410 400 1438 400"/>
</svg>
<div class="box dock"><span class="dic">${IC.upload}</span><div class="bt">업로드</div></div>
<div class="box gate"><div class="bt">1차 확정</div><div class="gl" data-g="hash" style="top:78px"><span class="dot"></span>해시</div><div class="gl" data-g="av" style="top:128px"><span class="dot"></span>백신</div><div class="gl" data-g="yara" style="top:178px"><span class="dot"></span>YARA</div><div class="gck">통과</div></div>
<div class="blk">차단</div>
<div class="row" style="top:88px"><div class="rn">PE</div><div class="gauge" style="left:150px"><i></i></div><span class="gtick" style="left:300px"></span>${LAMP('pe-a', 390, '--sg-a', 'A')}${LAMP('pe-b', 462, '--sg-b', 'B')}${LAMP('pe-f', 534, '--sg-f', 'F')}</div>
<div class="row" style="top:228px"><div class="rn">Office</div>${LAMP('of-m', 150, '--sg-m', 'M')}${LAMP('of-o', 222, '--sg-o', 'O')}<span class="rec" style="left:330px">기록만</span>${LAMP('', 330, '', 'E', true)}${LAMP('', 402, '', 'X', true)}${LAMP('', 474, '', 'S', true)}</div>
<div class="row" style="top:368px"><div class="rn">PDF</div>${LAMP('pd-m', 150, '--sg-m', 'M')}${LAMP('pd-o', 222, '--sg-o', 'O')}${LAMP('pd-s', 294, '--sg-s', 'S')}<span class="rec" style="left:402px">기록만</span>${LAMP('', 402, '', 'X', true)}${LAMP('', 474, '', 'E', true)}</div>
<div class="box core"><div class="bt">결합층</div><div class="vbar"><i></i></div><span class="thr"></span><span class="gtx">기준</span><div class="mou">M ∪ O</div></div>
<div class="out k">정밀 검사</div>
<div class="out p">통과 후보</div>
<div class="pdft">PDF 동적 준비 중<br>→ 지금은 보류</div>
<p class="leg"><b>A</b> 닮음 · <b>B</b> 약한 탐지 · <b>F</b> 넓은 규칙 · <b>M</b> 자동 실행 · <b>O</b> 숨김·난독화 · <b>S</b> 구조 이상 · 점선 칸은 기록만(무게 0)</p>
<div class="tok bad" data-t="a"><div class="tb2">악성</div></div>
<div class="tok" data-t="b"><div class="tb2">일반</div></div>
<div class="tok k" data-t="x"><div class="tb2">EXE</div></div>
</div>
<div class="stepdots" aria-hidden="true"><i></i><i></i><i></i><i></i></div>`;

// ---------- 19장: 점수 분포와 기준선 ----------
function dotPlot() {
  let seed = 20261123;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 0.58; };
  const dots = [];
  for (let i = 0; i < 40; i++) { const x = Math.max(90, Math.min(1180, 470 + gauss() * 230)); dots.push(`<circle cx="${x.toFixed(0)}" cy="${(120 + rnd() * 150).toFixed(0)}" r="12" class="dn"/>`); }
  for (let i = 0; i < 14; i++) { const x = Math.max(820, Math.min(1520, 1300 + gauss() * 140)); dots.push(`<circle cx="${x.toFixed(0)}" cy="${(120 + rnd() * 150).toFixed(0)}" r="12" class="dm"/>`); }
  return `<svg class="svgv dplot rv d3" viewBox="0 0 1600 360" width="1600" height="360" role="img" aria-label="위험 점수 분포와 기준선">
  <rect x="1150" y="56" width="390" height="244" class="zone"/>
  <text x="1530" y="96" text-anchor="end" class="zt">정밀 검사로</text>
  ${dots.join('')}
  <line x1="60" y1="300" x2="1540" y2="300" class="ax"/>
  <text x="1540" y="344" text-anchor="end" class="axl">위험 점수 →</text>
  <line x1="1000" y1="70" x2="1000" y2="300" class="alt"/>
  <line x1="1300" y1="70" x2="1300" y2="300" class="alt"/>
  <line x1="1150" y1="40" x2="1150" y2="300" class="thr2"/>
  <text x="1150" y="30" text-anchor="middle" class="tl">기준선 = 고객 정책</text>
  <text x="990" y="66" text-anchor="end" class="al">← 넓게 검사</text>
  <text x="1310" y="66" class="al">좁게 검사 →</text>
  <circle cx="90" cy="344" r="11" class="dn"/><text x="110" y="353" class="lg">정상 파일</text>
  <circle cx="290" cy="344" r="11" class="dm"/><text x="310" y="353" class="lg">악성 파일</text>
</svg>`;
}

// ---------- 23장: 최종 판정 흐름도 ----------
const FC = `<div class="fc">
<svg class="svgv fcl" viewBox="0 0 1600 600" width="1600" height="600" aria-hidden="true">
  <defs>${MK('f-n', '#9AA8BD')}${MK('f-d', '#D2384E')}${MK('f-w', '#B4650A')}${MK('f-p', '#0E8C7E')}</defs>
  <path class="fe" d="M560 72 V100"/>
  <path class="fe" d="M560 200 V212"/>
  <path class="fe" d="M560 312 V324"/>
  <path class="fe" d="M560 424 V452"/>
  <path class="fe w" d="M750 150 H898"/>
  <path class="fe d" d="M750 262 H898"/>
  <path class="fe p" d="M750 374 H898"/>
  <path class="fe" d="M722 486 H822"/>
  <path class="fe d" d="M1130 486 C1160 486 1160 430 1182 430"/>
  <path class="fe w" d="M1130 486 H1182"/>
  <path class="fe p" d="M1130 486 C1160 486 1160 542 1182 542"/>
</svg>
<div class="fn" style="--cx:560;--cy:40">정적 분석 결과</div>
<div class="fd" style="--cx:560;--cy:150">검사를 다 마쳤나?</div>
<div class="fd" style="--cx:560;--cy:262">알려진 악성인가?</div>
<div class="fd" style="--cx:560;--cy:374">점수가 기준 이상?</div>
<div class="fn k" style="--cx:560;--cy:486">정밀 검사(동적 분석)</div>
<div class="fd" style="--cx:980;--cy:486;width:300px">악성 행동인가?</div>
<span class="fy" style="--x:582;--y:196">예</span><span class="fy" style="--x:582;--y:310">아니오</span><span class="fy" style="--x:582;--y:432">예</span>
<span class="fy c" style="--x:824;--y:114">아니오</span><span class="fy c" style="--x:824;--y:226">예</span><span class="fy c" style="--x:824;--y:338">아니오</span>
<div class="fo w" style="--cx:980;--cy:150">보류</div><span class="fr" style="--x:1070;--y:150">암호·한도 초과·오류</span>
<div class="fo d" style="--cx:980;--cy:262">차단</div><span class="fr" style="--x:1070;--y:262">해시·백신·YARA 일치</span>
<div class="fo p" style="--cx:980;--cy:374">배포</div><span class="fr" style="--x:1070;--y:374">기준 미만 → CLEAN → CDN</span>
<div class="fo d sm" style="--cx:1262;--cy:430">차단</div><span class="fr" style="--x:1340;--y:430">악성 행동 확인</span>
<div class="fo w sm" style="--cx:1262;--cy:486">보류</div><span class="fr" style="--x:1340;--y:486">실행 실패·믿기 어려움</span>
<div class="fo p sm" style="--cx:1262;--cy:542">배포</div><span class="fr" style="--x:1340;--y:542">행동 없음·믿을 수 있음</span>
<div class="fnote"><b>원칙</b><span>점수만으로는 차단하지 않는다</span><span>판정마다 근거를 남긴다</span><em>시연판(11/22): 동적은 행동 규칙 R1만 보고, 그 밖의 동적 결과는 보류</em></div>
</div>`;

// ---------- 25장: 정상 100개 중 2~5개 ----------
const DOTGRID = `<div class="dgrid rv d3" aria-label="정상 100개 중 2~5개만 정밀 검사">${Array.from({ length: 100 }, (_, i) => `<i class="${i >= 98 ? 'on' : i >= 95 ? 'mid' : ''}"></i>`).join('')}</div>`;

// ---------- 27장: 문턱 고르기 산점도 ----------
function scatter() {
  const X = (v) => 110 + (v / 65) * 740;
  const Y = (v) => 480 - (v - 60) * 10.5;
  const pts = [
    { x: 60.0, y: 95.5, l: 'RanDS 2024 정상 2%', a: 'end', dx: -18, dy: 8 },
    { x: 19.2, y: 84.8, l: '두 정상 합쳐 2%', a: 'start', dx: 18, dy: 8 },
    { x: 3.2, y: 69.0, l: '최근 로컬 정상 2%', a: 'start', dx: 18, dy: 30 },
    { x: 5.6, y: 76.2, l: '최근 로컬 정상 5% (선택)', a: 'start', dx: 18, dy: -10, k: true },
  ];
  return `<svg class="svgv sct rv d3" viewBox="0 0 900 560" width="900" height="560" role="img" aria-label="문턱 후보별 정상 전송과 악성 적발">
  <rect x="${X(2).toFixed(1)}" y="40" width="${(X(5) - X(2)).toFixed(1)}" height="440" class="band"/>
  <text x="${(X(2) - 4).toFixed(1)}" y="32" class="bt2">목표 2~5%</text>
  <line x1="110" y1="480" x2="860" y2="480" class="ax"/><line x1="110" y1="40" x2="110" y2="480" class="ax"/>
  ${[0, 20, 40, 60].map((v) => `<text x="${X(v).toFixed(1)}" y="514" text-anchor="middle" class="tk">${v}%</text>`).join('')}
  ${[60, 80, 100].map((v) => `<text x="96" y="${(Y(v) + 9).toFixed(1)}" text-anchor="end" class="tk">${v}%</text>`).join('')}
  <text x="860" y="552" text-anchor="end" class="axl">최근 로컬 정상을 보낸 비율 →</text>
  <text x="122" y="72" class="axl">↑ 최근 악성 적발</text>
  ${pts.map((p) => `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="${p.k ? 14 : 10}" class="${p.k ? 'pk' : 'pn'}"/><text x="${(X(p.x) + p.dx).toFixed(1)}" y="${(Y(p.y) + p.dy).toFixed(1)}" text-anchor="${p.a}" class="${p.k ? 'plk' : 'pl2'}">${p.l}</text>`).join('')}
</svg>`;
}

// ---------- 슬라이드 ----------
const SLIDES = [];
const add = (s) => SLIDES.push(s);

// Ⅰ. 프로젝트 소개 및 정의
add(`<section class="slide cover" data-ch="1" data-chs="${CH[1].s}" data-chn="${CH[1].n}" data-label="표지" aria-label="표지">
  <div class="txt">
    <p class="kick rv d1"><i></i>클라우드 보안 AI 부트캠프 · 최종 프로젝트</p>
    <span class="aib rv d2">${IC.ai}AI 기반</span>
    <h1 class="hl rv d2"><span class="l1">업로드 파일 악성코드</span><span class="l2">사전 탐지·차단 시스템</span></h1>
    <p class="lead rv d3">올라온 파일을 배포 전에 검사하고, 통과한 파일만 내보냅니다.</p>
    <div class="team rv d5"><b>팀명 OOO · 발표 OOO</b><span>과제 제공 · 스피디 · 2026. 11. 24.</span></div>
  </div>
  <div class="vis"><div class="art blur">${FILEART}</div></div>
</section>`);

add(slide(1, '발표 목차', head(1, '', '발표 목차') + vis(`<div class="toc">${[1, 2, 3, 4, 5, 6, 7].map((c, i) => `<div class="tc rv d${Math.min(8, i + 2)}"><span class="tn">${CH[c].r}</span><span class="tt">${CH[c].n}</span><span class="tr" data-range="${c}"></span></div>`).join('')}</div>`)));

add(slide(1, '배포 전 검사 시스템', head(1, '업로드 파일을 ', '배포 전에 검사하는 시스템') + vis(col(
  `<div class="cond rv d3"><span>주요 고객 · 공공·교육기관 · 게임·에듀테크</span><span>파일을 많이 배포하는 조직의 운영자</span><span>올린 파일을 이용자에게 공개하기 전에 검사</span></div>`,
  OVERVIEW,
)) + src('최종 기획서 1.3·3·4장')));

add(slide(1, '팀 구성', head(1, '', '팀 구성과 역할 분담', tag('chk', '임시 배분 · 팀 확인 필요')) + vis(cards(2, [
  card({ cls: 'k', num: 'A', t: 'OOO · 서비스 기획·판정 정책', b: '고객별 검사 정책과 배포·차단·보류 기준', d: 'd3' }),
  card({ cls: 'k', num: 'B', t: 'OOO · 정적 분석·AI', b: 'PE 모델과 Office·PDF 검사 규칙', d: 'd4' }),
  card({ cls: 'k', num: 'C', t: 'OOO · 동적 분석·시스템 연동', b: 'CAPEv2 격리 실행과 클라우드 연결', d: 'd5' }),
  card({ cls: 'k', num: 'D', t: 'OOO · 데이터·검증·시연', b: '평가 표본과 성능 비교, 두 파일 시연 검증', d: 'd6' }),
])) + src('팀원 목차 5절(임시 배분) · 기획서 명단은 5명 — 칸 수는 팀에서 확인', 'd7')));

// Ⅱ. 추진 배경과 서비스 설계
add(slide(2, 'AI가 문턱을 없앰', head(2, '악성코드를 만드는 문턱, ', 'AI가 없앴습니다', tag('new', '추가 제안')) + vis(`<div class="split">
  <div class="col">
    <p class="lead2 rv d3">도구를 만들 줄 모르던 사람도 이제 <b>AI로 악성코드를 만듭니다.</b></p>
    <p class="evi rv d5"><span class="k">한국도</span>LLM으로 만들었을 가능성이 높은 백도어 ‘HelloDoor’가 군·공무원·방산 직원을 노렸어요.</p>
  </div>
  <div class="stat">
    <div class="big rv d3"><b data-to="1.4" data-dec="1">1.4</b><span>%</span></div>
    <div class="stat-r">
      <p class="cap rv d4">AI 관련 악성코드 샘플 2만 2천여 개 중<br><strong>알려진 조직과 연결된 비율</strong></p>
      <div class="bar fill"><i class="known"></i><i class="rest"></i></div>
      <div class="bl rv d5"><span class="k">알려진 조직 1.4%</span><span class="r">나머지는 대부분 신원 미상</span></div>
    </div>
  </div>
</div>`) + src('Arctic Wolf Labs, 2026.03.24 · 데일리시큐, 2026.05.14(카스퍼스키 분석) · 기획서 1.1')));

add(slide(2, '공식 배포 경로 사례', head(2, '공식 다운로드 경로에서도 ', '악성 파일이 배포될 수 있다', tag('real', '실제 사례')) + vis(col(
  fl(fi({ icon: IC.server, t: '공식 다운로드 서버', s: '회사·기관의 공식 경로', d: 'd3' }), fa('', 'd3'), fi({ cls: 'd', icon: IC.doc, t: '설치 파일', s: '정상 서명 · 안에 악성코드', d: 'd4' }), fa('d', 'd4'), fi({ icon: IC.users, t: '사용자 PC', s: '믿고 설치', d: 'd5' })),
  cards(2, [
    card({ cls: 'd', icon: IC.x, t: 'CCleaner 5.33 · 2017', b: '공식 다운로드 서버에서 정상 서명된 설치 파일로 배포', s: 'Cisco Talos, 2017.09.18', d: 'd5' }),
    card({ cls: 'd', icon: IC.x, t: '한국 · 2024', b: '건설 관련 협회 홈페이지의 설치 파일에 악성코드 → <b>약 3,000건 이상 설치</b>', s: '보안뉴스, 2024.02.20', d: 'd6' }),
  ]),
)) + src('Cisco Talos, 2017.09.18 · 보안뉴스, 2024.02.20 · 감염 대수는 원문에 없어 쓰지 않음')));

add(slide(2, '두 가지 문제', head(2, '배포 전 검사에서 ', '해결할 두 가지 문제') + vis(cards(2, [
  card({ cls: 'k', num: '1', t: '정적 검사만으로는 이후 동작을 알기 어렵다', b: '예: HONESTCUE — 실행 중에 Gemini API로 코드를 만들어 메모리에서 실행', s: 'Google 위협 인텔리전스(GTIG), 2026-02', d: 'd3' }),
  card({ cls: 'k', num: '2', t: '모든 파일을 정밀 검사하면 늦고 비싸다', b: '정적 분석은 파일당 <b>약 1초</b>, 동적 분석은 건당 <b>약 260초</b>(분석 200초 + 여유 60초)', s: '기획서 1.3(미니 프로젝트 실측 · CAPEv2 기본 설정)', d: 'd4' }),
])) + src('Google GTIG, 2026-02(기획서 1.2) · 최종 기획서 1.3')));

add(slide(2, '고객 맞춤 선별', head(2, '고객의 검사 수준과 비용에 맞춰 ', '선별한다', tag('chk', '설계 예시')) + vis(col(
  `<p class="lead2 rv d3">같은 교육기관의 두 운영 상황</p>`,
  cards(2, [
    card({ icon: IC.clock, t: '배포 일정·예산을 우선할 때', b: '위험도가 높은 파일부터 정밀 검사 — 대상을 <b>좁게</b>', d: 'd4' }),
    card({ icon: IC.search, t: '더 촘촘한 확인이 필요할 때', b: '정밀 검사 대상을 <b>넓게</b>', d: 'd5' }),
  ]),
  card({ cls: 'k', icon: IC.shield, t: '공통 원칙', b: '악성이 확인되면 <b>차단</b> · 필요한 검사를 마치지 못해 판단이 어려우면 <b>보류</b>', d: 'd6' }),
)) + src('최종 기획서 1.3·3장 · 발표 메모: 정적 = 실행하지 않고 내용 확인, 동적 = 격리 환경에서 열어 행동 관찰')));

const ARCHSRC = src('최종 기획서 4.1·10.1(그림 4-1, 2026-11-22) · 14절 #35', 'd2');
add(slide(2, '아키텍처 ① 업로드·정적', ahead(2, '시스템 전체 아키텍처 · ', '업로드부터 배포까지', '1/3') + ARCHSRC, 'data-arch="1" data-astep="0"'));
add(slide(2, '아키텍처 ② 정밀 검사 경로', ahead(2, '시스템 전체 아키텍처 · ', '업로드부터 배포까지', '2/3') + ARCHSRC, 'data-arch="2" data-astep="1"'));
add(slide(2, '아키텍처 ③ 판정·배포', ahead(2, '시스템 전체 아키텍처 · ', '업로드부터 배포까지', '3/3') + ARCHSRC, 'data-arch="3" data-astep="2"'));

add(slide(2, '기술 및 인프라', head(2, '', '기술 및 인프라 구성') + vis(col(
  `<div class="zones">
    <div class="zone2 rv d3"><div class="zh">${IC.globe}클라우드 · AWS</div>
      <div class="zi"><b>EC2</b><span>정적 분석 · 최종 판정 · 웹 화면</span></div>
      <div class="zi"><b>S3</b><span>incoming/ · public/ · quarantine/</span></div>
      <div class="zi"><b>SQS</b><span>정적 · 동적 · 결과 대기열</span></div></div>
    <div class="zlink rv d4"><span>나가는 연결만</span>${ARWL}<em>실습 PC가 먼저 연결</em></div>
    <div class="zone2 pc rv d5"><div class="zh">${IC.server}실습 PC</div>
      <div class="zi"><b>gateway</b><span>동적 대기열에서 가져가기</span></div>
      <div class="zi"><b>격리 VM</b><span>CAPEv2 · Windows 10 · 가짜 인터넷</span></div></div>
  </div>`,
  pts(['정적 분석은 저장소·대기열과 같은 <b>AWS</b>에 둬서 파일을 옮길 일이 없다', '파일 실행은 인터넷이 막힌 <b>격리 VM</b>에서만 한다'], 'd6'),
)) + src('최종 기획서 10.1(그림 10-1 자원 배치)')));

// Ⅲ. 정적 분석과 정밀 검사 대상 선별
add(slide(3, '실제 형식·알려진 악성', head(3, '파일의 실제 형식과 ', '알려진 악성을 확인한다') + vis(cards(2, [
  `<div class="card rv d3"><div class="ch"><span class="ci">⓪</span><div class="ct">형식 식별</div></div><div class="mini"><span class="ftk">보고서.docx</span>${ARW}<span class="ftk m">앞부분 %PDF-</span>${ARW}<span class="ftk w">실제로는 PDF</span></div><div class="cb">확장자가 아니라 파일 앞부분과 구조로 판단 · 다르면 <b>확장자 불일치</b>로 기록</div></div>`,
  `<div class="card rv d4"><div class="ch"><span class="ci">②</span><div class="ct">1차 확정 검사</div></div><div class="mini"><span class="ftk">파일 지문</span><span class="ftk">백신</span><span class="ftk">규칙</span></div><div class="cb">알려진 악성과 하나라도 확정 일치 → <b>즉시 차단</b> · 아니면 다음 검사로</div></div>`,
])) + src('최종 기획서 5.1·5.2 · 발표 메모: 파일 지문 = SHA-256, 백신 = ClamAV, 규칙 = YARA')));

add(slide(3, 'PE 분석', head(3, 'Windows 실행 파일(PE)은 ', '어떻게 분석하는가?') + vis(col(
  fl(fi({ icon: IC.layers, t: '특징 추출', s: '특성 2,568개', d: 'd3' }), fa('', 'd3'), fi({ cls: 'k', icon: IC.cpu, t: 'LightGBM 위험 점수', s: 'B 모델', d: 'd4' }), fa('', 'd4'), fi({ icon: IC.plus, t: '단서 더하기', s: 'A 닮음 · B 약한 탐지 · F 넓은 규칙', d: 'd5' }), fa('k', 'd5'), fi({ cls: 'k', icon: IC.filter, t: '정밀 검사 대상 선별', s: '합친 점수 ≥ 기준선', d: 'd6' })),
  `<p class="lead2 rv d7">단서는 결합층에서 점수에 더해진다 → 17·18장</p>`,
)) + src('최종 기획서 5.3 · 14절 #30(B 모델) · #31(단서 처리)')));

add(slide(3, 'Office 검사', head(3, 'Office 문서에서 ', '무엇을 검사할까?') + vis(col(
  cards(3, [
    card({ icon: IC.doc, t: 'Word', b: '문서를 열면 스스로 도는 <b>자동 실행 매크로</b>(M)', d: 'd3' }),
    card({ icon: IC.chart, t: 'Excel', b: '구형 매크로 시트 <b>XLM</b>(M) · 폼에 <b>숨긴 명령</b>(O)', d: 'd4' }),
    card({ icon: IC.play, t: 'PowerPoint', b: '안에 든 <b>삽입 파일</b>(E) · 실행 동작', d: 'd5' }),
  ]),
  card({ cls: 'd', icon: IC.x, t: '사례 · 공공기관(여성가족부·국세청) 사칭 메일', b: 'DOC 매크로 → VBS → PowerShell → HTA', s: '안랩 ASEC, 「2025년 11월 APT 그룹 동향 보고서」(2025.12.12) 중 2025년 9월 사례', d: 'd6' }),
)) + src('최종 기획서 5.3·5.4 · 안랩 ASEC 2025.12.12')));

add(slide(3, 'PDF 검사 범위', head(3, 'PDF는 ', '어디까지 검사하는가?') + vis(col(
  cards(3, [
    card({ icon: IC.play, t: '문서에 설정된 동작', b: '열 때 실행되는 OpenAction · JavaScript', d: 'd3' }),
    card({ icon: IC.globe, t: '링크 주소', b: '문서에 적힌 주소를 꺼내 기록까지', d: 'd4' }),
    card({ icon: IC.doc, t: '내부 첨부 파일', b: '꺼내서 처음부터 다시 검사', d: 'd5' }),
  ]),
  `<div class="scope rv d6"><span class="on">1단계 정적 분석 · 이번 필수</span><span>2단계 동적 실행 · 조건부</span><span class="off">3단계 QR·OCR·피싱 목적지 · 확장</span></div>`,
)) + src('최종 기획서 3장(PDF 단계별 지원) · 5.3·5.4')));

add(slide(3, '결합층 원리', head(3, '신호를 합쳐 ', '하나의 위험 점수로 — 결합층', tag('new', '추가')) + vis(col(
  `<p class="lead2 rv d3">켜진 신호마다 <b>무게를 더해</b> 하나의 점수로 만들고, <b>형식별 기준선</b>을 넘으면 정밀 검사로 보낸다.</p>`,
  `<div class="rules">
    <div class="rule rv d4"><span class="rf">PE</span><span class="rc"><i class="s" style="--c:var(--sg-score)">LightGBM 점수</i>+<i style="--c:var(--sg-a)">A</i><i style="--c:var(--sg-b)">B</i><i style="--c:var(--sg-f)">F</i></span><span class="rr">합친 점수가 기준선 이상</span></div>
    <div class="rule rv d5"><span class="rf">Office</span><span class="rc"><i style="--c:var(--sg-m)">M</i>또는<i style="--c:var(--sg-o)">O</i></span><span class="rr">하나라도 켜지면 (M ∪ O)</span></div>
    <div class="rule rv d6"><span class="rf">PDF</span><span class="rc"><i style="--c:var(--sg-m)">M</i><i style="--c:var(--sg-o)">O</i><i style="--c:var(--sg-s)">S</i></span><span class="rr">하나라도 켜지면</span></div>
  </div>`,
  cond(['같은 근거는 한 번만 센다', '무게는 데이터로 정한다', '속 파일도 꺼내 처음부터 다시 검사 · 묶음은 가장 나쁜 판정을 따른다'], 'd7'),
)) + src('최종 기획서 5.5·6장 · 14절 #31(형식별 단서 처리)')));

add(slide(3, '결합층 애니메이션', head(3, '어떤 신호가 켜지면 ', '정밀 검사로 가는가', tag('new', '추가 · → 4번')) + vis(COMB) + src('최종 기획서 5.2·5.5 · 14절 #30·#31·#35 · → 누를 때마다 ① 1차 확정 ② PE ③ Office ④ PDF'), 'data-steps="4" data-fx="comb"'));

add(slide(3, '동적 분석 대상 고르기', head(3, '어떤 파일을 ', '동적 분석 대상으로 고르는가?') + vis(col(
  dotPlot(),
  pts(['기준선은 <b>고객 정책</b>: 형식마다 정상 파일의 <b>2~5%</b>만 보내도록 정한다', '예: 시험 Excel 문서(d1_test.xlsm)가 기준선을 넘어 정밀 검사로 → 20장'], 'd5'),
)) + src('최종 기획서 1.3·5.5 · 14절 #35(시연 파일)')));

// Ⅳ. 동적 분석과 최종 판정
add(slide(4, '샌드박스 관찰', head(4, '샌드박스에서 ', '파일의 행동을 관찰한다') + vis(col(
  fl(fi({ icon: IC.server, t: 'CAPEv2에 제출', s: '실습 PC gateway', d: 'd3' }), fa('', 'd3'), fi({ cls: 'k', icon: IC.monitor, t: '격리된 Windows 10', s: '열거나 실행 · 가짜 인터넷', d: 'd4' }), fa('', 'd4'), fi({ icon: IC.eye, t: '행동 기록', s: '프로세스 · 파일 · 통신', d: 'd5' })),
  `<div class="card d rv d6"><div class="ch"><span class="ci">${IC.check}</span><div class="ct">확인한 예 · 2026-11-22 전 경로</div></div><div class="ptree"><span>EXCEL.EXE</span>${ARW}<span class="bad">cmd.exe</span><em>문서 프로그램이 실행기를 띄움 = 행동 규칙 R1 → 차단</em></div></div>`,
)) + src('최종 기획서 7.1·7.3 · 14절 #35')));

add(slide(4, '행동이 없을 때', head(4, '위험 행동이 기록되지 않으면 ', '어떻게 판단하는가?') + vis(col(
  cards(2, [
    card({ cls: 'p', num: '1', t: '다 실행·관찰했고 위험 행동이 없음', b: '정적 근거와 함께 판단 — <b>믿을 수 있는 결과만</b> 판정을 낮춘다', d: 'd3' }),
    card({ cls: 'w', num: '2', t: '실행 실패 · 관찰을 마치지 못함', b: '회피 흔적, 사람이 눌러야 하는 단계, 외부 내용을 못 봄 → <b>사유와 함께 보류</b>', d: 'd4' }),
  ]),
  cond(['믿을 수 있나? 실제로 실행됐나', '가상 환경 회피 흔적은 없나', '사람 동작이 필요 없나', '외부 내용까지 봤나'], 'd5'),
)) + src('최종 기획서 7.4·8.1(신뢰도 게이트)')));

add(slide(4, '배포·차단·보류 근거', head(4, '어떤 근거로 ', '배포·차단·보류를 결정하는가?') + vis(col(
  cards(3, [
    card({ cls: 'p', icon: IC.check, t: '배포', b: '필요한 검사를 마치고 기준 충족 → CLEAN 태그 → public/ → CDN', d: 'd3' }),
    card({ cls: 'd', icon: IC.x, t: '차단', b: '악성이 확인됨 — 1차 확정 · 동적 악성 행동 · 관리자 판단', d: 'd4' }),
    card({ cls: 'w', icon: IC.pause, t: '보류', b: '검사 실패·판단 근거 부족 → 관리자 확인 전까지 공개하지 않음', d: 'd5' }),
  ]),
  `<p class="lead2 rv d6"><b>점수만으로는 차단하지 않는다</b> — 차단은 확정 근거가 있을 때만</p>`,
)) + src('최종 기획서 4.2(핵심 원칙)·8.2·8.3')));

add(slide(4, '최종 판정 흐름도', head(4, '', '최종 판정 흐름도', tag('new', '추가')) + vis(FC) + src('최종 기획서 8.1~8.3 · 4.2 · 14절 #35(시연판)')));

// Ⅴ. 정적 분석 검증과 개선
add(slide(5, '데이터 학습 파이프라인', head(5, '간단한 ', '데이터 학습 파이프라인', tag('new', 'Ⅲ 앞에서 이동')) + vis(col(
  `<div class="fl pipe">${[
    fi({ icon: IC.bucket, t: '수집', s: '출처·약관 기록', d: 'd3' }), fa('', 'd3'),
    fi({ icon: IC.filter, t: '정리', s: '중복 제거 · 라벨 · 섞인 악성 빼기', d: 'd4' }), fa('', 'd4'),
    fi({ icon: IC.layers, t: '나누기', s: '학습 50 · 조정 25 · 평가 25', d: 'd5' }), fa('', 'd5'),
    fi({ cls: 'k', icon: IC.cpu, t: '학습 → 조정', s: 'PE 모델 · 문서 무게 · 기준선', d: 'd6' }), fa('', 'd6'),
    fi({ icon: IC.chart, t: '평가', s: '형식별 지표 기록', d: 'd7' }),
  ].join('')}</div>`,
  cards(3, [
    card({ t: 'PE', b: 'pemml · EMBER · RanDS(2023년까지 학습)', s: '평가: EMBER 2024 · RanDS 2024 · 최근 로컬', d: 'd6' }),
    card({ t: 'Office · 44,518개', b: '정상: Zenodo · GovDocs1 · 팀원 수집<br>악성: Zenodo · Malicious_Excel · MalwareBazaar', s: 'MalwareBazaar는 평가 전용', d: 'd7' }),
    card({ t: 'PDF · 26,552개', b: '정상: CLEAN9000 · GovDocs1 PDF<br>악성: PRE2011_PDF · VT_PDF', d: 'd8' }),
  ]),
)) + src('최종 기획서 9.1·9.2 · 14절 #30')));

add(slide(5, '정밀 검사 목표·지표', head2(5, '모든 파일을 정밀 검사하지 않고도', '위험 파일을 골라낼 수 있을까?') + vis(`<div class="split w5">
  <div class="col c">${DOTGRID}<p class="lead2 rv d4"><b>정상 100개 중 2~5개만</b><br>정밀 검사로 보낸다 (설계 목표)</p></div>
  <div class="col">${card({ icon: IC.coin, t: '정상 전송률', b: '정상 파일 중 정밀 검사로 보낸 비율 — <b>낮을수록</b> 비용이 적다', d: 'd5' })}${card({ cls: 'k', icon: IC.shield, t: '악성 선별률', b: '평가한 악성 중 정밀 검사 대상으로 표시된 비율 — <b>높을수록</b> 좋다', d: 'd6' })}</div>
</div>`) + src('최종 기획서 1.3·9.4')));

add(slide(5, 'PE 비교 1 · 모델', head(5, '', 'PE 정적 선별 성능 비교', '<span class="pgx">1/2 · 모델</span>') + vis(col(
  `<p class="lead2 rv d3">옛 모델 → <b>B 모델</b>(신종 데이터로 다시 학습)</p>`,
  `<div class="bas">${ba('악성 적발 · EMBER 2024 시험', '90.7', '99.2', '%', '높을수록 좋음', '', 'd4')}${ba('정상 전송 · EMBER 2024 정상', '28.4', '12.0', '%', '낮을수록 좋음', 'p', 'd5')}</div>`,
  cond(['문턱: RanDS 2024 정상 2% 지점(11/20 기준)', '최근 로컬 묶음 AUC 0.665 → 0.915'], 'd6'),
)) + src('최종 기획서 14절 #30')));

add(slide(5, 'PE 비교 2 · 문턱', head(5, '', 'PE 정적 선별 성능 비교', '<span class="pgx">2/2 · 문턱</span>') + vis(`<div class="split w9">
  ${scatter()}
  <div class="col">${pts(['운영 문턱을 <b>우리 정상 데이터</b>로 다시 맞춤(11/22)', '최근 로컬 정상 <b>5.6%</b> 보냄 · 최근 악성 <b>76.2%</b> 적발', '합친 점수로 재면 6.0% — 2~5% 원칙의 <b>예외로 기록</b>', '최근 악성의 약 24%는 놓침 — 모델 쪽 한계, 문턱 아래는 자동 통과를 끄고 사람이 확인'], 'd4')}</div>
</div>`) + src('최종 기획서 14절 #30·#34')));

add(slide(5, 'Office 1 · 선택', head(5, '', 'Office 규칙을 선택하고 개선한 이유', '<span class="pgx">1/2 · 선택</span>') + vis(cards(3, [
  card({ cls: 'w', icon: IC.x, t: '최신 정상 PPTX 0개', b: 'PowerPoint는 정상 전송률을 잴 수 없음', d: 'd3' }),
  card({ cls: 'w', icon: IC.layers, t: '출처 편중', b: '정상 문서가 일부 출처에 몰려 있음', d: 'd4' }),
  card({ cls: 'k', icon: IC.shield, t: '→ 규칙 기반', b: '징후 가족(M·O·E·X·S)에 데이터로 무게를 잰 규칙', d: 'd5' }),
])) + src('최종 기획서 5.4·5.5 · 14절 #25')));

add(slide(5, 'Office 2 · 개선', head(5, '', 'Office 규칙을 선택하고 개선한 이유', '<span class="pgx">2/2 · 개선</span>') + vis(`<div class="split w6">
  <div class="col">
    <div class="code rv d3"><span class="m">Module1</span>자동 실행 진입점 → <b>Main</b> 호출</div>
    <div class="code rv d4"><span class="m">Module2</span><b>Main</b> → 실행·쓰기</div>
    <p class="lead2 rv d5">같은 모듈만 보면 놓친다 → <b>호출을 따라가서</b> 잡는다</p>
  </div>
  <div class="col">${ba('악성 적발', '81.10', '94.01', '%', '', '', 'd5')}${ba('정상 전송', '2.62', '2.08', '%', '', 'p', 'd6')}${cond(['학습 구간 · 판정한 것만 분모', 'M ∪ O 기준'], 'd7')}</div>
</div>`) + src('최종 기획서 5.4·5.5 · 14절 #29')));

add(slide(5, 'Office 결과', head(5, 'Office 정적 선별 결과와 ', '지표 해석') + vis(`<div class="split w6">
  <div class="col">${kpi('1.37', '%', '정상 전송률', '평가 구간 정상 1,242개 중 17개', 'd3')}${kpi('85.73', '%', '악성 선별률', '평가 구간 악성 6,390개 중 5,478개', 'd4')}</div>
  <div class="col">${pts(['학습에 쓰지 않은 <b>평가 구간</b> · 전체 행 기준', '정상 PowerPoint 표본이 없어 PPT는 따로 봐야 함', '다른 출처(MalwareBazaar 평가 전용)에서는 <b>50.7%</b> — 출처에 따라 달라짐'], 'd5')}</div>
</div>`) + src('최종 기획서 5.5')));

add(slide(5, 'PDF 결과', head(5, 'PDF 정적 선별 결과와 ', '평가 표본') + vis(`<div class="split w6">
  <div class="col">${kpi('4.14', '%', '정상 전송률', '평가 구간', 'd3')}${kpi('99.1', '%', '악성 선별률', '평가 구간', 'd4')}</div>
  <div class="col">${pts(['악성 표본이 <b>2010~2017년</b> 자료 → 최신 수법은 따로 확인 필요', 'PDF 동적 실행은 이번 범위 밖 → 정밀 검사 대상은 지금 <b>보류</b>'], 'd5')}</div>
</div>`) + src('최종 기획서 9.4·5.5 · 14절 #35')));

// Ⅵ. 정적 분석 시연
add(slide(6, '시연 · 두 파일', head(6, '두 시험 파일을 ', '정적 분석한다', tag('chk', '확인 필요 · 11/22 #35 시연과 다름')) + vis(col(
  `<div class="fl pipe">` + [
    `<div class="fi rv d3"><span class="ftk big">시험1.pdf</span><span class="ftk big w">시험2.docx</span><span>내용이 다른 무해한 PDF 두 개</span></div>`, fa('', 'd3'),
    fi({ icon: IC.search, t: '형식 식별 ⓪', d: 'd4' }), fa('', 'd4'),
    fi({ icon: IC.shield, t: '1차 확정 ②', d: 'd5' }), fa('', 'd5'),
    fi({ icon: IC.layers, t: '징후 ④ · 결합층 ⑤', d: 'd6' }), fa('', 'd6'),
    fi({ cls: 'k', icon: IC.scale, t: '판정 · 근거 기록', d: 'd7' }),
  ].join('') + `</div>`,
  `<p class="lead2 rv d7">#35 시연 묶음: d1_test.docm(정적 차단) · d1_test.xlsm(동적 R1 → 차단) — 어느 쪽으로 할지 팀 확인</p>`,
)) + src('팀원 목차 24장 · 최종 기획서 14절 #35')));

add(slide(6, '시연 · 근거 비교', head(6, '두 파일의 ', '검사 근거를 비교한다', tag('chk', '확인 필요 · 시연 결과로 채움')) + vis(`<table class="tbl rv d3">
  <thead><tr><th></th><th>시험1.pdf</th><th>시험2.docx</th></tr></thead>
  <tbody>
    <tr><td class="h">실제 형식</td><td>PDF</td><td>PDF</td></tr>
    <tr><td class="h">확장자 불일치</td><td>없음</td><td class="hi">있음 (.docx ↔ PDF)</td></tr>
    <tr><td class="h">판정 · 근거</td><td>(시연 결과로 채움)</td><td>(시연 결과로 채움)</td></tr>
  </tbody>
</table>`) + src('팀원 목차 3절(시연 예비 점검: 둘 다 PDF로 식별, .docx만 불일치, 당시 둘 다 보류) · 미리 확보한 결과는 ‘사전 분석 결과’로 표시')));

// Ⅶ. 서비스 기대 효과와 운영 한계
add(slide(7, '기대 효과', head(7, '', '서비스 기대 효과') + vis(cards(2, [
  card({ cls: 'k', icon: IC.shield, t: '배포 위험 감소', b: '공개 전에 파일을 검사해 악성 파일 배포를 막고, 판단이 어려운 파일은 보류', d: 'd3' }),
  card({ cls: 'p', icon: IC.gear, t: '고객 맞춤 검사', b: '고객의 검사 수준과 비용에 맞춰 위험도가 높은 파일에 정밀 검사를 집중', d: 'd4' }),
])) + src('최종 기획서 11.3 · 효과는 실제 고객 데이터로 다시 확인 필요')));

add(slide(7, '한계와 향후 개선', head(7, '', '프로젝트의 한계와 향후 개선') + vis(`<table class="tbl rv d3">
  <thead><tr><th>영역</th><th>이번 프로젝트의 한계</th><th>향후 개선</th></tr></thead>
  <tbody>
    <tr><td class="h">검증 데이터의 대표성</td><td>고객별 정상 파일·최신 공격 수법의 성능은 확인하기 어려움</td><td>고객 환경을 대표하는 정상 파일과 최신 표본으로 다시 검증</td></tr>
    <tr><td class="h">정밀 검사의 처리 용량</td><td>요청이 몰리면 배포가 늦어질 수 있음</td><td>실제 요청량으로 대기 시간·비용을 재고 용량·정책 조정</td></tr>
    <tr><td class="h">격리 환경의 관찰 범위</td><td>외부 서버가 주는 내용은 확인하기 어려움</td><td>주소 평판 등 다른 근거와 함께 보고, 부족하면 보류</td></tr>
  </tbody>
</table>`) + src('팀원 목차 27장 화면 문구 · 발표 메모: PE 문턱은 11/22에 최근 로컬 정상 5%로 다시 맞춤(5.6~6.0% 보냄, 최근 악성 76.2%)')));

add(slide(7, '결론 및 Q&A', head(7, '', '결론 및 Q&A') + vis(`<div class="endc">
  <p class="end1 rv d3">고객의 검사 수준에 맞춰 위험 파일부터 확인하고,</p>
  <p class="end2 rv d4">검사를 통과한 파일만 배포합니다</p>
  <span class="qa rv d6">질의응답</span>
</div>`)));

// ---------- 추가 CSS (v01 전용 부품) ----------
const EXTRA = `
@font-face { font-family: 'ArrowFix'; src: local('Segoe UI Symbol'), local('Segoe UI'), local('Malgun Gothic'), local('Apple SD Gothic Neo'), local('Arial'); unicode-range: U+2190-21FF, U+2794, U+222A; }
:root { --font: 'ArrowFix', 'SUIT Variable', 'SUIT', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
.fl.pipe .fi { width: 232px; }
.fl.pipe .fa { width: 56px; }
.col { display: flex; flex-direction: column; gap: 34px; width: 100%; }
.col.c { align-items: center; }
.split.w5 { grid-template-columns: 520px 1fr; }
.split.w6 { grid-template-columns: 700px 1fr; }
.split.w9 { grid-template-columns: 900px 1fr; }
.comb .dic { position: absolute; left: 0; right: 0; top: 32px; display: grid; place-items: center; color: var(--accent); }
.comb .dic svg { width: 64px; height: 64px; fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.zones { display: grid; grid-template-columns: 1fr 200px 1fr; align-items: center; gap: 24px; width: 100%; }
.zone2 { display: flex; flex-direction: column; gap: 14px; padding: 26px 30px; border-radius: 24px; border: 3px solid var(--accent); background: var(--soft2); }
.zone2.pc { border-style: dashed; border-color: var(--accent2); }
.zone2 .zh { display: flex; align-items: center; gap: 12px; font-size: 32px; font-weight: 800; color: var(--accent); }
.zone2 .zh svg { width: 36px; height: 36px; fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.zone2 .zi { display: flex; align-items: baseline; gap: 16px; padding: 12px 18px; border-radius: 14px; background: #FFFFFF; }
.zone2 .zi b { flex: none; width: 120px; font-size: 30px; font-weight: 800; color: var(--ink); }
.zone2 .zi span { font-size: 28px; color: var(--ink2); }
.zlink { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 26px; font-weight: 800; color: var(--accent2); text-align: center; }
.zlink span { white-space: nowrap; }
.zlink em { font-style: normal; font-size: 22px; font-weight: 600; color: var(--ink2); white-space: nowrap; }
.zlink .arw { width: 120px; height: 30px; margin: 0; vertical-align: 0; }
.mini { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 6px 0 4px; }
.mini .arw { width: 34px; height: 18px; color: var(--arrow); }
.ftk { display: inline-flex; align-items: center; height: 52px; padding: 0 18px; border-radius: 12px; border: 2px solid var(--line2); background: #FFFFFF; font-size: 28px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.ftk.m { font-family: Consolas, 'Courier New', monospace; font-size: 26px; color: var(--ink2); }
.ftk.w { border-color: var(--warn); color: var(--warn); background: var(--warn-soft); }
.ftk.big { height: 60px; font-size: 30px; }
.fi .ftk { margin-bottom: 4px; }
.scope { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.scope span { padding: 18px 22px; border-radius: 16px; border: 2px solid var(--line2); font-size: 28px; font-weight: 700; color: var(--ink2); text-align: center; }
.scope span.on { background: var(--accent); border-color: var(--accent); color: #FFFFFF; }
.scope span.off { border-style: dashed; color: var(--muted); }
.rules { display: flex; flex-direction: column; gap: 18px; }
.rule { display: grid; grid-template-columns: 180px 1fr 460px; align-items: center; gap: 24px; padding: 18px 28px; border-radius: 20px; background: var(--soft2); border: 2px solid var(--line); }
.rule .rf { font-size: 32px; font-weight: 800; color: var(--ink); }
.rule .rc { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 700; color: var(--muted); }
.rule .rc i { font-style: normal; display: inline-grid; place-items: center; min-width: 56px; height: 56px; padding: 0 14px; border-radius: 999px; background: var(--c); color: #FFFFFF; font-size: 26px; font-weight: 800; }
.rule .rc i.s { border-radius: 14px; }
.rule .rr { font-size: 28px; font-weight: 800; color: var(--accent); }
.dplot .dn { fill: #B8C4D6; } .dplot .dm { fill: var(--danger); }
.dplot .zone { fill: var(--soft); } .dplot .zt { font-size: 28px; font-weight: 800; fill: var(--accent); }
.dplot .ax { stroke: var(--ink2); stroke-width: 3; } .dplot .axl, .dplot .lg { font-size: 24px; font-weight: 700; fill: var(--ink2); }
.dplot .alt { stroke: var(--arrow); stroke-width: 3; stroke-dasharray: 8 8; }
.dplot .thr2 { stroke: var(--accent); stroke-width: 6; }
.dplot .tl { font-size: 28px; font-weight: 800; fill: var(--accent); } .dplot .al { font-size: 24px; font-weight: 700; fill: var(--muted); }
.ptree { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.ptree span { display: inline-flex; align-items: center; height: 56px; padding: 0 20px; border-radius: 12px; border: 2px solid var(--ink2); background: #FFFFFF; font-family: Consolas, 'Courier New', monospace; font-size: 28px; font-weight: 700; color: var(--ink); }
.ptree span.bad { border-color: var(--danger); color: var(--danger); }
.ptree .arw { width: 44px; height: 20px; color: var(--danger); }
.ptree em { font-style: normal; font-size: 28px; font-weight: 700; color: var(--danger); }
.fc { position: relative; width: 1600px; height: 600px; flex: none; }
.fc .fcl .fe { fill: none; stroke: var(--arrow); stroke-width: 4; marker-end: url(#f-n); }
.fc .fcl .fe.d { stroke: var(--danger); marker-end: url(#f-d); }
.fc .fcl .fe.w { stroke: var(--warn); marker-end: url(#f-w); }
.fc .fcl .fe.p { stroke: var(--pass); marker-end: url(#f-p); }
.fc .fn { position: absolute; left: calc(var(--cx) * 1px); top: calc(var(--cy) * 1px); translate: -50% -50%; min-width: 320px; height: 64px; display: grid; place-items: center; padding: 0 22px; border-radius: 16px; border: 3px solid var(--line2); background: #FFFFFF; font-size: 28px; font-weight: 800; color: var(--ink); white-space: nowrap; }
.fc .fn.k { border-color: var(--accent); color: var(--accent); background: var(--soft2); }
.fc .fd { position: absolute; left: calc(var(--cx) * 1px); top: calc(var(--cy) * 1px); translate: -50% -50%; width: 380px; height: 96px; display: grid; place-items: center; background: var(--soft); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); font-size: 28px; font-weight: 800; color: var(--accent); white-space: nowrap; }
.fc .fy { position: absolute; left: calc(var(--x) * 1px); top: calc(var(--y) * 1px); font-size: 24px; font-weight: 700; color: var(--muted); white-space: nowrap; }
.fc .fy.c { translate: -50% 0; }
.fc .fo { position: absolute; left: calc(var(--cx) * 1px); top: calc(var(--cy) * 1px); translate: -50% -50%; width: 150px; height: 58px; display: grid; place-items: center; border-radius: 999px; font-size: 30px; font-weight: 800; border: 3px solid; }
.fc .fo.sm { width: 140px; height: 50px; font-size: 28px; }
.fc .fo.d { color: var(--danger); border-color: var(--danger); background: var(--danger-soft); }
.fc .fo.w { color: var(--warn); border-color: var(--warn); background: var(--warn-soft); }
.fc .fo.p { color: var(--pass); border-color: var(--pass); background: var(--pass-soft); }
.fc .fr { position: absolute; left: calc(var(--x) * 1px); top: calc(var(--y) * 1px); translate: 0 -50%; font-size: 26px; font-weight: 600; color: var(--ink2); white-space: nowrap; }
.fc .fnote { position: absolute; left: 0; top: 90px; width: 330px; display: flex; flex-direction: column; gap: 12px; padding: 24px 26px; border-radius: 20px; background: var(--soft2); border: 2px solid var(--line); }
.fc .fnote b { font-size: 28px; font-weight: 800; color: var(--accent); }
.fc .fnote span { font-size: 28px; font-weight: 700; color: var(--ink); line-height: 1.4; }
.fc .fnote em { font-style: normal; font-size: 26px; font-weight: 700; color: var(--warn); line-height: 1.45; padding-top: 10px; border-top: 2px dashed var(--line2); }
.dgrid { display: grid; grid-template-columns: repeat(10, 30px); gap: 12px; }
.dgrid i { width: 30px; height: 30px; border-radius: 50%; background: #C9D3E2; }
.dgrid i.mid { background: color-mix(in srgb, var(--accent2) 40%, #FFFFFF); }
.dgrid i.on { background: var(--accent); box-shadow: 0 0 0 5px rgba(11, 58, 143, .18); }
.bas { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.sct .band { fill: var(--pass-soft); } .sct .bt2 { font-size: 22px; font-weight: 800; fill: var(--pass); }
.sct .ax { stroke: var(--ink2); stroke-width: 3; } .sct .tk { font-size: 22px; font-weight: 600; fill: var(--muted); }
.sct .axl { font-size: 24px; font-weight: 700; fill: var(--ink2); }
.sct .pn { fill: #B8C4D6; } .sct .pk { fill: var(--accent); }
.sct .pl2 { font-size: 26px; font-weight: 700; fill: var(--ink2); } .sct .plk { font-size: 28px; font-weight: 800; fill: var(--accent); }
.code { display: flex; align-items: center; gap: 18px; padding: 22px 26px; border-radius: 18px; background: #0F1A2E; color: #E3E8F0; font-size: 28px; font-weight: 600; }
.code .m { flex: none; padding: 6px 14px; border-radius: 10px; background: rgba(255, 255, 255, .12); font-family: Consolas, 'Courier New', monospace; font-size: 26px; color: #9EC1FF; }
.code b { color: #FFD38A; font-weight: 800; }
.endc { display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; }
.end1 { font-size: 56px; font-weight: 500; color: var(--hl1); letter-spacing: -0.03em; }
.end2 { font-size: 64px; font-weight: 800; color: var(--accent); letter-spacing: -0.04em; }
.qa { margin-top: 40px; padding: 14px 40px; border-radius: 999px; background: var(--accent); color: #FFFFFF; font-size: 36px; font-weight: 800; }
`;

const FS_ICON = '<svg class="en" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg><svg class="ex" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
const RANGE_JS = `
(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  document.querySelectorAll('[data-range]').forEach((el) => {
    const c = el.dataset.range;
    const idx = slides.map((s, i) => (s.dataset.ch === c ? i + 1 : 0)).filter(Boolean);
    if (idx.length) el.textContent = (idx[0] === idx[idx.length - 1] ? idx[0] : idx[0] + '~' + idx[idx.length - 1]) + '장';
  });
})();`;

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>발표자료 v01 · AI 기반 업로드 파일 악성코드 사전 탐지·차단 시스템</title>
<!-- 글꼴: SUIT (SIL OFL). 인터넷이 없으면 맑은 고딕으로 보입니다. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
${read('base.css')}
${read('common.css')}
${read('v01.css')}
${EXTRA}
</style>
</head>
<body>
<div class="deck-viewport">
<main class="deck-stage" id="stage">

${SLIDES.join('\n\n')}

${ARCH}
<header class="chrome topbar"><span class="brand"><i></i>업로드 파일 악성코드 사전 탐지·차단</span><span class="right"><span class="meta">최종 발표 · <b>v01 초안</b></span><button class="tb fs" id="fsBtn" aria-label="전체 화면" title="전체 화면 (F)">${FS_ICON}</button></span></header>
<nav class="chrome rail" aria-label="대목차 이동"><!-- 대목차 탭은 스크립트가 장의 data-ch로 만든다 --></nav>
<footer class="chrome foot"><span class="pg"><b data-cur>01</b> / <span data-total>${String(SLIDES.length).padStart(2, '0')}</span><span class="lab" data-lab>표지</span></span><span class="nav"><button class="tb" data-step="-1" aria-label="이전">←</button><button class="tb" data-step="1" aria-label="다음">→</button></span></footer>
<div class="chrome prog"><i></i></div>
${ASTEPS}
</main>
</div>
<nav class="deck-controls" id="ctrl" aria-label="슬라이드 이동"><button id="prev" aria-label="이전">◀</button><span id="counter">1 / ${SLIDES.length}</span><button id="next" aria-label="다음">▶</button></nav>
<script>
${RANGE_JS}
${read('v01client.js')}
</script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, html, 'utf8');
console.log('wrote', OUT_FILE, '· 장 수', SLIDES.length);
