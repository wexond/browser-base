import React from 'react';

import Preloader from '../../../shared/components/Preloader';

import { getWeather } from '../../utils/weather';
import { getNews } from '../../utils/news';
import { TimeUnit, Languages, Countries } from '../../../shared/enums';
import { TemperatureUnit } from '../../enums';

import { StyledApp, Content } from './styles';

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
    /* const weatherData = await getWeather(
      'opole',
      Languages.en,
      TemperatureUnit.Celsius,
      TimeUnit.am,
    ); */

    const newsData = await getNews(Countries.pl);

    this.setState({
      // weatherData,
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
          <News data={newsData} />
        </Content>
        <a
          href="https://newsapi.org/"
          style={{ position: 'absolute', bottom: 0, color: 'rgba(0,0,0,0.54)' }}
        >
          Powered by News API
        </a>
      </StyledApp>
    );
  }
}

// <WeatherCard data={weatherData} />
