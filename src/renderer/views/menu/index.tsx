import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/App';
import { ipcRenderer } from 'electron';

ipcRenderer.setMaxListeners(0);

ReactDOM.render(<App />, document.getElementById('app'));
