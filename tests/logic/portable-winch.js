require('../harness.js')(String.raw`
let fails=0;
const A=(condition,message)=>{if(!condition){fails++;console.log('FAIL',message)}};
const near=(a,b)=>Math.abs(a-b)<1e-8;
let raw;
localStorage.getItem=()=>raw;
localStorage.setItem=(key,json)=>{raw=json};
const importSave=(d,seconds=0)=>{d.ts=Date.now()-seconds*1000;raw=JSON.stringify(d);load()};
const oldSave=(p,w,q,k)=>{
  const d=fresh();delete d.winchMigrationV;delete d.portableWinch;delete d.potTransfer;
  d.b={pot:p,winch:w};d.wk={pot:q,winch:k};d.pop=q+k+3;
  d.exp=[{crew:1,until:Date.now()+300000}];d.rs={metal:1,mech:1};d.rdp={optics:89};
  return d;
};
const pot=BD.find(b=>b.id==='pot'),recipe=RC.find(r=>r.id==='winchRestore');
A(!BD.some(b=>b.id==='winch')&&!WKB.includes('winch')&&!DMGB.includes('winch'),'старого виробництва немає в реєстрах');
A(LOC.mine.spots.find(p=>p.id==='gate').acts.some(a=>a.id==='winch'&&a.chk[1]===4)&&RS.find(r=>r.id==='optics').r.includes('mech'),
  'Механізми й стаціонарна лебідка копальні доступні за чинними умовами');
for(const [p,w,q,k] of [[0,0,0,0],[3,0,1,0],[0,1,0,1],[1,1,1,1],[2,2,2,2],[5,5,4,3],[5,8,3,7],[18,27,16,22]]){
  const d=oldSave(p,w,q,k);
  d.dmgB.boom=1;d.on.winch=false;d.reserveFree.winch=1;d.bdSeen={winch:1};
  d.dlg=[{title:'Креслення: Лебідка на уламках'},{title:'Інша подія'}];
  importSave(d);
  A(s.b.pot===p+2*w&&s.wk.pot===q+k&&freeW()===2&&s.exp.length===1&&s.pop===d.pop,'рівні, робітники та експедиція '+p+'/'+w);
  A(!!s.portableWinch.restored===!!w&&s.potTransfer.legacyCrew===k&&s.potTransfer.grantedLevels===2*w,'компенсація '+p+'/'+w);
  A(s.dmgB.boom&&s.rs.mech&&s.rdp.optics===89&&s.dlg.length===1&&!('winch' in s.b)&&!s.wk.winch&&!s.bdSeen.winch&&!s.reserveFree.winch&&!('winch' in s.on),
    'старі ключі видалено, решта прогресу збережена');
  A(bCost(pot).wood===Math.ceil(14*1.5**p)&&(!w||pot.show()),'ціна за купленими рівнями та видимість без креслення');
  for(const f of [0.5,0.75,1]){
    s.r.prov=0.02*people()*(2*f-1);
    A(near(flow(1,true).scrap,.15*(p+.5*q*f)+.3*(w+.5*k*f)),'точний потік для ситості '+f+' · '+p+'/'+w);
  }
  const converted=JSON.parse(raw);load();importSave(converted);
  A(s.b.pot===p+2*w&&s.wk.pot===q+k&&s.winchMigrationV===1&&!!s.portableWinch.restored===!!w,'reload та імпорт без повторної компенсації');
  A(s.log.filter(l=>l.m.includes('перебрала пастка')).length===(w?1:0),'один запис у журналі');
}
const minimal=fresh();delete minimal.winchMigrationV;importSave(minimal);
A(!s.b.pot&&!s.portableWinch.restored&&!pot.show(),'порожній старий файл не відкриває пастку чи механізм');
const inconsistent=fresh();inconsistent.b.pot=3;inconsistent.wk.pot=2;
inconsistent.potTransfer={grantedLevels:99,legacyCrew:89,inheritedDamage:null};
inconsistent.portableWinch={restored:1,mountedAt:'unknown:hook'};inconsistent.r.wood=88;
importSave(inconsistent);
A(s.potTransfer.grantedLevels===2&&s.potTransfer.legacyCrew===1&&s.portableWinch.restored&&!s.portableWinch.mountedAt
  &&s.r.wood===88,'неправильні метадані не скидають збереження');
s=fresh();s.f.wreck=1;s.rs.mech=1;
act('bld','winch');A(!s.b.winch&&!s.portableWinch.restored,'дослідження не створює механізм');
importSave(oldSave(1,1,1,1));
act('wk-','pot');A(s.potTransfer.legacyCrew===1&&s.wk.pot===1,'спершу знімається звичайний працівник');
act('wk-','pot');act('wk+','pot');
A(s.potTransfer.legacyCrew===0&&s.wk.pot===1&&near(potRate(1),.525),'повторне призначення не повертає бонус');
s.r.wood=21;act('bld','pot');
A(s.b.pot===4&&s.r.wood===0&&bCost(pot).wood===32,'покупка підвищує оплачений рівень');
for(const [damaged,rate] of [[{},1.35],[{pot:1},.9],[{winch:1},.45],[{pot:1,winch:1},0]]){
  const d=oldSave(2,2,2,2);d.dmgB=damaged;
  importSave(d);
  A(near(potRate(1),rate)&&!s.dmgB.pot,'окремий простій після міграції '+JSON.stringify(damaged));
}
A(potPartRepairCost('pot').wood===11&&potPartRepairCost('winch').wood===23&&potPartRepairCost('winch').scrap===17,'початкові ціни частин');
s.h.k.craft=3;
A(potPartRepairCost('pot').wood===9&&potPartRepairCost('winch').wood===20&&potPartRepairCost('winch').scrap===15,'знижка ремесла на момент ремонту');
s.r.wood=9;act('repairPotPart','pot');
A(near(potRate(1),.45)&&!s.potTransfer.inheritedDamage.pot&&s.potTransfer.inheritedDamage.winch===2,'ремонт однієї частини відновлює тільки її');
act('repairPotPart','pot');act('repairPotPart','winch');A(s.r.wood===0&&near(potRate(1),.45),'повторний і неоплачений ремонти не діють');
s.r.wood=20;s.r.scrap=15;act('repairPotPart','winch');
A(near(potRate(1),1.35)&&s.r.wood===0&&s.r.scrap===0&&!Object.keys(s.potTransfer.inheritedDamage).length,'другий ремонт завершує перехід');

const onlyPot=oldSave(3,0,1,0);onlyPot.dmgB.pot=1;importSave(onlyPot);
A(s.dmgB.pot&&repCost(pot).wood===16&&!s.portableWinch.restored&&!potPartRepairCost('pot'),
  'старе пошкодження звичайної пастки зберігається без компенсації лебідки');

const raidSave=oldSave(2,2,2,2);raidSave.dmgB={pot:1,winch:1};importSave(raidSave);
Math.random=()=>0;A(dmgRandom()===pot.n&&s.dmgB.pot&&potRate(1)===0,'новий набіг зупиняє обидві частини однією поломкою');
A(repCost(pot).wood===34&&repCost(pot).scrap===17,'максимум звичайної ціни та суми успадкованих ремонтів');
s.r.wood=34;s.r.scrap=17;act('repairPotPart','winch');
A(s.r.wood===34,'за суцільної поломки діє лише спільний ремонт');act('repair','pot');
A(!s.dmgB.pot&&!Object.keys(s.potTransfer.inheritedDamage).length&&near(potRate(1),1.35)&&s.r.wood===0&&s.r.scrap===0,
  'одна оплата ремонтує обидві частини без заборгованості');
dmgRandom();A(repCost(pot).wood===11&&!repCost(pot).scrap,'наступний звичайний ремонт за оплаченим рівнем');
importSave(oldSave(0,5,0,2));dmgRandom();A(repCost(pot).wood===7,'ремонт пастки без покупок має мінімум першого рівня');
const grown=oldSave(1,1,1,1);grown.dmgB={pot:1};importSave(grown);
s.r.wood=1000;for(let i=0;i<3;i++)act('bld','pot');dmgRandom();
A(repCost(pot).wood===24,'звичайний ремонт може перевищувати успадкований борг');

for(const seconds of [0,3,60,8000]){
  for(const [damage,rate] of [[{},1.125],[{pot:1},.75],[{winch:1},.375]]){
    const d=oldSave(2,2,2,2);d.r.scrap=6;d.dmgB=damage;
    const elapsed=seconds>5?Math.min(seconds+.01,7200):0;
    importSave(d,seconds);
    A(Math.abs(s.r.scrap-(6+elapsed*rate))<.03,'міграція до офлайн-виробництва '+seconds+' с');
    A(JSON.parse(raw).winchMigrationV===1&&JSON.parse(raw).b.pot===6,'версія одразу записана');
  }
}
for(const offline of [false,true]){
  for(const enabled of [false,true]){
    const d=oldSave(2,2,2,2);d.r.scrap=6;d.r.ember=120000;d.r.prov=80000;
    d.b.forge=2;d.wk.forge=2;d.mst.kindrat=1;d.on.forge=enabled;
    importSave(d,offline?7200:0);
    if(!offline)for(let i=0;i<120;i++)produce(5);
    const t=offline?7200:600;
    A(near(s.r.scrap,6+(enabled?0:1.35*t))&&near(s.r.iron,enabled?.675*t:0),'Кіндрат, резерв і перемикач кузні · '+offline+'/'+enabled);
  }
}

const shoreSave=()=>{
  s=fresh();s.tab='shore';s.tabs.shore=1;s.c.scrap=25;s.f.gullrack=1;s.f.deckSeen=1;
  s.tabs.work=1;s.floors.work=1;
};
const action=id=>localAct('deck:'+id);
const rescueFromShore=()=>{s.shf='zinovii';act('shfgo','zinovii');while(s.dlg.length)act('dlgok')};
for(const rescueFirst of [false,true]){
  shoreSave();
  if(rescueFirst)rescueFromShore();
  act('zoneEnter','deck');
  A(!action('install')&&!action('pull')&&!action('detach'),'дії механізму приховані до оглядів і відновлення');
  action('winch');action('winchTaken');
  act('winchTalk');A(!s.dlg.length,'із палуби діалогу немає');
  act('zoneBack','deck');if(!rescueFirst)rescueFromShore();
  act('tab','home');A(rHome().includes('data-a="winchTalk"')&&!s.tabs.kitchen,'тема в картці Зиновія до кухні');
  s.dlg=[{k:'world',title:'Інший діалог'}];act('winchTalk');A(s.dlg.length===1&&!s.dlg[0].winchTalk,'діалог не підміняє відкритої події');
  act('dlgok');act('winchTalk');act('winchTalk');load();
  A(s.dlg.length===1&&s.dlg[0].winchTalk&&!s.portableWinch.discussed&&!rcVisible(recipe),'тема переживає reload до підтвердження');
  act('dlgok');load();
  A(s.portableWinch.discussed&&rcVisible(recipe)&&!rHome().includes('data-a="winchTalk"')&&!s.rs.mech,'порада відкриває рецепт без пізнього дослідження');
  s.r.wood=50;s.r.scrap=40;act('craft','winchRestore');
  A(!s.portableWinch.restored,'поза майстернею рецепт не діє');
  act('tab','work');s.floors.work=0;act('craft','winchRestore');
  A(!s.portableWinch.restored,'закрита майстерня не дозволяє відновлення');
  s.floors.work=1;s.h.ft.smith=rescueFirst;s.fu.work=rescueFirst?1:0;
  const cos=rcCost(recipe);
  A(cos.wood===(rescueFirst?21:32)&&cos.scrap===(rescueFirst?12:18),'ціна та чинні знижки');
  s.r.scrap=cos.scrap-1;act('craft','winchRestore');
  A(!s.portableWinch.restored&&s.r.wood===50,'бракує брухту, часткової оплати немає');
  s.r.scrap=40;act('craft','winchRestore');act('craft','winchRestore');load();
  A(s.portableWinch.restored&&s.r.wood===50-cos.wood&&s.r.scrap===40-cos.scrap&&!rcVisible(recipe),'відновлення одноразове й переживає reload');
  act('tab','shore');act('zoneEnter','deck');action('mount');
  A(!action('install'),'потрібно оглянути й саму перешкоду');
  action('hatch');A(action('install')&&!action('install')&&s.portableWinch.mountedAt==='deck:mount','монтаж одноразовий до демонтажу');
  load();act('zoneBack','deck');A(!action('pull')&&s.portableWinch.mountedAt===DECK_MOUNT,'вихід не знімає механізм; дія лише на палубі');
  act('zoneEnter','deck');A(action('detach')&&action('install'),'можна зняти й установити знову');
  const inv=JSON.stringify(s.inv);
  A(action('pull')&&!action('pull')&&!action('install')&&s.localProgress.deck.beamMoved&&s.portableWinch.mountedAt===null&&s.portableWinch.restored,
    'результат підтягування повертає той самий механізм');
  A(JSON.parse(raw).localProgress.deck.beamMoved&&!JSON.parse(raw).portableWinch.mountedAt&&deckHaulAt,'балка й повернення вже записані на старті анімації');
  load();A(!deckHaulAt&&s.localProgress.deck.beamMoved&&JSON.stringify(s.inv)===inv&&!s.f.rats&&!localEntries().length,
    'reload відновлює кінцеву сцену без повторної анімації, винагород чи входу нижче');
  A(!rLocalZone().includes('важка балка')&&rLocalZone().includes('люк і досі зачинений'),'опис відповідає кінцевій сцені');
  act('zoneBack','deck');s.shf='rats';act('shfgo','rats');save();load();
  A(s.cb?.win==='S:rats'&&!s.f.rats,'старий активний бій лишається доступним і зберігається');
}
const alreadyWon=oldSave(0,1,0,0);
alreadyWon.f={rats:1,zinovii:1,tracks:1,deckSeen:1};alreadyWon.tabs.shore=1;alreadyWon.tab='shore';
alreadyWon.ratsT=123;alreadyWon.odd={logpage:1};alreadyWon.localProgress.deck={winch:1};
importSave(alreadyWon);
act('zoneEnter','deck');
A(s.f.rats&&s.f.tracks&&s.ratsT===123&&s.odd.logpage&&!shfReady('rats')&&!rcVisible(recipe)&&!action('winchTaken'),'стару перемогу й механізм не дублюємо');
action('hatch');action('mount');A(action('install')&&action('pull'),'мігрований механізм готовий до використання без покупки');
console.log('fails',fails);
`);
