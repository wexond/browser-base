import React from 'react';

import {
  StyledForecastItem, InfoContainer, WeatherIcon, TempContainer, Temp,
} from './styles';

export interface Props {
  data: any;
  dayName: string;
}

export default class ForecastItem extends React.Component<Props, {}> {
  public render() {
    const { data, dayName } = this.props;
    const { day, night } = data;

    return (
      <StyledForecastItem>
        {dayName}
        <InfoContainer>
          <WeatherIcon src={day.icon} />
          <TempContainer>
            <Temp>{day.temp}&deg;</Temp>
            <Temp night>/{night.temp}&deg;</Temp>
          </TempContainer>
        </InfoContainer>
      </StyledForecastItem>
    );
  }
}
