import subprocess,time,os
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8847','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(); pg.on('pageerror',lambda x:errs.append(str(x)))
    pg.goto('http://127.0.0.1:8847/index.html'); pg.wait_for_timeout(500)
    print(pg.evaluate("""()=>{const t=window.__t;t.PRAC.on=true;t.setRecBak(JSON.stringify(t.rec));t.setSkyReward(true);const a=!!(t.rec.cosOwn&&t.rec.cosOwn.cloud);t.endPractice();return [a,!!t.rec.cosOwn.cloud,t.PRAC.on]}"""))
    pg.evaluate("window.__t.setState('play')"); pg.wait_for_timeout(300)
    # draw head cloud
    print(pg.evaluate("""()=>{const t=window.__t;t.rec.cos=t.rec.cos||{};t.rec.cos.head='cloud';t.newRun();t.setState('play');for(let i=0;i<30;i++){t.update(1/60);t.render();}return 'drawn'}"""))
    print(errs); b.close()
srv.kill()
