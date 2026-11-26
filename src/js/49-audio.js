/* ============ ЗВУК: ембієнт, тиха музика, звуки дій ============
   Усе синтезується WebAudio на льоту, без файлів. Стартує з першого дотику (так вимагають браузери). */
const AU={ctx:null,m:null,g:{},n:null,scene:'',crT:0,gullT:0,musT:0,on:0};
const auS=()=>{s.audio=s.audio||{on:1,amb:60,mus:35,sfx:70};return s.audio};
function auInit(){if(AU.ctx)return;const AC=typeof AudioContext!=='undefined'?AudioContext:typeof webkitAudioContext!=='undefined'?webkitAudioContext:null;if(!AC)return;
  try{const c=new AC();AU.ctx=c;AU.m=c.createGain();AU.m.connect(c.destination);
    for(const k of['amb','mus','sfx']){AU.g[k]=c.createGain();AU.g[k].connect(AU.m)}
    const len=c.sampleRate*2,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);let br=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;br=(br+0.02*w)/1.02;d[i]=w*0.5+br*3}AU.n=b;
    /* прибій: шум крізь низькочастотний фільтр, гучність гойдається хвилями */
    const surf=auNoise(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=480;const sg=c.createGain();sg.gain.value=0.5;surf.connect(lp);lp.connect(sg);
    const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=0.09;lg.gain.value=0.35;lfo.connect(lg);lg.connect(sg.gain);lfo.start();
    AU.surf=c.createGain();AU.surf.gain.value=0;sg.connect(AU.surf);AU.surf.connect(AU.g.amb);
    /* вітер: смуговий фільтр, що повільно блукає */
    const wind=auNoise(),bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=700;bp.Q.value=0.8;const wl=c.createOscillator(),wlg=c.createGain();wl.frequency.value=0.05;wlg.gain.value=350;wl.connect(wlg);wlg.connect(bp.frequency);wl.start();
    AU.wind=c.createGain();AU.wind.gain.value=0;wind.connect(bp);bp.connect(AU.wind);AU.wind.connect(AU.g.amb);
    /* музика: тиха луна-затримка */
    const dl=c.createDelay(2);dl.delayTime.value=0.46;const fb=c.createGain();fb.gain.value=0.38;const dlp=c.createBiquadFilter();dlp.type='lowpass';dlp.frequency.value=1800;
    AU.mbus=c.createGain();AU.mbus.connect(AU.g.mus);AU.mbus.connect(dl);dl.connect(dlp);dlp.connect(fb);fb.connect(dl);dlp.connect(AU.g.mus);
    AU.on=1;auVol();auScene(true);setInterval(auTick,200)}catch(e){AU.ctx=null}}
function auNoise(){const c=AU.ctx,src=c.createBufferSource();src.buffer=AU.n;src.loop=true;src.start(0,Math.random()*2);return src}
function auVol(){if(!AU.ctx)return;const a=auS(),t=AU.ctx.currentTime;try{if(a.on)AU.ctx.resume();else setTimeout(()=>{if(AU.ctx&&!auS().on)AU.ctx.suspend()},500)}catch(e){}AU.m.gain.setTargetAtTime(a.on?0.9:0,t,0.15);
  AU.g.amb.gain.setTargetAtTime(a.amb/100,t,0.2);AU.g.mus.gain.setTargetAtTime(a.mus/100*0.6,t,0.2);AU.g.sfx.gain.setTargetAtTime(a.sfx/100*0.8,t,0.05)}
/* Кожна вкладка має свій шум: біля вогнища — тріск, на березі — прибій і мартини. */
function auScene(force){if(!AU.ctx)return;const sc=s.cb?'cb':s.tab==='shore'?'shore':s.tab==='home'?'home':'in';if(sc===AU.scene&&!force)return;AU.scene=sc;const t=AU.ctx.currentTime;
  const surf={shore:0.55,home:0.3,cb:0.15,in:0.12}[sc],wind={shore:0.1,home:0.07,cb:0.05,in:0.05}[sc];AU.surf.gain.setTargetAtTime(surf,t,1.2);AU.wind.gain.setTargetAtTime(wind,t,1.2)}
function auTick(){if(!AU.ctx||!auS().on)return;if(AU.ctx.state==='suspended'){try{AU.ctx.resume()}catch(e){}}auScene();const now=AU.ctx.currentTime;
  if(AU.scene==='home'&&(s.b.hearth||s.r.ember>0)){if(now>AU.crT){auCrackle(now);AU.crT=now+0.05+Math.random()*(s.b.hearth?0.35:0.9)}}
  if(AU.scene==='shore'&&now>AU.gullT){if(AU.gullT)auGull(now);AU.gullT=now+14+Math.random()*26}
  if(now>AU.musT-1){auPhrase(Math.max(now,AU.musT));AU.musT=Math.max(now,AU.musT)+7+Math.random()*6}}
function env(g,t,a,peak,dec){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec)}
function auBurst(t,{f=2000,type='highpass',q=0.7,peak=0.3,a=0.002,dec=0.05,bus='amb',rate=1}){const c=AU.ctx,n=c.createBufferSource();n.buffer=AU.n;n.playbackRate.value=rate;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=c.createGain();
  n.connect(fl);fl.connect(g);g.connect(AU.g[bus]);env(g,t,a,peak,dec);n.start(t,Math.random()*1.5);n.stop(t+a+dec+0.05)}
function auTone(t,{f=440,f2=0,type='sine',peak=0.2,a=0.005,dec=0.3,bus='sfx'}){const c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+a+dec);o.connect(g);g.connect(bus==='mus'?AU.mbus:AU.g[bus]);env(g,t,a,peak,dec);o.start(t);o.stop(t+a+dec+0.05)}
function auCrackle(t){auBurst(t,{f:1800+Math.random()*2500,peak:0.08+Math.random()*0.18,dec:0.015+Math.random()*0.03});if(Math.random()<0.15)auBurst(t+0.02,{f:300,type:'lowpass',peak:0.12,dec:0.12})}
function auGull(t){const n=2+Math.floor(Math.random()*3);for(let i=0;i<n;i++){const t0=t+i*(0.28+Math.random()*0.1),c=AU.ctx,o=c.createOscillator(),g=c.createGain(),v=c.createOscillator(),vg=c.createGain();
  o.type='triangle';o.frequency.setValueAtTime(1500,t0);o.frequency.exponentialRampToValueAtTime(900,t0+0.22);v.frequency.value=28;vg.gain.value=40;v.connect(vg);vg.connect(o.frequency);o.connect(g);g.connect(AU.g.amb);env(g,t0,0.02,0.035,0.22);o.start(t0);v.start(t0);o.stop(t0+0.3);v.stop(t0+0.3)}}
/* Музика: поодинокі ноти мінорної пентатоніки, м’яко, з довгим загасанням. */
const PENT=[146.83,174.61,196,220,261.63,293.66,349.23,392,440];
function auPhrase(t){const r=Math.random();if(r<0.35){const b=PENT[Math.floor(Math.random()*3)];for(const m of[1,1.5])auTone(t,{f:b*m/2,type:'sine',peak:0.05,a:1.8,dec:5,bus:'mus'})}
  const k=2+Math.floor(Math.random()*3);let ix=3+Math.floor(Math.random()*4);for(let i=0;i<k;i++){ix=Math.max(0,Math.min(PENT.length-1,ix+[-2,-1,1,2][Math.floor(Math.random()*4)]));auTone(t+0.3+i*(0.7+Math.random()*0.6),{f:PENT[ix],type:'triangle',peak:0.045,a:0.04,dec:2.2,bus:'mus'})}}
/* Звуки дій */
function sfx(k){if(!AU.ctx||!auS().on)return;try{const t=AU.ctx.currentTime+0.01;
  switch(k){
  case'tap':auBurst(t,{f:900,type:'bandpass',q:1.2,peak:0.5,dec:0.07,bus:'sfx'});auTone(t,{f:190,f2:120,peak:0.25,dec:0.08});break;
  case'metal':auTone(t,{f:1650,type:'square',peak:0.05,dec:0.12});auTone(t,{f:2470,peak:0.06,dec:0.25});auBurst(t,{f:3000,peak:0.15,dec:0.04,bus:'sfx'});break;
  case'splash':auBurst(t,{f:1400,type:'lowpass',peak:0.45,a:0.02,dec:0.35,bus:'sfx',rate:0.8});auBurst(t+0.08,{f:3500,peak:0.12,dec:0.2,bus:'sfx'});break;
  case'ember':auBurst(t,{f:600,type:'bandpass',q:0.6,peak:0.3,a:0.12,dec:0.4,bus:'sfx'});break;
  case'build':auBurst(t,{f:700,type:'bandpass',peak:0.5,dec:0.08,bus:'sfx'});auBurst(t+0.18,{f:600,type:'bandpass',peak:0.45,dec:0.1,bus:'sfx'});auTone(t,{f:150,f2:90,peak:0.25,dec:0.15});break;
  case'craft':auTone(t,{f:1180,peak:0.12,dec:0.6});auTone(t,{f:1770,peak:0.07,dec:0.45});break;
  case'hit':auTone(t,{f:880,peak:0.12,dec:0.25});auTone(t+0.07,{f:1320,peak:0.1,dec:0.35});break;
  case'miss':auTone(t,{f:220,f2:150,type:'triangle',peak:0.12,dec:0.18});break;
  case'nope':auTone(t,{f:330,f2:260,type:'triangle',peak:0.06,dec:0.1});break;
  case'fishBite':auTone(t,{f:523,peak:0.035,dec:0.27});auTone(t+0.13,{f:659,peak:0.025,dec:0.32});break;
  case'chime':[0,4,7,12].forEach((st,i)=>auTone(t+i*0.11,{f:392*Math.pow(2,st/12),peak:0.09,dec:1.2}));break;
  case'rakeSand':auBurst(t,{f:1250,type:'bandpass',q:.65,peak:.18,a:.065,dec:.24,bus:'sfx'});auTone(t+.35,{f:1580,peak:.042,dec:.14});break;
  case'page':auBurst(t,{f:2500,type:'bandpass',q:0.5,peak:0.12,a:0.03,dec:0.18,bus:'sfx'});break;
  case'bell':auTone(t,{f:1568,peak:0.08,dec:1.4});auTone(t,{f:2350,peak:0.04,dec:0.9});break;
  case'horn':{const c=AU.ctx,o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=98;lp.type='lowpass';lp.frequency.value=420;o.connect(lp);lp.connect(g);g.connect(AU.g.sfx);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.22,t+0.8);g.gain.setValueAtTime(0.22,t+1.6);g.gain.exponentialRampToValueAtTime(0.0001,t+3);o.start(t);o.stop(t+3.1);break}
  case'strike':auBurst(t,{f:1200,type:'bandpass',peak:0.4,dec:0.06,bus:'sfx'});auTone(t,{f:160,f2:80,peak:0.2,dec:0.1});break}}catch(e){}}
const SFXA={smith:'strike',gather:'tap',scrapw:'metal',fishing:'splash',blow:'ember',bld:'build',floor:'build',craft:'craft',wup:'craft',repair:'build',schooner:'build',c_atk:'strike',c_shoot:'strike'};
/* Панель звуку живе поза перемальовуванням, тож повзунки не зриваються. */
function auUI(){const el=typeof document!=='undefined'&&document.getElementById('snd');if(!el||!el.querySelector)return;const a=auS();
  el.innerHTML=`<details class="sett"><summary>Звук</summary><div class="setb sndb"><button type="button" class="toggle" id="sndOn">${a.on?'Звук: увімкнено':'Звук: вимкнено'}</button>
    ${[['amb','Море й вітер'],['mus','Музика'],['sfx','Звуки дій']].map(([k,n])=>`<label class="sndr"><span>${n}</span><input type="range" min="0" max="100" step="1" value="${a[k]}" data-snd="${k}" aria-label="${n}"></label>`).join('')}</div></details>`;
  el.querySelector('#sndOn').onclick=e=>{a.on=a.on?0:1;e.target.textContent=a.on?'Звук: увімкнено':'Звук: вимкнено';auInit();auVol();save()};
  el.querySelectorAll('input[data-snd]').forEach(r=>{r.oninput=()=>{a[r.dataset.snd]=+r.value;auInit();auVol()};r.onchange=()=>{save();if(r.dataset.snd==='sfx')sfx('hit')}})}
if(typeof document!=='undefined'&&document.addEventListener){const go=()=>{if(auS().on)auInit()};document.addEventListener('pointerdown',go,true);document.addEventListener('keydown',go,true)}
