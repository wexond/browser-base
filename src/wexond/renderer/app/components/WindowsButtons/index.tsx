import * as React from 'react';

import { icons } from '~/renderer/app/constants';
import { WindowsButton } from '../WindowsButton';
import {
  minimizeWindow,
  maximizeWindow,
  closeWindow,
} from '~/renderer/app/utils';
import { Buttons } from './style';
import { observer } from 'mobx-react';
import store from '../../store';

export const WindowsButtons = observer(() => {
  return (
    <Buttons>
      <WindowsButton
        isDark={store.overlay.visible}
        icon={icons.windowsMinimize}
        onClick={minimizeWindow}
      />
      <WindowsButton
        isDark={store.overlay.visible}
        icon={icons.windowsMaximize}
        onClick={maximizeWindow}
      />
      <WindowsButton
        isDark={store.overlay.visible}
        icon={icons.windowsClose}
        onClick={closeWindow}
        isClose
      />
    </Buttons>
  );
});
