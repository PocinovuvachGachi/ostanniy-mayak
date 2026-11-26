require('../harness.js')(`(()=>{
let fails=0;
const A=(ok,msg)=>{if(!ok){fails++;console.log('FAIL',msg)}};
const almost=(x,y)=>Math.abs(x-y)<1e-7;
let now=Date.now(),raw;
Date.now=()=>now;localStorage.setItem=(k,v)=>{raw=v};localStorage.getItem=()=>raw;
const drain=()=>{while(s.dlg.length)act('dlgok')};
function reset(hp=1){s=fresh();s.h.hp=hp;s.lastAct=now}

reset();s.b.hearth=6;s.on.hearth=false;produce(600);save();now+=600000;load();
A(s.h.hp===1,'вогнище й відсутність не лікують');
s.tabs.hero=1;xp(need(1));A(s.h.lvl===2&&s.h.hp===1&&maxHP()===28,'новий рівень збільшує максимум без відновлення');
act('attr','con');A(s.h.hp===6&&maxHP()===33,'очко витривалості додає 5 до обох значень');
s.b.dummy=1;produce(1500);A(s.h.lvl>2&&s.h.hp===6,'фоновий досвід манекена не відновлює HP');

reset();giveI('soup',3);giveI('soupherb');giveI('soup_t');giveI('musselsoup');giveI('pie',2);
A(!beltHas('soup')&&!beltHas('soup_t')&&beltHas('pie'),'чиста регенерація не претендує на пояс');
act('beltAdd','soup');A(!beltHas('soup'),'регени не додаються на пояс і вручну');
act('use','soup');act('use','soup');A(s.inv.soup===2&&s.h.hp===1&&activeRegen().left===120,'та сама повна тривалість не витрачає зайву порцію');
produce(30);A(almost(s.h.hp,7)&&activeRegen().left===90,'лінійне відновлення у будь-якій вкладці');
act('use','soup');A(s.inv.soup===1&&activeRegen().left===120,'оновлення тривалості без додавання');
act('use','soupherb');A(!has('soupherb')&&activeRegen().left===180&&activeRegen().rate===.2,'однакова швидкість бере довший профіль');
act('use','musselsoup');A(has('musselsoup')&&activeRegen().left===180,'повільніша юшка не перезаписує швидшу');
act('use','soup_t');A(!has('soup_t')&&activeRegen().left===120&&activeRegen().rate===.3,'швидша юшка замінює профіль цілком');
act('use','pie');A(s.h.hp===maxHP()&&s.h.buf.full===3&&activeRegen().left===120,'миттєва їжа, ситість і регенерація працюють одночасно');
act('use','pie');A(s.inv.pie===1,'при повних HP і ситості порцію збережено');
produce(10);A(activeRegen().left===110,'за повного HP час і бюджет витрачаються');
startFight('rats','x');const left=activeRegen().left;
A(s.cb.ap===maxAP()+1&&s.h.buf.full===2,'на початку тактичного бою одна витрата ситості');
const before=s.h.hp;produce(30);act('eat');act('eatp');act('use','soup');act('c_item','soup');
A(s.h.hp===before&&activeRegen().left===left&&s.inv.soup===1,'в бою пауза й заборона сирої їжі та юшки');
const ap=s.cb.ap;act('c_item','pie');A(s.h.buf.full===3&&s.cb.ap===ap-1&&!has('pie'),'за 1 ОД можна підготувати наступні бої при повному HP');
save();now+=60000;load();A(s.cb&&activeRegen().left===left&&s.h.hp===before,'збережений бій не дає офлайн-регенерації');
s.cb=null;produce(150);A(!activeRegen()&&s.h.hp===maxHP(),'кінцева тривалість і обмеження максимумом');

reset();s.r.fish=10;s.r.prov=2;giveI('mussel');const cost=mealCost();
A(cost.fish===6&&!cost.prov&&mealLabel().includes('×6'),'план їжі показує витрати для 24 HP');
act('eatfull');A(s.r.fish===4&&s.r.prov===2&&has('mussel')&&s.h.hp===maxHP(),'автоматична дія використовує лише звичайну їжу');
reset();giveI('soup');act('use','soup');save();now+=30000;load();const hp=s.h.hp;
A(almost(hp,7)&&activeRegen().left===90,'30 секунд з активної страви враховано офлайн');
load();A(s.h.hp===hp&&activeRegen().left===90,'повторне load не видає ті самі 6 HP');
now+=2500;load();A(almost(s.h.hp,7.5)&&activeRegen().left===87.5,'коротка перерва також враховується рівно один раз');
now+=200000;load();A(s.h.hp===maxHP()&&!activeRegen(),'пропуск терміну не дає надлишкового HP');

reset(4);s.b.hearth=2;s.h.buf={warm:now+120000,full:12};giveI('soup');s.belt=['soup','bandage'];s.rcp={soup:1};save();
const old=JSON.parse(raw);delete old.healingV;raw=JSON.stringify(old);now+=20000;load();
A(s.h.hp===4&&almost(activeRegen().rate,.18)&&activeRegen().left===100&&!s.h.buf.warm&&s.h.buf.full===12,'міграція лише залишку тепла, без ретроактивного HP чи обрізання ситості');
A(has('soup')&&rcpKnown('soup')&&!s.belt.includes('soup')&&s.belt.includes('bandage'),'міграція зберігає їжу й рецепт та звільняє рівно один слот');
load();A(s.h.hp===4&&activeRegen().left===100,'міграція збережена одразу');
reset(4);s.b.hearth=2;giveI('zbyten');act('use','zbyten');s.b.hearth=6;
A(s.h.hp===12&&almost(activeRegen().rate,.18)&&activeRegen().left===900,'збитень має 8 HP і знімок швидкості на 15 хв');
reset(4);s.mst.olesya=1;act('olheal');A(s.h.hp===maxHP()&&onCd('olheal'),'лікування Олесі й відновлення дії');
s.h.hp=4;giveI('potion');act('use','potion');A(s.h.hp===maxHP(),'зілля лишається цілеспрямованим лікуванням');
reset(4);s.at='village';s.tab='map';s.met.hanna=1;s.r.coin=5;
act('la','village.hut.heal');A(s.h.hp===maxHP()&&!s.r.coin,'платне лікування Ганни');
drain();s.h.hp=4;s.fac.rot=50;act('la','village.hut.healf');A(s.h.hp===maxHP(),'довіра дає безплатне лікування Ганни');
reset(4);s.r.fish=4;s.r.prov=4;s.h.ft.breath=1;startFight('rats','test');
const ap0=s.cb.ap;act('eat');act('eatp');act('eatfull');
A(s.h.hp===4&&s.r.fish===4&&s.r.prov===4&&s.cb.ap===ap0,'сирі запаси наявні, але в бою недоступні');
act('c_breath');act('c_breath');A(s.h.hp===12&&s.cb.ap===ap0,'Друге дихання раз за бій і без ОД');
s.h.buf={warm:now+50000};save();now+=20000;load();
A(s.cb&&s.h.hp===12&&activeRegen().left===30,'старе тепло в бою мігрує без ретроактивного лікування');

// Перший краб: звичайний вхід, поразка від бойового ходу, відновлення і втеча.
reset();s.tabs.shore=1;s.tab='shore';s.f.rod=1;s.f.looked=1;s.dbgTide='high';s.c.fish=4;
act('fishing');A(s.dlg[0]?.crabw,'перший виклик за п’ятим закиданням');
act('crabPrepare');act('eat');A(!s.dlg.length&&firstCrabWaiting()&&s.h.hp===5&&!s.tabs.hero,'можна підготуватися до відкриття героя');
act('crabRetry');const c=s.cb;
A(c?.win==='crab1'&&s.eq.weapon==='oar'&&s.r.fish===0,'повторний добровільний вхід без запасів');
c.poison=5;for(let i=0;i<6&&s.cb;i++){const fight=s.cb;act('c_end');if(s.cb===fight)s.cb.eAnim=0}
A(!s.cb&&s.h.hp===8&&s.c.fish===0&&!s.r.prov&&s.dlg.some(d=>d.title==='Поразка'),'бойова поразка з порожніми запасами повернула 30%');
drain();checks();drain();checks();A(!s.dlg.some(d=>d.crabw)&&!s.cb&&firstCrabWaiting(),'виклик не відкривається знову без дії');
Math.random=()=>.99;
for(let i=0;i<5;i++){now+=3000;act('fishing');act('eat')}
A(s.h.hp===maxHP()&&!s.r.fish&&!s.cb&&firstCrabWaiting(),'п’ять ручних закидань і прийомів без відпливу й випадковості');
act('crabRetry');const fight=s.cb;
const y=fight.map.findIndex(row=>row.includes('E'));fight.hx=fight.map[y].indexOf('E');fight.hy=y;
act('c_flee');checks();A(!s.cb&&firstCrabWaiting()&&!s.dlg.some(d=>d.crabw),'втеча також лишає добровільне повернення');
drain();crabWarn();save();
const oldRetry=JSON.parse(raw);delete oldRetry.healingV;oldRetry.c.fish=0;raw=JSON.stringify(oldRetry);load();
A(firstCrabWaiting()&&!s.dlg.some(d=>d.crabw),'старе збереження після поразки звільняє берег від зацикленого діалогу');
reset();s.tabs.shore=1;s.tab='shore';s.f.crabWarn=1;s.c.fish=5;crabWarn();save();
const oldFirst=JSON.parse(raw);delete oldFirst.healingV;oldFirst.dlg[0].btns.pop();raw=JSON.stringify(oldFirst);load();
A(s.dlg[0]?.btns.some(b=>b[1]==='crabPrepare'),'старий перший виклик також дозволяє підготуватися');

// Пізній рецепт у двох порядках, навіть після споживання останньої порції.
for(const gatherFirst of [true,false]){
  reset();s.f.zinovii=1;s.tabs.kitchen=gatherFirst?undefined:1;s.tab='kitchen';
  A(!fishRecipesReady().some(d=>d.id==='musselsoup'),'рецепт прихований до першого збору');
  if(gatherFirst){s.f.musselGathered=1;A(!fishRecipesReady().length,'знахідка чекає кухні');s.tabs.kitchen=1}
  else{s.f.musselGathered=1}
  save();load();A(fishRecipesReady().some(d=>d.id==='musselsoup')&&!has('mussel'),'факт збору після reload, порція для розмови не потрібна');
  act('fishRecipe','musselsoup');drain();act('fishRecipe','musselsoup');A(rcpKnown('musselsoup')&&!s.dlg.length,'одна розмова');
  s.r.fish=2;s.r.wood=1;act('cookp','musselsoup');A(s.r.fish===2&&s.r.wood===1,'немає оплати за відсутнього інгредієнта');
  giveI('mussel');act('cookp','musselsoup');A(has('musselsoup')&&!has('mussel')&&!s.r.fish&&!s.r.wood&&!beltHas('musselsoup'),'одна порція звичайним готуванням');
  act('use','musselsoup');A(activeRegen()?.left===180&&almost(activeRegen().rate,26/180),'ефект юшки з мідіями за специфікацією');
}
console.log('fails',fails)
})()`);
