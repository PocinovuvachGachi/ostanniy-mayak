/* Тактичний тест боїв (issue #2).
   Знімки боїв беремо з симулятора живого гравця (герой такий, яким він є на ту хвилину гри),
   і кожен бій проходять два боти: «бездумний» (найближча ціль, підійти й бити, стійка)
   і «тактичний» (пріоритет цілей — лікарі, ватажки, ті, хто замахнувся чи цілиться;
   не бити в панцир; ховатися від прицілу; відходити від замаху; не ставати в кліщі; триматися далі від води з хижаками).
   Якщо тактика майже нічого не дає — бій тримається на числах.
   node tests/sim/fights.js [спроб=20] */
const { spawnSync } = require('child_process'), path = require('path');
const N = +(process.argv[2] || 20);
const r = spawnSync('node', [path.join(__dirname, 'pace.js'), 'active', '400'], { env: Object.assign({}, process.env, { SIMSNAP: '1' }), encoding: 'utf8', maxBuffer: 1 << 28, timeout: 900000 });
const snaps = (r.stdout || '').split('\n').filter(l => l.startsWith('SNAP ')).map(l => JSON.parse(l.slice(5)));
console.log('Знімків боїв:', snaps.length);
require('../harness.js')(`(()=>{
const SN=${JSON.stringify(snaps)},N=${N};
/* ---- тактичний бот ---- */
const MEL=['hit','cold','wrap','charge','wind','hook'],RNG=['shoot','aim','bolt','spit','sand'],SUP=['mend','ward','veil','call','call2'];
const foes=c=>alive(c).filter(u=>!u.hid);
function danger(c,x,y){let d=0,adj=0;for(const e of foes(c)){const T=EN[e.t],[k,v,nm,rg]=uIntent(e),de=dist(e.x,e.y,x,y);
    if(MEL.includes(k)||e.wind){const reachE=(T.mv||2)+1;if(de<=reachE)d+=(e.wind?3:1)*(v||4)}
    if(RNG.includes(k)||e.aimed){const r=rg||1;if(de<=r+(T.mv||2)&&(de<=1||los(c,e.x,e.y,x,y)))d+=((e.aimed?1.4:1)*(v||6))*(1-cover(c,x,y,e.x,e.y)/100)}
    if(T.swim&&[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].some(([a,b])=>tileAt(c.a,x+a,y+b)==='~')&&de<=(T.mv||3)+1)d+=v||8;
    if(de<=1)adj++}
  if(adj>=2)d+=8;return d}
function score(c,u){const T=EN[u.t],[k]=uIntent(u);let sc=0;const dm=Math.max(1,wDmg()+s.h.a.str-1-(T.arm||0));
  if(T.p.some(p=>SUP.includes(p[0])))sc+=u.hp<=dm*3?60:15;if(u.wind)sc+=30;if(u.aimed)sc+=30;if(STANCE[k])sc-=50;
if(u.hp<=dm*1.2)sc+=40;sc-=dist(c.hx,c.hy,u.x,u.y)*4;sc-=u.hp/4;return sc}
function tacFight(maxT){let g=0,lastHit=0;while(s.cb&&g++<maxT){const c=s.cb;const rnd=c.round||0,urge=rnd-lastHit>=2?.25:1;const fs=foes(c);if(!fs.length){act('c_end');continue}
  if(s.h.hp<maxHP()*0.4&&c.ap>=1&&(beltHas('potion')||beltHas('bandage'))){act('c_item',beltHas('potion')?'potion':'bandage');continue}
  const tg=fs.slice().sort((a,b)=>score(c,b)-score(c,a))[0];c.sel=c.u.indexOf(tg);
  if(inReach(tg)&&c.ap>=wAP()){const ap0=c.ap;lastHit=rnd;act('c_atk');if(!s.cb||s.cb.ap!==ap0)continue}
  if(canShoot(tg)&&c.ap>=shotAP()){const ap0=c.ap;lastHit=rnd;act('c_shoot');if(!s.cb||s.cb.ap!==ap0)continue}
  /* куди стати: можна вдарити після кроку — добре; небезпека — погано */
  if(c.ap>=1){const D=costMap(c,c.hx,c.hy,'walk');let best=null,bv=-danger(c,c.hx,c.hy)*1.0-(dist(c.hx,c.hy,tg.x,tg.y)>1?dist(c.hx,c.hy,tg.x,tg.y)*2:0);
    for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const cost=D[y][x];if(!(cost>0&&cost<=c.ap)||unitAt(c,x,y)||!canStand(c,x,y,'walk'))continue;const left=c.ap-cost,dt=dist(x,y,tg.x,tg.y);
      const canHit=dt<=1&&left>=wAP()||(s.eq.ranged&&dt>1&&left>=shotAP()&&los(c,x,y,tg.x,tg.y));let v=(canHit?25:-dt*2)-danger(c,x,y)*urge-cost*.5;if(v>bv+.5){bv=v;best=[x,y]}}
    if(best){const ap0=c.ap;act('c_cell',best[0]+','+best[1]);if(!s.cb||s.cb.ap!==ap0)continue}}
  if(c.ap>=1&&!c.guard&&danger(c,c.hx,c.hy)>0){act('c_guard');continue}
  act('c_end')}}
/* ---- прогін ---- */
const res={};
for(const S of SN){const key=S.enc;res[key]=res[key]||{n:0,t:S.t,dumb:{w:0,hp:0},tac:{w:0,hp:0}};
  for(const bot of['dumb','tac'])for(let k=0;k<N;k++){s=JSON.parse(JSON.stringify(S.s));setGrid(s.cb);const w0=s.c.wins||0,hp0=s.h.hp,mx=maxHP();
    bot==='dumb'?botFight(800):tacFight(1500);const won=(s.c.wins||0)>w0;res[key][bot].w+=won?1:0;res[key][bot].hp+=won?(hp0-s.h.hp)/mx:1;if(bot==='tac')res[key].n++}}
console.log('\\nБій'.padEnd(22),'хв','  бездумний: перемог / втрачено HP','  тактичний: перемог / втрачено HP','  різниця');
let flat=0;for(const k in res){const R=res[k],n=R.n,f=x=>(x*100/n).toFixed(0).padStart(3)+'%';
  const dw=(R.tac.w-R.dumb.w)/n,dh=(R.dumb.hp-R.tac.hp)/n,mark=Math.abs(dw)<.1&&Math.abs(dh)<.1?'  ← тактика майже не важить':'';if(mark)flat++;
  console.log(k.padEnd(20),(R.t/60).toFixed(0).padStart(4),'   ',f(R.dumb.w),'/',f(R.dumb.hp/1),'           ',f(R.tac.w),'/',f(R.tac.hp/1),'          ',(dw*100>=0?'+':'')+(dw*100).toFixed(0)+'% перемог, '+(dh*100>=0?'−':'+')+Math.abs(dh*100).toFixed(0)+'% HP',mark)}
/* у кожного ворога має бути особлива механіка */
const plain=Object.keys(EN).filter(k=>{const T=EN[k];if(T.obj||T.ally||T.struct)return false;const kinds=new Set(T.p.map(p=>p[0]));kinds.delete('hit');return!kinds.size&&!T.fly&&!T.swim&&!T.amb&&!T.drain&&!T.thorns&&!T.enr&&!T.burst&&!T.poison});
console.log('\\nВороги без особливої механіки:',plain.length?plain.map(k=>EN[k].n).join(', '):'немає');
console.log('Боїв, де тактика майже не важить:',flat,'з',Object.keys(res).length);
})();`);
