import React from 'react';

import {
  StyledForecastItem, InfoContainer, WeatherIcon, TempContainer, Temp,
} from './styles';
import WeatherWeeklyItem from '../../../../models/weather-weekly-item';

export interface Props {
  data: WeatherWeeklyItem;
  dayName: string;
}

export default class ForecastItem extends React.Component<Props, {}> {
  public render() {
    const { data, dayName } = this.props;

    return (
      <StyledForecastItem>
        {dayName}
        <InfoContainer>
          <WeatherIcon src={data.dayIcon} />
          <TempContainer>
            <Temp>
              {data.dayTemp}
              &deg;
            </Temp>
            <Temp night>
              /{data.nightTemp}
              &deg;
            </Temp>
          </TempContainer>
        </InfoContainer>
      </StyledForecastItem>
    );
  }
}
