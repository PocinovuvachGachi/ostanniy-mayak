require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.f.looked=1;s.b.hearth=1;s.floors.work=1;s.floors.gallery=1;s.f.boat=1;s.f.people=1;s.pop=4;s.b.house=2;s.f.won=1;for(const k of RES){s.seen[k]=1;s.r[k]=9000}s.floors.lantern=1;s.floors.study=1;s.tabs={home:1,shore:1,tower:1,map:1,hero:1};s.h.bg='old';
s.flotT=Date.now()-1;shoreTick();A(s.flot,'flot appeared '+(s.flot&&s.flot.k));const c0=s.r.coin;act('flot');A(!s.flot,'flot taken');
act('exp','salvage');A(s.exp.length===1&&freeW()===1,'exp started free '+freeW());act('exp','fish');A(s.exp.length===1,'not enough crew');
s.exp[0].until=Date.now()-1;const sc=s.r.scrap;shoreTick();A(s.exp.length===0&&s.r.scrap>sc,'exp done');
s.shipT=Date.now()-1;shoreTick();A(s.ship&&s.ship.offers.length===3,'ship');act('trade',0);A(s.ship.done.length===1,'traded');
s.lostT=Date.now()-1;beamTick();A(s.lost,'lost ship');const sec=s.lost.sec;act('beam',sec);beamTick();A(!s.lost&&s.saved===1,'saved');
act('flsel','hall');act('flu','hall');A(s.fu.hall,'flu hall');act('flu','lantern');A(s.fu.lantern,'prism');
s.tab='tower';render();s.tab='shore';render();s.tab='hero';s.ht='talents';render();
s.floors.gallery=1;s.f.siege1=1;act('flu','gallery');s.threat=90;s.dlg=[];raidCheck();A(s.raidWarn===1,'raid warn');
s.h.lvl=9;s.raidT=Date.now()-1;s.dlg=[];raidCheck();act('raidGo');A(s.cb&&abList().includes('beam'),'beam ability');const u=s.cb.u[0];s.cb.sel=0;s.cb.ap=5;s.cb.hx=u.x-2;s.cb.hy=u.y;const hp0=u.hp;act('c_ab','beam');A(u.hp<hp0,'beam hit '+hp0+'->'+u.hp);
console.log('tabKeys tower',tabKeys('tower'),'shore',tabKeys('shore'));
console.log('fails',fails);
`);
