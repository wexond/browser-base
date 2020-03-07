import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import { injectFonts } from '~/renderer/mixins';

injectFonts();

ReactDOM.render(<App />, document.getElementById('app'));
