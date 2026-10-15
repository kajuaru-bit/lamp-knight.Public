/* 《燈火騎士》DLC 檔：糖果世界(9)、電玩世界(10)、未來世界(11)、字母書房(12)、彼岸(13)、佛寺(14)、日本(15)。
   獨立檔案，玩家在 DLC 選單選到任何一個世界才下載載入；世界編號必須依序註冊。 */
(function () {
'use strict';
const L = window.LK;
if (!L || L.THEMES[9]) return;
const { C, TAU, circ, rrect, poly, setShadow, noShadow, star4, blip, rand, rr, pickOf, clamp } = L;

/* ================= 糖果／電玩／未來（原在主檔） ================= */
const CANDY_SKIN = { syrup: 'syrup', roller: 'roller', crawler: 'gummy', shooter: 'lolli', brute: 'cookie', splitter: 'jelly', splitter2: 'jelly', bomber: 'gumdrop' };
const ARC_SKIN = { crawler: 'invader', shooter: 'ghost', brute: 'block', splitter: 'slimepx', splitter2: 'slimepx', bomber: 'bombpx', roller: 'chomp', glitch: 'glitch' };
const FUT_SKIN = { crawler: 'drone', shooter: 'turret', brute: 'mech', splitter: 'nano', splitter2: 'nano', bomber: 'mine', laser: 'laser', glitch: 'phase' };
const PAL9 = { ink: '#7a4a86', floor: '#ffe6f0', floor2: '#ffd3e6', wall1: '#ff9ec7', wall2: '#ffc4de', top: '#fff2f8', door: '#c77dff' };
const PAL10 = { ink: '#12123a', floor: '#2f5f9a', floor2: '#3b73b8', wall1: '#3a3a8c', wall2: '#6a6ae0', top: '#b4b8ff', door: '#ffd23f' };
const PAL11 = { ink: '#150b36', floor: '#27346b', floor2: '#303f82', wall1: '#4b2a92', wall2: '#8146e0', top: '#6ff3ff', door: '#ff2e97' };
function drawCandyObs(g, o, rng) {
  const ctx = L.ctx;
  const ol = '#8a3d63', cols = ['#ff9ec7', '#9ad9ff', '#ffe08a', '#b6f0b0', '#d8b4ff'], c1 = cols[Math.floor(rng() * 5)], c2 = cols[Math.floor(rng() * 5)];
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2, w = o.w, h = o.h;
  setShadow(g, 0, 4, 0, 'rgba(90,40,80,.35)');
  if (w >= h * 1.35) { // 層層蛋糕
    g.fillStyle = ol; rrect(g, o.x - 3, o.y - 3, w + 6, h + 6, 10); noShadow(g);
    const n = 3, lh = h / n; for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? c1 : c2; rrect(g, o.x, o.y + i * lh + 1, w, lh - 2, 6); }
    g.fillStyle = '#fff'; for (let i = 0; i < Math.floor(w / 18); i++) circ(g, o.x + 9 + i * 18, o.y + 3 + (i & 1) * 4, 8);
    g.fillStyle = '#e8484f'; circ(g, cx, o.y - 4, 7);
  } else if (h >= w * 1.35) { // 拐杖糖
    g.fillStyle = ol; rrect(g, o.x - 3, o.y - 3, w + 6, h + 6, w / 2 + 3); noShadow(g); g.fillStyle = '#fff'; rrect(g, o.x, o.y, w, h, w / 2);
    g.save(); g.beginPath(); g.rect(o.x, o.y, w, h); g.clip(); g.fillStyle = '#ff4f6d'; for (let y = o.y - w; y < o.y + h + w; y += 22) { g.beginPath(); g.moveTo(o.x, y); g.lineTo(o.x + w, y - 12); g.lineTo(o.x + w, y); g.lineTo(o.x, y + 12); g.closePath(); g.fill(); } g.restore();
  } else { // 棒棒糖／軟糖球
    const r = Math.min(w, h) / 2 + 4; g.fillStyle = ol; circ(g, cx, cy, r + 3); noShadow(g); g.fillStyle = c1; circ(g, cx, cy, r);
    g.strokeStyle = '#fff'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); for (let a = 0; a < 11; a += 0.35) { const rr0 = a / 11 * r * 0.88; g.lineTo(cx + Math.cos(a) * rr0, cy + Math.sin(a) * rr0); } g.stroke();
    g.fillStyle = 'rgba(255,255,255,.5)'; circ(g, cx - r * 0.4, cy - r * 0.45, r * 0.18);
  }
  noShadow(g);
}
function drawCandyEnemy(e) {
  const ctx = L.ctx;
  const r = e.r, f = e.flash > 0, sk = e.skin, ol = '#8a3d63', hue = ['#ff6f91', '#7bd88f', '#ffd166', '#6ec6ff'][e.hue | 0];
  const eye = (x, y) => { ctx.fillStyle = C.paper; circ(ctx, x, y, r * 0.2); ctx.fillStyle = ol; circ(ctx, x + 1, y, r * 0.1); };
  if (sk === 'gummy') {
    ctx.fillStyle = ol; circ(ctx, 0, 0, r * 1.08); circ(ctx, -r * 0.7, -r * 0.9, r * 0.42); circ(ctx, r * 0.7, -r * 0.9, r * 0.42);
    ctx.fillStyle = f ? C.paper : hue; circ(ctx, 0, 0, r); circ(ctx, -r * 0.7, -r * 0.9, r * 0.34); circ(ctx, r * 0.7, -r * 0.9, r * 0.34);
    eye(-r * 0.35, -r * 0.1); eye(r * 0.35, -r * 0.1); ctx.fillRect(-r * 0.25, r * 0.3, r * 0.5, 2);
  } else if (sk === 'lolli') {
    ctx.strokeStyle = ol; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, r * 0.4); ctx.lineTo(0, r * 1.5); ctx.stroke();
    ctx.fillStyle = ol; circ(ctx, 0, 0, r * 1.1); ctx.fillStyle = f ? C.paper : hue; circ(ctx, 0, 0, r);
    ctx.strokeStyle = f ? C.paper : '#fff'; ctx.lineWidth = 3; ctx.beginPath(); for (let a = 0; a < 9; a += 0.4) { const rr0 = a / 9 * r * 0.85; ctx.lineTo(Math.cos(a + e.t) * rr0, Math.sin(a + e.t) * rr0); } ctx.stroke();
  } else if (sk === 'cookie') {
    ctx.fillStyle = ol; circ(ctx, 0, 0, r * 1.06); ctx.fillStyle = f ? C.paper : '#e0a867'; circ(ctx, 0, 0, r);
    ctx.fillStyle = f ? C.paperDim : '#6b3f2a'; for (const [x, y] of [[-0.4, -0.4], [0.35, -0.5], [0.5, 0.2], [-0.2, 0.45], [-0.6, 0.1]]) circ(ctx, x * r, y * r, r * 0.16);
    eye(-r * 0.3, -r * 0.05); eye(r * 0.3, -r * 0.05);
  } else if (sk === 'jelly') {
    ctx.fillStyle = ol; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.08, r * 0.82, 0, 0, TAU); ctx.fill(); ctx.fillStyle = f ? C.paper : hue; ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.74, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.3, r * 0.14, -0.5, 0, TAU); ctx.fill(); eye(r * 0.2, 0);
  } else if (sk === 'syrup') {
    if (e.tele > 0) { ctx.save(); ctx.globalAlpha = 0.6; ctx.strokeStyle = '#ff4f8f'; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(e.lx - e.x, e.ly - e.y, 58 * (1 - e.tele / 0.8) + 8, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = ol; rrect(ctx, -r * 0.9, -r * 0.7, r * 1.8, r * 1.7, 8); ctx.fillStyle = f ? C.paper : '#ff8fc0'; rrect(ctx, -r * 0.8, -r * 0.6, r * 1.6, r * 1.5, 7);
    ctx.fillStyle = ol; rrect(ctx, -r * 0.55, -r * 1.05, r * 1.1, r * 0.45, 4); ctx.fillStyle = f ? C.paper : '#fff'; rrect(ctx, -r * 0.45, -r * 0.98, r * 0.9, r * 0.3, 3);
    ctx.fillStyle = f ? C.paperDim : '#ff4f8f'; ctx.beginPath(); ctx.arc(0, r * 0.95, r * 0.28 + Math.sin(e.t * 5) * 1.5, 0, TAU); ctx.fill(); eye(-r * 0.3, -r * 0.1); eye(r * 0.3, -r * 0.1);
  } else if (sk === 'roller') {
    if (e.tele > 0) { ctx.save(); ctx.globalAlpha = 0.45; ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(e.ra) * 220, Math.sin(e.ra) * 220); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.rotate(e.state === 'roll' ? e.t * 12 : e.t * 1.5); ctx.fillStyle = ol; circ(ctx, 0, 0, r * 1.08); ctx.fillStyle = f ? C.paper : '#ffd166'; circ(ctx, 0, 0, r);
    ctx.fillStyle = f ? C.paperDim : '#ff6f91'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 0.95, i * 1.571, i * 1.571 + 0.7); ctx.closePath(); ctx.fill(); } ctx.restore(); eye(-r * 0.25, -r * 0.1); eye(r * 0.25, -r * 0.1);
  } else {
    ctx.fillStyle = ol; ctx.beginPath(); ctx.arc(0, r * 0.3, r * 1.08, Math.PI, 0); ctx.lineTo(r * 1.08, r * 0.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = f ? C.paper : hue; ctx.beginPath(); ctx.arc(0, r * 0.3, r, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = f ? C.paperDim : '#fff'; for (let i = 0; i < 6; i++) circ(ctx, Math.cos(i * 1.7) * r * 0.6, r * 0.3 - Math.abs(Math.sin(i * 2.3)) * r * 0.7, 1.8);
    eye(-r * 0.3, 0); eye(r * 0.3, 0);
  }
}
function drawCandyBoss(e) {
  const ctx = L.ctx;
  const fl = e.flash > 0, t = e.t, arm = e.tl && e.tl.act === 'stomp' ? -22 : Math.sin(t * 2) * 6, ol = '#8a3d63';
  ctx.fillStyle = ol; circ(ctx, -66, 10 + arm, 26); circ(ctx, 66, 10 + arm, 26); ctx.fillStyle = fl ? C.paper : '#ffd6a5'; circ(ctx, -66, 8 + arm, 22); circ(ctx, 66, 8 + arm, 22);
  ctx.fillStyle = ol; rrect(ctx, -62, -36, 124, 96, 18); ctx.fillStyle = fl ? C.paper : '#f7b6d2'; rrect(ctx, -57, -32, 114, 88, 15);
  ctx.fillStyle = fl ? C.paper : '#ffffff'; for (let i = -4; i <= 4; i++) circ(ctx, i * 12.5, -28 + (i & 1 ? 7 : 0), 9);
  const sc = ['#6ec6ff', '#ffd166', '#7bd88f', '#ff6f91']; for (let i = 0; i < 10; i++) { ctx.fillStyle = fl ? C.paperDim : sc[i & 3]; rrect(ctx, -44 + (i * 37 % 88), -4 + (i * 17 % 50), 7, 3, 1.5); }
  ctx.fillStyle = ol; circ(ctx, 0, -58, 28); ctx.fillStyle = fl ? C.paper : '#ffe3ef'; circ(ctx, 0, -59, 24);
  ctx.fillStyle = fl ? C.paper : '#e8484f'; circ(ctx, 0, -90, 8); ctx.strokeStyle = '#4c8a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -97); ctx.quadraticCurveTo(6, -108, 14, -106); ctx.stroke();
  ctx.fillStyle = ol; circ(ctx, -9, -62, 4); circ(ctx, 9, -62, 4); ctx.fillRect(-9, -48, 18, 4);
}
function drawArcEnemy(e) {
  const ctx = L.ctx;
  const r = e.r, f = e.flash > 0, sk = e.skin, hue = ['#ff4fd8', '#7df9ff', '#b6ff3b', '#ffd23f'][e.hue | 0], px = Math.max(2, Math.round(r / 4)), ol = '#0a0a24';
  if (sk === 'invader' || sk === 'ghost' || sk === 'slimepx' || sk === 'bombpx') {
    ctx.save(); ctx.translate(Math.sin(e.t * 6) * 1, 0); spr(SPR[sk], px + 1, ol); ctx.restore(); spr(SPR[sk], px, f ? C.paper : hue);
    ctx.fillStyle = f ? C.paperDim : '#fff'; ctx.fillRect(-px * 2, -px, px, px); ctx.fillRect(px, -px, px, px); ctx.fillStyle = ol; ctx.fillRect(-px * 2 + 1, -px + 1, px - 1, px - 1); ctx.fillRect(px + 1, -px + 1, px - 1, px - 1);
  } else if (sk === 'block') {
    ctx.fillStyle = ol; ctx.fillRect(-r - 2, -r - 2, r * 2 + 4, r * 2 + 4); ctx.fillStyle = f ? C.paper : hue; ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-r, -r, r * 2, 4); ctx.fillRect(-r, -r, 4, r * 2); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-r, r - 4, r * 2, 4); ctx.fillRect(r - 4, -r, 4, r * 2);
    ctx.fillStyle = ol; ctx.fillRect(-r * 0.5, -r * 0.2, 5, 5); ctx.fillRect(r * 0.5 - 5, -r * 0.2, 5, 5);
  } else if (sk === 'chomp') {
    if (e.tele > 0) { ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(e.ra) * 220, Math.sin(e.ra) * 220); ctx.stroke(); ctx.restore(); }
    const mo = (e.state === 'roll' ? 0.5 : 0.25) + Math.abs(Math.sin(e.t * 10)) * 0.4, a0 = e.ra || 0;
    ctx.fillStyle = ol; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 1.1, a0 + mo, a0 + TAU - mo); ctx.closePath(); ctx.fill();
    ctx.fillStyle = f ? C.paper : '#ffd23f'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, a0 + mo, a0 + TAU - mo); ctx.closePath(); ctx.fill();
  } else { // glitch
    if (e.tele > 0) { ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#7df9ff'; ctx.lineWidth = 2; ctx.strokeRect(e.lx - e.x - r, e.ly - e.y - r, r * 2, r * 2); ctx.restore(); }
    const j = Math.floor(e.t * 14) % 3 - 1;
    ctx.fillStyle = '#ff4fd8'; ctx.fillRect(-r + j * 3, -r, r * 2, r * 2 * 0.5); ctx.fillStyle = '#7df9ff'; ctx.fillRect(-r - j * 3, 0, r * 2, r); ctx.fillStyle = f ? C.paper : '#fff'; ctx.fillRect(-r * 0.5, -r * 0.3, 5, 5); ctx.fillRect(r * 0.5 - 5, -r * 0.3, 5, 5);
  }
}
function drawArcBoss(e) {
  const ctx = L.ctx;
  const fl = e.flash > 0, t = e.t, arm = e.tl && e.tl.act === 'stomp' ? -22 : Math.sin(t * 2) * 6, ol = '#0a0a24';
  ctx.fillStyle = ol; ctx.fillRect(-84, -10 + arm, 36, 36); ctx.fillRect(48, -10 + arm, 36, 36); ctx.fillStyle = fl ? C.paper : '#ff4fd8'; ctx.fillRect(-80, -6 + arm, 28, 28); ctx.fillRect(52, -6 + arm, 28, 28);
  ctx.fillStyle = ol; ctx.fillRect(-62, -70, 124, 140); ctx.fillStyle = fl ? C.paper : '#3a3a8c'; ctx.fillRect(-56, -64, 112, 128);
  ctx.fillStyle = ol; ctx.fillRect(-44, -54, 88, 62); ctx.fillStyle = fl ? C.paperDim : '#0e2a1e'; ctx.fillRect(-40, -50, 80, 54);
  ctx.fillStyle = '#7df9ff'; spr(SPR.invader, 6, fl ? C.paper : '#7df9ff'); ctx.save(); ctx.translate(0, -23); spr(SPR.invader, 5, fl ? C.paper : '#39ff88'); ctx.restore();
  ctx.fillStyle = '#ffd23f'; ctx.fillRect(-30, 22, 14, 14); ctx.fillStyle = '#ff4f6d'; ctx.fillRect(2, 22, 14, 14); ctx.fillStyle = '#7df9ff'; ctx.fillRect(22, 22, 14, 14);
  ctx.fillStyle = ol; ctx.fillRect(-12, -92, 24, 24); ctx.fillStyle = fl ? C.paper : '#b4b8ff'; ctx.fillRect(-8, -88, 16, 16); ctx.fillStyle = ol; ctx.fillRect(-5, -83, 4, 4); ctx.fillRect(2, -83, 4, 4);
}
function drawArcObs(g, o, rng) {
  const ctx = L.ctx;
  const cols = ['#ff4fd8', '#7df9ff', '#b6ff3b', '#ffd23f', '#ff7a3c'], c = cols[Math.floor(rng() * 5)], B = 22, nx = Math.max(1, Math.round(o.w / B)), ny = Math.max(1, Math.round(o.h / B)), bw = o.w / nx, bh = o.h / ny;
  setShadow(g, 0, 4, 0, 'rgba(0,0,20,.45)'); g.fillStyle = '#0a0a24'; g.fillRect(o.x - 3, o.y - 3, o.w + 6, o.h + 6); noShadow(g);
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const x = o.x + i * bw, y = o.y + j * bh; g.fillStyle = c; g.fillRect(x + 1, y + 1, bw - 2, bh - 2); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x + 1, y + 1, bw - 2, 3); g.fillRect(x + 1, y + 1, 3, bh - 2); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x + 1, y + bh - 4, bw - 2, 3); g.fillRect(x + bw - 4, y + 1, 3, bh - 2); }
}
function drawFutEnemy(e) {
  const ctx = L.ctx;
  const r = e.r, f = e.flash > 0, sk = e.skin, hue = ['#00e5ff', '#ff2e97', '#b6ff3b', '#b388ff'][e.hue | 0], ol = '#0b0626';
  const glow = (col, rad) => { ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = col; circ(ctx, 0, 0, rad); ctx.restore(); };
  glow(hue, r * 1.7);
  if (sk === 'drone') {
    ctx.fillStyle = ol; poly(ctx, [[0, -r * 1.15], [r * 1.05, -r * 0.55], [r * 1.05, r * 0.55], [0, r * 1.15], [-r * 1.05, r * 0.55], [-r * 1.05, -r * 0.55]]);
    ctx.fillStyle = f ? C.paper : '#2b2f6e'; poly(ctx, [[0, -r], [r * 0.9, -r * 0.5], [r * 0.9, r * 0.5], [0, r], [-r * 0.9, r * 0.5], [-r * 0.9, -r * 0.5]]);
    ctx.fillStyle = f ? C.paperDim : hue; circ(ctx, 0, 0, r * 0.42); ctx.strokeStyle = hue; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.25, r * 0.4, e.t * 4, 0, TAU); ctx.stroke();
  } else if (sk === 'turret') {
    ctx.fillStyle = ol; circ(ctx, 0, 0, r * 1.1); ctx.fillStyle = f ? C.paper : '#2b2f6e'; circ(ctx, 0, 0, r); ctx.fillStyle = hue; circ(ctx, 0, 0, r * 0.55);
    const a = Math.atan2(L.p.y - e.y, L.p.x - e.x); ctx.strokeStyle = hue; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.5); ctx.stroke();
  } else if (sk === 'mech') {
    ctx.fillStyle = ol; rrect(ctx, -r * 1.05, -r * 1.05, r * 2.1, r * 2.1, 6); ctx.fillStyle = f ? C.paper : '#3b3f8c'; rrect(ctx, -r, -r, r * 2, r * 2, 5);
    ctx.fillStyle = hue; ctx.fillRect(-r * 0.7, -r * 0.35, r * 1.4, r * 0.35); ctx.fillStyle = f ? C.paperDim : '#7a7ee8'; ctx.fillRect(-r, r * 0.35, r * 2, 4);
  } else if (sk === 'nano') {
    ctx.fillStyle = ol; for (const [x, y] of [[-0.5, -0.3], [0.5, -0.3], [0, 0.55]]) circ(ctx, x * r, y * r, r * 0.62);
    ctx.fillStyle = f ? C.paper : hue; for (const [x, y] of [[-0.5, -0.3], [0.5, -0.3], [0, 0.55]]) circ(ctx, x * r, y * r, r * 0.5);
  } else if (sk === 'mine') {
    ctx.fillStyle = ol; circ(ctx, 0, 0, r * 1.05); for (let i = 0; i < 8; i++) { const a = i * 0.785 + e.t; poly(ctx, [[Math.cos(a - 0.15) * r, Math.sin(a - 0.15) * r], [Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.5], [Math.cos(a + 0.15) * r, Math.sin(a + 0.15) * r]]); }
    ctx.fillStyle = f ? C.paper : '#2b2f6e'; circ(ctx, 0, 0, r * 0.9); ctx.fillStyle = Math.sin(e.t * 8) > 0 ? '#ff2e97' : '#5a1040'; circ(ctx, 0, 0, r * 0.35);
  } else if (sk === 'laser') {
    if (e.tele > 0) { ctx.save(); ctx.globalAlpha = 0.35 + 0.4 * (1 - e.tele / 0.9); ctx.strokeStyle = '#ff2e97'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(e.la) * 700, Math.sin(e.la) * 700); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = ol; poly(ctx, [[0, -r * 1.2], [r * 0.9, 0], [0, r * 1.2], [-r * 0.9, 0]]); ctx.fillStyle = f ? C.paper : '#ff2e97'; poly(ctx, [[0, -r], [r * 0.7, 0], [0, r], [-r * 0.7, 0]]); ctx.fillStyle = '#fff'; circ(ctx, 0, 0, r * 0.25);
  } else { // phase
    if (e.tele > 0) { ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#00e5ff'; ctx.setLineDash([4, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(e.lx - e.x, e.ly - e.y, r * 1.3, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(e.t * 20); ctx.fillStyle = ol; poly(ctx, [[0, -r * 1.15], [r * 1.05, 0], [0, r * 1.15], [-r * 1.05, 0]]); ctx.fillStyle = f ? C.paper : '#b388ff'; poly(ctx, [[0, -r], [r * 0.9, 0], [0, r], [-r * 0.9, 0]]); ctx.globalAlpha = 1;
  }
}
function drawFutBoss(e) {
  const ctx = L.ctx;
  const fl = e.flash > 0, t = e.t, ol = '#0b0626', arm = e.tl && e.tl.act === 'stomp' ? -22 : Math.sin(t * 2) * 6;
  ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#00e5ff'; circ(ctx, 0, 0, 100); ctx.restore();
  ctx.fillStyle = ol; rrect(ctx, -86, -8 + arm, 34, 52, 8); rrect(ctx, 52, -8 + arm, 34, 52, 8); ctx.fillStyle = fl ? C.paper : '#8146e0'; rrect(ctx, -82, -4 + arm, 26, 44, 6); rrect(ctx, 56, -4 + arm, 26, 44, 6);
  ctx.fillStyle = ol; poly(ctx, [[0, -78], [62, -40], [62, 40], [0, 78], [-62, 40], [-62, -40]]); ctx.fillStyle = fl ? C.paper : '#2b2f6e'; poly(ctx, [[0, -70], [55, -36], [55, 36], [0, 70], [-55, 36], [-55, -36]]);
  ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-40, -20); ctx.lineTo(-10, -20); ctx.lineTo(0, -34); ctx.moveTo(40, 22); ctx.lineTo(10, 22); ctx.lineTo(0, 36); ctx.stroke();
  ctx.fillStyle = ol; circ(ctx, 0, 0, 24); ctx.fillStyle = fl ? C.paperDim : '#ff2e97'; circ(ctx, 0, 0, 20); ctx.fillStyle = '#fff'; circ(ctx, Math.cos(e.fa || 0) * 6, Math.sin(e.fa || 0) * 6, 7); ctx.fillStyle = ol; circ(ctx, Math.cos(e.fa || 0) * 8, Math.sin(e.fa || 0) * 8, 3.5);
  ctx.strokeStyle = '#6ff3ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 34, t * 2, t * 2 + 2.2); ctx.stroke();
}
function drawFutObs(g, o, rng) {
  const ctx = L.ctx;
  setShadow(g, 0, 4, 0, 'rgba(0,229,255,.35)'); g.fillStyle = '#0b0626'; rrect(g, o.x - 3, o.y - 3, o.w + 6, o.h + 6, 8); noShadow(g);
  g.fillStyle = '#1d2260'; rrect(g, o.x, o.y, o.w, o.h, 6); g.strokeStyle = '#00e5ff'; g.lineWidth = 3; g.strokeRect(o.x + 3, o.y + 3, o.w - 6, o.h - 6);
  g.strokeStyle = '#ff2e97'; g.lineWidth = 2; g.beginPath(); if (o.w >= o.h) { g.moveTo(o.x + 10, o.y + o.h / 2); g.lineTo(o.x + o.w - 10, o.y + o.h / 2); } else { g.moveTo(o.x + o.w / 2, o.y + 10); g.lineTo(o.x + o.w / 2, o.y + o.h - 10); } g.stroke();
  g.fillStyle = '#6ff3ff'; circ(g, o.x + o.w / 2, o.y + o.h / 2, 4);
}
const SPR = {
  invader: ['00100100', '00011000', '00111100', '01101101', '11111111', '10111101', '10100101', '00011000'],
  ghost: ['00111100', '01111110', '11011011', '11111111', '11111111', '11111111', '11111111', '10110110'],
  slimepx: ['00000000', '00111100', '01111110', '11011011', '11111111', '11111111', '01111110', '00000000'],
  bombpx: ['00001100', '00010000', '00111100', '01111110', '11111111', '11111111', '01111110', '00111100']
};
function spr(rows, px, col, eyeCol) {
  const ctx = L.ctx;
  const n = rows.length, o = -n * px / 2;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (rows[y][x] === '1') { ctx.fillStyle = col; ctx.fillRect(o + x * px, o + y * px, px, px); }
}

L.registerWorld(  { theme: 9, name: '糖果世界', pool: 'dlc', opt: '糖果世界（DLC）', pal: PAL9, amb: ['bandpass', 2400, 3, 0.004], noDark: true, noPaper: true, stage: 'candy',
    skin: { map: CANDY_SKIN, draw: e => drawCandyEnemy(e), hue: true }, obsDraw: (g, o, rng) => drawCandyObs(g, o, rng),
    ev: r => { const n = [659, 784, 988, 1319][Math.floor(r() * 4)]; blip(n, n * 1.01, 0.18, 'sine', 0.015); setTimeout(() => blip(n * 1.5, n * 1.5, 0.2, 'sine', 0.01), 140); },
    boss: fin => fin ? { kind: 'golem', name: '糖霜巨像', hp: 205, candy: true } : { kind: 'golem', name: '蛋糕魔像', hp: 125, candy: true },
    drawBoss: e => drawCandyBoss(e) });

L.registerWorld(  { theme: 10, name: '電玩世界', pool: 'dlc', opt: '電玩世界（DLC）', pal: PAL10, amb: ['lowpass', 900, 0.5, 0.004], noDark: true, noPaper: true, stage: 'arc',
    skin: { map: ARC_SKIN, draw: e => drawArcEnemy(e), hue: false }, obsDraw: (g, o, rng) => drawArcObs(g, o, rng),
    ev: r => { const n = [262, 330, 392, 523, 659][Math.floor(r() * 5)]; blip(n, n, 0.08, 'square', 0.012); setTimeout(() => blip(n * 1.5, n * 1.5, 0.08, 'square', 0.01), 110); },
    boss: fin => fin ? { kind: 'golem', name: '像素魔王', hp: 205, arc: true } : { kind: 'golem', name: '街機巨獸', hp: 125, arc: true },
    drawBoss: e => drawArcBoss(e) });

L.registerWorld(  { theme: 11, name: '未來世界', pool: 'dlc', opt: '未來世界（DLC）', pal: PAL11, amb: ['bandpass', 500, 4, 0.006], noDark: true, noPaper: true, stage: 'fut',
    skin: { map: FUT_SKIN, draw: e => drawFutEnemy(e), hue: true }, obsDraw: (g, o, rng) => drawFutObs(g, o, rng),
    ev: r => { const n = [196, 294, 392, 587][Math.floor(r() * 4)]; blip(n, n * 0.5, 0.35, 'sawtooth', 0.01); },
    boss: fin => fin ? { kind: 'golem', name: '核心主腦', hp: 205, fut: true } : { kind: 'golem', name: '巡邏機甲', hp: 125, fut: true },
    drawBoss: e => drawFutBoss(e) });

/* ================= 字母書房 ================= */
const LET_COL = ['#c45a4a', '#4f86a6', '#7aa04a', '#d9a441', '#8d68b0'];
const OTHER_L = 'BCDEFGHIJKNOQRSTUVWXYZ';
const letterOf = e => {
  if (!e.lt) { const r = L.run; if (L.rand() < 0.7) { const i = r.spC || 0; e.lt = 'LAMP'[i % 4]; r.spC = i + 1; } else e.lt = OTHER_L[Math.floor(L.rand() * OTHER_L.length)]; }
  return e.lt;
};
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
  else { fan(); L.later(0.9, dart); L.later(1.8, flame); L.toast('彼岸之主模仿了所有武器！', 1.8); const h0 = L.run.hurtN; L.later(4.8, () => { if (!e.dead && L.state() === 'play' && L.run.hurtN === h0) L.unlockAch('copyFree'); }); }
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

/* ---- 希臘專屬敵人 AI ---- */
function centaurAi(e, dt, nx, ny, d) { // 半人馬弓手：遠距離繞圈，蓄力後射出三連箭（瞄準蓄力開始的位置）
  const p = L.p; e.cd -= dt;
  const keep = d < 260 ? -1 : d > 400 ? 1 : 0, sw = Math.sin(e.t * 0.9 + e.seed);
  let mx = nx * keep * 70 * e.spd + (-ny) * sw * 46 * e.spd, my = ny * keep * 70 * e.spd + nx * sw * 46 * e.spd;
  if (e.state === 'walk' && e.cd <= 0 && d < 620) { e.state = 'wind'; e.st = 0.8; e.la = Math.atan2(p.y - e.y, p.x - e.x); }
  if (e.state === 'wind') {
    e.tele = e.st; e.st -= dt; mx *= 0.2; my *= 0.2;
    if (e.st <= 0) { e.tele = 0; const a = e.la; for (let k = 0; k < 3; k++) L.later(k * 0.14, () => { if (e.dead || L.state() !== 'play') return; L.enemyShot(e, a, 340); L.sfx('tick'); }); e.state = 'walk'; e.cd = rr(2.4, 3.4) * e.fire; }
  }
  return { mx, my, touch: 1 };
}
function cyclopsAi(e, dt, nx, ny, d) { // 獨眼巨人：慢慢逼近，朝你腳下丟巨石，落地會炸出一圈碎石
  const p = L.p; e.cd -= dt; let mx = nx * 46 * e.spd, my = ny * 46 * e.spd;
  if (e.bo) {
    const b = e.bo; b.t -= dt;
    if (b.t <= 0) {
      L.burst(b.x, b.y, 16, ['#c8c2b4', '#8a6a3a', C.paper], 190, true); L.shake(6); L.sfx('kill');
      const dd = Math.hypot(p.x - b.x, p.y - b.y); if (dd < 64 + p.r * 0.5 && L.state() === 'play') L.hurtFrom('cyclops', 1, (p.x - b.x) / (dd || 1), (p.y - b.y) / (dd || 1));
      const src = { x: b.x, y: b.y, r: 0, bul: e.bul, type: 'cyclops' }, off = rand() * TAU; for (let i = 0; i < 6; i++) L.enemyShot(src, off + i / 6 * TAU, 150);
      e.bo = null; e.state = 'walk'; e.cd = rr(3.2, 4.4) * e.fire;
    }
    mx = 0; my = 0; e.tele = e.bo ? e.bo.t : 0;
  } else if (e.state === 'walk' && e.cd <= 0 && d > 140 && d < 560) { e.state = 'wind'; e.bo = { x: p.x, y: p.y, t: 1.1, dur: 1.1 }; L.sfx('tick'); }
  return { mx, my, touch: 1 };
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
  onFinal: () => { if (L.th() === 12) { L.unlockAch('dictBoss'); if (L.run.hurtN === (L.run.hurtL || 0)) L.unlockAch('inkSafe'); } },
  onMid: () => { if (L.th() !== 12) return; if (L.run.hurtN === (L.run.hurtL || 0)) L.unlockAch('inkSafe'); if (L.enemies.some(b => b.type === 'boss' && b.xk === 'dict')) L.unlockAch('dictBoss'); },
  onKill: e => {
    if (L.th() !== 12 || e.skin !== 'block' || !e.lt) return;
    const r = L.run, need = 'LAMP'[r.spN || 0];
    if (e.lt === need) { r.spN = (r.spN || 0) + 1; L.toast('拼字：' + 'LAMP'.split('').map((ch, i) => i < r.spN ? ch : '＿').join(' '), 1.4); if (r.spN >= 4) { r.spN = 0; L.unlockAch('spell'); } }
  }
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
  onKill: e => { if (L.th() === 13 && e.type === 'dartshade') { const r = L.run; r.dsK = (r.dsK || 0) + 1; if (r.dsK >= 6) { r.dsK = 0; L.unlockAch('dartRet'); } else if (r.dsK >= 3) L.toast('鏢影連殺 ' + r.dsK + '／6', 1.2); } }
});

/* ===== DLC3：佛寺（長條修行路）。玩法在主檔 run.path，這裡放外觀、敵人組成與 Boss ===== */
function zenBg(g, rm, rng, arR) {
  const R = L.ROOM, P = rm.path, V = !!(P && P.v);
  g.fillStyle = 'rgba(30,22,14,.22)'; if (V) g.fillRect(R.x + R.w * 0.3, R.y, R.w * 0.4, R.h); else g.fillRect(R.x, R.y + R.h * 0.3, R.w, R.h * 0.4);
  g.strokeStyle = 'rgba(20,14,8,.35)'; g.lineWidth = 2;
  if (V) { for (let y = R.y; y < R.y + R.h; y += 96) { g.beginPath(); g.moveTo(R.x, y); g.lineTo(R.x + R.w, y); g.stroke(); } for (let x = R.x + 75; x < R.x + R.w; x += 75) { g.beginPath(); g.moveTo(x, R.y); g.lineTo(x, R.y + R.h); g.stroke(); } }
  else { for (let x = R.x; x < R.x + R.w; x += 96) { g.beginPath(); g.moveTo(x, R.y); g.lineTo(x, R.y + R.h); g.stroke(); } for (let y = R.y + 75; y < R.y + R.h; y += 75) { g.beginPath(); g.moveTo(R.x, y); g.lineTo(R.x + R.w, y); g.stroke(); } }
  for (let i = 0; i < Math.round(160 * arR); i++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.fillStyle = 'rgba(' + (rng() < 0.5 ? '60,80,40' : '90,70,50') + ',' + (0.18 + rng() * 0.2) + ')'; circ(g, x, y, 2 + rng() * 4); }
  const lamp = (x, y) => { g.fillStyle = '#b8482c'; circ(g, x, y, 7); g.fillStyle = 'rgba(255,200,120,.5)'; circ(g, x, y, 13); };
  if (V) { for (let y = R.y + 160; y < R.y + R.h; y += 260) for (const xx of [R.x + 10, R.x + R.w - 10]) lamp(xx, y); }
  else for (let x = R.x + 160; x < R.x + R.w; x += 260) for (const yy of [R.y + 10, R.y + R.h - 10]) lamp(x, yy);
  if (P) for (const d of P.dojos) {
    const el = (a, b) => { g.beginPath(); if (V) g.ellipse(d.cx, d.cy, b, a, 0, 0, TAU); else g.ellipse(d.cx, d.cy, a, b, 0, 0, TAU); };
    g.fillStyle = '#4a3a2a'; el(d.w / 2 - 16, 134); g.fill();
    g.fillStyle = '#6a5640'; el(d.w / 2 - 34, 118); g.fill();
    g.strokeStyle = 'rgba(255,214,140,.25)'; g.lineWidth = 2; el(d.w / 2 - 60, 96); g.stroke();
  }
}
function zenObs(g, o, rng) {
  g.fillStyle = '#15110c'; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 8);
  g.fillStyle = '#8b8678'; rrect(g, o.x, o.y + o.h * 0.4, o.w, o.h * 0.6, 6);
  g.fillStyle = '#a49e8d'; rrect(g, o.x + o.w * 0.12, o.y + o.h * 0.16, o.w * 0.76, o.h * 0.32, 5);
  g.fillStyle = '#6f6a5c'; poly(g, [[o.x - 3, o.y + o.h * 0.2], [o.x + o.w + 3, o.y + o.h * 0.2], [o.x + o.w / 2, o.y - 3]]);
  if (rng() < 0.55) { g.fillStyle = '#ffb35c'; g.fillRect(o.x + o.w * 0.4, o.y + o.h * 0.26, o.w * 0.2, o.h * 0.14); }
  g.fillStyle = 'rgba(80,110,60,.5)'; circ(g, o.x + o.w * 0.2, o.y + o.h * 0.9, o.w * 0.14);
}
function drawGuardian(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 1.6) * 3, fin = e.xk === 'guanyin';
  c.fillStyle = 'rgba(255,200,120,.18)'; circ(c, 0, -52 + b, fin ? 92 : 70);
  if (fin) for (let i = 0; i < 8; i++) { const a = t * 0.5 + i / 8 * TAU; c.fillStyle = fl ? C.paper : '#e8c070'; circ(c, Math.cos(a) * 78, -44 + b + Math.sin(a) * 52, 11); c.strokeStyle = '#b88a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(Math.cos(a) * 28, -40 + b + Math.sin(a) * 22); c.lineTo(Math.cos(a) * 70, -44 + b + Math.sin(a) * 47); c.stroke(); }
  c.fillStyle = fl ? C.paper : '#6f6a5c'; c.beginPath(); c.moveTo(-54, 70 + b); c.quadraticCurveTo(-62, -20 + b, 0, -40 + b); c.quadraticCurveTo(62, -20 + b, 54, 70 + b); c.closePath(); c.fill();
  c.fillStyle = fl ? C.paper : '#8b8678'; c.beginPath(); c.moveTo(-40, 66 + b); c.quadraticCurveTo(-46, -10 + b, 0, -28 + b); c.quadraticCurveTo(46, -10 + b, 40, 66 + b); c.closePath(); c.fill();
  c.fillStyle = fl ? C.paper : (fin ? '#f0d8a0' : '#b8482c'); circ(c, 0, -58 + b, 24);
  c.fillStyle = '#1a1008'; c.fillRect(-12, -64 + b, 8, 4); c.fillRect(4, -64 + b, 8, 4); c.fillStyle = fin ? '#c25a4a' : '#ffd23f'; c.fillRect(-8, -50 + b, 16, 3);
  c.fillStyle = '#e8c070'; poly(c, [[-22, -78 + b], [0, -100 + b], [22, -78 + b]]);
}
const ZEN_TRIAL = ['第一問：你放得下身後的影子嗎？', '第二問：你放得下手裡的燈嗎？', '第三問：放下之後，你還認得自己嗎？'];
const ZEN_RULE = ['規則：影子 9 秒內沒打倒，會變成雜念', '規則：一直開火，雜念會上升；停手才會退', '規則：視野變窄了——影子仍會出現'];
const ZEN_YAKSHA = ['夜叉：「走得急的人，影子才多。」', '夜叉：「再快一點？你的影子追得上你。」'];
function zenMoves(e, phase, ang) {
  const p = L.p, fin = e.xk === 'guanyin', aim = () => Math.atan2(p.y - e.y, p.x - e.x);
  if (e.znPh !== phase) { e.znPh = phase; if (fin) { L.toast('千手觀音：「' + ZEN_TRIAL[phase - 1] + '」', 3.6); L.later(3.8, () => { if (!e.dead && L.state() === 'play') L.toast(ZEN_RULE[phase - 1], 3.2); }); } else if (phase > 1) L.toast(ZEN_YAKSHA[phase - 2], 2.8); }
  const a = pickOf(phase === 1 ? ['ring', 'fan'] : phase === 2 ? ['ring', 'fan', 'rain'] : ['ring', 'fan', 'rain', 'spiral']);
  if (a === 'ring') { const n = fin ? 18 : 14, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 150, false, 7); L.sfx('hit'); L.toast('雜念彈！', 1.1); }
  else if (a === 'fan') { for (let w = 0; w < 3; w++) L.later(w * 0.4, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.2, 190, false, 6); L.sfx('hit'); }); }
  else if (a === 'rain') { for (let i = 0; i < (phase === 3 ? 7 : 5); i++) L.markStrike(e, i === 0 ? p.x : p.x + rr(-220, 220), i === 0 ? p.y : p.y + rr(-160, 160), 50, 1.1, {}); L.toast('落下的念頭', 1.3); }
  else { for (let k = 0; k < 14; k++) L.later(k * 0.12, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, e.x, e.y, k * 0.6 + e.t, 140, false, 6); }); L.toast('念頭纏成一圈', 1.3); }
}
L.registerWorld({
  theme: 14, name: '佛寺', pool: 'dlc', opt: '佛寺（DLC3）',
  pal: { ink: '#14100a', floor: '#6a5a44', floor2: '#75654e', wall1: '#2a2016', wall2: '#4a3a28', top: '#e8d8b0', door: '#c25a2a' },
  amb: ['lowpass', 260, 1.2, 0.012], ev: r => { const n = [392, 523, 587][Math.floor(r() * 3)]; L.blip(n, n, 1.2, 'sine', 0.008); },
  noDark: true, bg: zenBg, obsDraw: zenObs,
  roomInit: zkInit, tick: zkTick, back: zkBack, drawItem: zkDraw, useItem: zkUse, info: zkInfo, hint: zkHint,
  ach: [
    { id: 'zkDu', name: '渡人無數', desc: '佛寺・渡化道場：一局度化 20 個敵人' },
    { id: 'zkClear', name: '功德圓滿', desc: '佛寺・渡化道場：通關' },
    { id: 'zkBell', name: '晨鐘暮鼓', desc: '佛寺・修行路：一局撞鐘 3 次' }
  ],
  weapons: {
    shakujo: { id: 'shakujo', name: '錫杖', tag: '近戰', mode: 'tap', cd: 0.6, th: 14, range: 150, half: 0.6, dmg: 5.5, kb: 760, desc: '長柄近戰：窄而長的一記重擊，擊退很強（佛寺專屬；用它打倒敵人功德 +3）' },
    elbow: { id: 'elbow', name: '泰拳肘擊', tag: '近戰連擊', mode: 'auto', cd: 0.22, th: 14, range: 88, half: 1.25, dmg: 2.2, kb: 380, desc: '長按 F 的極近距離快打，範圍廣但很短（佛寺專屬；用它打倒敵人功德 +3）' },
    lotus: { id: 'lotus', name: '蓮花鏢', tag: '穿透', mode: 'tap', cd: 0.55, th: 14, desc: '一次射出三枚穿透的蓮花鏢，中程（佛寺專屬；用它打倒敵人功德 +3）',
      fire: (ox, oy, ang, dm, pd) => { for (const da of [-0.24, 0, 0.24]) L.shoot(ox, oy, ang + da, 520, 7, 2.2 * dm * pd, 'wind', 0.75, true); L.sfx('blade'); } },
    beads: { id: 'beads', name: '念珠串', tag: '扇形連擊', mode: 'auto', cd: 0.34, th: 14, desc: '長按 F，朝瞄準方向彈出一把扇形念珠，射程比一般短彈長（佛寺專屬；用它打倒敵人功德 +3）',
      fire: (ox, oy, ang, dm) => { const n = 6, sp = 0.7; for (let i = 0; i < n; i++) L.shoot(L.p.x + Math.cos(ang) * 14, L.p.y - 4 + Math.sin(ang) * 14, ang + (i / (n - 1) - 0.5) * 2 * sp, 400, 5, 1.5 * dm, 'pellet', 0.62); L.sfx('tick'); } }
  },
  types: (types, L0, ci) => { types.length = 0; types.push('crawler', 'crawler', 'shooter'); if (L0 > 0 || ci >= 1) types.push('splitter'); if (L0 > 0 || ci >= 2) types.push('brute', 'bomber'); },
  boss: fin => fin ? { kind: 'golem', name: '千手觀音（虛）', hp: 205, ext: true, xk: 'guanyin' } : { kind: 'golem', name: '守門夜叉', hp: 125, ext: true, xk: 'yaksha' },
  boss2: zenMoves, drawBoss: drawGuardian,
  onKill: e => {
    const r = L.run; if (L.th() !== 14) return; if (r.karma) { zkKill(e); return; } if (!r.path) return;
    const w = L.WDEF[L.p.weapons[L.p.w]], zen = !!(w && w.th === 14);
    r.merit = (r.merit || 0) + (zen ? 3 : 1);
    if (zen) { L.burst(e.x, e.y, 8, ['#ffe9a0', '#fff6d8'], 120, true); if (!r.duTip) { r.duTip = true; L.toast('度化：用佛寺的武器打倒敵人，功德 +3', 2.8); } }
  },
  onFinal: () => { if (L.th() === 14) { L.unlockAch('zenBoss'); if (L.run.karma) L.unlockAch('zkClear'); else if (!L.run.zenDaze) L.unlockAch('zenCalm'); } },
  pathIntro: layer => layer === 0
    ? [{ who: '旁白', text: '山門在很遠的地方亮著。燈火騎士沿著石板路往上走，身後有什麼，慢慢跟了上來。' }, { who: '旁白', text: '那是沒有被放下的念頭。' }, { who: '小沙彌', text: '施主，別回頭看。看見的越多，它跟得越緊。走累了，前面的道場可以坐一下。' }]
    : layer === 1 ? [{ who: '旁白', text: '第二道山門更高，石階比剛才更陡。念頭也跟得更近了。' }]
    : [{ who: '旁白', text: '最後一段路。遠處有千隻手，在光裡輕輕擺動。' }, { who: '小沙彌', text: '那是觀音。她不會傷人，只會問你問題。' }],
  dojoLine: (layer, i) => [['小沙彌：「念頭不會因為你跑得快就不追，但它追不到安靜的人。」', '小沙彌：「木魚不是敲給別人聽的。」', '小沙彌：「香是燒給自己的。」'], ['小沙彌：「這裡的石階，我每天掃，每天又有落葉。」', '小沙彌：「放下不是丟掉，是不再握緊。」', '小沙彌：「前面就是夜叉了。他只是守門，不是壞人。」'], ['小沙彌：「過了這裡，就看你自己了。」', '小沙彌：「觀音的三個問題，沒有標準答案。」', '小沙彌：「燈是你的，路也是你的。」']][layer][i],
  intro: def => (L.run.layer === 2
    ? [{ who: '千手觀音', text: '提燈的孩子，你一路走來，哪一盞燈是為了自己點的？' }, { who: '千手觀音', text: '我有三問。答不出來沒關係，答出來也沒關係。' }, { who: '旁白', text: '千隻手同時抬起，每一隻手心都有一盞小燈。' }]
    : L.run.layer === 1
      ? [{ who: '守門夜叉', text: '又是你。這一次，你把影子帶來幾個？' }]
      : [{ who: '守門夜叉', text: '山門只讓放得下的人過。你身後拖著多少影子？' }]),
  onMid: () => { if (L.th() === 14) L.later(1.2, () => L.toast(L.run.layer === 0 ? '夜叉讓開了路：「……去吧。第二道門在更高的地方。」' : '夜叉合上眼：「最後一道門後面，有人在等你。」', 3.4)); },
  outro: () => [{ who: '千手觀音', text: '千隻手慢慢垂下，只留一隻，輕輕托起你的燈。' }, { who: '千手觀音', text: '燈沒有變小。是你，不再怕它熄滅了。' }, { who: '旁白', text: '鐘聲一圈一圈散開。心裡的雜音，安靜了一點點。' }]
});

/* ===== DLC3：日本・觀光維護（房間制景點）。玩法掛鉤：obs / roomInit / tick / back / drawItem / useItem / info / hint ===== */
const JP_FAC = { lantern: '石燈籠', bench: '長椅', vend: '自動販賣機', torii: '小鳥居', onsen: '溫泉' };
const JP_HP = 4, JP_PLACE = ['京都石板街', '神社參道', '溫泉街與竹林'];
// 每層景點房的設施位置（房間比例），固定在場景的特色位置
const JP_SLOTS = [
  [['lantern', 0.26, 0.24], ['bench', 0.5, 0.8], ['vend', 0.74, 0.24], ['lantern', 0.82, 0.78]],
  [['lantern', 0.2, 0.78], ['torii', 0.54, 0.5], ['bench', 0.72, 0.2], ['vend', 0.84, 0.76]],
  [['lantern', 0.3, 0.22], ['vend', 0.18, 0.72], ['bench', 0.46, 0.82], ['onsen', 0.72, 0.6]]
];
const JP_BOSS = [['lantern', 0.28, 0.26], ['lantern', 0.72, 0.26], ['lantern', 0.5, 0.82]];
function jpSat(d) { const r = L.run; r.jpSat = clamp((r.jpSat === undefined ? 50 : r.jpSat) + d, 0, 100); }
function jpObs(kind, R, D) {
  const ly = L.run.layer % 3, slots = kind === 'boss' ? JP_BOSS : JP_SLOTS[ly];
  const keep = slots.map(s => ({ x: R.x + R.w * s[1] - 70, y: R.y + R.h * s[2] - 70, w: 140, h: 140 }));
  keep.push({ x: R.x, y: D.y - 90, w: 150, h: 180 }, { x: R.x + R.w - 150, y: D.y - 90, w: 150, h: 180 });
  const kinds = ly === 0 ? ['lantern', 'lantern', 'bamboo', 'jar', 'pot', 'bench'] : ly === 1 ? ['lantern', 'lantern', 'lantern', 'pot', 'jar', 'bamboo'] : ['bamboo', 'bamboo', 'bamboo', 'jar', 'pot', 'lantern'];
  const n = kind === 'boss' ? 9 : 16, obs = [];
  for (let t = 0; t < 500 && obs.length < n; t++) {
    const jk = pickOf(kinds), w = jk === 'bench' ? rr(56, 70) : jk === 'bamboo' ? rr(40, 56) : rr(30, 44), h = jk === 'bench' ? rr(26, 32) : jk === 'bamboo' ? rr(40, 56) : rr(30, 44);
    const o = { x: rr(R.x + 90, R.x + R.w - 90 - w), y: rr(R.y + 40, R.y + R.h - 40 - h), w, h, jk };
    if (keep.some(k => L.overlap(k, o)) || obs.some(q => L.overlap(L.inflate(q, 70), o))) continue;
    obs.push(o);
  }
  return obs;
}
function jpObsDraw(g, o, rng) {
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2, jk = o.jk || 'jar';
  g.save(); g.globalAlpha = 0.92; setShadow(g, 0, 3, 0, 'rgba(30,20,10,.28)');
  if (jk === 'lantern') {
    g.fillStyle = '#8f8a7c'; rrect(g, o.x + o.w * 0.1, o.y + o.h * 0.62, o.w * 0.8, o.h * 0.3, 4); noShadow(g);
    g.fillStyle = '#a7a290'; rrect(g, o.x + o.w * 0.22, o.y + o.h * 0.3, o.w * 0.56, o.h * 0.36, 3); g.fillStyle = '#ffcf7a'; g.fillRect(o.x + o.w * 0.4, o.y + o.h * 0.4, o.w * 0.2, o.h * 0.16);
    g.fillStyle = '#7d786a'; poly(g, [[o.x, o.y + o.h * 0.34], [o.x + o.w, o.y + o.h * 0.34], [cx, o.y + o.h * 0.04]]);
  } else if (jk === 'bamboo') {
    noShadow(g); for (let i = 0; i < 4; i++) { const bx = o.x + o.w * (0.15 + i * 0.23), by = o.y + o.h * (0.3 + (i & 1) * 0.2); g.fillStyle = 'rgba(70,110,60,.9)'; circ(g, bx, by, o.w * 0.2); g.fillStyle = 'rgba(120,170,90,.9)'; circ(g, bx - 2, by - 2, o.w * 0.13); }
  } else if (jk === 'bench') {
    g.fillStyle = '#7a5a3a'; rrect(g, o.x, o.y + o.h * 0.15, o.w, o.h * 0.7, 4); noShadow(g); g.fillStyle = '#9a7650'; rrect(g, o.x + 2, o.y + o.h * 0.2, o.w - 4, o.h * 0.35, 3); g.fillStyle = '#6a4c30'; g.fillRect(o.x + 4, o.y + o.h * 0.6, 5, o.h * 0.3); g.fillRect(o.x + o.w - 9, o.y + o.h * 0.6, 5, o.h * 0.3);
  } else if (jk === 'pot') {
    g.fillStyle = '#9a5a3a'; circ(g, cx, cy + 2, Math.min(o.w, o.h) * 0.44); noShadow(g); g.fillStyle = '#5f8f4a'; for (let k = 0; k < 6; k++) circ(g, cx + Math.cos(k * 1.05) * 6, cy - 2 + Math.sin(k * 1.05) * 6, 7); g.fillStyle = '#e88aa8'; circ(g, cx, cy - 2, 4);
  } else {
    g.fillStyle = '#6f7f86'; circ(g, cx, cy, Math.min(o.w, o.h) * 0.48); noShadow(g); g.fillStyle = '#4a5a62'; circ(g, cx, cy, Math.min(o.w, o.h) * 0.34); g.fillStyle = 'rgba(120,180,210,.7)'; circ(g, cx, cy, Math.min(o.w, o.h) * 0.24);
  }
  g.restore();
}
function jpBg(g, rm, rng, arR) {
  const R = L.ROOM, ly = rm.layer % 3, cy = R.y + R.h / 2;
  if (ly === 0) { // 京都石板街
    for (let y = R.y; y < R.y + R.h; y += 60) for (let x = R.x + (Math.round(y / 60) % 2) * 40; x < R.x + R.w; x += 80) { g.fillStyle = rng() < 0.5 ? 'rgba(60,48,36,.10)' : 'rgba(255,240,210,.07)'; rrect(g, x + 3, y + 3, 74, 54, 6); }
    g.fillStyle = 'rgba(40,24,16,.2)'; g.fillRect(R.x, R.y, R.w, 34); g.fillRect(R.x, R.y + R.h - 34, R.w, 34);
    for (let x = R.x + 120; x < R.x + R.w; x += 230) for (const yy of [R.y + 17, R.y + R.h - 17]) { g.fillStyle = 'rgba(255,190,100,.28)'; circ(g, x, yy, 17); g.fillStyle = '#c0392b'; circ(g, x, yy, 7); }
  } else if (ly === 1) { // 神社參道
    for (let i = 0; i < Math.round(240 * arR); i++) { g.fillStyle = 'rgba(' + (rng() < 0.5 ? '60,50,40' : '240,230,210') + ',' + (0.07 + rng() * 0.08) + ')'; circ(g, R.x + rng() * R.w, R.y + rng() * R.h, 1.5 + rng() * 2.5); }
    g.fillStyle = 'rgba(120,115,104,.38)'; g.fillRect(R.x, cy - 70, R.w, 140);
    for (let x = R.x + 10; x < R.x + R.w - 40; x += 74) { g.strokeStyle = 'rgba(40,36,30,.3)'; g.lineWidth = 2; g.strokeRect(x, cy - 66, 68, 62); g.strokeRect(x + 34, cy + 4, 68, 62); }
    const gx = R.x + R.w * 0.34; g.fillStyle = 'rgba(178,40,32,.5)'; g.fillRect(gx - 8, cy - 152, 16, 304); g.fillStyle = 'rgba(150,30,26,.7)'; g.fillRect(gx - 14, cy - 164, 28, 24); g.fillRect(gx - 14, cy + 140, 28, 24);
    const hx = R.x + R.w * 0.12, hy = R.y + 78; g.fillStyle = 'rgba(80,70,56,.5)'; rrect(g, hx - 56, hy - 34, 112, 68, 8); g.fillStyle = 'rgba(100,160,190,.55)'; rrect(g, hx - 44, hy - 22, 88, 44, 6);
  } else { // 溫泉街與竹林
    for (let y = R.y; y < R.y + R.h; y += 34) { g.fillStyle = (Math.round(y / 34) % 2) ? 'rgba(70,40,20,.10)' : 'rgba(255,230,190,.05)'; g.fillRect(R.x, y, R.w, 34); g.strokeStyle = 'rgba(40,24,12,.22)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(R.x, y); g.lineTo(R.x + R.w, y); g.stroke(); }
    const px = R.x + R.w * 0.72, py = R.y + R.h * 0.6; g.fillStyle = 'rgba(90,84,76,.8)'; g.beginPath(); g.ellipse(px, py, 126, 84, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(110,190,220,.6)'; g.beginPath(); g.ellipse(px, py, 108, 68, 0, 0, TAU); g.fill();
    for (let i = 0; i < Math.round(26 * arR); i++) { const bx = R.x + rng() * R.w, by = rng() < 0.5 ? R.y + 6 + rng() * 20 : R.y + R.h - 26 + rng() * 20; g.strokeStyle = 'rgba(80,130,70,.7)'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + rng() * 6 - 3, by + 18); g.stroke(); }
  }
  for (let i = 0; i < Math.round(22 * arR); i++) { g.fillStyle = rng() < 0.5 ? 'rgba(230,140,160,.35)' : 'rgba(200,120,60,.3)'; circ(g, R.x + rng() * R.w, R.y + rng() * R.h, 2 + rng() * 2.5); }
}

/* ---- 初始化、垃圾、設施 ---- */
function jpTrash(T, x, y) {
  const R = L.ROOM, room = L.room; if (T.trash.length >= 16) return;
  for (let t = 0; t < 30; t++) {
    const tx = x === null ? rr(R.x + 160, R.x + R.w - 160) : x + rr(-34, 34), ty = y === null ? rr(R.y + 50, R.y + R.h - 50) : y + rr(-34, 34);
    if (tx < R.x + 30 || tx > R.x + R.w - 30 || ty < R.y + 30 || ty > R.y + R.h - 30) continue;
    if (room.obs.some(o => L.overlap(L.inflate(o, 12), { x: tx, y: ty, w: 1, h: 1 }))) continue;
    T.trash.push({ x: tx, y: ty, k: Math.floor(rand() * 4), a: rand() * 6 }); return;
  }
}
function jpInit(room, kind) {
  if (kind !== 'combat' && kind !== 'boss') return;
  const r = L.run, R = L.ROOM, layer = r.layer;
  if (r.jpL !== layer) { r.jpL = layer; r.jpSat = 50; }
  const T = room.tour = { fac: [], trash: [], waves: [], slow: false, pulseT: 4, extra: false };
  for (const s of (kind === 'boss' ? JP_BOSS : JP_SLOTS[layer % 3])) {
    const it = { kind: 'tfac', id: 'tfac', fk: s[0], x: R.x + R.w * s[1], y: R.y + R.h * s[2], group: 'prop', price: 0, taken: false, st: kind === 'boss' ? 'ok' : 'broken', hpF: JP_HP, rp: 0, fxDone: kind === 'boss', t: rand() * 6, hurtT: 0 };
    room.items.push(it); T.fac.push(it);
  }
  const n = kind === 'boss' ? 3 : 6 + layer; for (let i = 0; i < n; i++) jpTrash(T, null, null);
  if (kind === 'combat' && room.combatIdx === 0) L.later(1.0, () => { if (L.room !== room) return; L.toast(JP_PLACE[layer % 3] + '：妖怪在搗亂。走過垃圾就能清掉，壞掉的設施靠近後按住 F 修復', 4); });
}
function jpClean(T, i) {
  const q = T.trash.splice(i, 1)[0], r = L.run; jpSat(1.5); L.p.coins += 1; L.sfx('coin'); L.burst(q.x, q.y, 5, ['#fff6d8', '#9ac27a'], 90, true);
  r.jpCleaned = (r.jpCleaned || 0) + 1; if (r.jpCleaned >= 80) L.unlockAch('tourClean');
}
function jpHurtFac(T, f, d) {
  f.hpF -= d; f.hurtT = 0.25;
  if (f.hpF > 0) return;
  f.st = 'ruin'; f.rp = 0; L.burst(f.x, f.y, 22, ['#6b5a4a', '#c9b99a'], 200, true); L.sfx('hurt'); L.shake(5);
  jpSat(-12); L.run.jpRuin = (L.run.jpRuin || 0) + 1; L.toast(JP_FAC[f.fk] + '被破壞了！觀光滿意度下降', 2.6);
  for (let i = 0; i < 3; i++) jpTrash(T, f.x, f.y); L.hintReset();
}
function jpRepair(T, it) {
  const p = L.p; it.st = 'ok'; it.hpF = JP_HP; it.rp = 0; jpSat(it.fxDone ? 4 : 8); L.sfx('clear'); L.burst(it.x, it.y - 10, 18, ['#ffe9a0', C.paper], 170, true); L.hintReset();
  if (it.fxDone) { L.toast(JP_FAC[it.fk] + '修好了', 1.6); return; }
  it.fxDone = true;
  if (it.fk === 'lantern') { L.healP(1); L.toast('石燈籠亮了：燈火 +1，之後會定期震開附近的子彈', 3); }
  else if (it.fk === 'bench') { L.healP(1); L.toast('長椅：休息一下，燈火 +1', 2.4); }
  else if (it.fk === 'vend') { L.dropCoins(it.x, it.y + 34, 8); if (rand() < 0.4) L.pickups.push({ kind: 'oil', x: it.x + 24, y: it.y + 34, t: 0 }); L.toast('販賣機掉出了東西', 2.4); }
  else if (it.fk === 'torii') { p.shield = Math.min(2, (p.shield || 0) + 1); L.toast('鳥居護佑：護盾 +1（擋下一次傷害）', 3); }
  else if (it.fk === 'onsen') { L.healP(1); L.toast('溫泉：燈火 +1，8 秒後再 +1', 3); L.later(8, () => { if (L.state() === 'play' && L.room.tour) { L.healP(1); L.toast('溫泉的暖意：燈火 +1', 1.8); } }); }
}
function jpTick(dt) {
  const room = L.room, T = room && room.tour; if (!T || L.state() !== 'play') return;
  const p = L.p, keys = L.keys, r = L.run;
  for (let i = T.trash.length - 1; i >= 0; i--) { const q = T.trash[i]; if (Math.hypot(p.x - q.x, p.y - q.y) < 30) jpClean(T, i); }
  const slowNow = T.trash.length >= 9; if (slowNow && !T.slow && !r.jpSlowTip) { r.jpSlowTip = true; L.toast('垃圾太多，走路變慢了——碰到垃圾就能清掉', 3); } T.slow = slowNow;
  const hammer = p.weapons[p.w] === 'hammer';
  for (const it of T.fac) {
    it.t += dt; it.hurtT = Math.max(0, it.hurtT - dt);
    if (it.st === 'broken') { if (p.near === it && keys.f) { it.rp += dt / (hammer ? 1 : 2); if (it.rp >= 1) jpRepair(T, it); } else it.rp = Math.max(0, it.rp - dt * 0.8); }
  }
  for (const e of L.enemies) {
    if (e.dead) continue;
    if (!e.tj) { e.tj = 1; if (['crawler', 'splitter', 'splitter2', 'brute'].indexOf(e.type) >= 0 && rand() < 0.6) { const cand = T.fac.filter(f => f.st !== 'ruin').sort((a, b) => Math.hypot(a.x - e.x, a.y - e.y) - Math.hypot(b.x - e.x, b.y - e.y)); if (cand.length) e.tgtF = cand[0]; } }
    const f = e.tgtF; if (!f) continue;
    if (f.st === 'ruin') { e.tgtF = null; continue; }
    if (e.spawn <= 0 && Math.hypot(e.x - f.x, e.y - f.y) < e.r + 34) jpHurtFac(T, f, 0.35 * dt);
  }
  T.pulseT -= dt;
  if (T.pulseT <= 0) {
    T.pulseT = 11;
    for (const f of T.fac) if (f.fk === 'lantern' && f.st === 'ok') { let n = 0; for (const b of L.bullets) if (b.own === 'e' && !b.dead && Math.hypot(b.x - f.x, b.y - f.y) < 150) { b.dead = true; n++; } T.waves.push({ x: f.x, y: f.y, t: 0 }); }
  }
  for (const w of T.waves) w.t += dt; T.waves = T.waves.filter(w => w.t < 0.7);
  if (room.kind === 'boss' && !T.extra && L.enemies.some(e => e.type === 'boss' && !e.dead && e.spawn <= 0)) {
    T.extra = true;
    if ((r.jpSat === undefined ? 50 : r.jpSat) <= 25) { for (let i = 0; i < 3; i++) { const sp = L.freeSpot(13), e = L.spawnEnemy('crawler', sp.x, sp.y); e.sleep = false; } L.toast('觀光滿意度太低：增援的妖怪來了！', 3); }
  }
}
function jpFinish(fin) {
  const r = L.run, room = L.room, T = room && room.tour; if (!T) return;
  const broken = T.fac.filter(f => f.st !== 'ok').length, sat = Math.round(clamp((r.jpSat === undefined ? 50 : r.jpSat) - 4 * broken, 0, 100)), R = L.ROOM;
  if (sat >= 90) L.unlockAch('tourFull');
  if (fin) { if (!r.jpRuin) L.unlockAch('tourKeep'); L.toast('觀光滿意度 ' + sat + (sat >= 70 ? '：大受好評！' : '') , 3); return; }
  L.later(1.0, () => {
    if (sat >= 70) { L.dropCoins(R.x + R.w - 170, L.DOOR.y, 15); L.rewardUpgrade(); L.toast('觀光滿意度 ' + sat + '：大受好評！額外獎勵', 3.2); }
    else L.toast('觀光滿意度 ' + sat + (sat >= 40 ? '：普普通通' : '：評價不太好……'), 2.8);
  });
}

/* ---- 畫面：垃圾、設施、滿意度條 ---- */
function jpBack() {
  const room = L.room, T = room && room.tour; if (!T) return; const c = L.ctx, time = L.time;
  for (const q of T.trash) {
    c.save(); c.translate(q.x, q.y + Math.sin(time * 2 + q.a) * 0.8); c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(0, 7, 11, 4, 0, 0, TAU); c.fill();
    if (q.k === 0) { c.fillStyle = '#9aa4aa'; rrect(c, -5, -8, 10, 15, 3); c.fillStyle = '#d24a3a'; c.fillRect(-5, -3, 10, 5); }
    else if (q.k === 1) { c.fillStyle = '#b5702e'; circ(c, -4, 0, 7); c.fillStyle = '#d39a3c'; circ(c, 4, -2, 6); c.fillStyle = '#8f5424'; circ(c, 1, 4, 5); }
    else if (q.k === 2) { c.strokeStyle = '#e04a8a'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(-9, 2); c.quadraticCurveTo(-3, -9, 2, 2); c.quadraticCurveTo(6, 9, 10, -3); c.stroke(); c.strokeStyle = '#4ab0e0'; c.beginPath(); c.moveTo(-8, 6); c.lineTo(8, 5); c.stroke(); }
    else { c.fillStyle = '#f3efe4'; poly(c, [[-8, -3], [-1, -8], [2, -1], [-4, 3]]); poly(c, [[2, 2], [9, -1], [8, 6], [1, 7]]); }
    c.restore();
  }
  for (const w of T.waves) { c.save(); c.globalAlpha = 0.6 * (1 - w.t / 0.7); c.strokeStyle = '#ffe0a0'; c.lineWidth = 4; c.beginPath(); c.arc(w.x, w.y, 20 + w.t / 0.7 * 130, 0, TAU); c.stroke(); c.restore(); }
}
function jpDrawFac(it) {
  const c = L.ctx, time = L.time, st = it.st, ok = st === 'ok', ruin = st === 'ruin', fk = it.fk;
  c.save(); c.translate(it.x, it.y);
  c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(0, 22, 30, 8, 0, 0, TAU); c.fill();
  if (st === 'broken') c.rotate(Math.sin(it.t * 7) * 0.012 + 0.04);
  if (ruin) {
    c.fillStyle = '#6b6258'; for (let k = 0; k < 6; k++) { c.beginPath(); c.ellipse(Math.cos(k * 1.7) * 14, Math.sin(k * 2.3) * 8 + 8, 9, 6, k, 0, TAU); c.fill(); }
    c.fillStyle = '#4a433b'; for (let k = 0; k < 4; k++) circ(c, Math.cos(k * 2.1 + 1) * 18, Math.sin(k * 1.3) * 6 + 10, 5);
  } else if (fk === 'lantern') {
    c.fillStyle = ok ? '#a8a290' : '#7b766a'; rrect(c, -16, 8, 32, 16, 4); rrect(c, -9, -4, 18, 14, 3);
    c.fillStyle = ok ? '#c9c3ae' : '#8a8578'; rrect(c, -14, -22, 28, 20, 4); c.fillStyle = ok ? '#ffd27a' : '#2a2620'; c.fillRect(-7, -17, 14, 10);
    c.fillStyle = ok ? '#8d8774' : '#6a665a'; poly(c, [[-22, -20], [22, -20], [0, -38]]);
    if (ok) { c.globalAlpha = 0.28 + 0.06 * Math.sin(time * 4 + it.t); c.fillStyle = '#ffd27a'; circ(c, 0, -12, 34); } else { c.strokeStyle = '#2a2620'; c.lineWidth = 2; c.beginPath(); c.moveTo(-4, -20); c.lineTo(2, -10); c.lineTo(-3, -4); c.stroke(); }
  } else if (fk === 'bench') {
    c.fillStyle = ok ? '#8a6540' : '#5f4630'; rrect(c, -30, -6, 60, 14, 4); c.fillStyle = ok ? '#a67c50' : '#6f5238'; rrect(c, -28, -12, 56, 8, 3);
    c.fillStyle = '#5a4028'; c.fillRect(-26, 8, 6, 12); if (ok) c.fillRect(20, 8, 6, 12); else { c.save(); c.translate(20, 14); c.rotate(0.7); c.fillRect(-3, -6, 6, 12); c.restore(); }
  } else if (fk === 'vend') {
    c.fillStyle = ok ? '#2f86c8' : '#4a5b68'; rrect(c, -18, -30, 36, 54, 5); c.fillStyle = ok ? '#bff0ff' : '#1d262d'; rrect(c, -13, -25, 26, 26, 3);
    if (ok) { c.fillStyle = '#ff6a6a'; c.fillRect(-9, -20, 6, 14); c.fillStyle = '#ffd24a'; c.fillRect(-1, -20, 6, 14); c.fillStyle = '#7ad07a'; c.fillRect(7, -20, 4, 14); }
    c.fillStyle = '#1b1b1b'; c.fillRect(-12, 8, 24, 10); c.fillStyle = ok ? '#ffe9a0' : '#555'; c.fillRect(-12, 3, 8, 3);
    if (!ok && Math.sin(it.t * 9) > 0.7) { c.fillStyle = '#9fe0ff'; c.fillRect(-12, -24, 24, 4); }
  } else if (fk === 'torii') {
    c.fillStyle = ok ? '#c8352a' : '#7a2a24'; c.fillRect(-28, -26, 8, 48); c.fillRect(20, -26, 8, 48); c.fillRect(-34, -28, 68, 8);
    c.fillStyle = ok ? '#1b1210' : '#2a1a18'; c.fillRect(-36, -32, 72, 6); c.fillStyle = ok ? '#c8352a' : '#7a2a24'; c.fillRect(-26, -16, 52, 6);
    if (!ok) { c.strokeStyle = '#2a1a18'; c.lineWidth = 3; c.beginPath(); c.moveTo(-6, -26); c.lineTo(2, -14); c.stroke(); }
  } else if (fk === 'onsen') {
    c.fillStyle = ok ? 'rgba(130,210,235,.5)' : 'rgba(110,84,52,.65)'; c.beginPath(); c.ellipse(0, 0, 96, 58, 0, 0, TAU); c.fill();
    if (ok) for (let k = 0; k < 4; k++) { const ph = (time * 0.5 + k * 0.25) % 1; c.globalAlpha = 0.5 * (1 - ph); c.fillStyle = '#ffffff'; circ(c, Math.sin(k * 3 + time) * 30, -ph * 50, 12 + ph * 12); c.globalAlpha = 1; }
    else { c.fillStyle = '#2a2620'; rrect(c, -10, -34, 20, 18, 3); }
  }
  c.globalAlpha = 1;
  if (!ruin && it.hpF < JP_HP) { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(-20, 30, 40, 6); c.fillStyle = it.hurtT > 0 ? '#fff' : '#e0604a'; c.fillRect(-19, 31, 38 * Math.max(0, it.hpF) / JP_HP, 4); }
  if (it.rp > 0 && st === 'broken') { c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 8; c.beginPath(); c.arc(0, -4, 38, 0, TAU); c.stroke(); c.strokeStyle = '#ffe9a0'; c.lineWidth = 5; c.beginPath(); c.arc(0, -4, 38, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, it.rp)); c.stroke(); }
  if (st === 'broken' && it.rp <= 0) { c.fillStyle = '#ffd24a'; c.font = '700 16px sans-serif'; c.textAlign = 'center'; c.fillText('！', 0, -46 + Math.sin(L.time * 5) * 2); }
  c.restore();
}
function jpInfo(it) {
  const nm = JP_FAC[it.fk];
  const fx = { lantern: '修好：燈火 +1，之後每 11 秒震開附近的敵方子彈', bench: '修好：燈火 +1', vend: '修好：掉出燈芯，有機會有燈油', torii: '修好：護盾 +1', onsen: '修好：燈火 +1，8 秒後再 +1' }[it.fk];
  if (it.st === 'ruin') return { name: nm + '（毀壞）', desc: '已經被妖怪破壞，只剩一堆碎片。觀光滿意度已經下降' };
  if (it.st === 'ok') return { name: nm, desc: '運作中。妖怪會來破壞它——修好的設施要保護好（血量 ' + Math.max(0, Math.ceil(it.hpF)) + ' / ' + JP_HP + '）' };
  return { name: nm + '（故障）', desc: '按住 F 約 2 秒修復（修繕槌 1 秒；修復時不能攻擊）。' + fx };
}
function jpHint(it) { return it.st === 'broken' ? '按住 F 修復' : ''; }
function jpUse(it) { if (it.st === 'broken' && !L.run.jpHoldTip) { L.run.jpHoldTip = true; L.toast('按「住」F 不放，修復進度條會慢慢滿起來', 2.8); } }
function jpHud() {
  const st = document.createElement('style');
  st.textContent = '#tourBar{position:absolute;top:1.2cqw;left:50%;transform:translateX(-50%);display:flex;gap:.6cqw;align-items:center;color:var(--paper);font-size:clamp(10px,1.3cqw,15px);pointer-events:none;z-index:6;text-shadow:0 1px 2px #000}#tourBar i{display:block;width:16cqw;height:.9cqw;min-height:7px;background:rgba(0,0,0,.55);border:1px solid #c9b99a}#tourBar b{display:block;height:100%;width:0;background:#8fd08a}#tourBar em{font-style:normal;color:#ffd27a;margin-left:.6cqw}#tourBar[hidden]{display:none}';
  document.head.appendChild(st);
  const bar = document.createElement('div'); bar.id = 'tourBar'; bar.hidden = true; bar.innerHTML = '<span>觀光滿意度</span><i><b></b></i><em></em>'; L.stageEl.appendChild(bar);
  const fill = bar.querySelector('b'), txt = bar.querySelector('em');
  setInterval(() => {
    const room = L.room, T = room && room.tour, s = L.state(), on = L.th() === 15 && !!T && s !== 'menu' && s !== 'over'; bar.hidden = !on; if (!on) return;
    const v = L.run.jpSat === undefined ? 50 : L.run.jpSat; fill.style.width = v.toFixed(0) + '%'; fill.style.background = v >= 70 ? '#8fd08a' : v > 25 ? '#ffd27a' : '#e0604a';
    txt.textContent = '垃圾 ' + T.trash.length + '　設施 ' + T.fac.filter(f => f.st === 'ok').length + '/' + T.fac.length;
  }, 150);
}

/* ---- 妖怪與 Boss ---- */
function drawYokai(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, t = e.t, bob = Math.sin(t * 3 + e.seed) * 2, ol = '#241812', p = L.p, fa = Math.atan2(p.y - e.y, p.x - e.x);
  const eye = (x, y, s) => { c.fillStyle = '#fff6d8'; circ(c, x, y, s); c.fillStyle = f ? '#c00' : '#2a1010'; circ(c, x + Math.cos(fa) * s * 0.35, y + Math.sin(fa) * s * 0.35, s * 0.5); };
  if (sk === 'kasa') {
    c.fillStyle = ol; circ(c, 0, bob, r * 1.12); c.fillStyle = f ? C.paper : '#c8473a'; circ(c, 0, bob, r);
    c.strokeStyle = '#7a2a20'; c.lineWidth = 2; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; c.beginPath(); c.moveTo(0, bob); c.lineTo(Math.cos(a) * r, bob + Math.sin(a) * r); c.stroke(); }
    c.fillStyle = f ? C.paperDim : '#e8a090'; circ(c, 0, bob, r * 0.5); eye(Math.cos(fa) * r * 0.1, bob + Math.sin(fa) * r * 0.1, r * 0.28);
    c.fillStyle = '#ff7a9a'; c.beginPath(); c.ellipse(Math.cos(fa) * r * 1.0, bob + Math.sin(fa) * r * 1.0, r * 0.22, r * 0.34, fa + Math.PI / 2, 0, TAU); c.fill();
  } else if (sk === 'chochin') {
    c.fillStyle = 'rgba(255,200,110,.25)'; circ(c, 0, bob, r * 1.7); c.fillStyle = ol; circ(c, 0, bob, r * 1.1); c.fillStyle = f ? C.paper : '#f2d49a'; circ(c, 0, bob, r);
    c.strokeStyle = '#a2742c'; c.lineWidth = 1.8; for (const k of [0.78, 0.55]) { c.beginPath(); c.arc(0, bob, r * k, 0, TAU); c.stroke(); }
    c.fillStyle = '#2a1a14'; rrect(c, -r * 0.3, bob - r * 1.15, r * 0.6, r * 0.28, 3);
    eye(-r * 0.3, bob - r * 0.1, r * 0.2); eye(r * 0.3, bob - r * 0.1, r * 0.2); c.fillStyle = '#ff6a8a'; c.beginPath(); c.ellipse(0, bob + r * 0.4, r * 0.18, r * 0.34, 0, 0, TAU); c.fill();
  } else if (sk === 'oni') {
    c.fillStyle = ol; circ(c, 0, bob, r * 1.1); c.fillStyle = f ? C.paper : '#c7413a'; circ(c, 0, bob, r);
    c.fillStyle = '#f2e6c8'; poly(c, [[-r * 0.6, bob - r * 0.7], [-r * 0.35, bob - r * 1.45], [-r * 0.1, bob - r * 0.8]]); poly(c, [[r * 0.6, bob - r * 0.7], [r * 0.35, bob - r * 1.45], [r * 0.1, bob - r * 0.8]]);
    c.strokeStyle = '#2a1010'; c.lineWidth = 3; c.beginPath(); c.moveTo(-r * 0.6, bob - r * 0.3); c.lineTo(-r * 0.1, bob - r * 0.1); c.moveTo(r * 0.6, bob - r * 0.3); c.lineTo(r * 0.1, bob - r * 0.1); c.stroke();
    eye(-r * 0.32, bob - r * 0.02, r * 0.17); eye(r * 0.32, bob - r * 0.02, r * 0.17); c.fillStyle = '#2a1010'; rrect(c, -r * 0.4, bob + r * 0.3, r * 0.8, r * 0.3, 3); c.fillStyle = '#fff6d8'; poly(c, [[-r * 0.3, bob + r * 0.3], [-r * 0.2, bob + r * 0.5], [-r * 0.1, bob + r * 0.3]]); poly(c, [[r * 0.3, bob + r * 0.3], [r * 0.2, bob + r * 0.5], [r * 0.1, bob + r * 0.3]]);
  } else if (sk === 'tanuki') {
    c.fillStyle = ol; circ(c, 0, bob, r * 1.1); c.fillStyle = f ? C.paper : '#9a7048'; circ(c, 0, bob, r); circ(c, -r * 0.7, bob - r * 0.75, r * 0.3); circ(c, r * 0.7, bob - r * 0.75, r * 0.3);
    c.fillStyle = f ? C.paperDim : '#e8d4aa'; circ(c, 0, bob + r * 0.25, r * 0.55); c.fillStyle = '#3a2a1c'; c.beginPath(); c.ellipse(-r * 0.35, bob - r * 0.1, r * 0.26, r * 0.18, -0.3, 0, TAU); c.ellipse(r * 0.35, bob - r * 0.1, r * 0.26, r * 0.18, 0.3, 0, TAU); c.fill();
    c.fillStyle = '#fff6d8'; circ(c, -r * 0.35, bob - r * 0.1, r * 0.08); circ(c, r * 0.35, bob - r * 0.1, r * 0.08); c.fillStyle = '#6fa356'; poly(c, [[-r * 0.2, bob - r * 1.0], [0, bob - r * 1.55], [r * 0.2, bob - r * 1.0]]);
  } else if (sk === 'hitodama') {
    const fl = 1 + Math.sin(t * 9) * 0.12; for (let i = 3; i >= 1; i--) { c.fillStyle = 'rgba(120,170,255,' + (0.18 + 0.08 * (4 - i)) + ')'; circ(c, -Math.cos(fa) * i * r * 0.5, bob - Math.sin(fa) * i * r * 0.5, r * (1 - i * 0.18)); }
    c.fillStyle = f ? C.paper : '#7aa6ff'; circ(c, 0, bob, r * fl); c.fillStyle = '#e8f2ff'; circ(c, 0, bob, r * 0.55); c.fillStyle = '#2a3a6a'; circ(c, -r * 0.25, bob - r * 0.05, r * 0.1); circ(c, r * 0.25, bob - r * 0.05, r * 0.1);
  }
}
function drawLanternBoss(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 1.8) * 4;
  c.fillStyle = 'rgba(255,170,80,.2)'; circ(c, 0, b, 96); c.fillStyle = '#1b100a';
  c.strokeStyle = '#1b100a'; c.lineWidth = 6; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 30, 52 + b); c.lineTo(sx * 40, 78 + b); c.stroke(); c.beginPath(); c.moveTo(sx * 62, 0 + b); c.quadraticCurveTo(sx * 90, 12 + b, sx * 84, 38 + b + Math.sin(t * 3) * 6); c.stroke(); }
  c.beginPath(); c.ellipse(0, b, 66, 74, 0, 0, TAU); c.fill(); c.fillStyle = fl ? C.paper : '#d9482e'; c.beginPath(); c.ellipse(0, b, 60, 68, 0, 0, TAU); c.fill();
  c.strokeStyle = '#7a1e12'; c.lineWidth = 3; for (const k of [-40, -20, 0, 20, 40]) { c.beginPath(); c.moveTo(-58 * Math.sqrt(1 - (k / 68) ** 2), b + k); c.lineTo(58 * Math.sqrt(1 - (k / 68) ** 2), b + k); c.stroke(); }
  c.fillStyle = '#1b100a'; c.fillRect(-34, b - 80, 68, 14); c.fillRect(-34, b + 66, 68, 14);
  c.fillStyle = '#fff6d8'; c.beginPath(); c.ellipse(-22, b - 14, 14, 11, -0.3, 0, TAU); c.ellipse(22, b - 14, 14, 11, 0.3, 0, TAU); c.fill(); c.fillStyle = '#2a0e0a'; circ(c, -20, b - 12, 6); circ(c, 20, b - 12, 6);
  c.fillStyle = '#2a0e0a'; c.beginPath(); c.ellipse(0, b + 26, 26, 14, 0, 0, TAU); c.fill(); c.fillStyle = '#ff6a8a'; c.beginPath(); c.ellipse(0, b + 40 + Math.sin(t * 4) * 3, 9, 20, 0, 0, TAU); c.fill();
}
function drawHyakki(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 1.6) * 4, cols = ['#f2e6c8', '#4a7ac8', '#c8a03a', '#7aa84a', '#a05ac8', '#e08a3a'];
  c.fillStyle = 'rgba(160,110,255,.18)'; circ(c, 0, b, 110);
  for (let i = 0; i < 6; i++) { const a = t * 0.6 + i / 6 * TAU, x = Math.cos(a) * 82, y = b + Math.sin(a) * 58; c.fillStyle = '#1b100a'; circ(c, x, y, 21); c.fillStyle = fl ? C.paper : cols[i]; circ(c, x, y, 18); c.fillStyle = '#2a1010'; circ(c, x - 6, y - 3, 3); circ(c, x + 6, y - 3, 3); c.fillRect(x - 5, y + 6, 10, 2); if (i % 2 === 0) { c.fillStyle = '#e8d8a8'; poly(c, [[x - 10, y - 12], [x - 6, y - 24], [x - 2, y - 12]]); poly(c, [[x + 2, y - 12], [x + 6, y - 24], [x + 10, y - 12]]); } }
  c.fillStyle = '#1b100a'; circ(c, 0, b, 50); c.fillStyle = fl ? C.paper : '#b8342e'; circ(c, 0, b, 45);
  c.fillStyle = '#f2e6c8'; poly(c, [[-30, b - 30], [-18, b - 74], [-6, b - 36]]); poly(c, [[30, b - 30], [18, b - 74], [6, b - 36]]);
  c.strokeStyle = '#2a0e0a'; c.lineWidth = 4; c.beginPath(); c.moveTo(-30, b - 14); c.lineTo(-8, b - 4); c.moveTo(30, b - 14); c.lineTo(8, b - 4); c.stroke();
  c.fillStyle = '#fff6d8'; circ(c, -16, b - 2, 8); circ(c, 16, b - 2, 8); c.fillStyle = '#2a0e0a'; circ(c, -15, b, 4); circ(c, 15, b, 4); c.fillRect(-22, b + 18, 44, 12); c.fillStyle = '#fff6d8'; poly(c, [[-18, b + 18], [-12, b + 30], [-6, b + 18]]); poly(c, [[18, b + 18], [12, b + 30], [6, b + 18]]);
}
function jpMoves(e, phase, ang) {
  const p = L.p, fin = e.xk === 'hyakki', room = L.room, T = room.tour, aim = () => Math.atan2(p.y - e.y, p.x - e.x);
  const pool = phase === 1 ? ['fan', 'ring', 'smash'] : phase === 2 ? ['fan', 'ring', 'smash', 'call'] : ['fan', 'ring', 'smash', 'call', 'rain'];
  const a = pickOf(pool);
  if (a === 'fan') { for (let w = 0; w < 3; w++) L.later(w * 0.4, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.2, 190, false, 6); L.sfx('hit'); }); L.toast(fin ? '鬼火連發' : '燈籠噴火', 1.2); }
  else if (a === 'ring') { const n = fin ? 18 : 14, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 150, false, 7); L.sfx('hit'); L.toast('火光一圈', 1.1); }
  else if (a === 'smash') {
    const cand = T ? T.fac.filter(f => f.st === 'ok') : []; if (!cand.length) return;
    for (let k = 0; k < (fin && phase >= 2 ? 2 : 1) && cand.length; k++) {
      const f = cand.splice(Math.floor(rand() * cand.length), 1)[0];
      L.markStrike(e, f.x, f.y, 70, 1.3, {}); L.toast('設施被盯上了！趕快離開、或事後修好它', 2);
      L.later(1.35, () => { if (e.dead || L.room !== room || f.st !== 'ok') return; f.st = 'broken'; f.hpF = JP_HP; f.rp = 0; jpSat(-3); L.burst(f.x, f.y, 16, ['#6b5a4a', '#ffd27a'], 180, true); L.sfx('hurt'); L.hintReset(); });
    }
  }
  else if (a === 'call') { const alive = L.enemies.filter(q => !q.dead && q.type !== 'boss').length; if (alive < 6) for (let i = 0; i < 2; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy('crawler', sp.x, sp.y); m.sleep = false; } L.toast('小妖怪被叫來了', 1.4); }
  else { for (let i = 0; i < (phase === 3 ? 7 : 5); i++) L.markStrike(e, i === 0 ? p.x : p.x + rr(-220, 220), i === 0 ? p.y : p.y + rr(-160, 160), 50, 1.1, {}); L.toast('燈火亂落', 1.3); }
}
L.registerWorld({
  theme: 15, name: '日本', pool: 'dlc', opt: '日本・觀光維護（DLC3）',
  pal: { ink: '#1a1210', floor: '#8a7a62', floor2: '#93836a', wall1: '#3a2418', wall2: '#6a4430', top: '#f0e0c0', door: '#c0392b' },
  amb: ['bandpass', 1800, 2, 0.004], ev: r => { const n = [523, 587, 784, 880][Math.floor(r() * 4)]; L.blip(n, n * 0.995, 0.7, 'sine', 0.008); },
  noDark: true, bg: jpBg, obsDraw: jpObsDraw, obs: jpObs, roomInit: jpInit, tick: jpTick, back: jpBack, drawItem: jpDrawFac, info: jpInfo, hint: jpHint, useItem: jpUse,
  skin: { map: { crawler: 'kasa', shooter: 'chochin', brute: 'oni', splitter: 'tanuki', splitter2: 'tanuki', bomber: 'hitodama' }, draw: drawYokai, hue: false },
  weapons: {
    broom: { id: 'broom', name: '竹掃帚', tag: '掃圈', mode: 'tap', cd: 0.45, th: 15, range: 122, half: 1.7, dmg: 3.4, kb: 420, desc: '近戰橫掃，範圍很寬；揮動時順便把周圍 150 像素內的垃圾掃乾淨（日本專屬）',
      fire: (ox, oy, ang) => { L.meleeSwing(L.WDEF.broom, ang, 1); const T = L.room.tour; if (T) for (let i = T.trash.length - 1; i >= 0; i--) { const q = T.trash[i]; if (Math.hypot(L.p.x - q.x, L.p.y - q.y) < 150) jpClean(T, i); } } },
    bow: { id: 'bow', name: '和弓', tag: '遠程', mode: 'tap', cd: 0.7, th: 15, desc: '慢速單發的長箭，射程遠、傷害高（日本專屬）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 780, 6, 6.2 * dm, 'lance', 1.0); L.sfx('blade'); } },
    hammer: { id: 'hammer', name: '修繕槌', tag: '重擊', mode: 'tap', cd: 0.75, th: 15, range: 108, half: 0.95, dmg: 6.6, kb: 620, desc: '短柄重錘，一下很痛；拿著它修設施只要 1 秒（日本專屬）' },
    shuriken: { id: 'shuriken', name: '手裡劍', tag: '速射', mode: 'auto', cd: 0.24, th: 15, desc: '長按 F 的連續小飛鏢，射程中等（日本專屬）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang + (rand() - 0.5) * 0.1, 620, 5, 1.55 * dm, 'pellet', 0.65); L.sfx('tick'); } }
  },
  ach: [
    { id: 'tourFull', name: '滿堂喝采', desc: '日本・觀光維護：擊敗景點 Boss 時，觀光滿意度達 90 以上' },
    { id: 'tourClean', name: '環保志工', desc: '日本・觀光維護：一局清掉 80 個垃圾' },
    { id: 'tourKeep', name: '設施守護者', desc: '日本・觀光維護：整局沒有任何設施被破壞，擊敗百鬼夜行' }
  ],
  types: (types, L0, ci) => { types.length = 0; types.push('crawler', 'crawler', 'shooter'); if (L0 > 0 || ci >= 1) types.push('splitter'); if (L0 > 0 || ci >= 2) types.push('brute', 'bomber'); },
  boss: fin => fin ? { kind: 'golem', name: '百鬼夜行', hp: 205, ext: true, xk: 'hyakki' } : { kind: 'golem', name: '破壞神燈籠', hp: 125, ext: true, xk: 'lanternb' },
  boss2: jpMoves, drawBoss: e => (e.xk === 'hyakki' ? drawHyakki(e) : drawLanternBoss(e)),
  intro: def => (L.run.layer === 2
    ? [{ who: '旁白', text: '祭典廣場的燈籠一盞接一盞亮起，每一盞下面，都藏著一張臉。' }, { who: '導覽小鈴', text: '那是百鬼夜行！今晚的遊客……是妖怪們自己啊！' }, { who: '導覽小鈴', text: '設施被弄壞了也沒關係，修好它，客人就會回來。' }]
    : L.run.layer === 1
      ? [{ who: '旁白', text: '參道盡頭的大燈籠搖晃起來，睜開了一隻眼睛。' }, { who: '導覽小鈴', text: '又是燈籠？這次它比上次更生氣。' }]
      : [{ who: '旁白', text: '石板街的燈籠一盞一盞熄了，最大的那盞，睜開了眼睛。' }, { who: '導覽小鈴', text: '歡迎來到京都……啊，那不是景點設施，那是妖怪！' }]),
  onKill: e => { if (L.th() !== 15) return; const T = L.room && L.room.tour; if (T && rand() < 0.22) jpTrash(T, e.x, e.y); },
  onMid: () => { if (L.th() === 15) jpFinish(false); },
  onFinal: () => { if (L.th() === 15) jpFinish(true); },
  outro: () => [{ who: '旁白', text: '最後一盞燈籠亮起來，天色從紫轉成金色。' }, { who: '導覽小鈴', text: '遊客們回來了！今天的評價……應該不錯吧？' }, { who: '旁白', text: '妖怪們收起行李，排隊離開。下次祭典，再見。' }]
});
/* ===== DLC3：希臘神話（run.greek）。超大地圖＋市集／祭壇／神話事件；美術＝黑繪式陶器 ===== */
const GK_PAL = { ink: '#1a1410', floor: '#b5714a', floor2: '#bd7a52', wall1: '#2a1a12', wall2: '#4a2c1c', top: '#f0d9b0', door: '#2a6aa0' };
const GK_BLK = '#1a1410', GK_ORG = '#e08a4c', GK_CRM = '#f0d9b0';
const GK_EV = ['oracle', 'zeus', 'siren', 'labyr', 'pandora', 'styx', 'dion'];
const GK_NAME = { oracle: '德爾菲神諭', zeus: '宙斯的試煉', siren: '海妖之歌', labyr: '米諾陶迷宮', pandora: '潘朵拉的盒子', styx: '冥河擺渡', dion: '酒神狂歡', god: '神祇祭壇' };
const GK_ZONE = ['港口', '神殿', '市集廣場', '橄欖林', '中庭', '迷宮入口'];
const GK_GODS = {
  apollo: { name: '阿波羅', ups: ['shade', 'crit'], desc: '燈光範圍 +15%、暴擊率 +10%' },
  athena: { name: '雅典娜', ups: ['wick'], shield: 1, desc: '最大血量 +1，並得到護盾 +1' },
  ares: { name: '阿瑞斯', ups: ['oil', 'oil'], desc: '傷害 +40%（兩次烈焰油）' },
  hermes: { name: '赫密斯', ups: ['shoes', 'hands'], desc: '移動速度 +10%、攻擊間隔 −12%' },
  demeter: { name: '狄蜜特', ups: ['wick'], heal: 3, desc: '最大血量 +1，並恢復 3 點燈火' }
};
const GK_STORY = [
  [{ who: '旁白', text: '黑色的人影在陶罐的表面一個接一個轉過身來。這一頁的故事，從市集開始。' }, { who: '陶工', text: '（陶罐裡傳出老人的聲音）想走出去，先去祭壇求個恩賜；市集在右上角，神話的事件散在各處，地圖邊緣的黃色箭頭就是。' }],
  [{ who: '旁白', text: '神殿的影子更長了。第二頁，罐子上的人像都低著頭。' }, { who: '陶工', text: '前面那位蛇髮的女士，不要直視她。柱子後面，是最好的朋友。' }],
  [{ who: '旁白', text: '最後一頁。陶罐的底部畫著一座迷宮，迷宮的中央，有一個很大的影子。' }, { who: '陶工', text: '米諾陶不是壞蛋，只是一個關了太久的人。別手軟，但也別忘了，你的燈還亮著。' }]
];
let GK = null;
function gkMake(R) {
  const zw = R.w / 3, zh = R.h / 2, zc = z => ({ x: R.x + (z % 3 + 0.5) * zw, y: R.y + (Math.floor(z / 3) + 0.5) * zh });
  const evs = L.shuffle(GK_EV.slice()).slice(0, 3), zs = L.shuffle([0, 3, 4, 5]);
  const c2 = zc(2), c1 = zc(1), slots = [{ fk: 'market', x: R.x + R.w - 340, y: R.y + 170 }, { fk: 'altar', x: c1.x, y: c1.y - 70 }];
  evs.forEach((fk, i) => { const c = zc(zs[i]); slots.push(fk === 'labyr' ? { fk, x: c.x, y: c.y } : { fk, x: c.x + rr(-110, 110), y: c.y + rr(-80, 80) }); });
  GK = { slots, R: { x: R.x, y: R.y, w: R.w, h: R.h } };
  return GK;
}
function gkObs(kind, R, D) {
  if (kind === 'boss') {
    let fin = false; try { fin = L.bossDef().xk === 'minotaur'; } catch (e) { fin = false; }
    if (fin) { // 米諾陶房：三道錯開缺口的迷宮牆（缺口寬 250，夠 Boss 通過）
      const W = 24, gap = 250, out = [], xs = [R.x + 330, R.x + 620, R.x + 910];
      xs.forEach((x, i) => { const top = i % 2 === 0; if (top) out.push({ x, y: R.y, w: W, h: R.h - gap, jk: 'wall' }); else out.push({ x, y: R.y + gap, w: W, h: R.h - gap, jk: 'wall' }); });
      out.push({ x: R.x + 470, y: R.y + R.h / 2 - 20, w: 40, h: 40, jk: 'stat' }, { x: R.x + 760, y: R.y + R.h / 2 - 20, w: 40, h: 40, jk: 'stat' });
      return out;
    }
  }
  const big = kind === 'combat'; if (big) gkMake(R); const sl = big && GK ? GK.slots : [];
  const keep = sl.map(s => s.fk === 'market' ? { x: s.x - 230, y: s.y - 100, w: 520, h: 220 } : s.fk === 'altar' ? { x: s.x - 200, y: s.y - 90, w: 400, h: 200 } : s.fk === 'labyr' ? { x: s.x - 220, y: s.y - 190, w: 420, h: 380 } : { x: s.x - 130, y: s.y - 130, w: 260, h: 260 });
  keep.push({ x: R.x, y: D.y - 100, w: 170, h: 200 }, { x: R.x + R.w - 170, y: D.y - 100, w: 170, h: 200 });
  const n = big ? 34 : 9, obs = [], ks = ['col', 'col', 'col', 'jar', 'olive', 'olive', 'stat'];
  for (let t = 0; t < 900 && obs.length < n; t++) {
    const jk = L.pickOf(ks), w = jk === 'col' ? rr(30, 40) : jk === 'olive' ? rr(46, 60) : rr(34, 46), h = jk === 'col' ? rr(46, 64) : jk === 'olive' ? rr(46, 60) : rr(34, 48);
    const o = { x: rr(R.x + 90, R.x + R.w - 90 - w), y: rr(R.y + 50, R.y + R.h - 50 - h), w, h, jk };
    if (keep.some(k => L.overlap(k, o)) || obs.some(q => L.overlap(L.inflate(q, 90), o))) continue;
    obs.push(o);
  }
  return obs;
}
function gkObsDraw(g, o) {
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2, jk = o.jk || 'jar';
  g.save(); setShadow(g, 0, 3, 0, 'rgba(30,16,8,.3)');
  if (jk === 'col') {
    g.fillStyle = '#d9c9a8'; rrect(g, o.x + o.w * 0.12, o.y + o.h * 0.1, o.w * 0.76, o.h * 0.82, 3); noShadow(g);
    g.fillStyle = '#efe2c4'; g.fillRect(o.x + o.w * 0.22, o.y + o.h * 0.14, o.w * 0.14, o.h * 0.74);
    g.fillStyle = '#c4b28c'; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h * 0.14, 2); rrect(g, o.x - 2, o.y + o.h * 0.88, o.w + 4, o.h * 0.14, 2);
  } else if (jk === 'olive') {
    g.fillStyle = '#4a3320'; rrect(g, cx - 4, cy, 8, o.h * 0.5, 3); noShadow(g);
    g.fillStyle = '#6f7f48'; circ(g, cx, cy - 2, o.w * 0.5); g.fillStyle = '#8a9a5c'; circ(g, cx - o.w * 0.18, cy - 6, o.w * 0.28); g.fillStyle = '#4f5d33'; circ(g, cx + o.w * 0.2, cy + 2, o.w * 0.24);
  } else if (jk === 'wall') {
    g.fillStyle = '#6a3a22'; g.fillRect(o.x, o.y, o.w, o.h); noShadow(g); g.fillStyle = '#8a4e2e'; g.fillRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4); g.fillStyle = GK_BLK; const hz = o.w > o.h; for (let i = 0; i < Math.floor((hz ? o.w : o.h) / 20); i++) { if (hz) g.fillRect(o.x + 6 + i * 20, o.y + o.h / 2 - 1.5, 10, 3); else g.fillRect(o.x + o.w / 2 - 1.5, o.y + 6 + i * 20, 3, 10); }
  } else if (jk === 'stat') {
    g.fillStyle = '#c9c2b4'; rrect(g, o.x + o.w * 0.15, o.y + o.h * 0.72, o.w * 0.7, o.h * 0.28, 3); noShadow(g);
    g.fillStyle = '#e4ddcc'; rrect(g, cx - o.w * 0.16, o.y + o.h * 0.28, o.w * 0.32, o.h * 0.46, 4); circ(g, cx, o.y + o.h * 0.2, o.w * 0.17);
  } else {
    g.fillStyle = GK_BLK; g.beginPath(); g.ellipse(cx, cy + 2, o.w * 0.42, o.h * 0.46, 0, 0, TAU); g.fill(); noShadow(g);
    g.fillStyle = GK_ORG; g.fillRect(cx - o.w * 0.3, cy - 2, o.w * 0.6, 3); g.fillStyle = GK_BLK; g.fillRect(cx - o.w * 0.16, o.y - 2, o.w * 0.32, o.h * 0.22);
  }
  g.restore();
}
function gkBg(g, rm, rng, arR) {
  const R = L.ROOM, zw = R.w / 3, zh = R.h / 2, big = rm.kind === 'combat';
  g.fillStyle = 'rgba(80,36,16,.16)'; for (let z = 0; z < 6; z++) if ((z + Math.floor(z / 3)) % 2 === 0) g.fillRect(R.x + (z % 3) * zw, R.y + Math.floor(z / 3) * zh, zw, zh);
  // 回紋飾帶（上下邊）
  const meander = y => { g.strokeStyle = GK_BLK; g.lineWidth = 3; for (let x = R.x + 10; x < R.x + R.w - 30; x += 44) { g.beginPath(); g.moveTo(x, y + 14); g.lineTo(x, y); g.lineTo(x + 22, y); g.lineTo(x + 22, y + 10); g.lineTo(x + 10, y + 10); g.lineTo(x + 10, y + 4); g.stroke(); } };
  meander(R.y + 8); meander(R.y + R.h - 24);
  g.fillStyle = 'rgba(60,24,10,.18)'; for (let i = 0; i < Math.round(110 * arR); i++) circ(g, R.x + rng() * R.w, R.y + rng() * R.h, 1.5 + rng() * 2.5);
  if (!big) return;
  g.font = '700 34px sans-serif'; g.textAlign = 'center'; g.fillStyle = 'rgba(40,16,6,.22)'; for (let z = 0; z < 6; z++) g.fillText(GK_ZONE[z], R.x + (z % 3 + 0.5) * zw, R.y + (Math.floor(z / 3) + 0.5) * zh + 120);
  // 港口的水
  g.fillStyle = 'rgba(70,130,180,.30)'; g.beginPath(); g.ellipse(R.x + 0.5 * zw, R.y + 0.5 * zh + 40, zw * 0.34, zh * 0.28, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(240,250,255,.45)'; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(R.x + 0.5 * zw - 110 + k * 70, R.y + 0.5 * zh + 40, 22, 0.2, 2.9); g.stroke(); }
}
function gkBack() {
  const room = L.room, c = L.ctx, time = L.time;
  if (room && room.kind === 'boss') {
    const m = L.enemies.find(q => q.type === 'boss' && !q.dead && q.xk === 'medusa');
    if (m && m.gaze) { const g = m.gaze, p = L.p, act = g.t <= 3.4 - g.tele; c.save(); c.strokeStyle = act ? 'rgba(200,255,120,.85)' : 'rgba(200,255,120,.35)'; c.lineWidth = act ? 6 : 2; if (!act) c.setLineDash([10, 10]); c.beginPath(); c.moveTo(m.x, m.y); c.lineTo(p.x, p.y); c.stroke(); c.restore(); }
    if (m && m.halo) { const h = m.halo; c.save(); if (h.t <= h.tele) { c.strokeStyle = 'rgba(200,255,120,' + (0.3 + 0.3 * Math.sin(time * 18)) + ')'; c.lineWidth = 4; c.setLineDash([8, 8]); c.beginPath(); c.arc(m.x, m.y, 70 + (h.t / h.tele) * 40, 0, TAU); c.stroke(); } else { c.strokeStyle = 'rgba(200,255,120,.85)'; c.lineWidth = 12; c.beginPath(); c.arc(m.x, m.y, h.R, 0, TAU); c.stroke(); c.strokeStyle = 'rgba(240,255,200,.5)'; c.lineWidth = 4; c.beginPath(); c.arc(m.x, m.y, Math.max(0, h.R - 14), 0, TAU); c.stroke(); } c.restore(); }
    const mi = L.enemies.find(q => q.type === 'boss' && !q.dead && q.xk === 'minotaur');
    if (mi && mi.tl && mi.tl.act === 'charge') { const p = L.p; c.save(); c.strokeStyle = 'rgba(255,106,58,' + (0.35 + 0.3 * Math.sin(time * 16)) + ')'; c.lineWidth = 8; c.setLineDash([14, 10]); c.beginPath(); c.moveTo(mi.x, mi.y); c.lineTo(p.x, p.y); c.stroke(); c.restore(); }
    return;
  }
  if (room && room.kind === 'combat') for (const e of L.enemies) if (!e.dead && e.bo) { const k = Math.max(0, e.bo.t) / e.bo.dur; c.save(); c.strokeStyle = 'rgba(255,106,58,.7)'; c.lineWidth = 3; c.beginPath(); c.arc(e.bo.x, e.bo.y, 64, 0, TAU); c.stroke(); c.fillStyle = 'rgba(255,106,58,.3)'; c.beginPath(); c.arc(e.bo.x, e.bo.y, 64 * (1 - k), 0, TAU); c.fill(); c.restore(); }
  if (!GK || !room || room.kind !== 'combat' || !GK.live) return;
  for (const s of GK.slots) {
    if (s.fk === 'market') { c.save(); c.translate(s.x, s.y - 52); c.fillStyle = GK_BLK; c.fillRect(-250, -6, 500, 8); for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? GK_ORG : GK_CRM; c.beginPath(); c.moveTo(-250 + i * 50, 2); c.lineTo(-200 + i * 50, 2); c.lineTo(-225 + i * 50, 24); c.fill(); } c.fillStyle = 'rgba(40,16,6,.55)'; c.font = '700 15px sans-serif'; c.textAlign = 'center'; c.fillText('市集', 0, -14); c.restore(); }
    else if (s.fk === 'altar') { c.save(); c.translate(s.x, s.y + 20); c.fillStyle = 'rgba(240,217,176,.35)'; c.beginPath(); c.ellipse(0, 0, 230, 70, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(40,16,6,.55)'; c.font = '700 15px sans-serif'; c.textAlign = 'center'; c.fillText('神祇祭壇：三選一', 0, -84); c.restore(); }
  }
  for (const it of room.items) if (it.fk === 'zeus' && it.st === 'run') { c.save(); c.globalAlpha = 0.45 + 0.1 * Math.sin(time * 6); c.strokeStyle = '#fff2a8'; c.lineWidth = 5; c.setLineDash([12, 10]); c.beginPath(); c.arc(it.x, it.y, 150, 0, TAU); c.stroke(); c.setLineDash([]); c.restore(); }
  for (const q of GK.strikes || []) { const k = Math.max(0, q.t) / q.dur; c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#fff2a8'; c.lineWidth = 3; c.beginPath(); c.arc(q.x, q.y, q.r, 0, TAU); c.stroke(); c.fillStyle = 'rgba(255,242,168,.35)'; c.beginPath(); c.arc(q.x, q.y, q.r * (1 - k), 0, TAU); c.fill(); c.restore(); }
}
function gkInit(room, kind) {
  if (kind !== 'combat') { GK = GK && GK.live ? GK : null; return; }
  const R = L.ROOM; if (!GK || !GK.R || GK.R.w !== R.w) gkMake(R);
  GK.live = true; GK.strikes = []; GK.mobs = [];
  const r = L.run; room.refreshN = 0;
  for (const s of GK.slots) {
    if (s.fk === 'market') {
      room.items.push(L.makeItem('heal', s.x - 130, s.y, 'shop'), L.makeItem('upgrade', s.x, s.y, 'shop'), L.makeItem(rand() < 0.65 ? 'weapon' : 'upgrade', s.x + 130, s.y, 'shop'));
      room.items.push({ kind: 'refresh', id: 'refresh', slot: 'refresh', x: s.x + 250, y: s.y, price: 3, group: 'stall', taken: false });
    } else if (s.fk === 'altar') {
      const ids = L.shuffle(Object.keys(GK_GODS)).slice(0, 3);
      ids.forEach((gid, i) => room.items.push({ kind: 'tfac', id: 'tfac', fk: 'god', g: gid, x: s.x + (i - 1) * 120, y: s.y, group: 'prop', price: 0, taken: false, st: 'ready', t: rand() * 6 }));
    } else if (s.fk === 'labyr') {
      const mx = s.x - 150, my = s.y - 150, W = (x, y, w, h) => room.obs.push({ x: mx + x, y: my + y, w, h, jk: 'wall' });
      W(0, 0, 300, 24); W(0, 276, 300, 24); W(276, 0, 24, 300); W(0, 24, 24, 76); W(0, 200, 24, 76); W(24, 100, 150, 24); W(126, 176, 150, 24);
      room.items.push({ kind: 'tfac', id: 'tfac', fk: 'labyr', x: mx - 56, y: my + 150, mx, my, group: 'prop', price: 0, taken: false, st: 'ready', t: rand() * 6 });
    } else room.items.push({ kind: 'tfac', id: 'tfac', fk: s.fk, x: s.x, y: s.y, group: 'prop', price: 0, taken: false, st: 'ready', t: rand() * 6 });
  }
  { const sd = r.gkSaid = r.gkSaid || {}; if (!sd[r.layer]) { sd[r.layer] = 1; const T0 = GK_STORY[Math.min(2, r.layer)]; L.later(2.2, () => { if (L.room === room && L.state() === 'play') L.say(T0); }); } }
}
function gkReward(it, coins) { const u = L.rewardUpgrade(); L.dropCoins(it.x, it.y + 30, coins || 8); L.sfx('clear'); L.burst(it.x, it.y - 10, 22, [GK_ORG, C.paper, '#ffe9a0'], 190, true); return L.UPG[u] ? L.UPG[u].name : '強化'; }
function gkDone(it, msg) { it.st = 'done'; const r = L.run; r.gkEv = (r.gkEv || 0) + 1; if (r.gkEv >= 5) L.unlockAch('gkEvents'); if (msg) L.toast(msg, 3); L.hintReset(); }
function gkSpawn(n, near, types) {
  const out = []; for (let i = 0; i < n; i++) { const a = rand() * TAU, d = rr(220, 340); let x = clamp(near.x + Math.cos(a) * d, L.ROOM.x + 60, L.ROOM.x + L.ROOM.w - 60), y = clamp(near.y + Math.sin(a) * d, L.ROOM.y + 60, L.ROOM.y + L.ROOM.h - 60); const e = L.spawnEnemy(L.pickOf(types || ['crawler', 'shooter', 'crawler']), x, y); e.sleep = false; out.push(e); } return out;
}
function gkBoon(it) {
  const r = L.run, p = L.p, G = GK_GODS[it.g]; if (!G) return;
  for (const o of L.room.items) if (o.fk === 'god') o.taken = true;
  for (const u of G.ups) L.applyUpgrade(u, false);
  if (G.shield) p.shield = Math.min(L.shieldMax(), p.shield + G.shield); if (G.heal) L.healP(G.heal);
  r.gkBoon = (r.gkBoon || 0) + 1; r.gkBoonLayers = r.gkBoonLayers || {}; r.gkBoonLayers[r.layer] = 1; if (Object.keys(r.gkBoonLayers).length >= 3) L.unlockAch('gkBless');
  L.sfx('clear'); L.burst(it.x, it.y - 10, 24, ['#ffe9a0', C.paper], 200, true); L.toast(G.name + '的恩賜：' + G.desc, 3.4); L.hintReset();
}
function gkUse(it) {
  const p = L.p, r = L.run, room = L.room, G = GK;
  if (it.fk === 'god') { gkBoon(it); return; }
  if (it.st !== 'ready') { L.toast(it.st === 'done' ? '這個事件已經結束了' : '進行中……', 1.4); return; }
  const pay = n => { if (p.coins < n) { L.toast('燈芯不夠（需要 ' + n + '）', 1.6); L.sfx('tick'); return false; } p.coins -= n; L.sfx('buy'); return true; };
  if (it.fk === 'oracle') {
    if (!pay(3)) return;
    if (rand() < 0.6) { const nm = gkReward(it, 4); gkDone(it, '神諭降下祝福：' + nm); }
    else { gkSpawn(3, it); gkDone(it, '神諭應驗：厄運臨頭——敵人出現了！'); }
  } else if (it.fk === 'zeus') {
    it.st = 'run'; it.rt = 0; it.sk = 0.8; L.toast('宙斯的試煉：站在圈內撐過 20 秒，閃電會落在你身邊', 3.2); L.hintReset();
  } else if (it.fk === 'siren') {
    it.st = 'busy'; it.mobs = gkSpawn(4 + (L.dL() >= 1 ? 1 : 0), it, ['shooter', 'shooter', 'crawler']); L.toast('歌聲響起……海妖來了！全部打倒', 3); L.hintReset();
  } else if (it.fk === 'labyr') {
    it.st = 'busy'; it.mobs = [L.spawnEnemy('brute', it.mx + 60, it.my + 150), L.spawnEnemy('brute', it.mx + 70, it.my + 230)]; for (const e of it.mobs) { e.sleep = false; e.hp = e.maxHp = Math.round(e.hp * 2); e.r = Math.round(e.r * 1.25); } L.toast('迷宮的守衛醒了：打倒牠們，到迷宮深處拿武器', 3); L.hintReset();
  } else if (it.fk === 'pandora') {
    it.st = 'busy'; L.interact({ kind: 'mystery', id: 'mystery', x: it.x, y: it.y, group: 'prop', price: 0, taken: false }); it.mobs = gkSpawn(4, it, ['crawler', 'shooter', 'bomber']); L.toast('盒子裡放出了災厄！', 2.6); L.hintReset();
  } else if (it.fk === 'styx') {
    if (!pay(2)) return; p.x = L.ROOM.x + L.ROOM.w - 220; p.y = L.DOOR.y; L.burst(p.x, p.y, 24, ['#6ac0e0', C.paper], 200, true); gkDone(it, '卡戎載你過了河：直接來到出口這一側');
  } else if (it.fk === 'dion') {
    it.st = 'busy'; it.rt = 10; it.cd = 0; p.drunk = 10; L.toast('酒神狂歡！10 秒內瞄準會亂飄，但燈芯一直掉', 3); L.hintReset();
  }
}
function gkLos(a, b) {
  const rm = L.room, n = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 16);
  for (let i = 1; i < n; i++) { const x = a.x + (b.x - a.x) * i / n, y = a.y + (b.y - a.y) * i / n; if (rm.obs.some(o => x > o.x - 4 && x < o.x + o.w + 4 && y > o.y - 4 && y < o.y + o.h + 4)) return false; }
  return true;
}
function gkBossTick(dt, room, p) {
  const m = L.enemies.find(q => q.type === 'boss' && !q.dead && q.xk === 'medusa');
  if (m && m.gaze) {
    const g = m.gaze; g.t -= dt; if (g.t <= 0) m.gaze = null;
    else if (g.t <= 3.4 - g.tele && !g.hit) {
      if (gkLos(m, p) && Math.hypot(m.x - p.x, m.y - p.y) < 900) { g.ex += dt; if (g.ex >= 0.5) { g.hit = true; gkStone(p, 2.4); } } else g.ex = Math.max(0, g.ex - dt);
    }
  }
  if (m && m.halo) { // 光圈式石化：光圈從美杜莎向外擴散，掃過你時沒有遮蔽物就會石化
    const h = m.halo; h.t += dt;
    if (h.t > h.tele) {
      h.R += 330 * dt; const d = Math.hypot(m.x - p.x, m.y - p.y);
      if (!h.hit && Math.abs(d - h.R) < 26 + p.r && gkLos(m, p)) { h.hit = true; gkStone(p, 2.0); }
      if (h.R > 820) m.halo = null;
    }
  }
  const mi = L.enemies.find(q => q.type === 'boss' && !q.dead && q.xk === 'minotaur');
  if (mi && mi.dash) { // 米諾陶衝撞：撞上迷宮牆會暈眩並受傷
    const v = mi.dash;
    for (const o of room.obs) {
      if (o.jk !== 'wall') continue;
      const nx = L.clamp(mi.x, o.x, o.x + o.w), ny = L.clamp(mi.y, o.y, o.y + o.h), dx = nx - mi.x, dy = ny - mi.y, dd = Math.hypot(dx, dy);
      if (dd < mi.r + 8 && (dd === 0 || dx * v.vx + dy * v.vy > 0)) {
        const sp = Math.hypot(v.vx, v.vy) || 1;
        mi.dash = null; mi.tl = null; mi.kx = 0; mi.ky = 0; mi.stun = 1.5;
        L.hitEnemy(mi, 7, v.vx / sp, v.vy / sp, 0, false);
        L.sfx('kill'); L.shake(11); L.burst(mi.x, mi.y, 24, ['#c8c2b4', '#8a4e2e', C.paper], 220, true);
        L.toast('米諾陶撞上了牆，暈了！趁現在打', 2.2);
        const r = L.run; r.gkWall = (r.gkWall || 0) + 1; if (r.gkWall >= 3) L.unlockAch('gkWall');
        break;
      }
    }
  }
}
function gkStone(p, t) { p.stone = t; L.sfx('hit'); L.shake(6); L.burst(p.x, p.y, 16, ['#9a9a9a', '#c8c8c8'], 160, true); L.toast('石化了！動作變慢、不能攻擊', 2.2); }
function gkTick(dt) {
  const room = L.room, p = L.p; if (room && room.kind === 'boss' && L.state() === 'play') { gkBossTick(dt, room, p); return; } if (!GK || !room || !GK.live || room.kind !== 'combat' || L.state() !== 'play') { if (p && p.drunk > 0 && (!room || room.kind !== 'combat')) p.drunk = 0; return; }
  if (p.drunk > 0) p.drunk = Math.max(0, p.drunk - dt);
  for (const e of L.enemies) if (!e.dead && e.skin === 'satyr' && !e.gkRage && e.hp <= e.maxHp * 0.5) { e.gkRage = true; e.spd *= 1.35; L.burst(e.x, e.y - 10, 10, ['#ff6a3a', C.paper], 150, true); }
  for (const q of GK.strikes) { q.t -= dt; if (q.t <= 0 && !q.done) { q.done = true; L.burst(q.x, q.y, 14, ['#fff2a8', C.paper], 190, true); L.sfx('hit'); L.shake(4); if (Math.hypot(p.x - q.x, p.y - q.y) < q.r + p.r && p.iframes <= 0) L.hurtFrom('zeus', 1, 0, 1); } }
  GK.strikes = GK.strikes.filter(q => !q.done);
  for (const it of room.items) {
    if (it.fk === 'zeus' && it.st === 'run') {
      it.t += dt; const inside = Math.hypot(p.x - it.x, p.y - it.y) < 150;
      if (inside) { it.rt += dt; it.sk -= dt; if (it.sk <= 0) { it.sk = 1.1; GK.strikes.push({ x: p.x + rr(-60, 60), y: p.y + rr(-60, 60), r: 48, t: 1.0, dur: 1.0 }); } } else if (!it.warn) { it.warn = true; L.toast('回到圈內才會計時', 1.8); L.later(3, () => { it.warn = false; }); }
      if (it.rt >= 20) { const nm = gkReward(it, 10); gkDone(it, '宙斯認可了你：' + nm); }
    } else if (it.fk === 'dion' && it.st === 'busy') {
      it.cd -= dt; it.rt -= dt; if (it.cd <= 0) { it.cd = 0.35; L.dropCoins(p.x + rr(-120, 120), p.y + rr(-90, 90), 1 + (rand() < 0.4 ? 1 : 0)); }
      if (it.rt <= 0) { p.drunk = 0; gkDone(it, '狂歡結束了，口袋沉甸甸的'); }
    } else if (it.st === 'busy' && it.mobs) {
      if (it.mobs.every(e => e.dead)) {
        if (it.fk === 'siren') { const nm = gkReward(it, 12); gkDone(it, '海妖安靜了：' + nm); }
        else if (it.fk === 'labyr') { const w = L.makeItem('weapon', it.mx + 230, it.my + 150, 'prop'); room.items.push(w); L.dropCoins(it.mx + 230, it.my + 120, 12); gkDone(it, '守衛倒下了：迷宮深處出現了一把武器'); }
        else if (it.fk === 'pandora') { gkDone(it, '災厄平息了，盒子裡剩下的是希望'); L.healP(1); }
      }
    }
  }
}
function gkHint(it) {
  if (it.fk === 'god') return 'F 接受' + GK_GODS[it.g].name + '的恩賜（三選一）';
  if (it.st === 'done') return ''; if (it.st !== 'ready') return '進行中……';
  return it.fk === 'oracle' ? 'F 祈求神諭　3 燈芯' : it.fk === 'zeus' ? 'F 接受試煉' : it.fk === 'siren' ? 'F 側耳傾聽（會出現海妖）' : it.fk === 'labyr' ? 'F 走進迷宮（會有守衛）' : it.fk === 'pandora' ? 'F 打開盒子（獎勵＋災厄）' : it.fk === 'styx' ? 'F 付 2 燈芯渡河' : 'F 加入狂歡';
}
function gkInfo(it) {
  if (it.fk === 'god') { const G = GK_GODS[it.g]; return { name: G.name + '的祭壇', desc: '恩賜：' + G.desc + '。三座祭壇只能選一座' }; }
  const dd = { oracle: '付 3 燈芯：六成得到祝福（一個強化），四成厄運（敵人出現）', zeus: '站進圈內撐過 20 秒閃電，成功得到強化與燈芯；離開圈外不計時', siren: '引來一群海妖。全部打倒得到強化與燈芯；不想打就不要碰', labyr: '迷宮的入口。兩隻精英守衛醒來後會追出來；打倒後，迷宮深處會出現一把武器', pandora: '打開得到神祕寶箱的隨機獎勵，同時放出一波災厄；打完回 1 點燈火', styx: '付 2 燈芯，卡戎直接把你載到出口這一側（跳過沿途的區域）', dion: '10 秒內瞄準亂飄，但不停掉出燈芯' };
  return { name: GK_NAME[it.fk] + (it.st === 'done' ? '（已結束）' : ''), desc: dd[it.fk] || '' };
}
function gkDraw(it) {
  const c = L.ctx, time = L.time, fk = it.fk, done = it.st === 'done'; c.save(); c.translate(it.x, it.y);
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 24, 34, 9, 0, 0, TAU); c.fill(); if (done) c.globalAlpha = 0.5;
  if (fk === 'god') {
    const gc = { apollo: '#f6c83c', athena: '#9fc4e8', ares: '#d9482e', hermes: '#8fd48a', demeter: '#c8a060' }[it.g];
    c.fillStyle = '#d9c9a8'; rrect(c, -20, 4, 40, 20, 3); rrect(c, -12, -22, 24, 28, 3); c.fillStyle = '#efe2c4'; rrect(c, -24, -26, 48, 8, 2);
    c.fillStyle = gc; c.globalAlpha = (done ? 0.5 : 1) * (0.7 + 0.2 * Math.sin(time * 4 + it.t)); circ(c, 0, -42, 11); c.globalAlpha = done ? 0.5 : 1;
    c.fillStyle = GK_BLK; c.font = '700 13px sans-serif'; c.textAlign = 'center'; c.fillText(GK_GODS[it.g].name, 0, 40);
  } else if (fk === 'oracle') {
    c.strokeStyle = GK_BLK; c.lineWidth = 5; c.lineCap = 'round'; for (const sx of [-1, 0, 1]) { c.beginPath(); c.moveTo(sx * 16, 22); c.lineTo(sx * 5, -12); c.stroke(); } c.fillStyle = '#b8883c'; c.beginPath(); c.ellipse(0, -14, 20, 8, 0, 0, TAU); c.fill();
    c.globalAlpha = (done ? 0.2 : 0.5); c.fillStyle = '#d8c8f0'; for (let k = 0; k < 3; k++) circ(c, Math.sin(time * 1.5 + k * 2) * 7, -26 - k * 14 - (time * 14 + k * 9) % 12, 8 - k * 1.5); c.globalAlpha = done ? 0.5 : 1;
  } else if (fk === 'zeus') {
    c.fillStyle = '#e9e2d0'; rrect(c, -14, -6, 28, 30, 3); c.fillStyle = '#fff2a8'; poly(c, [[2, -42], [-10, -8], [0, -10], [-6, 20], [12, -16], [2, -14]]);
  } else if (fk === 'siren') {
    c.fillStyle = '#6f6a5c'; poly(c, [[-30, 24], [-18, -10], [8, -16], [30, 24]]); c.fillStyle = GK_BLK; circ(c, 0, -26, 10); c.fillRect(-9, -18, 18, 20);
    c.strokeStyle = '#7ad0f0'; c.lineWidth = 2; for (let k = 0; k < 3; k++) { c.globalAlpha = 0.6 - k * 0.15; c.beginPath(); c.arc(14, -28, 10 + k * 8 + (time * 12) % 8, -0.7, 0.7); c.stroke(); } c.globalAlpha = done ? 0.5 : 1;
  } else if (fk === 'labyr') {
    c.fillStyle = '#3a2418'; rrect(c, -26, -20, 52, 44, 4); c.fillStyle = GK_BLK; rrect(c, -14, -8, 28, 32, 3); c.strokeStyle = GK_ORG; c.lineWidth = 3; c.beginPath(); c.moveTo(-20, -14); c.lineTo(-8, -14); c.lineTo(-8, -4); c.lineTo(8, -4); c.lineTo(8, -14); c.lineTo(20, -14); c.stroke();
    c.fillStyle = GK_CRM; poly(c, [[-22, -22], [-30, -38], [-16, -26]]); poly(c, [[22, -22], [30, -38], [16, -26]]);
  } else if (fk === 'pandora') {
    c.fillStyle = GK_BLK; c.beginPath(); c.ellipse(0, 4, 22, 24, 0, 0, TAU); c.fill(); c.fillRect(-10, -26, 20, 10); c.fillStyle = GK_ORG; c.fillRect(-18, 0, 36, 4); if (it.st === 'ready') { c.fillStyle = 'rgba(255,200,120,' + (0.3 + 0.2 * Math.sin(time * 5)) + ')'; circ(c, 0, -30, 12); }
  } else if (fk === 'styx') {
    c.fillStyle = 'rgba(40,90,150,.55)'; c.beginPath(); c.ellipse(0, 12, 54, 18, 0, 0, TAU); c.fill(); c.fillStyle = GK_BLK; poly(c, [[-38, 8], [38, 8], [26, 22], [-26, 22]]); c.fillRect(-2, -26, 4, 34); c.fillStyle = GK_CRM; circ(c, 0, -34, 7);
  } else if (fk === 'dion') {
    c.fillStyle = GK_BLK; c.beginPath(); c.ellipse(0, 2, 24, 22, 0, 0, TAU); c.fill(); c.fillStyle = '#8a2a4a'; c.beginPath(); c.ellipse(0, -14, 22, 6, 0, 0, TAU); c.fill(); c.fillStyle = GK_ORG; for (let k = 0; k < 3; k++) circ(c, -10 + k * 10, 4, 3);
    c.fillStyle = '#6f8a3a'; circ(c, -16, -26, 6); circ(c, -8, -30, 6); circ(c, 0, -26, 6); c.fillStyle = '#4a2a6a'; circ(c, 12, -24, 5); circ(c, 18, -20, 5);
  }
  c.globalAlpha = 1;
  if (fk === 'zeus' && it.st === 'run') { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(-24, 34, 48, 6); c.fillStyle = '#fff2a8'; c.fillRect(-23, 35, 46 * Math.min(1, it.rt / 20), 4); }
  if (it.st === 'ready' && fk !== 'god') { c.fillStyle = '#ffd24a'; c.font = '700 16px sans-serif'; c.textAlign = 'center'; c.fillText('！', 0, -52 + Math.sin(time * 5) * 2); }
  c.restore();
}
/* ---- 敵人與 Boss 外觀（黑繪式陶器：黑色剪影＋赤陶色細節） ---- */
function drawGkEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, t = e.t, bob = Math.sin(t * 3 + e.seed) * 2, p = L.p, fa = Math.atan2(p.y - e.y, p.x - e.x);
  const eye = (x, y, s) => { c.fillStyle = f ? '#c00' : GK_ORG; circ(c, x, y, s); };
  const body = col => (f ? C.paper : col);
  if (sk === 'jar') {
    c.fillStyle = body(GK_BLK); c.beginPath(); c.ellipse(0, bob + 2, r * 0.95, r * 1.05, 0, 0, TAU); c.fill(); c.fillRect(-r * 0.4, bob - r * 1.35, r * 0.8, r * 0.5);
    c.strokeStyle = body(GK_BLK); c.lineWidth = 3; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * r * 0.95, bob - r * 0.5, r * 0.45, s > 0 ? -1.2 : 1.9 - 0.7, s > 0 ? 1.2 : 4.3); c.stroke(); }
    c.fillStyle = GK_ORG; c.fillRect(-r * 0.8, bob - r * 0.1, r * 1.6, 3); eye(Math.cos(fa) * r * 0.2 - r * 0.28, bob - r * 0.4, r * 0.16); eye(Math.cos(fa) * r * 0.2 + r * 0.28, bob - r * 0.4, r * 0.16);
  } else if (sk === 'harpy') {
    const fl = Math.sin(t * 9) * 0.5; c.fillStyle = body(GK_BLK);
    for (const s of [-1, 1]) poly(c, [[s * r * 0.4, bob - 2], [s * r * 1.9, bob - r * (0.8 + fl)], [s * r * 1.4, bob + r * 0.5]]);
    circ(c, 0, bob, r * 0.85); poly(c, [[-r * 0.3, bob - r * 0.1], [r * 0.3, bob - r * 0.1], [0, bob + r * 0.55]]);
    eye(-r * 0.28, bob - r * 0.2, r * 0.17); eye(r * 0.28, bob - r * 0.2, r * 0.17); c.fillStyle = GK_ORG; poly(c, [[-4, bob + 2], [4, bob + 2], [0, bob + 9]]);
  } else if (sk === 'satyr') {
    c.fillStyle = body(GK_BLK); circ(c, 0, bob, r); poly(c, [[-r * 0.7, bob - r * 0.6], [-r * 1.05, bob - r * 1.4], [-r * 0.25, bob - r * 0.85]]); poly(c, [[r * 0.7, bob - r * 0.6], [r * 1.05, bob - r * 1.4], [r * 0.25, bob - r * 0.85]]);
    if (e.gkRage) { c.fillStyle = 'rgba(255,80,40,.28)'; circ(c, 0, bob, r * 1.35); }
    eye(-r * 0.32, bob - r * 0.15, r * 0.18); eye(r * 0.32, bob - r * 0.15, r * 0.18); c.fillStyle = GK_ORG; c.fillRect(-r * 0.4, bob + r * 0.35, r * 0.8, 3); poly(c, [[-r * 0.2, bob + r * 0.5], [r * 0.2, bob + r * 0.5], [0, bob + r * 1.0]]);
  } else if (sk === 'hydra') {
    c.fillStyle = body(GK_BLK); circ(c, 0, bob + r * 0.3, r * 0.8); for (const s of [-1, 0, 1]) { c.strokeStyle = body(GK_BLK); c.lineWidth = 5; c.beginPath(); c.moveTo(s * r * 0.3, bob + r * 0.1); c.quadraticCurveTo(s * r * 0.9, bob - r * 0.6, s * r * 0.7 + Math.sin(t * 3 + s) * 3, bob - r * 1.1); c.stroke(); circ(c, s * r * 0.7 + Math.sin(t * 3 + s) * 3, bob - r * 1.15, r * 0.3); eye(s * r * 0.7 + 2, bob - r * 1.2, 2.2); }
  } else if (sk === 'centaur') {
    c.fillStyle = body(GK_BLK); c.beginPath(); c.ellipse(-r * 0.25, bob + r * 0.35, r * 1.05, r * 0.6, 0, 0, TAU); c.fill();
    for (const s2 of [-0.9, -0.35, 0.35, 0.9]) c.fillRect(-r * 0.25 + s2 * r * 0.75 - 2, bob + r * 0.6, 4, r * 0.7);
    c.beginPath(); c.ellipse(r * 0.45, bob - r * 0.2, r * 0.42, r * 0.62, 0, 0, TAU); c.fill(); circ(c, r * 0.5, bob - r * 0.95, r * 0.36);
    eye(r * 0.62, bob - r * 1.0, r * 0.12);
    const ba = Math.atan2(p.y - e.y, p.x - e.x); c.save(); c.translate(r * 0.5, bob - r * 0.3); c.rotate(ba); c.strokeStyle = body(GK_ORG); c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r * 0.9, -1.1, 1.1); c.stroke(); c.lineWidth = 1.5; c.beginPath(); c.moveTo(r * 0.9 * Math.cos(-1.1), r * 0.9 * Math.sin(-1.1)); c.lineTo(r * 0.9 * Math.cos(1.1), r * 0.9 * Math.sin(1.1)); c.stroke(); c.restore();
    if (e.tele > 0) { c.fillStyle = '#ffe08a'; star4(c, 0, -r * 2.2, 8, t * 5); }
  } else if (sk === 'cyclops') {
    c.fillStyle = body(GK_BLK); c.beginPath(); c.ellipse(0, bob + r * 0.35, r * 0.95, r * 1.0, 0, 0, TAU); c.fill(); circ(c, 0, bob - r * 0.7, r * 0.62);
    c.fillStyle = f ? C.paper : '#e9e2d0'; c.beginPath(); c.ellipse(0, bob - r * 0.72, r * 0.34, r * 0.24, 0, 0, TAU); c.fill(); c.fillStyle = f ? '#c00' : GK_ORG; circ(c, Math.cos(fa) * r * 0.1, bob - r * 0.72 + Math.sin(fa) * r * 0.06, r * 0.14);
    c.fillStyle = body('#8a6a3a'); c.fillRect(-r * 0.7, bob + r * 0.05, r * 1.4, 4); c.fillStyle = GK_ORG; c.fillRect(-r * 0.7, bob + r * 0.55, r * 1.4, 3);
    c.fillStyle = body('#8a8272'); circ(c, r * 1.15, bob - r * 0.1 - (e.bo ? 10 : 0), r * 0.42);
    if (e.tele > 0) { c.fillStyle = '#ffe08a'; star4(c, 0, -r * 2.2, 9, t * 5); }
  } else {
    c.fillStyle = body(GK_BLK); c.beginPath(); c.ellipse(0, bob + 3, r * 0.95, r * 0.85, 0, 0, TAU); c.fill(); c.fillStyle = body('#e0642c'); poly(c, [[-r * 0.5, bob - r * 0.4], [0, bob - r * (1.5 + 0.2 * Math.sin(t * 8))], [r * 0.5, bob - r * 0.4]]); c.fillStyle = GK_ORG; c.fillRect(-r * 0.8, bob + 2, r * 1.6, 3); eye(0, bob - 2, r * 0.2);
  }
}
function drawMedusa(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 1.8) * 4, fin = false;
  c.fillStyle = 'rgba(120,200,120,.18)'; circ(c, 0, b, 96);
  c.strokeStyle = fl ? C.paper : GK_BLK; c.lineWidth = 6; c.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.95 + i / 8 * Math.PI * 0.9 - 0.1, w = Math.sin(t * 3 + i) * 10; c.beginPath(); c.moveTo(Math.cos(a) * 30, b - 6 + Math.sin(a) * 30); c.quadraticCurveTo(Math.cos(a) * 62 + w, b + Math.sin(a) * 62 - 8, Math.cos(a) * 80 + w * 1.4, b + Math.sin(a) * 84); c.stroke(); c.fillStyle = fl ? C.paper : '#3a6a3a'; circ(c, Math.cos(a) * 80 + w * 1.4, b + Math.sin(a) * 84, 6); }
  c.fillStyle = fl ? C.paper : GK_BLK; c.beginPath(); c.moveTo(-46, 80 + b); c.quadraticCurveTo(-54, 18 + b, 0, 20 + b); c.quadraticCurveTo(54, 18 + b, 46, 80 + b); c.fill();
  c.fillStyle = fl ? C.paper : GK_BLK; circ(c, 0, b - 4, 36); c.fillStyle = fl ? C.paperDim : GK_ORG; circ(c, 0, b - 4, 30);
  c.fillStyle = '#c9f56a'; c.beginPath(); c.ellipse(-12, b - 8, 8, 6, 0, 0, TAU); c.ellipse(12, b - 8, 8, 6, 0, 0, TAU); c.fill(); c.fillStyle = GK_BLK; circ(c, -12, b - 8, 3); circ(c, 12, b - 8, 3); c.fillRect(-10, b + 10, 20, 3);
}
function drawMinotaur(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 1.6) * 3;
  c.fillStyle = 'rgba(200,90,40,.18)'; circ(c, 0, b, 110);
  c.fillStyle = fl ? C.paper : GK_BLK; c.beginPath(); c.ellipse(0, 30 + b, 58, 62, 0, 0, TAU); c.fill(); for (const sx of [-1, 1]) { c.fillRect(sx * 38 - 10, 78 + b, 20, 26); }
  c.fillStyle = fl ? C.paperDim : GK_ORG; c.fillRect(-36, 18 + b, 72, 5); c.fillRect(-36, 40 + b, 72, 5);
  c.fillStyle = fl ? C.paper : GK_BLK; circ(c, 0, -30 + b, 34); poly(c, [[-26, -50 + b], [-66, -86 + b], [-62, -60 + b], [-34, -32 + b]]); poly(c, [[26, -50 + b], [66, -86 + b], [62, -60 + b], [34, -32 + b]]);
  c.fillStyle = fl ? C.paper : '#4a3220'; c.beginPath(); c.ellipse(0, -16 + b, 18, 13, 0, 0, TAU); c.fill(); c.fillStyle = GK_ORG; circ(c, -7, -17 + b, 3); circ(c, 7, -17 + b, 3);
  c.fillStyle = '#ff6a3a'; circ(c, -14, -40 + b, 5); circ(c, 14, -40 + b, 5);
  if (e.stun > 0) { c.fillStyle = '#ffe08a'; for (let k = 0; k < 3; k++) star4(c, Math.cos(t * 4 + k * 2.1) * 44, -84 + b + Math.sin(t * 4 + k * 2.1) * 8, 9, t * 3); }
  c.strokeStyle = '#8a6a3a'; c.lineWidth = 7; c.beginPath(); c.moveTo(70, 80 + b); c.lineTo(70, -20 + b); c.stroke(); c.fillStyle = fl ? C.paper : '#c8c2b4'; poly(c, [[70, -20 + b], [38, -4 + b], [70, 8 + b]]); poly(c, [[70, -20 + b], [102, -4 + b], [70, 8 + b]]);
}
function gkMoves(e, phase, ang) {
  const p = L.p, med = e.xk === 'medusa', room = L.room, aim = () => Math.atan2(p.y - e.y, p.x - e.x);
  const pool = med ? (phase === 1 ? ['fan', 'ring', 'gaze'] : phase === 2 ? ['fan', 'ring', 'gaze', 'halo', 'call'] : ['fan', 'ring', 'gaze', 'halo', 'call', 'rain'])
    : (phase === 1 ? ['charge', 'fan', 'ring'] : phase === 2 ? ['charge', 'fan', 'stomp', 'call'] : ['charge', 'stomp', 'ring', 'call', 'rain']);
  const a = L.pickOf(pool);
  if (a === 'fan') { for (let w = 0; w < 3; w++) L.later(w * 0.4, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.2, 190, false, 6); L.sfx('hit'); }); L.toast(med ? '蛇髮亂舞！' : '牛角衝撞！', 1.1); }
  else if (a === 'ring') { const n = 14, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 150, false, 7); L.sfx('hit'); L.toast('一圈衝擊', 1.1); }
  else if (a === 'halo') { if (e.halo || e.gaze) return; e.halo = { t: 0, tele: 0.8, R: 60, hit: false }; L.toast('光圈擴散——躲到柱子或陶罐後面！', 2.2); }
  else if (a === 'gaze') { e.gaze = { t: 3.4, tele: 0.9, ex: 0, hit: false }; L.toast('石化視線！躲到柱子後面，別被她看到', 2.6); }
  else if (a === 'charge') { e.tl = { t: 0.9, act: 'charge', ang: aim() }; L.toast('米諾陶低下頭——站到牆的另一邊，讓牠撞上去！', 2); }
  else if (a === 'stomp') { L.toast('大地震動！', 1.4); for (let k = 0; k < 7; k++) { const aa = k / 7 * TAU, d = 150 + (k % 2) * 80; L.markStrike(e, e.x + Math.cos(aa) * d, e.y + Math.sin(aa) * d, 58, 1.2, {}); } }
  else if (a === 'call') { const alive = L.enemies.filter(q => !q.dead && q.type !== 'boss').length; if (alive < 6) for (let i = 0; i < 2; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy(med ? 'shooter' : 'crawler', sp.x, sp.y); m.sleep = false; } L.toast(med ? '蛇群爬出來了' : '迷宮的守衛趕來了', 1.4); }
  else { for (let i = 0; i < (phase === 3 ? 7 : 5); i++) L.markStrike(e, i === 0 ? p.x : p.x + rr(-220, 220), i === 0 ? p.y : p.y + rr(-160, 160), 50, 1.1, {}); L.toast('神罰落下', 1.3); }
}
L.registerWorld({
  theme: 16, name: '希臘神話', pool: 'dlc', opt: '希臘神話（DLC3）',
  pal: GK_PAL, noDark: true,
  amb: ['bandpass', 1400, 1.5, 0.004], ev: r => { const n = [392, 440, 523, 587][Math.floor(r() * 4)]; L.blip(n, n * 1.003, 0.8, 'triangle', 0.007); },
  bg: gkBg, obsDraw: gkObsDraw, obs: gkObs, roomInit: gkInit, tick: gkTick, back: gkBack, drawItem: gkDraw, info: gkInfo, hint: gkHint, useItem: gkUse,
  arrows: edge => { const room = L.room; if (!room || room.kind !== 'combat' || !GK || !GK.live) return; for (const it of room.items) if (it.kind === 'tfac' && it.st === 'ready' && !it.taken) edge(it.x, it.y, it.fk === 'god' ? '#ffe9a0' : '#ffd24a', false); for (const s of GK.slots) if (s.fk === 'market') edge(s.x, s.y, '#7ad0f0', false); },
  mini: (mx, my, sc) => { const room = L.room, c = L.ctx, R = L.ROOM; if (!room || room.kind !== 'combat' || !GK || !GK.live) return; c.save(); c.textAlign = 'center'; c.font = '700 9px sans-serif'; for (const s of GK.slots) { const x = mx + (s.x - R.x) * sc, y = my + (s.y - R.y) * sc; if (s.fk === 'market') { c.fillStyle = '#7ad0f0'; c.fillText('市', x, y + 3); } else if (s.fk === 'altar') { c.fillStyle = '#ffe9a0'; c.fillText('★', x, y + 3); } } for (const it of room.items) if (it.kind === 'tfac' && it.fk !== 'god') { const x = mx + (it.x - R.x) * sc, y = my + (it.y - R.y) * sc; c.fillStyle = it.st === 'done' ? 'rgba(180,180,180,.6)' : '#ffd24a'; c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x + 3.5, y); c.lineTo(x, y + 4); c.lineTo(x - 3.5, y); c.fill(); } c.restore(); },
  enemies: {
    centaur: { hp: 8, r: 17, name: '半人馬弓手', cost: 3, cap: 2, ai: centaurAi },
    cyclops: { hp: 17, r: 22, name: '獨眼巨人', cost: 5, cap: 1, ai: cyclopsAi }
  },
  skin: { map: { crawler: 'jar', shooter: 'harpy', brute: 'satyr', splitter: 'hydra', splitter2: 'hydra', bomber: 'pot', centaur: 'centaur', cyclops: 'cyclops' }, draw: drawGkEnemy, hue: false },
  weapons: {
    trident: { id: 'trident', name: '三叉戟', tag: '貫穿', mode: 'tap', cd: 0.55, th: 16, desc: '射出會貫穿敵人的三叉戟，傷害高（希臘專屬）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 720, 8, 5.4 * dm, 'lance', 0.95, true); L.sfx('blade'); } },
    artemis: { id: 'artemis', name: '阿爾忒彌斯之弓', tag: '連射', mode: 'auto', cd: 0.22, th: 16, desc: '長按 F 的遠程連射，射程遠但單發很輕（希臘專屬）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang + (rand() - 0.5) * 0.08, 840, 5, 1.7 * dm, 'pellet', 0.8); L.sfx('tick'); } },
    spear: { id: 'spear', name: '盾與短矛', tag: '近戰', mode: 'tap', cd: 0.5, th: 16, range: 112, half: 1.1, dmg: 4.3, kb: 560, desc: '近戰刺擊，擊退很強（希臘專屬）' },
    lyre: { id: 'lyre', name: '七弦琴', tag: '音波', mode: 'tap', cd: 0.8, th: 16, desc: '朝四面八方撥出 7 道音波，短距離、可貫穿（希臘專屬）',
      fire: (ox, oy, ang, dm) => { const o = rand() * TAU; for (let i = 0; i < 7; i++) L.shoot(ox, oy, o + i / 7 * TAU, 320, 6, 2.5 * dm, 'pellet', 0.5, true); L.sfx('flame'); } }
  },
  ach: [
    { id: 'gkBless', name: '神的寵兒', desc: '希臘神話：同一局三層都接受了神祇恩賜（可獲得希臘長袍）' },
    { id: 'gkEvents', name: '見多識廣', desc: '希臘神話：一局完成 5 個神話事件（可獲得橄欖油燈）' },
    { id: 'gkBreak', name: '陶罐粉碎機', desc: '希臘神話：一局打破 30 個陶罐敵人（可獲得科林斯頭盔）' },
    { id: 'gkHydra', name: '斬草除根', desc: '希臘神話：擊敗再生的九頭蛇頭（可獲得雙耳瓶燈）' },
    { id: 'gkWall', name: '撞牆教學', desc: '希臘神話：讓米諾陶衝撞迷宮牆 3 次' },
    { id: 'gkMino', name: '走出迷宮', desc: '希臘神話：擊敗米諾陶（可獲得月桂冠）' }
  ],
  types: (types, L0, ci) => { types.length = 0; types.push('crawler', 'crawler', 'shooter'); if (L0 > 0 || ci >= 1) types.push('splitter', 'centaur'); if (L0 > 0 || ci >= 2) types.push('brute', 'bomber', 'cyclops'); },
  boss: fin => fin ? { kind: 'golem', name: '米諾陶', hp: 205, ext: true, xk: 'minotaur' } : { kind: 'golem', name: '美杜莎', hp: 125, ext: true, xk: 'medusa' },
  boss2: gkMoves, drawBoss: e => (e.xk === 'minotaur' ? drawMinotaur(e) : drawMedusa(e)),
  intro: def => (def.xk === 'minotaur'
    ? [{ who: '旁白', text: '迷宮最深處，黑色的影子低下頭，牛角刮過石牆，火花濺了一地。' }, { who: '旁白', text: '那是米諾陶——陶罐上所有故事的最後一頁。' }]
    : [{ who: '旁白', text: '神殿的柱子之間，蛇髮輕輕地動。石像們的表情，都停在最後一刻。' }, { who: '旁白', text: '不要直視她——躲到柱子後面，橫向移動。' }]),
  onKill: e => {
    const r = L.run;
    if (e.skin === 'jar') { r.gkJars = (r.gkJars || 0) + 1; if (r.gkJars >= 30) L.unlockAch('gkBreak'); if (L.rand() < 0.3) { L.dropCoins(e.x, e.y, 1 + Math.floor(L.rand() * 3)); L.burst(e.x, e.y, 8, [GK_ORG, '#e0642c', C.paper], 140, true); } }
    else if (e.skin === 'hydra' && e.type === 'splitter2' && !e.gkRe && L.rand() < 0.25) { const h = L.spawnEnemy('splitter2', e.x, e.y); h.sleep = false; h.gkRe = true; h.hp = h.maxHp = Math.max(3, Math.round(h.maxHp * 0.5)); L.burst(e.x, e.y, 14, ['#6ac06a', C.paper], 160, true); L.toast('九頭蛇的頭又長出來了！', 1.6); }
    else if (e.skin === 'hydra' && e.gkRe) L.unlockAch('gkHydra');
  },
  onFinal: () => { if (L.th() === 16) L.unlockAch('gkMino'); },
  outro: () => [{ who: '旁白', text: '米諾陶倒下，迷宮的牆一面一面變淡，露出外面的海。' }, { who: '旁白', text: '陶罐上的故事說完了。你的燈，還亮著。' }]
});


/* ===== DLC3：佛寺・渡化道場（run.karma）＋修行路鐘聲 ===== */
const ZK_R = 170, ZK_NEED = [12, 16, 20], ZK_DU = 20;
L.NPCS.saved = { short: '度化者', name: '被度化的影', hp: 3, spd: 215, range: 280, cd: 1.2, dmg: 1.4, col: '#ffe9a0', karma: true, desc: '被你度化的影子，變成了同伴',
  chat: ['謝謝你，終於不用再追了。', '我只是想走到亮的地方。', '這一次，換我替你擋一下。'], hurt: '（輕輕散成光點）', lines: [] };
const ZK_STORY = [
  [{ who: '旁白', text: '這座道場沒有出口。門只為累積了足夠功德的人打開。' }, { who: '小沙彌', text: '打倒影子、讓影子放下、布施給路過的人，都是功德。站在蒲團的圈裡，影子放下得更快；長按 F 可以誦經。' }, { who: '小沙彌', text: '被你打倒的，下一間會轉世回來；被你度化的，會成為你的同伴。' }],
  [{ who: '小沙彌', text: '第二座道場。轉世回來的影子，帶著上一世的樣子，只是比較虛弱。' }],
  [{ who: '小沙彌', text: '最後一座道場。功德需要得更多，但路也快走完了。' }]
];
function zkInit(room, kind) {
  const r = L.run, R = L.ROOM; r.karmaReborn = r.karmaReborn || []; r.karmaSaved = r.karmaSaved || [];
  if (r.karma && kind === 'combat' && L.th() === 14) {
    room.obs.length = 0;
    const cx = R.x + R.w / 2, cy = R.y + R.h / 2, ci = room.combatIdx || 0;
    room.karma = { need: ZK_NEED[Math.min(2, r.layer)] + ci * 2, m: 0, t: 0, spawnT: 1.2, walkT: rr(10, 18), walks: 0, chant: 0, chantCd: 0, done: false, du: 0, cx, cy, init: false };
    room.items.push({ kind: 'tfac', id: 'tfac', fk: 'dojo', x: cx, y: cy, group: 'prop', price: 0, taken: false, st: 'ready', t: 0 });
    return;
  }
  if (r.path && !r.escape && kind === 'combat' && room.path && !room.path.boss && L.th() === 14) { // 修行路：沿路機率出現大鐘
    const P = room.path, len = P.v ? R.h : R.w, cross = P.v ? R.w : R.h;
    for (const f of [0.15, 0.40, 0.65, 0.90]) {
      if (rand() >= 0.55) continue;
      const sv = Math.round(len * f), c = cross * (rand() < 0.5 ? 0.3 : 0.7), pos = P.v ? { x: R.x + c, y: R.y + R.h - sv } : { x: R.x + sv, y: R.y + c };
      room.obs = room.obs.filter(o => !L.overlap(L.inflate(o, 70), { x: pos.x - 20, y: pos.y - 20, w: 40, h: 40 }));
      room.items.push({ kind: 'tfac', id: 'tfac', fk: 'bell', x: pos.x, y: pos.y, group: 'prop', price: 0, taken: false, st: 'ready', t: 0, rp: 0, rt: -1 });
    }
  }
}
function zkSave(e, K, why) { // 度化：敵人化成光點，功德 +2，下一間變成友軍
  const r = L.run; e.dead = true; L.burst(e.x, e.y - 6, 12, ['#ffe9a0', '#fff6d8'], 130, true); K.m += 2; K.du++;
  r.zkDuN = (r.zkDuN || 0) + 1; if (r.zkDuN >= 20) L.unlockAch('zkDu');
  if (e.type !== 'boss' && r.karmaSaved.length < 12) r.karmaSaved.push(e.type);
  if (!r.zkDuTip) { r.zkDuTip = true; L.toast('度化：敵人放下了執念，功德 +2；下一間會成為你的同伴', 3); }
}
function zkKill(e) {
  const r = L.run, K = L.room && L.room.karma; if (!K || K.done || e.type === 'boss') return;
  const w = L.WDEF[L.p.weapons[L.p.w]], zen = !!(w && w.th === 14); K.m += zen ? 3 : 1;
  if (zen) L.burst(e.x, e.y, 6, ['#ffe9a0', '#fff6d8'], 110, true);
  if (r.karmaReborn.length < 30) r.karmaReborn.push(e.type);
  if (!r.zkRbTip) { r.zkRbTip = true; L.toast('被打倒的敵人，下一間會轉世回來（比較虛弱）', 3); }
}
function zkStart(room, K) {
  const r = L.run, p = L.p, R = L.ROOM; K.init = true;
  { const sd = r.zkSaid = r.zkSaid || {}; if (!sd[r.layer]) { sd[r.layer] = 1; const T0 = ZK_STORY[Math.min(2, r.layer)]; L.later(1.6, () => { if (L.room === room && L.state() === 'play') L.say(T0); }); } }
  // 轉世的敵人（每間最多 10 隻，其餘留到下一間）
  let n = 0; const q = r.karmaReborn;
  while (q.length && n < 10) {
    const ty = q.shift(); let e = null; try { const a = rand() * TAU, d = rr(300, 420); e = L.spawnEnemy(ty, clamp(K.cx + Math.cos(a) * d, R.x + 50, R.x + R.w - 50), clamp(K.cy + Math.sin(a) * d, R.y + 50, R.y + R.h - 50)); } catch (er) { e = null; }
    if (!e) continue; e.sleep = false; e.rb = true; e.hp = e.maxHp = Math.max(2, Math.round(e.maxHp * 0.6)); n++;
  }
  if (n) L.toast('轉世：' + n + ' 個影子回來了，比上一世虛弱', 2.6);
  // 被度化的敵人成為友軍（最多 4 位）
  let j = 0; while (r.karmaSaved.length) {
    r.karmaSaved.shift(); const cur = L.allies.filter(a => a.id === 'saved'); if (cur.length >= 4) L.allies.splice(L.allies.indexOf(cur[0]), 1);
    L.addAlly('saved', p.x - 30 - j * 10, p.y + (j % 2 ? 22 : -22)); j++;
  }
  if (j) L.toast('被度化的 ' + j + ' 個影子成為你的同伴', 2.8);
}
function zkTick(dt) {
  const room = L.room, r = L.run, p = L.p; if (!room || L.state() !== 'play' || L.th() !== 14) return;
  const R = L.ROOM;
  // ---- 修行路：撞鐘 ----
  if (r.path && room.path && !room.path.boss) {
    for (const it of room.items) {
      if (it.fk !== 'bell') continue;
      if (it.rt >= 0) it.rt += dt;
      if (it.st === 'done') continue;
      if (p.near === it && L.keys.f) { it.rp = (it.rp || 0) + dt / 1.2; if (it.rp >= 1) zkRing(room, it); } else it.rp = Math.max(0, (it.rp || 0) - dt * 0.8);
    }
    for (const e of L.enemies) if (e.kSlowT > 0) { e.kSlowT -= dt; if (e.kSlowT <= 0 && e.spd0) { e.spd = e.spd0; e.spd0 = 0; } }
    return;
  }
  // ---- 渡化道場 ----
  const K = room.karma; if (!K || !r.karma || K.done || room.cleared) return;
  if (!K.init) zkStart(room, K);
  K.t += dt; K.chantCd = Math.max(0, K.chantCd - dt);
  const alive = L.enemies.filter(e => !e.dead && e.type !== 'boss'), cap = 4 + r.layer * 2 + Math.min(3, room.combatIdx || 0);
  K.spawnT -= dt;
  if (alive.length < cap && K.spawnT <= 0) {
    K.spawnT = Math.max(1.6, 3.4 - r.layer * 0.4); const list = L.composeWave().slice(0, Math.min(3, cap - alive.length)).map(ty => (ty === 'crawler' && rand() < 0.7 ? 'shooter' : ty)); // 道場以多子彈的敵人為主
    for (const ty of list) { const sp = L.freeSpot(13), e = L.spawnEnemy(ty, sp.x, sp.y); e.sleep = false; }
  }
  for (const e of L.enemies) {
    if (e.dead || e.type === 'boss' || e.spawn > 0) continue;
    const inD = Math.hypot(e.x - K.cx, e.y - K.cy) < ZK_R; e.kt = (e.kt || 0) + dt * (inD ? 3 : 1);
    if (e.kt >= ZK_DU) zkSave(e, K);
  }
  const dj = room.items.find(i => i.fk === 'dojo');
  if (dj && p.near === dj && L.keys.f && K.chantCd <= 0) {
    K.chant += dt;
    if (K.chant >= 1.6) { K.chant = 0; K.chantCd = 15; let n = 0; for (const e of L.enemies) if (!e.dead && e.type !== 'boss' && Math.hypot(e.x - K.cx, e.y - K.cy) < 300) { zkSave(e, K); n++; } L.sfx('clear'); L.shake(3); L.toast(n ? '誦經：' + n + ' 個影子放下了執念' : '誦經：周圍沒有影子', 2.2); }
  } else K.chant = Math.max(0, K.chant - dt * 2);
  K.walkT -= dt;
  if (K.walkT <= 0 && K.walks < 2) {
    K.walks++; K.walkT = rr(18, 28); const dir = rand() < 0.5 ? 1 : -1;
    room.items.push({ kind: 'tfac', id: 'tfac', fk: 'walker', x: dir > 0 ? R.x + 40 : R.x + R.w - 40, y: rr(R.y + 120, R.y + R.h - 120), dir, group: 'prop', price: 0, taken: false, st: 'ready', t: 0, n: 0 });
    L.toast('路人經過：靠近按 F，布施 1 燈芯換 2 功德', 2.6);
  }
  for (const it of room.items) if (it.fk === 'walker' && !it.taken) { it.t += dt; it.x += it.dir * 34 * dt; it.y += Math.sin(it.t * 0.8) * 8 * dt; if (it.x < R.x + 10 || it.x > R.x + R.w - 10) { it.taken = true; L.hintReset(); } }
  if (K.m >= K.need) {
    K.done = true; for (const e of L.enemies) if (!e.dead && e.type !== 'boss') { e.dead = true; L.burst(e.x, e.y - 6, 8, ['#ffe9a0', '#fff6d8'], 110, true); }
    for (const it of room.items) if (it.fk === 'walker') it.taken = true;
    L.toast('功德圓滿：可以前往下一間', 3); L.roomCleared(); L.hintReset();
  }
}
function zkRing(room, it) {
  const r = L.run, P = room.path; it.st = 'done'; it.rp = 1; it.rt = 0; if (P) P.zn = Math.max(0, P.zn - 5);
  let n = 0; for (const e of L.enemies) if (!e.dead && e.type !== 'boss' && Math.hypot(e.x - it.x, e.y - it.y) < 420 && !(e.kSlowT > 0)) { e.spd0 = e.spd; e.spd *= 0.5; e.kSlowT = 8; n++; }
  r.zkBells = (r.zkBells || 0) + 1; if (r.zkBells >= 3) L.unlockAch('zkBell');
  L.sfx('clear'); L.shake(3); L.burst(it.x, it.y - 20, 16, ['#ffe9a0', '#d9b46a'], 160, true); L.toast('鐘聲響起：雜念散了一些' + (n ? '，周圍的敵人慢了下來' : ''), 2.8); L.hintReset();
}
function zkUse(it) {
  const p = L.p, K = L.room && L.room.karma;
  if (it.fk === 'dojo') { L.toast('道場：圈內的影子放下得更快；長按 F 誦經，立刻度化周圍的影子（冷卻 15 秒）', 3); return; }
  if (it.fk === 'bell') { L.toast(it.st === 'done' ? '鐘已經敲過了' : '按住 F 約 1.2 秒撞鐘（要停下來）', 1.8); return; }
  if (it.fk === 'walker') {
    if (!K || it.st === 'done') return;
    if (p.coins < 1) { L.toast('燈芯不夠（布施需要 1）', 1.4); L.sfx('tick'); return; }
    p.coins -= 1; K.m += 2; it.n++; if (it.n >= 2) it.st = 'done'; L.sfx('buy'); L.burst(it.x, it.y - 14, 10, ['#ffe9a0', C.paper], 120, true); L.toast('路人合掌：功德 +2（' + K.m + ' / ' + K.need + '）', 2); L.hintReset();
  }
}
function zkHint(it) {
  if (it.fk === 'dojo') return 'F 了解道場　按住 F 誦經';
  if (it.fk === 'bell') return it.st === 'done' ? '' : '按住 F 撞鐘（清雜念、減速敵人）';
  if (it.fk === 'walker') return it.st === 'done' ? '' : 'F 布施 1 燈芯（功德 +2）';
  return '';
}
function zkInfo(it) {
  if (it.fk === 'dojo') return { name: '道場', desc: '圈內的敵人度化得更快（3 倍）。按住 F 誦經 1.6 秒，立刻度化周圍的影子，冷卻 15 秒' };
  if (it.fk === 'bell') return { name: '大鐘' + (it.st === 'done' ? '（已敲）' : ''), desc: '按住 F 約 1.2 秒撞鐘：雜念 −5，周圍敵人減速 8 秒。要停下來，業障牆不會等你' };
  return { name: '路人', desc: '布施 1 燈芯得 2 功德，每位路人最多兩次' };
}
function zkDraw(it) {
  const c = L.ctx, time = L.time, fk = it.fk, done = it.st === 'done'; c.save(); c.translate(it.x, it.y);
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 24, 30, 8, 0, 0, TAU); c.fill(); if (done) c.globalAlpha = 0.5;
  if (fk === 'bell') {
    c.fillStyle = '#4a3320'; c.fillRect(-34, -44, 6, 66); c.fillRect(28, -44, 6, 66); c.fillRect(-36, -48, 72, 8);
    const sw = Math.sin(time * 1.5 + it.t) * (it.rt >= 0 && it.rt < 1.2 ? 0.25 : 0.04); c.save(); c.translate(0, -40); c.rotate(sw);
    c.fillStyle = '#b8883c'; c.beginPath(); c.moveTo(-8, 0); c.quadraticCurveTo(-24, 8, -26, 38); c.lineTo(26, 38); c.quadraticCurveTo(24, 8, 8, 0); c.fill(); c.fillStyle = '#d9b46a'; c.fillRect(-26, 34, 52, 5); c.fillStyle = '#6a4a22'; circ(c, 0, 42, 5); c.restore();
    c.globalAlpha = 1; if (it.rp > 0 && !done) { c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 8; c.beginPath(); c.arc(0, -10, 44, 0, TAU); c.stroke(); c.strokeStyle = '#ffe9a0'; c.lineWidth = 5; c.beginPath(); c.arc(0, -10, 44, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, it.rp)); c.stroke(); }
    if (!done && it.rp <= 0) { c.fillStyle = '#ffd24a'; c.font = '700 16px sans-serif'; c.textAlign = 'center'; c.fillText('！', 0, -58 + Math.sin(time * 5) * 2); }
  } else if (fk === 'dojo') {
    c.fillStyle = '#7a2a22'; c.beginPath(); c.ellipse(0, 6, 40, 20, 0, 0, TAU); c.fill(); c.fillStyle = '#a83a2a'; c.beginPath(); c.ellipse(0, 2, 34, 15, 0, 0, TAU); c.fill(); c.strokeStyle = '#e8c870'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 2, 34, 15, 0, 0, TAU); c.stroke();
    c.globalAlpha = 0.6 + 0.2 * Math.sin(time * 3); c.fillStyle = '#ffe9a0'; circ(c, 0, -16, 7); c.globalAlpha = 1;
    const K = L.room && L.room.karma; if (K && K.chant > 0) { c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 7; c.beginPath(); c.arc(0, -4, 46, 0, TAU); c.stroke(); c.strokeStyle = '#ffe9a0'; c.lineWidth = 4; c.beginPath(); c.arc(0, -4, 46, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, K.chant / 1.6)); c.stroke(); }
  } else if (fk === 'walker') {
    const st = Math.sin(it.t * 5) * 2; c.save(); c.scale(it.dir >= 0 ? 1 : -1, 1);
    c.fillStyle = '#d9822b'; c.beginPath(); c.moveTo(-12, 20); c.lineTo(-8, -8); c.lineTo(8, -8); c.lineTo(12, 20); c.closePath(); c.fill(); c.fillStyle = '#8a4a1c'; c.fillRect(-9, 6 + st * 0.3, 18, 3);
    c.fillStyle = '#e8c8a0'; circ(c, 0, -16, 9); c.fillStyle = '#3a2418'; c.fillRect(-3, -16, 2, 2); c.fillRect(2, -16, 2, 2);
    c.fillStyle = '#3a2418'; c.beginPath(); c.ellipse(13, 6, 7, 4, 0, 0, Math.PI); c.fill();
    c.restore();
  }
  c.globalAlpha = 1;
  if (fk === 'walker' && it.st === 'ready') { c.fillStyle = '#ffd24a'; c.font = '700 16px sans-serif'; c.textAlign = 'center'; c.fillText('！', 0, -34 + Math.sin(time * 5) * 2); }
  c.restore();
}
function zkBack() {
  const room = L.room, c = L.ctx, time = L.time; if (!room) return;
  for (const it of room.items) if (it.fk === 'bell' && it.rt >= 0 && it.rt < 0.9) { const k = it.rt / 0.9; c.save(); c.globalAlpha = 0.6 * (1 - k); c.strokeStyle = '#ffe9a0'; c.lineWidth = 8; c.beginPath(); c.arc(it.x, it.y - 10, 420 * k, 0, TAU); c.stroke(); c.restore(); }
  const K = room.karma; if (!K || !L.run.karma) return;
  c.save(); c.globalAlpha = 0.16 + 0.04 * Math.sin(time * 2); c.fillStyle = '#ffe9a0'; c.beginPath(); c.arc(K.cx, K.cy, ZK_R, 0, TAU); c.fill(); c.globalAlpha = 0.5; c.strokeStyle = '#e8c870'; c.lineWidth = 3; c.setLineDash([12, 10]); c.beginPath(); c.arc(K.cx, K.cy, ZK_R, 0, TAU); c.stroke(); c.setLineDash([]); c.restore();
  for (const e of L.enemies) {
    if (e.dead || e.type === 'boss') continue;
    if (e.rb) { c.save(); c.globalAlpha = 0.35; c.fillStyle = '#ffe9a0'; circ(c, e.x, e.y, e.r + 8 + Math.sin(time * 4 + e.seed) * 2); c.restore(); }
    if (e.kt > 1) { c.save(); c.strokeStyle = 'rgba(255,233,160,.9)'; c.lineWidth = 3; c.beginPath(); c.arc(e.x, e.y, e.r + 6, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, e.kt / ZK_DU)); c.stroke(); c.restore(); }
  }
}
function zkHud() {
  const st = document.createElement('style');
  st.textContent = '#karmaBar{position:absolute;top:1.2cqw;left:50%;transform:translateX(-50%);display:flex;gap:.6cqw;align-items:center;color:var(--paper);font-size:clamp(10px,1.3cqw,15px);pointer-events:none;z-index:6;text-shadow:0 1px 2px #000}#karmaBar i{display:block;width:16cqw;height:.9cqw;min-height:7px;background:rgba(0,0,0,.55);border:1px solid var(--paper)}#karmaBar b{display:block;height:100%;background:#ffe9a0;width:0}';
  document.head.appendChild(st);
  const bar = document.createElement('div'); bar.id = 'karmaBar'; bar.hidden = true; bar.innerHTML = '<span>功德</span><i><b></b></i><em></em>'; L.stageEl.appendChild(bar);
  const fill = bar.querySelector('b'), txt = bar.querySelector('em');
  setInterval(() => {
    const room = L.room, K = room && room.karma, s = L.state(), on = L.th() === 14 && !!K && !!L.run.karma && s !== 'menu' && s !== 'over'; bar.hidden = !on; if (!on) return;
    fill.style.width = Math.min(100, K.m / K.need * 100).toFixed(0) + '%';
    txt.textContent = Math.min(K.m, K.need) + ' / ' + K.need + '　轉世 ' + ((L.run.karmaReborn || []).length) + '　友軍 ' + L.allies.filter(a => a.id === 'saved').length;
  }, 150);
}

try { jpHud(); } catch (e) { /* 滿意度條只是輔助顯示 */ }
try { zkHud(); } catch (e) { /* 功德條只是輔助顯示 */ }

})();
