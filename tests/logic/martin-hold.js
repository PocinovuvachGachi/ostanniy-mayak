require('../harness.js')(String.raw`
(()=>{
let fails=0;
const A=(ok,m)=>{if(!ok){fails++;console.log('FAIL',m)}};
let raw;
localStorage.getItem=()=>raw;
localStorage.setItem=(key,json)=>{raw=json};
const drain=()=>{while(s.dlg.length)act('dlgok')};
const action=(zone,id)=>localAct(zone+':'+id);
const visitDeck=()=>{act('tab','shore');act('zoneEnter','deck')};
const lamp=RC.find(rc=>rc.id==='lamp');
const rescue=()=>{s.shf='zinovii';act('shfgo','zinovii');drain()};
const setup=()=>{
  s=fresh();s.tabs.shore=1;s.tabs.hero=1;s.tabs.tower=1;s.tabs.work=1;
  s.tab='shore';s.floors.work=1;s.b.hearth=1;
  Object.assign(s.f,{deckSeen:1,wreck:1,rod:1,crab1:1,gullrack:1,barrel:1});
  s.c.scrap=12;s.r.wood=80;s.r.scrap=50;
  s.h.lvl=3;s.h.k.melee=1;
  giveI('oar');act('equip','oar');s.h.hp=maxHP();
};
A(!SHF.rats&&!shfReady('rats'),'подія пацюків вилучена з реєстру берега');
for(const rescueFirst of [false,true]){
  setup();
  if(rescueFirst)rescue();
  visitDeck();
  A(!rcVisible(lamp)&&!action('deck','openHatch')&&!localEnter('hold')&&!holdOilReady(),
    'перший огляд не розкриває рецепт, трюм чи олію');
  action('deck','winch');action('deck','winchTaken');action('deck','mount');action('deck','hatch');
  act('zoneBack','deck');if(!rescueFirst)rescue();
  act('tab','home');act('winchTalk');drain();act('tab','work');act('craft','winchRestore');
  visitDeck();
  A(s.portableWinch.restored&&action('deck','install')&&action('deck','pull'),'реальний маршрут від Зиновія до балки');
  A(!rcVisible(lamp)&&!holdOilReady()&&!localEntries().includes('hold'),'сама пересунута балка ще не відкрила рецепт');
  A(action('deck','openHatch')&&!action('deck','openHatch')&&rcVisible(lamp)&&s.rcSeen.lamp&&holdDarkSeen(),
    'люк відкрився раз і відкрив чинний рецепт');
  A(!localEnter('hold')&&!action('hold','rats')&&!rLocalZone().includes('пацюк'),'без світла захищені вхід і бій');
  load();
  A(localCurrent()==='deck'&&holdDarkSeen()&&s.rcSeen.lamp&&!s.tabs.kitchen,'темрява і рецепт пережили reload');
  s.f.shore=1;act('holdOil');act('craft','lamp');
  A(!s.r.oil&&!has('lamp'),'з палуби не можна топити олію чи виготовляти');
  act('tab','home');act('holdOil');A(!s.r.oil&&!s.r.fish,'немає безплатної олії');
  A(rHome().includes('data-a="holdOil"'),'Зиновій пропонує відновлення запасу до кухні');
  act('tab','shore');Math.random=()=>.99;
  for(let i=0;i<8;i++){__adv(3050);act('fishing')}
  A(s.r.fish===8,'звичайна риболовля дає запас без залежності від світла');
  s.h.ft.smith=rescueFirst;s.fu.work=rescueFirst?1:0;
  const price=rcCost(lamp),fish=s.r.fish;
  const wanted=rescueFirst?4:6;
  A(price.oil===wanted&&price.scrap===(rescueFirst?8:12),'ціна каганця й штатні знижки');
  act('tab','home');for(let i=0;i<10;i++)act('holdOil');
  A(s.r.oil===wanted&&s.r.fish===fish-wanted&&!holdOilReady(),'рівно 1:1, межа фактичної ціни, відсутність нескінченного топлення');
  s.r.oil--;act('holdOil');
  A(s.r.oil===wanted&&s.r.fish===fish-wanted-1,'відновлення доступне повторно після витрати олії');
  const sc=s.r.scrap;act('craft','lamp');A(!has('lamp')&&s.r.scrap===sc,'ранній рецепт діє в майстерні');
  act('tab','work');act('craft','lamp');act('craft','lamp');
  A(s.inv.lamp===1&&s.eq.light==='lamp'&&!s.r.oil&&s.r.scrap===sc-price.scrap&&!holdOilReady(),
    'каганець придбано один раз і він у штатному слоті');
  act('unequip','light');visitDeck();
  A(rLocalZone().includes('data-i="lamp"')&&!localEnter('hold'),'торба зі світлом потребує екіпірування');
  act('equip','lamp');act('zoneEnter','hold');
  A(localCurrent()==='hold'&&!s.cb&&!atShore()&&s.r.oil===0,'трюм при каганці доступний без пального й автоматичного бою');
  A(!action('hold','quickRats')&&!action('hold','barrels'),'швидкий бій за старим правилом, бочки лише після бою');
  act('zoneBack','hold');A(localCurrent()==='deck','сходи ведуть на палубу');
  act('zoneEnter','hold');act('unequip','light');localSanitize();
  A(localCurrent()==='deck'&&!action('hold','rats'),'без світла повертаємося на палубу');
  giveI('storm');act('equip','storm');act('zoneEnter','hold');
  A(localCurrent()==='hold'&&holdLight()==='storm','наявний штормовий ліхтар теж достатній');
  action('hold','ribs');save();load();
  A(localCurrent()==='hold'&&s.localProgress.hold.ribs,'трюм і огляд лишаються після reload');
  action('hold','rats');A(s.cb?.win===MARTIN_RATS_WIN&&!s.f.rats,'бій добровільний');
  act('c_mv','-1,0');act('c_flee');
  A(!s.cb&&localCurrent()==='deck'&&!s.f.rats&&!s.odd.logpage,'відступ на палубу без нагороди');
  act('zoneEnter','hold');action('hold','rats');lose();drain();
  A(!s.cb&&s.tab==='home'&&!localCurrent()&&holdDarkSeen()&&!s.f.rats,'поразка біля вогнища, люк лишився відкритий');
  act('eat');visitDeck();act('zoneEnter','hold');s.h.hp=maxHP();
  const before={scrap:s.r.scrap,oil:s.r.oil,hp:s.h.hp};
  Math.random=()=>.02;
  action('hold','rats');save();load();A(s.cb?.win===MARTIN_RATS_WIN&&localCurrent()==='hold','збережений активний бій у трюмі');
  botFight();drain();
  A(s.f.rats&&s.odd.logpage&&s.r.scrap-before.scrap===25&&s.r.oil-before.oil===4&&localCurrent()==='hold',
    'перемога дає чинну нагороду й очищений трюм');
  const stamp=s.ratsT;
  A(!action('hold','rats')&&!action('hold','quickRats')&&action('hold','barrels'),'лише огляд бочок після перемоги');
  const won=JSON.stringify([s.r,s.h.xp,s.h.xpb,s.ratsT,s.odd]);shfWin('rats');load();shfWin('rats');
  A(JSON.stringify([s.r,s.h.xp,s.h.xpb,s.ratsT,s.odd])===won&&s.ratsT===stamp,'фінал і повторне завантаження ідемпотентні');
  act('zoneBack','hold');act('zoneBack','deck');
  s.dbgTide='low';act('rune','b');A(s.runes.b,'руна доступна після перемоги');
  Math.random=()=>.99;s.dbgPh='n';s.shf='';shfTick();
  A(!s.shf&&!s.tabs.kitchen,'сліди й кухня чекають свого часу');
  __adv(301000);s.lastAct=Date.now();shfTick();
  A(s.shf==='tracks','сліди зберегли сюжетну затримку');
  act('shfgo','tracks');drain();kitTick();drain();
  A(s.f.tracks&&s.tabs.kitchen&&rcpKnown('soup'),'після слідів відкрилася кухня з юшкою');
  shfTick();A(s.shf==='drown1','утопленик після слідів');
  Math.random=()=>.10;s.h.hp=maxHP();act('shfgo','drown1');botFight();drain();Math.random=()=>.99;shfTick();
  A(s.shf==='horpyna','перемога над утоплеником веде до Горпини');
  act('shfgo','horpyna');drain();
  A(s.f.horpyna&&FL.find(f=>f.id==='gallery').req(),'збережено шлях до оглядової й броду');
}

setup();
s.shf='rats';s.shfCyc=9;s.shfT={rats:777,tracks:222};s.shfDeferred={rats:1,seal:1};
act('shfgo','rats');A(!s.cb&&!shfVisible(),'застарілий виклик не починає бій');
save();load();
A(!s.shf&&s.shfCyc===null&&!s.shfT.rats&&!s.shfDeferred.rats&&s.shfT.tracks===222&&s.shfDeferred.seal&&!s.f.rats,'старі черги чистяться без перемоги');
delete s.f.deckSeen;startFight('rats',MARTIN_RATS_WIN);s.cb.over='win';save();__adv(60000);load();
A(s.f.rats&&s.r.scrap===75&&s.r.oil===4&&s.odd.logpage&&s.f.deckSeen&&!s.cb&&s.tab==='shore'&&!s.localZone&&s.play>=60,'старий бій завершується на березі один раз');
const legacyWon=JSON.parse(raw);load();
A(s.r.scrap===75&&s.r.oil===4&&s.ratsT===legacyWon.ratsT,'перемога під час reload збережена одразу');
delete legacyWon.f.deckSeen;legacyWon.localProgress={};legacyWon.cb=null;raw=JSON.stringify(legacyWon);load();drain();visitDeck();
A(localCurrent()==='deck'&&!s.portableWinch.restored&&action('deck','openHatch')&&!localEnter('hold'),
  'давній переможець бачить люк без лебідки, але для входу потрібне світло');
giveI('storm');act('equip','storm');act('zoneEnter','hold');
A(localCurrent()==='hold'&&!action('hold','rats')&&!rcVisible(lamp)&&s.ratsT===legacyWon.ratsT,'огляд старої перемоги зі штормовим світлом без нових нагород');

setup();s.disc.chaika=1;A(rcVisible(lamp),'пізня умова «Чайки» працює');
s.disc={cave:1};A(rcVisible(lamp),'пізня умова печери працює');
s.disc={};giveI('storm');act('equip','storm');s.localProgress.deck={beamMoved:1,openHatch:1};
visitDeck();act('zoneEnter','hold');s.f.quick=1;s.kills.rat=1;s.h.a.str=6;s.h.hp=maxHP();
A(action('hold','quickRats')&&s.f.rats&&localCurrent()==='hold'&&!action('hold','quickRats'),'швидка перемога у трюмі, без повторного запуску');
console.log('fails',fails);
})();
`);
