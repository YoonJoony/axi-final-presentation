// 발표 HTML 생성기 (A1 · 12장). 실행: node build.mjs [출력 파일 경로]
// 출력 경로를 안 주면 이 파일 옆에 a1.html 을 만든다.
// 처음에는 컨셉 A 변형 3개(a1·a2·a3)를 만들던 스크립트라 a2·a3 흔적(CHROME.a2·a3, TITLES)이 남아 있지만, 지금은 a1만 만든다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = process.argv[2] ? path.resolve(process.argv[2]) : path.join(HERE, 'a1.html');
const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8');
const BASE = read('base.css');
const COMMON = read('common.css');
const CLIENT = read('client.js');

// ---------- 아이콘 (선 그림) ----------
const I = {
  doc: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 5h15l10 10v26a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z"/><path d="M28 5v10h10"/><path d="M17 25h14M17 32h14M17 39h8"/></svg>',
  store: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="11" rx="15" ry="6"/><path d="M9 11v26c0 3.3 6.7 6 15 6s15-2.7 15-6V11"/><path d="M9 24c0 3.3 6.7 6 15 6s15-2.7 15-6"/></svg>',
  cdn: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M6 24h36"/><path d="M24 6c5 5 7.5 11 7.5 18S29 37 24 42c-5-5-7.5-11-7.5-18S19 11 24 6z"/></svg>',
  user: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="16" r="8"/><path d="M9 42c0-8.5 6.7-14 15-14s15 5.5 15 14"/></svg>',
  shield: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z"/><path d="M17 24l5 5 10-11"/></svg>',
};
// SUIT의 "→" 글자는 ">"처럼 보여서 화살표는 그림으로 넣는다
const ARW = '<svg class="arw" viewBox="0 0 64 24" role="img" aria-label="에서"><path d="M3 12h54M45 3l12 9-12 9"/></svg>';
const users = (n) => Array.from({ length: n }, (_, k) => `<span class="u u${k + 1}">${I.user}</span>`).join('');

// ---------- 그림 ----------
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

const DOCART = `<svg class="docart" viewBox="0 0 520 600" role="img" aria-label="재현 그림: AI 투자전략 자료처럼 꾸민 미끼 문서">
  <rect class="pg" x="10" y="10" width="500" height="580" rx="18"/>
  <path class="hd" d="M10 28a18 18 0 0 1 18-18h464a18 18 0 0 1 18 18v124H10z"/>
  <text class="t2" x="44" y="64">INVESTMENT INSIGHT</text>
  <text class="t1" x="44" y="122">AI 투자전략 리포트</text>
  <rect class="ln" x="44" y="190" width="300" height="16" rx="8"/>
  <rect class="ln" x="44" y="222" width="420" height="16" rx="8"/>
  <rect class="ln" x="44" y="254" width="380" height="16" rx="8"/>
  <rect class="cbg" x="44" y="296" width="432" height="150" rx="12"/>
  <rect class="br" x="78" y="392" width="40" height="38" rx="6"/>
  <rect class="br" x="142" y="368" width="40" height="62" rx="6"/>
  <rect class="br" x="206" y="380" width="40" height="50" rx="6"/>
  <rect class="br b2" x="270" y="340" width="40" height="90" rx="6"/>
  <rect class="br b2" x="334" y="318" width="40" height="112" rx="6"/>
  <rect class="br b2" x="398" y="328" width="40" height="102" rx="6"/>
  <rect class="ln" x="44" y="478" width="410" height="16" rx="8"/>
  <rect class="ln" x="44" y="510" width="350" height="16" rx="8"/>
  <rect class="ln" x="44" y="542" width="260" height="16" rx="8"/>
  <g class="pop"><g class="stamp" transform="rotate(-8 300 486)"><rect x="132" y="440" width="336" height="92" rx="14"/><text x="300" y="503" text-anchor="middle">AI 생성 정황</text></g></g>
</svg>`;

// ---------- 장 내용 (세 변형 공통) ----------
const SRC_A = '지니언스, “Kimsuky Integrates AI into Attack Operations”, 2026.08.10';
const eyebrow = (n, en, tag = '') => `<div class="eyebrow rv d1"><span class="badge">${n}</span><span class="en">${en}</span>${tag}</div>`;
const hl = (l1, l2, tag = 'h2') => `<${tag} class="hl rv d2"><span class="l1">${l1}</span><span class="l2">${l2}</span></${tag}>`;
const REAL = '<span class="tag real">실제 사례</span>';
const ASSUME = '<span class="tag assume">가정</span>';

const SLIDES = [
  // 1. 표지
  `<section class="slide cover" data-label="표지" aria-label="표지">
  <div class="txt">
    <p class="kick rv d1"><i></i>클라우드 보안 AI 부트캠프 · 최종 프로젝트</p>
    ${hl('업로드 파일 악성코드', '사전 탐지·차단 시스템', 'h1')}
    <p class="lead rv d3">올라온 파일을 배포 전에 검사하고, 통과한 파일만 내보냅니다.</p>
    <div class="team rv d5"><b>OOO · OOO · OOO · OOO · OOO</b><span>과제 제공 · 스피디 · 2026. 11.</span></div>
  </div>
  <div class="vis"><div class="art blur">${FILEART}</div></div>
</section>`,
  // 2. 배경
  `<section class="slide lay-split s2" data-label="배경" aria-label="배경">
  <div class="txt">
    ${eyebrow('02', 'WHY NOW')}
    ${hl('악성코드를 만드는 문턱,', 'AI가 없앴습니다')}
    <p class="lead rv d3">도구를 만들 줄 모르던 사람도 이제 AI로 악성코드를 만듭니다.</p>
    <p class="evi rv d6"><span class="k">한국도</span>LLM으로 만들었을 가능성이 높은 백도어 ‘HelloDoor’가 군·공무원·방산 직원을 노렸어요.</p>
  </div>
  <div class="vis">
    <div class="stat">
      <div class="big rv d3"><b data-to="1.4" data-dec="1">1.4</b><span>%</span></div>
      <div class="stat-r">
        <p class="cap rv d4">AI 관련 악성코드 샘플 2만 2천여 개 중<br><strong>알려진 조직과 연결된 비율</strong></p>
        <div class="bar fill"><i class="known"></i><i class="rest"></i></div>
        <div class="bl rv d5"><span class="k">알려진 조직 1.4%</span><span class="r">나머지는 대부분 신원 미상</span></div>
      </div>
    </div>
  </div>
  <p class="src rv d6">출처 · Arctic Wolf Labs, 2026.03.24 · 데일리시큐, 2026.05.14 (카스퍼스키 분석)</p>
</section>`,
  // 3. 흐름 1 (실제)
  `<section class="slide lay-split chain s3" data-label="만든다" data-story="0" aria-label="흐름 1: AI가 미끼 문서를 만든다">
  <div class="txt">
    ${eyebrow('03', 'STEP 1', REAL)}
    ${hl('AI가 금융 미끼 문서를', '그럴듯하게 만듭니다')}
    <p class="lead rv d3">해킹 조직 김수키의 미끼 문서, 생성형 AI로 만든 정황이 드러났어요.</p>
  </div>
  <div class="vis"><figure class="docfig"><div class="docblur blur">${DOCART}</div><figcaption class="cap2 rv d6">국내 핀테크의 AI 투자전략 자료를 흉내 낸 문서 · 재현 그림</figcaption></figure></div>
  <p class="src rv d6">출처 · ${SRC_A}</p>
</section>`,
  // 4. 흐름 2 (가정)
  `<section class="slide lay-wide chain s4" data-label="퍼진다" data-story="1" aria-label="흐름 2: 가정 - 저장소와 CDN으로 퍼진다면">
  <div class="txt">
    ${eyebrow('04', 'STEP 2 · WHAT IF', ASSUME)}
    ${hl('그 문서가 저장소에 올라와', 'CDN으로 퍼진다면?')}
    <p class="lead rv d3">고객사 저장소에 올라온 파일은 CDN이 그대로 모두에게 나눠 줍니다.</p>
    <p class="evi rv d7"><span class="k">실제로 있었던 일</span>2024년, 한 건설 관련 협회 홈페이지의 설치 파일에 악성코드가 숨어 <strong>약 3,000건 이상</strong> 설치됐어요.</p>
  </div>
  <div class="vis">
    <div class="flow assume rv d3">
      <div class="node bad"><span class="ic">${I.doc}</span><b>미끼 문서</b></div>
      <i class="arr dash fill d4"></i>
      <div class="node"><span class="ic">${I.store}</span><b>고객사 저장소</b></div>
      <i class="arr dash fill d5"></i>
      <div class="node"><span class="ic">${I.cdn}</span><b>CDN</b></div>
      <i class="arr dash fill d6"></i>
      <div class="node bad"><span class="users">${users(5)}</span><b>수많은 사용자</b></div>
    </div>
  </div>
  <p class="src rv d7">가정 시나리오 · 근거 사례 출처: 보안뉴스, 2024.02.20</p>
</section>`,
  // 5. 흐름 3 (실제)
  `<section class="slide lay-split chain s5" data-label="깔린다" data-story="2" aria-label="흐름 3: 열면 원격 조종 악성코드가 깔린다">
  <div class="txt">
    ${eyebrow('05', 'STEP 3', REAL)}
    ${hl('받아서 여는 순간,', '원격 조종이 시작됩니다')}
    <p class="lead rv d3">압축 파일 속 바로가기 하나가 나머지를 몰래 내려받아요.</p>
  </div>
  <div class="vis">
    <ol class="steps">
      <li class="rv d3"><span class="no">1</span><div><b>압축 파일 속 바로가기(LNK)를 엽니다</b></div></li>
      <li class="rv d4"><span class="no">2</span><div><b>GitHub에서 PDF와 PowerShell 스크립트를 몰래 받습니다</b></div></li>
      <li class="rv d5 hot"><span class="no">3</span><div><b>원격 조종 악성코드 AsyncRAT이 깔립니다</b><em>공격자가 PC를 원격으로 조종할 수 있어요</em></div></li>
    </ol>
  </div>
  <p class="src rv d6">출처 · ${SRC_A}</p>
</section>`,
  // 6. 우리의 대응
  `<section class="slide lay-wide s6" data-label="끊는다" aria-label="우리는 퍼지기 전에 끊는다">
  <div class="txt">
    ${eyebrow('06', 'OUR ANSWER')}
    ${hl('문서가 퍼지기 전에,', '우리가 여기서 끊습니다')}
    <p class="lead rv d3">업로드 직후 검사하고, 통과한 파일만 배포합니다.</p>
  </div>
  <div class="vis">
    <div class="flow">
      <div class="node bad rv d3"><span class="ic">${I.doc}</span><b>업로드된 문서</b></div>
      <i class="arr fill d4"></i>
      <div class="gate rv d4">
        <p class="gt">${I.shield}업로드 직후 검사</p>
        <p class="row"><span class="n">1</span>정적 분석<span class="m">· 모든 파일</span></p>
        <p class="row"><span class="n">2</span>동적 분석<span class="m">· 의심 파일만</span></p>
        <p class="blk">악성은 여기서 차단</p>
      </div>
      <i class="arr ok fill d6"><span class="al">통과한 파일만</span></i>
      <div class="node ok rv d6"><span class="ic">${I.cdn}</span><b>CDN 배포</b></div>
    </div>
  </div>
  <p class="src rv d7">우리 설계 · 최종 기획서 4장 전체 아키텍처</p>
</section>`,
  // 7. 결과
  `<section class="slide lay-split s7" data-label="결과" aria-label="결과: 놓친 악성 29개에서 18개로">
  <div class="txt">
    ${eyebrow('07', 'RESULT')}
    ${hl('같은 검사 비용에서', `놓친 악성 29${ARW}18개`)}
    <p class="lead rv d3">정상 파일의 2%만 정밀 검사로 보내는 같은 조건에서 비교했어요.</p>
  </div>
  <div class="vis">
    <div class="chartwrap">
      <div class="chartbox rv d3"><canvas data-chart role="img" aria-label="놓친 악성코드: 모델 하나(LightGBM)만 29개, 결합층 18개"></canvas></div>
      <div class="delta rv d5"><p class="dv"><b data-to="-11">−11</b><small>개</small></p><p class="dc">놓친 악성코드</p></div>
    </div>
  </div>
  <p class="src rv d6">출처 · 팀 미니 프로젝트 실측 (시험 구간 악성 1,450개, 2026.11.05) · 최종 기획서 2장·9.4</p>
</section>`,
];
const pad = (n) => String(n).padStart(2, '0');

// ---------- A1 전용: 6장 뒤 아키텍처 4장 + 전체 흐름도 1장 ----------
const AI = {
  upload: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 31V9"/><path d="M15 18l9-9 9 9"/><path d="M8 30v8a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3v-8"/></svg>',
  bucket: I.store,
  queue: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="32" height="8" rx="3"/><rect x="8" y="20" width="32" height="8" rx="3"/><rect x="8" y="32" width="32" height="8" rx="3"/></svg>',
  search: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="21" r="12"/><path d="M30 30l10 10"/></svg>',
  monitor: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="7" width="38" height="26" rx="3"/><path d="M17 41h14M24 33v8"/><path d="M21 14l8 6-8 6z"/></svg>',
  scale: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7v34M15 41h18M9 13h30"/><path d="M9 13L4 25a5 5 0 0 0 10 0z"/><path d="M39 13l-5 12a5 5 0 0 0 10 0z"/></svg>',
  lock: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="21" width="28" height="21" rx="3"/><path d="M16 21v-6a8 8 0 0 1 16 0v6"/></svg>',
  bucketOk: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="11" rx="15" ry="6"/><path d="M9 11v26c0 3.3 6.7 6 15 6s15-2.7 15-6V11"/><path d="M17 27l5 5 9-10"/></svg>',
  globe: I.cdn,
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  loop: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M38 20a15 15 0 1 0 1 9"/><path d="M40 9v11H29"/></svg>',
};
const AN = (lv, cx, top, icon, title, sub, cls = '') => `<div class="an ${cls}" data-lv="${lv}" style="--cx:${cx};top:${top}px"><span class="ai">${icon}</span><span class="at"><b>${title}</b><span>${sub}</span></span></div>`;
const CHIP = (lv, cx, y, kind, text) => `<span class="ach ${kind}" data-lv="${lv}" style="--cx:${cx};top:${y - 29}px">${text}</span>`;
const LB = (lv, x, top, html, cls = '') => `<span class="al2 ${cls}" data-lv="${lv}" style="--x:${x};top:${top}px">${html}</span>`;
const SIG = (t) => `<span class="sig">${AI.bolt}${t}</span>`;
const LN = (lv, d, cls = 'ln') => `<path data-lv="${lv}" class="${cls}" d="${d}"/>`;
const MK = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" orient="auto"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`;

// 한 장의 긴 그림(가로 1600). 장마다 카메라 위치(위에서부터 px)만 바꾼다.
// 가운데 줄 = 분석 단계, 왼쪽 줄 = 막는 길(차단·보류), 오른쪽 줄 = 내보내는 길(통과)
const ARCH = `<div class="archview" id="archview" aria-hidden="true"><div class="atrack" id="atrack" data-offs="0,524,1064,1820">
<svg class="alines" width="1600" height="2700" viewBox="0 0 1600 2700">
  <defs>${MK('m-n', '#9AA8BD')}${MK('m-a', '#0B3A8F')}${MK('m-d', '#D2384E')}${MK('m-w', '#B4650A')}${MK('m-p', '#0E8C7E')}</defs>
  ${LN('2 3 4', 'M150 780 V1960', 'lane d')}
  ${LN('2 3 4', 'M1450 980 V1960', 'lane p')}
  ${LN('1', 'M800 140 V220')}
  ${LN('1', 'M800 324 V404', 'ln a')}
  ${LN('1', 'M800 508 V588')}
  ${LN('2', 'M800 692 V1128')}
  ${LN('2', 'M800 780 H220', 'ln d')}
  ${LN('2', 'M800 880 H220', 'ln w')}
  ${LN('2', 'M800 980 H1350', 'ln p')}
  ${LN('3', 'M800 1232 V1520', 'ln nm')}
  ${LN('3', 'M800 1320 H220', 'ln d')}
  ${LN('3', 'M800 1420 H220', 'ln w')}
  ${LN('3', 'M800 1520 H1350', 'ln p')}
  ${LN('4', 'M400 2072 V2156', 'ln d')}
  ${LN('4', 'M1200 2072 V2156', 'ln p')}
  ${LN('4', 'M1200 2260 V2340', 'ln p')}
</svg>
${AN('1', 800, 40, AI.upload, '파일 업로드', '고객사 사용자')}
${LB('1', 830, 160, 'Presigned URL로 업로드')}
${AN('1', 800, 224, AI.bucket, 'S3 incoming/', '검사 전 보관 · 밖에서 못 받음')}
${LB('1', 830, 344, SIG('업로드 이벤트') + 'S3가 바로 알림')}
${AN('1', 800, 408, AI.queue, 'SQS 대기열', '검사할 파일이 차례를 기다림')}
${LB('1', 830, 528, '작업 VM이 하나씩 가져가 검사')}
${AN('1 2', 800, 592, AI.search, '정적 분석', '실행하지 않고 · 파일당 약 1초', 'key')}
${CHIP('2', 150, 780, 'd', '차단')}${LB('2', 516, 728, '<b>알려진 악성</b>해시·백신·YARA 일치', 'c d')}
${CHIP('2', 150, 880, 'w', '보류')}${LB('2', 516, 828, '<b>검사 불가</b>암호·한도 초과·오류', 'c w')}
${CHIP('2', 1450, 980, 'p', '통과 후보')}${LB('2', 1070, 928, '<b>위험 점수 낮음</b>형식별 기준 미만', 'c p')}
${LB('2', 830, 1048, SIG('위험 점수 기준 이상') + '정상 파일의 2~5%만')}
${AN('2 3', 800, 1132, AI.monitor, '동적 분석', 'CAPEv2 · 격리된 Windows 10에서 실행', 'key')}
${CHIP('3', 150, 1320, 'd', '차단')}${LB('3', 516, 1268, '<b>악성 행동</b>실행·파일 생성·통신', 'c d')}
${CHIP('3', 150, 1420, 'w', '보류')}${LB('3', 516, 1368, '<b>판단 불가</b>실행 실패·회피 의심', 'c w')}
${CHIP('3', 1450, 1520, 'p', '통과 후보')}${LB('3', 1070, 1468, '<b>행동 없음</b>믿을 수 있는 결과만', 'c p')}
${AN('4', 800, 1960, AI.scale, '최종 판정 · Decision Engine', '정적·동적 근거를 합쳐 결정, 애매하면 보류', 'de')}
${LB('4', 424, 2092, '<b>차단·보류</b>', 'd')}
${LB('4', 1224, 2092, '<b>통과</b>', 'p')}
${AN('4', 400, 2160, AI.lock, 'S3 quarantine/', '격리 · 알림 · 관리자 확인', 'q')}
${LB('4', 400, 2286, AI.loop + '악성 해시는 등록해 다음엔 1차에서 차단', 'c fb')}
${AN('4', 1200, 2160, AI.bucketOk, 'S3 public/', 'CLEAN 태그가 붙은 파일만', 'p')}
${AN('4', 1200, 2344, AI.globe, 'CDN 배포', '사용자에게 전달', 'p')}
</div></div>`;

const ASTEPS = `<div class="chrome story asteps" id="asteps" aria-hidden="true"><span class="ind"></span>
  <span class="st"><i>1</i>시작</span><span class="st"><i>2</i>정적</span><span class="st"><i>3</i>동적</span><span class="st"><i>4</i>판정</span><span class="st"><i>5</i>전체</span>
</div>`;

const AHEAD = (n, a, b, src) => `<div class="txt"><div class="arow rv d1"><span class="badge">${n}</span><h2 class="atitle"><span class="l1">${a}</span><span class="l2">${b}</span></h2></div></div>
  <p class="asrc rv d2">${src}</p>`;

// 11장 전체 흐름도: 동그라미 6개 + 선 6개, 글자는 이름과 갈림 조건만
const OVN = (cx, cy, cls, icon, label, lcls, ly, d) => `<div class="ovn ${cls} rv" style="--cx:${cx};--cy:${cy};transition-delay:${d}s">${icon}</div><b class="ovt ${lcls} rv" style="--cx:${cx};--cy:${ly};transition-delay:${d}s">${label}</b>`;
const OVE = (cls, d, path, head, hd) => `<path class="e ${cls}" pathLength="1" style="transition-delay:${d}s" d="${path}"/><path class="h ${cls}" style="transition-delay:${hd}s" d="${head}"/>`;
const OVERVIEW = `<div class="ov">
<svg class="ovlines" width="1600" height="700" viewBox="0 0 1600 700" aria-hidden="true">
  ${OVE('a', .15, 'M170 360 H398', 'M392 348L414 360L392 372z', .5)}
  ${OVE('a', .4, 'M550 360 H748', 'M742 348L764 360L742 372z', .75)}
  ${OVE('n', .4, 'M480 292 C480 130 1170 130 1170 276', 'M1158 270L1170 292L1182 270z', .75)}
  ${OVE('n', .65, 'M900 360 H1086', 'M1080 348L1102 360L1080 372z', 1)}
  ${OVE('p', .9, 'M1224 322 C1300 322 1330 200 1396 200', 'M1390 188L1412 200L1390 212z', 1.25)}
  ${OVE('d', .9, 'M1224 398 C1300 398 1330 520 1396 520', 'M1390 508L1412 520L1390 532z', 1.25)}
</svg>
${OVN(100, 360, '', AI.upload, 'S3 업로드', '', 446, .05)}
${OVN(480, 360, 'k', AI.search, '정적 분석', '', 446, .3)}
${OVN(830, 360, 'k', AI.monitor, '동적 분석', '', 446, .55)}
${OVN(1170, 360, 'k', AI.scale, '최종 판정', '', 446, .8)}
${OVN(1480, 200, 'p', AI.globe, 'CDN 배포', 'p', 286, 1.1)}
${OVN(1480, 520, 'd', AI.lock, '격리', 'd', 606, 1.1)}
<span class="ovs sig rv" style="--cx:290;--cy:316;transition-delay:.3s">${AI.bolt}업로드 이벤트</span>
<span class="ovs sig rv" style="--cx:655;--cy:316;transition-delay:.55s">${AI.bolt}의심 파일만</span>
<span class="ovs rv" style="--cx:825;--cy:122;transition-delay:.55s">나머지는 바로 판정</span>
<span class="ovs p rv" style="--cx:1300;--cy:228;transition-delay:1s">통과</span>
<span class="ovs d rv" style="--cx:1252;--cy:522;transition-delay:1s">차단·보류</span>
</div>`;

const ARCH_SLIDES = [
  `<section class="slide lay-arch" data-label="구조 ① 시작" data-arch="1" data-astep="0" aria-label="아키텍처 1: 업로드되면 검사가 시작된다">
  ${AHEAD('07', '올라오는 순간, ', '검사가 자동으로 시작됩니다', '출처 · 최종 기획서 1·4장')}
</section>`,
  `<section class="slide lay-arch" data-label="구조 ② 정적" data-arch="2" data-astep="1" aria-label="아키텍처 2: 정적 분석의 네 갈래">
  ${AHEAD('08', '정적 분석에서 ', '네 갈래로 나뉩니다', '출처 · 최종 기획서 5장')}
</section>`,
  `<section class="slide lay-arch" data-label="구조 ③ 동적" data-arch="3" data-astep="2" aria-label="아키텍처 3: 동적 분석의 세 갈래">
  ${AHEAD('09', '의심 파일만 ', '직접 열어 행동을 봅니다', '출처 · 최종 기획서 7·8장')}
</section>`,
  `<section class="slide lay-arch" data-label="구조 ④ 판정" data-arch="4" data-astep="3" aria-label="아키텍처 4: 최종 판정과 배포">
  ${AHEAD('10', '최종 판정 뒤 ', '통과한 파일만 내보냅니다', '출처 · 최종 기획서 8·11장')}
</section>`,
  `<section class="slide lay-arch ovslide" data-label="전체 흐름" data-astep="4" aria-label="전체 흐름도">
  ${AHEAD('11', '업로드부터 배포까지, ', '한눈에', '출처 · 최종 기획서 4장')}
  <div class="vis">${OVERVIEW}</div>
</section>`,
];
const A1_SLIDES = [...SLIDES.slice(0, 6), ...ARCH_SLIDES, SLIDES[6].replace('<span class="badge">07</span>', '<span class="badge">12</span>')];
const LABELS = ['표지', '배경', '만든다', '퍼진다', '깔린다', '끊는다', '구조 ① 시작', '구조 ② 정적', '구조 ③ 동적', '구조 ④ 판정', '전체 흐름', '결과'];
const FS_ICON = '<svg class="en" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg><svg class="ex" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';

const STORY = `<div class="chrome story" id="story" aria-hidden="true"><span class="ind"></span>
  <span class="st"><i>1</i>만든다<em class="real">실제</em></span>
  <span class="st"><i>2</i>퍼진다<em class="assume">가정</em></span>
  <span class="st"><i>3</i>깔린다<em class="real">실제</em></span>
</div>`;

const CHROME = {
  a1: `${ARCH}
<header class="chrome topbar"><span class="brand"><i></i>업로드 파일 악성코드 사전 탐지·차단</span><span class="right"><span class="meta">최종 발표 · 2026. 11.</span><button class="tb fs" id="fsBtn" aria-label="전체 화면" title="전체 화면 (F)">${FS_ICON}</button></span></header>
<nav class="chrome rail" aria-label="장 이동"><!-- 장 탭은 스크립트가 장 순서대로 만든다 --></nav>
<footer class="chrome foot"><span class="pg"><b data-cur>01</b> / <span data-total>${pad(A1_SLIDES.length)}</span><span class="lab" data-lab>표지</span></span><span class="nav"><button class="tb" data-step="-1" aria-label="이전 장">←</button><button class="tb" data-step="1" aria-label="다음 장">→</button></span></footer>
<div class="chrome prog"><i></i></div>
${STORY}
${ASTEPS}`,
  a2: `<nav class="chrome tabs" aria-label="장 이동">${LABELS.map((l, k) => `<button class="tb" data-go="${k}"><b>${pad(k + 1)}</b>${l}</button>`).join('')}</nav>
<div class="chrome baseline"></div>
<div class="chrome count"><b data-cur>01</b> / ${pad(LABELS.length)}</div>
${STORY}`,
  a3: `<div class="chrome brand"><i></i>업로드 파일 악성코드 사전 탐지·차단</div>
<div class="chrome meta">최종 발표 · 2026. 11.</div>
<nav class="chrome pills" aria-label="장 이동">${LABELS.map((l, k) => `<button class="tb" data-go="${k}">${pad(k + 1)}<span>${l}</span></button>`).join('')}</nav>
${STORY}`,
};

const TITLES = {
  a1: '컨셉 A1 · 흰 바탕 + 짙은 파랑',
  a2: '컨셉 A2 · 흰 바탕 + 청록 포인트',
  a3: '컨셉 A3 · 연한 하늘색 바탕 + 파랑',
};

function page(v) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${TITLES[v]}</title>
<!-- 글꼴: SUIT (SIL OFL). 인터넷이 없으면 맑은 고딕으로 보입니다. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
${BASE}
${COMMON}
${read(v + '.css')}
</style>
</head>
<body class="v-${v}">
<div class="deck-viewport">
<main class="deck-stage" id="stage">

${A1_SLIDES.join('\n\n')}

${CHROME[v]}
</main>
</div>
<nav class="deck-controls" id="ctrl" aria-label="슬라이드 이동"><button id="prev" aria-label="이전">◀</button><span id="counter">1 / ${A1_SLIDES.length}</span><button id="next" aria-label="다음">▶</button></nav>
<script>
${CLIENT}
</script>
</body>
</html>
`;
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
// 사용자가 A1을 골랐으므로(2026-11-20) A1만 다시 만든다. a2·a3.html은 비교용으로 그대로 둔다.
for (const v of ['a1']) {
  fs.writeFileSync(OUT_FILE, page(v), 'utf8');
  console.log('wrote', OUT_FILE);
}
