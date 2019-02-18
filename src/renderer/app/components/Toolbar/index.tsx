import { observer } from 'mobx-react';
import * as React from 'react';
import { platform } from 'os';

import store from '~/renderer/app/store';
import { StyledToolbar } from './style';
import { WindowsButtons } from '../WindowsButtons';
import { NavigationButtons } from '../NavigationButtons';
import { Tabbar } from '../Tabbar';
import ToolbarButton from '../ToolbarButton';
import { icons } from '../../constants';
import { ipcRenderer } from 'electron';

const onUpdateClick = () => {
  ipcRenderer.send('update-install');
};

export const Toolbar = observer(() => {
  return (
    <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
      <NavigationButtons />
      <Tabbar />
      {store.updateInfo.available && (
        <ToolbarButton
          icon={icons.download}
          style={{ marginRight: 16 }}
          onClick={onUpdateClick}
        />
      )}
      {platform() !== 'darwin' && <WindowsButtons />}
    </StyledToolbar>
  );
});
