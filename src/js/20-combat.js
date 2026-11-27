/* ============ TACTICAL COMBAT ============ */
let GW=11,GH=7;
function setGrid(c){const m=(c&&c.map)||ARENA[c.a];GH=m.length;GW=m[0].length}
function tileAt(a,x,y){const m=(s.cb&&s.cb.a===a&&s.cb.map)||ARENA[a];if(x<0||y<0||y>=m.length||x>=m[0].length)return'#';return m[y][x]}
const solid=t=>t==='#'||t==='+';
const dist=(a,b,c,d)=>Math.max(Math.abs(a-c),Math.abs(b-d));
const sgn=v=>Math.sign(v);
const isObj=u=>!!EN[u.t].obj;
const alive=c=>c.u.filter(u=>u.hp>0&&!isObj(u)&&!EN[u.t].ally);
const DIFF_HP=1.12,DIFF_DMG=0.85;
const ELITE={arm:{n:'броня',d:'+2 броні'},fury:{n:'лють',d:'+30% урону'},swift:{n:'прудкість',d:'+2 до ходу, +10% ухилення'},mist:{n:'туман',d:'+20% ухилення'},tough:{n:'живучість',d:'+50% здоров’я'}};
const eliteCh=()=>Math.min(0.35,Math.max(0,(s.h.lvl-3)*0.045));
function mkUnit(t,x,y,mult,o){const T=EN[t];const hp=Math.round(T.hp*(T.obj?1:(mult||1)*(T.ally?1:DIFF_HP)));const u={t,x,y,hp,max:hp,step:0,wind:0,aimed:0,burn:0,bleed:0,stun:0,pin:0,weak:0,acted:0,veil:0};
  if(o&&o.elite&&!T.obj&&!T.boss&&!T.ally){const ks=Object.keys(ELITE);u.el=ks[Math.floor(Math.random()*ks.length)];if(u.el==='tough')u.hp=u.max=Math.round(hp*1.5)}
  if(T.amb)u.hid=1;return u}
const uArm=u=>EN[u.t].arm+(u.el==='arm'?2:0)+(u.ward?2:0);
const HUMAN={scout:1,brute:1,smuggler:1,harpooner:1,medic:1};
function unitAt(c,x,y){return c.u.find(u=>u.hp>0&&u.x===x&&u.y===y)}
function los(c,x0,y0,x1,y1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*4;
  for(let i=1;i<n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);
    if((x===x0&&y===y0)||(x===x1&&y===y1))continue;{const tt=tileAt(c.a,x,y);if(tt==='#'||tt==='f')return false}}return true}
function cover(c,dx,dy,ax,ay){if(dist(dx,dy,ax,ay)<=1)return 0;const sx=Math.sign(ax-dx),sy=Math.sign(ay-dy);let v=0;
  const k=(x,y)=>{const t=tileAt(c.a,x,y);if(t==='+')v=Math.max(v,25);if(t==='#')v=Math.max(v,40)};
  if(sx)k(dx+sx,dy);if(sy)k(dx,dy+sy);if(sx&&sy)k(dx+sx,dy+sy);return v}
function costMap(c,sx,sy,mode,self){const D=[];for(let y=0;y<GH;y++)D.push(Array(GW).fill(Infinity));D[sy][sx]=0;
  const q=[[sx,sy]];
  const okT=(x,y)=>{if(x<0||y<0||x>=GW||y>=GH)return false;const t=tileAt(c.a,x,y);
    if(mode==='fly')return true;if(mode==='swim')return t==='~';return!solid(t)};
  const stepC=(x,y)=>(mode==='fly'||mode==='swim'?1:(tileAt(c.a,x,y)==='~'?2:1))+(self&&c.fire&&c.fire.some(f=>f.x===x&&f.y===y)?3:0);
  while(q.length){q.sort((a,b)=>D[a[1]][a[0]]-D[b[1]][b[0]]);const[x,y]=q.shift();
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(!okT(nx,ny))continue;
      if(dx&&dy&&mode!=='fly'&&(!okT(x+dx,y)||!okT(x,y+dy)))continue;
      const occH=c.hx===nx&&c.hy===ny,ou=unitAt(c,nx,ny);if(occH||(ou&&ou!==self))continue;
      const nc=D[y][x]+stepC(nx,ny);if(nc<D[ny][nx]){D[ny][nx]=nc;q.push([nx,ny])}}}
  return D}
const canStand=(c,x,y,mode)=>{if(x<0||y<0||x>=GW||y>=GH)return false;const t=tileAt(c.a,x,y);return mode==='swim'?t==='~':!solid(t)};
/* шлях клітинка за клітинкою (для анімації ходьби): від цілі назад по спадній вартості */
function cbPath(c,x0,y0,x1,y1,mode,self){const D=costMap(c,x0,y0,mode,self);if(!(D[y1]&&isFinite(D[y1][x1])))return[[x0,y0],[x1,y1]];
  const P=[[x1,y1]];let x=x1,y=y1,g=0;const ok=(xx,yy)=>xx>=0&&yy>=0&&xx<GW&&yy<GH&&(mode==='fly'||canStand(c,xx,yy,mode));
  while((x!==x0||y!==y0)&&g++<80){let b=null,bv=D[y][x];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const nx=x+dx,ny=y+dy;if(!ok(nx,ny)||!(D[ny][nx]<bv))continue;
      if(dx&&dy&&mode!=='fly'&&(!ok(nx,y)||!ok(x,ny)))continue;if(!b||D[ny][nx]<D[b[1]][b[0]])b=[nx,ny]}
    if(!b)break;x=b[0];y=b[1];P.unshift([x,y])}
  if(x!==x0||y!==y0)P.unshift([x0,y0]);return P}
const STEPMS=150;
/* рух юніта з анімацією ходьби по шляху */
function fxWalk(c,u,x1,y1,mode,who){const x0=who==='hero'?c.hx:u.x,y0=who==='hero'?c.hy:u.y;const p=cbPath(c,x0,y0,x1,y1,mode,who==='hero'?null:u);
  const wet=p.slice(1).filter(([x,y])=>tileAt(c.a,x,y)==='~').length,d=Math.min(1400,(p.length-1)*STEPMS+wet*60+60);fxP({t:'mv',x0,y0,x1,y1,p,m:mode,d},d)}
/* кінець бою: у браузері — спершу доиграти анімацію останніх ударів */
const fxHold=()=>typeof requestAnimationFrame==='function'&&typeof window!=='undefined'&&!RM();
function cbEnd(k){const c=s.cb;if(c&&fxHold()){c.over=k;c.overT=Date.now()+300;if(k==='lose')cbLog('Ти падаєш на коліна…');else cbLog('Останній ворог падає.');dirty=1;return}
  if(k==='lose')lose();else win()}
function cbOverTick(){const c=s.cb;if(!c||!c.over)return;if(Date.now()<c.overT||Date.now()<fxBusy+650)return;const k=c.over;c.over=0;if(k==='lose')lose();else win();dirty=1}
/* скільки може завдати ворог наприкінці ходу, якщо влучить (для попередження) */
function foeThreat(c,u){const T=EN[u.t];if(u.hp<=0||isObj(u)||T.ally||u.hid||u.stun||u.role)return 0;const[k,v,,rg]=uIntent(u);const d=dist(u.x,u.y,c.hx,c.hy),mv=u.pin>0?0:T.mv+(u.el==='swift'?2:0);
  const m=(c.mult||1)*DIFF_DMG*(u.el==='fury'?1.3:1)*(T.enr&&u.hp<u.max/2?1.3:1)*(u.weak?.5:1)*(c.guard?1-guardPct(d<=1)/100:1);
  const hit=(x,ign)=>Math.max(1,Math.round(x*m)-(ign?0:armor()));
  if(['hit','cold','wrap','charge'].includes(k))return d-1<=mv?hit(v*(u.wind?2:1)*(k==='charge'&&d>=2?1.3:1)+(T.pack?1:0),k==='cold'):0;
  if(['shoot','bolt','spit'].includes(k))return d<=(rg||1)+mv?hit(v,k==='bolt'):0;
  if(k==='wave')return d<=rg?hit(v):0;if(k==='hook')return d<=rg?hit(6):0;return 0}
function cbThreat(c){if(c.hidden||c.smoke)return 0;return c.u.reduce((a,u)=>a+foeThreat(c,u),0)}
const FAM={leech:'eel',urchin:'crab',harpooner:'silent',medic:'silent',wolf:'fog',gullking:'gull',icedrowned:'fog',toad:'eel',crab:'crab',bigcrab:'crab',crabking:'crab',gull:'gull',eel:'eel',scout:'silent',brute:'silent',gnat:'silent',rat:'silent',hound:'silent',smuggler:'silent',wraith:'fog',drowned:'fog',witch:'fog',heart:'fog',shark:'shark',sentinel:'stone'};
const famRs=u=>!!s.rs['a_'+FAM[u.t]];
const pierceBonus=()=>(s.h.ft.crack?1:0)+(s.rs.weak?1:0)+(s.rs.a_stone?1:0);
const lastStand=()=>s.h.ft.last&&s.h.hp<maxHP()/3?1.5:1;

function startFight(encId,win){const E0=ENC[encId];
  const mult=(E0.mult||1)*(E0.fixed?1:E0.boss?1+(FOEST[stageNo()]-1)*.4:FOEST[stageNo()]),sn=snap(),hpm=win==='raid'&&fuL('hall')>=3?0.85:1;const u=E0.e.map(([t,x,y,role,ex])=>{const T=EN[t];if(!T.obj&&!T.ally)s.seenE[t]=1;const v=mkUnit(t,x,y,mult*hpm,{elite:!E0.noElite&&Math.random()<eliteCh()});if(role)v.role=role;if(ex)Object.assign(v,ex);if(T.ally&&s.h.ft.leader){v.hp=v.max=Math.round(v.max*1.5)}return v});
  const foes=u.filter(x=>!EN[x.t].obj&&!EN[x.t].ally);
  s.cb={enc:encId,a:E0.a,map:ARENA[E0.a].slice(),round:0,fire:[],fx:[],fxt:0,hx:E0.h[0],hy:E0.h[1],u,ap:maxAP()+(s.h.ft.shadow?2:0),guard:0,sand:0,wrap:0,breath:0,sel:u.indexOf(foes[0]),win,boss:!!E0.boss,cds:{},traps:[],mode:'',mult,sn,wmg:{},
    title:win==='raid'?'Набіг Мли':win==='crab1'?'Перша сутичка':win&&win.indexOf('S:')===0?SHF[win.slice(2)].n:(win&&win.indexOf('L:')===0?(()=>{const id=win.slice(2);return`${LOC[id.split('.')[0]].n}`})():'Бій'),
    log:[`${foes.filter(x=>!x.hid).map(x=>E(EN[x.t].n)).join(', ')} — бій починається!${s.h.ft.shadow?' Ти діяв першим: +2 ОД.':''}${E0.waves?' Схоже, вони тут не самі.':''}${E0.tide?' Вода прибуває.':''}${foes.some(x=>x.el)?' Серед них є ветерани.':''}`]};setGrid(s.cb);wolfJoin(s.cb);if((s.h.buf||{}).full>0){s.h.buf.full--;s.cb.ap++;s.cb.log.push('Ти ситий: +1 очко дії.')}
  if(E0.palis)s.cb.map=s.cb.map.map((r,y)=>r.split('').map((ch,x)=>E0.palis.some(q=>q[0]===x&&q[1]===y)&&ch==='.'?'+':ch).join(''));
  if(E0.traps)s.cb.traps=E0.traps.map(([x,y])=>({x,y}));if(E0.bell)s.cb.ap+=2;
  if(st('stealth')>=2&&Math.random()<0.06*st('stealth')){s.cb.hidden=1;cbLog('Ти підкрався непомітно: вороги тебе ще не бачать, а перший удар буде критичним.')}
  dirty=1}
function fxP(e,adv){const c=s.cb;if(!c)return;c.fx=c.fx||[];c.fxt=c.fxt||0;e.at=c.fxt;c.fx.push(e);c.fxt+=adv||0}
function addFire(c,x,y){c.fire=c.fire||[];const cand=[[x,y],...[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].sort(()=>Math.random()-.5).slice(0,2).map(([dx,dy])=>[x+dx,y+dy])];
  for(const[fx,fy]of cand){const tt=tileAt(c.a,fx,fy);if(solid(tt)||tt==='~'||tt==='#')continue;const f=c.fire.find(q=>q.x===fx&&q.y===fy);if(f)f.t=3;else c.fire.push({x:fx,y:fy,t:3})}}
function freeNear(c,x,y){for(let r=0;r<5;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const nx=x+dx,ny=y+dy;if(canStand(c,nx,ny,'walk')&&tileAt(c.a,nx,ny)!=='~'&&!unitAt(c,nx,ny)&&!(nx===c.hx&&ny===c.hy))return[nx,ny]}return null}
function envTurn(c){c.round=(c.round||0)+1;const E0=ENC[c.enc]||{};
  if(c.fire&&c.fire.length){for(const f of c.fire){for(const u of c.u)if(u.hp>0&&!isObj(u)&&u.x===f.x&&u.y===f.y){u.hp-=3;fxP({t:'txt',x:u.x,y:u.y,v:'−3',k:'hit'},80);cbLog(`${E(EN[u.t].n)} стоїть у вогні: −3.`);if(u.hp<=0)kill(u)}
      if(c.hx===f.x&&c.hy===f.y){s.h.hp-=3;fxP({t:'txt',x:c.hx,y:c.hy,v:'−3',k:'hurt'},80);cbLog('Ти стоїш у вогні: −3 здоров’я.')}}
    c.fire.forEach(f=>f.t--);c.fire=c.fire.filter(f=>f.t>0)}
  if(E0.tide&&c.round%3===0&&(c.tides||0)<3){c.tides=(c.tides||0)+1;const m=c.map.map(r=>r.split(''));let n=0;
    for(let y=0;y<m.length;y++)for(let x=0;x<m[0].length;x++)if(c.map[y][x]==='.'&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>(c.map[y+dy]||'')[x+dx]==='~')){m[y][x]='~';n++}
    c.map=m.map(r=>r.join(''));if(n)cbLog('Приплив: вода наступає на мілину. Ходити стає важче.')}
  for(const w of E0.waves||[])if(w[0]===c.round){const add=[];for(const[tp,x,y]of w[1]){const q=freeNear(c,x,y);if(!q)continue;const T=EN[tp],hp=Math.round(T.hp*(c.mult||1)*DIFF_HP);
      c.u.push({t:tp,x:q[0],y:q[1],hp,max:hp,step:0,wind:0,aimed:0,burn:0,bleed:0,stun:0,pin:0,weak:0,acted:0,veil:0});s.seenE[tp]=1;add.push(E(T.n));fxP({t:'appear',x:q[0],y:q[1]},160)}
    if(add.length)cbLog(`Підмога: ${add.join(', ')}!`)}}
function cbLog(m){s.cb.log.unshift(m);if(s.cb.log.length>9)s.cb.log.length=9}
function uIntent(u){const T=EN[u.t];return T.p[u.step%T.p.length]}
function uStance(u){const k=uIntent(u)[0];return STANCE[k]?k:''}
function selU(){const c=s.cb;let u=c.u[c.sel];if(!u||u.hp<=0||u.hid||EN[u.t].ally||EN[u.t].struct){c.sel=c.u.findIndex(x=>x.hp>0&&!isObj(x)&&!x.hid&&!EN[x.t].ally);if(c.sel<0)c.sel=c.u.findIndex(x=>x.hp>0);u=c.u[c.sel]}return u}
const fadeEva=()=>s.rs.a_fog?0:(s.eq.light?20:40);
function evaOf(u,rg){const T=EN[u.t],sv=uStance(u),w=rg?s.eq.ranged:s.eq.weapon;if(u.pin>0)return 0;if(!rg&&w==='knife')return 0;return(u.veil?30:0)+(u.el==='swift'?10:0)+(u.el==='mist'?20:0)-(T.mist&&s.cb&&s.cb.win==='raid'&&s.def&&s.def.brazier?20:0)+T.eva+(sv==='dive'&&!(!rg&&w==='harpoon')?60:0)+(sv==='fade'?fadeEva():0)}
/* «Зосередження»: кожен промах — +15 % до наступного удару (до +45), влучання скидає */
function focusMiss(c){if(!c)return;c.focus=Math.min(45,(c.focus||0)+15);cbLog(`Ти зосереджуєшся: +${c.focus}% до наступного удару.`)}
function meleeCh(u,pen=0){const c=s.cb;if(isObj(u))return 97;return clamp(80+(c.focus||0)+4*s.h.a.dex+5*s.h.k.melee+(s.h.ft.grip?5:0)+(famRs(u)?10:0)-evaOf(u)-(c.sand?30:0)-pen,5,97)}
function shotCh(u,bonus=0){const c=s.cb,d=dist(c.hx,c.hy,u.x,u.y);if(isObj(u))return 95;
  return clamp(70+(c.focus||0)+4*st('per')+3*s.h.a.dex+(s.h.ft.steady?5:0)+(s.h.ft.eye?10:0)+(famRs(u)?10:0)+(s.eq.ranged==='crossbow'&&wmLv('crossbow')>=3?10:0)+(s.eq.ranged==='pistol'&&wF('pistol')>=1?15:0)+bonus-4*Math.max(0,d-3)-(s.eq.ranged==='pistol'?0:cover(c,u.x,u.y,c.hx,c.hy))-evaOf(u,1)-(c.sand?30:0),5,95)}
function canShoot(u){const c=s.cb;if(!s.eq.ranged)return false;const d=dist(c.hx,c.hy,u.x,u.y);return d>1&&d<=rngOf()&&los(c,c.hx,c.hy,u.x,u.y)}
function canBomb(u){const c=s.cb;const d=dist(c.hx,c.hy,u.x,u.y);return has('bomb')&&d<=4&&(d<=1||los(c,c.hx,c.hy,u.x,u.y))}
function dmgTo(u,base,mult,pierce,src){const T=EN[u.t],c=s.cb;gripFree(c,u);let d=base+(famRs(u)?1:0);const w=src==='r'?s.eq.ranged:src==='m'?s.eq.weapon:'';
  let crit=Math.random()*100<critCh()+(w==='knife'&&wmLv('knife')>=5?20:0);if(s.h.ft.ambush&&!u.acted&&!T.obj)crit=true;if(c&&c.hidden&&(src==='m'||src==='r')){crit=true;c.hidden=0;cbLog('Удар з тіні!')}
  if(w==='harpoon'&&wmLv('harpoon')>=3&&(T.fly||T.swim))d+=2;
  if(w==='sling'&&T.fly)d*=2;
  if(w==='sabre'&&wF('sabre')>=2&&T.mist)d*=2;
  if(w==='cleaver'&&wmLv('cleaver')>=5&&u.hp<u.max/2)d*=1.5;
  if(w==='pistol'&&wmLv('pistol')>=3&&dist(c.hx,c.hy,u.x,u.y)<=2)d*=1.5;
  if(w==='pistol'&&wmLv('pistol')>=5&&T.boss)d*=1.25;
  if(crit)d*=1.5;d*=mult*lastStand();
  const sv=uStance(u);
  if(sv&&w==='cleaver'&&src==='m'&&wF('cleaver')>=1){u.step++;cbLog(`Сокира збиває ворога «${T.n}» зі стійки!`)}
  else if(sv==='shell'){if(w==='oar'){u.stun=1;cbLog(`Весло перевертає ворога «${T.n}» догори черевом!`)}else d*=(w==='cleaver'?0.5:0.25)}
  else if(sv==='stone')d*=0.5;
  if(crit&&w==='knife'&&src==='m'&&wF('knife')>=2&&c){c.ap+=1;cbLog('Стилет: +1 ОД.')}
  const arm=Math.max(0,uArm(u)-(u.armDown||0)-(pierce||0)-pierceBonus());d=Math.max(1,Math.round(d)-arm);u.hp-=d;
  if(w==='cleaver'&&wmLv('cleaver')>=3&&T.arm-(u.armDown||0)>0){u.armDown=(u.armDown||0)+1}
  cbLog(`${crit?'Критичний удар! ':''}${E(T.n)}: −${d} здоров’я.`);fxP({t:'txt',x:u.x,y:u.y,v:'−'+d+(crit?'!':''),k:crit?'crit':'hit'},130);
  if(u.hp<=0){kill(u);if(w==='sabre'&&src==='m'&&wmLv('sabre')>=5&&!T.obj){c.ap+=2;cbLog('Танець клинка: +2 ОД.')}}
  if(w&&!T.obj)wmGain(w,u.hp<=0?3:1);return d}
function kill(u){const T=EN[u.t],c=s.cb;u.hp=0;if(T.ally)wolfDown(u);fxP({t:'die',x:u.x,y:u.y,spr:u.t},0);if(T.struct){cbLog(`${E(u.nm||T.n)} зламано!`);if(u.bid&&c){c.broken=c.broken||[];c.broken.push(u.bid)}return}if(T.ally){cbLog('Ополченець падає. Він виживе, але цей бій для нього скінчився.');return}if(T.obj){explode(u);return}
  if(u.loot&&c){c.recov=(c.recov||0)+1;cbLog('Награбоване повернуто!')}
  if(T.burst&&c&&dist(u.x,u.y,c.hx,c.hy)<=1){const x=Math.max(1,Math.round(6*DIFF_DMG)-armor());s.h.hp-=x;fxP({t:'boom',x:u.x,y:u.y,cold:1},100);fxP({t:'txt',x:c.hx,y:c.hy,v:'−'+x,k:'hurt'},80);cbLog(`${E(T.n)} розсипається крижаним вибухом: −${x} здоров’я.`)}
  s.kills[u.t]=(s.kills[u.t]||0)+1;if(HUMAN[u.t]&&fac('silent')>-90)s.fac=Object.assign(s.fac||{},{silent:fac('silent')-1});if(T.loot)T.loot();if(u.el)add('coin',10);const gx=Math.round(T.xp*((s.cb&&s.cb.mult)||1)*(u.el?1.6:1)*((s.cb&&ENC[s.cb.enc]&&ENC[s.cb.enc].xpm)||1));xp(gx);cbLog(`${E(T.n)} переможено. +${gx} досвіду.`)}
function explode(u){const c=s.cb,d=10*(s.h.ft.fire?2:1);cbLog(`Бочка з олією вибухає: ${d} урону всім поруч! Розлита олія горить.`);fxP({t:'boom',x:u.x,y:u.y},150);addFire(c,u.x,u.y);
  for(const v of c.u)if(v!==u&&v.hp>0&&!EN[v.t].struct&&dist(v.x,v.y,u.x,u.y)<=1){const T=EN[v.t];const x=Math.max(1,d-T.arm);v.hp-=x;v.burn=2;if(!T.obj){cbLog(`${E(T.n)}: −${x}, горить.`);fxP({t:'txt',x:v.x,y:v.y,v:'−'+x,k:'hit'},40)}if(v.hp<=0)kill(v)}
  if(dist(c.hx,c.hy,u.x,u.y)<=1){const x=Math.max(1,Math.round(d/2)-armor());s.h.hp-=x;fxP({t:'txt',x:c.hx,y:c.hy,v:'−'+x,k:'hurt'},0);cbLog(`Вибух зачепив і тебе: −${x} здоров’я.`)}}
function inReach(u){const c=s.cb,d=dist(c.hx,c.hy,u.x,u.y);return d<=1||(d<=reach()&&los(c,c.hx,c.hy,u.x,u.y))}
function bleedOn(u){const w=s.eq.weapon;if(((s.h.ft.bleed&&['knife','sabre','cleaver'].includes(w))||(w==='knife'&&wmLv('knife')>=1))&&!isObj(u)&&u.hp>0){u.bleed=3;u.bleedD=w==='knife'&&wF('knife')>=1?4:2;cbLog(`${E(EN[u.t].n)} стікає кров’ю.`)}}
function heroMelee(u,heavy,free){const c=s.cb;if(!u||EN[u.t].struct||EN[u.t].ally||u.hid)return false;let cost=free?0:(heavy?heavyAP():wAP());const kf=!free&&!heavy&&s.eq.weapon==='knife'&&wmLv('knife')>=3&&!c.kfree;if(kf)cost=0;
  if(c.ap<cost||!inReach(u))return false;c.ap-=cost;if(kf)c.kfree=1;
  fxP({t:'bump',x0:c.hx,y0:c.hy,x1:u.x,y1:u.y},110);
  if(Math.random()*100>=meleeCh(u,heavy?10:0)){cbLog('Промах.');focusMiss(s.cb);fxP({t:'txt',x:u.x,y:u.y,v:'мимо',k:'miss'},120);return false}s.cb.focus=0;
  const W=s.eq.weapon?IT[s.eq.weapon]:{},w=s.eq.weapon,base=wDmg()+s.h.a.str-1+(Math.random()<.5?1:0);dmgTo(u,base,heavy?1.8:1,W.pierce||0,'m');bleedOn(u);
  if(EN[u.t].thorns){const x=EN[u.t].thorns;s.h.hp-=x;fxP({t:'txt',x:c.hx,y:c.hy,v:'−'+x,k:'hurt'},60);cbLog(`Голки впиваються в руку: −${x} здоров’я.`)}
  if(w==='oar'&&wF('oar')>=2){c.oarN=(c.oarN||0)+1;if(c.oarN%3===0&&u.hp>0&&!isObj(u)){u.stun=1;cbLog(`Підсік: ${E(EN[u.t].n)} оглушений.`)}}
  if(w==='harpoon'&&wF('harpoon')>=1&&u.hp>0&&!isObj(u)){u.pin=Math.max(u.pin,1);cbLog(`Зазубрини тримають ворога «${EN[u.t].n}» на місці.`)}
  if(w==='cleaver'&&wF('cleaver')>=2){const v=c.u.find(x=>x!==u&&x.hp>0&&!isObj(x)&&dist(x.x,x.y,c.hx,c.hy)<=1);if(v){cbLog('Широкий замах зачіпає ще одного!');dmgTo(v,Math.ceil(base/2),1,W.pierce||0,'m')}}
  if(s.eq.weapon==='harpoon'&&wmLv('harpoon')>=5){const b=unitAt(c,u.x+sgn(u.x-c.hx),u.y+sgn(u.y-c.hy));if(b&&b!==u&&b.hp>0){cbLog('Гарпун прошиває наскрізь!');dmgTo(b,Math.ceil((wDmg()+s.h.a.str-1)/2),1,W.pierce||0,'m')}}
  return true}
const rangedDmg=()=>IT[s.eq.ranged].dmg+2*wF(s.eq.ranged)+Math.floor(st('per')/2)+(s.rs.a_gull?1:0)+(s.eq.ranged==='sling'&&wmLv('sling')>=5?2:0);
function heroShoot(u,o={}){const c=s.cb,cost=o.cost||shotAP();if(!u||EN[u.t].struct||EN[u.t].ally||u.hid||c.ap<cost||!canShoot(u))return false;c.ap-=cost;const w=s.eq.ranged;
  fxP({t:'shot',x0:c.hx,y0:c.hy,x1:u.x,y1:u.y},170);
  if(Math.random()*100>=shotCh(u,o.bonus||0)){cbLog('Постріл мимо.');focusMiss(s.cb);fxP({t:'txt',x:u.x,y:u.y,v:'мимо',k:'miss'},120);return false}s.cb.focus=0;
  const pr=(IT[w].pierce||0)+(w==='crossbow'&&wmLv('crossbow')>=5?2:0)+(w==='crossbow'&&wF('crossbow')>=1?1:0);dmgTo(u,rangedDmg()+(s.h.ft.sniper&&dist(c.hx,c.hy,u.x,u.y)>=5?5:0),o.mult||1,pr,'r');
  if(w==='sling'&&wF('sling')>=1){const v=c.u.find(x=>x!==u&&x.hp>0&&!isObj(x)&&dist(x.x,x.y,u.x,u.y)<=1);if(v){cbLog('Рикошет!');dmgTo(v,Math.ceil(rangedDmg()/2),1,0,'r')}}
  if(w==='pistol'&&wF('pistol')>=2&&u.hp>0){cbLog('Другий пістоль!');dmgTo(u,Math.ceil(rangedDmg()/2),1,pr,'r')}
  if(u.hp>0&&!isObj(u)){if(w==='sling'&&wmLv('sling')>=1&&Math.random()<0.25){u.stun=1;cbLog(`Камінь у скроню: ${E(EN[u.t].n)} оглушений.`)}
    if(w==='crossbow'&&wmLv('crossbow')>=1){const nx=u.x+sgn(u.x-c.hx),ny=u.y+sgn(u.y-c.hy),T=EN[u.t];if(canStand(c,nx,ny,T.swim?'swim':'walk')&&!unitAt(c,nx,ny)&&!(nx===c.hx&&ny===c.hy)){fxP({t:'mv',x0:u.x,y0:u.y,x1:nx,y1:ny,d:160},100);u.x=nx;u.y=ny;cbLog(`Важкий болт відкидає ворога «${T.n}».`);trapCheck(u)}}}
  return true}
function heroBomb(u){const c=s.cb;if(c.ap<2||!canBomb(u)||!beltHas('bomb'))return;c.ap-=2;s.inv.bomb--;const d=Math.round(IT.bomb.v*(s.h.ft.fire?2:1)*(s.h.ft.bombard?1.5:1));
  cbLog(`Бомба вибухає біля цілі: ${d} урону всім поруч.`);fxP({t:'shot',x0:c.hx,y0:c.hy,x1:u.x,y1:u.y,d:260},240);fxP({t:'boom',x:u.x,y:u.y},150);addFire(c,u.x,u.y);
  for(const v of c.u.slice())if(v.hp>0&&dist(v.x,v.y,u.x,u.y)<=1){const T=EN[v.t];const x=Math.max(1,d-T.arm);v.hp-=x;v.burn=2;if(!T.obj){cbLog(`${E(T.n)}: −${x}, горить.`);fxP({t:'txt',x:v.x,y:v.y,v:'−'+x,k:'hit'},40)}if(v.hp<=0)kill(v)}
  if(dist(c.hx,c.hy,u.x,u.y)<=1){const x=Math.max(1,Math.round(d/2)-armor());s.h.hp-=x;cbLog(`Тебе теж зачепило: −${x} здоров’я.`)}}
/* хватка пса: поки тримає, герой не може відійти; будь-який удар по псу (твій чи союзника) його скидає */
function gripU(c){if(!c||c.grip==null)return null;const u=c.u[c.grip];if(!u||u.hp<=0||dist(u.x,u.y,c.hx,c.hy)>1){c.grip=null;return null}return u}
function gripFree(c,u){if(c&&c.grip!=null&&c.u[c.grip]===u){c.grip=null;cbLog(`${E(EN[u.t].n)} розтискає щелепи.`)}}
function heroMove(x,y){const c=s.cb;if(x===c.hx&&y===c.hy)return;const gp=gripU(c);if(gp){cbLog(`${E(EN[gp.t].n)} тримає тебе за ногу. Спершу вдар його.`);return}if(!canStand(c,x,y,'walk')||unitAt(c,x,y))return;
  const D=costMap(c,c.hx,c.hy,'walk');if(D[y][x]>c.ap)return;c.ap-=D[y][x];fxWalk(c,null,x,y,'walk','hero');c.hx=x;c.hy=y}

/* abilities: from weapons and talents */
const ABL={
  push:{n:'Відмах веслом',ap:2,cd:2,tgt:'adj',d:'Відштовхнути ворога поруч на клітинку. Об перешкоду — 4 урону й оглушення.'},
  pull:{n:'Кинути гарпун',ap:3,cd:3,tgt:'ray4',d:'Влучити у ворога до 4 клітинок і підтягнути його впритул.'},
  sweep:{n:'Удар навідліг',ap:4,cd:2,tgt:'none',d:'Тесаком по всіх, хто стоїть поруч.'},
  lunge:{n:'Випад',ap:3,cd:2,tgt:'d2',d:'Крок до ворога за дві клітинки й удар.'},
  trip:{n:'Підсічка',ap:2,cd:3,tgt:'adj',d:'Ворог поруч пропускає наступну дію.'},
  shove:{n:'Таран',ap:2,cd:3,tgt:'adj',d:'Відштовхнути на 2 клітинки. Об перешкоду — 6 урону й оглушення.'},
  aimed:{n:'Прицільний постріл',ap:4,cd:2,tgt:'shot',d:'+25% влучності, урон ×1,5.'},
  pin:{n:'Притискаючий вогонь',ap:3,cd:3,tgt:'shot',d:'Постріл. Ціль не зможе рухатися наступного ходу.'},
  roll:{n:'Перекат',ap:1,cd:2,tgt:'cell',d:'Переміститися до 2 клітинок за 1 ОД.'},
  trap:{n:'Капкан',ap:2,cd:99,tgt:'cell',d:'Поставити капкан на сусідню клітинку. Раз за бій.'},
  beam:{n:'Промінь маяка',ap:1,cd:99,tgt:'los',d:'Світло маяка б’є у ворога, якого ти бачиш: 25 урону крізь броню, подвійний по створіннях Мли. Раз за бій.'},
  whirl:{n:'Вихор',ap:3,cd:3,tgt:'none',d:'Удар по всіх ворогах навколо.'},
  qshot:{n:'Швидкий постріл',ap:2,cd:2,tgt:'shot',d:'Постріл за 2 ОД з −15% влучності.'},
  vanish:{n:'Розчинитися',ap:2,cd:4,tgt:'none',d:'Сховатися навіть на очах у ворога. Наступний удар критичний.'},
  shout:{n:'Голос маяка',ap:2,cd:4,tgt:'none',d:'Наступна атака кожного ворога вдвічі слабша.'},
};
function abList(){const L=[],w=s.eq.weapon,m1=wmLv(w)>=1;if(m1&&w==='oar')L.push('push');if(m1&&w==='harpoon')L.push('pull');if(m1&&w==='cleaver')L.push('sweep');if(m1&&w==='sabre')L.push('lunge');
  for(const id of['trip','shove','aimed','pin','roll','trap','shout'])if(s.h.ft[id])L.push(id);if(s.h.ft.cleave||s.h.ft.whirl)L.push('whirl');if(s.h.ft.qshot&&s.eq.ranged)L.push('qshot');if(s.h.ft.vanish)L.push('vanish');if(fuL('lantern')>=1&&s.cb&&(s.cb.win==='raid'||s.cb.win==='crab1'))L.push('beam');return L}
function trapCheck(u){const c=s.cb;const i=c.traps.findIndex(t=>t.x===u.x&&t.y===u.y);if(i<0||isObj(u))return;c.traps.splice(i,1);const T=EN[u.t];const x=Math.max(1,8+2*st('mech')+(s.h.ft.engineer?4:0)-uArm(u));u.hp-=x;u.stun=1;fxP({t:'txt',x:u.x,y:u.y,v:'−'+x,k:'hit'},80);cbLog(`${E(T.n)} потрапляє в капкан: −${x}, оглушений.`);if(u.hp<=0)kill(u)}
function pushUnit(u,n,hurt){const x0=u.x,y0=u.y;pushUnit0(u,n,hurt);if(u.x!==x0||u.y!==y0)fxP({t:'mv',x0,y0,x1:u.x,y1:u.y,d:180},120)}
function pushUnit0(u,n,hurt){const c=s.cb,dx=sgn(u.x-c.hx),dy=sgn(u.y-c.hy),T=EN[u.t],mode=T.swim?'swim':'walk';
  for(let i=0;i<n;i++){const nx=u.x+dx,ny=u.y+dy,o=unitAt(c,nx,ny);
    if(!canStand(c,nx,ny,mode)||o||(nx===c.hx&&ny===c.hy)){const x=Math.max(1,hurt-T.arm);u.hp-=x;u.stun=1;cbLog(`${E(T.n)} врізається в перешкоду: −${x}, оглушений.`);
      if(o&&isObj(o)&&o.hp>0){o.hp=0;kill(o)}if(u.hp<=0)kill(u);return}
    u.x=nx;u.y=ny;trapCheck(u);if(u.hp<=0)return}
  cbLog(`${E(T.n)} відлітає назад.`)}
function abOk(id,u){const c=s.cb,A=ABL[id];if(!A||c.ap<A.ap||(c.cds[id]||0)>0)return false;
  if(A.tgt==='cell')return true;if(A.tgt==='none')return id==='vanish'?!c.hidden:!['sweep','whirl'].includes(id)||alive(c).some(v=>!v.hid&&dist(v.x,v.y,c.hx,c.hy)<=1);
  if(!u||u.hp<=0||isObj(u))return false;const d=dist(c.hx,c.hy,u.x,u.y);
  if(A.tgt==='adj')return d<=1;if(A.tgt==='ray4')return d>1&&d<=4&&los(c,c.hx,c.hy,u.x,u.y);
  if(A.tgt==='d2'){if(d!==2)return false;const mx=c.hx+sgn(u.x-c.hx),my=c.hy+sgn(u.y-c.hy);return canStand(c,mx,my,'walk')&&!unitAt(c,mx,my)}
  if(A.tgt==='shot')return canShoot(u);if(A.tgt==='los')return los(c,c.hx,c.hy,u.x,u.y);return false}
function cellOk(id,x,y){const c=s.cb;if(!canStand(c,x,y,'walk')||unitAt(c,x,y)||(x===c.hx&&y===c.hy))return false;
  if(id==='roll'){const D=costMap(c,c.hx,c.hy,'walk');return D[y][x]<=2}
  if(id==='trap')return dist(x,y,c.hx,c.hy)===1&&!c.traps.some(t=>t.x===x&&t.y===y);return false}
function useAb(id){const c=s.cb,A=ABL[id],u=selU();if(!abOk(id,u))return;
  if(A.tgt==='cell'){c.mode=c.mode===id?'':id;return}
  const T=u?EN[u.t]:null;c.cds[id]=A.cd;
  if(id==='aimed'){heroShoot(u,{cost:A.ap,bonus:25,mult:1.5});return}
  if(id==='qshot'){heroShoot(u,{cost:2,bonus:-15});return}
  if(id==='pin'){if(heroShoot(u,{cost:A.ap})&&u.hp>0){u.pin=1;cbLog(`${E(T.n)} притиснутий і не зможе рухатися.`)}return}
  c.ap-=A.ap;
  if(id==='push'||id==='shove'||id==='trip'){if(Math.random()*100>=meleeCh(u)){cbLog('Промах.');return}
    if(id==='trip'){u.stun=1;cbLog(`${E(T.n)} падає й пропустить наступну дію.`)}else{cbLog(id==='push'?'Відмах веслом!':'Таран!');pushUnit(u,id==='push'?(wmLv('oar')>=5?2:1):2,id==='push'?(wmLv('oar')>=5?7:4):6)}}
  else if(id==='pull'){if(Math.random()*100>=meleeCh(u)){cbLog('Гарпун пролетів мимо.');return}
    dmgTo(u,wDmg()+s.h.a.str-1,1,0,'m');if(u.hp>0){const tx=c.hx+sgn(u.x-c.hx),ty=c.hy+sgn(u.y-c.hy);
      if(canStand(c,tx,ty,T.swim?'swim':'walk')&&!unitAt(c,tx,ty)){fxP({t:'mv',x0:u.x,y0:u.y,x1:tx,y1:ty,d:200},150);u.x=tx;u.y=ty;cbLog(`${E(T.n)} підтягнуто впритул.`);trapCheck(u)}else cbLog(`${E(T.n)} не зрушив з місця.`)}}
  else if(id==='sweep'||id==='whirl'){cbLog(id==='whirl'?'Вихор!':'Удар навідліг!');for(const v of alive(c).slice())if(!v.hid&&dist(v.x,v.y,c.hx,c.hy)<=1)heroMelee(v,0,true)}
  else if(id==='vanish'){c.hidden=1;cbLog('Ти розчиняєшся в тінях.')}
  else if(id==='lunge'){const x0=c.hx,y0=c.hy;c.hx+=sgn(u.x-c.hx);c.hy+=sgn(u.y-c.hy);fxP({t:'mv',x0,y0,x1:c.hx,y1:c.hy,d:150},140);cbLog('Випад!');heroMelee(u,0,true)}
  else if(id==='beam'){fxP({t:'shot',x0:c.hx,y0:c.hy,x1:u.x,y1:u.y,d:120},110);fxP({t:'boom',x:u.x,y:u.y},120);cbLog('Промінь маяка падає з вершини башти!');dmgTo(u,25*(T.mist?2:1),1,99,'')}
  else if(id==='shout'){for(const v of c.u)if(v.hp>0&&!isObj(v))v.weak=1;cbLog('Твій голос гримить над шхерами. Наступні удари ворогів удвічі слабші.')}}
function useCellAb(id,x,y){const c=s.cb,A=ABL[id];if(!cellOk(id,x,y)||c.ap<A.ap)return;c.ap-=A.ap;c.cds[id]=A.cd;c.mode='';
  if(id==='roll'){fxP({t:'mv',x0:c.hx,y0:c.hy,x1:x,y1:y,d:200},180);c.hx=x;c.hy=y;cbLog('Перекат!')}else{c.traps.push({x,y});cbLog('Капкан поставлено.')}}

const hideCh=()=>{const c=s.cb;const seen=alive(c).filter(u=>!u.hid&&dist(u.x,u.y,c.hx,c.hy)<=5&&los(c,u.x,u.y,c.hx,c.hy)).length;return clamp(35+10*st('stealth')-15*seen,5,95)};
const scareOk=u=>{const c=s.cb;return!!u&&HUMAN[u.t]&&!EN[u.t].boss&&!u.scared&&u.hp>0&&u.hp<u.max*(s.h.ft.dread?0.6:0.4)&&dist(c.hx,c.hy,u.x,u.y)<=3};
const scareCh=()=>clamp(25+10*st('speech')+(s.h.ft.dread?25:0),5,95);
function cAct(a,i){const c=s.cb;if(!c||c.over)return;if(c.eAnim){if(Date.now()<fxBusy)return;c.eAnim=0}setGrid(c);c.fx=[];c.fxt=0;
  if(a==='c_cell'){const[x,y]=i.split(',').map(Number);
    if(c.mode){if(cellOk(c.mode,x,y))useCellAb(c.mode,x,y);else c.mode=''}
    else{const u=unitAt(c,x,y);
      if(u&&(u.hid||EN[u.t].ally||EN[u.t].struct)){if(!u.hid&&EN[u.t].struct&&st('mech')>=1&&dist(u.x,u.y,c.hx,c.hy)<=1)cAct('c_fix');return}
      if(u){const ix=c.u.indexOf(u);if(c.sel!==ix){c.sel=ix}else if(inReach(u))heroMelee(u,0);else if(canShoot(u))heroShoot(u)}
      else heroMove(x,y)}}
  else if(a==='c_sel')c.sel=+i;
  else if(a==='c_leg')s.legOpen=!s.legOpen;
  else if(a==='c_hide'&&c.ap>=2&&!c.hidden){c.ap-=2;const ch=hideCh();if(Math.random()*100<ch){c.hidden=1;cbLog('Ти зникаєш з очей ворогів. Наступний удар буде критичним.')}else cbLog('Сховатися не вдалося: тебе бачать.')}
  else if(a==='c_scare'){const u=selU();if(u&&scareOk(u)&&c.ap>=2){c.ap-=2;u.scared=1;if(Math.random()*100<scareCh()){u.hp=0;s.fac=Object.assign(s.fac||{},{silent:Math.min(100,fac('silent')+2)});s.kills[u.t]=(s.kills[u.t]||0)+1;if(EN[u.t].loot)EN[u.t].loot();const g=Math.round(EN[u.t].xp*0.6);xp(g);fxP({t:'txt',x:u.x,y:u.y,v:'здається',k:'heal'},120);fxP({t:'die',x:u.x,y:u.y,spr:u.t},0);cbLog(`${E(EN[u.t].n)} кидає зброю й тікає. +${g} досвіду.`)}else cbLog(`${E(EN[u.t].n)} не злякався.`)}}
  else if(a==='c_fix'){const v=c.u.find(x=>x.hp>0&&EN[x.t].struct&&x.hp<x.max&&dist(x.x,x.y,c.hx,c.hy)<=1);if(v&&c.ap>=2&&st('mech')>=1){c.ap-=2;const h=(6+3*st('mech'))*(s.h.ft.engineer?2:1);v.hp=Math.min(v.max,v.hp+h);fxP({t:'txt',x:v.x,y:v.y,v:'+'+h,k:'heal'},100);cbLog(`Ти латаєш: ${v.nm||EN[v.t].n} +${h}.`)}}
  else if(a==='c_ab')useAb(i);
  else if(a==='c_mv'){c.mode='';const[dx,dy]=i.split(',').map(Number),nx=c.hx+dx,ny=c.hy+dy;
    if(dx&&dy&&(solid(tileAt(c.a,c.hx+dx,c.hy))||solid(tileAt(c.a,c.hx,c.hy+dy))))return;
    const u=unitAt(c,nx,ny);if(u){if(u.hid){u.hid=0;cbLog(`${E(EN[u.t].n)} ховався просто перед тобою!`)}else if(!EN[u.t].ally&&!EN[u.t].struct){c.sel=c.u.indexOf(u);heroMelee(u,0)}}else heroMove(nx,ny)}
  else if(a==='c_atk'){const u=selU();if(u)heroMelee(u,0)}
  else if(a==='c_heavy'){const u=selU();if(u)heroMelee(u,1)}
  else if(a==='c_shoot'){const u=selU();if(u)heroShoot(u)}
  else if(a==='c_bomb'){const u=selU();if(u)heroBomb(u)}
  else if(a==='c_wcmd'){c.wcmd=i||'';cbLog(i==='grab'?'Ти показуєш вовкові на ціль: «Хапай!»':i==='heel'?'«До ноги!» — вовк стає поруч.':'Вовк знову діє сам.')}
  else if(a==='c_guard'&&c.ap>=1&&!c.guard){c.guard=c.ap;c.ap=0;cbLog(`Ти стаєш у захисну стійку: удари зблизька −${guardPct(1)}%, постріли й чари −${guardPct(0)}%.`);endTurn();dirty=1;return}
  else if(a==='c_sw'){const it=IT[i];if(it&&packHas(i)&&has(i)&&c.ap>=1&&s.eq[it.slot]!==i){c.ap-=1;s.eq[it.slot]=i;c.mode='';cbLog(`Ти береш у руки: ${I(wN(i))}.`)}}
  else if(a==='c_item'&&c.ap>=1&&beltHas(i)&&IT[i]?.use==='heal'){
    const use=useHealingItem(i);
    if(use){c.ap--;
      if(use.hp)fxP({t:'txt',x:c.hx,y:c.hy,v:'+'+fr(use.hp),k:'heal'},0);
      const effects=[use.hp?`+${fr(use.hp)} здоров’я`:'',use.full?`ситість на ${use.full}`:'',use.regen?'зігрівання після бою':''].filter(Boolean);
      cbLog(`${IT[i].n} · ${effects.join(' · ')}.`);
    }
  }
  else if(a==='c_net'&&c.ap>=1&&beltHas('net')){const u=selU();if(u&&!isObj(u)&&dist(c.hx,c.hy,u.x,u.y)<=3&&los(c,c.hx,c.hy,u.x,u.y)){c.ap-=1;s.inv.net--;u.pin=2;cbLog(`Сітка накриває ворога «${EN[u.t].n}»: 2 ходи не рухається й не ухиляється.`)}}
  else if(a==='c_smoke'&&c.ap>=1&&beltHas('smoke')){c.ap-=1;s.inv.smoke--;c.smoke=1;for(const v of c.u)v.aimed=0;cbLog('Густий дим огортає тебе: здалеку не влучать до твого наступного ходу.')}
  else if(a==='c_breath'&&s.h.ft.breath&&!c.breath){c.breath=1;const v=Math.round(maxHP()*.3);s.h.hp=Math.min(maxHP(),s.h.hp+v);cbLog(`Друге дихання: +${v} здоров’я.`)}
  else if(a==='c_flee'&&!c.boss&&tileAt(c.a,c.hx,c.hy)==='E'){s.cb=null;s.at='';if(c.win==='raid'){for(const k of['wood','fish','prov'])s.r[k]*=0.85;s.dmgB=s.dmgB||{};for(const b of c.broken||[])s.dmgB[b]=1;raidEnd()}say('Ти виходиш із бою й повертаєшся до маяка.','fight');dirty=1;return}
  else if(a==='c_end'){endTurn();dirty=1;return}
  dirty=1;
  if(!surv()){cbEnd('lose');return}
  if(s.cb&&!alive(s.cb).length){cbEnd('win');return}}
function moveUnit(c,u,want,rng){if(u.pin>0)return;const T=Object.assign({},EN[u.t]);T.mv+=(u.el==='swift'?2:0);const mode=T.fly?'fly':T.swim?'swim':'walk';
  const D=costMap(c,u.x,u.y,mode,u);let best=null,bs=Infinity;
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(D[y][x]>T.mv||!canStand(c,x,y,mode))continue;const o=unitAt(c,x,y);if(o&&o!==u)continue;if(x===c.hx&&y===c.hy)continue;
    const d=dist(x,y,c.hx,c.hy);let sc;
    if(want==='melee')sc=d*10+D[y][x];
    else{const good=d<=rng&&d>1&&los(c,x,y,c.hx,c.hy);sc=(good?0:100)+Math.abs(d-Math.min(rng,3))*3+D[y][x]-(good?cover(c,x,y,c.hx,c.hy)/10+(40-cover(c,c.hx,c.hy,x,y))/8:0)}
    if(sc<bs){bs=sc;best=[x,y]}}
  if(best&&(best[0]!==u.x||best[1]!==u.y)){fxWalk(c,u,best[0],best[1],mode);u.x=best[0];u.y=best[1];trapCheck(u)}}
function moveTo(c,u,tx,ty){if(u.pin>0)return;const T=EN[u.t],mode=T.fly?'fly':T.swim?'swim':'walk',mv=T.mv+(u.el==='swift'?2:0);const D=costMap(c,u.x,u.y,mode,u);let best=null,bs=Infinity;
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(D[y][x]>mv||!canStand(c,x,y,mode))continue;const o=unitAt(c,x,y);if(o&&o!==u)continue;if(x===c.hx&&y===c.hy)continue;const sc=dist(x,y,tx,ty)*10+D[y][x];if(sc<bs){bs=sc;best=[x,y]}}
  if(best&&(best[0]!==u.x||best[1]!==u.y)){fxWalk(c,u,best[0],best[1],mode);u.x=best[0];u.y=best[1];trapCheck(u)}}
function allyAct(c,u){const foes=alive(c).filter(v=>!v.hid);if(!foes.length)return;let tg=foes.reduce((a,b)=>dist(u.x,u.y,a.x,a.y)<=dist(u.x,u.y,b.x,b.y)?a:b);
  if(dist(u.x,u.y,tg.x,tg.y)>1)moveTo(c,u,tg.x,tg.y);if(dist(u.x,u.y,tg.x,tg.y)>1)return;
  fxP({t:'bump',x0:u.x,y0:u.y,x1:tg.x,y1:tg.y},110);if(Math.random()<0.25+0.05*0){cbLog(`${E(u.nm||EN[u.t].n)} промахується.`);return}
  const d=Math.max(1,Math.round(((u.p0||(EN[u.t].p&&EN[u.t].p[0]?EN[u.t].p[0][1]:6))+s.h.lvl*0.5)*(s.h.ft.leader?1.5:1))-uArm(tg));tg.hp-=d;gripFree(c,tg);fxP({t:'txt',x:tg.x,y:tg.y,v:'−'+d,k:'hit'},130);cbLog(`${E(u.nm||EN[u.t].n)} б’є: ${E(EN[tg.t].n)} −${d}.`);if(tg.hp<=0)kill(tg)}
function roleAct(c,u){const T=EN[u.t];const structs=c.u.filter(v=>v.hp>0&&EN[v.t].struct);
  if(u.role==='thief'&&u.loot){if(u.x>=GW-1){u.hp=0;u.gone=1;const g={};for(const k of['wood','fish','prov','scrap']){const v=Math.floor(s.r[k]*0.1);if(v>0){s.r[k]-=v;g[k]=v}}c.stolen=Object.assign(c.stolen||{},g);cbLog(`${E(T.n)} тікає в туман із награбованим: ${costTxt(g)||'нічого цінного'}.`);fxP({t:'die',x:u.x,y:u.y,spr:u.t},0);return true}
    moveTo(c,u,GW-1,u.y);cbLog(`${E(T.n)} тягне награбоване до води.`);return true}
  const tg=u.role==='thief'?structs.find(v=>v.t==='stock'):structs.reduce((a,b)=>!a||dist(u.x,u.y,b.x,b.y)<dist(u.x,u.y,a.x,a.y)?b:a,null);
  if(!tg)return false;if(dist(u.x,u.y,c.hx,c.hy)<=1&&Math.random()<0.5)return false;
  if(dist(u.x,u.y,tg.x,tg.y)>1){moveTo(c,u,tg.x,tg.y);if(dist(u.x,u.y,tg.x,tg.y)>1){cbLog(`${E(T.n)} пробирається до ${u.role==='thief'?'складу':'будівель'}.`);return true}}
  fxP({t:'bump',x0:u.x,y0:u.y,x1:tg.x,y1:tg.y},110);
  if(u.role==='thief'){u.loot=1;cbLog(`${E(T.n)} хапає припаси зі складу! Не дай йому дійти до води.`);return true}
  const d=Math.round((4+s.h.lvl*0.5)*DIFF_DMG);tg.hp-=d;fxP({t:'txt',x:tg.x,y:tg.y,v:'−'+d,k:'hit'},120);cbLog(`${E(T.n)} ламає: ${tg.nm||EN[tg.t].n} −${d}.`);if(tg.hp<=0)kill(tg);return true}
function enemyAct(c,u){const T=EN[u.t];if(T.obj)return;if(T.boss)gnatPhase(c,u);if(u.t==='wolfpet'){wolfAct(c,u);return}if(T.ally){allyAct(c,u);return}
  if(u.hid){if(dist(u.x,u.y,c.hx,c.hy)<=2||Math.random()<0.35){u.hid=0;cbLog(`${E(T.n)} вискакує з засідки!`);fxP({t:'appear',x:u.x,y:u.y},140)}else{u.step++;return}}
  if(u.burn>0){u.burn--;u.hp-=3;cbLog(`${E(T.n)} горить: −3.`);fxP({t:'txt',x:u.x,y:u.y,v:'−3',k:'hit'},90);if(u.hp<=0){kill(u);return}}
  if(u.bleed>0){u.bleed--;const bd=u.bleedD||2;u.hp-=bd;cbLog(`${E(T.n)} стікає кров’ю: −${bd}.`);fxP({t:'txt',x:u.x,y:u.y,v:'−'+bd,k:'hit'},90);if(u.hp<=0){kill(u);return}}
  if(u.stun){u.stun=0;if(u.pin>0)u.pin--;u.acted=1;u.step++;cbLog(`${E(T.n)} оговтується й пропускає дію.`);return}
  if(u.role&&roleAct(c,u)){u.acted=1;if(u.pin>0)u.pin--;u.step++;return}
  if(c.hidden){moveUnit(c,u,'melee');if(dist(u.x,u.y,c.hx,c.hy)<=1&&Math.random()<Math.max(0.15,0.6-0.06*st('stealth'))){c.hidden=0;cbLog(`${E(T.n)} помічає тебе!`)}else cbLog(`${E(T.n)} шукає тебе.`);u.acted=1;if(u.pin>0)u.pin--;u.step++;return}
  const[k,v,nm,rg]=uIntent(u);
  const near=()=>dist(u.x,u.y,c.hx,c.hy)<=1;
  const hurtHero=(x0,ign)=>{let x=x0*(c.mult||1)*DIFF_DMG*(u.el==='fury'?1.3:1)*(T.enr&&u.hp<u.max/2?1.3:1);if(u.weak){x*=0.5;u.weak=0}if(c.guard)x*=1-guardPct(near())/100;x=Math.max(1,Math.round(x)-(ign?0:armor()));s.h.hp-=x;fxP({t:'txt',x:c.hx,y:c.hy,v:'−'+x,k:'hurt'},160);return x};
  const pinc=c.u.filter(v=>v.hp>0&&!isObj(v)&&!EN[v.t].ally&&dist(v.x,v.y,c.hx,c.hy)<=1).length>=2;
  const strike=(dmg,ign)=>{if(wolfBlock(c,u,dmg))return true;const ch=clamp(85+(pinc?10:0)-3*Math.max(0,s.h.a.dex-2)-(s.h.ft.nimble?5:0)-(s.h.ft.evade?15:0)-eqv('dodge'),5,95);fxP({t:'bump',x0:u.x,y0:u.y,x1:c.hx,y1:c.hy,cold:k==='cold'},110);
    if(Math.random()*100>=ch){cbLog(`${E(T.n)}: ${nm.toLowerCase()} — мимо.`);fxP({t:'txt',x:c.hx,y:c.hy,v:'мимо',k:'miss'},140);u.wind=0;u.weak=0;
      if(s.eq.weapon&&Math.random()*100<3*s.h.k.melee+(s.h.ft.riposte?15:0)){cbLog('Контрудар!');dmgTo(u,wDmg()+s.h.a.str-1,1,0,'m')}return false}
    if(s.eq.weapon==='sabre'&&Math.random()*100<(wmLv('sabre')>=3?40:25)){u.wind=0;u.weak=0;fxP({t:'txt',x:c.hx,y:c.hy,v:'відбито',k:'heal'},120);cbLog(`Шабля відбиває удар! Відповідь:`);dmgTo(u,wDmg()+s.h.a.str-1,1,0,'m');if(wF('sabre')>=1&&u.hp>0)dmgTo(u,wDmg()+s.h.a.str-1,1,0,'m');return false}
    const x=hurtHero(dmg*(u.wind?2:1),ign);u.wind=0;cbLog(`${E(T.n)}: ${nm.toLowerCase()}, −${x} здоров’я${pinc?' (кліщі)':''}.`);if(T.grip&&x>0&&!gripU(c)){c.grip=c.u.indexOf(u);cbLog(`${E(T.n)} вчепився в ногу! Не відійдеш, доки не вдариш його.`)}if(T.drain){u.hp=Math.min(u.max,u.hp+x);cbLog(`${E(T.n)} п’є кров: +${x}.`)}if(T.poison&&!s.h.ft.iron){c.poison=3}return true};
  const al=c.u.find(v=>EN[v.t].ally&&v.hp>0&&dist(v.x,v.y,u.x,u.y)<=1);
  if(al&&['hit','cold','wrap','charge'].includes(k)&&(!near()||Math.random()<0.35)){fxP({t:'bump',x0:u.x,y0:u.y,x1:al.x,y1:al.y},110);const d=Math.max(1,Math.round(v*(c.mult||1)*DIFF_DMG)-1);al.hp-=d;fxP({t:'txt',x:al.x,y:al.y,v:'−'+d,k:'hurt'},130);cbLog(`${E(T.n)} б’є: ${E(EN[al.t].n.toLowerCase())} −${d}.`);if(al.hp<=0)kill(al);u.acted=1;if(u.pin>0)u.pin--;u.step++;return}
  if(STANCE[k]){}
  else if(k==='charge'){const d0=dist(u.x,u.y,c.hx,c.hy);if(!near())moveUnit(c,u,'melee');if(u.hp<=0)return;if(near()){const far=d0>=2;if(far)cbLog(`${E(T.n)} кидається стрибком!`);strike(v*(far?1.3:1))}else cbLog(`${E(T.n)} не дістає до тебе.`)}
  else if(k==='hook'){const d0=dist(u.x,u.y,c.hx,c.hy);if(d0>1&&d0<=rg&&los(c,u.x,u.y,c.hx,c.hy)){fxP({t:'shot',x0:u.x,y0:u.y,x1:c.hx,y1:c.hy},150);const nx=u.x+sgn(c.hx-u.x),ny=u.y+sgn(c.hy-u.y);
      if(canStand(c,nx,ny,'walk')&&!unitAt(c,nx,ny)){fxP({t:'mv',x0:c.hx,y0:c.hy,x1:nx,y1:ny,d:200},180);c.hx=nx;c.hy=ny;const x=hurtHero(4);cbLog(`${E(T.n)}: гарпун чіпляє тебе й підтягує впритул, −${x}.`)}else{const x=hurtHero(6);cbLog(`${E(T.n)}: гарпун, −${x}.`)}}
    else if(near()){strike(7)}else{moveUnit(c,u,'ranged',rg);cbLog(`${E(T.n)} заходить збоку.`)}}
  else if(k==='horn')hornAct(c,u);
  else if(k==='ward'){const tg=c.u.filter(v=>v!==u&&v.hp>0&&!isObj(v)&&!EN[v.t].ally).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(tg){tg.ward=1;cbLog(`${E(T.n)} прикриває щитом: ${E(EN[tg.t].n)} +2 броні.`)}else cbLog(`${E(T.n)} чекає.`)}
  else if(k==='call2'){const n=c.u.filter(v=>v.hp>0&&v.t==='gull').length;if(n<3){const q=freeNear(c,u.x,u.y);if(q){const nu=mkUnit('gull',q[0],q[1],c.mult||1);c.u.push(nu);s.seenE.gull=1;fxP({t:'appear',x:q[0],y:q[1]},160);cbLog(`${E(T.n)} скликає зграю: прилітає ${E('чайка')}.`)}}else cbLog(`${E(T.n)} кружляє над зграєю.`)}
  else if(k==='hit'||k==='cold'||k==='wrap'){if(!near())moveUnit(c,u,'melee');if(u.hp<=0)return;
    const pk=T.pack?c.u.filter(o=>o!==u&&o.hp>0&&EN[o.t].pack&&dist(o.x,o.y,c.hx,c.hy)<=1).length:0;if(pk&&near())cbLog(`${E(T.n)} сміливішає поруч зі своїми: +${pk}.`);
    if(near()){const ok=strike((k==='cold'&&s.rs.a_fog?Math.ceil(v/2):v)+pk,k==='cold');if(ok&&k==='wrap'){c.wrap=1;cbLog(`${E(T.n)} обвиває тебе: наступного ходу −2 очки дії.`)}}else cbLog(`${E(T.n)} не дістає до тебе.`)}
  else if(k==='wind'){if(!near())moveUnit(c,u,'melee');if(u.hp<=0)return;u.wind=1;cbLog(`${E(T.n)} замахується. Наступний його удар подвійний.`)}
  else if(k==='veil'){for(const v of c.u)if(v.hp>0&&!isObj(v))v.veil=1;cbLog(`${E(T.n)}: ${nm.toLowerCase()}. Влучити в них важче.`)}
  else if(k==='mend'){const tg=c.u.filter(v=>v.hp>0&&!isObj(v)&&v.hp<v.max).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(tg){const h=Math.round(v*(c.mult||1));tg.hp=Math.min(tg.max,tg.hp+h);fxP({t:'txt',x:tg.x,y:tg.y,v:'+'+h,k:'heal'},150);cbLog(`${E(T.n)}: ${nm.toLowerCase()}, ${E(EN[tg.t].n)} +${h}.`)}else cbLog(`${E(T.n)} чекає.`)}
  else if(k==='wave'){fxP({t:'boom',x:u.x,y:u.y,r:rg,cold:1},200);if(dist(u.x,u.y,c.hx,c.hy)<=rg){let x0=v;if(s.eq.weapon==='oar'&&wF('oar')>=1)x0*=0.75;const x=hurtHero(x0);cbLog(`${E(T.n)}: ${nm.toLowerCase()}, −${x} здоров’я.`)}else cbLog(`${E(T.n)}: ${nm.toLowerCase()} не дістає до тебе.`)}
  else if(k==='call'){const n=c.u.filter(v=>v.hp>0&&v.t==='drowned').length;if(n<3){const spots=[];for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(dist(x,y,u.x,u.y)===2&&canStand(c,x,y,'walk')&&tileAt(c.a,x,y)!=='~'&&!unitAt(c,x,y)&&!(x===c.hx&&y===c.hy))spots.push([x,y]);
      if(spots.length){const[x,y]=spots[Math.floor(Math.random()*spots.length)],hp=Math.round(EN.drowned.hp*(c.mult||1)*DIFF_HP);fxP({t:'appear',x,y},160);c.u.push({t:'drowned',x,y,hp,max:hp,step:0,wind:0,aimed:0,burn:0,bleed:0,stun:0,pin:0,weak:0,acted:0,veil:0});cbLog(`${E(T.n)}: з води підводиться ${E('Утопленик')}.`)}}else cbLog(`${E(T.n)} пульсує.`)}
  else if(k==='shoot'||k==='aim'||k==='sand'||k==='bolt'||k==='spit'){const r=rg||1;const ok=()=>{const d=dist(u.x,u.y,c.hx,c.hy);return d<=r&&(d<=1||los(c,u.x,u.y,c.hx,c.hy))};
    if(!ok())moveUnit(c,u,'ranged',r);if(u.hp<=0)return;
    if(!ok())cbLog(`${E(T.n)} не бачить тебе.`);
    else if(k==='aim'){u.aimed=1;cbLog(`${E(T.n)} цілиться в тебе. Сховайся за скелю!`)}
    else if(k==='sand'){c.sand=1;cbLog(`${E(T.n)} кидає пісок в очі: наступного ходу влучати важче.`)}
    else{fxP({t:'shot',x0:u.x,y0:u.y,x1:c.hx,y1:c.hy,cold:k==='bolt'},170);const d=dist(u.x,u.y,c.hx,c.hy);const ch=clamp(70+(u.aimed?20:0)-(s.h.ft.nimble?5:0)-(s.h.ft.evade?15:0)-eqv('dodge')-(c.hidden?100:0)-cover(c,c.hx,c.hy,u.x,u.y)-3*Math.max(0,s.h.a.dex-2)-3*Math.max(0,d-3),5,95);u.aimed=0;
      if(c.smoke||Math.random()*100>=ch){cbLog(`${E(T.n)}: ${nm.toLowerCase()} — мимо${c.smoke?' крізь дим':''}.`);fxP({t:'txt',x:c.hx,y:c.hy,v:'мимо',k:'miss'},140);u.weak=0}
      else{const x=hurtHero(v*(s.eq.weapon==='oar'&&wF('oar')>=1?0.75:1),k==='bolt');cbLog(`${E(T.n)}: ${nm.toLowerCase()}, −${x} здоров’я${k==='bolt'?', крізь броню':''}${k==='spit'&&!s.h.ft.iron?'. Отрута!':''}.`);if(k==='spit'&&!s.h.ft.iron)c.poison=3}}}
  else if(k==='heal'){u.hp=Math.min(u.max,u.hp+v);fxP({t:'txt',x:u.x,y:u.y,v:'+'+v,k:'heal'},150);cbLog(`${E(T.n)}: ${nm.toLowerCase()}, +${v} здоров’я.`)}
  u.acted=1;if(u.pin>0)u.pin--;u.step++}
function surv(){const c=s.cb;if(s.h.hp>0)return true;if(c&&s.h.ft.unbreak&&!c.unb){c.unb=1;s.h.hp=1;cbLog('Незламний: смертельний удар лишає тебе на ногах з 1 здоров’ям!');return true}return false}
function endTurn(){const c=s.cb;c.eAnim=1;c.sand=0;c.wrap=0;c.mode='';c.kfree=0;for(const u of c.u){u.veil=0;u.ward=0}
  for(const u of c.u.slice()){if(u.hp<=0)continue;fxP({t:'turn',x:u.x,y:u.y},0);enemyAct(c,u);if(!surv()){cbEnd('lose');return}if(c.fxt)c.fxt+=90}
  envTurn(c);if(c.poison>0){c.poison--;s.h.hp-=2;fxP({t:'txt',x:c.hx,y:c.hy,v:'−2',k:'hurt'},80);cbLog('Отрута пече: −2 здоров’я.')}if(!surv()){cbEnd('lose');return}
  if(!alive(c).length){cbEnd('win');return}
  for(const k in c.cds)if(c.cds[k]>0&&c.cds[k]<99)c.cds[k]--;
  c.guard=0;c.smoke=0;c.ap=Math.max(1,maxAP()-(c.wrap?2:0))}
let lastCb=null;
function win(){const c=s.cb;lastCb=c;s.cb=null;s.c.wins=(s.c.wins||0)+1;if(c.u.some(v=>v.t==='wolfpet'&&v.hp>0))wtpAdd(1/3,'спільна перемога');say('Перемога! Усіх ворогів переможено.','fight');const q0=(s.dlg||[]).length;const m=finishWin(c.win);const bu=c.u.find(u=>EN[u.t].boss);if(bu)mom('boss',`Переможено: ${EN[bu.t].n}`,EN[bu.t].d,{t:'spr',id:bu.t},1);
  const g=c.sn?gainsOf(c.sn):[];for(const w in c.wmg||{})g.push(`Майстерність «${IT[w].n}»: +${c.wmg[w]} (рівень ${wmLv(w)})`);
  const foe=c.u.find(u=>!isObj(u));s.dlg=s.dlg||[];s.dlg.splice(q0,0,{k:'fight',title:'Перемога',img:foe?{t:'spr',id:foe.t}:null,body:`<p>${m||'Усіх ворогів переможено.'}</p>`,gains:g})}
function finishWin(w){let m='';
  if(w==='crab1'){s.f.crab1=1;xp(15);unlock('hero');add('fish',2);m='Ти розламуєш панцир. З краба вийде непогана вечеря.';say(m,'story')}
  else if(w==='raid'){const L=s.h.lvl,k2=s.lure?2:1,c=lastCb||{};add('coin',5*L*k2);add('scrap',3*L*k2);xp(20*L*k2);if(s.lure){const x=['bomb','potion','net'][Math.floor(Math.random()*3)];giveI(x)}
    const br=[...new Set(c.broken||[])];s.dmgB=s.dmgB||{};for(const b of br)s.dmgB[b]=1;
    m=`${s.f.siege1?'':'Перша облога витримана. '}Мла відкочується від маяка. На піску лишилося те, що принесли нападники.${br.length?` Але зламано: ${br.map(b=>BD.find(x=>x.id===b).n.toLowerCase()).join(', ')}. Полагодь у вкладці «Вогнище».`:''}${c.stolen&&Object.keys(c.stolen).length?` Злодії винесли ${costTxt(c.stolen)}.`:''}`;raidEnd();say(m,'fight');s.c.raids=(s.c.raids||0)+1;if(s.c.raids===1||s.c.raids%5===0)mom('raid',s.c.raids===1?'Перша облога':`Відбито ${s.c.raids}-й набіг`,'Мла відкотилася від маяка, не взявши його.',{t:'scene',id:'shore'})}
  else if(w&&w.indexOf('S:')===0){m=shfWin(w.slice(2));say(m,'fight')}
  else if(w&&w.indexOf('L:')===0){const id=w.slice(2),A=findA(id);trustAct(id);const dr=thrOn()?thrDrop(A.fight,A.once||ENC[A.fight].boss):0;if(dr)s.threat=Math.max(0,(s.threat||0)-dr);if(A.once)s.done[id]=1;m=A.win&&A.win();if(dr&&(s.threat||0)>=0)m=(m||'')+` <span class="m">Мла відступила від маяка на ${dr}.</span>`;say(m,'find');relicFor(A.fight)}
  dirty=1;return m}
function lose(){const c=s.cb,lost=Math.floor(s.r.coin*0.2);s.r.coin-=lost;s.h.hp=Math.max(1,Math.round(maxHP()*0.3));s.cb=null;s.at='';
  if(c.win==='crab1'){s.c.fish=0;unlock('hero')}
  if(c.win==='raid'){for(const k of['wood','fish','prov'])s.r[k]*=0.8;s.dmgB=s.dmgB||{};for(const b of c.broken||[])s.dmgB[b]=1;dmgRandom();raidEnd()}
  const m=`Тебе здолали. Ти отямився біля вогнища${lost?` і недорахувався ${R('coin',lost)}`:''}.`;say(m,'fight');dlg({k:'fight',title:'Поразка',img:{t:'yard'},body:`<p>${m}</p>`,gains:[c.win==='crab1'?'Злови рибу та поїж на березі. До краба можна повернутися, коли будеш готовий.':'З’їж рибу чи провізію або скористайся лікувальним предметом.','Спробуй іншу зброю: кожна потрібна проти свого ворога.','Укриття, вміння, пояс і захисна стійка рятують життя.']});dirty=1}
function quickOk(encId){const E0=ENC[encId];return!!s.f.quick&&!E0.boss&&E0.e.filter(([t])=>!EN[t].obj).every(([t])=>s.kills[t]>0)}
function quickFight(encId,win){const E0=ENC[encId];let hp=s.h.hp;
  const units=E0.e.filter(([t])=>!EN[t].obj&&!EN[t].ally).map(([t])=>({T:EN[t],hp:EN[t].hp*DIFF_HP*(E0.mult||1)}));
  const avg=T=>{const o=T.p.filter(p=>['hit','cold','wrap','shoot','bolt','wave','spit','charge'].includes(p[0]));return o.length?o.reduce((a,p)=>a+p[1],0)/T.p.length:0};
  let g=0;
  while(units.some(u=>u.hp>0)&&hp>0&&g++<200){
    const u=units.find(x=>x.hp>0);const ch=clamp(70+4*s.h.a.dex+5*s.h.k.melee-u.T.eva,5,97)/100;
    u.hp-=Math.floor(maxAP()/wAP())*Math.max(1,wDmg()+s.h.a.str-0.5-Math.max(0,u.T.arm-((IT[s.eq.weapon]||{}).pierce||0)-pierceBonus()))*ch*(0.85+Math.random()*0.3);
    for(const v of units)if(v.hp>0)hp-=Math.max(0.5,avg(v.T)*0.8*DIFF_DMG*(E0.mult||1)-armor()*0.6)*(0.85+Math.random()*0.3)}
  if(hp<=0){s.cb={win,u:[]};lose();return}
  s.h.hp=Math.max(1,Math.round(hp));for(const[t]of E0.e){if(EN[t].obj||EN[t].ally)continue;s.kills[t]=(s.kills[t]||0)+1;if(EN[t].loot)EN[t].loot();xp(EN[t].xp)}
  say(`Швидкий бій: перемога. Здоров’я лишилося ${Math.ceil(s.h.hp)}.`,'fight');finishWin(win)}

/* ---- raids of the Mist: repeatable, scale with level ---- */
const DEF=[
  {id:'palisade',n:'Частокіл',max:3,base:{wood:60,tar:4},mult:1.9,d:l=>`Дерев’яні щити на полі оборони: ${[3,5,7][Math.min(2,l)]} укриттів${l?' (зараз '+[0,3,5,7][l]+')':''}.`},
  {id:'brazier',n:'Відганяльні жаровні',max:3,base:{iron:6,oil:10},mult:1.9,tog:1,d:l=>`Палають олією (${fr(0.04*Math.max(1,l))}/с) і сповільнюють Млу на ${20*Math.max(1,l)}%. У набігах створіння Мли ухиляються гірше.`},
  {id:'dtraps',n:'Капкани на стежках',max:3,base:{iron:8,scrap:20},mult:1.9,d:l=>`Капкани, розставлені заздалегідь на шляху нападників: ${2*Math.max(1,l)}.`},
  {id:'bell',n:'Дзвін на сторожі',max:1,base:{iron:15,wood:40},mult:2,d:()=>'Вартовий дзвонить завчасно: у набігу ти маєш +2 ОД на першому ході.'},
  {id:'militia',n:'Ополчення',max:2,base:{iron:12,wood:40,prov:10},mult:2,req:()=>!!s.f.people,d:l=>`Поселенці з острогами б’ються поруч із тобою: ${Math.max(1,l)+(s.h.ft.leader?1:0)} бійців. Потрібні вільні руки.`},
];
const defL=id=>(s.def||{})[id]||0;
function defCost(d){const n=defL(d.id),c={};for(const k in d.base)c[k]=Math.ceil(d.base[k]*Math.pow(d.mult,n));return c}
const thrOn=()=>!!(s.floors.gallery&&s.tabs.hero&&s.f.siege1);
function thrDrop(enc,story){const E0=ENC[enc];if(!E0)return 0;let v=0;const lc=lastCb&&lastCb.enc===enc?lastCb.u:null;
  E0.e.forEach(([t],ix)=>{const T=EN[t];if(!T||T.obj||T.ally||T.struct)return;const u=lc&&lc[ix];v+=Math.max(2,Math.round(T.hp/5))*(T.boss?2:1)*(u&&u.el?1.5:1)});
  v*=(E0.mult||1)*(story?2:1);return Math.min(60,Math.round(v))}
function thrMul(){const br=defL('brazier')&&s.on.brazier!==false&&s.r.oil>0?1-0.2*defL('brazier'):1;return(fac('silent')>=50?0.85:1)*br*(s.f.won?0.8:1)*((s.b.hearth||0)>=5?0.9:1)*(s.h.lvl<6?1:1.5)}
function mlaAdd(v){if(!thrOn()||s.cb||s.raid)return;const k=v*(s.h.lvl<6?1:1.5);s.threat=Math.min(100,(s.threat||0)+v*thrMul()*(wHas('mla')?.85:1));if(defL('brazier')&&s.on.brazier!==false)s.r.oil=Math.max(0,s.r.oil-0.8*k*defL('brazier'))}
const away=()=>Date.now()-(s.lastAct||0)>120000||(typeof document!=='undefined'&&!!document.hidden);
const raidGap=()=>(s.h.lvl<6?480+Math.random()*300:300+Math.random()*200)*1000;
function raidCheck(){if(away())return;
  if(!s.f.siege1){if(!s.f.mlaNote||s.cb||s.raid)return;if(!s.f.mlaW&&(s.play||0)>=s.f.mlaT-45){s.f.mlaW=1;say('З оглядової видно: сива смуга туману сунеться від моря до берега.','fight')}
    if((s.play||0)<s.f.mlaT||(s.dlg||[]).length)return;s.raid=1;
    dlg({k:'fight',title:'Перша облога',img:{t:'spr',id:'wraith'},body:`<p>Мла підповзає до самих стін. У ній щось ворушиться й шарудить, і воно йде не до тебе, а до припасів і будівель.</p><p class="hand">Остап писав: тримай припаси під замком і не дай їй загасити вогонь.</p>`,btns:[['Боронити маяк','raidGo']]});return}
  if(!thrOn()||s.cb||s.raid)return;
  if(fuL('gallery')>=1&&!s.raidWarn&&s.threat>=85){s.raidWarn=1;say('Великий далекогляд: на обрії густішає туман. Набіг ось-ось — готуйся.','fight')}
  if((s.threat||0)<100||(s.dlg||[]).length)return;s.raid=1;
  s.raidWarn=0;dlg({k:'fight',title:'Набіг Мли',img:{t:'spr',id:'wraith'},body:`<p>Туман густішає й підповзає до маяка. У ньому рухаються тіні.</p>${fuL('gallery')>=1?`<p class="m">У далекогляд видно: ${raidFoes().map(t=>EN[t].n.toLowerCase()).join(', ')}.</p>`:''}<p class="m">${s.lure?'Ти сам покликав Млу: нападників більше, але й здобич подвійна. ':''}Частина нападників полізе до складу й будівель: одні ламають, інші крадуть припаси й тягнуть до води. Захищай подвір’я.</p>`,gains:[`Перемога: +${20*s.h.lvl} досвіду, ${R('coin',5*s.h.lvl)}, ${R('scrap',3*s.h.lvl)}${s.lure?' — удвічі більше':''}`,'Сховатися: Мла забере частину припасів і пошкодить одну будівлю'],btns:[['До бою','raidGo'],['Сховатися в маяку','raidHide']]})}
function raidFoes(){if(!s.f.siege1)return['gull','crab','gull'];const L=s.h.lvl;const b0=L<5?['gull','gull','crab']:L<8?['wraith','drowned','hound','wolf']:L<12?['wraith','drowned','scout','brute','wolf']:['witch','icedrowned','drowned','brute','smuggler','harpooner'];const b=fac('silent')<=-40&&L>=5&&!b0.includes('smuggler')?[...b0,'smuggler']:b0;return s.lure?[...b,b[1],b[0]]:b}
const DMGB=['pot','boom','smoke','traps','kiln','render','forge','coalpit','glass','steel','apoth','garden','sandpit'];
function dmgRandom(){const L=DMGB.filter(b=>s.b[b]&&!(s.dmgB||{})[b]);if(!L.length)return'';const b=L[Math.floor(Math.random()*L.length)];s.dmgB=s.dmgB||{};s.dmgB[b]=1;return BD.find(x=>x.id===b).n}
function raidEnd(){s.raid=0;s.threat=0;s.lure=0;s.raidWarn=0;if(!s.f.siege1){s.f.siege1=1;
  dlg({k:'story',title:'Мла відступила',img:{t:'yard'},body:`<p>Туман відкочується до води, лишаючи на камінні мокрі сліди. Ти знаєш: він повернеться, і щоразу густіший.</p><p class="hand">Тепер варто подумати, як берегти маяк.${ih('Угорі з’явилася шкала Мли. Коли вона дійде до 100, почнеться набіг. Перемоги над ворогами в шхерах відганяють Млу: що сильніші вороги, то далі, а сюжетні бої — удвічі. Жаровні й інші укріплення у «Вогнищі» сповільнюють її.')}</p>`,gains:['Відкрилося: «Оборона маяка» у вкладці «Вогнище»']})}}
function raidResolve(go){const L=s.h.lvl;if(!go){for(const k of['wood','fish','prov'])s.r[k]*=0.85;const b=dmgRandom();raidEnd();say(`Ти зачиняєшся в маяку. Мла понишпорила по двору й відступила${b?`, але зламала: ${b}`:''}.`,'world');return}
  const SP=[[10,1],[11,4],[10,7],[12,2],[12,6],[13,4],[13,1],[13,7]];const foes=raidFoes();
  const e=foes.map((t,ix)=>{const[x,y]=SP[ix%SP.length];const fast=['gull','hound','wolf','scout','rat','smuggler'].includes(t);return[t,x,y,ix===0||(ix===3&&L>=8)?(fast?'thief':'wreck'):ix===1&&L>=5?(fast?'thief':'wreck'):undefined]});
  const blds=DMGB.filter(b=>s.b[b]&&!(s.dmgB||{})[b]).sort(()=>Math.random()-.5).slice(0,2);
  e.push(['stock',1,2,undefined,{nm:'Склад припасів'}]);blds.forEach((b,ix)=>e.push(['bld',ix?2:1,ix?6:5,undefined,{bid:b,nm:BD.find(x=>x.id===b).n}]));
  const nm=Math.min(freeW(),defL('militia')+(defL('militia')&&s.h.ft.leader?1:0));for(let k=0;k<nm;k++)e.push(['militia',3,k?5:3]);if(fac('silent')>=80)e.push(['militia',2,1]);
  const pal=[[6,2],[6,4],[6,6],[7,1],[7,7],[5,3],[5,5]].slice(0,[0,3,5,7][defL('palisade')]+(s.h.ft.engineer&&defL('palisade')?1:0));
  const tr=[[9,3],[9,5],[8,4],[10,2],[10,6],[9,1]].slice(0,2*defL('dtraps'));
  ENC.raid={a:'yardA',h:[3,4],fixed:1,e,mult:1+0.1*Math.max(0,L-4),palis:pal,traps:tr,bell:defL('bell')>0,waves:L>=12?[[4,[['drowned',14,4]]]]:undefined};s.at='';startFight('raid','raid')}

