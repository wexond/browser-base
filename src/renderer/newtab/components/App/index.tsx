import { observer } from 'mobx-react';
import React from 'react';

import store from '@newtab/store';
import News from '../News';
import WeatherCard from '../WeatherCard';
import { getWeather } from '~/utils/weather';
import { Column, Content, StyledApp } from './styles';

@observer
export default class App extends React.Component<{ visible: boolean }, {}> {
  public componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.loadData();
  }

  public onResize = () => {
    const { newsStore } = store;

    let columns = newsStore.getColumns(1);

    if (window.innerWidth > 1128) {
      columns = newsStore.getColumns(3);
    } else if (window.innerWidth > 752) {
      columns = newsStore.getColumns(2);
    }

    newsStore.columns = columns;
  };

  public async loadData() {
    const weatherData = await getWeather('san francisco', 'en', 'C', 24);

    store.weatherStore.forecast = weatherData;
    store.newsStore.news = await store.newsStore.getNews('us');

    this.onResize();
  }

  public render() {
    const { columns } = store.newsStore;

    return (
      <StyledApp>
        <Content>
          <Column>
            {true && <WeatherCard data={store.weatherStore.forecast} />}
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
        </Content>
      </StyledApp>
    );
  }
}
