/* ============ ЇЖА: ЛІКУВАННЯ, КОМОРА Й КУХНЯ ============
   - Біля вогнища здоров'я вертається лише повільно (до повного — близько чверті години); швидко лікує їжа:
     риба (+8), провізія (+15), страви. «Поїсти» з'їдає рівно стільки, скільки бракує (спершу рибу).
   - Комора: сирої риби влазить мало (кошик, згодом льох), провізії — більше. Що не влазить — не ловиться;
     наявне не псується й не зникає. Причина коптити й будувати льох.
   - Кухня Зиновія: казан біля вогнища в нижній залі. Страви лікують більше й дають силу:
     тепло (здоров'я вертається втричі швидше) чи ситість (+1 очко дії на початку кількох боїв). */
const FOODHP={fish:8,prov:15};
const capOf=k=>k==='fish'?40+60*(s.b.cellar||0):k==='prov'?100+150*(s.b.cellar||0):Infinity;
function regenRate(){const hn=s.b.hearth||0;return(0.04+0.01*Math.min(6,hn))*(Date.now()<((s.h.buf||{}).warm||0)?3:1)}
function eatFull(){let g=0,ate={};while(s.h.hp<maxHP()&&g++<200){const k=s.r.fish>=1?'fish':s.r.prov>=1?'prov':'';if(!k)break;
    s.r[k]--;ate[k]=(ate[k]||0)+1;s.h.hp=Math.min(maxHP(),s.h.hp+FOODHP[k])}
  if(Object.keys(ate).length)say(`Ти їси біля вогню: ${costTxt(ate)}. Сили повертаються.`,'info');else say('Їсти нічого: ні риби, ні провізії.','info');dirty=1}
/* Комора — будівля з рівнями */
BD.push({id:'cellar',n:'Комора',d:()=>`Риби влазить ${capOf('fish')} (+60 за рівень), провізії — ${capOf('prov')} (+150 за рівень). Що не влазить — не ловиться, наявне не псується.`,base:{wood:30,scrap:10},mult:1.6,show:()=>!!s.f.capHit||!!s.b.cellar});
BANC.cellar=[182,228];
BLD3.cellar=HI(function(g){const w=[26,32,40][g-1],h=[13,15,18][g-1],b=pbuf(w+4,h+2);
  polyFill(b,[[0,h+1],[3,h*.35],[w*.5,0],[w-2,h*.3],[w+3,h+1]],(x,y)=>pset(b,x,y,vnz(EXX,EXY,3,7)>.62?'r':y<h*.4?'Z':'s'));
  hiRect(b,w*.5-5,h*.35,10,h*.65+1,(i,j,x,y)=>{const u=x-(w*.5-5);if(u<1||u>9)return'E';if(y<h*.35+1.2)return'F';return u<5?'W':'X'});prect(b,w*.5-.5,h*.45,1,h*.55,'V');pset(b,w*.5+2.5,h*.7,'g');
  if(g>=2)for(const[x,c]of[[3,'X'],[w-4,'W']]){prect(b,x,h-4,4,5,c);prect(b,x,h-3,4,1,'D');prect(b,x,h,4,1,'D')}
  if(g>=3){prect(b,w*.5-9,h*.25,2,h*.8,'F');prect(b,w*.5+7,h*.25,2,h*.8,'F');prect(b,w*.5-9,h*.2,18,2,'G')}return b});
/* Кухня Зиновія */
Object.assign(IT,{
  soupherb:{n:'Юшка з травами',ic:'(~)',use:'heal',v:20,warm:1,d:'Лікує 20 здоров’я і зігріває: десять хвилин здоров’я вертається втричі швидше.'},
  pie:{n:'Рибний пиріг',ic:'(~)',use:'heal',v:25,full:3,d:'Лікує 25 здоров’я. Ситість: +1 очко дії на початку трьох наступних боїв.'}});
ICO.soupherb=ICO.soup;ICO.pie=['............','............','....8888....','..8ffffff8..','.8fgfgfgff8.','.8ffffffff8.','.8eeeeeeee8.','..8eeeeee8..','...888888...','............','............','............'];
ILD.soupherb=IT.soupherb.d;ILD.pie=IT.pie.d;
const DISH=[{id:'soup',c:{fish:8,prov:2},t:'Риба, провізія — і довго на вогні.'},{id:'soupherb',c:{fish:6,herb:2},t:'Ганнині трави дають юшці тепло.',req:()=>!!s.seen.herb},
  {id:'pie',c:{fish:5,prov:4,wood:2},t:'Тісто з товченої провізії, риба всередині, жар знизу й зверху.',req:()=>!!s.f.cookPie}];
const dishOk=D=>(!D.req||D.req())&&afford(D.c);
function cook(id){const D=DISH.find(x=>x.id===id);if(!D||!s.mst.zinovii||!s.f.tracks||!dishOk(D))return;pay(D.c);giveI(id);s.c.cook=(s.c.cook||0)+1;if(s.c.cook>=5&&!s.f.cookPie){s.f.cookPie=1;say('Зиновій витирає руки: «Ти вже вмієш тримати вогонь під казаном. Завтра навчу пиріг пекти».','info')}
  say(`${IT[id].n}: готово. Пахне на весь маяк.`,'build');dirty=1}
function dishEffect(id){const T=IT[id];if(!T)return;s.h.buf=s.h.buf||{};if(T.warm)s.h.buf.warm=Date.now()+10*60000;if(T.full)s.h.buf.full=(s.h.buf.full||0)+T.full}
function potHS(W,H){if(!s.mst.zinovii||!s.f.tracks||!s.b.hearth)return'';const[x,y,w,h]=twBox('hall');
  return ob('cl:pot','bpop','cl:pot',obURL('pot3',pot3),x+4,y+h-20,W,H,'Казан Зиновія','<b>Казан Зиновія</b><br>Тут вариться юшка й печеться пиріг.',{z:293,pulse:(s.c.cook||0)?0:1})}
const pot3=HI(function(){const b=pbuf(16,14);prect(b,2,0,1,6,'D');prect(b,13,0,1,6,'D');prect(b,2,0,12,1,'D');hiRect(b,3,5,10,8,(i,j,x,y)=>((x-8)/5)**2+((y-8)/4.5)**2<=1?(y<6.3?'u':x<6.5?'F':'D'):'');prect(b,4,12,8,2,'J');pset(b,6,13,'I');pset(b,9,13,'I');return b});
function potPopHTML(){return`<div class="bpop" role="dialog" aria-label="Казан"><div class="bph"><b>Казан Зиновія</b><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>
  <p class="m">Зиновій мішає в казані: ${Q('Голодний хранитель — поганий хранитель')}.</p><div class="rlist">${DISH.filter(D=>!D.req||D.req()).map(D=>`<div class="row"><span><b>${IT[D.id].n}</b><br><span class="m">${IT[D.id].d}</span></span>${btn('Зварити','cook',D.id,{ok:()=>dishOk(D)})}<span class="ccs">${costTxt(D.c)}</span></div>`).join('')}</div>
  <p class="hint">Страви лягають у торбу; у бою — з поясу, за 1 очко дії.</p></div>`}
