/* ============ v17: LIVING SCENES ============ */
const PCT=(x,y,w,h,W,H)=>`left:${(x/W*100).toFixed(2)}%;top:${(y/H*100).toFixed(2)}%;width:${(w/W*100).toFixed(2)}%;height:${(h/H*100).toFixed(2)}%`;
function hs(k,a,i,box,lab,tip,o={}){const pulse=o.pulse&&(o.always||!(s.hsU||{})[k]);
  return`<button type="button" class="hs${pulse?' pulse':''}${o.ok===false?' no':''}" data-a="${a}" data-i="${i||''}" data-k="${k}"${o.cd?` data-cd="${o.cd}" data-cs="${o.cs}"`:''} style="${box}" aria-label="${lab}" ${TA(tip||`<b>${lab}</b>`)}><span class="hsl">${lab}</span>${o.inner||''}</button>`}
const OBC={};
function obURL(key,make){const u=pxURL('ob:'+key,make);const o=pxURL('obo:'+key,()=>{const b=make();return outline2(b,'I')});const k='ob:'+key;if(!OBC[k]){const b=make();OBC[k]=[b.w,b.h]}return[u,o,OBC[k][0],OBC[k][1]]}
function topPx(key,make){const c='tp:'+key;if(OBC[c])return OBC[c];const b=make();for(let y=0;y<b.h;y++)for(let x=0;x<b.w;x++)if(b.p[y*b.w+x]!=='.')return OBC[c]=[x,y];return OBC[c]=[b.w>>1,0]}
const pOf=k=>{const l=(s.cd[k]||0)-Date.now();return l>0?l/((CDS[k]||1)*1000):0};const CDS={gather:1,scrapw:2,fishing:3,blow:2};
function ob(k,a,i,spec,x,y,W,H,lab,tip,o={}){const[u,ol,w,h]=spec;if(!u)return'';const pulse=o.pulse&&(o.always||!(s.hsU||{})[k]);
  const box=PCT(x-1,y-1,w+2,h+2,W,H),inn=`left:${(100/(w+2)).toFixed(3)}%;top:${(100/(h+2)).toFixed(3)}%;width:${(w/(w+2)*100).toFixed(3)}%;height:${(h/(h+2)*100).toFixed(3)}%`;
  const deco=!a;const gl=!deco&&(pulse||o.cd)?`<span class="gl" style="${inn};-webkit-mask-image:url(${u});mask-image:url(${u})"></span>`:'';
  const body=`<span class="obw"><span class="obj ${o.idle||''}">${deco?'':`<img class="obo" src="${ol}" alt="">`}<img class="obi" src="${u}" alt="" style="${inn}">${gl}</span></span>`;
  const z=10+Math.round(o.z!=null?o.z:y+h);
  if(deco)return`<span class="ob deco${o.cls?' '+o.cls:''}" data-sk="${k}" data-sig="${hsh(u+box+(o.cls||''))}" style="${box};z-index:${z}" aria-hidden="true">${body}${o.inner||''}</span>`;
  const core=`class="ob${pulse?' nw':''}${o.ok===false?' no':''}${o.cls?' '+o.cls:''}" data-a="${a}" data-i="${i||''}" data-k="${k}"${o.cd?` data-cd="${o.cd}" data-cs="${o.cs}"`:''} aria-label="${lab}" ${TA(tip||`<b>${lab}</b>`)}>${body}<span class="hsl">${lab}</span>${o.inner||''}`;
  return`<button type="button" data-sk="${k}" data-sig="${hsh(core+box)}" style="${box};z-index:${z}${o.cd?`;--p:${pOf(o.cd).toFixed(3)}`:''}" ${core}</button>`}
function innerAt(px,py,pw,ph,w,h,cls,extra){return`<i class="${cls}" style="left:${((px+1)/(w+2)*100).toFixed(2)}%;top:${((py+1)/(h+2)*100).toFixed(2)}%;width:${(pw/(w+2)*100).toFixed(2)}%;height:${(ph/(h+2)*100).toFixed(2)}%;${extra||''}" aria-hidden="true"></i>`}
function smkIn(sx,sy,w,h){return[0,1,2].map(n=>`<i class="smk" style="left:${((sx+1)/(w+2)*100).toFixed(2)}%;top:${((sy+1)/(h+2)*100).toFixed(2)}%;width:${(3/(w+2)*100).toFixed(2)}%;--o:${n}s" aria-hidden="true"></i>`).join('')}
let popB='',upT={};
const flameURL=()=>pxURL('flm3:1',flame3Strip),fogURL=k=>pxURL('fog3:'+k,()=>fogBuf3(k));
const fogs=(top,h)=>`<span class="scf" data-sk="fog" data-sig="fog${top}" aria-hidden="true"><i class="fog" style="top:${top}%;height:${h}%;background-image:url(${fogURL(3)})"></i><i class="fog f2" style="top:${top+h*0.35}%;height:${h*0.8}%;background-image:url(${fogURL(8)})"></i></span>`;
function smk(x,y,W,H){return[0,1,2].map(n=>`<i class="smk" style="left:${(x/W*100).toFixed(2)}%;top:${(y/H*100).toFixed(2)}%;--o:${n}s" aria-hidden="true"></i>`).join('')}
function bpopHTML(){const id=popB;if(!id)return'';let nm,lvl,d,btns='',extra='';
  if(id==='hearth'){const n=s.b.hearth||0,c=bCost(HEARTH);nm='Вогнище';lvl=n;d=`+${2*n} жару/с, спалює ${fr(0.12*n)} плавника/с.`;
    btns=`${btn('Підкинути дров','bld','hearth',{ok:()=>afford(c),cls:'main'})}<span class="ccs">${costChips(c)}</span>${btn(s.on.hearth===false?'Розпалити':'Пригасити','tog','hearth',{cls:'toggle'})}`}
  else{const b=BD.find(x=>x.id===id);if(!b)return'';const n=s.b[id]||0,w=(s.wk||{})[id]||0,mx=b.max&&n>=b.max,dm=(s.dmgB||{})[id];nm=b.n;lvl=n;d=typeof b.d==='function'?b.d():b.d||'';
    if(dm){const rc=repCost(b);extra+=`<p class="foe">Мла зламала будівлю. Поки її не полагодиш, вона не працює.</p>`;btns+=`${btn('Полагодити','repair',id,{ok:()=>afford(rc),cls:'main'})}<span class="ccs">${costChips(rc)}</span>`}
    else{if(s.f.people&&n&&WKB.includes(id))extra+=`<div class="bpw">${mstOf(id)?'<span class="chip">майстер ×2</span> ':''}робітники <b>${w}</b> з ${n} ${btn('−','wk-',id,{cls:'toggle',ok:w>0,lab:'Зняти робітника'})}${btn('+','wk+',id,{cls:'toggle',ok:()=>freeW()>0&&w<n,lab:'Додати робітника'})}</div>`;
      if(b.conv&&n)btns+=btn(s.on[id]===false?'Увімкнути':'Вимкнути','tog',id,{cls:'toggle'});
      btns+=mx?'<span class="done">збудовано</span>':`${btn(n?'Покращити':'Збудувати','bld',id,{ok:()=>afford(bCost(b)),cls:'main'})}<span class="ccs">${costChips(bCost(b))}</span>`;
      if(n&&n<5&&!b.max)extra+=`<p class="hand bph2">${n<3?'Ще трохи роботи — і будівля помітно розростеться.':'Ще кілька рівнів — і вона стане справжньою окрасою двору.'}</p>`}}
  const html=`<div class="bpop" role="dialog" aria-label="${nm}"><div class="bph"><b>${nm}</b>${lvl?`<span class="bplv">рівень ${lvl}</span>`:'<span class="bplv">ще не збудовано</span>'}<button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div><p class="m">${d}</p>${extra}<div class="act">${btns}</div></div>`;
  return html}
function placePop(){try{let L=document.getElementById('popl');if(!popB||s.cb||s.tab!=='home'){if(L&&L.innerHTML){L.innerHTML='';L.dataset.sig=''}return}
  if(!L){L=document.createElement('div');L.id='popl';document.body.appendChild(L)}
  const el=document.querySelector(popB==='hearth'?'.scn [data-k="hearth"]':`.scn [data-k="b:${popB}"],.scn [data-k^="b:${popB}"]`);if(!el){L.innerHTML='';return}
  const html=bpopHTML(),sg=hsh(html);if(L.dataset.sig!==sg){L.innerHTML=html;L.dataset.sig=sg}const c=L.firstElementChild;if(!c)return;
  if(innerWidth<=560||(window.matchMedia&&matchMedia('(max-width:560px)').matches)){c.classList.add('sheet');return}c.classList.remove('sheet');
  const r=el.getBoundingClientRect(),cw=c.offsetWidth,ch=c.offsetHeight;let x=r.left+r.width/2+scrollX-cw/2;x=Math.max(8,Math.min(x,document.documentElement.clientWidth-cw-8));
  let y=r.top+scrollY-ch-8;if(r.top-ch-8<80)y=r.bottom+scrollY+8;c.style.left=x+'px';c.style.top=y+'px'}catch(e){}}
function homeHS(){const W=YW,H=YH;let h='';const st=yardSt2();
  if(!s.f.looked){const e=obURL('ember3',emberObj3);h+=ob('ember','blow','',e,84,206,W,H,'Подмухати на жарину','<b>Жарина</b><br>Подмухай, і вона спалахне яскравіше: +3 жару.',{pulse:1,cd:'blow',cs:2,inner:'<i class="emb"></i>'});
    if(s.f.lk)h+=ob('look','look','',obURL('tsil3',()=>towerSil3(st)),18,8,W,H,'Роззирнутися','<b>Роззирнутися</b><br>Очі звикли до темряви. У ній проступають обриси стін і сходів.',{pulse:1});return h}
  h+=fogs(42,14);
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
  const hx=124,hy=206;
  if(!s.b.hearth){const c=bCost(HEARTH),ok=s.seen.wood&&afford(c);const sp=obURL('hearth3a',()=>hearthObj3({}));
    h+=ok?ob('hearth0','bld','hearth',sp,hx,hy,W,H,'Скласти вогнище',`<b>Скласти вогнище</b><br>${costTxt(c)}`,{pulse:1,always:1,inner:'<i class="emb"></i>'})
      :ob('ember2','blow','',sp,hx,hy,W,H,'Подмухати на жарину',`<b>Жарина</b><br>Подмухай: +3 жару.${s.seen.wood?`<br>Для вогнища треба ${costTxt(c)}.`:''}`,{pulse:1,cd:'blow',cs:2,inner:'<i class="emb"></i>'})}
  else{const n=s.b.hearth,lit=s.on.hearth!==false,sp=obURL('hearth3b',()=>hearthObj3({hearth:1})),[,,hw,hh]=sp;
    if(lit)h+=`<i class="fglow" data-sk="fglow" data-sig="1" style="${PCT(hx-50,hy-56,138,100,W,H)}" aria-hidden="true"></i>`;
    const fl=lit?innerAt(10,-22,18,27,hw,hh,'flm'+(n>=4?' big':''),`background-image:url(${flameURL()})`):'';
    h+=ob('hearth','bpop','hearth',sp,hx,hy,W,H,'Вогнище',`<b>Вогнище, рівень ${n}</b><br>Натисни, щоб підкинути дров чи пригасити.`,{inner:fl+(upT.hearth&&Date.now()-upT.hearth<1600?`<i class="upfx" aria-hidden="true"><b>Рівень ${n}</b></i>`:''),cls:popB==='hearth'?'sel':''})}
  if(s.tabs.shore)h+=ob('toshore','tab','shore',obURL('sign3',signObj3),196,196,W,H,'До берега','<b>Стежка до берега</b><br>Плавник, уламки й риба.',{pulse:1});
  return h}
function shoreHS(){const W=SW,H=SH,S=(x,y,w,h)=>PCT(x,y,w,h,W,H);let h=fogs(8,22);
  h+=ob('home','tab','home',obURL('door3',doorObj3),6,51,W,H,'До маяка','<b>Двері маяка</b><br>Назад, до вогнища.');
  if(s.ship)h+=ob('ship','hsgo','ship',obURL('ship3',shipObj3),168,0,W,H,'Торговий когг','<b>Торговий когг</b><br>Подивитися обміни.',{pulse:1,always:1,idle:'i-bob'});
  if(s.f.boat)h+=ob('pier','hsgo','pier',obURL('pier3'+((s.exp||[]).length?'o':''),()=>pierObj3({boatOut:!!(s.exp||[]).length})),231,48,W,H,'Пристань','<b>Пристань</b><br>Виходи в море й кораблі.');
  if(s.f.wreck)h+=ob('wreck','scrapw','',obURL('wreck3',wreckObj3),186,69,W,H,'Розбирати уламки','<b>Уламки човна</b><br>Цвяхи, скоби, обшивка: усе згодиться.',{pulse:1,cd:'scrapw',cs:2,inner:'<i class="spk"></i>'});
  if(s.f.rod)h+=ob('rod','fishing','',obURL('rod3',rodObj3),162,45,W,H,'Рибалити','<b>Вудка</b><br>Закинь і чекай, поки клюне.',{pulse:1,cd:'fishing',cs:3,idle:'i-sway',inner:'<i class="bob"></i><i class="bang">!</i>'});
  if(s.flot)h+=ob('flot:'+s.flot.k,'flotmg','',obURL('flot3:'+s.flot.k,()=>flotObj3(s.flot.k)),126,78,W,H,'Оглянути знахідку','<b>Прибій щось викинув</b><br>Підчепи гаком, поки хвилі не забрали.',{pulse:1,always:1,idle:'i-bob'});
  const[lu,lo,lw,lh]=obURL('log3',log3Buf),pul=!(s.hsU||{}).gather,zx=33,zy=60,zw=66,zh=33,rx=26,ry=19;
  const zcore=`class="hs zone${pul?' nw':''}" data-a="gather" data-i="" data-k="gather" data-cd="gather" data-cs="1" aria-label="Збирати плавник" ${TA('<b>Прибій</b><br>Хвилі підкочують плавник. Підбери, що винесло.')}><span class="dlw" style="left:${(rx/zw*100).toFixed(2)}%;top:${(ry/zh*100).toFixed(2)}%;width:${((lw+2)/zw*100).toFixed(2)}%;height:${((lh+2)/zh*100).toFixed(2)}%"><img class="obo" src="${lo}" alt=""><img class="obi" src="${lu}" alt="" style="left:${(100/(lw+2)).toFixed(2)}%;top:${(100/(lh+2)).toFixed(2)}%;width:${(lw/(lw+2)*100).toFixed(2)}%;height:${(lh/(lh+2)*100).toFixed(2)}%"><span class="gl" style="left:${(100/(lw+2)).toFixed(2)}%;top:${(100/(lh+2)).toFixed(2)}%;width:${(lw/(lw+2)*100).toFixed(2)}%;height:${(lh/(lh+2)*100).toFixed(2)}%;-webkit-mask-image:url(${lu});mask-image:url(${lu})"></span></span><span class="hsl">Збирати плавник</span>`;
  h+=`<button type="button" data-sk="gather" data-sig="${hsh(zcore)}" style="${S(zx,zy,zw,zh)};z-index:${10+zy+zh};--p:${pOf('gather').toFixed(3)}" ${zcore}</button>`;
  return h}
function keepScene(mn,old){try{const nw=mn.querySelector('.scn[data-scn]');if(!nw||nw.dataset.scn!==old.dataset.scn)return;const om={};for(const c of[...old.children])if(c.dataset&&c.dataset.sk)om[c.dataset.sk]=c;
  const out=[];for(const c of[...nw.children]){const k=c.dataset&&c.dataset.sk,o=k&&om[k];if(o&&o.dataset.sig===c.dataset.sig){if(k==='bg'){const nh=c.querySelector('[data-h]'),oh=o.querySelector('[data-h]');if(nh&&oh)oh.dataset.h=nh.dataset.h}out.push(o)}else out.push(c)}
  old.replaceChildren(...out);nw.replaceWith(old)}catch(e){}}
function hsPop(el,e,r0){try{const out=[];for(const k in s.r){const d=(s.r[k]||0)-(r0[k]||0);if(d>0.001)out.push([k,d])}if(!out.length)return;
  const box=el.getBoundingClientRect(),x=box.left+box.width/2+scrollX,y=box.top+scrollY-4;
  out.slice(0,2).forEach(([k,d],ix)=>{const p=document.createElement('div');p.className='fpop';p.style.left=x+'px';p.style.top=(y-ix*18)+'px';p.innerHTML=`${pimg(icoURL(k),16,16,'')}+${fmt(d)}`;document.body.appendChild(p);setTimeout(()=>p.remove(),1150)})}catch(err){}}

