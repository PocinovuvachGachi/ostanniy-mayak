/* ============ v18: 2x living scenes ============ */
Object.assign(PAL,{A:'#070d16',B:'#0c1624',C:'#132235',D:'#24262b',E:'#34373d',F:'#4a4d54',G:'#666a71',H:'#8c9097',
  I:'#ffe08a',J:'#ffa640',K:'#e5662a',L:'#6f6551',M:'#968a6e',N:'#b8ab8a',O:'#d6cba9',P:'#0c2230',Q:'#12344a',R:'#1a4862',S:'#265f7c',T:'#4f8aa3',U:'#9ccbd8',
  V:'#2e1c10',W:'#4d311b',X:'#77502b',Y:'#a5743f',Z:'#3e5230',r:'#5d7a3a',s:'#2a3a22',t:'#7a2e22',u:'#e6efe9',v:'#a54a32',w:'#c46a45',x:'#0a0c10',y:'#ffffff',z:'#3a4048'});
const BAY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const bay=(x,y)=>BAY[y&3][x&3]/16;
/* vertical ramp with ordered dithering */
function rampV(b,x,y,w,h,cols){const n=cols.length-1;if(b.k!==1){const k=b.k,X0=Math.round(x*k),X1=Math.round((x+w)*k),Y0=Math.round(y*k),HH=Math.round((y+h)*k)-Y0;
    for(let j=0;j<HH;j++){const t=HH>1?j/(HH-1)*n:0,kk=Math.min(n-1,Math.floor(t)),f=t-kk;for(let i=X0;i<X1;i++)phx(b,i,Y0+j,f>bay(i,Y0+j)?cols[Math.min(n,kk+1)]:cols[kk])}return}for(let j=0;j<h;j++){const t=h>1?j/(h-1)*n:0,k=Math.min(n-1,Math.floor(t)),f=t-k;for(let i=0;i<w;i++)pset(b,x+i,y+j,f>bay(x+i,y+j)?cols[Math.min(n,k+1)]:cols[k])}}
function ditherBlend(b,x,y,w,h,c,amt){if(b.k!==1){const k=b.k;for(let j=Math.round(y*k);j<Math.round((y+h)*k);j++)for(let i=Math.round(x*k);i<Math.round((x+w)*k);i++)if(amt>bay(i,j))phx(b,i,j,c);return}for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(amt>bay(x+i,y+j))pset(b,x+i,y+j,c)}
function polyFill(b,pts,fn){let y0=Infinity,y1=-Infinity;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}
  if(b.k&&b.k!==1){const k=b.k,sv=[EXB,EXX,EXY,EXL,EXT];EXB=b;try{for(let hy=Math.floor(y0*k);hy<=y1*k;hy++){const y=hy/k,xs=[];for(let i=0;i<pts.length;i++){const[a,c]=[pts[i],pts[(i+1)%pts.length]];if((a[1]<=y&&c[1]>y)||(c[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(c[0]-a[0])/(c[1]-a[1]))}
      xs.sort((p,q)=>p-q);for(let q=0;q+1<xs.length;q+=2)for(let hx=Math.ceil(xs[q]*k);hx<xs[q+1]*k;hx++){EXX=hx;EXY=hy;EXL=Math.floor(hx/k);EXT=Math.floor(y);fn(EXL,EXT)}}}finally{[EXB,EXX,EXY,EXL,EXT]=sv}return}
  for(let y=Math.floor(y0);y<=y1;y++){const xs=[];for(let i=0;i<pts.length;i++){const[a,c]=[pts[i],pts[(i+1)%pts.length]];if((a[1]<=y&&c[1]>y)||(c[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(c[0]-a[0])/(c[1]-a[1]))}
    xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]);x<xs[k+1];x++)fn(x,y)}}
function outline2(b,c){if(b.k!==1){const W=b.W+4,H=b.H+4,o={w:b.w+2*OP,h:b.h+2*OP,k:b.k,W,H,p:new Array(W*H).fill('.')},g=(X,Y)=>X>=0&&Y>=0&&X<b.W&&Y<b.H?b.p[Y*b.W+X]:'.';
    const r1=new Uint8Array(W*H);for(let y=-2;y<b.H+2;y++)for(let x=-2;x<b.W+2;x++){if(g(x,y)!=='.')continue;if(g(x+1,y)!=='.'||g(x-1,y)!=='.'||g(x,y+1)!=='.'||g(x,y-1)!=='.'){r1[(y+2)*W+x+2]=1;o.p[(y+2)*W+x+2]=c}}
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(r1[y*W+x]||g(x-2,y-2)!=='.')continue;if((x+1<W&&r1[y*W+x+1])||(x>0&&r1[y*W+x-1])||(y+1<H&&r1[(y+1)*W+x])||(y>0&&r1[(y-1)*W+x]))o.p[y*W+x]=c}return o}
  const o=pbuf(b.w+2,b.h+2);for(let y=-1;y<=b.h;y++)for(let x=-1;x<=b.w;x++){if(pget(b,x,y)!=='.')continue;
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(pget(b,x+dx,y+dy)!=='.'){pset(o,x+1,y+1,c);break}}return o}
/* generic hut: ramps dark->light */
function hut(w,wallH,roofH,o){const b=pbuf(w,wallH+roofH+(o.chim?8:0));const top=o.chim?8:0,wy=top+roofH;
  const wr=o.wall,rr=o.roof;prect(b,1,wy,w-2,wallH,wr[1]);
  {const k=b.k||1,Y0=Math.round(wy*k);if(o.brick)hiRect(b,1,wy,w-2,wallH,(i,j)=>{const ly=j-Y0,row=Math.floor(ly/3),off=row%2?3:0,bi=Math.floor((i+off)/7);return ly%3===2||(i+off)%7===0?wr[0]:hh2(bi,row)<.18?wr[2]:hh2(bi+7,row)<.12?wr[0]:null});
    else hiRect(b,1,wy,w-2,wallH,(i,j)=>{const p=Math.floor(i/4);return i%4===3?wr[0]:hh2(p,j>>1)<.07?wr[2]:hh2(p*3,j)<.04?wr[0]:null})}
  prect(b,1,wy,1,wallH,wr[2]);prect(b,w-2,wy,1,wallH,wr[0]);prect(b,1,wy+wallH-1,w-2,1,wr[0]);
  {const k=b.k||1;for(let hj=Math.round(top*k);hj<Math.round((top+roofH)*k);hj++){const jf=Math.min(roofH-1,hj/k-top),ins=(roofH-1-jf)*(w/2-2)/Math.max(1,roofH-1)*(o.flat?0.35:1),X0=Math.round(ins*k),X1=Math.round((w-ins)*k),row=Math.floor(hj/4),off=row%2?3:0;
    for(let hx=X0;hx<X1;hx++){const sh=hx<w*k/2?rr[2]:rr[1];phx(b,hx,hj,hx===X0||hx===X1-1||hj%4===3||((hx+off)%6===0&&hj%4>1)?rr[0]:hh2(Math.floor((hx+off)/6),row)<.15?rr[1]:sh)}}}
  if(o.door){const dw=o.dw||4,dx=o.dx!=null?o.dx:Math.floor(w/2-dw/2),dh=Math.min(wallH-1,o.dh||7);prect(b,dx,wy+wallH-dh,dw,dh,o.glow?'K':'x');if(o.glow){prect(b,dx+1,wy+wallH-dh+2,dw-2,dh-2,'J');prect(b,dx+1,wy+wallH-3,dw-2,2,'I')}prect(b,dx-1,wy+wallH-dh-1,dw+2,1,wr[0])}
  if(o.win)for(const wx of o.win){prect(b,wx,wy+3,3,3,o.lit?'J':'x');if(o.lit)pset(b,wx+1,wy+4,'I');prect(b,wx-1,wy+6,5,1,wr[2])}
  if(o.chim){const cx=o.chimX||w-6;prect(b,cx,1,3,top+Math.floor(roofH/2),'F');prect(b,cx,1,1,top+Math.floor(roofH/2),'G');prect(b,cx-1,0,5,1,'E')}
  return b}
function barrel(b,x,y){prect(b,x,y,6,7,'X');prect(b,x,y,1,7,'W');prect(b,x+5,y,1,7,'V');prect(b,x,y+1,6,1,'z');prect(b,x,y+5,6,1,'z');pset(b,x+2,y,'Y')}
function logs2(b,x,y,n){for(let i=0;i<n;i++){const r=Math.floor(i/3),c=i%3,lx=x+c*7+r*3,ly=y-r*4;prect(b,lx,ly,7,3,'X');prect(b,lx,ly,7,1,'Y');prect(b,lx,ly+2,7,1,'W');prect(b,lx,ly,1,3,'O');pset(b,lx,ly+1,'M');prect(b,lx+6,ly,1,3,'V')}}
function stones(b,x,y,w,h,seed){const R=rng(seed);if(b.k&&b.k!==1){const k=b.k,X0=Math.round(x*k),Y0=Math.round(y*k),Wh=Math.round(w*k),Hh=Math.round(h*k);for(let n=0;n<Wh*Hh/11;n++){const sx=X0+Math.floor(R()*Wh),sy=Y0+Math.floor(R()*Hh),s=2+Math.floor(R()*3),c=R()<.3?'G':'F';for(let j=0;j<s;j++)for(let i=0;i<s+1;i++){if((i===0||i===s)&&(j===0||j===s-1))continue;phx(b,sx+i,sy+j,j===s-1?'D':(i<2&&j<1)?'H':c)}}return}for(let k=0;k<w*h/9;k++){const sx=x+Math.floor(R()*w),sy=y+Math.floor(R()*h),s=1+Math.floor(R()*3);prect(b,sx,sy,s+1,s,'F');pset(b,sx,sy,'H');prect(b,sx,sy+s-1,s+1,1,'D')}}
/* ---------- YARD BACKGROUND 288x160 ---------- */
function yardBg2(st){const W=288,H=160,b=pbuf(W,H);
  if(!st.looked){prect(b,0,0,W,H,'x');if(st.lk){for(let i=0;i<6;i++)prect(b,84+i*6,128-i*4,6,1,'B')}return b}
  rampV(b,0,0,W,80,st.won?['B','C','1','2','3']:['A','B','C','1','2']);
  const R=rng(7);for(let i=0;i<70;i++){const x=Math.floor(R()*W),y=Math.floor(R()*60);pset(b,x,y,R()<.15?'y':R()<.5?'6':'5')}
  /* far islands */
  polyFill(b,[[150,80],[168,72],[186,74],[198,80]],(x,y)=>pset(b,x,y,'1'));polyFill(b,[[220,80],[236,70],[252,68],[268,75],[288,73],[288,80]],(x,y)=>pset(b,x,y,'1'));
  for(let x=168;x<186;x+=3)pset(b,x,73,'2');for(let x=236;x<266;x+=3)pset(b,x,70,'2');
  /* sea */
  rampV(b,0,80,W,80,['T','S','R','Q','P']);const R2=rng(9);
  for(let i=0;i<140;i++){const x=Math.floor(R2()*W),y=82+Math.floor(R2()*76),l=2+Math.floor(R2()*5);prect(b,x,y,l,1,y<100?'U':'T')}
  /* land */
  const land=[[0,160],[0,108],[22,100],[40,96],[96,100],[140,104],[190,110],[214,120],[232,136],[246,160]];
  polyFill(b,land,(x,y)=>pset(b,x,y,y<106?'N':'M'));
  ditherBlend(b,0,96,250,64,'L',0.18);pnoise(b,0,96,250,64,'O',0.05,21);pnoise(b,0,96,250,64,'L',0.08,22);
  /* rock under tower */
  polyFill(b,[[14,160],[18,128],[30,118],[90,116],[104,128],[110,160]],(x,y)=>pset(b,x,y,(x+y*3)%11<2?'D':((x*7+y)%9<4?'E':'F')));
  stones(b,16,120,94,40,31);
  /* grass tufts */
  const R3=rng(12);for(let i=0;i<50;i++){const x=Math.floor(R3()*200)+6,y=100+Math.floor(R3()*40);if(pget(b,x,y)==='M'||pget(b,x,y)==='N'||pget(b,x,y)==='L'){pset(b,x,y,'r');pset(b,x+1,y-1,'Z');pset(b,x-1,y-1,'r')}}
  /* foam along coast */
  for(let i=0;i<land.length-1;i++){const[a,c]=[land[i],land[i+1]];if(a[0]<140)continue;const n=Math.max(Math.abs(c[0]-a[0]),Math.abs(c[1]-a[1]));for(let k=0;k<=n;k++){const x=Math.round(a[0]+(c[0]-a[0])*k/n),y=Math.round(a[1]+(c[1]-a[1])*k/n);pset(b,x+1,y,'u');pset(b,x+2,y,'U');if(k%3===0)pset(b,x+3,y,'u')}}
  /* path to shore */
  for(let k=0;k<=60;k++){const x=Math.round(104+k*1.75),y=Math.round(134+k*0.42);pset(b,x,y,'O');pset(b,x+1,y,'O');pset(b,x,y+1,'N');if(k%4===0)pset(b,x+2,y+1,'O')}
  /* wood pile */
  if(st.hearth)logs2(b,104,150,Math.min(9,1+Math.floor((st.wood||0)/25)));
  /* beam when won */
  if(st.won){for(let i=0;i<140;i++){const x=72+i,y0=26-i*0.22;for(let d=-1-i*0.06;d<=1+i*0.06;d++){const y=Math.round(y0+d);if(y>=0&&(i+y)%2===0)pset(b,x,y,i<60?'I':'h')}}
    for(let i=0;i<40;i++){const x=48-i,y0=26-i*0.22;for(let d=-1;d<=1;d++){const y=Math.round(y0+d);if(x>=0&&y>=0&&(x+y)%2===0)pset(b,x,y,'h')}}}
  /* boats */
  if(st.boat){prect(b,204,128,22,4,'W');prect(b,206,132,18,2,'V');prect(b,204,128,22,1,'Y');prect(b,214,112,2,16,'X');polyFill(b,[[216,112],[226,126],[216,126]],(x,y)=>pset(b,x,y,(x+y)%5?'6':'5'))}
  if(st.schooner){const x=224,y=96;polyFill(b,[[x,y],[x+46,y],[x+40,y+8],[x+6,y+8]],(px,py)=>pset(b,px,py,py<y+2?'Y':'W'));prect(b,x+16,y-28,2,28,'X');prect(b,x+30,y-24,2,24,'X');
    polyFill(b,[[x+18,y-26],[x+28,y-4],[x+18,y-4]],(px,py)=>pset(b,px,py,(px+py)%6?'u':'6'));polyFill(b,[[x+32,y-22],[x+42,y-4],[x+32,y-4]],(px,py)=>pset(b,px,py,(px+py)%6?'6':'5'));pset(b,x+16,y-30,'g')}
  /* people */
  for(let i=0;i<Math.min(6,st.pop||0);i++){const x=118+i*13,y=152-(i%2)*3;prect(b,x,y-6,2,2,'m');prect(b,x-1,y-4,4,3,['X','S','r','v','Y','T'][i]);prect(b,x,y-1,1,1,'x');prect(b,x+1,y-1,1,1,'x')}
  return b}
/* ---------- YARD OBJECTS ---------- */
function towerObj(st){const W=50,H=128,b=pbuf(W,H),F=st.floors||{};const cx=25;
  const hwAt=y=>Math.round(12+(y-30)*0.09);
  for(let y=30;y<H;y++){const hw=hwAt(y);for(let x=cx-hw;x<cx+hw;x++){const row=Math.floor((y-30)/4),off=row%2?3:0,mort=(y-30)%4===3||((x+off)%6===0);
      const shade=x<cx-hw+3?'G':x>cx+hw-5?'D':x>cx+hw-9?'E':'F';pset(b,x,y,mort?(shade==='D'?'x':'D'):shade)}}
  /* cracks when ruined */
  if(!st.won){pline(b,cx-6,60,cx-2,72,'D');pline(b,cx+4,84,cx+8,96,'D')}
  /* bands */
  for(const y of[56,82,104])prect(b,cx-hwAt(y)-1,y,hwAt(y)*2+2,2,'H');
  /* windows by floor */
  const winY={lantern:0,gallery:40,study:66,work:90};
  for(const k of['gallery','study','work']){const y=winY[k];const lit=!!F[k];prect(b,cx-3,y,6,8,'x');if(lit){prect(b,cx-2,y+1,4,6,'J');prect(b,cx-1,y+2,2,3,'I')}else{pset(b,cx-1,y+3,'B')}prect(b,cx-4,y+8,8,1,'H')}
  /* door */
  prect(b,cx-5,H-16,10,16,'x');if(st.hearth){prect(b,cx-4,H-14,8,14,'K');prect(b,cx-3,H-12,6,12,'J');prect(b,cx-2,H-6,4,6,'I')}prect(b,cx-6,H-17,12,1,'H');
  /* gallery & lantern room */
  prect(b,cx-15,28,30,3,'H');prect(b,cx-15,30,30,1,'E');for(let x=cx-14;x<cx+15;x+=3)prect(b,x,24,1,4,'G');prect(b,cx-15,23,30,1,'G');
  const lit=st.won,lantern=!!F.lantern;prect(b,cx-8,10,16,14,'E');
  for(let x=cx-7;x<cx+8;x++)for(let y=11;y<23;y++){const glass=(x-cx+7)%5!==4;pset(b,x,y,glass?(lit?(y<15?'I':'h'):lantern?'S':'B'):'z')}
  if(lit){prect(b,cx-2,14,4,6,'y');pset(b,cx-1,13,'I')}
  polyFill(b,[[cx-10,10],[cx,1],[cx+10,10]],(x,y)=>pset(b,x,y,x<cx?'z':'E'));prect(b,cx,0,1,2,'H');prect(b,cx-10,9,20,1,'D');
  return b}
function hearthObj(st){const b=pbuf(26,12);if(!st.hearth){prect(b,9,7,8,3,'D');pset(b,12,7,'K');pset(b,13,7,'J');pset(b,13,6,'I');prect(b,8,9,10,1,'E');return b}
  for(let i=0;i<9;i++){const x=1+i*3;prect(b,x,8,3,3,i%2?'F':'G');pset(b,x,8,'H');pset(b,x+2,10,'D')}
  prect(b,6,5,14,3,'W');prect(b,6,5,14,1,'X');prect(b,8,3,10,2,'X');prect(b,8,3,10,1,'Y');prect(b,4,7,18,1,'K');pset(b,7,6,'J');pset(b,17,6,'J');return b}
function emberObj(){const b=pbuf(10,6);prect(b,3,3,4,2,'D');pset(b,4,3,'K');pset(b,5,3,'J');pset(b,5,2,'I');pset(b,4,2,'J');prect(b,2,5,6,1,'E');return b}
function flame2Strip(){const b=pbuf(36,18);for(let k=0;k<3;k++){const R=rng(190+k);for(let y=0;y<18;y++){const t=y/17,w=Math.max(1,Math.min(12,Math.round(1+t*10+(R()-.5)*2.4))),sh=y<10?Math.round((R()-.5)*2.4*(1-t)):0,x0=k*12+6-Math.floor(w/2)+sh;
  for(let x=0;x<w;x++){const e=x===0||x===w-1,c=y<3?'K':e?'K':y>9&&x>1&&x<w-2?(y>13?'y':'I'):'J';pset(b,x0+x,y,c)}}
  for(let s=0;s<3;s++){const sx=k*12+2+Math.floor(R()*8),sy=Math.floor(R()*6);pset(b,sx,sy,'J')}}return b}
function signObj(){const b=pbuf(14,18);prect(b,6,4,2,14,'W');prect(b,6,4,1,14,'X');prect(b,0,3,13,6,'X');prect(b,0,3,13,1,'Y');prect(b,0,8,13,1,'W');polyFill(b,[[13,3],[14,6],[13,9]],(x,y)=>pset(b,x,y,'X'));for(let x=2;x<11;x+=2)pset(b,x,5,'V');prect(b,2,6,8,1,'V');return b}
const BOBJ={
  forge:()=>{const b=hut(30,16,10,{wall:['D','F','G'],roof:['x','E','z'],brick:1,door:1,glow:1,dw:6,dh:10,chim:1,chimX:22});return b},
  smoke:()=>hut(24,12,9,{wall:['V','W','X'],roof:['V','W','X'],door:1,dw:4,dh:7,chim:1,chimX:4,win:[16]}),
  kiln:()=>{const b=pbuf(20,22);polyFill(b,[[1,22],[2,10],[6,4],[14,4],[18,10],[19,22]],(x,y)=>pset(b,x,y,(y%3===0||(x+(y>>1))%4===0)?'t':x<9?'w':'v'));prect(b,7,15,6,7,'x');prect(b,8,17,4,5,'K');prect(b,9,19,2,3,'I');prect(b,8,0,4,5,'F');return b},
  dummy:()=>{const b=pbuf(14,24);prect(b,6,6,2,18,'W');prect(b,6,6,1,18,'X');prect(b,1,10,12,2,'X');prect(b,1,10,12,1,'Y');prect(b,4,0,6,6,'N');prect(b,4,0,6,1,'O');pset(b,5,2,'x');pset(b,8,2,'x');prect(b,3,12,8,6,'M');prect(b,3,12,1,6,'N');return b},
  winch:()=>{const b=pbuf(30,28);prect(b,2,20,24,4,'W');prect(b,2,20,24,1,'Y');for(let i=0;i<12;i++){pset(b,6+i,20-i*1.4,'X');pset(b,7+i,20-i*1.4,'W')}pline(b,18,3,26,10,'X');pline(b,26,10,26,24,'H');prect(b,24,24,5,3,'G');prect(b,4,16,6,5,'F');pset(b,6,17,'H');return b},
  boom:()=>{const b=pbuf(60,10);for(let i=0;i<5;i++){const x=i*12;prect(b,x,4,10,4,'X');prect(b,x,4,10,1,'Y');prect(b,x,7,10,1,'V');prect(b,x,4,1,4,'O');if(i)prect(b,x-2,5,2,1,'H')}return b},
  traps:()=>{const b=pbuf(60,14);for(let i=0;i<5;i++){const x=i*12+2,y=(i%2)*4;prect(b,x,y+2,5,5,'j');prect(b,x,y+2,5,2,'u');pset(b,x+2,y,'X');pset(b,x+2,y+1,'X');pline(b,x+5,y+5,x+11,y+7,'H')}return b},
  pot:()=>{const b=pbuf(28,12);for(let i=0;i<3;i++){const x=i*9,y=(i%2)*2;prect(b,x,y+2,8,7,'z');for(let k=1;k<8;k+=2)prect(b,x+k,y+3,1,5,'H');prect(b,x,y+2,8,1,'G');prect(b,x+3,y,2,2,'X')}return b},
  render:()=>{const b=pbuf(30,14);for(let i=0;i<3;i++)barrel(b,1+i*9,5);prect(b,0,12,30,2,'D');pset(b,5,12,'K');pset(b,14,12,'J');pset(b,23,12,'K');return b},
  steel:()=>{const b=pbuf(24,32);prect(b,15,0,6,18,'F');prect(b,15,0,1,18,'G');prect(b,14,0,8,2,'E');const h=hut(24,14,6,{wall:['D','F','G'],roof:['x','E','z'],brick:1,door:1,glow:1,dw:6,dh:8});for(let y=0;y<h.h;y++)for(let x=0;x<h.w;x++){const c=h.p[y*h.w+x];if(c!=='.')pset(b,x,y+32-h.h,c)}return b},
  coalpit:()=>{const b=pbuf(22,12);polyFill(b,[[0,12],[4,4],[11,0],[18,4],[22,12]],(x,y)=>pset(b,x,y,(x*3+y)%7<2?'x':y<4?'W':'V'));pset(b,8,8,'K');pset(b,13,6,'J');pset(b,10,10,'K');pset(b,15,9,'I');return b},
  glass:()=>{const b=pbuf(18,16);polyFill(b,[[1,16],[2,7],[6,2],[12,2],[16,7],[17,16]],(x,y)=>pset(b,x,y,(y%3===0)?'F':x<9?'H':'G'));prect(b,6,9,6,7,'x');prect(b,7,11,4,5,'J');prect(b,8,12,2,3,'y');return b},
  apoth:()=>{const b=hut(22,10,7,{wall:['W','X','Y'],roof:['Z','r','s'],door:1,dw:4,dh:6,win:[15],lit:1});return b},
  garden:()=>{const b=pbuf(28,8);for(let r=0;r<3;r++){prect(b,0,r*3+2,28,2,'W');for(let x=1;x<27;x+=3){pset(b,x,r*3+1,'r');pset(b,x+1,r*3+1,'Z');pset(b,x,r*3,'r')}}return b},
  sandpit:()=>{const b=pbuf(28,10);for(let i=0;i<3;i++)polyFill(b,[[i*9,10],[i*9+4,3],[i*9+9,10]],(x,y)=>pset(b,x,y,x<i*9+4?'O':'N'));pline(b,24,0,20,9,'X');prect(b,18,8,4,2,'H');return b},
  shipyard:()=>{const b=pbuf(44,20);prect(b,0,16,44,3,'W');prect(b,0,16,44,1,'Y');for(let i=0;i<7;i++){const x=4+i*6;pline(b,x,16,x-3,4+(i%2)*2,'X');pline(b,x+1,16,x-2,4+(i%2)*2,'Y')}prect(b,0,6,40,1,'W');return b},
  house:()=>hut(22,11,9,{wall:['V','W','X'],roof:['t','v','w'],door:1,dw:4,dh:7,win:[15],lit:1,chim:1,chimX:4})};
const BPOS2={forge:[104,82],smoke:[138,90],kiln:[164,94],dummy:[92,106],winch:[200,84],boom:[226,124],traps:[230,140],pot:[198,146],render:[122,118],steel:[184,80],coalpit:[154,120],glass:[214,104],apoth:[150,134],garden:[0,150],sandpit:[176,140],shipyard:[240,100],house:[0,116]};
const BSMK={forge:[22,1],smoke:[4,1],kiln:[9,0],steel:[17,0],coalpit:[11,0],house:[4,1]};
/* fog strip 96x24 */
function fogBuf(seed){const b=pbuf(96,24);const R=rng(seed);for(let k=0;k<7;k++){const cx=Math.floor(R()*96),cy=6+Math.floor(R()*12),rx=10+Math.floor(R()*16),ry=3+Math.floor(R()*4);
  for(let y=cy-ry;y<=cy+ry;y++)for(let x=cx-rx;x<=cx+rx;x++){const d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<1&&(1-d)>bay((x+96)%96,y)*0.9){pset(b,(x+96)%96,y,d<.4?'6':'5')}}}return b}
/* ---------- SHORE 192x80 ---------- */
function shoreBg2(st){const W=192,H=80,b=pbuf(W,H);rampV(b,0,0,W,16,['C','1','2','4']);
  rampV(b,0,14,W,40,['T','S','R','Q','R']);const R=rng(41);for(let i=0;i<110;i++){const x=Math.floor(R()*W),y=16+Math.floor(R()*36),l=2+Math.floor(R()*6);prect(b,x,y,l,1,y<24?'U':(R()<.5?'T':'S'))}
  for(const[yy,c]of[[44,'u'],[48,'U'],[51,'u']]){for(let x=0;x<W;x++){const y=yy+Math.round(Math.sin(x/9+yy)*1.2);pset(b,x,y,c);if(x%4)pset(b,x,y+1,c==='u'?'U':'T')}}
  rampV(b,0,52,W,8,['M','L','M']);rampV(b,0,58,W,22,['N','N','O']);pnoise(b,0,58,W,22,'M',0.1,44);pnoise(b,0,58,W,22,'L',0.04,45);pnoise(b,0,52,W,8,'T',0.06,46);
  for(let i=0;i<14;i++){const R3=rng(60+i),x=Math.floor(R3()*W),y=60+Math.floor(R3()*18);pset(b,x,y,'r');pset(b,x+1,y,'Z');pset(b,x+2,y-1,'r')}
  /* tower base */
  for(let y=0;y<62;y++)for(let x=0;x<22;x++){const row=y>>2,mort=(y%4===3)||((x+(row%2?3:0))%6===0);pset(b,x,y,mort?'D':x<4?'G':x>17?'E':'F')}
  stones(b,0,60,30,20,71);
  /* wood pile */
  logs2(b,28,74,Math.min(9,Math.ceil((st.wood||0)/15)));
  if(st.scrapSeen){const n=Math.min(5,Math.ceil((st.scrap||0)/12));for(let i=0;i<n;i++){prect(b,62+i*3,73-i,8-i,2,i%2?'H':'G');pset(b,63+i*3,72-i,'q')}}
  if(st.fishSeen&&(st.fish||0)>=1){prect(b,88,66,14,8,'X');for(let x=88;x<102;x+=2)prect(b,x,66,1,8,'W');prect(b,88,66,14,1,'Y');for(let i=0;i<Math.min(4,Math.ceil(st.fish/8));i++){prect(b,90+i*3,64,3,2,'T');pset(b,90+i*3,64,'U')}}
  for(let i=0;i<Math.min(3,st.pot||0);i++){const x=58+i*11,y=50+(i%2)*2;prect(b,x,y,8,7,'z');for(let k=1;k<8;k+=2)prect(b,x+k,y+1,1,5,'H');prect(b,x,y,8,1,'G')}
  return b}
function wreckObj(){const b=pbuf(46,22);polyFill(b,[[0,14],[6,6],[30,4],[44,8],[40,18],[8,20]],(x,y)=>pset(b,x,y,y<9?'Y':(x+y)%7===0?'V':y<14?'X':'W'));
  for(let i=0;i<6;i++){const x=10+i*5;pline(b,x,6,x+2,0+(i%2)*2,'W');pline(b,x+1,6,x+3,0+(i%2)*2,'X')}prect(b,16,10,4,3,'x');prect(b,28,12,3,2,'x');for(let x=4;x<40;x+=6)pset(b,x,12,'H');
  polyFill(b,[[0,20],[46,20],[46,22],[0,22]],(x,y)=>pset(b,x,y,'L'));return b}
function rodObj(){const b=pbuf(16,44);pline(b,2,43,8,4,'W');pline(b,3,43,9,4,'X');prect(b,0,40,6,4,'L');pline(b,8,4,13,24,'6');pset(b,9,4,'Y');prect(b,1,28,3,3,'G');return b}
function pierObj(st){const b=pbuf(38,20);prect(b,0,6,38,4,'X');prect(b,0,6,38,1,'Y');for(let x=0;x<38;x+=4)pset(b,x,7,'W');prect(b,0,9,38,1,'V');for(let x=3;x<38;x+=9)prect(b,x,10,2,10,'W');
  if(!st.boatOut){prect(b,6,1,20,4,'W');prect(b,8,4,16,2,'V');prect(b,6,1,20,1,'Y');prect(b,15,0,1,1,'X')}return b}
function shipObj(){const b=pbuf(40,30);polyFill(b,[[0,20],[40,20],[34,28],[6,28]],(x,y)=>pset(b,x,y,y<22?'Y':y<25?'X':'W'));prect(b,18,0,2,20,'X');
  polyFill(b,[[20,1],[34,17],[20,17]],(x,y)=>pset(b,x,y,(x+y)%6?'u':'6'));polyFill(b,[[17,3],[5,17],[17,17]],(x,y)=>pset(b,x,y,(x+y)%6?'6':'5'));prect(b,14,0,6,2,'j');return b}
function flotObj(k){const b=pbuf(16,12);if(k==='bottle'){prect(b,3,6,8,4,'r');prect(b,3,6,8,1,'U');prect(b,11,7,3,2,'u');prect(b,1,8,2,1,'X')}
  else if(k==='barrel'||k==='cargo'){barrel(b,4,3);if(k==='cargo'){prect(b,11,6,5,5,'X');prect(b,11,6,5,1,'Y')}}
  else if(k==='survivor'){prect(b,0,8,16,3,'W');prect(b,2,5,8,3,'S');prect(b,10,4,3,3,'m');prect(b,10,3,3,1,'x')}
  else{prect(b,2,3,12,9,'X');prect(b,2,3,12,2,'Y');prect(b,2,7,12,1,'W');prect(b,2,3,1,9,'W');prect(b,13,3,1,9,'V');pset(b,7,8,'g')}return b}
function log2Buf(){const b=pbuf(18,7);prect(b,2,1,14,5,'X');prect(b,2,1,14,1,'Y');prect(b,2,5,14,1,'V');prect(b,0,2,2,3,'O');pset(b,0,3,'M');prect(b,16,2,2,3,'N');pset(b,6,3,'W');pset(b,11,2,'W');return b}
function doorObj(st){const b=pbuf(14,26);prect(b,0,0,14,2,'H');prect(b,1,2,12,24,'x');prect(b,2,3,10,23,'V');for(let x=4;x<12;x+=3)prect(b,x,3,1,23,'W');pset(b,10,14,'g');return b}
function frameBuf(k){const S=12,b=pbuf(S,S);
  if(k==='paper'){prect(b,0,0,S,S,'O');for(let i=0;i<S;i++){const n=hh2(i,7);pset(b,i,0,n<.4?'.':'d');pset(b,i,1,n<.4?'d':'b');pset(b,i,S-1,hh2(i,3)<.4?'.':'d');pset(b,i,S-2,hh2(i,3)<.4?'d':'b');pset(b,0,i,hh2(i,5)<.4?'.':'d');pset(b,1,i,hh2(i,5)<.4?'d':'b');pset(b,S-1,i,hh2(i,9)<.4?'.':'d');pset(b,S-2,i,hh2(i,9)<.4?'d':'b')}prect(b,3,3,6,6,'.');return b}
  if(k==='slate'){prect(b,0,0,S,S,'1');prect(b,0,0,S,1,'3');prect(b,0,0,1,S,'3');prect(b,0,S-1,S,1,'0');prect(b,S-1,0,1,S,'0');prect(b,1,1,S-2,1,'2');prect(b,1,1,1,S-2,'2');prect(b,3,3,6,6,'.');for(const[x,y]of[[1,1],[10,1],[1,10],[10,10]])pset(b,x,y,'5');return b}
  const c=k==='wood'?['V','W','X','Y']:k==='drift'?['z','G','H','6']:['D','E','F','G'];
  prect(b,0,0,S,S,c[1]);prect(b,0,0,S,1,c[3]);prect(b,0,0,1,S,c[3]);prect(b,0,S-1,S,1,c[0]);prect(b,S-1,0,1,S,c[0]);prect(b,3,3,6,6,'.');prect(b,3,3,6,1,c[0]);prect(b,3,3,1,6,c[0]);
  for(const[x,y]of[[1,1],[10,1],[1,10],[10,10]])pset(b,x,y,'q');pset(b,6,1,c[2]);pset(b,1,6,c[2]);return b}

function towerSil(st){const t=towerObj(Object.assign({},st,{hearth:0,won:0,floors:{}}));const b=pbuf(t.w,t.h);for(let y=0;y<t.h;y++)for(let x=0;x<t.w;x++)if(t.p[y*t.w+x]!=='.'){const e=pget(t,x-1,y)==='.'||pget(t,x+1,y)==='.'||pget(t,x,y-1)==='.';pset(b,x,y,e?'C':((x+y)%5===0?'B':'A'))}return b}
function yardFull2(st){const b=yardBg2(st);if(!st.looked)return b;const bl=(o,x,y)=>{for(let j=0;j<o.h;j++)for(let i=0;i<o.w;i++){const c=o.p[j*o.w+i];if(c!=='.')pset(b,x+i,y+j,c)}};
  const L=st.b||{};if(L.house>1)bl(BOBJ.house(),4,94);for(const k in BPOS2)if(L[k])bl(BOBJ[k](),BPOS2[k][0],BPOS2[k][1]);bl(towerObj(st),36,4);bl(hearthObj(st),82,138);return b}
