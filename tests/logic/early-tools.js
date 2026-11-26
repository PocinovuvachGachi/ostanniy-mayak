/* Рання прогресія без NOGAP: інструменти, бойовий початок, доступ до майстерні. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s=fresh();NOGAP=0;s.tabs.shore=1;s.tabs.tower=1;s.f.looked=1;s.b.hearth=1;s.r.wood=50;s.r.scrap=0;s.r.ember=500;s.lastAct=Date.now();
const rod=RC.find(r=>r.id==='rod');
s.c.gather=18;earlyToolTick();A(!shoreHookReady()&&!shoreRodReady(),'до уламків не видно інструментів');
s.f.wreck=1;s.lastNov=null;act('scrapw');earlyToolTick();A(shoreHookReady()&&!shoreRodReady(),'перший брухт відкриває багор, не вудку');
s.dlg=[];const wood0=s.r.wood,scrap0=s.r.scrap;act('craft','rod');A(!s.f.rod&&s.r.wood===wood0&&s.r.scrap===scrap0,'не можна виготовити вудку до відкриття');
act('floor','work');A(!s.floors.work,'майстерня до першого бою закрита');
__adv(3000);act('scrapw');earlyToolTick();A(!shoreRodReady(),'пауза перед вудкою');
s.play+=NOVGAP+1;s.lastAct=Date.now();earlyToolTick();A(shoreRodReady()&&!s.f.hook,'вудка доступна навіть без багра');
s.dlg=[];act('craft','rod');A(s.f.rod&&!s.floors.work&&!s.f.craft1,'вудка на березі не вважається крафтом майстерні');
A(!rcVisible(rod),'вудка не дублюється у майстерні');
for(let n=0;n<5;n++){__adv(3100);act('fishing')}
A(s.f.crabWarn,'перша сутичка після риболовлі');act('tutFight');act('fightGo','crab1');A(s.cb&&s.eq.weapon==='oar'&&s.inv.oar===1,'перша зброя перед боєм без майстерні');
botFight();A(s.f.crab1&&s.tabs.hero&&!s.cb,'перший бій можна виграти');s.dlg=[];s.r.wood=100;s.r.scrap=30;s.r.ember=500;act('floor','work');A(s.floors.work,'майстерня після краба');
s=fresh();s.tabs.shore=1;s.f.wreck=1;s.f.hookPlan=1;s.r.wood=30;s.r.scrap=2;
act('hook');A(s.f.hook&&s.r.wood===18&&s.r.scrap===1,'багор справді потребує металу');
act('gather');A(s.r.wood===20,'багор подвоює ручний збір');act('hook');A(s.r.wood===20&&s.r.scrap===1,'не можна купити багор двічі');
A(!BD.find(b=>b.id==='pot').show0()&&BD.find(b=>b.id==='boom').show0(),'загорожа перед пасткою');s.bdSeen={boom:1};A(BD.find(b=>b.id==='pot').show0(),'пастка після креслення загорожі');
console.log('fails',fails)`);
