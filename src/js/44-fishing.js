const deepWaterArt=HI(function(){
  const b=pbuf(24,16);
  pline(b,0,2,9,1,'d');pline(b,9,1,19,8,'6');
  pline(b,4,12,11,11,'U');pline(b,13,12,22,12,'6');
  pline(b,10,14,18,15,'S');pset(b,21,14,'U');
  return b;
});
function shoreRodHS(W,H){
  const h=[];
  const deep=s.f.rodUp||s.f.rodRipple&&!s.f.rodLimitSeen;
  for(const place of deep?['shore','deep']:['shore']){
    const far=place==='deep',spot=FISH_SPOTS[place],bite=s.bite&&bitePlace()===place;
    const art=far?obURL('rod:deep',deepWaterArt):obURL(s.f.rodUp?'rod:up':'rod3',()=>rodObj3(s.f.rodUp));
    const x=far?57:162,y=far?36:45;
    if(far&&!s.f.rodUp){
      h.push(ob('rod:ripple','rodReach','',art,x,y,W,H,'Оглянути кола на воді','<b>Кола за мілиною</b>',{cls:'far-ripple',inner:'<i class="far-rings" aria-hidden="true"></i>'}));
      continue;
    }
    const name=bite?fishBiteLabel():far?'Рибалити · '+spot.name:s.f.rodUp?'Рибалити · '+spot.name:'Рибалити';
    const cls=(far?'rod-deep ':'')+(bite?'rod-catch':'');
    h.push(ob(bite?'sh:bite':far?'rod:deep':'rod',bite?'bpop':'fishing',bite?'sh:bite':place,
      art,x,y,W,H,name,bite?`<b>${name}</b><br>Витягни улов зараз або повернися згодом.`:`<b>${spot.name}</b><br>Закинь і чекай, поки клюне.`,
      {cls,cd:'fishing',cs:3,pulse:!far&&!bite,idle:far||bite?'':'i-sway',inner:'<i class="bob" aria-hidden="true"></i>'}));
  }
  return h.join('');
}
