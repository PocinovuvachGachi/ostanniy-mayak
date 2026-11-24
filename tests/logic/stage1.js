/* Етап I: граблі, три камені й сховок, бої на острівці, люди з іменами, полиця з наборами. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.f.looked=1;s.b.hearth=2;s.f.wreck=1;s.tabs.shore=1;s.floors.work=1;
s.r.wood=99;s.r.scrap=99;s.r.iron=9;act('craft','rake');A(has('rake'),'граблі');s.cd={};const sc=s.r.scrap;act('scrapw');A(s.r.scrap-sc>=2,'граблі дають більше брухту');
s.f.crab1=1;act('rune','a');A(s.runes.a,'перший камінь');act('rune','c');A(!s.runes.c,'третій — лише з Петриком');
s.f.rats=1;s.dbgTide='low';act('rune','b');s.f.horpyna=1;act('rune','c');A(runesAll(),'три камені');const sp=s.h.sp;act('cache');A(s.f.cache&&s.h.sp===sp+1&&s.odd.keeperkey,'сховок: очко умінь і дивина');
s.lastAct=Date.now();s.shf='';s.f.gullrack=0;s.r.fish=20;s.eq.weapon='oar';shfTick();A(s.shf,'подія на березі спливає');
s.shf='zinovii';act('shfgo');A(s.mst.zinovii&&s.f.people,'Зиновій приходить');
for(const k of['spiral','pearl'])odd(k);const pts=s.h.pts;collFind('pool');A(s.oset&&s.oset.shells&&s.h.pts===pts+1,'набір мушель дає очко характеристик');

/* сліди → юшка → утопленик чекає слідів */
const tick=()=>{s.lastAct=Date.now();shfTick()};s.f.gullrack=1;s.f.zinovii=1;s.dbgTide='high';
s.shf='';s.f.rats=1;s.ratsT=Date.now();s.f.tracks=0;s.h.lvl=3;s.dbgPh='n';tick();A(s.shf!=='tracks'&&s.shf!=='drown1','сліди не одразу після пацюків');
s.shf='';s.ratsT=Date.now()-6*60000;delete s.shfT.drown1;tick();A(s.shf==='tracks','сліди з моря');act('shfgo');A(s.f.tracks&&s.mst.zinovii,'казан Зиновія відкрився');
s.r.fish=20;s.r.prov=5;act('cook','soup');A(has('soup'),'юшка зварена');
s.shf='';tick();A(s.shf==='drown1','утопленик після слідів');s.shf='';s.f.drown1=1;
/* тюлень і речі з «Мартина» */
s.f.horpyna=1;s.dbgTide='low';s.r.fish=3;s.shf='seal';act('shfgo');A(!s.f.seal,'без риби тюлень не приручається');
s.r.fish=10;s.shf='seal';act('shfgo');A(s.f.seal&&s.r.fish===5,'тюлень бере 5 риби');
s.shf='';tick();A(s.shf!=='sealgift','дарунок — не в той самий відплив');
odd('logpage');const fp=s.h.fp;for(let k=0;k<3;k++){s.sealCyc=-1;s.shf='sealgift';act('shfgo')}
A(['mplate','mbell','mladle'].every(k=>s.odd[k]),'тюлень приносить речі з «Мартина»');A(s.oset.martin&&s.h.fp===fp+1,'набір «Мартина» дає талант');
s.sealCyc=-1;s.shf='sealgift';const sc0=s.r.scrap+s.r.oil+s.r.fish;act('shfgo');A(s.r.scrap+s.r.oil+s.r.fish>sc0,'далі тюлень носить дрібниці');
/* вогник за протокою — після облоги */
s.shf='';s.f.siege1=0;tick();A(s.shf!=='signal','вогник лише після облоги');s.f.siege1=1;s.sigT=Date.now()-4*60000;tick();A(s.shf==='signal','вогник за протокою');act('shfgo');A(s.f.signal,'відповів вогнем');
console.log('fails',fails)`);
