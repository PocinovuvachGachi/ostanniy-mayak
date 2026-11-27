require('../harness.js')(`(()=>{
let fails=0;
function A(ok,msg){if(!ok){fails++;console.log('FAIL',msg)}}
const start=Date.now();let now=start;
Date.now=()=>now;
const goTo=(seconds,cycle=0)=>{now=s.tideEpoch+(cycle*TIDE+seconds)*1000};
const shore=()=>{s=fresh();s.tabs.shore=1;s.tab='shore';s.lastAct=now};
const active=()=>{s.lastAct=now;shfTick()};
const scene=()=>[shoreFordHS(288,120),shoreRuneHS(288,120),shoreFightHS(288,120),rShore()].join('');
let raw=null;localStorage.getItem=()=>raw;localStorage.setItem=(key,value)=>{raw=value};

shore();s.tideEpoch=start;s.f.tideSeen=1;
for(const [seconds,phase,low] of [[0,'high',false],[559.999,'high',false],[560,'ebb',false],
  [599.599,'ebb',false],[599.6,'ebb',true],[600,'low',true],[859.999,'low',true],
  [860,'flood',true],[860.399,'flood',true],[860.4,'flood',false],[899.999,'flood',false],[900,'high',false]]){
  goTo(seconds);A(tideStage()===phase&&tideLow()===low,'фаза й робоча межа '+seconds);
}
goTo(599.5);A(Math.abs(tideLeft()-.1)<1e-8&&tideTxt().includes('До зміни 0:01'),'різні відліки до початку робіт і візуальної межі');
goTo(840);A(Math.abs(tideLeft()-20.4)<1e-8&&tideTxt().includes('До зміни 0:20'),'відплив не закінчується на 39,6 с перед робочою межею');
goTo(860.4);A(Math.abs(tideLeft()-639.2)<1e-8,'наступне робоче вікно після межі');
goTo(720,3);save();const epoch=s.tideEpoch;now+=7*TIDE*1000+200000;load();
A(s.tideEpoch===epoch&&tideCyc()===11&&tidePhase()===20&&!tideLow(),'reload після пропущених циклів відтворює поточну фазу');
s.dbgTide='low';A(tideStage()==='low'&&tideLow()&&tideStatus()[1]===''&&tideCyc()===11,'debug не змінює ID циклу');

// Перше роз’яснення чекає берега, власне робоче вікно — завершення уроку.
NOGAP=0;shore();s.f.rod=1;s.c.fish=3;
s.tab='home';tideFirst();A(s.tideEpoch==null,'підготовка не стартує поза берегом');
s.tab='shore';s.dlg=[{title:'Інша подія'}];tideFirst();A(s.tideEpoch==null,'підготовка чекає діалогу');
s.dlg=[];tideFirst();A(tideStage()==='ebb'&&!tideLow(),'видимий початок відступу після трьох закидань');
now+=TIDE_EDGE*1000;s.lastAct=now;s.cb={};tideFirst();A(!s.f.tideSeen,'пояснення чекає кінця бою');
s.cb=null;s.tab='home';tideFirst();A(!s.f.tideSeen,'готове пояснення чекає повернення на берег');
now+=4*TIDE*1000;s.tab='shore';tideFirst();A(!s.f.tideSeen,'пояснення чекає активності');
s.lastAct=now;tideFirst();A(s.f.tideIntro&&tideLow()&&s.dlg[0]?.title==='Відплив'&&tideCyc()===0,'перше роз’яснення відкриває збережене вікно');
save();now+=3*TIDE*1000;load();A(s.f.tideIntro&&tideLow()&&tideCyc()===0,'reload під час першого пояснення зберігає вікно');
act('dlgok');s.tab='home';tutTick();A(!s.dlg.length&&s.tutPending.includes('tide'),'урок не з’являється поза берегом');
s.tab='shore';tutTick();A(s.dlg[0]?.tut==='tide','чинний окремий урок після роз’яснення');
now+=500000;tideFirst();A(tideLow()&&s.f.tideIntro,'читання уроку не витрачає перше вікно');
act('dlgok');tideFirst();const firstEpoch=s.tideEpoch;
A(!s.f.tideIntro&&tidePhase()===600&&tideLeft()>260,'повне перше робоче вікно після уроку');
s.tab='home';now+=3*TIDE*1000+310000;tideFirst();A(s.tideEpoch===firstEpoch&&tideCyc()===4&&tidePhase()===10,'регулярний цикл йде без гравця');

// Блокування зникає перед наступною сюжетною подією. Повернення зберігає ту саму можливість.
NOGAP=1;shore();s.tideEpoch=now;s.f.tideSeen=1;s.f.horpyna=1;s.r.fish=10;
goTo(620);active();const sealId=shfActionId('seal');
A(shfVisible()==='seal'&&scene().includes(sealId),'тюлень доступний зі сцени і списку');
goTo(860.4);act('shfgo',sealId);
A(s.r.fish===10&&!s.f.seal&&!s.shf&&s.shfDeferred.seal,'стара кнопка не годує тюленя, слот вільний');
s.f.rats=1;s.ratsT=now-360000;active();A(shfVisible()==='tracks','відкладений тюлень не блокує сліди');
goTo(620,3);active();A(shfVisible()==='tracks','повернення води не замінює відкритий сюжет');
act('shfgo','tracks');active();
A(shfVisible()==='seal'&&s.shfT.seal===now&&!s.shfDeferred.seal,'та сама зустріч повертається, новий відлік іде від появи');
act('shfgo',sealId);A(!s.f.seal&&shfVisible()==='seal','кнопка давнього циклу не діє після повернення');
act('shfgo',shfActionId('seal'));A(s.f.seal&&s.r.fish===5&&s.sealCyc===3,'годування зберігає ціну, once та цикл');
s.dlg=[];active();A(!s.shf,'дарунка немає у циклі годування');
goTo(620,4);active();const giftId=shfActionId('sealgift');A(shfVisible()==='sealgift','дарунок з’являється в наступному циклі');
save();goTo(100,8);load();A(!s.shf&&s.shfDeferred.sealgift&&!s.c.seal,'пропущені цикли не видають дарунків');
goTo(620,10);active();act('shfgo',giftId);
A(shfVisible()==='sealgift'&&!s.c.seal,'дарунок чекає, стара дія без винагороди');
const currentGift=shfActionId('sealgift');act('shfgo',currentGift);act('shfgo',currentGift);active();
A(s.c.seal===1&&s.sealCyc===10&&!s.shf,'один дарунок незалежно від пропущених циклів');

// Повторна зустріч може зникнути, уже відкритий бій триває в будь-яку фазу.
shore();s.tideEpoch=now;s.f.tideSeen=1;s.f.crab1=1;Math.random=()=>0;
goTo(600);active();const firstCrab=shfActionId('poolcrab');
goTo(860.4);act('shfgo',firstCrab);A(!s.cb&&!s.shf&&!s.shfDeferred.poolcrab,'краби ховаються, стара кнопка не починає бій');
goTo(600,1);active();act('shfgo',shfActionId('poolcrab'));const battle=s.cb;
goTo(860.4,1);active();A(battle&&s.cb===battle,'приплив не перериває розпочатий бій');

shore();s.tideEpoch=now;s.f.tideSeen=1;s.f.reunion=1;
goTo(650);active();
goTo(880);active();A(!s.shf&&s.shfDeferred.myronvisit,'незавершений візит Мирона звільняє береговий слот');
goTo(650,3);active();act('shfgo',shfActionId('myronvisit'));active();
A(s.c.myron===1&&s.shfT.myronvisit===now&&!s.shf,'пропущені цикли дають один візит, звичайна затримка наступного візиту діє');

// Сумісність формату без епохи. Жодного перенесення номера циклу між шкалами.
shore();s.f.tideSeen=1;s.f.seal=1;s.tideEpoch=null;
now=Math.floor(now/900000)*900000+650000;s.sealCyc=tideCyc();s.c.seal=2;save();
const old=JSON.parse(raw);delete old.shfCyc;delete old.shfDeferred;raw=JSON.stringify(old);load();active();
A(tideLegacy()&&tidePhase()===650&&s.sealCyc===tideCyc()&&!s.shf,'старий календар і отриманий дарунок зберігаються');
now+=TIDE*1000;active();A(shfVisible()==='sealgift','після reload наступний legacy-цикл лишається придатним');
save();const pending=JSON.parse(raw);delete pending.shfCyc;delete pending.shfDeferred;raw=JSON.stringify(pending);
now+=300000;load();A(!s.shf&&s.shfDeferred.sealgift&&s.c.seal===2,'стару подію переносимо зі штампа появи та без винагороди');

// Стан взаємодій до й після точної межі. Виклики імітують старі кнопки.
shore();s.tideEpoch=now;s.f.tideSeen=1;s.f.fordSeen=1;s.f.rats=1;s.f.hook=1;s.r.wood=100;Math.random=()=>.99;
giveI('rake');s.rakeSand.lastId=1;s.rakeSand.wet={id:1,kind:'wet',reward:{scrap:2}};s.hookWater.pending={id:1,kind:'plank',reward:{wood:2}};
goTo(859.9);A(rShore().includes('Оглянути калюжі')&&rShore().includes('Оглянути камінь на відпливі')&&rakeSandVisible().length&&hookWaterVisible(),'усі чинні берегові дії на низькій воді');
goTo(860.4);act('rune','b');act('pool');act('ford','poles');act('rakeSand','1');
A(!s.runes?.b&&!s.c.pool&&!fordN()&&s.rakeSand.wet?.id===1&&hookWaterVisible(),'приплив захищає дії та збережені об’єкти');
A(!rShore().includes('Оглянути калюжі')&&!rShore().includes('Оглянути камінь на відпливі')&&!rakeSandVisible().length,'той самий поріг у сцені й списку');
goTo(600,1);act('rune','b');act('pool');act('ford','poles');act('rakeSand','1');
A(s.runes.b&&s.c.pool===1&&fordN()===1&&!s.rakeSand.wet&&hookWaterVisible(),'доступ повертається на наступному відпливі');
console.log('fails',fails)
})()`);
