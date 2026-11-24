/* ============ ВКЛАДКА «МАЯК»: розріз маяка як жива сцена ============
   Тло (небо, море, острів, кам'яна оболонка вежі, перекриття, балкон, ліхтарня) — одна картинка.
   Кожен поверх — окремий об'єкт-кімната: натиснув — картка поверху з відновленням і покращеннями.
   Відбудовані кімнати світяться й обростають речами з кожним покращенням; зруйновані — темні, з уламками. */
const TWW=432,TWH=300,TCX=216,TWT=7;
const twO=y=>44+(Math.max(70,y)-70)*0.14,twI=y=>twO(y)-TWT;
const TROOM={lantern:[26,68],gallery:[74,110],study:[114,158],work:[162,208],hall:[212,268]};
const TORDER=['lantern','gallery','study','work','hall'];
function twBox(id){const[y0,y1]=TROOM[id];if(id==='lantern')return[TCX-28,y0,56,y1-y0];const hw=Math.floor(twI(y1));return[TCX-hw,y0,hw*2,y1-y0]}

/* --- тло: небо, море, острів, оболонка вежі --- */
function towerShell3(st){const W=TWW,H=TWH,b=pbuf(W,H),ph=st.ph||'n',kk=b.k||1;
  rampV(b,0,0,W,205,ph==='y'?['4','5','5','6','6']:ph==='d'?['C','o','3','4','5']:['A','B','C','1','2']);
  if(ph!=='y'){const R=rng(17);for(let i=0;i<(ph==='n'?220:50);i++){const x=Math.floor(R()*W*kk),y=Math.floor(R()*170*kk),c=R()<.1?'y':R()<.45?'6':'5';phx(b,x,y,c)}}
  if(ph==='n'){const mx=372,my=40;polyFill(b,Array.from({length:16},(_,a)=>[mx+Math.cos(a/16*6.283)*9,my+Math.sin(a/16*6.283)*9]),(x,y)=>{const d=Math.hypot(EXX/SK-mx-2.5,EXY/SK-my+1.5);pset(b,x,y,d<7.5?'1':'6')})}
  polyFill(b,[[0,205],[0,190],[40,184],[90,192],[120,205]],(x,y)=>pset(b,x,y,'1'));polyFill(b,[[300,205],[340,188],[392,182],[432,192],[432,205]],(x,y)=>pset(b,x,y,'1'));
  rampV(b,0,205,W,63,['S','R','Q','P']);{const R2=rng(23);for(let i=0;i<260;i++){const x=Math.floor(R2()*W*kk),y=Math.floor((206+R2()*60)*kk),l=Math.round((2+R2()*6)*kk);for(let q=0;q<l;q++)phx(b,x+q,y,y/kk<220?'U':'T')}}
  const gr=[[0,300],[0,272],[60,266],[140,262],[300,262],[380,268],[432,276],[432,300]];polyFill(b,gr,(x,y)=>{const n=hh2(EXX,EXY);pset(b,x,y,n<.06?'O':n<.14||.16>bay(EXX,EXY)?'L':y<275?'N':'M')});
  for(let i=0;i<gr.length-1;i++){const[a,c]=[gr[i],gr[i+1]];const n=Math.max(1,Math.abs(c[0]-a[0]));for(let q=0;q<=n;q+=1){const x=a[0]+(c[0]-a[0])*q/n,y=a[1]+(c[1]-a[1])*q/n;if(q%2)pset(b,x,y-1,'u')}}
  stones(b,150,268,132,28,51);
  /* оболонка: зовнішня кладка */
  {const bh=Math.round(5*kk),bw=Math.round(8*kk);hiRect(b,TCX-80,74,160,206,(i,j,x,y)=>{const hw=twO(y);if(x<TCX-hw||x>=TCX+hw||y>=280)return;const row=Math.floor(j/bh),off=row%2?Math.round(bw/2):0,bi=Math.floor((i+off)/bw);
    if(j%bh===bh-1||(i+off)%bw===0)return'D';const sh=x<TCX-hw+5?'G':x>TCX+hw-6?'D':'F',v=hh2(bi,row);return v<.12?(sh==='G'?'F':'E'):sh})}
  /* перерізи стін і перекриттів */
  for(const id of['gallery','study','work','hall']){const[y0,y1]=TROOM[id];for(let y=y0;y<y1;y++){const o=twO(y),i=twI(y);prect(b,TCX-o,y,o-i,1,'E');prect(b,TCX+i,y,o-i,1,'E')}
    hiRect(b,TCX-twO(y0),y0,twO(y0)*2,y1-y0,(hx,hy,x)=>{const o=twO(hy/kk),i=twI(hy/kk);if((x>=TCX-o&&x<TCX-i)||(x>=TCX+i&&x<TCX+o)){const n=hh2(hx>>1,hy>>1);return n<.2?'F':n<.3?'D':null}})}
  for(const y of[110,158,208]){const o=twO(y);prect(b,TCX-o,y,o*2,4,'W');prect(b,TCX-o,y,o*2,1,'Y');for(let x=TCX-o+3;x<TCX+o;x+=9)prect(b,x,y+1,2,3,'V')}
  prect(b,TCX-twO(268)-2,268,twO(268)*2+4,10,'F');prect(b,TCX-twO(268)-2,268,twO(268)*2+4,1,'H');
  /* балкон оглядової й поруччя */
  {const o=twO(110)+16;prect(b,TCX-o,110,o*2,4,'G');prect(b,TCX-o,110,o*2,1,'H');for(const sd of[-1,1])for(let x=twO(110)+2;x<=o;x+=4)prect(b,TCX+sd*x,99,1,11,'z');prect(b,TCX-o,99,o-twO(110),1,'G');prect(b,TCX+twO(110),99,o-twO(110),1,'G')}
  /* ліхтарня: палуба, скло, дах */
  prect(b,TCX-50,68,100,6,'G');prect(b,TCX-50,68,100,1,'H');prect(b,TCX-50,73,100,1,'D');for(let x=TCX-48;x<=TCX+48;x+=4)prect(b,x,58,1,10,'z');prect(b,TCX-49,58,98,1,'G');
  for(let y=26;y<68;y++){prect(b,TCX-30,y,2,1,'z');prect(b,TCX+28,y,2,1,'z')}prect(b,TCX-30,25,60,2,'E');
  polyFill(b,[[TCX-36,26],[TCX,7],[TCX+36,26]],(x,y)=>pset(b,x,y,x<TCX?'z':'E'));prect(b,TCX-36,25,72,1,'D');prect(b,TCX-1,3,3,5,'G');prect(b,TCX-2,2,5,2,'H');
  /* прапори й флюгер з покращень оглядової */
  const gt=st.gt||0;if(gt>=2){const px=TCX+twO(110)+12;prect(b,px,56,1,44,'z');const fc=['j','g','u'];for(let i=0;i<3;i++){polyFill(b,[[px+1,58+i*9],[px+12,61+i*9],[px+1,64+i*9]],(x,y)=>pset(b,x,y,fc[i]))}}
  if(gt>=3){prect(b,TCX,0,1,3,'G');prect(b,TCX-5,0,11,1,'G');polyFill(b,[[TCX+5,-1],[TCX+9,0],[TCX+5,2]],(x,y)=>pset(b,x,y,'e'))}
  return b}

/* --- кімнати --- */
function twRoom(id,st){const[x0,y0,w,h]=twBox(id),b=pbuf(w,h),built=st.built,tr=st.tr||0,lit=st.lit,cx=w/2;
  const inside=(x,y)=>{if(id==='lantern')return x>=0&&x<w;const hw=twI(y0+y);return x>=cx-hw&&x<cx+hw};
  /* задня стіна */
  hiRect(b,0,0,w,h,(i,j,x,y)=>{if(!inside(x,y))return;const bh=Math.round(4*SK),bw=Math.round(7*SK),row=Math.floor(j/bh),off=row%2?Math.round(bw/2):0;
    if(id==='lantern')return built?(hh2(i>>2,j>>2)<.1?'2':'B'):(hh2(i,j)<.08?'D':'x');const m=j%bh===bh-1||(i+off)%bw===0;if(built){const n=hh2(i>>1,j>>1);return y>h-3?'X':n<.1?'L':n<.22?'b':'a'}return m?'x':hh2(Math.floor((i+off)/bw),row)<.2?'E':'D'});
  const P=(x,y,ww,hh,c)=>prect(b,x,h-y-hh,ww,hh,c),S=(x,y,c)=>pset(b,x,h-1-y,c);
  /* вікно на задній стіні */
  const win=(wx,wy,ww,wh)=>{P(wx-1,wy-1,ww+2,wh+2,'z');P(wx,wy,ww,wh,'B');P(wx,wy,ww,Math.max(1,wh>>2),'R');P(wx+(ww>>1),wy,1,wh,'z');P(wx,wy+(wh>>1),ww,1,'z');if(st.ph==='n')S(wx+1,wy+wh-2,'6')};
  /* сходи: від підлоги з одного боку до стелі з другого */
  const stairs=(side,ok)=>{const n=Math.floor(h/5);for(let i=0;i<n;i++){if(!ok&&(i%3===1))continue;const sx=side<0?6+i*4:w-10-i*4;if(!inside(sx,h-i*5-4)||!inside(sx+4,h-i*5-4))continue;P(sx,i*5,6,2,ok?'X':'W');P(sx,i*5,6,1,ok?'Y':'X')}};
  const ruin=()=>{for(let i=0;i<6;i++){const rx=8+hh2(i,id.length)*(w-24),rw=4+hh2(i,9)*8;polyFill(b,[[rx,h],[rx+rw/2,h-2-hh2(i,3)*5],[rx+rw,h]],(x,y)=>pset(b,x,y,hh2(x,y)<.3?'D':'F'))}
    pline(b,cx-12,h-3,cx+6,h-12,'W');pline(b,cx+4,h-2,cx+16,h-9,'V');pline(b,2,2,8,2,'p');pline(b,2,2,2,8,'p');pline(b,2,6,6,2,'p');pline(b,w-3,2,w-9,2,'p');pline(b,w-3,2,w-3,8,'p');pline(b,w-3,6,w-7,2,'p')};
  if(id==='hall'){
    if(!built){stairs(1,0);ruin();if(st.ember){P(30,1,6,2,'D');S(32,2,'K');S(33,2,'J')}return b}
    win(cx+8,30,12,14);stairs(1,1);
    /* камін */
    const fw=tr>=1?34:26;P(6,0,fw,tr>=1?30:12,'F');P(6,tr>=1?30:12,fw,1,'H');if(tr>=1){P(4,29,fw+4,3,'G');P(4,31,fw+4,1,'H');P(11,0,fw-10,20,'x');P(11,19,fw-10,1,'D')}
    for(let i=0;i<fw;i+=4)P(6+i,0,3,2,i%8?'G':'F');
    if(lit){const fx=6+fw/2;P(fx-6,1,12,2,'K');P(fx-4,3,8,4,'J');P(fx-2,6,4,5,'I');S(fx-5,4,'K');S(fx+4,5,'K');S(fx,11,'J')}else{P(6+fw/2-4,1,8,2,'D');S(6+fw/2,2,'K')}
    if(tr>=2){P(6+fw/2-3,tr>=1?32:13,6,h,'z');P(6+fw/2-3,tr>=1?32:13,1,h,'G')}
    /* двері */
    P(cx-8,0,14,24,tr>=3?'W':'V');for(let i=0;i<14;i+=3)P(cx-8+i,0,1,24,'W');P(cx-8,23,14,1,'X');if(tr>=3){for(const yy of[5,17])P(cx-8,yy,14,2,'z');for(const xx of[1,6,11])S(cx-8+xx,6,'H');S(cx+3,12,'g')}else S(cx+3,12,'Y');
    /* дрова */
    const nl=Math.min(9,1+Math.floor((st.wood||0)/30));for(let i=0;i<nl;i++){const r=Math.floor(i/3),c=i%3,lx=w-30+c*6+r*3,ly=r*4;P(lx,ly,6,3,'X');P(lx,ly+2,6,1,'Y');S(lx,ly+1,'M')}
    P(cx+20,0,18,2,'W');P(cx+20,6,18,2,'X');P(cx+21,2,2,4,'W');P(cx+35,2,2,4,'W');return b}
  if(id==='work'){stairs(-1,built);if(!built){ruin();P(cx-6,0,22,2,'W');pline(b,cx-6,h-3,cx+14,h-8,'X');return b}
    win(cx+18,24,10,12);
    /* верстак */
    P(cx-20,14,44,3,'Y');P(cx-20,16,44,1,'O');P(cx-18,0,3,14,'W');P(cx+19,0,3,14,'W');P(cx-18,5,40,2,'X');
    P(cx-14,17,6,2,'G');P(cx-4,17,3,3,'H');S(cx+2,17,'g');S(cx+3,17,'g');
    /* лещата */
    const vw=tr>=3?9:5;P(cx+24-vw,15,vw,tr>=3?7:4,'G');P(cx+24-vw,tr>=3?21:18,vw,1,'H');P(cx+24,17,3,1,'z');
    /* інструменти на стіні */
    P(cx-26,24,30,4,'X');const nt=tr>=1?7:3;for(let i=0;i<nt;i++){const tx=cx-24+i*4;P(tx,28-6-(i%2)*2,1,6+(i%2)*2,i%3?'G':'H');if(i%2)P(tx-1,20,3,2,'F')}
    /* точильний круг */
    if(tr>=2){const gx=w-20;P(gx,0,2,9,'W');P(gx+10,0,2,9,'W');P(gx,8,12,2,'X');polyFill(b,Array.from({length:12},(_,a)=>[gx+6+Math.cos(a/12*6.283)*5,h-15+Math.sin(a/12*6.283)*5]),(x,y)=>pset(b,x,y,(x+y)%3?'F':'G'));S(gx+6,14,'D')}
    /* лампа */
    P(cx-2,h-6,1,6,'z');P(cx-4,h-9,7,3,'z');if(lit)P(cx-3,h-8,5,1,'I');return b}
  if(id==='study'){stairs(1,built);if(!built){ruin();for(let i=0;i<6;i++)S(10+i*5,1+(i%2),'O');return b}
    win(cx-6,22,10,12);
    /* полиці */
    const sh=tr>=1?2:1;for(let k=0;k<sh;k++){const bx=6+k*16;P(bx,0,14,34,'W');for(let r=0;r<4;r++){P(bx+1,2+r*8,12,1,'X');const nb=tr>=1?6:(r%2?2:4);for(let i=0;i<nb;i++)P(bx+1+i*2,3+r*8,2,5-(i%2),['i','k','e','o','t','d'][(i+r+k)%6])}}
    /* карта */
    if(tr>=2){P(cx+6,24,18,12,'O');P(cx+6,35,18,1,'b');pline(b,cx+8,h-28,cx+16,h-33,'L');pline(b,cx+16,h-33,cx+22,h-27,'L');S(cx+14,30,'j');S(cx+19,27,'j')}
    /* стіл, книга, свічка */
    const dx=w-34;P(dx,10,26,3,'X');P(dx,12,26,1,'Y');P(dx+1,0,2,10,'W');P(dx+23,0,2,10,'W');P(dx+6,13,8,2,'u');P(dx+10,13,1,2,'b');P(dx+16,13,4,1,'O');
    P(dx+21,13,2,4,'u');if(lit){S(dx+21,18,'I');S(dx+22,18,'J');S(dx+21,19,'J')}
    /* читальня: крісло й килим */
    if(tr>=3){P(cx-14,0,28,1,'i');for(let x=0;x<28;x+=3)S(cx-14+x,0,'g');P(cx-6,1,10,7,'v');P(cx-6,8,10,5,'v');P(cx-7,1,2,9,'t');P(cx+3,1,2,9,'t')}
    return b}
  if(id==='gallery'){stairs(-1,built);if(!built){ruin();return b}
    win(cx-22,10,14,18);win(cx+8,10,14,18);
    /* стіл із картами */
    P(cx-8,8,18,2,'X');P(cx-7,0,2,8,'W');P(cx+7,0,2,8,'W');P(cx-6,10,10,1,'O');
    if(tr>=1){/* великий далекогляд на тринозі */pline(b,cx+18,h-1,cx+22,h-12,'W');pline(b,cx+26,h-1,cx+22,h-12,'W');pline(b,cx+16,h-16,cx+34,h-22,'e');pline(b,cx+16,h-15,cx+34,h-21,'g');S(cx+34,22,'h')}else{P(cx-4,10,6,1,'e');S(cx+2,10,'g')}
    if(tr>=3){P(cx-30,18,7,7,'e');P(cx-29,19,5,5,'u');S(cx-27,22,'x');S(cx-26,21,'j')}
    if(lit)S(cx,h-3,'J');return b}
  if(id==='lantern'){
    if(!built){P(cx-10,0,20,4,'D');for(let i=0;i<5;i++)pline(b,cx-14+i*7,h-1,cx-12+i*7,h-4-i%3,'2');return b}
    P(cx-8,0,16,6,'G');P(cx-8,5,16,1,'H');
    if(tr>=2){polyFill(b,[[cx-18,h-6],[cx-14,4],[cx+14,4],[cx+18,h-6]],(x,y)=>pset(b,x,y,(x+y)%4?'q':'p'))}
    const won=st.won;polyFill(b,Array.from({length:20},(_,a)=>[cx+Math.cos(a/20*6.283)*11,h-22+Math.sin(a/20*6.283)*15]),(x,y)=>{const d=Math.hypot((EXX/SK-cx)/11,(EXY/SK-(h-22))/15);pset(b,x,y,won?(d<.35?'y':d<.6?'I':d<.85?'h':'U'):(Math.floor(d*5)%2?'U':'6'))});
    for(let r=0;r<4;r++)pline(b,cx-10,h-30+r*5,cx+10,h-30+r*5,won?'h':'5');
    if(tr>=1){polyFill(b,[[cx-3,h-40],[cx+3,h-40],[cx,h-34]],(x,y)=>pset(b,x,y,'u'));S(cx,38,'y')}
    if(tr>=3||won){P(cx-2,18,4,6,'K');P(cx-1,19,2,4,'I')}
    return b}
  return b}
towerShell3=HI(towerShell3);twRoom=HI(twRoom);

/* --- сцена --- */
function twSt(){return{ph:GR,gt:s.floors.gallery?fuL('gallery'):0}}
function towerBgImg(){const st=twSt(),sig='tw3:'+st.gt+GR;return pimgA(sig,()=>towerShell3(st),864,600,'scene','Маяк у розрізі',205,WATER3)}
function twRoomSt(id){const built=floorBuilt(id),on=id==='hall'?s.on.hearth!==false&&!!s.b.hearth:built;return{built,tr:built?fuL(id):0,lit:on,ph:GR,ember:id==='hall'&&!s.b.hearth&&s.f.looked,won:!!s.f.won,wood:id==='hall'?Math.round((s.r.wood||0)/30)*30:0}}
function towerScene(){return`<div class="scn tw" data-scn="tw" style="${scnD()}"><span data-sk="bg" data-sig="bg" class="scbg">${VH(towerBgImg)}</span>${towerHS()}</div>`}
function towerHS(){const W=TWW,H=TWH;let h=fogs(60,14)+mlaLayer(62,30);const nx=FL.find((f,ix)=>!s.floors[f.id]&&(ix===0||s.floors[FL[ix-1].id]));
  for(const id of TORDER){const st=twRoomSt(id),[x,y]=twBox(id),key='tw:'+id+[st.built?1:0,st.tr,st.lit?1:0,st.ember?1:0,st.won?1:0,st.wood].join('');
    const lq=id==='lantern'&&st.built&&(!s.f.won||!!s.lost),sp=obURL(key,()=>twRoom(id,st)),built=st.built,can=nx&&nx.id===id&&(!nx.req||nx.req())&&afford(nx.c,nx.it);
    h+=ob('fl:'+id,'bpop','fl:'+id,sp,x,y,W,H,FLN[id],`<b>${FLN[id]}</b><br>${built?'Відновлено. Натисни, щоб подивитися.':id==='hall'?'Тут має горіти вогнище.':nx&&nx.id===id?'Можна відбудувати.':'Ще в руїнах.'}`,{pulse:can||lq?1:0,always:can||lq?1:0,cls:(popB==='fl:'+id?'sel':'')+(built?'':' ruin')+(id==='lantern'&&s.lost?' bite':''),inner:id==='lantern'&&s.lost?'<i class="bang">!</i>':''})}
  h+=shelfHS(W,H);
  return h+fxCanvas('tw',W,H)+lightLayers(W,H,towerLights())}
function towerLights(){const fire=[],win=[];const rc=id=>{const[x,y,w,hh]=twBox(id);return[x+w/2,y+hh/2]};
  if(floorBuilt('hall')&&s.on.hearth!==false){const[x0,y0,w,hh]=twBox('hall'),fw=fuL('hall')>=1?34:26;fire.push({x:x0+6+fw/2,y:y0+hh-6,r:46,e:.7,c:FIRE,n:4})}
  if(floorBuilt('work')){const[x,y]=rc('work');win.push({x,y:y-12,r:30,e:.8,c:WARM,a:.75})}
  if(floorBuilt('study')){const[x0,y0,w,hh]=twBox('study');win.push({x:x0+w-13,y:y0+hh-18,r:22,e:.9,c:WARM,a:.8})}
  if(floorBuilt('gallery')){const[x,y]=rc('gallery');win.push({x,y:y+8,r:18,e:.8,c:WARM,a:.5})}
  if(s.f.won){const[x,y]=rc('lantern');win.push({x,y:y+4,r:70,c:PALE,a:.95})}else if(floorBuilt('lantern')){const[x,y]=rc('lantern');win.push({x,y,r:16,c:PALE,a:.4})}
  return{fire,win}}
