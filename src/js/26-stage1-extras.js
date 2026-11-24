/* ============ ЕТАП I: ІНСТРУМЕНТИ Й ПЕРШИЙ СЕКРЕТ ============
   Граблі — перший інструмент, що змінює берег: уламок віддає більше брухту.
   Три камені з вибитими літерами: перший — на піску біля маяка, другий виходить із води на відпливі,
   третій знаходить Петрик. Разом вони кажуть «ПІД ВОГНЕМ» — під вогнищем у нижній залі сховок Остапа. */
IT.rake={n:'Граблі',ic:'E',d:'Розбирати уламок легше: +1 брухту за кожен раз.'};ICO.rake=ICO.rod;
RC.push({id:'rake',src:'Брухт з уламка сиплеться крізь пальці. Граблі допомогли б.',out:'rake',c:{wood:12,scrap:12,iron:3},req:()=>!!(s.floors.work&&s.f.wreck)});
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
