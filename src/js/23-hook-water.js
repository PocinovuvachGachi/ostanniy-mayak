/* Малий плавучий предмет використовує місце події прибою, коли воно вільне. */
const HOOK_LIMIT_PULLS=2,HOOK_FIRST_GATHERS=3,HOOK_WAIT_MIN=60,HOOK_WAIT_SPAN=60,HOOK_HEAVY_CHANCE=.20;
const HOOK_FLOAT={
  plank:{n:'Дошка на воді',reward:()=>({wood:3+rnd(3)})},
  tackle:{n:'Снасті на воді',reward:()=>({scrap:1+rnd(3)})},
  bottle:{n:'Пляшка на воді',reward:()=>({scrap:2})},
  box:{n:'Малий ящик',reward:()=>({wood:3,scrap:1})},
  heavy:{n:'Ящик між камінням',reward:()=>({wood:4,scrap:3})}
};
const HOOK_LIGHT=['plank','tackle','bottle','box'];
const hookWaterVisible=()=>atShore()&&s.f.hook&&!s.flot?s.hookWater.pending:null;
const hookWaterLabel=o=>o.kind==='heavy'&&!s.f.hookUp?'Спробувати підчепити ящик':`Підтягнути багром · ${HOOK_FLOAT[o.kind].n.toLowerCase()}`;

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
  if(!o||String(o.id)!==String(id)||s.cb||s.raid||s.dlg.length)return;
  if(o.kind==='heavy'&&!s.f.hookUp){
    if(!s.f.hookLimitSeen){
      s.f.hookLimitSeen=1;
      dlg({k:'info',title:'Жердина прогинається',body:'<p>Гак зачепив ящик, але жердина прогнулася. Ти послаблюєш натяг. Ящик міцно сидить між камінням.</p>'});
      save();
    }
    return;
  }
  const w=s.hookWater;
  w.pending=null;w.pulls++;w.wait=HOOK_WAIT_MIN+Math.round(Math.random()*HOOK_WAIT_SPAN);
  for(const key in o.reward)add(key,o.reward[key]);
  say(`Багор дістав вантаж із води. ${costTxt(o.reward)}.`,'find');
  if(w.pulls===1)tutRemember('hookWater');
  hookPullStart(o);sfx('splash');
  dirty=1;save();
}
