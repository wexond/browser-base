const path = require('path');
const { homedir } = require('os');
const loadContent = require('../../shared/utils/load-content');
const sqlite3 = require('sqlite3');

const getPath = relativePath =>
  path.resolve(path.resolve(homedir(), '.wexond'), relativePath).replace(/\\/g, '/');

const history = new sqlite3.Database(getPath('history.db'));

const url = window.location.href;

function loadHistory() {
  loadContent('history');

  global.wexond = {
    getHistory: () =>
      new Promise((resolve, reject) => {
        history.all('SELECT * FROM history', (err, rows) => {
          if (err) {
            return;
          }
          resolve(rows);
        });
      }),
  };
}

if (url.startsWith('wexond://history')) {
  loadHistory();
}

if (process.env.NODE_ENV === 'dev') {
  if (url.startsWith('http://localhost:8080/history.html')) {
    loadHistory();
  }
}
