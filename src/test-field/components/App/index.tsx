import React from 'react';

import colors from '../../../shared/defaults/colors';

import Slider from '../../../shared/components/Slider';
import { SliderType, UITheme } from '../../../shared/enums';

import { StyledApp } from './styles';

export interface IState {
  darkTheme: boolean;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    darkTheme: false,
  };

  onChange = (e: any) => {
    const { darkTheme } = this.state;

    this.setState({
      darkTheme: !darkTheme,
    });
  };

  public render() {
    const { darkTheme } = this.state;
    const theme: UITheme = darkTheme ? UITheme.Dark : UITheme.Light;

    return (
      <StyledApp theme={theme}>
        <Slider minValue={0} maxValue={100} />
      </StyledApp>
    );
  }
}
