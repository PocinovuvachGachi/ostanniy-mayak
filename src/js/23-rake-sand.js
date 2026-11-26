/* Пошук граблями прив’язаний до ділянки, яку можна оглянути один раз. */
const RAKE_FIRST_ACTIONS=3,RAKE_WAIT_MIN=60,RAKE_WAIT_SPAN=60,RAKE_WET_CHANCE=.5;
const RAKE_SPOTS={
  dry:{name:'Оглянути сухий пісок',hint:'Під сухим піском проступає нерівність.'},
  wet:{name:'Оглянути вологий пісок',hint:'Між мокрим піском і камінням щось зачепилося.'}
};
function rakeBeachAction(){
  if(atShore()&&has('rake'))s.rakeSand.actions=Math.min(RAKE_FIRST_ACTIONS,s.rakeSand.actions+1);
}
function rakeSandVisible(){
  const spot=s.rakeSand.pending;
  return atShore()&&has('rake')&&spot&&(spot.kind==='dry'||tideLow())?spot:null;
}
function rakeSandTick(dt,anotherEvent=false){
  const sand=s.rakeSand;
  if(atShore()&&rakeSandVisible()!==renderedRakeSand)dirty=1;
  // Пропускаємо довгі кроки годинника після сну або фонової вкладки.
  if(dt<=0||dt>1||!atShore()||!has('rake')||s.cb||s.raid||s.dlg.length||s.tutPending.some(tutReady)||away())return;
  if(sand.pending||sand.actions<RAKE_FIRST_ACTIONS)return;
  sand.wait=Math.max(0,sand.wait-dt);
  if(sand.wait||anotherEvent||!novCan())return;
  const kind=sand.searched&&tideLow()&&Math.random()<RAKE_WET_CHANCE?'wet':'dry';
  sand.pending={id:sand.searched+1,kind,scrap:1+rnd(2)};
  dirty=1;save();
}
function rakeSandSearch(id){
  const spot=rakeSandVisible();
  if(!spot||String(spot.id)!==String(id)||s.cb||s.raid||s.dlg.length)return;
  const sand=s.rakeSand;
  sand.pending=null;sand.searched++;sand.wait=RAKE_WAIT_MIN+Math.round(Math.random()*RAKE_WAIT_SPAN);
  add('scrap',spot.scrap);
  say(`Між зубцями граблів лишився метал. ${costTxt({scrap:spot.scrap})}.`,'find');
  if(sand.searched===1)tutRemember('rakeSand');
  dirty=1;save();
  rakeSandStart(spot);sfx('rakeSand');
}
