import React from 'react';
import { closeWindow, maximizeWindow, minimizeWindow } from '../../utils/window';
import Button from './Button';
import Toolbar from '../Toolbar';
import Store from '../../store';

const closeIcon = require('../../../shared/icons/windows/close.svg');
const maximizeIcon = require('../../../shared/icons/windows/maximize.svg');
const minimizeIcon = require('../../../shared/icons/windows/minimize.svg');

export default class WindowsControls extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Toolbar.Separator style={{...Store.theme.theme.toolbarSeparators}} />
        <Button icon={minimizeIcon} onClick={minimizeWindow} />
        <Button icon={maximizeIcon} onClick={maximizeWindow} />
        <Button icon={closeIcon} onClick={closeWindow} isClose />
      </React.Fragment>
    )
  }
}

