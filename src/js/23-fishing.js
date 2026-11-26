/* Незвичайний улов має один збережений запис для обох місць. */
const FISH_BITE_CHANCE=.10,FISH_BITE_FISH=2,FISH_BITE_SCRAP=2,FISH_FIRST_SPECIES=16;
const FISH_SPOTS={shore:{name:'Прибережна вода',species:'flounder'},deep:{name:'Глибша вода',species:'cod'}};
const bitePlace=()=>s.bite?.place||'shore';
const atWorkshop=()=>!s.at&&(s.tab==='work'||s.tab==='tower'&&ttCur()==='work');
const rodHookReady=()=>s.floors.work&&s.f.rod&&s.odd.oldhook&&!s.f.rodLimitSeen&&!s.f.rodUp;

function rodWaterTick(){
  if(!atShore()||!s.f.rod||!s.f.fishBiteResolved||!s.f.crab1||!s.f.tideSeen||s.f.rodRipple||s.f.rodLimitSeen||!novCan()||s.tutPending.some(tutReady))return;
  s.f.rodRipple=1;dirty=1;
}
function rodObserve(fromHook){
  const ready=fromHook?atWorkshop()&&rodHookReady():atShore()&&s.f.rod&&s.f.rodRipple&&!s.f.rodLimitSeen&&!s.f.rodUp;
  if(!ready||s.dlg.length||s.cb||s.raid)return;
  s.f.rodLimitSeen=1;
  dlg({k:'info',title:fromHook?'Старий гачок на верстаку':'Кола за мілиною',img:{t:'icon',id:fromHook?'o_hook':'rod'},
    body:fromHook?'<p>Під іржею видно гладкий жолобок. Колись волосінь сходила крізь нього вільно, навіть під натягом. Ти прикладаєш гачок до вудки й намічаєш, де стане котушка.</p>'
      :'<p>За мілиною на воді розходяться широкі кола. Ти пробуєш докинути туди, але волосінь натягується раніше, ніж поплавець сягає кіл.</p>'});
}
function fishBiteCheck(place='shore'){
  const first=!s.f.fishBiteSeen;
  if(s.bite||!s.f.tideSeen||s.c.fish<(first?5:4)||s.dlg.length||s.tutPending.some(id=>id!=='fishBite'&&tutReady(id)))return;
  if(first){fishBiteOffer(place);return}
  const progress=s.fishSpecies[place]||(s.fishSpecies[place]={casts:0,offered:false});
  if(!progress.offered)progress.casts=Math.min(FISH_FIRST_SPECIES,progress.casts+1);
  const firstSpecies=!progress.offered&&progress.casts===FISH_FIRST_SPECIES;
  const normal=Math.random()<FISH_BITE_CHANCE;
  if(!normal&&!firstSpecies)return;
  const draw=normal?Math.random():1;
  const snag=s.odd.medallion?.35:.50;
  const kind=draw<snag?'snag':firstSpecies||draw>=.75?'species':'fish';
  fishBiteOffer(place,kind);
}
function fishBiteOffer(place='shore',kind){
  if(s.bite)return;
  kind=kind||(Math.random()<.5?'fish':'snag');
  if(kind==='fish')s.bite={kind,place,amount:FISH_BITE_FISH};
  else if(kind==='snag')s.bite=s.odd.medallion?{kind,place,amount:FISH_BITE_SCRAP}:{kind,place,odd:'medallion'};
  else{
    s.bite={kind,place,species:FISH_SPOTS[place].species};
    s.fishSpecies[place]={casts:0,offered:true};
  }
  s.f.fishBiteSeen=1;
  tutOffer('fishBite');
  say(kind==='snag'?'Волосінь натяглася. Щось важке піддалося з дна.':kind==='species'?'Під поплавцем повернулася незнайома тінь.':'Поплавець пірнув, і волосінь здригнулася.','find');
  sfx('fishBite');
}
const fishBonusFits=()=>!!s.bite&&(s.bite.kind!=='fish'||s.r.fish+s.bite.amount<=capOf('fish'));
function fishBiteResolve(keep){
  const bite=s.bite;
  s.bite=null;s.f.fishBiteResolved=1;
  if(popB==='sh:bite')popB='';
  if(!keep){say('Ти попустив волосінь. Поплавець знову гойдається на воді.','world');return}
  sfx('splash');
  if(bite.kind==='fish'){add('fish',bite.amount);say(`Ти підтягнув під берег ще риби. +${R('fish',bite.amount)}.`,'find');return}
  if(bite.kind==='species'){
    giveI(bite.species);s.f[bite.species+'Caught']=1;
    say(`На волосіні — ${I(IT[bite.species].n.toLowerCase())}.`,'find');return;
  }
  if(bite.odd&&!s.odd[bite.odd]){odd(bite.odd,'Щось мідне блиснуло в мокрій волосіні.');return}
  const amount=bite.amount||FISH_BITE_SCRAP;
  add('scrap',amount);
  say(`На гачку — уламки металу, обточені морем. +${R('scrap',amount)}.`,'find');
}
