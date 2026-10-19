import subprocess,time,os
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8843','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8843/index.html'); pg.wait_for_timeout(600)
    print(pg.evaluate("""()=>{const t=window.__t;t.THEMES[t.SKY_ID]=t.SKY;t.newRun();t.run.themes=[27,27,27,27,27,27,27,27,27];t.run.plan=['combat'];t.run.practice=true;t.run.visit=true;t.loadRoom();t.placeEntry();t.room.visit=true;t.room.vis=[];t.skySetup();t.setState('play');
      const its=t.room.items.filter(i=>t.SKY_ITEMS[i.kind]);const o=[];for(const it of its){t.p.x=it.x;t.p.y=it.y+20;t.skyInteract(it);}
      for(let i=0;i<120;i++){t.update(1/60);} return [its.length,t.room.vis.length]}"""))
    pg.wait_for_timeout(500)
    # move player near birds
    pg.evaluate("()=>{const t=window.__t;const v=t.room.vis[0];t.p.x=v.x;t.p.y=v.y;}"); pg.wait_for_timeout(600)
    pg.evaluate("()=>{const t=window.__t;const it=t.room.items.find(i=>i.kind==='skysheep');t.p.x=it.x-60;t.p.y=it.y;}"); pg.wait_for_timeout(400)
    pg.screenshot(path='sky2.png'); print(errs); b.close()
srv.kill()
