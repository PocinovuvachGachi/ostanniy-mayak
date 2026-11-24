/* ============ v15: RELICS, PLANS, INFO ============ */
const ih=x=>`<span class="ih" tabindex="0" role="note" aria-label="Пояснення" ${TA(x)}>i</span>`;
function costChips(c={},it={}){const o=[];for(const k in c){const no=(s.r[k]||0)<c[k];o.push(`<span class="cc${no?' no':''}" ${TA(`<b>${RN[k]}</b>: треба ${fmt(c[k])}, є ${fmt(s.r[k]||0)}`)}>${pimg(icoURL(k),16,16,'ri')}<b>${fmt(c[k])}</b></span>`)}
  for(const k in it){const kn=KN(k),no=(s.inv[k]||0)<it[k];o.push(`<span class="cc${no?' no':''}" ${TA(kn?`<b>${IT[k].n}</b>`:'Щось, чого ти поки не знаєш')}>${kn?pimg(icoURL(k),16,16,'ri'):'?'}${kn?`<span class="cci">${it[k]>1?it[k]+' × ':''}${IT[k].n.toLowerCase()}</span>`:''}</span>`)}
  return o.join('')}
function relicFor(enc,quiet){const r=RELE[enc];if(!r)return;s.rel=s.rel||{};if(s.rel[r])return;s.rel[r]=1;const[w,ti]=RELW[r];if(wF(w)>ti)return;giveI(r);if(quiet)return;
  dlg({k:'find',title:`Знахідка: ${IT[r].n}`,img:{t:'icon',id:r},body:`<p>${IT[r].d}</p><p class="hand">${relHint(r)}</p>`})}
const BIC={pot:'scrap',boom:'wood',traps:'fish',smoke:'food',forge:'iron',kiln:'tar',render:'oil',winch:'scrap',shelves:'lore',dummy:'a_guard',house:'a_end',garden:'herb',apoth:'med',coalpit:'coal',steel:'steel',sandpit:'sand',glass:'gls',shipyard:'wood'};
const BSRC={pot:'Хвилі виносять на берег уламки. Якщо поставити в прибої пастку, вони самі заноситимуть у неї цвяхи й скоби.',
  boom:'Течія проносить плавник повз берег, далі, ніж дістане багор. Загорожа з кілків його затримає.',
  traps:'Тепер ти знаєш, як сплести ятері. Риба сама в них запливатиме.',
  smoke:'Є вудка — буде й риба. А щоб риба не зіпсувалася, її треба закоптити.',
  forge:'Біля майстерні знайшлося місце для горна. Там можна кувати залізо.',
  kiln:'З оглядової видно сосни на скелях. Із живиці виходить смола.',
  render:'Ти знаєш, як топити жир. Для цього потрібна окрема піч.',
  winch:'Лебідкою можна витягати з уламків важкий метал, який руками не зрушиш.',
  shelves:'Книжок більшає. Їм потрібні полиці, а записам — лад.',
  dummy:'Прийоми краще перевірити на опудалі, ніж на живому ворогові.',
  house:'До маяка приходять люди. Їм треба десь жити.',
  garden:'Олеся знає трави. Їм потрібні грядки.',apoth:'Олесі треба місце, де варити ліки.',
  coalpit:'Устина вміє випалити вугілля з будь-якого плавника.',steel:'Кіндрат знає, як зварити сталь.',
  sandpit:'Для скла потрібен чистий пісок. Северин знає, де копати.',glass:'Северин колись робив скло для лінз маяка. Він може робити його знову.',
  shipyard:'Захар будував кораблі для половини шхер. Йому потрібна верф.'};
function bpDlg(L){dlg({k:'plan',title:L.length>1?'Нові креслення':`Креслення: ${L[0].n}`,
  body:L.map(b=>`<div class="bp"><div class="bp-i">${pimg(icoURL(BIC[b.id]||'crate'),64,64,'')}</div><div class="bp-t"><span class="bpn">${b.n}</span><p>${BSRC[b.id]||''}</p><span class="ccs" ${TA(typeof b.d==='function'?b.d():b.d||'')}>${costChips(bCost(b))}</span></div></div>`).join(''),
  btns:[['До вогнища','dlggo','home'],['Згорнути','dlgok']]})}

