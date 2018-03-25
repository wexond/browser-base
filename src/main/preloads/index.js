const { loadScripts } = require('../../shared/utils/dom');

document.addEventListener('DOMContentLoaded', () => {
  if (process.env.NODE_ENV === 'dev') {
    loadScripts(['http://localhost:8080/app.bundle.js']);
  } else {
    loadScripts(['../../build/app.bundle.js']);
  }
});
