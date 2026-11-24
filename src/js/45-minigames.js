/* ============ v19: MINIGAMES ============ */
let MG=null;
const mgOk=()=>typeof requestAnimationFrame==='function'&&typeof document!=='undefined'&&!!document.body&&typeof document.body.appendChild==='function'&&!document.getElementById('mg');
/* Звичка й помічники: після трьох вдалих спроб або з появою помічника міні-гру можна доручити «звичному» результатові. */
const MGH={
  fish:{help:()=>people()>=5,lab:['Тягнути звично','Гукнути рибалку'],st:'str',bonus:0.15,
    dl:[{title:'Рука набита',body:'Велику рибу ти тепер виводиш, не думаючи: підсікти, попустити, підтягти. Руки роблять це самі.'},
        {title:'Рибалка в селищі',body:'Серед поселенців знайшовся старий рибалка. Каже, велику рибу краще виводити вдвох — гукай, коли клюне.'}]},
  flot:{help:()=>(s.pop||0)>=3,lab:['Витягти звично','Покликати варту'],st:'per',bonus:0.15,
    dl:[{title:'Рука набита',body:'Гак сам знаходить, за що зачепитися. Прибій уже не обдурить тебе.'},
        {title:'Варта прибою',body:'Поселенці по черзі чергують на березі. Що прибій викине, те витягнуть, навіть коли тебе немає поруч.'}]},
  forge:{help:()=>!!(s.mst||{}).kindrat,lab:['Кувати звично','Доручити Кіндратові'],st:'str',bonus:0.25,
    dl:[{title:'Рука набита',body:'Молот лягає в долоню, як рідний. Ти чуєш, коли метал готовий, ще до того, як він засвітиться.'},
        {title:'Молот Кіндрата',body:'Кіндрат дивиться, як ти куєш, і хитає головою: «Дай-но я». У його руках метал співає.'}]}};
const mgHelp=t=>{try{return!!MGH[t].help()}catch(e){return false}};
const mgCan=t=>((s.mgW||{})[t]||0)>=3||mgHelp(t);
const mgHabit=t=>!!(s.mgHab||{})[t]&&mgCan(t);
function mgChance(t){const a=s.h&&s.h.a||{},st=a[MGH[t].st]||2;return Math.min(0.85,0.3+0.05*Math.max(0,st-2)+(mgHelp(t)?MGH[t].bonus:0))}
const mgAutoRes=t=>Math.random()<mgChance(t)?(t==='flot'?1.6:1):(t==='flot'?1:0);
function mgUnlock(t,help){s.mgUn=s.mgUn||{};if(s.mgUn[t])return;s.mgUn[t]=help?2:1;const M=MGH[t],d=M.dl[help?1:0],lab=M.lab[help?1:0];
  dlg({k:'info',title:d.title,img:{t:'icon',id:t==='forge'?'steel':t==='fish'?'fish':'scrap'},body:`<p>${d.body}</p>`,
    gains:[`Відкрилося: «${lab}» ${ih(`Коли знову трапиться ця справа, можна не грати: кнопка «${lab}» дасть звичайний результат і шанс на кращий${help?' (з помічником він вищий)':''}. Відтоді справа робитиметься сама. Повернути гру можна в «Налаштуваннях» унизу сторінки.`)}`]})}
function mgHelpCheck(){for(const t in MGH)if((s.mgSeen||{})[t]&&!(s.mgUn||{})[t]&&mgHelp(t))mgUnlock(t,1)}
function mgWin(t){s.mgW=s.mgW||{};s.mgW[t]=(s.mgW[t]||0)+1;if(s.mgW[t]>=3)mgUnlock(t,0)}
/* Єдиний вхід у міні-гру: звичка або «без міні-ігор» — одразу результат; без сторінки (тести) — базовий результат. */
function mgRun(t,start,end){s.mgSeen=s.mgSeen||{};s.mgSeen[t]=1;
  if(mgHabit(t)||s.quickMG){end(mgAutoRes(t),'auto');return}
  if(!mgOk()){end(t==='flot'?1:0,1);return}
  start()}
const MGGR=0.7;
function mgStart(o){const el=document.createElement('div');el.id='mg';el.className='mgbg';const t=o.type,can=t&&mgCan(t);
  el.innerHTML=`<div class="mgbox" role="dialog" aria-modal="true" aria-label="${o.title}"><div class="mgh"><b>${o.title}</b><span class="mgst"></span></div><p class="mghint">${o.hint}</p><div class="mgf" tabindex="0">${o.field}</div><p class="mgmsg" aria-live="polite">Приготуйся…</p><div class="act">${can?`<button type="button" class="mghab">${MGH[t].lab[mgHelp(t)?1:0]}</button>`:''}<button type="button" class="mgskip">Махнути рукою</button></div><p class="m mgk">Натискай на поле або пробіл. Esc — махнути рукою.</p></div>`;
  document.body.appendChild(el);const now=performance.now();MG={o,el,t0:now,last:now,done:0,f:el.querySelector('.mgf'),msg:el.querySelector('.mgmsg'),st:el.querySelector('.mgst')};
  const f=MG.f,live=()=>MG&&!MG.done&&(performance.now()-MG.t0)/1000>=MGGR;
  f.addEventListener('pointerdown',e=>{e.preventDefault();if(live()&&o.down)o.down(e)});const up=()=>{if(MG&&!MG.done&&o.up)o.up()};f.addEventListener('pointerup',up);f.addEventListener('pointerleave',up);f.addEventListener('pointercancel',up);
  el.querySelector('.mgskip').onclick=()=>mgEnd(0,1);
  const hb=el.querySelector('.mghab');if(hb)hb.onclick=()=>{s.mgHab=s.mgHab||{};s.mgHab[t]=1;mgEnd(mgAutoRes(t),'auto')};
  try{f.focus({preventScroll:true})}catch(e){}if(o.init)o.init();
  let msg0=1;const loop=n=>{if(!MG||MG.done)return;const dt=Math.min(.05,(n-MG.last)/1000);MG.last=n;const tt=(n-MG.t0)/1000-MGGR;
    if(tt>=0){if(msg0){msg0=0;if(MG.msg.textContent==='Приготуйся…')mgMsg('')}o.tick&&o.tick(dt,tt)}requestAnimationFrame(loop)};requestAnimationFrame(loop)}
function mgMsg(x,cls){if(MG){MG.msg.textContent=x;MG.msg.className='mgmsg'+(cls?' '+cls:'');if(x)sfx(cls==='ok'?'hit':x==='Риба шарпається!'?'splash':'miss')}}
function mgEnd(res,skip){if(!MG||MG.done)return;MG.done=1;const o=MG.o,el=MG.el;el.classList.add('mgout');if(res>0&&!skip&&o.type)mgWin(o.type);
  setTimeout(()=>{if(el.parentNode)el.parentNode.removeChild(el);MG=null;o.end(res,skip);dirty=1;render();save()},skip?150:900)}
document.addEventListener('keydown',e=>{if(!MG||MG.done)return;if(e.key==='Escape'){mgEnd(0,1);e.preventDefault();return}if((e.key===' '||e.key==='Enter')&&!e.repeat){if(e.target&&e.target.tagName==='BUTTON')return;e.preventDefault();if((performance.now()-MG.t0)/1000>=MGGR)MG.o.down&&MG.o.down(e)}},true);
document.addEventListener('keyup',e=>{if(!MG||MG.done)return;if(e.key===' '||e.key==='Enter'){if(e.target&&e.target.tagName==='BUTTON')return;e.preventDefault();MG.o.up&&MG.o.up()}},true);
const flotURLmg=k=>pxURL('flot3:'+k,()=>flotObj3(k));
function mgFlot(k){const per=2.4,win=0.16+0.015*Math.max(0,(s.h.a.per||2)-2);let tries=3,ph=0,stage=1,hits=0,miss=0,nail=null,nailT=0,beat=0;
  const title={barrel:'Бочка в прибої',crate:'Ящик у прибої',cargo:'Вантаж у прибої',survivor:'Людина на уламку'}[k]||'Знахідка';
  const done=ok=>mgEnd(ok?1:0);const finish=res=>{mgMsg(res?'Чудово! Здобич більша.':'Хай так: витягнеш і без вправності.',res?'ok':'');done(res)};
  mgStart({type:'flot',title,hint:'Хвилі гойдають знахідку. Підчепи гаком, коли вона найближче до тебе — у світлій смузі.',
    field:`<div class="mgsea"><div class="mgzone"></div><img class="mgitem" src="${flotURLmg(k)}" alt=""><div class="mghook">⚓</div></div>`,
    init(){MG.st.textContent=`спроб: ${tries}`},
    tick(dt,tt){if(stage===1){ph=(tt%per)/per;const y=(Math.sin(ph*Math.PI*2)*0.5+0.5);MG.f.querySelector('.mgitem').style.top=(8+y*60)+'%';MG.near=y>1-win*2.2}
      else if(stage===2){if(k==='barrel'){const x=(Math.sin(tt*2.6)*0.5+0.5);MG.f.querySelector('.mgham').style.left=(10+x*76)+'%';MG.hx=x}
        else if(k==='crate'||k==='cargo'){nailT-=dt;if(nailT<=0){if(nail&&nail.parentNode){nail.remove();miss++;MG.st.textContent=`цвяхів: ${hits}/4`}if(hits+miss>=6){finish(hits>=3?1.6:0);return}nail=document.createElement('i');nail.className='mgnail';nail.style.left=(15+Math.random()*65)+'%';nail.style.top=(20+Math.random()*55)+'%';MG.f.querySelector('.mgcrate').appendChild(nail);nailT=0.95}}
        else if(k==='survivor'){const c=(tt%1.2)/1.2;beat=c;MG.f.querySelector('.mgpulse').style.transform=`scale(${0.4+c*1.2})`;MG.f.querySelector('.mgpulse').style.opacity=String(1-c)}}
      if(tt>30&&stage<3){stage=3;finish(0)}},
    down(e){if(stage===1){if(MG.near){stage=2;mgMsg('Підчепив!','ok');setTimeout(()=>stage2(),450);stage=1.5}else{tries--;MG.st.textContent=`спроб: ${tries}`;mgMsg('Мимо — хвиля відтягнула.');if(tries<=0){stage=3;finish(0)}}return}
      if(stage!==2)return;
      if(k==='barrel'){const zones=[0.2,0.5,0.8];const z=zones[hits];if(Math.abs(MG.hx-z)<0.09+0.01*Math.max(0,(s.h.a.str||2)-2)){hits++;MG.f.querySelectorAll('.mghoop')[hits-1].classList.add('off');mgMsg('Обруч злетів!','ok');if(hits>=3){stage=3;finish(1.6)}}else{miss++;mgMsg('Не туди.');if(miss>=4){stage=3;finish(0)}}MG.st.textContent=`обручів: ${hits}/3`}
      else if(k==='crate'||k==='cargo'){const tg=e&&e.target&&e.target.closest&&e.target.closest('.mgnail');const nn=tg||(e&&e.key?nail:null);if(nn&&nn.parentNode){nn.remove();nail=null;nailT=0.25;hits++;MG.st.textContent=`цвяхів: ${hits}/4`;mgMsg('Цвях вийшов!','ok');if(hits>=4){stage=3;finish(1.6)}}}
      else if(k==='survivor'){if(beat>0.8||beat<0.12){hits++;mgMsg('Тягни!','ok');MG.st.textContent=`ривків: ${hits}/4`;if(hits>=4){stage=3;finish(1.6)}}else{miss++;mgMsg(miss>=2?'Линва перетерлася об камінь…':'Зарано — линва ковзає.');if(miss>=2){stage=3;finish(0)}}}},
    end(res){act('flot',res>1?String(res):'1')}});
  function stage2(){if(!MG)return;stage=2;const f=MG.f;
    if(k==='barrel'){MG.el.querySelector('.mghint').textContent='Збий обручі: бий, коли молот над наступним обручем.';f.innerHTML=`<div class="mgbar"><img src="${flotURLmg('barrel')}" alt="" class="mgbig"><i class="mghoop" style="left:20%"></i><i class="mghoop" style="left:50%"></i><i class="mghoop" style="left:80%"></i><b class="mgham">▼</b></div>`;MG.st.textContent='обручів: 0/3'}
    else if(k==='crate'||k==='cargo'){MG.el.querySelector('.mghint').textContent='Підваж цвяхи: натискай на кожен, поки не сховався.';f.innerHTML=`<div class="mgcrate"><img src="${flotURLmg('crate')}" alt="" class="mgbig"></div>`;MG.st.textContent='цвяхів: 0/4'}
    else{MG.el.querySelector('.mghint').textContent='Тягни линву на гребені хвилі — коли коло найбільше.';f.innerHTML=`<div class="mgrope"><img src="${flotURLmg('survivor')}" alt="" class="mgbig"><i class="mgpulse"></i></div>`;MG.st.textContent='ривків: 0/4'}}}
function fishEnd(res,skip){if(res>0){const n=Math.round(5*wolf());add('fish',n);let x='';if(Math.random()<0.35){add('coin',20);x=` У череві — ${R('coin',20)}, хтось колись упустив гаманець.`}say(`${skip==='auto'?'Ти звично вивів велику рибу. ':''}Велика риба! +${R('fish',n)}.${x}`,'find')}
  else{add('fish',wolf());say(skip===1?'Ти відпустив велику рибу й витяг дрібну.':'Велика риба зірвалася, але дрібну ти таки витяг.','find')}}
/* Риба: плавна фізика. Утримання розганяє натяг, відпускання — гасить; ривки риби попереджені й наростають поступово. */
function mgFish(){const str=(s.h.a.str||2),lo=25,hi=Math.min(90,78+2*Math.max(0,str-2));
  let ten=45,v=0,prog=0,strain=0,hold=0,pullT=2.6+Math.random(),tele=0,pullL=0,pullF=0,fx=0.5,fy=0.8,ph=0,dir=1,el={};
  const tc=x=>x>hi?'#e5533a':x<lo?'#9ccbd8':'#a5d98e';
  mgStart({type:'fish',title:'Щось велике клює!',hint:'Тримай, щоб підтягувати; відпусти, щоб попустити линву. Коли риба шарпається — попускай.',
    field:`<div class="mgfish"><div class="mgwv"></div><svg class="mgline" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="94" y1="0" x2="50" y2="80" vector-effect="non-scaling-stroke"/></svg><img class="mgfi" src="${icoURL('fish')}" alt=""><div class="mgten"><i class="mggreen" style="left:${lo}%;width:${hi-lo}%"></i><i class="mgredz" style="left:${hi}%"></i><b class="mgneedle"></b></div><div class="mgprog"><i></i></div></div>`,
    init(){const f=MG.f;el={n:f.querySelector('.mgneedle'),p:f.querySelector('.mgprog i'),fi:f.querySelector('.mgfi'),ln:f.querySelector('.mgline line'),fs:f.querySelector('.mgfish'),ten:f.querySelector('.mgten')};MG.st.textContent='0%'},
    tick(dt,tt){
      if(tt>2.4&&!tele&&pullL<=0){pullT-=dt;if(pullT<=0){tele=0.65;el.fs.classList.add('tug');mgMsg('Риба шарпається!')}}
      if(tele>0){tele-=dt;if(tele<=0){tele=0;pullL=1.0;pullF=60+Math.random()*40}}
      let force=0;if(pullL>0){const k=Math.min(1,(1.0-pullL)/0.4)*Math.min(1,pullL/0.25);force=pullF*k;pullL-=dt;if(pullL<=0){pullT=1.3+Math.random()*1.8;el.fs.classList.remove('tug');if(MG.msg.textContent==='Риба шарпається!')mgMsg('')}}
      const acc=(hold?115:-90)+force-v*3.2;v+=acc*dt;ten+=v*dt;if(ten<0){ten=0;v=Math.max(0,v)}if(ten>104){ten=104;v=Math.min(0,v)}
      if(ten>hi){strain+=dt;el.ten.classList.add('hot')}else{strain=Math.max(0,strain-dt*0.7);el.ten.classList.remove('hot')}
      if(strain>1.1){mgMsg('Линва лопнула! Хоч дрібну рибину встиг витягти.');mgEnd(0);return}
      if(ten>=lo&&ten<=hi)prog+=11*dt;else if(ten<lo)prog=Math.max(0,prog-4*dt);
      ph+=dt*(pullL>0?5:1.6);const tx=0.5+Math.sin(ph)*0.32;dir=tx>fx?1:-1;fx+=(tx-fx)*Math.min(1,dt*3);fy=0.82-Math.min(100,prog)/100*0.5;
      el.n.style.left=Math.min(100,ten)+'%';el.p.style.width=Math.min(100,prog)+'%';
      el.fi.style.left=(fx*100)+'%';el.fi.style.top=(fy*100)+'%';el.fi.style.transform=`translate(-50%,-50%) scaleX(${-dir})${pullL>0?` rotate(${Math.sin(tt*30)*8}deg)`:''}`;
      el.ln.setAttribute('x2',(fx*100).toFixed(1));el.ln.setAttribute('y2',(fy*100).toFixed(1));el.ln.style.stroke=tc(ten);
      MG.st.textContent=`${Math.floor(Math.min(100,prog))}%`;if(prog>=100){mgMsg('Ось вона!','ok');mgEnd(1);return}
      if(tt>32){mgMsg('Риба втомила тебе й зірвалася.');mgEnd(0)}},
    down(){hold=1;MG.f.classList.add('hold')},up(){hold=0;if(MG)MG.f.classList.remove('hold')},
    end:fishEnd})}
function forgeEnd(id,res,skip){if(res>0){s.wfb=s.wfb||{};const v=Math.min(2,(s.wfb[id]||0)+1);s.wfb[id]=v;say(`${skip==='auto'?(mgHelp('forge')?'Кіндрат постарався: ':'Звичне кування вдалося: '):'Добре кування: '}${wN(id)} б’є на 1 сильніше.`,'find')}else if(skip!==1)say('Кування вийшло звичайним. Зброя все одно стала кращою.','world')}
const smithN=()=>1+Math.floor((s.b.forge||1)/2);
function smithEnd(res,skip){if(res>0){const n=2+smithN()*2;add('iron',n);say(`${skip==='auto'?(mgHelp('forge')?'Кіндрат перехопив молот: ':'Звичний удар: '):'Дзвінко! '}розжарена заготовка дала ще ${R('iron',n)}.`,'find')}else if(skip!==1)say('Удари вийшли звичайними, заготовка охолола.','world')}
function mgForge(id){let strikes=0,good=0,heat=0;const per=1.7,sm=id==='smith';
  mgStart({type:'forge',title:sm?'Розжарена заготовка':'Кування: '+wN(id),hint:'Метал то розжарюється, то холоне. Бий молотом, коли він світиться найяскравіше.',
    field:`<div class="mgforge"><div class="mgmetal"></div><img class="mgw" src="${sm?icoURL('iron'):wIco(id)}" alt=""><div class="mgheat"><i></i></div></div>`,
    tick(dt,tt){heat=Math.sin((tt%per)/per*Math.PI);const m=MG.f.querySelector('.mgmetal');m.style.opacity=String(0.25+heat*0.75);m.style.boxShadow=`0 0 ${Math.round(heat*30)}px rgba(255,170,60,${heat})`;MG.f.querySelector('.mgheat i').style.width=(heat*100)+'%';if(tt>25)mgEnd(good>=3?1:0)},
    init(){MG.st.textContent='ударів: 0/3'},
    down(){if(strikes>=3)return;strikes++;const ok=heat>0.82-0.02*Math.max(0,(s.h.a.str||2)-2);if(ok)good++;mgMsg(ok?'Дзвінкий удар!':'Метал ще холодний.',ok?'ok':'');MG.st.textContent=`ударів: ${strikes}/3`;MG.f.classList.remove('hit');void MG.f.offsetWidth;MG.f.classList.add('hit');if(strikes>=3)mgEnd(good>=3?1:0)},
    end:(res,skip)=>sm?smithEnd(res,skip):forgeEnd(id,res,skip)})}
function nope(el){sfx('nope');try{el.classList.remove('nope');void el.offsetWidth;el.classList.add('nope');const k=el.dataset.cd,tx={fishing:'Ще не клює',gather:'Хвиля ще далеко',scrapw:'Руки ще не відпочили',blow:'Жарина ще жевріє',smith:'Метал ще не нагрівся'}[k]||'Зачекай';
  const b=el.getBoundingClientRect(),p=document.createElement('div');p.className='fpop ny';p.style.left=(b.left+b.width/2+scrollX)+'px';p.style.top=(b.top+scrollY-4)+'px';p.textContent=tx;document.body.appendChild(p);setTimeout(()=>p.remove(),1100)}catch(e){}}

