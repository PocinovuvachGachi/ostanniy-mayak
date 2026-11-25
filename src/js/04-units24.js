/* ============ ЮНІТИ У 24 PX (#44) ============
   Вороги, союзники й герой будуються з деталей одним «конструктором»: людина, звір, птах, гад.
   Світло всюди одне — згори зліва: кожна деталь затінюється за своєю формою (куля, циліндр),
   тож усі фігури мають однаковий об'єм. Результат — рядки символів палітри, як у SPR24. */
const U24={
  skin:['n','m','!'],pale:['3','4','5'],ice:['4','5','6','U','u'],blue:['1','2','3'],navy:['x','1','2'],grey:['D','E','F','G'],
  leather:['V','W','X','Y'],brown:['c','d','e'],red:['t','i','j'],green:['s','Z','r','l'],moss:['s','k','l'],purple:['(','$',')'],
  metal:['F','p','q','7'],stone:['D','E','F','G','H'],white:['5','6','7','u'],sand:['L','M','N','O'],black:['x','8','9'],
  fog:['3','4','5','6'],fur:['9','a','b'],wolf:['2','3','4','5'],dog:['c','d','X','e'],toad:['s','Z','k','r','l']};
const u24bay=(x,y)=>([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]][y&3][x&3])/16;
function u24g(){return Array.from({length:24},()=>Array(24).fill('.'))}
function u24p(g,x,y,c){x=Math.round(x);y=Math.round(y);if(c&&c!=='.'&&x>=0&&y>=0&&x<24&&y<24)g[y][x]=c}
const u24sh=(R,l)=>R[Math.max(0,Math.min(R.length-1,Math.floor(Math.max(0,Math.min(.999,l))*R.length)))];
/* куля: світло згори зліва */
function u24ell(g,cx,cy,rx,ry,R,lb=0){for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){
  const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;if(nx*nx+ny*ny>1)continue;u24p(g,x,y,u24sh(R,.6-.42*nx-.4*ny+(u24bay(x,y)-.5)*.16+lb))}}
/* циліндр (тулуб, рукав, нога): світліший лівий край і верх */
function u24box(g,x0,y0,w,h,R,lb=0){for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const t=(x-x0+.5)/w,v=(y-y0+.5)/h;
  u24p(g,x,y,u24sh(R,.8-.6*t-.2*v+(y===y0&&h>2?.1:0)+(u24bay(x,y)-.5)*.12+lb))}}
/* многокутник з тим самим світлом */
function u24poly(g,pts,R,lb=0){let x0=99,x1=-99,y0=99,y1=-99;for(const[x,y]of pts){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
  for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
    xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.round(xs[k]);x<Math.round(xs[k+1]);x++){const t=(x+.5-x0)/Math.max(1,x1-x0),v=(y+.5-y0)/Math.max(1,y1-y0);u24p(g,x,y,u24sh(R,.75-.5*t-.35*v+(u24bay(x,y)-.5)*.14+lb))}}}
function u24ln(g,x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)u24p(g,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c)}
const u24rows=g=>g.map(r=>r.join(''));
const u24flip=rows=>rows.map(r=>r.split('').reverse().join(''));

/* ---- зброя й речі в руках ---- */
const U24W={
  knife:g=>{u24ln(g,4,11,4,15,'q');u24p(g,5,12,'p');u24p(g,5,13,'p');u24p(g,4,16,'g');u24ln(g,5,17,5,18,'c')},
  club:g=>{u24ln(g,3,9,5,17,'d');u24ln(g,4,9,6,17,'e');u24ell(g,3.6,8.2,2,2.2,['c','d','e']);u24p(g,2,8,'9')},
  sabre:g=>{u24ln(g,2,5,4,15,'q');u24ln(g,3,5,5,15,'p');u24p(g,2,4,'7');u24ln(g,3,16,6,16,'g');u24ln(g,5,17,5,18,'c')},
  harpoon:g=>{u24ln(g,3,3,3,23,'d');u24ln(g,4,4,4,22,'e');u24ln(g,3,0,3,2,'q');u24p(g,2,2,'p');u24p(g,4,2,'p');u24p(g,1,3,'p');u24p(g,5,3,'p');u24p(g,4,1,'7')},
  spear:g=>{u24ln(g,3,4,3,23,'d');u24ln(g,4,5,4,22,'e');for(const x of[2,3,4])u24ln(g,x,0,x,3,x===3?'q':'p');u24ln(g,2,3,4,3,'p')},
  musket:g=>{u24ln(g,5,20,20,4,'d');u24ln(g,6,20,21,4,'c');u24ln(g,12,12,21,3,'F');u24ln(g,13,12,22,3,'p');u24p(g,22,2,'q');u24ell(g,5.5,20,1.6,1.3,['c','d','e'])},
  oar:g=>{u24ln(g,3,1,3,15,'d');u24ln(g,4,1,4,15,'e');u24box(g,2,15,3,7,['c','d','e']);u24p(g,3,22,'c')},
  cleaver:g=>{u24box(g,0,7,4,6,['F','p','q']);u24ln(g,0,7,0,12,'7');u24ln(g,3,13,4,17,'c');u24p(g,5,18,'c')},
  bell:g=>{u24ell(g,4,15,2,2.2,['f','g','h']);u24p(g,4,17,'c');u24ln(g,4,11,4,12,'9')},
  net:g=>{for(let y=13;y<22;y++)for(let x=0;x<6;x++)if((x+y)%2===0&&x+(y-13)*.3<6)u24p(g,x,y,y%2?'a':'b');u24ln(g,5,17,5,18,'d')},
};
/* ---- людина, анфас ---- */
function u24human(o){const g0=u24g();if(o.back)o.back(g0);const g=g0,S=o.skin||U24.skin,top=o.top||U24.blue,legs=o.legs||U24.navy,boots=o.boots||U24.black,sl=o.sleeve||top;
  const big=o.build==='big',thin=o.build==='thin',tx=big?6:thin?8:7,tw=big?12:thin?8:10,aw=big?3:2,ax0=tx-aw,ax1=tx+tw;
  /* ноги й чоботи */
  if(!o.float){u24box(g,8,19,3,3,legs);u24box(g,13,19,3,3,legs);u24box(g,7,22,4,2,boots);u24box(g,13,22,4,2,boots)}
  /* тулуб */
  u24box(g,tx,11,tw,8,top);if(o.coat)u24poly(g,[[tx,15],[tx+tw,15],[tx+tw+1,21],[12.5,20],[11.5,20],[tx-1,21]],o.coat);
  if(o.float){const F=o.coat||top;for(let y=19;y<24;y++)for(let x=tx-1;x<tx+tw+1;x++){const k=(y-18)/6;if(u24bay(x,y)>1-k*.95||(x+y*3)%5===0&&y>21)continue;u24p(g,x,y,u24sh(F,.55-.5*(x-tx)/tw-.3*k))}}
  if(o.belt)for(let x=tx;x<tx+tw;x++)u24p(g,x,17,x===11||x===12?'g':o.belt);
  if(o.sash)for(let i=0;i<tw;i++)u24p(g,tx+i,11+Math.round(i*6/tw),o.sash);
  if(o.chest)o.chest(g,tx,tw);
  /* руки */
  u24box(g,ax0,11,aw,6,sl);u24box(g,ax1,11,aw,6,sl,-.1);for(let y=11;y<17;y++){u24p(g,ax0+aw-1,y,sl[0]);u24p(g,ax1,y,sl[0])}
  const hd=o.hands||S;u24box(g,ax0,17,aw,2,hd,.1);u24box(g,ax1,17,aw,2,hd,.1);
  if(o.shoulder){u24ell(g,ax0+aw/2+.3,11.5,aw/2+1.3,1.8,o.shoulder);u24ell(g,ax1+aw/2-.3,11.5,aw/2+1.3,1.8,o.shoulder)}
  /* голова */
  for(let x=10;x<=13;x++)u24p(g,x,10,u24sh(S,.4-(x-10)*.1));
  if(o.head==='hood'){const H=o.hood||top;u24ell(g,12,5.6,5.2,5.4,H);u24poly(g,[[6.5,7],[17.5,7],[19,12],[5,12]],H);u24ell(g,12,6.6,3,3.3,S,-.15);for(let x=9;x<=15;x++)u24p(g,x,3,u24sh(H,.3))}
  else{u24ell(g,12,5.6,3.9,4.3,S)}
  const ey=o.head==='hood'?6:6,ec=o.eye||'0';u24p(g,10,ey,ec);u24p(g,13,ey,ec);
  if(o.brow)for(const x of[9,10,13,14])u24p(g,x,ey-1,o.brow);
  if(o.mask){const M=o.mask;for(let y=7;y<=9;y++)for(let x=9;x<=15;x++)u24p(g,x,y,u24sh(M,.65-.08*(x-9)-.1*(y-7)))}
  if(o.beard){for(let y=7;y<=10;y++)for(let x=9;x<=14;x++)if(y<10||x>9&&x<14)u24p(g,x,y,u24sh(o.beard,.6-.07*(x-9)-.12*(y-7)));u24p(g,11,8,'0');u24p(g,12,8,'0')}
  else if(!o.mask&&o.head!=='hood'&&o.mouth!==0)u24p(g,12,8,o.mouth||'n');
  const hs=o.head;
  if(hs==='cap'){const C=o.hat||U24.blue;u24ell(g,12,3,4.3,2.4,C);for(let x=7;x<=16;x++)u24p(g,x,4,u24sh(C,.25))}
  else if(hs==='knit'){const C=o.hat||U24.navy;u24ell(g,12,2.8,4.2,2.6,C);for(let x=8;x<=16;x++)u24p(g,x,4,u24sh(C,.55-(x-8)*.05))}
  else if(hs==='band'){const C=o.hat||U24.red;u24ell(g,12,2.8,4.1,2.2,C);for(let x=8;x<=16;x++)u24p(g,x,4,u24sh(C,.4));u24p(g,17,4,C[1]);u24p(g,18,5,C[1]);u24p(g,17,6,C[0])}
  else if(hs==='tricorn'){const C=o.hat||U24.black;u24poly(g,[[5,4.5],[8,1],[12,0],[16,1],[19,4.5],[12,3.5]],C);for(let x=6;x<=18;x++)u24p(g,x,4,x%2?'g':u24sh(C,.2))}
  else if(hs==='helm'){const C=o.hat||U24.metal;u24ell(g,12,3.4,4.4,3.2,C);for(let x=7;x<=16;x++)u24p(g,x,5,u24sh(C,.3));u24ln(g,12,5,12,7,u24sh(C,.5))}
  else if(hs==='hair'){const C=o.hat||U24.brown;u24ell(g,12,2.8,4.1,2.3,C);u24p(g,8,4,C[0]);u24p(g,15,4,C[0]);u24p(g,8,5,C[0]);u24p(g,15,5,C[0])}
  else if(hs==='bald'){u24p(g,10,2,'!');u24p(g,11,2,'!')}
  if(o.weapon&&U24W[o.weapon])U24W[o.weapon](g);
  if(o.front)o.front(g);
  if(o.off)o.off(g);
  if(o.extra)o.extra(g);
  return g}
/* ---- звір збоку (голова ліворуч) ---- */
function u24beast(o){const g=u24g(),F=o.fur,low=!!o.low,by=low?15:12,rx=o.bodyRx||7,ry=o.bodyRy||3.4,lh=low?3:6;
  /* нога: стегно, гомілка, лапа; задні — з вигином */
  const leg=(x,far,hind)=>{const R=far?F.slice(0,Math.max(2,F.length-1)):F,lb=far?-.3:0,y0=by+1,yb=by+1+lh;
    u24ell(g,x+.5+(hind?.8:0),y0+1,hind?2.2:1.6,2.2,R,lb);
    for(let y=y0+2;y<=yb;y++){const k=(y-y0)/lh,xx=x+(hind?(k<.6?.9-k*.6:k-.3):0);u24p(g,xx,y,u24sh(R,.5+lb));u24p(g,xx+1,y,u24sh(R,.25+lb))}
    u24p(g,x-1+(hind?1:0),yb,o.paw||F[0]);u24p(g,x+(hind?1:0),yb,o.paw||F[0]);u24p(g,x+1+(hind?1:0),yb,o.paw||F[0])};
  leg(9,1,0);leg(18,1,1);
  if(o.tail)o.tail(g,by);
  u24ell(g,13.5,by,rx,ry,F);
  const hx=o.hx||5,hy=by-(low?1:4);
  /* шия */
  u24poly(g,[[hx+1,hy-1],[hx+4,hy-2],[10,by-2.5],[10,by+2],[hx+2,hy+2]],F,.05);
  if(o.mane)u24ell(g,9.5,by-1.5,2.8,3.2,F,.12);
  leg(7,0,0);leg(16,0,1);
  u24ell(g,hx+.5,hy,2.9,2.5,F,.12);u24poly(g,[[hx-4.5,hy],[hx-1,hy-1],[hx,hy+2],[hx-4.5,hy+1.6]],o.snout||F,.15);u24p(g,hx-5,hy,o.nose||'0');u24p(g,hx-4,hy,o.nose||'0');
  if(o.ears)o.ears(g,hx,hy);
  u24p(g,hx-.5,hy-1,o.eye||'0');if(o.eye2)u24p(g,hx+.5,hy-1,o.eye2);
  if(o.teeth){u24p(g,hx-4,hy+2,'7');u24p(g,hx-2,hy+2,'7')}
  if(o.collar)for(let k=0;k<4;k++)u24p(g,hx+2.5+k*.4,hy+k*.9-1,o.collar);
  if(o.extra)o.extra(g,by,hx,hy);
  return g}
/* ---- чайка в польоті ---- */
function u24bird(o){const g=u24g(),B=o.body||U24.white,Wg=o.wing||['4','5','6'],tip=o.tip||'1',dy=(o.dy||0)+1;
  /* дальнє крило — темніше, за тілом */
  u24poly(g,[[10,11+dy],[12,3+dy],[15,1+dy],[14.5,4+dy],[14,11+dy]],Wg,-.3);for(const[x,y]of[[13,1],[14,1],[15,1],[14,2]])u24p(g,x,y+dy,tip);
  u24ell(g,13,13.5+dy,6.2,3,B);
  /* хвіст */
  u24poly(g,[[17,12+dy],[22,11.5+dy],[22.5,14+dy],[18,15+dy]],B,-.1);u24p(g,22,12+dy,tip);u24p(g,22,13+dy,tip);
  /* ближнє крило */
  u24poly(g,[[11,12+dy],[15.5,5.5+dy],[20,2+dy],[22,2.5+dy],[18.5,7.5+dy],[16,13+dy]],Wg,.15);for(const[x,y]of[[19,2],[20,2],[21,2],[21,3],[20,3],[19,4]])u24p(g,x,y+dy,tip);
  for(let i=0;i<6;i++)u24p(g,12+i,12+dy-Math.round(i*1.1),Wg[Wg.length-1]);
  /* голова й дзьоб */
  u24ell(g,6.5,10.5+dy,3,2.8,B,.1);u24box(g,1,11+dy,3,1,['f','g','g']);u24p(g,2,12+dy,'g');u24p(g,3,12+dy,'j');u24p(g,6,10+dy,'0');
  /* лапи підібгані */
  u24p(g,12,17+dy,'f');u24p(g,13,17+dy,'f');u24p(g,15,17+dy,'f');u24p(g,16,17+dy,'f');
  if(o.extra)o.extra(g,dy);
  return g}

/* ---- самі вороги ---- */
const U24B={
  rat:()=>u24beast({fur:['9','a','b'],low:1,bodyRx:7.4,bodyRy:3.4,hx:5,snout:['a','b','b'],nose:'j',eye:'0',teeth:1,
    ears:(g,hx,hy)=>{u24ell(g,hx+1.5,hy-2.6,1.4,1.4,['n','m','m'])},
    tail:(g,by)=>{u24ln(g,20,by+1,22,by+3,'n');u24ln(g,22,by+3,22,by+6,'n');u24p(g,21,by+7,'n');u24p(g,23,by+2,'m')},
    extra:(g,by)=>{for(const x of[10,12,14,16])u24p(g,x,by-2.5,'b')}}),
  hound:()=>u24beast({fur:U24.dog,hx:5,snout:['d','X','e'],eye:'g',teeth:1,collar:'p',
    ears:(g,hx,hy)=>{u24poly(g,[[hx+.5,hy-2.5],[hx+2.5,hy-3],[hx+3.2,hy+1.5],[hx+1.8,hy+1]],['V','c','d'])},
    tail:(g,by)=>{u24ln(g,19,by-1,22,by-4,'d');u24ln(g,20,by-1,23,by-4,'c')}}),
  wolf:()=>u24beast({fur:U24.wolf,hx:5,mane:1,snout:['3','4','5'],eye:'U',eye2:'u',teeth:1,
    ears:(g,hx,hy)=>{u24poly(g,[[hx,hy-2],[hx+2,hy-6],[hx+3,hy-1.5]],['2','3','4'])},
    tail:(g,by)=>{u24poly(g,[[19,by-2],[22,by-1],[23,by+4],[21.5,by+6],[20,by+2]],['2','3','4','5']);u24p(g,22,by+5,'6')},
    extra:(g,by)=>{for(const[x,y]of[[11,by-5],[15,by-4],[19,by-4],[9,by+7],[21,by+6]])if(g[y]&&g[y][x]==='.')u24p(g,x,y,'6')}}),
  wolfpet:()=>u24beast({fur:['9','a','b','O'],hx:5,mane:1,snout:['a','b','O'],eye:'0',collar:'j',
    ears:(g,hx,hy)=>{u24poly(g,[[hx,hy-2],[hx+2,hy-6],[hx+3,hy-1.5]],['9','a','b'])},
    tail:(g,by)=>{u24poly(g,[[19,by-2],[22,by-1],[23,by+4],[21.5,by+6],[20,by+2]],['9','a','b','O'])}}),
  gull:()=>u24bird({}),
  gullking:()=>u24bird({body:['5','6','7'],wing:['x','8','1'],tip:'x',extra:(g,dy)=>{u24p(g,7,9+dy,'j');u24p(g,5,8+dy,'x');u24p(g,6,8+dy,'x');u24p(g,7,8+dy,'x')}}),
  scout:()=>u24human({build:'thin',top:U24.grey,legs:['x','D','E'],head:'hood',hood:['D','E','F','G'],mask:['E','F','G'],eye:'0',brow:'D',belt:'c',weapon:'knife',
    chest:(g,tx,tw)=>{for(const y of[13,14,15])u24p(g,tx+tw-2,y,'q')}}),
  signal:()=>u24human({build:'thin',top:U24.grey,legs:['x','D','E'],head:'hood',hood:['D','E','F','G'],mask:['E','F','G'],belt:'c',
    off:g=>{u24ell(g,19,16,1.6,1.8,['f','g','h']);u24p(g,19,14,'9')}}),
  brute:()=>u24human({build:'big',top:['V','W','X'],sleeve:U24.skin,legs:['x','D','E'],head:'bald',mask:['8','9','a'],belt:'c',weapon:'club',
    chest:(g,tx,tw)=>{for(let y=12;y<17;y++)u24p(g,12,y,'V');u24p(g,11,12,'m');u24p(g,13,12,'m')}}),
  gnat:()=>u24human({top:['x','1','2','3'],coat:['x','1','2'],legs:['x','8','9'],head:'tricorn',beard:['8','9','a'],sash:'i',weapon:'sabre',belt:'c',
    off:g=>{u24box(g,19,15,3,2,['F','p','q']);u24p(g,19,17,'c');u24p(g,20,17,'c')},chest:(g)=>{u24p(g,9,12,'g');u24p(g,9,14,'g')}}),
  smuggler:()=>u24human({top:['V','W','X','Y'],legs:['x','1','2'],head:'band',beard:['c','d'],belt:'8',weapon:'musket'}),
  harpooner:()=>u24human({top:['1','2','3'],coat:['x','1','2'],legs:['x','1','2'],head:'knit',hat:['i','j','w'],mask:['2','3','4'],weapon:'harpoon',
    off:g=>{u24ell(g,19.5,16,2.4,2,['c','d','e']);u24ell(g,19.5,16,1,0.8,['9','9'])}}),
  medic:()=>u24human({top:['L','M','N','O'],legs:['x','D','E'],head:'hood',hood:['8','9','a'],mask:['N','O','O'],belt:'c',
    chest:(g,tx,tw)=>{u24ln(g,12,12,12,16,'i');u24ln(g,10,14,14,14,'i')},
    off:g=>{u24ell(g,20,14.5,2.8,3.2,['c','d','e']);u24ell(g,20,14.5,1,1.2,['p','q'])}}),
  militia:()=>u24human({top:['d','e','Y'],legs:['V','W','X'],head:'cap',hat:['c','d','e'],belt:'c',weapon:'spear'}),
  fisher:()=>u24human({top:['f','g','h'],sleeve:['f','g','h'],legs:['1','2','3'],head:'knit',hat:['3','4','5'],beard:['d','e'],weapon:'net',belt:'c'}),
  drowned:()=>u24human({skin:U24.pale,top:['s','Z','k'],legs:['x','1','2'],head:'hair',hat:['s','Z','k'],eye:'U',mouth:'1',boots:['x','1','2'],
    extra:g=>{for(const[x,y]of[[8,13],[15,12],[10,16],[14,18],[9,20],[16,21]])u24p(g,x,y,'l');for(const[x,y]of[[7,18],[17,19],[9,9],[15,8]])u24p(g,x,y,'r');u24ln(g,11,12,13,15,'1')}}),
  icedrowned:()=>u24human({skin:U24.ice,top:['3','4','5'],legs:['2','3','4'],head:'hair',hat:['U','u','y'],eye:'S',mouth:'2',boots:['2','3','4'],hands:['U','u','y'],
    extra:g=>{for(const[x,y]of[[6,11],[17,10],[9,13],[15,15],[11,18],[7,16],[18,14]]){u24p(g,x,y,'u');u24p(g,x,y-1,'y')}for(const x of[8,11,14,16])u24p(g,x,0,'U');u24ln(g,9,1,9,0,'U')}}),
  sentinel:()=>u24human({build:'big',skin:U24.stone,top:U24.stone,legs:['D','E','F'],boots:['D','E','F'],head:'helm',hat:['E','F','G','H'],eye:'g',mouth:0,hands:U24.stone,
    extra:g=>{u24ln(g,9,13,11,16,'D');u24ln(g,14,18,15,21,'D');for(const[x,y]of[[7,12],[16,19],[9,22],[17,11]])u24p(g,x,y,'r');u24p(g,8,12,'Z')}}),
  wraith:()=>{const g=u24human({skin:U24.white,top:U24.fog,head:'hood',hood:['3','4','5','6'],float:1,coat:['3','4','5','6'],eye:'x',hands:['5','6','7'],
    extra:g=>{for(let y=5;y<=7;y++){u24p(g,10,y,'x');u24p(g,13,y,'x')}u24p(g,10,6,'U');u24p(g,13,6,'U');for(let x=11;x<=12;x++)u24p(g,x,9,'2')}});return g},
  witch:()=>u24human({skin:['5','6','7'],top:['(','$',')'],coat:['(','$',')','o'],head:'hood',hood:['(','$',')'],float:1,eye:'U',hands:['5','6','7'],weapon:'bell',
    extra:g=>{for(const[x,y]of[[10,9],[11,10],[12,9],[13,10]])u24p(g,x,y,'x');for(const[x,y]of[[4,4],[20,6],[19,20],[3,21],[21,13]])u24p(g,x,y,'U')}}),
  eel:()=>{const g=u24g();for(let y=19;y<24;y++)for(let x=0;x<24;x++)u24p(g,x,y,y===19?(x%5<3?'U':'T'):y<22?'S':'R');
    const C=[[18,20],[19,17],[18,14],[15,12],[12,11],[10,9],[10,6]];for(let i=0;i<C.length-1;i++){const[a,b]=C[i],[c,d]=C[i+1];for(let k=0;k<=4;k++){const x=a+(c-a)*k/4,y=b+(d-b)*k/4;u24ell(g,x,y,2.4,2.4,['s','Z','k','r'])}}
    u24ell(g,8.5,5,3.4,2.6,['s','Z','k','r'],.1);u24box(g,3,5,3,2,['Z','k','r']);u24p(g,3,6,'0');u24p(g,4,7,'7');u24p(g,6,7,'7');u24p(g,8,4,'g');u24p(g,9,4,'0');
    for(const[x,y]of[[12,10],[14,11],[17,13],[18,16]])u24p(g,x,y,'l');for(let x=14;x<22;x+=3)u24p(g,x,19,'u');return g},
  leech:()=>{const g=u24g();for(let x=0;x<24;x++){u24p(g,x,21,x%4?'L':'M');u24p(g,x,22,'Z');u24p(g,x,23,'s')}
    const C=[[19,19],[17,15],[14,13],[10,13],[7,15],[5,18]];for(let i=0;i<C.length-1;i++){const[a,b]=C[i],[c,d]=C[i+1];for(let k=0;k<=4;k++)u24ell(g,a+(c-a)*k/4,b+(d-b)*k/4,2.9,2.9,['x','s','Z','k'])}
    for(let i=0;i<5;i++)u24p(g,8+i*2.4,12+(i===0||i===4?1.5:0),'k');u24ell(g,4.5,19.5,2.4,2,['i','j','j']);u24p(g,4,20,'x');u24p(g,5,19,'x');return g},
  shark:()=>{const g=u24g();for(let y=15;y<24;y++)for(let x=0;x<24;x++)u24p(g,x,y,y===15?(x%6<4?'U':'T'):y<19?'S':'R');
    u24ell(g,11,14,9.5,4,['F','G','H','q']);u24poly(g,[[9,11],[13,2],[16,11]],['E','F','G','H']);u24poly(g,[[19,12],[23,7],[22,13],[23,18],[19,16]],['E','F','G']);
    for(let x=3;x<16;x++)u24p(g,x,16,x<6?'q':'7');u24p(g,4,12,'0');u24p(g,5,12,'x');for(const x of[7,8,9])u24p(g,x,13,'E');u24ln(g,2,15,6,16,'x');u24p(g,3,15,'7');u24p(g,5,16,'7');
    for(let y=15;y<17;y++)for(let x=0;x<24;x++)if(g[y][x]==='.')u24p(g,x,y,'T');for(let x=1;x<22;x+=4)u24p(g,x,17,'u');return g},
  toad:()=>{const g=u24g();u24ell(g,12,15,9.4,6.6,U24.toad);u24ell(g,12,18.5,6,3,['l','r','O'],.2);
    for(const sx of[6,18]){u24ell(g,sx,9.5,2.6,2.6,U24.toad,.15);u24p(g,sx,9,'g');u24p(g,sx+(sx<12?-1:1),9,'g');u24p(g,sx,10,'0')}
    u24ln(g,6,14,18,14,'s');u24ln(g,7,13,17,13,'s');for(let x=8;x<=16;x++)u24p(g,x,14,'s');u24p(g,7,14,'t');u24p(g,17,14,'t');
    for(const[x,y]of[[9,11],[15,11],[5,15],[19,15],[12,10],[8,17],[16,17]])u24p(g,x,y,'f');
    for(const sx of[3,21]){u24box(g,sx-2,20,4,2,U24.toad);u24p(g,sx-2,22,'Z');u24p(g,sx,22,'Z');u24p(g,sx+1,22,'Z')}return g},
  urchin:()=>{const g=u24g();for(let i=0;i<20;i++){const an=i/20*6.283,r1=7,r2=11+(i%2)*.6;u24ln(g,12+Math.cos(an)*r1,13+Math.sin(an)*r1*.85,12+Math.cos(an)*r2,13+Math.sin(an)*r2*.85,i%3?'$':'(')}
    u24ell(g,12,13,7.6,6.6,['x','(','$',')']);for(const[x,y]of[[9,10],[13,9],[15,12],[10,14],[13,15]])u24p(g,x,y,'o');u24p(g,8,9,')');u24p(g,9,8,')');return g},
  heart:()=>{const g=u24g();for(let y=0;y<24;y++)for(let x=0;x<24;x++){const dx=(x+.5-12)/11,dy=(y+.5-12)/11,r=Math.hypot(dx,dy);if(r>1)continue;const an=Math.atan2(dy,dx)+r*5.2,w=.5+.5*Math.sin(an*3);
    u24p(g,x,y,r<.16?'y':r<.28?'u':u24sh(['x','A','B','C','3','5'],(1-r)*.75+w*.35+(u24bay(x,y)-.5)*.2))}return g},
  bigcrab:()=>{const R=SPR24.crab.map(r=>r.split(''));const m={j:'i',i:'t'};const g=R.map(r=>r.map(c=>m[c]||c));for(const[x,y]of[[8,11],[13,12],[16,13],[6,14],[11,15]])u24p(g,x,y,'6');u24p(g,10,7,'g');u24p(g,13,7,'g');return g},
  crabking:()=>{const R=SPR24.crab.map(r=>r.split(''));const m={j:'v',i:'t'};const g=R.map(r=>r.map(c=>m[c]||c));
    for(const[x,y]of[[7,9],[10,8],[13,8],[16,9],[19,10],[4,10]]){u24p(g,x,y,'H');u24p(g,x,y-1,'G')}for(const[x,y]of[[8,12],[13,13],[16,12],[6,14],[11,15],[18,14]])u24p(g,x,y,'u');
    for(const[x,y]of[[1,4],[22,4],[2,3],[21,3]])u24p(g,x,y,'w');u24p(g,10,8,'h');u24p(g,13,8,'h');return g},
};
for(const id in U24B)try{SPR24[id]=u24rows(U24B[id]())}catch(e){}

/* ---- герой: усе спорядження видно на фігурі ---- */
function u24hero(eq){eq=eq||{};const a=eq.armor,o={top:['2','3','4'],sleeve:['2','3','4'],legs:['x','1','2'],head:'cap',hat:['x','1','2'],belt:'c',weapon:eq.weapon};
  if(a==='cloak'){Object.assign(o,{head:'hood',hood:['x','1','2','3'],top:['1','2','3'],belt:0})}
  else if(a==='jacket'){Object.assign(o,{top:U24.leather,sleeve:U24.leather,chest:(g,tx,tw)=>{u24p(g,11,11,'Y');u24p(g,12,11,'Y');u24p(g,10,11,'X');u24p(g,13,11,'X');for(const y of[13,15])u24p(g,12,y,'g');u24ln(g,12,12,12,16,'V')}})}
  else if(a==='bracers'){Object.assign(o,{extra0:1})}
  else if(a==='mail'){Object.assign(o,{top:['E','F','G','H'],chest:(g,tx,tw)=>{for(let y=11;y<19;y++)for(let x=tx;x<tx+tw;x++)if((x+y)%2===0)u24p(g,x,y,x<tx+tw/2?'p':'G')}})}
  else if(a==='steelmail'){Object.assign(o,{top:U24.metal,sleeve:['E','F','p'],head:'helm',hat:U24.metal,shoulder:U24.metal,chest:(g,tx,tw)=>{u24ln(g,12,12,12,17,'7');u24p(g,10,12,'7');u24p(g,9,13,'q')}})}
  const R=eq.ranged;
  if(R==='crossbow')o.back=g=>{u24ln(g,14,17,20,7,'d');u24ln(g,15,17,21,7,'c');u24ln(g,17,5,23,9,'p');u24ln(g,17,6,22,10,'F');u24ln(g,17,6,23,9,'6')};
  o.front=g=>{
    if(a==='cloak'){u24poly(g,[[6,11],[18,11],[20,21],[12,19.5],[4,21]],['x','1','2','3']);for(let y=12;y<20;y++)u24p(g,12,y,'x');u24p(g,11,11,'f');u24p(g,12,11,'f');u24box(g,4,17,2,2,U24.skin,.1);if(eq.light)u24box(g,18,17,2,2,U24.skin,.1)}
    if(a==='bracers')for(const x of[5,17]){u24box(g,x,13,2,3,['F','p','q']);u24p(g,x,14,'c');u24p(g,x+1,14,'c')}
    if(R==='sling'){u24ln(g,15,17,16,20,'b');u24p(g,14,18,'a');u24ell(g,16,19.5,1.2,1.2,['9','a','b'])}
    if(R==='pistol'){u24box(g,14,17,2,3,['V','W']);u24p(g,14,16,'c');u24p(g,15,16,'d');u24p(g,15,20,'F')}
    const C=eq.charm;
    if(C==='amulet'){u24ln(g,10,11,12,13,'9');u24ln(g,14,11,12,13,'9');u24p(g,12,14,'g');u24p(g,12,13,'f')}
    else if(C==='shell'){u24ln(g,10,11,12,13,'a');u24ln(g,14,11,12,13,'a');u24p(g,12,14,'u');u24p(g,11,14,'6');u24p(g,13,14,'6')}
    else if(C==='spyglass'){u24ln(g,8,17,11,17,'f');u24p(g,8,17,'g');u24p(g,11,17,'e')}
    else if(C==='windcharm'){u24ln(g,10,11,12,13,'9');u24ln(g,14,11,12,13,'9');u24p(g,12,14,'U');u24p(g,12,15,'6');u24p(g,13,15,'u')}
    const L=eq.light;
    if(L==='lamp'){u24p(g,19,16,'9');u24ell(g,19.5,19,1.5,1.8,['f','g','h']);u24p(g,19,17,'9');u24p(g,20,17,'9')}
    else if(L==='storm'){u24ln(g,19,15,20,15,'9');u24box(g,18,16,4,5,['F','p','q']);u24box(g,19,17,2,3,['g','h','h']);u24ln(g,18,21,21,21,'8')}};
  return u24human(o)}
