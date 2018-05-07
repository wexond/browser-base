import React from 'react';
import { closeWindow, maximizeWindow, minimizeWindow } from '../../utils/window';
import Button from './Button';

const closeIcon = require('../../../shared/icons/windows/close.svg');
const maximizeIcon = require('../../../shared/icons/windows/maximize.svg');
const minimizeIcon = require('../../../shared/icons/windows/minimize.svg');

export default () => {
  <React.Fragment>
    <Button icon={minimizeIcon} onClick={minimizeWindow} />
    <Button icon={maximizeIcon} onClick={maximizeWindow} />
    <Button icon={closeIcon} onClick={closeWindow} isClose />
  </React.Fragment>;
};
