import subprocess,time,os
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8845','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(); pg.goto('http://127.0.0.1:8845/index.html'); pg.wait_for_timeout(500)
    print(pg.evaluate("[window.__t.CLS.length, window.__t.CLS.map(c=>c.name).join('、')]")); b.close()
srv.kill()
