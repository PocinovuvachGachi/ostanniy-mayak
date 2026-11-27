require('../harness.js')(`
let fails=0;const A=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}};
let raw;localStorage.setItem=(k,v)=>{raw=v};localStorage.getItem=()=>raw;
s=fresh();s.tabs.shore=1;s.tab='shore';s.f.wreck=1;s.f.rod=1;s.c.scrap=11;
localZoneTick();A(!s.f.deckSeen&&!localEnter('deck'),'до порогу палуба недоступна');
s.c.scrap=12;s.dlg=[{title:'story'}];localZoneTick();A(!s.f.deckSeen,'сюжет має пріоритет');
s.dlg=[];localZoneTick();A(s.f.deckSeen&&localEntries().includes('deck'),'доступ після освоєння зовнішніх уламків');
MG={};act('zoneEnter','deck');A(!localCurrent(),'вхід чекає завершення відкритої мінігри');MG=null;
act('zoneEnter','deck');A(localCurrent()==='deck'&&!atShore()&&s.localProgress.deck.visited,'вхід у локальну зону');
const n=s.c.scrap;s.bite={kind:'fish',amount:2};act('scrapw');act('gather');act('bigfish');act('fishRelease');A(s.c.scrap===n&&!s.c.gather&&s.bite,'застарілі дії берега не працюють усередині');
act('zoneAct','unknown:planks');A(!s.localProgress.deck.planks,'чужий ID не діє');
act('zoneAct','deck:planks');A(s.localProgress.deck.planks&&rLocalZone().includes('шаром солі'),'огляд зберігається');
save();load();A(localCurrent()==='deck'&&s.localProgress.deck.planks,'reload відновлює сцену та огляд');
act('zoneBack','wrong');A(localCurrent()==='deck','застарілий вихід не діє');
s.dlg=[{k:'story',title:'Відкладена подія'}];act('zoneBack','deck');
A(localCurrent()==='deck','вихід чекає закриття активного діалогу');
s.bellHold=1;act('zoneBack','deck');
A(atShore()&&s.localProgress.deck.planks&&s.dlg.length===1,'відкладений дзвінок не блокує вихід і зберігає подію');
s.dlg=[];s.bellHold=0;
act('zoneEnter','deck');act('tab','home');A(!s.localZone&&s.tab==='home','вкладка закриває локальний перегляд');
act('zoneEnter','deck');A(!s.localZone,'не можна ввійти з іншої вкладки');
act('tab','shore');act('zoneEnter','deck');A(s.localProgress.deck.planks,'повернення без повторної винагороди');
s.localZone='unknown';save();load();A(!s.localZone&&s.localProgress.deck.planks,'невідомий ID безпечно повертає назовні');
const old=JSON.parse(raw);delete old.localZone;delete old.localProgress;delete old.poolFindCyc;delete old.f.deckSeen;
old.odd.seaglass=1;old.shoreFindMiss.gather=10;old.r.scrap=17;
raw=JSON.stringify(old);load();
A(s.localZone===''&&s.localProgress&&s.poolFindCyc===null&&s.c.scrap===12&&s.r.scrap===17&&s.odd.seaglass&&s.shoreFindMiss.gather===10,
  'старе збереження зберігає розбори, ресурси, колекцію і серію невдач');
localZoneTick();act('zoneEnter','deck');A(localCurrent()==='deck','старий гравець відкриває палубу зі збереженим лічильником');
// Палуба зберігає огляди окремо від одноразового підбору в обох порядках порятунку.
for(const rescueFirst of [false,true]){
  s=fresh();s.tab='shore';s.tabs.shore=1;
  Object.assign(s.f,{looked:1,wreck:1,rod:1,deckSeen:1,tideSeen:1});
  s.c.scrap=12;s.b.winch=2;
  s.localProgress.deck={visited:1,planks:1}; // Збереження P4.5.1.
  s.dbgTide=rescueFirst?'low':'high';s.tideEpoch=Date.now();
  const rescueZinovii=()=>{
    s.shf='zinovii';act('shfgo','zinovii');
    while(s.dlg.length)act('dlgok');
  };
  if(rescueFirst)rescueZinovii();
  A(!deckWinchTalkReady(),'саме знайомство ще не відкриває тему механізму');
  act('zoneEnter','deck');save();load();
  A(localCurrent()==='deck'&&s.localProgress.deck.planks&&rLocalZone().includes('шаром солі'),'старий огляд лишився після появи нових об’єктів');
  A(rLocalZone().includes(rescueFirst?'Палуба «Мартина»':'Палуба уламка'),'назва відповідає знайомству');
  A(!/трюм|пацюк|рецепт|Зиновій|секрет/.test(rLocalZone()),'перша сцена не має майбутніх сюжетних зачіпок');
  A(!localAct('deck:winchTaken')&&!localAct('wreck:winch'),'не можна забрати до огляду чи за чужим ID');
  s.dlg=[{k:'story',title:'Відкладена подія'}];
  A(!localAct('deck:winch'),'відкритий сюжетний діалог зберігає пріоритет');
  s.bellHold=1;
  A(localAct('deck:hatch')&&localAct('deck:mount')&&localAct('deck:winch'),'огляди працюють з відкладеним дзвінком');
  A(s.dlg.length===1&&s.dlg[0].title==='Відкладена подія'&&!deckWinchTalkReady(),'огляд не забирає предмет і не змінює чергу');
  save();load();
  A(s.localProgress.deck.hatch&&s.localProgress.deck.mount&&s.localProgress.deck.winch
    &&rLocalZone().includes('deck:winchTaken'),'reload зберігає всі огляди й доступ до підбору');
  const goods=()=>JSON.stringify([s.r,s.inv,s.odd,s.h.xp,s.h.xpb,s.b.winch]);
  const before=goods();
  A(localAct('deck:winchTaken')&&!localAct('deck:winchTaken')&&!localAct('deck:winch'),'механізм забирається рівно раз');
  A(goods()===before&&s.dlg.length===1,'підбір не видає ресурсів, XP, колекції чи діалогу');
  save();load();act('zoneBack','deck');
  s.dbgTide=s.dbgTide==='low'?'high':'low';act('zoneEnter','deck');
  A(s.localProgress.deck.winchTaken&&!rLocalZone().includes('data-i="deck:winchTaken"')&&rLocalZone().includes('порожніми отворами'),
    'підбір і опис порожньої основи переживають reload та зміну води');
  A(deckWinchTalkReady()===rescueFirst,'готовність теми залежить від обох збережених фактів');
  act('zoneBack','deck');while(s.dlg.length)act('dlgok');
  if(!rescueFirst)rescueZinovii();
  A(deckWinchTalkReady()&&!s.dlg.length,'після другого факту готова умова без нового діалогу');
  const scrap=s.r.scrap;produce(10);
  A(Math.abs(s.r.scrap-scrap-6)<1e-9&&s.b.winch===2,'стара лебідка продовжує давати 0,3 брухту/с за рівень');
}
console.log('fails',fails);
`);
