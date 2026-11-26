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
    const lowHit=await water.evaluate(e=>{
      const r=e.getBoundingClientRect();
      return e.contains(document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2));
    });
    A(lowHit&&await p.locator('.scn [data-a="pool"]').count()===1,'на відпливі ящик і калюжі доступні окремо');
    A(await p.evaluate(()=>!rcVisible(RC.find(rc=>rc.id==='hookUp'))),'креслення приховано до спроби');
    await water.click();
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
