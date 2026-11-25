/* ============ v16: NOVELTY QUEUE ============ */
const NOV=[
  {id:'bag',ready:()=>WEAP.filter(has).length>1||Object.keys(s.inv).some(k=>s.inv[k]>0&&IT[k]&&IT[k].use),used:()=>s.nvU.bag,
    ann:()=>dlg({k:'info',title:'Торба й пояс',img:{t:'icon',id:'pack'},body:'<p>Речей більшає. Пора вирішити, що брати з собою в бій, а що лишати в маяку.</p>',gains:['Відкрилося: «Торба», рюкзак і пояс у вкладці «Герой»'],btns:[['Подивитися','novgo','bag'],['Пізніше','dlgok']]})},
  {id:'arms',ready:()=>WEAP.some(w=>has(w)&&wmLv(w)>=1),used:()=>s.nvU.arms,
    ann:()=>dlg({k:'info',title:'Рука звикає до зброї',img:{t:'wico',id:WEAP.find(w=>has(w)&&wmLv(w)>=1)},body:'<p>Що довше б’єшся однією зброєю, то краще її відчуваєш. У кожної свої прийоми, і вони приходять із вправністю.</p>',gains:['Відкрилося: «Зброя» у вкладці «Герой»'],btns:[['Подивитися','novgo','arms'],['Пізніше','dlgok']]})},
  {id:'grow',ready:()=>s.h.lvl>=3,used:()=>!!s.h.bg&&s.nvU.grow,ann:()=>offerBg()},
  {id:'tal',ready:()=>s.h.lvl>=4&&!!s.h.bg,used:()=>s.nvU.talents,
    ann:()=>{const B=BGS[s.h.bg],f=B&&FT.find(x=>x.id===B.ft);dlg({k:'lvl',title:'Таланти',img:{t:'hero'},body:`<p>Досвід складається в щось більше, ніж сила рук. Тепер можна обирати таланти: особливі вміння, що виростають одне з одного.</p>${f?`<p class="hand">Минуле підказує перший крок: «${f.n}».</p>`:''}`,gains:['Відкрилося: «Таланти» у вкладці «Герой»'],btns:[['Подивитися','novgo','talents'],['Пізніше','dlgok']]})}},
  {id:'mla',ready:()=>!!s.floors.gallery&&!!s.f.fordSeen&&fordN()>=2,used:()=>true,ann:()=>{if(!s.pages.includes('m'))page('m');s.f.mlaNote=1;s.f.mlaT=(s.play||0)+150}},
];
/* креслення з'являються лише через checks(): по одному, з паузою (show0 — справжня умова) */
for(const b of BD){const f=b.show;b.show0=f;b.show=()=>(noGap()||!!(s.bdSeen&&s.bdSeen[b.id]))&&f()}
function novTick(essential=false){s.nv=s.nv||{};s.nvU=s.nvU||{};if(!novCan()||!s.tabs.hero||s.cb||s.raid)return;
  s.nvT=s.nvT||{};
  // Мла — сюжетна необхідність, не залежить від перегляду торби чи спорядження.
  if(!essential&&(!s.nvU.gear||!novOptional()||NOV.some(n=>n.id!=='mla'&&s.nv[n.id]&&!n.used()&&(s.play||0)-(s.nvT[n.id]||0)<240)))return;
  const n=NOV.find(n=>(n.id==='mla')===essential&&!s.nv[n.id]&&n.ready());if(n){novMark();s.nv[n.id]=1;s.nvT[n.id]=s.play||0;n.ann();dirty=1}}
/* Один автоматичний план/рецепт за один спокійний момент. Готовність окремо від показу.
   Перші інструменти потрібні для сюжету; необов'язкові відкриття чергуємо. */
function novPlanTick(essential=false){s.bdSeen=s.bdSeen||{};s.rcSeen=s.rcSeen||{};if(!(essential?novCan():novOptional()))return;
  const nb=BD.find(b=>!s.bdSeen[b.id]&&b.show0());let nr;
  if(s.floors.work){RCOPEN=1;try{nr=RC.find(rc=>!s.rcSeen[rc.id]&&rcVisible(rc)&&(essential?['oar','rod'].includes(rc.id):!['oar','rod'].includes(rc.id)))}finally{RCOPEN=0}}
  if(essential){if(!nr)return;const key='r:'+nr.id;s.rcSeen[nr.id]=1;novMark(key);rcDlg([nr]);dirty=1;return}
  if(nb&&(!nr||s.novFamily!=='b')){const key='b:'+nb.id;s.bdSeen[nb.id]=1;s.novFamily='b';novMark(key);bpDlg([nb]);dirty=1}
  else if(nr){const key='r:'+nr.id;s.rcSeen[nr.id]=1;s.novFamily='r';novMark(key);rcDlg([nr]);dirty=1}
}
