/* ============ РУЧНИЙ ВОВК ============
   Після бою з вовками за козу в лігві на скелях лишається вовченя Туманного вовка. Гравець дає йому ім'я,
   годує (риба, згодом провізія) — і воно росте, поки ти поруч і воно сите: вовченя → підліток → дорослий.
   Голод лише зупиняє ріст, без утеч і смертей. З підліткового віку вовк сам іде в бій поруч — поки що
   просто кидається на найближчого ворога; накази й дерево «Дресирування» відкриються згодом (етап III).
   Знесилений у бою вовк відповзає до маяка й за кілька хвилин одужує. */
const WST=[{n:'вовченя',need:0,hp:0,bite:0},{n:'вовк-підліток',need:25,hp:20,bite:4},{n:'дорослий вовк',need:70,hp:32,bite:6}];
const wolfSt=()=>{const w=s.wolf;if(!w)return-1;let k=0;WST.forEach((q,i)=>{if(w.g>=q.need)k=i});return k};
const wolfNm=()=>s.wolf&&s.wolf.name?s.wolf.name:'вовченя';
const wolfFood=()=>wolfSt()<2?{fish:wolfSt()?6:4}:{prov:4};
const wolfSated=()=>!!s.wolf&&Date.now()<s.wolf.sat;
EN.wolfpet={n:'Вовк',ch:'в',hp:20,arm:0,eva:20,mv:5,xp:0,ally:1,d:'Твій вовк. Поки що просто кидається на найближчого ворога.',p:[['hit',4,'Кусає']]};
SPR.wolfpet=SPR.wolf.map((r,y)=>y===7?r.slice(0,11)+'ii'+r.slice(13):r);
function wolfFind(){if(s.wolf)return;s.wolf={name:'',g:0,sat:0,lt:Date.now(),fed:0,hurt:0};
  dlg({k:'story',title:'Лігво на скелях',img:{t:'scene',id:'cliffs'},body:`<p>За уступом, де стояла коза, — лігво під виступом скелі. Усередині тихо скиглить вовченя: сіре, мокре, з очима кольору туману. Зграї, що його годувала, більше немає.</p><p>Ти загортаєш його в куртку. Біля вогнища маяка буде тепло.</p>`,gains:['Вовченя біля вогнища — дай йому ім’я']})}
function wolfFeed(){const w=s.wolf;if(!w)return;const now=Date.now();if(now<w.sat-5*60000){say(`${wcap(wolfNm())} ситий і дрімає біля вогню.`,'info');return}
  const c=wolfFood();if(!afford(c))return;pay(c);w.sat=Math.min(now+15*60000,Math.max(now,w.sat)+10*60000);w.fed++;
  say(w.fed===1?`${wcap(wolfNm())} спершу обнюхує їжу, тоді жадібно їсть і засинає, притулившись до твоєї ноги.`:`${wcap(wolfNm())} їсть і вдоволено вкладається біля вогнища.`,'info');dirty=1}
function wolfName(v){const w=s.wolf;if(!w||w.name)return;if(v==null&&typeof document!=='undefined'&&document.querySelector){const el=document.querySelector('input[data-wname]');v=el&&el.value}
  v=String(v||'').replace(/[<>&"'`]/g,'').trim().slice(0,16);if(!v){say('Вовченя чекає на ім’я.','info');return}w.name=wcap(v);say(`Тепер його звати ${w.name}. Вовченя ворушить вухом, наче погоджується.`,'info');dirty=1}
const wcap=t=>t?t.charAt(0).toUpperCase()+t.slice(1):t;
function wolfTick(){const w=s.wolf;if(!w)return;const now=Date.now(),dt=Math.min(60000,Math.max(0,now-(w.lt||now)));w.lt=now;if(away()||now>=w.sat)return;
  const k0=wolfSt();w.g+=dt/60000;const k1=wolfSt();
  if(k1>k0)dlg({k:'story',title:k1===1?'Вовк підріс':'Дорослий вовк',img:{t:'spr',id:'wolfpet'},body:k1===1?`<p>${wcap(wolfNm())} вже не вміщається на колінах. Ходить за тобою слід у слід, а коли ти береш весло, наїжачується й тихо гарчить на туман.</p>`:`<p>${wcap(wolfNm())} виріс. Він лежить біля дверей маяка й першим чує, коли щось ворушиться в тумані.</p>`,
    gains:k1===1?['Вовк ходить із тобою в бій']:['Вовк сильніший у бою']})}
/* у бою: стає поруч із героєм */
function wolfJoin(c){const k=wolfSt();if(k<1||Date.now()<(s.wolf.hurt||0))return;for(const[dx,dy]of[[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=c.hx+dx,y=c.hy+dy;
    if(x<0||y<0||x>=GW||y>=GH||solid(tileAt(c.a,x,y))||tileAt(c.a,x,y)==='~'||unitAt(c,x,y))continue;const u=mkUnit('wolfpet',x,y,1);u.hp=u.max=WST[k].hp;u.p0=WST[k].bite;u.nm=wcap(wolfNm());c.u.push(u);c.log.push(`${u.nm} стає поруч і шкірить зуби.`);return}}
function wolfDown(u){if(u.t!=='wolfpet'||!s.wolf)return;s.wolf.hurt=Date.now()+5*60000;cbLog(`${u.nm||'Вовк'} скавчить і відповзає з бою — до маяка, до вогню.`)}
/* сцена: вовк у нижній залі біля вогнища */
function wolfScene3(k){const b=pbuf(30,18),S=[.62,.8,1][k],cx=15,cy=12.5;
  const E=(x,y,ex,ey,rx,ry)=>((x-ex)/rx)**2+((y-ey)/ry)**2<=1,ear=(x,y,ex)=>y>cy-6.4*S&&y<cy-3.4*S&&Math.abs(x-ex)<=(y-(cy-6.4*S))/(3*S)*1.3*S;
  const M=(x,y)=>E(x,y,cx,cy,8.5*S,3.8*S)||E(x,y,cx-7*S,cy-1.8*S,3*S,2.6*S)||E(x,y,cx-10.2*S,cy-1.2*S,1.9*S,1.1*S)||ear(x,y,cx-6*S)||ear(x,y,cx-8.2*S)||E(x,y,cx+9.6*S,cy+.6*S,3.3*S,1.5*S);
  hiRect(b,0,0,30,18,(i,j,x,y)=>{if(!M(x,y))return(M(x+.7,y)||M(x-.7,y)||M(x,y+.7)||M(x,y-.7))?'x':'';
    if(E(x,y,cx-8*S,cy-2.3*S,.55,.45)||E(x,y,cx-11.9*S,cy-1.3*S,.6,.5))return'x';const l=-(x-cx)/10-(y-cy)/4.5;return l>.55?'7':l>.1?'6':l>-.35?'5':'4'});
  if(k)prect(b,cx-4.9*S,cy-1.4*S,1.2,2.2*S,'i');return b}
globalThis.wolfScene3=HI(wolfScene3);
function wolfHS(W,H){if(!s.wolf||!s.b.hearth)return'';const k=wolfSt(),[x,y,w,h]=twBox('hall'),nm=s.wolf.name?s.wolf.name:'Вовченя';
  return ob('cl:wolf','bpop','cl:wolf',obURL('wf3:'+k,()=>wolfScene3(k)),x+30,y+h-15,W,H,nm,`<b>${nm}</b><br>${WST[k].n}, ${wolfSated()?'ситий':'голодний'}.`,{pulse:!s.wolf.name||!wolfSated()?1:0,z:292})}
function wolfPopHTML(){const w=s.wolf;if(!w)return'';const k=wolfSt(),nm=w.name||'Вовченя',c=wolfFood(),hurt=Date.now()<(w.hurt||0);
  return`<div class="bpop" role="dialog" aria-label="${nm}"><div class="bph"><b>${nm}</b><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>
  <p class="m">${wcap(WST[k].n)}. ${hurt?'Зализує рани біля вогню.':wolfSated()?'Ситий, дрімає біля вогнища.':'Голодний: дивиться на тебе й тихо скиглить.'} ${k<2?(wolfSated()?'Поки ситий — росте.':'Голодний не росте.'):''}</p>
  ${w.name?'':`<div class="act"><input data-wname maxlength="16" autocomplete="off" aria-label="Ім’я вовченяти" placeholder="Ім’я">${btn('Назвати','wname','')}</div>`}
  <div class="act">${btn(`Нагодувати (${costTxt(c)})`,'wfeed','',{ok:()=>afford(c)&&Date.now()>=(s.wolf.sat||0)-5*60000})}</div>
  <p class="hint">${k?'Іде з тобою в бій і кидається на найближчого ворога. Накази — коли навчиш.':'Підросте — ходитиме з тобою в бій.'}</p></div>`}
