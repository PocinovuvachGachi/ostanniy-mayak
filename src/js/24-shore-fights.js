/* ============ БОЇ НА ОСТРІВЦІ (етап I) ============
   До броду гравець не виходить за межі острівця, тож досвід і тактику дають події на березі:
   краби в калюжах на відпливі (повторно), чайки над сушінням риби, пацюки з трюму уламка, утопленик із туману.
   Кожна подія — об'єкт на сцені берега, що чекає, поки гравець сам вирішить битися (і поки його немає). */
Object.assign(ARENA,{
  pools:['~~~~~~~~~~~','~~..~~~..~~','..+..~..+..','E....~.....','..#.....#..','...........','#.........#'],
  rack: ['~~~~~~~~~~~','..........~','.#...+...#.','E....#.....','...+...+...','...........','#....#....#']});
Object.assign(ENC,{
  poolcrab:{a:'pools',h:[1,3],xpm:.25,e:[['crab',7,2],['crab',8,4]]},
  gullrack:{a:'rack',h:[1,3],e:[['gull',8,1],['gull',9,4],['gull',10,2]]},
  rats:{a:'hold',h:[1,3],e:[['rat',7,2],['rat',8,4],['rat',6,5],['rat',9,1]]},
  drown1:{a:'shore',h:[1,3],e:[['drowned',7,1]]}});
EN.rat.pack=1;EN.rat.d='Сірий, жирний і сміливий, поки їх багато: кожен сусід-пацюк додає йому зухвалості.';
const SHF={
  poolcrab:{n:'Краби в калюжах',d:'Між камінням ворушаться панцирі. Краби ховаються в них — бий, коли розкриються.',
    ok:()=>s.f.crab1&&tideLow()&&!s.f.fordDone,gap:360,win(){add('fish',3);return'Краби лежать догори черевом. Буде юшка.'}},
  gullrack:{n:'Чайки над рибою',d:'Зграя кружляє над сушінням і пікірує на рибу. Налітають з усіх боків — бий тих, що ближче.',once:1,
    ok:()=>s.f.crab1&&s.floors.work&&s.r.fish>=8&&!!(s.eq||{}).weapon,win(){add('fish',6);xp(20);return'Зграя розлітається з криком. Риба ціла.'}},
  rats:{n:'Пацюки з трюму',d:'З-під обшивки уламка вибігає зграя. Поодинці вони боягузи, гуртом — ні: не давай себе оточити.',once:1,
    ok:()=>!!s.f.zinovii&&((s.c.scrap||0)>=25||Date.now()-(s.zinT||0)>12*60000),win(){add('scrap',25);add('oil',4);xp(25);if(typeof collFind==='function')collFind('rats');return'Трюм вільний. Серед гнилих дощок — скринька з цвяхами й кілька цінних дрібниць.'}},
  zinovii:{n:'Людина на уламку щогли',npc:1,d:'Хвилі несуть до берега уламок щогли, а на ньому хтось ворушиться. Живий!',once:1,
    ok:()=>!!s.f.gullrack,go(){s.f.zinovii=1;s.zinT=Date.now();rescue('zinovii',`Ти витягаєш на берег чоловіка в просоленому фартусі. ${Q('Зиновій, кок із «Мартина»')}, — каже він, відігрівшись. ${Q('Ми йшли на маяк, а маяк мовчав. Туман накрив нас посеред ночі — і з нього виходили люди. Не люди…')}`)}},
  horpyna:{n:'Пліт біля каміння',npc:1,d:'До берега прибило пліт: жінка тримає на руках малого.',once:1,
    ok:()=>!!s.f.drown1,go(){s.f.horpyna=1;s.f.bpTraps=1;rescue('horpyna',`${P('Горпина')} притискає до себе малого Петрика. ${Q('Наш хутір на півночі спалили… ні, не люди. Туман прийшов, і з ним вони. Ми пливли на світло — а світла не було.')} Вона дивиться на маяк. ${Q('Тепер є')}.`)}},
  drown1:{n:'Хтось виходить із туману',d:'По коліна у воді стоїть постать. Мокрі руки, порожні очі. Не підходь до води близько.',once:1,
    ok:()=>!!s.f.tracks&&s.h.lvl>=2&&(dayPh()!=='y'||Date.now()-(s.tracksT||0)>8*60000),win(){xp(30);if(!s.pages.includes('m'))page('m');return'Постать розсипається мокрим піском. Таке вже не може бути людиною. Хто ж вони — ті, кого забирає туман?'}}};
/* події спливають самі, але лише поки гравець поруч */
function shfTick(){if(s.cb||s.raid||s.shf||away()||!s.tabs.shore)return;const now=Date.now();s.shfT=s.shfT||{};
  for(const id in SHF){const F=SHF[id];if(F.once&&s.f[id])continue;if(F.gap&&now-(s.shfT[id]||0)<F.gap*1000)continue;if(!F.ok())continue;
    if(id==='poolcrab'&&Math.random()>.15)continue;s.shf=id;s.shfT[id]=now;say(F.n+'. '+F.d.split('.')[0]+'.',F.npc?'world':'fight');dirty=1;return}}
function shfGo(){const id=s.shf;if(!id||s.cb)return;s.shf='';if(SHF[id].npc){SHF[id].go();dirty=1;return}s.h.hp=Math.max(s.h.hp,1);startFight(id,'S:'+id)}
function shfWin(id){const F=SHF[id];if(!F)return'';if(F.once)s.f[id]=1;if(id==='rats')s.ratsT=Date.now();return F.win()}
/* об'єкт на березі */
function shfObj3(id){const b=pbuf(30,22);if(SHF[id]&&SHF[id].art)SHF[id].art(b);else if(id==='poolcrab'){for(const[x,y]of[[6,14],[18,16]]){hiRect(b,x-5,y-4,10,7,(i,j,px,py)=>((px-x)/5)**2+((py-y)/3.2)**2<=1?(py<y-1?'w':'v'):'');pset(b,x-5,y-2,'v');pset(b,x+4,y-2,'v');pset(b,x-1,y-3,'x');pset(b,x+1,y-3,'x')}}
  else if(id==='gullrack'){prect(b,2,10,26,2,'W');prect(b,4,12,2,10,'V');prect(b,24,12,2,10,'V');for(let x=6;x<24;x+=4){prect(b,x,12,2,5,'T');pset(b,x,12,'U')}for(const[x,y]of[[6,4],[15,2],[23,5]]){pline(b,x-3,y+1,x,y,'6');pline(b,x,y,x+3,y+1,'6');pset(b,x,y+1,'u')}}
  else if(id==='rats'){for(const[x,y]of[[5,18],[13,19],[21,17],[26,19]]){prect(b,x,y,4,2,'9');prect(b,x+4,y,1,1,'a');pline(b,x-3,y+1,x,y+1,'8')}prect(b,8,6,14,8,'x');prect(b,9,7,12,6,'V')}
  else if(id==='zinovii'||id==='horpyna'){prect(b,0,16,30,4,'W');prect(b,0,16,30,1,'Y');if(id==='zinovii')prect(b,4,4,2,12,'X');hiRect(b,12,4,8,12,(i,j,x,y)=>Math.hypot(x-16,y-7)<2.4?'m':y>9&&Math.abs(x-16)<3.5?(id==='zinovii'?'N':'i'):'');if(id==='horpyna')hiRect(b,17,10,5,5,(i,j,x,y)=>Math.hypot(x-19.5,y-12)<2?'m':'');pline(b,0,21,30,21,'U')}
  else{hiRect(b,10,2,10,20,(i,j,x,y)=>{const u=(x-15)/(y<8?2.4:4.5);if(Math.abs(u)>1)return;return y<8?(Math.hypot(x-15,y-5)<2.6?'6':''):y>17?'S':'5'});pset(b,14,5,'x');pset(b,16,5,'x');pline(b,0,20,30,20,'U')}
  return b}
globalThis.shfObj3=HI(shfObj3);
function shoreFightHS(W,H){const id=s.shf;if(!id)return'';const F=SHF[id],pos=F.pos||{poolcrab:[112,66],gullrack:[132,82],rats:[204,80],drown1:[96,60],zinovii:[204,54],horpyna:[204,54]}[id]||[110,70];
  return ob('shf:'+id,'shfgo','',obURL('shf3:'+id,()=>shfObj3(id)),pos[0],pos[1],W,H,F.n,`<b>${F.n}</b><br>${F.d}<br><span class="m">${F.tip||F.npc?F.tip||'Натисни, щоб допомогти.':'Натисни, щоб битися. Можна й почекати: нікуди не дінуться.'}</span>`,{pulse:1,always:1,cls:'bite',inner:'<i class="bang">!</i>'})}
