/* Дресирування вовка: очки з годування, перемог і занять; навички; накази в бою. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.f.looked=1;s.tabs.hero=1;s.h.on=1;s.eq.weapon='oar';s.h.lvl=10;s.h.hp=maxHP();s.r.fish=100;s.r.prov=100;
s.wolf={name:'Сірко',g:30,sat:0,lt:Date.now(),fed:0,hurt:0};A(!wTrainOn(),'підліток — ще без дресирування');s.wolf.g=80;A(wTrainOn(),'дорослий — дресирування');
for(let i=0;i<3;i++){s.wolf.sat=0;act('wfeed')}A((s.wolf.tp||0)===1,'кожне третє годування — очко');
s.cd={};act('wlesson');A((s.wolf.tp||0)===1,'заняття без міні-гри (у тесті) — без очка');s.wolf.tp=6;
act('wlearn','heel');A(!wHas('heel'),'«До ноги» — лише після «Хапай»');act('wlearn','grab');act('wlearn','heel');act('wlearn','scent');A(wHas('grab')&&wHas('heel')&&wHas('scent')&&s.wolf.tp===2,'навички вивчено');
startFight('rats','x');const c=s.cb,w=c.u.find(u=>u.t==='wolfpet');A(w,'вовк у бою');A(/хапай мою ціль/.test(rCombat()),'накази в панелі бою');
const tg=c.u.find(u=>u.t==='rat');c.sel=c.u.indexOf(tg);act('c_wcmd','grab');w.x=tg.x-1;w.y=tg.y;if(unitAt(c,w.x,w.y)&&unitAt(c,w.x,w.y)!==w){w.x=tg.x;w.y=tg.y+1}tg.hp=99;tg.max=99;
let pinned=0;for(let i=0;i<10&&!pinned;i++){wolfAct(c,w);pinned=tg.pin>0}A(pinned,'«Хапай!» притискає ціль');s.cb=null;
console.log('fails',fails)`);
