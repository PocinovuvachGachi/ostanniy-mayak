/* Спільна черга: автоматичні відкриття не обходять паузу; невикористані опції не блокують сюжет. */
require('../harness.js')(`(()=>{let fails=0;const A=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}};
NOGAP=0;s.tabs.shore=1;s.b.hearth=1;s.f.wreck=1;s.f.hook=1;s.f.rod=1;s.f.crab1=1;s.tabs.hero=1;s.floors.work=1;s.bdSeen={};s.rcSeen={};s.lastNov=null;s.lastAct=Date.now();s.r.wood=500;s.r.scrap=200;s.r.ember=500;s.r.fish=20;
A(!rcVisible(RC.find(r=>r.id==='sling')),'готовий рецепт до оголошення прихований');
novPlanTick(true);A(!!s.rcSeen.oar,'першим відкривається потрібний інструмент');
s.dlg=[];novPlanTick(true);novPlanTick(false);A(!s.rcSeen.sling&&Object.keys(s.bdSeen).length===0,'немає обходу паузи між різними чергами');
s.play+=NOVGAP+1;s.lastAct=Date.now();novPlanTick(true);A(!!s.rcSeen.sling,'після паузи відкривається праща');
s.dlg=[];s.play+=NOVGAP+1;s.lastAct=Date.now();novPlanTick(false);A(Object.keys(s.bdSeen).length===0,'необов’язкові плани чекають освоєння');
act('craft','sling');A(has('sling')&&s.novUsed['r:sling'],'виготовлення фіксує використання');s.dlg=[];novPlanTick(false);A(Object.keys(s.bdSeen).length===1,'після використання відкривається наступний план');
s.dlg=[];s.play+=91;s.lastAct=Date.now();novPlanTick(false);A(Object.keys(s.bdSeen).length+Object.keys(s.rcSeen).length>=4,'необов’язковий план можна пропустити');
s.dlg=[];s.play+=91;s.lastAct=Date.now()-180000;const n=Object.keys(s.bdSeen).length+Object.keys(s.rcSeen).length;novPlanTick(false);A(n===Object.keys(s.bdSeen).length+Object.keys(s.rcSeen).length,'немає нових планів без гравця');
s.dlg=[];s.lastAct=Date.now();s.tabs.hero=1;s.nvU={};s.floors.gallery=1;s.f.fordSeen=1;s.ford={poles:1,steps:1};novTick(true);A(s.f.mlaNote,'Мла не залежить від відкриття вкладки спорядження');
s.floors.work=0;A(!rcVisible(RC.find(r=>r.id==='oar')),'до майстерні рецепти недоступні');
console.log('fails',fails)})()`);
