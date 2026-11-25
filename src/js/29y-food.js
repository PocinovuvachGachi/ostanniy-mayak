/* ============ ЇЖА: ЛІКУВАННЯ, КОМОРА Й КУХНЯ ============
   - Біля вогнища здоров'я вертається лише повільно (до повного — близько чверті години); швидко лікує їжа:
     риба (+8), провізія (+15), страви. «Поїсти» з'їдає рівно стільки, скільки бракує (спершу рибу).
   - Комора: сирої риби влазить мало (кошик, згодом льох), провізії — більше. Що не влазить — не ловиться;
     наявне не псується й не зникає. Причина коптити й будувати льох.
   - Кухня Зиновія: казан біля вогнища в нижній залі. Страви лікують більше й дають силу:
     тепло (здоров'я вертається втричі швидше) чи ситість (+1 очко дії на початку кількох боїв). */
const FOODHP={fish:8,prov:15};
const capOf=k=>k==='fish'?40+60*(s.b.cellar||0):k==='prov'?100+150*(s.b.cellar||0):Infinity;
function regenRate(){const hn=s.b.hearth||0;return(0.04+0.01*Math.min(6,hn))*(Date.now()<((s.h.buf||{}).warm||0)?3:1)}
function eatFull(){let g=0,ate={};while(s.h.hp<maxHP()&&g++<200){const k=s.r.fish>=1?'fish':s.r.prov>=1?'prov':'';if(!k)break;
    s.r[k]--;ate[k]=(ate[k]||0)+1;s.h.hp=Math.min(maxHP(),s.h.hp+FOODHP[k])}
  if(Object.keys(ate).length)say(`Ти їси біля вогню: ${costTxt(ate)}. Сили повертаються.`,'info');else say('Їсти нічого: ні риби, ні провізії.','info');dirty=1}
/* Комора — будівля з рівнями */
BD.push({id:'cellar',n:'Комора',d:()=>`Риби влазить ${capOf('fish')} (+60 за рівень), провізії — ${capOf('prov')} (+150 за рівень). Що не влазить — не ловиться, наявне не псується.`,base:{wood:30,scrap:10},mult:1.6,show:()=>!!s.f.capHit||!!s.b.cellar});
BANC.cellar=[182,228];
BLD3.cellar=HI(function(g){const w=[26,32,40][g-1],h=[13,15,18][g-1],b=pbuf(w+4,h+2);
  polyFill(b,[[0,h+1],[3,h*.35],[w*.5,0],[w-2,h*.3],[w+3,h+1]],(x,y)=>pset(b,x,y,vnz(EXX,EXY,3,7)>.62?'r':y<h*.4?'Z':'s'));
  hiRect(b,w*.5-5,h*.35,10,h*.65+1,(i,j,x,y)=>{const u=x-(w*.5-5);if(u<1||u>9)return'E';if(y<h*.35+1.2)return'F';return u<5?'W':'X'});prect(b,w*.5-.5,h*.45,1,h*.55,'V');pset(b,w*.5+2.5,h*.7,'g');
  if(g>=2)for(const[x,c]of[[3,'X'],[w-4,'W']]){prect(b,x,h-4,4,5,c);prect(b,x,h-3,4,1,'D');prect(b,x,h,4,1,'D')}
  if(g>=3){prect(b,w*.5-9,h*.25,2,h*.8,'F');prect(b,w*.5+7,h*.25,2,h*.8,'F');prect(b,w*.5-9,h*.2,18,2,'G')}return b});
/* ============ КУХНЯ ЗИНОВІЯ — окрема вкладка ============
   Кухня в нижній залі: казан над вогнем, стіл із припасами, полиця з книгою рецептів. Рецепти треба дізнатися:
   Зиновій учить юшку й рибу в золі, Ганна — юшку з травами, Оксана — в'ялену рибу в дорогу, а пиріг — коли рука набита.
   Варити можна звично (одна звичайна страва) або біля казана — тримати вогонь, щоб кипіло рівно: добре кипіння дає
   дві страви, а рівне до кінця — дві смачні (лікують більше й діють довше). Інгредієнти не пропадають за будь-якого результату. */
Object.assign(IT,{
  ash:{n:'Риба в золі',ic:'(~)',use:'heal',v:12,d:'Відновлює 12 здоров’я. Найпростіша страва на світі.'},
  soupherb:{n:'Юшка з травами',ic:'(~)',use:'heal',v:20,warm:10,d:'Лікує 20 здоров’я і зігріває: десять хвилин здоров’я вертається втричі швидше.'},
  dried:{n:'В’ялена риба',ic:'(~)',use:'heal',v:10,full:1,d:'Лікує 10 здоров’я. Ситість: +1 очко дії на початку наступного бою.'},
  pie:{n:'Рибний пиріг',ic:'(~)',use:'heal',v:25,full:3,d:'Лікує 25 здоров’я. Ситість: +1 очко дії на початку трьох наступних боїв.'}});
ICO.ash=ICO.soup;ICO.soupherb=ICO.soup;ICO.dried=ICO.soup;ICO.pie=['............','............','....8888....','..8ffffff8..','.8fgfgfgff8.','.8ffffffff8.','.8eeeeeeee8.','..8eeeeee8..','...888888...','............','............','............'];
const DISH=[
  {id:'ash',c:{fish:3},who:'Зиновій',how:'Риба в мокрому листі, просто в жар.',learn:()=>!!s.f.tracks},
  {id:'soup',c:{fish:8,prov:2},who:'Зиновій',how:'Риба, провізія — і довго на вогні.',learn:()=>!!s.f.tracks},
  {id:'soupherb',c:{fish:6,herb:2},who:'Ганна',how:'Чебрець і полин — і юшка гріє зсередини.',learn:()=>!!s.f.herbsDone},
  {id:'dried',c:{fish:6,prov:1},who:'Оксана',how:'Риба в солі на вітрі. Легка, в дорогу.',learn:()=>!!((s.vq||{}).t||{}).widow},
  {id:'pie',c:{fish:5,prov:4,wood:2},who:'Зиновій',how:'Тісто з товченої провізії, риба всередині, жар знизу й зверху.',learn:()=>(s.c.cook||0)>=5}];
/* смачні варіанти: лікують у півтора раза більше, тепло й ситість — довше */
for(const D of DISH){const T=IT[D.id];IT[D.id+'_t']=Object.assign({},T,{n:'Смачна '+T.n.charAt(0).toLowerCase()+T.n.slice(1),v:Math.round(T.v*1.5),warm:T.warm?T.warm*2:0,full:T.full?T.full+1:0,tasty:1,
  d:`Смачна! Лікує ${Math.round(T.v*1.5)} здоров’я.${T.warm?` Тепло — ${T.warm*2} хвилин.`:''}${T.full?` Ситість — ${T.full+1} ${T.full+1<5?'бої':'боїв'}.`:''}`});ICO[D.id+'_t']=ICO[D.id];ILD[D.id]=T.d;ILD[D.id+'_t']=IT[D.id+'_t'].d}
const rcpKnown=id=>!!(s.rcp||{})[id];
function kitTick(){if(typeof MGH!=='undefined'&&!MGH.cook)MGH.cook=MGH_COOK;if(!s.f.tracks)return;if(!s.tabs.kitchen){if(!novCan())return;novMark();s.tabs.kitchen=1;s.ttNew=typeof s.ttNew==='object'&&s.ttNew?s.ttNew:{};s.ttNew.kitchen=1;if(s.tabs.tower)s.newTab.tower=1;dlg({k:'world',title:'Відкрилося: Кухня',body:'<p>У нижній залі, біля вогнища, Зиновій поставив казан і стіл. Кухня — у вкладці «Маяк», поруч із розрізом маяка.</p>'})}s.rcp=s.rcp||{};
  for(const D of DISH)if(!s.rcp[D.id]&&D.learn()){const first=!Object.keys(s.rcp).length;if(!first&&!novCan())return;s.rcp[D.id]=1;if(!first){novMark();dlg({k:'find',title:'Новий рецепт',img:{t:'icon',id:D.id},body:`<p><b>${IT[D.id].n}.</b> ${D.who} показує, як: ${D.how.charAt(0).toLowerCase()+D.how.slice(1)}</p>`,gains:['Рецепт на кухні']})}if(!noGap())return}}
const dishOk=D=>rcpKnown(D.id)&&afford(D.c);
function cookDone(id,q){const D=DISH.find(x=>x.id===id),n=q>=2?2:1,it=q>=3?id+'_t':id;giveI(it,n);s.c.cook=(s.c.cook||0)+1;
  say(q>=3?`${IT[it].n} — ${n} порції! Зиновій куштує й мовчки киває.`:q>=2?`${IT[id].n}: вийшло дві порції.`:`${IT[id].n}: готово.`,'build');kitTick();dirty=1}
function cook(id,how){if(typeof MGH!=='undefined'&&!MGH.cook)MGH.cook=MGH_COOK;const D=DISH.find(x=>x.id===id);if(!D||!dishOk(D))return;pay(D.c);
  if(how==='plain'){cookDone(id,0);return}
  mgRun('cook',()=>mgCook(id),(res,skip)=>cookDone(id,skip?(skip==='auto'?(res>0?1:0):0):res))}
/* міні-гра: тримати вогонь, щоб кипіло рівно */
function mgCook(id){let heat=.35,inz=0,tot=0,gust=0;const lo=.55,hi=.8,T=10;
  mgStart({type:'cook',title:'Казан: '+IT[id].n,hint:'Підкидай тріски (натискай), щоб кипіло рівно — у світлій смузі. Перегріється — збіжить, охолоне — не звариться.',
    field:`<div class="mgcook"><div class="mgcp"><i class="b1"></i><i class="b2"></i><i class="b3"></i></div><div class="mgct"><i class="z" style="bottom:${lo*100}%;height:${(hi-lo)*100}%"></i><i class="n"></i></div></div>`,
    init(){MG.st.textContent='рівно: 0%'},
    tick(dt,tt){gust-=dt;if(gust<=0){gust=1+Math.random()*1.5;heat-=Math.random()*.08}heat=Math.max(0,Math.min(1,heat-dt*.11));tot+=dt;if(heat>=lo&&heat<=hi)inz+=dt;
      const f=MG.f;f.querySelector('.mgct .n').style.bottom=(heat*100)+'%';f.querySelector('.mgcp').style.setProperty('--h',heat.toFixed(2));MG.st.textContent=`рівно: ${Math.round(inz/Math.max(1,tot)*100)}%`;
      if(tt>=T){const r=inz/tot;mgEnd(r>=.8?3:r>=.6?2:r>=.4?1:0)}},
    down(){heat=Math.min(1,heat+.16);if(heat>hi+.08)mgMsg('Збігає!','');else if(heat>=lo)mgMsg('Кипить рівно.','ok');else mgMsg('')},
    end:(res,skip)=>cookDone(id,skip?(skip==='auto'?(res>0?1:0):0):res)})}
const MGH_COOK={help:()=>false,lab:['Варити звично','Доручити Зиновію'],st:'per',bonus:0,dl:[{title:'Рука набита',body:'Ти вже чуєш казан: за звуком знаєш, коли підкинути тріску. Можна варити звично, не стоячи над ним.'},{title:'',body:''}]};
function dishEffect(id){const T=IT[id];if(!T)return;s.h.buf=s.h.buf||{};if(T.warm)s.h.buf.warm=Date.now()+T.warm*60000;if(T.full)s.h.buf.full=(s.h.buf.full||0)+T.full}
/* казан у нижній залі веде на кухню */
function potHS(W,H){if(!s.tabs.kitchen||!s.b.hearth)return'';const[x,y,w,h]=twBox('hall');
  return ob('cl:pot','tt','kitchen',obURL('pot3',pot3),x+4,y+h-20,W,H,'Кухня Зиновія','<b>Кухня Зиновія</b><br>Казан, стіл і книга рецептів.',{z:293})}
const pot3=HI(function(){const b=pbuf(16,14);prect(b,2,0,1,6,'D');prect(b,13,0,1,6,'D');prect(b,2,0,12,1,'D');hiRect(b,3,5,10,8,(i,j,x,y)=>((x-8)/5)**2+((y-8)/4.5)**2<=1?(y<6.3?'u':x<6.5?'F':'D'):'');prect(b,4,12,8,2,'J');pset(b,6,13,'I');pset(b,9,13,'I');return b});
/* ---- сцена кухні ---- */
const kitRoom3=HI(function(){const b=pbuf(RMW,RMH);roomBase(b,{win:[300,36,36,48],st:1});
  /* піч і комин */
  hiRect(b,20,40,130,160,(i,j,x,y)=>{const row=Math.floor(j/6),off=row%2?5:0,m=j%6===5||(i+off)%11===0;if(x>40&&x<130&&y>110)return y<116?'G':'x';return m?'D':hh2((i+off)/11|0,row)<.2?'E':'F'});
  prect(b,14,36,142,8,'G');prect(b,14,36,142,2,'H');prect(b,40,110,90,4,'G');
  /* полиця з горщиками */
  prect(b,176,58,96,5,'X');prect(b,176,58,96,1,'Y');for(let i=0;i<7;i++){const x=182+i*13,h=10+(i%3)*4;hiRect(b,x,58-h,10,h,(ii,jj,px,py)=>Math.abs(px-x-5)<4.5-(py<58-h+2?2:0)?(px<x+4?'e':'d'):'');prect(b,x+2,58-h,6,1,'c')}
  /* в'язки трав і риби під стелею */
  for(let i=0;i<5;i++){const x=184+i*18;pline(b,x,12,x,26+(i%2)*6,'V');hiRect(b,x-3,26+(i%2)*6,6,10,(ii,jj,px,py)=>Math.abs(px-x)<2.6-(py-26)/12?(i%2?'k':'M'):'')}
  return b});
function kitPot3(q){const b=pbuf(86,84);prect(b,6,0,3,40,'D');prect(b,76,0,3,40,'D');prect(b,6,0,73,3,'D');pline(b,42,3,42,26,'z');
  hiRect(b,16,24,54,44,(i,j,x,y)=>{const u=((x-43)/27)**2+((y-48)/20)**2;if(u>1)return'';if(y<31)return x<20||x>66?'D':(hh2(i>>1,j>>1)<.3?'u':'7');return u>.85?'x':x<36?'F':x<52?'E':'D'});
  prect(b,14,28,58,4,'D');prect(b,14,28,58,1,'F');
  for(let k=0;k<9;k++){const x=18+k*6,h=6+(k*7)%8;prect(b,x,84-h-4,3,h,k%2?'K':'J');pset(b,x+1,84-h-5,'I')}prect(b,10,78,66,6,'V');return b}
function kitTable3(){const b=pbuf(150,64);prect(b,0,16,150,6,'Y');prect(b,0,21,150,2,'X');prect(b,6,23,7,41,'W');prect(b,137,23,7,41,'W');prect(b,12,46,126,4,'X');
  const fish=(x,y)=>{hiRect(b,x,y,18,6,(i,j,px,py)=>((px-x-8)/8)**2+((py-y-3)/2.6)**2<=1?(py<y+2.5?'6':'5'):'');polyFill(b,[[x+16,y+3],[x+20,y],[x+20,y+6]],(px,py)=>pset(b,px,py,'5'));pset(b,x+3,y+2,'x')};
  if(s.r.fish>=1)fish(10,9);if(s.r.fish>=10)fish(16,4);if(s.r.fish>=25)fish(34,8);
  if(s.r.prov>=1){prect(b,62,6,22,10,'W');prect(b,62,6,22,2,'X');prect(b,64,4,18,2,'d')}
  if(s.r.herb>=1)for(let i=0;i<5;i++)pline(b,96+i*3,15,99+i*3,5,i%2?'k':'l');
  prect(b,118,8,24,8,'X');prect(b,120,6,20,2,'Y');pset(b,128,10,'G');pline(b,126,12,138,4,'G');return b}
function kitBook3(){const b=pbuf(34,26);prect(b,0,18,34,8,'X');prect(b,0,18,34,1,'Y');polyFill(b,[[2,18],[16,10],[17,18]],(x,y)=>pset(b,x,y,'O'));polyFill(b,[[17,18],[18,10],[32,18]],(x,y)=>pset(b,x,y,'N'));pline(b,17,10,17,18,'b');for(let i=0;i<3;i++){pline(b,6,16-i*2,14,12-i*2,'a');pline(b,20,12-i*2+1,29,16-i*2,'a')}return b}
for(const f of['kitPot3','kitTable3','kitBook3'])globalThis[f]=HI(globalThis[f]);
function kitchenScene(){const W=RMW,H=RMH;let h=`<span data-sk="bg" data-sig="bg" class="scbg">${VH(()=>pimg(pxURL('kit3:'+GR,kitRoom3),864,480,'scene','Кухня'))}</span>`;
  h+=ob('kt:pot','bpop','kt:pot',obURL('ktp3',kitPot3),42,116,W,H,'Казан','<b>Казан</b><br>Тут вариться все, що знаєш.',{pulse:(s.c.cook||0)?0:1});
  const tk=[s.r.fish>=1,s.r.fish>=10,s.r.fish>=25,s.r.prov>=1,s.r.herb>=1].map(Number).join('');
  h+=ob('kt:table','bpop','kt:table',obURL('ktt3:'+tk,kitTable3),168,136,W,H,'Стіл із припасами','<b>Стіл</b><br>Що є з припасів.',{});
  h+=ob('kt:book','bpop','kt:book',obURL('ktb3',kitBook3),232,32,W,H,'Книга рецептів',`<b>Книга рецептів</b><br>Записано ${Object.keys(s.rcp||{}).length===1?'один рецепт':'кілька рецептів'}.`,{pulse:s.rcpNew?1:0});
  h+=ob('kt:zin','bpop','kt:zin',[faceSceneURL('zinovii'),faceSceneURL('zinovii'),32,32],350,150,W,H,'Зиновій','<b>Зиновій</b>',{cls:'lcp'});
  const L={fire:[{x:85,y:192,r:110,e:.7,c:FIRE,n:4}],win:[{x:318,y:60,r:120,e:.8,c:WARM,a:.4}]};
  return`<div class="scn rm wk" data-scn="kt" style="${scnD()}">${h}${fxCanvas('kt',W,H)}${lightLayers(W,H,L)}</div>`}
function kitPopHTML(id){const head=(t)=>`<div class="bpop wide" role="dialog" aria-label="${t}"><div class="bph"><b>${t}</b><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>`;
  if(id==='kt:pot'){const L=DISH.filter(D=>rcpKnown(D.id));return head('Казан')+`<div class="rlist">${L.map(D=>`<div class="row"><span><b>${IT[D.id].n}</b><br><span class="m">${IT[D.id].d}</span></span><span class="ccs">${costTxt(D.c)}</span>${btn('Варити біля казана','cook',D.id,{ok:()=>dishOk(D)})}${btn('Звично','cookp',D.id,{ok:()=>dishOk(D)})}</div>`).join('')}</div>
    <p class="hint">Біля казана: тримай кипіння рівним — вийде дві порції, а коли рівно до кінця — дві смачні. Звично — одна звичайна порція. Інгредієнти не пропадають.</p></div>`}
  if(id==='kt:table')return head('Стіл із припасами')+`<p class="m">Риба ${fmt(s.r.fish)}/${capOf('fish')}, провізія ${fmt(s.r.prov)}/${capOf('prov')}${s.seen.herb?`, трави ${fmt(s.r.herb)}`:''}.</p><p class="m">Страви в торбі: ${Object.keys(IT).filter(k=>DISH.some(D=>k===D.id||k===D.id+'_t')&&has(k)).map(k=>`${IT[k].n} ×${s.inv[k]}`).join(', ')||'поки жодної'}.</p></div>`;
  if(id==='kt:book'){s.rcpNew=0;return head('Книга рецептів')+`<div class="rlist">${DISH.filter(D=>rcpKnown(D.id)).map(D=>`<div class="row"><span><b>${IT[D.id].n}</b> <span class="m">— навчив${D.who==='Зиновій'?'':'ла'} ${D.who}</span><br><span class="m">${D.how}</span></span></div>`).join('')}</div><p class="hint">Далі ще чисті сторінки. Люди знають більше страв, ніж ти думаєш.</p></div>`}
  if(id==='kt:zin')return head('Зиновій')+`<p class="m">${Q(['Казан не любить поспіху. Тріску — коли стихає, не раніше.','Голодний хранитель — поганий хранитель.','Ганна знає трави, Оксана — сіль. Питай людей, хранителю.','Смачне лікує краще. Це не я вигадав — це всі коки знають.'][Math.floor(Date.now()/60000)%4])}</p></div>`;
  return''}
function rKitchen(){return`<section><h2>Кухня</h2><p class="m">Казан, стіл і книга рецептів — натискай на них у кухні. Біля казана страви виходять кращими.</p></section>`}
/* підвкладки «Маяка»: розріз, кухня, майстерня, кабінет */
const ttCur=()=>{const t=s.tt||'cut';return t==='cut'||s.tabs[t]?t:'cut'};
function ttGo(i){s.tt=i;delete s.newTab[i];if(s.ttNew&&typeof s.ttNew==='object')delete s.ttNew[i];snap9(i==='cut'?'tower':i)}
function ttBar(){const L=[['cut','Маяк','ember'],['kitchen','Кухня','soup'],['work','Майстерня','rake'],['study','Кабінет','lore']].filter(x=>x[0]==='cut'||s.tabs[x[0]]);if(L.length<2)return'';
  const nw=typeof s.ttNew==='object'&&s.ttNew?s.ttNew:{},cur=ttCur();
  return`<div class="sub2" role="tablist">${L.map(x=>btn(`${pimg(icoURL(x[2]),18,18)}${x[1]}${nw[x[0]]?'<span class="dot"></span>':''}`,'tt',x[0],{cls:cur===x[0]?'on':''})).join('')}</div>`}
