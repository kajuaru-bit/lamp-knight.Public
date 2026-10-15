import json,glob,collections
d=glob.glob('/tmp/claude-0/-home-claude-lamp-knight-public/38bcb795-*/scratchpad')[0]
rows=[]
for f in glob.glob(d+'/res*.json'): rows+=json.load(open(f))
rows=[r for r in rows if 'err' not in r]
names=json.load(open(d+'/names.json'))
TH=['花園','極地','提燈洞窟','中華古代','深海','火山','夢境','詛咒沼澤','沙漠','糖果','電玩','未來','字母書房','彼岸','佛寺','日本','希臘']
g=collections.defaultdict(list)
for r in rows: g[(r['th'],r['c'])].append(r)
def score(rs):
    # 勝率（清房且沒死）、平均損血比例、平均時間（超時以 70 計）
    w=sum(1 for r in rs if r['cleared'] and not r['dead'])/len(rs)
    dm=sum(min(1,r['dmg']/max(1,r['hp0'])) for r in rs)/len(rs)
    tm=sum(r['time'] for r in rs)/len(rs)
    return w,dm,tm
cl=sorted({r['c'] for r in rows})
tab={}
for (th,c),rs in g.items(): tab[(th,c)]=score(rs)
print('n=',len(rows))
print('主題 平均勝率 平均損血 平均用時 | 最強職業(勝率) | 最弱')
summ=[]
for th in range(17):
    xs=[tab[(th,c)] for c in cl if (th,c) in tab]
    if not xs: continue
    aw=sum(x[0] for x in xs)/len(xs); ad=sum(x[1] for x in xs)/len(xs); at=sum(x[2] for x in xs)/len(xs)
    order=sorted([(tab[(th,c)][0],-tab[(th,c)][1],names[c]) for c in cl if (th,c) in tab],reverse=True)
    summ.append((th,aw,ad,at))
    print(f'{TH[th]:6s} {aw:.2f} {ad:.2f} {at:5.1f} | {order[0][2]}{order[0][0]:.2f} {order[1][2]}{order[1][0]:.2f} | {order[-1][2]}{order[-1][0]:.2f}')
print()
print('職業 平均勝率 | 勝率最高主題(前2) | 最低主題')
for c in cl:
    xs=[(tab[(th,c)][0],TH[th]) for th in range(17) if (th,c) in tab]
    if not xs: continue
    xs.sort(reverse=True)
    print(f'{names[c]:6s} {sum(x[0] for x in xs)/len(xs):.2f} | {xs[0][1]}{xs[0][0]:.2f} {xs[1][1]}{xs[1][0]:.2f} | {xs[-1][1]}{xs[-1][0]:.2f}')
