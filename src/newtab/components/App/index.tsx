import React from 'react';

import WeatherCard from '../WeatherCard';

import { StyledApp, Container } from './styles';

export default class App extends React.Component {
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
