import subprocess,time,os
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8797','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.add_init_script("window.__ft=new Set();(()=>{const o=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(t,...a){window.__ft.add(String(t));return o.call(this,t,...a)}})()")
    pg.goto('http://127.0.0.1:8797/index.html'); pg.wait_for_timeout(600)
    pg.click('#btnLang'); pg.wait_for_timeout(200)
    for k in ['candyGuard','zenKarma','japan','greek']:
        pg.evaluate('(k)=>__t.useDlc(k)',k); pg.wait_for_timeout(1500)
        pg.evaluate("""(k)=>{const t=__t;t.optAuto.checked=true;t.optUnlock.checked=true;t.setChosen(0);t.newRun();t.setState('play');t.setDlc(k);t.run.layer=0;t.run.plan=t.makeLayerPlan(0);t.run.step=1;t.loadRoom();t.placeEntry();t.setState('play');}""",k)
        pg.wait_for_timeout(1800)
        ft=pg.evaluate("()=>[...window.__ft]")
        dom=pg.evaluate("()=>document.body.innerText")
        import re
        print(k,'canvas zh:',[x for x in ft if re.search('[一-龥]',x)][:20])
        print(k,'dom zh:',[l for l in dom.split('\n') if re.search('[一-龥]',l)][:10])
        pg.evaluate("()=>window.__ft.clear()")
    print(errs); b.close()
srv.terminate()
