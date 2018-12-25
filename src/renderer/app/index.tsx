import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import store from './store';

const render = (AppComponent: any) => {
  ReactDOM.render(<AppComponent />, document.getElementById('app'));
};

(async function () {
  render(App);

  if (store.tabsStore.groups.length === 0) {
    store.tabsStore.addGroup();
  }
})();
