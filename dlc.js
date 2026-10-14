/* 《燈火騎士》DLC 檔：糖果世界(9)、電玩世界(10)、未來世界(11)、字母書房(12)、彼岸(13)。
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
  onMid: () => { if (L.th() === 12 && L.run.hurtN === (L.run.hurtL || 0)) L.unlockAch('inkSafe'); },
  onKill: e => {
    if (L.th() !== 12 || e.skin !== 'block' || !e.lt) return;
    const r = L.run, need = 'LAMP'[r.spN || 0];
    if (e.lt === need) { r.spN = (r.spN || 0) + 1; L.toast('拼字：' + 'LAMP'.split('').map((ch, i) => i < r.spN ? ch : '＿').join(' '), 1.4); if (r.spN >= 4) { r.spN = 0; L.unlockAch('spell'); } }
    else r.spN = e.lt === 'L' ? 1 : 0;
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

})();
