require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
/* Ковадло: брухт і жар → залізо; інколи заготовка розжарюється, і її можна не чіпати */
s.f.looked=1;s.b.forge=2;s.r.scrap=200;s.r.ember=200;s.dlg=[];
const iz=s.r.iron;s.cd={};act('smith');A(s.r.iron-iz===smithN(),'smith gives iron');A(s.r.scrap===196,'smith spends scrap');
let hot=0;for(let n=0;n<400&&!s.hot;n++){s.cd={};s.hotT=0;act('smith')}A(!!s.hot,'blank gets hot sometimes');
const ir0=s.r.iron;s.cd={};act('smith');A(s.r.iron===ir0,'no plain smithing while blank is hot');
s.lastAct=Date.now();s.hot.until=Date.now()-1;checks();A(!s.hot,'hot blank cools down');A(s.r.iron===ir0,'cooling loses nothing');
s.hot={until:Date.now()+30000};const ih0=s.r.iron;act('smithhot');A(!s.hot,'hot blank used');A(s.r.iron>=ih0,'hot blank resolved without page');
s.hot={until:Date.now()+30000};s.lastAct=0;const uu=s.hot.until;checks();A(s.hot&&s.hot.until>=uu,'hot blank waits while player away');s.hot=null;
/* Удосконалення зброї без міні-гри */
s.r.steel=50;s.r.coal=50;s.r.iron=50;s.floors.work=1;giveI('oar');s.wm={oar:200};relicFor('hold');s.dlg=[];act('wup','oar');A(wF('oar')===1,'weapon upgraded');A(!MG,'no minigame on upgrade');
/* Велика риба: рідко і лише за бажанням */
s.f.rod=1;s.f.crab1=1;s.c.fish=10;s.bigT=0;s.bite=null;let bites=0,casts=0;for(let n=0;n<600;n++){s.cd={};act('fishing');casts++;if(s.bite){bites++;s.bite=null}}
console.log('bites in',casts,'casts:',bites);A(bites>=1,'big fish bites at all');A(bites<=casts/40,'big fish is rare');
s.bigT=0;for(let n=0;n<400&&!s.bite;n++){s.cd={};s.bigT=0;act('fishing')}A(!!s.bite,'bite appears');s.r.fish=0;const f0=s.r.fish;act('bigfish');A(!s.bite&&s.r.fish>f0,'bigfish resolves');
console.log('fails',fails)`);
