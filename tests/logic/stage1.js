/* Етап I: граблі, три камені й сховок, бої на острівці, люди з іменами, полиця з наборами. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.f.looked=1;s.b.hearth=2;s.f.wreck=1;s.tabs.shore=1;s.floors.work=1;
s.r.wood=99;s.r.scrap=99;s.r.iron=9;act('craft','rake');A(has('rake'),'граблі');s.cd={};const sc=s.r.scrap;act('scrapw');A(s.r.scrap-sc>=2,'граблі дають більше брухту');
s.f.crab1=1;act('rune','a');A(s.runes.a,'перший камінь');act('rune','c');A(!s.runes.c,'третій — лише з Петриком');
s.f.rats=1;s.dbgTide='low';act('rune','b');s.f.horpyna=1;act('rune','c');A(runesAll(),'три камені');const sp=s.h.sp;act('cache');A(s.f.cache&&s.h.sp===sp+1&&s.odd.keeperkey,'сховок: очко умінь і дивина');
s.lastAct=Date.now();s.shf='';s.f.gullrack=0;s.r.fish=20;shfTick();A(s.shf,'подія на березі спливає');
s.shf='zinovii';act('shfgo');A(s.mst.zinovii&&s.f.people,'Зиновій приходить');
for(const k of['spiral','pearl'])odd(k);const pts=s.h.pts;collFind('pool');A(s.oset&&s.oset.shells&&s.h.pts===pts+1,'набір мушель дає очко характеристик');
console.log('fails',fails)`);
