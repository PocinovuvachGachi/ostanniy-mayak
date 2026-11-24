/* Етап II, крок 4: пес вчіплюється, Комора Остапа, три загадки ведуть до сховку, монети в набір. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
const la=id=>{s.cd={};act('la',id)};const vis=(l,id)=>LOC[l].spots.find(S=>S.id===id).show();
s.f.looked=1;s.b.hearth=2;s.tabs.map=1;s.tabs.hero=1;s.h.on=1;s.eq.weapon='oar';s.h.lvl=5;s.h.hp=maxHP();
/* пес */
startFight('whyard','x');const c=s.cb;const h=c.u.find(u=>u.t==='hound');A(h,'на складі є пес');
c.hx=3;c.hy=3;h.x=4;h.y=3;c.grip=c.u.indexOf(h);const x0=c.hx;heroMove(2,3);A(c.hx===x0,'пес тримає — не відійдеш');
A(/тримає тебе за ногу/.test(rCombat()),'у панелі видно хватку');
dmgTo(h,1,1,0,'m');A(c.grip==null,'удар скидає хватку');c.ap=5;heroMove(2,3);A(c.hx===2,'тепер відійшов');s.cb=null;
/* комора й загадки */
s.met.levko=1;s.fac={rot:25};s.disc.bay=1;act('go','village');A(vis('village','shed'),'сарай видно гостю');
la('village.shed.open');A(!s.f.shed,'без ключа хранителя не відімкнеш');s.odd.keeperkey=1;la('village.shed.open');A(s.f.shed,'Комора Остапа');
els['rdp-village-shed-riddle']=els['rd-village-shed-riddle']={value:'Місяць'};act('riddle','village.shed.riddle');A(s.f.riddle2,'загадка Остапа');
A(!vis('bay','pile'),'сховок — лише з усіма трьома загадками');s.done['village.tavern.riddle']=1;s.f.riddle1=1;A(vis('bay','pile'),'третя паля');
s.dbgTide='high';la('bay.pile.dig');A(!s.f.stash,'на повній воді не дістати');s.dbgTide='low';la('bay.pile.dig');A(s.f.stash&&s.odd.crowncoin,'сховок контрабандистів');
/* монети */
s.fac.rot=55;s.met.tymish=1;la('village.boy.coin');A(s.odd.fishcoin,'монета від Тиміша');const p0=price(100);collFind('errand');A(s.f.coinSet&&price(100)<p0,'набір монет — знижка');
console.log('fails',fails)`);
