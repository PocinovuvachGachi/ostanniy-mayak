/* ============ v14: RECIPES ============ */
const RCI={winchRestore:'winchRestore',rodUp:'rodUp',hookUp:'hookUp',rod:'rod',pack1:'pack',pack2:'pack',belt1:'belt'};
const rcName=rc=>rc.tool?rc.n:IT[rc.out].n;
const rcImg=rc=>rc.tool?{t:'icon',id:RCI[rc.id]||'crate'}:WT[rc.out]?{t:'wico',id:rc.out}:{t:'icon',id:rc.out};
const rcURL=rc=>{const m=rcImg(rc);return m.t==='wico'?wIco(m.id):icoURL(m.id)};
function rcDlg(L){const one=L.length===1,r0=L[0],sh=rc=>rc.tool?rc.d:itemShort(rc.out);
  const body=one?`<p class="src">${r0.src||''}</p><p><b>${rcName(r0)}</b> <span class="m">· ${sh(r0)}</span></p><div class="ccs">${costChips(rcCost(r0),r0.it)}</div>`
    :L.map(rc=>`<div class="rcn">${pimg(rcURL(rc),36,36,'')}<div><b>${rcName(rc)}</b> <span class="m">· ${sh(rc)}</span><br><span class="src">${rc.src||''}</span><br><span class="ccs">${costChips(rcCost(rc),rc.it)}</span></div></div>`).join('');
  dlg({k:'find',title:one?`Новий рецепт: ${rcName(r0)}`:'Нові рецепти',img:one?rcImg(r0):{t:'scene',id:'work'},body,btns:[['До майстерні','dlggo','work'],['Пізніше','dlgok']]})}

