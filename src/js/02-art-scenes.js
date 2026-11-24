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
/* Люди біля вогнища: стоять чи сидять обличчям до вогню; бік до вогню підсвічений жаром */
/* Пісок плямами: великі темніші й світліші латки, рідкі камінці — без дрібного «зерна» */
function vnz(i,j,S,sd){const x=i/S,y=j/S,x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),g=(a,c)=>hh2(a+sd,c);return g(x0,y0)*(1-u)*(1-v)+g(x0+1,y0)*u*(1-v)+g(x0,y0+1)*(1-u)*v+g(x0+1,y0+1)*u*v}
function sandC(i,j,base){const p=hh2(i,j);if(p<.005)return'O';if(p<.01)return'L';const v=vnz(i,j*1.8,14,3)*.65+vnz(i,j*1.8,5,9)*.35;
  return v<.27?(base==='O'?'N':base==='N'?'M':'L'):v>.76?(base==='M'?'N':'O'):base}
function villager3(b,x,y,i,fire){const C=[['W','X'],['Q','R'],['s','Z'],['t','v'],['L','M'],['P','Q'],['V','W'],['Z','r']][i%8],sit=i%3===1,lit=fire&&i<5,hat=['D','i','c','x','j','D','c','o'][i%8];
  const top=sit?y-9:y-12;
  if(sit){prect(b,x-2,y-2,6,2,'W');prect(b,x-2,y-2,6,1,'X');prect(b,x-4,y-4,3,1,'V');pset(b,x-4,y-3,'x');pset(b,x-4,y-2,'x')}
  else{prect(b,x-1,y-4,1,4,'x');prect(b,x+1,y-4,1,4,'V')}
  hiRect(b,x-2.6,top+3,5.6,sit?5:7,(hx,hy,X,Y)=>{const t=(Y-top-3)/(sit?5:7),hw=1.9+t*.9,u=(X-x-.3)/hw;if(Math.abs(u)>1)return;return u<-.45?C[1]:u>.4?'x':C[0]});
  pline(b,x-1.5,top+5,x-2.5,top+(sit?7:8),C[1]);
  hiRect(b,x-1.6,top,3.4,3.4,(hx,hy,X,Y)=>{const d=Math.hypot(X-x-.1,Y-top-1.7);if(d>1.7)return;if(Y<top+1.1)return hat;return X<x-.2?'m':'n'});
  if(lit){const hx0=Math.round((x-2.6)*b.k);for(let j=Math.round((top+.6)*b.k);j<Math.round((y-(sit?2:1))*b.k);j++){for(let hx=hx0;hx<hx0+8;hx++){const c=b.p[j*b.W+hx];if(c&&c!=='.'&&c!=='N'&&c!=='M'&&c!=='L'&&c!=='O'&&c!=='E'&&c!=='F'&&c!=='D'){if(hh2(hx,j)<.75)b.p[j*b.W+hx]=i<2?'J':'K';break}}}}}
/* Човен на березі двору й шхуна на рейді */
function boat3(b,x,y){polyFill(b,[[x,y],[x+33,y],[x+30,y+7],[x+4,y+8]],(px,py)=>{const t=(py-y)/8,band=Math.floor(t*3);if((t*3-band)<.18&&band)return pset(b,px,py,'V');pset(b,px,py,woodC(EXX,EXY,WD,.8-band*.2-(px-x)/80,band+2))});
  prect(b,x,y,33,1,'Y');prect(b,x+15,y-24,2,24,'X');prect(b,x+16,y-24,1,24,'V');pline(b,x+16,y-24,x+2,y-1,'D');
  polyFill(b,[[x+17,y-23],[x+32,y-3],[x+17,y-3]],(px,py)=>{const t=(px-x-17)/15;pset(b,px,py,t<.4?'6':t<.8?'5':'H')});pline(b,x+17,y-3,x+32,y-3,'G')}
function schooner3(b,x,y){polyFill(b,[[x,y],[x+69,y-2],[x+60,y+12],[x+9,y+12]],(px,py)=>{const t=(py-y)/12,band=Math.floor(t*4);if((t*4-band)<.16&&band)return pset(b,px,py,'x');pset(b,px,py,woodC(EXX,EXY,WD,.75-band*.16,band+7))});
  prect(b,x,y,69,1,'Y');for(let k=0;k<6;k++)prect(b,x+12+k*8,y+3,2,1,'x');
  for(const[mx,mh]of[[x+25,44],[x+46,38]]){pline(b,mx,y-mh,x+2,y-1,'D');prect(b,mx-1,y-mh,2,mh,'X');pset(b,mx,y-mh,'Y')}
  polyFill(b,[[x+27,y-41],[x+43,y-5],[x+27,y-5]],(px,py)=>{const t=(px-x-27)/16;pset(b,px,py,t<.35?'u':t<.75?'6':'5')});
  polyFill(b,[[x+48,y-35],[x+63,y-5],[x+48,y-5]],(px,py)=>{const t=(px-x-48)/15;pset(b,px,py,t<.35?'6':t<.75?'5':'H')});
  pline(b,x+46,y-38,x+68,y-3,'D');pset(b,x+25,y-46,'g');pset(b,x+25,y-45,'f')}
function yardBg3(st){const W=YW,H=YH,b=pbuf(W,H);
  if(!st.looked){prect(b,0,0,W,H,'x');if(st.lk){for(let i=0;i<7;i++)prect(b,126+i*9,192-i*6,9,1,'B')}return b}
  const ph=st.ph||'n';rampV(b,0,0,W,120,ph==='y'?['4','5','5','6','6']:ph==='d'?['C','o','3','4','5']:st.won?['B','C','1','2','3']:['A','B','C','1','2']);
  const R=rng(7),kk=b.k||1;for(let i=0;i<(ph==='n'?260:ph==='d'?60:0);i++){const x=Math.floor(R()*W*kk),y=Math.floor(R()*92*kk),c=R()<.1?'y':R()<.45?'6':'5';phx(b,x,y,c);if(c==='y'&&R()<.5){phx(b,x+1,y,'5');phx(b,x-1,y,'5');phx(b,x,y-1,'5');phx(b,x,y+1,'5')}}
  polyFill(b,[[220,120],[248,106],[276,110],[300,120]],(x,y)=>pset(b,x,y,'1'));polyFill(b,[[326,120],[352,104],[378,100],[402,110],[432,106],[432,120]],(x,y)=>pset(b,x,y,'1'));
  for(let x=250;x<276;x+=3)pset(b,x,108,'2');for(let x=354;x<398;x+=3)pset(b,x,103,'2');
  rampV(b,0,120,W,120,['T','S','R','Q','P']);const R2=rng(9);
  {const kk=b.k||1;for(let i=0;i<520;i++){const x=Math.floor(R2()*W*kk),y=Math.floor((122+R2()*116)*kk),l=Math.round((2+R2()*7)*kk*(0.6+0.4*(y/kk-120)/120));for(let q=0;q<l;q++)phx(b,x+q,y,y/kk<150?'U':'T')}}
  const land=[[0,240],[0,160],[30,148],[60,140],[110,134],[170,130],[230,130],[285,132],[318,137],[342,146],[356,158],[366,176],[374,200],[380,240]];
  polyFill(b,land,(x,y)=>pset(b,x,y,sandC(EXX,EXY,y<160?'N':'M')));
  polyFill(b,[[21,240],[27,192],[45,177],[135,174],[156,192],[165,240]],(x,y)=>pset(b,x,y,(x+y*3)%11<2?'D':((x*7+y)%9<4?'E':'F')));stones(b,24,180,141,60,31);
  const R3=rng(12);for(let i=0;i<110;i++){const x=Math.floor(R3()*300)+6,y=150+Math.floor(R3()*80);const c=pget(b,x,y);if(c==='M'||c==='N'||c==='L'){pset(b,x,y,'r');pset(b,x+1,y-1,'Z');pset(b,x-1,y-1,'r');if(i%3===0)pset(b,x,y-2,'Z')}}
  for(let i=0;i<land.length-1;i++){const[a,c]=[land[i],land[i+1]];if(a[0]<300)continue;const n=Math.max(Math.abs(c[0]-a[0]),Math.abs(c[1]-a[1]));for(let k=0;k<=n;k++){const x=Math.round(a[0]+(c[0]-a[0])*k/n),y=Math.round(a[1]+(c[1]-a[1])*k/n);pset(b,x+1,y,'u');pset(b,x+2,y,'U');if(k%3===0)pset(b,x+3,y,'u');if(k%5===0)pset(b,x+5,y,'U')}}
  for(let k=0;k<=90;k++){const x=Math.round(156+k*1.75),y=Math.round(201+k*0.42);prect(b,x,y,2,1,'O');pset(b,x,y+1,'N');if(k%4===0)pset(b,x+2,y+1,'O');if(k%7===0)pset(b,x-1,y-1,'N')}
  if(st.hearth)logs2(b,150,226,Math.min(12,1+Math.floor((st.wood||0)/20)));
  if(st.won&&ph!=='y'&&st.rm){const kk=b.k||1;for(let hx=Math.round(68*kk);hx<Math.round(278*kk);hx++){const i=hx/kk-68,y0=33-i*0.22,hw=1.2+i*0.06,a=Math.max(.18,.75-i/320);for(let hy=Math.floor((y0-hw)*kk);hy<=(y0+hw)*kk;hy++){const e=1-Math.abs(hy/kk-y0)/hw;if(hy>=0&&e>0&&a*(.45+e)>bay(hx,hy))phx(b,hx,hy,i<70&&e>.5?'I':'h')}}
    for(let hx=Math.round(42*kk);hx>=0;hx--){const i=42-hx/kk,y0=33-i*0.22,hw=1.1+i*0.03,a=Math.max(.15,.55-i/200);for(let hy=Math.floor((y0-hw)*kk);hy<=(y0+hw)*kk;hy++){const e=1-Math.abs(hy/kk-y0)/hw;if(hy>=0&&e>0&&a*(.4+e)>bay(hx,hy))phx(b,hx,hy,'h')}}}
  if(st.boat)boat3(b,388,212);
  if(st.schooner)schooner3(b,360,130);
  for(let i=0;i<Math.min(8,st.pop||0);i++)villager3(b,170+i*15+(i%3)*2,233-(i%2)*4,i,st.hearth);
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
  /* відплив: вода відступає, відкриваються мокрі плити з калюжами й водоростями */
  const td=st.tide||0;if(td>0){const top=x=>78-15*td+Math.sin(x/9)*1.4+Math.sin(x/23+1)*2;
    hiRect(b,0,58,W,22,(i,j,x,y)=>{if(y<top(x))return;const n=vnz(i,j*2,12,5),r=vnz(i,j*2.2,8,11);if(y<top(x)+1.2)return hh2(i,j)<.6?'u':'U';
      if(r>.72)return r>.8?'F':'E';if(r>.69)return'D';if(n<.25)return n<.21?'S':'R';if(n>.78&&r<.5)return'Z';return'M'})}
  rampV(b,0,78,W,12,['M','L','M']);hiRect(b,0,87,W,33,(i,j,x,y)=>sandC(i,j,y<100?'N':'O'));pnoise(b,0,78,W,12,'T',0.06,46);
  /* брід: камені від підніжжя маяка до обрію; на повній воді видно лише верхівки */
  if(st.fordSeen||td>.5){const F=st.ford||{},P=[];for(let k=0;k<26;k++){const t=k/25,x=44+t*58+Math.sin(t*7)*4,y=88-t*64,sz=Math.max(.8,4.6*(1-t*.85));P.push([x,y,sz,t,k])}
    for(const[x,y,sz,t,k]of P){const wet=td>.5||y>78;if(!wet&&hh2(Math.round(x),9)>.35)continue;hiRect(b,x-sz,y-sz*.55,sz*2,sz*1.1,(i,j,px,py)=>{const u=(px-x)/sz,v=(py-y)/(sz*.55);if(u*u+v*v>1)return;return v<-.3?'G':u>.4||v>.4?'D':'F'});
      if(F.steps&&k%3===1&&t<.8)prect(b,x-sz*.8,y-sz*.6,sz*1.6,Math.max(.7,sz*.3),'Y')}
    if(F.poles||F.rope){const PL=P.filter((p,k)=>k%4===2);for(let k=0;k<PL.length;k++){const[x,y,sz]=PL[k],h=Math.max(2,sz*2.6);if(F.poles){prect(b,x+sz,y-h,Math.max(.7,sz*.25),h,'W');pset(b,x+sz,y-h,'Y')}
        if(F.rope&&k+1<PL.length){const[x2,y2,s2]=PL[k+1],h2=Math.max(2,s2*2.6);pline(b,x+sz,y-h*.8,x2+s2,y2-h2*.8,'L')}}}
    if(F.lamp){const[x,y]=P[P.length-1];prect(b,x,y-6,.8,6,'W');prect(b,x-.7,y-7.5,2.2,2,'J');pset(b,x,y-7,'I')}}
  for(let i=0;i<24;i++){const R3=rng(60+i),x=Math.floor(R3()*W),y=90+Math.floor(R3()*28);pset(b,x,y,'r');pset(b,x+1,y,'Z');pset(b,x+2,y-1,'r');if(i%3===0){pset(b,x+4,y+1,'G');pset(b,x+5,y+1,'H')}}
  {const bh=Math.round(5*kk),bw=Math.round(8*kk);hiRect(b,0,0,33,93,(i,j,x)=>{const row=Math.floor(j/bh),off=row%2?Math.round(bw/2):0,bi=Math.floor((i+off)/bw);if(j%bh===bh-1||(i+off)%bw===0)return'D';const sh=x<5?'G':x>26?'E':'F',v=hh2(bi,row);return v<.12?(sh==='G'?'F':'E'):(j%bh===0&&sh!=='E')?'G':sh})}
  stones(b,0,90,45,30,71);
  logs2(b,42,112,Math.min(12,Math.ceil((st.wood||0)/12)));
  if(st.scrapSeen){const n=Math.min(6,Math.ceil((st.scrap||0)/10));for(let i=0;i<n;i++){prect(b,93+i*4,110-i,12-i,3,i%2?'H':'G');pset(b,94+i*4,109-i,'q')}}
  if(st.fishSeen&&(st.fish||0)>=1){prect(b,132,99,21,12,'X');for(let x=132;x<153;x+=3)prect(b,x,99,1,12,'W');prect(b,132,99,21,1,'Y');for(let i=0;i<Math.min(5,Math.ceil(st.fish/8));i++){prect(b,135+i*3,96,3,3,'T');pset(b,135+i*3,96,'U')}}
  for(let i=0;i<Math.min(3,st.pot||0);i++){const x=87+i*15,y=75+(i%2)*3;prect(b,x,y,11,9,'z');for(let k=1;k<11;k+=2)prect(b,x+k,y+1,1,7,'H');prect(b,x,y,11,1,'G')}
  return b}
/* Дерево з волокнами: R — від темного до світлого; v — освітленість 0..1 (у точних пікселях EXX/EXY або hx/hy) */
function woodC(hx,hy,R,v,seed){const n=hh2(Math.floor(hx/7)+seed,hy),g=hh2(hx>>1,Math.floor(hy/2)+seed*3);let t=v+(n<.12?-.28:n>.93?.18:0)+(g-.5)*.12;const m=R.length-1,f=Math.max(0,Math.min(.999,t))*m,k=Math.floor(f);return(f-k)>bay(hx,hy)?R[Math.min(m,k+1)]:R[k]}
const WD=['x','V','W','X','Y'],WDG=['D','E','L','M','N','O'];
function wreckObj3(){const b=pbuf(69,33);
  const gun=x=>13-x/66*6,keel=x=>{const t=(x-30)/37;return 30-11*t*t*t*t};
  const pts=[];for(let x=1;x<=64;x+=3)pts.push([x,gun(x)]);pts.push([67,8.5],[68.5,13]);for(let x=66;x>=1;x-=3)pts.push([x,keel(x)]);pts.push([0,20]);
  polyFill(b,pts,(x,y)=>{const g=gun(x),k=Math.max(g+4,keel(x)),t=(y-g)/(k-g),band=Math.floor(t*5),ft=t*5-band;
    const hole=(band===2&&x>17&&x<27)||(band===3&&x>40&&x<48)||(band===1&&x>50&&x<55)||(band===0&&x>8&&x<13);
    if(hole){pset(b,x,y,Math.floor(EXX)%10<2?'W':Math.floor(EXX)%10<3?'V':'x');return}
    if(ft<.17){pset(b,x,y,(Math.floor(EXX)%9===0&&band)?'v':'x');return}
    if(ft<.3&&x>6){pset(b,x,y,'V');return}
    if(band===4&&hh2(EXX,EXY)<.09){pset(b,x,y,hh2(EXY,EXX)<.5?'H':'6');return}
    pset(b,x,y,woodC(EXX,EXY,WD,.78-band*.13-x/220-(ft>.85?.12:0),band*13))});
  for(let i=0;i<7;i++){const x0=9+i*8,g=gun(x0),top=g-5-(i%3)*2.5,lean=i<3?-1.5:1.2;if(i===3)continue;
    pline(b,x0,g,x0+lean*.5,g-(g-top)*.55,'X');pline(b,x0+lean*.5,g-(g-top)*.55,x0+lean,top,'X');pline(b,x0+1,g,x0+1+lean*.5,g-(g-top)*.55,'V');pline(b,x0+1+lean*.5,g-(g-top)*.55,x0+1+lean,top+1,'W');pset(b,x0+lean,top,'Y')}
  pline(b,1,gun(1)-1,64,gun(64)-1,'Y');pline(b,1,gun(1),64,gun(64),'X');
  for(const sx of[30,52,15]){for(let j=0;j<5;j++){pset(b,sx+(j%2),gun(sx)+1+j,j<3?'Z':'s')}}
  polyFill(b,[[0,33],[0,27],[10,26],[24,29],[44,30.5],[58,28],[69,30],[69,33]],(x,y)=>{const v=hh2(EXX,EXY);pset(b,x,y,y<27.8?'L':v<.18?'L':v<.55?'M':'N')});
  for(let i=0;i<6;i++)pset(b,6+i*11,31,'O');return b}
function rodObj3(){const b=pbuf(24,66);
  polyFill(b,[[0,66],[0,61],[4,58],[9,59],[13,62],[14,66]],(x,y)=>{const v=hh2(EXX,EXY);pset(b,x,y,v<.25?'L':v<.7?'M':'N')});
  prect(b,1,60,4,3,'F');prect(b,1,60,4,1,'H');prect(b,9,61,4,3,'E');prect(b,9,61,3,1,'G');
  pline(b,11,63,9,41,'V');pline(b,12,63,10,41,'W');pline(b,9,42,6,36,'W');pline(b,10,42,12,37,'V');pset(b,6,36,'X');pset(b,12,37,'X');
  const k=b.k,ax=3,ay=62,bx=13,by=6;hiRect(b,0,4,16,60,(i,j,x,y)=>{const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/L2)),px=ax+dx*t,py=ay+dy*t,d=(x-px)*(-dy)/Math.sqrt(L2)+(y-py)*(dx)/Math.sqrt(L2);
    const w=t<.16?1.3:t<.5?.85:t<.85?.6:.45;if(Math.abs(d)>w||t<=0||t>=1)return;
    if(t<.16)return(Math.floor(t*60)%4===0)?'V':d<-w*.2?'Y':'X';return d<-w*.15?'X':d>w*.4?'x':'W'});
  for(const t of[.32,.5,.66,.8,.92])pset(b,ax+(bx-ax)*t+1,ay+(by-ay)*t,'H');
  const rx=ax+(bx-ax)*.2+1.6,ry=ay+(by-ay)*.2;hiRect(b,rx-2.3,ry-2.3,4.6,4.6,(i,j,x,y)=>{const d=Math.hypot(x-rx,y-ry);return d<2.2?(d<.7?'q':d>1.6?'E':(x-rx)+(y-ry)<0?'H':'G'):''});pline(b,rx,ry,rx-2,ry+1.5,'q');
  hiRect(b,12,5,10,32,(i,j,x,y)=>{const t=(y-6)/30;if(t<0||t>1)return;const lx=13+7*t+Math.sin(t*3.14)*1.8;return Math.abs(x-lx)<.34?(hh2(i,j)<.85?'6':''):''});
  /* відро з уловом */
  polyFill(b,[[14,56],[22,56],[21,65],[15,65]],(x,y)=>pset(b,x,y,woodC(EXX,EXY,WD,.75-(x-14)/12,5)));prect(b,14,58,8,1,'z');prect(b,14,63,8,1,'z');prect(b,14,56,8,1,'Y');
  pset(b,16,54,'T');pset(b,17,55,'S');pset(b,15,53,'U');pset(b,19,55,'T');pset(b,20,54,'U');pline(b,14,56,18,51,'G');pline(b,18,51,22,56,'G');return b}
function pierObj3(st){const b=pbuf(57,30);
  for(let i=0;i<5;i++){const x=4+i*12;hiRect(b,x,13,3,17,(hx,hy,X,Y)=>{const wet=Y>22;return wet?(hh2(hx,hy)<.3?'s':hh2(hx,hy)<.6?'Z':'x'):X-x<1?'X':X-x>2?'x':'W'})}
  hiRect(b,0,9,57,6,(hx,hy,x,y)=>{const pl=Math.floor(x/4.75);if(Math.floor(x*b.k)%Math.round(4.75*b.k)===0)return'x';if(y<10)return hh2(pl,1)<.5?'Y':'X';if(y>13.6)return'V';
    if((Math.abs(x-pl*4.75-2.4)<.5)&&(Math.abs(y-10.6)<.5||Math.abs(y-13)<.5))return'H';return woodC(hx,hy,['V','W','X','L','Y'],.6-(y-10)*.07+(hh2(pl,7)-.5)*.25,pl)});
  for(const x of[5,17,29,41,53]){pset(b,x,8,'X');pset(b,x,7,'Y')}
  if(!st.boatOut){const by=1;polyFill(b,[[8,by+1],[40,by+1],[37,by+7.5],[12,by+7.5]],(x,y)=>{const t=(y-by-1)/6.5,band=Math.floor(t*3);if((t*3-band)<.18&&band)return pset(b,x,y,'V');pset(b,x,y,woodC(EXX,EXY,['V','W','t','v','w'],.75-band*.18-(x-8)/90,band))});
    prect(b,8,by+1,32,1,'Y');prect(b,10,by,28,1,'X');for(const x of[16,30])prect(b,x,by-1,1,2,'H');pline(b,13,by,34,by-3,'X');pline(b,13,by+1,34,by-2,'W');pset(b,34,by-3,'Y');
    pline(b,40,by+3,44,10,'N');pline(b,41,by+3,45,10,'M')}
  return b}
function shipObj3(){const b=pbuf(60,45);
  polyFill(b,[[0,29],[6,30],[54,30],[60,27],[52,42],[9,42]],(x,y)=>{const t=(y-29)/13,band=Math.floor(t*4);if((t*4-band)<.16&&band)return pset(b,x,y,'x');pset(b,x,y,woodC(EXX,EXY,WD,.78-band*.15-Math.abs(x-30)/120,band*3))});
  prect(b,0,27,12,3,'W');prect(b,0,27,12,1,'Y');prect(b,48,26,12,4,'W');prect(b,48,26,12,1,'Y');for(let x=13;x<48;x+=5)prect(b,x,31,2,2,'x');
  for(let i=0;i<8;i++)pset(b,10+i*5.5,37,'v');
  pline(b,29,1,4,27,'D');pline(b,29,1,56,26,'D');prect(b,28,1,2,29,'X');prect(b,29,1,1,29,'V');prect(b,16,3,26,1,'W');prect(b,16,22,26,1,'W');
  polyFill(b,[[17,4],[41,4],[42,21],[16,21]],(x,y)=>{const t=(x-17)/24,bel=Math.sin((y-4)/17*3.14)*.8;let c=t<.35?'6':t<.8?'5':'H';if(bel>.6&&t>.2&&t<.7)c='6';
    if((x>20&&x<26&&y>9&&y<14)||(x>32&&x<38&&y>14&&y<19))c=(Math.floor(EXX)+Math.floor(EXY))%3?'b':'a';if(Math.abs(y-12.5)<.3||Math.abs(x-29)<.3)c='5';pset(b,x,y,c)});
  for(const[x0,y0]of[[20,9],[26,9],[32,14],[38,14],[20,14],[26,14],[32,19],[38,19]])pset(b,x0,y0,'a');
  prect(b,26,0,6,2,'j');pset(b,31,0,'i');return b}
function flotObj3(k){const b=pbuf(24,18);
  if(k==='bottle'){hiRect(b,3,8,18,8,(i,j,x,y)=>{const neck=x>16.5,r=neck?1.4:2.9,cy=12;const d=Math.abs(y-cy);if(d>r||x>20.5)return;if(neck&&x>19.3)return'X';if(Math.abs(y-cy+r*.55)<.35&&x>5)return'u';const t=(y-cy+r)/(2*r);return t<.35?'r':t<.8?'Z':'s'});
    prect(b,7,11,7,2,'O');prect(b,7,11,7,1,'N');pset(b,9,12,'i');pline(b,0,15,3,13,'U');pline(b,20,15,24,14,'U')}
  else if(k==='barrel'||k==='cargo'){hiRect(b,4,2,14,15,(i,j,x,y)=>{const cx=11,bul=1+.6*Math.sin((y-2)/15*3.14),hw=5.6*bul/1.6+1.4;if(Math.abs(x-cx)>hw)return;const u=(x-cx)/hw;
      if(Math.abs(y-5)<.5||Math.abs(y-13.5)<.5||Math.abs(y-9.3)<.4)return u<-.3?'H':u>.5?'E':'G';const st=Math.floor((u+1)*3.5);if(Math.abs((u+1)*3.5-st)<.08)return'V';return woodC(i,j,WD,.82-((u+.4)*(u+.4))*.6,st)});
    prect(b,7,2,8,1,'Y');pset(b,10,1,'W');if(k==='cargo'){polyFill(b,[[15,9],[23,9],[23,17],[15,17]],(x,y)=>pset(b,x,y,woodC(EXX,EXY,WD,.75-(x-15)/18,9)));prect(b,15,9,8,1,'Y');prect(b,15,12.5,8,1,'V');pline(b,15,9,23,17,'W')}}
  else if(k==='survivor'){polyFill(b,[[0,12],[24,11],[24,15],[0,16]],(x,y)=>pset(b,x,y,woodC(EXX,EXY,WD,.7,4)));prect(b,0,11,24,1,'Y');
    polyFill(b,[[3,12],[14,10],[15,13],[4,14]],(x,y)=>pset(b,x,y,x<8?'R':'Q'));hiRect(b,14,5,6,6,(i,j,x,y)=>{const d=Math.hypot(x-17,y-8);return d<2.6?(y<7?'c':x<17?'m':'n'):''});pline(b,11,11,9,9,'n');pset(b,9,9,'m');pline(b,0,16,24,16,'U')}
  else{polyFill(b,[[3,4],[21,4],[21,17],[3,17]],(x,y)=>{const pl=Math.floor((y-4)/4.3);if(((y-4)/4.3-pl)<.1)return pset(b,x,y,'V');pset(b,x,y,woodC(EXX,EXY,WD,.8-(x-3)/26-pl*.05,pl))});
    prect(b,3,4,18,1,'Y');prect(b,3,4,1,13,'Y');prect(b,20,4,1,13,'V');pline(b,4,5,20,16,'W');pline(b,4,16,20,5,'W');pset(b,11,10,'g');pset(b,12,10,'f');for(const[x,y]of[[5,6],[18,6],[5,15],[18,15]])pset(b,x,y,'H');pline(b,2,17,22,17,'U')}return b}
function log3Buf(){const b=pbuf(27,10);hiRect(b,3,1,21,8,(i,j,x,y)=>{const t=(y-1)/8;if(t<0||t>1)return;const v=.85-Math.abs(t-.3)*1.1;if(hh2(i>>2,j)<.08)return'D';return woodC(i,j,WDG,v,3)});
  hiRect(b,0,1.5,4,7,(i,j,x,y)=>{const d=Math.hypot((x-2)*1.6,y-5);if(d>3.6)return;return Math.floor(d*1.3)%2?'M':'O'});prect(b,24,2,3,6,'L');pset(b,25,3,'M');pset(b,9,6,'E');pset(b,16,3,'E');pset(b,13,6,'E');return b}
function doorObj3(){const b=pbuf(21,39);prect(b,0,0,21,3,'H');prect(b,1,3,19,36,'x');prect(b,3,5,15,34,'V');for(let x=6;x<18;x+=4)prect(b,x,5,1,34,'W');prect(b,3,18,15,1,'W');pset(b,15,21,'g');pset(b,15,22,'I');return b}


/* Ковадло на пеньку; гаряче — з розжареною заготовкою */
function anvilObj3(hot){const b=pbuf(18,14);prect(b,4,9,10,5,'W');prect(b,4,9,1,5,'V');prect(b,13,9,1,5,'V');prect(b,5,9,8,1,'Y');pline(b,6,11,11,11,'V');
  polyFill(b,[[0,4],[3,3],[3,6]],(x,y)=>pset(b,x,y,'F'));prect(b,3,3,13,3,'G');prect(b,3,3,13,1,'H');prect(b,15,3,2,2,'F');prect(b,6,6,6,2,'F');prect(b,5,8,8,1,'E');
  if(hot){prect(b,5,1,9,2,'K');prect(b,6,1,7,1,'J');pset(b,9,1,'I');pset(b,3,0,'J');pset(b,15,0,'K');pset(b,12,-1,'J')}return b}
/* Усі сцени й об'єкти двору та берега малюються з масштабом SK */
yardBg3=HI(yardBg3);towerObj3=HI(towerObj3);towerSil3=HI(towerSil3);hearthObj3=HI(hearthObj3);emberObj3=HI(emberObj3);flame3Strip=HI(flame3Strip);signObj3=HI(signObj3);fogBuf3=HI(fogBuf3);
yardFull3=HI(yardFull3);shoreBg3=HI(shoreBg3);wreckObj3=HI(wreckObj3);rodObj3=HI(rodObj3);pierObj3=HI(pierObj3);shipObj3=HI(shipObj3);flotObj3=HI(flotObj3);log3Buf=HI(log3Buf);doorObj3=HI(doorObj3);
for(const k in BLD3)BLD3[k]=HI(BLD3[k]);anvilObj3=HI(anvilObj3);
