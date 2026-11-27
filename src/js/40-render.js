/* ============ RENDER ============ */
function tabKeys(t){const k=[];
  if(t==='home'){for(const b of BD)if(b.show())k.push('b:'+b.id);if(s.f.people)k.push('people')}
  else if(t==='work'){for(const rc of RC)if(rcVisible(rc))k.push('r:'+rc.id);if(s.b.forge)for(const id of WEAP)if(has(id)&&WF[id][wF(id)]&&wmLv(id)>=WFM[wF(id)]&&(wF(id)<1||s.mst.kindrat))k.push('w:'+id+wF(id))}
  else if(t==='study'){for(const r of RS)if(!s.rs[r.id]&&rsReady(r))k.push('s:'+r.id)}
  else if(t==='map'){for(const id in LOC)if(s.disc[id]){k.push('L:'+id);for(const S of LOC[id].spots){if(S.show&&!S.show())continue;for(const A of S.acts||[]){const aid=`${id}.${S.id}.${A.id}`;if(A.once&&s.done[aid])continue;if(A.show&&!A.show())continue;k.push('a:'+aid)}}}}
  else if(t==='chron'){for(const m of s.mom||[])if(m.mj&&m.k!=='start')k.push('m:'+m.t+m.n)}
  else if(t==='folk'){for(const f in FAC)if(FAC[f].known()){k.push('fk:'+f+rankI(fac(f)));const q=(s.req||{})[f];if(q)k.push('fq:'+f+q.n)}}
  else if(t==='shore'){if(s.flot)k.push('fl:'+s.flot.until);if(s.ship)k.push('sh:'+s.ship.until)}
  else if(t==='tower'){for(const id in FLU){const nx=FLU[id][fuL(id)];if(floorBuilt(id)&&nx&&nx.req())k.push('u:'+id+fuL(id))}if(s.lost)k.push('lost:'+s.lost.until)}
  else if(t==='trade'){for(const it of SHOP)if(!it.show||it.show())k.push('t:'+it.id)}
  else if(t==='journal'){k.push('ch:'+s.chs.length,'bt:'+Object.keys(s.bts||{}).length,'pg:'+s.pages.length,'od:'+Object.keys(s.odd).length,'sq:'+SQ.filter(q=>q[1]()).length,'sqd:'+SQ.filter(q=>q[1]()&&q[2]()).length,'met:'+Object.keys(s.met).length)}
  return k}
function isNew(t){if(s.newTab[t])return true;if(t==='hero')return s.h.pts+s.h.sp>0||(s.h.fp>0&&FT.some(featOk));const sk=(s.seenK||{})[t]||{};return tabKeys(t).some(k=>!sk[k])}
function markSeen(t,pre){s.seenK=s.seenK||{};const sk=s.seenK[t]=s.seenK[t]||{};for(const k of tabKeys(t))if(!pre||k.indexOf(pre)===0)sk[k]=1}
let prev9={};function snap9(t){prev9=Object.assign({},(s.seenK||{})[t]||{})}
const fresh9=k=>prev9[k]?'':' <span class="chip new">нове</span>';
let lastView='';const RM=()=>{try{return!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}catch(e){return false}};
let fxBusy=0;
function playFx(list){const wrap=$('gwrap'),lay=$('fxl');if(!wrap||!lay||!wrap.getBoundingClientRect||RM())return;const wr=wrap.getBoundingClientRect();
  const cell=(x,y)=>{const b=wrap.querySelector(`button[data-i="${x},${y}"]`);if(!b)return null;const r=b.getBoundingClientRect();return{b,x:r.left-wr.left+r.width/2,y:r.top-wr.top+r.height/2,w:r.width}};
  const tot=list.reduce((m,e)=>Math.max(m,e.at+(e.d||200)),0),k=tot>6500?6500/tot:1;fxBusy=Date.now()+tot*k+200;
  const mk=(cls,html)=>{const el=document.createElement('div');el.className=cls;if(html)el.textContent=html;lay.appendChild(el);return el};
  /* піксельні частинки: іскри від удару, кров героя, пил від промаху й смерті */
  const burst=(c1,at,cols,n,sp,up)=>{const sz=Math.max(3,Math.round(c1.w/9));for(let i=0;i<n;i++){const el=mk('fxq');el.style.width=el.style.height=sz+'px';el.style.background=cols[i%cols.length];el.style.opacity='0';
    const an=Math.random()*Math.PI*2,r=c1.w*(sp*.5+Math.random()*sp),dx=Math.cos(an)*r,dy=Math.sin(an)*r*.7-(up?c1.w*.25:0),x0=c1.x,y0=c1.y-c1.w*.15;
    const a=el.animate([{opacity:1,transform:`translate(${x0}px,${y0}px)`},{opacity:1,transform:`translate(${x0+dx*.7}px,${y0+dy*.7}px)`,offset:.45},{opacity:0,transform:`translate(${x0+dx}px,${y0+dy+c1.w*.3}px)`}],{duration:380+Math.random()*220,delay:at,fill:'both',easing:'ease-out'});a.onfinish=()=>el.remove()}};
  for(const e of list){const at=e.at*k;
    if(e.t==='mv'){const c1=cell(e.x1,e.y1),c0=cell(e.x0,e.y0);if(!c1||!c0)continue;const im=c1.b.querySelector('img');if(!im||!im.animate)continue;
      /* ходьба: від клітинки до клітинки, з кроком-підскоком і похитуванням; птахи пурхають, плавці ковзають */
      const P=(e.p&&e.p.length>1?e.p:[[e.x0,e.y0],[e.x1,e.y1]]).map(([x,y])=>{const q=cell(x,y);return q?[q.x-c1.x,q.y-c1.y]:null}).filter(Boolean),n=P.length-1,hop=c1.w*(e.m==='fly'?.16:e.m==='swim'?0:.09),fr=[];
      for(let i=0;i<=n;i++){fr.push({offset:n?i/n:1,transform:`translate(${P[i][0]}px,${P[i][1]}px)`});
        if(i<n){const mx=(P[i][0]+P[i+1][0])/2,my=(P[i][1]+P[i+1][1])/2,rot=e.m==='fly'||e.m==='swim'?0:(i%2?4:-4);fr.push({offset:(i+.5)/n,transform:`translate(${mx}px,${my-hop}px) rotate(${rot}deg)`})}}
      const opt={duration:(e.d||220)*k,delay:at,fill:'backwards',easing:'linear'};im.animate(fr,opt);const bar=c1.b.querySelector('.uhp');if(bar&&bar.animate)bar.animate(P.map(([x,y],i)=>({offset:n?i/n:1,transform:`translate(${x}px,${y}px)`})),opt)}
    else if(e.t==='turn'){const c1=cell(e.x,e.y);if(!c1)continue;const el=mk('fxt');el.style.width=el.style.height=c1.w*.9+'px';el.style.opacity='0';const a=el.animate([{opacity:0,transform:`translate(${c1.x-c1.w*.45}px,${c1.y-c1.w*.45}px) scale(.6)`},{opacity:.9,transform:`translate(${c1.x-c1.w*.45}px,${c1.y-c1.w*.45}px) scale(1)`,offset:.4},{opacity:0,transform:`translate(${c1.x-c1.w*.45}px,${c1.y-c1.w*.45}px) scale(1.15)`}],{duration:420,delay:at,fill:'both'});a.onfinish=()=>el.remove()}
    else if(e.t==='bump'){const c0=cell(e.x0,e.y0),c1=cell(e.x1,e.y1);if(!c0||!c1)continue;const im=c0.b.querySelector('img');const dx=(c1.x-c0.x)*0.45,dy=(c1.y-c0.y)*0.45;if(im&&im.animate)im.animate([{transform:'none'},{transform:`translate(${-dx*.15}px,${-dy*.15}px) scale(1.05)`,offset:.35},{transform:`translate(${dx}px,${dy}px) scale(1.08)`,offset:.6},{transform:'none'}],{duration:260,delay:at,easing:'ease-out'})}
    else if(e.t==='txt'){const c1=cell(e.x,e.y);if(!c1)continue;const el=mk('fxn '+(e.k||''),e.v);el.style.opacity='0';const a=el.animate([{opacity:0,transform:`translate(${c1.x}px,${c1.y-c1.w*0.1}px) translate(-50%,-50%) scale(.7)`},{opacity:1,transform:`translate(${c1.x}px,${c1.y-c1.w*0.35}px) translate(-50%,-50%) scale(1.1)`,offset:.2},{opacity:0,transform:`translate(${c1.x}px,${c1.y-c1.w*1.1}px) translate(-50%,-50%)`}],{duration:950,delay:at,fill:'both'});a.onfinish=()=>el.remove();
      if(e.k==='hurt')burst(c1,at,['#c9584a','#8f2f2b','#e3ebe6'],7,.45);else if(e.k==='hit')burst(c1,at,['#fff0b0','#f0b84a','#e3ebe6'],6,.45);else if(e.k==='crit')burst(c1,at,['#fff0b0','#ffa640','#e5662a','#ffffff'],11,.7);else if(e.k==='miss')burst(c1,at,['#b8ab8a','#968a6e'],4,.3,1);
      if(e.k==='hit'||e.k==='crit'||e.k==='hurt'){const im=c1.b.querySelector('img');if(im&&im.animate)im.animate([{transform:'none',filter:'brightness(2.4) saturate(.2)'},{transform:'translateX(-3px)',filter:'brightness(1.6)'},{transform:'translateX(3px)'},{transform:'none',filter:'none'}],{duration:260,delay:at})}}
    else if(e.t==='shot'){const c0=cell(e.x0,e.y0),c1=cell(e.x1,e.y1);if(!c0||!c1)continue;const el=mk('fxp'+(e.cold?' cold':''));el.style.opacity='0';const a=el.animate([{opacity:1,transform:`translate(${c0.x}px,${c0.y}px)`},{opacity:1,transform:`translate(${c1.x}px,${c1.y}px)`}],{duration:(e.d||170)*k,delay:at,fill:'backwards'});a.onfinish=()=>el.remove()}
    else if(e.t==='boom'){const c1=cell(e.x,e.y);if(!c1)continue;const r=c1.w*((e.r||1)+0.6)*2;const el=mk('fxb'+(e.cold?' cold':''));el.style.width=el.style.height=r+'px';el.style.opacity='0';
      const a=el.animate([{opacity:1,transform:`translate(${c1.x-r/2}px,${c1.y-r/2}px) scale(.15)`},{opacity:.9,transform:`translate(${c1.x-r/2}px,${c1.y-r/2}px) scale(.85)`,offset:.5},{opacity:0,transform:`translate(${c1.x-r/2}px,${c1.y-r/2}px) scale(1.05)`}],{duration:480,delay:at,fill:'both'});a.onfinish=()=>el.remove()}
    else if(e.t==='die'){const c1=cell(e.x,e.y);if(!c1)continue;burst(c1,at+120,['#8c9097','#666a71','#b8ab8a','#4a4d54'],10,.55,1);if(c1.b.querySelector('img'))continue;const el=document.createElement('img');el.className='fxg';el.src=sprURL(e.spr);el.style.width=el.style.height=c1.w+'px';el.style.opacity='0';lay.appendChild(el);
      const a=el.animate([{opacity:1,transform:`translate(${c1.x-c1.w/2}px,${c1.y-c1.w/2}px)`},{opacity:1,transform:`translate(${c1.x-c1.w/2}px,${c1.y-c1.w/2}px) rotate(-8deg)`,offset:.3},{opacity:0,transform:`translate(${c1.x-c1.w/2}px,${c1.y-c1.w/2+8}px) rotate(-90deg) scale(.6)`}],{duration:620,delay:at+120,fill:'both'});a.onfinish=()=>el.remove()}
    else if(e.t==='appear'){const c1=cell(e.x,e.y);if(!c1)continue;const im=c1.b.querySelector('img');if(im&&im.animate)im.animate([{opacity:0,transform:'translateY(6px) scale(.7)'},{opacity:1,transform:'none'}],{duration:380,delay:at,fill:'backwards'})}}}
let B={},bn=0;
function D(fn){const k='b'+(bn++);B[k]=fn;return k}
function btn(label,a,i='',o={}){let at='',cls=o.cls||'',ok=o.ok;
  if(o.cd){const k=o.cd,f=ok;ok=()=>!onCd(k)&&(typeof f==='function'?f():f!==false);cls+=' cd';at+=` data-cd="${k}" data-cs="${o.cs}"`}
  if(typeof ok==='function'){at+=` data-ok="${D(ok)}"`;if(!ok())at+=' disabled'}else if(ok===false)at+=' disabled';
  if(o.lab)at+=` aria-label="${o.lab}"`;
  return `<button type="button" class="${cls.trim()}" data-a="${a}" data-i="${i}"${at}>${label}</button>`}
function V(fn){return `<span data-v="${D(fn)}">${fn()}</span>`}
function VH(fn){return `<span data-h="${D(fn)}">${fn()}</span>`}
function W(fn){return `<i data-w="${D(fn)}" style="width:${fn()}%"></i>`}
function chk(k,v){return `<span class="chk ${st(k)>=v?'ok':'no'}" title="Потрібно ${SN[k]} ${v}, у тебе ${st(k)}">${SN[k]} ${v}</span>`}
const art=t=>`<pre class="art" aria-hidden="true">${esc(t).replace(/~+/g,m=>`<span class="sea">${m}</span>`)}</pre>`;

let bellK='';function rBell(){const el=$('bell');if(!el)return;const n=s.bellHold&&!s.cb?(s.dlg||[]).length:0,k=String(n);if(k===bellK)return;if(n&&!+bellK)sfx('bell');bellK=k;
  el.innerHTML=n?`<button type="button" class="bellb" data-a="bellOpen" data-i="" aria-label="Події, що чекають на тебе: ${n}" ${TA('<b>Поки тебе не було</b><br>Тут чекають події й листи. Натисни, щоб переглянути.')}>${pimg(pxURL('bell',bellBuf),24,24,'')}<b>${n}</b></button>`:''}
function rTop(){rBell();const el=$('top');if(!el)return;const items=[];
  if(s.cb){items.push(['cb','foe','','бій'],['hp','','',`здоров’я <b>${Math.max(0,Math.ceil(s.h.hp))}/${maxHP()}</b>`],['ap','','',`очки дії <b>${s.cb.ap}</b>`])}
  else{const r=rates();
    for(const k of RES)if(s.seen[k]){const rt=r[k]||0;items.push(['r:'+k,`rs rs-${k}`,`<b>${RN[k].charAt(0).toUpperCase()+RN[k].slice(1)}</b><br>${RD[k]||''}`,`${pimg(icoURL(k),16,16,'ri')}<span class="rn">${RN[k]} </span><b>${fmt(s.r[k])}</b>${(k==='fish'||k==='prov')&&typeof capOf==='function'?`<small>/${capOf(k)}</small>`:''}${Math.abs(rt)>=0.005?` <small>${rt>0?'+':''}${fr(rt)}/с</small>`:''}`])}
    if(s.tabs.hero){
      const hurt=s.h.hp<maxHP(),meal=mealLabel();
      items.push(['hp',hurt?'hpl hurt':'hpl','<b>Здоров’я</b><br>Їжа й ліки відновлюють сили. Юшка діє поступово поза боєм.',`здоров’я <b>${Math.ceil(s.h.hp)}/${maxHP()}</b>${meal?` <button type="button" class="eatb" data-a="eatfull" data-i="">Поїсти · ${meal}</button>`:''}`]);
    }
    if(thrOn()){const v=Math.floor(s.threat||0);items.push(['thr',`thr${v>=75?' hi':''}`,`<b>Загроза Мли</b><br>Коли шкала дійде до 100, почнеться набіг. Мла збирається на метушню: збирання, будівництво, ремесло. Поки ти відпочиваєш, вона дрімає, а набіги чекають на тебе. Виграні бої її знижують, жаровні приглушують.`,`Мла <b>${v}%</b><span class="tb"><i style="width:${v}%"></i></span>`])}}
  const status=healingStatus();
  if(status)items.push(['food-effect','food-effect','',status]);
  const keys=items.map(x=>x[0]).join(',');
  if(keys===topK&&el.children&&el.children.length===items.length){items.forEach((x,i)=>{const c=el.children[i];const nw=c.classList&&c.classList.contains('rnew');const cl=x[1]+(nw?' rnew':'');if(c.className!==cl)c.className=cl;if(c.dataset.h!==x[3]){c.dataset.h=x[3];c.innerHTML=x[3]}if(x[2]&&c.getAttribute('data-tip')!==x[2])c.setAttribute('data-tip',x[2])});return}
  const old=new Set((topK||'').split(','));const anim=topK!==null&&!RM();
  el.innerHTML=items.map(x=>`<span class="${x[1]}${anim&&!old.has(x[0])&&x[0]!=='hp'&&x[0]!=='ap'?' rnew':''}"${x[2]?' '+TA(x[2]):''} data-h="${x[3].replace(/&/g,'&amp;').replace(/"/g,'&quot;')}">${x[3]}</span>`).join('');
  topK=keys}
let topK=null,tabSeen=null,texInit=0,texInit2=0,hlT=null;
function towerArt(){const F=s.floors,lit=!!s.f.won,lk=!!s.f.looked;
  const sp=(t,on,cls)=>`<span class="${on?(cls||'lit'):''}">${t}</span>`;
  return [
    sp(lit?'       \\  |  /       ':'                     ',lit,'glow'),
    sp('        _/^\\_        ',F.lantern),
    sp('        |(',F.lantern)+sp('*',lit,'glow')+sp(')|        ',F.lantern),
    sp('      ==|===|==      ',F.gallery),
    sp('        |   |        ',F.study),
    sp('        |[ ]|        ',F.study),
    sp('        |   |        ',F.work),
    sp('        |[ ]|        ',F.work),
    sp('       /|   |\\       ',lk),
    sp('      / | ',lk)+sp('*',1,'glow')+sp(' | \\      ',lk),
    sp('~~~~~~~~~~~~~~~~~~~~~',lk,'sea'),
  ].join('\n')}

function homeText(){const F=s.f;
  if(s.f.won2)return'Мли більше немає. Над шхерами зорі, біля маяка — хати й люди, а в гавані щодня нові вітрила.';
  if(F.won)return'Великий вогонь горить над шхерами. Кораблі знову бачать дорогу додому, і капітани платять хранителю мито.';
  if(s.tabs.tower)return'Вогнище горить рівно. Над головою поверхи маяка, які чекають на тебе.';
  if(s.b.hearth)return'Вогнище потріскує. Світла більшає з кожною хвилиною, і з темряви проступають сходи.';
  if(F.looked)return'Нижня зала маяка: кам’яна підлога, вузькі сходи вгору, двері на берег. Жарина ледве жевріє, їй потрібне паливо.';
  return'Темрява. У долонях тліє остання жарина з великого вогню маяка. Поки ти дихаєш на неї, вона не згасне.'}

function yardSt2(){return{looked:s.f.looked,lk:s.f.lk,hearth:s.b.hearth,won:s.f.won,floors:s.floors,b:s.b,wood:s.r.wood,boat:s.f.boat,schooner:s.f.schooner,pop:s.pop||0}}
function yardBgImg(){const sig=[s.f.looked?1:0,s.f.lk?1:0,s.b.hearth?1:0,s.f.won?1:0,s.f.boat?1:0,s.f.schooner?1:0,Math.min(8,s.pop||0),Math.min(12,1+Math.floor(s.r.wood/20))].join('')+GR;
  return pimgA('y3:'+sig+(RM()?'r':''),()=>yardBg3(Object.assign(yardSt2(),{ph:GR,rm:RM()})),864,480,'yard','Маяк і двір',120,WATER3)}
function yardImg(){const F=s.floors,L=s.b;const sig=[s.f.looked?1:0,s.f.lk?1:0,L.hearth?1:0,F.work?1:0,F.gallery?1:0,F.study?1:0,F.lantern?1:0,s.f.won?1:0,s.f.boat?1:0,s.f.schooner?1:0,Math.min(8,s.pop||0),Math.min(12,1+Math.floor(s.r.wood/20)),Math.min(4,L.house||0),...Object.keys(BANC).map(k=>L[k]?stageOf(L[k]):0)].join('');
  return pimgA('f3:'+sig,()=>yardFull3(yardSt2()),864,480,'yard','Маяк і двір',120,WATER3)}
const SKU={melee:['влучність у ближньому бою','шанс контрудару, коли ворог промахнувся впритул'],mech:['замки й механізми в локаціях','сила твоїх капканів','ремонт укріплень під час набігу'],
  stealth:['обхідні шляхи в локаціях','дія «Сховатися» в бою: удар з тіні критичний','шанс підкрастися непомітно на початку бою'],speech:['розмови й переконання в локаціях','дія «Залякати»: поранений ворог-людина здається','кращі обміни з торговими кораблями','поселенці приходять швидше'],
  craft:['складні рецепти в майстерні','шанс зробити дві речі замість однієї','дешевший ремонт будівель']};
function rDefense(){let h=`<section><h2>Оборона маяка${ih(`Мла збирається на метушню біля маяка: кожне збирання, будова чи робота в майстерні трохи її кличе. Поки тебе немає, вона не росте й не нападає. Коли шкала дійде до 100, почнеться набіг. Перемоги в шхерах відганяють її: що сильніші вороги, то далі, а сюжетні бої — удвічі. Жаровні приглушують шум. Хочеш здобичі — поклич її сам.`)}</h2>`;
  h+=`<div class="thrbar">${W(()=>Math.floor(s.threat||0))}</div><p class="m">Загроза ${V(()=>Math.floor(s.threat||0))}%. Поки біля маяка тихо, Мла дрімає.</p>`;
  h+=`<div class="act">${btn(`Покликати Млу (${R('ember',fmt(150*s.h.lvl))})`,'lure','',{ok:()=>!s.raid&&s.r.ember>=150*s.h.lvl&&(s.threat||0)<100})}<span class="m">Набіг почнеться одразу: нападників більше, здобич подвійна.</span></div>`;
  for(const d of DEF){if(d.req&&!d.req())continue;const n=defL(d.id),mx=n>=d.max;
    h+=`<div class="row"><div><b>${d.n}</b>${n?`, рівень ${n}`:''}${d.tog&&n&&s.on[d.id]===false?' <span class="m">(погашено)</span>':''}<br><span class="m">${d.d(n)}</span></div><div class="act" style="flex:0 1 auto">${d.tog&&n?btn(s.on[d.id]===false?'Запалити':'Погасити','tog',d.id,{cls:'toggle'}):''}${mx?'<span class="done">найкраще</span>':btn(`${n?'Покращити':'Збудувати'} (${costTxt(defCost(d))})`,'def',d.id,{ok:()=>afford(defCost(d))})}</div></div>`}
  return h+`</section>`}
function rPeople(){const cap=2*(s.b.house||0),pop=s.pop||0,ms=Object.keys(MST).filter(m=>s.mst[m]);
  let h=`<section><h2>Люди маяка</h2><p>Поселенців <b>${pop}</b> з ${cap} місць у хатах; вільних рук ${V(()=>Math.max(0,freeW()))}. Майстрів: ${ms.length}. Усі разом їдять ${fr(0.02*people())} провізії/с.</p>`;
  h+=`<p class="m">${VH(()=>s.r.prov<1&&people()?'<b class="foe">Комора порожня: люди голодні й працюють гірше.</b> ':'')}${pop<cap?(s.r.prov>=5?`Наступний поселенець прийде за ${V(()=>s.popT?Math.max(0,Math.ceil((s.popT-Date.now())/1000)):60)} с.`:'Поселенці не прийдуть, поки в коморі немає 5 провізії.'):'Щоб прийшли нові поселенці, збудуй ще хату.'} Вільні поселенці збирають плавник.</p>`;
  if(ms.length)h+=`<div class="cards">${ms.map(m=>`<div class="card pcard">${pimg(faceURL(m),48,48,'',MST[m].n)}<div><b class="npc">${MST[m].n}</b><span class="role">${MST[m].role}</span><span class="m">${MST[m].d}</span></div></div>`).join('')}</div>`;
  return h+`</section>`}
const scnD=()=>`--d:-${((Date.now()/1000)%30).toFixed(2)}s;--d2:-${((Date.now()/1000)%180).toFixed(2)}s`;
function homeScene(){return`<div class="scn yd" data-scn="yd" style="${scnD()}"><span data-sk="bg" data-sig="bg" class="scbg">${VH(yardBgImg)}</span>${homeHS()}</div>`}
function shoreScene(){return`<div class="scn sh" data-scn="sh" data-tide="${tideStage()}" style="${scnD()}"><span data-sk="bg" data-sig="bg" class="scbg">${VH(shoreImg)}</span>${shoreHS()}</div>`}
function reserveButton(id){return reserveInputs(id).length?btn(reserveOn(id)?'Дозволити витрачати резерв':'Захищати резерв','reserve',id,{cls:'toggle'}):''}
function rHome(){let h=`<div>`;
  h+=`<section><div class="big">${V(()=>fmt(s.r.ember))}</div><p class="m">жару, ${V(()=>{const v=rates().ember;return(v>=0?'+':'')+fr(v)})} за секунду</p><p>${homeText()}</p>`;
  let al='';if(!s.b.hearth)al+=btn('Подмухати на жарину','blow','',{cd:'blow',cs:2});
  if(!s.f.looked&&s.f.lk)al+=btn('Роззирнутися','look','',{cls:'main'});
  if(s.f.looked&&s.seen.wood){const n=s.b.hearth||0;
    al+=`<div class="act">${btn(`${n?'Підкинути дров':'Скласти вогнище'} (${costTxt(bCost(HEARTH))})`,'bld','hearth',{ok:()=>afford(bCost(HEARTH)),cls:n?'':'main'})}${n?btn(s.on.hearth===false?'Розпалити':'Пригасити','tog','hearth',{cls:'toggle'}):''}</div>`;
    if(n)h+=`<p class="m">Вогнище, рівень ${n}: дає +${2*n} жару/с і спалює ${fr(0.12*n)} плавника/с. Без плавника ледь тліє.</p><p class="m">${V(()=>reserveText('hearth'))}</p>${reserveButton('hearth')}`}
  if(s.tabs.tower)al+=btn('Нагору, до поверхів','tab','tower',{cls:'toggle'});if(s.tabs.shore)al+=btn('До берега','tab','shore',{cls:'toggle'});
  h+=`<details class="alist"><summary>Усі дії списком</summary><div>${al}</div></details></section>`;
  if(thrOn())h+=rDefense();
  if(s.f.people)h+=rPeople();
  const vis=BD.filter(b=>b.show());
  if(vis.length){h+=`<section class="ledger"><details class="ledg"${s.ldOpen?' open':''}><summary><span class="lgt">Книга обліку</span><span class="m"> · усі будівлі одним списком</span></summary><h2 class="sr">Господарство${ih(`Цехи автоматично бережуть резерв сировини. Дозволь витрачати резерв для окремого цеху або вимкни цех зовсім.${s.f.people?' Робітник додає будівлі пів рівня, а майстер у своїй будівлі подвоює все.':''}`)}</h2>`;
    for(const b of vis){const n=s.b[b.id]||0,w=(s.wk||{})[b.id]||0,mx=b.max&&n>=b.max;
      const wk=s.f.people&&n&&WKB.includes(b.id)?`<br><span class="wk">${mstOf(b.id)?'<span class="chip">майстер ×2</span> ':''}робітники <b>${w}</b> з ${n} ${btn('−','wk-',b.id,{cls:'toggle',ok:w>0,lab:'Зняти робітника'})}${btn('+','wk+',b.id,{cls:'toggle',ok:()=>freeW()>0&&w<n,lab:'Додати робітника'})}</span>`:(n&&mstOf(b.id)&&!b.nw?'<br><span class="chip">майстер ×2</span>':'');
      const dm=(s.dmgB||{})[b.id],rc=dm?repCost(b):null;
      if(dm){h+=`<div class="row" id="bd-${b.id}"><div><b>${b.n}</b> <span class="foe">пошкоджено</span><br><span class="m">Мла зламала будівлю. Поки її не полагодиш, вона не працює.</span></div>${btn(`Полагодити (${costTxt(rc)})`,'repair',b.id,{ok:()=>afford(rc),cls:'main'})}</div>`;continue}
      h+=`<div class="row" id="bd-${b.id}"><div><b>${b.n}</b>${fresh9('b:'+b.id)}${n&&!b.max?`, рівень ${n}`:''}${b.conv&&n&&s.on[b.id]===false?' <span class="m">(зупинено)</span>':''}<br><span class="m">${b.d()}</span>${n&&b.conv&&reserveInputs(b.id).length?`<br><span class="m">${V(()=>reserveText(b.id))}</span>`:''}${wk}</div><div class="act" style="flex:0 1 auto">${b.conv&&n?btn(s.on[b.id]===false?'Увімкнути':'Вимкнути','tog',b.id,{cls:'toggle'})+reserveButton(b.id):''}${mx?'<span class="done">збудовано</span>':btn(`${n?'Покращити':'Збудувати'} (${costTxt(bCost(b))})`,'bld',b.id,{ok:()=>afford(bCost(b))})}</div></div>`}
    h+=`</details></section>`}
  if(s.b.shipyard){h+=`<section><h2>Верф Захара</h2>`;
    h+=s.f.schooner?`<p>Шхуна «Остап» стоїть біля причалу. На ній можна плисти до північних островів.</p>`:`<div class="row"><div><b>Шхуна</b><br><span class="m">Двощогловий корабель, що пройде крізь північні тумани. Сталь на обшивку, скло на ліхтарі.</span></div>${btn(`Збудувати (${costTxt(SCHOONER)})`,'schooner','',{ok:()=>afford(SCHOONER),cls:'main'})}</div>`;
    h+=`</section>`}
  return h+`</div>`}
function shoreImg(){
  const time=tidePhase(),phase=tideStage(time),level=tideLow(time)?1:Math.min(.75,Math.round(tideLv(time)*4)/4);
  const sig=[phase,level,s.f.fordSeen?1:0,FORD.map(p=>s.ford?.[p.id]?1:0).join(''),Math.min(12,Math.ceil(s.r.wood/12)),s.seen.scrap?Math.min(6,Math.ceil(s.r.scrap/10)):0,s.seen.fish&&s.r.fish>=1?Math.min(5,Math.ceil(s.r.fish/8)):0,Math.min(3,s.b.pot||0),GR].join(':');
  return pimgA('s3:'+sig,()=>shoreBg3({ph:GR,phase,tide:level,fordSeen:s.f.fordSeen,ford:s.ford,wood:s.r.wood,scrapSeen:s.seen.scrap,scrap:s.r.scrap,fishSeen:s.seen.fish,fish:s.r.fish,pot:s.b.pot}),864,360,'scene','Берег',21,WATER3);
}
function rShore(){let h=`<section><h2>Берег під маяком</h2><p>Мокрий пісок, водорості й плавник, викинутий прибоєм. Туман ховає обрій.</p>`;
  if(tideKnown()||s.tideEpoch!=null)h+=`<p class="tide-status"><strong aria-live="polite">${V(()=>tideStatus()[0])}</strong><span class="tide-clock">${V(()=>tideStatus()[1])}</span></p>`;
  if(firstCrabWaiting()||s.f.rod&&s.h.hp<maxHP())h+=`<div class="tdet shore-recovery"><p class="m">Здоров’я ${V(()=>Math.ceil(s.h.hp)+' / '+maxHP())}.${firstCrabWaiting()?' Краб чекає біля уламків.':''}</p><div class="act">${rawFoodButtons()}${firstCrabWaiting()?btn(tutKnown('combat')?'Повернутися до краба':'Вийти проти краба','crabRetry'):''}</div></div>`;
  let al=`<div class="act">${btn('Збирати плавник','gather','',{cd:'gather',cs:1})}</div>`;
  if(s.f.wreck)al+=`<div class="act">${btn('Розбирати уламки човна','scrapw','',{cd:'scrapw',cs:2})}</div>`;
  al+=localEntryButtons();
  if(shoreHookReady())al+=`<div class="act">${btn('Змайструвати багор','hook','',{ok:()=>afford(HOOKC)})}<span class="ccs">${costTxt(HOOKC)}</span></div>`;
  if(shoreRodReady()){const c=RC.find(r=>r.id==='rod').c;al+=`<div class="act">${btn('Змайструвати просту вудку','craft','rod',{ok:()=>afford(c)})}<span class="ccs">${costTxt(c)}</span></div>`}
  if(s.f.rod)al+=`<div class="act">${btn(s.f.rodUp?'Прибережна вода':'Рибалити','fishing','',{cd:'fishing',cs:3})}</div>`;
  if(s.f.rodUp)al+=`<div class="act">${btn('Глибша вода','fishing','deep',{cd:'fishing',cs:3})}</div>`;
  else if(s.f.rodRipple&&!s.f.rodLimitSeen)al+=`<div class="act">${btn('Оглянути кола на воді','rodReach')}</div>`;
  if(tideLow())al+=`<div class="act">${btn('Оглянути калюжі','pool','',{cd:'pool',cs:4})}</div>`;
  const mussels=musselCycle();
  if(mussels!=null)al+=`<div class="act">${btn('Зібрати мідії','mussels',String(mussels))}</div>`;
  if(has('mussel'))al+=`<div class="act">${btn('З’їсти мідії','use','mussel',{ok:()=>has('mussel')&&s.h.hp<maxHP()})} <span class="m">+6 здоров’я</span></div>`;
  if(s.f.fordSeen&&!s.f.fordDone)al+=`<div class="act">${btn('Оглянути брід','bpop','sh:ford')}</div>`;
  if(!s.runes?.b&&RUNE.b.ok())al+=`<div class="act">${btn('Оглянути камінь на відпливі','rune','b')}</div>`;
  const event=shfVisible();
  if(event)al+=`<div class="act">${btn(SHF[event].n,'shfgo',shfActionId(event))}</div>`;
  al+=`<div class="act">${btn('До маяка','tab','home',{cls:'toggle'})}</div>`;
  const floating=hookWaterVisible();
  const hookCard=floating?`<div class="act">${btn(hookWaterLabel(floating),'hookWater',String(floating.id))}</div>`:'';
  const sand=rakeSandVisible();
  const sandCard=sand?`<div class="act">${btn(RAKE_SPOTS[sand.kind].name,'rakeSand',String(sand.id))}</div>`:'';
  const catchCard=s.f.rod&&s.bite?`<div class="tdet"><b>${fishBiteLabel()}</b>${s.f.rodUp?`<p class="m">${FISH_SPOTS[bitePlace()].name}</p>`:''}${fishBiteControls()}</div>`:'';
  h+=`<details class="alist shore-alist"${shoreListOpen?' open':''}><summary>Усі дії списком</summary><div>${catchCard}${hookCard}${sandCard}${al}</div></details>`;
  if(s.flot){const FN={crate:'Ящик',barrel:'Бочка',cargo:'Розкиданий вантаж',bottle:'Пляшка з запискою',survivor:'Людина на уламку щогли'};h+=`<div class="tdet" id="sec-flot"><b>На березі: ${FN[s.flot.k]}</b>${fresh9('fl:'+s.flot.until)}<p class="m">Прибій щось викинув. Хвилі заберуть його за ${V(()=>s.flot?Math.max(0,Math.ceil((s.flot.until-Date.now())/1000)):0)} с.</p>${btn('Оглянути','flot','',{cls:'main'})}</div>`}
  h+=`<p class="m" style="margin-top:8px">Зібрано за весь час: ${V(()=>fmt(s.tot.wood))} плавника${s.f.wreck?`, ${V(()=>fmt(s.tot.scrap))} брухту`:''}${s.f.rod?`, ${V(()=>fmt(s.tot.fish))} риби`:''}.</p></section>`;
  h+=rDryRack();
  if(s.f.boat){h+=`<section id="sec-pier"><h2>Пристань</h2><p class="m">Звідси поселенці виходять у море, а сюди заходять кораблі. Вільних рук: ${V(()=>Math.max(0,freeW()))}.</p>`;
    for(const id in EXP){const X=EXP[id],on=(s.exp||[]).find(e=>e.id===id);
      h+=`<div class="row"><div><b>${X.n}</b><br><span class="m">${X.d} Команда: ${X.crew}, ${Math.round(X.t/60*10)/10} хв.</span>${on?`<div class="bar xp">${W(()=>{const e=(s.exp||[]).find(e=>e.id===id);return e?Math.min(100,100-(e.until-Date.now())/(X.t*10)):100})}</div>`:''}</div>${on?'<span class="m">у морі</span>':btn(`Вирушити (${costTxt(X.c)})`,'exp',id,{ok:()=>freeW()>=X.crew&&afford(X.c)})}</div>`}
    if(!s.f.people)h+=`<p class="m">Для виходів у море потрібні люди. Коли біля маяка з’являться поселенці, їх можна буде відправити.</p>`;
    if(s.ship){h+=`<div class="tdet" id="sec-ship"><b>Торговий когг біля пристані</b>${fresh9('sh:'+s.ship.until)}<p class="m">Відпливе за ${V(()=>s.ship?Math.max(0,Math.ceil((s.ship.until-Date.now())/1000)):0)} с. Кожен обмін — один раз.</p><div class="act">${s.ship.offers.map((o,ix)=>s.ship.done.includes(ix)?`<span class="done">обміняно</span>`:btn(`${costTxt(o.give)} → ${costTxt(o.get)}`,'trade',ix,{ok:()=>afford(o.give)})).join('')}</div></div>`}
    h+=`</section>`}
  return h}

function towerImg(){const F=s.floors,st={floors:F,hearth:s.b.hearth,forge:s.b.forge,ostap:s.f.ostap,won:s.f.won,wood:s.r.wood};const key='tc:'+[F.work,F.study,F.gallery,F.lantern,s.b.hearth?1:0,s.b.forge?1:0,s.f.ostap?1:0,s.f.won?1:0,Math.min(4,1+Math.floor(s.r.wood/40))].map(x=>x?1:0).join('')+Math.min(4,1+Math.floor(s.r.wood/40));
  if(!AF[key]){const u=[];for(let k=0;k<4;k++)u.push(pxURL(key+'~'+k,()=>waveFrame(towerCut(st,k),k,104)));AF[key]=u}
  const u=AF[key];return u[0]?`<img class="px" src="${u[0]}" data-fr="${key}" data-xk="${key}" width="300" height="400" alt="Маяк у розрізі">`:''}
function floorBuilt(id){return id==='hall'?!!s.b.hearth:!!s.floors[id]}
function rTower(){let h=`<section><h2>Маяк</h2><p class="m">Натискай на поверхи, щоб зазирнути всередину.</p>`;
  const nx=FL.find((f,ix)=>!s.floors[f.id]&&(ix===0||s.floors[FL[ix-1].id]));if(nx&&s.b.hearth&&(!nx.req||nx.req()))h+=`<p class="m">Далі можна відбудувати: <b>${nx.n}</b>.</p>`;
  if(s.floors.lantern&&!s.f.won)h+=`<p class="m">Світло в ліхтарні ще б’ється об стіни. Зазирни нагору.</p>`;if(s.lost)h+=`<p class="foe">Ріжок у тумані! Поверни промінь у ліхтарні.</p>`;
  if(s.floors.lantern)h+=`<details class="ledg"${s.ldOpen?' open':''}><summary>Усе списком</summary>${s.f.won?rBeam():rLens()}</details>`;return h+`</section>`}
function rBeam(){const L=s.lost,tele=fuL('gallery')>=1,cur=s.beam||0;
  let w=`<div class="wedge" style="background:conic-gradient(from ${cur*60-30}deg,rgba(240,184,74,.55) 0 60deg,transparent 60deg 360deg)"></div><div class="core"></div>`;
  SECT.forEach((n,i)=>{const a=(i*60-90)*Math.PI/180,x=50+Math.cos(a)*40,y=50+Math.sin(a)*40;w+=`<button type="button" class="${cur===i?'on':''}${L&&tele&&L.sec===i?' lost':''}" style="left:${x}%;top:${y}%" data-a="beam" data-i="${i}">${n}</button>`});
  let h=`<section><h2>Промінь над морем</h2><p class="m">Кораблі губляться в тумані. Коли почуєш ріжок, поверни промінь туди, звідки він лунає. Поворот коштує ${R('oil',3)}.</p><div class="dial">${w}</div>`;
  h+=`<p style="text-align:center">${L?`<b class="foe">${VH(()=>s.lost?`Ріжок лунає ${s.lost.hint}! Лишилося ${Math.max(0,Math.ceil((s.lost.until-Date.now())/1000))} с.`:'')}</b>`:'<span class="m">Море тихе. Промінь світить на '+SECT[cur]+'.</span>'}</p>`;
  h+=`<p class="m" style="text-align:center">Кораблів урятовано: ${s.saved||0}.</p></section>`;return h}

function rLens(){const{path,out,pos}=beam();let g='';
  for(let y=0;y<LENSMAP.length;y++)for(let x=0;x<LENSMAP[0].length;x++){const t=LENSMAP[y][x],k=x+','+y;
    if(pos[k]){g+=`<button type="button" class="mir" data-a="mirror" data-i="${pos[k]}" aria-label="Дзеркало ${pos[k]}"${s.f.won?' disabled':''}>${esc(s.mirrors[pos[k]])}</button>`;continue}
    let ch='·',cls='';const win=y===0&&x===7;
    if(t==='#'){ch=win?'O':'#';cls=win?'ex':'w'}else if(t==='*'){ch='*';cls='src glow'}
    if(path[k]&&path[k]!=='m'){ch=path[k];cls='beam'}
    if(win&&out){ch='*';cls='beam glow'}
    g+=`<button type="button" class="${cls}" disabled tabindex="-1">${ch}</button>`}
  return `<section><h2>Ліхтарня</h2>${s.f.won?'<p>Промінь іде крізь вікно в море. Маяк горить.</p>':`<p>Вогонь горить, але світло б’ється об стіни. Натискай на дзеркала, щоб повернути їх. Вікно на море позначене <b>O</b>.</p>${s.f.ostap?`<p class="hint">${P('Остап')}: ${Q('Світло біжить прямо, доки дзеркало не поверне його. Не всі дзеркала стоять на його шляху')}.</p>`:''}`}<div class="grid g9" style="margin-top:8px">${g}</div></section>`}

function rWork(){const L=rWorkList(),i=L.indexOf('</section>')+10;return`<div class="wkmain">${L.slice(0,i)}</div>${L.length>i?`<section><details class="ledg"${s.ldOpen?' open':''}><summary>Кузня й розбір</summary>${L.slice(i)}</details></section>`:''}`}
function rWorkList(){let h=`<section class="wkb"><h2>Креслення на верстаку</h2><p class="m">Що можна змайструвати з того, що є. Нові креслення приходять від людей, із записів і знахідок.</p>`;const vis=RC.filter(rcVisible);
  if(rodHookReady())h+=`<div class="act">${btn('Оглянути старий гачок','rodReach','hook')}</div>`;
  if(!vis.length)h+=`<p class="m">Поки що нічого нового. Шукай креслення й вивчай записи.</p>`;
  h+=`<div class="bag">`;
  for(const rc of vis){const c=rcCost(rc),nm=rc.tool?rc.n:IT[rc.out].n,d=rc.tool?rc.d:itemShort(rc.out),cr=rc.craft||0,ik=rcImg(rc).id;
    h+=`<div class="cell" ${rc.out?itemTip(rc.out):TA(`<b>${nm}</b><br>${d}`)}><div class="ic" aria-hidden="true">${pimg(icoURL(ik),36,36)}</div><b>${nm}</b>${fresh9('r:'+rc.id)}${rc.multi&&has(rc.out)?`<span class="m">є ${s.inv[rc.out]}</span>`:''}<span class="m">${d}</span>${rc.src?`<span class="m src">${rc.src}</span>`:''}<span class="ccs">${costChips(c,rc.it)}</span>${cr?`<span>${chk('craft',cr)}</span>`:''}${btn('Зробити','craft',rc.id,{ok:()=>st('craft')>=cr&&afford(rcCost(rc),rc.it)})}</div>`}
  h+=`</div></section>`;
  if(s.b.forge){const own=WEAP.filter(has);if(own.length){h+=`<section><h2>Кузня: удосконалення зброї${ih('Зброю можна зробити кращою: вона битиме сильніше й отримає нову особливість, а старі особливості й прийоми лишаться. Для цього потрібні майстерність, трохи металу й особлива знахідка, яка пасує саме до цієї зброї. Такі речі трапляються в шхерах: у сутичках, на уламках, у чужих сховках.')}</h2><p class="hand">Горн теплий. Була б тільки добра річ, щоб прикласти її до клинка.</p><div class="bag">`;
    for(const id of own){const tier=wF(id),nx=WF[id][tier],rel=nx?REL[id][tier]:'',cst=nx?wfCost(tier):null,hr=rel&&has(rel),ml=nx&&wmLv(id)<WFM[tier];
      const why=!nx?'':!hr?'Бракує особливої знахідки.':ml?`Спершу краще опануй цю зброю (майстерність ${WFM[tier]}).`:'';
      h+=`<div class="cell" ${itemTip(id)}><div class="ic" aria-hidden="true">${pimg(wIco(id),36,36)}</div><b>${wN(id)}</b>${fresh9('w:'+id+tier+(hr?'r':''))}${tier?`<span class="m">${tier>1?'удосконалена двічі':'удосконалена'}</span>`:''}${nx?`${hr?`<span class="m">Є: ${I(IT[rel].n)}</span>`:''}<span class="ccs">${costChips(cst)}</span>${why?`<span class="m">${why}</span>`:''}${btn('Удосконалити','wup',id,{ok:()=>!why&&afford(cst)})}`:'<span class="done">краще вже не зробиш</span>'}</div>`}
    h+=`</div></section>`}}
  const dl=Object.keys(s.inv).filter(canDism);
  if(dl.length){h+=`<section><h2>Розібрати${ih(`Непотрібне спорядження можна розібрати на матеріали. Те, що в руках, не чіпаємо.`)}</h2><div class="bag">`;
    for(const id of dl){const v=dismVal(id);if(!v)continue;h+=`<div class="cell"><div class="ic" aria-hidden="true">${pimg(icoURL(id),36,36)}</div><b>${IT[id].n}${s.inv[id]>1?` × ${s.inv[id]}`:''}</b><span class="m">Дасть: ${costTxt(v)}</span>${btn('Розібрати','dism',id)}</div>`}
    h+=`</div></section>`}
  return h}
function rStudy(){return`<section><h2>Кабінет Остапа</h2><p class="m">Стіл із рукописом, полиці й скриня — натискай на них у кімнаті.</p><details class="ledg"${s.ldOpen?' open':''}><summary>Усе списком і дерево досліджень</summary>${rStudyList()}</details></section>`}
function rStudyList(){let h=`<section><p>Знання: ${V(()=>fmt(s.r.lore))}, ${V(()=>'+'+fr(rates().lore))} за секунду. Книг на полицях: ${s.books.length}.${s.f.ostap?` ${P('Остап')} допомагає розбирати записи.`:''}</p><p class="m">Кожна знайдена книга пришвидшує дослідження. Розум теж допомагає.</p>`;
  if(s.books.length)h+=`<p class="m">${s.books.map(b=>I('«'+BK[b]+'»')).join(', ')}.</p>`;
  h+=`</section>`;
  h+=`<section><h2>Дослідження${ih(`Знання витрачаються одразу. Нові теми з’являються, коли вивчиш попередні або зустрінеш нову істоту.`)}</h2><div class="rtree">`;
  for(const tier of[1,2,3,4]){const vis=RS.filter(x=>x.t===tier&&(s.rs[x.id]||rsReady(x)||(!(x.r||[]).some(q=>!s.rs[q])&&(!x.kill||s.seenE[x.kill]))));if(!vis.length)continue;h+=`<div class="rcol"><span class="tl2">${['','I','II','III','IV'][tier]}</span>`;
    for(const r of vis){const dn=!!s.rs[r.id],rd=rsReady(r),cost=rsCost(r);
      const why=[...(r.r||[]).filter(q=>!s.rs[q]).map(q=>'спершу «'+RS.find(x=>x.id===q).n+'»'),...(r.kill&&!s.kills[r.kill]?[s.seenE[r.kill]?'перемогти: '+EN[r.kill].n.toLowerCase():'трофей невідомої істоти']:[])];
      const hide=!dn&&!rd&&r.kill&&!s.seenE[r.kill];
      h+=`<div class="node ${dn?'taken':rd?'avail':'lock'}"><b>${hide?'???':U(r.n)}</b>${!dn&&rd?fresh9('s:'+r.id):''}${r.kill?' <span class="abtag">вивчення</span>':''}<p class="m">${hide?'Щось чекає на твою першу зустріч.':U(r.d)}</p>${dn?'<span class="done">досліджено</span>':rd?rdHTML(r):`<p class="m">Потрібно: ${why.join('; ')}.</p>`}</div>`}
    h+=`</div>`}
  h+=`</div>`;
  h+=`</section><section><h2>Скриня Остапа</h2>${pimg(pxURL('ch:'+(s.f.chest?1:0),()=>chestBuf(s.f.chest)),576,240,'scene','Скриня')}`;
  if(s.f.chest)h+=`<p>Скриня відчинена й порожня.</p>`;
  else{h+=`<p>Кодовий замок із трьома коліщатами. На кришці вирізано:</p><p class="quote">Хто вертається з моря, спершу бачить камінь, тоді небо, а засинає в гавані.</p>
    <div class="dials">${s.chest.map((v,k)=>`<div class="dial"><b>${CHEST[v]}</b>${btn('Крутити','dial',k)}</div>`).join('')}</div>${btn('Відкрити скриню','chestTry','',{cls:'main'})}`;
    if(s.chestFail>=3)h+=`<p class="hint" style="margin-top:8px">Ти згадуєш, як Остап казав: «Уночі першим із туману виринає не вогонь, а чорна тінь берега».</p>`}
  return h+`</section>`}

function rDoll(){return pimg(heroURL(s.eq),96,96,'herofig','Хранитель')}
function rHero(){const H=s.h;
  const sub=[['gear','Спорядження','pack',0],['arms','Зброя','cleaver',0],['bag','Торба','crate',0],['grow','Розвиток','lore',H.pts+H.sp>0],['talents','Таланти','shard',H.fp>0&&FT.some(f=>tVis(f)&&featOk(f))]];
  const NVK={arms:'arms',bag:'bag',grow:'grow',talents:'tal'};const subv=sub.filter(x=>x[0]==='gear'||s.nv[NVK[x[0]]]).map(x=>[x[0],x[1],x[2],x[3]||(x[0]!=='gear'&&!s.nvU[x[0]])]);if(!subv.some(x=>x[0]===s.ht))s.ht='gear';s.nvU[s.ht]=1;
  let h=`<div class="sub2" role="tablist">${subv.map(x=>btn(`${pimg(icoURL(x[2]),18,18)}${x[1]}${x[3]?'<span class="dot"></span>':''}`,'ht',x[0],{cls:s.ht===x[0]?'on':''})).join('')}</div>`;
  if(s.ht==='gear'){const ld=carried(),cap=loadCap(),pen=overPen();
    const ds=sl=>{const id=s.eq[sl];return`<div class="dslot${id?'':' e'}" ${id?itemTip(id):''}><div class="ib">${id?pimg(WT[id]?wIco(id):icoURL(id),30,30):''}</div><div style="min-width:0"><small>${SLOT[sl]}</small>${id?`<b>${WT[id]?wN(id):IT[id].n}</b>`:'<span class="m">порожньо</span>'}</div></div>`};
    if(s.nv.bag){if(pen||ld/cap>0.6)h+=`<section><h2>Вантаж</h2><p class="m">Несеш ${ld} з ${cap}. Вантажопідйомність росте із Силою та кращим ранцем.${pen?` <b class="foe">Перевантаження: −${pen} ОД у бою.</b>`:''}</p><div class="bar xp"><i style="width:${Math.min(100,ld/cap*100)}%;${pen?'background:var(--bad)':''}"></i></div></section>`;
    h+=`<section><h2>Рюкзак: ${s.pack.length} з ${packSlots()}${ih(`У бій береш лише зброю з рюкзака. Перемкнути зброю в бою коштує 1 ОД.`)}</h2><div class="bag">`;
    for(const id of s.pack){const it=IT[id],on=s.eq[it.slot]===id;h+=`<div class="cell${on?' oncell':''}" ${itemTip(id)}><div class="ic" aria-hidden="true">${pimg(wIco(id),36,36)}</div><b>${wN(id)}</b><span class="m">${itemShort(id)}</span><div class="act">${on?'<span class="done">у руках</span>':btn('Взяти в руки','equip',id)}${btn('Викласти','packRem',id,{cls:'toggle'})}</div></div>`}
    for(let k=s.pack.length;k<packSlots();k++)h+=`<div class="cell empty"><div class="ic"></div><span class="m">Вільна комірка</span></div>`;
    h+=`</div>`;const out=WEAP.filter(k=>has(k)&&!packHas(k));
    if(out.length)h+=`<p class="jh">Лежить у маяку</p><div class="act">${out.map(k=>btn(`Покласти: ${wN(k)} (вага ${IT[k].wt||0})`,'packAdd',k,{ok:s.pack.length<packSlots()})).join('')}</div>`;
    h+=`</section><section><h2>Пояс: ${s.belt.length} з ${beltSlots()}${ih(`У бою можна використати лише те, що на поясі. Бинт, зілля, сітка й дим коштують 1 ОД, бомба — 2.`)}</h2><div class="bag">`;
    for(const id of s.belt){const it=IT[id];h+=`<div class="cell" ${itemTip(id)}><div class="ic" aria-hidden="true">${pimg(icoURL(id),36,36)}</div><b>${it.n} × ${s.inv[id]||0}</b><span class="m">${itemShort(id)}</span>${btn('Зняти з поясу','beltRem',id,{cls:'toggle'})}</div>`}
    for(let k=s.belt.length;k<beltSlots();k++)h+=`<div class="cell empty"><div class="ic"></div><span class="m">Вільна кишеня</span></div>`;
    h+=`</div>`;const cons=Object.keys(s.inv).filter(k=>IT[k]&&IT[k].use&&has(k)&&!s.belt.includes(k));
    if(cons.length)h+=`<p class="jh">Можна почепити</p><div class="act">${cons.map(k=>btn(`${IT[k].n} × ${s.inv[k]}`,'beltAdd',k,{ok:s.belt.length<beltSlots()})).join('')}</div>`;
    h+=`</section>`}
    if(['armor','light','charm'].some(sl=>s.eq[sl]||Object.keys(s.inv).some(k=>s.inv[k]>0&&IT[k]&&IT[k].slot===sl))){h+=`<section><h2>Одяг і світло</h2><div class="slots">`;
    for(const sl of['armor','light','charm']){const id=s.eq[sl];h+=`<div class="slot" ${id?itemTip(id):''}><span class="ic" aria-hidden="true">${id?pimg(icoURL(id),30,30):''}</span><div><b>${SLOT[sl]}:</b> ${id?I(IT[id].n):'<span class="m">порожньо</span>'}${id?`<br><span class="m">${itemShort(id)}</span>`:''}</div>${id?btn('Зняти','unequip',sl):''}</div>`;
      const alt=Object.keys(s.inv).filter(k=>s.inv[k]>0&&IT[k]&&IT[k].slot===sl&&k!==id);
      if(alt.length)h+=`<div class="act" style="margin:-2px 0 6px 8px"><span class="m">Замінити на:</span>${alt.map(k=>btn(IT[k].n,'equip',k,{cls:'toggle'})).join('')}</div>`}
    h+=`</div></section>`}}
  if(s.ht==='arms'){const own=WEAP.filter(has);
    h+=`<section><h2>Майстерність зброї${ih(`Кожна зброя потрібна проти свого ворога. Майстерність росте, коли б’єш цією зброєю, і з нею відкриваються нові прийоми.${s.b.forge?' У кузні зброю можна удосконалити, якщо знайдеш до неї особливу річ.':''}`)}</h2>`;
    if(!own.length)h+=`<p class="m">Зброї поки немає. Зроби весло в майстерні.</p>`;
    h+=`<div class="cards">`;
    for(const id of own){const lv=wmLv(id),x=s.wm[id]||0,nx=MXP[Math.min(5,lv+1)],it=IT[id];
      h+=`<div class="card"><div class="pcard">${pimg(wIco(id),48,48,'')}<div><b>${wN(id)}</b><span class="role">майстерність ${lv}${wF(id)?' · удосконалена':''}</span></div></div>
      <div class="bar xp"><i style="width:${lv>=5?100:Math.min(100,(x-MXP[lv])/(nx-MXP[lv])*100)}%"></i></div><p class="m">${lv>=5?'Повна майстерність.':`${x} з ${nx} до наступного рівня`}</p>
      <p><b>Особливість.</b> ${U(WT[id].tr)}</p><ul class="plain">${WT[id].t.filter((q,ix)=>lv>=q[0]||ix===WT[id].t.findIndex(z=>lv<z[0])).map(q=>lv>=q[0]?`<li><span class="stt dn">рівень ${q[0]}</span> <b>${q[1]}.</b> <span class="m">${U(q[2])}</span></li>`:`<li class="off"><span class="stt on">рівень ${q[0]}</span> <span class="m">Новий прийом відкриється з майстерністю.</span></li>`).join('')}</ul>
      ${wF(id)?`<p class="jh">Удосконалення</p><ul class="plain">${WF[id].slice(0,wF(id)).map((f,k)=>`<li><span class="stt dn">${k?'друге':'перше'}</span> <b>${f.n}.</b> <span class="m">${U(f.tr)}</span></li>`).join('')}</ul>`:''}</div>`}
    h+=`</div></section>`}
  if(s.ht==='bag'){const inv=Object.keys(s.inv).filter(k=>s.inv[k]>0&&IT[k]);
    h+=`<section><h2>Торба</h2>${inv.length?'':'<p class="m">Поки порожньо.</p>'}<div class="bag">`;
    for(const id of inv){const it=IT[id];let b='';
      if(it.slot)b=s.eq[it.slot]===id?'<span class="done">у руках</span>':btn('Вдягти','equip',id);
      else if(healingItem(id))b=btn('Використати','use',id,{ok:()=>!!healingUse(id)});
      h+=`<div class="cell" ${itemTip(id)}><div class="ic" aria-hidden="true">${pimg(WT[id]?wIco(id):icoURL(id),36,36)}</div><b>${WT[id]?wN(id):it.n}${s.inv[id]>1?` × ${s.inv[id]}`:''}</b><span class="m">${itemShort(id)}</span>${b}</div>`}
    h+=`</div></section>`}
  if(s.ht==='talents')h+=rTalents();
  if(s.ht==='grow'){
    h+=`<section><h2>Характеристики</h2>${H.pts?`<p>Вільних очок: <b>${H.pts}</b></p>`:'<p class="m">Нове очко характеристик дається з кожним рівнем.</p>'}<div class="agrid">`;
    for(const k of['str','dex','con','per','int'])h+=`<div class="acard"><div class="top"><b>${SN[k]}</b><span class="big">${st(k)}</span></div><div class="pipbar" aria-hidden="true">${Array.from({length:ACAP},(_,i)=>`<i class="${i<H.a[k]?'on':''}"></i>`).join('')}</div><span class="m">${SD[k]}</span>${H.pts&&H.a[k]<ACAP?btn('+1','attr',k):''}</div>`;
    h+=`</div></section><section><h2>Уміння</h2><p class="m">Стеля вмінь зараз ${skillCap()}: вона зростає з кожним рівнем.${H.sp?` Вільних очок умінь: <b>${H.sp}</b>.`:''}</p><div class="agrid">`;
    for(const k of['melee','mech','stealth','speech','craft']){const v=H.k[k];h+=`<div class="acard"><div class="top"><b>${SN[k]}</b><span class="big">${st(k)}</span></div><div class="pipbar" aria-hidden="true">${Array.from({length:10},(_,i)=>`<i class="${i<v?'on':i>=skillCap()?'cap':''}"></i>`).join('')}</div><span class="m">${SD[k]}</span><ul class="skuse">${(SKU[k]||[]).map(x=>`<li>${x}</li>`).join('')}</ul>${H.sp?btn('+1','skill',k,{ok:v<skillCap()}):''}</div>`}
    h+=`</div>`;
    h+=`</section><section><p class="m">Таланти — у сусідній підвкладці.${H.fp?` Вільних талантів: <b>${H.fp}</b>.`:''}</p>${btn('До дерева талантів','ht','talents')}</section>`}
  return h}
const BRI={melee:'cleaver',ranged:'crossbow',agile:'cloak',tinker:'key',endure:'amulet',talk:'lore'};
const tVis=f=>f.tier<=1||!!s.h.ft[f.id]||FT.some(g=>g.br===f.br&&g.tier===f.tier-1&&s.h.ft[g.id]);
function rTalents(){const H=s.h;
  let h=`<section class="thead"><div><h2>Дерево талантів${ih(`Кожен рівень дає один талант. Гілки ростуть зліва направо: від простих основ до майстерності. Сильніші таланти проступають, коли береш нижчі.`)}</h2>${H.pts+H.sp?btn(`Розподілити очки (${H.pts+H.sp})`,'gogrow'):''}</div><div class="tfp"><b>${H.fp}</b><span>${H.fp===1?'талант':'талантів'} до вибору</span></div></section>`;
  const VW=1000,HB=118,H0=34,VH=H0+BR.length*HB,pos={};
  BR.forEach(([bid],bi)=>{for(let tr=0;tr<=3;tr++){const fs=FT.filter(f=>f.br===bid&&f.tier===tr);fs.forEach((f,j)=>{const x=170+tr*205+24,y=H0+bi*HB+(fs.length===1?HB/2:(j===0?HB*0.28:HB*0.72));pos[f.id]=[x/VW*100,y/VH*100]})}});
  let ln='';for(const f of FT){const[x1,y1]=pos[f.id];const real=f.pre&&f.pre.length;const pre=real?f.pre:(f.tier===1?FT.filter(g=>g.br===f.br&&g.tier===0).map(g=>g.id):[]);
    for(const q of pre){if(!pos[q])continue;const[x0,y0]=pos[q];ln+=`<line x1="${x0*VW/100}" y1="${y0*VH/100}" x2="${x1*VW/100}" y2="${y1*VH/100}" class="${real?'':'soft'}${!tVis(f)?' hid':''}${H.ft[q]&&H.ft[f.id]?' on':''}"/>`}}
  let g=`<svg viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="none" aria-hidden="true">${BR.map((b,bi)=>bi%2?'':`<rect x="0" y="${H0+bi*HB}" width="${VW}" height="${HB}" class="band"/>`).join('')}${ln}</svg>`;
  for(let tr=0;tr<=3;tr++)g+=`<span class="tlv2" style="left:${(170+tr*205+60)/VW*100}%">${['основи','рівень I','рівень II','рівень III'][tr]}</span>`;
  BR.forEach(([bid,bn],bi)=>{g+=`<span class="bl2" style="top:${(H0+bi*HB+HB/2)/VH*100}%">${pimg(icoURL(BRI[bid]),30,30)}<span>${bn}</span></span>`});
  for(const f of FT){const vis=tVis(f),tk=!!H.ft[f.id],ok=vis&&featOk(f),[x,y]=pos[f.id];
    g+=`<button type="button" class="tn2 ${tk?'taken':ok?'avail':'lock'}${vis?'':' hid'}${f.tier===3?' t3':''}${s.tsel===f.id?' sel':''}" style="left:${x}%;top:${y}%" data-a="tsel" data-i="${f.id}" ${TA(vis?`<b>${U(f.n)}</b><br>${U(f.d)}`:'<b>???</b><br>Цей талант проступить, коли візьмеш нижчий у цій гілці.')}><span class="md">${vis?pimg(icoURL(BRI[f.br]),26,26):'?'}</span><span class="nm">${vis?U(f.n):'???'}${vis&&f.ab?'<i>вміння в бою</i>':''}</span></button>`}
  h+=`<section><div class="tscroll"><div class="ttree tt2" style="height:${Math.round(VH*0.92)}px">${g}</div></div>`;
  const f=FT.find(x=>x.id===s.tsel)||FT.find(x=>tVis(x)&&featOk(x))||FT[0];
  if(f){const tk=!!H.ft[f.id],ok=featOk(f),vis=tVis(f);
    if(!vis)h+=`<div class="tdet"><b>???</b><p class="m">Цей талант ще прихований. Візьми талант нижчого рівня в цій гілці, і він проступить.</p></div>`;
    else{const miss=[...Object.keys(f.req).filter(k=>st(k)<f.req[k]).map(k=>{const isA=H.a[k]!==undefined,d=f.req[k]-st(k);return `${SN[k]}: треба ${f.req[k]}, зараз ${st(k)}. ${isA?`Вклади ${d} ${d===1?'очко':'очки'} характеристик.`:`Вклади ${d} ${d===1?'очко':d<5?'очки':'очок'} умінь${f.req[k]>skillCap()?` (стеля вмінь зараз ${skillCap()}, вона росте з рівнем)`:''}.`}`}),...(f.pre||[]).filter(q=>!H.ft[q]).map(q=>`Спершу візьми талант «${U(FT.find(x=>x.id===q).n)}».`)];
      h+=`<div class="tdet"><b>${U(f.n)}</b> <span class="m">${BR.find(b=>b[0]===f.br)[1]}, ${['основи','рівень I','рівень II','рівень III'][f.tier]}</span>${f.ab?' <span class="abtag">вміння в бою</span>':''}<p>${U(f.d)}</p>${tk?'<span class="done">взято</span>':miss.length?`<p class="m">Чого бракує:</p><ul class="need">${miss.map(x=>`<li>${x}</li>`).join('')}</ul>`:H.fp?btn('Взяти талант','feat',f.id,{cls:'main'}):'<p class="m">Вимоги виконано. Талант можна буде взяти з новим рівнем.</p>'}</div>`}}
  return h+`</section>`}
function mapSvg(){const T={x:176,y:232};let g=`<rect class="sea" x="0" y="0" width="400" height="270"/>`;
  g+=`<path class="land" d="M58,172 C70,132 130,96 200,98 C268,92 336,118 354,168 C366,214 316,250 236,248 C160,258 66,234 58,172Z"/>`;
  if(s.disc.reef)g+=`<path class="land" d="M40,60 C46,44 78,42 86,58 C88,74 56,82 40,60Z"/>`;
  if(s.disc.fort)g+=`<path class="land" d="M284,44 C292,24 330,22 340,40 C344,60 300,68 284,44Z"/>`;
  for(const id in LOC)if(s.disc[id]){const L=LOC[id];g+=`<path class="route" d="M${T.x},${T.y} L${L.x},${L.y}"/>`}
  g+=`<g class="home"><rect x="${T.x-4}" y="${T.y-10}" width="8" height="18"/><text x="${T.x+9}" y="${T.y+6}">Маяк</text></g>`;
  for(const id in LOC)if(s.disc[id]){const L=LOC[id],tx=L.lx==='l'?`x="${L.x-11}" text-anchor="end"`:`x="${L.x+11}"`;
    g+=`<g class="node${s.visited[id]?' vis':''}" data-a="go" data-i="${id}" role="button" tabindex="0" aria-label="${L.n}"><circle cx="${L.x}" cy="${L.y}" r="7"/><text ${tx} y="${L.y+4}">${L.n}</text></g>`}
  return `<svg viewBox="0 0 400 270" role="img" aria-label="Мапа шхер">${g}</svg>`}

function mapSig(){return Object.keys(LOC).map(k=>(s.disc[k]?1:0)+(s.visited[k]?1:0)).join('')+(s.f.boat?1:0)+(s.f.won?1:0)+(s.f.gnat?1:0)}
const mapMake=()=>mapBuf({disc:s.disc,visited:s.visited,boat:s.f.boat,won:s.f.won,gnat:s.f.gnat});
function mapURL(){return pxURL('mp:'+mapSig(),mapMake)}
const LSC=id=>id==='mine'?'mine':id==='bay'?(lowTide()?'bayLow':'bayHigh'):id;
function rMap(){if(s.at)return rLoc();return`<section><h2>Шхери</h2><p class="m">Натискай на позначки, щоб вирушити. Нерозвідане ховається в млі. Біля маяка — далекогляд і сигнальне вогнище.</p><details class="ledg"${s.ldOpen?' open':''}><summary>Усе списком</summary>${rMapList()}</details></section>`}
function rMapList(){const u=0;
  let h=`<section>`;
  if(u){h+=`<div class="pmap">${pimgA('mp:'+mapSig(),mapMake,640,432,'','Мапа шхер',0,WATER2)}`;
    for(const k in LOC){if(!s.disc[k]||!MAPPT[k])continue;const[x,y]=MAPPT[k],[ok]=canGo(k);
      h+=`<button type="button" class="mk${s.visited[k]?' vis':''}${ok?'':' far'}" style="left:${x/160*100}%;top:${y/108*100}%" data-a="go" data-i="${k}" aria-label="${LOC[k].n}"><span>${LOC[k].n}</span></button>`}
    h+=`<span class="mk home" style="left:${MAPPT.tower[0]/160*100}%;top:${MAPPT.tower[1]/108*100}%"><span>Маяк</span></span></div>`}

  if(scanTarget())h+=`<div class="row"><div><b>Далекогляд</b><br><span class="m">Пробити млу й знайти нове місце.</span></div>${btn(`Оглянути обрій (${R('ember',fmt(scanCost()))})`,'scan','',{ok:()=>s.r.ember>=scanCost()})}</div>`;
  h+=`<div class="row"><div><b>Сигнальне вогнище</b><br><span class="m">Великий вогонь на оглядовій кличе кораблі, що минають шхери. Вони скидають вантаж. Раз на дві хвилини.</span></div>${btn(`Запалити (${R('ember',fmt(sigCost()))})`,'signal','',{ok:()=>s.r.ember>=sigCost(),cd:'signal',cs:120})}</div>`;
  h+=`</section><section><h2>Відомі місця</h2>${s.f.boat?`<p class="m">Вихід у море коштує ${R('prov',SEAFOOD)}${s.f.schooner?`, похід на шхуні — ${R('prov',SEAFOOD*2)}`:''}.</p>`:''}<div class="lcards">`;
  for(const id in LOC)if(s.disc[id]){const L=LOC[id],[ok,why]=canGo(id);
    const sk=(s.seenK||{}).map||{},newA=tabKeys('map').some(k=>k.indexOf('a:'+id+'.')===0&&!sk[k]);
    const tags=[s.visited[id]?'<span class="chip">відвідано</span>':'<span class="chip new">нове</span>',s.visited[id]&&newA?'<span class="chip new">нові справи</span>':'',L.sea===2?'<span class="chip">шхуна</span>':L.sea?'<span class="chip">море</span>':'',L.dark?'<span class="chip">темрява</span>':''].join('');
    h+=`<div class="lcard">${pimg(sceneURL(LSC(id)),192,80,'thumb')}<div class="lbody"><b class="pl">${L.n}</b><div class="chips">${tags}</div><span class="m">${id==='fort'?V(()=>canGo(id)[1]||L.d):why||L.d}</span>${btn('Вирушити','go',id,{ok:()=>canGo(id)[0]})}</div></div>`}
  return h+`</div></section>`}
function rBells(){let h=BELLS.map((b,i)=>`<div class="act">${btn(b[0],'bell',i)}<span class="m">${b[1]}</span></div>`).join('');
  h+=`<p class="m">Пролунало: ${s.bell.length?s.bell.map(i=>BELLS[i][0].split(' ')[0].toLowerCase()).join(', '):'поки тиша'}.</p>`;
  if(s.bellFail>=2)h+=`<p class="hint">Хвилі під дзвіницею то відкочуються від каміння, то знову набігають на нього. Раз, і ще раз.</p>`;
  return h}
function rBog(){const row=BOGP[s.bog||0];let h=`<p class="m">Пройдено кочок: ${s.bog||0} з ${BOGP.length}. Куди ступити далі?</p><div class="act">${row.map((o,k)=>btn(o[0],'bogstep',k)).join('')}</div>`;
  if((s.bogFail||0)>=2)h+=`<p class="hint">З хати посеред болота хтось гукає: ${Q('Хто тут виріс, той знає: на воді мох не росте')}.</p>`;
  return h}
function rStones(){const top=s.stones.map(()=>'  ___  ').join(' '),mid=s.stones.map(d=>` ( ${DIRCH[d]} ) `).join(' '),bot=s.stones.map(()=>' |___| ').join(' ');
  let h=`<pre class="art" aria-hidden="true">${esc(top+'\n'+mid+'\n'+bot)}</pre>`;
  h+=`<div class="act">${s.stones.map((d,k)=>btn(`Камінь ${k+1}: ${DIRS[d]}`,'stone',k)).join('')}</div>${btn('Торкнутися каменів','stonesTry','',{cls:'main'})}`;
  if(s.stoneFail>=2)h+=`<p class="hint" style="margin-top:8px">${s.odd.compass?'Стрілка твого компаса-навпаки тремтить і вказує вниз схилом, на маяк.':'Камені старші за маяк. Їх ставили ті, хто чекав на його вогонь. Може, мапа підкаже, де він стоїть.'}</p>`;
  return h}

function rLoc(){const l=s.at,L=LOC[l];
  let h=`<section><h2>${L.n}</h2><p>${typeof L.d==='function'?VH(L.d):L.d}</p><p class="m">Ліхтарі позначають, куди можна піти; люди чекають біля своїх дощок.</p><div class="act">${btn('Повернутися до маяка','leave')}</div><details class="ledg"${s.ldOpen?' open':''}><summary>Усе списком</summary>`;
  for(const S of L.spots){if(S.show&&!S.show())continue;const body=`<h3>${S.n}</h3>${spotBody(l,S)}`;
    h+=S.face?`<div class="spot">${pimg(faceURL(S.face),48,48,'face')}<div>${body}</div></div>`:`<div>${body}</div>`}
  return h+'</details></section>'}

function rTrade(){return`<section><h2>Крамниця Яреми</h2>${curHTML()}<p class="m">Товари на полицях, ваги на прилавку — для продажу.${s.f.crateDone?' Ярема дає тобі знижку за повернений ящик.':''}</p><details class="ledg"${s.ldOpen?' open':''}><summary>Усе списком</summary>${rTradeList()}</details></section>`}
function rTradeList(){let h=`<section class="spot">${pimg(faceURL('yarema'),64,64,'face')}<div><h2>Крамниця Яреми</h2><p>Монет: ${V(()=>fmt(s.r.coin))}.${s.f.crateDone?' Ярема дає тобі знижку за повернений ящик.':''}</p></div></section><section><div class="bag">`;
  for(const it of SHOP){if(it.show&&!it.show())continue;const p=price(it.p),ik=IT[it.id]?it.id:(it.res?Object.keys(it.res)[0]:it.book?'lore':'crate');
    h+=`<div class="cell" ${IT[it.id]?itemTip(it.id):''}><div class="ic" aria-hidden="true">${pimg(icoURL(ik),36,36)}</div><b>${it.n}</b>${fresh9('t:'+it.id)}<span class="m">${IT[it.id]?itemShort(it.id):it.d}</span>${btn(`Купити (${R('coin',p)})`,'buy',it.id,{ok:()=>s.r.coin>=p})}</div>`}
  h+=`</div></section><section><h2>Продати</h2>`;
  for(const it of SELL){if(it.r&&!s.seen[Object.keys(it.r)[0]])continue;if(it.it&&!has(Object.keys(it.it)[0]))continue;
    h+=`<div class="row"><div><b>${it.n}</b></div>${btn(`Продати (+${R('coin',sellG(it.g))})`,'sell',it.id,{ok:()=>afford(it.r,it.it)})}</div>`}
  return h+`</section>`}

function ago(at){if(!at)return'';const m=Math.floor((Date.now()-at)/60000);return m<1?'щойно':m<60?`${m} хв тому`:`${Math.floor(m/60)} год тому`}
function rJournal(){const documents=oddDocumentIds(),kills=Object.values(s.kills).reduce((a,b)=>a+b,0);
  const sub=[['goals','Цілі',1],['story','Сюжет',s.chs.length||Object.keys(s.bts||{}).length],['pages','Записи Остапа',s.pages.length],['chars','Персонажі',Object.keys(s.met).length],['foes','Бестіарій',Object.keys(s.seenE).filter(k=>EN[k]&&!EN[k].obj&&!EN[k].ally).length],['documents','Прочитані документи',documents.length],['gloss','Словник',Object.keys(s.glSeen||{}).length],['log','Події',1],['help','Довідник',tutIds().length]].filter(x=>x[2]);
  if(!sub.some(x=>x[0]===s.jt))s.jt='goals';
  let h=`<section class="jr"><div class="jhead"><div><h2>Журнал хранителя</h2><span class="hand">Записано рукою того, хто береже вогонь</span></div>
  <div class="chips"><span class="chip">розділів пройдено <b>${s.chs.length}</b></span><span class="chip">записок <b>${s.pages.length}</b></span><span class="chip">перемог <b>${kills}</b></span></div></div>
  <div class="bm" role="tablist">${sub.map(x=>btn(x[1],'jt',x[0],{cls:s.jt===x[0]?'on':''})).join('')}</div>`;
  if(s.jt==='goals'){const gs=GO.filter(g=>g[1]());const cur=gs.find(g=>!g[2]());
    h+=`<ul class="goals">${gs.map(g=>{const dn=g[2]();return`<li class="${dn?'off':g===cur?'now':''}"><span class="box" aria-hidden="true">${dn?'✓':''}</span><span>${g[0]()}${g===cur?' <span class="stt on">зараз</span>':''}</span></li>`}).join('')}</ul>`;
    const sq=SQ.filter(q=>q[1]());
    if(sq.length)h+=`<p class="jh">Доручення й таємниці</p><div class="cards">${sq.map(q=>{const dn=q[2]();return`<div class="card${dn?' done':''}"><h4>${q[0]}<span class="stt ${dn?'dn':'on'}">${dn?'виконано':'триває'}</span></h4><span class="m">${dn?'Справу зроблено.':q[3]()}</span></div>`}).join('')}</div>`}
  if(s.jt==='story'){const st0=CH.map((c,ix)=>ix).filter(chStarted);
    h+=`<ol class="tl">${st0.map(ix=>{const c=CH[ix],dn=chDone(ix),bd=c.beats.filter(b=>s.bts[b[0]]),left=c.beats.length-bd.length;
      return`<li class="${dn?'':'new'}"><span class="dot">${ix+1}</span><b>${chName(c)}</b> <span class="stt ${dn?'dn':'on'}">${dn?'завершено':'триває'}</span><br><span class="m">${c.d}</span>${bd.length?`<ul class="beats">${bd.map(b=>`<li><b>${b[1]}.</b> ${b[3]}</li>`).join('')}</ul>`:''}${left?`<span class="m">Історія триває…</span>`:''}</li>`}).join('')}</ol>`;
    if(s.chs.length<CH.length)h+=`<p class="m">Далі — невідомо.</p>`}
  if(s.jt==='pages')h+=`<div class="notes">${s.pages.slice().sort().map(n=>`<div class="note"><span class="no">${n==='m'?'без номера':'аркуш '+n}</span>${PG[n].replace(/ — О\.$/,'')}<span class="sig">— О.</span></div>`).join('')}</div>`;
  if(s.jt==='chars')h+=`<div class="cards">${CHAR.filter(c=>s.met[c[0]]).map(c=>`<div class="card pcard">${pimg(faceURL(c[0]),96,96,'',c[1])}<div><b class="npc">${c[1]}</b><span class="role">${ROLE[c[0]]||''}</span><span class="m">${c[2]()}</span></div></div>`).join('')}</div>`;
  if(s.jt==='foes')h+=`<div class="cards">${Object.keys(EN).filter(k=>s.seenE[k]&&!EN[k].obj&&!EN[k].ally).map(k=>{const e=EN[k];return`<div class="card"><div class="pcard">${pimg(sprURL(k),64,64,'',e.n)}<div><b class="foe">${e.n}</b><span class="m">${e.d}</span></div></div>
    <div class="stats"><span>здоров’я<b>${e.hp}</b></span><span>броня<b>${e.arm}</b></span><span>ухилення<b>${e.eva}%</b></span><span>хід<b>${e.mv}${e.fly?' лет':''}${e.swim?' вода':''}</b></span></div>
    <div>${e.p.map(x=>`<span class="habit">${x[2].toLowerCase()}${x[1]&&x[0]!=='heal'?' '+x[1]:''}</span>`).join('')}</div><p class="m" style="margin:6px 0 0">Переможено: ${s.kills[k]||0}</p></div>`}).join('')}</div>`;
  if(s.jt==='documents')h+=`<div class="notes">${documents.map(id=>`<article class="note"><h3>${OD[id].n}</h3><p>${OD[id].d}</p></article>`).join('')}</div>`;
  if(s.jt==='gloss')h+=`<p class="m ink">Старі морські слова, які трапляються в записах. У тексті вони підкреслені пунктиром: наведи курсор або торкнися, щоб побачити пояснення.</p><dl class="gloss">${GLOS.filter(g=>(s.glSeen||{})[g[0]]).map(g=>`<dt><b>${g[1]}</b></dt><dd class="ink">${g[2].charAt(0).toUpperCase()+g[2].slice(1)}</dd>`).join('')}</dl>`;
  if(s.jt==='help')h+='<p class="m">Пояснення вже відкритих механік.</p>'+tutListHTML();
  if(s.jt==='log')h+=`<ul class="logl">${s.log.slice(0,40).map(x=>{x=logOf(x);return`<li><span class="tag t-${x.t}">${TAGN[x.t]}</span><span class="ev-text">${x.m}</span><time>${ago(x.at)}</time></li>`}).join('')}</ul>`;
  return h+`</section>`}
const AFL={pierv:'sand',pierfog:'plank',yardA:'sand',shoreL:'sand',heartL:'stone',shore:'sand',hold:'plank',cliff:'grass',bay:'sand',cave:'stone',fort:'grass',tower:'stone',store:'plank',bog:'grass',mine:'stone',shoal:'sand',spit:'sand',isle:'sand',monastery:'stone',guard:'stone',heartA:'stone'};
const TK={'#':'rock','+':'crate','~':'water','E':'exit','f':'floor'};
const INDOOR={hold:1,cave:1,tower:1,store:1,mine:1,monastery:1};
/* шанс влучити — на самій цілі, коли її можна вдарити чи підстрелити */
/* смужка здоров'я під постаттю; намір ворога над нею */
function uBar(hp,mx,k){const p=Math.max(0,Math.min(100,hp/mx*100));return`<i class="uhp ${k}${p<34?' lo':''}" aria-hidden="true"><b style="width:${p.toFixed(0)}%"></b></i>`}
function uIntentChip(u){if(u.stun)return'';const[k,v]=uIntent(u);if(STANCE[k])return'';const ic=k==='shoot'||k==='aim'?'ishoot':k==='heal'?'iheal':['hit','cold','wrap'].includes(k)?'ihit':'';if(!ic)return'';
  const n=['hit','cold','wrap'].includes(k)?v*(u.wind?2:1):k==='shoot'||k==='heal'?v:'';return`<i class="uin k-${ic}"><img src="${stiURL(ic)}" alt="">${n}</i>`}
function chBadge(c,u){const d=dist(c.hx,c.hy,u.x,u.y);const ch=d<=1?meleeCh(u):canShoot(u)?shotCh(u):null;if(ch==null)return'';return`<i class="chb${ch>=75?' hi':ch<50?' lo':''}">${Math.round(ch)}%</i>`}
function rCombat(){const c=s.cb;setGrid(c);const u0=selU(),hv=heavyAP(),fl=AFL[c.a]||'sand';
  const intentTxt=u=>{const[k,v,nm,rg]=uIntent(u);if(STANCE[k])return`зараз: ${nm.toLowerCase()} (${U(STANCE[k])})`;
    const dmg=['hit','cold','wrap'].includes(k)?`, ${v*(u.wind?2:1)} урону`:k==='shoot'?`, ${v} урону${u.aimed?', прицільно':''}`:k==='heal'?`, +${v}`:'';
    return`наприкінці ходу: ${nm.toLowerCase()}${dmg}${rg?`, дальність ${rg}`:''}${k==='cold'?', крізь броню':''}`};
    const TT={'#':'<b>Скеля</b><br>Повне укриття: крізь неї не видно й не пройти. Стань за нею — і стрільці тебе не дістануть.','+':'<b>Ящик</b><br>Пів-укриття: постріли крізь нього влучають на 25% гірше. Пройти не можна.','~':'<b>Вода</b><br>Крок сюди коштує 2 ОД. Тут можуть чатувати ті, хто плаває.','E':'<b>Вихід</b><br>Стань сюди й натисни «Втекти», щоб вийти з бою.','f':'<b>Туман</b><br>Крізь нього не видно: ні ти, ні вороги не стріляють через туман. Пройти можна.','.':'<b>Чиста земля</b>'};
  const shooters=c.hidden?[]:alive(c).filter(u=>!u.hid&&['shoot','aim','bolt','wave','spit','hook'].includes(uIntent(u)[0]));
  const exposed=(x,y,u)=>{const it=uIntent(u),r=it[3]||1,d=dist(x,y,u.x,u.y);return it[0]==='wave'?d<=r:d<=r&&(d<=1||los(c,u.x,u.y,x,y))};
  const coverAt=(x,y)=>{let any=0,hid=0,minC=99;for(const u of shooters){const it=uIntent(u),r=it[3]||1,d=dist(x,y,u.x,u.y);if(it[0]==='wave'){if(d<=r){any=1;minC=0}continue}if(d>r)continue;if(d<=1||los(c,u.x,u.y,x,y)){any=1;minC=Math.min(minC,cover(c,x,y,u.x,u.y))}else hid=1}return any?minC:hid?-1:-3};
  const threatTxt=()=>{const L=shooters.filter(u=>exposed(c.hx,c.hy,u));return L.length?`<br><b>Під прицілом:</b> ${L.map(u=>{const cv=uIntent(u)[0]==='wave'?0:cover(c,c.hx,c.hy,u.x,u.y);return`${EN[u.t].n}${uIntent(u)[0]==='aim'?' (цілиться)':''}${cv?`, укриття −${cv}%`:', без укриття'}`}).join('; ')}.`:(shooters.length?'<br>Жоден стрілець тебе зараз не бачить.':'')};
  const cellTip=(x,y,t,u,me,D)=>{if(me)return`<b>Ти</b><br>Здоров’я ${Math.max(0,Math.ceil(s.h.hp))}/${maxHP()}, броня ${armor()}, очок дії ${c.ap}.${c.guard?`<br>Захисна стійка: зблизька −${guardPct(1)}%, здалеку −${guardPct(0)}%.`:''}${c.smoke?'<br>У диму: постріли ворогів мимо.':''}${threatTxt()}`;
    if(u&&u.hid)u=null;
    if(u&&EN[u.t].ally)return`<b>${u.nm||EN[u.t].n}</b><br>Здоров’я ${u.hp}/${u.max}. Б’ється на твоєму боці.`;
    if(u&&EN[u.t].struct)return`<b>${u.nm||EN[u.t].n}</b><br>Міцність ${u.hp}/${u.max}. ${EN[u.t].d}${st('mech')>=1?'<br>Стань поруч і натисни, щоб полагодити (2 ОД).':''}`;
    if(u){const T=EN[u.t];if(T.obj)return`<b>${T.n}</b><br>${T.d}`;const d=dist(c.hx,c.hy,u.x,u.y);
      const sts=[u.armDown?`броня −${u.armDown}`:'',u.burn?'горить':'',u.bleed?'кровотеча':'',u.stun?'оглушений':'',u.pin?'притиснутий':'',u.weak?'вагається':'',u.wind?'замахнувся':'',u.veil?'у тумані':'',u.ward?'під щитом':''].filter(Boolean);
      return`<b>${T.n}</b><br>Здоров’я ${u.hp}/${u.max}, броня ${Math.max(0,uArm(u)-(u.armDown||0))}, ухилення ${evaOf(u)}%${u.el?`<br><b>Ветеран: ${ELITE[u.el].n}</b> (${ELITE[u.el].d})`:''}${u.role?`<br>${u.role==='thief'?(u.loot?'Несе награбоване!':'Лізе до складу по припаси.'):'Хоче ламати будівлі.'}`:''}${T.thorns?'<br>Колючий: удар упритул ранить і тебе.':''}${T.grip?'<br>Вчіплюється: поки тримає, ти не можеш відійти. Удар по ньому скидає хватку.':''}${T.burst?'<br>Помираючи, вибухає холодом.':''}${T.fly?', літає':''}${T.swim?', плаває':''}.<br>${intentTxt(u)}.<br>Відстань ${d}. ${inReach(u)?`Удар влучить на ${meleeCh(u)}%`:'Задалеко для удару'}${s.eq.ranged?(canShoot(u)?`, постріл — на ${shotCh(u)}%`:', пострілом не дістати'):''}.${sts.length?`<br>Стан: ${sts.join(', ')}.`:''}`}
    const cvx=shooters.length&&!solid(t)?coverAt(x,y):-2;
    return(TT[t]||TT['.'])+(c.fire&&c.fire.some(q=>q.x===x&&q.y===y)?'<br><b>Горить!</b> Хто стоїть тут наприкінці ходу ворогів, отримує 3 урону.':'')+(cvx===-1?'<br>Звідси тебе не побачить жоден стрілець: огляд закриває перешкода.':cvx===-3?'<br>Стрільці сюди не дістануть.':cvx>0?`<br>Укриття від стрільців: −${cvx}%.`:cvx===0?'<br>Тут ти відкритий для пострілу.':'')+(c.traps.some(q=>q.x===x&&q.y===y)?'<br>Тут твій капкан.':'')+(solid(t)?'':D[y][x]<=c.ap?`<br>Дійдеш за ${D[y][x]} ОД.`:'<br>Цього ходу не дійдеш.')};
  const reachMap=costMap(c,c.hx,c.hy,'walk');const isTrap=(x,y)=>c.traps.some(t=>t.x===x&&t.y===y);let g='';const usePx=!!tileURL('floor',fl),arU=usePx?arenaURL(c):'';
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const t=tileAt(c.a,x,y),u=unitAt(c,x,y),me=c.hx===x&&c.hy===y;let ch='·',cls='',lab='',spr='';
    if(me){ch='@';cls='me'+(c.hidden?' hidme':'');lab='Ти';spr='hero'}
    else if(u&&u.hid){}
    else if(u){const T=EN[u.t];ch=T.ch;cls=(T.ally?'al':T.struct?'ob st':T.obj?'ob':'fo')+(u===u0?' sel':'')+(u.el?' eli':'');lab=`${u.nm||T.n}, здоров’я ${u.hp}`;spr=u.t}
    else if(t==='#'){ch='#';cls='w';lab='Скеля'}
    else if(t==='+'){ch='+';cls='hc';lab='Пів-укриття'}
    else if(t==='~'){ch='~';cls='wa';lab='Вода'}
    else if(t==='E'){ch='<';cls='ex';lab='Вихід'}
    if(t==='f')cls+=' fogc';if(c.fire&&c.fire.some(q=>q.x===x&&q.y===y))cls+=' firec';if(me&&c.smoke)cls+=' smk';
    if(c.mode){if(cellOk(c.mode,x,y))cls+=' re'}else if(!u&&!me&&!solid(t)&&reachMap[y][x]<=c.ap)cls+=' re';if(!u&&!me&&isTrap(x,y)){spr='trap';if(!usePx)ch='^'}
    const tk=t==='#'&&INDOOR[c.a]?'wall':(TK[t]||'floor');const bg=usePx&&!arU?` style="background-image:url(${tileURL(tk,fl)})"`:'';
    const inner=(usePx?(spr?`<img class="px" src="${spr==='hero'?heroURL(s.eq):sprURL(spr)}" alt="">`:''):esc(ch))+(u&&!me&&!EN[u.t].ally&&!isObj(u)&&u.hp>0&&!u.hid?chBadge(c,u)+uIntentChip(u)+uBar(u.hp,u.max,'fo'):'')+(u&&!me&&EN[u.t].ally&&u.hp>0&&!u.hid?uBar(u.hp,u.max,'al'):'')+(me?uBar(s.h.hp,maxHP(),'me'):'');
    g+=`<button type="button" class="${cls.trim()}" data-a="c_cell" data-i="${x},${y}" aria-label="${lab||'Клітинка'} ${x+1}, ${y+1}" ${TA(cellTip(x,y,t,u,me,reachMap))}${bg}>${inner}</button>`}
  const pad=[[-1,-1,'↖'],[0,-1,'↑'],[1,-1,'↗'],[-1,0,'←'],[0,0,''],[1,0,'→'],[-1,1,'↙'],[0,1,'↓'],[1,1,'↘']].map(([dx,dy,a])=>dx||dy?btn(a,'c_mv',`${dx},${dy}`,{lab:'Крок'}):btn('кінець','c_end','',{lab:'Завершити хід',cls:'toggle'})).join('');
const inR=u0&&inReach(u0),cv=u0?cover(c,c.hx,c.hy,u0.x,u0.y):0;
  const PP=(x,y)=>`left:${(x+0.5)/GW*100}%;top:${(y+0.5)/GH*100}%`,SH=(cl,sz)=>`<svg viewBox="0 0 10 12"><path d="M5 .5L9.5 2.3V6c0 2.8-2.2 4.7-4.5 5.5C2.7 10.7.5 8.8.5 6V2.3Z" fill="${cl}" stroke="#0b1418" stroke-width="1"/></svg>`;
  let lines='',marks='';const VX=x=>(x+0.5)*10,VY=y=>(y+0.5)*10;
  for(const u of shooters)if(exposed(c.hx,c.hy,u)){const aim=uIntent(u)[0]==='aim';lines+=`<line class="${aim?'aim':'fire'}" x1="${VX(u.x)}" y1="${VY(u.y)}" x2="${VX(c.hx)}" y2="${VY(c.hy)}"/>`;
    const cv=uIntent(u)[0]==='wave'?0:cover(c,c.hx,c.hy,u.x,u.y);const mx=c.hx+(u.x-c.hx)*0.35,my=c.hy+(u.y-c.hy)*0.35;marks+=`<span class="gm lbl ${cv?'ok':'bad'}" style="${PP(mx,my)}">${cv?`укриття −${cv}%`:aim?'цілиться':'відкритий'}</span>`}
  if(s.eq.ranged&&u0&&!isObj(u0)){const d=dist(c.hx,c.hy,u0.x,u0.y);if(d>1&&d<=rngOf()+2){const ok=canShoot(u0);lines+=`<line class="own${ok?'':' no'}" x1="${VX(c.hx)}" y1="${VY(c.hy)}" x2="${VX(u0.x)}" y2="${VY(u0.y)}"/>`;
    marks+=`<span class="gm lbl ${ok?'ok':''}" style="${PP(u0.x,u0.y-0.62)}">${ok?`постріл ${shotCh(u0)}%`:d>rngOf()?'задалеко':'не видно'}</span>`}}
  if(shooters.length&&!c.mode)for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const t=tileAt(c.a,x,y);if(solid(t)||unitAt(c,x,y)||(x===c.hx&&y===c.hy)||reachMap[y][x]>c.ap)continue;const cv=coverAt(x,y);
    if(cv===-1||cv>0)marks+=`<span class="gm" style="${PP(x+0.3,y-0.3)};width:${30/GW}%">${SH(cv===-1?'#7fe08c':cv>=40?'#f0b84a':'#e7d6a0')}</span>`}
  if(c.guard)marks+=`<span class="gm" style="${PP(c.hx-0.28,c.hy+0.25)};width:${42/GW}%">${SH('#7fb8e0')}</span>`;
  for(const u of c.u){if(u.hp<=0||isObj(u)||u.hid||EN[u.t].ally)continue;const L=[];if(u.ward)L.push('stance');if(uStance(u))L.push('stance');if(u.stun)L.push('stun');if(u.bleed)L.push('bleed');if(u.burn)L.push('burn');if(u.pin)L.push('pin');if(u.weak)L.push('weak');if(u.wind)L.push('wind');if(u.aimed)L.push('aim');if(u.veil)L.push('veil');if(u.armDown)L.push('armd');
    if(L.length)marks+=`<span class="stis" style="left:${u.x/GW*100}%;top:${(u.y+.62)/GH*100}%;width:${100/GW}%">${L.slice(0,4).map(k=>`<img src="${stiURL(k)}" alt="">`).join('')}</span>`}
  const gst=`grid-template-columns:repeat(${GW},minmax(0,1fr))`,gw=Math.round(60*GW);
  let h=`<section><h2>Бій${c.round?` <span class="m">· хід ${c.round+1}</span>`:''}</h2><div class="tac${GW>11?' wide':''}"><div><div class="arf${arenaIn(c.a)?' in':''}" style="max-width:${gw+24}px"><div class="gwrap" id="gwrap">${arU?`<img class="arbg" src="${arU}" alt=""><div class="hlt" style="${PP(c.hx,c.hy)};width:${(arenaIn(c.a)||GR!=='y'?560:300)/GW}%"></div>`:''}<div class="grid${usePx?' px':''}${arU?' ar':''}" style="${gst}">${g}</div><svg class="gfx" viewBox="0 0 ${GW*10} ${GH*10}" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${marks}<div class="fxl" id="fxl"></div>${c.over?`<div class="cbover ${c.over}"><b>${c.over==='lose'?'Тебе здолали':'Перемога'}</b></div>`:''}</div></div>
  ${s.legOpen?`<p class="legend">Червона лінія — хто вистрілить у тебе наприкінці ходу, жовта — хто цілиться, зелена — твій постріл. Щити на клітинках: зелений — там тебе не побачить жоден стрілець, жовтий — укриття. Синій щит на тобі — захисна стійка. Туман закриває огляд, вогонь обпікає. Наведи курсор на клітинку чи ворога (на телефоні — затримай палець), щоб побачити підказку. Скеля ховає повністю; ящики дають пів-укриття; вода — крок за 2 ОД; стрілки зліва — вихід. Бочка з олією вибухає від удару. Жовта рамка: куди дійдеш цього ходу. Дії — іконки праворуч: наведи на іконку (на телефоні затримай палець), щоб прочитати, що вона робить і скільки коштує.</p>`:''}${arU?'':`<div class="pad" aria-label="Рух">${pad}</div>`}
  <ul class="clog" aria-live="polite">${c.log.map(x=>`<li>${x}</li>`).join('')}</ul></div><div>
  <p class="m">Здоров’я ${Math.max(0,Math.ceil(s.h.hp))} / ${maxHP()}, броня ${armor()}</p>${(()=>{if(c.over)return'';const t=cbThreat(c);return t>=s.h.hp?`<p class="m warn"><b>Небезпека!</b> Якщо всі вороги влучать, наприкінці ходу ти втратиш до ${t} здоров’я — більше, ніж маєш. Відійди, сховайся за укриття, стань у захисну стійку або підлікуйся.</p>`:t?`<p class="m">Наприкінці ходу вороги можуть завдати до ${t} урону.</p>`:''})()}<div class="bar"><i style="width:${Math.max(0,s.h.hp/maxHP()*100)}%"></i></div>
  <p class="ap" aria-label="Очки дії: ${c.ap}">${'●'.repeat(c.ap)}${'○'.repeat(Math.max(0,maxAP()-c.ap))}</p>
  ${wolfCmdHTML(c)}
  ${c.enc==='rsiege'?'<p class="m"><b>Оборона Причалу.</b> Утопленики йдуть ламати хати, вовки кидаються на людей. Бережи рибалок і хати.</p>':''}
  ${c.win==='raid'?'<p class="m"><b>Оборона маяка.</b> Захисти склад і будівлі: злодії тягнуть припаси до води праворуч, руйнівники ламають будівлі. Поруч із пошкодженою будівлею її можна полагодити.</p>':''}
  ${c.u.some(u=>EN[u.t].ally&&u.hp>0)?`<p class="m">Союзники: ${c.u.filter(u=>EN[u.t].ally&&u.hp>0).map(u=>`${u.nm||EN[u.t].n.toLowerCase()} ${u.hp}/${u.max}`).join(', ')}.</p>`:''}
  <p class="m">${[c.hidden?'<b>Ти в тіні:</b> тебе не бачать, наступний удар критичний.':'',c.poison?`Отруєний: −2 здоров’я ще ${c.poison} х.`:'',c.smoke?'У диму: постріли ворогів мимо.':'',c.guard?`Захисна стійка: зблизька −${guardPct(1)}%, здалеку −${guardPct(0)}%.`:'',c.sand?'Засліплений: влучність −30%.':'',c.focus?`<b>Зосередження:</b> +${c.focus}% до наступного удару.`:'',gripU(c)?`<b>${EN[gripU(c).t].n} тримає тебе за ногу:</b> не відійдеш, доки не вдариш його.`:'',cv?`Укриття від цілі: її постріли −${cv}%.`:''].filter(Boolean).join(' ')||'Натисни на ворога, щоб вибрати ціль, і ще раз, щоб атакувати. На клітинку — щоб піти туди.'}</p>
  <ul class="foes">${c.u.map((u,ix)=>u.hp>0&&!isObj(u)&&!EN[u.t].ally&&!u.hid?`<li class="${u===u0?'on':''}" ${TA(`<b>${EN[u.t].n}</b><br>${EN[u.t].d}`)}>${usePx?`<img class="fimg" src="${sprURL(u.t)}" alt="">`:''}<div>${btn(EN[u.t].n+(u.el?' ★':''),'c_sel',ix,{cls:u===u0?'on':''})}${u.el?`<span class="elchip">${ELITE[u.el].n}</span>`:''}${u.role?`<span class="habit">${u.role==='thief'?(u.loot?'несе здобич':'злодій'):'руйнівник'}</span>`:''}<span class="m">${u.hp}/${u.max}</span>${[u.armDown?`броня −${u.armDown}`:'',u.burn?'горить':'',u.bleed?'кровотеча':'',u.stun?'оглушений':'',u.pin?'притиснутий':'',u.weak?'вагається':'',u.wind?'замахнувся':'',u.veil?'у тумані':'',u.ward?'під щитом':''].filter(Boolean).map(x=>`<span class="habit">${x}</span>`).join('')}<br><span class="m">${intentTxt(u)}</span></div></li>`:'').join('')}</ul>`;
  const trs=w=>w&&WT[w]?U([WT[w].tr,...WF[w].slice(0,wF(w)).map(f=>f.tr)].join(' ')):'';
  const tip=(n,ap,L,w)=>`<b>${n}</b>${ap?` <span class="tap">· ${ap} ОД</span>`:''}${L.filter(Boolean).map(x=>'<br>'+x).join('')}${w?`<span class="twhy">${w}</span>`:''}`;
  const d0=u0?dist(c.hx,c.hy,u0.x,u0.y):0,noT='Спершу обери ціль: натисни на ворога на полі.',noAP='Не вистачає очок дії.';
  const G=[];let ga='';
  const wa=wAP(),wn=s.eq.weapon?wN(s.eq.weapon):'кулаки';
  const mW=!u0?noT:!inR?`Ціль за ${d0} кл. ${reach()>1?'Гарпуном дістанеш із двох клітинок.':'Підійди впритул.'}`:c.ap<wa?noAP:'';
  ga+=ib('c_atk','',{url:s.eq.weapon?wIco(s.eq.weapon):icoURL('a_fist'),ok:!mW,ap:wa,lab:'Удар',tip:tip(`Удар: ${wn}`,wa,[u0?`Шанс влучити: <b>${meleeCh(u0)}%</b>`:'',s.eq.weapon?trs(s.eq.weapon):'Без зброї б’єш кулаками.'],mW)});
  const mH=!u0?noT:!inR?'Ціль задалеко для удару.':c.ap<hv?noAP:'';
  ga+=ib('c_heavy','',{url:hvURL(),ok:!mH,ap:hv,lab:'Потужний удар',tip:tip('Потужний удар',hv,['Урон ×1,8, але влучність на 10% нижча.',u0?`Шанс влучити: <b>${meleeCh(u0,10)}%</b>`:''],mH)});
  if(s.eq.ranged){const sa=shotAP(),cs=u0&&canShoot(u0),mS=!u0?noT:!cs?(d0<=1?'Впритул не вистрілиш: відійди хоча б на клітинку.':d0>rngOf()?`Задалеко: дальність ${rngOf()}.`:'Ціль не видно: заважає перешкода.'):c.ap<sa?noAP:'';
    ga+=ib('c_shoot','',{url:wIco(s.eq.ranged),ok:!mS,ap:sa,lab:'Постріл',tip:tip(`Постріл: ${wN(s.eq.ranged)}`,sa,[cs?`Шанс влучити: <b>${shotCh(u0)}%</b>`:'',`Дальність ${rngOf()}.`,wF(s.eq.ranged)?WF[s.eq.ranged].slice(0,wF(s.eq.ranged)).map(f=>f.tr).join(' '):''],mS)})}
  G.push(['Атака',ga]);
  const abs=abList();
  if(abs.length){let gb='';for(const id of abs){const A=ABL[id],cd=c.cds[id]||0,on=c.mode===id,ok=abOk(id,u0);
      const m=on?'':cd>=99?'Уже використано в цьому бою.':cd?`Перезарядка: ще ${cd} х.`:c.ap<A.ap?noAP:!ok?abWhy(id,u0):'';
      gb+=ib('c_ab',id,{ic:'a_'+id,ok:ok||on,ap:A.ap,cd:cd>=99?'✕':cd||'',on,lab:A.n,tip:tip(A.n,A.ap,[A.d,A.cd&&A.cd<99?`Відновлюється ${A.cd} х.`:'',on?'<i>Обери підсвічену клітинку. Натисни іконку ще раз, щоб скасувати.</i>':''],m)})}
    G.push(['Вміння',gb])}
  const sw=(s.pack||[]).filter(k=>has(k)&&s.eq[IT[k].slot]!==k),belt=(s.belt||[]).filter(has);
  if(sw.length||belt.length){let gi='';
    for(const k of belt){const it=IT[k],n=s.inv[k];let a='',ap=1,m='';const L=[itemShort(k)];
      if(it.use==='heal'){a='c_item';m=c.ap<1?noAP:!healingUse(k)?'Зараз страва чи ліки не дадуть користі.':''}
      else if(it.use==='bomb'){a='c_bomb';ap=2;m=!u0?noT:c.ap<2?noAP:!canBomb(u0)?'Ціль задалеко (до 4 клітинок) або її не видно.':'';if(u0&&d0<=1)L.push('<b>Ціль поруч: вибух зачепить і тебе.</b>')}
      else if(it.use==='net'){a='c_net';m=!u0||isObj(u0)?noT:c.ap<1?noAP:d0>3||!los(c,c.hx,c.hy,u0.x,u0.y)?'Сітку кидають до 3 клітинок, у ціль на видноті.':''}
      else if(it.use==='smoke'){a='c_smoke';m=c.ap<1?noAP:c.smoke?'Ти вже в диму.':''}
      else continue;
      gi+=ib(a,a==='c_item'?k:'',{ic:k,ok:!m,ap,cnt:n,lab:it.n,tip:tip(`${it.n} × ${n}`,ap,L,m)})}
    for(const k of sw)gi+=ib('c_sw',k,{url:wIco(k),ok:c.ap>=1,ap:1,sw:1,lab:'Взяти: '+wN(k),tip:tip(`Взяти в руки: ${wN(k)}`,1,[itemShort(k),WT[k]?trs(k):''],c.ap<1?noAP:'')});
    G.push(['Пояс і ранець',gi])}
  const sc=u0&&scareOk(u0),fixv=c.u.find(x=>x.hp>0&&EN[x.t].struct&&x.hp<x.max&&dist(x.x,x.y,c.hx,c.hy)<=1);
  let gh='';
  {const g0=Math.max(1,c.ap),gm=Math.min(60,15*g0),gr=Math.round(gm/2);gh+=ib('c_guard','',{ic:'a_guard',ok:c.ap>=1&&!c.guard,ap:c.ap||1,on:!!c.guard,lab:'Захисна стійка',tip:tip('Захисна стійка',c.ap||1,[`Витрачає всі очки дії, що лишилися, і завершує хід.`,`Зараз: удари зблизька <b>−${gm}%</b>, постріли й чари <b>−${gr}%</b>.`,'Кожне очко дає −15% зблизька, найбільше −60%. Від пострілів краще рятує укриття.'],c.guard?'Ти вже в стійці.':c.ap<1?noAP:'')})}
  if(s.nv.grow||st('stealth')>0)gh+=ib('c_hide','',{ic:'a_hide',ok:!c.hidden&&c.ap>=2,ap:2,on:!!c.hidden,lab:'Сховатися',tip:tip('Сховатися',2,[`Шанс: <b>${hideCh()}%</b>. Що менше ворогів тебе бачить, то легше.`,'Вороги втрачають тебе з очей, а наступний удар буде критичним.'],c.hidden?'Ти вже в тіні.':c.ap<2?noAP:'')});
  if(sc)gh+=ib('c_scare','',{ic:'a_scare',ok:c.ap>=2,ap:2,lab:'Залякати',tip:tip('Залякати',2,[`Шанс: <b>${scareCh()}%</b>. Поранений супротивник може скласти зброю. Одна спроба на кожного.`],c.ap<2?noAP:'')});
  if(fixv&&st('mech')>=1)gh+=ib('c_fix','',{ic:'a_fix',ok:c.ap>=2,ap:2,lab:'Полагодити',tip:tip(`Полагодити: ${fixv.nm||'укріплення'}`,2,[`+${(6+3*st('mech'))*(s.h.ft.engineer?2:1)} міцності будівлі поруч.`],c.ap<2?noAP:'')});
  if(s.h.ft.breath)gh+=ib('c_breath','',{ic:'a_breath',ok:!c.breath,lab:'Друге дихання',tip:tip('Друге дихання',0,[`Відновити ${Math.round(maxHP()*.3)} здоров’я. Без очок дії, раз за бій.`],c.breath?'Уже використано в цьому бою.':'')});
  G.push(['Герой',gh]);
  const ex=tileAt(c.a,c.hx,c.hy)==='E';
  const thr=cbThreat(c);let gt=ib('c_end','',{ic:'a_end',ok:!c.over,cls:'endt',txt:'Кінець ходу',lab:'Завершити хід',tip:tip('Завершити хід',0,['Вороги роблять те, що задумали, а тоді в тебе знову повні очки дії.',thr?`Якщо всі влучать: до −${thr} здоров’я${thr>=s.h.hp?' — <b>цього досить, щоб тебе здолати</b>':''}.`:''],'')});
  gt+=ib('c_flee','',{ic:'a_flee',ok:!c.boss&&ex,lab:'Втекти',tip:tip('Втекти з бою',0,[c.win==='raid'?'Нападники розтягнуть частину припасів.':'Повернешся до маяка без здобичі.'],c.boss?'З цього бою не втекти.':!ex?'Стань на клітинку виходу: стрілка на лівому краю поля.':'')});
  gt+=ib('c_leg','',{ic:'a_leg',ok:true,on:!!s.legOpen,lab:'Як читати поле бою',tip:tip('Як читати поле бою',0,[s.legOpen?'Сховати пояснення під полем.':'Показати під полем, що означають лінії, щити й клітинки.'],'')});
  G.push(['Хід',gt]);
  let BAR=`<div class="abar" role="toolbar" aria-label="Дії в бою">${G.filter(g=>g[1]).map(g=>`<div class="ag"><span class="agl">${g[0]}</span><div class="agi">${g[1]}</div></div>`).join('')}</div>`;
  if(c.mode)BAR+=`<p class="m"><b>Обери підсвічену клітинку</b> для вміння «${ABL[c.mode].n}». Натисни іконку ще раз, щоб скасувати.</p>`;
  if(overPen())BAR+=`<p class="m foe">Перевантаження: −${overPen()} ОД.</p>`;
  h=h.replace('<ul class="foes">',BAR+'<ul class="foes">');
  h+=`</div></div></section>`;
  return h}
const TR={chron:rChron,folk:rFolk,talents:rTalents,home:rHome,shore:rShore,tower:()=>ttBar()+({work:rWork,kitchen:rKitchen,study:rStudy}[ttCur()]||rTower)(),work:rWork,study:rStudy,hero:rHero,map:rMap,trade:rTrade,journal:rJournal};
let paintedTide='',paintingTide=false;
function tideViewKey(){
  if(s.cb)return '';
  const t=tidePhase(),low=Number(tideLow(t));
  if(atShore())return `shore:${tideStage(t)}:${low?String(tideCyc()):'high'}`;
  if(s.tab==='map'&&(['bay','shoal'].includes(s.at)||!s.at&&(s.disc.bay||s.disc.fort)))return `map:${s.at}:${low}`;
  return '';
}
function restoreTideFocus(el,root){
  if(!root||el.isConnected||document.activeElement!==document.body)return;
  const match=el.tagName==='SUMMARY'?root.querySelector('summary'):[...root.querySelectorAll('[data-a]')].find(b=>!b.disabled&&
    (el.dataset.sk?b.dataset.sk===el.dataset.sk:b.dataset.a===el.dataset.a&&b.dataset.i===el.dataset.i));
  if(el.dataset.a==='zoneEnter'){
    root.querySelector('[data-a="zoneBack"]')?.focus();
    return;
  }
  if(el.dataset.a==='zoneBack'){
    const entry=[...root.querySelectorAll('[data-a="zoneEnter"]')].find(b=>b.dataset.i===el.dataset.i);
    const closed=entry?.closest('details:not([open])');
    (closed?.querySelector('summary')||entry)?.focus();
    return;
  }
  const fallback=root.id==='popl'?root.querySelector('.bpx'):root.id==='stage'?root.querySelector('[data-k="gather"]'):root.querySelector('summary');
  (match||fallback)?.focus({preventScroll:true});
}
function render(){
  localSanitize();
  tideRenderTime=Date.now();
  const tide=tideViewKey(),view=s.tab+'|'+(s.tab==='map'?s.at:'')+'|';
  paintingTide=!!tide&&!!paintedTide&&tide!==paintedTide&&lastView===view;
  const focused=document.activeElement;
  const keepFocus=paintingTide||focused?.dataset?.a==='mussels'||focused?.dataset?.a?.startsWith('zone')||focused?.closest?.('.shore-recovery');
  const el=keepFocus?focused:null,root=el?.closest('#stage,#main,#popl,#tabs');
  paintedTide=tide;
  try{renderView();restoreTideFocus(el,root)}finally{tideRenderTime=null;paintingTide=false}
}
function renderView(){B={};bn=0;
  const tl=TABS.filter(t=>s.tabs[t[0]]);
  const dOpen=(s.dlg||[]).length>0&&!s.bellHold;if(!tabSeen)tabSeen=new Set(tl.map(t=>t[0]));
  $('tabs').innerHTML=tl.length>1?tl.map(t=>`<button type="button" class="${s.tab===t[0]?'on':''}${s.tab!==t[0]&&isNew(t[0])?' new':''}${tabSeen.has(t[0])||RM()?'':dOpen?' tpend':' tnew'}" data-a="tab" data-i="${t[0]}"${s.cb?' disabled':''}>${t[1]}</button>`).join(''):'';
  if(!dOpen)tl.forEach(t=>tabSeen.add(t[0]));
  if(!s.cb){s.nvU=s.nvU||{};s.nvU[s.tab]=1}
  let h='';
  if(s.cb)h=rCombat();
  else{
    h+='<div style="height:10px"></div>';
    if(SUBT[s.tab]){s.tt=s.tab;s.tab='tower'}if(!s.tabs[s.tab])s.tab='home';
    h+=localCurrent()?rLocalZone():TR[s.tab]();
    if(s.tab==='map')markSeen('map',s.at?'a:'+s.at+'.':'L:');else if(s.tab==='tower'&&ttCur()!=='cut')markSeen(ttCur());else if(s.tab!=='hero')markSeen(s.tab);if(s.newTab[s.tab])delete s.newTab[s.tab]}
  try{if(!texInit){texInit=1;const rs=document.documentElement.style;for(const k of['stone','sand','plank','board','paper','slate','ruled','roll']){const u=pxURL('tx:'+k,()=>texBuf(k));if(u)rs.setProperty('--tx-'+k,`url(${u})`)}}
    if(!texInit2){texInit2=1;const rs=document.documentElement.style;for(const k of['wood','drift','stone','paper','slate']){const u=pxURL('fr:'+k,()=>frameBuf(k));if(u)rs.setProperty('--fr-'+k,`url(${u})`)}}
    const th=s.cb?'th-home':['home','tower','work','kitchen','study','hero','folk','trade','chron','journal'].includes(s.tab)||s.tab==='map'?'th-home':s.tab==='shore'?'th-shore':'';document.body.classList.toggle('th-home',th==='th-home');document.body.classList.toggle('th-shore',th==='th-shore')}catch(e){}
  hideTip();const mn=$('main');const vw0=s.cb?'cb':s.tab+'|'+(s.tab==='map'?s.at:'')+'|'+(s.tab==='hero'?s.ht:s.tab==='tower'?s.tt||'':'')+localViewSuffix(),same0=vw0===lastView&&!s.cb,xs=same0?xSnap(mn):null,as0=same0?aSnap(mn):null;let tlx=null;try{const q=same0&&mn.querySelector('.chr-tl');if(q)tlx=q.scrollLeft>=q.scrollWidth-q.clientWidth-4?-1:q.scrollLeft}catch(e){}patchStage(s.cb?'':localCurrent()?localZoneScene():s.tab==='home'?homeScene():s.tab==='shore'?shoreScene():s.tab==='tower'?({work:workScene,kitchen:kitchenScene,study:studyScene}[ttCur()]||towerScene)():s.tab==='work'?workScene():s.tab==='study'?studyScene():s.tab==='map'?(s.at?locScene():mapScene()):s.tab==='hero'?heroScene():s.tab==='folk'?folkScene():s.tab==='trade'?tradeScene():'');zoomRun();mn.innerHTML=h;if(tlx!==null){try{const q=mn.querySelector('.chr-tl');if(q)q.scrollLeft=tlx<0?q.scrollWidth:tlx}catch(e){}}glossify(mn);rDlg();if(xs)xFade(mn,xs,1);if(as0)aMark(mn,as0);
  const view=s.cb?'cb':s.tab+'|'+(s.tab==='map'?s.at:'')+'|'+(s.tab==='hero'?s.ht:s.tab==='tower'?s.tt||'':'')+localViewSuffix();const prevView=lastView;if(view!==lastView&&mn.classList&&!RM()){for(const e of[mn,$('stage')]){if(!e||!e.classList)continue;e.classList.remove('tin');void e.offsetWidth;e.classList.add('tin')}}lastView=view;
  placePop();
  if(hlT){const tg=hlT;hlT=null;try{const el=document.getElementById(tg);if(el){el.scrollIntoView({block:'center',behavior:RM()?'auto':'smooth'});el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}}catch(e){}}
  if(!s.cb&&s.tab==='chron'&&view!==prevView){try{const tl=mn.querySelector('.chr-tl');if(tl)tl.scrollLeft=tl.scrollWidth}catch(e){}}
  if(view==='cb'&&prevView!=='cb'&&s.cb&&!RM()){const ci=$('cbin');if(ci&&ci.classList){const fo=s.cb.u.filter(u=>!isObj(u)).map(u=>EN[u.t].n);ci.innerHTML=`<div><b>${s.cb.title||'Бій'}</b><span>${[...new Set(fo)].join(' · ')}</span></div>`;ci.classList.remove('go');void ci.offsetWidth;ci.classList.add('go')}}
  if(s.cb&&s.cb.fx&&s.cb.fx.length){const f=s.cb.fx;s.cb.fx=[];s.cb.fxt=0;try{playFx(f)}catch(e){}}
  $('foot').innerHTML=resetAsk?`Стерти весь прогрес і почати з самого початку? ${btn('Так, стерти','resetYes')}${btn('Скасувати','resetNo')}`:`${tutIds().length?btn('Довідник','tutList','',{cls:'toggle'}):''}<details class="sett"${ftOpen?' open':''}><summary>Налаштування</summary><div class="setb">${btn(s.quickMG?'Доступність: без міні-ігор — так':'Доступність: без міні-ігор — ні','qmg','',{cls:'toggle'})}${Object.keys(MGH).filter(t=>(s.mgUn||{})[t]&&mgCan(t)).map(t=>btn(`${{flot:'Знахідки в прибої',forge:'Кування'}[t]}: ${(s.mgHab||{})[t]?'звично':'власноруч'}`,'mghab',t,{cls:'toggle'})).join('')}${btn('Почати спочатку','reset')}</div></details><span class="m">Гра зберігається автоматично.</span>`;
  dirty=0;refresh()}
let ftOpen=0,shoreListOpen=0;
function refresh(){
  document.querySelectorAll('[data-ok]').forEach(el=>{const f=B[el.dataset.ok];if(f){const d=!f();if(el.disabled!==d)el.disabled=d}});
  document.querySelectorAll('[data-v]').forEach(el=>{const f=B[el.dataset.v];if(f){const t=String(f());if(el.textContent!==t)el.textContent=t}});
  document.querySelectorAll('[data-h]').forEach(el=>{const f=B[el.dataset.h];if(f){const t=String(f());if(el.dataset.last!==t){const immediate=paintingTide&&el.closest('#stage .scbg');const xs=el.dataset.last!==undefined&&!immediate?xSnap(el):null;el.dataset.last=t;el.innerHTML=t;if(immediate)el.closest('.scbg').querySelectorAll('.xf').forEach(img=>img.remove());if(xs)xFade(el,xs,1)}}});
  document.querySelectorAll('[data-w]').forEach(el=>{const f=B[el.dataset.w];if(f)el.style.width=f()+'%'});
  const now=Date.now();
  document.querySelectorAll('[data-cd]').forEach(el=>{const left=(s.cd[el.dataset.cd]||0)-now;el.style.setProperty('--p',left>0?String(left/(+el.dataset.cs*1000)):'0')});
  {const g=dayPh();if(g!==GR){GR=g;dirty=1}const m=mlaV().toFixed(2),nt=String({n:1,d:.65,y:.3}[GR]);document.querySelectorAll('.scn').forEach(el=>{if(!el.style)return;if(el.style.getPropertyValue('--mla')!==m)el.style.setProperty('--mla',m);if(el.style.getPropertyValue('--night')!==nt)el.style.setProperty('--night',nt)})}
  rTop();rToast();animTick();if((bdg9=(bdg9+1)%4)===0)badges9()}
let bdg9=0;function badges9(){const el=$('tabs');if(!el||!el.querySelectorAll)return;el.querySelectorAll('button[data-i]').forEach(b=>{const t=b.dataset.i,n=s.tab!==t&&isNew(t);if(b.classList.contains('new')!==n)b.classList.toggle('new',n)})}
function dlgImg(m){if(!m)return'';if(m.t==='scene')return sceneImg(m.id);if(m.t==='yard')return yardImg();
  const u=m.t==='ob'?obURL(m.k,globalThis[m.f])[0]:m.t==='face'?faceURL(m.id):m.t==='icon'?icoURL(m.id):m.t==='wico'?wIco(m.id):m.t==='spr'?sprURL(m.id):m.t==='hero'?heroURL(s.eq):'';return u?`<div class="dlgface">${pimg(u,96,96,'')}</div>`:''}
let lastDlg='';
const ROM=n=>['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][n-1]||n;
function rDlg(){const q=s.dlg||[];if(!q.length)s.bellHold=0;const d=s.bellHold&&q[0]&&q[0].k!=='fight'?null:q[0],el=$('dlg');if(!d){if(lastDlg){lastDlg='';const bg=!RM()&&el.querySelector&&el.querySelector('.dlgbg');if(bg){bg.classList.add('fo');setTimeout(()=>{if(!lastDlg)el.innerHTML=''},230)}else el.innerHTML=''}return}
  const key=d.title+'|'+String(d.body||'').length+'|'+(d.btns||[]).length+'|'+(s.dlg.length>1);if(key===lastDlg){try{const q=el.querySelector('.dlgq');if(q)q.textContent=s.dlg.length>1?`Ще подій у черзі: ${s.dlg.length-1}`:''}catch(e){}return}const fi=!lastDlg&&!RM();lastDlg=key;sfx(d.chap||d.k==='lvl'?'chime':d.k==='fight'?'horn':'page');
  if(d.chap){el.innerHTML=`<div class="dlgbg chapbg${fi?' fi':''}"><div class="dlgbox chap" role="dialog" aria-modal="true" aria-labelledby="dlgt"><div class="chapno">Розділ ${ROM(d.no)} завершено</div><h2 id="dlgt">${d.sub}</h2><div class="orn" aria-hidden="true">✦ ✦ ✦</div>${dlgImg(d.img)}<div class="dlgbody">${d.body||''}</div><div class="act"><button type="button" class="main" data-a="dlgok" data-i="">Гортати далі</button>${s.dlg.length>1?'<button type="button" class="toggle" data-a="bellDefer" data-i="">Відкласти решту</button>':''}</div><p class="more dlgq">${s.dlg.length>1?`Ще подій у черзі: ${s.dlg.length-1}`:''}</p></div></div>`;
    glossify(el);try{const b=el.querySelector&&el.querySelector('button');if(b)b.focus()}catch(e){}return}
  el.innerHTML=`<div class="dlgbg${fi?' fi':''}"><div class="dlgbox k-${d.k||'info'}" role="dialog" aria-modal="true" aria-labelledby="dlgt">${dlgImg(d.img)}<div class="dlgin"><span class="tag t-${d.k||'info'}"><img class="tico" src="${tagURL(d.k==='tutorial'?'info':d.k||'info')}" alt="" width="14" height="14">${d.k==='tutorial'?'навчання':TAGN[d.k||'info']}</span><h2 id="dlgt">${d.title}</h2><div class="dlgbody">${d.body||''}</div>${d.gains&&d.gains.length?`<ul class="gains">${d.gains.map(g=>`<li>${g}</li>`).join('')}</ul>`:''}<div class="act">${(d.btns||[['Зрозуміло','dlgok']]).map(b=>`<button type="button" class="main" data-a="${b[1]}" data-i="${b[2]||''}">${b[0]}</button>`).join('')}${s.dlg.length>1&&(!d.btns||d.odd)&&d.k!=='fight'?'<button type="button" class="toggle" data-a="bellDefer" data-i="">Відкласти решту</button>':''}</div><p class="m dlgq">${s.dlg.length>1?`Ще подій у черзі: ${s.dlg.length-1}`:''}</p></div></div></div>`;
  glossify(el);try{const b=el.querySelector&&el.querySelector('button');if(b)b.focus()}catch(e){}}
let lastToast='';
/* Сповіщення — темні плашки внизу: звичайні тримаються 11 с, історія — 18 с, знахідки — 14 с, рівень — доки не закриєш ✕.
   Не більше трьох одразу; повтори зливаються в «×N»; смужка зліва й значок — за типом, тонка риска внизу — скільки лишилось. */
const TOAST_MS=11000,TOAST_PIN=new Set(['lvl']),TOAST_LONG={story:18000,find:14000};const toastMs=t=>TOAST_LONG[t]||TOAST_MS;
function toastList(now){const pin=s.log.filter(x=>x&&x.at&&TOAST_PIN.has(x.t)&&!x.cl).slice(0,1),reg=s.log.filter(x=>x&&x.at&&!x.cl&&now-x.at<toastMs(x.t)&&!pin.includes(x));
  const seen=new Set();return pin.concat(reg).sort((p,q)=>q.at-p.at).filter(x=>{const k=x.t+'|'+x.m;if(seen.has(k))return false;seen.add(k);return true}).slice(0,3).reverse()}
function rToast(){const now=Date.now(),L=toastList(now),el=$('toast');const key=L.map(x=>x.at+':'+(x.n||1)).join();if(key===lastToast)return;lastToast=key;
  if(!el.querySelector){el.innerHTML=L.map(x=>x.m).join('');return}const keep=new Set();
  for(const x of L){const id=x.m.length+'|'+x.m.slice(0,24)+'|'+x.t,pin=TOAST_PIN.has(x.t);keep.add(id);let n=[...el.children].find(c=>c.dataset.id===id);
    if(!n){n=document.createElement('div');n.className='tst t-'+x.t+(pin?' pin':'');n.setAttribute('role','status');n.dataset.id=id;
      n.innerHTML=`<img class="tico" src="${tagURL(x.t)}" alt="" width="18" height="18"><span class="ev-text">${x.m}</span><b class="tcn"></b><button type="button" class="tx" data-a="tclose" data-i="${x.at}" aria-label="Закрити">✕</button>${pin?'':'<i class="tbar"></i>'}`;el.appendChild(n)}
    n.querySelector('.tx').dataset.i=x.at;const left=Math.max(0,(toastMs(x.t)-(now-x.at))/1000-.6);n.style.setProperty('--left',left.toFixed(2)+'s');n.style.setProperty('--life',(left+.6).toFixed(2)+'s');
    n.querySelector('.tcn').textContent=x.n>1?'×'+x.n:'';if(n.dataset.n!==String(x.n||1)){n.dataset.n=String(x.n||1);n.classList.remove('out');void n.offsetWidth}if(!pin)n.classList.add('out')}
  for(const c of[...el.children])if(!keep.has(c.dataset.id))c.remove()}

