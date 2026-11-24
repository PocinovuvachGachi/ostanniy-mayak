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
    for (const t of tabs) {
      await p.evaluate(t => { s.dlg = []; s.tab = t; render(); }, t);
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
    await p.evaluate(() => { window.dlg = () => {}; storyCheck = () => {}; s.f.looked = 1; s.b.hearth = 3; s.floors = { work: 1, gallery: 1, study: 1 }; for (const k of RES) s.r[k] = 5000; s.tabs = { home: 1, tower: 1, work: 1, study: 1 }; s.dlg = []; s.tab = 'work'; render(); });
    await p.waitForTimeout(300);
    const n = await p.$('.scn [data-k^="wk:r:"]');
    A(!!n, 'креслення на дошці в майстерні');
    if (n) { await n.click(); await p.waitForTimeout(300); A(!!await p.$('#popl [data-a="craft"]'), 'картка креслення з кнопкою «Зробити»'); }
    await p.evaluate(() => { popB = ''; s.tab = 'study'; render(); });
    await p.waitForTimeout(300);
    const d = await p.$('.scn [data-k="st:desk"]');
    if (d) { await d.click(); await p.waitForTimeout(300); }
    A(!!await p.$('#popl .bpop'), 'картка столу в кабінеті');
    await p.close();
  }

  // 7. Мапа: позначка місця відкриває картку з «Вирушити»; дерево знань у кабінеті
  {
    const p = await page(1100, 1000);
    await p.evaluate(() => { window.dlg = () => {}; storyCheck = () => {}; s.f.looked = 1; s.b.hearth = 3; s.disc = { cape: 1, cave: 1 }; s.tabs = { home: 1, map: 1, study: 1 }; s.floors = { work: 1, gallery: 1, study: 1 }; s.dlg = []; s.tab = 'map'; render(); });
    await p.waitForTimeout(300);
    const m = await p.$('.scn [data-k="mp:cape"]');
    if (m) { await m.click(); await p.waitForTimeout(300); }
    A(!!await p.$('#popl [data-a="go"][data-i="cape"]'), 'картка місця на мапі');
    await p.evaluate(() => { popB = ''; s.tab = 'study'; render(); });
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

  // 9. Дзвіночок
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

  for (const e of errs) A(0, 'помилка в консолі: ' + e);
  await b.close();
  console.log('fails', fails);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.log('FAIL', e.message); console.log('fails', 1); process.exit(1); });
