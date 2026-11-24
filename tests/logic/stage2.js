/* Етап II, кроки 1–2: перший перехід, довіра словами, люди Причалу відкриваються довірою, прохання, Мирон і Горпина. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
const la=id=>{s.cd={};act('la',id)};const vis=id=>LOC.village.spots.find(S=>S.id===id).show();
s.f.looked=1;s.b.hearth=2;s.tabs.shore=1;s.tabs.map=1;s.f.horpyna=1;s.mst.horpyna=1;s.f.fordDone=1;reveal('village');s.dlg=[];
act('go','village');A(s.at==='village'&&s.dlg.some(d=>d.title==='Перший перехід'),'перший перехід — діалог');
A(/чужинцем/.test(LOC.village.d),'довіра словами: чужинець');
A(!vis('hut')&&!vis('shop')&&!vis('pier'),'спершу лише корчма');
la('village.tavern.talk');A(vis('pier')&&vis('boy')&&!vis('hut'),'Левко посилає до Мирона');
A(vis('q_lamps'),'перше прохання — каганці');s.r.oil=10;la('village.q_lamps.give');A(!vis('q_lamps')&&s.r.coin>=6,'каганці');
A(!vis('q_widow'),'наступне прохання — не одразу');__adv(4*60000);A(vis('q_widow'),'жінка на пірсі');
la('village.pier.talk');A(s.f.reunion&&s.disc.bay,'Мирон упізнає сестру й просить про вугра');
A(fac('rot')>=18,'довіра росте: '+fac('rot'));s.r.fish=30;la('village.q_widow.give');A(rotRank()>=3&&/гостем/.test(LOC.village.d),'гість');
A(vis('hut')&&vis('shop'),'гостю відчиняють Ганна й Ярема');la('village.shop.talk');A(s.tabs.trade,'торг від гостя');
A(!s.tabs.folk,'Громади — не з першою громадою');s.seenE.scout=1;folkTick();A(s.tabs.folk,'Громади — з другою громадою');
__adv(3*60000);A(vis('q_nets'),'сіті');const f0=s.r.fish;la('village.q_nets.pull');A(s.r.fish===f0+3,'тягнути сіті');la('village.q_nets.pull');A(vis('q_nets'),'сіті лишаються');
__adv(3*60000);s.r.wood=50;s.r.scrap=20;A(vis('q_roof'),'дах після шторму');la('village.q_roof.give');A(!vis('q_roof'),'дах полатано');
/* ключ — лише коли свій */
la('village.hut.talk');s.r.herb=9;la('village.hut.give');A(s.f.herbsDone&&!has('key'),'за трави — не ключ');
s.fac.rot=85;A(LOC.village.spots.find(S=>S.id==='hut').acts.find(a=>a.id==='key').show(),'ключ для свого');la('village.hut.key');A(has('key'),'ключ від кабінету');
/* Мирон у гостях */
s.at='';s.tab='shore';s.dbgTide='low';s.shf='';s.lastAct=Date.now();s.shfT={};for(const k of['seal','tracks','signal','gullrack','zinovii','rats','drown1','horpyna'])s.f[k]=1;s.f.crab1=0;s.sealCyc=tideCyc();
shfTick();A(s.shf==='myronvisit','Мирон іде бродом');act('shfgo');A(s.c.myron===1,'брат і сестра');
/* дрібні справи: з'являються періодично, до двох одразу */
s.at='village';s.lastAct=Date.now();s.vg=null;for(const k of RES)s.seen[k]=1;for(const k of RES)s.r[k]=Math.max(s.r[k],300);vgTick();A(s.vg.list.length===1,'перша справа');vgTick();A(s.vg.list.length===1,'не всі одразу');
__adv(11*60000);s.lastAct=Date.now();vgTick();A(s.vg.list.length===2,'друга справа згодом');let done=0;
for(let g=0;g<40&&done<6;g++){s.lastAct=Date.now();for(const k of[0,1]){const q=s.vg.list[k];if(!q)continue;const t0=fac('rot'),c0=s.c.vg||0;
  if(q.k==='give')la('village.g'+k+'.give');else if(q.k==='work'){for(let i=0;i<3;i++)la('village.g'+k+'.work')}else{s.h.hp=maxHP();la('village.g'+k+'.fight');if(s.cb){for(const u of s.cb.u)if(!EN[u.t].ally)u.hp=1;s.h.hp=500}botFight()}
  if((s.c.vg||0)>c0)done++;else A(0,'справа не виконалась: '+q.k+' '+q.n)}
  __adv(11*60000);s.lastAct=Date.now();vgTick()}
A(done>=6,'справи йдуть одна за одною: '+done);
/* острів Хибних Вогнів — після кабінету */
s.tabs.map=1;s.disc.fort=1;s.f.boat=1;A(!canGo('fort')[0],'острів — лише з картою рифів');s.floors.study=1;vgTick();A(s.f.reefmap&&canGo('fort')[0]!==false||/рифи/.test(canGo('fort')[1]||'')===false,'карта рифів у кабінеті');
/* крок 3: хибний вогонь, коза, рибалки в тумані */
s.disc.cliffs=1;s.dbgPh='n';la('cliffs.edge.look');A(s.f.falsefire,'хибний вогонь уночі');s.dbgPh='';
s.vq.t.roof=Date.now()-10*60000;A(vis('q_goat'),'коза втекла');la('village.q_goat.go');A(s.f.goatQ&&!vis('q_goat'),'шукати козу');
s.eq.weapon='oar';s.h.lvl=Math.max(s.h.lvl,5);s.h.hp=maxHP();la('cliffs.goat.fight');A(s.cb&&s.cb.enc==='goatwolf','бій із вовками');for(const u of s.cb.u)if(!EN[u.t].ally)u.hp=1;s.h.hp=500;botFight();A(s.f.goatDone,'коза вдома '+JSON.stringify([s.h.hp,s.h.lvl,!!s.cb,s.log.slice(0,3).map(x=>(x.m||x).toString().slice(0,80))]));
__adv(5*60000);A(vis('q_fog'),'човни в тумані');s.h.hp=maxHP();la('village.q_fog.fight');A(s.cb&&s.cb.u.filter(u=>u.t==='fisher').length===2,'рибалки поруч у бою');for(const u of s.cb.u)if(!EN[u.t].ally)u.hp=1;s.h.hp=500;botFight();A(s.vq.t.fog&&!vis('q_fog'),'рибалки вдома');
console.log('fails',fails)`);
