require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
const cast=()=>{s.cd.fishing=0;act('fishing')};
const random=Math.random;
function draws(...rolls){Math.random=()=>rolls.length?rolls.shift():0.99}
function shore(){
  s=fresh();s.f.rod=1;s.tabs.shore=1;s.tab='shore';s.lastAct=Date.now();
  s.tutSeen.rod=1;
}
shore();draws(0);
cast();act('fishing');
A(s.r.fish===1&&s.c.fish===1&&onCd('fishing'),'штатне відновлення не дає повторно закинути');
cast();tideFirst();
A(!s.bite&&s.tideEpoch===null,'відплив ще не почався після двох закидань');
cast();tideFirst();
A(s.r.fish===3&&s.c.fish===3&&!s.bite&&s.tideEpoch!==null&&!s.f.tideSeen,'ті самі перші три улови запускають відступ води');
__adv(40_000);tideFirst();
A(s.f.tideSeen&&tideLow()&&s.dlg[0].title==='Відплив','перше вікно відпливу після штатної анімації');
s.dlg=[];s.tutPending=[];
cast();A(!s.bite,'четверте закидання звичайне');
cast();A(!s.bite&&s.f.crabWarn&&s.dlg[0].crabw,'краб має пріоритет на п’ятому закиданні');
s.f.crab1=1;s.dlg=[];s.tutPending=['rod'];delete s.tutSeen.rod;
cast();A(!s.bite,'готовий навчальний діалог має пріоритет');
s.tutPending=[];draws(0.1);cast();
A(s.bite?.kind==='fish'&&s.r.fish===7&&s.c.fish===7,'перше сильне клювання гарантоване, базова риба вже в кошику');
A(tutKnown('fishBite'),'контекстний урок запропоновано');
const first=s.bite;draws(0,0.9);cast();
A(first===s.bite&&s.r.fish===8&&s.c.fish===8,'наступний закид працює і не перезаписує подію');
act('tab','home');__adv(600_000);shoreTick();act('tab','shore');
A(s.bite===first&&s.tab==='shore','улов чекає після переходу і відсутності');
s.r.fish=capOf('fish');act('bigfish');
A(s.bite===first&&s.r.fish===capOf('fish'),'повний кошик зберігає весь бонус');
s.r.fish--;act('bigfish');
A(s.bite===first&&s.r.fish===capOf('fish')-1,'часткове місце зберігає весь бонус');
s.r.fish--;act('bigfish');act('bigfish');
A(!s.bite&&s.r.fish===capOf('fish')&&s.c.fish===8,'бонус +2 видається один раз, без додаткового закидання');
s.r.fish=0;s.h.ft.wolf=1;draws(0.10);cast();
A(!s.bite&&s.r.fish===1.5,'межа 10% і звичайний бонус вовка');
draws(0.099,0.9);cast();
A(s.bite?.odd==='medallion'&&s.r.fish===3,'зачіпка зберігає визначену знахідку поряд із базовим уловом');

let raw=null;
localStorage.setItem=(k,v)=>{raw=v};
localStorage.getItem=()=>raw;
save();
const persisted=JSON.parse(raw);
persisted.ts-=300_000;raw=JSON.stringify(persisted);
draws(0);
load();
A(s.bite?.odd==='medallion'&&s.c.fish===10&&s.r.fish===3,'після reload та офлайн-часу зачіпка не перекидається');
const xpBefore=s.h.xpb||0;
act('bigfish');act('bigfish');
A(s.odd.medallion&&s.h.xpb===xpBefore+20&&!s.bite&&s.oddNew===1&&shelfPopHTML().includes(OD.medallion.n),'унікальна дивина дає досвід один раз і є на полиці');
s.dlg=[];draws(0,0.9);cast();
A(s.bite?.kind==='snag'&&!s.bite.odd,'після медальйона зачіпка фіксує брухт');
const scrap=s.r.scrap;act('fishRelease');act('bigfish');
A(!s.bite&&s.r.scrap===scrap&&s.r.fish===4.5,'відмова залишає базовий улов і не видає бонус');
draws(0,0.9);cast();act('bigfish');act('bigfish');
A(s.r.scrap===scrap+2&&s.r.fish===6,'повторна зачіпка дає лише брухт');
const count=s.c.fish;s.r.fish=0;s.b.traps=1;
produce(40);
A(s.r.fish>0&&!s.bite&&s.c.fish===count,'ятері дають звичайну рибу без активних подій');

shore();s.c.fish=9;s.f.tideSeen=1;s.f.crab1=1;save();load();
A(!s.bite&&!s.f.fishBiteSeen&&s.c.fish===9,'старе збереження без зачіпки не змінює лічильник');
draws(0);cast();A(s.bite?.amount===2,'старий гравець знайомиться з бонусом після наступного придатного закидання');
shore();s.c.fish=12;s.bite={until:Date.now()-1};save();load();
A(s.bite?.kind==='fish'&&s.bite.amount===5&&s.c.fish===12&&tutKnown('fishBite'),'старий незавершений улов лишається доступним після міграції');
act('bigfish');act('bigfish');
A(s.r.fish===5&&!s.bite&&s.c.fish===12,'мігрований улов забирається один раз');
Math.random=random;
console.log('fails',fails)
`);
