/* Колишня лебідка: основа ціни потрібна тільки для успадкованого ремонту. */
const OLD_WINCH={base:{wood:28,scrap:21},mult:1.6};
const POT_PART_NAMES={pot:'Початкова частина',winch:'Перенесена частина'};
const savedLevel=value=>Number.isSafeInteger(value)&&value>0?value:0;
const potPaidLevel=()=>Math.max(0,(s.b.pot||0)-s.potTransfer.grantedLevels);

function migrateWinch(savedVersion){
  if(savedVersion===1)return false;
  s.winchMigrationV=1;
  const levels=savedLevel(s.b.winch),pot=savedLevel(s.b.pot);
  if(levels&&Number.isSafeInteger(pot+2*levels)){
    const legacyCrew=Math.min(levels,savedLevel(s.wk.winch));
    const inheritedDamage={};
    if(pot&&s.dmgB.pot)inheritedDamage.pot=pot;
    if(s.dmgB.winch)inheritedDamage.winch=levels;
    s.potTransfer={grantedLevels:2*levels,legacyCrew,inheritedDamage};
    s.b.pot=pot+2*levels;
    s.wk.pot=Math.min(pot,savedLevel(s.wk.pot))+legacyCrew;
    s.bdSeen={...s.bdSeen,pot:1};
    delete s.dmgB.pot;
    s.portableWinch.restored=1;
    say('Роботу лебідки на уламках перебрала пастка в прибої. Ти зберіг готовий переносний механізм.','world');
  }
  for(const key of ['b','wk','dmgB','on','reserveFree','bdSeen'])if(s[key])delete s[key].winch;
  for(const key of ['novUsed','obK','hsU'])if(s[key])delete s[key]['b:winch'];
  s.dlg=s.dlg.filter(d=>d.title!=='Креслення: Лебідка на уламках');
  return true;
}

function sanitizePotTransfer(){
  const t=s.potTransfer,levels=savedLevel(s.b.pot);
  const grantedLevels=2*Math.floor(Math.min(levels,savedLevel(t?.grantedLevels))/2);
  const legacyCrew=Math.min(grantedLevels/2,savedLevel(s.wk.pot),savedLevel(t?.legacyCrew));
  const inheritedDamage={};
  if(grantedLevels){
    const paidDamage=Math.min(levels-grantedLevels,savedLevel(t?.inheritedDamage?.pot));
    const grantedDamage=Math.min(grantedLevels/2,savedLevel(t?.inheritedDamage?.winch));
    if(paidDamage)inheritedDamage.pot=paidDamage;
    if(grantedDamage)inheritedDamage.winch=grantedDamage;
  }
  s.potTransfer={grantedLevels,legacyCrew,inheritedDamage};
}

function potRate(fed){
  if(s.dmgB.pot)return 0;
  const {grantedLevels,legacyCrew,inheritedDamage}=s.potTransfer;
  const paid=potPaidLevel(),workers=Math.min(paid+grantedLevels,s.wk.pot||0);
  const transferred=Math.min(legacyCrew,workers),ordinary=workers-transferred;
  // Звичайні працівники спершу займають місця в початковій частині.
  const onPaid=Math.min(paid,ordinary);
  const paidUnits=inheritedDamage.pot?0:paid+0.5*onPaid*fed;
  const transferredUnits=inheritedDamage.winch?0:grantedLevels+(transferred+0.5*(ordinary-onPaid))*fed;
  return (paidUnits+transferredUnits)*0.15;
}
function removeWorker(id){
  if(!(s.wk[id]>0))return;
  s.wk[id]--;
  if(id==='pot')s.potTransfer.legacyCrew=Math.min(s.potTransfer.legacyCrew,s.wk.pot);
}
function potPartRepairCost(part){
  const level=s.potTransfer.inheritedDamage[part];
  if(!level||!Object.hasOwn(POT_PART_NAMES,part))return null;
  return repairCost(part==='winch'?OLD_WINCH:BD.find(b=>b.id==='pot'),level);
}
function potRepairCost(b){
  const cost=repairCost(b,potPaidLevel()),pending={};
  for(const part of Object.keys(POT_PART_NAMES)){
    const c=potPartRepairCost(part);
    if(c)for(const k of Object.keys(c))pending[k]=(pending[k]||0)+c[k];
  }
  for(const k of Object.keys(pending))cost[k]=Math.max(cost[k]||0,pending[k]);
  return cost;
}
function repairPotPart(part){
  if(s.dmgB.pot)return;
  const cost=potPartRepairCost(part);
  if(!cost||!afford(cost))return;
  pay(cost);delete s.potTransfer.inheritedDamage[part];
  say('Полагоджено: '+POT_PART_NAMES[part].toLowerCase()+' пастки в прибої.','world');
  dirty=1;save();
}
