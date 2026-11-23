require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.r.ember=1e5;s.r.iron=50;s.r.steel=50;s.r.coal=50;s.b.forge=1;s.floors.work=1;giveI('oar');s.wm={oar:200};s.dlg=[];
act('wup','oar');A(!wF('oar'),'no relic -> no upgrade');
relicFor('hold');A(has('r_oar1'),'relic given');console.log(s.dlg.map(d=>d.title+' :: '+d.body.replace(/<[^>]*>/g,' ')).join('\\n'));
act('wup','oar');A(wF('oar')===1,'upgraded');A(!has('r_oar1'),'relic used');
relicFor('hold');A(!has('r_oar1'),'not given twice');
s.dlg=[];relicFor('mine1');console.log(s.dlg[0].body.replace(/<[^>]*>/g,' '));
s.bdSeen={};s.dlg=[];checks();const bp=s.dlg.find(d=>d.k==='plan');A(bp,'plan dlg');if(bp)console.log(bp.title,(bp.body.match(/bpn">[^<]*/g)||[]).join(','));
s.tab='work';const h=rWork();console.log(h.slice(h.indexOf('Кузня'),h.indexOf('Кузня')+900).replace(/<[^>]*>/g,' ').replace(/\\s+/g,' '));
console.log('fails',fails)`);
