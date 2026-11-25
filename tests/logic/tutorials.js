/* Навчання: порядок, одноразовість, довідник і міграція. */
require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s=fresh();NOGAP=0;s.lastAct=Date.now();
A(!tutIds().length,'на початку довідник порожній');
tutOffer('ford');tutRead('map');A(!s.tutPending.length&&!s.dlg.length,'недоступні механіки не показуються');
act('blow');A(s.tutPending.includes('ember'),'перший урок заплановано');
dlg({k:'story',title:'Історія',body:'Текст світу'});tutTick();A(s.dlg.length===1&&s.dlg[0].k==='story','не перебиває сюжет');
act('dlgok');tutTick();A(s.dlg[0].k==='tutorial'&&s.dlg[0].tut==='ember'&&tutKnown('ember'),'урок після сюжету');
act('dlgok');tutOffer('ember');tutTick();A(!s.dlg.length&&!s.tutPending.length,'урок одноразовий');
act('tutList');A(s.dlg[0].tutList&&s.dlg[0].body.includes('Жарина')&&!s.dlg[0].body.includes('Мапа'),'довідник без спойлерів');
act('tutRead','ember');A(s.dlg[0].tut==='ember'&&!s.dlg[0].crabw,'повторний перегляд');act('dlgok');
s.tabs.shore=1;tutOffer('shore');s.lastAct=Date.now()-300000;tutTick();A(!tutKnown('shore'),'не перебиває відсутнього гравця');
s.lastAct=Date.now();tutTick();A(tutKnown('shore'),'урок після повернення');act('dlgok');
s.f.crabWarn=1;crabWarn();A(s.dlg[0].k==='fight'&&!s.dlg[0].body.includes('Кінець ходу'),'сюжет першого бою окремо');act('tutFight');A(s.dlg[0].k==='tutorial'&&s.dlg[0].crabw&&tutKnown('combat')&&!s.cb,'навчання перед боєм');act('fightGo','crab1');A(!!s.cb,'бій запускається після уроку');
s=fresh();s.tabs.shore=1;s.f.rod=1;s.tot.ember=40;tutMigrate();A(tutKnown('ember')&&tutKnown('shore')&&tutKnown('rod')&&!tutKnown('tide')&&!s.dlg.length,'старе збереження отримує лише відомі уроки без вікон');
s.pop=1;tutMigrate();s.pop=0;A(tutIds().includes('people'),'отриманий урок не зникає');
console.log('fails',fails)`);
