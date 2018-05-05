const { loadScripts } = require('../../shared/utils/dom');

const loadContent = name => {
  document.addEventListener('DOMContentLoaded', () => {
    loadScripts([`wexond://build/${name}.bundle.js`]);
  });
};

module.exports = loadContent;
