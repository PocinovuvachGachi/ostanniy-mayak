require('../harness.js')(String.raw`
(()=>{
let failures=0;
const A=(ok,m)=>{if(!ok){failures++;console.log('FAIL',m)}};
let raw,now=Date.now();
Date.now=()=>now;
localStorage.getItem=()=>raw;
localStorage.setItem=(k,v)=>{raw=v};
const drain=()=>{while(s.dlg.length)act('dlgok')};
const step=(seconds,start=true)=>{now+=seconds*1000;kitchenOrderTick(start)};
const setup=(kitchen=true)=>{
  s=fresh();popB='';MG=null;NOGAP=1;orderResumeRequired=false;document.hidden=false;
  Object.assign(s.tabs,{shore:1,tower:1});if(kitchen)s.tabs.kitchen=1;
  Object.assign(s.f,{looked:1,zinovii:1,people:1});s.mst.zinovii=1;s.b.hearth=1;
  s.rcp={ash:1,soup:1};s.r.fish=40;s.r.wood=60;s.r.scrap=30;
  s.tab=kitchen?'tower':'home';s.tt=kitchen?'kitchen':'cut';
};
const equip=()=>{kitchenPlanTick();act('kitchenSetupTalk');drain();act('kitchenSetup');A(s.f.kitchenEquipped,'облаштовано')};

setup(false);
for(let n=0;n<3;n++)act('cookp','ash');
kitchenPlanTick();
A(s.c.cook===3&&s.inv.ash===3&&!s.f.kitchenPlan&&!rHome().includes('kitchenSetup'),'ранні дії зараховані, пропозиція чекає кухні');
s.tabs.kitchen=1;act('tab','kitchen');delete s.rcp.soup;kitchenPlanTick();
A(!s.f.kitchenPlan,'потрібен відомий рецепт юшки');
s.rcp.soup=1;s.c.cook=2;kitchenPlanTick();
A(!s.f.kitchenPlan,'до третьої завершеної дії пропозиція прихована');
s.c.cook=3;NOGAP=0;s.play=100;novMark();kitchenPlanTick();
A(!s.f.kitchenPlan,'новизна відкладає пропозицію');
s.play+=NOVGAP;kitchenPlanTick();
A(s.f.kitchenPlan&&rKitchen().includes('kitchenSetupTalk')&&!rKitchen().includes('kitchen-orders'),'лише тема розмови після чинних умов');
act('kitchenSetup');A(s.r.wood===60&&s.r.scrap===30,'пропозиція сама не списує ресурси');
act('kitchenSetupTalk');act('kitchenSetup');
A(s.dlg[0]?.title==='Місце біля столу'&&!s.f.kitchenEquipped,'розмова має перевагу над оплатою');
drain();s.r.scrap=7;act('kitchenSetup');A(!s.f.kitchenEquipped&&s.r.wood===60,'неповна оплата нічого не змінює');
s.r.scrap=30;act('kitchenSetup');act('kitchenSetup');
A(s.f.kitchenEquipped&&s.r.wood===36&&s.r.scrap===22,'одноразова точна ціна');
A(rKitchen().includes('Доручити Зиновію')&&!rKitchen().includes('smokedcod')&&!rKitchen().includes('pie'),'форма тільки для відомих підтримуваних страв');

for(const count of [1,2,3]){
  setup();s.c.cook=3;equip();
  const wood=s.r.wood,fish=s.r.fish;
  act('kitchenOrder','smokedcod:1');act('kitchenOrder','soup:4');
  A(!s.kitchenOrder,'непідтримувана страва чи кількість відхиляються');
  act('kitchenOrder','soup:'+count);act('kitchenOrder','ash:1');
  A(s.kitchenOrder.id==='soup'&&s.kitchenOrder.left===count-1&&s.r.fish===fish-3&&s.r.wood===wood-1,'один слот і оплата першої порції');
  step(29);A(!s.kitchenOrder.ready&&!s.inv.soup,'до строку нічого не видано');
  step(1);for(let i=1;i<count;i++)step(30);
  A(s.kitchenOrder.ready===count&&s.r.fish===fish-count*3&&s.r.wood===wood-count&&!s.inv.soup&&s.c.cook===3,'ціна і готові порції, без зарахування до пирога');
  act('kitchenOrder','ash:1');A(s.kitchenOrder.id==='soup','готова партія тримає слот');
  act('kitchenOrderCollect');act('kitchenOrderCollect');save();load();act('kitchenOrderCollect');
  A(s.inv.soup===count&&!s.inv.soup_t&&!s.kitchenOrder,'звичайна якість і одноразовий збір після reload');
}

setup();s.c.cook=3;equip();NOGAP=0;
act('kitchenOrder','ash:1');act('tab','home');tutTick();
A(s.tutPending.includes('kitchenOrder')&&!s.dlg.length,'урок чекає повернення до кухні');
act('tab','kitchen');tutTick();
A(tutKnown('kitchenOrder')&&s.dlg[0]?.tut==='kitchenOrder','урок можна перечитати після першого замовлення');

setup();s.c.cook=3;equip();s.r.fish=11;s.r.wood=10;
act('kitchenOrder','soup:3');
A(!s.kitchenOrder.until&&s.kitchenOrder.left===3&&s.r.fish===11&&kitchenOrderStatus(s.kitchenOrder).includes('плавник'),'брак понад резерв названо в статусі');
s.r.wood=11;step(1);
A(s.r.fish===8&&s.r.wood===10&&s.kitchenOrder.left===2,'резерви залишилися');
act('kitchenOrderCancel');
A(!s.kitchenOrder.left&&s.kitchenOrder.until,'скасовано тільки неоплачені порції');
step(90);A(s.kitchenOrder.ready===1&&s.r.fish===8&&s.r.wood===10,'готова оплачена порція завершилася');
act('kitchenOrderCollect');
act('kitchenOrder','ash:1');act('kitchenOrderCancel');
A(!s.kitchenOrder&&s.r.fish===8,'порожнє замовлення скасовано без витрат');

setup();s.c.cook=3;equip();s.b.smoke=1;s.r.fish=40;s.r.prov=10;
const beforeFlow=flow(10,true).prov;
act('kitchenOrder','ash:3');act('cookp','soup');
A(s.inv.soup===1&&s.c.cook===4&&s.kitchenOrder.until&&beforeFlow===flow(10,true).prov,'ручне готування й подвійний потік коптильні');
const prov=s.r.prov;produce(10);
A(s.r.prov>prov,'коптильня виробляє провізію під час замовлення');

setup();s.c.cook=3;equip();s.r.fish=40;
act('kitchenOrder','ash:3');const fish=s.r.fish;
step(10);save();load();kitchenOrderTick();
A(s.kitchenOrder.left===2&&s.kitchenOrder.until&&s.r.fish===fish,'перезавантаження під час оплаченого готування');
const beforeOffline=s.r.ember;
now+=60000;load();kitchenOrderTick();load();kitchenOrderTick();
A(s.r.ember>beforeOffline&&s.kitchenOrder.ready===1&&s.kitchenOrder.left===2&&!s.kitchenOrder.until&&fish===s.r.fish,
  'офлайн завершує лише оплачений обсяг, звичайне офлайн-виробництво триває');
const belt=s.belt.join();
s.cb={};act('kitchenOrderCollect');
A(s.kitchenOrder.ready===1&&!s.inv.ash&&s.belt.join()===belt,'збір та автоекіпірування недоступні посеред бою');
s.cb=null;document.hidden=true;step(120);
A(s.kitchenOrder.left===2&&!s.kitchenOrder.until,'прихована вкладка не стартує нові порції');
document.hidden=false;act('tab','home');kitchenOrderTick();
A(s.kitchenOrder.until&&s.kitchenOrder.left===1&&fish-3===s.r.fish,'повернення запускає одну порцію незалежно від сцени');
act('kitchenOrderCollect');
A(!s.inv.ash,'збір тільки біля столу на кухні');

setup();s.c.cook=3;equip();
act('kitchenOrder','ash:1');
const ash=DISH.find(d=>d.id==='ash');
pay(ash.c);cookDone('ash',3);
A(s.inv.ash_t===2&&s.c.cook===4&&IT.ash.v===12&&IT.ash_t.v===18&&s.kitchenOrder.until,
  'вже визначений найкращий результат ручного казана зберігає вихід і якість');
step(30);act('kitchenOrderCollect');
A(s.inv.ash===1&&s.inv.ash_t===2,'одночасне замовлення не змінює ручну якість');

setup();s.c.cook=3;giveI('ash_t',2);save();
const old=JSON.parse(raw);delete old.kitchenOrder;raw=JSON.stringify(old);load();
A(!s.kitchenOrder&&s.c.cook===3&&s.inv.ash_t===2&&rcpKnown('soup')&&s.tabs.kitchen,'старі страви, рецепти, лічильник і кухня');
s.dlg=[];kitchenPlanTick();A(s.f.kitchenPlan,'старий лічильник відкриває розмову');
console.log('fails',failures);
})();
`);
