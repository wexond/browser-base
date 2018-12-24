import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';

const render = (AppComponent: any) => {
  ReactDOM.render(<AppComponent />, document.getElementById('app'));
};

(async function () {
  render(App);
})();
