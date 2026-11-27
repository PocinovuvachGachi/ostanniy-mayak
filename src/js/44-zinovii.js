/* Присутність Зиновія визначають чинні стани маяка. Кадри існують лише в сцені. */
const ZINOVII_CARD='cl:zinovii', ZIN_W=30, ZIN_H=36;
const zinoviiPresent=()=>!!(s.f.zinovii||s.mst.zinovii);
const zinoviiCardContext=()=>zinoviiPresent()&&(s.tab==='home'&&s.f.looked&&!s.at||atFishKitchen());
const zinoviiInteractionHere=()=>s.tab==='home'||popB===ZINOVII_CARD&&zinoviiPresent()&&atFishKitchen();

function zinoviiCardBody(){
  const {role}=MST.zinovii;
  const description=s.bdSeen?.smoke||s.b.smoke?MST.zinovii.d:'З «Мартина». Тепер живе біля маяка.';
  const topics=(winchTopicReady()?btn('Показати механізм Зиновію','winchTalk'):'')+holdOilHTML()+navTalkButton()+fishRecipeButtons();
  return `<div class="pcard zinovii-profile">${pimg(faceURL('zinovii'),48,48,'','')}<div><span class="role">${role}</span><span class="m">${description}</span></div></div>`+
    (topics?`<div class="act zinovii-topics">${topics}</div>`:'');
}

function zinoviiPopHTML(){
  return `<div class="bpop zinovii-pop" role="dialog" aria-label="Зиновій"><div class="bph"><b>Зиновій</b><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити картку Зиновія">✕</button></div>${zinoviiCardBody()}</div>`;
}

function focusZinoviiCard(open){
  if(!zinoviiCardContext()||!localCanAct())return;
  document.querySelector(open?'#popl .zinovii-pop .bpx':'#stage [data-sk="cl:zinovii"]')?.focus({preventScroll:true});
}

function drawZinovii(pose,frame){
  const b=pbuf(ZIN_W,ZIN_H),work=pose!=='rest',look=frame===3,lean=work&&frame===2?1:0;
  const x=look?-1:0,head=1+lean;
  // Черевики, важкий фартух та смуги підгорнутих рукавів.
  hiRect(b,3,32,24,4,(i,j,px,py)=>((px-15)/12)**2+((py-34)/2)**2<1?'D':'');
  prect(b,9,25,5,8,'2');prect(b,17,25,5,8,'1');
  prect(b,9,28,1,4,'4');prect(b,17,27,2,4,'3');
  prect(b,8,32,7,2,'x');prect(b,17,32,7,2,'x');prect(b,9,32,3,1,'W');prect(b,18,32,3,1,'W');
  polyFill(b,[[7,13],[12,11],[18,12],[22,14],[24,21],[21,26],[8,26],[5,19]],(i,j)=>pset(b,i,j,i<11?'4':i<19?'3':'2'));
  polyFill(b,[[12,13],[19,14],[21,19],[22,28],[12,30],[9,27],[10,21]],(i,j)=>pset(b,i,j,i<13?'N':i<19?'M':'L'));
  pline(b,10,21,20,21,'W');pline(b,12,22,12,27,'O');prect(b,15,23,4,3,'L');prect(b,15,23,4,1,'N');
  // Світла шапка, вуса і ніс, повернутий до співрозмовника в останньому кадрі.
  prect(b,12+x,10+head,6,4,'n');prect(b,12+x,11+head,4,1,'m');
  polyFill(b,[[9+x,5+head],[12+x,3+head],[19+x,4+head],[21+x,8+head],[19+x,11+head],[15+x,13+head],[10+x,10+head]],(i,j)=>pset(b,i,j,i<13+x?'n':'m'));
  polyFill(b,[[8+x,5+head],[9+x,2+head],[13+x,head],[19+x,2+head],[22+x,6+head],[9+x,7+head]],(i,j)=>pset(b,i,j,j<3+head?'O':i<13+x?'N':'M'));
  pline(b,9+x,6+head,21+x,6+head,'L');pset(b,10+x,4+head,'O');pset(b,13+x,3+head,'O');
  pset(b,look?14:18+x,8+head,'x');pset(b,look?16:21+x,9+head,'!');pline(b,14+x,10+head,20+x,10+head,'9');
  pset(b,15+x,11+head,'W');pset(b,19+x,11+head,'W');

  const handY=look?21:pose==='rest'?[22,18,15][frame]:[22,20,18][frame];
  const handX=look?20:pose==='kitchen'?[23,26,25][frame]:23;
  pline(b,8,16,7,20,'4');pline(b,7,20,11,23,'5');prect(b,10,22,3,2,'m');
  pline(b,21,16,22,20,'3');pline(b,22,20,handX-1,handY,'5');prect(b,handX-1,handY,3,2,'m');
  if(pose==='rest'){
    prect(b,handX+1,handY-3,4,4,'d');prect(b,handX+1,handY-3,4,1,'Y');pset(b,handX+5,handY-2,'X');
  }else if(pose==='smoke'){
    pline(b,handX+1,handY-2,handX+4,handY+3,'X');pline(b,handX+2,handY-3,handX+5,handY+2,'Y');
  }else{
    polyFill(b,[[handX-2,handY-2],[handX+2,handY-1],[handX+3,handY+4],[handX-1,handY+3]],(i,j)=>pset(b,i,j,i<handX?'O':'N'));
  }
  return b;
}
const zinoviiFrame=HI(drawZinovii);
const zinoviiStrip=HI(pose=>{
  const b=pbuf(ZIN_W*4,ZIN_H);
  for(let n=0;n<4;n++)blitTo(b,drawZinovii(pose,n),n*ZIN_W,0);
  return b;
});
const ZINOVII_ACTIVITY={
  rest:'Зиновій гріє руки об кухоль.',
  smoke:'Зиновій перебирає тріски для коптильні.',
  kitchen:'Зиновій витирає руки полотном біля столу.'
};
function zinoviiHS(pose,x,y,W,H){
  const spec=obURL('zinovii:'+pose,()=>zinoviiFrame(pose,0));
  const strip=pxURL('zinovii-frames:'+pose,()=>zinoviiStrip(pose));
  return ob(ZINOVII_CARD,'bpop',ZINOVII_CARD,spec,x,y,W,H,'Зиновій',
    `<b>Зиновій</b><br>${ZINOVII_ACTIVITY[pose]}`,{
      dialog:popB===ZINOVII_CARD,cls:'zinovii-resident'+(popB===ZINOVII_CARD?' sel':''),
      inner:innerAt(0,0,ZIN_W,ZIN_H,ZIN_W,ZIN_H,'zinovii-frames '+pose,`background-image:url(${strip})`)
    });
}
function zinoviiYardHS(buildings,W,H){
  if(!zinoviiPresent())return '';
  const pose=s.b.smoke&&s.on.smoke!==false&&!s.dmgB?.smoke?'smoke':'rest';
  // Перед коптильнею лишається менше місця, коли поряд виростають інші цехи.
  const workspot=pose==='smoke'&&[[224,158],[207,158]].find(([x,y])=>!buildings.some(([bx,by,bw,bh])=>
    x<bx+bw+2*OP&&x+ZIN_W+2*OP>bx&&y<by+bh+2*OP&&y+ZIN_H+2*OP>by));
  const [x,y]=workspot||[97,151];
  return zinoviiHS(pose,x,y,W,H);
}
