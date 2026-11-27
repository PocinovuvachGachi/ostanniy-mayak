/* Малий плавучий предмет використовує місце події прибою, коли воно вільне. */
const HOOK_LIMIT_PULLS=2,HOOK_FIRST_GATHERS=3,HOOK_HEAVY_CHANCE=.20;
const HOOK_FLOAT={
  plank:{n:'Дошка',reward:()=>({wood:3+rnd(3)})},
  tackle:{n:'Снасті',reward:()=>({scrap:1+rnd(3)})},
  bottle:{n:'Пляшка',reward:()=>({scrap:2})},
  box:{n:'Малий ящик',reward:()=>({wood:3,scrap:1})},
  heavy:{n:'Важкий ящик',reward:()=>({wood:4,scrap:3})}
};
const HOOK_LIGHT=['plank','tackle','bottle','box'];
// Вужчі діапазони врівноважують довшу повну воду коротшим відпливом.
const HOOK_WAIT={floating:{easy:[76,90],hard:[104,120]},tackle:{easy:[60,90],hard:[90,109]}};
const hookWaterVisible=()=>atShore()&&s.f.hook&&!s.flot?s.hookWater.pending:null;
const hookWaterLabel=o=>o.kind==='heavy'&&!s.f.hookUp?'Спробувати підчепити ящик':`Підтягнути багром · ${HOOK_FLOAT[o.kind].n.toLowerCase()}`;

function hookWaterConditions(kind,phase=tideStage()){
  if(!tideKnown()||(phase!=='low'&&phase!=='high'))return 'neutral';
  return (phase==='low')===(kind==='tackle')?'easy':'hard';
}
function hookWaterHint(o,phase=tideStage()){
  if(!tideKnown())return 'Натисни, щоб підчепити багром.';
  const effort=hookWaterConditions(o.kind,phase);
  if(effort==='neutral')return phase==='ebb'?'Вода відступає. Вантаж можна підчепити.':'Вода підступає. Вантаж можна підчепити.';
  if(o.kind==='tackle')return effort==='easy'?'Снасті оголилися на камінні. Тепер їх легше підчепити.':'Хвилі крутять снасті й тягнуть їх під воду.';
  return effort==='easy'?'Вода підхопила вантаж. Він легше піде за гаком.':'Вантаж сів на мокрий пісок. Доведеться потягнути дужче.';
}
function hookWaterWait(kind,effort){
  const [min,max]=HOOK_WAIT[kind==='tackle'?'tackle':'floating'][effort]||[60,120];
  return min+Math.round(Math.random()*(max-min));
}
function hookWaterTick(dt){
  // Великий крок годинника може бути поверненням із фонової вкладки.
  if(dt<=0||dt>1||!atShore()||!s.f.hook||s.cb||s.raid||s.dlg.length||s.tutPending.some(tutReady)||away())return;
  const w=s.hookWater;
  if(w.pending||w.gathers<HOOK_FIRST_GATHERS)return;
  if(w.wait>0)w.wait=Math.max(0,w.wait-dt);
  if(w.wait>0||s.flot||!novCan())return;
  const heavy=w.pulls===HOOK_LIMIT_PULLS||(s.f.hookUp&&Math.random()<HOOK_HEAVY_CHANCE);
  const kind=heavy?'heavy':HOOK_LIGHT[rnd(HOOK_LIGHT.length)];
  w.pending={id:w.pulls+1,kind,reward:HOOK_FLOAT[kind].reward()};
  dirty=1;save();return true;
}
function hookWaterTake(id){
  const o=hookWaterVisible();
  if(!o||String(o.id)!==String(id)||s.cb||s.raid||s.dlg.length||hookPullFx?.o===o)return;
  const time=tidePhase(),effort=hookWaterConditions(o.kind,tideStage(time));
  if(o.kind==='heavy'&&!s.f.hookUp){
    if(!s.f.hookLimitSeen){
      s.f.hookLimitSeen=1;
      dlg({k:'info',hookLimit:1,title:'Жердина прогинається',body:'<p>Гак зачепив ящик, але жердина прогнулася. Ти послаблюєш натяг, і ящик лишається на місці.</p>'});
    }else say('Жердина прогинається. Ти послаблюєш натяг.','info');
    save();
    hookPullStart(o,time,effort,true);
    return;
  }
  const w=s.hookWater;
  w.pending=null;w.pulls++;w.wait=hookWaterWait(o.kind,effort);
  for(const key in o.reward)add(key,o.reward[key]);
  say(`Багор дістав вантаж. ${costTxt(o.reward)}.`,'find');
  if(w.pulls===1)tutRemember('hookWater');
  dirty=1;save();
  hookPullStart(o,time,effort,false);sfx(shoreTideLevel(time)>=.5?'rakeSand':'splash');
}
