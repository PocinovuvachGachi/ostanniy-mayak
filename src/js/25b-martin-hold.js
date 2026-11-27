/* Огляд темряви, переносне світло та спільний фінал нового й старого бою. */
const MARTIN_RATS_WIN='S:rats', MARTIN_RATS_NAME='Пацюки в трюмі';
const deckHatchFree=p=>!!(p?.beamMoved||s.f.rats);
const holdLight=()=>['lamp','storm'].includes(s.eq.light)?s.eq.light:'';
const holdOwnedLight=()=>holdLight()||(has('storm')?'storm':has('lamp')?'lamp':'');
const holdDarkSeen=()=>!!(s.localProgress.deck?.openHatch&&deckHatchFree(s.localProgress.deck));
function martinHoldReady(){return holdDarkSeen()&&!!holdLight()}
function martinRatsReady(){return !s.f.rats&&martinHoldReady()}
const legacyLampPlan=()=>!!(s.disc.chaika||s.disc.cave);
const holdOilNeeded=()=>rcCost(RC.find(r=>r.id==='lamp')).oil;
const holdOilReady=()=>!!(holdDarkSeen()&&s.f.zinovii&&!holdOwnedLight()&&s.r.oil<holdOilNeeded());

function holdOil(){
  if(!zinoviiInteractionHere()||s.at||!localCanAct()||!holdOilReady()||s.r.fish<1)return;
  pay({fish:1});add('oil',1);
  say(`${P('Зиновій')} зливає витоплений жир у шклянку. Від вогню тягне рибою.`,'world');
  save();
}
function holdOilHTML(){
  if(!holdOilReady())return '';
  return '<p class="m">Зиновій може витопити олію з риби біля вогнища.</p>'+
    btn('Витопити олію (1 риба)','holdOil','',{ok:()=>s.r.fish>=1&&holdOilReady()});
}
function holdDeckHint(p){
  if(!p.openHatch||!deckHatchFree(p)||holdLight())return '';
  const owned=holdOwnedLight();
  if(owned)return '<div class="act">'+btn('Взяти '+(owned==='storm'?'штормовий ліхтар':'каганець'),'equip',owned)+'</div>';
  return '<p class="m">Зроби каганець у майстерні й візьми його в руку. '+
    (holdOilReady()?'Якщо бракує олії, Зиновій може витопити її з риби біля вогнища.':'')+'</p>';
}
function martinRatsWin(){
  if(s.f.rats)return '';
  s.f.rats=1;s.f.deckSeen=1;s.ratsT=Date.now();
  add('scrap',25);add('oil',4);xp(25);collFind('rats');
  return 'Трюм вільний. Серед гнилих дощок — скринька з цвяхами й кілька цінних дрібниць.';
}
function migrateMartinHold(){
  let changed=false;
  if(s.shf==='rats'){s.shf='';s.shfCyc=null;changed=true}
  for(const map of [s.shfT,s.shfDeferred])if(map&&Object.hasOwn(map,'rats')){delete map.rats;changed=true}
  if(s.f.rats&&!s.f.deckSeen){s.f.deckSeen=1;changed=true}
  if(s.f.rats&&s.cb?.win===MARTIN_RATS_WIN){s.cb=null;changed=true}
  return changed;
}
