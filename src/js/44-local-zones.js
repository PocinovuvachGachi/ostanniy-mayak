
/* Процедурний піксельний інтер'єр/палуба. Всі кнопки сцени й списку використовують один handler. */
const LZW=320,LZH=150;
function localWreckArt(){
  const b=pbuf(43,24);
  polyFill(b,[[0,7],[10,10],[38,6],[42,1],[40,15],[32,22],[10,21]],(x,y)=>pset(b,x,y,y<10?'Y':y<16?'W':'V'));
  for(let y=12;y<20;y+=3)pline(b,9,y,35,y-2,'X');
  prect(b,17,0,3,11,'X');prect(b,16,0,1,8,'Y');
  return b;
}
function localDeckBg(){
  const b=pbuf(LZW,LZH);
  rampV(b,0,0,LZW,LZH,['T','S','R','Q']);
  for(let y=8;y<150;y+=13)pline(b,0,y,319,y+2,'T');
  polyFill(b,[[12,78],[47,18],[263,15],[310,65],[272,138],[50,141]],(x,y)=>pset(b,x,y,y%13<2?'X':((Math.floor(y/13)+Math.floor(x/45))%2?'W':'Y')));
  for(let y=27;y<136;y+=13)for(let x=64+(y%4)*5;x<265;x+=51)pline(b,x,y,x,y+10,'V');
  pline(b,12,78,47,18,'V');pline(b,47,18,263,15,'Y');pline(b,263,15,310,65,'V');pline(b,310,65,272,138,'V');pline(b,272,138,50,141,'V');pline(b,50,141,12,78,'V');
  prect(b,88,24,5,42,'X');prect(b,88,24,2,42,'Y');
  pline(b,27,77,60,24,'Y');pline(b,277,26,298,66,'Y');
  for(let x=58;x<270;x+=24){prect(b,x,21,3,5,'V');prect(b,x,130,3,8,'V')}
  return b;
}
function localPlanksArt(){
  const b=pbuf(42,22);
  polyFill(b,[[0,9],[35,1],[40,7],[4,16]],(x,y)=>pset(b,x,y,'Y'));
  polyFill(b,[[4,17],[38,10],[41,15],[9,21]],(x,y)=>pset(b,x,y,'W'));
  for(const [x,y] of [[8,10],[29,6],[12,17],[34,14]])prect(b,x,y,2,2,'G');
  return b;
}
function localExitArt(){
  const b=pbuf(38,24);
  for(let n=0;n<5;n++){prect(b,n*3,2+n*4,26,4,'W');prect(b,n*3,2+n*4,26,1,'Y')}
  return b;
}
function localEntryHS(W,H){
  return localEntries().map(id=>{
    const z=localDef(id);
    if(!z.entryArt)return '';
    return ob('zone:enter:'+id,'zoneEnter',id,obURL('zone:entry:'+id,()=>HI(z.entryArt)()),z.entryX,z.entryY,W,H,z.entry,'<b>'+z.entry+'</b>',{pulse:1});
  }).join('');
}
function localZoneScene(){
  const id=localCurrent(),z=localDef(id);
  if(!z)return '';
  const W=LZW,H=LZH;
  let h='<span data-sk="bg" data-sig="bg" class="scbg">'+VH(()=>pimg(pxURL('zone:bg:'+id,()=>HI(z.background)()),960,450,'scene',z.title()))+'</span>';
  h+=ob('zone:back:'+id,'zoneBack',id,obURL('zone:exit',()=>HI(localExitArt)()),26,96,W,H,z.parent?'Назад':'На берег','<b>Вихід</b>');
  for(const [k,o] of Object.entries(z.objects||{})){
    if(o.ready&&!o.ready()||!o.art)continue;
    h+=ob('zone:'+id+':'+k,'zoneAct',id+':'+k,obURL('zone:obj:'+id+':'+k,()=>HI(o.art)()),o.x,o.y,W,H,o.label,'<b>'+o.label+'</b>');
  }
  h+=localEntryHS(W,H);
  return '<div class="scn" data-scn="zone-'+id+'" style="'+scnD()+'">'+h+'</div>';
}
