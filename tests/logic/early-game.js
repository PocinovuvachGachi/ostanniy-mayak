require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
function T(n){for(let i=0;i<n;i++){produce(1);checks()}}
function clickN(a,i,n){for(let k=0;k<n;k++){s.cd={};act(a,i);checks()}}
T(11);act('look');clickN('gather','',11);act('bld','hearth');clickN('gather','',60);
A(s.odd.gull,'odd gull');A(s.h.lvl===1&&s.h.xpb>=20,'xp banked '+s.h.lvl+' '+s.h.xpb);
A(isNew('home'),'home badge');s.tab='shore';render();
T(80);s.r.wood+=60;s.r.scrap+=20;s.r.ember+=200;act('floor','work');act('craft','rod');act('craft','oar');
clickN('fishing','',5);while(s.dlg[0]&&!s.dlg[0].crabw)act('dlgok');act('fightGo','crab1');botFight();A(s.tabs.hero&&!s.dlg.some(d=>d.bgsel),'hero, no bg yet');s.tab='hero';render();s.h.lvl=Math.max(3,s.h.lvl);for(let q=0;q<6&&!s.dlg.some(d=>d.bgsel);q++){s.dlg=[];for(const k in s.nv)s.nvU[k==='tal'?'talents':k]=1;novTick()}A(s.h.lvl>=2,'banked xp applied lvl '+s.h.lvl);
A(s.dlg.some(d=>d.bgsel),'bg dialog');const fp0=s.h.fp;act('bg','carpenter');A(s.h.bg==='carpenter'&&s.h.a.str===3&&s.h.k.melee===1&&s.h.fp===fp0+1,'bg applied');
A(!s.dlg.some(d=>d.bgsel),'bg dlg removed');A(featOk(FT.find(f=>f.id==='trip')),'trip ok');s.nvU.grow=1;s.dlg=[];s.h.lvl=Math.max(4,s.h.lvl);for(let q=0;q<6&&!s.nv.tal;q++){s.dlg=[];for(const k in s.nv)s.nvU[k==='tal'?'talents':k]=1;novTick()}A(s.nv.tal&&s.dlg.some(d=>d.title==='Таланти'),'talents released');
act('tab','talents');render();act('tsel','heavy');render();act('feat','trip');A(s.h.ft.trip,'trip taken');act('feat','grip');
console.log('dialog titles:',s.dlg.map(d=>d.title).join(' | '));
console.log('U test:',U(WT.knife.tr),'|',U(FT.find(f=>f.id==='trader').d));
console.log('chs',s.chs,'bts',Object.keys(s.bts).join(','));
s.tab='map';render();act('tab','work');render();A(!isNew('work'),'work seen');
console.log('fails',fails);
`);
