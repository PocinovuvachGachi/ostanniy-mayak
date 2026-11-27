/* ============ КОЛЕКЦІЯ ХРАНИТЕЛЯ ============
   Дивини (OD) — речі з історією; тепер їх видно на полиці в нижній залі маяка, і вони складаються в набори.
   Набір дає трохи сили героєві (частина «необов'язкових» 40 % прогресії). Без «N з M»: на полиці видно лише знайдене
   й одне-два порожні місця — натяк, що щось ще є. collFind(джерело) — випадкова ще не знайдена дивина з цього джерела. */
Object.assign(OD,{
  seaglass:{n:'Морське скло',d:'Хвилі сточили гострі краї. На світлі в зеленому склі проступають бульбашки, наче в застиглій воді.',xp:0},
  amberbit:{n:'Шматочок бурштину',d:'Між камінцями він здавався звичайною смолою. Біля вогню всередині видно тонку хвойну голку.',xp:0},
  oldhook:{n:'Старий гачок',d:'Кінчик притупився, зате вушко досі міцне. Хтось обв’язував його волосінню так щільно, що на міді лишився слід.',xp:0},
  woodhorse:{n:'Дерев’яний коник',d:'Одне вухо сколоте, а на боці ще видно слід червоної фарби. Знизу хтось видряпав коліщатко.',xp:0,
    gift:{label:'Подарувати Петрикові',ready:()=>!!s.f.horpyna,record:'Коник лишився в Петрика. Тепер він живе на підвіконні біля Горпининих сітей.',
      react:()=>dlg({k:'story',title:'Коник для Петрика',img:{t:'icon',id:ODI.woodhorse},
        body:'<p>Петрик оглядає сколоте вухо й усміхається. «То від вітру. Він дуже швидкий». Він ставить коника на підвіконня мордою до моря.</p>'})}},
  medallion:{n:'Мідний медальйон',d:'Море затерло візерунок. Під зеленою патиною ще видно дві тонкі риски. Вушко ціле, а шнурка немає.'},
  spiral:{n:'Спіральна мушля',d:'Закручена туго, як мотузка на кнехті. Таких біля маяка не буває — її принесло здалеку.',src:'pool',set:'shells'},
  pearl:{n:'Перламутрова стулка',d:'Усередині переливається, як олія на воді. Друга половинка десь на дні.',src:'pool',set:'shells'},
  ear:{n:'Мушля-вушко',d:'Прикладеш до вуха — чути не море, а далекий дзвін.',src:'pool',set:'shells'},
  letter1:{doc:true,n:'Лист у пляшці',d:'«Мамо, ми зимуємо на Причалі. Вогонь на маяку погас, і капітан каже, що з півночі йде туман, який не розвіює вітер…» Далі чорнило розпливлося.',src:'flot'},
  holecoin:{n:'Монета з дірочкою',d:'Карбування стерте. Хтось носив її на шиї — від утоплення, кажуть.',src:'flot'},
  logpage:{doc:true,n:'Сторінка суднового журналу',d:'«…туман прийшов не з моря, а з півночі, проти вітру. Боцман бачив у ньому людей. Ми звернули до маяка, але маяк мовчав…»',src:'rats'}});
Object.assign(ODI,{seaglass:'o_glass',amberbit:'o_amber',oldhook:'o_hook',woodhorse:'o_horse',
  medallion:'o_medallion',spiral:'o_spiral',pearl:'shell',ear:'o_ear',letter1:'o_letter',holecoin:'coin',logpage:'lore'});
Object.assign(ICO,{
  o_glass:['............','............','.....kll....','...kl666k...','..kl6776lk..','..k5666llk..','...k5lllk...','....kkkk....','............','............','............','............'],
  o_amber:['............','............','.....ff.....','...fgggf....','..fghgggf...','..fggcggf...','..fgccggf...','...fggff....','....fff.....','............','............','............'],
  o_hook:['............','.......ee...','......e..e..','.......ee...','........d...','........d...','...g....d...','...ed..ee...','....eeed....','............','............','............'],
  o_horse:['............','....c.......','...ece......','..eede......','.eeede......','..ccdeeee...','....eeeeec..','....ejejecc.','....c..ce...','....c..c....','...ccc.cc...','............'],
  o_medallion:['............','.....kk.....','....k..k....','.....dd.....','...deeed....','..deblled...','..debleed...','..debeled...','...deeed....','....ddd.....','............','............'],
  o_spiral:['............','............','....nnn.....','..nmmmmn....','..nmnmmn....','.nmmnnmn....','.nmmmmmn....','..nmmnn.....','...nn.......','............','............','............'],
  o_ear:['............','............','......bb....','....bb66b...','...b667b....','..b667b.....','..b66b......','...bb.......','............','............','............','............'],
  o_letter:['............','.....cd.....','.....cd.....','.....45.....','....4665....','...46h665...','...46h665...','...456655...','....4444....','............','............','............'],
  o_plate:['............','............','............','.dccddccd...','.dggdgdgd...','.dggdgdgd...','.dccddccd...','...c...c....','............','............','............','............'],
  o_clapper:['............','.....kk.....','....k..k....','.....kd.....','.....ke.....','.....ke.....','.....kd.....','....kke.....','...kkeed....','...kkdd.....','............','............'],
  o_ladle:['............','.........e..','........de..','.......de...','......de....','..ceeede....','.cdeeec.....','.cdddc......','..ccc.......','............','............','............']
});
const OSET={shells:{n:'Мушлі відпливу',gain:()=>{s.h.pts=(s.h.pts||0)+1},gt:'+1 очко характеристик'}};
function collFind(src){const L=Object.keys(OD).filter(k=>OD[k].src===src&&!s.odd[k]);if(!L.length)return false;const id=L[Math.floor(Math.random()*L.length)];odd(id);setCheck(id);return true}
function setCheck(id){const st=OD[id]&&OD[id].set;if(!st||(s.oset||{})[st])return;const all=Object.keys(OD).filter(k=>OD[k].set===st);if(!all.every(k=>s.odd[k]))return;
  s.oset=s.oset||{};s.oset[st]=1;OSET[st].gain();dlg({k:'find',title:`Набір: ${OSET[st].n}`,img:{t:'icon',id:ODI[id]},body:`<p>Речі лягли на полицю поруч — і разом вони щось розповідають. Здається, ти став уважнішим до світу.</p>`,gains:[OSET[st].gt]});if(OSET[st].after)OSET[st].after()}
// Придатна ручна дія дає одну спробу після сюжетних перевірок.
const SHORE_FINDS={
  gather:{items:{seaglass:.015,woodhorse:.008},ready:id=>s.b.hearth&&s.c.gather>=(id==='woodhorse'?95:24),step:.001,max:.055},
  scrapw:{items:{oldhook:.018},ready:()=>s.f.rod&&s.c.fish>=6&&s.c.scrap>=18,step:.001,max:.055},
  pool:{items:{amberbit:.035},ready:()=>s.f.tideSeen&&s.c.pool>=18&&poolFindReady(),step:.002,max:.065}
};
// Калюжі й вологий пісок ділять одну ручну колекційну знахідку за морський цикл. Дарунки Бурштина окремі.
const poolFindReady=()=>tideLow()&&(s.poolFindCyc==null||tideCyc()>s.poolFindCyc);
function markPoolFind(){s.poolFindCyc=tideCyc();save()}
let shoreFindPending=null;
function queueShoreFind(source){
  if(SHORE_FINDS[source]&&atShore()&&!s.dlg.length&&!s.tutPending.some(tutReady)){
    shoreFindPending={source,log:s.log[0],cycle:source==='pool'?tideCyc():null};
  }
}
function shoreFindTick(){
  const pending=shoreFindPending;
  shoreFindPending=null;
  if(!pending||!atShore()||s.cb||s.raid||s.dlg.length||s.tutPending.some(tutReady))return;
  if(s.log[0]!==pending.log&&['story','find','fight'].includes(s.log[0]?.t))return;
  const source=pending.source,cfg=SHORE_FINDS[source];
  if(source==='pool'&&pending.cycle!==tideCyc())return;
  const id=Object.keys(cfg.items).find(k=>!s.odd[k]);
  if(!id||!cfg.ready(id))return;
  const base=cfg.items[id],misses=s.shoreFindMiss[source]||0;
  if(Math.random()<Math.min(cfg.max,base+misses*cfg.step)){
    s.shoreFindMiss[source]=0;
    odd(id);if(source==='pool')markPoolFind();else save();
  }else s.shoreFindMiss[source]=Math.min(misses+1,Math.ceil((cfg.max-base)/cfg.step));
}

function readOddDocument(id){
  if(!OD[id]?.doc||!s.odd[id]||s.oddRead[id])return;
  s.oddRead[id]=1;dirty=1;
}
const oddDocumentIds=()=>Object.keys(OD).filter(id=>OD[id].doc&&s.odd[id]&&s.oddRead[id]);

/* Полиця в нижній залі */
let shelfSelected='';
const shelfIcon=id=>s.oddFate[id]?'lore':ODI[id];
const shelfItems=()=>Object.keys(s.odd).filter(id=>s.odd[id]&&OD[id]);

function shelf3(ids){
  const cols=ids.length>6?4:3,rows=Math.ceil(ids.length/cols);
  const w=cols*12+4,h=rows*14+2,b=pbuf(w,h);
  prect(b,0,0,w,h,'V');prect(b,2,1,w-4,h-2,'x');
  for(let row=0;row<rows;row++){
    prect(b,1,row*14+13,w-2,3,'W');prect(b,1,row*14+13,w-2,1,'Y');
  }
  ids.forEach((id,index)=>pblit(b,(ICO[shelfIcon(id)]||ICO.crate),2+(index%cols)*12,1+Math.floor(index/cols)*14));
  return b;
}
globalThis.shelf3=HI(shelf3);
function shelfHS(W,H){
  const found=shelfItems();
  if(!s.b.hearth||!found.length)return'';
  const ids=found.slice(-12),[x,y,w]=twBox('hall');
  const art=obURL('shelf3:'+ids.map(id=>shelfIcon(id)).join(','),()=>shelf3(ids));
  return ob('cl:shelf','bpop','cl:shelf',art,x+w-art[2]-5,y+54-art[3],W,H,'Полиця хранителя','<b>Полиця хранителя</b><br>Дивини, які дало море.',{pulse:(s.oddNew||0)>0?1:0,z:290});
}
function shelfPopHTML(){
  s.oddNew=0;
  const got=shelfItems(),id=shelfSelected,item=s.odd[id]&&OD[id];
  let content;
  if(item){
    const gift=item.gift,fate=s.oddFate[id]&&gift?.record;
    const unread=item.doc&&!s.oddRead[id];
    const show=item.show?.ready()?btn(item.show.label,item.show.act):'';
    const give=gift?.ready()&&!fate?btn(gift.label,'shelfGive',id):'';
    const read=unread?btn('Прочитати','shelfRead',id):'';
    content=`<div class="shelf-item">${pimg(icoURL(shelfIcon(id)),56,56,'','')}
      <div><h3>${item.n}</h3><p>${fate||(unread?'Можна розгорнути й прочитати.':item.d)}</p></div></div>
      <div class="act">${read}${show}${give}${btn('До полиці','shelfInspect','',{cls:'toggle'})}</div>`;
  }else{
    const sets=Object.keys(OSET).filter(st=>got.some(k=>OD[k].set===st));
    const tiles=got.map(k=>`<button type="button" class="shelf-slot" data-a="shelfInspect" data-i="${k}">
      ${pimg(icoURL(shelfIcon(k)),36,36,'','')}<span>${OD[k].n}</span></button>`).join('');
    content=`<div class="shelf-gallery"><div class="shelf-grid">${tiles}<i class="shelf-space" aria-hidden="true"></i></div>
      ${sets.map(st=>(s.oset||{})[st]?`<p class="m">✓ ${OSET[st].n}: набір зібрано (${OSET[st].gt}).</p>`:`<p class="hint">${OSET[st].n}: здається, на полиці бракує ще чогось схожого.</p>`).join('')}</div>`;
  }
  return `<div class="bpop wide shelf-pop" role="dialog" aria-label="Полиця хранителя"><div class="bph"><b>Полиця хранителя</b><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>${content}</div>`;
}
