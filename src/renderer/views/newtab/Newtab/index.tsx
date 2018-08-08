import { observer } from 'mobx-React';
import React from 'react';

import News from '../News';
import WeatherCard from '../WeatherCard';

import {
  Countries, Locales, TemperatureUnit, TimeUnit,
} from '../../../../enums';
import { getNews, getWeather } from '../../../../utils';
import Preloader from '../../../components/Preloader';
import store from '../../../store';
import {
  Column, Content, Credits, StyledApp,
} from './styles';

@observer
export default class Newtab extends React.Component<{ visible: boolean }, {}> {
  public componentDidMount() {
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

    store.newsColumns = columns;
  }

  public async loadData() {
    const weatherData = await getWeather(
      'warsaw',
      Locales.en,
      TemperatureUnit.Celsius,
      TimeUnit.TwentyFourHours,
    );

    store.weatherForecast = weatherData;
    store.newsData = await getNews(Countries.us);

    this.onResize();
    store.newTabContentVisible = true;
  }

  public getColumns = (columnsCount: number) => {
    const { newsData } = store;
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
  }

  public render() {
    const { visible } = this.props;
    const { weatherForecast, newTabContentVisible, newsColumns } = store;

    const preloaderStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    return (
      <StyledApp visible={visible}>
        {!newTabContentVisible && <Preloader style={preloaderStyle} />}
        <Content visible={newTabContentVisible}>
          <Column>
            <WeatherCard data={weatherForecast} />
            {newsColumns.length > 0 && <News data={newsColumns[0]} />}
          </Column>
          {newsColumns.length > 1 && (
            <Column>
              <News data={newsColumns[1]} />
            </Column>
          )}
          {newsColumns.length > 2 && (
            <Column>
              <News data={newsColumns[2]} />
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
