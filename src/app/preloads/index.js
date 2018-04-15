const loadContent = require('../../shared/utils/load-content');

if (window.location.href.startsWith('wexond://history')) {
  loadContent('history');
}
