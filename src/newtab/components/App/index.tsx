import React from 'react';
import { hot } from 'react-hot-loader';

import Preloader from '../../../shared/components/Preloader';

import { getWeather } from '../../utils/weather';
import { getNews } from '../../utils/news';
import {
  TimeUnit, TemperatureUnit, Languages, Countries,
} from '../../../shared/enums';

import {
  StyledApp, Content, Credits, Column,
} from './styles';

import WeatherCard from '../WeatherCard';
import News from '../News';

export interface IState {
  contentVisible: boolean;
  weatherData?: any;
  columns?: any;
}

class App extends React.Component<{}, IState> {
  private newsData: any[];

  public state: IState = {
    contentVisible: false,
    columns: [],
  };

  componentDidMount() {
    this.loadData();

    window.addEventListener('resize', this.onResize);
  }

  public onResize = () => {
    let columns = this.getColumns(1);

    if (window.innerWidth > 1128) {
      columns = this.getColumns(3);
    } else if (window.innerWidth > 752) {
      columns = this.getColumns(2);
    }

    this.setState({ columns });
  };

  async loadData() {
    const weatherData = await getWeather(
      'opole',
      Languages.en,
      TemperatureUnit.Celsius,
      TimeUnit.TwentyFourHours,
    );

    this.newsData = await getNews(Countries.pl);
    let columns = this.getColumns(1);

    if (window.innerWidth > 1128) {
      columns = this.getColumns(3);
    } else if (window.innerWidth > 752) {
      columns = this.getColumns(2);
    }

    this.setState({
      weatherData,
      columns,
      contentVisible: true,
    });
  }

  public getColumns = (columnsCount: number) => {
    const columns = [];

    const itemsPerCol = Math.floor(this.newsData.length / columnsCount);

    for (let i = 0; i < columnsCount; i++) {
      if (i < columnsCount) {
        if (i === 0) {
          columns.push(this.newsData.slice(i * itemsPerCol, itemsPerCol * (i + 1) - 1));
        } else if (i === 1) {
          columns.push(this.newsData.slice(i * (itemsPerCol - 1), itemsPerCol * (i + 1)));
        } else {
          columns.push(this.newsData.slice(i * itemsPerCol, itemsPerCol * (i + 1)));
        }
      } else {
        columns.push(this.newsData.slice(i * itemsPerCol, this.newsData.length));
      }
    }

    return columns;
  };

  public render() {
    const { contentVisible, weatherData, columns } = this.state;

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
            <WeatherCard data={weatherData} />
            <News data={columns[0]} />
          </Column>
          {columns[1] && (
            <Column>
              <News data={columns[1]} />
            </Column>
          )}
          {columns[2] && (
            <Column>
              <News data={columns[2]} />
            </Column>
          )}
          <Credits>
            APIs powered by <a href="https://openweathermap.org/">OpenWeatherMap</a> and
            <a href="https://newsapi.org/"> News API</a>
          </Credits>
        </Content>
      </StyledApp>
    );
  }
}

export default hot(module)(App);
