import shutil,re
import os
HERE=os.path.dirname(os.path.abspath(__file__))
src=os.path.normpath(HERE+'/../..')+'/'
d=HERE+'/site/'
os.makedirs(d,exist_ok=True)
shutil.copy(src+'dlc.js',d+'dlc.js'); shutil.copy(src+'dlc2.js',d+'dlc2.js'); shutil.copy(src+'dlc3.js',d+'dlc3.js'); shutil.copy(src+'dlc4.js',d+'dlc4.js'); shutil.copy(src+'dlc5.js',d+'dlc5.js'); shutil.copy(src+'lang.js',d+'lang.js')
h=open(src+'index.html',encoding='utf-8').read()
h=h.replace('function aimUpdate() {','function aimUpdate() {\n  if (window.__botAim) return;',1)
i=h.rindex('})();')
inj="window.__t={mouse,cam,skipDialog,pickEnding,announceRoom,advanceDialog,rewardUpgrade,applyUpgrade,PRAC,endPractice,setRecBak:v=>{recBak=v;},setSkyReward:v=>{skyReward=v;},skySetup,skyInteract,drawSkyItem,SKY_ITEMS,visitUpdate,drawVisitors,SKY,SKY_ID,startVisit,exitVisit,UPG,PREM,ACH,goNext,damageTob,sealUse,showOver,endlEnding,get tobs(){return tobs;},get rec(){return rec;},midBossDefeated,ENEMY,ENAME,openDlcMenu,lastL,lastL,th,makeItem,weaponOffer,affinity,WDEF,set fEdge(v){fEdge=v;},keys,optAuto,optUnlock,dlcOf,THEMES,get tbait(){return tbait;},CLS,spawnEnemy,upgradeOffer,interact,get pickups(){return pickups;},hitEnemy,attack,useSkill,enemyShot,setChosen:i=>{chosen=i;},clsUnlocked,hurtPlayer,upN:(k)=>upN(k),spawnWave,composeWave,useDlc,setDlc,makeLayerPlan,loadRoom,placeEntry,update,render,newRun,get state(){return state;},setState:s=>{state=s;},get run(){return run;},get room(){return room;},get p(){return p;},get enemies(){return enemies;},set enemies(v){enemies=v;},get bullets(){return bullets;},get ROOM(){return ROOM;},get DOOR(){return DOOR;}};\n"
open(d+'index.html','w',encoding='utf-8').write(h[:i]+inj+h[i:])
