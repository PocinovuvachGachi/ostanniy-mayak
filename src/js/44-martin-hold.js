/* Трюм «Мартина». Геометрія однакова під обома переносними джерелами світла. */
function deckOpenArt(){
  const b=pbuf(67,45);
  ppoly(b,[[7,14],[54,9],[63,33],[13,39]],'8');
  ppoly(b,[[11,16],[53,12],[58,30],[15,35]],'0');
  pline(b,13,36,62,31,'d');pline(b,8,15,13,36,'a');
  for(let step=0;step<4;step++){
    const x=16+step*5,y=31-step*4;
    pline(b,x,y,x+26-step*2,y-2,['d','c','9','1'][step]);
  }
  ppoly(b,[[8,15],[10,4],[55,0],[54,10]],'c');
  pline(b,10,5,54,1,'e');pline(b,10,10,54,5,'d');
  prect(b,17,10,3,5,'9');prect(b,44,8,3,4,'a');
  return b;
}
function martinHoldBg(){
  const b=pbuf(LZW,LZH,'0'),R=rng(571);
  const wall=[[0,1],[319,1],[303,70],[262,98],[63,98],[17,71]];
  const floor=[[17,71],[63,98],[262,98],[303,70],[320,150],[0,150]];
  ppoly(b,wall,'8');ppoly(b,floor,'c');
  for(let y=13;y<96;y+=10){
    const edge=Math.max(0,(y-23)*.55);
    pline(b,edge,y,320-edge,y-3,'0');
    pline(b,edge+2,y+2,317-edge,y-1,y<65?'9':'c');
  }
  for(let x=-94;x<440;x+=32){
    pline(b,162+(x-162)*.50,96,x,149,'8');
    pline(b,165+(x-162)*.50,96,x+3,149,'d');
  }
  for(let i=0;i<1200;i++){
    const x=Math.round(319*R()),y=Math.round(149*R()),under=pget(b,x,y);
    const mark=under==='8'?'9':under==='c'?(R()<.45?'8':'d'):'';
    if(mark)prect(b,x,y,1+(R()<.2?2:0),1,mark);
  }
  for(const [x,lean] of [[38,22],[88,13],[154,2],[218,-12],[283,-24]]){
    ppoly(b,[[x-4,0],[x+8,0],[x+9,51],[x+lean+7,100],[x+lean-4,102],[x-6,56]],'0');
    ppoly(b,[[x,0],[x+6,0],[x+6,51],[x+lean+4,96],[x+lean-1,97],[x-1,55]],'c');
    pline(b,x,2,x-1,54,'d');pline(b,x-1,54,x+lean-1,96,'9');
    pset(b,x+3,60,'a');pset(b,x+lean,90,'a');
  }
  for(const [x,y,w] of [[91,130,47],[246,126,35],[281,143,22],[150,111,30]]){
    ppoly(b,[[x,y],[x+w-5,y-2],[x+w,y+2],[x+7,y+4]],'1');
    pline(b,x+8,y,x+w-12,y-1,'3');pset(b,x+w-13,y-1,'4');
  }
  ppoly(b,[[0,0],[320,0],[319,11],[179,20],[50,16],[0,7]],'0');
  pline(b,3,8,179,18,'9');pline(b,179,18,318,9,'9');
  return b;
}
function holdLadderArt(){
  const b=pbuf(45,66);
  ppoly(b,[[4,0],[18,0],[20,56],[11,65],[3,63]],'8');
  pline(b,12,1,5,64,'d');pline(b,31,1,34,63,'d');
  for(let y=8;y<62;y+=9){
    pline(b,11-y/12,y,30+y/24,y-1,'c');pline(b,11-y/12,y-2,30+y/24,y-3,'a');
  }
  pline(b,10,0,3,64,'e');pline(b,33,0,38,63,'9');
  return b;
}
function holdRibArt(seen){
  const b=pbuf(38,40);
  ppoly(b,[[8,0],[19,0],[23,14],[30,31],[26,37],[16,34],[11,20]],'c');
  pline(b,9,1,13,19,'d');pline(b,13,19,21,34,'d');
  prect(b,16,17,4,3,'8');pset(b,17,17,'a');
  pline(b,27,25,35,31,seen?'b':'9');pline(b,30,27,36,26,seen?'a':'8');
  return b;
}
function holdBarrelArt(seen){
  const b=pbuf(56,39);
  for(const [x,y,w,h] of [[26,0,24,33],[2,11,28,27]]){
    ppoly(b,[[x,y+6],[x+5,y+2],[x+w-5,y+2],[x+w,y+6],[x+w-2,y+h-3],[x+4,y+h-1]],'d');
    ppoly(b,[[x,y+5],[x+6,y],[x+w-6,y],[x+w,y+5],[x+w-5,y+9],[x+5,y+10]],'9');
    for(let k=6;k<w-2;k+=4)pline(b,x+k,y+9,x+k-1,y+h-3,k%3?'c':'e');
    for(const dy of [10,h-8]){
      pline(b,x+1,y+dy,x+w-2,y+dy-1,'8');pline(b,x+2,y+dy+2,x+w-3,y+dy+1,'9');
    }
    pline(b,x+5,y+3,x+w-5,y+2,seen?'b':'a');
  }
  return b;
}
function holdRatsArt(){
  const b=pbuf(62,27);
  for(const [x,y] of [[2,17],[25,13],[41,23]]){
    pline(b,x,y+1,x+5,y+4,'n');pline(b,x+5,y+4,x+9,y,'9');
    ppoly(b,[[x+7,y],[x+9,y-6],[x+15,y-7],[x+20,y-2],[x+19,y+2],[x+9,y+2]],'a');
    ppoly(b,[[x+14,y-3],[x+17,y-6],[x+22,y-3],[x+22,y],[x+17,y+1]],'9');
    pset(b,x+17,y-6,'n');pset(b,x+20,y-3,'g');pset(b,x+22,y,'n');
    pline(b,x+8,y+2,x+20,y+2,'8');
  }
  return b;
}
function martinHoldScenery(){
  const W=LZW,H=LZH,light=holdLight(),storm=light==='storm';
  let h=s.f.rats?'':ob('hold:barrels','','',obURL('hold:barrels',()=>HI(holdBarrelArt)(false)),204,77,W,H,'','');
  const glow=storm
    ?{x:97,y:78,r:230,e:.54,c:[192,216,209],a:.8,n:4}
    :{x:104,y:91,r:146,e:.62,c:WARM,a:.76,n:4};
  h+=lightLayers(W,H,{fire:storm?[]:[glow],win:storm?[glow]:[]});
  return h+navigatorHoldScenery(localState('hold'));
}
