/* Необов’язкова загадка «Мартина». Підказки відкривають текст, а не умови засувки. */
const NAV_SYMBOLS=['Якір','Хвиля','Зірка','Маяк'];
const NAV_SOLUTION=[0,2,3];
const NAV_REVERSE='Спершу те, що тримає судно. Далі те, що веде вночі. Насамкінець — вогонь, до якого повертаємось.';
const NAV_MARKS='Ліворуч від кілець вирізано коротку риску. Від неї читають позначки.';
const NAV_STUCK='Засувка впирається. Кільця лишилися на місці.';
const NAV_TITLE='Штурманський відсік';
IT.sextant={n:'Штурманський секстант',ic:'⌁',d:'Далекі особисті морські походи коштують на 1 провізію менше.'};
OD.navnote={doc:1,xp:0,n:'Запис штурмана',d:'«Під вечір за кормою йшло мале судно. Назви не розібрали. Лише біла риска на кормі, та й та виднілася, коли судно лягло на бік. Двічі підняли ліхтар. Відповіді не було».'};
ODI.navnote='lore';

const navDoorSeen=()=>!!(s.f.rats&&s.localProgress.hold?.navDoor);
const navDoorOpen=()=>!!(s.f.rats&&s.localProgress.hold?.navOpen);
const navLockReady=p=>!!(s.f.rats&&p.navDoor&&p.navMarks&&!p.navOpen&&holdLight()==='storm');
function navOpenForEntry(){return navDoorOpen()&&!!holdLight()}
const navLogReady=()=>navDoorSeen()&&!!s.odd.logpage;
const navTalkReady=()=>navDoorSeen()&&!!(s.f.zinovii||s.met.zinovii||s.mst.zinovii);
const navRings=p=>[0,1,2].map(i=>{const v=p.navRings?.[i];return Number.isInteger(v)&&v>=0&&v<NAV_SYMBOLS.length?v:1});

function seeNavigatorDoor(p){
  p.navDoor=1;
  say('У дверях туго сидить засувка з трьома кільцями. Борозни забила сіль.','world');
  // Давні збереження могли отримати перемогу до появи цього гарантованого документа.
  if(!s.odd.logpage){
    s.odd.logpage=1;s.oddNew=(s.oddNew||0)+1;
    say('Біля дверей між дошками затисло сторінку суднового журналу.','find');
  }
}
function navigatorRing(i,x){
  return {label:p=>`Кільце ${i+1}: ${NAV_SYMBOLS[navRings(p)[i]]}`,ready:p=>navLockReady(p),x,y:27,
    artKey:p=>navRings(p)[i],art:(_,p)=>navigatorRingArt(navRings(p)[i]),
    run(p){const rings=navRings(p);rings[i]=(rings[i]+1)%NAV_SYMBOLS.length;p.navRings=rings;delete p.navStuck}};
}
function tryNavigatorLock(p){
  if(navRings(p).every((v,i)=>v===NAV_SOLUTION[i])){
    p.navOpen=1;delete p.navStuck;
    say('Засувка ковзнула в паз, і двері піддалися.','world');
  }else{
    p.navStuck=1;
    say(NAV_STUCK,'world');
  }
}
function navLogHTML(){
  if(!navLogReady())return '';
  return s.localProgress.hold.navLog?'<p class="nav-reverse" tabindex="-1"><b>На звороті</b><br>'+Q(NAV_REVERSE)+'</p>':
    btn('Оглянути зворот сторінки','navLog');
}
function navLog(){
  const reading=s.tab==='journal'&&s.jt==='documents'||popB==='cl:shelf'&&shelfSelected==='logpage';
  if(!reading||!localCanAct()||s.dlg.length||!navLogReady()||s.localProgress.hold.navLog)return;
  s.localProgress.hold.navLog=1;readOddDocument('logpage');dirty=1;save();
}
function navTalkButton(){
  return navTalkReady()?btn('Запитати Зиновія про позначки','navTalk'):'';
}
function navTalk(){
  if(!zinoviiInteractionHere()||s.at||!localCanAct()||s.dlg.length||!navTalkReady())return;
  dlg({k:'story',title:'Позначки на кільцях',img:{t:'face',id:'zinovii'},
    body:`<p>${P('Зиновій')} згадує засувку під палубою. ${Q('Такі самі знаки штурман ставив на дощечках для вахти. Якорем мітив стоянку, хвилею — воду, зіркою — нічний курс. А маяком — вогонь, до якого ми верталися')}.</p>`});
  s.localProgress.hold.navTalk=1;save();
}
function navigatorCache(p){
  p.navCache=1;
  if(!has('sextant'))giveI('sextant');
  odd('navnote','',{popup:false});
  dlg({k:'find',odd:'navnote',title:'Знахідки штурмана',img:{t:'icon',id:'sextant'},
    body:`<p>У полотняному чохлі лежить латунний секстант, а під ним складено аркуш.</p><p>${OD.navnote.d}</p>`,
    gains:[IT.sextant.d,'Запис штурмана можна перечитати на полиці.']});
}
