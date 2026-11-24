/* Усі перевірки однією командою:  node tests/run.js
   Збирає гру, проганяє логічні тести (без браузера) і браузерні.
   Логічні тести — tests/logic/*.js; кожен друкує «FAIL …» і підсумок «fails N».
   Випадковість у логічних тестах фіксована (SEED=1); інше зерно: SEED=5 node tests/run.js
   node tests/run.js --sim — темп гри очима живого гравця (хвилини до кожного відкриття). */
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const only = process.argv.includes('--logic') ? 'logic' : process.argv.includes('--browser') ? 'browser' : '';

execFileSync('python3', [path.join(root, 'build.py')], { stdio: 'inherit' });
/* --sim: темп гри очима живого гравця (tests/sim/pace.js), активний і неквапливий профілі */
if (process.argv.includes('--sim')) {
  for (const [pr, lim] of [['active', 600], ['casual', 900]]) { console.log('\n===== ' + pr + ' ====='); spawnSync('node', [path.join(__dirname, 'sim', 'pace.js'), pr, String(lim)], { stdio: 'inherit', timeout: 900000 }); }
  process.exit(0);
}
const files = [];
if (only !== 'browser') for (const f of fs.readdirSync(path.join(__dirname, 'logic')).sort()) if (f.endsWith('.js')) files.push(path.join('logic', f));
if (only !== 'logic') files.push('browser.js');

let total = 0;
for (const f of files) {
  const t0 = Date.now();
  const r = spawnSync('node', [path.join(__dirname, f)], { encoding: 'utf8', timeout: 600000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const m = out.match(/fails (\d+)/g);
  const n = m ? +m[m.length - 1].split(' ')[1] : 1;
  const bad = out.split('\n').filter(l => /^FAIL|Error/.test(l));
  total += n || (r.status ? 1 : 0);
  console.log(`${n || r.status ? '✗' : '✓'} ${f.padEnd(26)} ${((Date.now() - t0) / 1000).toFixed(1)} с`);
  for (const l of bad.slice(0, 10)) console.log('    ' + l.slice(0, 200));
  if (!m) console.log(out.slice(-1500));
}
console.log(total ? `\nПроблем: ${total}` : '\nУсе гаразд.');
process.exit(total ? 1 : 0);
