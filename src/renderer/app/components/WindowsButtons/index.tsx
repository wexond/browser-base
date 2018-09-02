import React from 'react';
import WindowsButton from '../WindowsButton';
import { minimizeWindow, maximizeWindow, closeWindow } from '~/utils/app/window';
import { icons } from '~/renderer/defaults';
import ToolbarSeparator from '@app/components/ToolbarSeparator';

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
