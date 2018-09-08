import React from 'react';

import { WeatherWeeklyItem } from '@/interfaces/newtab';
import {
  InfoContainer,
  StyledForecastItem,
  Temp,
  TempContainer,
  WeatherIcon,
} from './styles';

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
