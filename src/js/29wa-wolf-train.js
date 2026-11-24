/* ============ ДРЕСИРУВАННЯ ВОВКА (етап III, #34) ============
   Коли вовк дорослий, відкривається дерево «Дресирування»: три гілки по три навички.
   Очки дресирування — разом із годуванням (кожне третє годування), зі спільних перемог (кожна третя) і з занять:
   коротка міні-гра «Команда» — подати знак, щойно вовк глянув на тебе.
   До дресирування вовк б'ється сам і примітивно; навички дають накази й нові вміння. */
const WTR=[
  {id:'grab',br:'Бій',n:'Хапай!',c:1,d:'Наказ: вовк кидається на твою ціль і притискає її — вона пропускає наступний хід.'},
  {id:'heel',br:'Бій',n:'До ноги!',c:2,need:'grab',d:'Наказ: вовк стає поруч і боронить тебе — частину ударів бере на себе.'},
  {id:'flank',br:'Бій',n:'Обхід',c:2,need:'grab',d:'Вовк кусає вдвічі сильніше ворога, що стоїть поруч із тобою.'},
  {id:'scent',br:'Нюх',n:'Слід',c:1,d:'Вовк чує прихованих ворогів поблизу — вони виходять із засідки.'},
  {id:'stash',br:'Нюх',n:'Схованки',c:2,need:'scent',d:'У кожному місці, де ти ще не нюхав із вовком, він може відкопати щось цінне.'},
  {id:'mla',br:'Нюх',n:'Чує Млу',c:2,need:'scent',d:'Вовк раніше чує туман: Мла збирається на маяк повільніше.'},
  {id:'guard',br:'Сторож',n:'Сторож складу',c:1,d:'Під час облоги вовк першим кидається на злодіїв.'},
  {id:'alpha',br:'Сторож',n:'Вожак',c:2,need:'guard',d:'Вовк міцнішає: більше здоров’я й сильніший укус.'},
  {id:'brave',br:'Сторож',n:'Не відступає',c:3,need:'alpha',d:'Знесилений вовк не відповзає з бою одразу, а ще раз кусає наостанок.'}];
const wHas=id=>!!((s.wolf||{}).tr||{})[id];
const wTrainOn=()=>wolfSt()>=2;
function wtpAdd(n,why){if(!s.wolf||!wTrainOn())return;const w=s.wolf;w.tpx=(w.tpx||0)+n;while(w.tpx>=1){w.tpx-=1;w.tp=(w.tp||0)+1;say(`${wcap(wolfNm())} краще розуміє тебе: +1 очко дресирування${why?' — '+why:''}.`,'lvl')}dirty=1}
function wLearn(id){const N=WTR.find(x=>x.id===id),w=s.wolf;if(!N||!w||!wTrainOn()||wHas(id)||(N.need&&!wHas(N.need))||(w.tp||0)<N.c)return;w.tp-=N.c;w.tr=w.tr||{};w.tr[id]=1;
  say(`${wcap(wolfNm())} навчився: ${N.n}`,'lvl');dirty=1}
/* заняття: міні-гра «Команда» */
function wLesson(){if(!wTrainOn()||onCd('wlesson'))return;setCd('wlesson',600);
  if(typeof MGH!=='undefined'&&!MGH.wlesson)MGH.wlesson={help:()=>false,lab:['Подати знак звично',''],st:'per',bonus:0,dl:[{title:'Вовк тебе розуміє',body:'Вовк уже сам ловить твій погляд. Заняття можна проводити звично, не стежачи за кожним рухом.'},{title:'',body:''}]};
  mgRun('wlesson',()=>mgWolf(),(res,skip)=>wLessonEnd(skip==='auto'?(res>0?2:0):res))}
function wLessonEnd(res){if(res>=2)wtpAdd(1,'заняття');else say(`${wcap(wolfNm())} відволікся на чайок. Наступного разу вийде.`,'info')}
function mgWolf(){let tries=0,good=0,sig=-1,wait=1+Math.random()*2;
  mgStart({type:'wlesson',title:'Заняття: '+wcap(wolfNm()),hint:'Вовк бігає по траві. Щойно він гляне на тебе (з’явиться «!»), подай знак — натисни. Тричі.',
    field:`<div class="mgwolf"><img src="${sprURL('wolfpet')}" alt=""><b class="ex">!</b></div>`,init(){MG.st.textContent='знаків: 0/3'},
    tick(dt,tt){const f=MG.f;if(sig<0){wait-=dt;if(wait<=0){sig=tt;f.classList.add('sig')}}else if(tt-sig>.9){f.classList.remove('sig');sig=-1;wait=1+Math.random()*2;tries++;mgMsg('Не встиг — вовк відвернувся.','');MG.st.textContent=`знаків: ${tries}/3`;if(tries>=3)mgEnd(good)}
      f.querySelector('img').style.transform=`translateX(${Math.sin(tt*1.3)*90}px) scaleX(${Math.cos(tt*1.3)>0?1:-1})`;if(tt>30)mgEnd(good)},
    down(){if(sig<0){mgMsg('Зарано: він ще не дивиться.','');return}MG.f.classList.remove('sig');sig=-1;wait=1+Math.random()*2;tries++;good++;mgMsg('Вовк слухає!','ok');MG.st.textContent=`знаків: ${tries}/3`;if(tries>=3)mgEnd(good)},
    end:res=>wLessonEnd(res)})}
/* бій: накази й навички */
function wolfAct(c,u){const foes=alive(c).filter(v=>!v.hid);if(!foes.length)return;
  if(wHas('scent'))for(const v of c.u)if(v.hid&&v.hp>0&&dist(v.x,v.y,u.x,u.y)<=3){v.hid=0;cbLog(`${u.nm} гарчить на кущі — звідти виходить ${E(EN[v.t].n)}!`)}
  if(c.wcmd==='heel'){if(dist(u.x,u.y,c.hx,c.hy)>1)moveTo(c,u,c.hx,c.hy);const nb=foes.filter(v=>dist(v.x,v.y,u.x,u.y)<=1);if(!nb.length)return;wolfBite(c,u,nb[0]);return}
  let tg=c.wcmd==='grab'?c.u[c.sel]:null;if(!tg||tg.hp<=0||EN[tg.t].ally||EN[tg.t].obj)tg=null;
  if(!tg&&wHas('guard')&&c.win==='raid')tg=foes.find(v=>v.role==='thief')||null;
  if(!tg)tg=foes.reduce((a,b)=>dist(u.x,u.y,a.x,a.y)<=dist(u.x,u.y,b.x,b.y)?a:b);
  if(dist(u.x,u.y,tg.x,tg.y)>1)moveTo(c,u,tg.x,tg.y);if(dist(u.x,u.y,tg.x,tg.y)>1)return;wolfBite(c,u,tg)}
function wolfBite(c,u,tg){fxP({t:'bump',x0:u.x,y0:u.y,x1:tg.x,y1:tg.y},110);if(Math.random()<.2){cbLog(`${u.nm} хапає повітря.`);return}
  let d=Math.max(1,Math.round(((u.p0||4)+s.h.lvl*0.5)*(wHas('flank')&&dist(tg.x,tg.y,c.hx,c.hy)<=1?2:1))-uArm(tg));tg.hp-=d;gripFree(c,tg);
  fxP({t:'txt',x:tg.x,y:tg.y,v:'−'+d,k:'hit'},130);cbLog(`${u.nm} кусає: ${E(EN[tg.t].n)} −${d}.`);
  if(c.wcmd==='grab'&&wHas('grab')&&tg.hp>0&&!EN[tg.t].boss){tg.pin=Math.max(tg.pin||0,1);cbLog(`${u.nm} притискає ${E(EN[tg.t].n.toLowerCase())} до землі!`)}
  if(tg.hp<=0)kill(tg)}
/* «До ноги!»: частину ударів по героєві бере вовк */
function wolfBlock(c,u,dmg){if(c.wcmd!=='heel'||!wHas('heel'))return false;const w=c.u.find(v=>v.t==='wolfpet'&&v.hp>0&&dist(v.x,v.y,c.hx,c.hy)<=1);if(!w||Math.random()>.35)return false;
  const d=Math.max(1,Math.round(dmg));w.hp-=d;fxP({t:'txt',x:w.x,y:w.y,v:'−'+d,k:'hurt'},130);cbLog(`${w.nm} кидається між тобою й ${E(EN[u.t].n.toLowerCase())}: −${d}.`);if(w.hp<=0)kill(w);return true}
function wolfCmdHTML(c){const w=c.u.find(v=>v.t==='wolfpet'&&v.hp>0);if(!w||!(wHas('grab')||wHas('heel')))return'';
  const L=[['','сам'],...(wHas('grab')?[['grab','хапай мою ціль']]:[]),...(wHas('heel')?[['heel','до ноги']]:[])];
  return`<p class="m"><b>${w.nm}:</b> ${L.map(([k,n])=>btn(n,'c_wcmd',k,{cls:(c.wcmd||'')===k?'on':''})).join(' ')}</p>`}
/* вовк на місці: схованки */
function wolfSniff(l){if(!wHas('stash')||!s.wolf||wolfSt()<2)return;s.sniff=s.sniff||{};if(s.sniff[l])return;s.sniff[l]=1;if(Math.random()>.35)return;
  if(typeof collFind==='function'&&Math.random()<.4&&collFind('pool'))return;const n=10+rnd(15);add('coin',n);say(`${wcap(wolfNm())} розгрібає землю під каменем — там стара схованка: ${R('coin',n)}.`,'find')}
function wTrainHTML(){if(!wTrainOn())return'';const w=s.wolf;const br=['Бій','Нюх','Сторож'];
  return`<div class="wtr"><p><b>Дресирування</b> · очок: ${w.tp||0}</p>${br.map(b=>`<p class="m"><b>${b}:</b></p><div class="rlist">${WTR.filter(x=>x.br===b).map(N=>{const has=wHas(N.id),lock=N.need&&!wHas(N.need);
    return`<div class="row"><span><b>${N.n}</b>${has?' ✓':''}<br><span class="m">${lock?'спершу «'+WTR.find(x=>x.id===N.need).n+'»':N.d}</span></span>${has||lock?'':btn(`Навчити (${N.c})`,'wlearn',N.id,{ok:()=>(w.tp||0)>=N.c})}</div>`}).join('')}</div>`).join('')}
    <div class="act">${btn('Заняття','wlesson','',{cd:'wlesson',cs:600})}</div><p class="hint">Очки дресирування — з годування, спільних перемог і занять.</p></div>`}
