# tools
- i18n/：語言表原始檔。`cd tools/i18n && python3 mklang.py && mv lang.js ../../lang.js`（lang.js 是產物，不要手改）。新增翻譯＝在最新的 phNN.py（目前 ph23.py）加 T（完全比對／片語，中英日）或 PX（片語，無長度限制）條目，並在 mklang.py 匯入。
- tests/：機械測試（Playwright）。`python3 prep.py` 會把 index.html 複製成帶 `window.__t` 測試掛鉤的版本到 `site/`（路徑寫在檔內，需改成本機路徑），再跑 tNNN.py。
- balance-bot/：整局平衡機器人。
- balance-bot/bot2.js＋runner.py：整局機器人。先 `python3 tools/tests/prep.py`，再 `cd tools/balance-bot && python3 runner.py <埠> <第幾份> <共幾份> out.json [玩法逗號分隔] [職業編號逗號分隔]`（玩法：normal 或 DLC id，如 candy,arcade,letters…）。結果見 results-v3.42.json。
