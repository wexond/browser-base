import React from 'react';

import { TimeUnit } from '../../../shared/enums';
import { getActualTime } from '../../../shared/utils/time';

import opacity from '../../../shared/defaults/opacity';

import Card from '../../../shared/components/Card';

import {
  Temperature,
  InfoContainer,
  TemperatureDeg,
  TemperatureIcon,
  ErrorContainer,
  ExtraInfoContainer,
  ExtraInfo,
  ExtraInfoIcon,
  ExtraInfoText,
} from './styles';

const precipitationIcon = require('../../../shared/icons/weather/precipitation.png');
const windIcon = require('../../../shared/icons/weather/wind.svg');

export interface WeatherCardProps {
  data: any;
}

export default class WeatherCard extends React.Component<WeatherCardProps, {}> {
  getCity = () => {
    const { data } = this.props;
    return data != null ? data.city : 'Weather info is unavailable';
  };

  getDescription = () => {
    const { data } = this.props;

    if (data != null) {
      const { timeUnit, daily } = data;
      const { description } = daily.current;

      const date = new Date();
      const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      const dayIndex = date.getDay() === 0 ? daysShort.length - 1 : date.getDay();

      return `${daysShort[dayIndex]}, ${getActualTime(timeUnit)} ${TimeUnit[
        timeUnit
      ].toUpperCase()}, ${description}`;
    }

    return null;
  };

  public render() {
    const { data } = this.props;

    const current = data != null ? data.daily.current : null;

    const city = this.getCity();
    const description = this.getDescription();

    const windIconStyle = {
      opacity: opacity.light.disabledIcon,
    };

    return (
      <Card title={city} secondaryText={description} largeTitle>
        {data != null && (
          <div>
            <InfoContainer>
              <Temperature>
                {current.temp}
                <TemperatureDeg>&deg;{current.tempUnit}</TemperatureDeg>
              </Temperature>
              <TemperatureIcon src={current.icon} />
            </InfoContainer>
            <ExtraInfoContainer>
              <ExtraInfo>
                <ExtraInfoIcon src={precipitationIcon} />
                <ExtraInfoText>{current.precipitation}% Precipitation</ExtraInfoText>
              </ExtraInfo>
              <ExtraInfo>
                <ExtraInfoIcon src={windIcon} style={windIconStyle} />
                <ExtraInfoText>{current.windSpeed} Winds</ExtraInfoText>
              </ExtraInfo>
            </ExtraInfoContainer>
          </div>
        )}
        {data == null && (
          <ErrorContainer>
            Check your internet connection or your settings. City name is probably incorrect.
          </ErrorContainer>
        )}
      </Card>
    );
  }
}
