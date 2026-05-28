/* ПЕРИМЕТР — Система состояния игрока */
var PERIMETR_STATE_KEY = 'perimetr_state';

function perimetr_getState() {
  try {
    return Object.assign(
      { paranoia: 0, choices: {}, silenceCount: 0, visited: [], clues: [], trust_general: 0 },
      JSON.parse(localStorage.getItem(PERIMETR_STATE_KEY) || '{}')
    );
  } catch(e) {
    return { paranoia: 0, choices: {}, silenceCount: 0, visited: [], clues: [], trust_general: 0 };
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
    if (s.paranoia > 50) {
      setTimeout(function(){ perimetr_unlockAndNotify('paranoid_mind'); }, 1000);
    }
  }
  return perimetr_getState().paranoia;
}

/* Добавить паранойю напрямую (от выбора) */
function perimetr_addParanoia(delta) {
  var s = perimetr_getState();
  s.paranoia = Math.max(0, Math.min(100, (s.paranoia || 0) + delta));
  perimetr_saveState(s);
  perimetr_updateParanoiaHUD(s.paranoia);
  if (s.paranoia > 50) {
    setTimeout(function(){ perimetr_unlockAndNotify('paranoid_mind'); }, 800);
  }
  return s.paranoia;
}

/* Записать выбор — эффект бабочки */
function perimetr_recordChoice(scene, choice) {
  var s = perimetr_getState();
  if (!s.choices) s.choices = {};
  s.choices[scene] = choice;
  if (choice === 'D') {
    s.silenceCount = (s.silenceCount || 0) + 1;
    if (s.silenceCount >= 3) {
      setTimeout(function(){ perimetr_unlockAndNotify('silence_x3'); }, 1200);
    }
  }
  perimetr_saveState(s);
  return s;
}

/* Добавить улику */
function perimetr_addClue(clueId) {
  var s = perimetr_getState();
  if (!s.clues) s.clues = [];
  if (s.clues.indexOf(clueId) === -1) {
    s.clues.push(clueId);
    perimetr_saveState(s);
  }
  return s.clues;
}

/* Изменить доверие к генералу */
function perimetr_changeTrust(delta) {
  var s = perimetr_getState();
  s.trust_general = (s.trust_general || 0) + delta;
  perimetr_saveState(s);
  return s.trust_general;
}

/* Проверить: есть ли улика */
function perimetr_hasClue(clueId) {
  return perimetr_getState().clues.indexOf(clueId) !== -1;
}

/* Получить выбор из предыдущей сцены */
function perimetr_getChoice(scene) {
  return (perimetr_getState().choices || {})[scene] || null;
}

/* Сброс при новой игре */
function perimetr_resetState() {
  perimetr_saveState({ paranoia: 0, choices: {}, silenceCount: 0, visited: [], clues: [], trust_general: 0, vars: {} });
}

/* Восстановить состояние из объекта (чекпоинт) */
function perimetr_setState(newState) {
  perimetr_saveState(newState);
}

/* Записать произвольную переменную эффекта бабочки */
function perimetr_setVar(key, value) {
  var s = perimetr_getState();
  if (!s.vars) s.vars = {};
  s.vars[key] = value;
  perimetr_saveState(s);
}

/* Прочитать произвольную переменную */
function perimetr_getVar(key) {
  var s = perimetr_getState();
  return (s.vars || {})[key];
}

/* Обновить HUD паранойи */
function perimetr_updateParanoiaHUD(paranoia) {
  var fill = document.getElementById('par-fill');
  var hud  = document.getElementById('paranoia-hud');
  if (!fill || !hud) return;
  setTimeout(function(){
    fill.style.width = paranoia + '%';
    if (paranoia > 0) hud.classList.add('visible');
    if (paranoia >= 60) hud.classList.add('danger');
  }, 600);
}
