const loadContent = require('../../shared/utils/load-content');

if (
  window.location.href.startsWith('wexond://newtab') ||
  window.location.href.startsWith('http://localhost:8080/newtab.html')
) {
  loadContent('newtab');
}
