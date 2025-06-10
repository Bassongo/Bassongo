let appConfig = { clubs: [], postesByType: {}, postesByClub: {}, comites: {} };

function loadConfig() {
  return fetch('/api/config')
    .then(r => r.ok ? r.json() : appConfig)
    .then(cfg => { appConfig = Object.assign(appConfig, cfg); return appConfig; });
}

function saveConfig() {
  return fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appConfig)
  });
}

function getConfig() {
  return appConfig;
}

window.loadConfig = loadConfig;
window.saveConfig = saveConfig;
window.getConfig = getConfig;
