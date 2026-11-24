/* ============ LOCATIONS LOGIC ============ */
function snap(){return{r:Object.assign({},s.r),inv:Object.assign({},s.inv),xp:totXP()}}
function totXP(){let t=s.h.xp;for(let l=1;l<s.h.lvl;l++)t+=need(l);return t}
function gainsOf(sn){const g=[];const dx=Math.round(totXP()-sn.xp);if(dx>0)g.push(`+${dx} досвіду`);
  for(const k of RES){const d=Math.floor(s.r[k]-sn.r[k]+1e-6);if(d>=1)g.push('+'+R(k,d))}
  for(const k in s.inv){const d=(s.inv[k]||0)-(sn.inv[k]||0);if(d>0&&IT[k])g.push(`+${I(IT[k].n)}${d>1?' × '+d:''}`)}return g}
function findA(id){const[l,sp,a]=id.split('.');return LOC[l].spots.find(x=>x.id===sp).acts.find(x=>x.id===a)}
function findS(id){const[l,sp]=id.split('.');return LOC[l].spots.find(x=>x.id===sp)}
const seaCost=L=>Math.max(1,SEAFOOD*(L.sea||0)-(fac('cape')>=80?1:0));
function canGo(id){const L=LOC[id];if(!s.tabs.map)return[false,'Спершу треба дістатися великого острова.'];if(L.sea===2&&!s.f.schooner)return[false,'Так далеко на північ дійде лише шхуна.'];if(L.sea===2&&s.r.prov<seaCost(L))return[false,`Для походу на шхуні потрібно ${seaCost(L)} провізії.`];if(L.sea&&!s.f.boat)return[false,'Туди можна дістатися лише човном.'];if(L.sea&&s.r.prov<seaCost(L))return[false,`Для виходу в море потрібно ${seaCost(L)} провізії.`];if(L.dark&&!s.eq.light)return[false,'Там темно. Візьми в руку ліхтар.'];return[true,'']}
function laOk(id){const A=findA(id),S=findS(id);if(!A||!S)return false;
  if(S.show&&!S.show())return false;if(A.show&&!A.show())return false;if(A.once&&s.done[id])return false;
  if(A.cd&&onCd('la.'+id))return false;
  if(A.chk&&st(A.chk[0])<A.chk[1])return false;
  if((A.c||A.it)&&!afford(A.c,A.it))return false;
  if(S.dark&&!s.eq.light)return false;
  if(A.ok&&!A.ok())return false;
  return true}
function doLA(id,quick){const A=findA(id),S=findS(id);if(!laOk(id))return;
  if(A.fight&&quick&&!quickOk(A.fight))return;
  if(A.cd)setCd('la.'+id,A.cd);
  if(A.c||A.it)pay(A.c,A.it);
  if(A.fight){quick?quickFight(A.fight,'L:'+id):startFight(A.fight,'L:'+id);return}
  if(A.once)s.done[id]=1;
  if(A.once||!A.cd){const sn=snap(),q0=(s.dlg||[]).length;const m=A.run&&A.run();trustAct(id);if(m){say(m,'info');const l=id.split('.')[0];
      const box={k:'find',title:A.t||S.n,img:S.face?{t:'face',id:S.face}:{t:'scene',id:l==='bay'?(lowTide()?'bayLow':'bayHigh'):l},body:`<p>${m}</p>`,gains:gainsOf(sn)};s.dlg=s.dlg||[];s.dlg.splice(q0,0,box)}}
  else{say(A.run&&A.run(),'info');trustAct(id)}
  dirty=1}
