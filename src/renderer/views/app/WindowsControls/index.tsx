import React from 'react';
import { closeWindow, maximizeWindow, minimizeWindow } from '../../../utils/window';
import Button from './Button';
import Toolbar from '../Toolbar';
import icons from '../../../defaults/icons';

export default class WindowsControls extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Toolbar.Separator />
        <Button icon={icons.windowsMinimize} onClick={minimizeWindow} />
        <Button icon={icons.windowsMaximize} onClick={maximizeWindow} />
        <Button icon={icons.windowsClose} onClick={closeWindow} isClose />
      </React.Fragment>
    );
  }
}
