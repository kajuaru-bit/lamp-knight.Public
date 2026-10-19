# 《燈火騎士》新對話交接（精簡版，對應 v3.41）

## 1. 專案與發佈
- 網頁遊戲，剪紙／紙偶風、提燈與黑暗主題，俯視角 roguelike 地牢射擊，PC＋手機（直向版面）。一局 10–15 分鐘，三層、每層一個主題、層尾 Boss。
- Repo：`/home/claude/lamp-knight.public`（遠端 kajuaru-bit/lamp-knight.Public，已授權推 main；Pages：https://kajuaru-bit.github.io/lamp-knight.Public/）。
- 檔案：`index.html`（單檔 IIFE，主程式）、`dlc.js`–`dlc5.js`（DLC 世界，依需求載入）、`lang.js`（**產物，不要手改**）、`game-design-doc-vX.YY.md`（設計文件，頂部＝最新）、`tools/`。
- 推送：`git fetch -q origin` → `git push -q origin HEAD:main`；commit 結尾加兩行署名（Co-Authored-By、Claude-Session）。
- 工具坑：不要在同一個 shell 鏈裡 `pkill -f`；背景測試會殘留 http.server 佔埠，重跑前先清。

## 2. 遊戲內容現況
- 操作：電腦＝滑鼠移動、Space 技能、WASD 設攻擊方向、F 互動／攻擊、Q/E 換武器、T 自動瞄準、M 音效、C/V/B/N 造型／成就／統計／資料；手機＝虛擬搖桿＋按鈕（可左手模式、按鈕大小／濃度），暫停頁可開關「點擊螢幕移動」（rec.ui.tapMove，預設開）。
- 主題：基礎 9 個（花園、極地、提燈洞窟、中華古代、深海、火山、夢境、詛咒沼澤、沙漠）＋ DLC 主題至 26 號（糖果、電玩、未來、字母書房、彼岸、佛寺、日本、希臘、愛情、星座、季節慶典、傳統節慶、食材廚房、暗影巢穴…）。DLC 玩法表在 index.html 的 `const DLC = [...]`（護送、守燈、逃離、無盡、長線等）。
- 職業 29 個（`CLS`，依序：提燈騎士、紙盾衛、守夜人、螢火獵人、剪紙匠、折紙術士、燈油師、提燈使、影獵手、燈籠、沙漏客、花匠、凜風客、掌櫃、嗜睡者、糖衣師、像素客、校準員、擺渡人、擊節者、星圖師、提燈信使、回響手、鑄燈匠、月老、煉金師、蓄光者、定光者、偶像）。解鎖：通關、成就數、隊友通關機率、專屬成就、DLC 通關。武器上限 3，強化分一般／精良／職業專屬。
- 近期新增（v3.34–v3.39）：結算畫面顯示玩家形象與死因敵人；蓄電燈在武器欄顯示充電中／充滿電；煉金師冷卻溢出存入 bank（上限 10）；新職業「偶像」（麥克風槍；被動受攻擊免扣燈火機率隨血量，過半 30%／低於半 50%，強化 +5%；技能閃光舞台 10 秒攻擊 ×1.5／1.7／2，冷卻改用「受攻擊＋回血次數」累積 6；成就「百折不撓」一局累計受傷 50 點解鎖）。
- 參觀模式（`startVisit`）：大地圖、被動敵人、訪客；約 10% 機率變「天空島」彩蛋（`SKY`，theme index 27，noPool，不進主題池／練習房）：9 隻小鳥（靠近飛散）、雲羊、許願星、鞦韆、風鈴、雲上釣魚（F 拋竿→浮標沉下再按 F；電腦 1.3 秒／手機 2.6 秒；8 種漁獲圖鑑，集滿出彩虹）。皆純趣味。

## 3. 程式碼地圖（index.html）
- 資料表：`ENEMY/ENAME`、`WDEF`、`UPG/PREM`、`CLS`、`ACH`、`THEMES/TNAMES`、`PALS`、`BOSS`。主題註冊：DLC 檔用 `LK.registerWorld({theme, name, pal, bg, obsDraw, skin, enemies, types, boss…})`。
- 流程：`newRun`→`loadRoom`→`updatePlay`；敵人 `spawnEnemy`→`updateEnemy`→`hitEnemy`；波次 `composeWave/spawnWave`；玩家受傷 `hurtPlayer`、回血 `healP`；成就 `unlockAch`；存檔 `rec`（localStorage）。
- 背景：`buildBg(rm)` 畫墨底＋鋸齒牆地板＋`THEMES[t].bg`；障礙 `THEMES[t].obsDraw`。
- 暫停頁按鈕：`SCR_IDS.pause`／`SCR_ACT.pause` 兩個陣列順序必須對齊；選項存 `rec.ui`，`uiOpt(k)`、`refreshPauseOpts()`。
- 手機點擊移動：`tapT`、`tapWorld`、cv pointerdown 處理。
- 參觀／天空島：`startVisit`、`exitVisit`、`visitUpdate`、`drawVisitors`、`SKY`、`SKY_ITEMS`、`skySetup`、`skyInteract`、`skyFishUpdate`、`drawSkyItem`。
- 多語言（由 `lang.js` 提供）：`window.LANG`＝{zh,en,ja,ph,phja}；`tr0` 先完全比對、再最長優先片語、再數字＋單位正規式（第 N 層、N 秒、N 次…）；`PUN` 後處理全形標點（英：轉半形加空格、「」→“”；日：，→、、（）：；！？轉半形）；MutationObserver 在回呼內**立即**翻譯（避免 HUD 每幀被改回中文造成閃爍）；canvas fillText/measureText 也經 `tr`；語言鈕循環 中文→English→日本語。

## 4. 語言表流程（工具已存進 repo）
- 原始檔：`tools/i18n/`（mklang.py＋ph*.py＋ja.py＋json）。重建：`cd tools/i18n && python3 mklang.py && mv lang.js ../../lang.js`（目前已驗證可逐位元重現）。
- 新增翻譯：在最新的 phNN.py（目前 ph23.py）加 `T`（完全比對或片語，中／英／日三欄）或 `PX`（片語，無長度限制，可覆蓋同鍵），再確認 mklang.py 有匯入；短詞（<5 字）只在整段完全相同才翻，嵌在句中要用 PX。
- 用字：燈火＝lamplight／灯火；燈芯＝wick／灯芯；精良強化＝premium upgrade／上等強化；職業名日文：蓄光者＝チャージャー、定光者＝追光者。日文語氣：劇情與對話口語；物品說明常體（だ・である）；UI 與系統提示丁寧體或體言止め。
- 已知殘留：英文偶有零碎空格（例如 `Needs hits taken or heals: 6×, Another 3×`）；單字圖示字（福、春、月…）刻意不翻。

## 5. 測試
- `tools/tests/prep.py`：把 index.html 複製成帶 `window.__t` 掛鉤的測試版到 `tools/tests/site/`（相對路徑），在 tools/tests 目錄下用 Playwright 跑 `tNNN.py`（328／330 翻譯、333 數字單位規則、334 結算與蓄電燈、336 偶像數值、341 職業頁漏翻掃描、344 釣魚、346 職業理論 DPS、347 雲朵髮飾）。
- `tools/balance-bot/`：整局平衡機器人與統計。
- 一律只算「機械測試」，沒有實機遊玩；回報時要註明。

## 6. 待辦與想法
- 已鎖定／使用者想過：DLC 再加主題批次（萬聖／耶誕／復活、春節／中秋／七夕已完成）；新職業要在更多 DLC 後再決定；各 DLC 職業平衡（每個職業至少有一個相對強的主題）。
- 數字待調：偶像免扣血機率與冷卻 6 次、成就 50 點、天空島機率 10%、釣魚時間窗。
- 英文標點與空格零碎問題、天空島是否再加內容，看使用者實玩回饋。

## 7. 工作規則
- 回覆繁體中文、精簡：先講改了什麼，再列編號待確認。
- 每次更新都更新設計文件：新增頂部區塊、前一版標「較舊」、檔名改版號、用 SendUserFile 送出。
- 回報時說明只做了機械測試。
