/* ============ КІМНАТИ МАЯКА ЗБЛИЗЬКА: майстерня й кабінет ============
   Кожна кімната — жива сцена: речі на сцені відкривають картки з тими самими діями, що й списки нижче.
   Списки лишаються в «Усе списком» для тих, кому так зручніше. */
const RMW=432,RMH=240;
/* --- спільне: стіни, підлога, вікно, сходи, балки --- */
function roomBase(b,o){const W=RMW,H=RMH,kk=b.k||1;
  hiRect(b,0,0,W,200,(i,j,x,y)=>{const n=hh2(i>>1,j>>1);if(y<12)return(j%4===3)?'V':'W';if(y>=128){const p=Math.floor(x/18);return y<131?'X':(Math.floor(x)%18===0)?'x':hh2(p,j>>2)<.12?'W':'V'}
    const e=Math.min(x,W-x,y*1.6)/60;if(e<1&&(1-e)*.7>bay(i,j))return n<.3?'D':'E';return n<.08?'L':n<.2?'b':'a'});
  for(const bx of[0,96,192,288,384])prect(b,bx,0,10,14,'V');
  hiRect(b,0,200,W,40,(i,j,x,y)=>{const row=Math.floor((y-200)/6),off=row%2?17:0;return(Math.floor(y)-200)%6===5||((Math.floor(x)+off)%34===0)?'V':hh2(i>>2,row)<.15?'Y':'X'});
  prect(b,0,199,W,2,'W');
  const wx=o.win[0],wy=o.win[1],ww=o.win[2],wh=o.win[3];prect(b,wx-3,wy-3,ww+6,wh+6,'D');prect(b,wx,wy,ww,wh,'B');prect(b,wx,wy+wh*0.62,ww,wh*0.38,'R');prect(b,wx,wy+wh*0.6,ww,1,'U');prect(b,wx+ww/2-1,wy,2,wh,'D');prect(b,wx,wy+wh/2-1,ww,2,'D');prect(b,wx-4,wy+wh+2,ww+8,3,'F');prect(b,wx-4,wy+wh+2,ww+8,1,'G');
  if(GR==='n'){pset(b,wx+4,wy+5,'y');pset(b,wx+ww-6,wy+9,'6')}
  /* сходи в кутку */
  for(let i=0;i<16;i++){const sx=o.st>0?W-24-i*7:10+i*7,sy=200-(i+1)*11;if(sy<14)break;prect(b,sx,sy,18,3,'X');prect(b,sx,sy,18,1,'Y');prect(b,sx+(o.st>0?16:0),sy+3,2,8,'W')}
}
/* --- майстерня --- */
function workRoom3(st){const b=pbuf(RMW,RMH),tr=st.tr||0;roomBase(b,{win:[196,40,40,52],st:1});
  /* дошка креслень */
  prect(b,246,26,112,108,'W');prect(b,250,30,104,100,'d');pnoise(b,250,30,104,100,'c',0.2,61);prect(b,246,26,112,2,'Y');
  /* полиця з інструментами */
  prect(b,46,70,128,6,'X');prect(b,46,70,128,1,'Y');const nt=tr>=1?11:5;for(let i=0;i<nt;i++){const tx=54+i*11,ln=14+(i%3)*5;prect(b,tx,76,2,ln,i%3?'G':'H');if(i%3===0)prect(b,tx-2,76+ln-4,6,4,'F');if(i%3===1)prect(b,tx-1,76+ln-2,4,2,'W')}
  /* лампа */
  prect(b,120,0,1,34,'z');prect(b,114,34,13,5,'z');prect(b,116,39,9,3,'F');
  return b}
function wkBench3(st){const b=pbuf(160,62),tr=st.tr||0;prect(b,0,20,160,6,'Y');prect(b,0,25,160,2,'X');prect(b,4,26,6,36,'W');prect(b,150,26,6,36,'W');prect(b,8,46,144,4,'X');
  for(let i=0;i<4;i++){prect(b,18+i*30,36,20,10,i%2?'W':'X');prect(b,18+i*30,36,20,1,'Y')}
  prect(b,20,14,14,6,'G');prect(b,20,14,14,1,'H');prect(b,44,12,4,8,'F');prect(b,52,16,22,4,'X');pset(b,60,15,'g');pset(b,66,15,'g');prect(b,90,10,30,10,'O');pline(b,92,13,116,13,'L');pline(b,92,16,110,16,'L');
  const vw=tr>=3?18:11,vh=tr>=3?16:10;prect(b,160-vw-4,20-vh,vw,vh,'G');prect(b,160-vw-4,20-vh,vw,2,'H');prect(b,160-vw-10,20-vh/2,6,2,'z');return b}
function wkNote3(icon,fresh){const b=pbuf(18,24);prect(b,1,2,16,21,'O');prect(b,1,2,16,1,'u');prect(b,17,3,1,20,'b');prect(b,2,23,16,1,'b');pnoise(b,1,3,16,20,'N',0.12,icon.length*7);
  const R=ICO[icon]||ICO.crate;for(let y=0;y<12;y++)for(let x=0;x<12;x++){const c=(R[y]||'')[x]||'.';if(c!=='.')pset(b,3+x,7+y,c)}prect(b,8,0,2,3,fresh?'j':'t');pset(b,8,0,fresh?'h':'j');return b}
function wkForge3(){const b=pbuf(70,52);prect(b,0,8,34,44,'F');prect(b,0,8,34,2,'G');for(let y=10;y<52;y+=5)prect(b,0,y,34,1,'D');prect(b,6,26,22,18,'x');prect(b,8,34,18,10,'K');prect(b,10,36,14,6,'J');prect(b,13,38,8,3,'I');prect(b,12,0,10,8,'E');
  prect(b,42,36,26,5,'G');prect(b,42,36,26,1,'H');prect(b,38,37,5,3,'F');prect(b,48,41,14,5,'F');prect(b,44,46,22,6,'W');prect(b,44,46,22,1,'Y');return b}
function wkScrap3(n){const b=pbuf(34,30);prect(b,0,8,34,22,'X');prect(b,0,8,34,2,'Y');for(let x=0;x<34;x+=6)prect(b,x,10,1,20,'W');prect(b,0,18,34,1,'W');
  for(let i=0;i<Math.min(6,n);i++){prect(b,3+i*5,2+(i%2)*2,6,7,i%2?'G':'F');pset(b,4+i*5,3,'H')}return b}
function wkGrind3(){const b=pbuf(32,40);prect(b,2,20,3,20,'W');prect(b,27,20,3,20,'W');prect(b,0,32,32,3,'X');polyFill(b,Array.from({length:16},(_,a)=>[16+Math.cos(a/16*6.283)*12,18+Math.sin(a/16*6.283)*12]),(x,y)=>pset(b,x,y,(x+y)%3?'F':'G'));prect(b,15,17,3,3,'D');return b}
/* --- кабінет --- */
function studyRoom3(st){const b=pbuf(RMW,RMH),tr=st.tr||0;roomBase(b,{win:[198,36,40,56],st:-1});
  if(tr>=2){prect(b,128,16,64,38,'b');prect(b,130,18,60,34,'O');pnoise(b,130,18,60,34,'N',0.15,31);pline(b,134,44,150,32,'L');pline(b,150,32,166,38,'L');pline(b,166,38,184,26,'L');for(const[x,y]of[[142,38],[160,35],[178,30]])prect(b,x,y,2,2,'j');polyFill(b,[[134,50],[140,44],[148,50]],(x,y)=>pset(b,x,y,'S'))}
  if(tr>=3){prect(b,150,150,34,50,'t');prect(b,154,154,26,26,'v');prect(b,150,178,34,10,'v');prect(b,150,178,34,1,'w');prect(b,148,170,6,30,'t');prect(b,180,170,6,30,'t');prect(b,152,198,4,2,'V');prect(b,178,198,4,2,'V')}
  if(tr>=3){hiRect(b,150,206,170,26,(i,j,x,y)=>{const e=Math.min(x-150,320-x,y-206,232-y);return e<2?'g':e<4?'t':hh2(i>>2,j>>2)<.3?'v':'i'})}
  return b}
function stShelf3(n,tr){const w=tr>=1?100:52,b=pbuf(w,160);for(let k=0;k<(tr>=1?2:1);k++){const x0=k*50;prect(b,x0,0,48,160,'W');prect(b,x0+2,2,44,156,'V');for(let r=0;r<5;r++){const y=8+r*30;prect(b,x0+2,y+24,44,3,'X');prect(b,x0+2,y+24,44,1,'Y');
    const cnt=Math.min(9,Math.max(0,n*2-(k*5+r)*2+(tr>=1?4:0)));for(let i=0;i<cnt;i++){const bh=14+((i*7+r)%3)*3,c=['i','k','e','o','t','d','Z','3'][(i+r*3+k)%8];prect(b,x0+4+i*5,y+24-bh,4,bh,c);prect(b,x0+4+i*5,y+24-bh+2,4,1,'g')}}}return b}
function stDesk3(lit){const b=pbuf(110,62);prect(b,0,18,110,6,'X');prect(b,0,18,110,1,'Y');prect(b,4,24,6,38,'W');prect(b,100,24,6,38,'W');prect(b,10,30,40,20,'W');prect(b,10,30,40,1,'X');pset(b,30,40,'g');
  prect(b,30,10,34,8,'u');prect(b,46,10,2,8,'b');for(let i=0;i<4;i++){pline(b,33,12+i*2,44,12+i*2,'a');pline(b,50,12+i*2,61,12+i*2,'a')}prect(b,70,12,6,6,'x');pline(b,73,12,80,2,'u');pline(b,74,12,81,2,'6');
  prect(b,92,6,4,12,'u');prect(b,90,16,8,2,'G');if(lit){pset(b,93,4,'I');pset(b,94,4,'I');pset(b,93,3,'J');pset(b,94,2,'J')}else pset(b,93,5,'x');return b}
function stChest3(open){const b=pbuf(52,34);if(open){polyFill(b,[[2,10],[8,0],[50,0],[44,10]],(x,y)=>pset(b,x,y,'W'))}else{prect(b,0,6,52,8,'X');prect(b,0,6,52,2,'Y')}
  prect(b,0,14,52,20,'W');prect(b,0,14,52,1,'Y');for(const x of[6,44])prect(b,x,6,3,28,'z');prect(b,22,16,8,8,'G');for(let i=0;i<3;i++)prect(b,23+i*2,18,1,4,'H');if(open)prect(b,4,12,44,3,'x');return b}
function stNotes3(n){const b=pbuf(60,70);/* записки нижче, під картою */for(let i=0;i<Math.min(9,n);i++){const x=2+(i%3)*19,y=2+Math.floor(i/3)*22;prect(b,x,y+2,16,18,'O');prect(b,x,y+2,16,1,'u');for(let l=0;l<4;l++)prect(b,x+2,y+6+l*3,11-(l%2)*3,1,'a');pset(b,x+7,y+1,'j')}return b}
for(const f of['workRoom3','wkBench3','wkNote3','wkForge3','wkScrap3','wkGrind3','studyRoom3','stShelf3','stDesk3','stChest3','stNotes3'])globalThis[f]=HI(globalThis[f]);

/* --- сцени --- */
const NOTEXY=i=>[255+(i%5)*20,34+Math.floor(i/5)*32];
function workScene(){const tr=floorBuilt('work')?fuL('work'):0,st={tr,ph:GR},W=RMW,H=RMH;let h=`<span data-sk="bg" data-sig="bg" class="scbg">${VH(()=>pimg(pxURL('wkr3:'+tr+GR,()=>workRoom3(st)),864,480,'scene','Майстерня'))}</span>`;
  h+=ob('wk:bench','bpop','wk:bench',obURL('wkb3:'+tr,()=>wkBench3(st)),40,140,W,H,'Верстак','<b>Верстак</b><br>Тут роблять речі з креслень на дошці.',{});
  const vis=RC.filter(rcVisible);vis.slice(0,15).forEach((rc,i)=>{const ik=rc.tool?(rc.id==='rod'?'rod':rc.id==='belt1'?'belt':'pack'):rc.out,fr=!prev9['r:'+rc.id],nm=rc.tool?rc.n:IT[rc.out].n,[x,y]=NOTEXY(i);
    h+=ob('wk:r:'+rc.id,'bpop','wk:r:'+rc.id,obURL('wkn3:'+ik+(fr?1:0),()=>wkNote3(ik,fr)),x,y,W,H,nm,`<b>${nm}</b><br>Креслення. Натисни, щоб подивитися.`,{pulse:fr?1:0,always:fr?1:0})});
  if(s.b.forge&&WEAP.some(has))h+=ob('wk:forge','bpop','wk:forge',obURL('wkf3',wkForge3),214,148,W,H,'Горн і ковадло','<b>Горн і ковадло</b><br>Тут удосконалюють зброю.',{});
  const dl=Object.keys(s.inv).filter(canDism);if(dl.length)h+=ob('wk:scrap','bpop','wk:scrap',obURL('wks3:'+Math.min(6,dl.length),()=>wkScrap3(dl.length)),8,170,W,H,'Ящик для розбору','<b>Ящик для розбору</b><br>Непотрібне спорядження — на матеріали.',{});
  if(tr>=2)h+=ob('wk:grind','','',obURL('wkg3',wkGrind3),300,160,W,H,'Точильний круг','<b>Точильний круг</b><br>Гострить леза: зброя служить довше.',{});
  const L={fire:[],win:[{x:216,y:150,r:240,e:.6,c:WARM,a:.35},{x:120,y:44,r:110,e:.8,c:WARM,a:.85}]};if(s.b.forge)L.fire.push({x:231,y:186,r:80,e:.7,c:FIRE,n:4});
  return`<div class="scn rm wk" data-scn="wk" style="${scnD()}">${h}${fxCanvas('wk',W,H)}${lightLayers(W,H,L)}</div>`}
function studyScene(){const tr=floorBuilt('study')?fuL('study'):0,st={tr,ph:GR},W=RMW,H=RMH;let h=`<span data-sk="bg" data-sig="bg" class="scbg">${VH(()=>pimg(pxURL('str3:'+tr+GR,()=>studyRoom3(st)),864,480,'scene','Кабінет'))}</span>`;
  const nb=s.books.length,av=RS.filter(r=>!s.rs[r.id]&&rsReady(r)).length;
  h+=ob('st:shelf','bpop','st:shelf',obURL('sts3:'+Math.min(8,nb)+tr,()=>stShelf3(nb,tr)),22,40,W,H,'Книжкові полиці',`<b>Полиці</b><br>Книг: ${nb}. Кожна пришвидшує дослідження.`,{});
  h+=ob('st:desk','bpop','st:desk',obURL('std3',()=>stDesk3(1)),246,140,W,H,'Стіл з рукописом',`<b>Стіл Остапа</b><br>${av?'Є що дослідити.':'Записи, чорнило, свічка.'}`,{pulse:av?1:0,always:av?1:0});
  h+=ob('st:chest','bpop','st:chest',obURL('stc3:'+(s.f.chest?1:0),()=>stChest3(!!s.f.chest)),364,166,W,H,'Скриня Остапа','<b>Скриня</b><br>Кодовий замок із трьома коліщатами.',{});
  h+=ob('st:tree','bpop','st:tree',obURL('stt3:'+rsSig(),()=>treeBuf(.62)),254,22,W,H,'Дерево знань',`<b>Дерево знань</b><br>Тут видно, що вже досліджено і куди ростемо далі.`,{pulse:av?1:0,always:av?1:0});
  if(s.pages.length)h+=ob('st:notes',s.tabs.journal?'tab':'','journal',obURL('stn3:'+Math.min(9,s.pages.length),()=>stNotes3(s.pages.length)),130,60,W,H,'Записки на стіні',`<b>Записки Остапа</b><br>${s.pages.length} сторінок.${s.tabs.journal?' Натисни, щоб перечитати в журналі.':''}`,{});
  const L={fire:[{x:339,y:146,r:95,e:.8,c:WARM,n:4}],win:[{x:216,y:150,r:240,e:.6,c:WARM,a:.3},{x:216,y:70,r:40,c:PALE,a:GR==='y'?.35:.1}]};
  return`<div class="scn rm st" data-scn="st" style="${scnD()}">${h}${fxCanvas('st',W,H)}${lightLayers(W,H,L)}</div>`}

/* --- картки --- */
function roomPopHTML(id){const card=(nm,lv,body,act)=>`<div class="bpop" role="dialog" aria-label="${nm}"><div class="bph"><b>${nm}</b>${lv?`<span class="bplv">${lv}</span>`:''}<button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>${body}${act?`<div class="act">${act}</div>`:''}</div>`;
  if(id.startsWith('wk:r:')){const rc=RC.find(r=>r.id===id.slice(5));if(!rc||!rcVisible(rc))return'';const c=rcCost(rc),nm=rc.tool?rc.n:IT[rc.out].n,d=rc.tool?rc.d:itemShort(rc.out),cr=rc.craft||0;
    return card(nm,rc.multi&&has(rc.out)?'є '+s.inv[rc.out]:'',`<p class="m">${d}</p>${rc.src?`<p class="m src">${rc.src}</p>`:''}${cr?`<p class="m">${chk('craft',cr)}</p>`:''}`,`${btn('Зробити','craft',rc.id,{ok:()=>st('craft')>=cr&&afford(rcCost(rc),rc.it),cls:'main'})}<span class="ccs">${costChips(c,rc.it)}</span>`)}
  if(id==='wk:bench'){const vis=RC.filter(rcVisible);return card('Верстак',fuL('work')?'облаштовано: '+fuL('work'):'',`<p class="m">${vis.length?`Креслень на дошці: ${vis.length}. Натискай на них, щоб зробити річ.`:'Поки що нічого нового. Шукай креслення й вивчай записи.'}</p>${vis.length>15?`<div class="rlist">${vis.slice(15).map(rc=>`<div class="row"><span>${rc.tool?rc.n:IT[rc.out].n}</span>${btn('Зробити','craft',rc.id,{ok:()=>st('craft')>=(rc.craft||0)&&afford(rcCost(rc),rc.it)})}</div>`).join('')}</div>`:''}`,'')}
  if(id==='wk:forge'){const own=WEAP.filter(has);return card('Горн і ковадло','',`<p class="hand">Горн теплий. Була б тільки добра річ, щоб прикласти її до клинка.</p><div class="rlist">${own.map(w=>{const tier=wF(w),nx=WF[w][tier],rel=nx?REL[w][tier]:'',cst=nx?wfCost(tier):null,hr=rel&&has(rel),ml=nx&&wmLv(w)<WFM[tier],why=!nx?'':!hr?'бракує особливої знахідки':ml?`спершу майстерність ${WFM[tier]}`:'';
      return`<div class="row"><span>${pimg(wIco(w),20,20)} ${wN(w)}${!nx?' <span class="done">краще не буде</span>':why?` <span class="m">— ${why}</span>`:''}</span>${nx&&!why?`${btn('Удосконалити','wup',w,{ok:()=>afford(cst)})}<span class="ccs">${costChips(cst)}</span>`:''}</div>`}).join('')}</div>`,'')}
  if(id==='wk:scrap'){const dl=Object.keys(s.inv).filter(canDism);return card('Ящик для розбору','',`<p class="m">Те, що в руках, не чіпаємо.</p><div class="rlist">${dl.map(d=>{const v=dismVal(d);return v?`<div class="row"><span>${pimg(icoURL(d),20,20)} ${IT[d].n}${s.inv[d]>1?' × '+s.inv[d]:''} <span class="m">→ ${costTxt(v)}</span></span>${btn('Розібрати','dism',d)}</div>`:''}).join('')}</div>`,'')}
  if(id==='st:shelf'){return card('Полиці',`книг: ${s.books.length}`,`<p class="m">Кожна знайдена книга пришвидшує дослідження. Розум теж допомагає.</p>${s.books.length?`<p class="m">${s.books.map(b=>I('«'+BK[b]+'»')).join(', ')}.</p>`:'<p class="hand">Порожньо. Книги ще чекають у шхерах.</p>'}`,'')}
  if(id==='st:tree')return treePopHTML();
  if(id==='st:desk'){const av=RS.filter(r=>!s.rs[r.id]&&rsReady(r)&&!(r.kill&&!s.seenE[r.kill]));
    return card('Стіл Остапа','',`<p>Знання: ${V(()=>fmt(s.r.lore))}, ${V(()=>'+'+fr(rates().lore))} за секунду.</p>${btn('Дерево знань','bpop','st:tree',{cls:'toggle'})}<div class="rlist">${av.length?av.map(r=>{const c=rsCost(r);return`<div class="row"><span><b>${U(r.n)}</b><br><span class="m">${U(r.d)}</span></span>${btn('Дослідити','rs',r.id,{ok:()=>s.r.lore>=c})}<span class="ccs">${R('lore',c)}</span></div>`}).join(''):'<p class="hand">Нових тем поки немає. Вони з’являться після нових досліджень і зустрічей.</p>'}</div>`,'')}
  if(id==='st:chest'){if(s.f.chest)return card('Скриня Остапа','відчинена','<p class="m">Скриня відчинена й порожня.</p>','');
    return card('Скриня Остапа','',`<p class="m">Кодовий замок із трьома коліщатами. На кришці вирізано:</p><p class="quote">Хто вертається з моря, спершу бачить камінь, тоді небо, а засинає в гавані.</p><div class="dials">${s.chest.map((v,k)=>`<div class="dial"><b>${CHEST[v]}</b>${btn('Крутити','dial',k)}</div>`).join('')}</div>${s.chestFail>=3?`<p class="hint">Ти згадуєш, як Остап казав: «Уночі першим із туману виринає не вогонь, а чорна тінь берега».</p>`:''}`,btn('Відкрити скриню','chestTry','',{cls:'main'}))}
  return''}
/* Наближення: з кімнати в розрізі маяка — у велику сцену кімнати */
let zoomFrom=null;
function zoomPrep(tab){try{const id={work:'work',study:'study'}[tab];if(!id||s.tab!=='tower')return;const el=document.querySelector(`.scn [data-k="fl:${id}"]`),st=document.getElementById('stage');if(!el||!st)return;zoomFrom={r:el.getBoundingClientRect(),s:st.getBoundingClientRect()}}catch(e){zoomFrom=null}}
function zoomRun(){if(!zoomFrom)return;const z=zoomFrom;zoomFrom=null;try{const st=document.getElementById('stage');if(!st||!st.animate||RM())return;const n=st.getBoundingClientRect(),sc=Math.max(.15,z.r.width/n.width),dx=z.r.left-n.left,dy=z.r.top-n.top;
  st.style.transformOrigin='0 0';st.animate([{transform:`translate(${dx}px,${dy}px) scale(${sc})`,opacity:.35},{transform:'none',opacity:1}],{duration:480,easing:'cubic-bezier(.2,.7,.3,1)'})}catch(e){}}

/* ===== Дерево знань: дослідження ростуть гілками; видно лише те, що вже відкрилося ===== */
const RSXY={currents:[40,98],herbal:[62,106],render:[82,94],metal:[112,98],order:[24,72],signals:[50,66],tactics:[98,70],mech:[124,64],optics:[116,40],beacon:[100,14],
  a_crab:[150,106],a_gull:[168,88],a_eel:[188,98],a_silent:[146,68],weak:[154,42],a_fog:[184,60],a_shark:[176,34],a_stone:[194,78]};
const RS_T=[100,100],RS_B=[140,96];
function rsVis(r){return!!s.rs[r.id]||rsReady(r)||((r.r||[]).every(q=>s.rs[q])&&(!r.kill||!!s.seenE[r.kill]))}
function rsSt(r){return s.rs[r.id]?'done':rsReady(r)&&!(r.kill&&!s.seenE[r.kill])?'avail':'lock'}
function rsPos(r,i){return RSXY[r.id]||[20+(i*37)%160,110-r.t*24]}
const rsSig=()=>RS.filter(rsVis).map(r=>r.id[0]+r.id.slice(-2)+rsSt(r)[0]).join('');
function treeBuf(sc){const W=Math.round(200*sc),H=Math.round(130*sc),b=pbuf(W,H),P=([x,y])=>[x*sc,y*sc];
  if(sc>=1)b.ng=1;prect(b,0,0,W,H,sc<1?'N':'O');pnoise(b,0,0,W,H,sc<1?'M':'N',0.14,41);pnoise(b,0,0,W,H,'b',0.05,42);prect(b,0,0,W,1,'b');prect(b,0,H-1,W,1,'b');prect(b,0,0,1,H,'b');prect(b,W-1,0,1,H,'b');
  const vis=RS.filter(rsVis),anyK=vis.some(r=>r.kill),ink=(a,c,col)=>{const[x0,y0]=P(a),[x1,y1]=P(c);pline(b,x0,y0,x1,y1,col)};
  /* стовбур і коріння */
  const[tx,ty]=P(RS_T);prect(b,tx-2*sc,ty,4*sc,H-ty,'d');for(const dx of[-14,-6,6,14])pline(b,tx,H-3,tx+dx*sc,H-1,'d');if(anyK)ink([100,112],RS_B,'d');
  vis.forEach((r,i)=>{const p=rsPos(r,i),par=(r.r&&r.r.length)?r.r.map(q=>RS.find(x=>x.id===q)):[null];for(const q of par){const a=q?rsPos(q,RS.indexOf(q)):r.kill?RS_B:RS_T;ink(a,p,s.rs[r.id]?'d':'a');if(s.rs[r.id]){const[x0,y0]=P(a),[x1,y1]=P(p);for(let k=1;k<4;k++){const u=k/4,lx=x0+(x1-x0)*u,ly=y0+(y1-y0)*u;pset(b,lx+1,ly-1,k%2?'k':'l');pset(b,lx-1,ly+1,'l')}}}});
  vis.forEach((r,i)=>{const[x,y]=P(rsPos(r,i)),st=rsSt(r),R=Math.max(2,3*sc);polyFill(b,Array.from({length:10},(_,a)=>[x+Math.cos(a/10*6.283)*R,y+Math.sin(a/10*6.283)*R]),(px,py)=>{const d=Math.hypot(EXX/SK-x,EXY/SK-y)/R;pset(b,px,py,st==='done'?(d<.45?'h':d<.8?'g':'d'):st==='avail'?(d<.5?'O':d<.85?'j':'t'):(d<.7?'O':'a'))})});
  return b}
treeBuf=HI(treeBuf);
function treePopHTML(){const vis=RS.filter(rsVis),sel=RS.find(r=>r.id===s.rsSel&&rsVis(r))||vis.find(r=>rsSt(r)==='avail')||vis[0];let nodes='';
  vis.forEach(r=>{const[x,y]=rsPos(r,RS.indexOf(r)),st=rsSt(r);nodes+=`<button type="button" class="tn2 ${st}${sel&&sel.id===r.id?' on':''}" style="left:${x/2}%;top:${y/1.3}%" data-a="rsel" data-i="${r.id}" aria-label="${U(r.n)}"><span class="tl">${U(r.n)}</span></button>`});
  let det='';if(sel){const st=rsSt(sel),c=rsCost(sel),why=[...(sel.r||[]).filter(q=>!s.rs[q]).map(q=>'спершу «'+U(RS.find(x=>x.id===q).n)+'»'),...(sel.kill&&!s.kills[sel.kill]?['перемогти: '+EN[sel.kill].n.toLowerCase()]:[])];
    det=`<div class="tdet2"><b>${U(sel.n)}</b>${sel.kill?' <span class="abtag">вивчення</span>':''}<p class="m">${U(sel.d)}</p>${st==='done'?`<p class="hand">${sel.rep?U(sel.rep):'Досліджено.'}</p>`:st==='avail'?rdHTML(sel):`<p class="m">Потрібно: ${why.join('; ')}.</p>`}</div>`}
  return`<div class="bpop wide" role="dialog" aria-label="Дерево знань"><div class="bph"><b>Дерево знань</b><span class="bplv">знання: ${V(()=>fmt(s.r.lore))}</span><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>
    <div class="tree2">${pimg(pxURL('rtree:1:'+rsSig(),()=>treeBuf(1)),600,390,'','Дерево знань')}${nodes}</div>${det}</div>`}
