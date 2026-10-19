// 整局機器人：window.__run({cls, dlc, maxSim, stallSim}) → 結果物件
// 需要 tools/tests/prep.py 產生的測試版（window.__t 掛鉤）。
(() => {
const t = window.__t;
window.__botAim = true;
function fightFrame(P, R, f, st, skillStat, sim) {
  const keys = t.keys, dt = 0.016;
  const en = t.enemies.filter(e => !e.dead && e.spawn <= 0);
  let best = null, bd = 1e9; for (const e of en) { const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < bd) { bd = d; best = e; } }
  keys.w = keys.a = keys.s = keys.d = false; keys.f = true; t.fEdge = 0.16; P.near = null;
  let mx = 0, my = 0;
  if (best) {
    const W = t.WDEF[P.weapons[P.w]] || {};
    const mel = !!W.range || ['shears', 'pillow', 'blade', 'pblade', 'shadeblade', 'frostcane', 'dance', 'pole', 'whip', 'beatstick', 'courierknife', 'syrup'].includes(W.id);
    const lo = mel ? 55 : 190, hi = mel ? 105 : 330, dx = P.x - best.x, dy = P.y - best.y, d = bd || 1;
    if (d < lo) { mx = dx / d; my = dy / d; } else if (d > hi) { mx = -dx / d; my = -dy / d; } else { mx = -dy / d * 0.8 - dx / d * 0.2; my = dx / d * 0.8 - dy / d * 0.2; }
  }
  // 卡住處理：敵人總血量 6 秒沒變化 → 直接朝敵人走 4 秒（左右擺動繞過障礙）
  { const tot = en.reduce((a, e) => a + e.hp, 0); if (Math.abs(tot - (st.hp || 0)) > 0.01 || en.length !== st.n) { st.hp = tot; st.n = en.length; st.hpT = sim; }
    if (best && sim - (st.hpT || 0) > 6) { st.appr = sim + 4; st.hpT = sim; }
    if (best && sim < (st.appr || 0)) { const d = bd || 1, dx = best.x - P.x, dy = best.y - P.y, sw = Math.floor(sim) % 2 ? 1 : -1; mx = dx / d - dy / d * 0.9 * sw; my = dy / d + dx / d * 0.9 * sw; } }
  if (P.x < R.x + 90) mx += 1.5; if (P.x > R.x + R.w - 90) mx -= 1.5; if (P.y < R.y + 90) my += 1.5; if (P.y > R.y + R.h - 90) my -= 1.5;
  { let bx = 0, by = 0; for (const q of t.bullets) { if (q.own !== 'e' || q.dead) continue; const dx = P.x - q.x, dy = P.y - q.y, d = Math.hypot(dx, dy); if (d < 130 && d > 1) { const sp = Math.hypot(q.vx, q.vy) || 1, cr = (dx * q.vy - dy * q.vx) / sp; const side = cr > 0 ? 1 : -1; bx += -q.vy / sp * side * (130 - d) / 130; by += q.vx / sp * side * (130 - d) / 130; } } mx += bx * 2; my += by * 2; }
  st.t += dt; if (st.t > 1.2) { st.t = 0; const mv = Math.hypot(P.x - st.x, P.y - st.y); st.x = P.x; st.y = P.y; if (mv < 25) { st.j = 0.9; st.a = Math.random() * 6.28; } }
  if (st.j > 0) { st.j -= dt; mx = Math.cos(st.a); my = Math.sin(st.a); }
  { const m = Math.hypot(mx, my); t.mouse.has = true; t.mouse.down = false; if (m > 0.05) { t.mouse.x = P.x + mx / m * 220 - t.cam.x; t.mouse.y = P.y + my / m * 220 - t.cam.y; } else { t.mouse.x = P.x - t.cam.x; t.mouse.y = P.y - t.cam.y; } }
  if (best && P.skillCd <= 0 && f % 20 === 0) { try { t.useSkill(); skillStat.n++; } catch (e) { /* ignore */ } }
  if (best) { const d = Math.hypot(best.x - P.x, best.y - P.y) || 1; P.aim.x = (best.x - P.x) / d; P.aim.y = (best.y - P.y) / d; P.target = best; }
}
function shop(P) {
  // 簡單購物：血量不滿先買補血；其次強化；其次武器（有空位）
  const it0 = t.room.items.filter(i => !i.taken && i.group === 'shop' && i.price != null);
  let n = 0;
  for (let k = 0; k < 8; k++) {
    const pri = i => (i.kind === 'heal' && P.hp < P.maxHp ? 0 : i.kind === 'upgrade' ? 1 : i.kind === 'weapon' ? 2 : 9);
    const c = it0.filter(i => !i.taken && pri(i) < 9 && (i.price | 0) <= (P.coins | 0)).sort((a, b) => pri(a) - pri(b))[0];
    if (!c) break;
    try { P.x = c.x; P.y = c.y + 30; t.interact(c); n++; } catch (e) { break; }
    if (!c.taken) c.taken = true;
  }
  return n;
}
function treasure(P) {
  const c = t.room.items.filter(i => !i.taken && i.group === 'choose');
  if (!c.length) return 0;
  const pri = i => (i.kind === 'upgrade' ? 0 : i.kind === 'weapon' ? 1 : 2);
  c.sort((a, b) => pri(a) - pri(b)); try { P.x = c[0].x; P.y = c[0].y + 30; t.interact(c[0]); } catch (e) { return 0; }
  return 1;
}
window.__run = function (cfg) {
  const R0 = t.optAuto; t.optAuto.checked = true; t.optUnlock.checked = true;
  t.rec.ui = Object.assign(t.rec.ui || {}, { autoDlg: true });
  t.setChosen(cfg.cls); t.newRun(); t.setState('play');
  if (cfg.dlc) t.setDlc(cfg.dlc);
  const P = t.p, keys = t.keys, dt = 0.016, maxSim = cfg.maxSim || 1500, stallSim = cfg.stallSim || 200;
  const st = { t: 0, x: P.x, y: P.y, j: 0, a: 0 }, skillStat = { n: 0 };
  let sim = 0, lastKey = '', lastProg = 0, clearedAt = -1, outcome = null, dmgTaken = 0, lastHp = P.hp, rooms = 0, combats = 0, bought = 0, maxLayer = 0, rewarded = new WeakSet(), shopped = new WeakSet();
  let startHp = P.maxHp, f = 0;
  while (sim < maxSim && !outcome) {
    f++;
    let s = t.state;
    if (s === 'dialog') { try { t.skipDialog(); } catch (e) { t.setState('play'); } continue; }
    if (s === 'choice') { try { t.pickEnding(0); } catch (e) { outcome = 'win'; } continue; }
    if (s === 'over') { outcome = 'dead'; break; }
    if (s === 'ending') { outcome = 'win'; break; }
    if (s === 'zentut') { t.setState('play'); continue; }
    if (s === 'menu') { outcome = 'menu'; break; }
    const R = t.ROOM, room = t.room;
    if (s === 'play') {
      P.near = null;
      if (P.hp < lastHp) dmgTaken += lastHp - P.hp; lastHp = P.hp;
      const key = t.run.layer + ':' + t.run.step;
      if (key !== lastKey) { lastKey = key; lastProg = sim; clearedAt = -1; rooms++; maxLayer = Math.max(maxLayer, t.run.layer); }
      const alive = t.enemies.filter(e => !e.dead);
      if (room.cleared) {
        if (clearedAt < 0) { clearedAt = sim; if (room.kind === 'combat' && !rewarded.has(room)) { rewarded.add(room); combats++; } }
        // 撿東西、購物，之後走向出口
        if (!shopped.has(room)) { shopped.add(room); bought += shop(P); }
        let pk = null, pd = 1e9; for (const q of t.pickups) { const d = Math.hypot(q.x - P.x, q.y - P.y); if (d < pd) { pd = d; pk = q; } }
        if (pk && sim - clearedAt < 10) { P.x = pk.x; P.y = pk.y; }
        else { P.x = R.x + R.w + 20; P.y = t.DOOR.y; }
        keys.w = keys.a = keys.s = keys.d = false; t.mouse.x = P.x - t.cam.x; t.mouse.y = P.y - t.cam.y;
      } else if (alive.length || room.kind === 'combat' || room.kind === 'boss') {
        // 守燈等需要先啟動的物件
        const bc = room.items.find(i => i.kind === 'beacon' && !i.taken && !i.started);
        if (bc && !alive.length) { P.x = bc.x; P.y = bc.y + 30; try { t.interact(bc); } catch (e) { /* ignore */ } bc.started = true; }
        fightFrame(P, R, f, st, skillStat, sim);
      } else {
        // 非戰鬥房：購物後直接離開
        if (!shopped.has(room)) { shopped.add(room); bought += shop(P); }
        P.x = R.x + R.w + 20; P.y = t.DOOR.y;
      }
      if (sim - lastProg > stallSim) { outcome = 'stall'; break; }
    }
    t.update(dt); sim += dt;
    if (P.hp <= 0 && t.state === 'play') t.setState('dying');
  }
  keys.w = keys.a = keys.s = keys.d = keys.f = false;
  return { outcome: outcome || 'timeout', sim: +sim.toFixed(1), layer: maxLayer + 1, rooms, combats, dmgTaken, bought, skills: skillStat.n, hpEnd: P.hp, maxHp: P.maxHp, kind: t.room && t.room.kind, theme: t.th ? t.th() : -1, coins: P.coins | 0, dlc: cfg.dlc || null, dbg: outcome === 'stall' ? { en: t.enemies.filter(e => !e.dead).slice(0, 6).map(e => [e.type, Math.round(e.hp), e.spawn, !!e.sleep, !!e.passive, Math.round(e.x), Math.round(e.y)]), px: Math.round(P.x), py: Math.round(P.y), wave: t.room.wave, waves: t.room.waves, cleared: t.room.cleared, variant: t.room.variant, w: P.weapons.join(','), keys: Object.keys(t.keys).filter(k => t.keys[k]).join('') } : null };
};
})();
