/* ============ ПАНЕЛЬ НАЛАГОДЖЕННЯ ============
   Відкривається, якщо додати до адреси ?debug або #debug. Гравці її не бачать.
   Швидко переносить у потрібний стан: ресурси, вкладки, міні-ігри, набіг, перемотка часу, збереження. */
const DBG_ON=typeof location!=='undefined'&&/[?&#]debug\b/.test(location.search+location.hash);
const DBG=[
  ['Ресурси +500',()=>{for(const k of RES){s.seen[k]=1;s.r[k]=(s.r[k]||0)+500}}],
  ['Відкрити все',()=>{const F=s.f;Object.assign(F,{looked:1,lk:1,wreck:1,rod:1,crab1:1,people:1,boat:1,siege1:1,mlaNote:1});s.b.hearth=Math.max(3,s.b.hearth||0);
    for(const fl of['work','gallery','study','lantern'])s.floors[fl]=s.floors[fl]||1;s.pop=Math.max(3,s.pop||0);s.b.house=Math.max(2,s.b.house||0);for(const t of TABS)s.tabs[t[0]]=1;if(!s.h.bg)s.h.bg='old';s.nvU.gear=1}],
  ['Герой +1 рівень',()=>xp(need(s.h.lvl)-s.h.xp+1)],
  ['Риба',()=>mgFish()],['Бочка',()=>mgFlot('barrel')],['Ящик',()=>mgFlot('crate')],['Людина',()=>mgFlot('survivor')],
  ['Кування',()=>{const w=WEAP.find(has)||'knife';if(!has(w))giveI(w);mgForge(w)}],
  ['Знахідка в прибої',()=>{s.floors.gallery=1;const ks=['crate','barrel','cargo','bottle','survivor'];s.flot={k:ks[Math.floor(Math.random()*ks.length)],until:Date.now()+180000};s.tab='shore'}],
  ['Мла +25',()=>{s.threat=Math.min(100,(s.threat||0)+25)}],
  ['Набіг зараз',()=>{s.f.siege1=1;s.threat=100;s.lastAct=Date.now();raidCheck()}],
  ['+10 хв',()=>dbgSkip(600)],['+1 год',()=>dbgSkip(3600)],
  ['Події в дзвіночок',()=>{dlg({k:'info',title:'Перевірка дзвіночка',body:'<p>Перша подія.</p>'});dlg({k:'world',title:'Ще одна подія',body:'<p>Друга.</p>'});s.bellHold=1}],
  ['Скинути звички',()=>{s.mgW={};s.mgUn={};s.mgHab={};s.mgSeen={}}],
];
/* Перемотка: гра живе так, ніби минув час; таймери подій теж зсуваються. */
function dbgSkip(sec){for(let r=sec;r>0;r-=5)produce(Math.min(5,r));const ms=sec*1000;for(const k in s.cd)s.cd[k]-=ms;
  for(const k of['flotT','shipT','lostT'])if(s[k])s[k]-=ms;for(const e of s.exp||[])e.until-=ms;checks();say(`Налагодження: минуло ${sec>=3600?sec/3600+' год':sec/60+' хв'}.`,'world')}
function dbgUI(){if(!DBG_ON||typeof document==='undefined'||!document.body||!document.body.appendChild)return;const el=document.createElement('div');el.id='dbg';
  el.innerHTML=`<details><summary>Налагодження</summary><div class="dbgb">${DBG.map((d,i)=>`<button type="button" data-dbg="${i}">${d[0]}</button>`).join('')}</div>
    <p class="dbgl">Збереження (для звіту про баг або щоб перенести гру):</p><textarea id="dbgSave" rows="3" spellcheck="false" aria-label="Збереження"></textarea>
    <div class="dbgb"><button type="button" id="dbgOut">Показати збереження</button><button type="button" id="dbgCopy">Копіювати</button><button type="button" id="dbgIn">Завантажити з поля</button></div><p class="dbgl" id="dbgMsg"></p></details>`;
  document.body.appendChild(el);const msg=t=>{el.querySelector('#dbgMsg').textContent=t},ta=el.querySelector('#dbgSave');
  el.querySelectorAll('[data-dbg]').forEach(b=>b.onclick=()=>{try{DBG[+b.dataset.dbg][1]();dirty=1;render();save();msg('Готово: '+DBG[+b.dataset.dbg][0])}catch(e){msg('Помилка: '+e.message)}});
  el.querySelector('#dbgOut').onclick=()=>{save();ta.value=btoa(unescape(encodeURIComponent(JSON.stringify(s))));msg('Збереження в полі. Скопіюй і встав у звіт про баг.')};
  el.querySelector('#dbgCopy').onclick=()=>{if(!ta.value){save();ta.value=btoa(unescape(encodeURIComponent(JSON.stringify(s))))}const ok=()=>msg('Скопійовано.'),no=()=>{ta.select();msg('Виділено — скопіюй вручну.')};try{navigator.clipboard.writeText(ta.value).then(ok,no)}catch(e){no()}};
  el.querySelector('#dbgIn').onclick=()=>{try{const raw=ta.value.trim(),txt=raw.startsWith('{')?raw:decodeURIComponent(escape(atob(raw)));JSON.parse(txt);save=function(){};localStorage.setItem(KEY,txt);msg('Завантажено. Перезапускаю…');setTimeout(()=>location.reload(),300)}catch(e){msg('Не вдалося прочитати збереження.')}}}
dbgUI();
