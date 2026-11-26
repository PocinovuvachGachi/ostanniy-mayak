/* ============ ACTIONS ============ */
function act0(a,i){
  if(a.indexOf('c_')===0){cAct(a,i);return}
  if(a==='tclose'){const at=+i;for(const x of s.log)if(x&&x.at===at)x.cl=1;lastToast=null;dirty=1;return}
  if(a==='tutList'){tutLibrary();return}
  if(a==='tutRead'){tutRead(i);return}
  if(a==='tutFight'){tutFight();return}
  if(a==='dlgok'){(s.dlg||[]).shift();dirty=1;return}
  if(a==='bellOpen'){s.bellHold=0;dirty=1;return}
  if(a==='bellDefer'){s.bellHold=1;dirty=1;return}
  if(a==='bpop'){popB=popB===i?'':(i||'');dirty=1;return}
  if(a==='hsgo'||a==='hsbd'){hlT=(a==='hsbd'?'bd-':'sec-')+i;dirty=1;return}
  if(a==='novgo'){(s.dlg||[]).shift();if(!s.cb&&s.tabs.hero){s.tab='hero';s.ht=i}dirty=1;return}
  if(a==='dlggo'){(s.dlg||[]).shift();if(!s.cb&&s.tabs[i])s.tab=i;dirty=1;return}
  if(a==='evr'){(s.dlg||[]).shift();if(i==='keep'){trust('silent',15,'ти прихистив утікача');trust('rot',-10,'у Причалі незадоволені');if(s.f.people&&(s.pop||0)<2*(s.b.house||0)){s.pop++;say('Колишній Мовчун лишається біля маяка й обіцяє працювати.','world')}else{add('coin',10);say('Вранці він іде, лишивши кілька монет і подяку.','world')}}
    else if(i==='away'){trust('rot',3);say('Ти зачиняєш двері. Кроки віддаляються в туман.','world')}else{trust('rot',15,'ти видав Мовчуна');trust('silent',-15,'ти видав свого');add('coin',20)}dirty=1;return}
  if(a==='evf'){(s.dlg||[]).shift();if(i==='give'){const g=Math.min(30,Math.floor(s.r.prov));s.r.prov-=g;const n=Math.round(15*g/30);trust('rot',Math.max(2,n),'ти нагодував Причал');say(`Ти віддаєш ${R('prov',g)}. Ганна мовчки тисне тобі руку.`,'world')}else{trust('rot',-8,'ти відмовив голодним')}dirty=1;return}
  if(a==='fightGo'){(s.dlg||[]).shift();if(i==='crab1'&&!s.f.crab1&&!s.cb){tutRemember('combat');if(!s.eq.weapon){if(!has('oar'))giveI('oar');else if(packHas('oar'))s.eq.weapon='oar'}s.tab='shore';startFight('crab1','crab1')}dirty=1;return}
  if(a==='bg'){const B=BGS[i];if(!B||s.h.bg)return;for(const k in B.a)s.h.a[k]+=B.a[k];for(const k in B.k)s.h.k[k]+=B.k[k];s.h.bg=i;s.h.fp++;s.h.hp=maxHP();s.dlg=(s.dlg||[]).filter(d=>!d.bgsel);
    say(`Ти згадуєш: колись ти був — ${B.n.toLowerCase()}. Минуле ще дасть про себе знати.`,'info');dirty=1;return}
  if(a==='raidGo'||a==='raidHide'){(s.dlg||[]).shift();raidResolve(a==='raidGo');dirty=1;return}
  if(a==='reset'){resetAsk=1;dirty=1;return}
  if(a==='resetNo'){resetAsk=0;dirty=1;return}
  if(a==='resetYes'){s=fresh();resetAsk=0;save();dirty=1;return}
  if(s.cb)return;
  const F=s.f;
  switch(a){
  case 'tab':popB='';if(SUBT[i]){if(s.tabs[i]){zoomPrep(i);s.tab='tower';ttGo(i)}break}if(s.tabs[i]){zoomPrep(i);s.tab=i;delete s.newTab[i];snap9(i)}break;
  case 'chok':s.chSeen=s.chs.length;break;
  case 'jt':s.jt=i;break;
  case 'look':if(!F.looked&&s.tot.ember>=10){F.looked=1;unlock('shore');say('Ти в нижній залі маяка. Сходи вгору тонуть у темряві, крізь щілину дверей чути море. Жарині потрібне паливо. Відкрито: Берег.','story')}break;
  case 'blow':if(!s.b.hearth&&!onCd('blow')){setCd('blow',2);add('ember',3);s.c.blow=(s.c.blow||0)+1;tutOffer('ember')}break;
  case 'hook':if(shoreHookReady()&&afford(HOOKC)){pay(HOOKC);F.hook=1;novUse('tool:hook');tutOffer('hook');dlg({k:'find',title:'Багор',img:{t:'ob',k:'hook3',f:'hookObj3'},body:'<p>Ти прив’язуєш до довгої жердини зігнутий цвях із уламків. Тепер плавник, що пропливає за кілька кроків від берега, теж твій.</p>'})}break;
  case 'gather':if(!onCd('gather')){setCd('gather',1);add('wood',wolf()*(F.hook?2:1));s.c.gather++;
    if(s.c.gather===6){say('Між водоростями блищить пляшка, заткнута воском. Усередині записка. Відкрито: Журнал.','story');page(1)}
    if(s.c.gather===60)odd('gull','У плавнику застрягла вирізана з дерева чайка.')}break;
  case 'drybuild':dryBuild();break;
  case 'dryload':dryLoad();break;
  case 'drytake':dryTake();break;
  case 'pool':poolPick();break;
  case 'ford':fordPart(i);break;
  case 'shfgo':shfGo();break;
  case 'rune':runeRead(i);break;
  case 'wfeed':wolfFeed();break;
  case 'wname':wolfName(i||null);break;
  case 'wlearn':wLearn(i);break;
  case 'wlesson':wLesson();break;
  case 'three':threeLights();break;
  case 'cache':cacheOpen();break;
  case 'martinLadle':martinLadleTalk();break;
  case 'scrapw':if(F.wreck&&!onCd('scrapw')){setCd('scrapw',2);s.c.scrap=(s.c.scrap||0)+1;add('scrap',1+(s.rs.metal?1:0)+(s.h.ft.thrifty?1:0)+(has('rake')?1:0))}break;
  case 'fishing':if(F.rod&&!onCd('fishing')){setCd('fishing',3);if(!s.bite&&s.c.fish>=6&&F.crab1&&Date.now()-(s.bigT||0)>240000&&Math.random()<1/6){s.bigT=Date.now();if(mgHabit('fish')||s.quickMG){s.c.fish++;mgRun('fish',mgFish,fishEnd);break}s.bite={until:Date.now()+30000};say('Вудка вигнулася дугою: щось велике тягне линву!','find');break}add('fish',wolf());s.c.fish++;
    if(!F.crab1&&!F.crabWarn&&s.c.fish>=5){F.crabWarn=1;crabWarn()}}break;
  case 'bld':{const b=i==='hearth'?HEARTH:BD.find(x=>x.id===i);if(!b||(!noGap()&&i!=='hearth'&&!s.b[i]&&!b.show())||(b.max&&(s.b[i]||0)>=b.max))break;const c=bCost(b);if(afford(c)){pay(c);s.b[i]=(s.b[i]||0)+1;if(i==='hearth')tutOffer('hearth');novUse('b:'+i);upT[i]=Date.now();if(typeof setTimeout==="function")setTimeout(()=>{dirty=1},1700);
    say(i==='hearth'&&s.b[i]===1?'Ти складаєш вогнище з плавника й кладеш у нього жарину. Полум’я оживає, а приплив тепер сам приносить трохи плавника до порогу.':`${b.n}: рівень ${s.b[i]}.`,'world')}break}
  case 'floor':{const ix=FL.findIndex(x=>x.id===i),f=FL[ix];if(!f||s.floors[i])break;if(ix>0&&!s.floors[FL[ix-1].id])break;
    if((f.req&&!f.req())||!afford(f.c,f.it))break;pay(f.c,f.use);s.floors[i]=1;
    if(i==='work'){unlock('work');say('Майстерня знову пахне смолою й залізом. На верстаку знову можна працювати.','story')}
    if(i==='gallery'&&!s.f.fordSeen){s.f.fordSeen=1;dlg({k:'story',title:'Вогні за протокою',img:{t:'scene',id:'shore'},body:'<p>З оглядової далеко видно. За протокою, на великому острові, ночами горять вогні — там живуть люди. А на відпливі з води виходить смуга каміння: брід. Позначити б його, щоб не збитися в тумані.</p>',gains:['Відкрилося: брід на відпливі']});tutOffer('ford')}
    if(i==='study'){unlock('study');say('Ключ Ганни підходить. Відкрито: Кабінет.','story')}
    if(i==='lantern')say('Ліхтарню відбудовано. Лінза стоїть у рамі, але дзеркала треба налаштувати, щоб світло пішло в море.','story');
    dlg({k:'story',title:`Відновлено: ${f.n}`,img:{t:'yard'},body:`<p>${f.d}</p>`,gains:[{work:'Майстерня відновлена',gallery:'З оглядової видно брід за протокою',study:'Відкрилися: дослідження, книги й скриня Остапа',lantern:'Відкрилося: налаштування дзеркал, щоб запалити маяк'}[i]]});
    break}
  case 'mirror':if(s.floors.lantern&&!F.won&&s.mirrors[i]){s.mirrors[i]=s.mirrors[i]==='/'?'\\':'/';if(beam().out){F.won=1;dlg({k:'story',title:'Маяк горить',img:{t:'yard'},body:'<p>Промінь пробиває вікно ліхтарні й лягає на воду. Великий вогонь маяка горить над шхерами, а Мла відступає.</p><p>Але це ще не кінець. Наступного ранку до Гнилого Причалу заходить чужий корабель.</p>',gains:['Кораблі платять мито: +2 монети щосекунди','У гавані Гнилого Причалу чекає капітанка: друга дія','Набіги Мли тривають, тож хранитель потрібен і далі']});say('Промінь пробиває вікно ліхтарні й лягає на воду. Великий вогонь маяка горить над шхерами!','story')}}break;
  case 'craft':{const rc=RC.find(x=>x.id===i);if(!rc||(i==='rod'?!shoreRodReady():!rcVisible(rc)))break;const c=i==='rod'?rc.c:rcCost(rc);
    if((rc.craft||0)>st('craft')||!afford(c,rc.it))break;pay(c,rc.it);novUse('r:'+i);if(i!=='rod')s.f.craft1=1;
    if(rc.tool){if(rc.id==='rod'){F.rod=1;say('Вудка готова. Тепер на березі можна рибалити.','find');tutOffer('rod')}else{if(rc.id==='pack1')F.pack=1;if(rc.id==='pack2')F.pack=2;if(rc.id==='belt1')F.belt=1;dlg({k:'find',title:`Зроблено: ${rc.n}`,img:{t:'icon',id:rc.id==='belt1'?'belt':'pack'},body:`<p>${rc.d}</p>`,gains:[`Рюкзак: ${packSlots()} зброї, вантаж до ${loadCap()}`,`Пояс: ${beltSlots()} предмети`]})}}else{giveI(rc.out);let ex='';if(rc.multi&&Math.random()<0.05*st('craft')){giveI(rc.out);ex=' Вдалося зробити дві!'}say(`Зроблено: ${I(IT[rc.out].n)}.${ex}`,'find');if(i==='rake')tutOffer('rake')}break}
  case 'rs':rsStart(i);break;
  case 'repok':s.report=null;break;
  case 'attr':if(s.h.pts>0&&s.h.a[i]!==undefined&&s.h.a[i]<ACAP){s.h.pts--;s.h.a[i]++;if(i==='con')s.h.hp+=5}break;
  case 'skill':if(s.h.sp>0&&s.h.k[i]!==undefined&&s.h.k[i]<skillCap()){s.h.sp--;s.h.k[i]++}break;
  case 'feat':if(s.h.fp>0&&tVis(FT.find(x=>x.id===i)||{tier:9,br:''})&&featOk(FT.find(x=>x.id===i)||{id:'',req:{}})){s.h.fp--;s.h.ft[i]=1;say(`Новий талант: ${FT.find(x=>x.id===i).n}.`,'lvl')}break;
  case 'equip':if(has(i)&&IT[i].slot){const sl=IT[i].slot;if(sl==='weapon'||sl==='ranged'){if(!packHas(i)){if(s.pack.length>=packSlots()){const old=s.eq[sl];if(!old||!packHas(old)){say('Рюкзак повний. Виклади щось із нього у вкладці «Спорядження».');break}s.pack[s.pack.indexOf(old)]=i;say(`${IT[old].n} лишається в маяку, а в рюкзак іде ${IT[i].n}.`)}else s.pack.push(i)}}s.eq[sl]=i;s.h.hp=Math.min(s.h.hp,maxHP())}break;
  case 'packAdd':if(has(i)&&IT[i].slot&&(IT[i].slot==='weapon'||IT[i].slot==='ranged')&&!packHas(i)&&s.pack.length<packSlots())s.pack.push(i);break;
  case 'packRem':s.pack=s.pack.filter(x=>x!==i);for(const sl of['weapon','ranged'])if(s.eq[sl]===i)s.eq[sl]='';break;
  case 'beltAdd':if(has(i)&&IT[i].use&&!s.belt.includes(i)&&s.belt.length<beltSlots())s.belt.push(i);break;
  case 'beltRem':s.belt=s.belt.filter(x=>x!==i);break;
  case 'wup':{const tier=wF(i),cst=wfCost(tier),rel=REL[i]&&REL[i][tier];if(!cst||!WF[i]||!s.b.forge||!has(i)||wmLv(i)<WFM[tier]||!rel||!has(rel)||!afford(cst))break;const old=wN(i);pay(cst);s.inv[rel]--;s.wf=s.wf||{};s.wf[i]=tier+1;
    say(`Кузня: ${I(old)} тепер ${I(wN(i))}.`,'find');dlg({k:'find',title:`Удосконалено: ${wN(i)}`,img:{t:'wico',id:i},body:`<div class="fgx" aria-hidden="true"><span class="fgh"></span><b></b><b></b><b></b><b></b><b></b></div><p>${tier&&s.mst.kindrat?`${P('Кіндрат')} гартує сталь, і ${old.toLowerCase()} стає зовсім іншою зброєю.`:`Кузня гуде до ночі. ${IT[rel].n} лягає на своє місце, і ${old.toLowerCase()} виходить з горна новою зброєю.`}</p>`,gains:['+2 урону',`Нова особливість: ${WF[i][tier].tr}`,'Старі особливості й прийоми майстерності лишаються']});break}
  case 'wk+':if(BD.find(b=>b.id===i)&&WKB.includes(i)&&freeW()>0&&((s.wk||{})[i]||0)<(s.b[i]||0)){s.wk=s.wk||{};s.wk[i]=(s.wk[i]||0)+1}break;
  case 'wk-':if((s.wk||{})[i]>0)s.wk[i]--;break;
  case 'olheal':if(s.mst.olesya&&!onCd('olheal')&&s.h.hp<maxHP()){setCd('olheal',120);s.h.hp=maxHP();say(`${P('Олеся')} перев’язує тебе й мастить рани зіллям. Ти знову повний сил.`)}break;
  case 'schooner':if(s.b.shipyard&&!F.schooner&&afford(SCHOONER)){pay(SCHOONER);F.schooner=1;reveal('monastery');reveal('guardians');dlg({k:'story',title:'Шхуна «Остап»',img:{t:'yard'},body:`<p>${P('Захар')} б’є пляшкою об форштевень. ${Q('Назвемо її «Остап». Старий хоч і бурчатиме, але буде радий')}. Шхуна сходить на воду.</p>`,gains:['Тепер можна плисти на північні острови','Похід на шхуні коштує 4 провізії']})}break;
  case 'bogstep':if(!F.bogPath){const row=BOGP[s.bog||0],o=row&&row[+i];if(!o)break;
    if(o[1]){s.bog=(s.bog||0)+1;if(s.bog>=BOGP.length){F.bogPath=1;s.bog=0;xp(30);dlg({k:'find',title:'Шлях через болото',img:{t:'scene',id:'bog'},body:'<p>Остання кочка пружинить під ногою, і ти стоїш на сухому порозі хати Устини.</p>',gains:['Хата Устини тепер доступна']})}else say(`${o[0]} тримає. Ступаєш далі.`)}
    else{s.bog=0;s.bogFail=(s.bogFail||0)+1;s.h.hp=Math.max(1,s.h.hp-4);say('Нога провалюється в чорну воду. Ти ледве вибираєшся назад на край болота: −4 здоров’я.')}}break;
  case 'unequip':s.eq[i]='';s.h.hp=Math.min(s.h.hp,maxHP());break;
  case 'use':if(has(i)&&IT[i].use==='heal'&&s.h.hp<maxHP()){s.inv[i]--;s.h.hp=Math.min(maxHP(),s.h.hp+IT[i].v);dishEffect(i)}break;
  case 'eatfull':eatFull();break;
  case 'cook':cook(i);break;
  case 'cookp':cook(i,'plain');break;
  case 'curt':if(CUR.includes(i)){s.cur=s.cur||{on:{},t:0,gain:0};s.cur.on[i]=!s.cur.on[i]}break;
  case 'tt':popB='';if(i==='cut'||s.tabs[i]){zoomPrep(i);ttGo(i)}break;
  case 'eat':if(s.r.fish>=1&&s.h.hp<maxHP()){s.r.fish--;s.h.hp=Math.min(maxHP(),s.h.hp+8)}break;
  case 'eatp':if(s.r.prov>=1&&s.h.hp<maxHP()){s.r.prov--;s.h.hp=Math.min(maxHP(),s.h.hp+15)}break;
  case 'scan':{const nx=scanTarget();if(nx&&s.r.ember>=scanCost()){s.r.ember-=scanCost();s.scans++;novMark();reveal(nx);say(SCANMSG[nx]+' Місце з’явилося на мапі.','world')}break}
  case 'go':{const[ok,why]=canGo(i);if(!ok){say(why);break}snap9('map');if(LOC[i].sea){const pv=seaCost(LOC[i]);s.r.prov-=pv;say(`Ти виходиш у море. Витрачено ${R('prov',pv)}.`,'world')}s.at=i;s.tab='map';popB='';if(!s.visited[i]){s.visited[i]=1;xp(5);if(LOC[i].first)LOC[i].first()}wolfSniff(i);break}
  case 'leave':s.at='';popB='';break;
  case 'la':doLA(i);break;
  case 'qf':doLA(i,1);break;
  case 'riddle':{const A=findA(i);if(s.done[i])break;let el=null;try{const q=[...document.querySelectorAll(`input[data-rid="${i}"]`)];el=q.find(e=>e.value&&e.value.trim())||q[0]||null}catch(e){}if(!el)el=$('rd-'+i.replace(/\./g,'-'));const v=(el?el.value:'').trim().toLowerCase();
    if(v&&A.riddle.ans.some(x=>v.includes(x))){s.done[i]=1;const sn=snap(),q0=(s.dlg||[]).length,m=A.run();trustAct(i);say(m,'find');s.dlg=s.dlg||[];s.dlg.splice(q0,0,{k:'find',title:'Загадку розгадано',body:`<p>${m}</p>`,gains:gainsOf(sn)})}
    else if(!v)say('Спершу впиши відповідь.');
    else{s.wrong[i]=(s.wrong[i]||0)+1;say('Ні, відповідь не та. Подумай ще.')}break}
  case 'bell':{const n=+i;s.bell.push(n);const k=s.bell.length-1;
    if(s.bell[k]!==BELLSEQ[k]){s.bell=[];s.bellFail++;s.h.hp=Math.max(1,s.h.hp-3);say('Дзвони збиваються на какофонію, і звук б’є по вухах: −3 здоров’я. Тиша. Можна почати знову.')}
    else if(s.bell.length===BELLSEQ.length){s.bell=[];F.crypt=1;xp(20);dlg({k:'find',title:'Склеп відчинено',img:{t:'scene',id:'reef'},body:'<p>Дзвони відповіли диханню моря. Під дзвіницею відчинився кам’яний люк.</p>',gains:['Тепер можна спуститися в склеп']});say('Останній удар дзвону котиться над водою, і риф здригається. Під дзвіницею відчиняється кам’яний люк.','find')}
    else say(`${BELLS[n][0]} гуде над водою.`);break}
  case 'stone':if(!F.stones){const n=+i;s.stones[n]=(s.stones[n]+1)%4}break;
  case 'stonesTry':if(!F.stones){if(s.stones.every(d=>d===2)){F.stones=1;odd('holestone');book('stones');add('herb',8);xp(30);dlg({k:'find',title:'Камені-сторожі',img:{t:'scene',id:'cliffs'},body:'<p>Три стрілки дивляться на маяк. Камені глухо гудуть, і з-під найбільшого викочується камінь із діркою.</p>',gains:['Книга «Пісні каменярів»','+8 трав']});say(`Камені глухо гудуть, і з-під найбільшого викочується ${I('камінь із діркою')}. Під ним — книга ${I('«Пісні каменярів»')} і сухий пучок трав (${R('herb',8)}).`,'find')}else{s.stoneFail++;say('Нічого. Камені мовчать.')}}break;
  case 'dial':{const n=+i;s.chest[n]=(s.chest[n]+1)%CHEST.length;break}
  case 'chestTry':if(!F.chest){if(s.chest.every((v,k)=>v===CHESTCODE[k])){F.chest=1;F.bpCrossbow=1;odd('pipe');xp(30);if(!s.pages.includes(6))page(6);dlg({k:'find',title:'Скриня Остапа відчинилася',img:{t:'icon',id:'crossbow'},body:`<p>Замок клацає. У скрині — креслення арбалета, люлька й лист: ${Q('Хто розгадав мою скриню, той упорається й з маяком. — О.')}</p>`,gains:['Рецепт арбалета в майстерні']});say(`Замок клацає. У скрині — креслення ${I('арбалета')}, люлька й лист: ${Q('Хто розгадав мою скриню, той упорається й з маяком. — О.')}`,'find')}else{s.chestFail++;say('Коліщата зупиняються, але кришка не піддається.')}}break;
  case 'buy':{const it=SHOP.find(x=>x.id===i),p=price(it.p);if(s.r.coin<p||(it.show&&!it.show()))break;s.r.coin-=p;
    if(it.res)for(const k in it.res)add(k,it.res[k]);else if(it.book)book(it.book);else if(it.reveal)reveal(it.reveal);else giveI(i);say(`Куплено: ${I(it.n)}.`,'find');break}
  case 'tog':s.on[i]=s.on[i]===false;break;
  case 'reserve':if(s.b[i]&&reserveInputs(i).length){s.reserveFree=s.reserveFree||{};s.reserveFree[i]=reserveOn(i)?1:0}break;
  case 'ht':s.ht=i;break;
  case 'tsel':s.tsel=i;break;
  case 'freq':{const q=(s.req||{})[i];if(!q||!afford(q.give))break;pay(q.give);for(const k in q.rew)add(k,q.rew[k]);trust(i,6,q.n.toLowerCase());for(const[g,n]of q.side||[])trust(g,n);delete s.req[i];s.reqT=s.reqT||{};s.reqT[i]=Date.now()+300000;say(`Прохання виконано: ${q.n}. Отримано ${costTxt(q.rew)}.`,'find');break}
  case 'fdecl':if((s.req||{})[i]){delete s.req[i];s.reqT=s.reqT||{};s.reqT[i]=Date.now()+300000;trust(i,-2)}break;
  case 'def':{const d=DEF.find(x=>x.id===i);if(!d||(d.req&&!d.req())||defL(i)>=d.max||!afford(defCost(d)))break;pay(defCost(d));s.def=s.def||{};s.def[i]=defL(i)+1;say(`Оборона: ${d.n}, рівень ${s.def[i]}.`,'world');break}
  case 'repair':{const b=BD.find(x=>x.id===i);if(!b||!(s.dmgB||{})[i])break;const c=repCost(b);if(!afford(c))break;pay(c);delete s.dmgB[i];say(`Полагоджено: ${b.n}.`,'world');break}
  case 'lure':if(!s.raid&&(s.threat||0)<100&&s.r.ember>=150*s.h.lvl&&thrOn()){s.r.ember-=150*s.h.lvl;s.lure=1;s.threat=100;say('Ти палиш на березі приманку з олії й риб’ячого жиру. Мла вже йде.','fight')}break;
  case 'flsel':if(FLN[i])s.flsel=i;break;
  case 'flu':{const tr=fuL(i),U2=(FLU[i]||[])[tr];if(!U2||!floorBuilt(i)||!U2.req()||!afford(U2.c))break;pay(U2.c);s.fu=s.fu||{};s.fu[i]=tr+1;dlg({k:'world',title:`Покращено: ${U2.n}`,img:{t:'yard'},body:`<p>${FLN[i]} стає кращою, ніж була за Остапа.</p>`,gains:[U2.d]});break}
  case 'beam':{const n=+i;if(!s.f.won||n===(s.beam||0)||n<0||n>5||s.r.oil<3)break;s.r.oil-=3;s.beam=n;break}
  case 'flot':{const f=s.flot;if(!f)break;s.flot=null;s.flotT=Date.now()+(150+Math.random()*120)*1000;flotTake(f.k,+i>1?+i:1);break}
  case 'flotmg':{const f=s.flot;if(!f)break;if(f.k==='bottle'){act('flot');break}mgRun('flot',()=>{f.until=Math.max(f.until,Date.now()+90000);mgFlot(f.k)},r=>act('flot',r>1?String(r):'1'));break}
  case 'rsel':{if(RS.find(r=>r.id===i))s.rsSel=i;break}
  case 'bigfish':{if(!s.bite)break;s.bite=null;s.c.fish++;mgRun('fish',mgFish,fishEnd);break}
  case 'smith':{if(!s.b.forge||onCd('smith')||s.hot)break;const c={scrap:4,ember:2};if(!afford(c)){say(`Для кування треба ${costTxt(c)}.`,'world');break}pay(c);setCd('smith',4);const n=smithN();add('iron',n);
    if(Date.now()-(s.hotT||0)>180000&&Math.random()<1/7){s.hotT=Date.now();if(mgHabit('forge')||s.quickMG)mgRun('forge',null,smithEnd);else{s.hot={until:Date.now()+30000};say('Заготовка розжарилася як слід: ще удар у слушну мить, і метал віддасть більше.','find')}}break}
  case 'smithhot':{if(!s.hot)break;s.hot=null;mgRun('forge',()=>mgForge('smith'),smithEnd);break}
  case 'mghab':{s.mgHab=s.mgHab||{};s.mgHab[i]=s.mgHab[i]?0:1;break}
  case 'sett':break;
  case 'qmg':s.quickMG=s.quickMG?0:1;break;
  case 'exp':{const X=EXP[i];if(!X||!s.f.boat||freeW()<X.crew||!afford(X.c)||(s.exp||[]).some(e=>e.id===i))break;pay(X.c);s.exp=s.exp||[];s.exp.push({id:i,until:Date.now()+X.t*1000,crew:X.crew});say(`${X.n}: команда відпливає від пристані.`,'world');break}
  case 'trade':{const sh=s.ship,o=sh&&sh.offers[+i];if(!o||sh.done.includes(+i)||!afford(o.give))break;pay(o.give);const sm=1+0.05*st('speech');for(const k in o.get)add(k,Math.round(o.get[k]*sm));trust('sails',2);sh.done.push(+i);say(`Обмін: віддано ${costTxt(o.give)}, отримано ${costTxt(o.get)}.`,'find');break}
  case 'gogrow':s.tab='hero';s.ht='grow';snap9('hero');break;
  case 'signal':if(s.floors.gallery&&!onCd('signal')&&s.r.ember>=sigCost()){s.r.ember-=sigCost();s.sig=(s.sig||0)+1;setCd('signal',120);
    const mu=s.rs.signals?1.5:1,g={coin:Math.round((10+Math.floor(Math.random()*20))*mu),scrap:Math.round((6+Math.floor(Math.random()*8))*mu),iron:Math.round((1+Math.floor(Math.random()*3))*mu),tar:Math.round((1+Math.floor(Math.random()*3))*mu),oil:Math.round((4+Math.floor(Math.random()*6))*mu),prov:2};for(const k in g)add(k,g[k]);
    let extra='';if(Math.random()<0.25){const x=['bomb','bandage','glass'][Math.floor(Math.random()*3)];giveI(x);extra=`, а ще ${I(IT[x].n)}`}
    say(`Сигнальне вогнище палає. Корабель, що минав шхери, скидає для тебе вантаж: ${costTxt(g)}${extra}.`,'find');trust('sails',1)}break;
  case 'dism':{const v=dismVal(i);if(!v||!canDism(i))break;s.inv[i]--;for(const k in v)add(k,v[k]);say(`Розібрано: ${I(IT[i].n)}. Отримано ${costTxt(v)}.`,'find');break}
  case 'sell':{const it=SELL.find(x=>x.id===i);if(!afford(it.r,it.it))break;pay(it.r,it.it);add('coin',sellG(it.g));break}
  }
  dirty=1}
function dismVal(id){const rc=RC.find(r=>r.out===id);let c={};if(rc){for(const k in rc.c)if(k!=='ember'){const v=Math.floor(rc.c[k]/2);if(v>0)c[k]=v}}else c=Object.assign({},DIS[id]||{});return Object.keys(c).length?c:null}
function canDism(id){const it=IT[id];if(!it||!it.slot||!has(id))return false;const eqd=(s.eq[it.slot]===id||packHas(id))?1:0;return s.inv[id]>eqd}
let RCOPEN=0;
function rcVisible(rc){if(rc.id==='rod')return false;if(!noGap()&&!RCOPEN&&(!s.floors.work||!s.rcSeen||!s.rcSeen[rc.id]))return false;if(rc.req&&!rc.req())return false;if(rc.tool)return rc.id==='rod'?!s.f.rod:rc.id==='pack1'?!(s.f.pack>=1):rc.id==='pack2'?s.f.pack===1:rc.id==='belt1'?!s.f.belt:false;if(!rc.multi&&has(rc.out))return false;if(rc.id==='sling'&&!s.tabs.hero)return false;return true}


/* Мла збирається на метушню: її додають лише дії гравця. Поки біля маяка тихо — вона дрімає. */
const MLA_A={smith:0.15,gather:0.08,scrapw:0.15,fishing:0.2,blow:0.05,bld:1.5,floor:2,craft:1,wup:1.5,schooner:2,exp:0.8};
let paidN=0;
let actOk=1;
function act(a,i){s.lastAct=Date.now();const w=MLA_A[a],fx=SFXA[a];actOk=1;if(!w&&!fx){act0(a,i);return}const cd0=s.cd[a],p0=paidN,ap0=s.cb?s.cb.ap:null;act0(a,i);
  actOk=s.cd[a]!==cd0||paidN!==p0||(s.cb&&ap0!==null&&s.cb.ap!==ap0)?1:0;if(actOk){if(w)mlaAdd(w);if(fx)sfx(fx)}}
