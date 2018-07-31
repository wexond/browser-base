import React from 'react';
import GlobalStore from '../../../global-store';

import colors from '../../../shared/defaults/colors';
import Button from '../../../shared/components/Button';
import Slider from '../../../shared/components/Slider';
import opacity from '../../../shared/defaults/opacity';
import { ButtonType, SliderType } from '../../../shared/enums';
import { formatTime, getDayIndex } from '../../../shared/utils/time';
import WeatherForecast from '../../models/weather-forecast';
import { formatDescription } from '../../utils/weather-card';

import * as Card from '../../../shared/components/Card';

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
  ActionsContainer,
} from './styles';

import ForecastItem from './ForecastItem';
import { capitalizeWord } from '../../../shared/utils/strings';
import WeatherWeeklyItem from '../../models/weather-weekly-item';

const precipitationIcon = require('../../../shared/icons/weather/precipitation.png');
const windIcon = require('../../../shared/icons/weather/wind.svg');

export interface IProps {
  data: WeatherForecast;
}

export interface IState {
  dailyForecastIndex: number;
  forecastHeight: number;
}

export default class WeatherCard extends React.Component<IProps, IState> {
  public state: IState = {
    dailyForecastIndex: 0,
    forecastHeight: 0,
  };

  public forecastContainer: HTMLDivElement;

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
    const dictionary = GlobalStore.dictionary;

    const expanded = forecastHeight > 0;
    const description = data && formatDescription(data, dailyForecastIndex);
    const current = data && data.daily[dailyForecastIndex];

    const windIconStyle = {
      opacity: opacity.light.disabledIcon,
    };

    const sliderStyle = {
      width: 'calc(100% - 64px)',
      margin: '32px auto 0px auto',
    };

    const sliderTicks = [];

    if (data != null) {
      for (let i = 0; i < data.daily.length; i++) {
        sliderTicks.push(formatTime(data.daily[i].date, data.timeUnit, false));
      }
    }

    return (
      <Card.Root>
        <Card.Header>
          <Card.Title large>
            {(data && capitalizeWord(data.city)) || 'Weather info is unavailable'}
          </Card.Title>
          <Card.SecondaryText largeTop>
            {data && description}
            {!data
              && 'Check your internet connection or your settings. City name is probably incorrect.'}
          </Card.SecondaryText>
        </Card.Header>
        {data && (
          <Card.Content>
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
                <ExtraInfoText>
                  {current.precipitation}% {dictionary.newTab.precipitation}
                </ExtraInfoText>
              </ExtraInfo>
              <ExtraInfo>
                <ExtraInfoIcon src={windIcon} style={windIconStyle} />
                <ExtraInfoText>
                  {current.winds}
                  {` ${data.windsUnit}`} {dictionary.newTab.winds}
                </ExtraInfoText>
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
            <ForecastContainer innerRef={r => (this.forecastContainer = r)} height={forecastHeight}>
              {data.weekly.map((day: WeatherWeeklyItem, key: any) => {
                const dayName = GlobalStore.dictionary.dateAndTime.days[getDayIndex(day.date)];
                return <ForecastItem data={day} dayName={dayName} key={key} />;
              })}
            </ForecastContainer>
            <ActionsContainer expanded={expanded}>
              <Button
                foreground={colors.blue['500']}
                type={ButtonType.Text}
                onClick={this.onExpandButtonClick}
                style={Object.assign({}, Card.ActionButtonStyle, { marginLeft: 0 })}
              >
                {(!expanded && dictionary.general.expand.toUpperCase())
                  || dictionary.general.collapse.toUpperCase()}
              </Button>
            </ActionsContainer>
          </Card.Content>
        )}
      </Card.Root>
    );
  }
}
