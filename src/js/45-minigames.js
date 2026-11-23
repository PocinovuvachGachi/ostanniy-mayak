/* ============ v19: MINIGAMES ============ */
let MG=null;
const mgOk=()=>!s.quickMG&&typeof requestAnimationFrame==='function'&&typeof document!=='undefined'&&!!document.body&&typeof document.body.appendChild==='function'&&!document.getElementById('mg');
function mgStart(o){const el=document.createElement('div');el.id='mg';el.className='mgbg';
  el.innerHTML=`<div class="mgbox" role="dialog" aria-modal="true" aria-label="${o.title}"><div class="mgh"><b>${o.title}</b><span class="mgst"></span></div><p class="mghint">${o.hint}</p><div class="mgf" tabindex="0">${o.field}</div><p class="mgmsg" aria-live="polite"></p><div class="act"><button type="button" class="mgskip">Пропустити</button><button type="button" class="mgq">Завжди швидко</button></div><p class="m mgk">Натискай на поле або пробіл. Esc — пропустити.</p></div>`;
  document.body.appendChild(el);const now=performance.now();MG={o,el,t0:now,last:now,done:0,f:el.querySelector('.mgf'),msg:el.querySelector('.mgmsg'),st:el.querySelector('.mgst')};
  const f=MG.f;f.addEventListener('pointerdown',e=>{e.preventDefault();if(MG&&!MG.done&&o.down)o.down(e)});const up=()=>{if(MG&&!MG.done&&o.up)o.up()};f.addEventListener('pointerup',up);f.addEventListener('pointerleave',up);f.addEventListener('pointercancel',up);
  el.querySelector('.mgskip').onclick=()=>mgEnd(0,1);el.querySelector('.mgq').onclick=()=>{s.quickMG=1;mgEnd(0,1)};
  try{f.focus()}catch(e){}if(o.init)o.init();
  const loop=n=>{if(!MG||MG.done)return;const dt=Math.min(.1,(n-MG.last)/1000);MG.last=n;o.tick&&o.tick(dt,(n-MG.t0)/1000);requestAnimationFrame(loop)};requestAnimationFrame(loop)}
function mgMsg(x,cls){if(MG){MG.msg.textContent=x;MG.msg.className='mgmsg'+(cls?' '+cls:'')}}
function mgEnd(res,skip){if(!MG||MG.done)return;MG.done=1;const o=MG.o,el=MG.el;el.classList.add('mgout');setTimeout(()=>{if(el.parentNode)el.parentNode.removeChild(el);MG=null;o.end(res,skip);dirty=1;render();save()},skip?150:900)}
document.addEventListener('keydown',e=>{if(!MG||MG.done)return;if(e.key==='Escape'){mgEnd(0,1);e.preventDefault();return}if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();MG.o.down&&MG.o.down(e)}},true);
document.addEventListener('keyup',e=>{if(!MG||MG.done)return;if(e.key===' '||e.key==='Enter'){e.preventDefault();MG.o.up&&MG.o.up()}},true);
const flotURLmg=k=>pxURL('flot3:'+k,()=>flotObj3(k));
function mgFlot(k){const per=2.4,win=0.16+0.015*Math.max(0,(s.h.a.per||2)-2);let tries=3,ph=0,stage=1,hits=0,miss=0,nail=null,nailT=0,beat=0;
  const title={barrel:'Бочка в прибої',crate:'Ящик у прибої',cargo:'Вантаж у прибої',survivor:'Людина на уламку'}[k]||'Знахідка';
  const done=ok=>mgEnd(ok?1:0);const finish=res=>{mgMsg(res?'Чудово! Здобич більша.':'Хай так: витягнеш і без вправності.',res?'ok':'');done(res)};
  mgStart({title,hint:'Хвилі гойдають знахідку. Підчепи гаком, коли вона найближче до тебе — у світлій смузі.',
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
function mgFish(){let ten=40,prog=0,next=0.8,hold=0;const hiZ=75+2*Math.max(0,(s.h.a.str||2)-2);
  mgStart({title:'Щось велике клює!',hint:'Тримай, щоб тягнути. Відпускай, коли линва натягується. Стрілка напруги має лишатися в зеленій зоні.',
    field:`<div class="mgfish"><div class="mgten"><i class="mggreen" style="left:30%;width:${hiZ-30}%"></i><b class="mgneedle"></b></div><div class="mgprog"><i></i></div><img class="mgfi" src="${icoURL('fish')}" alt=""></div>`,
    tick(dt,tt){ten+=(hold?52:-40)*dt;next-=dt;if(next<=0){ten+=10+Math.random()*16;next=0.6+Math.random()*0.8}
      ten=Math.max(0,ten);if(ten>=100){mgMsg('Линва лопнула! Хоч дрібну рибину встиг витягти.');mgEnd(0);return}
      if(ten>=30&&ten<=hiZ)prog+=14*dt;else if(ten<30)prog=Math.max(0,prog-5*dt);
      MG.f.querySelector('.mgneedle').style.left=Math.min(100,ten)+'%';MG.f.querySelector('.mgprog i').style.width=Math.min(100,prog)+'%';MG.f.querySelector('.mgfi').style.left=(10+Math.min(100,prog)*0.75)+'%';
      MG.st.textContent=`${Math.floor(prog)}%`;if(prog>=100){mgMsg('Ось вона!','ok');mgEnd(1);return}if(tt>22){mgMsg('Риба втомила тебе й зірвалася.');mgEnd(0)}},
    down(){hold=1},up(){hold=0},
    end(res){if(res>0){const n=Math.round(5*wolf());add('fish',n);let x='';if(Math.random()<0.35){add('coin',20);x=` У череві — ${R('coin',20)}, хтось колись упустив гаманець.`}say(`Велика риба! +${R('fish',n)}.${x}`,'find')}else{add('fish',wolf());say('Велика риба зірвалася, але дрібну ти таки витяг.','find')}}})}
function mgForge(id){let strikes=0,good=0,heat=0;const per=1.7;
  mgStart({title:'Кування: '+wN(id),hint:'Метал то розжарюється, то холоне. Бий молотом, коли він світиться найяскравіше.',
    field:`<div class="mgforge"><div class="mgmetal"></div><img class="mgw" src="${wIco(id)}" alt=""><div class="mgheat"><i></i></div></div>`,
    tick(dt,tt){heat=Math.sin((tt%per)/per*Math.PI);const m=MG.f.querySelector('.mgmetal');m.style.opacity=String(0.25+heat*0.75);m.style.boxShadow=`0 0 ${Math.round(heat*30)}px rgba(255,170,60,${heat})`;MG.f.querySelector('.mgheat i').style.width=(heat*100)+'%';if(tt>25)mgEnd(good>=3?1:0)},
    init(){MG.st.textContent='ударів: 0/3'},
    down(){if(strikes>=3)return;strikes++;const ok=heat>0.82-0.02*Math.max(0,(s.h.a.str||2)-2);if(ok)good++;mgMsg(ok?'Дзвінкий удар!':'Метал ще холодний.',ok?'ok':'');MG.st.textContent=`ударів: ${strikes}/3`;MG.f.classList.remove('hit');void MG.f.offsetWidth;MG.f.classList.add('hit');if(strikes>=3)mgEnd(good>=3?1:0)},
    end(res,skip){if(res>0){s.wfb=s.wfb||{};const v=Math.min(2,(s.wfb[id]||0)+1);s.wfb[id]=v;say(`Добре кування: ${wN(id)} б’є на 1 сильніше.`,'find')}else if(!skip)say('Кування вийшло звичайним. Зброя все одно стала кращою.','world')}})}
function nope(el){try{el.classList.remove('nope');void el.offsetWidth;el.classList.add('nope');const k=el.dataset.cd,tx={fishing:'Ще не клює',gather:'Хвиля ще далеко',scrapw:'Руки ще не відпочили',blow:'Жарина ще жевріє'}[k]||'Зачекай';
  const b=el.getBoundingClientRect(),p=document.createElement('div');p.className='fpop ny';p.style.left=(b.left+b.width/2+scrollX)+'px';p.style.top=(b.top+scrollY-4)+'px';p.textContent=tx;document.body.appendChild(p);setTimeout(()=>p.remove(),1100)}catch(e){}}

