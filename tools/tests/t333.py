import subprocess,time,os
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8800','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
T=['操作：電腦（點此切換）','第 1 / 2 波','第 3 層','長線 第 4 層','秒：x 還要擊倒 3 隻敵人才能製作','攤位冷卻中：還要再移動 40%','已讀取存檔：第 2 層','加成 3 下　共鳴 5 秒','存檔：提燈騎士　第 2 層　（回到選單按「繼續上次存檔」）','功德不足：佈施需要 3 功德（目前 1）','無盡：第 4 層','暗影巢穴：深度 5','累計 12 局、通關 3 次、遊玩 1:00','還要 2 個房間','起拍！接下來 5 次攻擊有加成']
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8800/index.html'); pg.wait_for_timeout(600)
    for n in ('en','ja'):
        pg.click('#btnLang'); pg.wait_for_timeout(200)
        print(n,pg.evaluate("""async(L)=>{const bx=document.createElement('div');document.body.appendChild(bx);const ds=L.map(t=>{const e=document.createElement('div');e.textContent=t;bx.appendChild(e);return e});await new Promise(r=>setTimeout(r,300));return ds.map(e=>e.textContent)}""",T))
    print(errs); b.close()
srv.terminate()
