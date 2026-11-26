/* ============ STATE ============ */
function fresh(){return{
  r:Object.fromEntries(RES.map(k=>[k,0])),play:0,tideEpoch:null,reserveFree:{},novUsed:{},novLast:'',tutSeen:{},tutPending:[],eraT:[0],nv:{},nvU:{},mom:[{t:0,k:'start',n:'Пробудження',d:'Ти прокидаєшся в темряві з єдиною жариною в долонях.',img:null,mj:1,e:0}],on:{},fac:{rot:0,cape:0,sails:0,silent:-50},req:{},reqT:{},threat:0,def:{},dmgB:{},glSeen:{},fu:{},exp:[],beam:0,wf:{},mst:{},pop:0,popT:0,wk:{},bog:0,bogFail:0,ht:'gear',sig:0,pack:[],belt:[],wm:{},wup:{},dlg:[],raid:0,raidT:0,
  tot:{ember:0,wood:0,scrap:0,fish:0},
  seen:{ember:1},tabs:{home:1},tab:'home',newTab:{},
  f:{},fishSpecies:{},hookWater:{gathers:0,pulls:0,wait:0,pending:null},rakeSand:{actions:0,searched:0,wait:0,pending:null},c:{gather:0,fish:0,wins:0},cd:{},b:{},floors:{},rs:{},
  h:{lvl:1,xp:0,hp:25,pts:0,sp:0,fp:0,a:{str:2,dex:2,con:2,per:2,int:2},k:{melee:0,mech:0,stealth:0,speech:0,craft:0},ft:{}},
  eq:{weapon:'',ranged:'',armor:'',light:'',charm:''},inv:{},
  pages:[],books:[],odd:{},oddRead:{},oddFate:{},shoreFindMiss:{},met:{},seenE:{},kills:{},disc:{},done:{},visited:{},wrong:{},
  chs:[],chv:2,bts:{},seenK:{},seenI:{},chSeen:0,at:'',cb:null,bell:[],bellFail:0,scans:0,jt:'goals',
  chest:[0,0,0],chestFail:0,stones:[0,1,3],stoneFail:0,mirrors:{A:'/',B:'/',C:'\\',D:'\\'},
  log:[{m:'Темрява. У долонях тліє жарина з великого вогню маяка.',t:'story'}],ts:Date.now(),t:0
}}
let s=fresh(),dirty=1,resetAsk=0,ptr=0;

