import React from 'react';

import Preloader from '../../../shared/components/Preloader';

import { getWeather } from '../../utils/weather';
import { getNews } from '../../utils/news';
import { TimeUnit, Languages, Countries } from '../../../shared/enums';
import { TemperatureUnit } from '../../enums';

import {
  StyledApp, Content, CardsContainer, Credits,
} from './styles';

import WeatherCard from '../WeatherCard';
import News from '../News';

export interface IState {
  contentVisible: boolean;
  weatherData?: any;
  newsData?: any;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    contentVisible: false,
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const weatherData = await getWeather(
      'opole',
      Languages.en,
      TemperatureUnit.Celsius,
      TimeUnit.am,
    );

    const newsData = await getNews(Countries.pl);

    this.setState({
      weatherData,
      newsData,
      contentVisible: true,
    });
  }

  public render() {
    const { contentVisible, weatherData, newsData } = this.state;

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
          <CardsContainer>
            <WeatherCard data={weatherData} />
          </CardsContainer>
          <News data={newsData} />
        </Content>
        <Credits>
          APIs powered by <a href="https://openweathermap.org/">OpenWeatherMap</a> and{' '}
          <a href="https://newsapi.org/">News API</a>
        </Credits>
      </StyledApp>
    );
  }
}
