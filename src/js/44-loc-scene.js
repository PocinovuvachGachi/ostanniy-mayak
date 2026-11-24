/* ============ МІСЦЕ НА МАПІ: сцена локації ============
   Кожна локація — власне тло 432×240 (1,5×), складене з деталей (`lk*`): небо, море, земля, хати, башти, скелі.
   Місця локації (spots) — ліхтарі на кілках або портрет людини на дошці; картка `lc:<місце>` з описом і діями.
   Човен або вказівник — «Повернутися до маяка». Повний перелік — у «Усе списком». */
const LCW=432,LCH=240;
const cn=(x,y,s,sd)=>hh2(Math.floor(x/s)+(sd||0),Math.floor(y/s));
let LKCUR='';
function lkSky(b,h){const ph=GR;rampV(b,0,0,LCW,h,ph==='y'?['4','5','5','6']:ph==='d'?['C','o','3','4']:['A','B','C','1']);
  if(ph!=='y'){const R=rng(h*7+3);for(let i=0;i<140;i++){const x=Math.floor(R()*LCW*SK),y=Math.floor(R()*(h-12)*SK);phx(b,x,y,R()<.1?'y':R()<.5?'6':'5')}}
  const sd=LKCUR.length*7+h;lkMoon(b,60+(sd*37)%320,22+(sd%3)*6);lkClouds(b,h,sd)}
function lkSea(b,y0,y1){rampV(b,0,y0,LCW,y1-y0,['T','S','R','Q','P']);const R=rng(y0*13+5),kk=b.k;
  for(let i=0;i<260;i++){const x=Math.floor(R()*LCW*kk),yy=y0+1+R()*(y1-y0-1),y=Math.floor(yy*kk),l=Math.round((2+R()*8)*kk*(.4+.6*(yy-y0)/(y1-y0)));for(let q=0;q<l;q++)phx(b,x+q,y,yy<y0+10?'U':'T')}lkHorizon(b,y0)}
/* даль: пасмо островів на обрії й рідний маяк — видно звідусіль */
function lkHorizon(b,y0){const R=rng(LKCUR.length*31+y0);for(let k=0;k<4;k++){const x=R()*LCW,w=70+R()*110,h=7+R()*12;polyFill(b,[[x-w/2,y0+.5],[x-w/3,y0-h*.5],[x-w/8,y0-h],[x+w/6,y0-h*.8],[x+w/3,y0-h*.45],[x+w/2,y0+.5]],(px,py)=>pset(b,px,py,GR==='y'?(py<y0-h*.6?'5':'4'):(py<y0-h*.6?'B':'A')))}
  const M=typeof MAPPT!=='undefined'?MAPPT:{},me=M[LKCUR],tw=M.tower;if(!me||!tw||LKCUR==='heart')return;const tx=Math.max(24,Math.min(LCW-24,216+(tw[0]-me[0])*2.6));
  polyFill(b,[[tx-14,y0+.5],[tx-6,y0-4],[tx+7,y0-5],[tx+16,y0+.5]],(x,y)=>pset(b,x,y,GR==='y'?'4':'A'));prect(b,tx-1.5,y0-17,3,13,GR==='y'?'5':'B');prect(b,tx-2.5,y0-18,5,1.5,'A');prect(b,tx-1,y0-20,2,2,s.f.won?'I':'J');pset(b,tx-.5,y0-21.5,'A')}
function lkTowerX(){const M=MAPPT,me=M[s.at],tw=M.tower,C=LKS[s.at];if(!me||!tw||!C||!C.sea||s.at==='heart')return null;return[Math.max(24,Math.min(LCW-24,216+(tw[0]-me[0])*2.6)),C.sea[0]-19]}
function lkFar(b,y,seed){const R=rng(seed);for(let k=0;k<3;k++){const x=R()*LCW,w=50+R()*90,h=5+R()*9;polyFill(b,[[x-w/2,y],[x-w/4,y-h*.7],[x,y-h],[x+w/3,y-h*.6],[x+w/2,y]],(px,py)=>pset(b,px,py,GR==='y'?'4':'A'))}}
const LKG={sand:(x,y)=>sandC(x,y,'M'),grass:(x,y)=>{const n=cn(x,y,2,2);return n<.1?'s':n<.6?'Z':'r'},
  rock:(x,y)=>{const n=cn(x,y,3,3),st=cn(x,y*2.4,7,4);return st<.18?'D':n<.35?'E':'F'},heath:(x,y)=>{const n=cn(x,y,2,5),st=cn(x,y*2.4,7,6);return n<.14?'o':n<.3?'s':st<.2?'D':'E'},
  bog:(x,y)=>{const n=cn(x,y,3,7);return n<.12?'Z':n<.55?'s':'x'},mud:(x,y)=>{const n=cn(x,y,3,8);return n<.1?'L':n<.55?'W':'V'},white:(x,y)=>sandC(x,y,'N'),
  cave:(x,y)=>{const n=cn(x,y,4,10);return n<.1?'D':n<.6?'x':'A'},plank:(x,y)=>woodC(x,y,['V','W','X','Y'],.55,2)};
function lkGround(b,pts,kind,rim){const f=LKG[kind];polyFill(b,pts,(x,y)=>pset(b,x,y,f(EXX,EXY)));if(rim)for(let i=0;i<pts.length-1;i++){const[a,c]=[pts[i],pts[i+1]];if(a[1]>=LCH-1&&c[1]>=LCH-1)continue;if(Math.abs(a[0]-c[0])<1)continue;pline(b,a[0],a[1],c[0],c[1],rim)}}
function lkRock(b,cx,yb,w,h,sd){polyFill(b,[[cx-w/2,yb],[cx-w/2+w*.1,yb-h*.6],[cx-w*.15,yb-h],[cx+w*.2,yb-h*.9],[cx+w/2,yb-h*.3],[cx+w/2,yb]],(x,y)=>{const u=(x-cx)/w*2,v=(yb-y)/h,l=-u*.6+v*.5+(cn(EXX,EXY,3,sd)-.5)*.4;pset(b,x,y,l>.45?'G':l>.05?'F':l>-.35?'E':'D')})}
function lkHut(b,x,yb,w,wallH,roofH,o){const hb=hut(w,wallH,roofH,Object.assign({wall:['V','W','X'],roof:['D','E','F'],door:1,win:[3],lit:1},o));blitTo(b,hb,x,yb-hb.h)}
function lkPiles(b,x,y,w,len){for(let px=x+2;px<x+w;px+=7){prect(b,px,y,2,len,'V');prect(b,px,y,1,len,'W');prect(b,px,y+len-3,2,3,'Z')}}
function lkTowerS(b,cx,yb,w,h,o={}){const top=yb-h;hiRect(b,cx-w/2,top,w,h,(i,j,x,y)=>{const k=b.k,bh=Math.round(4*k),bw=Math.round(7*k),row=Math.floor(j/bh),off=row%2?Math.round(bw/2):0,mort=j%bh===bh-1||(i+off)%bw===0,u=(x-cx)/w*2;
    const sh=u<-.6?'G':u>.55?'D':u>.2?'E':'F';if(mort)return sh==='D'?'x':'D';return hh2(Math.floor((i+off)/bw),row)<.12?(sh==='G'?'F':'E'):sh});
  if(o.win)for(const[wx,wy,lit]of o.win){prect(b,cx+wx-2,top+wy,4,6,lit?'J':'x');if(lit)prect(b,cx+wx-1,top+wy+2,2,3,'I')}
  if(o.crown){for(let x=cx-w/2-2;x<cx+w/2+2;x+=4)prect(b,x,top-4,3,4,'F');prect(b,cx-w/2-2,top-1,w+4,2,'E')}
  if(o.roof)polyFill(b,[[cx-w/2-3,top],[cx,top-o.roof],[cx+w/2+3,top]],(x,y)=>pset(b,x,y,x<cx?'E':'D'))}
function lkPalis(b,x0,x1,yb,h){for(let x=x0;x<x1;x+=3.2){const hh=h-(hh2(Math.floor(x),3)*4|0);polyFill(b,[[x,yb],[x,yb-hh],[x+1.3,yb-hh-2.5],[x+2.7,yb-hh],[x+2.7,yb]],(px,py)=>pset(b,px,py,woodC(EXX,EXY,WD,px-x<1?.75:.45,Math.floor(x))))}prect(b,x0,yb-h*.4,x1-x0,1.5,'V');prect(b,x0,yb-h*.8,x1-x0,1.5,'V')}
function lkFire(b,x,yb){prect(b,x-3,yb-1,6,2,'V');for(let i=0;i<5;i++){const h=3+((i*7)%4);prect(b,x-2+i,yb-1-h,1,h,i%2?'K':'J')}pset(b,x,yb-6,'I');pset(b,x-1,yb-4,'I');pset(b,x+1,yb-3,'y')}
function lkReeds(b,x0,x1,yb,sd){const R=rng(sd);for(let x=x0;x<x1;x+=1.2+R()*2){const h=6+R()*12,l=(R()-.5)*3;pline(b,x,yb,x+l,yb-h,R()<.5?'X':'W');if(R()<.3)prect(b,x+l-.5,yb-h-2,1.5,3,'V')}}
function lkPine(b,cx,yb,h){prect(b,cx-1,yb-h*.25,2,h*.25,'V');for(let k=0;k<4;k++){const y=yb-h*.2-k*h*.2,w=h*.45*(1-k*.2);polyFill(b,[[cx-w/2,y],[cx,y-h*.32],[cx+w/2,y]],(x,yy)=>pset(b,x,yy,x<cx-w*.15?'Z':x<cx+w*.15?'s':'x'))}}
function lkArch(b,cx,yb,w,h){const t=4;polyFill(b,[[cx-w/2,yb],[cx-w/2,yb-h+w/2],[cx-w/4,yb-h+w/8],[cx,yb-h],[cx+w/4,yb-h+w/8],[cx+w/2,yb-h+w/2],[cx+w/2,yb],[cx+w/2-t,yb],[cx+w/2-t,yb-h+w/2+1],[cx,yb-h+t],[cx-w/2+t,yb-h+w/2+1],[cx-w/2+t,yb]],(x,y)=>pset(b,x,y,cn(EXX,EXY,3,11)<.2?'E':x<cx?'G':'F'))}
function lkStatue(b,cx,yb,h){polyFill(b,[[cx-h*.16,yb],[cx-h*.14,yb-h*.6],[cx-h*.1,yb-h*.85],[cx,yb-h],[cx+h*.1,yb-h*.85],[cx+h*.14,yb-h*.6],[cx+h*.16,yb]],(x,y)=>{const u=(x-cx)/(h*.16);pset(b,x,y,cn(EXX,EXY,2,12)<.15?'E':u<-.3?'G':u>.4?'D':'F')});prect(b,cx-h*.2,yb-1,h*.4,2,'E');pset(b,cx-1,yb-h*.82,'x');pset(b,cx+1,yb-h*.82,'x')}
function lkMill(b,cx,yb){polyFill(b,[[cx-10,yb],[cx-7,yb-30],[cx+7,yb-30],[cx+10,yb]],(x,y)=>pset(b,x,y,woodC(EXX,EXY,['V','W','X','Y'],x<cx-3?.75:.4,5)));polyFill(b,[[cx-9,yb-30],[cx,yb-40],[cx+9,yb-30]],(x,y)=>pset(b,x,y,x<cx?'v':'t'));
  prect(b,cx-2,yb-9,4,9,'x');prect(b,cx-2,yb-22,3,3,'J');const hx=cx,hy=yb-31;for(let a=0;a<4;a++){const an=a*Math.PI/2+.4,ex=hx+Math.cos(an)*24,ey=hy+Math.sin(an)*24;pline(b,hx,hy,ex,ey,'W');pline(b,hx+Math.cos(an+.08)*6,hy+Math.sin(an+.08)*6,ex+Math.cos(an+1.57)*4,ey+Math.sin(an+1.57)*4,'N')}prect(b,hx-1,hy-1,2,2,'V')}
function lkCrates(b,x,yb,n){for(let i=0;i<n;i++){const cx=x+(i%3)*11+(i>2?5:0),cy=yb-(i>2?10:0)-10;polyFill(b,[[cx,cy],[cx+10,cy],[cx+10,cy+10],[cx,cy+10]],(px,py)=>pset(b,px,py,woodC(EXX,EXY,WD,.7-(px-cx)/24,i)));prect(b,cx,cy,10,1,'Y');pline(b,cx,cy,cx+10,cy+10,'W')}}
function lkGraves(b,x,yb,n){for(let i=0;i<n;i++){const cx=x+i*14,h=8+(i%2)*3;prect(b,cx,yb-h,2,h,'H');prect(b,cx-2,yb-h+2,6,2,'H');prect(b,cx+1,yb-h,1,h,'F');prect(b,cx-3,yb,8,1,'E')}}
function lkBrig(b,x0,yb){const gun=x=>yb-58+(x-x0)*.12,keel=x=>{const t=(x-x0-110)/120;return yb-6-30*t*t*t*t};
  const pts=[];for(let x=x0;x<=x0+220;x+=6)pts.push([x,gun(x)]);for(let x=x0+220;x>=x0;x-=6)pts.push([x,keel(x)]);
  polyFill(b,pts,(x,y)=>{const g=gun(x),k=Math.max(g+6,keel(x)),t=(y-g)/(k-g),band=Math.floor(t*9),ft=t*9-band;
    if((band===4&&x>x0+40&&x<x0+70)||(band===6&&x>x0+130&&x<x0+150)){pset(b,x,y,Math.floor(EXX)%14<3?'W':'x');return}
    if(ft<.14){pset(b,x,y,'x');return}pset(b,x,y,woodC(EXX,EXY,WD,.8-band*.07-(x-x0)/700,band*5))});
  pline(b,x0,gun(x0)-1,x0+220,gun(x0+220)-1,'Y');for(let i=0;i<14;i++){const x=x0+12+i*15,g=gun(x);if(i===5||i===9)continue;pline(b,x,g,x-2,g-10-(i%3)*5,'X');pline(b,x+1,g,x-1,g-10-(i%3)*5,'V')}
  pline(b,x0+150,gun(x0+150),x0+190,gun(x0+150)-46,'W');pline(b,x0+151,gun(x0+150),x0+191,gun(x0+150)-46,'V');
  prect(b,x0+196,gun(x0+196)+8,8,6,'x');prect(b,x0+197,gun(x0+196)+9,6,4,'B');prect(b,x0+200,gun(x0+196)+9,1,4,'V')}
function lkVortex(b,cx,cy){for(let a=0;a<900;a++){const t=a/900,an=t*6.283*4,r=4+t*90,x=cx+Math.cos(an)*r*1.8,y=cy+Math.sin(an)*r*.55;if(y<100||y>LCH)continue;pset(b,x,y,t<.2?'u':t<.5?'U':'T');if(a%3===0)pset(b,x+1,y,'S')}
  hiRect(b,cx-14,cy-5,28,10,(i,j,x,y)=>{const d=Math.hypot((x-cx)/2.6,y-cy);return d<4?(d<1.6?'x':'P'):''})}
/* Тла локацій і місця (x — центр, y — низ позначки) */
const LKS={
  chaika:{sea:[96,170],bg(b){lkSky(b,100);lkSea(b,96,240);lkFar(b,98,3);lkBrig(b,150,186);lkGround(b,[[0,240],[0,196],[40,186],[90,190],[140,200],[220,206],[300,200],[432,208],[432,240]],'rock','G');lkRock(b,60,198,46,30,1);lkRock(b,380,214,40,22,2);lkRock(b,250,214,30,14,3)},
    sp:{deck:[230,128],cabin:[338,158],hold:[205,186]}},
  village:{sea:[96,190],bg(b){lkSky(b,100);lkSea(b,96,240);lkFar(b,98,7);
      lkHut(b,30,142,52,22,16,{roof:['t','v','w'],win:[8,38],chim:1,chimX:40});lkPiles(b,30,142,52,40);lkHut(b,120,136,40,18,14,{roof:['D','E','F'],win:[6]});lkPiles(b,120,136,40,46);
      lkHut(b,196,140,46,20,14,{roof:['V','W','X'],win:[6,34]});lkPiles(b,196,140,46,42);lkHut(b,360,150,44,18,12,{roof:['D','E','F'],win:[30],lit:0});lkPiles(b,360,150,44,34);
      lkGround(b,[[0,240],[0,186],[30,182],[90,184],[160,188],[250,190],[270,196],[270,240]],'plank','Y');lkGround(b,[[250,198],[432,196],[432,206],[250,208]],'plank','Y');for(let x=256;x<432;x+=12){prect(b,x,206,2,34,'V')}},
    sp:{tavern:[56,182],hut:[140,184],shop:[220,186],pier:[300,196],harbor:[400,194],boy:[350,232]}},
  cliffs:{sea:[110,240],bg(b){lkSky(b,112);lkSea(b,110,240);lkFar(b,112,9);lkGround(b,[[0,240],[0,64],[40,56],[90,62],[140,82],[170,112],[176,140],[210,150],[240,140],[268,160],[300,176],[330,240]],'heath','H');
      for(const[x,h]of[[206,22],[220,30],[234,20]]){prect(b,x,150-h,7,h,'F');prect(b,x,150-h,2,h,'G');prect(b,x+5,150-h,2,h,'D')}},
    sp:{nests:[70,60],slope:[120,120],stones:[220,152],gorge:[290,178]}},
  bay:{sea:[100,200],bg(b){lkSky(b,100);const low=typeof lowTide==='function'&&lowTide();lkSea(b,96,240);lkFar(b,98,11);
      if(low)lkGround(b,[[0,240],[0,180],[80,170],[200,176],[330,170],[432,178],[432,240]],'mud','X');else lkGround(b,[[0,240],[0,206],[90,200],[200,212],[300,206],[432,214],[432,240]],'mud','X');
      for(const x of[50,96,150,206,262,318,372])prect(b,x,140,4,(low?44:70)+(x%3)*2,'V'),prect(b,x,140,1,(low?44:70),'W');
      if(!s.f.bayChest&&low){prect(b,210,182,16,9,'W');prect(b,210,182,16,2,'Y');prect(b,210,185,16,1,'H');pset(b,217,187,'g')}},
    sp:{shallow:[110,206],chest:[218,214],deep:[320,170]}},
  cave:{dark:1,bg(b){prect(b,0,0,LCW,LCH,'x');lkGround(b,[[0,0],[432,0],[432,240],[380,240],[372,120],[330,60],[230,40],[120,52],[70,110],[60,240],[0,240]],'cave');
      lkGround(b,[[60,240],[64,190],[200,180],[330,186],[376,200],[380,240]],'rock');polyFill(b,[[300,200],[372,196],[378,232],[296,236]],(x,y)=>pset(b,x,y,cn(EXX,EXY,2,13)<.08?'S':'P'));
      lkCrates(b,150,196,5);for(const[x,y]of[[110,120],[250,100]]){prect(b,x,y,2,8,'V');pset(b,x,y-1,'K');pset(b,x,y-2,'J');pset(b,x+1,y-3,'I')}},
    sp:{gate:[50,200],store:[170,196],depth:[260,180],lake:[340,220]},lt:[[111,116],[251,96]]},
  reef:{sea:[100,240],bg(b){lkSky(b,104);lkSea(b,100,240);lkFar(b,102,13);lkGround(b,[[60,240],[80,196],[130,184],[220,180],[320,186],[380,206],[400,240]],'rock','G');
      lkTowerS(b,226,186,28,96,{roof:18,win:[[0,22,0],[0,50,0]]});prect(b,219,96,14,14,'x');polyFill(b,[[222,98],[226,95],[230,98],[231,106],[221,106]],(x,y)=>pset(b,x,y,x<226?'q':'p'));prect(b,222,172,8,14,'x');lkGraves(b,300,204,4)},
    sp:{bells:[226,112],crypt:[226,190],grave:[320,212]}},
  fort:{sea:[100,200],bg(b){lkSky(b,104);lkSea(b,100,240);lkGround(b,[[0,240],[0,170],[100,160],[300,158],[432,164],[432,240]],'rock','G');
      lkPalis(b,20,300,166,30);lkTowerS(b,370,166,30,112,{crown:1,win:[[0,26,0],[0,60,0]]});lkFire(b,370,52);prect(b,230,146,48,22,'E');prect(b,230,146,48,2,'G');for(let x=236;x<272;x+=6)prect(b,x,152,2,10,'x');
      lkFire(b,60,164);lkFire(b,180,164);lkGround(b,[[0,240],[0,214],[90,210],[110,240]],'plank','Y')},
    sp:{pier:[48,222],yard:[150,196],prison:[254,190],tower:[370,100]},lt:[[370,46],[60,158],[180,158]]},
  warehouse:{bg(b){lkSky(b,96);lkFar(b,96,15);lkGround(b,[[0,240],[0,150],[432,146],[432,240]],'sand');
      polyFill(b,[[70,150],[70,92],[360,88],[360,150]],(x,y)=>pset(b,x,y,woodC(EXX,EXY,['x','V','W','X'],.55-(y-90)/300,3)));for(let x=70;x<360;x+=6)prect(b,x,90,1,60,'V');
      polyFill(b,[[60,94],[214,62],[370,90]],(x,y)=>pset(b,x,y,cn(EXX,EXY,2,14)<.1?'E':x<214?'F':'E'));prect(b,186,110,40,40,'x');prect(b,206,110,1,40,'V');prect(b,280,108,10,8,'J');pset(b,284,111,'I');
      lkCrates(b,370,200,6);for(let i=0;i<5;i++){pline(b,90+i*8,150,96+i*8,120,'H')}},
    sp:{yard:[90,206],contact:[150,152],hall:[206,152],cell:[300,152],crates:[390,212]},lt:[[285,112]]},
  bog:{bg(b){lkSky(b,108);lkFar(b,108,17);lkGround(b,[[0,240],[0,110],[432,108],[432,240]],'bog');
      for(const[x,y,w]of[[20,150,70],[140,200,90],[270,170,60],[60,220,50],[350,214,70]])polyFill(b,[[x,y],[x+w*.2,y-4],[x+w*.8,y-4],[x+w,y],[x+w*.8,y+4],[x+w*.2,y+4]],(px,py)=>pset(b,px,py,cn(EXX,EXY,2,15)<.08?'R':'P'));
      lkReeds(b,0,120,150,5);lkReeds(b,200,260,172,6);lkReeds(b,380,432,210,7);lkHut(b,310,150,44,18,14,{roof:['W','X','Y'],win:[6]});
      for(let i=0;i<14;i++){const x=110+i*14,y=210-i*4;prect(b,x,y,9,2,'W');prect(b,x,y,9,1,'X')}},
    sp:{edge:[60,208],path:[200,178],hut:[340,152]},lt:[[318,138]]},
  shoal:{sea:[96,160],bg(b){lkSky(b,98);lkSea(b,96,240);lkFar(b,98,19);lkGround(b,[[0,240],[0,170],[120,160],[240,166],[330,158],[432,170],[432,240]],'sand','N');
      for(let i=0;i<9;i++){const x=30+i*44,y=190+(i%3)*14;polyFill(b,[[x,y],[x+20,y-2],[x+26,y+2],[x+4,y+3]],(px,py)=>pset(b,px,py,'R'))}lkRock(b,330,168,60,26,4);lkRock(b,360,172,30,14,5);prect(b,316,160,10,6,'x')},
    sp:{flats:[150,196],king:[330,170]}},
  spit:{sea:[96,240],bg(b){lkSky(b,100);lkSea(b,96,240);lkFar(b,98,21);lkGround(b,[[0,240],[0,200],[100,186],[220,176],[330,160],[432,156],[432,240]],'white','u');
      lkHut(b,320,160,44,20,14,{roof:['D','E','F'],win:[6],chim:0});prect(b,354,104,6,42,'F');prect(b,354,104,2,42,'G');prect(b,352,102,10,3,'E')},
    sp:{sand:[110,196],shallows:[230,186],hut:[340,162]},lt:[[328,146]]},
  mine:{dark:1,bg(b){prect(b,0,0,LCW,LCH,'x');lkGround(b,[[0,0],[432,0],[432,240],[400,240],[390,90],[300,50],[150,50],[60,100],[40,240],[0,240]],'cave');
      lkGround(b,[[40,240],[44,190],[200,176],[380,180],[400,240]],'rock');for(const x of[90,180,270,350]){prect(b,x,90,5,96,'W');prect(b,x,90,2,96,'X')}prect(b,80,86,290,6,'W');prect(b,80,86,290,2,'X');
      for(let x=60;x<400;x+=7)prect(b,x,214,4,2,'W');prect(b,50,212,360,1,'H');prect(b,50,218,360,1,'H');prect(b,140,198,26,12,'E');prect(b,140,198,26,2,'G');
      polyFill(b,[[320,180],[352,180],[356,160],[316,160]],(x,y)=>pset(b,x,y,'D'));prect(b,326,166,20,10,'K');prect(b,330,169,12,6,'J');pset(b,336,171,'I')},
    sp:{gate:[66,206],shaft:[220,186],forge:[336,184]},lt:[[336,170]]},
  shipisle:{sea:[100,170],bg(b){lkSky(b,104);lkSea(b,100,240);lkFar(b,102,23);lkGround(b,[[0,240],[0,200],[140,190],[260,180],[432,150],[432,240]],'sand','N');lkGround(b,[[260,182],[300,150],[432,118],[432,170]],'grass');
      for(const[x,h]of[[310,60],[340,72],[372,66],[404,78],[426,60]])lkPine(b,x,152,h);
      for(let i=0;i<9;i++){const x=150+i*12;pline(b,x,190,x-6,150+Math.abs(4-i)*4,'X');pline(b,x+1,190,x-5,150+Math.abs(4-i)*4,'V')}prect(b,130,190,120,3,'W');prect(b,130,190,120,1,'Y')},
    sp:{shore:[80,212],yard:[200,196],wood:[380,156]}},
  monastery:{sea:[100,240],bg(b){lkSky(b,104);lkSea(b,100,240);lkFar(b,102,25);for(const[x,w,h]of[[90,40,70],[150,46,86],[214,46,96],[278,46,86],[342,40,70]])lkArch(b,x,190,w,h);lkTowerS(b,214,96,20,30,{roof:10});
      for(let x=0;x<LCW;x+=3)pset(b,x,190+Math.sin(x/9)*1.2,'u')},
    sp:{gate:[150,196],nave:[290,190]}},
  guardians:{sea:[100,240],bg(b){lkSky(b,104);lkSea(b,100,240);lkGround(b,[[30,240],[60,180],[160,160],[300,156],[380,176],[410,240]],'rock','G');for(const[x,h]of[[150,64],[226,78],[300,64]])lkStatue(b,x,158,h);
      for(let i=0;i<6;i++)prect(b,90+i*8,226-i*8,14,3,'F')},
    sp:{steps:[110,226],altar:[226,170]}},
  cape:{sea:[100,240],bg(b){lkSky(b,104);lkSea(b,100,240);lkFar(b,102,27);lkGround(b,[[0,240],[0,86],[80,80],[160,100],[240,124],[300,150],[340,176],[360,240]],'grass','r');
      lkMill(b,100,82);lkHut(b,200,124,40,16,12,{roof:['t','v','w'],win:[6]});lkGround(b,[[330,206],[432,202],[432,212],[330,214]],'plank','Y');for(let x=336;x<432;x+=12)prect(b,x,212,2,28,'V')},
    sp:{mill:[100,84],hut:[220,126],port:[380,204]},lt:[[99,61],[207,112]]},
  heart:{sea:[96,240],bg(b){lkSky(b,100);lkSea(b,96,240);lkVortex(b,216,170);lkRock(b,60,210,70,40,6);lkRock(b,380,220,60,34,7)},
    sp:{core:[216,166]}},
};
function lkBg3(l){LKCUR=l;const b=pbuf(LCW,LCH);const C=LKS[l];if(C)C.bg(b);else{lkSky(b,100);lkSea(b,96,240)}if(LKX[l])LKX[l](b);return b}
function lkPin3(on){const b=pbuf(10,22);prect(b,4,6,2,16,'W');prect(b,4,6,1,16,'X');prect(b,2,5,6,1,'V');prect(b,6,5,1,3,'z');
  prect(b,1,8,6,7,'z');prect(b,2,9,4,5,on?'J':'B');if(on){prect(b,3,10,2,3,'I');pset(b,3,10,'y')}prect(b,1,7,6,1,'E');prect(b,2,15,4,1,'E');return b}
function lkPlq3(){const b=pbuf(36,46);prect(b,17,36,2,10,'W');prect(b,17,36,1,10,'X');prect(b,0,0,36,36,'V');prect(b,1,1,34,34,'W');prect(b,0,0,36,1,'Y');prect(b,0,35,36,1,'x');prect(b,2,2,32,32,'x');return b}
function lkBoat3(sea){const b=pbuf(36,20);if(!sea){prect(b,16,4,3,16,'W');prect(b,16,4,1,16,'X');polyFill(b,[[2,2],[30,2],[35,7],[30,12],[2,12]],(x,y)=>pset(b,x,y,woodC(EXX,EXY,WD,.75,2)));prect(b,2,2,28,1,'Y');prect(b,6,6,18,1,'V');return b}
  polyFill(b,[[0,9],[36,9],[31,17],[5,17]],(x,y)=>{const t=(y-9)/8,band=Math.floor(t*3);if((t*3-band)<.18&&band)return pset(b,x,y,'V');pset(b,x,y,woodC(EXX,EXY,WD,.8-band*.2,band))});prect(b,0,9,36,1,'Y');
  pline(b,8,8,26,2,'X');pline(b,8,9,26,3,'W');pline(b,0,18,36,18,'U');pline(b,3,19,33,19,'T');return b}
for(const f of['lkBg3','lkPin3','lkPlq3','lkBoat3'])globalThis[f]=HI(globalThis[f]);
function lcSig(l){return l+':'+(l==='bay'?(lowTide()?1:0)+''+(s.f.bayChest?1:0):'')}
/* Тіло місця: опис, головоломки, дії (одне для картки й для списку) */
function spotBody(l,S,pre){const body=[];body.push(`<p class="m">${typeof S.d==='function'?VH(S.d):S.d}</p>`);
  if(S.dark&&!s.eq.light)body.push(`<p class="m">Тут темно хоч в око стрель. Без ліхтаря в руці нічого не зробиш.</p>`);
  if(S.bells)body.push(rBells());if(S.stones)body.push(rStones());if(S.bog)body.push(rBog());
  for(const A of S.acts||[]){const id=`${l}.${S.id}.${A.id}`;if(A.once&&s.done[id])continue;if(A.show&&!A.show())continue;
    if(A.riddle){body.push(`<p class="quote">${A.riddle.q}</p>${s.wrong[id]?`<p class="hint">${A.riddle.hint()}</p>`:''}<div class="act"><input id="${pre||'rd'}-${id.replace(/\./g,'-')}" data-rid="${id}" autocomplete="off" aria-label="Відповідь на загадку" placeholder="Твоя відповідь">${btn('Відповісти','riddle',id)}</div>`);continue}
    let lab=A.t;if(A.c||A.it)lab+=` (${costTxt(A.c,A.it)})`;if(A.fight)lab+=' — бій';
    const o={ok:()=>laOk(id)};if(A.cd){o.cd='la.'+id;o.cs=A.cd}
    body.push(`<div class="act">${btn(lab,'la',id,o)}${fresh9('a:'+id)}${A.fight&&quickOk(A.fight)?btn('Швидкий бій','qf',id,{ok:()=>laOk(id)}):''}${A.chk?chk(A.chk[0],A.chk[1]):''}</div>`)}
  return body.join('')}
function spotNew(l,S){return(S.acts||[]).some(A=>{const id=`${l}.${S.id}.${A.id}`;return!(A.once&&s.done[id])&&(!A.show||A.show())&&!prev9['a:'+id]&&laOk(id)})}
function locScene(){const l=s.at,L=LOC[l],C=LKS[l]||{sp:{}},W=LCW,H=LCH,dark=(L.dark||C.dark)&&!s.eq.light;
  let h=`<span data-sk="bg" data-sig="bg" class="scbg">${VH(()=>pimg(pxURL('lc3:'+lcSig(l)+':'+GR,()=>lkBg3(l)),864,480,'scene',L.n))}</span>`;
  const sps=L.spots.filter(S=>!S.show||S.show()),lights=[];let auto=0;
  for(const S of sps){let p=C.sp[S.id];if(!p){p=[60+((auto++)*97)%320,200]}const[x,y]=p,nw=spotNew(l,S);
    if(S.face){const sp=obURL('lcq3',lkPlq3);h+=ob('lc:'+S.id,'bpop','lc:'+S.id,sp,x-18,y-46,W,H,S.n,`<b>${S.n}</b>`,{cls:'lcp',pulse:nw,always:nw,inner:`<img class="lcface" src="${faceSceneURL(S.face)}" alt=""><span class="mpl">${S.n}</span>`})}
    else{const on=!(S.dark&&!s.eq.light);h+=ob('lc:'+S.id,'bpop','lc:'+S.id,obURL('lcp3:'+(on?1:0),()=>lkPin3(on)),x-5,y-22,W,H,S.n,`<b>${S.n}</b>`,{cls:'lcp',pulse:nw,always:nw,inner:`<span class="mpl">${S.n}</span>`});if(on)lights.push({x,y:y-11,r:26,c:WARM,a:.55})}}
  h+=ob('lc:leave','leave','',obURL('lcb3:'+(L.sea?1:0),()=>lkBoat3(!!L.sea)),6,LCH-24,W,H,'Повернутися до маяка','<b>Назад</b><br>Повернутися до маяка.',{cls:'lcp',inner:'<span class="mpl">До маяка</span>'});
  const tx=lkTowerX();if(tx)lights.push({x:tx[0],y:tx[1],r:s.f.won?26:12,c:PALE,a:s.f.won?.7:.4});
  const fires=(C.lt||[]).map(([x,y])=>({x,y,r:34,c:FIRE,a:.6}));
  return`<div class="scn rm lc${dark?' lcd':''}" data-scn="lc:${l}" style="${scnD()}">${h}${fxCanvas('lc',W,H)}${lightLayers(W,H,{fire:fires,win:lights})}</div>`}
function locPopHTML(id){const l=s.at,L=LOC[l];if(!L)return'';const S=L.spots.find(x=>x.id===id.slice(3));if(!S||(S.show&&!S.show()))return'';
  return`<div class="bpop wide" role="dialog" aria-label="${S.n}"><div class="bph"><b>${S.n}</b><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>${S.face?`<div class="lcpf">${pimg(faceURL(S.face),48,48,'face','')}<div>${spotBody(l,S,'rdp')}</div></div>`:spotBody(l,S,'rdp')}</div>`}
/* ---- Деталі, що оживляють місця ---- */
function lkMoon(b,x,y){if(GR==='y')return;hiRect(b,x-9,y-9,18,18,(i,j,px,py)=>{const d=Math.hypot(px-x,py-y);if(d<5.2)return(Math.hypot(px-x+1.6,py-y+1)<1.3||Math.hypot(px-x-1.8,py-y-1.5)<1)?'6':px-x>2.6?'6':'u';if(d<8&&(8-d)/12>bay(i,j))return'1'})}
function lkClouds(b,h,sd){const R=rng(sd);for(let k=0;k<6;k++){const cy=10+R()*(h-30),cx=R()*LCW,w=70+R()*150,th=4+R()*6;hiRect(b,cx-w/2,cy-th,w,th*2,(i,j,x,y)=>{const u=(x-cx)/(w/2),v=(y-cy)/th,d=u*u+v*v*1.6+.25*Math.sin(x/9+k);if(d<1&&(1-d)*1.3>bay(i,j))return v<-.35?'2':v<.2?'1':'C'})}}
function lkBarrel(b,x,yb){polyFill(b,[[x,yb-9],[x+7,yb-9],[x+7.5,yb-4.5],[x+7,yb],[x,yb],[x-.5,yb-4.5]],(px,py)=>pset(b,px,py,woodC(EXX,EXY,WD,.8-(px-x)/9,x)));prect(b,x,yb-7,7,1,'z');prect(b,x,yb-2.5,7,1,'z');prect(b,x+1,yb-9,5,1,'Y')}
function lkNet(b,x0,x1,y0,h){prect(b,x0,y0-4,2,h+8,'V');prect(b,x1,y0-4,2,h+8,'V');for(let x=x0+2;x<x1;x++){const sag=Math.sin((x-x0)/(x1-x0)*3.14)*3;for(let y=y0+sag;y<y0+h+sag*.5;y++)if((Math.floor(x)+Math.floor(y))%3===0||(Math.floor(x)-Math.floor(y)+300)%3===0)pset(b,x,y,'M')}pline(b,x0,y0,x1,y0,'N');for(let x=x0+4;x<x1;x+=6)prect(b,x,y0+h-1,2,2,'X')}
function lkSkiff(b,x,y){polyFill(b,[[x,y],[x+24,y],[x+21,y+5],[x+3,y+5]],(px,py)=>pset(b,px,py,woodC(EXX,EXY,WD,.75-(py-y)/10,x)));prect(b,x,y,24,1,'Y');pline(b,x+6,y-1,x+18,y-3,'X');pline(b,x-2,y+6,x+26,y+6,'U')}
function lkPost(b,x,yb){prect(b,x,yb-22,2,22,'W');prect(b,x,yb-22,1,22,'X');prect(b,x-2,yb-24,6,1,'V');prect(b,x-1,yb-21,4,5,'z');prect(b,x,yb-20,2,3,'J');pset(b,x,yb-20,'I')}
function lkDeadTree(b,x,yb,h){pline(b,x,yb,x+1,yb-h,'V');pline(b,x+1,yb,x+2,yb-h,'W');for(const[t,dx,dy]of[[.5,-7,-6],[.65,6,-5],[.8,-4,-5],[.9,5,-3]])pline(b,x+1,yb-h*t,x+1+dx,yb-h*t+dy,'V')}
function lkBush(b,x,yb,w,R){polyFill(b,[[x,yb],[x+w*.15,yb-w*.35],[x+w*.5,yb-w*.45],[x+w*.85,yb-w*.3],[x+w,yb]],(px,py)=>pset(b,px,py,cn(EXX,EXY,2,x)<.25?R[0]:px<x+w*.45?R[2]:R[1]))}
function lkGull(b,x,y){prect(b,x,y,3,2,'6');pset(b,x+3,y,'6');pset(b,x+3,y-1,'u');pset(b,x+4,y,'g');pset(b,x,y+2,'x');pset(b,x+2,y+2,'x')}
function lkStalac(b,x0,x1,yTop,sd){const R=rng(sd);for(let x=x0;x<x1;x+=4+R()*8){const h=4+R()*14,w=2+R()*3;polyFill(b,[[x,yTop],[x+w,yTop],[x+w/2,yTop+h]],(px,py)=>pset(b,px,py,px<x+w/2?'E':'D'))}}
function lkCart(b,x,yb){polyFill(b,[[x,yb-12],[x+22,yb-12],[x+20,yb-4],[x+2,yb-4]],(px,py)=>pset(b,px,py,woodC(EXX,EXY,WD,.6,3)));prect(b,x,yb-12,22,1,'Y');for(const wx of[x+5,x+17])hiRect(b,wx-3,yb-6,6,6,(i,j,px,py)=>{const d=Math.hypot(px-wx,py-yb+3);return d<2.8?(d<1?'H':d>2?'E':'D'):''});prect(b,x+3,yb-15,16,3,'D');prect(b,x+3,yb-15,16,1,'F')}
function lkHay(b,x,yb){polyFill(b,[[x,yb],[x+4,yb-12],[x+10,yb-15],[x+16,yb-12],[x+20,yb]],(px,py)=>pset(b,px,py,cn(EXX,EXY,2,7)<.2?'X':px<x+9?'e':'Y'))}
function lkFence(b,x0,x1,yb){for(let x=x0;x<x1;x+=9)prect(b,x,yb-9,2,9,'W');pline(b,x0,yb-7,x1,yb-7,'X');pline(b,x0,yb-3,x1,yb-3,'X')}
function lkTent(b,x,yb,w){polyFill(b,[[x,yb],[x+w/2,yb-w*.6],[x+w,yb]],(px,py)=>pset(b,px,py,px<x+w/2?'M':'L'));prect(b,x+w/2-2,yb-7,4,7,'x');pline(b,x+w/2,yb-w*.6,x+w/2,yb-w*.6-4,'W')}
function lkFlag(b,x,yb,c){prect(b,x,yb-30,1.5,30,'W');polyFill(b,[[x+1.5,yb-30],[x+14,yb-27],[x+1.5,yb-23]],(px,py)=>pset(b,px,py,c))}
function lkLogs(b,x,yb,n){for(let i=0;i<n;i++){const r=Math.floor(i/4),c=i%4,lx=x+c*9+r*4,ly=yb-4-r*4;prect(b,lx,ly,9,4,'X');prect(b,lx,ly,9,1,'Y');hiRect(b,lx,ly,2,4,(a,q,px,py)=>'N');pset(b,lx+.5,ly+2,'M')}}
function lkShells(b,x0,x1,yy,sd){const R=rng(sd);for(let i=0;i<14;i++){const x=x0+R()*(x1-x0),y=yy+R()*30;pset(b,x,y,R()<.5?'O':'u');if(R()<.4)pset(b,x+1,y,'N')}}
function lkCandles(b,x,yb){for(let i=0;i<4;i++){prect(b,x+i*4,yb-3-(i%2)*2,2,3+(i%2)*2,'O');pset(b,x+i*4,yb-4-(i%2)*2,'I')}}
function lkFore(b,side,kind){const R=side<0?[[0,240],[0,214],[18,206],[40,212],[58,226],[70,240]]:[[LCW,240],[LCW,208],[410,204],[388,214],[372,228],[364,240]];
  polyFill(b,R,(x,y)=>pset(b,x,y,kind==='grass'?(cn(EXX,EXY,2,3)<.3?'Z':'s'):cn(EXX,EXY,3,5)<.2?'D':'x'));if(kind==='grass')for(let i=0;i<14;i++){const x=side<0?4+i*4:LCW-4-i*4;pline(b,x,240-4,x+(i%3-1)*2,212+(i*7)%14,'s')}}
const LKX={
  chaika:b=>{lkBarrel(b,90,192);lkBarrel(b,100,194);lkCrates(b,286,204,2);lkGull(b,214,126);lkGull(b,300,138);pline(b,60,180,140,150,'W');pline(b,61,181,141,151,'V');lkFore(b,1,'rock')},
  village:b=>{lkNet(b,88,114,148,22);lkSkiff(b,284,188);lkSkiff(b,168,180);lkBarrel(b,12,188);lkBarrel(b,104,190);lkBarrel(b,178,194);lkPost(b,252,198);lkPost(b,110,186);
    pline(b,82,150,120,146,'H');for(const[x,c]of[[90,'i'],[98,'N'],[106,'S']]){prect(b,x,149,5,7,c);prect(b,x,149,5,1,'O')}lkGull(b,224,128)},
  cliffs:b=>{lkDeadTree(b,150,98,26);lkBush(b,40,64,16,['s','o',')']);lkBush(b,100,72,14,['s','o',')']);lkBush(b,250,148,14,['s','Z','o']);for(const[x,y]of[[60,52],[84,54],[30,58]])lkGull(b,x,y);for(let i=0;i<8;i++)prect(b,150+i*14,128+i*6,10,2,'F')},
  bay:b=>{lkSkiff(b,280,176);lkGull(b,150,136);lkGull(b,318,136);for(const x of[60,120,350])prect(b,x,196,7,6,'z'),pline(b,x,196,x+7,202,'H');lkFore(b,-1,'rock')},
  cave:b=>{lkStalac(b,90,360,46,3);lkStalac(b,130,330,52,4);lkBarrel(b,80,196);lkBarrel(b,89,198);lkBarrel(b,250,186);for(let i=0;i<3;i++){prect(b,214+i*5,184,3,6,'r');pset(b,215+i*5,182,'X')}pline(b,280,120,300,186,'X');lkFore(b,1,'rock')},
  reef:b=>{lkGull(b,180,180);lkGull(b,274,178);polyFill(b,[[250,198],[262,192],[270,198]],(x,y)=>pset(b,x,y,'q'));for(let i=0;i<10;i++)pline(b,90+i*28,196+(i%3)*4,94+i*28,190+(i%3)*4,'Z')},
  fort:b=>{lkTent(b,120,166,22);lkTent(b,168,166,18);lkFlag(b,300,140,'t');lkCrates(b,196,178,3);lkSkiff(b,20,206);lkBarrel(b,110,196)},
  warehouse:b=>{lkNet(b,20,60,110,30);lkNet(b,372,412,104,34);lkCart(b,240,198);lkBarrel(b,320,196);lkBarrel(b,329,198);lkPost(b,160,150);lkFore(b,-1,'grass')},
  bog:b=>{lkDeadTree(b,40,150,40);lkDeadTree(b,270,170,30);lkDeadTree(b,400,140,46);for(const[x,y]of[[150,202],[166,206],[300,174],[60,152]])prect(b,x,y,4,1.5,'r'),pset(b,x+1,y-1,'g');lkFore(b,1,'grass')},
  shoal:b=>{lkShells(b,40,300,180,9);lkLogs(b,200,190,3);lkGull(b,120,170);lkGull(b,260,166);for(const[x,y]of[[90,200],[240,214]])prect(b,x,y,4,2,'v'),pset(b,x-1,y-1,'v'),pset(b,x+4,y-1,'v')},
  spit:b=>{lkNet(b,280,312,140,18);lkSkiff(b,180,166);lkShells(b,60,300,190,10);lkBarrel(b,372,162)},
  mine:b=>{lkStalac(b,140,380,52,5);lkCart(b,240,214);for(const[x,y]of[[120,140],[300,128]]){prect(b,x,y,3,4,'z');prect(b,x,y+1,3,2,'J')}pline(b,170,190,180,170,'X');pline(b,180,170,186,172,'H');lkFore(b,-1,'rock')},
  shipisle:b=>{lkLogs(b,40,200,7);lkBarrel(b,100,200);lkBarrel(b,108,201);pline(b,96,186,118,176,'X');pline(b,118,176,124,186,'X');lkSkiff(b,20,196);lkGull(b,232,140)},
  monastery:b=>{polyFill(b,[[60,214],[80,208],[96,214],[80,218]],(x,y)=>pset(b,x,y,'q'));for(let i=0;i<6;i++){prect(b,120+i*40,206+(i%2)*10,10,2,'W')}lkGull(b,214,58)},
  guardians:b=>{lkCandles(b,214,162);for(const x of[150,226,300])pset(b,x-2,158-30,'s'),pset(b,x+3,158-20,'Z');lkGull(b,226,78);lkGull(b,150,92)},
  cape:b=>{lkFence(b,140,200,112);lkHay(b,40,92);lkHay(b,166,104);lkFlag(b,420,202,'j');lkSkiff(b,370,212);lkBush(b,250,140,14,['s','Z','r'])},
  heart:b=>{for(const[x,y,a]of[[140,160,.3],[300,190,-.4],[230,130,.8]]){pline(b,x,y,x+18*Math.cos(a),y+18*Math.sin(a)*.4,'W');pline(b,x,y+1,x+18*Math.cos(a),y+1+18*Math.sin(a)*.4,'V')}},
};
/* рух: дим із димарів, хвилі, світлячки, краплі */
const LKF={village:{sm:[[71,95]],wv:[[0,250,184],[250,432,214]]},chaika:{wv:[[0,150,184],[300,432,198]]},bay:{wv:[[0,432,()=>lowTide()?176:204]]},reef:{wv:[[60,400,192]],sp:[[80,196],[380,206]]},
  fort:{sm:[[60,150],[180,150]],wv:[[0,110,212]]},spit:{sm:[[357,100]],wv:[[0,432,192]]},shipisle:{wv:[[0,140,200]]},monastery:{wv:[[0,432,190]]},guardians:{wv:[[0,80,210],[380,432,206]]},
  cape:{sm:[[216,104]],wv:[[340,432,208]]},bog:{ff:1},cave:{dr:[[140,60],[230,48],[300,70]]},mine:{dr:[[180,56],[320,60]]},warehouse:{sm:[[200,64]]},heart:{},shoal:{wv:[[0,432,168]]},cliffs:{wv:[[300,432,200]]}};
