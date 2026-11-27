/* Сухий пісок нижче плавника, вологий — за уламком біля крайки води. */
const RAKE_POS={dry:[56,98],wet:[263,82]};
const RAKE_EFFECT_MS=800;
const rakeSandFx={};

const rakePatchArt=HI(function(wet,cleared=false){
  const b=pbuf(22,13),seed=wet?734:392;
  const edge=[[0,8],[4,5],[8,4],[13,4],[18,6],[21,8],[18,11],[5,12]];
  polyFill(b,edge,(x,y)=>{
    const speck=hh2(EXX+seed,EXY);
    const tone=wet?['M','N','F']:['N','O','n'];
    pset(b,x,y,speck<.12?tone[2]:speck<.55?tone[1]:tone[0]);
  });
  if(cleared){
    for(let i=0;i<4;i++){
      const x=3+i*4;
      pline(b,x,7,x+3,10,wet?'E':'n');
      pline(b,x+1,7,x+4,10,wet?'G':'m');
    }
  }else{
    pline(b,4,7,9,5,wet?'H':'b');pline(b,9,5,15,6,wet?'G':'m');
    pline(b,8,8,13,7,wet?'E':'n');pline(b,13,7,17,8,wet?'G':'m');
    pset(b,7,9,wet?'u':'h');pset(b,14,9,wet?'6':'b');
  }
  return b;
});
const rakeToolArt=HI(function(){
  const b=pbuf(26,24);
  pline(b,10,16,24,1,'c');pline(b,9,16,23,1,'e');
  pline(b,2,16,16,20,'9');pline(b,2,15,16,19,'q');
  for(let i=0;i<5;i++){
    const x=2+i*3,y=16+Math.floor(i*4/5);
    pline(b,x,y,x-1,y+3,'a');pset(b,x-1,y+3,'p');
  }
  return b;
});
const rakeDustArt=HI(function(wet){
  const b=pbuf(22,13),c=wet?'6':'m';
  for(const[x,y]of[[2,8],[5,4],[7,7],[9,2],[13,5],[15,1],[17,8],[20,4]])pset(b,x,y,c);
  return b;
});
function rakeSandStart(spot,icon){
  const kind=spot.kind,fx={spot,icon,until:Date.now()+RAKE_EFFECT_MS};
  rakeSandFx[kind]=fx;
  if(typeof setTimeout==='function')setTimeout(()=>{
    if(rakeSandFx[kind]===fx){delete rakeSandFx[kind];dirty=1}
  },RAKE_EFFECT_MS);
}
function rakeSandHS(W,H){
  let h='';
  for(const spot of rakeSandVisible()){
    const wet=spot.kind==='wet',[x,y]=RAKE_POS[spot.kind],info=RAKE_SPOTS[spot.kind];
    h+=ob('sand:'+spot.id,'rakeSand',String(spot.id),obURL('rake-sand:'+spot.kind,()=>rakePatchArt(wet)),
      x,y,W,H,info.name,`<b>${info.name}</b><br>${info.hint}`);
  }
  for(const [kind,fx] of Object.entries(rakeSandFx)){
    const wet=kind==='wet';
    if(Date.now()>=fx.until||wet&&!tideLow())continue;
    const [x,y]=RAKE_POS[kind],p=(a,b,w,z)=>PCT(a,b,w,z,W,H);
    const art=(cls,url,box)=>`<img class="${cls}" src="${url}" alt="" style="${box}">`;
    h+=`<div class="rake-sweep" data-sk="sand-sweep:${fx.spot.id}" data-sig="${fx.until}" aria-hidden="true">
      ${art('rake-furrows',pxURL('rake-furrows:'+kind,()=>rakePatchArt(wet,true)),p(x,y,22,13))}
      ${art('rake-dust',pxURL('rake-dust:'+kind,()=>rakeDustArt(wet)),p(x,y-4,22,13))}
      ${art('rake-tool',pxURL('rake-tool',rakeToolArt),p(x-3,y-12,26,24))}
      ${art('rake-reward',icoURL(fx.icon),p(x+8,y+1,10,10))}
    </div>`;
  }
  return h;
}
