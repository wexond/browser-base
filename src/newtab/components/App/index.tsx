import React from 'react';

import WeatherCard from '../WeatherCard';

import { requestWeather } from '../../../shared/utils/weather';
import { Languages } from '../../../shared/enums';

import { StyledApp, Container } from './styles';

export default class App extends React.Component {
  async componentDidMount() {
    const weatherData = await requestWeather('opole', Languages.pl);

    console.log(weatherData);
  }

  public render() {
    return (
      <StyledApp>
        <Container>
          <WeatherCard city="Warsaw" info="Mon, 12:00 AM, Mostly cloudy" temperature="28" />
        </Container>
      </StyledApp>
    );
  }
}
