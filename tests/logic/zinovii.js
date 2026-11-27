require('../harness.js')(String.raw`
(()=>{
let fails=0;
const A=(ok,msg)=>{if(!ok){fails++;console.log('FAIL',msg)}};
let raw;
localStorage.getItem=()=>raw;
localStorage.setItem=(key,value)=>{raw=value};
const closeDialogs=()=>{while(s.dlg.length)act('dlgok')};
const openCard=()=>act('bpop',ZINOVII_CARD);
const setup=()=>{
  s=fresh();popB='';s.tab='home';s.f.looked=1;s.b.hearth=1;
  Object.assign(s.tabs,{shore:1,tower:1});
  Object.assign(s.f,{deckSeen:1,gullrack:1,wreck:1,rod:1});
};
const rescue=()=>{
  act('tab','shore');s.shf='zinovii';act('shfgo','zinovii');closeDialogs();
};
const pickWinch=()=>{
  act('tab','shore');act('zoneEnter','deck');
  act('zoneAct','deck:winch');act('zoneAct','deck:winchTaken');act('zoneBack','deck');
};
const stats=()=>JSON.stringify([s.r,s.h,s.f,s.inv,s.rcp,s.b,s.wk,s.mst,s.lastNov,s.floors,flow(1,1)]);
const shows=(html,id)=>html.includes('data-a="'+id+'"');

for(const rescueFirst of [false,true]){
  setup();
  s.met.zinovii=1;
  openCard();
  A(!zinoviiPresent()&&!popB&&!rHome().includes('zinovii-card'),'знайомство саме собою не показує мешканця');
  if(rescueFirst){
    rescue();act('tab','home');openCard();
    A(zinoviiPresent()&&popB===ZINOVII_CARD&&!shows(bpopHTML(),'winchTalk'),'після порятунку без механізму немає теми');
  }
  pickWinch();
  if(!rescueFirst){
    act('tab','home');openCard();A(!popB,'механізм без порятунку не показує Зиновія');
    rescue();
  }
  act('tab','home');
  const before=stats();
  openCard();
  A(shows(rHome(),'winchTalk')&&shows(bpopHTML(),'winchTalk')&&stats()===before&&!s.tabs.kitchen,
    'відкрита розмова однакова з картки й зі сцени. Показ картки не дає винагороди');
  act('winchTalk');act('winchTalk');
  A(s.dlg.length===1&&!s.portableWinch.discussed,'підтвердження поради лишилося одноразовим');
  closeDialogs();act('winchTalk');
  A(s.portableWinch.discussed&&!s.dlg.length&&!shows(bpopHTML(),'winchTalk'),'тема зникає в обох представленнях');
}

setup();rescue();
s.localProgress.deck={beamMoved:1,openHatch:1};
s.b.smoke=1;s.r.fish=6;s.r.oil=0;
act('tab','home');openCard();
A(shows(bpopHTML(),'holdOil')&&!s.tabs.kitchen,'допомога з олією доступна біля вогнища до кухні');
act('holdOil');
A(s.r.oil===1&&s.r.fish===5,'одна одиниця олії за одну рибу');

s.f.tracks=1;kitTick();closeDialogs();act('tab','kitchen');
A(atFishKitchen()&&!popB,'перехід вкладки закриває картку');
act('holdOil');
A(s.r.oil===1&&s.r.fish===5,'берегова допомога з кухні потребує відкритої картки');
openCard();act('holdOil');
A(s.r.oil===2&&s.r.fish===4,'спільна дія з кухні має ті самі витрати');
s.dlg=[{k:'story'}];act('holdOil');A(s.r.oil===2,'активний діалог блокує обмін з картки');
s.bellHold=1;act('holdOil');A(s.r.oil===3,'відкладений діалог лишає чинне правило допомоги');
s.dlg=[{k:'fight'}];act('holdOil');A(s.r.oil===3,'дзвінок не обходить бій');
s.dlg=[];s.bellHold=0;
s.f.flounderCaught=1;
A(shows(rKitchen(),'fishRecipe')&&shows(bpopHTML(),'fishRecipe'),'чинний рецепт доступний у кухні й картці');
act('fishRecipe','bakedflounder');closeDialogs();act('fishRecipe','bakedflounder');
A(rcpKnown('bakedflounder')&&!s.dlg.length&&!shows(bpopHTML(),'fishRecipe'),'навчання рецепта лишилося одноразовим');
s.f.rats=1;s.localProgress.hold={navDoor:1};s.odd={logpage:1,mladle:1};
A(shows(bpopHTML(),'navTalk')&&shows(bpopHTML(),'martinLog')&&shows(bpopHTML(),'martinLadle'),
  'підказка і показ знайдених предметів доступні через картку');
const beforeHint=stats();
act('navTalk');closeDialogs();act('navTalk');closeDialogs();
A(s.localProgress.hold.navTalk&&stats()===beforeHint,'повторна підказка відсіку не дає ресурсів чи досвіду');
act('tab','tower');act('tt','cut');act('bpop','cl:shelf');A(shows(shelfPopHTML(),'shelfInspect'),'чинна полиця зі знахідками');
act('shelfInspect','mladle');act('martinLadle');closeDialogs();
act('shelfInspect','logpage');act('martinLog');closeDialogs();
A(s.f.martinLadleStory&&s.f.martinLogStory,'чинні реакції на черпак і сторінку');

act('tab','shore');act('zoneEnter','deck');openCard();act('holdOil');
A(localCurrent()==='deck'&&!popB&&s.r.oil===3,'картка не відкривається в локальній зоні');
act('tab','home');MG={};openCard();MG=null;
A(!popB,'картка чекає завершення мінігри');
s.raid=1;openCard();s.raid=0;A(!popB,'картка недоступна під час набігу');
s.cb={};openCard();s.cb=null;A(!popB,'картка недоступна в бою');

for(const flag of ['f','mst']){
  setup();s[flag].zinovii=1;s.b.smoke=2;s.r.fish=30;s.r.wood=70;s.r.prov=8;
  save();__adv(66000);load();
  const before=stats();openCard();bpopHTML();act('bpop','');
  A(zinoviiPresent()&&rHome().includes('zinovii-card')&&stats()===before,
    'давнє збереження з '+flag+', звичайне офлайн-виробництво й відсутність нагород від картки');
  A(!Object.hasOwn(JSON.parse(raw),'popB'),'картка не зберігається');
}
for(const pose of ['rest','smoke','kitchen']){
  const frames=Array.from({length:4},(_,i)=>zinoviiFrame(pose,i).p.join(''));
  A(new Set(frames).size===4&&frames.every(f=>f.includes('M')),'чотири різні кадри · '+pose);
}
// P4.6.2: спільні контекстні категорії та дерево без нового прогресу.
setup();rescue();act('tab','home');openCard();
A(shows(bpopHTML(),'zinoviiTalk')&&shows(bpopHTML(),'earlySoupLearn')&&!bpopHTML().includes('<h3>Знахідки</h3>')&&!bpopHTML().includes('<h3>Допомога</h3>'),'після порятунку є знання про юшку, немає невідкритих категорій');
const beforeTalk=stats();
act('zinoviiAsk','martin');A(!s.dlg.length,'застаріла відповідь без розмови відхилена');
act('zinoviiTalk');A(s.dlg[0]?.zinoviiConversation==='menu'&&!s.dlg[0].btns.some(b=>b[2]==='kitchen'),'теми лише за наявними умовами');
act('zinoviiAsk','kitchen');A(s.dlg[0]?.zinoviiConversation==='menu','невідкрита тема відхилена');
act('zinoviiAsk','martin');A(s.dlg[0]?.zinoviiConversation==='martin','гілка розмови');
act('zinoviiAsk','martin');A(s.dlg[0]?.zinoviiConversation==='martin','повторний застарілий вибір не перемикає гілку');
act('zinoviiAsk','back');A(s.dlg[0]?.zinoviiConversation==='menu','повернення до тем');
act('dlgok');A(!s.dlg.length&&stats()===beforeTalk,'розмова не дає XP, ресурсів чи нових прапорців');
act('zinoviiTalk');act('zinoviiAsk','martin');save();load();
A(s.dlg[0]?.zinoviiConversation==='martin','зберігається відкрита відповідь');
act('zinoviiAsk','back');A(s.dlg[0]?.zinoviiConversation==='menu','повернення до тем після reload');closeDialogs();
s.f.flounderCaught=1;act('fishRecipe','bakedflounder');
A(!rcpKnown('bakedflounder')&&!s.dlg.length,'картка не відкриває рецепт до кухні');
s.f.tracks=1;kitTick();closeDialogs();act('tab','home');openCard();
A(shows(rHome(),'fishRecipe')&&shows(bpopHTML(),'fishRecipe'),'після кухні рецепт доступний біля вогнища');
MG={};act('fishRecipe','bakedflounder');MG=null;A(!rcpKnown('bakedflounder'),'мінігра блокує навчання');
act('fishRecipe','bakedflounder');closeDialogs();
act('tab','kitchen');openCard();act('fishRecipe','bakedflounder');
A(rcpKnown('bakedflounder')&&!s.dlg.length&&!shows(bpopHTML(),'fishRecipe'),'навчання з двору не дублюється на кухні');
s.odd.mladle=1;s.odd.logpage=1;
A(shows(bpopHTML(),'martinLadle')&&shows(bpopHTML(),'martinLog'),'знайдені речі доступні в спільній картці');
s.dlg=[{k:'story'}];s.bellHold=1;act('martinLadle','card');A(!s.f.martinLadleStory,'відкладений дзвінок не запускає нову особисту розмову');
s.dlg=[];s.bellHold=0;act('martinLadle','card');closeDialogs();
act('martinLog','card');closeDialogs();
A(s.f.martinLadleStory&&s.f.martinLogStory&&s.oddRead.logpage&&s.odd.mladle&&s.odd.logpage&&!shows(bpopHTML(),'martinLadle')&&!shows(bpopHTML(),'martinLog'),'показ не вилучає предмети й не повторюється');
act('tab','tower');act('tt','cut');act('bpop','cl:shelf');act('shelfInspect','mladle');act('martinLadle');
A(!s.dlg.length,'після картки полиця не повторює вже прочитану історію');
act('tab','shore');act('zoneEnter','deck');s.f.martinLadleStory=0;act('martinLadle','card');act('zinoviiTalk');
A(!s.f.martinLadleStory&&!s.dlg.length,'застарілі дії з картки не обходять контекст трюму');
console.log('fails',fails);
})();
`);
