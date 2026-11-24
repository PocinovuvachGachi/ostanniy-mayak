require('../harness.js')(`
FOEST.fill(1);ENC.heart.mult=1.4;ENC.gnat.mult=.92;/* проходження перевіряє сюжетний перебіг, не баланс */
const rsNow=r=>{act('rs',r);if(s.rd===r)rsDone(r)};let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
function T(n){for(let i=0;i<n;i++){produce(1);checks()}}
function allTabs(){const t0=s.tab;for(const t in s.tabs){s.tab=t;render()}s.tab=t0;render()}
function clickN(a,i,n){for(let k=0;k<n;k++){s.cd={};act(a,i);checks()}}
T(11);act('look');A(s.tabs.shore,'shore');
clickN('gather','',11);act('bld','hearth');A(s.b.hearth===1,'hearth');
clickN('gather','',10);A(s.pages.includes(1),'bottle');A(s.f.wreck,'wreck');
s.r.wood+=20;act('bld','pot');A(s.b.pot===1,'pot');
clickN('scrapw','',6);A(s.f.barrel,'barrel');
T(60);A(s.tabs.tower,'tower tab');A(s.r.wood>=0,'wood nonneg');allTabs();
s.r.wood+=100;s.r.scrap+=30;s.r.ember+=200;act('floor','work');A(s.floors.work,'work');
act('craft','rod');A(s.f.rod,'rod');act('craft','oar');A(s.eq.weapon==='oar','oar eq');
clickN('fishing','',5);act('fightGo','crab1');A(s.cb,'crab fight');botFight();A(!s.cb&&s.tabs.hero,'hero');console.log('after crab lvl',s.h.lvl,'hp',Math.round(s.h.hp));
s.r.wood+=100;s.r.scrap+=60;act('bld','forge');act('bld','smoke');A(s.b.forge&&s.b.smoke,'conv built');s.r.fish+=10;const e0=s.r.ember,i0=s.r.iron;T(10);A(s.r.iron>i0,'iron made');A(s.r.prov>0,'prov made');act('tog','forge');const i1=s.r.iron;T(5);A(s.r.iron===i1,'forge off');act('tog','forge');act('ht','bag');render();act('ht','grow');render();act('ht','gear');render();act('craft','sling');A(s.eq.ranged==='sling','sling');allTabs();
s.f.horpyna=1;s.r.wood+=260;s.r.scrap+=130;s.r.ember+=1000;act('floor','gallery');A(s.floors.gallery,'gallery');
s.dbgTide='low';s.r.fish+=40;s.r.oil+=20;s.r.wood+=200;s.r.scrap+=100;s.r.ember+=500;for(const p of['poles','steps','rope'])act('ford',p);A(!s.f.fordDone,'ford waits for the siege');s.f.siege1=1;act('ford','lamp');delete s.f.siege1;A(s.f.fordDone&&s.tabs.map,'ford opens the map');s.dbgTide='';s.dlg=[];
s.r.ember+=500;act('scan');act('scan');act('scan');A(s.disc.chaika&&s.disc.village&&s.disc.cliffs,'scans');
act('craft','lamp');A(s.eq.light==='lamp','lamp');
s.h.a.str=4;act('go','chaika');A(s.at==='chaika','at chaika');allTabs();
act('la','chaika.cabin.force');act('la','chaika.cabin.search');A(s.pages.includes(2),'page2');
s.h.hp=maxHP();act('la','chaika.hold.down');A(s.cb,'hold fight');botFight();A(s.f.bpHarpoon,'harpoon bp');
s.r.iron+=10;s.h.k.craft=1;act('craft','harpoon');A(has('harpoon'),'harpoon');act('leave');
act('go','village');act('la','village.tavern.talk');act('la','village.pier.talk');s.r.oil+=6;act('la','village.q_lamps.give');A(fac('rot')>=18,'довіра Причалу '+fac('rot'));s.fac.rot=20;['hut.talk','shop.talk','boy.talk'].forEach(x=>act('la','village.'+x));render();
A(s.tabs.trade&&s.disc.bay&&s.disc.cliffs,'village meets');
els['rd-village-tavern-riddle']={value:'вода'};act('riddle','village.tavern.riddle');A(s.wrong['village.tavern.riddle']===1,'wrong');render();
els['rd-village-tavern-riddle']={value:'Сіль'};act('riddle','village.tavern.riddle');A(!s.disc.cave,'печера — лише після трав Ганни');
els['rd-village-boy-riddle']={value:'Обіцянку'};act('riddle','village.boy.riddle');A(s.f.riddle1,'riddle1');
act('leave');act('go','cliffs');render();for(let i=0;i<6;i++){s.cd={};act('la','cliffs.slope.herb')}
act('stonesTry');act('stonesTry');render();act('stone',0);act('stone',0);act('stone',1);act('stone',2);act('stone',2);act('stone',2);A(s.stones.join()==='2,2,2','stones set '+s.stones);act('stonesTry');A(s.f.stones,'stones');
s.h.a.per=4;act('la','cliffs.gorge.stash');A(shards()===1,'shard1');
s.h.hp=maxHP();act('la','cliffs.nests.fight');botFight();
act('leave');act('go','village');act('la','village.hut.give');A(!has('key')&&s.pages.includes(5),'трави — не ключ');s.r.coin+=10;act('la','village.tavern.pay');A(s.disc.cave,'cave after herbs');
s.fac.rot=80;s.f.rsiege=1;act('la','village.hut.key');A(has('key'),'key');
s.r.iron+=20;s.r.wood+=200;s.r.scrap+=100;s.r.ember+=1500;act('floor','study');A(s.floors.study,'study');T(5);allTabs();
for(let k=0;k<3;k++)act('chestTry');render();
for(let k=0;k<3;k++)act('dial',0);act('dial',1);act('chestTry');A(s.f.chest&&s.f.bpCrossbow,'chest');
s.r.lore+=500;['currents','herbal','render','metal','order','tactics','mech'].forEach(rsNow);A(s.rs.mech,'research');act('rs','beacon');A(!s.rd,'маякова справа — лише з Остапом');
s.h.k.craft=3;s.r.scrap+=100;s.r.ember+=500;s.r.wood+=50;s.r.iron+=60;s.r.tar+=20;act('craft','cleaver');act('equip','cleaver');act('craft','crossbow');act('equip','crossbow');
s.h.a.con=5;s.h.hp=maxHP();act('go','bay');render();
act('la','bay.deep.eel');botFight();A(s.f.eel,'eel');
s.cd={};s.dbgTide='low';const tide=lowTide();act('la','bay.chest.pull');A(!!s.f.bayChest===tide,'tide chest');
act('leave');act('go','village');act('la','village.pier.report');s.h.k.speech=3;act('la','village.pier.boat2');A(s.f.boat&&s.disc.reef,'boat');
act('leave');act('go','cave');act('la','cave.gate.fight');s.h.hp=maxHP();botFight();A(s.f.caveIn,'caveIn');
act('la','cave.store.loot');s.h.k.mech=3;act('la','cave.store.chest');s.h.hp=maxHP();act('la','cave.depth.brute');botFight();A(s.f.pass&&s.disc.fort&&shards()===2,'brute');
s.h.hp=maxHP();act('la','cave.lake.wraith');botFight();allTabs();
console.log('wins',s.c.wins,'quick',s.f.quick);
act('leave');act('go','cliffs');render();s.cd={};s.h.hp=maxHP();checks();A(quickOk('gulls'),'quickOk gulls');act('qf','cliffs.nests.fight');
act('leave');act('go','village');act('la','village.shop.crate');A(s.f.crateDone,'crate');act('tab','trade');render();act('buy','tales');
act('leave');s.r.prov=0;A(!canGo('reef')[0],'need prov');s.r.prov+=10;act('go','reef');A(s.r.prov===8,'prov spent');act('bell',2);act('bell',2);render();[0,1,0,1].forEach(b=>act('bell',b));A(s.f.crypt,'crypt');act('la','reef.crypt.wick');A(has('wick'),'wick');
els['rd-reef-grave-riddle']={value:'луна'};act('riddle','reef.grave.riddle');A(s.f.riddle2&&has('shell'),'riddle2');
act('leave');const tdb=s.dbgTide;s.dbgTide='low';act('go','fort');s.dbgTide=tdb;act('la','fort.pier.pass');s.h.hp=maxHP();act('la','fort.yard.fight');A(s.cb,'бій у дворі '+JSON.stringify([s.f.fortIn,s.at,canGo('fort')]));if(s.cb)for(const u of s.cb.u)if(!EN[u.t].ally&&!EN[u.t].obj)u.hp=1;botFight();A(s.f.yard,'yard');
act('la','fort.prison.key');A(s.f.ostap,'ostap');s.r.lore+=300;['optics','beacon'].forEach(rsNow);A(s.rs.beacon,'оптика й маякова справа');act('unequip','ranged');act('packRem','harpoon');act('packRem','crossbow');giveI('mail');act('equip','mail');giveI('potion',6);s.belt=['potion','bandage'];s.h.a.con=10;s.h.hp=maxHP();act('la','fort.tower.fight');A(s.cb&&s.cb.boss,'boss');botFight(800);A(s.f.gnat&&shards()===3,'gnat');act('la','fort.tower.fire');
act('leave');s.r.ember+=2000;act('signal');A(s.sig===1,'signal');giveI('knife');act('tab','work');render();act('dism','knife');A(!has('knife'),'dism');act('craft','lens');A(has('lens'),'lens');
s.r.wood+=500;s.r.scrap+=300;s.r.oil+=200;s.r.ember+=7000;s.r.iron+=60;s.r.tar+=30;act('floor','lantern');A(s.floors.lantern,'lantern');render();
act('mirror','D');act('mirror','A');act('mirror','B');A(!s.f.won,'not yet');act('mirror','C');A(s.f.won,'WON');
T(3);allTabs();act('tab','journal');for(const j of ['goals','story','pages','chars','foes','odd','log']){act('jt',j);render()}

// ===== ACT 1 extras =====
act('leave');act('go','village');act('la','village.hut.olesya');A(s.disc.warehouse,'warehouse');
act('leave');act('go','warehouse');render();s.h.hp=maxHP();act('la','warehouse.yard.fight');botFight();A(s.f.whIn,'whIn');
s.h.hp=maxHP();act('la','warehouse.hall.fight');botFight();A(s.f.whHall,'whHall');
act('la','warehouse.cell.free');A(s.mst.olesya&&s.f.people&&s.disc.bog,'olesya');act('la','warehouse.crates.loot');render();
act('leave');act('tab','home');render();
s.r.wood+=300;s.r.tar+=30;act('bld','house');act('bld','house');A(s.b.house===2,'houses');s.r.prov+=50;
for(let i=0;i<70;i++){produce(1);checks();s.popT=s.popT?Math.min(s.popT,Date.now()):0}
A(s.pop>=1,'settler arrived '+s.pop);
act('bld','garden');act('bld','apoth');A(s.b.garden&&s.b.apoth,'olesya blds');
act('wk+','boom');act('wk+','forge');console.log('pop',s.pop,'wk',JSON.stringify(s.wk),'free',freeW());render();
s.r.herb+=20;s.r.oil+=20;const m0=s.r.med;T(20);A(s.r.med>m0,'med made');
s.h.hp=10;act('olheal');A(s.h.hp===maxHP(),'olheal');
act('go','bog');render();s.cd={};act('la','bog.edge.peat');A(s.r.coal>=1,'peat');
act('bogstep',0);A(s.bog===1,'bog1');act('bogstep',0);A(s.bog===0&&s.bogFail===1,'bog fall');
act('bogstep',0);act('bogstep',2);act('bogstep',1);A(s.f.bogPath,'bogPath');render();
s.h.hp=maxHP();act('la','bog.hut.fight');botFight();A(s.f.bogClear,'bogClear');act('la','bog.hut.free');A(s.mst.ustyna,'ustyna');
act('leave');act('go','village');act('la','village.pier.shoal');act('la','village.shop.spit');A(s.disc.shoal&&s.disc.spit,'shoal spit disc');
act('leave');
// weapon forms
s.r.iron+=50;s.r.ember+=1000;s.wm.oar=140;s.wm.cleaver=140;act('wup','oar');A(wF('oar')===1,'oar form1');act('wup','oar');A(wF('oar')===1,'oar form2 needs smith');s.r.steel+=6;s.r.coal+=6;act('wup','oar');A(wF('oar')===1,'still needs smith');
act('tab','work');render();act('tab','hero');act('ht','arms');render();act('ht','gear');render();
// shoal: force low tide by trying both
act('go','shoal');render();s.h.hp=maxHP();act('equip','oar');
if(lowTide()){act('la','shoal.king.fight');A(s.cb,'crabking fight');botFight(600);A(s.f.crabking,'crabking')}else{console.log('(high tide, crab skipped)');s.f.crabking=1}
act('leave');s.r.prov+=20;act('go','spit');s.cd={};act('la','spit.sand.dig');A(s.r.sand>=2,'sand');s.h.hp=maxHP();act('equip','harpoon');act('la','spit.shallows.fight');botFight(600);A(s.f.spitIn,'spitIn');act('la','spit.hut.free');A(s.mst.severyn,'severyn');
act('leave');act('go','fort');act('la','fort.tower.notes');A(s.disc.mine,'mine disc');act('leave');act('go','mine');s.h.a.str=6;act('la','mine.gate.rubble');A(s.f.mineIn,'mineIn');s.h.hp=maxHP();act('equip','cleaver');act('la','mine.shaft.fight');botFight(600);A(s.f.mineGuard,'mineGuard');
act('la','mine.forge.free');A(s.mst.kindrat,'kindrat');act('leave');
s.r.iron+=100;s.r.scrap+=100;s.r.coal+=100;s.r.wood+=200;s.r.sand+=50;act('bld','coalpit');act('bld','steel');act('bld','sandpit');act('bld','glass');A(s.b.coalpit&&s.b.steel&&s.b.sandpit&&s.b.glass,'new blds');
const st0=s.r.steel,g0=s.r.gls;T(30);A(s.r.steel>st0&&s.r.gls>g0,'steel+glass made '+fr(s.r.steel)+' '+fr(s.r.gls));
giveI('r_oar2');if(!has('r_cleaver1')&&!wF('cleaver'))giveI('r_cleaver1');giveI('r_cleaver2');s.r.steel+=20;s.r.coal+=20;act('wup','oar');A(wF('oar')===2&&wN('oar')==='Лопата хранителя','oar form2');act('wup','cleaver');act('wup','cleaver');A(wF('cleaver')===2,'cleaver2');
s.r.gls+=10;s.h.k.craft=3;act('craft','spyglass');act('craft','steelmail');act('craft','elixir');A(has('spyglass')&&has('steelmail')&&has('elixir'),'new recipes');
s.r.med+=10;act('go','village');act('la','village.hut.meds');A(s.f.medDone,'meds');act('leave');
s.r.lore+=500;['a_crab','a_silent','a_fog','a_shark','weak'].forEach(rsNow);
allTabs();
// ===== ACT 2 =====
act('go','village');act('la','village.harbor.talk');A(s.met.marta&&s.disc.shipisle,'marta');act('leave');
act('go','shipisle');s.h.hp=maxHP();act('equip','sabre');act('la','shipisle.shore.fight');botFight(600);A(s.f.isleIn,'isleIn');act('la','shipisle.yard.free');A(s.mst.zakhar,'zakhar');act('leave');
s.r.wood+=600;s.r.tar+=100;s.r.iron+=100;s.r.steel+=30;s.r.gls+=10;act('bld','shipyard');act('bld','shipyard');A(s.b.shipyard===1,'shipyard max1');render();
act('schooner');A(s.f.schooner&&s.disc.monastery&&s.disc.guardians,'schooner');s.r.prov=3;A(!canGo('monastery')[0],'sea2 prov');s.r.prov+=40;
act('go','monastery');A(s.at==='monastery','at monastery');els['rd-monastery-gate-riddle']={value:'двері'};act('riddle','monastery.gate.riddle');render();
els['rd-monastery-gate-riddle']={value:'Вітер'};act('riddle','monastery.gate.riddle');A(s.f.monGate,'monGate');
s.h.hp=maxHP();act('la','monastery.nave.fight');botFight(800);A(has('mlens'),'mlens');act('leave');
act('go','guardians');s.h.hp=maxHP();act('equip','cleaver');for(let k=0;k<3&&!s.f.gIn;k++){s.h.hp=maxHP();act('la','guardians.steps.fight');botFight(800)}A(s.f.gIn,'gIn');act('la','guardians.altar.take');A(has('gkey'),'gkey');act('leave');
checks();A(s.disc.heart,'heart disc');
act('go','heart');s.h.hp=maxHP();act('equip','sabre');s.belt=['potion','elixir'];giveI('potion',6);act('la','heart.core.fight');A(s.cb&&s.cb.boss,'heart boss');botFight(1500);for(let k=0;k<3&&!s.f.won2;k++){s.dlg=[];s.h.hp=maxHP();giveI('potion',6);act('la','heart.core.fight');botFight(1500)}A(s.f.won2,'WON2');
act('leave');act('go','village');act('la','village.harbor.bye');act('leave');
T(5);allTabs();act('tab','journal');for(const j of ['goals','story','pages','chars','foes','odd','log']){act('jt',j);render()}
console.log('dlgs',s.dlg.length,s.dlg.slice(0,40).map(d=>d.title).join(' | '));

let gq=0;while(s.dlg.length&&gq++<300)act('dlgok');checks();console.log('dlg after',s.dlg.map(d=>d.title).join('/'));console.log('RELICS',Object.keys(s.rel||{}).join(','),'inv',Object.keys(s.inv).filter(k=>k.startsWith('r_')).join(','));console.log('bdSeen',Object.keys(s.bdSeen||{}).length,BD.length);console.log('CHRON tab',!!s.tabs.chron,'play',Math.round(s.play),'day',dayOf(s.play),dateTxt(s.play),'eraT',JSON.stringify(s.eraT));
console.log('moments',s.mom.length,JSON.stringify(s.mom.reduce((a,m)=>(a[m.k]=(a[m.k]||0)+1,a),{})));
s.tab='chron';const H=rChron();console.log('rChron len',H.length,(H.match(/chr-c /g)||[]).length);
console.log(s.mom.filter(m=>m.mj).map(m=>m.e+':'+dayOf(m.t)+':'+m.n).join(' | '));
// backfill test
const keep=s.mom;s.mom=null;chronBackfill();console.log('backfill',s.mom.length,JSON.stringify(s.eraT));s.mom=keep;
console.log('recipe dlgs',s.dlg.filter(d=>/рецепт/i.test(d.title)).map(d=>d.title).join(' | '));
console.log('chapters',s.chs.length,'/',CH.length,'odd',Object.keys(s.odd).length,'/',Object.keys(OD).length,'lvl',s.h.lvl,'fails',fails);
`);
