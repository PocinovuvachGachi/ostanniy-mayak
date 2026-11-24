/* Ручний вовк: вовченя після бою за козу, ім'я, годування, ріст лише ситим і лише поки гравець поруч, бій поруч, одужання. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.f.looked=1;s.b.hearth=2;s.tabs.map=1;s.disc.cliffs=1;s.f.goatQ=1;s.eq.weapon='oar';s.h.lvl=6;s.h.hp=maxHP();
act('la','cliffs.goat.fight');for(const u of s.cb.u)if(!EN[u.t].ally)u.hp=1;botFight();A(s.f.goatDone&&s.wolf,'вовченя з лігва');
act('wname','<b>сірко</b>');A(s.wolf.name==='Бсірко/b'||s.wolf.name==='Сірко'||/ірко/.test(s.wolf.name),'ім’я без тегів: '+s.wolf.name);
s.wolf.name='';act('wname','сірко');A(s.wolf.name==='Сірко','ім’я з великої літери');
const tick=m=>{for(let i=0;i<m;i++){__adv(60000);s.lastAct=Date.now();wolfTick()}};
tick(10);A(s.wolf.g<1,'голодний не росте');
s.r.fish=100;s.r.prov=100;act('wfeed');A(wolfSated()&&s.r.fish===96,'нагодували');const f1=s.r.fish;act('wfeed');A(s.r.fish===f1,'ситого не перегодуєш');
tick(10);A(s.wolf.g>=9,'ситий росте: '+s.wolf.g.toFixed(1));
s.lastAct=Date.now()-600000;const g0=s.wolf.g;__adv(60000);wolfTick();A(s.wolf.g===g0,'без гравця не росте');
for(let i=0;i<4;i++){s.wolf.sat=0;act('wfeed');tick(10)}A(wolfSt()===1,'підліток: '+s.wolf.g.toFixed(1));
s.h.hp=maxHP();startFight('rats','x');const w=s.cb.u.find(u=>u.t==='wolfpet');A(w&&w.nm==='Сірко'&&w.max===20,'вовк у бою поруч');
w.hp=1;kill(w);A(Date.now()<s.wolf.hurt,'знесилений відповзає');s.cb=null;startFight('rats','x');A(!s.cb.u.some(u=>u.t==='wolfpet'),'поки одужує — не б’ється');s.cb=null;
__adv(6*60000);startFight('rats','x');A(s.cb.u.some(u=>u.t==='wolfpet'),'одужав');s.cb=null;
for(let i=0;i<6;i++){s.wolf.sat=0;act('wfeed');tick(10)}A(wolfSt()===2,'дорослий');
console.log('fails',fails)`);
