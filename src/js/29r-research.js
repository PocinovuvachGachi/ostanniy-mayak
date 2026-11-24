/* ============ ДЕРЕВО ЗНАНЬ ЯК ШЛЯХ (етап III, #16) ============
   Дослідження — це читання: знання платиш одразу, а далі книга читається час (від кількох хвилин на початку до
   пів години глибше). Читаєш одну книгу за раз; почате не пропадає, можна відкласти й узяти іншу.
   Поки тебе немає, читання йде, але повільніше; з Остапом — удвічі швидше.
   Частина вузлів вимагає знахідок зі світу: «Природа Мли» — пляшку з туманом, «Оптика» — уламок лінзи,
   «Маякова справа» — самого Остапа. */
const RDMIN={1:3,2:8,3:15,4:25};
const rdTime=r=>(r.kill?6:RDMIN[r.t]||10)*60;
const RSNEED={a_fog:{ok:()=>!!s.odd.fogbottle,t:'пляшка з туманом — щоб було що вивчати'},optics:{ok:()=>shards()>=1,t:'уламок лінзи в руках'},beacon:{ok:()=>!!s.f.ostap,t:'Остап — цього в книгах немає'}};
const rsNeedOk=r=>!RSNEED[r.id]||RSNEED[r.id].ok();
const rdRate=()=>(away()?.4:1)*(s.f.ostap?2:1)*(fuL('study')>=2?1.2:1);
function rsStart(i){const r=RS.find(x=>x.id===i);if(!r||s.rs[i]||!rsReady(r)||!rsNeedOk(r))return;s.rdp=s.rdp||{};
  if(s.rdp[i]==null){if(s.r.lore<rsCost(r))return;s.r.lore-=rsCost(r);s.rdp[i]=0}
  s.rd=i;say(`Читаєш: ${r.n}. ${s.f.ostap?'Остап читає разом із тобою.':'Свічка, перо, пісочний годинник.'}`,'info');dirty=1}
function rsDone(i){const r=RS.find(x=>x.id===i);s.rs[i]=1;delete s.rdp[i];if(s.rd===i)s.rd='';say(`Досліджено: ${r.n}.`,'lvl');xp(10);
  dlg({k:'lvl',title:`Звіт: ${r.n}`,img:s.f.ostap?{t:'face',id:'ostap'}:{t:'icon',id:'lore'},body:`<div class="note">${U(r.rep||r.d)}<span class="sig">— ${s.f.ostap?'Остап':'із записів Остапа'}</span></div>`,gains:[U(r.d)]});dirty=1}
function rdTick(dt){if(!s.rd||!s.rdp)return;const r=RS.find(x=>x.id===s.rd);if(!r){s.rd='';return}s.rdp[s.rd]=(s.rdp[s.rd]||0)+dt*rdRate();if(s.rdp[s.rd]>=rdTime(r))rsDone(s.rd)}
const rdLeft=i=>{const r=RS.find(x=>x.id===i);return Math.max(0,rdTime(r)-((s.rdp||{})[i]||0))};
const rdMin=sec=>{const m=Math.ceil(sec/60);return m<=1?'менше хвилини':`${m} хв`};
function rdHTML(sel){if(!sel)return'';const st=rsSt(sel),c=rsCost(sel),begun=(s.rdp||{})[sel.id]!=null,cur=s.rd===sel.id;
  if(st!=='avail')return'';if(!rsNeedOk(sel))return`<p class="m">Потрібно: ${RSNEED[sel.id].t}.</p>`;
  if(cur){const p=Math.min(100,Math.round((s.rdp[sel.id]||0)/rdTime(sel)*100));return`<div class="rdbar"><i style="width:${p}%"></i></div><p class="m">Читаєш. Лишилось ${rdMin(rdLeft(sel.id)/rdRate())}${away()?'':' (без тебе — повільніше)'}.</p>`}
  return`<div class="act">${btn(begun?'Читати далі':'Читати','rs',sel.id,{ok:()=>begun||s.r.lore>=c,cls:'main'})}${begun?'':`<span class="ccs">${R('lore',c)}</span>`}<span class="m">${begun?`лишилось ${rdMin(rdLeft(sel.id))}`:`~${rdMin(rdTime(sel))} читання`}${s.rd&&!cur?' · поточну книгу буде відкладено':''}</span></div>`}
