const loadContent = require('../../shared/utils/load-content');

const url = window.location.href;

if (url.startsWith('wexond://history')) {
  loadContent('history');
}

if (process.env.NODE_ENV === 'dev') {
  if (url.startsWith('http://localhost:8080/history.html')) {
    loadContent('history');
  }
}
