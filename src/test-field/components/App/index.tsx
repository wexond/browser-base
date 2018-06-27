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

    const ticks1 = [10, 20, 30, 40, 50];

    const ticks2 = {
      8: '8 AM',
      11: '11 AM',
      14: '2 PM',
      17: '5 PM',
      20: '8 PM',
    };

    console.log(Object.keys(ticks1));

    return (
      <StyledApp theme={theme}>
        <Slider minValue={0} maxValue={100} />
        <Slider ticks={ticks1} type={SliderType.Discrete} style={{ marginTop: 64 }} />
        <Slider ticks={ticks2} type={SliderType.Discrete} style={{ marginTop: 64 }} />
      </StyledApp>
    );
  }
}
