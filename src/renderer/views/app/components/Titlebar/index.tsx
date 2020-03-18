import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ipcRenderer } from 'electron';

import store from '../../store';
import { Tabbar } from '../Tabbar';
import { platform } from 'os';
import { WindowsControls } from 'react-windows-controls';
import { StyledTitlebar } from './style';

const onCloseClick = () => ipcRenderer.send(`window-close-${store.windowId}`);

const onMaximizeClick = () =>
  ipcRenderer.send(`window-toggle-maximize-${store.windowId}`);

const onMinimizeClick = () =>
  ipcRenderer.send(`window-minimize-${store.windowId}`);

export const Titlebar = observer(() => {
  return (
    <StyledTitlebar isHTMLFullscreen={store.isHTMLFullscreen}>
      <Tabbar />
      {platform() !== 'darwin' && (
        <WindowsControls
          style={{
            height: 32,
            WebkitAppRegion: 'no-drag',
            marginLeft: 8,
          }}
          onClose={onCloseClick}
          onMinimize={onMinimizeClick}
          onMaximize={onMaximizeClick}
          dark={store.theme['toolbar.lightForeground']}
        />
      )}
    </StyledTitlebar>
  );
});
