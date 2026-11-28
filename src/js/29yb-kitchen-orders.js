/* Облаштування кухні й одне разове замовлення. Рецепти та інвентар спільні з ручним готуванням. */
const KITCHEN_SETUP_COST={wood:24,scrap:8}, KITCHEN_ORDER_SECONDS=30, KITCHEN_ORDER_MAX=3;
const KITCHEN_ORDER_RECIPES=['ash','soup'];
const canUseKitchenOrders=()=>s.f.kitchenEquipped&&s.tabs.kitchen&&zinoviiPresent();
const kitchenProjectHere=()=>s.tabs.kitchen&&zinoviiCardContext()&&localCanAct()&&!s.dlg.length;

function kitchenPlanTick(){
  if(s.f.kitchenPlan||s.f.kitchenEquipped||!kitchenProjectHere()||!rcpKnown('soup')||(s.c.cook||0)<3||!novCan())return;
  s.f.kitchenPlan=1;novMark('kitchenSetup');dirty=1;
}

function kitchenSetupTalk(){
  if(!kitchenProjectHere()||!s.f.kitchenPlan||s.f.kitchenAdvice||s.f.kitchenEquipped)return;
  s.f.kitchenAdvice=1;
  dlg({k:'story',title:'Місце біля столу',img:{t:'face',id:'zinovii'},
    body:`<p>${P('Зиновій')} притримує хиткий край стола. ${Q('Якби підперти ось тут і поставити малий казан збоку, ми б мали місце працювати вдвох. Принесеш дощок і скоб?')}</p>`});
  save();
}

function kitchenSetup(){
  if(!kitchenProjectHere()||!s.f.kitchenAdvice||s.f.kitchenEquipped||!afford(KITCHEN_SETUP_COST))return;
  pay(KITCHEN_SETUP_COST);
  s.f.kitchenEquipped=1;
  novUse('kitchenSetup');
  say('Зиновій проводить долонею по рівному столу й чіпляє малий казан на нову скобу.','world');
  save();
}

function kitchenSetupControls(){
  if(!s.tabs.kitchen||!s.f.kitchenPlan||s.f.kitchenEquipped)return '';
  if(!s.f.kitchenAdvice)return btn('Обговорити робоче місце','kitchenSetupTalk');
  return btn('Облаштувати кухню','kitchenSetup','',{ok:()=>afford(KITCHEN_SETUP_COST)})+
    '<span class="ccs">'+costTxt(KITCHEN_SETUP_COST)+'</span>';
}

const kitchenOrderRecipe=id=>KITCHEN_ORDER_RECIPES.includes(id)?DISH.find(d=>d.id===id):undefined;
const orderDish=id=>{const D=kitchenOrderRecipe(id);return D&&rcpKnown(id)?D:undefined};
const orderHere=()=>canUseKitchenOrders()&&atFishKitchen()&&localCanAct()&&!s.dlg.length;
const orderMissing=D=>Object.keys(D.c).filter(k=>reserveAvailable('kitchenOrder',k,s.r[k])<D.c[k]);
// Після завантаження перша дія гравця знімає паузу на неоплачені порції.
let orderResumeRequired=false;
const ordersCanStart=()=>!document.hidden&&!orderResumeRequired;

function loadKitchenOrder(){
  orderResumeRequired=!!s.kitchenOrder;
  const o=s.kitchenOrder;
  if(!o)return;
  const until=Number.isFinite(o.until)&&o.until>0?o.until:0;
  if(!kitchenOrderRecipe(o.id)||!Number.isInteger(o.left)||!Number.isInteger(o.ready)||o.left<0||o.ready<0||
    o.left+o.ready+Number(!!until)>KITCHEN_ORDER_MAX||!(o.left||o.ready||until)){
    s.kitchenOrder=null;
    return;
  }
  s.kitchenOrder={id:o.id,left:o.left,ready:o.ready,until};
}

function kitchenOrderTick(allowStart=true){
  const o=s.kitchenOrder;
  if(!o)return false;
  const now=Date.now();
  let changed=false;
  if(o.until&&now>=o.until){
    o.until=0;
    o.ready++;
    changed=true;
  }
  if(!o.until&&o.left&&allowStart&&ordersCanStart()){
    const D=orderDish(o.id);
    if(canUseKitchenOrders()&&D&&dishOk(D)&&!orderMissing(D).length){
      pay(D.c,D.it);
      o.left--;
      o.until=now+KITCHEN_ORDER_SECONDS*1000;
      changed=true;
    }
  }
  if(changed){dirty=1;save()}
  return changed;
}

function startKitchenOrder(value){
  if(!orderHere()||s.kitchenOrder||typeof value!=='string')return;
  const [id,count]=value.split(':');
  if(!orderDish(id)||!['1','2','3'].includes(count)||value!==id+':'+count)return;
  s.kitchenOrder={id,left:Number(count),ready:0,until:0};
  s.f.kitchenOrderSeen=1;
  tutOffer('kitchenOrder');
  if(!kitchenOrderTick()){dirty=1;save()}
}

function cancelKitchenOrder(){
  const o=s.kitchenOrder;
  if(!orderHere()||!o?.left)return;
  o.left=0;
  if(!o.until&&!o.ready)s.kitchenOrder=null;
  dirty=1;save();
}

function collectKitchenOrder(){
  const o=s.kitchenOrder;
  if(!orderHere()||!o?.ready)return;
  const ready=o.ready;o.ready=0;
  if(!o.left&&!o.until)s.kitchenOrder=null;
  giveI(o.id,ready);
  save();
}

function kitchenOrderView(){
  if(!canUseKitchenOrders()||!kitchenProjectHere())return;
  act0('tab','kitchen');
  hlT='kitchen-orders';dirty=1;
}

let kitchenOrderDraft={dish:'ash',count:1};
function readKitchenOrderForm(form){
  const {dish,count}=Object.fromEntries(new FormData(form));
  if(!orderDish(dish)||!['1','2','3'].includes(count))return false;
  kitchenOrderDraft={dish,count:Number(count)};
  return true;
}

function kitchenOrderStatus(o){
  if(o.until)return 'Зиновій готує порцію.';
  if(!o.left)return 'Замовлення готове. Порції чекають на столі.';
  if(!ordersCanStart())return 'Решта порцій почнеться після повернення до гри.';
  const D=orderDish(o.id);
  if(!D)return 'Замовлення чекає на відомий рецепт.';
  const missing=orderMissing(D);
  return missing.length?'Потрібно понад резерв: '+missing.map(k=>RN[k].toLowerCase()).join(', ')+'.':'Наступна порція чекає на початок.';
}

function kitchenOrderProgress(){
  const o=s.kitchenOrder;
  if(!o)return '';
  const D=kitchenOrderRecipe(o.id);
  return `<p><b>${IT[D.id].n}</b> · звичайна якість</p>
    <p class="m">За порцію · ${costTxt(D.c)} · ${KITCHEN_ORDER_SECONDS} с</p>
    <p role="status">${V(()=>kitchenOrderStatus(o))}</p>
    <p class="m">${o.until?'<span aria-label="Секунд до готовності">'+V(()=>Math.max(0,Math.ceil((o.until-Date.now())/1000)))+' с</span> · ':''}На столі: ${o.ready} · Ще не розпочато: ${o.left}</p>
    <div class="act">${o.ready?btn('Забрати зі столу','kitchenOrderCollect'):''}${o.left?btn('Скасувати решту','kitchenOrderCancel'):''}</div>`;
}

function kitchenOrderPanel(){
  if(!canUseKitchenOrders())return '';
  if(s.kitchenOrder)return `<section id="kitchen-orders" tabindex="-1"><h2>Замовлення Зиновію</h2>${kitchenOrderProgress()}</section>`;
  const dishes=KITCHEN_ORDER_RECIPES.map(orderDish).filter(Boolean);
  if(!dishes.length)return '';
  const D=orderDish(kitchenOrderDraft.dish)||dishes[0],count=kitchenOrderDraft.count;
  const total=Object.fromEntries(Object.entries(D.c).map(([k,v])=>[k,v*count]));
  return `<section id="kitchen-orders" tabindex="-1"><h2>Замовлення Зиновію</h2>
    <form class="kitchen-order-form">
      <label>Страва<select name="dish">${dishes.map(d=>`<option value="${d.id}"${D===d?' selected':''}>${IT[d.id].n}</option>`).join('')}</select></label>
      <label>Порцій<select name="count">${[1,2,3].map(n=>`<option${n===count?' selected':''}>${n}</option>`).join('')}</select></label>
      <p class="m">Звичайна якість · ${costTxt(total)} · ${count*KITCHEN_ORDER_SECONDS} с</p>
      <button type="submit">Доручити Зиновію</button>
    </form></section>`;
}
