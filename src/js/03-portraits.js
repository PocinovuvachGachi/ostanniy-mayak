/* ============ ПОРТРЕТИ 32×32 у сітці сцен ============
   Той самий піксель, що й у сценах (логічний піксель = 1,5 точки), пласкі тони з короткими дизер-швами,
   темний контур і тло з дощок. Світло зліва-згори, як від лампи.
   faceURL — для інтерфейсу (без нічної градації), faceSceneURL — для сцен (тоне в ночі разом зі сценою),
   faceMiniURL — 16×16 для прапорів громад. Риси персонажів — `FP`. */
Object.assign(PAL,{'!':'#f2c8a0','#':'#6e4434','$':'#5d5a78','&':'#4a2e24','(':'#2f2640',')':'#7d6a90','*':'#c7b99a','+':'#8a3a2c',':':'#8a573f',';':'#c38c69'});
const PSZ=32;
const pv=v=>Math.max(0,Math.min(1,v));
/* пласкі смуги: дизер лише на вузькому шві між тонами */
function prmp(b,x,y,R,v){const n=R.length-1,t=pv(v)*n,k=Math.min(n-1,Math.floor(t)),f=pv((t-k-.5)*16+.5);pset(b,x,y,f>bay(x&3,y&3)?R[Math.min(n,k+1)]:R[k])}
function plit(nx,ny){const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));return pv(.2+.85*(-.6*nx-.45*ny+.66*nz))}
const PR={skin:['#','n','m','!'],tan:['#',':','n',';'],
  white:['G','H','6','u'],grey:['8','9','a','H'],dark:['x','0','8','9'],brown:['V','c','d','e'],red:['t','v','w','j'],straw:['X','Y','e','b'],black:['x','0','1','8'],
  navy:['P','Q','R','S'],leather:['V','W','X','Y'],wine:['V','t','i','v'],green:['s','Z','k','r'],wool:['D','E','F','G'],linen:['L','M','N','O'],
  kred:['t','i','j','w'],kdark:['x','1','2','3'],ochre:['W','X','Y','e'],violet:['x','(','o',')'],hood:['x','A','D','E'],felt:['x','V','c','W']};
function portrait3(o){const b=pbuf(PSZ,PSZ),cx=16,cy=o.cy||13.5,rx=o.rx||6.6,ry=o.ry||8,ey=Math.round(cy+.6),SK0=PR[o.skin||'skin'],age=o.age||0,DK=SK0[0],SD=SK0[1];
  const fig=new Uint8Array(PSZ*PSZ),mk=(x,y)=>{if(x>=0&&y>=0&&x<PSZ&&y<PSZ)fig[y*PSZ+x]=1},put=(x,y,R,v)=>{prmp(b,x,y,R,v);mk(x,y)};
  /* тло: дошки стіни, світліші ближче до лампи */
  const BG=o.bg==='cold'?['x','A','B']:['x','V','W'];
  for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const pl=x%5;pset(b,x,y,pl===4?BG[0]:pl===0&&x<14&&y<24?BG[2]:BG[1])}
  /* одяг */
  const top=x=>{const d=Math.abs(x+.5-cx);return d<6?24.5:24.5+(d-6)*(d-6)/(o.slope||10)},CR=PR[o.coat||'wool'];
  for(let y=20;y<PSZ;y++)for(let x=0;x<PSZ;x++)if(y>=top(x))put(x,y,CR,plit((x+.5-cx)/16,-.2)-(y-25)*.025);
  if(o.cut){const SR=PR[o.shirt||'linen'];for(let y=24;y<PSZ;y++){const hw=o.cut==='v'?Math.max(0,3-(y-24)*.45):2;for(let x=Math.floor(cx-hw);x<cx+hw;x++)put(x,y,SR,plit((x+.5-cx)/8,-.2)*.9)}
    if(o.cut==='v'){pline(b,cx-4,24,cx-1,31,CR[0]);pline(b,cx+3,24,cx,31,CR[0])}}
  if(o.collar==='emb'){for(let x=cx-3;x<cx+3;x++)pset(b,x,25,(x&1)?'i':'t');for(let y=26;y<31;y++){pset(b,cx-1,y,y&1?'i':'t');pset(b,cx,y,'L')}}
  if(o.buttons)for(const[bx,by]of o.buttons)pset(b,cx+bx,by,'g');
  /* шия, вуха, голова */
  for(let y=Math.floor(cy+5);y<26;y++)for(let x=cx-3;x<cx+3;x++)put(x,y,SK0,y<cy+ry?.12:.4);
  for(const sd of[-1,1])for(let y=ey-2;y<ey+2;y++){const X=sd<0?Math.round(cx-rx-.6):Math.round(cx+rx-.4);put(X,y,SK0,sd<0?.55:.2)}
  const rxe=y=>{const t=(y-cy)/ry;return t>0?rx*(1-(o.jaw||.3)*t*t):rx};
  const inH=(x,y)=>{const X=(x+.5-cx)/rxe(y+.5),Y=(y+.5-cy)/ry;return X*X+Y*Y<=1};
  for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++)if(inH(x,y)){let v=plit((x+.5-cx)/rxe(y+.5),(y+.5-cy)/ry);if(o.hood&&y<ey+1)v*=.55;put(x,y,SK0,v)}
  /* обличчя */
  const IR=o.iris||'0',eyes=o.eyes||'open';
  for(const sd of[-1,1]){const ex=sd<0?cx-4:cx+2;
    if(eyes==='closed'){pset(b,ex,ey,DK);pset(b,ex+1,ey,DK);continue}
    if(eyes==='narrow'){pset(b,ex,ey,DK);pset(b,ex+1,ey,IR==='0'?DK:IR);continue}
    pset(b,ex,ey,sd<0?'N':IR);pset(b,ex+1,ey,sd<0?IR:'M');if(eyes==='big'){pset(b,ex,ey+1,sd<0?SD:IR);pset(b,ex+1,ey+1,sd<0?IR:SD)}
    pset(b,ex,ey-1,DK);pset(b,ex+1,ey-1,DK)}
  const BR=PR[o.brow||o.hair||'dark'],bt=o.browT||0;
  for(const sd of[-1,1]){const ex=sd<0?cx-5:cx+2;for(let i=0;i<3;i++){const outer=(sd<0&&i===0)||(sd>0&&i===2),inner=(sd<0&&i===2)||(sd>0&&i===0);const yy=ey-2-(bt>0&&outer?1:0)+(bt<0&&outer?-1:0)+(bt<0&&inner?1:0)*0;pset(b,ex+i,yy,BR[sd<0?2:1])}}
  pset(b,cx,ey+1,SD);pset(b,cx,ey+2,SD);pset(b,cx-1,ey+3,SK0[3]);pset(b,cx,ey+3,DK);
  const my=ey+5,mo=o.mouth||'flat';
  for(let x=cx-2;x<=cx+1;x++){const e=x===cx-2||x===cx+1;pset(b,x,my+(mo==='smile'&&e?-1:mo==='frown'&&e?1:0),DK)}pset(b,cx-1,my+1,SK0[2]);
  if(age>=1){pset(b,cx-3,ey+3,SD);pset(b,cx+2,ey+3,DK)}
  if(age>=2){pset(b,cx-4,ey+1,SD);pset(b,cx+3,ey+1,SD);if(!o.hat||o.hat==='brim')pline(b,cx-2,cy-4,cx+1,cy-4,SD)}
  if(age>=3){pset(b,cx-3,ey+1,SD);pset(b,cx+2,ey+1,DK);pset(b,cx-4,my,SD)}
  if(o.freckles)for(const[fx,fy]of[[-4,2],[-3,2],[2,2],[3,2]])pset(b,cx+fx,ey+fy,SD);
  if(o.blush){pset(b,cx-4,ey+2,'w');pset(b,cx+3,ey+2,'w')}
  /* борода й вуса */
  const HR=PR[o.beardC||o.hair||'dark'];
  if(o.beard){const len=o.beard==='long'?7:o.beard==='full'?3:1.5,cyB=cy+ry-1;
    for(let y=ey+2;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=x+.5-cx,side=inH(x,y)&&Math.abs(dx)>rx-2.2&&y>=ey+1,low=inH(x,y)&&y>=my-1,below=y>=cyB-1&&(dx*dx)/((rx-1)*(rx-1))+((y+.5-cyB)*(y+.5-cyB))/(len*len)<=1;
      const lips=Math.abs(dx)<2.2&&y===my&&o.beard!=='long';if(!(side||low||below)||lips)continue;
      if(o.beard==='stubble'){if(hh2(x*3,y*7)<.3)pset(b,x,y,HR[0]);continue}put(x,y,HR,plit(dx/(rx+1),(y-cyB)/(len+4))+(hh2(x,y)-.5)*.2)}}
  if(o.mous){const P=o.mous==='cossack'?[[0,0],[1,0],[2,1],[3,1],[3,2],[3,3]]:[[0,0],[1,0],[2,1]];for(const sd of[-1,1])P.forEach(([dx,dy])=>{put(sd<0?cx-1-dx:cx+dx,my-1+dy,HR,sd<0?.75:.35)})}
  /* волосся */
  const hs=o.hairS||'short',HC=PR[o.hair||'dark'],hl=x=>cy-(o.hairline||3.6)+1.8*Math.pow((x+.5-cx)/rx,2);
  const out=(x,y,ex,ey2,dy)=>{const X=(x+.5-cx)/(rx+ex),Y=(y+.5-cy+(dy||.5))/(ry+ey2);return X*X+Y*Y<=1};
  const hairAt=(x,y)=>{const dx=Math.abs(x+.5-cx);if(hs==='none')return false;
    if(hs==='bald')return out(x,y,.7,.8)&&dx>rx-1.2&&y>cy-3&&y<ey+1||(o.wisps&&out(x,y,1.4,1)&&!inH(x,y)&&y<cy-1&&y>cy-6&&dx>rx-2.5&&hh2(x,y*3)<.5);
    let h=out(x,y,1,1)&&(y<hl(x)||(dx>rx-1.1&&y<ey-1));
    if(hs==='messy'&&!h&&y<cy-ry+2&&out(x,y,1.8,1.8,1)&&x%2===0)h=true;
    if(hs==='long'&&!h)h=dx>rx-1.2&&dx<rx+2-Math.max(0,y-ey-4)*.1&&y>=cy-2&&y<29&&!(inH(x,y)&&dx<rx-.6);
    if(hs==='braid'&&!h)h=dx>rx-1.2&&dx<rx+.8&&y>=cy-2&&y<ey+3&&!(inH(x,y)&&dx<rx-.6);
    return h};
  for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++)if(hairAt(x,y))put(x,y,HC,plit((x+.5-cx)/(rx+1.5),(y+.5-cy)/(ry+1.5))+((x+(y>>1))%3===0?-.18:0));
  if(hs==='braid')for(let i=0;i<5;i++){const bx=Math.round(cx+rx)+(i>2?1:0),by=ey+3+i*2;put(bx,by,HC,.7);put(bx+1,by,HC,.3);put(bx,by+1,HC,.35)}
  /* головні убори */
  const hat=o.hat;if(hat){const HT=PR[o.hatC||'felt'],dot=o.hatDot,hp=(x,y,v)=>{if(dot&&(x*3+y*5)%9===0){pset(b,x,y,dot);mk(x,y)}else put(x,y,HT,v)};
    if(hat==='kerchief'||hat==='kerchiefB'){const chin=hat==='kerchief';
      for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=Math.abs(x+.5-cx),inO=out(x,y,1.5,1.3,.8);
        const cov=inO&&(y<cy-3+Math.pow((x+.5-cx)/rx,2)||(chin?dx>rx-1.6&&y<cy+ry-1:dx>rx-1&&y<ey-1)),knot=chin&&Math.hypot(x+.5-cx,(y+.5-(cy+ry+.8))*1.3)<1.8;
        if(cov||knot)hp(x,y,plit((x+.5-cx)/(rx+2),(y+.5-cy+1)/(ry+2))+(knot?.1:0))}
      if(!chin)for(let i=0;i<3;i++)put(Math.round(cx+rx+1)+i%2,Math.round(cy-1)+i,HT,.3)}
    if(hat==='cap'||hat==='knit'){const yb=cy-ry+(hat==='knit'?4.3:3.8);
      for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const X=(x+.5-cx)/(rx+(hat==='knit'?1.1:1.6)),Y=(y+.5-yb)/(hat==='knit'?ry*.8:5);if(X*X+Y*Y<=1&&y<yb+1)hp(x,y,plit(X*.9,Y*.8)+(hat==='knit'&&y>yb-2&&x%2?-.25:0))}
      if(hat==='cap'){const Y=Math.round(yb)+1;for(let x=Math.round(cx-rx-1);x<cx+rx+1;x++){pset(b,x,Y,HT[0]);mk(x,Y)}for(let x=Math.round(cx-rx+1);x<cx+rx-1;x++)pset(b,x,Y+1,DK)}}
    if(hat==='brim'){const yb=cy-ry+3.5;for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=x+.5-cx;if(Math.abs(dx)<rx-.5&&y>=yb-6&&y<yb)hp(x,y,plit(dx/(rx+1),-.3));if((dx/(rx+5))**2+((y+.5-yb)/1.6)**2<=1)hp(x,y,plit(dx/(rx+5),.2)+.1)}
      for(let x=Math.round(cx-rx+1);x<cx+rx-1;x++){pset(b,x,Math.round(yb)-2,o.band||'i');pset(b,x,Math.round(yb)+2,DK)}}
    if(hat==='captain'){const yb=cy-ry+3.5;for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=x+.5-cx,ad=Math.abs(dx);const crown=ad<rx-.5&&y>=yb-5&&y<yb+1&&(y+.5-(yb-5))>(ad/rx)*1.5,wing=ad<rx+5&&y<yb+1.5&&y>yb-4+(ad*ad)/30;if(crown||wing)hp(x,y,plit(dx/(rx+6),-.2))}
      for(let x=Math.round(cx-rx-4);x<cx+rx+4;x++){const ad=Math.abs(x+.5-cx),y=Math.round(yb-4+(ad*ad)/30);if(ad<rx+4.5)pset(b,x,y,'g')}pset(b,cx-1,Math.round(yb)-2,'i');for(let x=Math.round(cx-rx+1);x<cx+rx-1;x++)pset(b,x,Math.round(yb)+2,DK)}
    if(hat==='hood'){for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=x+.5-cx,ad=Math.abs(dx),X=dx/(rx+3),Y=(y+.5-cy+.8)/(ry+3);
        const inO=X*X+Y*Y<=1||(y>cy&&ad<rx+3.6&&y<27);const open=(dx/(rx-.3))**2+((y+.5-ey-1.5)/(ry-1))**2<=1&&y>cy-ry+3;
        if(inO&&!open)hp(x,y,plit(X,Y)*.9);else if(open&&!inH(x,y)){pset(b,x,y,'x');mk(x,y)}}}}
  if(o.draw)o.draw(b,{cx,cy,rx,ry,ey,my,put,mk});
  /* темний контур навколо постаті */
  const p=b.p.slice(),k=b.k,PW=b.W,n=(xx,yy)=>xx>=0&&yy>=0&&xx<PSZ&&yy<PSZ&&fig[yy*PSZ+xx];
  for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){if(fig[y*PSZ+x])continue;if(n(x+1,y)||n(x-1,y)||n(x,y+1)||n(x,y-1)){for(let j=Math.round(y*k);j<Math.round((y+1)*k);j++)for(let i=Math.round(x*k);i<Math.round((x+1)*k);i++)p[j*PW+i]='x'}}
  b.p=p;return b}
/* Риси персонажів (координати — сітка 32×32) */
const FP={
  zinovii:{age:2,hair:'dark',hairS:'bald',hat:'knit',hatC:'linen',mous:'cossack',beard:'stubble',coat:'linen',collar:'emb',rx:7.4,jaw:.16,mouth:'smile',eyes:'narrow',blush:1,
    draw(b,G){for(let y=28;y<32;y++)for(let x=G.cx-6;x<G.cx+6;x++)G.put(x,y,PR.wool,plit((x-G.cx)/8,0)*.9)}},
  horpyna:{age:2,hair:'brown',hat:'kerchief',hatC:'green',hatDot:'k',coat:'wool',cut:'open',collar:'emb',mouth:'frown',browT:-1,iris:'c',jaw:.36},
  ostap:{age:3,hair:'white',hairS:'bald',beard:'long',mous:'cossack',beardC:'white',brow:'white',coat:'navy',cut:'v',buttons:[[-5,27],[4,27],[-5,30],[4,30]],eyes:'narrow'},
  hanna:{age:2,hair:'brown',hat:'kerchief',hatC:'kred',hatDot:'O',coat:'wine',cut:'open',collar:'emb',mouth:'smile',iris:'c',
    draw(b,G){for(let i=0;i<4;i++)G.put(G.cx+8+(i>>1),Math.round(G.cy-4-i),PR.green,.6);G.put(G.cx+10,Math.round(G.cy-8),PR.violet,.9)}},
  myron:{age:2,hair:'grey',hat:'knit',hatC:'navy',beard:'stubble',beardC:'grey',coat:'ochre',cut:'open',shirt:'wool',mouth:'frown',browT:-1,eyes:'narrow',skin:'tan',
    draw(b,G){for(let i=0;i<10;i++)pset(b,G.cx-10+i,25+Math.round(i*.6),i&1?'b':'N')}},
  levko:{age:2,hair:'dark',hairS:'bald',mous:'cossack',coat:'linen',collar:'emb',rx:7.2,jaw:.2,mouth:'smile',eyes:'narrow',
    draw(b,G){const P=[[0,-8],[0,-7],[-1,-6],[-2,-5],[-3,-4],[-4,-3],[-5,-2],[-6,-1],[-6,0]];P.forEach(([dx,dy],i)=>{G.put(G.cx+dx,Math.round(G.cy+dy),PR.dark,i<3?.8:.5);G.put(G.cx+dx+1,Math.round(G.cy+dy),PR.dark,.2)});
      for(let y=28;y<32;y++)for(let x=G.cx-6;x<G.cx+6;x++)G.put(x,y,PR.leather,plit((x-G.cx)/8,0)*.8)}},
  yarema:{age:2,hair:'brown',hat:'brim',hatC:'felt',band:'g',mous:'thin',beard:'short',beardC:'brown',coat:'wine',cut:'v',buttons:[[-4,28],[-4,31]],mouth:'smile',eyes:'narrow',browT:1,
    draw(b,G){pset(b,Math.round(G.cx+G.rx),G.ey+2,'g');for(const[x,y]of[[22,29],[23,29],[22,30],[23,30]])pset(b,x,y,'g');pset(b,21,30,'m')}},
  tymish:{hair:'straw',hairS:'messy',coat:'linen',collar:'emb',rx:6.2,ry:7.6,cy:14,eyes:'big',iris:'3',freckles:1,mouth:'smile',blush:1},
  olesya:{hair:'brown',hairS:'braid',coat:'green',cut:'open',collar:'emb',eyes:'big',iris:'k',rx:6.2,jaw:.36,
    draw(b,G){for(let x=Math.round(G.cx-G.rx);x<G.cx+G.rx;x++){const y=Math.round(G.cy-G.ry+3+Math.pow((x+.5-G.cx)/G.rx,2)*2);pset(b,x,y,x%3===0?'g':(x&1)?'l':'k')}}},
  ustyna:{age:1,hair:'dark',hat:'kerchiefB',hatC:'kdark',hatDot:'5',coat:'leather',cut:'open',mouth:'frown',browT:-1,eyes:'narrow',skin:'tan',rx:7,jaw:.24,
    draw(b,G){pset(b,G.cx-4,G.ey+3,'&');pset(b,G.cx-3,G.ey+4,'&');pline(b,24,31,28,22,'X');for(let y=19;y<23;y++){G.put(27,y,PR.wool,.9);G.put(28,y,PR.wool,.5)}}},
  kindrat:{age:2,hair:'black',hairS:'none',beard:'full',beardC:'black',brow:'brown',coat:'leather',cut:'open',shirt:'wool',rx:7.2,jaw:.18,eyes:'narrow',skin:'tan',slope:8,
    draw(b,G){pset(b,G.cx-3,Math.round(G.cy-5),'n');pset(b,G.cx-2,Math.round(G.cy-6),'n');for(let x=G.cx-3;x<G.cx+3;x++)pset(b,x,23,(x&1)?'9':'8')}},
  severyn:{age:3,hair:'white',hairS:'bald',wisps:1,coat:'leather',cut:'open',rx:6,jaw:.4,iris:'4',beard:'stubble',beardC:'white',
    draw(b,G){for(const ex of[G.cx-5,G.cx+1]){pline(b,ex,G.ey-1,ex+3,G.ey-1,'H');pline(b,ex,G.ey+1,ex+3,G.ey+1,'G');pset(b,ex,G.ey,'H');pset(b,ex+3,G.ey,'G');pset(b,ex+1,G.ey-1,'U')}pset(b,G.cx-1,G.ey-1,'G')}},
  zakhar:{age:3,hair:'white',hat:'cap',hatC:'wool',beard:'full',beardC:'white',brow:'grey',coat:'navy',cut:'v',eyes:'narrow',skin:'tan',
    draw(b,G){pline(b,Math.round(G.cx+G.rx),G.ey-4,Math.round(G.cx+G.rx)+2,G.ey-2,'e')}},
  marta:{age:1,hair:'red',hairS:'long',hat:'captain',hatC:'black',coat:'navy',cut:'v',buttons:[[-5,28],[4,28],[-5,31],[4,31]],mouth:'smile',iris:'3',browT:1,jaw:.34,
    draw(b,G){for(const x0 of[4,23])for(let i=0;i<5;i++){const x=x0+i,d=Math.abs(x+.5-G.cx),y=Math.ceil(d<6?24.5:24.5+(d-6)*(d-6)/10);pset(b,x,y,'g');if(i&1)pset(b,x,y+1,'f')}}},
  panas:{age:2,hair:'brown',hat:'cap',hatC:'linen',mous:'cossack',brow:'straw',coat:'linen',collar:'emb',rx:7.2,jaw:.2,mouth:'smile',eyes:'narrow',blush:1,
    draw(b,G){for(const[x,y]of[[-4,-2],[3,-2],[-1,-9],[3,-10]])pset(b,G.cx+x,G.ey+y,'u')}},
  motrya:{age:3,hair:'white',hat:'kerchief',hatC:'kdark',hatDot:'i',coat:'violet',eyes:'closed',mouth:'smile',rx:6.2,jaw:.4,
    draw(b,G){pset(b,G.cx-3,Math.round(G.cy-2),'6');pset(b,G.cx-2,Math.round(G.cy-2),'u')}},
  luka:{age:2,hair:'dark',hat:'cap',hatC:'navy',mous:'thin',beard:'short',beardC:'dark',coat:'navy',cut:'v',buttons:[[-4,28],[-4,31]],mouth:'frown',eyes:'narrow',browT:-1,
    draw(b,G){const y=Math.round(G.cy-G.ry+2);pset(b,G.cx,y,'g');pset(b,G.cx-1,y+1,'f');pset(b,G.cx+1,y+1,'f')}},
  gnat:{age:2,hair:'grey',hat:'hood',hatC:'hood',hood:1,beard:'stubble',beardC:'grey',coat:'hood',eyes:'narrow',iris:'5',browT:-1,bg:'cold',skin:'tan',
    draw(b,G){pline(b,G.cx+1,G.ey-3,G.cx+4,G.ey+3,'+')}},
};
const P3=HI(portrait3);
function faceBuf(id,graded){const b=P3(FP[id]||FP.ostap);if(!graded)b.ng=1;return b}
for(const id in FP)FACES[id]=()=>faceBuf(id,0);
const faceSceneURL=id=>pxURL('fs3:'+id,()=>faceBuf(id,1));
/* мініатюра 16×16: кожен піксель — найчастіший колір у квадраті 2×2 */
const faceMiniURL=id=>pxURL('fm3:'+id,()=>{const f=faceBuf(id,1),o=PK;PK=SK;const b=pbuf(16,16);PK=o;for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c={};for(const[dx,dy]of[[0,0],[1,0],[0,1],[1,1]]){const v=pget(f,2*x+dx,2*y+dy);c[v]=(c[v]||0)+1}
    pset(b,x,y,Object.keys(c).sort((a,q)=>c[q]-c[a])[0])}return b});
