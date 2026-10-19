import subprocess,time,os,json
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8803','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8803/index.html'); pg.wait_for_timeout(600)
    print(pg.evaluate("""()=>{const t=window.__t;const i=t.CLS.findIndex(c=>c.id==='idol');t.setChosen(i);t.newRun();t.setState('play');return [i,t.CLS.length,t.p.cls,t.p.weapons.join()]}"""))
    # skill cast
    print(pg.evaluate("""()=>{const t=window.__t;t.p.skillCd=0;t.useSkill();return [t.p.idolT,t.p.skillCd]}"""))
    # damage mult
    print('mult',pg.evaluate("""()=>{const t=window.__t;t.enemies.length=0;t.spawnEnemy('crawler',t.p.x+60,t.p.y);const e=t.enemies[0];e.spawn=0;const h0=e.hp;t.hitEnemy(e,1,1,0,0);const d1=h0-e.hp;t.p.idolT=0;e.hp=h0;t.hitEnemy(e,1,1,0,0);return [d1,h0-e.hp]}"""))
    # negation stats
    r=pg.evaluate("""()=>{const t=window.__t;let ok=0,N=2000,lo=0;
      for(let k=0;k<N;k++){t.p.hp=5;t.p.maxHp=5;t.p.iframes=0;t.p.skillCd=6;t.run.dmgIn=0;t.setState('play');t.hurtPlayer(1,1,0,0);if(t.p.hp===5)ok++;}
      let ok2=0;for(let k=0;k<N;k++){t.p.hp=2;t.p.maxHp=5;t.p.iframes=0;t.run.dmgIn=0;t.setState('play');t.hurtPlayer(1,1,0,0);if(t.p.hp===2)ok2++;}
      return [ok/N,ok2/N,t.p.skillCd]}""")
    print('negate',r)
    # charge cap per room & heals
    print(pg.evaluate("""()=>{const t=window.__t;t.p.hp=5;t.p.maxHp=5;t.p.skillCd=6;t.room.idolHit=0;for(let k=0;k<6;k++){t.p.iframes=0;t.setState('play');t.hurtPlayer(1,1,0,0);}return [t.p.skillCd,t.room.idolHit]}"""))
    print(pg.evaluate("""()=>{const t=window.__t;t.p.skillCd=6;t.room.idolHit=9;t.p.hp=t.p.maxHp;return 0}"""))
    pg.wait_for_timeout(100)
    pg.screenshot(path='idol.png')
    pg.click('#btnLang');pg.wait_for_timeout(300)
    print(pg.evaluate("[document.getElementById('skName').textContent]"))
    print(errs); b.close()
srv.terminate()
