/* ============ v14: COMBAT ICONS ============ */
function ib(a,i,o){const dis=!o.ok,u=o.url||icoURL(o.ic||'crate'),lab=String(o.lab||'').replace(/"/g,'&quot;');
  return`<button type="button" class="ib${dis?' dis':''}${o.on?' on':''}${o.cls?' '+o.cls:''}" data-a="${a}" data-i="${i||''}"${dis?' aria-disabled="true"':''} aria-label="${lab}" ${TA(o.tip||lab)}>${u?`<img class="px" src="${u}" alt="" width="36" height="36">`:`<span class="ibt">${lab.slice(0,2)}</span>`}${o.txt?`<span class="ibx">${o.txt}</span>`:''}${o.ap?`<span class="apb">${o.ap}</span>`:''}${o.cnt!=null?`<span class="cnt">${o.cnt}</span>`:''}${o.cd?`<span class="cdo">${o.cd}</span>`:''}${o.sw?'<span class="swb">⇄</span>':''}</button>`}
const guardPct=m=>{const c=s.cb;if(!c||!c.guard)return 0;const v=Math.min(60,15*c.guard);return m?v:Math.round(v/2)};
function hvURL(){const w=s.eq.weapon;if(!w||!ICO[w])return icoURL('a_heavy');const f=wF(w);
  return pxURL('hv:'+w+f,()=>{const b=sprBuf(ICO[w],12,12);if(f&&WFRC[f]){const m=WFRC[f];b.p=b.p.map(c=>m[c]||c)}
    for(const[x,y,c]of[[0,0,'h'],[1,1,'g'],[0,3,'g'],[3,0,'g'],[11,11,'h'],[10,10,'g'],[11,8,'g'],[8,11,'g'],[0,11,'j'],[11,0,'j']])if(pget(b,x,y)==='.')pset(b,x,y,c);return b})}
function abWhy(id,u){const A=ABL[id];if(['adj','ray4','d2','shot','los'].includes(A.tgt)&&(!u||isObj(u)))return'Спершу обери ціль: натисни на ворога на полі.';
  return({adj:'Ціль має стояти поруч із тобою.',ray4:'Потрібна ціль за 2–4 клітинки, яку видно.',d2:'Ціль має бути рівно за дві клітинки, а між вами — вільно.',shot:'Потрібна ціль, яку видно й можна дострілити.',los:'Потрібна ціль, яку видно.',none:id==='vanish'?'Ти вже в тіні.':'Поруч немає ворогів.'})[A.tgt]||'Зараз це не спрацює.'}

