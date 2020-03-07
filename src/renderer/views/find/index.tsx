import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

import { App } from './components/App';
import { injectFonts } from '~/renderer/mixins';

ipcRenderer.setMaxListeners(0);

injectFonts();

ReactDOM.render(<App />, document.getElementById('app'));
