/* ============ МАПА: морська карта на пергаменті ============
   Стара піксельна мапа (mapBuf, 160×108) — маска суші й деталей; поверх неї малюємо карту чорнилом:
   пергамент, штрихування моря, обведені береги, обмілини, румби, троянда вітрів. Нерозвідане ховається під вугільним туманом.
   Місця — позначки-об'єкти з картками; маяк — далекогляд і сигнальне вогнище. */
const MPW=432,MPH=292,MPK=MPW/160;
const MPSEA='234';
function mapChart3(st){const o=PK;PK=1;const base=mapBuf(st);PK=o;const BW=base.w,BH=base.h,gp=(x,y)=>base.p[Math.max(0,Math.min(BH-1,y))*BW+Math.max(0,Math.min(BW-1,x))];
  const land=new Float32Array(BW*BH);for(let i=0;i<BW*BH;i++){const c=base.p[i];land[i]=MPSEA.includes(c)?0:1}
  const lv=(u,v)=>{const x0=Math.floor(u-.5),y0=Math.floor(v-.5),fx=u-.5-x0,fy=v-.5-y0,g=(x,y)=>land[Math.max(0,Math.min(BH-1,y))*BW+Math.max(0,Math.min(BW-1,x))];return g(x0,y0)*(1-fx)*(1-fy)+g(x0+1,y0)*fx*(1-fy)+g(x0,y0+1)*(1-fx)*fy+g(x0+1,y0+1)*fx*fy};
  const pts=[MAPPT.tower,...Object.keys(st.disc).filter(k=>st.disc[k]&&MAPPT[k]).map(k=>MAPPT[k])].map(([x,y])=>[x*MPK,y*MPK]);
  const b=pbuf(MPW,MPH),kk=b.k||1;b.ng=1;
  hiRect(b,0,0,MPW,MPH,(i,j,x,y)=>{const u=x/MPK,v=y/MPK,l=lv(u,v)+(hh2(i,j)-.5)*.08,c=gp(Math.floor(u),Math.floor(v));let col;
    if(l>.5){col=c==='l'||c==='k'||c==='o'?(hh2(i>>1,j>>1)<.05?'Z':hh2(i,j)<.12?'M':'N'):c==='b'?(hh2(i,j)<.1?'M':'N'):(c==='9'||c==='0'||c==='1'||c==='a')?((i+j)%3===0?'d':'L'):(c==='c'||c==='d'||c==='e'||c==='f')?'V':c==='j'?'j':'M';if(l<.56)col='d'}
    else if(l>.36){col=(i+j)%4===0?'b':'O'}else{col=(j%7===0&&hh2(i>>3,j)>.4)?'N':hh2(i,j)<.05?'N':'O'}
    /* туман над нерозвіданим */
    let dm=1e9;for(const[px,py]of pts)dm=Math.min(dm,Math.hypot(x-px,(y-py)*1.15));const f=Math.max(0,Math.min(1,(dm-44)/34));
    if(f>.08){const h1=(i+j)%6===0,h2=(i-j+600)%6===0;if((f>.15&&h1)||(f>.5&&h2)||(f>.85&&(i+j)%3===0))col=f>.75?'p':'b';else if(f>.9)col=col==='O'?'N':col==='N'?'M':col}
    /* потемніння до країв аркуша */
    const e=Math.min(x,MPW-x,y,MPH-y);if(e<14&&(1-e/14)*.7>bay(i,j))col=col==='O'?'b':col;return col});
  /* румби від троянди вітрів */
  const cx=58,cy=238;for(let a=0;a<16;a++){const an=a/16*6.283,dx=Math.cos(an),dy=Math.sin(an);for(let t=26;t<520;t+=1.4){const x=cx+dx*t,y=cy+dy*t;if(x<8||y<8||x>MPW-8||y>MPH-8)break;if(Math.floor(t/3)%2)continue;const hx=Math.round(x*kk),hy=Math.round(y*kk),c=b.p[hy*b.W+hx];if(c==='O')phx(b,hx,hy,'N')}}
  /* троянда вітрів */
  for(let a=0;a<8;a++){const an=a/8*6.283-Math.PI/2,L=a%2?11:20,w=a%2?2.5:4,px=-Math.sin(an),py=Math.cos(an);polyFill(b,[[cx+Math.cos(an)*L,cy+Math.sin(an)*L],[cx+px*w,cy+py*w],[cx-px*w,cy-py*w]],(x,y)=>pset(b,x,y,a===0?'j':((EXX+EXY)%2?'d':'V')))}
  polyFill(b,Array.from({length:12},(_,a)=>[cx+Math.cos(a/12*6.283)*4,cy+Math.sin(a/12*6.283)*4]),(x,y)=>pset(b,x,y,'O'));pset(b,cx,cy,'d');
  /* рамка аркуша */
  for(const[d,c]of[[4,'d'],[7,'V']]){prect(b,d,d,MPW-2*d,1,c);prect(b,d,MPH-d-1,MPW-2*d,1,c);prect(b,d,d,1,MPH-2*d,c);prect(b,MPW-d-1,d,1,MPH-2*d,c)}
  return b}
function mlaStain3(){const b=pbuf(MPW,MPH);b.ng=1;hiRect(b,0,0,MPW,MPH,(i,j,x,y)=>{const e=Math.min(x,MPW-x,y*1.2,(MPH-y)*1.2)/90,n=hh2(i>>2,j>>2)*.35;if(e<1&&(1-e)*(.75+n)>bay(i,j))return e<.35?'0':'o'});return b}
function mpMark3(kind){const b=pbuf(12,14);b.ng=1;if(kind==='new'){polyFill(b,Array.from({length:10},(_,a)=>[6+Math.cos(a/10*6.283)*5,6+Math.sin(a/10*6.283)*5]),(x,y)=>pset(b,x,y,(EXX+EXY)%5?'j':'i'));prect(b,5,3,2,6,'t');prect(b,3,5,6,2,'t');pset(b,4,3,'w')}
  else if(kind==='vis'){pline(b,2,2,10,10,'d');pline(b,10,2,2,10,'d');prect(b,5,10,2,4,'V')}
  else{pline(b,2,2,10,10,'a');pline(b,10,2,2,10,'a')}return b}
function mpTower3(won){const b=pbuf(16,26);b.ng=1;prect(b,6,8,5,16,'d');prect(b,7,8,3,16,'O');for(let y=10;y<24;y+=4)prect(b,6,y,5,1,'j');prect(b,5,6,7,2,'d');prect(b,6,3,5,3,won?'g':'d');prect(b,5,2,7,1,'d');prect(b,3,24,11,2,'d');
  if(won){for(const[dx,dy]of[[-4,-1],[-3,-3],[4,-1],[3,-3]])pline(b,8+dx*.5,4,8+dx*2,4+dy,'g')}return b}
function mpSpy3(){const b=pbuf(34,14);b.ng=1;pline(b,2,11,30,3,'e');pline(b,2,12,30,4,'g');pline(b,3,12,31,4,'e');prect(b,26,1,6,6,'g');prect(b,1,10,5,4,'d');return b}
for(const f of['mapChart3','mlaStain3','mpMark3','mpTower3','mpSpy3'])globalThis[f]=HI(globalThis[f]);

const mpSig=()=>Object.keys(LOC).map(k=>(s.disc[k]?1:0)).join('')+(s.f.won?1:0)+(s.f.gnat?1:0);
function mapScene(){const W=MPW,H=MPH,st={disc:s.disc,visited:s.visited,boat:s.f.boat,won:s.f.won,gnat:s.f.gnat};
  let h=`<span data-sk="bg" data-sig="bg" class="scbg">${VH(()=>pimg(pxURL('mc5:'+mpSig(),()=>mapChart3(st)),864,584,'scene','Мапа шхер'))}</span>`;
  h+=`<img class="mpst" data-sk="mpst" data-sig="1" src="${pxURL('mps3',mlaStain3)}" alt="" aria-hidden="true">`;
  for(const k in LOC){if(!s.disc[k]||!MAPPT[k])continue;const[x,y]=MAPPT[k],[ok]=canGo(k),kind=!s.visited[k]?'new':ok?'vis':'far',L=LOC[k];
    h+=ob('mp:'+k,'bpop','mp:'+k,obURL('mpm3:'+kind,()=>mpMark3(kind)),x*MPK-6,y*MPK-7,W,H,L.n,`<b>${L.n}</b><br>${s.visited[k]?'Відвідано.':'Ще не бував.'}`,{pulse:kind==='new'?1:0,always:kind==='new'?1:0,cls:'mpk '+kind,inner:`<span class="mpl">${L.n}</span>`})}
  const[tx,ty]=MAPPT.tower;h+=ob('mp:tower','bpop','mp:tower',obURL('mpt3:'+(s.f.won?1:0),()=>mpTower3(!!s.f.won)),tx*MPK-8,ty*MPK-24,W,H,'Маяк','<b>Маяк</b><br>Далекогляд і сигнальне вогнище.',{cls:'mpk',inner:'<span class="mpl">Маяк</span>'});
  if(s.floors.gallery&&SCAN.some(x=>!s.disc[x]))h+=ob('mp:spy','bpop','mp:tower',obURL('mpspy3',mpSpy3),376,262,W,H,'Далекогляд','<b>Далекогляд</b><br>Пробити млу й знайти нове місце.',{});
  return`<div class="scn mp" data-scn="mp" style="${scnD()}">${h}${fxCanvas('mp',W,H)}</div>`}
function mapPopHTML(id){const card=(nm,lv,body,act)=>`<div class="bpop" role="dialog" aria-label="${nm}"><div class="bph"><b>${nm}</b>${lv?`<span class="bplv">${lv}</span>`:''}<button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>${body}${act?`<div class="act">${act}</div>`:''}</div>`;
  const k=id.slice(3);
  if(k==='tower'){let b='',a='';if(s.floors.gallery&&SCAN.some(x=>!s.disc[x]))b+=`<div class="row"><span><b>Далекогляд</b><br><span class="m">Пробити млу й знайти нове місце.</span></span>${btn('Оглянути обрій','scan','',{ok:()=>s.r.ember>=scanCost()})}<span class="ccs">${R('ember',fmt(scanCost()))}</span></div>`;
    if(s.floors.gallery)b+=`<div class="row"><span><b>Сигнальне вогнище</b><br><span class="m">Великий вогонь кличе кораблі, що минають шхери. Вони скидають вантаж. Раз на дві хвилини.</span></span>${btn('Запалити','signal','',{ok:()=>s.r.ember>=sigCost(),cd:'signal',cs:120})}<span class="ccs">${R('ember',fmt(sigCost()))}</span></div>`;
    if(!b)b='<p class="hand">Звідси видно лише найближчі береги. Вище, з оглядової, було б видно далі.</p>';return card('Маяк','',`<div class="rlist">${b}</div>`,a)}
  const L=LOC[k];if(!L||!s.disc[k])return'';const[ok,why]=canGo(k);const tags=[s.visited[k]?'відвідано':'нове',L.sea===2?'шхуна':L.sea?'море':'',L.dark?'темрява':''].filter(Boolean).map(t=>`<span class="chip">${t}</span>`).join(' ');
  return card(L.n,'',`${pimg(pxURL('lc3:'+lcSig(k)+':'+GR,()=>lkBg3(k)),264,147,'thumb')}<div class="chips">${tags}</div><p class="m">${why||L.d}</p>${L.sea&&s.f.boat?`<p class="m">Вихід у море: ${R('prov',seaCost(L))}.</p>`:''}`,btn('Вирушити','go',k,{ok:()=>canGo(k)[0],cls:'main'}))}
