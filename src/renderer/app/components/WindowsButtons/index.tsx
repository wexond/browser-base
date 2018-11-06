import * as React from 'react';

import ToolbarSeparator from '@app/components/ToolbarSeparator';
import { icons } from '@/constants/renderer';
import WindowsButton from '../WindowsButton';
import {
  minimizeWindow,
  maximizeWindow,
  closeWindow,
} from '@/utils/app/window';

export default class WindowsControls extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <ToolbarSeparator />
        <WindowsButton icon={icons.windowsMinimize} onClick={minimizeWindow} />
        <WindowsButton icon={icons.windowsMaximize} onClick={maximizeWindow} />
        <WindowsButton
          icon={icons.windowsClose}
          onClick={closeWindow}
          isClose
        />
      </React.Fragment>
    );
  }
}
