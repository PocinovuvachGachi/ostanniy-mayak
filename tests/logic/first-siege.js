require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
function T(n){for(let i=0;i<n;i++){produce(1);checks();storyCheck()}}
const log=[];const dd=()=>{let g=0;while(s.dlg.length&&g++<60){if(g>50)console.log("STUCK",s.dlg[0].title,JSON.stringify(s.dlg[0].btns));log.push(s.dlg[0].title);if(s.dlg[0].bgsel){act('bg','fisher');continue}const b=(s.dlg[0].btns||[]).find(x=>x[1]==='raidGo');if(b){act('raidGo');botFight(900);continue}const n0=s.dlg.length;act('dlgok');if(s.dlg.length>=n0)s.dlg.shift()}};
s.f.looked=1;s.r.ember=1e5;s.r.wood=500;s.r.scrap=200;act('bld','hearth');s.c.fish=5;s.r.fish=10;T(2);s.dlg=[];act('fightGo','crab1');botFight();dd();
A(s.tabs.hero&&!s.h.bg,'hero w/o bg');s.tab='hero';render();T(2);dd();
giveI('bandage',2);T(2);dd();console.log('after bandage:',log.splice(0).join(' | '));A(s.nv.bag,'bag released');
s.tab='hero';s.ht='bag';render();
s.h.lvl=3;T(2);dd();console.log('lvl3:',log.splice(0).join(' | '));A(s.h.bg==='fisher','bg chosen at lvl3');
s.tab='hero';s.ht='grow';render();s.h.lvl=4;T(2);dd();console.log('lvl4:',log.splice(0).join(' | '));A(s.nv.tal,'talents');
s.tab='hero';s.ht='talents';render();s.floors.gallery=1;unlock('map');dd();T(2);A(!s.f.mlaNote,'no note before map visit');s.tab='map';render();for(let g=0;g<10&&!s.f.mlaNote;g++){T(1);dd()}console.log('map:',log.splice(0).join(' | '));A(s.f.mlaNote&&s.pages.includes('m'),'mla note');
A(!thrOn(),'no gauge yet');T(110);console.log('t110:',log.splice(0).join(' | '));T(50);
console.log('siege:',s.raid,s.cb?s.cb.u.map(u=>u.t).join(','):'',s.dlg.map(d=>d.title).join('|'));dd();T(2);dd();console.log('after:',log.splice(0).join(' | '));
A(s.f.siege1&&thrOn(),'gauge on after siege');const th0=s.threat||0;T(120);A((s.threat||0)===th0,'Mla does not grow on its own');s.cd={};act('gather');A((s.threat||0)>th0,'Mla grows from actions');
console.log('drops: gulls',thrDrop('gulls',0),'brute story',thrDrop('brute',1),'gnat',thrDrop('gnat',1),'mill farm',thrDrop('mill',0),'heart',thrDrop('heart',1));
console.log('fails',fails)`);
