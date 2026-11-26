/* Автоматичне виробництво зберігає запаси; ручний дозвіл діє лише на обрану будівлю. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.b.hearth=3;s.b.forge=1;s.b.smoke=1;s.r.wood=200;s.r.scrap=20;s.r.ember=200;s.r.fish=15;
produce(300);A(s.r.wood>=10-1e-7&&s.r.scrap>=6-1e-7&&s.r.ember>=160-1e-7&&s.r.fish>=8-1e-7,'резерви не витрачаються навіть довгим офлайн-кроком');
A(s.r.iron>0&&s.r.prov>0,'надлишок перетворюється на продукцію');
const old=JSON.stringify(s.r);rates();A(JSON.stringify(s.r)===old,'прогноз rates не витрачає запаси');
s.r.wood=5;s.r.scrap=3;s.r.fish=4;s.r.ember=100;produce(1);
A(s.r.wood>=5&&s.r.scrap>=3&&s.r.fish>=4&&s.r.ember>=100,'нижче резерву запас не зменшується автоматично');
s.r.wood=10;s.r.fish=8;act('reserve','smoke');A(!reserveOn('smoke')&&reserveOn('hearth')&&reserveOn('forge'),'дозвіл лише для коптильні');
produce(10);A(s.r.fish<8,'ручний дозвіл витрачає резерв');act('reserve','smoke');A(reserveOn('smoke'),'захист можна повернути');
s.r.wood=10;pay({wood:2});A(s.r.wood===8,'ручні витрати не обмежуються резервом');
s=fresh();s.b.forge=1;s.b.steel=1;s.b.smoke=1;
Object.assign(s.r,{ember:160,scrap:20,coal:10,iron:10,fish:20,wood:40,prov:capOf('prov')});
const forecast={};
const resources=JSON.stringify(s.r);
A(JSON.stringify(flow(1,true,forecast))===JSON.stringify(flow(1,true))&&JSON.stringify(s.r)===resources,'діагностика не змінює потоки й запаси');
A(forecast.steel.ratio===0&&forecast.steel.limits.some(x=>x.k==='ember'&&x.reserved),'кузня витратила доступний жар до сталеварні');
A(forecast.smoke.full==='prov'&&forecast.smoke.ratio===0,'повний запас провізії зупиняє коптильню');
console.log('fails',fails)`);
