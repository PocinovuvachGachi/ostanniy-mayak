/* ============ v17: LIVING SCENES ============ */
const PCT=(x,y,w,h,W,H)=>`left:${(x/W*100).toFixed(2)}%;top:${(y/H*100).toFixed(2)}%;width:${(w/W*100).toFixed(2)}%;height:${(h/H*100).toFixed(2)}%`;
function hs(k,a,i,box,lab,tip,o={}){const pulse=o.pulse&&(o.always||!(s.hsU||{})[k]);
  return`<button type="button" class="hs${pulse?' pulse':''}${o.ok===false?' no':''}" data-a="${a}" data-i="${i||''}" data-k="${k}"${o.cd?` data-cd="${o.cd}" data-cs="${o.cs}"`:''} style="${box}" aria-label="${lab}" ${TA(tip||`<b>${lab}</b>`)}><span class="hsl">${lab}</span>${o.inner||''}</button>`}
const OBC={};
function obURL(key,make){const u=pxURL('ob:'+key,make);const o=pxURL('obo:'+key,()=>{const b=make();return outline2(b,'I')});const k='ob:'+key;if(!OBC[k]){const b=make();OBC[k]=[b.w,b.h]}return[u,o,OBC[k][0],OBC[k][1]]}
function topPx(key,make){const c='tp:'+key;if(OBC[c])return OBC[c];const b=make(),W=b.W||b.w,H=b.H||b.h,k=b.k||1;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(b.p[y*W+x]!=='.')return OBC[c]=[x/k,y/k];return OBC[c]=[b.w>>1,0]}
const pOf=k=>{const l=(s.cd[k]||0)-Date.now();return l>0?l/((CDS[k]||1)*1000):0};const CDS={gather:1,scrapw:2,fishing:3,blow:2};
/* Нове на сцені проявляється поступово (#40): коли об'єкт з'являється вперше, він виступає з темряви за ~1,6 с
   (обрис маяка — за ~3 с). Час появи пам'ятаємо, тож перемальовування не перезапускає анімацію. Що вже було при
   завантаженні гри — без анімації. */
const OB_Q=Date.now()+2500,OB_SLOW={look:3200};
function obFresh(k){s.obK=s.obK||{};const now=Date.now();if(!(k in s.obK))s.obK[k]=now<OB_Q?0:now;const t=s.obK[k],D=OB_SLOW[k]||1600;
  return t&&now-t<D?{c:' obnew',st:`;--obd:${D}ms;--oba:-${now-t}ms`}:{c:'',st:''}}
function ob(k,a,i,spec,x,y,W,H,lab,tip,o={}){const[u,ol,w,h]=spec;if(!u)return'';const pulse=o.pulse&&(o.always||!(s.hsU||{})[k]);const fr=obFresh(k);
  const box=PCT(x-OP,y-OP,w+2*OP,h+2*OP,W,H),inn=`left:${(OP*100/(w+2*OP)).toFixed(3)}%;top:${(OP*100/(h+2*OP)).toFixed(3)}%;width:${(w/(w+2*OP)*100).toFixed(3)}%;height:${(h/(h+2*OP)*100).toFixed(3)}%`;
  const deco=!a;const gl=!deco&&(pulse||o.cd)?`<span class="gl" style="${inn};-webkit-mask-image:url(${u});mask-image:url(${u})"></span>`:'';
  const body=`<span class="obw"><span class="obj ${o.idle||''}">${deco?'':`<img class="obo" src="${ol}" alt="">`}<img class="obi" src="${u}" alt="" style="${inn}">${gl}</span></span>`;
  const z=10+Math.round(o.z!=null?o.z:y+h);
  if(deco)return`<span class="ob deco${o.cls?' '+o.cls:''}${fr.c}" data-sk="${k}" data-sig="${hsh(u+box+(o.cls||'')+fr.c)}" style="${box};z-index:${z}${fr.st}" aria-hidden="true">${body}${o.inner||''}</span>`;
  const core=`class="ob${fr.c}${pulse?' nw':''}${o.ok===false?' no':''}${o.cls?' '+o.cls:''}" data-a="${a}" data-i="${i||''}" data-k="${k}"${o.cd?` data-cd="${o.cd}" data-cs="${o.cs}"`:''} aria-label="${lab}" ${TA(tip||`<b>${lab}</b>`)}>${body}<span class="hsl">${lab}</span>${o.inner||''}`;
  return`<button type="button" data-sk="${k}" data-sig="${hsh(core+box)}" style="${box};z-index:${z}${fr.st}${o.cd?`;--p:${pOf(o.cd).toFixed(3)}`:''}" ${core}</button>`}
function innerAt(px,py,pw,ph,w,h,cls,extra){return`<i class="${cls}" style="left:${((px+OP)/(w+2*OP)*100).toFixed(2)}%;top:${((py+OP)/(h+2*OP)*100).toFixed(2)}%;width:${(pw/(w+2*OP)*100).toFixed(2)}%;height:${(ph/(h+2*OP)*100).toFixed(2)}%;${extra||''}" aria-hidden="true"></i>`}
function smkIn(sx,sy,w,h){return[0,1,2].map(n=>`<i class="smk" style="left:${((sx+OP)/(w+2*OP)*100).toFixed(2)}%;top:${((sy+OP)/(h+2*OP)*100).toFixed(2)}%;width:${(3/(w+2*OP)*100).toFixed(2)}%;--o:${n}s" aria-hidden="true"></i>`).join('')}
let popB='',upT={};
const flameURL=()=>pxURL('flm3:1',flame3Strip),fogURL=k=>pxURL('fog3:'+k,()=>fogBuf3(k));
/* Світло: піксельна карта з кількома смугами яскравості й дизерингом на межах.
   Окремий шар над сценою (mix-blend-mode: screen); вогнище мерехтить, вікна дихають. */
const LTC={};
function lightURL(key,srcs,W,H){if(LTC[key])return LTC[key];let u='';try{const k=SK,w=Math.round(W*k),h=Math.round(H*k),cv=document.createElement('canvas');if(!cv.getContext)return'';cv.width=w;cv.height=h;
  const g=cv.getContext('2d'),im=g.createImageData(w,h),A=new Float32Array(w*h),C=new Uint8Array(w*h*3),BA=[0,.16,.3,.46,.62];
  for(const L of srcs){const cx=L.x*k,cy=L.y*k,rx=L.r*k,ry=rx*(L.e||1),x0=Math.max(0,Math.floor(cx-rx)),x1=Math.min(w,Math.ceil(cx+rx)),y0=Math.max(0,Math.floor(cy-ry)),y1=Math.min(h,Math.ceil(cy+ry));
    for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){const d=Math.hypot((i-cx)/rx,(j-cy)/ry);if(d>=1)continue;const t=(1-d)*(L.n||3)+(bay(i,j)-.5)*.9,bd=Math.max(0,Math.min(4,Math.floor(t+.5))),a=BA[bd]*(L.a||1),q=j*w+i;
      if(a>A[q]){A[q]=a;C[q*3]=L.c[0];C[q*3+1]=L.c[1];C[q*3+2]=L.c[2]}}}
  for(let q=0;q<w*h;q++)if(A[q]>0){im.data[q*4]=C[q*3];im.data[q*4+1]=C[q*3+1];im.data[q*4+2]=C[q*3+2];im.data[q*4+3]=Math.round(A[q]*255)}
  g.putImageData(im,0,0);u=cv.toDataURL('image/png')}catch(e){u=''}return LTC[key]=u}
const WARM=[255,168,74],FIRE=[255,140,52],PALE=[255,236,168];
function yardLights(){const fire=[],win=[];if(!s.f.looked)return{fire,win};const hs=s.b.hearth||0,on=s.on.hearth!==false;
  if(hs&&on)fire.push({x:143,y:210,r:40+6*Math.min(5,hs),e:.62,c:FIRE,n:4},{x:143,y:202,r:16+2*hs,c:PALE,a:.6});
  const F=s.floors||{};if(hs){win.push({x:55,y:188,r:22,e:.8,c:WARM,a:.8})}
  for(const[k,y]of[['gallery',74],['study',113],['work',149]])if(F[k])win.push({x:55,y,r:15,c:WARM,a:.7});
  if(s.f.won)win.push({x:55,y:30,r:46,c:PALE,a:.9});
  for(const id in BANC){const lv=s.b[id]||0,B=BD.find(x=>x.id===id);if(!lv||!B||!B.show()||(s.dmgB||{})[id]||s.on[id]===false)continue;const g=stageOf(lv),strong=['forge','steel','glass','kiln','render'].includes(id);
    if(!strong&&!['smoke','apoth','house'].includes(id))continue;win.push({x:BANC[id][0],y:BANC[id][1]-8-4*g,r:(strong?18:12)+5*g,e:.8,c:strong?FIRE:WARM,a:strong?.8:.55})}
  for(let i=0;i<Math.min(4,s.b.house||0);i++)win.push({x:HOUSES[i][0]+5,y:HOUSES[i][1]-10,r:13,e:.8,c:WARM,a:.55});
  return{fire,win}}
function lightLayers(W,H,L){let h='';const sig=a=>a.map(o=>[o.x,o.y,o.r,o.a||1].join(',')).join(';');
  if(L.win.length){const k='w'+W+':'+sig(L.win);h+=`<img class="lt" data-sk="ltw" data-sig="${hsh(k)}" src="${lightURL(k,L.win,W,H)}" alt="" aria-hidden="true">`}
  if(L.fire.length){const k='f'+W+':'+sig(L.fire);h+=`<img class="lt ltf" data-sk="ltf" data-sig="${hsh(k)}" src="${lightURL(k,L.fire,W,H)}" alt="" aria-hidden="true" style="transform-origin:${(L.fire[0].x/W*100).toFixed(1)}% ${(L.fire[0].y/H*100).toFixed(1)}%">`}
  return h}
/* Мла, яку видно: густий бузково-сивий туман від моря; висота й щільність — за шкалою Мли (--mla на .scn) */
const mlaURL=k=>pxURL('mla5:'+k,()=>HI(()=>{const W=216,H=60,b=pbuf(W,H),T=6.2832;
  hiRect(b,0,0,W,H,(i,j,x,y)=>{const yy=y/H,n=.5+.32*Math.sin(x/W*T*4+k)*Math.sin(yy*T*1.2+x/W*T*2)+.18*Math.sin(x/W*T*10-k)*Math.sin(yy*T*2.6+1.3),d=Math.pow(yy,.9)*(.35+.8*n)*(yy>.85?(1-yy)/.15:1);
    if(d>bay(i,j)+.08)return n>.75?'6':n>.45?'5':'o'});return b})());
const mlaLayer=(top,h)=>`<span class="scm" data-sk="mla" data-sig="m5${top}" aria-hidden="true"><i class="mla" style="--t:${top}%;--h:${h}%;background-image:url(${mlaURL(5)})"></i><i class="mla m2" style="--t:${top}%;--h:${h}%;background-image:url(${mlaURL(11)})"></i></span>`;
const mlaV=()=>thrOn()?Math.min(1,(s.threat||0)/100):0;
const fogs=(top,h)=>`<span class="scf" data-sk="fog" data-sig="fog${top}" aria-hidden="true"><i class="fog" style="top:${top}%;height:${h}%;background-image:url(${fogURL(3)})"></i><i class="fog f2" style="top:${top+h*0.35}%;height:${h*0.8}%;background-image:url(${fogURL(8)})"></i></span>`;
function smk(x,y,W,H){return[0,1,2].map(n=>`<i class="smk" style="left:${(x/W*100).toFixed(2)}%;top:${(y/H*100).toFixed(2)}%;--o:${n}s" aria-hidden="true"></i>`).join('')}
function bpopHTML(){const id=popB;if(!id)return'';let nm,lvl,d,btns='',extra='';
  if(id.startsWith('fl:'))return flPopHTML(id.slice(3));
  if(id.startsWith('wk:')||id.startsWith('st:'))return roomPopHTML(id);
  if(id.startsWith('mp:'))return mapPopHTML(id);
  if(id.startsWith('lc:'))return locPopHTML(id);
  if(id==='sh:ford')return fordPopHTML();
  if(id==='cl:shelf')return shelfPopHTML();
  if(id==='cl:wolf')return wolfPopHTML();
  if(id.startsWith('kt:'))return kitPopHTML(id);
  if(id.startsWith('hr:'))return heroPopHTML(id);
  if(id.startsWith('fk:')||id.startsWith('tr:'))return villagePopHTML(id);
  if(id==='hearth'){const n=s.b.hearth||0,c=bCost(HEARTH);nm='Вогнище';lvl=n;d=`+${2*n} жару/с, спалює ${fr(0.12*n)} плавника/с.`;
    btns=`${btn('Підкинути дров','bld','hearth',{ok:()=>afford(c),cls:'main'})}<span class="ccs">${costChips(c)}</span>${btn(s.on.hearth===false?'Розпалити':'Пригасити','tog','hearth',{cls:'toggle'})}${reserveButton('hearth')}`;extra+=`<p class="m">${reserveText('hearth')}</p>`}
  else{const b=BD.find(x=>x.id===id);if(!b)return'';const n=s.b[id]||0,w=(s.wk||{})[id]||0,mx=b.max&&n>=b.max,dm=(s.dmgB||{})[id];nm=b.n;lvl=n;d=typeof b.d==='function'?b.d():b.d||'';
    if(dm){const rc=repCost(b);extra+=`<p class="foe">Мла зламала будівлю. Поки її не полагодиш, вона не працює.</p>`;btns+=`${btn('Полагодити','repair',id,{ok:()=>afford(rc),cls:'main'})}<span class="ccs">${costChips(rc)}</span>`}
    else{if(s.f.people&&n&&WKB.includes(id))extra+=`<div class="bpw">${mstOf(id)?'<span class="chip">майстер ×2</span> ':''}робітники <b>${w}</b> з ${n} ${btn('−','wk-',id,{cls:'toggle',ok:w>0,lab:'Зняти робітника'})}${btn('+','wk+',id,{cls:'toggle',ok:()=>freeW()>0&&w<n,lab:'Додати робітника'})}</div>`;
      if(b.conv&&n){btns+=btn(s.on[id]===false?'Увімкнути':'Вимкнути','tog',id,{cls:'toggle'})+reserveButton(id);if(reserveInputs(id).length)extra+=`<p class="m">${reserveText(id)}</p>`}
      btns+=mx?'<span class="done">збудовано</span>':`${btn(n?'Покращити':'Збудувати','bld',id,{ok:()=>afford(bCost(b)),cls:'main'})}<span class="ccs">${costChips(bCost(b))}</span>`;
      if(n&&n<5&&!b.max)extra+=`<p class="hand bph2">${n<3?'Ще трохи роботи — і будівля помітно розростеться.':'Ще кілька рівнів — і вона стане справжньою окрасою двору.'}</p>`}}
  const html=`<div class="bpop" role="dialog" aria-label="${nm}"><div class="bph"><b>${nm}</b>${lvl?`<span class="bplv">рівень ${lvl}</span>`:'<span class="bplv">ще не збудовано</span>'}<button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div><p class="m">${d}</p>${extra}<div class="act">${btns}</div></div>`;
  return html}
function placePop(){try{let L=document.getElementById('popl');if(!popB||s.cb){if(L&&L.innerHTML){L.innerHTML='';L.dataset.sig=''}return}
  if(!L){L=document.createElement('div');L.id='popl';document.body.appendChild(L)}
  const el=document.querySelector(popB==='hearth'?'.scn [data-k="hearth"]':/^(fl|wk|st|mp|hr|fk|tr|lc|sh|cl|kt):/.test(popB)?`#stage .scn [data-k="${popB}"]`:`.scn [data-k="b:${popB}"],.scn [data-k^="b:${popB}"]`);if(!el){L.innerHTML='';return}
  const html=bpopHTML(),sg=hsh(html);if(L.dataset.sig!==sg){L.innerHTML=html;L.dataset.sig=sg}const c=L.firstElementChild;if(!c)return;
  if(innerWidth<=560||(window.matchMedia&&matchMedia('(max-width:560px)').matches)){c.classList.add('sheet');return}c.classList.remove('sheet');
  const r=el.getBoundingClientRect(),cw=c.offsetWidth,ch=c.offsetHeight;let x=r.left+r.width/2+scrollX-cw/2;x=Math.max(8,Math.min(x,document.documentElement.clientWidth-cw-8));
  let y=r.top+scrollY-ch-8;if(r.top-ch-8<80)y=r.bottom+scrollY+8;c.style.left=x+'px';c.style.top=y+'px'}catch(e){}}
function homeHS(){const W=YW,H=YH;let h='';const st=yardSt2();
  if(!s.f.looked){const e=obURL('ember3',emberObj3);h+=ob('ember','blow','',e,84,206,W,H,'Подмухати на жарину','<b>Жарина</b><br>Подмухай, і вона спалахне яскравіше: +3 жару.',{pulse:1,cd:'blow',cs:2,inner:'<i class="emb"></i>'});
    if(s.f.lk)h+=ob('look','look','',obURL('tsil3',()=>towerSil3(st)),18,8,W,H,'Роззирнутися','<b>Роззирнутися</b><br>Очі звикли до темряви. У ній проступають обриси стін і сходів.',{pulse:1});return h}
  h+=fogs(42,14)+mlaLayer(36,36)+fxCanvas('yd',W,H)+lightLayers(W,H,yardLights());
  const tk='tw3:'+[st.floors.work,st.floors.gallery,st.floors.study,st.floors.lantern,st.hearth,st.won].map(v=>v?1:0).join('');
  h+=ob('tower',s.tabs.tower?'tab':'','tower',obURL(tk,()=>towerObj3(st)),18,8,W,H,'Нагору, до поверхів','<b>Маяк</b><br>Сходи ведуть угору, до поверхів.',{pulse:1});
  if(s.f.won)h+=`<i class="lglow" data-sk="lglow" data-sig="1" style="${PCT(28,0,54,52,W,H)};z-index:5" aria-hidden="true"></i>`;
  let pc=null;
  const bob=(id,key,bx,by,spec,lvl,ghost,n)=>{const B=BD.find(b=>b.id===id),dm=(s.dmgB||{})[id],[u,ol,w,hh]=spec,x=Math.round(bx-w/2),y=by-hh;let inner='';
    if(!ghost&&BSMK3[id]&&!dm&&s.on[id]!==false){const[sx,sy]=topPx(key,()=>BLD3[id==='house'?'house':id](id==='house'?1:stageOf(lvl)));inner+=smkIn(sx,sy,w,hh)}
    if(upT[id]&&Date.now()-upT[id]<1600&&!ghost)inner+=`<i class="upfx" aria-hidden="true"><b>${lvl>1?'Рівень '+lvl:'Збудовано'}</b></i>`;
    if(dm)inner+=`<i class="dmgx" aria-hidden="true"></i>`;
    return ob(n?'b:'+id+n:'b:'+id,'bpop',id,spec,x,y,W,H,ghost?`${B.n}: збудувати`:B.n,`<b>${B.n}</b>${ghost?'<br>Тут можна збудувати.':`, рівень ${lvl}${dm?'<br><span class="foe">пошкоджено</span>':''}`}`,{pulse:1,cls:(ghost?'ghost':'')+(dm?' dmg':'')+(popB===id?' sel':''),idle:['boom','traps','pot'].includes(id)?'i-bob':id==='winch'?'i-sway':'',inner})};
  const vis=BD.filter(b=>b.show());
  for(const B of vis){const id=B.id,lvl=s.b[id]||0;
    if(id==='house'){const nH=Math.max(1,Math.min(4,lvl));for(let k=0;k<nH;k++){const sp=obURL('h3:house',()=>BLD3.house(1));h+=bob('house','house',HOUSES[k][0],HOUSES[k][1],sp,lvl,!lvl,k)}continue}
    if(!BANC[id])continue;const g=lvl?stageOf(lvl):1,key=id+g,sp=obURL('b3:'+key,()=>BLD3[id](g));h+=bob(id,key,BANC[id][0],BANC[id][1],sp,lvl,!lvl)}
  if(s.b.forge){const c={scrap:4,ember:2},n=smithN();h+=s.hot?ob('anvil','smithhot','',obURL('anvil3h',()=>anvilObj3(1)),180,150,W,H,'Бити по заготовці','<b>Заготовка розжарилася!</b><br>Влуч молотом у слушну мить, і вийде більше заліза. Можна й не чіпати: метал охолоне, нічого не втратиш.',{cls:'bite',inner:'<i class="bang">!</i>'})
    :ob('anvil','smith','',obURL('anvil3',()=>anvilObj3(0)),180,150,W,H,'Кувати',`<b>Ковадло</b><br>Перекувати брухт на залізо: ${costTxt(c)} → ${R('iron',n)}.`,{pulse:1,cd:'smith',cs:4})}
  const hx=124,hy=206;
  if(!s.b.hearth){const c=bCost(HEARTH),ok=afford(c);
    /* Жарина завжди лишається жариною; вогнище — окремий контур-креслення поруч */
    h+=ob('ember2','blow','',obURL('ember3',emberObj3),hx-16,hy+7,W,H,'Подмухати на жарину',`<b>Жарина</b><br>Подмухай, і вона спалахне яскравіше: +3 жару.`,{pulse:1,cd:'blow',cs:2,inner:'<i class="emb"></i>'});
    if(s.seen.wood)h+=ob('hearth0',ok?'bld':'','hearth',obURL('hearth3g',()=>hearthObj3({hearth:1,plan:1})),hx+4,hy,W,H,ok?'Скласти вогнище':'Місце для вогнища',ok?`<b>Скласти вогнище</b><br>Обкласти жарину камінням і підкинути дров: ${costTxt(c)}.<br>Вогнище горітиме саме й даватиме жар.`:`<b>Місце для вогнища</b><br>Тут можна скласти вогнище, коли буде ${costTxt(c)}.`,{pulse:ok?1:0,always:1,cls:'ghost'+(ok?' ready':'')})}
  else{const n=s.b.hearth,lit=s.on.hearth!==false,sp=obURL('hearth3b',()=>hearthObj3({hearth:1})),[,,hw,hh]=sp;
    const fl=lit?innerAt(10,-22,18,27,hw,hh,'flm'+(n>=4?' big':''),`background-image:url(${flameURL()})`):'';
    h+=ob('hearth','bpop','hearth',sp,hx,hy,W,H,'Вогнище',`<b>Вогнище, рівень ${n}</b><br>Натисни, щоб підкинути дров чи пригасити.`,{inner:fl+(upT.hearth&&Date.now()-upT.hearth<1600?`<i class="upfx" aria-hidden="true"><b>Рівень ${n}</b></i>`:''),cls:popB==='hearth'?'sel':''})}
  if(s.tabs.shore)h+=ob('toshore','tab','shore',obURL('sign3',signObj3),196,196,W,H,'До берега','<b>Стежка до берега</b><br>Плавник, уламки й риба.',{pulse:1});
  return h}
function shoreHS(){const W=SW,H=SH,S=(x,y,w,h)=>PCT(x,y,w,h,W,H);let h=fogs(8,22)+mlaLayer(6,62)+fxCanvas('sh',W,H);
  h+=ob('home','tab','home',obURL('door3',doorObj3),6,51,W,H,'До маяка','<b>Двері маяка</b><br>Назад, до вогнища.');
  if(s.f.hook)h+=ob('hook','','',obURL('hook3',hookObj3),104,52,W,H,'Багор','');
  else if(shoreHookReady())h+=ob('hook','hook','',obURL('hook3',hookObj3),104,52,W,H,'Змайструвати багор',`<b>Багор</b><br>Довга жердина з гаком, щоб діставати плавник, який пропливає далі від берега.<br>Ціна: ${costTxt(HOOKC)}`,{pulse:1,always:1,ok:afford(HOOKC)});
  if(s.ship)h+=ob('ship','hsgo','ship',obURL('ship3',shipObj3),168,0,W,H,'Торговий когг','<b>Торговий когг</b><br>Подивитися обміни.',{pulse:1,always:1,idle:'i-bob'});
  if(s.f.boat)h+=ob('pier','hsgo','pier',obURL('pier3'+((s.exp||[]).length?'o':''),()=>pierObj3({boatOut:!!(s.exp||[]).length})),231,48,W,H,'Пристань','<b>Пристань</b><br>Виходи в море й кораблі.');
  if(s.f.wreck)h+=ob('wreck','scrapw','',obURL('wreck3',wreckObj3),186,69,W,H,'Розбирати уламки','<b>Уламки човна</b><br>Цвяхи, скоби, обшивка: усе згодиться.',{pulse:1,cd:'scrapw',cs:2,inner:'<i class="spk"></i>'});
  if(s.f.rod)h+=s.bite?ob('rod','bigfish','',obURL('rod3',rodObj3),162,45,W,H,'Тягнути велику рибу','<b>Клює щось велике!</b><br>Натисни, щоб виводити. Можна й не чіпати: риба зірветься, нічого не втратиш.',{cls:'bite',inner:'<i class="bob"></i><i class="bang">!</i>'})
    :ob('rod','fishing','',obURL('rod3',rodObj3),162,45,W,H,'Рибалити','<b>Вудка</b><br>Закинь і чекай, поки клюне.',{pulse:1,cd:'fishing',cs:3,idle:'i-sway',inner:'<i class="bob"></i>'});
  else if(shoreRodReady()){const c=RC.find(r=>r.id==='rod').c;h+=ob('rod','craft','rod',obURL('rod3',rodObj3),162,45,W,H,'Змайструвати просту вудку',`<b>Проста вудка</b><br>Жердина, линва й гачок.<br>Ціна: ${costTxt(c)}`,{pulse:1,always:1,ok:afford(c)})}
  h+=shoreFordHS(W,H)+shoreFightHS(W,H)+shoreRuneHS(W,H);
  if(s.flot)h+=ob('flot:'+s.flot.k,'flotmg','',obURL('flot3:'+s.flot.k,()=>flotObj3(s.flot.k)),126,78,W,H,'Оглянути знахідку','<b>Прибій щось викинув</b><br>Підчепи гаком, поки хвилі не забрали.',{pulse:1,always:1,idle:'i-bob'});
  const[lu,lo,lw,lh]=obURL('log3',log3Buf),pul=!(s.hsU||{}).gather,zx=33,zy=60,zw=66,zh=33,rx=26,ry=19;
  const zcore=`class="hs zone${pul?' nw':''}" data-a="gather" data-i="" data-k="gather" data-cd="gather" data-cs="1" aria-label="Збирати плавник" ${TA('<b>Прибій</b><br>Хвилі підкочують плавник. Підбери, що винесло.')}><span class="dlw" style="left:${(rx/zw*100).toFixed(2)}%;top:${(ry/zh*100).toFixed(2)}%;width:${((lw+2*OP)/zw*100).toFixed(2)}%;height:${((lh+2*OP)/zh*100).toFixed(2)}%"><img class="obo" src="${lo}" alt=""><img class="obi" src="${lu}" alt="" style="left:${(OP*100/(lw+2*OP)).toFixed(2)}%;top:${(OP*100/(lh+2*OP)).toFixed(2)}%;width:${(lw/(lw+2*OP)*100).toFixed(2)}%;height:${(lh/(lh+2*OP)*100).toFixed(2)}%"><span class="gl" style="left:${(OP*100/(lw+2*OP)).toFixed(2)}%;top:${(OP*100/(lh+2*OP)).toFixed(2)}%;width:${(lw/(lw+2*OP)*100).toFixed(2)}%;height:${(lh/(lh+2*OP)*100).toFixed(2)}%;-webkit-mask-image:url(${lu});mask-image:url(${lu})"></span></span><span class="hsl">Збирати плавник</span>`;
  h+=`<button type="button" data-sk="gather" data-sig="${hsh(zcore)}" style="${S(zx,zy,zw,zh)};z-index:${10+zy+zh};--p:${pOf('gather').toFixed(3)}" ${zcore}</button>`;
  return h}
/* Сцена живе поза #main і латається на місці: незмінені вузли не від'єднуються, тож їхні анімації не перезапускаються. */
function patchStage(html){const st=$('stage');if(!st)return;if(!st.querySelector){st.innerHTML=html?`<div class="scw">${html}</div>`:'';return}
  if(!html){if(st.firstChild)st.innerHTML='';return}
  try{const tp=document.createElement('template');tp.innerHTML=html;const nw=tp.content.firstElementChild,old=st.querySelector('.scn[data-scn]');
    if(!old||old.dataset.scn!==nw.dataset.scn){st.innerHTML=`<div class="scw">${html}</div>`;return}
    const om={};for(const c of[...old.children])if(c.dataset&&c.dataset.sk)om[c.dataset.sk]=c;const used=new Set();
    for(const c of[...nw.children]){const k=c.dataset&&c.dataset.sk,o=k&&om[k];
      if(o&&o.dataset.sig===c.dataset.sig){if(k==='bg'){const nh=c.querySelector('[data-h]'),oh=o.querySelector('[data-h]');if(nh&&oh)oh.dataset.h=nh.dataset.h}used.add(o)}
      else if(o){o.replaceWith(c);used.add(c)}else{old.appendChild(c);used.add(c)}}
    for(const c of[...old.children])if(!used.has(c))c.remove()}catch(e){st.innerHTML=`<div class="scw">${html}</div>`}}
function hsPop(el,e,r0){try{const out=[];for(const k in s.r){const d=(s.r[k]||0)-(r0[k]||0);if(d>0.001)out.push([k,d])}if(!out.length)return;
  const box=el.getBoundingClientRect(),x=box.left+box.width/2+scrollX,y=box.top+scrollY-4;
  out.slice(0,2).forEach(([k,d],ix)=>{const p=document.createElement('div');p.className='fpop';p.style.left=x+'px';p.style.top=(y-ix*18)+'px';p.innerHTML=`${pimg(icoURL(k),16,16,'')}+${fmt(d)}`;document.body.appendChild(p);setTimeout(()=>p.remove(),1150)})}catch(err){}}


/* Реакція на натискання: об'єкт важко присідає (без пружини), матеріал відповідає частинками й світлом */
const MATK=(k,a)=>{k=k||'';if(a==='blow'||a==='smith'||a==='smithhot'||k==='hearth'||k==='hearth0')return{k:'spark',n:14,fl:1};
  if(a==='fishing'||a==='bigfish'||a==='flotmg'||a==='flot')return{k:'splash',n:12};if(a==='gather')return{k:'splash',n:6};if(a==='scrapw')return{k:'chip',n:12,also:'dust'};
  if(a==='bld'||a==='floor'||a==='flu')return{k:'dust',n:16};if(k.startsWith('b:')||k.startsWith('fl:'))return{k:'dust',n:5};return{k:'dust',n:4}};
function gatherFx(el){if(!actOk)return;el.style.setProperty('--p',pOf('gather').toFixed(3));if(RM())return;const log=el.querySelector('.dlw');if(!log||!log.animate)return;for(const a of log.getAnimations())a.cancel();log.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate(-30%,-75%) rotate(-8deg)',opacity:1,offset:.17},{transform:'translate(-58%,-130%) rotate(-13deg)',opacity:0,offset:.34},{transform:'translate(48%,42%) rotate(7deg)',opacity:0,offset:.35},{transform:'translate(12%,9%) rotate(2deg)',opacity:.9,offset:.77},{transform:'translate(0,0) rotate(0)',opacity:1}],{duration:900,easing:'ease-in-out'});}
function pressFx(el,e){try{if(!el.classList.contains('ob')&&!el.classList.contains('hs'))return;const gather=el.dataset.a==='gather';if(gather)gatherFx(el);else{el.classList.remove('press');void el.offsetWidth;el.classList.add('press');setTimeout(()=>el.classList.remove('press'),180)}
  if(!actOk||RM()||!FX.cv)return;const scn=el.closest('.scn');if(!scn)return;const r=scn.getBoundingClientRect(),b=(gather?el.querySelector('.dlw')||el:el).getBoundingClientRect(),cx=!gather&&e&&e.clientX?e.clientX:b.left+b.width/2,cy=!gather&&e&&e.clientY?e.clientY:b.top+b.height/2,
    W=FX.W/SK,H=FX.H/SK,x=(cx-r.left)/r.width*W,y=(cy-r.top)/r.height*H,m=MATK(el.dataset.k,el.dataset.a);fxBurst(FX.sc,x,y,m.k,m.n);if(m.also)fxBurst(FX.sc,x,y,m.also,6);if(m.fl)fxFlash(FX.sc,x,y)}catch(er){}}

/* Картка поверху маяка: опис, відновлення, покращення, перехід до пов'язаної вкладки */
const FLTAB={hall:'home',work:'work',study:'study',gallery:'map'};
function flPopHTML(id){const nm=FLN[id],built=floorBuilt(id),U2=FLU[id]||[],tr=fuL(id),fl=FL.find(f=>f.id===id);let ex='',bt='';
  if(!built){if(id==='hall')ex+=`<p class="m">Склади вогнище біля маяка, і тут знову стане тепло.</p>`;
    else{const ix=FL.findIndex(f=>f.id===id),prevOk=ix===0||s.floors[FL[ix-1].id];
      if(!prevOk)ex+=`<p class="m">Спершу треба відбудувати нижчі поверхи.</p>`;
      else{const reqOk=!fl.req||fl.req(),itOk=afford({},fl.it||{});ex+=`<p class="m">${fl.d}</p>${!reqOk||!itOk?`<p class="m">${typeof fl.why==='function'?fl.why():fl.why}</p>`:''}`;bt+=`${btn('Відновити','floor',id,{ok:()=>(!fl.req||fl.req())&&afford(fl.c,fl.it),cls:'main'})}<span class="ccs">${costChips(Object.assign({},fl.c,fl.it||{}))}</span>`}}}
  else{if(tr)ex+=`<div class="flu">${U2.slice(0,tr).map(u=>`<span class="chip" ${TA(`<b>${u.n}</b><br>${u.d}`)}>${u.n}</span>`).join(' ')}</div>`;const nx=U2[tr];
    if(nx&&nx.req()){ex+=`<p class="m"><b>${nx.n}.</b> ${nx.d}</p>`;bt+=`${btn('Збудувати','flu',id,{ok:()=>afford(nx.c),cls:'main'})}<span class="ccs">${costChips(nx.c)}</span>`}
    else if(nx)ex+=`<p class="hand bph2">${tr?'Згодом тут можна буде зробити ще краще.':'Згодом цей поверх можна буде облаштувати краще.'}</p>`;else ex+=`<p class="hand bph2">Поверх облаштовано повністю.</p>`;
    const tb=FLTAB[id];if(tb&&s.tabs[tb]&&tb!=='home')bt+=btn('Зайти','tab',tb,{cls:'toggle'})}
  const lp=id==='lantern'?lanternPart():'';
  return`<div class="bpop${lp?' wide':''}" role="dialog" aria-label="${nm}"><div class="bph"><b>${nm}</b><span class="bplv">${built?(tr?'облаштовано: '+tr:'відновлено'):'у руїнах'}</span><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div><p class="m">${FLD[id]}</p>${lp}${ex}<div class="act">${bt}</div></div>`}
