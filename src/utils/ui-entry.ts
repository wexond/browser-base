import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { configureUI } from '~/common/renderer-config';
import { ipcRenderer } from 'electron';

export const renderUI = (Component: any) => {
  ipcRenderer.setMaxListeners(0);
  configureUI();

  ReactDOM.render(
    React.createElement(Component),
    document.getElementById('app'),
  );
};
