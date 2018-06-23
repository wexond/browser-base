import React from 'react';

import { TemperatureUnit, TimeUnit } from '../../../shared/enums';
import { getActualTime } from '../../../shared/utils/time';

import Card from '../../../shared/components/Card';

import {
  Temperature,
  InfoContainer,
  TemperatureDeg,
  TemperatureIcon,
  ErrorContainer,
} from './styles';

export interface WeatherCardProps {
  data: any;
}

export default class WeatherCard extends React.Component<WeatherCardProps, {}> {
  getTemperatureUnitChar = () => {
    const { tempUnit } = this.props.data;

    for (const temp in TemperatureUnit) {
      if (TemperatureUnit[temp] === tempUnit) {
        return TemperatureUnit[temp];
      }
    }

    return null;
  };

  getDescription = () => {
    const { description, timeUnit } = this.props.data;
    const date = new Date();
    const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayIndex = date.getDay() === 0 ? daysShort.length - 1 : date.getDay();

    return `${daysShort[dayIndex]}, ${getActualTime(timeUnit)} ${
      TimeUnit[timeUnit]
    }, ${description}`;
  };

  public render() {
    const { data } = this.props;

    const city = data != null ? data.city : 'Weather info is unavailable';
    const description = data != null ? this.getDescription() : null;

    return (
      <Card title={city} secondaryText={description} largeTitle>
        {data != null && (
          <InfoContainer>
            <Temperature>
              {data.temp}
              <TemperatureDeg>&deg;{this.getTemperatureUnitChar()}</TemperatureDeg>
            </Temperature>
            <TemperatureIcon src={data.icon} />
          </InfoContainer>
        )}
        {data == null && (
          <ErrorContainer>
            Check your internet connection or your settings. An incorrect city name is probably set.
          </ErrorContainer>
        )}
      </Card>
    );
  }
}
