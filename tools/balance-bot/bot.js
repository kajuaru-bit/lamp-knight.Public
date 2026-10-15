(() => {
const t = window.__t;
window.__bot = function (cfg) {
  // cfg: {cls, theme, dlc, layer, ci, maxT}
  t.optAuto.checked = true; t.optUnlock.checked = true;
  window.__botAim = true; t.setChosen(cfg.cls); t.newRun(); t.setState('play');
  if (cfg.dlc) { t.setDlc(cfg.dlc); }
  const run = t.run, p = t.p;
  run.themes = [cfg.theme, cfg.theme, cfg.theme];
  for (const f of ['escort','guard','endless','escape','path','karma','dl2','long']) run[f] = false;
  run.layer = cfg.layer; run.plan = t.makeLayerPlan(cfg.layer);
  // 找第 ci 間戰鬥房
  let seen = -1, step = -1;
  for (let i = 0; i < run.plan.length; i++) { run.step = i; t.loadRoom(); t.placeEntry(); t.setState('play'); if (t.room.kind === 'combat') { seen++; if (seen === cfg.ci) { step = i; break; } } }
  if (step < 0) return { err: 'noroom' };
  t.setState('play'); t.spawnWave();
  const P = t.p; P.hp = P.maxHp; const hp0 = P.hp, keys = t.keys;
  let time = 0, dead = false, cleared = false, dmg = 0, lastHp = P.hp, skillN = 0;
  const dt = 0.016, R = t.ROOM; const st = { t: 0, x: P.x, y: P.y, j: 0, a: 0 };
  for (let f = 0; f < (cfg.maxT || 120) / dt; f++) {
    t.setState('play'); P.iframes = Math.max(0, P.iframes);
    const en = t.enemies.filter(e => !e.dead && e.spawn <= 0);
    let best = null, bd = 1e9; for (const e of en) { const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < bd) { bd = d; best = e; } }
    keys.w = keys.a = keys.s = keys.d = false; keys.f = true; t.fEdge = 0.16; P.near = null;
    // 移動：太近就後退，其餘繞圈；牆邊朝中心
    let mx = 0, my = 0;
    if (best) { const W = t.WDEF[P.weapons[P.w]] || {}; const mel = !!W.range || ['shears','pillow','blade','pblade','shadeblade','frostcane','dance','pole','whip'].includes(W.id); const lo = mel ? 55 : 190, hi = mel ? 105 : 330; const dx = P.x - best.x, dy = P.y - best.y, d = bd || 1; if (d < lo) { mx = dx / d; my = dy / d; } else if (d > hi) { mx = -dx / d; my = -dy / d; } else { mx = -dy / d * 0.8 - dx / d * 0.2; my = dx / d * 0.8 - dy / d * 0.2; } }
    const cx = R.x + R.w / 2, cy = R.y + R.h / 2;
    if (P.x < R.x + 90) mx += 1.5; if (P.x > R.x + R.w - 90) mx -= 1.5; if (P.y < R.y + 90) my += 1.5; if (P.y > R.y + R.h - 90) my -= 1.5;
    st.t += dt; if (st.t > 1.2) { st.t = 0; const mv = Math.hypot(P.x - st.x, P.y - st.y); st.x = P.x; st.y = P.y; if (mv < 25) { st.j = 0.9; st.a = Math.random() * 6.28; } }
    if (st.j > 0) { st.j -= dt; mx = Math.cos(st.a); my = Math.sin(st.a); }
    if (mx > 0.3) keys.d = true; if (mx < -0.3) keys.a = true; if (my > 0.3) keys.s = true; if (my < -0.3) keys.w = true;
    if (best && P.skillCd <= 0 && f % 20 === 0) { try { t.useSkill(); skillN++; } catch (e) {} }
    // 瞄準：移動中 aimUpdate 會用 wasd；改為直接指向最近敵人
    if (best) { const d = Math.hypot(best.x - P.x, best.y - P.y) || 1; P.aim.x = (best.x - P.x) / d; P.aim.y = (best.y - P.y) / d; P.target = best; }
    t.update(dt); time += dt;
    if (P.hp < lastHp) dmg += lastHp - P.hp; lastHp = Math.max(lastHp, P.hp); lastHp = P.hp;
    if (P.hp <= 0 || t.state === 'dying' || t.state === 'dead') { dead = true; break; }
    if (t.room.cleared) { cleared = true; break; }
  }
  keys.w = keys.a = keys.s = keys.d = keys.f = false;
  return { dead, cleared, time: +time.toFixed(1), dmg, hp0, skillN, n: t.enemies.filter(e => !e.dead).length };
};
})();
