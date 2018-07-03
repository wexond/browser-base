/* eslint-disable no-console */

import React from 'react';

import colors from '../../../shared/defaults/colors';

import Progressbar from '../../../shared/components/Progressbar';
import Textfield from '../../../shared/components/Textfield';

import { TextfieldType, ProgressType, UITheme } from '../../../shared/enums';

import { StyledApp } from './styles';

export interface IState {
  darkTheme: boolean;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    darkTheme: false,
  };

  public render() {
    const { darkTheme } = this.state;
    const theme: UITheme = darkTheme ? UITheme.Dark : UITheme.Light;

    return (
      <StyledApp theme={theme}>
        <Textfield />
      </StyledApp>
    );
  }
}
