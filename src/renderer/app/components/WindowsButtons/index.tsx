import React from 'react';
import Toolbar from '../Toolbar';
import WindowsButton from '../WindowsButton';
import { minimizeWindow, maximizeWindow, closeWindow } from 'utils/window';
import { icons } from 'defaults';

export default class WindowsControls extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Toolbar.Separator />
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
