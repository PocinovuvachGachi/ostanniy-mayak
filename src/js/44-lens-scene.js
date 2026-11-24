/* ============ ЛІХТАРНЯ: дзеркала й промінь у картці поверху ============
   Поки маяк не горить — план ліхтарні згори: жаровня, дзеркала-кнопки, світло, що б'ється об стіни, вікно на море.
   Коли горить — морська карта навколо маяка з шістьма секторами: промінь повертається туди, де лунає ріжок. */
const LNC=16;
function lensBoard3(seqKey,out){const G=LENSMAP,Wc=G[0].length,Hc=G.length,b=pbuf(Wc*LNC,Hc*LNC);b.ng=1;const{seq}=beam();
  /* підлога: темні плити */
  hiRect(b,0,0,Wc*LNC,Hc*LNC,(i,j,x,y)=>{const cx=Math.floor(x/8),cy=Math.floor(y/8),ex=x%8,ey=y%8;if(ex<.7||ey<.7)return'x';const n=hh2(cx,cy);return n<.25?'x':n<.8?'D':'E'});
  /* світло: від жаровні до стіни чи вікна */
  const C=([x,y])=>[x*LNC+LNC/2,y*LNC+LNC/2];
  for(let n=0;n+1<seq.length;n++){const[a,c]=[C(seq[n]),C(seq[n+1])];const last=n+2===seq.length,ex=last?a[0]+(c[0]-a[0])*.5:c[0],ey=last?a[1]+(c[1]-a[1])*.5:c[1];
    hiRect(b,Math.min(a[0],ex)-4,Math.min(a[1],ey)-4,Math.abs(ex-a[0])+8,Math.abs(ey-a[1])+8,(i,j,x,y)=>{const d=a[0]===ex?Math.abs(x-a[0]):Math.abs(y-a[1]);if(d<1)return'y';if(d<1.8)return'h';if(d<3.4&&(3.4-d)/2.4>bay(i,j))return'I'})}
  /* стіни й вікно */
  for(let y=0;y<Hc;y++)for(let x=0;x<Wc;x++){if(G[y][x]!=='#')continue;const win=y===0&&x===7,X=x*LNC,Y=y*LNC;
    if(win){hiRect(b,X,Y,LNC,LNC,(i,j,px,py)=>{const u=px-X,v=py-Y;if(u<2||u>LNC-2||v<2)return'z';if(Math.abs(u-LNC/2)<.6)return'z';return out?(v<8?'h':'I'):(hh2(i,j)<.1?'T':v<6?'R':'Q')});continue}
    hiRect(b,X,Y,LNC,LNC,(i,j,px,py)=>{const u=px-X,v=py-Y,row=Math.floor(v/5),off=row%2?4:0,mort=v%5<.7||(u+off)%8<.7;if(mort)return'x';const n=hh2(Math.floor((u+off)/8)+x*3,row+y*5);return n<.15?'D':n>.85?'G':'F'})}
  /* жаровня */
  {const[cx,cy]=C([1,1]);hiRect(b,cx-6,cy-6,12,12,(i,j,x,y)=>{const d=Math.hypot(x-cx,y-cy);if(d>5.6)return;if(d>4.4)return'D';const f=hh2(i,j);return d<1.6?'y':d<3?(f<.5?'I':'h'):f<.4?'K':'J'})}
  return b}
function mirror3(d){const b=pbuf(LNC,LNC);b.ng=1;hiRect(b,1,1,14,14,(i,j,x,y)=>{const d0=Math.hypot(x-8,y-8);if(d0>6.6)return;if(d0>5.4)return x+y<15?'e':'X';
    const t=d==='/'?(x+y-16):(x-y);if(Math.abs(t)<1.1)return t<0?'u':'U';if(Math.abs(t)<1.9)return'z';return'V'});return b}
function beamChart3(){const R=60,b=pbuf(2*R,2*R);b.ng=1;hiRect(b,0,0,2*R,2*R,(i,j,x,y)=>{const dx=x-R,dy=y-R,d=Math.hypot(dx,dy);if(d>R)return;if(d>R-1.2)return'X';
    const an=Math.atan2(dy,dx),sec=Math.abs(((an*180/Math.PI+90+30)%60+60)%60);if(sec<.9&&d>8&&(Math.floor(d)%3))return'S';
    const isl=hh2(Math.floor((x+7)/10),Math.floor((y+3)/8))<.07&&d>20&&d<R-6;if(isl)return hh2(i>>1,j>>1)<.3?'E':'D';
    if(Math.floor(d)%14===0&&d>10)return'Q';return hh2(i>>1,j)<.04?'R':'P'});
  hiRect(b,R-3,R-3,6,6,(i,j,x,y)=>Math.hypot(x-R,y-R)<2.6?'G':'');return b}
for(const f of['lensBoard3','mirror3','beamChart3'])globalThis[f]=HI(globalThis[f]);
function lensHTML(){const{pos,out}=beam(),G=LENSMAP,Wc=G[0].length,Hc=G.length,key=Object.keys(s.mirrors).sort().map(k=>s.mirrors[k]).join('');
  let h=`<div class="lensb" style="aspect-ratio:${Wc}/${Hc}">${pimg(pxURL('lens3:'+key+(out?1:0),()=>lensBoard3(key,out)),Wc*LNC*2,Hc*LNC*2,'scene','План ліхтарні')}`;
  for(const k in pos){const[x,y]=k.split(',').map(Number),m=pos[k],d=s.mirrors[m];
    h+=`<button type="button" class="lmir" style="left:${x/Wc*100}%;top:${y/Hc*100}%;width:${100/Wc}%;height:${100/Hc}%" data-a="mirror" data-i="${m}" aria-label="Дзеркало ${m}: повернути"${s.f.won?' disabled':''}><img src="${pxURL('mir3:'+(d==='/'?'a':'b'),()=>mirror3(d))}" alt=""></button>`}
  return h+'</div>'}
function beamHTML(){const L=s.lost,tele=fuL('gallery')>=1,cur=s.beam||0;
  let w=`<img class="bch" src="${pxURL('bch3',beamChart3)}" alt=""><div class="wedge" style="background:conic-gradient(from ${cur*60-30}deg,rgba(255,224,138,.5) 0 60deg,transparent 60deg 360deg)"></div><div class="core"></div>`;
  SECT.forEach((n,i)=>{const a=(i*60-90)*Math.PI/180,x=50+Math.cos(a)*40,y=50+Math.sin(a)*40;w+=`<button type="button" class="${cur===i?'on':''}${L&&tele&&L.sec===i?' lost':''}" style="left:${x}%;top:${y}%" data-a="beam" data-i="${i}">${n}</button>`});
  return`<p class="m">Коли почуєш ріжок, поверни промінь туди, звідки він лунає. Поворот коштує ${R('oil',3)}.</p><div class="dial px">${w}</div>
  <p style="text-align:center">${L?`<b class="foe">${VH(()=>s.lost?`Ріжок лунає ${s.lost.hint}! Лишилося ${Math.max(0,Math.ceil((s.lost.until-Date.now())/1000))} с.`:'')}</b>`:'<span class="m">Море тихе. Промінь світить на '+SECT[cur]+'.</span>'}</p><p class="m" style="text-align:center">Кораблів урятовано: ${s.saved||0}.</p>`}
function lanternPart(){if(!floorBuilt('lantern'))return'';if(s.f.won)return`<h3 class="bph2">Промінь над морем</h3>${beamHTML()}`;
  return`<h3 class="bph2">Дзеркала</h3><p class="m">Вогонь горить, але світло б’ється об стіни. Натискай на дзеркала, щоб повернути їх, і виведи світло у вікно на море.</p>${s.f.ostap?`<p class="hint">${P('Остап')}: ${Q('Світло біжить прямо, доки дзеркало не поверне його. Не всі дзеркала стоять на його шляху')}.</p>`:''}${lensHTML()}`}
