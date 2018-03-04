const { loadScripts } = require('../../shared/utils/dom');

document.addEventListener("DOMContentLoaded", e => {
  if (process.env.NODE_ENV === 'dev') {
    loadScripts(['http://localhost:8080/app.bundle.js']);
  } else {
    loadScripts(['../../app.bundle.js']);
  }
});
