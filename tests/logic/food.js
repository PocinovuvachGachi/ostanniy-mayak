/* Їжа: повільне відновлення біля вогнища, «Поїсти досхочу», комора з місткістю, кухня Зиновія й страви з дією. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.f.looked=1;s.b.hearth=3;s.tabs.hero=1;s.h.on=1;s.lastAct=Date.now();
s.h.hp=1;produce(60);A(s.h.hp<1+60*0.1,'біля вогнища — повільно: '+s.h.hp.toFixed(1));
s.r.fish=3;s.r.prov=10;s.h.hp=maxHP()-30;act('eatfull');A(s.h.hp===maxHP()&&s.r.fish===0&&s.r.prov<10,'поїсти досхочу: спершу риба, потім провізія');
s.r.fish=0;add('fish',100);A(s.r.fish===40&&s.f.capHit,'кошик риби — 40');s.r.prov=0;add('prov',500);A(s.r.prov===100,'провізії — 100');
s.b.cellar=1;add('fish',100);A(s.r.fish===100,'комора: риби 100');s.r.fish=150;add('fish',5);A(s.r.fish===150,'понад місткість — не зникає, але й не росте');
s.b.smoke=1;s.r.prov=capOf('prov');s.r.fish=50;s.r.wood=50;produce(10);A(s.r.fish===50,'коптильня стоїть, коли провізії повно');
s.mst.zinovii=1;s.f.tracks=1;s.f.herbsDone=1;kitTick();s.seen.herb=1;s.r.fish=60;s.r.herb=10;s.r.prov=50;act('cook','soupherb');A(has('soupherb'),'юшка з травами');
s.h.hp=maxHP()-25;act('use','soupherb');A(Date.now()<s.h.buf.warm,'тепло юшки');const r1=regenRate();s.h.buf.warm=0;A(r1>regenRate()*2.5,'тепло — утричі швидше');
for(let i=0;i<5;i++)act('cook','soup');A(rcpKnown('pie'),'Зиновій навчить пиріг');s.r.wood=20;act('cook','pie');A(has('pie'),'пиріг');act('use','pie');
startFight('rats','x');A(s.cb.ap===maxAP()+1&&s.h.buf.full===2,'ситість: +1 ОД у бою');s.cb=null;
/* кухня: вкладка, рецепти, якість */
A(s.tabs.kitchen&&rcpKnown('soup')&&rcpKnown('ash')&&rcpKnown('soupherb')&&!rcpKnown('dried'),'рецепти від людей');s.vq={t:{widow:1}};kitTick();A(rcpKnown('dried'),'Оксана вчить в’ялити');
s.r.fish=40;s.r.prov=40;const n0=s.inv.soup||0;cookDone('soup',2);A(s.inv.soup===n0+2,'добре кипіння — дві порції');cookDone('soup',3);A(s.inv.soup_t===2&&IT.soup_t.v>IT.soup.v,'рівно до кінця — дві смачні');
const f0=s.r.fish;act('cookp','ash');A(s.r.fish===f0-3&&has('ash'),'звично — одна порція');
console.log('fails',fails)`);
