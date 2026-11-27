/* Латунь, темне дерево й чотири піктограми засувки. */
function navigatorDoorArt(marked=false,open=false){
  const b=pbuf(51,60);
  ppoly(b,[[2,10],[46,1],[49,53],[5,58]],'8');
  ppoly(b,[[5,12],[42,5],[43,50],[8,55]],open?'0':'c');
  for(let x=10;x<43;x+=8)pline(b,x,14,x+1,51,open?'0':'d');
  pline(b,5,12,8,55,'a');pline(b,6,11,43,4,'d');
  if(open){
    ppoly(b,[[35,8],[49,2],[49,50],[36,56]],'d');
    pline(b,36,11,37,53,'e');
    pline(b,12,50,34,48,'9');
  }else{
    pline(b,8,23,42,17,'9');pline(b,8,43,43,36,'9');
    ppoly(b,[[13,28],[35,24],[38,34],[14,38]],marked?'e':'9');
    for(const x of [19,25,31])prect(b,x,29,3,4,marked?'g':'a');
  }
  return b;
}
function navigatorSymbol(b,index,x,y){
  const c='h';
  if(index===0){ // Якір
    prect(b,x+7,y,3,3,c);pline(b,x+8,y+3,x+8,y+15,c);pline(b,x+4,y+5,x+12,y+5,c);
    pline(b,x+1,y+10,x+4,y+14,c);pline(b,x+4,y+14,x+12,y+14,c);pline(b,x+12,y+14,x+15,y+10,c);
  }else if(index===1){ // Хвиля
    for(const dy of [1,8]){
      pline(b,x,y+dy+6,x+5,y+dy+2,c);pline(b,x+5,y+dy+2,x+12,y+dy+4,c);
      pline(b,x+12,y+dy+4,x+16,y+dy+1,c);
    }
  }else if(index===2){ // Зірка
    ppoly(b,[[x+8,y],[x+10,y+6],[x+16,y+8],[x+10,y+10],[x+8,y+16],[x+6,y+10],[x,y+8],[x+6,y+6]],c);
  }else{ // Маяк
    ppoly(b,[[x+5,y+16],[x+6,y+6],[x+4,y+5],[x+8,y+1],[x+12,y+5],[x+10,y+6],[x+12,y+16]],c);
    prect(b,x+8,y+6,2,3,'c');pline(b,x+12,y+6,x+16,y+4,c);pline(b,x+1,y+4,x+4,y+6,c);
  }
}
function navigatorRingArt(index){
  const b=pbuf(37,36);
  polyFill(b,[[10,2],[26,2],[34,10],[34,26],[26,33],[10,33],[3,26],[3,10]],(x,y)=>pset(b,x,y,y<18?'a':'8'));
  ppoly(b,[[11,5],[25,5],[31,11],[31,24],[25,30],[11,30],[6,24],[6,11]],'d');
  ppoly(b,[[12,8],[24,8],[28,12],[28,23],[24,27],[12,27],[9,23],[9,12]],'c');
  navigatorSymbol(b,index,10,10);
  return b;
}
function navigatorLatchArt(stuck){
  const b=pbuf(34,38);
  ppoly(b,[[5,6],[29,6],[30,30],[8,33],[4,26]],'9');
  prect(b,9,11,16,13,'c');prect(b,10,12,14,2,'e');
  pline(b,11,24,25,stuck?15:21,stuck?'n':'g');
  prect(b,22,stuck?14:20,5,5,'a');
  return b;
}
function navigatorLockPlate(){
  const b=pbuf(175,51);
  ppoly(b,[[1,4],[171,4],[174,44],[0,50]],'8');
  ppoly(b,[[4,7],[167,7],[168,41],[4,44]],'c');
  pline(b,4,8,168,8,'a');pline(b,5,43,169,40,'d');
  prect(b,8,17,2,15,'h'); // Початок читання кілець.
  for(const x of [5,165]){pset(b,x,12,'e');pset(b,x,37,'e')}
  return b;
}
function navigatorHoldScenery(p){
  const W=LZW,H=LZH;
  if(navLockReady(p))return ob('navigator:plate','','',obURL('nav:plate',()=>HI(navigatorLockPlate)()),134,20,W,H,'','',{z:10});
  if(navDoorSeen()&&holdLight()!=='storm'&&!p.navOpen)return ob('navigator:closed','','',obURL('nav:closed',()=>HI(navigatorDoorArt)()),258,11,W,H,'','');
  return '';
}

function navigatorRoomBg(){
  const b=pbuf(LZW,LZH,'0'),R=rng(217);
  ppoly(b,[[12,12],[299,3],[311,91],[0,103]],'8');
  ppoly(b,[[0,103],[311,91],[320,150],[0,150]],'c');
  for(let y=28;y<102;y+=9){
    pline(b,8,y,306,y-7,'0');pline(b,9,y+2,306,y-5,'9');
  }
  for(let x=-34;x<360;x+=31)pline(b,165+(x-165)*.67,96,x,150,'d');
  for(let i=0;i<850;i++){
    const x=Math.floor(R()*320),y=Math.floor(R()*150),under=pget(b,x,y);
    if(under==='8'||under==='c')prect(b,x,y,1+(R()<.25?2:0),1,under==='8'?'9':'8');
  }
  for(const [x,y] of [[9,17],[85,13],[235,6],[298,0]]){
    ppoly(b,[[x,y],[x+12,y],[x+14,y+93],[x+3,y+98]],'0');
    pline(b,x+8,y+1,x+10,y+88,'c');pline(b,x+9,y+9,x+12,y+89,'d');
  }
  ppoly(b,[[0,1],[320,0],[320,13],[134,26],[0,16]],'0');
  pline(b,0,14,134,25,'9');pline(b,134,25,319,12,'9');
  ppoly(b,[[201,34],[238,29],[243,37],[204,43]],'c');
  pline(b,204,43,243,37,'d');
  return b;
}
function navigatorTableArt(seen){
  const b=pbuf(61,53);
  ppoly(b,[[3,11],[47,4],[60,12],[16,22]],'d');
  ppoly(b,[[16,22],[60,12],[60,20],[16,29]],'c');
  pline(b,8,13,47,6,'e');pline(b,19,22,56,14,'a');
  for(const [x,y] of [[12,24],[46,20]]){
    ppoly(b,[[x,y],[x+6,y],[x+5,y+25],[x,y+27]],'8');
    pline(b,x+2,y,x+1,y+22,'d');
  }
  for(let x=24;x<52;x+=5)pset(b,x,21-(x-24)/4,seen?'a':'9');
  return b;
}
function navigatorChestArt(open){
  const b=pbuf(52,44);
  ppoly(b,[[2,22],[37,15],[50,23],[50,35],[13,43],[3,38]],'8');
  ppoly(b,[[4,22],[36,16],[48,23],[14,31]],open?'0':'d');
  ppoly(b,[[14,31],[48,23],[48,33],[14,41]],'c');
  for(const x of [20,37])pline(b,x,29-(x-20)/5,x,38-(x-20)/5,'a');
  if(open){
    ppoly(b,[[4,23],[5,11],[36,3],[36,16]],'c');pline(b,6,11,35,4,'e');
    pline(b,8,24,35,18,'9');
  }else{
    pline(b,7,24,36,18,'e');prect(b,27,29,6,4,'9');pset(b,29,30,'g');
  }
  return b;
}
function navigatorRoomScenery(p){
  const W=LZW,H=LZH,storm=holdLight()==='storm';
  const chest=p.navCache?ob('nav:empty','','',obURL('nav:empty',()=>HI(navigatorChestArt)(true)),177,73,W,H,'',''):'';
  const glow=storm?{x:114,y:71,r:219,e:.6,c:[192,216,209],n:4}:{x:110,y:84,r:155,e:.63,c:WARM,n:4};
  return chest+lightLayers(W,H,{fire:storm?[]:[glow],win:storm?[glow]:[]});
}
