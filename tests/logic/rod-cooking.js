require('../harness.js')(`(()=>{
let fails=0;
function A(ok,msg){if(!ok){fails++;console.log('FAIL',msg)}}
const rng=Math.random;
let stored;
localStorage.setItem=(key,value)=>{stored=value};
localStorage.getItem=()=>stored;
function draw(...values){Math.random=()=>values.shift()??.99}
function cast(place='shore'){s.cd.fishing=0;act('fishing',place)}
function drain(){while(s.dlg.length)act('dlgok')}
const recipe=RC.find(r=>r.id==='rodUp');
const hook=RC.find(r=>r.id==='hookUp');
function shore(){
  s=fresh();s.tab='shore';s.tabs.shore=1;s.tabs.work=1;s.f.rod=1;s.f.tideSeen=1;s.f.crab1=1;
  s.lastAct=Date.now();s.c.fish=4;
}
shore();
act('fishing','deep');
A(s.c.fish===4&&!s.bite&&!rcVisible(recipe),'віддалене місце й креслення приховані');
draw(.9);cast();rodWaterTick();
A(s.bite?.kind==='snag'&&s.bite.odd==='medallion'&&!s.f.rodRipple,'перше клювання лишається навчальним і може дати медальйон');
act('fishRelease');rodWaterTick();
A(s.f.rodRipple&&!s.f.rodLimitSeen,'розв’язане клювання відкриває спостереження');
act('tab','home');act('rodReach');
A(!s.f.rodLimitSeen,'спостерігати можна тільки з берега');
save();load();act('tab','shore');act('rodReach');drain();
A(s.f.rodLimitSeen&&!rcVisible(recipe),'спостереження пережило reload і чекає майстерні');
s.floors.work=1;
s.r.wood=60;s.r.scrap=24;
act('craft','rodUp');A(!s.f.rodUp&&!rcVisible(recipe),'можливість ще чекає черги креслень');
s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));
novPlanTick();drain();A(rcVisible(recipe),'креслення виявляє чинна черга');
act('craft','rodUp'); A(!s.f.rodUp&&s.r.wood===60,'ціна не списується на березі');
act('tab','work');s.h.ft.smith=1;s.fu={work:1};
const cost=rcCost(recipe),hookCost=rcCost(hook);
A(cost.wood===39&&cost.scrap===16&&hookCost.wood===8&&hookCost.scrap===4,'знижки застосовуються до обох удосконалень');
act('craft','rodUp');drain();act('craft','rodUp');
A(s.f.rodUp&&!rcVisible(recipe)&&s.r.wood===21&&s.r.scrap===8,'одноразова оплата');
act('tab','shore');
draw(0,.8);cast('deep');
const record=JSON.stringify(s.bite),count=s.c.fish;
act('fishing','shore');
A(s.c.fish===count&&s.bite.species==='cod'&&s.bite.place==='deep','спільне відновлення і тріска тільки на глибшій воді');
draw(.99);cast('shore');save();load();
A(s.c.fish===count+1&&JSON.stringify(s.bite)===record,'звичайний улов з іншого місця зберігає pending, зокрема після reload');
act('fishRelease');A(!has('cod'),'відмова не видає інгредієнт');
draw(0,.8);cast('deep');s.r.fish=capOf('fish');const xp=s.h.xpb;
act('bigfish');act('bigfish');
A(s.inv.cod===1&&s.f.codCaught&&s.r.fish===capOf('fish')&&s.h.xpb===xp&&!s.belt.includes('cod'),'пізніша тріска дається один раз навіть за повного кошика і без XP');
draw(0,.8);cast('shore');act('bigfish');
A(has('flounder')&&s.f.flounderCaught&&!s.belt.includes('flounder'),'на мілині ловиться камбала');
s.tab='kitchen';s.tabs.kitchen=1;
A(!fishRecipesReady().length,'до зустрічі рецепти приховані');
s.mst.zinovii=1;
A(fishRecipesReady().length===2,'обидва факти улову збереглися до відкриття кухні й зустрічі');
act('fishRecipe','bakedflounder');act('fishRecipe','bakedflounder');
A(rcpKnown('bakedflounder')&&s.inv.flounder===1&&s.dlg.length===1,'розмова один раз і не витрачає рибу');
drain();act('fishRecipe','smokedcod');drain();
s.r.prov=capOf('prov')-2;s.r.wood=4;
act('cookp','smokedcod');
A(s.inv.cod===1&&s.r.wood===4&&s.r.prov===capOf('prov')-2,'нестача місткості захищає інгредієнти');
s.r.prov--;act('cookp','smokedcod');
A(!has('cod')&&s.r.wood===2&&s.r.prov===capOf('prov')&&!has('smokedcod'),'копчена тріска поповнює запас провізії');
act('cookp','bakedflounder');act('cookp','bakedflounder');
A(!has('flounder')&&s.r.wood===0&&s.inv.bakedflounder===1&&beltHas('bakedflounder'),'оплата рівно однієї страви, готова їжа поміщається на пояс');
s.h.hp=2;act('use','bakedflounder');
A(s.h.hp===22&&!has('bakedflounder')&&IT.soup.v===15,'запечена камбала лікує на 20, юшка збережена');
giveI('bakedflounder');startFight('crab1','crab1');s.h.hp=2;
const ap=s.cb.ap;act('c_item','bakedflounder');
A(!has('bakedflounder')&&s.h.hp===22&&s.cb.ap===ap-1,'страва на поясі лікує за одне ОД');

shore();s.tab='work';s.floors.work=1;s.odd.oldhook=1;
act('rodReach','hook');
A(s.f.rodLimitSeen&&s.odd.oldhook&&!s.f.rodRipple,'гачок у майстерні дає альтернативний шлях і лишається в колекції');
shore();s.f.fishBiteSeen=1;s.f.fishBiteResolved=1;
draw(.99);
for(let i=0;i<15;i++)cast();
A(!s.bite&&s.fishSpecies.shore.casts===15,'перший вид чекає придатних закидань');
draw(0,.2);cast();
A(s.bite?.odd==='medallion','одноразовий поріг зберігає розіграну зачіпку');
cast();A(s.fishSpecies.shore.casts===16,'pending не зараховує додаткової спроби');
act('fishRelease');draw(.99);cast();
A(s.bite?.species==='flounder','після вільного закидання діє одноразова допомога');
act('fishRelease');draw(.99);cast();A(!s.bite,'відмова не перетворює допомогу на постійну частоту');
s.tabs.kitchen=1;s.f.zinovii=1;draw(0,.8);cast();act('bigfish');s.tab='kitchen';
A(fishRecipesReady().some(D=>D.id==='bakedflounder'),'кухня й зустріч можуть бути раніше від улову');
shore();s.f.fishBiteSeen=1;save();const legacy=JSON.parse(stored);delete legacy.fishSpecies;stored=JSON.stringify(legacy);load();rodWaterTick();
A(s.f.rodRipple,'старий гравець із завершеним клюванням може повернутися');
Math.random=rng;
console.log('fails',fails)
})()`);
