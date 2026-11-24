/* Спойлери (#39): у вкладках не мають з'являтися назви місць, людей і громад, яких гравець ще не знає
   і про які йому ще ніхто не розповів. Ганяє симулятор живого гравця перші 4 години й дивиться на показаний текст. */
const {spawnSync}=require('child_process'),path=require('path');
const r=spawnSync('node',[path.join(__dirname,'..','sim','pace.js'),'active','240'],{env:Object.assign({},process.env,{SIMSPOIL:'1'}),encoding:'utf8',timeout:300000});
const L=(r.stdout||'').split('\n').filter(l=>l.startsWith('SPOIL '));let fails=0;
for(const l of L){fails++;console.log('FAIL',l)}
if(!/Профіль:/.test(r.stdout||'')){fails++;console.log('FAIL симулятор не дійшов до звіту',(r.stderr||'').slice(0,400))}
console.log('fails',fails);
