import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

// Mixins
import { typography } from 'nersent-ui';

// Components
import App from './components/App';

injectGlobal`
  body {
    user-select: none;
    cursor: default;
    ${typography.body1()}
    margin: 0;
    padding: 0;
  }
`;

ReactDOM.render(<App />, document.getElementById('app'));
