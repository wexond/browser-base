const loadContent = require('../../shared/utils/load-content');

if (window.location.href.startsWith('wexond://newtab')) {
  loadContent('newtab');
}
