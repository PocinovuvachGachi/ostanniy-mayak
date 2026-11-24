/* Етап II: розповіді в корчмі, люди й вовк, нічна риболовля, нові рецепти. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
const la=id=>{s.cd={};act('la',id)};
s.f.looked=1;s.tabs.map=1;s.disc.village=1;s.met.levko=1;s.met.tymish=1;s.met.hanna=1;s.fac={rot:25};s.r.coin=50;act('go','village');
la('village.tavern.tale');A(s.c.tale===1,'перша розповідь');for(let i=0;i<9;i++)la('village.tavern.tale');A(s.c.tale===10,'розповіді не закінчуються');
s.wolf={name:'Сірко',g:30,sat:0,lt:Date.now(),fed:0,hurt:0};const t0=fac('rot');la('village.tavern.wolf1');A(fac('rot')<t0,'Левко не пускає звіра');
s.fac.rot=55;la('village.tavern.wolf2');la('village.boy.pet');la('village.hut.wolf');A(s.done['village.tavern.wolf2']&&s.done['village.boy.pet']&&s.done['village.hut.wolf'],'люди й вовк');
s.f.reunion=1;s.f.netsDone=1;s.r.fish=0;la('village.pier.night');A(s.r.fish>=10,'нічна риболовля');
s.f.tracks=1;s.f.boat=1;kitTick();A(rcpKnown('zbyten')&&rcpKnown('fishersoup'),'рецепти Левка й Мирона');s.r.herb=10;s.r.prov=10;s.r.fish=40;cookDone('fishersoup',3);A(s.inv.fishersoup_t===2,'смачна рибальська юшка');
console.log('fails',fails)`);
