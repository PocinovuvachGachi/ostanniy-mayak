
/* Процедурний піксельний інтер'єр/палуба. Всі кнопки сцени й списку використовують один handler. */
const LZW=320,LZH=150;
function localWreckArt(){
  const b=pbuf(43,24);
  polyFill(b,[[0,7],[10,10],[38,6],[42,1],[40,15],[32,22],[10,21]],(x,y)=>pset(b,x,y,y<10?'Y':y<16?'W':'V'));
  for(let y=12;y<20;y+=3)pline(b,9,y,35,y-2,'X');
  prect(b,17,0,3,11,'X');prect(b,16,0,1,8,'Y');
  return b;
}
const DECK_WOOD=['8','c','d','e','b'],DECK_BOARDS=['c','d','d','e','a'];
function localDeckBg(){
  const b=pbuf(LZW,LZH),R=rng(193);
  rampV(b,0,0,LZW,24,['6','5','6','5']);
  rampV(b,0,24,LZW,LZH-24,['4','3','2','3']);
  for(let n=0;n<380;n++){
    const x=Math.floor(R()*LZW),y=25+Math.floor(R()*125),len=1+Math.floor(R()*9);
    prect(b,x,y,len,1,R()<.28?'5':y<55?'3':'4');
    if(y<65&&R()<.18)pset(b,x+len,y+1,'6');
  }
  for(const [x,y,w] of [[0,46,27],[13,58,20],[0,111,33],[293,108,27],[302,75,18]]){
    ppoly(b,[[x,y+8],[x+5,y+2],[x+w/2,y],[x+w-2,y+4],[x+w,y+11],[x+3,y+13]],'2');
    pline(b,x+4,y+3,x+w/2,y,'5');
    pline(b,x+w/2,y+1,x+w-3,y+5,'4');
    pline(b,x+4,y+13,x+w,y+11,'6');
  }
  const hull=[[16,92],[47,43],[83,27],[237,20],[280,30],[310,58],[293,107],[255,138],[76,147],[37,128]];
  ppoly(b,hull.map(([x,y])=>[x,Math.min(LZH,y+6)]),'1');
  polyFill(b,hull,(x,y)=>{
    const row=Math.floor((y+x*.045)/10),edge=((y+x*.045)%10),joint=(x+row*29)%71;
    const speck=hh2(EXX+23,EXY),shade=.44+(row%4)*.075+x*.00048-y*.00155;
    let c=woodC(EXX,EXY,DECK_BOARDS,shade,35+row);
    if(edge<.8||joint<1.4)c='c';
    else if(edge<1.6&&speck>.38)c='e';
    if(speck<.014&&c!=='c')c='a';
    pset(b,x,y,c);
  });
  for(const [x,y] of [[41,94],[73,67],[110,54],[151,51],[188,49],[219,45],[258,45],[281,61],[286,89],[265,114],[230,132],[164,137],[104,140],[62,133]]){
    prect(b,x+2,y+1,5,3,'8');prect(b,x,y-4,4,6,'c');prect(b,x,y-4,2,2,'b');
    pset(b,x+2,y,'a');
  }
  for(let i=0;i<hull.length;i++){
    const [x,y]=hull[i],[u,v]=hull[(i+1)%hull.length];
    pline(b,x,y,u,v,'8');
    pline(b,x,y-1,u,v-1,i<5?'b':'c');
  }
  for(const [i,j] of [[1,2],[2,3],[3,4],[6,7],[8,9]]){
    const [x,y]=hull[i],[u,v]=hull[j];
    for(let n=0;n<4;n++){
      const t=.12+n*.22,a=Math.round(x+(u-x)*t),c=Math.round(y+(v-y)*t);
      prect(b,a,c-7,3,8,'c');prect(b,a,c-7,1,7,'e');
    }
    pline(b,x+3,y-5,u-2,v-5,'d');
  }
  // Обірваний правий борт і темні смуги від вологи.
  ppoly(b,[[277,42],[299,51],[304,58],[297,65],[291,57],[284,56]],'c');
  pline(b,279,42,298,52,'b');pline(b,287,49,293,55,'e');
  for(const [x,y,len] of [[49,112,19],[62,116,15],[185,35,19],[269,99,17],[182,126,23]]){
    pline(b,x,y,x+len,y-2,'8');pline(b,x+3,y+1,x+len-3,y,'a');
  }
  // Під механізмом лишається та сама основа, коли його забрано.
  prect(b,222,73,50,14,'8');prect(b,222,73,50,11,'d');prect(b,223,73,48,1,'b');
  for(const x of [227,263])for(const y of [76,81]){
    prect(b,x,y,3,2,'0');pset(b,x+2,y+2,'a');
  }
  return b;
}
function deckHatchArt(seen){
  const b=pbuf(67,45);
  ppoly(b,[[8,10],[56,6],[62,31],[14,37]],'0');
  ppoly(b,[[11,12],[54,9],[59,29],[16,33]],'c');
  for(let y=13;y<30;y+=5)pline(b,14,y,55,y-3,'d');
  pline(b,9,10,55,6,'b');pline(b,14,36,62,30,'8');
  for(const[x,y] of [[17,12],[18,30],[51,10],[55,26]]){
    prect(b,x,y,3,3,'9');pset(b,x+1,y,'q');
  }
  ppoly(b,[[42,17],[47,16],[48,20],[43,21]],seen?'q':'a');
  pline(b,43,18,46,17,'0');
  if(seen){
    pline(b,7,35,16,41,'n');pline(b,16,41,22,39,'e');pline(b,21,39,24,41,'d');
  }else{
    pline(b,14,23,24,33,'n');pline(b,24,33,34,34,'e');pline(b,34,34,39,27,'n');
    pline(b,32,34,36,37,'d');
  }
  return b;
}
function deckBeamArt(){
  const b=pbuf(67,31);
  ppoly(b,[[1,16],[53,4],[65,9],[65,17],[13,30],[2,27]],'8');
  polyFill(b,[[1,15],[54,2],[65,9],[12,23]],(x,y)=>pset(b,x,y,
    woodC(EXX,EXY,DECK_WOOD,.62+(y<9?.1:0),43)));
  ppoly(b,[[12,23],[65,9],[65,15],[12,29]],'c');
  ppoly(b,[[1,15],[12,23],[12,29],[1,23]],'d');
  pline(b,3,15,52,3,'b');pline(b,15,23,62,11,'e');
  return b;
}
function deckRopeArt(){
  const b=pbuf(64,32);
  pline(b,0,2,57,25,'8');pline(b,1,1,57,24,'d');
  pline(b,56,25,61,20,'e');pline(b,61,20,63,23,'c');
  return b;
}
function deckWinchFootArt(){
  const b=pbuf(56,40);
  ppoly(b,[[5,31],[27,29],[52,26],[52,35],[36,39],[7,39]],'8');
  ppoly(b,[[8,29],[45,25],[50,30],[48,33],[10,37]],'d');
  pline(b,11,34,48,28,'e');
  return b;
}
function deckMountArt(seen,installed=false){
  const b=pbuf(48,48);
  ppoly(b,[[1,36],[23,30],[46,36],[38,45],[10,46]],'8');
  ppoly(b,[[3,34],[23,29],[43,34],[36,42],[9,43]],'c');
  pline(b,7,34,33,31,'b');
  ppoly(b,[[13,5],[18,0],[26,4],[31,2],[34,36],[22,41],[11,34]],'c');
  polyFill(b,[[13,5],[18,0],[26,4],[31,2],[32,33],[22,38],[12,32]],(x,y)=>pset(b,x,y,
    woodC(EXX,EXY,DECK_WOOD,.78-(x-12)/50,54)));
  pline(b,14,8,13,31,'b');pline(b,22,7,24,32,'c');
  ppoly(b,[[11,23],[20,27],[33,21],[33,27],[20,33],[11,28]],seen?'p':'9');
  pline(b,12,23,20,27,seen?'q':'a');pline(b,20,27,33,22,seen?'q':'a');
  if(seen){
    pline(b,31,24,40,22,'a');pline(b,40,22,43,25,'q');pline(b,43,25,40,29,'p');
    pline(b,40,29,33,30,'9');pset(b,13,27,'q');
  }else{
    for(const [x,y] of [[13,26],[18,28],[25,27],[32,24]]){
      pline(b,x,y,x+6,y+6,'k');pline(b,x+1,y,x+6,y+4,'l');
    }
  }
  if(installed){
    ppoly(b,[[24,23],[39,20],[47,28],[44,40],[22,42]],'8');
    ppoly(b,[[25,26],[41,23],[44,33],[40,37],[24,38]],'p');
    for(let x=27;x<39;x+=3)pline(b,x,25,x+3,35,x%2?'e':'c');
    ppoly(b,[[39,24],[45,24],[47,28],[46,34],[42,36],[38,32],[37,27]],'9');
    pline(b,42,29,46,19,'q');pline(b,45,19,47,18,'c');
    pset(b,42,29,'a');
  }
  return b;
}
function deckWinchArt(seen){
  const b=deckWinchFootArt();
  for(const x of [11,37]){
    ppoly(b,[[x,11],[x+5,9],[x+10,29],[x,32]],'9');
    pline(b,x+2,13,x+2,28,'p');pset(b,x+3,26,'q');
  }
  ppoly(b,[[13,13],[37,9],[44,17],[44,25],[35,29],[14,27]],'8');
  ppoly(b,[[15,13],[35,10],[39,16],[39,24],[35,26],[15,25]],'9');
  for(let x=17;x<=35;x+=4){pline(b,x,14,x+2,24,'n');pline(b,x+1,13,x+3,24,'d')}
  ppoly(b,[[34,9],[41,9],[44,13],[48,12],[50,18],[48,20],[50,24],[44,27],[38,26],[34,23]],seen?'a':'9');
  ppoly(b,[[39,14],[44,14],[47,18],[44,23],[39,23],[37,19]],'8');
  pline(b,40,18,48,12,seen?'q':'p');pline(b,48,12,45,6,'p');pline(b,45,6,51,4,'n');
  prect(b,49,3,6,3,'c');pset(b,51,3,'e');
  for(const [x,y] of seen?[[43,11],[46,16],[39,10],[21,16]]:[[17,15],[18,16],[21,15],[26,17],[31,14],[41,12],[46,24]]){
    pset(b,x,y,seen?'q':'6');
  }
  return b;
}
function localPlanksArt(seen){
  const b=pbuf(54,26);
  const colors=seen?['e','b','d']:['d','e','c'];
  for(const [i,y] of [3,10,17].entries()){
    ppoly(b,[[i*2,y+3],[45+i*2,y],[50+i,y+4],[8+i*2,y+8]],colors[0]);
    pline(b,5+i*2,y+6,46+i,y+2,colors[1]);
    pline(b,8+i*2,y+8,50+i,y+4,colors[2]);
    prect(b,14+i*3,y+5,2,2,'9');pset(b,15+i*3,y+5,seen?'q':'a');
  }
  return b;
}
function localExitArt(){
  const b=pbuf(38,24);
  ppoly(b,[[1,4],[27,4],[37,19],[37,24],[13,24]],'8');
  for(let n=0;n<5;n++){
    const x=n*3,y=2+n*4;
    prect(b,x,y,26,3,'d');prect(b,x,y,26,1,'b');
    pset(b,x+1,y+2,'a');pset(b,x+23,y+2,'c');
  }
  pline(b,0,1,12,19,'e');pline(b,26,1,37,19,'e');
  return b;
}
function localEntryHS(W,H){
  return localEntries().map(id=>{
    const z=localDef(id);
    if(!z.entryArt)return '';
    return ob('zone:enter:'+id,'zoneEnter',id,obURL('zone:entry:'+id,()=>HI(z.entryArt)()),z.entryX,z.entryY,W,H,z.entry,'<b>'+z.entry+'</b>',{pulse:1});
  }).join('');
}
const DECK_HAUL_MS=950;
function deckScenery(p){
  const moving=deckHaulAt&&Date.now()-deckHaulAt<DECK_HAUL_MS;
  const beamPosition=p.beamMoved?[113,101]:[131,68];
  const age=moving?Date.now()-deckHaulAt:0;
  const anim=moving?'--haul-age:-'+age+'ms;--haul-duration:'+DECK_HAUL_MS+'ms;':'';
  const layer=(key,art,x,y,w,h,cls='',z=125)=>`<img class="deck-prop ${cls}" data-sk="${key}" data-sig="${cls||key}" src="${pxURL(key,()=>HI(art)())}" style="${anim}${PCT(x,y,w,h,LZW,LZH)};z-index:${z}" alt="" aria-hidden="true">`;
  let h=layer('deck-beam',deckBeamArt,...beamPosition,67,31,p.beamMoved?(moving?'deck-hauling':'deck-shifted'):'');
  if(deckMounted()||moving)h+=layer('deck-rope',deckRopeArt,118,66,64,32,moving?'deck-unreeve':'',122);
  if(moving)h+=layer('deck-working',()=>deckMountArt(true,true),76,43,48,48,'deck-unreeve',103);
  if(p.winchTaken||s.portableWinch.restored)h+=layer('deck-empty-foot',deckWinchFootArt,219,48,56,40,'',91);
  return h;
}
function localZoneScene(){
  const id=localCurrent(),z=localDef(id);
  if(!z)return '';
  const W=LZW,H=LZH,p=localState(id);
  let h='<span data-sk="bg" data-sig="bg" class="scbg">'+VH(()=>pimg(pxURL('zone:bg:'+id,()=>HI(z.background)()),960,450,'scene',z.title()))+'</span>';
  if(id==='deck')h+=deckScenery(p);
  h+=ob('zone:back:'+id,'zoneBack',id,obURL('zone:exit',()=>HI(localExitArt)()),26,96,W,H,z.parent?'Назад':'На берег','<b>Вихід</b>');
  for(const [k,o] of Object.entries(z.objects||{})){
    if(o.ready&&!o.ready(p)||!o.art)continue;
    const seen=!!p[k],art=obURL('zone:obj:'+id+':'+k+':'+Number(seen),()=>HI(o.art)(seen));
    const tip='<b>'+o.label+'</b>'+(seen&&o.text?'<br>'+localObservation(o,p):'');
    h+=ob('zone:'+id+':'+k,'zoneAct',id+':'+k,art,o.x,o.y,W,H,o.label,tip);
  }
  h+=localEntryHS(W,H);
  return '<div class="scn" data-scn="zone-'+id+'" style="'+scnD()+'">'+h+'</div>';
}
