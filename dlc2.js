/* 《燈火騎士》DLC2：字母書房、彼岸。獨立檔案，玩家在 DLC 選單選到才下載載入。 */
(function () {
'use strict';
const L = window.LK;
if (!L || L.THEMES[12]) return;
const { C, TAU, circ, rrect, poly, rand, rr, pickOf, clamp } = L;

/* ================= 字母書房 ================= */
const LET_COL = ['#c45a4a', '#4f86a6', '#7aa04a', '#d9a441', '#8d68b0'];
const letterOf = e => String.fromCharCode(65 + Math.floor(e.seed * 4.3 + e.t * 0) % 26);
function drawLetterEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, ol = '#2a1c12', col = LET_COL[Math.floor(e.seed * 7) % 5];
  const eye = (x, y) => { c.fillStyle = C.paper; circ(c, x, y, r * 0.18); c.fillStyle = ol; circ(c, x + 1, y, r * 0.09); };
  if (sk === 'block') {
    const w = Math.sin(e.t * 9) * 3;
    c.strokeStyle = ol; c.lineWidth = 3; c.beginPath(); c.moveTo(-r * 0.4, r * 0.9); c.lineTo(-r * 0.4 + w, r * 1.35); c.moveTo(r * 0.4, r * 0.9); c.lineTo(r * 0.4 - w, r * 1.35); c.stroke();
    c.fillStyle = ol; rrect(c, -r * 1.05, -r * 1.05, r * 2.1, r * 2.1, 6); c.fillStyle = f ? C.paper : col; rrect(c, -r, -r, r * 2, r * 2, 5);
    c.fillStyle = f ? C.paperDim : '#f1e6c8'; rrect(c, -r * 0.72, -r * 0.72, r * 1.44, r * 1.44, 4);
    c.fillStyle = ol; c.font = '700 ' + Math.round(r * 1.1) + 'px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(letterOf(e), 0, 2);
  } else if (sk === 'ink') {
    c.fillStyle = ol; rrect(c, -r * 0.9, -r * 0.5, r * 1.8, r * 1.55, 7); c.fillStyle = f ? C.paper : '#2f3e7a'; rrect(c, -r * 0.8, -r * 0.4, r * 1.6, r * 1.35, 6);
    c.fillStyle = ol; rrect(c, -r * 0.4, -r * 0.95, r * 0.8, r * 0.5, 3); c.fillStyle = f ? C.paper : '#e8dcc0'; rrect(c, -r * 0.3, -r * 0.88, r * 0.6, r * 0.34, 2);
    c.strokeStyle = f ? C.paper : '#f1e6c8'; c.lineWidth = 3; c.beginPath(); c.moveTo(r * 0.2, -r * 0.9); c.lineTo(r * 0.8, -r * 1.7); c.stroke();
    c.fillStyle = f ? C.paperDim : '#f1e6c8'; rrect(c, -r * 0.5, r * 0.1, r, r * 0.45, 3); eye(-r * 0.3, -r * 0.1); eye(r * 0.3, -r * 0.1);
    c.fillStyle = f ? C.paperDim : '#1b2350'; c.beginPath(); c.arc(0, r * 1.1 + Math.sin(e.t * 4) * 1.5, r * 0.18, 0, TAU); c.fill();
  } else if (sk === 'book') {
    c.fillStyle = ol; rrect(c, -r * 1.05, -r * 0.9, r * 2.1, r * 1.85, 5); c.fillStyle = f ? C.paper : '#7a3b2c'; rrect(c, -r, -r * 0.85, r * 2, r * 1.75, 4);
    c.fillStyle = f ? C.paperDim : '#e8d9b0'; c.fillRect(-r * 0.92, r * 0.62, r * 1.84, r * 0.22);
    c.fillStyle = f ? C.paper : '#d9a441'; rrect(c, -r * 0.6, -r * 0.6, r * 1.2, r * 0.3, 2); c.fillRect(r * 0.82, -r * 0.2, r * 0.2, r * 0.5);
    eye(-r * 0.3, -r * 0.05); eye(r * 0.3, -r * 0.05); c.strokeStyle = ol; c.lineWidth = 2; c.beginPath(); c.moveTo(-r * 0.5, -r * 0.2); c.lineTo(-r * 0.15, -r * 0.1); c.moveTo(r * 0.5, -r * 0.2); c.lineTo(r * 0.15, -r * 0.1); c.stroke();
  } else if (sk === 'eraser') {
    c.fillStyle = ol; rrect(c, -r * 1.05, -r * 0.7, r * 2.1, r * 1.5, 7); c.fillStyle = f ? C.paper : '#f2a3b3'; rrect(c, -r, -r * 0.65, r * 2, r * 1.4, 6);
    c.fillStyle = f ? C.paperDim : '#4f86a6'; c.fillRect(-r * 0.3, -r * 0.65, r * 0.6, r * 1.4); eye(-r * 0.62, -r * 0.1); eye(r * 0.62, -r * 0.1);
    c.fillStyle = f ? C.paperDim : '#e0788f'; c.fillRect(-r * 0.9, r * 0.5, r * 0.5, 3);
  } else if (sk === 'inkbomb') {
    c.strokeStyle = '#a08a5a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -r * 0.8); c.quadraticCurveTo(r * 0.3, -r * 1.3, r * 0.7, -r * 1.2); c.stroke();
    c.fillStyle = (Math.sin(e.t * 14) > 0) ? '#ffd23f' : '#ff6b3d'; circ(c, r * 0.7, -r * 1.2, 3);
    c.fillStyle = ol; circ(c, 0, 0, r * 1.05); c.fillStyle = f ? C.paper : '#1b2350'; circ(c, 0, 0, r); c.fillStyle = 'rgba(255,255,255,.35)'; circ(c, -r * 0.35, -r * 0.35, r * 0.22); eye(-r * 0.3, 0); eye(r * 0.3, 0);
  } else if (sk === 'ball') {
    if (e.tele > 0) { c.save(); c.globalAlpha = 0.55; c.strokeStyle = '#d9534f'; c.lineWidth = 4; c.setLineDash([8, 6]); c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(e.ra || 0) * 320, Math.sin(e.ra || 0) * 320); c.stroke(); c.restore(); }
    c.save(); c.rotate(e.t * (e.state === 'roll' ? 9 : 1.5)); c.fillStyle = ol; circ(c, 0, 0, r * 1.06); c.fillStyle = f ? C.paper : col; circ(c, 0, 0, r); c.fillStyle = f ? C.paperDim : '#f1e6c8'; circ(c, 0, 0, r * 0.55);
    c.fillStyle = ol; c.font = '700 ' + Math.round(r * 0.9) + 'px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('O', 0, 1); c.restore();
  }
}
function letBg(g, rm, rng, arR) {
  const R = L.ROOM;
  g.strokeStyle = 'rgba(120,150,190,.16)'; g.lineWidth = 1; for (let y = R.y + 20; y < R.y + R.h; y += 34) { g.beginPath(); g.moveTo(R.x, y); g.lineTo(R.x + R.w, y); g.stroke(); }
  g.strokeStyle = 'rgba(190,80,80,.22)'; g.beginPath(); g.moveTo(R.x + 64, R.y); g.lineTo(R.x + 64, R.y + R.h); g.stroke();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let i = 0; i < Math.round(20 * arR); i++) { const sz = 60 + rng() * 90; g.save(); g.translate(R.x + rng() * R.w, R.y + rng() * R.h); g.rotate((rng() - 0.5) * 0.8); g.fillStyle = 'rgba(232,217,176,.075)'; g.font = '700 ' + sz + 'px serif'; g.fillText(String.fromCharCode(65 + Math.floor(rng() * 26)), 0, 0); g.restore(); }
  for (let i = 0; i < Math.round(7 * arR); i++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.fillStyle = 'rgba(10,8,24,.32)'; g.beginPath(); g.ellipse(x, y, 18 + rng() * 26, 12 + rng() * 18, rng() * 3, 0, TAU); g.fill(); for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + (rng() - 0.5) * 80, y + (rng() - 0.5) * 60, 2 + rng() * 4, 0, TAU); g.fill(); } }
}
function letObs(g, o, rng) {
  const cols = ['#8c3b32', '#2f5d73', '#5b7a3a', '#7a5a2e', '#5a3d6e'];
  if (o.w < 76 && o.h < 76) {
    g.fillStyle = '#1b130c'; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 8); g.fillStyle = cols[Math.floor(rng() * 5)]; rrect(g, o.x, o.y, o.w, o.h, 7);
    g.fillStyle = '#f1e6c8'; rrect(g, o.x + 6, o.y + 6, o.w - 12, o.h - 12, 5); g.fillStyle = '#2a1c12'; g.font = '700 ' + Math.round(Math.min(o.w, o.h) * 0.6) + 'px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String.fromCharCode(65 + Math.floor(rng() * 26)), o.x + o.w / 2, o.y + o.h / 2 + 2);
    return;
  }
  const n = Math.max(2, Math.round(o.h / 20)), hh = o.h / n;
  for (let i = 0; i < n; i++) {
    const off = (rng() - 0.5) * 10, y = o.y + i * hh;
    g.fillStyle = '#1b130c'; rrect(g, o.x + off - 2, y - 1, o.w + 4, hh + 2, 4); g.fillStyle = cols[Math.floor(rng() * 5)]; rrect(g, o.x + off, y, o.w, hh - 1, 3);
    g.fillStyle = '#e8d9b0'; g.fillRect(o.x + off + o.w * 0.12, y + hh * 0.3, o.w * 0.76, hh * 0.18); g.fillStyle = '#d9a441'; g.fillRect(o.x + off + 6, y + 2, 4, hh - 5);
  }
}
function drawDict(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, hov = Math.sin(t * 2) * 5, ol = '#1b130c';
  for (let i = 0; i < 5; i++) { const a = t * 1.1 + i * TAU / 5; c.save(); c.translate(Math.cos(a) * 92, Math.sin(a) * 40 - 20); c.rotate(a * 0.6); c.fillStyle = fl ? C.paper : '#f1e6c8'; rrect(c, -8, -11, 16, 22, 2); c.fillStyle = '#8a7a58'; c.fillRect(-5, -6, 10, 1.5); c.fillRect(-5, -2, 10, 1.5); c.fillRect(-5, 2, 8, 1.5); c.restore(); }
  c.fillStyle = ol; rrect(c, -66, -70 + hov, 132, 118, 10); c.fillStyle = fl ? C.paper : '#6e2f24'; rrect(c, -61, -65 + hov, 122, 108, 8);
  c.fillStyle = fl ? C.paperDim : '#e8d9b0'; c.fillRect(-58, 40 + hov, 116, 10); c.fillStyle = '#b99a5a'; c.fillRect(-58, 44 + hov, 116, 1.5);
  c.fillStyle = fl ? C.paper : '#d9a441'; for (const [x, y] of [[-61, -65], [61, -65], [-61, 43], [61, 43]]) circ(c, x, y + hov, 7);
  c.strokeStyle = fl ? C.paper : '#d9a441'; c.lineWidth = 3; c.strokeRect(-48, -52 + hov, 96, 84);
  c.fillStyle = fl ? C.paperDim : '#d9a441'; c.font = '700 40px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('字', 0, -10 + hov);
  c.fillStyle = '#f1e6c8'; circ(c, -20, -34 + hov, 7); circ(c, 20, -34 + hov, 7); c.fillStyle = ol; circ(c, -19, -33 + hov, 3.5); circ(c, 21, -33 + hov, 3.5);
  c.fillStyle = ol; rrect(c, -86, -14 + hov + Math.sin(t * 3) * 4, 22, 30, 8); rrect(c, 64, -14 + hov - Math.sin(t * 3) * 4, 22, 30, 8);
  c.fillStyle = fl ? C.paper : '#2f3e7a'; circ(c, -75, 2 + hov + Math.sin(t * 3) * 4, 9); circ(c, 75, 2 + hov - Math.sin(t * 3) * 4, 9);
}
function drawPencil(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, ol = '#2a1c12', b = Math.sin(t * 2.5) * 4;
  c.fillStyle = ol; rrect(c, -40, -78 + b, 80, 36, 14); c.fillStyle = fl ? C.paper : '#f2a3b3'; rrect(c, -36, -74 + b, 72, 28, 11);
  c.fillStyle = fl ? C.paperDim : '#a9b2bd'; c.fillRect(-36, -44 + b, 72, 10);
  c.fillStyle = ol; rrect(c, -42, -48 + b, 84, 98, 6); c.fillStyle = fl ? C.paper : '#f2c43b'; rrect(c, -37, -43 + b, 74, 88, 4);
  c.fillStyle = 'rgba(120,80,0,.25)'; c.fillRect(-12, -43 + b, 4, 88); c.fillRect(14, -43 + b, 4, 88);
  c.fillStyle = ol; poly(c, [[-42, 48 + b], [42, 48 + b], [0, 92 + b]]); c.fillStyle = fl ? C.paper : '#e8c99a'; poly(c, [[-35, 48 + b], [35, 48 + b], [0, 84 + b]]); c.fillStyle = fl ? C.paperDim : '#2a2a32'; poly(c, [[-9, 76 + b], [9, 76 + b], [0, 92 + b]]);
  c.fillStyle = '#fff'; circ(c, -14, -16 + b, 8); circ(c, 14, -16 + b, 8); c.fillStyle = ol; circ(c, -12, -15 + b, 4); circ(c, 16, -15 + b, 4);
  c.strokeStyle = ol; c.lineWidth = 3; c.beginPath(); c.moveTo(-24, -30 + b); c.lineTo(-6, -24 + b); c.moveTo(24, -30 + b); c.lineTo(6, -24 + b); c.stroke(); c.fillRect(-10, 10 + b, 20, 3);
  c.strokeStyle = ol; c.lineWidth = 5; c.beginPath(); c.moveTo(-42, 0 + b); c.lineTo(-66, 20 + b + Math.sin(t * 3) * 5); c.moveTo(42, 0 + b); c.lineTo(66, 20 + b - Math.sin(t * 3) * 5); c.stroke();
}
function letMoves(e, phase, ang) {
  const p = L.p, R = L.ROOM, dict = e.xk === 'dict';
  const pool = dict ? (phase === 1 ? ['flip', 'blot'] : phase === 2 ? ['flip', 'blot', 'letters'] : ['flip', 'blot', 'letters', 'chain']) : (phase === 1 ? ['thrust', 'blot'] : ['thrust', 'blot', 'letters']);
  const a = pickOf(pool);
  if (a === 'flip') { const n = phase === 3 ? 10 : 8, fromL = rand() < 0.5; for (let i = 0; i < n; i++) { const k = fromL ? i : n - 1 - i; L.markStrike(e, R.x + 50 + k * (R.w - 100) / (n - 1), p.y + (i % 2 ? 50 : -50), 40, 0.6 + i * 0.1, i % 3 === 0 ? { ring: 5 } : {}); } L.toast('翻頁！', 1.2); }
  else if (a === 'blot') { const n = phase === 3 ? 6 : 5; for (let i = 0; i < n; i++) L.markStrike(e, i === 0 ? p.x : p.x + rr(-230, 230), i === 0 ? p.y : p.y + rr(-170, 170), 52, 1.0, i % 2 ? { ring: 6 } : {}); L.toast('墨滴落下！', 1.2); }
  else if (a === 'letters') { const n = phase === 3 ? 4 : 3; for (let w = 0; w < n; w++) L.later(w * 0.45, () => { if (e.dead || L.state() !== 'play') return; const off = w * 0.3; for (let i = 0; i < 10; i++) L.bossShot(e, e.x, e.y, off + i / 10 * TAU, 140, false, 6); L.sfx('hit'); }); L.toast('字母彈幕！', 1.2); }
  else if (a === 'chain') { for (let w = 0; w < 3; w++) L.later(w * 0.5, () => { if (e.dead || L.state() !== 'play') return; const aa = Math.atan2(p.y - e.y, p.x - e.x); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.16, 190, false, 6); L.sfx('hit'); }); L.toast('連字！', 1.2); }
  else { const ux = Math.cos(ang), uy = Math.sin(ang), n = phase === 3 ? 7 : 5; for (let i = 1; i <= n; i++) L.markStrike(e, e.x + ux * i * 90, e.y + uy * i * 90, 44, 0.7 + i * 0.12, i % 2 ? { ring: 6 } : {}); L.toast('鉛筆戳刺！', 1.2); }
}

/* ================= 彼岸 ================= */
function drawShoreEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, dk = f ? C.paper : '#1a1823', ey = '#ff4d5e';
  const eyes = (y, s) => { c.fillStyle = f ? C.dark : ey; circ(c, -r * 0.3, y, s || r * 0.12); circ(c, r * 0.3, y, s || r * 0.12); };
  if (e.tele > 0 && (sk === 'fan' || sk === 'dart' || sk === 'flame')) { c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#ff4d5e'; c.lineWidth = 3; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(e.la || 0) * 300, Math.sin(e.la || 0) * 300); c.stroke(); c.restore(); }
  const bob = Math.sin(e.t * 3 + e.seed) * 2;
  if (sk === 'shade') {
    c.fillStyle = dk; c.beginPath(); c.moveTo(-r, r); c.quadraticCurveTo(-r * 1.1, -r * 0.8, 0, -r * 1.1 + bob); c.quadraticCurveTo(r * 1.1, -r * 0.8, r, r); for (let i = 0; i < 4; i++) c.lineTo(r - (i + 0.5) * r * 0.5, r + (i & 1 ? -3 : 4)); c.closePath(); c.fill(); eyes(-r * 0.2);
  } else if (sk === 'stone') {
    c.fillStyle = f ? C.paper : '#46434f'; c.beginPath(); c.moveTo(-r, r); c.lineTo(-r, -r * 0.5); c.arc(0, -r * 0.5, r, Math.PI, 0); c.lineTo(r, r); c.closePath(); c.fill();
    c.strokeStyle = '#2a2833'; c.lineWidth = 2; c.beginPath(); c.moveTo(-r * 0.3, -r * 0.1); c.lineTo(0, r * 0.3); c.lineTo(r * 0.2, r * 0.1); c.stroke(); eyes(-r * 0.3, r * 0.13);
  } else if (sk === 'fan') {
    c.fillStyle = dk; c.beginPath(); c.arc(0, bob, r, 0, TAU); c.fill(); eyes(-r * 0.1);
    c.save(); c.translate(r * 0.9, 0); c.rotate(Math.sin(e.t * 4) * 0.3); c.fillStyle = f ? C.paper : '#c9c3d9'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r * 1.1, -0.9, 0.9); c.closePath(); c.fill(); c.strokeStyle = '#6b6580'; c.lineWidth = 1.5; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(i * 0.4) * r * 1.1, Math.sin(i * 0.4) * r * 1.1); c.stroke(); } c.restore();
  } else if (sk === 'dart') {
    c.fillStyle = dk; c.beginPath(); c.arc(0, bob, r, 0, TAU); c.fill(); eyes(-r * 0.1);
    c.save(); c.translate(-r * 0.9, 0); c.rotate(e.t * (e.state === 'wind' ? 12 : 2)); c.fillStyle = f ? C.paper : '#c9c3d9'; for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); poly(c, [[0, -2], [r * 0.9, -4], [r * 0.9, 4], [0, 2]]); } c.restore();
  } else if (sk === 'flame') {
    c.fillStyle = dk; c.beginPath(); c.arc(0, bob, r, 0, TAU); c.fill(); eyes(-r * 0.15);
    const fl = 1 + Math.sin(e.t * 9) * 0.15; c.fillStyle = f ? C.paper : '#ff7a3d'; poly(c, [[-r * 0.5, -r * 0.8], [0, -r * 2 * fl], [r * 0.5, -r * 0.8]]); c.fillStyle = f ? C.paperDim : '#ffd27a'; poly(c, [[-r * 0.25, -r * 0.8], [0, -r * 1.5 * fl], [r * 0.25, -r * 0.8]]);
  }
}
function shoreBg(g, rm, rng, arR) {
  const R = L.ROOM;
  g.strokeStyle = 'rgba(140,170,210,.09)'; g.lineWidth = 6; for (let i = 0; i < 4; i++) { const y = R.y + (0.15 + i * 0.24) * R.h; g.beginPath(); for (let x = R.x; x <= R.x + R.w; x += 20) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 9); g.stroke(); }
  for (let i = 0; i < Math.round(30 * arR); i++) {
    const x = R.x + rng() * R.w, y = R.y + rng() * R.h, n = 6 + Math.floor(rng() * 3); g.strokeStyle = 'rgba(210,50,70,' + (0.32 + rng() * 0.25) + ')'; g.lineWidth = 1.6;
    for (let k = 0; k < n; k++) { const a = k / n * TAU + rng() * 0.3, l = 9 + rng() * 8; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.6, y + Math.sin(a) * l * 0.6 - 4, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    g.fillStyle = 'rgba(255,160,160,.4)'; circ(g, x, y, 1.6);
  }
}
function shoreObs(g, o, rng) {
  if (o.h > o.w * 1.15) {
    g.fillStyle = '#17151f'; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 5); g.fillStyle = '#5b586a'; rrect(g, o.x, o.y + o.h * 0.55, o.w, o.h * 0.45, 4); rrect(g, o.x + o.w * 0.2, o.y + o.h * 0.2, o.w * 0.6, o.h * 0.4, 3);
    g.fillStyle = '#6e6b80'; poly(g, [[o.x - 4, o.y + o.h * 0.22], [o.x + o.w + 4, o.y + o.h * 0.22], [o.x + o.w / 2, o.y - 2]]); g.fillStyle = '#ffb35c'; g.fillRect(o.x + o.w * 0.38, o.y + o.h * 0.3, o.w * 0.24, o.h * 0.2);
  } else {
    g.fillStyle = '#17151f'; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 14); g.fillStyle = '#4a4757'; rrect(g, o.x, o.y, o.w, o.h, 12);
    g.strokeStyle = '#2f2c3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(o.x + o.w * 0.5, o.y + o.h * 0.2); g.lineTo(o.x + o.w * 0.5, o.y + o.h * 0.7); g.moveTo(o.x + o.w * 0.35, o.y + o.h * 0.38); g.lineTo(o.x + o.w * 0.65, o.y + o.h * 0.38); g.stroke();
  }
}
function drawFerry(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 2) * 4, ol = '#0d0c14';
  c.strokeStyle = '#6b5a3a'; c.lineWidth = 5; c.beginPath(); c.moveTo(60, -70 + b); c.lineTo(60, 70 + b); c.stroke(); c.fillStyle = fl ? C.paper : '#ff4d3d'; circ(c, 60, -78 + b, 13); c.fillStyle = '#ffd27a'; circ(c, 60, -78 + b, 7);
  c.fillStyle = ol; c.beginPath(); c.moveTo(-50, 70 + b); c.quadraticCurveTo(-64, -30 + b, 0, -66 + b); c.quadraticCurveTo(64, -30 + b, 50, 70 + b); for (let i = 0; i < 5; i++) c.lineTo(50 - (i + 0.5) * 20, 70 + b + (i & 1 ? -6 : 8)); c.closePath(); c.fill();
  c.fillStyle = fl ? C.paper : '#c9c3d9'; circ(c, 0, -34 + b, 20); c.fillStyle = ol; circ(c, 0, -38 + b, 22); c.fillStyle = fl ? C.paper : '#c9c3d9'; circ(c, 0, -32 + b, 15); c.fillStyle = '#ff4d5e'; circ(c, -6, -34 + b, 3); circ(c, 6, -34 + b, 3); c.fillRect(-5, -24 + b, 10, 2);
}
function drawLily(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t;
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * 0.25, l = 82 + Math.sin(t * 2 + i) * 6; c.strokeStyle = fl ? C.paper : '#d2324a'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(Math.cos(a + 0.5) * l * 0.5, Math.sin(a + 0.5) * l * 0.5, Math.cos(a) * l, Math.sin(a) * l); c.stroke(); c.fillStyle = fl ? C.paper : '#ff8a9a'; circ(c, Math.cos(a) * l, Math.sin(a) * l, 3.5); }
  c.fillStyle = '#0d0c14'; circ(c, 0, 0, 38); c.fillStyle = fl ? C.paper : '#2a2833'; circ(c, 0, 0, 33); c.fillStyle = fl ? C.paperDim : '#f1e8f5'; c.beginPath(); c.ellipse(0, 0, 22, 12, 0, 0, TAU); c.fill(); c.fillStyle = '#d2324a'; circ(c, Math.sin(t * 1.3) * 5, 0, 8); c.fillStyle = '#0d0c14'; circ(c, Math.sin(t * 1.3) * 5, 0, 4);
}
function shoreMoves(e, phase, ang) {
  const p = L.p, lord = e.xk === 'lord';
  const pool = lord ? (phase === 1 ? ['fan', 'dart'] : phase === 2 ? ['fan', 'dart', 'flame'] : ['fan', 'dart', 'flame', 'all']) : (phase === 1 ? ['fan', 'dart'] : ['fan', 'dart', 'flame']);
  const a = pickOf(pool), aim = () => Math.atan2(p.y - e.y, p.x - e.x);
  const fan = () => { for (let w = 0; w < 3; w++) L.later(w * 0.35, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -3; i <= 3; i++) L.bossShot(e, e.x, e.y, aa + i * 0.17, 200, false, 6); L.sfx('hit'); }); };
  const dart = () => { for (let i = -1; i <= 2; i++) { const b = L.bossShot(e, e.x, e.y, ang + (i - 0.5) * 0.35, 280, false, 7); L.later(0.8, () => { if (!b.dead) { b.vx = -b.vx; b.vy = -b.vy; b.life = Math.max(b.life, 3); } }); } L.sfx('hit'); };
  const flame = () => { for (let i = -1; i <= 1; i++) L.bossShot(e, e.x, e.y, ang + i * 0.5, 115, false, 12); const off = rand() * TAU; for (let i = 0; i < 8; i++) L.bossShot(e, e.x, e.y, off + i / 8 * TAU, 130, false, 6); L.sfx('hit'); };
  if (a === 'fan') { fan(); L.toast('扇影！', 1.2); }
  else if (a === 'dart') { dart(); L.toast('鏢影——它們會飛回來！', 1.4); }
  else if (a === 'flame') { flame(); L.toast('火影！', 1.2); }
  else { fan(); L.later(0.9, dart); L.later(1.8, flame); L.toast('彼岸之主模仿了所有武器！', 1.8); }
}
/* ---- 彼岸的敵人 AI ---- */
function shadeAi(kind) {
  return (e, dt, nx, ny, d) => {
    const p = L.p; e.cd -= dt;
    const near = kind === 'dart' ? 210 : kind === 'flame' ? 300 : 260, far = kind === 'dart' ? 320 : kind === 'flame' ? 420 : 360;
    const keep = d < near ? -1 : d > far ? 1 : 0; let mx = nx * 34 * e.spd * keep, my = ny * 34 * e.spd * keep;
    if (e.state === 'walk' && e.cd <= 0 && d < 560) { e.state = 'wind'; e.st = kind === 'flame' ? 0.9 : 0.7; e.la = Math.atan2(p.y - e.y, p.x - e.x); }
    if (e.state === 'wind') {
      e.tele = e.st; e.st -= dt; mx = 0; my = 0;
      if (e.st <= 0) {
        e.tele = 0; const a = e.la;
        if (kind === 'fan') { for (let i = -1; i <= 1; i++) L.enemyShot(e, a + i * 0.28, 190); }
        else if (kind === 'dart') { const b = L.enemyShot(e, a, 300); b.r = 6; L.later(0.75, () => { if (!b.dead) { b.vx = -b.vx; b.vy = -b.vy; b.life = Math.max(b.life, 3); } }); }
        else { const b = L.enemyShot(e, a, 120); b.r = 11; L.enemyShot(e, a - 0.35, 150); L.enemyShot(e, a + 0.35, 150); }
        L.sfx('hit'); e.state = 'walk'; e.cd = rr(2.6, 3.8) * e.fire;
      }
    }
    return { mx, my, touch: 1 };
  };
}

/* ================= 註冊 ================= */
L.registerWorld({
  theme: 12, name: '字母書房', pool: 'dlc', opt: '字母書房（DLC2）',
  pal: { ink: '#120c08', floor: '#5a4630', floor2: '#654f36', wall1: '#2e2118', wall2: '#4a3524', top: '#e8d9b0', door: '#c9a45a' },
  amb: ['bandpass', 2200, 1.2, 0.004], ev: r => L.blip(1500 + r() * 500, 1200, 0.04, 'square', 0.006),
  skin: { map: { crawler: 'block', shooter: 'ink', brute: 'book', splitter: 'eraser', splitter2: 'eraser', bomber: 'inkbomb', roller: 'ball' }, draw: drawLetterEnemy, hue: false },
  bg: letBg, obsDraw: letObs,
  types: (types, L0, ci) => { if (L0 > 0 || ci >= 1) types.push('roller'); },
  boss: fin => fin ? { kind: 'golem', name: '大辭典', hp: 205, ext: true, xk: 'dict' } : { kind: 'golem', name: '鉛筆將軍', hp: 125, ext: true, xk: 'pencil' },
  boss2: letMoves, drawBoss: e => (e.xk === 'dict' ? drawDict(e) : drawPencil(e)),
  intro: def => [{ who: '旁白', text: def.name + '從書架上翻了下來，滿屋子的紙頁沙沙作響。' }],
  outro: () => [{ who: '旁白', text: '書闔上了，字母一個個退回紙裡，只剩檯燈還亮著。' }],
  onFinal: () => { if (L.th() === 12) L.unlockAch('dictBoss'); },
  ach: [{ id: 'dictBoss', name: '大辭典闔上了', desc: '擊敗大辭典（字母書房的最後 Boss）' }]
});
L.registerWorld({
  theme: 13, name: '彼岸', pool: 'dlc', opt: '彼岸（DLC2）',
  pal: { ink: '#0a0a10', floor: '#2a2833', floor2: '#322f3d', wall1: '#1d1b27', wall2: '#3a3748', top: '#c9c3d9', door: '#b02a3a' },
  amb: ['lowpass', 150, 0.8, 0.02], ev: r => { const n = [523, 659, 784][Math.floor(r() * 3)]; L.blip(n, n * 0.99, 0.9, 'sine', 0.01); },
  skin: { map: { crawler: 'shade', brute: 'stone', fanshade: 'fan', dartshade: 'dart', flameshade: 'flame' }, draw: drawShoreEnemy, hue: false },
  bg: shoreBg, obsDraw: shoreObs,
  enemies: {
    fanshade: { hp: 6, r: 14, name: '扇影', cost: 3, cap: 2, ai: shadeAi('fan') },
    dartshade: { hp: 7, r: 14, name: '鏢影', cost: 3, cap: 2, ai: shadeAi('dart') },
    flameshade: { hp: 9, r: 16, name: '火影', cost: 4, cap: 1, ai: shadeAi('flame') }
  },
  types: (types, L0, ci) => { types.length = 0; types.push('crawler', 'crawler', 'fanshade'); if (L0 > 0 || ci >= 1) types.push('dartshade'); if (L0 > 0 || ci >= 2) types.push('flameshade', 'brute'); },
  boss: fin => fin ? { kind: 'golem', name: '彼岸之主', hp: 205, ext: true, xk: 'lord' } : { kind: 'golem', name: '擺渡人', hp: 125, ext: true, xk: 'ferry' },
  boss2: shoreMoves, drawBoss: e => (e.xk === 'lord' ? drawLily(e) : drawFerry(e)),
  intro: def => [{ who: '旁白', text: def.name + '站在河的另一邊，手裡提著一盞紅燈。' }],
  outro: () => [{ who: '旁白', text: '紅花一朵一朵垂下去。對岸，天亮了一點點。' }],
  onFinal: () => { if (L.th() === 13) L.unlockAch('shoreBoss'); },
  ach: [{ id: 'shoreBoss', name: '渡過彼岸', desc: '擊敗彼岸之主' }]
});
})();
