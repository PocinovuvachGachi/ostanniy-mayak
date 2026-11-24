/* ============ TEXT HELPERS ============ */
const P=t=>`<span class="npc">${t}</span>`;
const I=t=>`<span class="itm">${t}</span>`;
const E=t=>`<span class="foe">${t}</span>`;
const L_=t=>`<span class="pl">${t}</span>`;
const Q=t=>`<span class="q">«${t}»</span>`;
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const XKP={yd:1,y2:1,yf:1,s2:1,y3:1,f3:1,s3:1,sh:1,tc:1,sc:1,mp:1,st:1,ch:1,wk:1,h:1};
function xkA(url){let k=PXK[url];if(!k)return'';k=k.replace(/~\d+$/,'');return XKP[k.split(':')[0]]?` data-xk="${k.replace(/"/g,'')}"`:''}
const pimg=(url,w,h,cls,alt)=>url?`<img class="px ${cls||''}" src="${url}"${xkA(url)} width="${w}" height="${h}" alt="${alt||''}">`:'';
const WATER={'2':1,'3':1,'4':1,'6':1},WATER2={'2':1,'3':1},WATER3={P:1,Q:1,R:1,S:1,T:1,U:1,u:1};
function seaTop(b){const W=b.W||b.w,H=b.H||b.h;for(let y=0;y<H-1;y++){let n=0;for(let x=0;x<W;x++)if(b.p[y*W+x]==='4')n++;if(n>=W*0.6)return y}return -1}
function waveFrame(b,k,y0,set){const W=b.W||b.w,H=b.H||b.h,src=b.p,o=src.slice(),S=set||WATER;for(let y=Math.max(0,y0);y<H;y++){const off=[0,1,0,-1][(k+(y>>1))%4];if(!off)continue;
  for(let x=0;x<W;x++){const cc=src[y*W+x];if(!S[cc])continue;const sc=src[y*W+(x-off+W)%W];if(S[sc])o[y*W+x]=sc}}return{w:b.w,h:b.h,k:b.k||1,W,H,p:o}}
const AF={};
function animURLs(key,make,y0,set){if(AF[key])return AF[key];let base=null;const gb=()=>base||(base=make());const u0=pxURL(key,gb);if(!u0)return[u0];
  const top=y0===undefined?seaTop(gb()):Math.round(y0*(gb().k||1));if(top<0)return AF[key]=[u0];const out=[];for(let k=0;k<4;k++)out.push(pxURL(key+'~'+k,()=>waveFrame(gb(),k,top,set)));return AF[key]=out}
function pimgA(key,make,w,h,cls,alt,y0,set){const u=animURLs(key,make,y0,set);return u[0]?`<img class="px ${cls||''}" src="${u[0]}"${xkA(u[0])}${u.length>1?` data-fr="${key}"`:''} width="${w}" height="${h}" alt="${alt||''}">`:''}
let frN=0,frT=0;function animTick(){const now=Date.now();if(now-frT<520||RM()||!document.querySelectorAll)return;frT=now;frN++;document.querySelectorAll('img[data-fr]').forEach(el=>{const a=AF[el.dataset.fr];if(a&&a.length>1)el.src=a[frN%a.length]})}
const STI={stun:['...g...','..ggg..','ggggggg','.ggggg.','.gg.gg.','g.....g','.......'],bleed:['...i...','...i...','..iii..','.iiiii.','.iiiii.','..iii..','.......'],
  burn:['...f...','..ff...','..fgf..','.fghf..','.fghgf.','..fgf..','.......'],pin:['p.p.p.p','.p.p.p.','p.p.p.p','.p.p.p.','p.p.p.p','.p.p.p.','p.p.p.p'],
  weak:['...7...','...7...','...7...','7.777.7','.77777.','..777..','...7...'],wind:['...f...','..fff..','.fffff.','...f...','...f...','...f...','.......'],
  aim:['...i...','.iiiii.','.i.i.i.','iiiiiii','.i.i.i.','.iiiii.','...i...'],veil:['.......','..666..','.66666.','6666666','.66666.','.......','.......'],
  ihit:['......q','.....q.','....q..','.c.q...','..c....','.c.c...','c......'],ishoot:['....qq.','.....q.','....d.q','...d...','..d....','.d.....','d......'],iheal:['.......','..lll..','..lll..','lllllll','..lll..','..lll..','.......'],
  armd:['.ppppp.','.p.q.p.','.pq.qp.','.p.q.p.','..pqp..','...p...','.......'],stance:['.44444.','.45554.','.45554.','.45554.','..454..','...4...','.......']};
const stiURL=k=>pxURL('sti:'+k,()=>{const b=pbuf(7,7);pblit(b,STI[k],0,0);return b});
const sceneImg=n=>pimgA('sc:'+n+(n==='bayLow'&&SCENEOPT.bayOpen?'o':''),()=>scene(n),576,240,'scene');

