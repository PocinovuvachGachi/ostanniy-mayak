/* ============ SAVE / LOOP ============ */
function save(){s.ts=Date.now();try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return;const d=JSON.parse(raw),f=fresh();
  for(const k in d){if(f[k]&&typeof f[k]==='object'&&!Array.isArray(f[k])&&d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k]))f[k]=Object.assign(f[k],d[k]);else f[k]=d[k]}
  s=f;if(s.cb&&!s.cb.u)s.cb=null;
  const olderHealing=d.healingV!==1;
  if(olderHealing){
    s.healingV=1;s.belt=(s.belt||[]).filter(beltItem);
    if(s.f.crabWarn&&!s.f.crab1&&!s.cb){
      s.dlg=s.dlg.filter(q=>!q.crabw||((s.c.fish||0)>=5&&(!d.tutSeen?.combat||q.tut==='combat')));
      for(const q of s.dlg)if(q.crabw&&q.btns&&!q.btns.some(b=>b[1]==='crabPrepare'))q.btns.push(['Спочатку підготуватися','crabPrepare']);
    }
  }
  if(s.jt==='odd')s.jt='goals';
  if(!d.oddRead)for(const id of Object.keys(OD)){
    if(OD[id].doc&&s.odd[id]&&!s.dlg.some(item=>item.odd===id))s.oddRead[id]=1;
  }
  if(s.f.hook){s.f.hookPlan=1;if(!s.tutSeen.hook)tutRemember('hook')}
  if(s.f.rod||s.floors.work)s.f.rodPlan=1;
  if(has('rake')&&!s.tutSeen.rake)tutRemember('rake');
  if(!d.tutSeen)tutMigrate();
  if(s.bite&&!s.bite.kind&&typeof s.bite.until==='number'){
    s.bite={kind:'fish',amount:Math.round(5*wolf())};
    s.f.fishBiteSeen=1;tutOffer('fishBite');
  }
  if((s.tutPending||[]).includes('fishBite'))fishLessonLoadedAt=Date.now();
  if(s.bite&&!s.bite.place)s.bite.place='shore';
  if(!('fishSpecies' in d)&&s.f.fishBiteSeen&&!s.bite)s.f.fishBiteResolved=1;
  if(s.musselCyc!=null||has('mussel')||s.seenI?.mussel)s.f.musselGathered=1;
  if(SHF[s.shf]?.lowWater&&s.shfCyc==null&&s.shfT?.[s.shf])s.shfCyc=tideCyc(s.shfT[s.shf]);
  shfCheckTide();
  delete s.bigT;
  if(!d.pack){s.pack=[];for(const sl of['weapon','ranged'])if(s.eq[sl])s.pack.push(s.eq[sl]);for(const k of WEAP)if(has(k)&&!s.pack.includes(k)&&s.pack.length<packSlots())s.pack.push(k)}
  if(!d.belt){s.belt=[];for(const k of['bandage','potion','bomb'])if(has(k)&&s.belt.length<beltSlots())s.belt.push(k)}
  if(d.chv!==2){s.chv=2;s.chs=[];s.bts={};storyCheck(true)}
  if(!d.seenK){s.seenK={};for(const tb of TABS)markSeen(tb[0])}
  if(!d.fac){s.fac={rot:(s.f.herbsDone?15:0)+(s.f.netsDone?10:0)+(s.f.crateDone?10:0)+(s.mst.olesya?10:0)+(s.f.medDone?15:0),cape:(s.f.millSafe?20:0)+(s.f.motrya?10:0)+(s.f.coveDone?12:0),sails:(s.met.marta?10:0)+Math.min(40,5*(s.saved||0)),silent:-50+(s.f.gnat?(has('sabre')?-10:30):0)}}
  if(d.threat===undefined&&s.floors.gallery)s.threat=30;if(s.cb&&s.cb.win==='raid'){s.cb=null;s.raid=0}
  if(!d.rel){s.rel={};for(const l in LOC)for(const S of LOC[l].spots)for(const A of S.acts||[])if(s.done[`${l}.${S.id}.${A.id}`])relicFor(A.fight,1)}
  if(!d.nv){s.nv={};s.nvU={};if(s.tabs.hero){for(const k of['bag','arms','grow','tal'])s.nv[k]=1;for(const k of['hero','gear','bag','arms','grow','talents','map'])s.nvU[k]=1}
    if(s.floors.gallery&&s.tabs.hero){s.nv.mla=1;s.f.mlaNote=1;s.f.siege1=1;if(!s.pages.includes('m'))s.pages.push('m')}if(s.floors.work)s.f.craft1=1}
  if(!d.bdSeen){s.bdSeen={};for(const b of BD)if(b.show0())s.bdSeen[b.id]=1}
  if(!d.mom){chronBackfill();if(s.chs.length)s.tabs.chron=1}
  if(!d.rcSeen){s.rcSeen={};RCOPEN=1;for(const rc of RC)if(rcVisible(rc))s.rcSeen[rc.id]=1;RCOPEN=0}
  if(!d.seenI){s.seenI={};for(const k in s.inv)s.seenI[k]=1}
  if(!d.nv&&s.tabs.hero&&!s.h.bg)s.h.bg='old';delete s.tabs.talents;if(s.tab==='talents'){s.tab='hero';s.ht='talents'}
  if(s.cb){if(!s.cb.map)s.cb.map=ARENA[s.cb.a].slice();setGrid(s.cb)}
  if(s.cb&&s.cb.over){const k=s.cb.over;s.cb.over=0;if(k==='lose')lose();else win()}
  if(d.wup&&!d.wf){for(const k in d.wup)if(d.wup[k]>=1&&WF[k])s.wf[k]=1}delete s.wup;
  if(s.cb&&s.cb.win==='raid')s.cb=null;s.raid=0;s.log=s.log.map(logOf);if(s.eq.ranged===undefined)s.eq.ranged='';
  const now=Date.now(),off=clamp((now-(s.ts||now))/1000,0,7200);
  if(off>5){for(let i=0;i<20;i++)produce(off/20,false);if(off>60)say(`Поки тебе не було, вогнище горіло ${Math.round(off/60)} хв.`,'world')}
  const healed=!d.cb&&healingTick(off),migrated=migrateWarm(now);
  if(olderHealing||healed||migrated||off>5)save();
  }catch(e){s=fresh()}}

let tipEl=null,lpT=0,lpF=0;
function showTip(el,x,y){const t=el.getAttribute('data-tip'),d=$('tip');if(!t||!d)return;if(tipEl!==el){d.innerHTML=t;tipEl=el}d.style.display='block';const r=d.getBoundingClientRect();let px=x+14,py=y+16;
  if(px+r.width>innerWidth-8)px=Math.max(8,x-r.width-14);if(py+r.height>innerHeight-8)py=Math.max(8,y-r.height-16);d.style.left=px+'px';d.style.top=py+'px'}
function hideTip(){const d=$('tip');if(d&&d.style)d.style.display='none';tipEl=null}
document.addEventListener('mouseover',e=>{const el=e.target.closest&&e.target.closest('[data-tip]');if(el)showTip(el,e.clientX,e.clientY);else if(tipEl)hideTip()});
document.addEventListener('mousemove',e=>{if(tipEl)showTip(tipEl,e.clientX,e.clientY)});
document.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;const el=e.target.closest&&e.target.closest('[data-tip]');if(!el)return;
  if(!el.closest('button')){showTip(el,e.clientX,e.clientY);setTimeout(hideTip,4000);return}
  clearTimeout(lpT);lpF=0;const x=e.clientX,y=e.clientY;lpT=setTimeout(()=>{lpF=1;showTip(el,x,y)},450)});
document.addEventListener('pointerup',()=>clearTimeout(lpT));
document.addEventListener('click',e=>{if(popB&&!e.target.closest('.bpop,[data-a="bpop"]')&&!(popB==='cl:shelf'&&e.target.closest('#dlg'))){popB='';dirty=1;if(!e.target.closest('[data-a]'))render()}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&popB){popB='';render()}});
if(typeof addEventListener==='function')addEventListener('resize',()=>{if(popB)placePop()});
document.addEventListener('toggle',e=>{const d=e.target;if(d&&d.isConnected&&d.classList.contains('shore-alist'))shoreListOpen=d.open?1:0;if(d&&d.classList&&d.classList.contains('ledg'))s.ldOpen=d.open?1:0;if(d&&d.classList&&d.classList.contains('sett'))ftOpen=d.open?1:0},true);
document.addEventListener('click',e=>{if(lpF){lpF=0;e.preventDefault();e.stopImmediatePropagation();setTimeout(hideTip,2500)}},true);
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||el.disabled||el.getAttribute('aria-disabled')==='true')return;
  if(el.dataset.a!=='bpop'&&el.dataset.cd&&onCd(el.dataset.cd)&&(el.classList.contains('ob')||el.classList.contains('hs'))){nope(el);return}
  const isHs=el.classList.contains('hs')||el.classList.contains('ob'),r0=isHs?Object.assign({},s.r):null;if(isHs){s.hsU=s.hsU||{};if(!s.hsU[el.dataset.k]){s.hsU[el.dataset.k]=1;el.classList.remove('pulse')}}
  act(el.dataset.a,el.dataset.i);if(isHs)hsPop(el,e,r0);if(isHs&&el.dataset.a==='gather'){if(dirty)render();const now=document.querySelector('.scn [data-sk="gather"]');if(now)pressFx(now,e)}else{if(isHs)pressFx(el,e);if(dirty)render()}save()});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.matches&&e.target.matches('input[data-rid]')){act('riddle',e.target.dataset.rid);render();save();return}
  if((e.key==='Enter'||e.key===' ')&&e.target.getAttribute&&e.target.getAttribute('role')==='button'&&e.target.dataset.a){e.preventDefault();act(e.target.dataset.a,e.target.dataset.i);render();save();return}
  if(s.cb&&!(e.target.matches&&e.target.matches('input'))){const K={ArrowUp:'0,-1',ArrowDown:'0,1',ArrowLeft:'-1,0',ArrowRight:'1,0',Home:'-1,-1',PageUp:'1,-1',End:'-1,1',PageDown:'1,1'};
    if(K[e.key]){e.preventDefault();act('c_mv',K[e.key]);render();save()}}});
document.addEventListener('pointerdown',()=>{ptr=1;s.lastAct=Date.now()});
document.addEventListener('keydown',()=>{s.lastAct=Date.now()},true);
document.addEventListener('wheel',e=>{const el=e.target.closest&&e.target.closest('.chr-tl');if(!el||Math.abs(e.deltaY)<=Math.abs(e.deltaX))return;const mx=el.scrollWidth-el.clientWidth;if(mx<=0)return;if((e.deltaY<0&&el.scrollLeft<=0)||(e.deltaY>0&&el.scrollLeft>=mx-1))return;el.scrollLeft+=e.deltaY;e.preventDefault()},{passive:false});
document.addEventListener('pointerup',()=>{ptr=0});
document.addEventListener('pointercancel',()=>{ptr=0});

load();checks();snap9(s.tab);render();auUI();
let last=Date.now(),sv=0;
setInterval(()=>{const now=Date.now(),dt=Math.max(0,Math.min(7200,(now-last)/1000));last=now;s.t+=dt;
  for(let r=dt;r>0;r-=5)produce(Math.min(5,r));checks(dt);
  const typing=document.activeElement&&document.activeElement.tagName==='INPUT'&&document.activeElement.type!=='range';
  cbOverTick();
  if(tideViewKey()!==paintedTide)dirty=1;
  const anim=s.cb&&Date.now()<fxBusy;
  if(dirty&&!typing&&!ptr&&!anim)render();else if(!anim)refresh();
  if((sv+=dt)>=3){sv=0;save()}},250);
