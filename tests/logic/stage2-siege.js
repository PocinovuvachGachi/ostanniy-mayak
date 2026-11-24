/* Етап II, кроки 5–7: облога Причалу, ключ лише після неї, Тиміш-посильний. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
const la=id=>{s.cd={};act('la',id)};const vis=id=>LOC.village.spots.find(S=>S.id===id).show();
s.f.looked=1;s.b.hearth=3;s.tabs.map=1;s.tabs.hero=1;s.h.on=1;s.eq.weapon='oar';s.h.lvl=7;s.h.hp=maxHP();s.f.siege1=1;s.met.levko=1;s.met.hanna=1;s.met.tymish=1;s.f.herbsDone=1;s.disc.village=1;
s.fac={rot:40};s.lastAct=Date.now();checks();A(!s.f.rsiegeOn,'гостю — ще ні');s.fac.rot=55;s.f.caveIn=1;s.lastAct=Date.now();checks();A(s.f.rsiegeOn&&vis('siege'),'Мла йде на Причал');
s.fac.rot=85;A(!LOC.village.spots.find(S=>S.id==='hut').acts.find(a=>a.id==='key').show(),'ключ — не до облоги');
act('go','village');s.h.hp=maxHP();la('village.siege.fight');const c=s.cb;A(c&&c.u.filter(u=>EN[u.t].struct).length===2&&c.u.filter(u=>u.t==='fisher').length===2,'хати й рибалки в бою');
A(c.u.some(u=>u.role==='wreck'),'утопленики йдуть ламати хати');for(const u of c.u)if(!EN[u.t].ally&&!EN[u.t].struct)u.hp=1;s.h.hp=500;botFight();
A(s.f.rsiege&&!vis('siege'),'Причал вистояв');A(LOC.village.spots.find(S=>S.id==='hut').acts.find(a=>a.id==='key').show(),'тепер ключ');
/* Тиміш-посильний */
s.lastAct=Date.now();curTick();A(s.f.curMet,'Тиміш пропонує носити');for(const k of RES)s.seen[k]=1;s.r.scrap=200;act('curt','scrap');const c0=s.r.coin;
__adv(5*60000);s.lastAct=Date.now();curTick();A(s.r.coin>c0&&s.r.scrap===170,'продав надлишок брухту: '+s.r.scrap);
s.r.scrap=55;__adv(5*60000);s.lastAct=Date.now();const c1=s.r.coin;curTick();A(s.r.scrap===55&&s.r.coin===c1,'запас не чіпає');
console.log('fails',fails)`);
