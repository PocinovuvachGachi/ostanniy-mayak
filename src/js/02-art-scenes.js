/* ============ v19: 1.5x scenes with building stages ============ */
const YW=432,YH=240,SW=288,SH=120;
function blitTo(b,o,x,y){if(o.k===b.k&&b.k!==1){const ox=Math.round(x*b.k),oy=Math.round(y*b.k);for(let j=0;j<o.H;j++)for(let i=0;i<o.W;i++){const c=o.p[j*o.W+i];if(c!=='.')phx(b,ox+i,oy+j,c)}return}for(let j=0;j<o.h;j++)for(let i=0;i<o.w;i++){const c=pget(o,i,j);if(c!=='.')pset(b,x+i,y+j,c)}}
function merge(parts){let x0=0,y0=0,x1=0,y1=0;for(const[o,x,y]of parts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+o.w);y1=Math.max(y1,y+o.h)}const b=pbuf(x1-x0,y1-y0);for(const[o,x,y]of parts)blitTo(b,o,x-x0,y-y0);return b}
function rack(n,fish){const b=pbuf(6+n*6,16);prect(b,0,2,2,14,'W');prect(b,b.w-2,2,2,14,'W');prect(b,0,2,b.w,1,'X');prect(b,0,7,b.w,1,'X');
  if(fish)for(let i=0;i<n*2;i++){const x=3+i*3;prect(b,x,3,2,4,i%2?'T':'S');pset(b,x,3,'U');prect(b,x,8,2,4,i%2?'Y':'X')}return b}
function crate(w){const b=pbuf(w,w);prect(b,0,0,w,w,'X');prect(b,0,0,w,1,'Y');prect(b,0,0,1,w,'Y');prect(b,w-1,0,1,w,'V');prect(b,0,w-1,w,1,'V');pline(b,1,1,w-2,w-2,'W');return b}
function anvil(){const b=pbuf(12,8);prect(b,0,0,12,3,'G');prect(b,0,0,12,1,'H');prect(b,4,3,4,3,'F');prect(b,2,6,8,2,'E');return b}
function ore(n){const b=pbuf(4+n*4,8);for(let i=0;i<n*3;i++){const x=(i*5)%(n*4+1),y=6-((i*3)%5);prect(b,x,y,4,2,i%3?'F':'H');pset(b,x+1,y,'q')}return b}
function trough(){const b=pbuf(14,6);prect(b,0,1,14,5,'W');prect(b,1,1,12,2,'S');prect(b,1,1,12,1,'U');prect(b,0,5,14,1,'V');return b}
function bellows(){const b=pbuf(10,8);polyFill(b,[[0,2],[7,0],[10,4],[7,8],[0,6]],(x,y)=>pset(b,x,y,y%2?'W':'X'));prect(b,7,3,3,2,'G');return b}
function signBoard(c){const b=pbuf(14,14);prect(b,1,0,1,14,'W');prect(b,1,1,12,1,'X');prect(b,4,2,9,7,c||'t');prect(b,4,2,9,1,'w');prect(b,6,4,5,3,'I');return b}
function barrels(n){const b=pbuf(n*7,8);for(let i=0;i<n;i++)barrel(b,i*7,1);return b}
function fence(w){const b=pbuf(w,8);for(let x=0;x<w;x+=4){prect(b,x,0,2,8,'X');pset(b,x,0,'Y')}prect(b,0,2,w,1,'W');prect(b,0,5,w,1,'W');return b}
function dummyS(){const b=pbuf(14,26);prect(b,6,7,2,19,'W');prect(b,6,7,1,19,'X');prect(b,1,11,12,2,'X');prect(b,1,11,12,1,'Y');prect(b,4,0,6,7,'N');prect(b,4,0,6,1,'O');pset(b,5,3,'x');pset(b,8,3,'x');prect(b,3,13,8,7,'M');prect(b,3,13,1,7,'N');pline(b,4,15,9,18,'L');return b}
function weaponRack(){const b=pbuf(16,18);prect(b,0,16,16,2,'W');prect(b,0,6,16,2,'X');for(let i=0;i<4;i++){pline(b,2+i*4,16,3+i*4,0,i%2?'q':'Y');pset(b,3+i*4,0,'H')}return b}
function target(){const b=pbuf(14,20);prect(b,6,10,2,10,'W');for(let r=6;r>=1;r--)for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r)pset(b,7+x,7+y,r%2?'j':'u');return b}
function hutStone(w,wh,rh,o){return hut(w,wh,rh,Object.assign({wall:['D','F','G'],roof:['x','E','z'],brick:1},o))}
function hutWood(w,wh,rh,o){return hut(w,wh,rh,Object.assign({wall:['V','W','X'],roof:['V','W','X']},o))}
function dome(w,h,c){const b=pbuf(w,h);const cx=w/2;polyFill(b,[[1,h],[2,h*0.45],[cx-3,1],[cx+3,1],[w-2,h*0.45],[w-1,h]],(x,y)=>pset(b,x,y,(y%3===0||(x+(y>>1))%4===0)?c[0]:x<cx?c[2]:c[1]));const dw=Math.max(4,Math.round(w*0.3));prect(b,Math.round(cx-dw/2),h-Math.round(h*0.35),dw,Math.round(h*0.35),'x');prect(b,Math.round(cx-dw/2)+1,h-Math.round(h*0.35)+2,dw-2,Math.round(h*0.35)-2,'K');prect(b,Math.round(cx-1),h-3,2,3,'I');return b}
function moundS(w,h){const b=pbuf(w,h);polyFill(b,[[0,h],[w*0.2,h*0.35],[w*0.5,0],[w*0.8,h*0.35],[w,h]],(x,y)=>pset(b,x,y,(x*3+y)%7<2?'x':y<h*0.4?'W':'V'));for(let i=0;i<4;i++)pset(b,Math.round(w*0.25+i*w*0.15),Math.round(h*0.6+(i%2)*2),i%2?'J':'K');return b}
function smokeTop(o){return o}
/* stage: 1 (lvl 1-2), 2 (lvl 3-4), 3 (lvl 5+) */
const stageOf=n=>n>=5?3:n>=3?2:1;
const BLD3={
  forge:g=>g===1?hutStone(34,20,12,{door:1,glow:1,dw:7,dh:12,chim:1,chimX:26})
    :g===2?merge([[hutStone(46,24,14,{door:1,glow:1,dw:8,dh:14,chim:1,chimX:36,win:[8],lit:1}),0,0],[anvil(),48,38],[ore(2),58,38]])
    :merge([[hutStone(62,28,16,{door:1,glow:1,dw:12,dh:18,chim:1,chimX:52,win:[8,18],lit:1}),0,0],[hutStone(16,14,8,{chim:1,chimX:6}),-14,22],[anvil(),64,44],[trough(),66,48],[bellows(),-14,44],[ore(3),78,44],[signBoard('t'),54,10]]),
  smoke:g=>g===1?hutWood(26,14,10,{door:1,dw:5,dh:9,chim:1,chimX:4})
    :g===2?merge([[hutWood(30,16,11,{door:1,dw:5,dh:10,chim:1,chimX:4,win:[21],lit:1}),0,0],[rack(2,1),32,19]])
    :merge([[hutWood(46,18,12,{door:1,dw:6,dh:11,chim:1,chimX:5,win:[22,34],lit:1}),0,0],[rack(3,1),48,22],[rack(2,1),-20,22],[barrels(2),20,34]]),
  kiln:g=>g===1?dome(22,24,['t','v','w'])
    :g===2?merge([[dome(26,28,['t','v','w']),0,0],[barrels(2),28,20]])
    :merge([[dome(30,32,['t','v','w']),0,0],[dome(22,24,['t','v','w']),32,8],[barrels(3),-22,24],[hutStone(6,26,2,{}),26,0]]),
  dummy:g=>g===1?dummyS():g===2?merge([[dummyS(),0,0],[weaponRack(),18,8]]):merge([[dummyS(),0,0],[dummyS(),16,2],[weaponRack(),34,8],[target(),52,6],[fence(70),-4,26]]),
  winch:g=>{const s=g===1?1:g===2?1.3:1.6,W=Math.round(34*s),H=Math.round(30*s),b=pbuf(W+10,H+8);prect(b,2,H-8,W-6,5,'W');prect(b,2,H-8,W-6,1,'Y');
    for(let i=0;i<W*0.45;i++){pset(b,6+i,H-8-i*1.3,'X');pset(b,7+i,H-8-i*1.3,'W')}const tx=Math.round(6+W*0.45),ty=Math.round(H-8-W*0.45*1.3);pline(b,tx,ty,W,ty+8,'X');pline(b,W,ty+8,W,H+2,'H');prect(b,W-3,H+2,7,4,g>2?'X':'G');if(g>2)prect(b,W-3,H+2,7,1,'Y');prect(b,4,H-12,7,5,'F');pset(b,6,H-11,'H');if(g>1)blitTo(b,crate(8),12,H-16);return b},
  boom:g=>{const n=g===1?3:g===2?5:7,b=pbuf(n*14,12);for(let i=0;i<n;i++){const x=i*14;prect(b,x,5,12,5,'X');prect(b,x,5,12,1,'Y');prect(b,x,9,12,1,'V');prect(b,x,5,1,5,'O');if(i)prect(b,x-2,7,2,1,'H');if(g>2&&i%2===0){prect(b,x+4,1,3,4,'j');prect(b,x+4,1,3,1,'u')}}return b},
  traps:g=>{const n=g===1?2:g===2?4:6,b=pbuf(n*13,16);for(let i=0;i<n;i++){const x=i*13+2,y=(i%2)*5;prect(b,x,y+3,6,6,'j');prect(b,x,y+3,6,2,'u');pset(b,x+2,y,'X');pset(b,x+2,y+1,'X');pset(b,x+2,y+2,'X');pline(b,x+6,y+6,x+12,y+9,'H')}return b},
  pot:g=>{const n=g===1?2:g===2?4:6,b=pbuf(n*10,13);for(let i=0;i<n;i++){const x=i*10,y=(i%2)*3;prect(b,x,y+2,9,8,'z');for(let k=1;k<9;k+=2)prect(b,x+k,y+3,1,6,'H');prect(b,x,y+2,9,1,'G');prect(b,x+3,y,3,2,'X')}return b},
  render:g=>{const cau=()=>{const b=pbuf(14,12);prect(b,1,2,12,6,'E');prect(b,1,2,12,1,'H');prect(b,2,3,10,2,'f');prect(b,3,8,2,4,'D');prect(b,9,8,2,4,'D');pset(b,6,10,'K');pset(b,7,11,'J');pset(b,5,11,'I');return b};
    return g===1?cau():g===2?merge([[cau(),0,4],[barrels(2),16,8]]):merge([[hutWood(40,14,8,{flat:1,door:0}),0,0],[cau(),2,14],[cau(),20,14],[barrels(3),42,18],[barrels(2),46,10]])},
  steel:g=>{const f=(w,h,ch)=>merge([[hutStone(w,h,6,{door:1,glow:1,dw:8,dh:Math.min(h-2,10)}),0,ch],[(()=>{const c=pbuf(8,ch+6);prect(c,1,0,6,ch+6,'F');prect(c,1,0,1,ch+6,'G');prect(c,0,0,8,2,'E');return c})(),w-12,0]]);
    return g===1?f(26,14,14):g===2?merge([[f(32,16,20),0,0],[moundS(18,8),34,32]]):merge([[f(42,20,26),0,0],[f(22,12,12),-24,22],[moundS(20,9),44,40],[ore(3),-24,46]])},
  coalpit:g=>g===1?moundS(24,13):g===2?merge([[moundS(24,13),0,0],[moundS(20,11),22,3]]):merge([[moundS(26,14),0,0],[moundS(22,12),24,3],[moundS(20,10),46,5],[(()=>{const b=pbuf(16,8);logs2(b,0,6,4);return b})(),-18,8]]),
  glass:g=>g===1?dome(20,18,['F','G','H']):g===2?merge([[dome(22,20,['F','G','H']),0,0],[(()=>{const b=pbuf(16,10);prect(b,0,6,16,2,'X');prect(b,1,8,2,2,'W');prect(b,13,8,2,2,'W');for(let i=0;i<4;i++){prect(b,2+i*3,2,2,4,i%2?'U':'r');pset(b,2+i*3,2,'u')}return b})(),24,10]])
    :merge([[hutStone(40,20,10,{door:1,dw:6,dh:10,win:[6,28],lit:1}),0,0],[dome(20,18,['F','G','H']),42,12],[(()=>{const b=pbuf(16,10);prect(b,0,6,16,2,'X');for(let i=0;i<4;i++){prect(b,2+i*3,2,2,4,i%2?'U':'r');pset(b,2+i*3,2,'u')}return b})(),-18,20]]),
  apoth:g=>g===1?hut(22,10,7,{wall:['W','X','Y'],roof:['Z','r','s'],door:1,dw:4,dh:6}):g===2?merge([[hut(30,14,9,{wall:['W','X','Y'],roof:['Z','r','s'],door:1,dw:5,dh:9,win:[22],lit:1}),0,0],[rack(2,0),32,9]])
    :merge([[hut(40,16,11,{wall:['W','X','Y'],roof:['Z','r','s'],door:1,dw:6,dh:10,win:[8,30],lit:1,chim:1,chimX:20}),0,0],[signBoard('r'),40,12],[(()=>{const b=pbuf(14,6);for(let i=0;i<5;i++){prect(b,i*3,0,1,6,'r');pset(b,i*3,0,'Z');pset(b,i*3+1,2,'l')}return b})(),-16,20]]),
  garden:g=>{const n=g===1?2:g===2?4:6,b=pbuf(36,n*3+4);for(let r=0;r<n;r++){prect(b,0,r*3+3,36,2,'W');for(let x=1;x<35;x+=3){pset(b,x,r*3+2,'r');pset(b,x+1,r*3+2,'Z');pset(b,x,r*3+1,r%3===2?'j':'r')}}return g>2?merge([[b,0,8],[fence(40),-2,0],[dummyS(),38,-14]]):b},
  sandpit:g=>{const p=pbuf(36,12);const n=g===1?1:3;for(let i=0;i<n;i++)polyFill(p,[[i*12,12],[i*12+5,3],[i*12+12,12]],(x,y)=>pset(p,x,y,x<i*12+5?'O':'N'));if(g>1){pline(p,34,0,29,11,'X');prect(p,27,10,4,2,'H')}
    return g<3?p:merge([[p,0,8],[(()=>{const b=pbuf(16,14);prect(b,0,2,16,2,'X');prect(b,1,4,14,6,'z');for(let x=2;x<15;x+=2)prect(b,x,4,1,6,'H');prect(b,2,10,2,4,'W');prect(b,12,10,2,4,'W');return b})(),38,4],[crate(8),56,12]])},
  shipyard:g=>{const b=pbuf(g>2?70:52,28);prect(b,0,22,b.w,3,'W');prect(b,0,22,b.w,1,'Y');const n=g===1?4:g===2?8:10;for(let i=0;i<n;i++){const x=5+i*6;pline(b,x,22,x-4,6+(i%2)*3,'X');pline(b,x+1,22,x-3,6+(i%2)*3,'Y')}if(g>1)prect(b,0,8,n*6+4,1,'W');
    if(g>2){prect(b,62,0,2,22,'X');pline(b,62,1,50,8,'X');pline(b,50,8,50,16,'H');prect(b,48,16,5,3,'X')}return b},
  house:g=>hut(26,13,10,{wall:['V','W','X'],roof:['t','v','w'],door:1,dw:5,dh:8,win:[18],lit:1,chim:1,chimX:5})};
/* bottom-center anchors on the 432x240 yard */
const BANC={forge:[174,146],smoke:[232,154],kiln:[270,158],dummy:[150,186],winch:[318,152],boom:[402,186],traps:[410,236],pot:[322,224],render:[204,186],steel:[290,142],coalpit:[262,196],glass:[334,172],apoth:[240,222],garden:[100,236],sandpit:[296,224],shipyard:[364,186]};
const HOUSES=[[20,186],[46,164],[16,232],[60,218]];
const BSMK3={forge:'chim',smoke:'chim',kiln:'top',steel:'chim',coalpit:'top',house:'chim',render:'top'};
function yardBg3(st){const W=YW,H=YH,b=pbuf(W,H);
  if(!st.looked){prect(b,0,0,W,H,'x');if(st.lk){for(let i=0;i<7;i++)prect(b,126+i*9,192-i*6,9,1,'B')}return b}
  const ph=st.ph||'n';rampV(b,0,0,W,120,ph==='y'?['4','5','5','6','6']:ph==='d'?['C','o','3','4','5']:st.won?['B','C','1','2','3']:['A','B','C','1','2']);
  const R=rng(7),kk=b.k||1;for(let i=0;i<(ph==='n'?260:ph==='d'?60:0);i++){const x=Math.floor(R()*W*kk),y=Math.floor(R()*92*kk),c=R()<.1?'y':R()<.45?'6':'5';phx(b,x,y,c);if(c==='y'&&R()<.5){phx(b,x+1,y,'5');phx(b,x-1,y,'5');phx(b,x,y-1,'5');phx(b,x,y+1,'5')}}
  polyFill(b,[[220,120],[248,106],[276,110],[300,120]],(x,y)=>pset(b,x,y,'1'));polyFill(b,[[326,120],[352,104],[378,100],[402,110],[432,106],[432,120]],(x,y)=>pset(b,x,y,'1'));
  for(let x=250;x<276;x+=3)pset(b,x,108,'2');for(let x=354;x<398;x+=3)pset(b,x,103,'2');
  rampV(b,0,120,W,120,['T','S','R','Q','P']);const R2=rng(9);
  {const kk=b.k||1;for(let i=0;i<520;i++){const x=Math.floor(R2()*W*kk),y=Math.floor((122+R2()*116)*kk),l=Math.round((2+R2()*7)*kk*(0.6+0.4*(y/kk-120)/120));for(let q=0;q<l;q++)phx(b,x+q,y,y/kk<150?'U':'T')}}
  const land=[[0,240],[0,160],[30,148],[60,140],[110,134],[170,130],[230,130],[285,132],[318,137],[342,146],[356,158],[366,176],[374,200],[380,240]];
  polyFill(b,land,(x,y)=>{const n=hh2(EXX,EXY);pset(b,x,y,n<.05?'O':n<.12||.16>bay(EXX,EXY)?'L':y<160?'N':'M')});
  polyFill(b,[[21,240],[27,192],[45,177],[135,174],[156,192],[165,240]],(x,y)=>pset(b,x,y,(x+y*3)%11<2?'D':((x*7+y)%9<4?'E':'F')));stones(b,24,180,141,60,31);
  const R3=rng(12);for(let i=0;i<110;i++){const x=Math.floor(R3()*300)+6,y=150+Math.floor(R3()*80);const c=pget(b,x,y);if(c==='M'||c==='N'||c==='L'){pset(b,x,y,'r');pset(b,x+1,y-1,'Z');pset(b,x-1,y-1,'r');if(i%3===0)pset(b,x,y-2,'Z')}}
  for(let i=0;i<land.length-1;i++){const[a,c]=[land[i],land[i+1]];if(a[0]<300)continue;const n=Math.max(Math.abs(c[0]-a[0]),Math.abs(c[1]-a[1]));for(let k=0;k<=n;k++){const x=Math.round(a[0]+(c[0]-a[0])*k/n),y=Math.round(a[1]+(c[1]-a[1])*k/n);pset(b,x+1,y,'u');pset(b,x+2,y,'U');if(k%3===0)pset(b,x+3,y,'u');if(k%5===0)pset(b,x+5,y,'U')}}
  for(let k=0;k<=90;k++){const x=Math.round(156+k*1.75),y=Math.round(201+k*0.42);prect(b,x,y,2,1,'O');pset(b,x,y+1,'N');if(k%4===0)pset(b,x+2,y+1,'O');if(k%7===0)pset(b,x-1,y-1,'N')}
  if(st.hearth)logs2(b,150,226,Math.min(12,1+Math.floor((st.wood||0)/20)));
  if(st.won&&ph!=='y'&&st.rm){const kk=b.k||1;for(let hx=Math.round(68*kk);hx<Math.round(278*kk);hx++){const i=hx/kk-68,y0=33-i*0.22,hw=1.2+i*0.06,a=Math.max(.18,.75-i/320);for(let hy=Math.floor((y0-hw)*kk);hy<=(y0+hw)*kk;hy++){const e=1-Math.abs(hy/kk-y0)/hw;if(hy>=0&&e>0&&a*(.45+e)>bay(hx,hy))phx(b,hx,hy,i<70&&e>.5?'I':'h')}}
    for(let hx=Math.round(42*kk);hx>=0;hx--){const i=42-hx/kk,y0=33-i*0.22,hw=1.1+i*0.03,a=Math.max(.15,.55-i/200);for(let hy=Math.floor((y0-hw)*kk);hy<=(y0+hw)*kk;hy++){const e=1-Math.abs(hy/kk-y0)/hw;if(hy>=0&&e>0&&a*(.4+e)>bay(hx,hy))phx(b,hx,hy,'h')}}}
  if(st.boat){prect(b,388,212,33,6,'W');prect(b,391,218,27,3,'V');prect(b,388,212,33,1,'Y');prect(b,403,188,3,24,'X');polyFill(b,[[406,188],[421,209],[406,209]],(x,y)=>pset(b,x,y,(x+y)%5?'6':'5'))}
  if(st.schooner){const x=360,y=130;polyFill(b,[[x,y],[x+69,y],[x+60,y+12],[x+9,y+12]],(px,py)=>pset(b,px,py,py<y+3?'Y':'W'));prect(b,x+24,y-42,3,42,'X');prect(b,x+45,y-36,3,36,'X');
    polyFill(b,[[x+27,y-39],[x+42,y-6],[x+27,y-6]],(px,py)=>pset(b,px,py,(px+py)%6?'u':'6'));polyFill(b,[[x+48,y-33],[x+63,y-6],[x+48,y-6]],(px,py)=>pset(b,px,py,(px+py)%6?'6':'5'));pset(b,x+25,y-45,'g')}
  for(let i=0;i<Math.min(8,st.pop||0);i++){const x=176+i*16,y=232-(i%2)*4;prect(b,x,y-9,3,3,'m');prect(b,x-1,y-6,5,4,['X','S','r','v','Y','T','w','Z'][i]);prect(b,x,y-2,1,2,'x');prect(b,x+2,y-2,1,2,'x')}
  return b}
function towerObj3(st){const W=74,H=192,b=pbuf(W,H),F=st.floors||{},cx=37,hwAt=y=>Math.round(18+(y-45)*0.09);
  {const k=b.k||1,Y0=Math.round(45*k);hiRect(b,0,45,W,H-45,(i,j,x,y)=>{const hw=hwAt(Math.floor(y));if(x<cx-hw||x>=cx+hw)return;const ly=j-Y0,bh=Math.round(5*k),bw=Math.round(8*k),row=Math.floor(ly/bh),off=row%2?Math.round(bw/2):0,bi=Math.floor((i+off)/bw),mort=ly%bh===bh-1||(i+off)%bw===0;
    const shade=x<cx-hw+4?'G':x>cx+hw-6?'D':x>cx+hw-12?'E':'F';if(mort)return shade==='D'?'x':'D';const v=hh2(bi,row);if(v<.12)return shade==='G'?'F':shade==='F'?'E':'D';if(v>.9&&shade!=='D')return shade==='F'?'G':'F';if(((i-off)%bw===1||ly%bh===0)&&shade!=='D')return shade==='E'?'F':'G';return hh2(i,j)<.03?(shade==='F'?'G':'E'):shade})}
  if(!st.won){pline(b,cx-9,90,cx-3,108,'D');pline(b,cx+6,126,cx+12,144,'D');pline(b,cx-3,108,cx-6,114,'D')}
  for(const y of[84,123,156])prect(b,cx-hwAt(y)-1,y,hwAt(y)*2+2,3,'H');
  for(const[k,y]of[['gallery',60],['study',99],['work',135]]){const lit=!!F[k];prect(b,cx-5,y,10,12,'x');if(lit){prect(b,cx-4,y+1,8,10,'J');prect(b,cx-2,y+3,4,5,'I');prect(b,cx-4,y+5,8,1,'K')}else pset(b,cx-1,y+4,'B');prect(b,cx-6,y+12,12,2,'H')}
  prect(b,cx-8,H-24,16,24,'x');if(st.hearth){prect(b,cx-7,H-22,14,22,'K');prect(b,cx-5,H-19,10,19,'J');prect(b,cx-3,H-10,6,10,'I')}prect(b,cx-9,H-25,18,2,'H');
  prect(b,cx-22,42,44,4,'H');prect(b,cx-22,45,44,1,'E');for(let x=cx-21;x<cx+22;x+=4)prect(b,x,36,1,6,'G');prect(b,cx-22,35,44,1,'G');
  const lit=st.won,lantern=!!F.lantern;prect(b,cx-12,15,24,21,'E');
  for(let x=cx-11;x<cx+12;x++)for(let y=16;y<35;y++){const glass=(x-cx+11)%6!==5;pset(b,x,y,glass?(lit?(y<22?'I':'h'):lantern?'S':'B'):'z')}
  if(lit){prect(b,cx-3,20,6,10,'y');prect(b,cx-1,18,2,2,'I')}else if(lantern){for(let y=17;y<34;y+=3)pset(b,cx-8,y,'T')}
  polyFill(b,[[cx-15,15],[cx,1],[cx+15,15]],(x,y)=>pset(b,x,y,x<cx?'z':'E'));prect(b,cx,0,1,3,'H');prect(b,cx-15,14,30,1,'D');
  return b}
function towerSil3(st){const t=towerObj3(Object.assign({},st,{hearth:0,won:0,floors:{}}));const b=pbuf(t.w,t.h),g=(x,y)=>x>=0&&y>=0&&x<t.W&&y<t.H?t.p[y*t.W+x]:'.';for(let y=0;y<t.H;y++)for(let x=0;x<t.W;x++)if(g(x,y)!=='.'){const e=g(x-1,y)==='.'||g(x+1,y)==='.'||g(x,y-1)==='.'||g(x,y+1)==='.';b.p[y*b.W+x]=e?'4':(x+y)%7===0?'2':'1'}return b}
function hearthObj3(st){const b=pbuf(38,18);if(!st.hearth){prect(b,13,11,12,4,'D');pset(b,18,11,'K');pset(b,19,11,'J');pset(b,19,10,'I');pset(b,18,10,'J');prect(b,11,14,16,2,'E');return b}
  for(let i=0;i<9;i++){const x=1+i*4;prect(b,x,12,4,5,i%2?'F':'G');prect(b,x,12,4,1,'H');prect(b,x+3,13,1,4,'D')}
  prect(b,9,7,20,4,'W');prect(b,9,7,20,1,'X');prect(b,12,4,14,3,'X');prect(b,12,4,14,1,'Y');if(st.plan)return b;prect(b,6,10,26,2,'K');pset(b,10,9,'J');pset(b,26,9,'J');pset(b,19,11,'I');return b}
function emberObj3(){const b=pbuf(14,9);prect(b,4,5,6,3,'D');pset(b,6,5,'K');pset(b,7,5,'J');pset(b,7,4,'I');pset(b,6,4,'J');prect(b,3,8,8,1,'E');return b}
function flame3Strip(){const b=pbuf(54,27);for(let k=0;k<3;k++){const R=rng(290+k);for(let y=0;y<27;y++){const t=y/26,w=Math.max(1,Math.min(18,Math.round(1+t*15+(R()-.5)*3))),sh=y<15?Math.round((R()-.5)*3.4*(1-t)):0,x0=k*18+9-Math.floor(w/2)+sh;
  for(let x=0;x<w;x++){const e=x===0||x===w-1,c=y<4?'K':e?'K':y>14&&x>2&&x<w-3?(y>20&&x>4&&x<w-5?'y':'I'):'J';pset(b,x0+x,y,c)}}for(let s=0;s<4;s++){pset(b,k*18+3+Math.floor(R()*12),Math.floor(R()*8),'J')}}return b}
function signObj3(){const b=pbuf(21,27);prect(b,9,6,3,21,'W');prect(b,9,6,1,21,'X');prect(b,0,4,19,9,'X');prect(b,0,4,19,1,'Y');prect(b,0,12,19,1,'W');polyFill(b,[[19,4],[21,8],[19,13]],(x,y)=>pset(b,x,y,'X'));prect(b,3,7,12,1,'V');prect(b,3,9,9,1,'V');return b}
function fogBuf3(seed){const b=pbuf(144,30);const R=rng(seed);for(let k=0;k<9;k++){const cx=Math.floor(R()*144),cy=8+Math.floor(R()*14),rx=14+Math.floor(R()*22),ry=4+Math.floor(R()*5);
  for(let y=cy-ry;y<=cy+ry;y++)for(let x=cx-rx;x<=cx+rx;x++){const d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<1&&(1-d)>bay((x+144)%144,y)*0.9)pset(b,(x+144)%144,y,d<.4?'6':'5')}}return b}
function yardFull3(st){const b=yardBg3(st);if(!st.looked)return b;const L=st.b||{};
  const items=[];const hn=Math.min(4,L.house||0);for(let i=0;i<hn;i++){const o=BLD3.house(1);items.push([o,HOUSES[i][0]-o.w/2,HOUSES[i][1]-o.h])}
  for(const k in BANC)if(L[k]){const o=BLD3[k](stageOf(L[k]));items.push([o,Math.round(BANC[k][0]-o.w/2),BANC[k][1]-o.h])}
  const tw=towerObj3(st);items.push([tw,18,8]);const hr=hearthObj3(st);items.push([hr,124,206]);
  items.sort((p,q)=>(p[2]+p[0].h)-(q[2]+q[0].h));for(const[o,x,y]of items)blitTo(b,o,Math.round(x),Math.round(y));return b}
/* ---------- SHORE 288x120 ---------- */
function shoreBg3(st){const W=SW,H=SH,b=pbuf(W,H),ph=st.ph||'n';rampV(b,0,0,W,24,ph==='y'?['5','6','6','5']:ph==='d'?['o','3','4','5']:['C','1','2','4']);
  rampV(b,0,21,W,60,['T','S','R','Q','R']);const R=rng(41),kk=b.k||1;for(let i=0;i<420;i++){const x=Math.floor(R()*W*kk),y=Math.floor((24+R()*54)*kk),l=Math.round((2+R()*8)*kk*(0.5+0.5*(y/kk-24)/54)),c=y/kk<36?'U':(R()<.5?'T':'S');for(let q=0;q<l;q++)phx(b,x+q,y,c)}
  for(const[yy,c]of[[66,'u'],[72,'U'],[76,'u']]){for(let hx=0;hx<W*kk;hx++){const x=hx/kk,y=Math.round((yy+Math.sin(x/12+yy)*1.6)*kk);phx(b,hx,y,c);if(hx%5)phx(b,hx,y+1,c==='u'?'U':'T');if(hx%9===0)phx(b,hx,y-1,'U');if(c==='u'&&hh2(hx,yy)<.25)phx(b,hx,y+2,'U')}}
  rampV(b,0,78,W,12,['M','L','M']);rampV(b,0,87,W,33,['N','N','O']);pnoise(b,0,87,W,33,'M',0.1,44);pnoise(b,0,87,W,33,'L',0.04,45);pnoise(b,0,78,W,12,'T',0.06,46);
  for(let i=0;i<24;i++){const R3=rng(60+i),x=Math.floor(R3()*W),y=90+Math.floor(R3()*28);pset(b,x,y,'r');pset(b,x+1,y,'Z');pset(b,x+2,y-1,'r');if(i%3===0){pset(b,x+4,y+1,'G');pset(b,x+5,y+1,'H')}}
  {const bh=Math.round(5*kk),bw=Math.round(8*kk);hiRect(b,0,0,33,93,(i,j,x)=>{const row=Math.floor(j/bh),off=row%2?Math.round(bw/2):0,bi=Math.floor((i+off)/bw);if(j%bh===bh-1||(i+off)%bw===0)return'D';const sh=x<5?'G':x>26?'E':'F',v=hh2(bi,row);return v<.12?(sh==='G'?'F':'E'):(j%bh===0&&sh!=='E')?'G':sh})}
  stones(b,0,90,45,30,71);
  logs2(b,42,112,Math.min(12,Math.ceil((st.wood||0)/12)));
  if(st.scrapSeen){const n=Math.min(6,Math.ceil((st.scrap||0)/10));for(let i=0;i<n;i++){prect(b,93+i*4,110-i,12-i,3,i%2?'H':'G');pset(b,94+i*4,109-i,'q')}}
  if(st.fishSeen&&(st.fish||0)>=1){prect(b,132,99,21,12,'X');for(let x=132;x<153;x+=3)prect(b,x,99,1,12,'W');prect(b,132,99,21,1,'Y');for(let i=0;i<Math.min(5,Math.ceil(st.fish/8));i++){prect(b,135+i*3,96,3,3,'T');pset(b,135+i*3,96,'U')}}
  for(let i=0;i<Math.min(3,st.pot||0);i++){const x=87+i*15,y=75+(i%2)*3;prect(b,x,y,11,9,'z');for(let k=1;k<11;k+=2)prect(b,x+k,y+1,1,7,'H');prect(b,x,y,11,1,'G')}
  return b}
function wreckObj3(){const b=pbuf(69,33);polyFill(b,[[0,21],[9,9],[45,6],[66,12],[60,27],[12,30]],(x,y)=>pset(b,x,y,y<13?'Y':(x+y)%9===0?'V':y<21?'X':'W'));
  for(let i=0;i<8;i++){const x=15+i*6;pline(b,x,9,x+3,0+(i%2)*3,'W');pline(b,x+1,9,x+4,0+(i%2)*3,'X')}prect(b,24,15,6,4,'x');prect(b,42,18,4,3,'x');for(let x=6;x<60;x+=7)pset(b,x,18,'H');for(let x=10;x<56;x+=9)pline(b,x,13,x+4,26,'W');
  prect(b,0,30,69,3,'L');return b}
function rodObj3(){const b=pbuf(24,66);pline(b,3,65,12,6,'W');pline(b,4,65,13,6,'X');prect(b,0,60,9,6,'L');pline(b,12,6,20,36,'6');pset(b,13,6,'Y');prect(b,2,42,4,4,'G');pset(b,3,43,'H');return b}
function pierObj3(st){const b=pbuf(57,30);prect(b,0,9,57,6,'X');prect(b,0,9,57,1,'Y');for(let x=0;x<57;x+=5)prect(b,x,10,1,4,'W');prect(b,0,14,57,1,'V');for(let x=4;x<57;x+=12)prect(b,x,15,3,15,'W');
  if(!st.boatOut){prect(b,9,2,30,6,'W');prect(b,12,6,24,3,'V');prect(b,9,2,30,1,'Y');prect(b,23,0,2,2,'X')}return b}
function shipObj3(){const b=pbuf(60,45);polyFill(b,[[0,30],[60,30],[51,42],[9,42]],(x,y)=>pset(b,x,y,y<33?'Y':y<37?'X':'W'));prect(b,27,0,3,30,'X');
  polyFill(b,[[30,1],[51,26],[30,26]],(x,y)=>pset(b,x,y,(x+y)%6?'u':'6'));polyFill(b,[[26,4],[8,26],[26,26]],(x,y)=>pset(b,x,y,(x+y)%6?'6':'5'));prect(b,21,0,9,3,'j');for(let x=12;x<50;x+=6)prect(b,x,34,2,2,'x');return b}
function flotObj3(k){const b=pbuf(24,18);if(k==='bottle'){prect(b,5,9,12,6,'r');prect(b,5,9,12,1,'U');prect(b,17,10,4,3,'u');prect(b,2,12,3,1,'X')}
  else if(k==='barrel'||k==='cargo'){prect(b,5,3,12,13,'X');prect(b,5,3,2,13,'W');prect(b,15,3,2,13,'V');for(const y of[5,9,13])prect(b,5,y,12,1,'z');prect(b,8,3,6,1,'Y');if(k==='cargo'){prect(b,16,9,8,8,'X');prect(b,16,9,8,1,'Y')}}
  else if(k==='survivor'){prect(b,0,12,24,4,'W');prect(b,3,8,12,4,'S');prect(b,15,6,4,4,'m');prect(b,15,5,4,1,'x')}
  else{prect(b,3,4,18,13,'X');prect(b,3,4,18,2,'Y');prect(b,3,10,18,1,'W');prect(b,3,4,1,13,'W');prect(b,20,4,1,13,'V');pset(b,11,12,'g');for(const[x,y]of[[5,6],[18,6],[5,15],[18,15]])pset(b,x,y,'H')}return b}
function log3Buf(){const b=pbuf(27,10);prect(b,3,1,21,8,'X');prect(b,3,1,21,2,'Y');prect(b,3,8,21,1,'V');prect(b,0,2,3,6,'O');pset(b,1,4,'M');pset(b,1,5,'M');prect(b,24,2,3,6,'N');pset(b,9,4,'W');pset(b,16,3,'W');pset(b,13,6,'W');return b}
function doorObj3(){const b=pbuf(21,39);prect(b,0,0,21,3,'H');prect(b,1,3,19,36,'x');prect(b,3,5,15,34,'V');for(let x=6;x<18;x+=4)prect(b,x,5,1,34,'W');prect(b,3,18,15,1,'W');pset(b,15,21,'g');pset(b,15,22,'I');return b}


/* Ковадло на пеньку; гаряче — з розжареною заготовкою */
function anvilObj3(hot){const b=pbuf(18,14);prect(b,4,9,10,5,'W');prect(b,4,9,1,5,'V');prect(b,13,9,1,5,'V');prect(b,5,9,8,1,'Y');pline(b,6,11,11,11,'V');
  polyFill(b,[[0,4],[3,3],[3,6]],(x,y)=>pset(b,x,y,'F'));prect(b,3,3,13,3,'G');prect(b,3,3,13,1,'H');prect(b,15,3,2,2,'F');prect(b,6,6,6,2,'F');prect(b,5,8,8,1,'E');
  if(hot){prect(b,5,1,9,2,'K');prect(b,6,1,7,1,'J');pset(b,9,1,'I');pset(b,3,0,'J');pset(b,15,0,'K');pset(b,12,-1,'J')}return b}
/* Усі сцени й об'єкти двору та берега малюються з масштабом SK */
yardBg3=HI(yardBg3);towerObj3=HI(towerObj3);towerSil3=HI(towerSil3);hearthObj3=HI(hearthObj3);emberObj3=HI(emberObj3);flame3Strip=HI(flame3Strip);signObj3=HI(signObj3);fogBuf3=HI(fogBuf3);
yardFull3=HI(yardFull3);shoreBg3=HI(shoreBg3);wreckObj3=HI(wreckObj3);rodObj3=HI(rodObj3);pierObj3=HI(pierObj3);shipObj3=HI(shipObj3);flotObj3=HI(flotObj3);log3Buf=HI(log3Buf);doorObj3=HI(doorObj3);
for(const k in BLD3)BLD3[k]=HI(BLD3[k]);anvilObj3=HI(anvilObj3);
