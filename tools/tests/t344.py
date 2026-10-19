import subprocess,time,os
from playwright.sync_api import sync_playwright
d=os.getcwd()
srv=subprocess.Popen(['python3','-m','http.server','8844','--directory',d+'/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':700}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8844/index.html'); pg.wait_for_timeout(600)
    print(pg.evaluate("""()=>{const t=window.__t;t.THEMES[t.SKY_ID]=t.SKY;t.newRun();t.run.themes=[27,27,27,27,27,27,27,27,27];t.run.plan=['combat'];t.run.practice=true;t.run.visit=true;t.loadRoom();t.placeEntry();t.room.visit=true;t.room.vis=[];t.skySetup();t.setState('play');
      const f=t.room.items.find(i=>i.kind==='skyfish');const log=[];
      t.skyInteract(f);log.push(f.fs); t.skyInteract(f);log.push(f.fs); // early reel
      t.skyInteract(f);for(let i=0;i<400&&f.fs==='wait';i++)t.update(1/60);log.push(f.fs);
      t.skyInteract(f);log.push(f.fs,f.n);
      t.skyInteract(f);for(let i=0;i<400&&f.fs==='wait';i++)t.update(1/60);for(let i=0;i<120;i++)t.update(1/60);log.push(f.fs);
      return log}"""))
    print(pg.evaluate("""()=>{const t=window.__t;const f=t.room.items.find(i=>i.kind==='skyfish');let n=0;
      while(!f.done&&n<400){t.skyInteract(f);for(let i=0;i<500&&f.fs==='wait';i++)t.update(1/60);t.skyInteract(f);n++;}
      for(let i=0;i<60;i++){t.update(1/60);t.render&&t.render();}
      return [n,f.n,Object.keys(f.dex).length,f.done,!!t.room.rainbow]}"""))
    pg.click('#btnLang'); pg.wait_for_timeout(300)
    print(pg.evaluate("""C=>new Promise(res=>{const es=C.map(s=>{const e=document.createElement('span');e.textContent=s;document.body.appendChild(e);return e});setTimeout(()=>res(es.map(e=>e.textContent)),200)})""",['釣到了：星星魚！（累計 3）　新發現 3 / 8','圖鑑集滿了！天空出現了彩虹，小鳥們一起唱起歌來']))
    pg.click('#btnLang'); pg.wait_for_timeout(300)
    print(pg.evaluate("""C=>new Promise(res=>{const es=C.map(s=>{const e=document.createElement('span');e.textContent=s;document.body.appendChild(e);return e});setTimeout(()=>res(es.map(e=>e.textContent)),200)})""",['釣到了：星星魚！（累計 3）　新發現 3 / 8']))
    print(errs); b.close()
srv.kill()
