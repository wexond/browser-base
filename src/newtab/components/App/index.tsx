import React from 'react';

import Preloader from '../../../shared/components/Preloader';

import { requestWeather } from '../../../shared/utils/weather';
import { Languages, TemperatureUnit } from '../../../shared/enums';

import { StyledApp, Content } from './styles';

import WeatherCard from '../WeatherCard';

export interface IState {
  contentVisible: boolean;
  weatherData: any;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    contentVisible: false,
    weatherData: null,
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const weatherData = await requestWeather('opole', Languages.EN, TemperatureUnit.Celsius);

    this.setState({
      weatherData,
      contentVisible: true,
    });
  }

  public render() {
    const { contentVisible, weatherData } = this.state;

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
          <WeatherCard data={weatherData} />
        </Content>
      </StyledApp>
    );
  }
}
