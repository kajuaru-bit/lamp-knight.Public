import shutil,re
src='/home/claude/lamp-knight.public/'
d='/tmp/claude-0/-home-claude-lamp-knight-public/38bcb795-50e3-5eb3-a6fe-22f18509ed72/scratchpad/site/'
shutil.copy(src+'dlc.js',d+'dlc.js')
h=open(src+'index.html',encoding='utf-8').read()
h=h.replace('function aimUpdate() {','function aimUpdate() {\n  if (window.__botAim) return;',1)
i=h.rindex('})();')
inj="window.__t={WDEF,set fEdge(v){fEdge=v;},keys,optAuto,optUnlock,dlcOf,THEMES,get tbait(){return tbait;},CLS,hitEnemy,attack,useSkill,enemyShot,setChosen:i=>{chosen=i;},clsUnlocked,hurtPlayer,upN:(k)=>upN(k),spawnWave,composeWave,useDlc,setDlc,makeLayerPlan,loadRoom,placeEntry,update,render,newRun,get state(){return state;},setState:s=>{state=s;},get run(){return run;},get room(){return room;},get p(){return p;},get enemies(){return enemies;},set enemies(v){enemies=v;},get bullets(){return bullets;},get ROOM(){return ROOM;},get DOOR(){return DOOR;}};\n"
open(d+'index.html','w',encoding='utf-8').write(h[:i]+inj+h[i:])
