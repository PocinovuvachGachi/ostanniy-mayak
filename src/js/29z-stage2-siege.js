/* ============ ЕТАП II, КРОКИ 5–7: ОБЛОГА ПРИЧАЛУ, ТИМІШ-ПОСИЛЬНИЙ, КЛЮЧ ============
   Коли Причал уже вважає тебе сусідом, а печера контрабандистів позаду, Мла йде на селище: там тепер теж світло й гомін.
   Бій-захист: рибалки поруч, утопленики ламають хати, туманні вовки кидаються на людей, згодом із води лізуть ще.
   Перемога — Причал запалює сигнальне вогнище (видно з маяка) і довіряє, як своєму; тоді Ганна віддає ключ.
   Свій на Причалі — Тиміш бігає бродом і носить Яремі надлишки, які ти відклав на продаж. */
ARENA.pierv=['~~~~~~~~~~~','..+....~~~~','.....+...~~','E..........','..+......#.','.....+.....','#.........#'];
ENC.rsiege={a:'pierv',h:[1,3],noElite:1,e:[['bld',2,1,undefined,{nm:'Хата Луки'}],['bld',2,5,undefined,{nm:'Хата Оксани'}],['fisher',3,2],['fisher',3,4],
  ['drowned',8,1,'wreck'],['drowned',9,5,'wreck'],['wolf',8,3],['wolf',9,4]],waves:[[3,[['drowned',10,2],['drowned',10,4]]]]};
const rsiegeReady=()=>!!s.f.siege1&&rotRank()>=4&&!!(s.f.caveIn||s.f.stash||(s.mst||{}).olesya);
function rsiegeTick(){if(s.f.rsiege||s.f.rsiegeOn||!rsiegeReady()||away()||s.cb)return;s.f.rsiegeOn=1;
  if(s.at!=='village')dlg({k:'fight',title:'Дзвін на Причалі',img:{t:'scene',id:'village'},body:'<p>З-за протоки долинає дзвін — часто, тривожно. Туман котиться на Причал, і в ньому щось ворушиться. Люди чекають на тебе.</p>',gains:['Мла йде на Причал']});dirty=1}
LOC.village.spots.push({id:'siege',n:'Туман над Причалом',pos:[260,200],show:()=>!!s.f.rsiegeOn&&!s.f.rsiege,
  d:'Туман сунеться з моря просто на хати. Рибалки з острогами й веслами стоять на пірсі. З туману виходять ті, кого забрала Мла, і сірі вовки.',
  acts:[{id:'fight',t:'Стати з рибалками',fight:'rsiege',win(){const c=s.cb,hb=c?c.u.filter(u=>EN[u.t].struct&&u.hp<=0).length:0,fs=c?c.u.filter(u=>u.t==='fisher'&&u.hp>0).length:2;
    s.f.rsiege=1;s.f.rsiegeOn=0;xp(60);add('coin',30);trust('rot',hb?14:20,'Причал вистояв');
    dlg({k:'story',title:'Вогонь Причалу',img:{t:'scene',id:'village'},body:`<p>Туман відкочується до води, залишаючи на пірсі мокрі сліди.${hb?' Одну хату доведеться латати всім гуртом — але люди живі.':''}${fs<2?' Пораненого рибалку Ганна вже перев’язує.':''}</p><p>Тієї ж ночі на краю пірсу рибалки складають велике вогнище. ${P('Мирон')} киває на маяк: ${Q('Тепер і в нас є свій вогонь. Побачиш — знатимеш, що тут живі')}. З галереї маяка його видно через протоку.</p>`,gains:['Сигнальне вогнище Причалу']});
    return hb?'Причал вистояв, хоч одна хата й постраждала.':'Причал вистояв — жодної хати не віддали.'}}]});
/* ключ Ганни — лише після облоги */
{const hut=LOC.village.spots.find(S=>S.id==='hut'),K=hut.acts.find(a=>a.id==='key'),sh=K.show;K.show=()=>sh()&&!!s.f.rsiege}
/* Тиміш-посильний: продає Яремі надлишки, які ти відклав, кожні кілька хвилин, поки ти в грі */
const CUR=['fish','prov','scrap','tar','herb','coal'];
const curOn=()=>rotRank()>=5&&!!s.met.tymish;
function curTick(){if(!curOn()||away())return;s.cur=s.cur||{on:{},t:0,gain:0};const now=Date.now();
  if(!s.f.curMet){s.f.curMet=1;dlg({k:'story',title:'Тиміш-посильний',img:{t:'face',id:'tymish'},body:`<p>${P('Тиміш')} перебігає брід із порожнім кошиком. ${Q('Ярема каже, ти тепер свій. То давай я носитиму твоє добро на продаж! Ти тільки скажи, що зайве — а я вже знаю, як із Яремою торгуватися')}.</p>`,gains:['Тиміш носить надлишки Яремі (у картці крамниці на Причалі й у Торгу)']});s.cur.t=now+4*60000;return}
  if(now<s.cur.t)return;s.cur.t=now+4*60000;let got=0,sold={};
  for(const k of CUR){if(!s.cur.on[k])continue;const S=SELL.find(x=>x.id===k);if(!S)continue;const q=S.r[k],keep=k==='fish'||k==='prov'?Math.floor(capOf(k)*.5):50;let n=0;
    while(n<3&&s.r[k]-q>=keep){s.r[k]-=q;got+=sellG(S.g);sold[k]=(sold[k]||0)+q;n++}}
  if(got){add('coin',got);s.cur.gain+=got;say(`Тиміш збігав до Яреми: ${costTxt(sold)} → ${R('coin',got)}.`,'find')}}
function curHTML(){if(!curOn()||!s.f.curMet)return'';const on=(s.cur||{}).on||{};
  return`<div class="freq"><b>Посилки Тиміша</b><br><span class="m">Тиміш раз на кілька хвилин носить Яремі те, що ти відклав. Риби й провізії лишає половину комори, решти — по 50.</span><div class="act">${CUR.filter(k=>s.seen[k]).map(k=>btn(`${RN[k]}${on[k]?' ✓':''}`,'curt',k,{cls:on[k]?'on':''})).join('')}</div>${s.cur&&s.cur.gain?`<span class="m">Уже приніс: ${R('coin',s.cur.gain)}.</span>`:''}</div>`}
