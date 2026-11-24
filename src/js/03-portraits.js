/* ============ ПОРТРЕТИ 48×48 ============
   Погруддя під лампою: тепле світло зліва-спереду, холодний місячний обрис справа, темне тло з відсвітом.
   Голова, шия, одяг — об'ємні форми з освітленням і дизерингом (bay); волосся — пасмами;
   кожен персонаж — набір рис (`FP`) і власні деталі (`draw`). Буфер k=1, без нічної градації. */
Object.assign(PAL,{'!':'#f2c8a0','#':'#6e4434','$':'#5d5a78','&':'#4a2e24','(':'#2f2640',')':'#7d6a90','*':'#c7b99a','+':'#8a3a2c',':':'#8a573f',';':'#c38c69','<':'#5b3a2c','>':'#9a6a4e','=':'#3a2a24'});
const PSZ=48;
const pv=(v)=>Math.max(0,Math.min(1,v));
let PSH=1.7;
function prmp(b,x,y,R,v){const n=R.length-1,t=pv(v)*n,k=Math.min(n-1,Math.floor(t)),f=pv((t-k-.5)*PSH+.5);pset(b,x,y,f>bay(x,y)?R[Math.min(n,k+1)]:R[k])}
const PLX=-.55,PLY=-.45,PLZ=.70;
let PDIM=1;
function plit(nx,ny){const q=nx*nx+ny*ny,nz=Math.sqrt(Math.max(0,1-q)),d=nx*PLX+ny*PLY+nz*PLZ;return pv((.05+1.05*d*d*Math.sign(d)+.1*d)*PDIM)}
const PR={skin:['<','#',':','n',';','m','!'],tan:['=','&','<','#',':','>','n',';'],
  white:['G','H','6','u'],grey:['8','9','a','H'],dark:['x','0','8','9'],brown:['V','c','d','e'],red:['t','v','w','j'],straw:['X','Y','e','b'],black:['x','0','1','8'],
  navy:['x','P','Q','R','S'],leather:['V','W','X','Y'],wine:['V','t','i','v'],green:['x','s','Z','k'],wool:['x','D','E','F','G'],linen:['L','M','N','O','*'],
  kred:['t','+','i','j'],kdark:['x','1','2','3'],ochre:['V','W','X','Y','e'],violet:['x','(','o',')'],hood:['x','A','D','E','F'],felt:['x','V','c','W']};
function portrait2(o){const b=pbuf(PSZ,PSZ),cx=24+(o.dx||0),cy=o.cy||21,rx=o.rx||9.5,ry=o.ry||12,ey=cy+1,SK0=PR[o.skin||'skin'],age=o.age||0;
  const G={b,cx,cy,rx,ry,ey,o};
  /* тло: темрява з теплим відсвітом лампи зліва або холодом */
  const BG=o.bg==='cold'?['x','A','P','Q']:['x','A','B','C'];
  PSH=3.5;PDIM=o.dim||1;for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const d=Math.hypot(x-cx+3,(y-cy+2)*1.1),v=pv(.85-d/30)-Math.max(0,(y-32)/50);prmp(b,x,y,BG,v*.85)}PSH=1.7;
  const fig=new Uint8Array(PSZ*PSZ),mark=(x,y)=>{fig[y*PSZ+x]=1};
  /* одяг */
  const top=x=>{const d=Math.abs(x+.5-cx);return d<9?36.5:36.5+(d-9)*(d-9)/(o.slope||16)};
  const CR=PR[o.coat||'wool'];
  for(let y=30;y<PSZ;y++)for(let x=0;x<PSZ;x++)if(y>=top(x)){const nx=(x+.5-cx)/24;prmp(b,x,y,CR,plit(nx*.9,-.15)*(1-(y-36)/34)+.05);mark(x,y)}
  if(o.shirt||o.cut){const SR=PR[o.shirt||'linen'];for(let y=36;y<PSZ;y++){const hw=o.cut==='v'?Math.max(0,4.5-(y-36)*.42):o.cut==='open'?3:0;for(let x=Math.floor(cx-hw);x<cx+hw;x++)prmp(b,x,y,SR,plit((x+.5-cx)/12,-.2)*.8)}
    if(o.cut==='v'){pline(b,cx-5,36,cx,46,CR[0]);pline(b,cx+4,36,cx,46,CR[0]);pline(b,cx-6,36,cx-1,46,CR[CR.length-1])}}
  if(o.collar==='emb'){/* вишита пазуха */for(let x=cx-5;x<cx+5;x++){pset(b,x,37,((x-cx)&1)?'i':'t');pset(b,x,38,((x-cx)&1)?'t':'i')}for(let y=38;y<46;y++){pset(b,cx-1,y,y&1?'i':'t');pset(b,cx+1,y,y&1?'t':'i');pset(b,cx,y,'L')}}
  if(o.buttons)for(const[bx,by]of o.buttons){pset(b,cx+bx,by,'g');pset(b,cx+bx,by+1,'f')}
  /* шия */
  for(let y=cy+7;y<38;y++)for(let x=cx-4;x<cx+4;x++){const nx=(x+.5-cx)/4.6;prmp(b,x,y,SK0,plit(nx,.1)*(y<cy+ry+1?.45:.68));mark(x,y)}
  /* вуха */
  for(const sx of[-1,1])for(let y=ey-3;y<ey+3;y++)for(let x=-2;x<1;x++){const X=Math.round(cx+sx*(rx-.5)+sx*x*-1)+(sx<0?-1:0),t=(y-ey+.5)/3,u=(x+1)/1.6;if(t*t+u*u<=1.15){prmp(b,X,y,SK0,(sx<0?.62:.3)-(x===0?.1:0));mark(X,y)}}
  /* голова: яйце, що звужується до підборіддя */
  const rxe=y=>{const t=(y-cy)/ry;return t>0?rx*(1-(o.jaw||.3)*t*t):rx};
  const inH=(x,y)=>{const X=(x+.5-cx)/rxe(y+.5),Y=(y+.5-cy)/ry;return X*X+Y*Y<=1};
  const shTop=o.shadeTop||-99;
  for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++)if(inH(x,y)){const nx=(x+.5-cx)/rxe(y+.5),ny=(y+.5-cy)/ry;let v=plit(nx,ny)*.92+.08;if(y<shTop)v*=o.hood?.45:.7;
    if(o.cheek&&Math.abs(Math.abs(x+.5-cx)-5)<1.6&&Math.abs(y-(ey+4))<1.5)v-=.12;prmp(b,x,y,SK0,v);mark(x,y)}
  G.inH=inH;G.rxe=rxe;
  /* риси обличчя */
  const SD=SK0[1],DK=SK0[0];
  const eye=(ex,side)=>{const st=o.eyes||'open';const iris=o.iris||'0';
    if(st==='closed'){pline(b,ex,ey,ex+3,ey,DK);pset(b,ex+(side<0?0:3),ey+1,SD);return}
    pline(b,ex,ey-1,ex+3,ey-1,DK);
    if(st==='narrow'){pset(b,ex+1,ey,iris);pset(b,ex+2,ey,iris);pset(b,ex+(side<0?0:3),ey,SD);pset(b,ex+(side<0?3:0),ey,SD);return}
    const W=side<0?'N':'b';pset(b,ex,ey,side<0?W:SD);pset(b,ex+3,ey,side<0?SD:W);pset(b,ex+1,ey,iris);pset(b,ex+2,ey,iris);pset(b,ex+1+(side<0?0:0),ey,iris);
    if(st==='big'){pset(b,ex+1,ey+1,iris);pset(b,ex+2,ey+1,iris);pset(b,ex,ey+1,side<0?W:SD);pset(b,ex+3,ey+1,side<0?SD:W)}
    if(side<0)pset(b,ex+1,ey,'y');else pset(b,ex+1,ey,'q');
    pline(b,ex,ey+(st==='big'?2:1),ex+3,ey+(st==='big'?2:1),SD)};
  eye(cx-6,-1);eye(cx+2,1);
  /* брови */
  const BR=PR[o.brow||o.hair||'dark'],bt=o.browT||0;
  for(const[x0,sd]of[[cx-7,-1],[cx+2,1]])for(let i=0;i<5;i++){const yy=ey-3+(bt?Math.round((sd<0?i:4-i)*bt/4):0);pset(b,x0+i,yy,BR[sd<0?2:1]);if(o.browThick)pset(b,x0+i,yy-1,BR[1])}
  /* ніс */
  const nl=o.nose||5;for(let y=ey+1;y<ey+nl;y++){pset(b,cx+1,y,SD)}pset(b,cx,ey+nl-1,SK0[3]);pset(b,cx-1,ey+nl,SD);pset(b,cx+2,ey+nl,DK);pset(b,cx+1,ey+nl,SD);
  /* рот */
  const my=ey+nl+3,mw=o.mw||2;const mo=o.mouth||'flat';
  for(let x=cx-mw;x<=cx+mw;x++){const e=Math.abs(x-cx)===mw;pset(b,x,my+(mo==='smile'&&e?-1:mo==='frown'&&e?1:0),DK)}
  pset(b,cx,my-1,SD);for(let x=cx-mw+1;x<cx+mw;x++)pset(b,x,my+1,x<cx?SK0[3]:SK0[2]);pset(b,cx-1,my+3,SD);pset(b,cx,my+3,SD);
  /* вік */
  if(age>=1){pline(b,cx-3,ey+nl+1,cx-mw-1,my+1,SD);pline(b,cx+4,ey+nl+1,cx+mw+1,my+1,DK)}
  if(age>=2){pline(b,cx-6,ey+2,cx-3,ey+2,SD);pline(b,cx+3,ey+2,cx+6,ey+2,SD);if(!o.noForehead){pline(b,cx-4,cy-5,cx+3,cy-5,SD);pline(b,cx-3,cy-3,cx+2,cy-3,SD)}}
  if(age>=3){pset(b,cx-8,ey,SD);pset(b,cx+8,ey,DK);pset(b,cx-8,ey+1,SD);pline(b,cx-6,ey+3,cx-4,ey+4,SD);pline(b,cx+4,ey+4,cx+6,ey+3,DK)}
  if(o.freckles)for(const[fx,fy]of[[-5,3],[-3,4],[-6,4],[4,3],[3,4],[6,4],[-4,3]])pset(b,cx+fx,ey+fy,SD);
  if(o.blush)for(const sx of[-5,5]){pset(b,cx+sx,ey+3,'w');pset(b,cx+sx+(sx<0?1:-1),ey+3,'w')}
  /* борода й вуса */
  const HR=PR[o.beardC||o.hair||'dark'];
  const strand=(x,y,sd)=>hh2(Math.floor(x+y*.35*(x<cx?-1:1)),sd||7)-.5;
  if(o.beard){const len=o.beard==='long'?12:o.beard==='full'?5:o.beard==='short'?2:2,y0=ey+nl-1,cyB=cy+ry-1;
    for(let y=y0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=(x+.5-cx),inFace=inH(x,y)&&Math.abs(dx)>(y<my-1?rx-3.2:0);
      const below=y>=cy+ry-3&&(dx*dx)/((rx-1.5)*(rx-1.5))+((y+.5-cyB)*(y+.5-cyB))/(len*len)<=1&&y>=cyB-2;
      const lips=Math.abs(dx)<=mw+.5&&y>=my-1&&y<=my+1&&o.beard!=='long';
      if((inFace||below)&&!lips&&y>=my-2-(Math.abs(dx)>rx-3.2?6:0)){
        if(o.beard==='stubble'){if(hh2(x*7,y*3)<.38)pset(b,x,y,HR[0]);continue}
        const nx=dx/(rx+1),ny=(y-cyB)/(len+6);prmp(b,x,y,HR,plit(nx,ny)+strand(x,y,3)*.45);mark(x,y)}}}
  if(o.mous){const ys=ey+nl+1,P=o.mous==='cossack'?[[0,0],[1,0],[2,0],[3,1],[mw+2,1],[mw+3,2],[mw+3,3],[mw+3,4],[mw+3,5],[mw+3,6]]:[[0,0],[1,0],[2,0],[mw+1,1],[mw+2,1]];
    for(const sd of[-1,1])P.forEach(([dx,dy],i)=>{const X=sd<0?cx-1-dx:cx+dx,v=sd<0?.8:.42;prmp(b,X,ys+dy,HR,v-i*.03);if(i<5||o.mous==='cossack')prmp(b,X+(i>3?sd*-1:0),ys+dy+(i>3?0:1),HR,v-.25)})}
  /* волосся */
  const hs=o.hairS||'short',HC=PR[o.hair||'dark'];
  const hl=x=>cy-(o.hairline||5.5)+2.5*Math.pow((x+.5-cx)/rx,2);
  const outE=(x,y,ex2,ey2,dy)=>{const X=(x+.5-cx)/(rx+ex2),Y=(y+.5-cy+(dy||.6))/(ry+ey2);return X*X+Y*Y<=1};
  const hairAt=(x,y)=>{const dx=Math.abs(x+.5-cx);
    if(hs==='none')return false;
    if(hs==='bald')return outE(x,y,.8,1)&&dx>rx-1.6&&y>cy-4&&y<ey-2+(dx>rx-.6?4:0)||(o.wisps&&outE(x,y,1.8,1.2)&&!inH(x,y)&&y<cy-1&&y>cy-8&&dx>rx-3&&hh2(x,y)<.55);
    let h=outE(x,y,1.3,1.2)&&(y<hl(x)||(dx>rx-1.6&&y<ey-1));
    if(hs==='messy'&&!h&&y<cy-ry+3&&outE(x,y,2.5,2.6,1.4)&&hh2(x,9)<.7)h=true;
    if((hs==='long'||hs==='braid')&&!h){const w=hs==='long'?3.4-Math.max(0,y-ey-6)*.12+Math.sin(y*.7)*.6:1.2;h=dx>rx-1.8&&dx<rx+w&&y>=cy-2&&y<(hs==='long'?44:ey+5)&&!(inH(x,y)&&dx<rx-1)}
    if(hs==='bun'&&!h)h=Math.hypot(x+.5-cx,y+.5-(cy-ry-1))<4.2;
    return h};
  for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++)if(hairAt(x,y)){const nx=(x+.5-cx)/(rx+2),ny=(y+.5-cy)/(ry+2);prmp(b,x,y,HC,plit(nx,ny)*.95+strand(x,y,5)*.5);mark(x,y)}
  if(hs==='braid'){for(let i=0;i<7;i++){const bx=cx+rx-1+Math.round(i*.5),by=ey+3+i*2;for(let yy=0;yy<2;yy++)for(let xx=-1;xx<2;xx++){prmp(b,bx+xx,by+yy,HC,.55-xx*.2+(yy?-.15:.1));mark(bx+xx,by+yy)}}pset(b,cx+rx+2,ey+18,'i');pset(b,cx+rx+3,ey+18,'i')}
  /* головні убори */
  const hat=o.hat;
  if(hat){const HT=PR[o.hatC||'felt'],dot=o.hatDot;
    const put=(x,y,v)=>{if(x<0||y<0||x>=PSZ||y>=PSZ)return;let c=null;if(dot&&((x*3+y*5)%11===0))c=dot;if(c)pset(b,x,y,c);else prmp(b,x,y,HT,v);mark(x,y)};
    if(hat==='kerchief'||hat==='kerchiefB'){const chin=hat==='kerchief';
      for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=Math.abs(x+.5-cx);const inO=outE(x,y,2.2,1.8,1);
        const cover=inO&&(y<cy-4+1.4*Math.pow((x+.5-cx)/rx,2)||(chin?dx>rx-2.4&&y<cy+ry-1:dx>rx-1.4&&y<ey-2));
        const knot=chin&&Math.hypot(x+.5-cx,(y+.5-(cy+ry+1))*1.3)<2.6;
        const tail=chin&&y>=cy+ry&&y<cy+ry+7&&Math.abs(x+.5-cx-(y-cy-ry)*.45-1)<1.6;
        if(cover||knot||tail){const nx=(x+.5-cx)/(rx+3),ny=(y+.5-cy+1)/(ry+3);put(x,y,plit(nx,ny)+(knot?.15:0))}}
      if(hat==='kerchief')pline(b,cx-rx+1,cy-4,cx+rx-1,cy-4,HT[0])}
    if(hat==='cap'||hat==='knit'){const yb=cy-ry+(hat==='knit'?6:5.5);
      for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const X=(x+.5-cx)/(rx+(hat==='knit'?1.6:2.4)),Y=(y+.5-yb)/(hat==='knit'?ry*.85:7.5);if(X*X+Y*Y<=1&&y<yb+1.5){const nx=X,ny=Y;let v=plit(nx*.9,ny*.8);if(hat==='knit'&&y>yb-2.5)v+=((x&1)?-.2:.1);put(x,y,v)}}
      if(hat==='cap'){for(let x=Math.round(cx-rx-1);x<cx+rx+1;x++){pset(b,x,Math.round(yb)+1,HT[0]);pset(b,x,Math.round(yb)+2,'x');}for(let x=Math.round(cx-rx);x<cx+rx;x++)pset(b,x,Math.round(yb),HT[1]);
        for(let x=Math.round(cx-rx+1);x<cx+rx-1;x++)pset(b,x,Math.round(yb)+3,SK0[0])}
      else{const Y=Math.round(yb)+1;for(let x=Math.round(cx-rx-1);x<cx+rx+1;x++)pset(b,x,Y,SK0[0])}}
    if(hat==='brim'){const yb=cy-ry+5;for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=x+.5-cx;
        if(Math.abs(dx)<rx-.5&&y>=yb-9&&y<yb){put(x,y,plit(dx/(rx+1),-.3)-(y<yb-7?.0:0)-.05)}
        const B=(dx/(rx+7))**2+((y+.5-yb)/2.2)**2;if(B<=1)put(x,y,plit(dx/(rx+7),(y+.5-yb)/2.2*-.4)+.1)}
      for(let x=Math.round(cx-rx+1);x<cx+rx-1;x++){pset(b,x,yb-2,o.band||'i');pset(b,x,yb-1,o.band==='g'?'f':'t')}
      for(let x=Math.round(cx-rx+1);x<cx+rx-1;x++){pset(b,x,yb+2,SK0[0]);if(hh2(x,2)<.5)pset(b,x,yb+3,SK0[1])}}
    if(hat==='captain'){const yb=cy-ry+5;for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=x+.5-cx,ad=Math.abs(dx);
        const crown=ad<rx-1&&y>=yb-7&&y<yb+1&&(y+.5-(yb-7))>(ad/rx)*2;const wing=ad<rx+7&&y<yb+2&&y>=yb-5+Math.round(ad*.32)-((ad>rx+3)?0:0)&&y>yb-6+(ad*ad)/40;
        if(crown||wing)put(x,y,plit(dx/(rx+8),-.2)+(crown?.05:-.05))}
      for(let x=Math.round(cx-rx-6);x<cx+rx+6;x++){const ad=Math.abs(x+.5-cx);const y=Math.round(yb-5+ad*.32+(ad*ad)/40)-1;if(ad<rx+6.5)pset(b,x,Math.max(y,yb-6),'g')}
      pset(b,cx-2,yb-3,'i');pset(b,cx-1,yb-3,'j');pset(b,cx-2,yb-2,'t');pset(b,cx-1,yb-2,'i');
      for(let x=Math.round(cx-rx+1);x<cx+rx-1;x++)pset(b,x,yb+2,SK0[0])}
    if(hat==='hood'){for(let y=0;y<PSZ;y++)for(let x=0;x<PSZ;x++){const dx=x+.5-cx,ad=Math.abs(dx);const X=dx/(rx+4.5),Y=(y+.5-cy+1)/(ry+4.5);
        const inO=X*X+Y*Y<=1||(y>cy&&ad<rx+5.5-(y-cy)*.05&&y<40);const face=inH(x,y)&&!(y<cy-ry+5)&&ad<rx-.6;const opening=Math.abs(dx/(rx-.5))**2+((y+.5-ey-2)/(ry-1.5))**2<=1&&y>cy-ry+4.5;
        if(inO&&!opening&&!face){put(x,y,plit(X,Y)*.9)}else if(opening&&!inH(x,y))put(x,y,.05)}
      for(let x=0;x<PSZ;x++)for(let y=0;y<PSZ;y++){const dx=x+.5-cx;if(Math.abs(dx/(rx-.5))**2+((y+.5-ey-2)/(ry-1.5))**2>1&&Math.abs(dx/(rx-.5))**2+((y+.5-ey-2)/(ry-1.5))**2<=1.18&&y>cy-ry+4&&y<cy+ry+2)pset(b,x,y,HT[0])}}}
  /* власні деталі */
  if(o.draw)o.draw(b,G);
  /* холодний обрис справа (місяць у вікні) */
  const RIM=o.bg==='cold'?'4':'3';const p=b.p.slice();
  for(let y=4;y<PSZ;y++)for(let x=PSZ-2;x>cx+3;x--){if(fig[y*PSZ+x]&&!fig[y*PSZ+x+1]){p[y*PSZ+x]=RIM;break}}
  b.p=p;PDIM=1;return b}
/* Риси персонажів */
const FP={
  ostap:{age:3,hair:'white',hairS:'bald',beard:'long',mous:'cossack',beardC:'white',brow:'white',coat:'navy',cut:'v',shirt:'linen',buttons:[[-7,40],[6,40],[-7,44],[6,44]],eyes:'narrow',mouth:'flat',
    draw(b,G){/* шрам від мотузки на скроні, сивина */pset(b,G.cx-8,G.cy-4,'6');pset(b,G.cx-7,G.cy-5,'6')}},
  hanna:{age:2,hair:'brown',hairS:'short',hat:'kerchief',hatC:'kred',hatDot:'O',coat:'wine',shirt:'linen',cut:'open',collar:'emb',mouth:'smile',eyes:'open',iris:'c',
    draw(b,G){/* пучок трав за хусткою */for(let i=0;i<5;i++){pset(b,G.cx+G.rx+1+(i>>1),G.cy-6-i,'k');pset(b,G.cx+G.rx+2+(i>>1),G.cy-7-i,'l')}pset(b,G.cx+G.rx+4,G.cy-11,'o');pset(b,G.cx+G.rx+3,G.cy-11,')')}},
  myron:{age:2,hair:'grey',hairS:'short',hat:'knit',hatC:'navy',beard:'stubble',beardC:'grey',coat:'ochre',cut:'open',shirt:'wool',mouth:'frown',browT:-1,eyes:'narrow',skin:'tan',
    draw(b,G){/* мотузок сітей через плече */for(let i=0;i<14;i++){const x=G.cx-14+i,y=37+Math.round(i*.75);pset(b,x,y,(i&1)?'b':'N');pset(b,x,y+1,'X')}for(let i=0;i<4;i++)pset(b,G.cx-15+i*3,40+i*2,'M')}},
  levko:{age:2,hair:'dark',hairS:'bald',mous:'cossack',brow:'dark',browThick:1,coat:'linen',collar:'emb',rx:10.5,jaw:.22,cheek:1,mouth:'smile',eyes:'narrow',
    draw(b,G){/* чуб-оселедець, що спадає на ліве вухо, і фартух корчмаря */const P=[[1,-13],[1,-12],[0,-11],[-1,-10],[-2,-9],[-3,-8],[-4,-7],[-5,-6],[-6,-5],[-7,-4],[-8,-3],[-9,-2],[-9,-1],[-9,0]];P.forEach(([dx,dy],i)=>{const X=G.cx+dx,Y=G.cy+dy;pset(b,X-1,Y,i<9?'a':'9');pset(b,X,Y,'9');pset(b,X+1,Y,'8');pset(b,X+2,Y,i<11?'0':'.');if(i<9)pset(b,X+1,Y+1,'#')});
      for(let y=41;y<48;y++)for(let x=G.cx-9;x<G.cx+9;x++)prmp(b,x,y,PR.leather,plit((x-G.cx)/12,0)*.8);for(const sx of[-9,8])pline(b,G.cx+sx,37,G.cx+sx+(sx<0?2:-2),41,'W')}},
  yarema:{age:2,hair:'brown',hairS:'short',hat:'brim',hatC:'felt',band:'g',mous:'thin',beard:'short',beardC:'brown',coat:'wine',cut:'v',shirt:'linen',buttons:[[-6,42],[-6,46]],mouth:'smile',eyes:'narrow',browT:1,
    draw(b,G){/* золота сережка й монета в пальцях */pset(b,G.cx+G.rx,G.ey+3,'g');pset(b,G.cx+G.rx,G.ey+4,'f');
      for(const[x,y]of[[33,43],[34,43],[35,43],[33,44],[35,44],[33,45],[34,45],[35,45]])pset(b,x,y,'g');pset(b,34,44,'f');pset(b,32,44,'m');pset(b,32,45,'n');pset(b,36,45,'n')}},
  tymish:{age:0,hair:'straw',hairS:'messy',coat:'linen',collar:'emb',rx:9,ry:11,cy:22,eyes:'big',iris:'3',freckles:1,mouth:'smile',nose:4,mw:1,blush:1,
    draw(b,G){/* камінець у руці */pset(b,30,45,'9');pset(b,31,45,'a');pset(b,30,46,'8');pset(b,31,46,'9');pset(b,29,46,'m');pset(b,32,46,'n')}},
  olesya:{age:0,hair:'brown',hairS:'braid',coat:'green',shirt:'linen',cut:'open',collar:'emb',eyes:'big',iris:'k',mouth:'flat',nose:4,mw:1,rx:9,jaw:.38,
    draw(b,G){/* вінок із сухих трав */for(let x=G.cx-G.rx;x<G.cx+G.rx;x++){const y=Math.round(G.cy-G.ry+4+Math.pow((x-G.cx)/G.rx,2)*2.5);pset(b,x,y,(x&1)?'l':'k');if(x%3===0)pset(b,x,y-1,x%2?'g':'o')}
      for(let i=0;i<6;i++){pset(b,13+i,44-i,'l');if(i&1)pset(b,12+i,43-i,'k')}pset(b,18,38,'g')}},
  ustyna:{age:1,hair:'dark',hairS:'short',hat:'kerchiefB',hatC:'kdark',hatDot:'5',coat:'leather',cut:'open',shirt:'linen',mouth:'frown',browT:-1,browThick:1,eyes:'narrow',skin:'tan',rx:10,jaw:.25,
    draw(b,G){/* хвостики хустки, сажа на щоці, сокира на плечі */for(let i=0;i<5;i++){prmp(b,G.cx+G.rx+i*.6,G.cy-3+i,PR.kdark,.5-i*.06);prmp(b,G.cx+G.rx+1+i*.6,G.cy-2+i,PR.kdark,.25)}for(const[x,y]of[[-6,4],[-5,5],[-7,5],[5,6]])pset(b,G.cx+x,G.ey+y,'#');pline(b,36,47,42,33,'X');pline(b,37,47,43,33,'W');for(let y=29;y<35;y++){pset(b,41,y,'p');pset(b,42,y,'q');pset(b,43,y,'p')}pset(b,44,30,'H')}},
  kindrat:{age:2,hair:'black',hairS:'none',beard:'full',beardC:'black',brow:'brown',coat:'leather',shirt:'wool',cut:'open',rx:10.5,jaw:.2,mouth:'flat',eyes:'narrow',skin:'tan',slope:12,
    draw(b,G){/* сажа, лиск на лисині, сліди кайданів на шиї */for(const[x,y]of[[-5,-6],[3,-7],[-7,3],[6,2]])pset(b,G.cx+x,G.ey+y,'#');pset(b,G.cx-4,G.cy-8,'!');pset(b,G.cx-3,G.cy-9,'!');
      for(let x=G.cx-4;x<G.cx+4;x++)pset(b,x,35,(x&1)?'9':'8');for(const sx of[-8,7])for(let y=37;y<48;y++)pset(b,G.cx+sx+(y>42?(sx<0?1:-1):0),y,'V')}},
  severyn:{age:3,hair:'white',hairS:'bald',wisps:1,coat:'leather',shirt:'linen',cut:'open',rx:8.5,jaw:.42,cheek:1,mouth:'flat',eyes:'open',iris:'4',beard:'stubble',beardC:'white',
    draw(b,G){/* окуляри склодува */const ey=G.ey;for(const ex of[G.cx-7,G.cx+1]){for(let i=0;i<6;i++){pset(b,ex+i,ey-2,'q');pset(b,ex+i,ey+2,'p')}pset(b,ex,ey-1,'q');pset(b,ex,ey,'q');pset(b,ex,ey+1,'p');pset(b,ex+5,ey-1,'p');pset(b,ex+5,ey,'p');pset(b,ex+5,ey+1,'p');pset(b,ex+1,ey-1,'U')}
      pset(b,G.cx-1,ey-1,'q');pset(b,G.cx,ey-1,'q')}},
  zakhar:{age:3,hair:'white',hairS:'short',hat:'cap',hatC:'wool',beard:'full',beardC:'white',brow:'grey',coat:'navy',cut:'v',shirt:'linen',mouth:'flat',eyes:'narrow',skin:'tan',
    draw(b,G){/* олівець за вухом */pline(b,G.cx+G.rx-1,G.ey-6,G.cx+G.rx+3,G.ey-2,'e');pset(b,G.cx+G.rx+3,G.ey-2,'0');pset(b,G.cx+G.rx-1,G.ey-6,'g')}},
  marta:{age:1,hair:'red',hairS:'long',hat:'captain',hatC:'black',coat:'navy',cut:'v',shirt:'linen',buttons:[[-7,41],[6,41],[-7,45],[6,45]],mouth:'smile',eyes:'open',iris:'3',browT:1,jaw:.34,
    draw(b,G){/* золоті еполети по лінії плечей */for(const x0 of[6,34])for(let i=0;i<8;i++){const x=x0+i,d=Math.abs(x+.5-G.cx),y=Math.ceil(d<9?36.5:36.5+(d-9)*(d-9)/16);pset(b,x,y,'g');pset(b,x,y+1,i&1?'f':'g');if(i%2===0)pset(b,x,y+2,'f')}}},
  panas:{age:2,hair:'brown',hairS:'short',hat:'cap',hatC:'linen',mous:'cossack',brow:'straw',coat:'linen',collar:'emb',rx:10.5,jaw:.2,cheek:1,mouth:'smile',eyes:'narrow',blush:1,
    draw(b,G){/* борошно на бровах і кашкеті */for(const[x,y]of[[-6,-3],[-4,-3],[3,-3],[5,-3],[-2,-12],[4,-13],[0,-14]])pset(b,G.cx+x,G.ey+y,'u');for(let i=0;i<10;i++)pset(b,8+i*3,38+(i%3),'O')}},
  motrya:{age:3,hair:'white',hairS:'short',hat:'kerchief',hatC:'kdark',hatDot:'i',coat:'violet',eyes:'closed',mouth:'smile',rx:9,jaw:.42,cheek:1,
    draw(b,G){/* пасмо сивини з-під хустки */pset(b,G.cx-5,G.cy-3,'6');pset(b,G.cx-4,G.cy-3,'u');pset(b,G.cx-6,G.cy-2,'6')}},
  luka:{age:2,hair:'dark',hairS:'short',hat:'cap',hatC:'navy',mous:'thin',beard:'short',beardC:'dark',coat:'navy',cut:'v',shirt:'linen',buttons:[[-6,41],[-6,45]],mouth:'frown',eyes:'narrow',browT:-1,
    draw(b,G){/* якір на кашкеті */const y=G.cy-G.ry+3;pset(b,G.cx,y-1,'g');pset(b,G.cx,y,'g');pset(b,G.cx,y+1,'g');pset(b,G.cx-1,y+1,'f');pset(b,G.cx+1,y+1,'f');pset(b,G.cx-1,y-1,'g');pset(b,G.cx+1,y-1,'g')}},
  gnat:{age:2,hair:'grey',hairS:'short',hat:'hood',hatC:'hood',hood:1,shadeTop:22,dim:.95,skin:'tan',beard:'stubble',beardC:'grey',coat:'hood',mouth:'flat',eyes:'narrow',iris:'5',browT:-2,bg:'cold',
    draw(b,G){/* шрам через око */pline(b,G.cx+2,G.ey-5,G.cx+6,G.ey+4,'+');pline(b,G.cx+3,G.ey-5,G.cx+7,G.ey+4,'t')}},
};
for(const id in FP)FACES[id]=()=>portrait2(FP[id]);
