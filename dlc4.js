/* 《燈火騎士》DLC7「食材廚房」：食材廚房（25）。
   獨立檔案，選到「食材廚房」才下載（需先載入 dlc.js、dlc2.js、dlc3.js）。一般大小的房間、沒有障礙物、沒有視野限制。
   玩法：打敵人掉食材（普通／稀有／特選）→ 交給中央大廚換隨機道具（越換越貴）、或完成大廚的配方；食材放太久會變質降級。
   新敵人：偷燈芯的跳蛙、吃食物的貪吃鬼（吐食材）、食材精（箱子裡亂跑的食材）。事件：上鎖的箱子。
   Boss：調味料彈幕、餐廳大廚（召喚小廚師）、護盾 Boss（40／60 秒沒打倒會再生）。 */
(function () {
'use strict';
const L = window.LK;
if (!L || L.THEMES[25] || !L.THEMES[24] || !L.festLib) return;
const { TAU, circ, rrect, poly, star4, rand, rr, pickOf, clamp } = L;
const { makeFest, xProp, xAdd } = L.festLib;
const OL = '#2a1810', CREAM = '#fff0d0';

/* ---------- 食材 ---------- */
const ING = {
  flour: { n: '麵粉', t: 0, col: '#f2e6c8', g: '麵' }, egg: { n: '雞蛋', t: 0, col: '#fff2d6', g: '蛋' }, veg: { n: '青菜', t: 0, col: '#7ac860', g: '菜' }, meat: { n: '豬肉', t: 0, col: '#e88a7a', g: '肉' },
  cheese: { n: '起司', t: 1, col: '#ffd24a', g: '酪' }, truffle: { n: '松露', t: 1, col: '#6a4a3a', g: '菌' }, shrimp: { n: '鮮蝦', t: 1, col: '#ff9a6a', g: '蝦' },
  caviar: { n: '魚子醬', t: 2, col: '#2a2a3a', g: '卵' }, lobster: { n: '龍蝦', t: 2, col: '#e0402a', g: '龍' }
};
const TIERN = ['普通', '稀有', '特選'], TIERC = ['#ffffff', '#7ac0ff', '#ffd24a'], TIERV = [1, 2, 4];
const BYT = [0, 1, 2].map(t => Object.keys(ING).filter(k => ING[k].t === t));
const SPOIL = 80; // 稀有／特選放這麼久（秒）就降一級
const kit = () => { const r = L.run; return r.kit = r.kit || { bag: [], ex: 0, rec: null, recLayer: -1, got: 0 }; };
const rollIng = (w) => { const x = rand(), t = x < w[0] ? 0 : x < w[0] + w[1] ? 1 : 2; return pickOf(BYT[t]); };
const W_NORM = [0.7, 0.24, 0.06], W_BRUTE = [0.55, 0.35, 0.1], W_CHEST = [0.5, 0.38, 0.12];
function bagAdd(id, quiet) {
  const k = kit(); k.bag.push({ id, age: 0 }); k.got++;
  if (!quiet) { L.sfx('tick'); L.toast('得到「' + ING[id].n + '」（' + TIERN[ING[id].t] + '）　背包 ' + k.bag.length, 1.5); }
}
const bagText = () => { const k = kit(), m = {}; for (const b of k.bag) m[b.id] = (m[b.id] || 0) + 1; const s = Object.keys(m).map(i => ING[i].n + '×' + m[i]).join('、'); return s || '空的'; };
const bagPts = () => kit().bag.reduce((a, b) => a + TIERV[ING[b.id].t], 0);
function groundFood(x, y, id, life) {
  const room = L.room; if (!room) return; room.kf = room.kf || [];
  room.kf.push({ x: clamp(x, L.ROOM.x + 20, L.ROOM.x + L.ROOM.w - 20), y: clamp(y, L.ROOM.y + 20, L.ROOM.y + L.ROOM.h - 20), id, age: 0, life: life || 22 });
}
function drawIng(c, id, x, y, s, fade) {
  const q = ING[id]; c.save(); c.translate(x, y); if (fade !== undefined) c.globalAlpha = fade;
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, s * 0.9, s * 0.8, s * 0.28, 0, 0, TAU); c.fill();
  c.fillStyle = TIERC[q.t]; circ(c, 0, 0, s + 3); c.fillStyle = OL; circ(c, 0, 0, s + 1); c.fillStyle = q.col; circ(c, 0, 0, s - 1);
  c.fillStyle = q.t === 2 && id === 'caviar' ? '#fff' : OL; c.font = '700 ' + Math.round(s * 1.1) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(q.g, 0, 1); c.restore();
}

/* ---------- 敵人：AI ---------- */
function thiefAi(e, dt, nx, ny, d) {
  const p = L.p; e.noTouch = true; e.st = (e.st === undefined ? 1 : e.st) - dt; e.stolen = e.stolen || 0;
  if (e.state === 'walk' || e.state === 'spawn') { e.state = 'walk'; if (e.st <= 0 && d < 420) { e.state = 'wind'; e.st = 0.6; e.hitDone = false; } else if (e.st <= 0) e.st = 0.5; return { mx: nx * 44 * e.spd, my: ny * 44 * e.spd, touch: 0 }; }
  if (e.state === 'wind') { e.tele = Math.max(0, e.st); e.lx = p.x; e.ly = p.y; if (e.st <= 0) { e.state = 'leap'; e.st = 0.45; e.tele = 0; const dd = Math.hypot(e.lx - e.x, e.ly - e.y) || 1, sp = Math.min(dd, 380) / 0.45; e.lvx = (e.lx - e.x) / dd * sp; e.lvy = (e.ly - e.y) / dd * sp; } return { mx: 0, my: 0, touch: 0 }; }
  if (e.state === 'leap') {
    if (!e.hitDone && d < e.r + p.r + 8) {
      e.hitDone = true; const n = Math.min(p.coins | 0, 2 + Math.floor(rand() * 2));
      if (n > 0) { p.coins -= n; e.stolen += n; L.toast('跳蛙偷走了 ' + n + ' 燈芯！打倒它能拿回一部分', 2); L.sfx('hit'); L.burst(p.x, p.y, 8, ['#ffd24a'], 130, true); } else L.toast('跳蛙撲了個空（你沒有燈芯可偷）', 1.4);
    }
    if (e.st <= 0) { e.state = e.stolen > 0 ? 'flee' : 'walk'; e.st = e.state === 'flee' ? 2.2 : rr(2, 3); L.burst(e.x, e.y, 8, ['#8fd08a', '#5a8a4a'], 140, true); }
    return { mx: e.lvx, my: e.lvy, touch: 0 };
  }
  if (e.state === 'flee') { if (e.st <= 0) { e.state = 'walk'; e.st = rr(2, 3); } return { mx: -nx * 150 * e.spd, my: -ny * 150 * e.spd, touch: 0 }; }
  e.state = 'walk'; return { mx: 0, my: 0, touch: 0 };
}
function gluttonAi(e, dt, nx, ny, d) {
  e.noTouch = true; e.wt = (e.wt || 0) + dt; e.ate = e.ate || []; e.w = (e.w || rand() * TAU) + dt * 0.8;
  const room = L.room; let tx = null, ty = null, best = 1e9, tk = null, tb = null;
  if (room && room.kf) for (const f of room.kf) { const dd = Math.hypot(f.x - e.x, f.y - e.y); if (dd < best) { best = dd; tk = f; tb = null; } }
  for (const q of L.enemies) if (!q.dead && q.type === 'foodbit' && q.spawn <= 0) { const dd = Math.hypot(q.x - e.x, q.y - e.y); if (dd < best) { best = dd; tb = q; tk = null; } }
  if (tk) { tx = tk.x; ty = tk.y; } else if (tb) { tx = tb.x; ty = tb.y; }
  if (tx !== null) {
    if (best < e.r + 12) {
      if (tk) { room.kf.splice(room.kf.indexOf(tk), 1); e.ate.push(tk.id); } else { tb.dead = true; e.ate.push(tb.fid || 'veg'); }
      e.chew = 0.5; L.burst(e.x, e.y, 6, ['#ffd0a0', '#ff9a6a'], 100, true); L.sfx('tick'); if (e.ate.length === 1) L.toast('貪吃鬼在吃掉在地上的食材！打倒它會吐出一部分', 2.4);
    }
    const dx = tx - e.x, dy = ty - e.y, dd = Math.hypot(dx, dy) || 1; return { mx: dx / dd * 78 * e.spd, my: dy / dd * 78 * e.spd, touch: 0 };
  }
  e.chew = Math.max(0, (e.chew || 0) - dt);
  return { mx: Math.cos(e.w) * 22 * e.spd, my: Math.sin(e.w * 1.3) * 22 * e.spd, touch: 0 };
}
function foodbitAi(e, dt, nx, ny, d) {
  const p = L.p; e.noTouch = true; e.life = (e.life === undefined ? 22 : e.life) - dt; e.w = (e.w || rand() * TAU) + dt * 2;
  if (e.life <= 0) { e.dead = true; L.burst(e.x, e.y, 6, ['#ddd'], 90, true); return { mx: 0, my: 0, touch: 0 }; }
  if (d < e.r + p.r + 10) {
    e.dead = true; const id = e.fid || 'veg';
    if (e.hurt) { const c = pickOf(BYT[0]); bagAdd(c, true); L.toast('食材被打壞了……只收到「' + ING[c].n + '」（普通）', 2); } else { bagAdd(id, true); L.toast('收集「' + ING[id].n + '」（' + TIERN[ING[id].t] + '）　背包 ' + kit().bag.length, 1.8); }
    L.sfx('buy'); L.burst(e.x, e.y, 10, [ING[id].col, '#fff'], 140, true); return { mx: 0, my: 0, touch: 0 };
  }
  const k = d < 230 ? -1 : 0; return { mx: (nx * k + Math.cos(e.w)) * 62 * e.spd, my: (ny * k + Math.sin(e.w * 1.2)) * 62 * e.spd, touch: 0 };
}

/* ---------- 敵人：繪圖 ---------- */
function drawKitEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, tm = e.t, fa = Math.atan2(L.p.y - e.y, L.p.x - e.x);
  const eyes = (ex, ey, er) => { c.fillStyle = '#fff'; circ(c, -ex, ey, er); circ(c, ex, ey, er); c.fillStyle = OL; circ(c, -ex + Math.cos(fa) * 2, ey + Math.sin(fa) * 2, er * 0.5); circ(c, ex + Math.cos(fa) * 2, ey + Math.sin(fa) * 2, er * 0.5); };
  if (sk === 'minichef') {
    c.fillStyle = OL; circ(c, 0, 4, r * 1.05); c.fillStyle = f ? CREAM : '#f4e4c8'; circ(c, 0, 4, r * 0.95); c.fillStyle = OL; circ(c, 0, -r * 0.7, r * 0.75); c.fillStyle = f ? CREAM : '#fff'; circ(c, -r * 0.35, -r * 0.8, r * 0.45); circ(c, r * 0.35, -r * 0.8, r * 0.45); circ(c, 0, -r * 1.05, r * 0.5); c.fillRect(-r * 0.7, -r * 0.55, r * 1.4, r * 0.3);
    eyes(r * 0.32, 2, r * 0.22); c.fillStyle = '#b84a3a'; c.fillRect(-r * 0.25, r * 0.4, r * 0.5, 3);
  } else if (sk === 'pepper') {
    c.fillStyle = OL; rrect(c, -r * 0.7, -r * 0.9, r * 1.4, r * 1.9, 5); c.fillStyle = f ? CREAM : '#cfd6dc'; rrect(c, -r * 0.6, -r * 0.5, r * 1.2, r * 1.4, 4); c.fillStyle = '#8a8f96'; rrect(c, -r * 0.6, -r * 1.0, r * 1.2, r * 0.55, 4);
    c.fillStyle = OL; for (let k = 0; k < 4; k++) circ(c, -r * 0.3 + (k % 2) * r * 0.6, -r * 0.85 + (k >> 1) * r * 0.22, 1.8); eyes(r * 0.25, 0, r * 0.2); if (e.tele > 0) { c.fillStyle = 'rgba(40,30,30,.55)'; for (let k = 0; k < 5; k++) circ(c, Math.cos(fa) * (r + 6 + k * 5), Math.sin(fa) * (r + 6 + k * 5) + (k % 2) * 4, 2.4); }
  } else if (sk === 'pot') {
    c.fillStyle = OL; circ(c, 0, 4, r * 1.12); c.fillStyle = f ? CREAM : '#4a4e58'; circ(c, 0, 4, r); c.fillStyle = '#6a707c'; c.fillRect(-r, -r * 0.35, r * 2, r * 0.3); c.fillStyle = OL; rrect(c, -r * 1.35, -r * 0.3, r * 0.4, r * 0.18, 3); rrect(c, r * 0.95, -r * 0.3, r * 0.4, r * 0.18, 3);
    c.fillStyle = f ? CREAM : '#7c828e'; rrect(c, -r * 0.75, -r * 0.95, r * 1.5, r * 0.5, 5); c.fillStyle = OL; circ(c, 0, -r * 1.05, 3.5); eyes(r * 0.35, r * 0.3, r * 0.22); c.fillStyle = 'rgba(255,255,255,.5)'; for (let k = 0; k < 3; k++) circ(c, -r * 0.4 + k * r * 0.4, -r * 1.3 - ((tm * 20 + k * 9) % 14), 3);
  } else if (sk === 'egg') {
    const pulse = e.fz !== undefined ? 0.5 + 0.5 * Math.sin(tm * 18) : 0; c.fillStyle = OL; c.beginPath(); c.ellipse(0, 2, r * 0.95, r * 1.2, 0, 0, TAU); c.fill(); c.fillStyle = f ? CREAM : pulse > 0.5 ? '#ffb8a0' : '#fff2d6'; c.beginPath(); c.ellipse(0, 2, r * 0.85, r * 1.1, 0, 0, TAU); c.fill();
    c.fillStyle = '#ffc83a'; circ(c, 0, 4, r * 0.4); eyes(r * 0.28, -2, r * 0.17);
  } else if (sk === 'sausage') {
    const a = e.ra || fa; if (e.tele > 0) { c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#ff6a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 260, Math.sin(a) * 260); c.stroke(); c.restore(); }
    c.fillStyle = OL; rrect(c, -r * 1.2, -r * 0.6, r * 2.4, r * 1.2, r * 0.6); c.fillStyle = f ? CREAM : '#c8503a'; rrect(c, -r * 1.1, -r * 0.5, r * 2.2, r, r * 0.5); c.fillStyle = '#e8805a'; c.fillRect(-r * 0.9, -r * 0.4, r * 1.8, r * 0.18); eyes(r * 0.4, -2, r * 0.2);
  } else if (sk === 'kettle') {
    c.fillStyle = OL; circ(c, 0, 4, r * 1.1); c.fillStyle = f ? CREAM : '#c8a45a'; circ(c, 0, 4, r); c.fillStyle = OL; rrect(c, -r * 0.2, -r * 1.25, r * 0.4, r * 0.3, 3); c.strokeStyle = OL; c.lineWidth = 3; c.beginPath(); c.arc(0, -r * 0.2, r * 0.8, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
    c.fillStyle = OL; poly(c, [[r * 0.8, 0], [r * 1.5, -r * 0.5], [r * 1.4, r * 0.1]]); eyes(r * 0.3, 2, r * 0.2); if (e.tele > 0) { c.fillStyle = 'rgba(255,255,255,.7)'; for (let k = 0; k < 3; k++) circ(c, r * 1.5 + k * 5, -r * 0.5 - k * 6, 4); }
  } else if (sk === 'popcorn') {
    const hot = e.fz !== undefined ? 0.5 + 0.5 * Math.sin(tm * 20) : 0; c.fillStyle = OL; rrect(c, -r * 0.8, -r * 0.1, r * 1.6, r * 1.2, 4); c.fillStyle = f ? CREAM : hot > 0.5 ? '#ff9a6a' : '#e8403a'; rrect(c, -r * 0.7, 0, r * 1.4, r * 1.05, 3); c.fillStyle = '#fff'; for (let k = 0; k < 3; k++) c.fillRect(-r * 0.45 + k * r * 0.45, 0, r * 0.2, r * 1.05);
    for (const [x, y, rad] of [[-r * 0.5, -r * 0.3, r * 0.45], [r * 0.5, -r * 0.3, r * 0.45], [0, -r * 0.6, r * 0.5], [-r * 0.1, -r * 0.2, r * 0.4]]) { c.fillStyle = OL; circ(c, x, y, rad + 1.5); c.fillStyle = f ? CREAM : '#fff4c8'; circ(c, x, y, rad); }
  } else if (sk === 'thiefrog') {
    c.fillStyle = OL; circ(c, 0, 4, r * 1.1); c.fillStyle = f ? CREAM : '#6aa850'; circ(c, 0, 4, r); c.fillStyle = '#4a8838'; circ(c, -r * 0.7, -r * 0.55, r * 0.38); circ(c, r * 0.7, -r * 0.55, r * 0.38);
    c.fillStyle = '#fff'; circ(c, -r * 0.7, -r * 0.6, r * 0.28); circ(c, r * 0.7, -r * 0.6, r * 0.28); c.fillStyle = OL; circ(c, -r * 0.7 + Math.cos(fa) * 2, -r * 0.6 + Math.sin(fa) * 2, r * 0.12); circ(c, r * 0.7 + Math.cos(fa) * 2, -r * 0.6 + Math.sin(fa) * 2, r * 0.12);
    c.fillStyle = '#2a2a3a'; c.fillRect(-r * 0.9, -r * 0.1, r * 1.8, r * 0.34); c.fillStyle = '#fff'; c.fillRect(-r * 0.62, -r * 0.02, r * 0.4, r * 0.14); c.fillRect(r * 0.22, -r * 0.02, r * 0.4, r * 0.14);
    c.fillStyle = '#ffd24a'; circ(c, 0, r * 0.62, r * 0.28); c.fillStyle = OL; c.font = '700 ' + Math.round(r * 0.5) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('芯', 0, r * 0.64);
    if (e.stolen > 0) { c.fillStyle = '#ffd24a'; c.font = '700 11px sans-serif'; c.fillText('+' + e.stolen, 0, -r * 1.3); }
  } else if (sk === 'glutton') {
    const chew = e.chew > 0 ? Math.abs(Math.sin(tm * 18)) * 4 : 0; c.fillStyle = OL; circ(c, 0, 2, r * 1.15); c.fillStyle = f ? CREAM : '#e8a0b8'; circ(c, 0, 2, r * 1.05);
    c.fillStyle = '#fff'; circ(c, -r * 0.4, -r * 0.35, r * 0.24); circ(c, r * 0.4, -r * 0.35, r * 0.24); c.fillStyle = OL; circ(c, -r * 0.4, -r * 0.3, r * 0.1); circ(c, r * 0.4, -r * 0.3, r * 0.1);
    c.fillStyle = '#5a1a2a'; c.beginPath(); c.ellipse(0, r * 0.35, r * 0.62, r * 0.28 + chew, 0, 0, TAU); c.fill(); c.fillStyle = '#fff'; for (let k = 0; k < 4; k++) c.fillRect(-r * 0.45 + k * r * 0.3, r * 0.1, 3, 4);
    c.fillStyle = '#f4e4c8'; rrect(c, -r * 0.55, -r * 1.2, r * 1.1, r * 0.3, 3);
    const n = (e.ate || []).length; if (n) { c.fillStyle = '#fff'; c.font = '700 11px sans-serif'; c.textAlign = 'center'; c.fillText('吃了' + n, 0, -r * 1.45); }
  } else if (sk === 'foodbit') {
    drawIng(c, e.fid || 'veg', 0, Math.sin(tm * 6) * 2, r, e.life !== undefined && e.life < 5 ? 0.45 + 0.45 * Math.sin(tm * 14) : undefined);
    if (e.hurt) { c.strokeStyle = '#ff6a5a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-r * 0.4, -r * 0.2); c.lineTo(r * 0.1, r * 0.4); c.stroke(); }
  }
}
function kitBg(g, R, rng, arR) {
  const tile = 70; g.globalAlpha = 0.18; g.fillStyle = '#ffffff';
  for (let x = R.x; x < R.x + R.w; x += tile) for (let y = R.y; y < R.y + R.h; y += tile) if (((x - R.x) / tile + (y - R.y) / tile) % 2 === 0) g.fillRect(x, y, tile, tile);
  g.globalAlpha = 1;
  for (let i = 0; i < Math.round(26 * arR); i++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.fillStyle = 'rgba(255,200,120,' + (0.06 + rng() * 0.08) + ')'; g.beginPath(); g.ellipse(x, y, 10 + rng() * 22, 6 + rng() * 12, rng() * 3, 0, TAU); g.fill(); }
}
function drawKitFac(c, it, tm, done) {
  if (it.fk === 'chef') {
    c.fillStyle = '#8a8f96'; rrect(c, -56, 4, 112, 30, 5); c.fillStyle = '#b9bec4'; rrect(c, -56, 4, 112, 8, 4);
    c.fillStyle = OL; circ(c, 0, -10, 24); c.fillStyle = '#f2c8a0'; circ(c, 0, -10, 21); c.fillStyle = OL; circ(c, -8, -12, 3); circ(c, 8, -12, 3); c.fillRect(-8, 0, 16, 3);
    c.fillStyle = OL; circ(c, -14, -36, 17); circ(c, 14, -36, 17); circ(c, 0, -42, 19); c.fillStyle = '#fff'; circ(c, -14, -36, 15); circ(c, 14, -36, 15); circ(c, 0, -42, 17); c.fillRect(-20, -32, 40, 12);
    c.fillStyle = '#ff6a3a'; c.font = '700 13px sans-serif'; c.textAlign = 'center'; c.fillText('大廚', 0, 28); return;
  }
  if (it.fk === 'pool') {
    c.fillStyle = '#3a3e48'; c.beginPath(); c.ellipse(0, 12, 52, 26, 0, 0, TAU); c.fill(); c.fillStyle = '#e8803a'; c.beginPath(); c.ellipse(0, 6, 44, 20, 0, 0, TAU); c.fill();
    for (let k = 0; k < 3; k++) { const lit = done || k < it.n; c.fillStyle = lit ? '#ffe27a' : '#c8602a'; circ(c, -24 + k * 24, 4 + Math.sin(tm * 3 + k) * 2, 9); }
    c.fillStyle = 'rgba(255,255,255,.5)'; for (let k = 0; k < 3; k++) circ(c, -20 + k * 20, -18 - ((tm * 14 + k * 8) % 16), 3.5);
  } else if (it.fk === 'work') {
    c.fillStyle = '#8a5a3a'; rrect(c, -46, -6, 92, 34, 5); c.fillStyle = '#b07a4a'; rrect(c, -46, -6, 92, 10, 4); c.fillStyle = '#d8dce0'; poly(c, [[-28, -10], [18, -10], [22, -30], [-28, -22]]); c.fillStyle = '#5a3a20'; c.fillRect(18, -26, 22, 8);
    c.fillStyle = '#7ac860'; circ(c, -10, -4, 7); c.fillStyle = '#e88a7a'; circ(c, 8, -4, 7);
  } else {
    c.fillStyle = '#5a3a24'; rrect(c, -30, -34, 60, 66, 4); c.fillStyle = '#7a5434'; for (let r2 = 0; r2 < 3; r2++) for (let c2 = 0; c2 < 2; c2++) rrect(c, -26 + c2 * 27, -30 + r2 * 21, 23, 18, 2);
    const cols = ['#e0402a', '#ffd24a', '#7ac860', '#f2e6c8', '#ff9a3a', '#a04a8a']; for (let k = 0; k < 6; k++) { c.fillStyle = cols[k]; circ(c, -14 + (k % 2) * 27, -21 + (k >> 1) * 21, 5); }
  }
}
function drawKitBoss(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 2) * 4;
  if (e.xk === 'kspice') {
    c.fillStyle = 'rgba(255,160,60,.14)'; circ(c, 0, b, 104);
    c.fillStyle = OL; rrect(c, -62, -64 + b, 124, 150, 22); c.fillStyle = fl ? CREAM : '#d8dee4'; rrect(c, -56, -40 + b, 112, 120, 18); c.fillStyle = '#e0402a'; rrect(c, -56, -14 + b, 112, 40, 4);
    c.fillStyle = OL; rrect(c, -48, -76 + b, 96, 44, 12); c.fillStyle = fl ? CREAM : '#8a8f96'; rrect(c, -44, -72 + b, 88, 36, 10); c.fillStyle = OL; for (let k = 0; k < 6; k++) circ(c, -30 + (k % 3) * 30, -62 + b + (k >> 1) % 2 * 12 + (k >= 3 ? 6 : 0), 3.4);
    c.fillStyle = '#fff'; circ(c, -20, 4 + b, 11); circ(c, 20, 4 + b, 11); c.fillStyle = OL; circ(c, -20, 6 + b, 5); circ(c, 20, 6 + b, 5);
    for (let k = 0; k < 3; k++) { const a = t * 1.6 + k * TAU / 3; c.fillStyle = ['#e0402a', '#ffd24a', '#7a4a2a'][k]; circ(c, Math.cos(a) * 92, Math.sin(a) * 78 + b, 9); }
  } else if (e.xk === 'kchef') {
    const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'minichef' && q.spawn <= 0).length;
    if (n >= 4) { c.strokeStyle = 'rgba(255,230,120,' + (0.55 + 0.2 * Math.sin(t * 8)) + ')'; c.lineWidth = 6; c.beginPath(); c.arc(0, b, 96, 0, TAU); c.stroke(); }
    c.fillStyle = OL; circ(c, 0, 24 + b, 58); c.fillStyle = fl ? CREAM : '#fff'; circ(c, 0, 24 + b, 54); c.fillStyle = '#e0402a'; c.fillRect(-12, -2 + b, 24, 50);
    c.fillStyle = OL; circ(c, 0, -26 + b, 40); c.fillStyle = fl ? CREAM : '#f2c8a0'; circ(c, 0, -26 + b, 37);
    c.fillStyle = OL; for (const [x, y, rad] of [[-30, -72, 28], [30, -72, 28], [0, -86, 32], [0, -68, 30]]) circ(c, x, y + b, rad + 3); c.fillStyle = fl ? CREAM : '#fff'; for (const [x, y, rad] of [[-30, -72, 28], [30, -72, 28], [0, -86, 32], [0, -68, 30]]) circ(c, x, y + b, rad); c.fillRect(-36, -54 + b, 72, 14);
    c.fillStyle = '#fff'; circ(c, -14, -28 + b, 9); circ(c, 14, -28 + b, 9); c.fillStyle = OL; circ(c, -14, -26 + b, 4); circ(c, 14, -26 + b, 4); c.fillRect(-18, -42 + b, 12, 3); c.fillRect(6, -42 + b, 12, 3); c.fillRect(-14, -10 + b, 28, 4);
    c.save(); c.translate(54, 20 + b); c.rotate(0.5 + Math.sin(t * 3) * 0.2); c.fillStyle = '#d8dce0'; poly(c, [[-4, -4], [8, -4], [8, -60], [-4, -48]]); c.fillStyle = '#5a3a20'; c.fillRect(-4, -4, 12, 22); c.restore();
  } else {
    const open = e.open && L.time < e.open, lives = 1 + (e.l2 ? 0 : 0);
    c.fillStyle = open ? 'rgba(255,230,120,.28)' : 'rgba(120,180,255,.18)'; circ(c, 0, b, 116);
    c.fillStyle = OL; circ(c, 0, b, 84); c.fillStyle = fl ? CREAM : (open ? '#ffb86a' : '#9aa6b4'); circ(c, 0, b, 80); c.fillStyle = open ? '#ffe9b0' : '#c4ced8'; circ(c, 0, b, 62);
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 4; c.beginPath(); c.arc(0, b, 70, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
    c.fillStyle = OL; rrect(c, -9, -96 + b, 18, 20, 5); c.fillStyle = fl ? CREAM : '#6a707c'; rrect(c, -7, -94 + b, 14, 16, 4);
    c.fillStyle = '#fff'; circ(c, -22, -6 + b, 12); circ(c, 22, -6 + b, 12); c.fillStyle = OL; circ(c, -22, -4 + b, 5); circ(c, 22, -4 + b, 5); c.fillRect(-16, 26 + b, 32, 5);
    if (e.fh !== undefined) { const el = L.time - e.fh; c.font = '700 13px sans-serif'; c.textAlign = 'center'; c.fillStyle = el >= 40 ? '#ff6a5a' : '#fff'; c.fillText((e.l3 ? '第三條命' : e.l2 ? '第二條命' : '第一條命') + '　' + Math.floor(el) + ' 秒', 0, -112 + b); }
    void lives;
  }
}

/* ---------- 大廚（交換／配方） ---------- */
const RECIPES = ['麵疙瘩湯', '起司蛋捲', '蔬菜燉肉', '海鮮鍋', '松露燉飯', '蝦仁炒蛋'];
function newRecipe() {
  const k = kit(), need = {}, pick = (t) => { const id = pickOf(BYT[t]); need[id] = (need[id] || 0) + 1; };
  pick(0); pick(0); pick(rand() < 0.5 ? 0 : 1); if (rand() < 0.7) pick(1);
  k.rec = { name: pickOf(RECIPES), need, done: false }; k.recLayer = L.run.layer;
}
const recText = rc => Object.keys(rc.need).map(i => ING[i].n + '×' + rc.need[i]).join('＋');
function recOk(rc) { const m = {}; for (const b of kit().bag) m[b.id] = (m[b.id] || 0) + 1; return Object.keys(rc.need).every(i => (m[i] || 0) >= rc.need[i]); }
function bagTake(id) { const bag = kit().bag, i = bag.findIndex(b => b.id === id); if (i >= 0) bag.splice(i, 1); }
function reward(hiTier) {
  const p = L.p, room = L.room, x = rand();
  if (x < 0.35) { const u = hiTier ? L.premUpgrade() : L.rewardUpgrade(); L.toast('大廚的謝禮：強化「' + L.UPGN(u) + '」', 3); }
  else if (x < 0.55) { L.healP(1); p.coins += 6; L.toast('大廚端來一碗熱湯：燈火 +1、燈芯 +6', 3); }
  else if (x < 0.7) { const w = L.makeItem('weapon', L.p.x, L.p.y + 50, 'prop'); room.items.push(w); L.toast('大廚遞來一把廚具（地上的武器）', 3); }
  else if (x < 0.85) { p.coins += 14; L.toast('大廚塞給你一把燈芯 +14', 2.6); }
  else { p.skillCd = 0; const u = L.rewardUpgrade(); L.toast('大廚的特製點心：技能冷卻重置、強化「' + L.UPGN(u) + '」', 3.2); }
}
function chefUse(it) {
  const k = kit(), p = L.p;
  if (k.recLayer !== L.run.layer || !k.rec) newRecipe();
  const rc = k.rec;
  if (!rc.done && recOk(rc)) {
    for (const i of Object.keys(rc.need)) for (let n = 0; n < rc.need[i]; n++) bagTake(i);
    rc.done = true; L.sfx('clear'); L.burst(it.x, it.y - 20, 30, ['#ffd24a', '#fff', '#ff9a3a'], 220, true);
    const u = L.premUpgrade(); L.healP(2); p.coins += 12; L.room.items.push(L.makeItem('weapon', it.x, it.y + 70, 'prop'));
    L.toast('「' + rc.name + '」完成！精良強化「' + L.UPGN(u) + '」、燈火 +2、燈芯 +12、一把武器', 4); L.unlockAch('kcRecipe'); L.hintReset(); return;
  }
  const cost = Math.min(9, 3 + k.ex);
  if (bagPts() < cost) { L.toast('食材不夠：這次交換需要 ' + cost + ' 點（普通 1、稀有 2、特選 4），目前 ' + bagPts() + ' 點', 2.8); L.sfx('tick'); return; }
  const sorted = k.bag.slice().sort((a, b) => TIERV[ING[a.id].t] - TIERV[ING[b.id].t]); let sum = 0, hi = 0; const used = [];
  for (const b of sorted) { if (sum >= cost) break; used.push(b); sum += TIERV[ING[b.id].t]; hi = Math.max(hi, ING[b.id].t); }
  k.bag = k.bag.filter(b => used.indexOf(b) < 0); k.ex++; L.sfx('buy'); L.burst(it.x, it.y - 20, 14, ['#ffd24a', '#fff'], 150, true);
  reward(hi >= 1); L.hintReset();
}
function chefInfo(it) {
  const k = kit(); if (k.recLayer !== L.run.layer || !k.rec) newRecipe();
  const cost = Math.min(9, 3 + k.ex), rc = k.rec;
  return { name: '食材大廚', desc: '背包：' + bagText() + '（' + bagPts() + ' 點）。\n交換：F 交出 ' + cost + ' 點食材換隨機道具（越換越貴）；點數：普通 1、稀有 2、特選 4。\n配方「' + rc.name + '」：' + recText(rc) + (rc.done ? '（已完成）' : recOk(rc) ? '（材料齊了！按 F）' : '') + '，完成有大獎。' };
}

/* ---------- 上鎖的箱子（事件） ---------- */
function chestDraw(it) {
  const c = L.ctx; c.save(); c.translate(it.x, it.y + Math.sin(L.time * 2 + it.x) * 1.5); c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(0, 26, 34, 8, 0, 0, TAU); c.fill();
  c.fillStyle = OL; rrect(c, -32, -18, 64, 46, 5); c.fillStyle = it.open ? '#7a5a3a' : '#a8743a'; rrect(c, -29, -4, 58, 29, 4);
  if (it.open) { c.fillStyle = '#5a3a20'; poly(c, [[-29, -4], [29, -4], [34, -34], [-34, -34]]); c.fillStyle = '#ffe27a'; c.globalAlpha = 0.5 + 0.3 * Math.sin(L.time * 5); c.fillRect(-26, -2, 52, 8); }
  else { c.fillStyle = '#c8905a'; rrect(c, -29, -18, 58, 18, 4); c.fillStyle = '#6a707c'; c.fillRect(-29, -6, 58, 5); c.fillStyle = '#ffd24a'; rrect(c, -7, -12, 14, 16, 3); c.fillStyle = OL; circ(c, 0, -5, 2.5); c.fillRect(-1, -4, 2, 6); }
  c.restore();
}
const chest = {
  toast: '上鎖的箱子：花 4 燈芯開鎖，裡面的食材會跑出來！', setup: (room, cx, cy) => xAdd(room, cx, cy, 'kchest'),
  info: it => ({ name: '上鎖的箱子', desc: it.open ? '食材精跑出來了：它們會到處逃、也會被自動瞄準——走過去碰到才能收集；打它會讓品質掉成普通，打爆更什麼都拿不到' : '按 F 花 4 燈芯開鎖：6 個食材精會跑出來（約 22 秒後消失），碰到才能收集' }),
  hint: it => it.open ? '' : 'F 開鎖（4 燈芯）',
  use(it) {
    if (it.open) return; if (L.p.coins < 4) { L.toast('燈芯不夠（開鎖 4 燈芯）', 1.6); L.sfx('tick'); return; }
    L.p.coins -= 4; it.open = true; L.sfx('clear'); L.burst(it.x, it.y - 10, 24, ['#ffe27a', '#fff'], 220, true);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + rand(), e = L.spawnEnemy('foodbit', it.x + Math.cos(a) * 50, it.y + Math.sin(a) * 50); e.sleep = false; e.noRez = true; e.spawn = 0.35; e.fid = rollIng(W_CHEST); e.life = 22; }
    L.toast('鎖開了！食材精跑出來了——碰到它才能收集，別打壞', 3); L.hintReset();
  },
  draw: chestDraw
};

/* ---------- 世界 ---------- */
const F = {
  theme: 25, name: '食材廚房',
  pal: { ink: '#1e1612', floor: '#4a4036', floor2: '#54493c', wall1: '#7a5a3a', wall2: '#a9794a', top: '#ffd9a0', door: '#ffb02e' },
  amb: ['lowpass', 1400, 0.8, 0.004], ev: r => { const n = [330, 392, 494, 587][Math.floor(r() * 4)]; L.blip(n, n * 1.003, 0.35, 'triangle', 0.007); },
  skinMap: { crawler: 'minichef', shooter: 'pepper', brute: 'pot', bomber: 'egg', sausage: 'sausage', kettle: 'kettle', popcorn: 'popcorn', thiefrog: 'thiefrog', glutton: 'glutton', foodbit: 'foodbit' }, drawEnemy: drawKitEnemy,
  layout: R => [
    { fk: 'chef', x: R.x + R.w / 2, y: R.y + R.h / 2 },
    { fk: 'pool', x: R.x + 130, y: R.y + 100 },
    { fk: 'work', x: R.x + 130, y: R.y + R.h - 95 },
    { fk: 'nook', x: R.x + R.w - 130, y: R.y + R.h - 95 }
  ],
  bgDraw: kitBg, zones: ['', '', '', '', '', ''], zoneCol: 'rgba(0,0,0,0)',
  obsKinds: [{ jk: 'x', w: [30, 32], h: [30, 32] }], obsDraw: () => { },
  bossObs: () => [],
  plantFor: () => { }, plantSmall: [], plantToast: '', tobDraw: () => false,
  aff: { w: ['chefknife', 'ladlecannon', 'pipingbag', 'peppershaker', 'skewer', 'flame', 'scatter', 'lance', 'firefly', 'blade'], u: ['wick', 'oil', 'skpow'] },
  fx: ['#ffd24a', '#e8803a', '#7ac860'], nookMobs: ['crawler', 'sausage'], marketCol: ['#3a2a1a', '#e0402a', '#fff0d0', '#ffe27a'],
  fac: {
    market: '廚房市集', chef: { name: '食材大廚', fin: '' },
    pool: { name: '湯鍋', noun: '湯料', verb: '下料', fin: '湯鍋已經空了' },
    work: { name: '砧板', verb: '開始備料', start: '砧板震動——巨大的鍋子精帶著小廚師衝出來了！', end: '砧板安靜了', fin: '備料完成', desc: '按 F 開始：巨大的鍋子精（精英）與 4 隻小怪出現；全部打倒得一把武器與燈芯' },
    nook: { name: '香料櫃', verb: '翻香料', fin: '香料櫃空了' }
  },
  drawFac: drawKitFac,
  bosses: {
    kspice: { name: '調味料瓶王', type: 'barrage', achName: '調味完成', t: { fan: '胡椒扇！', ring: '鹽粒圈！', spiral: '辣椒旋風！', lanes: '調味料橫掃——看缺口！', rain: '香料雨！' },
      intro: [{ who: '旁白', text: '廚房的調味架整排晃了起來，一只巨大的調味瓶從架上跳了下來，瓶口噴著細細的香料粉。' }, { who: '調味料瓶王', text: '今天的菜，我說了才算！誰敢亂加鹽，我就讓他嚐嚐全部的味道！' }] },
    kchef: { name: '餐廳大廚', type: 'swarm', achName: '收攤打烊', t: { summon: '小廚師就位！', rally: '出餐加速——小廚師衝刺！', army: '全員上菜！', fan2: '菜刀飛旋！' },
      intro: [{ who: '旁白', text: '廚房深處，一位戴著高高廚師帽的巨人拍了拍手，一排小廚師立刻從四面八方列隊跑來。' }, { who: '餐廳大廚', text: '我的廚房，不容許外人亂闖！小廚師們，備料！' }, { who: '旁白', text: '只要小廚師圍在大廚身邊，大廚幾乎不吃傷害——先清掉小廚師。' }] },
    kshield: { name: '護盾鍋蓋', type: 'long', achName: '掀開鍋蓋', t: { charge: '鍋蓋滾來——撞完後蓋子掀開 3 秒是弱點，傷害 ×2！', soldiers: '小廚師來幫忙！', ring2: '蒸氣環！', slam: '鍋蓋重壓！' },
      intro: [{ who: '旁白', text: '爐灶上的大鍋蓋「噹」地一聲彈了起來，穩穩地蓋在你面前，像一面厚實的盾牌。' }, { who: '護盾鍋蓋', text: '想掀開我？先撐過去再說——要是撐過一陣子，我還會再燉一輪！' }, { who: '旁白', text: '首次受傷後 40 秒內沒打倒它，護盾會再生（第二條命 60% 血量）；60 秒內還沒打倒，還有第三條命（30%）。' }] }
  },
  swarmSkin: 'minichef', armTip: '小廚師圍著大廚——先清掉小廚師，Boss 才會吃傷害', drawBoss: drawKitBoss,
  events: [
    { id: 'kchest', name: '', toast: '', verb: '', col: '#a8743a', glyph: '箱', desc: '', fin: '', done: '', r1: '', r2: '' },
    { id: 'kdummy1', name: '', toast: '', desc: '', fin: '', done: '', draw: () => { } },
    { id: 'kdummy2', name: '', toast: '', verb: '', col: '#a8743a', glyph: '箱', desc: '', fin: '', done: '' }
  ],
  weapons: {
    chefknife: { id: 'chefknife', name: '菜刀', tag: '近戰', mode: 'tap', cd: 0.45, th: 25, col: '#d8dce0', range: 135, half: 1.3, dmg: 3.7, kb: 340, desc: '大範圍的弧形揮砍（食材廚房專屬，類似提燈刃）' },
    ladlecannon: { id: 'ladlecannon', name: '湯勺砲', tag: '單發', mode: 'tap', cd: 0.38, th: 25, col: '#ffb86a', desc: '甩出一大勺熱湯，傷害高（食材廚房專屬，類似燈焰杖）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 560, 9, 3.9 * dm, 'flame', 1.0); L.sfx('flame'); } },
    pipingbag: { id: 'pipingbag', name: '擠花袋', tag: '連射', mode: 'auto', cd: 0.11, th: 25, col: '#fff0d0', desc: '按住連射奶油，射速快（食材廚房專屬，類似螢火弓）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang + (rand() - 0.5) * 0.07, 720, 4, 1.15 * dm, 'pellet', 0.8); L.sfx('tick'); } },
    peppershaker: { id: 'peppershaker', name: '胡椒罐', tag: '散射', mode: 'tap', cd: 0.62, th: 25, col: '#8a8f96', desc: '五發胡椒散射，近距離很痛（食材廚房專屬，類似霰光杖）',
      fire: (ox, oy, ang, dm) => { for (let i = -2; i <= 2; i++) L.shoot(ox, oy, ang + i * 0.16, 520, 6, 1.9 * dm, 'pellet', 0.55); L.sfx('blade'); } },
    skewer: { id: 'skewer', name: '烤肉串', tag: '貫穿', mode: 'tap', cd: 0.75, th: 25, col: '#e88a7a', desc: '貫穿一整排敵人的長籤（食材廚房專屬，類似穿光矛）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 700, 8, 4.6 * dm, 'lance', 0.95, true); L.sfx('blade'); } }
  },
  achIds: ['kcSpice', 'kcChef', 'kcShield', 'kcFac'], facAch: ['廚房小幫手', '同一局完成湯鍋與砧板'],
  ext: {
    sausage: { hp: 7, r: 15, name: '香腸衝鋒', cost: 3, cap: 3, ai: 'dasher' }, kettle: { hp: 9, r: 15, name: '噴氣水壺', cost: 3, cap: 3, ai: 'floater' }, popcorn: { hp: 5, r: 13, name: '爆米花', cost: 3, cap: 3, ai: 'kamikaze' },
    thiefrog: { hp: 8, r: 14, name: '偷燈芯的跳蛙', cost: 3, cap: 2, ai: thiefAi }, glutton: { hp: 12, r: 17, name: '貪吃鬼', cost: 3, cap: 2, ai: gluttonAi }, foodbit: { hp: 10, r: 12, name: '食材精', cost: 0, cap: 0, ai: foodbitAi }
  },
  story: [
    [{ who: '旁白', text: '一股燉肉與麵包的香氣撲面而來。這座廚房大得像一座城，爐火都還燒著，卻一個廚師也沒有。' }, { who: '大廚', text: '旅人！食材都亂跑了，小廚師也不聽話……打倒它們，把掉下來的食材撿來給我，我會給你好東西！' }],
    [{ who: '旁白', text: '爐火更旺了。有些食材放得太久，已經不再新鮮。' }, { who: '大廚', text: '記得，好食材要趁新鮮交給我。擺太久的松露，就只是一塊泥巴了。' }]
  ],
  shards: ['食譜紙條：「最好的調味，是有人等你回家吃飯。」', '食譜紙條：鹽放太多可以加水，心急卻沒辦法重來。', '食譜紙條：大廚說，鍋蓋不是用來擋人的，是用來讓湯慢慢變好喝的。'],
  outro: [{ who: '大廚', text: '好香啊……今天的飯，終於可以開了。' }, { who: '旁白', text: '爐火慢慢降成柔和的橘色，你的燈在滿桌的熱氣裡，安靜地亮著。' }]
};

const real = L.registerWorld; let cap = null; L.registerWorld = w => { cap = w; };
try { makeFest(F); } finally { L.registerWorld = real; }
if (!cap) return;

cap.opt = '食材廚房（DLC7）'; cap.bigMap = false;
{ const o0 = cap.obs; cap.obs = (kind, R, D) => { o0(kind, R, D); return []; }; }
// 事件：只有「上鎖的箱子」
cap.events = { kchest: chest };
// 設施：加上大廚
{
  const info0 = cap.info, hint0 = cap.hint, use0 = cap.useItem, draw0 = cap.drawItem;
  cap.info = it => it.fk === 'chef' ? chefInfo(it) : info0(it);
  cap.hint = it => it.fk === 'chef' ? (() => { const k = kit(); return 'F 找大廚（交換需 ' + Math.min(9, 3 + k.ex) + ' 點，背包 ' + bagPts() + ' 點）'; })() : hint0(it);
  cap.useItem = it => it.fk === 'chef' ? chefUse(it) : use0(it);
  cap.drawItem = it => it.fk === 'chef' ? (() => { const c = L.ctx; c.save(); c.translate(it.x, it.y); c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 30, 56, 10, 0, 0, TAU); c.fill(); drawKitFac(c, it, L.time, false); c.restore(); })() : draw0(it);
}
// 第二間（事件房）：戰鬥＋商人＋上鎖的箱子，門不鎖
{
  const ri0 = cap.roomInit;
  cap.roomInit = (room, kind) => {
    ri0(room, kind); if (kind !== 'event' || L.th() !== 25) return;
    const R = L.ROOM, gy = R.y + 85, cx = R.x + R.w / 2;
    room.items.push(L.makeItem('heal', cx - 130, gy, 'shop'), L.makeItem('upgrade', cx, gy, 'shop'), L.makeItem(rand() < 0.65 ? 'weapon' : 'upgrade', cx + 130, gy, 'shop'));
    room.refreshN = 0; room.items.push({ kind: 'refresh', id: 'refresh', slot: 'refresh', x: cx + 250, y: gy, price: 3, group: 'stall', taken: false });
    const pool = ['crawler', 'shooter', 'sausage', 'kettle', 'thiefrog', 'glutton'];
    room.kcPool = pool; // 敵人在進房後的第一個 tick 生成（進房流程會清空敵人列表）
  };
}
// 敵人種類：新敵人加進池子
{
  const t0 = cap.types;
  cap.types = (types, L0, ci) => { t0(types, L0, ci); types.push('thiefrog'); if (L0 > 0 || ci >= 1) types.push('glutton'); if (L0 >= 2) types.push('thiefrog', 'glutton'); };
}
// 受擊：食材精變質、護盾 Boss 再生
{
  const hm0 = cap.hitMod;
  cap.hitMod = (e, dmg) => {
    if (e.type === 'foodbit') { e.hurt = true; return dmg; }
    const d = hm0(e, dmg);
    if (e.type === 'boss' && e.xk === 'kshield' && !e.bleedNow) {
      if (e.fh === undefined) { e.fh = L.time; L.toast('護盾鍋蓋：首次受傷後 40 秒內沒打倒，護盾會再生！', 3.2); }
      if (d >= e.hp) {
        const el = L.time - e.fh;
        if (el >= 40 && !e.l2) { e.l2 = true; e.hp = Math.round(e.maxHp * 0.6) + d; L.toast('護盾再生——第二條命（60% 血量）！', 2.6); L.burst(e.x, e.y, 40, ['#9ac8ff', '#fff'], 260, true); L.sfx('clear'); }
        else if (el >= 60 && e.l2 && !e.l3) { e.l3 = true; e.hp = Math.round(e.maxHp * 0.3) + d; L.toast('護盾又再生——第三條命（30% 血量）！', 2.6); L.burst(e.x, e.y, 40, ['#9ac8ff', '#fff'], 260, true); L.sfx('clear'); }
      }
    }
    return d;
  };
}
// 擊倒掉落
{
  const k0 = cap.onKill;
  cap.onKill = e => {
    k0(e); if (L.th() !== 25 || !L.room) return;
    if (e.type === 'boss') return;
    if (e.type === 'foodbit') { groundFood(e.x, e.y, pickOf(BYT[0]), 14); return; }
    if (e.type === 'thiefrog') { if (e.stolen > 0) { const back = Math.max(1, Math.floor(e.stolen * 0.6)); L.dropCoins(e.x, e.y, back); L.toast('跳蛙吐回了 ' + back + ' 燈芯（偷走 ' + e.stolen + '）', 2); } }
    if (e.type === 'glutton') {
      const ate = e.ate || [], spit = ate.length ? Math.max(1, Math.floor(ate.length * 0.5)) : 0, base = Math.max(1, 4 - Math.floor((e.wt || 0) / 10));
      for (let i = 0; i < spit; i++) groundFood(e.x + rr(-34, 34), e.y + rr(-34, 34), ate[i], 26);
      for (let i = 0; i < base; i++) groundFood(e.x + rr(-34, 34), e.y + rr(-34, 34), rollIng(W_NORM), 26);
      L.toast('貪吃鬼吐出 ' + spit + ' 個吃掉的食材，另掉 ' + base + ' 個' + (base < 4 ? '（拖得越久掉得越少）' : ''), 2.6); return;
    }
    const ch = e.type === 'brute' ? 0.45 : e.type === 'crawler' ? 0.28 : 0.34;
    if (rand() < ch) groundFood(e.x, e.y, rollIng(e.type === 'brute' ? W_BRUTE : W_NORM), 20);
  };
}
// 每幀：撿地上的食材、變質
{
  const tk0 = cap.tick, p = () => L.p;
  cap.tick = dt => {
    tk0(dt); const room = L.room; if (!room || L.th() !== 25 || L.state() !== 'play') return;
    if (room.kind === 'event' && room.kcPool && !room.kcDone) { room.kcDone = true; const R = L.ROOM; for (let i = 0; i < 4; i++) { const e = L.spawnEnemy(pickOf(room.kcPool), R.x + rr(80, R.w - 80), R.y + R.h - rr(60, 130)); e.noRez = true; } }
    if (room.kf) for (let i = room.kf.length - 1; i >= 0; i--) {
      const f = room.kf[i]; f.age += dt;
      if (Math.hypot(p().x - f.x, p().y - f.y) < 36) { room.kf.splice(i, 1); bagAdd(f.id); L.burst(f.x, f.y, 6, [ING[f.id].col, '#fff'], 100, true); }
      else if (f.age >= f.life) room.kf.splice(i, 1);
    }
    const k = kit();
    for (const b of k.bag) {
      const q = ING[b.id]; if (q.t === 0) continue; b.age += dt;
      if (b.age >= SPOIL) { const nid = pickOf(BYT[q.t - 1]); L.toast('「' + q.n + '」放太久，變質成了「' + ING[nid].n + '」（' + TIERN[q.t - 1] + '）', 2.4); b.id = nid; b.age = 0; L.sfx('hit'); }
    }
  };
  const bk0 = cap.back;
  cap.back = () => {
    bk0(); const room = L.room, c = L.ctx; if (!room || !room.kf || L.th() !== 25) return;
    for (const f of room.kf) { const left = f.life - f.age; drawIng(c, f.id, f.x, f.y + Math.sin(L.time * 4 + f.x) * 2, 11, left < 4 ? 0.4 + 0.4 * Math.sin(L.time * 14) : undefined); }
  };
}
cap.ach = (cap.ach || []).concat([{ id: 'kcRecipe', name: '大廚的配方', desc: '食材廚房：完成一次大廚的配方' }]);
real(cap);
})();
