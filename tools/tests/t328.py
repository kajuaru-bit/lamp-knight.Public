import subprocess,time,os
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8795','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8795/index.html'); pg.wait_for_timeout(600)
    for lang in (1,2):
        pg.click('#btnLang'); pg.wait_for_timeout(300)
        for bid in ('#btnData','#btnStat'):
            pg.click(bid); pg.wait_for_timeout(500)
            print(bid, pg.inner_text('#subBody')[:240].replace('\n','|'))
            pg.keyboard.press('f'); pg.wait_for_timeout(200)
    print(errs); b.close()
srv.terminate()
