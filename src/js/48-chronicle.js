/* ============ v14: CHRONICLE ============ */
const DAYS=120;
const MON=['листопада','грудня','січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня'],MDAYS=[30,31,31,28,31,30,31,30,31,31,30,31];
const dayOf=t=>1+Math.floor((t||0)/DAYS);
function dateOf(t){let d=dayOf(t)-1,y=1,m=0;while(d>=MDAYS[m]){d-=MDAYS[m];m++;if(m===12){m=0;y++}}return{d:d+1,m,y}}
const dateShort=t=>{const q=dateOf(t);return`${q.d} ${MON[q.m]}`};
const dateTxt=t=>{const q=dateOf(t);return`${q.d} ${MON[q.m]} ${q.y}-го року по Згасанні`};
const ERA=[{n:'Доба Попелу',d:'Згаслий маяк, жарина в долонях і берег, що ледь пам’ятає людей.'},
  {n:'Доба Шхер',d:'З оглядової видно обрій: острови, селища й чужі вогні в тумані.',ch:'c2'},
  {n:'Доба Світла',d:'Великий вогонь знову горить, і Мла відступає від берега.',ch:'c7'},
  {n:'Доба Вітрил',d:'Корабель біля причалу, нові люди й дорога туди, звідки приходить Мла.',ch:'c8'},
  {n:'Нова доба',d:'Мла замовкла. Що буде далі, вирішать ті, хто береже вогонь.',ch:'c10'}];
const MK={start:'початок',beat:'подія',chap:'розділ',boss:'звитяга',people:'люди',disc:'відкриття',fac:'громади',lvl:'зростання',raid:'оборона',era:'доба'};
function mom(k,n,d,img,mj,cid){s.mom=s.mom||[];const m={t:Math.round(s.play||0),k,n,d:d||'',img:img||null,mj:mj?1:0,e:Math.max(0,(s.eraT||[0]).length-1)};if(cid)m.cid=cid;s.mom.push(m);if(s.mom.length>400)s.mom.splice(1,1);dirty=1}
function eraCheck(){s.eraT=s.eraT||[0];while(s.eraT.length<ERA.length&&s.chs.includes(ERA[s.eraT.length].ch)){const E=s.eraT.length;s.eraT.push(Math.round(s.play||0));mom('era',ERA[E].n,ERA[E].d,null,1);
  dlg({k:'story',title:`Настає ${ERA[E].n.charAt(0).toLowerCase()+ERA[E].n.slice(1)}`,body:`<p>${ERA[E].d}</p><p class="stamp">✎ ${dateTxt(s.play)}</p>`})}}
const yardSt=()=>({looked:s.f.looked,hearth:s.b.hearth,won:s.f.won,floors:Object.assign({},s.floors),b:Object.assign({},s.b),wood:s.r.wood,boat:s.f.boat,schooner:s.f.schooner,pop:s.pop||0});
function hsh(x){let h=0;for(let i=0;i<x.length;i++)h=(h*31+x.charCodeAt(i))|0;return(h>>>0).toString(36)}
function momImg(i){if(!i)return'';
  if(i.t==='scene')return pimg(sceneURL(i.id),192,80,'','');
  if(i.t==='yard'){const st=Object.assign({lk:1},i.st||yardSt()),k=hsh(JSON.stringify(st));return pimg(pxURL('cy3:'+k,()=>yardFull3(st)),192,107,'','')}
  const u=i.t==='face'?faceURL(i.id):i.t==='icon'?icoURL(i.id):i.t==='wico'?wIco(i.id):i.t==='spr'?sprURL(i.id):i.t==='hero'?heroURL(s.eq):'';return u?pimg(u,48,48,'chr-f',''):''}
function chronBackfill(){const M=[{t:0,k:'start',n:'Пробудження',d:'Ти прокидаєшся в темряві з єдиною жариною в долонях.',img:null,mj:1,e:0}],T=[],eraT=[0];let e=0;
  CH.forEach((ch,ix)=>{for(const b of ch.beats)if(s.bts&&s.bts[b[0]])T.push({k:'beat',n:b[1],d:b[3],img:null,mj:0,cid:ch.id});if(s.chs.includes(ch.id))T.push({k:'chap',n:`Розділ ${ROM(ix+1)} · ${ch.n}`,d:ch.d,img:ch.img&&ch.img.t==='yard'?{t:'yard',st:null}:ch.img,mj:1,cid:ch.id})});
  const P=s.play=Math.max(s.play||0,900,T.length*240);
  T.forEach((m,i)=>{m.t=Math.round((i+1)/(T.length+1)*P);m.ap=1;m.e=e;M.push(m);if(m.k==='chap'){const done=new Set(T.slice(0,i+1).filter(x=>x.k==='chap').map(x=>x.cid));while(eraT.length<ERA.length&&done.has(ERA[eraT.length].ch)){const E=eraT.length;eraT.push(m.t);e=E;M.push({t:m.t,k:'era',n:ERA[E].n,d:ERA[E].d,img:null,mj:1,e:E,ap:1})}}});
  s.mom=M;s.eraT=eraT}
function rChron(){const M=s.mom||[],E=s.eraT||[0],now=s.play||0,ei=E.length-1;
  let h=`<section class="chr"><div class="chr-h"><div><h2>Літопис маяка${ih(`Стрічка гортається вбік, коліщатком або пальцем. Наведи на картку, щоб прочитати запис повністю.${M.some(m=>m.ap)?' Дати зі знаком ≈ відновлено з пам’яті, тож вони приблизні.':''}`)}</h2><span class="hand">Сьогодні ${dateTxt(now)}</span></div><div class="chips"><span class="chip">день <b>${dayOf(now)}</b></span><span class="chip">${ERA[ei].n}</span><span class="chip">подій <b>${M.filter(m=>m.k!=='era').length}</b></span></div></div>`;
  h+=`<p class="hand">Записано рукою хранителя.</p>`;
  h+=`<div class="chr-tl" tabindex="0" aria-label="Стрічка часу">`;
  for(let e=0;e<=ei;e++){const ms=M.filter(m=>(m.e||0)===e&&m.k!=='era');
    const card=m=>`<div class="chr-c k-${m.k}${m.mj?' mj':''}" ${TA(`<b>${m.n}</b><br>${m.ap?'приблизно ':''}${dateTxt(m.t)}<br>${m.d}`)}><span class="chr-d">${m.ap?'≈ ':''}день ${dayOf(m.t)}</span>${m.img?`<div class="chr-i">${momImg(m.img)}</div>`:''}<span class="chr-k">${MK[m.k]||''}</span><b>${m.n}</b>${m.d?`<p>${m.d}</p>`:''}</div>`;
    h+=`<div class="chr-era e${e}"><div class="chr-eh" ${TA(`<b>${ERA[e].n}</b><br>${ERA[e].d}`)}><span class="chr-en">доба ${ROM(e+1)}</span><b>${ERA[e].n}</b><span class="m">з ${dateShort(E[e]||0)}${e===ei?' й донині':` по ${dateShort(E[e+1])}`}</span></div><div class="chr-row">${ms.map(card).join('')}${e===ei?`<div class="chr-now">сьогодні<br>день ${dayOf(now)}</div>`:''}</div></div>`}
  h+=`</div></section>`;
  const st0=CH.map((c,ix)=>ix).filter(chStarted);
  h+=`<section class="chrp"><h2>Розділи</h2><ol class="chr-chs">${st0.map(ix=>{const c=CH[ix],m=M.find(x=>x.k==='chap'&&x.cid===c.id),dn=s.chs.includes(c.id);return`<li class="e${m?m.e||0:ei}"><span class="no">${ROM(ix+1)}</span><span><b>${chName(c)}</b>${c.side?' <span class="m">· побічний</span>':''}</span><span class="when">${dn?(m?`${m.ap?'≈ ':''}день ${dayOf(m.t)}, ${dateShort(m.t)}`:'завершено'):'триває'}</span></li>`}).join('')}</ol>${s.chs.length<CH.length?'<p class="m">Що буде далі, ще не записано.</p>':''}</section>`;
  return h}

