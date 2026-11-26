/* ============ ПРИПЛИВ І БРІД (етап I) ============
   Перший відплив після трьох риболовель; далі власний цикл збереження ~15 хв, з них ~5 хв — відплив. На відпливі відкриваються
   калюжі між камінням (риба, мідії, зрідка знахідка) і кам'янистий брід на великий острів.
   Брід треба позначити частинами (вішки, поруччя, сходинки, ліхтар) — працювати можна лише на відпливі.
   Готовий брід відкриває Мапу: це міст в етап II. */
const TIDE=900,TLOW=300,TIDE_EDGE=40;
const tideLegacy=()=>s.tideEpoch==null&&!!(s.f.tideSeen||s.f.fordSeen||s.f.fordDone||s.f.seal);
const tideKnown=()=>!!(s.f.tideSeen||tideLegacy());
function tidePhase(){if(tideLegacy())return(Date.now()/1000)%TIDE;if(s.tideEpoch==null)return 0;const elapsed=Math.max(0,(Date.now()-s.tideEpoch)/1000);return !s.f.tideSeen?Math.min(TIDE-TLOW,elapsed):elapsed%TIDE}
const tideCyc=()=>Math.floor(Math.max(0,(Date.now()-(s.tideEpoch||0))/1000)/TIDE);
/* 0 — повна вода, 1 — найнижчий відплив; до першого пояснення фаза не може минути. */
function tideLv(){if(s.dbgTide)return s.dbgTide==='low'?1:0;const t=tidePhase(),lo=TIDE-TLOW,e=TIDE_EDGE;
  if(t<lo-e)return 0;if(t<lo)return(t-(lo-e))/e;if(t>TIDE-e)return(TIDE-t)/e;return 1}
const tideLow=()=>s.dbgTide?s.dbgTide==='low':tideKnown()&&tideLv()>=.99;
/* Скільки до межі придатного для робіт відпливу. */
function tideLeft(){const t=tidePhase(),lo=TIDE-TLOW-TIDE_EDGE*.01,hi=TIDE-TIDE_EDGE*.99;return tideLow()?Math.max(0,hi-t):(t<lo?lo-t:TIDE-t+lo)}
const tideTxt=()=>{const m=Math.max(1,Math.ceil(tideLeft()/60));return tideLow()?`Відплив. Вода повернеться за ${m} хв.`:`Повна вода. Відплив — приблизно за ${m} хв.`};
/* Частини броду */
const FORD=[
  {id:'poles',n:'Вішки',d:'Жердини вздовж каміння, щоб не збитися зі стежки.',c:{wood:60}},
  {id:'steps',n:'Сходинки',d:'Плаский камінь і дошки на слизьких місцях.',c:{wood:40,scrap:30}},
  {id:'rope',n:'Поруччя',d:'Мотузка між вішками: тримає, коли хвиля б’є під ноги.',c:{wood:30,fish:20,scrap:20}},
  {id:'lamp',n:'Ліхтар на дальньому кінці',d:'Світло, що веде бродом і в тумані.',c:{oil:6,scrap:40,ember:300},req:()=>!!s.f.siege1,reqT:'Спершу треба вистояти, коли Мла прийде до маяка.'}];
const fordN=()=>FORD.filter(p=>(s.ford||{})[p.id]).length;
const fordNext=()=>FORD.find(p=>!(s.ford||{})[p.id]);
const fordReady=()=>{const p=fordNext();return p&&(!p.req||p.req())?p:null};
const fordVisible=()=>FORD.filter(p=>(s.ford||{})[p.id]||p===fordReady());
function fordPart(id){const P=FORD.find(p=>p.id===id);if(!P||!s.f.fordSeen||(s.ford||{})[id]||P!==fordNext())return false;if(!tideLow()){say('Брід під водою. Працювати можна лише на відпливі.','info');return false}
  if(P.req&&!P.req()){if(s.f.mlaNote)say(P.reqT,'info');return false}if(!afford(P.c))return false;pay(P.c);s.ford=s.ford||{};s.ford[id]=1;novMark();dirty=1;xp(8);
  if(fordN()===FORD.length){s.f.fordDone=1;unlock('map',true);reveal('village',true);
    dlg({k:'story',title:'Брід позначено',img:{t:'scene',id:'shore'},body:`<p>Ліхтар на дальньому кінці броду засвітився. Із вішками, поруччям і світлом брід не підведе навіть тоді, коли вода сягає колін: тепер можна ходити на великий острів — туди, де ночами горять вогні Причалу.</p>`,gains:['Відкрилося: Мапа','На мапі позначено Гнилий Причал.']})}
  else say(`${P.n}: готово. Брід стає надійнішим.`,'build');return true}
/* Калюжі на відпливі */
function poolPick(){if(!tideLow()||onCd('pool'))return;setCd('pool',4);s.c.pool=(s.c.pool||0)+1;const n=1+(Math.random()<.4?1:0);add('fish',n);
  if(Math.random()<((s.mst||{}).horpyna?.14:.07)&&collFind('pool'))return;
  queueShoreFind('pool');
}
/* Об'єкти берега: калюжа між камінням і кілок біля броду */
function poolObj3(){const b=pbuf(34,14);hiRect(b,0,0,34,14,(i,j,x,y)=>{const d=((x-17)/16)**2+((y-8)/6)**2;if(d>1)return;const r=vnz(i,j,4,21);if(d>.62||r>.7)return r>.5?'F':'E';if(d>.5)return'D';return hh2(i,j)<.06?'u':y<7?'T':'S'});
  for(const[x,y]of[[8,7],[22,9],[14,10]]){pset(b,x,y,'x');pset(b,x+1,y,'D')}pset(b,26,5,'v');pset(b,27,5,'t');return b}
function fordPost3(n){const b=pbuf(14,26);prect(b,6,4,2,22,'W');prect(b,6,4,1,22,'X');polyFill(b,[[8,5],[13,7],[8,10]],(x,y)=>pset(b,x,y,'i'));prect(b,4,24,6,2,'E');
  for(let k=0;k<Math.min(4,n);k++)prect(b,1,14+k*3,4,2,'Y');return b}
for(const f of['poolObj3','fordPost3'])globalThis[f]=HI(globalThis[f]);
function shoreFordHS(W,H){let h='';
  if(tideLow())h+=ob('pool','pool','',obURL('pool3',poolObj3),120,62,W,H,'Калюжі на відпливі','<b>Калюжі між камінням</b><br>Вода відступила: мідії, дрібна риба, а часом і щось, що загубило море.',{cd:'pool',cs:4,pulse:!(s.hsU||{}).pool});
  if(s.f.fordSeen&&!s.f.fordDone)h+=ob('sh:ford','bpop','sh:ford',obURL('fp3:'+fordN(),()=>fordPost3(fordN())),40,58,W,H,'Брід','<b>Брід</b><br>'+tideTxt(),{pulse:tideLow()?1:0,always:tideLow()?1:0});
  return h}
function fordPopHTML(){const low=tideLow();return`<div class="bpop" role="dialog" aria-label="Брід"><div class="bph"><b>Брід на великий острів</b><button type="button" class="bpx" data-a="bpop" data-i="" aria-label="Закрити">✕</button></div>
  <p class="m">${VH(tideTxt)}</p><div class="rlist">${fordVisible().map(P=>{const done=(s.ford||{})[P.id],lock=P.req&&!P.req();return`<div class="row"><span><b>${P.n}</b>${done?' ✓':''}<br><span class="m">${lock?P.reqT:P.d}</span></span>${done?'':btn('Зробити','ford',P.id,{ok:()=>tideLow()&&!lock&&afford(P.c)})}${done?'':`<span class="ccs">${costTxt(P.c)}</span>`}</div>`}).join('')}</div>
  ${!fordReady()&&!s.f.fordDone?`<p class="hint">${s.f.mlaNote?'Спершу вистояти, коли Мла прийде до маяка.':'Стежку вже позначено. Залишилося зробити її безпечною в тумані.'}</p>`:''}
  ${low?'':'<p class="hint">Камінь зараз під водою — чекай відпливу.</p>'}</div>`}

/* перший відплив пояснюється (#40): море відступає — на березі з'являються калюжі */
function tideFirst(){if(s.f.tideSeen||!s.tabs.shore||s.cb||s.raid||away()||(s.dlg||[]).length||!novCan())return;
  if(!tideLegacy()){
    if(!s.f.rod||(s.c.fish||0)<3)return;
    if(s.tideEpoch==null){s.tideEpoch=Date.now()-(TIDE-TLOW-TIDE_EDGE)*1000;dirty=1;return}
    if(!s.dbgTide&&tidePhase()<TIDE-TLOW)return;if(s.dbgTide==='high')return;
    // Починаємо повне вікно відпливу саме тоді, коли гравець може побачити пояснення.
    s.tideEpoch=Date.now()-(TIDE-TLOW)*1000;
  }else if(!tideLow())return;
  s.f.tideSeen=1;novMark();
  dlg({k:'world',title:'Відплив',img:{t:'ob',k:'pool3',f:'poolObj3'},body:'<p>Море відступило. Там, де щойно бились хвилі, тепер мокре каміння, водорості й калюжі, у яких лишилась дрібна риба та мідії.</p><p>Вода повернеться — вона завжди повертається. Але скоро відступить знову.</p>',
    gains:['Відкрилося: калюжі на відпливі']});tutOffer('tide')}
