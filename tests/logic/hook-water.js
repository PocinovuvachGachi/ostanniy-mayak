require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
let raw;
localStorage.setItem=(key,value)=>{raw=value};
localStorage.getItem=()=>raw;
const tick=(dt=.25)=>{s.lastAct=Date.now();hookWaterTick(dt)};
const wait=n=>{for(let t=0;t<n;t++)tick(1)};
const drain=()=>{while(s.dlg.length)act('dlgok')};
const gather=()=>{s.cd.gather=0;act('gather');tick()};
const recipe=RC.find(r=>r.id==='hookUp');
const random=Math.random;
const ring=()=>s.hookWater.pending;
const take=id=>act('hookWater',id);
Math.random=()=>0;

s=fresh();s.tabs.shore=1;s.tab='shore';s.f.hookPlan=1;s.f.wreck=1;s.r.wood=30;s.r.scrap=1;
gather();take(1);
A(s.r.wood===31&&!ring()&&s.hookWater.gathers===0,'звичайний збір до багра; без багра нема підтягування');
act('hook');drain();
A(s.f.hook&&s.r.wood===19&&s.r.scrap===0,'ціна старого багра не змінилась');
gather();act('gather');tick();gather();
A(s.hookWater.gathers===2&&!ring()&&s.r.wood===23&&onCd('gather'),'рахуються лише успішні ручні збори, ×2 і шкала цілі');
s.tutPending=['rod'];s.f.rod=1;gather();
A(!ring(),'малий предмет чекає, доки буде показано урок');
s.tutPending=[];dlg({k:'story',title:'Сюжет'});tick();
A(!ring(),'малий предмет чекає сюжетного вікна');
drain();tick();
const first=JSON.stringify(ring());
A(ring()?.kind==='plank'&&ring().reward.wood===3,'перший малий предмет гарантовано, результат визначився при появі');
act('tab','home');wait(120);
A(JSON.stringify(ring())===first,'інші вкладки не змінюють предмет');
const old=JSON.parse(raw);
old.ts-=1800_000;raw=JSON.stringify(old);Math.random=()=>0.99;
load();
A(JSON.stringify(ring())===first&&s.hookWater.wait===0,'предмет не перекидається після офлайн-часу й reload');

act('tab','shore');s.at='village';take(1);
A(ring()&&!hookWaterVisible(),'не можна підтягнути під час перебування в іншій локації');
act('leave');s.f.fordDone=1;
s.floors.gallery=1;s.flot={k:'barrel',until:Date.now()+180000};
take(1);
A(!hookWaterVisible()&&JSON.stringify(ring())===first,'старий прибій має пріоритет, ранній запис лишається');
act('flot');A(hookWaterVisible()?.kind==='plank'&&s.r.oil>0,'старий вантаж дає чинну винагороду');
s.f.tideSeen=1;s.dbgTide='high';
const beforeC=JSON.stringify(s.c),beforeWood=s.r.wood;
Math.random=()=>0;
take(1);take(1);
A(!ring()&&s.hookWater.pulls===1&&s.r.wood===beforeWood+3&&JSON.stringify(s.c)===beforeC&&!MG,'один платіж ресурсів без лічильників звичних дій і мінігри');
A(tutKnown('hookWater')&&s.hookWater.wait===76,'після першого разу є довідник і відлік активного берега');
const waiting=JSON.parse(raw);waiting.ts-=3600_000;raw=JSON.stringify(waiting);load();tick(3600);
A(s.hookWater.wait===76&&!ring(),'офлайн і довгий такт не накопичують час або предмети');
act('tab','home');wait(60);A(s.hookWater.wait===76,'поза берегом час не йде');
act('tab','shore');Math.random=()=>.3;wait(75);
A(!ring()&&s.hookWater.wait===1,'раніше від збереженої затримки нового предмета немає');
tick(1);A(ring()?.kind==='tackle'&&ring().reward.scrap===1,'другий предмет отримує інший тип і пробну нагороду');
take(1);A(ring()?.id===2,'застаріле натискання не може зібрати інший предмет');take(2);
A(!ring()&&s.hookWater.wait===96&&s.hookWater.pulls===2,'винагорода вдруге й новий збережений інтервал');
wait(96);
const heavy=JSON.stringify(ring());
A(ring()?.kind==='heavy'&&!s.f.hookLimitSeen&&!rcVisible(recipe),'важкий ящик після двох підтягувань; креслення приховане');
take(3);take(3);
A(s.f.hookLimitSeen&&s.dlg.length===1&&hookPullFx.blocked&&JSON.stringify(ring())===heavy,'простий багор один раз показує обмеження, не пересуваючи ящик');
A(JSON.parse(raw).dlg.some(d=>d.hookLimit),'пояснення записано до закінчення анімації');
drain();
save();load();A(JSON.stringify(ring())===heavy&&!rcVisible(recipe),'ящик і спостереження пережили завантаження без майстерні');
s.r.wood=30;s.r.scrap=10;act('craft','hookUp');A(!s.f.hookUp&&s.r.wood===30,'обмеження лишається без майстерні');
s.floors.work=1;s.tabs.tower=1;s.tabs.work=1;
A(!rcVisible(recipe),'креслення лише після черги відкриттів');
for(let i=0;i<4&&!rcVisible(recipe);i++){novPlanTick(false);drain()}
A(rcVisible(recipe),'черга відкриває рецепт після майстерні й спостереження');
drain();act('craft','hookUp');A(!s.f.hookUp&&s.r.wood===30,'підсилення доступне лише в майстерні');
act('tab','work');s.r.scrap=5;act('craft','hookUp');A(!s.f.hookUp&&s.r.wood===30,'бракує брухту для підсилення');
s.r.scrap=6;act('craft','hookUp');act('craft','hookUp');
A(s.f.hookUp&&s.r.wood===18&&s.r.scrap===0&&!rcVisible(recipe),'одноразова ціна 12 плавника та 6 брухту');
drain();act('tab','shore');s.dbgTide='low';
A(JSON.stringify(hookWaterVisible())===heavy,'на відпливі доступний той самий ящик');
take(3);take(3);A(s.r.wood===22&&s.r.scrap===3&&!ring(),'підсилення підтягує важкий ящик, нагорода один раз');
gather();A(s.r.wood===24,'після підсилення базовий бонус досі ×2');

save();const legacy=JSON.parse(raw);delete legacy.hookWater;raw=JSON.stringify(legacy);load();
A(s.f.hook&&s.hookWater.gathers===0&&!ring(),'старе збереження без даних багра має безпечні значення');
// Усі типи вантажу на кожній фазі та на межах робочого відпливу.
s=fresh();s.tab='shore';s.tabs.shore=1;s.f.hook=1;
A(hookWaterConditions('plank','high')==='neutral','до відкриття припливів лишається чинний інтервал');
s.f.tideSeen=1;s.f.hookUp=1;
for(const kind of [...HOOK_LIGHT,'heavy']){
  const payout=HOOK_FLOAT[kind].reward(),tackle=kind==='tackle';
  for(const [phase,t] of [['high',120],['ebb',580],['low',620],['flood',880]]){
    s.tideEpoch=Date.now()-t*1000;
    const effort=phase==='high'?(tackle?'hard':'easy'):phase==='low'?(tackle?'easy':'hard'):'neutral';
    const [min,max]=effort==='easy'?(tackle?[60,90]:[76,90]):effort==='hard'?(tackle?[90,109]:[104,120]):[60,120];
    A(tideStage()===phase&&hookWaterConditions(kind)===effort,kind+' '+phase+' має правильне зусилля');
    Math.random=()=>.999;A(hookWaterWait(kind,effort)===max,kind+' '+phase+' має відповідну верхню межу');
    Math.random=()=>0;
    const id=s.hookWater.pulls+1;
    s.hookWater.pending={id,kind,reward:payout};const before={...s.r};
    take(id);
    A(s.hookWater.wait===min&&!ring()&&hookPullFx.effort===effort&&hookPullFx.up&&
      Object.entries(payout).every(([k,n])=>s.r[k]===before[k]+n),kind+' '+phase+' зберігає нагороду й одразу вибирає інтервал');
    const wait=s.hookWater.wait;
    s.tideEpoch=Date.now();save();load();
    A(s.hookWater.wait===wait,kind+' '+phase+' не перекидає очікування після припливу і reload');
  }
}
A(hookWaterY(120)>hookWaterY(580)&&hookWaterY(580)>hookWaterY(620)&&hookWaterY(620)<hookWaterY(880),'вантаж слідує за береговою лінією');
s.f.hookUp=0;s.f.hookLimitSeen=0;const stable={id:s.hookWater.pulls+1,kind:'heavy',reward:{wood:4,scrap:3}};
s.hookWater.pending=stable;
for(const [i,t] of [120,580,620,880].entries()){
  s.tideEpoch=Date.now()-t*1000;
  const before={...s.r},wait=s.hookWater.wait;
  hookPullFx=null;take(stable.id);
  A(hookPullFx?.blocked&&ring()===stable&&s.hookWater.wait===wait&&JSON.stringify(s.r)===JSON.stringify(before),'простий багор не рухає важкий вантаж у фазі '+i);
  A(s.dlg.length===(i?0:1),'пояснення прогину з’являється лише раз');
  drain();
}
Math.random=random;
console.log('fails',fails)
`);
