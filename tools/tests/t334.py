import subprocess,time,os,json
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8801','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8801/index.html'); pg.wait_for_timeout(600)
    # start run as alchemist
    r=pg.evaluate("""()=>{const t=window.__t;const i=t.CLS.findIndex(c=>c.id==='alchemist');t.setChosen(i);t.newRun();return [i,t.p.cls]}""")
    print('cls',r)
    pg.evaluate("""()=>{const t=window.__t;t.setState('play');t.p.weapons=['alcflask','capacitor'];t.p.w=0;t.p.cap={c:5000,dis:false,dealt:0,tk:0,n:0,lx:t.p.x,ly:t.p.y};}""")
    pg.wait_for_timeout(300)
    print('slots',pg.evaluate("[...document.querySelectorAll('.wslot')].map(x=>x.textContent)"))
    pg.evaluate("""()=>{const t=window.__t;t.p.cap.dis=true;t.p.cap.dealt=0}""");pg.wait_for_timeout(200)
    print('full',pg.evaluate("[...document.querySelectorAll('.wslot')].map(x=>x.textContent)"))
    pg.evaluate("""()=>{const t=window.__t;t.p.w=1;t.p.cap.dealt=37}""");pg.wait_for_timeout(200)
    print('dis',pg.evaluate("[...document.querySelectorAll('.wslot')].map(x=>x.textContent)"))
    # alchemist bank
    pg.evaluate("""()=>{const t=window.__t;t.p.w=0;t.p.skillCd=0;t.p.alcBank=0}""")
    print('skname',pg.evaluate("document.getElementById('pSkillName').textContent"), pg.evaluate("document.getElementById('skName').textContent"))
    pg.evaluate("""()=>{const t=window.__t;t.p.alcBank=4;}""");pg.wait_for_timeout(300)
    print('skname2',pg.evaluate("document.getElementById('skName').textContent"))
    pg.click('#btnLang');pg.wait_for_timeout(300)
    print('en',pg.evaluate("[...document.querySelectorAll('.wslot')].map(x=>x.textContent)"),pg.evaluate("document.getElementById('skName').textContent"))
    pg.click('#btnLang');pg.click('#btnLang');pg.wait_for_timeout(200)
    # death screen
    pg.evaluate("""()=>{const t=window.__t;t.run.deathBy='shooter';}""")
    ks=pg.evaluate("Object.keys(window.__t.ENEMY).slice(0,8)");print(ks)
    pg.evaluate("""()=>{const t=window.__t;t.run.deathBy=Object.keys(t.ENEMY)[1];t.showOver();}""");pg.wait_for_timeout(500)
    print('over',pg.evaluate("[document.getElementById('ovFoeBox').hidden,document.getElementById('ovFoeName').textContent,document.getElementById('ovPlayer').toDataURL().length,document.getElementById('ovFoe').toDataURL().length]"))
    pg.screenshot(path='over.png')
    print(errs); b.close()
srv.terminate()
