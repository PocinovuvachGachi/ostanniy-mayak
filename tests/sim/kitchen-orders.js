/* Локальний парний контроль кухні перед першою облогою.
   node tests/sim/kitchen-orders.js */
require('../harness.js')(String.raw`
(()=>{
let now=Date.now();
Date.now=()=>now;
const drain=()=>{while(s.dlg.length)act('dlgok')};
const check=(ok,message)=>{if(!ok)throw Error(message)};
const setup=(smoke=false)=>{
  s=fresh();popB='';orderResumeRequired=false;
  Object.assign(s.tabs,{tower:1,kitchen:1,hero:1});s.tab='tower';s.tt='kitchen';
  Object.assign(s.f,{looked:1,zinovii:1,people:1,tracks:1,rats:1});
  s.mst.zinovii=1;s.b.hearth=1;if(smoke)s.b.smoke=1;
  s.c.cook=5;s.rcp={ash:1,soup:1,pie:1};s.r.fish=30;s.r.wood=60;s.r.scrap=30;s.r.prov=10;
  s.h.lvl=4;s.h.a.con=3;s.h.k.melee=2;s.h.hp=8;
  giveI('oar');s.lastAct=now;
};
const equip=()=>{
  kitchenPlanTick();act('kitchenSetupTalk');drain();act('kitchenSetup');
  check(s.f.kitchenEquipped,'потрібне облаштування');
};
const wait=seconds=>{
  for(let n=0;n<seconds;n++){now+=1000;produce(1);kitchenOrderTick()}
};
const resourceStock=()=>Object.fromEntries(['fish','wood','scrap','prov'].map(k=>[k,Number(s.r[k].toFixed(2))]));

for(const smoke of [false,true]){
  for(const method of ['manual','order']){
    setup(smoke);const start=now;
    if(method==='order'){equip();act('kitchenOrder','soup:3')}
    else for(let n=0;n<3;n++)act('cookp','soup');
    wait(90);
    const pending=s.kitchenOrder?.left||0;
    if(s.kitchenOrder?.ready)act('kitchenOrderCollect');
    console.log(JSON.stringify({scenario:'три юшки',smoke,method,seconds:(now-start)/1000,
      portions:s.inv.soup||0,left:pending,resources:resourceStock()}));
  }
}

const basic=act;
for(const seconds of [45,90]){
  for(const seed of [7,19,71]){
    for(const method of ['manual','mixed']){
      setup();if(method==='mixed')equip();
      act('cookp','soup');act('use','soup');
      check(s.h.buf.regen,'юшка діє до бою');
      if(method==='mixed')act('kitchenOrder','ash:2');else for(let i=0;i<2;i++)act('cookp','ash');
      wait(seconds);if(s.kitchenOrder?.ready)act('kitchenOrderCollect');
      const stock=resourceStock(),ash=s.inv.ash||0,hp=Number(s.h.hp.toFixed(2));
      s.f.mlaNote=1;s.f.mlaT=s.play;Math.random=rng(seed);raidCheck();
      check(s.dlg[0]?.title==='Перша облога','штатний вступ в облогу');
      act('raidGo');
      act=(a,i)=>{
        if(s.cb&&a.startsWith('c_')&&s.cb.ap>=1&&s.h.hp<maxHP()*.4&&beltHas('ash')){
          basic('c_item','ash');return;
        }
        return basic(a,i);
      };
      botFight(300);act=basic;
      console.log(JSON.stringify({scenario:'перша облога',seconds,seed,method,ash,hp,stock,
        won:!!s.c.wins,endHP:Number(s.h.hp.toFixed(2)),used:ash-(s.inv.ash||0)}));
    }
  }
}
})();
`);
