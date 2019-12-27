import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp } from './style';
import store from '../../store';
import { resolve } from 'path';
import { remote } from 'electron';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = hot(
  observer(() => {
    React.useEffect(() => {
      if (!store.webviewRef.current) return;

      store.webviewRef.current.addEventListener('ipc-message', e => {
        if (e.channel === 'webview-size') {
          store.webviewWidth = e.args[0];
          store.webviewHeight = e.args[1];

          store.visible = true;
        }
      });
    });

    return (
      <StyledApp style={{ maxHeight: store.maxHeight }} visible={store.visible}>
        <GlobalStyle />
        <div style={{ width: store.webviewWidth, height: store.webviewHeight }}>
          {store.url && (
            <webview
              style={{ width: '100%', height: '100%' }}
              partition="persist:electron-extension-1"
              src={store.url}
              ref={store.webviewRef}
              preload={`${resolve(
                remote.app.getAppPath(),
                'build',
                'extensions-popup-preload.js',
              )}`}
            ></webview>
          )}
        </div>
      </StyledApp>
    );
  }),
);
