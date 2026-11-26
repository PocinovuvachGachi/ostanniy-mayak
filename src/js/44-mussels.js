/* Об’єкт на камені та предмет у торбі походять із PR #67 (Vitaliy Sazoniuk і Codex). */
IT.mussel={n:'Мідії',ic:'()',use:'heal',v:6,d:'Відновлюють 6 здоров’я. У бою з пояса за 1 ОД.'};
ICO.mussel=['............','.....dd.....','....d99d....','...d9a8d....','..d9a88d....','..d9888d....','..d888d....','...ddd......','.....yyy....','............','............','............'];
ILD.mussel=IT.mussel.d;

function musselCycle(now=tideRenderTime??Date.now()){
  if(!atShore()||!tideKnown()||!tideLow(tidePhase(now)))return null;
  const cycle=tideCyc(now);
  return s.musselCyc!=null&&cycle<=s.musselCyc?null:cycle;
}

const MUSSEL_X=129,MUSSEL_Y=105,MUSSEL_FX_MS=720;
let musselFx=null;
const musselFxActive=()=>!!musselFx&&Date.now()<musselFx.until;
function musselPick(id){
  const cycle=musselCycle(Date.now());
  if(cycle==null||id!==String(cycle)||s.cb||s.raid||s.dlg.length)return;
  s.musselCyc=cycle;
  s.f.musselGathered=1;
  giveI('mussel');
  say('Ти знімаєш із каменя жменю мідій і загортаєш їх у ганчірку.','find');
  const fx={until:Date.now()+MUSSEL_FX_MS};
  musselFx=fx;
  if(typeof setTimeout==='function')setTimeout(()=>{
    if(musselFx===fx){musselFx=null;dirty=1}
  },MUSSEL_FX_MS);
  tutOffer('mussels');
  save();
}

const musselStoneArt=HI(function(shells){
  const b=pbuf(16,11);
  polyFill(b,[[0,9],[3,5],[11,4],[15,9],[12,10],[2,10]],(x,y)=>pset(b,x,y,y<8?'G':'E'));
  if(shells)for(const[x,y]of[[3,6],[8,5],[11,7]]){
    polyFill(b,[[x-1,y+2],[x,y-2],[x+2,y-3],[x+4,y-1],[x+2,y+2]],(px,py)=>pset(b,px,py,px<=x+1?'D':'C'));
    pline(b,x,y+1,x+2,y-2,'H');
    pset(b,x+2,y-2,'U');
  }
  return b;
});
const musselHandArt=HI(function(){
  const b=pbuf(17,14);
  polyFill(b,[[3,0],[7,1],[12,8],[9,11],[4,8],[0,4]],()=> 'V');
  polyFill(b,[[8,7],[10,5],[12,6],[12,8],[15,8],[16,9],[15,11],[11,13],[8,11]],(x,y)=>pset(b,x,y,y<10?'f':'e'));
  pline(b,12,10,15,9,'g');
  return b;
});
function shoreMusselHS(W,H){
  const cycle=musselCycle();
  if(cycle!=null)return ob('mussels','mussels',String(cycle),obURL('mussel3',()=>musselStoneArt(true)),MUSSEL_X,MUSSEL_Y,W,H,
    'Зібрати мідії','<b>Мідії</b><br>На мокрому камені темніють мушлі.',{pulse:1});
  if(!musselFxActive()||!tideLow())return '';
  const img=(cls,url,x,y,w,h)=>`<img class="${cls}" src="${url}" alt="" style="${PCT(MUSSEL_X+x,MUSSEL_Y+y,w,h,W,H)}">`;
  return `<div class="mussel-pick" data-sk="mussel-pick" data-sig="${musselFx.until}" aria-hidden="true">
    ${img('mussel-stone',pxURL('mussel-stone',()=>musselStoneArt(false)),0,0,16,11)}
    ${img('mussel-hand',pxURL('mussel-hand',musselHandArt),-4,-9,17,14)}
    ${img('mussel-lift',icoURL('mussel'),7,-1,10,10)}
  </div>`;
}
