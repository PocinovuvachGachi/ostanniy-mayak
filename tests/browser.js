/* Перевірка в справжньому браузері (Playwright + Chromium):
   - сторінка вантажиться без помилок у консолі;
   - на ширині 390 px немає горизонтальної прокрутки на жодній вкладці;
   - клік по березі не перезапускає анімацій сусідніх об'єктів;
   - незвичайне клювання на сцені й у списку дій;
   - події, що прийшли без гравця, ховаються в дзвіночок. */
const path = require('path');
const { chromium } = require('playwright');
const URL = process.env.BROWSER_GAME_URL || 'file://' + path.join(__dirname, '..', 'docs', 'index.html');
let fails = 0;
const A = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } };
const isNoise = t => /ERR_TUNNEL|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|fonts\.g/.test(t);

(async () => {
  const b = await chromium.launch();
  const errs = [];
  const page = async (w, h) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !isNoise(m.text() + ' ' + m.location().url)) errs.push(m.text()); });
    p.on('requestfailed', () => {});
    await p.goto(URL);
    await p.waitForTimeout(400);
    return p;
  };

  // Довідник і урок на вузькому екрані: лише відомі механіки.
  {
    const p = await page(390, 844);
    await p.evaluate(() => {s.lastAct=Date.now();s.tot.ember=3;tutOffer('ember');tutTick();render()});
    A(!!await p.$('#dlg .k-tutorial'), 'навчальний діалог');
    A(await p.evaluate(()=>document.documentElement.scrollWidth<=390), 'урок без горизонтальної прокрутки');
    await p.click('#dlg [data-a="dlgok"]');await p.waitForTimeout(300);
    await p.click('#foot [data-a="tutList"]');
    A(!!await p.$('#dlg [data-a="tutRead"][data-i="ember"]')&&!await p.$('#dlg [data-i="map"]'), 'довідник не показує майбутні уроки');
    await p.click('#dlg [data-a="tutRead"][data-i="ember"]');
    A((await p.locator('#dlg h2').innerText())==='Жарина','повторне читання уроку');
    await p.close();
  }
  
  // Ранні інструменти: доступні на березі, не у майстерні.
  {
    const p = await page(390, 844);
    await p.evaluate(() => {s.tabs.shore=1;s.tab='shore';s.f.looked=1;s.f.wreck=1;s.f.hookPlan=1;s.f.rodPlan=1;s.r.wood=50;s.r.scrap=10;s.dlg=[];render()});
    A(!!await p.$('.scn [data-a="hook"]')&&!!await p.$('.scn [data-a="craft"][data-i="rod"]'),'інструменти на березі');
    A(await p.evaluate(()=>!s.floors.work&&!rcVisible(RC.find(r=>r.id==='rod'))),'вудка не потребує майстерні');
    await p.click('.scn [data-a="craft"][data-i="rod"]');
    A(await p.evaluate(()=>s.f.rod&&!s.floors.work),'вудку зроблено на березі');
    A(!!await p.$('.scn [data-a="fishing"]'),'рибалка після виготовлення');
    await p.close();
  }

  // Локальна зона: ті самі дії сцени й списку; вихід, клавіатура, reload.
  {
    const p = await page(390, 844);
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await p.evaluate(() => {
      s.tabs.shore=1;s.tab='shore';s.b.hearth=1;s.f.looked=1;s.f.wreck=1;s.f.rod=1;
      s.f.crab1=1;s.f.tideSeen=1;s.tideEpoch=Date.now();s.f.fishBiteSeen=1;s.c.scrap=11;s.f.hookPlan=1;s.f.rodPlan=1;
      s.dlg=[];s.tutPending=[];s.lastNov=-100;
      s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));s.rcSeen=Object.fromEntries(RC.map(rc=>[rc.id,1]));
      render();
    });
    A(await p.locator('#stage [data-a="zoneEnter"]').count()===0,'палуба ще прихована');
    await p.locator('#stage [data-a="scrapw"]').click();
    const entry=p.locator('#stage [data-a="zoneEnter"][data-i="deck"]');
    await entry.waitFor();await entry.scrollIntoViewIfNeeded();
    A(await entry.evaluate(e=>{
      const a=e.getBoundingClientRect(),b=e.closest('.scn').getBoundingClientRect();
      return s.c.scrap===12&&a.left>=b.left&&a.right<=b.right&&e.contains(document.elementFromPoint(a.x+a.width/2,a.y+a.height/2));
    }),'дванадцятий розбір відкриває повністю доступну точку входу');
    await entry.click();
    const stageBack=p.locator('#stage [data-a="zoneBack"]');
    A(await p.locator('#stage [data-scn="zone-deck"]').count()===1&&await stageBack.evaluate(e=>e===document.activeElement),'вхід зі сцени та фокус на виході');
    A(await p.locator('#stage [data-a="gather"]').count()===0,'зовнішні дії не дублюються всередині');
    A(await p.locator('#main h2').innerText()==='Палуба уламка','ім’я судна приховане до знайомства із Зиновієм');
    const inspect=p.locator('#stage [data-a="zoneAct"][data-i="deck:planks"]');
    await inspect.scrollIntoViewIfNeeded();await inspect.focus();await p.keyboard.press('Enter');
    A(await p.evaluate(()=>!!s.localProgress.deck.planks),'огляд з клавіатури');
    await p.reload();
    A(await p.locator('#stage [data-scn="zone-deck"]').count()===1&&await p.evaluate(()=>s.localProgress.deck.planks),'сцена та огляд після reload');
    A(await p.evaluate(()=>document.documentElement.scrollWidth<=390),'локальна сцена вміщається на телефоні');
    const listBack=p.locator('#main [data-a="zoneBack"]'),summary=p.locator('#main .shore-alist summary');
    await listBack.focus();await p.keyboard.press('Enter');
    A(await p.evaluate(()=>atShore()&&s.localProgress.deck.planks)&&await summary.evaluate(e=>e===document.activeElement),'після виходу фокус на згорнутому списку');
    await summary.click();
    await p.locator('#main [data-a="zoneEnter"][data-i="deck"]').click();
    A(await p.evaluate(()=>localCurrent()==='deck'&&s.localProgress.deck.planks),'повернення списком');
    await stageBack.focus();await p.keyboard.press('Enter');
    A(await entry.evaluate(e=>e===document.activeElement),'після виходу зі сцени фокус повертається до входу');
    await p.evaluate(()=>{s.f.zinovii=1});
    await p.keyboard.press('Enter');
    A(await p.locator('#main h2').innerText()==='Палуба «Мартина»','назва доступна після знайомства');
    await p.close();
  }

  // Наповнена палуба: доступні центри, видимі результати та збереження.
  for(const width of [390,1280]){
    const p=await page(width,900);
    if(width===390)await p.emulateMedia({reducedMotion:'reduce'});
    await p.evaluate(()=>{
      Math.random=()=>.99;
      s.tab='shore';s.tabs.shore=1;
      Object.assign(s.f,{looked:1,wreck:1,deckSeen:1,hook:1,hookPlan:1,rod:1,rodUp:1,crab1:1,tideSeen:1,boat:1});
      s.b.hearth=1;s.tideEpoch=Date.now()-620000;s.lastNov=s.play;
      s.c.scrap=12;s.localProgress.deck={visited:1,planks:1};
      s.ship={until:Date.now()+180000,offers:[],done:[]};
      s.hookWater.pending={id:1,kind:'plank',reward:{wood:4}};
      giveI('rake');s.rakeSand.lastId=2;s.rakeSand.dry={id:2,kind:'dry',reward:{wood:2}};
      s.rakeSand.wet={id:1,kind:'wet',reward:{scrap:2}};
      s.bts=Object.fromEntries(CH.flatMap(ch=>ch.beats.map(beat=>[beat[0],1])));
      s.chs=CH.map(ch=>ch.id);s.tutSeen.tide=1;s.f.fishBiteSeen=1;
      s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));s.rcSeen=Object.fromEntries(RC.map(rc=>[rc.id,1]));
      render();
    });
    const shore=p.locator('.scn.sh'),deck=p.locator('[data-scn="zone-deck"]');
    const entry=shore.locator('[data-a="zoneEnter"][data-i="deck"]');
    const checkPoints=scene=>scene.evaluate(e=>{
      // Після дії зі списку повертаємо в кадр усю сцену, нижче закріпленої панелі ресурсів.
      e.scrollIntoView({block:'center',inline:'nearest'});
      const buttons=[...e.querySelectorAll('button[data-a]')];
      return buttons.every(b=>{
        b.scrollIntoView({block:'nearest',inline:'center'});
        const r=b.getBoundingClientRect(),frame=e.getBoundingClientRect();
        return r.left>=frame.left&&r.right<=frame.right
          &&b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
      });
    });
    A(await checkPoints(shore),'палуба, когг, вудки, граблі, багор і мідії доступні на березі · '+width);
    await entry.click();
    const item=id=>deck.locator('[data-i="deck:'+id+'"]');
    const inList=id=>p.locator('#main [data-i="deck:'+id+'"]');
    const art=loc=>loc.locator('.obi').getAttribute('src');
    const back=deck.locator('[data-a="zoneBack"]');
    A(await checkPoints(deck)&&await deck.locator('button[data-a]').count()===5,'чотири об’єкти й вихід мають власні центри · '+width);
    A(await p.locator('#main').innerText().then(t=>!t.includes('Забрати')&&!t.includes('Мартин')&&!t.includes('трюм')),
      'до огляду приховані назва й дія підбору · '+width);
    const oldHatch=await art(item('hatch')),oldMount=await art(item('mount')),oldWinch=await art(item('winch'));
    await item('hatch').focus();await p.keyboard.press('Enter');
    A(oldHatch!==await art(item('hatch'))&&await item('hatch').evaluate(e=>e===document.activeElement)
      &&(await p.locator('#main').innerText()).includes('важка балка'),'балка, стан люка і фокус після огляду · '+width);
    await inList('mount').click();
    A(oldMount!==await art(item('mount')),'огляд зі списку змінює спрайт основи щогли · '+width);
    if(width===390){
      await item('winch').focus();await p.keyboard.press('Enter');
      A(await item('winchTaken').evaluate(e=>e===document.activeElement&&getComputedStyle(e).animationName==='none'),
        'фокус переходить до підбору у режимі зменшеного руху');
    }else{
      await inList('winch').focus();await p.keyboard.press('Enter');
      A(await inList('winchTaken').evaluate(e=>e===document.activeElement),'фокус переходить до підбору у списку');
    }
    A(!await item('winch').count()&&oldWinch!==await art(item('winchTaken'))&&await checkPoints(deck),'спрайт після огляду й незалежність точок · '+width);
    await p.reload();await deck.waitFor();
    A(await item('winchTaken').count()===1&&oldHatch!==await art(item('hatch')),'reload між оглядом і підбором · '+width);
    const pickup=width===390?item('winchTaken'):inList('winchTaken');
    const focusedBack=width===390?back:p.locator('#main [data-a="zoneBack"]');
    await pickup.focus();await p.keyboard.press('Enter');
    A(!await item('winchTaken').count()&&!await inList('winchTaken').count()&&await focusedBack.evaluate(e=>e===document.activeElement)
      &&(await p.locator('#main').innerText()).includes('порожніми отворами'),'механізм зникає, лишається основа й доступний фокус · '+width);
    A(await checkPoints(deck)&&await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'точки після підбору лишаються доступними · '+width);
    await p.reload();await deck.waitFor();
    await back.focus();await p.keyboard.press('Enter');
    A(await entry.evaluate(e=>e===document.activeElement)&&await shore.locator('[data-a="mussels"]').count()===1,
      'після reload і виходу берег знову доступний · '+width);
    await p.evaluate(()=>{s.tideEpoch=Date.now()-120000});
    await shore.and(p.locator('[data-tide="high"]')).waitFor();
    await entry.click();
    A(!await item('winchTaken').count()&&await p.evaluate(()=>s.localProgress.deck.winchTaken&&s.localProgress.deck.planks),
      'за повної води механізм не повертається, старий огляд лишається · '+width);
    await back.click();
    await p.evaluate(()=>{
      s.f.gullrack=1;s.shf='zinovii';act('shfgo','zinovii');
      while(s.dlg.length)act('dlgok');
      s.floors.work=1;s.tabs.tower=1;s.tabs.work=1;s.r.wood=40;s.r.scrap=36;
      render();save();
    });
    const tab=id=>p.locator('#tabs [data-a="tab"][data-i="'+id+'"]');
    await tab('home').click();
    const topic=p.locator('#main [data-a="winchTalk"]');
    await topic.focus();await p.keyboard.press('Enter');
    A(await p.locator('#dlg').innerText().then(t=>t.includes('Механізм із палуби')),'тема доступна до кухні · '+width);
    await p.reload();
    await p.locator('#dlg [data-a="dlgok"]').click();
    await tab('tower').click();
    await p.locator('#main [data-a="tt"][data-i="work"]').click();
    const craft=p.locator('#main [data-a="craft"][data-i="winchRestore"]');
    A(await craft.innerText()==='Відновити лебідку','дія відновлення на верстаку · '+width);
    await craft.click();await craft.waitFor({state:'detached'});
    await tab('shore').click();await entry.click();
    const install=width===390?item('install'):inList('install');
    const pull=width===390?item('pull'):inList('pull');
    const detach=width===390?inList('detach'):item('detach');
    const hatch=width===390?item('openHatch'):inList('openHatch');
    const beam=deck.locator('[data-sk="deck-beam"]');
    const beamBefore=await beam.getAttribute('style');
    await install.focus();await p.keyboard.press('Enter');
    A(await pull.evaluate(e=>e===document.activeElement)&&await checkPoints(deck)
      &&await deck.locator('[data-sk="deck-rope"]').count()===1,'фокус, натягнута линва та точки після монтажу · '+width);
    await p.reload();await deck.waitFor();
    A(await deck.locator('[data-sk="deck-rope"]').count()===1&&await p.evaluate(()=>s.portableWinch.mountedAt==='deck:mount'),
      'монтаж збережено після reload · '+width);
    await detach.click();await install.waitFor();
    A(!await deck.locator('[data-sk="deck-rope"]').count(),'демонтаж прибирає линву · '+width);
    await install.click();
    await pull.focus();await p.keyboard.press('Enter');
    A(await hatch.evaluate(e=>e===document.activeElement)&&await beam.getAttribute('style')!==beamBefore,
      'балка змінила місце, фокус на огляді · '+width);
    A(await beam.evaluate(e=>getComputedStyle(e).animationName)===(width===390?'none':'deck-haul'),
      'підтягування поважає режим зменшеного руху · '+width);
    A(await p.evaluate(()=>{
      const d=JSON.parse(localStorage.getItem(KEY));
      return d.localProgress.deck.beamMoved&&d.portableWinch.restored&&!d.portableWinch.mountedAt&&!d.f.rats;
    }),'кінцевий стан записаний ще під час анімації · '+width);
    await p.reload();await deck.waitFor();
    A(!await pull.count()&&!await install.count()&&!await deck.locator('[data-sk="deck-rope"]').count()
      &&await beam.evaluate(e=>getComputedStyle(e).animationName==='none')&&await checkPoints(deck)
      &&await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'reload зберігає балку й доступність сцени · '+width);
    A(await p.locator('#main').innerText().then(t=>t.includes('люк і досі зачинений')),'люк лишається зачиненим · '+width);
    const hold=p.locator('[data-scn="zone-hold"]');
    const descend=scope=>scope.locator('[data-a="zoneEnter"][data-i="hold"]');
    const currentList=p.locator('#main');
    const mouth=width===390?item('dark'):inList('dark');
    A(await hatch.count()===1&&!await descend(deck).count(),'зсунута балка ще не відкрила трюм · '+width);
    await hatch.focus();await p.keyboard.press('Enter');
    A(await mouth.evaluate(e=>e===document.activeElement)&&!await descend(deck).count()
      &&await currentList.innerText().then(t=>!t.includes('пацюк')),'люк відкриває темряву й переводить фокус · '+width);
    await p.reload();await deck.waitFor();
    A(await mouth.count()===1&&!await hold.count(),'відкритий темний люк переживає reload · '+width);

    if(width===390){
      await p.evaluate(()=>{s.r.oil=0;s.r.fish=6;s.f.barrel=1;render()});
      await tab('home').click();
      const oil=currentList.locator('[data-a="holdOil"]');
      for(let i=0;i<6;i++)await oil.click();
      A(!await oil.count()&&await p.evaluate(()=>s.r.oil===6&&s.r.fish===0&&!s.tabs.kitchen),'з нуля до каганця через Зиновія, без кухні');
      await tab('tower').click();
      await currentList.locator('[data-a="tt"][data-i="work"]').click();
      await currentList.locator('[data-a="craft"][data-i="lamp"]').click();
      await tab('shore').click();await entry.click();
      A(await p.evaluate(()=>has('lamp')&&s.eq.light==='lamp'&&s.r.oil===0),'каганець екіпірований у штатний слот, без запасу пального');
    }else{
      await p.evaluate(()=>{giveI('storm');s.eq.light='';render();save()});
      const equip=currentList.locator('[data-a="equip"][data-i="storm"]');
      await equip.focus();await p.keyboard.press('Enter');
      A(await descend(currentList).evaluate(e=>e===document.activeElement)&&await p.evaluate(()=>!has('lamp')),
        'наявний штормовий ліхтар, фокус на вході після екіпірування');
    }
    const down=width===390?descend(deck):descend(currentList);
    await down.focus();await p.keyboard.press('Enter');
    A(await hold.getAttribute('data-light')===(width===390?'lamp':'storm')&&await checkPoints(hold)
      &&await hold.evaluate(e=>e.getBoundingClientRect().width<=innerWidth),
      'джерело світла й незалежність точок трюму · '+width);
    const lightSprite=hold.locator(width===390?'[data-sk="ltf"]':'[data-sk="ltw"]');
    A(await lightSprite.evaluate(e=>e.complete&&e.naturalWidth>0&&(innerWidth>390||getComputedStyle(e).animationName==='none')),
      'різні шари світла й зменшений рух · '+width);
    const fight=hold.locator('[data-i="hold:rats"]');
    const up=(width===390?hold:currentList).locator('[data-a="zoneBack"][data-i="hold"]');
    A(await up.evaluate(e=>e===document.activeElement)&&await fight.count()===1&&await p.evaluate(()=>!s.cb),
      'фокус на виході та добровільний вступ у бій · '+width);
    await p.keyboard.press('Enter');
    A(await down.evaluate(e=>e===document.activeElement),'фокус на люку після повернення на палубу · '+width);
    await p.keyboard.press('Enter');
    await p.reload();await hold.waitFor();
    A(await fight.count()===1,'reload трюму не запускає бій · '+width);
    await fight.focus();await p.keyboard.press('Enter');
    A(await p.evaluate(()=>s.cb?.win==='S:rats'&&localCurrent()==='hold'),'бій починається з інтерактивної точки · '+width);
    await p.evaluate(()=>{s.cb.intro=0;act('c_mv','-1,0');render()});
    await p.locator('[data-a="c_flee"]').click();
    await deck.waitFor();
    A(await p.evaluate(()=>!s.f.rats&&!s.odd.logpage),'відступ без здобичі · '+width);
    await down.click();await fight.click();
    await p.evaluate(()=>{for(const enemy of s.cb.u)enemy.hp=0;win();render()});
    for(let n=0;await p.locator('#dlg [data-a="dlgok"]').count()&&n<5;n++){
      await p.locator('#dlg [data-a="dlgok"]').click();
    }
    const barrels=hold.locator('[data-i="hold:barrels"]');
    A(!await fight.count()&&await barrels.count()===1&&await checkPoints(hold)
      &&await p.evaluate(()=>s.f.rats&&s.odd.logpage&&document.documentElement.scrollWidth<=innerWidth),
      'після перемоги доступний очищений трюм та судновий журнал · '+width);
    await p.close();
  }

  // Старий файл завантажується через штатний імпорт і зберігається повторно.
  {
    const p=await page(390,844);
    const url=new global.URL(URL);url.searchParams.set('debug','1');
    await p.goto(url.href);
    const debug=p.locator('#dbg');
    await debug.locator('summary').click();
    const legacy=await p.evaluate(()=>{
      const d=fresh();
      delete d.winchMigrationV;delete d.potTransfer;delete d.portableWinch;
      d.b={hearth:1,pot:2,winch:2};d.wk={pot:1,winch:2};d.pop=4;
      d.dmgB={winch:1};d.f={looked:1,people:1};d.tabs.chron=1;d.r.wood=100;d.r.scrap=40;d.ldOpen=1;
      d.bts=Object.fromEntries(CH.flatMap(ch=>ch.beats.map(beat=>[beat[0],1])));d.chs=CH.map(ch=>ch.id);
      return JSON.stringify(d);
    });
    const input=debug.locator('#dbgSave');
    await input.fill(legacy);
    await debug.locator('#dbgIn').click();
    const row=p.locator('#bd-pot');
    await row.waitFor();
    A(await row.innerText().then(t=>t.includes('рівень 6')&&t.includes('Перенесені рівні: 4')
      &&t.includes('Працівників зі старої лебідки: 2')&&t.includes('Перенесена частина пошкоджена')),
      'книга обліку показує перенесені рівні, бригаду й окремий ремонт');
    const spot=p.locator('#stage [data-a="bpop"][data-i="pot"]');
    await spot.click();
    const popup=p.locator('#popl .bpop');
    A(await popup.innerText().then(t=>t.includes('Перенесена частина пошкоджена')),'картка пастки показує успадкований ремонт');
    await popup.locator('[data-a="repairPotPart"][data-i="winch"]').click();
    A(!await popup.locator('[data-a="repairPotPart"]').count()&&await p.evaluate(()=>s.portableWinch.restored&&s.b.pot===6),
      'ремонт працює з мобільної картки');
    await popup.locator('.bpx').click();
    await debug.locator('summary').click();
    await debug.locator('#dbgOut').click();
    await Promise.all([p.waitForEvent('load'),debug.locator('#dbgIn').click()]);
    await row.waitFor();
    A(await p.evaluate(()=>s.b.pot===6&&s.wk.pot===3&&s.winchMigrationV===1&&!s.dmgB.pot&&s.portableWinch.restored)
      &&!await row.locator('[data-a="repairPotPart"]').count(),'експорт й імпорт не повторюють компенсацію чи поломку');
    await p.close();
  }

  // Сушарня: від останньої риболовлі до збирання партії після повернення.
  {
    const p = await page(390, 844);
    await p.evaluate(() => {
      s.tabs.shore = 1; s.tab = 'shore'; s.f.looked = 1;
      s.f.wreck = 1; s.f.hook = 1; s.f.rod = 1; s.f.crab1 = 1; s.floors.work = 1;
      giveI('oar');
      s.c.fish = 7; s.r.wood = 30; s.r.scrap = 10; s.r.fish = 7;
      s.f.fishBiteSeen = 1; Math.random = () => 0.99; s.tideEpoch = Date.now(); s.f.tideSeen = 1;
      s.lastNov = -60; s.dlg = []; render();
    });
    const rack = p.locator('.scn [data-k="dryrack"]');
    A(await rack.count() === 0 && await p.locator('#sec-dryrack').count() === 0, 'сушарня ще прихована');
    await p.click('.scn [data-a="fishing"]');
    await p.locator('#dlg h2', { hasText: 'Риба на вітрі' }).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    await rack.click();
    await p.locator('#dlg .k-tutorial h2', { hasText: 'Сушарня' }).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    A(await p.evaluate(() => s.f.dryRack && !s.shf && !BD.find(b => b.id === 'smoke').show0()),
      'сушарню збудовано, чайки й коптильня ще приховані');
    await rack.click();
    A(await p.evaluate(() => dryBusy() && s.r.fish === 4), 'партія риби на сушарні');

    await p.evaluate(() => {
      // Минув час поза грою. Відлік партії відновлюється через load() і produce().
      s.r.prov = capOf('prov');
      save();
      const stored = JSON.parse(localStorage.getItem(KEY));
      stored.ts -= 65_000;
      localStorage.setItem(KEY, JSON.stringify(stored));
    });
    await p.reload();
    await p.waitForFunction(() => dryReady() && s.shf === 'gullrack');
    const position = await p.locator('.scn [data-k="shf:gullrack"]').evaluate(e => {
      const bird = e.getBoundingClientRect();
      const rack = e.closest('.scn').querySelector('[data-k="dryrack"]').getBoundingClientRect();
      return (bird.left + bird.right) / 2 > rack.left && bird.bottom <= rack.top;
    });
    A(position, 'чайки над сушарнею, кнопки не перекриваються');
    A(await p.locator('#sec-dryrack [data-a="drytake"]').isDisabled(), 'готова партія чекає місця після завантаження');
    await p.evaluate(() => { s.r.prov--; render(); });
    await rack.click();
    A(await p.evaluate(() => !dryBusy() && s.r.prov === capOf('prov') && s.f.dryMade), 'провізію зібрано один раз');
    A(await p.evaluate(() => document.documentElement.scrollWidth <= 390), 'сушарня без горизонтальної прокрутки сторінки');
    await p.locator('.scn [data-k="shf:gullrack"]').click({ timeout: 5000 });
    A(await p.evaluate(() => s.cb?.enc === 'gullrack'), 'натискання на чайок починає бій');
    await p.close();
  }

  // Збереження до сушарні: старий бій, креслення й граблі доступні після load().
  {
    const p = await page(390, 844);
    await p.evaluate(() => {
      s.tabs.shore = 1; s.tab = 'shore'; s.f.looked = 1;
      s.f.wreck = 1; s.f.rod = 1; s.f.crab1 = 1; s.floors.work = 1;
      giveI('oar'); giveI('rake');
      s.bdSeen.smoke = 1; s.r.fish = 8; s.shf = 'gullrack';
      save();
    });
    await p.reload();
    A(await p.evaluate(() => BD.find(b => b.id === 'smoke').show() && SHF.gullrack.ok() && s.tutSeen.rake),
      'коптильня, чайки й урок граблів у старому збереженні');
    A((await p.locator('.scn [data-k="shf:gullrack"]').getAttribute('data-tip')).includes('над уловом на березі'),
      'пояснення старого бою відповідає стану берега');
    await p.evaluate(() => {
      s.done['chaika.hold.down'] = 1;
      delete s.rel;
      save();
    });
    await p.reload();
    A(await p.evaluate(() => has('r_oar1') && s.rel.r_oar1), 'реліквію завершеного бою відновлено');
    await p.close();
  }

  // Речі з «Мартина» можна обговорити до завершення набору.
  {
    const p = await page(390, 844);
    await p.evaluate(() => {
      s.tabs.tower = 1;
      s.tab = 'tower';
      s.b.hearth = 1;
      s.odd.mbell = 1;
      s.f.zinovii = 1;
      render();
    });
    const shelf = p.locator('.scn [data-i="cl:shelf"]');
    await shelf.click();
    const talk = p.locator('.bpop [data-a="martinLadle"]');
    A(await talk.count() === 0, 'на полиці є лише вже відомі речі');
    await p.evaluate(() => { s.odd.mladle = 1; render(); });
    await p.click('.shelf-slot[data-i="mladle"]');
    await talk.click();
    A((await p.locator('#dlg h2').innerText()) === 'Рибка на держаку', 'Зиновій упізнав черпак');
    A(await p.evaluate(() => s.odd.mladle && !s.f.martinSet), 'розмова зберігає знахідку й не завершує набір');
    await p.click('#dlg [data-a="dlgok"]');
    await p.reload();
    await shelf.click();
    await p.click('.shelf-slot[data-i="mladle"]');
    A(await talk.count() === 0, 'розмова не повторюється після завантаження');
    await p.close();
  }

  // Судновий журнал після пацюків. Полиця дає повернутися до розмови.
  for (const fromShelf of [false, true]) {
    const p = await page(390, 844);
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await p.evaluate(() => {
      s.tabs.tower = 1; s.tab = 'tower'; s.b.hearth = 1;
      s.odd.mbell = 1; s.f.zinovii = 1;
      render();
    });
    const shelf = p.locator('.scn [data-i="cl:shelf"]');
    await shelf.click();
    const talk = p.locator('.bpop [data-a="martinLog"]');
    A(await talk.count() === 0, 'сторінку ще не знайдено');
    await p.click('.bpop .bpx');
    const ratsAt = await p.evaluate(() => { shfWin('rats'); render(); return s.ratsT; });
    A((await p.locator('#dlg h2').innerText()).includes('Сторінка суднового журналу'), 'сторінка випадає після пацюків');
    if (fromShelf) {
      await p.click('#dlg [data-a="dlgok"]');
      await p.reload();
      await shelf.click();
      await p.click('.shelf-slot[data-i="logpage"]');
      await talk.click();
    } else {
      await p.click('#dlg [data-a="martinLog"]');
    }
    A((await p.locator('#dlg h2').innerText()) === 'На полях журналу', 'Зиновій читає знайдену сторінку');
    A(await p.evaluate(ratsAt => s.odd.logpage && s.f.martinLogStory && !s.f.tracks && s.ratsT === ratsAt, ratsAt),
      'розмова зберігає сторінку й час появи слідів');
    await p.click('#dlg [data-a="dlgok"]');
    await p.reload();
    await shelf.click();
    await p.click('.shelf-slot[data-i="logpage"]');
    A(await talk.count() === 0, 'розмова не повторюється після завантаження');
    A(await p.evaluate(() => document.documentElement.scrollWidth <= 390), 'полиця вміщається на телефоні');
    await p.close();
  }

  // Колекція на полиці, прочитані тексти в журналі.
  {
    const p = await page(390, 844);
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await p.evaluate(() => {
      s.tabs.tower=1;s.tabs.journal=1;s.tab='tower';s.b.hearth=1;s.f.looked=1;
      s.odd=Object.fromEntries(['gull','spiral','pearl','ear','compass','holecoin','mbell','mladle',
        'seaglass','amberbit','oldhook','woodhorse','letter1'].map(id=>[id,1]));
      render();
    });
    const shelf=p.locator('.scn [data-i="cl:shelf"]');
    const stageArt=await shelf.locator('img.obi').getAttribute('src');
    await shelf.click();
    const panel=p.getByRole('dialog',{name:'Полиця хранителя'});
    const item=id=>panel.locator(`.shelf-slot[data-i="${id}"]`);
    const back=panel.getByRole('button',{name:'До полиці'});
    A(await panel.locator('.shelf-slot').count()===13,'усі знахідки, зокрема після восьмої, доступні');
    A(await item('seaglass').locator('img').getAttribute('src')!==await item('amberbit').locator('img').getAttribute('src'),
      'морське скло й бурштин мають власні піктограми');
    await item('woodhorse').click();
    A(await panel.getByRole('heading',{name:'Дерев’яний коник'}).isVisible(),'окрема картка знайденого коника');
    A(!await panel.getByRole('button',{name:'Подарувати Петрикові'}).count()&&!await item('logpage').count(),
      'полиця не розкриває майбутню зустріч і невідомі предмети');
    await back.click();
    await item('letter1').click();
    A(!await panel.getByText('Мамо, ми зимуємо',{exact:false}).count(),'непрочитаний лист не розкрито');
    await panel.getByRole('button',{name:'Прочитати',exact:true}).click();
    A(await panel.getByText('Мамо, ми зимуємо',{exact:false}).isVisible(),'лист читається з полиці');
    await panel.getByRole('button',{name:'Закрити'}).click();
    await p.click('#tabs [data-i="journal"]');
    A(!await p.locator('[data-a="jt"][data-i="odd"]').count()&&!await p.locator('.jhead').getByText('дивин',{exact:false}).count(),
      'журнал не дублює колекцію');
    await p.click('[data-a="jt"][data-i="documents"]');
    A(await p.locator('.notes').getByText('Мамо, ми зимуємо',{exact:false}).isVisible()&&!await p.locator('.notes .no').count(),
      'текст доступний у журналі без номера записки Остапа');

    await p.evaluate(()=>{s.f.horpyna=1;render()});
    await p.click('#tabs [data-i="tower"]');
    await shelf.click();
    await item('woodhorse').click();
    await panel.getByRole('button',{name:'Подарувати Петрикові'}).click();
    A(await p.locator('#dlg h2',{hasText:'Коник для Петрика'}).isVisible(),'передача дає реакцію Петрика');
    await p.click('#dlg [data-a="dlgok"]');
    A(await panel.getByText('Коник лишився в Петрика.',{exact:false}).isVisible()
      &&!await panel.getByRole('button',{name:'Подарувати Петрикові'}).count()
      &&stageArt!==await shelf.locator('img.obi').getAttribute('src'),'полиця замінює іграшку записом про її долю');
    await p.reload();
    await shelf.click();
    await item('woodhorse').click();
    A(await panel.getByText('Коник лишився в Петрика.',{exact:false}).isVisible(),'запис зберігся після завантаження');
    A(await p.evaluate(()=>document.documentElement.scrollWidth<=390),'полиця й картка не розширюють сторінку');
    await p.evaluate(()=>{
      s.tabs.shore=1;s.f.wreck=1;s.c.gather=50;s.lastNov=s.play;
      delete s.odd.seaglass;
      Math.random=()=>0;render();
    });
    await p.click('#tabs [data-i="shore"]');
    await p.click('.scn [data-sk="gather"]');
    await p.locator('#dlg h2',{hasText:'Морське скло'}).waitFor();
    A(await p.evaluate(()=>s.c.gather===51&&s.r.wood>=1&&JSON.parse(localStorage.getItem(KEY)).odd.seaglass),
      'ручний збір у сцені дає звичайний плавник і зберігає знахідку одразу');
    await p.close();
  }

  // Мобільна картка місця не заважає закрити сюжетний діалог.
  {
    const p = await page(390, 844);
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await p.evaluate(() => {
      s.tabs.map = 1; s.tab = 'map'; s.disc.village = 1; s.at = 'village';
      render();
    });
    await p.click('.scn [data-i="lc:tavern"]');
    await p.click('.bpop [data-i="village.tavern.talk"]');
    await p.click('#dlg [data-a="dlgok"]', { timeout: 5000 });
    A(await p.evaluate(() => !!s.met.levko && !s.dlg.length), 'діалог Левка закривається поверх мобільної картки');
    await p.close();
  }

  // 1. Усі вкладки на телефоні й на широкому екрані
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const p = await page(w, h);
    const tabs = await p.evaluate(() => {
      s.f.looked = 1; s.b.hearth = 3; s.floors.work = 1; s.floors.gallery = 1; s.floors.study = 1; s.floors.lantern = 1;
      s.f.wreck = 1; s.f.rod = 1; s.f.people = 1; s.pop = 3; s.b.house = 2; s.f.boat = 1;
      for (const k of RES) { s.seen[k] = 1; s.r[k] = 500; }
      for (const t of TABS) s.tabs[t[0]] = 1;
      s.dlg = []; render();
      return TABS.map(t => t[0]);
    });
    for (const t of tabs.concat(['work', 'kitchen', 'study'])) {
      await p.evaluate(t => { s.dlg = []; s.tabs[t] = 1; if (SUBT[t]) { s.tab = 'tower'; s.tt = t } else s.tab = t; render(); }, t);
      await p.waitForTimeout(150);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth);
      A(sw <= w, `горизонтальна прокрутка на «${t}» при ${w}px: ${sw}`);
    }
    await p.close();
  }

  // 2. Берег: кліки не перезапускають анімації інших об'єктів
  {
    const p = await page(1100, 900);
    await p.evaluate(() => {
      window.dlg = () => {}; s.f.looked = 1; s.tabs = { home: 1, shore: 1 }; s.tab = 'shore'; s.f.wreck = 1; s.f.rod = 1; s.f.hook = 1; // стабільна сцена: нове відкриття багра має власну анімацію появи
      s.seen.wood = 1; s.seen.scrap = 1; s.seen.fish = 1; s.hsU = { gather: 1, rod: 1, wreck: 1 }; render();
    });
    await p.waitForTimeout(500);
    await p.evaluate(() => {
      window.__ws = new WeakSet(); window.__bad = 0;
      const scan = (count) => { for (const a of document.getElementById('stage').getAnimations({ subtree: true })) {
        if (__ws.has(a)) continue; __ws.add(a);
        const t = a.effect && a.effect.target, k = t && t.closest && t.closest('[data-k]');
        if (count && a.animationName && !(k && k.dataset.k === window.__clicked)) __bad++;
      } };
      scan(false); window.__scan = scan;
    });
    for (let i = 0; i < 12; i++) {
      const k = ['gather', 'wreck', 'rod'][i % 3];
      await p.evaluate(k => { window.__clicked = k; }, k);
      const el = await p.$(`.scn [data-k="${k}"]`);
      if (!el) { A(0, 'немає об’єкта ' + k); break; }
      const bb = await el.boundingBox();
      await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
      await p.waitForTimeout(120);
      await p.evaluate(() => { if (window.MG) mgEnd(0, 1); __scan(true); });
    }
    A(await p.evaluate(() => __bad) === 0, 'кліки на березі перезапускають чужі анімації');
    await p.close();
  }

  // Збір плавника: окрема анімація, відсутність стрибка від cooldown, спокій у кінці.
  {
    const p = await page(390, 844);
    await p.evaluate(() => { s.tabs.shore=1; s.tab='shore'; s.f.looked=1; s.dlg=[]; s.hsU={gather:1}; render(); });
    await p.locator('[data-sk="gather"]').click();
    A(await p.locator('[data-sk="gather"] .dlw').evaluate(e=>e.getAnimations().length>0), 'плавник не має анімації підбору');
    await p.waitForTimeout(300);
    A(await p.locator('[data-sk="gather"]').evaluate(e=>{const c=getComputedStyle(e,'::after');return c.display!=='none'&&Number(c.opacity)>0}), 'шкала відновлення плавника прихована');
    await p.waitForTimeout(1200);
    A(await p.locator('[data-sk="gather"] .dlw').evaluate(e=>getComputedStyle(e).transform==='none'), 'плавник не повернувся в початкову позицію');
    A(await p.locator('[data-sk="gather"]').evaluate(e=>Number(getComputedStyle(e,'::after').opacity)<.05), 'шкала не зникла після відновлення');
    await p.close();
  }
  // Смужки HP: під героєм і ворогом, у межах клітинки.
  {
    const p = await page(390, 844);
    await p.evaluate(() => {s.dlg=[]; s.tabs.hero=1; startFight('gullrack','S:gullrack'); render();});
    const bars=await p.evaluate(()=>[...document.querySelectorAll('.grid.ar .uhp')].map(e=>{const r=e.getBoundingClientRect(), b=e.parentElement.getBoundingClientRect();return {k:e.className,ok:r.top>=b.top+b.height*.65&&r.bottom<=b.bottom+1};}));
    A(bars.some(b=>b.k.includes('me'))&&bars.some(b=>b.k.includes('fo'))&&bars.every(b=>b.ok),'смужки HP не під бойовими юнітами');
    await p.close();
  }

  // 3. Незвичайне клювання: поплавець, відновлення, вихід і повернення, місткість.
  {
    const p = await page(390, 844);
    await p.evaluate(() => {
      s.f.looked=1;s.f.rod=1;s.f.tideSeen=1;s.f.crab1=1;s.tabs.shore=1;s.tab='shore';
      s.tideEpoch=Date.now();s.c.fish=4;s.r.fish=4;s.dlg=[];s.tutPending=[];
      Math.random=()=>0.2;render();
    });
    const rod=p.locator('.scn [data-k="rod"]');
    const marker=p.locator('.scn [data-k="sh:bite"]');
    const pop=p.locator('#popl .bpop');
    const list=p.locator('.shore-alist');
    const hasDiamond=e=>getComputedStyle(e,'::before').content==='""'&&getComputedStyle(e,'::before').transform!=='none';
    A(!await rod.locator('.bob').evaluate(hasDiamond),'звичайний поплавець без ромба');
    await rod.click();
    A(await p.evaluate(()=>s.r.fish===5&&s.c.fish===5&&s.bite?.kind==='fish'),'базовий улов і бонус після натискання на вудку');
    A(await marker.locator('.bob').evaluate(e=>getComputedStyle(e).animationName)==='fish-bob-tug','окрема анімація поплавця');
    await p.locator('#dlg .k-tutorial h2',{hasText:'Незвичайне клювання'}).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    await marker.click();
    const recast=pop.getByRole('button',{name:'Закинути знову'});
    A(await recast.isDisabled(),'штатне відновлення після клювання');
    await recast.click();
    A(await p.evaluate(()=>s.r.fish===6&&s.c.fish===6&&s.bite?.amount===2),'закидання зі сцени працює зі збереженим бонусом');
    await p.click('#tabs [data-i="home"]');
    await p.evaluate(() => {
      const stored=JSON.parse(localStorage.getItem(KEY));stored.ts-=600_000;
      localStorage.setItem(KEY,JSON.stringify(stored));
    });
    await p.reload();
    await p.click('#tabs [data-i="shore"]');
    A(await marker.isVisible()&&await p.evaluate(()=>s.bite?.amount===2),'сцена відновлює поплавець після повернення й reload');
    const bob=marker.locator('.bob');
    await p.waitForFunction(()=>document.querySelector('.rod-catch .bob')?.getAnimations().every(a=>a.playState!=='running'));
    A(await bob.evaluate(hasDiamond),'після анімації на поплавці видно ромб');
    await p.emulateMedia({reducedMotion:'reduce'});
    A(await bob.evaluate(e=>getComputedStyle(e).animationName)==='none'&&await bob.evaluate(hasDiamond),
      'у reduced motion ромб видно без анімації');
    await marker.click();
    A(await pop.getByRole('button',{name:'Витягнути улов'}).isVisible(),'після повернення улов доступний зі сцени');
    A(await p.evaluate(()=>document.documentElement.scrollWidth<=390),'картка клювання не розширює сторінку');
    await pop.getByRole('button',{name:'Закрити'}).click();

    await p.evaluate(()=>{s.r.fish=capOf('fish');render()});
    await list.locator('summary').click();
    const claim=list.getByRole('button',{name:'Витягнути улов'});
    A(await claim.isDisabled()&&await list.getByText('Улов може почекати.',{exact:false}).isVisible(),
      'повний кошик: список пояснює, що бонус може почекати');
    A(await p.evaluate(()=>document.documentElement.scrollWidth<=390),'список дій не розширює сторінку');
    await p.evaluate(()=>{s.r.fish-=2;refresh()});
    await claim.click();
    A(await p.evaluate(()=>!s.bite&&s.c.fish===6&&s.r.fish===capOf('fish')),'список дозволяє забрати бонус один раз');
    await p.evaluate(()=>{Math.random=()=>0.9;fishBiteOffer();render()});
    A(await list.getByRole('button',{name:'Відпустити'}).isVisible(),'список лишається відкритим після оновлення');
    await list.getByRole('button',{name:'Відпустити'}).click();
    A(await p.evaluate(()=>!s.bite&&!s.odd.medallion&&!s.dlg.length),'відмова без винагороди та повторного уроку');
    await p.close();
  }

  // Багор на воді: той самий вантаж у двох фазах, зі сцени й зі списку.
  {
    const p=await page(390,844);
    await p.evaluate(()=>{
      s.tabs.shore=1;s.tabs.tower=1;s.tab='shore';s.f.looked=1;s.f.hook=1;s.f.rod=1;s.f.crab1=1;s.f.tideSeen=1;s.f.wreck=1;
      s.dbgTide='high';s.c.gather=25;s.r.wood=50;s.r.scrap=20;s.dlg=[];s.lastAct=Date.now();
      s.tutPending=[];s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));
      s.rcSeen=Object.fromEntries(RC.filter(rc=>rc.id!=='hookUp').map(rc=>[rc.id,1]));
      Math.random=()=>0;render();
    });
    const gather=p.locator('.scn [data-sk="gather"]');
    const water=p.locator('.scn [data-a="hookWater"]');
    const pull=p.locator('.hook-pull');
    const list=p.locator('.shore-alist');
    for(let n=0;n<3;n++){
      await p.waitForFunction(()=>!onCd('gather'));
      await gather.click();
    }
    await water.waitFor();
    A(await p.evaluate(()=>s.hookWater.pending.kind==='plank'&&s.c.gather===28),'перший плавучий предмет після трьох справжніх зборів');
    const unobstructed=await water.evaluate(e=>{
      const r=e.getBoundingClientRect(), hit=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2);
      return !!hit&&e.contains(hit);
    });
    A(unobstructed&&await p.evaluate(()=>document.documentElement.scrollWidth<=390),'предмет на високій воді доступний без горизонтальної прокрутки');
    await water.focus();await p.keyboard.press('Enter');
    A(await pull.locator('.hook-tool').evaluate(e=>getComputedStyle(e).animationName)==='hook-tool','окрема анімація підтягування з клавіатури');
    await p.click('#tabs [data-i="home"]');
    A(await p.evaluate(()=>!s.hookWater.pending&&s.hookWater.pulls===1&&JSON.parse(localStorage.getItem(KEY)).hookWater.pulls===1)
      &&!await pull.count(),'вихід під час анімації зберігає результат');
    await p.click('#tabs [data-i="shore"]');
    await p.evaluate(()=>{Math.random=()=>.3;s.hookWater.wait=0});
    await water.waitFor();
    await list.locator('summary').click();
    await list.locator('[data-a="hookWater"]').click();
    A(await p.evaluate(()=>s.hookWater.pulls===2&&!s.hookWater.pending),'список дій користується тим самим підтягуванням');
    await p.evaluate(()=>{s.hookWater.wait=0;s.dbgTide='low';render()});
    await water.waitFor();
    await water.evaluate(el=>el.scrollIntoView({block:'center'}));
    const lowHit=await water.evaluate(e=>{
      const r=e.getBoundingClientRect();
      return e.contains(document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2));
    });
    A(lowHit&&await p.locator('.scn [data-a="pool"]').count()===1,'на відпливі ящик і калюжі доступні окремо');
    A(await p.evaluate(()=>!rcVisible(RC.find(rc=>rc.id==='hookUp'))),'креслення приховано до спроби');
    await water.click();
    A(await pull.locator('.hook-tool').evaluate(e=>getComputedStyle(e).animationName)==='hook-bend'
      &&await pull.locator('.hook-grit').count()===1&&!await pull.locator('.hook-cargo').count(),
      'простий багор прогинається у піску, вантаж лишається на місці');
    await p.locator('#dlg h2',{hasText:'Жердина прогинається'}).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    await p.reload();
    await water.waitFor();
    A(await p.evaluate(()=>s.f.hookLimitSeen&&s.hookWater.pending.id===3&&!s.f.hookUp),'той самий ящик після завантаження');
    const baseHookArt=await p.locator('.scn [data-sk="hook"] .obi').getAttribute('src');
    await p.evaluate(()=>{
      s.floors.work=1;s.tabs.work=1;s.tab='tower';ttGo('work');
      s.lastAct=Date.now();s.lastNov=null;novPlanTick(false);render();save();
    });
    await p.locator('#dlg h2',{hasText:'Новий рецепт: Посилений багор'}).waitFor();
    await p.click('#dlg [data-a="dlggo"]');
    const plan=p.locator('.scn [data-k="wk:r:hookUp"]');
    await plan.click();
    await p.locator('.bpop [data-a="craft"][data-i="hookUp"]').click();
    await p.locator('#dlg h2',{hasText:'Посилений багор'}).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    await p.click('#tabs [data-i="shore"]');
    A(baseHookArt!==await p.locator('.scn [data-sk="hook"] .obi').getAttribute('src'),'посилена версія має інший вигляд');
    await p.emulateMedia({reducedMotion:'reduce'});
    await water.click();
    A(await pull.locator('.hook-tool').evaluate(e=>getComputedStyle(e).animationName)==='none'
      &&await p.evaluate(()=>s.hookWater.pulls===3&&!s.hookWater.pending),'статична реакція й завершення з reduced motion');
    A(await p.evaluate(()=>document.documentElement.scrollWidth<=390),'берег і майстерня вміщуються на телефоні');
    await p.close();
  }

  // Граблі: сухий і вологий пісок, хвилі, винагорода та доступність.
  {
    const p=await page(390,844);
    await p.evaluate(()=>{
      s.tabs.shore=1;s.tab='shore';s.f.looked=1;s.f.wreck=1;s.f.hook=1;s.f.rod=1;s.f.crab1=1;
      s.f.tideSeen=1;s.f.fordSeen=1;s.f.rats=1;s.f.horpyna=1;s.f.dryRack=1;s.f.boat=1;
      s.hookWater.pending={id:3,kind:'heavy',reward:{wood:4,scrap:3}};
      s.shf='tracks';s.r.fish=6;s.c.gather=25;s.tutPending=[];s.dlg=[];s.lastAct=Date.now();
      s.dbgTide='high';s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));
      Math.random=()=>0;giveI('rake');render();
    });
    const stage=p.locator('.scn.sh');
    const spot=stage.locator('[data-a="rakeSand"]');
    const list=p.locator('.shore-alist');
    const sweep=stage.locator('.rake-sweep');
    const unobstructed=async()=>{
      await spot.scrollIntoViewIfNeeded();
      return spot.evaluate(e=>{
        const r=e.getBoundingClientRect(),hit=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2);
        const overlaps=[...e.closest('.scn').querySelectorAll('button[data-a]')].some(b=>{
          if(b===e)return false;
          const q=b.getBoundingClientRect();
          return Math.min(r.right,q.right)-Math.max(r.left,q.left)>1&&Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top)>1;
        });
        return e.contains(hit)&&!overlaps&&document.documentElement.scrollWidth<=390;
      });
    };
    A(!await spot.count(),'без трьох ручних дій ділянка не показується');
    await stage.locator('[data-a="gather"]').click();
    await stage.locator('[data-a="scrapw"]').click();
    await stage.locator('[data-a="fishing"]').click();
    await spot.waitFor();
    await p.evaluate(()=>{s.shf='rats';render()});
    A(!await stage.locator('[data-k="shf:rats"]').count(),'стара берегова точка пацюків прихована');
    A(await spot.getAttribute('aria-label')==='Оглянути сухий пісок'&&await unobstructed(),'суха ділянка на високій воді має власну зону');
    await spot.focus();await p.keyboard.press('Enter');
    A(await sweep.locator('.rake-tool').evaluate(e=>getComputedStyle(e).animationName)==='rake-tool'
      &&await sweep.locator('.rake-reward').evaluate(e=>getComputedStyle(e).animationName)==='rake-reward','рух граблів і поява металу зі сцени клавіатурою');
    await p.click('#tabs [data-i="home"]');
    A(!await sweep.count()&&await p.evaluate(()=>JSON.parse(localStorage.getItem(KEY)).rakeSand.searched===1),'вихід під час анімації зберігає нагороду');

    await p.click('#tabs [data-i="shore"]');
    await p.evaluate(()=>{s.dbgTide='low';s.rakeSand.wait=0});
    await spot.waitFor();
    A(await spot.getAttribute('aria-label')==='Оглянути вологий пісок'&&await unobstructed(),'волога ділянка окремо від рун, броду, багра, калюж, сушарні й бою');
    const record=await p.evaluate(()=>JSON.stringify(s.rakeSand.wet));
    await list.locator('summary').click();
    const listSpot=list.locator('[data-a="rakeSand"]');
    A(await listSpot.isVisible(),'та сама волога ділянка є в списку');
    await p.evaluate(()=>{s.dbgTide='high';save()});
    await spot.waitFor({state:'detached'});
    A(!await listSpot.count(),'приплив прибирає дію і зі списку');
    await p.reload();
    A(await p.evaluate(saved=>JSON.stringify(s.rakeSand.wet)===saved,record)&&!await spot.count(),'волога ділянка чекає після reload');
    await p.evaluate(()=>{s.dbgTide='low';});
    await spot.waitFor();
    await p.emulateMedia({reducedMotion:'reduce'});
    if(!await list.evaluate(el=>el.open))await list.locator('summary').click();
    await listSpot.click();
    A(await sweep.locator('.rake-reward').evaluate(e=>getComputedStyle(e).animationName==='none'&&getComputedStyle(e).opacity==='1'),
      'у reduced motion дію зі списку видно статично');
    A(await p.evaluate(()=>s.rakeSand.searched===2&&s.hookWater.pending?.kind==='heavy'&&document.documentElement.scrollWidth<=390),
      'пошук не забирає вантаж багра та не розширює сторінку');
    await p.close();
  }

  // Обидві ділянки, рух вантажу та решта берегових точок на 390 px.
  {
    const p=await page(390,844);
    await p.evaluate(()=>{
      Math.random=()=>.99;
      s.tab='shore';s.tabs.shore=1;
      Object.assign(s.f,{looked:1,tideSeen:1,crab1:1,rod:1,rodUp:1,fordSeen:1,wreck:1,hook:1,rats:1,dryRack:1,boat:1,deckSeen:1});
      s.b.hearth=1;s.c.gather=24;s.r.wood=25;s.r.fish=5;
      s.ship={until:Date.now()+180000,offers:[],done:[]};
      giveI('rake');
      Object.assign(s.rakeSand,{lastId:5,searched:3,actions:3,dry:{id:5,kind:'dry',reward:{wood:3}},
        wet:{id:4,kind:'wet',odd:'seaglass',reward:{scrap:2}},wetDeferred:true});
      s.hookWater.pending={id:1,kind:'plank',reward:{wood:4}};
      s.shf='tracks';s.shfCyc=null;
      s.bts=Object.fromEntries(CH.flatMap(ch=>ch.beats.map(beat=>[beat[0],1])));s.chs=CH.map(ch=>ch.id);s.tabs.chron=1;
      s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));s.rcSeen=Object.fromEntries(RC.map(rc=>[rc.id,1]));
      s.dlg=[];s.tutPending=[];s.lastNov=s.play;s.lastAct=Date.now();s.tutSeen.tide=1;
      window.setSea=t=>{s.tideEpoch=Date.now()-t*1000};setSea(120);
      render();
    });
    const stage=p.locator('.scn.sh'),hook=stage.locator('[data-a="hookWater"]'),entry=stage.locator('[data-a="zoneEnter"][data-i="deck"]');
    const dry=stage.locator('[data-k="sand:5"]'),wet=stage.locator('[data-k="sand:4"]');
    const list=p.locator('.shore-alist');
    await list.locator('summary').click();
    const changes=[];
    for(const [phase,time] of [['high',120],['ebb',580],['low',620],['flood',880]]){
      await p.evaluate(t=>setSea(t),time);
      await stage.and(p.locator(`[data-tide="${phase}"]`)).waitFor();
      await hook.evaluate(e=>Promise.all(e.getAnimations().filter(a=>a.transitionProperty==='top').map(a=>a.finished.catch(()=>{}))));
      const layout=await stage.evaluate(e=>{
        const all=[...e.querySelectorAll('button[data-a]')],focusedX=e.parentElement.scrollLeft;
        const ok=all.every(b=>{
          b.scrollIntoView({block:'nearest',inline:'center'});
          const r=b.getBoundingClientRect(),ownsCenter=b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
          if(!['rakeSand','hookWater','mussels','zoneEnter'].includes(b.dataset.a))return ownsCenter;
          return ownsCenter&&all.every(other=>{
            if(other===b)return true;
            const q=other.getBoundingClientRect();
            return Math.min(r.right,q.right)-Math.max(r.left,q.left)<=1||Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top)<=1;
          });
        });
        e.parentElement.scrollLeft=focusedX;
        return ok;
      });
      A(layout&&await entry.count()===1&&await dry.count()===1&&await wet.count()===Number(phase==='low'),'окремі зони дій усіма фазами · '+phase);
      changes.push(await hook.evaluate(e=>[parseFloat(e.style.top),e.querySelector('.obi').src,e.dataset.i]));
      if(phase==='high')await hook.evaluate(e=>{window.firstHook=e;e.focus({preventScroll:true})});
      if(phase==='low'){
        A(await hook.evaluate(e=>e===firstHook&&e===document.activeElement&&getComputedStyle(e.querySelector('.obi')).animationName==='none'),
          'той самий сфокусований вантаж уже не гойдається на відпливі');
        A(await stage.locator('button[data-a="mussels"],button[data-a="pool"],button[data-a="rune"],button[data-a="fishing"],button[data-a="shfgo"],button[data-k="sh:ford"]').count()>=7,
          'мідії, калюжі, руни, дві вудки, сюжет і брід лишаються у сцені');
      }
    }
    await p.evaluate(()=>{setSea(620);s.shf='poolcrab';s.shfCyc=0});
    await stage.locator('[data-k="shf:poolcrab"]').waitFor();
    A(await stage.locator('[data-a="pool"]').evaluate(e=>{
      e.scrollIntoView({block:'nearest',inline:'center'});
      const r=e.getBoundingClientRect(),crab=e.parentElement.querySelector('[data-k="shf:poolcrab"]').getBoundingClientRect();
      return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))&&r.bottom<=crab.top;
    }),'калюжа та краби мають окремі точки на відпливі');
    A(await stage.evaluate(e=>{
      s.f.horpyna=1;s.f.reunion=1;s.ship={until:Date.now()+180000,offers:[],done:[]};
      return ['tracks','seal','sealgift','myronvisit'].every(id=>{
        s.f.seal=id==='sealgift';s.sealCyc=-1;s.shf=id;s.shfCyc=SHF[id].lowWater?0:null;
        render();
        if(!e.querySelector('[data-k="shf:'+id+'"]'))return false;
        return [...e.querySelectorAll('button[data-a]')].every(b=>{
          b.scrollIntoView({block:'nearest',inline:'center'});
          const r=b.getBoundingClientRect();
          return b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
        });
      });
    }),'сліди, тюлень і Мирон мають власні точки поруч із рештою дій');
    A(changes.every(v=>v[2]==='1')&&changes[0][0]>changes[1][0]&&changes[1][0]>changes[2][0]&&changes[3][0]>changes[2][0]
      &&changes[0][1]!==changes[2][1],'той самий ID рухається і змінює спрайт за водою');
    await p.emulateMedia({reducedMotion:'reduce'});
    await p.evaluate(()=>setSea(620));await wet.waitFor();
    await entry.scrollIntoViewIfNeeded();await entry.click();
    const deck=p.locator('#stage [data-scn="zone-deck"]');
    const back=deck.locator('[data-a="zoneBack"]');
    await deck.waitFor();
    A(await back.evaluate(e=>e===document.activeElement)&&await stage.count()===0,'палуба приймає фокус і ховає берегові дії');
    const planks=deck.locator('[data-a="zoneAct"][data-i="deck:planks"]');
    await planks.focus();await p.keyboard.press('Enter');
    await p.evaluate(()=>{setSea(120);save()});
    await p.reload();await deck.waitFor();
    A(await p.evaluate(()=>s.localProgress.deck.planks&&s.rakeSand.dry?.id===5&&s.rakeSand.wet?.id===4&&s.hookWater.pending?.id===1),
      'reload на палубі лишає огляд і незавершені берегові об’єкти');
    await back.focus();await p.keyboard.press('Enter');await entry.waitFor();
    A(await entry.evaluate(e=>e===document.activeElement)&&!await wet.count()&&!await stage.locator('[data-a="mussels"]').count()
      &&await hook.count()===1,'вихід повертає фокус і враховує теперішній приплив');
    await p.evaluate(()=>{s.tideEpoch=Date.now()-620000});await wet.waitFor();
    A(await stage.locator('[data-a="mussels"]').count()===1&&await stage.locator('[data-a="fishing"]').count()===2,
      'на відпливі мідії та обидві вудки доступні після повернення');
    if(!await list.evaluate(e=>e.open))await list.locator('summary').click();
    await dry.focus();await p.keyboard.press('Enter');
    const wood=stage.locator('[data-sk="sand-sweep:5"] .rake-reward');
    A(await wood.evaluate(e=>e.getAttribute('src')===icoURL('wood')&&getComputedStyle(e).animationName==='none')
      &&await wet.evaluate(e=>e===document.activeElement),'плавник має власний спрайт, фокус переходить до другої ділянки');
    await list.locator('[data-a="rakeSand"][data-i="4"]').click();
    const glass=stage.locator('[data-sk="sand-sweep:4"] .rake-reward');
    A(await glass.evaluate(e=>e.getAttribute('src')===icoURL(ODI.seaglass))&&await p.evaluate(()=>s.odd.seaglass&&s.oddNew===1&&!s.dlg.length)
      &&await list.locator('summary').evaluate(e=>e===document.activeElement),'знахідка зі списку потрапляє на полицю, зберігає фокус і власний спрайт');
    A(await p.evaluate(()=>document.documentElement.scrollWidth<=390),'одночасні точки й список не розширюють сторінку');
    await p.close();
  }

  // Вудка з котушкою, обидва місця та шлях особливого улову до кухні.
  {
    const p=await page(390,844);
    await p.evaluate(()=>{
      Math.random=()=>.99; // Без випадкової берегової події в момент появи кіл.
      s.tabs.shore=1;s.tabs.tower=1;s.tab='shore';s.f.looked=1;s.f.rod=1;s.f.crab1=1;s.f.tideSeen=1;s.f.fishBiteSeen=1;
      s.f.fishBiteResolved=1;s.tutSeen.fishBite=1;s.f.wreck=1;s.f.hook=1;s.f.fordSeen=1;s.f.boat=1;s.f.dryRack=1;s.r.fish=8;
      s.dbgTide='low';s.c.fish=10;s.r.wood=70;s.r.scrap=30;s.lastAct=Date.now();s.dlg=[];s.tutPending=[];
      s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));
      s.rcSeen=Object.fromEntries(RC.filter(rc=>rc.id!=='rodUp').map(rc=>[rc.id,1]));
      s.hookWater.pending={id:3,kind:'heavy',reward:{wood:4,scrap:3}};
      giveI('rake');s.rakeSand.lastId=1;s.rakeSand.wet={id:1,kind:'wet',reward:{scrap:2}};
      render();
    });
    const stage=p.locator('.scn.sh');
    const ripple=stage.locator('[data-a="rodReach"]');
    const deep=stage.locator('[data-k="rod:deep"]');
    const coast=stage.locator('[data-k="rod"]');
    await ripple.waitFor();
    A(!await deep.count()&&!await p.evaluate(()=>rcVisible(RC.find(rc=>rc.id==='rodUp'))),'за мілиною видно лише кола, креслення ще приховане');
    const oldArt=await coast.locator('.obi').getAttribute('src');
    await ripple.click();
    await p.locator('#dlg h2',{hasText:'Кола за мілиною'}).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    await p.evaluate(()=>{
      s.floors.work=1;s.tabs.work=1;s.tab='tower';ttGo('work');
      s.lastAct=Date.now();s.lastNov=null;novPlanTick(false);render();
    });
    await p.locator('#dlg h2',{hasText:'Новий рецепт: Вудка з котушкою'}).waitFor();
    await p.click('#dlg [data-a="dlggo"]');
    await p.locator('#main [data-a="craft"][data-i="rodUp"]').click();
    await p.click('#dlg [data-a="dlgok"]');
    await p.click('#tabs [data-i="shore"]');
    A(await coast.locator('.obi').getAttribute('src')!==oldArt,'котушку видно на спрайті вудки');
    await deep.scrollIntoViewIfNeeded();
    A(await deep.evaluate(e=>{
      const r=e.getBoundingClientRect();
      return e.contains(document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2))
        &&![...e.closest('.scn').querySelectorAll('button[data-a]')].some(b=>{
          if(b===e)return false;
          const q=b.getBoundingClientRect();
          return Math.min(r.right,q.right)-Math.max(r.left,q.left)>1&&Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top)>1;
        });
    }),'глибша вода має власну зону дії поруч з іншими об’єктами');
    await p.evaluate(()=>{s.fishSpecies.deep={casts:15,offered:false};Math.random=()=>.9});
    await deep.focus();await p.keyboard.press('Enter');
    const marker=p.locator('.scn [data-k="sh:bite"]');
    A(await p.evaluate(()=>s.bite?.place==='deep'&&s.bite.species==='cod'&&onCd('fishing')),'глибша вода з клавіатури, спільне відновлення');
    await p.reload();
    await p.emulateMedia({reducedMotion:'reduce'});
    A(await marker.locator('.bob').evaluate(e=>getComputedStyle(e).animationName)==='none','поплавець глибшої води в reduced motion');
    await marker.click();
    await p.click('#popl [data-a="bigfish"]');
    await p.waitForFunction(()=>!onCd('fishing'));
    await p.evaluate(()=>{s.fishSpecies.shore={casts:15,offered:false};Math.random=()=>.9});
    const list=p.locator('.shore-alist');
    if(!await list.evaluate(e=>e.open))await list.locator('summary').click();
    await list.getByRole('button',{name:'Прибережна вода',exact:true}).click();
    await list.locator('[data-a="bigfish"]').click();
    A(await p.evaluate(()=>has('flounder')&&has('cod')&&!s.belt.includes('flounder')&&!s.belt.includes('cod')),
      'обидва інгредієнти в торбі й поза поясом');
    await p.evaluate(()=>{
      s.f.zinovii=1;s.tabs.kitchen=1;s.tab='tower';ttGo('kitchen');s.r.wood=10;
      s.rcp={ash:1,soup:1};s.r.prov=capOf('prov')-2;render();
    });
    await p.click('#main [data-a="fishRecipe"][data-i="bakedflounder"]');
    await p.locator('#dlg h2',{hasText:'Запечена камбала'}).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    await p.click('#main [data-a="fishRecipe"][data-i="smokedcod"]');
    await p.locator('#dlg h2',{hasText:'Копчена тріска'}).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    await p.click('.scn [data-k="kt:pot"]');
    const cod=p.locator('#popl [data-a="cookp"][data-i="smokedcod"]');
    A(await cod.isDisabled(),'рецепт тріски чекає на місце в коморі');
    await p.evaluate(()=>{s.r.prov--;refresh()});
    await cod.click();
    await p.click('#popl [data-a="cookp"][data-i="bakedflounder"]');
    A(await p.evaluate(()=>!has('flounder')&&!has('cod')&&s.r.prov===capOf('prov')&&beltHas('bakedflounder')),'кухня готує обидва рецепти, готова камбала доступна на поясі');
    await p.evaluate(()=>{s.tabs.hero=1;s.h.bg='old';s.tab='hero';s.nv.bag=1;s.ht='gear';s.h.hp=2;render()});
    A(await p.locator('#main [data-a="beltRem"][data-i="bakedflounder"]').isVisible(),'готова камбала відображається на поясі');
    await p.click('#main [data-a="ht"][data-i="bag"]');
    await p.click('#main [data-a="use"][data-i="bakedflounder"]');
    A(await p.evaluate(()=>!has('bakedflounder')&&s.h.hp>=22&&document.documentElement.scrollWidth<=390),'торба, лікування та мобільна ширина');
    await p.close();
  }

  // Пояснення першого відпливу чекає берега, відлік — завершення уроку.
  {
    const p=await page(390,844);
    await p.evaluate(()=>{
      Math.random=()=>.99;
      s.f.looked=1;s.f.rod=1;s.c.fish=3;s.tabs.shore=1;s.tabs.chron=1;s.tab='home';
      s.tideEpoch=Date.now()-600_000;s.lastAct=Date.now();s.lastNov=null;s.dlg=[];s.tutPending=[];
      s.bts=Object.fromEntries(CH.flatMap(ch=>ch.beats.map(beat=>[beat[0],1])));s.chs=CH.map(ch=>ch.id);
      s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));s.rcSeen=Object.fromEntries(RC.map(rc=>[rc.id,1]));
      tideFirst();render();
    });
    A(!await p.evaluate(()=>s.f.tideSeen),'перше пояснення не відкривається на домашній вкладці');
    await p.click('#tabs [data-i="shore"]');
    await p.locator('#dlg h2',{hasText:/^Відплив$/}).waitFor();
    await p.evaluate(()=>{s.tideEpoch-=2*TIDE*1000;save()});
    await p.reload();
    A(await p.evaluate(()=>s.f.tideIntro&&tideLow()),'перше доступне вікно переживає reload до читання');
    await p.click('#dlg [data-a="dlgok"]');
    await p.locator('#dlg .k-tutorial h2',{hasText:'Приплив і відплив'}).waitFor();
    await p.click('#dlg [data-a="dlgok"]');
    await p.waitForFunction(()=>!s.f.tideIntro);
    A(await p.evaluate(()=>tideLow()&&tideLeft()>255&&tideCyc()===0),'на огляд берега є повне перше вікно після уроку');
    await p.close();
  }

  // Без дій гравця фаза оновлює берег, список і відкриті картки.
  {
    const p=await page(390,844);
    await p.evaluate(()=>{
      Math.random=()=>.99;
      window.setSea=seconds=>{s.tideEpoch=Date.now()-seconds*1000;s.lastAct=Date.now()};
      s.tab='shore';s.tabs.shore=1;s.tabs.map=1;
      Object.assign(s.f,{looked:1,tideSeen:1,fordSeen:1,wreck:1,crab1:1,rats:1,tracks:1,hook:1,rod:1,rodUp:1});
      s.r.wood=100;s.r.fish=10;s.bts=Object.fromEntries(CH.flatMap(ch=>ch.beats.map(beat=>[beat[0],1])));
      s.chs=CH.map(ch=>ch.id);s.lastNov=s.play;s.dlg=[];s.tutPending=[];
      s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));s.rcSeen=Object.fromEntries(RC.map(rc=>[rc.id,1]));
      s.hookWater.pending={id:3,kind:'heavy',reward:{wood:4,scrap:3}};
      giveI('rake');s.rakeSand.lastId=1;s.rakeSand.wet={id:1,kind:'wet',reward:{scrap:2}};
      s.bite={kind:'fish',place:'deep',amount:2};s.f.fishBiteSeen=1;s.tutSeen.fishBite=1;
      s.tutSeen.tide=1;setSea(120);render();
    });
    const stage=p.locator('.scn.sh'),list=p.locator('.shore-alist'),status=p.locator('.tide-status');
    const gather=stage.locator('[data-k="gather"]'),pool=stage.locator('[data-a="pool"]');
    const wet=stage.locator('[data-a="rakeSand"]'),rune=stage.locator('[data-k="rune:b"]');
    const ford=p.locator('#popl [role="dialog"][aria-label="Брід"]'),part=ford.locator('[data-a="ford"]');
    const tide=async(seconds,phase)=>{
      await p.evaluate(seconds=>setSea(seconds),seconds);
      await stage.and(p.locator(`[data-tide="${phase}"]`)).waitFor();
    };
    await list.locator('summary').click();
    await gather.evaluate(el=>{
      window.tideGather=el;setCd('gather',1);el.focus({preventScroll:true});
      window.tideLog=el.querySelector('.dlw');
      window.tideAnim=tideLog.animate([{opacity:1},{opacity:.9}],{duration:6000});
    });
    const art=new Set([await stage.locator('.scbg img.scene').getAttribute('data-fr')]);
    A((await status.innerText()).includes('Повна вода')&&!await pool.count()&&!await wet.count(),'на високій воді видно стан, мокрі дії приховані');
    await tide(580,'ebb');
    art.add(await stage.locator('.scbg img.scene').getAttribute('data-fr'));
    A((await status.innerText()).includes('Вода відступає')&&!await pool.count()&&await p.evaluate(()=>
      document.activeElement===tideGather&&tideGather.isConnected&&tideLog.getAnimations().includes(tideAnim)),
      'при відступанні збережено фокус і поточну анімацію плавника');
    const clock=await status.locator('.tide-clock').innerText();
    await p.waitForFunction(before=>document.querySelector('.tide-clock').innerText!==before,clock);
    A(await p.evaluate(()=>document.activeElement===tideGather&&tideGather.isConnected),'відлік не створює повторно кнопку');
    await tide(620,'low');
    art.add(await stage.locator('.scbg img.scene').getAttribute('data-fr'));
    A((await status.innerText()).includes('Відплив')&&await wet.count()===1&&await pool.count()===1&&await rune.count()===1
      &&await list.locator('[data-a="pool"]').isVisible()&&await list.locator('[data-a="rune"][data-i="b"]').isVisible(),
      'низька вода одночасно відкриває калюжі, руни й вологий пісок у сцені та списку');
    A(await pool.evaluate(e=>{
      e.scrollIntoView({block:'center'});
      const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
    }),'калюжа має власну доступну точку після появи');
    await list.locator('[data-a="pool"]').focus();await p.keyboard.press('Enter');
    A(await p.evaluate(()=>s.c.pool===1&&onCd('pool')),'дія зі списку доступна з клавіатури й має штатну шкалу');
    const sec=await p.evaluate(()=>s.cd.pool);
    await list.locator('[data-i="sh:ford"]').click();
    await part.focus();
    A(!await part.isDisabled(),'брід відкритий під час відпливу');
    await p.evaluate(()=>{setSea(880);document.querySelector('#popl [data-a="ford"]').click()});
    await stage.and(p.locator('[data-tide="flood"]')).waitFor();
    art.add(await stage.locator('.scbg img.scene').getAttribute('data-fr'));
    A(art.size===4&&(await status.innerText()).includes('Вода повертається')&&!await wet.count()&&!await pool.count()&&!await rune.count()
      &&!await list.locator('[data-a="pool"]').count()&&!await list.locator('[data-a="rakeSand"]').count(),
      'чотири фони і синхронне закриття берегових дій');
    A(await part.isDisabled()&&(await ford.innerText()).includes('Камінь зараз під водою')
      &&await p.evaluate(sec=>!s.ford?.poles&&s.cd.pool===sec&&s.rakeSand.wet.id===1,sec),
      'відкрита картка змінюється, стара кнопка не витрачає ресурс, cooldown і ділянка збережені');
    A(await ford.locator('.bpx').evaluate(e=>e===document.activeElement),'фокус переходить до закриття картки, коли її дія стає недоступною');
    await p.emulateMedia({reducedMotion:'reduce'});
    await tide(620,'low');
    A(!await part.isDisabled()&&await wet.isVisible()&&await stage.locator('[data-k="sh:bite"]').count()===1
      &&await stage.locator('[data-a="hookWater"]').count()===1&&!await stage.locator('.scbg .xf').count()
      &&await p.evaluate(()=>document.documentElement.scrollWidth<=390),'статичний режим повертає взаємодії й зберігає незалежний улов і вантаж');

    await p.evaluate(()=>{s.disc.fort=1;s.disc.bay=1;s.f.reefmap=1;s.f.boat=1;s.r.prov=50;render()});
    await p.click('#tabs [data-i="map"]');
    const mapList=p.locator('#main .ledg');if(!await mapList.evaluate(e=>e.open))await mapList.locator('summary').click();
    await p.locator('.scn [data-k="mp:fort"]').click();
    const go=p.locator('#popl [data-a="go"][data-i="fort"]'),goList=mapList.locator('[data-a="go"][data-i="fort"]');
    A(!await go.isDisabled()&&!await goList.isDisabled(),'карта і список дозволяють пройти рифи на відпливі');
    await p.evaluate(()=>setSea(100));await p.waitForFunction(()=>document.querySelector('#popl [data-i="fort"]')?.disabled);
    A(await goList.isDisabled()&&(await p.locator('#popl').innerText()).includes('Прохід між рифами'),'карта і відкрита картка закривають прохід на повній воді');
    await p.evaluate(()=>{s.at='bay';popB='';s.h.a.str=5;render()});
    await p.locator('.scn [data-k="lc:chest"]').click();
    const chest=p.locator('#popl [data-i="bay.chest.pull"]');
    A(await chest.isDisabled(),'затока використовує той самий календар');
    await p.evaluate(()=>setSea(620));await p.waitForFunction(()=>!document.querySelector('#popl [data-i="bay.chest.pull"]')?.disabled);
    A(await chest.isVisible()&&!await chest.isDisabled(),'скриня стає доступною у вже відкритій картці');
    await p.close();
  }

  // Окрема дія на камені та у списку, зі збереженим номером відпливу.
  {
    const p=await page(390,844);
    await p.evaluate(()=>{
      Math.random=()=>.99;
      s.tabs.shore=1;s.tab='shore';
      Object.assign(s.f,{looked:1,tideSeen:1,crab1:1,rod:1,rodUp:1,fordSeen:1,wreck:1,hook:1,rats:1,dryRack:1,boat:1});
      s.tutSeen.fishBite=1;s.f.fishBiteSeen=1;
      s.hookWater.pending={id:3,kind:'heavy',reward:{wood:4,scrap:3}};
      s.bite={kind:'species',species:'cod',place:'deep'};
      giveI('rake');s.rakeSand.lastId=1;s.rakeSand.wet={id:1,kind:'wet',reward:{scrap:2}};
      s.bts=Object.fromEntries(CH.flatMap(ch=>ch.beats.map(beat=>[beat[0],1])));s.chs=CH.map(ch=>ch.id);s.tabs.chron=1;
      s.bdSeen=Object.fromEntries(BD.map(b=>[b.id,1]));s.rcSeen=Object.fromEntries(RC.map(rc=>[rc.id,1]));
      s.lastNov=s.play;s.dlg=[];s.tutPending=[];s.tideEpoch=Date.now()-120000;s.lastAct=Date.now();render();
    });
    const scene=p.locator('.scn.sh'),stone=scene.locator('[data-a="mussels"]');
    const fx=scene.locator('.mussel-pick'),list=p.locator('.shore-alist'),listPick=list.locator('[data-a="mussels"]');
    A(!await stone.count()&&!await listPick.count(),'мідії приховані на високій воді');
    await p.evaluate(()=>{s.tideEpoch=Date.now()-620000;s.shf='poolcrab';s.shfCyc=0});
    await stone.waitFor();
    const separate=()=>stone.evaluate(e=>{
      e.scrollIntoView({block:'center'});
      const r=e.getBoundingClientRect();
      const overlap=[...e.closest('.scn').querySelectorAll('button[data-a]')].some(other=>{
        if(e===other)return false;
        const q=other.getBoundingClientRect();
        return Math.min(r.right,q.right)-Math.max(r.left,q.left)>1&&Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top)>1;
      });
      return !overlap&&e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
    });
    A(await separate(),'камінь окремо від калюж, крабів, уламків, руни, броду, вудок, багра й мокрого піску');
    await p.evaluate(()=>{s.shf='tracks';s.shfCyc=null;s.flot={k:'survivor',until:Date.now()+20000};render()});
    A(await separate(),'камінь окремо від слідів і сюжетного прибою');
    await p.evaluate(()=>{s.shf='poolcrab';s.shfCyc=0;s.flot=null;render()});
    await stone.focus();await p.keyboard.press('Enter');
    A(await fx.locator('.mussel-hand').evaluate(e=>getComputedStyle(e).animationName)==='mussel-reach',
      'збір зі сцени клавіатурою запускає анімацію руки');
    A(await scene.locator('[data-k="gather"]').evaluate(e=>e===document.activeElement),'фокус лишається у сцені після збирання');
    const lesson=p.locator('#dlg .k-tutorial h2',{hasText:'Мідії на камені'});
    await lesson.waitFor();await p.click('#dlg [data-a="dlgok"]');
    await p.evaluate(()=>{s.tideEpoch=Date.now()-120000;s.h.hp=8;save()});
    await p.reload();
    if(!await list.evaluate(e=>e.open))await list.locator('summary').click();
    await list.locator('[data-a="use"][data-i="mussel"]').click();
    A(await p.evaluate(()=>s.h.hp>=14&&s.h.hp<15&&!has('mussel')&&s.f.musselGathered),'мідії з торби можна з’їсти зі списку після припливу й reload');
    const atLow=cycle=>p.evaluate(cycle=>{s.tideEpoch=Date.now()-(620+cycle*TIDE)*1000;s.lastAct=Date.now()},cycle);
    await atLow(0);await scene.and(p.locator('[data-tide="low"]')).waitFor();
    A(!await listPick.count()&&!await stone.count(),'спожиту порцію не відновлює той самий ID циклу');
    await p.emulateMedia({reducedMotion:'reduce'});
    await atLow(2);
    await listPick.and(p.locator('[data-i="2"]')).waitFor();await listPick.click();
    A(await fx.locator('.mussel-lift').evaluate(e=>getComputedStyle(e).animationName==='none'&&getComputedStyle(e).opacity==='1'),
      'збір зі списку дає статичну реакцію у reduced motion');
    await atLow(3);
    await stone.and(p.locator('[data-i="3"]')).click();
    A(await p.evaluate(()=>s.inv.mussel===2&&s.bite.species==='cod'&&s.hookWater.pending.id===3&&s.rakeSand.wet.id===1&&document.documentElement.scrollWidth<=390),
      'накопичення, відсутність горизонтального скролу та три незалежні взаємодії');
    await p.evaluate(()=>{s.tabs.hero=1;s.h.bg='old';s.tab='hero';s.nv.bag=1;s.ht='bag';render()});
    A(await p.locator('#main [data-a="use"][data-i="mussel"]').isVisible(),'інгредієнт відображається у чинній торбі');
    await p.evaluate(()=>{s.h.hp=5;startFight('crab1','crab1');window.apBefore=s.cb.ap;render()});
    await p.locator('#main [data-a="c_item"][data-i="mussel"]').click();
    A(await p.evaluate(()=>s.h.hp===11&&s.cb.ap===apBefore-1&&s.inv.mussel===1),'у бою мідії відновлюють 6 HP за 1 ОД з пояса');
    await p.close();
  }

  // Після першої поразки можна зловити їжу й повернутися за власним рішенням.
  {
    const p=await page(390,844);
    await p.emulateMedia({reducedMotion:'reduce'});
    await p.evaluate(()=>{
      Math.random=()=>.99;s.tabs.shore=1;s.tabs.chron=1;s.tab='shore';s.f.looked=1;s.f.rod=1;s.dbgTide='high';
      s.h.hp=1;s.c.fish=4;s.tutSeen.rod=1;s.lastNov=s.play;s.dlg=[];s.tutPending=[];
      s.bts=Object.fromEntries(CH.flatMap(ch=>ch.beats.map(beat=>[beat[0],1])));s.chs=CH.map(ch=>ch.id);render();
    });
    const fishing=p.locator('#stage [data-a="fishing"]');
    const recovery=p.locator('.shore-recovery'),retry=recovery.locator('[data-a="crabRetry"]');
    await fishing.click();
    await p.locator('#dlg [data-a="crabPrepare"]').click();
    await recovery.locator('[data-a="eat"]').focus();await p.keyboard.press('Enter');
    A(await p.evaluate(()=>s.h.hp===5&&!s.tabs.hero&&!s.r.fish),'їжа доступна до вкладки героя');
    await retry.click();await p.locator('#dlg [data-a="tutFight"]').click();await p.locator('#dlg [data-a="fightGo"]').click();
    await p.evaluate(()=>{s.cb.poison=5;for(let i=0;i<8&&s.cb;i++){act('c_end');if(s.cb)s.cb.eAnim=0}render()});
    await p.locator('#dlg h2',{hasText:'Поразка'}).waitFor();await p.locator('#dlg [data-a="dlgok"]').click();
    while(await p.locator('#dlg [data-a="dlgok"]').isVisible())await p.locator('#dlg [data-a="dlgok"]').click();
    await p.waitForFunction(()=>tutKnown('hero'));
    if(await p.locator('#dlg .k-tutorial [data-a="dlgok"]').isVisible())await p.locator('#dlg .k-tutorial [data-a="dlgok"]').click();
    A(await p.evaluate(()=>s.h.hp===8&&!s.r.fish&&!s.r.prov&&!s.dlg.some(d=>d.crabw)),'після поразки немає повторного примусового виклику');
    await p.waitForFunction(()=>!onCd('fishing'));
    await fishing.click();
    const meal=recovery.locator('[data-a="eatfull"]');
    A((await meal.innerText()).includes('риба ×1'),'до натискання видно витрати їжі');
    await meal.click();
    A(await p.evaluate(()=>s.h.hp===12&&!s.cb&&!s.r.fish&&document.documentElement.scrollWidth<=390),'звичайний улов лікує після поразки за високої води');
    await retry.focus();await p.keyboard.press('Enter');
    A(await p.evaluate(()=>s.cb?.win==='crab1'),'добровільне повернення до бою з клавіатури');
    await p.close();
  }

  // Юшка з мідіями та одночасна бойова підготовка у чинній торбі.
  {
    const p=await page(390,844);
    await p.evaluate(()=>{
      Math.random=()=>.99;s.tabs.tower=1;s.tabs.kitchen=1;s.tab='tower';ttGo('kitchen');
      s.f.musselGathered=1;s.f.zinovii=1;s.r.fish=2;s.r.wood=1;giveI('mussel');
      s.bts=Object.fromEntries(CH.flatMap(ch=>ch.beats.map(beat=>[beat[0],1])));s.chs=CH.map(ch=>ch.id);s.tabs.chron=1;
      s.lastNov=s.play;s.dlg=[];s.tutPending=[];render();
    });
    await p.click('#main [data-a="fishRecipe"][data-i="musselsoup"]');
    await p.locator('#dlg h2',{hasText:'Юшка з мідіями'}).waitFor();
    A(await p.locator('#dlg .dlgface img').count()===1&&await p.evaluate(()=>has('mussel')),'власний спрайт рецепта й розмова без оплати');
    await p.click('#dlg [data-a="dlgok"]');
    await p.click('.scn [data-k="kt:pot"]');
    A((await p.locator('#popl .bpop').innerText()).includes('26 здоров’я за 180 с поза боєм'),'у картці видно бюджет і час');
    await p.click('#popl [data-a="cookp"][data-i="musselsoup"]');
    await p.evaluate(()=>{s.tabs.hero=1;s.h.bg='old';s.tab='hero';s.nv.bag=1;s.ht='bag';s.h.hp=10;popB='';render()});
    await p.click('#main [data-a="use"][data-i="musselsoup"]');
    await p.waitForFunction(()=>activeRegen()?.left<180);
    A((await p.locator('#top .food-effect').innerText()).includes('HP')&&await p.evaluate(()=>!beltHas('musselsoup')&&!has('mussel')),
      'у торбі можна випити юшку, активний відлік видно у верхній панелі');
    await p.evaluate(()=>{s.h.hp=maxHP();giveI('dried');render()});
    await p.locator('#main [data-a="use"][data-i="dried"]').focus();await p.keyboard.press('Enter');
    A((await p.locator('#top .food-effect').innerText()).includes('Ситість')&&await p.evaluate(()=>!!activeRegen()&&s.h.buf.full===1),
      'бойовий бонус застосовується при повному HP поряд із регенерацією');
    await p.evaluate(()=>{startFight('rats','test');render()});
    A((await p.locator('#top .food-effect').innerText()).includes('пауза в бою')&&await p.evaluate(()=>document.documentElement.scrollWidth<=390),
      'у бою видно паузу ефекту без горизонтальної прокрутки');
    await p.close();
  }

  // 4. Жарина й місце для вогнища — різні об'єкти з різними діями
  {
    const p = await page(1100, 900);
    const r = await p.evaluate(() => {
      s.f.looked = 1; s.b.hearth = 0; s.seen.wood = 1; s.r.wood = 500; s.r.ember = 500; s.tabs = { home: 1 }; s.dlg = []; s.tab = 'home'; render();
      const e = document.querySelector('.scn [data-k="ember2"]'), h = document.querySelector('.scn [data-k="hearth0"]');
      return [e && e.dataset.a, h && h.dataset.a, e && h && e.style.left !== h.style.left];
    });
    A(r[0] === 'blow' && r[1] === 'bld' && r[2], 'жарина й вогнище: ' + JSON.stringify(r));
    await p.close();
  }

  // 5. Маяк у розрізі: картка поверху відновлює його
  {
    const p = await page(1100, 1000);
    await p.evaluate(() => { window.dlg = () => {}; s.f.looked = 1; s.f.crab1=1; s.b.hearth = 2; for (const k of RES) s.r[k] = 5000; s.tabs = { home: 1, tower: 1 }; s.dlg = []; s.tab = 'tower'; render(); });
    await p.waitForTimeout(300);
    const el = await p.$('.scn [data-k="fl:work"]'), bb = el && await el.boundingBox();
    if (bb) { await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(300); }
    const btn = await p.$('#popl [data-a="floor"][data-i="work"]');
    A(!!btn, 'картка майстерні з кнопкою «Відновити»');
    if (btn) { await btn.click(); await p.waitForTimeout(200); }
    A(await p.evaluate(() => !!s.floors.work), 'майстерню відновлено з картки');
    await p.close();
  }

  // 6. Майстерня й кабінет: речі в кімнаті відкривають картки з діями
  {
    const p = await page(1100, 1000);
    await p.evaluate(() => { window.dlg = () => {}; storyCheck = () => {}; s.f.looked = 1; s.b.hearth = 3; s.floors = { work: 1, gallery: 1, study: 1 }; for (const k of RES) s.r[k] = 5000; s.tabs = { home: 1, tower: 1, work: 1, study: 1 }; s.dlg = []; s.tab = 'work'; s.lastAct=Date.now(); s.lastNov=null; novPlanTick(true); s.dlg=[]; render(); });
    await p.waitForTimeout(300);
    const n = await p.$('.scn [data-k^="wk:r:"]');
    A(!!n, 'креслення на дошці в майстерні');
    if (n) { await n.click(); await p.waitForTimeout(300); A(!!await p.$('#popl [data-a="craft"]'), 'картка креслення з кнопкою «Зробити»'); }
    await p.evaluate(() => { popB = ''; s.tabs.study = 1; s.tab = 'study'; render(); });
    await p.waitForTimeout(300);
    const d = await p.$('.scn [data-k="st:desk"]');
    if (d) { await d.click(); await p.waitForTimeout(300); }
    A(!!await p.$('#popl .bpop'), 'картка столу в кабінеті');
    await p.close();
  }

  // 7. Мапа: позначка місця відкриває картку з «Вирушити»; дерево знань у кабінеті
  {
    const p = await page(1100, 1000);
    await p.evaluate(() => { window.dlg = () => {}; storyCheck = () => {}; s.f.looked = 1; s.b.hearth = 3; s.disc = { cape: 1, cave: 1 }; s.tabs = { home: 1, map: 1, tower: 1, study: 1 }; s.floors = { work: 1, gallery: 1, study: 1 }; s.dlg = []; s.tab = 'map'; render(); });
    await p.waitForTimeout(300);
    const m = await p.$('.scn [data-k="mp:cape"]');
    if (m) { await m.click(); await p.waitForTimeout(300); }
    A(!!await p.$('#popl [data-a="go"][data-i="cape"]'), 'картка місця на мапі');
    await p.evaluate(() => { popB = ''; s.tabs.study = 1; s.tab = 'study'; render(); });
    await p.waitForTimeout(300);
    const tr = await p.$('.scn [data-k="st:tree"]');
    if (tr) { await tr.click(); await p.waitForTimeout(300); }
    A((await p.$$('#popl .tn2')).length > 0, 'дерево знань з вузлами');
    await p.close();
  }

  // 8. Герой: слот на ляльці відкриває картку
  {
    const p = await page(1100, 1000);
    await p.evaluate(() => { window.dlg = () => {}; storyCheck = () => {}; s.f.looked = 1; s.h.bg = Object.keys(BGS)[0]; giveI('oar'); giveI('knife'); s.tabs = { home: 1, hero: 1 }; s.dlg = []; s.tab = 'hero'; render(); s.dlg = []; render(); });
    await p.waitForTimeout(300);
    const sl = await p.$('.scn [data-k="hr:s:weapon"]');
    if (sl) { await sl.click(); await p.waitForTimeout(300); }
    A(!!await p.$('#popl [data-a="equip"]'), 'картка зброї на ляльці');
    await p.close();
  }

  // 9. Громади й крамниця: прохання на дошці й ваги на прилавку
  {
    const p = await page(1100, 1000);
    await p.evaluate(() => { window.dlg = () => {}; storyCheck = () => {}; s.f.looked = 1; s.met.hanna = 1; s.req = { rot: { n: 'Трави', give: { herb: 1 }, rew: { coin: 5 } } }; s.tabs = { home: 1, folk: 1, trade: 1 }; s.dlg = []; s.tab = 'folk'; render(); });
    await p.waitForTimeout(300);
    const q = await p.$('.scn [data-k="fk:q:rot"]');
    if (q) { await q.click(); await p.waitForTimeout(300); }
    A(!!await p.$('#popl [data-a="freq"]'), 'прохання на дошці');
    await p.evaluate(() => { popB = ''; s.tab = 'trade'; render(); });
    await p.waitForTimeout(300);
    const sc = await p.$('.scn [data-k="tr:sell"]');
    if (sc) { await sc.click(); await p.waitForTimeout(300); }
    A(!!await p.$('#popl .bpop'), 'ваги для продажу');
    await p.close();
  }

  // 11. Місце на мапі: ліхтар чи дошка відкриває картку з діями; загадку читаємо з поля в картці
  {
    const p = await page(1100, 1000);
    await p.evaluate(() => { window.dlg = () => {}; storyCheck = () => {}; s.f.looked = 1; s.met.levko = 1; s.disc.village = 1; s.tabs = { home: 1, map: 1 }; s.dlg = []; s.tab = 'map'; s.at = 'village'; render(); });
    await p.waitForTimeout(300);
    const t = await p.$('.scn [data-k="lc:tavern"]');
    A(!!t, 'дошка корчми в сцені Причалу');
    if (t) { await t.click(); await p.waitForTimeout(300); }
    A(!!await p.$('#popl [data-a="la"]'), 'картка місця з діями');
    const inp = await p.$('#popl input[data-rid]');
    if (inp) {
      const rid = await inp.getAttribute('data-rid');
      await inp.fill('камінь'); await p.click('#popl [data-a="riddle"]'); await p.waitForTimeout(200);
      A(await p.evaluate(r => !!(s.wrong[r] || s.done[r]), rid), 'відповідь на загадку з картки прочитано');
    }
    const lv = await p.$('.scn [data-k="lc:leave"]');
    if (lv) { await lv.click(); await p.waitForTimeout(200); }
    A(await p.evaluate(() => !s.at), 'човен чи вказівник веде назад');
    await p.close();
  }

  // 12. Ліхтарня: дзеркало в картці поверху повертається
  {
    const p = await page(1100, 1000);
    await p.evaluate(() => { window.dlg = () => {}; storyCheck = () => {}; s.f.looked = 1; s.b.hearth = 3; s.floors = { work: 1, gallery: 1, study: 1, lantern: 1 }; s.tabs = { home: 1, tower: 1 }; s.dlg = []; s.tab = 'tower'; render(); });
    await p.waitForTimeout(300);
    const el = await p.$('.scn [data-k="fl:lantern"]');
    if (el) { await el.click(); await p.waitForTimeout(300); }
    const m = await p.$('#popl .lmir');
    A(!!m, 'дзеркала в картці ліхтарні');
    if (m) { const id = await m.getAttribute('data-i'), d0 = await p.evaluate(i => s.mirrors[i], id); await m.click(); await p.waitForTimeout(200); A(await p.evaluate(([i, d]) => s.mirrors[i] !== d, [id, d0]), 'дзеркало повернулося'); }
    await p.close();
  }

  // 10. Дзвіночок
  {
    const p = await page(390, 844);
    const r = await p.evaluate(() => {
      s.f.looked = 1; s.dlg = []; s.lastAct = Date.now() - 300000;
      dlg({ k: 'info', title: 'А', body: '' }); dlg({ k: 'info', title: 'Б', body: '' }); render();
      return [s.bellHold, document.getElementById('bell').innerText.trim(), !!document.querySelector('#dlg .dlgbox')];
    });
    A(r[0] === 1 && r[1] === '2' && !r[2], 'дзвіночок: ' + JSON.stringify(r));
    await p.close();
  }

  // 13. Бій: арена — одна картинка-сцена, клітинки прозорі, хід натисканням, без горизонтальної прокрутки
  for (const w of [390, 900]) {
    const p = await page(w, 844);
    const r = await p.evaluate(() => {
      s.f.looked = 1; s.dlg = []; s.tabs.hero = 1; s.h.on = 1; s.eq.weapon = 'oar'; startFight('hold', 'x'); s.cb.intro = 0; render();
      const bg = document.querySelector('.arf .arbg'), x0 = s.cb.hx, y0 = s.cb.hy;
      act('c_cell', (x0 + 1) + ',' + y0); render();
      return [!!(bg && bg.src.startsWith('data:image')), !document.querySelector('.pad'), s.cb.hx === x0 + 1, document.documentElement.scrollWidth - innerWidth];
    });
    A(r[0] && r[1] && r[2] && r[3] <= 0, 'арена бою ' + w + ': ' + JSON.stringify(r));
    await p.close();
  }

  // 14. Хід ворогів: ходьба клітинка за клітинкою; смертельний удар спершу видно, поразка — після анімації
  {
    const p = await page(390, 844);
    const r0 = await p.evaluate(() => {
      s.f.looked = 1; s.dlg = []; s.tabs.hero = 1; s.f.crab1 = 1; s.eq.weapon = 'oar'; startFight('rats', 'S:rats'); s.cb.intro = 0;
      s.cb.u.forEach((u, i) => { u.x = 3; u.y = 2 + i }); s.h.hp = 1; render();
      const mv = []; const fxP0 = fxP; fxP = (e, a) => { if (e.t === 'mv') mv.push((e.p || []).length); fxP0(e, a) };
      act('c_end'); render(); fxP = fxP0;
      return [s.cb && s.cb.over, !!document.querySelector('.cbover'), mv.every(n => n >= 2)];
    });
    A(r0[0] === 'lose' && r0[1] && r0[2], 'поразка чекає на анімацію: ' + JSON.stringify(r0));
    await p.waitForTimeout(7500);
    const r1 = await p.evaluate(() => [!!s.cb, (s.dlg || []).some(d => d.title === 'Поразка')]);
    A(!r1[0] && r1[1], 'після анімації — вікно поразки: ' + JSON.stringify(r1));
    await p.close();
  }

  for (const e of errs) A(0, 'помилка в консолі: ' + e);
  await b.close();
  console.log('fails', fails);
  process.exit(fails ? 1 : 0);
})().catch(e => {
  const target=e.message.split('\n').find(line=>line.includes('waiting for locator'));
  const at=e.stack?.split('\n').find(line=>line.includes('browser.js:'));
  console.log('FAIL',e.message.split('\n')[0],at?.trim()||'',target?.trim()||'');
  console.log('fails',1);
  process.exit(1);
});
