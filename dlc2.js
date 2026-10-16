/* 《燈火騎士》DLC5「季節慶典」：萬聖節(19)、耶誕節(20)、復活節(21)。
   獨立檔案，玩家在 DLC 選單選到「季節慶典」才下載（需先載入 dlc.js）；世界編號必須依序註冊。
   目前已完成：萬聖節（19）。 */
(function () {
'use strict';
const L = window.LK;
if (!L || L.THEMES[19] || !L.THEMES[18]) return;
const { C, TAU, circ, rrect, poly, star4, rand, rr, pickOf, clamp } = L;

/* ================= 萬聖節（19）：視野有限、超大地圖、三隻 Boss（彈幕／大群／長戰） ================= */
const PAL19 = { ink: '#0d0614', floor: '#2a1c3c', floor2: '#33234a', wall1: '#3b1f5a', wall2: '#5a2f8a', top: '#ffb347', door: '#ff8c1a' };
const HW_SKIN = { crawler: 'skel', shooter: 'wiz', brute: 'pumpk', ghost: 'sheet', bat: 'bat', bomber: 'pumpk' };
const OL = '#0d0614', ORG = '#f08a1c', BONE = '#ece6d4';
const HW_STORY = [
  [{ who: '旁白', text: '十月的最後一個夜晚，墓園的門自己開了。南瓜燈一盞一盞地亮起來，卻沒有一盞，是為了照路。' }, { who: '南瓜燈', text: '提燈的旅人……今晚，連鬼也怕黑。你的燈，借我們靠一靠好嗎？' }, { who: '旁白', text: '小心：這裡看不遠。靠近南瓜燈，或讓你的燈亮一點。' }],
  [{ who: '旁白', text: '第二個夜晚更深了。月亮被雲吃掉一半，墓碑之間傳來骨頭互相敲打的聲音，像在數人頭。' }, { who: '南瓜燈', text: '最大的那一位，在鬼屋的最深處。他說，他不是想嚇人，只是沒人陪他過節。' }]
];
const HW_SHARDS = ['南瓜日記：今年的糖果，又被幽靈偷吃了一半。', '南瓜日記：骷髏們練習了一整年的「嘩啦」，只為了今晚嚇你一跳。', '南瓜日記：蝙蝠不怕黑，牠只是怕被人當成吸血鬼。', '南瓜日記：據說，最亮的南瓜燈裡，住著一個很久沒回家的小孩。'];
const HW_ZONE = ['南瓜田', '墓園', '鬼屋', '枯樹林', '十字路口', '糖果集市'];
let HW = null;

/* ---- 敵人繪製 ---- */
function drawHwEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, tm = e.t, fa = Math.atan2(L.p.y - e.y, L.p.x - e.x);
  if (sk === 'skel' || sk === 'kid') {
    if (sk === 'kid') { c.fillStyle = OL; circ(c, 0, 0, r * 1.1); c.fillStyle = f ? C.paper : ORG; circ(c, 0, 0, r); c.fillStyle = OL; poly(c, [[-r * 0.5, -r * 0.1], [-r * 0.15, -r * 0.1], [-r * 0.32, -r * 0.5]]); poly(c, [[r * 0.5, -r * 0.1], [r * 0.15, -r * 0.1], [r * 0.32, -r * 0.5]]); c.fillRect(-r * 0.45, r * 0.25, r * 0.9, 3); return; }
    const sw = Math.sin(tm * 8) * 3; c.fillStyle = OL; rrect(c, -r * 0.75, -r * 0.1 + sw * 0.2, r * 1.5, r * 1.15, 3); c.fillStyle = f ? C.paper : (e.rez ? '#b9c7a0' : BONE); rrect(c, -r * 0.65, 0 + sw * 0.2, r * 1.3, r * 0.95, 3);
    c.fillStyle = OL; for (let k = 0; k < 3; k++) c.fillRect(-r * 0.5, r * 0.15 + k * r * 0.25 + sw * 0.2, r, 2);
    c.fillStyle = OL; circ(c, 0, -r * 0.55, r * 0.72); c.fillStyle = f ? C.paper : (e.rez ? '#b9c7a0' : BONE); circ(c, 0, -r * 0.55, r * 0.65);
    c.fillStyle = OL; circ(c, -r * 0.24, -r * 0.6, r * 0.17); circ(c, r * 0.24, -r * 0.6, r * 0.17); c.fillRect(-r * 0.3, -r * 0.25, r * 0.6, 3); c.fillStyle = '#ff6a3a'; circ(c, -r * 0.24 + Math.cos(fa) * 2, -r * 0.6 + Math.sin(fa) * 2, r * 0.07); circ(c, r * 0.24 + Math.cos(fa) * 2, -r * 0.6 + Math.sin(fa) * 2, r * 0.07);
  } else if (sk === 'wiz') {
    c.fillStyle = OL; poly(c, [[-r * 1.05, r], [0, -r * 0.5], [r * 1.05, r]]); c.fillStyle = f ? C.paper : '#5a2f8a'; poly(c, [[-r * 0.9, r * 0.9], [0, -r * 0.35], [r * 0.9, r * 0.9]]);
    c.fillStyle = OL; poly(c, [[-r * 0.7, -r * 0.3], [0, -r * 1.7], [r * 0.7, -r * 0.3]]); c.fillRect(-r * 0.95, -r * 0.4, r * 1.9, 4); c.fillStyle = f ? C.paper : '#7a46b8'; poly(c, [[-r * 0.55, -r * 0.35], [0, -r * 1.5], [r * 0.55, -r * 0.35]]);
    c.fillStyle = '#ffe27a'; circ(c, -r * 0.2, -r * 0.05, 2.5); circ(c, r * 0.2, -r * 0.05, 2.5); const g = 0.6 + 0.4 * Math.sin(tm * 6); c.fillStyle = 'rgba(120,255,160,' + g + ')'; circ(c, Math.cos(fa) * r * 1.2, Math.sin(fa) * r * 1.2, r * 0.3);
  } else if (sk === 'pumpk') {
    const fl = 0.85 + Math.sin(tm * 8) * 0.1; c.fillStyle = 'rgba(255,170,60,' + (0.2 * fl) + ')'; circ(c, 0, 0, r * 1.9);
    c.fillStyle = OL; c.beginPath(); c.ellipse(0, 2, r * 1.15, r * 1.02, 0, 0, TAU); c.fill(); c.fillStyle = f ? C.paper : ORG; c.beginPath(); c.ellipse(0, 2, r * 1.05, r * 0.92, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.22)'; c.lineWidth = 2; for (const k of [-0.5, 0, 0.5]) { c.beginPath(); c.ellipse(0, 2, r * (0.55 + k * 0.4), r * 0.92, 0, 0, TAU); c.stroke(); }
    c.fillStyle = OL; c.fillRect(-3, -r * 1.15, 6, 8); c.fillStyle = '#ffe27a'; poly(c, [[-r * 0.55, -r * 0.05], [-r * 0.15, -r * 0.05], [-r * 0.35, -r * 0.5]]); poly(c, [[r * 0.55, -r * 0.05], [r * 0.15, -r * 0.05], [r * 0.35, -r * 0.5]]);
    poly(c, [[-r * 0.6, r * 0.3], [-r * 0.3, r * 0.5], [0, r * 0.3], [r * 0.3, r * 0.5], [r * 0.6, r * 0.3], [r * 0.4, r * 0.7], [-r * 0.4, r * 0.7]]);
  } else if (sk === 'bat') {
    const w = Math.sin(tm * 18) * 0.6; c.fillStyle = OL; for (const s of [-1, 1]) { poly(c, [[s * r * 0.3, -r * 0.2], [s * r * 1.9, -r * (0.9 + w)], [s * r * 1.5, r * 0.1], [s * r * 1.1, r * 0.5], [s * r * 0.3, r * 0.4]]); }
    c.fillStyle = f ? C.paper : '#3a2255'; circ(c, 0, 0, r * 0.75); poly(c, [[-r * 0.5, -r * 0.5], [-r * 0.3, -r * 1.1], [-r * 0.05, -r * 0.55]]); poly(c, [[r * 0.5, -r * 0.5], [r * 0.3, -r * 1.1], [r * 0.05, -r * 0.55]]);
    c.fillStyle = '#ff5a4a'; circ(c, -r * 0.28, -r * 0.1, 2.5); circ(c, r * 0.28, -r * 0.1, 2.5);
  } else { // sheet：床單幽靈，在暗處幾乎看不見
    let lit = true; try { lit = L.ghostLit(e); } catch (er) { lit = true; }
    c.save(); c.globalAlpha = lit ? 0.95 : 0.2; const b = Math.sin(tm * 3) * 3;
    c.fillStyle = f ? C.paper : '#f2f0fa'; c.beginPath(); c.moveTo(-r, r * 0.9 + b); c.lineTo(-r, -r * 0.1 + b); c.quadraticCurveTo(-r, -r * 1.2 + b, 0, -r * 1.2 + b); c.quadraticCurveTo(r, -r * 1.2 + b, r, -r * 0.1 + b); c.lineTo(r, r * 0.9 + b);
    for (let k = 0; k < 4; k++) c.lineTo(r - (k + 0.5) * r * 0.5, r * 0.5 + (k % 2) * 6 + b); c.closePath(); c.fill();
    c.fillStyle = OL; circ(c, -r * 0.35, -r * 0.35 + b, r * 0.2); circ(c, r * 0.35, -r * 0.35 + b, r * 0.2); c.beginPath(); c.ellipse(0, r * 0.1 + b, r * 0.18, r * 0.26, 0, 0, TAU); c.fill(); c.restore();
  }
}
function batAi(e, dt, nx, ny, d) {
  e.st = (e.st === undefined ? rr(1, 2) : e.st) - dt; if (!e.state || e.state === 'spawn' || e.state === 'walk') { e.state = 'orbit'; e.oa = rand() * TAU; }
  let mx = 0, my = 0, touch = 1;
  if (e.state === 'orbit') {
    e.oa += dt * 1.6 * (e.seed > 3 ? 1 : -1); const P = L.p, tx = P.x + Math.cos(e.oa) * 190 - e.x, ty = P.y + Math.sin(e.oa) * 190 - e.y, l = Math.hypot(tx, ty) || 1, v = Math.min(150 * e.spd, l * 3);
    mx = tx / l * v; my = ty / l * v; if (e.st <= 0) { e.state = 'wind'; e.st = 0.45; }
  } else if (e.state === 'wind') { e.tele = e.st; if (e.st <= 0) { e.state = 'swoop'; e.st = 0.7; e.tele = 0; e.ra = Math.atan2(L.p.y - e.y, L.p.x - e.x); } }
  else if (e.state === 'swoop') { mx = Math.cos(e.ra) * 360 * e.spd; my = Math.sin(e.ra) * 360 * e.spd; touch = 2; if (e.st <= 0) { e.state = 'orbit'; e.st = rr(1.6, 2.8); } }
  return { mx, my, touch };
}

/* ---- 地圖：南瓜燈柱會發光，其餘是墓碑與枯樹 ---- */
function hwMake(R) {
  const zw = R.w / 3, zh = R.h / 2, zc = z => ({ x: R.x + (z % 3 + 0.5) * zw, y: R.y + (Math.floor(z / 3) + 0.5) * zh });
  const zs = L.shuffle([0, 3, 5]), a = zc(zs[0]), b = zc(zs[1]), al = zc(4), cp = zc(1);
  HW = { R: { x: R.x, y: R.y, w: R.w, h: R.h }, live: false, slots: [{ fk: 'market', x: R.x + R.w - 340, y: R.y + 170 }, { fk: 'altar', x: al.x, y: al.y + 20 }, { fk: 'grave', x: a.x + rr(-90, 90), y: a.y + rr(-60, 60) }, { fk: 'patch', x: b.x + rr(-90, 90), y: b.y + rr(-60, 60) }, { fk: 'camp', x: cp.x + rr(-120, 120), y: cp.y + rr(-60, 60) }] };
  return HW;
}
function hwObs(kind, R, D) {
  const lamps = (xs) => xs.map(q => ({ x: q[0], y: q[1], w: 34, h: 34, jk: 'lamp' }));
  if (kind === 'boss') {
    return lamps([[R.x + 110, R.y + 80], [R.x + R.w - 150, R.y + 80], [R.x + 110, R.y + R.h - 120], [R.x + R.w - 150, R.y + R.h - 120], [R.x + R.w / 2 - 17, R.y + 50], [R.x + R.w / 2 - 17, R.y + R.h - 84]])
      .concat([{ x: R.x + R.w * 0.38, y: R.y + R.h / 2 - 150, w: 34, h: 46, jk: 'tomb' }, { x: R.x + R.w * 0.38, y: R.y + R.h / 2 + 104, w: 34, h: 46, jk: 'tomb' }, { x: R.x + R.w * 0.62, y: R.y + R.h / 2 - 40, w: 34, h: 46, jk: 'tomb' }]);
  }
  hwMake(R); const sl = HW.slots;
  const keep = sl.map(s => s.fk === 'market' ? { x: s.x - 230, y: s.y - 100, w: 520, h: 220 } : s.fk === 'altar' ? { x: s.x - 200, y: s.y - 150, w: 400, h: 300 } : { x: s.x - 150, y: s.y - 140, w: 300, h: 280 });
  keep.push({ x: R.x, y: D.y - 100, w: 170, h: 200 }, { x: R.x + R.w - 170, y: D.y - 100, w: 170, h: 200 });
  const obs = [], total = 40, ks = ['tomb', 'tomb', 'tomb', 'tree', 'tree', 'lamp'];
  let lampN = 0;
  for (let t = 0; t < 1200 && obs.length < total; t++) {
    const jk = lampN < 10 && obs.length % 4 === 0 ? 'lamp' : pickOf(ks), w = jk === 'tree' ? rr(40, 52) : jk === 'lamp' ? 34 : rr(30, 40), h = jk === 'tree' ? rr(54, 70) : jk === 'lamp' ? 34 : rr(42, 56);
    const o = { x: rr(R.x + 90, R.x + R.w - 90 - w), y: rr(R.y + 50, R.y + R.h - 50 - h), w, h, jk };
    if (keep.some(k => L.overlap(k, o)) || obs.some(q => L.overlap(L.inflate(q, jk === 'lamp' ? 160 : 80), o))) continue;
    if (jk === 'lamp') lampN++; obs.push(o);
  }
  return obs;
}
function hwObsDraw(g, o) {
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
  if (o.jk === 'lamp') {
    g.fillStyle = '#2a1830'; g.fillRect(cx - 4, cy - 2, 8, o.h / 2 + 8); g.fillStyle = OL; g.beginPath(); g.ellipse(cx, cy - 6, 19, 17, 0, 0, TAU); g.fill(); g.fillStyle = ORG; g.beginPath(); g.ellipse(cx, cy - 6, 16, 14, 0, 0, TAU); g.fill();
    g.fillStyle = '#ffe27a'; poly(g, [[cx - 8, cy - 10], [cx - 3, cy - 10], [cx - 5.5, cy - 16]]); poly(g, [[cx + 8, cy - 10], [cx + 3, cy - 10], [cx + 5.5, cy - 16]]); poly(g, [[cx - 9, cy - 1], [cx - 4, cy + 2], [cx, cy - 1], [cx + 4, cy + 2], [cx + 9, cy - 1], [cx + 5, cy + 5], [cx - 5, cy + 5]]);
  } else if (o.jk === 'tree') {
    g.fillStyle = '#1b0f22'; g.fillRect(cx - 7, cy - 4, 14, o.h / 2 + 4); g.strokeStyle = '#1b0f22'; g.lineWidth = 5; g.lineCap = 'round';
    for (const q of [[-1, -0.9], [1, -1], [-0.6, -1.5], [0.7, -1.4]]) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + q[0] * o.w * 0.7, cy + q[1] * o.h * 0.4); g.stroke(); }
  } else {
    g.fillStyle = OL; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 10); g.fillStyle = '#7d7890'; rrect(g, o.x, o.y, o.w, o.h, 10); g.fillStyle = '#9a95ad'; rrect(g, o.x + 3, o.y + 3, o.w - 10, o.h * 0.4, 8);
    g.strokeStyle = '#4a4560'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, o.y + o.h * 0.3); g.lineTo(cx, o.y + o.h * 0.7); g.moveTo(cx - 6, o.y + o.h * 0.45); g.lineTo(cx + 6, o.y + o.h * 0.45); g.stroke();
  }
}
function hwBg(g, rm, rng, arR) {
  const R = L.ROOM;
  for (let i = 0; i < Math.round(60 * arR); i++) { g.fillStyle = 'rgba(' + (rng() < 0.5 ? '90,60,130' : '60,40,90') + ',' + (0.2 + rng() * 0.25) + ')'; const sz = 2 + rng() * 5; g.fillRect(R.x + rng() * R.w, R.y + rng() * R.h, sz, sz * 0.6); }
  for (let k = 0; k < Math.round(6 * arR); k++) { const gr = g.createRadialGradient(R.x + rng() * R.w, R.y + rng() * R.h, 0, R.x + rng() * R.w, R.y + rng() * R.h, 300); gr.addColorStop(0, 'rgba(150,110,200,.10)'); gr.addColorStop(1, 'rgba(150,110,200,0)'); g.fillStyle = gr; g.fillRect(R.x, R.y, R.w, R.h); }
  for (let i = 0; i < Math.round(26 * arR); i++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.fillStyle = 'rgba(236,230,212,.25)'; g.fillRect(x, y, 10, 2); g.fillRect(x + 2, y - 3, 2, 8); }
  if (rm.kind === 'combat' && R.w > 2000) { g.font = '700 34px sans-serif'; g.textAlign = 'center'; g.fillStyle = 'rgba(255,200,120,.10)'; for (let z = 0; z < 6; z++) g.fillText(HW_ZONE[z], R.x + (z % 3 + 0.5) * R.w / 3, R.y + (Math.floor(z / 3) + 0.5) * R.h / 2 - 110); }
}

/* ---- 設施：糖果商人、召喚祭壇、墓園夜襲、南瓜田 ---- */
function hwSpawn(n, near, types) {
  const out = []; for (let i = 0; i < n; i++) {
    const a = rand() * TAU, d = rr(200, 330), x = clamp(near.x + Math.cos(a) * d, L.ROOM.x + 60, L.ROOM.x + L.ROOM.w - 60), y = clamp(near.y + Math.sin(a) * d, L.ROOM.y + 60, L.ROOM.y + L.ROOM.h - 60);
    const e = L.spawnEnemy(pickOf(types || ['crawler', 'crawler', 'shooter']), x, y); e.sleep = false; e.noRez = true; out.push(e);
  } return out;
}
function hwInit(room, kind) {
  const r = L.run; if (L.th() !== 19) return;
  if (kind !== 'combat') { HW = kind === 'boss' ? HW : null; if (HW) HW.live = false; }
  { const sd = r.hwSaid = r.hwSaid || {}; if (kind !== 'start' && !sd[r.layer]) { sd[r.layer] = 1; const T0 = HW_STORY[r.layer & 1]; L.later(2.0, () => { if (L.room === room && L.state() === 'play') L.say(T0); }); } }
  if (kind !== 'combat' || !HW) return;
  HW.live = true; room.refreshN = 0;
  for (const s of HW.slots) {
    if (s.fk === 'market') {
      room.items.push(L.makeItem('heal', s.x - 130, s.y, 'shop'), L.makeItem('upgrade', s.x, s.y, 'shop'), L.makeItem(rand() < 0.65 ? 'weapon' : 'upgrade', s.x + 130, s.y, 'shop'));
      room.items.push({ kind: 'refresh', id: 'refresh', slot: 'refresh', x: s.x + 250, y: s.y, price: 3, group: 'stall', taken: false });
    } else room.items.push({ kind: 'tfac', id: 'tfac', fk: s.fk, x: s.x, y: s.y, group: 'prop', price: 0, taken: false, st: 'ready', t: s.fk === 'camp' ? 0 : rand() * 6, n: 0 });
  }
  if (!r.hwDarkTip) { r.hwDarkTip = true; L.later(4.5, () => { if (L.room === room) L.toast('萬聖節：視野有限——靠近南瓜燈，或讓你的燈亮一點', 3); }); }
}
const HW_NAME = { altar: '召喚祭壇', grave: '墓園夜襲', patch: '南瓜田', camp: '鬼故事營火' };
function hwStoryEnd(x, y) {
  const r = L.rand(); L.sfx('clear');
  if (r < 0.4) { L.healP(1); L.p.coins += 8; L.toast('故事很溫暖：燈火 +1、燈芯 +8', 2.8); }
  else if (r < 0.75) { L.p.skillCd = 0; const u = L.rewardUpgrade(); L.toast('聽完有了勇氣：技能冷卻重置、強化「' + L.UPGN(u) + '」', 3); }
  else { for (let i = 0; i < 3; i++) { const sp = L.freeSpot(14), e = L.spawnEnemy('ghost', sp.x, sp.y); e.sleep = false; e.noRez = true; } L.dropCoins(x, y + 40, 14); L.toast('被嚇到了！鬼跳出來（先收下 14 燈芯）', 3); }
  L.hintReset();
}
function hwDone(it, msg) { it.st = 'done'; const r = L.run; r.hwFac = r.hwFac || {}; r.hwFac[it.fk] = 1; if (r.hwFac.altar && r.hwFac.grave) L.unlockAch('hwFac'); if (msg) L.toast(msg, 3); L.hintReset(); }
function hwUse(it) {
  const p = L.p, room = L.room;
  if (it.st === 'done') { L.toast('這裡已經結束了', 1.4); return; }
  if (it.st === 'busy') { L.toast('進行中……', 1.2); return; }
  if (it.fk === 'camp') { L.toast('站在營火旁邊聽 6 秒就好', 1.6); return; }
  if (it.fk === 'altar') {
    const big = L.spawnEnemy('brute', it.x, it.y - 100); big.sleep = false; big.noRez = true; big.hp = big.maxHp = Math.round(big.maxHp * 2.6); big.r = Math.round(big.r * 1.35); big.hwElite = true;
    it.mobs = [big].concat(hwSpawn(4, it, ['crawler', 'crawler', 'shooter'])); it.st = 'busy'; L.burst(it.x, it.y, 22, [ORG, '#ffe27a', '#a46bff'], 200, true); L.sfx('kill'); L.toast('祭壇亮了——巨大的南瓜怪醒來了！', 2.8); L.hintReset();
  } else if (it.fk === 'grave') {
    it.mobs = hwSpawn(6, it, ['crawler', 'crawler', 'crawler', 'shooter']); it.st = 'busy'; L.burst(it.x, it.y, 18, ['#7d7890', BONE], 180, true); L.sfx('kill'); L.toast('墓土翻動……骷髏爬出來了！全部打倒', 2.8); L.hintReset();
  } else if (it.fk === 'patch') {
    it.n++; L.sfx('hit'); L.burst(it.x, it.y, 12, [ORG, '#ffe27a'], 160, true); const x = rand();
    if (x < 0.45) { L.dropCoins(it.x, it.y + 30, 3 + Math.floor(rand() * 3)); L.toast('南瓜裡掉出了燈芯', 1.4); }
    else if (x < 0.65) { L.pickups.push({ kind: 'oil', x: it.x + 30, y: it.y + 30, t: 0 }); L.toast('南瓜裡有一小瓶燈油', 1.4); }
    else if (x < 0.82) { const m = hwSpawn(2, it, ['ghost', 'bat']); L.toast('南瓜裡跑出了東西！', 1.6); }
    else L.toast('這顆是空的……', 1.2);
    if (it.n >= 5) hwDone(it, '南瓜田收成完了');
    L.hintReset();
  }
}
function hwTick(dt) {
  const room = L.room, p = L.p; if (!room || L.state() !== 'play') return;
  for (const e of L.enemies) if (!e.dead && e.type === 'boss' && e.xk === 'hwwolf' && e.hp < e.maxHp && L.time - (e.hwHit || 0) > 3.2) { e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.015 * dt); if (!e.hwTip) { e.hwTip = true; L.toast('狼人在月光下回血——別停手，持續攻擊！', 2.6); } }
  if (!HW || !HW.live || room.kind !== 'combat') return;
  for (const it of room.items) {
    if (it.kind === 'tfac' && it.fk === 'camp' && it.st === 'ready') { if (Math.hypot(p.x - it.x, p.y - it.y) < 150) it.t += dt; else it.t = Math.max(0, it.t - dt * 2); if (it.t >= 6) { hwDone(it, ''); hwStoryEnd(it.x, it.y); } continue; }
    if (it.kind !== 'tfac' || it.st !== 'busy' || !it.mobs) continue;
    if (it.mobs.every(e => e.dead)) {
      if (it.fk === 'altar') { const u = L.premUpgrade(); L.dropCoins(it.x, it.y + 40, 10); L.sfx('clear'); hwDone(it, '祭壇平息了：精良強化「' + L.UPGN(u) + '」'); }
      else if (it.fk === 'grave') { const w = L.makeItem('weapon', it.x, it.y + 60, 'prop'); room.items.push(w); L.dropCoins(it.x, it.y + 20, 10); L.sfx('clear'); hwDone(it, '骷髏安息了：墓碑下留下一把武器'); }
    }
  }
}
function hwInfo(it) {
  const d = { altar: it.st === 'done' ? '祭壇已經平息' : '按 F 召喚一隻巨大的南瓜怪和 4 隻小怪；全部打倒得精良強化與燈芯', grave: it.st === 'done' ? '骷髏已經安息' : '按 F 喚醒 6 隻骷髏；全部打倒得一把武器與燈芯', camp: it.st === 'done' ? '故事說完了' : '站在營火旁邊（150 像素內）聽 6 秒，離開會倒退。結局：安心（回血＋燈芯）、勇氣（技能冷卻重置＋強化）、被嚇到（出現幾隻幽靈，但有大量燈芯）', patch: it.st === 'done' ? '南瓜田已收成' : '按 F 敲開一顆南瓜（最多 5 顆）：燈芯、燈油，偶爾跑出怪' };
  return { name: HW_NAME[it.fk] + (it.st === 'done' ? '（已結束）' : ''), desc: d[it.fk] || '' };
}
const hwHint = it => (it.st === 'ready' ? (it.fk === 'camp' ? '靠近營火聽故事（' + Math.floor(Math.min(6, it.t)) + ' / 6）' : it.fk === 'altar' ? 'F 召喚' : it.fk === 'grave' ? 'F 喚醒骷髏' : 'F 敲南瓜（' + it.n + ' / 5）') : '');
function hwDraw(it) {
  const c = L.ctx, tm = L.time, done = it.st === 'done'; c.save(); c.translate(it.x, it.y); if (done) c.globalAlpha = 0.5;
  c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(0, 26, 40, 10, 0, 0, TAU); c.fill();
  if (it.fk === 'altar') {
    c.fillStyle = '#2a1830'; c.beginPath(); c.ellipse(0, 12, 50, 18, 0, 0, TAU); c.fill(); c.fillStyle = '#4b2f6a'; rrect(c, -26, -12, 52, 28, 5); c.fillStyle = it.st === 'busy' ? '#ff6a3a' : '#a46bff'; star4(c, 0, -26, 12 + Math.sin(tm * 4) * 2, tm * 2); c.fillStyle = ORG; circ(c, -18, -18, 7); circ(c, 18, -18, 7);
  } else if (it.fk === 'grave') {
    c.fillStyle = '#3a2a22'; c.beginPath(); c.ellipse(0, 16, 42, 14, 0, 0, TAU); c.fill(); c.fillStyle = '#7d7890'; rrect(c, -20, -26, 40, 46, 14); c.strokeStyle = '#4a4560'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -16); c.lineTo(0, 4); c.moveTo(-8, -8); c.lineTo(8, -8); c.stroke();
    if (it.st === 'ready') { c.fillStyle = BONE; rrect(c, 22, 6 + Math.sin(tm * 3) * 2, 5, 14, 2); rrect(c, 28, 8 + Math.sin(tm * 3) * 2, 4, 12, 2); }
  } else if (it.fk === 'camp') {
    c.fillStyle = '#4a3220'; c.fillRect(-18, 10, 36, 6); c.fillRect(-4, -4, 8, 18); const fl = Math.sin(tm * 9) * 2; c.fillStyle = '#ff7a2a'; poly(c, [[-12, 10], [-6, -14 + fl], [0, -4], [6, -20 - fl], [12, 10]]); c.fillStyle = '#ffe27a'; poly(c, [[-5, 10], [0, -6], [5, 10]]);
  } else {
    for (const q of [[-22, 6, 20], [20, 8, 18], [0, -8, 22]]) { c.fillStyle = OL; c.beginPath(); c.ellipse(q[0], q[1], q[2] + 2, q[2] * 0.85 + 2, 0, 0, TAU); c.fill(); c.fillStyle = it.n >= 5 ? '#7a5a40' : ORG; c.beginPath(); c.ellipse(q[0], q[1], q[2], q[2] * 0.85, 0, 0, TAU); c.fill(); c.fillStyle = OL; c.fillRect(q[0] - 2, q[1] - q[2] - 3, 4, 6); }
  }
  c.restore();
}
function hwBack() {
  const room = L.room, c = L.ctx, tm = L.time; if (!room) return;
  if (room.kind === 'boss') {
    const w = L.enemies.find(q => q.type === 'boss' && !q.dead && q.xk === 'hwwolf');
    if (w && w.tl && w.tl.act === 'charge') { const p = L.p; c.save(); c.strokeStyle = 'rgba(255,90,60,' + (0.35 + 0.3 * Math.sin(tm * 16)) + ')'; c.lineWidth = 8; c.setLineDash([14, 10]); c.beginPath(); c.moveTo(w.x, w.y); c.lineTo(p.x, p.y); c.stroke(); c.restore(); }
    return;
  }
  if (!HW || !HW.live || room.kind !== 'combat') return;
  for (const s of HW.slots) if (s.fk === 'market') {
    c.save(); c.translate(s.x, s.y - 52); c.fillStyle = OL; c.fillRect(-250, -6, 500, 8); for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? ORG : '#6a3aa8'; c.beginPath(); c.moveTo(-250 + i * 50, 2); c.lineTo(-200 + i * 50, 2); c.lineTo(-225 + i * 50, 24); c.fill(); }
    c.fillStyle = 'rgba(255,226,150,.8)'; c.font = '700 15px sans-serif'; c.textAlign = 'center'; c.fillText('糖果集市', 0, -14); c.restore();
  }
}

/* ---- Boss：彈幕型（南瓜燈幽靈王）、大群小怪型（骷髏軍團長）、長戰鬥型（狼人） ---- */
const HW_BOSS = {
  hwking: { name: '南瓜燈幽靈王', hp: 285 },
  hwcap: { name: '骷髏軍團長', hp: 255 },
  hwwolf: { name: '狼人', hp: 360 }
};
function hwBossKind(fin) {
  const r = L.run, t = L.th(); r.hwOrd = r.hwOrd || {}; const ord = r.hwOrd[t] = r.hwOrd[t] || L.shuffle(['hwking', 'hwcap', 'hwwolf']);
  const same = r.themes[0] === r.themes[1], idx = same ? r.layer % 3 : (r.layer & 1); return ord[idx];
}
function hwBossDef(fin) { const k = hwBossKind(fin), B = HW_BOSS[k]; return { kind: 'golem', name: B.name, hp: Math.round(B.hp * (fin ? 1.3 : 1)), ext: true, xk: k }; }
function hwHit(e, dmg) {
  if (e.type !== 'boss') return dmg;
  if (e.xk === 'hwwolf') e.hwHit = L.time;
  if (e.bleedNow) return dmg;
  if (e.xk === 'hwcap') { const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'skel' && q.spawn <= 0).length; if (n >= 4) { if (L.time - (e.armTip || -99) > 8) { e.armTip = L.time; L.toast('軍團護體——先清掉骷髏，Boss 才會吃傷害', 2.2); } return dmg * 0.3; } }
  return dmg;
}
function hwMoves(e, phase, ang) {
  const p = L.p, aim = () => Math.atan2(p.y - e.y, p.x - e.x), alive = L.enemies.filter(q => !q.dead && q.type !== 'boss').length;
  const pools = {
    hwking: phase === 1 ? ['pumpkins', 'bats', 'ring'] : phase === 2 ? ['pumpkins', 'bats', 'spiral', 'ring'] : ['pumpkins', 'spiral', 'ring', 'rain', 'bats'],
    hwcap: phase === 1 ? ['call', 'volley'] : phase === 2 ? ['call', 'rally', 'volley'] : ['call', 'rally', 'army', 'volley'],
    hwwolf: phase === 1 ? ['charge', 'claw'] : phase === 2 ? ['charge', 'claw', 'howl'] : ['charge', 'claw', 'howl', 'slam']
  };
  const a = pickOf(pools[e.xk] || pools.hwking);
  if (a === 'pumpkins') { for (let w = 0; w < 3; w++) L.later(w * 0.45, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.22, 175, false, 9); L.sfx('hit'); }); L.toast('南瓜彈！', 1.1); }
  else if (a === 'bats') { if (alive < 8) for (let i = 0; i < 3; i++) { const b = L.spawnEnemy('bat', e.x + (i - 1) * 50, e.y + 60); b.sleep = false; b.noRez = true; } L.toast('蝙蝠出動！', 1.2); }
  else if (a === 'ring') { const n = 14, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 135, false, 8); L.later(0.8, () => { if (e.dead) return; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + (i + 0.5) / n * TAU, 160, false, 8); }); L.toast('鬼火環！', 1.2); }
  else if (a === 'spiral') { const off = rand() * TAU; for (let i = 0; i < 30; i++) L.later(i * 0.09, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, e.x, e.y, off + i * 0.42, 185, false, 7); }); L.toast('旋轉鬼火！', 1.2); }
  else if (a === 'rain') { L.toast('南瓜雨！', 1.2); for (let i = 0; i < 14; i++) L.later(i * 0.16, () => { if (e.dead || L.state() !== 'play') return; const R = L.ROOM; L.bossShot(e, R.x + rand() * R.w, R.y + 10, Math.PI / 2 + (rand() - 0.5) * 0.3, 200, false, 8); }); }
  else if (a === 'call') { const n = phase === 3 ? 5 : 4; if (alive < 11) for (let i = 0; i < n; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy('crawler', sp.x, sp.y); m.sleep = false; m.noRez = true; m.spawn = 0.8; } L.toast('骷髏，列隊！', 1.4); }
  else if (a === 'rally') { L.toast('進軍號角——骷髏衝鋒！', 1.8); for (const q of L.enemies) if (!q.dead && q.type !== 'boss' && !q.rally) { q.rally = true; q.spd *= 1.5; L.later(3.2, () => { q.spd /= 1.5; q.rally = false; }); } }
  else if (a === 'army') { if (alive < 14) for (let i = 0; i < 8; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy('crawler', sp.x, sp.y); m.sleep = false; m.noRez = true; m.spawn = 0.8; } L.toast('全軍出擊！', 1.6); }
  else if (a === 'volley') { for (let w = 0; w < 2; w++) L.later(w * 0.5, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.2, 205, false, 7); }); L.toast('箭雨！', 1.1); }
  else if (a === 'charge') { e.tl = { t: 0.9, act: 'charge', ang: aim() }; L.toast('狼人低吼——衝撞來了，往旁邊閃！', 2); }
  else if (a === 'claw') { L.toast('利爪！', 1.1); for (let k = 0; k < 3; k++) L.later(k * 0.38, () => { if (e.dead || L.state() !== 'play') return; L.markStrike(e, p.x + (k ? rr(-70, 70) : 0), p.y + (k ? rr(-70, 70) : 0), 54, 0.7, {}); }); }
  else if (a === 'howl') { L.toast('嚎叫——蝙蝠被召來了！', 1.8); if (alive < 8) for (let i = 0; i < 2; i++) { const b = L.spawnEnemy('bat', e.x + (i ? 50 : -50), e.y + 50); b.sleep = false; b.noRez = true; } e.spd *= 1.25; L.later(4, () => { e.spd /= 1.25; }); }
  else { L.toast('月下重擊！', 1.4); for (let k = 0; k < 7; k++) { const aa = k / 7 * TAU, d = 130 + (k % 2) * 90; L.markStrike(e, e.x + Math.cos(aa) * d, e.y + Math.sin(aa) * d, 56, 1.1, {}); } }
}
function drawHwBoss(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 2) * 4;
  if (e.xk === 'hwking') {
    c.fillStyle = 'rgba(255,150,40,.16)'; circ(c, 0, b, 105);
    c.fillStyle = fl ? C.paper : '#e9e4f5'; c.beginPath(); c.moveTo(-58, 78 + b); c.lineTo(-58, 0 + b); c.quadraticCurveTo(-60, -50 + b, 0, -56 + b); c.quadraticCurveTo(60, -50 + b, 58, 0 + b); c.lineTo(58, 78 + b); for (let k = 0; k < 5; k++) c.lineTo(58 - (k + 0.5) * 23, 52 + (k % 2) * 14 + b); c.closePath(); c.fill();
    c.fillStyle = OL; c.beginPath(); c.ellipse(0, -14 + b, 52, 46, 0, 0, TAU); c.fill(); c.fillStyle = fl ? C.paper : ORG; c.beginPath(); c.ellipse(0, -14 + b, 48, 42, 0, 0, TAU); c.fill();
    c.fillStyle = '#ffe27a'; poly(c, [[-28, -22 + b], [-8, -22 + b], [-18, -48 + b]]); poly(c, [[28, -22 + b], [8, -22 + b], [18, -48 + b]]); poly(c, [[-30, 0 + b], [-14, 14 + b], [0, 0 + b], [14, 14 + b], [30, 0 + b], [20, 22 + b], [-20, 22 + b]]);
    c.fillStyle = OL; c.fillRect(-4, -62 + b, 8, 12);
    for (let k = 0; k < 3; k++) { const a = t * 1.6 + k * 2.09; c.fillStyle = '#3a2255'; poly(c, [[Math.cos(a) * 92, Math.sin(a) * 40 - 20 + b], [Math.cos(a) * 92 + 12, Math.sin(a) * 40 - 30 + b], [Math.cos(a) * 92 + 24, Math.sin(a) * 40 - 20 + b], [Math.cos(a) * 92 + 12, Math.sin(a) * 40 - 8 + b]]); }
  } else if (e.xk === 'hwcap') {
    const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'skel' && q.spawn <= 0).length;
    if (n >= 4) { c.strokeStyle = 'rgba(160,255,200,' + (0.5 + 0.2 * Math.sin(t * 8)) + ')'; c.lineWidth = 5; c.beginPath(); c.arc(0, b, 88, 0, TAU); c.stroke(); }
    c.fillStyle = OL; rrect(c, -44, -6 + b, 88, 84, 8); c.fillStyle = fl ? C.paper : '#9a8f78'; rrect(c, -40, -2 + b, 80, 76, 6); c.fillStyle = OL; for (let k = 0; k < 4; k++) c.fillRect(-30, 8 + k * 16 + b, 60, 4);
    c.fillStyle = OL; circ(c, 0, -40 + b, 40); c.fillStyle = fl ? C.paper : BONE; circ(c, 0, -40 + b, 36); c.fillStyle = OL; circ(c, -14, -44 + b, 9); circ(c, 14, -44 + b, 9); c.fillRect(-14, -18 + b, 28, 4); c.fillStyle = '#ff6a3a'; circ(c, -14, -44 + b, 4); circ(c, 14, -44 + b, 4);
    c.fillStyle = '#d9a82a'; poly(c, [[-30, -66 + b], [-20, -88 + b], [-8, -70 + b], [0, -92 + b], [8, -70 + b], [20, -88 + b], [30, -66 + b]]);
    c.strokeStyle = '#8a8a99'; c.lineWidth = 6; c.beginPath(); c.moveTo(64, 70 + b); c.lineTo(64, -30 + b); c.stroke(); c.fillStyle = '#c9c9d6'; poly(c, [[64, -52 + b], [56, -30 + b], [72, -30 + b]]);
  } else {
    const rage = e.hp < e.maxHp * 0.5; c.fillStyle = rage ? 'rgba(255,60,60,.16)' : 'rgba(180,190,230,.14)'; circ(c, 0, b, 105);
    c.fillStyle = fl ? C.paper : '#4a4450'; c.beginPath(); c.ellipse(0, 34 + b, 60, 58, 0, 0, TAU); c.fill(); for (const s of [-1, 1]) { c.fillRect(s * 38 - 10, 80 + b, 20, 22); poly(c, [[s * 56, 20 + b], [s * 82, 56 + b], [s * 64, 62 + b]]); }
    c.fillStyle = fl ? C.paper : '#5a5462'; circ(c, 0, -26 + b, 38); poly(c, [[-30, -50 + b], [-44, -84 + b], [-12, -58 + b]]); poly(c, [[30, -50 + b], [44, -84 + b], [12, -58 + b]]);
    c.fillStyle = '#7a7280'; c.beginPath(); c.ellipse(0, -10 + b, 22, 16, 0, 0, TAU); c.fill(); c.fillStyle = OL; circ(c, 0, -14 + b, 5);
    c.fillStyle = BONE; poly(c, [[-12, -2 + b], [-6, 10 + b], [0, -2 + b]]); poly(c, [[12, -2 + b], [6, 10 + b], [0, -2 + b]]);
    c.fillStyle = rage ? '#ff3a3a' : '#ffd24a'; circ(c, -16, -34 + b, 6); circ(c, 16, -34 + b, 6);
  }
}

/* ---- 事件房：不給糖就搗蛋、幽靈商人、鬼故事 ---- */
function xProp(it, col, glyph, used) {
  const c = L.ctx; c.save(); c.translate(it.x, it.y + Math.sin(L.time * 2 + it.x) * 2);
  c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(0, 26, 30, 8, 0, 0, TAU); c.fill(); if (used) c.globalAlpha = 0.45;
  c.fillStyle = col; L.rrect(c, -24, -26, 48, 52, 8); c.fill(); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; L.rrect(c, -24, -26, 48, 52, 8); c.stroke();
  c.fillStyle = '#fff'; c.font = '700 26px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(glyph, 0, 0); c.restore();
}
function xAdd(room, cx, cy, id, extra) { room.items.push(Object.assign({ kind: 'xev', id, x: cx, y: cy, group: 'prop', price: 0, taken: false, used: false }, extra || {})); }
const HW_EVENTS = {
  treat: {
    toast: '不給糖就搗蛋：敲門試試運氣', setup: (room, cx, cy) => xAdd(room, cx, cy, 'treat'),
    info: it => ({ name: '不給糖就搗蛋', desc: it.used ? '門已經關上了' : '敲一次門：45% 給糖（強化＋燈芯）、30% 搗蛋（出現幾隻小怪，打倒有燈芯）、25% 只給一點燈芯；只能一次' }),
    hint: it => it.used ? '' : 'F 敲門',
    use(it) {
      if (it.used) return; it.used = true; const r = L.rand(); L.sfx('pick');
      if (r < 0.45) { const u = L.rewardUpgrade(); L.p.coins += 6; L.toast('給糖！強化「' + L.UPGN(u) + '」、燈芯 +6', 2.8); }
      else if (r < 0.75) { for (let i = 0; i < 4; i++) { const sp = L.freeSpot(14), e = L.spawnEnemy(pickOf(['crawler', 'crawler', 'ghost']), sp.x, sp.y); e.sleep = false; e.noRez = true; } L.dropCoins(it.x, it.y + 40, 8); L.toast('搗蛋！小怪撲出來了（先收下 8 燈芯）', 3); }
      else { L.p.coins += 4; L.toast('門縫裡塞出幾顆糖：燈芯 +4', 2); }
    },
    draw: it => xProp(it, '#c4620f', '糖', it.used)
  },
  merch: {
    toast: '幽靈商人：用燈芯換一把武器', setup: (room, cx, cy) => xAdd(room, cx, cy, 'merch'),
    info: it => ({ name: '幽靈商人', desc: it.used ? '他已經飄走了' : '花 8 燈芯，從他的斗篷下拿到一把隨機武器（你身上沒有的）；只能一次' }),
    hint: it => it.used ? '' : 'F 購買（8 燈芯）',
    use(it) {
      if (it.used) return; if (L.p.coins < 8) { L.toast('燈芯不夠'); L.sfx('tick'); return; } const w = L.offerWeapon(); if (!w) { L.toast('他沒有你需要的東西'); return; }
      L.p.coins -= 8; it.used = true; L.giveWeapon(w); L.sfx('buy'); L.toast('得到武器：' + (L.WDEF[w] ? L.WDEF[w].name : w), 2.6);
    },
    draw: it => xProp(it, '#6a3aa8', '商', it.used)
  },
  story: {
    toast: '鬼故事：站在營火旁聽完 6 秒', setup: (room, cx, cy) => xAdd(room, cx, cy, 'story', { t: 0 }),
    info: it => ({ name: '鬼故事營火', desc: it.used ? '故事說完了' : '站在營火旁邊（150 像素內）聽 6 秒；離開會重新計時。結局：安心（回血＋燈芯）、勇氣（技能冷卻重置）、或被嚇到（出現幾隻小怪，但有大量燈芯）' }),
    hint: it => it.used ? '' : '靠近營火聽故事（' + Math.floor(it.t) + ' / 6）',
    use() { },
    tick(dt, room) {
      const it = room.items.find(q => q.kind === 'xev' && q.id === 'story'); if (!it || it.used) return; const p = L.p;
      if (Math.hypot(p.x - it.x, p.y - it.y) < 150) it.t += dt; else it.t = Math.max(0, it.t - dt * 2);
      if (it.t >= 6) {
        it.used = true; const r = L.rand(); L.sfx('clear');
        if (r < 0.4) { L.healP(1); L.p.coins += 8; L.toast('故事很溫暖：燈火 +1、燈芯 +8', 2.8); }
        else if (r < 0.75) { L.p.skillCd = 0; const u = L.rewardUpgrade(); L.toast('聽完有了勇氣：技能冷卻重置、強化「' + L.UPGN(u) + '」', 3); }
        else { for (let i = 0; i < 3; i++) { const sp = L.freeSpot(14), e = L.spawnEnemy('ghost', sp.x, sp.y); e.sleep = false; e.noRez = true; } L.dropCoins(it.x, it.y + 40, 14); L.toast('被嚇到了！鬼跳出來（先收下 14 燈芯）', 3); }
        L.hintReset();
      }
    },
    draw: it => { const c = L.ctx; c.save(); c.translate(it.x, it.y); if (it.used) c.globalAlpha = 0.5; c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(0, 20, 34, 9, 0, 0, TAU); c.fill(); c.fillStyle = '#4a3220'; c.fillRect(-18, 10, 36, 6); c.fillRect(-4, -4, 8, 18); const fl = Math.sin(L.time * 9) * 2; c.fillStyle = '#ff7a2a'; poly(c, [[-12, 10], [-6, -14 + fl], [0, -4], [6, -20 - fl], [12, 10]]); c.fillStyle = '#ffe27a'; poly(c, [[-5, 10], [0, -6], [5, 10]]); c.restore(); }
  }
};

L.registerWorld({
  theme: 19, name: '萬聖節', pool: 'dlc', opt: '萬聖節（DLC5）', pal: PAL19, bigMap: true, ownStory: true, dark: 'rgba(12,5,24,0.9)',
  amb: ['lowpass', 520, 0.8, 0.007], ev: r => { const n = [196, 233, 277, 330][Math.floor(r() * 4)]; L.blip(n, n * 0.7, 0.9, 'sine', 0.01); },
  skin: { map: HW_SKIN, draw: drawHwEnemy, hue: false }, bg: hwBg, obsDraw: hwObsDraw, obs: hwObs, roomInit: hwInit, tick: hwTick, back: hwBack,
  drawItem: hwDraw, info: hwInfo, hint: hwHint, useItem: hwUse, shards: HW_SHARDS, hitMod: hwHit,
  lights: h => {
    const room = L.room; if (!room) return; const fl = 0.92 + 0.06 * Math.sin(L.time * 7);
    for (const o of room.obs) if (o.jk === 'lamp') h(o.x + o.w / 2, o.y + o.h / 2 - 6, 125 * fl, 0.88);
    for (const it of room.items) if (it.kind === 'tfac' && it.fk === 'camp') h(it.x, it.y, 150 * fl, 0.9);
    for (const e of L.enemies) if (!e.dead && e.type === 'boss') h(e.x, e.y, 170, 0.75);
  },
  arrows: edge => { const room = L.room; if (!room || room.kind !== 'combat' || !HW || !HW.live) return; for (const it of room.items) if (it.kind === 'tfac' && it.st === 'ready' && !it.taken) edge(it.x, it.y, '#ffb347', false); for (const s of HW.slots) if (s.fk === 'market') edge(s.x, s.y, '#c79bff', false); },
  mini: (mx, my, sc) => {
    const room = L.room, c = L.ctx, R = L.ROOM; if (!room || room.kind !== 'combat' || !HW || !HW.live) return; c.save(); c.textAlign = 'center'; c.font = '700 9px sans-serif';
    for (const s of HW.slots) { const x = mx + (s.x - R.x) * sc, y = my + (s.y - R.y) * sc; if (s.fk === 'market') { c.fillStyle = '#c79bff'; c.fillText('市', x, y + 3); } }
    for (const it of room.items) if (it.kind === 'tfac') { const x = mx + (it.x - R.x) * sc, y = my + (it.y - R.y) * sc; c.fillStyle = it.st === 'done' ? 'rgba(180,180,180,.6)' : '#ffb347'; c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x + 3.5, y); c.lineTo(x, y + 4); c.lineTo(x - 3.5, y); c.fill(); }
    c.restore();
  },
  enemies: { bat: { hp: 4, r: 11, name: '蝙蝠', cost: 2, cap: 4, ai: batAi } },
  types: (types, L0, ci) => { types.length = 0; types.push('crawler', 'crawler', 'shooter', 'bat'); if (L0 > 0) types.push('ghost', 'brute', 'crawler'); if (L0 >= 2) types.push('bat', 'ghost', 'brute', 'shooter'); if (L0 >= 3) types.push('brute', 'brute', 'ghost', 'shooter'); },
  extra: () => [],
  boss: fin => hwBossDef(fin), boss2: hwMoves, drawBoss: drawHwBoss,
  intro: def => (def.xk === 'hwking'
    ? [{ who: '旁白', text: '鬼屋的大門無聲地打開。巨大的南瓜頭在黑暗裡亮起，裹著床單的影子飄了過來。' }, { who: '南瓜燈幽靈王', text: '你終於來了！我準備了一整年的鬼火，快——接好它們！' }]
    : def.xk === 'hwcap'
      ? [{ who: '旁白', text: '墓地的地面隆起，一排排骷髏從土裡站起，整齊地轉向你。' }, { who: '骷髏軍團長', text: '全軍聽令——今晚，沒有人可以過這座橋！' }, { who: '旁白', text: '只要骷髏還站著，軍團長就不怕任何攻擊。' }]
      : [{ who: '旁白', text: '雲被風推開，滿月露了出來。山丘上，有什麼東西慢慢站起身。' }, { who: '狼人', text: '月亮……真亮。你的燈，也很亮。可惜，我今晚不想被照著。' }, { who: '旁白', text: '牠在月光下會回血——不要給牠喘息的機會。' }]),
  onKill: e => {
    const r = L.run; swarmBleed(e, 'hwcap', 'skel');
    if (e.skin === 'skel' && !e.rez && !e.noRez && L.rand() < 0.5) { const m = L.spawnEnemy('crawler', e.x, e.y); m.rez = true; m.noRez = true; m.sleep = false; m.spawn = 1.3; m.hp = m.maxHp = Math.max(2, Math.round(m.maxHp * 0.5)); L.burst(e.x, e.y, 10, [BONE, '#9a8f78'], 130, true); if (!r.hwRezTip) { r.hwRezTip = true; L.toast('骷髏會重組一次——再補一刀', 2.2); } }
    else if (e.skin === 'pumpk' && !e.hwElite) { for (let i = 0; i < 2; i++) { const m = L.spawnEnemy('crawler', e.x + (i ? 18 : -18), e.y); m.skin = 'kid'; m.r = Math.round(m.r * 0.8); m.hp = m.maxHp = 2; m.noRez = true; m.sleep = false; } L.burst(e.x, e.y, 12, [ORG, '#ffe27a'], 150, true); }
  },
  events: HW_EVENTS,
  weapons: {
    jackstaff: { id: 'jackstaff', name: '南瓜燈杖', tag: '單發', mode: 'tap', cd: 0.38, th: 19, col: '#f08a1c', desc: '單發的南瓜火球，傷害高（萬聖節專屬，類似燈焰杖）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 560, 8, 3.9 * dm, 'flame', 1.0); L.sfx('flame'); } },
    batbow: { id: 'batbow', name: '蝙蝠弓', tag: '連射', mode: 'auto', cd: 0.11, th: 19, col: '#7a46b8', desc: '按住連射小蝙蝠，射速快（萬聖節專屬，類似螢火弓）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang + (rand() - 0.5) * 0.07, 720, 4, 1.15 * dm, 'pellet', 0.8); L.sfx('tick'); } },
    scythe: { id: 'scythe', name: '死神鐮刀', tag: '近戰', mode: 'tap', cd: 0.45, th: 19, col: '#c9c9d6', range: 135, half: 1.3, dmg: 3.7, kb: 380, desc: '大範圍的弧形揮砍（萬聖節專屬，類似提燈刃）' },
    ghostgun: { id: 'ghostgun', name: '幽靈霰彈', tag: '散射', mode: 'tap', cd: 0.62, th: 19, col: '#e9e4f5', desc: '五發幽靈散射，近距離很痛（萬聖節專屬，類似霰光杖）',
      fire: (ox, oy, ang, dm) => { for (let i = -2; i <= 2; i++) L.shoot(ox, oy, ang + i * 0.16, 520, 6, 1.9 * dm, 'pellet', 0.55); L.sfx('blade'); } },
    bonespear: { id: 'bonespear', name: '骨矛', tag: '貫穿', mode: 'tap', cd: 0.75, th: 19, col: '#ece6d4', desc: '貫穿一整排敵人的骨頭長矛（萬聖節專屬，類似穿光矛）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 700, 8, 4.6 * dm, 'lance', 0.95, true); L.sfx('blade'); } }
  },
  ach: [
    { id: 'hwKing', name: '鬼火燒盡', desc: '萬聖節：擊敗南瓜燈幽靈王' },
    { id: 'hwCap', name: '解散軍團', desc: '萬聖節：擊敗骷髏軍團長' },
    { id: 'hwWolf', name: '月下不留情', desc: '萬聖節：擊敗狼人' },
    { id: 'hwFac', name: '膽大心細', desc: '萬聖節：同一局完成召喚祭壇與墓園夜襲' }
  ],
  onMid: () => { if (L.th() !== 19) return; hwBossAch(); L.later(1.2, () => L.say([{ who: '南瓜燈', text: '天快亮了。下一個節日的鈴聲，已經在路的盡頭響起。' }])); },
  onFinal: () => { if (L.th() === 19) hwBossAch(); },
  outro: () => [{ who: '南瓜燈', text: '今年的萬聖節，是第一次，有人陪我們到天亮。' }, { who: '旁白', text: '所有的南瓜燈同時暗了下去，天邊露出一點魚肚白。你的燈，還亮著。' }]
});
function hwBossAch() { try { const k = L.bossDef().xk; if (k === 'hwking') L.unlockAch('hwKing'); else if (k === 'hwcap') L.unlockAch('hwCap'); else if (k === 'hwwolf') L.unlockAch('hwWolf'); } catch (e) { /* optional */ } }

/* ================= 耶誕節（20）：全亮、超大地圖、三隻 Boss（彈幕／大群／長戰） ================= */

/* 大群 Boss：小怪被打倒時，Boss 有 50% 機率受到 1 點傷害 */
function swarmBleed(m, xk, skin) {
  if (m.skin !== skin || m.bleedDone) return; m.bleedDone = true;
  const b = L.enemies.find(q => !q.dead && q.type === 'boss' && q.xk === xk); if (!b || L.rand() >= 0.5) return;
  b.bleedNow = true; L.hitEnemy(b, 1, 0, 0, 0, false); b.bleedNow = false; L.burst(b.x, b.y, 5, ['#ffffff'], 90, true);
}
const PAL20 = { ink: '#14301f', floor: '#e4eef6', floor2: '#d6e4f0', wall1: '#1f6b3f', wall2: '#2f9a58', top: '#fff7e0', door: '#d63a3a' };
const XM_SKIN = { crawler: 'ginger', shooter: 'elf', brute: 'nutcracker', bomber: 'orn', reindeer: 'reindeer', snowman: 'snowman' };
const XM_STORY = [
  [{ who: '旁白', text: '雪從傍晚下到現在，整座山谷安靜得像被棉被蓋住。遠處，聖誕樹上的燈一串一串地亮了。' }, { who: '精靈', text: '提燈的旅人！北極工坊的玩具全跑出來了——幫我們收拾一下好嗎？' }],
  [{ who: '旁白', text: '第二個雪夜，鈴聲變得有點走調。煙囪冒著煙，卻沒有人在家。' }, { who: '精靈', text: '最大的那一位在雪橇旁邊等你。他沒有生氣，只是……今年沒有人拆他的禮物。' }]
];
const XM_SHARDS = ['聖誕卡片：親愛的老人，我今年不要玩具，只想要有人陪我拆禮物。', '聖誕卡片：薑餅人說，他不怕烤箱，只怕被咬掉頭的那一瞬間。', '聖誕卡片：胡桃鉗的嘴巴會張開，不是要咬人，是想說一句話。', '聖誕卡片：最亮的那顆星星，其實是別人替你留的燈。'];
const XM_ZONE = ['雪原', '冷杉林', '玩具工坊', '結冰湖', '聖誕市集', '雪橇停靠站'];
const GRN = '#1f7a44', RED = '#d63a3a', SNOW = '#f4f8fc';
let XM = null;
function drawXmEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, tm = e.t, fa = Math.atan2(L.p.y - e.y, L.p.x - e.x), ol = '#2a1810';
  if (sk === 'ginger') {
    const sw = Math.sin(tm * 8) * 2; c.fillStyle = ol; circ(c, 0, -r * 0.75, r * 0.78); rrect(c, -r * 0.95, -r * 0.2, r * 1.9, r * 1.0, 4); rrect(c, -r * 0.65, r * 0.6, r * 0.5, r * 0.7 + sw, 3); rrect(c, r * 0.15, r * 0.6, r * 0.5, r * 0.7 - sw, 3);
    c.fillStyle = f ? C.paper : '#b9702e'; circ(c, 0, -r * 0.75, r * 0.7); rrect(c, -r * 0.88, -r * 0.13, r * 1.76, r * 0.86, 3); rrect(c, -r * 0.58, r * 0.65, r * 0.38, r * 0.6 + sw, 2); rrect(c, r * 0.2, r * 0.65, r * 0.38, r * 0.6 - sw, 2);
    c.fillStyle = '#fff'; circ(c, -r * 0.22, -r * 0.8, r * 0.1); circ(c, r * 0.22, -r * 0.8, r * 0.1); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(0, -r * 0.62, r * 0.28, 0.2, Math.PI - 0.2); c.stroke(); c.fillStyle = RED; circ(c, 0, r * 0.1, r * 0.1); circ(c, 0, r * 0.38, r * 0.1);
  } else if (sk === 'elf') {
    c.fillStyle = ol; poly(c, [[-r * 1.0, r], [0, -r * 0.2], [r * 1.0, r]]); c.fillStyle = f ? C.paper : GRN; poly(c, [[-r * 0.88, r * 0.92], [0, -r * 0.1], [r * 0.88, r * 0.92]]);
    c.fillStyle = f ? C.paper : '#f2c9a0'; circ(c, 0, -r * 0.45, r * 0.55); poly(c, [[-r * 0.5, -r * 0.5], [-r * 1.05, -r * 0.8], [-r * 0.45, -r * 0.2]]); poly(c, [[r * 0.5, -r * 0.5], [r * 1.05, -r * 0.8], [r * 0.45, -r * 0.2]]);
    c.fillStyle = RED; poly(c, [[-r * 0.6, -r * 0.75], [r * 0.2, -r * 1.75], [r * 0.6, -r * 0.75]]); c.fillStyle = '#fff'; c.fillRect(-r * 0.62, -r * 0.82, r * 1.24, 4); circ(c, r * 0.2, -r * 1.75, 3.5); c.fillStyle = ol; circ(c, -r * 0.18, -r * 0.45, 2); circ(c, r * 0.18, -r * 0.45, 2);
    const g = 0.6 + 0.4 * Math.sin(tm * 6); c.fillStyle = 'rgba(255,220,90,' + g + ')'; star4(c, Math.cos(fa) * r * 1.3, Math.sin(fa) * r * 1.3, r * 0.35, tm * 2);
  } else if (sk === 'nutcracker') {
    c.fillStyle = ol; rrect(c, -r * 0.85, -r * 0.3, r * 1.7, r * 1.5, 5); c.fillStyle = f ? C.paper : RED; rrect(c, -r * 0.75, -r * 0.2, r * 1.5, r * 1.3, 4); c.fillStyle = '#ffd24a'; c.fillRect(-r * 0.6, r * 0.1, r * 1.2, 3); c.fillRect(-r * 0.6, r * 0.45, r * 1.2, 3);
    c.fillStyle = ol; rrect(c, -r * 0.5, -r * 1.35, r * 1.0, r * 1.1, 4); c.fillStyle = f ? C.paper : '#f2c9a0'; rrect(c, -r * 0.42, -r * 1.2, r * 0.84, r * 0.9, 3); c.fillStyle = '#1a1a2a'; rrect(c, -r * 0.55, -r * 1.75, r * 1.1, r * 0.6, 3); c.fillStyle = '#ffd24a'; c.fillRect(-r * 0.55, -r * 1.3, r * 1.1, 3);
    c.fillStyle = '#fff'; c.fillRect(-r * 0.4, -r * 0.45, r * 0.8, r * 0.18); c.fillStyle = ol; circ(c, -r * 0.18, -r * 0.85, 2.5); circ(c, r * 0.18, -r * 0.85, 2.5);
  } else if (sk === 'orn') {
    c.fillStyle = ol; circ(c, 0, 2, r * 1.1); c.fillStyle = f ? C.paper : RED; circ(c, 0, 2, r); c.fillStyle = 'rgba(255,255,255,.55)'; circ(c, -r * 0.35, -r * 0.2, r * 0.25); c.fillStyle = '#ffd24a'; rrect(c, -r * 0.3, -r * 1.2, r * 0.6, r * 0.35, 2); c.strokeStyle = '#ffd24a'; c.lineWidth = 2; c.beginPath(); c.arc(0, -r * 1.35, r * 0.2, 0, TAU); c.stroke();
  } else if (sk === 'snowman') {
    c.fillStyle = ol; circ(c, 0, r * 0.45, r * 1.08); circ(c, 0, -r * 0.65, r * 0.78); c.fillStyle = f ? C.paper : SNOW; circ(c, 0, r * 0.45, r); circ(c, 0, -r * 0.65, r * 0.7);
    c.fillStyle = '#1a1a2a'; rrect(c, -r * 0.55, -r * 1.55, r * 1.1, r * 0.35, 2); rrect(c, -r * 0.35, -r * 1.95, r * 0.7, r * 0.5, 2); c.fillStyle = '#ff8a2a'; poly(c, [[0, -r * 0.7], [r * 0.9, -r * 0.55], [0, -r * 0.45]]);
    c.fillStyle = ol; circ(c, -r * 0.25, -r * 0.85, 2.5); circ(c, r * 0.25, -r * 0.85, 2.5); circ(c, 0, r * 0.2, 3); circ(c, 0, r * 0.6, 3);
    if (e.tele > 0) { c.fillStyle = 'rgba(255,90,60,.55)'; circ(c, Math.cos(fa) * r * 1.4, Math.sin(fa) * r * 1.4, r * 0.4); }
  } else { // reindeer
    const hot = e.state === 'wind' || e.state === 'dash', a = e.ra || fa; if (e.tele > 0) { c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#ff6a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 260, Math.sin(a) * 260); c.stroke(); c.restore(); }
    c.fillStyle = ol; c.beginPath(); c.ellipse(0, 2, r * 1.2, r * 0.9, 0, 0, TAU); c.fill(); c.fillStyle = f ? C.paper : '#8a5a34'; c.beginPath(); c.ellipse(0, 2, r * 1.1, r * 0.8, 0, 0, TAU); c.fill();
    c.strokeStyle = '#5a3a20'; c.lineWidth = 3; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * r * 0.4, -r * 0.6); c.lineTo(s * r * 0.9, -r * 1.3); c.lineTo(s * r * 0.5, -r * 1.2); c.moveTo(s * r * 0.9, -r * 1.3); c.lineTo(s * r * 1.3, -r * 1.1); c.stroke(); }
    c.fillStyle = ol; circ(c, -r * 0.3, -r * 0.1, 2.5); circ(c, r * 0.3, -r * 0.1, 2.5); c.fillStyle = hot ? '#ff3a3a' : '#ff6a6a'; circ(c, 0, r * 0.3, r * 0.22);
  }
}
function reindeerAi(e, dt, nx, ny, d) {
  e.st = (e.st === undefined ? rr(1, 2) : e.st) - dt; if (!e.state || e.state === 'spawn') e.state = 'walk';
  let mx = 0, my = 0, touch = 1;
  if (e.state === 'walk') { mx = nx * 46 * e.spd; my = ny * 46 * e.spd; if (e.st <= 0) { e.state = 'wind'; e.st = 0.75; e.ra = Math.atan2(L.p.y - e.y, L.p.x - e.x); } }
  else if (e.state === 'wind') { e.tele = e.st; e.ra = Math.atan2(L.p.y - e.y, L.p.x - e.x); if (e.st <= 0) { e.state = 'dash'; e.st = 0.8; e.tele = 0; } }
  else if (e.state === 'dash') { mx = Math.cos(e.ra) * 440 * e.spd; my = Math.sin(e.ra) * 440 * e.spd; touch = 2; if (e.st <= 0) { e.state = 'rest'; e.st = 1.1; L.burst(e.x, e.y, 8, [SNOW, '#bcd8ee'], 140, true); } }
  else if (e.st <= 0) { e.state = 'walk'; e.st = rr(1.6, 2.6); }
  return { mx, my, touch };
}
function snowmanAi(e, dt, nx, ny, d) {
  e.cd = (e.cd === undefined ? rr(1.4, 2.4) : e.cd) - dt;
  if (e.tele > 0) { e.tele -= dt; if (e.tele <= 0) { const a = Math.atan2(L.p.y - e.y, L.p.x - e.x); for (let i = -1; i <= 1; i++) L.enemyShot(e, a + i * 0.28, 190); e.cd = rr(2.4, 3.2) * e.fire; } return { mx: 0, my: 0, touch: 1 }; }
  if (e.cd <= 0 && d < 520) e.tele = 0.5;
  return { mx: nx * 30 * e.spd, my: ny * 30 * e.spd, touch: 1 };
}
function xmMake(R) {
  const zw = R.w / 3, zh = R.h / 2, zc = z => ({ x: R.x + (z % 3 + 0.5) * zw, y: R.y + (Math.floor(z / 3) + 0.5) * zh });
  const zs = L.shuffle([0, 2, 3]), a = zc(zs[0]), b = zc(zs[1]), cc = zc(zs[2]), mid = zc(4), top = zc(1);
  XM = { R: { x: R.x, y: R.y, w: R.w, h: R.h }, live: false, slots: [{ fk: 'market', x: R.x + R.w - 340, y: R.y + 170 }, { fk: 'tree', x: mid.x, y: mid.y + 20 }, { fk: 'workshop', x: a.x + rr(-90, 90), y: a.y + rr(-60, 60) }, { fk: 'chimney', x: b.x + rr(-90, 90), y: b.y + rr(-60, 60) }, { fk: 'hearth', x: top.x + rr(-120, 120), y: top.y + rr(-60, 60) }] };
  return XM;
}
function xmObs(kind, R, D) {
  if (kind === 'boss') {
    return [[R.x + 110, R.y + 80], [R.x + R.w - 150, R.y + 80], [R.x + 110, R.y + R.h - 130], [R.x + R.w - 150, R.y + R.h - 130]].map(q => ({ x: q[0], y: q[1], w: 40, h: 56, jk: 'fir' }))
      .concat([{ x: R.x + R.w * 0.38, y: R.y + R.h / 2 - 150, w: 38, h: 38, jk: 'gift' }, { x: R.x + R.w * 0.38, y: R.y + R.h / 2 + 110, w: 38, h: 38, jk: 'gift' }, { x: R.x + R.w * 0.62, y: R.y + R.h / 2 - 40, w: 38, h: 38, jk: 'gift' }]);
  }
  xmMake(R); const sl = XM.slots;
  const keep = sl.map(s => s.fk === 'market' ? { x: s.x - 230, y: s.y - 100, w: 520, h: 220 } : s.fk === 'tree' ? { x: s.x - 200, y: s.y - 160, w: 400, h: 320 } : { x: s.x - 150, y: s.y - 140, w: 300, h: 280 });
  keep.push({ x: R.x, y: D.y - 100, w: 170, h: 200 }, { x: R.x + R.w - 170, y: D.y - 100, w: 170, h: 200 });
  const obs = [], total = 38, ks = ['fir', 'fir', 'fir', 'gift', 'gift', 'ice'];
  for (let t = 0; t < 1200 && obs.length < total; t++) {
    const jk = pickOf(ks), w = jk === 'fir' ? rr(38, 50) : jk === 'ice' ? rr(36, 50) : 38, h = jk === 'fir' ? rr(54, 70) : jk === 'ice' ? rr(36, 48) : 38;
    const o = { x: rr(R.x + 90, R.x + R.w - 90 - w), y: rr(R.y + 50, R.y + R.h - 50 - h), w, h, jk };
    if (keep.some(k => L.overlap(k, o)) || obs.some(q => L.overlap(L.inflate(q, 80), o))) continue;
    obs.push(o);
  }
  return obs;
}
function xmObsDraw(g, o) {
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
  if (o.jk === 'fir') {
    g.fillStyle = '#4a3220'; g.fillRect(cx - 4, o.y + o.h - 12, 8, 12);
    for (let k = 0; k < 3; k++) { const y = o.y + k * o.h * 0.26, w = o.w * (0.55 + k * 0.22); g.fillStyle = '#0f4a2a'; poly(g, [[cx - w / 2 - 2, y + o.h * 0.42], [cx, y - 2], [cx + w / 2 + 2, y + o.h * 0.42]]); g.fillStyle = '#1f7a44'; poly(g, [[cx - w / 2 + 2, y + o.h * 0.4], [cx, y + 3], [cx + w / 2 - 2, y + o.h * 0.4]]); }
    g.fillStyle = SNOW; poly(g, [[cx - 6, o.y + o.h * 0.14], [cx, o.y + 2], [cx + 6, o.y + o.h * 0.14]]);
  } else if (o.jk === 'gift') {
    g.fillStyle = '#1a3a28'; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 5); g.fillStyle = RED; rrect(g, o.x, o.y, o.w, o.h, 4); g.fillStyle = '#ffe27a'; g.fillRect(cx - 4, o.y, 8, o.h); g.fillRect(o.x, cy - 4, o.w, 8); g.beginPath(); g.ellipse(cx - 7, o.y - 3, 7, 4, -0.5, 0, TAU); g.ellipse(cx + 7, o.y - 3, 7, 4, 0.5, 0, TAU); g.fill();
  } else {
    g.fillStyle = '#5a86a8'; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 8); g.fillStyle = '#bfe3f5'; rrect(g, o.x, o.y, o.w, o.h, 7); g.fillStyle = 'rgba(255,255,255,.7)'; poly(g, [[o.x + 5, o.y + o.h - 6], [o.x + o.w * 0.4, o.y + 5], [o.x + o.w * 0.55, o.y + o.h - 6]]);
  }
}
function xmBg(g, rm, rng, arR) {
  const R = L.ROOM;
  for (let i = 0; i < Math.round(110 * arR); i++) { g.fillStyle = 'rgba(255,255,255,' + (0.5 + rng() * 0.5) + ')'; const sz = 1.5 + rng() * 3; g.fillRect(R.x + rng() * R.w, R.y + rng() * R.h, sz, sz); }
  for (let k = 0; k < Math.round(8 * arR); k++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h, gr = g.createRadialGradient(x, y, 0, x, y, 200); gr.addColorStop(0, 'rgba(180,215,245,.35)'); gr.addColorStop(1, 'rgba(180,215,245,0)'); g.fillStyle = gr; g.fillRect(x - 200, y - 200, 400, 400); }
  if (rm.kind === 'combat' && R.w > 2000) { g.font = '700 34px sans-serif'; g.textAlign = 'center'; g.fillStyle = 'rgba(60,100,130,.14)'; for (let z = 0; z < 6; z++) g.fillText(XM_ZONE[z], R.x + (z % 3 + 0.5) * R.w / 3, R.y + (Math.floor(z / 3) + 0.5) * R.h / 2 - 110); }
}
function xmInit(room, kind) {
  const r = L.run; if (L.th() !== 20) return;
  if (kind !== 'combat') { XM = kind === 'boss' ? XM : null; if (XM) XM.live = false; }
  { const sd = r.xmSaid = r.xmSaid || {}; if (kind !== 'start' && !sd[r.layer]) { sd[r.layer] = 1; const T0 = XM_STORY[r.layer & 1]; L.later(2.0, () => { if (L.room === room && L.state() === 'play') L.say(T0); }); } }
  if (kind !== 'combat' || !XM) return;
  XM.live = true; room.refreshN = 0;
  for (const s of XM.slots) {
    if (s.fk === 'market') {
      room.items.push(L.makeItem('heal', s.x - 130, s.y, 'shop'), L.makeItem('upgrade', s.x, s.y, 'shop'), L.makeItem(rand() < 0.65 ? 'weapon' : 'upgrade', s.x + 130, s.y, 'shop'));
      room.items.push({ kind: 'refresh', id: 'refresh', slot: 'refresh', x: s.x + 250, y: s.y, price: 3, group: 'stall', taken: false });
    } else room.items.push({ kind: 'tfac', id: 'tfac', fk: s.fk, x: s.x, y: s.y, group: 'prop', price: 0, taken: false, st: 'ready', t: 0, n: 0 });
  }
}
const XM_NAME = { tree: '許願聖誕樹', workshop: '精靈工坊', chimney: '煙囪送禮', hearth: '壁爐' };
function xmDone(it, msg) { it.st = 'done'; const r = L.run; r.xmFac = r.xmFac || {}; r.xmFac[it.fk] = 1; if (r.xmFac.tree && r.xmFac.workshop) L.unlockAch('xmFac'); if (msg) L.toast(msg, 3); L.hintReset(); }
function xmUse(it) {
  const p = L.p, room = L.room;
  if (it.st === 'done') { L.toast('這裡已經結束了', 1.4); return; }
  if (it.st === 'busy') { L.toast('進行中……', 1.2); return; }
  if (it.fk === 'hearth') { L.toast('站在壁爐旁邊暖身 6 秒就好', 1.6); return; }
  if (it.fk === 'tree') {
    if (p.coins < 4) { L.toast('燈芯不夠（每個裝飾 4 燈芯）', 1.6); L.sfx('tick'); return; } p.coins -= 4; it.n++; L.sfx('buy'); L.burst(it.x, it.y - 30, 14, ['#ffd24a', RED, '#7df9ff'], 150, true); const x = rand();
    if (it.n >= 3) { L.healP(1); const u = L.premUpgrade(); xmDone(it, '聖誕樹亮起來了：燈火 +1、精良強化「' + L.UPGN(u) + '」'); return; }
    if (x < 0.4) { p.coins += 8; L.toast('樹上掛的裝飾掉出了燈芯 +8', 2); } else if (x < 0.75) { L.pickups.push({ kind: 'oil', x: it.x + 30, y: it.y + 40, t: 0 }); L.toast('樹下出現了一小瓶燈油', 2); } else { const u = L.rewardUpgrade(); L.toast('裝飾發光了：強化「' + L.UPGN(u) + '」', 2.6); }
    L.hintReset();
  } else if (it.fk === 'workshop') {
    const big = L.spawnEnemy('brute', it.x, it.y - 100); big.sleep = false; big.noRez = true; big.hp = big.maxHp = Math.round(big.maxHp * 2.6); big.r = Math.round(big.r * 1.3);
    it.mobs = [big].concat(hwSpawn(4, it, ['crawler', 'crawler', 'shooter'])); it.st = 'busy'; L.burst(it.x, it.y, 22, [RED, '#ffd24a', GRN], 200, true); L.sfx('kill'); L.toast('發條啟動——巨大的胡桃鉗醒來了！', 2.8); L.hintReset();
  } else if (it.fk === 'chimney') {
    it.n++; L.sfx('hit'); L.burst(it.x, it.y - 20, 12, ['#7a7a8a', SNOW], 150, true); const x = rand();
    if (x < 0.45) { L.dropCoins(it.x, it.y + 30, 3 + Math.floor(rand() * 3)); L.toast('煙囪滾出了禮物：燈芯', 1.4); }
    else if (x < 0.65) { L.pickups.push({ kind: 'oil', x: it.x + 30, y: it.y + 30, t: 0 }); L.toast('禮物裡有一小瓶燈油', 1.4); }
    else if (x < 0.82) { hwSpawn(2, it, ['reindeer', 'snowman']); L.toast('煙囪裡跳出了東西！', 1.6); }
    else L.toast('這份禮物是空盒子……', 1.2);
    if (it.n >= 5) xmDone(it, '煙囪的禮物送完了');
    L.hintReset();
  }
}
function xmTick(dt) {
  const room = L.room, p = L.p; if (!room || L.state() !== 'play') return;
  for (const e of L.enemies) if (!e.dead && e.type === 'boss' && e.xk === 'xmnut' && e.open && L.time > e.open && !e.openOff) { e.openOff = true; }
  if (!XM || !XM.live || room.kind !== 'combat') return;
  for (const it of room.items) {
    if (it.kind === 'tfac' && it.fk === 'hearth' && it.st === 'ready') {
      if (Math.hypot(p.x - it.x, p.y - it.y) < 150) it.t += dt; else it.t = Math.max(0, it.t - dt * 2);
      if (it.t >= 6) { xmDone(it, ''); const r = L.rand(); L.sfx('clear'); if (r < 0.4) { L.healP(1); p.coins += 8; L.toast('壁爐暖暖的：燈火 +1、燈芯 +8', 2.8); } else if (r < 0.8) { p.skillCd = 0; const u = L.rewardUpgrade(); L.toast('暖身完畢：技能冷卻重置、強化「' + L.UPGN(u) + '」', 3); } else { p.coins += 15; L.toast('壁爐裡掉出了襪子：燈芯 +15', 2.4); } L.hintReset(); }
      continue;
    }
    if (it.kind !== 'tfac' || it.st !== 'busy' || !it.mobs) continue;
    if (it.mobs.every(e => e.dead)) { const w = L.makeItem('weapon', it.x, it.y + 60, 'prop'); room.items.push(w); L.dropCoins(it.x, it.y + 20, 10); L.sfx('clear'); xmDone(it, '玩具們安靜了：工坊裡留下一把武器'); }
  }
}
function xmInfo(it) {
  const d = { tree: it.st === 'done' ? '聖誕樹已經亮了' : '每個裝飾 4 燈芯（共 3 個）：燈芯、燈油或強化；掛滿 3 個得燈火 +1 與精良強化。已掛 ' + it.n + ' / 3', workshop: it.st === 'done' ? '工坊已安靜' : '按 F 啟動發條：巨大的胡桃鉗與 4 隻小怪出現；全部打倒得一把武器與燈芯', chimney: it.st === 'done' ? '禮物已送完' : '按 F 丟一份禮物（最多 5 份）：燈芯、燈油，偶爾跑出怪', hearth: it.st === 'done' ? '已經暖和了' : '站在壁爐旁邊（150 像素內）聽 6 秒，離開會倒退。結局：回血加燈芯／技能冷卻重置加強化／燈芯 +15' };
  return { name: XM_NAME[it.fk] + (it.st === 'done' ? '（已結束）' : ''), desc: d[it.fk] || '' };
}
const xmHint = it => (it.st === 'ready' ? (it.fk === 'hearth' ? '靠近壁爐暖身（' + Math.floor(Math.min(6, it.t)) + ' / 6）' : it.fk === 'tree' ? 'F 掛裝飾（4 燈芯，' + it.n + ' / 3）' : it.fk === 'workshop' ? 'F 啟動發條' : 'F 丟禮物（' + it.n + ' / 5）') : '');
function xmDraw(it) {
  const c = L.ctx, tm = L.time, done = it.st === 'done'; c.save(); c.translate(it.x, it.y); if (done) c.globalAlpha = 0.55;
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 26, 44, 10, 0, 0, TAU); c.fill();
  if (it.fk === 'tree') {
    c.fillStyle = '#4a3220'; c.fillRect(-8, 10, 16, 16); for (let k = 0; k < 3; k++) { const w = 54 - k * 14, y = 0 - k * 28; c.fillStyle = '#0f4a2a'; poly(c, [[-w - 2, y + 18], [0, y - 22], [w + 2, y + 18]]); c.fillStyle = GRN; poly(c, [[-w + 2, y + 15], [0, y - 17], [w - 2, y + 15]]); }
    const lit = done || it.n >= 1; c.fillStyle = lit ? '#ffd24a' : '#8a7a4a'; star4(c, 0, -92, 13 + (lit ? Math.sin(tm * 4) * 2 : 0), tm); for (let k = 0; k < it.n + (done ? 3 : 0); k++) { c.fillStyle = [RED, '#7df9ff', '#ffd24a'][k % 3]; circ(c, -22 + k * 22, -8 - (k % 2) * 28, 5); }
  } else if (it.fk === 'workshop') {
    c.fillStyle = '#7a4a2a'; rrect(c, -34, -22, 68, 46, 4); c.fillStyle = RED; poly(c, [[-40, -20], [0, -50], [40, -20]]); c.fillStyle = '#ffe27a'; rrect(c, -8, -4, 16, 28, 2); c.fillStyle = '#ffd24a'; circ(c, 20, -2, 8); c.strokeStyle = '#1a1a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(20, -10); c.lineTo(20, 6); c.moveTo(12, -2); c.lineTo(28, -2); c.stroke();
  } else if (it.fk === 'chimney') {
    c.fillStyle = '#8a3a2a'; rrect(c, -18, -34, 36, 58, 3); c.fillStyle = '#6a2a1e'; for (let k = 0; k < 4; k++) c.fillRect(-18, -26 + k * 14, 36, 2); c.fillStyle = '#c8c8d6'; c.fillRect(-22, -40, 44, 8); c.fillStyle = 'rgba(220,220,235,.6)'; circ(c, Math.sin(tm * 2) * 5, -54 - (tm * 20 % 20), 8);
  } else {
    c.fillStyle = '#7a4a2a'; rrect(c, -34, -16, 68, 40, 4); c.fillStyle = '#1a0e08'; rrect(c, -22, -4, 44, 28, 3); const fl = Math.sin(tm * 9) * 2; c.fillStyle = '#ff7a2a'; poly(c, [[-14, 22], [-8, -2 + fl], [0, 10], [8, -6 - fl], [14, 22]]); c.fillStyle = '#ffe27a'; poly(c, [[-6, 22], [0, 6], [6, 22]]); c.fillStyle = RED; c.fillRect(-30, -22, 14, 8); c.fillStyle = SNOW; c.fillRect(-30, -24, 14, 3);
  }
  c.restore();
}
function xmBack() {
  const room = L.room, c = L.ctx, tm = L.time; if (!room) return;
  if (room.kind === 'boss') {
    const w = L.enemies.find(q => q.type === 'boss' && !q.dead && q.xk === 'xmnut');
    if (w && w.tl && w.tl.act === 'charge') { const p = L.p; c.save(); c.strokeStyle = 'rgba(255,90,60,' + (0.35 + 0.3 * Math.sin(tm * 16)) + ')'; c.lineWidth = 8; c.setLineDash([14, 10]); c.beginPath(); c.moveTo(w.x, w.y); c.lineTo(p.x, p.y); c.stroke(); c.restore(); }
    return;
  }
  if (!XM || !XM.live || room.kind !== 'combat') return;
  for (const s of XM.slots) if (s.fk === 'market') {
    c.save(); c.translate(s.x, s.y - 52); c.fillStyle = '#2a1810'; c.fillRect(-250, -6, 500, 8); for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? RED : SNOW; c.beginPath(); c.moveTo(-250 + i * 50, 2); c.lineTo(-200 + i * 50, 2); c.lineTo(-225 + i * 50, 24); c.fill(); }
    c.fillStyle = '#7a1a1a'; c.font = '700 15px sans-serif'; c.textAlign = 'center'; c.fillText('聖誕市集', 0, -14); c.restore();
  }
}
const XM_BOSS = { xmsanta: { name: '聖誕老人', hp: 285 }, xmfact: { name: '薑餅工廠長', hp: 255 }, xmnut: { name: '巨型胡桃鉗', hp: 360 } };
function xmBossDef(fin) {
  const r = L.run, t = L.th(); r.hwOrd = r.hwOrd || {}; const ord = r.hwOrd[t] = r.hwOrd[t] || L.shuffle(['xmsanta', 'xmfact', 'xmnut']);
  const same = r.themes[0] === r.themes[1], k = ord[same ? r.layer % 3 : (r.layer & 1)], B = XM_BOSS[k]; return { kind: 'golem', name: B.name, hp: Math.round(B.hp * (fin ? 1.3 : 1)), ext: true, xk: k };
}
function xmHit(e, dmg) {
  if (e.type !== 'boss') return dmg;
  if (e.bleedNow) return dmg;
  if (e.xk === 'xmfact') { const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'ginger' && q.spawn <= 0).length; if (n >= 4) { if (L.time - (e.armTip || -99) > 8) { e.armTip = L.time; L.toast('糖霜護體——先清掉薑餅人，Boss 才會吃傷害', 2.2); } return dmg * 0.3; } }
  if (e.xk === 'xmnut') { if (e.open && L.time < e.open) return dmg * 2; return dmg * 0.55; }
  return dmg;
}
function xmMoves(e, phase, ang) {
  const p = L.p, aim = () => Math.atan2(p.y - e.y, p.x - e.x), alive = L.enemies.filter(q => !q.dead && q.type !== 'boss').length;
  const pools = {
    xmsanta: phase === 1 ? ['gifts', 'bells', 'cane'] : phase === 2 ? ['gifts', 'bells', 'cane', 'sleigh'] : ['gifts', 'cane', 'sleigh', 'rain', 'bells'],
    xmfact: phase === 1 ? ['bake', 'sugar'] : phase === 2 ? ['bake', 'rally', 'sugar'] : ['bake', 'rally', 'army', 'sugar'],
    xmnut: phase === 1 ? ['crack', 'soldiers'] : phase === 2 ? ['crack', 'soldiers', 'nuts'] : ['crack', 'soldiers', 'nuts', 'slam']
  };
  const a = pickOf(pools[e.xk] || pools.xmsanta), R = L.ROOM;
  if (a === 'gifts') { for (let w = 0; w < 3; w++) L.later(w * 0.45, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.22, 180, false, 9); L.sfx('hit'); }); L.toast('禮物砸過來！', 1.1); }
  else if (a === 'bells') { const n = 14, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 135, false, 8); L.later(0.8, () => { if (e.dead) return; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + (i + 0.5) / n * TAU, 160, false, 8); }); L.toast('鈴鐺環！', 1.2); }
  else if (a === 'cane') { const off = rand() * TAU; for (let i = 0; i < 30; i++) L.later(i * 0.09, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, e.x, e.y, off + i * 0.42, 185, false, 7); }); L.toast('拐杖糖旋風！', 1.2); }
  else if (a === 'sleigh') { L.toast('雪橇衝過來——看缺口！', 1.8); const gap = R.y + 80 + rand() * (R.h - 160); for (let i = 0; i < 16; i++) { const yy = R.y + 20 + i * ((R.h - 40) / 15); if (Math.abs(yy - gap) < 70) continue; L.later(0.5, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, R.x + 10, yy, 0, 240, false, 8); }); } }
  else if (a === 'rain') { L.toast('雪花雨！', 1.2); for (let i = 0; i < 14; i++) L.later(i * 0.16, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, R.x + rand() * R.w, R.y + 10, Math.PI / 2 + (rand() - 0.5) * 0.3, 200, false, 8); }); }
  else if (a === 'bake') { const n = phase === 3 ? 5 : 4; if (alive < 11) for (let i = 0; i < n; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy('crawler', sp.x, sp.y); m.sleep = false; m.noRez = true; m.spawn = 0.8; } L.toast('出爐了！薑餅人列隊！', 1.4); }
  else if (a === 'rally') { L.toast('糖霜加速——薑餅人衝鋒！', 1.8); for (const q of L.enemies) if (!q.dead && q.type !== 'boss' && !q.rally) { q.rally = true; q.spd *= 1.5; L.later(3.2, () => { q.spd /= 1.5; q.rally = false; }); } }
  else if (a === 'army') { if (alive < 14) for (let i = 0; i < 8; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy('crawler', sp.x, sp.y); m.sleep = false; m.noRez = true; m.spawn = 0.8; } L.toast('整盤出爐！', 1.6); }
  else if (a === 'sugar') { for (let w = 0; w < 2; w++) L.later(w * 0.5, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.2, 205, false, 7); }); L.toast('糖粒彈！', 1.1); }
  else if (a === 'crack') { e.tl = { t: 0.9, act: 'charge', ang: aim() }; e.open = L.time + 4.2; e.openOff = false; L.toast('胡桃鉗張開大嘴——衝撞後的 3 秒是弱點，傷害 ×2！', 2.6); }
  else if (a === 'soldiers') { if (alive < 9) for (let i = 0; i < 3; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy('crawler', sp.x, sp.y); m.sleep = false; m.noRez = true; m.spawn = 0.8; } L.toast('玩具兵列隊！', 1.4); }
  else if (a === 'nuts') { for (let w = 0; w < 2; w++) L.later(w * 0.6, () => { if (e.dead || L.state() !== 'play') return; const n = 16, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 150, false, 8); }); L.toast('堅果彈！', 1.2); }
  else { L.toast('發條重擊！', 1.4); e.open = L.time + 3.4; e.openOff = false; for (let k = 0; k < 7; k++) { const aa = k / 7 * TAU, d = 130 + (k % 2) * 90; L.markStrike(e, e.x + Math.cos(aa) * d, e.y + Math.sin(aa) * d, 56, 1.1, {}); } }
}
function drawXmBoss(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 2) * 4, ol = '#2a1810';
  if (e.xk === 'xmsanta') {
    c.fillStyle = 'rgba(214,58,58,.14)'; circ(c, 0, b, 105); c.fillStyle = ol; c.beginPath(); c.ellipse(0, 36 + b, 66, 66, 0, 0, TAU); c.fill(); c.fillStyle = fl ? C.paper : RED; c.beginPath(); c.ellipse(0, 36 + b, 60, 60, 0, 0, TAU); c.fill(); c.fillStyle = '#1a1a2a'; c.fillRect(-60, 30 + b, 120, 12); c.fillStyle = '#ffd24a'; c.fillRect(-12, 28 + b, 24, 16);
    c.fillStyle = fl ? C.paper : '#f2c9a0'; circ(c, 0, -30 + b, 34); c.fillStyle = SNOW; c.beginPath(); c.moveTo(-34, -24 + b); c.quadraticCurveTo(0, 50 + b, 34, -24 + b); c.quadraticCurveTo(0, -4 + b, -34, -24 + b); c.fill(); circ(c, -24, -40 + b, 11); circ(c, 24, -40 + b, 11);
    c.fillStyle = fl ? C.paper : RED; poly(c, [[-36, -48 + b], [-4, -96 + b], [36, -48 + b]]); c.fillStyle = SNOW; c.fillRect(-38, -52 + b, 76, 12); circ(c, -4, -98 + b, 8); c.fillStyle = ol; circ(c, -12, -34 + b, 3); circ(c, 12, -34 + b, 3); c.fillStyle = '#e8a090'; circ(c, 0, -26 + b, 4);
  } else if (e.xk === 'xmfact') {
    const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'ginger' && q.spawn <= 0).length;
    if (n >= 4) { c.strokeStyle = 'rgba(255,255,255,' + (0.55 + 0.2 * Math.sin(t * 8)) + ')'; c.lineWidth = 6; c.beginPath(); c.arc(0, b, 90, 0, TAU); c.stroke(); }
    c.fillStyle = ol; circ(c, 0, -34 + b, 44); rrect(c, -62, -4 + b, 124, 88, 8); rrect(c, -86, 0 + b, 30, 60, 6); rrect(c, 56, 0 + b, 30, 60, 6);
    c.fillStyle = fl ? C.paper : '#b9702e'; circ(c, 0, -34 + b, 40); rrect(c, -58, 0 + b, 116, 80, 6); rrect(c, -82, 4 + b, 22, 52, 5); rrect(c, 60, 4 + b, 22, 52, 5);
    c.fillStyle = '#fff'; circ(c, -14, -40 + b, 7); circ(c, 14, -40 + b, 7); c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.arc(0, -26 + b, 16, 0.2, Math.PI - 0.2); c.stroke(); c.fillStyle = RED; for (let k = 0; k < 3; k++) circ(c, 0, 10 + k * 20 + b, 6);
    c.fillStyle = '#fff'; rrect(c, -30, -90 + b, 60, 34, 6); circ(c, -22, -92 + b, 14); circ(c, 0, -98 + b, 16); circ(c, 22, -92 + b, 14);
  } else {
    const open = e.open && L.time < e.open; c.fillStyle = open ? 'rgba(255,230,120,.22)' : 'rgba(214,58,58,.12)'; circ(c, 0, b, 108);
    c.fillStyle = ol; rrect(c, -58, -6 + b, 116, 100, 8); c.fillStyle = fl ? C.paper : RED; rrect(c, -54, -2 + b, 108, 92, 6); c.fillStyle = '#ffd24a'; c.fillRect(-40, 20 + b, 80, 5); c.fillRect(-40, 50 + b, 80, 5); for (const s of [-1, 1]) { c.fillStyle = fl ? C.paper : '#1a1a2a'; c.fillRect(s * 36 - 12, 90 + b, 24, 20); }
    c.fillStyle = ol; rrect(c, -40, -78 + b, 80, 80, 6); c.fillStyle = fl ? C.paper : '#f2c9a0'; rrect(c, -36, -74 + b, 72, 56, 5); c.fillStyle = ol; circ(c, -14, -52 + b, 5); circ(c, 14, -52 + b, 5);
    c.fillStyle = '#fff'; rrect(c, -30, -26 + b, 60, open ? 10 : 6, 2); c.fillStyle = open ? '#7a1a1a' : '#f2c9a0'; if (open) { rrect(c, -28, -16 + b, 56, 18, 3); c.fillStyle = '#fff'; for (let k = 0; k < 5; k++) c.fillRect(-26 + k * 11, -16 + b, 6, 7); }
    c.fillStyle = fl ? C.paper : '#1a1a2a'; rrect(c, -42, -112 + b, 84, 36, 4); c.fillStyle = '#ffd24a'; c.fillRect(-42, -84 + b, 84, 5);
  }
}
const XM_EVENTS = {
  swap: {
    toast: '交換禮物：花 3 燈芯，換一份神祕禮物', setup: (room, cx, cy) => xAdd(room, cx, cy, 'swap'),
    info: it => ({ name: '交換禮物', desc: it.used ? '禮物已經拆開了' : '花 3 燈芯換一份神祕禮物：50% 強化、30% 燈芯 +8、20% 空盒子（只有 1 燈芯）；只能一次' }),
    hint: it => it.used ? '' : 'F 交換（3 燈芯）',
    use(it) { if (it.used) return; if (L.p.coins < 3) { L.toast('燈芯不夠'); L.sfx('tick'); return; } L.p.coins -= 3; it.used = true; const r = L.rand(); L.sfx('buy'); if (r < 0.5) { const u = L.rewardUpgrade(); L.toast('拆開禮物：強化「' + L.UPGN(u) + '」', 2.8); } else if (r < 0.8) { L.p.coins += 8; L.toast('禮物盒裡有燈芯 +8', 2.2); } else { L.p.coins += 1; L.toast('空盒子……還有一顆糖，燈芯 +1', 2.2); } },
    draw: it => xProp(it, '#c0392b', '禮', it.used)
  },
  carol: {
    toast: '聖誕合唱：站在合唱團旁聽 5 秒', setup: (room, cx, cy) => xAdd(room, cx, cy, 'carol', { t: 0 }),
    info: it => ({ name: '聖誕合唱團', desc: it.used ? '歌唱完了' : '站在合唱團旁邊（150 像素內）聽 5 秒，離開會倒退。聽完：燈火 +1、燈芯 +10' }),
    hint: it => it.used ? '' : '靠近合唱團（' + Math.floor(Math.min(5, it.t)) + ' / 5）',
    use() { },
    tick(dt, room) { const it = room.items.find(q => q.kind === 'xev' && q.id === 'carol'); if (!it || it.used) return; const p = L.p; if (Math.hypot(p.x - it.x, p.y - it.y) < 150) it.t += dt; else it.t = Math.max(0, it.t - dt * 2); if (it.t >= 5) { it.used = true; L.healP(1); p.coins += 10; L.sfx('clear'); L.toast('歌聲暖暖的：燈火 +1、燈芯 +10', 2.8); L.hintReset(); } },
    draw: it => { const c = L.ctx; c.save(); c.translate(it.x, it.y); if (it.used) c.globalAlpha = 0.5; c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 22, 40, 9, 0, 0, TAU); c.fill(); for (let k = -1; k <= 1; k++) { c.fillStyle = [RED, GRN, '#3a5fc0'][k + 1]; c.beginPath(); c.ellipse(k * 24, 8, 11, 16, 0, 0, TAU); c.fill(); c.fillStyle = '#f2c9a0'; circ(c, k * 24, -12, 8); c.fillStyle = '#1a1a2a'; c.beginPath(); c.ellipse(k * 24, -4 + Math.sin(L.time * 5 + k) * 1.5, 3, 4, 0, 0, TAU); c.fill(); } c.restore(); }
  },
  cocoa: {
    toast: '熱可可攤：花 6 燈芯，喝一杯暖一暖', setup: (room, cx, cy) => xAdd(room, cx, cy, 'cocoa'),
    info: it => ({ name: '熱可可攤', desc: it.used ? '可可賣完了' : '花 6 燈芯：燈火 +2、技能冷卻重置；只能一次' }),
    hint: it => it.used ? '' : 'F 買熱可可（6 燈芯）',
    use(it) { if (it.used) return; if (L.p.coins < 6) { L.toast('燈芯不夠'); L.sfx('tick'); return; } L.p.coins -= 6; it.used = true; L.healP(2); L.p.skillCd = 0; L.sfx('buy'); L.toast('熱可可：燈火 +2、技能冷卻重置', 2.6); },
    draw: it => xProp(it, '#7a4a2a', '可', it.used)
  }
};
L.registerWorld({
  theme: 20, name: '耶誕節', pool: 'dlc', opt: '耶誕節（DLC5）', pal: PAL20, bigMap: true, ownStory: true, noDark: true, noPaper: true,
  amb: ['bandpass', 1500, 1.2, 0.004], ev: r => { const n = [523, 659, 784, 1047][Math.floor(r() * 4)]; L.blip(n, n * 1.004, 0.7, 'triangle', 0.008); },
  skin: { map: XM_SKIN, draw: drawXmEnemy, hue: false }, bg: xmBg, obsDraw: xmObsDraw, obs: xmObs, roomInit: xmInit, tick: xmTick, back: xmBack,
  drawItem: xmDraw, info: xmInfo, hint: xmHint, useItem: xmUse, shards: XM_SHARDS, hitMod: xmHit,
  arrows: edge => { const room = L.room; if (!room || room.kind !== 'combat' || !XM || !XM.live) return; for (const it of room.items) if (it.kind === 'tfac' && it.st === 'ready' && !it.taken) edge(it.x, it.y, '#ffd24a', false); for (const s of XM.slots) if (s.fk === 'market') edge(s.x, s.y, '#ff8a8a', false); },
  mini: (mx, my, sc) => {
    const room = L.room, c = L.ctx, R = L.ROOM; if (!room || room.kind !== 'combat' || !XM || !XM.live) return; c.save(); c.textAlign = 'center'; c.font = '700 9px sans-serif';
    for (const s of XM.slots) { const x = mx + (s.x - R.x) * sc, y = my + (s.y - R.y) * sc; if (s.fk === 'market') { c.fillStyle = '#ff8a8a'; c.fillText('市', x, y + 3); } }
    for (const it of room.items) if (it.kind === 'tfac') { const x = mx + (it.x - R.x) * sc, y = my + (it.y - R.y) * sc; c.fillStyle = it.st === 'done' ? 'rgba(180,180,180,.6)' : '#ffd24a'; c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x + 3.5, y); c.lineTo(x, y + 4); c.lineTo(x - 3.5, y); c.fill(); }
    c.restore();
  },
  enemies: { reindeer: { hp: 7, r: 15, name: '馴鹿', cost: 3, cap: 3, ai: reindeerAi }, snowman: { hp: 14, r: 18, name: '雪人', cost: 4, cap: 2, ai: snowmanAi } },
  types: (types, L0, ci) => { types.length = 0; types.push('crawler', 'crawler', 'shooter', 'reindeer'); if (L0 > 0) types.push('snowman', 'brute', 'crawler', 'bomber'); if (L0 >= 2) types.push('reindeer', 'snowman', 'shooter', 'brute'); if (L0 >= 3) types.push('brute', 'brute', 'snowman', 'shooter', 'bomber'); },
  extra: () => [],
  boss: fin => xmBossDef(fin), boss2: xmMoves, drawBoss: drawXmBoss,
  intro: def => (def.xk === 'xmsanta'
    ? [{ who: '旁白', text: '雪橇的鈴聲由遠而近，一個巨大的紅色身影擋在路中間。' }, { who: '聖誕老人', text: '今年的禮物……全都送不出去了。來，你替我接住它們吧！' }]
    : def.xk === 'xmfact'
      ? [{ who: '旁白', text: '工廠的烤箱門一扇扇打開，熱氣裡走出整排薑餅人。' }, { who: '薑餅工廠長', text: '訂單沒做完，誰都別想走！出爐——' }, { who: '旁白', text: '只要薑餅人還站著，工廠長就有糖霜護體。' }]
      : [{ who: '旁白', text: '玩具堆裡，一個比房子還高的木頭士兵慢慢轉過頭，發條咔啦咔啦地響。' }, { who: '巨型胡桃鉗', text: '咔、咔——想要我的心，就得先撬開我的嘴。' }, { who: '旁白', text: '牠張開嘴巴的瞬間，是最脆弱的時候。' }]),
  onKill: e => {
    const r = L.run; swarmBleed(e, 'xmfact', 'ginger');
    if (e.skin === 'ginger' && L.enemies.some(q => !q.dead && q.type === 'boss' && q.xk === 'xmfact')) { const o = L.rand() * TAU; for (let i = 0; i < 4; i++) L.enemyShot(e, o + i * TAU / 4, 120); }
    else if (e.skin === 'ginger') { r.xmGinger = (r.xmGinger || 0) + 1; }
  },
  events: XM_EVENTS,
  weapons: {
    candycane: { id: 'candycane', name: '拐杖糖', tag: '近戰', mode: 'tap', cd: 0.45, th: 20, col: '#ff6a6a', range: 135, half: 1.3, dmg: 3.7, kb: 340, desc: '大範圍的弧形揮砍（耶誕節專屬，類似提燈刃）' },
    snowcannon: { id: 'snowcannon', name: '雪球砲', tag: '單發', mode: 'tap', cd: 0.38, th: 20, col: '#f4f8fc', desc: '單發的雪球，傷害高（耶誕節專屬，類似燈焰杖）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 560, 9, 3.9 * dm, 'flame', 1.0); L.sfx('flame'); } },
    jinglebow: { id: 'jinglebow', name: '鈴鐺弓', tag: '連射', mode: 'auto', cd: 0.11, th: 20, col: '#ffd24a', desc: '按住連射小鈴鐺，射速快（耶誕節專屬，類似螢火弓）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang + (rand() - 0.5) * 0.07, 720, 4, 1.15 * dm, 'pellet', 0.8); L.sfx('tick'); } },
    holly: { id: 'holly', name: '冬青散彈', tag: '散射', mode: 'tap', cd: 0.62, th: 20, col: '#2f9a58', desc: '五發冬青果散射，近距離很痛（耶誕節專屬，類似霰光杖）',
      fire: (ox, oy, ang, dm) => { for (let i = -2; i <= 2; i++) L.shoot(ox, oy, ang + i * 0.16, 520, 6, 1.9 * dm, 'pellet', 0.55); L.sfx('blade'); } },
    icicle: { id: 'icicle', name: '冰錐', tag: '貫穿', mode: 'tap', cd: 0.75, th: 20, col: '#9fe8ff', desc: '貫穿一整排敵人的冰錐（耶誕節專屬，類似穿光矛）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 700, 8, 4.6 * dm, 'lance', 0.95, true); L.sfx('blade'); } }
  },
  ach: [
    { id: 'xmSanta', name: '送不出去的禮物', desc: '耶誕節：擊敗聖誕老人' },
    { id: 'xmFact', name: '關掉烤箱', desc: '耶誕節：擊敗薑餅工廠長' },
    { id: 'xmNut', name: '撬開那張嘴', desc: '耶誕節：擊敗巨型胡桃鉗' },
    { id: 'xmFac', name: '聖誕小幫手', desc: '耶誕節：同一局完成許願聖誕樹與精靈工坊' }
  ],
  onMid: () => { if (L.th() !== 20) return; xmBossAch(); L.later(1.2, () => L.say([{ who: '精靈', text: '雪停了。下一個節日的鈴聲，已經在路的盡頭響起。' }])); },
  onFinal: () => { if (L.th() === 20) xmBossAch(); },
  outro: () => [{ who: '聖誕老人', text: '謝謝你替我接住了那些禮物。今年，終於有人拆開它們。' }, { who: '旁白', text: '雪地上的燈一盞一盞地熄了，只剩下你的那一盞，安靜地亮到天亮。' }]
});
function xmBossAch() { try { const k = L.bossDef().xk; if (k === 'xmsanta') L.unlockAch('xmSanta'); else if (k === 'xmfact') L.unlockAch('xmFact'); else if (k === 'xmnut') L.unlockAch('xmNut'); } catch (e) { /* optional */ } }

/* ================= 復活節（21）：全亮、超大地圖、三隻 Boss（彈幕／大群／長戰） ================= */
const PAL21 = { ink: '#1f3a2a', floor: '#e6f2dc', floor2: '#d8eccb', wall1: '#4a9a4a', wall2: '#7acb6a', top: '#fff7e8', door: '#e86aa8' };
const ES_SKIN = { crawler: 'chick', shooter: 'bunny', brute: 'lamb', bomber: 'egg', butterfly: 'bfly', hen: 'hen' };
const ES_STORY = [
  [{ who: '旁白', text: '雪化了，草地從泥土裡探出頭。風裡有花香，也有一點點巧克力的味道。' }, { who: '小兔', text: '旅人！彩蛋全被藏起來了，連蛋殼都在亂跑——幫我找回春天好嗎？' }],
  [{ who: '旁白', text: '花開得太用力，連空氣都是粉紅色的。籃子翻倒在草叢，蛋滾得到處都是。' }, { who: '小兔', text: '最大的那顆蛋……還沒有孵出來。牠一直在等一個敲門的人。' }]
];
const ES_SHARDS = ['彩蛋便條：我把最漂亮的那顆藏在最顯眼的地方，結果大家都沒找到。', '彩蛋便條：小雞說，破殼的那一刻不是結束，是第一次看見天空。', '彩蛋便條：兔子洞很深，但盡頭有一盞跟你一樣的燈。', '彩蛋便條：春天不是被找到的，是被一起種出來的。'];
const ES_ZONE = ['花田', '溪邊草地', '彩蛋工坊', '兔子洞', '彩蛋市集', '野餐山丘'];
const PNK = '#f2a0c8', YEL = '#ffe27a', GRN2 = '#4aa84a';
let ES = null;
function drawEsEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, tm = e.t, fa = Math.atan2(L.p.y - e.y, L.p.x - e.x), ol = '#2a1810', wh = f ? C.paper : null;
  if (sk === 'chick') {
    const sw = Math.sin(tm * 10) * 2; c.fillStyle = ol; circ(c, 0, 0, r * 1.1); c.fillStyle = wh || YEL; circ(c, 0, 0, r); c.fillStyle = '#ff9a3a'; poly(c, [[r * 0.5, -r * 0.1], [r * 1.0, r * 0.1], [r * 0.5, r * 0.3]]); c.fillRect(-r * 0.4, r * 0.9, 3, 5 + sw); c.fillRect(r * 0.2, r * 0.9, 3, 5 - sw); c.fillStyle = ol; circ(c, r * 0.2, -r * 0.3, 2.5);
  } else if (sk === 'bunny') {
    c.fillStyle = ol; rrect(c, -r * 0.4, -r * 2.0, r * 0.35, r * 1.3, 3); rrect(c, r * 0.05, -r * 2.0, r * 0.35, r * 1.3, 3); circ(c, 0, 0, r * 1.05);
    c.fillStyle = wh || '#f4f0f4'; rrect(c, -r * 0.36, -r * 1.96, r * 0.27, r * 1.25, 3); rrect(c, r * 0.09, -r * 1.96, r * 0.27, r * 1.25, 3); circ(c, 0, 0, r); c.fillStyle = PNK; rrect(c, -r * 0.3, -r * 1.8, r * 0.15, r * 0.9, 2); rrect(c, r * 0.15, -r * 1.8, r * 0.15, r * 0.9, 2);
    c.fillStyle = ol; circ(c, -r * 0.3, -r * 0.1, 2.5); circ(c, r * 0.3, -r * 0.1, 2.5); c.fillStyle = PNK; circ(c, 0, r * 0.15, 3); const g = 0.6 + 0.4 * Math.sin(tm * 6); c.fillStyle = 'rgba(255,140,200,' + g + ')'; circ(c, Math.cos(fa) * r * 1.3, Math.sin(fa) * r * 1.3, r * 0.3);
  } else if (sk === 'lamb') {
    c.fillStyle = ol; for (let k = 0; k < 6; k++) circ(c, Math.cos(k) * r * 0.8, Math.sin(k) * r * 0.8, r * 0.55); circ(c, 0, 0, r * 0.9);
    c.fillStyle = wh || '#fbf4ea'; for (let k = 0; k < 6; k++) circ(c, Math.cos(k) * r * 0.8, Math.sin(k) * r * 0.8, r * 0.5); circ(c, 0, 0, r * 0.85); c.fillStyle = wh || '#6a5a52'; circ(c, Math.cos(fa) * r * 0.6, Math.sin(fa) * r * 0.6, r * 0.45); c.fillStyle = '#fff'; circ(c, Math.cos(fa) * r * 0.7 - 3, Math.sin(fa) * r * 0.7 - 3, 2); circ(c, Math.cos(fa) * r * 0.7 + 4, Math.sin(fa) * r * 0.7 - 3, 2);
  } else if (sk === 'egg') {
    c.fillStyle = ol; c.beginPath(); c.ellipse(0, 2, r * 0.95, r * 1.15, 0, 0, TAU); c.fill(); c.fillStyle = wh || PNK; c.beginPath(); c.ellipse(0, 2, r * 0.85, r * 1.05, 0, 0, TAU); c.fill(); c.fillStyle = '#7ad0f0'; c.fillRect(-r * 0.8, -r * 0.1, r * 1.6, r * 0.28); c.fillStyle = YEL; for (let k = -1; k <= 1; k++) circ(c, k * r * 0.4, r * 0.6, 2.5);
  } else if (sk === 'bfly') {
    const fl = Math.sin(tm * 14) * 0.5 + 0.5; c.fillStyle = ol; c.beginPath(); c.ellipse(-r * 0.8, 0, r * 0.9, r * (0.5 + 0.5 * fl), -0.3, 0, TAU); c.ellipse(r * 0.8, 0, r * 0.9, r * (0.5 + 0.5 * fl), 0.3, 0, TAU); c.fill();
    c.fillStyle = wh || '#c88aff'; c.beginPath(); c.ellipse(-r * 0.8, 0, r * 0.8, r * (0.42 + 0.5 * fl), -0.3, 0, TAU); c.ellipse(r * 0.8, 0, r * 0.8, r * (0.42 + 0.5 * fl), 0.3, 0, TAU); c.fill(); c.fillStyle = '#fff'; circ(c, -r * 0.8, -2, 3); circ(c, r * 0.8, -2, 3); c.fillStyle = ol; rrect(c, -3, -r * 0.8, 6, r * 1.6, 3);
    if (e.tele > 0) { c.fillStyle = 'rgba(255,90,160,.55)'; circ(c, Math.cos(fa) * r * 1.3, Math.sin(fa) * r * 1.3, r * 0.4); }
  } else { // hen
    const a = e.ra || fa; if (e.tele > 0) { c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#ff6a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 260, Math.sin(a) * 260); c.stroke(); c.restore(); }
    c.fillStyle = ol; c.beginPath(); c.ellipse(0, 2, r * 1.2, r * 1.0, 0, 0, TAU); c.fill(); c.fillStyle = wh || '#fff4e0'; c.beginPath(); c.ellipse(0, 2, r * 1.1, r * 0.9, 0, 0, TAU); c.fill(); c.fillStyle = '#e03a3a'; circ(c, -r * 0.2, -r * 0.95, r * 0.28); circ(c, r * 0.1, -r * 1.0, r * 0.25); c.fillStyle = '#ff9a3a'; poly(c, [[r * 0.6, -r * 0.2], [r * 1.2, 0], [r * 0.6, r * 0.2]]); c.fillStyle = ol; circ(c, r * 0.35, -r * 0.3, 2.5);
  }
}
function henAi(e, dt, nx, ny, d) {
  e.st = (e.st === undefined ? rr(1, 2) : e.st) - dt; if (!e.state || e.state === 'spawn') e.state = 'walk';
  let mx = 0, my = 0, touch = 1;
  if (e.state === 'walk') { mx = nx * 46 * e.spd; my = ny * 46 * e.spd; if (e.st <= 0) { e.state = 'wind'; e.st = 0.75; e.ra = Math.atan2(L.p.y - e.y, L.p.x - e.x); } }
  else if (e.state === 'wind') { e.tele = e.st; e.ra = Math.atan2(L.p.y - e.y, L.p.x - e.x); if (e.st <= 0) { e.state = 'dash'; e.st = 0.8; e.tele = 0; } }
  else if (e.state === 'dash') { mx = Math.cos(e.ra) * 430 * e.spd; my = Math.sin(e.ra) * 430 * e.spd; touch = 2; if (e.st <= 0) { e.state = 'rest'; e.st = 1.1; L.burst(e.x, e.y, 8, ['#fff4e0', YEL], 140, true); } }
  else if (e.st <= 0) { e.state = 'walk'; e.st = rr(1.6, 2.6); }
  return { mx, my, touch };
}
function bflyAi(e, dt, nx, ny, d) {
  e.cd = (e.cd === undefined ? rr(1.4, 2.4) : e.cd) - dt; e.w = (e.w || rand() * TAU) + dt * 2.2;
  if (e.tele > 0) { e.tele -= dt; if (e.tele <= 0) { const a = Math.atan2(L.p.y - e.y, L.p.x - e.x); for (let i = -1; i <= 1; i++) L.enemyShot(e, a + i * 0.3, 180); e.cd = rr(2.2, 3.0) * e.fire; } return { mx: 0, my: 0, touch: 1 }; }
  if (e.cd <= 0 && d < 540) e.tele = 0.45;
  const k = d > 260 ? 1 : d < 160 ? -0.8 : 0; return { mx: (nx * k + Math.cos(e.w) * 0.9) * 70 * e.spd, my: (ny * k + Math.sin(e.w) * 0.9) * 70 * e.spd, touch: 1 };
}
function esMake(R) {
  const zw = R.w / 3, zh = R.h / 2, zc = z => ({ x: R.x + (z % 3 + 0.5) * zw, y: R.y + (Math.floor(z / 3) + 0.5) * zh });
  const zs = L.shuffle([0, 2, 3]), a = zc(zs[0]), b = zc(zs[1]), cc = zc(zs[2]), mid = zc(4), top = zc(1);
  ES = { R: { x: R.x, y: R.y, w: R.w, h: R.h }, live: false, slots: [{ fk: 'market', x: R.x + R.w - 340, y: R.y + 170 }, { fk: 'basket', x: mid.x, y: mid.y + 20 }, { fk: 'paint', x: a.x + rr(-90, 90), y: a.y + rr(-60, 60) }, { fk: 'burrow', x: b.x + rr(-90, 90), y: b.y + rr(-60, 60) }, { fk: 'garden', x: top.x + rr(-120, 120), y: top.y + rr(-60, 60) }] };
  return ES;
}
function esObs(kind, R, D) {
  if (kind === 'boss') {
    return [[R.x + 110, R.y + 80], [R.x + R.w - 150, R.y + 80], [R.x + 110, R.y + R.h - 130], [R.x + R.w - 150, R.y + R.h - 130]].map(q => ({ x: q[0], y: q[1], w: 44, h: 44, jk: 'bush' }))
      .concat([{ x: R.x + R.w * 0.38, y: R.y + R.h / 2 - 150, w: 36, h: 44, jk: 'egg' }, { x: R.x + R.w * 0.38, y: R.y + R.h / 2 + 110, w: 36, h: 44, jk: 'egg' }, { x: R.x + R.w * 0.62, y: R.y + R.h / 2 - 40, w: 36, h: 44, jk: 'egg' }]);
  }
  esMake(R); const sl = ES.slots;
  const keep = sl.map(s => s.fk === 'market' ? { x: s.x - 230, y: s.y - 100, w: 520, h: 220 } : s.fk === 'basket' ? { x: s.x - 200, y: s.y - 160, w: 400, h: 320 } : { x: s.x - 150, y: s.y - 140, w: 300, h: 280 });
  keep.push({ x: R.x, y: D.y - 100, w: 170, h: 200 }, { x: R.x + R.w - 170, y: D.y - 100, w: 170, h: 200 });
  const obs = [], total = 38, ks = ['bush', 'bush', 'bush', 'egg', 'egg', 'rock'];
  for (let t = 0; t < 1200 && obs.length < total; t++) {
    const jk = pickOf(ks), w = jk === 'bush' ? rr(44, 58) : jk === 'rock' ? rr(36, 50) : 36, h = jk === 'bush' ? rr(40, 52) : jk === 'rock' ? rr(34, 44) : 44;
    const o = { x: rr(R.x + 90, R.x + R.w - 90 - w), y: rr(R.y + 50, R.y + R.h - 50 - h), w, h, jk };
    if (keep.some(k => L.overlap(k, o)) || obs.some(q => L.overlap(L.inflate(q, 80), o))) continue;
    obs.push(o);
  }
  return obs;
}
function esObsDraw(g, o) {
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
  if (o.jk === 'bush') {
    g.fillStyle = '#245a24'; circ(g, cx - o.w * 0.22, cy + 2, o.h * 0.55); circ(g, cx + o.w * 0.22, cy + 2, o.h * 0.55); circ(g, cx, cy - o.h * 0.15, o.h * 0.6); g.fillStyle = GRN2; circ(g, cx - o.w * 0.22, cy, o.h * 0.48); circ(g, cx + o.w * 0.22, cy, o.h * 0.48); circ(g, cx, cy - o.h * 0.18, o.h * 0.52);
    g.fillStyle = '#ff8ac0'; circ(g, cx - 8, cy - 6, 3.5); g.fillStyle = YEL; circ(g, cx + 9, cy - 2, 3.5); g.fillStyle = '#fff'; circ(g, cx + 1, cy + 8, 3.5);
  } else if (o.jk === 'egg') {
    g.fillStyle = '#3a2a4a'; g.beginPath(); g.ellipse(cx, cy, o.w / 2 + 2, o.h / 2 + 2, 0, 0, TAU); g.fill(); g.fillStyle = PNK; g.beginPath(); g.ellipse(cx, cy, o.w / 2, o.h / 2, 0, 0, TAU); g.fill(); g.fillStyle = '#7ad0f0'; g.fillRect(cx - o.w / 2 + 2, cy - 5, o.w - 4, 6); g.fillStyle = YEL; for (let k = -1; k <= 1; k++) circ(g, cx + k * 8, cy + 10, 2.5);
  } else {
    g.fillStyle = '#5a6a5a'; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 9); g.fillStyle = '#b8c8b0'; rrect(g, o.x, o.y, o.w, o.h, 8); g.fillStyle = '#7ab070'; circ(g, o.x + 8, o.y + o.h - 5, 7); circ(g, o.x + o.w - 10, o.y + o.h - 4, 6);
  }
}
function esBg(g, rm, rng, arR) {
  const R = L.ROOM; const cols = ['#ff9ac8', '#ffe27a', '#ffffff', '#c8a0ff', '#8ad0ff'];
  for (let i = 0; i < Math.round(120 * arR); i++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.fillStyle = '#5aa84a'; g.fillRect(x, y, 2, 7); g.fillStyle = cols[Math.floor(rng() * cols.length)]; circ(g, x + 1, y - 1, 2.5 + rng() * 1.5); }
  for (let k = 0; k < Math.round(8 * arR); k++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h, gr = g.createRadialGradient(x, y, 0, x, y, 220); gr.addColorStop(0, 'rgba(255,200,230,.28)'); gr.addColorStop(1, 'rgba(255,200,230,0)'); g.fillStyle = gr; g.fillRect(x - 220, y - 220, 440, 440); }
  if (rm.kind === 'combat' && R.w > 2000) { g.font = '700 34px sans-serif'; g.textAlign = 'center'; g.fillStyle = 'rgba(80,130,70,.16)'; for (let z = 0; z < 6; z++) g.fillText(ES_ZONE[z], R.x + (z % 3 + 0.5) * R.w / 3, R.y + (Math.floor(z / 3) + 0.5) * R.h / 2 - 110); }
}
function esInit(room, kind) {
  const r = L.run; if (L.th() !== 21) return;
  if (kind !== 'combat') { ES = kind === 'boss' ? ES : null; if (ES) ES.live = false; }
  { const sd = r.esSaid = r.esSaid || {}; if (kind !== 'start' && !sd[r.layer]) { sd[r.layer] = 1; const T0 = ES_STORY[r.layer & 1]; L.later(2.0, () => { if (L.room === room && L.state() === 'play') L.say(T0); }); } }
  if (kind !== 'combat' || !ES) return;
  ES.live = true; room.refreshN = 0;
  for (const s of ES.slots) {
    if (s.fk === 'market') {
      room.items.push(L.makeItem('heal', s.x - 130, s.y, 'shop'), L.makeItem('upgrade', s.x, s.y, 'shop'), L.makeItem(rand() < 0.65 ? 'weapon' : 'upgrade', s.x + 130, s.y, 'shop'));
      room.items.push({ kind: 'refresh', id: 'refresh', slot: 'refresh', x: s.x + 250, y: s.y, price: 3, group: 'stall', taken: false });
    } else room.items.push({ kind: 'tfac', id: 'tfac', fk: s.fk, x: s.x, y: s.y, group: 'prop', price: 0, taken: false, st: 'ready', t: 0, n: 0 });
  }
}
const ES_NAME = { basket: '彩蛋籃', paint: '彩繪工坊', burrow: '兔子洞', garden: '春日花園' };
function esDone(it, msg) { it.st = 'done'; const r = L.run; r.esFac = r.esFac || {}; r.esFac[it.fk] = 1; if (r.esFac.basket && r.esFac.paint) L.unlockAch('ezFac'); if (msg) L.toast(msg, 3); L.hintReset(); }
function esUse(it) {
  const p = L.p;
  if (it.st === 'done') { L.toast('這裡已經結束了', 1.4); return; }
  if (it.st === 'busy') { L.toast('進行中……', 1.2); return; }
  if (it.fk === 'garden') { L.toast('站在花園裡等 6 秒，花就會開', 1.6); return; }
  if (it.fk === 'basket') {
    if (p.coins < 4) { L.toast('燈芯不夠（每顆蛋 4 燈芯）', 1.6); L.sfx('tick'); return; } p.coins -= 4; it.n++; L.sfx('buy'); L.burst(it.x, it.y - 20, 14, [PNK, YEL, '#7ad0f0'], 150, true); const x = rand();
    if (it.n >= 3) { L.healP(1); const u = L.premUpgrade(); esDone(it, '籃子裡的蛋全孵開了：燈火 +1、精良強化「' + L.UPGN(u) + '」'); return; }
    if (x < 0.4) { p.coins += 8; L.toast('蛋裡滾出了燈芯 +8', 2); } else if (x < 0.75) { L.pickups.push({ kind: 'oil', x: it.x + 30, y: it.y + 40, t: 0 }); L.toast('蛋裡有一小瓶燈油', 2); } else { const u = L.rewardUpgrade(); L.toast('蛋殼發光了：強化「' + L.UPGN(u) + '」', 2.6); }
    L.hintReset();
  } else if (it.fk === 'paint') {
    const big = L.spawnEnemy('brute', it.x, it.y - 100); big.sleep = false; big.noRez = true; big.hp = big.maxHp = Math.round(big.maxHp * 2.6); big.r = Math.round(big.r * 1.3);
    it.mobs = [big].concat(hwSpawn(4, it, ['crawler', 'crawler', 'shooter'])); it.st = 'busy'; L.burst(it.x, it.y, 22, [PNK, YEL, '#7ad0f0'], 200, true); L.sfx('kill'); L.toast('顏料桶翻倒了——巨大的彩繪羊跑出來！', 2.8); L.hintReset();
  } else if (it.fk === 'burrow') {
    it.n++; L.sfx('hit'); L.burst(it.x, it.y - 10, 12, ['#8a6a4a', '#fff'], 150, true); const x = rand();
    if (x < 0.45) { L.dropCoins(it.x, it.y + 30, 3 + Math.floor(rand() * 3)); L.toast('洞裡滾出了彩蛋：燈芯', 1.4); }
    else if (x < 0.65) { L.pickups.push({ kind: 'oil', x: it.x + 30, y: it.y + 30, t: 0 }); L.toast('洞裡有一小瓶燈油', 1.4); }
    else if (x < 0.82) { hwSpawn(2, it, ['hen', 'butterfly']); L.toast('洞裡跳出了東西！', 1.6); }
    else L.toast('洞裡只有一根胡蘿蔔……', 1.2);
    if (it.n >= 5) esDone(it, '兔子洞掏空了');
    L.hintReset();
  }
}
function esTick(dt) {
  const room = L.room, p = L.p; if (!room || L.state() !== 'play' || !ES || !ES.live || room.kind !== 'combat') return;
  for (const it of room.items) {
    if (it.kind === 'tfac' && it.fk === 'garden' && it.st === 'ready') {
      if (Math.hypot(p.x - it.x, p.y - it.y) < 150) it.t += dt; else it.t = Math.max(0, it.t - dt * 2);
      if (it.t >= 6) { esDone(it, ''); const r = L.rand(); L.sfx('clear'); if (r < 0.4) { L.healP(1); p.coins += 8; L.toast('花開了：燈火 +1、燈芯 +8', 2.8); } else if (r < 0.8) { p.skillCd = 0; const u = L.rewardUpgrade(); L.toast('春風吹過：技能冷卻重置、強化「' + L.UPGN(u) + '」', 3); } else { p.coins += 15; L.toast('花叢下藏著彩蛋：燈芯 +15', 2.4); } L.hintReset(); }
      continue;
    }
    if (it.kind !== 'tfac' || it.st !== 'busy' || !it.mobs) continue;
    if (it.mobs.every(e => e.dead)) { const w = L.makeItem('weapon', it.x, it.y + 60, 'prop'); room.items.push(w); L.dropCoins(it.x, it.y + 20, 10); L.sfx('clear'); esDone(it, '顏料乾了：工坊裡留下一把武器'); }
  }
}
function esInfo(it) {
  const d = { basket: it.st === 'done' ? '彩蛋已全部孵開' : '每顆蛋 4 燈芯（共 3 顆）：燈芯、燈油或強化；孵滿 3 顆得燈火 +1 與精良強化。已孵 ' + it.n + ' / 3', paint: it.st === 'done' ? '工坊已安靜' : '按 F 打翻顏料：巨大的彩繪羊與 4 隻小怪出現；全部打倒得一把武器與燈芯', burrow: it.st === 'done' ? '兔子洞已掏空' : '按 F 往洞裡伸手（最多 5 次）：燈芯、燈油，偶爾跑出怪', garden: it.st === 'done' ? '花已經開了' : '站在花園旁（150 像素內）等 6 秒，離開會倒退。結局：回血加燈芯／技能冷卻重置加強化／燈芯 +15' };
  return { name: ES_NAME[it.fk] + (it.st === 'done' ? '（已結束）' : ''), desc: d[it.fk] || '' };
}
const esHint = it => (it.st === 'ready' ? (it.fk === 'garden' ? '站進花園（' + Math.floor(Math.min(6, it.t)) + ' / 6）' : it.fk === 'basket' ? 'F 孵蛋（4 燈芯，' + it.n + ' / 3）' : it.fk === 'paint' ? 'F 打翻顏料' : 'F 伸手進洞（' + it.n + ' / 5）') : '');
function esDraw(it) {
  const c = L.ctx, tm = L.time, done = it.st === 'done'; c.save(); c.translate(it.x, it.y); if (done) c.globalAlpha = 0.55;
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 26, 44, 10, 0, 0, TAU); c.fill();
  if (it.fk === 'basket') {
    c.fillStyle = '#8a5a2a'; c.beginPath(); c.ellipse(0, 12, 46, 22, 0, 0, TAU); c.fill(); c.fillStyle = '#a8743a'; c.beginPath(); c.ellipse(0, 8, 42, 18, 0, 0, TAU); c.fill(); const cols = [PNK, YEL, '#7ad0f0'];
    for (let k = 0; k < 3; k++) { const open = done || k < it.n; c.fillStyle = cols[k]; c.beginPath(); c.ellipse(-22 + k * 22, -6 - (open ? 8 : 0), 11, 14, 0, 0, TAU); c.fill(); if (open) { c.fillStyle = '#fff'; star4(c, -22 + k * 22, -34 + Math.sin(tm * 4) * 2, 6, tm); } }
  } else if (it.fk === 'paint') {
    c.fillStyle = '#7a4a2a'; rrect(c, -34, -10, 68, 36, 4); for (let k = 0; k < 3; k++) { c.fillStyle = [PNK, YEL, '#7ad0f0'][k]; rrect(c, -30 + k * 22, -22, 16, 16, 3); } c.fillStyle = '#fff'; c.beginPath(); c.ellipse(0, -40, 14, 18, 0, 0, TAU); c.fill(); c.fillStyle = PNK; c.fillRect(-14, -44, 28, 6);
  } else if (it.fk === 'burrow') {
    c.fillStyle = '#5aa84a'; c.beginPath(); c.ellipse(0, 6, 54, 30, 0, Math.PI, TAU); c.fill(); c.fillStyle = '#2a1a10'; c.beginPath(); c.ellipse(0, 12, 30, 20, 0, 0, TAU); c.fill(); c.fillStyle = '#ff9a3a'; poly(c, [[34, 4], [46, -16], [52, 6]]); c.fillStyle = '#4aa84a'; c.fillRect(42, -24, 3, 10); c.fillRect(47, -22, 3, 8);
  } else {
    for (let k = 0; k < 7; k++) { const x = -42 + k * 14, y = 8 + Math.sin(k * 2) * 8; c.fillStyle = '#4aa84a'; c.fillRect(x, y, 3, 22); c.fillStyle = [PNK, YEL, '#fff', '#c8a0ff'][k % 4]; const bl = done || it.t > 2 ? 9 : 5; circ(c, x + 1, y - 2 + Math.sin(tm * 3 + k) * 1.5, bl); }
  }
  c.restore();
}
function esBack() {
  const room = L.room, c = L.ctx, tm = L.time; if (!room) return;
  if (room.kind === 'boss') {
    const w = L.enemies.find(q => q.type === 'boss' && !q.dead && q.xk === 'xeegg');
    if (w && w.tl && w.tl.act === 'charge') { const p = L.p; c.save(); c.strokeStyle = 'rgba(255,90,160,' + (0.35 + 0.3 * Math.sin(tm * 16)) + ')'; c.lineWidth = 8; c.setLineDash([14, 10]); c.beginPath(); c.moveTo(w.x, w.y); c.lineTo(p.x, p.y); c.stroke(); c.restore(); }
    return;
  }
  if (!ES || !ES.live || room.kind !== 'combat') return;
  for (const s of ES.slots) if (s.fk === 'market') {
    c.save(); c.translate(s.x, s.y - 52); c.fillStyle = '#5a3a1a'; c.fillRect(-250, -6, 500, 8); for (let i = 0; i < 10; i++) { c.fillStyle = [PNK, YEL, '#7ad0f0', '#c8a0ff'][i % 4]; c.beginPath(); c.moveTo(-250 + i * 50, 2); c.lineTo(-200 + i * 50, 2); c.lineTo(-225 + i * 50, 24); c.fill(); }
    c.fillStyle = '#a02a6a'; c.font = '700 15px sans-serif'; c.textAlign = 'center'; c.fillText('彩蛋市集', 0, -14); c.restore();
  }
}
const ES_BOSS = { xebunny: { name: '彩蛋兔', hp: 285 }, xehen: { name: '雞媽媽', hp: 255 }, xeegg: { name: '巨型彩蛋', hp: 360 } };
function esBossDef(fin) {
  const r = L.run, t = L.th(); r.hwOrd = r.hwOrd || {}; const ord = r.hwOrd[t] = r.hwOrd[t] || L.shuffle(['xebunny', 'xehen', 'xeegg']);
  const same = r.themes[0] === r.themes[1], k = ord[same ? r.layer % 3 : (r.layer & 1)], B = ES_BOSS[k]; return { kind: 'golem', name: B.name, hp: Math.round(B.hp * (fin ? 1.3 : 1)), ext: true, xk: k };
}
function esHit(e, dmg) {
  if (e.type !== 'boss') return dmg;
  if (e.bleedNow) return dmg;
  if (e.xk === 'xehen') { const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'chick' && q.spawn <= 0).length; if (n >= 4) { if (L.time - (e.armTip || -99) > 8) { e.armTip = L.time; L.toast('小雞們圍著媽媽——先清掉小雞，Boss 才會吃傷害', 2.2); } return dmg * 0.3; } }
  if (e.xk === 'xeegg') { if (e.open && L.time < e.open) return dmg * 2; return dmg * 0.55; }
  return dmg;
}
function esMoves(e, phase, ang) {
  const p = L.p, aim = () => Math.atan2(p.y - e.y, p.x - e.x), alive = L.enemies.filter(q => !q.dead && q.type !== 'boss').length;
  const pools = {
    xebunny: phase === 1 ? ['eggs', 'ring', 'carrot'] : phase === 2 ? ['eggs', 'ring', 'carrot', 'hop'] : ['eggs', 'carrot', 'hop', 'petal', 'ring'],
    xehen: phase === 1 ? ['hatch', 'peck'] : phase === 2 ? ['hatch', 'cluck', 'peck'] : ['hatch', 'cluck', 'flock', 'peck'],
    xeegg: phase === 1 ? ['roll', 'chicks'] : phase === 2 ? ['roll', 'chicks', 'shards'] : ['roll', 'chicks', 'shards', 'quake']
  };
  const a = pickOf(pools[e.xk] || pools.xebunny), R = L.ROOM;
  const mk = (n, ty) => { if (alive < 11) for (let i = 0; i < n; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy(ty || 'crawler', sp.x, sp.y); m.sleep = false; m.noRez = true; m.spawn = 0.8; } };
  if (a === 'eggs') { for (let w = 0; w < 3; w++) L.later(w * 0.45, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.22, 180, false, 9); L.sfx('hit'); }); L.toast('彩蛋扇！', 1.1); }
  else if (a === 'ring') { const n = 14, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 135, false, 8); L.later(0.8, () => { if (e.dead) return; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + (i + 0.5) / n * TAU, 160, false, 8); }); L.toast('花圈！', 1.2); }
  else if (a === 'carrot') { const off = rand() * TAU; for (let i = 0; i < 30; i++) L.later(i * 0.09, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, e.x, e.y, off + i * 0.42, 185, false, 7); }); L.toast('胡蘿蔔旋風！', 1.2); }
  else if (a === 'hop') { L.toast('大跳躍——看缺口！', 1.8); const gap = R.y + 80 + rand() * (R.h - 160); for (let i = 0; i < 16; i++) { const yy = R.y + 20 + i * ((R.h - 40) / 15); if (Math.abs(yy - gap) < 70) continue; L.later(0.5, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, R.x + 10, yy, 0, 240, false, 8); }); } }
  else if (a === 'petal') { L.toast('花瓣雨！', 1.2); for (let i = 0; i < 14; i++) L.later(i * 0.16, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, R.x + rand() * R.w, R.y + 10, Math.PI / 2 + (rand() - 0.5) * 0.3, 200, false, 8); }); }
  else if (a === 'hatch') { mk(phase === 3 ? 5 : 4); L.toast('蛋孵開了！小雞列隊！', 1.4); }
  else if (a === 'cluck') { L.toast('咕咕叫——小雞衝鋒！', 1.8); for (const q of L.enemies) if (!q.dead && q.type !== 'boss' && !q.rally) { q.rally = true; q.spd *= 1.5; L.later(3.2, () => { q.spd /= 1.5; q.rally = false; }); } }
  else if (a === 'flock') { if (alive < 14) for (let i = 0; i < 8; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy('crawler', sp.x, sp.y); m.sleep = false; m.noRez = true; m.spawn = 0.8; } L.toast('整窩出動！', 1.6); }
  else if (a === 'peck') { for (let w = 0; w < 2; w++) L.later(w * 0.5, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.2, 205, false, 7); }); L.toast('啄米彈！', 1.1); }
  else if (a === 'roll') { e.tl = { t: 0.9, act: 'charge', ang: aim() }; e.open = L.time + 4.2; e.openOff = false; L.toast('彩蛋滾動——撞完後蛋殼裂開 3 秒是弱點，傷害 ×2！', 2.6); }
  else if (a === 'chicks') { mk(3); L.toast('小雞破殼！', 1.4); }
  else if (a === 'shards') { for (let w = 0; w < 2; w++) L.later(w * 0.6, () => { if (e.dead || L.state() !== 'play') return; const n = 16, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 150, false, 8); }); L.toast('蛋殼碎片！', 1.2); }
  else { L.toast('巨蛋重壓！', 1.4); e.open = L.time + 3.4; e.openOff = false; for (let k = 0; k < 7; k++) { const aa = k / 7 * TAU, d = 130 + (k % 2) * 90; L.markStrike(e, e.x + Math.cos(aa) * d, e.y + Math.sin(aa) * d, 56, 1.1, {}); } }
}
function drawEsBoss(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 2) * 4, ol = '#2a1810', W = '#f4f0f4';
  if (e.xk === 'xebunny') {
    c.fillStyle = 'rgba(242,160,200,.16)'; circ(c, 0, b, 105); c.fillStyle = ol; rrect(c, -36, -118 + b, 26, 74, 12); rrect(c, 10, -118 + b, 26, 74, 12); circ(c, 0, 20 + b, 66); c.fillStyle = fl ? C.paper : W; rrect(c, -33, -114 + b, 20, 68, 10); rrect(c, 13, -114 + b, 20, 68, 10); circ(c, 0, 20 + b, 61);
    c.fillStyle = PNK; rrect(c, -29, -104 + b, 12, 48, 6); rrect(c, 17, -104 + b, 12, 48, 6); c.fillStyle = ol; circ(c, -20, 8 + b, 5); circ(c, 20, 8 + b, 5); c.fillStyle = PNK; circ(c, 0, 22 + b, 6); c.strokeStyle = ol; c.lineWidth = 3; c.beginPath(); c.arc(-9, 30 + b, 9, 0.1, Math.PI - 0.1); c.arc(9, 30 + b, 9, 0.1, Math.PI - 0.1); c.stroke();
    c.fillStyle = '#7ad0f0'; c.beginPath(); c.ellipse(0, 70 + b, 24, 18, 0, 0, TAU); c.fill(); c.fillStyle = YEL; c.fillRect(-22, 66 + b, 44, 5);
  } else if (e.xk === 'xehen') {
    const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'chick' && q.spawn <= 0).length;
    if (n >= 4) { c.strokeStyle = 'rgba(255,230,120,' + (0.55 + 0.2 * Math.sin(t * 8)) + ')'; c.lineWidth = 6; c.beginPath(); c.arc(0, b, 92, 0, TAU); c.stroke(); }
    c.fillStyle = ol; c.beginPath(); c.ellipse(0, 20 + b, 78, 66, 0, 0, TAU); c.fill(); circ(c, 28, -40 + b, 36); c.fillStyle = fl ? C.paper : '#fff4e0'; c.beginPath(); c.ellipse(0, 20 + b, 73, 61, 0, 0, TAU); c.fill(); circ(c, 28, -40 + b, 32);
    c.fillStyle = '#e03a3a'; circ(c, 14, -76 + b, 12); circ(c, 32, -80 + b, 12); circ(c, 50, -74 + b, 10); c.fillStyle = '#ff9a3a'; poly(c, [[56, -44 + b], [86, -36 + b], [56, -28 + b]]); c.fillStyle = ol; circ(c, 38, -48 + b, 4);
    c.strokeStyle = 'rgba(214,170,110,.9)'; c.lineWidth = 4; c.beginPath(); c.arc(-14, 28 + b, 34, 0.2, Math.PI - 0.2); c.stroke(); c.fillStyle = YEL; for (let k = 0; k < 3; k++) circ(c, -34 + k * 20, 56 + b, 8);
  } else {
    const open = e.open && L.time < e.open; c.fillStyle = open ? 'rgba(255,230,120,.22)' : 'rgba(242,160,200,.14)'; circ(c, 0, b, 112);
    c.fillStyle = ol; c.beginPath(); c.ellipse(0, 0 + b, 74, 92, 0, 0, TAU); c.fill(); c.fillStyle = fl ? C.paper : PNK; c.beginPath(); c.ellipse(0, 0 + b, 70, 88, 0, 0, TAU); c.fill();
    c.fillStyle = '#7ad0f0'; c.fillRect(-66, -24 + b, 132, 18); c.fillStyle = YEL; for (let k = -2; k <= 2; k++) circ(c, k * 24, 34 + b, 7); c.fillStyle = '#c8a0ff'; for (let k = -1; k <= 1; k++) poly(c, [[k * 30 - 8, -60 + b], [k * 30, -74 + b], [k * 30 + 8, -60 + b]]);
    c.strokeStyle = ol; c.lineWidth = open ? 5 : 3; c.beginPath(); c.moveTo(-70, 8 + b); for (let k = 0; k < 8; k++) c.lineTo(-70 + (k + 1) * 17.5, 8 + b + (k % 2 ? -12 : 12)); c.stroke(); if (open) { c.fillStyle = YEL; circ(c, 0, 0 + b, 24); c.fillStyle = ol; circ(c, -8, -4 + b, 3); circ(c, 8, -4 + b, 3); }
  }
}
const ES_EVENTS = {
  hunt: {
    toast: '尋蛋：花 3 燈芯，翻開一個草叢', setup: (room, cx, cy) => xAdd(room, cx, cy, 'hunt'),
    info: it => ({ name: '草叢尋蛋', desc: it.used ? '草叢翻過了' : '花 3 燈芯翻開草叢：50% 強化、30% 燈芯 +8、20% 只有一朵花（燈芯 +1）；只能一次' }),
    hint: it => it.used ? '' : 'F 翻草叢（3 燈芯）',
    use(it) { if (it.used) return; if (L.p.coins < 3) { L.toast('燈芯不夠'); L.sfx('tick'); return; } L.p.coins -= 3; it.used = true; const r = L.rand(); L.sfx('buy'); if (r < 0.5) { const u = L.rewardUpgrade(); L.toast('找到彩蛋：強化「' + L.UPGN(u) + '」', 2.8); } else if (r < 0.8) { L.p.coins += 8; L.toast('草叢裡有燈芯 +8', 2.2); } else { L.p.coins += 1; L.toast('只有一朵小花……燈芯 +1', 2.2); } },
    draw: it => xProp(it, '#3a8a3a', '蛋', it.used)
  },
  bloom: {
    toast: '春之花環：站在花環旁等 5 秒', setup: (room, cx, cy) => xAdd(room, cx, cy, 'bloom', { t: 0 }),
    info: it => ({ name: '春之花環', desc: it.used ? '花已經開過了' : '站在花環旁邊（150 像素內）等 5 秒，離開會倒退。完成：燈火 +1、燈芯 +10' }),
    hint: it => it.used ? '' : '靠近花環（' + Math.floor(Math.min(5, it.t)) + ' / 5）',
    use() { },
    tick(dt, room) { const it = room.items.find(q => q.kind === 'xev' && q.id === 'bloom'); if (!it || it.used) return; const p = L.p; if (Math.hypot(p.x - it.x, p.y - it.y) < 150) it.t += dt; else it.t = Math.max(0, it.t - dt * 2); if (it.t >= 5) { it.used = true; L.healP(1); p.coins += 10; L.sfx('clear'); L.toast('花香暖暖的：燈火 +1、燈芯 +10', 2.8); L.hintReset(); } },
    draw: it => { const c = L.ctx; c.save(); c.translate(it.x, it.y); if (it.used) c.globalAlpha = 0.5; c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 22, 40, 9, 0, 0, TAU); c.fill(); c.strokeStyle = '#4aa84a'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 26, 0, TAU); c.stroke(); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; c.fillStyle = [PNK, YEL, '#fff', '#c8a0ff'][k % 4]; circ(c, Math.cos(a) * 26, Math.sin(a) * 26, 6 + Math.sin(L.time * 3 + k) * 1.2); } c.restore(); }
  },
  picnic: {
    toast: '野餐墊：花 6 燈芯，吃一頓點心', setup: (room, cx, cy) => xAdd(room, cx, cy, 'picnic'),
    info: it => ({ name: '野餐墊', desc: it.used ? '點心吃完了' : '花 6 燈芯：燈火 +2、技能冷卻重置；只能一次' }),
    hint: it => it.used ? '' : 'F 野餐（6 燈芯）',
    use(it) { if (it.used) return; if (L.p.coins < 6) { L.toast('燈芯不夠'); L.sfx('tick'); return; } L.p.coins -= 6; it.used = true; L.healP(2); L.p.skillCd = 0; L.sfx('buy'); L.toast('野餐：燈火 +2、技能冷卻重置', 2.6); },
    draw: it => xProp(it, '#c8508a', '餐', it.used)
  }
};
function esBossAch() { try { const k = L.bossDef().xk; if (k === 'xebunny') L.unlockAch('ezBunny'); else if (k === 'xehen') L.unlockAch('ezHen'); else if (k === 'xeegg') L.unlockAch('ezEgg'); } catch (e) { /* optional */ } }
L.registerWorld({
  theme: 21, name: '復活節', pool: 'dlc', opt: '復活節（DLC5）', pal: PAL21, bigMap: true, ownStory: true, noDark: true, noPaper: true,
  amb: ['bandpass', 1800, 1.1, 0.004], ev: r => { const n = [659, 784, 988, 1175][Math.floor(r() * 4)]; L.blip(n, n * 1.003, 0.5, 'sine', 0.008); },
  skin: { map: ES_SKIN, draw: drawEsEnemy, hue: false }, bg: esBg, obsDraw: esObsDraw, obs: esObs, roomInit: esInit, tick: esTick, back: esBack,
  drawItem: esDraw, info: esInfo, hint: esHint, useItem: esUse, shards: ES_SHARDS, hitMod: esHit,
  arrows: edge => { const room = L.room; if (!room || room.kind !== 'combat' || !ES || !ES.live) return; for (const it of room.items) if (it.kind === 'tfac' && it.st === 'ready' && !it.taken) edge(it.x, it.y, '#ff9ac8', false); for (const s of ES.slots) if (s.fk === 'market') edge(s.x, s.y, '#ffe27a', false); },
  mini: (mx, my, sc) => {
    const room = L.room, c = L.ctx, R = L.ROOM; if (!room || room.kind !== 'combat' || !ES || !ES.live) return; c.save(); c.textAlign = 'center'; c.font = '700 9px sans-serif';
    for (const s of ES.slots) { const x = mx + (s.x - R.x) * sc, y = my + (s.y - R.y) * sc; if (s.fk === 'market') { c.fillStyle = '#ffe27a'; c.fillText('市', x, y + 3); } }
    for (const it of room.items) if (it.kind === 'tfac') { const x = mx + (it.x - R.x) * sc, y = my + (it.y - R.y) * sc; c.fillStyle = it.st === 'done' ? 'rgba(180,180,180,.6)' : '#ff9ac8'; c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x + 3.5, y); c.lineTo(x, y + 4); c.lineTo(x - 3.5, y); c.fill(); }
    c.restore();
  },
  enemies: { hen: { hp: 7, r: 15, name: '母雞', cost: 3, cap: 3, ai: henAi }, butterfly: { hp: 8, r: 14, name: '蝴蝶', cost: 3, cap: 3, ai: bflyAi } },
  types: (types, L0, ci) => { types.length = 0; types.push('crawler', 'crawler', 'shooter', 'hen'); if (L0 > 0) types.push('butterfly', 'brute', 'crawler', 'bomber'); if (L0 >= 2) types.push('hen', 'butterfly', 'shooter', 'brute'); if (L0 >= 3) types.push('brute', 'brute', 'butterfly', 'shooter', 'bomber'); },
  extra: () => [],
  boss: fin => esBossDef(fin), boss2: esMoves, drawBoss: drawEsBoss,
  intro: def => (def.xk === 'xebunny'
    ? [{ who: '旁白', text: '花叢裡一對長耳朵緩緩升起，後面是比樹還高的白色身影。' }, { who: '彩蛋兔', text: '我把春天藏好了……你找得到，就拿去吧！' }]
    : def.xk === 'xehen'
      ? [{ who: '旁白', text: '稻草窩裡，一隻巨大的母雞站了起來，腳邊擠滿了毛茸茸的小雞。' }, { who: '雞媽媽', text: '咕咕！誰都不准碰我的孩子！' }, { who: '旁白', text: '只要小雞還圍著，雞媽媽就不怕傷害。' }]
      : [{ who: '旁白', text: '草地中央，一顆粉紅色的巨蛋靜靜立著，蛋殼上有一道細細的裂痕。' }, { who: '巨型彩蛋', text: '咚……咚……裡面的人，等了好久，好久。' }, { who: '旁白', text: '蛋殼裂開的瞬間，是最脆弱的時候。' }]),
  onKill: e => {
    swarmBleed(e, 'xehen', 'chick');
    if (e.skin === 'chick' && L.enemies.some(q => !q.dead && q.type === 'boss' && q.xk === 'xehen')) { const o = L.rand() * TAU; for (let i = 0; i < 4; i++) L.enemyShot(e, o + i * TAU / 4, 120); }
  },
  events: ES_EVENTS,
  weapons: {
    carrotblade: { id: 'carrotblade', name: '胡蘿蔔劍', tag: '近戰', mode: 'tap', cd: 0.45, th: 21, col: '#ff9a3a', range: 135, half: 1.3, dmg: 3.7, kb: 340, desc: '大範圍的弧形揮砍（復活節專屬，類似提燈刃）' },
    eggcannon: { id: 'eggcannon', name: '彩蛋砲', tag: '單發', mode: 'tap', cd: 0.38, th: 21, col: PNK, desc: '單發的彩蛋，傷害高（復活節專屬，類似燈焰杖）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 560, 9, 3.9 * dm, 'flame', 1.0); L.sfx('flame'); } },
    petalbow: { id: 'petalbow', name: '花瓣弓', tag: '連射', mode: 'auto', cd: 0.11, th: 21, col: '#ff8ac0', desc: '按住連射花瓣，射速快（復活節專屬，類似螢火弓）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang + (rand() - 0.5) * 0.07, 720, 4, 1.15 * dm, 'pellet', 0.8); L.sfx('tick'); } },
    bloomshot: { id: 'bloomshot', name: '花束散彈', tag: '散射', mode: 'tap', cd: 0.62, th: 21, col: '#c8a0ff', desc: '五發花朵散射，近距離很痛（復活節專屬，類似霰光杖）',
      fire: (ox, oy, ang, dm) => { for (let i = -2; i <= 2; i++) L.shoot(ox, oy, ang + i * 0.16, 520, 6, 1.9 * dm, 'pellet', 0.55); L.sfx('blade'); } },
    carrotspear: { id: 'carrotspear', name: '蘿蔔長矛', tag: '貫穿', mode: 'tap', cd: 0.75, th: 21, col: '#ff9a3a', desc: '貫穿一整排敵人的長矛（復活節專屬，類似穿光矛）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 700, 8, 4.6 * dm, 'lance', 0.95, true); L.sfx('blade'); } }
  },
  ach: [
    { id: 'ezBunny', name: '找到春天', desc: '復活節：擊敗彩蛋兔' },
    { id: 'ezHen', name: '護子心切', desc: '復活節：擊敗雞媽媽' },
    { id: 'ezEgg', name: '敲開蛋殼', desc: '復活節：擊敗巨型彩蛋' },
    { id: 'ezFac', name: '春日小幫手', desc: '復活節：同一局完成彩蛋籃與彩繪工坊' }
  ],
  onMid: () => { if (L.th() === 21) esBossAch(); },
  onFinal: () => { if (L.th() === 21) esBossAch(); },
  outro: () => [{ who: '彩蛋兔', text: '你找到了所有的蛋，也找到了春天。' }, { who: '旁白', text: '風停了，花在你的燈光裡輕輕搖，天亮得比平常更早一些。' }]
});
})();
