/* ПЕРИМЕТР — Система состояния игрока */
var PERIMETR_STATE_KEY = 'perimetr_state';

function perimetr_getState() {
  try {
    return Object.assign(
      { paranoia: 0, choices: {}, silenceCount: 0, visited: [] },
      JSON.parse(localStorage.getItem(PERIMETR_STATE_KEY) || '{}')
    );
  } catch(e) {
    return { paranoia: 0, choices: {}, silenceCount: 0, visited: [] };
  }
}

function perimetr_saveState(s) {
  localStorage.setItem(PERIMETR_STATE_KEY, JSON.stringify(s));
}

/* Первое посещение сцены — добавить паранойю один раз */
function perimetr_visitScene(sceneId, paranoiaDelta) {
  var s = perimetr_getState();
  if (!s.visited) s.visited = [];
  if (s.visited.indexOf(sceneId) === -1) {
    s.visited.push(sceneId);
    s.paranoia = Math.max(0, Math.min(100, (s.paranoia || 0) + paranoiaDelta));
    perimetr_saveState(s);
    /* Скрытое достижение: паранойя > 50 */
    if (s.paranoia > 50) {
      setTimeout(function(){ perimetr_unlockAndNotify('paranoid_mind'); }, 1000);
    }
  }
  return (perimetr_getState()).paranoia;
}

/* Сохранить выбор — эффект бабочки */
function perimetr_recordChoice(scene, choice) {
  var s = perimetr_getState();
  if (!s.choices) s.choices = {};
  s.choices[scene] = choice;
  if (choice === 'D') {
    s.silenceCount = (s.silenceCount || 0) + 1;
    /* Скрытое достижение: молчание трижды */
    if (s.silenceCount >= 3) {
      setTimeout(function(){ perimetr_unlockAndNotify('silence_x3'); }, 1200);
    }
  }
  perimetr_saveState(s);
  return s;
}

/* Сброс при новой игре */
function perimetr_resetState() {
  perimetr_saveState({ paranoia: 0, choices: {}, silenceCount: 0, visited: [] });
}

/* Обновить HUD паранойи на текущей странице */
function perimetr_updateParanoiaHUD(paranoia) {
  var fill = document.getElementById('par-fill');
  var hud  = document.getElementById('paranoia-hud');
  if (!fill || !hud) return;
  setTimeout(function(){
    fill.style.width = paranoia + '%';
    if (paranoia > 0) {
      hud.classList.add('visible');
    }
    if (paranoia >= 60) {
      hud.classList.add('danger');
    }
  }, 600);
}
