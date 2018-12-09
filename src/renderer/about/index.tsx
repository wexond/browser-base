import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

import { Style } from '../styles';
import App from './components/App';

injectGlobal`${Style}`;

const render = (AppComponent: any) => {
  ReactDOM.render(<AppComponent />, document.getElementById('app'));
};

render(App);
