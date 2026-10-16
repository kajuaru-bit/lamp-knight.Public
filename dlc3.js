/* 《燈火騎士》DLC6「傳統節慶」：春節(22)、中秋(23)、七夕(24)。
   獨立檔案，選到「傳統節慶」才下載（需先載入 dlc.js 與 dlc2.js）；全程無視野限制。世界編號依序註冊。
   目前已完成：春節（22）、中秋（23）。 */
(function () {
'use strict';
const L = window.LK;
if (!L || L.THEMES[22] || !L.THEMES[21]) return;
const { C, TAU, circ, rrect, poly, star4, rand, rr, pickOf, clamp } = L;

/* ---------- 共用：大型節慶世界工廠（骨幹同季節慶典：大地圖、五個設施、三種 Boss、三個事件） ---------- */
function spawnNear(n, near, types) {
  const out = []; for (let i = 0; i < n; i++) {
    const a = rand() * TAU, d = rr(200, 330), x = clamp(near.x + Math.cos(a) * d, L.ROOM.x + 60, L.ROOM.x + L.ROOM.w - 60), y = clamp(near.y + Math.sin(a) * d, L.ROOM.y + 60, L.ROOM.y + L.ROOM.h - 60);
    const e = L.spawnEnemy(pickOf(types), x, y); e.sleep = false; e.noRez = true; out.push(e);
  } return out;
}
function xProp(it, col, glyph, used) {
  const c = L.ctx; c.save(); c.translate(it.x, it.y + Math.sin(L.time * 2 + it.x) * 2);
  c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(0, 26, 30, 8, 0, 0, TAU); c.fill(); if (used) c.globalAlpha = 0.45;
  c.fillStyle = col; L.rrect(c, -24, -26, 48, 52, 8); c.fill(); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; L.rrect(c, -24, -26, 48, 52, 8); c.stroke();
  c.fillStyle = '#fff'; c.font = '700 26px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(glyph, 0, 0); c.restore();
}
const xAdd = (room, cx, cy, id, extra) => room.items.push(Object.assign({ kind: 'xev', id, x: cx, y: cy, group: 'prop', price: 0, taken: false, used: false }, extra || {}));
function swarmBleed(m, skin, xk) {
  if (m.skin !== skin || m.bleedDone) return; m.bleedDone = true;
  const b = L.enemies.find(q => !q.dead && q.type === 'boss' && q.xk === xk); if (!b || L.rand() >= 0.5) return;
  b.bleedNow = true; L.hitEnemy(b, 1, 0, 0, 0, false); b.bleedNow = false; L.burst(b.x, b.y, 5, ['#ffffff'], 90, true);
}
const BASEHP = { barrage: 285, swarm: 255, long: 360 };
function dasherAi(col) {
  return (e, dt, nx, ny, d) => {
    e.st = (e.st === undefined ? rr(1, 2) : e.st) - dt; if (!e.state || e.state === 'spawn') e.state = 'walk';
    let mx = 0, my = 0, touch = 1;
    if (e.state === 'walk') { mx = nx * 46 * e.spd; my = ny * 46 * e.spd; if (e.st <= 0) { e.state = 'wind'; e.st = 0.75; e.ra = Math.atan2(L.p.y - e.y, L.p.x - e.x); } }
    else if (e.state === 'wind') { e.tele = e.st; e.ra = Math.atan2(L.p.y - e.y, L.p.x - e.x); if (e.st <= 0) { e.state = 'dash'; e.st = 0.8; e.tele = 0; } }
    else if (e.state === 'dash') { mx = Math.cos(e.ra) * 440 * e.spd; my = Math.sin(e.ra) * 440 * e.spd; touch = 2; if (e.st <= 0) { e.state = 'rest'; e.st = 1.1; L.burst(e.x, e.y, 8, col, 140, true); } }
    else if (e.st <= 0) { e.state = 'walk'; e.st = rr(1.6, 2.6); }
    return { mx, my, touch };
  };
}
function casterAi(drift) {
  return (e, dt, nx, ny, d) => {
    e.cd = (e.cd === undefined ? rr(1.4, 2.4) : e.cd) - dt; e.w = (e.w || rand() * TAU) + dt * 2.2;
    if (e.tele > 0) { e.tele -= dt; if (e.tele <= 0) { const a = Math.atan2(L.p.y - e.y, L.p.x - e.x); for (let i = -1; i <= 1; i++) L.enemyShot(e, a + i * 0.28, 185); e.cd = rr(2.3, 3.1) * e.fire; } return { mx: 0, my: 0, touch: 1 }; }
    if (e.cd <= 0 && d < 540) e.tele = 0.5;
    if (!drift) return { mx: nx * 30 * e.spd, my: ny * 30 * e.spd, touch: 1 };
    const k = d > 260 ? 1 : d < 160 ? -0.8 : 0; return { mx: (nx * k + Math.cos(e.w) * 0.9) * 70 * e.spd, my: (ny * k + Math.sin(e.w) * 0.9) * 70 * e.spd, touch: 1 };
  };
}

function makeFest(F) {
  let S = null; const T = F.theme, BK = Object.keys(F.bosses);
  const mkLayout = R => {
    const zw = R.w / 3, zh = R.h / 2, zc = z => ({ x: R.x + (z % 3 + 0.5) * zw, y: R.y + (Math.floor(z / 3) + 0.5) * zh });
    const zs = L.shuffle([0, 2, 3]), a = zc(zs[0]), b = zc(zs[1]), mid = zc(4), top = zc(1);
    S = { live: false, slots: [{ fk: 'market', x: R.x + R.w - 340, y: R.y + 170 }, { fk: 'pool', x: mid.x, y: mid.y + 20 }, { fk: 'work', x: a.x + rr(-90, 90), y: a.y + rr(-60, 60) }, { fk: 'nook', x: b.x + rr(-90, 90), y: b.y + rr(-60, 60) }, { fk: 'rest', x: top.x + rr(-120, 120), y: top.y + rr(-60, 60) }] };
  };
  const obs = (kind, R, D) => {
    if (kind === 'boss') return F.bossObs(R);
    mkLayout(R);
    const keep = S.slots.map(s => s.fk === 'market' ? { x: s.x - 230, y: s.y - 100, w: 520, h: 220 } : s.fk === 'pool' ? { x: s.x - 200, y: s.y - 160, w: 400, h: 320 } : { x: s.x - 150, y: s.y - 140, w: 300, h: 280 });
    keep.push({ x: R.x, y: D.y - 100, w: 170, h: 200 }, { x: R.x + R.w - 170, y: D.y - 100, w: 170, h: 200 });
    const out = [];
    for (let t = 0; t < 1200 && out.length < 38; t++) {
      const k = pickOf(F.obsKinds), w = rr(k.w[0], k.w[1]), h = rr(k.h[0], k.h[1]);
      const o = { x: rr(R.x + 90, R.x + R.w - 90 - w), y: rr(R.y + 50, R.y + R.h - 50 - h), w, h, jk: k.jk };
      if (keep.some(q => L.overlap(q, o)) || out.some(q => L.overlap(L.inflate(q, 80), o))) continue;
      out.push(o);
    }
    return out;
  };
  const bg = (g, rm, rng, arR) => {
    const R = L.ROOM; F.bgDraw(g, R, rng, arR);
    if (rm.kind === 'combat' && R.w > 2000) { g.font = '700 34px sans-serif'; g.textAlign = 'center'; g.fillStyle = F.zoneCol; for (let z = 0; z < 6; z++) g.fillText(F.zones[z], R.x + (z % 3 + 0.5) * R.w / 3, R.y + (Math.floor(z / 3) + 0.5) * R.h / 2 - 110); }
  };
  const init = (room, kind) => {
    const r = L.run; if (L.th() !== T) return;
    if (kind !== 'combat') { if (kind !== 'boss') S = null; else if (S) S.live = false; }
    { const sd = r['said' + T] = r['said' + T] || {}; if (kind !== 'start' && !sd[r.layer]) { sd[r.layer] = 1; const T0 = F.story[r.layer & 1]; L.later(2.0, () => { if (L.room === room && L.state() === 'play') L.say(T0); }); } }
    if (kind !== 'combat' || !S) return;
    S.live = true; room.refreshN = 0;
    for (const s of S.slots) {
      if (s.fk === 'market') {
        room.items.push(L.makeItem('heal', s.x - 130, s.y, 'shop'), L.makeItem('upgrade', s.x, s.y, 'shop'), L.makeItem(rand() < 0.65 ? 'weapon' : 'upgrade', s.x + 130, s.y, 'shop'));
        room.items.push({ kind: 'refresh', id: 'refresh', slot: 'refresh', x: s.x + 250, y: s.y, price: 3, group: 'stall', taken: false });
      } else room.items.push({ kind: 'tfac', id: 'tfac', fk: s.fk, x: s.x, y: s.y, group: 'prop', price: 0, taken: false, st: 'ready', t: 0, n: 0 });
    }
  };
  const done = (it, msg) => { it.st = 'done'; const r = L.run; r['fac' + T] = r['fac' + T] || {}; r['fac' + T][it.fk] = 1; if (r['fac' + T].pool && r['fac' + T].work) L.unlockAch(F.achIds[3]); if (msg) L.toast(msg, 3); L.hintReset(); };
  const use = it => {
    const p = L.p, N = F.fac;
    if (it.st === 'done') { L.toast('這裡已經結束了', 1.4); return; }
    if (it.st === 'busy') { L.toast('進行中……', 1.2); return; }
    if (it.fk === 'rest') { L.toast('站在' + N.rest.name + '旁邊等 6 秒就好', 1.6); return; }
    if (it.fk === 'pool') {
      if (p.coins < 4) { L.toast('燈芯不夠（每個' + N.pool.noun + ' 4 燈芯）', 1.6); L.sfx('tick'); return; } p.coins -= 4; it.n++; L.sfx('buy'); L.burst(it.x, it.y - 20, 14, F.fx, 150, true); const x = rand();
      if (it.n >= 3) { L.healP(1); const u = L.premUpgrade(); done(it, N.pool.name + '滿了：燈火 +1、精良強化「' + L.UPGN(u) + '」'); return; }
      if (x < 0.4) { p.coins += 8; L.toast(N.pool.noun + '裡有燈芯 +8', 2); } else if (x < 0.75) { L.pickups.push({ kind: 'oil', x: it.x + 30, y: it.y + 40, t: 0 }); L.toast(N.pool.noun + '裡有一小瓶燈油', 2); } else { const u = L.rewardUpgrade(); L.toast(N.pool.noun + '發光了：強化「' + L.UPGN(u) + '」', 2.6); }
      L.hintReset();
    } else if (it.fk === 'work') {
      const big = L.spawnEnemy('brute', it.x, it.y - 100); big.sleep = false; big.noRez = true; big.hp = big.maxHp = Math.round(big.maxHp * 2.6); big.r = Math.round(big.r * 1.3);
      it.mobs = [big].concat(spawnNear(4, it, ['crawler', 'crawler', 'shooter'])); it.st = 'busy'; L.burst(it.x, it.y, 22, F.fx, 200, true); L.sfx('kill'); L.toast(N.work.start, 2.8); L.hintReset();
    } else if (it.fk === 'nook') {
      it.n++; L.sfx('hit'); L.burst(it.x, it.y - 20, 12, F.fx, 150, true); const x = rand();
      if (x < 0.45) { L.dropCoins(it.x, it.y + 30, 3 + Math.floor(rand() * 3)); L.toast(N.nook.name + '給了燈芯', 1.4); }
      else if (x < 0.65) { L.pickups.push({ kind: 'oil', x: it.x + 30, y: it.y + 30, t: 0 }); L.toast('得到一小瓶燈油', 1.4); }
      else if (x < 0.82) { spawnNear(2, it, F.nookMobs); L.toast('驚動了什麼東西！', 1.6); }
      else L.toast('什麼也沒有……', 1.2);
      if (it.n >= 5) done(it, N.nook.name + '的供品用完了');
      L.hintReset();
    }
  };
  const tick = dt => {
    const room = L.room, p = L.p; if (!room || L.state() !== 'play' || !S || !S.live || room.kind !== 'combat') return;
    for (const it of room.items) {
      if (it.kind === 'tfac' && it.fk === 'rest' && it.st === 'ready') {
        if (Math.hypot(p.x - it.x, p.y - it.y) < 150) it.t += dt; else it.t = Math.max(0, it.t - dt * 2);
        if (it.t >= 6) { done(it, ''); const r = L.rand(); L.sfx('clear'); if (r < 0.4) { L.healP(1); p.coins += 8; L.toast(F.fac.rest.r1, 2.8); } else if (r < 0.8) { p.skillCd = 0; const u = L.rewardUpgrade(); L.toast(F.fac.rest.r2 + '：技能冷卻重置、強化「' + L.UPGN(u) + '」', 3); } else { p.coins += 15; L.toast(F.fac.rest.r3, 2.4); } L.hintReset(); }
        continue;
      }
      if (it.kind !== 'tfac' || it.st !== 'busy' || !it.mobs) continue;
      if (it.mobs.every(e => e.dead)) { const w = L.makeItem('weapon', it.x, it.y + 60, 'prop'); room.items.push(w); L.dropCoins(it.x, it.y + 20, 10); L.sfx('clear'); done(it, F.fac.work.end); }
    }
  };
  const info = it => {
    const N = F.fac, d = it.st === 'done' ? N[it.fk].fin : {
      pool: '每個' + N.pool.noun + ' 4 燈芯（共 3 個）：燈芯、燈油或強化；滿 3 個得燈火 +1 與精良強化。已用 ' + it.n + ' / 3',
      work: '按 F 開始：巨大的舞獅（精英）與 4 隻小怪出現；全部打倒得一把武器與燈芯',
      nook: '按 F 獻一份供品（最多 5 份）：燈芯、燈油，偶爾驚動怪物',
      rest: '站在旁邊（150 像素內）等 6 秒，離開會倒退。結局：回血加燈芯／技能冷卻重置加強化／燈芯 +15'
    }[it.fk];
    return { name: N[it.fk].name + (it.st === 'done' ? '（已結束）' : ''), desc: d };
  };
  const hint = it => it.st !== 'ready' ? '' : it.fk === 'rest' ? '靠近' + F.fac.rest.name + '（' + Math.floor(Math.min(6, it.t)) + ' / 6）' : it.fk === 'pool' ? 'F ' + F.fac.pool.verb + '（4 燈芯，' + it.n + ' / 3）' : it.fk === 'work' ? 'F ' + F.fac.work.verb : 'F ' + F.fac.nook.verb + '（' + it.n + ' / 5）';
  const drawFac = it => {
    const c = L.ctx; c.save(); c.translate(it.x, it.y); if (it.st === 'done') c.globalAlpha = 0.55;
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 26, 44, 10, 0, 0, TAU); c.fill();
    F.drawFac(c, it, L.time, it.st === 'done'); c.restore();
  };
  const back = () => {
    const room = L.room, c = L.ctx, tm = L.time; if (!room) return;
    if (room.kind === 'boss') {
      const w = L.enemies.find(q => q.type === 'boss' && !q.dead && q.tl && q.tl.act === 'charge' && q.xk === F.longKey);
      if (w) { const p = L.p; c.save(); c.strokeStyle = 'rgba(255,90,60,' + (0.35 + 0.3 * Math.sin(tm * 16)) + ')'; c.lineWidth = 8; c.setLineDash([14, 10]); c.beginPath(); c.moveTo(w.x, w.y); c.lineTo(p.x, p.y); c.stroke(); c.restore(); }
      return;
    }
    if (!S || !S.live || room.kind !== 'combat') return;
    for (const s of S.slots) if (s.fk === 'market') {
      c.save(); c.translate(s.x, s.y - 52); c.fillStyle = F.marketCol[0]; c.fillRect(-250, -6, 500, 8); for (let i = 0; i < 10; i++) { c.fillStyle = F.marketCol[1 + (i % 2)]; c.beginPath(); c.moveTo(-250 + i * 50, 2); c.lineTo(-200 + i * 50, 2); c.lineTo(-225 + i * 50, 24); c.fill(); }
      c.fillStyle = F.marketCol[3]; c.font = '700 15px sans-serif'; c.textAlign = 'center'; c.fillText(F.fac.market, 0, -14); c.restore();
    }
  };
  const bossDef = fin => {
    const r = L.run, t = L.th(); r.hwOrd = r.hwOrd || {}; const ord = r.hwOrd[t] = r.hwOrd[t] || L.shuffle(BK.slice());
    const same = r.themes[0] === r.themes[1], k = ord[same ? r.layer % 3 : (r.layer & 1)], B = F.bosses[k];
    return { kind: 'golem', name: B.name, hp: Math.round(BASEHP[B.type] * (fin ? 1.3 : 1)), ext: true, xk: k };
  };
  const hitMod = (e, dmg) => {
    if (e.type !== 'boss') return dmg; if (e.bleedNow) return dmg;
    const B = F.bosses[e.xk]; if (!B) return dmg;
    if (B.type === 'swarm') { const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === F.swarmSkin && q.spawn <= 0).length; if (n >= 4) { if (L.time - (e.armTip || -99) > 8) { e.armTip = L.time; L.toast(F.armTip, 2.2); } return dmg * 0.3; } }
    if (B.type === 'long') { if (e.open && L.time < e.open) return dmg * 2; return dmg * 0.55; }
    return dmg;
  };
  const moves = (e, phase, ang) => {
    const p = L.p, aim = () => Math.atan2(p.y - e.y, p.x - e.x), alive = L.enemies.filter(q => !q.dead && q.type !== 'boss').length, B = F.bosses[e.xk], t = B.t, R = L.ROOM;
    const pools = {
      barrage: phase === 1 ? ['fan', 'ring', 'spiral'] : phase === 2 ? ['fan', 'ring', 'spiral', 'lanes'] : ['fan', 'spiral', 'lanes', 'rain', 'ring'],
      swarm: phase === 1 ? ['summon', 'fan2'] : phase === 2 ? ['summon', 'rally', 'fan2'] : ['summon', 'rally', 'army', 'fan2'],
      long: phase === 1 ? ['charge', 'soldiers'] : phase === 2 ? ['charge', 'soldiers', 'ring2'] : ['charge', 'soldiers', 'ring2', 'slam']
    };
    const a = pickOf(pools[B.type]), mk = (n, lim) => { if (alive < lim) for (let i = 0; i < n; i++) { const sp = L.freeSpot(13), m = L.spawnEnemy('crawler', sp.x, sp.y); m.sleep = false; m.noRez = true; m.spawn = 0.8; } };
    if (a === 'fan') { for (let w = 0; w < 3; w++) L.later(w * 0.45, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.22, 180, false, 9); L.sfx('hit'); }); L.toast(t.fan, 1.1); }
    else if (a === 'ring') { const n = 14, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 135, false, 8); L.later(0.8, () => { if (e.dead) return; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + (i + 0.5) / n * TAU, 160, false, 8); }); L.toast(t.ring, 1.2); }
    else if (a === 'spiral') { const off = rand() * TAU; for (let i = 0; i < 30; i++) L.later(i * 0.09, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, e.x, e.y, off + i * 0.42, 185, false, 7); }); L.toast(t.spiral, 1.2); }
    else if (a === 'lanes') { L.toast(t.lanes, 1.8); const gap = R.y + 80 + rand() * (R.h - 160); for (let i = 0; i < 16; i++) { const yy = R.y + 20 + i * ((R.h - 40) / 15); if (Math.abs(yy - gap) < 70) continue; L.later(0.5, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, R.x + 10, yy, 0, 240, false, 8); }); } }
    else if (a === 'rain') { L.toast(t.rain, 1.2); for (let i = 0; i < 14; i++) L.later(i * 0.16, () => { if (e.dead || L.state() !== 'play') return; L.bossShot(e, R.x + rand() * R.w, R.y + 10, Math.PI / 2 + (rand() - 0.5) * 0.3, 200, false, 8); }); }
    else if (a === 'summon') { mk(phase === 3 ? 5 : 4, 11); L.toast(t.summon, 1.4); }
    else if (a === 'rally') { L.toast(t.rally, 1.8); for (const q of L.enemies) if (!q.dead && q.type !== 'boss' && !q.rally) { q.rally = true; q.spd *= 1.5; L.later(3.2, () => { q.spd /= 1.5; q.rally = false; }); } }
    else if (a === 'army') { mk(8, 14); L.toast(t.army, 1.6); }
    else if (a === 'fan2') { for (let w = 0; w < 2; w++) L.later(w * 0.5, () => { if (e.dead || L.state() !== 'play') return; const aa = aim(); for (let i = -2; i <= 2; i++) L.bossShot(e, e.x, e.y, aa + i * 0.2, 205, false, 7); }); L.toast(t.fan2, 1.1); }
    else if (a === 'charge') { e.tl = { t: 0.9, act: 'charge', ang: aim() }; e.open = L.time + 4.2; e.openOff = false; L.toast(t.charge, 2.6); }
    else if (a === 'soldiers') { mk(3, 9); L.toast(t.soldiers, 1.4); }
    else if (a === 'ring2') { for (let w = 0; w < 2; w++) L.later(w * 0.6, () => { if (e.dead || L.state() !== 'play') return; const n = 16, off = rand() * TAU; for (let i = 0; i < n; i++) L.bossShot(e, e.x, e.y, off + i / n * TAU, 150, false, 8); }); L.toast(t.ring2, 1.2); }
    else { L.toast(t.slam, 1.4); e.open = L.time + 3.4; e.openOff = false; for (let k = 0; k < 7; k++) { const aa = k / 7 * TAU, d = 130 + (k % 2) * 90; L.markStrike(e, e.x + Math.cos(aa) * d, e.y + Math.sin(aa) * d, 56, 1.1, {}); } }
  };
  const evs = {}, EV = F.events;
  evs[EV[0].id] = { toast: EV[0].toast, setup: (room, cx, cy) => xAdd(room, cx, cy, EV[0].id), info: it => ({ name: EV[0].name, desc: it.used ? EV[0].fin : EV[0].desc }), hint: it => it.used ? '' : 'F ' + EV[0].verb + '（3 燈芯）',
    use(it) { if (it.used) return; if (L.p.coins < 3) { L.toast('燈芯不夠'); L.sfx('tick'); return; } L.p.coins -= 3; it.used = true; const r = L.rand(); L.sfx('buy'); if (r < 0.5) { const u = L.rewardUpgrade(); L.toast(EV[0].r1 + '：強化「' + L.UPGN(u) + '」', 2.8); } else if (r < 0.8) { L.p.coins += 8; L.toast(EV[0].r2, 2.2); } else { L.p.coins += 1; L.toast(EV[0].r3, 2.2); } },
    draw: it => xProp(it, EV[0].col, EV[0].glyph, it.used) };
  evs[EV[1].id] = { toast: EV[1].toast, setup: (room, cx, cy) => xAdd(room, cx, cy, EV[1].id, { t: 0 }), info: it => ({ name: EV[1].name, desc: it.used ? EV[1].fin : EV[1].desc }), hint: it => it.used ? '' : '靠近' + EV[1].name + '（' + Math.floor(Math.min(5, it.t)) + ' / 5）', use() { },
    tick(dt, room) { const it = room.items.find(q => q.kind === 'xev' && q.id === EV[1].id); if (!it || it.used) return; const p = L.p; if (Math.hypot(p.x - it.x, p.y - it.y) < 150) it.t += dt; else it.t = Math.max(0, it.t - dt * 2); if (it.t >= 5) { it.used = true; L.healP(1); p.coins += 10; L.sfx('clear'); L.toast(EV[1].done, 2.8); L.hintReset(); } },
    draw: it => { const c = L.ctx; c.save(); c.translate(it.x, it.y); if (it.used) c.globalAlpha = 0.5; c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 22, 40, 9, 0, 0, TAU); c.fill(); EV[1].draw(c, it, L.time); c.restore(); } };
  evs[EV[2].id] = { toast: EV[2].toast, setup: (room, cx, cy) => xAdd(room, cx, cy, EV[2].id), info: it => ({ name: EV[2].name, desc: it.used ? EV[2].fin : EV[2].desc }), hint: it => it.used ? '' : 'F ' + EV[2].verb + '（6 燈芯）',
    use(it) { if (it.used) return; if (L.p.coins < 6) { L.toast('燈芯不夠'); L.sfx('tick'); return; } L.p.coins -= 6; it.used = true; L.healP(2); L.p.skillCd = 0; L.sfx('buy'); L.toast(EV[2].done, 2.6); },
    draw: it => xProp(it, EV[2].col, EV[2].glyph, it.used) };
  const bossAch = () => { try { const i = BK.indexOf(L.bossDef().xk); if (i >= 0) L.unlockAch(F.achIds[i]); } catch (e) { /* optional */ } };
  const ext = {}; for (const k in F.ext) { const q = F.ext[k]; ext[k] = { hp: q.hp, r: q.r, name: q.name, cost: q.cost, cap: q.cap, ai: q.ai === 'dasher' ? dasherAi(F.fx) : casterAi(q.ai === 'floater') }; }
  const extKeys = Object.keys(F.ext);
  L.registerWorld({
    theme: T, name: F.name, pool: 'dlc', opt: F.name + '（DLC6）', pal: F.pal, bigMap: true, ownStory: true, noDark: true, noPaper: true, stage: F.stage,
    amb: F.amb, ev: F.ev, skin: { map: F.skinMap, draw: F.drawEnemy, hue: false }, bg, obsDraw: F.obsDraw, obs, roomInit: init, tick, back,
    drawItem: drawFac, info, hint, useItem: use, shards: F.shards, hitMod, plantFor: F.plantFor, plantSmall: F.plantSmall, plantToast: F.plantToast, tobDraw: F.tobDraw, aff: F.aff,
    arrows: edge => { const room = L.room; if (!room || room.kind !== 'combat' || !S || !S.live) return; for (const it of room.items) if (it.kind === 'tfac' && it.st === 'ready' && !it.taken) edge(it.x, it.y, F.fx[0], false); for (const s of S.slots) if (s.fk === 'market') edge(s.x, s.y, '#ffe27a', false); },
    mini: (mx, my, sc) => {
      const room = L.room, c = L.ctx, R = L.ROOM; if (!room || room.kind !== 'combat' || !S || !S.live) return; c.save(); c.textAlign = 'center'; c.font = '700 9px sans-serif';
      for (const s of S.slots) { const x = mx + (s.x - R.x) * sc, y = my + (s.y - R.y) * sc; if (s.fk === 'market') { c.fillStyle = '#ffe27a'; c.fillText('市', x, y + 3); } }
      for (const it of room.items) if (it.kind === 'tfac') { const x = mx + (it.x - R.x) * sc, y = my + (it.y - R.y) * sc; c.fillStyle = it.st === 'done' ? 'rgba(180,180,180,.6)' : F.fx[0]; c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x + 3.5, y); c.lineTo(x, y + 4); c.lineTo(x - 3.5, y); c.fill(); }
      c.restore();
    },
    enemies: ext,
    types: (types, L0) => { types.length = 0; types.push('crawler', 'crawler', 'shooter', extKeys[0]); if (L0 > 0) types.push(extKeys[1], 'brute', 'crawler', 'bomber'); if (L0 >= 2) types.push(extKeys[0], extKeys[1], 'shooter', 'brute'); if (L0 >= 3) types.push('brute', 'brute', extKeys[1], 'shooter', 'bomber'); },
    extra: () => [], boss: bossDef, boss2: moves, drawBoss: F.drawBoss, intro: def => F.bosses[def.xk].intro,
    onKill: e => {
      swarmBleed(e, F.swarmSkin, F.swarmKey);
      if (e.skin === F.swarmSkin && L.enemies.some(q => !q.dead && q.type === 'boss' && q.xk === F.swarmKey)) { const o = L.rand() * TAU; for (let i = 0; i < 4; i++) L.enemyShot(e, o + i * TAU / 4, 120); }
    },
    events: evs, weapons: F.weapons,
    ach: BK.map((k, i) => ({ id: F.achIds[i], name: F.bosses[k].achName, desc: F.name + '：擊敗' + F.bosses[k].name })).concat([{ id: F.achIds[3], name: F.facAch[0], desc: F.name + '：' + F.facAch[1] }]),
    onMid: () => { if (L.th() === T) bossAch(); }, onFinal: () => { if (L.th() === T) bossAch(); }, outro: () => F.outro
  });
  F.swarmKey = BK.find(k => F.bosses[k].type === 'swarm'); F.longKey = BK.find(k => F.bosses[k].type === 'long');
}

/* ================= 春節（22）：全亮、廟會大街、三隻 Boss（彈幕／大群／長戰） ================= */
const RED9 = '#d6332b', GOLD = '#ffd24a', DRED = '#7a1a18', OL = '#2a1810';
function drawCnyEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, tm = e.t, fa = Math.atan2(L.p.y - e.y, L.p.x - e.x);
  if (sk === 'cracker') {
    c.fillStyle = OL; rrect(c, -r * 0.65, -r * 1.1, r * 1.3, r * 2.2, 4); c.fillStyle = f ? C.paper : RED9; rrect(c, -r * 0.55, -r * 1.0, r * 1.1, r * 2.0, 3); c.fillStyle = GOLD; c.fillRect(-r * 0.55, -r * 0.4, r * 1.1, 4); c.fillRect(-r * 0.55, r * 0.4, r * 1.1, 4);
    c.strokeStyle = '#5a3a20'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -r * 1.0); c.quadraticCurveTo(r * 0.3, -r * 1.4, r * 0.1, -r * 1.6); c.stroke(); c.fillStyle = Math.sin(tm * 20) > 0 ? '#ffe27a' : '#ff7a2a'; circ(c, r * 0.1, -r * 1.65, 3.5); c.fillStyle = '#fff'; circ(c, -r * 0.2, -r * 0.15, 2.5); circ(c, r * 0.2, -r * 0.15, 2.5);
  } else if (sk === 'lion') {
    c.fillStyle = OL; circ(c, 0, 0, r * 1.15); c.fillStyle = f ? C.paper : RED9; circ(c, 0, 0, r); c.fillStyle = GOLD; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; circ(c, Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95, r * 0.14); }
    c.fillStyle = '#fff'; circ(c, -r * 0.35, -r * 0.2, r * 0.26); circ(c, r * 0.35, -r * 0.2, r * 0.26); c.fillStyle = OL; circ(c, -r * 0.35 + Math.cos(fa) * 3, -r * 0.2 + Math.sin(fa) * 3, r * 0.12); circ(c, r * 0.35 + Math.cos(fa) * 3, -r * 0.2 + Math.sin(fa) * 3, r * 0.12);
    c.fillStyle = GOLD; poly(c, [[-r * 0.1, -r * 0.7], [0, -r * 1.0], [r * 0.1, -r * 0.7]]); c.fillStyle = '#4a0a0a'; rrect(c, -r * 0.5, r * 0.25, r * 1.0, r * 0.4, 4); c.fillStyle = '#fff'; for (let k = 0; k < 4; k++) c.fillRect(-r * 0.42 + k * r * 0.24, r * 0.25, 4, 5);
  } else if (sk === 'redenv') {
    c.fillStyle = OL; rrect(c, -r * 0.85, -r * 1.1, r * 1.7, r * 2.2, 5); c.fillStyle = f ? C.paper : RED9; rrect(c, -r * 0.75, -r * 1.0, r * 1.5, r * 2.0, 4); c.fillStyle = '#b21f1a'; poly(c, [[-r * 0.75, -r * 1.0], [0, -r * 0.1], [r * 0.75, -r * 1.0]]); c.fillStyle = GOLD; circ(c, 0, -r * 0.15, r * 0.3); c.fillStyle = OL; c.font = '700 ' + Math.round(r * 0.5) + 'px serif'; c.textAlign = 'center'; c.fillText('福', 0, -r * 0.0);
    c.fillStyle = '#fff'; circ(c, -r * 0.3, r * 0.45, 2.5); circ(c, r * 0.3, r * 0.45, 2.5); const g = 0.6 + 0.4 * Math.sin(tm * 6); c.fillStyle = 'rgba(255,210,80,' + g + ')'; star4(c, Math.cos(fa) * r * 1.3, Math.sin(fa) * r * 1.3, r * 0.35, tm * 2);
  } else if (sk === 'cake') {
    c.fillStyle = OL; rrect(c, -r * 1.05, -r * 0.75, r * 2.1, r * 1.5, 6); c.fillStyle = f ? C.paper : '#c8873a'; rrect(c, -r * 0.95, -r * 0.65, r * 1.9, r * 1.3, 5); c.fillStyle = '#e8b062'; rrect(c, -r * 0.95, -r * 0.65, r * 1.9, r * 0.4, 5); c.fillStyle = RED9; circ(c, 0, -r * 0.1, r * 0.22); c.fillStyle = OL; circ(c, -r * 0.4, r * 0.15, 2.5); circ(c, r * 0.4, r * 0.15, 2.5);
  } else if (sk === 'nianling') {
    const a = e.ra || fa; if (e.tele > 0) { c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#ff6a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 260, Math.sin(a) * 260); c.stroke(); c.restore(); }
    c.fillStyle = OL; circ(c, 0, 2, r * 1.15); c.fillStyle = f ? C.paper : '#e0562a'; circ(c, 0, 2, r); c.fillStyle = GOLD; poly(c, [[-r * 0.55, -r * 0.7], [-r * 0.35, -r * 1.35], [-r * 0.1, -r * 0.8]]); poly(c, [[r * 0.55, -r * 0.7], [r * 0.35, -r * 1.35], [r * 0.1, -r * 0.8]]);
    c.fillStyle = '#fff'; circ(c, -r * 0.35, -r * 0.15, r * 0.2); circ(c, r * 0.35, -r * 0.15, r * 0.2); c.fillStyle = OL; circ(c, -r * 0.35, -r * 0.15, r * 0.09); circ(c, r * 0.35, -r * 0.15, r * 0.09); c.fillStyle = '#4a0a0a'; rrect(c, -r * 0.4, r * 0.3, r * 0.8, r * 0.3, 3);
  } else { // firework
    c.fillStyle = OL; rrect(c, -r * 0.6, -r * 0.4, r * 1.2, r * 1.6, 4); c.fillStyle = f ? C.paper : '#3a6ac0'; rrect(c, -r * 0.5, -r * 0.3, r * 1.0, r * 1.4, 3); c.fillStyle = GOLD; c.fillRect(-r * 0.5, r * 0.1, r * 1.0, 4); c.fillStyle = RED9; poly(c, [[-r * 0.5, -r * 0.3], [0, -r * 1.2], [r * 0.5, -r * 0.3]]);
    const sp = e.tele > 0 ? 1 : 0.5 + 0.5 * Math.sin(tm * 8); c.fillStyle = 'rgba(255,220,90,' + sp + ')'; star4(c, 0, -r * 1.35, r * 0.4 + sp * 3, tm * 3); c.fillStyle = '#fff'; circ(c, -r * 0.2, r * 0.35, 2.5); circ(c, r * 0.2, r * 0.35, 2.5);
  }
}
function cnyBg(g, R, rng, arR) {
  for (let i = 0; i < Math.round(70 * arR); i++) { g.fillStyle = 'rgba(255,210,90,' + (0.15 + rng() * 0.3) + ')'; const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.fillRect(x, y, 3, 3); g.fillRect(x - 3, y + 1, 9, 1); }
  for (let k = 0; k < Math.round(8 * arR); k++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h, gr = g.createRadialGradient(x, y, 0, x, y, 220); gr.addColorStop(0, 'rgba(255,90,60,.2)'); gr.addColorStop(1, 'rgba(255,90,60,0)'); g.fillStyle = gr; g.fillRect(x - 220, y - 220, 440, 440); }
  for (let i = 0; i < Math.round(20 * arR); i++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.fillStyle = 'rgba(214,51,43,.16)'; g.fillRect(x, y, 26, 5); g.fillRect(x + 10, y - 10, 5, 26); }
}
function cnyObsDraw(g, o) {
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
  if (o.jk === 'lant') {
    g.fillStyle = OL; g.fillRect(cx - 2, o.y - 6, 4, 8); g.beginPath(); g.ellipse(cx, cy, o.w / 2 + 2, o.h / 2 - 2, 0, 0, TAU); g.fill(); g.fillStyle = RED9; g.beginPath(); g.ellipse(cx, cy, o.w / 2, o.h / 2 - 4, 0, 0, TAU); g.fill(); g.fillStyle = GOLD; g.fillRect(cx - o.w * 0.2, o.y + 3, o.w * 0.4, 5); g.fillRect(cx - o.w * 0.2, o.y + o.h - 9, o.w * 0.4, 5); g.fillRect(cx - 1, o.y + o.h - 4, 2, 10);
    g.strokeStyle = 'rgba(255,200,120,.5)'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy, o.w / 4, o.h / 2 - 5, 0, 0, TAU); g.stroke();
  } else if (o.jk === 'drum') {
    g.fillStyle = OL; g.beginPath(); g.ellipse(cx, cy, o.w / 2 + 2, o.h / 2 + 2, 0, 0, TAU); g.fill(); g.fillStyle = RED9; g.beginPath(); g.ellipse(cx, cy, o.w / 2, o.h / 2, 0, 0, TAU); g.fill(); g.fillStyle = '#e8c890'; g.beginPath(); g.ellipse(cx, cy, o.w / 2 - 7, o.h / 2 - 7, 0, 0, TAU); g.fill(); g.fillStyle = GOLD; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; circ(g, cx + Math.cos(a) * (o.w / 2 - 3), cy + Math.sin(a) * (o.h / 2 - 3), 2.2); }
  } else {
    g.fillStyle = OL; rrect(g, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 4); for (let k = 0; k < 3; k++) { g.fillStyle = k % 2 ? '#e84a3a' : RED9; rrect(g, o.x + k * o.w / 3, o.y, o.w / 3 - 1, o.h, 3); g.fillStyle = GOLD; g.fillRect(o.x + k * o.w / 3 + 1, o.y + o.h * 0.35, o.w / 3 - 3, 3); }
    g.strokeStyle = '#5a3a20'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, o.y); g.lineTo(cx + 5, o.y - 9); g.stroke(); g.fillStyle = '#ffa84a'; circ(g, cx + 5, o.y - 10, 3);
  }
}
function cnyTobDraw(o, ctx, cx, cy, f) {
  if (o.kind === 'clant') {
    ctx.fillStyle = f ? C.paper : OL; ctx.beginPath(); ctx.ellipse(cx, cy, 24, 26, 0, 0, TAU); ctx.fill(); ctx.fillStyle = f ? C.paper : RED9; ctx.beginPath(); ctx.ellipse(cx, cy, 21, 23, 0, 0, TAU); ctx.fill(); ctx.fillStyle = GOLD; ctx.fillRect(cx - 9, cy - 24, 18, 5); ctx.fillRect(cx - 9, cy + 19, 18, 5); ctx.fillStyle = 'rgba(255,230,160,.55)'; ctx.beginPath(); ctx.ellipse(cx, cy, 8, 21, 0, 0, TAU); ctx.fill(); return true;
  }
  if (o.kind === 'couplet') {
    const hz = o.w > o.h, n = hz ? 3 : 4; for (let k = 0; k < n; k++) { const t0 = (k + 0.5) / n, tx = hz ? o.x + o.w * t0 : cx, ty = hz ? cy : o.y + o.h * t0; ctx.fillStyle = f ? C.paper : OL; rrect(ctx, tx - 14, ty - 22, 28, 44, 3); ctx.fillStyle = f ? C.paper : RED9; rrect(ctx, tx - 12, ty - 20, 24, 40, 2); ctx.fillStyle = GOLD; ctx.font = '700 15px serif'; ctx.textAlign = 'center'; ctx.fillText(['福', '春', '喜', '財'][k % 4], tx, ty + 5); } return true;
  }
  return false;
}
function cnyPlantFor(e, p, ux, uy, plant) { if (e.type === 'shooter') plant('clant', p.x + ux * 130, p.y + uy * 130, 44, 48); else { const horiz = Math.abs(ux) > Math.abs(uy); plant('couplet', p.x + ux * 150, p.y + uy * 150, horiz ? 30 : 100, horiz ? 100 : 30); } }
function drawCnyFac(c, it, tm, done) {
  if (it.fk === 'pool') {
    c.fillStyle = '#7a1a18'; c.beginPath(); c.ellipse(0, 10, 48, 24, 0, 0, TAU); c.fill(); c.fillStyle = '#a82a22'; c.beginPath(); c.ellipse(0, 6, 44, 20, 0, 0, TAU); c.fill();
    for (let k = 0; k < 3; k++) { const lit = done || k < it.n; c.fillStyle = lit ? GOLD : RED9; rrect(c, -34 + k * 24, -16 - (lit ? 8 : 0), 20, 28, 3); c.fillStyle = lit ? DRED : GOLD; c.fillRect(-34 + k * 24, -4 - (lit ? 8 : 0), 20, 4); if (lit) { c.fillStyle = '#fff'; star4(c, -24 + k * 24, -34 + Math.sin(tm * 4) * 2, 6, tm); } }
  } else if (it.fk === 'work') {
    c.fillStyle = '#5a3a20'; rrect(c, -34, -4, 68, 30, 4); for (let k = 0; k < 4; k++) { c.fillStyle = k % 2 ? '#e84a3a' : RED9; rrect(c, -28 + k * 15, -36, 12, 36, 3); c.fillStyle = GOLD; c.fillRect(-28 + k * 15, -20, 12, 3); c.strokeStyle = '#5a3a20'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-22 + k * 15, -36); c.lineTo(-20 + k * 15, -44); c.stroke(); c.fillStyle = Math.sin(tm * 15 + k) > 0 ? '#ffe27a' : '#ff7a2a'; circ(c, -20 + k * 15, -45, 3); }
  } else if (it.fk === 'nook') {
    c.fillStyle = '#6a3a2a'; rrect(c, -32, -22, 64, 46, 4); c.fillStyle = '#1a0e08'; rrect(c, -20, -8, 40, 30, 3); const fl = Math.sin(tm * 9) * 2; c.fillStyle = '#ff7a2a'; poly(c, [[-12, 22], [-6, 0 + fl], [0, 12], [6, -4 - fl], [12, 22]]); c.fillStyle = RED9; rrect(c, -30, -40, 60, 18, 3); c.fillStyle = GOLD; c.font = '700 13px serif'; c.textAlign = 'center'; c.fillText('灶神', 0, -27);
  } else {
    c.fillStyle = '#8a3a1a'; c.beginPath(); c.ellipse(0, 6, 54, 26, 0, 0, TAU); c.fill(); c.fillStyle = RED9; c.beginPath(); c.ellipse(0, 2, 50, 22, 0, 0, TAU); c.fill(); const cols = [GOLD, '#fff', '#8fe38f', '#ff9a3a'];
    for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + 0.4; c.fillStyle = cols[k % 4]; circ(c, Math.cos(a) * 28, Math.sin(a) * 11 + 2, 8); c.fillStyle = OL; circ(c, Math.cos(a) * 28, Math.sin(a) * 11 + 2, 3); }
    const warm = done || it.t > 2; c.fillStyle = 'rgba(255,200,90,' + (warm ? 0.6 : 0.25) + ')'; circ(c, 0, -22, 14 + (warm ? Math.sin(tm * 4) * 2 : 0)); c.fillStyle = RED9; rrect(c, -9, -34, 18, 24, 4); c.fillStyle = GOLD; c.fillRect(-9, -34, 18, 3);
  }
}
function drawCnyBoss(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 2) * 4;
  if (e.xk === 'cnnian') {
    c.fillStyle = 'rgba(214,51,43,.16)'; circ(c, 0, b, 108); c.fillStyle = OL; circ(c, 0, 10 + b, 74);
    c.fillStyle = fl ? C.paper : '#e0562a'; circ(c, 0, 10 + b, 70); for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; c.fillStyle = k % 2 ? GOLD : '#ff9a3a'; poly(c, [[Math.cos(a - 0.12) * 66, 10 + b + Math.sin(a - 0.12) * 66], [Math.cos(a) * 94, 10 + b + Math.sin(a) * 94], [Math.cos(a + 0.12) * 66, 10 + b + Math.sin(a + 0.12) * 66]]); }
    c.fillStyle = fl ? C.paper : '#e0562a'; circ(c, 0, 10 + b, 66); c.fillStyle = GOLD; poly(c, [[-40, -40 + b], [-30, -90 + b], [-14, -42 + b]]); poly(c, [[40, -40 + b], [30, -90 + b], [14, -42 + b]]);
    c.fillStyle = '#fff'; circ(c, -24, 0 + b, 13); circ(c, 24, 0 + b, 13); c.fillStyle = OL; circ(c, -24, 2 + b, 6); circ(c, 24, 2 + b, 6); c.fillStyle = '#4a0a0a'; rrect(c, -34, 28 + b, 68, 26, 6); c.fillStyle = '#fff'; for (let k = 0; k < 5; k++) poly(c, [[-30 + k * 14, 28 + b], [-23 + k * 14, 28 + b], [-26.5 + k * 14, 38 + b]]);
  } else if (e.xk === 'cndrag') {
    const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'cracker' && q.spawn <= 0).length;
    if (n >= 4) { c.strokeStyle = 'rgba(255,230,120,' + (0.55 + 0.2 * Math.sin(t * 8)) + ')'; c.lineWidth = 6; c.beginPath(); c.arc(0, b, 96, 0, TAU); c.stroke(); }
    for (let k = 4; k >= 1; k--) { c.fillStyle = OL; circ(c, -k * 34, 40 + b + Math.sin(t * 3 + k) * 8, 30); c.fillStyle = fl ? C.paper : k % 2 ? RED9 : GOLD; circ(c, -k * 34, 40 + b + Math.sin(t * 3 + k) * 8, 26); }
    c.fillStyle = OL; circ(c, 0, b, 56); c.fillStyle = fl ? C.paper : RED9; circ(c, 0, b, 52); c.fillStyle = GOLD; poly(c, [[-30, -40 + b], [-22, -86 + b], [-6, -46 + b]]); poly(c, [[30, -40 + b], [22, -86 + b], [6, -46 + b]]);
    c.fillStyle = '#fff'; circ(c, -20, -8 + b, 11); circ(c, 20, -8 + b, 11); c.fillStyle = OL; circ(c, -20, -6 + b, 5); circ(c, 20, -6 + b, 5); c.strokeStyle = GOLD; c.lineWidth = 3; c.beginPath(); c.moveTo(-30, 22 + b); c.quadraticCurveTo(-60, 40 + b, -50, 66 + b); c.moveTo(30, 22 + b); c.quadraticCurveTo(60, 40 + b, 50, 66 + b); c.stroke(); c.fillStyle = '#4a0a0a'; rrect(c, -26, 18 + b, 52, 20, 5); c.fillStyle = GOLD; circ(c, 0, -34 + b, 7);
  } else {
    const open = e.open && L.time < e.open; c.fillStyle = open ? 'rgba(255,230,120,.28)' : 'rgba(214,51,43,.14)'; circ(c, 0, b, 112);
    c.fillStyle = OL; c.beginPath(); c.ellipse(0, b, 80, 92, 0, 0, TAU); c.fill(); c.fillStyle = fl ? C.paper : (open ? '#ff6a4a' : RED9); c.beginPath(); c.ellipse(0, b, 76, 88, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,210,120,.7)'; c.lineWidth = 3; for (let k = -2; k <= 2; k++) { c.beginPath(); c.ellipse(0, b, 76 * Math.abs(k) / 2.2 + 4, 88, 0, 0, TAU); c.stroke(); }
    c.fillStyle = GOLD; rrect(c, -34, -102 + b, 68, 18, 4); rrect(c, -34, 84 + b, 68, 18, 4); c.strokeStyle = GOLD; c.lineWidth = 4; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 12, 102 + b); c.lineTo(k * 12 + Math.sin(t * 3 + k) * 4, 130 + b); c.stroke(); }
    c.fillStyle = OL; c.font = '700 70px serif'; c.textAlign = 'center'; c.fillText('財', 0, 24 + b); if (open) { c.fillStyle = 'rgba(255,240,160,.85)'; circ(c, 0, b - 4, 26); c.fillStyle = OL; c.fillText('財', 0, 24 + b); }
  }
}
makeFest({
  theme: 22, name: '春節', pal: { ink: '#2a0e0e', floor: '#4a2624', floor2: '#552e2a', wall1: '#8a1f1a', wall2: '#c0322a', top: '#ffd24a', door: '#ffb02e' },
  amb: ['bandpass', 1300, 1.2, 0.004], ev: r => { const n = [392, 523, 659, 784][Math.floor(r() * 4)]; L.blip(n, n * 1.005, 0.4, 'triangle', 0.008); },
  skinMap: { crawler: 'cracker', shooter: 'redenv', brute: 'lion', bomber: 'cake', nianling: 'nianling', firework: 'firework' }, drawEnemy: drawCnyEnemy,
  bgDraw: cnyBg, zones: ['廟會街', '燈籠巷', '鞭炮坊', '舞台', '廟會市集', '團圓廣場'], zoneCol: 'rgba(255,210,120,.12)',
  obsKinds: [{ jk: 'lant', w: [36, 44], h: [48, 58] }, { jk: 'lant', w: [36, 44], h: [48, 58] }, { jk: 'drum', w: [44, 54], h: [44, 54] }, { jk: 'pole', w: [34, 44], h: [52, 66] }, { jk: 'pole', w: [34, 44], h: [52, 66] }],
  obsDraw: cnyObsDraw, bossObs: R => [[R.x + 110, R.y + 80], [R.x + R.w - 150, R.y + 80], [R.x + 110, R.y + R.h - 130], [R.x + R.w - 150, R.y + R.h - 130]].map(q => ({ x: q[0], y: q[1], w: 40, h: 54, jk: 'lant' }))
    .concat([{ x: R.x + R.w * 0.38, y: R.y + R.h / 2 - 150, w: 46, h: 46, jk: 'drum' }, { x: R.x + R.w * 0.38, y: R.y + R.h / 2 + 110, w: 46, h: 46, jk: 'drum' }, { x: R.x + R.w * 0.62, y: R.y + R.h / 2 - 40, w: 46, h: 46, jk: 'drum' }]),
  plantFor: cnyPlantFor, plantSmall: ['clant'], plantToast: '燈籠與春聯牆擋住了去路——打碎它，或等它消散（約 5 秒）', tobDraw: cnyTobDraw,
  aff: { w: ['crackerstick', 'fireworkgun', 'lanternbow', 'redpacket', 'couplance', 'flame', 'scatter', 'lance', 'firefly', 'blade', 'frostcane'], u: ['wick', 'oil', 'skpow'] },
  fx: [GOLD, RED9, '#ff9a3a'], nookMobs: ['crawler', 'nianling'], marketCol: ['#3a1a10', RED9, GOLD, '#ffe27a'],
  fac: { market: '廟會市集', pool: { name: '紅包池', noun: '紅包', verb: '抽紅包', fin: '紅包池已經空了' }, work: { name: '鞭炮坊', verb: '點燃引信', start: '引信點燃——巨大的舞獅衝出來了！', end: '鞭炮坊安靜了：留下一把武器', fin: '鞭炮坊已安靜' }, nook: { name: '灶神', verb: '獻供品', fin: '供品已經用完' }, rest: { name: '團圓桌', fin: '年夜飯已經吃完', r1: '年夜飯熱騰騰：燈火 +1、燈芯 +8', r2: '飯飽神足', r3: '桌下掉了一個大紅包：燈芯 +15' } },
  drawFac: drawCnyFac,
  bosses: {
    cnnian: { name: '年獸', type: 'barrage', achName: '除夕不怕', t: { fan: '爆竹扇！', ring: '煙火圈！', spiral: '紅光旋風！', lanes: '年獸衝街——看缺口！', rain: '煙火雨！' },
      intro: [{ who: '旁白', text: '鑼鼓聲突然停了。街口的燈籠被一陣腥風吹得亂晃，一個火紅的巨影壓了過來。' }, { who: '年獸', text: '吼——每年今天，都有人敢在我的地盤放炮！' }] },
    cndrag: { name: '舞龍隊長', type: 'swarm', achName: '收龍', t: { summon: '爆竹精列隊！', rally: '鑼鼓加速——爆竹精衝鋒！', army: '整串鞭炮點燃！', fan2: '彩球彈！' },
      intro: [{ who: '旁白', text: '長長的龍身在街上蜿蜒，後頭跟著一整排蹦蹦跳跳的爆竹精。' }, { who: '舞龍隊長', text: '龍頭要走到哪，隊伍就跟到哪！誰都別想擋路！' }, { who: '旁白', text: '只要爆竹精還圍著，龍頭就不怕傷害。' }] },
    cnlant: { name: '巨型燈籠', type: 'long', achName: '吹熄燈籠', t: { charge: '燈籠滾來——撞完後燈光大亮 3 秒是弱點，傷害 ×2！', soldiers: '小燈籠亮起來了！', ring2: '燈火環！', slam: '燈籠重壓！' },
      intro: [{ who: '旁白', text: '廣場中央，一盞比房子還高的大紅燈籠緩緩亮起，上面的「財」字閃著金光。' }, { who: '巨型燈籠', text: '燈火不滅，年不散……想吹熄我，先讓我亮起來。' }, { who: '旁白', text: '牠燈光大亮的瞬間，是最脆弱的時候。' }] }
  },
  swarmSkin: 'cracker', armTip: '爆竹精圍著龍頭——先清掉爆竹精，Boss 才會吃傷害', drawBoss: drawCnyBoss,
  events: [
    { id: 'riddle', name: '猜燈謎', toast: '猜燈謎：花 3 燈芯，猜一支謎', verb: '猜謎', col: '#b21f1a', glyph: '謎', desc: '花 3 燈芯猜一支謎：50% 強化、30% 燈芯 +8、20% 只得一顆糖；只能一次', fin: '燈謎已經猜過了', r1: '猜中了', r2: '安慰獎：燈芯 +8', r3: '猜錯了……送你一顆糖，燈芯 +1' },
    { id: 'dance', name: '舞獅表演', toast: '舞獅表演：站在旁邊看 5 秒', desc: '站在舞獅旁邊（150 像素內）看 5 秒，離開會倒退。看完：燈火 +1、燈芯 +10', fin: '表演結束了', done: '好彩頭：燈火 +1、燈芯 +10',
      draw: (c, it, tm) => { const j = Math.sin(tm * 5) * 4; c.fillStyle = RED9; c.beginPath(); c.ellipse(0, 6 + j, 28, 22, 0, 0, TAU); c.fill(); c.fillStyle = GOLD; for (let k = 0; k < 8; k++) circ(c, Math.cos(k / 8 * TAU) * 26, 6 + j + Math.sin(k / 8 * TAU) * 20, 3); c.fillStyle = '#fff'; circ(c, -9, 0 + j, 6); circ(c, 9, 0 + j, 6); c.fillStyle = OL; circ(c, -9, 1 + j, 3); circ(c, 9, 1 + j, 3); c.fillStyle = '#4a0a0a'; rrect(c, -12, 12 + j, 24, 8, 3); } },
    { id: 'dinner', name: '年夜飯攤', toast: '年夜飯攤：花 6 燈芯，吃一頓團圓飯', verb: '吃年夜飯', col: '#c8503a', glyph: '飯', desc: '花 6 燈芯：燈火 +2、技能冷卻重置；只能一次', fin: '年夜飯吃完了', done: '年夜飯：燈火 +2、技能冷卻重置' }
  ],
  weapons: {
    crackerstick: { id: 'crackerstick', name: '鞭炮棍', tag: '近戰', mode: 'tap', cd: 0.45, th: 22, col: '#ff6a3a', range: 135, half: 1.3, dmg: 3.7, kb: 340, desc: '大範圍的弧形揮砍（春節專屬，類似提燈刃）' },
    fireworkgun: { id: 'fireworkgun', name: '煙火筒', tag: '單發', mode: 'tap', cd: 0.38, th: 22, col: GOLD, desc: '單發的煙火彈，傷害高（春節專屬，類似燈焰杖）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 560, 9, 3.9 * dm, 'flame', 1.0); L.sfx('flame'); } },
    lanternbow: { id: 'lanternbow', name: '燈籠弓', tag: '連射', mode: 'auto', cd: 0.11, th: 22, col: '#ff8a3a', desc: '按住連射小燈籠火，射速快（春節專屬，類似螢火弓）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang + (rand() - 0.5) * 0.07, 720, 4, 1.15 * dm, 'pellet', 0.8); L.sfx('tick'); } },
    redpacket: { id: 'redpacket', name: '紅包散彈', tag: '散射', mode: 'tap', cd: 0.62, th: 22, col: RED9, desc: '五發紅包散射，近距離很痛（春節專屬，類似霰光杖）',
      fire: (ox, oy, ang, dm) => { for (let i = -2; i <= 2; i++) L.shoot(ox, oy, ang + i * 0.16, 520, 6, 1.9 * dm, 'pellet', 0.55); L.sfx('blade'); } },
    couplance: { id: 'couplance', name: '春聯長矛', tag: '貫穿', mode: 'tap', cd: 0.75, th: 22, col: '#ffb02e', desc: '貫穿一整排敵人的長矛（春節專屬，類似穿光矛）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 700, 8, 4.6 * dm, 'lance', 0.95, true); L.sfx('blade'); } }
  },
  achIds: ['cnNian', 'cnDrag', 'cnLant', 'cnFac'], facAch: ['新年好幫手', '同一局完成紅包池與鞭炮坊'],
  ext: { nianling: { hp: 7, r: 15, name: '小年獸', cost: 3, cap: 3, ai: 'dasher' }, firework: { hp: 9, r: 15, name: '煙火筒', cost: 3, cap: 3, ai: 'caster' } },
  story: [
    [{ who: '旁白', text: '除夕的黃昏，整條街掛滿了紅燈籠。鑼鼓聲從遠處傳來，空氣裡有鞭炮與糖炒栗子的味道。' }, { who: '攤販', text: '提燈的旅人！爆竹自己跑出去了，年貨攤都被攪得亂七八糟——幫忙收拾一下吧！' }],
    [{ who: '旁白', text: '夜越深，燈籠越亮，街上的人影卻越來越少。有些聲音，好像在等著什麼人回家。' }, { who: '攤販', text: '最大的那一盞燈籠，從傍晚就一直亮著。大家都說，那是在等一個沒回來的人。' }]
  ],
  shards: ['紅包便條：我把壓歲錢藏在枕頭下，結果過年那天，枕頭不見了。', '紅包便條：年獸其實不怕鞭炮，只是想有人陪牠守歲。', '紅包便條：舞獅的頭很重，但抬頭的人說，那是全年最輕的一天。', '紅包便條：燈籠不是為了照路，是為了讓遠方的人看見家。'],
  outro: [{ who: '攤販', text: '天亮了，燈籠一盞一盞熄了。新年好，旅人。' }, { who: '旁白', text: '街上的鞭炮碎屑像一地紅色的花瓣，你的燈在其中，安靜地亮著。' }]
});

/* ================= 中秋（23）：全亮、月下庭院、三隻 Boss（彈幕／大群／長戰）；月光只是裝飾 ================= */
const MN = '#f6e6a8', NAVY = '#1c2644';
function drawMidEnemy(e) {
  const c = L.ctx, r = e.r, f = e.flash > 0, sk = e.skin, tm = e.t, fa = Math.atan2(L.p.y - e.y, L.p.x - e.x);
  if (sk === 'rabbit') {
    const sw = Math.sin(tm * 10) * 2; c.fillStyle = OL; rrect(c, -r * 0.6, -r * 1.9, r * 0.4, r * 1.2, 3); rrect(c, r * 0.2, -r * 1.9, r * 0.4, r * 1.2, 3); circ(c, 0, 0, r * 1.08); c.fillStyle = f ? C.paper : '#f6f2ee'; rrect(c, -r * 0.55, -r * 1.85, r * 0.3, r * 1.1, 3); rrect(c, r * 0.25, -r * 1.85, r * 0.3, r * 1.1, 3); circ(c, 0, 0, r);
    c.fillStyle = '#f4a8b8'; rrect(c, -r * 0.5, -r * 1.6, r * 0.18, r * 0.8, 2); rrect(c, r * 0.32, -r * 1.6, r * 0.18, r * 0.8, 2); c.fillStyle = '#e03a3a'; circ(c, -r * 0.3, -r * 0.1, 3); circ(c, r * 0.3, -r * 0.1, 3); c.fillStyle = '#f4a8b8'; circ(c, 0, r * 0.2, 2.5); c.fillStyle = '#d8c8a8'; c.fillRect(r * 0.5 + sw, r * 0.4, 3, r * 0.9); c.fillStyle = '#b89868'; circ(c, r * 0.5 + 1.5 + sw, r * 1.35, 4);
  } else if (sk === 'osmanthus') {
    c.fillStyle = OL; circ(c, 0, r * 0.1, r * 1.1); c.fillStyle = f ? C.paper : '#4a8a3a'; circ(c, 0, r * 0.1, r); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + tm; c.fillStyle = f ? C.paper : '#ffc83a'; circ(c, Math.cos(a) * r * 0.75, r * 0.1 + Math.sin(a) * r * 0.75, r * 0.26); }
    c.fillStyle = '#ffe27a'; circ(c, 0, r * 0.1, r * 0.5); c.fillStyle = OL; circ(c, -r * 0.18, 0, 2.2); circ(c, r * 0.18, 0, 2.2); const g = 0.6 + 0.4 * Math.sin(tm * 6); c.fillStyle = 'rgba(255,220,90,' + g + ')'; star4(c, Math.cos(fa) * r * 1.35, Math.sin(fa) * r * 1.35, r * 0.35, tm * 2);
  } else if (sk === 'hound') {
    c.fillStyle = OL; circ(c, 0, 0, r * 1.12); poly(c, [[-r * 0.8, -r * 0.5], [-r * 0.5, -r * 1.3], [-r * 0.15, -r * 0.7]]); poly(c, [[r * 0.8, -r * 0.5], [r * 0.5, -r * 1.3], [r * 0.15, -r * 0.7]]); c.fillStyle = f ? C.paper : '#3a3a5a'; circ(c, 0, 0, r); poly(c, [[-r * 0.72, -r * 0.5], [-r * 0.5, -r * 1.15], [-r * 0.2, -r * 0.7]]); poly(c, [[r * 0.72, -r * 0.5], [r * 0.5, -r * 1.15], [r * 0.2, -r * 0.7]]);
    c.fillStyle = MN; c.beginPath(); c.arc(0, -r * 0.1, r * 0.5, 0.6, TAU - 0.6); c.fill(); c.fillStyle = '#ff6a6a'; circ(c, -r * 0.35, -r * 0.2, 3.5); circ(c, r * 0.35, -r * 0.2, 3.5); c.fillStyle = '#fff'; for (let k = 0; k < 4; k++) c.fillRect(-r * 0.4 + k * r * 0.26, r * 0.4, 3, 6);
  } else if (sk === 'mooncake') {
    c.fillStyle = OL; circ(c, 0, 2, r * 1.1); c.fillStyle = f ? C.paper : '#c8873a'; circ(c, 0, 2, r); c.fillStyle = '#e8b062'; circ(c, 0, 2, r * 0.75); c.fillStyle = '#9a5a1a'; c.font = '700 ' + Math.round(r) + 'px serif'; c.textAlign = 'center'; c.fillText('月', 0, r * 0.4); c.strokeStyle = '#9a5a1a'; c.lineWidth = 2; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; c.beginPath(); c.moveTo(Math.cos(a) * r * 0.85, 2 + Math.sin(a) * r * 0.85); c.lineTo(Math.cos(a) * r * 0.98, 2 + Math.sin(a) * r * 0.98); c.stroke(); }
  } else if (sk === 'toad') {
    const a = e.ra || fa; if (e.tele > 0) { c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#9fffb0'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 260, Math.sin(a) * 260); c.stroke(); c.restore(); }
    c.fillStyle = OL; c.beginPath(); c.ellipse(0, 4, r * 1.25, r * 0.95, 0, 0, TAU); c.fill(); c.fillStyle = f ? C.paper : '#5a9a4a'; c.beginPath(); c.ellipse(0, 4, r * 1.15, r * 0.85, 0, 0, TAU); c.fill(); c.fillStyle = '#7ab86a'; circ(c, -r * 0.45, -r * 0.55, r * 0.35); circ(c, r * 0.45, -r * 0.55, r * 0.35); c.fillStyle = '#ffe27a'; circ(c, -r * 0.45, -r * 0.6, r * 0.2); circ(c, r * 0.45, -r * 0.6, r * 0.2); c.fillStyle = OL; circ(c, -r * 0.45, -r * 0.6, 2.5); circ(c, r * 0.45, -r * 0.6, 2.5); c.fillStyle = '#3a6a30'; for (let k = 0; k < 5; k++) circ(c, -r * 0.6 + k * r * 0.3, r * 0.3 + (k % 2) * 4, 3);
  } else { // spirit
    const g = 0.7 + 0.3 * Math.sin(tm * 5); c.fillStyle = 'rgba(160,190,255,' + (0.25 * g) + ')'; circ(c, 0, 0, r * 1.7); c.fillStyle = OL; circ(c, 0, 0, r * 1.05); c.fillStyle = f ? C.paper : '#dce6ff'; circ(c, 0, 0, r); c.fillStyle = f ? C.paper : NAVY; c.beginPath(); c.arc(r * 0.3, -r * 0.05, r * 0.8, 0, TAU); c.fill(); c.fillStyle = f ? C.paper : '#dce6ff'; c.beginPath(); c.arc(-r * 0.05, 0, r * 0.85, 0.9, TAU - 0.9); c.fill(); c.fillStyle = OL; circ(c, -r * 0.3, -r * 0.1, 2.5);
    if (e.tele > 0) { c.fillStyle = 'rgba(160,190,255,.7)'; circ(c, Math.cos(fa) * r * 1.4, Math.sin(fa) * r * 1.4, r * 0.4); }
  }
}
function midBg(g, R, rng, arR) {
  for (let i = 0; i < Math.round(120 * arR); i++) { g.fillStyle = 'rgba(255,245,200,' + (0.2 + rng() * 0.5) + ')'; const sz = 1.5 + rng() * 2.5; g.fillRect(R.x + rng() * R.w, R.y + rng() * R.h, sz, sz); }
  for (let k = 0; k < Math.round(9 * arR); k++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h, gr = g.createRadialGradient(x, y, 0, x, y, 240); gr.addColorStop(0, 'rgba(246,230,168,.22)'); gr.addColorStop(1, 'rgba(246,230,168,0)'); g.fillStyle = gr; g.fillRect(x - 240, y - 240, 480, 480); }
  for (let i = 0; i < Math.round(50 * arR); i++) { const x = R.x + rng() * R.w, y = R.y + rng() * R.h; g.fillStyle = 'rgba(255,200,60,.4)'; circ(g, x, y, 2.5); circ(g, x + 4, y + 2, 2); circ(g, x - 3, y + 3, 2); }
}
function midObsDraw(g, o) {
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
  if (o.jk === 'rlant') {
    g.fillStyle = OL; g.fillRect(cx - 2, o.y - 6, 4, 8); circ(g, cx, cy + 4, o.w / 2 + 2); g.fillStyle = '#f6f2ee'; circ(g, cx, cy + 4, o.w / 2 - 1); g.fillStyle = '#e8d8a8'; circ(g, cx, cy + 4, o.w / 2 - 6); g.fillStyle = OL; g.fillRect(cx - o.w * 0.28, o.y - 8, 5, 18); g.fillRect(cx + o.w * 0.2, o.y - 8, 5, 18); g.fillStyle = '#f4a8b8'; g.fillRect(cx - o.w * 0.27, o.y - 6, 3, 12); g.fillRect(cx + o.w * 0.21, o.y - 6, 3, 12);
    g.fillStyle = 'rgba(255,230,140,.3)'; circ(g, cx, cy + 4, o.w / 2 + 10);
  } else if (o.jk === 'table') {
    g.fillStyle = OL; g.beginPath(); g.ellipse(cx, cy, o.w / 2 + 2, o.h / 2 + 2, 0, 0, TAU); g.fill(); g.fillStyle = '#8a8a9a'; g.beginPath(); g.ellipse(cx, cy, o.w / 2, o.h / 2, 0, 0, TAU); g.fill(); g.fillStyle = '#b4b4c4'; g.beginPath(); g.ellipse(cx, cy - 3, o.w / 2 - 4, o.h / 2 - 6, 0, 0, TAU); g.fill(); g.fillStyle = '#e8b062'; circ(g, cx - 8, cy - 4, 6); circ(g, cx + 6, cy - 1, 6);
  } else {
    g.fillStyle = '#1e4a2a'; circ(g, cx - o.w * 0.2, cy + 2, o.h * 0.5); circ(g, cx + o.w * 0.2, cy + 2, o.h * 0.5); circ(g, cx, cy - o.h * 0.15, o.h * 0.55); g.fillStyle = '#3a7a3a'; circ(g, cx - o.w * 0.2, cy, o.h * 0.43); circ(g, cx + o.w * 0.2, cy, o.h * 0.43); circ(g, cx, cy - o.h * 0.18, o.h * 0.47); g.fillStyle = '#ffc83a'; for (let k = 0; k < 7; k++) circ(g, cx + Math.sin(k * 2.1) * o.w * 0.3, cy + Math.cos(k * 1.7) * o.h * 0.25, 2.6);
  }
}
function midTobDraw(o, ctx, cx, cy, f) {
  if (o.kind === 'mlant') {
    ctx.fillStyle = f ? C.paper : OL; circ(ctx, cx, cy, 25); ctx.fillStyle = f ? C.paper : '#f6f2ee'; circ(ctx, cx, cy, 22); ctx.fillStyle = f ? C.paper : '#f4a8b8'; ctx.fillRect(cx - 14, cy - 36, 7, 18); ctx.fillRect(cx + 7, cy - 36, 7, 18); ctx.fillStyle = 'rgba(255,230,140,.4)'; circ(ctx, cx, cy, 15); ctx.fillStyle = '#e03a3a'; circ(ctx, cx - 7, cy - 3, 2.5); circ(ctx, cx + 7, cy - 3, 2.5); return true;
  }
  if (o.kind === 'mcass') {
    const hz = o.w > o.h, n = hz ? 3 : 4; for (let k = 0; k < n; k++) { const t0 = (k + 0.5) / n, tx = hz ? o.x + o.w * t0 : cx, ty = hz ? cy : o.y + o.h * t0; ctx.fillStyle = f ? C.paper : '#1e4a2a'; circ(ctx, tx, ty, 19); ctx.fillStyle = f ? C.paper : '#3a7a3a'; circ(ctx, tx - 2, ty - 2, 15); ctx.fillStyle = '#ffc83a'; circ(ctx, tx + 5, ty - 5, 3.5); circ(ctx, tx - 6, ty + 4, 3); } return true;
  }
  return false;
}
function midPlantFor(e, p, ux, uy, plant) { if (e.type === 'shooter') plant('mlant', p.x + ux * 130, p.y + uy * 130, 46, 46); else { const horiz = Math.abs(ux) > Math.abs(uy); plant('mcass', p.x + ux * 150, p.y + uy * 150, horiz ? 30 : 100, horiz ? 100 : 30); } }
function drawMidFac(c, it, tm, done) {
  if (it.fk === 'pool') {
    c.fillStyle = '#6a6a7a'; rrect(c, -46, -4, 92, 26, 4); c.fillStyle = '#9a9aaa'; rrect(c, -46, -8, 92, 10, 4); const items = ['#e8b062', '#f6f2ee', '#ff9a3a'];
    for (let k = 0; k < 3; k++) { const lit = done || k < it.n; c.fillStyle = lit ? MN : items[k]; circ(c, -26 + k * 26, -18, 11); if (lit) { c.fillStyle = 'rgba(255,240,170,.5)'; circ(c, -26 + k * 26, -18, 18 + Math.sin(tm * 4 + k) * 2); c.fillStyle = '#fff'; star4(c, -26 + k * 26, -42 + Math.sin(tm * 4) * 2, 6, tm); } }
  } else if (it.fk === 'work') {
    c.fillStyle = '#6a5a4a'; c.beginPath(); c.moveTo(-34, -12); c.lineTo(34, -12); c.lineTo(26, 24); c.lineTo(-26, 24); c.fill(); c.fillStyle = '#8a7a6a'; c.beginPath(); c.ellipse(0, -12, 34, 10, 0, 0, TAU); c.fill(); c.fillStyle = '#3a8a4a'; c.beginPath(); c.ellipse(0, -13, 26, 6, 0, 0, TAU); c.fill(); c.fillStyle = '#d8c8a8'; c.save(); c.translate(14, -26); c.rotate(-0.4 + Math.sin(tm * 3) * 0.15); c.fillRect(-4, -30, 8, 44); c.fillStyle = '#b89868'; circ(c, 0, 14, 8); c.restore();
  } else if (it.fk === 'nook') {
    c.fillStyle = '#7a4a2a'; c.beginPath(); c.ellipse(0, 4, 32, 30, 0, 0, TAU); c.fill(); c.fillStyle = '#9a6a3a'; c.beginPath(); c.ellipse(0, 2, 28, 26, 0, 0, TAU); c.fill(); c.fillStyle = '#c8302a'; rrect(c, -14, -12, 28, 22, 3); c.fillStyle = GOLD; c.font = '700 14px serif'; c.textAlign = 'center'; c.fillText('桂', 0, 5); c.fillStyle = '#5a3a1a'; rrect(c, -12, -32, 24, 10, 3); c.fillStyle = '#ffc83a'; for (let k = 0; k < 3; k++) circ(c, -8 + k * 8, -36 - Math.sin(tm * 3 + k) * 2, 2.5);
  } else {
    c.fillStyle = '#6a3a2a'; for (const sx of [-34, 34]) c.fillRect(sx - 3, -20, 6, 44); c.fillStyle = '#c8302a'; poly(c, [[-46, -18], [0, -48], [46, -18]]); c.fillStyle = GOLD; c.fillRect(-46, -20, 92, 4); c.fillStyle = '#b89868'; rrect(c, -30, 6, 60, 12, 3); const warm = done || it.t > 2; c.fillStyle = 'rgba(246,230,168,' + (warm ? 0.8 : 0.4) + ')'; circ(c, 0, -26, 10 + (warm ? Math.sin(tm * 4) * 1.5 : 0));
  }
}
function drawMidBoss(e) {
  const c = L.ctx, fl = e.flash > 0, t = e.t, b = Math.sin(t * 2) * 5;
  if (e.xk === 'cmchang') {
    c.fillStyle = 'rgba(246,230,168,.2)'; circ(c, 0, b - 10, 112); c.strokeStyle = 'rgba(246,230,168,.7)'; c.lineWidth = 4; c.beginPath(); c.arc(0, b - 10, 100, 0, TAU); c.stroke();
    c.fillStyle = OL; c.beginPath(); c.moveTo(-34, -6 + b); c.quadraticCurveTo(-110, 40 + b, -70, 100 + b); c.lineTo(70, 100 + b); c.quadraticCurveTo(110, 40 + b, 34, -6 + b); c.fill();
    c.fillStyle = fl ? C.paper : '#e8f0ff'; c.beginPath(); c.moveTo(-30, -4 + b); c.quadraticCurveTo(-104, 40 + b, -64, 96 + b); c.lineTo(64, 96 + b); c.quadraticCurveTo(104, 40 + b, 30, -4 + b); c.fill(); c.fillStyle = fl ? C.paper : '#f4a8c8'; c.beginPath(); c.moveTo(-18, 0 + b); c.lineTo(18, 0 + b); c.lineTo(34, 96 + b); c.lineTo(-34, 96 + b); c.fill();
    c.fillStyle = fl ? C.paper : '#f2d8c0'; circ(c, 0, -30 + b, 28); c.fillStyle = '#1a1a2a'; c.beginPath(); c.arc(0, -36 + b, 30, Math.PI, TAU); c.fill(); circ(c, -24, -26 + b, 10); circ(c, 24, -26 + b, 10); c.fillStyle = GOLD; for (let k = -1; k <= 1; k++) circ(c, k * 12, -62 + b, 4); c.fillStyle = OL; circ(c, -9, -28 + b, 3); circ(c, 9, -28 + b, 3); c.fillStyle = '#e07a8a'; circ(c, 0, -18 + b, 3);
  } else if (e.xk === 'cmrabbit') {
    const n = L.enemies.filter(q => !q.dead && q.type !== 'boss' && q.skin === 'rabbit' && q.spawn <= 0).length;
    if (n >= 4) { c.strokeStyle = 'rgba(255,240,170,' + (0.55 + 0.2 * Math.sin(t * 8)) + ')'; c.lineWidth = 6; c.beginPath(); c.arc(0, b, 96, 0, TAU); c.stroke(); }
    c.fillStyle = OL; rrect(c, -44, -128 + b, 30, 84, 14); rrect(c, 14, -128 + b, 30, 84, 14); circ(c, 0, 14 + b, 70); c.fillStyle = fl ? C.paper : '#f6f2ee'; rrect(c, -41, -124 + b, 24, 78, 12); rrect(c, 17, -124 + b, 24, 78, 12); circ(c, 0, 14 + b, 65); c.fillStyle = '#f4a8b8'; rrect(c, -36, -112 + b, 14, 56, 7); rrect(c, 22, -112 + b, 14, 56, 7);
    c.fillStyle = '#e03a3a'; circ(c, -22, 4 + b, 6); circ(c, 22, 4 + b, 6); c.fillStyle = '#f4a8b8'; circ(c, 0, 18 + b, 6); c.fillStyle = '#7a6a5a'; c.beginPath(); c.moveTo(-40, 50 + b); c.lineTo(40, 50 + b); c.lineTo(30, 92 + b); c.lineTo(-30, 92 + b); c.fill(); c.fillStyle = '#3a8a4a'; c.beginPath(); c.ellipse(0, 50 + b, 40, 9, 0, 0, TAU); c.fill(); c.save(); c.translate(48, 40 + b); c.rotate(-0.5 + Math.sin(t * 4) * 0.25); c.fillStyle = '#d8c8a8'; c.fillRect(-5, -52, 10, 74); c.fillStyle = '#b89868'; circ(c, 0, 22, 11); c.restore();
  } else {
    const open = e.open && L.time < e.open; c.fillStyle = open ? 'rgba(255,230,120,.28)' : 'rgba(246,230,168,.14)'; circ(c, 0, b, 115);
    c.fillStyle = OL; rrect(c, -30, -20 + b, 60, 120, 8); c.fillStyle = fl ? C.paper : '#7a5a3a'; rrect(c, -26, -16 + b, 52, 112, 6); c.fillStyle = '#5a3a1a'; for (let k = 0; k < 5; k++) c.fillRect(-26, -4 + k * 22 + b, 52, 3);
    for (const [x, y, rad] of [[-52, -52, 56], [52, -56, 54], [0, -92, 62], [-30, -26, 42], [34, -22, 44]]) { c.fillStyle = OL; circ(c, x, y + b, rad + 3); } for (const [x, y, rad] of [[-52, -52, 56], [52, -56, 54], [0, -92, 62], [-30, -26, 42], [34, -22, 44]]) { c.fillStyle = fl ? C.paper : (open ? '#7ac85a' : '#3a7a3a'); circ(c, x, y + b, rad); }
    c.fillStyle = open ? '#fff2a0' : '#ffc83a'; for (let k = 0; k < 14; k++) circ(c, Math.sin(k * 2.3) * 70, -50 + Math.cos(k * 1.9) * 50 + b, open ? 5 : 3.2);
    c.fillStyle = OL; circ(c, -10, 20 + b, 4); circ(c, 10, 20 + b, 4); c.fillRect(-9, 34 + b, 18, 4); c.save(); c.translate(36, 52 + b); c.rotate(0.6); c.fillStyle = '#8a8a9a'; c.fillRect(-3, -38, 6, 52); c.fillStyle = '#c8c8d8'; poly(c, [[-3, -38], [-26, -30], [-26, -14], [-3, -10]]); c.restore();
  }
}
makeFest({
  theme: 23, name: '中秋', pal: { ink: '#0e1428', floor: '#1e2a44', floor2: '#25324e', wall1: '#2a3a66', wall2: '#4a5a98', top: '#f6e6a8', door: '#ffd98a' },
  amb: ['bandpass', 1100, 1.0, 0.004], ev: r => { const n = [440, 554, 659, 880][Math.floor(r() * 4)]; L.blip(n, n * 1.003, 0.8, 'sine', 0.007); },
  skinMap: { crawler: 'rabbit', shooter: 'osmanthus', brute: 'hound', bomber: 'mooncake', toad: 'toad', spirit: 'spirit' }, drawEnemy: drawMidEnemy,
  bgDraw: midBg, zones: ['桂花林', '月下池塘', '搗藥坊', '涼亭', '月餅市集', '賞月廣場'], zoneCol: 'rgba(246,230,168,.10)',
  obsKinds: [{ jk: 'rlant', w: [38, 46], h: [48, 58] }, { jk: 'table', w: [46, 56], h: [40, 48] }, { jk: 'cass', w: [44, 58], h: [40, 52] }, { jk: 'cass', w: [44, 58], h: [40, 52] }, { jk: 'rlant', w: [38, 46], h: [48, 58] }],
  obsDraw: midObsDraw, bossObs: R => [[R.x + 110, R.y + 80], [R.x + R.w - 150, R.y + 80], [R.x + 110, R.y + R.h - 130], [R.x + R.w - 150, R.y + R.h - 130]].map(q => ({ x: q[0], y: q[1], w: 42, h: 52, jk: 'rlant' }))
    .concat([{ x: R.x + R.w * 0.38, y: R.y + R.h / 2 - 150, w: 50, h: 44, jk: 'table' }, { x: R.x + R.w * 0.38, y: R.y + R.h / 2 + 110, w: 50, h: 44, jk: 'table' }, { x: R.x + R.w * 0.62, y: R.y + R.h / 2 - 40, w: 50, h: 44, jk: 'table' }]),
  plantFor: midPlantFor, plantSmall: ['mlant'], plantToast: '兔子燈與桂樹牆擋住了去路——打碎它，或等它消散（約 5 秒）', tobDraw: midTobDraw,
  aff: { w: ['pestle', 'mooncakegun', 'osmbow', 'rabbitshot', 'cassiaspear', 'flame', 'scatter', 'lance', 'firefly', 'blade', 'frostcane'], u: ['wick', 'oil', 'skpow'] },
  fx: [MN, '#c8a050', '#9fb8ff'], nookMobs: ['crawler', 'spirit'], marketCol: ['#1a2240', '#c8a050', '#f0d890', '#ffe9a0'],
  fac: { market: '月餅市集', pool: { name: '拜月台', noun: '供品', verb: '上供', fin: '拜月台已經供滿了' }, work: { name: '搗藥坊', verb: '敲響藥臼', start: '藥臼震動——巨大的月影衝出來了！', end: '搗藥坊安靜了：留下一把武器', fin: '搗藥坊已安靜' }, nook: { name: '桂花釀甕', verb: '舀一杯', fin: '酒甕已經空了' }, rest: { name: '賞月涼亭', fin: '月已西斜', r1: '月光暖暖的：燈火 +1、燈芯 +8', r2: '賞月暢懷', r3: '亭下掉了一盒月餅：燈芯 +15' } },
  drawFac: drawMidFac,
  bosses: {
    cmchang: { name: '嫦娥', type: 'barrage', achName: '月下相見', t: { fan: '月華扇！', ring: '月暈環！', spiral: '桂花旋風！', lanes: '廣袖橫掃——看缺口！', rain: '月光雨！' },
      intro: [{ who: '旁白', text: '月光忽然變得很亮。庭院中央，一位白衣的身影懸在半空，袖子在無風的夜裡輕輕飄動。' }, { who: '嫦娥', text: '他說好中秋要上來看我。我等了一整晚，連他的影子都沒見到！' }, { who: '嫦娥', text: '……你替他來的嗎？那就先接我這一招吧！' }] },
    cmrabbit: { name: '玉兔搗藥軍', type: 'swarm', achName: '停下藥杵', t: { summon: '月兔列隊！', rally: '藥杵加速——月兔衝鋒！', army: '全員出動！', fan2: '藥丸彈！' },
      intro: [{ who: '旁白', text: '搗藥坊裡，巨大的玉兔高舉藥杵，身後跟著整排圓滾滾的小月兔。' }, { who: '玉兔', text: '兩位大人都在生氣，藥搗不好，我們也不敢停……你快走開！' }, { who: '旁白', text: '只要月兔還圍著，玉兔就不怕傷害。' }] },
    cmwu: { name: '吳剛的桂樹', type: 'long', achName: '砍倒桂樹', t: { charge: '桂樹壓來——撞完後桂花紛落 3 秒是弱點，傷害 ×2！', soldiers: '桂花精冒出來了！', ring2: '落花環！', slam: '桂樹重壓！' },
      intro: [{ who: '旁白', text: '月光下，一棵高得看不見頂的桂樹，樹幹上插著一把生鏽的斧頭。' }, { who: '吳剛', text: '她說今晚會下來看這棵樹。我砍了一輩子，就是為了等這一刻——人呢？她沒來！' }, { who: '旁白', text: '桂花紛紛落下的瞬間，是最脆弱的時候。' }] }
  },
  swarmSkin: 'rabbit', armTip: '月兔們圍著玉兔——先清掉月兔，Boss 才會吃傷害', drawBoss: drawMidBoss,
  events: [
    { id: 'herb', name: '玉兔換藥', toast: '玉兔換藥：花 3 燈芯，換一包藥草', verb: '換藥', col: '#4a7a4a', glyph: '藥', desc: '花 3 燈芯換一包藥草：50% 強化、30% 燈芯 +8、20% 只是普通桂花（燈芯 +1）；只能一次', fin: '藥草已經換過了', r1: '藥草有效', r2: '藥草裡藏著燈芯 +8', r3: '只是普通桂花……燈芯 +1' },
    { id: 'view', name: '賞月石凳', toast: '賞月石凳：坐在旁邊賞月 5 秒', desc: '站在石凳旁（150 像素內）賞月 5 秒，離開會倒退。完成：燈火 +1、燈芯 +10', fin: '月已經賞過了', done: '月色真美：燈火 +1、燈芯 +10',
      draw: (c, it, tm) => { c.fillStyle = '#8a8a9a'; rrect(c, -26, 4, 52, 14, 4); c.fillStyle = '#6a6a7a'; c.fillRect(-20, 16, 8, 10); c.fillRect(12, 16, 8, 10); c.fillStyle = 'rgba(246,230,168,.5)'; circ(c, 0, -22, 20 + Math.sin(tm * 3) * 2); c.fillStyle = MN; circ(c, 0, -22, 14); c.fillStyle = '#e8d890'; circ(c, -4, -24, 3); circ(c, 4, -18, 2.5); } },
    { id: 'cake', name: '月餅攤', toast: '月餅攤：花 6 燈芯，吃一塊月餅', verb: '買月餅', col: '#c8873a', glyph: '餅', desc: '花 6 燈芯：燈火 +2、技能冷卻重置；只能一次', fin: '月餅賣完了', done: '月餅：燈火 +2、技能冷卻重置' }
  ],
  weapons: {
    pestle: { id: 'pestle', name: '搗藥杵', tag: '近戰', mode: 'tap', cd: 0.45, th: 23, col: '#d8c8a8', range: 135, half: 1.3, dmg: 3.7, kb: 340, desc: '大範圍的弧形揮砍（中秋專屬，類似提燈刃）' },
    mooncakegun: { id: 'mooncakegun', name: '月餅砲', tag: '單發', mode: 'tap', cd: 0.38, th: 23, col: '#e8b062', desc: '單發的月餅，傷害高（中秋專屬，類似燈焰杖）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 560, 9, 3.9 * dm, 'flame', 1.0); L.sfx('flame'); } },
    osmbow: { id: 'osmbow', name: '桂花弓', tag: '連射', mode: 'auto', cd: 0.11, th: 23, col: '#ffc83a', desc: '按住連射桂花，射速快（中秋專屬，類似螢火弓）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang + (rand() - 0.5) * 0.07, 720, 4, 1.15 * dm, 'pellet', 0.8); L.sfx('tick'); } },
    rabbitshot: { id: 'rabbitshot', name: '玉兔散彈', tag: '散射', mode: 'tap', cd: 0.62, th: 23, col: '#f6f2ee', desc: '五發月光散射，近距離很痛（中秋專屬，類似霰光杖）',
      fire: (ox, oy, ang, dm) => { for (let i = -2; i <= 2; i++) L.shoot(ox, oy, ang + i * 0.16, 520, 6, 1.9 * dm, 'pellet', 0.55); L.sfx('blade'); } },
    cassiaspear: { id: 'cassiaspear', name: '桂枝長矛', tag: '貫穿', mode: 'tap', cd: 0.75, th: 23, col: '#9fe0a0', desc: '貫穿一整排敵人的桂枝長矛（中秋專屬，類似穿光矛）',
      fire: (ox, oy, ang, dm) => { L.shoot(ox, oy, ang, 700, 8, 4.6 * dm, 'lance', 0.95, true); L.sfx('blade'); } }
  },
  achIds: ['cmChang', 'cmArmy', 'cmWu', 'cmFac'], facAch: ['中秋小幫手', '同一局完成拜月台與搗藥坊'],
  ext: { toad: { hp: 7, r: 15, name: '蟾蜍', cost: 3, cap: 3, ai: 'dasher' }, spirit: { hp: 8, r: 14, name: '月影', cost: 3, cap: 3, ai: 'floater' } },
  story: [
    [{ who: '旁白', text: '中秋夜，月亮大得像要掉進庭院裡。桂花的香味一陣一陣飄過來，遠處有人在烤肉、有人在猜燈謎。' }, { who: '玉兔', text: '提燈的旅人！月餅和藥草全被打翻了，有些東西在庭院裡亂跑，請你幫忙收拾！' }],
    [{ who: '旁白', text: '月越升越高，庭院的影子越拉越長。有兩個影子，一個在天的這一頭，一個在那一頭，怎麼也碰不到一起。' }, { who: '玉兔', text: '嫦娥大人和吳剛大人，每年今天都在等彼此，可是每年都剛好錯過……今年他們都氣壞了。' }]
  ],
  shards: ['月餅便條：我說好今晚會來，結果月亮太亮，我迷路了。', '月餅便條：桂樹砍不倒不是因為樹太硬，是因為我捨不得它倒。', '月餅便條：兔子搗了一千年的藥，其實只是想找個人說說話。', '月餅便條：月亮每個月都會變圓一次，等的人也是。'],
  outro: [{ who: '嫦娥', text: '……我看見他了。原來他的影子，一直就在樹下。' }, { who: '吳剛', text: '她也在。原來她，一直就在月亮上面。' }, { who: '旁白', text: '你的燈光落在兩人之間，影子終於碰在了一起。庭院裡的桂花，落了一整夜。' }]
});
})();
