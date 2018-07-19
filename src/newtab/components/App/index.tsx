import React from 'react';

import Preloader from '../../../shared/components/Preloader';

import { getWeather } from '../../utils/weather';
import { getNews } from '../../utils/news';
import {
  TimeUnit, TemperatureUnit, Languages, Countries,
} from '../../../shared/enums';

import {
  StyledApp, Content, CardsContainer, Credits, Column,
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
    newsData: [],
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const weatherData = await getWeather(
      'opole',
      Languages.en,
      TemperatureUnit.Celsius,
      TimeUnit.TwentyFourHours,
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

    const items = newsData.length / 3;

    const column1 = newsData.slice(1, items);
    const column2 = newsData.slice(items, items * 2);
    const column3 = newsData.slice(items * 2, items * 3);

    return (
      <StyledApp>
        {!contentVisible && <Preloader style={preloaderStyle} />}
        <Content visible={contentVisible}>
          <Column>
            <WeatherCard data={weatherData} />
            <News data={column1} />
          </Column>
          <Column>
            <News data={column2} />
          </Column>
          <Column>
            <News data={column3} />
          </Column>
          <Credits>
            APIs powered by <a href="https://openweathermap.org/">OpenWeatherMap</a> and
            <a href="https://newsapi.org/"> News API</a>
          </Credits>
        </Content>
      </StyledApp>
    );
  }
}
