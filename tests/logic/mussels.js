require('../harness.js')(`(()=>{
let fails=0;
const A=(ok,msg)=>{if(!ok){fails++;console.log('FAIL',msg)}};
let now=Date.now(),raw;
Date.now=()=>now;localStorage.setItem=(k,v)=>{raw=v};localStorage.getItem=()=>raw;
function shore(){s=fresh();s.tabs.shore=1;s.tab='shore';s.tideEpoch=now;s.f.tideSeen=1}
function pick(){act('mussels',String(tideCyc()))}

shore();const epoch=s.tideEpoch;now=epoch+559999;pick();
A(!has('mussel')&&!s.f.musselGathered&&!tutReady('mussels'),'повна вода не видає порцію й не відкриває урок');
now=epoch+599600;
s.tab='home';pick();s.tab='shore';s.at='village';pick();s.at='';
s.dlg=[{title:'Подія'}];pick();s.dlg=[];s.raid=1;pick();s.raid=0;s.cb={};pick();s.cb=null;
act('mussels','');act('mussels','99');
A(!has('mussel')&&s.musselCyc===null,'тільки на березі, поза боєм і діалогом, з актуальною кнопкою');

s.f.rod=1;s.f.rodUp=1;s.f.hook=1;giveI('rake');
s.bite={kind:'species',species:'cod',place:'deep'};
s.hookWater.pending={id:3,kind:'heavy',reward:{wood:4,scrap:3}};
s.rakeSand.pending={id:1,kind:'wet',scrap:2};
const pending=JSON.stringify([s.bite,s.hookWater.pending,s.rakeSand.pending]);
const xp=s.h.xpb||0,fish=s.r.fish,oldOD=Object.keys(s.odd).length;
pick();pick();
A(s.inv.mussel===1&&s.musselCyc===0&&s.f.musselGathered&&tutKnown('mussels'),'одна порція нульового циклу й окремий урок');
A(JSON.parse(raw).inv.mussel===1&&beltHas('mussel')&&!RES.includes('mussel'),'порцію одразу збережено, чинний пояс і торба');
A((s.h.xpb||0)===xp&&s.r.fish===fish&&Object.keys(s.odd).length===oldOD&&JSON.stringify([s.bite,s.hookWater.pending,s.rakeSand.pending])===pending,
  'збір не видає XP, звичайної риби чи знахідок і не чіпає три незавершені дії');
s.h.hp=5;act('use','mussel');pick();save();load();pick();
A(s.h.hp===11&&!has('mussel')&&s.f.musselGathered&&musselCycle()===null,'6 HP, споживання й reload не повертають порцію в цьому циклі');

now=epoch+3*TIDE*1000+860400;load();pick();
A(!has('mussel'),'приплив на точній межі й пропущені цикли не дають порцій');
s.f.fordDone=1;now=epoch+4*TIDE*1000+600000;act('mussels','0');
A(!has('mussel'),'кнопка попереднього циклу не збирає доступний запас');
pick();now+=TIDE*1000;pick();
A(s.inv.mussel===2&&s.musselCyc===5&&s.f.fordDone,'після броду запас зростає при зборі в різні цикли');
now-=TIDE*1000;pick();A(s.inv.mussel===2,'повернення годинника до вже пройденого циклу не дає порцію');
s.h.hp=5;startFight('crab1','crab1');const ap=s.cb.ap;act('c_item','mussel');
A(s.h.hp===11&&s.cb.ap===ap-1&&s.inv.mussel===1,'у бою 6 здоров’я і 1 ОД');

shore();s.tideEpoch=null;now=Math.floor(now/900000)*900000+600000;
const legacy=tideCyc();s.musselCyc=legacy;save();
const old=JSON.parse(raw);delete old.f.musselGathered;delete old.tideEpoch;raw=JSON.stringify(old);load();pick();
A(tideLegacy()&&tideCyc()===legacy&&s.f.musselGathered&&!has('mussel'),'перенесено старий номер циклу й факт вже з’їденої порції');
now+=TIDE*1000;pick();A(s.inv.mussel===1&&s.musselCyc===legacy+1,'старий годинник дає один новий збір');

NOGAP=0;shore();now+=TIDE*1000+600000;pick();
A(s.inv.mussel===1&&s.musselCyc===1&&s.tutPending.includes('mussels'),'пропущений перший відплив не втрачає відкриття');
const recipes=JSON.stringify(s.rcp||{});s.f.zinovii=1;s.tabs.kitchen=1;s.tab='kitchen';
A(fishRecipesReady().some(d=>d.ingredient==='mussel')&&JSON.stringify(s.rcp||{})===recipes,'збір дає можливість запитати про рецепт на кухні, самої юшки ще не відкрито');
console.log('fails',fails)
})()`);
