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
  const zs = L.shuffle([0, 3, 5]), a = zc(zs[0]), b = zc(zs[1]), al = zc(4);
  HW = { R: { x: R.x, y: R.y, w: R.w, h: R.h }, live: false, slots: [{ fk: 'market', x: R.x + R.w - 340, y: R.y + 170 }, { fk: 'altar', x: al.x, y: al.y + 20 }, { fk: 'grave', x: a.x + rr(-90, 90), y: a.y + rr(-60, 60) }, { fk: 'patch', x: b.x + rr(-90, 90), y: b.y + rr(-60, 60) }] };
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
    } else room.items.push({ kind: 'tfac', id: 'tfac', fk: s.fk, x: s.x, y: s.y, group: 'prop', price: 0, taken: false, st: 'ready', t: rand() * 6, n: 0 });
  }
  if (!r.hwDarkTip) { r.hwDarkTip = true; L.later(4.5, () => { if (L.room === room) L.toast('萬聖節：視野有限——靠近南瓜燈，或讓你的燈亮一點', 3); }); }
}
const HW_NAME = { altar: '召喚祭壇', grave: '墓園夜襲', patch: '南瓜田' };
function hwDone(it, msg) { it.st = 'done'; const r = L.run; r.hwFac = r.hwFac || {}; r.hwFac[it.fk] = 1; if (r.hwFac.altar && r.hwFac.grave) L.unlockAch('hwFac'); if (msg) L.toast(msg, 3); L.hintReset(); }
function hwUse(it) {
  const p = L.p, room = L.room;
  if (it.st === 'done') { L.toast('這裡已經結束了', 1.4); return; }
  if (it.st === 'busy') { L.toast('進行中……', 1.2); return; }
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
    if (it.kind !== 'tfac' || it.st !== 'busy' || !it.mobs) continue;
    if (it.mobs.every(e => e.dead)) {
      if (it.fk === 'altar') { const u = L.premUpgrade(); L.dropCoins(it.x, it.y + 40, 10); L.sfx('clear'); hwDone(it, '祭壇平息了：精良強化「' + L.UPGN(u) + '」'); }
      else if (it.fk === 'grave') { const w = L.makeItem('weapon', it.x, it.y + 60, 'prop'); room.items.push(w); L.dropCoins(it.x, it.y + 20, 10); L.sfx('clear'); hwDone(it, '骷髏安息了：墓碑下留下一把武器'); }
    }
  }
}
function hwInfo(it) {
  const d = { altar: it.st === 'done' ? '祭壇已經平息' : '按 F 召喚一隻巨大的南瓜怪和 4 隻小怪；全部打倒得精良強化與燈芯', grave: it.st === 'done' ? '骷髏已經安息' : '按 F 喚醒 6 隻骷髏；全部打倒得一把武器與燈芯', patch: it.st === 'done' ? '南瓜田已收成' : '按 F 敲開一顆南瓜（最多 5 顆）：燈芯、燈油，偶爾跑出怪' };
  return { name: HW_NAME[it.fk] + (it.st === 'done' ? '（已結束）' : ''), desc: d[it.fk] || '' };
}
const hwHint = it => (it.st === 'ready' ? (it.fk === 'altar' ? 'F 召喚' : it.fk === 'grave' ? 'F 喚醒骷髏' : 'F 敲南瓜（' + it.n + ' / 5）') : '');
function hwDraw(it) {
  const c = L.ctx, tm = L.time, done = it.st === 'done'; c.save(); c.translate(it.x, it.y); if (done) c.globalAlpha = 0.5;
  c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(0, 26, 40, 10, 0, 0, TAU); c.fill();
  if (it.fk === 'altar') {
    c.fillStyle = '#2a1830'; c.beginPath(); c.ellipse(0, 12, 50, 18, 0, 0, TAU); c.fill(); c.fillStyle = '#4b2f6a'; rrect(c, -26, -12, 52, 28, 5); c.fillStyle = it.st === 'busy' ? '#ff6a3a' : '#a46bff'; star4(c, 0, -26, 12 + Math.sin(tm * 4) * 2, tm * 2); c.fillStyle = ORG; circ(c, -18, -18, 7); circ(c, 18, -18, 7);
  } else if (it.fk === 'grave') {
    c.fillStyle = '#3a2a22'; c.beginPath(); c.ellipse(0, 16, 42, 14, 0, 0, TAU); c.fill(); c.fillStyle = '#7d7890'; rrect(c, -20, -26, 40, 46, 14); c.strokeStyle = '#4a4560'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -16); c.lineTo(0, 4); c.moveTo(-8, -8); c.lineTo(8, -8); c.stroke();
    if (it.st === 'ready') { c.fillStyle = BONE; rrect(c, 22, 6 + Math.sin(tm * 3) * 2, 5, 14, 2); rrect(c, 28, 8 + Math.sin(tm * 3) * 2, 4, 12, 2); }
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
  hwking: { name: '南瓜燈幽靈王', hp: 190 },
  hwcap: { name: '骷髏軍團長', hp: 170 },
  hwwolf: { name: '狼人', hp: 240 }
};
function hwBossKind(fin) {
  const r = L.run, t = L.th(); r.hwOrd = r.hwOrd || {}; const ord = r.hwOrd[t] = r.hwOrd[t] || L.shuffle(['hwking', 'hwcap', 'hwwolf']);
  const same = r.themes[0] === r.themes[1], idx = same ? r.layer % 3 : (r.layer & 1); return ord[idx];
}
function hwBossDef(fin) { const k = hwBossKind(fin), B = HW_BOSS[k]; return { kind: 'golem', name: B.name, hp: Math.round(B.hp * (fin ? 1.3 : 1)), ext: true, xk: k }; }
function hwHit(e, dmg) {
  if (e.type !== 'boss') return dmg;
  if (e.xk === 'hwwolf') e.hwHit = L.time;
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
  types: (types, L0, ci) => { types.length = 0; types.push('crawler', 'crawler', 'shooter', 'bat'); if (L0 > 0) types.push('ghost', 'brute', 'crawler'); if (L0 >= 2) types.push('bat', 'ghost', 'brute'); },
  extra: () => [],
  boss: fin => hwBossDef(fin), boss2: hwMoves, drawBoss: drawHwBoss,
  intro: def => (def.xk === 'hwking'
    ? [{ who: '旁白', text: '鬼屋的大門無聲地打開。巨大的南瓜頭在黑暗裡亮起，裹著床單的影子飄了過來。' }, { who: '南瓜燈幽靈王', text: '你終於來了！我準備了一整年的鬼火，快——接好它們！' }]
    : def.xk === 'hwcap'
      ? [{ who: '旁白', text: '墓地的地面隆起，一排排骷髏從土裡站起，整齊地轉向你。' }, { who: '骷髏軍團長', text: '全軍聽令——今晚，沒有人可以過這座橋！' }, { who: '旁白', text: '只要骷髏還站著，軍團長就不怕任何攻擊。' }]
      : [{ who: '旁白', text: '雲被風推開，滿月露了出來。山丘上，有什麼東西慢慢站起身。' }, { who: '狼人', text: '月亮……真亮。你的燈，也很亮。可惜，我今晚不想被照著。' }, { who: '旁白', text: '牠在月光下會回血——不要給牠喘息的機會。' }]),
  onKill: e => {
    const r = L.run;
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
})();
