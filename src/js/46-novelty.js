/* ============ v16: NOVELTY QUEUE ============ */
const NOV=[
  {id:'bag',ready:()=>WEAP.filter(has).length>1||Object.keys(s.inv).some(k=>s.inv[k]>0&&IT[k]&&IT[k].use),used:()=>s.nvU.bag,
    ann:()=>dlg({k:'info',title:'Торба й пояс',img:{t:'icon',id:'pack'},body:'<p>Речей більшає. Пора вирішити, що брати з собою в бій, а що лишати в маяку.</p>',gains:['Відкрилося: «Торба», рюкзак і пояс у вкладці «Герой»'],btns:[['Подивитися','novgo','bag'],['Пізніше','dlgok']]})},
  {id:'arms',ready:()=>WEAP.some(w=>has(w)&&wmLv(w)>=1),used:()=>s.nvU.arms,
    ann:()=>dlg({k:'info',title:'Рука звикає до зброї',img:{t:'wico',id:WEAP.find(w=>has(w)&&wmLv(w)>=1)},body:'<p>Що довше б’єшся однією зброєю, то краще її відчуваєш. У кожної свої прийоми, і вони приходять із вправністю.</p>',gains:['Відкрилося: «Зброя» у вкладці «Герой»'],btns:[['Подивитися','novgo','arms'],['Пізніше','dlgok']]})},
  {id:'grow',ready:()=>s.h.lvl>=3,used:()=>!!s.h.bg&&s.nvU.grow,ann:()=>offerBg()},
  {id:'tal',ready:()=>s.h.lvl>=4&&!!s.h.bg,used:()=>s.nvU.talents,
    ann:()=>{const B=BGS[s.h.bg],f=B&&FT.find(x=>x.id===B.ft);dlg({k:'lvl',title:'Таланти',img:{t:'hero'},body:`<p>Досвід складається в щось більше, ніж сила рук. Тепер можна обирати таланти: особливі вміння, що виростають одне з одного.</p>${f?`<p class="hand">Минуле підказує перший крок: «${f.n}».</p>`:''}`,gains:['Відкрилося: «Таланти» у вкладці «Герой»'],btns:[['Подивитися','novgo','talents'],['Пізніше','dlgok']]})}},
  {id:'mla',ready:()=>!!s.floors.gallery&&!!s.f.fordSeen&&fordN()>=2,used:()=>true,ann:()=>{page('m');s.f.mlaNote=1;s.f.mlaT=(s.play||0)+150}},
];
function novTick(){s.nv=s.nv||{};s.nvU=s.nvU||{};if(s.cb||s.raid||(s.dlg||[]).length||!s.tabs.hero||!s.nvU.gear)return;
  s.nvT=s.nvT||{};if(NOV.some(n=>s.nv[n.id]&&!n.used()&&(s.play||0)-(s.nvT[n.id]||0)<240))return;const n=NOV.find(n=>!s.nv[n.id]&&n.ready());if(n){s.nv[n.id]=1;s.nvT[n.id]=s.play||0;n.ann();dirty=1}}

