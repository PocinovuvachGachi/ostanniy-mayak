require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
let res={win:0,broken:0,stolen:0,n:0};
for(let k=0;k<60;k++){s=fresh();s.tabs.hero=1;s.h.bg='old';s.floors.gallery=1;s.f.siege1=1;s.f.looked=1;s.b.hearth=2;s.b.pot=1;s.b.boom=1;s.b.smoke=1;for(const r of RES)s.r[r]=200;
 s.h.lvl=6;Object.assign(s.h.a,{str:4,con:5,dex:3});s.h.k.melee=2;giveI('cleaver');giveI('mail');giveI('potion',2);s.h.hp=maxHP();
 if(k%2){s.def={palisade:2,dtraps:1,bell:1,militia:1};s.f.people=1;s.pop=3}
 s.threat=100;s.lastAct=Date.now();raidCheck();A(s.raid===1&&s.dlg.length===1,'raid dialog');s.dlg=[];raidResolve(true);
 if(k===0)console.log('units',JSON.stringify(s.cb.u.map(u=>[u.t,u.x,u.y,u.role||'',u.el||''])));
 botFight(1200);res.n++;if(s.c.wins)res.win++;res.broken+=Object.keys(s.dmgB||{}).length;}
console.log(JSON.stringify(res));
s=fresh();s.tabs.hero=1;s.floors.gallery=1;for(let i=0;i<10;i++){produce(60)}console.log('threat after 10 min',Math.round(s.threat));
s.def={brazier:2};s.threat=0;s.r.oil=100;for(let i=0;i<10;i++){produce(60)}console.log('with brazier2',Math.round(s.threat),'oil',Math.round(s.r.oil));
console.log('fails',fails);
`);
