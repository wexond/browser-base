const loadContent = require('../../shared/utils/load-content');

if (
  window.location.href.startsWith('wexond://newtab')
  || window.location.href.startsWith('http://localhost:8080/newtab.html')
) {
  loadContent('newtab');
} else if (
  window.location.href.startsWith('wexond://test-field')
  || window.location.href.startsWith('http://localhost:8080/test-field.html')
) {
  loadContent('testField');
}
r;
