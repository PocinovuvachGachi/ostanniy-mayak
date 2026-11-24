/* ============ v14: TRANSITIONS ============ */
function xSnap(root){const m={};if(!root||!root.querySelectorAll)return m;const n={};
  root.querySelectorAll('img[data-xk]').forEach(el=>{if(el.closest&&el.closest('.chr-tl'))return;const g=el.dataset.xk.split(':')[0],ix=n[g]=(n[g]||0)+1;m[g+'#'+ix]={k:el.dataset.xk,src:el.src}});return m}
function xFade(root,old,same){if(RM()||!root||!root.querySelectorAll)return;const n={};
  root.querySelectorAll('img[data-xk]').forEach(el=>{if(el.closest&&el.closest('.chr-tl'))return;const g=el.dataset.xk.split(':')[0],ix=n[g]=(n[g]||0)+1,o=old[g+'#'+ix];
    if(o){if(o.k!==el.dataset.xk&&o.src&&o.src!==el.src)xOver(el,o.src)}else if(same&&el.classList)el.classList.add('xin')})}
function xOver(el,src){try{const r=el.getBoundingClientRect();if(!r.width)return;const ov=document.createElement('img');ov.src=src;ov.alt='';ov.className='xf';ov.setAttribute('aria-hidden','true');
  const host=el.closest&&el.closest('.scbg');if(host){ov.classList.add('xfin');host.appendChild(ov)}else{ov.style.left=(r.left+scrollX)+'px';ov.style.top=(r.top+scrollY)+'px';ov.style.width=r.width+'px';ov.style.height=r.height+'px';document.body.appendChild(ov)}
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ov.style.opacity='0'}));setTimeout(()=>{if(ov.parentNode)ov.parentNode.removeChild(ov)},host?2900:1200)}catch(e){}}
const ASEL='.row,.card,.fcard,.node,.tdet,section,.chr-c';
function aId(el){const b=el.tagName==='SECTION'?el.querySelector('h2'):el.querySelector('b,h3,h4');return b?(el.className||'').split(' ')[0]+'|'+b.textContent.trim().slice(0,60):''}
function aSnap(root){const m=new Set();if(!root||!root.querySelectorAll)return m;root.querySelectorAll(ASEL).forEach(el=>{const k=aId(el);if(k)m.add(k)});return m}
function aMark(root,old){if(RM()||!root||!root.querySelectorAll||!old.size)return;root.querySelectorAll(ASEL).forEach(el=>{const k=aId(el);if(!k||old.has(k))return;if(el.parentElement&&el.parentElement.closest&&el.parentElement.closest('.ain'))return;el.classList.add('ain')})}

