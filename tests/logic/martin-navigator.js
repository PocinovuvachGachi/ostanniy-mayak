require('../harness.js')(String.raw`
(()=>{
let fails=0;
const A=(ok,m)=>{if(!ok){fails++;console.log('FAIL',m)}};
let raw;
localStorage.getItem=()=>raw;
localStorage.setItem=(key,text)=>{raw=text};
const drain=()=>{while(s.dlg.length)act('dlgok')};
const hold=()=>{act('tab','shore');act('zoneEnter','deck');act('zoneEnter','hold')};
const action=id=>localAct('hold:'+id);
const complete=()=>{
  for(const [id,target] of [['ring1',0],['ring2',2],['ring3',3]]){
    const i=Number(id.at(-1))-1;
    for(let n=0;n<4&&navRings(s.localProgress.hold)[i]!==target;n++)action(id);
  }
};
const oldWin=({page=true,master=true}={})=>{
  s=fresh();s.tabs.shore=1;s.tabs.journal=1;s.tab='shore';
  s.f.rats=1;s.f.zinovii=1;s.f.tracks=1;s.f.martinLogStory=1;
  s.ratsT=123;s.localProgress.deck={openHatch:1,mount:1};s.odd={mplate:1};
  if(page){s.odd.logpage=1;s.oddRead.logpage=1}
  if(master){s.f.people=1;s.mst.zinovii=1}else s.met.zinovii=1;
  giveI('lamp');save();load();
};
const turnPage=()=>{act('tab','journal');act('jt','documents');act('navLog')};
const ask=()=>{act('tab','home');act('navTalk');drain()};

s=fresh();s.tabs.shore=1;s.tab='shore';s.f.deckSeen=1;giveI('storm');
s.localProgress.deck={beamMoved:1,openHatch:1};
hold();A(localCurrent()==='hold'&&!action('navDoor')&&!localEnter('navigator'),'відсік лишається невідомим до очищення трюму');
for(const talkFirst of [false,true]){
  oldWin({master:!talkFirst});
  A(s.f.deckSeen&&s.f.tracks&&s.f.martinLogStory&&s.ratsT===123&&!s.portableWinch.restored,
    'стару перемогу та розмову збережено, лебідку за перемогу не видано');
  const disc=JSON.stringify(s.disc),odd=JSON.stringify(s.odd),xp=totXP(),front=OD.logpage.d;
  turnPage();ask();
  A(!navDoorSeen()&&!navTalkReady()&&!rJournal().includes(NAV_REVERSE)&&!s.dlg.length,
    'підказки приховані до огляду дверей');
  hold();
  A(action('navDoor')&&!action('navMarks')&&!action('ring1')&&!localEnter('navigator'),
    'каганець показав двері, кільця й відсік вимагають подальшого огляду');
  A(!rLocalZone().includes(NAV_TITLE)&&!rLocalZone().includes('Секстант'),'перший огляд без назви відсіку і винагороди');
  if(talkFirst){
    act('tab','home');A(rHome().includes('data-a="navTalk"'),'пізній Зиновій доступний поза карткою майстра');
    ask();turnPage();
  }else{turnPage();ask()}
  A(s.localProgress.hold.navTalk&&s.localProgress.hold.navLog&&s.f.martinLogStory&&OD.logpage.d===front
    &&JSON.stringify(s.odd)===odd&&s.oddRead.logpage&&!s.oset,
    'обидва порядки підказок із уже прочитаним журналом, історія й набір незмінні');
  act('tab','journal');act('jt','documents');
  A(rJournal().includes(NAV_REVERSE),'зворот можна перечитати');
  giveI('storm');act('equip','storm');hold();
  A(action('navMarks')&&rLocalZone().includes(NAV_MARKS)&&rLocalZone().includes('Кільце 1: Хвиля'),'штормове світло виявило риску й мітки');
  A(!localAct('navigator:navCache')&&!action('ring4')&&!localEnter('navigator'),'чужа дія та неіснуюче кільце не працюють');
  const goods=()=>JSON.stringify([s.r,s.h.hp,s.h.xp,s.h.xpb,s.inv,s.cd]);
  const before=goods();
  A(action('navTry')&&s.localProgress.hold.navStuck&&goods()===before&&!navDoorOpen(),'хибна відповідь без витрат і таймера');
  action('ring1');load();
  A(localCurrent()==='hold'&&navRings(s.localProgress.hold).join()==='2,1,1'&&!s.localProgress.hold.navStuck,
    'позиції збережені, поворот прибирає реакцію');
  act('equip','lamp');A(!action('ring2')&&!action('navTry')&&navRings(s.localProgress.hold)[0]===2,'каганець після відкриття міток не дозволяє читати механізм');
  act('equip','storm');complete();A(action('navTry')&&navDoorOpen()&&localEntries().includes('navigator'),'правильна відповідь відчиняє двері');
  act('equip','lamp');A(localEnter('navigator')&&localCurrent()==='navigator','відчинені двері працюють із каганцем');
  act('unequip','light');localSanitize();
  A(localCurrent()==='deck'&&navDoorOpen(),'втрата світла з другого рівня піднімає на безпечну палубу');
  act('equip','storm');act('zoneEnter','hold');act('zoneEnter','navigator');
  A(localAct('navigator:table')&&localAct('navigator:navCache')&&!localAct('navigator:navCache'),'обидві нагороди отримуються разом і один раз');
  A(s.inv.sextant===1&&s.odd.navnote&&OD.navnote.xp===0&&!OD.navnote.set&&totXP()===xp
    &&JSON.stringify(s.disc)===disc&&!s.pack.includes('sextant')&&!s.belt.includes('sextant'),'інструмент поза спорядженням, аркуш без XP або точок на мапі');
  drain();save();load();
  A(localCurrent()==='navigator'&&s.oddRead.navnote&&s.localProgress.navigator.table&&!localAct('navigator:navCache'),'повторний імпорт зберігає відсік і документ');
  act('tab','journal');act('jt','documents');
  A(rJournal().includes(OD.navnote.n)&&shelfItems().includes('navnote'),'нагорода є на чинній полиці та в журналі');
  hold();A(localEnter('navigator')&&localBack('navigator')&&localCurrent()==='hold'&&localBack('hold')&&localCurrent()==='deck',
    'вкладені переходи ведуть на найближчий рівень');
}
oldWin({page:false,master:false});giveI('storm');act('equip','storm');hold();
action('navDoor');action('navMarks');complete();action('navTry');
A(s.odd.logpage&&!s.oddRead.logpage&&!s.localProgress.hold.navTalk&&!s.localProgress.hold.navLog&&navDoorOpen(),
  'старій перемозі доступний зворот, уважний гравець розв’язує загадку без обов’язкових підказок');
for(const stage of [2,3,4,5]){
  if(stage>=2)s.f.fordDone=1;
  if(stage>=3)s.floors.study=1;
  if(stage>=4)s.f.ostap=1;
  if(stage>=5)s.f.schooner=1;
  save();load();hold();
  A(navDoorOpen()&&localEnter('navigator')&&localAct('navigator:table'),'повернення на етапі '+stage);
}

for(const legacy of ['newlyRecovered','readReverse','alreadyRead','oldAward']){
  oldWin({page:legacy==='alreadyRead'||legacy==='oldAward'});
  Object.assign(s.odd,{mbell:1,mladle:1});
  if(legacy==='oldAward')s.f.martinSet=1;
  const beforeTalent=s.h.fp,beforeXp=totXP();
  hold();action('navDoor');
  A(s.h.fp===beforeTalent&&totXP()===beforeXp,'відновлення сторінки саме не видає досвід чи талант');
  if(legacy==='readReverse')turnPage();
  else{
    act('tab','tower');popB='cl:shelf';act('shelfInspect','logpage');
    if(!s.oddRead.logpage)act('shelfRead','logpage');
  }
  A(s.f.martinSet&&s.oset?.martin&&s.h.fp===beforeTalent+Number(legacy!=='oldAward'),
    'звичайна винагорода повного набору · '+legacy);
  drain();save();load();
  popB='cl:shelf';act('shelfInspect','logpage');readOddDocument('logpage');drain();
  A(s.f.martinSet&&s.oset?.martin&&s.h.fp===beforeTalent+Number(legacy!=='oldAward')&&totXP()===beforeXp,
    'повний старий набір завершується один раз у чинній взаємодії · '+legacy);
}

oldWin();hold();action('navDoor');act('tab','tower');
popB='cl:shelf';shelfSelected='logpage';
A(shelfPopHTML().includes('data-a="navLog"'),'полиця пропонує зворот уже прочитаної сторінки');
act('navLog');
A(shelfPopHTML().includes(NAV_REVERSE)&&s.f.martinLogStory,'полиця зберігає зворот незалежно від старої розмови');

s=fresh();
const marine=Object.entries(LOC).filter(([,l])=>l.sea);
for(const trust of [0,79,80,100]){
  s.fac.cape=trust;delete s.inv.sextant;
  for(const [id,l] of marine)A(seaCost(l)===Math.max(1,l.sea*2-Number(trust>=80)),'базове значення '+id+' '+trust);
  giveI('sextant');
  for(const [id,l] of marine)A(seaCost(l)===Math.max(1,l.sea*2-Number(trust>=80)-Number(l.sea===2)),'секстант і довіра '+id+' '+trust);
}
s.tabs.map=1;s.f.boat=1;s.disc.monastery=1;s.fac.cape=0;s.r.prov=3;
A(!canGo('monastery')[0],'шхуна лишається вимогою');
s.f.schooner=1;s.r.prov=2;
A(!canGo('monastery')[0]&&rMapList().includes(seaPlanText(LOC.monastery))&&mapPopHTML('mp:monastery').includes(seaPlanText(LOC.monastery)),
  'і список, і картка мапи показують знижку та чинний поріг');
s.r.prov=3;act('go','monastery');
A(s.at==='monastery'&&s.r.prov===0,'похід списує фактичні три провізії');
s.at='';s.fac.cape=80;s.r.prov=2;act('go','monastery');
A(s.at==='monastery'&&s.r.prov===0,'із довірою списує дві провізії');
s.at='';s.disc.fort=1;s.dbgTide='high';s.r.prov=10;
A(!canGo('fort')[0],'секстант не замінює карту рифів');
s.f.reefmap=1;A(!canGo('fort')[0],'секстант не обходить приплив');
s.dbgTide='low';A(canGo('fort')[0],'умови близького маршруту незмінні');
s.disc.mine=1;s.eq.light='';A(!canGo('mine')[0],'темна локація вимагає світла');
s.pop=20;
for(const id in EXP){
  const ex=EXP[id];s.r.prov=50;act('exp',id);
  A(s.exp.some(job=>job.id===id)&&s.r.prov===50-(ex.c.prov||0),'витрати експедиції '+id+' незмінні');
}
console.log('fails',fails);
})();
`);
