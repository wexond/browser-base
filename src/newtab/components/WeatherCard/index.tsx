import React from 'react';

import colors from '../../../shared/defaults/colors';
import Button from '../../../shared/components/Button';
import Slider from '../../../shared/components/Slider';
import opacity from '../../../shared/defaults/opacity';
import { TimeUnit, ButtonType, SliderType } from '../../../shared/enums';
import { getTime, getDay } from '../../../shared/utils/time';

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
  dailyForecastIndex: number;
  forecastHeight: number;
}

export default class WeatherCard extends React.Component<Props, State> {
  public state: State = {
    dailyForecastIndex: 0,
    forecastHeight: 0,
  };

  public forecastContainer: HTMLDivElement;

  getCity = () => {
    const { data } = this.props;
    return data != null ? data.city : 'Weather info is unavailable';
  };

  getDescription = () => {
    const { dailyForecastIndex } = this.state;
    const { data } = this.props;

    if (data != null) {
      const { timeUnit, daily } = data;

      const { description, date } = daily[dailyForecastIndex];

      const currentDate = new Date();
      const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      return `${getDay(daysShort, currentDate)}, ${getTime(date, timeUnit)}, ${description}`;
    }

    return null;
  };

  getDayName = (date: any) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return getDay(days, date);
  };

  onExpandButtonClick = () => {
    const { forecastHeight } = this.state;
    const expanded = forecastHeight > 0;

    this.setState({
      forecastHeight: expanded ? 0 : this.forecastContainer.scrollHeight,
    });
  };

  onSliderChange = (index: any) => {
    this.setState({
      dailyForecastIndex: index,
    });
  };

  public render() {
    const { data } = this.props;
    const { dailyForecastIndex, forecastHeight } = this.state;

    const expanded = forecastHeight > 0;

    const current = data != null && data.daily[dailyForecastIndex];
    const week = data != null && data.week;

    const city = this.getCity();
    const description = this.getDescription();

    const windIconStyle = {
      opacity: opacity.light.disabledIcon,
    };

    const cardActionsStyle = {
      borderTop: '1px solid rgba(0,0,0,0.12)',
      marginTop: expanded ? 16 : 8,
    };

    const sliderStyle = {
      width: 'calc(100% - 64px)',
      margin: '32px auto 0px auto',
    };

    const sliderTicks = [];

    if (data != null) {
      for (let i = 0; i < data.daily.length; i++) {
        sliderTicks.push(getTime(data.daily[i].date, data.timeUnit, false));
      }
    }

    return (
      <Card>
        <CardHeader>
          <CardHeaderText>
            <CardTitle large>{city}</CardTitle>
            <CardSecondaryText largeTop>
              {data != null && description}
              {data == null
                && 'Check your internet connection or your settings. City name is probably incorrect.'}
            </CardSecondaryText>
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
              <Slider
                onChange={this.onSliderChange}
                type={SliderType.Discrete}
                color="#000"
                ticks={sliderTicks}
                style={sliderStyle}
                showTicksLabels
              />
              <ForecastContainer
                innerRef={r => (this.forecastContainer = r)}
                height={forecastHeight}
              >
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
        </CardContent>
      </Card>
    );
  }
}
