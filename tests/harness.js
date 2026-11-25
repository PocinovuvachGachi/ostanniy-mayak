/* Тестове середовище: запускає код гри у vm без браузера (DOM — заглушки). */
const fs=require('fs'),vm=require('vm');
module.exports=function(extra){
const path=require('path');
const html=fs.readFileSync(process.env.GAME||path.join(__dirname,'..','dist','game.html'),'utf8');
/* Передбачувана випадковість: те саме зерно — та сама гра. SEED=7 node tests/logic/... щоб спробувати інше. */
let seed=(+process.env.SEED||1)>>>0;const rand=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
const M=Object.create(Math);M.random=rand;
/* Передбачуваний годинник: кожен виклик Date.now() просуває час на 5 мс. */
let fakeNow=Date.UTC(2026,0,1,12);
class FD extends Date{constructor(...a){if(a.length)super(...a);else super(fakeNow)}static now(){return fakeNow+=5}}
const code=html.split('<script>')[1].split('</script>')[0];
const els={};const mk=()=>({innerHTML:'',value:'',style:{setProperty(){}},dataset:{}});
const ctx={els,console,Math:M,JSON,Date:FD,String,Object,Array,Number,Infinity,
 document:{getElementById:id=>els[id]||(els[id]=mk()),querySelectorAll:()=>[],addEventListener(){},activeElement:null},
 localStorage:{getItem:()=>null,setItem(){}},setInterval:()=>0,
 /* симулятор живого гравця пересуває годинник на реальні секунди */
 __adv:ms=>{fakeNow+=ms},
 /* сценарні тести не чекають пауз між відкриттями (симулятор темпу вмикає їх: NOGAP=0) */
 NOGAP:1};
vm.createContext(ctx);
const bot=`
function botFight(maxT=400){let g=0;while(s.cb&&g++<maxT){if(g===maxT)console.log('STUCK',s.cb.enc,s.cb.ap,JSON.stringify(s.cb.u.map(u=>[u.t,u.x,u.y,u.hp])),s.cb.hx,s.cb.hy);const c=s.cb;render();
  const al=alive(c).filter(x=>!x.hid);if(!al.length){act('c_end');continue}
  // target nearest
  let u=al.reduce((a,b)=>dist(c.hx,c.hy,a.x,a.y)<=dist(c.hx,c.hy,b.x,b.y)?a:b);c.sel=c.u.indexOf(u);
  const d=dist(c.hx,c.hy,u.x,u.y);
  if(s.h.hp<maxHP()*0.35&&c.ap>=1&&(beltHas('potion')||beltHas('bandage'))){act('c_item',beltHas('potion')?'potion':'bandage');continue}
  if(inReach(u)&&c.ap>=wAP()){act('c_atk');continue}
  if(d>1&&c.ap>=shotAP()&&canShoot(u)){act('c_shoot');continue}
  // move toward along a path
  if(c.ap>=1&&d>1){const D=costMap(c,c.hx,c.hy,'walk'),TD=costMap(c,u.x,u.y,'walk',u);let best=null,bv=TD[c.hy][c.hx]===Infinity?99:TD[c.hy][c.hx]*10+0;
    const cur=(()=>{let m=Infinity;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const y=c.hy+dy,x=c.hx+dx;if(y>=0&&y<GH&&x>=0&&x<GW)m=Math.min(m,TD[y][x])}return m})();
    let bd=cur+1;
    for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(D[y][x]>c.ap||D[y][x]===0||unitAt(c,x,y)||!canStand(c,x,y,'walk'))continue;const v=TD[y][x];if(v<bd||(best&&v===bd&&D[y][x]<D[best[1]][best[0]])){bd=v;best=[x,y]}}
    if(best){const ap0=c.ap;act('c_cell',best[0]+','+best[1]);if(c.ap!==ap0)continue}}
  if(c.ap>=1&&!c.guard){act('c_guard');continue}
  act('c_end')}}
`;
vm.runInContext(code+'\n'+bot+'\n'+extra,ctx);
}
