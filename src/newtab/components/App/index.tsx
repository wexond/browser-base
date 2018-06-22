import React from 'react';

import Preloader from '../../../shared/components/Preloader';

import { requestWeather } from '../../../shared/utils/weather';
import { Languages } from '../../../shared/enums';

import { StyledApp, Content } from './styles';

import WeatherCard from '../WeatherCard';

export interface IState {
  contentVisible: boolean;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    contentVisible: false,
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const weatherData = await requestWeather('opole', Languages.pl);

    this.setState({
      contentVisible: true,
    });
  }

  public render() {
    const { contentVisible } = this.state;

    const preloaderStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    return (
      <StyledApp>
        {!contentVisible && <Preloader size={48} style={preloaderStyle} />}
        <Content visible={contentVisible}>
          <WeatherCard city="Warsaw" info="Mon, 12:00 AM, Mostly cloudy" temperature="28" />
        </Content>
      </StyledApp>
    );
  }
}
