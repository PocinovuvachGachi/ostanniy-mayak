/* Етап III: сигнальник кличе підмогу, Гнат на половині сил кличе своїх, аркуші зошита, три маяки, реліквії, креслення лінзи. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.f.looked=1;s.tabs.hero=1;s.h.on=1;s.eq.weapon='oar';s.h.lvl=12;s.h.hp=maxHP();
startFight('fortpier','x');let c=s.cb;const sg=c.u.find(u=>u.t==='signal');A(sg,'сигнальник на пристані');const n0=c.u.length;hornAct(c,sg);A(c.u.length===n0,'перше сурмління — попередження');hornAct(c,sg);A(c.u.length===n0+1,'друге — підмога');
for(let i=0;i<6;i++)hornAct(c,sg);A(c.u.length<=n0+2,'не більше двох підмог');s.cb=null;
startFight('gnat','x');c=s.cb;const g=c.u.find(u=>u.t==='gnat');const m0=c.u.length;gnatPhase(c,g);A(c.u.length===m0,'на повних силах — сам');g.hp=Math.floor(g.max/2);gnatPhase(c,g);A(c.u.length===m0+2&&g.ph,'на половині — кличе своїх');s.cb=null;
/* реліквії */
odd('mhorn');setCheck('mhorn');odd('mbadge');setCheck('mbadge');const sp=s.h.sp||0;odd('mknife');setCheck('mknife');A(s.oset.silent&&s.h.sp===sp+1,'реліквії Мовчунів — очко вмінь');
/* три маяки */
s.floors.study=1;page(6);page(7);A(!threeReady(),'ще не все складається');page(8);s.c.tale=2;s.odd.star=1;A(threeReady(),'розповідь, мапа й аркуші');act('three');A(s.f.three,'три маяки');
/* кінець етапу */
s.f.ostap=1;stage3Tick();A(s.f.lightPlan&&(s.dlg||[]).some(d=>d.title==='Тепер — світло'),'креслення великої лінзи');
console.log('fails',fails)`);
