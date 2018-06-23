import React from 'react';

import Card from '../../../shared/components/Card';

import { Temperature, InfoContainer, TemperatureIcon } from './styles';
import { TemperatureUnit } from '../../../shared/enums';

export interface WeatherCardProps {
  city?: string;
  info?: string;
  temperature?: string;
  temperatureUnit?: TemperatureUnit;
}

export default class WeatherCard extends React.Component<WeatherCardProps, {}> {
  public static defaultProps = {
    temperatureUnit: TemperatureUnit.Celsius,
  };

  public render() {
    const { city, info, temperature } = this.props;

    return (
      <Card title={city} secondaryText={info} largeTitle>
        <InfoContainer>
          <Temperature>{temperature}&deg;C</Temperature>
          <TemperatureIcon src="https://img7.downloadapk.net/7/b7/9e012d_0.png" />
        </InfoContainer>
      </Card>
    );
  }
}
