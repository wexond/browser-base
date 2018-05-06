import React from 'react';
import { closeWindow, maximizeWindow, minimizeWindow } from '../../utils/window';
import WindowsButton from '../WindowsButton';

const closeIcon = require('../../../shared/icons/windows/close.svg');
const maximizeIcon = require('../../../shared/icons/windows/maximize.svg');
const minimizeIcon = require('../../../shared/icons/windows/minimize.svg');

export default () => {
  <React.Fragment>
    <WindowsButton icon={minimizeIcon} onClick={minimizeWindow} />
    <WindowsButton icon={maximizeIcon} onClick={maximizeWindow} />
    <WindowsButton icon={closeIcon} isClose onClick={closeWindow} />
  </React.Fragment>;
};
