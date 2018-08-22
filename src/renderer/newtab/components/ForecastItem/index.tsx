import React from 'react';

import {
  InfoContainer,
  StyledForecastItem,
  Temp,
  TempContainer,
  WeatherIcon,
} from './styles';
import { WeatherWeeklyItem } from '~/interfaces';

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
            <Temp>
              /{data.nightTemp}
              &deg;
            </Temp>
          </TempContainer>
        </InfoContainer>
      </StyledForecastItem>
    );
  }
}
