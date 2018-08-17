import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { injectGlobal } from 'styled-components';
import { Style } from './styles';

injectGlobal`${Style}`;

ipcRenderer.send(UPDATE_CHECK);

const render = (AppComponent: any) => {
  ReactDOM.render(
    <AppContainer>
      <AppComponent />
    </AppContainer>,
    document.getElementById('app'),
  );
};
(async function setup() {
  await loadPlugins();
  runExtensionsService();

  render(App);

  createWorkspace();
})();

// React-hot-loader
if ((module as any).hot) {
  (module as any).hot.accept();
}
