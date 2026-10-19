import json
P=[
("燈火騎士","Lamp Knight"),
("可玩原型 v2.65　需要鍵盤與滑鼠，請用電腦開啟","Playable prototype v2.65　Needs keyboard and mouse — please open on a computer"),
("放棄這局","Give up"),("換職業","Change class"),("守燈人","Lamp Keeper"),("空白鍵","Space"),("攻擊","Attack"),("技能","Skill"),("換武器","Swap weapon"),("地圖","Map"),("暫停","Pause"),
("跳過（Esc）","Skip (Esc)"),("按 F 或點畫面任一處繼續","Press F or click anywhere to continue"),
("很久以前，世界由一盞大燈照亮。燈熄之後，黑暗裡長出了怪物。","Long ago, the world was lit by one great lamp. When it went out, monsters grew in the dark."),
("長線含 DLC 主題","Long run includes DLC themes"),("長線作戰","Long run"),("選存檔資料夾","Choose save folder"),("匯出遊玩紀錄","Export play record"),("匯入遊玩紀錄","Import play record"),
("W／S 選職業，F 開始冒險；C 造型，V 成就。遊戲中按 P 或 Esc 暫停。","W/S choose class, F start; C cosmetics, V achievements. Press P or Esc to pause in game."),
("燈滅了","The lamp went out"),("W／S 選擇，F 確定","W/S select, F confirm"),("主題路標","Theme signpost"),
("選一個這一局一定會遇到的主題（選「隨機」＝取消）","Pick a theme you will definitely meet this run (choose “Random” to cancel)"),
("W／S 選擇，F 確定，Esc 返回","W/S select, F confirm, Esc back"),("DLC 之門","DLC gate"),("選一種這一局要走的世界","Choose a world for this run"),
("練習完成","Practice complete"),("回起始房","Back to start room"),("目前的狀態與強化","Current status and upgrades"),("中途離開（匯出探索進度）","Leave now (export progress)"),
("放棄這局，換職業","Give up and change class"),("W／S 選擇，F 確定；P、Esc 繼續","W/S select, F confirm; P or Esc to resume"),
("滑鼠：角色跑向游標，按住暫停追隨　WASD：攻擊方向　F：攻擊／拿取　Q、E：換武器　空白鍵：職業技能","Mouse: hero runs to cursor, hold to stop following　WASD: aim　F: attack/pick up　Q, E: swap weapon　Space: class skill"),
("大燈就在眼前","The great lamp is right here"),("燈罩只要掀開，光就會回來。你要怎麼做？","Lift the shade and the light returns. What will you do?"),
("W／S 選擇，F 確定（也可以按 1、2）","W/S select, F confirm (or press 1, 2)"),("這是原型的結尾。正式版的第二輪會出現不同的洞窟與故事。","This is the end of the prototype. The full game's second round brings new caves and stories."),
("操作","Controls"),("滑鼠","Mouse"),("角色自己跑向游標，游標停下角色就停下","The hero runs to the cursor and stops when it stops"),("按住滑鼠","Hold mouse"),("暫停追隨，放開就繼續跑向游標","Stop following; release to run to the cursor again"),
("指定攻擊方向，可按兩個鍵打斜角","Set the aim direction; press two keys for diagonals"),("攻擊，連射武器可以按住不放。站在物品旁邊時是拿取或購買","Attack (hold for auto-fire weapons). Next to an item: pick up or buy"),
("上一把武器","Previous weapon"),("下一把武器","Next weapon"),("職業專屬技能，有冷卻時間","Class skill, has a cooldown"),("開關自動瞄準（預設開啟）","Toggle auto-aim (on by default)"),("暫停，視窗失去焦點時也會自動暫停","Pause (also pauses when the window loses focus)"),
("武器（最多帶 3 把）","Weapons (carry up to 3)"),("燈焰杖","Flame Staff"),("單發火球，傷害最高。開局只有這一把","Single fireball, highest damage. The only weapon at the start"),
("螢火弓","Firefly Bow"),("按住連射，傷害低但射速快","Hold to rapid-fire; low damage, high rate"),("提燈刃","Lantern Blade"),("近身大範圍揮砍，能擊退敵人並打散光球","Wide melee slash that knocks enemies back and scatters orbs"),
("霰光杖","Scatter Staff"),("五發散射，近距離很痛","Five-shot spread, painful up close"),("穿光矛","Piercing Spear"),("光矛貫穿一整排敵人","The spear pierces a whole line of enemies"),
("流火鏈","Flame Chain"),("中速連射的火星","Medium-speed stream of sparks"),("光線杖","Beam Staff"),("按住蓄力，放開射出貫穿光束","Hold to charge, release to fire a piercing beam"),
("迴旋紙鏢","Boomerang"),("飛出去再飛回來，來回都會貫穿","Flies out and back, piercing both ways"),("長燈鞭","Long Whip"),("又長又窄的一條線，貫穿路徑上所有敵人","A long thin line that hits every enemy on its path"),
("新敵人","New enemies"),("爆裂影","Blast Shade"),("靠近後閃爍，隨後爆炸並留下一圈灼熱區域，趁它還沒靠近時打倒它","Flashes when close, then explodes leaving a burning zone. Kill it before it arrives"),
("召喚影","Summoner Shade"),("保持距離，不斷召喚暗影團，優先解決","Keeps its distance and keeps summoning shadows; kill first"),("重盾影","Heavy Shield Shade"),
("正面的盾能承受 30 點遠程傷害（隨層數成長），轉身很慢，繞到背後打最有效。近戰（提燈刃、長燈鞭、裁切衝刺、燈光爆發）一下就能打碎盾","The front shield absorbs 30 ranged damage (grows with depth) and it turns slowly — attack from behind. Melee (Lantern Blade, Long Whip, Cutter dash, Light Burst) breaks the shield in one hit"),
("輕盾影","Light Shield Shade"),("盾比較脆，只能承受 15 點遠程傷害，但轉身快","A weaker shield (15 ranged damage) but turns fast"),("分裂影","Splitter Shade"),("被打倒後分裂成兩隻小的","Splits into two smaller ones when killed"),
("衝撞分裂影","Charging Splitter"),("更強的分裂影，會蓄力衝撞，被打倒後也會分裂","A stronger splitter that charges up and rams; also splits when killed"),
("帶滿 3 把時，拿新武器會取代目前手上的那一把。血量就是燈的亮度，被打中視野會縮小。","With 3 weapons, a new one replaces the one in hand. HP is the lamp's brightness — getting hit shrinks your view."),
("地牢結構","Dungeon layout"),("3 層","3 floors"),("每層 3 間戰鬥房加特殊房，最後是 Boss。越深的層，敵人血量與速度越高","Each floor has 3 combat rooms plus special rooms, then a boss. Deeper floors have tougher, faster enemies"),
("寶箱房","Treasure room"),("三選一，免費","Pick one of three, free"),("事件房","Event room"),("兩選一，可能是血量、武器或強化","Pick one of two: HP, a weapon or an upgrade"),("商人房","Merchant room"),
("每層一定有一間；用燈芯購買，買走後留下空位，付 1 燈芯請商人補貨。中間下方的換貨架可付費刷新全部商品（3 燈芯起，每次 +2）。金邊的「精良」強化較貴，但每燈芯換到的效果更多","One per floor; buy with wick. Pay 1 wick to restock a gap. The swap rack below refreshes all goods (from 3 wick, +2 each time). Gold-edged “Premium” upgrades cost more but give more per wick"),
("調整手感","Feel settings"),("自動瞄準（按 T 也能切換）：沒有按 WASD 時瞄準最近的敵人，沒有敵人就朝向移動方向。關掉後，沒按 WASD 時一律朝向移動方向。","Auto-aim (T also toggles): with no WASD it aims at the nearest enemy, or the move direction if none. When off, it always faces the move direction."),
("音效","Sound"),("測試用：解鎖全部職業（正式規則：首次通關後才能選其他職業）","Test: unlock all classes (normally unlocked after the first clear)"),
("測試用：開啟造型機（抽取、保底、紙屑合成；外觀目前是依主題上色的通用形狀，不是正式美術）","Test: enable the cosmetic machine (draw, pity, scrap fusing; looks are placeholder shapes)"),
("測試用：第 2、3 層一定有事件房（事件房才會遇到可邀請的隊友）","Test: floors 2 and 3 always have an event room (where teammates can be invited)"),
("自動","Auto"),("花園","Garden"),("極地","Polar"),("提燈洞窟","Lantern Cave"),("深海（部分）","Deep Sea (part)"),("火山（部分）","Volcano (part)"),("夢境（部分）","Dream (part)"),("詛咒沼澤","Cursed Swamp"),("沙漠（部分）","Desert (part)"),("中華古代","Ancient China"),
("糖果世界（DLC）","Candy World (DLC)"),("電玩世界（DLC）","Arcade World (DLC)"),("未來世界（DLC）","Future World (DLC)"),
("自動（首次通關前固定荊棘園丁，之後隨機）","Auto (Thorn Gardener until first clear, then random)"),("荊棘園丁","Thorn Gardener"),("巨花","Giant Flower"),("蟲群母巢","Bug Hive"),
("自動（首次通關前固定守燈人，之後隨機）","Auto (Lamp Keeper until first clear, then random)"),("分裂守燈人","Splitting Keeper"),("召喚守燈人","Summoning Keeper"),
("載入 DLC 後生效；取消則只抽基本主題","Takes effect once a DLC is loaded; unchecked draws only base themes"),("6 層、精英與 Boss 第二形態；約 25–35 分鐘","6 floors, elites and boss phase 2; about 25–35 min"),
("開始冒險","Start"),("造型","Cosmetics"),("成就","Achievements"),("統計","Stats"),("資料","Data"),("造型機","Cosmetic machine"),("繼續上次存檔","Continue last save"),("再試一次","Try again"),
("繼續","Resume"),("再來一次","Again"),("返回","Back"),("掀開燈罩，重新點亮","Lift the shade and relight"),("讓燈繼續沉睡","Let the lamp sleep"),("繼續探索（高難度 3 層）","Keep exploring (hard, 3 floors)"),("再玩一次","Play again"),
("測試用：最後一層的主題","Test: final-floor theme"),("測試用：第 1 層（花園）的 Boss","Test: floor 1 (Garden) boss"),("測試用：第 3 層的最終 Boss","Test: floor 3 final boss"),
("全部","All"),("攻擊型","Attack"),("防守型","Defense"),("平衡型","Balanced"),("輔助型","Support"),("（未解鎖）","(locked)"),("第 1 頁","Page 1"),("第 2 頁","Page 2"),
("光爆！","Light burst!"),("多一圈光","Extra light circle"),("光圈內","In circle"),("光圈外","Outside circle"),("原地休息（再按技能鍵恢復走動）","Resting in place (press skill key to move again)"),("恢復走動","Moving again"),
("蓄光者","Charger"),("定光者","Holder"),("光爆","Light Burst"),
]
seen={}; 
for z,e in P: seen[z]=e
import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ph import PH
from ph2 import E2,PH2
from ph3 import PH3
from ph4 import PH4
from ph5 import PH5
from ph6 import PH6
from ph7 import T7
from ph8 import T8,PX
from ph9 import T9
from ph10 import T10
from ph12 import T12,PX3
from ph14 import T14,PX14
from ph20 import T20,PX20
from ph21 import T21
from ph22 import T22,PX22
from ph23 import T23,PX23
PX3=list(PX3)+PX14+PX20+[(z.strip() if False else z,e,j) for z,e,j in T21 if z!="你"]+PX22+PX23+[t for t in T23]
T7=list(T7)+[t for t in list(T8)+list(T9)+list(T10)+list(T12)+list(T14)+list(T20)+list(T21)+list(T22)+list(T23) if len(t[0].strip())>1]
PHRASES=dict(PH); PHRASES.update(dict(PH2)); PHRASES.update(dict(PH3)); PHRASES.update(dict(PH4)); PHRASES.update(dict(PH5)); PHRASES.update(dict(PH6)); PHRASES.update({z:e for z,e,j in T7 if e!='' and len(z.strip())>=5})
for z,e in E2: seen[z]=e
for z,e,j in T7:
    if len(z.strip())<5 and e!='': seen[z.strip()]=e
from ja import JA
from ph11 import J11
from ph13 import J13
from ph15 import J15
from ph16 import J16
from ph17 import J17
from ph18 import J18
from ph19 import J19
JA=list(JA)+list(J11)+list(J13)+list(J15)+list(J16)+list(J17)+list(J18)+list(J19)
for _z,_j in JA:
    if len(_z)<3 and _z not in seen: seen[_z]=PHRASES.get(_z,_z)
JAD=dict(JA); JAD.update({(z if len(z.strip())>=5 else z.strip()):j for z,e,j in T7})
for _z,_e,_j in PX23:
    if _z in seen: seen[_z]=_e
JAD.update({_z:_j for _z,_e,_j in PX23})
zh={f'k{i}':z for i,z in enumerate(seen)}; ja={f'k{i}':JAD[z] for i,z in enumerate(seen) if z in JAD}; PHJA={z:JAD[z] for z in JAD if len(z)>=3}; en={f'k{i}':seen[z] for i,z in enumerate(seen)}; PHRASES.update({z:e for z,e,j in PX+PX3}); PHJA.update({z:j for z,e,j in PX+PX3})
js="/* 語言表：zh（中文原文）與 en（英文），以相同的 key 對應。畫面上完全相同的文字會被自動換成所選語言。 */\nwindow.LANG = "+json.dumps({'zh':zh,'en':en,'ja':ja,'ph':PHRASES,'phja':PHJA},ensure_ascii=False,indent=1)+";\n"
js+="""(function () {
  const rev = {}; for (const k in LANG.zh) rev[LANG.zh[k]] = k;
  let cur = 'zh'; try { cur = localStorage.getItem('lk.lang') || 'zh'; } catch (e) { /* optional */ }
  const orig = new WeakMap(), lastv = new WeakMap(), SKIP = { SCRIPT: 1, STYLE: 1, CANVAS: 1, TEXTAREA: 1 };
  const phk = Object.keys(LANG.ph || {}).sort((a, b) => b.length - a.length);
  const PHL = { en: LANG.ph || {}, ja: LANG.phja || {} }, PKS = { en: phk, ja: Object.keys(LANG.phja || {}).sort((a, b) => b.length - a.length) };
  const RX = [
    [/第 ?(\\d+) ?\\/ ?(\\d+) ?波/g, 'Wave $1 / $2', '第$1 / $2ウェーブ'],
    [/第 ?(\\d+) ?波/g, 'Wave $1', '第$1ウェーブ'],
    [/第 ?(\\d+) ?層/g, 'Floor $1', '第$1階層'],
    [/(\\d+) ?房間/g, '$1 rooms', '$1部屋'],
    [/(\\d+) ?個房間/g, '$1 rooms', '$1部屋'],
    [/(\\d+) ?房/g, '$1 rooms', '$1部屋'],
    [/(\\d+) ?層/g, '$1 floors', '$1階層'],
    [/(\\d+) ?秒/g, '$1 s', '$1秒'],
    [/(\\d+) ?次/g, '$1×', '$1回'],
    [/(\\d+) ?個/g, '$1', '$1個'],
    [/(\\d+) ?隻/g, '$1', '$1体'],
    [/(\\d+) ?局/g, '$1 runs', '$1回'],
    [/(\\d+) ?下/g, '$1 hits', '$1回'],
    [/(\\d+) ?點/g, '$1 pts', '$1点'],
    [/(\\d+) ?像素/g, '$1 px', '$1px'],
    [/(\\d+) ?距離/g, '$1 distance', '$1距離']
  ];
  function rx(r) { if (!/[一-龥]/.test(r)) return r; for (const [re, e, j] of RX) r = r.replace(re, cur === 'ja' ? j : e); return r; }
  const PUN = {
    en: s => s.replace(/\u3000/g, ' ').replace(/\\s*（\\s*/g, ' (').replace(/\\s*）/g, ')').replace(/，\\s*/g, ', ').replace(/、\\s*/g, ', ').replace(/；\\s*/g, '; ').replace(/：\\s*/g, ': ').replace(/。\\s*(?=\\S)/g, '. ').replace(/。/g, '.').replace(/！\\s*(?=\\S)/g, '! ').replace(/！/g, '!').replace(/？\\s*(?=\\S)/g, '? ').replace(/？/g, '?').replace(/「/g, '“').replace(/」/g, '”').replace(/^ \\(/, '('),
    ja: s => s.replace(/，/g, '、').replace(/（/g, '(').replace(/）/g, ')').replace(/：/g, ':').replace(/；/g, ';').replace(/！/g, '!').replace(/？/g, '?')
  };
  function tr(str) { const r = tr0(str); return cur === 'zh' || !PUN[cur] ? r : PUN[cur](r); }
  function tr0(str) { const t = str.trim(); if (!t) return str; const k = rev[t]; if (k && LANG[cur][k]) return str.replace(t, LANG[cur][k]); if (cur === 'zh') return str; let r = str; const T = PHL[cur] || {}; for (const z of PKS[cur] || []) if (r.indexOf(z) >= 0) r = r.split(z).join(T[z]); return rx(r); }
  function node(n) {
    if (n.nodeType === 3) { const o = orig.has(n) && lastv.get(n) === n.nodeValue ? orig.get(n) : n.nodeValue; if (!orig.has(n) && !/[一-龥]/.test(o)) return; orig.set(n, o); const v = cur === 'zh' ? o : tr(o); if (n.nodeValue !== v) { busy = true; n.nodeValue = v; } lastv.set(n, v); return; }
    if (n.nodeType !== 1 || SKIP[n.tagName]) return;
    for (const a of ['title', 'placeholder']) if (n.hasAttribute(a)) { const k = '_o' + a, o = n[k] === undefined ? n.getAttribute(a) : n[k]; n[k] = o; const v = cur === 'zh' ? o : tr(o); if (n.getAttribute(a) !== v) n.setAttribute(a, v); }
    for (const c of n.childNodes) node(c);
  }
  let busy = false, tm = 0;
  const CC = { en: new Map(), ja: new Map() };
  function ct(s) { if (cur === 'zh' || typeof s !== 'string' || !/[一-龥]/.test(s)) return s; const m = CC[cur]; let v = m.get(s); if (v === undefined) { v = tr(s); if (m.size > 4000) m.clear(); m.set(s, v); } return v; }
  for (const f of ['fillText', 'strokeText', 'measureText']) { const o = CanvasRenderingContext2D.prototype[f]; CanvasRenderingContext2D.prototype[f] = function (t, ...a) { return o.call(this, ct(t), ...a); }; }
  function apply() { busy = true; node(document.body); document.title = { zh: '燈火騎士', en: 'Lamp Knight', ja: 'ランプナイト' }[cur]; document.documentElement.lang = { zh: 'zh-Hant', en: 'en', ja: 'ja' }[cur]; const b = document.getElementById('btnLang'); if (b) b.textContent = { zh: 'English', en: '日本語', ja: '中文' }[cur]; setTimeout(() => { busy = false; }, 0); }
  window.LKLang = { get: () => cur, set(l) { cur = l; try { localStorage.setItem('lk.lang', l); } catch (e) { /* optional */ } apply(); }, t: z => (cur === 'zh' || !rev[z]) ? z : LANG[cur][rev[z]] };
  new MutationObserver(recs => { if (busy) return; busy = true; try { for (const r of recs) { if (r.type === 'characterData') node(r.target); else for (const n of r.addedNodes) node(n); } } finally { busy = false; } }).observe(document.body, { childList: true, subtree: true, characterData: true });
  document.addEventListener('DOMContentLoaded', () => { const b = document.getElementById('btnLang'); if (b) b.addEventListener('click', () => LKLang.set({ zh: 'en', en: 'ja', ja: 'zh' }[cur])); apply(); });
  if (document.readyState !== 'loading') { const b = document.getElementById('btnLang'); if (b) b.addEventListener('click', () => LKLang.set({ zh: 'en', en: 'ja', ja: 'zh' }[cur])); apply(); }
})();
"""
open('lang.js','w',encoding='utf8').write(js); print(len(zh))
