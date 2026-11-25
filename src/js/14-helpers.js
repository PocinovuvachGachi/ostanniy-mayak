/* ============ HELPERS ============ */
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const has=id=>(s.inv[id]||0)>0;
const shards=()=>s.inv.shard||0;
const wolf=()=>s.h.ft.wolf?1.5:1;
const onCd=k=>(s.cd[k]||0)>Date.now();
const setCd=(k,sec)=>{s.cd[k]=Date.now()+sec*1000};
function fr(n){return String(Math.round(n*100)/100).replace('.',',')}
function fmt(n){n=Math.floor(n+1e-9);return n>=10000?String(Math.round(n/100)/10).replace('.',',')+'к':String(n)}
function say(m,t='info'){if(!m)return;const L0=s.log[0],now=Date.now();if(L0&&!L0.cl&&L0.m===m&&L0.t===t&&now-L0.at<9000){L0.n=(L0.n||1)+1;L0.at=now;dirty=1;return}s.log.unshift({m,t,at:now});if(s.log.length>60)s.log.length=60;dirty=1}
function add(k,v){s.r[k]+=v;if(v>0&&(k==='fish'||k==='prov')&&typeof capOf==='function'){const cp=capOf(k);if(s.r[k]>cp){s.r[k]=Math.max(cp,s.r[k]-v);if(!s.f.capHit&&k==='fish'){s.f.capHit=1;say('Кошик із рибою повний — більше не влазить.','world')}}}if(v>0){if(!s.seen[k]){s.seen[k]=1;dirty=1}if(s.tot[k]!==undefined)s.tot[k]+=v}}
function giveI(id,n=1){s.inv[id]=(s.inv[id]||0)+n;s.seenI=s.seenI||{};s.seenI[id]=1;const it=IT[id];s.pack=s.pack||[];s.belt=s.belt||[];
  if(it.slot==='weapon'||it.slot==='ranged'){if(!s.pack.includes(id)&&s.pack.length<packSlots())s.pack.push(id);if(!s.eq[it.slot]&&s.pack.includes(id))s.eq[it.slot]=id}
  else if(it.slot&&!s.eq[it.slot])s.eq[it.slot]=id;
  if(it.use&&!s.belt.includes(id)&&s.belt.length<beltSlots())s.belt.push(id);dirty=1}
function afford(c={},it={}){return Object.keys(c).every(k=>s.r[k]>=c[k])&&Object.keys(it).every(k=>(s.inv[k]||0)>=it[k])}
function pay(c={},it={}){paidN++;for(const k in c)s.r[k]-=c[k];for(const k in it)s.inv[k]-=it[k]}
function costTxt(c={},it={}){const ik=Object.keys(it),kn=ik.filter(k=>KN(k));return[...Object.keys(c).map(k=>R(k,fmt(c[k]))),...kn.map(k=>(it[k]>1?it[k]+' × ':'')+IT[k].n.toLowerCase()),...(kn.length<ik.length?['ще дещо, чого ти поки не знаєш']:[])].join(', ')}
function dlg(o){s.dlg=s.dlg||[];if(s.dlg.length>14)return;if(o.k==='fight')s.dlg.unshift(o);else{s.dlg.push(o);try{if(away())s.bellHold=1}catch(e){}}dirty=1}
/* Поступовість (постулат 2): між відкриттями — пауза, щоб гравець устиг освоїти попереднє.
   novMark() — щойно щось відкрилося; calm() — можна відкривати наступне. Сюжетні події не чекають. */
const NOVGAP=45;
function novMark(key=''){s.lastNov=s.play||0;s.novLast=key}
function novUse(key){s.novUsed=s.novUsed||{};s.novUsed[key]=1}
// Автоматичні відкриття чекають спокійного моменту, ручні дії не блокуються.
function novCan(){return noGap()||(!s.cb&&!s.raid&&!(s.dlg||[]).length&&!away()&&calm())}
function novOptional(){return novCan()&&(noGap()||!s.novLast||(s.novUsed||{})[s.novLast]||(s.play||0)-(s.lastNov||0)>=90)}
const noGap=()=>typeof NOGAP!=='undefined'&&!!NOGAP;
const calm=()=>noGap()||(s.play||0)-(s.lastNov==null?-1e9:s.lastNov)>=NOVGAP;
function unlock(t,quiet=false){if(!s.tabs[t]){s.tabs[t]=1;novMark();s.newTab[t]=1;if(SUBT[t]){s.newTab.tower=1;s.ttNew=typeof s.ttNew==='object'&&s.ttNew?s.ttNew:{};s.ttNew[t]=1}dirty=1;if(t==='hero'){if(s.h.xpb){const b=s.h.xpb;s.h.xpb=0;xp(b)}}const nm=(TABS.find(x=>x[0]===t)||[0,SUBT[t]||''])[1];if(t!=='shore'&&!quiet)dlg({k:'world',title:`Відкрито: ${nm}`,body:`<p>${TABV[t]||(TUT[t]?'':TABINFO[t])||''}${!TUT[t]&&TABV[t]&&TABINFO[t]?ih(TABINFO[t]):''}</p>`,gains:[SUBT[t]?`«${nm}» — у вкладці «Маяк».`:`Відкрилася вкладка «${nm}».`]});tutOffer(t)}}
function page(n){if(!s.pages.includes(n)){s.pages.push(n);if(n===1)s.met.ostap=1;dlg({k:'story',title:n==='m'?'Записка Остапа без номера':`Записка Остапа, аркуш ${n}`,body:`<div class="note">${PG[n].replace(/ — О\.$/,'')}<span class="sig">— О.</span></div>`,gains:['Записку збережено в журналі.']});unlock('journal');dirty=1}}
function book(id){if(!s.books.includes(id)){s.books.push(id);dirty=1}}
function odd(id,pre){if(s.odd[id])return;s.odd[id]=1;s.oddNew=(s.oddNew||0)+1;xp(20);say((pre?pre+' ':'')+`Дивина: ${I(OD[id].n)}. +${Math.round(20*XPST[stageNo()])} досвіду.`,'find');const ik=ODI[id];dlg({k:'find',title:`Дивина: ${OD[id].n}`,img:{t:'icon',id:ik},body:`<p>${pre?pre+' ':''}${OD[id].d}</p>`,gains:['+20 досвіду',`Знайдено дивин: ${Object.keys(s.odd).length}`]})}
function reveal(id,quiet=false){if(!s.disc[id]){s.disc[id]=1;dirty=1;const L=LOC[id];mom('disc',L.n,L.d,{t:'scene',id:id==='bay'?'bayHigh':id});if(!quiet)dlg({k:'world',title:`Нове місце: ${L.n}`,img:{t:'scene',id:id==='bay'?'bayHigh':id},body:`<p>${L.d}</p>`,gains:['Нове місце на мапі.',L.sea?'Туди можна дістатися лише човном, і вихід у море коштує провізію.':'',L.dark?'Там темно: візьми в руку ліхтар.':''].filter(Boolean)})}}
function boat(){s.f.boat=1;reveal('reef')}
function logOf(x){return typeof x==='string'?{m:x,t:'info'}:x}
const TAGN={plan:'креслення',find:'знахідка',fight:'бій',story:'сюжет',lvl:'зростання',world:'світ',info:'подія'};

/* hero */
function eqv(p){let v=0;for(const sl in s.eq){const id=s.eq[sl];if(id&&IT[id]&&IT[id][p])v+=IT[id][p]}return v}
function st(k){let v=s.h.a[k]!==undefined?s.h.a[k]:(s.h.k[k]||0);
  if(k==='per')v+=eqv('per');if(k==='stealth')v+=eqv('stealth');if(k==='mech'&&s.rs.mech)v+=1;
  if(k==='stealth'&&s.h.ft.shadow)v+=2;if(k==='speech'&&s.h.ft.tongue)v+=2;return v}
const maxHP=()=>15+5*s.h.a.con+3*(s.h.lvl-1)+eqv('hp')+(s.h.ft.tough?5:0)+(s.h.ft.iron?15:0);
const maxAP=()=>Math.max(2,5+Math.floor((s.h.a.dex-1)/3)+(s.rs.tactics?1:0)+(s.h.ft.swift?1:0)+eqv('ap')-overPen());
const wAP=()=>s.eq.weapon?(IT[s.eq.weapon].wap||2):2;
const reach=()=>s.eq.weapon?(IT[s.eq.weapon].reach||1)+(s.eq.weapon==='harpoon'&&wF('harpoon')>=2?1:0):1;
const heavyAP=()=>wAP()+2-(s.h.ft.heavy?1:0);
const need=l=>40*l+20*(l-1)*(l-1);
const ACAP=10;
const wDmg=()=>s.eq.weapon?IT[s.eq.weapon].dmg+2*wF(s.eq.weapon)+((s.wfb||{})[s.eq.weapon]||0)+(fuL('work')>=2?1:0):1;
const wmLv=id=>{const x=(s.wm||{})[id]||0;let l=0;for(let i=1;i<MXP.length;i++)if(x>=MXP[i])l=i;return l};
const armor=()=>eqv('arm')+(s.h.ft.hide?1:0)+(s.eq.weapon==='oar'&&wmLv('oar')>=3?1:0);
const packSlots=()=>3+(s.f.pack||0);
const beltSlots=()=>2+(s.f.belt?2:0);
const loadCap=()=>8+2*s.h.a.str+3*(s.f.pack||0);
function carried(){let w=0;for(const id of s.pack||[])w+=IT[id]&&IT[id].wt||0;for(const sl of['armor','light'])if(s.eq[sl])w+=IT[s.eq[sl]].wt||0;return w}
const overPen=()=>{const o=carried()-loadCap();return o>0?Math.ceil(o/4):0};
const shotAP=()=>{const w=s.eq.ranged;return w==='pistol'?(wmLv('pistol')>=1?3:4):(w==='sling'&&wmLv('sling')>=3)||(w==='crossbow'&&wF('crossbow')>=2)?2:3};
const rngOf=()=>s.eq.ranged?IT[s.eq.ranged].rng+(s.h.ft.sniper?2:0)+(s.eq.ranged==='crossbow'&&wmLv('crossbow')>=3?1:0)+(s.eq.ranged==='sling'&&wF('sling')>=2?2:0):0;
function wmGain(id,n){if(!id||!WT[id])return;s.wm=s.wm||{};const l0=wmLv(id);s.wm[id]=(s.wm[id]||0)+n;if(s.cb){s.cb.wmg=s.cb.wmg||{};s.cb.wmg[id]=(s.cb.wmg[id]||0)+n}
  const l1=wmLv(id);if(l1>l0){const tq=WT[id].t.find(x=>x[0]===l1);dlg({k:'lvl',title:`Майстерність: ${wN(id)}, рівень ${l1}`,img:{t:'icon',id},body:`<p>Рука звикає до зброї.${tq?` Відкрито прийом «${tq[1]}».`:''}</p>`,gains:tq?[tq[2]]:['Наступний прийом — на вищому рівні майстерності.']})}}
function packHas(id){return(s.pack||[]).includes(id)}
function beltHas(id){return(s.belt||[]).includes(id)&&has(id)}
const skillCap=()=>Math.min(10,s.h.lvl+2);
const rsCost=r=>Math.ceil(r.c*(s.h.ft.pupil?0.8:1)*(fuL('study')>=2?0.85:1));
const rsReady=r=>(r.r||[]).every(q=>s.rs[q])&&(!r.kill||s.kills[r.kill]>0);
function featOk(f){if(s.h.ft[f.id])return false;for(const k in f.req)if(st(k)<f.req[k])return false;return(f.pre||[]).every(q=>s.h.ft[q])}
const critCh=()=>5+3*st('per')+eqv('crit')+(s.h.ft.eye?15:0);
/* етап гри для прогресії: досвід за дії на пізніших етапах росте, щоб рівні йшли рівно (ціль I→4, II→9, III→14, IV→19, V→24) */
const stageNo=()=>!s.f.fordDone?1:!(has('key')||s.floors.study)?2:!s.f.ostap?3:!s.f.schooner?4:5;
const XPST=[1,1,3,7,10,11];
/* Мла сильнішає з етапами: вороги міцніші й б'ють сильніше (сюжетні бої етапу I — без змін) */
const FOEST=[1,1,1.3,1.4,1.5,1.5];
function xp(n){if(!n)return;n*=XPST[stageNo()];if(s.h.ft.curious)n*=1.1;if(fuL('study')>=3)n*=1.1;if(!s.tabs.hero){s.h.xpb=(s.h.xpb||0)+n;return}s.h.xp+=n;while(s.h.xp>=need(s.h.lvl)){s.h.xp-=need(s.h.lvl);s.h.lvl++;if(s.h.lvl%5===0)mom('lvl',`Рівень ${s.h.lvl}`,'Хранитель став сильнішим і досвідченішим.',{t:'hero'});s.h.pts++;const sp=1+(s.h.lvl%3===0?1:0)+(s.h.a.int>=4&&s.h.lvl%4===0?1:0);s.h.sp+=sp;s.h.fp++;s.h.hp=maxHP();say(`Новий рівень: ${s.h.lvl}.`,'lvl');
  const q=s.dlg||[],last=q[q.length-1],g=[s.nv.grow?`Вільних очок характеристик: ${s.h.pts}`:'',s.nv.grow?`Вільних очок умінь: ${s.h.sp}`:'',s.nv.tal?`Талантів до вибору: ${s.h.fp}`:'',s.nv.grow?`Стеля вмінь тепер ${skillCap()}`:'','Здоров’я відновлено повністю'].filter(Boolean);
  if(last&&last.lvup){last.title=`Новий рівень: ${s.h.lvl}`;last.gains=g}else dlg({k:'lvl',lvup:1,title:`Новий рівень: ${s.h.lvl}`,img:{t:'hero'},body:s.nv.grow?'<p>Ти став сильнішим. Розподіли очки у вкладці «Герой → Розвиток».</p>':'<p>Ти став сильнішим і витривалішим. Тіло пригадує, як воно колись рухалося.</p>',gains:g})}}

/* economy */
function repCost(b){const n=Math.max(0,(s.b[b.id]||1)-1),c={},m=0.5*Math.max(0.5,1-0.05*st('craft'));for(const k in b.base)c[k]=Math.max(1,Math.ceil(b.base[k]*Math.pow(b.mult,n)*m));return c}
function bCost(b){const n=s.b[b.id]||0,c={};for(const k in b.base)c[k]=Math.ceil(b.base[k]*Math.pow(b.mult,n));if(b.id==='hearth'&&n>=3)c.scrap=Math.ceil(4*Math.pow(1.6,n-3));return c}
function rcCost(rc){const m=(s.h.ft.smith?0.75:1)*(fuL('work')>=1?0.85:1);if(m===1)return rc.c;const c={};for(const k in rc.c)c[k]=Math.ceil(rc.c[k]*m);return c}
const scanCost=()=>28*Math.pow(2,s.scans);
// Причал — перша мета; далі корчмар підказує, де шукати уламки. Скелі відкривають люди.
const scanTarget=()=>s.tabs.map&&s.floors.gallery&&!s.at&&s.met.levko&&!s.disc.chaika?'chaika':null;
const sigCost=()=>Math.round(200*Math.pow(1.5,Math.min(s.sig||0,6))*(s.rs.signals?0.7:1)*(fuL('gallery')>=2?0.7:1)*(fac('sails')>=80?0.7:1));
const SEAFOOD=2;
const price=p=>Math.ceil(p*(s.f.crateDone?0.8:1)*(s.h.ft.trader?0.8:1)*(fac('rot')>=20?0.9:1)*(s.f.coinSet?0.9:1));
const sellG=g=>Math.round(g*(s.h.ft.trader?1.3:1));
const mstOf=b=>Object.keys(MST).some(m=>s.mst&&s.mst[m]&&MST[m].b.includes(b));
const people=()=>(s.pop||0)+Object.keys(s.mst||{}).length;
const freeW=()=>(s.pop||0)-Object.values(s.wk||{}).reduce((a,b)=>a+b,0)-(s.exp||[]).reduce((a,e)=>a+e.crew,0);
function eff(id,fed){const n=s.b[id]||0;if(!n||(s.dmgB||{})[id])return 0;const w=Math.min(n,(s.wk||{})[id]||0);return(n+0.5*w*fed)*(mstOf(id)?2:1)}
function loreRate(){return(fuL('study')>=1?1.5:1)*(0.2+0.1*s.books.length+(s.f.ostap?0.5:0))*(1+0.25*(s.b.shelves||0))*(1+0.1*Math.max(0,s.h.a.int-2))}
// Резерви захищають лише від автоматичного споживання; ручні покупки та виготовлення не обмежуються.
const STOCK_RESERVE={wood:10,scrap:6,fish:8,ember:160};
const reserveOn=id=>!(s.reserveFree||{})[id];
const reserveAmount=(id,k)=>reserveOn(id)?(STOCK_RESERVE[k]||0):0;
const reserveAvailable=(id,k,v)=>Math.max(0,v-reserveAmount(id,k));
function reserveInputs(id){return Object.keys(id==='hearth'?{wood:1}:(CONV[id]||{in:{}}).in).filter(k=>STOCK_RESERVE[k])}
function reserveText(id){if(!reserveOn(id))return 'Резерв вимкнено: може витрачати весь запас.';const keys=reserveInputs(id);if(!keys.length)return '';const low=keys.filter(k=>s.r[k]<=STOCK_RESERVE[k]+.01);return 'Резерв: '+keys.map(k=>RN[k]+' '+STOCK_RESERVE[k]).join(', ')+(low.length&&s.on[id]!==false&&!((s.dmgB||{})[id])?' · обмежено запасом: '+low.map(k=>RN[k]).join(', '):'')+'.'}
function flow(dt,dry){const L=s.b,d={};for(const k of RES)d[k]=0;const av=k=>s.r[k]+d[k];
  const eat=0.02*people()*dt;let fed=1;if(eat>0){fed=Math.min(1,Math.max(0,av('prov'))/eat);d.prov-=eat*fed;fed=0.5+0.5*fed}
  const E=id=>eff(id,fed),idle=Math.max(0,freeW());
  d.wood+=((L.hearth?0.15:0)+E('boom')*0.3*(s.rs.currents?2:1)*wolf()+0.1*idle*fed)*dt;
  d.scrap+=(E('pot')*0.15+E('winch')*0.3)*dt;
  d.fish+=E('traps')*0.25*wolf()*dt;
  d.herb+=E('garden')*0.12*dt;
  d.sand+=E('sandpit')*0.3*(s.rs.a_shark?1.25:1)*dt;
  if(s.floors.study)d.lore+=loreRate()*dt;
  if(s.f.won)d.coin+=((s.f.won2?5:2)+(fuL('lantern')>=3?2:0))*dt;
  d.ember+=dt;
  const hn=L.hearth||0;if(hn&&s.on.hearth!==false){const need=0.12*hn*dt*(fuL('hall')>=2?0.7:1),ratio=Math.min(1,reserveAvailable('hearth','wood',av('wood'))/need);d.wood-=need*ratio;d.ember+=2*hn*dt*ratio*(fuL('hall')>=1?1.25:1)}
  for(const id in CONV){const n=E(id)*((id==='smoke'||id==='render')&&s.rs.a_eel?1.5:1)*(id==='smoke'&&fac('cape')>=50?1.25:1)*(id==='smoke'&&(s.mst||{}).zinovii?2:1)*(id==='glass'&&s.rs.a_shark?1.25:1);if(!n||s.on[id]===false)continue;const C=CONV[id];let ratio=1;
    for(const k in C.in)ratio=Math.min(ratio,reserveAvailable(id,k,av(k))/(C.in[k]*n*dt));
    if(typeof capOf==='function')for(const k in C.out)if(s.r[k]>=capOf(k))ratio=0;
    if(!(ratio>0))continue;for(const k in C.in)d[k]-=C.in[k]*n*dt*ratio;for(const k in C.out)d[k]+=C.out[k]*n*dt*ratio}
  if(!dry)for(const k of RES)if(d[k]){add(k,d[k]);if(s.r[k]<0)s.r[k]=0}
  return d}
function rates(){const d=flow(1,true);d.xp=(s.b.dummy||0)*0.08;return d}
function produce(dt){s.play=(s.play||0)+dt;flow(dt);rdTick(dt);const L=s.b;
  if(L.dummy)xp(L.dummy*0.08*dt);
  if(!s.cb)s.h.hp=Math.min(maxHP(),s.h.hp+regenRate()*dt);
}
/* progression */
function storyCheck(quiet){s.bts=s.bts||{};
  CH.forEach((ch,ix)=>{for(const b of ch.beats)if(!s.bts[b[0]]&&b[2]()){s.bts[b[0]]=1;dirty=1;if(!quiet)mom('beat',b[1],b[3],null,0,ch.id);if(!quiet&&ch.beats.length>1&&b!==ch.beats[ch.beats.length-1])say(`<b>${b[1]}.</b> ${b[3]}`,'story')}
    if(!s.chs.includes(ch.id)&&ch.beats.every(b=>s.bts[b[0]])){s.chs.push(ch.id);s.chSeen=s.chs.length;dirty=1;if(quiet)return;mom('chap',`Розділ ${ROM(ix+1)} · ${ch.n}`,ch.d,ch.img&&ch.img.t==='yard'?{t:'yard',st:yardSt()}:ch.img,1,ch.id);
      const nx=CH.find((c,k)=>k>ix&&!c.side&&!s.chs.includes(c.id));
      s.dlg=s.dlg||[];s.dlg.push({k:'story',chap:1,no:ix+1,sub:ch.n,title:`Розділ ${ix+1}. ${ch.n}`,img:ch.img,body:`<p>${ch.beats.map(b=>b[3]).join(' ')}</p>${nx&&!ch.side&&chStarted(CH.indexOf(nx))?`<p class="m">${nx.d}</p>`:''}<p class="stamp">✎ ${dateTxt(s.play)}</p>`});eraCheck()}})}
function checks(){const F=s.f;tutTick();mgHelpCheck();
  if(!F.lk&&s.tot.ember>=10){F.lk=1;dirty=1}
  if(!F.wreck&&s.c.gather>=18&&s.b.hearth&&novCan()){novMark();F.wreck=1;dlg({k:'world',title:'Уламки в прибої',img:{t:'ob',k:'wreck3',f:'wreckObj3'},body:'<p>Збираючи плавник, ти забрідаєш далі вздовж берега — і натрапляєш на щось більше за гілляку. Між каменями застряг розбитий рибальський човен: ребра шпангоутів, дошки обшивки, іржаві цвяхи.</p><p>Хвилі приносять його по шматку. Добре залізо тут на вагу золота.</p>',gains:['Відкрилося: розбирати уламки']});tutOffer('wreck')}
  if(!F.barrel&&s.tot.scrap>=5){F.barrel=1;add('oil',8);say(`Серед уламків застрягла розбита бочка. На дні ще хлюпає ${R('oil',8)}.`,'find')}
  if(!s.tabs.tower&&s.tot.ember>=105&&s.b.hearth&&novCan()){unlock('tower');say('Вогонь розгорівся. Тепер видно сходи, що ведуть угору. Відкрито: Маяк.','story')}
  if(!F.quick&&s.c.wins>=5){F.quick=1;say('Ти набрався бойового досвіду. Відтепер сутички з уже знайомими ворогами можна вирішувати швидким боєм.','lvl')}
  storyCheck(false);
  if(F.people){const cap=2*(s.b.house||0);
    if((s.pop||0)<cap&&s.r.prov>=5){if(!s.popT)s.popT=Date.now()+60000/(1+0.1*st('speech'))*(fac('rot')>=80?0.7:1);else if(Date.now()>=s.popT){s.popT=0;s.pop=(s.pop||0)+1;s.r.prov-=5;
      const who=settlerWho((s.pop-1)%7);
      say(`До маяка прийшов поселенець: ${who}. Він з’їв ${R('prov',5)} і питає, де працювати.`,'world');
      if(s.pop===1)dlg({k:'world',title:'Перший поселенець',img:{t:'yard'},body:`<p>До маяка прийшов ${who}. Каже, що бачив, як тут горить вогонь, і що біля вогню не так страшно.</p>`,gains:['До маяка прийшла людина']});if(s.pop===1)tutOffer('people')}}
    else s.popT=0}
  if(!s.disc.heart&&has('mlens')&&has('gkey')){reveal('heart');dlg({k:'story',title:'Острів, якого немає',img:{t:'face',id:'marta'},body:`<p>Крізь Лінзу Мли видно те, чого не видно оком: на півночі з води б’є стовп туману. ${P('Марта')}: ${Q('Ось воно. Ключ вартових відімкне шлях. Пливімо')}.</p>`})}
  if(s.tabs.hero&&!s.h.bg&&(s.nv||{}).grow)offerBg();
  // Спершу сюжетно потрібні відкриття, далі знайомство з системами.
  novTick(true);shoreTick();shfTick();beamTick();folkTick();wolfTick();kitTick();rsiegeTick();curTick();stage3Tick();
  novPlanTick(true);novTick(false);novPlanTick(false);
  if(!s.tabs.chron&&s.chs.length&&!s.cb&&!(s.dlg||[]).some(d=>d.chap)&&novCan())unlock('chron');
  if(F.crabWarn&&!F.crab1&&!s.cb&&!(s.dlg||[]).some(d=>d.crabw))crabWarn();
  raidCheck();tutTick();
}


/* хто приходить до маяка — без назв місць і людей, яких гравець ще не знає (#39) */
function settlerWho(k){const S=KN('silent')||KN('gnat')||!!s.seenE.scout;return[
  KN('village')?'рибалка з Гнилого Причалу':'рибалка із селища за протокою',
  KN('cliffs')?'вдова з хутора за скелями':'вдова з далекого хутора',
  KN('chaika')?'юнга з розбитої «Чайки»':'юнга з розбитого корабля',
  S?'бондар, що втік від Мовчунів':'бондар, що від когось утік і не каже, від кого',
  'двоє братів-сітярів','стара пряля',
  KN('gnat')?'колишній вартовий Гната, що каже, що покаявся':'похмурий чолов’яга, що каже, що покаявся'][k]}
/* назва розділу — лише коли гравець уже знає, про що він (#39) */
const chName=c=>c.nk&&!c.nk()?c.n0:c.n;
