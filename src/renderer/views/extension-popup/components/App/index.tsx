import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp } from './style';
import store from '../../store';
import { resolve } from 'path';
import { remote, ipcRenderer } from 'electron';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = hot(
  observer(() => {
    React.useEffect(() => {
      if (!store.webviewRef.current) return;

      store.webviewRef.current
        .getWebContents()
        .addListener('context-menu', e => {
          const menu = remote.Menu.buildFromTemplate([
            {
              label: 'Inspect element',
              click: () => {
                store.webviewRef.current.openDevTools();
              },
            },
          ]);

          menu.popup();
        });

      store.webviewRef.current.addEventListener('ipc-message', e => {
        if (e.channel === 'webview-size') {
          store.webviewWidth = store.webviewWidth < 10 ? 200 : e.args[0];
          store.webviewHeight = e.args[1];

          ipcRenderer.send(
            `bounds-${store.id}`,
            store.webviewWidth + 16,
            store.webviewHeight + 16,
          );

          store.visible = true;

          store.webviewRef.current.focus();
        } else if (e.channel === 'webview-blur') {
          if (store.visible && !store.webviewRef.current.isDevToolsOpened()) {
            setTimeout(() => {
              store.hide();
            });
          }
        }
      });
    });

    return (
      <StyledApp visible={store.visible}>
        <GlobalStyle />
        <div
          style={{
            width: store.webviewWidth,
            height: store.webviewHeight,
          }}
        >
          {store.url && (
            <webview
              style={{ width: '100%', height: '100%' }}
              partition="persist:electron-extension-1"
              ref={store.webviewRef}
              src={store.url}
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
