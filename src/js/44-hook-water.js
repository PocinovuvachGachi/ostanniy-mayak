/* Вантаж іде за крайкою води у вільній смузі між бродом і вудкою. */
const HOOK_WATER_X=130,HOOK_PULL_MS=980,HOOK_LIMIT_MS=780;
const hookWaterY=t=>55-16*shoreTideLevel(t);
let hookPullFx=null;
ICO.hookUp=['............','.......qq...','......q..q..','......p..7..','......q7q...','.....pa.....','....dp......','...de.......','..de........','.de.........','..c.........','............'];

const hookBankArt=HI(function(){
  const b=pbuf(23,11);
  polyFill(b,[[0,2],[6,0],[13,2],[19,1],[22,5],[20,8],[14,10],[5,8]],(x,y)=>{
    const shade=hh2(EXX,EXY);
    pset(b,x,y,y>6?'M':shade<.12?'G':shade<.3?'D':y<3?'G':'F');
  });
  pline(b,3,5,10,7,'E');pline(b,12,5,20,4,'E');pset(b,17,8,'N');
  return b;
});

const hookFloatArt=HI(function(kind,grounded=false,freed=false){
  const b=pbuf(26,19);
  if(grounded){
    polyFill(b,[[0,16],[4,12],[13,14],[19,12],[25,15],[24,18],[4,18]],(x,y)=>pset(b,x,y,y<16?'G':'E'));
    pline(b,4,17,17,17,'M');pset(b,19,17,'N');pset(b,24,16,'M');
  }else if(!freed){
    prect(b,1,15,23,2,'Q');prect(b,3,16,19,1,'U');prect(b,1,17,6,1,'T');prect(b,19,14,6,1,'U');
  }
  if(kind==='plank'){
    polyFill(b,[[2,12],[7,8],[23,7],[24,11],[18,14],[3,14]],(x,y)=>pset(b,x,y,y>11?'W':'e'));
    pline(b,3,11,22,8,'m');pline(b,7,12,19,10,'d');pset(b,9,12,'c');pset(b,19,11,'c');
  }else if(kind==='tackle'){
    pline(b,3,14,22,12,'c');pline(b,4,13,21,11,'m');
    for(const[x,y]of[[6,11],[11,9],[17,10]]){prect(b,x,y,4,3,'W');prect(b,x+1,y,2,2,'n');pset(b,x+2,y+2,'Y')}
    pline(b,20,10,22,13,'p');pset(b,21,13,'q');
  }else if(kind==='bottle'){
    polyFill(b,[[4,12],[8,8],[15,9],[18,7],[21,8],[22,11],[17,13],[8,15]],(x,y)=>pset(b,x,y,y>11?'Z':'l'));
    pline(b,5,11,13,9,'6');prect(b,10,10,5,3,'b');pset(b,23,8,'e');pset(b,22,9,'d');
  }else{
    const heavy=kind==='heavy',x=heavy?4:6,y=heavy?3:7,w=heavy?18:14,h=heavy?12:8;
    if(heavy&&grounded&&!freed){polyFill(b,[[0,15],[3,8],[7,10],[9,17],[2,18]],(a,c)=>pset(b,a,c,c<12?'H':'F'));
      polyFill(b,[[19,16],[22,9],[25,12],[25,17]],(a,c)=>pset(b,a,c,c<13?'G':'E'))}
    prect(b,x,y,w,h,'W');prect(b,x,y,w,2,'Y');prect(b,x+1,y+3,w-2,1,'d');prect(b,x+1,y+h-2,w-2,1,'c');
    for(const k of[2,w-4]){prect(b,x+k,y,2,h,heavy?'9':'e');pset(b,x+k,y+2,heavy?'q':'m')}
    if(heavy){prect(b,x+7,y+4,4,3,'a');pset(b,x+8,y+5,'0')}
  }
  return b;
});
const hookPullToolArt=HI(function(up,bent){
  const b=pbuf(32,41);
  if(bent){
    pline(b,23,11,17,25,'c');pline(b,17,25,2,39,'c');
    pline(b,24,11,18,25,'e');pline(b,18,25,3,39,'e');
  }else{
    pline(b,23,11,1,39,'c');pline(b,24,11,2,39,'e');
  }
  if(up){pline(b,22,11,0,39,'d');prect(b,20,12,4,4,'a');pset(b,22,13,'q')}
  pline(b,24,12,27,8,up?'q':'9');pline(b,27,8,26,5,up?'q':'a');
  pline(b,26,5,23,4,up?'7':'p');pset(b,22,5,'q');
  return b;
});
function hookPullStart(o,time,effort,blocked){
  const duration=blocked?HOOK_LIMIT_MS:HOOK_PULL_MS;
  const effect={o,up:!!s.f.hookUp,blocked,effort,y:hookWaterY(time),grounded:shoreTideLevel(time)>=.5,until:Date.now()+duration};
  hookPullFx=effect;
  if(typeof setTimeout==='function')setTimeout(()=>{
    if(hookPullFx===effect){hookPullFx=null;dirty=1}
  },duration);
}
function hookWaterHS(W,H){
  const o=hookWaterVisible(),t=tidePhase(),grounded=shoreTideLevel(t)>=.5;
  const x=HOOK_WATER_X;
  let h='';
  if(o){
    const limit=o.kind==='heavy'&&s.f.hookLimitSeen&&!s.f.hookUp;
    const tip=hookWaterHint(o)+(limit?'<br>Проста жердина прогинається під натягом.':'');
    const cls=grounded?'hook-water hook-ground':'hook-water hook-float';
    const y=hookWaterY(t);
    if(grounded)h+=ob('hook-bank:'+o.id,'','',obURL('hook-bank',hookBankArt),x+2,y+14,W,H,'','',{z:55});
    h+=ob('flot:hook:'+o.id,'hookWater',String(o.id),obURL('hookfloat:'+o.kind+':'+Number(grounded),()=>hookFloatArt(o.kind,grounded)),
      x,y,W,H,hookWaterLabel(o),`<b>${HOOK_FLOAT[o.kind].n}</b><br>${tip}`,
      {cls,inner:grounded?'':'<i class="hook-wake" aria-hidden="true"></i>'});
  }
  const fx=hookPullFx;
  if(!fx||Date.now()>=fx.until||s.flot)return h;
  const y=fx.y,p=(a,b,w,z)=>PCT(a,b,w,z,W,H);
  const tool=pxURL(`hook-pull:${Number(fx.up)}:${Number(fx.blocked)}`,()=>hookPullToolArt(fx.up,fx.blocked));
  const cargo=fx.blocked?'':`<img class="hook-cargo" src="${pxURL('hook-cargo:'+fx.o.kind,()=>hookFloatArt(fx.o.kind,false,true))}" alt="" style="${p(x,y,26,19)}">`;
  return h+`<div class="hook-pull hook-${fx.effort}${fx.blocked?' hook-limit':''}${fx.up?' hook-reinforced':''}" data-sk="hook-pull:${fx.o.id}" data-sig="${fx.until}" aria-hidden="true">
    <i class="${fx.grounded?'hook-grit':'hook-splash'}" style="${p(x+3,y+8,22,9)}"></i>
    ${cargo}<img class="hook-tool" src="${tool}" alt="" style="${p(x-14,y+3,32,41)}">
  </div>`;
}
