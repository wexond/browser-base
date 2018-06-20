import React from 'react';

import Card from '../../../shared/components/Card';

import { StyledApp, Container, Temperature, InfoContainer, TemperatureIcon } from './styles';

export default class App extends React.Component {
  public render() {
    return (
      <StyledApp>
        <Container>
          <Card title="Hong kong" secondaryText="Mon, 26:72 AM, Mostly cloudy" largeTitle>
            <InfoContainer>
              <Temperature>21&#x2103;</Temperature>
              <TemperatureIcon src="https://img7.downloadapk.net/7/b7/9e012d_0.png" />
            </InfoContainer>
          </Card>
        </Container>
      </StyledApp>
    );
  }
}
