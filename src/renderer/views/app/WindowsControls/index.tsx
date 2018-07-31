import React from 'react';
import { closeWindow, maximizeWindow, minimizeWindow } from '../../../utils/window';
import Button from './Button';
import Toolbar from '../Toolbar';

export default class WindowsControls extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Toolbar.Separator />
        <Button icon={minimizeIcon} onClick={minimizeWindow} />
        <Button icon={maximizeIcon} onClick={maximizeWindow} />
        <Button icon={closeIcon} onClick={closeWindow} isClose />
      </React.Fragment>
    );
  }
}
