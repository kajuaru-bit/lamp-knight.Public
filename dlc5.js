/* 《燈火騎士》DLC8「暗影巢穴」：暗影巢穴（26）— 無盡玩法。
   獨立檔案，選到「暗影巢穴」才下載（需先載入 dlc.js、dlc2.js、dlc3.js、dlc4.js）。
   玩法：一層接一層往深處走，沒有終點。每層（一間大戰鬥房，多波）輪流面對各世界的影子：
   雙數波用「主區域」、單數波用「副區域」，第 10 層以後兩區混在同一波。越深敵人越多、越強，燈光越暗。
   每 3 層有一隻「最終 Boss」，其餘層是縮小血量的同一批 Boss（9 隻基礎最終 Boss 輪流）。
   新敵人：凍人扇影（凍結扇形彈）、黏人扇影（黏附扇形彈）；偷燈芯的跳蛙與跳蛙血量 ×2。 */
(function () {
'use strict';
const L = window.LK;
if (!L || L.THEMES[26] || !L.THEMES[13] || !L.THEMES[16] || !L.THEMES[25]) return;
const { TAU, circ, rr, pickOf, clamp, rand } = L;

/* ---------- 區域與敵人池：[代號, 最低有效深度] ---------- */
const ZONES = [
  { n: '深海', es: [['blindbomb', 0], ['bloater', 0], ['blindshark', 1], ['abyss', 2]] },
  { n: '火山', es: [['lavaslime', 0], ['firebat', 0], ['sparker', 1], ['fireelem', 1], ['lavaworm', 1], ['flion', 1]] },
  { n: '夢境', es: [['sleepwalker', 0], ['ghost', 0], ['rusher', 0], ['mirrorman', 1], ['faceless', 1]] },
  { n: '詛咒沼澤', es: [['spore', 0], ['wisp', 0], ['jumper', 0]] },
  { n: '沙漠', es: [['duster', 0], ['mummy', 0], ['bandit', 0]] },
  { n: '糖果', es: [['syrup', 0], ['roller', 0]] },
  { n: '電玩未來', es: [['glitch', 0], ['laser', 0]] },
  { n: '彼岸', es: [['fanshade', 0], ['dartshade', 0], ['flameshade', 1]] },
  { n: '希臘', es: [['centaur', 0], ['cyclops', 2]] }
];
const NATIVE = [['frostfan', 0], ['stickfan', 0], ['thiefrog', 1]]; // 巢穴原生：每波都可能出現
const CHEAP = ['lavaslime', 'firebat', 'spore', 'duster', 'sleepwalker', 'rusher'];
const DARK = ['blindbomb', 'abyss']; // 致盲／吸光：同一波最多一種
const SHADE = ['fanshade', 'dartshade', 'flameshade'];
let cur = [0, 0]; // 目前這一波用到的區域（給 extra 用）

const ord = () => { const r = L.run; r.lairZ = r.lairZ || L.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]); return r.lairZ; };
function zonesNow() {
  const r = L.run, room = L.room, d = r.layer, w = room ? Math.max(0, room.wave) : 0, o = ord();
  const a = o[d % 9], b = o[(d + 4) % 9];
  if (d >= 9) return [a, b];
  return [w % 2 === 0 ? a : b];
}

/* ---------- 新敵人 AI ---------- */
// 凍人扇影：繞著你轉圈（站位在側面、距離約 300），蓄力後打出「兩層交錯」的冰針扇（3 + 4 發），命中凍結
function frostAi(e, dt, nx, ny, d) {
  const p = L.p; e.cd = (e.cd === undefined ? 1.5 : e.cd) - dt;
  const want = d < 250 ? -1 : d > 360 ? 1 : 0, v = 62 * e.spd, sw = 44 * Math.sin(e.t * 0.8 + e.seed);
  if (e.tele > 0) {
    e.tele -= dt;
    if (e.tele <= 0) {
      const a0 = Math.atan2(p.y - e.y, p.x - e.x), fan = { hit: false, t0: L.run.t, done: false }; (L.room.fans = L.room.fans || []).push(fan);
      const row = (n, off, sp, delay) => L.later(delay, () => {
        if (e.dead || L.state() !== 'play') return;
        for (let i = 0; i < n; i++) { const b = L.enemyShot(e, a0 + off + (i - (n - 1) / 2) * sp, 150); b.frz = true; b.fan = fan; b.r = 6; }
        L.sfx('hit');
      });
      row(3, 0, 0.3, 0); row(4, 0, 0.3, 0.38);
      e.cd = L.rr(2.6, 3.4) * e.fire;
    }
    return { mx: 0, my: 0, touch: 1 };
  }
  if (e.cd <= 0 && d < 560) e.tele = 0.6;
  return { mx: nx * want * v + (-ny) * sw, my: ny * want * v + nx * sw, touch: 1 };
}
// 黏人扇影：慢慢貼近到約 190，蓄力後噴出一大片寬扇（7 發、速度慢、彈比較大），命中黏附（像黏人愛心：移動變慢）
function stickAi(e, dt, nx, ny, d) {
  const p = L.p; e.cd = (e.cd === undefined ? 1.8 : e.cd) - dt;
  const want = d < 150 ? -1 : d > 210 ? 1 : 0, v = 54 * e.spd, sw = 18 * Math.sin(e.t * 1.2 + e.seed);
  if (e.tele > 0) {
    e.tele -= dt;
    if (e.tele <= 0) {
      const a0 = Math.atan2(p.y - e.y, p.x - e.x), fan = { hit: false, t0: L.run.t, done: false }; (L.room.fans = L.room.fans || []).push(fan);
      for (let i = 0; i < 7; i++) { const b = L.enemyShot(e, a0 + (i - 3) * 0.2, 112); b.cling = true; b.fan = fan; b.r = 7.5; }
      L.sfx('hit'); e.cd = L.rr(3.0, 3.8) * e.fire;
    }
    return { mx: 0, my: 0, touch: 1 };
  }
  if (e.cd <= 0 && d < 420) e.tele = 0.75;
  return { mx: nx * want * v + (-ny) * sw, my: ny * want * v + nx * sw, touch: 1 };
}

/* ---------- 繪圖 ---------- */
function drawLair(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, frost = e.skin === 'frostfan', tm = e.t;
  const col = frost ? '#8fd8ff' : '#ff8ac8', col2 = frost ? '#e8f8ff' : '#ffd0ea', dk = f ? '#ffffff' : '#1a1823';
  const fa = Math.atan2(L.p.y - e.y, L.p.x - e.x), bob = Math.sin(tm * 3 + e.seed) * 2;
  if (e.tele > 0) {
    c.save(); c.globalAlpha = 0.5; c.strokeStyle = col; c.lineWidth = 3; c.setLineDash([6, 6]);
    const sp = frost ? 0.45 : 0.6, n = frost ? 2 : 2;
    for (let k = -1; k <= 1; k += 2) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(fa + k * sp) * 300, Math.sin(fa + k * sp) * 300); c.stroke(); }
    c.restore();
  }
  c.fillStyle = dk; c.beginPath(); c.moveTo(-r, r); c.quadraticCurveTo(-r * 1.1, -r * 0.8, 0, -r * 1.1 + bob); c.quadraticCurveTo(r * 1.1, -r * 0.8, r, r);
  for (let i = 0; i < 4; i++) c.lineTo(r - (i + 0.5) * r * 0.5, r + (i & 1 ? -3 : 3)); c.closePath(); c.fill();
  c.fillStyle = f ? '#1a1823' : col; circ(c, -r * 0.3, -r * 0.1, r * 0.13); circ(c, r * 0.3, -r * 0.1, r * 0.13);
  // 扇子：冰晶扇（5 瓣）／黏液扇（7 瓣），朝向玩家，蓄力時張開
  const open = e.tele > 0 ? 1 : 0.55, petals = frost ? 5 : 7, spread = frost ? 1.0 : 1.5;
  c.save(); c.rotate(fa); c.translate(r * 0.7, 0);
  for (let i = 0; i < petals; i++) {
    const a = (i - (petals - 1) / 2) * (spread * open / (petals - 1));
    c.save(); c.rotate(a); c.fillStyle = i % 2 ? col2 : col; c.beginPath(); c.moveTo(0, 0); c.lineTo(r * 1.15, -r * 0.16); c.lineTo(r * 1.25, 0); c.lineTo(r * 1.15, r * 0.16); c.closePath(); c.fill(); c.restore();
  }
  c.fillStyle = dk; circ(c, 0, 0, r * 0.2); c.restore();
  if (!frost) { c.fillStyle = col; for (let k = 0; k < 3; k++) circ(c, -r * 0.6 + k * r * 0.6, r + 3 + Math.sin(tm * 4 + k) * 2, 2.4); }
}
function drawDispatch(e) {
  const t = e.type;
  if (SHADE.indexOf(t) >= 0) return L.THEMES[13].skin.draw(e);
  if (t === 'centaur' || t === 'cyclops') return L.THEMES[16].skin.draw(e);
  if (t === 'thiefrog') return L.THEMES[25].skin.draw(e);
  return drawLair(e);
}
function lairBg(g, rm, rng, arR) {
  const R = L.ROOM;
  for (let i = 0; i < Math.round(26 * arR); i++) { // 暗紫的裂縫
    const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.strokeStyle = 'rgba(122,92,255,.16)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 4; k++) g.lineTo(x + (rng() - 0.5) * 120 * (k + 1) * 0.5, y + (k + 1) * 14 + rng() * 10); g.stroke();
  }
  for (let i = 0; i < Math.round(16 * arR); i++) { g.fillStyle = 'rgba(0,0,0,.18)'; circ(g, R.x + rng() * R.w, R.y + rng() * R.h, 30 + rng() * 60); }
}
function lairObs(g, o, rng) {
  g.fillStyle = '#0d0c14'; L.rrect(g, o.x - 4, o.y - 2, o.w + 8, o.h + 8, 8); g.fill();
  g.fillStyle = '#2b2940'; L.rrect(g, o.x, o.y, o.w, o.h, 8); g.fill();
  g.fillStyle = '#3d3a5c'; L.rrect(g, o.x + 4, o.y + 4, o.w - 8, Math.min(14, o.h * 0.3), 6); g.fill();
  g.strokeStyle = 'rgba(122,92,255,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(o.x + o.w * 0.3, o.y + 6); g.lineTo(o.x + o.w * 0.45, o.y + o.h * 0.5); g.lineTo(o.x + o.w * 0.35, o.y + o.h - 6); g.stroke();
}

/* ---------- 世界 ---------- */
L.registerWorld({
  noPool: true,
  theme: 26, name: '暗影巢穴', pool: 'dlc', opt: '暗影巢穴（DLC8）',
  pal: { ink: '#06050a', floor: '#1b1a26', floor2: '#222131', wall1: '#0f0e17', wall2: '#2a2840', top: '#9a94c8', door: '#7a5cff' },
  amb: ['lowpass', 190, 1.1, 0.012], ev: r => { const n = [196, 233, 262][Math.floor(r() * 3)]; L.blip(n, n * 0.97, 1.0, 'sine', 0.007); },
  dark: 'rgba(5,3,14,0.84)', noPaper: true, ownStory: true,
  lightMul: () => Math.max(0.72, 1 - 0.015 * (L.run ? L.run.layer : 0)), // 越深燈光越小（最多縮到 72%）
  bg: lairBg, obsDraw: lairObs,
  skin: {
    map: { fanshade: 'fan', dartshade: 'dart', flameshade: 'flame', centaur: 'centaur', cyclops: 'cyclops', thiefrog: 'thiefrog', frostfan: 'frostfan', stickfan: 'stickfan' },
    draw: drawDispatch, hue: false
  },
  enemies: {
    frostfan: { hp: 8, r: 14, name: '凍人扇影', cost: 3, cap: 2, ai: frostAi },
    stickfan: { hp: 9, r: 14, name: '黏人扇影', cost: 3, cap: 2, ai: stickAi }
  },
  // 每一波的敵人池：完全取代一般池（不放基礎小怪）。雙數波主區域、單數波副區域；第 10 層起兩區混合
  types: (types, L0, ci) => {
    const r = L.run, room = L.room, w = room ? Math.max(0, room.wave) : 0, eff = r.layer + Math.floor(w / 3);
    types.length = 0; const zs = zonesNow(); cur = zs.slice();
    let pool = [];
    for (const zi of zs) for (const [k, m] of ZONES[zi].es) if (eff >= m) pool.push(k);
    for (const [k, m] of NATIVE) if (eff >= m) pool.push(k);
    if (!pool.length) pool.push('lavaslime');
    const dk = pool.filter(k => DARK.indexOf(k) >= 0); // 致盲、吸光：同一波只留一種
    if (dk.length > 1) { const keep = pickOf(dk); pool = pool.filter(k => DARK.indexOf(k) < 0 || k === keep); }
    for (const k of pool) types.push(k);
  },
  // 越深越多：不佔預算的額外便宜小兵（每 3 個「深度＋波數」多 1 隻，最多 6 隻）
  extra: (L0, ci) => {
    const r = L.run, room = L.room, w = room ? Math.max(0, room.wave) : 0, n = Math.min(6, Math.floor((r.layer + w) / 3)), out = [];
    let cands = []; for (const zi of cur) for (const [k] of ZONES[zi].es) if (CHEAP.indexOf(k) >= 0) cands.push(k);
    if (!cands.length) cands = ['firebat', 'lavaslime', 'spore', 'duster'];
    for (let i = 0; i < n; i++) out.push(pickOf(cands));
    return out;
  },
  post: list => { // 預算用不完時一般會補「小影」；巢穴不放基礎小怪，換成目前區域的便宜敵人
    let cands = []; for (const zi of cur) for (const [k] of ZONES[zi].es) if (CHEAP.indexOf(k) >= 0) cands.push(k);
    if (!cands.length) cands = ['firebat', 'lavaslime', 'spore', 'duster'];
    for (let i = 0; i < list.length; i++) if (list[i] === 'crawler') list[i] = pickOf(cands);
  },
  onWave: room => {
    const zs = zonesNow(), nm = zs.map(z => ZONES[z].n).join('＋');
    L.later(1.2, () => { if (L.room === room && L.state() === 'play') L.toast('深度 ' + (L.run.layer + 1) + '・' + nm + '的影子', 2.2); });
  },
  // 9 隻基礎最終 Boss 輪流（和用餐層一樣用現成的）：每 3 層是完整血量的最終 Boss，其餘層縮小；越深血量越高
  boss: fin => {
    const r = L.run, o = ord(), def = L.THEMES[o[r.layer % 9]].boss(true), grow = 1 + 0.12 * Math.max(0, r.layer - 2);
    return Object.assign({}, def, { hp: Math.round(def.hp * 1.5 * (fin ? 1.1 : 0.7) * grow) });
  },
  intro: def => [{ who: '旁白', text: def.name + '從巢穴深處爬了出來。這一層的出口，在牠身後。' }],
  outro: () => [{ who: '旁白', text: '巢穴沒有盡頭。你的燈還亮著，這就夠走下一層了。' }],
  shards: ['影子的紙條：「越往下，越不需要光——因為你會習慣黑。」', '影子的紙條：這裡的每一層，都是上一層的回聲。', '影子的紙條：燈變小了，不是因為油少了，是你走得夠深了。'],
  roomInit: (room, kind) => {
    if (L.th() !== 26 || kind !== 'start' || L.run.layer !== 0) return;
    L.later(1.6, () => { if (L.room === room && L.state() === 'play') L.say([{ who: '旁白', text: '巢穴沒有出口，只有更深的黑。每一層都連著下一層，影子在這裡從來不睡。' }, { who: '旁白', text: '越往下，敵人越多越強，燈光也越暗——能走多深，就看你的火撐得多久。' }]); });
  },
  // 跳蛙與偷燈芯的跳蛙血量 ×2
  tick: dt => {
    if (L.th() !== 26 || !L.room) return;
    for (const e of L.enemies) if (!e.dead && !e.l2x && (e.type === 'jumper' || e.type === 'thiefrog')) { e.l2x = true; e.hp = e.maxHp = Math.round(e.maxHp * 2); }
  },
  onKill: e => {
    if (L.th() !== 26 || !L.room) return;
    if (e.type === 'thiefrog' && e.stolen > 0) { const back = Math.max(1, Math.floor(e.stolen * 0.6)); L.dropCoins(e.x, e.y, back); L.toast('跳蛙吐回了 ' + back + ' 燈芯（偷走 ' + e.stolen + '）', 2); }
  },
  ach: [{ id: 'lair6', name: '巢穴探索者', desc: '暗影巢穴：到達深度 6' }, { id: 'lair12', name: '深淵行者', desc: '暗影巢穴：到達深度 12' }]
});
})();
