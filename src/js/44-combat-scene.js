/* ============ АРЕНА БОЮ ЯК СЦЕНА ============
   Замість сітки однакових кахлів — одна картинка місця в стилі сцен: пісок плямами, дошки трюму, плити,
   валуни з тінню, вода з глибиною й піною, рамка й притемнені краї. Клітинки поверх неї прозорі:
   видно лише, куди можна піти й кого вдарити. Надворі арена тоне в синяві ночі, як і сцени (градація GR);
   усередині (трюм, печера) — завжди напівтемрява, а світло несе герой. */
const ARK={pierfog:{fl:'plank'},shore:{fl:'sand'},pools:{fl:'sand'},rack:{fl:'sand'},shoal:{fl:'sand'},spit:{fl:'sand',lt:1},isle:{fl:'sand'},shoreL:{fl:'sand'},
  yardA:{fl:'sand',col0:'brick'},bay:{fl:'mud'},hold:{fl:'plank',wall:'hull',in:1},store:{fl:'plank',wall:'barn',in:1},
  cave:{fl:'rock',wall:'cave',in:1},mine:{fl:'rock',wall:'cave',in:1},tower:{fl:'flag',wall:'brick',in:1},
  monastery:{fl:'flag',wall:'arch'},guard:{fl:'flag'},cliff:{fl:'heath'},fort:{fl:'heath'},bog:{fl:'bog'},heartL:{fl:'ice'},heartA:{fl:'ice'}};
const ARDK={N:'M',M:'L',L:'D',O:'N',u:'U',U:'T',T:'S',S:'R',R:'Q',Q:'P',P:'B',H:'G',G:'F',F:'E',E:'D',D:'x',Z:'s',r:'Z',s:'x',k:'s',l:'k',
  Y:'X',X:'W',W:'V',V:'x',o:'(',')':'o','(':'x',q:'p',p:'z',z:'D',C:'B',B:'A',A:'x',x:'x',8:'x',9:'8',a:'9',b:'a',c:'V',d:'c',e:'d',i:'t',t:'x',w:'v',v:'t'};
const arLt=c=>({M:'N',N:'O',L:'M',D:'E',E:'F',F:'G',G:'H',s:'Z',Z:'r',V:'W',W:'X',X:'Y',k:'l',p:'q',q:'H'}[c]||c);
const arDk=(c,n)=>{for(let k=0;k<(n||1);k++)c=ARDK[c]||c;return c};
/* підлога: колір у точці (x,y) арени */
function arFloor(fl,x,y,wet){
  if(fl==='sand'||fl==='mud'){const c=sandC(x,y,fl==='mud'?'L':wet?'M':'N');if(fl==='mud'){const v=vnz(x,y,9,41);if(v>.66)return v>.76?'D':'L'}return c}
  if(fl==='plank'){const row=Math.floor(y/5),sx=(row*37)%23,jt=((x+sx)%29===0);if(y%5===4||jt)return'V';if(jt||((x+sx)%29===1&&y%5===1))return'x';return woodC(x,y,WD,.44+(hh2(row,Math.floor((x+sx)/29))-.5)*.16,row)}
  if(fl==='rock'){const v=vnz(x,y,7,13)*.7+vnz(x,y,3,5)*.3;if(hh2(x,y)<.02)return'G';return v<.35?'D':v<.62?'E':'F'}
  if(fl==='flag'){const r=Math.floor(y/7),ox=(r%2)*5,cx=Math.floor((x+ox)/10);if(y%7===6||(x+ox)%10===9)return'D';const t=hh2(cx,r);if(hh2(x,y)<.04)return'E';return t<.3?'E':t<.8?'F':'G'}
  if(fl==='heath'){const v=vnz(x,y,8,7);if(v>.72)return hh2(x,y)<.35?')':'o';if(hh2(x,y)<.03)return'F';return v<.3?'s':v<.55?'Z':'r'}
  if(fl==='bog'){const v=vnz(x,y,6,17);if(v>.74)return hh2(x,y)<.4?'Q':'P';return v<.35?'s':v<.6?'Z':hh2(x,y)<.15?'l':'k'}
  if(fl==='ice'){const v=vnz(x,y,10,29);if(hh2(x>>1,y)<.012)return'F';return v<.3?'p':v<.65?'q':'H'}
  return'N'}
/* відстань від клітинки до суходолу (для глибини води) */
function arDepth(m){const H=m.length,W=m[0].length,D=m.map(r=>[...r].map(t=>t==='~'?99:0));let ch=1;while(ch){ch=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(D[y][x]===0)continue;let v=99;
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const yy=y+dy,xx=x+dx;if(yy<0||yy>=H||xx<0||xx>=W)continue;v=Math.min(v,D[yy][xx]+1)}if(v<D[y][x]){D[y][x]=v;ch=1}}}return D}
function arenaBuf(a,m){const K=ARK[a]||{fl:AFL[a]||'sand'},H=m.length,W=m[0].length,C=16,b=pbuf(W*C,H*C),PW=W*C,PH=H*C,fl=K.fl,ind=!!K.in;
  const T=(x,y)=>x<0||y<0||x>=W||y>=H?'#':m[y][x],DP=arDepth(m),wallish=(x,y)=>T(x,y)==='#'&&ind&&(x===0||y===0||x===W-1||y===H-1);
  /* 1. підлога й вода */
  for(let y=0;y<PH;y++)for(let x=0;x<PW;x++){const cx=Math.floor(x/C),cy=Math.floor(y/C),t=T(cx,cy);
    if(t==='~'){const fx=x%C,fy=y%C;let near=99;for(const[dx,dy,dd]of[[1,0,C-fx],[-1,0,fx+1],[0,1,C-fy],[0,-1,fy+1]]){const n=T(cx+dx,cy+dy);if(n!=='~'&&n!=='#'||(n==='#'&&!ind&&cx+dx>=0&&cy+dy>=0&&cx+dx<W&&cy+dy<H))near=Math.min(near,dd)}
      const dep=Math.min(3,DP[cy][cx]-1+(near<99?0:.5)),R=fl==='ice'?['C','B','A','A']:['S','R','Q','P'],w=vnz(x,y*2.2,9,3);
      let c=R[Math.max(0,Math.min(3,Math.floor(dep+(w-.5)*.8)))];if(near<=2&&hh2(x,y)<.7-near*.25)c='u';else if(near<=4&&bay(x,y)<.35)c=fl==='ice'?'G':'T';
      else if(w>.7&&(y%4===0)&&hh2(x>>2,y)<.5)c=fl==='ice'?'C':'T';pset(b,x,y,c);continue}
    let wet=0;if(fl==='sand'){for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(T(cx+dx,cy+dy)==='~'){const fx=x%C,fy=y%C,dd=dx>0?C-fx:dx<0?fx+1:dy>0?C-fy:fy+1;if(dd<=5)wet=1}}
    pset(b,x,y,arFloor(fl,x,y,wet))}
  /* 2. вихід: стежка й світлі стрілки */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(T(cx,cy)==='E'){const x0=cx*C,y0=cy*C;for(let y=2;y<C-2;y++)for(let x=0;x<C;x++)if(hh2(x0+x,y0+y)<.45)pset(b,x0+x,y0+y,arLt(pget(b,x0+x,y0+y)));
    for(const o of[3,8])for(let i=0;i<4;i++){pset(b,x0+o+i,y0+4+i,'u');pset(b,x0+o+i,y0+11-i,'u')}}
  /* 3. тіні від валунів і ящиків */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const t=T(cx,cy);if((t!=='#'||wallish(cx,cy))&&t!=='+')continue;const x0=cx*C+4,y0=cy*C+9;
    for(let y=0;y<10;y++)for(let x=0;x<16;x++){if(((x-8)/8)**2+((y-5)/4.2)**2>1)continue;const px=x0+x,py=y0+y;if(px>=PW||py>=PH)continue;const tt=T(Math.floor(px/C),Math.floor(py/C));if(tt==='~'||tt==='#')continue;if(bay(px,py)<.7)pset(b,px,py,arDk(pget(b,px,py)))}}
  /* 4. стіни, валуни, колони, ящики */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const t=T(cx,cy),x0=cx*C,y0=cy*C;
    if(t==='#'&&(wallish(cx,cy)||(K.col0&&cx===0))){const wt=K.col0&&cx===0?K.col0:K.wall;const lip=T(cx,cy+1)!=='#'&&cy<H-1;
      for(let y=0;y<C;y++)for(let x=0;x<C;x++){const X=x0+x,Y=y0+y;let c;
        if(wt==='hull'){c=(Y%5===4)?'x':woodC(X,Y,WD,.28+(hh2(Math.floor(Y/5),Math.floor(X/23))-.5)*.14,7);const rb=X%16;if(rb>=6&&rb<9)c=rb===6?'X':rb===8?'x':'W'}
        else if(wt==='barn'){const k=X%7;c=k===6?'V':k===0?'Y':hh2(X>>1,Y>>2)<.04?'W':'X';if(Y%24===20||Y%24===21)c=Y%24===20?'Y':'V'}
        else if(wt==='brick'){const r=Math.floor(Y/5),o=(r%2)*4;c=(Y%5===4||(X+o)%8===7)?'D':hh2(Math.floor((X+o)/8),r)<.5?'E':'F'}
        else{const v=vnz(X*.7,Y*1.5,5,23)*.65+vnz(X,Y,1.8,11)*.35;c=v<.28?'x':v<.62?'D':v<.8?'E':'F'}
        if(lip&&y>=C-3)c=y===C-1?'x':(wt==='hull'||wt==='barn'?(y===C-3?'Y':'X'):wt==='brick'?'F':hh2(X,Y)<.5?'E':'F');
        pset(b,X,Y,c)}continue}
    if(t==='#'){const pillar=ind||K.wall==='arch';const rk=fl==='rock'||fl==='flag'||fl==='ice'?'G':'H';
      if(pillar&&(K.wall==='hull'||K.wall==='barn')){prect(b,x0+5,y0,6,C,'W');prect(b,x0+5,y0,2,C,'X');prect(b,x0+10,y0,1,C,'V');prect(b,x0+3,y0+C-3,10,3,'V');continue}
      if(pillar&&K.wall==='arch'){prect(b,x0+3,y0+1,10,C-1,'F');prect(b,x0+3,y0+1,3,C-1,'G');prect(b,x0+11,y0+1,2,C-1,'E');prect(b,x0+2,y0,12,2,'G');prect(b,x0+2,y0+C-2,12,2,'E');continue}
      for(let y=-4;y<C;y++)for(let x=0;x<C;x++){const X=x0+x,Y=y0+y;if(Y<0)continue;const nx=(x-7.5)/7.4,ny=(y-7)/(8.2+hh2(cx,cy)*1.5),r=nx*nx+ny*ny+(vnz(X,Y,3,cx*7+cy)-.5)*.35;if(r>1)continue;
        const l=-nx*.6-ny*.8+(vnz(X,Y,2,51)-.5)*.5;let c=l>.55?rk:l>.05?'F':l>-.45?'E':'D';if(r>.86)c='x';else if(fl==='heath'&&ny<-.3&&vnz(X,Y,2.5,3)>.62)c=hh2(X,Y)<.5?'r':'Z';else if(fl==='sand'&&ny>.35&&hh2(X,Y)<.08)c='u';pset(b,X,Y,c)}continue}
    if(t==='+'){const kind=ind||fl==='sand'||fl==='mud'?(hh2(cx,cy)<.5?'crate':'barrel'):fl==='bog'?'stump':'pile';
      if(kind==='crate'){for(let y=0;y<C;y++)for(let x=1;x<C-1;x++){const X=x0+x,Y=y0+y;let c=y<5?(hh2(X,Y)<.15?'X':'Y'):(y%4===1?'W':'X');if(x===1||x===C-2||y===0||y===C-1)c='x';else if(y===5)c='V';else if(y>5&&(x===2||x===C-3))c='W';else if(y>5&&(x===7||x===8))c='V';pset(b,X,Y,c)}pset(b,x0+3,y0+7,'G');pset(b,x0+12,y0+7,'G')}
      else if(kind==='barrel'){for(let y=0;y<C;y++)for(let x=2;x<C-2;x++){const X=x0+x,Y=y0+y,nx=(x-7.5)/5.4,lim=1-(y<2||y>C-3?.22:0);if(Math.abs(nx)>lim)continue;let c=Math.abs(nx)>lim-.2||y===0||y===C-1?'x':y<4?(Math.abs(nx)<.55?'X':'W'):nx<-.45?'Y':nx<.35?'X':'W';if((y===5||y===C-4)&&c!=='x')c='G';pset(b,X,Y,c)}}
      else if(kind==='stump'){for(let y=3;y<C-1;y++)for(let x=3;x<C-3;x++){const nx=(x-7.5)/4.5;if(Math.abs(nx)>1)continue;pset(b,x0+x,y0+y,y<6?(Math.hypot(x-7.5,y-4.5)<1.5?'X':'Y'):nx<0?'W':'V')}pline(b,x0+2,y0+C-2,x0+13,y0+C-2,'Z')}
      else for(const[ox,oy,r]of[[5,10,4],[11,10,3.6],[8,6,3.6]])for(let y=-4;y<5;y++)for(let x=-5;x<5;x++){if((x/r)**2+(y/(r*.8))**2>1)continue;const l=-x*.5-y*.8;pset(b,x0+ox+x,y0+oy+y,l>1.5?'G':l>-1?'F':'E')}}}
  /* 5. притемнені краї (усередині — сильніше) */
  for(let y=0;y<PH;y++)for(let x=0;x<PW;x++){if(wallish(Math.floor(x/C),Math.floor(y/C)))continue;const e=Math.min(x,y,PW-1-x,PH-1-y)-(ind?C:0),R=ind?14:12;if(e>=R)continue;const f=Math.max(0,1-Math.max(0,e)/R)*(ind?.8:.7);
    if(bay(x,y)<f)pset(b,x,y,arDk(pget(b,x,y),f>.75?2:1))}
  if(ind)b.ng=1;else b.k=SK;return b}
const arenaURL=c=>{const m=(c&&c.map)||ARENA[c.a];return pxURL('ar3:'+c.a+':'+m.join('/'),()=>arenaBuf(c.a,m))};
const arenaIn=a=>!!(ARK[a]&&ARK[a].in);
