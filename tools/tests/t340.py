import subprocess,time,os
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8840','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8840/index.html'); pg.wait_for_timeout(600)
    # sky island via visit
    r=pg.evaluate("""()=>{const t=window.__t;t.newRun();t.setState('play');const orig=Math.random;return typeof t.THEMES}""")
    print(r)
    # force: call startVisit through THEMES registration check
    print(pg.evaluate("()=>{const t=window.__t;return [t.THEMES.length,'sky' in (t.THEMES[27]||{})]}"))
    # flicker test: rewrite text rapidly in en, check no Chinese frame at rAF
    pg.click('#btnLang'); pg.wait_for_timeout(300)
    res=pg.evaluate("""()=>new Promise(res=>{const el=document.createElement('div');document.body.appendChild(el);let bad=0,n=0;
      function step(){el.textContent='第 3 層';n++;requestAnimationFrame(()=>{ if(/[\\u4e00-\\u9fff]/.test(el.textContent)) bad++; if(n<30) step(); else res([bad,el.textContent]);});}
      step();})""")
    print('flicker',res)
    pg.click('#btnLang');pg.click('#btnLang'); pg.wait_for_timeout(200)
    r=pg.evaluate("""()=>{const t=window.__t;const o=Math.random;t.THEMES[t.SKY_ID]=t.SKY;t.newRun();t.run.themes=[27,27,27,27,27,27,27,27,27];t.run.plan=['combat'];t.run.practice=true;t.loadRoom();t.placeEntry();t.setState('play');return t.th()}""")
    print('theme',r); pg.wait_for_timeout(800)
    pg.screenshot(path='sky.png')
    print('tapbtn',pg.evaluate("document.getElementById('btnTapMv') ? document.getElementById('btnTapMv').textContent : null"))
    print('zh back',pg.evaluate("document.getElementById('btnLang').textContent"))
    print(errs); b.close()
srv.kill()
