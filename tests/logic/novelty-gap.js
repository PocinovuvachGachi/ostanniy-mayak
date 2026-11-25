/* Поступовість (постулат 2): між відкриттями — пауза NOVGAP секунд гри.
   Креслення й рецепти з'являються по одному, а не пачкою. */
require('../harness.js')(`(()=>{let fails=0;const A=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}};
NOGAP=0;
s.b.hearth=1;s.tabs.shore=1;s.bdSeen={};s.lastNov=null;
const vis=()=>BD.filter(b=>b.show0()).map(b=>b.id);
s.r.wood=500;s.r.scrap=200;s.r.fish=50;s.tot.wood=500;s.tot.scrap=200;s.tot.fish=50;s.c.gather=99;
checks();const n1=Object.keys(s.bdSeen).length;
A(n1>=1,'перше креслення з’являється одразу');
checks();A(Object.keys(s.bdSeen).length===n1,'друге не з’являється в ту саму мить');
A(BD.filter(b=>b.show()).length===n1,'невідкрите креслення не видно у вкладці');
produce(NOVGAP+1);checks();
A(Object.keys(s.bdSeen).length===n1+1||vis().length<=n1,'після паузи відкривається ще одне');
console.log('fails',fails)})()`);
