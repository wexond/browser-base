import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { ipcRenderer } from 'electron';

export const renderUI = (Component: any) => {
  ipcRenderer.setMaxListeners(0);
  ReactDOM.render(
    React.createElement(Component),
    document.getElementById('app'),
  );
};
