
/* Локальні зони: контекст батьківської вкладки/місця, реєстр, збережені результати.
   Дочірня зона не є точкою глобальної мапи. Ідентифікатори дій містять ID зони. */
const LOCAL_OUTDOOR_ACTIONS=new Set(['gather','scrapw','hook','hookWater','rakeSand','fishing','pool','mussels','ford','shfgo','rune','crabRetry','drybuild','dryload','drytake','rodReach','fishBite','bite','flot','flotmg','exp','trade']);
const LOCAL_ZONES={
  deck:{tab:'shore',at:'',parent:'',title:()=>s.f.zinovii?'Палуба «Мартина»':'Палуба уламка',
    entry:'Піднятися на палубу',ready:()=>!!s.f.deckSeen,
    desc:'Між камінням лежить більший корпус. Палуба нахилена до води; дошки скриплять під ногами.',
    objects:{planks:{label:'Оглянути обшивку',text:'Під шаром солі видно товсті дошки й зігнуті залізні скоби. Цей корпус більший за човни, розбиті в прибої.',x:177,y:88,art:()=>localPlanksArt()}},
    background:()=>localDeckBg(),entryArt:()=>localWreckArt(),entryX:270,entryY:16}
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
const localCanAct=()=>!s.cb&&!s.raid&&!s.dlg.length;
const localEntries=()=>Object.keys(LOCAL_ZONES).filter(id=>localContext(id)&&(LOCAL_ZONES[id].parent||'')===localCurrent());
function localSwitch(id){s.localZone=id;popB='';dirty=1;save()}
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
  const o=z.objects[k];if(o.ready&&!o.ready())return false;
  const p=localState(id);
  if(!p[k]){p[k]=1;if(o.run)o.run(p);dirty=1;save()}
  return true;
}
function localZoneTick(){
  if(!atShore()||s.f.deckSeen||!s.f.wreck||!s.f.rod||(s.c.scrap||0)<12||!localCanAct()||s.tutPending.some(tutReady)||!novCan())return;
  s.f.deckSeen=1;novMark();say('За розбитим човном проступає великий корпус. До нахиленої палуби можна дістатися між каменями.','world');dirty=1;save();
}
const localViewSuffix=()=>localCurrent()?'|zone:'+localCurrent():'';
function localEntryButtons(){return localEntries().map(id=>'<div class="act">'+btn(localDef(id).entry,'zoneEnter',id)+'</div>').join('')}
function rLocalZone(){
  const id=localCurrent(),z=localDef(id),p=localState(id);
  if(!z)return '';
  let h='<section><h2>'+z.title()+'</h2><p>'+z.desc+'</p><div class="act">'+btn(z.parent?'Назад':'На берег','zoneBack',id,{cls:'toggle'})+'</div>';
  for(const [k,o] of Object.entries(z.objects||{})){
    if(o.ready&&!o.ready())continue;
    h+='<div class="tdet">'+btn(o.label,'zoneAct',id+':'+k)+(p[k]?'<p class="m">'+o.text+'</p>':'')+'</div>';
  }
  return h+localEntryButtons()+'</section>';
}
