require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
s.f.looked=1;s.tabs.hero=1;s.h.bg='old';s.disc.village=1;for(const k of RES){s.seen[k]=1;s.r[k]=200}
act('go','village');act('la','village.tavern.talk');checks();A(!s.tabs.folk,'одна громада — без вкладки');s.seenE.scout=1;checks();A(s.tabs.folk,'folk tab');s.fac.rot=20;act('la','village.hut.talk');s.r.herb=10;act('la','village.hut.give');A(fac('rot')===35,'rot 35 '+fac('rot'));
checks();A(s.req.rot,'rot request');const q=s.req.rot;act('leave');act('tab','folk');render();for(const k of RES)s.r[k]=200;act('freq','rot');A(fac('rot')===41,'req done '+fac('rot'));A(!s.req.rot,'req cleared');
console.log('dialogs',s.dlg.map(d=>d.title).join(' | '));
s.f.gnat=1;s.met.gnat=1;s.dlg=[];for(let i=0;i<3000&&!s.f.evRef;i++)folkTick();A(s.f.evRef,'refugee event');act('evr','keep');A(fac('silent')===-35,'silent '+fac('silent'));
s.f.people=1;s.pop=2;s.met.hanna=1;s.dlg=[];for(let i=0;i<5000&&!s.f.evFam;i++)folkTick();A(s.f.evFam,'famine');s.r.prov=40;act('evf','give');A(s.r.prov===10,'famine prov');
s.fac.rot=55;A(LOC.village.spots.find(x=>x.id==='hut').acts.find(a=>a.id==='healf').show(),'free heal');
s.disc.cape=1;checks();s.tab='folk';render();console.log('folk keys',tabKeys('folk'));
console.log('fails',fails);
`);
