import sys,json,os,time,subprocess
from playwright.sync_api import sync_playwright
# 用法：python3 runner.py <port> <part> <nparts> <out.json> [modes逗號分隔] [classes逗號分隔]
HERE=os.path.dirname(os.path.abspath(__file__)); SITE=os.path.normpath(HERE+'/../tests/site')
port,part,nparts,outf=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
modes=(sys.argv[5] if len(sys.argv)>5 else 'normal').split(',')
classes=[int(x) for x in sys.argv[6].split(',')] if len(sys.argv)>6 else None
srv=subprocess.Popen(['python3','-m','http.server',str(port),'--directory',SITE],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
out=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(); pg.goto('http://127.0.0.1:%d/index.html'%port); pg.wait_for_timeout(800)
    pg.add_script_tag(path=HERE+'/bot2.js')
    for m in modes:
        if m!='normal': pg.evaluate("(k)=>__t.useDlc(k)",m); pg.wait_for_timeout(1500)
    n=pg.evaluate("__t.CLS.length"); cl=classes if classes is not None else list(range(n))
    jobs=[(c,m) for m in modes for c in cl]
    for i,(c,m) in enumerate(jobs):
        if i%nparts!=part: continue
        t0=time.time()
        try: r=pg.evaluate("([c,m])=>window.__run({cls:c,dlc:m==='normal'?null:m,maxSim:1500,stallSim:200})",[c,m])
        except Exception as e: r={'err':str(e)[:160]}
        r.update(c=c,mode=m,real=round(time.time()-t0,1)); out.append(r); json.dump(out,open(outf,'w'),ensure_ascii=False); print(r,flush=True)
    b.close()
srv.kill()
