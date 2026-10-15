import sys,json,glob,time
from playwright.sync_api import sync_playwright
d=glob.glob('/tmp/claude-0/-home-claude-lamp-knight-public/38bcb795-*/scratchpad')[0]
part,nparts=int(sys.argv[1]),int(sys.argv[2])
DLC={9:'candy',10:'arcade',11:'future',12:'letters',13:'shore',14:'zen',15:'japan',16:'greek'}
themes=list(range(0,17))
out=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(); pg.goto('http://127.0.0.1:8765/index.html'); pg.wait_for_timeout(800)
    pg.add_script_tag(path=d+'/bot.js')
    ncls=pg.evaluate("()=>__t.CLS.length")
    # 載入 DLC 套件（setDlc 會載入主題）
    for th,k in DLC.items():
        pg.evaluate("(k)=>__t.useDlc(k)",k); pg.wait_for_timeout(1500)
    jobs=[(c,th,L,ci) for th in themes for c in range(ncls) for (L,ci) in [(1,1),(1,1),(1,1)]]
    for n,(c,th,L,ci) in enumerate(jobs):
        if n%nparts!=part: continue
        k=DLC.get(th)
        try:
            r=pg.evaluate("([c,th,k,L,ci])=>window.__bot({cls:c,theme:th,dlc:k,layer:L,ci:ci,maxT:70})",[c,th,k,L,ci])
        except Exception as e:
            r={'err':str(e)[:100]}
        r.update(c=c,th=th); out.append(r)
        json.dump(out,open(d+f'/res{part}.json','w'))
print('done',part,len(out))
