/* Сушіння: доступність, партії, збереження, чайки і перехід до коптильні. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s=fresh();NOGAP=0;s.lastAct=Date.now();s.tabs.shore=1;s.f.rod=1;s.f.crab1=1;s.f.wreck=1;s.floors.work=1;s.eq.weapon='oar';s.r.wood=50;s.r.scrap=20;s.r.fish=20;
const smoke=BD.find(b=>b.id==='smoke'),rake=RC.find(r=>r.id==='rake');
A(!smoke.show0()&&!SHF.gullrack.ok(),'до сушіння чайки і коптильня недоступні');
s.c.fish=7;dryTick();A(!s.f.dryPlan,'сушарня після освоєння риболовлі');
s.c.fish=8;dryTick();A(s.f.dryPlan,'відкрилася сушарня');s.dlg=[];
act('drybuild');A(s.f.dryRack&&s.r.wood===38&&s.r.scrap===18,'ціна сушарні');act('drybuild');A(s.r.wood===38,'не можна збудувати двічі');
act('dryload');A(dryBusy()&&s.r.fish===16&&SHF.gullrack.ok(),'риба на сушарні запускає сюжет');
act('dryload');act('drytake');A(s.r.fish===16&&s.r.prov===0,'не можна дублювати партію чи взяти завчасно');
s.play+=DRYT;dryTick();A(dryReady(),'партія готова');s.r.prov=capOf('prov');act('drytake');A(dryReady(),'повний запас не втрачає партію');
s.r.prov=0;act('drytake');A(!dryBusy()&&s.r.prov===1&&s.f.dryMade,'провізія після сушіння');act('drytake');A(s.r.prov===1,'без дублювання нагороди');
s.f.zinovii=1;A(smoke.show0(),'Зиновій відкриває коптильню');s.f.zinovii=0;s.bdSeen={smoke:1};A(smoke.show0(),'старе креслення не втрачається');
s.c.scrap=7;A(!rake.req(),'граблі після досвіду розбору');s.c.scrap=8;A(rake.req()&&!rake.c.iron,'граблі до кузні');s.rcSeen={rake:1};act('craft','rake');A(has('rake'),'граблі з дерева й брухту');s.cd={};const sc=s.r.scrap;act('scrapw');A(s.r.scrap===sc+2,'граблі покращують збір');
console.log('fails',fails)`);
