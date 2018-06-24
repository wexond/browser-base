import React from 'react';

import colors from '../../../shared/defaults/colors';

import Button from '../../../shared/components/Button';
import { ButtonType } from '../../../shared/enums';

import { StyledApp } from './styles';

const addIcon = require('../../../shared/icons/add.svg');

export default class App extends React.Component {
  public render() {
    const buttonStyle = {
      marginTop: '24px',
    };

    const background = colors.deepPurple['500'];
    const foreground = '#fff';

    return (
      <StyledApp>
        <Button background={background} foreground={foreground}>
          Button
        </Button>
        <Button background={background} foreground={foreground} icon={addIcon} style={buttonStyle}>
          Button
        </Button>
        <Button foreground={background} style={buttonStyle} type={ButtonType.Text}>
          Button
        </Button>
        <Button foreground={background} style={buttonStyle} type={ButtonType.Outlined}>
          Button
        </Button>
      </StyledApp>
    );
  }
}
