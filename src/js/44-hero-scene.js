/* ============ ГЕРОЙ: розворот щоденника хранителя ============
   Ліва сторінка — портрет і вбрання на ляльці (слоти — об'єкти з картками). Права — записи: рівень, здоров'я, досвід,
   удар, броня; унизу мотузка з вузлами-талантами. На столі — свічка й миска з їжею. */
const HRW=432,HRH=240;
const HSLOT={weapon:[40,66],ranged:[40,118],armor:[168,56],light:[168,108],charm:[168,160]};
function heroDesk3(){const b=pbuf(HRW,HRH);b.ng=1;
  hiRect(b,0,0,HRW,HRH,(i,j,x,y)=>{const row=Math.floor(y/20);return(Math.floor(y)%20===19)?'V':hh2(i>>3,row)<.1?'X':hh2(i>>1,j)<.05?'V':'W'});
  /* книга: обкладинка, сторінки, корінець */
  prect(b,18,10,396,222,'V');prect(b,20,12,392,218,'c');
  for(const[x0,x1]of[[26,214],[218,406]]){hiRect(b,x0,14,x1-x0,210,(i,j,x,y)=>{const e=Math.min(x-x0,x1-x,y-14,224-y);if(e<1.2)return'b';const n=hh2(i,j);if((Math.floor(y)-30)%12===0&&y>30&&y<210&&n>.3)return'N';return n<.06?'N':n<.09?'b':'O'})}
  for(let i=0;i<4;i++){prect(b,26+i,224+i*.5,188-i*2,1,'b');prect(b,218+i,224+i*.5,188-i*2,1,'b')}
  hiRect(b,208,14,16,210,(i,j,x)=>{const d=Math.abs(x-216)/8;return d<.15?'a':d<.5?'b':null});
  /* рамки слотів чорнилом */
  for(const sl in HSLOT){const[x,y]=HSLOT[sl];for(let t=0;t<30;t+=2){pset(b,x-1+t,y-1,'a');pset(b,x-1+t,y+29,'a');pset(b,x-1,y-1+t,'a');pset(b,x+29,y-1+t,'a')}}
  /* стрічка-закладка */
  prect(b,392,0,6,30,'i');polyFill(b,[[392,30],[395,26],[398,30],[398,34],[392,34]],(x,y)=>pset(b,x,y,'i'));
  /* мотузка для вузлів-талантів */
  for(let x=230;x<396;x++){const y=204+Math.sin(x/9)*1.2;pset(b,x,y,(x>>1)%2?'d':'e');pset(b,x,y+1,'c')}
  return b}
function heroSlot3(icon,wico){const b=pbuf(28,28);b.ng=1;if(!icon)return b;const R=wico?null:(ICO[icon]||null);
  if(R){for(let y=0;y<12;y++)for(let x=0;x<12;x++){const c=(R[y]||'')[x]||'.';if(c!=='.')prect(b,2+x*2,2+y*2,2,2,c)}}else{prect(b,4,4,20,20,'N')}return b}
function heroBowl3(n){const b=pbuf(30,20);polyFill(b,[[1,8],[29,8],[24,19],[6,19]],(x,y)=>pset(b,x,y,(x+y)%5?'X':'W'));prect(b,1,7,28,2,'Y');for(let i=0;i<Math.min(3,n);i++){prect(b,5+i*7,3,7,4,i%2?'T':'S');pset(b,5+i*7,4,'U')}return b}
function heroKnot3(st){const b=pbuf(10,12);polyFill(b,Array.from({length:10},(_,a)=>[5+Math.cos(a/10*6.283)*4,6+Math.sin(a/10*6.283)*4.5]),(x,y)=>pset(b,x,y,st==='avail'?((EXX+EXY)%3?'g':'h'):st==='taken'?((EXX+EXY)%2?'d':'e'):'b'));return b}
for(const f of['heroDesk3','heroSlot3','heroBowl3','heroKnot3'])globalThis[f]=HI(globalThis[f]);

function heroScene(){const H=s.h,WW=HRW,HH=HRH;let h=`<span data-sk="bg" data-sig="bg" class="scbg">${VH(()=>pimg(pxURL('hrd4',heroDesk3),864,480,'scene','Щоденник хранителя'))}</span>`;
  /* лялька: існуючий піксельний хранитель у вбранні */
  h+=`<img class="hrdoll" data-sk="doll" data-sig="${hsh(heroURL(s.eq))}" src="${heroURL(s.eq)}" alt="Хранитель" style="${PCT(76,52,84,84,WW,HH)}">`;
  for(const sl in HSLOT){const id=s.eq[sl],[x,y]=HSLOT[sl],alt=Object.keys(s.inv).some(k=>s.inv[k]>0&&IT[k]&&IT[k].slot===sl&&k!==id);if(!id&&!alt&&sl!=='weapon')continue;
    const ic=id?(WT[id]?null:id):null;h+=ob('hr:s:'+sl,'bpop','hr:s:'+sl,obURL('hrs3:'+(id||'-'),()=>heroSlot3(ic,!!(id&&WT[id]))),x,y,WW,HH,SLOT[sl],`<b>${SLOT[sl]}</b><br>${id?(WT[id]?wN(id):IT[id].n):'порожньо'}`,{cls:'hrsl',inner:id&&WT[id]?`<img class="hrwi" src="${wIco(id)}" alt="">`:''})}
  /* миска з їжею */
  const food=(s.seen.fish?Math.min(3,Math.floor(s.r.fish)):0);if(s.seen.fish||s.seen.prov)h+=ob('hr:food','bpop','hr:food',obURL('hrb3:'+food,()=>heroBowl3(food)),2,212,WW,HH,'Миска','<b>Їжа</b><br>Підкріпитися й загоїти рани.',{pulse:s.h.hp<maxHP()*.5?1:0,always:s.h.hp<maxHP()*.5?1:0});
  /* вузли талантів на мотузці */
  const tk=FT.filter(f=>H.ft[f.id]).length,av=H.fp>0&&FT.some(f=>tVis(f)&&featOk(f));const nk=Math.min(14,tk+(av?1:0));
  for(let i=0;i<nk;i++){const stt=i<tk?'taken':'avail',x=236+i*11;h+=ob('hr:k'+i,'ht','talents',obURL('hrk3:'+stt,()=>heroKnot3(stt)),x,198,WW,HH,'Таланти',`<b>Таланти</b><br>${i<tk?'Взятий талант.':'Можна обрати новий талант.'}`,{pulse:stt==='avail'?1:0,always:stt==='avail'?1:0})}
  if(s.nv.grow&&H.pts+H.sp>0)h+=ob('hr:grow','ht','grow',obURL('hrk3:avail',()=>heroKnot3('avail')),388,30,WW,HH,'Розвиток',`<b>Нові очки</b><br>Можна вкласти в характеристики чи вміння.`,{pulse:1,always:1});
  /* записи на правій сторінці */
  const chip=(n,v)=>`<span><i>${n}</i> <b>${v}</b></span>`;
  h+=`<div class="hrtxt" data-sk="txt" data-sig="t" style="${PCT(232,22,160,170,WW,HH)}"><h3>Хранитель <small>рівень ${V(()=>s.h.lvl)}</small></h3>${H.bg&&BGS[H.bg]?`<p class="hrbg">колись — ${BGS[H.bg].n.toLowerCase()}</p>`:''}
    <p>Здоров’я ${V(()=>Math.ceil(s.h.hp)+' / '+maxHP())}</p><div class="hrbar">${W(()=>Math.max(0,s.h.hp/maxHP()*100))}</div>
    <p>Досвід ${V(()=>Math.floor(s.h.xp)+' / '+need(s.h.lvl))}</p><div class="hrbar xp">${W(()=>s.h.xp/need(s.h.lvl)*100)}</div>
    <div class="hrch">${chip('удар',V(()=>`${wDmg()+s.h.a.str-1}–${wDmg()+s.h.a.str}`))}${chip('броня',V(()=>armor()))}${chip('очки дії',V(()=>maxAP()))}${chip('критичний',V(()=>critCh()+'%'))}</div></div>`;
  h+=`<div class="hrttl" data-sk="ttl" data-sig="t" style="${PCT(30,18,180,20,WW,HH)}">Що несе хранитель</div>`;
  const L={fire:[],win:[{x:216,y:120,r:240,e:.55,c:WARM,a:.35}]};
  return`<div class="scn hr" data-scn="hr" style="${scnD()}">${h}${fxCanvas('hr',WW,HH)}${lightLayers(WW,HH,L)}</div>`}
function heroPopHTML(id){const card=(nm,lv,body,act)=>`<div class="bpop" role="dialog" aria-label="${nm}"><div class="bph"><b>${nm}</b>${lv?`<span class="bplv">${lv}</span>`:''}<button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>${body}${act?`<div class="act">${act}</div>`:''}</div>`;
  if(id==='hr:food'){const b=[];if(s.seen.fish||s.seen.prov)b.push(btn('Поїсти досхочу','eatfull','',{ok:()=>(s.r.fish>=1||s.r.prov>=1)&&s.h.hp<maxHP()}));if(s.seen.fish)b.push(btn('З’їсти рибу (+8)','eat','',{ok:()=>s.r.fish>=1&&s.h.hp<maxHP()}));if(s.seen.prov)b.push(btn('З’їсти провізію (+15)','eatp','',{ok:()=>s.r.prov>=1&&s.h.hp<maxHP()}));if(s.mst.olesya)b.push(btn('Перев’язка в Олесі','olheal','',{cd:'olheal',cs:120,ok:()=>s.h.hp<maxHP()}));
    return card('Їжа','',`<p class="m">Здоров’я ${V(()=>Math.ceil(s.h.hp)+' / '+maxHP())}. Біля вогнища сили вертаються повільно${Date.now()<((s.h.buf||{}).warm||0)?' (зараз — утричі швидше: тепло юшки)':''}; їжа лікує одразу.</p>`,b.join(''))}
  if(id.startsWith('hr:s:')){const sl=id.slice(5),cur=s.eq[sl],alt=Object.keys(s.inv).filter(k=>s.inv[k]>0&&IT[k]&&IT[k].slot===sl&&k!==cur),nm=k=>WT[k]?wN(k):IT[k].n;
    return card(SLOT[sl],cur?'вдягнено':'порожньо',`${cur?`<div class="row"><span>${pimg(WT[cur]?wIco(cur):icoURL(cur),24,24)} <b>${nm(cur)}</b><br><span class="m">${itemShort(cur)}</span></span></div>`:'<p class="m">Тут поки нічого.</p>'}
      ${alt.length?`<p class="jh">Можна взяти</p><div class="rlist">${alt.map(k=>`<div class="row"><span>${pimg(WT[k]?wIco(k):icoURL(k),20,20)} ${nm(k)}</span>${btn('Взяти','equip',k)}</div>`).join('')}</div>`:''}`,cur&&!['weapon','ranged'].includes(sl)?btn('Зняти','unequip',sl,{cls:'toggle'}):'')}
  return''}
