/* ============ ЖИВИЙ СВІТ: частинки й анімації поверх сцени ============
   Один <canvas class="fx"> у сцені, малюємо в точній сітці (логічні координати × SK) через ImageData.
   Цикл ~30 кадрів/с; спить, коли сцени немає, вкладка схована або ввімкнено «менше руху». */
const FX={cv:null,g:null,im:null,u:null,W:0,H:0,sc:'',ps:[],t:0,last:0,on:0,ev:{},walk:[],crab:null,weed:[],moth:[],wisp:[],stars:[]};
const fxCanvas=(sc,W,H)=>`<canvas class="fx" data-sk="fx" data-sig="fx-${sc}" width="${Math.round(W*SK)}" height="${Math.round(H*SK)}" aria-hidden="true"></canvas>`;
const FXC={};
function fxCol(c,a){const k=c+(a*20|0);if(FXC[k]!==undefined)return FXC[k];const hex=PAL[c]||'#ffffff',r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16),A=Math.max(0,Math.min(255,Math.round(a*255)));
  return FXC[k]=((A<<24)|(b<<16)|(g<<8)|r)>>>0}
function fxP(x,y,col){x=x|0;y=y|0;if(x<0||y<0||x>=FX.W||y>=FX.H)return;FX.u[y*FX.W+x]=col}
/* логічний «піксель» (k×k) — для фігурок */
function fxB(x,y,col){const k=SK,x0=Math.round(x*k),y0=Math.round(y*k),x1=Math.round((x+1)*k),y1=Math.round((y+1)*k);for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++)fxP(i,j,col)}
const fxR=(a,b)=>a+Math.random()*(b-a);
/* Сплеск частинок — для реакцій на дії: kind = 'spark' | 'dust' | 'splash' | 'chip' */
function fxBurst(sc,x,y,kind,n){if(FX.sc!==sc&&sc!=='*')return;const k=SK;for(let i=0;i<(n||10);i++){const P={x:x*k+fxR(-3,3),y:y*k+fxR(-2,2),life:0,max:fxR(.4,.9),kind};
  if(kind==='spark'){P.vx=fxR(-60,60);P.vy=fxR(-90,-30);P.gr=140}else if(kind==='splash'){P.vx=fxR(-35,35);P.vy=fxR(-80,-40);P.gr=220}else if(kind==='chip'){P.vx=fxR(-40,40);P.vy=fxR(-50,-15);P.gr=160}else{P.vx=fxR(-18,18);P.vy=fxR(-14,-4);P.gr=-4;P.max=fxR(.6,1.2)}
  FX.ps.push(P)}}
function fxFlash(sc,x,y){if(FX.sc!==sc)return;FX.ps.push({x:x*SK,y:y*SK,vx:0,vy:0,gr:0,life:0,max:.28,kind:'flash'})}
function fxReset(sc){FX.sc=sc;FX.ps=[];FX.walk=[];FX.crab=null;FX.ev={};FX.moth=Array.from({length:5},()=>({r:fxR(6,15),w:fxR(1.5,3),ph:fxR(0,6.3)}));
  FX.wisp=Array.from({length:7},()=>({x:fxR(0,1),y:fxR(0,1),r:fxR(10,22),v:fxR(2,5)}));FX.weed=Array.from({length:4},()=>({x:fxR(40,280),ph:fxR(0,6.3)}))}
function fxTick(ts){requestAnimationFrame(fxTick);if(typeof document==='undefined'||document.hidden)return;if(ts-FX.last<33)return;const dt=Math.min(.1,(ts-FX.last)/1000||.033);FX.last=ts;
  const cv=document.querySelector('#stage canvas.fx');if(!cv||RM()){if(FX.cv){FX.cv=null}return}
  if(cv!==FX.cv){FX.cv=cv;FX.g=cv.getContext('2d');FX.W=cv.width;FX.H=cv.height;FX.im=FX.g.createImageData(FX.W,FX.H);FX.u=new Uint32Array(FX.im.data.buffer);const sc=(cv.dataset.sig||'').slice(3);if(sc!==FX.sc)fxReset(sc)}
  FX.t+=dt;FX.u.fill(0);try{if(FX.sc==='yd')fxYard(dt);else if(FX.sc==='sh')fxShore(dt);else if(FX.sc==='tw')fxTower(dt);else if(FX.sc==='wk'||FX.sc==='st')fxRoom(dt);fxParts(dt)}catch(e){}FX.g.putImageData(FX.im,0,0)}
/* Частинки: іскри, пил, бризки */
function fxParts(dt){const out=[];for(const p of FX.ps){p.life+=dt;if(p.life>p.max)continue;p.vy+=(p.gr||0)*dt;p.vx*=1-.8*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;const f=p.life/p.max;
  if(p.kind==='flash'){const R=14*(1-f*.4),a=.55*(1-f);for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const d=Math.hypot(i,j)/R;if(d<1&&(1-d)*a>bay((p.x+i)|0,(p.y+j)|0))fxP(p.x+i,p.y+j,fxCol(d<.35?'I':'J',.5))}out.push(p);continue}
  let c;if(p.kind==='spark'){c=f<.25?fxCol('I',1):f<.55?fxCol('J',.95):fxCol('K',.9*(1-f)+.1);if(Math.random()<.15)continue}
  else if(p.kind==='splash')c=fxCol(f<.5?'u':'U',.9*(1-f)+.1);else if(p.kind==='chip')c=fxCol(f<.5?'Y':'X',1-f*.6);else c=fxCol('6',.45*(1-f));
  fxP(p.x,p.y,c);if(p.kind==='spark'&&f<.3)fxP(p.x,p.y+1,fxCol('K',.6));out.push(p)}FX.ps=out.length>600?out.slice(-600):out}
const fxNight=()=>GR==='n'?1:GR==='d'?.6:.25;
function fxEvery(id,a,b){const t=FX.t,e=FX.ev;if(e[id]===undefined){e[id]=t+fxR(a*.3,b*.6);return false}if(t>=e[id]){e[id]=t+fxR(a,b);return true}return false}
/* Чайка: летить через небо, махає крилами */
function fxGulls(dt,yMin,yMax,W){const nt=fxNight();if(!FX.gull&&fxEvery('gull',GR==='n'?70:18,GR==='n'?140:45)){const d=Math.random()<.5?1:-1;FX.gull={x:d>0?-6:W+6,y:fxR(yMin,yMax),d,v:fxR(16,26),ph:0}}
  const G=FX.gull;if(!G)return;G.x+=G.d*G.v*dt;G.ph+=dt*7;G.y+=Math.sin(FX.t*1.3)*dt*2;if(G.x<-10||G.x>W+10){FX.gull=null;return}
  const c=fxCol(GR==='y'?'9':'5',GR==='n'?.7:.95),up=Math.sin(G.ph)>0,k=SK,cx=G.x*k,cy=G.y*k;fxP(cx,cy,c);fxP(cx+1,cy,c);
  for(let i=1;i<=3;i++){const yy=up?cy-i*.7:cy+(i>1?-1:0);fxP(cx-i,yy,c);fxP(cx+1+i,yy,c)}}
/* Падаюча зоря — лише вночі */
function fxShoot(dt,yMax,W){if(GR!=='n')return;if(!FX.shoot&&fxEvery('shoot',35,90))FX.shoot={x:fxR(W*.3,W)*SK,y:fxR(2,yMax*.5)*SK,l:0};const S=FX.shoot;if(!S)return;S.l+=dt;S.x-=210*dt;S.y+=70*dt;
  for(let i=0;i<16;i++)fxP(S.x+i*3/1.0,S.y-i,fxCol(i<3?'y':'6',Math.max(0,(1-i/16)*(1-S.l/.8))));if(S.l>.8)FX.shoot=null}
/* Мерехтіння зір */
function fxStars(dt,yMax,W){if(GR==='y')return;if(Math.random()<dt*4)FX.stars.push({x:fxR(0,W)*SK,y:fxR(0,yMax)*SK,l:0,m:fxR(.6,1.4)});FX.stars=FX.stars.filter(st=>(st.l+=dt)<st.m);
  for(const st of FX.stars){const a=Math.sin(st.l/st.m*Math.PI)*fxNight();fxP(st.x,st.y,fxCol('y',a));if(a>.6){fxP(st.x+1,st.y,fxCol('6',a*.5));fxP(st.x-1,st.y,fxCol('6',a*.5));fxP(st.x,st.y-1,fxCol('6',a*.5));fxP(st.x,st.y+1,fxCol('6',a*.5))}}}
/* Відблиски на воді; inSea(x,y) — логічні координати */
/* Відблиски на воді: нечасті, кожен плавно спалахує й гасне на своєму місці (не мерехтливий шум) */
function fxGlints(dt,n,area,inSea,warm){FX.gl=FX.gl||[];if(FX.gl.length<n*6&&Math.random()<dt*n*3){const x=fxR(area[0],area[2]),y=fxR(area[1],area[3]);if(inSea(x,y))FX.gl.push({x:Math.round(x*SK),y:Math.round(y*SK),l:0,m:fxR(.7,1.6),w:Math.random()<.4?2:1,c:warm?'h':'U'})}
  FX.gl=FX.gl.filter(g=>(g.l+=dt)<g.m);for(const g of FX.gl){const a=Math.sin(g.l/g.m*Math.PI)*(GR==='y'?.65:.5);for(let i=0;i<g.w;i++)fxP(g.x+i,g.y,fxCol(g.c,a))}}
/* Пасма Мли біля землі */
function fxWisps(dt,y0,y1,W){const m=mlaV();if(m<.3)return;const a=(m-.3)/.7;for(const w of FX.wisp){w.x-=w.v*dt/W;if(w.x<-.2)w.x=1.2;const cx=w.x*W*SK,cy=(y0+w.y*(y1-y0))*SK,rx=w.r*SK,ry=rx*.28;
  for(let j=-ry;j<=ry;j+=1)for(let i=-rx;i<=rx;i+=1){const d=(i*i)/(rx*rx)+(j*j)/(ry*ry);if(d>=1)continue;const x=cx+i,y=cy+j;if((1-d)*a*.9>bay(x|0,y|0))fxP(x,y,fxCol(d<.4?'6':'o',.35*a))}}}

/* ---------- Двір ---------- */
const YARD_COAST=[[285,132],[318,137],[342,146],[356,158],[366,176],[374,200],[380,240]];
function yardSea(x,y){if(y<120)return false;if(y<130)return true;if(x<30)return y<160-(x/30)*12;for(let i=0;i<YARD_COAST.length-1;i++){const[a,c]=[YARD_COAST[i],YARD_COAST[i+1]];if(y>=a[1]&&y<=c[1]){const ex=a[0]+(y-a[1])*(c[0]-a[0])/(c[1]-a[1]);return x>ex+2}}return false}
function fxYard(dt){const k=SK,W=YW,nt=fxNight(),hl=s.b.hearth||0,lit=hl&&s.on.hearth!==false;
  fxStars(dt,95,W);fxShoot(dt,90,W);fxGulls(dt,30,95,W);
  /* іскри вогнища, кузні, жарини */
  if(lit&&Math.random()<dt*(2+hl*1.2))FX.ps.push({x:fxR(137,149)*k,y:fxR(196,202)*k,vx:fxR(-8,8)+Math.sin(FX.t*.4)*10,vy:fxR(-45,-22),gr:-6,life:0,max:fxR(.8,2.2),kind:'spark'});
  if(!hl&&s.f.looked&&Math.random()<dt*.8)FX.ps.push({x:fxR(129,133)*k,y:217*k,vx:fxR(-4,4),vy:fxR(-14,-6),gr:-2,life:0,max:fxR(.6,1.4),kind:'spark'});
  const fB=BD.find(b=>b.id==='forge');if(s.b.forge&&fB&&fB.show()&&s.on.forge!==false&&Math.random()<dt*1.4){const[bx,by]=BANC.forge;FX.ps.push({x:(bx+fxR(-4,4))*k,y:(by-10)*k,vx:fxR(-10,10),vy:fxR(-30,-12),gr:-4,life:0,max:fxR(.5,1.2),kind:'spark'})}
  /* промінь маяка обертається: до глядача — коротший і яскравіший, убік — довгий і блідий */
  if(s.f.won)fxBeam(dt);
  /* мошкара біля ліхтаря */
  if((s.f.won||(s.floors||{}).lantern)&&GR!=='y')for(const m of FX.moth){const a=FX.t*m.w+m.ph;fxP((55+Math.cos(a)*m.r)*k,(30+Math.sin(a*1.3)*m.r*.55)*k,fxCol('u',.75))}
  /* піна біля берега й відблиски */
  fxCoast(dt);fxGlints(dt,GR==='n'?1.5:2.5,[0,121,W,240],yardSea);
  fxWalkers(dt);fxWisps(dt,150,232,W)}
function fxBeam(dt){const k=SK,th=FX.t*.42,c=Math.cos(th),sn=Math.sin(th),side=c>=0?1:-1,L=(20+(side>0?240:60)*Math.abs(c)),br=(.16+.55*Math.max(0,sn))*(GR==='y'?.3:1);
  const x0=55+side*12,y0=33;for(let i=0;i<L*k;i++){const lx=x0*k+side*i,cy=(y0-(i/k)*.22)*k,hw=(1.2+(i/k)*.06)*k,ai=br*Math.pow(1-i/(L*k),.7);if(lx<0||lx>=FX.W)break;
    for(let yy=-hw;yy<=hw;yy++){const e=1-Math.abs(yy)/hw,a=Math.min(.9,ai*(.3+e)*1.1),q=Math.round(a*5)/5;if(q>0)fxP(lx,cy+yy,fxCol(i<60&&e>.5?'I':'h',q))}}
  const halo=(3+10*Math.pow(Math.max(0,sn),3))*k;if(halo>4)for(let j=-halo;j<=halo;j++)for(let i=-halo;i<=halo;i++){const d=Math.hypot(i,j)/halo;if(d<1&&(1-d)*.7*Math.max(0,sn)>bay((55*k+i)|0,(31*k+j)|0))fxP(55*k+i,31*k+j,fxCol('h',.55))}}
function fxCoast(dt){const k=SK,t=FX.t;let s0=0;for(let i=0;i<YARD_COAST.length-1;i++){const[a,c]=[YARD_COAST[i],YARD_COAST[i+1]],len=Math.hypot(c[0]-a[0],c[1]-a[1]),nx=(c[1]-a[1])/len,ny=-(c[0]-a[0])/len;
  for(let q=0;q<len*k;q+=1){const u=q/(len*k),x=a[0]+(c[0]-a[0])*u,y=a[1]+(c[1]-a[1])*u,sp=s0+q/k,d=1.2+1.4*(.5+.5*Math.sin(t*1.1-sp*.07)),h=hh2(q|0,i);if(h<.25)continue;
    fxP((x+nx*d)*k,(y+ny*d)*k,fxCol('u',.75));if(h>.7)fxP((x+nx*(d+1.2))*k,(y+ny*(d+1.2))*k,fxCol('U',.5))}s0+=len}}
/* Поселенці ходять стежкою між вогнищем і берегом; уночі — з ліхтариком */
const WALK_PATH=t=>[156+t*1.75*90,201+t*.42*90-1];
function fxWalkers(dt){const n=Math.min(2,Math.floor((s.pop||0)/2));while(FX.walk.length<n)FX.walk.push({t:Math.random(),d:Math.random()<.5?1:-1,wait:fxR(0,4),c:['X','S','r','v','T'][FX.walk.length%5]});FX.walk.length=n;
  for(const w of FX.walk){if(w.wait>0)w.wait-=dt;else{w.t+=w.d*dt/18;if(w.t>1||w.t<0){w.t=Math.max(0,Math.min(1,w.t));w.d*=-1;w.wait=fxR(3,8)}}
    const[x,y]=WALK_PATH(w.t),step=w.wait>0?0:Math.floor(FX.t*5)%2,X=Math.round(x),Y=Math.round(y);const dim=GR==='n'?.85:1;
    fxB(X,Y-8,fxCol('m',dim));fxB(X-1,Y-7,fxCol(w.c,dim));fxB(X,Y-7,fxCol(w.c,dim));fxB(X+1,Y-7,fxCol(w.c,dim));fxB(X-1,Y-6,fxCol(w.c,dim));fxB(X,Y-6,fxCol(w.c,dim));fxB(X+1,Y-6,fxCol(w.c,dim));
    fxB(X,Y-5,fxCol(w.c,dim));fxB(X-1+step,Y-4,fxCol('x',1));fxB(X+1-step,Y-4,fxCol('x',1));
    if(GR!=='y'){const lx=X+(w.d>0?2:-2),ly=Y-6,fl=.75+.25*Math.sin(FX.t*9+w.t*40);fxB(lx,ly,fxCol('J',1));for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const d=Math.hypot(i,j)/4.5;if(d<1&&d>.25&&(1-d)*.55*fl>bay((lx*SK+i)|0,(ly*SK+j)|0))fxP(lx*SK+i+1,ly*SK+j+1,fxCol('J',.35))}}}}

/* ---------- Берег ---------- */
function shoreSea(x,y){return y>=24&&y<78}
function fxShore(dt){const k=SK,W=SW,t=FX.t;fxStars(dt,20,W);fxShoot(dt,20,W);fxGulls(dt,4,22,W);fxGlints(dt,GR==='n'?1.2:2,[34,24,W,77],shoreSea);
  /* накат: піна набігає на пісок і відкочується, лишаючи мокру смугу */
  const P=7.5,ph=(t%P)/P,run=ph<.32?Math.sin(ph/.32*Math.PI/2):Math.pow(1-(ph-.32)/.68,1.6),reach=77.5+6*run;
  if(fxEvery('peak',P,P)){for(let i=0;i<14;i++)FX.ps.push({x:fxR(196,232)*k,y:fxR(72,76)*k,vx:fxR(-25,25),vy:fxR(-70,-30),gr:200,life:0,max:fxR(.5,.9),kind:'splash'})}
  for(let hx=Math.round(34*k);hx<W*k;hx++){const x=hx/k,yf=reach+1.1*Math.sin(x/13+t*.6)+.6*Math.sin(x/5.3-t*.9),wet=78+6.5+1.1*Math.sin(x/13);
    for(let hy=Math.round(78*k);hy<wet*k;hy++){const y=hy/k;if(y<yf){if(.32>bay(hx,hy))fxP(hx,hy,fxCol('T',.45))}else if(.22*(1-run*.6)>bay(hx,hy))fxP(hx,hy,fxCol('L',.55))}
    const fy=Math.round(yf*k);if(hh2(hx,3)>.1){fxP(hx,fy,fxCol('u',.9));if(hh2(hx+7,5)>.55)fxP(hx,fy-1,fxCol('U',.7))}}
  /* водорості гойдаються на мілині */
  for(const w of FX.weed){const x=w.x+Math.sin(t*.3+w.ph)*3,y=74.5+run*2+Math.sin(t*1.1+w.ph)*.6;for(let i=0;i<5;i++){fxB(x+i,y+(i%2)*.5,fxCol(i%2?'s':'Z',.9))}}
  /* краб: вибігає, бігає боком, зупиняється, ховається */
  if(!FX.crab&&fxEvery('crab',20,50))FX.crab={x:fxR(60,250),y:fxR(94,112),d:Math.random()<.5?1:-1,go:fxR(1,2.5),stop:0,l:0,n:0};
  const C=FX.crab;if(C){C.l+=dt;if(C.stop>0){C.stop-=dt;if(C.stop<=0){C.go=fxR(.8,2);C.d=Math.random()<.5?1:-1;C.n++}}else{C.x+=C.d*22*dt;C.go-=dt;if(C.go<=0)C.stop=fxR(.8,2.5)}
    if(C.n>3||C.x<40||C.x>W-4){C.fade=(C.fade||0)+dt;if(C.fade>1){FX.crab=null}}
    if(FX.crab){const a=1-(C.fade||0),X=Math.round(C.x),Y=Math.round(C.y),st=C.stop>0?0:Math.floor(t*12)%2;fxB(X,Y,fxCol('j',a));fxB(X+1,Y,fxCol('j',a));fxB(X+2,Y,fxCol('j',a));fxB(X+1,Y-1,fxCol('i',a));
      fxB(X-1,Y+st,fxCol('i',a));fxB(X+3,Y+1-st,fxCol('i',a));fxB(X,Y-1,fxCol('u',a));fxB(X+2,Y-1,fxCol('u',a))}}
  /* промінь маяка (сам маяк за кадром) ковзає по воді: смуга теплих відблисків біжить морем */
  if(s.f.won&&GR!=='y'){const th=FX.t*.42,c=Math.cos(th),sn=Math.sin(th);if(c>.2){const bx=34+(1-sn)*.5*(W-34);FX.sw=FX.sw||[];if(FX.sw.length<14&&Math.random()<dt*10*c){const y=fxR(28,76),x=bx+fxR(-1,1)*12*(1-(y-26)/90);FX.sw.push({x:Math.round(x*k),y:Math.round(y*k),l:0,m:fxR(.5,1)})}}
    FX.sw=(FX.sw||[]).filter(g=>(g.l+=dt)<g.m);for(const g of FX.sw){const a=Math.sin(g.l/g.m*Math.PI)*.75;fxP(g.x,g.y,fxCol('h',a));fxP(g.x+1,g.y,fxCol('h',a*.6))}}
  fxWisps(dt,40,100,W)}

/* ---------- Маяк у розрізі ---------- */
const twSea=(x,y)=>y>=206&&y<262&&(x<TCX-twO(y)-4||x>TCX+twO(y)+4);
function fxTower(dt){const k=SK,W=TWW;fxStars(dt,170,W);fxShoot(dt,150,W);fxGulls(dt,40,160,W);fxGlints(dt,GR==='n'?1:2,[0,206,W,262],twSea);
  /* іскри в каміні нижньої зали */
  if(floorBuilt('hall')&&s.on.hearth!==false){const[x0,y0,w,h]=twBox('hall'),fw=fuL('hall')>=1?34:26,fx=x0+6+fw/2;if(Math.random()<dt*4)FX.ps.push({x:(fx+fxR(-4,4))*k,y:(y0+h-8)*k,vx:fxR(-6,6),vy:fxR(-26,-12),gr:-3,life:0,max:fxR(.5,1.3),kind:'spark'})}
  /* іскри з точильного круга */
  if(floorBuilt('work')&&fuL('work')>=2&&Math.random()<dt*.6){const[x0,y0,w,h]=twBox('work');fxBurst('tw',x0+w-14,y0+h-15,'spark',5)}
  /* порошинки в теплому світлі відбудованих кімнат */
  FX.mote=FX.mote||[];if(FX.mote.length<40&&Math.random()<dt*8){const ids=TORDER.filter(id=>floorBuilt(id)&&id!=='lantern');if(ids.length){const id=ids[Math.floor(Math.random()*ids.length)],[x0,y0,w,h]=twBox(id);FX.mote.push({x:x0+fxR(6,w-6),y:y0+fxR(4,h-6),vx:fxR(-1.5,1.5),vy:fxR(-1.5,.5),l:0,m:fxR(3,7)})}}
  FX.mote=FX.mote.filter(m=>(m.l+=dt)<m.m);for(const m of FX.mote){m.x+=m.vx*dt+Math.sin(FX.t+m.m)*.05;m.y+=m.vy*dt;fxP(m.x*k,m.y*k,fxCol('h',Math.sin(m.l/m.m*Math.PI)*.55))}
  /* промінь із ліхтарні обертається */
  if(s.f.won){const th=FX.t*.42,c=Math.cos(th),sn=Math.sin(th),side=c>=0?1:-1,L=20+190*Math.abs(c),br=(.18+.55*Math.max(0,sn))*(GR==='y'?.3:1),x0=TCX+side*30,y0=44;
    for(let i=0;i<L*k;i++){const lx=x0*k+side*i,cy=(y0-(i/k)*.12)*k,hw=(2+(i/k)*.07)*k,ai=br*Math.pow(1-i/(L*k),.7);if(lx<0||lx>=FX.W)break;for(let yy=-hw;yy<=hw;yy++){const e=1-Math.abs(yy)/hw,a=Math.min(.9,ai*(.3+e)*1.1),q=Math.round(a*5)/5;if(q>0)fxP(lx,cy+yy,fxCol(i<50&&e>.5?'I':'h',q))}}}
  if((s.f.won||floorBuilt('lantern'))&&GR!=='y')for(const m of FX.moth){const a=FX.t*m.w+m.ph;fxP((TCX+Math.cos(a)*(m.r+30))*k,(44+Math.sin(a*1.3)*m.r*.7)*k,fxCol('u',.7))}
  fxWisps(dt,240,292,W)}
/* ---------- Кімнати зблизька ---------- */
function fxRoom(dt){const k=SK;FX.mote=FX.mote||[];if(FX.mote.length<55&&Math.random()<dt*10)FX.mote.push({x:fxR(20,412),y:fxR(20,196),vx:fxR(-1.2,1.2),vy:fxR(-1.2,.4),l:0,m:fxR(4,9)});
  FX.mote=FX.mote.filter(m=>(m.l+=dt)<m.m);for(const m of FX.mote){m.x+=m.vx*dt;m.y+=m.vy*dt;const lx=FX.sc==='wk'?120:339,ly=FX.sc==='wk'?44:146,near=Math.max(0,1-Math.hypot(m.x-lx,(m.y-ly)*1.3)/140);fxP(m.x*k,m.y*k,fxCol('h',Math.sin(m.l/m.m*Math.PI)*(.15+.55*near)))}
  if(FX.sc==='wk'&&s.b.forge&&Math.random()<dt*3)FX.ps.push({x:(231+fxR(-6,6))*k,y:181*k,vx:fxR(-8,8),vy:fxR(-30,-14),gr:-4,life:0,max:fxR(.5,1.2),kind:'spark'});
  if(FX.sc==='wk'&&floorBuilt('work')&&fuL('work')>=2&&Math.random()<dt*.5)fxBurst('wk',316,170,'spark',6);
  if(FX.sc==='st'){const f=.5+.5*Math.sin(FX.t*7)*Math.sin(FX.t*3.1);fxP(339*k,141*k,fxCol('I',.4+.5*f));fxP(339*k+1,141*k-1,fxCol('J',.3*f))}}
if(typeof requestAnimationFrame==='function')requestAnimationFrame(fxTick);
