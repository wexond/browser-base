import React from 'react';

import { TemperatureUnit, TimeUnit } from '../../../shared/enums';
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

    const windIconStyle = {
      opacity: opacity.light.disabledIcon,
    };

    return (
      <Card title={city} secondaryText={description} largeTitle>
        {data != null && (
          <div>
            <InfoContainer>
              <Temperature>
                {data.temp}
                <TemperatureDeg>&deg;{data.tempUnit}</TemperatureDeg>
              </Temperature>
              <TemperatureIcon src={data.icon} />
            </InfoContainer>
            <ExtraInfoContainer>
              <ExtraInfo>
                <ExtraInfoIcon src={precipitationIcon} />
                <ExtraInfoText>{data.precipitation}% Precipitation</ExtraInfoText>
              </ExtraInfo>
              <ExtraInfo>
                <ExtraInfoIcon src={windIcon} style={windIconStyle} />
                <ExtraInfoText>{data.windSpeed} Winds</ExtraInfoText>
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
