/* ============ КОЛЕКЦІЯ ХРАНИТЕЛЯ ============
   Дивини (OD) — речі з історією; тепер їх видно на полиці в нижній залі маяка, і вони складаються в набори.
   Набір дає трохи сили героєві (частина «необов'язкових» 40 % прогресії). Без «N з M»: на полиці видно лише знайдене
   й одне-два порожні місця — натяк, що щось ще є. collFind(джерело) — випадкова ще не знайдена дивина з цього джерела. */
Object.assign(OD,{
  spiral:{n:'Спіральна мушля',d:'Закручена туго, як мотузка на кнехті. Таких біля маяка не буває — її принесло здалеку.',src:'pool',set:'shells'},
  pearl:{n:'Перламутрова стулка',d:'Усередині переливається, як олія на воді. Друга половинка десь на дні.',src:'pool',set:'shells'},
  ear:{n:'Мушля-вушко',d:'Прикладеш до вуха — чути не море, а далекий дзвін.',src:'pool',set:'shells'},
  letter1:{n:'Лист у пляшці',d:'«Мамо, ми зимуємо на Причалі. Вогонь на маяку погас, і капітан каже, що з півночі йде туман, який не розвіює вітер…» Далі чорнило розпливлося.',src:'flot'},
  holecoin:{n:'Монета з дірочкою',d:'Карбування стерте. Хтось носив її на шиї — від утоплення, кажуть.',src:'flot'},
  logpage:{n:'Сторінка суднового журналу',d:'«…туман прийшов не з моря, а з півночі, проти вітру. Боцман бачив у ньому людей. Ми звернули до маяка, але маяк мовчав…»',src:'rats'}});
Object.assign(ODI,{spiral:'shell',pearl:'shell',ear:'shell',letter1:'lore',holecoin:'coin',logpage:'lore'});
const OSET={shells:{n:'Мушлі відпливу',gain:()=>{s.h.pts=(s.h.pts||0)+1},gt:'+1 очко характеристик'}};
function collFind(src){const L=Object.keys(OD).filter(k=>OD[k].src===src&&!s.odd[k]);if(!L.length)return false;const id=L[Math.floor(Math.random()*L.length)];odd(id);setCheck(id);return true}
function setCheck(id){const st=OD[id]&&OD[id].set;if(!st||(s.oset||{})[st])return;const all=Object.keys(OD).filter(k=>OD[k].set===st);if(!all.every(k=>s.odd[k]))return;
  s.oset=s.oset||{};s.oset[st]=1;OSET[st].gain();dlg({k:'find',title:`Набір: ${OSET[st].n}`,img:{t:'icon',id:ODI[id]},body:`<p>Речі лягли на полицю поруч — і разом вони щось розповідають. Здається, ти став уважнішим до світу.</p>`,gains:[OSET[st].gt]});if(OSET[st].after)OSET[st].after()}
/* Полиця в нижній залі */
function shelf3(n){const b=pbuf(40,26);prect(b,0,0,40,26,'V');prect(b,1,1,38,24,'x');for(const y of[11,24]){prect(b,1,y,38,2,'W');prect(b,1,y,38,1,'Y')}
  for(let k=0;k<Math.min(8,n);k++){const x=3+(k%4)*9,y=k<4?4:17;prect(b,x,y+3,5,4,['O','N','e','H','6','T','b','g'][k%8]);prect(b,x+1,y+2,3,1,'u')}return b}
globalThis.shelf3=HI(shelf3);
function shelfHS(W,H){const n=Object.keys(s.odd).length;if(!s.b.hearth||!n)return'';const[x,y,w,h]=twBox('hall');
  return ob('cl:shelf','bpop','cl:shelf',obURL('shelf3:'+Math.min(8,n),()=>shelf3(n)),x+w-48,y+14,W,H,'Полиця хранителя','<b>Полиця хранителя</b><br>Дивини, які дало море.',{pulse:(s.oddNew||0)>0?1:0})}
function shelfPopHTML(){s.oddNew=0;const got=Object.keys(OD).filter(k=>s.odd[k]),sets=Object.keys(OSET).filter(st=>got.some(k=>OD[k].set===st));
  return`<div class="bpop wide" role="dialog" aria-label="Полиця хранителя"><div class="bph"><b>Полиця хранителя</b><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>
  <div class="ogrid">${got.map(k=>`<div class="ocard">${pimg(icoURL(ODI[k]),40,40,'',OD[k].n)}<b class="itm">${OD[k].n}</b><br><span class="m">${OD[k].d}</span></div>`).join('')}<div class="ocard empty" aria-hidden="true"></div><div class="ocard empty" aria-hidden="true"></div></div>
  ${sets.map(st=>(s.oset||{})[st]?`<p class="m">✓ ${OSET[st].n}: набір зібрано (${OSET[st].gt}).</p>`:`<p class="hint">${OSET[st].n}: здається, на полиці бракує ще чогось схожого.</p>`).join('')}</div>`}
