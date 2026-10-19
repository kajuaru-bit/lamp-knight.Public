import subprocess,time,os,re,sys
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8842','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
C=['光爆！','多一圈光','閃光舞台','光爆','蓄光者','定光者','偶像','糖衣師','校正員','破盾三連','冷靜不動','生意興隆','百折不撓','與阿燈同行通關','燈光爆發','提燈騎士','空白鍵：光爆','技能：多一圈光','技能：閃光舞台']
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700})
    pg.goto('http://127.0.0.1:8842/index.html'); pg.wait_for_timeout(600)
    for lang in (1,2):
        pg.click('#btnLang'); pg.wait_for_timeout(200)
        r=pg.evaluate("""C=>C.map(s=>{const e=document.createElement('span');e.textContent=s;document.body.appendChild(e);return e})""",C) if False else None
        out=pg.evaluate("""C=>new Promise(res=>{const es=C.map(s=>{const e=document.createElement('span');e.textContent=s;document.body.appendChild(e);return e});setTimeout(()=>{res(es.map(e=>e.textContent));es.forEach(e=>e.remove())},200)})""",C)
        print(lang,list(zip(C,out)))
    b.close()
srv.kill()
