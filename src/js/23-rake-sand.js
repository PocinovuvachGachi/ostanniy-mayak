/* Дві ділянки ділять один інтервал активного берега. */
const RAKE_FIRST_ACTIONS=3,RAKE_WAIT_MIN=60,RAKE_WAIT_SPAN=60,RAKE_WET_CHANCE=.5;
const RAKE_SPOTS={
  dry:{name:'Оглянути сухий пісок',hint:'Під сухим піском проступає нерівність.'},
  wet:{name:'Оглянути вологий пісок',hint:'Між мокрим піском і камінням щось зачепилося.'}
};
const RAKE_WEIGHTS={dry:[.75,.95,1],wet:[.60,.80,.90]};
const rakeSandWait=()=>RAKE_WAIT_MIN+Math.round(Math.random()*RAKE_WAIT_SPAN);
function rakeSandMigrate(){
  const sand=s.rakeSand;
  const old=sand.pending;
  if(old&&RAKE_SPOTS[old.kind])sand[old.kind]={id:old.id,kind:old.kind,reward:{scrap:old.scrap}};
  delete sand.pending;
  sand.lastId=Math.max(sand.lastId,sand.searched,sand.dry?.id||0,sand.wet?.id||0);
  return !!old;
}
function rakeBeachAction(){
  if(atShore()&&has('rake'))s.rakeSand.actions=Math.min(RAKE_FIRST_ACTIONS,s.rakeSand.actions+1);
}
function rakeSandVisible(){
  if(!atShore()||!has('rake'))return [];
  const {dry,wet}=s.rakeSand;
  return [dry,tideLow()?wet:null].filter(Boolean);
}
function rakeSandRoll(kind,first){
  const scrap=()=>({reward:{scrap:1+rnd(2)}});
  if(first)return scrap();
  const roll=Math.random(),[metal,wood,coin]=RAKE_WEIGHTS[kind];
  if(roll<metal)return scrap();
  if(roll<wood)return s.seen.wood?{reward:{wood:1+rnd(3)}}:scrap();
  if(roll<coin)return s.tabs.trade?{reward:{coin:1+rnd(2)}}:scrap();
  const finds=[['amberbit','pool'],['seaglass','gather']]
    .filter(([id,source])=>!s.odd[id]&&SHORE_FINDS[source].ready(id));
  return finds.length?{...scrap(),odd:finds[rnd(finds.length)][0]}:scrap();
}
function rakeSandTick(dt,anotherEvent=false){
  // Пропускаємо довгі кроки годинника після сну або фонової вкладки.
  if(dt<=0||dt>1||!atShore()||!has('rake')||s.cb||s.raid||s.dlg.length||s.tutPending.some(tutReady)||away())return;
  const sand=s.rakeSand,low=tideLow();
  if(sand.wet&&!low&&!sand.wetDeferred){
    sand.wetDeferred=true;
    if(!sand.wait)sand.wait=rakeSandWait();
    save();
  }
  if(sand.dry||sand.wet&&low||sand.actions<RAKE_FIRST_ACTIONS)return;
  sand.wait=Math.max(0,sand.wait-dt);
  if(sand.wait||anotherEvent||!novCan())return;
  const first=sand.searched===0&&!sand.lastId;
  const kind=!first&&low&&!sand.wet&&Math.random()<RAKE_WET_CHANCE?'wet':'dry';
  sand[kind]={id:++sand.lastId,kind,...rakeSandRoll(kind,first)};
  if(kind==='wet')sand.wetDeferred=false;
  dirty=1;save();
}
function rakeSandSearch(id){
  const spot=rakeSandVisible().find(o=>String(o.id)===String(id));
  if(!spot||s.cb||s.raid||s.dlg.length)return;
  const sand=s.rakeSand,find=spot.odd&&!s.odd[spot.odd]?spot.odd:null;
  sand[spot.kind]=null;sand.searched++;sand.wait=rakeSandWait();
  if(find)odd(find,'Граблі відкрили знахідку під піском.',{popup:false});
  else{
    for(const [key,amount] of Object.entries(spot.reward))add(key,amount);
    say(`Під піском знайшлося: ${costTxt(spot.reward)}.`,'find');
  }
  if(sand.searched===1)tutRemember('rakeSand');
  dirty=1;save();
  rakeSandStart(spot,find?ODI[find]:Object.keys(spot.reward)[0]);sfx('rakeSand');
}
