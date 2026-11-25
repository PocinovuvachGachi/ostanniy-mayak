/* Перевірка в справжньому браузері (Playwright + Chromium):
   - сторінка вантажиться без помилок у консолі;
   - на ширині 390 px немає горизонтальної прокрутки на жодній вкладці;
   - клік по березі не перезапускає анімацій сусідніх об'єктів;
   - рибалку можна виграти простим «гравцем»;
   - події, що прийшли без гравця, ховаються в дзвіночок. */
const path = require('path');
const { chromium } = require('playwright');
const URL = 'file://' + path.join(__dirname, '..', 'docs', 'index.html');
let fails = 0;
const A = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } };
const isNoise = t => /ERR_TUNNEL|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|fonts\.g/.test(t);

(async () => {
  const b = await chromium.launch();
  const errs = [];
  const page = async (w, h) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !isNoise(m.text())) errs.push(m.text()); });
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
      window.dlg = () => {}; s.f.looked = 1; s.tabs = { home: 1, shore: 1 }; s.tab = 'shore'; s.f.wreck = 1; s.f.rod = 1;
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

  // 3. Рибалка: простий гравець тримає стрілку в зеленій зоні
  {
    const p = await page(390, 844);
    const won = await p.evaluate(() => new Promise(res => {
      s.f.looked = 1; s.tabs = { home: 1, shore: 1 }; s.dlg = []; render();
      const n0 = s.r.fish; mgFish();
      const n = document.querySelector('.mgneedle'), fs = document.querySelector('.mgfish');
      let held = 0;
      const iv = setInterval(() => {
        if (!MG || MG.done) { clearInterval(iv); setTimeout(() => res(s.r.fish - n0 >= 5), 1000); return; }
        const x = parseFloat(n.style.left) || 0, want = !fs.classList.contains('tug') && x < 52;
        if (want && !held) { MG.o.down(); held = 1; } else if (!want && held) { MG.o.up(); held = 0; }
      }, 30);
    }));
    A(won, 'рибалку не вдалося виграти');
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
    await p.evaluate(() => { window.dlg = () => {}; s.f.looked = 1; s.b.hearth = 2; for (const k of RES) s.r[k] = 5000; s.tabs = { home: 1, tower: 1 }; s.dlg = []; s.tab = 'tower'; render(); });
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
})().catch(e => { console.log('FAIL', e.message); console.log('fails', 1); process.exit(1); });
