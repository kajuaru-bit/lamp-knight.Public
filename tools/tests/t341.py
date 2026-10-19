import subprocess,time,os,re
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8841','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700})
    pg.goto('http://127.0.0.1:8841/index.html'); pg.wait_for_timeout(600)
    for lang in (1,2):
        pg.click('#btnLang'); pg.wait_for_timeout(200)
        bad={}
        for pgn in (0,1):
            btns=pg.query_selector_all('.pgbtn, #clsPages button, button.pg')
            tabs=[x for x in pg.query_selector_all('button') if re.search(r'(Page|ページ|^\\s*[12]\\s*$)',x.inner_text()) ]
            if pgn==1 and len(tabs)>1: tabs[1].click(); pg.wait_for_timeout(200)
            for i in range(40):
                el=pg.query_selector('button.cls[data-i="%d"]'%i)
                if not el: continue
                try: el.click(timeout=800)
                except Exception: continue
                pg.wait_for_timeout(120)
                for l in pg.inner_text('#clsInfo').split('\n'):
                    if re.search(r'[\u4e00-\u9fff]',l) and (lang==1 or not re.search(r'[\u3040-\u30ff]',l)): bad[l]=i
        print('LANG',lang,len(bad))
        for l,i in bad.items(): print(i,l[:150])
    b.close()
srv.kill()
