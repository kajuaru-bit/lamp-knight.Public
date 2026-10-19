import subprocess,time,os,json
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8846','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
JS="""i=>{const t=window.__t;t.setChosen(i);t.newRun();t.setState('play');const out={};const c=t.CLS[i];out.name=c.name;out.hp=c.hp;out.w=c.weapon;out.spd=c.spd||1;
 for(const dist of [60,200]){
  t.newRun();t.setState('play');t.enemies=[];t.bullets.length=0;
  t.p.weapons=[c.weapon];t.p.w=0;t.p.x=t.ROOM.x+400;t.p.y=t.DOOR.y;t.p.hp=t.p.maxHp=999;t.p.iframes=999;
  const e=t.spawnEnemy('crawler',t.p.x+dist,t.p.y);e.hp=1e6;e.maxHp=1e6;e.passive=true;e.spawn=0;e.sleep=false;e.speedMul=0;
  t.p.aim={x:1,y:0};const h0=e.hp;let n=0;
  for(let f=0;f<900;f++){ t.p.x=t.ROOM.x+400;t.p.y=t.DOOR.y;e.x=t.p.x+dist;e.y=t.p.y;e.vx=0;e.vy=0; if(t.p.cd<=0){t.attack();n++;} t.update(1/60); if(e.dead) break;}
  out['d'+dist]=+((h0-e.hp)/15).toFixed(2);out['n'+dist]=n;}
 return out}"""
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(); errs=[]; pg.on('pageerror',lambda x:errs.append(str(x)))
    pg.goto('http://127.0.0.1:8846/index.html'); pg.wait_for_timeout(500)
    n=pg.evaluate("window.__t.CLS.length")
    res=[]
    for i in range(n):
        try: res.append(pg.evaluate(JS,i))
        except Exception as ex: res.append({'i':i,'err':str(ex)[:120]})
    json.dump(res,open('dps.json','w'),ensure_ascii=False)
    for r in res: print(r)
    print(errs[:3]); b.close()
srv.kill()
