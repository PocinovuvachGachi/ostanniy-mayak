/* ============ ЕТАП I: ІНСТРУМЕНТИ Й ПЕРШИЙ СЕКРЕТ ============
   Граблі — перший інструмент, що змінює берег: уламок віддає більше брухту.
   Три камені з вибитими літерами: перший — на піску біля маяка, другий виходить із води на відпливі,
   третій знаходить Петрик. Разом вони кажуть «ПІД ВОГНЕМ» — під вогнищем у нижній залі сховок Остапа. */
IT.rake={n:'Граблі',ic:'E',d:'Розбирати уламок легше: +1 брухту за кожен раз.'};ICO.rake=['.........ddd','........d...','.......d....','......d.....','.....d......','....d.......','...d........','..d.........','.aaaaaaaa...','.a.a.a.a....','.a.a.a.a....','............'];
RC.push({id:'rake',src:'Брухт з уламка сиплеться крізь пальці. Граблі допомогли б.',out:'rake',c:{wood:10,scrap:6},req:()=>!!(s.floors.work&&s.f.wreck&&(noGap()||(s.c.scrap||0)>=8||(s.rcSeen||{}).rake))});
const RUNE={a:{t:'«ПІД»',d:'Плаский камінь на піску, на ньому глибоко вибито: «ПІД». Вибито давно — краї обточила вода.',ok:()=>!!s.f.crab1},
  b:{t:'«…ВО…»',d:'На відпливі з води виступив камінь, обліплений мідіями. Під ними — літери: «ВО». Далі відбито.',ok:()=>!!s.f.rats&&tideLow()},
  c:{t:'«…ГНЕМ»',d:'Петрик тягне тебе за рукав до підніжжя маяка: між каменями фундаменту — плита з написом «ГНЕМ».',ok:()=>!!s.f.horpyna}};
const runesAll=()=>Object.keys(RUNE).every(k=>(s.runes||{})[k]);
function runeRead(k){const R=RUNE[k];if(!R||!R.ok()||(s.runes||{})[k])return;s.runes=s.runes||{};s.runes[k]=1;xp(5);
  if(runesAll())dlg({k:'find',title:'Три камені',img:{t:'scene',id:'shore'},body:`<p>Слова складаються самі: <b>«ПІД ВОГНЕМ»</b>. Вогонь у маяку один — у нижній залі.</p>`,gains:['Сховок десь під вогнищем']});
  else say(`Камінь із написом ${R.t}. ${Object.keys(s.runes).length>1?'Слова складаються, але ще не до кінця.':'Чи є ще такі?'}`,'find')}
function cacheOpen(){if(!runesAll()||s.f.cache)return;s.f.cache=1;s.h.sp=(s.h.sp||0)+1;xp(20);odd('keeperkey');book('keeper');
  dlg({k:'find',title:'Сховок під вогнищем',img:{t:'icon',id:'key'},body:`<p>Під плитою біля вогнища — залізна скринька. Усередині ключ на шкіряному шнурку і зошит Остапа: як читати погоду, як тримати жар, як говорити з людьми, що приходять із моря.</p>`,gains:['+1 очко умінь','Дивина й книга']})}
Object.assign(OD,{keeperkey:{n:'Ключ хранителя',d:'Важкий, з вибитим маяком на голівці. Від якого він замка — Остап не написав.'}});ODI.keeperkey='key';
if(typeof BK!=='undefined')BK.keeper='Зошит хранителя';
function rune3(){const b=pbuf(16,10);polyFill(b,[[1,9],[2,3],[6,1],[12,2],[15,6],[14,9]],(x,y)=>pset(b,x,y,y<4?'G':x>11?'E':'F'));for(const x of[5,8,11])prect(b,x,4,1,3,'D');return b}
globalThis.rune3=HI(rune3);
function shoreRuneHS(W,H){let h='';const P={a:[244,96],b:[84,70],c:[34,100]};for(const k in RUNE){if((s.runes||{})[k]||!RUNE[k].ok())continue;const[x,y]=P[k];
    h+=ob('rune:'+k,'rune',k,obURL('rune3',rune3),x,y,W,H,'Камінь із написом',`<b>Камінь</b><br>На ньому щось вибито.`,{pulse:1})}return h}
function hallCacheHS(W,H){if(!runesAll()||s.f.cache||!s.b.hearth)return'';const[x,y,w,h]=twBox('hall');
  return ob('cl:cache','cache','',obURL('rune3',rune3),x+w/2-20,y+h-16,W,H,'Плита під вогнищем','<b>Плита біля вогнища</b><br>«Під вогнем».',{pulse:1,always:1,z:291})}

/* Сушарня — перша обробка улову, до автоматичної коптильні. Одна партія, без псування. */
const DRYC={wood:12,scrap:2},DRYF=4,DRYT=60;
const dryBusy=()=>!!s.dryUntil;
const dryReady=()=>dryBusy()&&(s.play||0)>=s.dryUntil;
const drySpace=()=>s.r.prov+1<=capOf('prov');
const drySecs=()=>Math.max(0,Math.ceil((s.dryUntil||0)-(s.play||0)));
function dryTick(){
  if(dryReady()&&!s.f.dryAlert){s.f.dryAlert=1;dirty=1}
  if(!s.f.dryPlan&&!s.f.gullrack&&!s.b.smoke&&s.f.rod&&s.f.crab1&&s.floors.work&&(s.c.fish||0)>=8&&novCan()){
    s.f.dryPlan=1;novMark();dlg({k:'find',title:'Риба на вітрі',body:'<p>Улов уже не влазить на долоні. На березі дме рівний вітер — можна натягнути линву між двома жердинами й сушити рибу.</p>',gains:['Відкрилася можливість збудувати сушарню']})}}
function dryBuild(){if(!s.f.dryPlan||s.f.dryRack||!afford(DRYC))return;pay(DRYC);s.f.dryRack=1;tutOffer('dryrack');dirty=1}
function dryLoad(){if(!s.f.dryRack||dryBusy()||s.r.fish<DRYF)return;pay({fish:DRYF});s.dryUntil=(s.play||0)+DRYT;s.f.dryHung=1;s.f.dryAlert=0;dirty=1}
function dryTake(){if(!dryReady()||!drySpace())return;s.dryUntil=0;s.f.dryAlert=0;add('prov',1);s.f.dryMade=1;dirty=1}
function dryRack3(stage){const b=pbuf(36,24);for(const x of[4,30]){prect(b,x,3,2,21,'V');prect(b,x,3,1,21,'Y');pline(b,x-3,23,x+5,23,'D')}
  pline(b,5,5,31,5,'e');pline(b,5,6,31,6,'W');
  if(stage)for(const x of[10,16,22,28]){pline(b,x,6,x,9,'D');prect(b,x-1,10,3,7,stage===2?'e':'5');pset(b,x-1,10,'7');pset(b,x,16,stage===2?'d':'4');pline(b,x,17,x-2,20,'V');pline(b,x,17,x+2,20,'V')}
  return b}
const dryRackArt=HI(dryRack3);
function dryRackHS(W,H){if(!s.f.dryPlan&&!s.f.dryRack)return'';const busy=dryBusy(),ready=dryReady(),stage=ready?2:busy?1:0;
  const a=!s.f.dryRack?'drybuild':ready?'drytake':busy?'hsgo':'dryload',i=busy&&!ready?'dryrack':'';
  const lab=!s.f.dryRack?'Збудувати сушарню':ready?'Зняти сушену рибу':busy?'Риба сушиться':'Розвісити рибу';
  const tip=!s.f.dryRack?'Ціна: '+costTxt(DRYC):ready?'Готова провізія.':busy?'Риба сохне на вітрі.':'Розвісь '+DRYF+' риби.';
  return ob('dryrack',a,i,obURL('dryrack3:'+stage,()=>dryRackArt(stage)),154,92,W,H,lab,'<b>Сушарня</b><br>'+tip,{pulse:!busy||ready,always:!busy||ready,ok:!s.f.dryRack?afford(DRYC):ready?drySpace():busy||s.r.fish>=DRYF})}
function rDryRack(){if(!s.f.dryPlan&&!s.f.dryRack)return'';if(!s.f.dryRack)return '<section id="sec-dryrack"><h2>Сушарня</h2><p class="m">Жердини та линва для сушіння улову.</p>'+btn('Збудувати сушарню','drybuild','',{ok:()=>afford(DRYC)})+' <span class="ccs">'+costTxt(DRYC)+'</span></section>';
  return '<section id="sec-dryrack"><h2>Сушарня</h2>'+ (dryReady()?'<p>Риба висохла.</p>'+btn('Зняти провізію','drytake','',{ok:drySpace}):dryBusy()?'<p>Риба сохне: '+V(drySecs)+' с.</p>':'<p class="m">4 риби → 1 провізія. Сушіння триває хвилину.</p>'+btn('Розвісити рибу','dryload','',{ok:()=>s.r.fish>=DRYF}))+'</section>'}
