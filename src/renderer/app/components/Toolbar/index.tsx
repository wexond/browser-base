import { observer } from 'mobx-react';
import * as React from 'react';
import { platform } from 'os';

import store from '~/renderer/app/store';
import { StyledToolbar } from './style';
import { WindowsButtons } from '../WindowsButtons';
import { NavigationButtons } from '../NavigationButtons';
import { Tabbar } from '../Tabbar';

export const Toolbar = observer(() => {
  return (
    <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
      <NavigationButtons />
      <Tabbar />
      {platform() !== 'darwin' && <WindowsButtons />}
    </StyledToolbar>
  );
});
