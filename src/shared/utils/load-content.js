const { loadScripts } = require('../../shared/utils/dom');

const loadContent = name => {
  document.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'dev') {
      loadScripts([`http://localhost:8080/${name}.bundle.js`]);
    } else {
      loadScripts([`wexond://build/${name}.bundle.js`]);
    }
  });
};

module.exports = loadContent;
