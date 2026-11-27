require('../harness.js')(`
let fails=0;function A(c,m){if(!c){fails++;console.log('FAIL',m)}}
let raw;
localStorage.setItem=(k,v)=>{raw=v};
localStorage.getItem=()=>raw;
const drain=()=>{while(s.dlg.length)act('dlgok')};
const harvest=(id)=>{s.cd[id]=0;act(id);shoreFindTick()};
const openShelf=()=>{act('tab','tower');act('bpop','cl:shelf')};
const inspect=id=>act('shelfInspect',id);
const pools=(cycle=0)=>{s.tideEpoch=Date.now()-600_000-900_000*cycle;s.f.tideSeen=1};

s=fresh();s.tab='shore';s.tabs.shore=1;s.tabs.tower=1;s.tabs.journal=1;
let draws=0;Math.random=()=>{draws++;return 0};
harvest('gather');
A(s.r.wood===1&&s.c.gather===1&&onCd('gather')&&!s.odd.seaglass&&!draws,'до вогнища працює звичайний збір без розіграшу');
s.b.hearth=1;
while(s.c.gather<18){harvest('gather');drain()}
A(s.pages.includes(1)&&!s.odd.seaglass,'запис Остапа і перші 18 зборів збережено');
act('gather');shoreFindTick();
A(s.c.gather===18&&!s.odd.seaglass,'черга знахідок не обходить відновлення');
s.cd.gather=0;act('gather');
dlg({k:'story',title:'Сюжетний поріг'});
shoreFindTick();
A(!s.odd.seaglass&&!draws,'сюжет між дією та наступним тактом має пріоритет');
drain();
s.tutPending=['rod'];s.f.rod=1;
harvest('gather');
A(!s.odd.seaglass&&!draws,'готовий урок має пріоритет');
s.tutPending=[];
while(s.c.gather<23){harvest('gather');drain()}
A(!s.odd.seaglass,'морське скло не раніше 24-го збору');
const before=s.h.xpb||0;
harvest('gather');
A(s.odd.seaglass&&!s.odd.woodhorse&&s.r.wood>=21&&(s.h.xpb||0)===before,'збір дає плавник і тільки одну знахідку без досвіду');
A(s.dlg[0]?.gains.length===0,'у знахідки немає лічильника або XP');
drain();
while(s.c.gather<94){harvest('gather');drain()}
A(!s.odd.woodhorse,'коник не випадає одразу після скла');
const beforeHorse=s.h.xpb||0;
Math.random=()=>0.0085;harvest('gather');
A(!s.odd.woodhorse&&s.shoreFindMiss.gather===1,'початковий шанс коника 0,8 відсотка');
save();load();
harvest('gather');drain();
A(s.odd.woodhorse&&s.shoreFindMiss.gather===0,'невдала спроба зберігається і підвищує шанс');
const beforePool=draws;Math.random=()=>{draws++;return 0};harvest('gather');
A(draws===beforePool&&(s.h.xpb||0)===beforeHorse,'після вичерпання пулу нема розіграшу й досвіду');
A(!OD.woodhorse.gift.ready(),'до зустрічі Петрик недоступний');
openShelf();inspect('woodhorse');act('shelfGive','woodhorse');
A(!s.oddFate.woodhorse&&!shelfPopHTML().includes('Подарувати Петрикові'),'до зустрічі коника можна лише оглядати');
act('tab','shore');
s.f.wreck=1;s.c.fish=5;
for(let i=0;i<17;i++)harvest('scrapw');
A(!s.odd.oldhook&&s.r.scrap===17&&onCd('scrapw'),'гак чекає шести закидань та 18 розборів, брухт і відновлення штатні');
s.f.tideSeen=1;s.f.crab1=1;act('fishing');drain();
harvest('scrapw');
A(s.odd.oldhook&&s.c.fish===6&&s.r.scrap===18,'гачок після освоєння вудки видається поряд із брухтом');
drain();
const fishBefore=s.r.fish;
harvest('pool');A(s.r.fish===fishBefore&&!s.odd.amberbit,'калюжі під водою не дають знахідок');
pools();harvest('pool');drain();
for(let i=0;i<3;i++){harvest('pool');drain()}
A(Object.keys(s.odd).filter(k=>OD[k]?.set==='shells').length===1&&!s.oset.shells,'не більше однієї мушлі за відплив');
save();load();harvest('pool');drain();
A(Object.keys(s.odd).filter(k=>OD[k]?.set==='shells').length===1,'reload не скидає ліміт циклу');
pools(1);harvest('pool');drain();pools(2);harvest('pool');drain();
A(s.oset.shells&&s.h.pts===1&&!s.odd.amberbit&&s.r.fish>fishBefore,'мушлі мають пріоритет, їхня нагорода й риба збережені');
while(s.c.pool<17){harvest('pool');drain()}
pools(3);harvest('pool');
A(s.odd.amberbit&&onCd('pool'),'після освоєння калюж і наступного циклу може трапитися бурштин');
drain();
s.dlg=[];s.f.horpyna=0;s.shf='horpyna';act('shfgo');drain();
openShelf();act('shelfGive','seaglass');inspect('woodhorse');
const giftXP=s.h.xpb||0;act('shelfGive','woodhorse');act('shelfGive','woodhorse');
A(s.oddFate.woodhorse&&s.odd.woodhorse&&!s.oddFate.seaglass&&(s.h.xpb||0)===giftXP&&s.dlg.length===1,'лише коник має одноразову передачу без XP');
A(shelfIcon('woodhorse')==='lore'&&shelfPopHTML().includes(OD.woodhorse.gift.record),'замість предмета на полиці є пам’ятний запис');
drain();save();load();
A(s.oddFate.woodhorse&&s.odd.woodhorse&&s.oset.shells,'передача й зібраний набір переживають reload');

// Пропустити ранні розмови через штатні події, повернутися з Причалу.
s=fresh();s.b.hearth=1;s.tabs.shore=1;s.tabs.tower=1;s.tabs.journal=1;s.tab='shore';
s.shf='zinovii';act('shfgo');drain();shfWin('rats');
A(s.odd.logpage&&!s.oddRead.logpage&&!oddDocumentIds().includes('logpage'),'знайдений журнал відокремлено від прочитаного');
drain();A(oddDocumentIds().includes('logpage'),'прочитане вікно лишає текст у журналі');
s.f.gullrack=1;s.f.crab1=1;s.dbgTide='high';__adv(360_000);s.lastAct=Date.now();
shfTick();A(s.shf==='tracks','сліди з моря з’являються після пацюків');
act('shfgo');drain();
A(s.f.tracks&&s.tabs.kitchen&&!s.f.martinLogStory,'кухню відкрито без розмови про сторінку');
s.f.horpyna=1;s.dbgTide='low';s.r.fish=10;s.shf='seal';act('shfgo');drain();
for(let i=0;i<3;i++){s.sealCyc=tideCyc()-1;s.shf='sealgift';act('shfgo');drain()}
A(s.oset.martin&&s.f.martinSet&&!s.f.martinLadleStory,'набір і прощання завершено без розмови про черпак');
s.f.fordSeen=1;s.f.siege1=1;for(const k of RES)s.r[k]=1000;
for(const part of FORD){act('ford',part.id);drain()}
act('go','village');A(s.at==='village','після броду дійсно перейшли до Причалу');drain();
act('leave');s.jt='odd';save();
const old=JSON.parse(raw);delete old.oddRead;delete old.oddFate;delete old.shoreFindMiss;
raw=JSON.stringify(old);load();
A(s.jt==='goals'&&s.odd.logpage&&s.odd.mladle&&s.oset.martin&&oddDocumentIds().includes('logpage'),'старе збереження переносить журнал і набір');
openShelf();inspect('mladle');
const fp=s.h.fp,xp0=s.h.xpb,tracksT=s.tracksT,ratsT=s.ratsT;
A(shelfPopHTML().includes(MARTIN_LADLE_LABEL),'черпак можна показати після прощання');
act('martinLadle');A(s.dlg[0]?.body.includes('після прощання'),'ретроспективна репліка про черпак');drain();act('martinLadle');
inspect('logpage');A(shelfPopHTML().includes(MARTIN_LOG_LABEL),'сторінку можна показати після слідів');
act('martinLog');A(s.dlg[0]?.body.includes('Пам’ятаєш сліди'),'ретроспективна репліка про сторінку');drain();act('martinLog');
A(!s.dlg.length&&s.h.fp===fp&&s.h.xpb===xp0&&s.tracksT===tracksT&&s.ratsT===ratsT,'пізні розмови одноразові й не повторюють нагороди та відкриття');
act('tab','shore');s.cd.gather=0;
while(s.c.gather<24){harvest('gather');drain()}
A(s.odd.seaglass,'після повернення з Причалу нова берегова знахідка ще доступна');
console.log('fails',fails)
`);
