/* Приплив і брід: відплив ~5 хв із ~15; калюжі й роботи на броді — лише на відпливі;
   ліхтар — після першої облоги; готовий брід відкриває Мапу. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.tabs.shore=1;s.tab='shore';s.lastAct=Date.now();tideFirst();A(!tideLow()&&tideLv()===0&&s.tideEpoch==null,'новий гравець не бачить відплив');
__adv(900000);s.lastAct=Date.now();s.f.rod=1;s.c.fish=2;tideFirst();A(s.tideEpoch==null,'до третьої риболовлі не запускається');
s.c.fish=3;tideFirst();A(s.tideEpoch!=null&&!tideLow(),'починається поступовий відступ води');
__adv(41000);s.lastAct=Date.now()-180000;tideFirst();A(!s.f.tideSeen&&!tideLow(),'перший відплив не губиться без гравця');
__adv(900000);s.lastAct=Date.now();s.dlg=[];tideFirst();A(s.f.tideSeen&&tideLow()&&tideLeft()>250,'повний перший відплив при поверненні');
act('dlgok');tideFirst();
const epoch=s.tideEpoch;let low=0;for(let t=0;t<TIDE;t+=5){__adv(5000);if(tideLow())low+=5}A(low>=TLOW-90&&low<=TLOW+10&&s.tideEpoch===epoch,'відплив ~5 хв із 15: '+low);
s.tideEpoch=null;A(tideLegacy(),'старі збереження зберігають фазу годинника');
s.f.fordSeen=1;s.r.wood=999;s.r.scrap=999;s.r.fish=99;s.r.oil=99;s.r.ember=999;
s.dbgTide='high';A(!fordPart('poles')&&!(s.ford||{}).poles,'на повній воді брід не будується');s.r.fish=0;const f0=s.r.fish;s.cd={};act('pool');A(s.r.fish===f0,'калюжі під водою');
s.dbgTide='low';s.cd={};act('pool');A(s.r.fish>f0,'калюжі на відпливі');s.r.fish=40;
A(fordVisible().map(p=>p.id).join()==='poles','видно лише першу роботу');
const wood0=s.r.wood;A(!fordPart('rope')&&s.r.wood===wood0,'не можна пропустити перші роботи або витратити ресурси');
act('ford','poles');A(fordVisible().map(p=>p.id).join()==='poles,steps','після вішок видно сходинки');
act('ford','steps');act('ford','rope');A(fordN()===3,'три частини на відпливі');
A(!fordVisible().some(p=>p.id==='lamp')&&!fordReady(),'ліхтар не показано до облоги');act('ford','lamp');A(!s.f.fordDone,'ліхтар чекає на облогу');
s.f.siege1=1;s.floors.gallery=1;s.dlg=[];act('ford','lamp');A(s.f.fordDone&&s.tabs.map&&s.disc.village,'брід відкриває мапу й Причал');
A(s.dlg.filter(d=>d.title==='Брід позначено').length===1&&!s.dlg.some(d=>d.title==='Відкрито: Мапа'||d.title==='Нове місце: Гнилий Причал'),'одне повідомлення замість трьох');
A(!s.disc.chaika&&!s.disc.cliffs&&!scanTarget(),'на першій мапі лише Причал');
const ember0=s.r.ember;act('scan');A(s.r.ember===ember0&&!s.disc.chaika,'до розмови огляд не витрачає жар');
act('go','village');A(!scanTarget(),'спершу знайомство з людьми');act('la','village.tavern.talk');A(!scanTarget(),'огляд не проводиться з селища');act('leave');A(scanTarget()==='chaika','після повернення огляд знаходить корабель');
act('scan');A(s.disc.chaika&&!s.disc.cliffs&&!scanTarget(),'скелі не відкриваються далекоглядом');
const e1=s.r.ember;act('scan');A(s.r.ember===e1,'повторний огляд не витрачає жар');
s.f.fordDone=0;s.ford={rope:1};A(fordNext().id==='poles'&&fordVisible().some(p=>p.id==='rope'),'старі частини не губляться, навіть якщо збудовані в іншій послідовності');
console.log('fails',fails)`);
