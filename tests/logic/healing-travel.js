/* Ланцюжок з одним стартовим набором. Після боїв HP повертає лише звичайна їжа. */
require('../harness.js')(`(()=>{
let fails=0,fishUsed=0;
const A=(ok,msg)=>{if(!ok){fails++;console.log('FAIL',msg)}};
const drain=()=>{while(s.dlg.length)act('dlgok')};
Math.random=()=>.1;
s.f.looked=1;s.f.rod=1;s.f.crab1=1;s.tabs.hero=1;s.tabs.shore=1;s.tab='shore';s.b.hearth=3;
Object.assign(s.h.a,{con:5,str:4,dex:4});s.h.lvl=6;s.h.k.melee=2;
giveI('cleaver');giveI('mail');s.h.hp=maxHP();s.r.fish=24;s.r.prov=12;
function recover(){
  while(s.h.hp<maxHP()&&s.r.fish>=1){act('eat');fishUsed++}
}
for(const id of ['rats','gulls','poolcrab']){
  const wins=s.c.wins||0;
  startFight(id,'bench');botFight();drain();
  A(!s.cb&&s.c.wins===wins+1,'тактичний бій завершено: '+id);
  const hp=s.h.hp;produce(60);A(s.h.hp===hp,'перерва між боями не відновлює сили');recover();
  A(s.h.hp===maxHP(),'після бою повністю відновився звичайною їжею');
}
A(fishUsed>0&&s.r.prov===12,'серія боїв витрачає їжу, а провізія лишається для виходу');
giveI('dried');act('use','dried');
quickFight('gulls','bench');drain();A(s.h.buf.full===1,'швидкий бій не застосовує і не списує ситість');recover();
s.f.fordDone=1;s.f.boat=1;s.tabs.map=1;s.disc.spit=1;
act('go','spit');drain();A(s.at==='spit'&&s.r.prov===10,'вартість справжнього морського виходу збережено');
act('la','spit.shallows.fight');A(s.cb?.enc==='spit','бій на локації починається зі збереженим HP');
botFight();drain();act('leave');A(!s.cb&&!s.at&&s.r.prov===10,'після морської сутички можна повернутися без другої оплати');
act('tab','shore');recover();

s.f.siege1=1;s.raid=1;const stock={fish:s.r.fish,prov:s.r.prov};
raidResolve(true);
for(let i=0;i<100&&s.cb;i++){act('c_end');if(s.cb)s.cb.eAnim=0}
A(!s.cb&&!s.raid&&s.h.hp===Math.round(maxHP()*.3)&&Math.abs(s.r.prov-stock.prov*.8)<1e-7&&Math.abs(s.r.fish-stock.fish*.8)<1e-7,'поразка набігу зберігає відсоток HP і втрати ресурсів');
drain();s.dbgTide='high';const need=Math.ceil((maxHP()-s.h.hp)/FOODHP.fish);
recover();
for(let i=0;i<need&&s.h.hp<maxHP();i++){__adv(3000);act('fishing');act('eat')}
A(s.h.hp===maxHP(),'після набігу можна відновитися звичайним уловом при високій воді');
console.log('Витрачено риби в цільовому ланцюжку:',fishUsed);
console.log('fails',fails)
})()`);
