import React from 'react';
import { icons } from '../../../../defaults';
import { closeWindow, maximizeWindow, minimizeWindow } from '../../../../utils';
import Toolbar from '../Toolbar';
import Button from './Button';

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
