import React from 'react';

import colors from '../../../shared/defaults/colors';
import Button from '../../../shared/components/Button';
import opacity from '../../../shared/defaults/opacity';
import { TimeUnit, ButtonType } from '../../../shared/enums';
import { getActualTime, getDay } from '../../../shared/utils/time';

import {
  Card,
  CardHeader,
  CardHeaderText,
  CardTitle,
  CardSecondaryText,
  CardContent,
  CardActions,
  CardActionButtonStyle,
} from '../../../shared/components/Card';

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
  ForecastContainer,
} from './styles';

import ForecastItem from './ForecastItem';

const precipitationIcon = require('../../../shared/icons/weather/precipitation.png');
const windIcon = require('../../../shared/icons/weather/wind.svg');

export interface Props {
  data: any;
}

export interface State {
  expanded: boolean;
}

export default class WeatherCard extends React.Component<Props, State> {
  public state: State = {
    expanded: false,
  };

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

      return `${getDay(daysShort, date)}, ${getActualTime(timeUnit)} ${TimeUnit[
        timeUnit
      ].toUpperCase()}, ${description}`;
    }

    return null;
  };

  getDayName = (date: any) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return getDay(days, date);
  };

  onExpandButtonClick = () => {
    const { expanded } = this.state;

    this.setState({
      expanded: !expanded,
    });
  };

  public render() {
    const { data } = this.props;
    const { expanded } = this.state;

    const current = data != null ? data.daily.current : null;
    const week = data != null ? data.week : null;

    const city = this.getCity();
    const description = this.getDescription();

    const windIconStyle = {
      opacity: opacity.light.disabledIcon,
    };

    const cardActionsStyle = {
      borderTop: '1px solid rgba(0,0,0,0.12)',
      marginTop: expanded ? 16 : 8,
    };

    return (
      <Card>
        <CardHeader>
          <CardHeaderText>
            <CardTitle large>{city}</CardTitle>
            <CardSecondaryText largeTop>{description}</CardSecondaryText>
          </CardHeaderText>
        </CardHeader>
        <CardContent>
          {data != null && (
            <React.Fragment>
              <InfoContainer>
                <Temperature>
                  {current.temp}
                  <TemperatureDeg>&deg;{data.tempUnit}</TemperatureDeg>
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
              <ForecastContainer expanded={expanded}>
                {data.week.map((day: any, key: any) => {
                  const dayName = this.getDayName(day.date);
                  return <ForecastItem data={day} dayName={dayName} key={key} />;
                })}
              </ForecastContainer>
              <CardActions style={cardActionsStyle}>
                <Button
                  foreground={colors.blue['500']}
                  type={ButtonType.Text}
                  onClick={this.onExpandButtonClick}
                  style={Object.assign({}, CardActionButtonStyle, { marginLeft: 0 })}
                >
                  {(!expanded && 'EXPAND') || 'COLLAPSE'}
                </Button>
              </CardActions>
            </React.Fragment>
          )}
          {data == null && (
            <ErrorContainer>
              Check your internet connection or your settings. City name is probably incorrect.
            </ErrorContainer>
          )}
        </CardContent>
      </Card>
    );
  }
}
