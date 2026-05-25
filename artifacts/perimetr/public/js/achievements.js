/* ПЕРИМЕТР — Система достижений */
var ACHIEVEMENTS_DEF = [
  {
    id: 'first_step',
    name: 'Первый шаг',
    desc: 'Вы вошли в коридор бункера',
    icon: '▶',
    rarity: 'common',
    chapter: 'Глава I'
  },
  {
    id: 'sector_7',
    name: 'Сектор 7',
    desc: 'Вы достигли кабинета командования',
    icon: '⬡',
    rarity: 'common',
    chapter: 'Глава I'
  },
  {
    id: 'chapter_1',
    name: 'Периметр держится',
    desc: 'Первая глава пройдена',
    icon: '◆',
    rarity: 'uncommon',
    chapter: 'Глава I'
  },
  {
    id: 'silent_officer',
    name: 'Дисциплина',
    desc: 'Приняли приказ без лишних вопросов',
    icon: '✦',
    rarity: 'uncommon',
    chapter: 'Глава I'
  },
  {
    id: 'skeptic',
    name: 'Сомнение',
    desc: 'Усомнились в версии генерала',
    icon: '◎',
    rarity: 'uncommon',
    chapter: 'Глава I'
  },
  {
    id: 'detective',
    name: 'Детектив',
    desc: 'Запросили личное дело Климова',
    icon: '◈',
    rarity: 'rare',
    chapter: 'Глава I'
  }
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

/* Уведомление о разблокировке */
function perimetr_showAchievementNotif(id) {
  var def = ACHIEVEMENTS_DEF.filter(function(a){return a.id===id;})[0];
  if (!def) return;

  /* Создаём элемент если не существует */
  var el = document.getElementById('ach-notif');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ach-notif';
    el.style.cssText = [
      'position:fixed','top:-100px','left:50%','transform:translateX(-50%)',
      'z-index:9999','display:flex','align-items:center','gap:12px',
      'background:rgba(6,2,2,0.97)','border:1px solid rgba(192,0,10,0.6)',
      'padding:12px 18px','max-width:340px','width:90%',
      'box-shadow:0 4px 30px rgba(192,0,10,0.3)',
      'transition:top 0.5s cubic-bezier(0.2,0,0.2,1)',
      'font-family:Oswald,sans-serif'
    ].join(';');
    document.body.appendChild(el);
  }

  var rarityColor = def.rarity==='rare' ? 'rgba(255,180,50,0.9)' :
                    def.rarity==='uncommon' ? 'rgba(192,0,10,0.9)' : 'rgba(160,130,110,0.8)';

  el.innerHTML =
    '<div style="width:38px;height:38px;border-radius:4px;background:rgba(192,0,10,0.15);' +
    'border:1px solid rgba(192,0,10,0.45);display:flex;align-items:center;justify-content:center;' +
    'font-size:18px;color:'+rarityColor+';flex-shrink:0;">' + def.icon + '</div>' +
    '<div style="flex:1;min-width:0;">' +
    '<div style="font-size:7px;letter-spacing:4px;color:rgba(192,0,10,0.7);text-transform:uppercase;margin-bottom:3px;">Достижение разблокировано</div>' +
    '<div style="font-family:Russo One,sans-serif;font-size:13px;letter-spacing:2px;color:#fff;">' + def.name + '</div>' +
    '<div style="font-size:10px;letter-spacing:1px;color:rgba(160,130,110,0.7);margin-top:2px;">' + def.desc + '</div>' +
    '</div>';

  /* Анимация появления */
  requestAnimationFrame(function(){
    el.style.top = '16px';
    setTimeout(function(){ el.style.top = '-100px'; }, 3500);
  });
}

/* Разблокировать и показать уведомление */
function perimetr_unlockAndNotify(id) {
  if (perimetr_unlock(id)) {
    setTimeout(function(){ perimetr_showAchievementNotif(id); }, 600);
  }
}
