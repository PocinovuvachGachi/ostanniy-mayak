
/* Локальні зони: контекст батьківської вкладки/місця, реєстр, збережені результати.
   Дочірня зона не є точкою глобальної мапи. Ідентифікатори дій містять ID зони. */
const LOCAL_OUTDOOR_ACTIONS=new Set(['gather','scrapw','hook','hookWater','rakeSand','fishing','pool','mussels','ford','shfgo','rune','crabRetry','drybuild','dryload','drytake','rodReach','bigfish','fishRelease','flot','flotmg','exp','trade']);
const LOCAL_ZONES={
  deck:{tab:'shore',at:'',parent:'',title:()=>s.f.zinovii?'Палуба «Мартина»':'Палуба уламка',
    entry:'Піднятися на палубу',ready:()=>!!s.f.deckSeen,
    desc:'Палуба нахилена до води. Під бортом шурхотить піна, а з обірваної линви поволі падають краплі.',
    objects:{
      hatch:{label:'Оглянути люк',
        text:p=>p.beamMoved?'Балка лежить збоку, а люк і досі зачинений.':'Ти відгортаєш обірвану линву. Поперек люка лежить важка балка. Від поштовху вона навіть не ворухнулася.',
        ready:()=>!deckMounted(),x:131,y:68,art:seen=>deckHatchArt(seen)},
      mount:{label:'Оглянути основу щогли',text:'Ти знімаєш пасмо водоростей. Залізна скоба проходить крізь основу щогли й міцно сидить у дереві.',
        ready:p=>!deckMounted()&&!deckCanInstall(p),next:'install',x:76,y:43,art:seen=>deckMountArt(seen)},
      install:{label:'Встановити лебідку',ready:deckCanInstall,next:'pull',x:76,y:43,art:()=>deckMountArt(true),
        run(){s.portableWinch.mountedAt=DECK_MOUNT;say('Лебідка сідає в скобу. Ти обводиш линву навколо балки.','world')}},
      detach:{label:'Зняти лебідку',ready:deckMounted,next:'install',x:76,y:43,art:()=>deckMountArt(true,true),
        run(){s.portableWinch.mountedAt=null;say('Ти звільняєш скобу й забираєш лебідку.','world')}},
      pull:{label:'Відтягнути балку',ready:deckMounted,next:'hatch',x:131,y:68,art:()=>deckHatchArt(true),
        run(p){p.beamMoved=1;s.portableWinch.mountedAt=null;say('Барабан провертається, і балка повзе вбік. Ти змотуєш линву й забираєш лебідку.','world')},
        fx(){deckHaulAt=Date.now()}},
      winch:{label:'Оглянути механізм',text:'Під кіркою солі проступає барабан корабельної лебідки. Руків’я погнуте, кілька зубців зламано.',
        ready:p=>!p.winch&&!s.portableWinch.restored,next:'winchTaken',x:219,y:48,art:()=>deckWinchArt(false)},
      winchTaken:{label:'Забрати пошкоджену лебідку',
        text:()=> 'Ти вивільняєш пошкоджену лебідку. На палубі лишається її основа з порожніми отворами.'
          +(winchTopicReady()?' Зиновій міг би впізнати цей механізм.':''),
        ready:p=>p.winch&&!p.winchTaken&&!s.portableWinch.restored,x:219,y:48,art:()=>deckWinchArt(true)},
      planks:{label:'Оглянути обшивку',text:'Під шаром солі видно товсті дошки й зігнуті залізні скоби. Цей корпус більший за човни, розбиті в прибої.',
        x:213,y:104,art:seen=>localPlanksArt(seen)}
    },
    background:()=>localDeckBg(),entryArt:()=>localWreckArt(),entryX:237,entryY:16}
};
const localDef=id=>Object.prototype.hasOwnProperty.call(LOCAL_ZONES,id)?LOCAL_ZONES[id]:null;
function localContext(id){const z=localDef(id);return !!(z&&s.tabs[z.tab]&&s.tab===z.tab&&(s.at||'')===z.at&&z.ready()&&(!z.parent||localContext(z.parent)))}
const localCurrent=()=>localContext(s.localZone)?s.localZone:'';
function localSanitize(){
  if(typeof s.localZone!=='string'||!localCurrent())s.localZone='';
  if(!s.localProgress||typeof s.localProgress!=='object'||Array.isArray(s.localProgress))s.localProgress={};
}
function localState(id){
  if(!localDef(id))return null;
  const p=s.localProgress[id];
  if(!p||typeof p!=='object'||Array.isArray(p))s.localProgress[id]={};
  return s.localProgress[id];
}
const localCanAct=()=>!s.cb&&!s.raid&&!MG&&(!s.dlg.length||s.bellHold&&s.dlg[0].k!=='fight');
const localEntries=()=>Object.keys(LOCAL_ZONES).filter(id=>localContext(id)&&(LOCAL_ZONES[id].parent||'')===localCurrent());
function localSwitch(id){deckHaulAt=0;s.localZone=id;popB='';dirty=1;save()}
function localEnter(id){
  if(!localCanAct()||!localEntries().includes(id))return false;
  localState(id).visited=1;localSwitch(id);return true;
}
function localBack(id){
  if(!localCanAct()||id!==localCurrent()||!localDef(id))return false;
  localSwitch(localDef(id).parent||'');return true;
}
function localAct(key){
  const id=localCurrent(),z=localDef(id);
  if(!z||!localCanAct()||typeof key!=='string'||!key.startsWith(id+':'))return false;
  const k=key.slice(id.length+1);
  if(!Object.prototype.hasOwnProperty.call(z.objects||{},k))return false;
  const o=z.objects[k],p=localState(id);
  if(o.ready&&!o.ready(p))return false;
  if(o.run||!p[k]){
    if(o.run)o.run(p);else{p[k]=1;say(localObservation(o,p),'world')}
    dirty=1;save();if(o.fx)o.fx();
  }
  return true;
}
const DECK_MOUNT='deck:mount';
let deckHaulAt=0;
function deckMounted(){return s.portableWinch.mountedAt===DECK_MOUNT}
function deckCanInstall(p){return s.portableWinch.restored&&!s.portableWinch.mountedAt&&p.mount&&p.hatch&&!p.beamMoved}
function portableWinchSanitize(){
  deckHaulAt=0;
  const w=s.portableWinch,p=s.localProgress.deck;
  const restored=w?.restored?1:0;
  const mountedAt=restored&&w.mountedAt===DECK_MOUNT&&p?.mount&&p.hatch&&!p.beamMoved?DECK_MOUNT:null;
  s.portableWinch={restored,discussed:w?.discussed?1:0,mountedAt};
}
const deckWinchTalkReady=()=>!!(s.f.zinovii&&s.localProgress.deck?.winchTaken);
const winchTopicReady=()=>deckWinchTalkReady()&&!s.portableWinch.discussed&&!s.portableWinch.restored;
function winchTalk(){
  if(s.tab!=='home'||s.at||s.dlg.length||!localCanAct()||!winchTopicReady())return;
  dlg({k:'story',winchTalk:1,title:'Механізм із палуби',img:{t:'face',id:'zinovii'},
    body:`<p>${P('Зиновій')} крутить барабан і проводить пальцем по сколених зубцях. ${Q('Руків’я випростаємо. Зубці замінимо, а барабан іще послужить. На верстаку зробиш, покажу як')}.</p>`,
    btns:[['Запам’ятати пораду','dlgok']]});
  save();
}
function confirmWinchTalk(){
  if(!winchTopicReady())return;
  s.portableWinch.discussed=1;
  s.rcSeen={...s.rcSeen,winchRestore:1};
  save();
}
const winchRestoreReady=()=>s.floors.work&&deckWinchTalkReady()&&s.portableWinch.discussed&&!s.portableWinch.restored;
function restoreWinch(){
  s.portableWinch.restored=1;
  say('Ти випрямляєш руків’я й ставиш нові зубці. Барабан прокручується рівно.','find');
  save();
}
const localObservation=(o,p)=>typeof o.text==='function'?o.text(p):o.text;
function localZoneTick(){
  if(!atShore()||s.f.deckSeen||!s.f.wreck||!s.f.rod||(s.c.scrap||0)<12||!localCanAct()||s.dlg.length||s.tutPending.some(tutReady)||!novCan())return;
  s.f.deckSeen=1;novMark();say('За розбитим човном проступає великий корпус. До нахиленої палуби можна дістатися між каменями.','world');dirty=1;save();
}
const localViewSuffix=()=>localCurrent()?'|zone:'+localCurrent():'';
function localEntryButtons(){return localEntries().map(id=>'<div class="act">'+btn(localDef(id).entry,'zoneEnter',id)+'</div>').join('')}
function rLocalZone(){
  const id=localCurrent(),z=localDef(id);
  if(!z)return '';
  const p=localState(id);
  let h='<section><h2>'+z.title()+'</h2><p>'+z.desc+'</p><div class="act">'+btn(z.parent?'Назад':'На берег','zoneBack',id,{cls:'toggle'})+'</div>';
  for(const [k,o] of Object.entries(z.objects||{})){
    const action=!o.ready||o.ready(p)?btn(o.label,'zoneAct',id+':'+k):'';
    const observation=p[k]&&o.text?'<p class="m">'+localObservation(o,p)+'</p>':'';
    if(action||observation)h+='<div class="tdet">'+action+observation+'</div>';
  }
  return h+localEntryButtons()+'</section>';
}
