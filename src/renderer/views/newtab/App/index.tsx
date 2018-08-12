import { observer } from 'mobx-react';
import React from 'react';

import News from '../News';
import WeatherCard from '../WeatherCard';

import {
  Countries,
  Locales,
  TemperatureUnit,
  TimeUnit,
} from '../../../../enums';
import Preloader from '../../../components/Preloader';
import { Column, Content, StyledApp } from './styles';
import { newtabStore } from '../../../newtab-store';
import { getWeather } from '../../../../utils/weather';
import { getNews } from '../../../../utils/news';

@observer
export default class App extends React.Component<{ visible: boolean }, {}> {
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

    newtabStore.newsColumns = columns;
  }

  public async loadData() {
    const weatherData = await getWeather(
      'warsaw',
      Locales.en,
      TemperatureUnit.Celsius,
      TimeUnit.TwentyFourHours,
    );

    newtabStore.weatherForecast = weatherData;
    newtabStore.newsData = await getNews(Countries.us);

    this.onResize();
    newtabStore.newTabContentVisible = true;
  }

  public getColumns = (columnsCount: number) => {
    const { newsData } = newtabStore;
    const columns = [];
    const itemsPerCol = Math.floor(newsData.length / columnsCount);

    for (let i = 0; i < columnsCount; i++) {
      if (i < columnsCount) {
        if (i === 0) {
          columns.push(
            newsData.slice(i * itemsPerCol, itemsPerCol * (i + 1) - 1),
          );
        } else if (i === 1) {
          columns.push(
            newsData.slice(i * (itemsPerCol - 1), itemsPerCol * (i + 1)),
          );
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
    const { weatherForecast, newTabContentVisible, newsColumns } = newtabStore;

    const preloaderStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    return (
      <StyledApp>
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
        </Content>
      </StyledApp>
    );
  }
}
