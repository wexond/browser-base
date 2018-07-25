import React from 'react';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';

import Store from '../../store';
import Preloader from '../../../shared/components/Preloader';
import { getWeather } from '../../utils/weather';
import { getNews } from '../../utils/news';
import News from '../News';
import WeatherCard from '../WeatherCard';

import {
  TimeUnit, TemperatureUnit, WeatherLanguages, Countries,
} from '../../../shared/enums';
import {
  StyledApp, Content, Credits, Column,
} from './styles';

@observer
class App extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.loadData();
  }

  public onResize = () => {
    let columns = this.getColumns(1);

    if (window.innerWidth > 1128) {
      columns = this.getColumns(3);
    } else if (window.innerWidth > 752) {
      columns = this.getColumns(2);
    }

    Store.columns = columns;
  };

  async loadData() {
    const weatherData = await getWeather(
      'warsaw',
      WeatherLanguages.en,
      TemperatureUnit.Celsius,
      TimeUnit.TwentyFourHours,
    );

    Store.weatherForecast = weatherData;
    Store.newsData = await getNews(Countries.us);

    this.onResize();
    Store.contentVisible = true;
  }

  public getColumns = (columnsCount: number) => {
    const { newsData } = Store;
    const columns = [];
    const itemsPerCol = Math.floor(newsData.length / columnsCount);

    for (let i = 0; i < columnsCount; i++) {
      if (i < columnsCount) {
        if (i === 0) {
          columns.push(newsData.slice(i * itemsPerCol, itemsPerCol * (i + 1) - 1));
        } else if (i === 1) {
          columns.push(newsData.slice(i * (itemsPerCol - 1), itemsPerCol * (i + 1)));
        } else {
          columns.push(newsData.slice(i * itemsPerCol, itemsPerCol * (i + 1)));
        }
      } else {
        columns.push(newsData.slice(i * itemsPerCol, newsData.length));
      }
    }

    return columns;
  };

  public render() {
    const { weatherForecast, contentVisible, columns } = Store;

    const preloaderStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    return (
      <StyledApp>
        {!contentVisible && <Preloader style={preloaderStyle} />}
        <Content visible={contentVisible}>
          <Column>
            <WeatherCard data={weatherForecast} />
            {columns.length > 0 && <News data={columns[0]} />}
          </Column>
          {columns.length > 1 && (
            <Column>
              <News data={columns[1]} />
            </Column>
          )}
          {columns.length > 2 && (
            <Column>
              <News data={columns[2]} />
            </Column>
          )}
          {!navigator.onLine && (
            <Credits>
              APIs powered by <a href="https://openweathermap.org/">OpenWeatherMap</a> and
              <a href="https://newsapi.org/"> News API</a>
              <br />
              Icons for temporary usage created by&nbsp;
              <a href="https://www.uplabs.com/kevinttob">Kevin Aguilar</a>
            </Credits>
          )}
        </Content>
      </StyledApp>
    );
  }
}

export default hot(module)(App);
