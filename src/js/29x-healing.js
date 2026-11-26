/* Їжа й лікувальні предмети. Регенерація витрачає час лише поза боєм. */
const beltItem=id=>!!IT[id]?.use&&IT[id].use!=='regen';
const healingItem=id=>['heal','regen'].includes(IT[id]?.use);
// Колишню швидкість зігрівання фіксуємо лише для збитню й міграції.
const warmRate=()=>(12+3*Math.min(6,s.b.hearth||0))/100;
const activeRegen=()=>s.h.buf?.regen;

function healHero(amount){
  const gained=Math.min(Math.max(0,maxHP()-s.h.hp),amount);
  s.h.hp+=gained;
  return gained;
}
function healingTick(dt){
  const effect=activeRegen();
  if(!effect||s.cb||dt<=0)return false;
  const elapsed=Math.min(dt,effect.left);
  healHero(elapsed*effect.rate);
  effect.left-=elapsed;
  if(effect.left<=1e-9){delete s.h.buf.regen;dirty=1}
  return elapsed>0;
}
function migrateWarm(now){
  const buf=s.h.buf;
  if(!buf||!('warm' in buf))return false;
  const left=(buf.warm-now)/1000;
  if(left>0&&!buf.regen)buf.regen={rate:warmRate(),left};
  delete buf.warm;
  return true;
}
function regenFor(it){
  if(it.regen){const [hp,seconds]=it.regen;return {rate:hp/seconds,left:seconds}}
  if(it.warm)return {rate:warmRate(),left:it.warm*60};
  return null;
}
function healingUse(id){
  if(!healingItem(id)||!has(id))return null;
  const it=IT[id];
  if(s.cb&&it.use==='regen')return null;
  const hp=Math.min(it.v||0,Math.max(0,maxHP()-s.h.hp));
  const full=it.full>(s.h.buf?.full||0)?it.full:0;
  const current=activeRegen(),next=s.h.hp<maxHP()?regenFor(it):null;
  const regen=next&&(!current||next.rate>current.rate||next.rate===current.rate&&next.left>current.left)?next:null;
  return hp||full||regen?{hp,full,regen}:null;
}
function useHealingItem(id){
  const use=healingUse(id);
  if(!use)return null;
  s.inv[id]--;
  healHero(use.hp);
  if(use.full||use.regen){
    const buf=s.h.buf||(s.h.buf={});
    if(use.full)buf.full=use.full;
    if(use.regen)buf.regen=use.regen;
  }
  dirty=1;
  return use;
}
function foodEffectsText(it){
  const out=[];
  if(it.v)out.push(`${it.v} HP одразу`);
  if(it.regen)out.push(`До ${it.regen[0]} HP за ${it.regen[1]} с поза боєм`);
  if(it.warm)out.push(`Зігрівання на ${it.warm} хв поза боєм`);
  if(it.full)out.push(`+1 ОД на початку бою · боїв у запасі ${it.full}`);
  return out.join(' · ');
}
function healingStatus(){
  const r=activeRegen(),full=s.h.buf?.full||0;
  const regen=r?`Відновлення · до ${fr(r.left*r.rate)} HP за ${Math.ceil(r.left)} с${s.cb?' · пауза в бою':''}`:'';
  return [regen,full?`Ситість · +1 ОД на початку бою · боїв у запасі ${full}`:''].filter(Boolean).join(' · ');
}

function mealCost(){
  const missing=Math.max(0,maxHP()-s.h.hp);
  const fish=Math.min(Math.floor(s.r.fish),Math.ceil(missing/FOODHP.fish));
  const prov=Math.min(Math.floor(s.r.prov),Math.ceil(Math.max(0,missing-fish*FOODHP.fish)/FOODHP.prov));
  return {...(fish?{fish}:{}),...(prov?{prov}:{})};
}
function mealLabel(){
  const cost=mealCost();
  return [cost.fish?`риба ×${cost.fish}`:'',cost.prov?`провізія ×${cost.prov}`:''].filter(Boolean).join(', ');
}
function rawFoodButtons(){
  let out='';
  if(s.seen.fish)out+=btn(`З’їсти рибу (+${FOODHP.fish})`,'eat','',{ok:()=>s.r.fish>=1&&s.h.hp<maxHP()});
  if(s.seen.prov)out+=btn(`З’їсти провізію (+${FOODHP.prov})`,'eatp','',{ok:()=>s.r.prov>=1&&s.h.hp<maxHP()});
  if(s.seen.fish||s.seen.prov)out+=btn(`Поїсти досхочу${V(()=>mealLabel()?' · '+mealLabel():'')}`,'eatfull','',{ok:()=>!!mealLabel()});
  return out;
}
function eatOne(k){
  if(s.cb||s.r[k]<1||s.h.hp>=maxHP())return;
  s.r[k]--;healHero(FOODHP[k]);dirty=1;
}
function eatFull(){
  if(s.cb)return;
  const cost=mealCost();
  if(!Object.keys(cost).length)return;
  pay(cost);
  const hp=healHero((cost.fish||0)*FOODHP.fish+(cost.prov||0)*FOODHP.prov);
  say(`Ти їси (${costTxt(cost)}). Відновлено ${fr(hp)} здоров’я.`,'info');
}
