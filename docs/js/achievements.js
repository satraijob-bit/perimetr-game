/* ПЕРИМЕТР — Система достижений */
var ACHIEVEMENTS_DEF = [
  /* ── Видимые ── */
  { id:'first_step',    name:'Первый шаг',           desc:'Вы вошли в коридор бункера',               icon:'▶', rarity:'common',   chapter:'Глава I', hidden:false },
  { id:'sector_7',      name:'Сектор 7',              desc:'Вы достигли кабинета командования',         icon:'⬡', rarity:'common',   chapter:'Глава I', hidden:false },
  { id:'chapter_1',     name:'Периметр держится',     desc:'Первая глава пройдена',                     icon:'◆', rarity:'uncommon', chapter:'Глава I', hidden:false },
  { id:'silent_officer',name:'Дисциплина',            desc:'Приняли приказ без лишних вопросов',        icon:'✦', rarity:'uncommon', chapter:'Глава I', hidden:false },
  { id:'skeptic',       name:'Сомнение',              desc:'Усомнились в версии генерала',              icon:'◎', rarity:'uncommon', chapter:'Глава I', hidden:false },
  { id:'detective',     name:'Детектив',              desc:'Запросили личное дело Климова',             icon:'◈', rarity:'rare',     chapter:'Глава I', hidden:false },
  /* ── Скрытые ── */
  { id:'silence_s3',    name:'Молчание — ответ',      desc:'Промолчали перед генералом Морозовым',     icon:'◌', rarity:'uncommon', chapter:'Глава I', hidden:true },
  { id:'time_out',      name:'Время истекло',         desc:'Позволили таймеру решить за вас',           icon:'⧖', rarity:'uncommon', chapter:'Глава I', hidden:true },
  { id:'inscription_b7',name:'КЛ-07 ЖИВ?',           desc:'Нашли надпись в Коридоре Б-7',              icon:'◉', rarity:'rare',     chapter:'Глава I', hidden:true },
  { id:'paranoid_mind', name:'Паранойя',              desc:'Уровень паранойи превысил 50 единиц',       icon:'◫', rarity:'rare',     chapter:'Глава I', hidden:true },
  { id:'silence_x3',    name:'Обет молчания',         desc:'Промолчали трижды подряд',                  icon:'◯', rarity:'rare',     chapter:'Глава I', hidden:true },
  /* ── Глава I · Сцена 4+ ── */
  { id:'observer',      name:'Наблюдательный',        desc:'Нашли схему вентиляции в комнате Климова',  icon:'◐', rarity:'uncommon', chapter:'Глава I', hidden:false }
];

function perimetr_getUnlocked() {
  try { return JSON.parse(localStorage.getItem('perimetr_achievements') || '[]'); }
  catch(e) { return []; }
}

function perimetr_isUnlocked(id) {
  return perimetr_getUnlocked().indexOf(id) !== -1;
}

function perimetr_unlock(id) {
  if (perimetr_isUnlocked(id)) return false;
  var list = perimetr_getUnlocked();
  list.push(id);
  localStorage.setItem('perimetr_achievements', JSON.stringify(list));
  return true;
}

function perimetr_showAchievementNotif(id) {
  var def = ACHIEVEMENTS_DEF.filter(function(a){ return a.id === id; })[0];
  if (!def) return;

  var el = document.getElementById('ach-notif');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ach-notif';
    el.style.cssText = [
      'position:fixed','top:-120px','left:50%','transform:translateX(-50%)',
      'z-index:9999','display:flex','align-items:center','gap:12px',
      'background:rgba(6,2,2,0.97)','border:1px solid rgba(192,0,10,0.6)',
      'padding:12px 18px','max-width:340px','width:90%',
      'box-shadow:0 4px 30px rgba(192,0,10,0.3)',
      'transition:top 0.5s cubic-bezier(0.2,0,0.2,1)',
      'font-family:Oswald,sans-serif'
    ].join(';');
    document.body.appendChild(el);
  }

  var isRare = def.rarity === 'rare';
  var rarityColor = isRare ? 'rgba(255,180,50,0.9)' :
                    def.rarity === 'uncommon' ? 'rgba(192,0,10,0.9)' : 'rgba(160,130,110,0.8)';
  var borderColor = isRare ? 'rgba(220,170,30,0.5)' : 'rgba(192,0,10,0.4)';

  el.innerHTML =
    '<div style="width:38px;height:38px;border-radius:4px;background:rgba(192,0,10,0.12);' +
    'border:1px solid ' + borderColor + ';display:flex;align-items:center;justify-content:center;' +
    'font-size:18px;color:' + rarityColor + ';flex-shrink:0;">' + def.icon + '</div>' +
    '<div style="flex:1;min-width:0;">' +
    '<div style="font-size:7px;letter-spacing:4px;color:rgba(192,0,10,0.7);text-transform:uppercase;margin-bottom:3px;">' +
    (def.hidden ? 'Секретное достижение' : 'Достижение разблокировано') + '</div>' +
    '<div style="font-family:Russo One,sans-serif;font-size:13px;letter-spacing:2px;color:#fff;">' + def.name + '</div>' +
    '<div style="font-size:10px;letter-spacing:1px;color:rgba(160,130,110,0.7);margin-top:2px;">' + def.desc + '</div>' +
    '</div>';

  requestAnimationFrame(function(){
    el.style.top = '16px';
    setTimeout(function(){ el.style.top = '-120px'; }, 3800);
  });
}

function perimetr_unlockAndNotify(id) {
  if (perimetr_unlock(id)) {
    setTimeout(function(){ perimetr_showAchievementNotif(id); }, 600);
  }
}
