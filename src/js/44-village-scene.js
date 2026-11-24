/* ============ ГРОМАДИ й ТОРГ ============
   Громади — дошка оголошень на Причалі: прапори громад піднімаються з довірою, прохання пришпилені записками.
   Торг — крамниця Яреми: товари на полицях, ваги на прилавку для продажу. */
const VLW=432,VLH=240;
const FACC=['j','S','g','o','l','e'],FACXY=[[64,104],[110,94],[322,94],[368,104],[30,140],[396,140]];
function villageBg3(){const W=VLW,H=VLH,b=pbuf(W,H),ph=GR;rampV(b,0,0,W,120,ph==='y'?['4','5','5','6']:ph==='d'?['C','o','3','4']:['A','B','C','1']);
  if(ph!=='y'){const R=rng(77);for(let i=0;i<120;i++)phx(b,Math.floor(R()*W*SK),Math.floor(R()*90*SK),R()<.1?'y':'5')}
  rampV(b,0,110,W,40,['3','R','Q']);
  /* хати на палях — силуети */
  for(const[x,w,hh]of[[10,52,34],[300,64,40],[372,50,30]]){prect(b,x,96-hh,w,hh,'W');polyFill(b,[[x-4,96-hh],[x+w/2,82-hh],[x+w+4,96-hh]],(px,py)=>pset(b,px,py,'V'));prect(b,x+w/2-4,96-12,8,12,'x');prect(b,x+8,96-hh+8,6,6,'K');for(let p=x+4;p<x+w;p+=12)prect(b,p,96,3,24,'V')}
  /* настил */
  hiRect(b,0,150,W,90,(i,j,x,y)=>{const r=Math.floor((y-150)/7);return(Math.floor(y)-150)%7===6?'V':hh2(i>>3,r)<.12?'Y':'X'});
  /* дошка оголошень */
  prect(b,150,92,6,108,'V');prect(b,276,92,6,108,'V');prect(b,146,100,140,74,'W');prect(b,150,104,132,66,'d');pnoise(b,150,104,132,66,'c',0.2,81);
  polyFill(b,[[138,100],[216,78],[294,100]],(x,y)=>pset(b,x,y,(x+y)%4?'V':'W'));prect(b,138,99,156,2,'Y');
  return b}
function facBanner3(ci,lift){const b=pbuf(22,70);prect(b,2,0,2,70,'V');prect(b,1,0,4,2,'g');const y0=4+Math.round((1-lift)*34);
  polyFill(b,[[4,y0],[21,y0+3],[17,y0+10],[21,y0+17],[4,y0+20]],(x,y)=>pset(b,x,y,(EXX+EXY)%7?FACC[ci]:'u'));prect(b,4,y0,1,20,'x');return b}
function facNote3(ci){const b=pbuf(22,26);prect(b,1,3,20,22,'O');prect(b,1,3,20,1,'u');pnoise(b,1,4,20,21,'N',0.12,ci*9+3);for(let l=0;l<4;l++)prect(b,4,9+l*4,14-(l%2)*5,1,'a');polyFill(b,Array.from({length:8},(_,a)=>[11+Math.cos(a/8*6.283)*3.5,4+Math.sin(a/8*6.283)*3.5]),(x,y)=>pset(b,x,y,FACC[ci]));return b}
function shopBg3(){const b=pbuf(VLW,VLH);roomBase(b,{win:[30,40,36,50],st:1});
  for(let r=0;r<3;r++){const y=48+r*38;prect(b,96,y,240,4,'X');prect(b,96,y,240,1,'Y');prect(b,100,y+4,4,8,'W');prect(b,328,y+4,4,8,'W')}
  /* віконце в комору, звідки визирає Ярема */
  prect(b,178,88,72,64,'W');prect(b,182,92,64,58,'x');prect(b,178,88,72,2,'Y');
  /* прилавок */
  prect(b,60,150,312,10,'Y');prect(b,60,159,312,2,'X');hiRect(b,62,161,308,39,(i,j,x,y)=>(Math.floor(x)%24===0?'V':hh2(i>>3,j>>3)<.15?'X':'W'));
  prect(b,330,140,30,10,'G');prect(b,332,142,26,6,'g');prect(b,338,136,14,4,'e');
  return b}
function shopItem3(ic){const b=pbuf(16,16);b.ng=0;const R=ICO[ic]||ICO.crate;for(let y=0;y<12;y++)for(let x=0;x<12;x++){const c=(R[y]||'')[x]||'.';if(c!=='.')pset(b,2+x,4+y,c)}return b}
function shopScale3(){const b=pbuf(40,34);prect(b,18,6,4,26,'e');prect(b,12,30,16,4,'d');pline(b,2,8,38,8,'e');for(const x of[2,30]){pline(b,x+4,8,x,20,'b');pline(b,x+4,8,x+8,20,'b');prect(b,x-2,20,12,3,'g')}prect(b,30,16,6,4,'g');return b}
for(const f of['villageBg3','facBanner3','facNote3','shopBg3','shopItem3','shopScale3'])globalThis[f]=HI(globalThis[f]);

function folkScene(){const W=VLW,H=VLH;let h=`<span data-sk="bg" data-sig="bg" class="scbg">${VH(()=>pimg(pxURL('vlg4:'+GR,villageBg3),864,480,'scene','Причал'))}</span>`;
  const fs=Object.keys(FAC).filter(f=>FAC[f].known());let qi=0;
  fs.forEach((f,i)=>{const F=FAC[f],v=fac(f),lift=Math.round((v+100)/200*8)/8,[x,y]=FACXY[i%FACXY.length],q=(s.req||{})[f],ci=Object.keys(FAC).indexOf(f)%FACC.length;
    h+=ob('fk:f:'+f,'bpop','fk:f:'+f,obURL('fkb3:'+ci+':'+lift,()=>facBanner3(ci,lift)),x,y,W,H,F.n,`<b>${F.n}</b><br>${RANKS[rankI(v)][1]}, довіра ${v}.`,{cls:'fkb',inner:`<img class="fkface" src="${faceURL(F.face)}" alt=""><span class="mpl">${F.n}</span>`});
    if(q){const nx=156+(qi%5)*25,ny=108+Math.floor(qi/5)*30;qi++;h+=ob('fk:q:'+f,'bpop','fk:q:'+f,obURL('fkn3:'+ci,()=>facNote3(ci)),nx,ny,W,H,'Прохання: '+q.n,`<b>${q.n}</b><br>Від громади «${F.n}».`,{pulse:prev9['fq:'+f+q.n]?0:1,always:prev9['fq:'+f+q.n]?0:1})}});
  const L={fire:[],win:[{x:216,y:140,r:120,e:.8,c:WARM,a:.55},{x:20,y:84,r:26,c:WARM,a:.6},{x:316,y:72,r:26,c:WARM,a:.6}]};
  return`<div class="scn rm vl" data-scn="vl" style="${scnD()}">${h}${fxCanvas('vl',W,H)}${lightLayers(W,H,L)}</div>`}
function tradeScene(){const W=VLW,H=VLH;let h=`<span data-sk="bg" data-sig="bg" class="scbg">${VH(()=>pimg(pxURL('shp4:'+GR,shopBg3),864,480,'scene','Крамниця Яреми'))}</span>`;
  h+=`<img class="trface" data-sk="face" data-sig="1" src="${faceURL('yarema')}" alt="Ярема" style="${PCT(190,96,48,48,W,H)}">`;
  const its=SHOP.filter(it=>!it.show||it.show());its.slice(0,18).forEach((it,i)=>{const ik=IT[it.id]?it.id:(it.res?Object.keys(it.res)[0]:it.book?'lore':'crate'),x=106+(i%6)*38,y=30+Math.floor(i/6)*38,fr=!prev9['t:'+it.id];
    h+=ob('tr:b:'+it.id,'bpop','tr:b:'+it.id,obURL('tri3:'+ik,()=>shopItem3(ik)),x,y,W,H,it.n,`<b>${it.n}</b><br>${R('coin',price(it.p))}`,{pulse:fr?1:0,always:fr?1:0})});
  h+=ob('tr:sell','bpop','tr:sell',obURL('trs3',shopScale3),326,114,W,H,'Ваги: продати','<b>Ваги</b><br>Продати Яремі зайве.',{});
  h+=`<div class="trcoin" data-sk="coin" data-sig="1" style="${PCT(70,166,120,16,W,H)}">${pimg(icoURL('coin'),16,16)} ${V(()=>fmt(s.r.coin))}</div>`;
  const L={fire:[],win:[{x:216,y:60,r:200,e:.7,c:WARM,a:.55}]};
  return`<div class="scn rm tr" data-scn="tr" style="${scnD()}">${h}${fxCanvas('tr',W,H)}${lightLayers(W,H,L)}</div>`}
function villagePopHTML(id){const card=(nm,lv,body,act)=>`<div class="bpop" role="dialog" aria-label="${nm}"><div class="bph"><b>${nm}</b>${lv?`<span class="bplv">${lv}</span>`:''}<button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>${body}${act?`<div class="act">${act}</div>`:''}</div>`;
  if(id.startsWith('fk:f:')){const f=id.slice(5),F=FAC[f];if(!F)return'';const v=fac(f),ri=rankI(v);
    return card(F.n,RANKS[ri][1],`<div class="tbar" aria-hidden="true"><span class="zero"></span><span class="mk" style="left:${(v+100)/2}%"></span></div><p class="m">довіра ${v}. ${F.d}</p><ul class="perks">${F.perks.map(p=>{const on=p[0]>=0?v>=p[0]:v<=p[0];return`<li class="${on?'':'lk'}">${p[0]>=0?`від ${p[0]}: `:''}${p[1]}${on?' ✓':''}</li>`}).join('')}</ul>`,(s.req||{})[f]?btn('Прохання на дошці','bpop','fk:q:'+f,{cls:'toggle'}):'')}
  if(id.startsWith('fk:q:')){const f=id.slice(5),q=(s.req||{})[f];if(!q)return card(FAC[f].n,'','<p class="m">Зараз прохань немає. Загляни пізніше.</p>','');
    return card('Прохання: '+q.n,FAC[f].n,`<p class="m">Віддати ${costTxt(q.give)} → ${costTxt(q.rew)} і довіра +6${q.side?`, але ${q.side.map(([g,n])=>`${FAC[g].n} ${n}`).join(', ')}`:''}.</p>`,btn('Виконати','freq',f,{ok:()=>afford(q.give),cls:'main'})+btn('Відмовитися','fdecl',f,{cls:'toggle'}))}
  if(id.startsWith('tr:b:')){const it=SHOP.find(x=>x.id===id.slice(5));if(!it)return'';const p=price(it.p);return card(it.n,'',`<p class="m">${IT[it.id]?itemShort(it.id):it.d||''}</p>`,`${btn('Купити','buy',it.id,{ok:()=>s.r.coin>=p,cls:'main'})}<span class="ccs">${R('coin',p)}</span>`)}
  if(id==='tr:sell'){const rows=SELL.filter(it=>!(it.r&&!s.seen[Object.keys(it.r)[0]])&&!(it.it&&!has(Object.keys(it.it)[0])));
    return card('Продати','',`<div class="rlist">${rows.length?rows.map(it=>`<div class="row"><span>${it.n}</span>${btn('Продати','sell',it.id,{ok:()=>afford(it.r,it.it)})}<span class="ccs">+${R('coin',sellG(it.g))}</span></div>`).join(''):'<p class="m">Нема чого продати.</p>'}</div>`,'')}
  return''}
