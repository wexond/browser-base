/* eslint-disable no-console */

import React from 'react';

import colors from '../../../shared/defaults/colors';

import Slider from '../../../shared/components/Slider';
import { SliderType, UITheme } from '../../../shared/enums';

import { StyledApp } from './styles';

export interface IState {
  darkTheme: boolean;
  ticks1: any;
  ticks2: any;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    darkTheme: false,
    ticks1: [10, 20, 30],
    ticks2: [null, 'A', null, 'B', null, 'C', null, 'D', null],
  };

  onChange = (e: any) => {
    const { darkTheme } = this.state;

    this.setState({
      darkTheme: !darkTheme,
    });
  };

  public onSliderChange = (value: any, type: SliderType, element: Slider) => {
    if (type === SliderType.Continuous) {
      console.log(Math.round(value));
    } else {
      console.log(`Index: ${value}, Value: ${element.props.ticks[value]}`);
    }
  };

  public render() {
    const { darkTheme, ticks1, ticks2 } = this.state;
    const theme: UITheme = darkTheme ? UITheme.Dark : UITheme.Light;

    return (
      <StyledApp theme={theme}>
        <Slider onChange={this.onSliderChange} minValue={0} maxValue={100} />
        <Slider
          onChange={this.onSliderChange}
          ticks={ticks1}
          type={SliderType.Discrete}
          style={{ marginTop: 64 }}
        />
        <Slider
          onChange={this.onSliderChange}
          ticks={ticks2}
          type={SliderType.Discrete}
          style={{ marginTop: 64 }}
          showTicksLabels
        />
      </StyledApp>
    );
  }
}
