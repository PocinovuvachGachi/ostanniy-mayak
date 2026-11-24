/* Симулятор живого гравця (issue #1).
   Бот грає людським темпом: клацає з паузами, читає діалоги, ходить у походи, б'ється, чекає.
   Нічого не знає наперед, крім відповідей на загадки й головоломки (за них — штраф часом, як на роздуми).
   Друкує, на якій хвилині що відкрилося, і шукає провали (довго нічого нового) та ривки (забагато одразу).

   node tests/sim/pace.js [профіль] [хвилин]     профілі: active (за замовчуванням), casual
   SIMJSON=1 — додатково вивести JSON для подальшого аналізу. */
const prof = process.argv[2] || 'active', LIMIT = +(process.argv[3] || 600);
require('../harness.js')(`(()=>{
const PROF=${JSON.stringify(prof)},LIMIT=${LIMIT};
const P=PROF==='casual'?{click:2.5,act:5,read:12,fightStep:4,travel:25,think:180,idle:20}:{click:1.1,act:3,read:7,fightStep:3,travel:15,think:120,idle:10};
let T=0,acts=0;const tried={};const ev=[],seen=new Set();
/* час іде: годинник, виробництво, перевірки — як у головному циклі */
function wait(sec,present=true){while(sec>0){const d=Math.min(5,sec);__adv(d*1000);s.t+=d;produce(d);if(present)s.lastAct=Date.now();checks();sec-=d;T+=d}}
function A(a,i,cost){acts++;act(a,i);wait(cost==null?P.act:cost)}
const mins=()=>(T/60).toFixed(1);
/* що вважаємо відкриттям */
function mark(k,label,major){if(seen.has(k))return;seen.add(k);ev.push({t:T,k,label,major})}
function scan(){for(const t in s.tabs)mark('tab:'+t,'вкладка «'+(TABS.find(x=>x[0]===t)||[t,t])[1]+'»',1);
  for(const f in s.floors)if(s.floors[f])mark('floor:'+f,'поверх: '+((FL.find(x=>x.id===f)||{}).n||f),1);
  if(s.b.hearth)mark('b:hearth','вогнище',1);for(const b of BD)if(s.b[b.id])mark('b:'+b.id,'будівля: '+b.n,1);
  for(const l in s.disc)mark('disc:'+l,'місце на мапі: '+LOC[l].n,1);for(const l in s.visited||{})mark('vis:'+l,'побував: '+LOC[l].n,0);
  for(const r in s.rs)mark('rs:'+r,'дослідження: '+(RS.find(x=>x.id===r)||{}).n,1);
  for(const n in s.nv||{})if(s.nv[n])mark('nv:'+n,'нова механіка: '+n,1);
  s.chs.forEach((c,i)=>mark('ch:'+i,'розділ '+(i+1),1));
  for(const k in s.inv)if(s.inv[k]&&IT[k])mark('it:'+k,'річ: '+IT[k].n,0);
  for(const k of RES)if(s.seen[k])mark('res:'+k,'ресурс: '+k,1);
  if(s.vq&&s.vq.t)for(const k in s.vq.t)mark('vq:'+k,'прохання: '+k,1);if(s.met.levko)mark('rot:'+rotRank(),'Причал: '+RW[rotRank()],1);if(has('key'))mark('key','ключ Ганни',1);for(const k in s.odd)mark('odd:'+k,'дивина: '+OD[k].n,1);for(const k in s.runes||{})mark('rune:'+k,'камінь з написом',1);for(const k in s.ford||{})mark('ford:'+k,'брід: '+k,1);
  mark('lvl:'+s.h.lvl,'рівень героя '+s.h.lvl,0);
  for(const k of ['rod','wreck','people','boat','schooner','won','siege1','ostap','chest','crypt','stones','fordSeen','fordDone','gullrack','rats','drown1','zinovii','horpyna','cache','tracks','seal','signal','martinSet','reunion','herbsDone'])if(s.f[k])mark('f:'+k,'подія: '+k,1)}
/* діалоги: читаємо й тиснемо першу кнопку */
function dialogs(){let g=0;while((s.dlg||[]).length&&g++<30){const d=s.dlg[0];wait(P.read);
  if(d.bgsel){act('bg',Object.keys(BGS)[0]);continue}
  const b=d.btns&&d.btns[0];if(b){acts++;act(b[1],b[2]);if(s.cb)fight();continue}act('dlgok')}}
let fightActs=0;const _act=act;act=(a,i)=>{if(s.cb)fightActs++;return _act(a,i)};
function fight(){if(${!!process.env.SIMSNAP}&&s.cb)console.log('SNAP '+JSON.stringify({t:T,enc:s.cb.enc,s}));fightActs=0;botFight(800);wait(fightActs*P.fightStep+10);mark('fight:'+(s.c.wins||0),'перемог у боях: '+(s.c.wins||0),0)}
/* герой: очки характеристик, умінь, таланти; спорядження */
function hero(){let g=0;while(s.h.pts>0&&g++<20){const k=Object.keys(s.h.a).sort((a,b)=>s.h.a[a]-s.h.a[b])[0];A('attr',k,1)}
  g=0;while(s.h.sp>0&&g++<20){const k=Object.keys(s.h.k).filter(k=>s.h.k[k]<skillCap()).sort((a,b)=>s.h.k[a]-s.h.k[b])[0];if(!k)break;A('skill',k,1)}
  g=0;while(s.h.fp>0&&g++<5){const f=FT.find(f=>tVis(f)&&featOk(f));if(!f)break;A('feat',f.id,2)}}
const want=()=>{const L=[];const fi=FL.findIndex(f=>!s.floors[f.id]);const f=FL[fi];if(f&&(!f.req||f.req())&&(!f.it||afford({},f.it)))L.push(['floor',f.id,f.c]);
  for(const rc of RC)if(rcVisible(rc)&&!rc.multi&&(rc.craft||0)<=st('craft'))L.push(['craft',rc.id,rcCost(rc),rc.it]);
  if(s.tabs.study)for(const r of RS)if(!s.rs[r.id]&&rsReady(r))L.push(['rs',r.id,{lore:rsCost(r)}]);
  if((s.b.hearth||0)<8)L.push(['bld','hearth',bCost(HEARTH)]);
  for(const b of BD)if(b.show()&&!(b.max&&(s.b[b.id]||0)>=b.max)&&(s.b[b.id]||0)<6)L.push(['bld',b.id,bCost(b)]);
  if(s.b.shipyard&&!s.f.schooner)L.unshift(['schooner','',SCHOONER]);
  if(s.f.fordSeen&&!s.f.fordDone)for(const P of FORD)if(!(s.ford||{})[P.id]&&(!P.req||P.req()))L.unshift(['ford',P.id,P.c]);
  /* провізія на походи: якщо є куди плисти, а нема з чим */
  for(const l in s.disc){const Lc=LOC[l];if(!Lc||!Lc.sea||l===s.at)continue;if(typeof locTodo==='function'&&!locTodo(l).length)continue;const need=seaCost(Lc)*2;if(s.r.prov<need){L.push(['trip',l,{prov:need}]);break}}
  return L};
function buy(){let did=0;const tg=target();for(const[a,i,c,it]of want()){if(a==='trip'||a==='ford'&&!tideLow())continue;
    /* покращення не з'їдають запас на головну ціль */
    if(a==='bld'&&((s.b[i]||0)>=1||tg&&(tg[0]==='ford'||tg[0]==='schooner'))&&tg&&tg[1]!==i&&Object.keys(c).some(k=>tg[2][k]&&s.r[k]-c[k]<tg[2][k]))continue;
    if(afford(c,it||{})){A(a,i);did=1;if(a==='craft'){const rc=RC.find(x=>x.id===i);if(rc&&rc.out&&IT[rc.out]&&IT[rc.out].slot)A('equip',rc.out,1)}}}return did}
/* чим зайнятися руками: збирати те, чого бракує на найближчу ціль */
function gatherFor(){const L=want();let best=null,bv=1e9;for(const[a,i,c]of L){let need=0;for(const k in c)need+=Math.max(0,c[k]-s.r[k])/(k==='ember'?3:1);if(need>0&&need<bv){bv=need;best=c}}
  /* цікавість: нову дію гравець пробує кілька разів, навіть якщо вона ще не потрібна */
  if(tideLow()&&!onCd('pool')&&(tried.pool||0)<30){tried.pool=(tried.pool||0)+1;A('pool','',P.click);return 1}
  for(const a of ['fishing','scrapw','gather']){if(a==='scrapw'&&!s.f.wreck||a==='fishing'&&!s.f.rod||!s.tabs.shore)continue;if((tried[a]||0)<15&&!onCd(a)){tried[a]=(tried[a]||0)+1;A(a,'',P.click);return 1}}
  const LS=lackSet(),lack=(best?Object.keys(best).filter(k=>s.r[k]<best[k]):[]).concat([...LS]);
  const src={wood:'gather',scrap:'scrapw',fish:'fishing',ember:'blow'};for(const k of lack.concat(['wood','scrap','fish'])){const a=src[k];if(!a)continue;
    if(a==='scrapw'&&!s.f.wreck)continue;if(a==='fishing'&&!s.f.rod)continue;if(a==='blow'&&s.b.hearth)continue;if(!s.tabs.shore&&a!=='blow')continue;
    if(onCd(a))continue;A(a,'',P.click);return 1}
  return 0}
/* головоломки: розв'язок відомий, але гравець думає */
function puzzles(L,S){if(S.bells&&!s.f.crypt){wait(P.think);for(const b of BELLSEQ)A('bell',b,2);return 1}
  if(S.stones&&!s.f.stones){wait(P.think);for(let n=0;n<3;n++)while(s.stones[n]!==2)A('stone',n,1);A('stonesTry','',2);return 1}
  if(S.bog&&!s.f.bogPath){wait(P.think);let g=0;while(!s.f.bogPath&&g++<12){const row=BOGP[s.bog||0];if(!row)break;A('bogstep',row.findIndex(o=>o[1]),3)}return 1}
  return 0}
function locTodo(l){const out=[];for(const S of LOC[l].spots){if(S.show&&!S.show())continue;if(S.bells&&!s.f.crypt||S.stones&&!s.f.stones||S.bog&&!s.f.bogPath)out.push({p:S});
  for(const Ac of S.acts||[]){const id=l+'.'+S.id+'.'+Ac.id;if(Ac.once&&s.done[id])continue;if(Ac.show&&!Ac.show())continue;if(Ac.riddle){out.push({r:id,a:Ac.riddle.ans[0]});continue}
    if(Ac.cd&&!Ac.fight)continue; /* повторювані збирання — лише коли треба */
    if(!laOk(id))continue;if(Ac.fight&&!Ac.once&&s.done['win:'+id])continue;if((skipT[id]||0)>T)continue;out.push({id,fight:!!Ac.fight})}}return out}
const skipT={};
function heal(){let g=0;while(s.h.hp<maxHP()*.85&&g++<40){if(s.r.prov>=1&&maxHP()-s.h.hp>=15)A('eatp','',1);else if(s.r.fish>=1)A('eat','',1);else break}}
function explore(){const ls=Object.keys(s.disc).filter(l=>LOC[l]);for(const l of ls){const td=locTodo(l);if(!td.length)continue;if(l!==s.at){const[ok]=canGo(l);if(!ok)continue;if(s.at)A('leave','',2);A('go',l,P.travel)}
    let g=0;while(g++<20){dialogs();if(s.cb)fight();heal();const t=locTodo(l);const x=t.find(x=>x.p)||t.find(x=>x.r)||t.find(x=>x.id&&!x.fight)||t.find(x=>x.fight&&s.h.hp>=maxHP()*.8);if(!x)break;
      if(x.p){if(!puzzles(l,x.p))break;continue}
      if(x.r){wait(P.think);els['rd-'+x.r.replace(/\\./g,'-')]={value:x.a};A('riddle',x.r);continue}
      const w0=s.c.wins||0,sig0=JSON.stringify([s.done,s.f,s.inv,s.disc]).length;A('la',x.id);dialogs();if(s.cb){fight();if((s.c.wins||0)>w0)s.done['win:'+x.id]=1}
      else if(JSON.stringify([s.done,s.f,s.inv,s.disc]).length===sig0)skipT[x.id]=T+900}
    if(s.at)A('leave','',P.travel);return 1}return 0}
function misc(){let d=0;if(s.floors.gallery&&s.tabs.map&&SCAN.some(x=>!s.disc[x])&&s.r.ember>=scanCost()){A('scan');d=1}
  for(const f in s.req||{}){if(afford(s.req[f].give)){A('freq',f);d=1}}
  if(s.tabs.trade)for(const it of SHOP){if((it.show&&!it.show())||s.bought&&s.bought[it.id])continue;const p=price(it.p);if(IT[it.id]&&has(it.id))continue;if(s.r.coin>=p*1.5){A('buy',it.id);s.bought=s.bought||{};s.bought[it.id]=1;d=1}}
  if(s.shf&&(SHF[s.shf].npc||s.h.hp>=maxHP()*.7)){A('shfgo','',2);if(s.cb)fight();d=1}
  for(const k in RUNE)if(!(s.runes||{})[k]&&RUNE[k].ok()){A('rune',k,3);d=1}
  if(runesAll()&&!s.f.cache){A('cache','',5);d=1}
  if(s.flot){A('flot',1);d=1}if(s.bite){A('bigfish','',8);d=1}if(s.hot){A('smithhot','',8);d=1}
  if(s.lost&&s.f.won){A('beam',s.lost.sec,2);d=1}
  if(s.floors.lantern&&!s.f.won){wait(P.think);const ks=Object.keys(s.mirrors);for(let mask=0;mask<1<<ks.length&&!s.f.won;mask++){const want=ks.map((k,i)=>mask>>i&1?'/':'\\\\');ks.forEach((k,i)=>{if(s.mirrors[k]!==want[i])A('mirror',k,1)})}d=1}
  if(s.b.shipyard&&!s.f.schooner&&afford(SCHOONER)){A('schooner');d=1}
  if(s.tabs.study&&s.f.chestSeen!==1&&s.floors.study&&!s.f.chest){wait(P.think);for(let n=0;n<CHESTCODE.length;n++)while(s.chest[n]!==CHESTCODE[n])A('dial',n,1);A('chestTry');d=1}
  for(const w of WEAP||[])if(has(w)){const n0=s.wf&&s.wf[w];act('wup',w);if((s.wf&&s.wf[w])!==n0){d=1;wait(P.act)}}
  for(const D of DEF){if((!D.req||D.req())&&defL(D.id)<1&&afford(defCost(D))){A('def',D.id);d=1}}
  return d}
/* перетворювачі (кузня, коптильня…) з'їдають ресурси: гравець вимикає їх, коли копить на ціль */
/* ціль — найближча за нестачею (походи — у пріоритеті), сировина — лише під неї */
function target(){const L=want();const tr=L.find(x=>x[0]==='trip'||x[0]==='ford'||x[0]==='schooner');if(tr)return tr;let best=null,bv=1e9;for(const w of L){let need=0;for(const k in w[2])need+=Math.max(0,w[2][k]-s.r[k])/Math.max(1,w[2][k]);if(need>0&&need<bv){bv=need;best=w}}return best}
function lackSet(){const lack=new Set(),tg=target();if(tg)for(const k in tg[2])if(s.r[k]<tg[2][k])lack.add(k);
  /* ланцюжки: якщо бракує того, що робить перетворювач, бракує і його сировини */
  for(let g=0;g<3;g++){if(lack.has('ember')&&s.b.hearth)lack.add('wood');for(const id in CONV){if(!s.b[id])continue;const C=CONV[id];if(Object.keys(C.out).some(k=>lack.has(k)))for(const k in C.in)if(s.r[k]<50)lack.add(k)}}return lack}
const togT={};
function convs(){const lack=lackSet();const CV=Object.assign({hearth:{in:{wood:1},out:{ember:1}}},CONV);for(const id in CV){if(!s.b[id])continue;if(T-(togT[id]||-1e9)<120)continue;const C=CV[id],need=Object.keys(C.out).some(k=>lack.has(k)),eats=Object.keys(C.in).some(k=>lack.has(k)),on=s.on[id]!==false;
  const should=need||!eats;if(should!==on){togT[id]=T;acts++;act('tog',id);wait(1)}}}
/* головний цикл гравця */
act('look');let lastNew=0,stuck=0,nEv=0;
/* гравець заглядає в нові вкладки й підвкладки — це знімає позначки новизни */
function looks(){s.nvU=s.nvU||{};for(const t in s.tabs)s.nvU[t]=1;if(s.tabs.hero)for(const k of['gear','bag','arms','grow','talents'])s.nvU[k]=1}
while(T<LIMIT*60){looks();dialogs();if(s.cb)fight();hero();scan();buy();convs();
  if(ev.length>nEv){nEv=ev.length}
  if(!s.f.looked&&s.tot.ember>=10)A('look');
  let did=buy()||misc();if(!did&&(s.h.hp>=maxHP()*.8||!Object.keys(s.disc).length))did=explore();
  if(!did)did=gatherFor();
  if(!did){if(s.h.hp<maxHP()*.8)heal();wait(P.idle)}
  if(${!!process.env.SIMLOG}&&Math.floor(T/600)!==Math.floor((T-P.idle)/600)){const L=want().map(([a,i,c,it])=>a+':'+i+'['+Object.keys(c).filter(k=>s.r[k]<c[k]).map(k=>k+' '+Math.floor(s.r[k])+'/'+c[k]).join(',')+']').filter(x=>!x.endsWith('[]'));const fl=flow(1,1);
    console.log('LOG',mins(),'хв | rates',Object.keys(fl).filter(k=>Math.abs(fl[k])>.01).map(k=>k+' '+fl[k].toFixed(2)).join(' '),'| b',JSON.stringify(s.b),'| on',JSON.stringify(s.on),'| ціль',JSON.stringify(target()),'| хоче',L.slice(0,4).join(' '),'| lens',has('lens'),'wick',has('wick'),'beacon',!!s.rs.beacon,'craft',st('craft'),'skills',JSON.stringify(s.h.k),'sp',s.h.sp,'lvl',s.h.lvl)}
  if(s.f.heartDone||s.chs.length>=10&&s.f.won&&!LOC.heart.spots.some(S=>locTodo('heart').length))if(s.chs.length>=10)break}
scan();
/* звіт */
const maj=ev.filter(e=>e.major);maj.push({t:T,label:'(кінець симуляції)'});console.log('Профіль:',PROF,'· зіграно',mins(),'хв · дій',acts,'· розділів',s.chs.length,'· рівень',s.h.lvl,'· перемог',s.c.wins||0);
/* м'які орієнтири, не пороги: ~10 хв на початку гри, ~20 хв далі (рішення автора) */
const soft=t=>t<3600*3?10:20;let prev=0;const gaps=[];for(const e of maj){const g=(e.t-prev)/60;if(g>=soft(prev))gaps.push([prev/60,e.t/60,g,e.label]);prev=e.t}
console.log('\\nВідкриття (хвилина → що):');for(const e of maj)console.log(String((e.t/60).toFixed(1)).padStart(6),' ',e.label);
console.log('\\nДовгі провали (орієнтир: ~10 хв у перші 3 год, ~20 хв далі; це підказка, не помилка):');for(const[a,b,g,l]of gaps)console.log('  ',a.toFixed(1),'→',b.toFixed(1),'хв (',g.toFixed(1),') до:',l);
const bursts=[];for(let i=0;i<maj.length;i++){const w=maj.filter(e=>e.t>=maj[i].t&&e.t<maj[i].t+120);if(w.length>=6&&!bursts.some(b=>Math.abs(b[0]-maj[i].t)<120))bursts.push([maj[i].t,w.map(e=>e.label)])}
console.log('\\nРивки (6+ відкриттів за 2 хв):');for(const[t,l]of bursts)console.log('  ',(t/60).toFixed(1),'хв:',l.join('; '));
console.log('\\nДе застряг: розділів',s.chs.length,'вкладки',Object.keys(s.tabs).join(','),'поверхи',Object.keys(s.floors).filter(f=>s.floors[f]).join(','),'місця',Object.keys(s.disc).join(','));
console.log('Ресурси:',RES.filter(k=>s.seen[k]).map(k=>k+' '+Math.floor(s.r[k])).join(', '));
if(${!!process.env.SIMJSON})console.log(JSON.stringify(ev));
})();`);
